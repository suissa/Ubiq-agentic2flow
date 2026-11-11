const IDENT = "[A-Za-z_][A-Za-z0-9_]*";
const NODE = new RegExp("^\\s*node\\s+(" + IDENT + ")\\s*$");
const EDGE = new RegExp("^\\s*(" + IDENT + ")\\s*->\\s*(.+?)\\s*$");
const DEST = new RegExp("^" + IDENT + "$");

export function parse2Flow(source) {
  const workflowMatch = source.match(/workflow\\s+([A-Za-z_][A-Za-z0-9_]*)\\s*\\{/);
  if (!workflowMatch) throw new Error("Expected workflow <Name> {");
  const nodes = [];
  const edges = [];
  const body = source.slice(workflowMatch.index + workflowMatch[0].length);
  if (!body.includes("}")) throw new Error("Unclosed workflow block");
  for (const [index, raw] of body.split("\\n").entries()) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line || line === "}") continue;
    const node = line.match(NODE);
    if (node) { nodes.push(node[1]); continue; }
    const edge = line.match(EDGE);
    if (edge) {
      const from = edge[1], rhs = edge[2].trim();
      const destinations = rhs.startsWith("[") && rhs.endsWith("]")
        ? rhs.slice(1, -1).split(",").map(s => s.trim())
        : [rhs];
      if (!destinations.length || destinations.some(d => !DEST.test(d)))
        throw new Error("Invalid edge destination at line " + (index + 1) + ": " + rhs);
      edges.push({ from, to: destinations, parallel: destinations.length > 1 });
      continue;
    }
    throw new Error("Unsupported 2Flow syntax at line " + (index + 1) + ": " + line);
  }
  if (!nodes.length) throw new Error("Workflow must declare at least one node");
  const names = new Set(nodes);
  if (names.size !== nodes.length) throw new Error("Duplicate node declaration");
  for (const edge of edges) {
    if (!names.has(edge.from)) throw new Error("Unknown edge source: " + edge.from);
    for (const target of edge.to) if (!names.has(target)) throw new Error("Unknown edge target: " + target);
  }
  return { name: workflowMatch[1], nodes, edges };
}

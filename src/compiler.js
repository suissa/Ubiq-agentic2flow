import { parse2Flow } from "./parser.js";
import { generators } from "./generators.js";
export function compile2Flow(source, target) {
  const flow = parse2Flow(source);
  if (target === "all") return Object.fromEntries(Object.entries(generators).map(([name, gen]) => [name, gen(flow)]));
  const generator = generators[target];
  if (!generator) throw new Error("Unknown target: " + target);
  return { [target]: generator(flow) };
}

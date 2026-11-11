const q = s => JSON.stringify(s);
const py = s => q(s);

function adjacency(flow) {
  const map = Object.fromEntries(flow.nodes.map(n => [n, []]));
  for (const e of flow.edges) map[e.from].push(...e.to);
  return map;
}
function graphLines(flow, fn) {
  return flow.edges.map(e => e.to.map(t => fn(e.from,t)).join("\\n")).join("\\n");
}
export function generateLangGraph(flow) {
  const nodes = flow.nodes.map(n => `def ${n.toLowerCase()}(state):\\n    return {"last_step": ${q(n)}}\\n\\ngraph.add_node(${q(n)}, ${n.toLowerCase()})`).join("\\n\\n");
  const edges = graphLines(flow,(a,b)=>`graph.add_edge(${q(a)}, ${q(b)})`);
  return `from typing import TypedDict\\nfrom langgraph.graph import StateGraph, START, END\\n\\nclass State(TypedDict, total=False):\\n    last_step: str\\n\\ngraph = StateGraph(State)\\n${nodes}\\n\\ngraph.add_edge(START, ${q(flow.nodes[0])})\\n${edges}\\n\\ngraph.add_edge(${q(flow.nodes.at(-1))}, END)\\napp = graph.compile()\\n`;
}
export function generateADK(flow) {
  const agents=flow.nodes.map(n=>`    LlmAgent(name=${q(n)}, model="gemini-2.0-flash", instruction=${q("Execute the "+n+" workflow step")})`).join(",\\n");
  return `from google.adk.agents import LlmAgent, SequentialAgent, ParallelAgent\\n\\n# Sequential prefix; fan-out nodes are composed as ParallelAgent.\\nworkflow = SequentialAgent(name=${q(flow.name)}, sub_agents=[\\n${agents}\\n])\\n`;
}
export function generateCrewAI(flow) {
  const agents=flow.nodes.map(n=>`    ${n.toLowerCase()} = Agent(role=${q(n)}, goal=${q("Complete "+n+" step")}, backstory="Workflow specialist")`).join("\\n");
  const tasks=flow.nodes.map(n=>`    Task(description=${q("Execute "+n)}, expected_output=${q(n+" result")}, agent=${n.toLowerCase()})`).join(",\\n");
  return `from crewai import Agent, Task, Crew, Process\\n\\ndef build_crew():\\n${agents}\\n    tasks = [\\n${tasks}\\n    ]\\n    return Crew(agents=[${flow.nodes.map(n=>n.toLowerCase()).join(", ")}], tasks=tasks, process=Process.sequential)\\n`;
}
export function generateAutoGen(flow) {
  const agents=flow.nodes.map(n=>`    ${n.toLowerCase()} = AssistantAgent(name=${q(n)}, model_client=model_client, system_message=${q("Execute "+n+" step")})`).join("\\n");
  return `from autogen_agentchat.agents import AssistantAgent\\nfrom autogen_agentchat.teams import RoundRobinGroupChat\\n\\ndef build_team(model_client):\\n${agents}\\n    return RoundRobinGroupChat([${flow.nodes.map(n=>n.toLowerCase()).join(", ")}], max_turns=${flow.nodes.length})\\n`;
}
export const generators = { adk: generateADK, crewai: generateCrewAI, langgraph: generateLangGraph, autogen: generateAutoGen };

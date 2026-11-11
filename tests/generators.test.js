import test from "node:test";
import assert from "node:assert/strict";
import { parse2Flow } from "../src/parser.js";
import { generators } from "../src/generators.js";
const flow=parse2Flow("workflow Demo {\\nnode Alpha\\nnode Beta\\nAlpha -> Beta\\n}");
test("ADK generator emits agent declarations",()=>assert.match(generators.adk(flow),/LlmAgent/));
test("CrewAI generator emits Agent and Task",()=>{const s=generators.crewai(flow);assert.match(s,/Agent/);assert.match(s,/Task/);});
test("LangGraph generator emits StateGraph and edges",()=>{const s=generators.langgraph(flow);assert.match(s,/StateGraph/);assert.match(s,/add_edge/);});
test("AutoGen generator emits agents and team",()=>{const s=generators.autogen(flow);assert.match(s,/AssistantAgent/);assert.match(s,/RoundRobinGroupChat/);});

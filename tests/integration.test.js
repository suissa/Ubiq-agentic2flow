import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { compile2Flow } from "../src/compiler.js";
const source=await readFile(new URL("../examples/supplier-to-marketing-customer.2flow",import.meta.url),"utf8");
test("full business graph compiles to all four frameworks",()=>{
 const outputs=compile2Flow(source,"all");
 assert.deepEqual(Object.keys(outputs).sort(),["adk","autogen","crewai","langgraph"]);
 for(const code of Object.values(outputs)) assert.ok(code.length>100);
});
test("LangGraph output preserves parallel Sales fan-out",()=>{
 const code=compile2Flow(source,"langgraph").langgraph;
 assert.match(code,/add_edge\("Sales", "Marketing"\)/);
 assert.match(code,/add_edge\("Sales", "Customer"\)/);
});

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parse2Flow } from "../src/parser.js";
const fixture = await readFile(new URL("../examples/supplier-to-marketing-customer.2flow", import.meta.url), "utf8");
test("parses named nodes and linear/parallel edges", () => {
 const f=parse2Flow(fixture);
 assert.deepEqual(f.nodes,["Supplier","Stock","Financial","Accounting","Sales","Marketing","Customer"]);
 assert.deepEqual(f.edges.at(-1),{from:"Sales",to:["Marketing","Customer"],parallel:true});
});
test("rejects undeclared edge target",()=>assert.throws(()=>parse2Flow("workflow X {\\nnode A\\nA -> B\\n}"),/Unknown edge target/));
test("rejects duplicate nodes",()=>assert.throws(()=>parse2Flow("workflow X {\\nnode A\\nnode A\\n}"),/Duplicate/));

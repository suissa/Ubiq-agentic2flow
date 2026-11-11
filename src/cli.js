#!/usr/bin/env node
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { compile2Flow } from "./compiler.js";
const [command, input, ...args] = process.argv.slice(2);
const arg = name => args[args.indexOf(name)+1];
if (!command || !input) { console.error("Usage: ubiq2flow <check|generate> <file.2flow> [--target name] [--out dir]"); process.exit(2); }
try {
  const source = await readFile(input, "utf8");
  if (command === "check") { compile2Flow(source, "all"); console.log("2Flow valid"); }
  else if (command === "generate") {
    const target = arg("--target") || "all", out = arg("--out") || "generated";
    const generated = compile2Flow(source, target);
    await mkdir(out, {recursive:true});
    for (const [name, content] of Object.entries(generated)) {
      const ext = name === "langgraph" || name === "adk" || name === "crewai" || name === "autogen" ? ".py" : ".txt";
      await writeFile(`${out}/${name}${ext}`, content);
    }
    console.log("Generated: " + Object.keys(generated).join(", "));
  } else throw new Error("Unknown command: " + command);
} catch (error) { console.error(error.message); process.exit(1); }

# Google ADK adapter

## What is ADK?

Google Agent Development Kit (ADK) is a framework for building, composing and running AI agents. It provides agent abstractions, tools, session/state facilities and workflow agents for deterministic orchestration.

## Workflow model

- **LlmAgent**: model-backed agent with instructions and tools.
- **SequentialAgent**: executes sub-agents in order.
- **ParallelAgent**: executes branches concurrently.
- **LoopAgent**: repeats a sub-agent sequence until a termination condition or iteration limit.
- Tool functions expose capabilities to agents; state/session mechanisms carry data between steps.

## 2Flow mapping

| 2Flow | ADK |
|---|---|
| agent | LlmAgent |
| sequential edges | SequentialAgent |
| parallel/fork | ParallelAgent |
| cycle/loop | LoopAgent (with explicit limit/exit policy) |
| tool | FunctionTool / supported tool wrapper |
| workflow state | session state / output keys |

Conditional graph routing that cannot be represented directly by a built-in workflow agent requires a custom BaseAgent implementation or explicit dispatcher.

## Generated project

The adapter should generate Python agent definitions, tool modules, workflow composition, configuration and runnable entry point. Keep model credentials in environment variables; never emit secrets into generated source.

## Usage (planned)

```sh
ubiq2flow generate workflow.2flow --target adk --out generated/adk
cd generated/adk
python -m pip install -r requirements.txt
python main.py
```

## Coverage

This directory documents the target mapping. Check the root README and adapter tests for implementation status; unsupported constructs must fail validation or be marked as requiring a custom runtime node.

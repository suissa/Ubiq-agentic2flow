# LangGraph adapter

## What is LangGraph?

LangGraph is a graph-based orchestration runtime for stateful, long-running agent applications. A workflow is modeled as a **StateGraph** with typed state, nodes, edges and routing functions. It supports persistence/checkpoints, streaming, interrupts and human-in-the-loop patterns.

## Workflow model

- **State**: shared typed data passed between nodes.
- **Node**: function or runnable that reads state and returns updates.
- **Edge**: transition between nodes.
- **Conditional edge**: routing function selects the next node.
- **Cycle**: ordinary graph edges can loop; termination is controlled by routing logic.
- **Parallel execution**: fan-out/fan-in edges with state reducers.
- **Checkpointer**: persistence across steps and resumable execution.
- **Interrupts**: pause execution for human input/approval.

## 2Flow mapping

| 2Flow | LangGraph |
|---|---|
| workflow state | State schema / TypedDict |
| agent/task | graph node |
| `A -> B` | add_edge |
| conditional edge | add_conditional_edges |
| loop | cycle + exit route |
| parallel/fork/join | fan-out/fan-in + reducers |
| human approval | interrupt / Command |
| END | END |

## Generated project

The adapter should generate state definitions, agent/node functions, graph builder, routing functions, optional checkpointer setup and a runnable example. It should make compile-time graph validation precede graph construction.

## Usage (planned)

```sh
ubiq2flow generate workflow.2flow --target langgraph --out generated/langgraph
cd generated/langgraph
python -m pip install -r requirements.txt
python main.py
```

## Coverage

LangGraph is the closest target for general directed graphs and loops. Runtime-specific state reducers, checkpointing and interrupts still need explicit adapter configuration.

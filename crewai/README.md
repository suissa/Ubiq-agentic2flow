# CrewAI adapter

## What is CrewAI?

CrewAI is a framework for orchestrating role-based AI agents. **Agents** have roles, goals, backstories, tools and model configuration; **Tasks** describe work, expected output and assignment; a **Crew** groups agents and tasks into a process.

## Workflow model

- **Agent**: role-oriented worker with tools and optional delegation.
- **Task**: unit of work, assigned to an agent, with expected output/context.
- **Crew**: coordinates tasks and agents.
- **Process.sequential**: executes tasks in order.
- **Process.hierarchical**: delegates planning/assignment to a manager agent.
- Task context and outputs provide data flow; kickoff inputs parameterize execution.

CrewAI is task/process-oriented rather than a general arbitrary state graph. Complex conditional cycles may require a Flow, explicit routers, or custom Python orchestration.

## 2Flow mapping

| 2Flow | CrewAI |
|---|---|
| agent | Agent |
| task | Task |
| linear graph | Crew with sequential process |
| manager/delegation | hierarchical process |
| state/context | task context, kickoff inputs, Flow state |
| conditions/cycles | CrewAI Flow/router or generated custom orchestration |

## Generated project

The adapter should generate agent/task declarations, crew composition, Flow glue for branching, configuration and a runnable entry point. Secrets belong in environment variables.

## Usage (planned)

```sh
ubiq2flow generate workflow.2flow --target crewai --out generated/crewai
cd generated/crewai
python -m pip install -r requirements.txt
python main.py
```

## Coverage

Not every graph is naturally a Crew. The generator must preserve semantics with Flow/custom orchestration or reject unsupported constructs explicitly.

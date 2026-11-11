# AutoGen adapter

## What is AutoGen?

Microsoft AutoGen is a framework/ecosystem for building applications with collaborating agents. Agent conversations, teams, message routing, handoffs and termination conditions are central to its orchestration model. API details differ between AutoGen generations; generated projects must pin and target a specific supported package/version.

## Workflow model

- **Agent**: assistant or specialized participant with instructions and tools.
- **Team**: group of agents with a coordination strategy.
- **RoundRobinGroupChat**: participants take turns.
- **SelectorGroupChat**: selects the next speaker dynamically.
- **Swarm**: agents hand off control to one another.
- **Termination condition**: ends a team run based on message count, text, or custom logic.
- **Tools**: callable functions exposed to agents.

## 2Flow mapping

| 2Flow | AutoGen |
|---|---|
| agent | AssistantAgent |
| sequential collaboration | team / explicit agent turns |
| dynamic routing | SelectorGroupChat or Swarm handoff |
| conditional exit | termination condition |
| tool | registered function/tool |
| state | messages and application-managed state |

Arbitrary graph state and deterministic loops may need a custom orchestration layer around a team.

## Generated project

The adapter should generate agent/tool declarations, team configuration, termination logic, orchestration and a runnable entry point. Pin AutoGen package versions and avoid mixing APIs from different generations.

## Usage (planned)

```sh
ubiq2flow generate workflow.2flow --target autogen --out generated/autogen
cd generated/autogen
python -m pip install -r requirements.txt
python main.py
```

## Coverage

AutoGen is conversation/team-oriented. Preserve 2Flow graph semantics with explicit handoffs or custom orchestration; unsupported mappings must be surfaced rather than hidden.

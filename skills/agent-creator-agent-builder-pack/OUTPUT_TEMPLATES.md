# Output Templates

## Prompt only

Use when the user only needs a copy-ready agent prompt.

Required sections:

- Agent mission.
- Scope and non-goals.
- Inputs and source rules.
- Workflow.
- Tool rules.
- Output format.
- Safety and escalation rules.
- Quality checklist.

Schema: `schemas/output-template.schema.json`.

## Requirements doc

Use when the user needs agent requirements before implementation.

Required sections:

- Verified requirements.
- Assumptions.
- Agent mission.
- Scope and boundaries.
- Inputs and trusted context.
- Related shared team skills and routing.
- Tools and permissions.
- Output requirements.
- Quality checklist.
- Human-in-the-loop and escalations.

Schema: `schemas/agent-requirements.schema.json`.

## Full agent pack

Required artefacts:

- `README.md`
- `AGENT_REQUIREMENTS.md`
- `AGENT_SYSTEM_PROMPT.md`
- `TOOL_AND_PERMISSION_MATRIX.md`
- `OUTPUT_TEMPLATES.md`
- `ROUTING_AND_HANDOFF.md`
- `QUALITY_CHECKLIST.md`
- `FILE_MANIFEST.md`
- Supporting `references/`, `templates/`, and optional scripts.

## Agent Builder spec pack

Required artefacts:

- `README.md`
- `AGENT_BUILDER_SPEC.md`
- `PHASED_BUILD_PLAN.md`
- `AGENT_REQUIREMENTS.md`
- `AGENT_SYSTEM_PROMPT.md`
- `TOOL_AND_PERMISSION_MATRIX.md`
- `ROUTING_AND_HANDOFF.md`
- `OUTPUT_TEMPLATES.md`
- `QUALITY_CHECKLIST.md`
- `FILE_MANIFEST.md`
- `BUILDER_IMPORT_PROMPT.md`
- `business-context.md`
- `references/`
- `templates/`
- `schemas/`
- `memory/`
- `validation/`
- Recommended `examples/`, `fixtures/`, `scripts/`, `tests/`, and `rollout/`.

Schema: `schemas/agent-builder-spec.schema.json`.

## Routing review

Use this format:

```markdown
## Value

## Risk

## Next step

## Routing decision

## Evidence used

## Specialist handoff

## Human-review gates
```

## Validation notes

Every reusable output should have a template or a documented reason why a template is unnecessary. Structured outputs should align with the matching schema.

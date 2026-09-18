# Routing Decisions

## Active routing decisions

| Decision | Source | Applies when | Review trigger | Status |
|---|---|---|---|---|
| Keep Agent Creator for Agent Builder spec packs | Current pack | User asks for Agent Builder-ready output, Builder import, prompt-size limit, zip handoff, or phased build | `agent-creator` scope changes | Active |
| Route installable ChatGPT skill creation to skill-creator unless narrower LightSpeed skill creator applies | Current agent-creator source | User expects an installable skill package | Skill availability or platform rules change | Active |

## No hidden commitments

Routing decisions are review notes, not automatic future actions.

## Validator

Checked by `scripts/validate-memory-hygiene.py`.

---
name: lightspeed-project-memory-manager
description: Use when a LightSpeed project needs durable project-state updates, decision logging, assumption tracking, open-loop management, or validation of what should and should not be saved as memory.
---

# LS Project Memory

## Purpose

Maintain clean, durable LightSpeed project state, decision logs, assumption registers, change logs, open-loop registers, progress summaries, and reusable defaults without storing one-off or unapproved facts.

## Shared LightSpeed lifecycle contract

Use the current user request as the highest-priority source. Then use current conversation context, attached files, existing project-state records, existing skill files, references, templates, examples, and memory defaults in that order.

Do not persist unapproved assumptions as facts. Prefer recommending updates over silent durable changes unless the user clearly asked to save them.

## Request shapes

Use this skill for requests like:

- "Update project memory with the approved decision and open loops."
- "Clean up stale project state and assumptions."
- "What should we save from this planning session?"

Success means returning a clear project-state summary, proposed memory updates, stale items, approval needs, and downstream implications.

## Workflow

1. Read `references/memory-policy.md`, `references/project-state-rules.md`, and `references/source-priority.md`.
2. Separate:
   - facts
   - assumptions
   - decisions
   - open loops
   - stale items to remove
   - reusable defaults
3. Use `templates/project-state.md`, `templates/decision-log.md`, `templates/assumption-register.md`, and `templates/open-loop-register.md`.
4. Recommend updates rather than silently applying them unless explicit save/update behaviour is requested.
5. Flag approval needs whenever the durable state would materially change.

## Output contract

Return:

1. current project-state summary
2. proposed memory updates
3. facts
4. assumptions
5. decisions
6. open loops
7. stale items to remove
8. approval needed
9. downstream skill implications

## Boundaries

Do not:

- store sensitive client data unnecessarily
- persist unapproved assumptions as facts
- override the current user request with old memory
- save temporary notes, completed todos, or stale observations
- silently update memory without approval where approval is expected

## Supporting Files

- `references/memory-policy.md` — what should and should not be saved.
- `references/project-state-rules.md` — project-state structure rules.
- `references/source-priority.md` — source priority for durable truth.
- `references/cross-skill-routing.md` — downstream routing rules.
- `memory/defaults/lightspeed-delivery-defaults.md` — durable defaults example.
- `templates/project-state.md` — project-state template.
- `templates/decision-log.md` — decision log template.
- `templates/assumption-register.md` — assumption register template.
- `templates/open-loop-register.md` — open-loop register template.
- `schemas/project-state.schema.json` — project-state shape.
- `schemas/decision-log.schema.json` — decision-log shape.
- `schemas/assumption-register.schema.json` — assumption-register shape.
- `schemas/open-loop.schema.json` — open-loop shape.
- `examples/project-state-example.md` — sample state output.
- `tests/fixtures/memory-cases.md` — manual validation cases.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

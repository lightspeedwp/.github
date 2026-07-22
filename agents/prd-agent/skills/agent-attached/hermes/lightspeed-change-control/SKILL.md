---
name: lightspeed-change-control
description: Use when a LightSpeed project has a change request, stakeholder feedback, technical blocker, QA-driven change, timeline shift, or post-approval adjustment that needs impact analysis across PRD, estimates, dependencies, QA, and approvals.
---

# LS Change Control

## Purpose

Assess change requests against approved PRDs, estimates, delivery plans, QA plans, release plans, and project state. This skill should make the impact visible without silently absorbing the change into baseline scope.

## Shared LightSpeed lifecycle contract

Use the current user request as the highest-priority source. Then use current conversation context, attached files, existing project-state records, existing skill files, references, templates, examples, and memory defaults in that order.

Do not treat informal feedback as approved change. Keep approval requirements explicit.

## Request shapes

Use this skill for requests like:

- "What impact does this stakeholder change have on the PRD and estimate?"
- "Assess this QA-driven scope adjustment."
- "We need to know whether this change affects delivery, QA, or approval."

Success means showing the change type, the evidence for it, the likely impacts, and the safest next step before implementation proceeds.

## Workflow

1. Read `references/change-control-rules.md`, `references/scope-impact-rubric.md`, `references/estimate-impact-rules.md`, and `references/qa-impact-rules.md`.
2. Confirm the source of the change and whether it is approved, proposed, or still informal.
3. Classify the change type.
4. Assess:
   - scope impact
   - estimate impact
   - timeline or dependency impact
   - QA impact
   - approval requirement
5. Use `templates/change-request-assessment.md` for the main output.
6. Use `templates/prd-delta.md` when the PRD needs a structured delta view.
7. Use `templates/approval-needed.md` when the key outcome is a gated decision rather than immediate incorporation.

## Output contract

Return:

1. change summary
2. change type
3. confirmed source
4. scope impact
5. estimate impact
6. timeline or dependency impact
7. QA impact
8. approval requirement
9. PRD update recommendation
10. task update recommendation
11. recommended next skill

## Boundaries

Do not:

- accept or reject commercial scope alone
- silently update the PRD
- hide estimate or QA impact
- treat informal feedback as approved change
- create implementation tasks unless routed to `lightspeed-delivery-planner`

## Supporting Files

- `references/change-control-rules.md` — change-control workflow.
- `references/scope-impact-rubric.md` — how to classify scope impact.
- `references/estimate-impact-rules.md` — estimate implications.
- `references/qa-impact-rules.md` — QA implications.
- `references/cross-skill-routing.md` — downstream repair or approval paths.
- `templates/change-request-assessment.md` — main assessment structure.
- `templates/prd-delta.md` — PRD delta structure.
- `templates/approval-needed.md` — approval escalation structure.
- `schemas/change-request.schema.json` — change-request shape.
- `schemas/prd-delta.schema.json` — PRD delta shape.
- `examples/change-request-examples.md` — sample change scenarios.
- `tests/fixtures/change-cases.md` — manual validation cases.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

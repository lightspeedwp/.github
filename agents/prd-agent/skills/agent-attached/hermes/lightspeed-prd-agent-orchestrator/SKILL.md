---
name: lightspeed-prd-agent-orchestrator
description: Use when a LightSpeed project request needs lifecycle routing, evidence-readiness triage, next-skill selection, or project-state update recommendations from messy intake, existing PRDs, QA findings, change requests, or launch context.
---

# LS Lifecycle Router

## Purpose

Route LightSpeed project work to the narrowest useful next skill. This skill should classify project stage, assess evidence readiness, surface missing inputs, and recommend the safest next action without trying to produce the full downstream specialist deliverable itself.

Keep the skill independently useful. If another specialist skill is a better fit, hand off cleanly instead of doing partial specialist work.

## Shared LightSpeed lifecycle contract

Use the current user request as the highest-priority source. Then use current conversation context, attached files, existing project-state records, existing skill files, references, templates, examples, and memory defaults in that order.

Do not invent facts, approval status, estimates, deadlines, client commitments, source evidence, QA results, or launch readiness. Mark assumptions explicitly.

If another specialist skill is better suited, return a concise handoff with:

- recommended primary skill
- optional supporting skill
- reason
- required inputs
- expected output
- current blockers

Use one primary downstream skill and at most one supporting skill.

When project state is available, read it first. When project state should change, recommend an update rather than silently rewriting durable memory unless the user explicitly asks.

Prefer small, composable outputs over mega-documents. Preserve evidence labels: confirmed, inferred, assumed, missing.

## Request shapes

Use this skill for requests like:

- "Here are rough notes, a repo, and a few client comments — what should happen next?"
- "We already have a PRD. Are we ready for estimating or do we need more work first?"
- "QA has surfaced a batch of issues. Which LightSpeed skill should handle the next step?"

Success means returning a reliable route card that names the project stage, the strongest evidence, the missing evidence, the best primary skill, and the safest next action.

## Workflow

1. Read `references/project-lifecycle.md` to identify the likely lifecycle stage.
2. Read `references/source-priority.md` to rank the available evidence.
3. If routing trade-offs matter, read `references/cross-skill-routing.md`.
4. Classify the request into one of these broad states:
   - new or messy intake
   - research and clarification
   - PRD drafting or update
   - estimation readiness
   - delivery planning
   - review or approval
   - change control
   - QA planning or QA triage
   - release handoff or export
   - memory or project-state maintenance
5. Separate evidence into confirmed, inferred, assumed, and missing.
6. Decide whether the user needs:
   - direct routing only
   - a project-state update recommendation
   - a handoff to one primary skill plus one optional supporting skill
7. Use `templates/route-card.md` for routing-first outputs and `templates/handoff-card.md` when the main value is the specialist handoff.
8. If the request can be answered directly without routing, give the narrow answer and still note the next skill only when it materially helps.

## Output contract

Return:

1. project stage
2. confirmed evidence
3. missing evidence
4. recommended primary skill
5. optional supporting skill
6. reason
7. expected output
8. project-state update recommendation
9. safest next action

Keep the response concise and decision-oriented.

## Boundaries

Do not:

- write full PRDs
- create full estimates
- generate complete QA plans
- perform deep project research
- triage every QA finding
- silently update memory
- assume connector access

## Supporting Files

- `references/project-lifecycle.md` — lifecycle stages and routing cues.
- `references/cross-skill-routing.md` — when to hand off and to which skill.
- `references/source-priority.md` — evidence ranking and confidence rules.
- `templates/route-card.md` — concise routing output.
- `templates/handoff-card.md` — structured specialist handoff.
- `schemas/project-state.schema.json` — shared project-state shape.
- `schemas/route-card.schema.json` — expected routing payload fields.
- `examples/routing-scenarios.md` — realistic routing examples.
- `tests/fixtures/routing-scenarios.md` — scenario set for manual validation.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

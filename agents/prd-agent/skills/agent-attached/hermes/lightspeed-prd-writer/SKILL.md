---
name: lightspeed-prd-writer
description: Use when a LightSpeed request needs a new PRD, a PRD update, scope clarification, requirements shaping, user stories, acceptance criteria, goals, non-goals, or downstream-ready requirement changes grounded in approved evidence.
---

# LS PRD Writer

## Purpose

Create or update LightSpeed project PRDs from intake records, research briefs, approved decisions, current project state, and scoped requirements. The PRD should be evidence-led, explicit about uncertainty, and ready for review, downstream planning, and eventual estimation.

## Shared LightSpeed lifecycle contract

Use the current user request as the highest-priority source. Then use current conversation context, attached files, existing project-state records, existing skill files, references, templates, examples, and memory defaults in that order.

Do not invent client commitments, budgets, dates, or technical promises. Mark assumptions explicitly and separate approved scope from proposed change.

## Request shapes

Use this skill for requests like:

- "Turn this intake and research pack into a proper LightSpeed PRD."
- "Update the PRD for this new scope change without losing what was already approved."
- "Draft requirements, user stories, and acceptance criteria from the available project evidence."

Success means producing a structured PRD or PRD delta that clearly separates facts, assumptions, risks, and unresolved questions.

## Workflow

1. Read `references/prd-rules.md` first.
2. Read `references/prd-section-guidance.md` when deciding what belongs in each section.
3. Check `references/source-priority.md` before elevating evidence into confirmed scope.
4. Use `templates/prd.md` for full PRDs.
5. Use `templates/prd-update.md` and `templates/prd-delta.md` when updating an existing PRD.
6. Build the document in this order:
   - title and status
   - evidence basis
   - goals and non-goals
   - scope
   - users or personas
   - requirements
   - user stories
   - acceptance criteria
   - risks
   - assumptions
   - open questions
   - downstream handoff notes
7. If the request is really about estimate impact, QA impact, or task planning, keep the PRD change concise and route the downstream work.
8. In update mode, explicitly separate unchanged approved scope from changed or proposed scope.

## Output contract

Return:

1. PRD title and status
2. evidence basis
3. goals
4. non-goals
5. scope
6. users/personas
7. requirements
8. user stories
9. acceptance criteria
10. risks
11. assumptions
12. open questions
13. downstream handoff notes

## Update mode

When updating an existing PRD, separate:

- unchanged approved scope
- changed scope
- new assumptions
- unresolved questions
- required approval
- estimate impact flag
- QA impact flag

## Boundaries

Do not:

- estimate effort unless routed to `lightspeed-estimation-planner`
- create detailed task plans unless routed to `lightspeed-delivery-planner`
- approve scope or sign-off
- invent client commitments, budgets, dates, or technical promises
- silently absorb unapproved change requests

## Supporting Files

- `references/prd-rules.md` — overall PRD quality bar.
- `references/prd-section-guidance.md` — how to populate each section.
- `references/source-priority.md` — evidence handling rules.
- `references/cross-skill-routing.md` — when to route to estimation, delivery, review, or change control.
- `templates/prd.md` — full PRD structure.
- `templates/prd-update.md` — PRD update structure.
- `templates/prd-delta.md` — scoped change view.
- `schemas/prd.schema.json` — full PRD payload shape.
- `schemas/prd-delta.schema.json` — PRD delta shape.
- `examples/good-prd.md` — concise model example.
- `examples/prd-update-example.md` — update example.
- `tests/fixtures/prd-cases.md` — manual validation cases.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

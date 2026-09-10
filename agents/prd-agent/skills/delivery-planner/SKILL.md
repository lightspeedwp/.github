---
name: lightspeed-delivery-planner
description: Use when an approved LightSpeed PRD or estimate needs to be turned into epics, features, tasks, sequencing, dependency mapping, acceptance coverage, or tracker-ready issue drafts for implementation planning.
---

# LS Delivery Planner

## Purpose

Convert approved scope into delivery plans, implementation sequencing, task packs, dependencies, acceptance coverage, and tracker-ready issue drafts. This skill should operationalise the plan without silently rewriting scope.

## Shared LightSpeed lifecycle contract

Use the current user request as the highest-priority source. Then use current conversation context, attached files, existing project-state records, existing skill files, references, templates, examples, and memory defaults in that order.

Do not hide unresolved dependencies, and do not pretend implementation planning can fix unclear scope by itself.

## Request shapes

Use this skill for requests like:

- "Turn this PRD into an implementation-ready delivery plan."
- "Break this approved scope into epics, features, and tasks."
- "Draft GitHub, Asana, or Linear-ready issues from this project plan."

Success means producing a delivery structure that can guide real implementation without losing acceptance criteria, blockers, or sequencing logic.

## Workflow

1. Read `references/task-breakdown-rules.md`, `references/implementation-sequencing.md`, and `references/dependency-rules.md`.
2. Confirm the PRD or scope is approved enough for tasking. If not, route back to PRD writing, review, or change control.
3. Break work into:
   - delivery summary
   - epics
   - features
   - tasks
   - dependencies
   - acceptance coverage
   - QA notes
   - sequencing
4. Suggest owners only when role-level assignment helps; do not invent named assignees.
5. Use templates for the main output and only add issue drafts where requested.

## Output contract

Return:

1. delivery summary
2. epics
3. features
4. tasks
5. dependencies
6. acceptance coverage
7. QA notes
8. sequencing
9. owner suggestions
10. issue drafts where requested
11. blockers
12. recommended next skill

## Boundaries

Do not:

- rewrite PRD scope without routing to `lightspeed-prd-writer`
- estimate effort unless routed to `lightspeed-estimation-planner`
- approve go/no-go decisions
- create live GitHub, Asana, or Linear issues unless explicitly requested and tools are available
- hide unresolved dependencies

## Supporting Files

- `references/task-breakdown-rules.md` — how to split scope into delivery work.
- `references/implementation-sequencing.md` — sequencing logic and waves.
- `references/dependency-rules.md` — dependency mapping rules.
- `references/cross-skill-routing.md` — when to route back to PRD, estimates, or QA planning.
- `templates/task-pack.md` — task pack structure.
- `templates/implementation-plan.md` — main delivery plan structure.
- `templates/github-issue.md` — GitHub issue format.
- `templates/asana-task.md` — Asana task format.
- `schemas/task-pack.schema.json` — task pack shape.
- `schemas/implementation-plan.schema.json` — implementation-plan shape.
- `schemas/issue-draft.schema.json` — issue-draft shape.
- `examples/task-breakdown-example.md` — task breakdown example.
- `examples/implementation-plan-example.md` — implementation plan example.
- `tests/fixtures/delivery-cases.md` — manual validation cases.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

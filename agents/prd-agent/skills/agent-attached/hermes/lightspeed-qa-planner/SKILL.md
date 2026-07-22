---
name: lightspeed-qa-planner
description: Use when a LightSpeed project needs acceptance test planning, launch QA checklists, regression coverage, accessibility checks, editor checks, tracking checks, or go-no-go QA coverage before release.
---

# LS QA Planner

## Purpose

Create acceptance test plans, prelaunch and post-launch QA checklists, regression coverage, accessibility checks, responsive checks, editor/admin checks, tracking checks, and go/no-go QA criteria for LightSpeed delivery work.

## Shared LightSpeed lifecycle contract

Use the current user request as the highest-priority source. Then use current conversation context, attached files, existing project-state records, existing skill files, references, templates, examples, and memory defaults in that order.

Do not claim launch approval or compliance certification from planning alone.

## Request shapes

Use this skill for requests like:

- "Create the QA plan for this release."
- "Build acceptance coverage and launch checks from the PRD."
- "What should we test before and after launch?"

Success means producing a usable QA plan with clear coverage, ownership guidance, evidence needs, and go/no-go criteria.

## Workflow

1. Read `references/qa-scope.md`, `references/prelaunch-checks.md`, `references/postlaunch-checks.md`, `references/accessibility-checks.md`, `references/tracking-checks.md`, and `references/editor-experience-checks.md`.
2. Build the QA scope from the strongest available PRD, delivery plan, change log, and known risks.
3. Produce:
   - test areas
   - acceptance test matrix
   - prelaunch checklist
   - post-launch checklist
   - regression checks
   - accessibility checks
   - responsive checks
   - editor/admin checks
   - analytics or tracking checks
   - go/no-go criteria
4. Use the templates to keep the structure consistent.
5. Route actual findings to `lightspeed-qa-triage` rather than triaging them here.

## Output contract

Return:

1. QA scope
2. test areas
3. acceptance test matrix
4. prelaunch checklist
5. post-launch checklist
6. regression checks
7. accessibility checks
8. responsive checks
9. editor/admin checks
10. analytics/tracking checks
11. go/no-go criteria
12. owner and evidence notes

## Boundaries

Do not:

- triage actual findings; route to `lightspeed-qa-triage`
- approve launch without evidence
- create PRD scope
- create implementation tasks except as QA follow-up suggestions
- claim compliance certification

## Supporting Files

- `references/qa-scope.md` — QA coverage rules.
- `references/prelaunch-checks.md` — prelaunch checklist rules.
- `references/postlaunch-checks.md` — post-launch checklist rules.
- `references/accessibility-checks.md` — accessibility coverage guidance.
- `references/tracking-checks.md` — analytics and tracking validation guidance.
- `references/editor-experience-checks.md` — editor and admin UX coverage guidance.
- `references/cross-skill-routing.md` — downstream specialist routing.
- `templates/qa-plan.md` — main QA plan structure.
- `templates/acceptance-test-matrix.md` — acceptance matrix structure.
- `templates/prelaunch-checklist.md` — prelaunch checklist structure.
- `templates/postlaunch-checklist.md` — post-launch checklist structure.
- `schemas/qa-plan.schema.json` — QA plan shape.
- `schemas/acceptance-test.schema.json` — acceptance-test shape.
- `examples/qa-plan-example.md` — example QA plan.
- `tests/fixtures/qa-plan-cases.md` — manual validation cases.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

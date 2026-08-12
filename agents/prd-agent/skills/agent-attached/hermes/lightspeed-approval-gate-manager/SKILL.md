---
name: lightspeed-approval-gate-manager
description: Use when a LightSpeed project needs approval checkpoints, sign-off checklists, go-no-go criteria, decision logs, or stakeholder-ready approval packs across intake, PRD, estimate, delivery, QA, launch, or change control.
---

# LS Approval Gates

## Purpose

Manage approval checkpoints and go-no-go criteria across the LightSpeed project lifecycle. This skill should surface readiness, blockers, conditions, and decision requirements without implying approval already exists.

## Shared LightSpeed lifecycle contract

Use the current user request as the highest-priority source. Then use current conversation context, attached files, existing project-state records, existing skill files, references, templates, examples, and memory defaults in that order.

Do not invent approval status, commercial sign-off, or launch clearance. Mark conditions explicitly.

## Request shapes

Use this skill for requests like:

- "Are we ready for PRD approval or do we still have blockers?"
- "Create a go/no-go checklist for launch approval."
- "Turn this review state into a stakeholder decision log and next step."

Success means returning a clear approval stage, what artefacts are under review, what is blocked, what is conditional, and what should happen next.

## Workflow

1. Read `references/approval-gates.md`, `references/go-no-go-rules.md`, and `references/decision-log-rules.md`.
2. Identify the approval stage and the artefacts under review.
3. Separate:
   - required approvers or roles
   - readiness status
   - blockers
   - conditions
   - decision log entry
4. Use `templates/approval-checklist.md` for checkpoints, `templates/go-no-go-pack.md` for launch or release decisions, and `templates/decision-log.md` for durable decision records.
5. Route to review, QA, or change control when approval depends on unresolved specialist work.

## Output contract

Return:

1. approval stage
2. artefacts under review
3. required approvers or roles
4. readiness status
5. blockers
6. conditions
7. decision log entry
8. next action
9. recommended next skill

## Boundaries

Do not:

- imply approval has been granted without evidence
- make legal, financial, or client commitments
- replace PRD review, QA planning, or release handoff
- approve work with unresolved blockers unless clearly marked as conditional

## Supporting Files

- `references/approval-gates.md` — approval checkpoints by lifecycle stage.
- `references/go-no-go-rules.md` — launch and release decision rules.
- `references/decision-log-rules.md` — decision logging rules.
- `references/cross-skill-routing.md` — downstream repair and approval paths.
- `templates/approval-checklist.md` — approval checklist format.
- `templates/go-no-go-pack.md` — go/no-go pack format.
- `templates/decision-log.md` — decision log entry format.
- `schemas/approval-record.schema.json` — approval record shape.
- `schemas/decision-log.schema.json` — decision log shape.
- `examples/approval-gate-examples.md` — sample approval scenarios.
- `tests/fixtures/approval-cases.md` — manual validation cases.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

---
name: lightspeed-project-status-reporter
description: Use when a LightSpeed project needs an internal or client-safe status update drawn from PRD state, delivery progress, blockers, decisions, changes, QA findings, approvals, or release readiness.
---

# LS Status Reporter

## Purpose

Generate internal and client-safe project status updates from grounded project evidence. This skill should summarise progress, blockers, risks, decisions, and upcoming work without inventing certainty or exposing internal-only detail when a client-safe summary is requested.

## Shared LightSpeed lifecycle contract

Use the current user request as the highest-priority source. Then use current conversation context, attached files, existing project-state records, existing skill files, references, templates, examples, and memory defaults in that order.

Do not invent progress, dates, approvals, or launch readiness.

## Request shapes

Use this skill for requests like:

- "Write this week's internal project update."
- "Create a client-safe status summary from the current delivery state."
- "Summarise blockers, risks, and next actions for stakeholders."

Success means producing a concise, evidence-led status update that fits the requested audience and highlights what matters now.

## Workflow

1. Read `references/status-rules.md`, `references/client-safe-boundaries.md`, and `references/source-priority.md`.
2. Identify the audience: internal, client-safe, or mixed.
3. Summarise:
   - current phase
   - completed since last update
   - in progress work
   - blockers
   - risks
   - decisions needed
   - upcoming work
4. Use `templates/internal-status.md`, `templates/client-status.md`, or `templates/blocker-summary.md` as appropriate.
5. Flag whether PRD, change, or QA updates are needed rather than silently blending those updates into the status note.

## Output contract

Return:

1. status headline
2. current phase
3. completed since last update
4. in progress
5. blockers
6. risks
7. decisions needed
8. upcoming work
9. PRD/change/QA update flags
10. client-safe version where requested

## Boundaries

Do not:

- invent progress, blockers, dates, or approvals
- expose internal-only risks in client-safe summaries unless requested
- rewrite project scope
- replace change control or QA triage
- claim launch readiness without evidence

## Supporting Files

- `references/status-rules.md` — status reporting rules.
- `references/client-safe-boundaries.md` — what to omit or soften for client-safe outputs.
- `references/source-priority.md` — source ranking rules.
- `references/cross-skill-routing.md` — downstream routing paths.
- `templates/internal-status.md` — internal update structure.
- `templates/client-status.md` — client-safe update structure.
- `templates/blocker-summary.md` — blocker-focused structure.
- `schemas/status-report.schema.json` — status output shape.
- `examples/status-reports.md` — example outputs.
- `tests/fixtures/status-cases.md` — manual validation cases.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

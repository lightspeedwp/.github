---
name: lightspeed-prd-reviewer
description: Use when a LightSpeed PRD, estimate, task pack, QA plan, change assessment, release pack, or project-state summary needs a readiness review for completeness, evidence quality, unsupported claims, gaps, or scope drift.
---

# LS PRD Reviewer

## Purpose

Review LightSpeed planning artefacts for readiness, evidence quality, unsupported claims, missing acceptance criteria, scope drift, weak assumptions, and practical trustworthiness. This skill should diagnose and prioritise issues rather than silently rewrite everything by default.

## Shared LightSpeed lifecycle contract

Use the current user request as the highest-priority source. Then use current conversation context, attached files, existing project-state records, existing skill files, references, templates, examples, and memory defaults in that order.

Do not approve work without showing evidence gaps and unresolved blockers.

## Request shapes

Use this skill for requests like:

- "Review this PRD and tell me if it is estimate-ready."
- "Audit this delivery plan for missing detail or weak assumptions."
- "Check this planning pack for unsupported claims and readiness."

Success means returning a clear verdict, the main blockers, the most important warnings, and the best next fix path.

## Workflow

1. Read `references/review-rubric.md`, `references/evidence-standards.md`, and `references/readiness-levels.md`.
2. Review the artefact against:
   - evidence strength
   - structural completeness
   - scope consistency
   - acceptance clarity
   - readiness for the claimed next step
3. Separate:
   - blocking issues
   - warnings
   - unsupported claims
   - missing evidence
   - recommended fixes
4. Use `templates/review-report.md` for the review and `templates/fix-list.md` for actionable repairs.
5. If the problem is mainly markdown or file integrity, route to the validator skills rather than overloading this review.

## Output contract

Return:

1. verdict: ready, partially ready, not ready
2. blocking issues
3. warnings
4. unsupported claims
5. missing evidence
6. scope or estimate risks
7. acceptance criteria gaps
8. recommended fixes
9. recommended next skill

## Boundaries

Do not:

- create the first PRD unless routed to `lightspeed-prd-writer`
- create estimates unless routed to `lightspeed-estimation-planner`
- perform low-level markdown linting if `markdown-content-validator` is more appropriate
- fix all issues silently unless the user asks for a rewrite
- approve work without listing evidence gaps

## Supporting Files

- `references/review-rubric.md` — main review criteria.
- `references/evidence-standards.md` — what counts as acceptable evidence.
- `references/readiness-levels.md` — ready vs partially ready vs not ready.
- `references/cross-skill-routing.md` — downstream repair paths.
- `templates/review-report.md` — review structure.
- `templates/fix-list.md` — repair list structure.
- `schemas/review-report.schema.json` — review output shape.
- `examples/review-report-example.md` — sample review.
- `tests/fixtures/review-cases.md` — manual validation set.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

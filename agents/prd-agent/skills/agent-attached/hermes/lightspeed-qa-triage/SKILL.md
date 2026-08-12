---
name: lightspeed-qa-triage
description: Use when a LightSpeed project has actual QA findings, defects, screenshots, accessibility issues, tracking problems, responsive issues, or launch blockers that need severity, priority, owner route, and retest guidance.
---

# LS QA Triage

## Purpose

Triage actual QA findings by severity, priority, owner route, launch-blocker status, evidence quality, and retest readiness. This skill should make defect handling clearer without pretending issues are fixed or root-caused when the evidence is weak.

## Shared LightSpeed lifecycle contract

Use the current user request as the highest-priority source. Then use current conversation context, attached files, existing project-state records, existing skill files, references, templates, examples, and memory defaults in that order.

Do not mark findings fixed without retest evidence.

## Request shapes

Use this skill for requests like:

- "Triage these QA findings for launch readiness."
- "Which of these issues are launch blockers?"
- "Turn this defect list into a severity-ranked triage output with retest steps."

Success means returning a practical triage result with severity, priority, evidence quality, likely owner, issue-draft readiness, and retest steps.

## Workflow

1. Read `references/qa-severity-rubric.md`, `references/finding-routing.md`, `references/launch-blocker-rules.md`, and `references/retest-rules.md`.
2. For each finding, assess:
   - severity
   - priority
   - launch blocker status
   - evidence quality
   - reproduction quality
   - expected vs actual behaviour
   - likely owner
3. Use `templates/qa-finding-triage.md` for the main output, `templates/retest-plan.md` for retest guidance, and `templates/issue-draft.md` when tracker-ready issue text is requested.
4. Route broader coverage planning back to `lightspeed-qa-planner` when the request is really about planned QA rather than findings.

## Output contract

Return:

1. finding summary
2. severity
3. priority
4. launch blocker: yes/no/unclear
5. evidence quality
6. reproduction steps
7. expected vs actual
8. likely owner
9. issue draft
10. retest steps
11. recommended next skill

## Boundaries

Do not:

- generate complete QA plans; route to `lightspeed-qa-planner`
- diagnose deep code causes without evidence
- mark issues fixed without retest evidence
- overstate accessibility compliance
- create live issues unless explicitly requested and tools are available

## Supporting Files

- `references/qa-severity-rubric.md` — severity and priority rules.
- `references/finding-routing.md` — owner-routing guidance.
- `references/launch-blocker-rules.md` — launch-blocker criteria.
- `references/retest-rules.md` — retest guidance.
- `references/cross-skill-routing.md` — downstream routing rules.
- `templates/qa-finding-triage.md` — triage output structure.
- `templates/retest-plan.md` — retest structure.
- `templates/issue-draft.md` — issue draft structure.
- `schemas/qa-finding.schema.json` — QA finding shape.
- `schemas/retest-plan.schema.json` — retest plan shape.
- `examples/qa-findings.md` — example findings.
- `tests/fixtures/qa-finding-cases.md` — manual validation cases.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

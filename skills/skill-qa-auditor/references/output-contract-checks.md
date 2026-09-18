# Output Contract Checks

A skill passes output QA when another teammate can reuse the output without guessing what it means.

## General Output Requirements

Check whether the skill defines:

- required headings or tables
- required labels such as confirmed, assumption, blocker or recommendation
- required owner, severity, priority or status fields where relevant
- expected level of detail
- copy-paste readiness for GitHub, Linear, Google Docs, Markdown or client communication
- whether citations, evidence links or source notes are required
- retest or approval notes where relevant

## Type-Specific Output Expectations

| Skill Type | Output Contract Should Include |
|---|---|
| Router | recommended route, reason, blockers, next prompt or handoff. |
| Orchestrator | ordered workflow, current phase, next route, approval gates. |
| Onboarding | only blocking missing defaults, captured defaults, next specialist route. |
| Intake | source inventory, confirmed facts, unconfirmed notes, gaps, evidence quality. |
| Handoff | recipient, readiness state, next actions, blockers, source links. |
| Assessor | score, evidence basis, risks, recommendations, confidence level. |
| Estimator | scope, assumptions, exclusions, confidence, pricing/effort caveats. |
| Generator | final artefact, usage notes, acceptance criteria or implementation notes. |
| Reviewer/Auditor | findings, severity, evidence, impact, fix recommendation, retest steps. |
| Planner | tasks, dependencies, owners or roles, sequencing, acceptance checks. |
| Formatter | clean transformed output and note of any meaning-preserving edits. |
| Tool workflow | actions taken, verified results, blocked actions, required manual steps. |

## Failure Signs

- Output is mostly prose with no reusable structure.
- Findings are not actionable.
- No distinction between facts and assumptions.
- No final recommendation.
- No next action.
- Output format changes significantly between similar runs.
- Skill claims files, tools or systems were changed without verification.

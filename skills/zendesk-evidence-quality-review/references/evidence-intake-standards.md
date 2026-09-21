# Evidence Intake Standards

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Use this reference when deciding whether the supplied material is enough to review a Zendesk support output safely.

## Acceptable evidence sources

- Zendesk ticket ID or URL that the current session can access.
- Pasted public or private ticket comments.
- Exported conversation thread text.
- Internal investigation notes with source labels.
- Customer or account context explicitly provided in the request.
- Linked support artefacts that the current session can access.
- Existing escalation, handoff, or knowledge draft supplied by the user.

## Weak evidence signals

- The draft references a ticket, but no ticket content is provided or accessible.
- The draft states impact, root cause, counts, timelines, owner, or customer commitment without source material.
- The draft uses phrases like "the data shows", "engineering confirmed", or "all customers" without evidence.
- The draft mixes customer reports, support interpretation, and confirmed facts without labels.
- The draft proposes a public workaround based on one unresolved or unstable case.

## Minimum evidence by output type

### Customer reply

Required minimum:

- Customer issue or request.
- Current confirmed status.
- What support can safely say now.
- Next support action or customer ask.

Review cautiously when missing:

- Proof of root cause.
- Approved refund, credit, exception, fix date, or policy position.
- Internal owner confirmation.

### Investigation

Required minimum:

- Timeline of relevant events.
- Reported symptoms.
- Confirmed observations.
- Tests or checks already completed.
- Open questions or next diagnostic step.

Review cautiously when missing:

- Reproduction steps.
- Logs, screenshots, account state, environment details, or product version.
- Evidence that distinguishes root cause from correlation.

### Escalation brief

Required minimum:

- Customer or account impact.
- Evidence summary.
- Attempted support steps.
- Current blocker.
- Target owner or team if known.
- Exact ask from the escalation owner.

Review cautiously when missing:

- Severity rationale.
- Urgency or business risk.
- Evidence that standard support handling is blocked.

### Handoff

Required minimum:

- Problem statement.
- Current status.
- What has already been tried.
- Important evidence links or extracts.
- Next owner or recommended owner.
- Exact next action.

Review cautiously when missing:

- Customer-facing commitments.
- Internal-only caveats.
- Open questions.

### Backlog report or trend summary

Required minimum:

- Time window.
- Filters or queue scope.
- Counts and comparison basis.
- Inclusion or exclusion logic.
- Confidence level.
- Operational next actions.

Review cautiously when missing:

- Raw counts or query basis.
- Explanation of whether findings are duplicate tickets, related patterns, or broader incidents.
- Evidence connecting support trend to product conclusion.

### Knowledge draft

Required minimum:

- Confirmed reusable issue or question.
- Confirmed cause, limitation, or workaround.
- Scope and exclusions.
- Caveats.
- Resolution status.
- Audience: public help centre or internal support only.

Review cautiously when missing:

- Stability of workaround.
- Evidence that more than one customer should follow the guidance.
- Legal, privacy, billing, or security approval when relevant.

## Evidence labels

Use these labels only when they match the supplied material:

- `Confirmed`: directly supported by accessible evidence.
- `Reported`: stated by the customer or another party, not independently verified.
- `Likely`: evidence supports a probable interpretation, but proof is incomplete.
- `Possible`: plausible but weakly supported.
- `Needs verification`: important but not yet evidenced.

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

# Routing Boundaries

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use this reference when this specialist must decide whether to continue reviewing, route to one obvious upstream workflow, or return to `zendesk-router-skill`.

## Operating rule

`zendesk-router-skill` owns knowledge of the full Zendesk skill network. This specialist owns only:

1. Its own after-output QA boundary.
2. Common upstream or adjacent handoffs needed when a QA request is not ready.
3. The point where an unclear request should return to `zendesk-router-skill`.

Do not turn this skill into a second router. Do not sequence complex Zendesk workflows. Do not perform upstream work that this skill is meant to review.

## Stay in this skill when

Continue with `zendesk-evidence-quality-review` only when all are true:

- A reviewable support artefact already exists.
- The user wants the artefact checked, pressure-tested, QA reviewed, or safely improved before sharing.
- Enough evidence is present to judge the draft without inventing case facts.
- The requested output is a QA review, targeted fix list, or evidence-safe edit pass.

Reviewable artefacts include:

- customer replies
- investigations
- escalation briefs
- internal handoffs
- backlog reports
- trend summaries
- knowledge drafts

## Route away before reviewing

If no reviewable artefact exists, do not create it inside this skill. Route to the smallest upstream workflow that creates or prepares the artefact. If the correct route is unclear, return to `zendesk-router-skill`.

Use these canonical route-away targets when the next step is obvious:

- `zendesk-triage-router`: first-pass classification, severity, priority, queue/status, owner/team, or workflow selection.
- `zendesk-evidence-collector`: missing ticket evidence, timeline reconstruction, proof, investigation, or case facts.
- `zendesk-case-readiness-check`: deciding whether the case is ready for a reply, escalation, handoff, knowledge draft, or report.
- `zendesk-draft-response`: creating a new customer-facing reply.
- `zendesk-customer-escalation`: creating a new escalation brief.
- `zendesk-handoff-prep`: creating a new internal handoff.
- `zendesk-create-knowledge`: creating a knowledge article or reusable knowledge draft.
- `zendesk-knowledge-candidate-review`: deciding whether a case, workaround, known issue, or repeated answer should become documentation.
- `zendesk-duplicate-pattern-review`: duplicate, related-case, repeated-pain, or incident-pattern classification.
- `zendesk-backlog-trend-analysis`: backlog, queue-health, SLA, ageing-risk, repeated-issue, or trend reports.
- `zendesk-customer-research`: customer/account context before replying, escalating, or assessing support risk.

Keep the handoff short: state why this skill should stop, name the one best upstream or adjacent workflow when obvious, and identify the smallest missing artefact or evidence needed.

## Return to the router when

Return to `zendesk-router-skill` when:

- The request is ambiguous and more than one workflow could own it.
- The user asks which Zendesk skill or workflow should handle something.
- The request combines triage, investigation, drafting, escalation, reporting, knowledge, duplicate review, customer research, or backlog analysis in a way that needs sequencing.
- The case starts from only a ticket ID, ticket URL, customer name, account name, issue summary, or pasted thread and no reviewable artefact exists.
- The agent is unsure whether the task is QA or another support operation.
- The needed workflow is outside this specialist's direct QA boundary and the next step is not obvious.

When returning to the router, do not guess the full chain. Say that the request should go back to `zendesk-router-skill` for workflow selection, and provide the short reason plus the smallest missing artefact or evidence needed.

## Interoperability note

Clear QA requests may invoke this skill directly. Unclear Zendesk-first intake should route through `zendesk-router-skill`. This skill should not perform the upstream work it is reviewing.

## Do not do this

- Do not maintain a full map of every Zendesk specialist skill inside this skill.
- Do not recommend multiple downstream skills unless the user explicitly asks for options and the handoff remains simple.
- Do not sequence complex workflows such as evidence collection -> escalation -> customer reply -> knowledge creation.
- Do not override `zendesk-router-skill` when the correct owner is unclear.
- Do not continue reviewing when the safer answer is to pause for evidence, artefact creation, or router selection.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

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

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

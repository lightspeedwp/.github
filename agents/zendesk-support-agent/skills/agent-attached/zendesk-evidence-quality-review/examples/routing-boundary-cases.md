# Routing Boundary Cases

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
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use these synthetic examples when the agent needs a concrete pattern for deciding whether this skill should review, route to one obvious upstream workflow, or return to `zendesk-router-skill`.

## Case 1: Review is appropriate

### User request

"Can you pressure-test this customer reply before I send it? Ticket evidence and draft are below."

### Correct action

Use `zendesk-evidence-quality-review`.

### Reason

A reviewable artefact exists, evidence is supplied, and the user is asking for QA before sending.

## Case 2: Route to evidence collection

### User request

"Zendesk #10421 looks broken. Tell me what happened and whether we caused it."

### Correct action

Route to `zendesk-evidence-collector`.

### Reason

The user needs ticket evidence, timeline reconstruction, proof, investigation, or case facts, not QA of an existing output.

### Safe response pattern

"This is not ready for evidence-quality review yet because there is no draft artefact to review. The next step is `zendesk-evidence-collector` to reconstruct the timeline and collect proof before any customer reply or escalation is judged."

## Case 3: Route to triage

### User request

"Where should this ticket go, what priority should it be, and who owns it?"

### Correct action

Route to `zendesk-triage-router`.

### Reason

The user needs first-pass classification, severity, priority, queue/status, owner/team, or workflow selection.

## Case 4: Route to drafting

### User request

"Write a reply to the customer saying we are looking into it."

### Correct action

Route to `zendesk-draft-response` if the case evidence is ready; otherwise return to `zendesk-router-skill` for workflow selection.

### Reason

The user is asking for first-draft creation, not evidence-quality review of an existing reply.

## Case 5: Route to case readiness

### User request

"Do we have enough to escalate this?"

### Correct action

Route to `zendesk-case-readiness-check`.

### Reason

The user is asking whether the case is ready for a downstream deliverable, not asking for a QA review of an existing escalation brief.

## Case 6: Route to escalation creation

### User request

"Create an escalation brief for engineering from this case."

### Correct action

Route to `zendesk-customer-escalation`.

### Reason

The user needs a new escalation brief created. This skill can review that brief afterwards.

## Case 7: Route to handoff creation

### User request

"Prepare a clean internal handoff for the support specialist."

### Correct action

Route to `zendesk-handoff-prep`.

### Reason

The user needs a new internal handoff created, not QA reviewed.

## Case 8: Route to knowledge creation

### User request

"Turn this resolved workaround into a help-centre article."

### Correct action

Route to `zendesk-create-knowledge` only if documentation-worthiness is already clear and evidence shows the resolution is stable and reusable. Otherwise route to `zendesk-knowledge-candidate-review`.

### Reason

The user needs knowledge creation or documentation-worthiness review, not QA of an existing knowledge draft.

## Case 9: Route to documentation-worthiness review

### User request

"Should this repeated workaround become a public article or stay internal?"

### Correct action

Route to `zendesk-knowledge-candidate-review`.

### Reason

The user is deciding whether the case, workaround, known issue, or repeated answer should become documentation.

## Case 10: Route to duplicate or pattern review

### User request

"Are these five customer tickets duplicates or part of a broader incident pattern?"

### Correct action

Route to `zendesk-duplicate-pattern-review`.

### Reason

The user needs duplicate, related-case, repeated-pain, or incident-pattern classification.

## Case 11: Route to backlog or trend analysis

### User request

"Give me this week's SLA and ageing-risk report for the queue."

### Correct action

Route to `zendesk-backlog-trend-analysis`.

### Reason

The user needs backlog, queue-health, SLA, ageing-risk, repeated-issue, or trend reporting created rather than QA reviewed.

## Case 12: Route to customer research

### User request

"Before we reply, what is the customer's recent support history and risk level?"

### Correct action

Route to `zendesk-customer-research`.

### Reason

The user needs customer/account context before replying, escalating, or assessing support risk.

## Case 13: Return to the router

### User request

"Here is a ticket ID. Work out what we should do next and draft whatever is needed."

### Correct action

Return to `zendesk-router-skill`.

### Reason

The request starts from intake, combines workflow selection and likely drafting, and has no reviewable artefact. This skill should not choose and sequence the full Zendesk workflow chain.

## Case 14: Review cautiously from supplied summary

### User request

"I cannot access Zendesk here, but based on my summary below, can you check this handoff?"

### Correct action

Use `zendesk-evidence-quality-review` cautiously if the handoff draft and summary are supplied.

### Reason

A reviewable artefact exists, but evidence is indirect. Label findings as based on the supplied summary and avoid treating the summary as confirmed Zendesk evidence.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

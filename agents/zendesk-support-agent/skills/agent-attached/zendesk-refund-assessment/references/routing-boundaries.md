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
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use this reference when a refund, credit, compensation, goodwill, or policy-exception case may overlap another Zendesk skill.

## Use `zendesk-refund-assessment`

Use this skill when the case materially involves one or more of these decision-sensitive questions:

- whether a refund, partial refund, service credit, account credit, compensation, goodwill gesture, make-good, or policy exception may be appropriate
- what policy, contract, help-center article, billing record, or prior support commitment applies
- whether support can safely draft a reply without confirming a final refund or compensation outcome
- whether approval is needed before offering anything financial or exception-based
- whether missing evidence makes a refund or compensation decision unsafe
- whether prior wording has created expectation, relationship, fairness, or precedent risk

## Do not use this skill

Route away when the main request is:

- a routine support reply with no refund, credit, compensation, goodwill, make-good, or exception logic
- a pure help-center, policy, or documentation grounding task without a decision assessment
- broad escalation packaging, owner handoff, incident routing, or formal approval brief beyond the refund decision
- customer-history research before any assessment can be made
- simple severity, priority, status, queue, or owner triage
- QA of an already drafted customer reply or escalation brief
- duplicate/pattern review, backlog analysis, knowledge article creation, or incident analysis

## Adjacent skill handoffs

### `zendesk-draft-response`

Use when the user mainly wants customer-facing wording. If a refund decision is not confirmed, this assessment should first decide whether a cautious reply can be drafted without overcommitting. Hand off with the safe boundary, for example: `draft an acknowledgement that says we are reviewing the request and avoids confirming refund eligibility`.

### `zendesk-help-center-grounding`

Use when the main blocker is policy, help-center, terms, cancellation, billing, or support-document alignment. If the skill is not present in the current workspace, route to the workspace's help-center grounding workflow or `zendesk-evidence-collector` with a specific ask to find documented refund policy evidence.

### `zendesk-customer-escalation`

Use when approval, commercial/legal/security/product decision-making, relationship risk, contractual concern, executive visibility, chargeback risk, or precedent risk requires a formal cross-functional decision package. This skill can identify the need to escalate, but should not become the full escalation brief unless explicitly asked and routed onward.

### `zendesk-evidence-quality-review`

Use after a near-final assessment, customer reply, exception note, or escalation brief exists and needs a risk review. This skill produces the first-pass assessment; evidence-quality review checks the output for unsupported claims, weak risk wording, or unsafe customer-facing phrasing.

### `zendesk-customer-research`

Use when the assessment depends mainly on account history, prior cases, prior compensation, renewal risk, customer tier, relationship owner context, or previous commitments across tickets. Return to refund assessment only after the customer context is available.

### `zendesk-triage-router`

Use when the request is first-pass classification, priority, queue routing, status guidance, severity, ownership, or basic support triage. If triage reveals refund or compensation logic, return to this skill for the decision-sensitive part.

### `zendesk-evidence-collector`

Use when the ticket evidence is weak, incomplete, not Zendesk-grounded, or missing minimum facts such as customer ask, billing state, policy basis, or prior commitments.

### `zendesk-router-skill`

Use when the request spans multiple Zendesk workflows and the primary deliverable is unclear. Return a short router note naming the refund/compensation issue, known facts, and why routing is ambiguous.

## Handoff payload

When routing away, pass a short payload:

```markdown
## Refund assessment handoff
- Case/ticket:
- Customer ask:
- Remedy type:
- Confirmed facts:
- Missing evidence:
- Policy basis found:
- Prior commitment risk:
- Approval/escalation trigger:
- Requested downstream output:
```

Keep the handoff neutral. Do not write as though a refund or compensation decision has already been approved unless it has.

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

# Evidence Pack Template

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

Use this template when returning evidence pack mode output for one confirmed Zendesk-centred support case.

Keep the output compact. Do not include sections that are empty unless the missing evidence itself is material. Replace placeholders with specific evidence, uncertainty, or `unknown`.

```md
# Zendesk Evidence Pack

## Case

- Ticket: <ticket id, ticket url, or best available identifier>
- Customer / account: <name if known, or unknown>
- Current state: <status, owner, priority, urgency, ageing or sla signal, or unknown>
- Likely workflow: <plain-language intent or canonical `zendesk-` workflow when recommending a route>
- Deliverable: <requested or inferred deliverable>

## Confirmed facts

- <fact grounded in Zendesk, supplied evidence, or named secondary source>

## Key chronology

- <date/time if available>: <customer statement, agent action, status change, blocker, or relevant update>

## Informed inferences

- <clearly labelled inference and why it follows from the facts>

## Missing or uncertain evidence

- <specific missing source, identifier, timestamp, customer detail, log, attachment, or decision needed>

## Readiness

- <ready | partially ready | not ready>
- Reason: <short reason tied to evidence sufficiency>

## Best next move

- Primary workflow: <canonical `zendesk-` workflow, continue in this skill, or return to `zendesk-router-skill`>
- Supporting workflow: <canonical `zendesk-` workflow or none>
- Immediate next action: <one concrete next action>

## Sources checked

- <source category>: <what it was used for and any access limitation>
```

## Customer or account search variant

Use this variant when the user gives a customer or account name and there is not yet one confirmed ticket.

```md
# Zendesk Evidence Pack

## Search target

- Customer / account: <name or search string>
- Object of work: <one customer | one account | related tickets | unknown>
- Likely workflow: <plain-language intent or canonical `zendesk-` workflow when recommending a route>
- Deliverable: <requested or inferred deliverable>

## Most relevant tickets

- <ticket id or url>: <one-line reason this is relevant; include current state if known>

## Confirmed facts

- <cross-ticket fact or search result fact>

## Informed inferences

- <clearly labelled inference, if any>

## Missing or uncertain evidence

- <why the correct ticket/customer cannot be confirmed, if applicable>

## Readiness

- <ready | partially ready | not ready>
- Reason: <short reason>

## Best next move

- Primary workflow: <canonical `zendesk-` workflow, continue in this skill, or return to `zendesk-router-skill`>
- Supporting workflow: <canonical `zendesk-` workflow or none>
- Immediate next action: <one concrete next action>

## Sources checked

- <source category>: <what it was used for and any access limitation>
```

## Use rules

- Use confirmed facts for sourced details only.
- Use informed inferences for probable conclusions that still need confirmation.
- Use missing or uncertain evidence for blockers, contradictions, connector limits, or unavailable Zendesk access.
- Recommend one primary workflow only, using a canonical `zendesk-` name when routing away.
- Do not add customer-facing wording unless the user explicitly asks for a reply draft.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

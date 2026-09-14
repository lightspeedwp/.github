# Report Intent Router

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

Use this reference when the user's request is vague, mixed, or could match several Zendesk reporting workflows.

## Route by user intent

| User intent | Primary output | Default scope | Notes |
|---|---|---|---|
| "How is the queue?" | Backlog health summary | Current open backlog | Focus on status mix, ageing, ownership, blockers, and next actions. |
| "What changed this week?" | Weekly support report | Last 7 days | Include created, solved, reopened, updated, and current open backlog where visible. |
| "Is this getting worse?" | Trend comparison | Current 7 days vs previous 7 days | Use matching filters for both windows. Mark comparison unavailable if either window cannot be queried. |
| "Any repeats?" | Repeated-theme review | Last 7 days unless stated | Classify as likely duplicate, related but distinct, repeated support pain, possible incident signal, or inconclusive. |
| "What needs attention today?" | Daily digest | Most recent operational window | Lead with urgent/ageing/unowned/blocked cases. |
| "What should we do next?" | Queue-risk check or mixed report | Current open backlog | Recommend support-owned actions only. |

## Mixed requests

When a request combines report types, produce one concise mixed operational report instead of several long reports. Use this order:

1. queue picture
2. material trend changes
3. highest-risk tickets or patterns
4. recommended support actions
5. evidence basis and gaps

## When to ask a question

Ask one clarification only when the missing scope changes the evidence query materially, such as an unknown brand, group, customer, or date range. Otherwise apply the defaults in `SKILL.md` and state them in the report.

## When to route away

Use a neighbouring skill instead when the user primarily asks for:

- a specific ticket investigation: `zendesk-evidence-collector`
- duplicate classification for named tickets: `zendesk-duplicate-pattern-review`
- one customer/account brief: `zendesk-customer-research`
- QA of an existing draft: `zendesk-evidence-quality-review`
- first-pass severity or owner triage for a single case: `zendesk-triage-router`

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

# Citation Ledger Schema

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

Use this reference when assigning source handles and building the `Source Coverage and Citation Key` section.

The ledger is the trust layer for the brief. It must make it clear what was checked, what was found, what could not be accessed, and which claims each source supports.

## Handle Families

Use these handle prefixes consistently:

| Prefix | Source family | Examples |
|---|---|---|
| `[Z#]` | Zendesk | ticket, organisation search, requester search, tag search, Zendesk export |
| `[E#]` | Email | Gmail thread, shared mailbox thread, pasted email chain |
| `[S#]` | Slack or chat | Slack channel search, thread, pasted internal chat |
| `[D#]` | Docs or knowledge | Google Drive doc, SOP, help-centre article, pasted project notes |
| `[P#]` | Project tools | Asana task, Linear issue, GitHub issue or PR |
| `[O#]` | Other systems | analytics, logs, billing, CMS, supplied external source |

Restart numbering inside each source family. Do not reuse the same handle for unrelated sources.

## Ledger Fields

Each ledger entry should answer these fields, even if the output line stays compact:

- `handle`: source handle, for example `[Z1]`
- `source_type`: Zendesk, email, chat, docs, project tools, or other
- `source_identifier`: ticket ID, search query, thread subject, document title, task ID, or supplied excerpt label
- `time_scope`: exact time window searched or `not time-bound`
- `status`: `relevant`, `no result`, `not relevant`, `unavailable`, or `not checked`
- `why_checked`: reason this source mattered for the research question
- `confidence_impact`: `raises`, `neutral`, `lowers`, or `blocks`
- `claims_supported`: short list of claim IDs or brief sections the source supports
- `limits`: missing access, stale source, partial excerpt, ambiguous identity, or other caveat

## Status Rules

Use `relevant` when the source directly supports at least one claim in the brief.

Use `no result` only when the source was actually searched successfully and returned no matching result.

Use `not relevant` when a source was opened or searched successfully but does not support the current customer, window, or research mode.

Use `unavailable` when the connector, permission, workspace, file, thread, ticket, or account access is missing. Never present unavailable access as a no-result search.

Use `not checked` when a source was intentionally skipped because it was outside scope, unlikely to add evidence, or unnecessary after stronger Zendesk evidence was sufficient.

## Claim Support Rules

Every synthesis claim in these sections needs at least one handle:

- `Current Support State`
- `Weekly View`
- `Key Themes and Trendlines`
- `Open Risks or Escalation Signals`
- `Recommended Reply Context`
- `Recommended Handoff` when the common handoff depends on evidence rather than user intent

Operational facts such as ticket status, owner, severity, queue, last update, SLA pressure, or customer commitment should be backed by Zendesk handles whenever Zendesk is available.

Non-Zendesk handles can support context, but they should not override Zendesk facts without surfacing the contradiction.

## Compact Output Pattern

Use compact output lines like this:

```md
- `[Z1] Zendesk organisation search for <customer>, <date range> - relevant - found 3 recent tickets and 1 still-open older blocker; supports Current Support State, Recent Zendesk Activity, Open Risks.`
- `[E1] Gmail search for <customer domain>, <date range> - unavailable - current user has no mailbox access; lowers confidence for prior commitments.`
- `[D1] Project handover doc - not checked - Zendesk evidence was sufficient and no delivery context was requested.`
```

## Quality Checks

Before final output:

- each handle used in the brief appears in the ledger
- each relevant ledger entry is cited at least once in the brief or is removed
- unavailable sources are not described as no-result searches
- major conclusions do not rely only on chat, docs, or project tools when Zendesk evidence is missing
- low or partial evidence lowers confidence rather than being smoothed over

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

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

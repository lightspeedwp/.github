# Client Site Context Templates

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

Use these templates when creating or updating workspace context files. Delete empty optional sections before saving.

## `index.md`

```markdown
# Client Site Context Index

| Client | Client ID | Sites | Status | Last Reviewed |
|---|---|---|---|---|
| Client Name | `client-slug` | `site-slug` | active | YYYY-MM-DD |
```

## `clients/client-slug/client.md`

```markdown
---
client_id: client-slug
canonical_name: Client Name
aliases: []
status: active
last_reviewed: YYYY-MM-DD
---

# Client Name

## Business Summary

One or two durable sentences about the organisation and why the website matters.

## Business Priorities

- **Priority:** Lead generation, ecommerce sales, bookings, subscriptions, donations, editorial reach, compliance, or similar.
  **Audit relevance:** How this should change future audit weighting.

## Primary Audiences

- Audience group.

## Markets

- Market or region when relevant to audits.

## Sites

| Site | Site ID | Role | Stable Domain |
|---|---|---|---|
| Site Name | `site-slug` | main website | example.com |

## Recurring Notes

| Note | Confidence | Source |
|---|---|---|
| Confirmed durable context note. | confirmed | user-provided |
```

## `clients/client-slug/sites/site-slug.md`

```markdown
---
site_id: site-slug
client_id: client-slug
canonical_name: Site Name
site_role: main website
stable_domain: example.com
last_reviewed: YYYY-MM-DD
---

# Site Name

## Platform

| Area | Value |
|---|---|
| CMS | WordPress |
| Ecommerce | WooCommerce |
| Theme or stack | LSXD / block theme / classic theme / custom / unknown |
| Hosting | Provider or durable hosting constraint when audit-relevant |

## Business Priorities

- **Priority:** Conversion, enquiries, bookings, subscriptions, editorial reach, or similar.
  **Audit relevance:** How future audits should weight findings.

## Constraints

| Constraint | Impact |
|---|---|
| Durable platform, hosting, legal, integration, or operational constraint. | Why future audits should know this. |

## Integrations

| Integration | Relevance |
|---|---|
| GA4, GTM, CRM, email platform, payment gateway, Wetu, booking engine, or similar. | Why auditors should consider it. |

## Recurring Notes

| Note | Confidence | Source |
|---|---|---|
| Confirmed durable site-level context. | confirmed | user-provided |
```

## `clients/client-slug/page-groups/site-slug.md`

```markdown
---
site_id: site-slug
client_id: client-slug
last_reviewed: YYYY-MM-DD

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

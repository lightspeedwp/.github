# Related Skills Routing

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
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

## Purpose

This file defines how `yoast-configuration` should cooperate with adjacent Yoast skills without duplicating their responsibilities.

## Related skills

### `yoast-auditor`

Use `yoast-auditor` for live WordPress-connected Yoast SEO audit and edit workflows.

Typical triggers:

- "audit this WordPress site's Yoast settings"
- "check these Yoast titles in admin"
- "update the meta descriptions"
- "set these taxonomies to noindex"
- "apply the approved metadata changes"
- "check Yoast schema output in WordPress"
- "review Yoast SEO data for these posts/products"
- "use the WordPress MCP/admin connector"

If the installed live-auditor skill uses a different slug, replace `yoast-auditor` with that exact installed slug in `SKILL.md`, this file, `references/file-routing-index.md`, and related tests.

## Boundary

`yoast-configuration` owns:

- configuration planning
- product capability comparison
- evidence interpretation
- settings export review
- rendered-output QA
- decision logs
- approval packs
- migration and redirect planning
- source-register/research-pack work
- remediation backlog creation

`yoast-auditor` owns:

- live WordPress admin inspection
- live Yoast field review
- approved Yoast admin edits
- content-level SEO review through WordPress
- live taxonomy metadata updates
- production/staging implementation
- before/after admin verification

## Handoff format

When routing from `yoast-configuration` to `yoast-auditor`, include:

| Field | Required | Notes |
|---|---|---|
| Site/client | Yes | Name, domain, or project identifier. |
| Environment | Yes | Production, staging, local, or unknown. |
| Access level | Yes | No access, screenshots, exported settings, WordPress admin, staging, codebase, Search Console, live crawl evidence, rendered source, or scanned documentation. |
| Evidence provided | Yes | Settings export, rendered output, crawl, screenshots, spreadsheet, approval queue, redirect map, etc. |
| Requested live action | Yes | What `yoast-auditor` should inspect or change. |
| Approval state | Yes | Proposed, approved, rejected, needs client approval, needs technical review, or unclear. |
| Affected fields/settings | Yes | Exact post/product/taxonomy/settings fields where known. |
| Risk level | Yes | Low, medium, high, launch-blocking, or unknown. |
| QA checks after change | Yes | Rendered title/meta, robots, canonical, sitemap, schema, breadcrumb, redirects, Search Console, etc. |
| Rollback/monitoring notes | If relevant | Required for migrations, redirects, noindex, canonical, template, batch, schema, and production changes. |

## Handoff template

```md
## Yoast Auditor Handoff

- Site/client:
- Environment:
- Access level:
- Evidence provided:
- Requested live action:
- Approval state:
- Risk level:
- Affected fields/settings:
- Post-change QA:
- Rollback/monitoring notes:
- Open blockers:
```

## Do not route when

Stay in `yoast-configuration` when the user only needs:

- a plan
- a report
- a template
- a decision pack
- a settings-export review
- a rendered-output QA report without WordPress access
- a source-register update
- a research pack
- a client-safe summary

## Safety notes

Do not present `yoast-configuration` as having completed live WordPress checks. If the evidence requires WordPress admin, staging, production, or connector access, label the current output as a handoff and route the live inspection or edit to `yoast-auditor`.

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

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

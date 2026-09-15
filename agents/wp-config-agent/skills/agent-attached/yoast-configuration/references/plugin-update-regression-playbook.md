# Yoast plugin-update regression playbook

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

Use this when planning or reviewing Yoast SEO Free, Yoast SEO Premium, Yoast WooCommerce SEO, Yoast SEO AI Plus, WordPress, WooCommerce, theme or SEO-adjacent plugin updates.

## Purpose

Prevent silent regressions in metadata, canonicals, indexation, sitemaps, robots rules, llms.txt, breadcrumbs, schema, WooCommerce product output and developer customisations after updates.

## Load with

- `references/state-comparison-playbook.md` for before/after comparison.
- `templates/yoast-regression-test-report.md` for reporting.
- `templates/yoast-acceptance-criteria.md` for approval gates.
- `references/developer-api-reference.md` when custom code touches Yoast APIs or filters.
- `references/current-verification-playbook.md` if product packaging, UI paths or API behaviour is current-sensitive.

## Pre-update baseline

Capture a lightweight baseline before updates:

1. Plugin versions: Yoast SEO, Premium, WooCommerce SEO, AI Plus and SEO-adjacent plugins.
2. WordPress and WooCommerce versions.
3. Theme and custom plugin version/branch.
4. Representative URLs: homepage, service page, post, category, author archive, product, variable product, product category, filtered URL, sitemap, robots.txt, llms.txt.
5. Rendered output: title, description, canonical, meta robots, schema, breadcrumbs, Open Graph, HTTP headers.
6. Settings export or copied settings where available.
7. Any known approved decisions: noindex rules, canonical overrides, schema customisations, product archive strategy.

## Regression risk areas

| Area | Watch for | Suggested owner |
|---|---|---|
| Metadata presenters | Missing or duplicated title/description/social tags | SEO/configuration owner |
| Canonicals | Changed canonical targets, missing canonicals, staging domains | SEO + developer |
| Meta robots | Unexpected noindex/nofollow/noarchive/max-snippet changes | SEO/configuration owner |
| XML sitemaps | Missing sitemap index, unexpected URL inclusion/exclusion | SEO/configuration owner |
| Robots and llms.txt | Changed generated output or manual override conflicts | SEO + developer |
| Schema graph | Missing graph pieces, changed entity IDs, broken Product data | SEO + developer |
| WooCommerce output | ProductGroup/Offer/availability/review changes | Ecommerce + developer |
| Breadcrumbs | Changed breadcrumb path or duplicate breadcrumb schema | SEO/configuration owner |
| Custom filters | Deprecated hooks, removed filters, plugin conflicts | Developer |
| AI metadata | Unapproved generated title/description changes | Content/SEO owner |

## Acceptance rule

A Yoast-related update is acceptable only when:

- Material outputs match the baseline or have an approved decision.
- Regressions are triaged with severity, owner and next action.
- Current-sensitive claims were verified from current sources.
- Developer customisations were tested in rendered output, not just code review.
- WooCommerce representative product types were checked when ecommerce is in scope.

## Stop conditions

Pause release or require explicit approval if:

- Important pages become `noindex`.
- Canonicals point to the wrong domain or URL set.
- Sitemaps lose important content types unexpectedly.
- Product schema disappears or materially changes on transactional product pages.
- Robots.txt blocks important sections unexpectedly.
- A deprecated Yoast API/filter is newly introduced.
- Source evidence is stale and the decision is commercially or technically sensitive.

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

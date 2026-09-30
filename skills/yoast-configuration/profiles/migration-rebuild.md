# Migration or rebuild profile

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

## Scope

Projects with URL changes, platform changes, domain changes, content consolidation, metadata migration, sitemap changes, and launch QA risk.

## Product posture

Yoast configuration must be aligned with redirects, canonicals, noindex, sitemaps, robots, schema, and Search Console validation.

## Load with

- `references/configuration-reference.md` for settings and output decisions.
- `references/configuration-playbooks.md` for broader scenario strategy.
- `references/qa-checklists.md` before launch or delivery.
- `references/source-register.md` when evidence or current product status matters.

## Configuration priorities

1. Confirm site representation and organisation/person identity.
2. Decide which content types and taxonomies deserve indexation.
3. Align titles, descriptions, canonicals, robots, sitemaps, breadcrumbs, social metadata, and schema.
4. Avoid duplicate archive bloat.
5. Validate rendered output on representative URLs.

## Risk controls

- Mark exact admin paths and product entitlements as `needs live verification`.
- Avoid noindex/canonical/sitemap contradictions.
- Do not use schema customisation to compensate for poor or missing source data.
- Do not treat schema validity as a promise of rich-result visibility.

## QA focus

- Homepage metadata, canonical, Open Graph, schema, sitemap inclusion.
- Representative page/post/archive/taxonomy output.
- Robots.txt, llms.txt if enabled, XML sitemap index and child sitemaps.
- Breadcrumb output where active.
- Any redirects, custom canonicals, noindex decisions, and developer customisations.

## Output recommendation

Use `templates/yoast-configuration-report.md` for setup, `templates/yoast-audit-report.md` for an existing site, and `templates/launch-qa-checklist.md` for launch or migration validation.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

# Client site intake

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

Use this when starting a Yoast setup, audit, QA review, or research-backed recommendation and the project context is incomplete.

## Minimum viable intake

1. Client/site name and live or staging URL.
2. Site type: business, local, publisher/blog, ecommerce catalogue, ecommerce transactional, multilingual, migration/rebuild, duplicate-content-heavy, poor-content-structure, or schema customisation.
3. Primary goals: lead generation, ecommerce, publishing, local visibility, migration safety, technical cleanup, content governance, or developer handoff.
4. Access level: no access, screenshots, exported Yoast settings, WordPress admin, staging, codebase, Search Console, live crawl, rendered source, or source documents.
5. Current Yoast products installed or proposed: Free, Premium, WooCommerce SEO, AI Plus, Local SEO, News SEO, Video SEO, or unknown.
6. Evidence available: settings exports, crawl output, sitemap URLs, robots.txt, llms.txt, rendered source, screenshots, Search Console, product data, content inventory, migration map.
7. Approval owner and intended output: internal recommendation, client report, developer handoff, QA checklist, research pack, or reusable defaults.

## Ask only if blocking

Ask a question only when the answer changes a recommendation. Otherwise state assumptions and proceed with safe defaults.

## Default assumptions when missing

- Treat exact Yoast admin paths as `needs live verification`.
- Treat product packaging and entitlements as `needs live verification`.
- Treat current source-register rows without accessed dates as research targets.
- Prefer conservative indexation decisions until content value is known.
- Require QA for any canonical, robots, sitemap, schema, redirect, or WooCommerce product-data change.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

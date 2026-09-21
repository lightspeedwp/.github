# QA Checklists

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
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Use these checks after configuration changes, launch changes, migration work or remediation.

## Rendered-output checks

- Page title renders as expected.
- Meta description renders as expected.
- Canonical tag is present and points to the approved URL.
- Robots directives match the approved decision.
- Schema JSON-LD is present where expected and valid enough for the intended use.
- Breadcrumb output matches visible navigation intent.
- Social metadata exists for key pages where required.

## Sitemap checks

- XML sitemap index loads.
- Important destination, tour, accommodation and guide URLs appear where expected.
- Noindex URLs are not listed unless there is a documented plugin behaviour reason.
- Redirected URLs are removed from submitted sitemap sets.
- Translated sitemaps are checked separately where relevant.

## Redirect checks

- Old URL responds with the intended status.
- Target URL is live and indexable where intended.
- No avoidable chains or loops exist.
- Canonical on the target does not contradict the redirect plan.
- Internal links are updated where practical.

## Taxonomy checks

- Strategic archives have useful intro copy.
- Thin archives are improved, consolidated or excluded from index.
- Archive title and description templates do not create duplicates.
- Destination and travel-style archives are sampled on mobile and desktop.

## Launch checks

- Robots rules allow intended crawling.
- Sitemap URLs are current.
- Key canonical tags are correct.
- Important redirects work.
- Tracking and Search Console evidence are separated from Yoast evidence.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

# Audit workflows

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
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

## Default audit order

1. Confirm target site, environment, access level and date of evidence.
2. Confirm Tour Operator core first: installed, active, versioned and using `tour`, `destination` and `accommodation` as the confirmed core model.
3. Load `references/content-model/core/post-types.json`, `taxonomies.json`, `relationships.json` and `source-map.md` before mapping content.
4. Confirm first-party extensions only after core state is clear.
5. Inspect Wetu Importer as an integration/sync layer unless source evidence proves owned structures.
6. Inspect Gravity Forms enquiry flows.
7. Inspect Yoast SEO settings, schema output, canonicals, sitemaps and breadcrumbs.
8. Inspect block-theme templates, query loops, patterns, archive behaviour and editor usability.
9. Separate confirmed findings, risks, unknowns and recommendations.
10. Produce either a client-safe summary or internal handoff using `references/outputs/output-contracts.md`.

## Audit variants

### Fast triage

Use when the user needs a direction quickly. Return request type, likely route, evidence available, main risk, and one next action.

### Plugin-stack review

Confirm core plugin, first-party extensions, Wetu, Gravity Forms, Yoast and theme/block-theme support. Do not recommend alternatives before checking the LightSpeed stack.

### Content-model audit

Check post types, fields, taxonomies, relationship/facet sources, archives, sample content and data gaps. Treat relationship/facet sources as evidence, not ownership proof.

### Wetu readiness audit

Confirm dependency on Tour Operator core, active Wetu Importer state, target mappings, source IDs, sync metadata, import logs, manual override behaviour and rollback needs.

### Yoast/schema-readiness audit

Check active Yoast state, existing graph output, candidate mappings, field quality, duplicate graph risk, Google eligibility boundaries and validation steps.

### Launch-readiness audit

Check broken content, archive/single templates, query loops, enquiry forms, tracking, schema readiness, responsive layout, accessibility risks, SEO basics and owner sign-off.

## Evidence labels

Use: confirmed live evidence, confirmed repository evidence, confirmed uploaded source evidence, confirmed documentation evidence, memory only, assumption, or unknown.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

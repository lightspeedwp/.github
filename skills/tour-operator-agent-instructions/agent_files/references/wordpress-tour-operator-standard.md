# WordPress Tour Operator Standard

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

Use this reference for the default recommended structure of a **tour operator website built on WordPress**.

## Core defaults

- Static homepage with a clear value proposition and enquiry path
- Structured content for tours, destinations, accommodations, and trust-building content
- Search-friendly landing pages for high-intent travel themes and locations
- Compliance-aware lead capture
- Mobile-first launch QA

## Recommended focus areas

- LightSpeedWP Tour Operator core plugin configuration before general plugin polish
- LightSpeedWP Tour Operator extension plugin readiness and consistency
- Strong enquiry flows that help qualify leads
- Destination and travel-style visibility
- Clear internal linking between tours, destinations, accommodations, and supporting content
- Launch readiness across plugin stack, forms, SEO, content structure, and conversion paths

## Preferred LightSpeed plugin baseline

For LightSpeed tour operator websites, first check and prefer the first-party plugin stack:

- `Tour Operator`: `https://github.com/lightspeedwp/tour-operator` and `https://wordpress.org/plugins/tour-operator`
- `TO Team`: `https://github.com/lightspeedwp/to-team`
- `TO Specials`: `https://github.com/lightspeedwp/to-specials`
- `TO Reviews`: `https://github.com/lightspeedwp/to-reviews`
- `Wetu Importer`: `https://github.com/lightspeedwp/wetu-importer`

Use first-party extensions only when they match the commercial model: expert-led/team-led positioning, specials-led offers, review-led trust signals, or Wetu-integrated tour content.

## Expected content structure

- Use `tour-operator-content-model-standard.md` as the detailed source for core CPTs, fields, taxonomies, and relationships
- Core built-in post types are `Tours`, `Destinations`, and `Accommodation`
- `Tours` are the primary commercial travel products
- `Destinations` are hierarchical and should drive geographic discovery, internal linking, and SEO structure
- `Accommodation` should be used when lodging choice, room/unit detail, facility filtering, or tour-accommodation relationships matter
- Additional post types such as Reviews, Team, Special Offers, Vehicles, or Wetu-imported structures should be treated as extension-backed or project-specific until the active plugin stack confirms them
- Core taxonomies should support travel styles, accommodation brands/types/facilities, and destination continent hierarchy before new custom taxonomies are introduced
- Relationship fields should be preferred over manual duplicate links between tours, destinations, accommodation, and editorial posts

## Plugin-stack priorities

- Identify the active LightSpeedWP Tour Operator core plugin first
- Identify active first-party extension plugins next
- Confirm the plugin stack supports the required content model, enquiry flow, SEO, and handoff requirements
- Treat Gravity Forms and Yoast SEO as important supporting plugins layered onto the core tour operator implementation
- Do not recommend alternative tour operator plugins unless the project explicitly uses another stack or the first-party stack cannot meet a confirmed requirement

## Configuration priorities

- Homepage and reading settings should support a static front page and a clear blog or news section when needed
- Navigation should prioritise tour discovery, destination discovery, trust signals, and enquiry conversion
- Forms should support rapid enquiry handling and clear user expectations
- SEO setup should prioritise destination pages, tour pages, machine-readable structure, and Yoast SEO configuration quality
- Launch QA should check key plugin flows, conversion routes, mobile usability, and notification delivery

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

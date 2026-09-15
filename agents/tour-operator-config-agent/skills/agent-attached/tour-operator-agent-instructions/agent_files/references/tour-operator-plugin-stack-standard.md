# Tour Operator Plugin Stack Standard

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

Use this reference for the expected plugin-layer audit and configuration order on a **tour operator WordPress website**.

## Priority order

1. LightSpeedWP Tour Operator core plugin
2. LightSpeedWP Tour Operator extension plugins
3. Gravity Forms
4. Yoast SEO or Yoast SEO Premium
5. Supporting operational or utility plugins

## First-party LightSpeed stack

Core plugin:

- `Tour Operator`
- GitHub: `https://github.com/lightspeedwp/tour-operator`
- WordPress.org: `https://wordpress.org/plugins/tour-operator`

Known extensions:

- `TO Team`: `https://github.com/lightspeedwp/to-team`
- `TO Specials`: `https://github.com/lightspeedwp/to-specials`
- `TO Reviews`: `https://github.com/lightspeedwp/to-reviews`
- `Wetu Importer`: `https://github.com/lightspeedwp/wetu-importer`

Treat this as the preferred first-party baseline for LightSpeed tour operator websites unless a specific project has approved a different stack.

## Built-in core content model

Use `tour-operator-content-model-standard.md` as the detailed reference for the built-in Tour Operator content model.

The default core plugin model is:

- `accommodation` for lodging entities, room/unit details, facilities, pricing, ratings, media, and links to tours or destinations
- `destination` for hierarchical geographic discovery and destination travel information
- `tour` for the primary commercial travel product, including pricing, duration, itinerary, start/end destinations, media, and related accommodation or destinations

Do not treat `Reviews`, `Team`, `Specials`, `Vehicles`, or Wetu-synced objects as built-in core until the active extension stack confirms them.

Before recommending new content types, field frameworks, or custom taxonomies, check whether the existing core model already provides the needed CPT, field, taxonomy, or relationship.

## Core plugin checks

- Confirm whether the LightSpeedWP Tour Operator core plugin is installed, active, and versioned
- Confirm the plugin is active and structurally healthy
- Confirm the built-in CPTs are available as expected: `accommodation`, `destination`, and `tour`
- Confirm expected core taxonomies are present where relevant: `brand`, `accommodation-type`, `continent`, `facility`, and `travel-style`
- Confirm relationship fields are being used before assuming tours, destinations, accommodation, and posts are disconnected
- Confirm the plugin supports the required entities, workflows, and relationships before recommending custom alternatives
- Confirm its settings align with the site’s content model and enquiry flow

## Extension plugin checks

- Identify installed LightSpeedWP Tour Operator extension plugins
- Confirm extension purpose and whether each extension is still needed
- Check whether extension settings are consistent with the core plugin workflow
- Flag inactive, duplicate, conflicting, or misaligned extensions
- Treat absent extensions as open configuration decisions unless the site’s commercial model requires them

## Reporting requirements

Always separate:

- core plugin findings
- extension plugin findings
- Gravity Forms findings
- Yoast findings
- general WordPress findings

## Configuration expectations

- Core and extension plugin settings should be reviewed before general plugin polish
- Plugin configuration changes should be verified after edits where tools allow verification
- Reports should clearly flag blockers, misconfiguration, risks, and next actions
- Do not recommend alternative tour operator plugins before checking whether the first-party LightSpeed stack is intended for the project
- Do not recommend ecommerce, checkout, cart, booking, or payment plugins unless the user explicitly confirms that the site needs online booking or payment behaviour

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

# Discovery Template Field Definitions

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
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use these placeholder fields consistently across all discovery templates.

## Core project fields

- `{{client_name}}` — client or company name
- `{{project_name}}` — internal or client-facing project name
- `{{website_url}}` — current website or primary web presence
- `{{session_date}}` — date of the discovery session or summary
- `{{discovery_lead}}` — person leading the discovery work
- `{{document_version}}` — version shown in the metadata block
- `{{last_updated}}` — last updated date or timestamp shown in the metadata block

## Business context

- `{{business_summary}}` — short plain-language business overview
- `{{primary_goal}}` — main reason for the website project
- `{{target_audience}}` — primary users or audiences

## Scope and content

- `{{current_website_notes}}` — current-state observations about the site
- `{{key_pages}}` — important pages or sections expected
- `{{content_needs}}` — content requirements, gaps, or migration needs
- `{{required_features}}` — functional requirements or must-have features
- `{{integrations}}` — systems, tools, or platforms that must connect
- `{{design_brand_ux}}` — branding, visual direction, UX expectations, or design-system notes
- `{{seo_analytics_marketing}}` — SEO requirements, analytics setup, marketing tooling, or traffic considerations

## Delivery context

- `{{timeline}}` — target timing, milestone window, or urgency
- `{{budget_range}}` — known or estimated budget range
- `{{stakeholders}}` — key people involved in review or approval
- `{{decision_process}}` — how decisions and approvals are made

## Discovery analysis fields

- `{{confirmed_facts}}` — information directly confirmed by source material or the user
- `{{assumptions}}` — likely but unconfirmed statements
- `{{inferred_observations}}` — reasoned conclusions drawn from the available material
- `{{open_questions}}` — missing points that still need confirmation
- `{{internal_notes}}` — internal-only LightSpeed commentary, concerns, or recommendations

## Follow-up fields

- `{{decisions_needed}}` — decisions that must be made to move forward
- `{{risks_and_dependencies}}` — blockers, dependencies, or delivery risks
- `{{owners_and_status}}` — owner and current status for follow-up items
- `{{next_steps}}` — recommended actions after the session
- `{{relevant_references}}` — concise list of references actually collected during onboarding, intake, or current-source gathering

## Usage notes

- Leave a placeholder empty only when the source material truly does not support a value.
- Do not invent values just to fill placeholders.
- For client-facing outputs, exclude placeholders that map to internal-only content, especially `{{internal_notes}}`.
- All substantial documents should begin with a main title, one divider line, a metadata block with bolded labels including `{{document_version}}`, then one more divider line.
- End substantial documents with a `Relevant References` section when supported, followed by exactly one final divider line.

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

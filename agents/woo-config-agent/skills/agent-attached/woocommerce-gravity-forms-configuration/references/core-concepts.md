# Core concepts

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

## Product model

Gravity Forms is a WordPress form builder used to create custom forms, collect entries, send notifications, show confirmations, and trigger add-on feeds. Common use cases include WooCommerce product enquiries, quote requests, product option forms, onboarding flows, payment/deposit forms, support requests, user registration, surveys, and post-purchase feedback journeys.

## Form lifecycle

1. Define purpose, audience, data required, privacy posture, and success path.
2. Check site capability: Gravity Forms status/version/licence visibility, add-ons, REST/MCP actions, user capabilities, SMTP, cache/security plugins, and target page.
3. Draft a form object: fields, pages, conditional logic, confirmations, notifications, feeds, spam controls, accessibility settings, retention notes, and test data.
4. Validate the draft before write operations.
5. Create or update the form, preferably via API/MCP action with a reversible change plan.
6. Embed the form using the Gravity Forms block where a block editor/page action is available.
7. Run test submissions and check confirmations, notifications, entries, feeds, spam, accessibility, and handoff notes.

## Objects and responsibilities

- **Form object**: title, description, settings, fields, pagination, button settings, confirmations, notifications, feeds, personal data settings, and display/submit behaviour.
- **Field object**: type, label, description, ID, inputs/subfields, choices, values, required state, visibility, default/dynamic value, conditional logic, validation, CSS/layout, and admin-only behaviour.
- **Entry**: saved submission data plus metadata such as form ID, entry ID, date, status, source URL, user agent, IP if stored, payment metadata, and feed status.
- **Confirmation**: immediate post-submit response. It can be text, page, or redirect, with conditional variants.
- **Notification**: email or event-triggered message after submission. It commonly goes to admins, submitters, or routed recipients.
- **Feed**: add-on configuration that sends entry data to another system or triggers external actions such as email marketing, CRM, payment, webhooks, user registration, Dropbox, Slack, or Zapier.

## Template library

Use official templates as starting points for field patterns, not as live-site evidence. Template imports should be customised for client data, consent, notifications, spam controls, and handoff requirements.

## Embedding

Prefer the Gravity Forms block in block themes and editor-managed pages. Use shortcodes only when block insertion is unavailable or the site architecture requires it. Always check target page, cache rules, and form scripts after embedding.

## REST API and MCP

Gravity Forms REST API v2 is in core from Gravity Forms 2.4. MCP tools may wrap REST, PHP API, WP-CLI, or custom companion plugin methods. The skill must discover actual tool names and schemas before use.

## Version awareness

- Gravity Forms 2.9 introduced/centred features such as Image Choice and Multiple Choice improvements; verify 2.9+ before relying on them.
- Gravity Forms 3.0 is treated as beta/version-specific in this skill. Accessibility-by-default and International Phone support are useful, but must not be assumed on stable production sites.
- Active add-ons, licence access, WordPress/PHP compatibility, and site-specific configuration determine what can be used safely.

## Licensing and availability caveats

Never infer licence tier from project type. Licence visibility may be absent from MCP. If licence details cannot be read, state that add-on availability is unverified and provide a manual verification step.

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

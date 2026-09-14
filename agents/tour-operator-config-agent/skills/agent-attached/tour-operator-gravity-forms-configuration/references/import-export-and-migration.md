# Import, export, duplication, and migration safeguards

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

Use this reference when moving Gravity Forms between environments, duplicating forms, importing/exporting JSON, rebuilding forms from a brief, or preparing a rollback path.

## Operating stance

Treat Gravity Forms migrations as configuration changes with hidden dependencies. Forms can depend on notifications, confirmations, feeds, pages, shortcodes/blocks, add-ons, merge tags, entry data, upload paths, webhook URLs, payment gateway modes, user roles, and external services.

## Safe migration sequence

1. Confirm source and target environments.
2. Confirm Gravity Forms core version on both environments.
3. Confirm required add-ons exist and are active on the target environment.
4. Export or read the existing form before changing it.
5. Preserve original form IDs and notification IDs in the evidence notes where available.
6. Review fields, conditional logic, confirmations, notifications, feeds, personal-data settings, and anti-spam settings.
7. Create a migration/change plan.
8. Import, duplicate, or recreate only after approval.
9. Re-map any target-specific values: page IDs, URLs, email addresses, list IDs, product IDs, post types, roles, webhook endpoints, payment modes, and file paths.
10. Run test submissions on target before replacing production embeds.

## Import caveats

Do not assume an imported form is production-ready. After import, verify:

- Required add-ons and feeds did not silently fail or disable.
- Notifications use target-domain From addresses.
- Confirmation redirects point to the target site, not staging or the old domain.
- Webhook URLs, CRM feeds, list IDs, and Slack channels are correct for the target environment.
- Payment feeds remain in the intended test/live mode.
- User Registration feeds map to approved roles and activation settings.
- File upload paths and retention rules match the target environment.
- Form blocks/shortcodes point to the intended form ID.

## Duplicate-form safeguards

Duplicating a form is safer than editing a live form when:

- The current form receives production leads.
- Notifications/feeds are complex.
- Payment or registration feeds exist.
- The change affects required fields or conditional logic.
- The user needs a preview before replacing an embedded form.

When duplicating, add a clear working title such as `Client enquiry - draft replacement`. Do not embed the duplicate on production pages until validation passes.

## Rollback evidence

Before applying a migration or destructive edit, capture:

- Original form export or full form object.
- Current page embed location.
- Current notifications, confirmations, and feeds.
- Current spam/security settings.
- Current retention and personal-data settings.
- Current active add-ons and versions.
- Rollback owner and rollback trigger.

## Manual fallback

If MCP tools cannot export/import forms:

- Ask for Gravity Forms export JSON, screenshots, or pasted form settings.
- Produce a manual implementation plan using `templates/manual-implementation-plan.md`.
- Keep target-specific values as explicit blanks for the human implementer to fill.
- Do not claim that the migration has been applied.

## High-risk blockers

Stop and ask for approval before continuing when:

- Payment feeds, webhook URLs, registration roles, or retention settings would change.
- The target site lacks required add-ons.
- The target is production and no rollback/export exists.
- The form collects files, sensitive personal data, or account credentials.
- The user asks to delete the old form or entries after migration.

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

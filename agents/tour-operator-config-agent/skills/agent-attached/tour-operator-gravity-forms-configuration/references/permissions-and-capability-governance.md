# Permissions and capability governance

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

Use this reference when reviewing who can create forms, edit forms, view entries, export entries, manage feeds, edit settings, access logs, access REST API settings, or configure high-risk add-ons.

## Core rule

Gravity Forms adds WordPress capabilities for form management, entries, exports, settings, updates, add-ons, system status, logging, API settings, uninstall, and add-on-specific pages/settings. Do not assume a user can perform an action because they are an editor, shop manager, support user, or client admin. Inspect capabilities through MCP or request a capability export.

## Capability review workflow

1. Identify requested operation and required capability class.
2. Read current user capabilities if MCP can expose them.
3. If reviewing team access, list roles/users only to the extent needed. Do not expose personal data beyond names/emails/roles unless requested and permitted.
4. Map capabilities to risk:
   - Low: preview forms, view form list.
   - Medium: create/edit forms, edit notifications/confirmations, view entries for non-sensitive forms.
   - High: export entries, delete entries, edit settings, logging settings, REST/API settings, manage add-ons, edit feeds, file-upload forms, webhook feeds.
   - Critical: delete forms, uninstall Gravity Forms/add-ons, payment feeds, User Registration feeds, role assignment, secret/API credential handling.
5. Recommend least-privilege access and time-boxed elevated access where possible.
6. Never change roles/capabilities without explicit approval and a rollback note.

## Entry-data access

Viewing entries can expose personal data. Exporting entries can expose bulk personal data. Logging can expose personal data and integration payloads. Treat entry-view, entry-export, logs, and webhook payloads as privacy-sensitive even when the form itself is simple.

## User Registration escalation risk

Do not grant non-admin users broad User Registration feed permissions without a specific need. User Registration feed settings can involve role assignment and account behaviour, so changes can create privilege-escalation risk if delegated too broadly.

## Add-on permissions

Add-ons may define their own settings, uninstall, form-settings, results, or plugin-page capabilities. Payment, User Registration, Webhooks, CRM, marketing, Partial Entries, Survey, Quiz, Polls, and other add-on capabilities should be reviewed alongside the form's purpose and data sensitivity.

## Recommended capability groups

These are planning groups only. Confirm exact capabilities on the site.

- **Form maintainer**: create/edit forms, preview forms, edit notifications/confirmations for assigned forms only where tooling supports scoping.
- **Entry reviewer**: view entries for assigned forms, view notes if needed, no export/delete by default.
- **Data export owner**: export entries only with documented purpose and retention path.
- **Integration maintainer**: edit feeds/settings only for approved integrations, no payment/user-registration work without explicit approval.
- **Administrator**: full access, including settings/add-ons/logging/API/uninstall, restricted to trusted site owners.

## Red flags

- Client editor role has delete/export/API/logging/add-on settings access without need.
- Support staff can view all entries across all forms when only one queue is needed.
- Non-admin can modify User Registration roles or payment feeds.
- Multiple people can edit webhook secrets or payment gateway feeds.
- Form owner is not recorded for production forms.
- No one owns unread entries or failed feed alerts.

## Output requirements

Use `templates/permissions-review.md` for capability and role reviews. Label findings as confirmed, assumed, or unverified. Do not expose full user lists unless necessary for the requested review.

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

# MCP read-only capability map

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

Do not assume exact MCP action names. Discover available tools/resources and map them to these capabilities.

| Capability | Evidence examples | Allowed auditor use | Not allowed |
|---|---|---|---|
| Site/environment inspection | Site URL, environment, WP/PHP/MySQL, theme, multisite | Preflight and compatibility risk | Changing settings |
| Plugin list | Active/inactive plugin names and versions | Detect Gravity Forms, SMTP, cache, spam, add-ons | Install/activate/update plugins |
| Gravity Forms version/status | Installed, active, version, licence visibility | Version-aware audit | Licence changes or updates |
| Add-on list | Installed/active official and third-party add-ons | Feed/support/risk review | Enable/disable add-ons |
| Form list | IDs, titles, status, entry counts | Scope/inventory | Create/delete/duplicate forms |
| Form schema read | Fields, settings, conditional logic, buttons, spam settings | Structure/UX/accessibility/spam review | Update fields/settings |
| Notification read | Enabled state, recipients, From/Reply-To, routing, merge tags | Deliverability audit | Create/update/resend notifications |
| Confirmation read | Text/page/redirect, conditional confirmations | UX/privacy/alignment review | Update confirmations |
| Feed read | Add-on feeds, active state, mappings, conditions | Feed risk review | Create/update/reprocess feeds |
| Entry metadata read | Counts, statuses, dates, spam/trash/unread, source URLs | Operational signals | Read full personal data without permission |
| Spam entry count | Counts, reasons if safely available | False-positive/spam trend signal | Bulk action on entries |
| Log read | Redacted logs, error states, mail/feed notes | Troubleshooting evidence | Enable logging, leave logs enabled, expose secrets |
| Page embed inspection | Blocks, shortcodes, duplicate embeds, URLs | Front-end/embed audit | Edit pages or publish changes |
| REST/API status | REST availability, route exposure, auth mode | Connector/API posture | Create keys or change REST settings |
| User capability inspection | Current user's read/settings/log capabilities | Evidence limits and permission risk | Change roles/capabilities |

## If capability is missing

- Ask for a Gravity Forms export, screenshot, system status, redacted log excerpt, page URL, or admin note.
- Mark affected findings as `Not assessed` or lower confidence.
- Do not fill gaps with guesses.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

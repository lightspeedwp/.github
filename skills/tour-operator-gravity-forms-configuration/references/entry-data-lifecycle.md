# Entry data lifecycle and privacy operations

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

Use this reference for entries, exports, entry visibility, retention, deletion/trash, personal data export/erase, Save and Continue drafts, Partial Entries, uploaded files, and privacy-oriented handoff notes.

## Operating stance

- Treat entry data as personal data by default unless proven otherwise.
- Summarise entry metadata and configuration before exposing entry contents.
- Do not reveal personal entry data unless the user explicitly asks and the active tool permissions allow it.
- Do not delete, trash, export, erase, or bulk-process entries without explicit approval and a rollback/irreversibility note.
- Do not include raw personal data in examples, fixtures, logs, test prompts, or handoff notes.

## Entry review rules

When reviewing entries:

1. Confirm form ID/name and purpose.
2. Confirm scope: count, status, date range, spam, trash, starred, unread, payment status, partial status, or specific entry ID.
3. Prefer aggregate findings unless raw entry data is required.
4. Redact names, emails, phone numbers, addresses, uploaded-file URLs, payment references, and travel document details in team handoffs.
5. Separate confirmed data from inferred behaviour.

## Retention review

For each public form, record:

- Personal data captured.
- Whether IP address storage is necessary.
- Whether uploaded files are captured.
- Whether Save and Continue or Partial Entries store draft/incomplete data.
- Whether data is sent to add-ons, CRMs, marketing tools, webhooks, payment processors, or email notifications.
- Proposed retention period or reason for indefinite retention.
- Export/erase settings and identification field, usually an email field when available.
- Owner responsible for retention policy approval.

## Export and erase handling

- Gravity Forms Personal Data settings integrate with WordPress export/erase workflows when enabled for a form.
- Forms without an email field may not have a usable personal-data identification field unless hooks/custom development provide one.
- Add-ons may add personal data items to export/erase processes.
- Entry deletion can also remove associated uploaded files depending on deletion state and file handling.
- Automatic deletion/trashing should be treated as production-impacting because it can remove operational evidence and support history.

## Save and Continue and Partial Entries

- Treat draft or partial data as personal data.
- Confirm whether the client needs abandoned-form recovery, sales follow-up, or only form completion support.
- Do not enable abandoned lead capture without consent, privacy, and retention review.
- Confirm notification/feed behaviour for completed versus partial entries.
- Include draft/partial data in retention and export/erase planning when applicable.

## Uploaded files

- Uploaded files may contain sensitive personal or business information.
- Confirm permitted extensions, maximum size, storage location, link security, retention, and who can access files.
- Avoid attaching uploaded files to notifications unless explicitly required.
- Prefer links with access control or internal review workflows where available.
- Record whether deleting an entry also removes related files.

## Data-retention review output

Use `templates/data-retention-review.md` when the user asks about privacy, retention, entries, exports, erasure, entry cleanup, uploaded files, partial entries, Save and Continue, or data minimisation.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

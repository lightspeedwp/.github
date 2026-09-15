# Import Spreadsheet To Native Google Sheets

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

When to read: after creating or locating a local spreadsheet file that should become a Google Sheets spreadsheet.

For new Google Sheets creation, prefer creating the local workbook with the `[@spreadsheets](plugin://spreadsheets@openai-primary-runtime)` plugin or `$Excel` skill before following this import path.

## Default Rule

Use native Google Sheets conversion by default.

For `.xlsx`, `.xls`, `.ods`, `.csv`, and `.tsv` inputs, the blessed path is the connector's spreadsheet import tool with `upload_mode: "native_google_sheets"`. Do not preserve the source file type unless the user explicitly asks to keep an Excel/OpenDocument/text spreadsheet file in Drive without converting it.

## Workflow

1. Confirm the local source path is an absolute path to a supported spreadsheet file: `.xlsx`, `.xls`, `.ods`, `.csv`, or `.tsv`.
2. Import the file with the Google Drive connector spreadsheet import tool:

   ```json
   {
     "source_file": "/absolute/path/to/workbook.xlsx",
     "title": "Workbook name",
     "upload_mode": "native_google_sheets"
   }
   ```

3. Use the connector function exposed in the current runtime, for example `mcp__codex_apps__google_drive._import_spreadsheet(...)` or the equivalent Google Drive spreadsheet import tool.
4. Verify the import response reports native conversion, typically with `converted: true`, `mimeType: "application/vnd.google-apps.spreadsheet"`, and a `spreadsheetId` or spreadsheet URL.
5. Read spreadsheet metadata when available and confirm the created spreadsheet title, URL, and sheet tabs.
6. Return only the Google Sheets title and spreadsheet link in the final answer unless the user asks for implementation details.

## Escape Hatch

Only use a non-native upload mode when the user explicitly asks to preserve the source file type, keep the file as Excel/OpenDocument/text, or avoid conversion.

For that explicit preservation request, use the connector's spreadsheet import tool with:

```json
{
  "source_file": "/absolute/path/to/workbook.xlsx",
  "title": "Workbook name",
  "upload_mode": "keep_source_file_type"
}
```

Use generic Drive `_upload_file(...)` only for generic file upload requests that are not asking for a Google Sheets spreadsheet outcome.

## Rules

- `native_google_sheets` is the default for spreadsheet imports.
- `keep_source_file_type` is opt-in and requires explicit user intent.
- Do not use generic `_upload_file(...)` for "import into Google Sheets"; it preserves the uploaded file instead of creating a native Sheet.
- Do not cite the local source path in the final answer for a successful native import.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

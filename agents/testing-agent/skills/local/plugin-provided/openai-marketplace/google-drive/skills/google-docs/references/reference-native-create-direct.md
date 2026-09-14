# Native Create Direct

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

When to read: for blank or basic new Google Docs that can be created directly with native Google Drive and Docs connector APIs.

## Decision Boundary

Use connector-native creation when the request can be satisfied by Google Docs primitives with no meaningful quality loss:

- blank Google Doc
- basic text document
- simple title, headings, and paragraphs
- bullet, numbered, or checklist-style lists
- simple links
- simple tables
- supported smart chips such as dates, people, and rich links
- lightweight docs where native Google Docs default styling is acceptable

Use DOCX-first creation instead when the user asks for a polished or complex deliverable:

- polished report, brief, proposal, whitepaper, handout, or formal artifact
- complex visual hierarchy, branding, or custom design system
- cover pages, headers, footers, page breaks, page-level layout, or export-quality pagination
- figures, diagrams, screenshots, or image placement where rendered layout matters
- complex tables or long multi-section documents where document-authoring tooling gives better control
- explicit `.docx`, Word compatibility, PDF-style QA, or high-fidelity export requirements

If the request is ambiguous, prefer connector-native creation for normal Google Docs and DOCX-first creation for deliverables that sound designed, branded, or layout-sensitive.

## Blank Doc Flow

For a blank Google Doc, do not invoke the Documents plugin or create a local `.docx`.

Call:

```json
{
  "title": "Desired title",
  "mime_type": "application/vnd.google-apps.document"
}
```

using `mcp__codex_apps__google_drive._create_file`.

If the create response includes the document id or URL, return that. Do not perform a follow-up `_get_document` unless the response lacks enough information to identify the created doc or the user asked for content/metadata verification.

## Basic Content Flow

For a new basic document with content:

1. Create the native Google Doc with `mcp__codex_apps__google_drive._create_file`.
2. Read the new document once with `mcp__codex_apps__google_drive._get_document` to get document id, `revisionId`, body indexes, and `tabId` if present.
3. Compose direct `mcp__codex_apps__google_drive._batch_update_document` requests from connector readback.
4. Use `insertText` for the content skeleton, then apply `updateParagraphStyle`, `updateTextStyle`, `createParagraphBullets`, table requests, links, or supported smart-chip inserts as needed.
5. Re-read once after the write to verify content, headings, lists, links, tables, and supported chips.
6. Do not export HTML or PDF for a basic native doc unless the user explicitly asks for export or the request becomes layout-sensitive.

For a brand-new blank document, the first insertable body index is commonly `1`, but prefer the single `_get_document` read before writing content so tab and revision state come from connector data instead of assumptions.

## Style Guidance

- Use native Google Docs defaults unless the user requested styling.
- Use real paragraph styles for document structure, such as `TITLE`, `HEADING_1`, `HEADING_2`, and `NORMAL_TEXT`.
- Use real Docs lists through `createParagraphBullets`; do not type bullet characters as plain text when a real list is intended.
- Keep styling conservative: black text, normal Google Docs fonts, simple headings, and readable spacing.
- Do not add branded colors, callouts, decorative tables, page chrome, or imported-document polish unless the user asked for that level of artifact.

## Verification

For blank docs, the create response is sufficient when it identifies the new native Google Doc.

For basic docs with content, connector readback must prove:

1. the created file is a native Google Doc
2. requested content is present in the intended order
3. headings, bullets, numbering, links, tables, and supported chips are connector-visible where requested
4. no placeholder text or unintended empty list items remain

If connector-native creation starts requiring complex recovery, rendered visual QA, or large style normalization, stop and reassess whether the task has crossed the boundary into DOCX-first creation.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

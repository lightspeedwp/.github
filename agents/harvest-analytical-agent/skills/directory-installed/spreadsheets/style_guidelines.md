# Style and Formatting Instructions

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

## Formatting requirements when provided a formatted spreadsheet as part of the task

- If editing an uploaded/template workbook: render first, preserve and match existing style unless user asks to restyle.
- Before editing, inspect all relevant current styling attributes (fills, fonts, borders, merged cells, number formats). If changing values only, never overwrite or clear cell formats.

## Formatting Baseline

Apply these defaults to all spreadsheet outputs but ensure user provided style reference(s), template, or explicit formatting instructions take precedence. If the user specifies a style or reference, match that instead.

### Use a visually clear layout

- Headers should be formatted differently from data and derived cells to distinguish them with a consistent visual style
- Use fill colors, borders, and merged cells judiciously to give the spreadsheet a professional visual style with a clear layout without overdoing it
- Set appropriate row heights and column widths to give a clean visual appearance; contents of cells should be readable within the cell, without excessive buffer space
- Keep row heights consistent within each section unless wrapped content requires expansion.
- Do not apply borders around every filled cell. Borders clarify structure, not decorate arbitrary ranges. Prefer thin, light borders for structure; use stronger borders only for important section breaks.
- Keep formatting and colors consistent for a given role or section for legibility, and ideally across the workbook. Conditional Formatting is preferred over manually painted cells when applying styles consistently over a range, column or table.
- Colors should be used to convey meaning.
- Use strategic whitespace or slightly taller section/header rows to separate sections
- Add data validation for editable categorical columns (`Status`, `Priority`, `Owner`) where feasible.
- When text wraps, prefer widening the column before allowing deep multi-line rows; if wrapping is necessary, increase row height just enough to fully show the content.
- Maintain structural elements (filters, tables, totals rows), and never introduce merged cells in calculation areas.
- If users are likely to edit the workbook later, make worksheet cells the live source of truth: any downstream values or visual states that depend on editable inputs should be driven by formulas referencing worksheet cells, then styled with conditional formatting or presentation-only formatting instead of precomputed values or one-time manual fills.
- Use freeze rows/columns when they help with usability, and especially for large datasets that span a lot of rows or columns. Follow best practices.
- Apply global styling only to populated or intentionally reserved ranges. Avoid formatting hundreds of unused rows or columns because this can expand the used range and degrade rendering, printing, and navigation.
- Keep presentation sheets compact: stack sections when side-by-side blocks become hard to scan, and verify at normal zoom that labels, values, charts, and shapes are not clipped, disconnected, or overlapping.

### Avoiding gridlines

Define structure with explicit fills and borders rather than relying on default gridlines. Use subtle internal borders for separation and slightly stronger outside borders to frame sections or cards. Hide gridlines when explicit section styling already defines the sheet.

### Align and format by data type

Apply semantic formatting to entire columns or blocks:

- text/descriptive fields left-aligned
- labels centered or left-aligned depending on context
- numeric and currency fields right-aligned
- dates with explicit date formats
- financial values with explicit currency/accounting formats
- do not leave important numeric fields in raw General format

### Typography and whitespace

- Use bold sparingly and only to establish reading order.
- Give titles, summaries, and section breaks visible breathing room so the sheet does not feel cramped.

#### Use typography intentionally but conservatively

Use one display-style font choice for titles/section headers and one neutral readable font for body content when supported by the workbook viewer. Keep body text modest in size, reserve larger fonts for titles or major section labels, and avoid mixing many fonts or excessive emphasis.

### Prefer visible summaries over buried totals

Important totals should usually appear in a visible summary area near the top or in a side panel, even if table-footer totals also exist. Use formulas, not hardcoded values, and style summary cards as distinct panels with their own fill and border treatment.

### Dashboard, report, and scorecard quality floor

For generated dashboards, reports, scorecards, and trackers, work within the user's or supplied template's visual language:

- Establish a clear hierarchy: make primary KPIs prominent with explicit number formats and enough whitespace to scan at normal zoom.
- Use native conditional-formatting rules for status, risk, priority, variance, threshold, and exception fields when they aid scanning or must react to future changes; verify the applied range rather than substituting static fills.
- Include a meaningful chart, sparkline, or compact visual or table only when it clarifies the requested analysis; avoid decorative or redundant visuals and follow `charts.md`.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

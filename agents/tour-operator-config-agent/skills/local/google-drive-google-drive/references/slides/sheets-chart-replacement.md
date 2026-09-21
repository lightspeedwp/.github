# Sheets Chart Replacement

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
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Use this reference when a Google Slides workflow needs to replace a screenshot, placeholder image, or stale chart graphic with a chart sourced from an existing Google Sheets workbook.

## Use When

- The user names both a spreadsheet and a presentation.
- The source chart already exists in Google Sheets and should be reused.
- The slide currently contains a screenshot, placeholder image, or other static chart content in the chart area.
- The user may also want a few narrow data edits before generating the refreshed chart graphic.

## Workflow

1. Ground both artifacts first.

- Search for the spreadsheet and presentation when the user gives titles instead of URLs.
- Read spreadsheet metadata to confirm the target chart titles and `chartId` values before writing.
- Read the presentation and target slides to capture slide numbers, titles, object IDs, and current chart-area elements.

1. Keep spreadsheet edits narrow when they are part of the request.

- Prefer exact cell updates on existing rows instead of table rewrites.
- Avoid KPI, headline summary, or rollup cells unless the user explicitly asks to change them.
- Do not add rows, remove rows, or create temporary charts unless the named chart is missing.
- Read back the changed ranges before touching Slides.

1. Capture the placeholder footprint from the live slide.

- Use `get_slide` to find the current screenshot, image, or placeholder object in the chart area.
- Reuse that element's size and transform as the starting footprint for the replacement chart.
- Use `get_slide_thumbnail` to check whether any separate instructional or placeholder text near the chart area also needs removal.

1. Replace the placeholder with the existing Sheets chart.

- Prefer `createSheetsChart` with the existing `spreadsheetId` and `chartId` from the workbook.
- Use `linkingMode: NOT_LINKED_IMAGE` when the user only needs a refreshed graphic and does not need the slide to stay linked to Sheets.
- Use `linkingMode: LINKED` only when the user explicitly wants ongoing chart linkage.
- Delete the obsolete screenshot or placeholder image once the replacement target is grounded.
- Preserve slide order, titles, nearby copy, and unrelated page elements.

1. Clean up chart-area residue.

- Remove separate placeholder or instructional text objects associated with the chart area when they are clearly obsolete.
- Do not delete slide titles, KPI summary content, or other non-chart text unless the user asked for that change.

1. Verify slide by slide.

- After each replacement, fetch a fresh thumbnail and refreshed slide structure.
- Expect Google Slides to normalize inserted chart size or aspect slightly; judge success by approximate footprint and visual cleanliness, not exact raw transform equality.
- Confirm the new chart object exists and the old placeholder image is gone before moving on.
- If the replacement changed visible chart-area layout, cleanup, or styling, continue with [visual-change-loop](./visual-change-loop.md) and do not stop before the third fresh visual review of that slide.

1. Report exact outcomes.

- Exact spreadsheet ranges changed.
- Old and new values for each edited data cell.
- Slide numbers updated.
- Replacement success per chart.
- Whether any placeholder text remained.

## Failure Policy

- If the named chart is missing, then and only then consider creating a replacement chart.
- If the replacement introduces a layout problem, switch to [visual-change-loop](./visual-change-loop.md) or [visual-iteration](./visual-iteration.md) and adjust only the affected slide.

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

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

# Chart Workflows

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

When to read: chart refresh, chart replacement, or Sheets-sourced chart work.

## Read Structurally

1. Do not rely on presentation text alone for chart tasks.
2. Read the presentation and target slide before writing.
3. Use thumbnails when the result depends on the rendered chart image.

## Choose The Right Chart Path

1. If the slide has a linked chart, refresh the live chart object.
2. If the slide has a shape placeholder, replace that placeholder with the chart graphic.
3. If the slide has static chart content or a screenshot, replace the old graphic in the same approximate footprint.
4. Reuse existing source charts before creating new ones.
5. If no suitable source chart exists, say that creating or identifying one is required.
6. When adapting provided source material, preserve required chart or evidence visuals. Do not replace chart-heavy evidence with a prose summary unless the user asked for synthesis rather than fidelity.
7. When native chart reconstruction is impractical, a source-faithful raster chart or evidence panel is acceptable if it remains legible and its reduced editability is disclosed.
8. When adapting a source deck, do not use a screenshot of the entire source slide as a substitute for rebuilding an ordinary slide from the selected composition and source assets.

## Sheets-Sourced Replacement

1. Ground both artifacts first: spreadsheet id/chart id and presentation id/slide object id.
2. Keep spreadsheet edits narrow and read back changed ranges before touching Slides.
3. Capture the placeholder footprint from the live slide.
4. Prefer inserting the existing Sheets chart; use non-linked image mode unless the user explicitly wants ongoing linkage.
5. Remove obsolete placeholder or instructional text unless the user asked to keep it.

## Verification

A chart task is complete only when the edited slide is re-read and a fresh large thumbnail confirms the chart appears in the intended area with stale placeholder content removed. Verify that titles, labels, legends, annotations, and footnotes remain readable and that the crop preserves the important evidence.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

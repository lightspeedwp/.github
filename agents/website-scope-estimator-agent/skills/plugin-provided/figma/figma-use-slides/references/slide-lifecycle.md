# Slide Lifecycle

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

## Creating slides

```js
// Append a slide to the end of the deck (last child of last row)
const slide = figma.createSlide();

// Create a slide at a specific position in the grid (row 0, column 2)
const slide = figma.createSlide(0, 2);
```

`createSlide` returns a `SlideNode` (extends `BaseFrameMixin`). The slide is automatically parented into the slide grid.

## Creating slide rows

```js
// Append a new row to the end of the slide grid
const row = figma.createSlideRow();

// Insert a row at a specific position (index 0 = first row)
const row = figma.createSlideRow(0);
```

`createSlideRow` returns a `SlideRowNode`. New rows start empty — create slides within them using `createSlide(rowIndex, colIndex)`.

## Slide sections

Every slide row is a section. Without a name set, a row shows up in the UI as "Section" (the default label); setting `name` replaces that with a custom one. Sections surface in two places: the editor shows the section name next to the row, and the presenter view shows which section the current slide belongs to (and lets the speaker jump between sections).

So when the user asks to organize a deck into sections, group slides under topics, or label parts of a deck, setting `name` on the `SLIDE_ROW` is the move. Although `SLIDE_ROW` is otherwise opaque (no fills, effects, or layout), `name` is settable.

```js
// Rename the second section in the deck
const grid = figma.currentPage.children[0];  // SLIDE_GRID
const row = grid.children[1];                // SLIDE_ROW
row.name = "Demo";
```

## Cloning slides

```js
const original = figma.getNodeById("SLIDE_ID");
const copy = original.clone();
```

Cloned slides are appended to the current page by default. Use `setSlideGrid` to position them in the grid.

**Important:** `SlideGridNode.clone()` throws at runtime — you cannot copy the slide grid itself.

## Deleting slides

```js
const slide = figma.getNodeById("SLIDE_ID");
slide.remove();
```

Removing a slide automatically updates the grid. If you remove all slides in a row, the row remains but is empty.

## Reordering slides

Use `getSlideGrid` / `setSlideGrid` to rearrange slides. See [slide-grid.md](slide-grid.md) for details.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

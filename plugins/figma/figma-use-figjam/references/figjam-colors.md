# FigJam Colors

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

> Part of the [figma-use-figjam skill](../SKILL.md). Canonical color palettes for FigJam node types — stickies, sections, connectors, shapes-with-text, and labels.

This is the shared color reference for every FigJam node type. Each node type has its own palette (FigJam doesn't share one universal palette across all node types), so use the table for the node type you're working with. The hex/255 conversion helper at the top is shared across all of them.

The hex values below mirror FigJam's built-in UI3 palette. The renderer's behavior is what defines whether a color is recognized as a "palette color" in the FigJam UI, so this doc is downstream of the product. If a value drifts from what FigJam renders, the doc is wrong, not the product.

The per-node-type reference files (`create-sticky.md`, `create-section.md`, `create-connector.md`, `create-shape-with-text.md`, `create-label.md`) intentionally keep their own inline palette tables so each file is self-sufficient for single-file loads. This file is the canonical place those tables converge — when a color value changes, update this file and the relevant per-node-type files together.

## Contents

- [Universal rules](#universal-rules) — `hex/255` notation, the `h()` helper, why this matters
- [Sticky palette](#sticky-palette) — `figma.createSticky()` fills
- [Section background palette](#section-background-palette) — `figma.createSection()` fills
- [Connector stroke palette](#connector-stroke-palette) — `figma.createConnector()` strokes
- [Shape coordinated palette](#shape-coordinated-palette) — `figma.createShapeWithText()` fill + stroke + text together
- [Label coordinated palette](#label-coordinated-palette) — small numbered/lettered ellipse markers
- [Plan-board accent colors](#plan-board-accent-colors) — semantic accents for badges, status dots, and emphasis markers (not section fills)
- [Default text color](#default-text-color) — Charcoal `#1E1E1E`

## Universal rules

### Use `hex/255` notation, not pre-computed decimals

FigJam recognizes a color as a "palette color" only when its RGB channels match a palette entry exactly. Pre-rounded decimals like `{ r: 0.65, g: 0.85, b: 1 }` drift just enough that FigJam treats the color as **custom** instead of **palette**, which (a) breaks color-by-name lookups, (b) prevents users from clicking the palette swatch to change it, and (c) makes diagrams look subtly "off".

**Always** write color values as `hex/255`:

```js
// CORRECT — exact palette match
sticky.fills = [{ type: 'SOLID', color: { r: 0xa8/255, g: 0xda/255, b: 0xff/255 } }]  // Blue #A8DAFF

// WRONG — pre-rounded, FigJam will mark this "custom"
sticky.fills = [{ type: 'SOLID', color: { r: 0.66, g: 0.85, b: 1.0 } }]
```

### The `h()` helper

Almost every script that touches FigJam colors uses this one-liner. Copy-paste it into the top of your script:

```js
const h = (r, g, b) => ({ r: r / 255, g: g / 255, b: b / 255 })

// Now write colors clean:
sticky.fills = [{ type: 'SOLID', color: h(0xa8, 0xda, 0xff) }]  // Blue #A8DAFF
```

### Don't invent custom colors

Strongly prefer the palette colors below over arbitrary hex values. If the user explicitly asks for a brand color, use it; otherwise, sticking to FigJam's built-in palette keeps boards visually coherent and lets users re-color via the FigJam UI.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

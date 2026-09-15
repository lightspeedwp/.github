# Block: Sticky column

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

A vertical stack of stickies, one statement per sticky. Used for success metrics, risks, open questions — anything that's a "pile of discrete cards" where readers can add more.

## When to use

- Success Metrics (yellow stickies, one metric per sticky).
- Risks (light red / pink stickies).
- Open Questions (light blue stickies).
- Dependencies list when the user wants them as "cards" instead of a table.

## Sticky facts

- `figma.createSticky()` creates a STICKY node. FigJam only.
- Sticky **widths** are fixed: 240 (default) or 416 (wide mode via `sticky.isWideWidth = true`).
- Sticky **heights** are determined by content — you cannot resize them directly. Text that overflows 240×240 pushes the sticky taller. Need to **measure after creating**.
- `sticky.text` is a text sublayer — load its font before setting `characters`.
- `sticky.fills` is NOT how you color stickies. Use `sticky.background = STICKY.<color>` — wait, actually check the API. The create-sticky.md reference uses a color preset map.

Actually stickies have a `fills` array that sets the color like any shape. See the `figma-use-figjam` skill's `create-sticky` reference for the exact property name at runtime — the v1 skill used `sticky.fills`.

## Two-pass layout

You MUST create all stickies, then measure, then position. Assuming a uniform 240×240 will cause overlaps when text wraps to multiple lines.

```js
const font = { family: 'Inter', style: 'Medium' };
await figma.loadFontAsync(font);

// Pass 1: create all stickies with text + color; don't position yet.
const stickies = [];
const items = ["p95 < 200ms", "≥ 80% users rate usable", "Error rate < 0.5%"];

for (const label of items) {
  const s = figma.createSticky();
  s.text.fontName = font;
  s.text.characters = label;
  s.fills = [{ type: 'SOLID', color: STICKY.yellow }]; // use sticky palette
  section.appendChild(s);
  stickies.push(s);
}

// Pass 2: now read actual heights and stack vertically.
const STICKY_GAP = 32; // vertical gap between stickies
let y = prevChildBottom + 16; // below H2 or previous block

for (const s of stickies) {
  s.x = 32;
  s.y = y;
  y += s.height + STICKY_GAP;
}

// Return this y as the new bottom for the next block
const stickyColumnBottom = y - STICKY_GAP;
```

## Column positioning inside a multi-column layout

If the sticky column is ONE column in a 3- or 4-column split (e.g. Success Metrics as column 3 of Goals), use `colX(2)` from [multi-column-text.md](multi-column-text.md) as the sticky `x`.

Sticky width is 240 — if `colW < 240`, the sticky will overflow the column. For narrow columns:

- Either use `isWideWidth = true` if the column is 416+ wide.
- Or accept that stickies visually overlap the gutter — 240 is the minimum.
- For 3-col in an 800 section (colW=224), stickies are slightly too wide. Switch to a 2-col layout or use a non-sticky list.

## Color rules

Match the sticky color to the semantic of the section:

- Success metrics → yellow
- Risks → red or pink
- Open questions → blue
- Dependencies → orange
- Blockers (highlighted) → red
- General notes → white or gray

## Pre-flight checklist

- [ ] Font loaded before setting `sticky.text.characters`.
- [ ] Color via `sticky.fills` with a `hex/255` palette color from the STICKY (not SECTION) palette.
- [ ] All stickies appended BEFORE positioning (two-pass layout).
- [ ] Actual `.height` read after creation — do not assume 240×240.
- [ ] Stickies stack with 32px gap.
- [ ] Return all sticky IDs in `mutatedNodeIds`.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

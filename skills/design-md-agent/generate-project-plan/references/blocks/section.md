# Block: Top-level section

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

A FigJam Section node with a colored background, an H2 header as first child, 32px padding, and children laid out below the header.

## Definition

- **Node type:** `SECTION` (created with `figma.createSection()`).
- **Width:** left column = 800, right column = ≥1200 (driven by diagram width).
- **Fill:** `section.fills = [{ type: 'SOLID', color: SECTION_COLOR_BY_SLUG[slug] }]`. See [foundation/palette.md](../foundation/palette.md).
- **STRICT — no section label:** `section.name = ""`. Project-plan boards do **not** use FigJam's section title-bar label. The user-facing title is rendered as the H2 text node inside the section (see Header below). Setting `section.name` to anything non-empty produces a duplicate label that visually clutters the board.
- **Header:** an H2 text node as the section's **first child**, at `(32, 32)`. Header text is the user-facing title (e.g. `"Goals, Non-Goals & Success Metrics"`). This is the **only** label the section gets.
- **Padding:** 32px on all four sides. First child at `(32, 32)`; last child's bottom + 32 = section height.
- **Hug behavior:** sections do NOT auto-grow. Call `section.resizeWithoutConstraints(w, h)` after appending children.
- **Placeholder during build:** set `section.placeholder = true` in the skeleton pass. Set `section.placeholder = false` at the end of the fill pass for that section.

## Create script (skeleton pass)

```js
const section = figma.createSection();
section.name = ""; // STRICT — no FigJam section label; H2 text inside is the only title
section.fills = [{ type: 'SOLID', color: SECTION_COLOR_BY_SLUG.goals }];
section.resizeWithoutConstraints(800, 400); // DEFAULT_H — fill pass will overwrite
section.x = 0;
section.y = 152 + cumulative_y;
section.placeholder = true;
```

## Add the H2 header (first action in fill pass)

```js
const font = { family: 'Inter', style: 'Medium' };
await figma.loadFontAsync(font);

const h2 = figma.createText();
h2.fontName = font;
h2.fontSize = 40;
h2.characters = "Goals, Non-Goals & Success Metrics"; // user-facing header
h2.fills = [{ type: 'SOLID', color: CHARCOAL }];
section.appendChild(h2);   // append FIRST
h2.x = 32;
h2.y = 32;
```

## Hug section after filling

After all children are appended and positioned:

```js
const maxBottom = Math.max(...section.children.map(c => c.y + c.height));
section.resizeWithoutConstraints(800, maxBottom + 32);
section.placeholder = false;
```

## Pre-flight checklist

- [ ] `section.name = ""` (no section title-bar label — STRICT).
- [ ] Fill is set via `hex/255` palette color (not rounded decimals).
- [ ] H2 is the first child.
- [ ] `appendChild` is called before setting `x`/`y` on any child.
- [ ] `resizeWithoutConstraints(w, h)` runs after all children are appended.
- [ ] `section.placeholder` is `false` at end of this section's fill.
- [ ] Return includes `section.id` in `mutatedNodeIds` (or `createdNodeIds` on skeleton pass).

## Right-column (diagram) section

Same as above but:

- `fill` = `ARCH_PALE.white`.
- Width = `max(RIGHT_COL_W_MIN, diag.width + 64)` after the diagram is reparented.
- `section.name = ""` (same rule — no title-bar label).
- See [blocks/diagram-section.md](diagram-section.md) for the reparent flow.

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

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

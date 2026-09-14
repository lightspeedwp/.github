# Block: Multi-column text

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

Side-by-side text columns with per-column titles, body text, and (optional) bulleted list. Visual dividers separate columns.

## When to use

- Comparing options (`Option 1: Webhook`, `Option 2: Polling`, `Option 3: GH Actions`, `Option 4: Hybrid`).
- Parallel facets of a decision (Pros | Cons | Neutral).
- Any case where N parallel blocks need to sit in one row and wrap the same kind of content.

Do NOT use for:

- Tabular rows-across-columns → use [table.md](table.md).
- A single bullet list → use [text-primitives.md](text-primitives.md).
- Grouping different kinds of content → use [nested-section.md](nested-section.md).

## Supported variants

- **2 columns**: wider per column; works for Pros/Cons.
- **3 columns**: balanced; works for common decision matrices.
- **4 columns**: tight per column; caps at this. More than 4 → switch to a table or a second row.

## Geometry (inside an 800-wide left section)

| Cols | Inner width | Gutters | Col width | X positions |
|---|---|---|---|---|
| 2 | 736 | 1 × 32 | 352 | 32, 416 |
| 3 | 736 | 2 × 32 | 224 | 32, 288, 544 |
| 4 | 736 | 3 × 32 | 160 | 32, 224, 416, 608 |

Formula:

```
innerW  = 800 - 2*32 = 736
colW    = (innerW - (N-1)*32) / N
colX[i] = 32 + i * (colW + 32)
```

## Structure (per column)

Each column is a **vertical stack** of three TEXT nodes appended to the parent section:

1. Column title — H3-like (24px) or body-bold (16px bold — not currently on palette; use 24px).
2. Column body — body text (16px), wrapped at `colW`.
3. Column list — bulleted list (16px), wrapped at `colW`.

## Divider between columns

A thin `LINE` node between each pair of adjacent columns, at x = column boundary, y from title-top to bottom of tallest column.

```js
const divider = figma.createLine();
divider.name = "Column divider";
divider.strokes = [{ type: 'SOLID', color: h(0xE6, 0xE6, 0xE6) }]; // light gray
divider.strokeWeight = 1;
section.appendChild(divider);
divider.x = colX[i] - 16; // between column i-1 and i
divider.y = titlesTopY;
divider.resize(1, tallestColHeight);
```

Alternative (simpler): skip dividers — the whitespace between columns is enough. Use dividers only when the user asked for explicit separation.

## Create script (3-column example)

```js
const font = { family: 'Inter', style: 'Medium' };
await figma.loadFontAsync(font);

const N = 3;
const innerW = 800 - 2*32;
const colW = (innerW - (N-1)*32) / N; // 224
const colX = i => 32 + i * (colW + 32);

const columns = [
  { title: "Option 1: Webhook", body: "…description…", bullets: ["Pro 1", "Pro 2"] },
  { title: "Option 2: Polling", body: "…", bullets: ["Pro 1"] },
  { title: "Option 3: GH Actions", body: "…", bullets: ["Pro 1", "Pro 2"] },
];

// Position below the H2 header (and any preceding body)
const startY = prevChildBottom + 16;
const allIds = [];

for (let i = 0; i < N; i++) {
  const col = columns[i];
  let y = startY;

  // Title
  const title = figma.createText();
  title.fontName = font;
  title.fontSize = 24;
  title.characters = col.title;
  title.fills = [{ type: 'SOLID', color: CHARCOAL }];
  title.textAutoResize = 'HEIGHT';
  section.appendChild(title);
  title.x = colX(i);
  title.y = y;
  title.resize(colW, title.height);
  y += title.height + 16;

  // Body
  const body = figma.createText();
  body.fontName = font;
  body.fontSize = 16;
  body.characters = col.body;
  body.fills = [{ type: 'SOLID', color: CHARCOAL }];
  body.textAutoResize = 'HEIGHT';
  section.appendChild(body);
  body.x = colX(i);
  body.y = y;
  body.resize(colW, body.height);
  y += body.height + 16;

  // Bulleted list
  if (col.bullets && col.bullets.length) {
    const listText = col.bullets.join('\n');
    const list = figma.createText();
    list.fontName = font;
    list.fontSize = 16;
    list.characters = listText;
    list.fills = [{ type: 'SOLID', color: CHARCOAL }];
    list.textAutoResize = 'HEIGHT';
    list.setRangeListOptions(0, listText.length, { type: 'UNORDERED' });
    list.setRangeIndentation(0, listText.length, 1);
    section.appendChild(list);
    list.x = colX(i);
    list.y = y;
    list.resize(colW, list.height);
    y += list.height;
  }

  allIds.push(title.id, body.id);
}

// Compute the bottom of the tallest column for the next element's startY.
const multiColBottom = Math.max(...section.children
  .filter(c => c.y >= startY)
  .map(c => c.y + c.height));
```

## Use inside a nested section

If the columns sit inside a child SECTION (as in the v1 board's "Design Decisions" → "Decision 1" → 4-col options), replace `section` with the child section node and adjust the geometry to the child's inner width (`child.width - 64`).

## Pre-flight checklist

- [ ] N is 2, 3, or 4. More → switch to a table or stack in two rows.
- [ ] Column width uses `(innerW - (N-1)*32) / N` formula.
- [ ] Every text node: font loaded, `appendChild` before `x`/`y`, `textAutoResize='HEIGHT'` + `resize(colW, height)` for wrapping.
- [ ] Columns all start at the same `y` (aligned tops).
- [ ] After all columns are placed, compute `multiColBottom` for the next element.
- [ ] Text node IDs returned in `mutatedNodeIds`.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

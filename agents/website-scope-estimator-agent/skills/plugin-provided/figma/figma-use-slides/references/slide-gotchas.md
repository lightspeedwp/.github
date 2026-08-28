# Slide Gotchas & Common Mistakes

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
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![allocate-pr-issue-to-milestone](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![badges-documentation-update](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml)
[![badges-health-check](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml)
[![badges-readme-status](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml)
[![badges-workflow-audit](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![docs-maintenance](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml)
[![docs-validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![gitleaks-reusable](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml)
[![gitleaks-update](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml)
[![gitleaks](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml)
[![issue-create-enhanced](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issue-fields-backfill](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml)
[![issue-health-audit](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml)
[![issue-labeling-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml)
[![issue-project-field-sync](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml)
[![issue-remediation-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml)
[![issue-remediation-bulk](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![label-audit-report](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml)
[![labeling-governance](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![manage-blocking-status-labels](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml)
[![meta-agent-validation](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml)
[![meta-labels-sync](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-pipeline](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml)
[![metrics-reporting](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml)
[![openspec-progress-phase](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml)
[![openspec-report-progression](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml)
[![openspec-sync-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml)
[![openspec-validate-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![pr-template-validation](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-maintenance-nightly](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml)
[![project-maintenance-on-demand](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![validate-blocking-issue-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml)
[![validate-blocking-status-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml)
[![validate-dor-dod-sections](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml)
[![validate-issue-dod-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
[![validate-project-linking](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml)
<!-- BADGES-END -->

> Part of the [figma-use-slides skill](../SKILL.md). Pitfalls specific to working in Slides files.

## Contents

- Position after appendChild (critical)
- Canonical text-edit recipe (font load → await → mutate → return IDs)
- Sequential awaits — batch independent async calls with `Promise.all`
- Prefer indexed lookups over `findAll`/`findOne` full-tree scans
- Scope traversal to the smallest known ancestor (a slide, not the page)
- Set `figma.skipInvisibleInstanceChildren = true` for read-only traversal
- SLIDE_GRID and SLIDE_ROW are opaque nodes
- Validation without get_metadata
- Building multi-element slides
- Code preamble for deck-building scripts

## Canonical text-edit recipe (font load → await → mutate → return IDs)

The same canonical recipe used in Design files applies inside slides — see [figma-use → gotchas.md → Canonical text-edit recipe](../../figma-use/references/gotchas.md#canonical-text-edit-recipe-font-load--await--mutate--return-ids) for the full WRONG/CORRECT pair. Two slide-specific reminders:

1. **Inter preload doesn't cover deck-theme fonts.** Decks frequently switch the theme font to families like `Roboto Mono`, `Merriweather`, or a brand font — those still need an explicit `loadFontAsync` for every (family, style) you mutate.
2. **When restyling existing slide text, load the node's *current* font, not a hardcoded default.** Slide theme tokens push fonts onto nodes that may differ from what you'd guess. Use `getStyledTextSegments(['fontName'])` and `loadFontAsync` each segment's font before any mutation.

```js
// Restyle existing slide text without assuming the font
await Promise.all(
  textNode.getStyledTextSegments(['fontName'])
    .map(s => figma.loadFontAsync(s.fontName))
)
textNode.characters = "Updated"
return { mutatedNodeIds: [textNode.id] }
```

## Prefer indexed lookups over `findAll` / `findOne` full-tree scans

Same rule as in design files (see [figma-use → gotchas.md → Prefer indexed lookups](../../figma-use/references/gotchas.md#prefer-indexed-lookups-over-findall--findone-full-tree-scans)). On slide trees, the most common offenders are `slide.findAll(n => n.type === 'TEXT')` (use `slide.findAllWithCriteria({ types: ['TEXT'] })`) and `slide.findAll(n => n.type === 'INTERACTIVE_SLIDE_ELEMENT')` (same fix). If you have a slide or element ID, use `figma.getNodeByIdAsync(id)` — never re-scan the tree.

## Scope traversal to the smallest known ancestor

Slides specifically: **search inside the specific slide**, not the whole page. `slide.findAllWithCriteria(...)` walks one slide; `figma.currentPage.findAllWithCriteria(...)` walks every slide in the deck. When you have the target slide's ID (passed by the caller or returned from a prior call), always start the traversal there.

```js
// AVOID — scans every slide in the deck
const texts = figma.currentPage.findAllWithCriteria({ types: ['TEXT'] })

// PREFER — one slide only
const slide = await figma.getNodeByIdAsync(SLIDE_ID)
const texts = slide.findAllWithCriteria({ types: ['TEXT'] })
```

See [figma-use → gotchas.md → Scope traversal to the smallest known ancestor](../../figma-use/references/gotchas.md#scope-traversal-to-the-smallest-known-ancestor).

## Set `figma.skipInvisibleInstanceChildren = true` for read-only traversal

Same rule as in design files (see [figma-use → gotchas.md → Set figma.skipInvisibleInstanceChildren](../../figma-use/references/gotchas.md#set-figmaskipinvisibleinstancechildren--true-for-read-only-traversal)). One line at the top of any read-only slide-inspection script. Decks tend to be component-heavy (icons, logo lockups, repeating frames), so this flag is especially impactful.

```js
figma.skipInvisibleInstanceChildren = true
const slide = await figma.getNodeByIdAsync(SLIDE_ID)
const texts = slide.findAllWithCriteria({ types: ['TEXT'] })
```

Leave the flag off if you specifically need to read invisible content inside an instance (e.g., inspecting all variants of a deck-template instance).

## Sequential awaits — batch independent async calls with `Promise.all`

Same rule as in design files (see [figma-use → gotchas.md → Sequential awaits](../../figma-use/references/gotchas.md#sequential-awaits--batch-independent-async-calls-with-promiseall)). When building decks, the typical offenders are `loadFontAsync` for theme/brand fonts, `getNodeByIdAsync` for cached slide IDs, and `import*ByKeyAsync` for library variables and styles — all independent per call and all batchable.

```js
// WRONG — sequential round-trips per slide
for (const id of slideIds) {
  const slide = await figma.getNodeByIdAsync(id)
  // ... mutate
}

// CORRECT — fetch all slides in one batch, then mutate sequentially
const slides = await Promise.all(slideIds.map(id => figma.getNodeByIdAsync(id)))
for (const slide of slides) {
  // ... mutate
}
```

`setCurrentPageAsync` is the exception — page-context switches must stay sequential.

## Position after appendChild (critical)

Setting `x`/`y` on a node **before** appending it to its real parent causes a `(−240, −240)` coordinate shift. This applies at **every level of nesting**, not just the slide root — a card you build at "page level" before attaching to a slide hits the bug, and a text you create then position before appending to that card hits it too.

**Why this happens:** Newly created nodes (`figma.createFrame()`, `figma.createRectangle()`, `figma.createText()`) in a Slides file are silently auto-parented to a slide context whose origin sits at absolute `(240, 240)` — the slide grid's `GRID_PADDING`. When you write `node.x = 200` on that "orphan", the underlying engine interprets `200` as the desired absolute x, then stores `relative.x = 200 − 240 = −40`. When you later `appendChild` to the real slide (or real card), the relative coordinate is preserved, so the node lands at `−40` instead of `200`. The bug is **intermittent** — different frames in the same script can escape it depending on engine state — so a passing visual check on one frame doesn't mean the next one is safe.

```js
// WRONG — building a subtree at "page level", attaching last.
// Both the outer card AND the inner text hit the (-240, -240) trap.
const card = figma.createFrame();
card.resize(400, 200);
card.x = 120; card.y = 260;          // card stores local = (-120, 20)
const text = figma.createText();
text.x = 32; text.y = 32;            // text on orphan card — same trap
card.appendChild(text);
slide.appendChild(card);
// Visual result: card bleeds off the left edge of the slide;
// text inside it is off-position relative to the card.

// CORRECT — appendChild walks down from the slide.
// Configure size/fills/x/y AFTER each appendChild, at every level.
const card = figma.createFrame();
slide.appendChild(card);             // 1. parent first
card.resize(400, 200);               // 2. then everything else
card.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
card.cornerRadius = 16;
card.x = 120; card.y = 260;

const text = figma.createText();
card.appendChild(text);              // same rule one level down
await figma.loadFontAsync({ family: "Inter", style: "Bold" });
text.fontName = { family: "Inter", style: "Bold" };
text.characters = "26.6%";
text.x = 32; text.y = 32;
```

**Required helper pattern.** Wrap the append-first order so the agent can't write it wrong. Use these (or local equivalents) for every node added to a slide or a frame on a slide:

```js
function addFrame(parent, x, y, w, h, fill, radius) {
  const f = figma.createFrame();
  parent.appendChild(f);                                    // 1. parent first
  f.resize(w, h);
  f.fills = [{ type: "SOLID", color: fill }];
  if (radius !== undefined) f.cornerRadius = radius;
  f.x = x; f.y = y;                                         // 2. position last
  return f;
}

function addText(parent, family, style, size, color, chars, x, y, w, h) {
  const t = figma.createText();
  parent.appendChild(t);
  t.fontName = { family, style };
  t.fontSize = size;
  t.characters = chars;
  t.fills = [{ type: "SOLID", color }];
  if (w !== undefined) t.resize(w, h);
  t.x = x; t.y = y;
  return t;
}

function addRect(parent, x, y, w, h, fill) {
  const r = figma.createRectangle();
  parent.appendChild(r);
  r.resize(w, h);
  r.fills = [{ type: "SOLID", color: fill }];
  r.x = x; r.y = y;
  return r;
}
```

With these helpers, building a card-with-text on a slide is one walk-down:

```js
const card = addFrame(slide, 120, 260, 400, 200, { r: 1, g: 1, b: 1 }, 16);
addText(card, "Inter", "Bold", 96, { r: 0.42, g: 0.42, b: 0.45 }, "26.6%", 32, 56, 336, 104);
```

## Diagnosing offset bugs

If you observe nodes off by exactly `(−240, −240)` from where you set them, this is the auto-parent bug above. **Do not** try to compensate by adding `240` back to `x`/`y` — the session referenced in the original incident did this and the next iteration was worse, not better, because the compensation hides the structural issue and re-triggers it under slightly different state.

Fix the order instead:

1. Read back the node positions after your script runs. For any node whose `node.x` differs from the value you assigned by `−240`, that node had `x`/`y` set before its final `appendChild`.
2. Rewrite the offending block to use the helper pattern above (append-then-configure, at every nesting level).
3. Verify by re-reading `node.x` — it must match the value you wrote.

Quick sanity script you can drop in at the end of any slide-build:

```js
const expectations = [
  { node: card,  intended: { x: 120, y: 260 } },
  { node: text,  intended: { x: 32,  y: 56  } },
];
const drift = expectations
  .map(e => ({ name: e.node.name, dx: e.node.x - e.intended.x, dy: e.node.y - e.intended.y }))
  .filter(r => r.dx !== 0 || r.dy !== 0);
return { drift }; // any non-empty result means the append-first rule was broken somewhere
```

## SLIDE_GRID and SLIDE_ROW are opaque nodes

Only `SLIDE` nodes extend `BaseFrameMixin`. The parent containers do not:

| Node type | Mixin | Has fills? | Has children? | Has layout props? |
|---|---|---|---|---|
| `SLIDE_GRID` | OpaqueNodeMixin | No | Yes (rows) | No |
| `SLIDE_ROW` | OpaqueNodeMixin + ChildrenMixin | No | Yes (slides) | No |
| `SLIDE` | BaseFrameMixin | Yes | Yes (content) | Yes |

```js
// WRONG — throws "no such property 'fills' on SLIDE_GRID node"
const grid = figma.currentPage.children[0];
const bg = grid.fills;

// WRONG — throws on SLIDE_ROW
const row = grid.children[0];
row.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];

// CORRECT — access fills on the SLIDE node itself
const slide = row.children[0];  // type: 'SLIDE'
slide.fills = [{ type: "SOLID", color: { r: 0.06, g: 0.09, b: 0.16 } }];
```

## Validation without get_metadata

`get_metadata` does not work on Slides files. Use `get_screenshot` for visual validation and `use_figma` read-only scripts for structural validation.

**Post-creation validation pattern:**

```js
const slide = figma.getNodeById("SLIDE_ID");
const children = slide.children.map(c => ({
  name: c.name,
  type: c.type,
  x: Math.round(c.x),
  y: Math.round(c.y),
  w: Math.round(c.width),
  h: Math.round(c.height),
  text: c.type === "TEXT" ? c.characters.substring(0, 50) : undefined,
}));

// Check for overlapping bounding boxes
const overlaps = [];
for (let i = 0; i < children.length; i++) {
  for (let j = i + 1; j < children.length; j++) {
    const a = children[i], b = children[j];
    if (a.x < b.x + b.w && a.x + a.w > b.x &&
        a.y < b.y + b.h && a.y + a.h > b.y) {
      overlaps.push([a.name, b.name]);
    }
  }
}

return { children, overlaps, hasOverlaps: overlaps.length > 0 };
```

Run this after creating slide content to catch layout issues before they compound.

### Batch validation script

When building a deck, run this validation after every batch of slides. It checks the three most common layout failures — overlapping siblings, text clipping past containers, and elements beyond slide bounds — in ~3 seconds via a read-only `use_figma` call. Only take a screenshot if issues are found.

```js
// Pass the slide IDs built in the current batch
const slideIds = ["SLIDE_ID_1", "SLIDE_ID_2", "SLIDE_ID_3"];
const OVERLAP_PX = 4;
const OVERFLOW_PX = 1;
const SLIDE_W = 1920, SLIDE_H = 1080;

const issues = [];
const slides = await Promise.all(slideIds.map(id => figma.getNodeByIdAsync(id)));

for (const slide of slides) {
  const children = slide.children.map(c => ({
    id: c.id, name: c.name, type: c.type,
    x: c.x, y: c.y, w: c.width, h: c.height,
  }));

  // 1. Sibling overlaps (≥ OVERLAP_PX axis-aligned intersection)
  for (let i = 0; i < children.length; i++) {
    for (let j = i + 1; j < children.length; j++) {
      const a = children[i], b = children[j];
      const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (ox >= OVERLAP_PX && oy >= OVERLAP_PX)
        issues.push({ slide: slide.id, type: "overlap", nodes: [a.name, b.name] });
    }
  }

  // 2. Text clipping (text bbox extends past parent frame)
  for (const c of children) {
    if (c.type !== "FRAME") continue;
    const texts = c.findAllWithCriteria({ types: ["TEXT"] });
    for (const t of texts) {
      const abs = t.absoluteBoundingBox;
      const pAbs = c.absoluteBoundingBox;
      if (!abs || !pAbs) continue;
      if (abs.x + abs.width > pAbs.x + pAbs.width + OVERFLOW_PX ||
          abs.y + abs.height > pAbs.y + pAbs.height + OVERFLOW_PX)
        issues.push({ slide: slide.id, type: "textClip", node: t.name, parent: c.name });
    }
  }

  // 3. Beyond slide bounds
  for (const c of children) {
    if (c.x + c.w < -OVERLAP_PX || c.y + c.h < -OVERLAP_PX ||
        c.x > SLIDE_W + OVERLAP_PX || c.y > SLIDE_H + OVERLAP_PX)
      issues.push({ slide: slide.id, type: "outOfBounds", node: c.name });
  }
}

return { clean: issues.length === 0, issues };
```

**Verification cadence for deck building:**

- After every batch: run the validation script above. If `clean` is `true`, proceed to the next batch without re-deliberation or a screenshot.
- If `clean` is `false`: take a screenshot of the affected slide(s) and fix the issues before continuing.
- Screenshot at **checkpoints** regardless: after the first batch (validates the visual system — colors, typography, design direction) and after the final batch (overall quality check).
- Do NOT re-plan after successful verification. Proceed to the next batch.

## Building multi-element slides

When building a **single complex slide** (data-heavy chart, intricate one-off layout), work incrementally within that slide — create the background and structure first, then add content, then decorative elements, validating between steps.

When building a **deck** (multiple slides), build complete slides in each `use_figma` call. The helpers (`addFrame`, `addText`, `addRect`) enforce the appendChild-before-position rule, so building a complete slide in one pass is safe. Validate using the [batch validation script](#batch-validation-script) above, not per-element screenshots. See [Deck-Building Workflow](../SKILL.md#deck-building-workflow) for the full process.

## Code preamble for deck-building scripts

When building a deck, start every `use_figma` script with the same preamble — colors, fonts, and helpers. Define these once in your Phase 1 plan, then copy verbatim into every build script rather than re-deriving them.

```js
// --- Preamble (copy from Phase 1 plan) ---
// Color palette — fill in your own values
const C = {
  bg:      { r: 0.10, g: 0.10, b: 0.12 },
  surface: { r: 0.15, g: 0.15, b: 0.19 },
  text:    { r: 1,    g: 1,    b: 1    },
  muted:   { r: 0.60, g: 0.62, b: 0.68 },
  accent:  { r: 0.38, g: 0.71, b: 0.77 },
};

// Font loading — batch all styles in one await
await Promise.all([
  figma.loadFontAsync({ family: "Inter", style: "Bold" }),
  figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
  figma.loadFontAsync({ family: "Inter", style: "Regular" }),
  figma.loadFontAsync({ family: "Inter", style: "Light" }),
]);

// Helpers — enforce appendChild-before-position
function addFrame(parent, x, y, w, h, fill, radius) {
  const f = figma.createFrame();
  parent.appendChild(f);
  f.resize(w, h);
  f.fills = [{ type: "SOLID", color: fill }];
  if (radius !== undefined) f.cornerRadius = radius;
  f.x = x; f.y = y;
  return f;
}
function addText(parent, family, style, size, color, chars, x, y, w, h) {
  const t = figma.createText();
  parent.appendChild(t);
  t.fontName = { family, style };
  t.fontSize = size;
  t.characters = chars;
  t.fills = [{ type: "SOLID", color }];
  if (w !== undefined) t.resize(w, h);
  t.x = x; t.y = y;
  return t;
}
function addRect(parent, x, y, w, h, fill) {
  const r = figma.createRectangle();
  parent.appendChild(r);
  r.resize(w, h);
  r.fills = [{ type: "SOLID", color: fill }];
  r.x = x; r.y = y;
  return r;
}
// --- End preamble ---
```

The palette values and font families above are placeholders — replace them with the actual design constants from your Phase 1 plan. The helpers are identical to the ones in the [Position after appendChild](#position-after-appendchild-critical) section and should be included in every deck-building script.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

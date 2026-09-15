# Block: Nested section

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

A SECTION inside another SECTION. Used to group related sub-content (e.g. a "Design Decisions" parent section containing three "Decision 1/2/3" child sections). 1 level deep only — no grandchildren.

## When to use

- The parent concept has multiple sibling items each with their own structured content (headers, tables, bullet lists).
- Example from the v1 board: `"Design Decisions: 1, 2, & 3"` parent → `"Design Decision 1: Delivery Surfaces"`, `"Design Decision 2: Trigger Mechanism"`, etc. child sections, each with its own tables and multi-column option layouts.

Do NOT nest for:

- Single paragraphs with a subheading → use an H3 from [text-primitives.md](text-primitives.md).
- Option comparison → use [multi-column-text.md](multi-column-text.md).

## Structure

```
Parent SECTION (color = section palette color for parent slug)
 ├─ H2 header (parent title, e.g. "Design Decisions: 1, 2, & 3")
 ├─ Child SECTION 1 (color = same palette but lighter or matching shade)
 │   ├─ H3 header
 │   ├─ body text
 │   └─ table / multi-column / …
 ├─ Child SECTION 2
 └─ Child SECTION 3
```

## Color rule

Child sections inherit the parent's palette color by default. For visual separation, override to:

- Same palette, same hex (looks like embedded content).
- White (`SECTION.white`) for a high-contrast "card" look.
- A related palette (e.g. parent `lightBlue` → child `lightBlue` but with a white inner content block, or parent `lightViolet` → child `lightBlue` if decisions are categorized).

Default: match parent for a cohesive look; override per child if the content visually needs distinction.

## Sizing

- Parent section width = 800 (left column).
- Child sections: width = `800 - 2*32 = 736` (full inner width of parent minus padding).
- Child section height = hug its own children + 32 padding.
- Child section x inside parent = 32. y = previous child's bottom + 32.
- Parent section height = 32 + H2.height + 32 + Σ(child.height + 32) - 32 + 32.

## Create script (inside Step 7 fill pass for the parent)

```js
// Parent is already created in skeleton pass; fetch by ID.
const parent = await figma.getNodeByIdAsync(parentSectionId);
// H2 header already appended as first child; compute y for first child section.
const h2 = parent.children.find(c => c.type === 'TEXT');
let childY = (h2 ? h2.y + h2.height : 32) + 32;

const childSpecs = [
  { name: "Decision 1", header: "Design Decision 1: Delivery Surfaces" },
  { name: "Decision 2", header: "Design Decision 2: Trigger Mechanism" },
  // …
];

const font = { family: 'Inter', style: 'Medium' };
await figma.loadFontAsync(font);

const childIds = [];
for (const spec of childSpecs) {
  const child = figma.createSection();
  child.name = ""; // STRICT — no section label; H3 inside is the only title
  child.fills = [{ type: 'SOLID', color: SECTION.lightBlue }]; // or same as parent
  child.resizeWithoutConstraints(736, 300); // temp height; overwritten after filling
  parent.appendChild(child);
  child.x = 32;
  child.y = childY;

  // child H3 header (using H3 semantic — 24px)
  const h3 = figma.createText();
  h3.fontName = font;
  h3.fontSize = 24;
  h3.characters = spec.header;
  h3.fills = [{ type: 'SOLID', color: CHARCOAL }];
  child.appendChild(h3);
  h3.x = 32;
  h3.y = 32;

  // TODO: append body / tables / multi-column content for this child

  // hug child after its content is added
  const childBottom = Math.max(...child.children.map(c => c.y + c.height));
  child.resizeWithoutConstraints(736, childBottom + 32);

  childY += child.height + 32;
  childIds.push(child.id);
}

// re-hug parent
const parentBottom = Math.max(...parent.children.map(c => c.y + c.height));
parent.resizeWithoutConstraints(800, parentBottom + 32);
```

## Pre-flight checklist

- [ ] Parent and child are BOTH `SECTION` nodes (not `FRAME`).
- [ ] Both parent and child have `name = ""` (STRICT — no section labels).
- [ ] Child is appended to parent BEFORE setting `child.x`/`child.y`.
- [ ] Only 1 level of nesting. No grandchildren.
- [ ] Parent is re-resized AFTER all children are hugged.
- [ ] Both parent and child have `placeholder = false` at end of fill.
- [ ] Return includes `parent.id` and every `child.id` in `mutatedNodeIds`/`createdNodeIds`.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

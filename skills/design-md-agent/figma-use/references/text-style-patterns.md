# Text Style API Patterns

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

> Part of the [use_figma skill](../SKILL.md). How to create, apply, and inspect text styles using the Plugin API.
>
> For design system context (when to create text styles, how they relate to tokens, `use_figma` limitations), see [wwds-text-styles](working-with-design-systems/wwds-text-styles.md).

## Contents

- Listing Text Styles
- Creating a Text Style
- Discovering Available Font Styles
- Creating a Type Ramp (Multi-Step)
- Importing Library Text Styles
- Applying Text Styles to Nodes

## Listing Text Styles

```javascript
/**
 * Lists all local text styles with their key properties.
 *
 * @returns {Promise<Array<{id: string, name: string, key: string, fontSize: number, fontName: FontName, lineHeight: LineHeight, letterSpacing: LetterSpacing}>>}
 */
async function listTextStyles() {
  const styles = await figma.getLocalTextStylesAsync();
  return styles.map(s => ({
    id: s.id,
    name: s.name,
    key: s.key,
    fontSize: s.fontSize,
    fontName: s.fontName,
    lineHeight: s.lineHeight,
    letterSpacing: s.letterSpacing
  }));
}
```

Full runnable script:

```javascript
const results = await listTextStyles();
return results;
```

## Creating a Text Style

Font **MUST** be loaded before setting `fontName`. `lineHeight` and `letterSpacing` must be `{value, unit}` objects — bare numbers throw.

```javascript
/**
 * Creates a text style with all typographic properties set.
 * Font MUST be loaded before calling.
 *
 * @param {string} name - Slash-delimited name, e.g. "body/base"
 * @param {{ family: string, style: string }} fontName
 * @param {number} fontSize - In pixels
 * @param {{ value: number, unit: 'PIXELS' | 'PERCENT' } | { unit: 'AUTO' }} lineHeight
 * @param {{ value: number, unit: 'PIXELS' | 'PERCENT' }} [letterSpacing]
 * @param {string} [description] - e.g. the CSS variable name "CSS: var(--font-body-base)"
 * @returns {TextStyle}
 */
function createTextStyleFull(name, fontName, fontSize, lineHeight, letterSpacing, description) {
  const style = figma.createTextStyle();
  style.name = name;
  style.fontName = fontName;
  style.fontSize = fontSize;
  style.lineHeight = lineHeight; // { unit: 'AUTO' } | { value, unit: 'PIXELS'|'PERCENT' }
  if (letterSpacing) style.letterSpacing = letterSpacing;
  if (description) style.description = description;
  return style;
}
```

## Discovering Available Font Styles

Font style names vary per provider and per file.  Use `figma.listAvailableFontsAsync()` to discover exact style strings — never guess or probe with try/catch:

```javascript
/**
 * Discovers available font styles for a given family using listAvailableFontsAsync.
 *
 * @param {string} family - Font family name, e.g. "Inter"
 * @returns {Promise<string[]>} - All available style names for the family
 */
async function getAvailableFontStyles(family) {
  const allFonts = await figma.listAvailableFontsAsync();
  return allFonts
    .filter(f => f.fontName.family === family)
    .map(f => f.fontName.style);
}
```

## Creating a Type Ramp (Multi-Step)

Handles font loading, deduplication, and idempotency. Each entry: `[name, fontFamily, fontStyle, fontSize_px, lineHeight, cssVar]`.

```javascript
/**
 * Creates a full type ramp from a token definition array.
 * Handles font loading, deduplication, and idempotency.
 *
 * Each entry: [name, fontFamily, fontStyle, fontSize_px, lineHeight, cssVar]
 *   - lineHeight: { unit: 'AUTO' } or { value: number, unit: 'PIXELS' | 'PERCENT' }
 *
 * @param {Array} defs - Array of [name, fontFamily, fontStyle, fontSize, lineHeight, cssVar] tuples
 * @returns {Promise<{ created: string[], skipped: string[] }>}
 */
async function createTypeRamp(defs) {
  const uniqueFonts = new Set();
  for (const [, family, style] of defs) {
    uniqueFonts.add(JSON.stringify({ family, style }));
  }
  await Promise.all(
    [...uniqueFonts].map(f => figma.loadFontAsync(JSON.parse(f)))
  );

  const existing = new Set(
    (await figma.getLocalTextStylesAsync()).map(s => s.name)
  );

  const created = [];
  const skipped = [];

  for (const [name, family, style, fontSize, lineHeight, cssVar] of defs) {
    if (existing.has(name)) {
      skipped.push(name);
      continue;
    }
    const ts = figma.createTextStyle();
    ts.name = name;
    ts.fontName = { family, style };
    ts.fontSize = fontSize;
    ts.lineHeight = lineHeight ?? { unit: 'AUTO' };
    if (cssVar) ts.description = `CSS: var(${cssVar})`;
    created.push(name);
  }

  return { created, skipped };
}
```

Full runnable script:

```javascript
const defs = [
  ['heading/xl', 'Inter', 'Bold',      48, { unit: 'PIXELS', value: 56 }, '--font-heading-xl'],
  ['heading/lg', 'Inter', 'Bold',      36, { unit: 'PIXELS', value: 44 }, '--font-heading-lg'],
  ['body/base',  'Inter', 'Regular',   16, { unit: 'AUTO' },              '--font-body-base'],
  ['body/sm',    'Inter', 'Regular',   14, { unit: 'AUTO' },              '--font-body-sm'],
  ['code/base',  'Roboto Mono', 'Regular', 14, { unit: 'AUTO' },          '--font-code-base'],
];
const result = await createTypeRamp(defs);
return result;
```

## Importing Library Text Styles

For text styles from **team libraries**, use `importStyleByKeyAsync`:

```javascript
// Import a library text style by key
const headingStyle = await figma.importStyleByKeyAsync("TEXT_STYLE_KEY");
// Apply to a text node
await textNode.setTextStyleIdAsync(headingStyle.id);
```

`search_design_system` with `includeStyles: true` returns style keys you can import this way. Prefer importing library styles over creating new ones.

## Applying Text Styles to Nodes

```javascript
/**
 * Applies a text style to all TEXT nodes on the current page that match a given name pattern.
 *
 * @param {string} styleId - The ID of a TextStyle.
 * @param {string} nodeNamePattern - Substring match against node names.
 * @returns {Promise<number>} - Number of nodes the style was applied to.
 */
async function applyTextStyleToMatchingNodes(styleId, nodeNamePattern) {
  const textNodes = figma.currentPage.findAllWithCriteria({ types: ['TEXT'] });
  let applied = 0;
  for (const node of textNodes) {
    if (node.name.includes(nodeNamePattern)) {
      await node.setTextStyleIdAsync(styleId);
      applied++;
    }
  }
  return applied;
}
```

Full runnable script:

```javascript
const applied = await applyTextStyleToMatchingNodes('STYLE_ID', 'Heading');
return { applied };
```

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

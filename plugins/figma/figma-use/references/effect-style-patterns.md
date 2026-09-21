# Effect Style API Patterns

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

> Part of the [use_figma skill](../SKILL.md). How to create, apply, and inspect effect styles using the Plugin API.
>
> For design system context (effect types, variable bindings on effects, gotchas), see [wwds-effect-styles](working-with-design-systems/wwds-effect-styles.md).

## Contents

- Listing Effect Styles
- Creating a Drop Shadow Style
- Importing Library Effect Styles
- Applying Effect Styles to Nodes

## Listing Effect Styles

```javascript
/**
 * Lists all local effect styles.
 *
 * @returns {Promise<Array<{id: string, name: string, key: string, effectCount: number}>>}
 */
async function listEffectStyles() {
  const styles = await figma.getLocalEffectStylesAsync();
  return styles.map(s => ({
    id: s.id,
    name: s.name,
    key: s.key,
    effectCount: s.effects.length
  }));
}
```

Full runnable script:

```javascript
const results = await listEffectStyles();
return results;
```

## Creating a Drop Shadow Style

Colors are **RGBA 0–1 range**. `effects` is a read-only array — always reassign, never mutate in place.

```javascript
/**
 * Creates a drop shadow effect style.
 *
 * @param {string} name - e.g. "Elevation/200"
 * @param {{ r: number, g: number, b: number, a: number }} color - RGBA, 0-1 range
 * @param {{ x: number, y: number }} offset
 * @param {number} radius - blur radius
 * @param {number} [spread=0]
 * @returns {EffectStyle}
 */
function createDropShadowStyle(name, color, offset, radius, spread) {
  const style = figma.createEffectStyle();
  style.name = name;
  style.effects = [{
    type: "DROP_SHADOW",
    color,
    offset,
    radius,
    spread: spread || 0,
    visible: true,
    blendMode: "NORMAL"
  }];
  return style;
}
```

Full runnable script:

```javascript
const style = createDropShadowStyle(
  "Elevation/200",
  { r: 0, g: 0, b: 0, a: 0.15 },
  { x: 0, y: 4 },
  12,
  0
);
return { id: style.id, name: style.name };
```

## Importing Library Effect Styles

For effect styles from **team libraries**, use `importStyleByKeyAsync`:

```javascript
// Import a library effect style by key
const shadowStyle = await figma.importStyleByKeyAsync("EFFECT_STYLE_KEY");
// Apply to a node
node.effectStyleId = shadowStyle.id;
```

`search_design_system` with `includeStyles: true` returns style keys you can import this way. Prefer importing library styles over creating new ones.

## Applying Effect Styles to Nodes

```javascript
/**
 * Applies an effect style to all nodes on the current page that match a given name pattern.
 *
 * @param {string} styleId - The ID of an EffectStyle.
 * @param {string} nodeNamePattern - Substring match against node names.
 * @returns {number} - Number of nodes the style was applied to.
 */
function applyEffectStyleToMatchingNodes(styleId, nodeNamePattern) {
  const nodes = figma.currentPage.findAll(n => n.name.includes(nodeNamePattern));
  let applied = 0;
  for (const node of nodes) {
    if ('effectStyleId' in node) {
      node.effectStyleId = styleId;
      applied++;
    }
  }
  return applied;
}
```

Full runnable script:

```javascript
const applied = applyEffectStyleToMatchingNodes('STYLE_ID', 'Card');
return { applied };
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

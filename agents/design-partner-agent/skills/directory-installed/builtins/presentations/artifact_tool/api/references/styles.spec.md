# Named Text Styles

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

`presentation.styles` stores reusable text styles for shapes and text ranges.

## Style Surface Map

| Need | API |
| --- | --- |
| Deck-level tokenized text style ids | `presentation.theme.textStyles({...})` |
| Slide-scoped generated text style ids | `slide.theme.textStyles({...})` |
| Explicit named styles by facade | `presentation.styles.add(name)` |

## Built-In Styles

```ts
const styles = presentation.styles;
const style = styles.get(styleName);
const summary = styles.describe(styleName);
const allStyles = styles.describe();
```

## Custom Style

```ts
const custom = presentation.styles.add(styleName);
custom.description = styleDescription;
custom.color = styleColor;
custom.bold = isBold;
custom.italic = isItalic;
custom.fontSize = fontSizePx;
custom.alignment = alignment;
```

## Named Style Facade Fields

```ts
type NamedStyleFacade = {
  description?: string;
  usageHint?: string;
  bold?: boolean;
  italic?: boolean;
  fontSize?: number;
  alignment?: "left" | "center" | "right" | "justify";
  underline?: string;
  color?: ColorConfig;
};
```

Use broader `TextStyleConfig` objects on `shape.text.style = { ... }`,
`presentation.theme.textStyles(...)`, and `slide.theme.textStyles(...)`.

## Use A Style

```ts
shape.text = textValue;
shape.text.style = styleName;

const range = shape.text.get(rangeText);
range.style = styleName;
```

Named styles are block-level for paragraph style assignments and range-level for selected text ranges.

## Cookbook

```ts
// Deck-level type scale.
const display = presentation.styles.add("Display");
display.fontSize = 52;
display.bold = true;
display.color = "#0f172a";
display.usageHint = "Hero and section titles";

const body = presentation.styles.add("Body");
body.fontSize = 20;
body.color = "#475569";
body.usageHint = "Readable body copy";
```

```ts
// Apply a style, then emphasize one range.
shape.text = "Revenue accelerated across enterprise accounts.";
shape.text.style = "Body";
shape.text.get("Revenue").style = "Display";
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

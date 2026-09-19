# Auto Layout

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
<!-- BADGES-END -->

`slide.autoLayout(...)` places shapes within a frame using deterministic spacing.
Use `slide.compose(<row>/<column>/<grid>)` for new structured JSX layouts. Use
`slide.autoLayout(...)` when repositioning existing facade shapes, especially
imported or generated shapes.

## Pattern

```ts
slide.autoLayout(shapes, {
  direction,
  frame,
  align,
  horizontalGap,
  verticalGap,
  horizontalPadding,
  verticalPadding,
});
```

## Inputs

- `direction`: horizontal or vertical flow.
- `frame`: `"slide"`, container `Shape`, or explicit `{ left, top, width, height }`.
- `align`: 3x3 group alignment within the frame.
- Gap and padding values use pixels.

## Inline Types

```ts
type AutoLayoutOptions = {
  direction?: "horizontal" | "vertical";
  frame?:
    | "slide"
    | Shape
    | { left: number; top: number; width: number; height: number };
  align?:
    | "center"
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "left"
    | "right"
    | "bottomLeft"
    | "bottomCenter"
    | "bottomRight";
  horizontalGap?: number | "auto";
  verticalGap?: number | "auto";
  horizontalPadding?: number;
  verticalPadding?: number;
};
```

## Shape Prep

```ts
for (const shape of shapes) {
  shape.position = {
    width: shapeWidthPx,
    height: shapeHeightPx,
  };
}

slide.autoLayout(shapes, layoutConfig);
```

## Cookbook

```ts
// Equal KPI row.
const kpiShapes = metrics.map((metric) =>
  slide.shapes.add({
    geometry: "roundRect",
    position: { width: 240, height: 132 },
    fill: "white",
    line: { style: "solid", fill: "slate-200", width: 1 },
    borderRadius: "rounded-xl",
  }),
);

slide.autoLayout(kpiShapes, {
  direction: "horizontal",
  frame: { left: 80, top: 160, width: 1120, height: 160 },
  horizontalGap: "auto",
  align: "center",
});
```

```ts
// Vertical callout stack inside an existing shape frame.
slide.autoLayout(callouts, {
  direction: "vertical",
  frame: frameShape,
  verticalGap: 14,
  horizontalPadding: 24,
  verticalPadding: 24,
  align: "topLeft",
});
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

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

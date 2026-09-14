# Auto Layout

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

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

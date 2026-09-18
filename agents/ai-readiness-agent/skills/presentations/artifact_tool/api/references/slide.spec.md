# Slide Facade

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

## Content Collections

```ts
const shape = slide.shapes.add(shapeConfig);
const image = slide.images.add(imageConfig);
const table = slide.tables.add(tableConfig);
const chart = slide.charts.add(chartType, chartConfig);
```

## Content Config Pointers

```ts
type ShapeConfig = PresetShapeConfig | CustomShapeConfig | ConnectorConfig; // see shapes.spec.md
type ImageConfig = ImageAddOptions; // see images.spec.md
type TableConfig = TableAddOptions | TableCellValue[][]; // see tables.spec.md
type ChartConfig = {
  position?: { left?: number; top?: number; width?: number; height?: number };
  title?: string;
  categories?: string[];
  series?: Array<{ name: string; values?: number[] }>;
}; // see charts.spec.md for axes, legend, labels, and series styling
```

## Background

```ts
slide.background.fill = fillConfig;
```

`fillConfig` accepts theme color strings, hex strings, solid configs, gradient configs, pattern configs, and image-fill configs.

## Layouts And Placeholders

```ts
slide.setLayout(layout);

const placeholder = slide.placeholders.getItem(placeholderName);
placeholder.text = placeholderText;
placeholder.text.style = placeholderStyleName;
```

## Frame And Export

```ts
const frame = slide.frame;
const preview = await slide.export({ format, scale });
```

## Compose Layout

```tsx
/** @jsxRuntime automatic */

slide.compose(
  <row width="fill" height="fill" gap={20}>
    <column width={340} height="fill" gap={12}>
      <paragraph name="summary" className="text-slate-950 text-3xl font-bold">
        Summary
      </paragraph>
      <paragraph className="text-slate-600 text-sm">
        Compose-first layouts stay readable and export cleanly.
      </paragraph>
    </column>
    <box
      name="surface"
      width="fill"
      height="fill"
      padding={16}
      fill="#ffffff"
    >
      <column height="fill" gap={10}>
        <rule stroke="#0f172a" weight={2} />
      </column>
    </box>
  </row>,
  {
    frame: { left: 48, top: 40, width: 864, height: 460 },
    baseUnit: 8,
  },
);
```

`slide.compose(...)` accepts either compose helper nodes or a JSX-authored tree.
It still returns the materialized elements. Use `name` on materializing nodes
when the slide needs stable inspect or layout-export anchors.

## Export Inline Type

```ts
type SlideExportOptions = {
  format?: "png" | "jpeg" | "webp" | "layout";
  width?: number;
  height?: number;
  scale?: number;
  quality?: number;
};
```

`format: "layout"` exports the composed layout tree alongside the materialized slide elements. That is the most useful export when you need stable names, hierarchy paths, and resolved text for follow-up targeting.

## Auto Layout

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

## Auto Layout Inline Type

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

## Speaker Notes

```ts
slide.speakerNotes.textFrame.setText(notesText);
slide.speakerNotes.setVisible(visible);
```

## Visual QA Loop

```ts
const preview = await slide.export({ format: "png", scale: 2 });
const layout = await slide.export({ format: "layout" });
const after = await presentation.inspect({
  kind: "slide,textbox,shape,image,table,chart,notes",
  target: { id: slideAnchorId, beforeLines: 2, afterLines: 8 },
  maxChars: 4000,
});
```

Check the PNG for clipping, overlap, weak contrast, illegible text, bad image
crops, accidental rasterized labels, and off-canvas elements. Check the layout
export or inspect output for stable `name` values on important nodes.

## Cookbook

```ts
// Gradient background plus editable content.
slide.background.fill = "linear(180deg, slate-950 0%, blue-950 100%)";
const title = slide.shapes.add({
  geometry: "textbox",
  name: "title",
  position: { left: 72, top: 72, width: 760, height: 120 },
  fill: "none",
  line: { style: "solid", fill: "none", width: 0 },
});
title.text = "Editable headline";
title.text.style = { fontSize: 44, bold: true, color: "white" };
```

```ts
// Clone rhythm from another slide, then change content.
const next = sourceSlide.duplicate();
next.moveTo(3);
next.placeholders.getItem("title").text = "Updated section title";
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

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

# Rich Text

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

Shape text accepts strings, paragraph arrays, and structured runs.

## Set Text

```ts
shape.text = textValue;
shape.text = paragraphs;
shape.text = structuredRuns;
```

## Text Value Inline Types

```ts
type TextValue = string | string[] | StructuredTextInput | Text;

type StructuredTextInput =
  | ParagraphRunsInput
  | StructuredTextParagraphInput
  | Array<ParagraphRunsInput | StructuredTextParagraphInput>;

type ParagraphRunsInput = Array<string | number | TextRunInput>;

type StructuredTextParagraphInput = {
  runs?: ParagraphRunsInput;
  bulletCharacter?: string;
  marginLeft?: number;
  indent?: number;
  spaceBefore?: number;
  spaceAfter?: number;
  styleId?: string;
  paragraphStyle?: Record<string, unknown>;
};

type TextRunInput = {
  run: string;
  textStyle?: {
    bold?: boolean;
    italic?: boolean;
    underline?: string;
    fontSize?: string;
    typeface?: string;
    color?: FillConfig;
  };
  link?: { uri: string; isExternal: boolean; action?: string };
};
```

Structured run `fontSize` accepts unit strings such as `"20pt"` and `"28px"`.
Shape text style setters use numeric pixels with `fontSize` and numeric points
with `fontSizePt`.

## Structured Paragraphs

```ts
shape.text.set([
  [{ run: "Status", textStyle: { bold: true } }, { run: " review" }],
  {
    bulletCharacter: "•",
    marginLeft: 18,
    indent: -10,
    runs: [
      "Open the",
      {
        run: " rollout notes",
        textStyle: { underline: "sng", color: "#2563eb" },
        link: { uri: "https://example.com", isExternal: true },
      },
    ],
  },
]);
```

The paragraph-object form is the non-JSX peer of `<paragraph>...</paragraph>`. Use it when the text needs paragraph metadata plus authored runs.

## JSX Rich Text

```tsx
/** @jsxRuntime automatic */

slide.compose(
  <column width="fill" height="hug" gap={8}>
    <paragraph width="fill" className="text-slate-950 text-2xl leading-tight">
      <run textStyle={{ bold: true }}>Status</run>
      <run> review</run>
    </paragraph>
    <paragraph
      width="fill"
      className="text-slate-950 text-2xl leading-tight"
      bulletCharacter="•"
      marginLeft={18}
      indent={-10}
    >
      Open the
      <run
        textStyle={{ underline: "sng", color: "#2563eb" }}
        link={{ uri: "https://example.com", isExternal: true }}
      >
        {" rollout notes"}
      </run>
    </paragraph>
  </column>,
  {
    frame: { left: 48, top: 40, width: 864, height: 160 },
    baseUnit: 8,
  },
);
```

## Shape Text Style

```ts
shape.text.style = {
  styleName,
  fontSize: fontSizePx,
  color: colorConfig,
  fill: fillConfig,
  outline: lineConfig,
  alignment,
  verticalAlignment,
  autoFit: autoFitMode,
  wrap: wrapMode,
  insets,
};
```

Use grouped `text.style = { ... }` for whole-shape text formatting. Use single
property setters for focused edits:

```ts
shape.text.fontSize = fontSizePx;
shape.text.color = colorConfig;
shape.text.fill = fillConfig;
shape.text.outline = lineConfig;
shape.text.alignment = alignment;
shape.text.verticalAlignment = verticalAlignment;
shape.text.autoFit = autoFitMode;
shape.text.wrap = wrapMode;
shape.text.insets = insets;
```

`shape.text.color` uses `ColorConfig`. `shape.text.fill`, run `textStyle.fill`,
and text ranges accept the shared `FillConfig`, including linear and path
gradients. `shape.text.outline`, run `textStyle.outline`, and text ranges accept
`LineConfig`; the outline line fill can be a solid, pattern, or gradient fill.

```ts
shape.text.fill = {
  type: "gradient",
  gradientKind: "linear",
  angleDeg: 0,
  stops: [
    { offset: 0, color: "#ff5a5f" },
    { offset: 100000, color: "#4f46e5" },
  ],
};
```

Path gradients use the same fill config with `gradientKind: "path"`, `pathType`, and optional
`fillRect` in Office percentage units.

## Text Style Inline Type

```ts
type TextStyleConfig = {
  styleName?: string;
  className?: string;
  bold?: boolean;
  italic?: boolean;
  fontSize?: number;
  lineSpacing?: number;
  alignment?: "left" | "center" | "right" | "justify";
  verticalAlignment?: "top" | "middle" | "bottom";
  underline?: string;
  fill?: FillConfig;
  color?: ColorConfig;
  outline?: LineConfig;
  wrap?: "square" | "none";
  autoFit?: "none" | "shrinkText" | "resizeShapeToFitText";
  insets?: { top?: number; right?: number; bottom?: number; left?: number };
  typeface?: string;
};
```

## Ranges

```ts
const range = shape.text.get(searchText);
range.bold = isBold;
range.italic = isItalic;
range.fill = fillConfig;
range.outline = lineConfig;
range.link = linkConfig;

const fixedRange = shape.text.getRange(start, length);
fixedRange.style = styleName;
```

## Lists

```ts
shape.text = listParagraphs;
shape.text.style = listStyleName;
shape.text.get(itemText).lineSpacing = lineSpacing;
```

## Links

```ts
shape.text.get(linkText).link = {
  uri,
  isExternal,
};
```

## Link Inline Type

```ts
type LinkConfig = {
  uri: string;
  isExternal: boolean;
  action?: string;
};
```

## Cookbook

```ts
// Title with emphasized suffix.
shape.text.set([
  [
    { run: "Revenue", textStyle: { bold: true, color: "#0f172a" } },
    { run: " momentum", textStyle: { color: "#2563eb" } },
  ],
]);
shape.text.style = { fontSize: 44, lineSpacing: 0.92 };
```

```ts
// Bullets with bold lead-ins.
shape.text.set([
  { bulletCharacter: "•", marginLeft: 22, indent: -12, runs: [{ run: "Quality:", textStyle: { bold: true } }, " defect rate down 31%"] },
  { bulletCharacter: "•", marginLeft: 22, indent: -12, runs: [{ run: "Speed:", textStyle: { bold: true } }, " p95 latency under target"] },
]);
```

```ts
// Edit one phrase inside imported text.
const range = shape.text.get("legacy workflow");
range.text = "new workflow";
range.className = "text-emerald-700 font-bold";
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

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

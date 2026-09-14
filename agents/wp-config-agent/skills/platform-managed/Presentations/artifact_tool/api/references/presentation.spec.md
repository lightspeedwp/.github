# Presentation Facade

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

## Create And Load

```ts
const presentation = Presentation.create({ slideSize });
const imported = Presentation.load(proto);
```

## Create Inline Type

```ts
type PresentationCreateOptions = {
  slideSize?: { width: number; height: number };
};
```

## Presentation Slide Collection

```ts
const slide = presentation.slides.add({ layout, layoutId });
const inserted = presentation.slides.insert({ after, layout, layoutId });
const byIndex = presentation.slides.getItem(slideIndex);
```

## Presentation Slide Collection Inline Types

```ts
type SlideAddOptions = {
  layout?: string;
  layoutId?: string;
  width?: number;
  height?: number;
};

type SlideInsertOptions = SlideAddOptions & {
  after?: Slide | number | null;
};
```

## Discover And Edit

```ts
const snapshot = await presentation.inspect({
  kind,
  search,
  maxChars,
});

const target = presentation.resolve(anchorId);
```

`inspect` returns stable anchor ids for slides, shapes, images, tables, charts, text ranges, speaker notes, and comment threads. `resolve` maps a returned anchor id to the matching facade. Layout records expose `layoutId` for search and comparison; pass only `pr/`, `sl/`, `sh/`, `im/`, `tb/`, `ch/`, `nt/`, `th/`, and `tr/` anchors to `resolve`.

## Inspect Inline Type

```ts
type PresentationInspectOptions = {
  target?: { id: string; beforeLines?: number; afterLines?: number };
  kind?: string; // e.g. "slide,textbox,shape,image,table,chart,notes,thread,layout"
  include?: string;
  exclude?: string;
  search?: string;
  maxChars?: number;
};
```

## Help

```ts
const help = presentation.help(query, {
  search,
  include,
  maxChars,
});
```

## Help Inline Type

```ts
type PresentationHelpOptions = {
  search?: string;
  include?: string[]; // common: ["index", "examples", "notes"]
  maxChars?: number;
};
```

## Export And Serialized Data

```ts
const imageBlob = await presentation.export({ slide, format, scale });
const montageBlob = await presentation.export({
  format: "webp",
  montage: true,
  scale: 1,
});
const layoutBlob = await slide.export({ format: "layout", scale });
const proto = presentation.toProto();
```

`toProto()` returns presentation data for host adapters. File export and local
resource resolution belong to host adapter docs.

## Export Inline Type

```ts
type PresentationExportOptions = {
  slide?: Slide;
  format?: "png" | "jpeg" | "webp" | "layout";
  width?: number;
  height?: number;
  scale?: number;
  quality?: number;
  montage?:
    | boolean
    | {
        format?: "png" | "jpeg" | "webp";
        width?: number;
        slideWidth?: number;
        padding?: number;
        gap?: number;
        background?: string;
        columns?: number;
      };
};
```

## Scripts

```ts
const result = presentation.scripts.run(scriptKind, scriptOptions);
```

Scripts provide high-level authoring recipes. Use `presentation.help(...)` to discover available script keys and option shapes.

## Cookbook

```ts
// New deck skeleton: create, set theme, add slides, render checks.
const presentation = Presentation.create({
  slideSize: { width: 1280, height: 720 },
});
presentation.theme.colorScheme = {
  name: "Clean Product",
  themeColors: {
    accent1: "#2563eb",
    accent2: "#0f766e",
    accent3: "#f59e0b",
    accent4: "#dc2626",
    accent5: "#7c3aed",
    accent6: "#16a34a",
    bg1: "#ffffff",
    bg2: "#f8fafc",
    tx1: "#0f172a",
    tx2: "#475569",
    dk1: "#000000",
    dk2: "#1e293b",
    lt1: "#ffffff",
    lt2: "#e2e8f0",
    hlink: "#2563eb",
    folHlink: "#7c3aed",
  },
};

const first = presentation.slides.add();
const second = presentation.slides.add();
const third = presentation.slides.add();

await presentation.export({
  slide: first,
  format: "png",
  scale: 1,
});
const snapshot = await presentation.inspect({
  kind: "deck,slide,textbox,chart,table",
  maxChars: 6000,
});
```

```ts
// Existing deck: inspect first, then resolve exact anchors.
const before = await presentation.inspect({
  kind: "slide,textbox,shape,image,table,chart,notes,thread,layout",
  search: "Customer growth",
  maxChars: 8000,
});
const target = presentation.resolve(anchorIdFromBefore);
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

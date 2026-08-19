---
file_type: "documentation"
title: "Presentation Artifact Tool Documentation"
description: "Documentation for presentation artifact generation tool within the design Markdown agent"
version: "1.0"
last_updated: '2026-06-01'
maintainer: "LightSpeed Engineering"
tags: ["artifacts", "presentations", "slides", "documentation"]
---

# Presentation Artifact Tool Documentation

<!-- BADGES-START -->
[![changelog-validate](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml)
[![issue-close-label-hygiene](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![readme-audit](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml)
[![readme-regen](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)
<!-- BADGES-END -->

This is the official documentation for presentation artifact tool (version `2.2.6`). This library lets you create and edit presentation slides programmatically in Python and export to PowerPoint. Compared to `python-pptx` or `PptxGenJS`, it supports more advanced styling and layout features.

## Quick start

Check [./examples/integrated_example.py](./examples/integrated_example.py) for an in-depth demonstration of common patterns.

Check [./inspect.spec.md](./inspect.spec.md) to understand how to load an existing presentation, understand its content and efficiently modify it.

### Key patterns

- Use `Presentation.create({"slideSize": ...})` to control default slide dimensions.
- Use `presentation.slides.add()` to create slides.
- Use `presentation.slides.insert({"after": ...})` to insert relative to another slide (often the active slide).
- Use `slide.shapes.add({ geometry, position, fill, line })`, `slide.images.add(...)`, `slide.tables.add(...)`, `slide.charts.add(...)` to author content.
- Use `presentation.scripts.run(kind, options)` for high-level “command” edits (great for LLM tool calls).

NOTE: All dimensions must be specified in terms of pixels.

## Feature index

Start with the overall presentation and slide APIs, then drill into content types and styling:

- [`presentation.spec.md`](./presentation.spec.md) — `Presentation` façade, slide collection, export/toProto, scripts.
- [`slide.spec.md`](./slide.spec.md) — `Slide` API, backgrounds, placeholders, notes, export, auto-layout.
- [`layout.spec.md`](./layout.spec.md) — layouts, placeholders, and applying layouts to slides.
- [`master.spec.md`](./master.spec.md) — masters, linking layouts to masters, background refs + color maps.
- [`theme.spec.md`](./theme.spec.md) — theme color schemes and hex maps.
- [`styles.spec.md`](./styles.spec.md) — named text styles and how they flow through text.
- [`rich-text.spec.md`](./rich-text.spec.md) — text blocks, ranges, links, list presets.
- [`shapes.spec.md`](./shapes.spec.md) — shape geometry, fills, strokes, z‑ordering.
- [`fill.spec.md`](./fill.spec.md) — fill/stroke config shapes and color shorthands.
- [`images.spec.md`](./images.spec.md) — images, cropping, contain/cover framing, prompt placeholders.
- [`tables.spec.md`](./tables.spec.md) — tables, merges, and cell text.
- [`charts.spec.md`](./charts.spec.md) — charts, series, axes, legends, mini-chart YAML.
- [`auto-layout.spec.md`](./auto-layout.spec.md) — deterministic layout helpers for arranging shapes within frames.
- [`speaker-notes.spec.md`](./speaker-notes.spec.md) — speaker notes surface and visibility toggles.
- [`inspect.spec.md](./inspect.spec.md) - load an existing presentation, understand its content and make edits.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
## Visual Workflow

```mermaid
flowchart TD
  A[Start Here] --> B[Read Scope and Prerequisites]
  B --> C[Run the Documented Workflow]
  C --> D[Validate with Repo Tooling]
  D --> E[Open PR or Hand-off]

  classDef start fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:#1B5E20;
  classDef prep fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:#0D47A1;
  classDef run fill:#FFF3E0,stroke:#EF6C00,stroke-width:2px,color:#E65100;
  classDef gate fill:#F3E5F5,stroke:#6A1B9A,stroke-width:2px,color:#4A148C;
  classDef done fill:#E0F2F1,stroke:#00695C,stroke-width:2px,color:#004D40;

  class A start;
  class B prep;
  class C run;
  class D gate;
  class E done;
```

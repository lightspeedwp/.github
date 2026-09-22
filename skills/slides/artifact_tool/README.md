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
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
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
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
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

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

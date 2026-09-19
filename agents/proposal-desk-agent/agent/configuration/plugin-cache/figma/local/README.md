# Figma Plugin

[![License: GPL v3 or later](https://img.shields.io/badge/License-GPL%20v3%20or%20later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

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

This plugin packages Figma-driven design-to-code workflows in
`plugins/figma`.

It currently includes these skills:

- `figma-implement-design`
- `figma-code-connect`
- `figma-create-design-system-rules`
- `figma-create-new-file`
- `figma-generate-design`
- `figma-generate-library`
- `figma-use`

## What It Covers

- translating Figma frames and components into production-ready UI code
- inspecting design context and screenshots through the connected Figma tools
- creating parserless Code Connect template files for published Figma components
- generating project-specific design system rules for Figma-to-code workflows
- creating or updating full screens and design system libraries in Figma
- creating new Figma or FigJam files when needed for a workflow

## Plugin Structure

The plugin now lives at:

- `plugins/figma/`

with this shape:

- `.codex-plugin/plugin.json`
  - required plugin manifest
  - defines plugin metadata and points Codex at the plugin contents

- `.app.json`
  - plugin-local app dependency manifest
  - points Codex at the connected Figma integration used by the bundled skills

- `agents/`
  - plugin-level agent metadata
  - currently includes `agents/openai.yaml` for the OpenAI surface

- `skills/`
  - the actual skill payload
  - each skill keeps the normal skill structure (`SKILL.md`, optional
    `agents/`, `references/`, `assets/`, `scripts/`)

- `assets/`
  - plugin-level icons referenced by the manifest

- `commands/`, `hooks.json`, `scripts/`, and `ui/`
  - example convention directories kept alongside the imported workflow bundle

## Notes

This plugin is app-backed through `.app.json` and uses the connected Figma
integration for the bundled skills. The workflows assume that the Figma tools
are available and that the user can supply Figma URLs with node IDs when
needed.

The current skill set is focused on these workflows:

- implementing designs from Figma with high visual fidelity
- creating parserless Code Connect templates for published Figma components
- generating durable project rules for future Figma-to-code work
- creating or updating Figma files, screens, and design system libraries

Use of the Figma skills and related files is governed by the Figma Developer
Terms. See `LICENSE.txt` and the per-skill license files for details.

This public repo keeps the bundled skills plus the example command, hook, and UI
scaffolding alongside the app-backed plugin wiring

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_

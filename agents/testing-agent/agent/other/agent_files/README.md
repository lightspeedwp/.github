# Playwright Testing Agent Asset Pack

[![License: GPL v3 or later](https://img.shields.io/badge/License-GPL%20v3%20or%20later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

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

## Purpose

This file set supports the Playwright Testing Agent's recurring work: turning requirements, design evidence, repository context, and QA expectations into traceable human-readable test cases and maintainable Playwright outputs.

## Folder map

- `examples/` — worked examples that show expected shape and quality
- `fixtures/` — sample inputs and test data for validation and scenario work
- `profiles/` — reusable testing profiles and operating defaults
- `prompts/` — recurring maintenance prompts for audits, README refreshes, and validation tightening
- `schemas/` — validation contracts for structured outputs and agent files
- `scripts/` — validation and maintenance scripts
- `tests/` — validation checklists and test guidance

## Recommended maintenance workflow

1. Start from the relevant example, fixture, profile, schema, or prompt for the maintenance slice you are working on.
2. Keep the matching validation guidance in `tests/` and `scripts/` aligned with the current structure.
3. Use `fixtures/` for sample source material and failure payloads.
4. Use `profiles/` when a reusable testing mode or QA posture applies.
5. Use `prompts/` for recurring audit or cleanup passes.
6. Run the validation scripts in `scripts/` before finalising file-quality changes.

## Canonical location rules

- `schemas/` is the canonical home for validation contracts.
- `examples/` provides worked output examples and should not be treated as validation contracts.
- `fixtures/` contains sample inputs and scenario data, not final output examples.
- `profiles/` contains reusable operating guidance for recurring testing contexts.
- `prompts/` contains recurring maintenance prompts, not validator logic.
- `scripts/` and `tests/` define the validation layer and maintainer checks.

## Duplicate handling rule

Remove files only when they are exact duplicates. Similar names across `examples/`, `schemas/`, `fixtures/`, `profiles/`, and `prompts/` usually reflect different roles and should be kept unless content proves otherwise.

## Validation entry points

- Primary folder validation entry point: `bash scripts/validate-folder-schemas.sh`
- Targeted validators live in `scripts/`
- Validation checklist and test guidance: `tests/schema-validation-tests.md`
- Current validation alignment expects example-to-schema references and no `templates/` folder in the pack.

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

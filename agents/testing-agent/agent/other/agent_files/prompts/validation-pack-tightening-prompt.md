# Validation-Pack Tightening Prompt

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs%20Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling%20Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main%20Branch%20Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata%20Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template%20Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate%20PR%20Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges:%20Documentation%20Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges:%20Health%20Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges:%20README%20Status%20Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges:%20Workflow%20Inventory%20Audit-OK-success.svg)
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

## Purpose

Use this recurring prompt to tighten the validation layer across validation docs, scripts, tests, and related consistency guidance.

## Prompt

Audit and tighten the validation pack so the current validation layer is accurate, deterministic, and aligned to the real asset-pack structure.

Primary goal:

- make validation docs, scripts, tests, and related references agree with each other and with the actual file tree
- tighten outdated, vague, or inconsistent validation expectations
- leave the validation layer actionable and non-blocking for current maintenance work

Scope priorities:

1. validation entry points and validator scripts
2. validation checklists, tests, and validation-focused documentation
3. README and reference wording that materially affects validation accuracy
4. only then nearby examples or notes that should match the same validation rules

Required working rules:

- Treat the real file tree and current validator entry points as source of truth.
- Prefer deterministic checks and actionable wording.
- Keep rule names, file paths, and folder references exact.
- Do not invent validators, schemas, files, or coverage claims that are not grounded.
- Preserve conservative duplicate handling and current optional-versus-required distinctions.

During the pass:

- compare validation docs against current scripts, folders, and files
- tighten wording where checks refer to stale paths, stale rules, or outdated assumptions
- review linked tests and reference notes that materially affect validator accuracy
- improve consistency around optional coverage, skip behaviour, and pass criteria
- keep edits focused on validation quality rather than broader documentation cleanup

Output requirements:

1. short validation-pack audit summary
2. exact files updated
3. any remaining non-blocking tightening opportunities
4. explicit confirmation that nothing in the validation layer remains blocking for the current structure

Validation expectation:

- Run the documented validation entry point when validation-sensitive files change.
- Prefer actionable validator language with concrete file paths and rule names where possible.

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_

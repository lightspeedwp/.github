# fixtures

[![License: GPL v3 or later](https://img.shields.io/badge/License-GPL%20v3%20or%20later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

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

This folder contains sample inputs, excerpts, and failure payloads used for validation, scenario work, and testing support.

## Naming conventions

- Use descriptive kebab-case names.
- Prefer the `sample-` prefix for reusable sample data.
- Keep fixture names tied to the artifact or source they simulate.

## Current file inventory

- `README.md`

## Maintenance rules

- Fixtures are sample source material or payloads, not canonical templates.
- Keep fixtures safe for testing and free of secrets or live customer data.
- If reusable fixture files are added later, update this inventory so the validation reference layer stays accurate.

---

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

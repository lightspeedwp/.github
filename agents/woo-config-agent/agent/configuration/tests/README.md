# Tests

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

Use this folder for QA sources, validation guidance, regression triggers, scenario plans, and launch-readiness checklists that support the WooCommerce Configuration Agent.

These files are the validation and QA support layer. They help maintainers test the agent, check documentation drift, and review output quality, but they do not replace the canonical policy and standards in `references/`, the structured contracts in `schemas/`, or the runnable validators in `scripts/`.

## Current folder position in the agent structure

Treat the current attached maintenance structure as:

- `references/` — durable standards, conventions, and maintenance workflows
- `schemas/` — structured validation and output contracts
- `scripts/` — runnable validators, validation runners, and helper scripts
- `tests/` — QA sources, scenario coverage, regression checklists, and validator support material

Do not infer unattached folders or missing assets from this README. If local memory guidance is attached elsewhere, that guidance owns memory structure; this folder only documents the grounded `tests/` contents.

## Naming conventions

Use practical names that make the file's role obvious:

- `test-plan-<feature>.md` for scoped test plans
- `qa-checklist-<feature>.md` for review checklists
- `regression-<scope>.md` or `regression-checklist-<scope>.md` for regression triggers
- `<topic>-consistency-source.md` for source snapshots used by validators
- `<topic>-readme.md` only when a file is intentionally a focused guide
- `scenario-<topic>.md` for realistic workflow validation scenarios

## File inventory

This inventory covers the currently grounded files in the attached `tests/` folder.

### Core validation and QA guides

- `schema-validation-tests.md` — canonical test-side reference for current file-family validation expectations
- `validation-readme.md` — maintainer guide for the validation pack and validation use
- `scenario-validation-workflows.md` — scenario-based workflow coverage for realistic WooCommerce outputs and follow-up handling
- `master-qa-checklist.md` — top-level QA flow for launch review and handoff
- `regression-checklist-master-validation.md` — trigger guide for when a full validation pass should run

### Scenario plans and launch checklists

- `test-plan-gravity-forms.md` — Gravity Forms test plan
- `test-plan-file-schema-validation.md` — test plan for schema and file-validation behaviour
- `qa-checklist-file-schema-validation.md` — QA checklist for schema and file validation
- `pre-launch-qa-checklist.md` — launch-readiness review checklist
- `seo-launch-checklist.md` — SEO-focused launch checklist

### Validator source snapshots

- `instruction-file-consistency-source.md` — source snapshot for instruction/file consistency validation
- `app-usage-consistency-source.md` — source snapshot for app-usage validation
- `starter-prompt-consistency-source.md` — source snapshot for starter-prompt validation
- `short-description-consistency-source.md` — source snapshot for short-description validation

## Recommended usage order

1. Start with `validation-readme.md` for validation scope, run order, and failure guidance.
2. Run `bash scripts/run-master-validation.sh` for the standard full validation pass.
3. Use `schema-validation-tests.md` for file-family structure expectations.
4. Use `scenario-validation-workflows.md` to confirm realistic behaviour for the workflow that changed.
5. Use the relevant checklist or test plan for the feature or workflow under review.
6. Use the consistency source files when updating or validating instructions, app-usage guidance, or ChatGPT presentation fields.
7. Use `regression-checklist-master-validation.md` to decide when a full validation run is required.

## Canonical role rules

- Treat `schema-validation-tests.md` as the canonical test-side reference for current folder and schema validation expectations.
- Treat `validation-readme.md` as the main maintainer guide for the validator pack.
- Treat `scenario-validation-workflows.md` as the main scenario-coverage file.
- Treat the `*-consistency-source.md` files as validator inputs, not user-facing reference docs.
- Treat the checklists and test plans as QA scaffolds, not runtime memory or policy files.
- Keep this folder aligned with the actual `scripts/` validators and the actual `schemas/` assets they validate.

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

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

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

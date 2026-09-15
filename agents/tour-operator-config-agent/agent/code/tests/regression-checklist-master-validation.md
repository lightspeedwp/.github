# Regression Checklist: Master Validation

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
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use this checklist to decide when to run `bash scripts/run-master-validation.sh` after changes to docs, schemas, scripts, or instructions.

## Run master validation after doc changes

Run the master validator when you change:

- `README.md` files in any project folder
- QA checklists, test plans, or validation guides in `tests/`
- standards, policies, or naming guidance in `references/`
- examples or templates that are referenced by docs or instructions

Reason:

- doc edits can break file references, expected paths, and QA flow consistency

## Run master validation after schema changes

Run the master validator when you change:

- any `*-schema.json` file in `schemas/`
- validation schema files such as:
  - `schemas/template-file-validation-schema.json`
  - `schemas/example-file-validation-schema.json`
  - `schemas/schema-file-validation-schema.json`
  - `schemas/memory-file-validation-schema.json`
- required fields, object shape, or validation conventions used by templates or examples

Reason:

- schema changes can break JSON parsing, structural assumptions, and file-quality checks

## Run master validation after script changes

Run the master validator when you change:

- `scripts/run-master-validation.sh`
- `scripts/validate-folder-schemas.sh`
- `scripts/validate-file-naming.py`
- `scripts/validate-reference-links.py`
- `scripts/validate-app-usage-consistency.py`
- `scripts/validate-starter-prompts.py`
- `scripts/validate-short-description-consistency.py`
- `scripts/validate-instruction-file-consistency.py`
- any helper script that affects validation behavior or referenced file paths

Reason:

- script changes can break the validation chain or make results misleading

## Run master validation after instruction changes

Run the master validator when you change:

- the main agent instructions
- file references mentioned in the instructions
- app-related instruction guidance for attached tools
- QA workflow references in the instructions
- default validation or launch-review behavior in the instructions

Reason:

- instruction changes can drift away from attached files, test assets, app usage, and QA workflows

## Run master validation after ChatGPT presentation changes

Run the master validator when you change:

- the short description
- starter prompts
- starter prompt titles, descriptions, or prompt text
- presentation guidance snapshots in `tests/`

Reason:

- presentation changes can drift away from the agent's current role and core workflows

## Run master validation after structural file moves or renames

Run the master validator when you:

- rename files used by docs, tests, scripts, or instructions
- move files between `templates/`, `examples/`, `schemas/`, `memory/`, `tests/`, `references/`, or `scripts/`
- add a new reusable validation asset that should be included in the existing checks

Reason:

- renames and moves commonly break reference-link and instruction-file consistency checks

## Quick decision rule

Run `bash scripts/run-master-validation.sh` if a change affects any of these:

- file paths
- validation logic
- schema structure
- documented QA flow
- app guidance for attached tools
- ChatGPT presentation fields
- instruction-linked files

## Sign-off

- [ ] I changed docs, schemas, scripts, instructions, or file structure
- [ ] I ran `bash scripts/run-master-validation.sh`
- [ ] I reviewed any failures and fixed them
- [ ] I reran the validator until the full chain passed

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

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

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

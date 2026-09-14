# Validation README

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

Use this file as the central guide for the WordPress agent's validation assets, checks, and runners.

## Primary validation runner

Run the full validation chain with:

`bash scripts/run-master-validation.sh`

This is the default validation entry point after meaningful changes to instructions, files, schemas, templates, examples, memory, validation scripts, starter prompts, short description, or app guidance.

## Included validators

### File and schema validation

- `bash scripts/validate-folder-schemas.sh`
- `python3 scripts/validate-file-naming.py`
- `python3 scripts/validate-reference-links.py`
- `python3 scripts/validate-instruction-file-consistency.py`

### App, memory, and structure consistency

- `python3 scripts/validate-app-usage-consistency.py`
- `python3 scripts/validate-memory-contents.py`
- `python3 scripts/validate-agent-structure.py`

### Presentation consistency

- `python3 scripts/validate-starter-prompts.py`
- `python3 scripts/validate-short-description-consistency.py`

## Source snapshots

These validation checks rely on current WordPress-aligned source snapshots in `tests/`:

- `tests/agent-structure-validation-source.md`
- `tests/app-usage-consistency-source.md`
- `tests/instruction-file-consistency-source.md`
- `tests/starter-prompt-consistency-source.md`
- `tests/short-description-consistency-source.md`
- `tests/schema-validation-tests.md`

Keep these snapshots aligned when the instructions, attached apps, starter prompts, short description, or validation structure changes.

## When to run validation

Run the master validator after changes to:

- instructions and instruction-linked files
- app-related guidance
- memory guidance or memory files
- templates, examples, fixtures, profiles, or schemas
- validation scripts or helper scripts
- starter prompts or short description
- file moves, renames, or support-folder changes

## QA flow references

Use these companion files alongside the validation scripts:

- `tests/master-qa-checklist.md`
- `tests/regression-checklist-master-validation.md`
- `tests/schema-validation-tests.md`
- `tests/pre-launch-qa-checklist.md`
- `tests/seo-launch-checklist.md`
- `tests/test-plan-gravity-forms.md`

## Best practice

- Prefer the master runner for broad checks.
- Refresh the source snapshots whenever the WordPress operating model changes.
- Treat validation failures as drift signals, not just script errors.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

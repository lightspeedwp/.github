# Schema Validation Tests

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
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use this file as the canonical validation checklist for reusable files in:

- `examples/` when example files are attached
- `schemas/`
- `memory/` when memory files are attached

Run the helper script first:

`bash scripts/validate-folder-schemas.sh`

## Validation goals

- keep reusable files in the correct folders
- enforce filename and structure conventions
- require expected headings for attached example files when examples are present
- confirm schema files parse as valid JSON
- catch drift between schemas, examples, memory guidance, prompt-library guidance, and the validation documentation
- avoid overclaiming schema coverage for routed skills that do not currently have an attached schema file

## Folder coverage

This section describes the folder families the current schema validator is responsible for checking.

### `examples/`

Validate:

- filename follows the example naming convention when example files are attached
- file starts with a level-1 example title
- required headings are present for attached example files
- files contain filled example content instead of blank example stubs

### `schemas/`

Validate:

- filename ends with `-schema.json`
- file parses as valid JSON
- schema has a non-empty `title`
- root `type` is `object`
- `properties` exists and is not empty

Schema files currently in scope:

- `schemas/enquiry-form-schema.json`
- `schemas/site-discovery-schema.json`
- `schemas/template-file-validation-schema.json`
- `schemas/example-file-validation-schema.json`
- `schemas/schema-file-validation-schema.json`
- `schemas/memory-file-validation-schema.json`
- `schemas/gravity-forms-plan-schema.json`
- `schemas/yoast-audit-output-schema.json`

Current route-to-schema notes:

- `woocommerce-site-discovery` currently has `schemas/site-discovery-schema.json`
- `gravity-forms-configuration` currently has `schemas/gravity-forms-plan-schema.json`
- `yoast-auditor` currently has `schemas/yoast-audit-output-schema.json`
- other routed local skills may still be validated through documentation, prompts, tests, and instructions even when they do not currently have a dedicated attached schema file
- do not treat the absence of a dedicated accessibility schema as drift unless such a schema is later attached or explicitly added

### `memory/`

Validate:

- filename is lowercase markdown when memory files are attached
- file starts with a level-1 title
- required headings are present for attached memory files
- durable preferences stay separate from active working notes

## Pass criteria

- The helper script exits successfully.
- No required heading is missing from attached example or memory files.
- No schema file fails JSON parsing.
- No example or schema file drifts from its expected structure.
- No memory file mixes durable preferences with active task-tracking structure.
- Validation docs do not imply schema coverage that the current attached file tree does not provide.

## Failure handling

If a check fails:

- restore or add missing headings
- fix stale or mismatched example structure
- fix invalid JSON in schema files
- split mixed memory content into the correct memory files
- correct validation wording that overstates current schema coverage
- rerun `bash scripts/validate-folder-schemas.sh` until it passes

---

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

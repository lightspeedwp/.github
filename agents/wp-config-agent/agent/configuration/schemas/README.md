# Schemas

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

Use this folder for structured data models, schema assets, and validation rules that support the agent’s WordPress outputs and maintenance workflow.

## Folder purpose

This folder is the canonical schema and validation layer for the current file structure.

Use it for:

- WordPress workflow schemas
- file-structure validation schemas
- memory validation schemas
- schema assets used by templates, examples, and instructions

## How this folder relates to the rest of the structure

- `schemas/` defines the structured rules used to validate files and outputs.
- `scripts/` runs validation against the files in this folder and the folders it governs.
- `templates/` and `examples/` depend on schema coverage where structured validation is needed.
- `memory/` is validated against the memory-related schemas here.
- `references/` provides the standing guidance that these schemas help enforce.

## Current file inventory

- `README.md` — maintenance guide for the schema layer
- `enquiry-form-schema.json` — schema for enquiry-form planning and validation
- `site-discovery-schema.json` — schema for site-discovery outputs
- `template-file-validation-schema.json` — validation schema for files in `templates/`
- `example-file-validation-schema.json` — validation schema for files in `examples/`
- `schema-file-validation-schema.json` — validation schema for JSON schema files in `schemas/`
- `memory-file-validation-schema.json` — validation schema for durable working-memory files in `memory/`
- `memory-entry-schema.json` — schema for structured memory-entry validation and consistency checks

## Naming conventions

Recommended patterns:

- `<workflow>-schema.json`
- `<folder>-file-validation-schema.json`
- `<entity>-schema.json`

Keep names explicit about whether the schema validates a workflow payload, a file type, or a folder convention.

## Validation notes

Use these schemas together with the validation scripts in `scripts/`.

In practice:

- `template-file-validation-schema.json` supports template validation
- `example-file-validation-schema.json` supports example validation
- `schema-file-validation-schema.json` supports schema self-validation
- `memory-file-validation-schema.json` and `memory-entry-schema.json` support memory consistency and hygiene work

## Maintenance notes

- Update schema inventories when new schema files are added.
- Keep schema names aligned with the files or workflows they validate.
- When templates, examples, or memory rules evolve, review the corresponding schema coverage.

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

# QA Checklist: File Schema Validation

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

Use this checklist as the standard validation flow for reusable files in `templates/`, `examples/`, `schemas/`, and `memory/`.

## When to run

- Before treating a new reusable file as a standard project artifact
- After editing file structure in `templates/`, `examples/`, `schemas/`, or `memory/`
- Before launch-readiness reviews that depend on these files being consistent
- Before handing the agent to another collaborator or using the files as repeatable references

## Standard validation flow

### 1. Run the automated validator

Run:

`python3 scripts/file-schema-validator.py`

Pass condition:

- The script finishes with a success result and no validation errors.

### 2. Confirm folder coverage

Check that the intended files are in the correct folders:

- reusable structures in `templates/`
- worked examples in `examples/`
- structured JSON schemas in `schemas/`
- durable continuity files in `memory/`

Pass condition:

- No file belongs in a different folder based on its purpose.

### 3. Review template files

Confirm each relevant template file:

- uses the expected filename pattern
- starts with a clear level-1 title
- keeps reusable blank placeholders instead of worked example content
- includes all required section headings

Pass condition:

- Templates are reusable and structurally complete.

### 4. Review example files

Confirm each relevant example file:

- uses the expected example naming pattern
- starts with an example title
- includes concrete filled content
- matches the expected section structure for its template family where applicable

Pass condition:

- Examples are realistic, filled, and easy to copy from.

### 5. Review schema files

Confirm each relevant schema file:

- is valid JSON
- has a non-empty title
- uses an object root when expected
- defines non-empty properties
- uses required fields where the structure depends on them

Pass condition:

- Schemas are structurally usable for validation and planning.

### 6. Review memory files

Confirm each relevant memory file:

- has a stable, descriptive filename
- starts with a clear level-1 title
- includes the required sections for its role
- keeps stable preferences separate from active work and short-term follow-ups

Pass condition:

- Memory stays organized and useful across future sessions.

### 7. Resolve failures

If the validator fails or the manual review finds drift:

- move misplaced content into the correct folder
- restore missing headings
- split templates and examples if one file is doing both jobs
- fix invalid or incomplete schema files
- separate durable preferences from active task tracking in memory files

Pass condition:

- Re-run `python3 scripts/file-schema-validator.py` and confirm it passes after fixes.

## Sign-off

- [ ] Automated validator passed
- [ ] Folder placement is correct
- [ ] Template files are reusable
- [ ] Example files contain real sample content
- [ ] Schema files are structurally valid
- [ ] Memory files keep durable and active context separate
- [ ] Issues found during review were corrected and rechecked

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

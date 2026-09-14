# Reference and assets reconciliation prompt

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

Reconcile the support files for a local `tour-operator-website` skill strictly from `prompts/tour-operator-website`.

This phase makes the support layer package-safe without inventing placeholders or silently dropping required material.

## Goal

Determine which references, scripts, assets, schemas, examples, memory files, and validation notes belong in the packaged local skill, and repair only clearly evidenced support-layer gaps.

## Inputs

Use only:

- `prompts/tour-operator-website` as the single source of truth
- the verified inventory from `01-source-audit-prompt.md`
- the package contract from `02-package-contract-prompt.md`
- the entrypoint decisions from `03-skill-entrypoints-prompt.md`

## Scope

Inspect and reconcile, where present and relevant:

- `references/`
- `assets/`
- `scripts/`
- `schemas/`
- `examples/`
- `memory/`
- any package-local helper file referenced by entrypoints or support indexes

## Required work

- Verify every support path referenced by `SKILL.md`, `agents/openai.yaml`, and package README-style files.
- Separate support material into:
  - required and verified
  - optional but verified
  - referenced but missing or unreadable
  - present but excluded by the package contract
- Keep reference indexes aligned with the files that are actually present.
- Repair only source-backed mismatches such as stale relative paths, stale file names, or outdated inventory wording.
- Preserve exact current files and wording when they are already correct.
- If a missing support file appears to be required for a valid package, flag it as a blocker instead of inventing a replacement.

## Anti-invention rules

- Do not fabricate example files, validation scripts, assets, schemas, icons, or reference standards.
- Do not remove difficult files merely to make the package look cleaner.
- Do not convert package-source notes into runtime promises.
- Do not claim the support layer is complete unless the referenced files are actually verified.

## Validation expectations

After support-layer edits:

- verify referenced relative paths resolve inside the source folder
- verify index files do not list files that are absent from the source folder
- verify the package contract still matches the support layer

## Deliverables

1. List required support files verified for packaging.
2. List optional support files verified for packaging.
3. List missing or unreadable referenced files that still block safe packaging.
4. List exact files edited.
5. Name the next safe phase.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

# Scripts

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

Use this folder for reusable validation scripts and audit helpers for the Tour Operator Website Configuration Agent.

## Folder purpose

This folder contains:

- the master validation runner
- file-tree and reference validators
- agent-presentation consistency validators
- instruction-linked file and routing consistency validators
- memory validation helpers
- practical shell helpers for audit support

## How to use this folder

- Run `bash scripts/run-master-validation.sh` as the standard full validation pass.
- Use individual validators when you are working on one narrow area and need faster feedback.
- Treat shell helpers as practical support tools, not as the source of truth for file standards.

## Naming conventions

Prefer these patterns where practical:

- `run-<workflow>.sh`
- `validate-<target>.py`
- `<topic>-helper.sh`

## Current file inventory

### Validation runner

- `run-master-validation.sh`

### Validation scripts

- `validate-folder-schemas.sh`
- `validate-file-naming.py`
- `validate-reference-links.py`
- `validate-app-usage-consistency.py`
- `validate-starter-prompts.py`
- `validate-short-description-consistency.py`
- `validate-instruction-file-consistency.py`
- `validate-agent-structure.py`
- `validate-memory-files.py`
- `file-schema-validator.py`

### Helper scripts

- `content-audit-helper.sh`
- `wp-audit-helper.sh`

## Validation chain

`run-master-validation.sh` currently runs the validation chain in this order:

1. folder schema validation
2. file naming validation
3. reference-link validation
4. app-usage consistency validation
5. starter-prompt consistency validation
6. short-description consistency validation
7. instruction-file consistency validation
8. required structure validation
9. memory validation
10. reusable file schema validation

## Validator notes

- `validate-instruction-file-consistency.py` checks instruction-linked file references against the current source snapshot in `tests/instruction-file-consistency-source.md`.
- That source snapshot also depends on `tests/skill-routing-snapshot.md` to keep instruction-linked routing references aligned with the currently attached specialist skills.
- `validate-folder-schemas.sh` now treats `templates/`, `examples/`, and `memory/` as conditional scope and skips those folders when they are not present in the current attached file tree.
- `validate-memory-files.py` now skips cleanly when `memory/` is not present in the current attached file tree.
- `validate-agent-structure.py` now checks the current attached validation and reference pack instead of assuming older missing example or reference assets still exist.
- When routing posture changes, update the linked test snapshots before relying on the validator output.

## Maintenance rules

- Keep the runner order in this README aligned with `run-master-validation.sh`.
- If a validator is added, removed, or renamed, update this README and `tests/validation-readme.md` together.
- If routing-related validation fixtures change, keep this README aligned with `tests/README.md` and `tests/validation-readme.md`.
- Keep validator descriptions practical and path-specific so maintainers can trace failures quickly.

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

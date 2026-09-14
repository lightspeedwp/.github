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

Use this folder for reusable test plans, validation checklists, regression checks, source snapshots, routing snapshots, and validation guidance for the Tour Operator Website Configuration Agent.

## Folder purpose

This folder supports QA and validation work for:

- the agent's file tree and file references
- validation runner behaviour
- instruction-to-file consistency
- attached-skill routing and routing anti-drift checks
- app-usage consistency
- starter-prompt and short-description consistency
- Tour Operator, Gravity Forms, SEO, and launch-readiness QA assets

## Recommended usage order

1. Start with `validation-readme.md` for the validation overview and runner guidance.
2. Use `regression-checklist-master-validation.md` to decide when a full validation pass is required.
3. Run `bash scripts/run-master-validation.sh` for the automated validation chain when a broad check is needed.
4. Use targeted plans, checklists, and source snapshots for the specific area under review.
5. Refresh source snapshot files in `tests/` when the linked agent configuration, routing posture, or validation ownership changes.

## Naming conventions

Prefer these patterns where practical:

- `test-plan-<topic>.md`
- `qa-checklist-<topic>.md`
- `regression-checklist-<topic>.md`
- `<topic>-consistency-source.md`
- `<topic>-snapshot.md`
- `<topic>-validation.md`

## Current file inventory

### Validation guidance and regression

- `validation-readme.md`
- `regression-checklist-master-validation.md`
- `schema-validation-tests.md`

### QA checklists and test plans

- `master-qa-checklist.md`
- `pre-launch-qa-checklist.md`
- `seo-launch-checklist.md`
- `test-plan-gravity-forms.md`
- `test-plan-file-schema-validation.md`
- `qa-checklist-file-schema-validation.md`

### Source snapshots for validators and routing checks

- `instruction-file-consistency-source.md`
- `skill-routing-snapshot.md`
- `app-usage-consistency-source.md`
- `starter-prompt-consistency-source.md`
- `short-description-consistency-source.md`

## Maintenance rules

- Keep this folder focused on reusable QA and validation assets rather than one-off task notes.
- Treat source snapshot files as supporting fixtures for validators, not as long-form reference docs.
- Keep routing snapshots aligned with the currently attached specialist skills and current instruction routing.
- Make sure Tour Operator routing checks reflect the current attached routing posture rather than implying an unattached Tour Operator specialist skill.
- Treat attached-skill routing status and skill-package readability as separate checks; routing snapshots may confirm attachment and ownership without proving that the package files were opened successfully.
- Update this README when files are added, removed, renamed, or repurposed.
- If another folder becomes part of the validation flow, reflect that change here and in `validation-readme.md`.

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

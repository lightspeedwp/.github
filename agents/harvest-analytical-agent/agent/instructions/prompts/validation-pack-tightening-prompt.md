# Validation-Pack Tightening Prompt

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

Use this recurring prompt when the validation pack needs a broader tightening pass so validators, tests, notes, and related references stay aligned with the current instructions and file tree.

## Prompt

Audit and tighten this agent's validation pack so the validators, validation notes, tests, and related references remain consistent with the current instructions, attached files, and folder structure.

Scope:

- validator scripts and validation notes
- validation-oriented tests and fixtures
- validation templates, schemas, examples, and references where they materially support the validation layer
- nearby maintenance files that define validation order, severity, or reporting expectations

Primary goal:

- reduce drift across the validation pack without widening into unrelated product, reporting, or feature changes

Working rules:

1. Use the current attached file tree as the source of truth.
2. Tighten the validation pack conservatively: prefer targeted fixes over large rewrites.
3. Keep validator names, file references, test sources, templates, schemas, and severity wording aligned.
4. Update nearby maintenance notes when they materially affect validation correctness.
5. Do not invent missing validators, files, folders, templates, schemas, examples, or runtime behaviour.
6. Preserve existing behaviour unless an update is needed to remove contradiction, stale wording, or misleading validation guidance.
7. Keep all audit and maintenance language in plain UK English.

Specific checks:

- confirm validator documentation matches the validator scripts that actually exist
- confirm validation tests still match the current instruction language and current file references
- remove stale references to old folders, memory paths, renamed references, or outdated examples
- align validation severity wording, validation order, and report-format notes across the pack
- tighten any test or note that would leave the validation layer misleading, incomplete, or harder to maintain
- flag out-of-scope issues rather than folding unrelated cleanup into this pass

Deliverables:

1. A short validation-pack audit summary.
2. The exact files updated.
3. A concise list of the main validation inconsistencies corrected.
4. A short note on anything left out because it was outside validation-pack scope.

Success condition:

- the validation pack is coherent, current, and aligned with the agent's present instructions and attached file tree

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

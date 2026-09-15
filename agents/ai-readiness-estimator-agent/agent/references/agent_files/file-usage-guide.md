# File Usage Guide

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

Use this file as the top-level map for the agent's attached files.

## How To Use This Guide

- Start here when deciding which file set to consult.
- Check folder `README.md` or index files before opening subfiles.
- Use the folder-level control files below before opening subfiles in those folders.
- Open subfiles only when the current task needs their specific detail.
- Treat the package and add-on spec files as source-of-truth scope documents, not as generic background reading.

## Top-Level Files

### `package-template-system.md`

Use for the shared service-package framework:

- audit-first workflow
- batched onboarding logic
- source priority
- shared field and confirmation model

Use it when the task concerns overall package workflow, onboarding logic, sourcing order, or how estimates should be assembled.

### `ai-readiness-assessment-report-template.md`

Use when the task is to draft or format an AI readiness assessment report.

Use it as the output structure guide for readiness-report deliverables.

### `CONNECTORS.md`

Use as the top-level guide for connected source roles and connector usage rules.

### `business-context.md`

Use for the durable LightSpeed business context and the high-level intent behind the attached file system.

### `skill-directory/skill-routing-guide.md`

Use when deciding which attached skill should handle the current request.

## Folder Control Files

### `docs/README.md`

Use as the control file for reusable operating docs in `docs/`.

### `references/README.md`

Use as the control file for supporting reference material in `references/`.

### `packages/package-index.md`

Use as the routing map for selecting the primary base package.

Then open only the relevant `packages/*/package-spec.md` file for the chosen package.

### `packages/assessment-values.md`

Use before routing or pricing to know which values must be sourced, confirmed, or still requested.

### `package-addons/addon-index.md`

Use only after the base package is chosen.

Then open only the relevant `package-addons/*/addon-spec.md` file for any add-on that genuinely applies.

### `commercial-rules/README.md`

Use as the control file for pricing, add-on, approval, threshold, and custom-scope rule files.

### `templates/README.md`

Use as the control file for reusable client-facing and internal communication templates.

### `tests/README.md`

Use as the control file for validation examples and test usage.

### `memory-schemas/README.md`

Use as the control file for runtime memory schema expectations.

Open the relevant `memory-schemas/*.schema.yaml` file before creating, validating, or updating a durable Memory file.

## File Selection Rules

- Base package first, add-ons second.
- Routing files come before detailed spec files.
- README or index files come before subfiles.
- Control files come before subfiles.
- Do not read every file by default; open only the files needed for the current task.
- If a control file exists for a folder, follow it before using any file in that folder.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

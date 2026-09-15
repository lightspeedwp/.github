# GitHub Project Operations Spec

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

Canonical source for LightSpeed GitHub project operations across issue and PR metadata, branching conventions, and GitHub Projects usage.

## Purpose

Keep contributor docs lean and current by describing operational rules while treating live config and workflows as the source of automation truth.

## Canonical Automation Sources

- `.github/labels.yml` (canonical labels)
- `.github/labeler.yml` (branch/file-to-label mappings)
- `.github/issue-types.yml` (issue-type mappings)
- `.github/issue-fields.yml` (project field mappings and defaults)
- `.github/workflows/labeling.yml` (label automation)
- `.github/workflows/metadata-governance.yml` (assignee, milestone, and relationship metadata)
- `.github/workflows/project-meta-sync.yml` (project field sync)

## Unified Project Template Model

Use one unified template with two profile presets:

- `client_delivery`
- `product_delivery`

Both profiles share one field model and one automation contract. Profile differences should stay in view presets, milestones, and cadence naming only.

### Shared Baseline

- Fields: `Status`, `Priority`, `Type`, `Start date`, `Target date`, `Parent issue`, `Sub-issue progress`, plus approved custom issue fields from `.github/issue-fields.yml`.
- One issue type per issue.
- Labels are routing and automation signals; fields are project operating state.

### Profile Deltas

- `client_delivery`: UAT and go-live naming emphasis (for example milestone naming and views).
- `product_delivery`: release train emphasis (for example `vX.Y.Z` milestone views).

## Branching Contract

### Required Core Prefixes

`feat/`, `fix/`, `hotfix/`, `release/`, `refactor/`, `chore/`, `docs/`, `test/`, `perf/`, `ci/`, `build/`, `deps/`, `security/`, `revert/`, `research/`, `design/`, `a11y/`, `ux/`, `i18n/`, `ops/`

### Optional Profile Prefixes

- Product-oriented optional: `proto/`, `ds/`, `api/`, `schemas/`, `telemetry/`
- Client-oriented optional: `content/`, `seo/`, `config/`, `migrate/`, `qa/`, `uat/`

Rule: branch guidance must remain aligned to actual prefix handling in `.github/labeler.yml`.

## Issue and PR Metadata Contract

### Required Label Families

For issues and PRs, enforce one-hot families:

- exactly one `status:*`
- exactly one `priority:*`
- exactly one `type:*`

Use at least one scope label where relevant (`area:*` or `comp:*`).

### Changelog Meta Labels

- `meta:needs-changelog`: default for user-facing work.
- `meta:no-changelog`: internal-only changes with no user-facing impact.
- Never apply both on the same item.

### Template Guardrails

Template labels must remain canonical and pass:

- `node scripts/agents/includes/check-template-labels.js`

## Project Meta Sync Contract (Current State)

`project-meta-sync.yml` currently synchronises project fields through canonical derivation for:

- `Status`
- `Priority`
- `Type`
- `Effort`
- `Start date` and `Target date` when `status:ready` or `status:in-progress` is present

Derivation source notes:

- `Status`, `Priority`, and `Type` are mapped from labels via `.github/issue-fields.yml` mappings.
- `Effort` uses the configured default from canonical issue-fields configuration.
- `Type` and `Priority` now fall back to safe content-based inference when labels are missing or late.
- `Start date` and `Target date` are populated when kickoff-ready metadata is present (`status:ready` or `status:in-progress`) and the workflow reprocesses label changes so fields can catch up after triage.
- Metadata governance for assignees, milestones, and relationships is handled separately by `.github/workflows/metadata-governance.yml`.

Current preflight conditions must be satisfied before sync runs:

- `LS_PROJECT_URL`
- `LS_APP_ID`
- `LS_APP_PRIVATE_KEY`

Safe automation boundary:

- Active write path covers the five core derived fields plus kickoff-aware date handling.
- Additional direct issue-field writes are out of scope until a dedicated follow-up verification approves extension.

Verification reference: `.github/reports/audits/2026-06-07-private-project-issue-field-write-verification-879.md`.

## Minimum Validation Set

```bash
npx markdownlint-cli2 "**/*.md"
git diff --check
node scripts/agents/includes/check-template-labels.js
node scripts/validation/validate-labeling-configs.cjs
node scripts/validation/validate-issue-fields.cjs
npm run validate:workflows
```

## Migration Mapping (2025 docs -> current canonical sections)

- `GitHub-Branching-Strategy.md` -> Branching Contract
- `GitHub-Label-Automation-Strategy.md` -> Metadata Contract + Canonical Automation Sources
- `GitHub-Project-Field-Defaults.md` -> Unified Template Model + Project Meta Sync Contract
- `GitHub-Project-Views.md` -> Profile Deltas and local project view presets
- `Projects-Client-Delivery-Project-Template*.md` -> Unified Template Model + `client_delivery` profile
- `Projects-Product-Delivery-Project-Template*.md` -> Unified Template Model + `product_delivery` profile

## Retained vs Deprecated Guidance

Retained:

- branch-to-label automation
- label-first metadata discipline
- project field synchronisation from canonical mappings

Deprecated:

- maintaining separate long-form client and product template document suites
- duplicate strategy docs that restate YAML workflow logic instead of referencing canonical sources

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

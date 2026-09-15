# .github/ISSUE_LABELS.md

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

> **Note:** All labeling, status, type, and standardization is now handled by the unified labeling agent and labeling workflow. The canonical label definitions and automation rules are maintained in ../.github/labels.yml and ../.github/labeler.yml. This file provides human-readable guidance, while the YAML files are used for automation and syncing across the organization.

---

## Purpose

Defines the org-wide standard for providing high‑signal, automated **Issue labeling** for review routing, release hygiene, and search in LightSpeed projects.
Use this reference to classify Issues consistently, apply correct labels, and align with org-wide automation and reporting.

---

## Label Families (Issues)

- **`status:*`** — blocked, duplicate, in-progress, needs-\*, on-hold, ready, wontfix.
- **`priority:*`** — critical, important, normal, minor.
- **`type:*`** — bug, feature, documentation, task, refactor, performance, test, security, a11y, design, improvement, release, etc.
- **`area:*`** — content, theme, navigation, forms, ci, deployment, dependencies, analytics, woocommerce, etc.
- **`comp:*`** — block-editor, block-json, theme-json, templates, patterns, typography, spacing, etc.
- **Context labels:** `env:*`, `compat:*`, `cpt:*`, `lang:*`, plus repo‑specific `phase:*`, `page:*`, `device:*`, `layout:*`, `template:*`, etc.
- **Meta & release labels:** `meta:needs-changelog`, `meta:has-pr`, `meta:no-issue-activity`, `meta:no-pr-activity`, `meta:stale`, `release:patch`, `release:minor`, `release:major`, `release:hotfix`.
- **Contributor labels:** `contrib:good-first-issue`, `contrib:help-wanted`, `contrib:discussion`.

See ../.github/labels.yml for the up-to-date, authoritative list.

---

## Minimum Required Labels per Issue

- **One** `status:*` (e.g., `status:needs-triage`)
- **One** `priority:*` (e.g., `priority:normal`)
- **One** `type:*` (e.g., `type:bug`)
- **At least one** `area:*` or `comp:*` (e.g., `area:ci`)
- **Meta/context labels** as needed (e.g., `meta:needs-changelog`, `phase:6`)

These are **enforced automatically** by the unified labeling agent.

---

## Color System

Labels use a consistent color palette for rapid scanning and workflow automation.
Colors are assigned by family and purpose; see `../.github/labels.yml` for mapping.

---

## Automation

- **Labeling, status, type, and standardization** are all handled by the **unified agent and workflow** ([labeling.agent.js](../scrip../.github/agents/labeling.agent.js), [labeling.yml](../.github/workflows/labeling.yml)).
- **Default labels** are applied and enforced on all issues.
- **Label conflicts and non-canonical labels** are removed or migrated automatically.

---

## Changelog & Release Labels

- PRs/issues affecting user-facing features must include `meta:needs-changelog` or a canonical changelog label.
- Release labels (`release:patch`, `release:minor`, etc.) are required for all shipping PRs.

---

## Sample: Issue Label Front Matter

```yaml
labels:
  - status:needs-triage
  - priority:normal
  - type:bug
  - area:ci
  - meta:needs-changelog
```

---

## Usage Notes

- Keep exactly one `status:*` and one `priority:*` on every issue.
- All labeling is **automated and enforced**; maintainers may adjust as needed.
- For a full list of canonical labels and colors, see [labels.yml](../.github/labels.yml).

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

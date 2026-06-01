# .github/ISSUE_LABELS.md

<!-- BADGES-START -->

[![changelog](https://github.com/lightspeedwp/.github/actions/workflows/changelog.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)

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

- **Labeling, status, type, and standardization** are all handled by the **unified agent and workflow** ([labeling.agent.js](../scripts/agents/labeling.agent.js), [labeling.yml](../.github/workflows/labeling.yml)).
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

*The labeling agent is the single source of truth for all issue labeling, status, type, and standardization. All guidance here is directly reflected in labels.yml and enforced via automation.*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

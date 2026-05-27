---
title: "Migration Notes"
description: "Central migration map and contributor guidance for repository-wide naming, label, and configuration changes."
version: "v0.2.1"
last_updated: "2026-05-27"
file_type: "documentation"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["migration", "labels", "governance"]
domain: "governance"
stability: "active"
---

# Migration Notes

This file is the central location for contributor-facing migration maps and
notes. When a README, audit report, or issue references a migration rule, add
the durable mapping here and link back to this file.

## Issue Label Migration

Canonical issue labels are defined in [`.github/labels.yml`](../.github/labels.yml).
Canonical issue types are defined in
[`.github/issue-types.yml`](../.github/issue-types.yml).

All canonical labels must use a label-family prefix, such as `status:`,
`priority:`, `type:`, `area:`, `comp:`, `lang:`, `env:`, `compat:`, `cpt:`,
`ai-ops:`, `contrib:`, `discussion:`, `release:`, or `meta:`. Unprefixed
legacy labels should be migrated to prefixed labels, not added back to the
canonical label list.

### Clear Legacy-To-Canonical Mappings

| Legacy label      | Canonical label      | Notes                                                                                       |
| ----------------- | -------------------- | ------------------------------------------------------------------------------------------- |
| `a11y`            | `type:a11y`          | Use as an issue type for accessibility work.                                                |
| `audit`           | `type:audit`         | Use as an issue type for audit work.                                                        |
| `automation`      | `type:automation`    | Use as an issue type for automation work.                                                   |
| `blocker`         | `status:blocked`     | Use as a status label, not a type.                                                          |
| `bug`             | `type:bug`           | Use as an issue type for defects/regressions.                                               |
| `ci`              | `area:ci`            | Use for CI/build-pipeline surface routing. Use `type:build` when the work type is build/CI. |
| `dependencies`    | `area:dependencies`  | Use for Composer/npm dependency surface routing.                                            |
| `documentation`   | `type:documentation` | Use as an issue type for docs work.                                                         |
| `javascript`      | `lang:js`            | Use for JavaScript/TypeScript file routing.                                                 |
| `js`              | `lang:js`            | Use for JavaScript/TypeScript file routing.                                                 |
| `lang:javascript` | `lang:js`            | Use the shorter canonical language label.                                                   |
| `maintenance`     | `type:maintenance`   | Use as an issue type for maintenance work.                                                  |
| `question`        | `type:question`      | Use as an issue type for clarification requests.                                            |
| `security`        | `type:security`      | Use as an issue type for security work.                                                     |
| `support`         | `type:support`       | Use as an issue type for support requests.                                                  |
| `test`            | `type:test`          | Use as an issue type for test coverage work.                                                |

### Labels Requiring Maintainer Decision

These legacy labels appeared during the #95 label audit but do not yet have a
clear one-to-one canonical target. Do not delete or mass-migrate them until a
maintainer approves the intended mapping.

| Legacy label      | Decision needed                                                                         |
| ----------------- | --------------------------------------------------------------------------------------- |
| `bats`            | Decide whether this should become a tooling/testing sub-area or remain historical only. |
| `checklist`       | Decide whether this should map to documentation/process context or be archived.         |
| `codex`           | Decide whether this should remain as a repo-specific governance label or be archived.   |
| `comp:help-tabs`  | Decide whether this component label is still needed for WordPress admin work.           |
| `configuration`   | Decide whether this maps to `area:core`, `area:automation`, or a new config family.     |
| `cross-reference` | Decide whether this should map to documentation context or a docs-specific family.      |
| `css`             | Decide whether this should map to `lang:css` everywhere.                                |
| `github_actions`  | Decide whether this should map to `area:ci` or `type:build`.                            |
| `governance`      | Decide whether this maps to `area:core` or needs a governance-specific family.          |
| `meta`            | Decide whether this is historical only or maps to a concrete `meta:*` label.            |
| `meta:duplicate`  | Decide whether this should map to `status:duplicate`.                                   |
| `onboarding`      | Decide whether this should map to documentation, contributor, or support context.       |
| `package.json`    | Decide whether this should map to `area:dependencies` or `lang:json`.                   |
| `path-resolution` | Decide whether this should become a tooling/debug context label.                        |
| `php`             | Decide whether this should map to `lang:php` everywhere.                                |
| `quickstart`      | Decide whether this should map to documentation or onboarding context.                  |
| `standards`       | Decide whether this should map to documentation/governance context.                     |

### Migration Rules

- Prefer one issue type per issue. Issue type labels use the `type:*` family and
  are mapped in `.github/issue-types.yml`.
- Use `area:*`, `comp:*`, `lang:*`, `env:*`, `compat:*`, and `cpt:*` for routing
  context that is not the issue type.
- Do not delete historical labels during a migration unless maintainers approve
  deletion or archival.
- If a legacy label is still actively used and the mapping is ambiguous, document
  the decision here before changing live GitHub labels.

### Seeding and Cleanup Gate (Issue #66)

Canonical seeding now runs in non-destructive mode by default. The sync runtime
may create and update canonical labels, but orphan-label deletion is deferred
until both conditions are true:

1. `.github/label-governance-policy.yml` sets
   `destructive_cleanup.enabled: true`.
2. The label name is listed in
   `destructive_cleanup.approved_orphan_labels`.

This keeps cleanup reversible while #95 decisions are still being finalised.

## Workflow Migration Notes

### 2026-05-27 — Bash-to-JS Workflow Migration (Phase 1)

- Custom workflow logic now defaults to Node CLI scripts under
  `scripts/workflows/**/*.cjs`.
- New workflow guardrail policy blocks:
  - explicit `shell: bash` on repo-owned `run` steps;
  - new multiline shell control-flow (`if`, `case`, `for`, `while`) in `run`
    blocks.
- Existing legacy multiline shell blocks in non-migrated workflows are
  temporarily allowlisted during incremental migration and will be retired in
  later phases.
- Scope of this phase is `.github/workflows/**`; `skills/**.sh` remains out of
  scope until phase 2.

### 2026-05-27 — Labeler Hardening (Issue #419)

- `actions/labeler@v5` execution was retired from the labeling workflow due to
  persistent schema incompatibility with the canonical `labeler.yml` structure.
- The unified runtime path is now `scripts/agents/labeling.agent.js`, backed by
  canonical configs in `.github/labels.yml`, `.github/issue-types.yml`, and
  `.github/labeler.yml`.
- A fail-fast schema gate now validates those three config files before label
  execution in CI.

---
title: "Issue #95 Orphan Labels Audit"
description: "Live reconciliation of repository labels against the canonical labels configuration."
version: "v0.1.0"
last_updated: "2026-05-27"
file_type: "audit"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["labels", "audit", "governance", "automation"]
domain: "governance"
stability: "draft"
issue: "https://github.com/lightspeedwp/.github/issues/95"
---

# Issue #95 Orphan Labels Audit

## Summary

Issue #95 is stale against the current canonical label configuration. The issue
body reports 97 orphan labels and links to the old
`.github/automation/labels.yml` path, while the current canonical source is
`.github/labels.yml`.

Live reconciliation on 2026-05-27, after updating the local canonical model and
running create/update sync against GitHub, found:

| Metric | Count |
| --- | ---: |
| Repository labels on GitHub | 179 |
| Canonical labels in `.github/labels.yml` | 149 |
| Repository labels missing from canonical config | 30 |
| Canonical labels missing from the repository | 0 |

## Canonical Labels Created In GitHub

Create/update sync added the missing canonical labels without deleting legacy
labels.

- `area:a11y`
- `area:ai`
- `area:automation`
- `area:compatibility`
- `area:maintenance`
- `area:performance`
- `area:release`
- `area:security`
- `area:testing`
- `compat:rtl`
- `release:hotfix`
- `type:question`
- `type:support`

The sync also updated 35 existing canonical labels so their live colours and
descriptions match `.github/labels.yml`.

The durable contributor-facing migration map is documented in
[`docs/MIGRATION.md`](../../../docs/MIGRATION.md#issue-label-migration).

## Canonical Model Updates

The canonical files now enforce the label-family rule:

- `question` is replaced by `type:question` and added to
  `.github/issue-types.yml`.
- `support` is replaced by `type:support` and added to
  `.github/issue-types.yml`.
- `a11y` remains an issue type through the existing `type:a11y` issue type.
- `area:labels` is now canonical because the label governance workstream and
  #95/#418 use it for routing.
- Common legacy labels are captured as aliases in `.github/labels.yml` so the
  labeling agent can migrate them to prefixed labels.

## Repository Labels Missing From Canonical Config

These labels exist in GitHub but are not defined in `.github/labels.yml`.
Deleting them should be treated as a maintainer-approved cleanup because it can
change historical issue and pull request metadata.

- `a11y`
- `audit`
- `automation`
- `bats`
- `blocker`
- `bug`
- `checklist`
- `ci`
- `comp:help-tabs`
- `configuration`
- `cross-reference`
- `css`
- `dependencies`
- `documentation`
- `github_actions`
- `governance`
- `javascript`
- `js`
- `lang:javascript`
- `maintenance`
- `meta`
- `meta:duplicate`
- `onboarding`
- `package.json`
- `path-resolution`
- `php`
- `quickstart`
- `security`
- `standards`
- `test`

## Active Legacy Label Migrations Completed

The following open issues and pull requests used legacy labels that had clear
canonical mappings. They have now been migrated without deleting label history.
The reusable mapping rules live in
[`docs/MIGRATION.md`](../../../docs/MIGRATION.md#clear-legacy-to-canonical-mappings).

| Item | Legacy labels | Canonical migration |
| --- | --- | --- |
| #13 | `test`, `ci`, `blocker` | `type:test`, `area:ci`, `status:blocked` |
| #18 | `documentation` | `type:documentation` |
| #19 | `documentation`, `maintenance` | `type:documentation`, `type:maintenance` |
| #20 | `maintenance`, `audit` | `type:maintenance`, `type:audit` |
| #21 | `a11y`, `security` | `type:a11y`, `type:security` |
| #22 | `documentation` | `type:documentation` |
| #23 | `documentation`, `automation` | `type:documentation`, `type:automation` |
| #417 | `dependencies`, `javascript` | `area:dependencies`, `lang:js` |

## Active Legacy Labels Still Requiring Maintainer Decision

These legacy labels are still used on open issues and do not have a clear
one-to-one canonical target. Keep this decision list aligned with
[`docs/MIGRATION.md`](../../../docs/MIGRATION.md#labels-requiring-maintainer-decision).

| Legacy label | Active usage | Notes |
| --- | ---: | --- |
| `bats` | 1 | Could become a testing/tooling sub-area, but no canonical target exists yet. |
| `checklist` | 1 | Could be documentation/process context, but needs maintainer intent. |
| `cross-reference` | 1 | Could be documentation context, but may deserve a docs-specific family. |
| `governance` | 2 | Could map to `area:core`, but this is broad enough to require approval. |
| `onboarding` | 1 | Could be documentation or contributor context. |
| `path-resolution` | 1 | Could be tooling/debug context, but no canonical target exists yet. |
| `quickstart` | 1 | Could be documentation context. |
| `standards` | 1 | Could be documentation/governance context. |

The remaining orphan labels have no open issue or pull request usage and should
be treated as historical-only until maintainers approve deletion or archival.

## Recommended Safe Path

1. Decide whether the eight active ambiguous labels should become canonical
   labels, aliases to existing labels, or be migrated manually.
2. Keep historical-only labels until maintainers approve deletion or archival.
3. Close #95 only after live repo labels exactly match `.github/labels.yml` or
   maintainers document accepted repository-specific exceptions.

## Notes

- This report does not delete labels.
- The issue title says 96 orphan labels and the body says 97; the current live
  orphan count is 30 after canonical sync and clear active migrations.
- The existing automation and documentation should refer to `.github/labels.yml`
  as the canonical config path.

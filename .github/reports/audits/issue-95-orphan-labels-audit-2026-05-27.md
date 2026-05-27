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

Live reconciliation on 2026-05-27 found:

| Metric | Count |
| --- | ---: |
| Repository labels on GitHub | 165 |
| Canonical labels in `.github/labels.yml` | 148 |
| Repository labels missing from canonical config | 31 |
| Canonical labels missing from the repository | 14 |

## Canonical Labels Missing From GitHub

These labels are in `.github/labels.yml` but are not currently present in the
GitHub repository label set. These are safe candidates for label sync creation.

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
- `question`
- `release:hotfix`
- `status:needs-documentation`
- `support`

## Repository Labels Missing From Canonical Config

These labels exist in GitHub but are not defined in `.github/labels.yml`.
Deleting them should be treated as a maintainer-approved cleanup because it can
change historical issue and pull request metadata.

- `a11y`
- `area:labels`
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

## Recommended Safe Path

1. Run label sync in create/update mode to add the 14 missing canonical labels.
2. Migrate actively used legacy labels to canonical equivalents where the mapping
   is clear, for example `bug` to `type:bug`, `documentation` to
   `type:documentation`, `security` to `type:security`, and `ci` to `area:ci`
   or `type:build` depending on context.
3. Keep historical-only labels until maintainers approve deletion or archival.
4. Update #95 with this audit and close it only after either:
   - live repo labels exactly match `.github/labels.yml`; or
   - maintainers document accepted repository-specific exceptions.

## Notes

- This report does not delete labels.
- The issue title says 96 orphan labels and the body says 97; the current live
  orphan count is 31.
- The existing automation and documentation should refer to `.github/labels.yml`
  as the canonical config path.

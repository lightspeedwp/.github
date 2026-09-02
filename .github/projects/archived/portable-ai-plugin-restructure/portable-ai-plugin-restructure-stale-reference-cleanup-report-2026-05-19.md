---
title: "Portable AI Plugin Restructure Stale Reference Cleanup Report"
description: "Issue #294 cleanup report for stale path references and zero-byte metadata files before portable source migration."
version: "v0.1.0"
last_updated: "2026-05-19"
file_type: "project-report"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["maintenance", "stale-links", "cleanup", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Active PRD appendix listing known stale references."
  - path: "portable-ai-plugin-restructure-migration-map-2026-05-15.csv"
    description: "Canonical migration decision map updated by this cleanup."
  - path: "issues/children/batch-02-portable-migration/02-02-maintenance-clean-stale-path-references.md"
    description: "GitHub issue #294 local source draft."
---

# Portable AI Plugin Restructure Stale Reference Cleanup Report

Parent epic: #283. Child issue: #294.

## Summary

This cleanup resolves active stale references that would make the portable
source migration harder to review. It does not move portable AI assets.

## Fixed References

| Stale reference | Replacement or decision |
| --- | --- |
| `.github/instructions/_index.instructions.md` | Replaced active reference with `.github/instructions/instructions.instructions.md`. |
| `.github/automation/labels.yml` | Replaced active references with `.github/labels.yml`. |
| `.github/automation/labeler.yml` | Replaced active references with `.github/labeler.yml`. |
| `.github/automation/issue-types.yml` | Replaced active references with `.github/issue-types.yml` or neutral retired-folder wording. |
| `docs/HUSKY-PRECOMMITS.md` | Replaced active references with `docs/HUSKY_PRECOMMITS.md`. |
| `.github/pull_request_template.md` | Replaced active references with `.github/PULL_REQUEST_TEMPLATE.md`. |
| Removed `GEMINI.md` and `CLAUDE.md` references | Cleared active references in `.github/README.md` through the boundary update already synced for #292. |
| Removed `chatmodes` and `collections` references | Replaced active links with agents, skills, or cookbook references. |

## Removed Metadata Files

The following tracked zero-byte macOS metadata files were removed:

- `.github/ISSUE_TEMPLATE/Icon`
- `.github/PULL_REQUEST_TEMPLATE/Icon`
- `.github/SAVED_REPLIES/Icon`
- `.github/SAVED_REPLIES/community/Icon`
- `.github/SAVED_REPLIES/issues/Icon`
- `.github/SAVED_REPLIES/pull-requests/Icon`
- `.github/SAVED_REPLIES/technical/Icon`
- `.github/SAVED_REPLIES/workflow/Icon`

The filenames contained a carriage-return suffix on disk. The migration map
keeps quoted source-path rows for traceability and links those cleanup rows to
`#294`.

## Deferred Items

| Item | Decision |
| --- | --- |
| Historical reports that mention old paths | Leave unchanged as historical evidence unless a later archive cleanup rewrites old reports. |
| `.github/pull_request_template.md` duplicate | Defer removal until a maintainer confirms whether the lowercase copy is still intentionally supported. |
| `.github/funding.yml` duplicate | Defer removal until a maintainer confirms whether the lowercase copy is still intentionally supported. |
| Deprecated schema support for chatmodes and collections | Leave for validation compatibility until the schema reset issues decide whether to remove backward-compatible file types. |

## Migration Map Updates

- Added `#294` to all zero-byte `Icon` cleanup rows.
- Added `#294` to duplicate lowercase PR template and funding file rows.
- Kept cleanup decisions separate from portable source migration decisions.

## Acceptance Criteria Status

- [x] References to missing `.github/instructions/_index.instructions.md` are resolved.
- [x] References to `.github/automation/labels.yml` are resolved.
- [x] `docs/HUSKY-PRECOMMITS.md` versus `docs/HUSKY_PRECOMMITS.md` references are resolved.
- [x] Stale `GEMINI.md`, `CLAUDE.md`, `chatmodes`, and `collections` references are fixed or documented as deferred.
- [x] Tracked zero-byte macOS `Icon` metadata files are removed.
- [x] Known stale references from the PRD appendix are fixed or documented as intentionally deferred.

## Verification Notes

The active-reference search was run across `README.md`, `docs`, `.github`
active documentation folders, `.github/prompts`, `.github/instructions`, and
`package.json`. It returned no matches for the stale active patterns after this
cleanup.

---
file_type: "report"
title: "Portable Schemas Migration Report"
description: "Issue #297 evidence for moving active portable schemas from .github/schemas into /.schemas."
version: "v0.1.0"
last_updated: "2026-05-20"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["portable-ai-plugin-restructure", "schemas", "migration", "issue-297"]
domain: "ai-ops"
stability: "draft"
references:
  - path: "issues/children/batch-02-portable-migration/02-05-refactor-move-active-schemas-to-root-schemas.md"
    description: "Issue #297 local source draft."
  - path: "portable-ai-plugin-restructure-migration-map-2026-05-15.csv"
    description: "Canonical migration decision map."
---

# Portable Schemas Migration Report

## Current Issue

- Parent epic: #283, Portable AI plugin restructure: source asset migration.
- Child issue: #297, Move active portable schemas to `/.schemas`.
- Live GitHub status checked on 2026-05-20: issue #297 is open with no new
  blocking comments.

## Changes Made

| Area | Outcome |
| --- | --- |
| Portable schemas | Moved five active JSON schemas to `.schemas/`: changelog, CodeRabbit, frontmatter, project fields, and version. |
| Converted index | Kept `.schemas/README.md` as the portable ownership index and converted `.github/schemas/README.md` into a repo-local boundary pointer. |
| Validators | Updated schema, agent, frontmatter, and CodeRabbit validators to read from `.schemas/`. |
| Package scripts | Updated `format:json:schemas` and `validate:json:schemas` to target `.schemas/**/*.json`. |
| Links and ownership | Updated active docs and `CODEOWNERS` references to point at `.schemas/` where the schema moved. |
| Migration map | Tagged moved schema rows with `#297` and recorded the README conversion. |

## Acceptance Criteria

- [x] Active schemas are identified.
- [x] Portable schemas move to `/.schemas`.
- [x] Repo-only schema references remain valid.
- [x] VS Code schema mappings are updated where present.
- [x] Validators reference the new path.
- [ ] PR uses correct branch prefix `refactor/`.

## Verification

| Command | Result |
| --- | --- |
| `npm run validate:json:schemas` | Passed: 5 files, 0 formatted, 5 syntax valid, 5 schema valid, 0 invalid. |
| `npm run validate:agents` | Passed with moved `.schemas/frontmatter.schema.json`: 13 valid agent files, 6 skipped non-agent/template files. |
| `npm run validate:structure` | Passed: structure validation passed. |

## Notes

- The workspace did not contain `.vscode/settings.json` schema mappings to
  update. `.vscode/README.md` and active documentation references were updated
  where they pointed at moved schema files.
- Historical generated output in `audit-frontmatter-report.csv` still references
  old `.github/schemas/*` source paths. It was left unchanged because it is an
  old audit artefact, not an active documentation index.
- The current working branch is `codex/ash-refactor`, so the PR branch-prefix
  acceptance criterion remains a PR-preparation item unless the operator asks to
  switch branches or create a PR.

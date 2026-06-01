---
file_type: "report"
title: "Portable Instructions Migration Report"
description: "Issue #295 evidence for moving reusable instruction files from .github/instructions into /instructions."
version: "v0.1.0"
last_updated: "2026-05-20"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["portable-ai-plugin-restructure", "instructions", "migration", "issue-295"]
domain: "ai-ops"
stability: "draft"
references:
  - path: "issues/children/batch-02-portable-migration/02-03-refactor-migrate-portable-instructions.md"
    description: "Issue #295 local source draft."
  - path: "portable-ai-plugin-restructure-migration-map-2026-05-15.csv"
    description: "Canonical migration decision map."
---

# Portable Instructions Migration Report

## Current Issue

- Parent epic: #283, Portable AI plugin restructure: source asset migration.
- Child issue: #295, Migrate reusable instructions to `/instructions`.
- Live GitHub status checked on 2026-05-20: issue #295 is open with no new
  blocking comments.

## Changes Made

| Area | Outcome |
| --- | --- |
| Portable instructions | Moved 31 reusable `*.instructions.md` files from `.github/instructions/` to `instructions/`. |
| Converted index | Kept `instructions/README.md` as the portable ownership index and converted `.github/instructions/README.md` into a repo-local boundary pointer. |
| Converted file organisation guide | Added `instructions/file-organisation.instructions.md` while retaining `.github/instructions/file-organisation.instructions.md` for repo-local boundary rules. |
| Repo-local `.github` folder | Left only `.github/instructions/README.md`, `.github/instructions/file-organisation.instructions.md`, and `.github/instructions/.archive/` active under `.github/instructions/`. |
| Links and ownership | Updated active docs, README files, code comments, and `CODEOWNERS` references to point at the new portable instruction paths. |
| Migration map | Tagged migrated instruction rows with `#295` and recorded the README/file-organisation conversions. |

## Acceptance Criteria

- [x] Migration map rows exist for selected instruction files.
- [x] Portable instructions are moved to `/instructions`.
- [x] Repo-only instructions remain under `.github`.
- [x] Links and indexes are updated.
- [x] Frontmatter remains valid.
- [ ] PR uses correct branch prefix `refactor/`.

## Verification

| Command | Result |
| --- | --- |
| `node <frontmatter-parse-sweep>` | Passed: parsed YAML frontmatter for 35 active instruction files. |
| `npx markdownlint-cli2 "instructions/*.md" ".github/instructions/*.md" ".github/custom-instructions.md" "AGENTS.md" "README.md"` | Passed: 38 files, 0 errors. |
| `npm run validate:structure` | Passed: structure validation passed. |

## Notes

- `CODEOWNERS` is not a Markdown file, so it was intentionally excluded from
  Markdown linting after a first lint attempt showed Markdown-only rules treating
  CODEOWNERS comments as headings.
- Historical generated output in `audit-frontmatter-report.csv` still references
  old `.github/instructions/*` source paths. It was left unchanged because it is
  an old audit artefact, not an active documentation index.
- The current working branch is `codex/ash-refactor`, so the PR branch-prefix
  acceptance criterion remains a PR-preparation item unless the operator asks to
  switch branches or create a PR.

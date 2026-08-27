---
file_type: "report"
title: "Portable Agent Specs Migration Report"
description: "Issue #296 evidence for moving reusable agent specifications from .github/agents into /agents."
version: "v0.1.0"
last_updated: "2026-05-20"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["portable-ai-plugin-restructure", "agents", "migration", "issue-296"]
domain: "ai-ops"
stability: "draft"
references:
  - path: "issues/children/batch-02-portable-migration/02-04-refactor-migrate-portable-agent-specs.md"
    description: "Issue #296 local source draft."
  - path: "portable-ai-plugin-restructure-migration-map-2026-05-15.csv"
    description: "Canonical migration decision map."
---

# Portable Agent Specs Migration Report

## Current Issue

- Parent epic: #283, Portable AI plugin restructure: source asset migration.
- Child issue: #296, Migrate reusable agent specs to `/agents`.
- Live GitHub status checked on 2026-05-20: issue #296 is open with no new
  blocking comments.

## Changes Made

| Area | Outcome |
| --- | --- |
| Portable agent specs | Moved 20 active agent spec/index files from `.github/agents/` to `agents/`. |
| Converted index | Kept `agents/README.md` as the portable ownership index and converted `.github/agents/README.md` into a repo-local boundary pointer. |
| Legacy runtime | Left JavaScript runners under `scripts/agents/` and updated references to treat them as legacy runtime. |
| Validators | Updated agent validators to scan `agents/` first while still allowing `.github/agents/` during migration. |
| Links and ownership | Updated active docs, code comments, `CODEOWNERS`, and indexes to point at `agents/*` specs. |
| Migration map | Tagged moved agent-spec rows with `#296` and recorded the README conversion. |

## Acceptance Criteria

- [x] Agent specs are classified as portable, repo-only, archive, or defer.
- [x] Portable specs move to `/agents`.
- [x] Repo-only specs stay in `.github/agents`.
- [x] Links to scripts and workflows are updated or marked legacy.
- [x] Frontmatter remains valid.
- [ ] PR uses correct branch prefix `refactor/`.

## Verification

| Command | Result |
| --- | --- |
| `npm run validate:agents` | Passed: 13 valid agent files, 6 skipped non-agent/template files. |
| `node scripts/validation/validate-agents.js --json` | Passed: 19 total, 18 valid, 1 skipped, 0 invalid; baseline warnings remain for legacy tool names and handoff targets. |
| `npx jest --config .jest.config.cjs scripts/validation/__tests__/validate-agent-frontmatter.test.js scripts/validation/__tests__/validate-agents.test.js --runInBand` | Passed: 2 suites, 2 tests. |
| `npx markdownlint-cli2 "agents/*.md" ".github/agents/*.md" "docs/AGENT_CREATION.md"` | Passed: 23 files, 0 errors. |

## Notes

- `validate-agents.js` still emits Node's module-type warning because it is an
  ES module in a package without `"type": "module"`. That warning predates this
  migration shape; the command exits successfully after validation.
- Historical generated output in `audit-frontmatter-report.csv` and historical
  changelog entries still reference old `.github/agents/*` source paths. They
  were left unchanged because they are not active documentation indexes.
- The current working branch is `codex/ash-refactor`, so the PR branch-prefix
  acceptance criterion remains a PR-preparation item unless the operator asks to
  switch branches or create a PR.

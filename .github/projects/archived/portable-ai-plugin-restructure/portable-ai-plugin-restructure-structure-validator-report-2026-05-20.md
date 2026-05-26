---
title: "Portable AI Plugin Restructure Structure Validator Report"
description: "Issue #313 report for adding a read-only validate:structure command."
version: "v0.1.0"
last_updated: "2026-05-20"
file_type: "project-report"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["build", "ci", "validation", "structure", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Active PRD requirement FR-302 for validate:structure."
  - path: "issues/children/batch-05-validation-reset/05-03-buildci-add-validate-structure.md"
    description: "GitHub issue #313 local source draft."
---

# Portable AI Plugin Restructure Structure Validator Report

Parent epic: #285. Child issue: #313.

## Summary

Added a small read-only `validate:structure` command for the portable AI plugin
restructure.

## Checks

The validator checks that these top-level portable source folders exist and
contain `README.md` or `index.md`:

- `.schemas`
- `agents`
- `cookbook`
- `hooks`
- `instructions`
- `plugins`
- `skills`
- `workflows`

If `plugins/lightspeed-github-ops` exists, the validator also checks that the
pilot plugin directory has a `README.md`. Later plugin manifest checks remain
scoped to #314.

## Implementation

| Path | Purpose |
| --- | --- |
| `scripts/validation/validate-structure.js` | Dependency-free read-only validator. |
| `scripts/validation/__tests__/validate-structure.test.js` | Fixture-based tests for missing and valid structures. |
| `package.json` | Adds `validate:structure` and includes it in `validate:all`. |
| `scripts/validation/README.md` | Documents the new command. |

## Acceptance Criteria Status

- [x] Required root folders are defined from the PRD.
- [x] Required folder README/index files are validated.
- [x] Pilot plugin basics are conditionally validated once the folder exists.
- [x] `npm run validate:structure` is added.
- [x] Tests cover missing and valid folder structures.
- [x] Command exits non-zero when required folders are missing.
- [x] Command does not modify files.
- [x] Documentation explains what is checked.
- [x] CI can run the command safely.

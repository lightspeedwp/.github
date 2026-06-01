---
file_type: "index"
title: ".github Instructions Boundary"
description: "Repo-local index for instructions that remain under the .github control-plane boundary."
version: "v0.2.0"
last_updated: "2026-05-20"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["instructions", "github-boundary", "ai-ops"]
domain: "governance"
stability: "draft"
references:
  - path: "../../instructions/README.md"
    description: "Portable instruction library index."
  - path: "../projects/active/portable-ai-plugin-restructure/issues/children/batch-02-portable-migration/02-03-refactor-migrate-portable-instructions.md"
    description: "Issue #295 local source draft."
---

# .github Instructions Boundary

This folder is now reserved for repo-local instruction assets that maintain the
LightSpeed `.github` control-plane repository.

## Scope

| Path | Purpose |
| --- | --- |
| `.github/instructions/file-organisation.instructions.md` | Repo-local placement and boundary rules for this repository. |
| `.github/instructions/.archive/` | Historical instruction files retained for reference during migration. |
| `.github/instructions/README.md` | This repo-local boundary index. |

Reusable LightSpeed instruction files live in
[`../../instructions/`](../../instructions/).

## Migration Rules

- Add new reusable instruction files under `instructions/`, not under
  `.github/instructions/`.
- Keep repo-specific boundary guidance here when it only makes sense for this
  community-health repository.
- Do not restore archived files into active use without a migration-map update
  and a linked issue.

## Validation

- Run Markdown linting for changed instruction files.
- Run `npm run validate:structure` after changing the root source-folder model.
- Check links when moving files between `.github/instructions/` and
  `instructions/`.

## References

- [Portable instruction library](../../instructions/)
- [Portable AI plugin restructure PRD](../projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)

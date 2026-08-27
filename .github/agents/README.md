---
file_type: "index"
title: ".github Agents Boundary"
description: "Repo-local index for agent assets that remain under the .github control-plane boundary."
version: "v0.2.0"
last_updated: "2026-05-20"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["agents", "github-boundary", "ai-ops"]
domain: "governance"
stability: "draft"
references:
  - path: "../../agents/README.md"
    description: "Portable agent specification library index."
  - path: "../projects/active/portable-ai-plugin-restructure/issues/children/batch-02-portable-migration/02-04-refactor-migrate-portable-agent-specs.md"
    description: "Issue #296 local source draft."
---

# .github Agents Boundary

This folder is now reserved for repo-local agent assets that are still tied to
the LightSpeed `.github` control-plane repository.

## Scope

| Path | Purpose |
| --- | --- |
| `.github/agents/README.md` | This repo-local boundary index. |
| `agents/` | Portable agent specifications moved out of `.github`. |
| `scripts/agents/` | Legacy JavaScript agent runtime kept in place for now. |

Reusable agent specifications live in [`../../agents/`](../../agents/).

## Migration Rules

- Add new reusable agent specifications under `agents/`.
- Keep JavaScript runtime code in `scripts/agents/` until a later issue
  intentionally rewrites or packages it.
- Keep GitHub Actions workflow files in `.github/workflows/`.
- Do not restore agent specs into this folder without a migration-map update and
  a linked issue.

## Validation

- Run `npm run validate:agents` after changing active agent specs.
- Run Markdown linting for changed agent documentation.
- Run `npm run validate:structure` after changing the portable source-folder
  model.

## References

- [Portable agent library](../../agents/)
- [Portable AI plugin restructure PRD](../projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)

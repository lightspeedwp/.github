---
title: ".github Schemas Boundary"
description: "Repo-local index for schemas that remain under the .github control-plane boundary. Separates portable schemas in .schemas/ from repo-local schema assets."
file_type: documentation
version: v0.3.0
last_updated: "2026-05-31"
created_date: "2026-05-20"
authors: ["LightSpeed Team"]
maintainer: "LightSpeed Team"
license: "GPL-3.0"
tags: ["schemas", "github-boundary", "ai-ops", "governance"]
domain: "governance"
stability: "stable"
---

# .github Schemas Boundary

Active portable schemas now live in [`../../.schemas/`](../../.schemas/).
This folder is reserved for repo-local schema assets that only make sense under
the LightSpeed `.github` control-plane repository.

## Scope

| Path | Purpose |
| --- | --- |
| `.github/schemas/README.md` | This repo-local boundary index. |
| `.schemas/` | Portable schemas used by active validators and reusable assets. |

## Migration Rules

- Add new portable schemas under `.schemas/`.
- Keep repo-only schemas here only when a validator or GitHub-native feature
  cannot consume the portable schema path.
- Do not restore moved schemas into `.github/schemas/` without a migration-map
  update and linked issue.

## Validation

- Run `npm run validate:json:schemas` after changing active JSON schemas.
- Run Markdown linting for schema README changes.
- Run `npm run validate:structure` after changing the portable source-folder
  model.

## References

- [Portable schema library](../../.schemas/)
- [Portable AI plugin restructure PRD](../projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)

---
file_type: "index"
title: "Portable Schemas"
description: "Ownership index for portable schemas used by LightSpeed AI assets and plugin metadata."
version: "v0.1.0"
last_updated: "2026-05-20"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["schemas", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Portable AI plugin restructure PRD."
  - path: "../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-01-skeleton-boundary/01-02-document-folder-ownership-indexes.md"
    description: "Issue #290 local source draft."
  - path: "../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-02-portable-migration/02-05-refactor-move-active-schemas-to-root-schemas.md"
    description: "Issue #297 local source draft."
---

# Portable Schemas

This folder owns portable schema files for AI assets, plugin metadata, and shared validation contracts that should travel outside the `.github` control plane.

## Ownership

- Owns JSON Schema, YAML schema, and frontmatter schema contracts used by portable agents, instructions, skills, hooks, plugins, and workflows.
- Does not own GitHub-native schemas that only validate this repository's community health files during the migration window.
- Keeps schemas small, explicit, and tied to active validation commands.

## Structure

| Path | Purpose |
| --- | --- |
| `.schemas/*.schema.json` | Portable JSON Schema files. |
| `.schemas/*.schema.yaml` | Portable YAML schema files, when JSON is not practical. |
| `.schemas/README.md` | This ownership index. |

## Schema catalogue

| Schema | Purpose |
| --- | --- |
| `changelog.schema.json` | Changelog validation. |
| `coderabbit-overrides.v2.json` | CodeRabbit configuration validation. |
| `frontmatter.schema.json` | Documentation and AI asset frontmatter validation. |
| `project-fields.schema.json` | GitHub Project field mapping validation. |
| `version.schema.json` | Version metadata validation. |

## Migration rules

- Move schemas here only when the migration map marks them as portable.
- Leave repo-only validation schemas under `.github/schemas/` until a specific migration issue moves them.
- Do not mix schema syntax fixes with path migration unless the assigned issue explicitly covers both.
- Keep schema references relative to the portable source tree, not hard-coded to `.github`.

## Usage

Reference schemas from portable assets with relative links. When a schema exists only for GitHub issue templates, workflow metadata, or this repository's project reports, keep it in `.github/schemas/`.

## Validation

- Run Markdown linting for README changes.
- Use the relevant schema validation command once the validation reset lands.
- Record any schema move in the migration decision map before deleting the source copy.

## Governance links

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Documentation format standards](../instructions/documentation-formats.instructions.md)
- [README standards](../instructions/readme.instructions.md)

## References

- [Issue #290 draft](../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-01-skeleton-boundary/01-02-document-folder-ownership-indexes.md)
- [Migration decision map](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-migration-map-2026-05-15.csv)

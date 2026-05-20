---
<<<<<<< HEAD
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
=======
file_type: "documentation"
title: "Portable Schemas"
description: "Ownership and migration rules for portable LightSpeed AI asset schemas."
version: "v0.1.0"
last_updated: "2026-05-18"
author: "Codex"
maintainer: "LightSpeed Team"
owners: ["LightSpeed Team"]
tags: ["schemas", "validation", "ai-ops", "governance"]
status: "active"
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b
---

# Portable Schemas

<<<<<<< HEAD
This folder owns portable schema files for AI assets, plugin metadata, and shared validation contracts that should travel outside the `.github` control plane.

## Ownership

- Owns JSON Schema, YAML schema, and frontmatter schema contracts used by portable agents, instructions, skills, hooks, plugins, and workflows.
- Does not own GitHub-native schemas that only validate this repository's community health files during the migration window.
- Keeps schemas small, explicit, and tied to active validation commands.
=======
## Overview

`.schemas/` stores portable JSON, YAML, and frontmatter schemas for reusable
LightSpeed AI assets and plugin metadata. It is for schemas that can travel
outside this repository's GitHub-native `.github` folder.

## Ownership

LightSpeed Team owns this folder. Keep repo-governance schemas in
`.github/schemas/` until a migration issue records the source path, target path,
validation command, and consumer.
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b

## Structure

| Path | Purpose |
| --- | --- |
<<<<<<< HEAD
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
=======
| `.schemas/README.md` | Ownership and migration rules for this folder. |
| `.schemas/<schema-name>.schema.json` | Portable JSON schemas used by active validators or plugin manifests. |
| `.schemas/<schema-name>.schema.yaml` | Portable YAML schemas where YAML is the source contract. |

## Usage

- Add a schema here only when a portable asset or validator consumes it.
- Keep schemas small and focused on active contracts.
- Document the consuming skill, plugin, hook, workflow, or validation command.
- Avoid carrying legacy schema complexity forward without a current use case.

## Validation

Run targeted syntax checks before opening a PR. Do not treat mutating format
commands as validation evidence.

```bash
npx markdownlint-cli2 ".schemas/README.md"
```

## Migration Rules

- Move schemas from `.github/schemas/` only through a tracked migration issue.
- Preserve the source path in the migration map.
- Update links and validation commands in the same slice.
- Leave obsolete schemas behind for archive or deletion review rather than
  copying them here by default.

## Related Documentation

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Issue #290: Add ownership indexes for new top-level folders](https://github.com/lightspeedwp/.github/issues/290)
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b

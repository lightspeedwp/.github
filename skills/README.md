---
file_type: "index"
title: "Portable Skills"
description: "Ownership index for self-contained LightSpeed AI skills."
version: "v0.1.0"
last_updated: "2026-05-16"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["skills", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Portable AI plugin restructure PRD."
  - path: "../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-01-skeleton-boundary/01-02-document-folder-ownership-indexes.md"
    description: "Issue #290 local source draft."
---

# Portable Skills

This folder owns self-contained skills that teach an AI agent a repeatable LightSpeed capability.

## Ownership

- Owns folders where each skill has a `SKILL.md` entry point and any local assets, scripts, templates, examples, or fixtures it needs.
- Does not own general examples that are better kept in `/cookbook`.
- Keeps skills small enough to install, test, and maintain independently.

## Structure

| Path | Purpose |
| --- | --- |
| `skills/<skill-id>/SKILL.md` | Required skill entry point. |
| `skills/<skill-id>/assets/` | Optional skill-owned images, fixtures, or support files. |
| `skills/<skill-id>/scripts/` | Optional skill-owned helper scripts. |
| `skills/README.md` | This ownership index. |

## Migration rules

- Convert only durable, repeatable prompt content into skills.
- Keep one capability per skill unless a larger package has a clear return on maintenance cost.
- Store supporting files inside the owning skill folder.
- Record converted prompts and source files in the migration decision map.

## Usage

Use this folder when an agent needs procedural knowledge it can load on demand. Prefer precise triggers, explicit inputs, validation steps, and examples that can age well.

## Validation

- Run Markdown linting for changed skill documentation.
- Validate skill folder shape when the skills validation command is available.
- Test helper scripts locally before packaging a skill into a plugin.

## Governance links

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Prompt instructions](../instructions/prompt.instructions.md)
- [README standards](../instructions/readme.instructions.md)

## References

- [Issue #290 draft](../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-01-skeleton-boundary/01-02-document-folder-ownership-indexes.md)
- [Migration decision map](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-migration-map-2026-05-15.csv)

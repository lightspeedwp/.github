---
<<<<<<< HEAD
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
=======
file_type: "documentation"
title: "Portable Skills"
description: "Ownership and migration rules for self-contained LightSpeed skills."
version: "v0.1.0"
last_updated: "2026-05-18"
author: "Codex"
maintainer: "LightSpeed Team"
owners: ["LightSpeed Team"]
tags: ["skills", "ai-ops", "portable-assets", "governance"]
status: "draft"
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b
---

# Portable Skills

<<<<<<< HEAD
This folder owns self-contained skills that teach an AI agent a repeatable LightSpeed capability.

## Ownership

- Owns folders where each skill has a `SKILL.md` entry point and any local assets, scripts, templates, examples, or fixtures it needs.
- Does not own general examples that are better kept in `/cookbook`.
- Keeps skills small enough to install, test, and maintain independently.
=======
## Overview

`skills/` stores self-contained LightSpeed skills. A skill should describe a
repeatable workflow clearly enough that an agent can load `SKILL.md`, follow the
steps, and use any local assets, scripts, templates, or examples safely.

## Ownership

LightSpeed Team owns this folder. Skills should be portable by default and
bundled into plugins only when a plugin needs them.
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b

## Structure

| Path | Purpose |
| --- | --- |
<<<<<<< HEAD
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
=======
| `skills/README.md` | Ownership, backlog, and migration rules for this folder. |
| `skills/<skill-id>.skill.md` | Portable skill specification (flat structure). |
| `skills/<skill-id>/SKILL.md` | Portable skill specification (folder structure entrypoint). |
| `skills/<skill-id>/assets/` | Optional static assets used by the skill. |
| `skills/<skill-id>/scripts/` | Optional helper scripts owned by the skill. |
| `skills/<skill-id>/templates/` | Optional reusable output templates. |
| `skills/<skill-id>/examples/` | Optional examples and fixtures. |

## Initial Skills Backlog

| Skill | Plugin fit | Priority | Status |
| --- | --- | --- | --- |
| `lightspeed-frontmatter-audit` | `lightspeed-github-ops` | P0 | Planned |
| `lightspeed-pr-review` | `lightspeed-github-ops` | P0 | Planned |
| `lightspeed-label-governance` | `lightspeed-github-ops` | P0 | Planned |
| `lightspeed-release-prep` | `lightspeed-github-ops` | P1 | Backlog |

## Usage

- Convert repeatable prompt workflows into skills when they have clear steps,
  inputs, outputs, and validation.
- Keep examples and teaching material in `cookbook/` unless the skill needs
  them as fixtures.
- Keep scripts small, local to the skill, and documented.
- Do not include secrets, production data, or customer data in examples.

## Validation

Validate changed Markdown files now. Add skill structure checks once the
validation reset introduces skill validation.

```bash
npx markdownlint-cli2 "skills/**/*.md"
```

## Migration Rules

- Review each legacy prompt before deciding whether it becomes a skill,
  cookbook recipe, archive item, or deletion candidate.
- Record source and target paths in the migration map.
- Keep a skill self-contained once migrated.

## Related Documentation

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Issue #290: Add ownership indexes for new top-level folders](https://github.com/lightspeedwp/.github/issues/290)
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b

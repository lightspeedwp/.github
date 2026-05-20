---
<<<<<<< HEAD
file_type: "index"
title: "Portable Instructions"
description: "Ownership index for portable LightSpeed instruction files."
version: "v0.1.0"
last_updated: "2026-05-20"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["instructions", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Portable AI plugin restructure PRD."
  - path: "../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-01-skeleton-boundary/01-02-document-folder-ownership-indexes.md"
    description: "Issue #290 local source draft."
  - path: "../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-02-portable-migration/02-03-refactor-migrate-portable-instructions.md"
    description: "Issue #295 local source draft."
=======
file_type: "documentation"
title: "Portable Instructions"
description: "Ownership and migration rules for portable LightSpeed instruction files."
version: "v0.1.0"
last_updated: "2026-05-18"
author: "Codex"
maintainer: "LightSpeed Team"
owners: ["LightSpeed Team"]
tags: ["instructions", "ai-ops", "governance", "portable-assets"]
status: "draft"
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b
---

# Portable Instructions

<<<<<<< HEAD
This folder owns reusable instruction files for LightSpeed AI work that should apply across projects and plugins, not only inside this `.github` repository.

## Ownership

- Owns portable `*.instructions.md` files by domain, language, workflow, or quality gate.
- Does not own repo-local Copilot instructions for maintaining this community health repository.
- Keeps instructions clear, modular, tool-aware where needed, and free from hard-coded `.github` path assumptions.
=======
## Overview

`instructions/` stores portable instruction files that can be reused across
LightSpeed projects and AI tools. These instructions should describe domain
behaviour without assuming they live inside `.github`.

## Ownership

LightSpeed Team owns this folder. Instructions for maintaining this repository
stay in `.github/instructions/` or `.github/custom-instructions.md`.
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b

## Structure

| Path | Purpose |
| --- | --- |
<<<<<<< HEAD
| `instructions/<topic>.instructions.md` | Portable instruction file for one topic. |
| `instructions/<topic>/README.md` | Optional index for a larger instruction group. |
| `instructions/README.md` | This ownership index. |

## Instruction catalogue

| Area | Files |
| --- | --- |
| Authoring and documentation | `instructions.instructions.md`, `docs.instructions.md`, `documentation-formats.instructions.md`, `readme.instructions.md`, `template.instructions.md`, `mermaid.instructions.md` |
| Engineering standards | `coding-standards.instructions.md`, `languages.instructions.md`, `linting.instructions.md`, `quality-assurance.instructions.md`, `a11y.instructions.md`, `self-explanatory-code-commenting.instructions.md` |
| Automation and governance | `automation.instructions.md`, `copilot-operations.instructions.md`, `community-standards.instructions.md`, `file-organisation.instructions.md`, `labeling.instructions.md`, `metrics.instructions.md`, `project-meta-sync.instructions.md`, `reporting.instructions.md`, `workflows.instructions.md` |
| Delivery workflow | `agent-spec.instructions.md`, `issues.instructions.md`, `planner.instructions.md`, `prompt.instructions.md`, `pull-requests.instructions.md`, `release.instructions.md`, `spec-driven-workflow.instructions.md`, `task-implementation.instructions.md`, `tasksync.instructions.md`, `tools.instructions.md` |

## Migration rules

- Move instructions here only when the migration map marks them as portable.
- Keep GitHub-native maintenance instructions under `.github/instructions/` until a specific issue says otherwise.
- Rewrite examples so paths are portable or explicitly marked as repo-local.
- Keep `.github/instructions/README.md` as a repo-local pointer, not a duplicate portable instruction index.

## Usage

Use this folder for instruction files that agents, plugin installers, or downstream repositories can load directly. Keep each instruction focused on behaviour and standards, not temporary project state.

## Validation

- Run Markdown linting for changed instruction files.
- Run instruction/frontmatter validation when it covers this folder.
- Check internal links after removing `.github` path assumptions.

## Governance links

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Instruction authoring standards](instructions.instructions.md)
- [README standards](readme.instructions.md)

## References

- [Issue #290 draft](../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-01-skeleton-boundary/01-02-document-folder-ownership-indexes.md)
- [Migration decision map](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-migration-map-2026-05-15.csv)
=======
| `instructions/README.md` | Ownership and migration rules for this folder. |
| `instructions/<domain>.instructions.md` | Portable instruction file for a reusable domain or workflow. |
| `instructions/<domain>/README.md` | Optional domain index when several instruction files belong together. |

## Usage

- Use this folder for reusable instructions that belong outside repo-specific
  `.github` governance.
- Keep WordPress block theme and block plugin guidance separated when migrated.
- Prefer clear domain boundaries over large catch-all instruction files.
- Link related skills, agents, or cookbook recipes from the instruction body.

## Validation

Validate changed Markdown files and future frontmatter checks before a PR.

```bash
npx markdownlint-cli2 "instructions/**/*.md"
```

## Migration Rules

- Move generic instructions from `.github/instructions/` only after removing
  `.github`-specific assumptions.
- Keep repo-maintenance instructions in `.github/instructions/`.
- Record every moved instruction in the migration map.

## Related Documentation

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Issue #290: Add ownership indexes for new top-level folders](https://github.com/lightspeedwp/.github/issues/290)
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b

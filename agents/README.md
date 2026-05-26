---
<<<<<<< HEAD
file_type: "index"
title: "Portable Agents"
description: "Ownership index for portable LightSpeed AI agent specifications."
version: "v0.1.0"
last_updated: "2026-05-20"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["agents", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Portable AI plugin restructure PRD."
  - path: "../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-01-skeleton-boundary/01-02-document-folder-ownership-indexes.md"
    description: "Issue #290 local source draft."
  - path: "../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-02-portable-migration/02-04-refactor-migrate-portable-agent-specs.md"
    description: "Issue #296 local source draft."
=======
file_type: "documentation"
title: "Portable Agents"
description: "Ownership and migration rules for portable LightSpeed agent specifications."
version: "v0.1.0"
last_updated: "2026-05-18"
author: "Codex"
maintainer: "LightSpeed Team"
owners: ["LightSpeed Team"]
tags: ["agents", "ai-ops", "governance", "portable-assets"]
status: "draft"
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b
---

# Portable Agents

<<<<<<< HEAD
This folder owns reusable agent specifications that can be packaged into LightSpeed AI plugins or installed into other repositories.

## Ownership

- Owns portable agent specs that avoid `.github`-relative assumptions.
- Does not own repo-maintenance agents that only operate on this `.github` repository.
- Keeps runtime code out of this folder until a later migration issue defines the implementation model.
=======
## Overview

`agents/` stores portable agent specifications that can be reused across
LightSpeed repositories and AI tools. Version 1 of this structure is for specs;
runtime code is migrated separately only when the new contract is clear.

## Ownership

LightSpeed Team owns this folder. Repo-only maintenance agents stay in
`.github/agents/` until they are rewritten or confirmed as portable.
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b

## Structure

| Path | Purpose |
| --- | --- |
<<<<<<< HEAD
| `agents/<agent-id>.agent.md` | Portable agent specification. |
| `agents/agent.md` | Portable agent specification index. |
| `agents/<agent-id>/` | Future home for a larger portable agent package, if needed. |
| `agents/README.md` | This ownership index. |

## Agent catalogue

| Area | Files |
| --- | --- |
| Governance and operations | `adr.agent.md`, `issues.agent.md`, `labeling.agent.md`, `metrics.agent.md`, `project-meta-sync.agent.md`, `reporting.agent.md` |
| Delivery and quality | `linting.agent.md`, `release.agent.md`, `reviewer.agent.md`, `testing.agent.md` |
| Planning and prompting | `prompt-engineer.agent.md`, `task-planner.agent.md`, `task-researcher.agent.md` |
| Modes and templates | `mode-demonstrate-understanding.agent.md`, `mode-document-reviewer.agent.md`, `mode-prd.agent.md`, `mode-thinking.agent.md`, `template.agent.md` |

## Migration rules

- Move only agent specs that the migration map marks as portable.
- Keep repo-only agents under `.github/agents/` until they are rewritten or archived.
- Replace hard-coded `.github` paths with documented inputs, relative portable paths, or plugin-local paths.
- Preserve implementation files in their current location unless the assigned issue explicitly migrates runtime code.

## Usage

Use this folder for agent specs that describe role, scope, inputs, outputs, safety rules, and hand-off expectations. Prefer small, single-purpose agents over broad automation personas.

## Validation

- Run Markdown linting after changing agent specs or this README.
- Run the relevant agent validation command before moving an active spec.
- Confirm every moved agent row is updated in the migration decision map.

## Governance links

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Agent specification instructions](../instructions/agent-spec.instructions.md)
- [README standards](../instructions/readme.instructions.md)

## References

- [Issue #290 draft](../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-01-skeleton-boundary/01-02-document-folder-ownership-indexes.md)
- [Migration decision map](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-migration-map-2026-05-15.csv)
=======
| `agents/README.md` | Ownership and migration rules for this folder. |
| `agents/<agent-id>.agent.md` | Portable agent specification (flat structure). |
| `agents/<agent-id>/AGENT.md` | Portable agent specification (folder structure entrypoint). |

## Usage

- Use this folder for reusable agent specs, not one-off project instructions.
- Remove assumptions about `.github`-relative paths before migration.
- Keep tool-specific setup notes in adapter sections, not in the core contract.
- Record each migrated agent in the migration map with source and target paths.

## Validation

Validate changed Markdown files and any future agent schema checks before a PR.

```bash
npx markdownlint-cli2 "agents/**/*.md"
```

## Migration Rules

- Migrate reusable specs from `.github/agents/` only after frontmatter and links
  are updated.
- Keep agents that maintain this repository under `.github/agents/`.
- Do not move JavaScript runners here by default; rewrite useful runtime
  behaviour into hooks, workflows, or skill-local scripts when needed.

## Related Documentation

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Issue #290: Add ownership indexes for new top-level folders](https://github.com/lightspeedwp/.github/issues/290)
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b

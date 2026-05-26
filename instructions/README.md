---
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
---

# Portable Instructions

This folder owns reusable instruction files for LightSpeed AI work that should apply across projects and plugins, not only inside this `.github` repository.

## Ownership

- Owns portable `*.instructions.md` files by domain, language, workflow, or quality gate.
- Does not own repo-local Copilot instructions for maintaining this community health repository.
- Keeps instructions clear, modular, tool-aware where needed, and free from hard-coded `.github` path assumptions.

## Structure

| Path | Purpose |
| --- | --- |
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

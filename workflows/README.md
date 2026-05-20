---
file_type: "index"
title: "Agentic Workflows"
description: "Ownership index for portable agentic workflows, distinct from GitHub Actions."
version: "v0.1.0"
last_updated: "2026-05-16"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["workflows", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Portable AI plugin restructure PRD."
  - path: "../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-01-skeleton-boundary/01-02-document-folder-ownership-indexes.md"
    description: "Issue #290 local source draft."
---

# Agentic Workflows

This folder owns portable agentic workflows: human-readable procedures, orchestration patterns, and reusable runbooks for AI-assisted work.

## Ownership

- Owns portable workflow descriptions that guide agents or maintainers through repeatable tasks.
- Does not own GitHub Actions YAML files; those stay in `.github/workflows/`.
- Keeps workflows tool-neutral where practical and isolates tool-specific adapters inside plugins or hooks.

## Structure

| Path | Purpose |
| --- | --- |
| `workflows/<workflow-id>.md` | Portable agentic workflow or runbook. |
| `workflows/<workflow-id>/README.md` | Optional index for a larger workflow package. |
| `workflows/README.md` | This ownership index. |

## Migration rules

- Move workflows here only when they describe portable agent behaviour rather than GitHub Actions execution.
- Keep reusable Actions, CI triggers, and workflow-call YAML in `.github/workflows/`.
- Separate validation workflows from fixing or formatting workflows.
- Document inputs, outputs, dry-run behaviour, and expected review points.

## Usage

Use this folder for repeatable AI-assisted operating procedures, such as release preparation, review triage, migration planning, or project governance routines.

## Validation

- Run Markdown linting for changed workflow docs.
- Test any referenced command or script before marking a workflow ready.
- Keep GitHub Actions validation separate from portable workflow validation.

## Governance links

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Workflow instructions](../instructions/workflows.instructions.md)
- [README standards](../instructions/readme.instructions.md)

## References

- [Issue #290 draft](../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-01-skeleton-boundary/01-02-document-folder-ownership-indexes.md)
- [Migration decision map](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-migration-map-2026-05-15.csv)

---
<<<<<<< HEAD
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
=======
file_type: "documentation"
title: "Portable Workflows"
description: "Ownership and migration rules for portable LightSpeed agentic workflows."
version: "v0.1.0"
last_updated: "2026-05-18"
author: "Codex"
maintainer: "LightSpeed Team"
owners: ["LightSpeed Team"]
tags: ["workflows", "ai-ops", "automation", "governance"]
status: "active"
stability: "incubating"
---

# Portable Workflows

## Overview

`workflows/` stores portable agentic workflows that can run across AI tools or
plugin contexts. GitHub Actions remain in `.github/workflows/`.

## Ownership

LightSpeed Team owns this folder. Keep workflow definitions focused on agentic
processes rather than repository CI configuration.
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b

## Structure

| Path | Purpose |
| --- | --- |
<<<<<<< HEAD
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
=======
| `workflows/README.md` | Ownership and migration rules for this folder. |
| `workflows/<workflow-id>/README.md` | Workflow purpose, inputs, outputs, risks, and validation. |
| `workflows/<workflow-id>/workflow.yml` | Portable workflow definition file. |
| `workflows/<workflow-id>/<adapter>.md` | Optional tool adapter notes for supported runtimes. |

## Usage

- Use this folder for portable AI workflows, playbooks with state, or
  multi-step agent processes.
- Keep GitHub Actions, reusable workflow YAML, and CI triggers in
  `.github/workflows/`.
- Prefer workflows that can be tested locally or dry-run safely.
- Link related skills, hooks, schemas, and plugins from each workflow.

## Validation

Validate changed Markdown files now. Add workflow structure checks once the
validation reset introduces portable workflow validation.

```bash
npx markdownlint-cli2 "workflows/**/*.md"
```

## Migration Rules

- Do not move GitHub Actions into this folder.
- Convert durable agentic processes only after inputs, outputs, and safety
  checks are documented.
- Record source and target paths in the migration map.

## Related Documentation

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Issue #290: Add ownership indexes for new top-level folders](https://github.com/lightspeedwp/.github/issues/290)
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b

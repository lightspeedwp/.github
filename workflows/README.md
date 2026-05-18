---
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
stability: "draft"
---

# Portable Workflows

## Overview

`workflows/` stores portable agentic workflows that can run across AI tools or
plugin contexts. GitHub Actions remain in `.github/workflows/`.

## Ownership

LightSpeed Team owns this folder. Keep workflow definitions focused on agentic
processes rather than repository CI configuration.

## Structure

| Path | Purpose |
| --- | --- |
| `workflows/README.md` | Ownership and migration rules for this folder. |
| `workflows/<workflow-id>/README.md` | Workflow purpose, inputs, outputs, risks, and validation. |
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
npx markdownlint-cli2 "workflows/README.md"
```

## Migration Rules

- Do not move GitHub Actions into this folder.
- Convert durable agentic processes only after inputs, outputs, and safety
  checks are documented.
- Record source and target paths in the migration map.

## Related Documentation

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Issue #290: Add ownership indexes for new top-level folders](https://github.com/lightspeedwp/.github/issues/290)

---
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
---

# Portable Agents

## Overview

`agents/` stores portable agent specifications that can be reused across
LightSpeed repositories and AI tools. Version 1 of this structure is for specs;
runtime code is migrated separately only when the new contract is clear.

## Ownership

LightSpeed Team owns this folder. Repo-only maintenance agents stay in
`.github/agents/` until they are rewritten or confirmed as portable.

## Structure

| Path | Purpose |
| --- | --- |
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
npx markdownlint-cli2 "agents/README.md"
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

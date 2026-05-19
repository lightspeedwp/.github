---
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
---

# Portable Instructions

## Overview

`instructions/` stores portable instruction files that can be reused across
LightSpeed projects and AI tools. These instructions should describe domain
behaviour without assuming they live inside `.github`.

## Ownership

LightSpeed Team owns this folder. Instructions for maintaining this repository
stay in `.github/instructions/` or `.github/copilot-instructions.md`.

## Structure

| Path | Purpose |
| --- | --- |
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
npx markdownlint-cli2 "instructions/README.md"
```

## Migration Rules

- Move generic instructions from `.github/instructions/` only after removing
  `.github`-specific assumptions.
- Keep repo-maintenance instructions in `.github/instructions/`.
- Record every moved instruction in the migration map.

## Related Documentation

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Issue #290: Add ownership indexes for new top-level folders](https://github.com/lightspeedwp/.github/issues/290)

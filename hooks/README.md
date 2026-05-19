---
file_type: "documentation"
title: "Portable Hooks"
description: "Ownership and migration rules for portable LightSpeed hooks and guardrails."
version: "v0.1.0"
last_updated: "2026-05-18"
author: "Codex"
maintainer: "LightSpeed Team"
owners: ["LightSpeed Team"]
tags: ["hooks", "guardrails", "automation", "ai-ops"]
status: "active"
---

# Portable Hooks

## Overview

`hooks/` stores portable hooks, guardrails, and adapters that support safe AI
operations across tools. Hooks must be small, auditable, and tool-neutral where
possible.

## Ownership

LightSpeed Team owns this folder. Legacy agent runner code stays in place until
it is rewritten into a smaller hook, workflow, or skill-local script.

## Structure

| Path | Purpose |
| --- | --- |
| `hooks/README.md` | Ownership and migration rules for this folder. |
| `hooks/<hook-id>/README.md` | Hook purpose, inputs, outputs, risks, and usage. |
| `hooks/<hook-id>/<adapter>.md` | Optional tool adapter notes for Codex, Copilot, Claude, or other runtimes. |

## Usage

- Prefer dry-run behaviour for any hook that can edit files or external state.
- Document inputs, outputs, permissions, and failure modes.
- Keep secrets out of examples and test data.
- Avoid broad runtime frameworks unless the maintenance return is clear.

## Validation

Validate changed Markdown files and any hook scripts before a PR.

```bash
npx markdownlint-cli2 "hooks/README.md"
```

## Migration Rules

- Do not move JavaScript agent runners directly into this folder.
- Rewrite only the useful, portable behaviour.
- Keep destructive or external-write hooks behind explicit confirmation and
  documented dry-run paths.

## Related Documentation

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Issue #290: Add ownership indexes for new top-level folders](https://github.com/lightspeedwp/.github/issues/290)

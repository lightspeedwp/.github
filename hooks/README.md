---
file_type: "index"
title: "Portable Hooks"
description: "Ownership index for safe portable hooks, guardrails, and tool adapters."
version: "v0.1.0"
last_updated: "2026-05-16"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["hooks", "guardrails", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Portable AI plugin restructure PRD."
  - path: "../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-01-skeleton-boundary/01-02-document-folder-ownership-indexes.md"
    description: "Issue #290 local source draft."
---

# Portable Hooks

This folder owns portable hooks, guardrails, and adapters that help AI tools run safer checks before or after agent actions.

## Ownership

- Owns hook specifications, small guardrail scripts, and tool adapters that can be reused across repositories.
- Does not own GitHub Actions workflows, repository-specific CI jobs, or destructive maintenance scripts.
- Keeps hooks dry-run friendly, auditable, and explicit about side effects.

## Structure

| Path | Purpose |
| --- | --- |
| `hooks/<hook-id>/README.md` | Hook purpose, inputs, outputs, and safety behaviour. |
| `hooks/<hook-id>/` | Hook implementation, tests, fixtures, and adapter files. |
| `hooks/README.md` | This ownership index. |

## Migration rules

- Move a hook here only when it is reusable outside this `.github` repository.
- Keep GitHub-specific automation under `.github/workflows/` or `.github/` configuration folders.
- Put tool-specific wrappers below the hook folder and keep shared behaviour tool-neutral where practical.
- Document write behaviour, secrets handling, and rollback expectations before enabling a hook by default.

## Usage

Use hooks for narrow safety checks, policy gates, and adapter glue. Prefer clear inputs and dry-run output over broad automation that mutates files without review.

## Validation

- Run Markdown linting for changed hook documentation.
- Add focused tests for hook scripts before enabling them in automation.
- Confirm hooks do not print secrets or operate on production data.

## Governance links

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Automation instructions](../instructions/automation.instructions.md)
- [README standards](../instructions/readme.instructions.md)

## References

- [Issue #290 draft](../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-01-skeleton-boundary/01-02-document-folder-ownership-indexes.md)
- [Migration decision map](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-migration-map-2026-05-15.csv)

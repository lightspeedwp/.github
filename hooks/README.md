---
<<<<<<< HEAD
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
=======
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
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b
---

# Portable Hooks

<<<<<<< HEAD
This folder owns portable hooks, guardrails, and adapters that help AI tools run safer checks before or after agent actions.

## Ownership

- Owns hook specifications, small guardrail scripts, and tool adapters that can be reused across repositories.
- Does not own GitHub Actions workflows, repository-specific CI jobs, or destructive maintenance scripts.
- Keeps hooks dry-run friendly, auditable, and explicit about side effects.
=======
## Overview

`hooks/` stores portable hooks, guardrails, and adapters that support safe AI
operations across tools. Hooks must be small, auditable, and tool-neutral where
possible.

## Ownership

LightSpeed Team owns this folder. Legacy agent runner code stays in place until
it is rewritten into a smaller hook, workflow, or skill-local script.
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b

## Structure

| Path | Purpose |
| --- | --- |
<<<<<<< HEAD
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
=======
| `hooks/README.md` | Ownership and migration rules for this folder. |
| `hooks/<hook-id>/README.md` | Hook purpose, inputs, outputs, risks, and usage. |
| `hooks/<hook-id>/hook.sh` | Actual hook implementation (or other language-specific entrypoint). |
| `hooks/<hook-id>/<adapter>.md` | Optional tool adapter notes for Codex, Copilot, Claude, or other runtimes. |

## Usage

- Prefer dry-run behaviour for any hook that can edit files or external state.
- Document inputs, outputs, permissions, and failure modes.
- Keep secrets out of examples and test data.
- Avoid broad runtime frameworks unless the maintenance return is clear.

## Validation

Validate changed Markdown files and any hook scripts before a PR.

```bash
npx markdownlint-cli2 "hooks/**/*.md"
```

## Migration Rules

- Do not move JavaScript agent runners directly into this folder.
- Rewrite only the useful, portable behaviour.
- Keep destructive or external-write hooks behind explicit confirmation and
  documented dry-run paths.

## Related Documentation

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Issue #290: Add ownership indexes for new top-level folders](https://github.com/lightspeedwp/.github/issues/290)
>>>>>>> 047fdbf127701a21a10b81aed33d4e5db86cc48b

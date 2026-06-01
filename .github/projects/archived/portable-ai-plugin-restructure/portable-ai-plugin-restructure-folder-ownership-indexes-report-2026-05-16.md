---
title: "Portable AI Plugin Restructure Folder Ownership Indexes Report"
description: "Issue #290 confirmation that new top-level folders now have concise ownership README files."
version: "v0.1.0"
last_updated: "2026-05-16"
file_type: "project-report"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["documentation", "folder-ownership", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Active PRD defining the target portable AI operations structure."
  - path: "issues/children/batch-01-skeleton-boundary/01-02-document-folder-ownership-indexes.md"
    description: "GitHub issue #290 local source draft."
---

# Portable AI Plugin Restructure Folder Ownership Indexes Report

Parent epic: #282. Child issue: #290.

## Summary

The target top-level folders now include README ownership indexes. Each index defines the folder contract, expected structure, migration rules, validation expectations, and links back to the active PRD and migration decision map.

## Created Indexes

| Path | Ownership summary |
| --- | --- |
| `/.schemas/README.md` | Portable AI asset and plugin metadata schemas. |
| `/agents/README.md` | Portable agent specifications. |
| `/cookbook/README.md` | Recipes, examples, playbooks, and implementation guides. |
| `/hooks/README.md` | Safe portable hooks, guardrails, and tool adapters. |
| `/instructions/README.md` | Portable instruction files. |
| `/plugins/README.md` | Installable plugin bundles and plugin-family strategy. |
| `/skills/README.md` | Self-contained skill folders with `SKILL.md` entry points. |
| `/workflows/README.md` | Portable agentic workflows, distinct from GitHub Actions. |

## Acceptance Criteria Status

- [x] `/.schemas/README.md` explains schema ownership.
- [x] `/agents/README.md` explains portable agent specs.
- [x] `/cookbook/README.md` explains recipes and examples.
- [x] `/hooks/README.md` explains safe hooks and adapters.
- [x] `/instructions/README.md` explains portable instruction scope.
- [x] `/plugins/README.md` explains plugin family strategy.
- [x] `/skills/README.md` explains skill folder rules.
- [x] `/workflows/README.md` distinguishes agentic workflows from GitHub Actions.
- [x] Documentation is accessible and easy to find.

## Rationale

The indexes make the new root folders discoverable before production assets move. They also preserve the `.github` boundary by naming what remains GitHub-native while giving future migration issues a clear destination contract.

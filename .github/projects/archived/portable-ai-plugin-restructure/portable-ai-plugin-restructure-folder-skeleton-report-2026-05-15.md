---
title: "Portable AI Plugin Restructure Folder Skeleton Report"
description: "Issue #289 confirmation that the target top-level folder skeleton exists without moving production assets."
version: "v0.1.0"
last_updated: "2026-05-15"
file_type: "project-report"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["task", "folder-skeleton", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Active PRD defining the target portable AI operations structure."
  - path: "issues/children/batch-01-skeleton-boundary/01-01-task-create-target-folder-skeleton.md"
    description: "GitHub issue #289 local source draft."
---

# Portable AI Plugin Restructure Folder Skeleton Report

Parent epic: #282. Child issue: #289.

## Summary

The target top-level folder skeleton has been created with `.gitkeep` markers only. No production assets were moved as part of this task.

## Created Skeleton Paths

| Path | Marker | Purpose |
| --- | --- | --- |
| `/.schemas` | `.schemas/.gitkeep` | Future root for portable schemas after validation reset. |
| `/agents` | `agents/.gitkeep` | Future root for portable agent specifications. |
| `/cookbook` | `cookbook/.gitkeep` | Future root for examples, recipes, and non-installable prompt patterns. |
| `/hooks` | `hooks/.gitkeep` | Future root for safe hooks and tool adapters. |
| `/instructions` | `instructions/.gitkeep` | Future root for portable instruction files. |
| `/plugins` | `plugins/.gitkeep` | Future root for installable plugin packages. |
| `/skills` | `skills/.gitkeep` | Future root for self-contained skills. |
| `/workflows` | `workflows/.gitkeep` | Future root for portable agentic workflows, distinct from GitHub Actions. |

## Acceptance Criteria Status

- [x] `/.schemas` exists.
- [x] `/agents` exists.
- [x] `/cookbook` exists.
- [x] `/hooks` exists.
- [x] `/instructions` exists.
- [x] `/plugins` exists.
- [x] `/skills` exists.
- [x] `/workflows` exists.
- [x] Existing `.github` behaviour is unchanged.
- [x] No existing production files were moved.

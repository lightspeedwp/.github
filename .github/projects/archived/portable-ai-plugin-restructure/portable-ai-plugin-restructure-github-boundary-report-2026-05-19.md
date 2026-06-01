---
title: "Portable AI Plugin Restructure GitHub Boundary Report"
description: "Issue #291 and #292 confirmation for GitHub-native versus portable AI asset placement rules."
version: "v0.1.0"
last_updated: "2026-05-19"
file_type: "project-report"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["refactor", "github-boundary", "file-organisation", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Active PRD defining the target portable AI operations structure."
  - path: "issues/children/batch-01-skeleton-boundary/01-03-refactor-file-organisation-boundary.md"
    description: "GitHub issue #291 local source draft."
  - path: "issues/children/batch-01-skeleton-boundary/01-04-refactor-repo-local-copilot-instructions.md"
    description: "GitHub issue #292 local source draft."
---

# Portable AI Plugin Restructure GitHub Boundary Report

Parent epic: #282. Child issues: #291 and #292.

## Summary

The repository placement rules now distinguish GitHub-native control-plane files
from portable AI source assets. The repo-local Copilot entrypoint also now
describes how to maintain this `.github` repository rather than presenting
`.github` as the default home for every reusable LightSpeed WordPress or AI
asset.

Live GitHub checks on 2026-05-19 showed both issues already closed:

- #291: `[Refactor] Update file organisation rules for GitHub-native vs portable assets`.
- #292: `[Refactor] Scope .github Copilot instructions to this repo only`.

This branch has been brought into line with that boundary work.

## Updated Files

| Path | Change |
| --- | --- |
| `.github/instructions/file-organisation.instructions.md` | Defines GitHub-native repo assets, portable AI source folders, file type mappings, and placement rules for reports, projects, docs, and temporary files. |
| `.github/custom-instructions.md` | Reframes the entrypoint as repo-local Copilot and agent guidance for maintaining the `.github` control-plane repository. |
| `.github/instructions/prompt.instructions.md` | Clarifies that `.github/prompts/` is repo-local or legacy during migration, while repeatable workflows should become skills and teaching examples should become cookbook entries. |
| `.github/instructions/readme.instructions.md` | Adds README patterns for repo-local and portable folders across agents, workflows, instructions, prompts, schemas, skills, cookbook, plugins, and hooks. |
| `AGENTS.md` | Updates cross-reference language for custom instructions and the legacy prompt index. |

## Acceptance Criteria Status

### Issue #291

- [x] Guidance defines GitHub-native files.
- [x] Guidance defines portable plugin assets.
- [x] Guidance maps reports and active project files.
- [x] Existing links to file organisation guidance still resolve.
- [x] No production assets are moved.
- [x] Documentation updated as needed.

### Issue #292

- [x] `.github/custom-instructions.md` explains the new boundary.
- [x] Links to portable source folders are added.
- [x] Stale references to missing `_index.instructions.md` are corrected.
- [x] No reusable WordPress project guidance is presented as repo-local only.
- [x] Documentation updated as needed.

## Rationale

The boundary update keeps `.github` important as the organisation control plane
while preventing reusable AI assets from being trapped there. Future migration
issues can now use the file-organisation rules to decide whether content stays
GitHub-native or moves into a portable top-level source folder.

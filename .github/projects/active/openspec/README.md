---
title: "OpenSpec Project Location"
description: "Project-local guidance for storing OpenSpec changes under .github/projects/active while preserving CLI compatibility."
file_type: "documentation"
status: active
created_date: "2026-06-03"
last_updated: "2026-08-07"
version: "v1.0.0"
authors: ["github-copilot"]
tags: ["openspec", "opsx", "projects", "active"]
---

# OpenSpec Project Location

This repository keeps OpenSpec change data inside the active project area:

- `.github/projects/active/openspec/changes/...`

To remain compatible with the OpenSpec CLI, the repository root path `openspec` is a symlink that points to:

- `.github/projects/active/openspec`

## Why this setup

Current OpenSpec CLI configuration only supports global profile/workflow settings and does not expose a supported project-level key for overriding the changes directory.

The symlink keeps CLI behaviour unchanged while storing project artefacts in the preferred active planning structure.

## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#TBD](../../../issues/TBD) | epic | OpenSpec specification tracking & coordination | 🟢 Open |
| [#TBD](../../../issues/TBD) | task | Agent-Tool Permission Alignment spec | 🟢 Open |
| [#TBD](../../../issues/TBD) | task | Test Coverage Implementation spec | 🟢 Open |

*Note: Issue links will be populated once GitHub issues are created. See [reports-projects-restructuring-2026-08-11](../reports-projects-restructuring-2026-08-11/) for linking coordination.*

## Operational notes

1. Run OpenSpec commands from repository root as usual.
2. New changes created by OpenSpec will resolve through the symlink and be written under `.github/projects/active/openspec/changes`.
3. Keep the `openspec` symlink committed in git.
4. If symlink drift occurs, recreate it from repository root:

   `ln -sfn .github/projects/active/openspec openspec`

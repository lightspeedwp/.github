---
file_type: custom-instructions
title: Repo-local Copilot Instructions
description: Repo-local Copilot and agent instructions for maintaining the LightSpeed .github control-plane repository.
mode: agent
version: v1.0
last_updated: '2026-06-03'
owners:
  - LightSpeed Team
---

# Repo-local Copilot Instructions

## Scope

These instructions apply to work performed inside the LightSpeed `.github` control-plane repository.

## Branch Protocol

1. Before the first edit, confirm the current branch is in scope for the requested task.
2. If the task is unrelated to the current branch, create a new branch from `develop` before editing files.
3. The branch name must follow [docs/BRANCHING_STRATEGY.md](../docs/BRANCHING_STRATEGY.md): `{type}/{scope}-{short-title}`.
4. Do not continue unrelated work on `claude/*`, issue-specific, or other in-flight branches.
5. If the working tree is already dirty with unrelated changes, stop editing that checkout and use a clean worktree or separate branch.

## Validation

- Run `npm run validate:branch-name -- --branch <branch>` for local checks.
- Pull requests targeting `develop` must pass the `Validation` job, which now includes branch-name enforcement.

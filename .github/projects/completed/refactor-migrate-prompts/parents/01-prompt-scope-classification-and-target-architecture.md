---
file_type: documentation
title: "[Parent] Prompt Scope Classification and Target Architecture"
description: "Define and execute the migration strategy for prompt assets between .github/prompts and root prompts/"
type: "type:task"
area:
  - "area:documentation"
  - "area:automation"
priority: "priority:important"
status: completed
effort: "L"
last_updated: "2026-06-01"
children:
  - "01-1-inventory-and-classify-prompts"
  - "01-2-refactor-org-wide-prompts-to-root-standard"
  - "01-3-migrate-files-update-cross-references-and-deprecations"
  - "01-4-validation-and-rollout"
---

## 3-Bullet Summary

- Value: Establishes a clean two-tier prompt architecture: org-wide in `prompts/`, `.github`-specific in `.github/prompts/`.
- Risks: Prompt path changes may break team habits and slash-command usage.
- Next step: approve the migration matrix and execute child issues in sequence.

## Objective

Refactor and migrate reusable prompts from `.github/prompts/` into `prompts/` at repository root, while retaining `.github` control-plane prompts locally.

## Target Architecture

1. `prompts/` (root): canonical, organisation-wide reusable prompts.
2. `.github/prompts/`: control-plane prompts tied to this repository's GitHub governance and automation.
3. Cross-reference model: both directories have explicit READMEs and deprecation notes for moved files.

## Inclusion Rules (Move to root `prompts/`)

1. Prompt is technology/task reusable across repositories.
2. Prompt does not require `.github` repo-specific paths, branch names, issue IDs, or local governance internals.
3. Prompt aligns with LightSpeed standards (UK English, practical workflow, measurable acceptance criteria).

## Exclusion Rules (Keep in `.github/prompts/`)

1. Prompt directly manipulates GitHub issue/PR/workflow internals for this control-plane repo.
2. Prompt references repo-local files under `.github/` as core dependencies.
3. Prompt primarily supports labeler/config workflows unique to this repository.

## Acceptance Criteria

- [x] Migration matrix approved with `move`, `keep`, or `merge/deprecate` for each prompt.
- [x] Selected `move` prompts refactored and copied to root `prompts/`.
- [x] `.github/prompts/README.md` and `prompts/README.md` updated with canonical guidance.
- [x] Backward compatibility plan defined for legacy prompt names/paths.
- [x] Validation checklist completed (lint, links, prompt format consistency).

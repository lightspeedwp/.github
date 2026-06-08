---
file_type: "documentation"
description: "Epic"
name: "Epic"
about: "Propose/manage a large, multi-part initiative or project grouping stories/features/tasks"
title: "[Epic] Prompt library scope classification and migration governance"
labels: [status:needs-planning, priority:important, type:task, area:documentation, area:automation]
---

## Overview

Define and execute the migration strategy for prompt assets between `.github/prompts/` and root `prompts/`.

## Goals

1. Establish canonical prompt boundaries:
   - Root `prompts/` for organisation-wide reusable prompts.
   - `.github/prompts/` for `.github` control-plane prompts.
2. Execute migration with explicit mapping, refactoring, and validation.
3. Prevent path breakage with deprecation guidance and updated indexes.

## Scope

- In scope: prompt inventory, classification, refactor, migration, and rollout controls.
- Out of scope: non-prompt governance files and unrelated instruction migrations.

## Acceptance Criteria

- [x] Final prompt matrix approved (`move`, `keep`, `merge/deprecate`) for all source prompts.
- [x] Approved move set refactored to LightSpeed root prompt standard.
- [x] References and discoverability updated in both prompt directories.
- [x] Validation completed for formatting, links, and smoke usage paths.

## Child Work Items

1. Inventory and classify prompt assets.
2. Refactor org-wide prompts to root standard.
3. Migrate files and update references/deprecations.
4. Validate and roll out.

## References

- `.github/projects/active/refactor-migrate-prompts/artifacts/migration-matrix.md`
- `prompts/README.md`
- `.github/prompts/README.md`
- `AGENTS.md`

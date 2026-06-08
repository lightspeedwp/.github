---
file_type: "documentation"
title: "OpenSpec Proposal Pack - Refactor Migrate Prompts"
description: "OpenSpec-ready parent and child proposal files generated from active issue specs"
version: "1.0.0"
last_updated: "2026-06-01"
status: completed
---

# OpenSpec Proposal Pack

## 3-Bullet Summary

- Value: Converts the existing parent/child issue specs into OpenSpec proposal files for `/opsx:propose` workflows.
- Risks: GitHub issue IDs are not embedded yet because issues have not been created from this pack.
- Next step: run `/opsx:propose` with each file in sequence (parent first, then children).

## Run Order

1. `parents/01-epic-prompt-library-scope-and-migration-governance.md`
2. `children/01-1-task-inventory-and-classify-prompts.md`
3. `children/01-2-task-refactor-org-wide-prompts-to-root-standard.md`
4. `children/01-3-task-migrate-files-update-references-and-deprecations.md`
5. `children/01-4-task-validation-and-rollout-controls.md`

## Suggested Commands

1. `/opsx:propose .github/projects/active/refactor-migrate-prompts/openspec/parents/01-epic-prompt-library-scope-and-migration-governance.md`
2. `/opsx:propose .github/projects/active/refactor-migrate-prompts/openspec/children/01-1-task-inventory-and-classify-prompts.md`
3. `/opsx:propose .github/projects/active/refactor-migrate-prompts/openspec/children/01-2-task-refactor-org-wide-prompts-to-root-standard.md`
4. `/opsx:propose .github/projects/active/refactor-migrate-prompts/openspec/children/01-3-task-migrate-files-update-references-and-deprecations.md`
5. `/opsx:propose .github/projects/active/refactor-migrate-prompts/openspec/children/01-4-task-validation-and-rollout-controls.md`

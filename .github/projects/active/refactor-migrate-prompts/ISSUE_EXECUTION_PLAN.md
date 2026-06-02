---
file_type: documentation
title: "Issue Execution Plan - Refactor Migrate Prompts"
description: "Operational plan for converting OpenSpec proposals into GitHub issues with template alignment"
version: "1.0.0"
last_updated: "2026-06-01"
status: active
---

# Issue Execution Plan

## 3-Bullet Summary

- Value: converts the completed spec pack into linked, trackable GitHub issues.
- Risks: template/label mismatch if `/opsx:propose` ignores `template-map` hints.
- Next step: run the strict OpenSpec files in order and record resulting issue URLs.

## Sequence

1. Propose parent epic.
2. Propose each child issue.
3. Link child issues back to parent.
4. Update run log and issue register.

## Proposal Commands

1. `/opsx:propose .github/projects/active/refactor-migrate-prompts/openspec-strict/parents/01-epic-prompt-library-scope-and-migration-governance.md`
2. `/opsx:propose .github/projects/active/refactor-migrate-prompts/openspec-strict/children/01-1-task-inventory-and-classify-prompts.md`
3. `/opsx:propose .github/projects/active/refactor-migrate-prompts/openspec-strict/children/01-2-task-refactor-org-wide-prompts-to-root-standard.md`
4. `/opsx:propose .github/projects/active/refactor-migrate-prompts/openspec-strict/children/01-3-task-migrate-files-update-references-and-deprecations.md`
5. `/opsx:propose .github/projects/active/refactor-migrate-prompts/openspec-strict/children/01-4-task-validation-and-rollout-controls.md`

## Template Mapping (Expected)

1. Parent epic -> `.github/ISSUE_TEMPLATE/05-epic.md`
2. Child 01-1 -> `.github/ISSUE_TEMPLATE/22-audit.md`
3. Child 01-2 -> `.github/ISSUE_TEMPLATE/20-documentation.md`
4. Child 01-3 -> `.github/ISSUE_TEMPLATE/01-task.md`
5. Child 01-4 -> `.github/ISSUE_TEMPLATE/12-testing-coverage.md`

## Post-Proposal Checklist

- [ ] Issue created for parent epic.
- [ ] Four child issues created.
- [ ] Parent/child links added in issue bodies.
- [ ] Labels verified (`status:*`, `priority:*`, `type:*`, `area:*`).
- [ ] `RUN_LOG.md` updated with result and issue URL.
- [ ] `ISSUE_REGISTER.md` updated with final IDs and status.

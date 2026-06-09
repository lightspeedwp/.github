---
file_type: documentation
title: "Prompt Library Refactor & Migration - Issue Index"
description: "Parent and child specs for migrating organisation-wide prompts from .github/prompts to root prompts/"
version: "1.0.0"
created_date: "2026-06-01"
last_updated: "2026-06-08"
status: completed
---

# Prompt Library Refactor & Migration — Issue Index

## 3-Bullet Summary

- Value: Consolidates reusable prompts into root `prompts/` so teams get one canonical, org-wide library.
- Risks: Breaking existing `/prompt` references, duplicate prompt intent, and inconsistent LightSpeed standards.
- Next step: Move this project folder from active to completed when repository housekeeping is run.

## Scope

This project defines the migration of prompts currently in `.github/prompts/` into root `prompts/` where prompts are organisation-wide and reusable across repositories.

Prompts that are `.github` control-plane specific stay in `.github/prompts/`.

## Execution Docs

- `ISSUE_EXECUTION_PLAN.md` — run sequence and controls for `/opsx:propose`
- `ISSUE_REGISTER.md` — canonical parent/child issue tracker
- `RUN_LOG.md` — execution logging template for proposal runs
- `ISSUE_DRAFTS.md` — manual fallback issue bodies
- `openspec/` — standard OpenSpec proposal files
- `openspec-strict/` — strict parser variant (frontmatter: `name/about/labels`)

## Directory Structure

```text
refactor-migrate-prompts/
├── INDEX.md
├── parents/
│   └── 01-prompt-scope-classification-and-target-architecture.md
├── children/
│   ├── 01-1-inventory-and-classify-prompts.md
│   ├── 01-2-refactor-org-wide-prompts-to-root-standard.md
│   ├── 01-3-migrate-files-update-cross-references-and-deprecations.md
│   └── 01-4-validation-and-rollout.md
└── artifacts/
    └── migration-matrix.md
```

## Parent/Child Breakdown

1. Parent 01: Prompt scope classification and target architecture
2. Child 01-1: Inventory and classify every `.github/prompts/*.prompt.md`
3. Child 01-2: Refactor org-wide prompts to LightSpeed canonical style
4. Child 01-3: Move files, add compatibility redirects, update references
5. Child 01-4: Validate usage paths, quality gates, and rollout controls

## Initial Review Outcome

- Current state: root `prompts/` already exists as canonical org-wide directory (7 stable prompts).
- Gap: `.github/prompts/` includes a mixed set of repo-local and potentially org-wide prompts.
- Decision rule: move only prompts that are tool/repo agnostic and useful across projects; keep GitHub control-plane automation prompts local.

## Completion Status

- GitHub issues `#736`, `#737`, `#738`, `#739`, and `#740` are closed.
- Child task checklists and parent acceptance criteria are fully checked.
- Migration evidence is recorded in `artifacts/` and linked from `ISSUE_REGISTER.md`.

## References

- [Current .github prompt library](https://github.com/lightspeedwp/.github/tree/develop/.github/prompts)
- [Root prompts directory](https://github.com/lightspeedwp/.github/tree/develop/prompts)
- [Active projects directory](https://github.com/lightspeedwp/.github/tree/develop/.github/projects/active)
- `/Users/ash/.codex/worktrees/f767/.github/AGENTS.md`

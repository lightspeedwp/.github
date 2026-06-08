---
file_type: documentation
title: "Issue Execution Plan - Root Cleanup and Dependency Audit"
description: "Sequenced /opsx:propose execution plan for dependency and root cleanup"
last_updated: "2026-06-03"
status: active
---

# Issue Execution Plan

## Objective

Create a single epic plus four child tasks that convert completed audit evidence into controlled execution issues.

## Constraints

- Preserve validated behaviour for linting, tests, and JSON/schema validation.
- Keep changes minimal and reversible.
- Respect repository rules for report placement and documentation location.

## /opsx:propose Execution Sequence

1. /opsx:propose .github/projects/active/root-cleanup-dependency-audit-2026-06-03/openspec-strict/parents/01-epic-root-cleanup-and-dependency-rationalisation.md
2. /opsx:propose .github/projects/active/root-cleanup-dependency-audit-2026-06-03/openspec-strict/children/01-1-task-finalise-dependency-rationalisation.md
3. /opsx:propose .github/projects/active/root-cleanup-dependency-audit-2026-06-03/openspec-strict/children/01-2-task-complete-root-document-relocation.md
4. /opsx:propose .github/projects/active/root-cleanup-dependency-audit-2026-06-03/openspec-strict/children/01-3-task-finalise-report-artifact-and-script-paths.md
5. /opsx:propose .github/projects/active/root-cleanup-dependency-audit-2026-06-03/openspec-strict/children/01-4-task-triage-legacy-root-files-and-closeout.md

## Verification Gate After Each Child

- npm run lint:all
- npm run test
- npm run validate:all

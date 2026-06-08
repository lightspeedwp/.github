---
title: "Branch Governance Hardening - Strict Proposal Pack"
description: "OpenSpec proposal sequence for branch rulesets, workflow enforcement, AI branch selection, and rollout controls."
file_type: "documentation"
version: "1.0.0"
last_updated: "2026-06-08"
created_date: "2026-06-03"
authors: ["LightSpeed Team"]
maintainer: "LightSpeed Team"
license: "GPL-3.0"
tags: ["openspec", "proposal", "governance", "branches", "automation"]
domain: "governance"
stability: "experimental"
status: archived
---

# Branch Governance Hardening - Strict Proposal Pack

Use this pack to drive the `/opsx:propose` sequence for the branch governance
batch.

## Proposal Order

1. `parents/01-epic-branch-governance-hardening.md`
2. `children/01-1-task-github-rulesets-and-branch-protection.md`
3. `children/01-2-task-workflow-branch-validation-and-reuse-prevention.md`
4. `children/01-3-task-ai-branch-selection-guardrails.md`
5. `children/01-4-task-validation-tests-and-rollout-controls.md`

## Validation Expectation

Run the repo checks after each proposed issue lands:

- `npm run validate:frontmatter`
- `npm run validate:links`
- `npm run lint:md`
- `npm run validate:workflows`

If the enforcement design changes any workflow or instruction file, extend the
relevant tests before moving to the next issue.

---
title: "Branch Governance Hardening"
description: "Active project pack for enforcing branch discipline, GitHub rulesets, and AI branch-selection guardrails."
file_type: "documentation"
version: "1.1.0"
last_updated: "2026-06-08"
created_date: "2026-06-03"
authors: ["LightSpeed Team"]
maintainer: "LightSpeed Team"
license: "GPL-3.0"
tags: ["branching", "governance", "rulesets", "permissions", "automation"]
domain: "governance"
stability: "experimental"
status: archived
---

# Branch Governance Hardening

## Summary

This project turns the repo's branching guidance into enforceable controls.
The current docs already describe how branches should be named, merged, and
deleted. The gap is enforcement: docs are advisory until rulesets, workflows,
and agent guardrails make them machine-checkable.

## Why This Exists

The release and work batching flow should not depend on an agent remembering
or inferring the right branch policy from context. That is too fragile.

This project focuses on:

- GitHub branch protection and rulesets
- permission boundaries for branch creation and mutation
- workflow checks that reject reused or invalid branches
- AI-facing branch selection rules that force explicit intent
- validation and rollout controls so the policy stays enforced

## Scope

In scope:

- branch protection and ruleset hardening
- workflow checks for branch naming, branch reuse, and current checkout state
- agent instruction updates for branch choice and branch lifecycle
- tests and validation for the enforcement path
- documentation updates where they reinforce the enforced contract

Out of scope:

- redesigning the repo's release model
- changing the team's preferred branching strategy
- broad workflow refactors unrelated to branch governance

## Issue Pack

The strict proposal pack lives in [`openspec-strict/`](./openspec-strict/).
Execute the items in order:

1. Epic
2. GitHub rulesets and branch protection
3. Workflow enforcement and branch reuse prevention
4. AI branch-selection guardrails
5. Validation, tests, and rollout controls

## Status Tracking

- Canonical task status lives in [ISSUE_REGISTER.md](./ISSUE_REGISTER.md).
- Use the [Progress Matrix](./ISSUE_REGISTER.md#progress-matrix) in that file
  for the current Planned/In Progress/Done/Blocked view.
- [RUN_LOG.md](./RUN_LOG.md) is event history only.

## Current State

- Branch policy documentation already exists in [`docs/BRANCHING_STRATEGY.md`](/Users/ash/.codex/worktrees/5a06/.github/docs/BRANCHING_STRATEGY.md).
- This project exists because documentation alone does not stop a branch from
  being reused or an agent from picking the wrong branch.
- The next batch should deliver enforcement, not more narrative.

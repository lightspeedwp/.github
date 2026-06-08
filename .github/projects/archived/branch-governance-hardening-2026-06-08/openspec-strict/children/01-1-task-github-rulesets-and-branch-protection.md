---
title: "GitHub Rulesets and Branch Protection"
description: "Task proposal for defining and enforcing repo branch rulesets, permissions, and protection rules."
file_type: "documentation"
version: "1.0.0"
last_updated: "2026-06-08"
created_date: "2026-06-03"
authors: ["LightSpeed Team"]
maintainer: "LightSpeed Team"
license: "GPL-3.0"
tags: ["branching", "rulesets", "permissions", "github"]
domain: "governance"
stability: "experimental"
status: archived
---

# GitHub Rulesets and Branch Protection

## Scope

Document and implement the GitHub-side controls that make branch discipline
enforceable:

- branch protection for `main`, `develop`, and release branches
- rulesets that prevent force pushes and unreviewed direct writes
- branch creation and deletion permissions where the repo or org supports them
- required checks that gate merges into protected branches

## Problem to Solve

The branching docs say what should happen, but the repo still needs a machine
enforced policy. Without rulesets, the docs can be ignored and the branch flow
can drift.

## Acceptance Criteria

- protected branches are listed with the correct ruleset coverage
- force pushes are disallowed on protected integration branches
- direct pushes to protected branches are blocked
- required status checks are documented for branch governance
- the ruleset plan is explicit enough to implement without interpretation

## Notes

- This task should define the minimum viable permissions model first.
- If org-level GitHub controls are required, the task should call that out
  separately from repo-local settings.

---
title: "AI Branch Selection Guardrails"
description: "Task proposal for forcing explicit branch intent and aligning AI behaviour with the repo's branch lifecycle policy."
file_type: "documentation"
version: "1.0.0"
last_updated: "2026-06-08"
created_date: "2026-06-03"
authors: ["LightSpeed Team"]
maintainer: "LightSpeed Team"
license: "GPL-3.0"
tags: ["ai", "branching", "guardrails", "governance"]
domain: "governance"
stability: "experimental"
status: archived
---

# AI Branch Selection Guardrails

## Scope

Make branch choice explicit for AI-assisted work so the agent does not infer
or reuse a branch from stale context.

## Requirements

- require explicit branch selection before starting a new batch
- prefer the current `develop` tip as the base for a fresh batch
- block continuation of a new batch on an old `codex/*` branch
- keep the branch choice visible in the issue pack and run log
- align the agent instructions with the branching strategy docs

## Acceptance Criteria

- the agent cannot start a new batch without an explicit branch decision
- branch reuse is treated as a policy violation, not a convenience
- the branch policy is reflected in the repo-local instructions
- the AI branch choice contract is clear enough to test

## Notes

- The problem is not only branch naming; it is branch intent and lifecycle.
- This task should make "new batch means new branch" an explicit contract.

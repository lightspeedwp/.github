---
title: "Workflow Branch Validation and Reuse Prevention"
description: "Task proposal for adding workflow checks that reject invalid or reused branches before work proceeds."
file_type: "documentation"
version: "1.0.0"
last_updated: "2026-06-08"
created_date: "2026-06-03"
authors: ["LightSpeed Team"]
maintainer: "LightSpeed Team"
license: "GPL-3.0"
tags: ["workflow", "branching", "validation", "automation"]
domain: "governance"
stability: "experimental"
status: archived
---

# Workflow Branch Validation and Reuse Prevention

## Scope

Add workflow-level checks that fail early when a batch is started on the wrong
branch or when a branch is being reused across batches.

## Requirements

- validate the current checkout branch before batch work starts
- reject branch names that do not match the repo branch policy
- fail if the branch already contains a completed batch marker
- fail if the workflow is not running from the expected base branch
- make the failure message explicit so the agent can recover cleanly

## Acceptance Criteria

- a reused work branch is rejected before any mutation step runs
- invalid branch names are rejected with a clear error
- the workflow records the branch policy it evaluated against
- the check is covered by tests or fixtures

## Notes

- This task is about enforcement, not branch naming style alone.
- The branch state check should be cheap enough to run on every relevant job.

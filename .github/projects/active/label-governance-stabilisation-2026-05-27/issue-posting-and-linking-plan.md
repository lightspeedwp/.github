---
title: "Issue Posting and Linking Plan"
description: "Order of operations for linking existing issues into the label governance workstream."
version: "v0.1.0"
last_updated: "2026-05-27"
file_type: "plan"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["issues", "planning", "labels"]
domain: "governance"
stability: "draft"
---

# Posting and Linking Plan

## Ordering

1. Open the parent epic from `issues/parents/01-epic-label-governance-stabilisation.md`.
2. Update existing issue #95 with the triage checklist from `batch-00-triage`.
3. Update existing issue #66 with the canonicalisation checklist.
4. Update existing issue #67 with the concurrency and path-scoping checklist.
5. Update existing issue #69 with the review-order enforcement checklist.

## Linking Map

- Parent epic -> #95, #66, #67, #69
- #95 blocks #66 because canonical clean-up needs current orphan evidence.
- #66 and #67 can run in parallel after #95 triage output is confirmed.
- #69 can run in parallel with #66/#67 if workflow ownership is available.

## Closeout Criteria

- All four linked issues closed.
- Labeling automation and docs validations pass locally.
- Workstream summary added to changelog/release notes if policy-visible.

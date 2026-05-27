---
title: "Label Governance Stabilisation Workstream"
description: "Issue-first workstream to eliminate orphan labels and harden label governance automation."
version: "v0.1.2"
last_updated: "2026-05-28"
file_type: "project"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["governance", "labels", "automation", "issues"]
domain: "governance"
stability: "archived"
---

## Label Governance Stabilisation Workstream

## Why This Is Next

This is the highest-impact follow-on after PR #428 because label hygiene and
policy enforcement directly affect issue triage quality, automation routing,
and reporting fidelity across the whole repository.

Live anchors on 2026-05-27:

- #95 `🏷️ Orphan Labels Detected (30)`
- #66 `[Workflows/Docs] Canonical labels + org seeding workflow`
- #67 `[Workflows] Scope README regen to changed paths with concurrency guard`
- #69 `[Workflows] Enforce CodeRabbit before Copilot on PRs`

## Outcome

Create a single, issue-first execution pack that:

- Reduces orphan labels to zero or a justified minimal set.
- Aligns canonical labels and seeding automation.
- Prevents noisy or racing README updates.
- Enforces PR review ordering policy at workflow level.

## Live Status Snapshot (2026-05-27)

- Epic issue: [#449](https://github.com/lightspeedwp/.github/issues/449) (`status:in-progress`)
- Dependency issue: [#95](https://github.com/lightspeedwp/.github/issues/95) (`status:needs-audit`)
- Reconciliation baseline:
  - Repository labels on GitHub: 180
  - Canonical labels in `.github/labels.yml`: 149
  - Orphan labels: 31
  - Canonical labels missing from GitHub: 0
- Current gate: maintainer decision table for ambiguous active legacy labels
  in #95 before final cleanup execution.

## Structure

- `issues/parents/` parent epic draft
- `issues/children/batch-00-triage/` orphan-label audit and remediation plan
- `issues/children/batch-01-execution/` execution tasks mapped to open issues
- `issue-posting-and-linking-plan.md` posting order and linking map

## Archive Status

- Archived on 2026-05-28 after completion of epic `#449` and linked issues
  `#95`, `#66`, `#67`, and `#69`.
- Delivery PRs merged: `#452` and follow-on `#454`.

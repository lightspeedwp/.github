---
title: "Next Issues Execution Plan"
description: "Prioritised execution plan for the next open issues after label-governance stabilisation closeout."
version: "v1.0.5"
last_updated: "2026-05-28"
file_type: "project"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["planning", "issues", "execution", "governance"]
domain: "governance"
stability: "active"
---

## Next Issues Execution Plan (2026-05-27)

## Scope

This plan prioritises the next open `lightspeedwp/.github` issues that are
ready and high-leverage after closing the label governance sequence (`#66`,
`#67`, `#69`, `#95`, `#449`).

Live checks on 2026-05-28: issues `#65`, `#63`, `#62`, `#64`, `#61`, `#52`,
`#18`, and `#21` are closed (merged via PRs `#452`, `#454`, `#458`, `#493`,
`#455`, `#457`, and `#460` on 2026-05-28).

## Prioritised backlog

### Wave 1 — Documentation and workflow execution ✅ COMPLETE

1. ~~`#52` Update references from `create_issue` to `issue_write` and scan
   outdated MCP tools~~  
   ✅ **Closed** — merged via [#455](https://github.com/lightspeedwp/.github/pull/455) on 2026-05-28.

2. `#60` [Docs/Workflows] Pilot telemetry for Tour Operator + document
   opt-outs  
   Link: [#60](https://github.com/lightspeedwp/.github/issues/60)  
   **Status: ACTIVE — next task.**

Why this wave first:

- closes the highest-priority remaining docs and workflow hygiene debt
- keeps issue templates, project mapping, and tool references consistent

### Wave 2 — standards and documentation debt

1. `#31` [AI Ops] Canonical Markdown Instructions Audit & Upgrade  
   Link: [#31](https://github.com/lightspeedwp/.github/issues/31)
2. `#23` [Documentation] Expand `.coderabbit.yml` with WP-docs improvements
   and revalidate  
   Link: [#23](https://github.com/lightspeedwp/.github/issues/23)

Why second:

- preserves momentum after the completed governance and hook hardening work
- keeps broader audits behind targeted workflow and docs fixes

## Execution order and dependencies

1. ~~Complete and merge `#52` before broader doc audits.~~ ✅ Done.
2. `#60` is the active Wave 1 task — unblocked, ready.
3. Defer broader doc audits (`#31`, `#23`) until Wave 1 is fully merged.

## Agent ownership split (live as of 2026-05-28)

- `#52`: ✅ **Closed** — merged via #455 by Claude on 2026-05-28.
- `#18`: ✅ **Closed** — merged via #457 by Claude on 2026-05-28 (CONTRIBUTING.md clarity).
- `#21`: ✅ **Closed** — merged via #460 by Claude on 2026-05-28 (issue template DoD expansion).
- `#60`: **Next actionable task** — unblocked and ready. Assign to Codex or Claude.
- `#31`, `#23`: Wave 2 — defer until `#60` is merged.

Logical split policy:

- Codex handles workflow and docs execution (`#60`) in sequence.
- Claude, when active, should take a parallel standards audit track (`#31` or
  `#23`) to avoid overlap with active Codex workflow changes.

**Important — PR branching rule:** All feature/fix/docs PRs must target the
`develop` branch (the default integration branch). Only `release/vX.Y.Z`
branches target `main`. See [RELEASE_PROCESS.md](../../docs/RELEASE_PROCESS.md)
and [BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md).

**Milestone note:** Confirm that issues `#60`, `#31`, and `#23` are assigned
to the active milestone in the GitHub project board before starting work.

## Definition of done per issue

- PR opened targeting `develop` with issue link and acceptance criteria mapping.
- CI checks green on PR before merge.
- Issue updated with completion note and merged PR link.
- Any affected epic/tracker issue updated with status.

## Proposed immediate next action

Proceed with `#60` as the next unclaimed actionable task (Wave 1 is complete;
`#52`, `#18`, and `#21` are all merged).

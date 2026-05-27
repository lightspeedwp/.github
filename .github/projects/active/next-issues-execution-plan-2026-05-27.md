---
title: "Next Issues Execution Plan"
description: "Prioritised execution plan for the next open issues after label-governance stabilisation closeout."
version: "v1.0.2"
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

Live checks on 2026-05-28: issue `#65` is closed (merged via PR `#452` on
2026-05-27), and issue `#63` is now also closed (merged via PR `#454` on
2026-05-27). Wave 1 now starts at `#62`.

## Prioritised backlog

### Wave 1 - CI and governance reliability (start here)

1. `#62` [Workflows] Add Husky pre-commit/pre-push with lint-staged +
   jest/bats  
   Link: [#62](https://github.com/lightspeedwp/.github/issues/62)

Why this wave first:

- reduces CI regressions and workflow drift
- strengthens pre-merge quality gates
- supports safer rollout of later AI/docs refactors

### Wave 2 - AI ops source-of-truth cleanup

1. `#64` [Agents/Docs] Consolidate AI files; create authoritative ai/* sources  
   Link: [#64](https://github.com/lightspeedwp/.github/issues/64)
2. `#61` [Docs/Workflows] Convert spec-only agents into Issues with templates
   and project mapping  
   Link: [#61](https://github.com/lightspeedwp/.github/issues/61)
3. `#52` Update references from `create_issue` to `issue_write` and scan
   outdated MCP tools  
   Link: [#52](https://github.com/lightspeedwp/.github/issues/52)

Why second:

- moves remaining AI docs/spec debt behind stable automation guardrails
- improves consistency for contributor and agent workflows

### Wave 3 - standards and documentation debt

1. `#60` [Docs/Workflows] Pilot telemetry for Tour Operator + document
   opt-outs  
   Link: [#60](https://github.com/lightspeedwp/.github/issues/60)
2. `#31` [AI Ops] Canonical Markdown Instructions Audit & Upgrade  
   Link: [#31](https://github.com/lightspeedwp/.github/issues/31)
3. `#23` [Documentation] Expand `.coderabbit.yml` with WP-docs improvements
   and revalidate  
   Link: [#23](https://github.com/lightspeedwp/.github/issues/23)

## Execution order and dependencies

1. Execute `#64` before `#61` and `#52` to avoid duplicate source-of-truth
   edits.
2. Defer broader doc audits (`#31`, `#23`) until Waves 1-2 are merged.

## Definition of done per issue

- PR opened with issue link and acceptance criteria mapping.
- CI checks green on PR before merge.
- Issue updated with completion note and merged PR link.
- Any affected epic/tracker issue updated with status.

## Proposed immediate next action

Start with `#62` in a dedicated branch and open the next PR from that issue.

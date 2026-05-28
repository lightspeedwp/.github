---
title: "Next Issues Execution Plan"
description: "Prioritised execution plan for the next open issues after label-governance stabilisation closeout."
version: "v1.0.3"
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

Live checks on 2026-05-28: issues `#65`, `#63`, `#62`, and `#64` are closed
(merged via PRs `#452`, `#454`, `#458`, and `#460`). The next open sequence
now starts at `#61`.

## Prioritised backlog

### Wave 1 - Documentation and workflow execution (start here)

1. `#61` [Docs/Workflows] Convert spec-only agents into Issues with templates
   and project mapping  
   Link: [#61](https://github.com/lightspeedwp/.github/issues/61)
2. `#52` Update references from `create_issue` to `issue_write` and scan
   outdated MCP tools  
   Link: [#52](https://github.com/lightspeedwp/.github/issues/52)

Why this wave first:

- closes the highest-priority remaining docs and workflow hygiene debt
- keeps issue templates, project mapping, and tool references consistent

### Wave 2 - standards and documentation debt

1. `#60` [Docs/Workflows] Pilot telemetry for Tour Operator + document
   opt-outs  
   Link: [#60](https://github.com/lightspeedwp/.github/issues/60)
2. `#31` [AI Ops] Canonical Markdown Instructions Audit & Upgrade  
   Link: [#31](https://github.com/lightspeedwp/.github/issues/31)
3. `#23` [Documentation] Expand `.coderabbit.yml` with WP-docs improvements
   and revalidate  
   Link: [#23](https://github.com/lightspeedwp/.github/issues/23)

Why second:

- preserves momentum after the completed governance and hook hardening work
- keeps broader audits behind targeted workflow and docs fixes

## Execution order and dependencies

1. Execute `#61` before `#52` so template and project mapping conventions are
   set before tool-reference sweeps.
2. Defer broader doc audits (`#31`, `#23`) until Wave 1 is merged.

## Definition of done per issue

- PR opened with issue link and acceptance criteria mapping.
- CI checks green on PR before merge.
- Issue updated with completion note and merged PR link.
- Any affected epic/tracker issue updated with status.

## Proposed immediate next action

Start with `#61` in a dedicated branch and open the next PR from that issue.

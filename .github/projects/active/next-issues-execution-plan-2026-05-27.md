---
title: "Next Issues Execution Plan"
description: "Prioritised execution plan for the next open issues after label-governance stabilisation closeout."
version: "v1.0.4"
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

Live checks on 2026-05-28: issues `#65`, `#63`, `#62`, `#64`, and `#61` are
closed (merged via PRs `#452`, `#454`, `#458`, `#460`, and `#493`).

## Prioritised backlog

### Wave 1 - Documentation and workflow execution (start here)

1. `#52` Update references from `create_issue` to `issue_write` and scan
   outdated MCP tools  
   Link: [#52](https://github.com/lightspeedwp/.github/issues/52)
2. `#60` [Docs/Workflows] Pilot telemetry for Tour Operator + document
   opt-outs  
   Link: [#60](https://github.com/lightspeedwp/.github/issues/60)

Why this wave first:

- closes the highest-priority remaining docs and workflow hygiene debt
- keeps issue templates, project mapping, and tool references consistent

### Wave 2 - standards and documentation debt

1. `#31` [AI Ops] Canonical Markdown Instructions Audit & Upgrade  
   Link: [#31](https://github.com/lightspeedwp/.github/issues/31)
2. `#23` [Documentation] Expand `.coderabbit.yml` with WP-docs improvements
   and revalidate  
   Link: [#23](https://github.com/lightspeedwp/.github/issues/23)

Why second:

- preserves momentum after the completed governance and hook hardening work
- keeps broader audits behind targeted workflow and docs fixes

## Execution order and dependencies

1. Complete and merge `#52` before broader doc audits.
2. Run `#60` in parallel with `#52` only if ownership is split across agents.
3. Defer broader doc audits (`#31`, `#23`) until Wave 1 is merged.

## Agent ownership split (live as of 2026-05-28)

- `#52`: Codex-active. Linked to open PRs `#494` and `#455` (ongoing updates).
- `#60`: Codex-next actionable task (unblocked, ready).
- Claude status: no active `claude/*` branch or open PR signal found in the
  repository at this check; treat Claude ownership as unconfirmed until a
  live branch/PR/issue update appears.

Logical split policy:

- Codex handles workflow and docs execution (`#52`, `#60`) in sequence.
- Claude, when active, should take a parallel standards audit track (`#31` or
  `#23`) to avoid overlap with active Codex workflow changes.

## Definition of done per issue

- PR opened with issue link and acceptance criteria mapping.
- CI checks green on PR before merge.
- Issue updated with completion note and merged PR link.
- Any affected epic/tracker issue updated with status.

## Proposed immediate next action

Proceed with `#60` as the next unclaimed actionable task while `#52` remains
in active PR/check cycle.

---
title: "Next Issues Execution Plan"
description: "Prioritised execution plan for the next open issues after label-governance stabilisation closeout."
version: "v1.1.1"
last_updated: "2026-05-28"
file_type: "project"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["planning", "issues", "execution", "governance"]
domain: "governance"
stability: "active"
---

## Next Issues Execution Plan (2026-05-28)

## Scope

This plan prioritises the next open `lightspeedwp/.github` issues that are
ready and high-leverage after closing the label governance sequence (`#66`,
`#67`, `#69`, `#95`, `#449`).

Live checks on 2026-05-28: issues `#65`, `#63`, `#62`, `#64`, and `#61` are
closed (merged via PRs `#452`, `#454`, `#458`, `#461`, and `#493`). Follow-up
policy hardening is merged via PR `#463`.

## Prioritised backlog

### Wave 1 - immediate execution (completed)

1. `#52` Update references from `create_issue` to `issue_write` and scan
   outdated MCP tools - completed and merged via PR `#494`.

Why this wave first:

- clears remaining tooling-reference drift before larger docs and agent waves
- ensures active prompts and specs match current MCP tool naming

### Wave 2 - reprioritised backlog (active)

1. `#60` [Docs/Workflows] Pilot telemetry for Tour Operator + document
   opt-outs  
   Link: [#60](https://github.com/lightspeedwp/.github/issues/60)
2. `#31` [AI Ops] Canonical Markdown Instructions Audit & Upgrade  
   Link: [#31](https://github.com/lightspeedwp/.github/issues/31)
3. `#23` [Documentation] Expand `.coderabbit.yml` with WP-docs improvements
   and revalidate  
   Link: [#23](https://github.com/lightspeedwp/.github/issues/23)

Why second:

- preserves momentum after #52 tooling alignment
- keeps broader audits ordered behind explicit agent burn-down batches

### Wave 2A - core runtime agent burn-down batch

Issues: `#464`, `#465`, `#466`, `#467`, `#468`, `#469`, `#476`, `#480`,
`#482`.

Focus:

- core runtime agent specs with highest operational leverage
- consistency checks for tool declarations, acceptance criteria, and ownership

### Wave 2B - mode and planning agent batch

Issues: `#470`, `#471`, `#473`, `#475`, `#478`, `#484`, `#486`.

Focus:

- mode/planning behaviour specs and orchestration quality
- remove overlap and tighten spec boundaries before implementation work

### Wave 2C - scaffolds and completion batch

Issues: `#488`, `#490`.

Focus:

- template and test scaffolding completion
- final pass on mapping, labels, and closure evidence

## Execution order and dependencies

1. Start with `#464` and run Wave 2A -> Wave 2B -> Wave 2C in order.
2. Keep each issue in a small mergeable slice with issue comments per step.
3. Defer broader doc audits (`#31`, `#23`) until Wave 2A is merged.

## Definition of done per issue

- PR opened with issue link and acceptance criteria mapping.
- CI checks green on PR before merge.
- Issue updated with completion note and merged PR link.
- Any affected epic/tracker issue updated with status.

## Proposed immediate next action

Execute `#464` as Wave 2A kickoff, document spec/runtime gaps, and open the
first Wave 2A PR.

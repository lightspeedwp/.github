---
title: "Branch Governance Hardening - Issue Register"
description: "Planned issue chain for branch rulesets, workflow enforcement, AI branch selection, and rollout controls."
file_type: "documentation"
version: "1.1.0"
last_updated: "2026-06-08"
created_date: "2026-06-03"
authors: ["LightSpeed Team"]
maintainer: "LightSpeed Team"
license: "GPL-3.0"
tags: ["branching", "issues", "governance", "automation"]
domain: "governance"
stability: "experimental"
status: active
---

# Branch Governance Hardening - Issue Register

This file is the single source of truth for delivery status in this project
folder. The run log records events only.

## Progress Matrix

| Workstream | Planned | In Progress | Done | Blocked | Notes |
| --- | ---: | ---: | ---: | ---: | --- |
| Epic definition and sequencing | 0 | 0 | 1 | 0 | Proposal pack and strict order defined. |
| GitHub rulesets and branch protection | 0 | 1 | 0 | 0 | `main` PR guard added for `release/*` and `hotfix/*`; remaining coverage pending. |
| Workflow branch validation and reuse prevention | 1 | 0 | 0 | 0 | Pending implementation in next batch. |
| AI branch selection guardrails | 1 | 0 | 0 | 0 | Pending implementation in next batch. |
| Validation tests and rollout controls | 1 | 0 | 0 | 0 | Pending implementation in next batch. |

## Issue Chain Status

| Order | Title | Template | Status | Dependency | Live Issue |
| --- | --- | --- | --- | --- | --- |
| 1 | Branch Governance Hardening Epic | `05-epic.md` | Done (spec defined) | None | Not created |
| 2 | Enforce GitHub rulesets and branch protection | `10-build-ci.md` | In progress | #1 (logical dependency) | Not created |
| 3 | Block reused branches and invalid checkout state | `11-automation.md` | Planned | [#2](https://github.com/lightspeedwp/.github/issues/2) | TBD |
| 4 | Align AI branch selection with the branch policy | `24-ai-ops.md` | Planned | [#2](https://github.com/lightspeedwp/.github/issues/2) | TBD |
| 5 | Add tests, docs, and rollout controls | `12-testing-coverage.md` | Planned | [#2](https://github.com/lightspeedwp/.github/issues/2), [#3](https://github.com/lightspeedwp/.github/issues/3), [#4](https://github.com/lightspeedwp/.github/issues/4) | TBD |

## Notes

- The issue chain is intentionally sequential at the enforcement layer.
- The AI branch-selection work depends on the policy and ruleset design being
  settled first.
- Tests and rollout controls should validate the policy rather than restating
  it.
- `Live Issue` is set to `Not created` until the proposal pack is approved and
  GitHub issues are opened.

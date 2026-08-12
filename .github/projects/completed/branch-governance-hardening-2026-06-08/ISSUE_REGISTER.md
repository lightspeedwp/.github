---
title: "Branch Governance Hardening - Issue Register"
description: "Recorded issue chain for branch rulesets, workflow enforcement, AI branch selection, and rollout controls."
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
status: archived
---

# Branch Governance Hardening - Issue Register

This file is the single source of truth for delivery status in this project
folder. The run log records events only.

## Progress Matrix

| Workstream | Planned | In Progress | Done | Blocked | Notes |
| --- | ---: | ---: | ---: | ---: | --- |
| Epic definition and sequencing | 0 | 0 | 1 | 0 | Closed as issue [#897](https://github.com/lightspeedwp/.github/issues/897). |
| GitHub rulesets and branch protection | 0 | 0 | 1 | 0 | Closed as issue [#898](https://github.com/lightspeedwp/.github/issues/898). |
| Workflow branch validation and reuse prevention | 0 | 0 | 1 | 0 | Closed as issue [#899](https://github.com/lightspeedwp/.github/issues/899). |
| AI branch selection guardrails | 0 | 0 | 1 | 0 | Closed as issue [#900](https://github.com/lightspeedwp/.github/issues/900). |
| Validation tests and rollout controls | 0 | 0 | 1 | 0 | Closed as issue [#901](https://github.com/lightspeedwp/.github/issues/901). |

## Issue Chain Status

| Order | Title | Template | Status | Dependency | Live Issue |
| --- | --- | --- | --- | --- | --- |
| 1 | Branch Governance Hardening Epic | `05-epic.md` | Closed (archived) | None | [#897](https://github.com/lightspeedwp/.github/issues/897) |
| 2 | Enforce GitHub rulesets and branch protection | `10-build-ci.md` | Closed (archived) | [#897](https://github.com/lightspeedwp/.github/issues/897) | [#898](https://github.com/lightspeedwp/.github/issues/898) |
| 3 | Block reused branches and invalid checkout state | `11-automation.md` | Closed (archived) | [#898](https://github.com/lightspeedwp/.github/issues/898) | [#899](https://github.com/lightspeedwp/.github/issues/899) |
| 4 | Align AI branch selection with the branch policy | `24-ai-ops.md` | Closed (archived) | [#898](https://github.com/lightspeedwp/.github/issues/898) | [#900](https://github.com/lightspeedwp/.github/issues/900) |
| 5 | Add tests, docs, and rollout controls | `12-testing-coverage.md` | Closed (archived) | [#898](https://github.com/lightspeedwp/.github/issues/898), [#899](https://github.com/lightspeedwp/.github/issues/899), [#900](https://github.com/lightspeedwp/.github/issues/900) | [#901](https://github.com/lightspeedwp/.github/issues/901) |

## Notes

- The issue chain is intentionally sequential at the enforcement layer.
- The AI branch-selection work depends on the policy and ruleset design being
  settled first.
- Tests and rollout controls should validate the policy rather than restating
  it.
- This archived register now maps to the closed issue chain #897 to #901.

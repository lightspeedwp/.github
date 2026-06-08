---
title: "Branch Governance Hardening - Issue Register"
description: "Planned issue chain for branch rulesets, workflow enforcement, AI branch selection, and rollout controls."
file_type: "documentation"
version: "1.0.0"
last_updated: "2026-06-03"
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

| Order | Title | Template | Status | Dependency | Live Issue |
| --- | --- | --- | --- | --- | --- |
| 1 | Branch Governance Hardening Epic | `05-epic.md` | Planned | None | TBD |
| 2 | Enforce GitHub rulesets and branch protection | `10-build-ci.md` | Planned | [#1](https://github.com/lightspeedwp/.github/issues/1) | TBD |
| 3 | Block reused branches and invalid checkout state | `11-automation.md` | Planned | [#2](https://github.com/lightspeedwp/.github/issues/2) | TBD |
| 4 | Align AI branch selection with the branch policy | `24-ai-ops.md` | Planned | [#2](https://github.com/lightspeedwp/.github/issues/2) | TBD |
| 5 | Add tests, docs, and rollout controls | `12-testing-coverage.md` | Planned | [#2](https://github.com/lightspeedwp/.github/issues/2), [#3](https://github.com/lightspeedwp/.github/issues/3), [#4](https://github.com/lightspeedwp/.github/issues/4) | TBD |

## Notes

- The issue chain is intentionally sequential at the enforcement layer.
- The AI branch-selection work depends on the policy and ruleset design being
  settled first.
- Tests and rollout controls should validate the policy rather than restating
  it.

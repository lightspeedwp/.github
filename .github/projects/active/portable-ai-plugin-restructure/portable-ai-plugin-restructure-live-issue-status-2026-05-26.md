---
title: "Portable AI Plugin Restructure Live Issue Status"
description: "Live GitHub issue state snapshot for parent and child restructure issues."
version: "v0.1.0"
last_updated: "2026-05-26"
file_type: "project"
maintainer: "LightSpeed Team"
authors: ["LightSpeed Team", "Codex"]
license: "GPL-3.0"
tags: ["status", "issues", "governance", "plugin", "restructure"]
domain: "governance"
stability: "active"
---

# Portable AI Plugin Restructure Live Issue Status (2026-05-26)

## Snapshot summary

- Snapshot source: GitHub REST API (`/repos/lightspeedwp/.github/issues/{number}`).
- Snapshot time (UTC): 2026-05-26.
- Scope: Parent issues #282-#285 and child issues #286-#321.
- Totals: 40 tracked issues, 37 open, 3 closed.
- Closed issues: #290, #291, #292.

## Parent issue status

| Issue | State | Title |
| --- | --- | --- |
| #282 | Open | [Epic] Portable AI plugin restructure: planning control and target skeleton |
| #283 | Open | [Epic] Portable AI plugin restructure: source asset migration |
| #284 | Open | [Epic] Portable AI plugin restructure: core plugin and compatibility |
| #285 | Open | [Epic] Portable AI plugin restructure: validation, docs, pilot, and release |

## Child issue status

### Closed

- #290 [Documentation] Add ownership indexes for new top-level folders
- #291 [Refactor] Update file organisation rules for GitHub-native vs portable assets
- #292 [Refactor] Scope `.github` Copilot instructions to this repo only

### Open

- #286, #287, #288, #289
- #293, #294, #295, #296, #297, #298
- #299, #300, #301, #302, #303, #304
- #305, #306, #307, #308, #309, #310
- #311, #312, #313, #314, #315, #316
- #317, #318, #319, #320, #321

## Notes for operators

- This repository workspace cannot directly update remote GitHub issues without authenticated GitHub CLI or token-backed API access.
- Use this snapshot to drive the next execution slice and post status comments/closures from an authenticated environment.

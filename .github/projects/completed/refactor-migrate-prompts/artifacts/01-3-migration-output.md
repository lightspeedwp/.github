---
file_type: documentation
title: "Child 01-3 Output - Migration, References, and Deprecations"
description: "Execution evidence for README updates and deprecation notice rollout"
version: "1.0.0"
last_updated: "2026-06-01"
status: completed
---

# Child 01-3 Output

## Completed

1. Updated root `prompts/README.md` with canonical boundary and migration status.
2. Updated `.github/prompts/README.md` with control-plane-only scope and migration guidance.
3. Added deprecation notices to all non-keep `.github/prompts` files from migration matrix.

## Evidence

- Expected deprecated sources: `46`
- Deprecation notices present: `46/46`
- Move targets expected: `38`
- Move targets present: `38/38`

## Changed Files (Primary)

- `prompts/README.md`
- `.github/prompts/README.md`
- `.github/prompts/*.prompt.md` (all `move` and `merge/deprecate` entries)

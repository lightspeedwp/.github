---
file_type: "documentation"
description: "Task"
name: "Task"
about: "Request or propose focused implementation work"
title: "[Task] Inventory and classify .github prompt assets with final target mapping"
labels: [status:needs-review, priority:important, type:audit, area:documentation]
---

## Overview

Create a complete inventory of `.github/prompts/*.prompt.md` and classify each as `move`, `keep`, or `merge/deprecate`, including explicit root target paths for `move` items.

## Deliverables

1. Final migration matrix covering all source prompts.
2. Explicit rename/target mapping for every moved prompt.
3. Successor mapping for every merged/deprecated prompt.

## Acceptance Criteria

- [x] Matrix coverage equals source prompt count.
- [x] Every `move` has a concrete `prompts/*.prompt` target path.
- [x] Every `merge/deprecate` has a named successor prompt.
- [x] Action counts are internally consistent with matrix rows.

## References

- `.github/projects/active/refactor-migrate-prompts/artifacts/migration-matrix.md`

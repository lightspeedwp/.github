---
file_type: documentation
title: "[Task] Inventory and classify .github prompt assets with final target mapping"
description: "OpenSpec strict planning artefact"
last_updated: "2026-06-01"
status: draft
---


# [Task] Inventory and classify .github prompt assets with final target mapping

## template-map

- template_file: `.github/ISSUE_TEMPLATE/22-audit.md`

## Deliverables

1. Final migration matrix covering all source prompts.
2. Explicit rename/target mapping for every moved prompt.
3. Successor mapping for every merged/deprecated prompt.

## Acceptance Criteria

- [ ] Matrix coverage equals source prompt count.
- [ ] Every `move` has a concrete `prompts/*.prompt` target path.
- [ ] Every `merge/deprecate` has a named successor prompt.
- [ ] Action counts are internally consistent with matrix rows.

---
file_type: documentation
title: "[Child 01-1] Inventory and Classify Prompt Assets"
description: "Child task artefact for prompt inventory and classification."
last_updated: "2026-06-01"
status: active
---

## Objective

Create a complete inventory of `.github/prompts/*.prompt.md` and classify each as:

1. `move` to root `prompts/`
2. `keep` in `.github/prompts/`
3. `merge/deprecate`

## Deliverables

- `artifacts/migration-matrix.md` with rationale per file.
- Duplicate intent groups identified (for consolidation).
- Proposed canonical naming in root `prompts/`.

## Checklist

- [ ] Enumerate all prompt files in `.github/prompts/`
- [ ] Assign scope classification (`move`/`keep`/`merge`)
- [ ] Document rationale and dependency notes
- [ ] Flag high-risk prompts with path/tool coupling
- [ ] Freeze matrix for implementation handoff

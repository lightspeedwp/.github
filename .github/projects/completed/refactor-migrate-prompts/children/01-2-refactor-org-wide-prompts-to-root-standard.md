---
file_type: documentation
title: "[Child 01-2] Refactor Org-Wide Prompts to Root Standard"
description: "Child task artefact for refactoring prompt files to root standard."
last_updated: "2026-06-01"
status: completed
---

## Objective

Refactor all prompts marked `move` so they align with LightSpeed prompt standards before migration.

## Refactor Rules

1. Enforce consistent structure: context, task, constraints, acceptance criteria, references.
2. Remove `.github`-repo-specific assumptions unless parameterised.
3. Normalise tone to LightSpeed standards (UK English, direct, practical).
4. Keep examples minimal and reproducible.

## Deliverables

- Refactored prompt files ready for root `prompts/`.
- Changelog notes listing behaviour-breaking changes.
- Mapping table old name → new canonical prompt name.

## Checklist

- [x] Refactor content for portability
- [x] Remove stale repo-specific references
- [x] Align frontmatter and metadata fields
- [x] Add migration notes for renamed prompts

## Completion Notes

- Completed on `2026-06-01`.
- Output inventory and validation evidence: `artifacts/01-2-refactor-output.md`.

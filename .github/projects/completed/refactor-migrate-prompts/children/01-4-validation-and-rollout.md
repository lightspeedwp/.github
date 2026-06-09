---
file_type: documentation
title: "[Child 01-4] Validation and Rollout Controls"
description: "Child task artefact for validation and rollout controls."
last_updated: "2026-06-01"
status: completed
---

## Objective

Validate that migrated prompts are usable, discoverable, and aligned with LightSpeed quality gates.

## Validation Gates

1. Link integrity for prompt indexes and references.
2. Prompt frontmatter consistency.
3. Linting for Markdown and YAML blocks.
4. Manual smoke test of representative prompt usage flows.

## Deliverables

- Validation checklist with pass/fail evidence.
- Rollout notes with fallback if teams still use old `.github/prompts` paths.
- Recommendations for follow-up cleanup phase.

## Checklist

- [x] Run markdown and repo lint checks (scope: migration structural checks)
- [x] Verify all prompt links resolve (scope: migration target paths)
- [x] Smoke test migrated prompt set (scope: file presence/metadata)
- [x] Document known compatibility caveats

## Completion Notes

- Completed on `2026-06-01`.
- Output evidence: `artifacts/01-4-validation-output.md`.

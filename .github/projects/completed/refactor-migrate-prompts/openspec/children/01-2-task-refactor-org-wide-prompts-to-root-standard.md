---
file_type: "documentation"
description: "Task"
name: "Task"
about: "Request or propose focused implementation work"
title: "[Task] Refactor org-wide prompts to root prompts standard"
labels: [status:needs-review, priority:important, type:documentation, area:documentation]
---

## Overview

Refactor all prompts marked `move` in the matrix to a consistent LightSpeed root prompt structure and place them in root `prompts/` with explicit migration metadata.

## Deliverables

1. Refactored root prompt targets for all approved move items.
2. Standardised frontmatter and section structure.
3. Execution evidence listing produced files and validation checks.

## Acceptance Criteria

- [x] All move targets exist at mapped paths.
- [x] Prompt files have consistent frontmatter and structure.
- [x] Legacy intent is preserved during transition.
- [x] Output evidence file documents completion and counts.

## References

- `.github/projects/active/refactor-migrate-prompts/artifacts/migration-matrix.md`
- `.github/projects/active/refactor-migrate-prompts/artifacts/01-2-refactor-output.md`

---
file_type: "documentation"
description: "Task"
name: "Task"
about: "Request or propose focused implementation work"
title: "[Task] Validate migrated prompt library and define rollout controls"
labels: [status:needs-review, priority:normal, type:task, area:quality, area:documentation]
---

## Overview

Validate migrated prompts and define rollout controls for teams still using legacy `.github/prompts` paths.

## Deliverables

1. Validation checklist and evidence (format, links, smoke usage).
2. Known caveats and compatibility notes.
3. Rollout and fallback guidance for one release cycle.

## Acceptance Criteria

- [x] Markdown/frontmatter validation passes for migrated files.
- [x] Prompt index and cross-reference links resolve correctly.
- [x] Representative prompt usage smoke tests are documented.
- [x] Rollout notes specify fallback behaviour and sunset timing.

## References

- `.github/projects/active/refactor-migrate-prompts/artifacts/01-2-refactor-output.md`
- `.github/projects/active/refactor-migrate-prompts/artifacts/migration-matrix.md`

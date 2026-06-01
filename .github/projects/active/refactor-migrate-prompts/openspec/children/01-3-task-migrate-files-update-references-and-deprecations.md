---
file_type: "documentation"
description: "Task"
name: "Task"
about: "Request or propose focused implementation work"
title: "[Task] Migrate files, update prompt references, and add deprecation paths"
labels: [status:needs-review, priority:normal, type:task, area:documentation, area:automation]
---

## Overview

Complete migration mechanics: update indexes, adjust internal links, and add deprecation notices for legacy prompt paths so teams can transition safely.

## Deliverables

1. Updated `prompts/README.md` with migrated prompt catalogue.
2. Updated `.github/prompts/README.md` clarifying control-plane-only scope.
3. Deprecation notes for legacy prompts that moved or merged.

## Acceptance Criteria

- [ ] Both prompt READMEs reflect canonical boundaries.
- [ ] Legacy prompts include clear successor path notes where required.
- [ ] Link checks pass for prompt indexes and cross-references.
- [ ] Migration guidance is explicit and reproducible.

## References

- `.github/projects/active/refactor-migrate-prompts/artifacts/migration-matrix.md`
- `prompts/README.md`
- `.github/prompts/README.md`

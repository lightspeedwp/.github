---
file_type: documentation
title: "Phase 5 - Utility Edge-Case Coverage"
description: "Add tests for utility helpers and boundary conditions so the coverage target is not inflated by fragile paths."
version: "1.0.0"
last_updated: "2026-06-08"
owners: ["Ash"]
tags: ["testing", "coverage", "utilities", "opsx"]
status: active
stability: stable
domain: quality
name: "Phase 5 - Utility Edge-Case Coverage"
about: "Cover utility helpers and edge cases so the coverage target is not inflated by fragile paths."
labels: ["status:needs-review", "priority:normal", "type:task", "area:quality", "area:testing"]
---

# Phase 5 - Utility Edge-Case Coverage

## Summary

Add tests for utility helpers and boundary conditions that commonly escape coverage passes.

## Scope

- Task 5.1: identify utility helpers with low or zero coverage.
- Task 5.2: add tests for normal utility behaviour.
- Task 5.3: add tests for invalid and empty inputs.
- Task 5.4: add tests for date and time helpers.
- Task 5.5: add tests for path and file helpers.
- Task 5.6: add tests for parsing and serialisation helpers.
- Task 5.7: add tests for any shared wrapper functions.
- Task 5.8: add tests for error propagation.
- Task 5.9: add tests for logging and output formatting.
- Task 5.10: add tests for branch-specific edge cases.
- Task 5.11: rerun coverage on the utility slice.
- Task 5.12: document the utility edge-case coverage slice.

## Acceptance Criteria

- [ ] Utility helpers with the largest gaps are covered.
- [ ] Boundary and invalid-input paths are covered.
- [ ] Coverage measurements improve without brittle tests.
- [ ] The phase is documented and reproducible.

## Dependencies

- Phase 1 baseline checklist exists.
- Metrics, linting, and release work can identify shared utility gaps.

## Additional Context

This phase is the main catch-all for non-agent helper coverage debt.

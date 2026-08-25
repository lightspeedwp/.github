---
file_type: documentation
title: "Phase 6 - Validation and Reporting Closeout"
description: "Validate the end state of the coverage programme and document the final results clearly."
version: "1.0.0"
last_updated: "2026-06-08"
owners: ["Ash"]
tags: ["testing", "coverage", "validation", "opsx"]
status: active
stability: stable
domain: quality
name: "Phase 6 - Validation and Reporting Closeout"
about: "Validate the finished programme, capture the final report, and close the loop on issue and PR checklists."
labels: ["status:needs-review", "priority:critical", "type:documentation", "area:quality", "area:testing"]
---

# Phase 6 - Validation and Reporting Closeout

## Summary

Validate the end state of the coverage programme and document the final results clearly.

## Scope

- Task 6.1: rerun coverage across the repository.
- Task 6.2: compare baseline and final coverage.
- Task 6.3: document any remaining gap to the 80% target.
- Task 6.4: produce the final validation report.
- Task 6.5: confirm PR and issue checklists are complete.
- Task 6.6: record the closeout and release-readiness notes.

## Acceptance Criteria

- [ ] Final coverage state is measured and documented.
- [ ] Remaining gap, if any, is explicit and justified.
- [ ] Validation report exists and is linked from the programme docs.
- [ ] PR and issue closeout checklists are fully complete.

## Dependencies

- Phases 1 to 5 are complete or at least measurable.
- Final coverage run is reproducible from the current branch.

## Additional Context

This phase is the closeout gate for the whole programme and should not be marked done until the PR and issue bodies are aligned.

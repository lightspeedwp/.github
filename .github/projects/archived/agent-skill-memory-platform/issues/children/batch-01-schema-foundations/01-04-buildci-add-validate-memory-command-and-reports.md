---
name: "Build/CI"
about: "Local issue draft for memory platform rollout"
title: "[Build/CI] Add validate-memory command and report output"
labels: [status:needs-triage, priority:important, type:build, area:ci, area:tests]
---

## Summary

Add memory validation scripts and report outputs into local and CI execution paths.

## Proposed Solution

- Deliver the requested outcome in a scoped, testable implementation slice.
- Keep changes aligned with memory schema contracts and active inventory lock.

## Acceptance Criteria

- [x] Scope is clearly implemented and documented.
- [x] Validation commands and/or tests updated where relevant.
- [x] No regression in existing validation pipeline.
- [x] Documentation/changelog updated when needed.

## Dependencies

- [x] Parent epic linkage confirmed.
- [x] Upstream schema and registry assumptions still valid.

## Additional Context

- Active project path: `.github/projects/active/agent-skill-memory-platform/`.
- Expected baseline remains 19 agents and 89 skills unless inventory lock is intentionally updated.

## Definition of Ready (DoR)

- [x] Problem statement and outcome defined.
- [x] Acceptance criteria written.
- [x] Dependencies mapped.
- [x] Estimate added.

## Definition of Done (DoD)

- [x] All acceptance criteria met.
- [x] Tests and validation checks pass.
- [x] Documentation/changelog updated as needed.
- [x] Local draft reflects final implementation status.

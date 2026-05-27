---
name: "Epic"
about: "Propose/manage a large, multi-part initiative or project grouping stories/features/tasks"
title: "[Epic] Memory validation and automation integration"
labels: [status:needs-planning, priority:important, type:epic, area:ci, area:tests, ai-ops:tools]
---

## Epic Summary

Integrate memory validation into the existing quality pipeline with dedicated commands, tests, and drift enforcement.

## Linked Stories/Tasks

- Batch 01 schema foundations
- Batch 02 agent memory
- Batch 03 skill memory

## Milestones & Timeline

- Milestone: Agent Skill Memory Platform.
- Timeline: planning, schema foundation, asset coverage, validation integration, rollout.

## Acceptance Criteria

- [x] validate-memory command implemented and tested.
- [x] validate:all includes memory validation.
- [x] Profile drift checks fail loudly on missing coverage.
- [x] Example packs are validated alongside snapshots.

## Dependencies / Blockers

- Depends on stable counts for agents and skills during implementation.
- Requires local validation scripts to stay non-mutating by default.

## Additional Context

This epic is part of the active project at `.github/projects/active/agent-skill-memory-platform/`.

## Definition of Ready (DoR)

- [x] Epic goal and scope defined.
- [x] Linked stories/tasks listed.
- [x] Milestones and timeline mapped.
- [x] Dependencies/blockers identified.
- [x] Estimate added.
- [x] Stakeholders/approvers listed.

## Definition of Done (DoD)

- [x] All linked stories/tasks completed and closed.
- [x] Documentation/changelog updated.
- [x] QA and testing complete.
- [x] Milestone closed and release notes prepared.

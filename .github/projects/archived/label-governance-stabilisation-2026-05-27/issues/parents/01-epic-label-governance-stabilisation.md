---
name: "Epic"
about: "Stabilise repository label governance and automation contracts"
title: "[Epic] Label governance stabilisation and automation hardening"
labels: [status:needs-planning, priority:important, type:epic, area:ci, type:automation]
---

## Epic Summary

Stabilise label governance by resolving orphan labels, enforcing canonical label definitions, and hardening workflow policies that consume label metadata.

## Linked Stories/Tasks

- #95 Orphan labels audit and remediation
- #66 Canonical labels and seeding workflow
- #67 README regeneration scoping and concurrency guard
- #69 CodeRabbit-before-Copilot review order enforcement

## Acceptance Criteria

- [ ] Orphan label set is remediated and documented.
- [ ] Canonical label source of truth and seeding workflow are aligned.
- [ ] README regeneration automation is scoped to changed paths and race-safe.
- [ ] Review order policy is codified and validated in workflows.

## Dependencies / Blockers

- Needs current inventory output from #95 before final canonical cleanup.
- Requires workflow validation in CI-compatible local commands.

## Additional Context

This epic belongs to `.github/projects/archived/label-governance-stabilisation-2026-05-27/`.

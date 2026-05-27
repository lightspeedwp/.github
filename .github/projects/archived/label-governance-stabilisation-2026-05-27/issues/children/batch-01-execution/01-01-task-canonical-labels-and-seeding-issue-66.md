---
name: "Task"
about: "Execute canonical label and seeding workflow hardening for issue #66"
title: "[Task] Canonical labels plus org seeding workflow alignment (#66)"
labels: [status:ready, priority:important, type:task, area:ci, type:automation, type:documentation]
---

## Task Summary

Execute the canonical label policy and seed workflow updates tracked in #66, based on the orphan-label decisions from #95.

## Implementation Checklist

- [x] Align canonical label definitions and docs.
- [x] Update seeding workflow for deterministic sync behaviour.
- [x] Add guardrails for missing or deprecated labels.
- [x] Validate workflow and docs commands locally.

## Acceptance Criteria

- [x] #66 reflects final canonical label contract.
- [x] Seeding workflow applies canonical set consistently.
- [x] Validation commands pass with no schema or lint regressions.

## Implementation Notes (2026-05-27)

- Added `.github/label-governance-policy.yml` as the policy gate for destructive cleanup.
- Hardened `scripts/agents/includes/label-sync.js` with a real CLI runtime used by workflow execution.
- Enforced non-destructive default behaviour for orphan labels with explicit deferred-delete reporting.
- Gated deletions behind both policy enablement and approved per-label allowlist entries.
- Updated `scripts/validation/validate-labeling-configs.cjs` to validate the governance policy schema and canonical label prefix contract.
- Updated `.github/workflows/labeling.yml` to pass `GITHUB_TOKEN` to label sync and publish the label-sync report artifact.

## Remaining Gate

- Keep destructive orphan deletion disabled until #95 decisions are approved and encoded in `.github/label-governance-policy.yml`.

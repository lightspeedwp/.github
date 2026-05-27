---
name: "Task"
about: "Execute canonical label and seeding workflow hardening for issue #66"
title: "[Task] Canonical labels plus org seeding workflow alignment (#66)"
labels: [status:ready, priority:important, type:task, area:ci, type:automation, type:documentation]
---

## Task Summary

Execute the canonical label policy and seed workflow updates tracked in #66, based on the orphan-label decisions from #95.

## Implementation Checklist

- [ ] Align canonical label definitions and docs.
- [ ] Update seeding workflow for deterministic sync behaviour.
- [ ] Add guardrails for missing or deprecated labels.
- [ ] Validate workflow and docs commands locally.

## Acceptance Criteria

- [ ] #66 reflects final canonical label contract.
- [ ] Seeding workflow applies canonical set consistently.
- [ ] Validation commands pass with no schema or lint regressions.

---
file_type: documentation
title: "#672 Audit - Agent and Script File Migration Status"
description: "Phase 1 migration-status audit for .github/agents and .github/scripts against root canonical locations, including duplicate inventory and recommendations."
category: audits
created_date: "2026-06-03"
last_updated: "2026-06-03"
version: "v1.0.0"
owners:
  - LightSpeed Team
authors:
  - GitHub Copilot
tags:
  - wave-5
  - phase-1
  - issue-672
  - migration
  - agents
  - scripts
status: active
stability: stable
domain: governance
---

# #672 Audit - Agent and Script File Migration Status

## Objective

Verify whether `.github/agents/` and `.github/scripts/` still exist, assess migration status against root canonical folders, and identify duplicates or unfinished moves.

## Current Status

### `.github/agents/`

- Exists: Yes
- Files found:
  - `.github/agents/README.md`

Root equivalent:

- `agents/` exists and contains full portable agent catalogue and specs.

Assessment:

- Migration mostly complete for agent specs (root is canonical).
- Legacy local README remains; should be either retained as boundary pointer or retired.

### `.github/scripts/`

- Exists: Yes
- Files found:
  - `.github/scripts/validate-footers.js`

Root equivalent:

- `scripts/` exists with comprehensive script suite including `scripts/validation/`.

Assessment:

- Migration incomplete or exception undocumented.
- One executable remains in `.github/scripts`, creating ambiguous script ownership.

## Duplicate and Overlap Inventory

| Concern | `.github` Path | Root Path | Status |
| --- | --- | --- | --- |
| Agent docs/index overlap | `.github/agents/README.md` | `agents/README.md` and `agents/*.agent.md` | Partial overlap |
| Script execution overlap | `.github/scripts/validate-footers.js` | `scripts/validation/*` | Boundary overlap |

## Migration Health Score

| Area | Score | Rationale |
| --- | --- | --- |
| Agent migration | 90% | Specs are in root; only legacy index file remains in `.github/agents`. |
| Script migration | 70% | Most scripts are in root; one `.github/scripts` executable remains. |
| Documentation clarity | 60% | Existing references still imply older file locations. |

## Recommendations

1. Decide policy for `.github/agents/README.md`:
   - Option A: keep as local boundary pointer with explicit "index-only" scope.
   - Option B: remove and redirect all references to root `agents/`.
2. Move `.github/scripts/validate-footers.js` into `scripts/validation/` and leave a compatibility note or wrapper if needed.
3. Add CI rule to flag net-new files under `.github/agents` and `.github/scripts` unless explicitly approved by governance policy.
4. Update documentation to state canonical script and agent locations clearly.

## Deliverables

- Migration status audit: complete.
- File inventory: complete.
- Recommendations: complete.

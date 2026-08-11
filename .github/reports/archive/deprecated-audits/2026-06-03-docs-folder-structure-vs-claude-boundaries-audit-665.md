---
file_type: documentation
title: "#665 Audit - Documentation Folder Structure vs CLAUDE.md Boundaries"
description: "Phase 1 audit comparing current docs/, .github/, and instructions/ placement against CLAUDE.md boundary guidance with reorganisation recommendations."
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
  - issue-665
  - file-organisation
  - boundaries
  - claude-md
status: active
stability: stable
domain: governance
---

# #665 Audit - Documentation Folder Structure vs CLAUDE.md Boundaries

## Objective

Compare current `docs/`, `.github/`, and `instructions/` layout against CLAUDE.md repository boundary guidance and identify reorganisation needs.

## Boundary Baseline (from CLAUDE.md)

- `.github/`: GitHub-native governance files, workflows, templates, local instructions, reports, projects.
- `docs/`: permanent human documentation.
- `instructions/`: portable reusable instruction files.
- Reusable AI assets should live in root portable folders (for example `agents/`, `skills/`, `workflows/`).

## Current State Assessment

### Conformant Areas

- `docs/` is used as the primary human documentation location.
- `.github/reports/` and `.github/projects/` are in expected control-plane boundaries.
- Root-level `instructions/` exists and is actively used for portable standards.

### Boundary Drift Areas

1. `.github/agents/` exists alongside root `agents/`.
2. `.github/scripts/` exists alongside root `scripts/`.
3. Some documentation and templates still reference deprecated/relocated docs (`AUTOMATION_GOVERNANCE.md`, `PR_LABELS.md`, `ISSUE_LABELS.md`).
4. Filename naming drift in docs references (`ISSUE-FIELDS.md` vs `ISSUE_FIELDS.md`).

## Inventory and Mapping Table

| Location | Intended Boundary | Current Assessment | Action |
| --- | --- | --- | --- |
| `docs/` | Permanent human documentation | Mostly aligned | Keep; remediate broken references |
| `.github/` | GitHub-native control plane | Mostly aligned | Keep; remove/retire legacy overlap content |
| `instructions/` | Portable standards | Aligned | Keep |
| `.github/agents/README.md` | Potentially legacy local index | Boundary overlap with `agents/` | Evaluate deprecation or explicit local-only scope |
| `.github/scripts/validate-footers.js` | Legacy local script path | Boundary overlap with `scripts/` | Migrate or retain with explicit rationale |

## Reorganisation Proposal

### Phase A - Documentation link hygiene (low risk)

- Replace all references to retired docs:
  - `docs/ISSUE_LABELS.md` -> `docs/LABELING.md`
  - `docs/PR_LABELS.md` -> `docs/LABELING.md`
  - `docs/AUTOMATION_GOVERNANCE.md` -> `docs/AUTOMATION.md`
- Standardise `ISSUE_FIELDS.md` naming in docs and templates.

### Phase B - Boundary normalisation (medium risk)

- Decide if `.github/agents/README.md` remains as boundary note only; otherwise retire and point to root `agents/`.
- Migrate `.github/scripts/validate-footers.js` into root `scripts/validation/` or explicitly classify as `.github`-local operation and document that exception.

### Phase C - Guardrails (low risk)

- Add CI checks for deprecated doc links and inconsistent filename references.
- Add a periodic boundary audit script to detect overlapping root vs `.github` file families.

## Impact Assessment

- Immediate impact of Phase A is positive (fewer broken links, clearer contributor path).
- Phase B requires small coordination because some workflows or docs may still reference `.github/scripts`.
- No runtime production risk identified; impact is governance and maintainability.

## Deliverables

- Inventory: complete.
- Mapping table: complete.
- Reorganisation proposal: complete.

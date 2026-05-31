---
file_type: "documentation"
title: "Instructions Deprecation Index"
description: "Tracks deprecated documentation files and consolidated replacements."
version: "v1.0.0"
last_updated: "2026-05-31"
owners: ["LightSpeedWP Team"]
---

# Deprecated Instructions & Documentation

This index tracks documentation files that have been consolidated or deprecated, along with their replacement locations.

---

## Consolidated & Deprecated Files

### Labeling Documentation (Consolidated)

The following files have been consolidated into [`docs/LABELING.md`](../docs/LABELING.md):

| Deprecated File | Consolidated Into | Reason |
| --- | --- | --- |
| `docs/LABEL_STRATEGY.md` | `docs/LABELING.md` | Duplicated content and strategy; merged into single comprehensive guide |
| `docs/ISSUE_LABELS.md` | `docs/LABELING.md` | Issue-specific labeling now in main guide under "Issue Labeling" section |
| `docs/PR_LABELS.md` | `docs/LABELING.md` | PR-specific labeling now in main guide under "Pull Request Labeling" section |

**Portable Instructions Retained:**

- `instructions/labeling.instructions.md` — Portable labeling instructions (cross-repo reusable)

---

### Automation & Workflows Documentation (Consolidated)

The following files have been consolidated into [`docs/AUTOMATION.md`](../docs/AUTOMATION.md):

| Deprecated File | Consolidated Into | Reason |
| --- | --- | --- |
| `docs/AUTOMATION_GOVERNANCE.md` | `docs/AUTOMATION.md` | Governance, policies, and workflow standards merged into single guide |
| `docs/WORKFLOWS.md` | `docs/AUTOMATION.md` | Workflow overview and individual workflow details now in main automation guide |

**Portable Instructions Retained:**

- `instructions/automation.instructions.md` — Portable automation and workflow instructions (cross-repo reusable)

---

### File Path Corrections

The following files were moved to correct nested path issues:

| Previous Path | New Path | Issue |
| --- | --- | --- |
| `.github/.github/docs/workflow-coordination.md` | `.github/docs/workflow-coordination.md` | Nested `.github` directory removed |

---

## Migration Guide

### If You Have Links to Deprecated Files

Update references as follows:

- Any link to `docs/LABEL_STRATEGY.md` → change to `docs/LABELING.md`
- Any link to `docs/ISSUE_LABELS.md` → change to `docs/LABELING.md`
- Any link to `docs/PR_LABELS.md` → change to `docs/LABELING.md`
- Any link to `docs/AUTOMATION_GOVERNANCE.md` → change to `docs/AUTOMATION.md`
- Any link to `docs/WORKFLOWS.md` → change to `docs/AUTOMATION.md`

### For Portable Instructions

If you're building reusable agents or instructions:

- Refer to `instructions/labeling.instructions.md` (portable, cross-repo)
- Refer to `instructions/automation.instructions.md` (portable, cross-repo)
- These files contain the same high-level patterns in a reusable format

---

## Rationale

Documentation consolidation improves:

- **Discoverability:** Single, canonical source of truth instead of scattered files
- **Maintainability:** One file to update instead of multiple duplicates
- **Clarity:** Clear scope boundaries between documentation (docs/) and portable instructions (instructions/)
- **Navigation:** Comprehensive guides instead of fragmented references

---

## References

- [Labeling Guide](../docs/LABELING.md) — Consolidated labeling strategy and automation
- [Automation Guide](../docs/AUTOMATION.md) — Consolidated automation governance and workflows
- [Repository Boundaries](../CLAUDE.md#repository-boundaries) — File organisation conventions

---

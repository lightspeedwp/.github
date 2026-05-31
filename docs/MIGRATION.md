---
file_type: "documentation"
title: "Documentation Migration Guide"
description: "Migration path for consolidated documentation files and updated references."
version: "v1.0.0"
last_updated: "2026-05-31"
owners: ["LightSpeedWP Team"]
---

# Documentation Migration Guide

This guide provides migration paths for documentation files that have been consolidated or relocated.

---

## Consolidated Documentation Files

The following documentation files have been consolidated into comprehensive guides to improve maintainability and reduce duplication.

### Labeling Documentation (Consolidated)

The following files have been consolidated into [`docs/LABELING.md`](./LABELING.md):

| Deprecated File | Consolidated Into | Reason |
| --- | --- | --- |
| `docs/LABEL_STRATEGY.md` | `docs/LABELING.md` | Duplicated content and strategy; merged into single comprehensive guide |
| `docs/ISSUE_LABELS.md` | `docs/LABELING.md` | Issue-specific labeling now in main guide under "Issue Labeling" section |
| `docs/PR_LABELS.md` | `docs/LABELING.md` | PR-specific labeling now in main guide under "Pull Request Labeling" section |

**Portable Instructions Retained:**

- `instructions/labeling.instructions.md` — Portable labeling instructions (cross-repo reusable)

### Automation & Workflows Documentation (Consolidated)

The following files have been consolidated into [`docs/AUTOMATION.md`](./AUTOMATION.md):

| Deprecated File | Consolidated Into | Reason |
| --- | --- | --- |
| `docs/AUTOMATION_GOVERNANCE.md` | `docs/AUTOMATION.md` | Governance, policies, and workflow standards merged into single guide |
| `docs/WORKFLOWS.md` | `docs/AUTOMATION.md` | Workflow overview and individual workflow details now in main automation guide |

**Portable Instructions Retained:**

- `instructions/automation.instructions.md` — Portable automation and workflow instructions (cross-repo reusable)

### File Path Corrections & Renames

The following files were moved or renamed to correct structural issues and enforce naming conventions:

| Previous Path | New Path | Change Reason |
| --- | --- | --- |
| `.github/.github/docs/workflow-coordination.md` | `docs/WORKFLOW_COORDINATION.md` | Nested `.github` directory removed; renamed to uppercase per `docs/` naming convention |

---

## Migration Steps

### If You Have Links to Deprecated Files

Update all references across your documentation and codebase:

#### Labeling Documentation

- Any link to `docs/LABEL_STRATEGY.md` → change to `docs/LABELING.md`
- Any link to `docs/ISSUE_LABELS.md` → change to `docs/LABELING.md`
- Any link to `docs/PR_LABELS.md` → change to `docs/LABELING.md`

#### Automation & Workflows Documentation

- Any link to `docs/AUTOMATION_GOVERNANCE.md` → change to `docs/AUTOMATION.md`
- Any link to `docs/WORKFLOWS.md` → change to `docs/AUTOMATION.md`

#### Workflow Coordination Documentation

- Any link to `.github/docs/workflow-coordination.md` → change to `docs/WORKFLOW_COORDINATION.md`

### For Portable Instructions

If you're building reusable agents or instructions across repositories:

- Refer to `instructions/labeling.instructions.md` (portable, cross-repo)
- Refer to `instructions/automation.instructions.md` (portable, cross-repo)
- These files contain the same high-level patterns in a reusable format

---

## Rationale

Documentation consolidation improves:

- **Discoverability:** Single, canonical source of truth instead of scattered files
- **Maintainability:** One file to update instead of multiple duplicates
- **Clarity:** Clear scope boundaries between documentation (`docs/`) and portable instructions (`instructions/`)
- **Navigation:** Comprehensive guides instead of fragmented references
- **Naming Consistency:** Uppercase naming convention enforced across `docs/` directory

---

## References

- [Consolidation Index](../instructions/DEPRECATED.md) — Full index of all consolidated files
- [Labeling Guide](./LABELING.md) — Consolidated labeling strategy and automation
- [Automation Guide](./AUTOMATION.md) — Consolidated automation governance and workflows
- [Workflow Coordination](./WORKFLOW_COORDINATION.md) — Workflow pattern documentation
- [Repository Boundaries](../CLAUDE.md#repository-boundaries) — File organisation conventions

---

*Last updated: 2026-05-31*

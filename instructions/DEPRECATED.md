---
file_type: documentation
title: Instructions Deprecation Index
description: Tracks deprecated documentation files and consolidated replacements.
version: v1.0.2
last_updated: '2026-08-21'
owners:
  - LightSpeedWP Team
tags:
  - deprecation
  - migration
  - documentation
status: active
stability: stable
domain: governance
---

# Deprecated Instructions & Documentation

This index tracks documentation files that have been consolidated or deprecated, along with their replacement locations.

---

## Consolidated & Deprecated Files

### Labelling Documentation (Consolidated)

The following files have been consolidated into [`docs/LABELING.md`](../docs/LABELING.md):

| Deprecated File | Consolidated Into | Reason |
| --- | --- | --- |
| `docs/LABEL_STRATEGY.md` | `docs/LABELING.md` | Duplicated content and strategy; merged into single comprehensive guide |
| `docs/ISSUE_LABELS.md` | `docs/LABELING.md` | Issue-specific labeling now in main guide under "Issue Labelling" section |
| `docs/PR_LABELS.md` | `docs/LABELING.md` | PR-specific labeling now in main guide under "Pull Request Labelling" section |

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

| Previous Path | New Path | Change Reason |
| --- | --- | --- |
| `.github/.github/docs/workflow-coordination.md` | `docs/WORKFLOW_COORDINATION.md` | Nested `.github` directory removed; renamed to uppercase per `docs/` naming convention |

---

## Migration Guide

See [`docs/MIGRATION.md`](../docs/MIGRATION.md) for the complete migration guide, including:

- Links and references to update
- Migration steps by documentation type
- Rationale for consolidation

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

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

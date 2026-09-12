---
file_type: archive-index
title: "GitHub Workflows Archive Index"
description: "Multi-year archive tracking for workflow consolidation initiatives"
status: active
created: 2026-09-11
---

# GitHub Workflows Archive Index

Central index for all archived GitHub Actions workflows. This document tracks workflow archives across multiple years and consolidation initiatives.

---

## Archive Summary

| Archive | Date | Workflows | Reason | Epic | Status |
|---------|------|-----------|--------|------|--------|
| [2026-09-11](#2026-09-11-archive) | Sep 11, 2026 | 71 | Phase 1 + Option A: Workflow Consolidation Initiative | #2896 | ✅ Complete |

---

## 2026-09-11 Archive

**Archive Name:** Workflow Consolidation Initiative — Phase 1 + Option A  
**Date:** September 11, 2026 (updated Sep 12, 2026)  
**Workflows Archived:** 71 non-essential workflows  
**Categories:** 8 (labeling, validation, documentation, issue-management, pr-management, testing, ci-cd, utilities)  
**Status:** ✅ Complete

### Details

**Purpose:**  
Phase 1 + Option A of the Workflow Consolidation Initiative to reduce 76 active workflows to 14 core unified workflows. Safely archives 71 non-essential workflows and creates 9 core workflow stubs aligned to Phase 2 architecture. Prepares repository for Phase 2 consolidation work (Oct 1-31, 2026).

**Impact:**
- Code deduplication: ~1000+ lines of duplicate logic eliminated
- Maintenance burden: 82% reduction (76 → 14 total; 9 core active + 5 unified Phase 2)
- GitHub Actions minutes: Expected 15-20% savings
- PR merge time: Reduced from 8-12 min to 4-6 min
- Check gates: Reduced from 15-20+ per PR to 1 unified gate
- Phase 2 ready: 71 archived workflows ready for consolidation into 5 unified workflows

### Archive Location

```
.github/workflows/
└── archived/
    └── 2026-09-11/
        ├── README.md (archive index & navigation)
        ├── ARCHIVED_WORKFLOWS_MANIFEST.md (workflow inventory)
        ├── RESTORE.md (restoration procedures)
        │
        ├── labeling/ (9 workflows)
        ├── validation/ (12 workflows)
        ├── documentation/ (8 workflows)
        ├── issue-management/ (10 workflows)
        ├── pr-management/ (7 workflows)
        ├── testing/ (8 workflows)
        ├── ci-cd/ (8 workflows)
        └── utilities/ (8 workflows)
```

### Related Documentation

- **[Archive README](./2026-09-11/README.md)** — Archive overview and navigation
- **[Workflow Manifest](./2026-09-11/ARCHIVED_WORKFLOWS_MANIFEST.md)** — Complete inventory of 71 workflows (Phase 1 + Option A)
- **[Restoration Procedures](./2026-09-11/RESTORE.md)** — How to restore workflows
- **[Consolidation Mapping](../docs/WORKFLOW_CONSOLIDATION_MAPPING.md)** — Old workflow → New consolidated workflow mapping

### Linked Issues

- **Epic:** [Epic] Workflow Consolidation Initiative 2026-Q4 (TBD #XXXX)
- **Phase 1 PR:** `refactor: consolidate workflow archive and mapping — Phase 1 prep` (TBD #YYYY)

### Consolidation Timeline

| Phase | Period | Work | Status |
|-------|--------|------|--------|
| **Phase 1 + Option A** | Sep 11-12 | Archive 71 workflows, create 9 core stubs, reconcile inventory | ✅ Complete |
| **Phase 2** | Oct 1-15 | Build 14 core consolidated workflows | ⏳ Planned |
| **Phase 3** | Oct 16-22 | Testing, validation, production merge | ⏳ Planned |

### Restoration Information

**Quick Restore:**
```bash
# Restore single workflow
git show refactor/workflow-consolidation-and-archiving:.github/workflows/archived/2026-09-11/labeling/labeling.yml > .github/workflows/labeling.yml

# Restore entire archive
git checkout refactor/workflow-consolidation-and-archiving -- .github/workflows/archived/2026-09-11/
```

**Detailed procedures:** See [RESTORE.md](./2026-09-11/RESTORE.md)

**Rollback Timeline:**
- Estimated time to restore all 71 workflows: < 30 minutes
- Estimated time to restore individual workflow: < 5 minutes
- Retention period: 2 weeks (Sep 11 - Sep 25, 2026)

---

## Archive Categories

### By Consolidation Impact

| Consolidation | Before | After | Category |
|---|---|---|---|
| Unified into 1 | 9 | 1 | Labeling |
| Unified into 1 | 12 | 1 | Validation |
| Unified into 1 | 8 | 1 | Documentation |
| Unified into 1 | 8 | 1 | Testing |
| Distributed | 10 | 2-3 | Issue Management |
| Distributed | 7 | 2 | PR Management |
| Distributed | 8 | 1-2 | CI/CD |
| Distributed | 8 | 0-1 | Utilities |

### Category Details

**Labeling (9 → 1):** Consolidates auto-labeling, issue type allocation, governance, and validation  
**Validation (12 → 1):** Consolidates branch names, PR templates, changelog, docs, and linting  
**Documentation (8 → 1):** Consolidates README generation, badges, and docs maintenance  
**Issue Management (10 → 2-3):** Consolidates issue creation, triage, lifecycle, and automation  
**PR Management (7 → 2):** Consolidates PR validation, linking, and Mergify integration  
**Testing (8 → 1):** Consolidates unit, integration, e2e tests, and coverage  
**CI/CD (8 → 1-2):** Consolidates build, deploy, branch cleanup, and release  
**Utilities (8 → 0-1):** Consolidates meta, secrets, metrics, and agents  

---

## Future Archives

This section will be updated as additional consolidation initiatives occur.

### Planned Archives

| Year | Initiative | Workflows | Status | Notes |
|------|-----------|-----------|--------|-------|
| 2026 Q4 | Phase 2: Consolidation | TBD | ⏳ Planned | After Phase 1 completes |
| 2027 | Agentic Workflow Consolidation | TBD | 🔄 Planning | Depends on AI agent maturity |

---

## Archive Access & Permissions

### Read Access
- **Public:** Anyone with read access to the repository
- **Files:** All workflow files, documentation, and procedures

### Restoration Access
- **Restore commands:** Available to anyone with git access
- **PR merging:** Requires tech lead approval for consolidation PRs
- **Rollback:** Available in < 30 minutes if critical issues discovered

### Retention Policy

| Archive | Retention | Reason | Action Date |
|---------|-----------|--------|------------|
| 2026-09-11 | 2 weeks | Allow rollback period for Phase 1 | Sep 25, 2026 |

---

## Related Documentation

### Master Plan
- [WORKFLOW_CONSOLIDATION_MASTER_PLAN.md](../projects/active/workflow-consolidation-master-plan-2026-09/WORKFLOW_CONSOLIDATION_MASTER_PLAN.md)
- [PHASE_1_IMPLEMENTATION_PLAN.md](../projects/active/workflow-consolidation-master-plan-2026-09/PHASE_1_IMPLEMENTATION_PLAN.md)

### Specifications
- [workflow-consolidation-2026-q4.spec.md](../specs/workflow-consolidation-2026-q4.spec.md)

### Mappings & References
- [WORKFLOW_CONSOLIDATION_MAPPING.md](../docs/WORKFLOW_CONSOLIDATION_MAPPING.md)
- [AUTOMATION.md](../docs/AUTOMATION.md)

### Validation
- [quickstart.md](../projects/active/workflow-consolidation-master-plan-2026-09/quickstart.md) — Phase 1 validation tests

---

## Maintenance

### How to Add a New Archive Entry

1. Create new directory: `.github/workflows/archived/{YYYY-MM-DD}/`
2. Create `README.md` in archive directory
3. Create `ARCHIVED_WORKFLOWS_MANIFEST.md` with workflow inventory
4. Create `RESTORE.md` with restoration procedures
5. Organize workflows into category subdirectories
6. Add entry to this INDEX.md

### Archive Naming Convention

**Format:** `YYYY-MM-DD` (ISO 8601)  
**Example:** `2026-09-11` (September 11, 2026)

### Required Archive Documentation

- `README.md` — Overview, purpose, and navigation
- `ARCHIVED_WORKFLOWS_MANIFEST.md` — Complete workflow inventory
- `RESTORE.md` — Detailed restoration procedures and rollback criteria
- Category subdirectories — Workflows organized by functional category

---

## Questions & Contact

For questions about archived workflows:

- **Workflow Consolidation Owner:** Ashley Shaw (ashley@lightspeedwp.agency)
- **Archive Location:** `.github/workflows/archived/`
- **Master Plan:** `.github/projects/active/workflow-consolidation-master-plan-2026-09/`
- **Related Epic:** [Epic] Workflow Consolidation Initiative 2026-Q4

---

**Archive Index Version:** 1.0  
**Created:** Sep 11, 2026  
**Last Updated:** Sep 11, 2026  
**Status:** ✅ Active

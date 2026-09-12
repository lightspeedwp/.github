---
file_type: documentation
title: "GitHub Actions Automation Architecture"
description: "Organisation-wide GitHub Actions workflow architecture and consolidated workflow reference"
date_created: "2026-09-12"
last_updated: "2026-09-12"
status: "active"
version: "2.0-consolidated"
---

# GitHub Actions Automation Architecture

**Organisation-wide GitHub Actions workflows, consolidated architecture, and automation reference.**

This document describes the 14 unified workflows that serve as the backbone of the LightSpeed `.github` automation system.

---

## Overview

**Phase 1 (Sep 2026):** Backup & Archive Initiative
- Archived 71 non-essential workflows (Phase 1 + Option A)
- Created 9 core workflow stubs aligned to Phase 2 architecture
- Preserved full git history and restoration capability
- Prepared foundation for Phase 2 consolidation

**Phase 2 (Oct 2026+):** Consolidation Initiative
- Unified 76 workflows → 14 core consolidated workflows
- 82% reduction in workflow maintenance burden
- Eliminated ~500 lines of duplicate code
- Expected 15-20% GitHub Actions minutes savings

**Current Status:** Phase 1 complete; Phase 2 implementation ready

---

## Core Unified Workflows (14 total)

The following 14 workflows provide all automation capabilities across the organisation:

### NEW in Phase 2 — Unified Consolidated Workflows

| Workflow | Purpose | Consolidates From | Replaces | Status |
|----------|---------|-------------------|----------|--------|
| **labeling-unified.yml** | Unified labeling engine for all label operations (auto-label, governance, batch operations) | 9 archived labeling workflows | labeling.yml, labeling-governance.yml, issue-labeling-automation.yml, meta-labels-sync.yml, batch-label-prs.yml, remediate-bare-labels.yml, validate-issue-labels.yml, label-audit-report.yml, openspec-sync-labels.yml | ✅ New Phase 2 |
| **validation-unified.yml** | Unified validation gate for branch names, PR templates, documentation, and workflow validation | 12 archived validation workflows | branch-name-validation.yml, pr-template-validation.yml, changelog-safety-audit.yml, validate-dor-dod-sections.yml, docs-validation.yml, workflow-validation.yml, validate-blocking-issue-before-close.yml, validate-blocking-status-before-close.yml, validate-project-linking.yml, checks.yml (validation portions), and partial pr-management validation | ✅ New Phase 2 |
| **linting-unified.yml** | Unified code quality linting (merged from validation + testing archives) | 2 validation archived workflows | linting.yml, markdown-audit-ci-optimization.yml | ✅ New Phase 2 |
| **quality-gates.yml** | Unified security and quality gates (secret scanning, spec validation) | 5 utilities archived workflows + validation | gitleaks.yml, gitleaks-update.yml, gitleaks-reusable.yml, agent-spec-validation.yml, openspec-validation.yml | ✅ New Phase 2 |
| **testing-unified.yml** | Unified test orchestration for all test types (unit, integration, e2e, coverage) | 8 archived testing workflows | testing.yml, release-e2e-tests.yml, test-runner.yml, integration-tests.yml, unit-tests.yml, e2e-tests.yml, test-coverage.yml, checks.yml (test portions) | ✅ New Phase 2 |

### EXISTING — Retained & Enhanced (9 total)

| Workflow | Purpose | Consolidates From | Status |
|----------|---------|-------------------|--------|
| **events-issue-pr-metadata.yml** | Event metadata handling for issue/PR creation and lifecycle | 2 archived issue-management workflows (issue-create-enhanced.yml, metadata-governance.yml) | ✅ Enhanced |
| **documentation.yml** | Documentation generation, badges, and docs maintenance | 8 archived documentation workflows | ✅ Unified |
| **issue-management.yml** | Issue automation, triage, compliance, and lifecycle | 8 archived issue-management workflows | ✅ Unified |
| **pr-workflow.yml** | PR automation, validation, linking, and reviewer assignment | 6 archived pr-management workflows + pr-template-validation.yml | ✅ Unified |
| **branch-management.yml** | Branch lifecycle, cleanup, and production protection | 3 archived ci-cd workflows + 1 utilities workflow | ✅ Unified |
| **changelog-management.yml** | Changelog automation and release notes generation | (foundational) | ✅ Maintained |
| **release-orchestration.yml** | Release coordination and deployment automation | 1 archived ci-cd workflow (release-trigger.yml) | ✅ Unified |
| **reporting-metrics.yml** | GitHub Actions metrics, performance monitoring, and reporting | 1 archived utilities workflow (actions-minute-savings-watch.yml) | ✅ Unified |
| **project-management.yml** | Project coordination and meta automation | 1 archived utilities workflow (meta.yml) | ✅ Unified |

---

## Workflow Consolidation Timeline

### Phase 1: Backup & Archive (Sep 11-30, 2026)

**Status:** ✅ COMPLETE

| Date | Milestone | Task |
|------|-----------|------|
| Sep 11 | Archive infrastructure created | Created 8 category subdirectories in `.github/workflows/archived/2026-09-11/` |
| Sep 11-12 | 62 workflows archived (Phase 1) | Moved initial non-essential workflows to archive with full git history |
| Sep 12 | Option A reconciliation | Archived 9 additional workflows; created 9 core stubs; restored documentation.yml (total: 71 archived) |
| Sep 12 | Consolidation mapping updated | Documented all 71→14 workflow mappings and inventory reconciliation |
| Sep 12-30 | Documentation & procedures | Updated RESTORE.md, manifest, archive index with final counts |
| Sep 16-30 | Phase 1 validation & review | PR #2902 review and merge to develop |

### Phase 2: Consolidation Implementation (Oct 1-31, 2026)

**Status:** 🔄 PLANNED

| Date | Milestone | Task |
|------|-----------|------|
| Oct 1-5 | New workflow development | Build 5 new unified workflows (labeling, validation, linting, quality-gates, testing) |
| Oct 6-10 | Integration testing | Test consolidated workflows in branch with parallel execution |
| Oct 11-15 | Cutover preparation | Final validation, mirror testing, rollback procedures |
| Oct 16-31 | Production deployment | Merge consolidated workflows, monitor stability |

### Phase 3: Monitoring & Optimization (Nov 2026+)

**Status:** 📋 PLANNED

- Monitor GitHub Actions minutes usage and cost savings
- Optimize consolidated workflow performance
- Gather team feedback on new unified workflows
- Plan Phase 3+ incremental improvements

---

## Workflow Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                    GitHub Events (PR, Issue, Push)                   │
└────────────────────┬─────────────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼────┐ ┌────▼────┐ ┌───▼─────┐
    │  PR Event   │ Issue Event│Push Event
    └────┬────┘ └────┬────┘ └───┬─────┘
         │           │          │
    ┌────▼─────────────▼──────────▼────┐
    │   events-issue-pr-metadata.yml    │ ← Event dispatch & enrichment
    │   (metadata handling)             │
    └────┬──────────────┬───────────────┘
         │              │
    ┌────▼──────┐   ┌───▼────────────────┐
    │  PR Flows  │   │   Issue Flows      │
    │            │   │                    │
    │ • validation-│   │ • issue-management│
    │   unified   │   │ • project-mgmt    │
    │ • pr-workflow   │ • release-orches   │
    │ • linting-unif  │ • changelog-mgmt   │
    │ • quality-gates │                    │
    └────┬──────┘   └───┬────────────────┘
         │              │
    ┌────▼──────────────▼────────────────┐
    │  Shared Quality & Output Flows     │
    │                                    │
    │ • testing-unified.yml              │
    │ • labeling-unified.yml             │
    │ • documentation.yml                │
    │ • branch-management.yml            │
    │ • reporting-metrics.yml            │
    └────────────────────────────────────┘
```

---

## Consolidation Project

**Master Plan:** `.github/projects/active/workflow-consolidation-master-plan-2026-09/`

**Related Documentation:**
- [Consolidation Mapping](./WORKFLOW_CONSOLIDATION_MAPPING.md) — Complete 76-workflow mapping
- [Archive README](../.github/workflows/archived/2026-09-11/README.md) — Archive structure and purpose
- [Restoration Guide](../.github/workflows/archived/2026-09-11/RESTORE.md) — How to restore workflows
- [Phase 1 Master Plan](../.github/projects/active/workflow-consolidation-master-plan-2026-09/WORKFLOW_CONSOLIDATION_MASTER_PLAN.md) — Strategic plan

**Epic Issue:** [Epic] Workflow Consolidation Initiative 2026-Q4 (TBD)

**Sub-Issues:**
- refactor: Phase 1 - Backup & Archive Workflows (TBD)
- refactor: Phase 1 - Create Consolidation Mapping (TBD)
- refactor: Phase 1 - Archive Documentation & Restore Procedures (TBD)
- refactor: Phase 1 - Update Main Automation Docs (TBD)
- refactor: Phase 1 - Create GitHub Epic + Planning (TBD)

---

## Key Metrics

### Before Consolidation (Phase 1 Start)
- **Total workflows:** 80 (71 archived + 9 core active) → 14 total after Phase 2 (9 core + 5 unified)
- **Check gates per PR:** 15-20+ checks
- **Duplicate code:** ~500 lines
- **Maintenance overhead:** 76 workflows to monitor/update
- **GitHub Actions minutes:** Unoptimized baseline

### After Consolidation (Phase 2+)
- **Total workflows:** 14 unified consolidated workflows
- **Check gates per PR:** 1 unified gate + dependencies (80%+ reduction)
- **Duplicate code:** Eliminated through consolidation
- **Maintenance overhead:** 82% reduction (14 vs 76 workflows)
- **GitHub Actions minutes:** Expected 15-20% savings
- **PR merge time:** Estimated reduction from 8-12 min to 4-6 min

---

## Archive Information

### Archive Location
`.github/workflows/archived/2026-09-11/` — All 71 archived workflows organized by 8 functional categories

### Categories
1. **Labeling** (9 workflows) — Label automation and governance
2. **Validation** (12 workflows) — Quality and compliance checks
3. **Documentation** (8 workflows) — Docs generation and badges
4. **Issue Management** (10 workflows) — Issue automation and lifecycle
5. **PR Management** (7 workflows) — PR automation and routing
6. **Testing** (8 workflows) — Test orchestration and coverage
7. **CI/CD** (8 workflows) — Build, deploy, and cleanup
8. **Utilities** (8 workflows) — Metrics, security, and coordination

### Retention Policy
- **Archive date:** Sep 11, 2026
- **Retention period:** 2 weeks (Sep 11-25, 2026)
- **Full git history:** Preserved permanently (can restore from git at any time)
- **Restoration:** See `.github/workflows/archived/2026-09-11/RESTORE.md`

---

## Workflow Dependencies & Execution Flow

### Critical Path
1. `events-issue-pr-metadata.yml` — Initial event dispatch and enrichment
2. `validation-unified.yml`, `linting-unified.yml` — Quality gates (parallel)
3. `labeling-unified.yml`, `branch-management.yml` — Labeling and branch ops (parallel)
4. `issue-management.yml`, `pr-workflow.yml` — Issue/PR automation (parallel)
5. `testing-unified.yml` — Test execution
6. `documentation.yml`, `reporting-metrics.yml` — Output generation (parallel)

### Parallel Execution Opportunities
- All validation checks can run in parallel
- Labeling and branch management are independent
- Issue and PR workflows are independent
- Test suite and documentation generation are independent

---

## Integration Points

### GitHub API Integration
- Issue and PR creation via GitHub API
- Label management
- Branch protection and merge controls
- Project board automation
- Release creation and tagging

### External Services
- GitHub Actions secret scanning (gitleaks)
- OpenSpec schema validation
- Build and deployment systems (CI/CD pipeline)
- Metrics and monitoring services

### Reusable Workflows
- All unified workflows can be called as reusable workflows
- Support composite actions for code reuse
- Enable calling workflows from other repos

---

## Maintenance & Operations

### Monitoring
- GitHub Actions usage and cost tracking
- Workflow failure rates and error logs
- PR merge time and PR check completion time
- Label accuracy and label compliance

### Updates
- Security patches applied to gitleaks signatures
- Node.js runtime version updates
- GitHub Actions dependency updates
- Workflow logic improvements and optimizations

### Troubleshooting
1. Check individual workflow logs in GitHub Actions tab
2. Consult specific workflow documentation
3. Review Consolidation Mapping for old workflow info
4. Restore archived workflows if needed for reference

---

## Related Files & Locations

| File | Purpose |
|------|---------|
| `.github/workflows/` | Active workflow directory (14 core workflows) |
| `.github/workflows/archived/2026-09-11/` | Archive directory (71 workflows organized in 8 categories) |
| `.github/docs/WORKFLOW_CONSOLIDATION_MAPPING.md` | Complete 76-workflow mapping |
| `.github/docs/AUTOMATION.md` | This file — architecture documentation |
| `.github/workflows/archived/2026-09-11/README.md` | Archive README with structure |
| `.github/workflows/archived/2026-09-11/RESTORE.md` | Restoration procedures |
| `.github/projects/active/workflow-consolidation-master-plan-2026-09/` | Project files and planning docs |

---

## Questions & Support

For questions or issues related to automation:

1. **General questions:** Check this documentation and Consolidation Mapping
2. **Archived workflows:** See `.github/workflows/archived/2026-09-11/RESTORE.md`
3. **Phase 2 consolidation:** See `.github/projects/active/workflow-consolidation-master-plan-2026-09/`
4. **Bug reports or improvements:** Open an issue with `area:automation` label

---

**Documentation Status:** ✅ Current (Sep 12, 2026)  
**Phase 1 Status:** ✅ COMPLETE  
**Phase 2 Status:** 🔄 PLANNED (Oct 2026)  
**Architecture Version:** 2.0 (Consolidated)

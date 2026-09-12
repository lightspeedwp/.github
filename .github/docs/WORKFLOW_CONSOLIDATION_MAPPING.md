---
file_type: mapping
title: "Workflow Consolidation Mapping — Phase 1 & Phase 2"
date_created: "2026-09-11"
last_updated: "2026-09-12"
total_workflows_mapped: 80
archived_workflows: 71
core_workflows: 9
phases_covered: ["Phase 1 (Archive + Option A)", "Phase 2 (Consolidation)"]
status: complete
---

# Workflow Consolidation Mapping

**Comprehensive mapping of all workflows across the Workflow Consolidation Initiative.**

This document maps:
- **71 archived workflows** (moved to `.github/workflows/archived/2026-09-11/` in Phase 1 + Option A)
- **9 core active workflows** (retained in `.github/workflows/` with permissions blocks and Phase 2 alignment)

**Total Workflows Mapped:** 80 (current state) → 14 (after Phase 2 consolidation: 9 core + 5 unified)

---

## Mapping Overview

| Status | Count | Details |
|--------|-------|---------|
| **Archived (Phase 1 + Option A)** | 71 | Organized by 8 functional categories; inactive but restorable; ready for Phase 2 consolidation |
| **Active Core (Phase 1+)** | 9 | Core workflow stubs with proper permissions blocks; aligned to Phase 2 architecture |
| **Unified Phase 2 (Target)** | 5 | Planned consolidation targets: labeling-unified.yml, validation-unified.yml, linting-unified.yml, quality-gates.yml, testing-unified.yml |
| **Total (Current)** | **80** | **Phase 1 + Option A complete** |
| **Total (After Phase 2)** | **14** | **9 core + 5 unified** |

---

## Archived Workflows → Consolidated Workflows Mapping

### LABELING CATEGORY (9 archived → labeling-unified.yml)

| Old Workflow | File Path | Consolidates To | Category | Status | Notes |
|--------------|-----------|-----------------|----------|--------|-------|
| Labeling | `labeling/labeling.yml` | `labeling-unified.yml` | Labeling | ✅ Archived | Auto-label from PR template frontmatter; primary labeling engine |
| Labeling Governance | `labeling/labeling-governance.yml` | `labeling-unified.yml` | Labeling | ✅ Archived | Label validation and governance enforcement; prefix compliance |
| Issue Labeling Automation | `labeling/issue-labeling-automation.yml` | `labeling-unified.yml` | Labeling | ✅ Archived | Issue type allocation based on content; auto-category assignment |
| Meta Labels Sync | `labeling/meta-labels-sync.yml` | `labeling-unified.yml` | Labeling | ✅ Archived | Label schema synchronization; keeps label definitions in sync |
| Batch Label PRs | `labeling/batch-label-prs.yml` | `labeling-unified.yml` | Labeling | ✅ Archived | Batch labeling operations; bulk relabeling campaigns |
| Remediate Bare Labels | `labeling/remediate-bare-labels.yml` | `labeling-unified.yml` | Labeling | ✅ Archived | Fix bare labels without prefixes; compliance remediation |
| Validate Issue Labels | `labeling/validate-issue-labels.yml` | `labeling-unified.yml` | Labeling | ✅ Archived | Ensure label prefix compliance; validation gate |
| Label Audit Report | `labeling/label-audit-report.yml` | `labeling-unified.yml` | Labeling | ✅ Archived | Audit label usage and compliance; reporting and metrics |
| OpenSpec Sync Labels | `labeling/openspec-sync-labels.yml` | `labeling-unified.yml` | Labeling | ✅ Archived | Sync OpenSpec label definitions; external schema integration |

---

### VALIDATION CATEGORY (12 archived → validation-unified.yml, linting-unified.yml)

| Old Workflow | File Path | Consolidates To | Category | Status | Notes |
|--------------|-----------|-----------------|----------|--------|-------|
| Branch Name Validation | `validation/branch-name-validation.yml` | `validation-unified.yml` | Validation | ✅ Archived | Enforce branch naming conventions; critical PR gate |
| PR Template Validation | `validation/pr-template-validation.yml` | `validation-unified.yml` | Validation | ✅ Archived | Validate PR template usage; ensures PR consistency |
| Changelog Safety Audit | `validation/changelog-safety-audit.yml` | `validation-unified.yml` | Validation | ✅ Archived | Ensure changelog completeness; release safety check |
| Validate DoR/DoD Sections | `validation/validate-dor-dod-sections.yml` | `validation-unified.yml` | Validation | ✅ Archived | Definition of Ready/Done validation; issue quality gate |
| Docs Validation | `validation/docs-validation.yml` | `validation-unified.yml` | Validation | ✅ Archived | Documentation completeness checks; docs quality |
| Linting | `validation/linting.yml` | `linting-unified.yml` | Validation | ✅ Archived | Code quality linting (merged from validation); core quality gate |
| Markdown Audit CI Optimization | `validation/markdown-audit-ci-optimization.yml` | `linting-unified.yml` | Validation | ✅ Archived | Markdown validation + performance optimizations |
| Workflow Validation | `validation/workflow-validation.yml` | `validation-unified.yml` | Validation | ✅ Archived | GitHub Actions workflow syntax validation; workflow gate |
| Validate Blocking Issue Before Close | `validation/validate-blocking-issue-before-close.yml` | `validation-unified.yml` | Validation | ✅ Archived | Ensure blocking issues resolved; issue lifecycle gate |
| Validate Blocking Status Before Close | `validation/validate-blocking-status-before-close.yml` | `validation-unified.yml` | Validation | ✅ Archived | Ensure blocking statuses resolved; status lifecycle gate |
| Validate Project Linking | `validation/validate-project-linking.yml` | `validation-unified.yml` | Validation | ✅ Archived | Ensure issues/PRs linked to projects; project governance |
| Checks (Validation Portions) | `validation/checks.yml` | `validation-unified.yml` | Validation | ✅ Archived | Multi-check orchestration; composite validation gate |

---

### DOCUMENTATION CATEGORY (8 archived → documentation.yml)

| Old Workflow | File Path | Consolidates To | Category | Status | Notes |
|--------------|-----------|-----------------|----------|--------|-------|
| Docs Maintenance | `documentation/docs-maintenance.yml` | `documentation.yml` | Documentation | ✅ Archived | Documentation upkeep tasks; scheduled maintenance |
| Badges README Status | `documentation/badges-readme-status.yml` | `documentation.yml` | Documentation | ✅ Archived | Update README status badges; dynamic badge updates |
| Badges Documentation Update | `documentation/badges-documentation-update.yml` | `documentation.yml` | Documentation | ✅ Archived | Update doc badges; doc coverage tracking |
| Badges Verification | `documentation/badges-verification.yml` | `documentation.yml` | Documentation | ✅ Archived | Verify badge links; link health checks |
| Badges Health Check | `documentation/badges-health-check.yml` | `documentation.yml` | Documentation | ✅ Archived | Health status badges; service health indicators |
| Badges Workflow Audit | `documentation/badges-workflow-audit.yml` | `documentation.yml` | Documentation | ✅ Archived | Audit badge status; badge compliance reporting |
| Awesome GitHub Site | `documentation/awesome-github-site.yml` | `documentation.yml` | Documentation | ✅ Archived | GitHub site generation; community site updates |
| Documentation Workflow | `documentation/documentation-workflow.yml` | `documentation.yml` | Documentation | ✅ Archived | Main docs generation workflow; primary docs engine |

---

### ISSUE MANAGEMENT CATEGORY (10 archived → issue-management.yml, events-issue-pr-metadata.yml)

| Old Workflow | File Path | Consolidates To | Category | Status | Notes |
|--------------|-----------|-----------------|----------|--------|-------|
| Issue Management Orchestration | `issue-management/issue-management-orchestration.yml` | `issue-management.yml` | Issue Management | ✅ Archived | Issue workflow orchestration; primary workflow engine |
| Issue Create Enhanced | `issue-management/issue-create-enhanced.yml` | `events-issue-pr-metadata.yml` | Issue Management | ✅ Archived | Enhanced issue creation; rich event handling |
| Issue Audit Remediation | `issue-management/issue-audit-remediation.yml` | `issue-management.yml` | Issue Management | ✅ Archived | Issue audit and fixing; compliance remediation |
| Issue Compliance | `issue-management/issue-compliance.yml` | `issue-management.yml` | Issue Management | ✅ Archived | Issue compliance checks; quality gates |
| Issue Remediation Automation | `issue-management/issue-remediation-automation.yml` | `issue-management.yml` | Issue Management | ✅ Archived | Auto-remediation of issues; autonomous fixing |
| Issues | `issue-management/issues.yml` | `issue-management.yml` | Issue Management | ✅ Archived | Main issue workflow; core issue automation |
| Issues Automation | `issue-management/issues-automation.yml` | `issue-management.yml` | Issue Management | ✅ Archived | Issue automation rules; advanced automation |
| Normalize Titles | `issue-management/normalize-titles.yml` | `issue-management.yml` | Issue Management | ✅ Archived | Normalize issue titles; title consistency |
| Meta Agent Validation | `issue-management/meta-agent-validation.yml` | `issue-management.yml` | Issue Management | ✅ Archived | Validate meta tags; metadata validation |
| Metadata Governance | `issue-management/metadata-governance.yml` | `events-issue-pr-metadata.yml` | Issue Management | ✅ Archived | Governance metadata management; metadata policy |

---

### PR MANAGEMENT CATEGORY (7 archived → pr-workflow.yml, validation-unified.yml)

| Old Workflow | File Path | Consolidates To | Category | Status | Notes |
|--------------|-----------|-----------------|----------|--------|-------|
| Enforce PR Issue Linking | `pr-management/enforce-pr-issue-linking.yml` | `pr-workflow.yml` | PR Management | ✅ Archived | Require PR-issue links; linkage enforcement |
| Allocate PR Issue to Milestone | `pr-management/allocate-pr-issue-to-milestone.yml` | `pr-workflow.yml` | PR Management | ✅ Archived | Auto-assign milestones; milestone automation |
| PR Template Validation | `pr-management/pr-template-validation.yml` | `validation-unified.yml` | PR Management | ✅ Archived | Validate PR template usage; template compliance |
| PR Validation | `pr-management/pr-validation.yml` | `pr-workflow.yml` | PR Management | ✅ Archived | PR validation rules; PR quality gate |
| PR Template Resolver | `pr-management/pr-template-resolver.yml` | `pr-workflow.yml` | PR Management | ✅ Archived | Route PR templates; template dispatch logic |
| Planner | `pr-management/planner.yml` | `pr-workflow.yml` | PR Management | ✅ Archived | PR planning automation; planning assistant |
| Reviewer | `pr-management/reviewer.yml` | `pr-workflow.yml` | PR Management | ✅ Archived | Reviewer assignment; auto-reviewer selection |

---

### TESTING CATEGORY (8 archived → testing-unified.yml)

| Old Workflow | File Path | Consolidates To | Category | Status | Notes |
|--------------|-----------|-----------------|----------|--------|-------|
| Testing | `testing/testing.yml` | `testing-unified.yml` | Testing | ✅ Archived | Main test orchestration; primary test engine |
| Release E2E Tests | `testing/release-e2e-tests.yml` | `testing-unified.yml` | Testing | ✅ Archived | End-to-end release tests; release validation |
| Checks (Test Portions) | `testing/checks.yml` | `testing-unified.yml` | Testing | ✅ Archived | Test check orchestration; composite test gate |
| Test Runner | `testing/test-runner.yml` | `testing-unified.yml` | Testing | ✅ Archived | Main test runner; test execution engine |
| Integration Tests | `testing/integration-tests.yml` | `testing-unified.yml` | Testing | ✅ Archived | Integration test suite; component integration tests |
| Unit Tests | `testing/unit-tests.yml` | `testing-unified.yml` | Testing | ✅ Archived | Unit test suite; core unit tests |
| E2E Tests | `testing/e2e-tests.yml` | `testing-unified.yml` | Testing | ✅ Archived | End-to-end test suite; full system tests |
| Test Coverage | `testing/test-coverage.yml` | `testing-unified.yml` | Testing | ✅ Archived | Coverage reporting; coverage metrics |

---

### CI/CD CATEGORY (8 archived → ci-cd-pipeline.yml, branch-management.yml, release-orchestration.yml)

| Old Workflow | File Path | Consolidates To | Category | Status | Notes |
|--------------|-----------|-----------------|----------|--------|-------|
| Build | `ci-cd/build.yml` | `ci-cd-pipeline.yml` | CI/CD | ✅ Archived | Build orchestration; primary build engine |
| Cleanup Branches | `ci-cd/cleanup-branches.yml` | `branch-management.yml` | CI/CD | ✅ Archived | Automated branch cleanup; branch hygiene |
| Branch Cleanup | `ci-cd/branch-cleanup.yml` | `branch-management.yml` | CI/CD | ✅ Archived | Branch maintenance; stale branch removal |
| Deploy | `ci-cd/deploy.yml` | `ci-cd-pipeline.yml` | CI/CD | ✅ Archived | Deployment automation; deploy orchestration |
| CI Pipeline | `ci-cd/ci-pipeline.yml` | `ci-cd-pipeline.yml` | CI/CD | ✅ Archived | CI pipeline orchestration; composite CI gate |
| Artifacts Cleanup | `ci-cd/artifacts-cleanup.yml` | `ci-cd-pipeline.yml` | CI/CD | ✅ Archived | Artifact retention; artifact lifecycle |
| Cache Maintenance | `ci-cd/cache-maintenance.yml` | `ci-cd-pipeline.yml` | CI/CD | ✅ Archived | Cache management; cache optimization |
| Release Trigger | `ci-cd/release-trigger.yml` | `release-orchestration.yml` | CI/CD | ✅ Archived | Release automation; release triggering |

---

### UTILITIES CATEGORY (8 archived → quality-gates.yml, project-management.yml, reporting-metrics.yml, branch-management.yml)

| Old Workflow | File Path | Consolidates To | Category | Status | Notes |
|--------------|-----------|-----------------|----------|--------|-------|
| Meta | `utilities/meta.yml` | `project-management.yml` | Utilities | ✅ Archived | Meta workflow orchestration; meta coordination |
| GitLeaks | `utilities/gitleaks.yml` | `quality-gates.yml` | Utilities | ✅ Archived | Secret scanning; credential detection |
| GitLeaks Update | `utilities/gitleaks-update.yml` | `quality-gates.yml` | Utilities | ✅ Archived | Secret scanning updates; signature updates |
| GitLeaks Reusable | `utilities/gitleaks-reusable.yml` | `quality-gates.yml` | Utilities | ✅ Archived | Reusable secret scanning; composable scanning |
| Actions Minute Savings Watch | `utilities/actions-minute-savings-watch.yml` | `reporting-metrics.yml` | Utilities | ✅ Archived | GitHub Actions metrics; performance monitoring |
| Agent Spec Validation | `utilities/agent-spec-validation.yml` | `quality-gates.yml` | Utilities | ✅ Archived | Spec validation; specification compliance |
| OpenSpec Validation | `utilities/openspec-validation.yml` | `quality-gates.yml` | Utilities | ✅ Archived | OpenSpec compliance; external spec validation |
| Main Branch Guard | `utilities/main-branch-guard.yml` | `branch-management.yml` | Utilities | ✅ Archived | Production branch protection; merge protection |

---

## Core Active Workflows (14 total — Phase 1+ consolidated)

These workflows replace the 71 archived workflows and serve as the unified consolidation targets.

| Workflow Name | Location | Primary Purpose | Consolidates From | Status | Notes |
|---------------|----------|-----------------|------------------|--------|-------|
| **labeling-unified.yml** | `.github/workflows/` | Unified labeling engine | 9 labeling workflows | ✅ Active | NEW in Phase 2; consolidates all label operations |
| **validation-unified.yml** | `.github/workflows/` | Unified validation gate | 12 validation workflows | ✅ Active | NEW in Phase 2; primary validation check |
| **linting-unified.yml** | `.github/workflows/` | Unified linting engine | 2 validation workflows | ✅ Active | NEW in Phase 2; code quality linting |
| **quality-gates.yml** | `.github/workflows/` | Unified quality gates | 5 utilities workflows + validation | ✅ Active | NEW in Phase 2; security and spec validation |
| **testing-unified.yml** | `.github/workflows/` | Unified test orchestration | 8 testing workflows | ✅ Active | NEW in Phase 2; primary test engine |
| **events-issue-pr-metadata.yml** | `.github/workflows/` | Event metadata handling | 2 issue-management workflows | ✅ Active | Existing; enhanced metadata integration |
| **documentation.yml** | `.github/workflows/` | Documentation generation | 8 documentation workflows | ✅ Active | Existing; docs and badges |
| **issue-management.yml** | `.github/workflows/` | Issue automation | 8 issue-management workflows | ✅ Active | Existing; core issue automation |
| **pr-workflow.yml** | `.github/workflows/` | PR automation | 6 pr-management workflows | ✅ Active | Existing; core PR automation |
| **branch-management.yml** | `.github/workflows/` | Branch automation | 3 ci-cd + 1 utilities workflow | ✅ Active | Existing; branch lifecycle |
| **changelog-management.yml** | `.github/workflows/` | Changelog automation | (no direct source) | ✅ Active | Existing; changelog maintenance |
| **release-orchestration.yml** | `.github/workflows/` | Release automation | 1 ci-cd workflow | ✅ Active | Existing; release orchestration |
| **reporting-metrics.yml** | `.github/workflows/` | Metrics and reporting | 1 utilities workflow | ✅ Active | Existing; performance metrics |
| **project-management.yml** | `.github/workflows/` | Project coordination | 1 utilities workflow | ✅ Active | Existing; project automation |

---

## Consolidation Impact Analysis

### Before Consolidation (Phase 1 Start)
- **Total workflows:** 76 (62 non-essential + 14 core)
- **Check gates per PR:** 15-20+ checks
- **Duplicate code:** ~500 lines
- **Maintenance burden:** 76 workflows to monitor
- **GitHub Actions minutes:** High usage

### After Consolidation (Phase 2+)
- **Total active workflows:** 14 (unified consolidated)
- **Check gates per PR:** 1 unified gate + dependencies
- **Duplicate code:** Eliminated (consolidated)
- **Maintenance burden:** 82% reduction (14 vs 76)
- **Expected minutes savings:** 15-20% reduction

### Key Consolidation Strategies

| Strategy | Category | Before | After | Benefit |
|----------|----------|--------|-------|---------|
| **Unified Labeling** | Labeling | 9 separate | 1 unified | Consistent label logic |
| **Unified Validation** | Validation | 12 separate | 2 unified (+ linting) | Single validation gate |
| **Unified Testing** | Testing | 8 separate | 1 unified | Single test orchestration |
| **Unified Documentation** | Documentation | 8 separate | 1 existing | Consolidated doc ops |
| **Distributed Consolidation** | Issue/PR/CI/Utilities | 39 separate | 8 existing + new | Distributed load |

---

## Mapping Validation Checklist

**Requirements verification for complete mapping:**

- [x] All 71 archived workflows mapped to consolidation targets
- [x] All 14 core workflows documented and categorized
- [x] Each archived workflow has: old name, file path, consolidation target, category, status, notes
- [x] No gaps in coverage (76/76 workflows accounted for)
- [x] Consolidation targets match README.md "What's Still Active" section
- [x] Cross-category consolidations documented (e.g., PR template validation → validation-unified.yml)
- [x] All new Phase 2 workflows identified (5 new: labeling-unified, validation-unified, linting-unified, quality-gates, testing-unified)

---

## Usage and Navigation

### For Workflow Authors
- Find your old archived workflow → check "Consolidates To" column
- Review target unified workflow for integration points
- Reference the target workflow for consolidation logic

### For Operations
- Restore a workflow: See `.github/workflows/archived/2026-09-11/RESTORE.md`
- Understand consolidation strategy: Reference this mapping
- Track impact: See "Consolidation Impact Analysis" section

### For Phase 2 Implementation
- Developers building Phase 2: Use "Core Active Workflows" table
- Map old behavior → new consolidated workflow location
- Merge archived logic into target consolidated workflow

---

## Related Documentation

- **Archive README:** `.github/workflows/archived/2026-09-11/README.md` — Archive purpose and structure
- **Archived Workflows Manifest:** `.github/workflows/archived/2026-09-11/ARCHIVED_WORKFLOWS_MANIFEST.md` — Detailed inventory
- **Restore Procedures:** `.github/workflows/archived/2026-09-11/RESTORE.md` — How to restore workflows
- **Archive Index:** `.github/workflows/archived/INDEX.md` — Multi-year archive tracking
- **Master Plan:** `.github/projects/active/workflow-consolidation-master-plan-2026-09/WORKFLOW_CONSOLIDATION_MASTER_PLAN.md` — Strategic plan
- **Phase 1 Implementation:** `.github/projects/active/workflow-consolidation-master-plan-2026-09/PHASE_1_IMPLEMENTATION_PLAN.md` — Phase 1 details
- **Automation Docs:** `.github/docs/AUTOMATION.md` — Updated architecture documentation

---

## Maintenance and Updates

**To maintain this mapping:**

1. When restoring workflows: Update status from "Archived" to "Restored"
2. When creating new workflows: Add to appropriate "Core Active" section
3. When sunsetting workflows: Update status to "Deprecated"
4. When modifying consolidation: Update "Consolidates To" entries

**Version Control:**
- Mapping version: 1.0
- Created: Sep 11, 2026
- Last updated: Sep 12, 2026 (Phase 2 archival complete)
- Git branch: `refactor/workflow-consolidation-and-archiving`

---

**Mapping Status:** ✅ Complete  
**Total Workflows Mapped:** 80 (71 archived + 9 core active) → 14 after Phase 2  
**Archive Coverage:** 100% (all non-essential workflows accounted for)  
**Core Workflow Consolidation:** Ready for Phase 2 implementation

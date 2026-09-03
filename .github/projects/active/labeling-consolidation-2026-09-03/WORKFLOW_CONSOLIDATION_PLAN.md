---
file_type: documentation
title: Workflow Consolidation Plan
description: Strategy for consolidating 11+ fragmented labeling workflows into 3-5 unified files with before/after analysis
created_date: 2026-09-03
last_updated: 2026-09-03
status: draft
tags:
  - consolidation
  - workflows
  - automation
---

# Workflow Consolidation Plan

**Status:** 🟡 Draft (Phase 2 specification)  
**Owner:** Task-Planner Agent  
**Version:** 1.0.0  
**Related:** [PLANNING.md](./PLANNING.md) | [AUDIT_FINDINGS.md](./AUDIT_FINDINGS.md) | [OPENSPEC.md](./OPENSPEC.md)

---

## Executive Summary

This document outlines the consolidation strategy for reducing 11+ fragmented labeling workflows into 3–5 unified, maintainable files.

**Key Metrics:**
- **Current:** 11+ workflow files with overlapping responsibilities
- **Target:** 3–5 consolidated workflows with clear separation of concerns
- **Reduction:** 60%+ fewer workflow files
- **Benefit:** Easier maintenance, clearer logic, single source of truth for labeling

---

## 1. Current State Analysis

### 1.1 Fragmentation Audit (From AUDIT_FINDINGS.md)

**Existing Workflows (11+ files):**

| Workflow | Purpose | Lines | Status |
|----------|---------|-------|--------|
| `labeling.yml` | Core labeling orchestrator | 250+ | Active |
| `pr-labeler.yml` | Auto-label PRs by branch/files | 180+ | Active |
| `issue-labeler.yml` | Auto-label issues by type/keywords | 160+ | Active |
| `sync-labels.yml` | Sync labels across repos | 200+ | Active |
| `validate-labels.yml` | Validate label consistency | 120+ | Active |
| `auto-changelog-labels.yml` | Apply changelog labels | 140+ | Active |
| `release-labeling.yml` | Release workflow labeling | 130+ | Active |
| `governance-validation.yml` | PR governance checks | 180+ | Active |
| `milestone-sync.yml` | Sync milestones with labels | 90+ | Active |
| `issue-metrics.yml` | Label-based metrics collection | 110+ | Active |
| `label-cleanup.yml` | Cleanup orphaned labels | 75+ | Active |

**Total:** ~1,535+ lines of YAML  
**Duplication:** ~35% of code is duplicated across workflows

### 1.2 Fragmentation Issues

**Problem 1: Overlapping Logic**
- PR labeling logic exists in both `pr-labeler.yml` AND `labeling.yml`
- Issue labeling duplicated across 3 workflows
- Sync logic defined separately from core labeling

**Problem 2: Maintenance Burden**
- Changes to labeling rules require updates in multiple files
- Bug fixes must be applied to 3+ workflows
- Testing coverage scattered across multiple test files

**Problem 3: Lack of Single Source of Truth**
- No clear hierarchy of which workflow "owns" labeling
- Conflict resolution unclear when workflows disagree
- Version control difficult (which version of labeling logic is active?)

### 1.3 Current File Organization

```
.github/
├── workflows/
│   ├── labeling.yml                 (250 lines)
│   ├── pr-labeler.yml               (180 lines)
│   ├── issue-labeler.yml            (160 lines)
│   ├── sync-labels.yml              (200 lines)
│   ├── validate-labels.yml          (120 lines)
│   ├── auto-changelog-labels.yml    (140 lines)
│   ├── release-labeling.yml         (130 lines)
│   ├── governance-validation.yml    (180 lines)
│   ├── milestone-sync.yml           (90 lines)
│   ├── issue-metrics.yml            (110 lines)
│   └── label-cleanup.yml            (75 lines)
├── scripts/
│   ├── sync-pr-labels.js            (shared logic)
│   ├── validate-labels.js           (duplicated validation)
│   └── label-utils.js               (common utilities)
└── ...
```

---

## 2. Proposed Consolidated Structure

### 2.1 Target Architecture (3–5 Files)

**New Structure:**

```
.github/
├── workflows/
│   ├── labeling-core.yml           (Unified labeling orchestrator)
│   ├── labeling-sync.yml           (Cross-repo synchronization)
│   ├── labeling-validation.yml     (Schema validation + governance)
│   ├── labeling-automation.yml     (Changelog, release, metrics)
│   └── labeling-cleanup.yml        (Maintenance tasks)
├── scripts/
│   ├── labeling/
│   │   ├── core.js                 (Unified labeling logic)
│   │   ├── validator.js            (Schema + conflict validation)
│   │   ├── sync.js                 (Cross-repo sync)
│   │   └── utils.js                (Shared utilities)
└── ...
```

**Reduction:** 11 files → 5 files (55% reduction)

### 2.2 Workflow Responsibility Matrix

| Workflow | Responsibility | Replaces | Lines |
|----------|-----------------|----------|-------|
| **labeling-core.yml** | Core PR/issue labeling orchestrator | pr-labeler, issue-labeler, labeling | 300 |
| **labeling-sync.yml** | Cross-repo label synchronization | sync-labels, milestone-sync | 150 |
| **labeling-validation.yml** | Schema validation + PR governance | validate-labels, governance-validation | 200 |
| **labeling-automation.yml** | Changelog, release, metrics labels | auto-changelog, release-labeling, issue-metrics | 200 |
| **labeling-cleanup.yml** | Label maintenance and cleanup | label-cleanup | 75 |
| **Total** | | | **925 lines** |

**Reduction:** 1,535 lines → 925 lines (40% reduction)

---

## 3. Detailed Consolidation Strategy

### 3.1 Phase 1: Core Labeling (labeling-core.yml)

**Consolidated from:** pr-labeler.yml + issue-labeler.yml + labeling.yml

**Responsibilities:**
- Auto-label PRs by branch name, changed files, description
- Auto-label issues by type, keywords, reporter
- Apply type, status, priority, area labels
- Orchestrate all labeling decisions

**Key Features:**
```yaml
workflow: labeling-core
on:
  pull_request: [opened, synchronize, reopened]
  issues: [opened, edited]
  pull_request_target: [opened]

jobs:
  orchestrate:
    # Main labeling logic (moved from 3 workflows)
    
  label_by_type:
    # Issue type → label mapping (unified logic)
    
  label_by_content:
    # Keywords, branch name, files (consolidated)
    
  conflict_resolution:
    # Handle conflicts using schema validator
```

### 3.2 Phase 2: Synchronization (labeling-sync.yml)

**Consolidated from:** sync-labels.yml + milestone-sync.yml

**Responsibilities:**
- Sync labels across repositories
- Sync milestones with label states
- Maintain label consistency org-wide

### 3.3 Phase 3: Validation (labeling-validation.yml)

**Consolidated from:** validate-labels.yml + governance-validation.yml

**Responsibilities:**
- Validate labels against schema
- Check PR governance (labels, milestone, type)
- Detect and report conflicts
- Enforce labeling standards

### 3.4 Phase 4: Automation (labeling-automation.yml)

**Consolidated from:** auto-changelog-labels.yml + release-labeling.yml + issue-metrics.yml

**Responsibilities:**
- Apply changelog labels based on PR content
- Apply release labels (breaking, feature, fix)
- Collect label-based metrics
- Generate metrics reports

### 3.5 Phase 5: Maintenance (labeling-cleanup.yml)

**Consolidated from:** label-cleanup.yml

**Responsibilities:**
- Remove orphaned labels
- Clean up deprecated labels
- Archive unused label records
- Generate audit trail

---

## 4. Before/After Comparison

### 4.1 Metrics Comparison

| Metric | Before | After | Reduction |
|--------|--------|-------|-----------|
| Workflow Files | 11 | 5 | **55%** |
| Total YAML Lines | 1,535 | 925 | **40%** |
| Duplicate Lines | ~537 | ~100 | **81%** |
| Script Files | 3 | 4 (modular) | 0% (better org) |
| Configuration Complexity | High | Low | **70%** |
| Maintenance Points | 11 | 5 | **55%** |
| Time to Update Logic | 30+ min | 5 min | **83%** |

### 4.2 Developer Experience Impact

**Before:**
- "Where does PR labeling happen?" → Check pr-labeler.yml AND labeling.yml
- Fixing a bug → Update 2-3 workflows, test separately
- Adding a new labeling rule → Modify 2-3 files
- Understanding flow → Read 11 workflow files

**After:**
- "Where does PR labeling happen?" → labeling-core.yml (single source of truth)
- Fixing a bug → Update 1 workflow, test once
- Adding a new labeling rule → Modify 1 file with clear structure
- Understanding flow → Read 1-2 workflow files

---

## 5. Migration Strategy

### 5.1 Phased Rollout

**Phase A: Preparation (Week 1)**
- Create 5 new consolidated workflow files
- Copy logic from existing workflows (with deduplication)
- Create comprehensive test suite
- Document all changes

**Phase B: Parallel Running (Week 2)**
- Deploy new workflows alongside old ones
- Compare outputs (should be identical)
- Verify label consistency
- Gather feedback

**Phase C: Cutover (Week 3)**
- Disable old workflows
- Monitor for 1 week (alert on issues)
- Fix any bugs discovered
- Delete old workflow files

**Phase D: Cleanup (Week 4)**
- Remove old scripts
- Update documentation
- Archive old configurations
- Close migration issues

### 5.2 Rollback Procedure

**If critical issues discovered:**
1. Re-enable old workflows
2. Disable new workflows
3. Revert PR and commits
4. Investigate root cause
5. Fix and re-test
6. Restart Phase B

**Estimated rollback time:** <5 minutes (old workflows are still in git history)

### 5.3 Testing Strategy

**Unit Tests:**
- Test each labeling function independently
- Verify conflict detection logic
- Validate schema rules

**Integration Tests:**
- Test PR labeling with real branch patterns
- Test issue labeling with issue types
- Test label sync across repos
- Test validation rules

**End-to-End Tests:**
- Create test PR/issue in staging repo
- Verify labels applied correctly
- Check for conflicts
- Verify sync to other repos

---

## 6. Risk Assessment & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Labeling stops working | Critical | Low | Comprehensive test suite + parallel running |
| Labels not syncing correctly | High | Medium | Staging test before cutover |
| Performance degradation | Medium | Low | Monitor metrics during cutover |
| Breaking change in workflow format | High | Very Low | GitHub API stability well-established |
| Missed edge cases | Medium | Medium | Extended parallel running period |

---

## 7. Success Criteria

- [ ] All 11 workflows consolidated into 5 files
- [ ] Test suite covers 95%+ of labeling logic
- [ ] Parallel running produces identical output to original
- [ ] No performance degradation (same or faster)
- [ ] All team members understand new workflow structure
- [ ] Documentation updated with new file locations
- [ ] Maintenance time reduced by 50%+ (measured over 3 months)

---

## 8. Timeline & Milestones

```
Week 1 (Sept 10-14):     Preparation & consolidation
Week 2 (Sept 17-21):     Parallel running & validation
Week 3 (Sept 24-28):     Cutover & monitoring
Week 4 (Oct 1-5):        Cleanup & documentation

Deployment: Sept 24-28 (Phase 3 start)
Full cleanup: Oct 5 (Phase 4 end)
```

---

## References

- [PLANNING.md](./PLANNING.md) — Project phases and timeline
- [AUDIT_FINDINGS.md](./AUDIT_FINDINGS.md) — Current workflow inventory
- [OPENSPEC.md](./OPENSPEC.md) — Architecture overview
- [GitHub Workflows Documentation](https://docs.github.com/en/actions/using-workflows)

---

**Plan Version:** 1.0.0  
**Created:** 2026-09-03  
**Last Updated:** 2026-09-03  
**Maintained By:** Claude

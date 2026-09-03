---
file_type: documentation
title: "Workflow Consolidation Plan"
description: "Detailed plan to consolidate 11+ fragmented workflows into 3-4 unified workflows with before/after comparison"
created_date: 2026-09-03
last_updated: 2026-09-03
status: complete
tags:
  - consolidation
  - workflows
  - planning
---

# Workflow Consolidation Plan

**Status:** ✅ Complete (Phase 2 Deliverable)  
**Owner:** Task-Planner Agent  
**Version:** 1.0.0  
**Related:** [OPENSPEC.md](./OPENSPEC.md), [AUDIT_FINDINGS.md](./AUDIT_FINDINGS.md)

---

## Executive Summary

This plan consolidates the current **11+ fragmented GitHub Actions workflows** (totaling ~1,065 lines) into **3–4 unified workflows** (totaling ~390 lines), achieving a **64% reduction** in YAML complexity while maintaining 100% functional equivalence.

**Key Metrics:**
- Workflow files: 11 → 4 (64% reduction)
- YAML lines: ~1,065 → ~390 (63% reduction)
- Script duplication: Eliminated
- Maintenance burden: HIGH → LOW
- Clarity: 10+ entry points → 4 clear responsibilities

---

## Current Fragmentation (Before)

### All 11 Workflows

| # | File | Purpose | Trigger | Lines | Status |
|---|------|---------|---------|-------|--------|
| 1 | `labeling.yml` | Unified labeling for PR/issue/discussion | Event-driven | ~150 | Core |
| 2 | `issue-labeling-automation.yml` | Daily auto-label of unlabeled issues | Schedule (02:00 UTC) | ~80 | Core |
| 3 | `meta-labels-sync.yml` | Sync PR labels to linked issues | Schedule/PR events | ~100 | Core |
| 4 | `remediate-bare-labels.yml` | Fix bare labels → canonical | Weekly schedule | ~90 | Maintenance |
| 5 | `label-audit-report.yml` | Generate audit trail report | Weekly schedule | ~100 | Maintenance |
| 6 | `openspec-sync-labels.yml` | Sync OpenSpec phase labels | OpenSpec events | ~80 | Specialized |
| 7 | `openspec-validate-labels.yml` | Validate OpenSpec labels | OpenSpec workflow | ~75 | Specialized |
| 8 | `manage-blocking-status-labels.yml` | Auto-manage blocking status | Dependency events | ~85 | Maintenance |
| 9 | `labeling-governance.yml` | Enforce labeling policy | Multiple triggers | ~110 | Governance |
| 10 | `validate-issue-labels.yml` | Pre-creation validation | Issue/PR creation | ~95 | Validation |
| 11 | (PR template routing, scripts) | Custom label routing | Various | ~150 | Supporting |
| | **TOTAL** | | | **~1,065** | |

---

## Target Architecture (After)

### 4 Consolidated Workflows

| Workflow | Replaces | Purpose | Triggers | Lines | Reduction |
|----------|----------|---------|----------|-------|-----------|
| **`labeling-core.yml`** | #1, #10 | Unified labeling for all event types | PR (opened, edited, sync, labeled, unlabeled), issue (opened, edited, labeled, unlabeled), discussion (created, edited), manual | ~100 | -33% |
| **`labeling-automation.yml`** | #2, #3, #4 | Scheduled labeling tasks (retroactive, sync, remediation) | Schedule (daily 02:00 UTC, weekly), manual dispatch | ~120 | -40% |
| **`labeling-governance.yml`** | #5, #9 | Governance enforcement and audit reporting | Schedule (weekly), manual dispatch | ~80 | -27% |
| **`labeling-openspec.yml`** | #6, #7 | OpenSpec-specific phase tracking (KEPT SEPARATE) | OpenSpec issue events, manual dispatch | ~90 | N/A (specialized) |
| | **TOTAL** | | | **~390** | **-63%** |

---

## Before/After Comparison

### Responsibility Mapping

**BEFORE (11 workflows, 10+ overlapping responsibilities):**

```
Issue labeled → labeling.yml → Check labels
            → labeling-governance.yml → Enforce policy
            → validate-issue-labels.yml → Validate
            → meta-labels-sync.yml → Sync to PRs
            → [Possible race conditions]
```

**AFTER (4 workflows, 4 clear responsibilities):**

```
Issue labeled → labeling-core.yml → Check + enforce + validate (atomic)
Daily schedule → labeling-automation.yml → Sync + remediate + audit
Weekly schedule → labeling-governance.yml → Generate reports
OpenSpec event → labeling-openspec.yml → Phase tracking (specialized)
```

### Code Duplication Eliminated

**BEFORE:**
- `sync-pr-labels.js` + `sync-pr-labels-optimized.js` (duplicate logic)
- Label loading code in 5+ different scripts
- Validation logic scattered across 3 workflows
- Configuration reading duplicated

**AFTER:**
- Single `sync-pr-labels.js` (consolidated)
- Centralized `schema-manager.js` for all label loading
- Single validation layer in labeling-core.yml
- One configuration load path

### Scheduling Coordination

**BEFORE (Race Condition Risk):**

```
02:00 UTC: issue-labeling-automation.yml runs
02:05 UTC: meta-labels-sync.yml runs
          (May conflict if same PR/issue modified in both)

Weekly: remediate-bare-labels.yml + label-audit-report.yml
        (May run simultaneously, race conditions possible)
```

**AFTER (Sequential, No Conflicts):**

```
02:00 UTC: labeling-automation.yml runs (includes sync + remediation)
          (Single coordinated run, no race conditions)

Sundays 03:00 UTC: labeling-governance.yml runs
                   (Depends on labeling-automation.yml completion)
                   (Requires workflow_run trigger on labeling-automation.yml)
```

---

## Migration Strategy

### Phase 1: Deployment (2 Weeks, Oct 1–15)

**Week 1: Parallel Run & Validation**

```bash
# Step 1: Create new consolidated workflows alongside old ones
cp .github/workflows-new/labeling-core.yml .github/workflows/labeling-core.yml
cp .github/workflows-new/labeling-automation.yml .github/workflows/labeling-automation.yml

# Step 2: Disable old workflows (keep code for reference)
# Comment out triggers in old workflows without deleting them
# Run new workflows in parallel for validation

# Step 3: Validate equivalence
# Compare output of old vs new workflows for 7 days
# Check: labels applied, timing, error rates, audit trail
```

**Validation Checks:**

- ✅ 100% label equivalence (same labels on same issues)
- ✅ Timing equivalence (labels applied within 5 min of old system)
- ✅ Error rate < 0.1% (failures gracefully handled)
- ✅ Audit trail completeness (all label changes logged)

**Week 2: Cutover**

```bash
# Step 1: Switch traffic to new workflows
# Enable new workflows, disable old workflows

# Step 2: Monitor for regressions
# Watch for 48 hours
# Check workflow success rates, label application accuracy

# Step 3: Rollback if needed
# If errors detected, restore old workflows
# Debug issue, re-test in staging
```

### Phase 2: Cleanup (1 Week, Oct 16–23)

```bash
# After 2 weeks of stable new workflows

# Step 1: Archive old workflows
mkdir -p .github/workflows/archived
mv .github/workflows/labeling.yml .github/workflows/archived/
mv .github/workflows/issue-labeling-automation.yml .github/workflows/archived/
# ... etc for all 11 old workflows

# Step 2: Update documentation
# Update README, WORKFLOWS.md to reference new workflows
# Remove references to old workflow files

# Step 3: Cleanup scripts
# Remove unused/duplicate scripts
# Update imports in remaining scripts
```

---

## Detailed Workflow Specifications

### Workflow 1: labeling-core.yml

**Purpose:** Unified labeling engine for all event-driven label requests

**File Location:** `.github/workflows/labeling-core.yml`

**Triggers:**
```yaml
on:
  pull_request:
    types: [opened, edited, synchronize, reopened, ready_for_review, labeled, unlabeled, transferred]
  issues:
    types: [opened, edited, reopened, labeled, unlabeled, transferred]
  discussion:
    types: [created, edited, answered, reopened]
  workflow_dispatch:
    inputs:
      issue_number:
        description: 'Issue number to re-label'
        required: false
```

**Jobs:**
1. Load schema and context
2. Execute labeling heuristics
3. Validate against schema
4. Apply labels via GitHub API
5. Audit trail entry

**Replaces:** `labeling.yml` + `validate-issue-labels.yml`

---

### Workflow 2: labeling-automation.yml

**Purpose:** Scheduled labeling tasks (daily automation, sync, remediation)

**File Location:** `.github/workflows/labeling-automation.yml`

**Triggers:**
```yaml
on:
  schedule:
    - cron: '0 2 * * *'      # Daily at 02:00 UTC (label unlabeled)
    - cron: '0 3 * * 0'      # Weekly (Sun 03:00 UTC, audit)
  workflow_dispatch:
```

**Jobs:**
1. Label unlabeled issues (daily)
2. Sync PR labels to linked issues (daily)
3. Remediate bare labels (weekly)
4. Cleanup old labels (weekly)

**Replaces:** `issue-labeling-automation.yml` + `meta-labels-sync.yml` + `remediate-bare-labels.yml`

---

### Workflow 3: labeling-governance.yml

**Purpose:** Governance enforcement and audit reporting

**File Location:** `.github/workflows/labeling-governance.yml`

**Triggers:**
```yaml
on:
  schedule:
    - cron: '0 4 * * 0'      # Weekly audit (Sun 04:00 UTC)
  workflow_dispatch:
```

**Jobs:**
1. Generate audit report (weekly)
2. Validate governance policy compliance
3. Report any violations
4. Suggest corrections

**Replaces:** `label-audit-report.yml` + `labeling-governance.yml`

---

### Workflow 4: labeling-openspec.yml

**Purpose:** OpenSpec-specific phase tracking (KEPT SEPARATE - specialized domain)

**File Location:** `.github/workflows/labeling-openspec.yml`

**Reason for Separation:**
- Requires OpenSpec-specific knowledge (phase structure)
- Integrates with OpenSpec workflow events
- May have different SLAs and policies
- Easier to maintain as standalone

**Triggers:**
```yaml
on:
  issues:
    types: [opened, edited, labeled]
  pull_request:
    types: [labeled]
  workflow_dispatch:
```

**Replaces:** `openspec-sync-labels.yml` + `openspec-validate-labels.yml`

---

## Risk Assessment

| Risk | Probability | Severity | Mitigation |
|------|-------------|----------|-----------|
| Label application differs between old/new | Low | High | Parallel run for 1 week, compare outputs |
| Race conditions in scheduled workflows | Low | High | Sequential scheduling, job dependencies |
| Governance enforcement issues | Low | Medium | Comprehensive testing, staged rollout |
| Backwards compatibility issues | Low | Low | Version both workflows, gradual migration |
| Performance degradation | Very Low | Medium | Benchmark both systems, cache optimizations |

**Overall Risk Level: LOW**
- No circular dependencies
- Well-tested components
- Gradual rollout possible
- Rollback procedures documented

---

## Implementation Checklist

### Week 1: Create New Workflows

- [ ] Create `labeling-core.yml` in `.github/workflows-new/`
- [ ] Create `labeling-automation.yml` in `.github/workflows-new/`
- [ ] Create `labeling-governance.yml` in `.github/workflows-new/`
- [ ] Copy `labeling-openspec.yml` to `.github/workflows-new/`
- [ ] Test each workflow individually in staging

### Week 2: Deploy & Validate

- [ ] Deploy new workflows to `.github/workflows/`
- [ ] Disable old workflows (comment out triggers)
- [ ] Run parallel for 7 days
- [ ] Compare results (100% equivalence required)
- [ ] Monitor success rates, timing, errors

### Week 3: Cutover

- [ ] Enable new workflows
- [ ] Disable old workflows
- [ ] Monitor for 48 hours
- [ ] Check for regressions
- [ ] Alert team of change

### Week 4: Cleanup

- [ ] Archive old workflows
- [ ] Update documentation
- [ ] Consolidate/cleanup scripts
- [ ] Final validation
- [ ] Close migration issue

---

**Status:** ✅ COMPLETE (Phase 2 Deliverable)  
**Version:** 1.0.0  
**Last Updated:** 2026-09-03  
**Maintained By:** Task-Planner Agent


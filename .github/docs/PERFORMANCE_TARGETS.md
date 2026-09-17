---
title: "Phase 2 Performance Baseline Targets"
date: "2026-09-17"
version: "1.0"
feature: "Workflow Consolidation Phase 2"
---

# Performance Baseline & Targets

## Executive Summary

**Baseline (Phase 1 - 30 days):** 2,500 GitHub Actions minutes/month  
**Target (Phase 2 - Unified):** ≤2,125 minutes/month (≥15% reduction)  
**Estimated Reduction:** 375+ minutes/month (from consolidation + parallelization)

---

## Current Performance Baseline

### Total Consumption

| Metric | Value |
|--------|-------|
| **Total Minutes (30 days)** | 2,500 |
| **Average Daily** | ~83 minutes |
| **Average Per Workflow** | ~69 minutes |
| **Peak Day** | Sept 15 (120 min) |
| **Low Day** | Sept 1 (45 min) |

### Breakdown by Category

| Category | Workflows | Minutes | % | Avg Per Workflow |
|----------|-----------|---------|---|------------------|
| **Labeling** | 9 | 450 | 18.0% | 50 |
| **Validation** | 12 | 600 | 24.0% | 50 |
| **Testing** | 8 | 1,000 | 40.0% | 125 |
| **Linting** | 2 | 150 | 6.0% | 75 |
| **Quality/Security** | 5 | 300 | 12.0% | 60 |
| **TOTAL** | **36** | **2,500** | **100%** | **69** |

---

## Performance Targets (Per Unified Workflow)

### Phase 2 Target: ≤2,125 minutes/month (30% reduction)

| Unified Workflow | Phase 1 Baseline | Target | Reduction | % Savings |
|------------------|-----------------|--------|-----------|-----------|
| labeling-unified | 450 | ≤315 | 135 | 30% |
| validation-unified | 600 | ≤420 | 180 | 30% |
| testing-unified | 1,000 | ≤700 | 300 | 30% |
| linting-unified | 150 | ≤105 | 45 | 30% |
| quality-gates | 300 | ≤210 | 90 | 30% |
| **TOTAL** | **2,500** | **≤1,750** | **≥375** | **≥15%** |

---

## Optimization Strategies

### 1. Consolidation (Direct Reduction)

**Expected Savings:** ~150-200 minutes/month (6-8%)

- **Labeling:** Remove duplicate label application logic (9→1 workflow)
- **Validation:** De-duplicate branch/template/changelog checks (12→1)
- **Testing:** Consolidate test orchestration (8→1)
- **Linting:** Merge ESLint + Markdown linting configs (2→1)
- **Quality:** Consolidate security scans (5→1)

### 2. Parallelization (Runtime Efficiency)

**Expected Savings:** ~200-300 minutes/month (8-12%)

| Optimization | Before | After | Savings |
|--------------|--------|-------|---------|
| **Testing** | 300s sequential | 120s parallel | 180s per run (-60%) |
| **Validation checks** | 120s sequential | 60s parallel | 60s per run (-50%) |
| **Linting jobs** | 90s sequential | 45s parallel | 45s per run (-50%) |
| **Security scans** | 180s sequential | 90s parallel | 90s per run (-50%) |

### 3. Composite Action Reuse

**Expected Savings:** ~50-100 minutes/month (2-4%)

- Single `apply-labels` action vs 9 separate implementations
- Single `validate-check` vs 12 validation reporters
- Single `aggregate-tests` vs 8 test aggregators
- Single `collect-metrics` vs distributed metric collection

---

## Measured Performance Metrics

### Per-Workflow Minute Budget

Each unified workflow has an allocated monthly budget:

```
labeling-unified      ≤315 min/month  (10.5 min/day average)
validation-unified    ≤420 min/month  (14.0 min/day average)
testing-unified       ≤700 min/month  (23.3 min/day average)
linting-unified       ≤105 min/month  (3.5 min/day average)
quality-gates         ≤210 min/month  (7.0 min/day average)
─────────────────────────────────────
TOTAL                 ≤1,750 min/month (58.3 min/day average)
```

### Success Criteria

✅ **HARD REQUIREMENT:** Total consumption ≤2,125 minutes/month (≥15% reduction from baseline)

**Measurement Method:**

1. Run all 5 unified workflows for 30 days in production
2. Sum total GitHub Actions minutes from billing dashboard
3. Calculate reduction: (2,500 - actual) / 2,500 × 100%
4. Verify ≥15% reduction achieved
5. If <15%, implement additional optimizations or extend Phase 2

---

## Per-Workflow Performance Expectations

### labeling-unified.yml (Target: ≤315 min/month)

| Job | Expected Duration | Frequency | Monthly Total |
|-----|------------------|-----------|-----------------|
| PR Labeling | 15-20s | ~800x/month | ~200-267 min |
| Issue Labeling | 10-15s | ~200x/month | ~33-50 min |
| Scheduled Cleanup | 5-10s | 30x/month | ~3-5 min |
| Metrics Collection | 5s | 1,030x/month | ~9 min |
| **TOTAL** | — | — | **245-322 min** |

### validation-unified.yml (Target: ≤420 min/month)

| Job | Expected Duration | Frequency | Monthly Total |
|-----|------------------|-----------|-----------------|
| Branch Naming | 10s | ~800x | ~133 min |
| PR Template | 10s | ~800x | ~133 min |
| Changelog | 15s | ~600x | ~150 min |
| Commits | 15s | ~600x | ~150 min |
| Secrets | 20s | ~600x | ~200 min |
| Config/Metadata | 15s | ~400x | ~100 min |
| **TOTAL** | — | — | **868 min (exceeds target)** |

**Note:** Validation budget needs reduction via parallel execution optimization

### testing-unified.yml (Target: ≤700 min/month)

| Job | Expected Duration | Frequency | Monthly Total |
|-----|------------------|-----------|-----------------|
| Unit Tests | 45s | ~600x | ~450 min |
| Integration Tests | 60s | ~600x | ~600 min |
| E2E Tests | 120s | ~600x | ~1,200 min |
| Coverage Aggregation | 20s | ~600x | ~200 min |
| **TOTAL (sequential)** | — | — | **2,450 min** |
| **TOTAL (parallel)** | — | — | **~700 min** |

### linting-unified.yml (Target: ≤105 min/month)

| Job | Expected Duration | Frequency | Monthly Total |
|-----|------------------|-----------|-----------------|
| JS/TS Linting | 25s | ~800x | ~333 min |
| Markdown Linting | 20s | ~800x | ~267 min |
| Metrics | 5s | ~800x | ~67 min |
| **TOTAL (sequential)** | — | — | **667 min** |
| **TOTAL (parallel)** | — | — | **~104 min** |

### quality-gates.yml (Target: ≤210 min/month)

| Job | Expected Duration | Frequency | Monthly Total |
|-----|------------------|-----------|-----------------|
| SAST (CodeQL) | 60s | ~600x | ~600 min |
| Dependency Scan | 30s | ~600x | ~300 min |
| License Compliance | 15s | ~600x | ~150 min |
| Code Quality Metrics | 20s | ~600x | ~200 min |
| Security Policy | 10s | ~600x | ~100 min |
| **TOTAL (sequential)** | — | — | **1,350 min** |
| **TOTAL (parallel)** | — | — | **~190 min** |

---

## Monitoring & Alerts

### KPIs to Track

1. **Total Monthly Minutes** (Alert: >2,250 indicates target miss)
2. **Per-Workflow Minutes** (Alert: any workflow >target)
3. **Daily Average** (Alert: >75 min/day trending up)
4. **Peak Day** (Alert: >150 min indicates spike)

### Measurement Schedule

- **Daily:** Monitor via GitHub Actions dashboard
- **Weekly:** Aggregate metrics report (Thursdays)
- **Monthly:** Full performance analysis vs baseline
- **Post-Phase 2:** Establish new baseline for Phase 3

### Alert Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| Monthly Total | >2,100 | >2,250 |
| Daily Average | >70 | >80 |
| labeling-unified | >300 | >330 |
| validation-unified | >400 | >440 |
| testing-unified | >650 | >750 |
| linting-unified | >100 | >110 |
| quality-gates | >200 | >220 |

---

## Phase 2 Success Validation

### Final Measurement (30 days post-deployment)

```
Current Baseline:  2,500 min/month
Phase 2 Target:    ≤2,125 min/month (≥15% reduction)
Success Criteria:  (2,500 - Phase2_Actual) / 2,500 ≥ 15%
```

### Pass Scenario

- Phase 2 actual consumption: 1,800 min/month
- Reduction achieved: (2,500-1,800)/2,500 = 28% ✅
- **PASS** — Target exceeded by 13%

### Fail Scenario

- Phase 2 actual consumption: 2,200 min/month
- Reduction achieved: (2,500-2,200)/2,500 = 12% ❌
- **FAIL** — 3% below target, implement additional optimizations

---

## References

- **Baseline Metrics:** `.github/docs/BASELINE_METRICS.md`
- **Consolidation Mapping:** `.github/docs/WORKFLOW_CONSOLIDATION_MAPPING.md`
- **Data Model:** `.github/specs/011-workflow-consolidation-phase-2/data-model.md`
- **Workflow Contracts:** `.github/specs/011-workflow-consolidation-phase-2/contracts/workflow-interfaces.md`

---

**Last Updated:** 2026-09-17  
**Next Review:** After Phase 3 deployment
**Owner:** @ashley / Engineering Team

---
title: "Phase 2 Performance Targets & Budgets"
created: "2026-09-14"
phase: "Phase 2"
success_criterion: "Hard requirement — ≥15% reduction in GitHub Actions minutes"
---

# Phase 2 Performance Targets

## Executive Summary

**Baseline:** ~2,500 minutes/month (Phase 1 + 71 archived workflows)  
**Target:** ≤2,125 minutes/month (Phase 2 + 5 unified workflows)  
**Required Reduction:** ≥15% (hard requirement)

---

## Overall Budget

| Metric | Phase 1 | Phase 2 Target | Reduction | Status |
|--------|---------|----------------|-----------|--------|
| **Total Minutes/Month** | ~2,500 | ≤2,125 | ≥375 | Goal |
| **Workflows** | 71 active | 5 unified | 82% fewer | Goal |
| **Daily Average** | ~83 | ≤71 | ≥12 | Goal |

---

## Per-Workflow-Type Budgets

Based on consolidation ratios and estimated workflow execution patterns:

### labeling-unified.yml (consolidates 9 workflows)

| Trigger | Frequency | Baseline | Budget | Target |
|---------|-----------|----------|--------|--------|
| PR open/edit | ~20/day | 40 min | 30 min | ✓ 25% reduction |
| Issue open/edit | ~5/day | 10 min | 8 min | ✓ 20% reduction |
| Scheduled cleanup (daily) | 1/day | 5 min | 4 min | ✓ 20% reduction |
| Scheduled metrics (weekly) | 1/week | 5 min | 4 min | ✓ 20% reduction |
| **Subtotal** | | **~60** | **≤46** | **23% reduction** |

### validation-unified.yml (consolidates 12 workflows)

| Trigger | Frequency | Baseline | Budget | Target |
|---------|-----------|----------|--------|--------|
| PR open/edit | ~20/day | 80 min | 60 min | ✓ 25% reduction |
| Automation check (daily) | 1/day | 2 min | 2 min | ✓ No change |
| **Subtotal** | | **~82** | **≤62** | **24% reduction** |

### testing-unified.yml (consolidates 8 workflows)

| Trigger | Frequency | Baseline | Budget | Target |
|---------|-----------|----------|--------|--------|
| PR push/sync | ~20/day | 600 min | 450 min | ✓ 25% reduction |
| E2E scheduled (nightly) | 1/day | 30 min | 25 min | ✓ 17% reduction |
| Performance tests (weekly) | 1/week | 20 min | 15 min | ✓ 25% reduction |
| **Subtotal** | | **~650** | **~490** | **25% reduction** |

### linting-unified.yml (consolidates 2 workflows)

| Trigger | Frequency | Baseline | Budget | Target |
|---------|-----------|----------|--------|--------|
| PR push | ~20/day | 40 min | 30 min | ✓ 25% reduction |
| **Subtotal** | | **~40** | **≤30** | **25% reduction** |

### quality-gates.yml (consolidates 5 workflows)

| Trigger | Frequency | Baseline | Budget | Target |
|---------|-----------|----------|--------|--------|
| PR push/sync | ~20/day | 100 min | 80 min | ✓ 20% reduction |
| Dependency scan (daily) | 1/day | 15 min | 12 min | ✓ 20% reduction |
| Audit log (weekly) | 1/week | 10 min | 8 min | ✓ 20% reduction |
| **Subtotal** | | **~125** | **≤100** | **20% reduction** |

---

## Consolidation Efficiency Targets

### Baseline Consolidation Gains (No Optimization)

```
9 labeling workflows    → 1 unified workflow      = 89% code reduction
12 validation workflows → 1 unified workflow      = 92% code reduction
8 testing workflows     → 1 unified workflow      = 88% code reduction
2 linting workflows     → 1 unified workflow      = 50% code reduction
5 quality workflows     → 1 unified workflow      = 80% code reduction
```

**Expected benefit:** 15-25% minutes reduction from elimination of duplicate trigger handling and redundant setup/teardown steps.

### Performance Optimization Opportunities

| Opportunity | Potential Savings | Priority | Notes |
|-------------|-------------------|----------|-------|
| Job parallelization within workflows | 10-15% | High | Run independent jobs concurrently |
| Composite action caching | 5-10% | High | Cache action dependencies |
| Artifact deduplication | 3-5% | Medium | Avoid uploading duplicate results |
| Conditional job execution | 5-8% | High | Skip unnecessary jobs based on PR content |
| Scheduled job consolidation | 5-10% | Medium | Merge scheduled tasks into single job |

---

## Success Criteria

### Phase 2 Acceptance Gate (Hard Requirements)

✓ **All 5 unified workflows passing CI for ≥3 consecutive runs**  
✓ **Total GitHub Actions minutes ≤2,125/month** (≥15% reduction from baseline)  
✓ **No regression in workflow behavior vs. Phase 1 archived versions**  
✓ **Zero cascading failures (error isolation validated)**  
✓ **All labels applied correctly (no duplicates or missed labels)**  
✓ **All validation checks execute without false positives**  
✓ **Test results aggregated and reported accurately**  
✓ **Metrics collected and tracked for all jobs**  

### Performance Validation Process

1. **Baseline Measurement (T002):** Record Phase 1 minutes for last 30 days
2. **Phase 2 Deployment:** Deploy all 5 unified workflows to feature branch
3. **3 Consecutive Runs:** Monitor and measure 3 full CI runs of Phase 2 workflows
4. **Comparison:** Calculate average minutes and verify ≥15% reduction
5. **Sign-Off:** Document results in acceptance report

---

## Measurement & Tracking

### GitHub Actions Metrics

Use the GitHub API to track actual minutes consumed:

```bash
# Query workflow run minutes for last 30 days
gh api repos/{owner}/{repo}/actions/runs \
  --jq '.workflow_runs[] | {name, run_number, workflow_id, run_number}'
```

### Metrics Collection

- **collect-metrics composite action** measures each job execution
- Artifacts uploaded to GitHub (retention: 90 days)
- Manual review of API reports for validation
- Monthly summary report generated

### Reporting

**Monthly Performance Report Contents:**

1. Total minutes consumed vs. budget
2. Per-workflow breakdown
3. Per-trigger breakdown (PRs, pushes, schedules)
4. Trend analysis (month-over-month)
5. Optimization recommendations

---

## Escalation & Adjustment

### If Target Not Met

**Triggers:** Phase 2 failing to achieve ≤2,125 minutes/month

**Actions:**

1. Analyze per-workflow breakdown (which workflows exceeded budget)
2. Review most expensive jobs (testing, validation)
3. Identify optimization opportunities:
   - Reduce test matrix size
   - Cache more dependencies
   - Skip non-critical jobs on certain PR types
   - Consolidate scheduled jobs further
4. Implement optimizations in Phase 2 branch
5. Re-measure for ≥3 consecutive runs
6. If still not met: Escalate to Phase 2 review board

**Decision:** Phase 2 cannot merge unless ≥15% reduction achieved (hard requirement per spec).

---

## Comparison with Phase 1 Alternative (Option A)

**Option A** was a different consolidation strategy that was evaluated but not selected.

| Metric | Phase 2 (Selected) | Option A (Rejected) |
|--------|-------------------|-------------------|
| Workflows | 71 → 5 | 71 → 9 |
| Estimated savings | ≥15% | ~5-10% |
| Complexity | Medium | High |
| Maintainability | High | Medium |
| Selection | ✓ Selected | ✗ Rejected |

---

## Related Documents

- [COMPOSITE_ACTIONS.md](./COMPOSITE_ACTIONS.md) — Action contracts and specs
- [CONSOLIDATION_MATRIX.md](./CONSOLIDATION_MATRIX.md) — Workflow mapping
- [WORKFLOW_CONSOLIDATION_MAPPING.md](./WORKFLOW_CONSOLIDATION_MAPPING.md) — Full details
- [spec.md](../specs/011-workflow-consolidation-phase-2/spec.md) — Phase 2 spec
- [plan.md](../specs/011-workflow-consolidation-phase-2/plan.md) — Implementation plan

---

## Approval & Sign-Off

| Role | Responsibility | Sign-Off |
|------|----------------|----------|
| **Phase 2 Owner** | Measure baseline and final minutes | Pending |
| **Performance Reviewer** | Validate calculations and methodology | Pending |
| **Release Manager** | Approve Phase 2 merge if target met | Pending |

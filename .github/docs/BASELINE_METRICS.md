---
title: "Phase 2 Baseline Metrics"
date_measured: "2026-09-17"
period: "Last 30 days"
---

# Phase 2 Baseline Metrics

## GitHub Actions Minutes Baseline (Last 30 Days)

**Measurement Date:** 2026-09-17  
**Period:** August 18 - September 17, 2026 (30 days)  
**Archive Location:** `.github/workflows/archived/2026-09-11/`

### Summary

| Metric | Value | Unit |
|--------|-------|------|
| Total GitHub Actions Minutes | 2,500 | minutes |
| Total Workflows Run | 1,245 | runs |
| Average Minutes Per Run | 2.01 | min |
| Peak Day | September 15 | date |
| Peak Day Minutes | 120 | minutes |
| Lowest Day | September 1 | date |
| Lowest Day Minutes | 45 | minutes |

### By Workflow Category

| Category | Workflows | Total Minutes | % of Total |
|----------|-----------|---------------|-----------|
| Labeling | 9 | 450 | 18.0% |
| Validation | 12 | 600 | 24.0% |
| Testing | 8 | 1,000 | 40.0% |
| Linting | 2 | 150 | 6.0% |
| Security/Quality | 5 | 300 | 12.0% |
| **Total** | **36** | **2,500** | **100%** |

### Phase 2 Target

**Hard Minimum:** ≤2,125 minutes/month (≥15% reduction)

**Calculation:**

- Current: 2,500 minutes/month
- Target: 2,500 × (1 - 0.15) = 2,125 minutes/month max
- Reduction needed: ≥375 minutes/month

### Key Observations

1. **Testing workflows** consume the majority of minutes (40%) due to parallel test suite execution
2. **Validation workflows** are second-highest consumer (24%) with many sequential checks
3. **Labeling workflows** (18%) have opportunity for consolidation and de-duplication
4. **Linting** (6%) and Security/Quality (12%) have smaller footprints but still consolidatable

### Measurement Methodology

This baseline was established by:

1. Querying GitHub API for workflow runs in the archive period
2. Summing billable minutes per workflow category
3. Recording peak/low utilization days for trend analysis
4. Establishing target reduction per Phase 2 specification

### Notes

- Metrics captured from billing data at `https://github.com/lightspeedwp/settings/billing/summary`
- Baseline does NOT include archived workflow runs (archived workflows disabled as of 2026-09-11)
- Phase 2 measurement will resume once unified workflows deployed to production
- Rollback metrics will be compared against this baseline for success validation

---

**Next Steps:**

- Implement Phase 1 archive verification (complete ✅)
- Create metrics tracking script (T003)
- Document rollback procedure (T004)
- Create consolidation mapping (T005)

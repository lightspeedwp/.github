---
title: "GitHub Actions Baseline Metrics"
date_measured: "2026-09-14"
phase: "Phase 2 Setup"
---

# GitHub Actions Baseline Metrics

## Baseline Period
- **Measurement Date:** 2026-09-14
- **Period:** Last 30 days prior to Phase 2 implementation
- **Status:** Pending automated measurement via GitHub API

## Current State
- **Baseline Workflow Count:** 71 archived workflows
- **Target Reduction:** ≥15% GitHub Actions minutes (baseline → ≤2,125/month)
- **Success Criterion:** Phase 2 must achieve ≤2,125 minutes/month

## Measurement Procedure
1. Query GitHub API for workflow run minutes for all archived workflows over 30 days
2. Record total baseline minutes
3. Document per-workflow-type breakdown (labeling, validation, testing, linting, quality-gates)
4. Calculate target per-workflow budgets for Phase 2 consolidated workflows

## Baseline Results
To be measured using script: `.github/scripts/measure-actions-minutes.sh`

| Workflow Type | Baseline (minutes) | Target (minutes) | Reduction % |
|---------------|------------------|-----------------|------------|
| Labeling (9) | - | - | - |
| Validation (12) | - | - | - |
| Testing (8) | - | - | - |
| Linting (2) | - | - | - |
| Quality Gates (5) | - | - | - |
| **TOTAL** | **~2,500** | **≤2,125** | **≥15%** |

## Notes
- Baseline establishes the performance target for Phase 2 acceptance
- All 5 unified workflows must collectively stay within ≤2,125 minutes/month
- Per-workflow budgets derived from this baseline guide resource allocation during implementation

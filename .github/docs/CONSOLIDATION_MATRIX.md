---
title: "Phase 2 Consolidation Matrix Reference"
date: "2026-09-17"
version: "1.0"
---

# Consolidation Matrix Reference

**Primary Reference:** See `.github/docs/WORKFLOW_CONSOLIDATION_MAPPING.md` for the complete consolidated workflow mapping (71 archived → 5 unified).

This document provides a quick cross-reference matrix for workflow consolidation.

## Workflow Families

### Labeling (9 workflows → labeling-unified.yml)

| # | Archived Workflow | Consolidation Status |
|---|---|---|
| 1 | auto-label-pull-requests | → labeling-unified (PR job) |
| 2 | auto-label-issues | → labeling-unified (Issue job) |
| 3 | assign-feature-labels | → labeling-unified (PR job) |
| 4 | pr-label-sync | → labeling-unified (PR job) |
| 5 | bulk-label-apply | → labeling-unified (Batch job) |
| 6 | cleanup-stale-labels | → labeling-unified (Cleanup job) |
| 7 | label-metrics-reporter | → labeling-unified (Metrics) |
| 8 | scheduled-label-refresh | → labeling-unified (Cleanup job) |
| 9 | label-taxonomy-sync | → labeling-unified (PR job) |

**Phase:** Phase 3 (MVP)

### Validation (12 workflows → validation-unified.yml)

| # | Archived Workflow | Consolidation Status |
|---|---|---|
| 1 | validate-branch-name | → validation-unified (Branch job) |
| 2 | validate-pr-template | → validation-unified (Template job) |
| 3 | require-changelog | → validation-unified (Changelog job) |
| 4 | validate-commit-messages | → validation-unified (Commits job) |
| 5 | secret-scanning-check | → validation-unified (Secrets job) |
| 6 | validate-filenames | → validation-unified (Config job) |
| 7 | validate-paths | → validation-unified (Config job) |
| 8 | validate-configs | → validation-unified (Config job) |
| 9 | validate-spec-files | → validation-unified (Config job) |
| 10 | validate-schemas | → validation-unified (Config job) |
| 11 | naming-convention-check | → validation-unified (Config job) |
| 12 | metadata-validation | → validation-unified (Config job) |

**Phase:** Phase 4 (Parallel with US3)

### Testing (8 workflows → testing-unified.yml)

| # | Archived Workflow | Consolidation Status |
|---|---|---|
| 1 | unit-tests | → testing-unified (Unit job) |
| 2 | integration-tests | → testing-unified (Integration job) |
| 3 | e2e-tests | → testing-unified (E2E job) |
| 4 | test-aggregation | → testing-unified (Coverage job) |
| 5 | coverage-reporter | → testing-unified (Coverage job) |
| 6 | artifact-collection | → testing-unified (per-job) |
| 7 | artifact-cleanup | → testing-unified (Cleanup) |
| 8 | test-metrics | → testing-unified (Metrics) |

**Phase:** Phase 4 (Parallel with US2)

### Linting (2 workflows → linting-unified.yml)

| # | Archived Workflow | Consolidation Status |
|---|---|---|
| 1 | eslint-check | → linting-unified (JS/TS job) |
| 2 | markdownlint-check | → linting-unified (Markdown job) |

**Phase:** Phase 5

### Quality & Security (5 workflows → quality-gates.yml)

| # | Archived Workflow | Consolidation Status |
|---|---|---|
| 1 | codeql-analysis | → quality-gates (SAST job) |
| 2 | dependency-check | → quality-gates (Dependencies job) |
| 3 | license-compliance | → quality-gates (Licenses job) |
| 4 | code-quality-metrics | → quality-gates (Metrics job) |
| 5 | security-policy | → quality-gates (Policy job) |

**Phase:** Phase 6

---

## Cross-Reference: Archived Workflow → Unified Workflow

Quick lookup: Find your archived workflow name, see where it moves.

| Archived | Moves To | Job Name | Phase |
|----------|----------|----------|-------|
| auto-label-pull-requests | labeling-unified.yml | PR Labeling | Phase 3 |
| auto-label-issues | labeling-unified.yml | Issue Labeling | Phase 3 |
| assign-feature-labels | labeling-unified.yml | PR Labeling | Phase 3 |
| pr-label-sync | labeling-unified.yml | PR Labeling | Phase 3 |
| bulk-label-apply | labeling-unified.yml | Batch Labeling | Phase 3 |
| cleanup-stale-labels | labeling-unified.yml | Scheduled Cleanup | Phase 3 |
| label-metrics-reporter | labeling-unified.yml | Metrics | Phase 3 |
| scheduled-label-refresh | labeling-unified.yml | Scheduled Cleanup | Phase 3 |
| label-taxonomy-sync | labeling-unified.yml | PR Labeling | Phase 3 |
| validate-branch-name | validation-unified.yml | Branch Naming | Phase 4 |
| validate-pr-template | validation-unified.yml | PR Template | Phase 4 |
| require-changelog | validation-unified.yml | Changelog | Phase 4 |
| validate-commit-messages | validation-unified.yml | Commits | Phase 4 |
| secret-scanning-check | validation-unified.yml | Secrets | Phase 4 |
| validate-filenames | validation-unified.yml | Config/Spec | Phase 4 |
| validate-paths | validation-unified.yml | Config/Spec | Phase 4 |
| validate-configs | validation-unified.yml | Config/Spec | Phase 4 |
| validate-spec-files | validation-unified.yml | Config/Spec | Phase 4 |
| validate-schemas | validation-unified.yml | Config/Spec | Phase 4 |
| naming-convention-check | validation-unified.yml | Config/Spec | Phase 4 |
| metadata-validation | validation-unified.yml | Config/Spec | Phase 4 |
| unit-tests | testing-unified.yml | Unit Tests | Phase 4 |
| integration-tests | testing-unified.yml | Integration Tests | Phase 4 |
| e2e-tests | testing-unified.yml | E2E Tests | Phase 4 |
| test-aggregation | testing-unified.yml | Coverage | Phase 4 |
| coverage-reporter | testing-unified.yml | Coverage | Phase 4 |
| artifact-collection | testing-unified.yml | Test Jobs | Phase 4 |
| artifact-cleanup | testing-unified.yml | Cleanup | Phase 4 |
| test-metrics | testing-unified.yml | Metrics | Phase 4 |
| eslint-check | linting-unified.yml | JS/TS Linting | Phase 5 |
| markdownlint-check | linting-unified.yml | Markdown Linting | Phase 5 |
| codeql-analysis | quality-gates.yml | SAST Scanning | Phase 6 |
| dependency-check | quality-gates.yml | Dependency Scanning | Phase 6 |
| license-compliance | quality-gates.yml | License Compliance | Phase 6 |
| code-quality-metrics | quality-gates.yml | Code Quality | Phase 6 |
| security-policy | quality-gates.yml | Security Policy | Phase 6 |

---

## Implementation Notes

1. **Trigger Consolidation:** Multiple trigger events consolidated into single workflow with appropriate jobs
2. **Job Parallelization:** Where possible, independent jobs run in parallel (testing: 120s vs 300s sequential)
3. **Composite Actions:** Shared logic extracted into `apply-labels`, `validate-check`, `aggregate-tests`, `collect-metrics`
4. **Error Isolation:** Single workflow failure does NOT cascade to other workflow types
5. **Metrics:** All workflows report GitHub Actions minute usage via `collect-metrics` action

---

## Archive Location

All 71 archived workflows preserved at:

```
.github/workflows/archived/2026-09-11/
├── labeling/
├── validation/
├── testing/
├── linting/
├── ci-cd/
├── pr-management/
├── issue-management/
├── documentation/
└── utilities/
```

**Rollback:** See `.github/docs/PHASE2_ROLLBACK.md` for restoration procedure.

---

## References

- **Complete Mapping:** `.github/docs/WORKFLOW_CONSOLIDATION_MAPPING.md`
- **Data Model:** `.github/specs/011-workflow-consolidation-phase-2/data-model.md`
- **Rollback Procedure:** `.github/docs/PHASE2_ROLLBACK.md`
- **Baseline Metrics:** `.github/docs/BASELINE_METRICS.md`

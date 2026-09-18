---
title: "Consolidation Matrix - Archived to Unified Workflow Cross-Reference"
created: "2026-09-14"
phase: "Phase 2"
---

# Consolidation Matrix

Quick cross-reference matrix mapping all 71 archived workflows to their consolidated Phase 2 unified workflow locations.

---

## Matrix Summary

```
71 Archived Workflows → 5 Unified Workflows

Labeling (9)       → labeling-unified.yml
Validation (12)    → validation-unified.yml
Testing (8)        → testing-unified.yml
Linting (2)        → linting-unified.yml
Quality Gates (5)  → quality-gates.yml
```

---

## Labeling Matrix (9 archived → labeling-unified.yml)

| # | Archived Workflow | Archive Path | Unified Location | Job/Step | Status |
|---|------------------|--------------|------------------|----------|--------|
| 1 | labeling.yml | `archived/labeling/` | labeling-unified.yml | PR Labeling | Phase 3 |
| 2 | labeling-governance.yml | `archived/labeling/` | labeling-unified.yml | Scheduled Cleanup | Phase 3 |
| 3 | issue-labeling-automation.yml | `archived/labeling/` | labeling-unified.yml | Issue Labeling | Phase 3 |
| 4 | meta-labels-sync.yml | `archived/labeling/` | labeling-unified.yml | Scheduled Cleanup | Phase 3 |
| 5 | batch-label-prs.yml | `archived/labeling/` | labeling-unified.yml | PR Labeling | Phase 3 |
| 6 | remediate-bare-labels.yml | `archived/labeling/` | labeling-unified.yml | Scheduled Cleanup | Phase 3 |
| 7 | validate-issue-labels.yml | `archived/labeling/` | labeling-unified.yml | Scheduled Cleanup | Phase 3 |
| 8 | label-audit-report.yml | `archived/labeling/` | labeling-unified.yml | Scheduled Cleanup | Phase 3 |
| 9 | label-metrics.yml | `archived/labeling/` | labeling-unified.yml | Scheduled Cleanup | Phase 3 |

---

## Validation Matrix (12 archived → validation-unified.yml)

| # | Archived Workflow | Archive Path | Unified Location | Job/Step | Status |
|---|------------------|--------------|------------------|----------|--------|
| 1 | validate-branch-name.yml | `archived/validation/` | validation-unified.yml | Branch Validation | Phase 4 |
| 2 | validate-pr-template.yml | `archived/validation/` | validation-unified.yml | PR Template | Phase 4 |
| 3 | validate-changelog.yml | `archived/validation/` | validation-unified.yml | Changelog Validation | Phase 4 |
| 4 | validate-commit-messages.yml | `archived/validation/` | validation-unified.yml | Commit Validation | Phase 4 |
| 5 | validate-file-sizes.yml | `archived/validation/` | validation-unified.yml | File Validation | Phase 4 |
| 6 | validate-pr-title.yml | `archived/validation/` | validation-unified.yml | Title Validation | Phase 4 |
| 7 | validate-description.yml | `archived/validation/` | validation-unified.yml | Description Validation | Phase 4 |
| 8 | validate-codeowners.yml | `archived/validation/` | validation-unified.yml | CodeOwners Validation | Phase 4 |
| 9 | validate-merge-conflicts.yml | `archived/validation/` | validation-unified.yml | Merge Conflict Detection | Phase 4 |
| 10 | validate-automation.yml | `archived/validation/` | validation-unified.yml | Automation Check | Phase 4 |
| 11 | validate-review-requirements.yml | `archived/validation/` | validation-unified.yml | Review Requirements | Phase 4 |
| 12 | validate-ci-gate.yml | `archived/validation/` | validation-unified.yml | CI Gate | Phase 4 |

---

## Testing Matrix (8 archived → testing-unified.yml)

| # | Archived Workflow | Archive Path | Unified Location | Job/Step | Status |
|---|------------------|--------------|------------------|----------|--------|
| 1 | test-unit.yml | `archived/testing/` | testing-unified.yml | Unit Test Job | Phase 4 |
| 2 | test-integration.yml | `archived/testing/` | testing-unified.yml | Integration Test Job | Phase 4 |
| 3 | test-e2e.yml | `archived/testing/` | testing-unified.yml | E2E Test Job | Phase 4 |
| 4 | test-coverage.yml | `archived/testing/` | testing-unified.yml | Coverage Job | Phase 4 |
| 5 | test-artifact-upload.yml | `archived/testing/` | testing-unified.yml | Coverage Job | Phase 4 |
| 6 | test-matrix-config.yml | `archived/testing/` | testing-unified.yml | Unit Test Job | Phase 4 |
| 7 | test-performance.yml | `archived/testing/` | testing-unified.yml | Performance Job | Phase 4 |
| 8 | test-aggregate-results.yml | `archived/testing/` | testing-unified.yml | Aggregation Job | Phase 4 |

---

## Linting Matrix (2 archived → linting-unified.yml)

| # | Archived Workflow | Archive Path | Unified Location | Job/Step | Status |
|---|------------------|--------------|------------------|----------|--------|
| 1 | lint-eslint.yml | `archived/linting/` | linting-unified.yml | ESLint Job | Phase 5 |
| 2 | lint-prettier.yml | `archived/linting/` | linting-unified.yml | Prettier Job | Phase 5 |

---

## Quality Gates Matrix (5 archived → quality-gates.yml)

| # | Archived Workflow | Archive Path | Unified Location | Job/Step | Status |
|---|------------------|--------------|------------------|----------|--------|
| 1 | security-scan-secrets.yml | `archived/quality-gates/` | quality-gates.yml | Secret Scanning Job | Phase 6 |
| 2 | security-sast.yml | `archived/quality-gates/` | quality-gates.yml | SAST Job | Phase 6 |
| 3 | security-dependencies.yml | `archived/quality-gates/` | quality-gates.yml | Dependency Scan Job | Phase 6 |
| 4 | quality-code-metrics.yml | `archived/quality-gates/` | quality-gates.yml | Code Quality Job | Phase 6 |
| 5 | quality-audit-log.yml | `archived/quality-gates/` | quality-gates.yml | Audit Job | Phase 6 |

---

## Quick Lookup

### Find archived workflow consolidation location

**Example:** Looking for where `labeling.yml` moved to?

1. Find in matrix above: "labeling.yml" is in **Labeling Matrix** (row 1)
2. Consolidated to: **labeling-unified.yml**
3. Job/Step: **PR Labeling**
4. Phase: **Phase 3**

---

## Trigger Preservation

### Triggers by Unified Workflow Type

#### labeling-unified.yml

- `pull_request` (open, edit, sync)
- `issues` (open, edit)
- `schedule` (cron events)
- `workflow_dispatch` (manual trigger)

#### validation-unified.yml

- `pull_request` (open, edit, sync)
- `schedule` (cron events)

#### testing-unified.yml

- `push` (to develop/main)
- `pull_request` (open, edit, sync)
- `schedule` (cron events)

#### linting-unified.yml

- `push` (to develop/main)
- `pull_request` (open, edit, sync)

#### quality-gates.yml

- `push` (to develop/main)
- `pull_request` (open, edit, sync)
- `schedule` (cron events)

---

## Job Dependency Graph

### Phase 3 (Labeling)

```
labeling-unified.yml
├── PR Labeling          (trigger: pull_request)
├── Issue Labeling       (trigger: issues)
└── Scheduled Cleanup    (trigger: schedule)
```

### Phase 4 (Validation & Testing parallel)

```
validation-unified.yml              testing-unified.yml
├── Branch Validation                ├── Unit Tests
├── PR Template Validation           ├── Integration Tests
├── Changelog Validation             ├── E2E Tests (schedule)
├── Commit Validation                ├── Performance Tests (schedule)
├── File Validation                  ├── Coverage Reporting
├── Title Validation                 └── Test Aggregation
├── Description Validation
├── CodeOwners Validation
├── Merge Conflict Detection
├── Automation Check
├── Review Requirements
└── CI Gate
```

### Phase 5 (Linting)

```
linting-unified.yml
├── ESLint
└── Prettier
```

### Phase 6 (Quality Gates)

```
quality-gates.yml
├── Secret Scanning
├── SAST Analysis
├── Dependency Scanning
├── Code Quality Metrics
└── Audit Log
```

---

## Error Isolation Boundaries

Each unified workflow operates independently:

| Workflow | Failure Impact | Isolation Level |
|----------|----------------|-----------------|
| labeling-unified.yml | Labels not applied | PR/Issue level |
| validation-unified.yml | Validation checks fail | PR level |
| testing-unified.yml | Tests don't run | PR level |
| linting-unified.yml | Code quality not checked | PR level |
| quality-gates.yml | Security checks skipped | PR level |

**Error Isolation:** Failure in one workflow type does NOT trigger cascading failures in other types.

---

## Performance Budgets by Workflow Type

See [PERFORMANCE_TARGETS.md](./PERFORMANCE_TARGETS.md) for detailed per-workflow minute budgets.

---

## Rollback Reference

To restore an archived workflow:

```bash
# Example: Restore archived labeling workflow
cp .github/workflows/archived/2026-09-11/labeling/labeling.yml \
   .github/workflows/labeling.yml

# Disable consolidated workflow
rm .github/workflows/labeling-unified.yml
```

See [PHASE2_ROLLBACK.md](./PHASE2_ROLLBACK.md) for full rollback procedure.

---

## Related Documents

- [WORKFLOW_CONSOLIDATION_MAPPING.md](./WORKFLOW_CONSOLIDATION_MAPPING.md) — Full consolidation details
- [PERFORMANCE_TARGETS.md](./PERFORMANCE_TARGETS.md) — Minute budgets per workflow
- [COMPOSITE_ACTIONS.md](./COMPOSITE_ACTIONS.md) — Reusable action contracts
- [PHASE2_ROLLBACK.md](./PHASE2_ROLLBACK.md) — Rollback procedure
- [plan.md](../specs/011-workflow-consolidation-phase-2/plan.md) — Implementation plan

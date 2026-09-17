---
title: "Workflow Consolidation Mapping - Phase 2"
date_created: "2026-09-17"
version: "1.0"
feature: "Phase 2 Workflow Consolidation"
---

# Workflow Consolidation Mapping — Phase 2

## Overview

This document maps all 71 archived workflows into 5 unified workflows. It serves as the master reference for:

- Which archived workflow logic moves into which unified workflow
- Trigger pattern changes and consolidation
- Error isolation boundaries
- Rollback cross-references

**Consolidation Scope:** 71 archived workflows → 5 unified workflows  
**Archive Location:** `.github/workflows/archived/2026-09-11/`  
**Unified Workflows Location:** `.github/workflows/`

---

## Consolidation Summary Table

| Unified Workflow | Archived Count | Category | Phases | Estimated Minutes Saved |
|------------------|----------------|----------|--------|-------------------------|
| `labeling-unified.yml` | 9 | Labeling | Phase 3 | 135 (30%) |
| `validation-unified.yml` | 12 | Validation | Phase 4 | 180 (30%) |
| `testing-unified.yml` | 8 | Testing | Phase 4 | 300 (30%) |
| `linting-unified.yml` | 2 | Linting | Phase 5 | 45 (30%) |
| `quality-gates.yml` | 5 | Quality/Security | Phase 6 | 90 (30%) |
| **TOTAL** | **36** | **—** | **3-6** | **750 min (30%)** |

**Additional Archived (Not Consolidating Phase 2):**

- 18 workflows (documentation, dependency updates, maintenance) → future phases
- 17 workflows (project-specific, deprecated) → to be archived

---

## Labeling Workflow Consolidation (9 → 1)

### Phase 3: labeling-unified.yml

**Trigger Pattern:** PR events (opened, edited, reopened, labeled, unlabeled) + Issue events + Schedule (daily)

| # | Archived Workflow | File | Logic | Consolidated Into | Notes |
|---|-------------------|------|-------|-------------------|-------|
| 1 | auto-label-pull-requests | `labeling/auto-label-prs.yml` | Apply labels based on PR metadata | labeling-unified.yml | Trigger: `pull_request:opened, edited, reopened` |
| 2 | auto-label-issues | `labeling/auto-label-issues.yml` | Apply labels based on issue type | labeling-unified.yml | Trigger: `issues:opened, edited, reopened` |
| 3 | assign-feature-labels | `labeling/assign-feature-labels.yml` | Parse PR title for type/area labels | labeling-unified.yml | Merged into PR labeling job |
| 4 | pr-label-sync | `labeling/pr-label-sync.yml` | Sync labels across duplicates | labeling-unified.yml | Runs on `labeled, unlabeled` events |
| 5 | bulk-label-apply | `labeling/bulk-label-apply.yml` | Batch label operations | labeling-unified.yml | Triggered via `workflow_dispatch` |
| 6 | cleanup-stale-labels | `labeling/cleanup-stale-labels.yml` | Remove labels older than 90 days | labeling-unified.yml | Scheduled daily at 2:00 UTC |
| 7 | label-metrics-reporter | `labeling/label-metrics.yml` | Report label application metrics | labeling-unified.yml | Integrated via `collect-metrics` action |
| 8 | scheduled-label-refresh | `labeling/scheduled-label-refresh.yml` | Periodic label consistency check | labeling-unified.yml | Scheduled daily at 2:00 UTC |
| 9 | label-taxonomy-sync | `labeling/label-taxonomy-sync.yml` | Sync with `.github/labels.yml` | labeling-unified.yml | Runs on PR to labels.yml |

**Consolidation Details:**

- Job 1: **PR Labeling** — workflows #1, 3, 4 merged
- Job 2: **Issue Labeling** — workflow #2
- Job 3: **Scheduled Cleanup** — workflows #6, 8 merged
- Composite Actions: `apply-labels` (T006), `collect-metrics` (T009)
- Error Isolation: Labeling failures do NOT block validation, testing, linting, or quality gates

---

## Validation Workflow Consolidation (12 → 1)

### Phase 4: validation-unified.yml

**Trigger Pattern:** PR events (opened, edited, synchronize) + Manual dispatch

| # | Archived Workflow | File | Logic | Consolidated Into | Notes |
|---|-------------------|------|-------|-------------------|-------|
| 1 | validate-branch-name | `validation/branch-naming.yml` | Check `{type}/{scope}-{title}` format | validation-unified.yml | Rejects claude/, copilot/, openai/ prefixes |
| 2 | validate-pr-template | `validation/pr-template.yml` | Verify correct template routed | validation-unified.yml | Routes by branch prefix |
| 3 | require-changelog | `validation/changelog.yml` | Require CHANGELOG.md entry | validation-unified.yml | Skips for docs PRs |
| 4 | validate-commit-messages | `validation/commit-validation.yml` | Check commit message format | validation-unified.yml | Enforces footer format |
| 5 | secret-scanning-check | `validation/secret-scan.yml` | Scan for exposed secrets | validation-unified.yml | Uses GitHub secret scanning |
| 6 | validate-filenames | `validation/filename-validation.yml` | Check file naming conventions | validation-unified.yml | Rejects invalid patterns |
| 7 | validate-paths | `validation/path-validation.yml` | Verify file paths | validation-unified.yml | Checks against `.github/instructions/` |
| 8 | validate-configs | `validation/config-validation.yml` | Check config file formats | validation-unified.yml | YAML, JSON, TOML validation |
| 9 | validate-spec-files | `validation/spec-validation.yml` | Validate spec structure | validation-unified.yml | Checks frontmatter, structure |
| 10 | validate-schemas | `validation/schema-validation.yml` | Validate against JSON schemas | validation-unified.yml | Label schema, config schema |
| 11 | naming-convention-check | `validation/naming-conventions.yml` | Check naming conventions | validation-unified.yml | Variables, constants, functions |
| 12 | metadata-validation | `validation/metadata-validation.yml` | Validate PR/issue metadata | validation-unified.yml | Checks required fields |

**Consolidation Details:**

- Job 1: **Branch Naming** — workflow #1
- Job 2: **PR Template** — workflow #2
- Job 3: **Changelog** — workflow #3
- Job 4: **Commits** — workflow #4
- Job 5: **Secrets** — workflow #5
- Jobs 6-12: **Config/Spec/Metadata** — workflows #6-12 merged into 2-3 jobs
- Composite Actions: `validate-check` (T007), `collect-metrics` (T009)
- Error Isolation: Validation failures do NOT block testing, linting, or quality gates

---

## Testing Workflow Consolidation (8 → 1)

### Phase 4: testing-unified.yml

**Trigger Pattern:** PR events (opened, synchronize, reopened) + Push to develop/main + Manual dispatch

| # | Archived Workflow | File | Logic | Consolidated Into | Notes |
|---|-------------------|------|-------|-------------------|-------|
| 1 | unit-tests | `testing/unit-tests.yml` | Run npm test (or language equiv) | testing-unified.yml | Parallel with integration/E2E |
| 2 | integration-tests | `testing/integration-tests.yml` | Run integration test suite | testing-unified.yml | Parallel with unit/E2E |
| 3 | e2e-tests | `testing/e2e-tests.yml` | Run E2E test suite | testing-unified.yml | Parallel with unit/integration |
| 4 | test-aggregation | `testing/test-aggregator.yml` | Aggregate test results | testing-unified.yml | Merged into coverage job |
| 5 | coverage-reporter | `testing/coverage-report.yml` | Generate coverage reports | testing-unified.yml | LCOV + HTML output |
| 6 | artifact-collection | `testing/artifact-uploader.yml` | Upload test artifacts | testing-unified.yml | Integrated into each test job |
| 7 | artifact-cleanup | `testing/artifact-cleanup.yml` | Clean old test artifacts | testing-unified.yml | Scheduled weekly |
| 8 | test-metrics | `testing/test-metrics.yml` | Report test performance metrics | testing-unified.yml | Integrated via `collect-metrics` action |

**Consolidation Details:**

- Job 1: **Unit Tests** — workflow #1 + artifact upload
- Job 2: **Integration Tests** — workflow #2 + artifact upload
- Job 3: **E2E Tests** — workflow #3 + artifact upload
- Job 4: **Coverage Aggregation** — workflows #4, 5 merged
- Job 5: **Metrics** — workflow #8
- Composite Actions: `aggregate-tests` (T008), `collect-metrics` (T009)
- Parallelization: All test jobs run in parallel (~120 sec total instead of 300 sec sequential)
- Error Isolation: Test failures block merge BUT do NOT affect other workflow types

---

## Linting Workflow Consolidation (2 → 1)

### Phase 5: linting-unified.yml

**Trigger Pattern:** PR events (opened, edited, synchronize) + Push to develop/main

| # | Archived Workflow | File | Logic | Consolidated Into | Notes |
|---|-------------------|------|-------|-------------------|-------|
| 1 | eslint-check | `linting/eslint.yml` | Run ESLint on JS/TS files | linting-unified.yml | Uses shared `.github/eslint.config.js` |
| 2 | markdownlint-check | `linting/markdownlint.yml` | Run markdownlint on Markdown files | linting-unified.yml | Uses `.markdownlintrc` config |

**Consolidation Details:**

- Job 1: **JS/TS Linting** — workflow #1
- Job 2: **Markdown Linting** — workflow #2
- Composite Actions: `validate-check` (T007), `collect-metrics` (T009)
- Config: Shared ESLint config at `.github/eslint.config.js` (no duplication)
- Error Isolation: Linting failures block merge but do NOT affect validation, testing, or quality gates

---

## Quality Gates Consolidation (5 → 1)

### Phase 6: quality-gates.yml

**Trigger Pattern:** PR events (opened, synchronize) + Push to develop/main + Weekly schedule

| # | Archived Workflow | File | Logic | Consolidated Into | Notes |
|---|-------------------|------|-------|-------------------|-------|
| 1 | codeql-analysis | `utilities/security/codeql.yml` | Run CodeQL SAST scanning | quality-gates.yml | Reports findings to PR |
| 2 | dependency-check | `utilities/security/dependencies.yml` | Scan npm dependencies | quality-gates.yml | npm audit for vulnerabilities |
| 3 | license-compliance | `utilities/compliance/licenses.yml` | Check license allowlist | quality-gates.yml | Rejects prohibited licenses |
| 4 | code-quality-metrics | `utilities/quality/metrics.yml` | Collect complexity/debt metrics | quality-gates.yml | Reports maintainability index |
| 5 | security-policy | `utilities/security/policy.yml` | Validate SECURITY.md exists | quality-gates.yml | Checks security headers |

**Consolidation Details:**

- Job 1: **SAST Scanning** — workflow #1
- Job 2: **Dependency Scanning** — workflow #2
- Job 3: **License Compliance** — workflow #3
- Job 4: **Code Quality Metrics** — workflow #4
- Job 5: **Security Policy** — workflow #5
- Composite Actions: `validate-check` (T007), `collect-metrics` (T009)
- Error Isolation: Security/quality failures may block merge but do NOT affect labeling, validation, testing, or linting

---

## Trigger Pattern Consolidation

### Before Phase 2 (36 archived workflows)

```
36 separate YAML files
36 separate trigger definitions
Duplicate logic across workflows
36 separate error handling approaches
36 separate metrics collections
Workflow interdependencies unclear
```

### After Phase 2 (5 unified workflows)

```
5 unified YAML files
Clear trigger boundaries per workflow type
Consolidated logic per category
Unified error handling per workflow
Centralized metrics collection via composite actions
Clear error isolation boundaries
```

---

## Performance Targets

### Baseline (Phase 1 Archived)

- Total: 2,500 minutes/month
- Per Category:
  - Labeling: 450 min (18%)
  - Validation: 600 min (24%)
  - Testing: 1,000 min (40%)
  - Linting: 150 min (6%)
  - Quality: 300 min (12%)

### Phase 2 Targets (Unified)

- Total: ≤2,125 minutes/month (≥15% reduction)
- Per Workflow:
  - labeling-unified.yml: ≤315 min (30% savings from consolidation)
  - validation-unified.yml: ≤420 min (30% savings)
  - testing-unified.yml: ≤700 min (30% savings + parallelization)
  - linting-unified.yml: ≤105 min (30% savings)
  - quality-gates.yml: ≤210 min (30% savings)
  - **Total: 1,750 min (30% overall reduction)**

---

## Validation Checklist

After Phase 2 deployment, validate:

- [ ] All 36 archived workflows archived (moved to `.github/workflows/archived/2026-09-11/`)
- [ ] All 5 unified workflows active (in `.github/workflows/`)
- [ ] No duplicate workflow files remaining
- [ ] All unified workflows trigger correctly on expected events
- [ ] Composite actions used consistently across all workflows
- [ ] Error isolation validated (one workflow failure doesn't cascade)
- [ ] Metrics collection working for all 5 workflows
- [ ] GitHub Actions minutes ≤2,125/month (≥15% reduction confirmed)
- [ ] Rollback procedure tested and documented
- [ ] Operations runbook complete

---

## References

- **Data Model:** `.github/specs/011-workflow-consolidation-phase-2/data-model.md`
- **Workflow Contracts:** `.github/specs/011-workflow-consolidation-phase-2/contracts/workflow-interfaces.md`
- **Composite Actions:** `.github/specs/011-workflow-consolidation-phase-2/contracts/composite-action-contracts.md`
- **Baseline Metrics:** `.github/docs/BASELINE_METRICS.md`
- **Rollback Procedure:** `.github/docs/PHASE2_ROLLBACK.md`
- **Archived Workflows:** `.github/workflows/archived/2026-09-11/`

---

**Last Updated:** 2026-09-17  
**Next Update:** After Phase 2 deployment completion  
**Owner:** @ashley / Engineering Team

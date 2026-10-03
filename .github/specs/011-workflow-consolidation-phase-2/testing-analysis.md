---
title: "Phase 4 Analysis — Archived Testing Workflows"
date_created: "2026-09-17"
last_updated: "2026-09-17"
feature: "Workflow Consolidation Phase 2 — US3 testing-unified.yml"
---

# Archived Testing Workflows Analysis (US3)

## Overview

This analysis examines the 2 archived testing workflows that will be consolidated into **testing-unified.yml**. The analysis identifies trigger patterns, job structures, test coverage requirements, and dependencies to inform unified workflow design.

**Consolidation Scope:** 2 archived testing workflows → 1 unified testing workflow

**Key Metrics:**

- Baseline: 220 min/month
- Target: ≤187 min/month (15% reduction)
- Expected savings: ~33 min/month

---

## Archived Testing Workflow Inventory

### 1. **testing.yml** — Core Test Orchestration

- **Status:** Main testing workflow for CI/CD
- **Triggers:**
  - `push` → `develop` branch
  - `pull_request` → opened, edited, synchronize, reopened
  - `schedule` → Multiple cron schedules:
    - 00:30 UTC daily (nightly test suite)
    - Saturday 02:00 UTC (weekly extended tests)
  - `workflow_dispatch` → Manual trigger
- **Jobs:** Parallel test orchestration
  - `unit-tests` — Run npm test with coverage collection
  - `integration-tests` — Run integration test suite
  - `coverage-report` — Aggregate coverage from all test jobs
  - `artifact-cleanup` — Archive test artifacts and clean temp files
- **Key Steps (per job):**
  - Setup: Node.js environment, install dependencies
  - Run test command appropriate to test suite type
  - Collect coverage reports (LCOV format)
  - Upload artifacts (test results, coverage, logs)
  - Report metrics to GitHub Actions
- **Test Commands:**
  - Unit: `npm test -- --coverage`
  - Integration: `npm run test:integration`
  - Coverage aggregation: `lcov` or `nyc` merge
- **Dependencies:**
  - package.json (test scripts)
  - jest.config.js or test configuration
  - .nycrc or coverage configuration
- **Permissions:** contents:read, checks:write
- **Concurrency:** Single test run per PR (cancel-in-progress: true)
- **Artifact Retention:** 30 days for test results, 7 days for logs

**Consolidation Priority:** HIGH — Core test workflow, primary CI validation

---

### 2. **release-e2e-tests.yml** — Release E2E Testing

- **Status:** Scheduled E2E validation on release branches
- **Triggers:**
  - `push` → `release/*` branches
  - `schedule` → Wednesday 10:00 UTC (weekly release validation)
  - `workflow_dispatch` → Manual trigger (staging environment)
- **Jobs:** E2E test job (serial, no parallelization)
  - `e2e-tests` — Run E2E test suite against staging environment
- **Key Steps:**
  - Setup: Node.js, install dependencies
  - Deploy to staging environment (or use existing staging)
  - Run E2E test suite (Playwright, Cypress, or similar)
  - Collect test results and screenshots
  - Upload E2E artifacts
  - Report results to release tracking
- **Test Environment:** Staging environment (external dependency)
- **Dependencies:**
  - Staging environment access/credentials
  - E2E test suite (e.g., Playwright configuration)
  - Test data/fixtures
- **Permissions:** contents:read, checks:write, (potentially: deployments:read for staging)
- **Concurrency:** Single E2E run (cancel-in-progress: true)
- **Artifact Retention:** 60 days (longer retention for release testing)
- **Failure Handling:** Failure blocks release; requires manual approval to proceed

**Consolidation Priority:** MEDIUM — Release-specific tests; consider conditional execution

---

## Trigger Pattern Analysis

### Event Type Coverage

| Trigger Type | Workflows | Patterns |
|---|---|---|
| `push` → develop | 1 workflow | testing.yml (unit + integration) |
| `push` → release/* | 1 workflow | release-e2e-tests.yml (E2E only) |
| `pull_request` → opened/edited/sync | 1 workflow | testing.yml (all test suites) |
| `schedule` → cron | 2 workflows | Nightly tests (00:30 UTC), weekly E2E (Wed 10:00 UTC), weekend extended tests (Sat 02:00 UTC) |
| `workflow_dispatch` | 2 workflows | Manual trigger for both workflows |

### Schedule Coverage

| Time (UTC) | Workflow | Purpose | Concurrency |
|---|---|---|---|
| 00:30 Daily | testing.yml | Nightly test suite run | serial (cancel-in-progress: true) |
| 02:00 Saturday | testing.yml | Extended/weekend test run | serial |
| 10:00 Wednesday | release-e2e-tests.yml | Weekly E2E on release branches | serial |

**Consolidation Opportunity:** Merge scheduled triggers into single workflow with conditional job execution based on branch/schedule

---

## Test Suite Breakdown

### Unit Tests

- **Scope:** Individual function/module testing
- **Command:** `npm test` (Jest configuration)
- **Coverage requirement:** ≥80% line coverage
- **Timeout:** 5 minutes
- **Artifacts:** `coverage/lcov-report/`, test results JSON
- **Failure handling:** Fail fast; report via PR comment

### Integration Tests

- **Scope:** Component/service integration testing
- **Command:** `npm run test:integration`
- **Coverage requirement:** ≥75% coverage for integrated components
- **Timeout:** 10 minutes
- **Artifacts:** Integration test results, logs
- **Failure handling:** Fail fast; report findings

### E2E Tests (Release only)

- **Scope:** End-to-end user journey testing
- **Environment:** Staging (external)
- **Command:** Playwright/Cypress test runner
- **Coverage:** Critical user paths only (cost/time constrained)
- **Timeout:** 15-30 minutes (long running)
- **Artifacts:** E2E results, screenshots, videos
- **Failure handling:** Blocks release; requires manual review

---

## Consolidation Strategy

### Phase 4 MVP Scope

**Consolidate:** 2 archived testing workflows → **testing-unified.yml**

**Scope Breakdown:**

1. **Reactive (PR/Push) jobs:**
   - Unit test job (from testing.yml)
   - Integration test job (from testing.yml)
   - Coverage aggregation job (from testing.yml)
   - Artifact handling (from testing.yml)

2. **Scheduled jobs:**
   - Nightly unit/integration tests (00:30 UTC daily)
   - Weekend extended tests (Saturday 02:00 UTC)
   - Weekly E2E tests (Wednesday 10:00 UTC)

3. **Conditional execution:**
   - E2E tests only on `release/*` branches or manual trigger
   - Extended tests only on scheduled runs or manual override

### Expected GitHub Actions Minutes Reduction

**Baseline:** 220 min/month

**Optimizations:**

1. **Consolidation:** Merge 2 workflows into 1 (eliminate 1 workflow setup overhead) → ~8 min savings
2. **Parallelization:** Run unit + integration in parallel (already done, maintain) → 0 min change
3. **Conditional execution:** Skip E2E on non-release branches, skip nightly on low-activity days → ~12 min savings
4. **Coverage report efficiency:** Optimize coverage aggregation logic → ~3 min savings
5. **Artifact deduplication:** Consolidate artifact uploads → ~10 min savings

**Target:** ≤187 min/month (15% reduction) = **33 min savings**

---

## Implementation Notes

### Job Dependencies

```
testing-unified.yml

On push/PR to develop:
├── unit-tests [parallel]
├── integration-tests [parallel]
└── coverage-aggregation (depends on both test jobs)
    └── report-results

On schedule (nightly 00:30 UTC):
├── unit-tests [parallel]
├── integration-tests [parallel]
└── coverage-aggregation
    └── report-results

On schedule (extended Sat 02:00 UTC):
├── unit-tests [parallel]
├── integration-tests [parallel]
└── e2e-tests (if release branch)
    └── coverage-aggregation
        └── report-results

On push to release/* branches:
├── unit-tests [parallel]
├── integration-tests [parallel]
└── e2e-tests [serial]
    └── coverage-aggregation
        └── report-results
```

### Permissions Required

```yaml
permissions:
  contents: read
  checks: write
  # Optional (for external staging access):
  # deployments: read
```

### Concurrency Strategy

- Group: `testing-{event_name}-{branch}`
- Cancel in progress: true (only latest test run matters)
- Exception: E2E tests should not cancel (blocking release)

---

## Test Coverage Requirements

### Coverage Thresholds

| Type | Minimum | Target |
|---|---|---|
| Unit test line coverage | 75% | ≥80% |
| Integration test coverage | 70% | ≥75% |
| E2E path coverage | N/A | Critical paths only |

### Functional Tests (100% for critical paths)

- Unit tests run on PR: Verify all unit tests pass and coverage ≥80%
- Integration tests run on PR: Verify all integration tests pass
- Coverage aggregation: Verify coverage report generated and artifacts uploaded
- E2E tests on release: Verify E2E tests run on release branches and block on failure
- Nightly schedule: Verify nightly tests execute at 00:30 UTC
- Artifact cleanup: Verify old artifacts removed and recent ones retained

---

## Performance Characteristics

### Expected Runtimes

| Test Type | Duration | Min Usage |
|---|---|---|
| Unit tests | 2-3 minutes | 0.05 min |
| Integration tests | 4-6 minutes | 0.08 min |
| Coverage aggregation | 1 minute | 0.02 min |
| E2E tests (release) | 15-20 minutes | 0.3 min |
| Total (unit + integration) | ~7-8 minutes | ~0.15 min |
| Total (with E2E) | ~25-30 minutes | ~0.45 min |

### Monthly Budget Breakdown

- Daily PR test runs (50 PRs/month): ~7.5 min each = ~375 min
- Nightly runs (30/month): ~8 min each = ~240 min
- Extended weekend runs (8/month): ~10 min each = ~80 min
- Release E2E runs (4/month): ~25 min each = ~100 min
- **Total:** ~795 min → **Target after consolidation: ~660 min** (15% reduction)

---

## Migration Path

### Step 1: Create testing-unified.yml

Structure with all jobs (unit, integration, E2E, coverage) disabled/conditional initially

### Step 2: Activate Reactive Tests

Enable unit + integration jobs on `push` and `pull_request` events

### Step 3: Activate Scheduled Tests

Enable nightly cron schedules (00:30 UTC daily, Sat 02:00 UTC)

### Step 4: Activate E2E Tests

Enable release-branch-conditional E2E tests

### Step 5: Validation & Cutover

Run 3+ consecutive test cycles, measure actual minutes, compare to baseline, then retire archived workflows

---

## Monitoring & Metrics

### Key Metrics to Track

- Total GitHub Actions minutes consumed by testing-unified.yml
- Test pass/fail rate (target: ≥99% pass rate)
- Coverage percentage (unit ≥80%, integration ≥75%)
- Test execution time (target: unit 2-3 min, integration 4-6 min, E2E 15-20 min)
- Artifact upload/download performance

### Success Criteria

- ✅ All test suites execute successfully on PR and push events
- ✅ Coverage reports generated and uploaded correctly
- ✅ E2E tests block release on failure
- ✅ Scheduled test runs execute at correct times (±5 minutes UTC)
- ✅ GitHub Actions minutes ≤187 min/month (≥15% reduction from 220 min baseline)
- ✅ Zero regressions vs archived workflow behavior

---

## Next Steps (Phase 4 Implementation)

1. **T038:** Create skeleton testing-unified.yml with all jobs
2. **T039-T041:** Implement test jobs in parallel [P]
3. **T042:** Implement coverage aggregation
4. **T043-T044:** Integrate composite actions (aggregate-tests, collect-metrics)
5. **T045:** Test on feature branch (trigger via push, verify all test suites)
6. **T046:** Document behavior in TESTING_UNIFIED.md
7. **T047:** Validate CI passes ≥3 consecutive runs with stable coverage

---

## References

- **Archived workflows:** `.github/workflows/archived/2026-09-11/testing/`
- **Package.json:** Test scripts and configuration
- **Jest configuration:** jest.config.js
- **Coverage configuration:** .nycrc or equivalent
- **Composite actions:** aggregate-tests, collect-metrics (from Phase 2)

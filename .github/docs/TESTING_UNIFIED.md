---
title: "Testing Unified Workflow"
description: "Consolidated unit, integration, and E2E test orchestration for the LightSpeed .github repository"
date_created: "2026-09-17"
last_updated: "2026-09-17"
---

# Testing Unified • Unit, Integration & E2E

**File:** `.github/workflows/testing-unified.yml`  
**Status:** Phase 4 Implementation  
**Consolidates:** 2 archived testing workflows  
**Performance Target:** ≤187 min/month (15% reduction)

---

## Overview

`testing-unified.yml` is a consolidated GitHub Actions workflow that replaces 2 separate archived testing workflows (testing.yml and release-e2e-tests.yml) with a single, unified test orchestration engine. It provides comprehensive testing across multiple Node.js versions with conditional execution based on event type and branch.

### Key Features

- **Multi-version testing:** Unit tests on Node 18 and 20
- **Parallel test execution:** Unit and integration tests run simultaneously
- **Coverage validation:** Enforces 80% line coverage threshold
- **E2E tests:** Release-only end-to-end testing on staging environment
- **Coverage aggregation:** Merges coverage from all test jobs
- **Metrics collection:** GitHub Actions minutes and performance tracking
- **Artifact management:** Organized test results, coverage, and screenshots

---

## Trigger Patterns

| Event | Conditions | Jobs Triggered |
|-------|-----------|-----------------|
| `push` | develop branch | test-context, unit-tests (both versions), integration-tests, coverage-aggregation |
| `push` | release/* branches | test-context, unit-tests, integration-tests, e2e-tests, coverage-aggregation |
| `pull_request` | develop branch, opened/edited/sync/reopened | test-context, unit-tests, integration-tests, coverage-aggregation |
| `schedule` | 00:30 UTC daily | Nightly full test suite |
| `schedule` | 02:00 UTC Saturday | Extended weekend testing |
| `schedule` | 10:00 UTC Wednesday | Weekly E2E on release branches |
| `workflow_dispatch` | Manual trigger with test_suite parameter | Conditional tests based on input |

---

## Test Execution Flow

```
test-context (determine which tests to run)
  ├─ run-unit: true/false (based on trigger)
  ├─ run-integration: true/false
  └─ run-e2e: true/false (release branches or Wed 10:00 UTC only)
    ↓
Parallel Execution:
  ├─ unit-tests [Node 18]
  ├─ unit-tests [Node 20]
  └─ integration-tests
    ↓
coverage-aggregation (merge unit coverage from both versions)
    ↓
E2E Tests (if run-e2e=true)
    ↓
testing-metrics (aggregate results and collect metrics)
    ↓
artifact-cleanup
    ↓
test-summary (final status reporting)
```

---

## Test Jobs Reference

### Test Context Determination

**Job:** `test-context`  
**Triggers:** All (setup job, runs first)  
**Status:** ✅ Implemented (skeleton)

Determines which test suites to run based on trigger event type and branch.

**Decision Logic:**

```bash
# Default: Unit + Integration
RUN_UNIT=true
RUN_INTEGRATION=true
RUN_E2E=false

# E2E on release branches
if branch matches "release/*":
  RUN_E2E=true

# E2E on Wednesday 10:00 UTC scheduled run
if schedule == "0 10 * * 3":
  RUN_E2E=true

# workflow_dispatch override
if workflow_dispatch:
  Use input.test_suite parameter
  (all, unit, integration, e2e)
```

**Outputs:**

- run-unit: true/false
- run-integration: true/false
- run-e2e: true/false

---

### Unit Tests

**Job:** `unit-tests`  
**Triggers:** Conditional (RUN_UNIT=true)  
**Status:** ✅ Implemented (T039)  
**Matrix:** Node.js versions 18, 20

Runs unit tests on multiple Node.js versions with mandatory coverage validation.

**Execution:**

1. **Setup (per version):**
   - Checkout code
   - Setup Node.js [18|20]
   - Cache npm dependencies
   - Install with npm ci

2. **Test Execution:**

   ```bash
   npm test -- --coverage
   ```

3. **Coverage Validation:**
   - Parse coverage-summary.json
   - Extract lines, branches, functions, statements coverage
   - Enforce minimum 80% line coverage
   - Fail if coverage < 80%

4. **Artifact Upload:**
   - Upload coverage/ directory
   - Name: coverage-unit-node-[18|20]
   - Retention: 7 days

**Coverage Requirements:**

| Metric | Minimum | Target |
|--------|---------|--------|
| Lines | 75% | ≥80% |
| Branches | 70% | ≥75% |
| Functions | 75% | ≥80% |
| Statements | 75% | ≥80% |

**Expected Runtime:** 2-3 minutes per version  
**GitHub Actions Minutes:** ~0.05-0.08 per run

**Failure Remediation:**

If coverage is below 80%:

1. **Identify missing coverage:**

   ```bash
   # Open coverage/lcov-report/index.html locally
   npm test -- --coverage
   ```

2. **Add tests for uncovered code:**
   - Write unit tests for functions/branches with no coverage
   - Aim for line coverage >85% to buffer for complexity variations

3. **Push updated tests:**

   ```bash
   git add src/ __tests__/ coverage/
   git commit -m "test: improve coverage to meet 80% threshold"
   git push
   ```

---

### Integration Tests

**Job:** `integration-tests`  
**Triggers:** Conditional (RUN_INTEGRATION=true)  
**Status:** ✅ Implemented (T040)  
**Single Version:** Node.js 18

Runs integration test suite validating component/service interactions.

**Execution:**

1. **Setup:**
   - Checkout code (full history for git diff)
   - Setup Node.js 18
   - Cache npm dependencies
   - Install with npm ci

2. **Test Execution:**

   ```bash
   npm run test:integration
   ```

3. **Result Validation:**
   - Parse test-results/integration-summary.json
   - Extract total, passed, failed counts
   - Calculate pass rate percentage
   - Report detailed metrics

4. **Fallback Parsing:**
   - If JSON report unavailable, parse log output
   - Look for PASS/FAIL indicators
   - Fail if failures detected

5. **Artifact Upload:**
   - Upload test-results/ directory (30-day retention)
   - Upload integration-test.log (7-day retention)

**Expected Runtime:** 4-6 minutes  
**GitHub Actions Minutes:** ~0.08-0.10 per run

**Test Results Format (JSON):**

```json
{
  "total": 45,
  "passed": 44,
  "failed": 1,
  "skipped": 0,
  "duration_ms": 12345
}
```

**Failure Remediation:**

If integration tests fail:

1. **Review failure details in artifacts:**
   - Download integration-test-results artifact
   - Review integration-test-logs artifact

2. **Identify root cause:**
   - Check for external service dependencies
   - Verify test data/fixtures are properly initialized
   - Look for race conditions or timing issues

3. **Fix and retry:**

   ```bash
   npm run test:integration -- --testNamePattern="failing test"
   # Fix the issue locally
   git commit -m "test: fix failing integration test"
   git push
   ```

---

### E2E Tests

**Job:** `e2e-tests`  
**Triggers:** Conditional (RUN_E2E=true)  
**Status:** ✅ Implemented (T041)  
**Environment:** Staging  
**Timeout:** 30 minutes

Runs end-to-end tests against staging environment validating critical user journeys.

**Execution:**

1. **Setup:**
   - Checkout code
   - Setup Node.js 18
   - Cache npm dependencies
   - Install with npm ci

2. **Detect E2E test script:**
   - Check if "test:e2e" script exists in package.json
   - Skip if not available (no failure)

3. **Test Execution:**

   ```bash
   npm run test:e2e -- --reporter=json --outputFile=e2e-results/report.json
   ```

4. **Result Validation:**
   - Parse e2e-results/report.json
   - Extract test stats (total, passed, failed, duration)
   - On non-release branches: Report failures informational only
   - On release branches: Fail workflow on E2E failures

5. **Artifact Upload:**
   - Test results: 30-day retention
   - Screenshots (on failure): 7-day retention

**Test Report Format (Playwright/Mocha):**

```json
{
  "stats": {
    "tests": 12,
    "passes": 11,
    "failures": 1,
    "duration": 45000
  }
}
```

**Expected Runtime:** 15-20 minutes  
**GitHub Actions Minutes:** ~0.25-0.35 per run

**Failure Handling:**

| Scenario | Behavior |
|----------|----------|
| E2E fails on PR to develop | ℹ️ Report failure (informational) |
| E2E fails on release/* branch | ❌ Fail workflow (blocks release) |
| E2E fails on schedule | ⚠️ Report but don't block (ops-only) |

**Failure Remediation (Release Branches):**

If E2E tests fail on release branch:

1. **Critical:** Do not merge to main
2. **Investigate:**
   - Check staging environment health
   - Review E2E logs for specific failures
   - Verify test data/fixtures are current

3. **Fix options:**
   - **Code issue:** Fix code, push to release branch, re-run
   - **Test issue:** Fix test expectations, push to release branch
   - **Environment issue:** Notify ops team, restore/redeploy staging
   - **Flake:** Re-run E2E tests manually via workflow_dispatch

---

### Coverage Aggregation

**Job:** `coverage-aggregation`  
**Triggers:** After unit-tests and integration-tests  
**Status:** ⏳ Needs enhancement (T042)

Merges coverage reports from both Node.js versions and calculates overall coverage.

**Current Implementation:**

- Downloads all coverage artifacts
- Scans for coverage-summary.json files
- Reports artifacts found

**Planned Enhancement (T042):**

- Merge LCOV coverage files from both Node versions
- Calculate weighted average coverage
- Generate HTML coverage report
- Enforce 80% combined coverage
- Upload aggregated report artifact

---

### Testing Metrics

**Job:** `testing-metrics`  
**Triggers:** After core test jobs  
**Status:** ✅ Implemented (T043-T044)

Aggregates test results and collects performance metrics.

**Composite Actions Integration:**

1. **aggregate-tests (T043):**
   - Inputs: test_results_path, coverage_path
   - Merges all test results into single report
   - Outputs: aggregated_tests, test_count, pass_rate

2. **collect-metrics (T044):**
   - Inputs: workflow_name, metric_type (all)
   - Outputs: minutes_used, duration_seconds, metrics_json
   - Tracks GitHub Actions minute consumption

**Artifact Upload:**

- Name: testing-metrics
- Paths: test-results/, coverage/, metrics/
- Retention: 30 days

---

### Artifact Cleanup

**Job:** `artifact-cleanup`  
**Triggers:** After coverage-aggregation and e2e-tests  
**Status:** ✅ Skeleton (placeholder)

Placeholder for cleanup logic to remove old test artifacts.

**Planned Implementation:**

- Query artifacts older than 30 days
- Delete old test result artifacts
- Retain recent coverage reports for trends
- Report cleanup summary

---

### Test Summary

**Job:** `test-summary`  
**Triggers:** Final job (depends on all test jobs)  
**Status:** ✅ Implemented

Generates comprehensive test run summary and enforces pass/fail criteria.

**Summary Includes:**

- Unit test results (both versions)
- Integration test results
- E2E test results
- Coverage aggregation status
- Metrics collection status

**Failure Criteria:**

- ❌ Workflow fails if: unit-tests = failure OR integration-tests = failure
- ℹ️ E2E failures don't block (informational)
- ℹ️ Metrics collection failures don't block

**Success Message:**

```
Test run summary:
Unit tests: success
Integration tests: success
E2E tests: (success|neutral|skipped)
Coverage aggregation: success
Metrics collection: success

✅ Test suite completed
```

---

## Coverage Requirements

### Line Coverage Enforcement

**Minimum:** 80%  
**Per Version:** Both Node 18 and 20 must meet threshold

**Metrics Tracked:**

- Lines: % of executable lines covered
- Branches: % of conditional branches covered
- Functions: % of functions called
- Statements: % of statements executed

### Coverage Trends

Track coverage trends across PR merges:

1. **If coverage increases:** ✅ Good! Keep writing tests.
2. **If coverage maintains:** ✅ Acceptable. Monitor closely.
3. **If coverage decreases:** ⚠️ Investigate. May need more tests for new code.

---

## Performance Characteristics

### Expected Runtimes

| Test Type | Duration | Minutes |
|-----------|----------|---------|
| Unit tests (1 version) | 2-3 min | 0.05 min |
| Unit tests (2 versions in parallel) | 2-3 min total | ~0.08-0.10 min |
| Integration tests | 4-6 min | 0.08-0.10 min |
| E2E tests | 15-20 min | 0.25-0.35 min |
| Coverage aggregation | 1-2 min | 0.02 min |
| Total (unit + integration) | ~6-7 min | ~0.15-0.18 min |
| Total (with E2E) | ~25-30 min | ~0.4-0.5 min |

### Monthly Budget: ≤187 min/month

**Estimated breakdown:**

- **PR runs (50/month @ 2 min):** 100 min
- **Nightly runs (30/month @ 8 min):** 240 min
- **Weekend runs (8/month @ 10 min):** 80 min
- **E2E runs (4/month @ 25 min):** 100 min
- **Total estimated:** 520 min

**Target:** 15% reduction = 660 min baseline → ≤187 min unified (55% reduction from 220 baseline, ~15% from overall 2,500 baseline)

---

## Troubleshooting Guide

### Unit tests fail on one Node version but pass on another

**Symptom:** Tests pass on Node 18 but fail on Node 20 (or vice versa)

**Causes:**

1. Version-specific API differences
2. Different dependency versions
3. Timing-sensitive code (race conditions)

**Solution:**

1. Install Node 20 locally: `nvm install 20; nvm use 20`
2. Reproduce failure: `npm test`
3. Debug and fix version compatibility issue
4. Test on both versions before pushing

---

### Coverage is below 80% threshold

**Symptom:** "Coverage below threshold (72% < 80%)"

**Causes:**

1. New code without test coverage
2. Error handling paths not tested
3. Conditional branches uncovered

**Solution:**

1. Review coverage report: Open `coverage-unit-node-18/index.html`
2. Identify uncovered files/lines (highlighted in red)
3. Write tests for uncovered code
4. Push updated tests

---

### Integration tests timeout or hang

**Symptom:** "integration-tests job timed out after 60 minutes"

**Causes:**

1. External service dependency (database, API) not responding
2. Test fixture setup hanging
3. Infinite loop in test code

**Solution:**

1. Check test environment/staging service health
2. Add timeouts to integration tests
3. Mock external services that are unavailable
4. Use --bail flag to stop on first failure: `npm run test:integration -- --bail`

---

### E2E tests fail on release branch (blocking merge)

**Symptom:** "❌ E2E tests failed (3 failures)" on release/v1.2.0 branch

**Causes:**

1. Staging environment issue
2. Real E2E test failure (code broke feature)
3. Test is flaky

**Solution:**

1. **Check staging health:** Are other E2E tests passing? Ask ops team.
2. **Review failure details:** Download E2E screenshots/logs from artifacts
3. **Fix or skip:**
   - If code bug: Fix and re-run
   - If flaky: Re-run with `workflow_dispatch` (single re-run)
   - If environment: Notify ops, they'll fix staging

**Note:** E2E failures BLOCK release merges. Resolve before merging to main.

---

## Configuration Files

### package.json Test Scripts

Required scripts for workflow execution:

```json
{
  "scripts": {
    "test": "jest",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "playwright test"
  }
}
```

### Jest Configuration (jest.config.js)

```javascript
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json-summary', 'lcov', 'text'],
  coverageThreshold: {
    global: {
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80
    }
  }
};
```

### Playwright Configuration (playwright.config.ts)

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'https://staging.example.com',
    screenshot: 'only-on-failure',
  },
  reporter: 'json'
});
```

---

## Related Documentation

- [Composite Actions Reference](./COMPOSITE_ACTIONS.md)
- [Performance Targets](./PERFORMANCE_TARGETS.md)
- [Workflow Consolidation Mapping](./WORKFLOW_CONSOLIDATION_MAPPING.md)

---

## Archive Reference

**Consolidated workflows:**

- testing.yml (unit + integration + coverage)
- release-e2e-tests.yml (E2E validation)

**Archive location:** `.github/workflows/archived/2026-09-11/testing/`

---

*Last updated: 2026-09-17 | Phase 4 Implementation | Status: Composite actions integrated, ready for CI validation*

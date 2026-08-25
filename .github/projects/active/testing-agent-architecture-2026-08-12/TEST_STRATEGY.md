# Test Strategy — Testing Agent Architecture

## Overview

This document defines comprehensive testing for the multi-framework testing agent consolidation, including unit, integration, and end-to-end (E2E) tests.

**Coverage Targets:**

- Unit Tests: 80%+ of code
- Integration Tests: 50%+ of workflows
- E2E Tests: 70%+ critical path

---

## Test Pyramid

```
┌─────────────────────────────────┐
│  E2E Tests (Slow)               │
│  - Real block plugin/theme repos│
│  - Real WordPress sites         │
│  - GitHub Actions workflows     │
│  Target: 5-8 tests, 70% coverage│
└─────────────────────────────────┘
        △
        │
┌─────────────────────────────────┐
│ Integration Tests (Medium)      │
│ - Agent coordination            │
│ - Multi-framework scenarios     │
│ - Provider switching            │
│ Target: 15-20 tests, 50% coverage
└─────────────────────────────────┘
        △
        │
┌─────────────────────────────────┐
│ Unit Tests (Fast)               │
│ - Individual skills             │
│ - Framework patterns            │
│ - Selection logic               │
│ Target: 40-50 tests, 80% coverage
└─────────────────────────────────┘
```

---

## Unit Tests (Phase 4.1)

### Jest Skill Unit Tests (2-3 tests)

**Test File:** `agents/testing-agent/skills/jest-wordpress-testing/__tests__/jest-skill.test.ts`

#### 1.1: REST API Mocking Patterns

```
✓ Mocks @wordpress/api-fetch correctly
✓ Handles async data fetching
✓ Throws on API errors
✓ Retries on timeout
```

#### 1.2: Block Utilities Testing

```
✓ Tests WordPress block registration
✓ Tests block attributes validation
✓ Tests block save/render
✓ Tests block deprecations
```

#### 1.3: Action/Filter Testing

```
✓ Tests WordPress action hooks
✓ Tests WordPress filter hooks
✓ Tests hook execution order
✓ Tests hook removal
```

#### 1.4: Framework Selection

```
✓ Detects Jest from package.json
✓ Selects correct WordPress mocking
✓ Fails gracefully on missing Jest
```

**Coverage Target:** 85%+  
**Jest Command:**

```bash
npm test -- --testPathPattern=jest-skill --coverage
```

---

### PHPUnit Skill Unit Tests (2-3 tests)

**Test File:** `agents/testing-agent/skills/phpunit-wordpress-testing/__tests__/phpunit-skill.test.ts`

#### 2.1: WordPress Globals Mocking

```
✓ Mocks get_option() correctly
✓ Mocks apply_filters() correctly
✓ Mocks do_action() correctly
✓ Resets globals between tests
```

#### 2.2: Database Operation Mocking

```
✓ Mocks wpdb->get_results()
✓ Mocks wpdb->insert()
✓ Mocks wpdb->update()
✓ Mocks wpdb->delete()
```

#### 2.3: WPCS Validation

```
✓ Validates WordPress Coding Standards
✓ Detects naming convention issues
✓ Detects security issues
✓ Reports violations with line numbers
```

#### 2.4: Multi-Version Testing

```
✓ Tests against multiple WordPress versions
✓ Tests against multiple PHP versions
✓ Skips unsupported combinations
✓ Reports version-specific failures
```

**Coverage Target:** 85%+  
**Jest Command:**

```bash
npm test -- --testPathPattern=phpunit-skill --coverage
```

---

### pytest Skill Unit Tests (2-3 tests)

**Test File:** `agents/testing-agent/skills/pytest-ci-testing/__tests__/pytest-skill.test.ts`

#### 3.1: GitHub Actions Integration

```
✓ Parses GitHub Actions environment
✓ Reads artifacts from CI
✓ Generates test reports
✓ Sets output variables
```

#### 3.2: CI Artifact Handling

```
✓ Reads log files from artifacts
✓ Parses test output formats
✓ Extracts coverage reports
✓ Handles missing artifacts gracefully
```

#### 3.3: Log Parsing & Analysis

```
✓ Parses pytest output
✓ Extracts test results
✓ Finds failure causes
✓ Generates summaries
```

#### 3.4: Metrics Generation

```
✓ Calculates pass/fail rates
✓ Extracts coverage percentages
✓ Generates trend data
✓ Formats metrics for storage
```

**Coverage Target:** 75%+  
**Jest Command:**

```bash
npm test -- --testPathPattern=pytest-skill --coverage
```

---

### Playwright Skill Unit Tests (2-3 tests)

**Test File:** `agents/testing-agent/skills/playwright-testing/__tests__/playwright-skill.test.ts`

#### 4.1: Multi-Browser Testing Setup

```
✓ Configures Chrome browser
✓ Configures Firefox browser
✓ Configures Safari browser
✓ Configures Edge browser
```

#### 4.2: Accessibility Validation

```
✓ Runs axe accessibility tests
✓ Detects WCAG 2.2 AA violations
✓ Generates accessibility reports
✓ Handles iframes in accessibility checks
```

#### 4.3: WordPress Stateful Testing

```
✓ Logs in to WordPress
✓ Creates posts/pages
✓ Edits post content
✓ Deletes content
✓ Handles authentication state
```

#### 4.4: WooCommerce Patterns

```
✓ Tests product catalog page
✓ Tests shopping cart
✓ Tests checkout flow
✓ Tests order confirmation
```

**Coverage Target:** 80%+  
**Jest Command:**

```bash
npm test -- --testPathPattern=playwright-skill --coverage
```

---

### Control-Plane Coordination Unit Tests (1-2 tests)

**Test File:** `agents/testing-agent/__tests__/coordination.test.ts`

#### 5.1: Delegation Protocol

```
✓ Routes to correct portable agent
✓ Passes framework parameters
✓ Receives results correctly
✓ Handles errors from portable agent
```

#### 5.2: Framework Selection Logic

```
✓ Detects Jest projects
✓ Detects PHPUnit projects
✓ Detects pytest projects
✓ Detects Playwright projects
✓ Handles multi-framework projects
```

**Coverage Target:** 85%+  
**Jest Command:**

```bash
npm test -- --testPathPattern=coordination --coverage
```

---

### Unit Test Summary

| Skill | Tests | Coverage | Effort |
|-------|-------|----------|--------|
| Jest | 10 | 85% | 1h |
| PHPUnit | 10 | 85% | 1h |
| pytest | 9 | 75% | 0.75h |
| Playwright | 10 | 80% | 0.75h |
| Coordination | 5 | 85% | 0.5h |
| **Total** | **44** | **82%** | **4h** |

**Phase 4.1 Target:** 2-3 hours (40-50 tests, 80%+ coverage)

---

## Integration Tests (Phase 4.2)

### Jest + Control-Plane Coordination (2 tests)

**Test File:** `agents/testing-agent/__tests__/integration-jest.test.ts`

#### 1.1: Jest Workflow Coordination

```
✓ Control-plane detects Jest project
✓ Delegates to portable Jest skill
✓ Jest skill runs tests
✓ Results returned to control-plane
✓ Results formatted correctly
```

#### 1.2: Multi-Framework with Jest

```
✓ Project with Jest + PHPUnit works
✓ Jest tests run correctly
✓ PHPUnit tests skipped for Jest
✓ Results separated by framework
```

**Dependencies:** Phase 3 complete  
**Environment:** Real block plugin repo with Jest tests

---

### PHPUnit + Control-Plane Coordination (2 tests)

**Test File:** `agents/testing-agent/__tests__/integration-phpunit.test.ts`

#### 2.1: PHPUnit Workflow Coordination

```
✓ Control-plane detects PHPUnit project
✓ Delegates to portable PHPUnit skill
✓ PHPUnit skill runs tests
✓ WPCS validation runs
✓ Results returned to control-plane
```

#### 2.2: Multi-Framework with PHPUnit

```
✓ Project with PHPUnit + Jest works
✓ PHPUnit tests run correctly
✓ Jest tests skipped for PHPUnit
✓ Results separated by framework
```

**Dependencies:** Phase 3 complete  
**Environment:** Real block theme repo with PHPUnit tests

---

### pytest + Control-Plane Coordination (2 tests)

**Test File:** `agents/testing-agent/__tests__/integration-pytest.test.ts`

#### 3.1: pytest Workflow Coordination

```
✓ Control-plane detects pytest project
✓ Delegates to portable pytest skill
✓ pytest skill runs CI tests
✓ Artifacts read correctly
✓ Results returned to control-plane
```

#### 3.2: Multi-Framework with pytest

```
✓ Project with pytest + Jest works
✓ pytest runs correctly
✓ Jest skipped for pytest projects
✓ Results aggregated correctly
```

**Dependencies:** Phase 3 complete  
**Environment:** GitHub Actions workflow with pytest

---

### Playwright + Control-Plane Coordination (2 tests)

**Test File:** `agents/testing-agent/__tests__/integration-playwright.test.ts`

#### 4.1: Playwright Workflow Coordination

```
✓ Control-plane detects Playwright project
✓ Delegates to portable Playwright skill
✓ Playwright skill runs E2E tests
✓ Screenshots/videos collected
✓ Results returned to control-plane
```

#### 4.2: Multi-Framework with Playwright

```
✓ Project with Playwright + Jest works
✓ Playwright tests run correctly
✓ Jest tests run correctly
✓ Results separated by framework
```

**Dependencies:** Phase 3 complete  
**Environment:** Real WordPress site with Playwright tests

---

### Provider Switching (2 tests)

**Test File:** `agents/testing-agent/__tests__/integration-providers.test.ts`

#### 5.1: Claude Provider Coordination

```
✓ Tests work with Claude provider
✓ Framework selection works
✓ Results parsed correctly
✓ Errors handled correctly
```

#### 5.2: Provider Switching

```
✓ Can switch from Claude to Copilot
✓ Can switch from Copilot to OpenAI
✓ Results consistent across providers
✓ No data loss during switch
```

**Dependencies:** Phase 3 complete  
**Environment:** .github agent with provider config

---

### Integration Test Summary

| Scenario | Tests | Coverage | Effort |
|----------|-------|----------|--------|
| Jest Coordination | 2 | 50% | 1h |
| PHPUnit Coordination | 2 | 50% | 1h |
| pytest Coordination | 2 | 50% | 1h |
| Playwright Coordination | 2 | 50% | 1h |
| Provider Switching | 2 | 50% | 1h |
| **Total** | **10** | **50%** | **5h** |

**Phase 4.2 Target:** 4-6 hours (15-20 tests, 50%+ coverage)

---

## E2E Tests (Phase 4.3)

### Jest E2E Test (1-2 tests)

**Test:** Jest workflow on real block plugin repository

**Steps:**

1. Clone real block plugin repo (or use existing test fixture)
2. Run Jest with control-plane + portable agent
3. Verify tests execute correctly
4. Verify results reported to GitHub

**Success Criteria:**

- ✓ Jest tests run
- ✓ Coverage reports generated
- ✓ Results visible in GitHub check
- ✓ Failures trigger GitHub annotations

**Environment:** Real block plugin repo  
**Duration:** ~5 min  
**Effort:** 1-1.5 hours

---

### PHPUnit E2E Test (1-2 tests)

**Test:** PHPUnit workflow on real block theme repository

**Steps:**

1. Clone real block theme repo (or use existing test fixture)
2. Run PHPUnit with control-plane + portable agent
3. Verify tests execute correctly
4. Verify WPCS validation runs
5. Verify results reported to GitHub

**Success Criteria:**

- ✓ PHPUnit tests run
- ✓ WPCS validation runs
- ✓ Coverage reports generated
- ✓ Results visible in GitHub check

**Environment:** Real block theme repo  
**Duration:** ~5 min  
**Effort:** 1-1.5 hours

---

### pytest E2E Test (1-2 tests)

**Test:** pytest workflow on real utility repository

**Steps:**

1. Create GitHub Actions workflow with pytest
2. Run pytest with control-plane + portable agent
3. Verify tests execute correctly
4. Verify CI artifacts handled
5. Verify results reported to GitHub

**Success Criteria:**

- ✓ pytest tests run
- ✓ Artifacts read correctly
- ✓ Metrics generated
- ✓ Results visible in GitHub check

**Environment:** GitHub Actions workflow  
**Duration:** ~3 min  
**Effort:** 1-1.5 hours

---

### Playwright E2E Test (1-2 tests)

**Test:** Playwright workflow on test WordPress site

**Steps:**

1. Set up test WordPress site (or use staging)
2. Run Playwright with control-plane + portable agent
3. Verify browser automation works
4. Verify accessibility checks run
5. Verify results reported

**Success Criteria:**

- ✓ Playwright tests run
- ✓ Multi-browser testing works
- ✓ Screenshots captured
- ✓ Accessibility results correct

**Environment:** Test WordPress site  
**Duration:** ~10 min  
**Effort:** 1.5-2 hours

---

### Control-Plane Workflow E2E (1 test)

**Test:** .github agent on control-plane workflows

**Steps:**

1. Run .github agent on .github workflows
2. Verify delegation to portable agent
3. Verify results reported
4. Verify no side effects

**Success Criteria:**

- ✓ Control-plane agent works
- ✓ Delegation successful
- ✓ Results accurate
- ✓ No test suite broken

**Environment:** .github repository  
**Duration:** ~5 min  
**Effort:** 1-1.5 hours

---

### E2E Test Summary

| Test | Effort | Duration | Coverage |
|------|--------|----------|----------|
| Jest | 1-1.5h | 5 min | 15% |
| PHPUnit | 1-1.5h | 5 min | 15% |
| pytest | 1-1.5h | 3 min | 15% |
| Playwright | 1.5-2h | 10 min | 15% |
| Control-Plane | 1-1.5h | 5 min | 10% |
| **Total** | **6-8h** | **28 min** | **70%** |

**Phase 4.3 Target:** 6-8 hours (70%+ critical path coverage)

---

## Test Execution Commands

### Run All Tests

```bash
npm test -- --coverage
```

### Run Unit Tests Only

```bash
npm test -- --testPathPattern=__tests__ --coverage
```

### Run Integration Tests

```bash
npm test -- --testPathPattern=integration --coverage
```

### Run E2E Tests

```bash
npm test -- --testPathPattern=e2e --coverage
```

### Run Coverage Report

```bash
npm test -- --coverage --collectCoverageFrom='src/**/*.ts'
```

### Watch Mode (Development)

```bash
npm test -- --watch
```

---

## Coverage Targets Summary

| Level | Target | Effort | Tests |
|-------|--------|--------|-------|
| Unit | 80%+ | 2-3h | 40-50 |
| Integration | 50%+ | 4-6h | 15-20 |
| E2E | 70%+ | 6-8h | 5-8 |
| **Total** | **80% Unit, 50% Integration, 70% E2E** | **12-17h** | **60-78** |

---

## Test Data & Fixtures

### Unit Test Fixtures

- Mock WordPress REST API responses
- Mock WordPress global functions
- Mock GitHub Actions environment
- Mock CI artifact structures

**Location:** `agents/testing-agent/__tests__/fixtures/`

### Integration Test Fixtures

- Real-world block plugin repository
- Real-world block theme repository
- Real GitHub Actions workflow
- Test WordPress site with plugins

**Location:** `agents/testing-agent/__tests__/fixtures/repos/`

### E2E Test Fixtures

- Existing block plugin repos (clone for testing)
- Existing block theme repos (clone for testing)
- Test WordPress site (staging environment)
- GitHub Actions test account

**Location:** External repositories + staging environment

---

## Continuous Integration

### Test Automation

```yaml
# .github/workflows/test-agent.yml
name: Test Agent

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3
```

### Coverage Gates

- **Unit Tests:** Fail if < 80%
- **Integration Tests:** Fail if < 50%
- **E2E Tests:** Fail if any test fails

### Test Reporting

- Coverage reports uploaded to Codecov
- Test results visible in GitHub checks
- Failing tests block PR merge

---

## Test Review Checklist

Before marking tests as complete:

- ✓ All unit tests written and passing
- ✓ All integration tests written and passing
- ✓ All E2E tests written and passing
- ✓ Coverage targets met (80% unit, 50% integration, 70% E2E)
- ✓ Test data fixtures complete
- ✓ CI/CD configuration updated
- ✓ Documentation updated with test results
- ✓ Team trained on running tests
- ✓ No flaky tests (ran 3x without issues)
- ✓ Performance acceptable (unit < 30s, integration < 2 min, E2E < 15 min)

---

## Related Documentation

- [PROJECT_PLAN.md](./PROJECT_PLAN.md) — Phase 4 effort estimates
- [README.md](./README.md) — Test coverage requirements section
- [DOCUMENTATION_PLAN.md](./DOCUMENTATION_PLAN.md) — Test guide documentation

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

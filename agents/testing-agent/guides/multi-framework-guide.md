---
name: multi-framework-guide
title: Multi-Framework Testing Guide
description: Comparison and integration guide for Jest, PHPUnit, pytest, and Playwright across full test stack.
version: 1.0.0
category: guides
updated: 2026-08-18
---

# Multi-Framework Testing Guide

Comprehensive guide for coordinating Jest, PHPUnit, pytest, and Playwright across your testing strategy.

## Framework Selection Matrix

| Need | Jest | PHPUnit | pytest | Playwright |
|------|------|---------|--------|-----------|
| Unit Tests (JS) | ✅ | - | - | - |
| Unit Tests (PHP) | - | ✅ | - | - |
| Unit Tests (Python) | - | - | ✅ | - |
| Integration (JS) | ✅ | - | - | - |
| Integration (PHP) | - | ✅ | - | - |
| Integration (Python) | - | - | ✅ | - |
| E2E Tests | - | - | - | ✅ |
| React/Component | ✅ | - | - | ✅ |
| API Endpoints | ✅ | ✅ | ✅ | ✅ |
| Database | - | ✅ | ✅ | - |
| User Journeys | - | - | - | ✅ |

## Testing Pyramid Strategy

```
        /\
       /E2E\           Playwright
      /-----\
     /-------\         Integration
    / Feature\         (All Frameworks)
   /---------\
  /   Unit    \        Unit Tests
 /     Tests   \       (Framework-Specific)
/_______________\
```

**Recommended Distribution:**
- Unit Tests: 70% (Framework-specific)
- Integration: 20% (Framework-specific)
- E2E: 10% (Playwright)

## Parallel Execution

### GitHub Actions Setup

```yaml
jobs:
  unit-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        framework: [jest, phpunit, pytest]
    steps:
      - uses: actions/checkout@v3
      - run: npm test  # Jest
      - run: vendor/bin/phpunit  # PHPUnit
      - run: pytest  # pytest

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npx playwright test
```

## Coverage Reporting

### Aggregate Coverage

```bash
#!/bin/bash
# Collect coverage from all frameworks
jest --coverage
phpunit --coverage-text
pytest --cov
npx playwright test --reporter=json

# Generate combined report (requires lcov)
lcov --add-tracefile coverage/coverage.lcov \
     --add-tracefile phpunit-coverage.lcov \
     --output-file combined-coverage.lcov
```

## Debugging Multi-Framework Tests

### Local Development

```bash
# Run specific framework
npm test                    # Jest (unit)
vendor/bin/phpunit          # PHPUnit (unit)
pytest                      # pytest (unit)
npx playwright test --debug # Playwright (E2E)
```

### Verbose Output

```bash
# All frameworks support verbose flags
npm test -- --verbose
phpunit -v
pytest -v
npx playwright test -v
```

## Best Practices Across All Frameworks

1. **Same Naming Conventions**
   - Test files: `*.test.js`, `*Test.php`, `test_*.py`, `*.spec.ts`
   - Test methods: `test*`, `testFoo()`, `test_foo()`

2. **Consistent Assertion Patterns**
   - All frameworks support equal, exists, throws assertions
   - Use similar assertion language

3. **Shared Test Data**
   - Create fixtures directory for shared test data
   - Use same mock/stub patterns

4. **CI/CD Consistency**
   - Same coverage thresholds (e.g., 80%)
   - Same artifact collection
   - Same reporting format

5. **Documentation**
   - Link to framework-specific guides
   - Document framework choice rationale
   - Maintain migration paths

## Coverage Thresholds

Set consistent targets across all frameworks:

```javascript
// Jest
coverageThreshold: { global: { lines: 80 } }

// PHPUnit
<goal type="lines">80</goal>

// pytest
--cov-fail-under=80

// Playwright (N/A for E2E)
```

## Migration Paths

### From Jest to E2E (Playwright)

When unit tests pass:
1. Identify critical user journeys
2. Create Playwright specs for flows
3. Don't duplicate E2E tests in Jest
4. Use Playwright for integration scenarios

### From PHPUnit to Playwright

1. Port integration tests to Playwright
2. Keep unit tests in PHPUnit
3. Use Playwright for API + UI scenarios
4. Reduce Selenium/Nightwatch dependencies

## Troubleshooting Across Frameworks

| Issue | Jest | PHPUnit | pytest | Playwright |
|-------|------|---------|--------|-----------|
| Async issues | Use async/await | Use mock promises | Mark @asyncio | Built-in await |
| Database | Mock | Test DB | Fixtures | Mock APIs |
| Timeouts | jest.setTimeout() | set_time_limit | timeout param | waitFor |
| Parallelism | Default on | Sequential | pytest-xdist | Built-in |

## Coverage Goals by Framework

| Framework | Recommended | Target | Reason |
|-----------|------------|--------|--------|
| Jest | 80%+ | 85%+ | Fast feedback, critical paths |
| PHPUnit | 75%+ | 80%+ | Plugin/theme complexity |
| pytest | 80%+ | 85%+ | API/service criticality |
| Playwright | N/A | N/A | Samples critical journeys |

---

**Version:** 1.0.0 | **Updated:** 2026-08-18 | **Related:** All framework guides

---
name: "Testing Prompt"
description: "Kickstart comprehensive test execution and coverage analysis for LightSpeed projects."
tools: ["read", "shell", "search"]
---

# Testing Prompt

Execute comprehensive test suites and generate coverage reports following LightSpeed testing standards.

## Usage

Use this prompt when you need to:

- Run all test suites before merging code
- Validate code coverage meets minimum thresholds
- Diagnose test failures and identify root causes
- Generate test coverage reports
- Execute specific test suites (unit, integration, E2E)

## Instructions

### Quick Test Execution

```bash
# Run all tests with coverage
npm run test

# Run full check (linting + tests)
npm run check
```

### Detailed Test Analysis

When executing tests, analyze and report on:

1. **Test Results**
   - Total tests executed
   - Passed/failed/skipped counts
   - Execution time per suite
   - Flaky tests (if any)

2. **Coverage Metrics**
   - Line coverage percentage
   - Branch coverage percentage
   - Function coverage percentage
   - Uncovered critical code paths

3. **Failure Diagnostics**
   - Test name and file location
   - Failure message and stack trace
   - Expected vs actual values
   - Recommended fix or investigation path

### Test Suite Breakdown

#### JavaScript/TypeScript (Jest)

```bash
npm run test:js  # Unit and integration tests
```

**Coverage Threshold:** 85% for critical code paths

#### End-to-End (Playwright)

```bash
npm run e2e:test  # Browser automation tests
```

**Focus:** User workflows, accessibility, cross-browser compatibility

#### PHP (PHPUnit)

```bash
composer test  # WordPress PHP tests
```

**Focus:** Plugin functionality, theme components, API endpoints

#### Python (pytest)

```bash
pytest  # Automation script tests
```

**Focus:** Build scripts, automation tools, data processing

#### Shell Scripts (Bats)

```bash
bats tests/  # Shell script tests
```

**Focus:** Deployment scripts, system integration, CLI tools

## Output Format

### Summary Report

```markdown
## Test Execution Summary

**Status:** ✅ PASSED / ❌ FAILED

### Results

- Total Tests: X
- Passed: Y
- Failed: Z
- Skipped: N
- Duration: Xs

### Coverage

- Line Coverage: XX%
- Branch Coverage: XX%
- Function Coverage: XX%
- **Status:** ✅ Meets threshold / ⚠️ Below threshold

### Failures (if any)

1. **test-name.spec.js:42** - Description
   - Error: Expected X but got Y
   - Fix: Update assertion or implementation

### Recommendations

- [ ] Fix failing tests before merge
- [ ] Improve coverage in module X
- [ ] Investigate flaky test Y
```

## Guardrails

❌ **NEVER**:

- Skip failing tests without investigation
- Commit code with failing tests
- Ignore coverage threshold violations
- Deploy without running tests

✅ **ALWAYS**:

- Run complete test suite before merge
- Investigate and fix failing tests
- Maintain minimum coverage thresholds
- Update tests when changing functionality
- Document complex test scenarios

## Examples

### Example 1: Pre-Merge Test Check

```
Run all tests and generate coverage report before merging feature branch.

Expected:
- All tests pass
- Coverage >= 85% for new code
- No new console errors or warnings
```

### Example 2: Diagnose Test Failure

```
Investigate failing test: `user-authentication.test.js:127`

Error: "Expected 200 but received 401"

Analysis needed:
- Check authentication flow
- Verify mock data setup
- Review API endpoint changes
```

### Example 3: Coverage Improvement

```
Increase test coverage for src/utils/validation.js from 65% to 85%.

Focus areas:
- Edge cases for email validation
- Error handling for invalid inputs
- Boundary conditions for string length
```

## Related

- [Testing Agent](../agents/testing.agent.md)
- [Testing Instructions](../instructions/testing.instructions.md)
- [Testing Workflow](../workflows/testing.yml)
- [Coding Standards](../instructions/coding-standards.instructions.md)

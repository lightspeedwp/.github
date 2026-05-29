---
title: "Quality Assurance & Testing Slide Deck Prompt"
description: "NotebookLM and design prompt for QA gates and testing strategy"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Quality Assurance & Testing Slide Deck Prompt

## System Overview

The **Quality Assurance & Testing System** enforces multiple layers of quality gates to catch regressions, performance issues, security vulnerabilities, and accessibility problems before code ships. It includes unit testing, integration testing, performance analysis, security scanning, and accessibility validation.

**Operational scope**: Test automation, quality gates, coverage enforcement, regression prevention, performance monitoring.

**Owned by**: LightSpeed ops & engineering teams

## Key Components

1. **Unit Testing** - Jest test suites for JavaScript/TypeScript code
2. **Integration Testing** - End-to-end workflow validation
3. **Performance Testing** - Load testing, bundle size analysis
4. **Security Scanning** - Dependency vulnerability checks, code analysis
5. **Accessibility Testing** - WCAG AA compliance validation
6. **Quality Gates** - CI/CD checks that must pass before merge

## Integration Points

- **Testing Workflow**: Runs test suite on every PR
- **Reviewer Agent**: Performs code quality analysis
- **Linting Agent**: Validates code style and syntax
- **Meta Agent**: Tracks quality metrics and trends
- **Quality Gate Skills**: Enforce testing requirements

## Use Cases & Examples

### Use Case 1: PR Testing Flow

Developer submits PR; automated testing validates quality.

**Testing flow:**

1. PR created with code changes
2. Testing workflow triggers automatically
3. Jest runs test suite (< 2 min)
4. Security scanning checks dependencies
5. Performance analysis: bundle size impact
6. Coverage report: new code must have > 80% coverage
7. All checks pass: PR ready for review
8. Developer can see test results immediately

### Use Case 2: Performance Regression Detection

Code change causes 20% bundle size increase; detected before merge.

**Performance flow:**

1. Developer pushes code changes
2. Performance workflow analyzes bundle
3. Detects: bundle size increased from 250KB to 300KB
4. Flags as failure: triggers investigation
5. Developer reviews changes, finds unnecessary import
6. Removes import, bundle drops back to 250KB
7. Tests pass, PR can merge

### Use Case 3: Quarterly Quality Report

End of quarter; leadership reviews testing metrics.

**Quality flow:**

1. Meta agent generates quarterly report
2. Metrics include:
   - Test coverage: 87% (target: > 80%) ✅
   - Regression rate: 2% (target: < 5%) ✅
   - Security vulnerabilities: 0 critical ✅
   - Accessibility compliance: 99% ✅
3. Trends shown: year-over-year improvement
4. Recommendations: areas to invest in testing

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Quality issues discovered in production; preventable with testing
- Stakes: Customer impact, reputation damage, emergency fixes costly

**Slide 02** - QA System Overview

- Multiple testing layers: unit, integration, performance, security
- Automated gates: testing required before merge
- Coverage enforcement: new code must have tests
- Regression prevention: existing tests catch new bugs
- Visibility: all teams see quality metrics

**Slide 03** - Unit Testing (Jest)

- **Framework**: Jest for JavaScript/TypeScript testing
- **Coverage**: Individual functions and modules tested
- **Requirements**: > 80% code coverage for new code
- **Location**: `./__tests__/` directories next to source files
- **Examples**: component tests, utility tests, agent tests
- **Execution**: `npm test` runs all tests with coverage

**Slide 04** - Test Organization & Structure

- **Test files**: `[name].test.js` or `[name].spec.js`
- **Fixtures**: Sample data in `fixtures/` directories
- **Mocking**: Mock dependencies for isolated testing
- **Snapshots**: Capture expected output, detect regressions
- **CI Integration**: Tests run automatically on PR

**Slide 05** - Integration Testing

- **Workflow testing**: Full workflows tested end-to-end
- **API mocking**: Mock GitHub API calls, test agent scripts
- **Fixtures**: Real PR/issue data used in tests
- **Coverage**: Critical workflows have integration tests
- **Execution**: Separate from unit tests, run in CI

**Slide 06** - Performance Testing

- **Bundle Size Analysis**: Track JavaScript bundle size trends
- **Load Testing**: Can system handle expected load?
- **Memory Profiling**: Are there memory leaks?
- **Execution Time**: Are agent scripts performant?
- **Alerts**: Regression triggers warning on PR

**Slide 07** - Security Scanning

- **Dependency Scanning**: npm audit, Snyk checks
- **Vulnerability Detection**: Known CVEs in dependencies
- **Secret Detection**: Prevent hardcoded credentials
- **Code Analysis**: Static analysis for security patterns
- **Blocking**: Critical vulnerabilities block merge

**Slide 08** - Accessibility Testing

- **WCAG AA Compliance**: All user-facing content must comply
- **Alt Text Validation**: Images must have alt text
- **Link Testing**: Links must have descriptive text
- **Color Contrast**: Text must have sufficient contrast
- **Keyboard Navigation**: Must work without mouse

**Slide 09** - Coverage Requirements & Gates

- **Minimum coverage**: New code must have > 80% coverage
- **Coverage reports**: Generated on every PR
- **Coverage trends**: Tracked over time
- **Failing gate**: PR cannot merge if coverage drops
- **Exemptions**: Critical paths can't be exempted (safety)

**Slide 10** - Flaky Test Management

- **Flaky tests**: Tests that fail intermittently
- **Detection**: Automated flagging of flaky tests
- **Root cause analysis**: Why does test fail intermittently?
- **Remediation**: Fix test or code, re-run to verify
- **Prevention**: Best practices to avoid flakiness

**Slide 11** - Test Failure Triage

- **CI Failure**: Test fails on PR, developer investigates
- **Root cause**: Code bug or test issue?
- **Remediation**: Fix code or update test
- **Re-run**: Verify fix before merge
- **Learning**: Document patterns to avoid regressions

**Slide 12** - Quality Metrics & Goals

- **Test Coverage**: % of code covered by tests (target: > 80%)
- **Regression Rate**: Bugs found post-release (target: < 5%)
- **Security Vulnerabilities**: Critical CVEs (target: 0)
- **Accessibility Compliance**: % of content meeting standards (target: > 98%)
- **Test Execution Time**: Time to run all tests (target: < 5 min)

**Slide 13** - Best Practices

- **Write tests first**: TDD approach reduces bugs
- **Test behavior, not implementation**: Tests less brittle
- **Keep tests fast**: Slow tests discourage running locally
- **Isolate tests**: Each test independent, deterministic
- **Mock external deps**: Tests should be environment-independent
- **Review test code**: Tests are code, review them like code

**Slide 14** - Local Development Testing

- **Run tests locally**: `npm test` before pushing
- **Watch mode**: `npm test -- --watch` for development
- **Single test**: `npm test -- testfile.js` to run one file
- **Coverage report**: `npm test -- --coverage` for detailed view
- **Debugging**: Node inspector available for debugging

**Slide 15** - Close & Next Actions

- QA system ensures quality before merge
- Contribute: Write tests for your changes
- Questions & feedback

## Evidence Anchors

- `.github/.github/workflows/testing.yml` - Testing workflow
- `.github/scripts/agents/__tests__/` - Agent test suites
- `.jest.config.cjs` - Jest configuration
- `scripts/validation/__tests__/` - Validation test suites
- `scripts/agents/__tests__/fixtures/` - Test fixtures

## Design Notes

- **Visual theme**: Quality assurance (checkmarks, validation gates, coverage indicators)
- **Color palette**: Use QA colors (greens for passing, reds for failures)
- **Key visuals**: Test flow diagram, coverage gauge, CI gate diagram, quality metrics dashboard
- **Accessibility**: High contrast for pass/fail indicators
- **Animations**: Consider test execution animation, coverage growing animation

## Quality Bar

- Show real test examples from codebase
- Include actual test coverage numbers
- Validate against actual Jest configuration
- Show realistic test execution times
- Ensure all evidence references point to current develop branch

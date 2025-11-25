---
title: "Testing Standards by Framework"
description: "Comprehensive testing guidelines for all test frameworks and languages used in LightSpeedWP projects."
version: "v1.0"
last_updated: "2025-11-24"
file_type: "documentation"
owners: ["lightspeedwp/maintainers"]
tags: ["testing", "frameworks", "quality-assurance"]
---

# Testing Standards Directory

This folder contains detailed testing guidelines and best practices for all testing frameworks and languages used across LightSpeed projects.

## Testing Frameworks by Language

| Framework | Language | File | File Types | Purpose |
|---|---|---|---|---|
| **Jest** | JavaScript/TypeScript | `tests-jest.instructions.md` | `.js, .ts, .jsx, .tsx` | Unit & integration testing |
| **Playwright** | JavaScript/TypeScript | `tests-playwright.instructions.md` | `.js, .ts` | E2E browser testing |
| **PHPUnit** | PHP | `tests-phpunit.instructions.md` | `.php` | Unit & integration testing |
| **pytest** | Python | `tests-python.instructions.md` | `.py` | Unit testing |
| **Bats** | Shell/Bash | `tests-bats.instructions.md` | `.sh, .bats` | Shell script testing |

## Testing Pyramid

```
         E2E Tests (few, critical journeys)
              ↑
      Integration Tests (focused, services)
              ↑
      Unit Tests (many, fast, isolated)
              ↑
      Static Analysis (linting, type checking)
```

## Quick Reference

### Jest (JavaScript/TypeScript)

```bash
npm run test:js              # Run all tests
npm run test:js -- --watch  # Watch mode
npm run test:js -- --coverage # With coverage
```

### Playwright (E2E)

```bash
npm run test:e2e             # Run all E2E tests
npx playwright test --headed # Visible browser
npx playwright test --debug  # Debug mode
```

### PHPUnit (PHP)

```bash
composer test               # Run all tests
vendor/bin/phpunit --filter TestName # Specific test
composer test -- --coverage # With coverage
```

### pytest (Python)

```bash
pytest                      # Run all tests
pytest -v                  # Verbose output
pytest --cov              # With coverage
pytest -k test_name       # Specific test
```

### Bats (Shell)

```bash
bats tests/                 # Run all shell tests
bats tests/test_file.bats  # Specific test file
bats --tap tests/          # TAP format output
```

## Coverage Requirements

### Minimum Coverage Targets

- **Critical Paths**: 100% coverage required
- **Public APIs**: 85%+ coverage required
- **Business Logic**: 80%+ coverage required
- **Utils/Helpers**: 75%+ coverage target

### Coverage Commands

```bash
# JavaScript
npm run test:js -- --coverage

# Python
pytest --cov=.

# PHP
vendor/bin/phpunit --coverage-html coverage/
```

## Test File Organization

### Directory Structure

```
tests/
├── jest/                 # Jest tests
│   ├── unit/
│   ├── integration/
│   └── __mocks__/
├── playwright/          # Playwright E2E tests
│   ├── pages/           # Page objects
│   └── specs/
├── phpunit/             # PHPUnit tests
│   ├── Unit/
│   └── Integration/
├── python/              # pytest tests
│   ├── unit/
│   └── integration/
└── bats/                # Bats shell tests
    └── *.bats
```

### Naming Conventions

- **Jest**: `*.test.js`, `*.spec.js`
- **Playwright**: `*.spec.ts`, `*.e2e.ts`
- **PHPUnit**: `*Test.php`
- **pytest**: `test_*.py`, `*_test.py`
- **Bats**: `test_*.bats`, `*.bats`

## Best Practices

### General Testing Principles

✅ **Do**:

- Write tests before or alongside code (TDD)
- Keep tests isolated and independent
- Use descriptive test names
- Mock external dependencies
- Test behavior, not implementation
- Keep tests fast and deterministic

❌ **Don't**:

- Skip tests when time-pressured
- Test private implementation details
- Create flaky or intermittent tests
- Leave commented-out test code
- Mock everything (some integration testing needed)
- Ignore test failures

### Test Naming

```javascript
// ❌ Bad - Unclear what's being tested
test('auth', () => { /* ... */ });

// ✅ Good - Clear, descriptive name
test('should redirect to login when user is not authenticated', () => { /* ... */ });
```

### Test Structure (AAA Pattern)

```javascript
test('should calculate total with tax', () => {
  // Arrange
  const items = [{ price: 100 }, { price: 50 }];
  const taxRate = 0.1;
  
  // Act
  const result = calculateTotal(items, taxRate);
  
  // Assert
  expect(result).toBe(165);
});
```

## Automation

### Pre-commit Testing

Tests run automatically before commit:

```bash
npm run husky:install
```

### CI/CD Integration

All tests run in GitHub Actions:

- `.github/workflows/test.yml` - Unit tests
- `.github/workflows/test-e2e.yml` - E2E tests
- `.github/workflows/quality-gates.yml` - Quality gates

## Performance Targets

- **Unit tests**: < 100ms per test
- **Integration tests**: < 500ms per test
- **E2E tests**: < 5 seconds per test
- **Full suite**: < 5 minutes total

## Test Commands Reference

```bash
# Run all tests
npm test

# Specific framework
npm run test:js          # Jest
npm run test:playwright  # Playwright
composer test           # PHPUnit
pytest                  # pytest
bats tests/            # Bats

# With reporting
npm test -- --coverage
npm test -- --reporter=junit

# Watch mode
npm test -- --watch

# Debug mode
npm test -- --debug
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Troubleshooting

### Tests Won't Run

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install

# Check node version
node --version  # Should be 20+

# Run specific test
npm test -- --testNamePattern="test name"
```

### Flaky Tests

- Ensure tests don't depend on execution order
- Mock time-dependent functions
- Increase timeouts for network tests
- Check for race conditions

### Coverage Issues

- Run with `--coverage` flag
- Check coverage report in `coverage/` folder
- Add tests for uncovered branches
- Mock external dependencies

## Integration Points

Testing standards are integrated with:

- `.github/workflows/lint.yml` - CI/CD pipeline
- `.github/workflows/quality-gates.yml` - Quality gates
- `.github/instructions/coding-standards.instructions.md` - Coding standards
- `package.json` - npm test scripts
- `jest.config.js` - Jest configuration
- `playwright.config.js` - Playwright configuration

## For New Test Frameworks

To add a new testing framework:

1. Create `tests-<framework>.instructions.md` in this folder
2. Document setup, configuration, and usage
3. Provide example test structure
4. Add npm script to `package.json`
5. Update `.github/workflows/test.yml` if needed
6. Add entry to this README

---

For more information, see the [Tests Index](../tests.instructions.md) or reference the main [Coding Standards](../coding-standards.instructions.md).

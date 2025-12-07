---
name: "Testing Instructions"
description: "Comprehensive testing instructions for executing tests, generating coverage reports, and maintaining quality standards across all LightSpeed projects."
applyTo: "**/*.{test,spec}.{js,ts,jsx,tsx}"
---

# Testing Instructions

## Mission

Execute comprehensive test suites, validate code coverage, and ensure quality standards are met before merging code changes.

## Strategy

- Automated test execution via `testing.yml` workflow
- Multi-framework support (Jest, Playwright, PHPUnit, pytest, Bats)
- Coverage reporting with minimum thresholds
- Fast feedback loop for developers
- Integration with CI/CD pipelines

## Testing Workflow

The testing agent is triggered by `.github/workflows/testing.yml` which runs:

```bash
npm run check  # Executes: npm run lint:all && npm run test
```

## Test Execution Commands

### All Tests

```bash
# Run complete test suite with coverage
npm run test

# Run full check (linting + tests)
npm run check
```

### Framework-Specific Tests

```bash
# JavaScript/TypeScript (Jest)
npm run test:js

# End-to-End (Playwright)
npm run e2e:test

# PHP (PHPUnit)
composer test

# Python (pytest)
pytest

# Shell Scripts (Bats)
bats tests/
```

## Coverage Requirements

All code must meet these minimum coverage thresholds:

| Code Type               | Minimum Coverage |
| ----------------------- | ---------------- |
| Critical business logic | 85%              |
| Utility functions       | 80%              |
| UI components           | 75%              |
| Overall project         | 75%              |

## Test Organization

Tests are organized by framework and type:

```
tests/
├── README.md                    # Testing documentation
├── jest.setup.localstorage.js   # Jest configuration
├── test-helpers.js              # Shared test utilities
├── **/*.test.js                 # Jest unit tests
├── **/*.spec.js                 # Jest integration tests
└── e2e/                         # Playwright E2E tests
    └── **/*.e2e.spec.js
```

## Test Writing Standards

### Unit Tests (Jest)

```javascript
describe("Module/Function Name", () => {
  // Setup
  beforeEach(() => {
    // Test setup
  });

  // Teardown
  afterEach(() => {
    // Cleanup
  });

  it("should do something specific", () => {
    // Arrange
    const input = "test";

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe("expected");
  });

  it("should handle edge case", () => {
    // Test edge cases
  });

  it("should throw error for invalid input", () => {
    // Test error handling
  });
});
```

### Integration Tests

```javascript
describe("API Integration", () => {
  it("should fetch and process data", async () => {
    // Test API integration
    const response = await fetchData();
    expect(response.status).toBe(200);
    expect(response.data).toHaveLength(5);
  });
});
```

### E2E Tests (Playwright)

```javascript
test("user can complete workflow", async ({ page }) => {
  // Navigate
  await page.goto("/");

  // Interact
  await page.click('button[data-testid="start"]');

  // Assert
  await expect(page.locator(".result")).toBeVisible();
});
```

## Best Practices

### Test Quality

- ✅ Write descriptive test names that explain intent
- ✅ Follow Arrange-Act-Assert pattern
- ✅ Test one thing per test case
- ✅ Use meaningful assertions
- ✅ Mock external dependencies
- ✅ Keep tests fast and focused
- ✅ Avoid test interdependencies

### Coverage Goals

- ✅ Prioritize testing critical business logic
- ✅ Test error handling and edge cases
- ✅ Validate input validation and sanitization
- ✅ Test accessibility requirements
- ✅ Cover security-sensitive code paths

### Maintenance

- ✅ Update tests when requirements change
- ✅ Remove obsolete tests promptly
- ✅ Refactor tests alongside production code
- ✅ Document complex test scenarios
- ✅ Review test failures immediately

## CI/CD Integration

### Workflow Triggers

The testing workflow runs on:

- All pull requests to `develop` branch
- Pushes to `develop` branch
- Manual workflow dispatch

### Required Checks

Tests must pass before:

- Merging pull requests
- Deploying to staging
- Creating releases
- Promoting to production

## Troubleshooting

### Common Issues

**Tests fail locally but pass in CI:**

- Check Node.js version matches CI (use `.nvmrc`)
- Ensure dependencies are installed (`npm ci`)
- Clear test cache (`npm run test:js -- --clearCache`)

**Coverage below threshold:**

- Identify uncovered files: `npm run test:js -- --coverage`
- Add tests for critical code paths first
- Use coverage reports to guide test writing

**Flaky tests:**

- Investigate timing-related issues
- Add proper waits in E2E tests
- Check for race conditions
- Use deterministic test data

**Test timeout:**

- Increase Jest timeout: `jest.setTimeout(10000)`
- Optimize slow tests
- Mock expensive operations
- Run tests in parallel

## Agent Alignment

The testing agent (`testing.agent.md`) orchestrates:

1. Test execution across all frameworks
2. Coverage report generation and validation
3. Failure diagnostics and recommendations
4. Integration with CI/CD workflows

## References

- [Testing Agent](../agents/testing.agent.md)
- [Testing Prompt](../prompts/testing.prompt.md)
- [Test Standards Index](./tests.instructions.md)
- [Coding Standards](./coding-standards.instructions.md)
- [Testing Workflow](../workflows/testing.yml)

## NPM Scripts Reference

From `package.json`:

```json
{
  "scripts": {
    "check": "npm run lint:all && npm run test",
    "test": "npm run test:js",
    "test:js": "jest --config .jest.config.cjs --coverage --forceExit --detectOpenHandles"
  }
}
```

## Quality Gates

Before merging, ensure:

- [ ] All tests pass
- [ ] Coverage meets minimum thresholds
- [ ] No console errors or warnings
- [ ] E2E tests validate critical user flows
- [ ] Test failures investigated and resolved
- [ ] New code has corresponding tests

---

*For detailed framework-specific standards, see [tests.instructions.md](./tests.instructions.md)*

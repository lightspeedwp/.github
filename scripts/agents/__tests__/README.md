---
file_type: 'documentation'
title: 'Agent Test Suite'
description: 'Comprehensive Jest tests for all LightSpeed agents'
version: 'v1.1'
created_date: '2026-05-29'
last_updated: "2026-08-19"
maintainer: 'LightSpeed Team'
authors:
  - LightSpeed Team
license: 'GPL-3.0'
stability: 'stable'
domain: 'governance'
tags: []
---

# 🧪 Agent Test Suite

This directory contains comprehensive Jest tests for all LightSpeed agents, ensuring reliability, correctness, and consistent behavior across automation workflows.

## Validation Status

**Last Updated**: 2025-11-25
**Status**: ✅ All agent files validated

### Validation Results

All agent specification files pass frontmatter validation:

```bash
node scripts/validation/validate-agent-frontmatter.js
```

**Result**: ✅ 14/14 files passing

| Agent File                     | Status   |
| ------------------------------ | -------- |
| badges.agent.md                | ✅ Valid |
| meta.agent.md                  | ✅ Valid |
| header-footer.agent.md         | ✅ Valid |
| issue-type.agent.md            | ✅ Valid |
| jsdoc-review.agent.md          | ✅ Valid |
| label-standardization.agent.md | ✅ Valid |
| labeling.agent.md              | ✅ Valid |
| linting.agent.md               | ✅ Valid |
| manage-readmes.agent.md        | ✅ Valid |
| metrics.agent.md               | ✅ Valid |
| planner.agent.md               | ✅ Valid |
| release.agent.md               | ✅ Valid |
| reviewer.agent.md              | ✅ Valid |
| template.agent.md              | ✅ Valid |

See [Validation Report](../../.github/reports/AGENT-FRONTMATTER-VALIDATION-COMPLETE.md) for full details.

---

## Test Organization

### Core Agent Tests

| File                                  | Agent Tested                   | Purpose                                        |
| ------------------------------------- | ------------------------------ | ---------------------------------------------- |
| `template.agent.test.js`              | template.agent.js              | Tests basic agent structure and initialization |
| `issue-type.agent.test.js`            | issue-type.agent.js            | Tests issue type detection and assignment      |
| `label-standardization.agent.test.js` | label-standardization.agent.js | Tests label normalization and migration        |
| `labeling.agent.test.js`              | labeling.agent.js              | Tests unified labeling workflow                |
| `labeling.agent.integration.test.js`  | labeling.agent.js              | Integration tests with GitHub API mocks        |
| `reviewer.agent.test.js`              | reviewer.agent.js              | Tests PR review automation                     |
| `planner.agent.test.js`               | planner.agent.js               | Tests PR checklist generation                  |

### Specialized Tests

| File                           | Purpose                                       |
| ------------------------------ | --------------------------------------------- |
| `agent-performance.test.js`    | Performance benchmarks for agents             |
| `agent-workflows.test.js`      | Tests agent integration with GitHub workflows |
| `test-mock-validation.test.js` | Validates test mocks and helpers              |

## 🚀 Running Tests

### Run All Agent Tests

```bash
npm test -- .github/agents/__tests__/
```

### Run Specific Test File

```bash
npm test -- .github/agents/__tests__/labeling.agent.test.js
```

### Run Tests with Coverage

```bash
npm test -- .github/agents/__tests__/ --coverage
```

### Watch Mode (auto-rerun on changes)

```bash
npm test -- .github/agents/__tests__/ --watch
```

### Run Specific Test Suite

```bash
npm test -- .github/agents/__tests__/labeling.agent.test.js -t "applies default status"
```

## 📊 Coverage Requirements

- **Overall Coverage**: ≥85%
- **Statements**: ≥85%
- **Branches**: ≥80%
- **Functions**: ≥85%
- **Lines**: ≥85%

View current coverage:

```bash
npm test -- .github/agents/__tests__/ --coverage
open coverage/lcov-report/index.html
```

## ✅ Test Categories

### Unit Tests

- Individual function logic
- Error handling and edge cases
- Parameter validation
- Return value correctness

### Integration Tests

- Multiple functions working together
- API mocking with octokit
- GitHub Actions context simulation
- Real workflow scenarios

### Performance Tests

- Agent execution time benchmarks
- Memory usage optimization
- Concurrent operation handling
- Large dataset processing

## 🛠️ Test Utilities & Helpers

### Common Test Helpers

Located in `test-helpers.js` (parent directory):

```javascript
import {
  mockOctokit,
  mockContext,
  mockPrPayload,
  mockIssuePayload,
  setTestEnv,
  resetTestEnv,
  expectCommentPosted,
  expectDryRun,
} from "../../test-helpers.js";
```

### Mock Functions

#### `mockOctokit()`

Creates a mocked GitHub API client with standard REST endpoints.

```javascript
const octokit = mockOctokit();
octokit.rest.issues.addLabels.mockResolvedValue({ data: {} });
```

#### `mockContext(payload)`

Creates a GitHub Actions context object.

```javascript
const context = mockContext(
  mockPrPayload({
    labels: [{ name: "type:feature" }],
  }),
);
```

#### `mockPrPayload(overrides)`

Generates a pull request event payload.

```javascript
const payload = mockPrPayload({
  number: 123,
  title: "Test PR",
});
```

#### `mockIssuePayload(overrides)`

Generates an issue event payload.

```javascript
const payload = mockIssuePayload({
  number: 456,
  title: "Test Issue",
});
```

#### `setTestEnv(vars)`

Sets environment variables for tests.

```javascript
setTestEnv({ GITHUB_TOKEN: "test-token" });
```

#### `resetTestEnv(keys)`

Clears specific environment variables after tests.

```javascript
afterEach(() => resetTestEnv(["GITHUB_TOKEN"]));
```

## 📝 Writing New Agent Tests

### Test Structure Template

```javascript
const { mockOctokit, mockContext } = require("../../test-helpers");
const { run } = require("../your-agent.js");

describe("Your Agent", () => {
  beforeAll(() => {
    // Setup before all tests
  });

  afterAll(() => {
    // Cleanup after all tests
  });

  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  test("should perform expected action", async () => {
    // Arrange
    const octokit = mockOctokit();
    const context = mockContext(mockPrPayload());

    // Act
    await run(context);

    // Assert
    expect(octokit.rest.issues.addLabels).toHaveBeenCalled();
  });
});
```

### Best Practices

1. **Clear Test Names**: Describe what the test validates, not how

   ```javascript
   // ✅ Good
   test("should add default status label when missing", async () => {});

   // ❌ Avoid
   test("tests status labels", async () => {});
   ```

2. **Arrange-Act-Assert Pattern**: Organize test logic clearly

   ```javascript
   // Arrange - set up test data
   const input = { labels: [] };

   // Act - perform the action
   const result = await runAgent(input);

   // Assert - verify the result
   expect(result.labels).toContain("status:needs-review");
   ```

3. **Mock External Dependencies**: Don't make real API calls

   ```javascript
   // ✅ Good
   const octokit = mockOctokit();

   // ❌ Avoid
   const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
   ```

4. **Test Both Success and Failure Paths**

   ```javascript
   test("should handle successful case", async () => {
     /* ... */
   });
   test("should throw error when input invalid", async () => {
     /* ... */
   });
   ```

5. **Use Meaningful Assertions**

   ```javascript
   // ✅ Good
   expect(result.labels).toHaveLength(1);
   expect(result.labels[0]).toBe("status:needs-review");

   // ❌ Avoid
   expect(result.labels.length).toBe(1);
   ```

## 🔍 Debugging Tests

### Run Tests with Debugging

```bash
node --inspect-brk ./node_modules/.bin/jest .github/agents/__tests__/ --runInBand
```

### Log Output During Tests

```javascript
test("debug test", async () => {
  const result = await runAgent(input);
  console.log("DEBUG:", JSON.stringify(result, null, 2));
  expect(result).toBeDefined();
});
```

### View Detailed Test Output

```bash
npm test -- .github/agents/__tests__/ --verbose
```

## 📚 Related Documentation

- [Agent Specifications](../README.md) - Main agents directory
- [Agent Includes](../includes/README.md) - Shared utility modules
- [Quality Assurance](../../../instructions/quality-assurance.instructions.md) - Testing strategy, coverage, and CI integration
- [Jest Configuration](jest.config.js) - Jest setup and configuration

## ✨ Continuous Integration

All agent tests run automatically on:

- **Pull Requests**: All tests must pass before merge
- **Pushes to develop**: Validates code quality
- **Pre-commit**: Local hook runs affected tests

View CI status in GitHub Actions: `.github/workflows/jest-test-audit.yml`

---

---

## Repository Flow

```mermaid
graph LR
    A["Scope"] --> B["Inputs"]
    B --> C["Process"]
    C --> D["Validation"]
    D --> E["Outputs"]

    style A fill:#4a148c,color:#fff
    style B fill:#1b5e20,color:#fff
    style C fill:#bf360c,color:#fff
    style D fill:#f57f17,color:#fff
    style E fill:#00695c,color:#fff
```

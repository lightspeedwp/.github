# awesome-copilot/**tests** — Test Directory for Copilot Scripts

This directory is structured to contain test suites for all scripts in the `awesome-copilot/` directory. Currently empty, but ready for comprehensive test coverage.

## Planned Test Structure

- **`create-collection.test.js`** — Tests for `create-collection.js`
- **`update-readme.test.js`** — Tests for `update-readme.js`
- **`validate-collections.test.js`** — Tests for `validate-collections.js`
- **`yaml-parser.test.js`** — Tests for `yaml-parser.js`
- **`fix-line-endings.bats`** — Tests for `fix-line-endings.sh`

## Test Categories

### Collection Management Tests

```javascript
// Example test structure for create-collection.js
describe("create-collection.js", () => {
  test("creates valid collection file", () => {
    // Test collection creation with proper YAML frontmatter
  });

  test("validates against schema", () => {
    // Test schema validation
  });
});
```

### YAML Processing Tests

```javascript
// Example test structure for yaml-parser.js
describe("yaml-parser.js", () => {
  test("parses valid YAML frontmatter", () => {
    // Test YAML parsing functionality
  });

  test("handles malformed YAML", () => {
    // Test error handling
  });
});
```

### Shell Script Tests

```bash
#!/usr/bin/env bats
# Example test structure for fix-line-endings.sh

load "../../includes/enhanced-test-helpers.bash"

@test "normalizes CRLF to LF" {
  # Test line ending normalization
}

@test "preserves file permissions" {
  # Test that file permissions are maintained
}
```

## Integration with Main Test Suite

These tests should integrate with the main repository test suite via:

- **`run-all-tests.sh`** — Include awesome-copilot tests in full test runs
- **CI/CD Workflows** — Automated testing on push and pull requests
- **Pre-commit Hooks** — Validation before commits

## Test Data and Fixtures

Create test fixtures for:

- Sample collection files with valid/invalid structures
- YAML frontmatter examples
- Schema validation test cases
- Line ending test files (CRLF, LF, mixed)

## Dependencies

Tests in this directory require:

- **Node.js** — For JavaScript test execution
- **Jest** — JavaScript testing framework
- **Bats** — Bash testing framework
- **Test helpers** — From `../includes/` directory

## Implementation Priority

1. **`yaml-parser.test.js`** — Core functionality used by other scripts
2. **`validate-collections.test.js`** — Critical for quality assurance
3. **`create-collection.test.js`** — User-facing functionality
4. **`update-readme.test.js`** — Documentation automation
5. **`fix-line-endings.bats`** — Cross-platform compatibility

## Contributing

When adding tests:

1. Follow [LightSpeedWP Testing Standards](../../../.github/instructions/testing-standards.instructions.md)
2. Use appropriate test framework (Jest for JS, Bats for shell)
3. Include both positive and negative test cases
4. Mock external dependencies (file system, network calls)
5. Document test purpose and scope clearly

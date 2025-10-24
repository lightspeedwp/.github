# awesome-copilot/__tests__ — Test Directory for Copilot Scripts

This directory is structured to contain test suites for all scripts in the `awesome-copilot/` directory. Currently empty, but ready for comprehensive test coverage.

## Planned Test Structure

- __`create-collection.test.js`__ — Tests for `create-collection.js`
- __`update-readme.test.js`__ — Tests for `update-readme.js`
- __`validate-collections.test.js`__ — Tests for `validate-collections.js`
- __`yaml-parser.test.js`__ — Tests for `yaml-parser.js`
- __`fix-line-endings.bats`__ — Tests for `fix-line-endings.sh`

## Test Categories

### Collection Management Tests

```javascript
// Example test structure for create-collection.js
describe('create-collection.js', () => {
  test('creates valid collection file', () => {
    // Test collection creation with proper YAML frontmatter
  });
  
  test('validates against schema', () => {
    // Test schema validation
  });
});
```

### YAML Processing Tests

```javascript
// Example test structure for yaml-parser.js
describe('yaml-parser.js', () => {
  test('parses valid YAML frontmatter', () => {
    // Test YAML parsing functionality
  });
  
  test('handles malformed YAML', () => {
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

- __`run-all-tests.sh`__ — Include awesome-copilot tests in full test runs
- __CI/CD Workflows__ — Automated testing on push and pull requests
- __Pre-commit Hooks__ — Validation before commits

## Test Data and Fixtures

Create test fixtures for:

- Sample collection files with valid/invalid structures
- YAML frontmatter examples
- Schema validation test cases
- Line ending test files (CRLF, LF, mixed)

## Dependencies

Tests in this directory require:

- __Node.js__ — For JavaScript test execution
- __Jest__ — JavaScript testing framework
- __Bats__ — Bash testing framework
- __Test helpers__ — From `../includes/` directory

## Implementation Priority

1. __`yaml-parser.test.js`__ — Core functionality used by other scripts
2. __`validate-collections.test.js`__ — Critical for quality assurance
3. __`create-collection.test.js`__ — User-facing functionality
4. __`update-readme.test.js`__ — Documentation automation
5. __`fix-line-endings.bats`__ — Cross-platform compatibility

## Contributing

When adding tests:

1. Follow [LightSpeedWP Testing Standards](../../../.github/instructions/testing-standards.instructions.md)
2. Use appropriate test framework (Jest for JS, Bats for shell)
3. Include both positive and negative test cases
4. Mock external dependencies (file system, network calls)
5. Document test purpose and scope clearly

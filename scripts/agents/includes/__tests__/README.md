---
title: Utility Module Test Suite
description: Comprehensive Jest tests for labelling agent utility modules
tags: [testing, jest, utilities, labelling]
---

# Utility Module Test Suite

This directory contains comprehensive Jest unit tests for the utility modules used by the labelling agents.

## Test Coverage

### ✅ Fully Tested Modules (82 tests)

These CommonJS modules have comprehensive unit test coverage:

1. **[build-label-alias-map.test.js](./build-label-alias-map.test.js)** (19 tests)
   - Tests label alias mapping from labels.yml
   - Edge cases: null entries, empty arrays, mixed formats
   - YAML parsing and file reading validation

2. **[build-labeling-report.test.js](./build-labeling-report.test.js)** (21 tests)
   - Tests Markdown audit report generation
   - Missing/extra label detection
   - Markdown structure and formatting

3. **[fetch-canonical-labels.test.js](./fetch-canonical-labels.test.js)** (25 tests)
   - Tests canonical label extraction from YAML
   - Mixed string/object format handling
   - Special character and emoji support

4. **[update-readme.test.js](./update-readme.test.js)** (8 tests)
   - Tests shim file delegation pattern
   - Backwards compatibility validation
   - Shim architecture documentation

5. **[yaml-parser.test.js](./yaml-parser.test.js)** (9 tests)
   - Tests module re-export shim pattern
   - Path resolution validation
   - Cross-platform compatibility

## ES Module Testing Limitations

### Modules Not Tested

The following modules use ES module syntax (`import`/`export`) which is not compatible with the current Jest/Babel configuration:

1. **badges.js** - ES module for badge generation
2. **header-footer.js** - ES module for header/footer insertion
3. **en-gb-normalise.js** - Self-executing script for UK English normalisation

### Why These Can't Be Tested

The project uses:

- `"type": "module"` in [package.json](../../../../package.json) for ES module support
- Jest with Babel transformation for CommonJS tests
- Mixed module formats (CommonJS and ES modules)

Jest's current configuration transforms CommonJS modules but doesn't handle ES modules when they're imported via `require()`. The Babel transformation would need:

1. Custom `transformIgnorePatterns` to include `scripts/` directory
2. Babel preset configuration for ES module transformation
3. Module resolution updates to handle `.js` extensions as ES modules

### Alternative Testing Approaches

For ES modules, consider:

1. **Integration Tests**: Test the complete workflow rather than individual functions
2. **Module Conversion**: Convert ES modules to CommonJS for testing
3. **Native ES Module Support**: Update Jest to use Node's native ES module support
4. **Dual Module Format**: Maintain both CommonJS and ES module versions

### Recommended Solution

For new utility modules:

- Use **CommonJS** (`require`/`module.exports`) for testability
- Reserve ES modules for application code where integration tests are more appropriate
- See [badgeUtils.js](../badgeUtils.js) as an example of a testable CommonJS utility

## Running Tests

### Run All Utility Tests

```bash
npm test -- scripts/agents/includes/__tests__/
```

### Run Specific Test Suite

```bash
npm test -- scripts/agents/includes/__tests__/build-label-alias-map.test.js
```

### Run with Coverage

```bash
npm test -- --coverage scripts/agents/includes/__tests__/
```

## Test Structure

All tests follow this structure:

```javascript
const module = require("../module-name");

// Mock dependencies
jest.mock("fs");
jest.mock("js-yaml");

describe("module-name.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup mocks
  });

  describe("functionName", () => {
    it("should handle normal case", () => {
      // Arrange
      // Act
      // Assert
    });

    it("should handle edge case", () => {
      // Test edge cases
    });

    it("should handle error case", () => {
      // Test error handling
    });
  });
});
```

## Test Quality Standards

- ✅ **Comprehensive coverage**: Test all code paths
- ✅ **Edge cases**: null, undefined, empty arrays, invalid input
- ✅ **Error handling**: file not found, parse errors
- ✅ **Real-world scenarios**: actual data structures from production
- ✅ **Isolated tests**: Proper mocking of dependencies
- ✅ **Clear descriptions**: BDD-style test names
- ✅ **Cleanup**: beforeEach/afterEach hooks for test isolation

## Contributing

When adding new utility modules:

1. Create corresponding test file in this directory
2. Follow the existing test structure and naming conventions
3. Aim for 100% code coverage
4. Test edge cases and error conditions
5. Document any known limitations
6. Use CommonJS format for better testability

## Links

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](../../../../docs/TESTING.md)
- [Labelling Agent Documentation](../../../../docs/LABELING.md)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

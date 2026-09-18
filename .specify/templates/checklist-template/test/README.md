# Checklist Framework Tests

Test suite for the Requirements Quality Checklist framework validators, classifiers, and utilities.

## Structure

- **unit/** — Unit tests for individual modules
  - `item-validator.test.js` — Tests for item validation
  - `checkbox-parser.test.js` — Tests for markdown checkbox parsing
  - `completeness-calculator.test.js` — Tests for metrics and status calculation
- **integration/** — Integration tests (placeholder)
- **fixtures/** — Test data and sample checklists
  - `sample-complete-checklist.md` — Complete (100%) checklist
  - `sample-partial-checklist.md` — Incomplete (67%) checklist with gaps/ambiguities

## Running Tests

### From the checklist-tools directory

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run tests with coverage
npm run test:coverage
```

### From the repository root

```bash
cd .specify/templates/checklist-tools
npm ci
npm test
```

## Test Coverage

Tests validate:

- Item ID format (CHK-###-{Dimension})
- Dimension and state validation
- Gap/Ambiguity marker detection
- Checkbox parsing from markdown
- Completeness metrics calculation
- Status determination (pass/caution/fail)
- Specification approval assessment
- Traceability linkage

### Coverage Targets

- **Branches**: 70%+
- **Functions**: 70%+
- **Lines**: 70%+
- **Statements**: 70%+

Current status: See `npm run test:coverage` for latest metrics.

## Adding Tests

When adding new validators or utilities:

1. Create test file in `test/unit/{module}.test.js`
2. Follow Jest conventions (`describe`, `it`, `expect`)
3. Test happy path, edge cases, and error conditions
4. Update this README with new test coverage areas
5. Ensure coverage targets are met

## Example Test

```javascript
const { validateItem } = require('../../lib/item-validator');

describe('Item Validator', () => {
  it('should validate a correct item', () => {
    const item = {
      id: 'CHK-001-Completeness',
      question: 'Are error handling requirements defined?',
      dimension: 'Completeness',
      state: 'checked',
    };

    const result = validateItem(item);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
```

## Debugging

To run a specific test file:

```bash
npm test -- item-validator.test.js
```

To run tests matching a pattern:

```bash
npm test -- --testNamePattern="parseCheckbox"
```

To run with verbose output:

```bash
npm test -- --verbose
```

## Related

- [Schema Documentation](../MARKER_SYNTAX.md)
- [Checklist Template](../checklist-template.md)
- [JSON Schema](../checklist-schema.json)

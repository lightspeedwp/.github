# Test Fixtures & Mocks

Comprehensive test data and mock API responses for Issue Management Agent testing.

## Files

### Fixture Files

- **`issues.json`** — Sample GitHub issue data
  - `valid_issues` — Array of complete issue objects
  - `minimal_issue` — Bare-minimum required fields
  - `issue_with_special_chars` — Test markdown, mentions, links
  - `issue_with_all_fields` — Complete issue with all optional fields

- **`labels.json`** — GitHub labels data
  - `canonical_labels` — All label objects with families
  - `label_families` — List of valid label families
  - `valid_label_formats` — Examples of correct formats
  - `invalid_label_formats` — Examples of incorrect formats
  - `label_combinations` — Real-world label groupings

- **`milestones.json`** — GitHub milestones data
  - `open_milestones` — Active milestones
  - `closed_milestones` — Completed milestones
  - `milestone_with_many_issues` — Pagination test case
  - `milestone_without_due_date` — Optional field testing

### Mock Files

- **`mocks/github-api.js`** — GitHub API response mocks
  - Mock request creators (`mockSuccessRequest`, `mockErrorRequest`, etc.)
  - Organized mock responses by endpoint
  - HTTP status codes and error messages
  - Fixture getters

## Usage Examples

### Using Fixtures in Tests

```javascript
const fixtures = require('../fixtures/issues.json');

describe('Issue Creation', () => {
  test('should create issue with valid data', () => {
    const issue = fixtures.valid_issues[0];
    expect(issue.title).toBeDefined();
    expect(issue.labels).toBeInstanceOf(Array);
  });

  test('should handle minimal issue', () => {
    const minimal = fixtures.minimal_issue;
    expect(minimal.title).toBeDefined();
    expect(minimal.labels).toEqual([]);
  });
});
```

### Using Mocks in Tests

```javascript
const mocks = require('../mocks/github-api.js');

describe('GitHub Client', () => {
  test('should handle successful API response', () => {
    const response = mocks.getMockResponse('createIssue', 'success');
    expect(response.number).toBe(1234);
    expect(response.state).toBe('open');
  });

  test('should handle rate limit errors', () => {
    const error = mocks.getMockResponse('fetchMilestones', 'serverError');
    expect(error.message).toContain('Internal Server Error');
  });

  test('should mock successful HTTP request', () => {
    const mockRequest = mocks.mockSuccessRequest({
      number: 1234,
      title: 'Test Issue',
    });

    // Use with jest.mock
    jest.mock('https', () => ({
      request: mockRequest,
    }));
  });
});
```

### Using Fixture Getters

```javascript
const mocks = require('../mocks/github-api.js');

describe('Label Validation', () => {
  test('should validate canonical labels', () => {
    const labels = mocks.getFixture('labels');
    const validFormats = labels.valid_label_formats;

    validFormats.forEach((format) => {
      expect(format).toMatch(/^\w+:\w+/);
    });
  });

  test('should reject invalid formats', () => {
    const labels = mocks.getFixture('labels');
    const invalidFormats = labels.invalid_label_formats;

    invalidFormats.forEach((format) => {
      expect(format).not.toMatch(/^\w+:\w+/);
    });
  });
});
```

## Test Data Scenarios

### Issues

| Scenario | File | Use Case |
|----------|------|----------|
| Valid Issue | `valid_issues[0]` | Complete issue with all fields |
| Minimal Issue | `minimal_issue` | Bare minimum required fields |
| Special Characters | `issue_with_special_chars` | Markdown, mentions, links |
| All Fields | `issue_with_all_fields` | Maximum completeness test |

### Labels

| Scenario | Data | Use Case |
|----------|------|----------|
| Valid Format | `valid_label_formats` | Format validation tests |
| Invalid Format | `invalid_label_formats` | Error handling tests |
| By Family | Filter `canonical_labels` by family | Family-specific tests |
| Combinations | `label_combinations` | Real-world groupings |

### Milestones

| Scenario | Data | Use Case |
|----------|------|----------|
| Open Milestones | `open_milestones` | Current work tests |
| Closed Milestones | `closed_milestones` | Archive tests |
| Many Issues | `milestone_with_many_issues` | Pagination tests |
| No Due Date | `milestone_without_due_date` | Optional field tests |

## HTTP Status Codes

Available in `mocks.HTTP_STATUS`:

```javascript
const { HTTP_STATUS } = require('../mocks/github-api.js');

HTTP_STATUS.OK // 200
HTTP_STATUS.CREATED // 201
HTTP_STATUS.BAD_REQUEST // 400
HTTP_STATUS.UNAUTHORIZED // 401
HTTP_STATUS.FORBIDDEN // 403
HTTP_STATUS.NOT_FOUND // 404
HTTP_STATUS.UNPROCESSABLE_ENTITY // 422
HTTP_STATUS.INTERNAL_SERVER_ERROR // 500
```

## Error Messages

Available in `mocks.ERRORS`:

```javascript
const { ERRORS } = require('../mocks/github-api.js');

ERRORS.RATE_LIMIT // "API rate limit exceeded"
ERRORS.UNAUTHORIZED // "Bad credentials"
ERRORS.NOT_FOUND // "Not Found"
ERRORS.VALIDATION // "Validation Failed"
ERRORS.SERVER_ERROR // "Internal Server Error"
```

## Integration Patterns

### Pattern 1: Direct Fixture Usage

```javascript
test('should process valid issue', () => {
  const { valid_issues } = require('../fixtures/issues.json');
  const issue = valid_issues[0];

  const result = processIssue(issue);
  expect(result.number).toBe(issue.number);
});
```

### Pattern 2: Mock API Responses

```javascript
beforeEach(() => {
  const { mockSuccessRequest, getMockResponse } = require('../mocks/github-api.js');
  const response = getMockResponse('createIssue', 'success');

  jest.mock('https', () => ({
    request: mockSuccessRequest(response),
  }));
});
```

### Pattern 3: Fixture-Driven Tests

```javascript
test.each(require('../fixtures/labels.json').valid_label_formats)(
  'should validate %s',
  (label) => {
    expect(validateLabelFormat(label).isValid).toBe(true);
  }
);
```

### Pattern 4: Error Scenario Testing

```javascript
test('should handle rate limit errors', () => {
  const { mockRateLimitRequest } = require('../mocks/github-api.js');

  jest.mock('https', () => ({
    request: mockRateLimitRequest(),
  }));

  expect(() => makeRequest('GET', '/path')).rejects.toThrow(/rate limit/i);
});
```

## Best Practices

1. **Use Fixtures for Data** — Use fixture files for realistic test data
2. **Use Mocks for HTTP** — Use `github-api.js` mocks for API interaction tests
3. **Test Both Happy & Sad Paths** — Use success and error fixtures
4. **Keep Fixtures Current** — Update when API responses change
5. **Name Clearly** — Use descriptive names for custom test scenarios
6. **Document Dependencies** — Comment which fixtures each test needs

## Adding New Test Data

When adding new fixtures:

1. Add data to appropriate fixture file
2. Include both success and error cases
3. Use realistic GitHub API response format
4. Update this README with new scenarios
5. Link usage examples in mock functions

---

*Last updated: 2026-08-18*

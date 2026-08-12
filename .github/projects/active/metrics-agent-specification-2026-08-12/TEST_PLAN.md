---
name: Test Plan
description: Comprehensive testing strategy with full coverage requirements
type: test-plan
version: '1.0'
---

# Metrics Agent — Test Plan

## Overview

Comprehensive testing strategy to ensure the metrics agent meets all functional and non-functional requirements with >80% code coverage.

**Coverage Target:** 80-90% (critical paths 100%)

## Testing Levels

### 1. Unit Tests (40-50% of total)

**Purpose:** Test individual functions in isolation

#### 1.1 Configuration Module Tests

```javascript
describe('ConfigurationLoader', () => {
  describe('loadConfig()', () => {
    test('loads valid config file', () => {})
    test('merges defaults with provided config', () => {})
    test('throws on missing required fields', () => {})
    test('validates context value (github-control-plane|wordpress-*)', () => {})
    test('validates collection_period type and value', () => {})
  })

  describe('getMetricsSubset()', () => {
    test('returns all metrics for github-control-plane context', () => {})
    test('returns filtered metrics for wordpress-plugin context', () => {})
    test('returns filtered metrics for wordpress-theme context', () => {})
    test('throws on unknown context', () => {})
  })

  describe('validateRepositories()', () => {
    test('accepts array of owner/name pairs', () => {})
    test('validates owner and name format', () => {})
    test('throws on invalid format', () => {})
  })
})
```

**Files to Test:**

- `metrics-agent-config.js` — Configuration loading and validation
- `config-validator.js` — Config schema validation

**Target Coverage:** 100% (critical)

#### 1.2 Data Collection Module Tests

```javascript
describe('MetricsCollector', () => {
  describe('collectIssueMetrics()', () => {
    test('queries GitHub API for issues', () => {})
    test('extracts required fields (created, closed, TTF)', () => {})
    test('calculates closure rate correctly', () => {})
    test('handles empty issue list', () => {})
    test('handles API rate limiting', () => {})
  })

  describe('collectPRMetrics()', () => {
    test('queries GitHub API for pull requests', () => {})
    test('calculates time to merge', () => {})
    test('calculates code review time', () => {})
    test('calculates PR size metrics', () => {})
    test('handles draft PRs', () => {})
  })

  describe('collectContributorMetrics()', () => {
    test('identifies active contributors', () => {})
    test('counts contributions per contributor', () => {})
    test('identifies new vs returning contributors', () => {})
    test('ranks contributors by activity', () => {})
  })

  describe('error handling', () => {
    test('throws on invalid repository name', () => {})
    test('retries on transient API errors', () => {})
    test('logs failed requests', () => {})
  })
})
```

**Files to Test:**

- `metrics-collector.js` — Data collection logic
- `github-api-client.js` — GitHub API interaction

**Target Coverage:** 90%

#### 1.3 Aggregation Module Tests

```javascript
describe('MetricsAggregator', () => {
  describe('calculateDerivedMetrics()', () => {
    test('calculates average correctly', () => {})
    test('calculates median correctly', () => {})
    test('calculates percentiles (p95, p99)', () => {})
    test('handles empty data sets', () => {})
    test('handles outliers correctly', () => {})
  })

  describe('aggregateMultipleRepositories()', () => {
    test('sums metrics across repos', () => {})
    test('keeps per-repo metrics separate', () => {})
    test('calculates organization-wide averages', () => {})
    test('handles missing data from some repos', () => {})
  })

  describe('calculateTrends()', () => {
    test('compares current to previous period', () => {})
    test('calculates percentage change', () => {})
    test('identifies up/down/stable trends', () => {})
    test('flags significant changes (>10%)', () => {})
    test('handles missing previous period data', () => {})
  })
})
```

**Files to Test:**

- `metrics-aggregator.js` — Data aggregation
- `trend-calculator.js` — Trend analysis

**Target Coverage:** 85%

#### 1.4 Analysis Module Tests

```javascript
describe('MetricsAnalyzer', () => {
  describe('generateInsights()', () => {
    test('identifies performance improvements', () => {})
    test('flags capacity concerns', () => {})
    test('detects anomalies', () => {})
    test('generates recommendations', () => {})
  })

  describe('identifyAnomalies()', () => {
    test('flags unusual increases (>3 sigma)', () => {})
    test('flags unusual decreases (>3 sigma)', () => {})
    test('handles baseline calculation', () => {})
    test('returns empty array if no anomalies', () => {})
  })

  describe('generateRecommendations()', () => {
    test('recommends action for high response times', () => {})
    test('recommends action for low test coverage', () => {})
    test('recommends action for contributor decline', () => {})
  })
})
```

**Files to Test:**

- `metrics-analyzer.js` — Analysis logic
- `insight-generator.js` — Insight generation

**Target Coverage:** 80%

#### 1.5 Utilities Tests

```javascript
describe('DateUtils', () => {
  test('parseCollectionPeriod("last-7-days")', () => {})
  test('parseCollectionPeriod("last-4-weeks")', () => {})
  test('calculateDateRange() returns correct range', () => {})
})

describe('ValidationUtils', () => {
  test('validateRepoName()', () => {})
  test('validateDateFormat()', () => {})
  test('validateMetricsConfig()', () => {})
})

describe('DataTransformUtils', () => {
  test('normalizeGitHubAPIResponse()', () => {})
  test('calculateBusinessDays()', () => {})
})
```

**Target Coverage:** 95%

---

### 2. Integration Tests (30-40% of total)

**Purpose:** Test modules working together

#### 2.1 End-to-End Collection Pipeline

```javascript
describe('Metrics Collection Pipeline', () => {
  test('loads config → collects data → aggregates → packages', () => {
    // Given: Valid config file
    // When: Run full collection pipeline
    // Then: Complete metrics dataset returned
  })

  test('handles GitHub API rate limiting gracefully', () => {
    // Given: GitHub API rate limit reached
    // When: Collection pipeline running
    // Then: Retry with exponential backoff, continue on recovery
  })

  test('produces consistent results with same input', () => {
    // Given: Mock GitHub API data
    // When: Run pipeline twice
    // Then: Identical output both times
  })
})
```

**Test Data:** Fixtures in `__fixtures__/github-api-responses/`

#### 2.2 Multi-Repository Aggregation

```javascript
describe('Multi-Repository Aggregation', () => {
  test('collects from multiple repos and combines metrics', () => {
    // Given: Config with 3 repositories
    // When: Collection pipeline runs
    // Then: Aggregated metrics include all 3 repos
  })

  test('maintains per-repo metrics alongside aggregates', () => {
    // Given: Multiple repo collection
    // When: Aggregation completes
    // Then: Result has both per-repo and org-wide metrics
  })
})
```

#### 2.3 Handoff to Reporting Agent

```javascript
describe('Reporting Agent Integration', () => {
  test('packages metrics for Reporting agent', () => {
    // Given: Complete metrics dataset
    // When: Package for handoff
    // Then: Reporting agent-compatible JSON
  })

  test('handoff includes all required fields', () => {
    // Given: Packaged metrics
    // When: Validate against Reporting agent schema
    // Then: No validation errors
  })
})
```

#### 2.4 Configuration-Driven Behavior

```javascript
describe('Context-Specific Behavior', () => {
  test('collects all metrics for github-control-plane context', () => {})
  test('filters metrics for wordpress-plugin context', () => {})
  test('filters metrics for wordpress-theme context', () => {})
  test('respects custom metric subsets from config', () => {})
})
```

---

### 3. Scenario Tests (20-30% of total)

**Purpose:** Test realistic workflows

#### 3.1 Scenario: First-Time Run

```gherkin
Scenario: First time collecting metrics for a repository
  Given: New repository never measured before
  When: Run metrics collection
  Then: Collect all available history
  And: Output baseline metrics
  And: No previous period for comparison
```

**Expected Behavior:** Handle gracefully, provide baseline

#### 3.2 Scenario: Regular Weekly Collection

```gherkin
Scenario: Weekly metrics collection run
  Given: Configuration for weekly collection
  And: Previous week's metrics stored
  When: Run weekly collection job
  Then: Collect metrics for past 7 days
  And: Compare to previous week
  And: Generate trend analysis
  And: Hand off to Reporting agent
```

**Expected Behavior:** Complete within 2 minutes, consistent trends

#### 3.3 Scenario: Handling Missing Data

```gherkin
Scenario: GitHub API returns incomplete data
  Given: Some issues/PRs missing from API response
  When: Collection pipeline continues
  Then: Log data gaps
  And: Continue with available data
  And: Flag incomplete metrics in output
```

**Expected Behavior:** Partial data with clear warnings

#### 3.4 Scenario: API Rate Limiting

```gherkin
Scenario: Collection hits GitHub API rate limit
  Given: High number of repositories (>10)
  When: API rate limit reached
  Then: Retry with exponential backoff
  And: Log rate limit status
  And: Continue when limit resets
```

**Expected Behavior:** Graceful retry, eventual success

---

### 4. Performance Tests (5-10% of total)

**Purpose:** Verify non-functional requirements

```javascript
describe('Performance Requirements', () => {
  test('single repository: <30 seconds', () => {
    // Given: 1 repository
    // When: Collect metrics
    // Then: Complete within 30 seconds
  })

  test('5 repositories: <2 minutes', () => {
    // Given: 5 repositories
    // When: Collect metrics
    // Then: Complete within 120 seconds
  })

  test('API calls batched efficiently', () => {
    // Given: 5 repositories with 100s of issues
    // When: Collection runs
    // Then: Uses pagination correctly
    // And: No more API calls than necessary
  })
})
```

---

### 5. Error Handling Tests (5% of total)

**Purpose:** Ensure robustness

```javascript
describe('Error Handling', () => {
  test('invalid repository name throws clear error', () => {})
  test('missing GitHub token fails with guidance', () => {})
  test('malformed config file provides helpful message', () => {})
  test('API errors logged with context', () => {})
  test('partial failures don't crash entire pipeline', () => {})
})
```

---

## Test Fixtures & Mock Data

### Directory Structure

```
tests/
├── unit/
│   ├── config.test.js
│   ├── collector.test.js
│   ├── aggregator.test.js
│   ├── analyzer.test.js
│   └── utils.test.js
├── integration/
│   ├── pipeline.test.js
│   ├── multi-repo.test.js
│   ├── reporting-handoff.test.js
│   └── context-behavior.test.js
├── scenarios/
│   ├── first-run.test.js
│   ├── weekly-collection.test.js
│   ├── missing-data.test.js
│   └── rate-limiting.test.js
├── performance/
│   └── performance.test.js
├── error-handling/
│   └── errors.test.js
└── __fixtures__/
    ├── configs/
    │   ├── github-control-plane.json
    │   ├── wordpress-plugin.json
    │   └── wordpress-theme.json
    ├── github-api-responses/
    │   ├── issues.json
    │   ├── pull-requests.json
    │   ├── commits.json
    │   └── rate-limit.json
    └── expected-outputs/
        ├── metrics-dataset.json
        └── insights.json
```

### Mock GitHub API Client

```javascript
// tests/__mocks__/github-api-client.js
export const mockGitHubAPI = {
  issues: { /* mock issue data */ },
  pullRequests: { /* mock PR data */ },
  contributors: { /* mock contributor data */ },
};

// Usage in tests:
jest.mock('github-api-client', () => mockGitHubAPI);
```

---

## Test Execution Strategy

### Local Development

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- unit
npm test -- integration

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### CI/CD Pipeline

```yaml
# .github/workflows/metrics-agent-tests.yml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
    - run: npm ci
    - run: npm test -- --coverage
    - run: npx codecov
    - name: Fail if coverage < 80%
      run: npm test -- --coverage --coverageThreshold="{\"global\":{\"branches\":80,\"functions\":80,\"lines\":80,\"statements\":80}}"
```

---

## Coverage Goals

| Component | Target | Justification |
|-----------|--------|---------------|
| **Configuration** | 100% | Critical: Wrong config breaks everything |
| **Collection** | 90% | Important: Data accuracy crucial |
| **Aggregation** | 85% | Important: Calculations must be correct |
| **Analysis** | 80% | Important: Insights drive decisions |
| **Utilities** | 95% | Support functions: consistency |
| **Error Handling** | 85% | Must fail gracefully |
| **Overall** | 80%+ | Confidence in production readiness |

---

## Test Data Management

### Creating Test Fixtures

```bash
# 1. Export real data from GitHub (anonymized)
gh api repos/lightspeedwp/.github/issues --limit 50 > tests/__fixtures__/github-api-responses/issues.json

# 2. Anonymize sensitive data (names, emails, tokens)
npm run anonymize-fixtures

# 3. Verify fixture integrity
npm test -- --fixtures
```

### Maintenance

- Review fixtures quarterly
- Update when GitHub API changes
- Add new fixtures as new metrics are added
- Document fixture creation methodology

---

## Success Criteria

### Phase 1 Complete When

- ✅ All tests pass locally
- ✅ Coverage ≥80% overall
- ✅ Critical paths ≥95% coverage
- ✅ CI/CD validates coverage
- ✅ Test plan documented

### Phase 2 Implementation

- ✅ All test cases pass in CI
- ✅ Performance benchmarks met
- ✅ No flaky tests
- ✅ Fixtures up to date

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

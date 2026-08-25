# Metrics Agent — Expanded Implementation Details

## 1. Detailed Module Implementation

### 1.1 Configuration Module (100 LOC)

**Purpose:** Load, validate, and contextualize metrics configuration for different deployment contexts.

```javascript
/**
 * Load configuration from JSON file with environment overrides
 * @param {string} configPath - Path to config JSON file
 * @param {Object} envOverrides - Environment variable overrides {key: value}
 * @returns {Promise<ConfigObject>} Merged and validated configuration
 * @throws {ConfigurationError} If config is invalid or file not found
 * @example
 * const config = await loadConfig('./metrics.github-control-plane.config.json', {
 *   METRICS_PERIOD: 14,
 *   INCLUDE_QUALITY: true
 * });
 */
async function loadConfig(configPath, envOverrides = {}) {
  // 1. Read JSON file, parse, apply env overrides
  // 2. Apply defaults from DEFAULTS constant
  // 3. Validate against JSON schema
  // 4. Return merged config object
}

/**
 * Validate config against schema with detailed error reporting
 * @param {Object} config - Configuration object to validate
 * @returns {ValidationResult} { valid: boolean, errors: string[] }
 */
function validateConfig(config) {
  const schema = require('./metrics.schema.json');
  // Validate required fields: context, repositories, metrics
  // Check collection_period values
  // Validate repository owner/name format
  // Return detailed error list if invalid
}

/**
 * Return only metrics relevant to specified context
 * @param {string} context - 'github-control-plane' | 'wordpress-plugin' | 'wordpress-theme'
 * @param {ConfigObject} baseConfig - Full configuration
 * @returns {MetricsConfig} Subset of metrics for context
 */
function getMetricsSubset(context, baseConfig) {
  const CONTEXT_METRICS = {
    'github-control-plane': ['issues', 'pull_requests', 'contributors', 'project_health', 'quality'],
    'wordpress-plugin': ['issues', 'pull_requests', 'contributors'],
    'wordpress-theme': ['issues', 'pull_requests', 'contributors']
  };
  // Filter baseConfig.metrics to only include context-relevant ones
}
```

**Error Handling:**

- File not found: `ConfigurationError: Config file not found at {path}`
- Invalid JSON: `ConfigurationError: Invalid JSON in config file`
- Missing required fields: `ConfigurationError: Missing required field(s): {fields}`
- Invalid repository format: `ConfigurationError: Invalid repository format at index {i}`

**Edge Cases:**

- Empty repositories array
- collection_period value = 0
- metrics object with all false
- Relative paths (resolve to absolute)

---

### 1.2 Collection Module (300 LOC)

**Purpose:** Query GitHub API and extract raw metrics data with rate-limit handling.

```javascript
/**
 * Collect all issue metrics for a repository in the specified period
 * @param {Object} repo - {owner, name}
 * @param {Date} startDate - Start of collection period
 * @param {Date} endDate - End of collection period
 * @param {Object} options - {cache: boolean, retries: number}
 * @returns {Promise<IssueMetrics>}
 * @throws {APIError} If GitHub API fails after retries
 * @example
 * const issues = await collectIssueMetrics(
 *   { owner: 'lightspeedwp', name: '.github' },
 *   new Date('2026-08-05'),
 *   new Date('2026-08-12')
 * );
 */
async function collectIssueMetrics(repo, startDate, endDate, options = {}) {
  // 1. Query issues created in period (paginated)
  // 2. Query closed issues in period
  // 3. Extract time-to-first-response from comments
  // 4. Calculate stale issues (modified >30 days ago)
  // 5. Count reopened issues (closed_at then reopened)
  // 6. Aggregate results
}

/**
 * GitHub GraphQL client with exponential backoff and caching
 * @private
 */
class GitHubAPIClient {
  constructor(token, cacheConfig = { ttl: 3600 }) {
    this.token = token;
    this.cache = new Map();
    this.rateLimitRemaining = null;
  }

  /**
   * Execute GraphQL query with automatic retry on rate limit
   * @param {string} query - GraphQL query string
   * @param {Object} variables - Query variables
   * @returns {Promise<Object>} Query result
   * @throws {RateLimitError} If rate limit exhausted
   */
  async query(query, variables = {}) {
    // 1. Check cache (return if valid)
    // 2. Execute request
    // 3. Handle rate limit (429): exponential backoff + retry
    // 4. Update rateLimitRemaining from response headers
    // 5. Cache successful response
    // 6. Log metrics (API call count, cache hits)
  }
}

/**
 * Collect PR metrics including review times and CI status
 * @param {Object} repo
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<PRMetrics>}
 */
async function collectPRMetrics(repo, startDate, endDate) {
  // Query: PRs created, merged, closed in period
  // Calculate time-to-merge for each (created → merged)
  // Calculate review time (first review comment → approval)
  // Extract size metrics (additions + deletions per file count)
  // Check CI status from commit statuses
}

/**
 * Collect contributor activity metrics
 * @param {Object} repo
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<ContributorMetrics>}
 */
async function collectContributorMetrics(repo, startDate, endDate) {
  // Query: commits by author in period
  // Query: PR authors in period
  // Query: PR reviewers in period
  // Categorize: new vs returning
  // Rank: top 10 by contribution weight
}

/**
 * Collect quality indicators
 * @param {Object} repo
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<QualityMetrics>}
 */
async function collectQualityMetrics(repo, startDate, endDate) {
  // Query: check runs (CI status) in period
  // Calculate CI pass rate (successful / total)
  // Query: PR review approvals
  // Count: bug issues vs feature issues
}
```

**Rate Limit Handling:**

- Check remaining limit before each API call
- If < 100 remaining, log warning
- If limit exhausted: exponential backoff (2s, 4s, 8s, max 60s)
- Cache results (1-hour TTL) to reduce API calls
- Log rate limit usage per collection run

**Error Handling:**

- Network timeout: Retry up to 3 times with exponential backoff
- 401 Unauthorized: Log and exit (authentication failure)
- 403 Forbidden: Check rate limit; if OK, log as permission error
- 500+ Server Error: Retry up to 5 times
- Partial failure: Return data collected so far + error log

---

### 1.3 Aggregation Module (200 LOC)

**Purpose:** Transform raw data into metrics, calculate aggregates, and perform trend analysis.

```javascript
/**
 * Calculate derived metrics and aggregates from raw data
 * @param {Object[]} datasets - Array of raw metric datasets (one per repo)
 * @returns {AggregatedMetrics} Combined and calculated metrics
 * @example
 * const agg = aggregateMetrics([
 *   { repo: '.github', issues: {...}, prs: {...} },
 *   { repo: 'plugin', issues: {...}, prs: {...} }
 * ]);
 */
function aggregateMetrics(datasets) {
  // 1. Sum metrics across all repositories
  // 2. Calculate per-repo metrics separately (keep granularity)
  // 3. Calculate percentiles (p50, p95, p99) for timing metrics
  // 4. Normalize values (convert hours to days where appropriate)
  // 5. Calculate rates (closure_rate, merge_rate, etc)
  // 6. Return structured result with per-repo and organization-wide views
}

/**
 * Compare current period metrics to previous period
 * @param {AggregatedMetrics} currentMetrics
 * @param {AggregatedMetrics} previousMetrics
 * @returns {TrendAnalysis[]} Array of trend objects
 * @example
 * const trends = calculateTrends(currentWeek, previousWeek);
 * // trends[0].metric = 'closure_rate'
 * // trends[0].change_percent = 4.2 (4.2% improvement)
 * // trends[0].significant = true (>10% change)
 */
function calculateTrends(currentMetrics, previousMetrics) {
  const METRICS_TO_TRACK = [
    'closure_rate', 'avg_time_to_close', 'merge_rate',
    'avg_time_to_merge', 'review_time', 'pr_size',
    'contributor_count', 'ci_pass_rate'
  ];
  
  // For each metric:
  // 1. Calculate change_percent = ((current - previous) / previous) * 100
  // 2. Determine direction: 'up' | 'down' | 'flat'
  // 3. Mark significant if abs(change_percent) > 10
  // 4. Flag anomaly if abs(change_percent) > 30
  
  return METRICS_TO_TRACK.map(metric => ({
    metric,
    current: currentMetrics[metric],
    previous: previousMetrics[metric],
    change_percent: calculateChange(current, previous),
    direction: current > previous ? 'up' : 'down',
    significant: abs(change_percent) > 10,
    anomaly: abs(change_percent) > 30
  }));
}

/**
 * Normalize metric values for consistent comparison
 * @param {Object} metrics - Raw metrics object
 * @returns {Object} Normalized metrics (hours → days, etc)
 */
function normalizeValues(metrics) {
  // Convert timing metrics from hours to days (for readability)
  // Round percentages to 2 decimals
  // Round absolute counts to integers
  // Ensure all values within expected ranges
}
```

**Calculation Specifics:**

- **Closure Rate:** closed_issues / created_issues
- **Average Time to Close:** sum(close_timestamp - creation_timestamp) / closed_issues
- **Percentile Calculation:** Sort times, get value at position (p * count)
- **Stale Issues:** Last activity timestamp < (today - 30 days)
- **Anomaly Detection:** 3-sigma rule (> 3 std deviations from mean)

---

### 1.4 Analysis Module (250 LOC)

**Purpose:** Detect patterns, generate insights, and recommend actions.

```javascript
/**
 * Generate human-readable insights from metrics and trends
 * @param {AggregatedMetrics} metrics
 * @param {TrendAnalysis[]} trends
 * @returns {Insight[]} Array of insight objects
 * @example
 * const insights = generateInsights(metrics, trends);
 * // insights[0].category = 'performance'
 * // insights[0].finding = 'Response times improving'
 * // insights[0].trend = 'positive'
 */
function generateInsights(metrics, trends) {
  const insights = [];
  
  // CATEGORY: Performance
  if (metrics.avg_time_to_close < 48) {
    insights.push({
      category: 'performance',
      finding: 'Issue closure time excellent',
      detail: `Avg ${metrics.avg_time_to_close}hrs vs target <48hrs`,
      trend: 'positive',
      priority: 'low'
    });
  }
  
  // CATEGORY: Quality
  if (metrics.ci_pass_rate > 0.95) {
    insights.push({
      category: 'quality',
      finding: 'CI/CD pipeline stable',
      detail: `Pass rate ${(metrics.ci_pass_rate * 100).toFixed(1)}%`,
      trend: 'positive'
    });
  }
  
  // CATEGORY: Engagement
  if (trends.contributor_count?.direction === 'down') {
    insights.push({
      category: 'engagement',
      finding: 'Contributor activity declining',
      detail: `Down ${trends.contributor_count.change_percent}% vs previous period`,
      trend: 'negative',
      priority: 'high'
    });
  }
  
  return insights;
}

/**
 * Detect anomalies using statistical analysis
 * @param {AggregatedMetrics} metrics
 * @param {AggregatedMetrics[]} history - Last N periods for baseline
 * @returns {Anomaly[]} Array of detected anomalies
 */
function detectAnomalies(metrics, history = []) {
  const anomalies = [];
  
  // Calculate mean and stddev from history
  // For each metric: if value > mean + 3*stddev, flag as anomaly
  // Include: metric name, expected range, actual value, severity
  
  return anomalies;
}

/**
 * Generate actionable recommendations based on insights
 * @param {Insight[]} insights
 * @param {AggregatedMetrics} metrics
 * @returns {Recommendation[]}
 */
function makeRecommendations(insights, metrics) {
  const recommendations = [];
  
  // Rule: If closure_rate < 0.5, recommend triage process review
  if (metrics.closure_rate < 0.5) {
    recommendations.push({
      insight: 'Low closure rate',
      action: 'Review issue triage process',
      priority: 'high',
      owner: 'product-manager'
    });
  }
  
  // Rule: If stale_issues > backlog_size * 0.3, recommend cleanup
  if (metrics.stale_issues > metrics.open_issues * 0.3) {
    recommendations.push({
      insight: 'High stale issue ratio',
      action: 'Schedule backlog cleanup session',
      priority: 'medium',
      owner: 'team-lead'
    });
  }
  
  // Rule: If contributor_count declining, recommend engagement initiatives
  // Rule: If review_time > 24, recommend review SLA enforcement
  
  return recommendations;
}
```

**Pattern Detection Rules:**

- **Improving:** 3+ consecutive periods with upward trend
- **Declining:** 3+ consecutive periods with downward trend
- **Unstable:** Oscillating >20% period-over-period
- **Stagnant:** Change < 2% for 4+ periods

---

### 1.5 Packaging Module (100 LOC)

**Purpose:** Format data for handoff to Reporting agent.

```javascript
/**
 * Package complete metrics dataset with metadata and insights
 * @param {Object} analysisResult - {metrics, trends, insights, recommendations}
 * @param {ConfigObject} config - Original configuration
 * @returns {MetricsPackage} Complete package for Reporting agent
 * @example
 * const pkg = packageMetrics({ metrics, trends, insights }, config);
 * // Ready to send to Reporting agent
 */
function packageMetrics(analysisResult, config) {
  return {
    metadata: {
      agent: 'metrics-agent',
      version: '2.0',
      generated_at: new Date().toISOString(),
      collection_period: {
        start: config.period.start,
        end: config.period.end,
        duration_days: config.period.duration
      },
      context: config.context,
      repositories: config.repositories.map(r => `${r.owner}/${r.name}`)
    },
    data: analysisResult,
    summary: {
      total_metrics_collected: Object.keys(analysisResult.metrics).length,
      total_trends_detected: analysisResult.trends.length,
      total_insights_generated: analysisResult.insights.length,
      critical_issues: analysisResult.insights.filter(i => i.priority === 'high').length
    }
  };
}

/**
 * Hand off metrics to Reporting agent
 * @param {MetricsPackage} metricsPackage
 * @param {string} reportingAgentUrl - URL or identifier for Reporting agent
 * @returns {Promise<HandoffResult>}
 */
async function handoffToReporting(metricsPackage, reportingAgentUrl) {
  // 1. Validate package structure
  // 2. Create handoff message with category: 'metrics'
  // 3. Send to Reporting agent
  // 4. Wait for confirmation
  // 5. Return: { success, reportId, reportUrl }
}
```

---

## 2. Configuration Examples

### 2.1 GitHub Control Plane Configuration

**File:** `.github/config/metrics/metrics.github-control-plane.config.json`

```json
{
  "context": "github-control-plane",
  "version": "1.0",
  "description": "Weekly metrics collection for LightSpeed .github control plane",
  "collection_period": {
    "type": "days",
    "value": 7,
    "timezone": "UTC"
  },
  "repositories": [
    {
      "owner": "lightspeedwp",
      "name": ".github",
      "include_forks": false,
      "include_archived": false
    }
  ],
  "metrics": {
    "issues": {
      "enabled": true,
      "include_fields": ["created", "closed", "closure_rate", "avg_time_to_close", 
                        "active_issues", "stale_issues", "reopened", "label_distribution"]
    },
    "pull_requests": {
      "enabled": true,
      "include_fields": ["created", "merged", "merge_rate", "avg_time_to_merge",
                        "review_time", "ci_pass_rate", "avg_size"]
    },
    "contributors": {
      "enabled": true,
      "include_fields": ["active_count", "new_contributors", "top_contributors", "retention"]
    },
    "project_health": {
      "enabled": true,
      "include_fields": ["open_issues", "backlog_age", "label_distribution", "velocity"]
    },
    "quality": {
      "enabled": true,
      "include_fields": ["ci_success_rate", "code_review_approval_rate"]
    }
  },
  "analysis": {
    "trend_analysis": {
      "enabled": true,
      "compare_to_previous_period": true,
      "periods_to_compare": 4
    },
    "anomaly_detection": {
      "enabled": true,
      "zscore_threshold": 3,
      "flag_as_critical": true
    },
    "pattern_detection": {
      "enabled": true,
      "min_consecutive_periods": 3
    }
  },
  "output": {
    "format": ["json", "markdown"],
    "include_insights": true,
    "include_recommendations": true,
    "include_raw_data": false,
    "min_insight_priority": "medium"
  },
  "schedule": {
    "enabled": true,
    "cron": "0 8 * * 1",
    "description": "Every Monday at 8am UTC"
  }
}
```

### 2.2 WordPress Plugin Configuration

**File:** `.github/config/metrics/metrics.wordpress-plugin.config.json`

```json
{
  "context": "wordpress-plugin",
  "version": "1.0",
  "description": "Weekly metrics for WordPress plugin development",
  "collection_period": {
    "type": "days",
    "value": 7
  },
  "repositories": [
    {
      "owner": "lightspeedwp",
      "name": "plugin-name",
      "repo_type": "wordpress-plugin",
      "track_releases": true
    }
  ],
  "metrics": {
    "issues": true,
    "pull_requests": true,
    "contributors": true,
    "plugin_specific": {
      "enabled": false,
      "track_downloads": false,
      "track_ratings": false
    }
  },
  "analysis": {
    "trend_analysis": true,
    "anomaly_detection": true
  },
  "output": {
    "format": ["json", "markdown"],
    "include_insights": true
  }
}
```

### 2.3 Configuration Schema

**File:** `.github/config/metrics/metrics.schema.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Metrics Agent Configuration",
  "type": "object",
  "required": ["context", "repositories", "metrics"],
  "properties": {
    "context": {
      "type": "string",
      "enum": ["github-control-plane", "wordpress-plugin", "wordpress-theme"],
      "description": "Deployment context"
    },
    "repositories": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["owner", "name"],
        "properties": {
          "owner": { "type": "string", "pattern": "^[a-zA-Z0-9-]+$" },
          "name": { "type": "string", "pattern": "^[a-zA-Z0-9._-]+$" }
        }
      }
    },
    "metrics": {
      "type": "object",
      "properties": {
        "issues": { "type": "boolean" },
        "pull_requests": { "type": "boolean" },
        "contributors": { "type": "boolean" },
        "project_health": { "type": "boolean" },
        "quality": { "type": "boolean" }
      }
    },
    "collection_period": {
      "type": "object",
      "required": ["type", "value"],
      "properties": {
        "type": { "enum": ["days", "weeks", "months"] },
        "value": { "type": "integer", "minimum": 1, "maximum": 365 }
      }
    }
  }
}
```

---

## 3. Test Case Specifics

### 3.1 Unit Test Example: Configuration Module

```javascript
describe('Configuration Module', () => {
  describe('loadConfig()', () => {
    it('should load and parse JSON config file', async () => {
      // Arrange
      const configPath = './tests/__fixtures__/configs/valid.config.json';
      
      // Act
      const config = await loadConfig(configPath);
      
      // Assert
      expect(config).toBeDefined();
      expect(config.context).toBe('github-control-plane');
      expect(config.repositories).toHaveLength(1);
    });

    it('should throw ConfigurationError for missing file', async () => {
      // Arrange
      const invalidPath = './does-not-exist.json';
      
      // Act & Assert
      await expect(loadConfig(invalidPath)).rejects.toThrow(ConfigurationError);
    });

    it('should apply environment variable overrides', async () => {
      // Arrange
      const configPath = './tests/__fixtures__/configs/valid.config.json';
      const overrides = { METRICS_PERIOD: 14 };
      
      // Act
      const config = await loadConfig(configPath, overrides);
      
      // Assert
      expect(config.collection_period.value).toBe(14);
    });
  });

  describe('validateConfig()', () => {
    it('should validate correct config structure', () => {
      // Arrange
      const validConfig = {
        context: 'github-control-plane',
        repositories: [{ owner: 'lightspeedwp', name: '.github' }],
        metrics: { issues: true, pull_requests: true }
      };
      
      // Act
      const result = validateConfig(validConfig);
      
      // Assert
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      // Arrange
      const invalidConfig = { context: 'github-control-plane' };
      
      // Act
      const result = validateConfig(invalidConfig);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: repositories');
    });
  });
});
```

### 3.2 Integration Test Example: Full Pipeline

```javascript
describe('Full Metrics Pipeline', () => {
  it('should collect, aggregate, and analyze metrics end-to-end', async () => {
    // Arrange
    const config = await loadConfig('./tests/__fixtures__/configs/test.config.json');
    const mockGitHubAPI = setupMockGitHubAPI();
    
    // Act
    const rawData = await collectMetrics(config, mockGitHubAPI);
    const aggregated = aggregateMetrics([rawData]);
    const previousData = loadFixture('metrics.previous-week.json');
    const trends = calculateTrends(aggregated, previousData);
    const insights = generateInsights(aggregated, trends);
    const pkg = packageMetrics({ metrics: aggregated, trends, insights }, config);
    
    // Assert
    expect(pkg.metadata.generated_at).toBeDefined();
    expect(pkg.data.metrics.issues.created).toBeGreaterThan(0);
    expect(pkg.data.insights).toHaveLength(expect.any(Number));
    expect(pkg.summary.critical_issues).toBeLessThanOrEqual(pkg.data.insights.length);
  });
});
```

### 3.3 Performance Test Example

```javascript
describe('Performance Benchmarks', () => {
  it('should collect metrics for single repo in <30 seconds', async () => {
    // Arrange
    const config = { repositories: [{ owner: 'lightspeedwp', name: '.github' }] };
    
    // Act
    const startTime = performance.now();
    await collectMetrics(config);
    const duration = performance.now() - startTime;
    
    // Assert
    expect(duration).toBeLessThan(30000); // 30 seconds
  });

  it('should aggregate 5 repos in <5 seconds', () => {
    // Arrange
    const datasets = loadFixture('five-repos-raw-data.json');
    
    // Act
    const start = performance.now();
    aggregateMetrics(datasets);
    const duration = performance.now() - start;
    
    // Assert
    expect(duration).toBeLessThan(5000);
  });
});
```

### 3.4 Error Handling Test Example

```javascript
describe('Error Handling', () => {
  it('should handle GitHub API rate limit with exponential backoff', async () => {
    // Arrange
    const mockAPI = {
      query: jest.fn()
        .mockRejectedValueOnce({ status: 429, retryAfter: 60 })
        .mockResolvedValueOnce({ data: {...} })
    };
    
    // Act
    const result = await queryWithRetry(mockAPI, query);
    
    // Assert
    expect(result.data).toBeDefined();
    expect(mockAPI.query).toHaveBeenCalledTimes(2);
  });

  it('should return partial data on collection failure', async () => {
    // Arrange
    const config = {
      repositories: [
        { owner: 'lightspeedwp', name: '.github' },
        { owner: 'lightspeedwp', name: 'invalid-repo' }
      ]
    };
    
    // Act
    const result = await collectMetrics(config);
    
    // Assert
    expect(result.data.lightspeedwp_github).toBeDefined();
    expect(result.errors).toContain('lightspeedwp/invalid-repo: 404 Not Found');
  });
});
```

---

## 4. CI/CD Integration

### 4.1 GitHub Actions Workflow

**File:** `.github/workflows/metrics-collection.yml`

```yaml
name: Weekly Metrics Collection
on:
  schedule:
    - cron: '0 8 * * 1'  # Every Monday at 8am UTC
  workflow_dispatch:     # Manual trigger

jobs:
  collect-metrics:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: write
      pull-requests: write
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run metrics collection
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          COLLECTION_CONTEXT: github-control-plane
        run: npm run metrics:collect -- \
          --config .github/config/metrics/metrics.github-control-plane.config.json \
          --output .github/reports/metrics/

      - name: Validate metrics report
        run: npm run validate:metrics-report -- .github/reports/metrics/

      - name: Check for anomalies
        run: npm run check:metrics-anomalies -- .github/reports/metrics/

      - name: Create PR with metrics
        if: success()
        uses: actions/create-pull-request@v3
        with:
          commit-message: 'Weekly metrics report'
          title: 'Weekly Metrics Report — ${{ steps.get-date.outputs.date }}'
          body: |
            Weekly metrics collection completed successfully.
            See `.github/reports/metrics/` for detailed report.
          branch: 'metrics/weekly-${{ steps.get-date.outputs.date }}'
          delete-branch: true

      - name: Notify on failure
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: 1,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚨 Metrics collection failed. Check workflow logs.'
            })
```

### 4.2 Metrics Validation Workflow

**File:** `.github/workflows/metrics-validation.yml`

```yaml
name: Metrics Report Validation
on:
  pull_request:
    paths:
      - '.github/reports/metrics/**'
      - '.github/config/metrics/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Validate metrics JSON schema
        run: npm run validate:metrics-schema -- .github/reports/metrics/

      - name: Check data quality
        run: npm run check:metrics-quality -- .github/reports/metrics/

      - name: Detect anomalies
        run: npm run detect:anomalies -- .github/reports/metrics/

      - name: Comment with validation results
        if: always()
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const results = JSON.parse(fs.readFileSync('metrics-validation.json'));
            const body = `## Metrics Validation Results
            - Schema: ${results.schema_valid ? '✅' : '❌'}
            - Data Quality: ${results.data_quality}%
            - Anomalies Detected: ${results.anomalies.length}`;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body
            });
```

---

## 5. Operational Procedures

### 5.1 Running Metrics Collection Locally

```bash
# 1. Set GitHub token
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# 2. Run collection for GitHub control plane
npm run metrics:collect -- \
  --config .github/config/metrics/metrics.github-control-plane.config.json \
  --output ./metrics-output/

# 3. View results
cat ./metrics-output/metrics-github-control-plane-2026-08-12.json

# 4. Generate report
npm run metrics:report -- ./metrics-output/metrics-github-control-plane-2026-08-12.json
```

### 5.2 Debugging Failed Collections

**Diagnostic Steps:**

1. **Check GitHub API availability:**

   ```bash
   curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/rate_limit
   ```

2. **Verify configuration:**

   ```bash
   npm run validate:config -- .github/config/metrics/metrics.github-control-plane.config.json
   ```

3. **Check logs with verbose mode:**

   ```bash
   npm run metrics:collect -- \
     --config .github/config/metrics/metrics.github-control-plane.config.json \
     --verbose
   ```

4. **Test API connectivity per repository:**

   ```bash
   npm run test:repo-access -- \
     --repo lightspeedwp/.github \
     --token $GITHUB_TOKEN
   ```

### 5.3 Adding New Repositories

1. Update configuration:

   ```json
   "repositories": [
     { "owner": "lightspeedwp", "name": ".github" },
     { "owner": "lightspeedwp", "name": "new-repo" }  // ADD HERE
   ]
   ```

2. Validate:

   ```bash
   npm run validate:config -- config.json
   ```

3. Test access:

   ```bash
   npm run test:repo-access -- --repo lightspeedwp/new-repo
   ```

4. Run collection:

   ```bash
   npm run metrics:collect -- --config config.json --output results/
   ```

### 5.4 Updating Metric Definitions

1. Update schema in `.github/config/metrics/metrics.schema.json`
2. Update collector functions in `scripts/metrics/collector.js`
3. Update aggregator if new calculation needed
4. Add unit tests for new metric
5. Run full test suite: `npm test`
6. Update documentation in `CONFIGURATION_REFERENCE.md`

### 5.5 Monitoring Production Runs

**Check collection status:**

```bash
# Last 5 runs
npm run metrics:status -- --last 5

# For specific context
npm run metrics:status -- --context github-control-plane

# With error details
npm run metrics:status -- --verbose
```

**Alert Conditions:**

- Collection failed 2+ consecutive times
- API response time > 60 seconds
- Data quality score < 80%
- Anomalies in >30% of metrics

---

## 6. Success Metrics & KPIs

### Phase 1 Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Test Coverage | ≥80% overall, ≥95% critical paths | `npm test -- --coverage` |
| Tests Passing | 100% of 75 tests | CI/CD workflow |
| Code Review | 2+ approvals | GitHub PR checks |
| Performance (1 repo) | <30 seconds | Performance benchmarks |
| Performance (5 repos) | <2 minutes | Performance benchmarks |
| No Vulnerabilities | 0 critical | `npm audit` |

### Phase 3 Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Successful Collections | 3/3 contexts | Workflow runs |
| Alpha Test Completion | ≥4 participants | Testing checklist |
| Critical Bugs Fixed | 100% | Issue tracking |
| Reporting Integration | Verified working | Integration tests |

### Production Success Metrics

| Metric | Target | Owner |
|--------|--------|-------|
| Collection Success Rate | ≥95% over 30 days | Operations |
| Avg Collection Time | <60 seconds | Performance |
| Data Quality Score | ≥90% | Quality Assurance |
| Insight Accuracy | ≥80% (validated by humans) | Analytics |
| Team Adoption Rate | 100% of team using reports | Product |

---

## 7. Dependency & Blocker Matrix

| Dependency | Type | Status | Risk | Mitigation |
|------------|------|--------|------|-----------|
| GitHub API (v3/v4) | External | ✅ Stable | Medium | Rate limiting, caching, retries |
| Node.js 18+ | Runtime | ✅ Available | Low | Requires CI/CD update only |
| Jest (testing) | Dev | ✅ Available | Low | Part of standard setup |
| Reporting Agent | Internal | 🟡 In progress | Critical | Uses mock interface during Phase 1 |
| GitHub Actions | Platform | ✅ Available | Low | Standard workflow syntax |
| Repository Access | Permission | ✅ Available | Medium | Token requires public repo access |

---

## 8. Team Roles & Responsibilities

| Phase | Lead | Code Review | Testing | Rollout |
|-------|------|-----------|---------|---------|
| **Phase 1** | Ash Shaw | 2 reviewers | Ash Shaw | — |
| **Phase 2** | Ash Shaw | — | QA | — |
| **Phase 3** | Ash Shaw | Lead + 1 other | Alpha testers | Ash Shaw |
| **Phase 4** | — | — | — | Ash Shaw + ops |

### Code Review Approvers

- Primary: Ash Shaw (metrics agent expert)
- Secondary: DevOps/Infra team member (API/performance)
- Optional: Analytics team member (insights relevance)

### Testing Responsibility

- **Unit tests:** Implementation developer
- **Integration tests:** Implementation developer + DevOps
- **Alpha testing:** 4 selected participants (2 .github, 1 plugin, 1 theme)

### Rollout Owner

- **Production deployment:** Ash Shaw
- **Monitoring setup:** DevOps team
- **Team training:** Product manager
- **Ongoing maintenance:** Rotating ownership

---

## Appendix A: Mock Data for Testing

**File:** `tests/__fixtures__/github-api-responses/issues.json`

```json
{
  "data": {
    "repository": {
      "issues": {
        "totalCount": 24,
        "nodes": [
          {
            "id": "I_kwDOGxyzAA1234567",
            "number": 1001,
            "title": "Fix: Branch naming validation",
            "createdAt": "2026-08-05T10:00:00Z",
            "closedAt": "2026-08-07T14:30:00Z",
            "labels": {
              "nodes": [{ "name": "type:bug" }, { "name": "priority:high" }]
            }
          }
        ]
      }
    }
  }
}
```

---

## Appendix B: Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server
npm test               # Run all tests
npm run test:unit      # Unit tests only
npm run test:integration # Integration tests
npm run coverage       # Coverage report

# Operations
npm run metrics:collect -- --config {config-file}
npm run metrics:status  # Check collection status
npm run validate:config # Validate configuration
npm run validate:metrics-report # Validate report

# Maintenance
npm run lint           # Lint code
npm run format         # Format code
npm audit              # Security audit
npm update             # Update dependencies
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

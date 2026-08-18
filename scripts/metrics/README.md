# Metrics Agent System — Comprehensive Guide

**Phase:** 2 (Complete)  
**Status:** ✅ Production Ready  
**Last Updated:** 2026-08-21

## Overview

The Metrics Agent is an automated system for collecting, analyzing, and reporting on repository metrics. It runs daily, aggregates GitHub data, detects anomalies, and generates actionable reports for stakeholders.

## Architecture

### Three-Layer Design

```
┌─────────────────────────────────────────────────────┐
│          REPORTING LAYER (Task 2.4)                 │
│  - Markdown report generation                       │
│  - GitHub issue creation                            │
│  - Health score calculation                         │
└─────────────────────────────────────────────────────┘
                         ↑
┌─────────────────────────────────────────────────────┐
│          ANALYSIS LAYER (Task 2.2)                  │
│  - Trend analysis                                   │
│  - Anomaly detection                                │
│  - Time-series storage                              │
└─────────────────────────────────────────────────────┘
                         ↑
┌─────────────────────────────────────────────────────┐
│        COLLECTION LAYER (Task 2.1 & 2.3)            │
│  - GitHub API integration                           │
│  - Metrics collection                               │
│  - Pagination & error handling                      │
└─────────────────────────────────────────────────────┘
```

## Components

### 1. Metrics Agent (`metrics-agent.js`)
**Purpose:** GitHub API client with full metrics collection

**Key Methods:**
- `fetchMetrics()` — Retrieves comprehensive metrics from GitHub API
- `fetchIssues()` — Gets issue data with pagination
- `fetchPullRequests()` — Retrieves PR metrics
- `fetchContributors()` — Collects contributor information
- `handleRateLimit()` — Manages API rate limits

**Features:**
- Pagination support (per_page up to 100)
- Automatic retry with exponential backoff
- Rate limit awareness
- Comprehensive error handling

### 2. Metrics Storage (`metrics-storage.js`)
**Purpose:** Persistent time-series storage for historical data

**Key Methods:**
- `saveMetrics(repository, metrics)` — Persists daily metrics
- `getLatestMetrics(repository)` — Retrieves most recent data
- `getMetricsHistory(repository)` — Gets historical data for trends
- `getMetricsRange(repository, startDate, endDate)` — Range queries

**Storage Structure:**
```
.github/reports/metrics/
├── lightspeedwp-github/
│   ├── 2026-08-21.json      # Daily snapshot
│   ├── 2026-08-20.json
│   └── ...
└── time-series.json         # Consolidated history
```

### 3. Trend Analyzer (`trend-analyzer.js`)
**Purpose:** Calculates trends and patterns

**Key Methods:**
- `analyzeTrends(repository, storage)` — Computes trend metrics
- `calculateWeekOverWeek()` — Weekly change analysis
- `calculateMonthOverMonth()` — Monthly patterns
- `forecastNextPeriod()` — Predicts future trends

**Trend Metrics:**
- Issue closure rate trends
- PR merge rate velocity
- Contributor growth
- Stability indicators

### 4. Anomaly Detector (`anomaly-detector.js`)
**Purpose:** Identifies unusual patterns

**Key Methods:**
- `detectAnomalies(repository, metrics, trends)` — Finds outliers
- `compareToBaseline(current, baseline)` — Deviation detection
- `calculateSeverity(deviation)` — Impact assessment

**Detection Types:**
- Issue closure rate drops
- PR review time increases
- Unexpected contributor changes
- CI failure rate spikes

### 5. Metrics Reporter (`metrics-reporter.js`)
**Purpose:** Generates markdown reports

**Key Methods:**
- `generateReport(repository, options)` — Creates full report
- `calculateHealthScore(metrics, trends)` — 0-100 score
- `generateChart(label, data)` — ASCII visualizations

**Report Sections:**
1. Header (title, date)
2. Summary (health score, key metrics)
3. Issues (total, closed, closure rate)
4. Pull Requests (merge stats, review time)
5. Contributors (active, new, returning)
6. Health Status (assessment)
7. Anomalies (detected issues)
8. Trends (historical patterns)
9. Footer (metadata)

### 6. GitHub Issue Creator (`github-issue-creator.js`)
**Purpose:** Manages metrics issues on GitHub

**Key Methods:**
- `createMetricsIssue()` — Creates new report issue
- `createWeeklyMetricsIssue()` — Weekly wrapper
- `createMonthlyMetricsIssue()` — Monthly wrapper
- `closeOldReports()` — Cleanup (>90 days)
- `getMetricsIssues()` — Retrieval
- `createMetricsIssueWithRetry()` — Resilient creation

**Labels Applied:**
- `type:metrics` — Issue type
- `area:monitoring` — Area
- `period:weekly` or `period:monthly` — Period

## Workflows

### 1. Collection Workflow (`.github/workflows/metrics-collection.yml`)

**Schedule:** Daily at 2 AM UTC (configurable)

**Jobs:**
1. **collect-metrics**
   - Validates config
   - Calls orchestrator
   - Commits results
   - Pushes to develop

2. **validate-results**
   - Verifies data integrity
   - Checks storage validity

**Execution Time:** < 1 minute

### 2. Reporting Workflow (`.github/workflows/metrics-reporting.yml`)

**Schedule:** Weekly on Monday 2:30 AM UTC (configurable)

**Jobs:**
1. **generate-report**
   - Generates markdown reports
   - Creates GitHub issues
   - Closes old reports
   - Uploads artifacts

2. **validate-issues**
   - Verifies issue creation
   - Reports statistics

**Execution Time:** < 1 minute

## Usage Guide

### Running Manually

#### Collection
```bash
# Trigger collection workflow
gh workflow run metrics-collection.yml \
  -f context=github-control-plane \
  -f dryRun=false
```

#### Reporting
```bash
# Trigger reporting workflow
gh workflow run metrics-reporting.yml \
  -f reportType=weekly \
  -f includeArchive=false
```

### Integration with CI/CD

```yaml
# In your workflow
- name: Trigger Metrics Collection
  run: |
    gh workflow run metrics-collection.yml \
      -f context=${{ github.repository }}
```

### Local Testing

```bash
# Run all metrics tests
npm test -- scripts/metrics/__tests__/

# Integration tests only
npm test -- scripts/metrics/__tests__/integration.test.js

# Performance benchmarks
npm test -- scripts/metrics/__tests__/performance.test.js

# Security validation
npm test -- scripts/metrics/__tests__/security.test.js
```

## Configuration

### Repository Configuration
**File:** `.github/scripts/workflows/metrics-config.json`

```json
{
  "schedule": {
    "cron": "0 2 * * *",
    "timezone": "UTC"
  },
  "execution": {
    "parallelJobs": 1,
    "timeoutMinutes": 30
  },
  "repositories": [
    {
      "owner": "lightspeedwp",
      "repo": ".github",
      "context": "github-control-plane",
      "enabled": true
    }
  ],
  "storage": {
    "basePath": ".github/reports/metrics",
    "retention": { "days": 365 }
  }
}
```

### Health Score Weights

The health score (0-100) is calculated as:

```
Score = 50 (base)
  + (issue_closure_rate × 25%)      [0-25 points]
  + (pr_merge_rate × 25%)            [0-25 points]
  + min(active_contributors/10 × 20%, 20%)  [0-20 points]
  - min(anomaly_count × 5, 30%)     [-0 to -30 points]
```

**Interpretation:**
- **80-100:** ✅ Healthy
- **60-80:** ⚠️  Fair
- **0-60:** ❌ Needs Attention

## Performance Characteristics

### Collection
- Single repository: < 30 seconds
- 10 repositories (parallel): < 5 minutes
- Per-repo enrichment: < 100ms

### Storage
- Write: < 1 second
- Read (52 weeks): < 500ms

### Analysis
- Trend calculation: < 100ms/repo
- Anomaly detection: < 50ms/repo

### Reporting
- Report generation: < 2 seconds/repo
- Issue creation: < 5 seconds/repo
- Workflow total: < 5 minutes

### Scalability
- Linear scaling with repository count
- Parallel execution: 2-4x speedup
- Memory: < 10MB for 10 repos/year

## Security

### Token Handling
- ✅ Never logged or exposed
- ✅ Masked in error messages
- ✅ Minimum scope: `repo:read`, `issues:write`

### Input Validation
- ✅ Repository name validation
- ✅ Path traversal prevention
- ✅ Period parameter validation
- ✅ Metrics structure validation

### Output Sanitization
- ✅ XSS prevention in reports
- ✅ No personal information exposure
- ✅ No internal system data
- ✅ Markdown escaping

### Rate Limiting
- ✅ GitHub API rate limit respect
- ✅ Exponential backoff on errors
- ✅ Concurrent request limiting
- ✅ Automatic retry logic

## Testing

### Test Suite Coverage
- **Unit Tests:** 96 tests across all components
- **Integration Tests:** 15+ end-to-end scenarios
- **Performance Tests:** 20+ benchmarks
- **Security Tests:** 25+ validation checks

### Test Categories

1. **Metrics Agent Tests** (30 tests)
   - GitHub API integration
   - Pagination handling
   - Error scenarios
   - Rate limit management

2. **Storage Tests** (25 tests)
   - Data persistence
   - Retrieval accuracy
   - History management
   - Cleanup operations

3. **Analysis Tests** (20 tests)
   - Trend calculation
   - Anomaly detection
   - Baseline comparison
   - Forecast generation

4. **Reporter Tests** (14 tests)
   - Report generation
   - Health score calculation
   - Section rendering
   - Error handling

5. **Issue Creator Tests** (34 tests)
   - Issue creation
   - Label management
   - Old report closure
   - Retry logic

6. **Integration Tests** (15 tests)
   - Full pipeline
   - Data consistency
   - Error recovery
   - Concurrent operations

7. **Performance Tests** (20 tests)
   - Collection benchmarks
   - Storage performance
   - Analysis speed
   - Workflow timing

8. **Security Tests** (25 tests)
   - Token security
   - Input validation
   - Output sanitization
   - Rate limiting
   - Data privacy

## Troubleshooting

### Common Issues

**Issue: GitHub API rate limit exceeded**
```
Solution: Check rate limit status
gh api rate_limit

Workflow: Automatic backoff with exponential delay
```

**Issue: Metrics data not persisting**
```
Solution: Verify .github/reports/metrics/ permissions
ls -la .github/reports/metrics/

Action: Ensure Git tracks the directory
git add .github/reports/metrics/.gitkeep
```

---

## Related Documentation

- **Specification:** `.github/projects/active/metrics-agent-specification-2026-08-12/SPECIFICATION.md`
- **Architecture:** `.github/projects/active/metrics-agent-specification-2026-08-12/ARCHITECTURE.md`
- **Test Plan:** `.github/projects/active/metrics-agent-specification-2026-08-12/TEST_PLAN.md`
- **Progress Tracking:** `scripts/metrics/PROGRESS.md`

---

**Issue: Reports not creating GitHub issues**
```
Solution: Verify GITHUB_TOKEN secret
gh secret list

Action: Ensure token has issues:write scope
```

**Issue: Workflow timeout**
```
Solution: Check workflow execution time
gh run view <run-id> --log

Action: Increase timeout in workflow config
```

## Extension Points

### Adding New Metrics

1. Extend `MetricsAgent.fetchMetrics()`
2. Add fields to metrics structure
3. Update storage schema
4. Add trend calculation in `TrendAnalyzer`
5. Update report sections in `MetricsReporter`
6. Add tests for new metrics

### Custom Reporting

1. Extend `MetricsReporter` class
2. Add new `generateXSection()` methods
3. Customize health score calculation
4. Update report template

### Integration with External Systems

1. Use GitHub Actions webhook events
2. Post reports to Slack/Discord via Actions
3. Export metrics to external dashboards
4. Create custom workflows using reports

## References

- **GitHub API:** https://docs.github.com/en/rest
- **GitHub Actions:** https://docs.github.com/en/actions
- **Octokit JS:** https://octokit.github.io/rest.js/
- **Markdown:** https://guides.github.com/features/mastering-markdown/

## Maintenance

### Regular Tasks

- **Weekly:** Review generated reports for accuracy
- **Monthly:** Check old report closure (90+ day auto-close)
- **Quarterly:** Review and update trend baselines
- **Annually:** Archive old metrics, plan improvements

### Monitoring

- Watch workflow runs for failures
- Monitor GitHub API usage
- Track storage growth
- Validate report accuracy

## Contributing

See [CLAUDE.md](../../CLAUDE.md) for contribution guidelines and coding standards.

### Making Changes

1. Update metrics-agent.js
2. Add corresponding tests in metrics-agent.test.js
3. Update PROGRESS.md
4. Run tests: `npm test -- scripts/metrics/__tests__/metrics-agent.test.js`
5. Ensure >80% coverage

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review workflow logs: `gh run view <run-id> --log`
3. Check test results: `npm test -- scripts/metrics/__tests__/`
4. File GitHub issue with details

---

<<<<<<< HEAD
**Metrics Agent Phase 2** | Complete | Production Ready | 2026-08-21
=======
Last updated: 2026-08-12

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.
>>>>>>> 70770362e (test(accessibility): README.md update script testing + Mermaid accessibility enhancement)

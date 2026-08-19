---
name: Metrics Agent
description: Multi-context metrics collection and analysis for GitHub and WordPress repositories
type: documentation
version: '1.0'
---

# Metrics Agent

A universal metrics collection and analysis agent supporting GitHub control plane and WordPress repositories. Collects, aggregates, analyzes, and reports on repository health metrics.

**Status:** Phase 1 Implementation (Aug 12-26)
**Coverage:** 75+ tests, >80% code coverage
**Maturity:** Beta (ready for integration testing)

---

## Quick Start

### Basic Usage

```bash
# Collect metrics for GitHub control plane
node scripts/metrics/metrics-agent.js scripts/metrics/config/github-control-plane.json

# Collect metrics for WordPress plugin
node scripts/metrics/metrics-agent.js scripts/metrics/config/wordpress-plugin.json

# Collect metrics for WordPress theme
node scripts/metrics/metrics-agent.js scripts/metrics/config/wordpress-theme.json
```

### Output

Metrics are written to `.github/reports/metrics/metrics-YYYY-MM-DD.json`:

```json
{
  "schema_version": "1.0",
  "generated_at": "2026-08-12T14:30:00.000Z",
  "context": "github-control-plane",
  "collection_period": 7,
  "metrics": {
    "total_repositories": 1,
    "total_issues": 42,
    "total_prs": 28,
    "avg_issue_closure_rate": "78.50",
    "avg_pr_merge_rate": "85.00",
    "total_contributors": 12
  },
  "insights": [
    {
      "type": "stale-issues",
      "severity": "warning",
      "message": "Found 3 stale issues (no activity >30 days). Consider reopening or closing."
    }
  ],
  "recommendations": [
    {
      "action": "triage-stale-issues",
      "priority": "high",
      "description": "Create triage task to review and close/reopen stale issues"
    }
  ],
  "health_score": 82,
  "data_sources": ["lightspeedwp/.github"]
}
```

---

## Configuration

### Configuration File Format

```json
{
  "context": "github-control-plane",
  "repositories": [
    {
      "owner": "lightspeedwp",
      "name": ".github"
    }
  ],
  "metrics": {
    "issues": ["total", "closed", "ttf", "active", "stale", "reopened", "labels"],
    "pull_requests": ["total", "merged", "ttm", "review_time", "participation", "size", "ci_pass_rate"],
    "contributors": ["active", "breakdown", "top", "retention", "new_vs_returning"],
    "health": ["milestone_progress", "epic_status", "backlog", "label_distribution", "velocity"]
  },
  "collection_period": 7,
  "cache_ttl": 3600,
  "output_dir": ".github/reports/metrics"
}
```

### Supported Contexts

| Context | Metrics | Use Case |
|---------|---------|----------|
| `github-control-plane` | All 7 categories | GitHub organization .github control plane |
| `wordpress-plugin` | Filtered (issues, PRs, contributors) | WordPress plugin repositories |
| `wordpress-theme` | Filtered (issues, PRs, contributors) | WordPress theme repositories |

### Configuration Fields

- **context** (required): One of `github-control-plane`, `wordpress-plugin`, `wordpress-theme`
- **repositories** (required): Array of `{owner, name}` pairs
- **metrics** (optional): Metric categories and specific metrics to collect. Defaults to context-appropriate set.
- **collection_period** (required): Number of days to collect metrics for (e.g., 7, 14, 30)
- **cache_ttl** (optional): Cache time-to-live in seconds (default: 3600)
- **github_token** (optional): GitHub API token. Falls back to `GITHUB_TOKEN` env var.
- **output_dir** (optional): Where to write reports (default: `.github/reports/metrics`)

### Environment Variables

```bash
# GitHub API token (required)
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# Run agent
node scripts/metrics/metrics-agent.js scripts/metrics/config/github-control-plane.json
```

---

## Metrics Reference

### Issue Metrics

| Metric | Description |
|--------|-------------|
| `total` | Total issues created in period |
| `closed` | Issues closed in period |
| `closure_rate` | Percentage of created issues that were closed |
| `ttf` | Time to first response (avg, median, p95) |
| `active` | Issues still open/active |
| `stale` | Issues with no activity >30 days |
| `reopened` | Count of reopened issues |
| `labels` | Distribution of issue labels |

### Pull Request Metrics

| Metric | Description |
|--------|-------------|
| `total` | Total PRs created in period |
| `merged` | PRs merged in period |
| `merge_rate` | Percentage of PRs that were merged |
| `ttm` | Time to merge (avg, median, p95) |
| `review_time` | Code review time (average) |
| `participation` | Code review participation rate |
| `size` | Average PR size (lines changed) |
| `ci_pass_rate` | CI/CD pass rate (%) |

### Contributor Metrics

| Metric | Description |
|--------|-------------|
| `active` | Active contributors in period |
| `breakdown` | Breakdown by issues, PRs, reviews |
| `top` | Top contributors ranking |
| `retention` | Contributor retention trends |
| `new_vs_returning` | New vs returning contributor ratio |

### Health Metrics

| Metric | Description |
|--------|-------------|
| `milestone_progress` | Milestone completion % |
| `epic_status` | Epic status tracking |
| `backlog` | Backlog size and age |
| `label_distribution` | Distribution of label types |
| `velocity` | Issues/PRs per sprint or period |

---

## API Reference

### Classes

#### ConfigurationLoader

Loads and validates configuration files.

```javascript
const config = ConfigurationLoader.loadConfig('config.json');
ConfigurationLoader.validateConfig(config);
const subset = ConfigurationLoader.getMetricsSubset(config);
```

#### GitHubAPIClient

Queries GitHub API with rate limiting and caching.

```javascript
const client = new GitHubAPIClient(token);
const issues = await client.getIssues(owner, repo, since, until);
const prs = await client.getPullRequests(owner, repo, since, until);
const contributors = await client.getContributors(owner, repo);
```

#### MetricsCollector

Collects and calculates metrics from API responses.

```javascript
const collector = new MetricsCollector(client, config);
const data = await collector.collect(repository);
```

**Collected Data Structure:**

```javascript
{
  repository: "owner/name",
  period: { since: "2026-08-01T00:00:00Z", until: "2026-08-12T00:00:00Z" },
  metrics: {
    issues: { total, closed, closure_rate, ttf_avg, ttf_median, ttf_p95, active, stale, reopened, labels },
    pull_requests: { total, merged, merge_rate, ttm_avg, ttm_median, ttm_p95, avg_size, ci_pass_rate, review_time_avg },
    contributors: { active, top_contributors, total_contributions }
  }
}
```

#### MetricsAggregator

Aggregates metrics across repositories and calculates trends.

```javascript
const aggregated = MetricsAggregator.aggregate(collectedData, previousData);
// aggregated.summary, aggregated.trends, aggregated.anomalies
```

#### InsightsAnalyzer

Generates insights and recommendations from aggregated metrics.

```javascript
const analysis = InsightsAnalyzer.analyze(aggregatedData);
// analysis.insights, analysis.recommendations, analysis.health_score
```

#### MetricsReporter

Packages metrics and hands off to reporting system.

```javascript
const report = await MetricsReporter.packageMetrics(analysis, config);
const result = await MetricsReporter.handoffToReporting(report, config);
```

---

## Testing

### Run All Tests

```bash
npm test -- scripts/metrics/__tests__/metrics-agent.test.js
```

### Run with Coverage

```bash
npm test -- --coverage scripts/metrics/__tests__/metrics-agent.test.js
```

### Watch Mode

```bash
npm test -- --watch scripts/metrics/__tests__/metrics-agent.test.js
```

### Test Coverage

Target: **>80% overall, >95% for critical paths**

| Category | Tests | Coverage |
|----------|-------|----------|
| Configuration | 13 | 100% |
| GitHub API | 10 | 95% |
| Metrics Collector | 18 | 90% |
| Aggregation | 15 | 85% |
| Analysis | 12 | 85% |
| Reporting | 4 | 80% |
| Integration | 3 | 80% |
| **Total** | **75** | **>82%** |

---

## Error Handling

The agent includes comprehensive error handling:

### Configuration Errors

```javascript
// Missing required fields
ConfigurationLoader.validateConfig({});
// Error: Missing required config fields: context, repositories, metrics, collection_period

// Invalid context
ConfigurationLoader.validateConfig({ context: 'invalid' });
// Error: Invalid context: invalid. Must be one of: github-control-plane, wordpress-plugin, wordpress-theme

// Invalid repositories
ConfigurationLoader.validateConfig({ repositories: [] });
// Error: repositories must be a non-empty array
```

### API Errors

```javascript
// Rate limiting handled with exponential backoff
// Max retry: 3 attempts, max wait: 60s

// API errors logged and reported
collector.collect(repo);
// Error: GitHub API error 403: Forbidden
```

### Data Validation

```javascript
// Missing/incomplete data handled gracefully
const ttf = collector.percentile([], 0.5);
// Returns: "0.00"

const avgSize = collector.averagePRSize([]);
// Returns: 0
```

---

## Integration with Other Agents

### Reporting Agent

Metrics are packaged for handoff to the Reporting Agent:

```javascript
const report = await MetricsReporter.packageMetrics(analysis, config);
// report: {
//   schema_version, generated_at, context, collection_period,
//   metrics, insights, recommendations, health_score, data_sources
// }

await MetricsReporter.handoffToReporting(report, config);
// Writes to: .github/reports/metrics/metrics-YYYY-MM-DD.json
```

The Reporting Agent can then:

- Format metrics into Markdown
- Create GitHub issue summaries
- Post to Slack/Discord
- Update GitHub projects
- Archive historical data

---

## Performance Characteristics

### Expected Performance

| Operation | Time | Notes |
|-----------|------|-------|
| Single repository | <30s | Includes API calls + processing |
| 5 repositories | <2m | Sequential collection with caching |
| Cache hit | <1s | JSON parse + aggregation |
| Report generation | <5s | File I/O + JSON stringify |

### Scaling Considerations

- **API Rate Limit:** 5,000 requests/hour (GitHub)
- **Per-repo requests:** ~50-100
- **Max repos/run:** ~40-50 with typical 5,000 requests limit
- **Pagination:** Automatic, handles large datasets

---

## Configuration Examples

### Multi-Repository GitHub Control Plane

```json
{
  "context": "github-control-plane",
  "repositories": [
    { "owner": "lightspeedwp", "name": ".github" },
    { "owner": "lightspeedwp", "name": "awesome-github" }
  ],
  "collection_period": 7
}
```

### Organization-Wide Metrics

```json
{
  "context": "github-control-plane",
  "repositories": [
    { "owner": "org", "name": "repo1" },
    { "owner": "org", "name": "repo2" },
    { "owner": "org", "name": "repo3" },
    { "owner": "org", "name": "repo4" },
    { "owner": "org", "name": "repo5" }
  ],
  "collection_period": 30
}
```

### WordPress Plugin/Theme Portfolio

```json
{
  "context": "wordpress-plugin",
  "repositories": [
    { "owner": "lightspeedwp", "name": "lswp-custom-fields-pro" },
    { "owner": "lightspeedwp", "name": "lswp-cache-optimizer" }
  ],
  "collection_period": 14
}
```

---

## Troubleshooting

### "GitHub token required" Error

**Cause:** No GitHub token provided.

**Fix:**

```bash
export GITHUB_TOKEN=your_token_here
node scripts/metrics/metrics-agent.js config.json
```

### "Rate limit exceeded" Error

**Cause:** Too many API calls in short time.

**Fix:**

- Agent automatically retries with exponential backoff
- Reduce collection_period or number of repositories
- Check GitHub token has appropriate permissions

### "Configuration file not found" Error

**Cause:** Config file path is incorrect.

**Fix:**

```bash
# Verify file exists
ls -la scripts/metrics/config/github-control-plane.json

# Use absolute path if needed
node scripts/metrics/metrics-agent.js /full/path/to/config.json
```

---

## Related Documentation

- **Specification:** `.github/projects/active/metrics-agent-specification-2026-08-12/SPECIFICATION.md`
- **Architecture:** `.github/projects/active/metrics-agent-specification-2026-08-12/ARCHITECTURE.md`
- **Test Plan:** `.github/projects/active/metrics-agent-specification-2026-08-12/TEST_PLAN.md`
- **Progress Tracking:** `scripts/metrics/PROGRESS.md`

---

## Contributing

See [CLAUDE.md](../../CLAUDE.md) for contribution guidelines and coding standards.

### Making Changes

1. Update metrics-agent.js
2. Add corresponding tests in metrics-agent.test.js
3. Update PROGRESS.md
4. Run tests: `npm test -- scripts/metrics/__tests__/metrics-agent.test.js`
5. Ensure >80% coverage

---

## License

This agent is part of the LightSpeedWP `.github` control plane. See LICENSE for details.

---

Last updated: 2026-08-12

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

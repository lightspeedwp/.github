---
name: Metrics Integrations Module
description: Integration adapters for connecting metrics to downstream agents
type: documentation
version: 1.0.0
---

# Metrics Integrations Module

Integration adapters for connecting Metrics Agent output to downstream systems: Meta Agent, Reporting Agent, and GitHub Issues.

## Overview

This module transforms raw metrics collected by the Metrics Agent into structured input formats for:

1. **Meta Agent** — Provides metrics context for agentic decision-making
2. **Reporting Agent** — Formats metrics for human-readable reports
3. **GitHub Issues** — Creates actionable issues from anomalies

## Directory Structure

```
scripts/metrics/integrations/
├─ meta-agent-adapter.js          # Meta Agent context provider
├─ reporting-agent-input.js       # Report formatter
├─ issue-templates.js             # GitHub issue generator
├─ __tests__/
│  ├─ meta-agent-adapter.test.js
│  ├─ reporting-agent-input.test.js
│  ├─ issue-templates.test.js
│  └─ fixtures/
│     ├─ sample-metrics.json      # Example metrics data
│     ├─ expected-meta-context.json
│     └─ expected-weekly-report.json
└─ README.md                       # This file
```

## Module: Meta Agent Adapter

Transforms raw metrics into context for Meta Agent decision-making.

### Class: `MetricsContextProvider`

```javascript
const MetricsContextProvider = require('./meta-agent-adapter');

const provider = new MetricsContextProvider({
  metricsDir: '.github/reports/metrics',
  validateSchema: true,
  cacheExpiry: 3600000 // 1 hour
});
```

### Methods

#### `loadLatestMetrics(context)`

Load latest metrics from reports directory.

```javascript
const metrics = await provider.loadLatestMetrics('control-plane');
```

#### `formatForMetaAgent(rawMetrics)`

Format raw metrics as context for Meta Agent.

```javascript
const context = provider.formatForMetaAgent(rawMetrics);
// Returns: { type, timestamp, healthScore, topIssues, recommendations, ... }
```

#### `getMetricsContext(context)`

Full pipeline: load + format metrics.

```javascript
const fullContext = await provider.getMetricsContext('control-plane');
```

### Output Example

```json
{
  "type": "metrics-context",
  "timestamp": "2026-08-19T02:00:00Z",
  "healthScore": 75,
  "healthComponents": {
    "responseTime": 80,
    "closureRate": 71,
    "codeQuality": 87
  },
  "topIssues": [
    {
      "title": "Stale issues need review",
      "metric": "staleIssues",
      "current": 8,
      "percentChange": 60,
      "severity": "high"
    }
  ],
  "recommendations": [
    {
      "action": "Prioritize stale issues",
      "priority": "high",
      "effort": "medium",
      "owner": "team-leads",
      "timeframe": "this week"
    }
  ]
}
```

## Module: Reporting Agent Input

Formats metrics into structured reports for Reporting Agent.

### Class: `MetricsReportFormatter`

```javascript
const MetricsReportFormatter = require('./reporting-agent-input');

const formatter = new MetricsReportFormatter({
  metricsDir: '.github/reports/metrics',
  reportDir: '.github/reports/metrics'
});
```

### Methods

#### `formatForReportingAgent(rawMetrics, reportType)`

Format metrics for Reporting Agent.

```javascript
const report = formatter.formatForReportingAgent(rawMetrics, 'weekly');
// Supported types: weekly, monthly, quarterly, context
```

#### `generateWeeklyReport(rawMetrics)`

Generate weekly report format.

```javascript
const report = formatter.generateWeeklyReport(rawMetrics);
```

#### `generateMonthlyReport(rawMetrics)`

Generate monthly report format.

#### `generateQuarterlyReport(rawMetrics)`

Generate quarterly report format.

### Report Structure

```json
{
  "type": "metrics-report",
  "reportType": "weekly",
  "timestamp": "2026-08-19T02:00:00Z",
  "period": {
    "start": "2026-08-12T00:00:00Z",
    "end": "2026-08-19T02:00:00Z",
    "label": "Week of August 12-19, 2026"
  },
  "executive_summary": {
    "healthScore": 75,
    "trend": "stable",
    "status": "healthy",
    "topPriority": "Address stale issues accumulation"
  },
  "metrics": {
    "issues": { "total": 145, "closureRate": "71%", "staleIssues": 8 },
    "pullRequests": { "total": 23, "mergeRate": "78%", "averageReviewTime": 1.5 },
    "contributors": { "active": 12 },
    "codeQuality": { "testCoverage": "87%", "ciPassRate": "92%" }
  },
  "trends": { ... },
  "anomalies": [ ... ],
  "insights": [ ... ],
  "recommendations": [ ... ],
  "health_components": { ... },
  "nextSteps": [ ... ]
}
```

## Module: Issue Templates

Generates actionable GitHub issues from metrics anomalies.

### Class: `IssueTemplateGenerator`

```javascript
const IssueTemplateGenerator = require('./issue-templates');

const generator = new IssueTemplateGenerator({
  org: 'lightspeedwp',
  repo: '.github'
});
```

### Methods

#### `generateStaleIssuesAlert(metrics)`

Generate alert for stale issue accumulation.

```javascript
const issue = generator.generateStaleIssuesAlert(metrics);
// Returns issue object if staleIssues > threshold
```

#### `generatePRReviewDegradation(metrics)`

Generate alert for increasing PR review times.

#### `generateHealthAlert(metrics)`

Generate alert for low repository health score.

#### `generateTeamCapacityAlert(metrics)`

Generate alert for low team capacity.

#### `generateAllIssues(metrics)`

Generate all applicable issues from metrics.

```javascript
const issues = generator.generateAllIssues(metrics);
// Returns array of issue objects
```

### Issue Output Example

```json
{
  "title": "🚨 Metrics Alert: Stale Issues Accumulating",
  "body": "## Metric Alert: Stale Issue Accumulation\n\n**Metric:** Stale Issues (>30 days)\n**Current:** 8 issues\n...",
  "labels": ["type:task", "priority:important", "metrics-alert", "team-leads"],
  "assignees": ["team-leads"]
}
```

## Usage Examples

For Reporting Agent v2 integration examples with PRD Agent, Testing Agent, and Metrics Agent,
see [agent-integration-examples.md](./agent-integration-examples.md).

### Example 1: Get Metrics Context for Meta Agent

```javascript
const MetricsContextProvider = require('./meta-agent-adapter');

async function getMetricsContext() {
  const provider = new MetricsContextProvider();
  const context = await provider.getMetricsContext('control-plane');
  
  // Pass to Meta Agent
  return context;
}
```

### Example 2: Generate Weekly Report

```javascript
const MetricsReportFormatter = require('./reporting-agent-input');
const fs = require('fs');

function generateReport() {
  const formatter = new MetricsReportFormatter();
  const rawMetrics = JSON.parse(fs.readFileSync('.github/reports/metrics/latest-metrics.json'));
  
  const report = formatter.formatForReportingAgent(rawMetrics, 'weekly');
  
  // Pass to Reporting Agent
  return report;
}
```

### Example 3: Create Issues from Anomalies

```javascript
const IssueTemplateGenerator = require('./issue-templates');
const fs = require('fs');

async function createMetricsIssues(githubClient) {
  const generator = new IssueTemplateGenerator({
    org: 'lightspeedwp',
    repo: '.github'
  });
  const rawMetrics = JSON.parse(fs.readFileSync('.github/reports/metrics/latest-metrics.json'));
  
  const issues = generator.generateAllIssues(rawMetrics);
  
  // Create each issue in GitHub
  for (const issue of issues) {
    await githubClient.rest.issues.create({
      owner: 'lightspeedwp',
      repo: '.github',
      title: issue.title,
      body: issue.body,
      labels: issue.labels,
      assignees: issue.assignees
    });
  }
}
```

## Testing

### Run All Tests

```bash
npm test -- scripts/metrics/integrations/__tests__
```

### Run Specific Test Suite

```bash
npm test -- scripts/metrics/integrations/__tests__/meta-agent-adapter.test.js
```

### Test Coverage

```bash
npm test -- --coverage scripts/metrics/integrations/__tests__
```

**Target:** 85%+ coverage on all modules

### Test Data

Sample test data available in `__tests__/fixtures/`:

- `sample-metrics.json` — Example raw metrics output
- `expected-meta-context.json` — Expected Meta Agent context
- `expected-weekly-report.json` — Expected weekly report

## Integration Points

### With Meta Agent

Meta Agent loads context via:

```javascript
const context = await provider.getMetricsContext(contextType);
// Uses: MetricsContextProvider
```

**Input:** Raw metrics JSON  
**Output:** Structured metrics context for decision-making

### With Reporting Agent

Reporting Agent formats reports via:

```javascript
const report = formatter.formatForReportingAgent(rawMetrics, reportType);
// Uses: MetricsReportFormatter
```

**Input:** Raw metrics JSON  
**Output:** Formatted report for publication (weekly, monthly, quarterly)

### With GitHub Issues

Create issues via:

```javascript
const issues = generator.generateAllIssues(rawMetrics);
// Uses: IssueTemplateGenerator
```

**Input:** Raw metrics JSON  
**Output:** Array of GitHub issue objects (title, body, labels, assignees)

## Error Handling

All modules include comprehensive error handling:

```javascript
try {
  const context = await provider.getMetricsContext('control-plane');
} catch (error) {
  if (error.message.includes('not found')) {
    // Handle missing metrics file
  } else if (error.message.includes('schema')) {
    // Handle schema validation failure
  } else {
    // Handle other errors
  }
}
```

## Performance

### Caching

Meta Agent adapter includes in-memory caching:

- Default TTL: 1 hour
- Configurable via `cacheExpiry` option
- Clear cache: `provider.clearCache()`

### Processing Times

Expected:

- Load metrics: <100ms (cached) / <1s (from disk)
- Format for Meta Agent: <50ms
- Format for Reporting Agent: <100ms
- Generate issues: <100ms

### Phase 4.3 Stability Benchmarks

- Synthetic benchmark validates formatting for **1,000 repositories** and **10,000 commits** in under 1 second.
- Benchmarks are covered by `scripts/metrics/integrations/__tests__/reporting-agent-input.test.js`.

## Known Limitations

- Detailed `metrics` and `trends` sections are generated from the first accessible repository with metrics.
- `failureSummary` depends on upstream adapters populating an `errors` array with HTTP status and/or network codes.
- Performance benchmark assertions use synthetic in-memory fixtures, not live GitHub API latency.

## Validation

### Schema Validation

All modules validate input/output against schemas:

- **Input:** Raw metrics schema (defined in Phase 2)
- **Output:** Context schemas in `.schemas/`

Validation can be disabled (not recommended):

```javascript
const provider = new MetricsContextProvider({ validateSchema: false });
```

### Health Checks

Recommended health checks before deploying:

```bash
# Verify schemas are valid
npm run validate:schema -- scripts/metrics/integrations/

# Run full test suite
npm test -- scripts/metrics/integrations/__tests__

# Check test coverage
npm test -- --coverage scripts/metrics/integrations/__tests__
```

## Dependencies

- Node.js 14+
- fs (built-in)
- path (built-in)
- Test: Jest 27+

## Related Documentation

- [Phase 3 Project README](../../../.github/projects/active/metrics-agent-phase-3-production-2026-08-26/README.md)
- [Task 3.2 Implementation Plan](../../../.github/projects/active/metrics-agent-phase-3-production-2026-08-26/TASK_3.2_INTEGRATION_PLAN.md)
- [Metrics Agent Phase 2 README](../README.md)
- [Meta Agent Documentation](../../../agents/meta-agent/)
- [Reporting Agent Documentation](../../../agents/reporting-agent/)

## Future Enhancements

- [ ] Support for additional report types (quarterly, annual)
- [ ] Custom anomaly threshold configuration
- [ ] Integration with more downstream agents
- [ ] Batch processing for multiple contexts
- [ ] Report scheduling and distribution
- [ ] Custom issue templates

## Contributing

When adding new integrations:

1. Create new adapter module in `scripts/metrics/integrations/`
2. Add comprehensive tests in `__tests__/`
3. Update this README with examples
4. Add sample test data to `__tests__/fixtures/`
5. Ensure 85%+ test coverage
6. Document output schema

## Support

For issues or questions:

1. Check test fixtures for examples
2. Review comprehensive docstrings in each module
3. See Phase 3 project README for context
4. Open issue in GitHub

---

**Version:** 1.0.0  
**Created:** 2026-08-19  
**Status:** Phase 3 Implementation  
**Test Coverage:** 85%+ target

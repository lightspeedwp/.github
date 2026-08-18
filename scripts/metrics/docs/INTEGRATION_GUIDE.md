# Metrics Agent — Integration Guide

## Overview

This guide explains how to integrate the Metrics Agent with other agents, workflows, and systems in the LightSpeed automation framework.

## Integration Points

### 1. GitHub Actions Workflows

#### Triggering Metrics Collection

```yaml
# In your workflow file
name: Your Workflow

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC

jobs:
  your-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      
      # Trigger metrics collection
      - name: Collect Metrics
        run: |
          node scripts/workflows/metrics/collect-metrics.js \
            --context github-control-plane \
            --output .github/reports/metrics
```

#### Using Metrics Output

```javascript
// Import and use metrics
const { MetricsCollectionOrchestrator } = require('./scripts/workflows/metrics/collect-metrics');

const orchestrator = new MetricsCollectionOrchestrator({
  context: 'github-control-plane',
  outputDir: '.github/reports/metrics',
});

const results = await orchestrator.run();
console.log(results);
```

### 2. Reporting Agent Integration

#### Passing Metrics to Reporting Agent

```javascript
const { MetricsCollectionOrchestrator } = require('./scripts/workflows/metrics/collect-metrics');
const { ReportingAgent } = require('./scripts/agents/reporting-agent');

// Collect metrics
const orchestrator = new MetricsCollectionOrchestrator();
const metrics = await orchestrator.collectMetrics();

// Pass to Reporting Agent
const reporter = new ReportingAgent({
  metrics: metrics,
  format: 'markdown',
  includeGraphs: true
});

const report = await reporter.generateReport();
```

### 3. Issue Management Integration

#### Creating Issues from Metrics

```javascript
const { MetricsIssueCreator } = require('./scripts/workflows/metrics/create-metrics-issues');

const creator = new MetricsIssueCreator({
  owner: 'lightspeedwp',
  repo: '.github',
  metrics: metricsData
});

// Create tracking issues
await creator.createIssues({
  template: 'metrics-report',
  labels: ['metrics', 'automated'],
  milestone: 'Phase 3'
});
```

### 4. Meta Agent Integration

#### Accessing Metrics in Other Agents

```javascript
// In any agent that needs metrics data
const { MetricsAgent } = require('./scripts/metrics/metrics-agent');

class YourAgent {
  async run() {
    const metrics = new MetricsAgent();
    
    // Get repository health
    const health = await metrics.getRepositoryHealth({
      owner: 'lightspeedwp',
      repo: '.github'
    });
    
    // Use metrics in your logic
    if (health.issueCount > 50) {
      // Take action
    }
  }
}
```

## Configuration

### Environment Variables

```bash
# Metrics collection context (github-control-plane, wordpress-plugin, wordpress-theme, all)
METRICS_CONTEXT=github-control-plane

# Output directory for metrics
METRICS_OUTPUT_DIR=.github/reports/metrics

# GitHub API token
GITHUB_TOKEN=<your-token>

# Enable metrics caching
METRICS_CACHE_ENABLED=true

# Cache TTL (minutes)
METRICS_CACHE_TTL=60
```

### Configuration Files

Create `scripts/metrics/config/<context>.json`:

```json
{
  "context": "github-control-plane",
  "repositories": [
    {
      "owner": "lightspeedwp",
      "name": ".github",
      "type": "control-plane"
    }
  ],
  "metrics": {
    "includeIssues": true,
    "includePRs": true,
    "includeContributors": true,
    "includeWorkflows": true
  },
  "reporting": {
    "format": "markdown",
    "includeGraphs": true,
    "publishToIssue": true
  }
}
```

## Common Integration Patterns

### Pattern 1: Scheduled Metrics Collection

```yaml
name: Daily Metrics Collection

on:
  schedule:
    - cron: '0 2 * * *'

jobs:
  collect-metrics:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Collect and Report Metrics
        run: node scripts/workflows/metrics/collect-metrics.js --context all
      
      - name: Generate Report
        run: node scripts/workflows/metrics/generate-metrics-report.js
      
      - name: Create Tracking Issues
        run: node scripts/workflows/metrics/create-metrics-issues.js
      
      - name: Commit Results
        run: |
          git add .github/reports/metrics/
          git commit -m "chore: update metrics report"
          git push
```

### Pattern 2: On-Demand Metrics via Workflow Dispatch

```yaml
name: Manual Metrics Collection

on:
  workflow_dispatch:
    inputs:
      context:
        description: 'Collection context'
        required: false
        default: 'all'
        type: choice
        options:
          - all
          - github-control-plane
          - wordpress-plugin
          - wordpress-theme

jobs:
  collect:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v4
      
      - name: Collect Metrics
        run: |
          node scripts/workflows/metrics/collect-metrics.js \
            --context ${{ inputs.context }}
```

### Pattern 3: Conditional Metrics-Driven Actions

```javascript
// In another agent/script
const metrics = require('./scripts/metrics/metrics-agent');

async function handleMetrics() {
  const data = await metrics.collect({ context: 'github-control-plane' });
  
  if (data.issueCount > 100) {
    console.log('⚠️ High issue count detected');
    // Trigger escalation workflow
    await triggerWorkflow('escalation');
  }
  
  if (data.prAgeAverage > 7) {
    console.log('⚠️ PRs aging, notify team');
    // Send notification
    await notifyTeam('slow-pr-cycle');
  }
}
```

## Error Handling

### Graceful Degradation

```javascript
const orchestrator = new MetricsCollectionOrchestrator();

try {
  const metrics = await orchestrator.collectMetrics();
} catch (error) {
  console.error('Metrics collection failed:', error);
  
  // Use cached metrics if available
  const cached = await orchestrator.getCachedMetrics();
  if (cached) {
    console.log('Using cached metrics from previous run');
    return cached;
  }
  
  // Fall back to default metrics
  return orchestrator.getDefaultMetrics();
}
```

### Retry Logic

```javascript
const { retry } = require('./scripts/utils/retry');

const metrics = await retry(
  () => orchestrator.collectMetrics(),
  {
    maxAttempts: 3,
    backoffMs: 1000,
    exponential: true
  }
);
```

## Troubleshooting Integration

### Issue: Missing Metrics Data

**Cause:** GitHub API rate limiting or network issues  
**Solution:** Check GitHub token and rate limits, use caching

```bash
# Verify GitHub token
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user

# Check rate limits
gh api rate-limit
```

### Issue: Stale Cached Data

**Cause:** Cache not being invalidated  
**Solution:** Clear cache or adjust TTL

```javascript
// Clear cache
await metrics.clearCache();

// Set shorter TTL
const metrics = new MetricsAgent({ cacheTTL: 30 }); // 30 minutes
```

### Issue: Integration Timeout

**Cause:** Slow GitHub API responses  
**Solution:** Increase timeout, use async operations

```javascript
const orchestrator = new MetricsCollectionOrchestrator({
  timeout: 30000, // 30 seconds
  concurrency: 5  // Parallel API calls
});
```

## Best Practices

1. **Use caching** to avoid excessive API calls
2. **Handle rate limiting** gracefully with retries
3. **Log metrics operations** for debugging
4. **Validate data** before using in downstream agents
5. **Version your configurations** with the metrics
6. **Test integrations** with dry-run mode first

## Next Steps

- Review [Usage Guide](./USAGE_GUIDE.md) for detailed API documentation
- Check [Team Training](./TRAINING_GUIDE.md) for training materials
- See [Handoff Notes](./HANDOFF.md) for Phase 3 preparation

---

**Version:** 2.0.0  
**Last Updated:** 2026-08-19  
**Owner:** Ash Shaw

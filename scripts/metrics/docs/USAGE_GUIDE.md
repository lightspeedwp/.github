# Metrics Agent — Usage Guide

## Quick Start

### Basic Metrics Collection

```bash
# Collect metrics for all contexts
node scripts/metrics/metrics-agent.js

# Collect for specific context
node scripts/metrics/metrics-agent.js --context github-control-plane
```

## API Reference

### MetricsAgent Class

```javascript
const { MetricsAgent } = require('./scripts/metrics/metrics-agent');

const agent = new MetricsAgent(options);
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `context` | string | `'all'` | Collection context: `github-control-plane`, `wordpress-plugin`, `wordpress-theme`, or `all` |
| `cacheTTL` | number | `3600000` | Cache time-to-live in milliseconds |
| `cacheEnabled` | boolean | `true` | Enable metrics caching |
| `concurrency` | number | `5` | Concurrent API requests |
| `timeout` | number | `30000` | Request timeout in milliseconds |

#### Methods

```javascript
// Collect metrics
const metrics = await agent.collect({ context: 'github-control-plane' });

// Get repository health
const health = await agent.getRepositoryHealth({
  owner: 'lightspeedwp',
  repo: '.github'
});

// Get issue metrics
const issues = await agent.getIssueMetrics({
  owner: 'lightspeedwp',
  repo: '.github'
});

// Get PR metrics
const prs = await agent.getPRMetrics({
  owner: 'lightspeedwp',
  repo: '.github'
});

// Get contributor metrics
const contributors = await agent.getContributorMetrics({
  owner: 'lightspeedwp',
  repo: '.github'
});

// Clear cache
await agent.clearCache();

// Get cached metrics
const cached = await agent.getCachedMetrics();
```

### MetricsStorage Class

```javascript
const { MetricsStorage } = require('./scripts/metrics/metrics-storage');

const storage = new MetricsStorage(options);
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storagePath` | string | `.github/reports/metrics` | Path to store metrics |
| `format` | string | `'json'` | Storage format: `json`, `csv`, `markdown` |

#### Methods

```javascript
// Store metrics
await storage.store('github-control-plane', metricsData);

// Retrieve metrics
const data = await storage.retrieve('github-control-plane');

// Get historical data
const history = await storage.getHistory('github-control-plane', { days: 30 });

// Generate report
const report = await storage.generateReport('github-control-plane');
```

## Common Use Cases

### Use Case 1: Monitor Repository Health

```javascript
const agent = new MetricsAgent({ context: 'github-control-plane' });

const health = await agent.getRepositoryHealth({
  owner: 'lightspeedwp',
  repo: '.github'
});

console.log(`Health Score: ${health.score}/100`);
console.log(`Open Issues: ${health.issueCount}`);
console.log(`Open PRs: ${health.prCount}`);
console.log(`Last Activity: ${health.lastActivityDate}`);
```

### Use Case 2: Track Team Velocity

```javascript
const agent = new MetricsAgent();
const storage = new MetricsStorage();

// Collect current metrics
const current = await agent.collect();

// Get previous metrics
const previous = await storage.retrieve('github-control-plane');

// Calculate velocity
const closed = current.prs.closed - previous.prs.closed;
const resolved = current.issues.resolved - previous.issues.resolved;

console.log(`PRs Merged: ${closed}`);
console.log(`Issues Resolved: ${resolved}`);
```

### Use Case 3: Generate Weekly Report

```javascript
const agent = new MetricsAgent();
const storage = new MetricsStorage({ format: 'markdown' });

const metrics = await agent.collect();
const report = await storage.generateReport('github-control-plane');

// Save report
await fs.promises.writeFile('weekly-report.md', report);
```

### Use Case 4: Automated Issue Creation

```javascript
const { MetricsIssueCreator } = require('./scripts/workflows/metrics/create-metrics-issues');

const creator = new MetricsIssueCreator({
  owner: 'lightspeedwp',
  repo: '.github',
  metrics: metricsData
});

await creator.createIssues({
  template: 'weekly-metrics-report',
  labels: ['metrics', 'weekly'],
  milestone: 'Week 34'
});
```

## Metrics Data Structure

```javascript
{
  context: 'github-control-plane',
  timestamp: '2026-08-19T00:16:00Z',
  repositories: [
    {
      owner: 'lightspeedwp',
      name: '.github',
      issues: {
        total: 150,
        open: 45,
        closed: 105,
        avgAge: 12,  // days
        byLabel: {
          'bug': 12,
          'feature': 23,
          'documentation': 10
        }
      },
      prs: {
        total: 120,
        open: 8,
        merged: 105,
        avgCycleTime: 2.5,  // days
        byStatus: {
          'draft': 2,
          'review': 3,
          'approved': 3
        }
      },
      contributors: {
        total: 15,
        active30days: 8,
        commits: 254,
        topContributors: [
          { login: 'ashleyshaw', commits: 120 },
          { login: 'bot', commits: 50 }
        ]
      },
      workflows: {
        total: 25,
        active: 20,
        failureRate: 0.08,
        avgDuration: 45  // seconds
      }
    }
  ],
  summary: {
    healthScore: 82,
    trend: 'improving',
    lastUpdate: '2026-08-19T00:16:00Z'
  }
}
```

## Configuration Examples

### Example 1: Control Plane Configuration

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
    "includeWorkflows": true,
    "reportingDepth": "full"
  }
}
```

### Example 2: WordPress Plugin Configuration

```json
{
  "context": "wordpress-plugin",
  "repositories": [
    {
      "owner": "lightspeedwp",
      "name": "block-plugin",
      "type": "wordpress-plugin"
    }
  ],
  "metrics": {
    "includeIssues": true,
    "includePRs": true,
    "includeDownloads": true,
    "includeRatings": true
  }
}
```

## Troubleshooting

### Debug Mode

```javascript
const agent = new MetricsAgent({
  debug: true,  // Enable detailed logging
  verbose: true // Show API responses
});
```

### Test Collection

```bash
# Dry-run without saving
node scripts/metrics/metrics-agent.js --dry-run

# Test with sample data
node scripts/metrics/metrics-agent.js --test-data
```

### Performance Optimization

```javascript
const agent = new MetricsAgent({
  concurrency: 10,        // Parallel API calls
  cacheTTL: 3600000,      // 1 hour cache
  batchSize: 50           // Items per API call
});
```

## Performance Benchmarks

| Operation | Time | Notes |
|-----------|------|-------|
| Single repo collection | 2-5s | Depends on repo size |
| Multi-repo collection (5) | 10-15s | With concurrency=5 |
| Cached collection | <100ms | In-memory cache |
| Report generation | 1-3s | From cached metrics |

---

**Version:** 2.0.0  
**Last Updated:** 2026-08-19  
**Owner:** Ash Shaw

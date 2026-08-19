# Metrics Agent — Usage Guide

## Quick Start

### Basic Metrics Collection

```bash
node scripts/metrics/metrics-agent.js
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
| `context` | string | `'all'` | Collection context |
| `cacheTTL` | number | `3600000` | Cache TTL in milliseconds |
| `cacheEnabled` | boolean | `true` | Enable caching |
| `concurrency` | number | `5` | Concurrent API requests |
| `timeout` | number | `30000` | Request timeout |

#### Methods

```javascript
const metrics = await agent.collect({ context: 'github-control-plane' });
const health = await agent.getRepositoryHealth({ owner: 'lightspeedwp', repo: '.github' });
const issues = await agent.getIssueMetrics({ owner: 'lightspeedwp', repo: '.github' });
const prs = await agent.getPRMetrics({ owner: 'lightspeedwp', repo: '.github' });
const contributors = await agent.getContributorMetrics({ owner: 'lightspeedwp', repo: '.github' });
await agent.clearCache();
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
| `storagePath` | string | `.github/reports/metrics` | Storage path |
| `format` | string | `'json'` | Format (json, csv, markdown) |

#### Methods

```javascript
await storage.store('github-control-plane', metricsData);
const data = await storage.retrieve('github-control-plane');
const history = await storage.getHistory('github-control-plane', { days: 30 });
const report = await storage.generateReport('github-control-plane');
```

## Common Use Cases

### Monitor Repository Health

```javascript
const agent = new MetricsAgent({ context: 'github-control-plane' });
const health = await agent.getRepositoryHealth({ owner: 'lightspeedwp', repo: '.github' });
console.log(`Health Score: ${health.score}/100`);
console.log(`Open Issues: ${health.issueCount}`);
```

### Track Team Velocity

```javascript
const agent = new MetricsAgent();
const current = await agent.collect();
const previous = await storage.retrieve('github-control-plane');
const closed = current.prs.closed - previous.prs.closed;
const resolved = current.issues.resolved - previous.issues.resolved;
console.log(`PRs Merged: ${closed}`);
console.log(`Issues Resolved: ${resolved}`);
```

### Generate Weekly Report

```javascript
const agent = new MetricsAgent();
const storage = new MetricsStorage({ format: 'markdown' });
const metrics = await agent.collect();
const report = await storage.generateReport('github-control-plane');
await fs.promises.writeFile('weekly-report.md', report);
```

### Automated Issue Creation

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
        avgAge: 12,
        byLabel: { 'bug': 12, 'feature': 23 }
      },
      prs: {
        total: 120,
        open: 8,
        merged: 105,
        avgCycleTime: 2.5,
        byStatus: { 'draft': 2, 'review': 3, 'approved': 3 }
      },
      contributors: {
        total: 15,
        active30days: 8,
        commits: 254,
        topContributors: [{ login: 'ashleyshaw', commits: 120 }]
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

## Troubleshooting

### Debug Mode

```javascript
const agent = new MetricsAgent({ debug: true, verbose: true });
```

### Test Collection

```bash
node scripts/metrics/metrics-agent.js --dry-run
node scripts/metrics/metrics-agent.js --test-data
```

### Performance Optimization

```javascript
const agent = new MetricsAgent({
  concurrency: 10,
  cacheTTL: 3600000,
  batchSize: 50
});
```

## Performance Benchmarks

| Operation | Time |
|-----------|------|
| Single repo | 2-5s |
| Multi-repo (5) | 10-15s |
| Cached | <100ms |
| Report generation | 1-3s |

---

**Version:** 2.0.0  
**Last Updated:** 2026-08-19  
**Owner:** Ash Shaw

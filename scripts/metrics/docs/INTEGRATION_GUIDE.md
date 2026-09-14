# Metrics Agent — Integration Guide

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

## Overview

This guide explains how to integrate the Metrics Agent with other agents, workflows, and systems in the LightSpeed automation framework.

## Integration Points

### 1. GitHub Actions Workflows

Triggering metrics collection in your workflow:

```yaml
- name: Collect Metrics
  run: node scripts/workflows/metrics/collect-metrics.js --context github-control-plane
```

### 2. Reporting Agent Integration

Passing metrics to the Reporting Agent:

```javascript
const { MetricsAgent } = require('./scripts/metrics/metrics-agent');
const reporter = new ReportingAgent({ metrics: await new MetricsAgent().collect() });
```

### 3. Issue Management Integration

Creating issues from metrics:

```javascript
const { MetricsIssueCreator } = require('./scripts/workflows/metrics/create-metrics-issues');
const creator = new MetricsIssueCreator({ owner: 'lightspeedwp', repo: '.github', metrics });
await creator.createIssues({ template: 'metrics-report', labels: ['metrics', 'automated'] });
```

### 4. Meta Agent Integration

Accessing metrics in other agents:

```javascript
const metrics = new MetricsAgent();
const health = await metrics.getRepositoryHealth({ owner: 'lightspeedwp', repo: '.github' });
if (health.issueCount > 50) { /* take action */ }
```

## Configuration

### Environment Variables

```bash
METRICS_CONTEXT=github-control-plane
METRICS_OUTPUT_DIR=.github/reports/metrics
GITHUB_TOKEN=<your-token>
METRICS_CACHE_ENABLED=true
METRICS_CACHE_TTL=60
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
      - name: Collect Metrics
        run: node scripts/workflows/metrics/collect-metrics.js --context all
      - name: Generate Report
        run: node scripts/workflows/metrics/generate-metrics-report.js
```

### Pattern 2: Conditional Metrics-Driven Actions

```javascript
const metrics = await agent.collect({ context: 'github-control-plane' });
if (metrics.issueCount > 100) await triggerEscalation();
if (metrics.prAgeAverage > 7) await notifyTeam('slow-pr-cycle');
```

## Error Handling

### Graceful Degradation

```javascript
try {
  const metrics = await orchestrator.collectMetrics();
} catch (error) {
  const cached = await orchestrator.getCachedMetrics();
  return cached || orchestrator.getDefaultMetrics();
}
```

### Retry Logic

```javascript
const metrics = await retry(
  () => orchestrator.collectMetrics(),
  { maxAttempts: 3, backoffMs: 1000, exponential: true }
);
```

## Troubleshooting

### Issue: Missing Metrics Data

**Cause:** GitHub API rate limiting  
**Solution:** Check GitHub token and rate limits

```bash
gh api rate-limit
```

### Issue: Stale Cached Data

**Cause:** Cache not being invalidated  
**Solution:** Clear cache or adjust TTL

```javascript
await metrics.clearCache();
const metrics = new MetricsAgent({ cacheTTL: 30 });
```

## Best Practices

1. **Use caching** to avoid excessive API calls
2. **Handle rate limiting** gracefully with retries
3. **Log metrics operations** for debugging
4. **Validate data** before using in downstream agents
5. **Version your configurations** with the metrics
6. **Test integrations** with dry-run mode first

---

**Version:** 2.0.0  
**Last Updated:** 2026-08-19  
**Owner:** Ash Shaw

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

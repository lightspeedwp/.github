# Metrics Agent — Team Training Guide

## Overview

**Duration:** 60 minutes | **Difficulty:** Intermediate | **Prerequisites:** Basic Node.js, GitHub API knowledge

## Module 1: Architecture (15 min)

### What is Metrics Agent?

Automated system that:
- ✅ Collects repository health data across multiple contexts
- ✅ Stores and caches metrics for efficient reuse
- ✅ Generates reports and creates tracking issues
- ✅ Integrates with other automation agents

### Core Components

1. **Metrics Agent** — Collects raw metrics from GitHub API
2. **Metrics Storage** — Persists metrics to disk, manages cache
3. **Workflow Orchestrator** — Runs in GitHub Actions
4. **Report Generator** — Formats metrics into reports
5. **Issue Creator** — Creates tracking issues from metrics

## Module 2: Running Metrics (15 min)

### Local Execution

```bash
cd scripts/metrics
node metrics-agent.js --context github-control-plane
ls -la ../../.github/reports/metrics/
```

### GitHub Actions

1. Go to Actions tab
2. Select "Manual Metrics Collection"
3. Click "Run workflow"
4. Monitor execution
5. Review reports

## Module 3: Using Metrics Data (15 min)

### Reading Metrics

```javascript
const fs = require('fs').promises;
const metrics = JSON.parse(
  await fs.readFile('.github/reports/metrics/github-control-plane-latest.json', 'utf-8')
);
console.log(`Total Issues: ${metrics.summary.totalIssues}`);
console.log(`Open PRs: ${metrics.summary.openPRs}`);
```

### Interpreting Results

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Health Score | 80-100 | 60-79 | <60 |
| Issue Age | <30d | 30-60d | >60d |
| PR Cycle | <3d | 3-7d | >7d |
| Contributors | 8+ | 4-7 | <4 |

## Module 4: Integration Examples (15 min)

### Pattern 1: Conditional Actions

```javascript
const metrics = await agent.collect({ context: 'github-control-plane' });
if (metrics.summary.healthScore < 60) {
  console.log('⚠️ Repository health is poor');
  // Trigger escalation
}
```

### Pattern 2: Reporting

```javascript
const storage = new MetricsStorage({ format: 'markdown' });
const report = await storage.generateReport('github-control-plane');
await save('weekly-report.md', report);
```

### Pattern 3: Creating Issues

```javascript
const creator = new MetricsIssueCreator({ owner: 'lightspeedwp', repo: '.github', metrics });
await creator.createIssues({ template: 'metrics-report', labels: ['metrics'] });
```

## Knowledge Check

1. **Q:** What are the main components?
   **A:** Collection, Storage, Orchestrator, Reporter, Issue Creator

2. **Q:** How does caching help?
   **A:** Reduces API calls, enables offline access, speeds up operations

3. **Q:** What contexts does it support?
   **A:** GitHub control plane, WordPress plugins, themes, all

4. **Q:** How would you integrate with another agent?
   **A:** Pass metrics data as input, use MetricsAgent class, subscribe to updates

## Hands-On Lab

### Objectives

1. Run metrics collection for `.github`
2. Read and interpret results
3. Create integration script
4. Generate metrics report

### Certification

To pass:
- [ ] Run metrics collection successfully
- [ ] Interpret 5 different metrics
- [ ] Write functional integration script
- [ ] Generate and review report
- [ ] Answer 4/5 knowledge check questions

---

**Version:** 2.0.0  
**Last Updated:** 2026-08-19  
**Owner:** Ash Shaw

**Training Schedule:**  
📅 Week of 2026-08-26 — Team training sessions (1 hour each)  
📅 Week of 2026-09-02 — Hands-on labs and certification

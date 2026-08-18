# Metrics Agent — Team Training Guide

## Training Overview

**Duration:** 60 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** Basic Node.js knowledge, GitHub API understanding

## Module 1: Architecture & Components (15 min)

### What is the Metrics Agent?

The Metrics Agent is an automated system that:
- ✅ Collects repository health data across multiple contexts
- ✅ Stores and caches metrics for efficient reuse
- ✅ Generates reports and creates tracking issues
- ✅ Integrates with other automation agents

### Core Components

1. **Metrics Agent** (`metrics-agent.js`)
   - Collects raw metrics from GitHub API
   - Handles multiple repository contexts
   - Implements caching strategy

2. **Metrics Storage** (`metrics-storage.js`)
   - Persists metrics to disk
   - Manages cache lifecycle
   - Supports multiple output formats

3. **Workflow Orchestrator** (`collect-metrics.js`)
   - Runs in GitHub Actions
   - Coordinates collection and reporting
   - Handles error recovery

4. **Report Generator** (`generate-metrics-report.js`)
   - Formats metrics into reports
   - Creates visualizations
   - Supports multiple formats

5. **Issue Creator** (`create-metrics-issues.js`)
   - Creates tracking issues from metrics
   - Applies labels and assigns
   - Links to metrics data

## Module 2: Running Metrics Collection (15 min)

### Local Execution

```bash
# Step 1: Navigate to metrics directory
cd scripts/metrics

# Step 2: Run metrics collection
node metrics-agent.js --context github-control-plane

# Step 3: Check output
ls -la ../../.github/reports/metrics/
```

### GitHub Actions Execution

1. Go to Actions tab in GitHub
2. Select "Manual Metrics Collection" workflow
3. Click "Run workflow"
4. Select context (all, control-plane, plugin, theme)
5. Monitor execution
6. Review generated reports

### Exercise 1

**Task:** Collect metrics for the `.github` repository

```bash
# Your code here
```

## Module 3: Using Metrics Data (15 min)

### Reading Metrics

```javascript
const fs = require('fs').promises;
const path = require('path');

async function readMetrics() {
  // Path to metrics file
  const metricsFile = path.join(
    __dirname,
    '../../.github/reports/metrics/github-control-plane-latest.json'
  );
  
  // Read file
  const content = await fs.readFile(metricsFile, 'utf-8');
  const metrics = JSON.parse(content);
  
  // Access data
  console.log(`Total Issues: ${metrics.summary.totalIssues}`);
  console.log(`Open PRs: ${metrics.summary.openPRs}`);
}

readMetrics();
```

### Interpreting Results

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Health Score | 80-100 | 60-79 | <60 |
| Issue Age | <30 days | 30-60 days | >60 days |
| PR Cycle Time | <3 days | 3-7 days | >7 days |
| Contributor Activity | 8+ active | 4-7 active | <4 active |

### Exercise 2

**Task:** Write a script to identify high-priority issues

```javascript
// Read latest metrics
// Filter issues by age and label
// Report those >30 days old with 'bug' label
// Your code here
```

## Module 4: Integration Examples (15 min)

### Integration Pattern 1: Conditional Actions

```javascript
const agent = require('./metrics-agent');

async function checkHealth() {
  const metrics = await agent.collect({
    context: 'github-control-plane'
  });
  
  if (metrics.summary.healthScore < 60) {
    console.log('⚠️ Repository health is poor');
    // Trigger escalation
    return 'escalate';
  }
  
  return 'healthy';
}
```

### Integration Pattern 2: Reporting

```javascript
const storage = require('./metrics-storage');

async function generateWeeklyReport() {
  const metrics = await storage.retrieve('github-control-plane');
  const report = await storage.generateReport('github-control-plane');
  
  // Save report
  await save('weekly-metrics-report.md', report);
}
```

### Integration Pattern 3: Creating Issues

```javascript
const { MetricsIssueCreator } = require('../workflows/metrics/create-metrics-issues');

async function trackMetrics() {
  const creator = new MetricsIssueCreator({
    owner: 'lightspeedwp',
    repo: '.github',
    metrics: metricsData
  });
  
  await creator.createIssues({
    template: 'metrics-report',
    labels: ['metrics', 'automated']
  });
}
```

### Exercise 3

**Task:** Create an integration that sends a notification when health drops

```javascript
// Your code here
```

## Module 5: Troubleshooting (Extra)

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "API rate limited" | Too many requests | Use caching, check token |
| "Metrics file not found" | Wrong path | Check output directory |
| "Stale data" | Cache not cleared | Use --clear-cache flag |
| "Slow execution" | Low concurrency | Increase concurrent requests |

### Debug Mode

```bash
# Enable verbose logging
node metrics-agent.js --verbose --debug
```

### Testing

```bash
# Run test suite
npm test

# Run specific test
npm test -- --testNamePattern="health score"
```

## Knowledge Check

1. **Q:** What are the main components of the Metrics Agent?  
   **A:** Metrics Agent (collection), Storage (persistence), Orchestrator (workflow), Reporter (formatting), Issue Creator (tracking)

2. **Q:** How does caching improve performance?  
   **A:** Reduces GitHub API calls, enables offline access, speeds up repeated operations

3. **Q:** What contexts does Metrics Agent support?  
   **A:** GitHub control plane, WordPress plugins, WordPress themes, and all contexts

4. **Q:** How would you integrate metrics with another agent?  
   **A:** Pass metrics data as input, use MetricsAgent class, subscribe to metric updates

## Hands-On Lab

### Lab Objectives

1. ✅ Run metrics collection for `.github` repository
2. ✅ Read and interpret the results
3. ✅ Create a simple integration script
4. ✅ Generate a metrics report

### Lab Environment

```bash
# Setup
cd /path/to/repository
npm install

# Run lab exercises
npm run training:lab

# Check results
ls .github/reports/metrics/
```

## Certification Criteria

To pass the training:

- [ ] Successfully run metrics collection
- [ ] Correctly interpret 5 different metrics
- [ ] Write a functional integration script
- [ ] Generate and review a metrics report
- [ ] Answer 4/5 knowledge check questions

## Additional Resources

- [README](./README.md) — Project overview
- [Integration Guide](./INTEGRATION_GUIDE.md) — Detailed integration examples
- [Usage Guide](./USAGE_GUIDE.md) — API reference
- [Test Suite](../docs/test-plan.md) — Testing strategies

## Feedback & Questions

- Post questions to the team Slack channel #metrics-agent
- Create GitHub issues for bugs or feature requests
- Contribute improvements via pull requests

---

**Version:** 2.0.0  
**Last Updated:** 2026-08-19  
**Owner:** Ash Shaw

**Training Schedule:**  
📅 Week of 2026-08-26 — Team training sessions (1 hour each)  
📅 Week of 2026-09-02 — Hands-on labs and certification

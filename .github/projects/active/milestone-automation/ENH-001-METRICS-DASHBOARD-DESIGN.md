---
title: Metrics Dashboard Design — Milestone Distribution
description: Design specification for Phase 3 metrics dashboard
type: documentation
file_type: documentation
status: proposed
version: "1.0.0"
owner: lightspeedwp/maintainers
owners:
  - lightspeedwp/maintainers
tags: []
---

# ENH-001: Metrics Dashboard Design

**Issue:** [#2569](https://github.com/lightspeedwp/.github/issues/2569)  
**Created:** 2026-09-02  
**Status:** 📋 Design Phase

---

## Overview

A metrics dashboard to track milestone distribution workflow performance, health, and trends over time.

**Scope:** Phase 3+ (Design in Phase 2)

**Objectives:**
- Real-time workflow health visibility
- Historical trend analysis
- Performance optimization insights
- Team accountability and progress tracking

---

## Dashboard Views

### 1. Executive Summary (Top-Level)

**Purpose:** At-a-glance health status

**Metrics:**
- 🟢 Success Rate (current) — Target: 99%+
- ⏱️ Avg Execution Time — Target: <5s
- 📊 Issues Processed (today) — Baseline tracking
- 🔄 API Rate Limit Usage — Alert if >80%

**Refresh:** Real-time or 5-minute intervals

**Visual:** 
```
┌─────────────────────────────────────────┐
│ Milestone Distribution Health Status    │
├─────────────────────────────────────────┤
│ Success Rate: 99.2% ✅                  │
│ Avg Duration: 4.2s                      │
│ Issues Today: 42                        │
│ API Usage: 12% ▁▂▃▄▅                   │
└─────────────────────────────────────────┘
```

---

### 2. Performance Trends

**Purpose:** Track workflow efficiency over time

**Metrics:**
- Success rate (daily, 7-day, 30-day)
- Execution time trends
- Issues per run trend
- API calls per run efficiency

**Time Ranges:**
- Last 24 hours
- Last 7 days
- Last 30 days
- Custom date range

**Visualizations:**
- Line graphs (trends)
- Bar charts (daily aggregates)
- Sparklines (quick trends)

**Data Points to Store:**

```json
{
  "date": "2026-09-02",
  "runs": [
    {
      "runId": "33650372958",
      "timestamp": "2026-09-02T15:43:32Z",
      "status": "success",
      "durationMs": 3200,
      "issuesProcessed": 8,
      "issuesSuccessful": 8,
      "issuesFailed": 0,
      "apiCallsUsed": 45,
      "apiCallsLimit": 5000,
      "milestone": "v1.1"
    }
  ]
}
```

---

### 3. Workflow Runs History

**Purpose:** Detailed run-by-run information

**Columns:**
- Run ID (linked to GitHub Actions)
- Date/Time
- Trigger type (schedule, manual, PR, issue)
- Status (success, failure, partial)
- Duration
- Issues Processed
- API Calls Used
- Milestone
- Author (if manual)

**Filters:**
- Date range
- Status
- Trigger type
- Milestone

**Sort Options:**
- By date (newest first)
- By duration
- By issues processed
- By API usage

---

### 4. Milestone Allocation Breakdown

**Purpose:** See distribution across milestones

**Visualization:** Pie/Donut chart + Table

```
Milestone Distribution (Last 30 Days)
├─ v1.1: 245 issues (53%)
├─ v2.0: 180 issues (39%)
├─ v1.0: 25 issues (5%)
└─ Backlog: 10 issues (3%)
```

**Metrics per Milestone:**
- Total issues assigned
- Percent of total
- Trend (↑ increasing, ↓ decreasing, → stable)
- Completion status (if applicable)

---

### 5. Error Analysis

**Purpose:** Track failures and anomalies

**Metrics:**
- Failure count (by type)
- Error rate trend
- Common failure patterns
- Recovery time

**Error Types to Track:**
- Rate limit exceeded (403)
- Milestone not found (404)
- Permission denied (401)
- Timeout errors
- API errors
- Script errors

**Visualization:**
```
Error Trends (Last 30 Days)
Rate Limit Errors: 0
Permission Errors: 0
Milestone Errors: 2 (0.3%)
Timeout Errors: 0
API Errors: 0
```

---

### 6. Rate Limit Analysis

**Purpose:** Track API quota usage patterns

**Metrics:**
- Current quota (remaining/total)
- Percent used
- Calls per run (trend)
- Peak usage times
- Quota efficiency

**Alerts:**
- 🟡 Warning when >70% used
- 🔴 Critical when >90% used
- Reset time countdown

**Visualization:**
```
API Rate Limit Status
Remaining: 4,200 / 5,000 (84% available)

Usage Pattern (Last 7 Days)
Mon: ▂▂▃ (185 calls, 3.7%)
Tue: ▁▂▂ (145 calls, 2.9%)
Wed: ▂▃▄ (225 calls, 4.5%)
Thu: ▃▄▅ (285 calls, 5.7%) ← Peak
Fri: ▁▂▂ (155 calls, 3.1%)
```

---

## Implementation Approach

### Option A: GitHub Issues Dashboard (Low Cost)

**Technology:** GitHub Issues + Markdown tables + issue templates

**Pros:**
- No external service needed
- Native GitHub integration
- Easy to maintain
- Good for small teams

**Cons:**
- Limited visualization options
- Manual updates
- Scalability limits (100+ issues slow)

**Implementation:**
```markdown
# Milestone Distribution Metrics

## Status

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Success Rate | 99.2% | 99%+ | ✅ |
| Avg Duration | 4.2s | <5s | ✅ |
| API Usage | 12% | <80% | ✅ |
| Issues Today | 42 | N/A | — |

## [View Full Dashboard](issues)
```

### Option B: GitHub Pages (Medium Cost)

**Technology:** Static site + GitHub Actions + JSONL data

**Pros:**
- Rich visualizations (Chart.js, etc.)
- Better interactivity
- Historical data easy to store
- Free hosting

**Cons:**
- Requires custom HTML/JS
- JSONL file storage limits
- Manual data collection setup

**Architecture:**
```
Workflow Execution
↓
Write metrics to .github/reports/metrics.jsonl
↓
GitHub Actions processes and builds static site
↓
Static HTML/JS published to GitHub Pages
↓
Team views dashboard at https://lightspeedwp.github.io/.github/dashboard
```

### Option C: External Dashboard (High Cost)

**Technology:** Grafana, DataDog, New Relic, etc.

**Pros:**
- Professional, feature-rich
- Real-time streaming
- Advanced alerting
- Integration ecosystem

**Cons:**
- Requires paid subscription
- External service dependency
- Overkill for this use case

**Recommendation:** Skip for Phase 3; revisit if scaling dramatically.

---

## Recommended Approach: Option B (GitHub Pages)

### Why Option B?

1. **Sustainable:** Works for years without maintenance
2. **Cost-effective:** Free (GitHub Pages)
3. **Owner:** Team controls all data
4. **Scalable:** Can add more metrics easily
5. **Accessible:** Standard web dashboard

### Data Collection & Durable Persistence

**1. Write Metrics After Each Run**

```javascript
// In workflow or script
const fs = require('fs');
const { execSync } = require('child_process');

// Collect metrics
const metrics = {
  runId: github.context.runId,
  timestamp: new Date().toISOString(),
  trigger: 'schedule', // or 'manual', 'webhook'
  status: 'success',
  durationMs: 3200,
  issuesProcessed: 8,
  issuesSuccessful: 8,
  issuesFailed: 0,
  apiCallsUsed: 45,
  apiCallsLimit: 5000,
  apiCallsPercent: 0.9,
  milestone: 'v1.1',
  errorType: null,
  errorMessage: null
};

// Validate against schema BEFORE persisting
validateMetricsRecord(metrics);

// Append to JSONL file
fs.appendFileSync(
  '.github/reports/metrics.jsonl',
  JSON.stringify(metrics) + '\n'
);
```

**2. Commit Metrics to Git (Ensures Durability)**

```javascript
// Persist metrics to git (backup against workflow failures)
async function persistMetricsToGit(metrics) {
  try {
    // Stage the metrics file
    execSync('git add .github/reports/metrics.jsonl', { stdio: 'pipe' });
    
    // Commit with metadata
    execSync(
      `git commit -m "chore: record workflow metrics for run ${metrics.runId}"`,
      { stdio: 'pipe' }
    );
    
    // Push with retry logic
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        execSync('git push origin develop', { stdio: 'pipe' });
        console.log('Metrics persisted to git successfully');
        return true;
      } catch (pushError) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.warn(`Git push attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
    
    throw new Error('Git push failed after retries');
  } catch (error) {
    // Non-fatal: Metrics are written locally, just not yet persisted
    console.warn('WARNING: Metrics not persisted to git:', error.message);
    console.warn('Metrics remain in working directory. Manual push may be needed.');
    // Do NOT fail workflow - metrics are safe in the file
    return false;
  }
}
```

**Why Git Persistence?**
- Metrics survive workflow failures (data not lost between runs)
- Natural backup via GitHub (git history)
- Integration with git workflow (part of version control)
- No additional infrastructure needed
- Can be audited via git commit log

**2. Generate Static HTML**

```bash
# GitHub Actions job
- name: Generate Dashboard
  run: |
    # Create dashboard-specific directory (separate from existing site)
    mkdir -p docs/dashboard
    
    node scripts/monitoring/generate-dashboard.js
    
# Output: docs/dashboard/index.html
# Critical: Do NOT output to docs/ root (would overwrite existing site)
```

**3. Publish to GitHub Pages (Separate Deployment)**

```yaml
# IMPORTANT: Use separate deployment configuration
# This ensures dashboard doesn't overwrite existing GitHub Pages site

- name: Deploy Metrics Dashboard
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./docs/dashboard
    destination_dir: dashboard
    # Result: Deployed to https://lightspeedwp.github.io/.github/dashboard/
    # Existing site at https://lightspeedwp.github.io/ remains untouched
```

**Alternative: Separate Branch (If existing GitHub Pages in use)**

If the repository already uses GitHub Pages for other content:

```yaml
- name: Deploy to Separate Pages Branch
  run: |
    git config user.name "GitHub Actions"
    git config user.email "actions@github.com"
    
    # Checkout gh-pages branch
    git fetch origin gh-pages 2>/dev/null || git checkout --orphan gh-pages
    git checkout gh-pages
    
    # Copy dashboard content
    mkdir -p dashboard
    cp -r docs/dashboard/* dashboard/
    
    # Commit and push
    git add dashboard/
    git commit -m "chore: update metrics dashboard" || exit 0
    git push origin gh-pages
```

---

## Dashboard Components (Technical Spec)

### Header
- Last updated timestamp
- Refresh button
- Date range selector
- Export data option

### Charts

**1. Success Rate Over Time**
- Type: Line chart
- X-axis: Date
- Y-axis: Percent
- Target line: 99%

**2. Execution Duration Trend**
- Type: Area chart
- X-axis: Date
- Y-axis: Milliseconds
- Target line: 5000ms

**3. Issues Processed**
- Type: Bar chart
- X-axis: Date
- Y-axis: Count
- Milestone color-coded

**4. API Usage Efficiency**
- Type: Gauge + Line
- Gauge: Current % used
- Line: Historical trend

### Tables

**1. Recent Runs (10-50 entries)**
- Sortable columns
- Filterable status
- Clickable run links

**2. Milestone Breakdown**
- Sortable by count/percent
- 30-day rolling average

### Alerts Section

```
⚠️ Warnings (if applicable)
- API usage trending high
- Failure rate increased
- Long execution times
```

---

## Data Storage

### Canonical JSONL Schema

**Critical:** All metrics collectors MUST write records matching this exact schema. Validation ensures data integrity.

```json
{
  "runId": "33650372958",
  "timestamp": "2026-09-02T15:43:32Z",
  "trigger": "schedule|manual|webhook",
  "status": "success|failure|partial",
  "durationMs": 3200,
  "issuesProcessed": 8,
  "issuesSuccessful": 8,
  "issuesFailed": 0,
  "apiCallsUsed": 45,
  "apiCallsLimit": 5000,
  "apiCallsPercent": 0.9,
  "milestone": "v1.1",
  "errorType": null,
  "errorMessage": null
}
```

**Required Fields:** runId, timestamp, status, durationMs, issuesProcessed, issuesSuccessful, issuesFailed, apiCallsUsed, apiCallsLimit, milestone

**Optional Fields:** trigger, errorType, errorMessage

**Validation Rules:**
- `timestamp` must be ISO 8601 format
- `durationMs` must be non-negative integer
- `issuesSuccessful + issuesFailed >= issuesProcessed` (no double-counting)
- `apiCallsUsed <= apiCallsLimit`
- `status` must be one of: success, failure, partial
- `trigger` must be one of: schedule, manual, webhook (if present)

### Primary Storage: JSONL File with Git Persistence

**Path:** `.github/reports/metrics.jsonl`

**Format:** One JSON object per line (matching canonical schema above)

**Retention:** 90 days of rolling data (automatic cleanup via workflow)

**Durability:** Git-backed persistence ensures metrics survive workflow failures

**Write Process:**
```javascript
// 1. Append to JSONL file
const metrics = { runId, timestamp, status, ... };
fs.appendFileSync(
  '.github/reports/metrics.jsonl',
  JSON.stringify(metrics) + '\n'
);

// 2. Validate record against schema
function validateMetricsRecord(record) {
  const required = ['runId', 'timestamp', 'status', 'durationMs', 
                    'issuesProcessed', 'issuesSuccessful', 'issuesFailed',
                    'apiCallsUsed', 'apiCallsLimit', 'milestone'];
  
  for (const field of required) {
    if (record[field] === undefined) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  if (record.issuesSuccessful + record.issuesFailed > record.issuesProcessed) {
    throw new Error('issuesSuccessful + issuesFailed cannot exceed issuesProcessed');
  }
  
  return true;
}

// 3. Commit to git (ensures persistence)
execSync('git add .github/reports/metrics.jsonl');
execSync('git commit -m "chore: record workflow metrics"');
execSync('git push origin develop');
```

**Error Handling:**
- If git commit fails, log error but don't fail workflow
- Retry git push up to 3 times with exponential backoff
- Fallback: Write to temporary location if git unavailable

**Size Estimate:** ~616 bytes/run × 1 run/day = ~183KB/year

### Backup: Monthly Summary Issues (Optional)

**Optional:** Create monthly summary issues for archive

```markdown
# Metrics Summary — September 2026

- Total Runs: 30
- Avg Success Rate: 99.1%
- Avg Duration: 4.3s
- Issues Processed: 1,245
- Peak API Usage: 18%
```

---

## Phase 3 Implementation Plan

### Sprint 1: Foundation
- [ ] Set up metrics collection script
- [ ] Create JSONL logging
- [ ] Write basic data parser

### Sprint 2: Visualization
- [ ] Build static HTML template
- [ ] Add Chart.js for graphs
- [ ] Implement table rendering

### Sprint 3: Deployment
- [ ] Set up GitHub Pages workflow
- [ ] Test dashboard rendering
- [ ] Deploy to prod

### Sprint 4: Polish
- [ ] Add custom theming
- [ ] Export/report functionality
- [ ] Mobile responsiveness

---

## Success Metrics

### Adoption
- [ ] Team uses dashboard weekly
- [ ] At least 2 data-driven decisions made

### Quality
- [ ] 99%+ data accuracy
- [ ] <1 second dashboard load time
- [ ] Mobile-friendly rendering

### Completeness
- [ ] All 6 views implemented
- [ ] 30+ days of historical data
- [ ] Export to CSV/JSON

---

## Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Data loss | Low | High | Weekly backups to issues |
| Dashboard downtime | Low | Medium | Fallback to JSONL raw data |
| Storage limits | Low | Low | Cleanup old data monthly |
| Visualization bugs | Medium | Low | Thorough testing before deploy |

---

## Dependencies

- GitHub Pages enabled
- GitHub Actions with artifact upload
- Chart.js or similar library
- Deployment workflow

---

## Related Issues

- [ENH-002](https://github.com/lightspeedwp/.github/issues/2571) — Slack notifications
- [MON-001](https://github.com/lightspeedwp/.github/issues/2558) — Workflow alerts
- [MON-002](https://github.com/lightspeedwp/.github/issues/2559) — Rate limit monitoring

---

**Design Owner:** lightspeedwp/maintainers  
**Created:** 2026-09-02  
**Status:** 📋 Design (Phase 3 Implementation)  
**Relates to:** [ENH-001 Issue #2569](https://github.com/lightspeedwp/.github/issues/2569)

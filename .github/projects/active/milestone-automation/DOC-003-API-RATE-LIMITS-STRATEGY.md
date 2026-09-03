---
title: API Rate Limit Handling Strategy
description: Comprehensive strategy for managing GitHub API rate limits during automation
type: guide
file_type: project-documentation
status: approved
version: "1.0.0"
owner: lightspeedwp/maintainers
owners:
  - lightspeedwp/maintainers
tags:
  - automation
  - api-rate-limits
  - github-api
  - monitoring
---

# DOC-003: API Rate Limit Handling Strategy

**Document:** DOC-003  
**Issue:** [#2563](https://github.com/lightspeedwp/.github/issues/2563)  
**Created:** 2026-09-02  
**Status:** 📋 Complete

---

## Overview

The GitHub API enforces rate limits to ensure fair access and system stability. This document provides a comprehensive strategy for handling rate limits during milestone distribution automation, including prevention, detection, monitoring, and recovery procedures.

**Rate Limit Baseline:**
- **Standard:** 5,000 requests per hour
- **Reset:** Every hour (sliding window)
- **Current Usage:** ~45 API calls per 8-issue batch (~5.6 calls per issue)

---

## Part 1: Rate Limit Fundamentals

### Rate Limit Structure

**Core Limits:**
- 5,000 requests/hour per token
- Sliding 60-minute window
- Applies to all API endpoints
- Separate limits for secondary/search APIs

**Current Workflow Cost:**

Per issue distributed:
1. Fetch issue details — 1 call
2. Fetch milestones — 1 call (cached after first run)
3. Update issue milestone — 1 call
4. Check rate limit status — 1 call (every 5th issue)
5. Post workflow summary — 1 call (end of run)

**Result:** ~5.6 API calls per issue

**For different batch sizes:**
```
10 issues:   56 calls (1.1% of quota)
50 issues:   280 calls (5.6% of quota)
100 issues:  560 calls (11.2% of quota)
200 issues:  1,120 calls (22.4% of quota) ← Critical threshold
500 issues:  2,800 calls (56% of quota) ← High risk
1,000 issues: 5,600 calls (112% over limit) ← Exceeds quota
```

### Checking Rate Limit Status

```bash
# Query rate limit endpoint
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/rate_limit | jq .

# Response structure:
{
  "resources": {
    "core": {
      "limit": 5000,
      "remaining": 4955,
      "reset": 1725235200
    },
    "search": {
      "limit": 30,
      "remaining": 28,
      "reset": 1725221820
    }
  }
}

# Calculate reset time (Unix timestamp)
echo "Resets in: $(( $(jq -r '.resources.core.reset' <<< "$(curl ...)") - $(date +%s) )) seconds"
```

**JavaScript equivalents:**
```javascript
// Check rate limit
const response = await github.rest.rateLimit.get();
const { remaining, limit, reset } = response.data.resources.core;
const percentUsed = ((limit - remaining) / limit * 100).toFixed(1);
const resetTime = new Date(reset * 1000).toISOString();

console.log(`Rate Limit: ${remaining}/${limit} (${percentUsed}% used)`);
console.log(`Resets at: ${resetTime}`);
```

---

## Part 2: Prevention Strategy

### Pre-Run Checks

**1. Quota Pre-Flight Check**

```javascript
async function checkRateLimitBefore(estimatedCalls) {
  const rateLimitInfo = await github.rest.rateLimit.get();
  const { remaining } = rateLimitInfo.data.resources.core;
  
  if (remaining < estimatedCalls + 500) {
    console.error(`⚠️  Insufficient quota`);
    console.error(`  Remaining: ${remaining}`);
    console.error(`  Estimated needed: ${estimatedCalls}`);
    console.error(`  Safety margin: 500`);
    console.error(`  Total required: ${estimatedCalls + 500}`);
    
    throw new Error('Rate limit insufficient for this operation');
  }
  
  console.log(`✅ Quota check passed`);
  console.log(`  Current: ${remaining}/${limit}`);
  console.log(`  Estimated after run: ${remaining - estimatedCalls}`);
}

// Call before processing
await checkRateLimitBefore(estimatedApiCalls);
```

**2. Issue Count Estimation**

```javascript
// Estimate issues before full fetch
async function estimateUnallocatedCount() {
  // Use GitHub search API (minimal cost)
  const response = await github.rest.search.issuesAndPullRequests({
    q: `repo:lightspeedwp/.github milestone:none state:open type:issue`,
    per_page: 1,
    page: 1
  });
  
  return response.data.total_count;
}

// Use for planning
const estimatedCount = await estimateUnallocatedCount();
const estimatedCalls = estimatedCount * 5.6 + 100; // + buffer

console.log(`Estimated issues: ${estimatedCount}`);
console.log(`Estimated API calls: ${estimatedCalls}`);
console.log(`Estimated quota: ${(estimatedCalls / 5000 * 100).toFixed(1)}%`);
```

**3. Risk Assessment Thresholds**

```javascript
const RiskLevels = {
  LOW: { threshold: 1000, actions: [] },           // <20% quota
  MEDIUM: { threshold: 2500, actions: ['batch-50'] },  // 20-50%
  HIGH: { threshold: 4000, actions: ['batch-25', 'warn'] },  // 50-80%
  CRITICAL: { threshold: 4500, actions: ['batch-10', 'alert', 'stagger'] }  // >80%
};

function assessRisk(estimatedCalls) {
  if (estimatedCalls < RiskLevels.LOW.threshold) return 'LOW';
  if (estimatedCalls < RiskLevels.MEDIUM.threshold) return 'MEDIUM';
  if (estimatedCalls < RiskLevels.HIGH.threshold) return 'HIGH';
  return 'CRITICAL';
}
```

### Batch Size Optimization

**Recommended batch sizes by issue count:**

```
Issues: 1-25    → Batch: 50   | Duration: <2s  | Risk: LOW
Issues: 26-50   → Batch: 25   | Duration: 2-5s | Risk: LOW-MEDIUM
Issues: 51-100  → Batch: 20   | Duration: 5-10s| Risk: MEDIUM
Issues: 101-200 → Batch: 15   | Duration: 10-20s| Risk: MEDIUM-HIGH
Issues: 200+    → Batch: 10   | Duration: 20s+ | Risk: HIGH-CRITICAL
```

**Configuration:**
```yaml
# .github/workflows/milestone-distribution.yml
env:
  # Auto-calculate from issue count
  DYNAMIC_BATCH_SIZE: 'true'
  MIN_BATCH_SIZE: 10
  MAX_BATCH_SIZE: 50
  
  # Or fixed batch size
  # BATCH_SIZE: 25
```

---

## Part 3: Monitoring During Execution

### Real-Time Rate Limit Tracking

```javascript
class RateLimitTracker {
  constructor(warningThreshold = 500) {
    this.warningThreshold = warningThreshold;
    this.startingQuota = null;
    this.callsUsed = 0;
    this.checkHistory = [];
  }

  async recordCheck() {
    const info = await github.rest.rateLimit.get();
    const { remaining, limit } = info.data.resources.core;
    
    if (!this.startingQuota) {
      this.startingQuota = remaining;
    }
    
    this.checkHistory.push({
      timestamp: new Date().toISOString(),
      remaining,
      limit,
      percentUsed: ((limit - remaining) / limit * 100).toFixed(1)
    });
    
    return { remaining, limit };
  }

  async checkAndWarn() {
    const { remaining, limit } = await this.recordCheck();
    
    if (remaining < this.warningThreshold) {
      const message = `⚠️  RATE LIMIT WARNING: ${remaining}/${limit} remaining (${(remaining/limit*100).toFixed(1)}%)`;
      console.warn(message);
      return { status: 'warning', remaining, message };
    }
    
    return { status: 'ok', remaining };
  }

  async checkAndWaitIfNeeded() {
    const { remaining, limit } = await this.recordCheck();
    
    if (remaining < 100) {
      const resetTime = await this.getResetTime();
      const waitMs = resetTime - Date.now();
      
      console.error(`🔴 CRITICAL: Only ${remaining} calls remaining`);
      console.error(`Waiting until reset: ${waitMs}ms`);
      
      await new Promise(resolve => setTimeout(resolve, waitMs + 5000)); // +5s buffer
      return { status: 'waited', resetTime };
    }
    
    return { status: 'ok', remaining };
  }

  async getResetTime() {
    const info = await github.rest.rateLimit.get();
    const { reset } = info.data.resources.core;
    return new Date(reset * 1000).getTime();
  }

  getHistory() {
    return this.checkHistory;
  }
}
```

### Periodic Status Logging

```javascript
// Log rate limit status every N batches
async function processBatchWithTracking(batches, tracker) {
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    
    // Process batch
    await processBatch(batch);
    
    // Check rate limit every 5 batches
    if ((i + 1) % 5 === 0) {
      const status = await tracker.checkAndWarn();
      console.log(`[${i+1}/${batches.length}] Quota: ${status.remaining}/5000`);
      
      // Dynamic batch size adjustment
      if (status.remaining < 1000) {
        console.warn('Reducing batch size due to low quota');
        BATCH_SIZE = Math.max(10, BATCH_SIZE - 5);
      }
    }
  }
}
```

---

## Part 4: Retry and Recovery

### Retry-After Header Handling

When GitHub returns 403 (rate limited), the response includes retry timing:

```javascript
async function updateIssueWithRetry(issueNumber, milestone, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await github.rest.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber,
        milestone: milestone.number
      });
    } catch (error) {
      if (error.status === 403 && error.response?.headers['retry-after']) {
        // Respect Retry-After header
        const retryAfter = parseInt(error.response.headers['retry-after']) * 1000;
        console.warn(`Rate limited. Retrying after ${retryAfter}ms`);
        
        await new Promise(resolve => setTimeout(resolve, retryAfter));
        continue;
      }
      
      if (attempt === maxRetries) throw error;
      
      // Exponential backoff for other errors
      const backoffMs = Math.pow(2, attempt) * 1000;
      console.warn(`Attempt ${attempt} failed. Backing off ${backoffMs}ms`);
      await new Promise(resolve => setTimeout(resolve, backoffMs));
    }
  }
}
```

### Graceful Degradation

```javascript
async function processMilestonesWithGracefulDegradation(
  issues,
  targetMilestone,
  options = {}
) {
  const tracker = new RateLimitTracker(options.warningThreshold || 500);
  const results = {
    successful: [],
    failed: [],
    retried: [],
    skipped: []
  };

  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i];
    
    // Pre-flight rate limit check
    const rateLimitStatus = await tracker.checkAndWaitIfNeeded();
    if (rateLimitStatus.status === 'waited') {
      console.warn(`Quota exhausted and reset. Continuing from issue ${i+1}/${issues.length}`);
    }
    
    try {
      await updateIssueWithRetry(issue.number, targetMilestone);
      results.successful.push(issue.number);
    } catch (error) {
      if (error.status === 403) {
        // Rate limit exhausted - stop gracefully
        console.error(`Rate limit exhausted at issue ${i+1}/${issues.length}`);
        results.skipped.push(
          ...issues.slice(i).map(iss => iss.number)
        );
        
        // Schedule retry
        await scheduleRetry(issues.slice(i), targetMilestone);
        break;
      }
      
      results.failed.push({ number: issue.number, error: error.message });
    }
  }
  
  return results;
}
```

### Workflow Coordination

When multiple workflows may run concurrently:

```javascript
async function acquireDistributionLock(lockName = 'milestone-distribution') {
  const lockFile = `.github/locks/${lockName}.lock`;
  
  try {
    // Try to create lock file
    await github.rest.repos.createOrUpdateFileContents({
      owner: context.repo.owner,
      repo: context.repo.repo,
      path: lockFile,
      message: `Lock: ${lockName} @ ${new Date().toISOString()}`,
      content: Buffer.from(JSON.stringify({
        lockedAt: new Date().toISOString(),
        runId: github.context.runId,
        actor: github.context.actor
      })).toString('base64')
    });
    
    console.log(`✅ Lock acquired for ${lockName}`);
    return true;
  } catch (error) {
    console.warn(`Could not acquire lock (may already be held)`);
    return false;
  }
}

async function releaseDistributionLock(lockName = 'milestone-distribution') {
  const lockFile = `.github/locks/${lockName}.lock`;
  
  try {
    await github.rest.repos.deleteFile({
      owner: context.repo.owner,
      repo: context.repo.repo,
      path: lockFile,
      message: `Release lock: ${lockName}`
    });
    
    console.log(`✅ Lock released for ${lockName}`);
  } catch (error) {
    console.warn(`Could not release lock (may not exist)`);
  }
}
```

---

## Part 5: Fallback Strategies

### Option 1: Fallback to Local Processing (Phase 2)

When API calls are too expensive:

```javascript
async function getOrCacheMilestones(useCache = true) {
  const cacheFile = '.github/cache/milestones.json';
  
  if (useCache && fs.existsSync(cacheFile)) {
    const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    const age = Date.now() - cached.timestamp;
    
    if (age < 3600000) { // 1 hour old
      console.log(`Using cached milestones (${(age/60000).toFixed(0)} min old)`);
      return cached.data;
    }
  }
  
  // Fetch fresh from API
  console.log('Fetching fresh milestone data from GitHub API');
  const response = await github.rest.issues.listMilestones({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: 'open'
  });
  
  // Cache for next run
  fs.writeFileSync(cacheFile, JSON.stringify({
    timestamp: Date.now(),
    data: response.data
  }), 'utf8');
  
  return response.data;
}
```

### Option 2: Batch Job with Staggering (Phase 3)

Split large runs across multiple workflow invocations:

```yaml
# .github/workflows/milestone-distribution-staggered.yml
name: Milestone Distribution (Staggered)

on:
  schedule:
    # Run 4 times per day (every 6 hours)
    # Each run processes ~25% of issues
    - cron: '0 0,6,12,18 * * *'

jobs:
  prepare:
    runs-on: ubuntu-latest
    outputs:
      total-issues: ${{ steps.count.outputs.total }}
      batch-size: ${{ steps.calculate.outputs.batch-size }}
    steps:
      - name: Count unallocated issues
        id: count
        run: |
          TOTAL=$(curl -s -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
            https://api.github.com/repos/lightspeedwp/.github/issues?milestone=none \
            | jq 'length')
          echo "total=$TOTAL" >> $GITHUB_OUTPUT
      
      - name: Calculate batch size
        id: calculate
        run: |
          # 4 runs per day = ~25% per run
          BATCH=$(( (${{ steps.count.outputs.total }} + 3) / 4 ))
          echo "batch-size=$BATCH" >> $GITHUB_OUTPUT

  distribute:
    needs: prepare
    runs-on: ubuntu-latest
    steps:
      - name: Distribute batch
        run: |
          node scripts/automation/distribute-unallocated-milestones.js \
            --limit ${{ needs.prepare.outputs.batch-size }}
```

---

## Part 6: Quota Forecasting

### Predict Future Quota Needs

```javascript
class QuotaForecaster {
  constructor(historyFile = '.github/reports/quota-history.jsonl') {
    this.historyFile = historyFile;
    this.history = this.loadHistory();
  }

  loadHistory() {
    if (!fs.existsSync(this.historyFile)) return [];
    
    return fs.readFileSync(this.historyFile, 'utf8')
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
  }

  recordUsage(apiCallsUsed, issuesProcessed) {
    const entry = {
      timestamp: new Date().toISOString(),
      apiCallsUsed,
      issuesProcessed,
      efficiency: apiCallsUsed / issuesProcessed
    };
    
    fs.appendFileSync(this.historyFile, JSON.stringify(entry) + '\n');
    this.history.push(entry);
  }

  averageEfficiency(days = 7) {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    const recent = this.history.filter(
      e => new Date(e.timestamp) > cutoff
    );
    
    if (recent.length === 0) return 5.6; // Default
    
    const totalCalls = recent.reduce((sum, e) => sum + e.apiCallsUsed, 0);
    const totalIssues = recent.reduce((sum, e) => sum + e.issuesProcessed, 0);
    
    return totalCalls / totalIssues;
  }

  predictQuotaNeeded(estimatedIssueCount, daysAhead = 7) {
    const efficiency = this.averageEfficiency();
    const estimatedCalls = estimatedIssueCount * efficiency;
    const dailyUsage = estimatedCalls / daysAhead;
    const scheduledRuns = daysAhead; // 1 per day
    const totalNeeded = scheduledRuns * estimatedCalls;
    
    return {
      estimatedCalls,
      dailyUsage,
      totalNeeded,
      availableQuota: 5000 * daysAhead,
      utilization: (totalNeeded / (5000 * daysAhead) * 100).toFixed(1),
      feasible: totalNeeded < (5000 * daysAhead)
    };
  }
}

// Usage
const forecaster = new QuotaForecaster();
const forecast = forecaster.predictQuotaNeeded(45, 7);

if (!forecast.feasible) {
  console.warn(`⚠️  Insufficient quota forecast for next 7 days`);
  console.warn(`  Estimated need: ${forecast.totalNeeded} calls`);
  console.warn(`  Available: ${forecast.availableQuota}`);
  console.warn(`  Consider reducing frequency or batch size`);
}
```

---

## Part 7: Alerts and Notifications

### Alert Triggers

```javascript
async function checkAndAlert(rateLimitInfo) {
  const { remaining, limit } = rateLimitInfo;
  const percentUsed = (1 - remaining / limit) * 100;
  
  if (percentUsed > 90) {
    // Create high-priority issue
    await github.rest.issues.create({
      owner: 'lightspeedwp',
      repo: '.github',
      title: '🔴 ALERT: API Rate Limit Critical',
      body: `
        **Status:** CRITICAL
        
        **Remaining:** ${remaining}/${limit} (${percentUsed.toFixed(1)}% used)
        
        **Action Required:**
        1. Check for other high-volume workflows
        2. Consider staggering automation runs
        3. Wait for quota reset
        
        **Details:**
        - Reset time: ${new Date(reset * 1000).toISOString()}
      `,
      labels: ['type:alert', 'priority:critical', 'area:automation']
    });
  } else if (percentUsed > 70) {
    // Slack notification (Phase 3)
    console.warn(`⚠️  Rate limit at ${percentUsed.toFixed(1)}%`);
  }
}
```

---

## Part 8: Configuration Reference

### Environment Variables

```yaml
# .github/workflows/milestone-distribution.yml

env:
  # Rate limit thresholds
  RATE_LIMIT_WARNING_THRESHOLD: 500      # Warn if <500 remaining
  RATE_LIMIT_CRITICAL_THRESHOLD: 100     # Stop if <100 remaining
  
  # Batch processing
  DYNAMIC_BATCH_SIZING: 'true'
  MIN_BATCH_SIZE: 10
  MAX_BATCH_SIZE: 50
  
  # Retry policy
  MAX_RETRIES: 3
  RETRY_BACKOFF_MS: 2000
  
  # Caching
  USE_MILESTONE_CACHE: 'true'
  CACHE_MAX_AGE_MS: 3600000  # 1 hour
  
  # Logging
  VERBOSE_LOGGING: 'false'
  LOG_RATE_LIMIT_CHECK_INTERVAL: 5  # Every 5 batches
```

### Workflow Permissions

```yaml
permissions:
  issues: write
  contents: write  # For cache files
  pull-requests: write
```

---

## Summary Table

| Strategy | When | Impact | Complexity |
|----------|------|--------|-----------|
| Pre-flight checks | Before run | Prevents failures | Low |
| Batch optimization | During run | Reduces calls/issue | Low |
| Real-time tracking | During run | Enables proactive response | Medium |
| Retry-After handling | On 403 error | Recovers from limit | Medium |
| Caching | Between runs | Reduces quota need | Medium |
| Staggered execution | Planned usage | Spreads quota over time | High |
| Quota forecasting | Planning phase | Enables long-term planning | High |

---

## Related Documentation

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — Error diagnosis and recovery
- [MON-002-RATE-LIMIT-MONITORING.md](./MON-002-RATE-LIMIT-MONITORING.md) — Monitoring setup
- [DOC-004-EDGE-CASES.md](./DOC-004-EDGE-CASES.md) — Edge case handling
- [RUNBOOK.md](./RUNBOOK.md) — Operational procedures

---

**Document Owner:** lightspeedwp/maintainers  
**Created:** 2026-09-02  
**Status:** 📋 Complete  
**Relates to:** [DOC-003 Issue #2563](https://github.com/lightspeedwp/.github/issues/2563)

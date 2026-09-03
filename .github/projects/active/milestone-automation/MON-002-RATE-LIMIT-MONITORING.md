---
title: GitHub API Rate Limit Monitoring Setup
description: Implementation guide for monitoring and alerting on API quota usage
type: documentation
file_type: documentation
status: approved
version: "1.0.0"
owner: lightspeedwp/maintainers
owners:
  - lightspeedwp/maintainers
tags: []
---

# MON-002: GitHub API Rate Limit Monitoring

**Document:** MON-002  
**Issue:** [#2559](https://github.com/lightspeedwp/.github/issues/2559)  
**Created:** 2026-09-02  
**Status:** 📋 Monitoring Setup Guide

---

## Overview

GitHub's API enforces rate limits (5,000 requests/hour) that could impact the milestone distribution workflow at scale. This guide documents:

- Quota monitoring setup and alerts
- Graceful degradation strategies
- Recovery procedures
- Dashboard integration

---

## Rate Limit Thresholds & Alerts

### Alert Strategy

| Remaining Quota | Status | Alert Type | Action | Example |
|-----------------|--------|-----------|--------|---------|
| **> 2000** | ✅ Safe | None | Continue normally | All good |
| **1000-2000** | ⚠️ Caution | Info | Monitor closely | Getting low, but safe |
| **500-1000** | 🟡 Warning | Warning | Reduce batch size | Approaching limit |
| **100-500** | 🔴 Critical | Critical | Apply backoff | Immediate backoff needed |
| **0** | ❌ Exhausted | Critical | Wait for reset | Must wait 1 hour |

### Implementation Points

1. **Pre-Execution Check** — Verify quota before large batches
2. **Per-Request Check** — Log remaining quota after each API call
3. **Critical Threshold** — Apply backoff when <500 remaining
4. **Exhaustion Handling** — Graceful exit and retry notification

---

## Monitoring Implementation

### Step 1: Add Rate Limit Checking Workflow

Create a workflow to check rate limits hourly:

```yaml
# .github/workflows/monitor-api-quota.yml
name: Monitor API Rate Limits

on:
  schedule:
    # Every hour at :00
    - cron: '0 * * * *'
  workflow_dispatch:

jobs:
  check-quota:
    runs-on: ubuntu-latest
    steps:
      - name: Check API rate limit
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          # Get rate limit info
          RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
            https://api.github.com/rate_limit)
          
          LIMIT=$(echo "$RESPONSE" | jq '.rate_limit.limit')
          REMAINING=$(echo "$RESPONSE" | jq '.rate_limit.remaining')
          RESET=$(echo "$RESPONSE" | jq '.rate_limit.reset')
          PERCENT=$((REMAINING * 100 / LIMIT))
          
          # Format reset time
          RESET_TIME=$(date -d @$RESET '+%Y-%m-%d %H:%M:%S UTC')
          
          echo "GitHub API Rate Limit Status"
          echo "============================"
          echo "Remaining: $REMAINING/$LIMIT ($PERCENT%)"
          echo "Reset at: $RESET_TIME"
          
          # Alert if critical
          if [ $REMAINING -lt 500 ]; then
            echo "🚨 CRITICAL: Rate limit approaching exhaustion!"
            exit 1
          fi
          
          if [ $REMAINING -lt 1000 ]; then
            echo "⚠️  WARNING: Rate limit below 1000"
          fi
```

### Step 2: Log Rate Limit Headers

Capture rate limit info after each script execution:

```javascript
// scripts/automation/includes/rate-limit-logger.js

class RateLimitLogger {
  /**
   * Octokit Rate Limit Monitoring
   * 
   * IMPORTANT: Response object structure
   * - github.rest.rateLimit.get() returns response directly (not destructured)
   * - response.headers contains rate limit headers as STRINGS
   * - MUST parse header values to integers: parseInt(value, 10)
   * - Always validate parsed values are not NaN before use
   * 
   * Correct usage:
   *   const response = await github.rest.rateLimit.get();
   *   const remaining = parseInt(response.headers['x-ratelimit-remaining'], 10);
   * 
   * Incorrect usage (will fail):
   *   const { response } = await github.rest.rateLimit.get();  // undefined
   *   const remaining = response.headers['x-ratelimit-remaining'];  // string "4500"
   */
  constructor(github) {
    this.github = github;
    this.startTime = Date.now();
    this.apiCalls = 0;
  }

  async logUsage(context = '') {
    try {
      // Correct: Use Octokit response object directly (not destructured)
      const response = await this.github.rest.rateLimit.get();
      
      // Headers are strings and must be parsed to numbers
      const remaining = parseInt(response.headers['x-ratelimit-remaining'], 10);
      const limit = parseInt(response.headers['x-ratelimit-limit'], 10);
      const reset = parseInt(response.headers['x-ratelimit-reset'], 10);
      
      // Validate parsed values
      if (isNaN(remaining) || isNaN(limit) || isNaN(reset)) {
        throw new Error('Failed to parse rate limit headers as integers');
      }
      
      const resetDate = new Date(reset * 1000);
      const percentUsed = ((limit - remaining) / limit * 100).toFixed(1);
      
      const info = {
        context,
        timestamp: new Date().toISOString(),
        remaining,
        limit,
        percentUsed: `${percentUsed}%`,
        resetAt: resetDate.toISOString(),
        apiCallsThisRun: this.apiCalls
      };
      
      // Create info object with numeric values preserved
      const info = {
        context,
        timestamp: new Date().toISOString(),
        remaining: remaining,  // Numeric value, not string
        limit: limit,           // Numeric value, not string
        percentUsed: `${percentUsed}%`,
        resetAt: resetDate.toISOString(),
        apiCallsThisRun: this.apiCalls
      };
      
      // Log to console
      console.log(`
📊 Rate Limit Status (${context})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Remaining: ${info.remaining}/${info.limit}
Used: ${info.percentUsed}
Reset: ${resetDate.toLocaleString()}
API Calls This Run: ${info.apiCallsThisRun}
      `);
      
      // Check thresholds and warn (remaining is numeric, safe for comparison)
      if (info.remaining < 100) {
        console.error('🚨 CRITICAL: Rate limit exhaustion imminent!');
        return { level: 'critical', info };
      }
      
      if (info.remaining < 500) {
        console.warn('🔴 WARNING: Rate limit critical (<500 remaining)');
        return { level: 'warning', info };
      }
      
      if (info.remaining < 1000) {
        console.warn('🟡 CAUTION: Rate limit approaching (<1000 remaining)');
        return { level: 'caution', info };
      }
      
      return { level: 'safe', info };
    } catch (error) {
      console.error('Failed to check rate limit:', error.message);
      return { level: 'unknown', error: error.message };
    }
  }

  recordAPICall() {
    this.apiCalls++;
  }
}

module.exports = RateLimitLogger;
```

### Step 3: Pre-Batch Quota Verification

Before processing large batches, verify sufficient quota:

```javascript
// scripts/automation/distribute-unallocated-milestones.js

async function processMilestones(issues, options = {}) {
  const batchSize = options.batchSize || 25;
  const callsPerIssue = 5.5; // Average from DOC-003
  
  const rateLimitLogger = new RateLimitLogger(github);
  
  for (const batch of chunkArray(issues, batchSize)) {
    // Pre-batch check
    const requiredCalls = batch.length * callsPerIssue;
    const quotaCheck = await rateLimitLogger.logUsage(`Before Batch of ${batch.length}`);
    
    if (quotaCheck.info.remaining < requiredCalls * 1.5) {
      // Insufficient quota (1.5x safety margin)
      console.warn(`⚠️  Insufficient quota for batch. Have ${quotaCheck.info.remaining}, need ~${requiredCalls}`);
      
      if (quotaCheck.info.remaining < 100) {
        throw new Error('Rate limit exhausted. Stopping workflow. Will retry in 1 hour.');
      }
      
      // Reduce batch size
      console.log('Reducing batch size for safety');
      const smallerBatch = batch.slice(0, Math.ceil(batch.length / 2));
      await processBatch(smallerBatch);
    } else {
      // Quota OK, process batch
      await processBatch(batch);
      rateLimitLogger.recordAPICall();
    }
  }
  
  // Final summary
  const finalStatus = await rateLimitLogger.logUsage('After Processing');
  return finalStatus;
}
```

---

## Dashboard & Visualization

### Creating a Metrics Dashboard

Use GitHub Issues or external service to track metrics:

```bash
#!/bin/bash
# scripts/monitoring/collect-rate-limit-metrics.sh

# Call GitHub API and collect metrics
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/rate_limit | \
  jq '{
    timestamp: now,
    limit: .rate_limit.limit,
    remaining: .rate_limit.remaining,
    used: (.rate_limit.limit - .rate_limit.remaining),
    percent_used: ((.rate_limit.limit - .rate_limit.remaining) / .rate_limit.limit * 100),
    reset_time: .rate_limit.reset
  }' | \
  tee -a .github/reports/rate-limit-metrics.jsonl

# Optionally send to external monitoring service
# curl -X POST https://monitoring-service.example.com/metrics \
#   -d @rate-limit-metrics.json
```

### Example Dashboard Query

Track daily usage patterns:

```sql
-- If using a database/analytics service
SELECT
  date,
  COUNT(*) as checks,
  AVG(percent_used) as avg_usage,
  MAX(percent_used) as peak_usage,
  MIN(remaining) as lowest_quota
FROM rate_limit_checks
WHERE date >= CURRENT_DATE - 7
GROUP BY date
ORDER BY date DESC;
```

---

## Backoff & Recovery Strategy

### Exponential Backoff Implementation

When rate limited, retry with increasing delays:

```javascript
// scripts/automation/includes/exponential-backoff.js

async function retryWithBackoff(apiCall, maxRetries = 3) {
  const backoffDelays = [2000, 4000, 8000]; // 2s, 4s, 8s
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      if (error.status === 403 && error.message.includes('rate limit')) {
        const isLastAttempt = attempt === maxRetries - 1;
        const delay = backoffDelays[attempt];
        
        console.warn(`
⏳ Rate limited. Attempt ${attempt + 1}/${maxRetries}
Waiting ${delay}ms before retry...
${isLastAttempt ? '⚠️  This is the last attempt' : ''}
        `);
        
        if (isLastAttempt) {
          throw new Error(`Rate limit exceeded after ${maxRetries} retries. Workflow stopping.`);
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error; // Not a rate limit error
      }
    }
  }
}
```

### Graceful Degradation

When quota is low:

```javascript
async function gracefullyDegrade(issues, currentQuota, callsPerIssue = 5.5) {
  const safeIssueCount = Math.floor(currentQuota / (callsPerIssue * 1.5)); // 1.5x safety margin
  
  if (safeIssueCount === 0) {
    return {
      status: 'exhausted',
      message: 'Rate limit exhausted. Stopping workflow.',
      action: 'Retry after quota reset (1 hour)',
      processed: 0,
      remaining: issues.length
    };
  }
  
  if (safeIssueCount < issues.length) {
    console.warn(`
⚠️  Quota limited. Can safely process ${safeIssueCount}/${issues.length} issues.
Processing what we can and scheduling retry for remainder.
    `);
    
    return {
      status: 'degraded',
      message: `Limited processing: ${safeIssueCount}/${issues.length} issues`,
      processed: safeIssueCount,
      remaining: issues.length - safeIssueCount,
      action: 'Retry remaining issues in next hour'
    };
  }
  
  return { status: 'ok', message: 'Sufficient quota', processed: issues.length };
}
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Rate limit monitoring workflow created
- [ ] Quota checks integrated into main script
- [ ] Exponential backoff implemented
- [ ] Graceful degradation tested
- [ ] Alert thresholds configured
- [ ] Dashboard/reporting setup
- [ ] Runbook updated with recovery steps

### Monitoring After Deploy

**First Week:**
- Daily check of rate limit usage patterns
- Verify backoff works if triggered
- Collect baseline metrics

**Ongoing:**
- Weekly rate limit summary
- Alert on quota > 80% used
- Monthly optimization review

---

## Related Documents

- [DOC-003-API-RATE-LIMITS.md](./DOC-003-API-RATE-LIMITS.md) — Detailed rate limit strategy
- [MON-001-WORKFLOW-ALERTS.md](./MON-001-WORKFLOW-ALERTS.md) — Workflow failure alerts
- [RUNBOOK.md](./RUNBOOK.md) — Operational procedures
- [GitHub API Documentation](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)

---

**Document Owner:** lightspeedwp/maintainers  
**Created:** 2026-09-02  
**Status:** 📋 Complete  
**Relates to:** [MON-002 Issue #2559](https://github.com/lightspeedwp/.github/issues/2559)

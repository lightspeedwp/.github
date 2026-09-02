---
file_type: documentation
title: API Rate Limit Handling Strategy
description: GitHub API quota management and backoff strategies for milestone automation
created_date: 2026-09-02
last_updated: 2026-09-02
---

# API Rate Limit Handling Strategy

**Document:** DOC-003  
**Issue:** [#2563](https://github.com/lightspeedwp/.github/issues/2563)  
**Created:** 2026-09-02  
**Status:** 📋 Strategy Documentation

---

## Overview

GitHub API enforces rate limits to ensure service stability. The milestone distribution automation must respect these limits and implement graceful degradation strategies when approaching quota limits.

### Key Constraints

- **Rate Limit:** 5,000 requests per hour
- **Reset Interval:** 1 hour from first request
- **Remaining Quota:** Available in `X-RateLimit-Remaining` response header
- **Workflow Timeout:** 30 minutes per run (GitHub Actions default)

### Current Usage Profile

**Per-issue API calls (baseline from TEST-002):**
- Query issue: 1 call
- Check linked PRs: 1 call  
- Get PR milestones: ~1.5 calls (varies)
- Update issue milestone: 1 call
- Add PR comment: ~0.5 calls (50% of issues linked)
- **Total: 5-6 calls per issue**

---

## Rate Limit Thresholds

### Safety Levels

| Quota Remaining | Status | Action | Notes |
|-----------------|--------|--------|-------|
| **> 1000** | ✅ Safe | Continue normally | No restrictions needed |
| **500-1000** | ⚠️ Caution | Monitor closely | Approaching limits |
| **100-500** | 🟡 Warning | Enable backoff | Reduce batch size |
| **< 100** | 🔴 Critical | Stop/Retry later | Immediate backoff |
| **0** | ❌ Exhausted | Wait for reset | Rate limit exceeded |

### Batch Size Strategy

Adjust batch sizes based on remaining quota:

```javascript
// Dynamic batch sizing
function getBatchSize(remainingQuota) {
  if (remainingQuota > 1000) {
    return 100; // Process 100 issues per batch
  } else if (remainingQuota > 500) {
    return 50;  // Reduce to 50 per batch
  } else if (remainingQuota > 100) {
    return 25;  // Conservative: 25 per batch
  } else {
    return 10;  // Minimum safe batch
  }
}
```

---

## Backoff Strategy

### Exponential Backoff on Rate Limit Exhaustion

When GitHub returns HTTP 403 (rate limit exceeded):

```javascript
async function retryWithBackoff(apiCall, maxRetries = 3) {
  const backoffDelays = [2000, 4000, 8000]; // 2s, 4s, 8s
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      if (error.status === 403) {
        if (attempt < maxRetries - 1) {
          const delay = backoffDelays[attempt];
          console.log(`Rate limited. Waiting ${delay}ms before retry...`);
          await sleep(delay);
        } else {
          throw new Error(`Rate limit exceeded after ${maxRetries} retries`);
        }
      } else {
        throw error; // Not a rate limit error, re-throw
      }
    }
  }
}
```

### Backoff Timeline

```
Attempt 1: Immediate
  └─ Fails with 403
  
Attempt 2: Wait 2 seconds
  └─ Fails with 403
  
Attempt 3: Wait 4 seconds
  └─ Fails with 403
  
Attempt 4: Wait 8 seconds
  └─ Succeeds (quota reset)

Total backoff: 2 + 4 + 8 = 14 seconds
```

---

## Pre-Request Quota Checking

### Check Before Processing Large Batches

```javascript
async function checkQuotaBeforeBatch(batchSize, callsPerIssue = 6) {
  const { response } = await github.rest.rate_limit.get();
  const { remaining } = response.headers['x-ratelimit-remaining'];
  const requiredCalls = batchSize * callsPerIssue;
  
  if (remaining < requiredCalls) {
    console.warn(`Insufficient quota: Have ${remaining}, need ${requiredCalls}`);
    return false;
  }
  
  return true;
}
```

### Graceful Degradation

```javascript
async function processMilestones(issues) {
  for (const batch of getBatches(issues, batchSize)) {
    // Pre-check quota
    const quotaOk = await checkQuotaBeforeBatch(batch.length);
    
    if (!quotaOk) {
      // Graceful degradation: log and continue next hour
      console.warn(`Stopping batch processing: Insufficient quota`);
      return {
        processed: processedCount,
        remaining: issues.length - processedCount,
        nextRetry: 'In 1 hour (quota reset)',
        recommendation: 'Check again after 1 hour'
      };
    }
    
    // Process batch normally
    await processBatch(batch);
  }
}
```

---

## Monitoring & Alerts

### Implementation (MON-002)

**Webhook configuration to monitor quota:**

```yaml
# GitHub Actions workflow step
- name: Check API Rate Limit
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    curl -H "Authorization: token $GITHUB_TOKEN" \
      https://api.github.com/rate_limit | \
      jq '.rate_limit | {limit, used, remaining, reset_time: (.reset | strftime("%Y-%m-%d %H:%M:%S"))}'
```

**Alert Conditions:**

| Event | Condition | Action | Channel |
|-------|-----------|--------|---------|
| **Warning** | Remaining < 500 | Log warning | GitHub Actions log |
| **Escalation** | Remaining < 200 | Create issue comment | PR/Issue thread |
| **Critical** | Remaining < 50 | Pause workflow | Stop processing |
| **Exhausted** | Remaining = 0 | Wait for reset | Retry after 1 hour |

---

## API Call Optimization

### Techniques to Reduce Quota Consumption

#### 1. Request Batching

**Instead of:** Multiple individual requests
**Use:** GraphQL with multiple queries in one request

```graphql
query GetMultipleIssues {
  repository(owner: "lightspeedwp", name: ".github") {
    issues1: issues(first: 25, states: OPEN) {
      edges { node { number, title, milestone { title } } }
    }
    issues2: issues(first: 25, after: "cursor", states: OPEN) {
      edges { node { number, title, milestone { title } } }
    }
  }
}
```

**Benefit:** 1 API call instead of 50 individual calls

#### 2. Caching Results

```javascript
const issueCache = new Map();

async function getIssueDetails(issueNumber, useCache = true) {
  if (useCache && issueCache.has(issueNumber)) {
    return issueCache.get(issueNumber);
  }
  
  const issue = await github.rest.issues.get({...});
  issueCache.set(issueNumber, issue);
  return issue;
}
```

**Benefit:** Avoid redundant API calls for frequently accessed issues

#### 3. Selective Field Retrieval

**Instead of:** Fetch all fields
**Use:** Only fields needed for milestone allocation

```javascript
// Inefficient: Gets all fields (1 call, 5KB response)
const issue = await github.rest.issues.get({
  owner, repo, issue_number
});

// Efficient: Get only needed fields (1 call, 1KB response)
const issue = await github.graphql(`
  query { 
    repository(owner: "${owner}", name: "${repo}") {
      issue(number: ${issueNumber}) {
        number
        title
        milestone { id, title }
      }
    }
  }
`);
```

---

## Error Handling & Recovery

### Common Rate Limit Errors

#### Error 1: HTTP 403 Forbidden

```
{
  "message": "API rate limit exceeded",
  "documentation_url": "https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting"
}
```

**Handling:**
```javascript
if (error.status === 403 && error.message.includes('rate limit')) {
  const resetTime = error.response.headers['x-ratelimit-reset'];
  console.error(`Rate limit exceeded. Reset at: ${new Date(resetTime * 1000)}`);
  // Apply backoff and retry
}
```

#### Error 2: Secondary Rate Limit (Abuse Limit)

```
{
  "message": "You have exceeded a secondary rate limit...",
  "retry_after": 60
}
```

**Handling:**
```javascript
if (error.status === 403 && error.response.headers['retry-after']) {
  const waitSeconds = parseInt(error.response.headers['retry-after']);
  console.log(`Secondary rate limit. Waiting ${waitSeconds} seconds...`);
  await sleep(waitSeconds * 1000);
}
```

---

## Production Implementation Guide

### Phase 2 (Current)

**Minimal implementation:**
- ✅ Document rate limits and thresholds
- ✅ Log quota consumption per run
- ⚠️ Manual monitoring by ops team

### Phase 3 (Planned)

**Enhanced implementation:**
- [ ] Automatic batch size adjustment
- [ ] Quota warning alerts
- [ ] Rate limit recovery procedure

### Phase 4+ (Future)

**Advanced implementation:**
- [ ] GraphQL batch queries
- [ ] Request caching layer
- [ ] Distributed processing
- [ ] Database state tracking

---

## Examples & Scenarios

### Scenario 1: Normal Processing (Safe Quota)

**Remaining quota: 3000**

```
Processing 50 issues:
├─ Required calls: 50 × 6 = 300
├─ Remaining after: 3000 - 300 = 2700
├─ Safety margin: 2700 (90%)
└─ Status: ✅ SAFE
```

### Scenario 2: Caution (Approaching Limit)

**Remaining quota: 600**

```
Processing 50 issues:
├─ Required calls: 50 × 6 = 300
├─ Remaining after: 600 - 300 = 300
├─ Safety margin: 300 (5%)
└─ Status: ⚠️ CAUTION
  
Action: Reduce batch to 25 issues (150 calls)
├─ Required: 150
├─ Remaining: 600 - 150 = 450
└─ Status: ✅ SAFER
```

### Scenario 3: Critical (Near Exhaustion)

**Remaining quota: 100**

```
Processing 25 issues:
├─ Required calls: 25 × 6 = 150
├─ Remaining: 100 < 150
├─ Status: ❌ INSUFFICIENT
  
Action: Wait for quota reset
└─ Resume in 1 hour (next billing cycle)
```

---

## Monitoring Dashboard Metrics

### Key Metrics to Track

1. **Quota Consumption Rate**
   - Calls per issue average
   - Batch efficiency

2. **Threshold Breach Events**
   - Times rate limit approached
   - Recovery success rate

3. **Performance Impact**
   - Backoff delay vs. success
   - User-facing delays

### Example Dashboard Query

```sql
SELECT 
  date,
  total_calls,
  total_issues,
  calls_per_issue,
  min_remaining_quota,
  backoff_events,
  successful_retries
FROM milestone_automation_metrics
WHERE date > CURRENT_DATE - 7
ORDER BY date DESC
```

---

## Testing & Validation

### Test Cases

- [ ] **T1:** Normal processing with >2000 quota
- [ ] **T2:** Caution mode (600-1000 quota)
- [ ] **T3:** Critical mode (<100 quota)
- [ ] **T4:** Backoff retry simulation
- [ ] **T5:** Secondary rate limit handling
- [ ] **T6:** Quota reset recovery

### Acceptance Criteria

- ✅ Zero unauthorized quota consumption
- ✅ Graceful degradation on low quota
- ✅ Successful recovery after rate limit
- ✅ Accurate quota monitoring
- ✅ Clear alerts to operations team

---

## References

- [GitHub API Rate Limiting](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)
- [GraphQL API Rate Limits](https://docs.github.com/en/graphql/overview/rate-limits-and-node-limits-for-the-graphql-api)
- [OPENSPEC.md](./OPENSPEC.md) — Error handling implementation
- [MON-002](https://github.com/lightspeedwp/.github/issues/2559) — Rate limit monitoring setup
- [TEST-002](https://github.com/lightspeedwp/.github/issues/2566) — Load testing results

---

**Document Owner:** lightspeedwp/maintainers  
**Created:** 2026-09-02  
**Status:** 📋 Complete  
**Relates to:** [DOC-003 Issue #2563](https://github.com/lightspeedwp/.github/issues/2563)

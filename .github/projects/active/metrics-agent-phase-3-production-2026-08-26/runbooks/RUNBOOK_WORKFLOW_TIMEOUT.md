---
title: "Runbook: Metrics Pipeline Workflow Timeout"
description: "Recovery steps for workflow runs exceeding the 5-minute collection time target"
status: "active"
severity: "high"
created_date: "2026-08-21"
last_updated: "2026-08-21"
---

# Runbook: Workflow Timeout

## Problem Statement

The metrics collection workflow runs longer than the 5-minute target or times out entirely.

**Symptom:**

- Workflow log shows collection still running after 5+ minutes
- GitHub Actions job timeout reached (default 6 hours)
- Collection step marked as "in progress" for extended period

**Impact:**

- Weekly metrics report delays
- Team misses scheduled metrics availability
- Downstream integrations may not receive updated metrics

---

## Severity Levels

| Level | Condition | Response Time |
|-------|-----------|---|
| **Low** | Collection takes 5-7 minutes | Monitor next 2 runs |
| **Medium** | Collection takes 7-10 minutes | Investigate & optimize |
| **High** | Collection takes >10 minutes or times out | Immediate action required |

---

## Diagnostic Steps

### Step 1: Access Workflow Run

1. Navigate to `.github/workflows/metrics-reporting.yml` run:
   - GitHub repo → Actions → "Metrics • Collection & Reporting"
   - Click the most recent run
2. View the "Collect" job logs
3. Note the timing of each step:
   - Checkout: typically <10s
   - Setup Node: typically <30s
   - Install deps: typically 20-60s
   - Run metrics: **should be <300s**

### Step 2: Identify Slow Step

Look for steps with unusual timing:

```bash
# In job logs, check step durations:
# If "Run metrics" step exceeds 5 minutes, continue to Step 3
# If "Install deps" exceeds 2 minutes, may indicate npm registry issue
# If "Setup Node" exceeds 1 minute, may indicate GitHub Actions infrastructure issue
```

### Step 3: Check GitHub Status

1. Visit <https://www.githubstatus.com/>
2. Look for:
   - GitHub Actions outages or degradation
   - API rate limiting notifications
   - Network connectivity issues

### Step 4: Review Recent Changes

Check if any recent commits changed:

- `scripts/metrics/` — collection logic
- `.github/workflows/metrics-reporting.yml` — workflow definition
- `package.json` dependencies

---

## Solutions

### Solution A: API Rate Limiting (Most Common)

**Diagnosis:** Logs show `403 Forbidden` or `API rate limit exceeded`

**Recovery Steps:**

1. **Verify GitHub token validity:**

   ```bash
   # In Actions job, check if GITHUB_TOKEN is valid
   # Token should have repo:read, actions:read permissions
   ```

2. **Check current rate limit status:**
   - Visit GitHub API: `https://api.github.com/rate_limit`
   - Look for `core` limit usage (usually 60 req/hour for public, 5000 req/hour authenticated)

3. **Optimize API calls:**
   - Review `scripts/metrics/metrics.js` for unnecessary API calls
   - Consider caching stable data
   - Batch API requests where possible
   - Add delays between requests if needed

4. **Increase rate limit window:**
   - Ensure workflow uses authenticated GitHub token (already done in workflow)
   - If still hitting limits, may need to split metrics collection across multiple jobs

5. **Re-run workflow:**
   - After rate limit window resets (1 hour), manually trigger workflow
   - Click "Run workflow" button in Actions tab

### Solution B: Data Volume Increase

**Diagnosis:** Logs show collection taking progressively longer over time

**Recovery Steps:**

1. **Profile collection by context:**
   - Add timing logs to `scripts/metrics/metrics.js`:

   ```javascript
   const start = Date.now();
   // ... collection code ...
   console.log(`${contextName}: ${Date.now() - start}ms`);
   ```

2. **Identify which context is slow:**
   - Control plane context
   - Plugins context
   - Themes context

3. **Optimize the slowest context:**
   - Reduce number of files scanned
   - Add pagination for large API responses
   - Use caching for frequently accessed data
   - Consider background collection for non-critical contexts

4. **Test optimization locally:**

   ```bash
   npm run metrics:ci
   # Compare timing before/after change
   ```

### Solution C: Network Issues

**Diagnosis:** Logs show `ECONNREFUSED`, `ETIMEDOUT`, or `EHOSTUNREACH`

**Recovery Steps:**

1. **Check network connectivity:**
   - Ping GitHub.com from Actions environment
   - Verify no corporate firewall blocking GitHub APIs
   - Check DNS resolution

2. **Add retry logic:**
   - Implement exponential backoff in `metrics.js`
   - Retry failed API calls up to 3 times
   - Add delay between retries (1s, 2s, 4s)

3. **Increase timeout values:**
   - Default Node.js timeout is 30s
   - For large responses, increase to 60s:

   ```javascript
   https.get({
     ...options,
     timeout: 60000  // 60 seconds
   });
   ```

4. **Re-run workflow:**
   - Network issues often transient
   - Retry automatic next scheduled run

### Solution D: Node.js/npm Issues

**Diagnosis:** Logs show `npm ERR!` or `node` process crashes

**Recovery Steps:**

1. **Clear npm cache:**
   - Already done by `npm ci`, but can try:

   ```bash
   npm cache clean --force
   ```

2. **Verify .nvmrc Node version:**
   - Check `.nvmrc` file (should specify valid Node version)
   - Ensure version is still supported

3. **Update dependencies:**
   - Run locally: `npm install`
   - Verify no breaking changes
   - Commit updated `package-lock.json`

4. **Check disk space:**
   - npm may fail if disk is full
   - GitHub Actions has generous disk allocation
   - Monitor `node_modules` size

---

## Prevention

To prevent future timeouts:

1. **Set performance baseline:**
   - Establish 3-minute target (leaves 2-minute safety margin)
   - Monitor weekly performance trends

2. **Implement alerting:**
   - Alert if collection time > 5 minutes
   - Daily digest of slowest steps

3. **Regular optimization review:**
   - Quarterly review of slowest collection steps
   - Refactor unnecessarily expensive operations

4. **Load testing:**
   - Simulate collection with 2x data volume
   - Identify breaking points early

---

## Escalation

**If problem persists after 2 hours:**

1. Contact GitHub Support at <https://support.github.com>
2. Include:
   - Workflow run URL
   - Timing of each step
   - Recent code changes
   - Network diagnostics

3. Temporarily disable scheduled metrics:
   - Edit `.github/workflows/metrics-reporting.yml`
   - Comment out schedule trigger
   - Switch to manual-only for investigation

---

## Quick Reference

| Symptom | First Action |
|---------|---|
| Takes 5-7 min | Monitor next run |
| Takes >7 min | Profile each context |
| Rate limit error | Wait 1 hour, retry |
| Timeout reached | Add retry logic |
| API errors | Verify token/permissions |
| Network errors | Retry, check connectivity |

---

**Created:** 2026-08-21  
**Last Updated:** 2026-08-21  
**Runbook Version:** 1.0  
**Maintainer:** Phase 3 Monitoring Team

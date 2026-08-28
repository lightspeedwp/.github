---
title: "Runbook: Metrics API Failures"
description: "Recovery steps for GitHub API failures during metrics collection"
status: "active"
severity: "high"
created_date: "2026-08-21"
last_updated: "2026-08-21"
---

# Runbook: API Failures

## Problem Statement

Metrics collection fails due to GitHub API errors (4xx/5xx responses).

**Symptoms:**

- Logs show `GET https://api.github.com` returns 401, 403, 404, 429, 500, 502, 503
- "API request failed" errors in workflow logs
- Metrics collection halts without completing

**Impact:**

- No metrics generated for the week
- Downstream systems don't receive updated data
- Team unaware of repository health status

---

## Severity Levels

| Level | Error Type | Response Time |
|-------|-----------|---|
| **Low** | 404 Not Found | Review query, next run |
| **Medium** | 401/403 Auth errors | Rotate credentials immediately |
| **High** | 429 Rate limit | Check quota, optimize, retry |
| **Critical** | 500/502/503 Server errors | Escalate to GitHub support |

---

## Diagnostic Steps

### Step 1: Identify Error Type

1. Go to failed workflow run
2. Expand "Run metrics" step in logs
3. Find error message pattern:

```
❌ API request failed
URL: https://api.github.com/repos/...
Status: <HTTP_STATUS>
Message: <ERROR_MESSAGE>
```

### Step 2: Categorize by Error Code

| Code | Meaning | Next Step |
|------|---------|-----------|
| 400 | Bad Request | Check request format, Step 3A |
| 401 | Unauthorized | Check token validity, Step 3B |
| 403 | Forbidden | Check permissions, Step 3B |
| 404 | Not Found | Check endpoint, Step 3C |
| 429 | Rate Limited | Check quota, Step 3D |
| 500/502/503 | Server Error | Check GitHub status, Step 3E |

### Step 3: Look Up Specific Error Details

Check `GITHUB_TOKEN` secrets in Actions:

1. Go to repo Settings → Secrets and variables → Actions
2. Verify `GITHUB_TOKEN` exists
3. Check GitHub documentation for current token scopes

---

## Solutions

### Solution 3A: Bad Request (400)

**Cause:** API request is malformed or uses deprecated endpoint

**Recovery Steps:**

1. **Verify request format:**

   ```bash
   # Check the exact request in logs
   # Look for URL and query parameters
   ```

2. **Check API documentation:**
   - Visit <https://docs.github.com/en/rest>
   - Verify endpoint path matches current API
   - Ensure all required parameters included

3. **Test request manually:**

   ```bash
   # Get valid GitHub token
   TOKEN=$(grep GITHUB_TOKEN .github/workflows/metrics-reporting.yml)
   
   # Test problematic endpoint
   curl -H "Authorization: Bearer $TOKEN" \
        https://api.github.com/repos/lightspeedwp/.github/issues?state=open
   ```

4. **Update metrics collection script:**
   - Fix request format in `scripts/metrics/metrics.js`
   - Re-run workflow

### Solution 3B: Authentication Failures (401/403)

**Cause:** Token missing, expired, or lacks required permissions

**Recovery Steps:**

1. **Verify token exists in Actions:**

   ```
   Settings → Secrets and variables → Actions
   Look for: GITHUB_TOKEN
   ```

2. **Check token permissions:**
   - Actions should have "Read repository contents" permission
   - Workflow should request: `contents: read`, `actions: read`

3. **Rotate GitHub token:**
   - If token exposed or suspicious: regenerate
   - GitHub → Settings → Developer settings → Personal access tokens
   - Delete old token, create new one
   - Copy to repo secrets as `GITHUB_TOKEN`

4. **Verify workflow permissions:**

   ```yaml
   # In metrics-reporting.yml
   permissions:
     contents: read      # ✅ Required
     actions: read       # ✅ Required
     issues: write       # ✅ For issue creation
     discussions: write  # ✅ For discussion posts
   ```

5. **Test token:**

   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://api.github.com/user
   
   # Should return user info, not 401/403
   ```

6. **Re-run workflow:**
   - After updating secrets
   - Click "Re-run failed jobs" in Actions

### Solution 3C: Not Found (404)

**Cause:** Endpoint doesn't exist or repository name is wrong

**Recovery Steps:**

1. **Verify repository path:**
   - Metrics should query `lightspeedwp/.github`
   - Check that repo still exists and is accessible
   - Try browsing to <https://github.com/lightspeedwp/.github>

2. **Check deprecated endpoints:**
   - Some GitHub API v3 endpoints are deprecated
   - Review API changelog at <https://docs.github.com/en/rest>
   - Update to v4/v3 latest syntax

3. **Verify endpoint syntax:**

   ```bash
   # Correct format:
   https://api.github.com/repos/OWNER/REPO/issues
   
   # Common errors:
   https://api.github.com/repos/lightspeedwp/.github/issues  # ✅ Correct
   https://api.github.com/repos/.github/issues               # ❌ Missing owner
   ```

4. **Update metrics collection script:**
   - Correct repository path
   - Verify endpoint syntax

### Solution 3D: Rate Limited (429)

**Cause:** API rate limit exceeded (usually 5000 requests/hour)

**Recovery Steps:**

1. **Check current rate limit:**

   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://api.github.com/rate_limit
   
   # Look for: "remaining": <number>
   # If remaining is 0, limit hit
   ```

2. **Wait for quota reset:**
   - Rate limit resets on hourly boundaries (UTC)
   - You can find reset time in response headers: `X-RateLimit-Reset`
   - Formula: `date +%s` to see current Unix time, compare to reset value

3. **Optimize metrics collection:**
   - Add delays between API calls: `sleep 100ms` between requests
   - Batch multiple queries into single GraphQL request
   - Cache results of expensive queries
   - Reduce scope of API queries

4. **Implement retry logic:**

   ```javascript
   // In metrics.js
   async function fetchWithRetry(url, options, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await fetch(url, options);
       } catch (err) {
         if (err.status === 429) {
           const resetTime = parseInt(err.headers['x-ratelimit-reset']) * 1000;
           const delay = resetTime - Date.now();
           await new Promise(r => setTimeout(r, delay + 1000));
           continue;
         }
         throw err;
       }
     }
   }
   ```

5. **Re-run workflow after rate limit resets:**
   - Wait for reset time
   - Click "Re-run failed jobs"

### Solution 3E: Server Errors (500/502/503)

**Cause:** GitHub API server is having issues

**Recovery Steps:**

1. **Check GitHub Status:**
   - Visit <https://www.githubstatus.com/>
   - Look for: API, Actions, or general incidents
   - Subscribe to updates if ongoing

2. **Wait for recovery:**
   - GitHub engineers are likely already working on it
   - These typically resolve within 15-60 minutes
   - Monitor status page for updates

3. **Manual retry:**
   - After 5-10 minutes, manually re-run workflow
   - If continues failing, wait longer

4. **Escalate if persistent:**
   - If failing >30 minutes: contact GitHub support
   - Include:
     - Exact time of first failure
     - Workflow run URL
     - Error status and message

5. **Temporary mitigation:**
   - Disable scheduled metrics collection
   - Re-enable when GitHub recovers
   - Run manual collection to backfill

---

## Prevention

1. **Token rotation schedule:**
   - Rotate GitHub tokens quarterly
   - Alert when token approaches expiration

2. **Monitor API changes:**
   - Subscribe to GitHub API changelog: <https://docs.github.com/en/rest/overview/api-versions>
   - Review quarterly for deprecation notices

3. **Rate limit awareness:**
   - Log API request counts weekly
   - Alert if approaching rate limit threshold
   - Plan optimizations before hitting limits

4. **Resilience patterns:**
   - Implement retries for transient errors
   - Add exponential backoff
   - Use GraphQL for batch queries

---

## Quick Reference

| Error | Cause | Action |
|-------|-------|--------|
| 400 | Bad request | Check request format |
| 401/403 | Auth failed | Verify token |
| 404 | Not found | Verify endpoint/repo |
| 429 | Rate limited | Wait, optimize, retry |
| 500/502/503 | Server error | Check GitHub status, retry |

---

**Created:** 2026-08-21  
**Last Updated:** 2026-08-21  
**Runbook Version:** 1.0  
**Maintainer:** Phase 3 Monitoring Team

---
title: "Runbook: Performance Degradation"
description: "Recovery steps for increasing metrics collection time"
status: "active"
severity: "medium"
created_date: "2026-08-21"
last_updated: "2026-08-21"
---

# Runbook: Performance Degradation

## Problem Statement

Metrics collection time increases over time, approaching or exceeding target thresholds.

**Symptoms:**
- Collection time increases week-over-week (3min → 4min → 5min)
- Consistent collection time > 300 seconds (5 minutes)
- Specific step(s) consistently slower than baseline
- Performance degradation correlates with repo growth

**Impact:**
- Metrics collection nears timeout limit
- Less time for report generation
- Reduced operational safety margin
- May exceed workflow limits during peak usage

---

## Diagnostic Steps

### Step 1: Establish Baseline

1. Check metrics collection times over 4-8 weeks:
   - Visit `.github/workflows/metrics-reporting.yml` runs
   - Record "Run metrics" step duration for each run

2. Create timeline:
   ```
   Week 1: 120s (2min)
   Week 2: 140s (2.3min)
   Week 3: 160s (2.7min)
   Week 4: 180s (3min) ← Growing trend
   Week 5: 200s (3.3min)
   ```

3. Identify:
   - Baseline (healthy): < 3 minutes
   - Warning: 3-4 minutes
   - Critical: 4-5 minutes
   - Timeout risk: > 5 minutes

### Step 2: Profile Collection Steps

1. Check collection step breakdown:
   ```
   Checkout:      10s
   Setup Node:    25s
   Install deps:  45s
   Run metrics:  170s  ← This is the bulk
   ```

2. Within "Run metrics", identify sub-context times:
   - Look for detailed logs showing timing per context
   - If logs unavailable, add timing to `metrics.js`

3. Rank contexts by time:
   ```
   Control Plane: 80s  (47% of total)
   Plugins:       60s  (35% of total)
   Themes:        30s  (18% of total)
   ```

### Step 3: Correlate with Repo Growth

1. Check repository metrics over same period:
   ```bash
   git log --since="2 months ago" | wc -l  # Total commits
   find . -type f | wc -l                  # Total files
   find . -name "*.md" | wc -l             # Markdown files
   ```

2. Track growth rates:
   - Files added per week
   - Code complexity increase
   - Issue/PR volume increase

3. Hypothesis:
   - More files = longer collection
   - More complex patterns = slower matching
   - Larger API responses = slower parsing

---

## Solutions

### Solution A: Pagination Issue (Most Common)

**Diagnosis:** Single context takes surprisingly long, likely API-related

**Recovery Steps:**

1. **Enable pagination logging:**
   - Add to `metrics.js`:
   ```javascript
   console.log(`Fetching page ${page}/${totalPages} for ${context}`);
   ```

2. **Check pagination efficiency:**
   - Is script fetching all pages?
   - Are pages fetched sequentially or parallel?
   - Any unnecessary delay between requests?

3. **Optimize pagination:**
   ```javascript
   // Parallel fetch all pages
   const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
   const results = await Promise.all(
     pages.map(page => fetchPage(page))
   );
   ```

4. **Test optimization:**
   ```bash
   npm run metrics:ci
   # Compare timing to baseline
   ```

### Solution B: Growing Data Volume

**Diagnosis:** All contexts slow down proportionally to repo growth

**Recovery Steps:**

1. **Reduce query scope:**
   - Current queries might fetch unnecessary data
   - Example: fetching all issues from beginning of time
   - Instead: fetch only last 90 days

2. **Implement data filtering:**
   ```javascript
   // Before: Fetch all, then filter
   const allIssues = await fetchAllIssues();  // 1000 issues
   const active = allIssues.filter(i => isActive(i)); // 50 used
   
   // Better: Filter in query
   const activeIssues = await fetchIssues({
     created: 'last 90 days',
     state: 'open'
   });  // 50 issues from start
   ```

3. **Add sampling for large datasets:**
   - If analyzing 10k+ files, sample 10% instead
   - Document sampling rate in metrics
   - Adjust health calculations for sample

4. **Cache stable data:**
   - Some data doesn't change weekly (repo structure)
   - Cache between runs
   - Only refresh on schedule

### Solution C: No Query Pagination

**Diagnosis:** API calls returning partial results, code re-queries instead of using pagination

**Recovery Steps:**

1. **Check API response handling:**
   ```javascript
   // Bad: Only processes first page
   const issues = await github.issues.list({
     owner: 'lightspeedwp',
     repo: '.github'
   });
   // Uses issues[0..30] only
   
   // Better: Handle pagination
   const allIssues = [];
   for await (const { data } of github.paginate('GET /repos/{owner}/{repo}/issues')) {
     allIssues.push(...data);
   }
   ```

2. **Use GraphQL batch queries:**
   - GitHub GraphQL can fetch multiple objects in one request
   - Reduce number of API calls significantly
   - More efficient than REST pagination

3. **Example GraphQL optimization:**
   ```graphql
   {
     repo1: repository(owner: "lightspeedwp", name: ".github") {
       issues(first: 100) { totalCount }
       pullRequests(first: 100) { totalCount }
     }
     repo2: repository(...) { ... }
   }
   ```

4. **Test and measure:**
   ```bash
   npm run metrics:ci
   # Should see significant speedup if API calls reduced
   ```

### Solution D: File Scanning Too Broad

**Diagnosis:** Themes or plugins context slow, likely file matching

**Recovery Steps:**

1. **Check file patterns:**
   ```javascript
   // Current pattern (might be too broad)
   const pluginFiles = allFiles.filter(f => 
     f.includes('plugins') // Matches any 'plugins' string
   );
   
   // Better pattern (specific path)
   const pluginFiles = allFiles.filter(f =>
     f.match(/wp-content\/plugins\//)
   );
   ```

2. **Optimize file search:**
   - Use specific regex patterns
   - Avoid case-insensitive searches if case-sensitive works
   - Pre-filter list before complex matching

3. **Consider caching file list:**
   - File structure changes infrequently
   - Cache for 7 days
   - Invalidate on major restructures

4. **Parallel processing:**
   ```javascript
   // Process files in chunks
   const chunkSize = 100;
   for (let i = 0; i < files.length; i += chunkSize) {
     const chunk = files.slice(i, i + chunkSize);
     const results = await Promise.all(
       chunk.map(f => processFile(f))
     );
     allResults.push(...results);
   }
   ```

### Solution E: Inefficient Data Parsing

**Diagnosis:** Download time fast, but parsing slow (large JSON response)

**Recovery Steps:**

1. **Profile JSON parsing:**
   ```javascript
   const start = Date.now();
   const data = JSON.parse(response);
   console.log(`Parse time: ${Date.now() - start}ms`);
   ```

2. **Use streaming for large responses:**
   ```javascript
   // Instead of buffering entire response
   response.on('data', chunk => {
     // Process chunk as it arrives
   });
   ```

3. **Filter before parsing:**
   - Request only needed fields from API
   - Reduces JSON size
   - Less parsing overhead

4. **Cache parsed results:**
   - Parse once, use multiple times
   - Avoid re-parsing same data

### Solution F: External Delays

**Diagnosis:** Logs show waiting periods with no code activity

**Recovery Steps:**

1. **Check for sleep/delays:**
   ```javascript
   // Search for:
   setTimeout, sleep, wait, delay
   // These are legitimate for rate limiting
   // But may be too aggressive
   ```

2. **Optimize delays:**
   - Rate limiting: 100ms between requests is usually safe
   - Reduce to 10-50ms if possible
   - Remove unnecessary delays

3. **Check GitHub Actions runner:**
   - Sometimes runner is slow
   - Not usually something code can optimize
   - But verify with `top` or `/proc/cpuinfo`

---

## Performance Optimization Checklist

- [ ] Review API query efficiency
- [ ] Implement pagination for all API calls
- [ ] Use GraphQL for batch queries
- [ ] Optimize file patterns
- [ ] Add parallel processing where safe
- [ ] Implement caching for stable data
- [ ] Reduce query scope (time range, filters)
- [ ] Test each optimization individually
- [ ] Document baseline vs. optimized times
- [ ] Add performance monitoring

---

## Prevention

1. **Monitor trends weekly:**
   - Graph collection time over time
   - Alert if trend shows degradation
   - Investigate before hitting limits

2. **Set performance budget:**
   - Target: < 3 minutes
   - Warning: 3-4 minutes
   - Escalation: > 4 minutes
   - Never exceed 5 minutes

3. **Quarterly reviews:**
   - Analyze bottlenecks
   - Plan optimizations
   - Implement improvements before degradation

4. **Instrumentation:**
   - Log detailed timing for all major steps
   - Track per-context times
   - Make data visible to team

---

## Testing Optimizations

```bash
# Baseline timing
time npm run metrics:ci
# Output: "real 3m20s"

# After optimization 1
time npm run metrics:ci
# Output: "real 2m45s"

# Cumulative improvement
# 3m20s → 2m45s = 35s saved (17% improvement)
```

---

## Quick Reference

| Symptom | Cause | Action |
|---------|-------|--------|
| Slow one context | Pagination issue | Check pagination logic |
| All contexts slow | Data volume growth | Reduce query scope |
| No speedup after optimization | Missing pagination | Add pagination |
| File scanning slow | Broad patterns | Optimize regex |
| Parsing slow | Large response | Stream parse |

---

**Created:** 2026-08-21  
**Last Updated:** 2026-08-21  
**Runbook Version:** 1.0  
**Maintainer:** Phase 3 Monitoring Team

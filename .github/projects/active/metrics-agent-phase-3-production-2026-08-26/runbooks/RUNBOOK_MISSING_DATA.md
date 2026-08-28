---
title: "Runbook: Missing Data in Metrics"
description: "Recovery steps for incomplete or missing data in metrics output"
status: "active"
severity: "medium"
created_date: "2026-08-21"
last_updated: "2026-08-21"
---

# Runbook: Missing Data

## Problem Statement

Metrics output is incomplete or missing data from one or more contexts.

**Symptoms:**

- Collection completes but reports "0 files" for a context
- Health score calculations missing components
- Downstream systems report incomplete data
- Specific context data absent from JSON output

**Impact:**

- Inaccurate health scores
- Missing insights for specific areas (e.g., all plugins data missing)
- Team decisions based on incomplete information

---

## Diagnostic Steps

### Step 1: Identify Missing Data

1. Check the metrics output file: `.github/metrics/frontmatter-metrics.json`
2. Compare against expected structure:

   ```json
   {
     "control-plane": { ... },    // Should have issue/PR/file counts
     "plugins": { ... },           // Should have WordPress plugin metrics
     "themes": { ... }             // Should have WordPress theme metrics
   }
   ```

3. Note which context(s) are missing or have `0` values

### Step 2: Check Collection Logs

1. Go to failed/incomplete workflow run
2. Expand "Run metrics" step
3. Look for context-specific log entries:

   ```
   📊 Collecting metrics from control-plane...
   📊 Collecting metrics from plugins...
   📊 Collecting metrics from themes...
   ```

4. Note if specific context logs are missing or show errors

### Step 3: Validate Against Expected Schema

Check `schemas/metrics-output.json` for expected structure:

- All required fields present?
- Numeric fields have appropriate values?
- No null/undefined values in critical fields?

---

## Solutions

### Solution A: API Query Returns Empty

**Diagnosis:** Logs show context collection starting but no data returned

**Recovery Steps:**

1. **Test API query manually:**

   ```bash
   # Get valid token
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        'https://api.github.com/repos/lightspeedwp/.github/issues?state=all&per_page=100'
   
   # Check if results are empty
   # If empty, might be GitHub API permission issue or repo has no issues
   ```

2. **Verify context-specific criteria:**
   - **Control Plane:** Repo should have issues/PRs
   - **Plugins:** Repo should have files matching plugin pattern
   - **Themes:** Repo should have files matching theme pattern

3. **Check file patterns in scripts/metrics/metrics.js:**

   ```javascript
   // Expected patterns for detection
   const pluginPattern = /wp-content\/plugins\//;
   const themePattern = /wp-content\/themes\//;
   
   // If patterns don't match actual repo structure, no data collected
   ```

4. **If patterns wrong, update them:**
   - Review actual file paths in repo
   - Update patterns to match reality
   - Re-run metrics

### Solution B: API Returns Partial Data

**Diagnosis:** Some fields populated, others missing or zero

**Recovery Steps:**

1. **Check pagination:**
   - API responses paginated (default 30 items/page)
   - Large repos may have results split across pages
   - Verify script fetches all pages, not just first

2. **Review API query scope:**

   ```javascript
   // Check if query is too restrictive
   // Example: only querying issues opened in last 30 days
   // May miss important data if repo quiet recently
   ```

3. **Verify response parsing:**
   - Add debug logging to `metrics.js`
   - Log raw API response to verify data is present
   - Check response is properly parsed from JSON

4. **Test with simpler query:**

   ```bash
   # Test basic query first
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        'https://api.github.com/repos/lightspeedwp/.github'
   
   # Should return repo metadata
   # If fails, API access is problem
   # If succeeds, query scope might be too narrow
   ```

### Solution C: Schema Mismatch

**Diagnosis:** Collection completes but output doesn't match expected schema

**Recovery Steps:**

1. **Compare output schema:**

   ```bash
   # Get actual output
   cat .github/metrics/frontmatter-metrics.json | jq 'keys'
   
   # Compare against expected
   cat schemas/metrics-output.json | jq '.properties | keys'
   ```

2. **Check for renamed fields:**
   - If field names changed, update collection script
   - Verify downstream code expects correct field names
   - Update schema if change is intentional

3. **Validate data types:**

   ```bash
   # Check if numeric field has string value
   cat .github/metrics/frontmatter-metrics.json | jq '.control-plane.issues'
   
   # Should be number, not string
   # If string, check collection code parsing
   ```

4. **Update collection logic:**
   - Fix field transformations
   - Ensure proper type conversion
   - Re-run metrics

### Solution D: Recent Integration Change

**Diagnosis:** Data was present last week, now missing after code change

**Recovery Steps:**

1. **Identify recent changes:**

   ```bash
   git log --oneline -20 scripts/metrics/
   
   # Check commits from last week
   ```

2. **Review changed code:**
   - Look at diff of changed metrics.js file
   - Check what fields were added/removed
   - Verify no accidental deletions

3. **Compare with previous version:**

   ```bash
   git show HEAD~1:scripts/metrics/metrics.js | grep -i "control-plane"
   
   # Check if context still referenced
   ```

4. **Revert if necessary:**
   - If recent change broke collection:

   ```bash
   git revert <commit-hash>
   git push origin develop
   ```

5. **Test reverted version:**
   - Run metrics manually
   - Verify data returns

### Solution E: Timeout or Early Exit

**Diagnosis:** Logs show collection for one context, others missing

**Recovery Steps:**

1. **Check for early exit:**
   - Look for `process.exit()` or `return` statements after incomplete context
   - Check error handling doesn't exit too early

2. **Review timeout logic:**
   - Some contexts might have per-context timeout
   - Check if timeout too aggressive
   - Increase timeout for slow contexts

3. **Add error logging:**
   - Add try-catch around each context collection
   - Log any errors that occur
   - Continue collection even if one context fails

4. **Update error handling:**

   ```javascript
   // Collect each context independently
   try {
     const controlPlane = await collectControlPlane();
   } catch (err) {
     console.warn('Failed to collect control-plane:', err.message);
     // Don't exit, continue with other contexts
   }
   
   try {
     const plugins = await collectPlugins();
   } catch (err) {
     console.warn('Failed to collect plugins:', err.message);
   }
   ```

---

## Prevention

1. **Add data validation:**
   - Verify each context returns non-zero counts
   - Alert if any context returns empty

2. **Schema validation:**
   - Validate output against schema before writing
   - Catch missing fields early

3. **Integration testing:**
   - Test metrics collection after any code changes
   - Verify all contexts return data
   - Test with different repo configurations

4. **Monitoring:**
   - Alert on zero-value contexts
   - Track missing data patterns over time

---

## Quick Reference

| Symptom | Cause | Action |
|---------|-------|--------|
| Entire context missing | API returns empty | Check query scope |
| Some fields zero | Partial data returned | Verify pagination |
| Schema mismatch | Output format wrong | Check field names |
| Stopped mid-collection | Early exit | Add error handling |
| Started failing recently | Recent code change | Review changes |

---

**Created:** 2026-08-21  
**Last Updated:** 2026-08-21  
**Runbook Version:** 1.0  
**Maintainer:** Phase 3 Monitoring Team

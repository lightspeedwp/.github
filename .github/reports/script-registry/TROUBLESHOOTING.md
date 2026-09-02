---
title: Script Troubleshooting Guide
date: 2026-08-30
version: 1.0
---

# Automation Script Troubleshooting Guide

Comprehensive guide for diagnosing and resolving common issues with automation scripts.

---

## Quick Reference

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| "GITHUB_TOKEN not set" | Auth environment variable missing | Set `export GITHUB_TOKEN=<token>` |
| "Rate limit exceeded" | Too many API calls | Reduce `--rate-limit`, increase `--batch-size` |
| "Timeout" | Operation taking too long | Increase `--timeout`, reduce `--batch-size` |
| "Syntax error" | Invalid configuration | Check argument format, use `--help` |
| "Permission denied" | Script not executable | Run `chmod +x scripts/automation/*.js` |
| Script hangs | Infinite loop or deadlock | Kill process (Ctrl+C), check logs |
| Memory leak | Script consuming all RAM | Reduce `--limit`, check for circular references |

---

## Issue Categories

- [Authentication Issues](#authentication-issues)
- [Rate Limiting Issues](#rate-limiting-issues)
- [Timeout Issues](#timeout-issues)
- [Memory Issues](#memory-issues)
- [Error Recovery](#error-recovery)
- [Performance Issues](#performance-issues)
- [Data Consistency Issues](#data-consistency-issues)

---

## Authentication Issues

### Error: "GITHUB_TOKEN environment variable not set"

**Symptoms**:
```
Error: GITHUB_TOKEN environment variable not set. Unable to authenticate with GitHub API.
```

**Cause**: The `GITHUB_TOKEN` environment variable is required for all scripts that use the GitHub API.

**Solutions**:

1. **Set token for current session**:
   ```bash
   export GITHUB_TOKEN="ghp_your_token_here"
   node scripts/automation/my-script.js
   ```

2. **Set permanently in shell profile** (`.bashrc`, `.zshrc`, etc.):
   ```bash
   echo 'export GITHUB_TOKEN="ghp_your_token_here"' >> ~/.bashrc
   source ~/.bashrc
   ```

3. **For GitHub Actions workflows**:
   ```yaml
   - name: Run script
     run: node scripts/automation/my-script.js
     env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
   ```

4. **Generate new token** (if expired):
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Click "Generate new token"
   - Select scopes: `repo`, `read:org`, `workflow`
   - Copy and set in environment

### Error: "401 Unauthorized"

**Symptoms**:
```
401 Unauthorized - Invalid credentials
```

**Cause**: GitHub token is invalid, expired, or lacks required permissions.

**Solutions**:

1. **Verify token is valid**:
   ```bash
   curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/user
   ```

2. **Check token permissions**:
   - Required: `repo`, `read:org`
   - Optional: `workflow` (for CI/CD)

3. **Regenerate token** if expired:
   - GitHub tokens expire after one year
   - Generate new token in GitHub settings

4. **Use organization token** for org-wide access:
   - Request org admin to create app token
   - Use with appropriate scopes

### Error: "403 Forbidden"

**Symptoms**:
```
403 Forbidden - Access denied
```

**Cause**: Token lacks required repository access or is rate-limited by organization.

**Solutions**:

1. **Check repository access**:
   ```bash
   curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/lightspeedwp/.github
   ```

2. **Request repository access**:
   - Contact org admin
   - Add user to `.github` repository team

3. **Check for organization restrictions**:
   - Some orgs require approval for third-party access
   - Contact org admin for approval

---

## Rate Limiting Issues

### Error: "API rate limit exceeded"

**Symptoms**:
```
Rate limit exceeded. Retry-After: 3600
```

**Cause**: Script made too many API calls too quickly, hit GitHub's rate limit (60 req/min for unauthenticated, 5000 req/hour for authenticated).

**Solutions**:

1. **Reduce batch size** (fewer API calls per iteration):
   ```bash
   node scripts/automation/handlers-orchestrator.js \
     --batch-size 5 \
     --limit 50  # Reduced batch-size from 10
   ```

2. **Reduce rate limit** (slower execution):
   ```bash
   # Reduced rate-limit from 100
   node scripts/automation/handlers-orchestrator.js \
     --rate-limit 50 \
     --batch-size 10
   ```

3. **Increase delay between batches**:
   ```bash
   # After each batch, wait
   for batch in {1..10}; do
     node scripts/automation/process-batch.js --batch $batch
     sleep 60  # Wait 60 seconds between batches
   done
   ```

4. **Check current rate limit status**:
   ```bash
   curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/rate_limit
   ```

5. **Spread execution over time**:
   ```yaml
   # In GitHub Actions, schedule at off-peak hours
   schedule:
     - cron: "0 2 * * *"  # 2 AM UTC
   ```

### Error: "Secondary rate limit"

**Symptoms**:
```
Secondary rate limit exceeded. Please wait before retrying.
```

**Cause**: Too many API calls in rapid succession, even within rate limit.

**Solutions**:

1. **Increase batch delay**:
   ```javascript
   // Add delay between batches
   for (let i = 0; i < issues.length; i += batchSize) {
     await processBatch(issues.slice(i, i + batchSize));
     await new Promise(r => setTimeout(r, 2000));  // 2 second delay
   }
   ```

2. **Use exponential backoff** (already implemented in handlers-orchestrator):
   ```bash
   --max-retries 5 \
   --retry-delay 1000
   ```

3. **Reduce concurrent operations**:
   ```bash
   --max-concurrent 3  # Process max 3 issues at once
   ```

---

## Timeout Issues

### Error: "Timeout waiting for API response"

**Symptoms**:
```
Error: Timeout after 30000ms
```

**Cause**: API call took longer than configured timeout (default 30 seconds).

**Solutions**:

1. **Increase timeout** (give API more time):
   ```bash
   # 60 seconds (increased from 30)
   node scripts/automation/handlers-orchestrator.js \
     --timeout 60000
   ```

2. **Check GitHub status**:
   - Visit https://www.githubstatus.com/
   - API may be slow or experiencing issues

3. **Retry with backoff** (already enabled):
   ```bash
   # More retry attempts, longer initial delay
   node scripts/automation/handlers-orchestrator.js \
     --max-retries 5 \
     --retry-delay 2000
   ```

4. **Reduce batch size** (fewer parallel operations):
   ```bash
   # Reduce batch-size from 10
   node scripts/automation/handlers-orchestrator.js \
     --batch-size 5 \
     --max-concurrent 3
   ```

5. **Run during off-peak hours**:
   - GitHub API is slower during peak times (9 AM-5 PM PT)
   - Schedule automated runs for early morning or evening

### Script hangs indefinitely

**Symptoms**:
```
Process appears stuck, no output for extended time
```

**Cause**: Deadlock, infinite loop, or waiting for response that never arrives.

**Solutions**:

1. **Kill the process**:
   ```bash
   # Find process ID
   ps aux | grep node
   
   # Kill by PID
   kill -9 <PID>
   
   # Or kill all node processes
   killall node
   ```

2. **Check for infinite loops**:
   ```javascript
   // Ensure all loops have exit conditions
   while (true) {
     if (processedCount >= limit) break;  // Add exit condition
   }
   ```

3. **Add timeout to main script**:
   ```javascript
   setTimeout(() => {
     console.error("Script timeout after 5 minutes");
     process.exit(1);
   }, 5 * 60 * 1000);
   ```

4. **Enable verbose logging** to see where it hangs:
   ```bash
   node scripts/automation/my-script.js --verbose
   ```

---

## Memory Issues

### Error: "JavaScript heap out of memory"

**Symptoms**:
```
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
```

**Cause**: Script is consuming too much memory, likely due to:
- Processing too many issues at once
- Memory leak in handler logic
- Large data structures not being garbage collected

**Solutions**:

1. **Reduce batch size** (process fewer items at once):
   ```bash
   # Reduce from 500 items and batch size from 20
   node scripts/automation/handlers-orchestrator.js \
     --limit 100 \
     --batch-size 5
   ```

2. **Increase Node.js heap size**:
   ```bash
   node --max-old-space-size=4096 \
     scripts/automation/my-script.js
   ```

3. **Enable garbage collection logging**:
   ```bash
   node --trace-gc scripts/automation/my-script.js 2>&1 | tail -20
   ```

4. **Check for memory leaks** in handler code:
   ```javascript
   // ❌ BAD - Accumulating data in memory
   const cache = {};
   handler.on('process', (issue) => {
     cache[issue.number] = issue;  // Never cleared!
   });
   
   // ✅ GOOD - Limited cache with TTL
   class TTLCache {
     constructor(maxAge = 5000) {
       this.cache = new Map();
       this.maxAge = maxAge;
     }
     
     get(key) {
       const item = this.cache.get(key);
       if (!item) return null;
       
       if (Date.now() - item.time > this.maxAge) {
         this.cache.delete(key);
         return null;
       }
       return item.value;
     }
   }
   ```

5. **Monitor memory usage** during execution:
   ```bash
   # In one terminal
   node scripts/automation/my-script.js
   
   # In another terminal, monitor process
   watch -n 1 'ps aux | grep node | grep -v grep'
   ```

---

## Error Recovery

### Retry Logic Not Working

**Symptoms**:
```
Script fails immediately on first error, no retry attempts
```

**Cause**: Retry logic only applies to certain error types (transient errors).

**Solution**:

1. **Check error type**:
   - Retryable: network timeout, rate limit, server error (5xx)
   - Non-retryable: auth (401), not found (404), validation error

2. **Verify retry configuration**:
   ```bash
   node scripts/automation/handlers-orchestrator.js \
     --max-retries 3 \
     --mode auto  # Must be > 0, interactive mode doesn't auto-retry
   ```

3. **Enable verbose logging** to see retry attempts:
   ```bash
   node scripts/automation/handlers-orchestrator.js \
     --mode dry-run \
     --verbose
   ```

### Partial Failures (Some Issues Processed, Some Failed)

**Symptoms**:
```
Summary: 10 processed, 5 updated, 3 errors, 2 skipped
```

**Cause**: Normal behavior when some issues fail but others succeed.

**Solutions**:

1. **Re-run the script** (failed issues will be retried):
   ```bash
   node scripts/automation/handlers-orchestrator.js \
     --mode auto \
     --auto-threshold 85
   ```

2. **Check error logs** to understand failures:
   ```bash
   node scripts/automation/handlers-orchestrator.js \
     --mode auto \
     2>&1 | grep "❌"  # Find errors
   ```

3. **Run in dry-run mode first** to preview:
   ```bash
   node scripts/automation/handlers-orchestrator.js \
     --mode dry-run \
     --limit 20
   ```

### Script Crash on Specific Issue

**Symptoms**:
```
Error processing issue #1234
Script exits with code 1
```

**Cause**: Handler encountering unexpected data or edge case.

**Solutions**:

1. **Test issue in isolation**:
   ```bash
   # If script supports single-issue mode
   node scripts/automation/my-script.js --issue 1234
   ```

2. **Inspect issue data**:
   ```bash
   # Check issue structure
   curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/lightspeedwp/.github/issues/1234
   ```

3. **Add defensive checks**:
   ```javascript
   // Validate data before processing
   if (!issue || !issue.number) {
     return { status: 'skipped', title: 'Invalid issue data' };
   }
   
   // Handle missing fields gracefully
   const labels = issue.labels || [];
   ```

4. **Skip problematic issue** using exclude flag:
   ```bash
   node scripts/automation/handlers-orchestrator.js \
     --exclude-issues "1234,5678"
   ```

---

## Performance Issues

### Script Running Slowly

**Symptoms**:
```
Processing 50 issues takes 5+ minutes
Expected: ~2 minutes
```

**Cause**: Inefficient implementation or rate limiting.

**Solutions**:

1. **Profile the script**:
   ```bash
   time node scripts/automation/my-script.js --limit 50
   
   # Output will show real, user, sys time
   ```

2. **Check baseline expectations**:
   ```bash
   node scripts/automation/profiler.js
   
   # Compare against `.github/reports/profiling/baseline-2026-08-30.json`
   ```

3. **Increase parallelism** if available:
   ```bash
   node scripts/automation/handlers-orchestrator.js \
     --parallel-handlers true \
     --max-concurrent 5  # Enable parallel handler execution
   ```

4. **Reduce API overhead**:
   ```javascript
   // ❌ SLOW - One API call per issue
   for (const issue of issues) {
     const details = await fetchIssueDetails(issue);
   }
   
   // ✅ FAST - Batch fetch
   const allIssues = await fetchAllIssuesAtOnce(issues);
   ```

5. **Enable caching** for expensive operations:
   ```javascript
   // Cache label lookups
   const labelCache = new Map();
   
   function getLabels(issue) {
     if (labelCache.has(issue.number)) {
       return labelCache.get(issue.number);
     }
     
     const labels = issue.labels.map(l => l.name);
     labelCache.set(issue.number, labels);
     return labels;
   }
   ```

### High CPU Usage

**Symptoms**:
```
Process using 100% CPU, machine sluggish
```

**Cause**: Tight loop or inefficient algorithm.

**Solutions**:

1. **Add throttling** between operations:
   ```javascript
   // Process items with delay between them
   for (const item of items) {
     await processItem(item);
     await new Promise(r => setTimeout(r, 100));  // 100ms throttle
   }
   ```

2. **Use batching** instead of individual operations:
   ```javascript
   // ❌ Inefficient - Process one at a time
   for (const issue of issues) {
     await updateIssue(issue);
   }
   
   // ✅ Efficient - Batch updates
   for (let i = 0; i < issues.length; i += 10) {
     await updateBatch(issues.slice(i, i + 10));
   }
   ```

3. **Check for busy-waiting**:
   ```javascript
   // ❌ BAD - Busy loop
   while (!done) {
     // No delay, consumes 100% CPU
   }
   
   // ✅ GOOD - Event-driven or async
   await someAsyncOperation();
   ```

---

## Data Consistency Issues

### Issues Updated Incorrectly

**Symptoms**:
```
Wrong labels applied
Incorrect assignees
Unexpected status changes
```

**Cause**: Logic error in handler or incorrect configuration.

**Solutions**:

1. **Always test in dry-run mode first**:
   ```bash
   node scripts/automation/handlers-orchestrator.js \
     --mode dry-run \
     --limit 20
   ```

2. **Review preview output** before applying:
   ```
   👀 Issue #123 — preview: Add labels [type:bug, priority:high]
   👀 Issue #456 — preview: Assign @username
   ```

3. **Check handler logic**:
   ```javascript
   // Log decision rationale
   console.log(`Analyzing issue #${issue.number}...`);
   console.log(`  Title: ${issue.title}`);
   console.log(`  Labels: ${issue.labels.map(l => l.name).join(', ')}`);
   console.log(`  Decision: ${analysis.decision}`);
   ```

4. **Validate label prefixes**:
   ```bash
   # All labels must be from canonical set
   grep "label:" scripts/automation/handlers/*.js | \
     grep -v "type:" | \
     grep -v "status:" | \
     grep -v "priority:" | \
     grep -v "area:" | \
     grep -v "meta:"
   ```

### Stale Data Issues

**Symptoms**:
```
Script shows different results than GitHub UI
Issue data not matching expected state
```

**Cause**: GitHub API cache or eventual consistency delay.

**Solutions**:

1. **Add delay between operations**:
   ```javascript
   // GitHub has eventual consistency
   await updateIssue(issue);
   await new Promise(r => setTimeout(r, 500));  // Wait for consistency
   const updated = await fetchIssue(issue.number);
   ```

2. **Refresh issue data** before checking:
   ```javascript
   // Don't use stale data from input
   const freshIssue = await fetchIssue(issue.number);
   
   // Use fresh data for decisions
   const analysis = analyzeIssue(freshIssue);
   ```

3. **Check GitHub API rate limit**:
   ```bash
   curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/rate_limit | jq .
   ```

---

## Debug Logging

### Enable Verbose Logging

```bash
# Most scripts support --verbose flag
node scripts/automation/my-script.js --verbose

# For additional debugging, set environment variable
export DEBUG=*
node scripts/automation/my-script.js
```

### Add Debug Output to Script

```javascript
// Add logging helper
function debug(message, data = "") {
  if (process.env.DEBUG) {
    console.log(`[DEBUG] ${message}`, data);
  }
}

// Use in handler
debug("Analyzing issue", `#${issue.number}`);
debug("Analysis result", JSON.stringify(analysis));
debug("Planning changes", changes);
```

### Log to File

```bash
# Redirect output to file
node scripts/automation/my-script.js \
  --mode auto \
  2>&1 | tee ./automation-run-$(date +%Y%m%d-%H%M%S).log

# View log
tail -f ./automation-run-*.log
```

---

## Validation Checklists

### Pre-Execution Checklist

- [ ] `GITHUB_TOKEN` environment variable set
- [ ] Token has required scopes (repo, read:org)
- [ ] Script file is executable: `chmod +x scripts/automation/*.js`
- [ ] Node.js version >= 16: `node --version`
- [ ] Dependencies installed: `npm ci`
- [ ] Syntax valid: `npm run lint:js`

### During Execution

- [ ] Verbose mode enabled if debugging: `--verbose`
- [ ] Dry-run tested first: `--mode dry-run`
- [ ] Reasonable rate limit set: `--rate-limit 100`
- [ ] Batch size appropriate: `--batch-size 10`
- [ ] Timeout sufficient: `--timeout 30000`

### After Execution

- [ ] Check results summary
- [ ] Verify changes in GitHub UI
- [ ] Review error logs
- [ ] Save metrics/reports
- [ ] Clean up temp files

---

## Common Error Messages

### "Cannot find module '@octokit/rest'"

```bash
npm ci  # Install dependencies
```

### "Invalid mode: invalid_mode"

```bash
# Use one of: dry-run, interactive, auto
node scripts/automation/my-script.js --mode dry-run
```

### "EACCES: permission denied"

```bash
# Make script executable
chmod +x scripts/automation/*.js
```

### "No issues to process"

```bash
# Script found no matching issues
# Adjust filter or check if issues exist:
# - Verify labels (use: label:"status:needs-triage")
# - Check open/closed state
# - Try without filters
```

---

## Getting Help

1. **Check this guide** for your specific issue
2. **Review script logs** with `--verbose` flag
3. **Check GitHub status** at https://www.githubstatus.com/
4. **Inspect issue data** via GitHub API
5. **Review related documentation**:
   - `REGISTRY.md` — Script details
   - `USAGE_EXAMPLES.md` — Common patterns
   - `INTEGRATION_GUIDE.md` — Adding scripts

---

## References

- **Related Issues**:
  - #2390: Optimize automation scripts
  - #2391: Orchestrator enhancement
  - #2392: Script registry
  - #2396: Issue Management Agent Audit & Polish

- **External Resources**:
  - GitHub API Docs: https://docs.github.com/rest
  - GitHub Status: https://www.githubstatus.com/
  - Node.js Docs: https://nodejs.org/docs/

---

**Generated By**: Claude Code  
**Date**: 2026-08-30  
**Version**: 1.0

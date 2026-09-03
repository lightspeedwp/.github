---
title: Milestone Automation Edge Case Handling
description: Handling guide for edge cases and unusual scenarios
type: documentation
file_type: documentation
status: approved
version: "1.0.0"
owner: lightspeedwp/maintainers
owners:
  - lightspeedwp/maintainers
tags: []
---

# DOC-004: Edge Case Handling Documentation

**Document:** DOC-004  
**Issue:** [#2564](https://github.com/lightspeedwp/.github/issues/2564)  
**Created:** 2026-09-02  
**Status:** 📋 Edge Case Handling Guide

---

## Overview

This document covers unusual scenarios and edge cases that may occur during milestone distribution. Each case includes detection, handling strategy, and resolution procedures.

---

## Edge Case 1: Zero Unallocated Issues

**Scenario:** Workflow runs but no issues need milestone assignment.

**Root Cause:**
- All issues already have milestones assigned
- Workflow triggered incorrectly
- Filtering logic excludes all issues

**Detection:**
```bash
# Check for issues without milestones
curl -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/lightspeedwp/.github/issues?milestone=none&state=open&per_page=100" \
  | jq length
# Returns: 0
```

**Expected Behavior:**
- Workflow completes successfully
- No issues updated
- Summary shows "0 issues processed"
- This is NOT an error

**Handling Strategy:**
```javascript
// In distribute-unallocated-milestones.js
async function processMilestones(issues, milestone) {
  if (issues.length === 0) {
    console.log('✅ No unallocated issues found. All issues have milestones.');
    return {
      status: 'success',
      processedCount: 0,
      message: 'No action needed'
    };
  }
  
  // Continue normal processing
}
```

**Action Required:**
- ✅ No action required (this is normal operation)
- Log as informational message
- Step Summary should show "0 issues processed" as success

**Testing:**
- [ ] Manually assign milestones to all open issues
- [ ] Trigger workflow
- [ ] Verify workflow completes successfully
- [ ] Verify summary shows 0 processed

---

## Edge Case 2: Large Issue Sets (100+)

**Scenario:** Repository has 100+ unallocated issues at once.

**Root Cause:**
- Mass issue creation or import
- Bulk issue migration
- New repository setup

**Detection:**
```bash
# Check issue count
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/lightspeedwp/.github/issues?milestone=none&state=open" \
  | jq 'length'
# Returns: 100+
```

**Expected Behavior:**
- Workflow may take longer (50ms per issue)
- For 100 issues: ~5-10 seconds
- API calls scale with issue count (~5.5 calls per issue)
- For 100 issues: ~550 API calls (~11% of quota)

**Handling Strategy:**
```javascript
// Implement batching to manage API quota
async function processMilestones(issues, milestone) {
  const batchSize = 25; // Conservative batch size
  const batches = chunkArray(issues, batchSize);
  
  for (const batch of batches) {
    const quotaCheck = await checkRateLimit();
    
    if (quotaCheck.remaining < 500) {
      console.warn('⚠️  Rate limit critical. Processing stopped.');
      console.warn(`Processed: ${batch.index}/${batches.length}`);
      console.warn(`Remaining issues: ${issues.length - batch.index * batchSize}`);
      
      // Gracefully exit for retry
      process.exit(1);
    }
    
    await processBatch(batch);
    
    // Small delay between batches
    await sleep(500);
  }
}
```

**Action Required:**
- ✅ Workflow handles automatically via batching
- Monitor first 2-3 runs to verify performance
- Check API rate limit doesn't exceed 80% usage

**Testing:**
- [ ] Create 100+ test issues without milestones
- [ ] Trigger workflow
- [ ] Monitor duration and API calls
- [ ] Verify all issues assigned
- [ ] Verify no rate limit errors

**Performance Targets:**
- Duration: <30 seconds for 100 issues
- API calls: <600 (120% of base)
- Success rate: 100%

---

## Edge Case 3: ANTHROPIC_API_KEY Unavailable

**Scenario:** Environment variable not set or invalid.

**Root Cause:**
- Secrets not configured in GitHub Actions
- API key expired or revoked
- Token format incorrect

**Detection:**
```bash
# Check for key in workflow logs
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "⚠️  ANTHROPIC_API_KEY not set"
fi

# In script, catch gracefully
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.warn('⚠️  Falling back to local processing (no AI enhancement)');
}
```

**Expected Behavior:**
- Workflow continues with local processing
- No AI-based enhancements available
- This is expected for Phase 2
- Workflow succeeds without this key

**Handling Strategy:**
```javascript
// Graceful fallback in scripts
async function enhanceSummary(issues, apiKey = null) {
  if (!apiKey) {
    // Return basic summary without AI
    return generateLocalSummary(issues);
  }
  
  try {
    // Use API for enhanced summary
    return await callAnthropicAPI(issues, apiKey);
  } catch (error) {
    // Fall back on error
    console.warn('API call failed, falling back to local summary');
    return generateLocalSummary(issues);
  }
}
```

**Action Required:**
- ✅ No action required for Phase 2 (optional feature)
- For Phase 3+: Add ANTHROPIC_API_KEY to GitHub secrets if enhancement is enabled

**Testing:**
- [ ] Do not set ANTHROPIC_API_KEY in test environment
- [ ] Trigger workflow
- [ ] Verify warning logged
- [ ] Verify workflow succeeds
- [ ] Verify summary generated locally

---

## Edge Case 4: Dry-Run Mode Operation

**Scenario:** Workflow runs in dry-run mode (no actual updates).

**Root Cause:**
- Explicitly requested (via environment variable)
- Testing/validation scenario
- Safety feature for new deployments

**Detection:**
```bash
# Check for dry-run flag
if [ "$DRY_RUN" = "true" ]; then
  echo "🔒 Dry-run mode enabled"
fi
```

**Expected Behavior:**
- No issues are actually modified
- API calls are made (rate limit consumed)
- Summary shows what WOULD be updated
- Workflow completes successfully
- Output includes "Dry-run" indicator

**Handling Strategy:**
```javascript
// Implement dry-run mode
const dryRun = process.env.DRY_RUN === 'true';

async function updateIssue(issueNumber, milestone) {
  const updates = {
    milestone: milestone.number
  };
  
  if (dryRun) {
    console.log(`[DRY-RUN] Would update issue #${issueNumber}`);
    console.log(`[DRY-RUN] Milestone: ${milestone.title}`);
    return { dryRun: true, issueNumber, milestone };
  }
  
  // Actual update
  return await github.rest.issues.update({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: issueNumber,
    milestone: milestone.number
  });
}

// Summary shows dry-run indicator
const summary = `
## Milestone Distribution ${dryRun ? '[DRY-RUN]' : ''}
- **Mode:** ${dryRun ? 'Simulation' : 'Production'}
- **Issues Processed:** ${results.length}
- **Would be Updated:** ${dryRun ? results.length : 0}
`;
```

**Action Required:**
- ✅ Test dry-run mode before production runs
- Validate output before enabling auto-run
- Document dry-run procedure in runbook

**Testing:**
- [ ] Set DRY_RUN=true in workflow
- [ ] Trigger workflow
- [ ] Verify no issues were actually updated
- [ ] Verify output shows [DRY-RUN] indicators
- [ ] Verify rate limit was still consumed

**Dry-Run Usage:**
```yaml
# .github/workflows/milestone-distribution.yml
env:
  DRY_RUN: 'true'  # Set to 'false' for production
```

---

## Edge Case 5: Milestone Already Assigned (Idempotency)

**Scenario:** Issue already has target milestone, workflow tries to reassign.

**Root Cause:**
- Workflow runs multiple times
- Concurrent workflow runs
- Previous run didn't complete

**Detection:**
```bash
# Check if issue already has milestone
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/lightspeedwp/.github/issues/123 \
  | jq '.milestone'
# Returns: {number: 5, title: "v1.1", ...}
```

**Expected Behavior:**
- Workflow skips already-assigned issues
- No unnecessary API calls
- Idempotent operation (safe to re-run)
- No errors logged for skipped issues

**Handling Strategy:**
```javascript
async function processBatch(issues, targetMilestone) {
  const toUpdate = issues.filter(issue => {
    // Skip if already has a milestone
    if (issue.milestone) {
      console.log(`ℹ️  Issue #${issue.number} already has milestone: ${issue.milestone.title}`);
      return false;
    }
    return true;
  });
  
  if (toUpdate.length === 0) {
    console.log('✅ All issues already have milestones');
    return { skipped: issues.length, updated: 0 };
  }
  
  // Update only those that need it
  return await updateIssues(toUpdate, targetMilestone);
}
```

**Action Required:**
- ✅ Workflow handles automatically via filtering
- Workflow is safely idempotent
- Can be run multiple times without issues

**Testing:**
- [ ] Assign milestone to first 50 issues manually
- [ ] Trigger workflow with all 100 issues
- [ ] Verify only remaining 50 issues updated
- [ ] Verify summary shows skipped count

---

## Edge Case 6: Workflow Timeout (Long Processing)

**Scenario:** Workflow exceeds timeout while processing large set.

**Root Cause:**
- Too many issues (200+)
- API calls very slow
- Network latency
- GitHub API degradation

**Detection:**
```bash
# Check workflow timeout
# Look in logs for: "Error: Timeout in job after X minutes"

# Estimate processing time
ISSUE_COUNT=150
TIME_PER_ISSUE_MS=50
ESTIMATED_MS=$((ISSUE_COUNT * TIME_PER_ISSUE_MS))
ESTIMATED_SECS=$((ESTIMATED_MS / 1000))
echo "Estimated time: ${ESTIMATED_SECS}s"
```

**Expected Behavior:**
- Workflow fails with timeout message
- **IMPORTANT:** Partial updates ARE possible (NO transaction rollback)
- Some issues may be updated before timeout occurs
- Remaining issues will not be updated
- Failure issue created per MON-001
- Safe to retry (idempotent - already-updated issues skipped)

**Transaction Semantics:**
This workflow processes issues **sequentially without transaction support**. If a timeout occurs mid-execution:
1. Issues already updated remain updated (committed)
2. Issues not yet processed need to be retried
3. No atomicity guarantee (either all-or-nothing)
4. Recovery requires tracking which issues were completed

**Handling Strategy:**
```javascript
// Implement timeout awareness WITH PROGRESS TRACKING
// Since there's no rollback, we must track what was completed
const maxDuration = 25 * 60 * 1000; // 25 min (5 min safety margin)
const startTime = Date.now();

async function processBatch(batch) {
  const elapsed = Date.now() - startTime;
  const remaining = maxDuration - elapsed;
  
  // Estimate time for this batch
  const estimatedTime = batch.length * 50; // 50ms per issue
  
  if (estimatedTime > remaining) {
    console.warn(`⚠️  Insufficient time remaining`);
    console.warn(`Elapsed: ${(elapsed / 1000).toFixed(1)}s`);
    console.warn(`Estimated needed: ${(estimatedTime / 1000).toFixed(1)}s`);
    console.warn(`Stopping gracefully for retry`);
    
    // Stop and let auto-retry handle remainder
    process.exit(1);
  }
  
  return await updateBatch(batch);
}
```

**Action Required:**
- ✅ Increase workflow timeout if needed (default: 30 min)
- Implement timeout awareness in script with progress tracking
- Save progress to `timeout-recovery.json` before exit
- Document expected duration per issue count (50ms/issue)
- Configure scheduled retry for pending issues

**Implementation Notes:**
- Script MUST track completed issues separately from pending
- Recovery file must be written BEFORE process.exit()
- Next run should skip already-processed issues (check milestone assignment)
- Alert should include count of partial updates vs pending

**Testing:**
- [ ] Create 200+ test issues
- [ ] Set workflow timeout to 5 minutes (force short timeout)
- [ ] Trigger workflow and monitor logs
- [ ] Verify partial updates occur as expected
- [ ] Check that some issues updated and some pending
- [ ] Verify recovery file written correctly
- [ ] Trigger workflow again and verify pending issues completed
- [ ] Confirm no duplicate updates (idempotency works)

**Timeout Configuration:**
```yaml
# .github/workflows/milestone-distribution.yml
jobs:
  distribute:
    timeout-minutes: 30  # Adjust based on expected issue count
    # Expected: 50ms/issue, so 30 min = 36,000 issues (very safe)
    # 5 min safety margin recommended for large batches
```

**Expected Performance:**
- Single issue: ~50ms
- 10 issues: ~500ms
- 100 issues: ~5-10s
- 500 issues: ~25-50s
- 1000 issues: ~50-100s (requires ~5-10 minute timeout)

---

## Edge Case 7: Duplicate Issue References

**Scenario:** Multiple PRs or issues reference same target milestone.

**Root Cause:**
- Concurrent workflow runs
- Multiple events triggering workflow
- Issue linked in multiple contexts

**Detection:**
```bash
# Check for duplicate issue updates in logs
grep -c "Updating issue #123" workflow-logs.txt
# If count > 1: duplicate detected
```

**Expected Behavior:**
- Last update wins (timestamp-based)
- No error, just informational
- API call succeeds
- Summary shows final state

**Handling Strategy:**
```javascript
// Track what was updated
const updated = new Map();

async function updateIssue(issue, milestone) {
  if (updated.has(issue.number)) {
    console.log(`ℹ️  Issue #${issue.number} already updated in this run`);
    return updated.get(issue.number);
  }
  
  const result = await github.rest.issues.update({...});
  updated.set(issue.number, result);
  return result;
}
```

**Action Required:**
- ✅ Workflow handles via tracking
- Final state is correct (idempotent)

---

## Edge Case 8: Partial Updates After Timeout

**Scenario:** Workflow times out mid-execution after updating some issues.

**Root Cause:**
- Processing 200+ issues hits 30-minute limit
- Network latency delays API calls
- Batch size too large for available time

**Detection:**
```bash
# Check workflow duration and completion
curl -s https://api.github.com/repos/lightspeedwp/.github/actions/runs/{RUN_ID} \
  | jq '{status, conclusion, run_number, created_at, updated_at}'

# Verify which issues were updated
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/lightspeedwp/.github/issues?milestone=v1.1&state=open" \
  | jq '.[] | {number, milestone}'
```

**Expected Behavior:**
- Some issues already updated (cannot rollback)
- Remaining unupdated issues need retry
- Summary indicates partial completion
- Failure status on the workflow run
- Alert created per MON-001

**Handling Strategy:**
```javascript
// Track progress separately for recovery
const completedIssues = [];
const failedIssues = [];
const pendingIssues = [];
const startTime = Date.now();
const maxDuration = 25 * 60 * 1000; // 25 min (5 min buffer)

async function processWithTimeoutTracking(allIssues, targetMilestone) {
  for (const issue of allIssues) {
    const elapsed = Date.now() - startTime;
    
    // Check if timeout imminent
    if (elapsed > maxDuration) {
      console.warn(`⏱️  Timeout threshold reached`);
      console.warn(`Processed: ${completedIssues.length} successful`);
      console.warn(`Pending: ${allIssues.length - completedIssues.length - failedIssues.length}`);
      
      // Save progress for retry
      fs.writeFileSync('timeout-recovery.json', JSON.stringify({
        completedIssues,
        failedIssues,
        pendingIssues: allIssues.slice(completedIssues.length + failedIssues.length),
        timestamp: new Date().toISOString()
      }), 'utf8');
      
      process.exit(1); // Fail so workflow retries
    }
    
    try {
      await updateIssue(issue, targetMilestone);
      completedIssues.push(issue.number);
    } catch (error) {
      if (error.status >= 500) {
        // Likely transient - mark for retry
        pendingIssues.push(issue.number);
      } else {
        failedIssues.push({ number: issue.number, error: error.message });
      }
    }
  }
}
```

**Action Required:**
- Create recovery workflow to process pending issues
- Document partial completion in alert
- Save recovery metadata for next run
- Do not delete completed assignments

**Testing:**
- [ ] Create 150+ test issues
- [ ] Set timeout to 5 minutes
- [ ] Monitor for partial updates
- [ ] Verify recovery mechanism works

**Recovery Procedure:**
1. Monitor workflow logs for timeout message
2. Check alert issue created by MON-001
3. Review `timeout-recovery.json` for pending count
4. Wait for auto-retry (scheduled workflow)
5. If manual retry needed: trigger workflow again with --limit flag

---

## Edge Case 9: Missing Milestone Permissions

**Scenario:** Workflow lacks permission to create or update specific milestone.

**Root Cause:**
- Repository permission not granted to token
- Milestone access restricted to admins
- Organization-level permission denied

**Detection:**
```bash
# Check token permissions
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user/repos \
  | jq '.[] | select(.name == ".github") | {admin, push, pull, permissions}'

# Check milestone access
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/lightspeedwp/.github/milestones \
  | jq '.[] | {title, state}'
```

**Expected Behavior:**
- Workflow fails with 403 Forbidden
- Error message: "Resource not accessible by integration"
- Alert created per MON-001
- No issues updated (transaction safety)

**Handling Strategy:**
```javascript
// Pre-flight permission check
async function validatePermissions(targetMilestone) {
  // Check if we can update issues
  const testIssue = await github.rest.issues.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: 1 // Use first issue as test
  });
  
  if (!testIssue.data) {
    throw new Error('Cannot read issues - permission denied');
  }
  
  // Verify milestone exists and is accessible
  const milestone = await github.rest.issues.getMilestone({
    owner: context.repo.owner,
    repo: context.repo.repo,
    milestone_number: targetMilestone.number
  });
  
  if (!milestone.data) {
    throw new Error(`Cannot access milestone ${targetMilestone.title}`);
  }
  
  return true;
}
```

**Action Required:**
- Run permission check before processing
- Contact repository admin if permission denied
- Regenerate token with correct scopes
- Verify token not expired

**Testing:**
- [ ] Use token with read-only access
- [ ] Trigger workflow and verify permission error
- [ ] Verify alert created
- [ ] Regenerate token and retry

---

## Edge Case 10: Concurrent Milestone Changes

**Scenario:** Milestone is renamed or deleted while workflow is running.

**Root Cause:**
- Admin changes milestone during execution
- Cleanup workflow deletes old milestone
- Manual UI change during distribution

**Detection:**
```bash
# Monitor milestone changes in real-time
while true; do
  curl -s -H "Authorization: token $GITHUB_TOKEN" \
    https://api.github.com/repos/lightspeedwp/.github/milestones/{MILESTONE_ID} \
    | jq '.title, .state'
  sleep 5
done
```

**Expected Behavior:**
- Workflow continues (idempotent)
- Issues get old milestone if unchanged
- Issues skip if milestone no longer exists
- Warning logged for deleted milestone

**Handling Strategy:**
```javascript
// Cache milestone data at start
const milestoneCache = new Map();

async function updateIssueWithMilestoneCheck(issue, targetMilestone) {
  // Use cached milestone ID if available
  let milestone = milestoneCache.get(targetMilestone.number);
  
  if (!milestone) {
    // Fetch fresh (in case it changed)
    try {
      const response = await github.rest.issues.getMilestone({
        owner: context.repo.owner,
        repo: context.repo.repo,
        milestone_number: targetMilestone.number
      });
      milestone = response.data;
      milestoneCache.set(targetMilestone.number, milestone);
    } catch (error) {
      if (error.status === 404) {
        console.warn(`⚠️  Milestone #${targetMilestone.number} no longer exists`);
        console.warn(`Issue #${issue.number} will not be updated`);
        return null;
      }
      throw error;
    }
  }
  
  // Update using cached/fetched milestone
  return await github.rest.issues.update({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: issue.number,
    milestone: milestone.number
  });
}
```

**Action Required:**
- Cache milestone data at workflow start
- Validate milestone exists before each batch
- Log warnings for deleted milestones
- Continue with other issues

**Testing:**
- [ ] Start workflow with large batch
- [ ] Delete milestone mid-execution
- [ ] Verify workflow continues
- [ ] Verify issues already updated retain milestone
- [ ] Verify remaining issues skip gracefully

---

## Edge Case 11: API Response Timeout (Partial JSON)

**Scenario:** GitHub API returns partial response or times out during read.

**Root Cause:**
- Network timeout before full response received
- GitHub API server overload
- Connection reset mid-stream

**Detection:**
```bash
# Monitor response times
time curl -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/lightspeedwp/.github/issues?per_page=100"

# Log any truncated responses
curl -v ... | grep -E "Content-Length|Transfer-Encoding"
```

**Expected Behavior:**
- Request fails with ECONNRESET or timeout
- Octokit retry mechanism kicks in (up to 3x)
- If all retries fail: workflow exits with error
- Alert created per MON-001

**Handling Strategy:**
```javascript
// Implement timeout and retry wrapper
async function fetchWithRetry(
  fetchFn,
  maxRetries = 3,
  timeoutMs = 30000
) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Wrap with timeout
      const controller = new AbortController();
      const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);
      
      const result = await Promise.race([
        fetchFn(),
        new Promise((_, reject) =>
          controller.signal.addEventListener('abort', () =>
            reject(new Error(`Timeout after ${timeoutMs}ms`))
          )
        )
      ]);
      
      clearTimeout(timeoutHandle);
      return result;
    } catch (error) {
      clearTimeout(timeoutHandle);
      
      if (attempt === maxRetries - 1) throw error;
      
      const backoffMs = Math.pow(2, attempt) * 1000;
      console.warn(`Attempt ${attempt + 1} failed, retrying in ${backoffMs}ms`);
      await new Promise(resolve => setTimeout(resolve, backoffMs));
    }
  }
}

// Usage
const issues = await fetchWithRetry(() =>
  github.rest.issues.listForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
    milestone: 'none',
    state: 'open'
  })
);
```

**Action Required:**
- Implement timeout wrapper for critical API calls
- Log all timeout occurrences
- Monitor GitHub status page for outages
- Alert on repeated timeouts (threshold: 3+)

**Testing:**
- [ ] Simulate network timeout with proxy
- [ ] Verify retry mechanism works
- [ ] Verify alert created after max retries

---

## Edge Case 12: Invalid Milestone State Transitions

**Scenario:** Attempt to assign closed or non-existent milestone.

**Root Cause:**
- Milestone closed before workflow execution
- Wrong milestone number in configuration
- Milestone deleted between workflow start and assignment

**Detection:**
```bash
# List all milestone states
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/lightspeedwp/.github/milestones?state=all \
  | jq '.[] | {number, title, state, open_issues}'
```

**Expected Behavior:**
- Fail fast with clear error
- Alert identifies invalid milestone
- No issues updated (transaction safety)
- Actionable message: "Milestone v2.5 is closed"

**Handling Strategy:**
```javascript
// Validate milestone state before processing
async function validateMilestoneForDistribution(milestone) {
  const milestoneData = await github.rest.issues.getMilestone({
    owner: context.repo.owner,
    repo: context.repo.repo,
    milestone_number: milestone.number
  });
  
  if (milestoneData.data.state !== 'open') {
    throw new Error(
      `Milestone "${milestoneData.data.title}" is ${milestoneData.data.state}. ` +
      `Open milestones only. Reopen in Issues > Milestones.`
    );
  }
  
  if (milestoneData.data.open_issues === 0 && milestoneData.data.closed_issues === 0) {
    console.warn(`⚠️  Milestone "${milestoneData.data.title}" has no issues`);
  }
  
  return milestoneData.data;
}

// Call before any updates
const validatedMilestone = await validateMilestoneForDistribution(targetMilestone);
```

**Action Required:**
- Validate milestone state at workflow start
- Provide clear error message and fix instructions
- Alert admin to investigate
- Do not proceed with distribution

**Testing:**
- [ ] Close target milestone
- [ ] Trigger workflow
- [ ] Verify error message
- [ ] Verify alert created
- [ ] Reopen milestone and retry

---

---

## Recovery Procedures

### For Each Edge Case

1. **Detection** — How to identify the issue occurred
2. **Diagnosis** — Root cause analysis
3. **Action** — Immediate resolution steps
4. **Prevention** — Long-term improvements

### Common Recovery Steps

```bash
# 1. Check workflow logs
https://github.com/lightspeedwp/.github/actions

# 2. Verify repository state
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/lightspeedwp/.github/milestones?state=all

# 3. Check rate limit status
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/rate_limit | jq '.resources.core'

# 4. Manually trigger retry if needed
gh workflow run milestone-distribution.yml -r develop
```

---

## Testing Checklist

- [ ] TEST-001: Zero unallocated issues
- [ ] TEST-002: Large issue sets (100+) — COMPLETE
- [ ] TEST-003: ANTHROPIC_API_KEY unavailable
- [ ] TEST-004: Dry-run mode operation
- [ ] Idempotency test (same workflow, twice)
- [ ] Timeout test (200+ issues)
- [ ] Concurrent run test (multiple triggers)
- [ ] Recovery procedure validation

---

## Related Documents

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — Common failures and solutions
- [MON-001-WORKFLOW-ALERTS.md](./MON-001-WORKFLOW-ALERTS.md) — Failure detection
- [MON-002-RATE-LIMIT-MONITORING.md](./MON-002-RATE-LIMIT-MONITORING.md) — Rate limit handling
- [RUNBOOK.md](./RUNBOOK.md) — Operational procedures

---

**Document Owner:** lightspeedwp/maintainers  
**Created:** 2026-09-02  
**Status:** 📋 Complete  
**Relates to:** [DOC-004 Issue #2564](https://github.com/lightspeedwp/.github/issues/2564)

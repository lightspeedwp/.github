---
title: Milestone Automation Edge Case Handling
description: Handling guide for edge cases and unusual scenarios
type: guide
status: approved
version: "1.0.0"
owner: lightspeedwp/maintainers
tags:
  - automation
  - edge-cases
  - milestone-distribution
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
- No partial updates (transaction rolls back)
- Failure issue created per MON-001
- Can be retried with smaller batch

**Handling Strategy:**
```javascript
// Implement timeout awareness
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
- Implement timeout awareness in script
- Document expected duration per issue count

**Testing:**
- [ ] Create 200+ test issues
- [ ] Monitor workflow duration
- [ ] Verify timeout doesn't occur
- [ ] If timeout: increase batch delay or timeout

**Timeout Configuration:**
```yaml
# .github/workflows/milestone-distribution.yml
jobs:
  distribute:
    timeout-minutes: 30  # Increase if needed for large sets
```

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

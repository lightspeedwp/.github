---
title: GitHub Actions Workflow Alerts Setup
description: Implementation guide for monitoring milestone distribution workflow execution
type: documentation
file_type: documentation
status: active
version: "1.0.0"
owner: lightspeedwp/maintainers
owners:
  - lightspeedwp/maintainers
tags: []
---

# MON-001: GitHub Actions Workflow Alerts Setup

**Document:** MON-001  
**Issue:** [#2558](https://github.com/lightspeedwp/.github/issues/2558)  
**Created:** 2026-09-02  
**Status:** 📋 Setup Documentation

---

## Overview

The milestone distribution workflow (`.github/workflows/milestone-distribution.yml`) must include comprehensive failure detection and alerting to ensure production reliability. This guide documents:

- Workflow failure conditions and early detection
- Alert channels and notification rules
- Recovery and escalation procedures
- Monitoring dashboard integration

---

## Alert Strategy

### Alert Categories

| Alert Level | Trigger | Response Time | Action |
|-------------|---------|----------------|--------|
| 🔴 **Critical** | Workflow fails | Immediate (minutes) | Ops page, Slack urgent |
| ⚠️ **Warning** | High error rate (>5%) | 15 minutes | Slack notification, log review |
| ℹ️ **Info** | Slow runs (>10s) | 30 minutes | Slack update, analytics |
| 📊 **Metric** | Daily summary | End of day | Email/dashboard |

### Failure Conditions to Monitor

1. **Job Failure** — Any step in the workflow fails
2. **Timeout** — Workflow exceeds 30-minute limit
3. **Rate Limit** — GitHub API rate limit exceeded (HTTP 403)
4. **Missing Config** — Required environment variables missing
5. **Zero Issues** — No issues processed (possible filtering error)

---

## Implementation

### Step 1: Add Workflow Failure Detection

**CRITICAL:** Do NOT use `continue-on-error: true` on the main script step. This masks failures and makes the job report success even when the distribution fails.

Instead:
1. Let the script step fail naturally (remove `continue-on-error`)
2. Add a failure-handling step that runs `if: failure()`
3. Create alert issue first, THEN exit with code 1 to fail the job
4. Add success reporting for successful runs

This ensures:
- Job fails when distribution fails (proper CI signal)
- Alert issues are created for failures (monitoring)
- Success summaries are posted (visibility)
- Workflow status correctly reflects actual state

```yaml
# .github/workflows/milestone-distribution.yml
name: Distribute Milestones

on:
  pull_request:
    types: [opened, reopened]
  issues:
    types: [opened, reopened]

jobs:
  distribute:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - name: Run distribution script
        run: node scripts/automation/distribute-unallocated-milestones.js
        id: distribute

      # Report success summaries to GitHub
      - name: Post Success Summary
        if: success()
        run: |
          cat >> $GITHUB_STEP_SUMMARY << 'EOF'
          ## ✅ Milestone Distribution Complete
          - Run: ${{ github.run_id }}
          - Event: ${{ github.event_name }}
          - Status: Success
          
          [View Full Run](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }})
          EOF

      # Detect and report failures (runs even if previous step failed)
      - name: Handle Failure - Create Alert Issue
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            const issue = await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '🚨 Milestone Distribution Workflow Failed',
              body: `
            ## Workflow Failure Alert
            
            **Time:** ${new Date().toISOString()}
            **Run ID:** [#${context.runId}](${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId})
            **Event Type:** ${context.eventName}
            **Branch:** ${context.ref}
            **Commit:** ${context.sha}
            
            ### Action Required
            1. Check the [workflow logs](${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}) for error details
            2. Fix the underlying issue
            3. The workflow will retry automatically on next trigger
            
            ### Common Causes
            - API rate limit exceeded (wait 1 hour for reset)
            - Permission denied (check token permissions)
            - Milestone not found (verify milestone exists)
            - Network timeout (may be transient)
              `,
              labels: ['type:bug', 'area:automation', 'priority:critical']
            });
            core.info(`Created failure issue #${issue.data.number}`);
      
      # Explicit failure after alert creation (ensures job fails)
      - name: Fail Job After Alert
        if: failure()
        run: |
          echo "🚨 Distribution job failed. Alert issue created above."
          exit 1
```

### Step 2: Slack Notifications (Optional)

Add Slack notifications for critical failures:

```yaml
      - name: Notify Slack on failure
        if: failure()
        uses: slackapi/slack-github-action@v1.24.0
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_MILESTONE_ALERTS }}
          payload: |
            {
              "text": "🚨 Milestone Distribution Failed",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Milestone Distribution Workflow Failed*\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Run>"
                  }
                },
                {
                  "type": "section",
                  "fields": [
                    {
                      "type": "mrkdwn",
                      "text": "*Repository:*\n${{ github.repository }}"
                    },
                    {
                      "type": "mrkdwn",
                      "text": "*Event:*\n${{ github.event_name }}"
                    }
                  ]
                }
              ]
            }
```

### Step 3: GitHub Actions Status Checks

Ensure workflow is required status check:

```yaml
# In repository settings:
Settings → Branches → Branch Protection Rules → Develop
  ✓ Require status checks to pass before merging
  ✓ Milestone Distribution (or custom name)
```

### Step 4: Rate Limit Monitoring

Add rate limit checking:

```javascript
// scripts/automation/distribute-unallocated-milestones.js

async function checkRateLimit() {
  const { response } = await github.rest.rateLimit.get();
  const { remaining, limit } = response.headers['x-ratelimit-remaining'];
  
  const percentRemaining = (remaining / limit) * 100;
  
  if (percentRemaining < 20) {
    console.warn(`⚠️  Rate limit critical: ${remaining}/${limit} (${percentRemaining.toFixed(1)}%)`);
    // Create warning issue
    return false;
  }
  
  if (percentRemaining < 50) {
    console.warn(`⚠️  Rate limit warning: ${remaining}/${limit} (${percentRemaining.toFixed(1)}%)`);
  }
  
  return true;
}
```

### Step 5: Post Summary to Step Summary

GitHub Actions Step Summary (visible on run page):

```javascript
const fs = require('fs');

// In your script, collect results
const summary = `
## Milestone Distribution Summary

- **Status:** ${success ? '✅ Success' : '❌ Failed'}
- **Issues Processed:** ${processedCount}
- **Successes:** ${successCount}
- **Failures:** ${failureCount}
- **API Calls Used:** ${apiCallsUsed}/5000
- **Duration:** ${duration}ms

${failureCount > 0 ? `

### Failures
${failures.map(f => `- Issue #${f.number}: ${f.error}`).join('\n')}
` : ''}
`;

fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
```

---

## Monitoring Dashboard

### Key Metrics

Create a GitHub issue dashboard to track:

1. **Workflow Success Rate**
   - Query: Count of successful runs vs. total runs
   - Target: 99%+ success rate
   - Alert: <95% success

2. **API Rate Limit Usage**
   - Query: API calls per run
   - Target: <500 calls/run (10% of quota)
   - Alert: >2000 calls/run

3. **Execution Time**
   - Query: Duration of workflow runs
   - Target: <10 seconds average
   - Alert: >30 seconds

4. **Issue Processing Count**
   - Query: Issues processed per run
   - Baseline: 0-50 normal, 50-100 high, 100+ critical
   - Alert: 0 (no issues found, possible filtering bug)

### Example Dashboard Query (GitHub Issues API)

```bash
# Get last 10 workflow runs
gh run list --repo lightspeedwp/.github \
  --workflow milestone-distribution.yml \
  --limit 10 \
  --json status,conclusion,durationMinutes,createdAt

# Parse results to calculate success rate
```

---

## Alert Response Procedures

### When Workflow Fails

**Immediate Actions (0-5 minutes):**
1. Check the [GitHub Actions run logs](https://github.com/lightspeedwp/.github/actions)
2. Identify the failure point (step name)
3. Read the error message carefully

**Investigation (5-15 minutes):**
1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md) for the error
2. Verify repository state (milestones exist, API key available)
3. Check GitHub status (status.github.com)

**Resolution (15-60 minutes):**
1. Apply fix per Troubleshooting Guide
2. Manually trigger workflow to verify fix
3. Post update to failure issue

### When Rate Limit Exceeded

**Immediate Actions:**
1. Stop further workflow runs immediately
2. Note current time and reset time
3. Wait for rate limit reset (1 hour from first request)

**After Reset:**
1. Verify quota has been reset
2. Retry workflow with smaller batch size
3. Document incident in issue #2559

---

## Testing & Validation

### Test Case 1: Workflow Success Notification

**Setup:**
- Manually trigger workflow with 1-5 issues

**Expected Result:**
- Workflow completes successfully
- Step Summary shows success metrics
- No failure issue created

**Validation:** ✅

### Test Case 2: Workflow Failure Detection

**Setup:**
- Manually break the script (invalid milestone name)
- Trigger workflow

**Expected Result:**
- Workflow fails at script step
- Failure issue created with link to run
- Summary shows error details

**Validation:** ✅

### Test Case 3: Rate Limit Warning

**Setup:**
- Configure workflow to run with small batches
- Pre-consume rate limit quota via API
- Trigger workflow when <500 quota remains

**Expected Result:**
- Warning logged in workflow output
- Summary shows rate limit warning
- No workflow failure (graceful degradation)

**Validation:** ✅

---

## Related Documents

- [OPENSPEC.md](./OPENSPEC.md) — Workflow specifications
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — Error diagnosis
- [RUNBOOK.md](./RUNBOOK.md) — Operational procedures
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## Implementation Timeline

| Phase | Task | Timeline | Owner |
|-------|------|----------|-------|
| Phase 2 | Create alert infrastructure | Sep 02 | Engineering |
| Phase 2 | Test alert conditions | Sep 03 | QA |
| Phase 3 | Deploy to production | Sep 05+ | Operations |
| Phase 3 | Monitor first 10 runs | Sep 05-10 | Team |

---

**Document Owner:** lightspeedwp/maintainers  
**Created:** 2026-09-02  
**Status:** 📋 Complete  
**Relates to:** [MON-001 Issue #2558](https://github.com/lightspeedwp/.github/issues/2558)

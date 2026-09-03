---
title: Slack Notification System Design
description: Design specification for Phase 3 Slack integration
type: documentation
file_type: documentation
status: proposed
version: "1.0.0"
owner: lightspeedwp/maintainers
owners:
  - lightspeedwp/maintainers
tags: []
---

# ENH-002: Slack Notification System Design

**Issue:** [#2571](https://github.com/lightspeedwp/.github/issues/2571)  
**Created:** 2026-09-02  
**Status:** 📋 Design Phase

---

## Overview

A Slack integration to notify the team of milestone distribution workflow execution, results, and anomalies.

**Scope:** Phase 3+ (Design in Phase 2)

**Objectives:**
- Real-time workflow notifications
- Result summaries in team chat
- Alert on failures/issues
- Reduce need to check GitHub directly
- Team visibility and engagement

---

## Notification Types

### 1. Workflow Started (Optional)

**When:** Workflow execution begins

**Channel:** #milestone-automation (dedicated)

**Format:**
```
🚀 Milestone Distribution Started
Repository: lightspeedwp/.github
Branch: develop
Trigger: scheduled
Run ID: #33650372958
Expected Duration: 5-10 seconds
```

**Frequency:** Every run (or only manual triggers)

**Audience:** Core team

**Actionability:** Info only; no action needed

---

### 2. Workflow Completed (Success)

**When:** Workflow finishes successfully

**Channel:** #milestone-automation

**Format:**
```
✅ Milestone Distribution Complete

📊 Summary
• Issues Processed: 8
• Successfully Assigned: 8
• Failed: 0
• Duration: 3.2s

🎯 Assignments
• v1.1: 6 issues
• v2.0: 2 issues

🔌 API Usage
• Calls Made: 45/5000 (0.9%)
• Status: ✅ Safe

👉 [View Full Run →](https://github.com/lightspeedwp/.github/actions/runs/33650372958)
```

**Frequency:** Every run

**Audience:** Core team + interested stakeholders

**Actionability:** Can review details if needed

**Advanced:** Include user reactions (🎉 🙌 👍) for quick engagement

---

### 3. Workflow Failed (Alert)

**When:** Workflow fails

**Channel:** #alerts or #milestone-automation (depending on severity)

**Format:**
```
🚨 Milestone Distribution FAILED

⚠️ Error Details
• Job: distribute
• Step: Run distribution script
• Error: API rate limit exceeded
• Message: 403 Forbidden

📊 Context
• Issues Being Processed: 42
• API Calls Used: 4,998/5000
• Run Duration: 2m 34s

🔧 Action Required
1. Wait for rate limit reset (in ~45 minutes)
2. Review distribution script for optimization
3. Re-run workflow manually

👉 [View Logs →](https://github.com/lightspeedwp/.github/actions/runs/33650372959)
```

**Frequency:** Only on failures

**Audience:** Core team + platform ops

**Actionability:** Clear remediation steps

**Tagging:** Mention @milestone-automation-oncall if escalation needed

---

### 4. Rate Limit Warning

**When:** API quota approaches critical threshold (<500 remaining)

**Channel:** #alerts

**Format:**
```
⚠️ Rate Limit Warning

🔴 Critical Status: API quota running low

• Remaining: 487/5000 (9.7%)
• Reset In: 45 minutes
• Recent Usage: 4,513 calls
• Trend: ↑ Increasing

💡 Recommendation
Consider reducing batch size or staggering workflow runs.

Last Run Impact: 45 calls (0.9% of quota)
```

**Frequency:** Once per threshold breach

**Audience:** Core team + platform team

**Actionability:** Can adjust workflow parameters proactively

---

### 5. Workflow Anomalies (Informational)

**When:** Unusual patterns detected

**Channel:** #milestone-automation

**Examples:**
- Zero issues processed (no work needed)
- Much longer than normal (10x duration)
- All issues failed
- API key missing (fallback activated)

**Format:**
```
ℹ️ Unusual Workflow Pattern Detected

📌 No Unallocated Issues Found
All open issues already have milestones assigned.
This is normal; workflow completed successfully.

• Issues Scanned: 45
• Issues Unallocated: 0
• Duration: 245ms
• Status: ✅ Success
```

**Frequency:** Only when pattern detected

**Audience:** Core team

**Actionability:** Informational; no action needed usually

---

### 6. Manual Trigger Confirmation

**When:** Manual workflow trigger via GitHub

**Channel:** #milestone-automation or thread

**Format:**
```
👤 Manual Workflow Triggered

Triggered By: @ashley
Run Mode: Production
Expected Issues: ~15
Milestone: v1.1

👉 [Watch Run →](https://github.com/lightspeedwp/.github/actions/runs/33650372960)
```

**Frequency:** Only for manual triggers

**Audience:** Whoever triggered + team lead

**Actionability:** Allow watchers to observe progress

---

### 7. Daily Summary (Optional)

**When:** End of day (6pm UTC)

**Channel:** #milestone-automation

**Format:**
```
📈 Daily Milestone Distribution Summary

• Total Runs: 4
• Success Rate: 100% ✅
• Issues Processed: 156
• Total Duration: 12.8s
• API Usage: 5.2% of quota

Top Milestone: v1.1 (98 issues)
Peak Run: 52 issues in 3.2s

📊 [View Dashboard →](https://lightspeedwp.github.io/.github/dashboard)
```

**Frequency:** Daily (optional feature)

**Audience:** Team leads + reporting

**Actionability:** Used for status reports and reviews

---

## Implementation Approaches

### Option A: Slack Webhook (Simple)

**Cost:** Free

**Setup:**
1. Create incoming webhook in Slack workspace
2. Add webhook URL to GitHub Actions secrets
3. Send POST requests to webhook

**Pros:**
- Simple, minimal setup
- No rate limits
- Native GitHub Actions integration

**Cons:**
- No interactive features
- Limited to basic messages
- Single-channel delivery

**Example:**
```bash
curl -X POST $SLACK_WEBHOOK \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "✅ Workflow Completed",
    "blocks": [...]
  }'
```

### Option B: Slack GitHub App (Recommended)

**Cost:** Free (bundled with workspace)

**Features:**
- Rich formatting (blocks)
- Interactive buttons
- Threaded conversations
- Multiple channel support
- Workflow connections

**Setup:**
1. Add GitHub app to Slack workspace
2. Subscribe to repository
3. Connect workflows

**Pros:**
- Two-way integration
- Rich UI with buttons/dropdowns
- Native Slack features
- Easier troubleshooting

**Cons:**
- Requires Slack workspace admin
- Less customization than webhooks

### Option C: Custom Slack Bot (Advanced)

**Cost:** Minimal (runs in Actions)

**Features:**
- Full customization
- Interactive features
- Multi-workspace support
- Complex logic

**Cons:**
- More complex setup
- Requires OAuth management
- Higher maintenance

---

## Recommended Approach: Option B (Slack GitHub App)

**Why?**
1. Native integration with GitHub
2. Two-way communication possible
3. Rich formatting built-in
4. Team already familiar with GitHub + Slack

---

## Notification Preferences

### Channel Strategy

**Primary Channels:**
- `#milestone-automation` — All workflow notifications
- `#alerts` — Failures and critical issues

**Optional Channels:**
- Private DM to workflow triggerer (for manual runs)
- Channel per team (if scaled to multiple teams)

### User Preferences

**Allow team members to:**
- Mute daily summaries
- Disable "started" notifications
- Get direct notifications for failures
- Create custom rules for their projects

**Example Preference Storage:**
```json
{
  "userId": "U123456",
  "preferences": {
    "muteDaily": true,
    "muteStarted": true,
    "alertOnFailure": true,
    "channels": ["#milestone-automation"]
  }
}
```

---

## Rich Message Formatting

### Block Structure (Slack Blocks API)

```json
{
  "type": "section",
  "text": {
    "type": "mrkdwn",
    "text": "*✅ Milestone Distribution Complete*\n2026-09-02 at 3:43 PM"
  }
}
```

### Interactive Elements

**1. View Run Button**
```json
{
  "type": "actions",
  "elements": [
    {
      "type": "button",
      "text": {
        "type": "plain_text",
        "text": "View Run Logs"
      },
      "url": "https://github.com/lightspeedwp/.github/actions/runs/33650372958",
      "action_id": "view_run_logs",
      "style": "primary"
    }
  ]
}
```

**2. Reactions**
- Emoji reactions for quick sentiment
- 👍 = "Looks good"
- ❌ = "Needs attention"
- 🚀 = "Deploy it"

**3. Threading**
- Success details in thread
- Failure diagnostics in thread
- Keeps main channel clean

---

## Error Handling

### Separate Success/Failure Conditions

**Critical:** Use separate workflow step conditions for success vs. failure notifications. Never use `if: always()` with a single message format.

```yaml
- name: Send Success Notification
  if: success()
  uses: slackapi/slack-github-action@v1.24.0
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "✅ Milestone Distribution Complete",
        "blocks": [...]
      }

- name: Send Failure Notification
  if: failure()
  uses: slackapi/slack-github-action@v1.24.0
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "🚨 Milestone Distribution FAILED",
        "blocks": [...]
      }
```

### Slack API Error Handling

Never fail the workflow due to Slack unavailability:

```javascript
// Exponential backoff for rate limits
async function sendSlackNotification(result, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(SLACK_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Respect rate limit headers (1 msg/sec)
      const retryAfter = parseInt(response.headers.get('retry-after') || '1', 10);
      if (response.status === 429) {
        await sleep(retryAfter * 1000);
        continue;
      }

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.status}`);
      }

      return true; // Success
    } catch (error) {
      console.warn(`Slack notification attempt ${attempt + 1} failed:`, error.message);
      
      if (attempt < maxRetries - 1) {
        await sleep(Math.pow(2, attempt) * 1000); // Exponential backoff
      }
    }
  }

  // All retries exhausted - fallback to GitHub Issue
  console.warn('Slack unavailable after retries. Creating GitHub Issue fallback.');
  return await createGitHubIssueFallback(result);
}
```

### GitHub Issue Fallback

If Slack is unavailable after retry attempts, create an issue instead:

```javascript
async function createGitHubIssueFallback(result) {
  const timestamp = new Date().toISOString();
  const title = `[AUTO] Workflow Notification - ${result.status === 'success' ? '✅' : '🚨'} ${timestamp}`;
  
  const body = `
**Automated Notification (Slack Unavailable)**

This issue was created because Slack notification failed.

**Workflow Result:** ${result.status}
**Run ID:** ${result.runId}
**Duration:** ${result.duration}ms
**Issues Processed:** ${result.issuesProcessed}
**Successful:** ${result.successCount}
**Failed:** ${result.failureCount}

**Run URL:** ${result.runUrl}
  `;

  // Deduplicate: Check if recent issue exists to avoid spam
  const existingIssues = await github.rest.issues.listForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
    labels: ['type:notification'],
    state: 'open',
    per_page: 5
  });

  const recentIssue = existingIssues.data.find(issue => {
    const createdTime = new Date(issue.created_at).getTime();
    const now = Date.now();
    return (now - createdTime) < 60000; // Within last 60 seconds
  });

  if (recentIssue) {
    // Update existing issue instead of creating new one
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: recentIssue.number,
      body: `**[${timestamp}]** ${result.status === 'success' ? '✅' : '🚨'} Run ${result.runId}: ${result.successCount} success, ${result.failureCount} failed`
    });
  } else {
    // Create new issue
    await github.rest.issues.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      title: title,
      body: body,
      labels: ['type:notification', 'area:automation']
    });
  }

  return true;
}
```

### Rate Limit Handling

**Slack Webhook Rate Limits:** 1 message per second per webhook

```javascript
// Track and respect rate limits
class SlackRateLimiter {
  constructor() {
    this.lastMessageTime = 0;
    this.messageInterval = 1000; // 1 second
  }

  async sendMessage(payload) {
    const now = Date.now();
    const timeSinceLastMessage = now - this.lastMessageTime;

    if (timeSinceLastMessage < this.messageInterval) {
      const delay = this.messageInterval - timeSinceLastMessage;
      await sleep(delay);
    }

    // Send message
    const response = await fetch(SLACK_WEBHOOK, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    this.lastMessageTime = Date.now();
    return response;
  }
}
```

### User-Group Mentions

**Correct Format:** Use Slack user-group ID instead of `@name`

```
❌ WRONG: @milestone-automation-oncall
✅ RIGHT: <!subteam^S123456|@milestone-automation-oncall>
```

**In Slack Messages:**
```json
{
  "type": "section",
  "text": {
    "type": "mrkdwn",
    "text": "Alert for <!subteam^S123456|@milestone-automation-oncall>"
  }
}
```

**Finding User-Group ID:**
1. Open user group in Slack
2. Click details → "Copy ID"
3. Format as: `<!subteam^{ID}|@{name}>`

---

## Rollout Strategy

### Phase 3A: MVP (Week 1)
- [ ] Configure Slack webhook
- [ ] Send success notifications
- [ ] Send failure alerts

### Phase 3B: Enhancement (Week 2)
- [ ] Add rate limit warnings
- [ ] Implement threaded replies
- [ ] Add interactive buttons

### Phase 3C: Polish (Week 3)
- [ ] User preference system
- [ ] Daily summaries
- [ ] Dashboard integration

### Phase 3D: Optimization (Week 4)
- [ ] Reduce notification noise
- [ ] Add ML-based anomaly detection
- [ ] Custom per-team channels

---

## Metrics to Track

### Notification Effectiveness

- [ ] Messages delivered: X per day
- [ ] Engagement (reactions): X% of messages
- [ ] Click-through rate (logs): X%
- [ ] User satisfaction: X/5 (survey)

### Spam Prevention

- [ ] Deduplication (no duplicate messages)
- [ ] Rate limiting (max N messages/hour)
- [ ] Batching (combine when applicable)

---

## Accessibility & Tone

### Best Practices

1. **Clear Language:** Avoid jargon
   - ❌ "403 Unauthorized payload"
   - ✅ "Permission denied when updating issue"

2. **Emoji Strategy:** Use consistently
   - ✅ Success = 🟢 or ✅
   - ❌ Failure = 🔴 or ⚠️
   - ⏱️ Duration/timing = ⏱️

3. **Actionable Messages:** Include next steps
   - ❌ "Workflow failed"
   - ✅ "Workflow failed due to rate limit. Wait 45 min to retry."

4. **Tone:** Professional but friendly
   - Include context and humor where appropriate
   - Show appreciation for team contributions

---

## Integration Points

### GitHub Actions Workflow

```yaml
- name: Send Slack Notification
  if: always()  # Run on success or failure
  uses: slackapi/slack-github-action@v1.24.0
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "✅ Milestone Distribution Complete",
        "blocks": [...]
      }
```

### Custom Script Integration

```javascript
const SlackNotifier = require('./scripts/slack-notifier');
const notifier = new SlackNotifier(process.env.SLACK_WEBHOOK);

await notifier.sendSuccess({
  issuesProcessed: 8,
  duration: 3200,
  milestone: 'v1.1'
});
```

---

## Related Features

- [ENH-001](https://github.com/lightspeedwp/.github/issues/2569) — Metrics dashboard
- [ENH-003](https://github.com/lightspeedwp/.github/issues/2572) — Manual trigger system
- [MON-001](https://github.com/lightspeedwp/.github/issues/2558) — Workflow alerts

---

## Success Criteria

### Phase 3 Delivery
- [ ] Slack notifications deployed
- [ ] 90%+ message delivery rate
- [ ] <30 second latency (message to Slack)
- [ ] Zero false positives in alerts

### Team Adoption
- [ ] Team uses notifications for workflow status
- [ ] Reduces GitHub Action log reviews by 50%+
- [ ] Clear value demonstrated

---

**Design Owner:** lightspeedwp/maintainers  
**Created:** 2026-09-02  
**Status:** 📋 Design (Phase 3 Implementation)  
**Relates to:** [ENH-002 Issue #2571](https://github.com/lightspeedwp/.github/issues/2571)

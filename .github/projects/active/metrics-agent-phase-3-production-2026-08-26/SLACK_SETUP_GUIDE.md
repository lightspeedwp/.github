---
name: Slack Integration Setup Guide
description: Step-by-step guide to configure Slack webhooks for metrics notifications
type: guide
status: Ready
version: 1.0.0
---

# Slack Integration Setup Guide

## Overview

This guide walks you through setting up Slack notifications for Metrics Agent workflow failures.

## Prerequisites

- Access to Slack workspace admin settings
- Access to GitHub repository settings
- Ability to create/manage webhooks in Slack

## Step 1: Create Slack App

### 1.1 Access Slack API Dashboard

1. Open [https://api.slack.com/apps](https://api.slack.com/apps)
2. Log in with your Slack workspace account
3. Click **"Create New App"**

### 1.2 Create New App

1. Choose **"From scratch"**
2. **App name:** `GitHub Metrics` (or preferred name)
3. **Workspace:** Select your workspace
4. Click **"Create App"**

### 1.3 Enable Incoming Webhooks

1. In the left sidebar, navigate to **"Features"** → **"Incoming Webhooks"**
2. Toggle **"Activate Incoming Webhooks"** to ON
3. Click **"Add New Webhook to Workspace"**

## Step 2: Configure Webhook Channel

### 2.1 Select Channel

1. A popup appears: **"Select the channel where notifications will be posted"**
2. Choose **#metrics-pipeline** (or your preferred channel)
   - *If channel doesn't exist, create it: right-click workspace → "Create a channel"*
3. Click **"Allow"**

### 2.2 Verify Webhook Created

1. You'll be redirected back to Incoming Webhooks
2. You should see a new webhook in the list with format: `https://hooks.slack.com/services/T.../B.../XX...`
3. **Copy this URL** — you'll need it in the next step

## Step 3: Add GitHub Repository Secret

### 3.1 Navigate to Repository Settings

1. Go to your GitHub repository: [lightspeedwp/.github](https://github.com/lightspeedwp/.github)
2. Click **Settings** (top right)
3. In left sidebar: **"Secrets and variables"** → **"Actions"**

### 3.2 Create Repository Secret

1. Click **"New repository secret"** button
2. **Name:** `SLACK_METRICS_WEBHOOK`
3. **Value:** Paste the webhook URL from Step 2.2
   - Should look like: `https://hooks.slack.com/services/T00.../B00.../XX...`
4. Click **"Add secret"**

### 3.3 Verify Secret Created

1. You should see `SLACK_METRICS_WEBHOOK` in the list of secrets
2. ✅ Secret is now available to GitHub Actions workflows

## Step 4: Test Webhook

### 4.1 Manual Webhook Test (Optional)

You can test the webhook directly using curl:

```bash
curl -X POST https://hooks.slack.com/services/YOUR_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "Test notification from GitHub Metrics",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Test Metrics Notification*\nThis is a test message.\nWorkflow is correctly configured! ✅"
        }
      }
    ]
  }'
```

**Expected result:** Message appears in #metrics-pipeline channel

### 4.2 Workflow Test

1. In GitHub, navigate to **Actions**
2. Find **"Metrics • Collection & Reporting"** workflow
3. Click **"Run workflow"** → **Branch: develop** → **"Run workflow"**
4. Wait for workflow to complete
5. Check #metrics-pipeline Slack channel for notification

## Step 5: Configure Notification Channel

### 5.1 Create Dedicated Channel (Optional)

For better organization, you can use a dedicated channel:

1. In Slack, click **"+"** next to "Channels" in sidebar
2. **Create a channel:** `#github-metrics` or `#metrics-alerts`
3. Repeat **Step 2.1-2.2** to add webhook to new channel

### 5.2 Update Secret (If Using Different Channel)

If you created a new webhook for a different channel:

1. In GitHub Settings → Secrets
2. Click **"Update"** on `SLACK_METRICS_WEBHOOK`
3. Paste new webhook URL
4. Click **"Update secret"**

## Step 6: Customize Notification Format (Optional)

You can customize the notification message format. Edit `.github/workflows/metrics-reporting.yml`:

```yaml
notify-failure:
  name: Notify Slack on workflow failure
  needs: [collect, aggregate]
  if: failure()
  runs-on: ubuntu-latest
  steps:
    - name: Send Slack notification
      uses: slackapi/slack-github-action@v1
      with:
        webhook-url: ${{ secrets.SLACK_METRICS_WEBHOOK }}
        payload: |
          {
            "text": "Custom failure message here",
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "Your custom message"
                }
              }
            ]
          }
```

**Notification blocks:**
- `"type": "section"` — Text block
- `"text": { "type": "mrkdwn", "text": "..." }` — Markdown formatted text
- Use `*bold*`, `_italic_`, `~strikethrough~` for formatting
- Use `<URL|link text>` for links

## Troubleshooting

### Issue: "Invalid webhook URL"

**Symptoms:** Workflow fails with "Invalid webhook URL" error

**Solution:**
1. Verify webhook URL copied correctly (no extra spaces)
2. Check in Slack: Settings → Apps → GitHub Metrics → Incoming Webhooks
3. Confirm webhook URL hasn't been revoked
4. Create new webhook and update secret

### Issue: Notification not appearing in Slack

**Symptoms:** Workflow completes but no message in #metrics-pipeline

**Solution:**
1. Check GitHub Actions logs for errors
2. Verify secret name matches exactly: `SLACK_METRICS_WEBHOOK`
3. Confirm webhook is for correct Slack workspace
4. Check Slack channel settings — ensure "GitHub Metrics" app has permission to post
5. Run manual test using curl (Step 4.1)

### Issue: "Webhook URL revoked"

**Symptoms:** Workflow fails with "Webhook has been revoked"

**Solution:**
1. In Slack: Settings → Apps → GitHub Metrics → Incoming Webhooks
2. Delete revoked webhook
3. Click "Add New Webhook to Workspace"
4. Select #metrics-pipeline
5. Copy new webhook URL
6. Update secret in GitHub: SLACK_METRICS_WEBHOOK

### Issue: Multiple notification channels needed

**Solution:**
1. Create multiple webhooks in Slack (one per channel)
2. Add multiple secrets in GitHub:
   - `SLACK_METRICS_WEBHOOK` (primary)
   - `SLACK_METRICS_WEBHOOK_SECONDARY` (optional)
3. Update workflow to post to both:

```yaml
- name: Send primary notification
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_METRICS_WEBHOOK }}
    # ... payload ...

- name: Send secondary notification
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_METRICS_WEBHOOK_SECONDARY }}
    # ... payload ...
```

## Verification Checklist

- [ ] Slack app created: "GitHub Metrics"
- [ ] Incoming webhook enabled
- [ ] Webhook URL copied correctly
- [ ] GitHub secret created: `SLACK_METRICS_WEBHOOK`
- [ ] Secret value matches webhook URL exactly
- [ ] Test message sent and received in Slack
- [ ] Workflow triggered and notifications working
- [ ] Channel permissions verified (app can post)
- [ ] Team notified about notification channel

## Additional Resources

- [Slack Incoming Webhooks API](https://api.slack.com/messaging/webhooks)
- [Slack Message Formatting](https://api.slack.com/reference/surfaces/formatting)
- [GitHub Actions Slack Action](https://github.com/slackapi/slack-github-action)
- [Block Kit Builder](https://app.slack.com/block-kit-builder/) — Design notification format visually

## Support

If you encounter issues:

1. Check Slack app logs: Settings → Apps → GitHub Metrics → App activity
2. Review GitHub Actions logs: Actions → Metrics Workflow → Run → Job logs
3. Verify webhook URL in GitHub secret settings
4. Test webhook with curl command (Step 4.1)
5. Reach out to team lead with workflow run ID and error message

---

**Version:** 1.0.0  
**Created:** 2026-08-19  
**Maintained by:** Phase 3 Lead

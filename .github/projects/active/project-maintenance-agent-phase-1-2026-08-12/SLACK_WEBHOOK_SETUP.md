---
title: Slack Webhook Setup
description: Configure Slack webhook for project maintenance notifications
---

# Slack Webhook Configuration

## Setup

1. Create app: https://api.slack.com/apps → "Create New App"
   - Name: `Project Maintenance Notifications`
   - Workspace: LightSpeed

2. Enable Incoming Webhooks
   - Left sidebar → "Incoming Webhooks" → ON
   - Add webhook to target channel (e.g., #projects)
   - Copy webhook URL

3. Add to GitHub Secrets
   - Settings → Secrets and variables → Actions
   - New secret: `PROJECT_MAINTENANCE_SLACK_WEBHOOK`
   - Paste webhook URL

4. Test
   - Run nightly workflow → check Slack

## Security
- Never commit webhook URLs
- Use GitHub Secrets only
- Rotate if exposed

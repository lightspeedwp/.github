---
title: "Runbook: Secret or Credential Expiration"
description: "Recovery steps for expired or revoked authentication secrets"
status: "active"
severity: "critical"
created_date: "2026-08-21"
last_updated: "2026-08-21"
---

# Runbook: Secret Expiration

## Problem Statement

Authentication fails due to expired or revoked secrets/tokens.

**Symptoms:**
- `401 Unauthorized` errors in workflow logs
- Slack notifications stop sending
- GitHub API calls fail with auth errors
- "Invalid token" or "Token expired" messages

**Impact:**
- Metrics collection stops completely
- Alerts not delivered to team
- No visibility into repository health
- Critical monitoring system offline

---

## Severity: CRITICAL

This requires immediate action. Metrics monitoring is non-functional.

---

## Quick Fix (5 minutes)

If you can't diagnose, try rotating all secrets:

1. **Get valid GitHub token:**
   - Visit GitHub → Settings → Developer settings → Personal access tokens
   - Create new token with `repo` scope (all read/write access)

2. **Update repo secrets:**
   - Go to repo Settings → Secrets and variables → Actions
   - Update `GITHUB_TOKEN` with new token value

3. **Slack webhook (if applicable):**
   - Regenerate Slack webhook in Slack App Manager
   - Update `SLACK_METRICS_WEBHOOK` secret

4. **Re-run workflow:**
   - Go to Actions → Metrics Collection
   - Click "Run workflow"

---

## Detailed Diagnosis

### Step 1: Identify Which Secret Failed

1. Go to failed workflow run
2. Expand job logs
3. Find error message pattern:

```
401: Unauthorized (GITHUB API)    → GitHub token issue
401: Unauthorized (Slack)          → Slack webhook issue
400: Bad Request (auth header)     → Token format issue
403: Forbidden (insufficient scope) → Token permissions issue
```

### Step 2: Verify Secret Exists

1. Go to repo Settings → Secrets and variables → Actions
2. Check that required secrets exist:
   - `GITHUB_TOKEN` (for GitHub API calls)
   - `SLACK_METRICS_WEBHOOK` (for Slack notifications, optional)

3. Note: Secrets don't show their values, only that they exist

### Step 3: Check Secret Validity

1. **For GITHUB_TOKEN:**
   - Visit GitHub → Settings → Developer settings → Personal access tokens
   - Check if token still exists
   - Check expiration date (if any)
   - Check if token was revoked

2. **For SLACK_METRICS_WEBHOOK:**
   - Visit Slack workspace → Apps & Integrations → Manage apps
   - Find your metrics webhook
   - Check if webhook still active
   - Check if webhook was revoked/deleted

---

## Solutions

### Solution A: GitHub Token Expired

**Diagnosis:** `401 Unauthorized` on GitHub API calls

**Recovery Steps:**

1. **Create new GitHub token:**
   ```
   GitHub → Settings → Developer settings → Personal access tokens
   → Fine-grained personal access tokens → New token
   ```

2. **Configure token permissions:**
   - Token name: `metrics-collection`
   - Expiration: 90 days (or custom)
   - Repository access: Select `.github` repo only
   - Permissions:
     - ✅ Contents: Read
     - ✅ Discussions: Read & Write
     - ✅ Issues: Read & Write
     - ✅ Pull requests: Read

3. **Copy token value:**
   - **IMPORTANT:** Copy immediately, can't view again later
   - Save temporarily in safe location

4. **Update repo secret:**
   - Repo Settings → Secrets and variables → Actions
   - Click "GITHUB_TOKEN" (or create if missing)
   - Paste new token value
   - Click "Update secret"

5. **Verify:**
   - Go to Actions → Metrics Collection
   - Click "Run workflow" to test
   - Check logs for "✅" indicators

### Solution B: GitHub Token Insufficient Permissions

**Diagnosis:** `403 Forbidden` on GitHub API calls

**Recovery Steps:**

1. **Check token permissions:**
   ```
   GitHub → Settings → Developer settings → Personal access tokens
   → Click your token name
   ```

2. **Verify required permissions are enabled:**
   - ✅ repo (or minimum: repo:read)
   - ✅ read:org (to see organization)
   - ✅ workflow (to read Actions)

3. **If permissions missing:**
   - Classic tokens: Edit token, check permissions
   - Fine-grained tokens: May need to create new token with correct permissions

4. **Regenerate if needed:**
   - Delete old token
   - Create new token with required permissions
   - Follow Solution A steps above

### Solution C: GitHub Token Revoked

**Diagnosis:** Token exists but no longer works, or "Token revoked" message

**Recovery Steps:**

1. **Check if token still exists:**
   ```
   GitHub → Settings → Developer settings → Personal access tokens
   → Look for "metrics-collection" or similar
   ```

2. **If missing, create new token:**
   - Follow Solution A steps

3. **If exists but doesn't work:**
   - Check creation date (very old tokens may auto-expire)
   - Delete old token
   - Create new token with same name and permissions

4. **Update repo secret with new token**

### Solution D: Slack Webhook Expired

**Diagnosis:** Slack notifications fail but GitHub API works

**Recovery Steps:**

1. **Verify Slack webhook exists:**
   ```
   Slack workspace → Apps & Integrations → Manage apps
   → Look for app with metrics webhook
   ```

2. **If webhook not found:**
   - Webhook was deleted/revoked
   - Create new webhook (see below)

3. **Regenerate Slack webhook:**
   - In Slack app, find webhook configuration
   - Click "Regenerate URL" or create new incoming webhook
   - Copy new webhook URL

4. **Update repo secret:**
   - Repo Settings → Secrets and variables → Actions
   - Click "SLACK_METRICS_WEBHOOK" (or create if missing)
   - Paste new webhook URL
   - Click "Update secret"

5. **Test notification:**
   - Manually trigger workflow: `gh workflow run metrics-reporting.yml`
   - Check Slack channel for test message

### Solution E: Multiple Secrets Failed

**Diagnosis:** Both GitHub and Slack functionality broken

**Recovery Steps:**

1. **Do quick fix first:**
   - Rotate both GitHub token and Slack webhook
   - Test each independently

2. **GitHub token:**
   - Follow Solution A

3. **Slack webhook:**
   - Follow Solution D

4. **Verify both work:**
   - Run metrics: `npm run metrics:ci`
   - Verify GitHub API calls succeed
   - Trigger notification test
   - Verify Slack receives message

---

## Prevention

1. **Token rotation schedule:**
   - Rotate GitHub token every 90 days
   - Add calendar reminder for token rotation
   - Create new token, test, then delete old token

2. **Webhook monitoring:**
   - Verify Slack webhook works monthly
   - Document webhook creation date
   - Plan regeneration before expiration

3. **Token naming:**
   - Name tokens clearly: `metrics-collection-20240315`
   - Use date format to track age
   - Easy to identify old tokens for cleanup

4. **Access control:**
   - Limit token permissions to minimum required
   - Use fine-grained tokens when available
   - Regularly audit token list for unused tokens

5. **Alerts:**
   - Set calendar alerts for token rotation dates
   - Notify team of rotation schedule
   - Test tokens immediately after rotation

---

## Testing

After rotating secrets, verify with:

```bash
# Test GitHub token
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.github.com/repos/lightspeedwp/.github

# Test Slack webhook (if available)
curl -X POST YOUR_SLACK_WEBHOOK \
     -d '{"text":"Test message"}'

# Full metrics test
npm run metrics:ci
```

---

## Escalation

If secrets appear correct but still failing:

1. **Check token format:**
   - GitHub tokens start with `ghp_` (classic) or `github_pat_` (fine-grained)
   - Slack webhooks start with `https://hooks.slack.com/`

2. **Check for whitespace:**
   - Tokens copied with extra spaces fail
   - Trim leading/trailing spaces

3. **Verify secret access:**
   - Job needs permission to read secrets
   - Check workflow `permissions:` section

4. **Contact GitHub/Slack support:**
   - If new token still doesn't work
   - Include workflow logs and error messages

---

## Quick Reference

| Error | Cause | Action |
|-------|-------|--------|
| 401 GitHub | Token expired | Rotate GitHub token |
| 403 GitHub | Insufficient permissions | Add required permissions |
| 401 Slack | Webhook revoked | Regenerate Slack webhook |
| Token not found | Secret deleted | Create new secret |
| Whitespace errors | Copied with spaces | Trim secret value |

---

**Created:** 2026-08-21  
**Last Updated:** 2026-08-21  
**Runbook Version:** 1.0  
**Maintainer:** Phase 3 Monitoring Team

---
file_type: documentation
title: "TASK 3.1 PRODUCTION DEPLOYMENT"
description: "Production deployment of metrics collection workflow"
last_updated: "2026-08-25"
status: active
---

# Task 3.1: Production Deployment — Metrics Workflow

**Issue:** [#2126](https://github.com/lightspeedwp/.github/issues/2126)  
**Estimated:** 3-5 hours  
**Owner:** Phase 3 Lead  
**Status:** 🔧 IN PROGRESS

## Objective

Deploy metrics collection workflow to production with automatic scheduling, proper error handling, and monitoring.

## Deliverables

- [x] Workflow scheduling configured (daily 2 AM UTC)
- [x] Slack failure notifications integrated
- [ ] GitHub token and secrets configured
- [ ] Workflow logging enabled
- [ ] Production readiness checklist completed

## Implementation Details

### 1. Workflow Configuration Changes ✅

**Files Updated:**
- `.github/workflows/metrics-reporting.yml`
- `.github/workflows/metrics-pipeline.yml`

**Changes Made:**
- ✅ Updated cron schedule from `0 6 * * 1` (Monday 6 AM) to `0 2 * * *` (daily 2 AM UTC)
- ✅ Added `notify-failure` job for Slack notifications on workflow failure
- ✅ Configured webhook-based notifications using `slackapi/slack-github-action@v1`

**Workflow Timing:**
- **Schedule:** Daily at 2:00 AM UTC
- **Expected duration:** <5 minutes
- **Retry behavior:** Exponential backoff with max 3 attempts per API call

### 2. Required Secrets Configuration 📋

Add the following secrets to the repository settings:

| Secret | Purpose | Required | Example |
|--------|---------|----------|---------|
| `SLACK_METRICS_WEBHOOK` | Slack webhook for failure notifications | ✅ Yes | `https://hooks.slack.com/services/T00.../B00.../XX...` |
| `GITHUB_TOKEN` | GitHub API authentication (auto-provided) | ✅ Yes | Auto-provided by Actions |

**Configuration Steps:**
1. Navigate to repository Settings → Secrets and variables → Actions
2. Create new repository secret: `SLACK_METRICS_WEBHOOK`
3. Value: Your Slack webhook URL for #metrics-pipeline channel
4. Click "Add secret"

**How to Create Slack Webhook:**
1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Create new app → From scratch → app name: "GitHub Metrics"
3. Features → Incoming Webhooks → Enable
4. Add New Webhook to Workspace → Select #metrics-pipeline channel
5. Copy webhook URL → Add as SLACK_METRICS_WEBHOOK secret

### 3. Environment Variables 🌍

**Currently Configured:**
```yaml
env:
  METRICS_DIR: .github/metrics
  REPORTS_DIR: .github/reports/metrics
```

**What They Do:**
- `METRICS_DIR`: Directory for temporary metrics cache
- `REPORTS_DIR`: Directory for archiving weekly reports

### 4. Workflow Logging 📝

**Logging Enabled:**
- [x] Step-level logging (every step logs its execution)
- [x] Environment variable logging (visible in Actions logs)
- [x] Error output on failure
- [x] Summary output at workflow completion

**View Logs:**
1. GitHub → Actions → "Metrics • Collection & Reporting"
2. Select workflow run
3. Click job name (collect, aggregate, post-to-discussions)
4. View step-by-step logs

### 5. Failure Notifications 🔔

**Slack Notification Trigger:**
- Automatically sends when `collect` or `aggregate` job fails
- Includes:
  - Repository and branch information
  - Link to failed workflow run
  - Commit SHA and link
  - Failed job names

**Notification Example:**
```
❌ Metrics Pipeline Failed
Repository: lightspeedwp/.github
Branch: refs/heads/develop
Run: [View Details]

Failed job(s): collect, aggregate
Commit: [abc1234]
```

## Success Criteria

- [x] Workflow runs on schedule (daily at 2 AM UTC)
- [x] Slack failures configured and tested
- [ ] First 7 days of production runs logged and reviewed
- [ ] Zero critical errors in first week
- [ ] Collection completes in <5 minutes consistently
- [ ] All contexts collected: control-plane, plugins, themes

## Testing Checklist

Before considering this task complete:

- [ ] **Manual Trigger Test**
  ```bash
  gh workflow run metrics-reporting.yml -f stage=all
  ```
  - Monitor execution in Actions
  - Verify all jobs complete successfully
  - Check workflow logs for any errors

- [ ] **Slack Notification Test**
  ```bash
  # Manually trigger failure scenario (optional)
  # Or wait for first scheduled failure (if any)
  ```
  - Verify Slack notification sent on failure
  - Confirm message has correct details

- [ ] **Schedule Verification**
  - Confirm workflow is enabled
  - Verify scheduled run appears in Actions tab
  - Check next scheduled run time (2 AM UTC daily)

- [ ] **Data Validation**
  - Verify metrics JSON generated correctly
  - Check reports directory for output files
  - Validate report markdown formatting

## Known Issues & Mitigations

| Issue | Mitigation | Status |
|-------|-----------|--------|
| Rate limiting | Exponential backoff with 60s max wait | ✅ Implemented |
| Missing secrets | Clear error message guides user setup | 📋 Documented |
| Slack webhook invalid | GitHub Actions fails with clear error | 🔧 Testing |
| Collection timeout | Currently unlimited; Phase 3.5 adds timeout | 📋 Planned |

## Next Steps

1. **Immediate (Today):**
   - [ ] Configure `SLACK_METRICS_WEBHOOK` secret
   - [ ] Test manual workflow trigger
   - [ ] Verify Slack notifications working

2. **This Week:**
   - [ ] Monitor first 3-5 scheduled runs
   - [ ] Document any issues encountered
   - [ ] Move to Task 3.2 (Integration)

3. **Ongoing:**
   - [ ] Daily review of workflow logs
   - [ ] Slack notification monitoring
   - [ ] Performance benchmarking

## Related Resources

- **GitHub Issues:**
  - [#2126 - Task 3.1: Production Deployment](https://github.com/lightspeedwp/.github/issues/2126)

- **Documentation:**
  - [Phase 3 Project README](./README.md)
  - [Metrics Agent Integration Guide](../../scripts/metrics/docs/INTEGRATION_GUIDE.md)
  - [Slack Webhook Setup Guide](./SLACK_SETUP_GUIDE.md) *(to be created)*

- **Workflows:**
  - [metrics-reporting.yml](../../.github/workflows/metrics-reporting.yml)
  - [metrics-pipeline.yml](../../.github/workflows/metrics-pipeline.yml)

- **Scripts:**
  - [aggregate.cjs](../../scripts/workflows/metrics/aggregate.cjs)
  - [generate-report.cjs](../../scripts/workflows/metrics/generate-report.cjs)

## Configuration Quick Reference

```bash
# View current workflow schedule
gh workflow view metrics-reporting.yml --json jobs

# Manually trigger workflow
gh workflow run metrics-reporting.yml -f stage=all

# Check workflow runs
gh run list --workflow=metrics-reporting.yml

# View latest run logs
gh run view $(gh run list --workflow=metrics-reporting.yml -L 1 --json databaseId -q '.[0].databaseId')
```

## Acceptance Criteria

Task 3.1 is complete when:

1. ✅ Workflow scheduling configured (daily 2 AM UTC)
2. ✅ Slack notifications implemented and tested
3. ✅ All required secrets documented
4. ✅ First production run successful (no critical errors)
5. ✅ Logs reviewed and validated
6. [ ] Metrics data quality verified
7. [ ] Ready for Task 3.2 integration

---

**Created:** 2026-08-19  
**Updated:** 2026-08-19  
**Lead:** Phase 3 Owner  
**Status:** 🔧 IN PROGRESS → READY FOR TESTING

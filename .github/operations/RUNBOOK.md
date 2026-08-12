---
title: Issue Maintenance System — Operational Runbook
description: Operational guide for daily operations, startup/shutdown, and troubleshooting
version: 1.0.0
created_date: 2026-08-12
last_updated: 2026-08-12
authors:
  - lightspeedwp/maintainers
tags:
  - operations
  - runbook
  - troubleshooting
---

# Issue Maintenance System — Operational Runbook

**Document Version:** 1.0.0  
**Last Updated:** 2026-08-12  
**Owner:** LightSpeed Engineering Team  
**Related Issues:** [#1680](https://github.com/lightspeedwp/.github/issues/1680)

---

## Quick Reference

| Task | Time | Command |
|------|------|---------|
| **Startup Health Check** | 5 min | [See Startup](#startup-checklist) |
| **Manual Audit** | 5 min | `node scripts/automation/label-orchestrator.js audit` |
| **Run Label Sync (dry-run)** | 5 min | `node scripts/automation/label-orchestrator.js sync --dry-run` |
| **Check Dashboard** | 2 min | Open [dashboard](./) (link TBD) |
| **View Audit Trail** | 2 min | `cat .github/reports/audit-trail-latest.json \| jq` |
| **Disable Workflows** | 2 min | [See Shutdown](#shutdown-procedure) |
| **Critical Issue Response** | 5-10 min | [See Incident Response](#incident-response) |

---

## Startup Checklist

**Duration:** 5 minutes  
**Frequency:** Daily or on-demand before operations

```bash
#!/bin/bash
# startup-health-check.sh

echo "🚀 Starting Issue Maintenance System Health Check..."
echo ""

# 1. Verify workflow status
echo "1️⃣  Checking workflow status..."
STATUS=$(gh workflow list --repo lightspeedwp/.github | grep -E "meta-labels-sync|label-audit-report")
if [ -z "$STATUS" ]; then
  echo "   ❌ Workflows not found!"
  exit 1
fi
echo "   ✅ Workflows found"

# 2. Check last successful run
echo "2️⃣  Checking last successful run..."
LAST_RUN=$(gh run list -w meta-labels-sync.yml -s success -L 1 --json startedAt,conclusion)
if [ -z "$LAST_RUN" ]; then
  echo "   ⚠️  No successful runs found"
else
  echo "   ✅ Last run: $(echo $LAST_RUN | jq -r '.[0].startedAt')"
fi

# 3. Verify API token scope
echo "3️⃣  Verifying API token scope..."
SCOPES=$(gh auth status 2>&1 | grep -i "scopes")
if echo "$SCOPES" | grep -q "issues:write"; then
  echo "   ✅ Token scopes valid"
else
  echo "   ❌ Token missing required scopes!"
  exit 1
fi

# 4. Check repo connectivity
echo "4️⃣  Checking repo connectivity..."
if gh repo view lightspeedwp/.github > /dev/null 2>&1; then
  echo "   ✅ Repo accessible"
else
  echo "   ❌ Repo not accessible!"
  exit 1
fi

# 5. Verify audit trail accessible
echo "5️⃣  Checking audit trail..."
if [ -f ".github/reports/audit-trail-latest.json" ]; then
  COUNT=$(jq '.auditTrail | length' .github/reports/audit-trail-latest.json 2>/dev/null || echo "0")
  echo "   ✅ Audit trail found ($COUNT entries)"
else
  echo "   ⚠️  Audit trail not found (first run?)"
fi

echo ""
echo "✅ Health check complete — System ready for operation"
```

**Run Startup Check:**

```bash
bash .github/operations/startup-health-check.sh
```

**Success Indicators:**

- ✅ All workflows enabled
- ✅ Last successful run recent (within 24 hours)
- ✅ API token has required scopes
- ✅ Repo accessible and writable
- ✅ Audit trail exists and is populated

---

## Daily Operations

### Manual Audit (On-Demand)

Run label audit without making changes (safe to run anytime):

```bash
# Audit all issues (dry-run by default)
node scripts/automation/label-orchestrator.js audit --output ./report-$(date +%Y%m%d-%H%M%S).json

# View report
cat report-*.json | jq '.summary'

# Expected output:
# {
#   "total_issues": 372,
#   "labeled_issues": 350,
#   "coverage": "94.1%",
#   "recommendations": {
#     "add_labels": 15,
#     "remove_labels": 7,
#     "fix_conflicts": 2
#   }
# }
```

### Manual Label Sync (With Caution)

Apply label changes (use `--dry-run` first to preview):

```bash
# Preview changes (safe, no modifications)
node scripts/automation/label-orchestrator.js sync --dry-run --verbose

# If preview looks good, apply changes
node scripts/automation/label-orchestrator.js sync

# Verify in audit trail
tail -20 .github/reports/audit-trail-latest.json | jq '.auditTrail[-5:]'
```

### View System Metrics

Check recent performance and error rates:

```bash
# Get latest metrics summary
cat .github/reports/metrics-latest.json | jq '{
  "last_run": .lastRun,
  "success_rate": .successRate,
  "error_rate": .errorRate,
  "avg_duration": .avgDuration,
  "api_calls_used": .apiCallsUsed,
  "api_calls_remaining": .apiCallsRemaining
}'

# Expected healthy metrics:
# {
#   "last_run": "2026-08-12T10:30:00Z",
#   "success_rate": 0.995,           # > 99.5%
#   "error_rate": 0.003,             # < 0.5%
#   "avg_duration": 45,              # seconds
#   "api_calls_used": 250,
#   "api_calls_remaining": 4750
# }
```

---

## Shutdown Procedure

Use only when taking the system offline for maintenance, upgrades, or incident response.

```bash
#!/bin/bash
# shutdown-gracefully.sh

echo "🛑 Gracefully shutting down Issue Maintenance System..."
echo ""

REASON="${1:-Maintenance}"

# 1. Disable workflows
echo "1️⃣  Disabling workflows..."
gh workflow disable meta-labels-sync.yml --repo lightspeedwp/.github
gh workflow disable label-audit-report.yml --repo lightspeedwp/.github
echo "   ✅ Workflows disabled"

# 2. Post notification
echo "2️⃣  Posting shutdown notification..."
SHUTDOWN_TIME=$(date -u +"%Y-%m-%d %H:%M UTC")
echo "Issue maintenance system offline as of $SHUTDOWN_TIME — Reason: $REASON" | tee -a .github/operations/INCIDENT_LOG.md
echo "   ✅ Notification posted"

# 3. Archive latest metrics
echo "3️⃣  Archiving current state..."
mkdir -p .github/reports/archive
cp .github/reports/audit-trail-latest.json .github/reports/archive/audit-trail-$(date +%Y%m%d-%H%M%S).json
cp .github/reports/metrics-latest.json .github/reports/archive/metrics-$(date +%Y%m%d-%H%M%S).json
echo "   ✅ State archived"

echo ""
echo "✅ System gracefully shutdown"
echo ""
echo "To bring system back online:"
echo "  gh workflow enable meta-labels-sync.yml --repo lightspeedwp/.github"
echo "  gh workflow enable label-audit-report.yml --repo lightspeedwp/.github"
```

**Run Shutdown:**

```bash
bash .github/operations/shutdown-gracefully.sh "Scheduled maintenance"
```

---

## Troubleshooting Guide

### Issue: Workflow Fails with "Token Not Found"

**Symptom:** Workflow fails with `Error: Token not found` or `401 Unauthorized`

**Cause:** GitHub token expired or missing

**Resolution:**

```bash
# 1. Create new token
# Go to https://github.com/settings/tokens
# Create token with scopes: issues:write, metadata:read
# Copy token value

# 2. Update GitHub Actions secret
gh secret set GITHUB_TOKEN --body <token-value> --repo lightspeedwp/.github

# 3. Re-run failed workflow
gh workflow run meta-labels-sync.yml --repo lightspeedwp/.github

# 4. Verify success
gh run list -w meta-labels-sync.yml -L 1 --json conclusion
# Expected: "success"
```

### Issue: "Permission Denied" Error

**Symptom:** Workflow fails with `Error: 403 Forbidden` or `Permission denied`

**Cause:** Token missing required scopes or repo access

**Resolution:**

```bash
# 1. Check current token scopes
gh auth status

# Expected output:
#  github.com
#    ✓ Logged in to github.com as <user> (/Users/<user>/.config/gh/hosts.yml)
#    ✓ Git operations protocol: https
#    ✓ Token: gho_****
#    ✓ Token scopes: issues:write, metadata:read

# If scopes are wrong:
# 2. Create new token with correct scopes
# 3. Update secret: gh secret set GITHUB_TOKEN --body <new-token>

# 4. Verify repo access
gh repo view lightspeedwp/.github

# If repo not accessible:
# 5. Check user permissions on repository
# 6. If needed, ask repo admin to grant access
```

### Issue: "API Rate Limit Exceeded"

**Symptom:** Workflow fails with `Error: 429 Too Many Requests`

**Cause:** GitHub API rate limit reached (5,000 calls/hour)

**Resolution:**

```bash
# 1. Check current rate limit
gh api rate_limit | jq '.resources.core'

# Expected output:
# {
#   "limit": 5000,
#   "remaining": 4500,
#   "reset": 1660300800
# }

# 2. If remaining < 100:
#    a) Wait for rate limit reset (typically 1 hour)
#    b) Reduce batch size in label sync
#    c) Stagger requests (add delays between API calls)

# 3. Check reset time
RESET_TIME=$(gh api rate_limit | jq '.resources.core.reset')
date -d @$RESET_TIME

# 4. Once limit resets, manually trigger workflow
gh workflow run meta-labels-sync.yml --repo lightspeedwp/.github
```

### Issue: Labels Not Applied Correctly

**Symptom:** Audit shows labels recommended but not applied

**Cause:** Usually permission issue or label doesn't exist

**Resolution:**

```bash
# 1. Check if label exists
gh label list --repo lightspeedwp/.github | grep "meta:stale"

# If not found, create it:
gh label create "meta:stale" \
  --description "Issue inactive 30+ days" \
  --color "d4c5f9" \
  --repo lightspeedwp/.github

# 2. Run audit in dry-run mode
node scripts/automation/label-orchestrator.js sync --dry-run --verbose

# 3. Check error messages in audit output
cat .github/reports/audit-trail-latest.json | jq '.auditTrail[] | select(.status == "error")'

# 4. Verify label name matches exactly (case-sensitive)
# Expected format: type:bug, status:done, meta:stale (lowercase, kebab-case)

# 5. Re-run label sync
node scripts/automation/label-orchestrator.js sync
```

### Issue: High Error Rate (> 1%)

**Symptom:** Metrics show error_rate > 0.01, workflow shows failures

**Cause:** Various - API issues, data corruption, or permission problems

**Resolution:**

```bash
# 1. Get detailed error information
cat .github/reports/audit-trail-latest.json | jq '.auditTrail[] | select(.error != null) | {issue, error, status}'

# 2. Identify error pattern
# Common errors:
#   "Invalid label name" → Check label exists
#   "GraphQL error" → Check API token validity
#   "Not Found" → Check issue numbers are valid

# 3. Address root cause:
#    a) If API issue: Wait for GitHub status to normalize
#    b) If token issue: Recreate token with correct scopes
#    c) If data issue: Check issue/label consistency

# 4. Rerun with verbose logging
node scripts/automation/label-orchestrator.js sync --verbose

# 5. Monitor error rate after fix
# Error rate should drop below 0.5% within next run
```

### Issue: Dashboard Showing "No Data"

**Symptom:** Monitoring dashboard empty or showing "No data"

**Cause:** Metrics not being collected or file missing

**Resolution:**

```bash
# 1. Check if metrics file exists
ls -la .github/reports/metrics-*.json | tail -5

# 2. If missing, check if workflow ran
gh workflow run monitoring-alerts.yml --repo lightspeedwp/.github

# 3. Verify metrics collection is enabled
gh workflow list --repo lightspeedwp/.github | grep "monitoring"

# If not found, metrics collection not set up (Phase 5.3 item)

# 4. Manually create metrics file for testing
echo '{
  "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
  "successRate": 0.995,
  "errorRate": 0.003,
  "avgDuration": 45,
  "apiCallsUsed": 250,
  "apiCallsRemaining": 4750
}' > .github/reports/metrics-latest.json

# 5. Refresh dashboard
```

---

## Incident Response

See [INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md) for detailed incident handling procedures.

**Quick Decision Tree:**

```
Problem detected?
  ├─ Error rate < 1%
  │  └─ Monitor + investigate
  ├─ Error rate 1-5%
  │  └─ Disable workflows + investigate
  └─ Error rate > 5%
     └─ Page on-call + rollback immediately
```

---

## Contact & Escalation

**On-Call Engineer:** [Slack @on-call](slack://open?team-id=TXXXXXX)  
**Alert Channel:** #dev-alerts  
**Incident Log:** [INCIDENT_LOG.md](./INCIDENT_LOG.md)  
**Runbook Updates:** Ask in #engineering or submit PR

---

## Related Documentation

- [INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md) — Detailed incident handling
- [INCIDENT_LOG.md](./INCIDENT_LOG.md) — Historical incident record
- [Phase 5.3 Project](../.github/projects/active/issue-maintenance-phase-5-3-production-readiness-2026-08-12/) — Full production readiness checklist
- [CHANGELOG.md](../../CHANGELOG.md) — Recent changes and versions

---

**Last Updated:** 2026-08-12  
**Version:** 1.0.0  
**Owner:** LightSpeed Engineering

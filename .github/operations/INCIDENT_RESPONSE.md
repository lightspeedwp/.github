# Incident Response Plan — Issue Maintenance System

**Document Version:** 1.0.0  
**Last Updated:** 2026-08-12  
**Owner:** LightSpeed Engineering Team  
**Contact:** [Slack #on-call](slack://open)

---

## Quick Reference

| Severity | Error Rate | Response Time | Actions |
|----------|-----------|----------------|---------|
| **🟢 Low** | < 0.5% | Next business day | Monitor + investigate |
| **🟡 Medium** | 0.5–1% | 2 hours | Investigate + log |
| **🟠 High** | 1–5% | 30 minutes | Disable workflows + investigate |
| **🔴 Critical** | > 5% | 5 minutes | Page on-call + rollback |

---

## Severity Levels

### 🟢 Low Severity (Error Rate < 0.5%)

**Examples:**

- Single isolated failure in non-critical operation
- Temporary API hiccup (single request failed)
- One or two labels not applied

**Action:**

1. Log the incident (see [Incident Log](#incident-logging))
2. Investigate root cause
3. Monitor for regression
4. Document lesson learned
5. No immediate mitigation needed

### 🟡 Medium Severity (Error Rate 0.5–1%)

**Examples:**

- 1–5% of label operations failing
- Intermittent API connectivity issues
- Permission errors on subset of issues

**Action:**

1. Page on-call engineer (if outside business hours)
2. Investigate root cause (15–30 min)
3. If clear fix: Apply fix + test
4. If unclear: Proceed to High severity response
5. Log all findings

### 🟠 High Severity (Error Rate 1–5%)

**Examples:**

- 5–20% of operations failing
- Consistent permission or API errors
- Performance degradation (> 2x baseline)

**Action:**

1. Immediate investigation (< 10 min)
2. Decision: Fix or Rollback?
   - **Clear fix available (< 30 min):** Apply fix + monitor
   - **Fix unclear or > 30 min:** Proceed to rollback
3. Disable workflows if still failing
4. Post incident notice to Slack
5. Escalate to team lead

### 🔴 Critical Severity (Error Rate > 5%)

**Examples:**

- 20%+ of operations failing
- Complete workflow failure
- Data corruption detected

**Action:**

1. Immediate rollback (< 5 min)
2. Page on-call engineer immediately
3. Post critical incident notice (#deployments)
4. Disable affected workflows
5. Parallel investigation + fix
6. Retest + redeployment

---

## Incident Response Procedures

### Critical Issue Detected (Error Rate > 5%)

**Timeline:** Respond within 5 minutes

#### Step 1: Alert & Notification (0 min)

**Automated Alert Triggered:**

```
Alert Details:
- Timestamp: 2026-08-12 10:30:00 UTC
- Severity: CRITICAL
- Error Rate: 7.2%
- Failed Operations: 23/317
- Root Cause: Unknown (requires investigation)
```

**Actions:**

```bash
# 1. Slack #on-call notification posted automatically
# Message: "@on-call 🚨 CRITICAL: Issue maintenance system error rate > 5%"

# 2. GitHub issue created automatically
gh issue create \
  --title "🚨 CRITICAL: Label sync failure - Error rate 7.2%" \
  --body "Error rate exceeded threshold. Immediate investigation required." \
  --label "type:incident,priority:critical"

# 3. Email sent to on-call (if configured)
```

#### Step 2: Immediate Mitigation (0-2 min)

**Disable workflows to prevent further damage:**

```bash
# 1. Disable workflows immediately
gh workflow disable meta-labels-sync.yml --repo lightspeedwp/.github
gh workflow disable label-audit-report.yml --repo lightspeedwp/.github

# 2. Verify disabled
gh workflow list --repo lightspeedwp/.github

# 3. Post incident status
# Slack #deployments: "⚠️ CRITICAL: Workflows disabled at [time] — investigating label sync failures"

echo "CRITICAL incident at $(date -u): Workflows disabled — investigating" >> .github/operations/INCIDENT_LOG.md
```

**Expected Result:** New failures stop occurring within 1 minute

#### Step 3: Investigation (2-5 min)

**Gather information to determine fix vs. rollback:**

```bash
# 1. Check recent errors
cat .github/reports/audit-trail-latest.json | jq '.auditTrail[-20:] | .[] | {issue, error, status}'

# 2. Identify error pattern
# Look for:
#   - All errors same type → points to root cause
#   - Mixed errors → suggests multiple issues
#   - Errors on specific issues → suggests data problem

# 3. Check GitHub status
# Is GitHub API having issues?
curl -s https://www.githubstatus.com/api/v2/status.json | jq '.status.description'

# 4. Check workflow logs
gh run list -w meta-labels-sync.yml -L 1 --json startedAt,conclusion,updatedAt | jq

# 5. Sample error messages
echo "Sample error: $(cat .github/reports/audit-trail-latest.json | jq '.auditTrail[-1].error')"

# Based on investigation:
# A) Clear fix identifiable → Fix + verify + redeploy (5-10 min)
# B) Fix unclear → Proceed to rollback
```

#### Step 4: Decision: Fix or Rollback (5 min)

**Decision Criteria:**

| Criteria | Fix | Rollback |
|----------|-----|----------|
| **Root cause clear?** | Yes | No |
| **Fix time estimate** | < 30 min | N/A |
| **Data corruption?** | No (data safe) | Yes (data at risk) |
| **Retry safe?** | Yes (idempotent) | Unsafe |

**Decision Tree:**

```bash
# Scenario A: Rate limit error detected
# → Cause: Clear (hitting API limit)
# → Fix: Wait for reset (1 hour) OR reduce batch size
# → Decision: WAIT or reduce batch size
# → Time: < 10 minutes
# → Action: FIX

# Scenario B: Permission denied on random issues
# → Cause: Unknown
# → Possible: Token rotation needed, data corruption, permission model change
# → Decision: UNKNOWN → ROLLBACK
# → Action: ROLLBACK

# Scenario C: GraphQL error on label creation
# → Cause: Likely API schema changed or label doesn't exist
# → Fix: Add label or update query
# → Time: < 15 minutes
# → Action: FIX

# If decision is ROLLBACK:
echo "Rollback decision at $(date -u)" >> .github/operations/INCIDENT_LOG.md
# Proceed to "Rollback Procedure" below

# If decision is FIX:
echo "Fix decision at $(date -u): [description]" >> .github/operations/INCIDENT_LOG.md
# Proceed to "Apply Fix & Verify" below
```

#### Step 5A: Apply Fix & Verify (5-15 min)

**Fix Example: Rate Limit Handling**

```bash
# 1. Identify the issue (e.g., rate limit approaching)
# 2. Apply fix to scripts or workflows
# 3. Test locally

# Example: Update batch size
# File: scripts/automation/label-orchestrator.js
# Change: const BATCH_SIZE = 100; → const BATCH_SIZE = 10;

# 4. Verify fix works
npm run test:integration -- --count 50

# 5. Re-enable workflows with fix
# Option A: Merge to develop + deploy
# Option B: Manually redeploy (if code change minor)

gh workflow enable meta-labels-sync.yml --repo lightspeedwp/.github

# 6. Monitor next run
gh run list -w meta-labels-sync.yml -L 1 --json conclusion,updatedAt

# 7. Check error rate drops
cat .github/reports/metrics-latest.json | jq '.errorRate'
# Expected: < 0.5%

# 8. Post resolution notice
# Slack #deployments: "✅ RESOLVED: Batch size reduced to prevent rate limiting — system restored at [time]"
```

#### Step 5B: Rollback Procedure (5-10 min)

**Safe rollback to previous state:**

```bash
# 1. Identify last known-good commit
git log --oneline | grep -i "phase 5" | head -1
# Example: abc1234 docs: Phase 5.1 — Integration Testing

# 2. Create rollback commit
CURRENT=$(git rev-parse HEAD)
ROLLBACK_TO="abc1234"
git revert $CURRENT --no-edit
git push origin develop

# 3. Restore previous audit state
ls -lt .github/reports/archive/audit-trail-*.json | head -1
LATEST_BACKUP=$(ls -t .github/reports/archive/audit-trail-*.json | head -1)
cp $LATEST_BACKUP .github/reports/audit-trail-latest.json

# 4. Re-enable workflows with rollback version
gh workflow enable meta-labels-sync.yml --repo lightspeedwp/.github
gh workflow enable label-audit-report.yml --repo lightspeedwp/.github

# 5. Run manual test to verify
node scripts/automation/label-orchestrator.js audit --output ./test-audit.json
cat test-audit.json | jq '.summary'

# 6. Verify success
# Expected: Audit completes without errors

# 7. Post rollback notice
# Slack #deployments: "⚠️ ROLLED BACK: Previous version restored — investigating cause — ETA for fix [time]"

# 8. Log rollback
echo "CRITICAL: Rollback executed at $(date -u) due to [reason]. Commit: $CURRENT → $ROLLBACK_TO" >> .github/operations/INCIDENT_LOG.md
```

#### Step 6: Post-Incident (Next 24 Hours)

**Follow-up actions:**

```bash
# 1. Root cause analysis (< 2 hours)
#    Deep dive: What caused the error?
#    Prevention: How do we prevent recurrence?

# 2. Fix implementation (if not already done)
#    Apply permanent fix
#    Test thoroughly
#    Deploy to production

# 3. Runbook update
#    Add new error pattern to troubleshooting guide
#    Update decision tree if needed
#    Add workaround if discovered

# 4. Team retrospective (< 24 hours)
#    What went wrong?
#    What went right?
#    How do we improve?

# 5. Post-mortem documentation
cat > .github/operations/POSTMORTEM-$(date +%Y%m%d-%H%M%S).md << 'EOF'
# Post-Incident Postmortem

## Incident Details
- **Date:** 2026-08-12 10:30 UTC
- **Duration:** 15 minutes
- **Severity:** CRITICAL
- **Impact:** 23 failed label operations (7.2% error rate)

## Root Cause
[Detailed explanation of what caused the incident]

## Timeline
- 10:30 UTC: Alert triggered (error rate > 5%)
- 10:31 UTC: Workflows disabled
- 10:35 UTC: Cause identified
- 10:45 UTC: Rollback completed
- 11:00 UTC: System restored

## Lessons Learned
1. [Something to improve]
2. [Process change needed]
3. [Monitoring enhancement]

## Action Items
- [ ] Apply permanent fix
- [ ] Update runbook with this scenario
- [ ] Improve monitoring for early detection
- [ ] Team training (if process/knowledge gap)

## Owner: [Name]  
Date: 2026-08-12
EOF

# 6. Close incident issue
gh issue close <issue-number> --reason resolved
```

---

## Incident Logging

**Log Location:** `.github/operations/INCIDENT_LOG.md`

**Log Format (append to file):**

```markdown
## [Date] - [Incident Title]

**Severity:** 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low  
**Duration:** HH:MM  
**Root Cause:** [Description]  
**Resolution:** [Fix or Rollback]  
**Owner:** [Name]  

### Timeline
- HH:MM - Event description
- HH:MM - Action taken

### Lessons Learned
1. Point 1
2. Point 2

---
```

**Example Entry:**

```markdown
## 2026-08-12 - Label Sync Rate Limit Exceeded

**Severity:** 🟠 High  
**Duration:** 12 minutes  
**Root Cause:** Batch size too large (100 issues) causing API rate limit  
**Resolution:** Reduced batch size to 10, re-enabled workflows  
**Owner:** Ash Shaw  

### Timeline
- 10:30 - Alert triggered (error rate 2.3%)
- 10:32 - Cause identified: Rate limit warning in logs
- 10:35 - Batch size reduced and tested locally
- 10:42 - Workflows re-enabled with fix

### Lessons Learned
1. Implement pre-flight rate limit check before running sync
2. Add adaptive batch sizing based on remaining quota
3. Improve alert message to include rate limit details

---
```

---

## Escalation Path

**Escalation Trigger:** Incident unresolved after 30 minutes

```
On-Call Engineer
    ↓ (unresolved after 15 min)
Team Lead (Slack @engineering-lead)
    ↓ (unresolved after 30 min)
Engineering Manager
    ↓ (unresolved after 1 hour)
Director of Engineering
```

**Escalation Actions:**

```bash
# Escalate to Team Lead
# Message: "@engineering-lead 🚨 Critical incident ongoing — [issue]. Page needed."

# Escalate to Manager
# Page manager through PagerDuty (if configured)
# Email + phone call if incident > 1 hour unresolved
```

---

## Recovery Time Objectives (RTO)

**Target Resolution Times:**

| Severity | RTO | Example |
|----------|-----|---------|
| **Low** | < 24 hours | 1 label not applied |
| **Medium** | < 4 hours | 5% error rate |
| **High** | < 1 hour | 10% error rate |
| **Critical** | < 15 min | > 20% error rate |

---

## Testing Incident Response

**Monthly Incident Response Drill:**

```bash
#!/bin/bash
# Run on first Monday of each month

echo "🧪 Incident Response Drill — Testing Procedures"
echo ""

# 1. Simulate critical error (without causing real failures)
echo "Simulating critical error scenario..."

# 2. Walk through response checklist
echo "Testing: Notification → Investigation → Rollback"

# 3. Verify runbook accuracy
bash .github/operations/RUNBOOK.md --validate

# 4. Test rollback procedure
# (in test environment, not production)

# 5. Review incident log
echo "Recent incidents: $(grep "^##" .github/operations/INCIDENT_LOG.md | wc -l)"

# 6. Post drill summary
echo "✅ Incident response drill complete"
```

---

## Related Documents

- [RUNBOOK.md](./RUNBOOK.md) — Daily operations procedures
- [INCIDENT_LOG.md](./INCIDENT_LOG.md) — Historical incident record
- [Phase 5.3 Project](../.github/projects/active/issue-maintenance-phase-5-3-production-readiness-2026-08-12/) — Full production readiness checklist

---

**Last Updated:** 2026-08-12  
**Version:** 1.0.0  
**Owner:** LightSpeed Engineering

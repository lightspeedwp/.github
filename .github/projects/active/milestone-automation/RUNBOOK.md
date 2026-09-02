---
file_type: runbook
title: Milestone Automation Operational Runbook
description: Procedures for operational tasks and manual interventions
created_date: 2026-08-30
last_updated: 2026-08-30
---

# Operational Runbook — Milestone Automation

## Standard Operating Procedures

### Procedure 1: Monitor Workflow Execution

**Frequency:** Daily (morning check-in)

**Steps:**

1. **Navigate to workflow runs:**
   ```
   https://github.com/lightspeedwp/.github/actions/workflows/milestone-distribution.yml
   ```

2. **Check recent runs (last 7 days):**
   - ✅ All green? Continue to summary check
   - ⚠️ Orange? Click to investigate
   - ❌ Red? Escalate per troubleshooting guide

3. **Review workflow summary:**
   ```bash
   # Check run stats
   - Successful runs: ___ / ___
   - Failed runs: ___
   - Average duration: ___ sec
   ```

4. **Document findings:**
   - Note date and status
   - Record any errors in issue tracking
   - Update team in daily standup

**Success Criteria:**
- >95% success rate (>19 of 20 runs pass)
- <5s average run time
- Zero API rate limit errors

**Escalation:**
- If <95% success: Create issue, tag @platform-team
- If >10s run time: Investigate performance, check issue count

---

### Procedure 2: Manually Allocate Unallocated Issues

**When to use:** Workflow failed or needs immediate attention

**Prerequisites:**
- Node.js v20+ installed
- GitHub token with issues:write permission
- Script: `scripts/automation/distribute-unallocated-milestones.js`

**Steps:**

1. **Clone repository (if needed):**
   ```bash
   git clone https://github.com/lightspeedwp/.github.git
   cd .github
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   ```

3. **Set up environment:**
   ```bash
   export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
   export GITHUB_REPOSITORY="lightspeedwp/.github"
   export LOG_LEVEL="INFO"
   ```

4. **Run in dry-run mode first:**
   ```bash
   node scripts/automation/distribute-unallocated-milestones.js \
     --dry-run \
     --batch-size 25
   ```

   **Expected output:**
   ```
   INFO: Starting milestone distribution (DRY RUN)
   INFO: Found 45 unallocated issues
   INFO: Active milestone: v1.1 (due: 2026-09-30)
   INFO: [DRY RUN] Would update issue #1234 to v1.1
   ...
   INFO: Completed. Would update 45 issues. (3000ms)
   ```

5. **Review output carefully:**
   - Is milestone correct? ✓
   - Count looks reasonable? ✓
   - Any errors? ✓

6. **Execute (remove --dry-run):**
   ```bash
   node scripts/automation/distribute-unallocated-milestones.js \
     --batch-size 25
   ```

7. **Verify results:**
   ```bash
   # Check updated issues
   curl -s -H "Authorization: token $GITHUB_TOKEN" \
     "https://api.github.com/repos/lightspeedwp/.github/issues?milestone=v1.1&state=closed&per_page=100" \
     | jq '.[] | {number, title, milestone: .milestone.title}' | head -20
   ```

**Rollback (if needed):**
```bash
# Revert to previous milestone (if mistakenly updated)
node scripts/automation/reassign-v1-to-v1-1.js \
  --from v1.1 \
  --to v1 \
  --dry-run
```

**Documentation:**
- Record timestamp of manual run
- Note number of issues updated
- Post summary comment in related issue
- Update incident log if needed

---

### Procedure 3: Migrate Milestones (v1 → v1.1)

**When to use:** Release cycle transition

**Prerequisites:**
- Both milestone versions exist (v1 open, v1.1 open)
- Verify no active PRs tied to v1
- Schedule during off-peak hours

**Steps:**

1. **Pre-flight check:**
   ```bash
   # Count issues per milestone
   curl -s -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/lightspeedwp/.github/milestones \
     | jq '.[] | select(.title | test("v1")) | {title, open_issues, closed_issues}'
   ```

2. **Plan communication:**
   - Notify team in #releases Slack channel
   - Schedule 15-min maintenance window
   - Alert on-call engineer

3. **Backup data (optional):**
   ```bash
   # Export current milestone state
   curl -s -H "Authorization: token $GITHUB_TOKEN" \
     "https://api.github.com/repos/lightspeedwp/.github/issues?milestone=v1&state=all" \
     > /tmp/v1-backup-$(date +%s).json
   ```

4. **Run migration (dry-run first):**
   ```bash
   node scripts/automation/reassign-v1-to-v1-1.js \
     --from v1 \
     --to v1.1 \
     --dry-run
   ```

5. **Execute migration:**
   ```bash
   node scripts/automation/reassign-v1-to-v1-1.js \
     --from v1 \
     --to v1.1
   ```

6. **Verify migration:**
   ```bash
   # Check v1 is now empty
   curl -s -H "Authorization: token $GITHUB_TOKEN" \
     "https://api.github.com/repos/lightspeedwp/.github/milestones" \
     | jq '.[] | select(.title == "v1") | .open_issues'
   # Should return: 0
   ```

7. **Post-migration cleanup:**
   - Close v1 milestone (if not keeping for reference)
   - Update team with completion status
   - Document any issues encountered

**Rollback (if needed):**
```bash
# Migrate back (only if needed)
node scripts/automation/reassign-v1-to-v1-1.js \
  --from v1.1 \
  --to v1
```

---

### Procedure 4: Handle API Rate Limit

**When to use:** Workflow hits rate limit or quota critical

**Steps:**

1. **Check current rate limit:**
   ```bash
   curl -s -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/rate_limit | jq '.'
   ```

   **Example output:**
   ```json
   {
     "resources": {
       "core": {
         "limit": 5000,
         "remaining": 50,      // ⚠️ CRITICAL
         "reset": 1693395600   // Resets in 45 min
       }
     }
   }
   ```

2. **Assess situation:**
   - If remaining > 500: Normal operation, continue
   - If 100 < remaining ≤ 500: Caution, limit batch runs
   - If remaining ≤ 100: Critical, stop new runs

3. **If quota exceeded:**
   ```bash
   # Calculate wait time
   RESET_TIME=$(date -d @1693395600 '+%Y-%m-%d %H:%M:%S')
   echo "Rate limit resets at: $RESET_TIME"
   
   # Wait for reset
   sleep 3600  # 1 hour
   ```

4. **Optimize for future:**
   - Reduce batch size in workflow: `BATCH_SIZE: 25`
   - Stagger workflow runs
   - Use scheduled trigger instead of event-driven
   - Monitor more frequently (add alert at <1000)

**Prevention:**
- Set up rate limit alert in GitHub Actions
- Document quota expectations (5000/hour for API)
- Review other workflows competing for quota

---

### Procedure 5: Emergency Revert

**When to use:** Catastrophic failure, widespread incorrect allocations

**Prerequisites:**
- Backup of previous state (from monitoring)
- Admin access to repository

**Steps:**

1. **Stop all workflow runs:**
   ```bash
   # Disable workflow in GitHub UI
   # Settings > Actions > Workflows > milestone-distribution.yml > Disable
   ```

2. **Assess damage:**
   ```bash
   # Count incorrectly allocated issues
   curl -s -H "Authorization: token $GITHUB_TOKEN" \
     "https://api.github.com/repos/lightspeedwp/.github/issues?milestone=WRONG_MILESTONE" \
     | jq length
   ```

3. **Restore from backup (if available):**
   ```bash
   # Manual restoration using backup
   # Check /tmp/v1-backup-*.json files
   ```

4. **Manual correction:**
   ```bash
   # Use reassign script to fix
   node scripts/automation/reassign-v1-to-v1-1.js \
     --from WRONG_MILESTONE \
     --to CORRECT_MILESTONE
   ```

5. **Investigate root cause:**
   - Review workflow logs
   - Check script code for bugs
   - Verify API responses
   - Document findings in issue

6. **Re-enable with fixes:**
   - Apply fixes to script
   - Create PR for review
   - Merge to develop
   - Manually re-run (not auto-trigger)
   - Monitor closely for 24 hours

7. **Post-incident:**
   - Schedule post-mortem meeting
   - Document lessons learned
   - Update monitoring/alerting
   - Add test to prevent recurrence

---

## Checklist Templates

### Daily Health Check (5 min)

```
Date: __________
Time: __________

☐ Workflow runs: Last 7 days
  ☐ Count successful: ___
  ☐ Count failed: ___
  ☐ Success rate: ___% (target: 95%+)

☐ API Rate Limit Status
  ☐ Remaining quota: ___/5000
  ☐ Next reset: __________

☐ Issues Processed
  ☐ Unallocated (open): ___
  ☐ v1.1 (in milestone): ___

☐ Alerts/Errors
  ☐ Any timeouts? Yes / No
  ☐ Any permission errors? Yes / No
  ☐ Any API errors? Yes / No

Status: ✅ Healthy / ⚠️ Caution / ❌ Critical

Notes:
_________________________________
```

### Weekly Maintenance (30 min)

```
Week of: __________

Performance:
☐ Average workflow time: ___ sec (target: <5 sec)
☐ P50 latency: ___ sec
☐ P95 latency: ___ sec
☐ Max latency: ___ sec

Reliability:
☐ MTBF (mean time between failures): ___ days
☐ MTTR (mean time to recover): ___ min
☐ Incidents this week: ___

Capacity:
☐ Largest single run (issue count): ___
☐ Peak concurrent runs: ___
☐ API quota utilization: ___% (target: <80%)

Action Items:
☐ ___________
☐ ___________
☐ ___________

Notes:
_________________________________
```

### Monthly Review (1 hour)

```
Month: __________

Metrics Review:
☐ Total issues processed: ___
☐ Total workflow executions: ___
☐ Success rate: ___% (target: 99%+)
☐ Average processing time: ___ sec

Incidents:
☐ Count: ___
☐ Severity breakdown:
  ☐ Critical: ___
  ☐ High: ___
  ☐ Medium: ___

Improvements Made:
☐ ___________
☐ ___________

Planned Enhancements:
☐ ___________
☐ ___________

Risks Identified:
☐ ___________
☐ ___________

Next Month Priorities:
1. ___________
2. ___________
3. ___________
```

---

## Contact & Escalation

| Issue Type | Contact | Response Time |
|-----------|---------|---|
| **Workflow failure** | @platform-team | <30 min |
| **Rate limit issues** | @devops-team | <1 hour |
| **Script bugs** | @maintainers | <4 hours |
| **Documentation** | Create issue | Next sprint |

**Slack Channel:** #milestone-automation  
**On-call:** Check pagerduty rotation  
**Escalation:** See TROUBLESHOOTING.md

---

## Log Locations

| Log | Location | How to Access |
|-----|----------|---|
| Workflow logs | GitHub Actions UI | Actions > milestone-distribution.yml > Run ID |
| Step summary | GitHub Actions UI | Run > workflow-step > Step Summary |
| Local script logs | Console output | Run manually, capture stdout |
| Error tracking | GitHub Issues | Issues tagged `type:bug`, `area:automation` |

---

## Quick Commands Reference

```bash
# Check workflow status
gh run list -W milestone-distribution.yml -L 5

# Get latest run logs
gh run view $(gh run list -W milestone-distribution.yml --limit 1 -q .[0].databaseId) --log

# List unallocated issues
gh issue list --milestone none -s open -L 20

# Check milestones
gh milestone list

# Trigger manual workflow run (if available)
gh workflow run milestone-distribution.yml
```

---

**Document Owner:** lightspeedwp/maintainers  
**Last Updated:** 2026-08-30  
**For Questions:** Contact @platform-team on Slack

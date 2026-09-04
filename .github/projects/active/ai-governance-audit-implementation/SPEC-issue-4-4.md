---
openspec_version: "1.0"
type: "issue"
issue_type: "feature"
title: "feat/automation: Set up governance compliance reporting and metrics dashboard"
labels: ["type:feat", "area:automation", "area:governance", "priority:normal"]
milestone: "v1.2"
assignee: null
linked_issue: null
---

# Set Up Governance Compliance Reporting and Metrics Dashboard

## Problem

Phase 3 implemented governance automation (validation, routing, normalization), but **there is no visibility into compliance metrics**:

- No tracking of branch naming compliance rates
- No visibility into how many PRs use correct vs incorrect templates
- No measurement of title normalization success
- No automated reporting mechanism
- No dashboard for leadership visibility

**Impact:** Can't measure governance effectiveness. Can't identify problem areas. No data-driven decisions.

## Solution

Create governance compliance reporting and metrics dashboard by:

1. **Design metrics framework** — `docs/GOVERNANCE_METRICS_FRAMEWORK.md`:
   - Define key metrics (compliance rate, exception rate, override rate, etc.)
   - Define calculation methods for each metric
   - Define acceptable thresholds (e.g., 95% compliance target)
   - Define reporting cadence (daily collection, weekly/monthly reports)
   - Define data sources (GitHub API, workflow logs, issue/PR data)

2. **Create automated data collection** — GitHub Actions workflow:
   - **Workflow:** `.github/workflows/collect-governance-metrics.yml`
   - **Triggers:** Daily (scheduled via cron)
   - **Collects:**
     - Count of PRs created in past 24h
     - Count of PRs from correctly-named branches
     - Count of PRs from incorrectly-named branches (claude/, copilot/, etc.)
     - Count of PRs with correct templates
     - Count of PR titles normalized
     - Count of exceptions/overrides approved
   - **Stores data** in a structured format (JSON, CSV, or database)
   - **Pushes to branch** `metrics/governance-data` for persistence

3. **Create reporting mechanism** — Choose one or both:
   - **Option A: GitHub Project Board** — Create dedicated GitHub Project for metrics:
     - Daily metrics card showing current compliance rate
     - Historical trend (7-day, 30-day averages)
     - Breakdown by repository
     - Exception/override list with approval status
   - **Option B: GitHub Actions Workflow Output** — Create summary report:
     - Daily report posted as workflow artifact
     - Weekly summary comment on governance policy PR
     - Monthly full report in project documentation

4. **Create metrics dashboard** — Public-facing documentation:
   - **File:** `docs/GOVERNANCE_METRICS_DASHBOARD.md` (or GitHub Project)
   - **Displays:**
     - Current compliance rate (%)
     - 7-day trend (chart or sparkline)
     - 30-day trend (chart)
     - Breakdown by repository (table)
     - Breakdown by branch type (chart)
     - Recent exceptions/overrides (list)
     - Impact metrics (manual workarounds prevented, time saved)

5. **Create automated alerts** — Optional but recommended:
   - If compliance drops below threshold (e.g., <90%), notify via:
     - GitHub Issue comment in governance policy repo
     - Slack notification (if integrated)
   - If exception/override rate exceeds threshold, notify leadership

6. **Create monthly reporting** — `docs/GOVERNANCE_MONTHLY_REPORTS/`:
   - **File naming:** `2026-09-GOVERNANCE_REPORT.md`, `2026-10-GOVERNANCE_REPORT.md`, etc.
   - **Contents:**
     - Monthly compliance summary (average %)
     - Trends and analysis (improving? declining?)
     - Repository-specific findings
     - Exception/override summary
     - Recommendations for improvement
     - Team acknowledgment checklist

7. **Create reporting SLA** — Documentation:
   - Daily metrics collected by 2 AM UTC
   - Weekly summary published every Monday
   - Monthly report published on 1st of each month
   - Dashboard updated continuously (within 1 hour of collection)
   - Alerts sent within 30 minutes of threshold breach

## Implementation Notes

- Use GitHub API to query PR/issue data
- Parse workflow logs for normalization/validation results
- Store metrics data in Git (metrics branch) for historical tracking
- Ensure metrics are privacy-respecting (no PII)
- Coordinate with Issue 4.2 (Policy) to establish target thresholds
- Plan for future expansion (per-team metrics, per-individual metrics, etc.)

## Definition of Done

- [ ] `docs/GOVERNANCE_METRICS_FRAMEWORK.md` created
- [ ] `.github/workflows/collect-governance-metrics.yml` created
- [ ] Daily data collection runs without errors
- [ ] GitHub Project dashboard OR workflow reporting created
- [ ] `docs/GOVERNANCE_METRICS_DASHBOARD.md` published
- [ ] Automated alerts configured (if chosen)
- [ ] Monthly reporting structure created
- [ ] First monthly report published
- [ ] Dashboard accessible to all team members
- [ ] SLA documented and communicated
- [ ] Workflow logs show successful collection
- [ ] PR merged

## Test Scenarios

1. **Test data collection:**
   - Run metrics collection workflow manually
   - Verify all metrics calculated correctly
   - Verify data stored in structured format

2. **Test dashboard:**
   - Load dashboard page
   - Verify metrics displayed correctly
   - Verify links to detailed reports work

3. **Test alerts:**
   - Artificially trigger compliance drop below threshold
   - Verify alert notification sent
   - Verify alert contains correct data

4. **Test monthly report:**
   - Generate first monthly report
   - Verify all sections present
   - Verify data accuracy

## Related Issues

- Issue 4.2 — Establish policy (dependency: policy defines metrics/thresholds)
- Issue 4.5 — Exceptions & overrides (dependency: overrides tracked in metrics)
- Issue 4.1 — Migrate governance (depends on metrics for adoption tracking)

## Related Documentation

- `docs/ORG_GOVERNANCE_POLICY.md` — Policy and target metrics
- `docs/GOVERNANCE_METRICS_FRAMEWORK.md` — Metrics calculation methods
- `.github/workflows/validate-branch-names.yml` — Data source
- `.github/workflows/normalize-pr-titles.yml` — Data source

## Success Criteria

- ✅ Dashboard live and updating daily
- ✅ Compliance rate tracked and reported
- ✅ >95% compliance achieved
- ✅ Exception/override rate <5%
- ✅ Monthly reports published consistently
- ✅ <5 manual metric requests per week
- ✅ Leadership has visibility into governance effectiveness

## Effort Estimate

**4-5 hours** — Workflow creation, dashboard setup, reporting structure

## Timeline

**Week 2-3 of Phase 4** — Parallel work (not critical path), depends on Issue 4.2 for thresholds

---

**OpenSpec Document Version:** 1.0  
**Created:** 2026-09-03  
**Phase:** 4 (Governance Deployment)  
**Status:** Draft

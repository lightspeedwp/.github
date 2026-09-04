---
type: workflow-analysis
issue: 2352
title: GitHub Actions Workflows — Verification and Integration Planning
date: 2026-09-03
status: in-progress
---

# GitHub Actions Workflows — Verification and Integration Planning

**Status:** 🔍 Analysis Complete  
**Date:** 2026-09-03  
**Related Issues:** #1786 (audit-label-coverage skill), #2352 (PR Labeling Enforcement Initiative)

---

## Executive Summary

Analysis of existing GitHub Actions workflows related to label auditing and governance identified:

- **7 workflows** related to labeling and auditing
- **1 major gap:** Existing `label-audit-report.yml` uses legacy scripts and doesn't integrate the new `audit-label-coverage` skill
- **3 integration opportunities** to modernize workflows with the new skill
- **5 issues identified** that need planning (not blocking, but should be addressed)

---

## Existing Workflows Analyzed

### Labeling & Audit Workflows

| File | Purpose | Status | Issues |
|------|---------|--------|--------|
| `label-audit-report.yml` | Monthly/manual label audit reports | ⚠️ Legacy | Gap: doesn't use audit-label-coverage skill |
| `issue-labeling-automation.yml` | Auto-label issues on creation | ✅ Current | No issues identified |
| `labeling-governance.yml` | Enforce label requirements on PRs | ✅ Current | Suggestion: integrate with skill for enhanced reporting |
| `validate-issue-labels.yml` | Validate issue labels | ⚠️ Partial | Uses basic validation; could use skill's label family validation |
| `labeling.yml` | Label management and cleanup | ✅ Current | No issues identified |
| `issue-health-audit.yml` | Track issue health metrics | ✅ Current | Separate concern (not label-focused) |
| `remediate-bare-labels.yml` | Auto-fix non-prefixed labels | ✅ Current | Works as designed; complements skill |

### OpenSpec-Related Workflows

| File | Purpose | Status | Related |
|------|---------|--------|---------|
| `openspec-sync-labels.yml` | Sync labels from OpenSpec | ✅ Current | Integration point with skill |
| `openspec-validate-labels.yml` | Validate OpenSpec labels | ✅ Current | Integration point with skill |

---

## Issues Identified

### 🔴 Issue 1: Legacy Audit Workflow (HIGH PRIORITY)

**File:** `.github/workflows/label-audit-report.yml`  
**Problem:** Uses legacy scripts (`review-meta-labels.js`, `review-status-labels.js`) instead of the new `audit-label-coverage` skill.

**Impact:**
- Doesn't use consistent label family validation
- Missing family-level coverage metrics
- No JSON report generation for tooling integration
- Doesn't track top missing/suggested labels
- No edge case handling for rate limiting

**Current Behavior:**
```yaml
- name: Generate meta label audit (scheduled)
  run: node scripts/automation/review-meta-labels.js \
    --verbose \
    --format markdown \
    -o .github/reports/audits/meta-labels-audit-$(date +%Y-%m-%d).md
```

**Proposed Solution:**
Replace legacy scripts with audit-label-coverage skill:
```yaml
- name: Audit label coverage
  run: |
    npm install
    node skills/audit-label-coverage/index.js \
      --state open \
      --format all \
      --output .github/reports/audits/
```

**Related Enhancement Issue:** #2658 (Skill integration examples)

---

### 🟡 Issue 2: Validation Workflow Missing Family Checks (MEDIUM PRIORITY)

**File:** `.github/workflows/validate-issue-labels.yml`  
**Problem:** Uses basic label validation; doesn't check for required label families (`type:*`, `status:*`, `priority:*`, `area:*`).

**Impact:**
- Can't enforce that each issue has required families
- No family-level coverage reporting
- Users don't get recommendations for missing families

**Current Behavior:**
Basic label existence checks, not family-based.

**Proposed Solution:**
Integrate audit-label-coverage skill logic for validation:
1. Check each issue has required families
2. Report missing families in PR review comments
3. Suggest appropriate labels based on issue type

**Related Enhancement Issue:** #2658 (Integration examples)

---

### 🟡 Issue 3: No Integration with OpenSpec Progression Labels (MEDIUM PRIORITY)

**File:** `openspec-sync-labels.yml`, `openspec-validate-labels.yml`  
**Problem:** OpenSpec workflows don't integrate with audit-label-coverage skill's tracking capabilities.

**Impact:**
- No visibility into OpenSpec label coverage across repository
- Audit reports don't include OpenSpec metrics
- Can't track progression label compliance

**Proposed Solution:**
Extend audit-label-coverage skill to support optional label families:
1. Add `openspec:*` as tracked optional family
2. Include OpenSpec coverage in audit reports
3. Create separate metrics dashboard for OpenSpec compliance

---

### 🟡 Issue 4: No Workflow for Per-PR Label Audit Comments (MEDIUM PRIORITY)

**Problem:** No workflow to comment on PRs with label recommendations before merge.

**Impact:**
- No real-time feedback to contributors
- Labels not validated until after merge
- Inconsistent label application across PRs

**Proposed Solution:**
Create new workflow (suggested in #2658):
- Trigger on PR creation/update
- Use audit-label-coverage skill to check PR labels
- Comment with recommendations if labels missing
- Block merge if critical families missing (optional gate)

**Related Enhancement Issue:** #2658 (GitHub Actions workflow examples)

---

### 🟡 Issue 5: Audit Report Distribution Not Automated (LOW PRIORITY)

**File:** `label-audit-report.yml`  
**Problem:** Generates reports but doesn't distribute them (no GitHub issue creation, no Slack notification, no email digest).

**Impact:**
- Reports sit in artifacts without visibility
- No stakeholder awareness of label coverage metrics
- Hard to track trends over time

**Proposed Solution:**
Extend workflow to:
1. Create GitHub issue with audit results (via `github-script`)
2. Post Slack notification with summary (if Slack integration available)
3. Add timestamp to reports for trend tracking

---

## Planning Summary

### Immediate Actions (High Priority)

| Task | Effort | Owner | Status | Issue |
|------|--------|-------|--------|-------|
| Update label-audit-report.yml to use skill | 2-3h | DevOps | Planning | TBD |
| Create integration examples (#2658) | 3-4h | DevOps | Planned | #2658 |
| Document workflow integration guide | 2h | Docs | Pending | #2658 |

### Follow-Up Actions (Medium Priority)

| Task | Effort | Owner | Status | Issue |
|------|--------|-------|--------|-------|
| Enhance validate-issue-labels.yml | 2-3h | DevOps | Backlog | TBD |
| Create PR review audit workflow | 2-3h | DevOps | Backlog | #2658 |
| Integrate OpenSpec label tracking | 3-4h | DevOps | Backlog | TBD |
| Add report distribution | 1-2h | DevOps | Backlog | TBD |

### Future Enhancements (Low Priority)

- [ ] Trend tracking dashboard
- [ ] Compliance scoring (A-F grades)
- [ ] Label conflict detection
- [ ] Slack integration for real-time alerts
- [ ] Email digests of audit results

---

## Workflow Integration Roadmap

### Phase 1: Modernize Legacy Workflows (This Week)

1. Update `label-audit-report.yml` to use audit-label-coverage skill
2. Create integration examples and documentation (#2658)
3. Test against production repository (#2659)

### Phase 2: Enhance Real-Time Feedback (Next Week)

1. Create PR review audit workflow
2. Enhance `validate-issue-labels.yml` with family checks
3. Add report distribution (GitHub issues, Slack)

### Phase 3: Advanced Tracking (Future)

1. Integrate OpenSpec label metrics
2. Implement trend tracking
3. Create compliance dashboard

---

## Workflow Recommendations

### For Issue #2658 (Integration Examples)

Provide three complete workflow examples:

1. **Weekly Audit** (uses audit-label-coverage skill)
   ```yaml
   name: Weekly Label Coverage Audit
   on:
     schedule:
       - cron: '0 2 * * 1' # Monday 2 AM UTC
     workflow_dispatch:
   
   jobs:
     audit:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
         - run: npm ci
         - run: node skills/audit-label-coverage/index.js \
             --state open \
             --format all \
             --output ./audit-results
         - name: Create issue with results
           uses: actions/github-script@v7
           with:
             script: |
               const fs = require('fs');
               const report = fs.readFileSync('./audit-results/audit-report.md', 'utf-8');
               await github.rest.issues.create({
                 owner: context.repo.owner,
                 repo: context.repo.repo,
                 title: `Weekly Label Coverage Audit (${new Date().toLocaleDateString()})`,
                 body: report,
                 labels: ['type:audit', 'area:labels']
               });
   ```

2. **PR Review Audit** (on PR events)
   - Check PR labels against requirements
   - Comment with recommendations
   - Optional merge blocking

3. **Manual Audit** (workflow_dispatch)
   - Run on-demand
   - Configurable format and options
   - Output to job summary

---

## Success Criteria

- ✅ All existing workflows continue to function
- ✅ New workflows use audit-label-coverage skill
- ✅ Integration examples document common use cases
- ✅ Audit reports include family-level metrics
- ✅ No duplicate reporting or conflicts
- ✅ Performance is acceptable (runs complete in <5min)

---

## Next Steps

1. **Create Issue #2658** — ✅ Complete
   - Skill integration examples (GitHub Actions workflows)
   - Link to this analysis
   - Assign to DevOps team

2. **Create Issue #2659** — ✅ Complete
   - Real repository testing
   - Run skill against actual repository
   - Validate performance and accuracy

3. **Update label-audit-report.yml** — Pending Issue #2658
   - Integrate audit-label-coverage skill
   - Add JSON report output
   - Enhance report distribution

4. **Document findings** — This document
   - Archive in active project folder
   - Link from GitHub issues
   - Share with team

---

## Related Documents

- **Active Project:** `.github/projects/active/pr-labeling-enforcement-issue-2352-plan/`
- **Skill Documentation:** `skills/audit-label-coverage/SKILL.md`
- **Completion Status:** `ISSUE_1786_COMPLETION_STATUS.md` (this folder)
- **GitHub Issue #2658:** Skill integration examples (pending)
- **GitHub Issue #2659:** Real repository testing (pending)

---

**Analysis Date:** 2026-09-03  
**Next Review:** After #2658 and #2659 completion

---

**Prepared by:** Claude Code  
**Status:** Ready for Review

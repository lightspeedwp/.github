---
title: "Runbook: Health Score Drop"
description: "Recovery steps for significant health score degradation"
status: "active"
severity: "medium"
created_date: "2026-08-21"
last_updated: "2026-08-21"
---

# Runbook: Health Score Drop

## Problem Statement

Repository health score drops significantly or below warning threshold (60).

**Symptoms:**

- Health score < 80 (warning level)
- Health score < 60 (critical level)
- Score dropped 20+ points from previous week
- Specific health components degraded

**Impact:**

- Team may need to prioritize improvements
- Indicates quality or velocity issues
- May impact downstream systems relying on health score

---

## Diagnostic Steps

### Step 1: Get Current Health Score

1. Check latest metrics report: `.github/reports/metrics/weekly-summary-latest.md`
2. Find health score section
3. Note the numeric score and components:
   - Documentation coverage
   - Issue response time
   - PR review time
   - Code quality metrics

### Step 2: Compare to Previous Week

1. Check previous week's report: `.github/reports/metrics/weekly/`
2. Compare score trends:
   - Flat (normal variation)
   - Gradual decline (trend)
   - Sudden drop (incident)

### Step 3: Identify Affected Components

1. In metrics report, find section "Health Components"
2. List components that decreased:
   - Documentation (% of files with frontmatter)
   - Issues (average response time)
   - PRs (average review time)
   - Code quality (test coverage, linting pass rate)

### Step 4: Correlate with Activity

1. Check recent activity:

   ```bash
   git log --oneline --since="1 week ago" | wc -l
   ```

   - Spike in commits/PRs?
   - New team member onboarded?
   - Major feature work started?

2. Check open issues/PRs:
   - Increase in open items?
   - Issues/PRs stale (not updated in days)?

---

## Solutions

### Solution A: Documentation Gap (Most Common)

**Diagnosis:** "Documentation coverage" component dropped

**Recovery Steps:**

1. **Identify files missing frontmatter:**

   ```bash
   npm run validate:frontmatter 2>&1 | grep "missing"
   ```

2. **Count affected files:**
   - If < 5 files: Add frontmatter to each file
   - If 5-20 files: Use script to bulk add
   - If > 20 files: Investigate root cause

3. **Add frontmatter to files:**

   ```bash
   # For single file:
   npm run add-frontmatter path/to/file.md
   
   # For multiple files:
   npm run add-frontmatter -- --glob "path/**/*.md"
   ```

4. **Verify improvement:**
   - Run metrics locally: `npm run metrics:ci`
   - Check documentation score increased
   - Commit changes

### Solution B: Issue Response Time Increase

**Diagnosis:** Average time to respond to new issues increased

**Recovery Steps:**

1. **Identify stale issues:**

   ```bash
   # Issues open > 7 days without response
   npm run scripts/maintenance/find-stale-issues.js --days 7
   ```

2. **Triage stale issues:**
   - Review each stale issue
   - Add labels and assignment
   - Provide initial response/question
   - Set expectation for resolution

3. **Review issue process:**
   - Are issues being created faster than team can triage?
   - Consider adding "needs-triage" label automation
   - Increase triage frequency (daily vs weekly)

4. **Prevention:**
   - Set team SLA for first response (e.g., 24 hours)
   - Rotate triage responsibility
   - Add triage reminders to calendar

### Solution C: PR Review Time Increase

**Diagnosis:** Average time to merge PRs increased

**Recovery Steps:**

1. **Identify slow PRs:**

   ```bash
   # PRs open > 7 days
   npm run scripts/maintenance/find-old-prs.js --days 7
   ```

2. **Review bottlenecks:**
   - Are reviews blocked waiting for maintainer?
   - Are there test failures?
   - Is PR description unclear (needs more review time)?

3. **Speed up review process:**
   - Assign reviewers proactively instead of waiting
   - Request help from team on slow reviews
   - Break large PRs into smaller reviews

4. **Improve PR quality:**
   - Add PR description template
   - Require test coverage on all PRs
   - Enforce linting before review

5. **Prevention:**
   - Set team SLA for PR review (e.g., 48 hours first response)
   - Daily review of open PRs
   - Rotating reviewer assignment

### Solution D: Test Coverage Decline

**Diagnosis:** "Code quality" or "Test coverage" component dropped

**Recovery Steps:**

1. **Check test coverage:**

   ```bash
   npm run test:coverage
   ```

2. **Identify files with low coverage:**

   ```bash
   npm run test:coverage | grep -E "^[^ ]+" | sort -k5 -n | head -10
   ```

3. **Add tests for low-coverage files:**
   - Start with critical files (security, core logic)
   - Target 80%+ coverage
   - Use existing test patterns as examples

4. **Prevention:**
   - Require coverage threshold in CI (e.g., 80%)
   - Block PRs that decrease overall coverage
   - Regular coverage trend monitoring

### Solution E: Linting Failures

**Diagnosis:** Linting pass rate decreased, more files with lint errors

**Recovery Steps:**

1. **Run linters:**

   ```bash
   npm run lint:js && npm run lint:md
   ```

2. **Fix lint errors:**
   - Auto-fix: `npm run format`
   - Manual fix for warnings
   - Review linting rules (may be too strict)

3. **Integrate into workflow:**
   - Add pre-commit hook to lint
   - CI should reject PRs with lint errors
   - Consider CI auto-fix option

4. **Prevention:**
   - Require lint pass in CI
   - Enable pre-commit hooks for team
   - Regular linting rule reviews

### Solution F: External Factors

**Diagnosis:** Team growth, new project phases, or known incidents

**Recovery Steps:**

1. **Assess situation:**
   - Is score drop expected? (new team starting, major refactor)
   - Is it temporary or systemic?
   - What's the team capacity?

2. **Set realistic targets:**
   - Adjust expectations during onboarding period
   - Plan metric improvements for next quarter
   - Communicate plan to stakeholders

3. **Create improvement plan:**
   - Identify top 3 priorities
   - Assign ownership
   - Set timeline for recovery
   - Schedule weekly check-ins

---

## Root Cause Analysis

For significant drops, investigate deeper:

1. **Timeline analysis:**
   - When did score start dropping?
   - What changed that day? (deploy, new team member, etc.)
   - Was there a specific incident?

2. **Blame detection:**
   - `git log` to find commits that changed metrics-impacting code
   - Review PR descriptions for context

3. **Team interviews:**
   - Ask team what happened that week
   - Was team focused on different initiative?
   - Were there blockers or challenges?

---

## Prevention

1. **Weekly score monitoring:**
   - Review score trend in team standup
   - Discuss any movements > 5 points
   - Celebrate improvements

2. **Component dashboards:**
   - Track individual components separately
   - Alert when component score drops

3. **Action planning:**
   - Set quarterly health targets
   - Break into monthly initiatives
   - Track progress against goals

4. **Team communication:**
   - Share health scores with team
   - Celebrate health improvements
   - Discuss challenges transparently

---

## Quick Reference

| Component | Drop Cause | Action |
|-----------|-----------|--------|
| Documentation | Missing frontmatter | Add frontmatter to files |
| Issue response | Stale issues | Triage backlog |
| PR review | Slow reviews | Speed up process |
| Test coverage | Untested code | Add tests |
| Linting | Lint errors | Fix violations |

---

**Created:** 2026-08-21  
**Last Updated:** 2026-08-21  
**Runbook Version:** 1.0  
**Maintainer:** Phase 3 Monitoring Team

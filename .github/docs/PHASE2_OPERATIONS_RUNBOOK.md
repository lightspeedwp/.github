---
title: "Phase 2 Operations Runbook"
description: "Production operations guide for unified workflows, troubleshooting, and recovery procedures"
date_created: "2026-09-17"
last_updated: "2026-09-17"
---

# Phase 2 Operations Runbook

**Document:** Production Operations Guide  
**Scope:** Unified workflows (labeling, validation, testing, linting, quality-gates)  
**Audience:** DevOps, Site Reliability Engineers, Workflow Operators  
**Status:** Phase 2 Implementation

---

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Monitoring & Alerting](#monitoring--alerting)
3. [Troubleshooting Guide](#troubleshooting-guide)
4. [Common Failure Modes](#common-failure-modes)
5. [Recovery Procedures](#recovery-procedures)
6. [Performance Optimization](#performance-optimization)
7. [Rollback Procedures](#rollback-procedures)
8. [Dashboard & Metrics](#dashboard--metrics)

---

## Quick Reference

### Workflow Status Commands

```bash
# Check all workflow runs on develop branch
gh workflow list --all | grep -E "labeling|validation|testing|linting|quality"

# View latest run for specific workflow
gh run list --workflow=labeling-unified.yml --limit=5

# Get detailed run information
gh run view <run-id> --log

# List failed jobs in a run
gh run view <run-id> --json jobs --jq '.jobs[] | select(.conclusion=="failure")'
```

### Critical Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **GitHub Actions Minutes/Month** | ≤2,125 | >2,500 min |
| **Workflow Success Rate** | ≥99% | <95% |
| **Average Job Duration** | ≤5 min (quality-gates) | >10 min |
| **PR Label Application** | <30 sec | >60 sec |
| **Validation Gate Pass Rate** | ≥98% | <90% |

### On-Call Escalation

1. **Level 1 (Workflow operator):** Check dashboard, review logs, apply standard troubleshooting
2. **Level 2 (DevOps engineer):** Investigate infrastructure, check GitHub API limits, review action versions
3. **Level 3 (Infrastructure lead):** Scale resources, coordinate with GitHub support, plan recovery

---

## Monitoring & Alerting

### GitHub Actions Metrics Dashboard

Link: [GitHub Actions Metrics Dashboard](https://github.com/lightspeedwp/.github/settings/actions/runners) (requires admin access)

**Key Metrics to Monitor:**

- **Minutes consumed** (daily, weekly, monthly)
- **Concurrent workflow runs** (peak load)
- **Job queue depth** (pending jobs)
- **Runner availability** (online/offline status)

### Custom Metrics via Artifacts

All unified workflows store metrics artifacts:

- `labeling-metrics.json` — Label application metrics
- `validation-metrics.json` — Validation gate metrics
- `testing-metrics.json` — Test execution metrics
- `linting-metrics.json` — Linting job metrics
- `quality-gates-metrics.json` — Security scanning metrics

**View metrics:**

```bash
# Download latest metrics artifact
gh run download <run-id> -n labeling-metrics

# Parse metrics
cat labeling-metrics.json | jq '.minutes_used, .duration_seconds'
```

### Alerting Rules

Set up GitHub Actions alerts in your CI/CD platform:

```yaml
# Example: Alert on workflow failure rate >5%
alert:
  name: Workflow Failure Rate High
  condition: failure_rate > 0.05
  threshold_duration: 15m
  action: notify-slack-devops-channel
```

---

## Troubleshooting Guide

### Step 1: Identify the Failing Workflow

```bash
# Get recent failed runs across all workflows
for workflow in labeling-unified validation-unified testing-unified linting-unified quality-gates; do
  echo "=== $workflow ==="
  gh run list --workflow=$workflow.yml --status=failure --limit=3
done
```

### Step 2: Analyze the Failure

```bash
# View job-level details
gh run view <run-id> --json jobs,conclusion

# Stream live logs for running job
gh run view <run-id> --log

# Export full run data for analysis
gh run view <run-id> --json * > run-data.json
```

### Step 3: Categorize the Issue

**Category A: Code Quality Issues**

- ESLint/markdownlint failures
- TypeScript type errors
- Test failures

**Category B: Dependency Issues**

- npm audit vulnerabilities
- Outdated packages
- License compliance violations

**Category C: Infrastructure Issues**

- GitHub API rate limiting
- Runner timeouts
- GitHub service degradation

**Category D: Configuration Issues**

- Workflow syntax errors
- Action version conflicts
- Permission/token issues

### Step 4: Apply Targeted Resolution

See [Common Failure Modes](#common-failure-modes) for resolution steps by category.

---

## Common Failure Modes

### 1. ESLint/Linting Failures

**Symptom:** `lint-js` job fails with "ESLint found errors"

**Root Causes:**

- Code style violations
- Syntax errors
- Undefined variables
- Unused imports

**Resolution:**

```bash
# Run locally to identify issues
npm run lint:js -- --format stylish

# Auto-fix issues
npm run lint:js -- --fix

# Commit and push
git add .
git commit -m "fix: resolve linting violations"
git push
```

**Prevention:**

- Enable pre-commit hooks locally: `npm run setup:hooks`
- Use IDE ESLint integration for real-time feedback
- Review PR comments before commit

---

### 2. npm audit Vulnerabilities

**Symptom:** `dependency-scanning` job fails with "Critical vulnerabilities detected"

**Root Causes:**

- Direct dependency with CVE
- Transitive dependency update introduced vulnerability
- Outdated lock file

**Resolution:**

```bash
# Review vulnerabilities
npm audit

# Auto-fix available updates
npm audit fix

# Manual fix for complex issues
npm update [package-name]

# Verify fix
npm audit --audit-level=moderate

# Commit and push
git add package-lock.json
git commit -m "fix: update dependencies to resolve security vulnerabilities"
git push
```

**Prevention:**

- Keep `package-lock.json` up-to-date
- Run `npm audit` weekly
- Set up Dependabot alerts in GitHub Settings

---

### 3. License Compliance Failures

**Symptom:** `license-compliance` job fails with "Prohibited licenses found"

**Root Causes:**

- New dependency has GPL/AGPL license
- Dependency transitive license changed
- Missing exception in allowlist

**Resolution:**

```bash
# Review dependencies
npm ls --depth=0

# View license for specific package
npm view [package-name] license

# Option 1: Replace with compliant alternative
npm install [compliant-package]@latest

# Option 2: Add exception to allowlist
# Edit .github/config/LICENSE_ALLOWLIST.json
cat > .github/config/LICENSE_ALLOWLIST.json << 'EOF'
{
  "allowed": [...],
  "prohibited": [...],
  "exceptions": [
    {
      "package": "legacy-lib",
      "version": "2.0.0",
      "license": "GPL-2.0",
      "reason": "Transitioning to MIT",
      "approved_by": "security@example.com",
      "expires": "2027-01-01"
    }
  ]
}
EOF

# Commit changes
git add .github/config/LICENSE_ALLOWLIST.json package.json package-lock.json
git commit -m "fix: resolve license compliance"
git push
```

**Prevention:**

- Review licenses before adding dependencies
- Maintain clear policy on acceptable licenses
- Quarterly license audit

---

### 4. Code Quality Regression

**Symptom:** `code-quality-metrics` reports decrease in maintainability score

**Status:** Warning (doesn't block merge)

**Root Cause:** Complex code added without refactoring

**Resolution:**

```bash
# Identify complexity hotspots
npm run analyze:complexity

# Plan refactoring in backlog (don't block PR)
# Create issue: "Refactor: reduce complexity in [module]"

# For urgent regressions, implement improvements:
# - Break large functions into smaller units
# - Extract common patterns
# - Add more test coverage
```

**Prevention:**

- Monitor trend reports weekly
- Include code review checklist for complexity
- Plan ongoing refactoring work

---

### 5. GitHub API Rate Limiting

**Symptom:** Job fails with "API rate limit exceeded"

**Root Causes:**

- Too many workflows running concurrently
- Inefficient GitHub API calls in custom actions
- GitHub outage/degradation

**Resolution:**

```bash
# Check current rate limit status
gh api rate_limit

# If near limit, wait 60 minutes for reset
# Stagger workflow triggers if running many simultaneously

# For persistent issues:
# 1. Optimize custom actions to batch API calls
# 2. Use GitHub App tokens instead of PAT for higher limits
# 3. Consider Enterprise account for higher rate limits
```

**Prevention:**

- Monitor API usage in metrics dashboard
- Implement exponential backoff in custom actions
- Use caching to reduce redundant API calls

---

### 6. Runner Timeout

**Symptom:** Job fails after 360 minutes with "This job exceeded the maximum execution time"

**Root Cause:** Very large test suite or slow runner

**Resolution:**

```bash
# Check job logs for performance bottlenecks
gh run view <run-id> --log | grep -A5 "Duration:"

# If CodeQL/SAST is slow:
# - Increase runner RAM (contact GitHub)
# - Limit CodeQL queries to critical subset
# - Use incremental analysis

# If npm install is slow:
# - Check npm cache hit rate
# - Consider using npm ci instead of npm install
# - Review package-lock.json size
```

**Prevention:**

- Monitor job durations in metrics dashboard
- Set alerts when avg duration >80% of timeout
- Review test suite size quarterly

---

## Recovery Procedures

### Scenario 1: Workflow Completely Broken (Won't Run)

**Symptoms:**

- "Workflow file is invalid"
- "Syntax error in workflow"
- All jobs skipped

**Recovery Steps:**

```bash
# 1. Identify the issue
gh run view <run-id> --log | head -50

# 2. Fix workflow YAML
# Common issues:
#   - Missing colon in YAML
#   - Incorrect indentation
#   - Invalid field names

# 3. Validate locally (requires yamllint)
yamllint .github/workflows/labeling-unified.yml

# 4. Push fix
git add .github/workflows/labeling-unified.yml
git commit -m "fix: correct workflow syntax error"
git push

# 5. Re-run workflow
gh workflow run labeling-unified.yml
```

### Scenario 2: Cascading Failures (One Failure Blocks Others)

**Symptoms:**

- First job fails, downstream jobs skip
- Entire workflow marked as failed
- Can't rerun individual jobs

**Recovery Steps:**

```bash
# 1. Check concurrency group configuration
# (should NOT have cancel-in-progress: true for critical workflows)
grep -A3 "concurrency:" .github/workflows/labeling-unified.yml

# 2. If concurrency blocks new runs:
#    - Wait for current run to complete
#    - Manually re-trigger

# 3. Fix root cause in code
# (See "Common Failure Modes" section)

# 4. Verify workflow isolation
# (Test that one job failure doesn't cascade)
gh workflow run phase2-integration-test.yml -f test_scope=labeling-only
```

### Scenario 3: Workflow Hangs (Stuck Running)

**Symptoms:**

- Job running for >10 hours
- No recent log output
- GitHub API shows still in progress

**Recovery Steps:**

```bash
# 1. Cancel the stuck run
gh run cancel <run-id>

# 2. Review logs for last message
gh run view <run-id> --log | tail -20

# 3. Check for infinite loops or deadlocks
# (Usually in custom shell scripts)

# 4. Fix the root cause
# (Add timeout, fix loop logic, etc.)

# 5. Re-run workflow
gh workflow run <workflow-name>
```

---

## Performance Optimization

### Monitoring Metrics

**Track these metrics weekly:**

```bash
# GitHub Actions minutes per workflow
for workflow in labeling-unified validation-unified testing-unified linting-unified quality-gates; do
  echo "=== $workflow ==="
  gh run list --workflow=$workflow.yml --limit=10 \
    --json conclusion,durationMinutes \
    --jq '[.[] | select(.conclusion=="success") | .durationMinutes] | add / length'
done
```

### Optimization Opportunities

| Area | Optimization | Expected Reduction |
|------|--------------|-------------------|
| Caching | Cache npm dependencies | 15-20% |
| Parallelization | Run independent jobs concurrently | 20-30% |
| Selective Runs | Skip jobs based on changed files | 10-15% |
| Artifact Cleanup | Remove unnecessary artifacts | 5-10% |
| Dependencies | Reduce package size | 5-10% |

### Implementing Caching

```yaml
# Example: Cache npm dependencies in workflow
- name: Cache npm dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-
```

---

## Rollback Procedures

### Full Rollback to Phase 1 (Archived Workflows)

**Conditions:** Critical issue discovered in Phase 2 workflows, needs immediate rollback

**Steps:**

```bash
# 1. Create rollback branch
git checkout develop
git checkout -b ops/rollback-to-phase1

# 2. Restore archived workflows
cp .github/workflows/archived/2026-09-11/* .github/workflows/

# 3. Remove Phase 2 unified workflows
rm -f .github/workflows/labeling-unified.yml \
      .github/workflows/validation-unified.yml \
      .github/workflows/testing-unified.yml \
      .github/workflows/linting-unified.yml \
      .github/workflows/quality-gates.yml

# 4. Commit and push
git add .github/workflows/
git commit -m "ops: rollback to Phase 1 archived workflows (emergency)"
git push -u origin ops/rollback-to-phase1

# 5. Create hotfix PR
gh pr create --title "HOTFIX: Rollback to Phase 1" \
  --body "Emergency rollback due to [reason]. Testing required before merge."

# 6. Test rollback
gh workflow run phase2-integration-test.yml

# 7. Merge PR after validation
gh pr merge <pr-id> --admin --squash

# 8. Post-incident review
# (Create incident report, identify root cause, plan remediation)
```

### Partial Rollback (Single Workflow)

**Condition:** Single workflow has critical issue, others are stable

```bash
# 1. Identify problematic workflow
WORKFLOW="quality-gates.yml"

# 2. Restore from archive
cp .github/workflows/archived/2026-09-11/security/$WORKFLOW .github/workflows/

# 3. Disable Phase 2 version by renaming
mv .github/workflows/$WORKFLOW .github/workflows/.${WORKFLOW}.disabled

# 4. Push change
git add .github/workflows/
git commit -m "ops: rollback $WORKFLOW to Phase 1 version (issue: [issue-id])"
git push

# 5. Test and validate
gh workflow run $WORKFLOW

# 6. Schedule Phase 2 workflow fix
# (Create GitHub issue with fix plan, assign to team)
```

---

## Dashboard & Metrics

### Key Performance Indicators

**Monthly Metrics Target:**

```
GitHub Actions Minutes (Budget: ≤2,125/month)
┌─────────────────────────────────┐
│ Target: ≤2,125 min              │
│ Phase 1 Baseline: ~2,500 min    │
│ Phase 2 Goal: -15% reduction    │
│ Projected: ~2,125 min           │
└─────────────────────────────────┘

Workflow Success Rate (Target: ≥99%)
┌─────────────────────────────────┐
│ Labeling: 99.5%                 │
│ Validation: 99.2%               │
│ Testing: 98.8% (allow variance) │
│ Linting: 99.7%                  │
│ Quality Gates: 99.1%            │
└─────────────────────────────────┘

Average Job Duration (Target: <5 min)
┌─────────────────────────────────┐
│ Labeling jobs: ~30 sec          │
│ Validation jobs: ~2 min         │
│ Testing jobs: ~3 min (varies)   │
│ Linting jobs: ~45 sec           │
│ Quality gates: ~5 min           │
└─────────────────────────────────┘
```

### Accessing Metrics

1. **GitHub Actions Tab:** github.com/lightspeedwp/.github/actions
2. **Metrics Artifacts:** Download via `gh run download`
3. **Custom Dashboard:** (Setup in your CI/CD platform)

---

## Escalation Path

**Problem → Level 1 → Level 2 → Level 3**

| Severity | Response Time | Escalation | Owner |
|----------|---------------|-----------|-------|
| P1 (Blocking all PRs) | 15 min | Immediate L2 | Engineering Manager |
| P2 (Single workflow down) | 1 hour | L2 if not resolved | Tech Lead |
| P3 (Performance degradation) | 4 hours | L2 planning | DevOps Lead |
| P4 (Minor issue/warning) | 24 hours | Documentation update | Team member |

---

## Related Resources

- [PHASE2_ROLLBACK.md](./PHASE2_ROLLBACK.md) — Detailed rollback procedures
- [WORKFLOW_CONSOLIDATION_MAPPING.md](./WORKFLOW_CONSOLIDATION_MAPPING.md) — Workflow cross-reference
- [PERFORMANCE_TARGETS.md](./PERFORMANCE_TARGETS.md) — Detailed budget breakdown
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Support Portal](https://support.github.com/)

---

*Last updated: 2026-09-17 | Phase 2 Operations | Keep this runbook updated as new issues are discovered*

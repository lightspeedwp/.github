---
title: "Phase 2 Rollback Procedure"
date_created: "2026-09-17"
version: "1.0"
---

# Phase 2 Rollback Procedure

## Overview

This document describes the complete rollback procedure for Phase 2 Workflow Consolidation. If unified workflows fail to meet success criteria or cause unacceptable degradation, this procedure restores the repository to the pre-Phase 2 state using archived workflows.

**Estimated Rollback Time:** 15-30 minutes  
**Risk Level:** Low (archived workflows verified and tested)  
**Recovery Point:** 2026-09-11 (Phase 1 archive date)

---

## Prerequisites

- **Access Level:** Repository admin or workflow administrator role
- **GitHub Token:** Personal access token with `workflow` and `repo` scopes
- **Git Knowledge:** Basic git operations (branch, checkout, push)
- **Backup Verified:** `.github/workflows/archived/2026-09-11/` directory intact with 71 workflows

### Pre-Rollback Checklist

- [ ] Phase 2 unified workflows have been running for ≥1 hour to capture reliable metrics
- [ ] Metrics comparison prepared (Phase 1 baseline vs. Phase 2 actual)
- [ ] All PR workflows marked as draft (if applicable)
- [ ] Stakeholders notified of rollback (via #engineering channel)
- [ ] Git branch clean (no uncommitted changes)

---

## Rollback Steps

### Step 1: Stop Active Unified Workflows

**Duration:** 5 minutes

Disable all Phase 2 unified workflows to prevent cascading failures during rollback:

```bash
# Navigate to repository root
cd /path/to/.github

# Disable unified workflows
git checkout develop
git pull origin develop

# Mark unified workflows as disabled (add 'if: false' to top-level job)
sed -i 's/^jobs:/on:\n  workflow_dispatch: {}\njobs:/g' .github/workflows/labeling-unified.yml
sed -i 's/^jobs:/on:\n  workflow_dispatch: {}\njobs:/g' .github/workflows/validation-unified.yml
# ... repeat for all 5 unified workflows

# Commit the disable action (do NOT push yet)
git add .github/workflows/*.yml
git commit -m "chore: disable phase2 workflows for rollback [ROLLBACK-IN-PROGRESS]"
```

### Step 2: Restore Archived Workflows

**Duration:** 5-10 minutes

Copy archived workflows back to active workflows directory:

```bash
# List archived workflow structure
ls -R .github/workflows/archived/2026-09-11/

# Copy all archived workflows back to active directory
# Preserve subdirectory structure where applicable
cp -r .github/workflows/archived/2026-09-11/labeling/* .github/workflows/
cp -r .github/workflows/archived/2026-09-11/validation/* .github/workflows/
cp -r .github/workflows/archived/2026-09-11/testing/* .github/workflows/
cp -r .github/workflows/archived/2026-09-11/pr-management/* .github/workflows/
cp -r .github/workflows/archived/2026-09-11/issue-management/* .github/workflows/
cp -r .github/workflows/archived/2026-09-11/ci-cd/* .github/workflows/
cp -r .github/workflows/archived/2026-09-11/documentation/* .github/workflows/
cp -r .github/workflows/archived/2026-09-11/utilities/* .github/workflows/

# Verify all 71 workflows restored
find .github/workflows -maxdepth 1 -name "*.yml" -o -name "*.yaml" | wc -l
# Expected output: 71

# Remove any remaining unified workflow files
rm -f .github/workflows/labeling-unified.yml
rm -f .github/workflows/validation-unified.yml
rm -f .github/workflows/testing-unified.yml
rm -f .github/workflows/linting-unified.yml
rm -f .github/workflows/quality-gates.yml
```

### Step 3: Verify Workflow Integrity

**Duration:** 5 minutes

Validate that all archived workflows are syntactically correct:

```bash
# Check for YAML syntax errors in all workflows
for workflow in .github/workflows/*.yml; do
  echo "Checking $workflow..."
  if ! yq eval '.' "$workflow" > /dev/null 2>&1; then
    echo "ERROR: Syntax error in $workflow"
    exit 1
  fi
done

echo "✓ All workflows are syntactically valid"

# Verify workflow triggers are enabled (no disabled jobs)
grep -l "if: false" .github/workflows/*.yml | wc -l
# Expected output: 0 (no disabled workflows)
```

### Step 4: Commit and Push Rollback

**Duration:** 5 minutes

Commit the rollback changes and push to develop:

```bash
# Stage all workflow changes
git add .github/workflows/

# Commit with clear rollback message
git commit -m "chore: rollback to phase1 archived workflows

This commit restores all 71 pre-Phase 2 archived workflows to active status.
Reason for rollback: [document reason here]

Rolled back files:
- Removed: labeling-unified.yml, validation-unified.yml, testing-unified.yml, linting-unified.yml, quality-gates.yml
- Restored: 71 archived workflows from .github/workflows/archived/2026-09-11/

Verification:
- All 71 workflows present: ✓
- All workflows syntactically valid: ✓
- No disabled jobs: ✓

Baseline metrics: See .github/docs/BASELINE_METRICS.md
Rollback procedure: See .github/docs/PHASE2_ROLLBACK.md

[ROLLBACK-COMPLETE]"

# Push to develop branch
git push origin develop

# Verify push successful
git log --oneline -1
```

### Step 5: Trigger Validation Run

**Duration:** 10 minutes

Trigger archived workflows to validate they execute correctly:

```bash
# Create a test PR to trigger workflows
git checkout -b test/rollback-validation origin/develop
echo "# Rollback Validation PR" >> README.md
git add README.md
git commit -m "test: trigger workflow validation after rollback"
git push origin test/rollback-validation

# Monitor GitHub Actions dashboard for workflow execution
# Expected: All workflows trigger and complete successfully
# Timeline: ~10 minutes for all workflows to run

# Once validation complete, close test PR (do NOT merge)
# Go to: https://github.com/lightspeedwp/.github/pulls
# Find "test/rollback-validation" PR → Click "Close pull request"
```

### Step 6: Verify Production State

**Duration:** 5 minutes

Confirm all archived workflows are active and functioning:

```bash
# Check workflow files in production (develop branch)
git log --oneline -2 origin/develop
# Should show rollback commit as HEAD

# Verify .github/workflows/ contains only archived workflows
ls -lh .github/workflows/ | grep -E "\.yml|\.yaml" | wc -l
# Expected: 71 files

# Confirm Phase 2 unified workflows removed
ls -la .github/workflows/labeling-unified.yml 2>/dev/null && echo "ERROR: unified workflows still present" || echo "✓ Unified workflows removed"

# Check metrics directory (Phase 2 data preserved for analysis)
ls -lah .github/metrics/ 2>/dev/null | head -5
```

---

## Rollback Verification Checklist

After completing all steps, verify:

- [ ] All 71 archived workflows present in `.github/workflows/`
- [ ] All 5 unified workflows removed (labeling, validation, testing, linting, quality-gates)
- [ ] Test PR triggered and all workflows executed successfully
- [ ] GitHub Actions dashboard shows workflows running with archived names
- [ ] No error messages in workflow logs
- [ ] PR/issue labeling working correctly (via test PR event)
- [ ] Performance metrics within Phase 1 baseline range

---

## Post-Rollback Actions

### 1. Notify Stakeholders

```bash
# Post to #engineering channel
echo "🔄 Phase 2 rollback complete
- All 71 archived workflows restored
- Unified workflows disabled
- Validation run: ✓ PASSED
- Next steps: RCA and remediation planning"
```

### 2. Capture Failure Analysis

Document why Phase 2 was rolled back:

```bash
cat > .github/reports/active/PHASE2_ROLLBACK_RCA_$(date +%Y%m%d).md << 'ANALYSIS'
# Phase 2 Rollback Root Cause Analysis

**Rollback Date:** [DATE]
**Affected Duration:** [START] to [END]
**Reason:** [Document failure mode and impact]

## Failure Analysis

### Symptoms
- [Describe observed issues]

### Root Cause
- [Document technical root cause]

### Impact
- [Document metric degradation or failures]

### Resolution
- [Document fix or improvement needed]

## Recommendations

1. [Remediation step 1]
2. [Remediation step 2]
3. [Re-validation plan]

## Re-Deployment Plan

[Document when/how Phase 2 will be redeployed after fixes]
ANALYSIS

git add .github/reports/active/PHASE2_ROLLBACK_RCA_*.md
git commit -m "docs: phase2 rollback root cause analysis"
git push origin develop
```

### 3. Archive Phase 2 Metrics

Preserve Phase 2 measurements for post-mortem:

```bash
# Copy metrics to archive
cp -r .github/metrics .github/metrics_phase2_rollback_$(date +%Y%m%d_%H%M%S)

# Commit archive
git add .github/metrics_phase2_*
git commit -m "chore: archive phase2 metrics for analysis"
git push origin develop
```

---

## Recovery from Rollback

### Option 1: Analyze and Re-Deploy (Recommended)

1. Document root cause (see Post-Rollback Actions above)
2. Implement fix on feature branch
3. Re-test unified workflows locally
4. Redeploy Phase 2 with fixes

### Option 2: Extend Phase 1

If Phase 2 requires significant rework:

1. Continue with archived workflows as stable baseline
2. Plan Phase 2.1 with additional time for problem resolution
3. Schedule re-evaluation milestone (e.g., 2 weeks)

---

## Rollback Procedure Validation

**Testing Schedule:**

- [ ] Dry-run rollback during Phase 1 (before Phase 2 deployment)
- [ ] Full rollback test on feature branch
- [ ] Production rollback only as last resort (after ≥3 consecutive CI failures)

**Dry-Run Commands** (for Phase 1 testing):

```bash
# Create isolated test branch
git checkout -b test/phase2-rollback-dryrun origin/develop

# Simulate Phase 2 deployment (create dummy unified workflows)
echo "# Phase 2 test workflows - to be removed" > .github/workflows/test-phase2-*.yml

# Run through rollback steps 1-4 above

# Verify archived workflows restore correctly
# Then reset branch
git checkout develop
git branch -D test/phase2-rollback-dryrun
```

---

## Support & Escalation

**Rollback Issues:**

- Workflow syntax errors → Check YAML format, use `yq` validator
- File copy failures → Verify archive directory permissions, use `sudo` if needed
- Git push conflicts → Pull latest, resolve conflicts, retry push
- Workflows not triggering → Clear Actions cache, verify webhook configuration

**Escalation Path:**

1. Check GitHub Status page for incidents: <https://www.githubstatus.com>
2. Review workflow error logs in Actions tab
3. Post in #engineering with error details
4. Contact @ashley for administrator access if needed

---

**Last Updated:** 2026-09-17  
**Validated By:** [To be completed during rollback drill]  
**Next Rollback Drill:** [Scheduled for 2026-09-25 or post-Phase-2-deployment]

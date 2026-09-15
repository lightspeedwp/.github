---
title: "Phase 2 Rollback Procedure"
created: "2026-09-14"
---

# Phase 2 Rollback Procedure

## Overview
This document provides the step-by-step procedure to safely rollback Phase 2 (Unified Workflows) to Phase 1 (Archived Workflows) with zero data loss and automated recovery.

**Target Recovery Time:** ≤15 minutes  
**Data Loss Risk:** None (no state mutations during Phase 2 execution)

---

## Pre-Rollback Checklist

Before initiating rollback, verify:
- [ ] Identify specific failure reason (workflow error, performance regression, or behavioral mismatch)
- [ ] Confirm issue is reproducible and affects production
- [ ] Capture failing workflow logs for post-mortem analysis
- [ ] Notify team of rollback initiation

---

## Rollback Steps

### Step 1: Disable Phase 2 Unified Workflows
```bash
# In repository root

# Disable all 5 unified workflows (Phase 2)
for workflow in \
  .github/workflows/labeling-unified.yml \
  .github/workflows/validation-unified.yml \
  .github/workflows/testing-unified.yml \
  .github/workflows/linting-unified.yml \
  .github/workflows/quality-gates.yml
do
    # Add 'enabled: false' to workflow top level (or delete file)
    echo "Disabling $workflow..."
done
```

### Step 2: Enable Phase 1 Archived Workflows
```bash
# Copy archived workflows back to active location
mkdir -p .github/workflows/

# Restore all archived workflows from Phase 1 archive
cp -r .github/workflows/archived/2026-09-11/* .github/workflows/

# Verify all 71 workflows are present
find .github/workflows -name "*.yml" -o -name "*.yaml" | grep -v archived | wc -l
# Expected output: 71
```

### Step 3: Verify Workflow Restoration
```bash
# List restored workflows
ls -la .github/workflows/ | grep -E "\.ya?ml$" | wc -l

# Validate YAML syntax
for workflow in .github/workflows/*.yml .github/workflows/*.yaml; do
    if ! grep -q "^name:" "$workflow"; then
        echo "WARNING: $workflow missing 'name' field"
    fi
done
```

### Step 4: Commit Rollback
```bash
# Stage rollback changes
git add .github/workflows/
git add .github/docs/PHASE2_ROLLBACK.md

# Commit with clear message
git commit -m "rollback: restore Phase 1 archived workflows after Phase 2 failure

Rollback reason: [INSERT SPECIFIC FAILURE REASON]
Failing workflow(s): [INSERT WORKFLOW NAMES]
Error logs: [INSERT REFERENCE TO LOGS]

This commit restores all 71 Phase 1 archived workflows and disables Phase 2 unified workflows.
All workflow behavior returns to pre-Phase-2 state.
No data loss."

# Tag rollback event for audit trail
git tag -a "rollback/phase2-$(date +%Y%m%d-%H%M%S)" -m "Phase 2 rollback event"
```

### Step 5: Trigger Workflow Validation
```bash
# Create test PR or push to feature branch to validate restored workflows execute
git push origin refactor/workflow-consolidation-phase-2

# Monitor GitHub Actions tab to verify:
# ✓ All 71 archived workflows trigger correctly
# ✓ No duplicate runs (ensure Phase 2 workflows are truly disabled)
# ✓ Results match pre-Phase-2 behavior
```

### Step 6: Notify Stakeholders
- Document failure reason and logs
- Schedule post-mortem analysis
- Update Phase 2 plan with findings
- Adjust timeline and success criteria if necessary

---

## Rollback Validation Checklist

After rollback, confirm:
- [ ] All 71 Phase 1 archived workflows present in `.github/workflows/`
- [ ] Phase 2 unified workflows disabled or removed
- [ ] Next PR/issue triggers all expected labeling workflows (archived versions)
- [ ] No duplicate labels applied (confirming Phase 2 workflows are off)
- [ ] Validation workflows execute correctly on branch names
- [ ] Test workflows run correctly on push/PR
- [ ] No new errors in workflow logs

---

## Emergency Contacts

- **Workflow Owner:** @ashley
- **On-Call:** [TBD — escalation contact]
- **Incident Channel:** #workflow-incidents (Slack)

---

## Post-Rollback Recovery Plan

1. **Analysis Phase (1-2 hours)**
   - Review failing workflow logs
   - Identify root cause (configuration, logic, resource constraints)
   - Document findings in incident report

2. **Fix Phase (TBD)**
   - Adjust Phase 2 implementation based on findings
   - Add new tests to prevent regression
   - Re-run `/speckit-plan` if architecture changes needed

3. **Re-Deploy Phase (TBD)**
   - Recreate feature branch from updated plan
   - Rerun Phase 1-2 validation
   - Proceed with Phase 3 (labeling-unified.yml) when confidence restored

---

## Technical Details

### What Phase 2 Rollback Does NOT Affect
- Issue/PR data (no mutations during workflow execution)
- Label definitions (`.github/labels.yml` unchanged)
- Issue templates or PR templates
- Secret configurations
- GitHub organization settings

### What Gets Restored
- All 71 archived workflow files at `.github/workflows/archived/2026-09-11/`
- Original trigger patterns (pull_request, issues, push, schedule)
- Original job definitions and step logic
- Composite action dependencies (if any)

### Limitations
- Rollback is **not** automatic — requires manual execution
- In-flight workflow runs (at rollback time) will complete under Phase 2 logic
- Label cleanup jobs from Phase 2 may need manual review if partially executed

---

## Related Documents
- [WORKFLOW_CONSOLIDATION_MAPPING.md](./WORKFLOW_CONSOLIDATION_MAPPING.md) — Lists 71→5 mapping
- [PHASE2_OPERATIONS_RUNBOOK.md](./PHASE2_OPERATIONS_RUNBOOK.md) — Day-2 operations guide
- [spec.md](../.github/specs/003-workflow-consolidation-phase-2/spec.md) — Phase 2 specification

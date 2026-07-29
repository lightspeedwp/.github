# Issue Triage Automation System — Execution Checklist

**Project:** Issue Triage Automation System (Epic #1376)  
**PR:** #1377  
**Execution Date:** July 28, 2026  
**Executor:** [Your Name]  
**Status:** ⏳ Awaiting Execution

---

## Pre-Execution Verification

### Branch & PR Status

- [ ] PR #1377 created and visible
- [ ] PR #1377 CI checks passing (or green checkmark)
- [ ] PR body contains proper feature template
- [ ] PR has correct labels (type:feature, priority:high, status:needs-review)
- [ ] Epic #1376 linked in PR
- [ ] All conversations/comments addressed

### Merge Readiness

- [ ] PR approved by code reviewer (CodeRabbit)
- [ ] No merge conflicts
- [ ] All CI checks passing
- [ ] Ready to squash merge to develop

### Code & Documentation Review

- [ ] Reviewed MilestoneAssignmentAgent code (milestone-assignment.js)
- [ ] Reviewed RemediationChecklistGenerator code (remediation-checklist-generator.js)
- [ ] Reviewed issue-create-enhanced.yml workflow
- [ ] Reviewed issue-remediation-bulk.yml workflow
- [ ] Reviewed ISSUE_TRIAGE_AUTOMATION.md documentation
- [ ] All code follows organizational standards
- [ ] No breaking changes identified

### Team Readiness

- [ ] Engineering team notified
- [ ] Dry-run plan communicated
- [ ] Stakeholders aware of timeline
- [ ] Support plan in place for issues

---

## Step 1: Merge PR to Develop

### Actions

```bash
# Navigate to PR #1377
gh pr view 1377

# Merge to develop (squash merge recommended)
gh pr merge 1377 --squash --delete-branch

# Verify merge
git log develop -1 --oneline
```

### Verification

- [ ] PR merged successfully (no conflicts)
- [ ] Branch deleted automatically
- [ ] Commit present in develop: "feat: implement comprehensive issue triage automation system"
- [ ] All checks still passing on develop

### Troubleshooting

If merge fails:

1. [ ] Check for merge conflicts
2. [ ] Rebase if needed
3. [ ] Resolve conflicts locally
4. [ ] Push resolved branch
5. [ ] Retry merge

---

## Step 2: Deploy Workflows

### Actions

```bash
# Verify workflows are deployed
gh workflow list | grep -E "issue-create-enhanced|issue-remediation-bulk"

# Check workflow files exist
git show develop:.github/workflows/issue-create-enhanced.yml > /dev/null
git show develop:.github/workflows/issue-remediation-bulk.yml > /dev/null

# Verify scripts deployed
git show develop:scripts/agents/includes/milestone-assignment.js > /dev/null
git show develop:scripts/agents/includes/remediation-checklist-generator.js > /dev/null
```

### Verification

- [ ] issue-create-enhanced.yml deployed to develop
- [ ] issue-remediation-bulk.yml deployed to develop
- [ ] milestone-assignment.js deployed
- [ ] remediation-checklist-generator.js deployed
- [ ] All CI checks still passing

### Troubleshooting

If workflows not visible:

1. [ ] Wait 2-3 minutes for GitHub to index
2. [ ] Refresh page
3. [ ] Check develop branch has latest commits

---

## Step 3: Dry-Run Execution

### Pre-Dry-Run Checklist

- [ ] All deployments verified
- [ ] All CI checks passing
- [ ] Time allocated: 30 minutes
- [ ] Reports directory prepared: `.github/reports/remediation/`

### Execute Dry-Run

```bash
gh workflow run issue-remediation-bulk.yml \
  --ref develop \
  -f days=7 \
  -f dry_run=true \
  -f remediate_milestones=true \
  -f remediate_labels=true \
  -f remediate_templates=true
```

### Monitor Execution

- [ ] Workflow triggered successfully
- [ ] Workflow running in Actions (takes 5-10 min)
- [ ] Check progress: <https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml>

### Wait for Completion

- [ ] Workflow completes (green checkmark)
- [ ] Reports generated in artifacts
- [ ] Download reports from workflow run

### Dry-Run Checklist

- [ ] Workflow executed without errors
- [ ] Reports generated successfully
- [ ] Milestone assignments previewed
- [ ] Label inferences previewed
- [ ] Remediation checklists previewed

### Review Dry-Run Reports

**Location:** Artifacts tab in workflow run

**Review Checklist:**

- [ ] Review `.github/reports/remediation/milestone-assignment-*.md`
- [ ] Check milestone assignments look correct
- [ ] Verify label inferences (should be type:task or similar)
- [ ] Review checklist count (248 expected)
- [ ] Verify zero actual changes were made (dry-run=true)

**Sample Report Contents:**

```
## Summary
- Total issues: 250
- Assigned: 248
- Dry-run: True
- Skipped: 2
- Errors: 0

## Details
### ASSIGNED (248)
- #1903: v1.5 (confidence: 95%, reason: version-keyword)
- #1902: Phase 2B (confidence: 85%, reason: phase-match)
...
```

### Approval Decision

- [ ] All assignments look reasonable
- [ ] No unexpected or incorrect assignments
- [ ] Ready to proceed with apply
- [ ] Document any concerns/overrides

### If Issues Found

1. [ ] Document specific issues
2. [ ] File GitHub issue for improvement
3. [ ] Determine if blocker or minor concern
4. [ ] If blocker: fix and re-run dry-run
5. [ ] If minor: proceed with note

---

## Step 4: Get Approval to Apply

### Stakeholder Sign-Off

- [ ] Engineering lead reviewed reports
- [ ] Tech lead approved proceeding
- [ ] Project owner authorized apply
- [ ] No blockers identified

### Document Approval

- [ ] Note approval in Epic #1376
- [ ] Record approval timestamp
- [ ] Note any special instructions

### Ready to Proceed

- [ ] All approvals obtained
- [ ] No concerns or blockers
- [ ] Team notified of next step
- [ ] Prepared for actual changes

---

## Step 5: Execute Apply (Make Changes)

### Pre-Apply Checklist

- [ ] Approvals documented
- [ ] Time allocated: 45 minutes
- [ ] Ready to make actual changes to 250 issues
- [ ] Backup/rollback plan understood

### Execute Apply

```bash
gh workflow run issue-remediation-bulk.yml \
  --ref develop \
  -f days=7 \
  -f dry_run=false \
  -f remediate_milestones=true \
  -f remediate_labels=true \
  -f remediate_templates=true
```

### Monitor Execution

- [ ] Workflow triggered successfully
- [ ] Check progress in Actions (takes 10-15 min for actual changes)
- [ ] Monitor for errors in real-time

### Wait for Completion

- [ ] Workflow completes (green checkmark)
- [ ] All 250 issues processed
- [ ] Reports generated
- [ ] Labeling workflow triggered

### Post-Apply Checklist

- [ ] Workflow succeeded without errors
- [ ] All issues processed (check count)
- [ ] Reports generated
- [ ] Labeling workflow triggered
- [ ] Time noted: [completion time]

### Verify Changes Made

**Sample Verification:**

```bash
# Check a specific issue got labeled
gh issue view 1903 --json labels --jq '.labels[].name' | grep "type:"

# Check a specific issue got milestone
gh issue view 1903 --json milestone --jq '.milestone.title'

# Check a specific issue got checklist comment
gh issue view 1903 --json comments --jq '.comments[].body' | grep "Remediation Checklist"
```

### Verification Checklist

- [ ] Random sample of 5 issues have type labels
- [ ] Random sample of 5 issues have milestones
- [ ] Random sample of 5 issues have remediation checklists
- [ ] No unexpected changes found
- [ ] All 250 issues processed

### Download Final Reports

- [ ] Download `.github/reports/remediation/milestone-assignment-*.md`
- [ ] Save for archive
- [ ] Document any issues or unexpected outcomes

---

## Step 6: Verify Final Compliance

### Pre-Verification Checklist

- [ ] Apply workflow completed
- [ ] All changes confirmed
- [ ] Time allocated: 20 minutes
- [ ] Ready for final validation

### Execute Labeling Workflow (Final Validation)

```bash
gh workflow run labeling.yml \
  --ref develop \
  -f dry_run=false \
  -f report_commit=false
```

### Monitor Execution

- [ ] Workflow triggered successfully
- [ ] Comprehensive labeling validation running
- [ ] Check progress in Actions

### Wait for Completion

- [ ] Labeling workflow completes
- [ ] All validation checks pass
- [ ] Final compliance report available

### Final Compliance Checklist

- [ ] Labeling workflow passed
- [ ] Zero errors in labeling
- [ ] All compliance checks passing
- [ ] Reports generated

### Verify 100% Compliance

**Check Metrics:**

- [ ] 250/250 issues have type labels (check a few)
- [ ] 250/250 issues have milestones (check a few)
- [ ] 248+/250 issues have DoR/DoD (verify in epic)
- [ ] Zero non-compliant issues remaining
- [ ] All validation checks passing

**Spot Check Issues:**

```bash
# Check a few random issue numbers
gh issue view 1903 --json number,labels,milestone,body \
  --jq '{number, labels: .labels[].name, milestone: .milestone.title, hasDoR: (.body | contains("Definition of Ready")), hasDod: (.body | contains("Definition of Done"))}'
```

### Success Criteria Met

- [ ] 100% compliance achieved
- [ ] All 250 issues have type labels
- [ ] All 250 issues have milestones
- [ ] 248+/250 have DoR/DoD sections
- [ ] Zero regressions in workflows
- [ ] Zero errors or warnings

---

## Step 7: Close Epic & Document Results

### Update Epic #1376

```bash
# Add completion comment to epic
gh issue comment 1376 --body "## ✅ Execution Complete

All 250 issues remediated with full compliance achieved.

**Metrics:**
- Type labels: 250/250 (100%)
- Milestones: 250/250 (100%)
- DoR/DoD: 248+/250 (99.2%+)
- Compliance: 100%

**Execution Time:** [actual time]
**Executor:** [your name]
**Completion Date:** 2026-07-28

Reports archived in project folder."
```

### Document Results

- [ ] Add completion date to Epic #1376
- [ ] Archive all reports to project folder
- [ ] Note execution time
- [ ] Document any issues found/resolved
- [ ] Create summary of lessons learned (if any)

### Update Project Status

- [ ] Update README.md with completion status
- [ ] Update PROJECT_INDEX.md with completion date
- [ ] Mark Phase 2 as COMPLETE
- [ ] Archive reports

### Notify Team

- [ ] Post completion message to #engineering Slack (optional)
- [ ] Update any project tracking board
- [ ] Share lessons learned
- [ ] Gather feedback on system

### Close Outstanding Tasks

- [ ] Mark Epic #1376 as done/closed
- [ ] Close child issues #1378-#1385
- [ ] Create follow-up issues if needed (e.g., monitoring)

---

## Post-Execution Validation

### System Health Check (Next Day)

- [ ] All 250 issues still have assigned metadata
- [ ] No regressions in new issue creation
- [ ] Enhanced workflow usable and documented
- [ ] No complaints/issues reported

### Team Training (This Week)

- [ ] Team briefed on new issue creation workflow
- [ ] Documentation accessible and linked
- [ ] Support plan active if questions arise

### Metrics Monitoring (Ongoing)

- [ ] Monitor new issues for compliance
- [ ] Track dry-run vs actual differences
- [ ] Gather feedback on system

---

## Rollback Procedure (If Needed)

### If Dry-Run Reveals Issues

1. [ ] Cancel dry-run (no changes made anyway)
2. [ ] Document specific issues in Epic #1376
3. [ ] File GitHub issue for improvement
4. [ ] Fix issue locally
5. [ ] Commit fix to branch
6. [ ] Re-run dry-run
7. [ ] Proceed when satisfied

### If Apply Reveals Issues

1. [ ] Document which issues affected
2. [ ] File GitHub issue(s)
3. [ ] Decide: fix manually or re-run entire workflow
4. [ ] For manual fixes: update issue directly
5. [ ] For systematic issues: fix script + re-run

### Manual Issue Correction

```bash
# If specific issue needs correction:
gh issue edit [issue-number] \
  --add-label "type:task" \
  --milestone "v1.0"
```

---

## Sign-Off

### Execution Sign-Off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Executor | [Name] | 2026-07-28 | [ ] |
| Approver | [Tech Lead] | 2026-07-28 | [ ] |
| Project Owner | Ash Shaw | 2026-07-28 | [ ] |

### Final Status

- [ ] Execution complete and verified
- [ ] All 250 issues remediated
- [ ] 100% compliance achieved
- [ ] Epic #1376 closed
- [ ] Documentation updated
- [ ] Team notified

---

**Project:** Issue Triage Automation System  
**Created:** 2026-07-26  
**Execution Date:** 2026-07-28  
**Status:** ⏳ Ready for Execution

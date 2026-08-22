---
file_type: documentation
title: Minor Release Runbook
description: Step-by-step guide for executing minor releases with manual approval
version: v1.0
last_updated: '2026-08-22'
status: active
stability: stable
domain: governance
owners:
  - Release Engineering Team
tags:
  - release
  - runbook
  - minor
  - automation
---

# Minor Release Runbook v1.0

> Step-by-step guide for releasing minor versions (v1.0.0 → v1.1.0) with manual approval. Estimated time: **10–30 minutes** (includes manual approval window).

## Overview

A minor release adds new features and improvements without breaking changes. The agentic workflow automates version bumping and changelog management, but requires **manual approval from one maintainer** before publishing.

**Scope:** New features and backwards-compatible improvements  
**Approval Gate:** GATE 7 (Approval Enforcement) — requires 1 maintainer review  
**Timeline:** 10–30 minutes (5–10 min automation + 5–20 min human review)  

---

## Pre-Release Checklist

Before triggering a minor release, verify:

- [ ] All features and improvements merged to `develop` branch
- [ ] CHANGELOG.md has [Unreleased] section with feature entries
- [ ] VERSION file contains current release (e.g., 1.0.0)
- [ ] No breaking changes or API removals
- [ ] No uncommitted changes in repository
- [ ] Repository is in a clean, tested state
- [ ] **Identify a maintainer for approval** (communicate beforehand)

**Feature vs. Bug Fix distinction:**
- **Feature (minor):** New capability, new API endpoint, new config option
- **Bug fix (patch):** Fix for existing feature, security patch, performance improvement

**Example changelog entries for minor release:**

```markdown
## [Unreleased]

### Added
- Feature A: New dashboard endpoint for analytics
- Feature B: Support for custom color themes
- Feature C: Webhook retry logic with exponential backoff

### Changed
- Enhanced documentation for API endpoints
- Improved error messages for clarity
- Refactored internal module organization (non-breaking)

### Fixed
- Performance issue with large datasets
```

---

## Pre-Release Communication

### Notify Approver

Before triggering the release, communicate with the designated maintainer:

```
Hi @maintainer-name,

I'm releasing v1.1.0 (minor) in ~5 minutes. It includes:
- [Feature A]
- [Feature B]
- [Feature C]

When Phase 1 completes (~5 min), PR #N will appear for your review.
Please review the changelog and approve if it looks good:
- Confirm all [Unreleased] entries are accurate
- Verify version matches expected (v1.1.0)
- Approve the PR or request changes

Thanks!
```

---

## Phase 1: Version Bump & Changelog (Agent-Automated)

### Step 1: Trigger Release Workflow

Navigate to GitHub Actions and trigger the release workflow:

1. Go to **Actions** tab in the repository
2. Select **Release Automation** workflow
3. Click **Run workflow**
4. Set **Release Scope** to `minor`
5. Set **Dry Run** to `true` (preview mode)
6. Click **Run workflow**

### Step 2: Review Dry-Run Report

The workflow will:
- ✅ Detect repository type
- ✅ Calculate new version (1.0.0 → 1.1.0)
- ✅ Preview changelog roll
- ✅ Preview all 7 safety gates
- ✅ Display agentic confidence score (target ≥ 0.80)
- ✅ Show approval requirements: **"1 maintainer manual review required"**

**Example dry-run output:**

```
[DRY RUN] Release Workflow Preview
═════════════════════════════════

Scope: minor
Current Version: 1.0.0
New Version: 1.1.0

Phase 1 Agent Execution
─────────────────────
✅ Repository type detected: control-plane
✅ Branch created: release/v1.1.0 from develop
✅ VERSION bumped: 1.0.0 → 1.1.0
✅ CHANGELOG rolled: [Unreleased] → [1.1.0] - 2026-08-22
✅ Commit prepared: "chore: Release v1.1.0"
✅ PR #N created: release/v1.1.0 → develop

Phase 2 Safety Gates (Preview)
─────────────────────────────
✅ GATE 1: Pre-flight Checks (VERSION, CHANGELOG, branch)
✅ GATE 2: Agentic Score (0.88/1.0)
✅ GATE 3: Version Consistency (semantic versioning: valid)
✅ GATE 4: Tag Uniqueness (v1.1.0 does not exist)
✅ GATE 5: Authorization (user in maintainers team)
✅ GATE 6: Integrity Filter (gitleaks: no secrets found)
⏳ GATE 7: Approval Enforcement (PENDING: 1 maintainer review required)

Estimated Timeline: ~20-30 minutes (includes review window)
Approval Required: YES (1 maintainer)
Approver: @maintainer-name
```

### Step 3: Verify Dry-Run Passed

If all gates show ✅ or ⏳:
- Proceed to **Step 4: Execute Live Release**
- If any gate shows ❌ (except GATE 7): Stop and check troubleshooting section

### Step 4: Execute Live Release

Re-run the workflow with **Dry Run: false**:

1. Go to **Release Automation** workflow again
2. Click **Run workflow**
3. Set **Release Scope** to `minor`
4. Set **Dry Run** to `false`
5. Click **Run workflow**

---

## Phase 2A: PR Creation & Manual Review (Agent-Automated + Human)

### Step 5: PR #1 Merges to develop

After ~3–5 minutes, the workflow will:

1. **Create and merge PR #1:** `release/v1.1.0 → develop`
   - Displays version and changelog changes
   - Auto-merges to develop (squash merge)
   - Develop branch now contains v1.1.0

2. **Notify approver** (via PR comment or GitHub notification)
   - Approver receives notification that PR #2 requires review

### Step 6: Approver Reviews PR #2

The workflow creates **PR #2** with release notes to merge to `main`. The approver should:

1. **Review the PR:**
   - Go to **Pull Requests** → PR #2 (release/v1.1.0 → main)
   - Review changelog and version changes
   - Verify all [Unreleased] entries match the release

2. **Approve the PR:**
   - Option A (Recommended): Use GitHub "Approve" button in review UI
   - Option B: Comment "LGTM" or "approved" on the PR
   - Option C: Add "approved" label to PR

3. **Timeline:**
   - Must approve within **30 minutes** for timely release
   - If not approved within 60 minutes, release may timeout

**Example approval comment:**

```
✅ Approved for release

Verified:
- Version v1.1.0 correct
- Changelog accurate (3 features, 2 improvements)
- No breaking changes detected
- Release notes formatted correctly

Ready to merge!
```

---

## Phase 2B: Release Publishing (Agent-Automated)

### Step 7: Workflow Detects Approval

After approver approves PR #2, the workflow continues automatically:

1. **Merge PR #2 to main** (squash merge)
   - main branch now contains v1.1.0 code
   - Release notes merged

2. **Apply remaining safety gates:**
   - GATE 6: Integrity Filter ✅ (gitleaks)
   - GATE 7: Approval Enforcement ✅ (approval detected)

3. **Create release tag**
   - Annotated tag `v1.1.0` created and signed
   - Pushed to remote

4. **Publish GitHub Release**
   - Changelog formatted as release notes
   - Pre-release flag: NO (stable release)
   - Version: v1.1.0

### Step 8: Monitor Workflow Log

Watch the workflow run:

1. Go to **Actions** → **Release Automation**
2. Click the running workflow
3. Expand **Phase 2: Safety Gates** section
4. Monitor for:
   - ⏳ Waiting for approval (GATE 7)
   - ✅ Approval detected
   - ✅ PR #2 merging
   - ✅ GitHub Release published

**Typical timeline (total):**
- Phase 1: 3–5 minutes
- PR #1 merge: 1–2 minutes
- Manual review: 5–20 minutes (varies)
- Phase 2B (after approval): 3–5 minutes
- **Total: 15–30 minutes**

---

## Post-Release Steps

### Step 9: Verify GitHub Release

1. Go to **Releases** in repository
2. Verify **v1.1.0** is published
3. Click release and verify:
   - Version tag correct: `v1.1.0`
   - Release notes include new features and improvements
   - Created at timestamp matches release time
   - Pre-release flag is OFF

### Step 10: Post-Release Sync (Automatic)

The workflow automatically triggers post-release sync:

1. Creates branch: `chore/post-release-sync-main-to-develop`
2. Merges `main` → `develop`
3. Verifies sync completed without conflicts

**Verification:**
- Wait 1–2 minutes for sync
- Verify develop branch has latest tag
- No merge conflicts

### Step 11: Communicate Release

Announce the release to team:

```
🎉 **Minor Release v1.1.0 Published**

New features:
- Feature A: [description]
- Feature B: [description]
- Feature C: [description]

Improvements:
- [improvement 1]
- [improvement 2]

Timeline:
- Started: [time]
- Approved by: @maintainer-name
- Published: [time]
- Duration: ~25 minutes

All gates passed ✅
Ready for deployment
```

---

## Approval Workflow Details

### What Approver Should Check

When reviewing PR #2:

1. **Version number**
   - Correct semantic versioning (1.0.0 → 1.1.0)
   - Matches [Unreleased] section header

2. **Changelog accuracy**
   - All features marked with "###  Added"
   - Improvements under "### Changed"
   - Bug fixes under "### Fixed"
   - No missing entries from git commits

3. **Release date**
   - Correct date format (YYYY-MM-DD)
   - Matches today's date

4. **No breaking changes**
   - No API removals
   - No required migrations
   - No deprecated endpoints without fallbacks

### Approval Options

```bash
# Option 1: Use GitHub "Approve" button (recommended)
# Click "Review changes" → "Approve"

# Option 2: Comment approval
# Comment on PR: "LGTM" or "Approved for release"

# Option 3: Add label
# Add label: "approved" or "ready-for-release"
```

### What Happens After Approval

1. Workflow detects approval (1–5 minute detection latency)
2. Automatically merges PR #2 to main
3. Creates git tag v1.1.0
4. Publishes GitHub Release
5. Triggers post-release sync
6. Release complete!

---

## If Approval is Delayed

### Monitoring Approval Status

1. Check PR #2 for approval status
2. Check Actions workflow for "Waiting for approval" state
3. Look for GATE 7 status in workflow logs

### Timeline for Approval

- **< 5 min:** Approver reviewing
- **5–20 min:** Normal review window
- **> 30 min:** Consider reaching out to approver
- **> 60 min:** Workflow may timeout (see troubleshooting)

### If Approver Becomes Unavailable

1. Contact another maintainer for approval
2. They can approve PR #2 to unblock release
3. Release continues automatically after approval

---

## Verification Checklist

After release completes:

- [ ] GitHub Release page shows v1.1.0
- [ ] Release notes include all features
- [ ] Git tag v1.1.0 exists and is signed
- [ ] develop and main branches in sync
- [ ] VERSION file on main shows 1.1.0
- [ ] Post-release sync completed
- [ ] No merge conflicts during sync
- [ ] CI passing on main and develop

---

## Rollback Procedure (If Needed)

### Emergency Rollback (within 1 hour)

If critical issues arise:

1. **Delete the GitHub Release**
2. **Delete the git tag**
   ```bash
   git push origin --delete v1.1.0
   ```
3. **Revert PR #2 commit on main**
4. **Identify root cause**
5. **Create fix in separate branch**
6. **Re-release as v1.1.1 patch**

---

## Common Issues & Solutions

**Issue: Approval not detected (GATE 7 stuck)**
- Ensure approver used one of the approval methods
- Check PR #2 for "Approved" status
- Solution: See RELEASE_TROUBLESHOOTING.md

**Issue: Approver unavailable**
- Contact another maintainer
- They can approve PR #2 to unblock
- Release continues automatically

**Issue: Approval requested changes instead of approving**
- Requested changes block release
- Fix issues mentioned in review
- Re-approve after fixes committed

**Issue: Multiple maintainers approving**
- First approval counts
- Release proceeds automatically
- Subsequent approvals are logged

For more issues, see: [RELEASE_TROUBLESHOOTING.md](./RELEASE_TROUBLESHOOTING.md)

---

## Success Criteria

Minor release is successful when:

✅ Dry-run passed all 7 safety gates  
✅ Approver notified before release  
✅ PR #2 approved by maintainer  
✅ GitHub Release published with correct version  
✅ Release notes include all features  
✅ develop and main branches in sync  
✅ Team notified  

---

## Tips & Best Practices

**Tip 1: Communicate with approver beforehand**
- Send them a heads-up 5 minutes before triggering
- List key features being released
- They can be ready to review immediately

**Tip 2: Keep features organized in CHANGELOG**
- Use "### Added" for all new features
- Use "### Changed" for improvements
- Helps approver verify completeness

**Tip 3: Monitor approval timing**
- Watch PR #2 after Phase 1 completes
- If approval takes > 15 min, check if approver is available
- Reach out if needed

**Tip 4: Use GitHub "Approve" button**
- More reliable than comments
- Officially marks PR as approved
- Workflow detects it immediately

**Tip 5: Keep release window open**
- Don't close browser or leave desk during approval
- Be available to answer clarifying questions
- Ready to address review feedback

---

## Support & Escalation

**For questions:**
- Check [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) for workflow details
- Review [RELEASE_RUNBOOK_PATCH.md](./RELEASE_RUNBOOK_PATCH.md) for patch process (similar)
- Consult [RELEASE_TROUBLESHOOTING.md](./RELEASE_TROUBLESHOOTING.md) for issues

**For issues:**
- Create GitHub issue with `type:bug` label
- Tag Release Engineering team
- Reference this runbook and exact step

**For escalation:**
- If approval not received within 60 minutes, use Phase 4 fallback
- Contact Release Engineering Lead

---

**Phase 9B Deliverable:** Release Workflow Validation & E2E Testing  
**Related Epic:** #2296  
**Runbook Version:** v1.0  
**Last Updated:** 2026-08-22

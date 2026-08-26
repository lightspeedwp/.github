---
file_type: documentation
title: Patch Release Runbook
description: Step-by-step guide for executing patch releases using the agentic release workflow
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
  - patch
  - automation
---

# Patch Release Runbook v1.0

> Step-by-step guide for releasing patch versions (v1.0.0 → v1.0.1) using the two-phase agentic release workflow. Estimated time: **5–10 minutes**.

## Overview

A patch release addresses bug fixes and minor improvements without breaking changes. The agentic workflow automates version bumping and changelog management, then applies 7-layer safety validation before publishing.

**Scope:** Patch releases automatically approve and publish (no manual approval required)  
**Approval Gate:** GATE 7 (Approval Enforcement) — auto-approved for patch scope  
**Timeline:** 5–10 minutes from trigger to GitHub Release published

---

## Pre-Release Checklist

Before triggering a patch release, verify:

- [ ] All bug fixes and improvements merged to `develop` branch
- [ ] CHANGELOG.md has [Unreleased] section with entries
- [ ] VERSION file contains current release (e.g., 1.0.0)
- [ ] No uncommitted changes in repository
- [ ] Repository is in a clean, tested state
- [ ] Team is available to monitor (optional, but recommended)

**Example checklist validation:**

```bash
# Check develop is up-to-date
git fetch origin
git checkout develop
git pull origin develop

# Verify VERSION file
cat VERSION  # Should show current version (e.g., 1.0.0)

# Verify CHANGELOG.md structure
grep -A 10 "## \[Unreleased\]" CHANGELOG.md
```

---

## Phase 1: Version Bump & Changelog (Agent-Automated)

### Step 1: Trigger Release Workflow

Navigate to GitHub Actions and trigger the release workflow:

1. Go to **Actions** tab in the repository
2. Select **Release Automation** workflow
3. Click **Run workflow**
4. Set **Release Scope** to `patch`
5. Set **Dry Run** to `true` (preview mode)
6. Click **Run workflow**

**URL shortcut:** `https://github.com/lightspeedwp/.github/actions/workflows/release.yml`

### Step 2: Review Dry-Run Report

The workflow will:

- ✅ Detect repository type
- ✅ Calculate new version (1.0.0 → 1.0.1)
- ✅ Preview changelog roll
- ✅ Preview all 7 safety gates
- ✅ Display agentic confidence score (target ≥ 0.80)
- ✅ Show estimated approval requirements

**Example dry-run output:**

```
[DRY RUN] Release Workflow Preview
═════════════════════════════════

Scope: patch
Current Version: 1.0.0
New Version: 1.0.1

Phase 1 Agent Execution
─────────────────────
✅ Repository type detected: control-plane
✅ Branch created: release/v1.0.1 from develop
✅ VERSION bumped: 1.0.0 → 1.0.1
✅ CHANGELOG rolled: [Unreleased] → [1.0.1] - 2026-08-22
✅ Commit prepared: "chore: Release v1.0.1"
✅ PR #N created: release/v1.0.1 → develop

Phase 2 Safety Gates (Preview)
─────────────────────────────
✅ GATE 1: Pre-flight Checks (VERSION, CHANGELOG, branch)
✅ GATE 2: Agentic Score (0.92/1.0)
✅ GATE 3: Version Consistency (semantic versioning: valid)
✅ GATE 4: Tag Uniqueness (v1.0.1 does not exist)
✅ GATE 5: Authorization (user in maintainers team)
✅ GATE 6: Integrity Filter (gitleaks: no secrets found)
✅ GATE 7: Approval Enforcement (patch auto-approved)

Estimated Timeline: ~5-10 minutes
Approval Required: NO (auto-approved)
```

### Step 3: Verify Dry-Run Passed

If all gates show ✅:

- Proceed to **Step 4: Execute Live Release**
- If any gate shows ❌: Stop and check troubleshooting section

### Step 4: Execute Live Release

Re-run the workflow with **Dry Run: false**:

1. Go to **Release Automation** workflow again
2. Click **Run workflow**
3. Set **Release Scope** to `patch`
4. Set **Dry Run** to `false`
5. Click **Run workflow**

---

## Phase 2: Safety Gates & Publishing (Agent-Automated)

### Step 5: Monitor Release Progress

The workflow will automatically:

1. **Create PR #1:** `release/v1.0.1 → develop`
   - Displays version and changelog changes
   - Auto-reviewable for 1–2 minutes

2. **Merge PR #1 to develop** (squash merge)
   - Develop branch now contains v1.0.1 + updated CHANGELOG
   - Mergify queue handles sequencing

3. **Apply Safety Gates** (7-layer validation)
   - GATE 1: Pre-flight Checks ✅
   - GATE 2: Agentic Score ✅
   - GATE 3: Version Consistency ✅
   - GATE 4: Tag Uniqueness ✅
   - GATE 5: Authorization ✅
   - GATE 6: Integrity Filter ✅
   - GATE 7: Approval Enforcement ✅ (auto-approved)

4. **Create PR #2:** `release/v1.0.1 → main`
   - Contains compiled release notes
   - Auto-merges to main (squash merge)

5. **Create Release Tag**
   - Annotated tag `v1.0.1` created and signed
   - Pushed to remote

6. **Publish GitHub Release**
   - Changelog formatted as release notes
   - Pre-release flag: NO (stable release)
   - Version: v1.0.1

### Step 6: Monitor Workflow Log

Watch the workflow run:

1. Go to **Actions** → **Release Automation**
2. Click the running workflow
3. Expand **Phase 1: Version Bump** and **Phase 2: Safety Gates** sections
4. Monitor for:
   - ✅ All gates passing
   - ✅ PRs merging automatically
   - ✅ GitHub Release published

**Typical timeline:**

- Phase 1 (version bump): 1–2 minutes
- PR #1 merge: 2–3 minutes
- Phase 2 (safety gates): 2–3 minutes
- PR #2 merge: 1–2 minutes
- GitHub Release: < 1 minute
- **Total: 5–10 minutes**

---

## Post-Release Steps

### Step 7: Verify GitHub Release

1. Go to **Releases** in repository
2. Verify **v1.0.1** is published
3. Click release and verify:
   - Version tag correct: `v1.0.1`
   - Release notes include changelog entries
   - Created at timestamp matches release time
   - Pre-release flag is OFF (unchecked)

**URL shortcut:** `https://github.com/lightspeedwp/.github/releases`

### Step 8: Post-Release Sync (Automatic)

The workflow automatically triggers post-release sync:

1. Creates branch: `chore/post-release-sync-main-to-develop`
2. Merges `main` → `develop` (brings tags and release notes)
3. Creates PR to `develop`
4. Merges PR automatically

**Verification:**

- Wait 1–2 minutes for sync to complete
- Verify develop branch is in sync with main
- Both branches point to same version commit

### Step 9: Communicate Release

Announce the release to team:

```
🚀 **Patch Release v1.0.1 Published**

What's included:
- [List key bug fixes from changelog]

Timeline:
- Started: [time]
- Published: [time]
- Duration: ~10 minutes

All gates passed ✅
No issues encountered
```

---

## Verification Checklist

After release completes, verify:

- [ ] GitHub Release page shows v1.0.1
- [ ] Release notes include changelog entries
- [ ] Git tag v1.0.1 exists and is signed
- [ ] develop and main branches in sync
- [ ] VERSION file on main shows 1.0.1
- [ ] CHANGELOG.md has [1.0.1] section with date
- [ ] Post-release sync completed without conflicts
- [ ] CI passing on main and develop

**Quick verification:**

```bash
# Check tag exists
git fetch origin
git tag | grep v1.0.1

# Check version on main
git checkout main
git pull origin main
cat VERSION  # Should show 1.0.1

# Check develop in sync
git checkout develop
git log --oneline -5
# Should include merge commit from main
```

---

## Rollback Procedure (If Needed)

If critical issues are discovered immediately after release:

### Emergency Rollback (within 1 hour)

1. **Stop the release** (prevent further distribution)
2. **Delete the GitHub Release**
   - Go to Releases
   - Click v1.0.1 release
   - Click "Delete" button
3. **Delete the git tag**

   ```bash
   git push origin --delete v1.0.1
   ```

4. **Revert PR #2 commit on main**

   ```bash
   git checkout main
   git pull origin main
   git revert -m 1 <merge-commit-sha>
   git push origin main
   ```

5. **Optional: Bump version down on develop** if needed for next release

### Analysis & Prevention

1. Identify root cause
2. Create fix in separate branch
3. Merge fix to develop
4. Re-release as v1.0.2 patch

---

## Common Issues & Solutions

**Issue: Workflow stuck on "Waiting for approval"**

- This should NOT happen for patch releases (auto-approved)
- Check: GATE 7 configuration and user authorization
- Solution: See RELEASE_TROUBLESHOOTING.md, "Approval gates failing"

**Issue: Version conflict (tag already exists)**

- Another release for v1.0.1 may have started
- Check: GATE 4 would have caught this (should prevent)
- Solution: Verify no other release in progress; use v1.0.2 for retry

**Issue: Changelog validation failed**

- CHANGELOG.md missing [Unreleased] section or malformed
- Check: Pre-release checklist (Step 1)
- Solution: Fix CHANGELOG.md manually, commit to develop, retry

**Issue: Authorization denied**

- User not in maintainers team
- Solution: Contact Release Engineering team to add user to team

For more issues, see: [RELEASE_TROUBLESHOOTING.md](./RELEASE_TROUBLESHOOTING.md)

---

## Success Criteria

Patch release is successful when:

✅ Dry-run passed all 7 safety gates  
✅ Live release executed without errors  
✅ GitHub Release published with correct version and notes  
✅ Git tag v1.0.1 created and signed  
✅ develop and main branches in sync  
✅ Post-release sync completed  
✅ Team notified  

---

## Tips & Best Practices

**Tip 1: Always do dry-run first**

- Preview all gates before live release
- Catches issues before mutations

**Tip 2: Monitor the workflow log**

- Each phase logs detailed steps
- Easier to diagnose if something fails

**Tip 3: Verify CHANGELOG before triggering**

- Check [Unreleased] section has entries
- Prevents "missing changelog" failures

**Tip 4: Communicate timing to team**

- Release takes 5–10 minutes
- Avoid other deployments during release
- Notify stakeholders when live

**Tip 5: Keep post-release sync quick**

- Sync automatically merges main → develop
- Usually completes within 2 minutes
- Verify completion before moving on

---

## Support & Escalation

**For questions:**

- Check [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) for workflow details
- Review [RELEASE_E2E_TEST_PLAN.md](../RELEASE_E2E_TEST_PLAN.md) for test scenarios
- Consult [RELEASE_TROUBLESHOOTING.md](./RELEASE_TROUBLESHOOTING.md) for common issues

**For issues:**

- Create GitHub issue in `.github` repo with `type:bug` label
- Tag Release Engineering team (@lightspeedwp/maintainers)
- Reference this runbook and exact step where issue occurred

**For escalation:**

- If release blocked for >15 minutes, use Phase 4 fallback
- Contact Release Engineering Lead for authorization override

---

**Phase 9B Deliverable:** Release Workflow Validation & E2E Testing  
**Related Epic:** #2296  
**Runbook Version:** v1.0  
**Last Updated:** 2026-08-22

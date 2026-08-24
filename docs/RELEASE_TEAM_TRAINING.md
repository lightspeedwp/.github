---
file_type: documentation
title: Release Workflow Team Training Guide
description: Comprehensive training materials for release engineering team on agentic release workflow
version: v1.0
last_updated: '2026-08-22'
status: active
stability: stable
domain: training
owners:
  - Release Engineering Team
tags:
  - training
  - release
  - runbook
  - team
---

# Release Workflow Team Training Guide v1.0

> Comprehensive training materials for Release Engineering team covering all three release types (patch, minor, major) using the two-phase agentic workflow.

---

## Table of Contents

1. [Overview & Learning Objectives](#overview--learning-objectives)
2. [Pre-Training Checklist](#pre-training-checklist)
3. [Module 1: Release Fundamentals](#module-1-release-fundamentals)
4. [Module 2: Patch Release Training](#module-2-patch-release-training)
5. [Module 3: Minor Release Training](#module-3-minor-release-training)
6. [Module 4: Major Release Training](#module-4-major-release-training)
7. [Module 5: Troubleshooting & Recovery](#module-5-troubleshooting--recovery)
8. [Certification & Sign-Off](#certification--sign-off)
9. [Post-Training Resources](#post-training-resources)

---

## Overview & Learning Objectives

### What You'll Learn

By completing this training, team members will be able to:

✅ Understand the two-phase agentic release workflow  
✅ Execute patch releases (5–10 minutes, fully automated)  
✅ Execute minor releases with manual approval (10–30 minutes)  
✅ Execute major releases with dual approval and ADR (30–120 minutes)  
✅ Identify and resolve common release issues  
✅ Perform emergency rollback procedures  
✅ Use dry-run mode to preview releases before going live  

### Release Scope Quick Reference

| Release Type | Version Change | Timeline | Approval | Use Case |
|---|---|---|---|---|
| **Patch** | 1.0.0 → 1.0.1 | 5–10 min | Auto-approved | Bug fixes, security patches, performance improvements |
| **Minor** | 1.0.0 → 1.1.0 | 10–30 min | 1 maintainer | New features, backwards-compatible improvements |
| **Major** | 1.0.0 → 2.0.0 | 30–120 min | 2 maintainers + ADR | Breaking changes, API removals, major refactors |

### Two-Phase Workflow Architecture

```
Phase 1: Agent-Automated (Version Bump & Changelog)
├─ Detect repository type
├─ Create release branch from develop
├─ Bump VERSION file
├─ Roll changelog from [Unreleased] to [X.Y.Z]
├─ Create commit: "chore: Release vX.Y.Z"
└─ Create PR #1: release/vX.Y.Z → develop

        ↓
        
Phase 2: Safety Gates & Publishing
├─ GATE 1: Pre-flight Checks (VERSION, CHANGELOG, branch validation)
├─ GATE 2: Agentic Score (0.80+ confidence required)
├─ GATE 3: Version Consistency (semantic versioning validation)
├─ GATE 4: Tag Uniqueness (v1.0.1 does not exist)
├─ GATE 5: Authorization (user in maintainers team)
├─ GATE 6: Integrity Filter (gitleaks: no secrets detected)
├─ GATE 7: Approval Enforcement (patch auto-approved, minor/major manual)
├─ Merge PR #1 → develop
├─ Create PR #2: release/vX.Y.Z → main
├─ Await approval if required
├─ Merge PR #2 → main
├─ Create signed git tag vX.Y.Z
├─ Publish GitHub Release
└─ Trigger post-release sync (main → develop)
```

---

## Pre-Training Checklist

Before attending training, ensure:

- [ ] You have GitHub access to the `lightspeedwp/.github` repository
- [ ] You are a member of the `@lightspeedwp/maintainers` team
- [ ] You have `git` and GitHub CLI (`gh`) installed locally
- [ ] You have read [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) overview
- [ ] You have access to all three release runbooks:
  - [RELEASE_RUNBOOK_PATCH.md](./RELEASE_RUNBOOK_PATCH.md)
  - [RELEASE_RUNBOOK_MINOR.md](./RELEASE_RUNBOOK_MINOR.md)
  - [RELEASE_RUNBOOK_MAJOR.md](./RELEASE_RUNBOOK_MAJOR.md)
- [ ] You have read [RELEASE_TROUBLESHOOTING.md](./RELEASE_TROUBLESHOOTING.md)

**Quick access check:**

```bash
# Verify GitHub CLI is installed
gh --version

# Verify you're in maintainers team
gh api /orgs/lightspeedwp/teams/maintainers/members/$(git config user.name)

# List available workflows
gh workflow list --repo lightspeedwp/.github | grep release
```

---

## Module 1: Release Fundamentals

### 1.1 Release Workflow Overview (10 minutes)

**Key Concepts:**

- **Semantic Versioning (SemVer):** MAJOR.MINOR.PATCH (e.g., 2.3.1)
  - MAJOR: Breaking changes (increment when API or behaviour changes)
  - MINOR: New features, backwards-compatible (increment for new capabilities)
  - PATCH: Bug fixes, security patches (increment for fixes)

- **Release Scope Determination:**
  - Check git commits since last release: `git log v1.0.0..develop --oneline`
  - Count feature vs. fix commits
  - Identify any breaking changes (marked with ⚠️ or [BREAKING])
  - Determine scope: patch (all fixes), minor (features + fixes), major (breaking changes)

- **Pre-Release Preparation:**
  - Verify `CHANGELOG.md` has `[Unreleased]` section
  - Verify `VERSION` file has current version
  - Confirm no uncommitted changes: `git status`
  - Confirm develop branch is up-to-date: `git pull origin develop`

### 1.2 Safety Gates Explained (15 minutes)

**Understanding the 7 Safety Gates:**

| Gate | Purpose | Failure Reason | Recovery |
|------|---------|-----------------|----------|
| **GATE 1** | Pre-flight validation | VERSION missing, CHANGELOG malformed, branch error | Fix files, commit, retry |
| **GATE 2** | Agentic confidence score | Score < 0.80 (rare; indicates data quality issues) | Review agentic logs; escalate if recurring |
| **GATE 3** | Version semantics validation | Invalid version format (e.g., "1.2" instead of "1.2.0") | Fix VERSION file, retry |
| **GATE 4** | Git tag uniqueness | Tag v1.0.1 already exists | Increment patch version, retry |
| **GATE 5** | Authorization check | User not in maintainers team | Contact Release Lead to add user to team |
| **GATE 6** | Integrity (gitleaks) | Secrets detected in commit | Remove secrets, commit removal, retry dry-run |
| **GATE 7** | Approval enforcement | (Patch: auto-approved, Minor: awaiting approval, Major: dual approval) | For minor/major: await or provide approval |

**How Gates Protect Us:**

```
Dry-Run Mode                Live Mode
════════════════════════════════════════════════════════════
Preview all gates       →   Execute gates one by one
Show potential issues    →   Halt on first failure
No mutations             →   Mutations only if gates pass
Safe to run many times   →   Commit to repository
```

### 1.3 Authorization & Team Roles (10 minutes)

**Required Role: Maintainer**

- **Who can trigger releases?** Members of `@lightspeedwp/maintainers` GitHub team
- **How to verify?** `gh api /orgs/lightspeedwp/teams/maintainers/members`
- **Need access?** Contact Release Engineering Lead

**Approval Responsibility by Release Type:**

- **Patch:** No human approval (auto-approved by GATE 7)
- **Minor:** 1 maintainer review required (review PR #2 for changelog accuracy)
- **Major:** 2 maintainers + Architecture Decision Record (ADR) linking required

---

## Module 2: Patch Release Training

### 2.1 When to Use Patch (10 minutes)

**Patch Release Criteria:**

Use patch when:

- ✅ Releasing bug fixes only (no new features)
- ✅ Releasing security patches
- ✅ Releasing performance improvements
- ✅ All changes are backwards-compatible
- ✅ No API changes or removals

**Example Changelog for Patch:**

```markdown
## [Unreleased]

### Fixed
- Fixed null pointer exception in widget rendering
- Fixed memory leak in connection pool
- Fixed CSS selector conflict with theme
- Security: Closed XSS vulnerability in user input sanitization

### Changed
- Optimized database queries for 40% improvement on large datasets
```

### 2.2 Patch Release Step-by-Step (20 minutes)

**Dry-Run (Always Do This First)**

```bash
# 1. Verify develop is up-to-date
git checkout develop
git pull origin develop

# 2. Verify CHANGELOG has [Unreleased] section
grep -A 5 "## \[Unreleased\]" CHANGELOG.md

# 3. Check VERSION file
cat VERSION  # Should show current version (e.g., 1.0.0)

# 4. Verify no uncommitted changes
git status  # Should show "working tree clean"

# 5. Trigger dry-run via GitHub Actions
gh workflow run release.yml \
  -f scope=patch \
  -f dry_run=true
```

**Wait for Dry-Run (1–2 minutes)**

1. Go to Actions tab: `https://github.com/lightspeedwp/.github/actions/workflows/release.yml`
2. Click the running workflow
3. Expand logs and look for:
   - ✅ All gates showing pass (or ⏳ for auto-approve)
   - ✅ Agentic score ≥ 0.80
   - ✅ "Approval Required: NO (auto-approved)"

**Review Dry-Run Report**

```
Expected output (example):
═════════════════════════════════
Scope: patch
Current Version: 1.0.0
New Version: 1.0.1

✅ Repository type detected: control-plane
✅ GATE 1: Pre-flight Checks
✅ GATE 2: Agentic Score (0.92/1.0)
✅ GATE 3: Version Consistency
✅ GATE 4: Tag Uniqueness
✅ GATE 5: Authorization
✅ GATE 6: Integrity Filter
✅ GATE 7: Approval Enforcement (patch auto-approved)

Estimated Timeline: ~5-10 minutes
Approval Required: NO
```

**Live Execution (If Dry-Run Passed)**

```bash
# 1. Trigger live release
gh workflow run release.yml \
  -f scope=patch \
  -f dry_run=false

# 2. Monitor workflow
# Go to Actions tab and watch progress (5–10 minutes)

# 3. Verify GitHub Release was published
gh release view v1.0.1  # Should show published release
```

### 2.3 Patch Release Verification (5 minutes)

**Post-Release Checklist:**

```bash
# 1. Verify tag exists
git fetch origin
git tag | grep v1.0.1

# 2. Verify develop has new commit
git checkout develop
git pull origin develop
git log --oneline -3  # Should show "Release v1.0.1" commit

# 3. Verify main has release
git checkout main
git pull origin main
cat VERSION  # Should show 1.0.1

# 4. Check GitHub Release
gh release view v1.0.1 --web  # Opens browser
```

**Expected Result:**

- ✅ GitHub Release published with changelog notes
- ✅ Git tag v1.0.1 signed and pushed
- ✅ Both develop and main branches have new commits
- ✅ VERSION file on main shows v1.0.1
- ✅ Post-release sync completed without conflicts

---

## Module 3: Minor Release Training

### 3.1 When to Use Minor (10 minutes)

**Minor Release Criteria:**

Use minor when:

- ✅ Adding new features (backwards-compatible)
- ✅ Adding new configuration options
- ✅ Adding new API endpoints
- ✅ Improvements to existing features (non-breaking)
- ❌ NOT making breaking changes
- ❌ NOT removing APIs or configurations

**Example Changelog for Minor:**

```markdown
## [Unreleased]

### Added
- New dashboard endpoint for analytics data
- Support for custom color themes via config option
- Webhook retry logic with exponential backoff (3 retries)

### Changed
- Enhanced error messages for better debugging
- Improved API documentation
- Refactored internal module structure (non-breaking)

### Fixed
- Fixed performance issue with large datasets
```

### 3.2 Pre-Release Communication (10 minutes)

**Critical for Minor: Notify Approver Beforehand**

Before triggering the release, communicate with the designated maintainer:

```
Example Message:

Hi @maintainer-name,

I'm releasing v1.1.0 (minor) in ~5 minutes. It includes:
- Dashboard analytics endpoint
- Custom theme color support
- Webhook retry mechanism

When Phase 1 completes (~5 min), PR #N will appear for your review.
Please review the changelog and approve if it looks good:
- Confirm all [Unreleased] entries are accurate
- Verify version matches expected (v1.1.0)
- Approve the PR or request changes

Thanks!
```

**Why This Matters:**

- Gives approver a heads-up (they can be ready immediately)
- Lists key features for context (avoids surprises)
- Reduces total release time (10–30 min vs. longer with delays)

### 3.3 Minor Release Step-by-Step (25 minutes)

**Preparation**

```bash
# 1. Identify and notify approver
# Send message per template above

# 2. Verify develop is up-to-date
git checkout develop
git pull origin develop

# 3. Verify CHANGELOG [Unreleased] has feature entries
grep -A 15 "## \[Unreleased\]" CHANGELOG.md
# Should show ### Added section with features
```

**Dry-Run**

```bash
# 1. Trigger dry-run (same as patch)
gh workflow run release.yml \
  -f scope=minor \
  -f dry_run=true

# 2. Wait for dry-run to complete (1–2 minutes)

# 3. Review output - look for:
#    - ✅ All gates passing
#    - ⏳ GATE 7: "1 maintainer manual review required"
```

**Approver Notified → Begins Review**

After Phase 1 completes:

- PR #1 auto-merges to develop ✅
- PR #2 appears for approver review ⏳
- Workflow waits for approval on PR #2

**Approver Actions (5–20 minutes)**

1. **Review PR #2** (`release/v1.1.0 → main`)
2. **Check these items:**
   - Version number correct (matches changelog header)
   - All [Unreleased] entries are accurate
   - Release date is today
   - No breaking changes
3. **Approve using one of:**
   - Click "Approve" in PR review UI ✅ (recommended)
   - Comment "LGTM" or "Approved" on PR
   - Add "approved" label
4. **Timeline:** Must approve within 30 min for timely release

**Workflow Continues After Approval**

Once approval detected:

- PR #2 merges to main ✅
- Git tag v1.1.0 created and signed ✅
- GitHub Release published ✅
- Post-release sync triggered ✅

### 3.4 Minor Release Verification (5 minutes)

Same as patch (see Module 2.3), but confirm:

- Version: v1.1.0 (not v1.0.1)
- Changelog has features listed
- Approver's approval visible in PR history

---

## Module 4: Major Release Training

### 4.1 When to Use Major (10 minutes)

**Major Release Criteria:**

Use major when:

- ✅ Making breaking changes to APIs
- ✅ Removing deprecated features
- ✅ Changing required configuration
- ✅ Database schema changes requiring migration
- ✅ Significant internal restructuring affecting users
- ❌ Cannot be backwards-compatible

**Example: When Major is Needed**

```markdown
## Breaking Changes

### Removed
- ⚠️ Removed deprecated widget API (removed in v1.5.0, now deleted)
- ⚠️ Removed support for PHP 7.4 (now requiring PHP 8.0+)

### Changed (Breaking)
- ⚠️ Changed authentication schema (all users require re-login)
- ⚠️ Changed database structure (migration required)

## Migration Guide

Users upgrading from v1.x.x to v2.0.0 must:

1. Back up database
2. Run migration script: `wp migrate 1.x.x -> 2.0.0`
3. Re-authenticate all users
4. Update theme configuration
```

### 4.2 Architecture Decision Record (ADR) Requirement (15 minutes)

**What is an ADR?**

- Document that explains WHY a major decision was made
- Records breaking changes and rationale
- Example: "Why we removed PHP 7.4 support" or "Why we changed authentication"
- **Status must be "Accepted"** before major release

**ADR Location & Format:**

```
Path: docs/adr/NNNN-short-title.md

Example: docs/adr/0042-require-php-8-0.md

Format:
───────────────────────────────────────
# ADR-42: Require PHP 8.0 Minimum

## Status
Accepted (2026-08-20)

## Context
PHP 7.4 reaches end-of-life in November 2026.
Supporting it adds maintenance burden.

## Decision
Drop PHP 7.4 support; require PHP 8.0+.

## Consequences
- Users on older hosts must upgrade
- We can use PHP 8.0 features (typed properties, match, etc.)
- Reduces code complexity

## Rationale
Cleaner codebase, reduced maintenance costs.
Aligns with industry standards.
───────────────────────────────────────
```

**Required for Major Release:**

1. Create ADR if not already present
2. Ensure ADR status is "Accepted"
3. Record ADR path or issue number
4. Include ADR reference in commit message
5. Link ADR in CHANGELOG

### 4.3 Major Release Step-by-Step (30 minutes)

**Pre-Release Requirements**

```bash
# 1. Ensure ADR exists and is Accepted
# Location: docs/adr/NNNN-short-title.md
# Status: "Accepted"

# 2. Update CHANGELOG with breaking changes
# Use ⚠️ emoji for breaking items
grep -A 20 "## \[Unreleased\]" CHANGELOG.md
# Should show "### Removed" and "### Changed (Breaking)"

# 3. Verify VERSION bump is major
cat VERSION  # Current: 1.x.x, Next: 2.0.0

# 4. Notify both approvers
# Send messages to maintainer 1 and maintainer 2 with ADR link
```

**Dry-Run**

```bash
# 1. Trigger dry-run
gh workflow run release.yml \
  -f scope=major \
  -f dry_run=true

# 2. Review output - look for:
#    - ✅ All gates passing
#    - ⏳ GATE 7: "2 maintainers + ADR verification required"
```

**Approval Phase (1–4 hours)**

1. **Both approvers review:**
   - PR #2 (`release/v2.0.0 → main`)
   - CHANGELOG breaking changes listed
   - ADR linked in commit message
   - Migration guide included

2. **Approval requires:**
   - Both maintainers click "Approve"
   - Both approval reviews visible in PR

3. **Workflow waits for:**
   - 2 approvals received
   - ADR verification passed
   - All safety gates green

**Workflow Continues After Dual Approval**

Same as minor: PR merges, tag created, release published.

### 4.4 Major Release Verification (5 minutes)

Same as patch/minor (see Module 2.3 & 3.4), plus:

- Version is major increment (v1.x.x → v2.0.0)
- CHANGELOG clearly marks breaking changes with ⚠️
- ADR linked in release notes or commit message
- Users have migration guide

---

## Module 5: Troubleshooting & Recovery

### 5.1 Common Issues & Quick Fixes (20 minutes)

**Issue: CHANGELOG missing [Unreleased] section**

```
Error: CHANGELOG validation failed
Reason: No [Unreleased] section found

Fix:
1. Open CHANGELOG.md
2. Add at top (before current version):
   ## [Unreleased]

   ### Added
   - (none yet)
3. Commit: git commit -am "chore: Add [Unreleased] section"
4. Push: git push origin develop
5. Retry dry-run
```

**Issue: VERSION file malformed**

```
Error: VERSION format invalid
Reason: VERSION contains "1.0" instead of "1.0.0"

Fix:
1. Open VERSION file
2. Ensure format: MAJOR.MINOR.PATCH (e.g., 1.0.0)
3. Commit: git commit -am "chore: Fix VERSION format"
4. Push: git push origin develop
5. Retry dry-run
```

**Issue: Git tag v1.0.1 already exists**

```
Error: GATE 4 failed: Tag v1.0.1 already exists

Reason: Release already created, or tag not deleted

Fix Option 1: Delete old tag (if release was mistake)
$ git push origin --delete v1.0.1
$ git tag -d v1.0.1
$ Retry with dry-run

Fix Option 2: Increment patch (if releasing again)
$ Increment VERSION: 1.0.0 → 1.0.2
$ Update CHANGELOG header: [1.0.2]
$ Commit and retry dry-run
```

**Issue: Secrets detected (GATE 6 failure)**

```
Error: GATE 6 failure: gitleaks detected secrets
Reason: API key, password, or token in commit

Fix:
1. Identify the problematic file from gitleaks output
2. Remove secret: edit file, delete sensitive value
3. Commit: git commit -am "chore: Remove exposed secret"
4. (Optional) Rotate the secret in production
5. Push: git push origin develop
6. Retry dry-run
```

**Issue: Approval not detected (stuck on GATE 7)**

```
Error: Release stuck in "Waiting for approval"
Reason: Approval comment/review not detected

Fix:
1. For MINOR/MAJOR: Ensure maintainer approved PR #2
2. Check approval method:
   - Click "Approve" button in review UI (most reliable)
   - NOT just commenting "approved"
3. Verify PR status shows "Approved" in PR header
4. Wait 1–5 minutes (workflow checks every minute)
5. If still stuck after 10 min, check workflow logs for errors

See RELEASE_TROUBLESHOOTING.md for detailed diagnostics
```

### 5.2 Emergency Rollback (15 minutes)

**When to Rollback:**

- 🚨 Critical bug discovered immediately after release
- 🚨 Data loss or security vulnerability exposed
- 🚨 Release published to wrong branch

**Rollback Procedure (Within 1 Hour):**

```bash
# 1. Delete GitHub Release
#    Go to Releases page → click v1.0.1 → Delete

# 2. Delete git tag
git push origin --delete v1.0.1
git tag -d v1.0.1

# 3. Revert PR #2 commit on main
git checkout main
git pull origin main
# Find the merge commit for the release PR
git log --oneline | grep -i "release\|merge"
# Revert it (example: abc1234 is the merge commit)
git revert -m 1 abc1234
git push origin main

# 4. Identify root cause
# Look at PR diff for what caused the issue

# 5. Create fix in separate branch
git checkout develop
git pull origin develop
git checkout -b fix/critical-issue-v1-0-1
# Make fixes...
git commit -am "fix: Critical issue in v1.0.1"
git push -u origin fix/critical-issue-v1-0-1
# Create PR and merge

# 6. Re-release as patch
# v1.0.2 (not v1.0.1 again)
# Follow patch release process
```

**After Rollback:**

1. Communicate to team: "Release rolled back, fix in progress"
2. Fix issue in separate branch
3. Merge fix to develop
4. Re-release as next patch version (v1.0.2)
5. Document what went wrong in post-mortem

---

## Certification & Sign-Off

### Training Completion Checklist

Team members must complete all sections:

- [ ] Module 1: Release Fundamentals (understood safety gates)
- [ ] Module 2: Patch Release (can execute independently)
- [ ] Module 3: Minor Release (can execute with approver coordination)
- [ ] Module 4: Major Release (understands ADR requirement and dual approval)
- [ ] Module 5: Troubleshooting (familiar with common issues)
- [ ] Hands-on: Successfully executed test release (see below)
- [ ] Certification: Signed off by Release Lead

### Hands-On Practice Release

**Practice Release (Recommended):**

1. Clone test repository: `git clone https://github.com/lightspeedwp/test-releases.git`
2. Execute patch release following Module 2 steps
3. Verify release published successfully
4. Execute minor release following Module 3 steps
5. Execute major release following Module 4 steps

**Metrics:**

- ✅ All dry-runs pass
- ✅ All live releases complete without manual intervention
- ✅ Release verification passes (tags, versions, GitHub release)

### Certification Sign-Off Form

```markdown
# Release Engineer Certification

**Name:** [Employee Name]
**Date:** [Completion Date]
**Release Lead:** [Approver Name]

## Training Completed

- [ ] Module 1: Release Fundamentals
- [ ] Module 2: Patch Release Training
- [ ] Module 3: Minor Release Training
- [ ] Module 4: Major Release Training
- [ ] Module 5: Troubleshooting & Recovery

## Hands-On Practice

- [ ] Successfully executed test patch release
- [ ] Successfully executed test minor release
- [ ] Successfully executed test major release
- [ ] All dry-runs completed successfully

## Competency Verification

- [ ] Can identify correct release scope (patch/minor/major)
- [ ] Can execute patch release independently
- [ ] Can coordinate minor release approval
- [ ] Understands ADR requirement for major releases
- [ ] Can troubleshoot common issues using guides

## Sign-Off

**Trainee Signature:** ________________________ **Date:** ________

**Release Lead Signature:** ____________________ **Date:** ________

---

Certified team member is authorized to trigger releases on:
- [List of authorized repositories]

Certification valid until: [Date + 1 year or when major changes made]
```

---

## Post-Training Resources

### Reference Documents

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) | High-level workflow overview | Planning a release |
| [RELEASE_RUNBOOK_PATCH.md](./RELEASE_RUNBOOK_PATCH.md) | Patch release step-by-step | Executing patch release |
| [RELEASE_RUNBOOK_MINOR.md](./RELEASE_RUNBOOK_MINOR.md) | Minor release step-by-step | Executing minor release |
| [RELEASE_RUNBOOK_MAJOR.md](./RELEASE_RUNBOOK_MAJOR.md) | Major release step-by-step | Executing major release |
| [RELEASE_TROUBLESHOOTING.md](./RELEASE_TROUBLESHOOTING.md) | Common issues & solutions | Debugging release problems |
| [AGENTIC_RELEASE_USER_GUIDE.md](./AGENTIC_RELEASE_USER_GUIDE.md) | End-user guide | Understanding workflow details |
| [AGENTIC_RELEASE_ADMIN_GUIDE.md](./AGENTIC_RELEASE_ADMIN_GUIDE.md) | Admin procedures | Configuring releases or debugging workflow |

### Quick Command Reference

```bash
# Check your authorization
gh api /orgs/lightspeedwp/teams/maintainers/members/$(git config user.name)

# Verify develop is ready
git checkout develop && git pull origin develop && git status

# View available workflows
gh workflow list --repo lightspeedwp/.github | grep release

# Trigger dry-run (patch example)
gh workflow run release.yml -f scope=patch -f dry_run=true

# Check workflow status
gh run list --workflow release.yml --limit 5

# View latest release
gh release view --repo lightspeedwp/.github

# Get help
gh workflow run --help
gh release --help
```

### Support Escalation

**Level 1: Check Documentation**

- Re-read the relevant runbook section
- Check RELEASE_TROUBLESHOOTING.md for your issue
- Review "Common Issues & Solutions" in Module 5

**Level 2: Review Workflow Logs**

```bash
# Get latest release run
gh run list --workflow release.yml --limit 1

# View full logs
gh run view <run-id> --log
# Look for error messages or failed gates
```

**Level 3: Ask Team**

- Check team Slack/chat channel
- Ask in Release Engineering channel
- Someone may have solved it before

**Level 4: Escalate to Release Lead**

- Create GitHub issue in `.github` repo
- Tag `@lightspeedwp/maintainers`
- Include: workflow run ID, error message, steps taken
- Reference this training guide section attempted

---

## Video Walkthrough (Optional)

A recorded video walkthrough is available covering:

1. ✅ **Release Fundamentals (5 min):** SemVer, scopes, safety gates
2. ✅ **Patch Release Live Demo (8 min):** Trigger to completion
3. ✅ **Minor Release with Approval (10 min):** Coordination and approval
4. ✅ **Major Release with ADR (12 min):** ADR creation and dual approval
5. ✅ **Troubleshooting Common Issues (7 min):** Real problem scenarios
6. ✅ **Emergency Rollback Procedure (5 min):** Handling critical issues

**Video Details:**

- Duration: ~50 minutes total
- Format: MP4 (HD, 1080p)
- Location: [Internal shared drive or channel]
- Recommended viewing: After completing written modules

---

## Success Criteria for Training

Training is complete when:

✅ All team members completed all modules  
✅ All team members executed hands-on practice releases  
✅ All team members certified and signed-off  
✅ Team can execute patch releases in 5–10 minutes  
✅ Team can coordinate minor releases in 10–30 minutes  
✅ Team understands major release ADR requirement  
✅ Team knows how to troubleshoot common issues  
✅ Team can perform emergency rollback if needed  

---

**Phase 9B Deliverable:** Team Training Materials  
**Related Epic:** #2296  
**Training Version:** v1.0  
**Last Updated:** 2026-08-22  
**Next Review:** 2027-08-22 (annual refresh)

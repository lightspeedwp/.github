---
file_type: documentation
title: Release E2E Test Plan
description: Comprehensive end-to-end test plan for the two-phase agentic release workflow
version: v1.0
last_updated: '2026-08-22'
status: active
stability: stable
domain: governance
owners:
  - Release Infrastructure Team
tags:
  - release
  - testing
  - e2e
  - automation
---

# Release E2E Test Plan v1.0

> Comprehensive end-to-end testing strategy for the two-phase agentic release workflow to ensure reliability and correctness before team rollout.

## Overview

This test plan covers all aspects of the two-phase release workflow:
- **Phase 1:** Portable agent version bumping and changelog generation
- **Phase 2:** Agentic safety gates and release publishing

**Test Coverage Goal:** ≥90% of release workflow paths  
**Success Criteria:** All scenarios pass independently and sequentially

---

## Test Scenarios

### Scenario 1: Patch Release (v1.0.0 → v1.0.1)

**Objective:** Validate basic patch release workflow end-to-end

**Prerequisites:**
- Test repository initialized with v1.0.0 tag
- CHANGELOG.md with [Unreleased] section populated
- VERSION file set to 1.0.0
- No uncommitted changes

**Steps:**

1. **Phase 1 Agent Execution**
   - Trigger release workflow with scope: `patch`
   - Agent detects repository type (control-plane)
   - Agent creates release/v1.0.1 branch from develop
   - Agent bumps VERSION file to 1.0.1
   - Agent rolls [Unreleased] section to [1.0.1] - YYYY-MM-DD
   - Agent commits: "chore: Release v1.0.1"
   - Agent creates PR #1: release/v1.0.1 → develop

2. **PR #1 Review & Merge**
   - PR #1 appears with correct title and body
   - Changelog and version changes visible
   - Merge PR #1 to develop (squash merge)
   - Develop branch updated with version + changelog

3. **Phase 2 Safety Gates**
   - Gates workflow automatically triggered
   - All 7 safety gates pass:
     - ✅ GATE 1: Pre-flight Checks (VERSION, CHANGELOG, branch)
     - ✅ GATE 2: Agentic Score (≥0.80)
     - ✅ GATE 3: Version Consistency (semantic versioning)
     - ✅ GATE 4: Tag Uniqueness (v1.0.1 doesn't exist)
     - ✅ GATE 5: Authorization (maintainer team)
     - ✅ GATE 6: Integrity Filter (gitleaks passes)
     - ✅ GATE 7: Approval Enforcement (patch auto-approved)

4. **PR #2 & Release Publishing**
   - Agent creates PR #2: release/v1.0.1 → main
   - PR #2 contains compiled release notes
   - Merge PR #2 to main (squash merge)
   - Annotated tag v1.0.1 created
   - GitHub Release published with release notes

5. **Post-Release Sync**
   - Post-release sync workflow triggered
   - Creates chore/post-release-sync-main-to-develop branch
   - Merges main → develop
   - Creates PR for sync
   - Develops branch in sync with main

**Expected Outcome:**
- ✅ v1.0.1 tag exists and signed
- ✅ GitHub Release published with version and changelog
- ✅ develop and main branches in sync
- ✅ No conflicts or data loss

---

### Scenario 2: Minor Release (v1.0.0 → v1.1.0)

**Objective:** Validate minor release with manual approval requirement

**Prerequisites:**
- Same as Scenario 1, but with multiple unreleased entries
- Multiple contributors in changelog

**Steps:**
1. Trigger with scope: `minor`
2. Phase 1 executes (version → v1.1.0, changelog rolled)
3. PR #1 created and merged
4. Phase 2 gates validate
5. GATE 7 requires manual approval (minor scope)
6. Maintainer approves PR #2
7. Release published as v1.1.0
8. Post-release sync completes

**Expected Outcome:**
- ✅ Manual approval required and respected
- ✅ Release timeline includes approval step
- ✅ All metadata correct (version, contributors, dates)

---

### Scenario 3: Major Release (v1.0.0 → v2.0.0)

**Objective:** Validate major release with dual approval and ADR linking

**Prerequisites:**
- Same as Scenario 1, with breaking changes documented
- ADR (Architecture Decision Record) created

**Steps:**
1. Trigger with scope: `major`
2. Phase 1 executes (version → v2.0.0)
3. PR #1 includes breaking change notice
4. Phase 2 gates validate
5. GATE 7 requires dual approval + ADR reference
6. Two maintainers approve PR #2
7. ADR linked in commit message
8. Release published as v2.0.0

**Expected Outcome:**
- ✅ Dual approval enforced
- ✅ ADR reference required in commit
- ✅ Breaking changes clearly documented
- ✅ Release notes highlight major changes

---

### Scenario 4: Error Handling — Missing CHANGELOG

**Objective:** Validate graceful failure when CHANGELOG is invalid

**Prerequisites:**
- CHANGELOG.md exists but missing [Unreleased] section
- No entries to roll

**Steps:**
1. Trigger release workflow
2. Phase 1 validation detects missing [Unreleased]
3. Workflow fails with clear error message
4. No branches created, no mutations

**Expected Outcome:**
- ✅ GATE 1: Pre-flight Checks fail
- ✅ Clear error in workflow logs
- ✅ No partial changes
- ✅ User can fix and retry

---

### Scenario 5: Error Handling — Tag Already Exists

**Objective:** Validate prevention of duplicate releases

**Prerequisites:**
- v1.0.1 tag already exists in repo

**Steps:**
1. Trigger release workflow with scope: patch (would create v1.0.1)
2. Phase 1 executes, PR #1 created
3. PR #1 merged to develop
4. Phase 2 gates run
5. GATE 4: Tag Uniqueness check detects v1.0.1 exists
6. Workflow aborted before any main branch mutations

**Expected Outcome:**
- ✅ GATE 4 prevents duplicate tag
- ✅ No tag created
- ✅ No GitHub Release published
- ✅ Error message guides user to use different version

---

### Scenario 6: Error Handling — Unauthorized User

**Objective:** Validate authorization check blocks non-maintainers

**Prerequisites:**
- Workflow triggered by user NOT in maintainers team
- All other prerequisites met

**Steps:**
1. Non-maintainer triggers release workflow
2. Trigger telemetry job runs
3. Authorization check fails (actor not in maintainers)
4. Workflow aborts immediately
5. Attempt logged for audit

**Expected Outcome:**
- ✅ GATE 5: Authorization fails
- ✅ Workflow stops before any work
- ✅ Clear error message
- ✅ Attempt logged in workflow logs

---

### Scenario 7: Rollback Procedure

**Objective:** Validate ability to rollback a release if issues arise

**Prerequisites:**
- Release v1.0.1 published
- Post-release sync completed
- Issue discovered that requires rollback

**Steps:**
1. Delete v1.0.1 tag locally and remotely
2. Delete GitHub Release
3. Revert PR #2 commit on main
4. PR #1 remains merged on develop (contains version/changelog)
5. Manually bump version back down to v1.0.0 if needed

**Expected Outcome:**
- ✅ v1.0.1 tag deleted
- ✅ GitHub Release removed
- ✅ Workflow can handle re-release with same version
- ✅ No data corruption or stuck state

---

### Scenario 8: Sequential Releases

**Objective:** Validate multiple releases in sequence don't conflict

**Prerequisites:**
- Develop branch with v1.0.0
- Successfully released v1.0.1
- Ready to release v1.0.2

**Steps:**
1. Release v1.0.2 (patch)
2. All phases complete successfully
3. Post-release sync merges main → develop
4. Immediately trigger v1.1.0 release (minor)
5. All phases execute correctly

**Expected Outcome:**
- ✅ v1.0.2 released without conflicts
- ✅ v1.1.0 released after sync
- ✅ No branch conflicts or merge issues
- ✅ Mergify queue handles sequencing

---

## Test Data & Fixtures

### Base Fixture Repository

```
📦 test-repo/
├── .gitignore
├── README.md
├── VERSION (v1.0.0)
├── CHANGELOG.md
│   ├── [Unreleased]
│   │   ├── ### Added
│   │   ├── ### Changed
│   │   └── ### Fixed
│   └── [1.0.0] - 2026-01-01
├── .github/
│   └── workflows/
│       └── (inherits from control-plane)
└── package.json
```

### CHANGELOG.md Template

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Feature 1
- Feature 2

### Changed
- Improvement 1

### Fixed
- Bug fix 1
```

### VERSION File

```
1.0.0
```

---

## Test Execution Environment

**Environment:** Ephemeral test repository per scenario
- Created fresh before each test
- Deleted after test completion
- No state persisted between scenarios

**CI Integration:**
- Manual trigger for development
- Automated on PR to main
- Scheduled daily on develop
- Matrix: patch, minor, major scopes

**Logs & Artifacts:**
- Workflow logs: `.github/reports/release-validation/`
- Test results: JSON summary per scenario
- Failure logs: Full output for debugging

---

## Success Metrics

### Coverage

- ✅ 90%+ of release workflow code paths tested
- ✅ All 7 safety gates validated
- ✅ Phase 1 and Phase 2 both covered
- ✅ Error scenarios included

### Reliability

- ✅ All scenarios pass independently
- ✅ Scenarios pass when run sequentially
- ✅ No flaky tests
- ✅ Reproducible results

### Documentation

- ✅ Each scenario documented with prerequisites, steps, outcomes
- ✅ Test fixtures and data documented
- ✅ Expected vs. actual outcomes clearly marked
- ✅ Failure scenarios include resolution steps

---

## Known Limitations

1. **Ephemeral Repositories:** Test repos are deleted after testing, so they cannot be inspected post-failure (logs/artifacts are saved)
2. **No Real Users:** Workflow dispatches use service account, not actual team members
3. **No External Integration:** Tests don't validate external services (GitHub API mocking only)
4. **Single Repository Type:** Tests use control-plane repo type; plugin/theme releases tested manually in Phase 9C

---

## Approval & Sign-Off

Test plan approval chain:
- [ ] QA Lead review
- [ ] Release Engineer review
- [ ] Development Team lead review

---

**Phase 9A Deliverable:** Release Workflow Validation & E2E Testing  
**Related Issue:** #2297  
**Epic:** #2296

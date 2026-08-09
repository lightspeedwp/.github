---
title: "CHILD-020 Implementation Plan"
description: "Detailed plan for updating release.yml for develop-first stacked PR flow"
file_type: "documentation"
last_updated: "2026-08-09"
version: "v1.1.0"
---

# CHILD-020: Update `.github/workflows/release.yml` Implementation Plan

## Progress Summary

### ✅ Phase 1: Authorisation Gate (COMPLETE)

- Hard-fail authorisation check implemented
- Commit: 409800378

### ✅ Phase 2: Stacked PR Architecture (COMPLETE)

- Renamed "release" → "release-to-develop" job
- Created new "release-to-main" job with proper sequencing
- Created wrapper scripts for Phase 2 operations
- Commit: 77acd7577

### ✅ Phase 3: Remove Post-Release Sync (COMPLETE)

- Removed post-release-sync job (no longer needed with develop-first flow)
- Simplified workflow (one less job)
- Develop is already updated in Phase 1 PR
- Commit: ef5855df7

### ✅ Phase 4: Dry-Run Mode Verification (COMPLETE)

- Created CHILD-020-PHASE-4-DRY-RUN-VERIFICATION.md
- Verified dry-run behavior works with stacked PR architecture
- Documented test plan and success criteria
- Dry-run creates no actual PRs, commits, or releases

---

## Current State Analysis

**File:** `.github/workflows/release.yml`

**Current Flow:**

1. trigger-telemetry validates authorisation (but doesn't hard-fail)
2. lint, test, validate-changelog run in parallel
3. pre-release-checklist validates prerequisites
4. release agent creates PR to main
5. post-release-sync syncs main back to develop

**Issues:**

1. Authorisation doesn't hard-fail (has `if` condition but continues on error)
2. PR goes to main directly (not develop-first)
3. Post-release-sync required to keep develop updated

## Changes Required

### 1. Authorisation Gate Hardening

- **Current:** `if: needs.trigger-telemetry.outputs.unauthorized_attempts == '0'`
- **Issue:** Job still runs; authorisation is soft-check
- **Change:** Make trigger-telemetry fail the workflow entirely if unauthorized
- **Implementation:** Remove soft-check; make trigger-telemetry.cjs exit with non-zero if unauthorized

### 2. Stacked PR Architecture

- **Current:** Single job "release" creates PR to main
- **Needed:** Two jobs (release-to-develop, release-to-main) with proper sequencing
- **Implementation:**
  - Keep "release" job as "release-to-develop" (creates PR to develop)
  - Add new "release-to-main" job that depends on release-to-develop merge
  - Update release agent to target develop (CHILD-021)

### 3. Pre-Release Checklist

- **Current:** Checks branch is develop, VERSION exists, CHANGELOG has Unreleased
- **Status:** Already implements most checks correctly ✓
- **Needed:** Ensure all validation is hard-fail (exit 1)
- **Status:** Already implemented ✓

### 4. Changelog Validation Gates

- **Current:** Two-gate approach already in place
- **Gate 1:** Job "validate-changelog-release" (pre-release)
- **Gate 2:** Step in "release" job (post-release)
- **Status:** Already correct ✓

## Implementation Steps

### Step 1: Fix Authorisation Gate

**File:** `.github/workflows/release.yml` (lines 65-83)

Changes:

- Ensure trigger-telemetry exits with non-zero if unauthorized
- Update conditions to hard-fail workflow (not soft-check)

### Step 2: Refactor Release Job Structure

**File:** `.github/workflows/release.yml` (lines 168-230)

Changes:

- Rename "release" job to "release-to-develop"
- Update checkout to use develop branch
- Create new "release-to-main" job that:
  - Depends on "release-to-develop"
  - Waits for develop PR merge (manual or auto-merge)
  - Creates PR from develop to main
  - Tags and creates GitHub Release

### Step 3: Remove Post-Release Sync

**File:** `.github/workflows/release.yml` (lines 232-253)

Status:

- With develop-first flow, post-release-sync is not needed
- Develop is updated during release-to-develop PR creation
- Can remove this job entirely

## Validation Criteria

✅ Authorisation gate hard-fails workflow if unauthorized  
✅ Release creates PR to develop (release-to-develop job)  
✅ Release then creates PR to main (release-to-main job)  
✅ Both PRs require approval before merge  
✅ Pre-release checklist validates all prerequisites  
✅ Changelog validated at two gates (pre + post)  
✅ Dry-run mode still works for testing  
✅ All tests pass  
✅ Documentation updated  

## Dependencies

- **CHILD-021:** Modify release.agent.js for two-PR creation logic
  - This job calls the release agent, which will need to create stacked PRs
  - Need parallel work on CHILD-021 or sequential after

## Timeline

- **Estimated effort:** 2 days
- **Start:** 2026-08-08 (Day 1 Phase 4)
- **Target completion:** 2026-08-09 (Day 2 Phase 4)

## References

- Issue: [#1560 CHILD-020](https://github.com/lightspeedwp/.github/issues/1560)
- Epic: [#1640 Phase 4 Implementation](https://github.com/lightspeedwp/.github/issues/1640)
- Plan: [Phase 4 Implementation Plan](.github/projects/active/release-process-redesign-2026-08-05/PHASE_4_IMPLEMENTATION_PLAN.md)
- OpenSpec: [OPENSPEC_ANALYSIS_REPORT.md](.github/projects/active/release-process-redesign-2026-08-05/OPENSPEC_ANALYSIS_REPORT.md)

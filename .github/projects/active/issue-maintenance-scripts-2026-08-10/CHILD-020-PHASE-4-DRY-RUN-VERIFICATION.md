---
title: "CHILD-020 Phase 4: Dry-Run Verification"
description: "Verification that dry-run mode works correctly with two-PR stacked flow"
file_type: "documentation"
last_updated: "2026-08-09"
version: "v1.1.0"
---

# CHILD-020 Phase 4: Dry-Run Mode Verification

## Overview

Phase 4 verifies that the dry-run mode works correctly with the new stacked PR architecture. Dry-run mode allows testing the release workflow without creating actual PRs, commits, or releases.

## Dry-Run Behavior (Two-PR Flow)

### Phase 1: release-to-develop (Dry-Run)

**Current behavior:**

- ✅ Does NOT create release branch
- ✅ Does NOT create commit with VERSION/CHANGELOG changes
- ✅ Does NOT push to remote
- ✅ Does NOT create PR to develop
- ✅ Prints "[DRY-RUN]" messages for all actions
- ✅ Generates release notes preview file
- ✅ Uploads dry-run artefacts

**Verification:**

1. Trigger workflow with `dry_run: true`
2. Confirm no release branch created: `git branch -a | grep release/`
3. Confirm no changes to VERSION: `git status | grep VERSION`
4. Confirm no changes to CHANGELOG.md: `git status | grep CHANGELOG`
5. Verify release notes preview file: `ls -la release-notes-preview.md`

### Phase 2: release-to-main (Dry-Run)

**Current behavior:**

- Skipped when `dry_run: true` (condition: `if: inputs.dry_run == false`)
- Does NOT run createReleasePRToMain
- Does NOT create GitHub Release

**Verification:**

1. Trigger workflow with `dry_run: true`
2. Confirm release-to-main job did NOT run
3. Check workflow logs for job skipped status

## Test Plan

### Test 1: Dry-Run Changelog Validation

**Purpose:** Verify changelog is validated in dry-run mode

**Steps:**

1. Trigger workflow with:
   - `dry_run: true`
   - Valid VERSION file
   - Valid CHANGELOG.md with [Unreleased] section

**Expected Results:**

- ✅ Pre-release validation passes
- ✅ Changelog structure validated
- ✅ Release notes preview generated
- ✅ No actual changes made

### Test 2: Dry-Run Release Notes Preview

**Purpose:** Verify release notes are built correctly in dry-run

**Steps:**

1. Trigger workflow with `dry_run: true`
2. Download release-dry-run-artefacts
3. Verify files:
   - `release-agent.log` (contains "[DRY-RUN]" messages)
   - `release-notes-preview.md` (contains formatted notes)

**Expected Results:**

- ✅ Both files present in artefact
- ✅ release-agent.log shows dry-run operations
- ✅ release-notes-preview.md has correct format

### Test 3: Dry-Run with Invalid Changelog

**Purpose:** Verify changelog validation fails appropriately in dry-run

**Steps:**

1. Trigger workflow with:
   - `dry_run: true`
   - Invalid CHANGELOG.md (missing [Unreleased])

**Expected Results:**

- ✅ Workflow fails with clear error message
- ✅ No changes made (dry-run protected)

### Test 4: No Phase 2 Execution in Dry-Run

**Purpose:** Verify Phase 2 job skips in dry-run

**Steps:**

1. Trigger workflow with `dry_run: true`
2. Check workflow run logs

**Expected Results:**

- ✅ release-to-develop job runs
- ✅ release-to-main job skipped (not applicable for dry-run)
- ✅ No GitHub Release created

## Dry-Run Implementation Details

### Dry-Run Flags

**release-to-develop job:**

```yaml
if: always()  # Runs both dry-run and live
run: |
  # Live mode: creates PR
  # Dry-run mode: logs what would happen
```

**release-to-main job:**

```yaml
if: inputs.dry_run == false  # Skips dry-run
# Only runs in live mode
```

### Release Agent Dry-Run Support

The `release.agent.js` uses dry-run mode to:

1. Skip git commands
2. Log "[DRY-RUN]" prefix for all operations
3. Print what WOULD have happened
4. Return without making changes

**Key functions:**

- `exec(cmd, dryRun)` - Conditionally execute shell commands
- `bumpVersion(nextVersion, { dryRun })` - Skip actual file writes
- `createReleasePRToDevelop(version, branch, { dryRun })` - Log PR creation

## Verification Checklist

### Authorisation Gate (Phase 1)

- [x] Hard-fail authorisation check
- [x] Unauthorised users blocked
- [x] Log authorisation failures

### Stacked PR Architecture (Phase 2)

- [x] release-to-develop job creates PR to develop
- [x] release-to-main job creates PR to main
- [x] Proper job sequencing and dependencies

### Post-Release Sync Removal (Phase 3)

- [x] post-release-sync job removed
- [x] No unnecessary sync step
- [x] Workflow simpler and faster

### Dry-Run Mode (Phase 4)

- [ ] Dry-run creates no actual PRs
- [ ] Dry-run creates no git commits
- [ ] Dry-run creates no GitHub Release
- [ ] Release notes preview generated
- [ ] Dry-run artefacts uploaded correctly
- [ ] Dry-run messages logged properly
- [ ] Phase 2 skipped in dry-run

## Success Criteria

✅ Dry-run mode works with new stacked PR architecture  
✅ No actual changes made in dry-run  
✅ Release notes preview correct  
✅ Artefacts uploaded properly  
✅ Phase 2 correctly skipped  
✅ All log messages clear and actionable  

## Related Issues

- Issue: [#1560 CHILD-020](https://github.com/lightspeedwp/.github/issues/1560)
- Epic: [#1640 Phase 4 Implementation](https://github.com/lightspeedwp/.github/issues/1640)
- Related: [#1561 CHILD-021](https://github.com/lightspeedwp/.github/issues/1561) - Two-PR functions

## Timeline

- **Estimated effort:** 1-2 hours (mostly verification/testing)
- **Implementation:** Workflow changes already support dry-run
- **Testing:** Manual trigger in GitHub Actions

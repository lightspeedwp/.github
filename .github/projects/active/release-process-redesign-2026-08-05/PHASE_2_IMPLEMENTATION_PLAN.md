# Phase 2 Implementation Plan — Major Issues

**Objective:** Fix seven major release process issues that improve automation, validation, and user safety.

**Timeline:** 6 days  
**Branch:** `fix/phase-2-major-issues`  
**Target:** Merge to `develop`  
**PR Strategy:** Single PR with all 6 fixes (or stacked if interdependencies exist)  
**Issues:** #1584–#1590 (CHILD-004 through CHILD-010)

---

## Phase 2 Issue Breakdown

### CHILD-004: Implement Post-Release Sync (#1584)

**Problem:**  
After releasing to main, develop branch becomes stale with missing version bumps, tags, and changelog entries.

**Solution:**

1. **Design sync strategy**
   - Main → develop sync after release
   - Handle merge conflicts gracefully
   - Define what gets synced (tags, versions, changelog)

2. **Implement automation**
   - File: `.github/workflows/release.yml`
   - Add post-release sync job (should work with Phase 1's stacked PR flow)
   - Implement error handling and audit logging

3. **Test sync**
   - [ ] Test patch release sync
   - [ ] Test minor release sync
   - [ ] Test major release sync
   - [ ] Verify develop stays current

**Files to Modify:**

- `.github/workflows/release.yml` (add post-release sync job)
- `scripts/agents/release.agent.js` (add sync function)
- `docs/RELEASE_PROCESS.md` (document sync behavior)

**Dependencies:**

- Works with Phase 1 stacked PR flow (CHILD-002)
- CHILD-021 (release.agent.js updates)

---

### CHILD-005: Clarify Changelog Validation Timing (#1585)

**Problem:**  
Unclear when changelog validation occurs during release process (pre-release, post-release, or both).

**Solution:**

1. **Document validation timing**
   - When validation happens in workflow
   - What strictness level applies
   - How validation gates workflow progression

2. **Implement gates**
   - File: `.github/workflows/release.yml`
   - Pre-release validation (before PR creation)
   - Post-release validation (before merge to main)
   - Clear error messages for failures

3. **Test validation**
   - [ ] Validation blocks incomplete changelogs
   - [ ] Validation allows valid changelogs
   - [ ] Error messages are clear

**Files to Modify:**

- `.github/workflows/release.yml` (add validation gates)
- `scripts/agents/release.agent.js` (enhance validation)
- `docs/RELEASE_PROCESS.md` (document timing)

**Dependencies:**

- Works with Phase 1 flow

---

### CHILD-006: Change Dry-Run Default (#1586)

**Problem:**  
Dry-run defaults to `true`, making it easy to forget actual release. Users must remember to set `dry_run=false` for production.

**Solution:**

1. **Change default behavior**
   - File: `.github/workflows/release.yml`
   - Change dry-run from `true` → `false` by default
   - Add safety confirmation for actual releases

2. **Add protective guards**
   - Require explicit confirmation for non-dry-run
   - Log and audit all non-dry-run releases
   - Add review step before actual release

3. **Update documentation**
   - Document new default behavior
   - Explain how to trigger dry-run (explicit flag)
   - Document safety checks

**Files to Modify:**

- `.github/workflows/release.yml` (change default)
- `docs/RELEASE_PROCESS.md` (update documentation)
- `scripts/agents/release.agent.js` (confirmation logic)

---

### CHILD-007: Enforce Pre-Release Checklist (#1587)

**Problem:**  
No pre-release checklist enforced by workflow. Users can miss critical validation steps.

**Solution:**

1. **Define checklist**
   - Branch validation
   - Changelog validation
   - Version bump validation
   - All tests passing
   - No unmerged PRs blocking

2. **Implement validation**
   - File: `.github/workflows/release.yml`
   - Add checklist validation job
   - Fail workflow if any item fails
   - Clear error reporting

3. **Document checklist**
   - What each item checks
   - Why each item is required
   - How to fix failures

**Files to Modify:**

- `.github/workflows/release.yml` (add checklist job)
- `scripts/agents/release.agent.js` (implement checks)
- `docs/RELEASE_PROCESS.md` (document checklist)

---

### CHILD-008: Create Rollback.cjs Automation (#1588)

**Problem:**  
No automated rollback for failed releases. Manual recovery is error-prone.

**Solution:**

1. **Create rollback script**
   - File: `scripts/release/rollback.cjs`
   - Revert tags
   - Revert PRs
   - Revert version bumps
   - Revert changelog entries
   - Implement dry-run mode

2. **Integrate with workflow**
   - File: `.github/workflows/release.yml`
   - Make rollback available as manual action
   - Implement audit logging
   - Clear rollback instructions

3. **Test rollback**
   - [ ] Tag rollback works
   - [ ] PR rollback works
   - [ ] Version rollback works
   - [ ] Changelog rollback works
   - [ ] Dry-run mode works

**Files to Create/Modify:**

- `scripts/release/rollback.cjs` (new script)
- `.github/workflows/release.yml` (add manual rollback action)
- `docs/RELEASE_PROCESS.md` (document rollback procedure)

---

### CHILD-009: Fix Trigger Telemetry Authorization (#1589)

**Problem:**  
Trigger telemetry doesn't prevent unauthorized releases (related to Phase 1's CHILD-001, but specific to telemetry).

**Solution:**

1. **Review telemetry authorization**
   - Verify Phase 1 fix is applied
   - Check telemetry-specific auth gates
   - Ensure telemetry logs all attempts

2. **Strengthen authorization**
   - File: `scripts/agents/release.agent.js`
   - Add telemetry-specific authorization checks
   - Log failed authorization attempts
   - Prevent bypass mechanisms

3. **Test authorization**
   - [ ] Authorized user can trigger via telemetry
   - [ ] Unauthorized user is blocked
   - [ ] All attempts are logged

**Files to Modify:**

- `scripts/agents/release.agent.js` (telemetry auth checks)
- `.github/workflows/release.yml` (telemetry logging)

**Dependencies:**

- Phase 1 CHILD-001 authorization gating must be done first

---

### CHILD-010: Improve Release Notes Preview for Dry-Runs (#1590)

**Problem:**  
Dry-run doesn't show clear preview of what will be released. Users are unsure what they're releasing.

**Solution:**

1. **Generate detailed preview**
   - Version bump preview
   - Changelog excerpt
   - Affected files list
   - Release notes draft

2. **Display preview clearly**
   - File: `scripts/agents/release.agent.js`
   - Format output for readability
   - Include all relevant information
   - Make it easy to verify before release

3. **Test preview**
   - [ ] Preview shows correct version
   - [ ] Preview shows changelog excerpt
   - [ ] Preview lists affected files
   - [ ] Preview is accurate vs actual release

**Files to Modify:**

- `scripts/agents/release.agent.js` (preview generation)
- `.github/workflows/release.yml` (display preview)
- `docs/RELEASE_PROCESS.md` (document preview)

---

## Implementation Workflow

### Step 1: Prepare Branch

```bash
git checkout develop
git pull origin develop
git checkout -b fix/phase-2-major-issues
```

### Step 2: Implement Issues in Order of Dependency

**Priority 1 (No dependencies):**

- CHILD-006: Change Dry-Run Default
- CHILD-010: Improve Release Notes Preview

**Priority 2 (Depends on Phase 1):**

- CHILD-009: Fix Trigger Telemetry Authorization

**Priority 3 (Depends on others):**

- CHILD-004: Implement Post-Release Sync (depends on Phase 1 stacked PR)
- CHILD-005: Clarify Changelog Validation Timing
- CHILD-007: Enforce Pre-Release Checklist
- CHILD-008: Create Rollback.cjs Automation

### Step 3: Commits

One commit per issue or grouped by dependency:

```
fix: change dry-run default to false (CHILD-006)
fix: improve release notes preview for dry-runs (CHILD-010)
fix: strengthen trigger telemetry authorization (CHILD-009)
fix: implement post-release sync automation (CHILD-004)
fix: clarify and enforce changelog validation timing (CHILD-005)
fix: enforce pre-release checklist validation (CHILD-007)
feat: create rollback automation script (CHILD-008)
```

### Step 4: Testing & Validation

For each fix:

- [ ] Run local tests: `npm test`
- [ ] Lint: `npm run lint:md && npm run lint:js`
- [ ] Validate links: `npm run validate:links`
- [ ] Validate frontmatter: `npm run validate:frontmatter`
- [ ] Manual review: verify feature works as designed

### Step 5: Create PR

**Branch:** `fix/phase-2-major-issues`  
**Base:** `develop`  
**Title:** `fix: Phase 2 major issues (sync, validation, rollback, preview)`  
**Template:** `pr_bug.md`

**PR Body Should Include:**

- Summary of all 6 major fixes
- Links to all 6 child issues
- Test plan covering all fixes
- Risk assessment
- Rollback plan

### Step 6: Review & Merge

1. Address feedback from code review
2. Ensure all CI checks pass
3. Get approval from tech lead
4. Squash merge to develop
5. Delete feature branch
6. Close all 6 child issues

---

## Success Criteria

### CHILD-004: Post-Release Sync

- [ ] Main → develop sync automated
- [ ] Sync tested for patch/minor/major
- [ ] Documentation updated
- [ ] No manual sync needed

### CHILD-005: Changelog Validation

- [ ] Validation timing clearly documented
- [ ] Validation gates enforced in workflow
- [ ] Clear error messages on failure
- [ ] Strictness level defined

### CHILD-006: Dry-Run Default

- [ ] Dry-run is now default (false → true)
- [ ] Confirmation required for actual release
- [ ] Documentation updated
- [ ] Clear instructions for triggering

### CHILD-007: Pre-Release Checklist

- [ ] All checklist items enforced
- [ ] Workflow fails if any item fails
- [ ] Clear documentation
- [ ] Easy to understand failures

### CHILD-008: Rollback Automation

- [ ] Rollback script created
- [ ] All rollback operations work
- [ ] Dry-run mode tested
- [ ] Documentation complete

### CHILD-009: Telemetry Authorization

- [ ] Telemetry-specific auth checks added
- [ ] Unauthorized users blocked
- [ ] All attempts logged
- [ ] Tests validate blocking

### CHILD-010: Release Notes Preview

- [ ] Preview shows version
- [ ] Preview shows changelog excerpt
- [ ] Preview lists affected files
- [ ] Preview is accurate

### Integration

- [ ] All 6 fixes work together
- [ ] No regressions in Phase 1 flow
- [ ] CI passes
- [ ] Team can execute releases with confidence
- [ ] Ready to move to Phase 3

---

## Timeline Estimate

| Task | Est. Duration | Notes |
|------|---------------|-------|
| CHILD-006 implementation | 1 day | Simple workflow change |
| CHILD-010 implementation | 1 day | Preview generation |
| CHILD-009 implementation | 1 day | Telemetry auth |
| CHILD-004 implementation | 2 days | Sync automation |
| CHILD-005 implementation | 1 day | Validation timing |
| CHILD-007 implementation | 1 day | Checklist validation |
| CHILD-008 implementation | 1 day | Rollback script |
| Testing & validation | 1 day | All fixes tested |
| Code review & merge | 1 day | Review and merge |
| **Phase 2 Total** | **6 days** | |

---

## Next Steps After Phase 2

Once all 6 major issues are merged and validated:

1. **Update Epic #1546:** Change status to "Phase 3: Design (In Progress)"
2. **Move to Phase 3:** Start CHILD-011 through CHILD-017 (6 issues)
3. **Parallel work:** Begin Phase 4 design if resources available
4. **Continue through phases:** Follow timeline for remaining work

---

## Notes

- All changes must maintain backward compatibility with Phase 1 flow
- Changelog updates for each Phase 2 fix
- Comprehensive testing required for workflow changes
- Document any new authorization/governance rules
- Consider adding integration tests for critical paths

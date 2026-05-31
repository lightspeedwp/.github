---
file_type: implementation-plan
title: v0.5.0 Release Critical Issues — Implementation Plan
description: Step-by-step plan to fix 5 critical release infrastructure issues
created_date: 2026-05-31
status: ready-for-execution
target_version: 0.5.0
---

# v0.5.0 Release — Critical Issues Implementation Plan

**Objective**: Fix 5 critical release process issues to ensure v0.5.0 release is production-ready  
**Timeline**: ~4–5 hours  
**Branch**: `claude/compassionate-brahmagupta-quv5G`  
**Tracking Issues**: #585, #586, #587, #588, #589, #590

---

## Implementation Sequence

### Phase 1: Release Agent Core Fixes (3–4 hours)

These are the foundation—must be done first because they're interdependent.

#### Fix 1: Add Release Branch Push (Issue #585)
**File**: `scripts/agents/release.agent.js`  
**Lines**: ~695–710  
**Complexity**: LOW  

**What to change**:
After version/changelog bumps, before tag creation, add branch commit & push:

```javascript
// After updateChangelog(nextVersion, { dryRun });
// Around line 710, add:

console.log('\n=== Committing Release Changes ===');
if (!dryRun) {
  exec('git add VERSION CHANGELOG.md');
  exec(`git commit -m "chore(release): bump to ${nextVersion}"`);
  console.log(`✓ Changes committed`);
  
  console.log('\n=== Pushing Release Branch ===');
  exec(`git push -u origin ${releaseBranch}`);
  console.log(`✓ Branch pushed to origin`);
} else {
  console.log('[DRY-RUN] Would commit and push release branch');
}
```

**Validation**:
- [ ] Branch is created locally
- [ ] VERSION and CHANGELOG.md are staged and committed
- [ ] Branch is pushed to origin (check GitHub)
- [ ] Subsequent PR creation can find the branch

**Time**: 15 minutes

---

#### Fix 2: Inject [Unreleased] Section Post-Release (Issue #586)
**File**: `scripts/agents/release.agent.js`  
**Function**: `updateChangelog()` (line 487)  
**Complexity**: MEDIUM  

**What to change**:
After rolling `[Unreleased]` → `[X.Y.Z] - YYYY-MM-DD`, inject new Unreleased section:

```javascript
function updateChangelog(newVersion, options = {}) {
  const { changelogPath = "CHANGELOG.md", dryRun = false } = options;

  console.log(`\n=== Updating CHANGELOG for ${newVersion} ===`);

  if (!fs.existsSync(changelogPath)) {
    throw new Error(`CHANGELOG not found: ${changelogPath}`);
  }

  const content = fs.readFileSync(changelogPath, "utf8");
  const today = new Date().toISOString().split("T")[0];

  // Step 1: Roll [Unreleased] → [newVersion]
  const unreleasedTemplate = `## [Unreleased] - DD-MM-YYYY

### Added

### Changed

### Fixed

### Deprecated

### Removed

### Security

### Documentation

### Performance

`;

  let updatedContent = content.replace(
    /^## \[Unreleased\] - (?:DD-MM-YYYY|YYYY-MM-DD|\d{4}-\d{2}-\d{2})$/m,
    `## [${newVersion}] - ${today}`
  );

  // Step 2: Inject new Unreleased section at the top (after any frontmatter)
  const frontmatterMatch = updatedContent.match(/^---\n[\s\S]*?\n---\n/);
  if (frontmatterMatch) {
    const endOfFrontmatter = frontmatterMatch[0].length;
    updatedContent = 
      updatedContent.slice(0, endOfFrontmatter) +
      unreleasedTemplate +
      updatedContent.slice(endOfFrontmatter);
  } else {
    updatedContent = unreleasedTemplate + updatedContent;
  }

  if (dryRun) {
    console.log(
      `[DRY-RUN] Would update CHANGELOG.md:\n` +
      `  - Roll [Unreleased] to [${newVersion}] - ${today}\n` +
      `  - Inject new [Unreleased] section`
    );
    return;
  }

  fs.writeFileSync(changelogPath, updatedContent, "utf8");
  console.log(`✓ CHANGELOG updated with version ${newVersion}`);
  console.log(`✓ New [Unreleased] section injected for next cycle`);
}
```

**Validation**:
- [ ] CHANGELOG.md has `[Unreleased]` section after release
- [ ] New section has all subsections (Added, Changed, Fixed, etc.)
- [ ] Formatting is correct (not truncated/mangled)
- [ ] Changelog validation passes: `node scripts/validation/validate-changelog.cjs CHANGELOG.md`

**Time**: 30 minutes

---

#### Fix 3: Implement Sandboxed Dry-Run (Issue #1.5)
**File**: `scripts/agents/release.agent.js`  
**Functions**: `exec()`, `run()` (line 55–69, 624–699)  
**Complexity**: HIGH  

**What to change**:
Modify dry-run to actually create a sandbox branch, commit files, and validate:

```javascript
/**
 * Execute shell command (with optional sandboxing for dry-run)
 */
function exec(cmd, dryRun = false, sandbox = false) {
  if (dryRun && !sandbox) {
    // Logging-only mode (for informational steps)
    console.log(`[DRY-RUN] Would execute: ${cmd}`);
    return "";
  }
  
  if (dryRun && sandbox) {
    // Actual execution in sandbox (for validation)
    try {
      return execSync(cmd, { encoding: "utf8" });
    } catch (error) {
      console.warn(`[SANDBOX] Command failed (captured): ${cmd}\n${error.message}`);
      return "";
    }
  }

  // Live execution
  try {
    return execSync(cmd, { encoding: "utf8" });
  } catch (error) {
    throw new Error(`Command failed: ${cmd}\n${error.message}`);
  }
}

/**
 * Create a temporary sandbox branch for dry-run validation
 */
function createSandbox(dryRun, scope, nextVersion) {
  if (!dryRun) return null;

  const sandboxBranch = `release-sandbox-${Date.now()}`;
  console.log(`\n[SANDBOX] Creating temporary validation branch: ${sandboxBranch}`);
  
  try {
    exec(`git checkout -b ${sandboxBranch}`, false, true);
    return { branch: sandboxBranch };
  } catch (error) {
    console.warn(`[SANDBOX] Failed to create sandbox: ${error.message}`);
    return null;
  }
}

/**
 * Clean up sandbox branch
 */
function cleanupSandbox(dryRun, sandbox) {
  if (!dryRun || !sandbox) return;

  console.log(`\n[SANDBOX] Cleaning up temporary branch: ${sandbox.branch}`);
  try {
    exec(`git checkout -`, false, true);
    exec(`git branch -D ${sandbox.branch}`, false, true);
  } catch (error) {
    console.warn(`[SANDBOX] Cleanup warning: ${error.message}`);
  }
}

// In run() function, modify the flow:
async function run() {
  // ... existing setup code ...

  if (dryRun) {
    console.log("\n🔬 DRY-RUN MODE: Will validate release in isolated sandbox");
    console.log("   - Create temporary branch");
    console.log("   - Commit VERSION and CHANGELOG changes");
    console.log("   - Validate schema and formatting");
    console.log("   - Clean up (no side effects)\n");
  }

  const sandbox = createSandbox(dryRun, scope, nextVersion);

  try {
    // Step 1: Validate release readiness
    const validation = await validateRelease({ dryRun });

    if (!validation.valid) {
      console.error("\n❌ Release validation failed:");
      validation.errors.forEach((err) => console.error(`  - ${err}`));
      process.exit(1);
    }

    // ... version determination ...

    // Step 2b: Bump version (with sandbox support)
    if (sandbox) {
      console.log(`\n[SANDBOX] Testing version bump in ${sandbox.branch}...`);
      bumpVersion(nextVersion, { dryRun: false }); // Actually write to sandbox
      
      // Validate VERSION file
      try {
        const versionContent = fs.readFileSync("VERSION", "utf8").trim();
        console.log(`✓ VERSION file written: ${versionContent}`);
      } catch (error) {
        console.error(`✗ VERSION file write failed: ${error.message}`);
        throw error;
      }
    } else {
      bumpVersion(nextVersion, { dryRun });
    }

    // Step 3: Update changelog (with sandbox support)
    if (sandbox) {
      console.log(`\n[SANDBOX] Testing changelog update in ${sandbox.branch}...`);
      updateChangelog(nextVersion, { dryRun: false }); // Actually write to sandbox
      
      // Validate changelog schema
      try {
        const changelogData = parseChangelog("CHANGELOG.md");
        const result = validateChangelog(changelogData);
        if (!result.valid) {
          throw new Error(`Changelog validation failed: ${result.errors.join(", ")}`);
        }
        console.log(`✓ Changelog schema is valid`);
        
        // Verify [Unreleased] section exists
        const unreleased = getUnreleasedChanges(changelogData);
        if (!unreleased) {
          throw new Error("New [Unreleased] section not found");
        }
        console.log(`✓ New [Unreleased] section present`);
      } catch (error) {
        console.error(`✗ Changelog validation failed: ${error.message}`);
        throw error;
      }
    } else {
      updateChangelog(nextVersion, { dryRun });
    }

    // Step 4: Commit and validate git history (sandbox only)
    if (sandbox) {
      console.log(`\n[SANDBOX] Testing git commit in ${sandbox.branch}...`);
      try {
        exec("git add VERSION CHANGELOG.md", false, true);
        exec(`git commit -m "chore(release): bump to ${nextVersion}"`, false, true);
        console.log(`✓ Git commit succeeded`);
        
        // Verify commit log
        const log = exec("git log --oneline -1", false, true);
        console.log(`✓ Commit message: ${log.trim()}`);
      } catch (error) {
        console.error(`✗ Git commit failed: ${error.message}`);
        throw error;
      }
    }

    if (dryRun) {
      console.log("\n✅ DRY-RUN VALIDATION PASSED");
      console.log(`\nRelease will proceed with:`);
      console.log(`  Version: ${currentVersion} → ${nextVersion}`);
      console.log(`  Branch: ${releaseBranch}`);
      console.log(`  Tag: v${nextVersion}`);
      console.log(`\nAll validation gates passed. Safe to run live release.`);
    }

    // ... rest of release flow (skip tag/release in dryRun) ...

  } finally {
    cleanupSandbox(dryRun, sandbox);
  }
}
```

**Validation**:
- [ ] Dry-run creates and cleans up sandbox branch
- [ ] VERSION bump is validated in sandbox
- [ ] CHANGELOG schema is validated in sandbox
- [ ] New [Unreleased] section exists in sandbox
- [ ] Git commit message is formatted correctly
- [ ] Sandbox branch is cleaned up (no artifacts left)
- [ ] Preview output shows all expected changes

**Time**: 2 hours

---

### Phase 2: Workflow Fixes (1–1.5 hours)

These are decoupled from the agent and can be done in parallel or after Phase 1.

#### Fix 4: Auth Gate Enforcement in Workflow (Issue #588)
**File**: `.github/workflows/release.yml`  
**Job**: `trigger-telemetry` (line 53–68)  
**Complexity**: MEDIUM  

**What to change**:
Replace telemetry-only logic with actual authorization check:

```yaml
trigger-telemetry:
  runs-on: ubuntu-latest
  outputs:
    status: ${{ steps.verify-auth.outputs.status }}
  steps:
    - name: Verify trigger authorization
      id: verify-auth
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        ACTOR: ${{ github.actor }}
      run: |
        # Check if actor is in the maintainers team
        # Using GitHub CLI to verify team membership
        if gh api orgs/lightspeedwp/teams/maintainers/memberships/$ACTOR &>/dev/null; then
          echo "status=authorized" >> "$GITHUB_OUTPUT"
          echo "✓ Release authorized by $ACTOR (team: maintainers)"
        else
          echo "status=unauthorized" >> "$GITHUB_OUTPUT"
          echo "❌ Release not authorized. $ACTOR is not in lightspeedwp/maintainers team."
          exit 1
        fi

lint:
  needs: [trigger-telemetry]
  if: needs.trigger-telemetry.outputs.status == 'authorized'
  runs-on: ubuntu-latest
  # ... rest of lint job

release:
  needs: [trigger-telemetry, lint, test]
  if: needs.trigger-telemetry.outputs.status == 'authorized'
  # ... rest of release job
```

**Validation**:
- [ ] Authorized maintainer can trigger release
- [ ] Non-maintainer trigger is blocked immediately
- [ ] Workflow displays clear auth error message
- [ ] `status` output is correctly passed to downstream jobs

**Time**: 30 minutes

---

#### Fix 5: Add Test Gate to Workflow (Issue #589)
**File**: `.github/workflows/release.yml`  
**Jobs**: Add `test` job before `release` (line ~70)  
**Complexity**: LOW  

**What to change**:
Add test job that runs before release:

```yaml
lint:
  needs: [trigger-telemetry]
  if: needs.trigger-telemetry.outputs.status == 'authorized'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Setup Node
      uses: actions/setup-node@v4
      with:
        node-version: "lts/*"
    - name: Install
      run: npm ci
    - name: Lint
      run: npm run lint

test:
  needs: [trigger-telemetry]
  if: needs.trigger-telemetry.outputs.status == 'authorized'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Setup Node
      uses: actions/setup-node@v4
      with:
        node-version: "lts/*"
    - name: Install
      run: npm ci
    - name: Run tests
      run: npm test

release:
  needs: [lint, test]
  if: always() && needs.lint.result == 'success' && needs.test.result == 'success'
  runs-on: ubuntu-latest
  # ... rest of release job
```

**Validation**:
- [ ] Tests run before release
- [ ] Release is blocked if tests fail
- [ ] Both lint and test must pass
- [ ] Workflow summary shows test results

**Time**: 15 minutes

---

### Phase 3: Integration & Validation (30 minutes)

#### Final Validation Steps

1. **Verify All Changes**:
   ```bash
   npm run lint:all
   npm test
   ```

2. **Test Release Agent in Dry-Run**:
   ```bash
   node scripts/agents/release.agent.js --scope=minor --dry-run
   ```
   Check output for:
   - [ ] Sandbox branch created
   - [ ] VERSION bumped to 0.5.0
   - [ ] CHANGELOG [Unreleased] → [0.5.0]
   - [ ] New [Unreleased] section injected
   - [ ] Schema validation passed
   - [ ] Sandbox branch cleaned up
   - [ ] Preview shows all changes

3. **Test Workflow Gates**:
   - [ ] Trigger with authorized user → proceeds
   - [ ] Trigger with unauthorized user → blocked immediately
   - [ ] Lint job passes
   - [ ] Test job passes
   - [ ] Release job runs only if both pass

4. **Commit & Push**:
   ```bash
   git add -A
   git commit -m "fix(release): implement critical release infrastructure fixes

   - Add release branch push before PR creation (#585)
   - Inject [Unreleased] section post-release (#586)
   - Implement sandboxed dry-run validation (#587)
   - Add auth gate enforcement to workflow (#588)
   - Add test gate as hard requirement (#589)
   
   All critical gates now enforced. Release ready for v0.5.0."
   ```
   ```bash
   git push -u origin claude/compassionate-brahmagupta-quv5G
   ```

---

## Dependency Graph

```
Fix 1 (Branch Push)
  ↓
Fix 2 ([Unreleased] Injection)
  ↓
Fix 3 (Dry-Run Sandboxing)  ← Depends on 1 & 2 for validation
  ↓
Phase 1 Complete
  ↓
Fix 4 (Auth Gate) ─┐
                  ├→ Fix 5 (Test Gate) ─→ Integration Testing
Fix 5 (Test Gate) ┘
```

**Sequential order required**: Fix 1 → 2 → 3 (agent changes depend on each other)  
**Parallel allowed**: Fix 4 & 5 can be done simultaneously (workflow changes are independent)

---

## Success Criteria

✅ **Critical Path Complete** when:
1. Agent creates release branch and pushes to origin
2. Agent injects [Unreleased] section post-release
3. Dry-run validates changes in sandbox without side effects
4. Workflow blocks unauthorized release attempts
5. Workflow enforces test passage before release

✅ **Ready for v0.5.0** when:
- All 5 fixes implemented and tested
- Dry-run completes successfully
- Manual walkthrough of release process succeeds
- No uncommitted changes

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Dry-run sandbox corruption | Test with `--dry-run` first; verify cleanup |
| Changelog format drift | Validate schema in both pre and post steps |
| Workflow auth bypass | Test with non-maintainer account; verify block |
| Branch push race condition | Add retries to `git push` (exponential backoff) |
| Missing test coverage | Run `npm test` before each push |

---

## Timeline Summary

| Phase | Task | Duration | Total |
|-------|------|----------|-------|
| 1.1 | Fix branch push | 15 min | 15 min |
| 1.2 | Fix [Unreleased] injection | 30 min | 45 min |
| 1.3 | Implement sandboxed dry-run | 2 hours | 2h 45m |
| 2.1 | Add auth gate | 30 min | 3h 15m |
| 2.2 | Add test gate | 15 min | 3h 30m |
| 3 | Integration & validation | 30 min | 4 hours |

**Estimated Total: 4 hours** (5 max with unforeseen issues)

---

## Next Steps

1. Review this plan
2. Confirm you're ready to proceed with all 5 fixes
3. I'll implement in sequence, testing each phase
4. Create draft PR when complete
5. Validate end-to-end before v0.5.0 release

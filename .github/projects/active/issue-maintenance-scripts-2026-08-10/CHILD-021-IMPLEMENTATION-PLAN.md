---
title: "CHILD-021 Implementation Plan"
description: "Detailed plan for updating release.agent.js for two-PR creation logic"
version: "v1.1.0"
---

# CHILD-021: Modify `scripts/agents/release.agent.js` Implementation Plan

## Current State Analysis

**File:** `scripts/agents/release.agent.js`

**Current Flow:**

1. Creates release branch (release/vX.Y.Z)
2. Bumps VERSION file
3. Updates CHANGELOG.md
4. Creates git tag
5. Pushes to remote
6. **Creates single PR from release branch to main** (line 1211)
7. Creates GitHub Release

**Issues:**

1. PR goes directly to main (not develop-first)
2. No support for two-PR stacked flow
3. No delay between develop and main PR creation

## Changes Required

### 1. Separate PR Creation Functions

**Current:** Single function `createReleasePR(version, branch, options)`

- Targets: main
- Parameters: version, branch, options

**Change:** Split into two functions:

#### A. `createReleasePRToDevelop(version, branch, options)`

- **Purpose:** Create first PR from release branch to develop
- **Parameters:**
  - `version`: Release version (e.g., "1.2.3")
  - `branch`: Release branch (e.g., "release/v1.2.3")
  - `options`: { dryRun, provider }
- **Behavior:**
  - Creates PR to develop (not main)
  - Title: `chore(release): v${version}`
  - Body: Release notes with develop-first note
  - Returns: PR URL or number for tracking
  - Shell: `gh pr create --base develop --head ${branch}`
  - MCP: Use GitHub API to create PR to develop

#### B. `createReleasePRToMain(version, options)`

- **Purpose:** Create second PR from develop to main after develop PR merges
- **Parameters:**
  - `version`: Release version (e.g., "1.2.3")
  - `options`: { dryRun, provider }
- **Behavior:**
  - Creates PR from develop to main
  - Title: `chore(release): v${version} (develop → main)`
  - Body: Reference first develop PR, link to release notes
  - Shell: `gh pr create --base main --head develop`
  - MCP: Use GitHub API to create PR from develop to main
  - **CRITICAL:** Only called after develop PR is merged
  - May need to detect merge completion (polling or webhook)

### 2. Provider Implementation

Both shell and MCP providers need two-PR support:

**Shell Provider:**

```javascript
createReleasePRToDevelop(version, branch, options) {
  // Create PR to develop
  gh pr create --base develop --head ${branch} --title "..." --body-file "..."
}

createReleasePRToMain(version, options) {
  // Create PR from develop to main
  gh pr create --base main --head develop --title "..." --body-file "..."
}
```

**MCP Provider:**

```javascript
async createReleasePRToDevelop(version, branch, options) {
  // POST /repos/{owner}/{repo}/pulls with:
  // { head: branch, base: "develop", title: "...", body: "..." }
}

async createReleasePRToMain(version, options) {
  // POST /repos/{owner}/{repo}/pulls with:
  // { head: "develop", base: "main", title: "...", body: "..." }
}
```

### 3. Release Agent Workflow Changes

**Current flow (run function, line 1100+):**

```
1. Preflight checks
2. Create release branch
3. Bump version
4. Update changelog
5. Create tag
6. Push changes
7. createReleasePR (to main) ← CHANGE THIS
8. createRelease (GitHub Release)
```

**New flow:**

```
Phase 1 (Same as current):
1. Preflight checks
2. Create release branch
3. Bump version
4. Update changelog
5. Create tag
6. Push changes

Phase 2 (First PR - develop):
7. createReleasePRToDevelop (to develop)
   - Outputs: PR number/URL for logging

Phase 3 (After merge - separate workflow job):
8. createReleasePRToMain (develop → main)
   - Input: PR number from phase 2 (passed via outputs)

Phase 4 (Final):
9. createRelease (GitHub Release)
```

## Implementation Steps

### Step 1: Refactor PR Creation Logic (Lines 849-872)

**Current code:**

```javascript
function createReleasePR(version, branch, options = {}) {
  // Creates PR to main
  exec(`gh pr create --base main --head ${branch} ...`);
}
```

**Change to:**

```javascript
function createReleasePRToDevelop(version, branch, options = {}) {
  // Creates PR to develop
  exec(`gh pr create --base develop --head ${branch} ...`);
}

function createReleasePRToMain(version, options = {}) {
  // Creates PR from develop to main
  exec(`gh pr create --base main --head develop ...`);
}
```

### Step 2: Update Shell Provider (Lines 878-907)

**Change:**

- Remove: `createReleasePR` from returned object
- Add: `createReleasePRToDevelop, createReleasePRToMain`
- Update exports

### Step 3: Update MCP Provider (Lines 913-1040)

**Change:**

- Refactor PR creation logic in MCP provider
- Split into two functions
- Update returned object to export both functions

### Step 4: Update Release Agent run() Function

**Change (Line 1211):**

- Old: `provider.createReleasePR(nextVersion, releaseBranch, { dryRun });`
- New: `provider.createReleasePRToDevelop(nextVersion, releaseBranch, { dryRun });`

**Note:** createReleasePRToMain will be called from a separate workflow job (CHILD-020)

### Step 5: Update Exports (Lines 1249-1269)

**Change:**

- Remove: `createReleasePR`
- Add: `createReleasePRToDevelop, createReleasePRToMain`

### Step 6: Update run-release-agent.cjs

**File:** `scripts/workflows/release/run-release-agent.cjs`

**Change:**

- Update imports to use new function names
- Ensure proper error handling for two-PR flow

## PR Body Generation Changes

### Develop PR Body

```markdown
## Release v${version}

This is the first PR in the develop-first release flow.

### Changes
- [changelog entries]

### Next Step
Once this PR is merged to develop, the second PR (develop → main) will be created automatically.

### Links
- [Release notes](${releaseNotesUrl})
- [Changelog](.../CHANGELOG.md)
```

### Main PR Body

```markdown
## Release v${version} (develop → main)

This is the second PR in the develop-first release flow. 
Develop PR: #${developPRNumber}

### Merged to develop ✅
The develop PR has been successfully merged.

### Ready for production
This PR brings the release to main. 

### Next step
Merge to main, and GitHub Release will be created automatically.

### Links
- [Develop PR](#${developPRNumber})
- [Release notes](${releaseNotesUrl})
```

## Validation Criteria

✅ createReleasePRToDevelop creates PR to develop (not main)  
✅ createReleasePRToMain creates PR from develop to main  
✅ Both shell and MCP providers support two-PR flow  
✅ Dry-run mode still works  
✅ PR bodies accurately describe the flow  
✅ Release agent is updated to use new functions  
✅ Exports are correct  
✅ All tests pass  
✅ Documentation updated  

## Dependencies

- **CHILD-020:** Update release.yml workflow
  - Needs to orchestrate the two-PR flow
  - release-to-develop job calls createReleasePRToDevelop
  - release-to-main job (separate) calls createReleasePRToMain

## Timeline

- **Estimated effort:** 2-3 hours
- **Critical path:** Yes (blocks CHILD-020 stacked PR implementation)
- **Integration point:** .github/workflows/release.yml (CHILD-020)

## References

- **Issue:** [#1561 CHILD-021](https://github.com/lightspeedwp/.github/issues/1561)
- **Related:** [#1560 CHILD-020](https://github.com/lightspeedwp/.github/issues/1560)
- **Epic:** [#1640 Phase 4 Implementation](https://github.com/lightspeedwp/.github/issues/1640)
- **File:** `scripts/agents/release.agent.js`
- **Workflow:** `.github/workflows/release.yml`

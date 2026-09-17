# Quickstart: Branch Cleanup Validation

**Phase**: 1 (Design & Contracts) | **Date**: 2026-09-16 | **Type**: Validation Guide

This guide provides runnable test scenarios that prove the branch cleanup feature works end-to-end.

## Prerequisites

```bash
# Node.js 22+ installed
node --version

# Git installed and repository initialised
git --version

# GitHub CLI installed (for PR detection)
gh --version

# Optional: jq for JSON report parsing
jq --version
```

## Setup: Create Test Repository

```bash
# Create a temporary test repo
mkdir /tmp/branch-cleanup-test
cd /tmp/branch-cleanup-test

# Initialise git repo
git init
git config user.name "Test User"
git config user.email "test@example.com"

# Create commits on main
echo "initial" > README.md
git add README.md
git commit -m "Initial commit"

# Create test branches (to be categorised)
git checkout -b feat/old-feature
echo "feature" > feature.txt
git commit --allow-empty -m "Old feature (will be stale)"

git checkout -b bugfix/typo
echo "fix" > typo.txt
git commit --allow-empty -m "Typo fix (will be stale)"

git checkout -b feat/recent-work
echo "recent" > recent.txt
git commit --allow-empty -m "Recent work (will be kept)"

git checkout -b release/v1.0.0
echo "release" > VERSION
git commit --allow-empty -m "Release branch (will be preserved)"

# Return to main
git checkout main
```

## Test 1: Dry-Run Categorisation (No Deletions)

**Goal**: Verify that dry-run mode evaluates branches without deleting

```bash
cd /tmp/branch-cleanup-test

# Run cleanup in dry-run mode (default)
node scripts/cleanup-branches.js --verbose

# Expected output:
# ✅ Dry-run complete: X KEEP, Y DELETE, Z DISCUSS
# ℹ️  Report written to: .github/reports/branch-cleanup-*.md

# Verify no branches were actually deleted
git branch -a | grep "feat/old-feature"  # Should still exist
```

**Validation**:

- ✅ Script exits with code 0
- ✅ Report generated in `.github/reports/`
- ✅ No branches were deleted
- ✅ Categorisation includes KEEP, DELETE, and possibly DISCUSS

---

## Test 2: Branch Name Validation

**Goal**: Verify that invalid branch names are marked DISCUSS

```bash
cd /tmp/branch-cleanup-test

# Create invalid branch names
git checkout -b claude/invalid-branch  # Forbidden prefix
git commit --allow-empty -m "Invalid name"

git checkout -b copilot/test  # Forbidden prefix
git commit --allow-empty -m "Forbidden"

git checkout -b no-slash-branch  # Missing /
git commit --allow-empty -m "No slash"

# Run categorisation
node scripts/cleanup-branches.js --verbose

# Verify report marks these as DISCUSS
cat .github/reports/branch-cleanup-*.md | grep -A5 "DISCUSS"

# Expected reasons:
# - "forbidden prefix: claude"
# - "forbidden prefix: copilot"
# - "must follow pattern: {type}/{scope}-{title}"
```

**Validation**:

- ✅ All invalid branches marked DISCUSS
- ✅ Categorisation reasons clearly identify violations

---

## Test 3: Protected Branch Preservation

**Goal**: Verify that protected branches are never deleted

```bash
cd /tmp/branch-cleanup-test

# main and develop are always protected (hardcoded)
# Run categorisation
node scripts/cleanup-branches.js --verbose

# Verify report shows main/develop as KEEP
cat .github/reports/branch-cleanup-*.md | grep -A2 "^| main"
cat .github/reports/branch-cleanup-*.md | grep -A2 "^| develop"

# Expected reason: "protected_branch"
```

**Validation**:

- ✅ main branch marked KEEP (protected_branch)
- ✅ develop branch marked KEEP (protected_branch)
- ✅ No attempt to delete either

---

## Test 4: Exclusion Pattern Matching

**Goal**: Verify that excluded patterns are preserved

```bash
cd /tmp/branch-cleanup-test

# Run with default exclusion patterns (release/*, hotfix/*)
node scripts/cleanup-branches.js --verbose

# release/v1.0.0 should be KEEP (matches exclusion pattern)
cat .github/reports/branch-cleanup-*.md | grep "release/v1.0.0"

# Expected reason: "excluded_pattern"
```

**Validation**:

- ✅ release/* branches marked KEEP
- ✅ hotfix/* branches would be marked KEEP (if present)
- ✅ Exclusion pattern matching works correctly

---

## Test 5: Age-Based Categorisation

**Goal**: Verify that branch age affects categorisation

```bash
cd /tmp/branch-cleanup-test

# Create an old commit (simulate stale branch)
# For testing, use a custom date using git commit-date
git checkout feat/old-feature
GIT_COMMITTER_DATE="2026-07-01T10:00:00" \
GIT_AUTHOR_DATE="2026-07-01T10:00:00" \
git commit --allow-empty -m "Simulating old commit"

# Merge it to develop so it's in merged+stale state
git checkout -b develop || git checkout develop 2>/dev/null || true
git merge feat/old-feature --no-edit

# Run categorisation with default 30-day threshold
node scripts/cleanup-branches.js --inactiveDays=30 --verbose

# Expected: feat/old-feature marked DELETE (merged + stale)
cat .github/reports/branch-cleanup-*.md | grep "feat/old-feature"
# Expected reason: "merged_stale"
```

**Validation**:

- ✅ Merged branches older than threshold marked DELETE
- ✅ Age calculation is accurate (last commit date → days since now)
- ✅ Threshold parameter respected

---

## Test 6: Report Formats (Markdown vs JSON)

**Goal**: Verify both output formats work correctly

### Markdown Report

```bash
cd /tmp/branch-cleanup-test

# Generate Markdown report (default)
node scripts/cleanup-branches.js --reportFormat=markdown --verbose

# Verify Markdown structure
cat .github/reports/branch-cleanup-*.md | head -20
# Expected: Header, Summary table, KEEP/DELETE/DISCUSS sections

# Check for required sections
grep "^# Branch Cleanup Report" .github/reports/branch-cleanup-*.md
grep "| KEEP |" .github/reports/branch-cleanup-*.md
grep "| DELETE |" .github/reports/branch-cleanup-*.md
```

**Validation**:

- ✅ Markdown report has required header
- ✅ Summary table present with counts
- ✅ Category sections present with branch listings

### JSON Report

```bash
cd /tmp/branch-cleanup-test

# Generate JSON report
node scripts/cleanup-branches.js --reportFormat=json --verbose

# Verify JSON structure using jq
jq '.stats' .github/reports/branch-cleanup-*.json
# Expected output:
# {
#   "totalBranches": X,
#   "keepCount": Y,
#   "deleteCount": Z,
#   "discussCount": W
# }

# Verify branch entries
jq '.branches[0]' .github/reports/branch-cleanup-*.json
# Expected: name, category, reason, author, ageInDays, mergeStatus, etc.
```

**Validation**:

- ✅ JSON report valid structure
- ✅ Stats object populated correctly
- ✅ Branch entries include required fields

---

## Test 7: Custom Options (Threshold, Exclusion, etc.)

**Goal**: Verify CLI options work as intended

```bash
cd /tmp/branch-cleanup-test

# Test custom inactiveDays threshold
node scripts/cleanup-branches.js --inactiveDays=60 --verbose

# Test custom exclusion patterns
node scripts/cleanup-branches.js --excludePatterns="feat/.*|release/.*" --verbose

# Test verbose mode produces debug output
node scripts/cleanup-branches.js --verbose 2>&1 | grep "🔍"
# Expected: Debug entries visible

# Test reportDir option
mkdir -p /tmp/custom-reports
node scripts/cleanup-branches.js --reportDir=/tmp/custom-reports --verbose

# Verify report in custom location
ls /tmp/custom-reports/branch-cleanup-*.md
```

**Validation**:

- ✅ Options parsed correctly
- ✅ Threshold affects categorisation
- ✅ Exclusion patterns applied
- ✅ Verbose output includes debug info
- ✅ Custom report directory respected

---

## Test 8: Error Handling

**Goal**: Verify graceful degradation on errors

### Missing Git Command

```bash
# Simulate missing git (if safe to do)
# This would require PATH manipulation; skip in production

# Expected: Error message, exit code 127
```

### Invalid Arguments

```bash
cd /tmp/branch-cleanup-test

# Test invalid --inactiveDays
node scripts/cleanup-branches.js --inactiveDays=invalid

# Expected output:
# ⚠️  Invalid --inactiveDays value; defaulting to 30.
# Script continues with default value
```

**Validation**:

- ✅ Invalid arguments handled gracefully
- ✅ Default values used as fallback
- ✅ Script doesn't crash on bad input

---

## Test 9: Integration with GitHub API (PR Detection)

**Goal**: Verify that branches with open PRs are preserved

**Prerequisites**:

- Real GitHub repository (not test repo)
- An open PR against a branch

```bash
# On real .github repository:
node scripts/cleanup-branches.js --verbose

# Verify that branches with open PRs are marked KEEP
cat .github/reports/branch-cleanup-*.md | grep -B2 "active_pr"

# Expected reason for those branches: "active_pr"
```

**Validation**:

- ✅ GitHub API queried for open PRs
- ✅ Branches with open PRs marked KEEP
- ✅ No false positives (other branches not marked as active_pr)

---

## Test 10: Library API Usage (Programmatic)

**Goal**: Verify library modules can be imported and used directly

```javascript
// test-lib-api.js
import { categorizeBranches } from './scripts/lib/branch-categorization.js';
import { getAgeInDays } from './scripts/lib/age-calculator.js';
import { validateBranchName } from './scripts/lib/branch-categorization.js';

// Test age calculator
console.log(getAgeInDays('2026-08-15T10:00:00Z'));  // Should be ~32 days

// Test branch name validation
console.log(validateBranchName('feat/login-screen'));  // Should be valid
console.log(validateBranchName('claude/bad'));          // Should be invalid

// Test categorisation
const result = categorizeBranches(
  ['feat/old', 'main', 'release/v1.0'],
  {
    'feat/old': {
      author: 'alice',
      lastCommitDate: '2026-07-15T10:00:00Z',
      mergeStatus: { merged: true, state: 'merged' }
    }
  },
  new Set(),
  /release\/.*|hotfix\/.*/,
  30
);

console.log('KEEP:', result.KEEP.length);    // main, release/v1.0
console.log('DELETE:', result.DELETE.length); // feat/old (merged + stale)
console.log('DISCUSS:', result.DISCUSS.length); // (any invalid names)
```

**Run Test**:

```bash
cd /tmp/branch-cleanup-test
node test-lib-api.js
```

**Validation**:

- ✅ Modules export correctly
- ✅ Functions return expected types
- ✅ Categorisation logic correct

---

## Cleanup

```bash
# Remove test repository
rm -rf /tmp/branch-cleanup-test
rm -rf /tmp/custom-reports
```

---

## Success Criteria

All tests pass when:

1. ✅ Dry-run mode categorises branches correctly without deletion
2. ✅ Invalid branch names marked DISCUSS
3. ✅ Protected branches (main, develop) never deleted
4. ✅ Exclusion patterns preserve release/*and hotfix/* branches
5. ✅ Age-based categorisation works (merged + stale → DELETE)
6. ✅ Both Markdown and JSON reports generated correctly
7. ✅ CLI options (threshold, patterns, reportDir) respected
8. ✅ Error handling graceful (no crashes on invalid input)
9. ✅ GitHub API integration detects open PRs correctly
10. ✅ Library API usable directly from other modules

---

## Next Steps

- Proceed to task decomposition (run `/speckit-tasks`)
- Begin implementation phase following task plan
- Execute tests from this guide during implementation

---

**Quickstart Status**: ✅ Complete | Ready for implementation

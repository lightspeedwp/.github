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
# Run the setup and tests in the same shell so SOURCE_REPO and PATH persist.
SOURCE_REPO="$(git rev-parse --show-toplevel)"

# Create a temporary test repo
mkdir -p /tmp/branch-cleanup-test/scripts /tmp/branch-cleanup-test/lib
cp "$SOURCE_REPO/scripts/cleanup-branches.js" /tmp/branch-cleanup-test/scripts/
cp -R "$SOURCE_REPO/scripts/lib" /tmp/branch-cleanup-test/scripts/
# scripts/lib/constants.js and scripts/lib/branch-categorization.js import
# ../../lib/validate-branch-name.js, which resolves to <test-repo>/lib. Without
# this copy the CLI fails at module load before any validation scenario runs.
cp "$SOURCE_REPO/lib/validate-branch-name.js" \
  /tmp/branch-cleanup-test/lib/validate-branch-name.js
cp "$SOURCE_REPO/.github/specs/009-audit-branch-cleanup/fixtures/test-lib-api.js" \
  /tmp/branch-cleanup-test/test-lib-api.js
printf '%s\n' '{"type":"module"}' > /tmp/branch-cleanup-test/package.json

cd /tmp/branch-cleanup-test

# Initialise git repo
git init -b main
git config user.name "Test User"
git config user.email "test@example.com"

# Create commits on main
echo "initial" > README.md
git add README.md
git commit -m "Initial commit"

# Create test branches (to be categorised)
git branch develop main

git checkout -b feat/old-feature
echo "feature" > feature.txt
git commit --allow-empty -m "Old feature (will be stale)"

git checkout -b fix/typo-fix
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

# Add a local origin because the CLI audits remote-tracking branches.
git init --bare /tmp/branch-cleanup-origin.git
git remote add origin /tmp/branch-cleanup-origin.git
git push --set-upstream origin --all

# Supply a deterministic gh fixture: the successful empty response confirms
# that this isolated repository has no open PRs.
mkdir -p bin
cat > bin/gh <<'EOF'
#!/usr/bin/env bash
if [ "$1" = "--version" ]; then
  echo "gh version quickstart-fixture"
  exit 0
fi
if [ "$1" = "pr" ] && [ "$2" = "list" ]; then
  exit 0
fi
exit 1
EOF
chmod +x bin/gh
export PATH="/tmp/branch-cleanup-test/bin:$PATH"
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
git push origin --all
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
grep -F -- '- `main` — Protected branch' .github/reports/branch-cleanup-*.md
grep -F -- '- `develop` — Protected branch' .github/reports/branch-cleanup-*.md

# Expected reason text: "Protected branch (main, develop, production, staging, master)"
```

**Validation**:

- ✅ main branch marked KEEP (Protected branch)
- ✅ develop branch marked KEEP (Protected branch)
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

# Expected reason text: "Matches exclusion pattern (release/*, hotfix/*)"
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
git checkout develop
git merge feat/old-feature --no-edit
git push origin develop feat/old-feature

# Run categorisation with default 30-day threshold
node scripts/cleanup-branches.js --inactiveDays=30 --verbose

# Expected: feat/old-feature marked DELETE (merged + stale)
cat .github/reports/branch-cleanup-*.md | grep "feat/old-feature"
# Expected reason text: "Merged and inactive beyond threshold"
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
# Expected: Header, Summary metrics table, then Metrics, Deleted Branches,
# KEEP Branches and DISCUSS Branches sections (each only when it has entries)

# Check for required sections
grep "^# Branch Cleanup Report" .github/reports/branch-cleanup-*.md
grep "^## Summary" .github/reports/branch-cleanup-*.md
grep "^## KEEP Branches" .github/reports/branch-cleanup-*.md
grep "^## DISCUSS Branches" .github/reports/branch-cleanup-*.md
```

**Validation**:

- ✅ Markdown report has required header
- ✅ Summary metrics table present with counts
- ✅ KEEP and DISCUSS sections list their branches (the summary table has no per-category rows)

### JSON Report

```bash
cd /tmp/branch-cleanup-test

# Generate JSON report
node scripts/cleanup-branches.js --reportFormat=json --verbose

# Verify JSON structure using jq
jq '.summary' .github/reports/branch-cleanup-*.json
# Expected output: candidates, autoApprovedDelete, deleted, preserved, errors,
# deletionSuccessRate, preservedDeletedRatio, totalCommitsRemoved,
# estimatedStorageFreedBytes, estimatedStorageFreedHuman

# Verify the preserved (KEEP and DISCUSS) entries
jq '.preserved[0]' .github/reports/branch-cleanup-*.json
# Expected: branch, category, reason

# Verify the deletion candidates
jq '.deleted[0]' .github/reports/branch-cleanup-*.json
# Expected: branch, reason, autoApproved, lastCommitDate, author, hash, age, type,
# commitCount, estimatedStorageBytes
```

**Validation**:

- ✅ JSON report valid structure
- ✅ Summary object populated correctly
- ✅ Deleted and preserved entries include the fields above

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

# Expected: Error message, exit code 1 (per contracts/cli-interface.md)
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
export PATH="${PATH#/tmp/branch-cleanup-test/bin:}"
# Earlier scenarios left the shell in the temporary test repository. Stripping the
# gh fixture from PATH does not change that, so return to the source repository
# or the CLI audits the fixture repo and its local bare remote instead.
cd "$SOURCE_REPO"
node scripts/cleanup-branches.js --verbose

# Verify that branches with open PRs are marked KEEP
cat .github/reports/branch-cleanup-*.md | grep "Has active pull request"

# Expected reason for those branches: "Has active pull request"
```

**Validation**:

- ✅ GitHub API queried for open PRs
- ✅ Branches with open PRs marked KEEP
- ✅ No false positives (other branches not marked as active_pr)

---

## Test 10: Library API Usage (Programmatic)

**Goal**: Verify library modules can be imported and used directly

The setup copies the maintained
`fixtures/test-lib-api.js` program into the temporary repository alongside the
CLI and `scripts/lib/`, so all imports resolve from the isolated working tree.

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

## Manual Review: Promoting a DISCUSS Branch

**Goal**: Review `claude/*` branches the audit sends to DISCUSS (spec 018 FR-021)

The CLI marks no `claude/*` branch for automatic deletion. Every one without an open PR or matching exclusion is DISCUSS, because its name has a forbidden prefix.

A maintainer may promote a DISCUSS branch to DELETE only when all of these hold:

- The branch is empty: it has no commits of its own.
- The branch is merged into `develop` or `main`.
- It has no open PR.

Promotion is never automatic. The promoted branch is still removed only through the draft-PR approval described in the contract: it is listed in the deletion PR, a human approves and merges that PR, and nothing is deleted before then. A `claude/*` branch with commits of its own is never promoted, whatever its age.

---

## Cleanup

```bash
# Remove test repository
rm -rf /tmp/branch-cleanup-test
rm -rf /tmp/custom-reports
rm -rf /tmp/branch-cleanup-origin.git
```

---

## Success Criteria

All tests pass when:

1. ✅ Dry-run mode categorises branches correctly without deletion
2. ✅ Invalid branch names marked DISCUSS
3. ✅ Protected branches (main, develop) never deleted
4. ✅ Exclusion patterns preserve `release/*` and `hotfix/*` branches
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

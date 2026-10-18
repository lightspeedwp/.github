# Phase 1 Quickstart: Validation Scenarios

**Date**: 2026-10-18  
**Status**: Ready for Phase 2 implementation  
**Purpose**: Runnable validation scenarios that prove governance consolidation works end-to-end

---

## Prerequisites

- Two repositories cloned and configured:
  - `lightspeedwp/.github` (source of truth - canonical governance)
  - `lightspeedwp/ThisOneTimeOnAcidCom` (consumer - hybrid model)
- GitHub CLI (`gh`) installed and authenticated
- Git configured locally
- Drift detection and template routing workflows deployed to `.github/workflows/`

---

## Scenario 1: Verify Canonical Governance Single Source of Truth

**Goal**: Confirm all governance files exist in lightspeedwp/.github and NOT in ThisOneTimeOnAcidCom

### Setup
```bash
# Clone both repos
gh repo clone lightspeedwp/.github
gh repo clone lightspeedwp/ThisOneTimeOnAcidCom

cd lightspeedwp/.github
```

### Test Steps

**Step 1.1**: List canonical governance files in source repo
```bash
# Check labels.yml exists (canonical)
ls -la .github/labels.yml
# Expected: ✅ File exists
# Output: -rw-r--r-- ... .github/labels.yml

# Count canonical labels
grep "^- name:" .github/labels.yml | wc -l
# Expected: ✅ 158 labels
```

**Step 1.2**: Verify NO duplication in consumer repo
```bash
cd ../ThisOneTimeOnAcidCom

# Check labels.yml does NOT exist
test -f .github/labels.yml && echo "❌ FAIL: Duplicate labels.yml found" || echo "✅ PASS: No duplicate labels.yml"

# Check issue templates do NOT exist
test -d .github/ISSUE_TEMPLATE && echo "❌ FAIL: Duplicate ISSUE_TEMPLATE found" || echo "✅ PASS: No duplicate ISSUE_TEMPLATE"

# Check PR templates do NOT exist
test -d .github/PULL_REQUEST_TEMPLATE && echo "❌ FAIL: Duplicate PULL_REQUEST_TEMPLATE found" || echo "✅ PASS: No duplicate PULL_REQUEST_TEMPLATE"
```

**Step 1.3**: Verify custom workflows ARE present in consumer
```bash
# Custom workflows should exist
ls -la .github/workflows/
# Expected: ✅ Contains custom workflow files (e.g., wordpress-ci.yml, build-assets.yml)
```

### Expected Result
```
✅ Canonical governance files exist in lightspeedwp/.github
✅ NO duplicate governance files in ThisOneTimeOnAcidCom
✅ Custom workflows preserved in ThisOneTimeOnAcidCom/.github/workflows/
✅ Single source of truth maintained
```

---

## Scenario 2: Validate PR Template Routing by Branch Type

**Goal**: Confirm PR template routing workflow suggests correct templates based on branch prefix

### Setup
```bash
cd lightspeedwp/ThisOneTimeOnAcidCom
git fetch origin
git checkout -b feat/validation-test origin/develop
# If branch doesn't exist locally, create it
```

### Test Steps

**Step 2.1**: Create a test feature branch and PR
```bash
# Create local feature branch from develop
git checkout -b feat/test-consolidation develop

# Make a trivial commit
echo "# Test consolidation" >> TEST.md
git add TEST.md
git commit -m "Test: PR template routing"

# Push branch to origin
git push -u origin feat/test-consolidation

# Create PR via CLI
gh pr create \
  --base develop \
  --head feat/test-consolidation \
  --title "Test: PR template routing" \
  --body "Testing pr_feature.md routing"
# Expected output: ✅ PR created (note the PR number)
```

**Step 2.2**: Verify template routing comment
```bash
# Get PR number from previous output
PR_NUMBER=<number>

# Wait 30 seconds for workflow to run
sleep 30

# Check PR comments for template routing suggestion
gh pr view $PR_NUMBER --json comments

# Expected: Comment containing:
# - ✅ PR Template Suggestion
# - Branch: feat/test-consolidation
# - Suggested template: `pr_feature.md`
# - Type label: type:feature
```

**Step 2.3**: Verify label was applied
```bash
# Check labels on PR
gh pr view $PR_NUMBER --json labels

# Expected: ✅ Contains label "type:feature"
```

**Step 2.4**: Test different branch types
```bash
# Create fix branch
git checkout -b fix/test-consolidation develop
echo "# Fix test" >> FIX.md
git add FIX.md
git commit -m "Fix: consolidation testing"
git push -u origin fix/test-consolidation

# Create PR
gh pr create \
  --base develop \
  --head fix/test-consolidation \
  --title "Fix: consolidation testing" \
  --body "Testing pr_bug.md routing"

PR_NUMBER2=<new-pr-number>
sleep 30

# Verify routing
gh pr view $PR_NUMBER2 --json comments labels

# Expected:
# - Comment suggests: pr_bug.md
# - Label: type:bug
```

### Expected Result
```
✅ PR template routing works for feat/ branches → pr_feature.md, type:feature
✅ PR template routing works for fix/ branches → pr_bug.md, type:bug
✅ Branch prefix determines template automatically
✅ Type labels applied correctly
```

---

## Scenario 3: Verify Drift Detection Blocks Duplicate Governance Files

**Goal**: Confirm drift detection workflow rejects PRs that try to add duplicate governance files

### Setup
```bash
cd lightspeedwp/ThisOneTimeOnAcidCom
git checkout -b test/drift-detection develop
```

### Test Steps

**Step 3.1**: Try to add duplicate labels.yml
```bash
# Create duplicate labels.yml from .github source
cp ../GitHub/.github/labels.yml .github/labels.yml

# Commit and push
git add .github/labels.yml
git commit -m "test: add duplicate labels"
git push -u origin test/drift-detection

# Create PR
gh pr create \
  --base develop \
  --head test/drift-detection \
  --title "Test: Drift detection - duplicate labels" \
  --body "Testing drift detection blocks labels.yml"

PR_NUMBER3=<new-pr-number>
```

**Step 3.2**: Verify PR is blocked
```bash
# Wait for workflow to run
sleep 30

# Check PR status
gh pr view $PR_NUMBER3 --json statusCheckRollup

# Expected: ❌ Status check "drift-detection" = FAILURE

# Check comments for blocking message
gh pr view $PR_NUMBER3 --json comments | grep -i "blocked"

# Expected: Comment containing "Drift Detection: BLOCKED"
```

**Step 3.3**: Try to add custom workflow (should be allowed)
```bash
# Reset branch
git reset --hard origin/develop

# Create new custom workflow
cat > .github/workflows/custom-test.yml <<'EOF'
name: Custom Test Workflow

on:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run custom test
        run: echo "Custom workflow for ThisOneTimeOnAcidCom"
EOF

# Commit and push
git add .github/workflows/custom-test.yml
git commit -m "feat: add custom test workflow"
git push -u origin test/drift-detection

# Create PR
gh pr create \
  --base develop \
  --head test/drift-detection \
  --title "Test: Drift detection allows custom workflows" \
  --body "Testing drift detection allows .github/workflows/"

PR_NUMBER4=<new-pr-number>
sleep 30
```

**Step 3.4**: Verify custom workflow PR is allowed
```bash
# Check PR status
gh pr view $PR_NUMBER4 --json statusCheckRollup

# Expected: ✅ Status check "drift-detection" = SUCCESS

# Check comments
gh pr view $PR_NUMBER4 --json comments

# Expected: Comment containing "Drift Detection: PASSED"
```

### Expected Result
```
✅ Drift detection blocks PRs adding .github/labels.yml
✅ Drift detection blocks PRs adding .github/ISSUE_TEMPLATE/
✅ Drift detection blocks PRs adding .github/PULL_REQUEST_TEMPLATE/
✅ Drift detection ALLOWS PRs adding .github/workflows/ (custom workflows)
```

---

## Scenario 4: Verify Issue Template Routing

**Goal**: Confirm issues created in consumer repo route to canonical templates

### Setup
```bash
cd lightspeedwp/ThisOneTimeOnAcidCom
```

### Test Steps

**Step 4.1**: Create an issue via web UI
```bash
# Open ThisOneTimeOnAcidCom in browser
gh repo view --web

# Navigate to Issues tab
# Click "New Issue"
# Select issue type: "Task"

# Expected: ✅ Issue template loads (from canonical lightspeedwp/.github)
# Template contains: "## Description", "## Acceptance Criteria", etc.
```

**Step 4.2**: Create issue via CLI
```bash
# Verify issue can be created programmatically
# (Issue type selection happens via web; CLI creates raw issues)

ISSUE_TITLE="Test: Consolidation validation"
ISSUE_BODY="This is a test issue for validating consolidation"

gh issue create \
  --title "$ISSUE_TITLE" \
  --body "$ISSUE_BODY" \
  --label "type:task"

# Expected: ✅ Issue created with type:task label (from canonical set)
```

### Expected Result
```
✅ Issue template routing works from canonical lightspeedwp/.github
✅ Issue types available in ThisOneTimeOnAcidCom (via GitHub's native routing)
✅ Labels applied from canonical set
```

---

## Scenario 5: Verify Custom Workflows Use Canonical Labels via API

**Goal**: Confirm custom workflows correctly reference canonical labels (not duplicates)

### Test Steps

**Step 5.1**: Review custom workflow code
```bash
cd lightspeedwp/ThisOneTimeOnAcidCom
cat .github/workflows/wordpress-ci.yml
```

**Step 5.2**: Check for drift violations
```bash
# Audit workflow for hard-coded label definitions
grep -E "labels\.yml|issue-types\.yml|createLabel" .github/workflows/*.yml

# Expected: ❌ No matches (zero hard-coded labels)

# Check for API references instead
grep -E "github\.rest\.issues\.listLabelsForRepo|actions/github-script" .github/workflows/*.yml

# Expected: ✅ Contains references to GitHub API (not hard-coded)
```

**Step 5.3**: Test workflow execution
```bash
# Create PR with custom workflow
git checkout -b feat/test-custom-workflow develop
echo "# Custom test" >> CUSTOM.md
git add CUSTOM.md
git commit -m "feat: test custom workflow execution"
git push -u origin feat/test-custom-workflow

# Create PR
gh pr create \
  --base develop \
  --head feat/test-custom-workflow \
  --title "Test: Custom workflow execution" \
  --body "Testing custom workflows run with canonical governance"

PR_NUMBER5=<new-pr-number>
sleep 60  # Longer wait for WordPress CI workflow
```

**Step 5.4**: Verify workflow ran successfully
```bash
# Check PR workflow runs
gh pr view $PR_NUMBER5 --json statusCheckRollup

# Expected: ✅ Custom workflow runs (wordpress-ci or similar)
# Expected: ✅ Workflow completes successfully
```

### Expected Result
```
✅ Custom workflows reference canonical labels via API
✅ Zero hard-coded label definitions in custom workflows
✅ Workflows execute successfully alongside canonical governance
```

---

## Cleanup

After validation, clean up test branches and PRs:

```bash
# Delete test branches
git push origin --delete feat/test-consolidation
git push origin --delete fix/test-consolidation
git push origin --delete test/drift-detection
git push origin --delete feat/test-custom-workflow

# Alternatively, close PRs via CLI
gh pr close $PR_NUMBER1 --delete-branch
gh pr close $PR_NUMBER2 --delete-branch
# ... etc
```

---

## Validation Pass/Fail Criteria

### PASS Conditions (All must pass)
- ✅ Scenario 1: Single source of truth verified
- ✅ Scenario 2: PR template routing works for all branch types
- ✅ Scenario 3: Drift detection blocks duplicates, allows custom workflows
- ✅ Scenario 4: Issue template routing works
- ✅ Scenario 5: Custom workflows use API references, not duplicates

### FAIL Conditions (Any failure requires fix)
- ❌ Governance files exist in both repos (duplication)
- ❌ Template routing fails (wrong template suggested)
- ❌ Drift detection blocks legitimate custom workflows
- ❌ Custom workflows hard-code labels (violates contracts)

---

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| Single source of truth | 100% | Governance files in .github only |
| Template routing accuracy | ≥95% | Correct templates suggested for branch types |
| Drift detection effectiveness | 100% | All attempts to duplicate blocked |
| Custom workflow compatibility | ≥95% | Workflows run successfully with governance |
| Label API usage | 100% | Zero hard-coded labels in workflows |

# Quickstart: Validate CI Failure Classifications

**Purpose**: Provide team members and reviewers with step-by-step validation scenarios to independently verify that each CI failure category is correctly classified as environmental (pre-existing) or audit-introduced

**Audience**: PR #3367 reviewers, governance audit team, engineering leadership  
**Time Required**: 30-45 minutes total for all scenarios  
**Prerequisites**: Git access, ability to run scripts, access to GitHub PR #3367 and CI outputs

---

## Overview: Validation Philosophy

Each of the 6 failure categories has a specific validation method that proves whether the failure is environmental (pre-existing on develop) or audit-introduced (new from audit changes).

**The core question**: Does this failure exist on the develop branch at the same point in time we started the audit work?

- **YES** → Environmental (not audit's fault)
- **NO** → Audit-introduced (requires fix before merge)

This guide walks you through the validation for each category.

---

## Scenario 1: Validate Changelog Pre-existing Status

### What We're Testing

Changelog validation fails on PR #3367. We claim it's pre-existing: the develop branch also has only 6/54 compliant entries.

### Prerequisites

- Checkout to develop branch: `git checkout develop && git pull origin develop`
- Access to changelog validation script

### Validation Steps

**Step 1: Get changelog validator location**

```bash
cd /home/user/.github
find . -name "*changelog*validator*" -o -name "*validate*changelog*" -type f
# Look for script in .github/validation/changelog/ or similar
```

**Step 2: Run validator on develop**

```bash
cd /home/user/.github
# Example (adjust path based on actual script location):
npm run validate:changelog 2>&1 | tee /tmp/develop-changelog-results.txt
# OR: node .github/validation/changelog/validator.js CHANGELOG.md

# Count compliant entries (look for "✓" or "PASS" in output)
grep -c "✓\|PASS\|compliant" /tmp/develop-changelog-results.txt
# Expected: ~6 compliant entries
```

**Step 3: Switch to audit branch and run again**

```bash
git checkout audit/015-ci-failure-remediation
npm run validate:changelog 2>&1 | tee /tmp/audit-changelog-results.txt

# Count compliant entries
grep -c "✓\|PASS\|compliant" /tmp/audit-changelog-results.txt
# Expected: ~6 compliant entries (same as develop)
```

**Step 4: Compare results**

```bash
diff /tmp/develop-changelog-results.txt /tmp/audit-changelog-results.txt
# Expected: NO SIGNIFICANT DIFFERENCES in pass/fail counts
# (Differences in line numbers/ordering are OK; pass/fail counts must match)
```

### Success Criteria

- ✅ Develop branch: 6/54 entries compliant
- ✅ Audit branch: 6/54 entries compliant (same as develop)
- ✅ No new violations introduced by audit changes
- ✅ Classification: **ENVIRONMENTAL ✓**

### If Validation Fails

If you get different counts between develop and audit:

- [ ] Verify you're comparing the same CHANGELOG.md file (audit branch shouldn't modify it)
- [ ] Check script version matches on both branches
- [ ] Post comment in PR #3367: "Changelog validation failed cross-branch comparison; audit changes appear to have modified entries"
- [ ] Classification changes to: **AUDIT-INTRODUCED (requires investigation)**

### Evidence Template (Record Your Results)

```markdown
**Changelog Validation — Scenario 1 Results**

- Develop branch results: 6/54 compliant
- Audit branch results: 6/54 compliant
- Delta: 0 (identical)
- Validator version: [what you ran]
- Date tested: [today]
- Conclusion: ✅ Environmental (pre-existing on develop)
```

---

## Scenario 2: Validate Mermaid Merge Artifacts

### What We're Testing

Mermaid validation fails on files in `.github/specs/` (spec files). We claim these files exist on develop with identical validation errors.

### Prerequisites

- Access to list of failing Mermaid files from PR #3367 CI output
- `git` command available
- Node/npm or npm run script access

### Validation Steps

**Step 1: Extract failing files from CI**

Look at the Mermaid validation check in PR #3367 CI results. Create a list of files:

```bash
# Files failing Mermaid validation on PR #3367:
# .github/specs/001-governance-audit/architecture.md
# .github/specs/002-audit-rules/diagram.md
# [add more from your CI output]

FAILING_FILES=(
  ".github/specs/001-governance-audit/architecture.md"
  ".github/specs/002-audit-rules/diagram.md"
)
```

**Step 2: Verify files exist on develop**

```bash
git fetch origin develop

for file in "${FAILING_FILES[@]}"; do
  echo "Checking: $file"
  git ls-tree origin/develop "$file"
  # Output: Should show the blob hash (file exists) or be empty (file doesn't exist)
done
```

**Step 3: Check if files have identical Mermaid errors on develop**

```bash
# Checkout each file from develop and run Mermaid validator
for file in "${FAILING_FILES[@]}"; do
  echo "=== Validating $file on develop ==="
  git show origin/develop:"$file" > /tmp/mermaid-develop.md
  
  # Run Mermaid validator (adjust command for your setup):
  npm run validate:mermaid /tmp/mermaid-develop.md 2>&1 | tee /tmp/mermaid-develop-result.txt
done

# Compare with audit branch results (should have same errors)
```

**Step 4: Visual comparison**

```bash
# If Mermaid validator doesn't exist, manually inspect:
git show origin/develop:.github/specs/001-governance-audit/architecture.md | head -20
# Look for Mermaid diagram syntax errors (missing quotes, invalid keywords, etc.)
# Compare with the same file on audit branch:
git show HEAD:.github/specs/001-governance-audit/architecture.md | head -20
# Errors should be identical
```

### Success Criteria

- ✅ All failing files exist on develop branch
- ✅ Same files have identical Mermaid validation errors on develop
- ✅ No new files with Mermaid errors introduced by audit
- ✅ Classification: **ENVIRONMENTAL ✓**

### If Validation Fails

If files don't exist on develop or errors differ:

- [ ] File is NEW to audit branch → Audit-introduced
- [ ] File exists but error is different → Audit-introduced change
- [ ] Post findings: "File X has different Mermaid errors; requires investigation"
- [ ] Classification changes to: **AUDIT-INTRODUCED (requires fix)**

### Evidence Template

```markdown
**Mermaid Validation — Scenario 2 Results**

- Failing files checked:
  - [ ] .github/specs/001-governance-audit/architecture.md — Exists on develop: YES, Error identical: YES
  - [ ] .github/specs/002-audit-rules/diagram.md — Exists on develop: YES, Error identical: YES
- All files pre-existing on develop: ✅
- Errors identical: ✅
- Conclusion: ✅ Environmental (merge artifact from develop)
```

---

## Scenario 3: Validate Frontmatter Merge Artifacts

### What We're Testing

Frontmatter validation fails on spec files. We claim these files and their frontmatter violations exist on develop.

### Prerequisites

- Access to list of failing frontmatter files from PR #3367 CI output
- Node.js and frontmatter parser available (or ability to manually inspect YAML)

### Validation Steps

**Step 1: Extract failing files from CI**

From PR #3367 frontmatter validation check, identify which files failed:

```bash
FRONTMATTER_FAILURES=(
  ".github/specs/004-branch-naming-strategy/spec.md"
  ".github/specs/005-requirements-quality/spec.md"
  # Add more from CI output
)
```

**Step 2: Check file exists on develop**

```bash
for file in "${FRONTMATTER_FAILURES[@]}"; do
  git ls-tree origin/develop "$file"
done
```

**Step 3: Extract and compare frontmatter**

```bash
# Create frontmatter extraction script (if you don't have one):
cat > /tmp/extract-frontmatter.js << 'EOF'
const fs = require('fs');
const path = process.argv[2];
const content = fs.readFileSync(path, 'utf8');
const match = content.match(/^---\n([\s\S]*?)\n---/);
if (match) console.log(match[1]);
else console.log("NO FRONTMATTER");
EOF

# Extract frontmatter from develop version
git show origin/develop:".github/specs/004-branch-naming-strategy/spec.md" > /tmp/spec-develop.md
node /tmp/extract-frontmatter.js /tmp/spec-develop.md | head -20
# Look for missing required fields or format errors

# Extract from audit version
git show HEAD:".github/specs/004-branch-naming-strategy/spec.md" > /tmp/spec-audit.md
node /tmp/extract-frontmatter.js /tmp/spec-audit.md | head -20
# Compare: errors should be identical
```

**Step 4: Manual inspection (if script unavailable)**

```bash
# Open file in your editor and check frontmatter manually:
# - Look for fields: Created, Status, Feature Branch, etc.
# - Check date format (should be YYYY-MM-DD)
# - Check Status values (should be Draft, In Progress, Complete, etc.)

git show origin/develop:.github/specs/004-branch-naming-strategy/spec.md | head -30
# vs
git show HEAD:.github/specs/004-branch-naming-strategy/spec.md | head -30
# Frontmatter should be identical (violations same on both)
```

### Success Criteria

- ✅ All failing files exist on develop
- ✅ Frontmatter violations identical on both branches
- ✅ No new frontmatter errors introduced by audit
- ✅ Classification: **ENVIRONMENTAL ✓**

### If Validation Fails

- [ ] File doesn't exist on develop → Audit-introduced
- [ ] Frontmatter errors differ → Audit made changes to frontmatter
- [ ] Audit fixed some frontmatter → Audit-introduced (positive change, but audit-related)
- [ ] Classification: **AUDIT-INTRODUCED**

### Evidence Template

```markdown
**Frontmatter Validation — Scenario 3 Results**

- Files with failing frontmatter:
  - [ ] .github/specs/004-branch-naming-strategy/spec.md — Exists: YES, Errors identical: YES
  - [ ] .github/specs/005-requirements-quality/spec.md — Exists: YES, Errors identical: YES
- All violations pre-existing: ✅
- No audit-introduced frontmatter changes: ✅
- Conclusion: ✅ Environmental (merge artifact from develop)
```

---

## Scenario 4: Investigate Agent Spec Validation

### What We're Testing

Agent Spec Validation check fails. We need to determine if it's infrastructure-related or audit-related.

### Prerequisites

- Ability to run agent spec validation script locally
- Access to both develop and audit branches
- Node.js if using Node.js-based validator

### Validation Steps

**Step 1: Identify the specific error**

From PR #3367, find the Agent Spec Validation check. Note the exact error message:

```
Error: "Frontmatter Validation: ❌ Failed"
Error: "Cross-Reference Validation: ❌ Failed"
[etc.]
```

**Step 2: Reproduce locally on current branch**

```bash
cd /home/user/.github
git status
# Should show you're on the audit/015... branch

# Find and run the agent spec validation script:
npm run validate:agent-spec 2>&1 | tee /tmp/audit-local-result.txt

# Does the same error occur? YES/NO
```

**Step 3: Test on develop branch**

```bash
git checkout develop
git pull origin develop

npm run validate:agent-spec 2>&1 | tee /tmp/develop-local-result.txt

# Does the error occur on develop too?
# Compare errors:
diff /tmp/develop-local-result.txt /tmp/audit-local-result.txt
```

**Step 4: Test audit-only (no merged develop changes)**

```bash
# This requires more sophisticated testing:
# Checkout audit branch, but exclude files from develop merge
# (or compare commit history)

git checkout audit/015-ci-failure-remediation
git log --oneline -5
# Look for merge commit that brought in develop changes

# If there's a merge commit, you can test the audit branch
# before the merge happened (more complex; ask governance team)
```

### Success Criteria — Classification Decision Matrix

| Develop Status | Audit Status | Conclusion |
|---|---|---|
| ✅ PASS | ✅ PASS | Infrastructure fixed it; or audit unrelated |
| ❌ FAIL (same error) | ❌ FAIL (same error) | Environmental (infrastructure issue) |
| ❌ FAIL | ❌ FAIL (different error) | Audit-related change (audit changed something) |
| ✅ PASS | ❌ FAIL | Audit-introduced (requires fix) |

**Classification Flow**:

- If test on develop FAILS with same error → **ENVIRONMENTAL ✓**
- If test on develop PASSES but audit FAILS → **AUDIT-INTRODUCED ✗ (needs fix)**
- If test on develop FAILS with different error → **AMBIGUOUS (needs investigation)**

### If Investigation Inconclusive

- [ ] Document findings in comment on PR #3367
- [ ] Request help from infrastructure team
- [ ] Tentatively classify as **ENVIRONMENTAL** (likely) with note: "Confirmed via investigation; see details below"

### Evidence Template

```markdown
**Agent Spec Validation — Scenario 4 Results**

- Error message: "[exact error from CI]"
- Local reproduction on audit: [PASS/FAIL]
- Local reproduction on develop: [PASS/FAIL]
- Error comparison: [same/different]
- Conclusion: [ENVIRONMENTAL/AUDIT-INTRODUCED/INVESTIGATING]
- Reasoning: [explain based on test results]
```

---

## Scenario 5: Verify Milestone Assignment

### What We're Testing

GitHub Projects requires a milestone to be assigned on PR #3367. This is a manual UI action (not code-enforced).

### Prerequisites

- Access to GitHub PR #3367
- Access to GitHub Projects board for this repo
- Ability to click UI elements and assign fields

### Validation Steps

**Step 1: Navigate to PR #3367**

- Open GitHub in browser
- Go to: <https://github.com/lightspeedwp/.github/pull/3367>

**Step 2: Check if PR is linked to a GitHub Project**

- Look for "Projects" section on the right sidebar
- Is there a linked project? YES/NO

**Step 3: Open the project board**

- Click on the linked project name
- Find the PR #3367 card
- Look for the "Milestone" field

**Step 4: Check milestone assignment status**

- Is the Milestone field populated?
  - [ ] YES — Current value: [milestone name]
  - [ ] NO — Field is empty

**Step 5: Assign milestone (if needed)**

- Click on the Milestone field
- Select the appropriate governance audit milestone (e.g., "Q3-2026-Governance-Audit")
- Wait for field to save (should show checkmark)

**Step 6: Verify assignment**

- Refresh page or navigate away and back
- Milestone field should show the assigned value

### Success Criteria

- ✅ Milestone field exists on project card
- ✅ Milestone is assigned (or can be assigned via UI)
- ✅ No code changes needed to complete this requirement
- ✅ Classification: **GOVERNANCE WORKFLOW ✓ (Manual assignment)**

### If Validation Fails

- [ ] No projects linked to PR → Governance team should link it
- [ ] Milestone field not available → Project setup incomplete (infra issue)
- [ ] Can't assign → Permission issue (governance team lead can help)
- [ ] Classification: **WORKFLOW BLOCKER (not environmental; governance setup issue)**

### Evidence Template

```markdown
**Milestone Assignment — Scenario 5 Results**

- GitHub Project linked: ✅ YES (Project: [name])
- Milestone field exists: ✅ YES
- Current milestone status: [ASSIGNED | UNASSIGNED]
- Current value: [milestone name or "N/A"]
- Assignment tested: ✅ YES, works via UI
- Conclusion: ✅ Governance Workflow (manual UI action; no code needed)
```

---

## Scenario 6: Validate Lint/Test Merge Artifacts

### What We're Testing

Lint and testing checks fail on PR #3367. We claim these files exist on develop with identical violations under current linting/testing rules.

### Prerequisites

- ESLint, PHPCS, or other linting tools installed
- Access to current rule versions (ESLint 9.0, etc.)
- Jest or other testing framework if applicable

### Validation Steps

**Step 1: Identify failing files**

From PR #3367 CI output, extract:

- Files with lint violations (ESLint, PHPCS, etc.)
- Tests that are failing (Jest, pytest, etc.)

```bash
LINT_FAILURES=(
  ".github/workflows/old-workflow.yml"
  ".github/scripts/validate-*.js"
)

TEST_FAILURES=(
  "tests/unit/governance.test.js"
)
```

**Step 2: Verify files exist on develop**

```bash
git fetch origin develop

for file in "${LINT_FAILURES[@]}" "${TEST_FAILURES[@]}"; do
  git ls-tree origin/develop "$file"
  # Should output blob hash (file exists)
done
```

**Step 3: Run linter on develop version**

```bash
for file in "${LINT_FAILURES[@]}"; do
  echo "=== Linting $file on develop ==="
  git show origin/develop:"$file" > /tmp/file-develop
  
  # Run current version of linter:
  npx eslint /tmp/file-develop 2>&1 | tee /tmp/lint-develop-$i.txt
done
```

**Step 4: Compare lint results**

```bash
# Run same linter on audit branch version:
npx eslint .github/workflows/old-workflow.yml 2>&1 | tee /tmp/lint-audit-result.txt

# Compare:
diff /tmp/lint-develop-*.txt /tmp/lint-audit-result.txt
# Should show same violations (or close match; formatting differences OK)
```

**Step 5: Run tests (if applicable)**

```bash
git checkout develop
npm test 2>&1 | tee /tmp/tests-develop.txt

git checkout audit/015-ci-failure-remediation
npm test 2>&1 | tee /tmp/tests-audit.txt

# Compare test results:
grep -c "FAIL\|PASS" /tmp/tests-develop.txt
grep -c "FAIL\|PASS" /tmp/tests-audit.txt
# Should be same or very close (audit shouldn't introduce new test failures)
```

### Success Criteria

- ✅ All failing files exist on develop
- ✅ Lint violations identical on both branches (same rule, same file)
- ✅ Test failures identical (pre-existing baseline)
- ✅ No NEW lint/test failures introduced by audit
- ✅ Classification: **ENVIRONMENTAL ✓**

### If Validation Fails

- [ ] File doesn't exist on develop → NEW file, Audit-introduced
- [ ] Lint results differ significantly → Audit made changes
- [ ] Test failures are fewer on audit → Audit FIXED tests (good!)
- [ ] Test failures are more on audit → Audit-introduced (requires fix)
- [ ] Classification: **AUDIT-INTRODUCED** (for new failures) or **AUDIT-IMPROVEMENT** (for fixes)

### Evidence Template

```markdown
**Lint/Test Validation — Scenario 6 Results**

Lint failures:
- [ ] .github/workflows/old-workflow.yml — Exists on develop: YES, Errors identical: YES
- [ ] .github/scripts/validate-*.js — Exists on develop: YES, Errors identical: YES

Test failures:
- [ ] tests/unit/governance.test.js — Exists on develop: YES, Fails on both: YES

Summary:
- All failing files pre-existing on develop: ✅
- All violations identical under current rules: ✅
- No audit-introduced lint/test failures: ✅
- Conclusion: ✅ Environmental (merge artifact from develop)
```

---

## Summary: All Scenarios Complete

After running all 6 scenarios, you should be able to answer:

- [ ] **Scenario 1**: Is changelog validation pre-existing on develop? (Expected: YES)
- [ ] **Scenario 2**: Do all Mermaid failure files exist on develop? (Expected: YES)
- [ ] **Scenario 3**: Do all frontmatter failures exist on develop? (Expected: YES)
- [ ] **Scenario 4**: Is Agent Spec validation infrastructure-related? (Expected: YES or INVESTIGATING)
- [ ] **Scenario 5**: Can milestone be assigned via GitHub UI? (Expected: YES)
- [ ] **Scenario 6**: Do lint/test failures exist on develop? (Expected: YES)

### Final Confidence Check

If all 6 scenarios confirm their expected answers:

✅ **Classification is CORRECT: All 29 CI failures are ENVIRONMENTAL**

If any scenario shows unexpected results:

❌ **Classification needs REVISION: Audit-introduced failures detected**

- [ ] Post comment on PR #3367 with findings
- [ ] Identify specific audit-related failures that need fixes
- [ ] Work with audit team to resolve audit-introduced issues

---

## Helpful Commands Reference

```bash
# Switch branches
git checkout develop
git checkout audit/015-ci-failure-remediation

# List files on specific branch
git ls-tree origin/develop .github/specs/

# Show file content from branch
git show origin/develop:.github/specs/001-governance-audit/spec.md

# Run validation scripts
npm run validate:changelog
npm run validate:mermaid
npm run lint
npm test

# Compare outputs
diff file1.txt file2.txt
grep -c "pattern" file.txt

# Check file existence
ls -la file.md
git ls-files | grep filename
```

---

## Getting Help

If validation results are unclear:

1. **Post detailed comment in PR #3367** with:
   - Which scenario you ran
   - Expected vs. actual results
   - Exact error messages or command outputs

2. **Tag governance team**: @governance-lead

3. **Reference this guide**: "I followed Quickstart Scenario 2 and found..."

---

**Generated by**: `/speckit-plan` (governance audit remediation workflow)  
**Date**: 2026-09-18  
**Spec**: 015-ci-failure-remediation  
**Related PR**: #3367 (Governance Audit Implementation)

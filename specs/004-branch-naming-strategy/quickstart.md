# Branch Naming Strategy — Validation Quickstart & Runbook

**Purpose**: Hands-on validation guide for developers to verify branch naming works end-to-end

**Prerequisites**: Git 2.9+, Node.js 18+, npm 8+, cloned repository with branch naming validation installed

---

## Setup: Install Local Validation Hook

### Step 1: Clone repository and install dependencies

```bash
git clone https://github.com/lightspeedwp/.github.git
cd .github
npm install
# This runs `npm run prepare`, which installs the pre-push hook
```

### Step 2: Verify hook installation

```bash
# Check that the hook file exists and is executable
ls -la .git/hooks/pre-push

# Should output:
# -rwxr-xr-x ... .git/hooks/pre-push

# View the hook script
cat .git/hooks/pre-push
# Should output the validation script
```

### Step 3: Test hook with a dummy branch

```bash
# Create a valid branch and verify hook passes
git checkout -b feat/test-validation
echo "test" >> README.md
git add README.md
git commit -m "test: validate branch naming"
git push -u origin feat/test-validation
# ✅ Hook validates branch name and allows push

# Clean up
git checkout main
git branch -D feat/test-validation
git push origin --delete feat/test-validation
```

---

## Validation Tests

### Test 1: Valid Branch Names

Test that valid branches pass validation.

**Test Cases**:
```bash
npm run validate:branch-name -- --branch feat/user-auth-improvements
# ✅ Output: Branch 'feat/user-auth-improvements' is valid

npm run validate:branch-name -- --branch fix/authentication-timeout
# ✅ Output: Branch 'fix/authentication-timeout' is valid

npm run validate:branch-name -- --branch docs/branching-strategy-guide
# ✅ Output: Branch 'docs/branching-strategy-guide' is valid

npm run validate:branch-name -- --branch security/sql-injection-fix
# ✅ Output: Branch 'security/sql-injection-fix' is valid

npm run validate:branch-name -- --branch refactor/api-response-structure
# ✅ Output: Branch 'refactor/api-response-structure' is valid

npm run validate:branch-name -- --branch a11y/wcag-compliance-audit
# ✅ Output: Branch 'a11y/wcag-compliance-audit' is valid

npm run validate:branch-name -- --branch i18n/german-translation-pack
# ✅ Output: Branch 'i18n/german-translation-pack' is valid
```

**Expected Result**: All branches marked as valid ✅

---

### Test 2: Invalid Type

Test that invalid branch types are rejected.

**Test Cases**:
```bash
npm run validate:branch-name -- --branch feature/user-auth
# ❌ Output: Invalid type 'feature'. Use 'feat' instead.
# Suggestion: Did you mean `feat/user-auth`?

npm run validate:branch-name -- --branch bug/timeout-issue
# ❌ Output: Invalid type 'bug'. Use 'fix' instead.
# Suggestion: Did you mean `fix/timeout-issue`?

npm run validate:branch-name -- --branch hotbug/critical-crash
# ❌ Output: Invalid type 'hotbug'. Use 'hotfix' instead.
# Suggestion: Did you mean `hotfix/critical-crash`?
```

**Expected Result**: All branches rejected with clear error and suggestion ❌

---

### Test 3: Forbidden Prefixes

Test that reserved prefixes are blocked.

**Test Cases**:
```bash
npm run validate:branch-name -- --branch claude/my-feature
# ❌ Output:
# Forbidden prefix 'claude/'.
# Reserved for Claude Code internal sessions.
# Pattern: {type}/{scope}-{title}
# Example: feat/user-auth-improvements

npm run validate:branch-name -- --branch copilot/fix-something
# ❌ Output:
# Forbidden prefix 'copilot/'.
# Reserved for GitHub Copilot integration.
# Pattern: {type}/{scope}-{title}
# Example: feat/user-auth-improvements

npm run validate:branch-name -- --branch openai/add-api
# ❌ Output:
# Forbidden prefix 'openai/'.
# Reserved for OpenAI integration.
# Pattern: {type}/{scope}-{title}
# Example: feat/user-auth-improvements
```

**Expected Result**: All branches rejected with reservation explanation ❌

---

### Test 4: Malformed Scope/Title

Test that scope/title formatting errors are caught.

**Test Cases**:
```bash
# Underscores instead of hyphens
npm run validate:branch-name -- --branch feat/user_auth
# ❌ Output: Invalid scope 'user_auth'. Use hyphens, not underscores.
# Suggestion: Did you mean `feat/user-auth`?

# Empty scope
npm run validate:branch-name -- --branch feat/-title
# ❌ Output: Scope cannot be empty.
# Example: feat/user-improvements

# Uppercase letters
npm run validate:branch-name -- --branch feat/User-Auth
# ❌ Output: Scope must be lowercase.
# Suggestion: Did you mean `feat/user-auth`?

# Consecutive hyphens
npm run validate:branch-name -- --branch feat/user--auth
# ❌ Output: No consecutive hyphens allowed.
# Suggestion: Did you mean `feat/user-auth`?

# Special characters
npm run validate:branch-name -- --branch feat/user@auth
# ❌ Output: Scope contains invalid characters '@'.
# Suggestion: Did you mean `feat/user-auth`?
```

**Expected Result**: All branches rejected with specific error and suggestion ❌

---

### Test 5: Create Branch, Commit, and Push

Test the full flow: create a valid branch, commit code, and verify hook allows push.

**Scenario**:
```bash
# Create a new feature branch
git checkout -b feat/user-preferences-implementation
# Hook will validate on push, so create some commits first

# Make a change
echo "// User preferences feature" >> lib/user-preferences.js
git add lib/user-preferences.js
git commit -m "feat: add user preferences module"

# Push to remote
git push -u origin feat/user-preferences-implementation

# Expected output from git:
# ...
# ✅ Branch 'feat/user-preferences-implementation' is valid
# remote: GitHub found 9 vulnerabilities...
# To https://github.com/lightspeedwp/.github
#  * [new branch] feat/user-preferences-implementation -> feat/user-preferences-implementation
```

**Verification on GitHub**:
1. Go to `https://github.com/lightspeedwp/.github/tree/feat/user-preferences-implementation`
2. Create a PR (click "Compare & pull request")
3. Verify:
   - PR description auto-populated with feature template (pr_feature.md)
   - Labels auto-applied: `type:feature`, `area:user` (if detected)
   - GitHub Actions workflow shows: ✅ `branch-name-validation` passed

**Expected Result**: Push succeeds, PR created with correct template and labels ✅

---

### Test 6: Try to Push Invalid Branch (Pre-Push Hook Blocks)

Test that the local hook prevents push of invalid branches.

**Scenario**:
```bash
# Create an invalid branch
git checkout -b claude/my-experiment

# Make a commit
echo "test" >> README.md
git add README.md
git commit -m "test: experiment"

# Try to push (hook should block)
git push -u origin claude/my-experiment

# Expected output:
# ❌ Branch validation failed
# ❌ Forbidden prefix 'claude/'.
# Reserved for Claude Code internal sessions.
# Error: Pre-push hook rejected branch 'claude/my-experiment'
# 
# To bypass (not recommended):
#   git push --no-verify
# 
# To fix: Rename branch with correct pattern:
#   git branch -m feat/my-experiment
#   git push -u origin feat/my-experiment
```

**Expected Result**: Push rejected by hook ❌; developer must fix branch name

---

### Test 7: Bypass Hook (With Remote Enforcement)

Test that `--no-verify` bypass is blocked by remote GitHub Actions.

**Scenario**:
```bash
# Create invalid branch
git checkout -b feature/my-feature

# Make commits
echo "test" >> file.txt
git add file.txt
git commit -m "test"

# Bypass local hook
git push -u origin feature/my-feature --no-verify

# Expected output:
# To https://github.com/lightspeedwp/.github
#  * [new branch] feature/my-feature -> feature/my-feature

# But on GitHub:
# 1. GitHub Actions workflow runs: branch-name-validation
# 2. Workflow detects invalid type 'feature' (should be 'feat')
# 3. Workflow adds comment to PR:
#    "❌ Branch name validation failed: Invalid type 'feature'.
#     Did you mean: feat/my-feature?"
# 4. If merge blocking enabled: PR cannot merge until branch is fixed
```

**Expected Result**: Local bypass attempt is caught remotely; developer notified ❌

---

### Test 8: CLI Exit Codes (for CI/CD integration)

Test that exit codes work correctly for scripted validation.

**Test Cases**:
```bash
# Valid branch: exit 0
npm run validate:branch-name -- --branch feat/auth
echo $?
# Output: 0

# Invalid branch: exit 1
npm run validate:branch-name -- --branch claude/auth
echo $?
# Output: 1

# Test in a script
if npm run validate:branch-name -- --branch feat/auth > /dev/null; then
  echo "✅ Branch is valid"
else
  echo "❌ Branch is invalid"
fi
# Output: ✅ Branch is valid
```

**Expected Result**: Exit codes correct for scripting ✅

---

### Test 9: Machine-Readable JSON Output

Test JSON output for programmatic parsing.

**Test Case**:
```bash
npm run validate:branch-name -- --branch feat/user-auth --json

# Output:
# {
#   "valid": true,
#   "type": "feat",
#   "scope": "user",
#   "title": "auth",
#   "pr_template": "pr_feature.md",
#   "default_labels": ["type:feature"],
#   "area_labels": ["area:auth"],
#   "errors": []
# }
```

**Test Case (invalid)**:
```bash
npm run validate:branch-name -- --branch claude/my-feature --json

# Output:
# {
#   "valid": false,
#   "type": null,
#   "scope": null,
#   "title": null,
#   "pr_template": null,
#   "default_labels": [],
#   "area_labels": [],
#   "errors": ["forbidden_prefix"],
#   "suggested_name": "feat/my-feature"
# }
```

**Expected Result**: JSON output parseable for automation ✅

---

## PR Template Routing Verification

Once a PR is created from a valid branch, verify that the correct template and labels are applied.

### Checklist

- [ ] **Template Loaded**: PR description shows the correct template sections for the branch type
  - `feat/...` → Feature checklist (description, testing, backwards compat, etc.)
  - `fix/...` → Bug fix checklist (reproduction steps, root cause, fix description, etc.)
  - `security/...` → Security checklist (threat model, CVSS, remediation steps, etc.)
  - `docs/...` → Documentation checklist (link check, screenshots, examples, etc.)
  - See [contracts/branch-naming.contract.md](./contracts/branch-naming.contract.md) for full list

- [ ] **Labels Applied**: PR sidebar shows automatic labels
  - `type:feature` for `feat` branches
  - `type:bug` for `fix` branches
  - `type:security, priority:critical` for `security` branches
  - Area labels auto-detected (e.g., `area:api`, `area:docs`)
  - See contract for complete mapping

- [ ] **Workflow Status**: GitHub Actions tab shows checks passing
  - ✅ `branch-name-validation` — Branch validated successfully
  - ✅ `pr-template-routing` — Template and labels applied
  - No ❌ failures

---

## Troubleshooting

### Q: Hook not running on push

**Symptoms**: `git push` succeeds even though branch name seems invalid

**Solution**:
```bash
# Check if hook is executable
ls -la .git/hooks/pre-push
# Should show: -rwxr-xr-x (executable)

# If not executable, fix it
chmod +x .git/hooks/pre-push

# Verify hook runs manually
.git/hooks/pre-push origin feat/test-branch
# Should output: ✅ Branch 'feat/test-branch' is valid
```

### Q: Hook bypassed with `--no-verify`

**Symptoms**: Branch pushed despite being invalid (developer used `--no-verify`)

**Solution**:
```bash
# 1. GitHub Actions workflow will still catch it on remote
# 2. PR will show validation failure comment
# 3. If merge blocking enabled, PR cannot merge
# 4. Developer must:
#    a. Fix branch name: git branch -m {new-name}
#    b. Force-push corrected name: git push -f
#    c. Create new PR from corrected branch
```

### Q: Invalid branch already pushed

**Symptoms**: Branch with wrong name already on remote; need to fix it

**Solution**:
```bash
# Create new branch with correct name
git checkout -b feat/correct-name

# (optional) Copy commits from old branch
git cherry-pick old-branch~0..old-branch

# Push new branch
git push -u origin feat/correct-name

# Delete old invalid branch
git push origin --delete claude/wrong-name

# Update PR to point to new branch (if PR exists)
# OR close old PR and open new one from feat/correct-name
```

### Q: Area label not detected

**Symptoms**: PR created but `area:*` label not applied

**Solution**:
```bash
# Check branch scope against detection keywords
# Example: branch feat/api-response
# - Scope is 'api-response'
# - Keywords: 'api' detected → area:api should be applied

# If not applied:
# 1. Check that labels.yml contains the area label
# 2. Check branch-labels.yml has keyword mapping
# 3. Manually add label if needed (temporary fix, report bug)
```

---

## Next Steps

**All tests passing?** Your branch naming validation is working correctly! ✅

**Next**:
1. Share this quickstart with your team
2. Encourage developers to run the validation tests locally
3. Monitor GitHub Actions workflow logs for validation results
4. Report any issues or edge cases to @ashley

**For Maintainers**:
- Monitor compliance metrics dashboard (URL TBD)
- Update [contracts/branch-naming.contract.md](./contracts/branch-naming.contract.md) if type/label mappings change
- Re-run full test suite quarterly to catch regressions

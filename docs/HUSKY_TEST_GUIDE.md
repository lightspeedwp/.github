---
file_type: "documentation"
title: "Husky Testing Guide"
description: "Test and verify Husky pre-commit and pre-push hooks"
last_updated: "2025-12-04"
version: "1.0"
maintainer: "LightSpeed DevOps"
tags: ["husky", "testing"]
---

## Husky Pre-Commit Testing

## Quick Test Commands

### 1. Verify Husky Installation

```bash
# Check Husky is installed
npm list husky

# Expected output:
# └── husky@9.x.x

# Verify hook files exist
ls -la .husky/

# Should show:
# -rw-r--r--  pre-commit
# -rw-r--r--  pre-push
```

### 2. Test Pre-commit Hook Manually

```bash
# Run the pre-commit hook manually
.husky/pre-commit

# Or using sh explicitly
sh .husky/pre-commit

# This will run lint-staged on all staged files
```

### 3. Test Lint-staged Directly

```bash
# See what lint-staged will do (dry run)
npx lint-staged --debug

# This shows:
# - Which files will be linted
# - What linters will run
# - Any issues found

# Force lint-staged to run
npx lint-staged --allow-empty
```

### 4. Full Linting Check

```bash
# Run all linters across the entire codebase
npm run lint:all

# Or run specific linters:
npm run lint:js      # ESLint + Prettier for JS/TS
npm run lint:css     # Stylelint + Prettier for CSS
npm run lint:md      # Markdownlint + Prettier for Markdown
npm run lint:yaml    # Prettier for YAML
npm run lint:json    # Prettier for JSON
npm run lint:pkg-json # npmpackagejsonlint
```

### 5. Test Pre-push Hook

```bash
# Run the pre-push hook manually
.husky/pre-push

# This will run: npm test
# All tests must pass
```

---

## Full Integration Test Workflow

### Scenario 1: Test Pre-commit Hook (Recommended)

**Step 1: Create a test file with intentional lint errors**

```bash
# Create a test JavaScript file with issues
cat > test-file.js << 'EOF'
// Missing semicolon, extra spaces, etc.
const x=1
const y = 2  ;
function test( ){
  return x+y
}
EOF

# Create a test Markdown file with issues
cat > test-file.md << 'EOF'
# Missing Space After Hash
This line is way too long and should be wrapped because it exceeds the maximum line length allowed by the linter configuration.
EOF
```

**Step 2: Stage the files**

```bash
git add test-file.js test-file.md
```

**Step 3: Attempt to commit (will trigger pre-commit hook)**

```bash
git commit -m "test: testing husky hooks"
```

**Expected behavior:**

- ✅ Husky runs the pre-commit hook
- ✅ lint-staged identifies the files
- ✅ ESLint and markdownlint run
- ✅ Prettier applies auto-fixes
- ✅ Commit either succeeds (if auto-fixed) or fails (if manual fixes needed)

**Step 4: Check the auto-fixes**

```bash
git diff test-file.js
git diff test-file.md

# View the auto-fixed files
cat test-file.js
cat test-file.md
```

**Step 5: Clean up**

```bash
# Reset the test
git reset HEAD test-file.js test-file.md
rm test-file.js test-file.md
```

### Scenario 2: Test with Intentional Failures

**Create a file that cannot be auto-fixed:**

```bash
# Create a file with syntax error (can't auto-fix)
cat > bad-syntax.js << 'EOF'
function broken(
  // Missing closing parenthesis
EOF

git add bad-syntax.js
git commit -m "test: breaking syntax"
```

**Expected behavior:**

- ✅ Husky runs the pre-commit hook
- ❌ ESLint fails with syntax error
- ❌ Commit is blocked
- ✅ You see the error message

**Fix and retry:**

```bash
# Fix the file
cat > bad-syntax.js << 'EOF'
function working() {
  return true;
}
EOF

git add bad-syntax.js
git commit -m "test: fixed syntax"

# Clean up
git reset HEAD bad-syntax.js
rm bad-syntax.js
```

### Scenario 3: Test Pre-push Hook

```bash
# Break a test intentionally
cat > test-break.test.js << 'EOF'
test('intentional failure', () => {
  expect(true).toBe(false);
});
EOF

git add test-break.test.js
git commit -m "test: intentional test failure"

# Attempt to push (will trigger pre-push hook)
git push origin develop

# Expected: Pre-push hook runs npm test
# Expected: Test fails, push is blocked
# Result: You see test output

# Clean up
git reset HEAD~1 test-break.test.js
rm test-break.test.js
```

---

## Debugging Husky Issues

### If hooks aren't running

**Check 1: Verify Git hooks are executable**

```bash
# Make hooks executable
chmod +x .husky/pre-commit .husky/pre-push

# Verify permissions
ls -la .husky/pre-commit .husky/pre-push

# Should show: -rwxr-xr-x (755 permissions)
```

**Check 2: Verify Husky is initialized**

```bash
# Re-initialize Husky
npm run prepare

# This runs: husky install
```

**Check 3: Check if Git hooks are disabled**

```bash
# Some tools/environments disable Git hooks
# Verify Git hooks are enabled:
git config core.hooksPath

# Should output: .husky (or be empty for default)

# Re-enable if needed:
git config core.hooksPath .husky
```

**Check 4: Run with verbose output**

```bash
# Force Husky to show debug output
HUS_DEBUG=* git commit -m "test"

# Or enable debug in your shell
sh -x .husky/pre-commit
```

### If lint-staged isn't working

```bash
# Test lint-staged in isolation
npx lint-staged --debug

# Shows:
# - Which files were matched
# - Which linters ran
# - Output from each linter

# If still having issues:
npx lint-staged --debug --verbose
```

### If linters themselves are failing

```bash
# Test each linter individually
npx eslint .
npx stylelint "**/*.{css,scss}"
npx markdownlint-cli2 "**/*.md"
npx prettier --check .

# Run with fix flag to auto-fix
npx eslint . --fix
npx stylelint "**/*.{css,scss}" --fix
npx markdownlint-cli2 --fix "**/*.md"
npx prettier --write .
```

---

## Bypass Husky (Emergency Only)

### Skip pre-commit hook

```bash
git commit --no-verify

# Or use git alias:
git commit -n "your message"
```

### Skip pre-push hook

```bash
git push --no-verify

# Or use git alias:
git push -n
```

**⚠️ Warning**: Only use `--no-verify` for emergency situations. It bypasses all quality gates!

---

## Monitoring & Verification

### View hook execution logs

```bash
# Most recent git operations
git reflog

# Check commit history
git log --oneline -10

# See what lint-staged did
npx lint-staged --debug
```

### Performance testing

```bash
# Time how long lint-staged takes
time npx lint-staged --allow-empty

# Time the full test suite
time npm test

# Time all linters
time npm run lint:all
```

---

## Common Test Scenarios

| Scenario             | Command                            | Expected Result                 |
| -------------------- | ---------------------------------- | ------------------------------- |
| **Quick check**      | `npm run lint:all`                 | All linters pass                |
| **Pre-commit test**  | `npx lint-staged --debug`          | Shows files that will be linted |
| **Pre-push test**    | `npm test`                         | All tests pass                  |
| **Manual hook test** | `.husky/pre-commit`                | Runs without errors             |
| **Debug hook**       | `HUS_DEBUG=* git commit -m "test"` | Shows Husky debug output        |
| **Verify install**   | `npm list husky`                   | Shows <husky@9.x.x>             |
| **Check hooks**      | `ls -la .husky/`                   | Shows pre-commit and pre-push   |

---

## Full Test Checklist

- [ ] Husky is installed: `npm list husky`
- [ ] Hook files exist: `ls -la .husky/`
- [ ] Hooks are executable: `ls -la .husky/pre-commit`
- [ ] lint-staged works: `npx lint-staged --debug`
- [ ] ESLint works: `npm run lint:js`
- [ ] Prettier works: `npx prettier --check .`
- [ ] Tests pass: `npm test`
- [ ] Pre-commit hook works: `.husky/pre-commit`
- [ ] Pre-push hook works: `.husky/pre-push`
- [ ] Git commit triggers hook: `git commit --allow-empty -m "test"`

---

## Next Steps

After testing:

1. ✅ Verify all hooks work correctly
2. ✅ Run `npm run lint:all` to fix any remaining issues
3. ✅ Make a real commit to test full workflow
4. ✅ Attempt a push to test pre-push hook
5. ✅ Review [HUSKY-PRECOMMITS.md](docs/HUSKY-PRECOMMITS.md) for detailed documentation

---

**Last Updated**: 2025-11-25

---
title: Meta Agent v2.0 — Troubleshooting Guide
description: >
  Common issues, error messages, and solutions for Meta Agent v2.0.
  Includes debugging tips, performance tuning, and edge cases.
file_type: guide
category: troubleshooting
version: 1.0
status: active
author: Ash Shaw
date: '2026-08-21'
language: en
owners:
  - lightspeedwp/maintainers
---

# Meta Agent v2.0 — Troubleshooting Guide

This guide covers common issues you might encounter with Meta Agent v2.0, their causes, and solutions.

## Quick Reference

| Issue | Symptom | Quick Fix |
|-------|---------|-----------|
| Module not found | "Cannot find module 'ajv'" | `npm install` in meta-agent folder |
| YAML parse error | "Front matter is not valid YAML" | Check YAML indentation and syntax |
| Schema validation fails | "Field X is required" or "X is not valid" | Add missing required field or fix value |
| Hook not running | Files commit without validation | Check hook permissions: `chmod +x .git/hooks/pre-commit` |
| CI timeout | Workflow takes >10 minutes | Validate only changed files, not entire repo |
| Performance issue | Validation is very slow | Profile with debug mode, check file sizes |
| Git merge conflict | Hook conflicts post-merge | Resolve manually or use merge strategy |

---

## Installation & Setup Issues

### Error: "Cannot find module 'ajv'"

**When it happens:** Running validation or tests

**Root cause:** Dependencies not installed

**Solution:**
```bash
cd .github/agents/meta-agent
npm install

# If that fails, clean cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Prevention:** Always run `npm install` after cloning or pulling changes.

---

### Error: "Node version mismatch"

**When it happens:** During `npm install` or `npm test`

**Root cause:** Node.js version is too old

**Check version:**
```bash
node --version
# Expected: v16.0.0 or higher (v18+ recommended)
```

**Solution:**
```bash
# Update Node.js using nvm (recommended)
nvm install 18
nvm use 18

# Or download from https://nodejs.org/
```

**Prevention:** Add `.nvmrc` file to project root with required version.

---

### Error: "EACCES: permission denied"

**When it happens:** Running `npm install` or accessing files

**Root cause:** File/folder permissions too restrictive

**Solution:**
```bash
# Fix folder permissions
chmod -R 755 .github/agents/meta-agent

# Fix file permissions
chmod -R 644 .github/agents/meta-agent/package.json
```

**Prevention:** Use `umask 0022` before cloning.

---

## Frontmatter Validation Issues

### Error: "Front matter is not valid YAML"

**When it happens:** Validating a Markdown file

**Root cause:** YAML syntax error in frontmatter

**Example of invalid YAML:**
```markdown
---
title: My Document
description: This is a test
  (BAD: Indentation error)
status: active
---
```

**Solution:**
1. Check YAML indentation (spaces, not tabs)
2. Use a YAML validator: https://www.yamllint.com
3. Wrap multi-line strings in quotes

**Valid example:**
```markdown
---
title: My Document
description: >
  This is a multi-line description.
  All lines are properly indented.
status: active
language: en
---
```

---

### Error: "Field 'X' is required"

**When it happens:** Running validation

**Root cause:** Missing required field in frontmatter

**Solution:**
1. Identify required fields for your repo type:
   - **All repos:** `title`, `description`, `status`, `language`
   - **Control-plane:** Add `file_type`, `category`, `owners`
   - **Block plugin:** Add `block_name`, `block_supports`
   - **Block theme:** Add `theme_name`, `theme_slug`
2. Add the missing field to frontmatter

**Example fix:**
```markdown
---
title: My Document           # ✅ Required
description: A test         # ✅ Required
status: active              # ✅ Required
language: en                # ✅ Required
file_type: guide            # ✅ Required (control-plane)
category: documentation     # ✅ Required (control-plane)
owners:                     # ✅ Required (control-plane)
  - lightspeedwp/maintainers
---
```

---

### Error: "Field 'X' is not valid"

**When it happens:** Running validation

**Root cause:** Field value doesn't match expected format/enum

**Solution:**
1. Check what values are allowed for the field
2. Update the field to use valid value

**Common validation errors:**

| Field | Valid values | Example error |
|-------|--------------|---------------|
| `status` | draft, review, active, archived | `status: published` ❌ |
| `language` | en | `language: en-US` ❌ |
| `difficulty` | beginner, intermediate, advanced | `difficulty: easy` ❌ |

**Fix:**
```yaml
# WRONG
status: published

# CORRECT
status: active
```

---

### Error: "File has no frontmatter"

**When it happens:** Validating a Markdown file

**Root cause:** Missing YAML frontmatter delimiters

**Solution:**
Add frontmatter to the top of the file:

```markdown
---
title: My Document
description: A test document
status: active
language: en
---

# Content starts here
```

---

## Pre-Commit Hook Issues

### Issue: Hook doesn't run on commit

**Symptoms:**
- File commits without validation
- No error message

**Solution:**
```bash
# Check if hook exists
ls -la .git/hooks/pre-commit

# If missing, create it
cp scripts/hooks/meta-agent-validate.sh .git/hooks/pre-commit

# Make executable
chmod +x .git/hooks/pre-commit

# Test it
.git/hooks/pre-commit
```

---

### Issue: Hook runs but causes slow commits

**Symptoms:**
- Commits take >5 seconds
- Validation is the bottleneck

**Root cause:** Validating all files instead of just changed ones

**Solution:**
Update hook to validate only staged files:

```bash
#!/bin/bash
set -e

cd .github/agents/meta-agent

# Validate only staged/changed files
git diff --cached --name-only --diff-filter=ACM | \
  grep '\.md$' | \
  xargs npm run validate -- 2>/dev/null || true

exit 0
```

---

### Issue: Hook conflicts after merge

**Symptoms:**
- Can't commit after merging branches
- Git complains about hook file

**Solution:**
```bash
# Manually resolve the merge
rm .git/hooks/pre-commit
cp scripts/hooks/meta-agent-validate.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# Continue merging
git add .git/hooks/pre-commit
git commit -m "Resolve hook merge conflict"
```

---

## GitHub Actions Workflow Issues

### Issue: "Workflow file not found"

**When it happens:** PR triggered but workflow doesn't run

**Root cause:** Workflow file path is incorrect

**Solution:**
1. Verify workflow file exists:
   ```bash
   ls .github/workflows/meta-agent-validation.yml
   ```
2. Check file is properly formatted (valid YAML)
3. Commit and push the workflow file
4. Trigger a new PR to test

---

### Issue: "Workflow times out (>10 minutes)"

**Symptoms:**
- Workflow job times out
- Validation of large repo takes too long

**Root cause:** Validating too many files

**Solution 1: Validate only changed files**
```yaml
# In workflow, use:
npm run validate:changed  # Instead of npm run validate
```

**Solution 2: Parallelize validation**
```yaml
# Run validation in parallel jobs
jobs:
  validate-docs:
    runs-on: ubuntu-latest
    steps:
      - run: npm run validate -- "docs/**/*.md"
      
  validate-guides:
    runs-on: ubuntu-latest
    steps:
      - run: npm run validate -- "guides/**/*.md"
```

**Solution 3: Exclude large files**
```bash
# Skip validation for specific folders
npm run validate -- --exclude "node_modules/**" --exclude ".git/**"
```

---

### Issue: "codecov/codecov-action fails"

**When it happens:** Workflow completes but coverage upload fails

**Root cause:** Coverage report not found or format wrong

**Solution:**
```yaml
# Ensure coverage is generated
- name: Run tests with coverage
  run: |
    cd .github/agents/meta-agent
    npm test -- --coverage --collectCoverageFrom="skills/**/*.js"

# Then upload (works even if upload fails)
- name: Upload coverage
  if: always()  # Run even if tests fail
  uses: codecov/codecov-action@v3
  with:
    directory: .github/agents/meta-agent/coverage
```

---

## Performance Issues

### Issue: Validation is slow

**Symptoms:**
- Validation takes >2 seconds per file
- Whole repo validation takes >5 minutes

**Root cause:** Large files, inefficient schema validation

**Solution 1: Profile validation**
```bash
cd .github/agents/meta-agent
npm run validate:changed -- --debug

# Check which files take longest
```

**Solution 2: Split large files**
If a single Markdown file is very large:
- Split into multiple smaller files
- Link between files for navigation

**Solution 3: Cache schemas**
Meta Agent caches compiled schemas. To clear cache:
```bash
rm -rf .github/agents/meta-agent/coverage
npm test -- --clearCache
```

---

### Issue: High memory usage

**Symptoms:**
- Validation crashes with "out of memory"
- Machine becomes unresponsive

**Root cause:** Processing huge file list in single pass

**Solution:**
```bash
# Validate in batches
npm run validate -- docs/part1/**/*.md
npm run validate -- docs/part2/**/*.md

# Or increase memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run validate -- "**/*.md"
```

---

## Repository Type Detection Issues

### Issue: "Repo type not detected correctly"

**Symptoms:**
- File validated with wrong schema
- Wrong validation rules applied

**Root cause:** Repo type detection failed

**Solution:**
Meta Agent detects repo type in this order:
1. **Block Plugin:** `block.json` or `{name}.php` with "Block Name"
2. **Block Theme:** `theme.json` + `style.css`
3. **Control-Plane:** `.github/agents/`, `.github/workflows/`, or `AGENTS.md`
4. **Generic:** Default

**Fix:** Create the detection marker file
```bash
# For block plugin
touch block.json

# For block theme
touch theme.json
touch style.css

# For control-plane
mkdir -p .github/agents  # Already exists
```

---

### Issue: File validates as "Generic" but should be "Control-Plane"

**Solution:**
Create `.github/agents/` folder (if it doesn't exist):
```bash
mkdir -p .github/agents
touch .github/agents/.gitkeep
```

This marker tells Meta Agent the repo is a control-plane repository.

---

## Schema Validation Issues

### Issue: "Multiple validation errors in one file"

**Symptoms:**
- Several fields fail validation

**Solution:**
Use JSON output to see all errors at once:
```bash
npm run validate -- file.md --json | jq '.errors'
```

Fix errors one by one, re-run to verify each fix.

---

### Issue: "Field validation is too strict"

**Symptoms:**
- Valid content rejected (false positive)
- Field requires specific format

**Solution:**
1. Review schema requirements: See [README.md](./README.md#schemas)
2. Adjust frontmatter to match required format
3. Or, open an issue to discuss schema adjustment

**Common strict patterns:**
- Dates must be ISO 8601: `YYYY-MM-DD`
- Versions must be semantic: `X.Y.Z` or `vX.Y`
- Titles must be 3–120 characters
- Descriptions must be 10–300 characters

---

## Integration Issues

### Issue: Pre-commit hook conflicts with other tools

**Symptoms:**
- Multiple hooks interfere
- Validation runs twice

**Solution:**
Coordinate hooks in `.husky/` or `.git/hooks/`:
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run ESLint first
npm run lint:js

# Then Meta Agent validation
cd .github/agents/meta-agent
npm run validate:changed

exit 0
```

---

### Issue: Validation conflicts with linter

**Symptoms:**
- Linter reformats frontmatter
- Validation fails after linting

**Solution:**
Configure linter to ignore frontmatter:
```json
{
  "ignorePatterns": ["node_modules", "**/*.json"],
  "overrides": [
    {
      "files": "**/*.md",
      "excludedFiles": ["**/frontmatter.*"],
      "rules": {
        "no-irregular-whitespace": "off"
      }
    }
  ]
}
```

---

## Debugging & Advanced

### Enable Debug Mode

```bash
# Verbose output
npm run validate -- file.md --debug

# JSON output for parsing
npm run validate -- file.md --json

# Color output (easier to read)
npm run validate -- file.md --colors
```

### Check Installed Schema Versions

```bash
ls schemas/ | grep frontmatter.schema.json
```

Each schema is versioned. Mismatch can cause validation failures.

### Manual Schema Testing

```bash
# Test if a file matches a schema
npm test -- __tests__/unit/frontmatter-validation.test.js

# Run specific test
npm test -- --testNamePattern="block-plugin"
```

---

## Getting Help

**If your issue isn't listed above:**

1. **Check the FAQ:** See [FAQ.md](./FAQ.md)
2. **Review source code:** [index.js](./index.js), [skills/](./skills/)
3. **Run tests:** `npm test` — tests show expected behavior
4. **Open an issue:** GitHub issue tracker
5. **Ask the team:** Slack #meta-agent channel

---

## Common Error Messages & Solutions

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "ENOENT: no such file or directory" | File not found | Check file path is correct |
| "YAML parse error" | Invalid YAML syntax | Fix indentation and quotes |
| "Field X is required" | Missing required field | Add the field to frontmatter |
| "Field X is not valid" | Wrong field value | Check allowed values for field |
| "No frontmatter found" | Missing YAML delimiters | Add `---` before and after frontmatter |
| "Hook permission denied" | Hook not executable | `chmod +x .git/hooks/pre-commit` |
| "Workflow timeout" | Validation takes too long | Use `validate:changed` instead |
| "Module not found" | Dependencies not installed | `npm install` in meta-agent folder |

---

## Performance Benchmarks

Expected performance on standard hardware (MacBook Pro, 8GB RAM):

| Task | Time |
|------|------|
| Install dependencies | 5–10s |
| Run tests (116 tests) | 2–3s |
| Validate single file | <100ms |
| Validate 10 files | <500ms |
| Validate 100 files | 2–5s |
| Pre-commit hook (10 changed files) | 1–2s |

If your times are significantly slower, see the [Performance Issues](#performance-issues) section above.

---

## Reporting Issues

When reporting a bug:

1. **Reproduce it:** Exact steps to recreate
2. **System info:** Node version, OS, npm version
3. **Error output:** Full error message with `--debug` flag
4. **Files involved:** Sanitized versions of problematic files
5. **Expected vs actual:** What should happen vs what happens

**Example issue report:**
```
Title: Validation fails with YAML parse error

Steps to reproduce:
1. npm run validate -- docs/README.md

Expected: File validates successfully
Actual: Error "YAML parse error"

System: macOS 13.2, Node v18.12.1, npm 9.2.0

Error output:
<full error message here>
```

---

*Meta Agent v2.0 — Troubleshooting & Support Guide* 🆘


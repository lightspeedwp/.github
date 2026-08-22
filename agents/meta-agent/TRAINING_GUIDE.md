---
title: Meta Agent v2.0 — Team Training Guide
description: >
  30-minute team training guide for Meta Agent v2.0. Complete walkthrough
  for developers, project leads, and maintainers.
file_type: guide
category: training
version: 1.0
status: active
author: Ash Shaw
date: '2026-08-21'
language: en
owners:
  - lightspeedwp/maintainers
---

# Meta Agent v2.0 — Team Training Guide

Complete 30-minute training guide for using Meta Agent v2.0 in your workflow.

## Learning Objectives

After this training, you will be able to:

- ✅ Understand what Meta Agent v2.0 is and why it matters
- ✅ Set up Meta Agent in your repository
- ✅ Write valid frontmatter for your documentation
- ✅ Run validation locally and in CI/CD
- ✅ Troubleshoot common validation errors
- ✅ Use pre-commit hooks in your workflow
- ✅ Understand the 4 repository types and their schemas

**Time required:** 30 minutes  
**Audience:** All developers, project leads, maintainers  
**Prerequisites:** Git, Node.js v16+, basic Markdown knowledge

---

## Section 1: What is Meta Agent v2.0? (5 minutes)

### The Problem We're Solving

**Before Meta Agent v2.0:**
- 🚫 Different repos had different documentation standards
- 🚫 Manual metadata configuration per repository
- 🚫 Hard to maintain consistency at scale
- 🚫 Errors caught late (after PR review)
- 🚫 No validation framework

**After Meta Agent v2.0:**
- ✅ Automatic repo type detection (no config)
- ✅ Consistent metadata standards
- ✅ Early error detection (pre-commit)
- ✅ CI/CD integration (blocks bad commits)
- ✅ Clear error messages with fixes

### What It Does

Meta Agent v2.0:

1. **Detects your repo type** automatically
   - Block plugin? → Apply plugin schema
   - Block theme? → Apply theme schema
   - Control-plane (.github)? → Apply governance schema
   - Generic docs? → Apply documentation schema

2. **Validates frontmatter** against the right schema
   - Checks required fields are present
   - Validates field values (enums, formats, lengths)
   - Shows clear error messages with fixes

3. **Runs automatically** in two ways:
   - **Pre-commit hook:** Validation before you commit
   - **CI/CD workflow:** Validation on every PR

### Key Benefits for You

| Benefit | How It Helps |
|---------|--------------|
| **Saves time** | Catch errors locally before PR review |
| **Consistent** | Same standards across all repos |
| **Clear** | Error messages tell you exactly what's wrong |
| **Flexible** | Works with your existing workflow |
| **No breaking changes** | Existing docs still work, just add frontmatter |

---

## Section 2: The 4 Repository Types (5 minutes)

### How Meta Agent Detects Your Repo Type

Meta Agent checks for these markers in order:

```
1. Block Plugin (highest priority)
   └─ Looks for: block.json file

2. Block Theme
   └─ Looks for: theme.json + style.css files

3. Control-Plane (.github)
   └─ Looks for: .github/agents/ folder or AGENTS.md file

4. Generic Documentation (default fallback)
   └─ Used for all other repos/documentation
```

### Example: Block Plugin Repo

**How to detect:** Has `block.json` file

**Required frontmatter:**
```yaml
---
title: User Input Block
description: Captures user input with validation
status: active
language: en
block_name: lightspeed/user-input
block_supports:
  - align
  - colors
plugin_name: User Input Block
requires_wordpress: 6.0
requires_php: 7.4
---
```

### Example: Block Theme Repo

**How to detect:** Has `theme.json` + `style.css` files

**Required frontmatter:**
```yaml
---
title: Lightspeed Theme
description: Modern WordPress block theme
status: active
language: en
theme_name: Lightspeed
theme_slug: lightspeed-theme
block_pattern_name: lightspeed/hero-section
---
```

### Example: Control-Plane Repo (.github)

**How to detect:** Has `.github/agents/` folder

**Required frontmatter:**
```yaml
---
title: Contributing Guide
description: How to contribute to our projects
file_type: guide
category: community
status: active
language: en
owners:
  - lightspeedwp/maintainers
---
```

### Example: Generic Documentation

**How to detect:** Any other Markdown file

**Required frontmatter:**
```yaml
---
title: Setup Instructions
description: How to set up the project locally
status: active
language: en
category: tutorial
difficulty: beginner
---
```

---

## Section 3: Setting Up Meta Agent (8 minutes)

### Step-by-Step Setup

#### Step 1: Copy the Agent (1 minute)

```bash
# Clone or download meta-agent folder
cp -r meta-agent .github/agents/

# Move to the folder
cd .github/agents/meta-agent
```

#### Step 2: Install Dependencies (1 minute)

```bash
npm install
```

Expected output:
```
added 45 packages in 3s
```

#### Step 3: Run Tests (1 minute)

```bash
npm test
```

Expected output:
```
Test Suites: 4 passed, 4 total
Tests:       116 passed, 116 total
```

#### Step 4: Enable Pre-Commit Hook (2 minutes)

```bash
# Copy hook to .git folder
cp scripts/hooks/meta-agent-validate.sh .git/hooks/pre-commit

# Make it executable
chmod +x .git/hooks/pre-commit

# Test it
.git/hooks/pre-commit
```

#### Step 5: Add to GitHub Actions (2 minutes)

Create `.github/workflows/meta-agent-validation.yml`:

```yaml
name: Meta Agent Validation
on:
  pull_request:
    paths:
      - '**.md'
      - '.github/agents/meta-agent/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd .github/agents/meta-agent && npm ci
      - run: cd .github/agents/meta-agent && npm run validate:changed
```

**Done!** Meta Agent is now installed and ready to use.

---

## Section 4: Writing Valid Frontmatter (7 minutes)

### Understanding Frontmatter

Frontmatter is YAML metadata at the top of a file:

```markdown
---
title: My Document
description: What this is about
status: active
language: en
---

# Content starts here
```

### Required Fields (All Repos)

| Field | Purpose | Example |
|-------|---------|---------|
| `title` | Document title | "User Input Block" |
| `description` | What it's about | "Captures user input..." |
| `status` | Publication status | active, draft, archived |
| `language` | Content language | en (UK English only) |

### Valid Status Values

- `draft` — Work in progress
- `review` — Under review
- `active` — Published and current ✅ (most common)
- `archived` — Old, no longer maintained

### Multi-Line Descriptions

Use `>` for automatic line joining:

```yaml
description: >
  This is a long description that spans
  multiple lines but gets joined into
  one single line in the output.
```

Or `|` to preserve line breaks:

```yaml
description: |
  Paragraph 1

  Paragraph 2
```

### Common Mistakes & How to Fix Them

**❌ WRONG: Tabs instead of spaces**
```yaml
---
title: Test
  description: This uses a tab (INVALID)
---
```

**✅ CORRECT: Use spaces for indentation**
```yaml
---
title: Test
description: This uses spaces (VALID)
---
```

---

**❌ WRONG: Missing frontmatter delimiters**
```markdown
title: My Doc
description: A test
# Missing --- delimiters!
```

**✅ CORRECT: Frontmatter in between ---**
```markdown
---
title: My Doc
description: A test
---
```

---

**❌ WRONG: Unquoted multi-line values**
```yaml
description: This is a very long description
that spans multiple lines without quotes
```

**✅ CORRECT: Use > or | for multi-line**
```yaml
description: >
  This is a very long description
  that spans multiple lines properly
```

---

## Section 5: Running Validation (3 minutes)

### Validate a Single File

```bash
cd .github/agents/meta-agent

# Validate one file
npm run validate -- README.md
```

**Output:**
```
✅ README.md
  ├─ Repo type: documentation
  ├─ Schema: documentation.frontmatter.schema.json
  └─ Status: VALID (all 4 required fields)
```

### Validate Changed Files

```bash
# Validate only files you changed (fast!)
npm run validate:changed
```

### See Errors in Detail

```bash
# Get JSON output
npm run validate -- file.md --json

# Or see colors
npm run validate -- file.md --colors
```

---

## Section 6: Your Workflow Integration (2 minutes)

### Workflow Step 1: Write Your Documentation

```markdown
---
title: My New Feature
description: What it does
status: active
language: en
---

# My New Feature

Documentation content here...
```

### Workflow Step 2: Commit Your Changes

```bash
git add file.md
git commit -m "docs: Add feature documentation"
```

**Pre-commit hook runs automatically:**
- ✅ If valid → Commit succeeds
- ❌ If invalid → Commit blocked, shows errors

### Workflow Step 3: Push to GitHub

```bash
git push origin my-branch
```

### Workflow Step 4: Create PR

GitHub Actions runs validation on your PR:
- ✅ Check passes → Can merge
- ❌ Check fails → Fix errors, re-push

---

## Section 7: Troubleshooting (Bonus section)

### Issue: "Field 'X' is required"

**Solution:** Add the missing field

```yaml
# WRONG
---
title: My Doc
status: active
---

# CORRECT
---
title: My Doc
description: What this is about  # ADD THIS
status: active
language: en  # ADD THIS
---
```

### Issue: Hook doesn't run

**Solution:**
```bash
chmod +x .git/hooks/pre-commit
.git/hooks/pre-commit  # Test it
```

### Issue: Need to skip validation temporarily

```bash
git commit --no-verify -m "Skip validation for this commit"
```

### Issue: "Front matter is not valid YAML"

**Solution:** Check YAML syntax at https://www.yamllint.com

---

## Quick Reference

### Commands You'll Use Most

```bash
# Validate a file
npm run validate -- file.md

# Validate changed files (fast!)
npm run validate:changed

# Run tests
npm test

# Skip hook temporarily
git commit --no-verify -m "message"
```

### Required Fields by Repo Type

| Type | Required Fields |
|------|-----------------|
| All | title, description, status, language |
| Block Plugin | + block_name, block_supports |
| Block Theme | + theme_name, theme_slug |
| Control-Plane | + file_type, category, owners |

### Status Values

- `draft` — Work in progress
- `review` — Under review
- `active` — Published (most common) ✅
- `archived` — Old/deprecated

---

## Getting Help

**Questions?**
- 📖 See [FAQ.md](./FAQ.md)
- 🔧 See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- 📚 See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)

**Issues?**
- Report bugs: GitHub issues
- Ask questions: Team Slack

---

## Summary

✅ You now know:
- What Meta Agent v2.0 does and why it matters
- How to set it up in your repo
- How to write valid frontmatter
- How to run validation locally and in CI
- How to troubleshoot errors
- How to integrate it into your workflow

**Next step:** Set up Meta Agent in your repo and try it with your documentation!

---

*Meta Agent v2.0 — Making documentation metadata simple for everyone* 🚀


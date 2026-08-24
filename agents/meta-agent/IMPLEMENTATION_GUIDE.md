---
title: Meta Agent v2.0 — Implementation Guide
description: >
  Step-by-step setup and usage guide for Meta Agent v2.0. Covers installation,
  hook configuration, GitHub Actions integration, and real-world examples.
file_type: guide
category: documentation
status: active
language: en
owners:
  - lightspeedwp/maintainers
---

# Meta Agent v2.0 — Implementation Guide

This guide walks you through installing, configuring, and using Meta Agent v2.0 in your repository.

## Table of Contents

1. [Quick Start (5 minutes)](#quick-start)
2. [Prerequisites & Requirements](#prerequisites)
3. [Installation & Setup (15 minutes)](#installation)
4. [Hook Configuration](#hook-configuration)
5. [GitHub Actions Integration](#github-actions)
6. [Running the Agent](#running-the-agent)
7. [Repository-Type Examples](#examples)
8. [Troubleshooting & Support](#troubleshooting)

---

## Quick Start

### 1. Copy the Agent

```bash
# Copy meta-agent to your repo's .github/agents/ folder
cp -r meta-agent .github/agents/
cd .github/agents/meta-agent
npm install
```

### 2. Run Validation

```bash
# Validate a single file
npm run validate -- path/to/file.md

# Validate all changed files
npm run validate:changed
```

### 3. See Results

```bash
✅ File validation complete
✅ 5 files validated
✅ 0 errors, 0 warnings
```

**Expected output:** Green checkmarks, file count, and error summary.

---

## Prerequisites & Requirements

### System Requirements

- **Node.js:** ≥16.0.0 (v18+ recommended)
- **npm:** ≥8.0.0
- **Git:** ≥2.30.0

### Verify Your Setup

```bash
node --version      # Should be v16.0.0 or higher
npm --version       # Should be v8.0.0 or higher
git --version       # Should be v2.30.0 or higher
```

### Repository Types Supported

Meta Agent v2.0 works with:

- ✅ **Block Plugin Repos** — WordPress block plugins (e.g., `block.json`)
- ✅ **Block Theme Repos** — WordPress block themes (e.g., `theme.json`)
- ✅ **Control-Plane Repos** — `.github` governance repositories
- ✅ **Generic Documentation** — Any Markdown documentation

---

## Installation & Setup

### Step 1: Copy Agent to Your Repository

```bash
# From your repo root
mkdir -p .github/agents
cp -r /path/to/meta-agent .github/agents/

# Verify files
ls -la .github/agents/meta-agent/
```

**Expected:** You should see `package.json`, `index.js`, `skills/`, `__tests__/`, etc.

### Step 2: Install Dependencies

```bash
cd .github/agents/meta-agent
npm install
```

This installs:

- `gray-matter` — Frontmatter parsing
- `ajv` — JSON Schema validation
- `jest` — Testing framework
- Development dependencies for linting and testing

### Step 3: Run Initial Tests

```bash
npm test
```

**Expected output:**

```
PASS  __tests__/unit/repo-type-detection.test.js
PASS  __tests__/unit/frontmatter-validation.test.js
PASS  __tests__/unit/apply-standards.test.js
...
Test Suites: 4 passed, 4 total
Tests:       116 passed, 116 total
```

### Step 4: Verify Installation

```bash
npm run validate -- README.md
```

Should complete without errors and show validation results.

---

## Hook Configuration

### Pre-Commit Hook Setup

Pre-commit hooks automatically validate files before you commit them, preventing invalid frontmatter from entering your repository.

#### Option A: Automatic Setup (Recommended)

```bash
# From repo root
chmod +x scripts/hooks/meta-agent-validate.sh
cp scripts/hooks/meta-agent-validate.sh .git/hooks/pre-commit
```

#### Option B: Manual Setup

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
set -e

# Meta Agent pre-commit validation
cd .github/agents/meta-agent
npm run validate:changed -- --colors

exit 0
```

Make it executable:

```bash
chmod +x .git/hooks/pre-commit
```

#### Testing the Hook

```bash
# Create a test file
echo '---
title: Test File
description: This is a test
status: draft
language: en
---

# Test' > test-file.md

# Try to commit it
git add test-file.md
git commit -m "test: Add test file"

# Expected: Hook runs, validates file, then commits if valid
```

#### Disable Hook (if needed)

```bash
# Commit without running hooks
git commit --no-verify -m "Skip validation for this commit"
```

---

## GitHub Actions Integration

### Add Validation Workflow

Create `.github/workflows/meta-agent-validation.yml`:

```yaml
name: Meta Agent Validation

on:
  pull_request:
    paths:
      - '**.md'
      - '.github/agents/meta-agent/**'
      - '.github/workflows/meta-agent-validation.yml'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install meta-agent
        run: |
          cd .github/agents/meta-agent
          npm ci

      - name: Run validation
        run: |
          cd .github/agents/meta-agent
          npm run validate:changed

      - name: Generate coverage
        if: always()
        run: |
          cd .github/agents/meta-agent
          npm test -- --coverage

      - name: Upload coverage
        if: always()
        uses: codecov/codecov-action@v3
        with:
          directory: .github/agents/meta-agent/coverage
```

### Configure Branch Protection

In repository settings:

1. Go to **Settings** → **Branches** → **Branch protection rules**
2. Add rule for `develop` or `main`
3. ✅ Check "Require status checks to pass before merging"
4. ✅ Select "Meta Agent Validation" workflow
5. Save

This ensures all PRs have valid frontmatter before merge.

---

## Running the Agent

### Command-Line Usage

#### Validate a Single File

```bash
cd .github/agents/meta-agent
npm run validate -- path/to/file.md
```

**Options:**

- `--colors` — Colorized output
- `--json` — JSON format output
- `--summary` — Summary only (no details)

**Example output:**

```
✅ README.md
  ├─ Repo type: control-plane
  ├─ Schema: control-plane.frontmatter.schema.json
  └─ Status: VALID (all required fields present)

✅ docs/IMPLEMENTATION.md
  ├─ Repo type: documentation
  ├─ Schema: documentation.frontmatter.schema.json
  └─ Status: VALID (4/4 required fields)
```

#### Validate Changed Files

```bash
npm run validate:changed
```

Validates only files changed in the current branch (useful for PRs).

#### Batch Validation

```bash
npm run validate -- "docs/**/*.md"
```

Validates all Markdown files in the `docs/` folder.

#### JSON Output

```bash
npm run validate -- file.md --json
```

Returns structured JSON:

```json
{
  "file": "file.md",
  "valid": true,
  "repoType": "documentation",
  "schema": "documentation.frontmatter.schema.json",
  "fields": {
    "title": "My Document",
    "description": "A test document",
    "status": "active",
    "language": "en"
  }
}
```

### Programmatic Usage (JavaScript)

```javascript
const MetaAgent = require('./index.js');

const agent = new MetaAgent();

// Validate a file
const result = agent.validateFile('README.md');

if (result.valid) {
  console.log('✅ File is valid');
  console.log('Detected type:', result.repoType);
} else {
  console.log('❌ Validation failed:');
  result.errors.forEach(err => {
    console.log(`  - ${err.field}: ${err.message}`);
  });
}
```

---

## Repository-Type Examples

### Example 1: Block Plugin Repository

**File:** `block-plugin-repo/README.md`

```markdown
---
title: User Input Block
description: >
  Captures user input in WordPress blocks with validation
  and storage options.
status: active
language: en
block_name: lightspeed/user-input
block_supports:
  - align
  - colors
  - spacing
plugin_name: User Input Block
plugin_version: 1.0.0
requires_wordpress: 6.0
requires_php: 7.4
---

# User Input Block

A WordPress block for capturing user input...
```

**Setup:**

```bash
cd block-plugin-repo/.github/agents
cp -r meta-agent ./
cd meta-agent
npm install
npm run validate -- ../../README.md
```

**Expected output:**

```
✅ README.md
  ├─ Repo type: block-plugin
  ├─ Block: lightspeed/user-input
  └─ Status: VALID
```

### Example 2: Block Theme Repository

**File:** `block-theme-repo/README.md`

```markdown
---
title: Lightspeed Block Theme
description: >
  A modern WordPress block theme with pre-built patterns
  and design tokens.
status: active
language: en
theme_name: Lightspeed
theme_slug: lightspeed-theme
block_pattern_name: lightspeed/hero-section
supported_features:
  - wp-block-styles
  - wp-appearance-tools
  - responsive-block-width
---

# Lightspeed Block Theme

A block theme for WordPress...
```

**Setup:**

```bash
cd block-theme-repo/.github/agents
cp -r meta-agent ./
cd meta-agent
npm install
npm run validate -- ../../README.md
```

### Example 3: Control-Plane Repository (.github)

**File:** `.github/CONTRIBUTING.md`

```markdown
---
title: Contributing to LightSpeed
description: >
  Guidelines for contributing to LightSpeed projects,
  including code standards and PR process.
file_type: guide
category: community
status: active
language: en
owners:
  - lightspeedwp/maintainers
maintainer: Ash Shaw
permissions_required:
  - push-to-protected-branch
audience: Contributors
related_issues:
  - 1234
  - 1235
---

# Contributing to LightSpeed

Thank you for contributing...
```

**Setup:**

```bash
cd .github/agents
cp -r meta-agent ./
cd meta-agent
npm install
npm run validate -- ../CONTRIBUTING.md
```

### Example 4: Generic Documentation

**File:** `docs/SETUP_GUIDE.md`

```markdown
---
title: Project Setup Guide
description: >
  Step-by-step guide to set up the project locally
  for development.
status: active
language: en
category: tutorial
difficulty: beginner
estimated_read_time: 10 minutes
prerequisites:
  - Node.js v18+
  - Git
audience: Developers
---

# Project Setup Guide

This guide walks you through...
```

**Setup:**

```bash
cd docs/../.github/agents
cp -r meta-agent ./
cd meta-agent
npm install
npm run validate -- ../../docs/SETUP_GUIDE.md
```

---

## Troubleshooting & Support

### Common Issues

#### Issue: "Module not found: ajv"

**Solution:**

```bash
cd .github/agents/meta-agent
npm install
```

#### Issue: Hook not running on commit

**Solution:**

```bash
# Check hook exists
ls -la .git/hooks/pre-commit

# Verify it's executable
chmod +x .git/hooks/pre-commit

# Test it manually
.git/hooks/pre-commit
```

#### Issue: "File validation failed" but frontmatter looks correct

**Solution:**

1. Check YAML syntax: Each line must be valid YAML
2. Verify required fields are present (varies by repo type)
3. Check field values match expected enums
4. Run with `--json` flag for detailed error info

```bash
npm run validate -- file.md --json
```

### Performance Optimization

For large repositories with many Markdown files:

```bash
# Validate only changed files
npm run validate:changed

# Pre-commit: validate only staged files
npm run validate:staged

# CI: run in parallel
npm test -- --maxWorkers=4
```

### Getting Help

- **Documentation:** See [README.md](./README.md) for architecture
- **Issues:** Check GitHub issues for known problems
- **Support:** Ask in team Slack channel or create an issue

---

## Next Steps

1. ✅ **Installation complete?** Run `npm test` to verify
2. ✅ **Hook configured?** Test with `git commit --no-verify`
3. ✅ **Workflow added?** Create a test PR to verify CI integration
4. ✅ **Files validated?** Check `npm run validate -- README.md`

After setup, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

---

*Meta Agent v2.0 — Making frontmatter validation simple & reliable* 🚀

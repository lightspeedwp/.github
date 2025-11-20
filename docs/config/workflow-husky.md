# Husky Configuration

## 🐕 Git Hooks for Quality Automation

## Table of Contents

- [Overview](#overview)
- [Installation & Configuration](#installation--configuration)
- [Git Hooks Setup](#git-hooks-setup)
- [WordPress Integration](#wordpress-integration)
- [Usage](#usage)
- [Integration](#integration)

## Overview

**Husky** enables Git hooks to automatically run linting, testing, and formatting before commits and pushes. This prevents broken code from entering the repository and maintains code quality standards across LightSpeed WordPress projects.

> **💡 Key Benefits:** Automated quality checks, prevent broken commits, consistent team standards, reduced CI failures

## Installation & Configuration

### **Quick Setup**

```bash
# Install Husky
npm install --save-dev husky

# Initialize Husky
npx husky install

# Make install automatic
npm pkg set scripts.prepare="husky install"
```

### **Project Structure**

```text
.husky/
├── _/
│   ├── .gitignore
│   └── husky.sh
├── pre-commit
├── pre-push
└── commit-msg
```

## Git Hooks Setup

### **Pre-commit Hook**

```bash
# Create pre-commit hook
npx husky add .husky/pre-commit "npm run precommit"
```

```bash
#!/usr/bin/env sh
# .husky/pre-commit
. "$(dirname -- "$0")/_/husky.sh"

npm run precommit
```

### **Pre-push Hook**

```bash
# Create pre-push hook
npx husky add .husky/pre-push "npm run test"
```

```bash
#!/usr/bin/env sh
# .husky/pre-push
. "$(dirname -- "$0")/_/husky.sh"

npm run test
npm run lint
```

### **Commit Message Hook**

```bash
# Create commit-msg hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
```

## WordPress Integration

### **Package.json Scripts**

```json
{
  "scripts": {
    "prepare": "husky install",
    "precommit": "lint-staged",
    "lint": "run-p lint:*",
    "lint:js": "wp-scripts lint-js",
    "lint:css": "wp-scripts lint-style",
    "lint:php": "composer run lint",
    "test": "run-s test:js test:php",
    "test:js": "wp-scripts test-unit-js",
    "test:php": "composer run test"
  },
  "devDependencies": {
    "husky": "^8.0.3",
    "lint-staged": "^15.0.0",
    "npm-run-all": "^4.1.5"
  }
}
```

### **Lint-staged Integration**

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["wp-scripts lint-js --fix", "wp-scripts format"],
    "*.{css,scss}": ["wp-scripts lint-style --fix"],
    "*.php": ["composer run lint:fix"],
    "*.md": ["markdownlint --fix"]
  }
}
```

## Usage

### **Hook Commands**

```bash
# Install hooks (run once per clone)
npx husky install

# Add new hook
npx husky add .husky/pre-commit "npm run lint"

# Remove hook
rm .husky/pre-commit

# Test hook manually
.husky/pre-commit
```

### **Bypass Hooks (Emergency)**

```bash
# Skip pre-commit hooks
git commit -m "emergency fix" --no-verify

# Skip pre-push hooks
git push --no-verify
```

### **Hook Configuration Examples**

```bash
# .husky/pre-commit - Comprehensive checks
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged for changed files
npm run precommit

# Check for merge conflicts
if git diff --check; then
  echo "✅ No merge conflict markers found"
else
  echo "❌ Merge conflict markers detected"
  exit 1
fi
```

```bash
# .husky/pre-push - Full validation
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run all tests
npm run test

# Run full lint suite
npm run lint

# Check build
npm run build
```

## Integration

**Related Configuration:**

- [LINTING.md](../LINTING.md) — Main linting strategy
- [HUSKY-PRECOMMITS.md](../HUSKY-PRECOMMITS.md) — Pre-commit automation
- [lint-eslint.md](./lint-eslint.md) — ESLint config
- [lint-stylelint.md](./lint-stylelint.md) — Stylelint config
- [lint-prettier.md](./lint-prettier.md) — Prettier config
- [npm-scripts.md](./npm-scripts.md) — NPM automation
- [workflow-lint-staged.md](./workflow-lint-staged.md) — Lint-staged setup
- [frontmatter.schema.json](../../schemas/frontmatter.schema.json) — Frontmatter schema

> See [docs/CHECKLIST_CROSSLINKING.md](../CHECKLIST_CROSSLINKING.md) for cross-linking best practices.

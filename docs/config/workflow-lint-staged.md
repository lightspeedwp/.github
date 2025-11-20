# Lint-staged Configuration

## ⚡ Pre-commit File Processing & Quality Gates

## Table of Contents

- [Overview](#overview)
- [Installation & Configuration](#installation--configuration)
- [File Type Processing](#file-type-processing)
- [WordPress Integration](#wordpress-integration)
- [Usage](#usage)
- [Integration](#integration)

## Overview

**Lint-staged** runs linters and formatters only on staged files (files being committed), making pre-commit hooks fast and efficient. This prevents slow full-project scans while maintaining code quality.

> **💡 Key Benefits:** Fast pre-commit checks, targeted file processing, automatic fixes, prevented bad commits

## Installation & Configuration

### **Quick Setup**

```bash
# Install lint-staged
npm install --save-dev lint-staged

# Add to package.json
npm pkg set scripts.precommit="lint-staged"
```

### **Configuration Example**

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["wp-scripts lint-js --fix", "wp-scripts format"],
    "*.{css,scss}": ["wp-scripts lint-style --fix"],
    "*.php": ["composer run lint:fix"],
    "*.md": ["markdownlint --fix"],
    "*.json": ["prettier --write"]
  }
}
```

## File Type Processing

### **JavaScript & TypeScript**

```json
{
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write",
    "jest --findRelatedTests --passWithNoTests"
  ]
}
```

### **CSS & SCSS**

```json
{
  "*.{css,scss}": ["stylelint --fix", "prettier --write"]
}
```

### **PHP Files**

```json
{
  "*.php": ["composer run lint:fix", "composer run test:syntax"]
}
```

### **Markdown & Documentation**

```json
{
  "*.md": ["markdownlint --fix", "prettier --write"],
  "*.{yaml,yml}": ["prettier --write"]
}
```

## WordPress Integration

### **WordPress Scripts Integration**

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["wp-scripts lint-js --fix", "wp-scripts format"],
    "*.{css,scss}": ["wp-scripts lint-style --fix"],
    "*.php": [
      "./vendor/bin/phpcbf --standard=WordPress",
      "./vendor/bin/phpcs --standard=WordPress"
    ]
  },
  "scripts": {
    "precommit": "lint-staged",
    "prepare": "husky install"
  }
}
```

### **Advanced Configuration**

```javascript
// lint-staged.config.js - For complex setups
module.exports = {
  "*.{js,jsx,ts,tsx}": (filenames) => [
    `eslint --fix ${filenames.join(" ")}`,
    `prettier --write ${filenames.join(" ")}`,
    `jest --findRelatedTests ${filenames.join(" ")} --passWithNoTests`,
  ],
  "*.php": (filenames) => [
    `./vendor/bin/phpcbf --standard=WordPress ${filenames.join(" ")}`,
    `./vendor/bin/phpcs --standard=WordPress ${filenames.join(" ")}`,
  ],
  "*.{css,scss}": ["stylelint --fix", "prettier --write"],
  "*.md": ["markdownlint --fix", "prettier --write"],
};
```

## Usage

### **Command Line**

```bash
# Run lint-staged manually
npx lint-staged

# Debug mode
npx lint-staged --debug

# Allow empty commits
npx lint-staged --allow-empty

# Dry run (show what would happen)
npx lint-staged --dry-run
```

### **Git Integration**

```bash
# Normal commit (runs lint-staged via Husky)
git commit -m "feat: add new component"

# Skip hooks (emergency only)
git commit -m "hotfix: critical bug" --no-verify

# Check staged files
git diff --cached --name-only
```

### **Troubleshooting**

```bash
# If lint-staged fails, fix issues and re-add files
npm run lint:fix
git add .
git commit

# View detailed error output
npx lint-staged --debug

# Reset if needed
git reset HEAD~1
```

## Integration

**Related Configuration:**

- [LINTING.md](../LINTING.md) — Main linting strategy
- [HUSKY-PRECOMMITS.md](../HUSKY-PRECOMMITS.md) — Pre-commit automation
- [lint-eslint.md](./lint-eslint.md) — ESLint config
- [lint-stylelint.md](./lint-stylelint.md) — Stylelint config
- [lint-prettier.md](./lint-prettier.md) — Prettier config
- [npm-scripts.md](./npm-scripts.md) — NPM automation
- [workflow-husky.md](./workflow-husky.md) — Husky setup
- [frontmatter.schema.json](../../schemas/frontmatter.schema.json) — Frontmatter schema

> See [docs/CHECKLIST_CROSSLINKING.md](../CHECKLIST_CROSSLINKING.md) for cross-linking best practices.

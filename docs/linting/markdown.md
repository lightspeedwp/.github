---
title: 'Markdown Linting Guide'
description: 'Guide for using markdownlint-cli2 with GitHub rules at LightSpeedWP'
version: '1.0.0'
last_updated: '2025-11-18'
tags: ['linting', 'markdown', 'markdownlint', 'github', 'documentation']
---

# Markdown Linting

This repository uses **markdownlint-cli2** with **@github/markdownlint-github** opinionated rules to enforce
consistent Markdown formatting across all documentation.

## Why Markdown Linting?

Markdown linting ensures:

- Consistent formatting across all documentation
- Better readability and maintainability
- Fewer merge conflicts
- Improved accessibility
- Professional documentation quality

## Tools and Configuration

### Core Tools

- **markdownlint-cli2**: Command-line interface for markdownlint
- **@github/markdownlint-github**: GitHub's opinionated ruleset
- **markdownlint-cli2-formatter-pretty**: Pretty console output formatter

### Configuration Files

The configuration follows a clear precedence order:

1. `.markdownlint-cli2.mjs` - Primary configuration (JavaScript ESM)
2. `.markdownlint.jsonc` - Optional overrides (JSON with comments)
3. `.vscode/settings.json` - VS Code editor settings for local parity

## Commands

Run these commands from the repository root:

### Lint Markdown Files

```bash
npm run lint:md
```

This checks all Markdown files without modifying them.

### Auto-fix Markdown Issues

```bash
npm run lint:md:fix
```

This automatically fixes most formatting issues.

### Lint All Files

```bash
npm run lint:all
```

This runs all linters including JavaScript, YAML, package.json, and Markdown.

## Rule Configuration

### Key Rules

The configuration enforces these important rules:

#### MD013: Line Length

- Maximum line length: **120 characters**
- Code blocks: Unlimited
- Tables: Unlimited
- Headers: Unlimited

#### MD003: Heading Style

- Style: **ATX** (using `#` symbols)
- Example: `# Heading 1`, `## Heading 2`

#### MD024: Duplicate Headings

- Allows duplicate heading text in different sections
- Only siblings (same level, same parent) must be unique

#### MD033: Inline HTML

- Allows specific HTML elements for enhanced formatting
- Permitted elements: `br`, `sub`, `sup`, `kbd`, `mark`, `details`, `summary`, `img`, `a`, `div`, `span`, `table`,
  and table-related tags

#### MD041: First Line Heading

- **Disabled** to allow YAML frontmatter before headings
- Common in documentation with metadata

## CI/CD Integration

### GitHub Actions

The repository includes a dedicated workflow: `.github/workflows/markdownlint.yml`

**Triggers:**

- Pull requests to `main`, `master`, or `develop`
- Pushes to `main`, `master`, or `develop`

**Behaviour:**

- Runs markdownlint-cli2 on all `.md` and `.mdx` files
- Fails if any violations are found
- Provides detailed error messages in PR checks

### Pre-commit Hooks

**Husky** and **lint-staged** are configured to run markdown linting before each commit.

**What happens:**

1. You run `git commit`
2. Husky triggers the pre-commit hook
3. lint-staged runs markdownlint-cli2 on staged `.md` and `.mdx` files
4. If violations are found, the commit is blocked
5. Fix the issues and try committing again

**To bypass** (not recommended):

```bash
git commit --no-verify
```

## VS Code Integration

### Recommended Extension

Install the [markdownlint extension](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
for VS Code.

### Settings

The `.vscode/settings.json` file includes:

- markdownlint configuration matching CLI rules
- Editor ruler at 120 characters
- Auto-formatting on save for Markdown files
- Proper formatter assignment

This ensures the VS Code editor shows the same violations as the CLI.

## Common Issues and Fixes

### Line Too Long

**Issue:** MD013 - Line length exceeds 120 characters

**Fix:**

- Break long paragraphs into multiple lines
- URLs and code blocks are exempt
- Use line breaks to improve readability

### Trailing Spaces

**Issue:** MD009 - Trailing spaces at end of line

**Fix:**

- Run `npm run lint:md:fix` to auto-remove
- Or manually remove trailing spaces

### Multiple Blank Lines

**Issue:** MD012 - Multiple consecutive blank lines

**Fix:**

- Remove extra blank lines (keep only one)
- Run `npm run lint:md:fix` to auto-fix

### Inconsistent Heading Style

**Issue:** MD003 - Headings should use ATX style

**Fix:**

- Replace Setext headings with ATX
- Example: Replace `Heading\n=======` with `# Heading`

## Ignoring Files

To ignore specific files or directories, update `.markdownlint-cli2.mjs`:

```javascript
ignores: [
    'node_modules',
    'coverage',
    'dist',
    'build',
    '.git',
    '*.draft.md',
    // Add your patterns here
],
```

## Troubleshooting

### Linting Fails in CI but Passes Locally

1. Ensure you have the latest dependencies: `npm install`
2. Clear any caches: `npm run lint:md:fix`
3. Check for differences in Node version (use `.nvmrc`)
4. Verify configuration files are committed

### Pre-commit Hook Not Running

1. Ensure Husky is installed: `npm run prepare`
2. Check `.husky/pre-commit` exists and is executable
3. Verify `lint-staged` is configured in `package.json`

### VS Code Not Showing Errors

1. Install the markdownlint extension
2. Reload VS Code
3. Check `.vscode/settings.json` exists
4. Verify extension settings in VS Code preferences

## Further Reading

- [markdownlint Rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- [markdownlint-cli2 Documentation](https://github.com/DavidAnson/markdownlint-cli2)
- [GitHub Markdownlint Rules](https://github.com/github/markdownlint-github)
- [LightSpeedWP Coding Standards](../.github/instructions/coding-standards.instructions.md)

## Support

For questions or issues:

1. Check this documentation first
2. Review existing [GitHub Issues](https://github.com/lightspeedwp/.github/issues)
3. Create a new issue with the `documentation` or `linting` label
4. Contact the LightSpeedWP team

---

**Last updated:** 2025-11-18
**Version:** 1.0.0

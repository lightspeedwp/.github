---
file_type: "instructions"
applyTo: ["**/*.md"]
description: "Lint Markdown files for style and readability using markdownlint, Prettier, and automation scripts."
last_updated: "2025-10-23"
version: "v2.0"
owners: ["LightSpeedWP Team"]
tags: ["markdown", "lint", "docs", "markdownlint", "prettier"]
---

# Role

You are the Markdown documentation linter for LightSpeed projects. Enforce clarity, formatting, and style consistency using markdownlint and Prettier.

# Configuration

- Linter: [markdownlint-cli](https://github.com/DavidAnson/markdownlint)
- Config: [`.markdownlint.json`](../../.markdownlint.json), [`.markdownlintignore`](../../.markdownlintignore)
- Formatter: [Prettier](https://prettier.io/) ([`prettier.config.js`](../../prettier.config.js))
- Editor: [`.editorconfig`](../../.editorconfig)
- NPM script: `"lint:md": "markdownlint '**/*.md' --fix"`
- CI: Linting is enforced via [`.github/workflows/lint.yml`](../../.github/workflows/lint.yml)
- VS Code: Tasks available for Markdown linting
- **Recommended:** Husky pre-commit hook for Markdown linting

# Setup

1. **Install dependencies:**

   ```bash
   npm install --save-dev markdownlint-cli prettier husky
   ```

2. **Config files:**
   Ensure `.markdownlint.json`, `.markdownlintignore`, and `prettier.config.js` exist.
3. **NPM script:**

   ```json
   "lint:md": "markdownlint '**/*.md' --fix"
   ```

4. **VS Code:**
   Use Task Runner (`npm: lint-md`).
5. **Pre-commit hook (optional, recommended):**

   ```bash
   npx husky add .husky/pre-commit "npm run lint:md"
   ```

6. **CI:**
   Markdown linting runs on every PR.

# Rules & Practices

- Enforces [WordPress Markdown documentation standards](https://developer.wordpress.org/coding-standards/markdown/).
- ATX headings (`#`, `##`, etc.), no skipped heading levels.
- Blank lines between sections and lists.
- Fenced code blocks with language specified.
- Lines ≤ 120 characters.
- Excludes files/folders listed in `.markdownlintignore`.

# Running & Fixing

- Manually: `npm run lint:md` (autofixes where possible)
- VS Code: Use Task Runner for Markdown linting.
- CI: Linting is enforced on PRs.
- Prettier: For formatting, run `npx prettier --write '**/*.md'`.

# References

- [markdownlint docs](https://github.com/DavidAnson/markdownlint)
- [Prettier docs](https://prettier.io/)

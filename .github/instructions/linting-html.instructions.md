---
file_type: "instructions"
applyTo: ["**/*.html", "**/*.htm"]
description: "Validate and lint HTML/HTM files for accessibility and semantic correctness using html-validate, Prettier, and automation scripts."
last_updated: "2025-12-04"
version: "v2.0"
owners: ["LightSpeedWP Team"]
tags: ["html", "lint", "accessibility", "automation"]
---

# Role

You are the HTML validator and accessibility checker for LightSpeed projects. Use html-validate and Prettier to ensure semantic, accessible HTML markup.

# Configuration

- Linter: [html-validate](https://html-validate.org/) (config: [`.htmlvalidate.json`](../../.htmlvalidate.json))
- Formatter: [Prettier](https://prettier.io/) ([`prettier.config.js`](../../prettier.config.js))
- Editor: [`.editorconfig`](../../.editorconfig)
- NPM script: `"lint:html": "html-validate '**/*.html'"`
- CI: Linting is enforced via [`.github/workflows/lint.yml`](../../.github/workflows/lint.yml)
- VS Code: Tasks can be defined for HTML linting
- **Recommended:** Add Husky pre-commit hook for linting on commit

# Setup

1. **Install dependencies:**

   ```bash
   npm install --save-dev html-validate prettier husky
   ```

2. **Config files:**  
   Ensure `.htmlvalidate.json` and `prettier.config.js` exist.
3. **NPM script:**  
   In `package.json`:

   ```json
   "lint:html": "html-validate '**/*.html'"
   ```

4. **VS Code:**  
   Add/enable a task for HTML linting (see `tasks.json`)
5. **Pre-commit hook (optional, recommended):**

   ```bash
   npx husky add .husky/pre-commit "npm run lint:html"
   ```

6. **CI:**  
   HTML linting is run automatically on PRs.

# Rules & Practices

- Follows [WordPress HTML Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/html/)
- Checks for semantic markup and accessibility.
- Autoformats with Prettier where possible.

# Running & Fixing

- Manually: `npm run lint:html`
- VS Code: Use Task Runner if configured.
- CI: Linting is enforced on PRs.
- Prettier: Format with `npx prettier --write '**/*.html'`.

# References

- [html-validate docs](https://html-validate.org/)
- [Prettier docs](https://prettier.io/)
- [WordPress HTML Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/html/)

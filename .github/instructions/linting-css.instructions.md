---
file_type: "instructions"
applyTo: ["**/*.css", "**/*.scss", "**/*.sass"]
description: "Lint and format CSS, SCSS, and Sass files using stylelint (with project config), Prettier, and automation scripts."
last_updated: "2025-12-04"
version: "v2.0"
owners: ["LightSpeedWP Team"]
tags: ["css", "stylelint", "prettier", "lint", "automation"]
---

# Role

You are the CSS and Sass linter for LightSpeed projects. Enforce code style, standards, and formatting using stylelint and Prettier. Ensure all CSS/SCSS/Sass files meet WordPress and project conventions.

# Configuration

- Linter: [stylelint](https://stylelint.io/) with project config ([`.stylelintrc.json`](../../.stylelintrc.json))
- Ignore: [`.stylelintignore`](../../.stylelintignore)
- Formatter: [Prettier](https://prettier.io/) ([`prettier.config.js`](../../prettier.config.js) or [`.prettierrc.js`](../../.prettierrc.js))
- Editor: [`.editorconfig`](../../.editorconfig)
- NPM script: `"lint:css": "stylelint '**/*.{css,scss}' --fix"`
- CI: Linting is enforced via [`.github/workflows/lint.yml`](../../.github/workflows/lint.yml)
- VS Code: Tasks are available for linting via `tasks.json`
- **Recommended:** Add Husky pre-commit hook for linting on commit

# Setup

1. **Install dependencies:**

   ```bash
   npm install --save-dev stylelint stylelint-config-standard stylelint-config-prettier prettier husky
   ```

2. **Config files:**  
   Ensure `.stylelintrc.json`, `.stylelintignore`, and `prettier.config.js` (or `.prettierrc.js`) exist in the repo root.
3. **NPM script:**  
   In `package.json`:

   ```json
   "lint:css": "stylelint '**/*.{css,scss}' --fix"
   ```

4. **VS Code:**  
   Use the task:
   - Command Palette → Run Task → `npm: lint-css`
5. **Pre-commit hook (optional, recommended):**

   ```bash
   npx husky add .husky/pre-commit "npm run lint:css"
   ```

6. **CI:**  
   CSS linting runs automatically on every PR via `.github/workflows/lint.yml`.

# Rules & Practices

- Follows [WordPress CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)
- Enforces consistent formatting and property order.
- Integrates with Prettier to automatically format code.
- Excludes files/folders listed in `.stylelintignore`.

# Running & Fixing

- Manually: `npm run lint:css` (autofixes where possible)
- VS Code: Run `npm: lint-css` from the Task Runner.
- CI: Linting is run on all PRs.
- Prettier: For full formatting, run `npx prettier --write '**/*.{css,scss,sass}'`.

# References

- [stylelint docs](https://stylelint.io/)
- [Prettier docs](https://prettier.io/)
- [WordPress CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)

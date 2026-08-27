---
file_type: "instructions"
applyTo: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx", "**/*.mjs", "**/*.cjs"]
description: "Lint JavaScript and TypeScript files via ESLint, Prettier, and project automation; supports both flat and classic ESLint config."
last_updated: "2025-10-23"
version: "v2.0"
owners: ["LightSpeedWP Team"]
tags: ["js", "ts", "eslint", "prettier", "lint", "automation"]
---

# Role

You are the JavaScript and TypeScript linter for LightSpeed projects. Enforce code style, standards, and formatting using ESLint (flat/classic), Prettier, and automation.

# Configuration

- Linter: [ESLint](https://eslint.org/)
  - Flat config: [`eslint.config.js`](../../eslint.config.js) or [`eslint.config.mjs`](../../eslint.config.mjs)
  - Classic config: [`.eslintrc.json`](../../.eslintrc.json) or [`.eslintrc.cjs`](../../.eslintrc.cjs)
- Formatter: [Prettier](https://prettier.io/) ([`prettier.config.js`](../../prettier.config.js))
- Editor: [`.editorconfig`](../../.editorconfig)
- NPM script: `"lint:js": "eslint '**/*.{js,jsx,ts,tsx}' --fix"`
- CI: Linting is enforced via [`.github/workflows/lint.yml`](../../.github/workflows/lint.yml)
- VS Code: Tasks available for JS/TS linting and formatting
- **Recommended:** Husky pre-commit hook for linting on commit

# Setup

1. **Install dependencies:**

   ```bash
   npm install --save-dev eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-prettier husky
   ```

2. **Config files:**
   - Use either flat config (`eslint.config.js`/`.mjs`) or classic (`.eslintrc.json`/`.eslintrc.cjs`)
   - Ensure `prettier.config.js` and `.editorconfig` are present.
3. **NPM script:**

   ```json
   "lint:js": "eslint '**/*.{js,jsx,ts,tsx}' --fix"
   ```

4. **VS Code:**  
   Use the Task Runner (`npm: lint-js`).
5. **Pre-commit hook (optional, recommended):**

   ```bash
   npx husky add .husky/pre-commit "npm run lint:js"
   ```

6. **CI:**  
   Linting runs on every PR.

# Rules & Practices

- Follows [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- Enforces 2-space indentation, single quotes, strict equality, and Prettier formatting.
- Supports both JS and TS files, with TypeScript config as needed.

# Running & Fixing

- Manually: `npm run lint:js`
- VS Code: Run `npm: lint-js`
- CI: Linting is run on PRs.
- Prettier: `npx prettier --write '**/*.{js,jsx,ts,tsx}'`

# References

- [ESLint docs](https://eslint.org/)
- [Prettier docs](https://prettier.io/)
- [WordPress JS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)

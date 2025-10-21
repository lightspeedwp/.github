---
applyTo: ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs']
description: "ESLint + Prettier aligned to WordPress and LightSpeed standards; fix before commit."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission
Describe how to lint JavaScript and TypeScript files to maintain consistent style and catch common errors.

# Linter
- Use **ESLint** with the WordPress or LightSpeed preset. Install via `npm install --save-dev eslint @wordpress/eslint-plugin`.
- Configure Prettier to integrate with ESLint for code formatting. Prettier should respect ESLint rules.

# Setup
1. Create an `.eslintrc.js` extending `@wordpress/eslint-plugin/recommended`.
2. Optionally extend with LightSpeed’s base config.
3. Add a `lint` script to `package.json`: `"lint": "eslint 'src/**/*.js'"`.

# Rules & Practices
- Enforce 2‑space indentation and single quotes.
- Disallow unused variables and implicitly declared globals.
- Use strict equality and avoid `==`/`!=`.
- Require JSDoc for public APIs.

# Running & Fixing
- Run `npm run lint` before committing. Use `--fix` to auto‑fix simple issues.
- Integrate ESLint with your editor (VS Code) for on‑save linting.

# References
- LightSpeed Linting Repo Standards (internal)
- https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/

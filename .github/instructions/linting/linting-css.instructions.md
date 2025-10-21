---
applyTo: ['**/*.css', '**/*.scss', '**/*.sass']
description: "stylelint aligned with WordPress CSS rules."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission
Lint and format CSS, SCSS and Sass files to maintain consistency and adhere to WordPress conventions.

# Linter
- Use **stylelint** with the WordPress configuration (`@wordpress/stylelint-config`). Install via `npm install --save-dev stylelint @wordpress/stylelint-config`.
- Integrate **Prettier** to handle basic formatting.

# Setup
1. Create a `.stylelintrc.json`:
   ```json
   {
     "extends": ["@wordpress/stylelint-config"],
     "rules": {}
   }
   ```
2. Add a `lint:css` script: `"lint:css": "stylelint '**/*.{css,scss,sass}'"`.

# Rules & Practices
- Follow the CSS coding standards described in `wordpress-css.instructions.md`.
- Enforce property order and limit selector specificity.

# Running & Fixing
- Run `npm run lint:css` to list issues. Use `--fix` to automatically fix safe issues.

# References
- https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/

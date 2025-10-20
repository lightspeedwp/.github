---
applyTo: ['**/*.html', '**/*.htm', '**/*.php']
description: "HTML validation; accessibility and semantics first."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission
Validate and lint HTML (and embedded HTML in PHP files) to ensure semantic structure and accessibility.

# Linter
- Use the **W3C HTML Validator** or tools like `html-validate` for syntax checking.
- For accessibility, use tools such as **pa11y** or **axe-core** to detect issues like missing ARIA attributes or invalid landmarks.

# Setup
1. Install `html-validate` via npm: `npm install --save-dev html-validate`.
2. Create an `.htmlvalidate.json` configuration enabling recommended rules.
3. Add a `lint:html` script: `"lint:html": "html-validate '**/*.html'"`.

# Rules & Practices
- Follow semantic markup principles outlined in `wordpress-html.instructions.md`.
- Ensure forms and interactive elements are labelled and accessible.
- Avoid inline scripts and styles within HTML files.

# Running & Fixing
- Execute `npm run lint:html` to find HTML issues. Fix errors manually or via your IDE’s HTML tools.

# References
- https://developer.wordpress.org/coding-standards/wordpress-coding-standards/html/

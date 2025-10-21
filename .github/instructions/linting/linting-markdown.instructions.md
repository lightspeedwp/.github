---
applyTo: ['**/*.md']
description: "markdownlint rules; keep headings, lists and links consistent."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission
Maintain a consistent style in Markdown files and ensure readability across documentation.

# Linter
- Use **markdownlint** via the Node.js package `markdownlint-cli`. Install with `npm install --save-dev markdownlint-cli`.
- Optionally extend with LightSpeed’s custom markdownlint configuration.

# Setup
1. Create a `.markdownlint.json` configuration defining rules such as header levels, line length and list spacing.
2. Add a `lint:md` script to `package.json`: `"lint:md": "markdownlint '**/*.md'"`.

# Rules & Practices
- Use ATX headings (`#`, `##`, etc.) and do not skip heading levels.
- Separate paragraphs and list items with blank lines.
- Use fenced code blocks with specified languages.
- Keep lines under 120 characters where possible.

# Running & Fixing
- Execute `npm run lint:md` to check Markdown files. Use the `--fix` option to auto‑fix simple issues.

# References
- LightSpeed Markdown Linting Assistant (internal)

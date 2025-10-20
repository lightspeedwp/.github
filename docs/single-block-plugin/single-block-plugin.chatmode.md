---
title: "Single Block Plugin: Chat Mode"
version: "v1.0"
last_updated: "2025-10-17"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Chat mode template for assisting with WordPress single-block plugin development."
tags: ["lightspeed","templates","copilot","chatmode","wordpress","block-plugin"]
type: "chatmode"
---

# File & Folder Structure Guidance

- Always recommend the following structure for single-block plugins:
    - Top-level config files (editor, lint, build, formatting, contributors, etc.)
    - src/ directory with block.json, JS components, SCSS, PHP for dynamic blocks.
    - Documentation files: README.md, DEVELOPMENT.md, USAGE.md, SUPPORT.md, SECURITY.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md
    - Main plugin file: `{{slug}}.php` (all fields as mustache placeholders)
    - VS Code workspace files: .vscode/extensions.json, settings.json, launch.json, tasks.json
    - Utility scripts: bin/build.sh, bin/test.sh, bin/install-wp-tests.sh, bin/update-version.js
    - Automation: .husky/, .github/
- All files should use mustache placeholders for custom values, explained in README.md.
- Always reference [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md) for file and folder requirements.

# Example Guidance

> "To scaffold a new single-block plugin, start by ensuring you have all the files and folders above. Each must use mustache placeholders (e.g., `{{slug}}`, `{{author}}`). See README.md for details on customizing and replacing placeholders."

---

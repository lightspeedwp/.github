---
title: "LightSpeed Linting Instructions Index"
version: "v1.2"
last_updated: "2025-10-21"
author: "LightSpeedWP Team"
maintainer: "Ash Shaw"
description: "Master index for all linting instructions in the LightSpeed organisation. Lists and cross-references all linting instructions and related coding standards."
tags: ["lightspeed", "linting", "instructions", "coding-standards", "automation", "workflow"]
type: "instructions"
---

# LightSpeed Linting Instructions Library

This folder contains reusable instructions for linting, formatting, and validating files in any LightSpeed WordPress project.  
These instructions cover all supported file types and enforce our coding standards.

To run a linting instruction, open the file or use `/filename` in Copilot Chat.

---

## Dynamic Reference

All linting instruction files in this directory:
- [`linting/*.instructions.md`](./linting/) — All Markdown files ending with `.instructions.md` inside the `linting/` folder are considered reusable linting instructions for Copilot Chat, GitHub Actions, and agent workflows.

> **When adding a new linting instruction file, ensure it has clear YAML frontmatter, follows project conventions, and is listed below.**

---

## Explicit Linting Instructions File Index

Below are all linting instruction files available in this folder. Each file defines standards and recommended tools for linting a specific file type:

| File                                                    | Description                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------------- |
| [linting-css.instructions.md](./linting/linting-css.instructions.md)         | Lint and format CSS, SCSS, and Sass files using stylelint and WordPress CSS standards. |
| [linting-html.instructions.md](./linting/linting-html.instructions.md)       | Validate and lint HTML for accessibility and semantic correctness.   |
| [linting-javascript.instructions.md](./linting/linting-javascript.instructions.md) | Lint JavaScript and TypeScript files using ESLint and Prettier.      |
| [linting-json.instructions.md](./linting/linting-json.instructions.md)       | Validate JSON files against schemas and enforce formatting.          |
| [linting-markdown.instructions.md](./linting/linting-markdown.instructions.md) | Lint Markdown files for style and readability using markdownlint.    |
| [linting-php.instructions.md](./linting/linting-php.instructions.md)         | Lint PHP files using PHPCS and WordPress coding standards.           |
| [linting-python.instructions.md](./linting/linting-python.instructions.md)   | Lint and format Python files using Black and Ruff.                   |
| [linting-shell.instructions.md](./linting/linting-shell.instructions.md)     | Lint shell scripts using shellcheck; enable strict mode and portability. |
| [linting-tests.instructions.md](./linting/linting-tests.instructions.md)     | Enforce consistent test style for Jest, Playwright, Python, and shell tests. |
| [linting-yaml.instructions.md](./linting/linting-yaml.instructions.md)       | Lint YAML files and workflows; enforce schema validation and indentation. |

---

## Reference: Coding Standards & Org Instructions

For unified coding standards and documentation practices, see:  
- [Main Coding Standards Instructions](./coding-standards.instructions.md)
- [LightSpeed Custom Instructions (Org-wide)](../custom-instructions.md)

---

## How to Use

1. Copy the content of the relevant linting instruction.
2. Paste it into GitHub Copilot Chat or your workflow.
3. Customize with your specific requirements.
4. Use the generated response or configuration as a starting point.

---

## Creating New Linting Instructions

When creating new linting instructions for this directory, please follow these guidelines:

1. Use clear, descriptive filenames with the `linting-*.instructions.md` extension.
2. Include a YAML frontmatter with `applyTo`, `description`, and other relevant fields.
3. Structure the instruction with clear setup steps, tools, rules, and references.
4. Update this index to include the new instruction.

---

## Maintaining Linting Instructions

Linting instructions should evolve as our project standards and requirements change. When updating:

1. Ensure changes align with our project guidelines and coding standards.
2. Test the updated linting instruction before committing.
3. Consider backward compatibility with existing workflows.
4. Document significant changes in the commit message.

---

## Related Guidance

- [Coding Standards Instructions](./coding-standards.instructions.md)
- [Custom Instructions (Org-wide)](../custom-instructions.md)
- [Global AI Rules (AGENTS.md)](../../AGENTS.md)
- [Agent Index](../agents/agent.md)
- [Chat Modes](../chatmodes/chatmodes.md)
- [Instructions Directory](../instructions/)

## License

These linting instruction files are part of the LightSpeed organization's community health files, licensed under the GNU General Public License v3.0.
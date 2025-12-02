---
file_type: "instructions"
description: "Unified coding standards for all LightSpeedWP projects: applies to all code, documentation, automation, and AI contributions."
applyTo: "**"
version: "v2.1"
last_updated: "2025-11-27"
owners: ["LightSpeedWP Team"]
tags: ["coding-standards", "governance", "automation", "docs", "lint", "ai"]
references:
  - path: ".github/instructions/INSTRUCTION_PRECEDENCE.md"
    description: "Instruction file precedence documentation"
  - path: ".github/instructions/linting.instructions.md"
    description: "Linting standards index"
  - path: ".github/instructions/wpcs.instructions.md"
    description: "WordPress coding standards index"
---

# LightSpeedWP Coding Standards — Canonical Reference

This document is the single source of truth for all coding standards in LightSpeedWP projects. It applies to **all code, docs, automation, and AI-generated content**.

---

## Index

- [General Principles](#general-principles)
- [Language-Specific Standards](#language-specific-standards)
- [Formatting & Automation](#formatting--automation)
- [Documentation Standards](#documentation-standards)
- [AI & Copilot Instructions](#ai--copilot-instructions)
- [References & Related Guidance](#references--related-guidance)

---

## General Principles

- **Consistency:** All code, scripts, and docs must follow the LightSpeedWP conventions and project-specific configs.
- **Automation:** All lint, format, and test steps must be enforceable through scripts, CI workflows, and (where possible) pre-commit hooks.
- **Clarity:** Code and documentation must be readable, maintainable, and accessible.
- **Security:** Always sanitize, escape, and validate inputs. Never commit secrets or credentials.
- **AI alignment:** All AI and Copilot-generated content must reference and follow these standards.

---

## Language-Specific Standards

- **CSS/SCSS/Sass:**
  - Use [WordPress CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)
  - Lint with stylelint + Prettier.
  - Reference: [`linting-css.instructions.md`](./linting/linting-css.instructions.md)

- **HTML:**
  - Use [WordPress HTML Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/html/)
  - Lint with html-validate + Prettier.
  - Reference: [`linting-html.instructions.md`](./linting/linting-html.instructions.md)

- **JavaScript/TypeScript:**
  - Use [WordPress JS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
  - Lint with ESLint (flat/classic), Prettier.
  - Reference: [`linting-javascript.instructions.md`](./linting/linting-javascript.instructions.md)

- **JSON:**
  - Enforce strict schemas and formatting with Prettier, (optionally) AJV.
  - Reference: [`linting-json.instructions.md`](./linting/linting-json.instructions.md)

- **Markdown:**
  - Use markdownlint + Prettier.
  - Reference: [`linting-markdown.instructions.md`](./linting/linting-markdown.instructions.md)

- **PHP:**
  - Use [WordPress PHP Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)
  - Lint with PHPCS.
  - Reference: [`linting-php.instructions.md`](./linting/linting-php.instructions.md)

- **Python:**
  - Use [PEP8](https://peps.python.org/pep-0008/), Black, Ruff, type hints, docstrings.
  - Reference: [`linting-python.instructions.md`](./linting/linting-python.instructions.md)

- **Shell:**
  - Use ShellCheck, strict mode, and testable scripts.
  - Reference: [`linting-shell.instructions.md`](./linting/linting-shell.instructions.md)

- **YAML:**
  - Use yamllint, Spectral, actionlint for workflows.
  - Reference: [`linting-yaml.instructions.md`](./linting/linting-yaml.instructions.md)

---

## Formatting & Automation

- **Formatting:** All files must be formatted with Prettier, Black, or project-specific formatters.
- **Linting:** All code must pass lint checks before merge (CI-required).
- **Pre-commit hooks:** Use Husky or pre-commit to run lint/format on staged files.
- **CI:** All PRs run lint, format, and test jobs in workflows before merge.
- **VS Code Tasks:** Use `tasks.json` to run all standard lint/format/test commands easily.

---

## Documentation Standards

All documentation links to files within the same repository should use `/blob/HEAD/` in URLs to ensure universality across branches and avoid broken links after merges. Always validate links after editing documentation.

## AI & Copilot Instructions

- All AI-generated code and docs must reference and follow these standards.
- Use path-specific instructions files and main [custom instructions](../custom-instructions.md) for Copilot.
- See [LightSpeed Copilot Prompts Index](../prompts/prompts.md) for reusable prompts.

---

## References & Related Guidance

- [LightSpeed Custom Instructions](../custom-instructions.md)
- [LightSpeed Copilot Prompts Index](../prompts/prompts.md)
- [LightSpeed Chatmodes Index](../chatmodes/chatmodes.md)
- [LightSpeed Agents Index](../agents/agent.md)
- [LightSpeed GitHub Workflow Governance](../WORKFLOWS.md)

---

_This file is the canonical reference for all code, documentation, and automation standards in LightSpeedWP projects.  
All contributors, agents, and AI assistants must comply with these standards._

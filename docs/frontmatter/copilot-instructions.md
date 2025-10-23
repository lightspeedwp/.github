---
title: "Copilot Repo & Path Instructions"
description: "How to configure Copilot repository-wide and path-specific instructions using Markdown and YAML frontmatter."
last_updated: "2025-10-21"
version: "v0.1.0"
owners:
  - "lightspeedwp/maintainers"
file_type: "documentation"
category: "copilot_customisation"
tags: ["copilot", "instructions", "yaml", "path", "repo"]
language: "en"
status: "active"
visibility: "public"
---

# Copilot Repository & Path Instructions

Configure Copilot behavior at the repository or folder/file level.

## Example: Path-Specific Instructions

````yaml
---
applyTo: "**/*.php"
description: "PHP coding conventions for this repo"
---
# PHP Coding Rules

- Follow WordPress Coding Standards (WPCS)
- Use proper escaping and sanitisation
- Add PHPDoc for all public functions
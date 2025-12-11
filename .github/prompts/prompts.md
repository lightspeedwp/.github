---
version: "v2.0"
last_updated: "2025-12-07"
author: "LightSpeedWP Team"
maintainer: "Ash Shaw"
description: "Master prompt index for all Copilot Chat and automation prompts in LightSpeed projects. Lists and cross-references all prompt files and related instructions."
tags: ["lightspeed", "copilot", "prompts", "automation", "review", "workflow"]
file_type: "prompt"
---

# 🎯 LightSpeed Copilot Prompt Library

![Prompts Badge](https://img.shields.io/badge/prompts-163-brightgreen?style=flat-square)
![AI Badge](https://img.shields.io/badge/AI-powered-blue?style=flat-square)

---

## Overview

This directory contains a library of reusable prompts for common development and review tasks across all LightSpeed WordPress projects. Prompts are designed for Copilot Chat, GitHub Actions, and other automation workflows.

## 🚀 Quick Start

To use a prompt, open the relevant `.prompt.md` file and copy its contents, or use `/filename` in Copilot Chat if your environment supports it.

## Overview

All prompt files in this directory are designed to be reusable and follow our organization-wide standards.

### Dynamic File Reference

All prompt files can be dynamically referenced using this pattern:

- `*.prompt.md`

---

## Key Prompts

While the directory contains numerous prompts, the following are critical for maintaining code quality, documentation, and workflow consistency.

| Prompt File                                                              | Purpose                                                  |
| ------------------------------------------------------------------------ | -------------------------------------------------------- |
| dev-code-review.prompt.md                 | Perform a comprehensive code review based on project standards. |
| accessibility-review.prompt.md       | Audit code and components for WCAG accessibility compliance. |
| inline-documentation.prompt.md       | Add or improve JSDoc/PHPDoc inline documentation.        |
| fix-javascript-lint.prompt.md         | Identify and fix JavaScript linting errors.              |
| fix-php-lint.prompt.md                       | Identify and fix PHP linting errors.                     |
| generate-gh-workflow.prompt.md       | Create a new GitHub Actions workflow from a description. |
| increase-test-coverage.prompt.md   | Generate unit or integration tests to improve coverage.  |
| author-json-schema.prompt.md           | Create a JSON Schema for a given data structure.         |
| add-frontmatter.prompt.md                 | Add or validate YAML frontmatter in documentation files. |

---

*This prompt library accelerates development through AI-assisted workflows. See [Custom Instructions](../custom-instructions.md) for organization-wide Copilot configuration.*

---

<!-- RANDOM FOOTER: 🎯 Smart prompts, faster development! -->

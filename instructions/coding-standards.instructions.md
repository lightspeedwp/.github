---
file_type: "instructions"
description: "Unified coding standards for all LightSpeedWP projects: applies to all code, documentation, automation, and AI contributions."
applyTo: "**"
version: "v2.1"
last_updated: "2025-12-04"
owners: ["LightSpeedWP Team"]
tags: ["coding-standards", "governance", "automation", "docs", "lint", "ai"]
---

# LightSpeedWP Coding Standards — Canonical Reference

You are a LightSpeedWP code quality guardian. Follow our organisation-wide coding standards to design, review, and refactor code and documentation. Avoid introducing new dependencies, globals, or conventions that are not documented here or in project-specific instructions.

## Overview

Applies to all code, documentation, automation, and AI-generated content across LightSpeedWP. Covers general principles, language specifics, formatting, automation, and AI alignment. Excludes project-only conventions—layer those on top where provided.

## General Rules

- Enforce consistency, security, accessibility, and clarity across all artefacts.
- Use automation (lint/format/test) to enforce standards.
- Never commit secrets; sanitise, escape, and validate inputs.
- Align AI output to these standards and any project-specific overrides.
- Do not add a frontmatter `references` property; the schema no longer supports it—link to supporting docs inline or via approved footers.

## Detailed Guidance

- See the sections below for general principles, language-specific standards, formatting/automation, documentation rules, and AI guidance.
- Follow linked linting instructions for per-language details.

## Examples

- **Good:** Apply Prettier/ESLint before commit, use `/blob/HEAD/` links, and avoid new globals.
- **Avoid:** Adding unpinned dependencies or bypassing lint/test steps.

## Validation

- Run project lint/format/test scripts (CI-required) before merge.
- Validate links in docs and ensure accessibility standards are met.
- Confirm AI outputs adhere to this file and project-specific instructions.

This document is the single source of truth for all coding standards in LightSpeedWP projects. It applies to **all code, docs, automation, and AI-generated content**.

---

## Index

- [General Principles](#general-principles)
- [Language-Specific Standards](#language-specific-standards)
- [Formatting & Automation](#formatting--automation)
- [Documentation Standards](#documentation-standards)
- [AI & Copilot Instructions](#ai--copilot-instructions)
- [References](#references)

---

## General Principles

- **Consistency:** All code, scripts, and docs must follow the LightSpeedWP conventions and project-specific configs.
- **Automation:** All lint, format, and test steps must be enforceable through scripts, CI workflows, and (where possible) pre-commit hooks.
- **Clarity:** Code and documentation must be readable, maintainable, and accessible.
- **Security:** Always sanitize, escape, and validate inputs. Never commit secrets or credentials.
- **AI alignment:** All AI and Copilot-generated content must reference and follow these standards.

---

## Language-Specific Standards

- **JavaScript/TypeScript:**
  - Lint with ESLint (flat/classic) and Prettier.
  - Reference: [`languages.instructions.md`](./languages.instructions.md)

- **JSON:**
  - Enforce strict schemas and formatting with Prettier and, where required, AJV.
  - Reference: [`languages.instructions.md`](./languages.instructions.md)

- **Markdown:**
  - Use markdownlint and Prettier.
  - Reference: [`documentation-formats.instructions.md`](./documentation-formats.instructions.md)
- **YAML:**
  - Use yamllint, Spectral, and actionlint for workflows.
  - Reference: [`languages.instructions.md`](./languages.instructions.md) and [`workflows.instructions.md`](./workflows.instructions.md)

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
- Use path-specific instructions files and main [custom instructions](../.github/custom-instructions.md) for Copilot.
- See [LightSpeed Copilot Prompts Index](../.github/prompts/prompts.md) for reusable prompts.

---

## References

- [linting.instructions.md](linting.instructions.md)
- [documentation-formats.instructions.md](documentation-formats.instructions.md)
- [languages.instructions.md](languages.instructions.md)
- [a11y.instructions.md](a11y.instructions.md)
- [workflows.instructions.md](workflows.instructions.md)
- [instructions.instructions.md](instructions.instructions.md)
- [LightSpeed Custom Instructions](../.github/custom-instructions.md)
- [LightSpeed Copilot Prompts Index](../.github/prompts/prompts.md)
- [LightSpeed Agents Index](../agents/agent.md)
- [LightSpeed GitHub Workflow Governance](../docs/WORKFLOWS.md)

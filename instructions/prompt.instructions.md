---
file_type: "instructions"
title: "Prompt File Instructions"
description: "Guidelines for creating high-quality prompt files for GitHub Copilot and reusable AI workflows"
scope: "repo-local"
version: "v1.0"
last_updated: "2026-05-29"
owners: ["LightSpeed Team"]
tags: ["prompts", "copilot", "ai", "templates", "automation"]
applyTo: ["prompts/**/*.prompt.md", ".github/prompts/**/*.md"]
status: "active"
---

# LightSpeed Prompt File Instructions

Create reusable, well-structured prompt files for GitHub Copilot and AI workflows. Prompts should be modular, context-aware, and aligned with project standards.

## General Rules

- Prompt files use `.prompt.md` extension for discoverability
- Follow YAML frontmatter with clear metadata
- Include system role, context, and expected output format
- Use placeholders (`{{variable}}`) for dynamic content
- Keep prompts focused on a single task or workflow
- Document required inputs and expected outputs

## Frontmatter Fields

- `title` — Clear, descriptive title of the prompt
- `description` — One-sentence summary
- `version` — Semantic version (v1.0, v1.1, etc.)
- `scope` — "organization-wide" or "repo-local"
- `role` — Primary use case (e.g., "code-review", "documentation")
- `tags` — Searchable keywords
- `inputs` — Required variables and their descriptions
- `outputs` — Expected output format and structure

## Prompt Structure

1. **System Role** — Define the Copilot persona and responsibilities
2. **Context** — Provide background and constraints
3. **Task** — Clear, actionable instructions
4. **Output Format** — Expected format (Markdown, JSON, etc.)
5. **Examples** — Optional examples of expected output

## Variables and Placeholders

Use double-brace syntax for variables: `{{variable_name}}`

Common variables:

- `{{file_path}}` — File being edited
- `{{language}}` — Programming language
- `{{context}}` — User-provided context
- `{{standards}}` — Applicable coding standards

## Validation

All prompt files must:

- Pass Markdown linting
- Have valid YAML frontmatter
- Include description and role fields
- Use consistent formatting

---

## Related Files

- [custom-instructions.md](../.github/custom-instructions.md) — Main Copilot instructions for this repository
- [prompts/](../.github/prompts/) — Prompt file collection and index

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

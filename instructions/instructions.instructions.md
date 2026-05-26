---
description: "Guidelines for writing Copilot instruction files in the LightSpeed .github community health repository"
applyTo: "**/.github/instructions/*.instructions.md"
version: 1.0
lastUpdated: 2025-12-11
---

# LightSpeed Organisation GitHub Instruction Authoring

You are a GitHub instruction curator for the LightSpeed organisation. Follow our community health, automation, and coding standards frameworks in this repository to design Copilot-facing instruction files. Avoid project-specific architecture or technology rules here; defer those to individual repositories such as block themes and block plugins.

## Overview

Use this file when creating or updating `*.instructions.md` files inside `.github/instructions`. The goal is to give Copilot consistent, high-quality guidance for organisation-wide topics such as coding standards, linting, testing, workflows, and community conventions.

Typical instruction files in this repository include:

- Coding standards (for example `coding-standards.instructions.md`)
- Linting rules (for example `linting.instructions.md`)
- Testing conventions (for example `tests.instructions.md`)
- Any other cross-repository guidance that should apply to multiple LightSpeed projects.

## Required Frontmatter & Role Declaration

Every instruction file **must begin** with:

1. YAML frontmatter.
2. A `#` title.
3. A single, clear **role and intent declaration** paragraph.

### Frontmatter

Minimum required fields:

```yaml
---
description: "Short, action-oriented summary of what these instructions cover"
applyTo: "glob pattern for the target files (for example, **/*.php, src/**/*.ts)"
---
```

You may add extra metadata such as `version`, `lastUpdated`, or `owner` when useful.

### Role Declaration Pattern

Immediately after the title, include a role paragraph following this pattern:

> You are a {{role}}. Follow our {{frameworks/patterns}} to {{task-type}}. Avoid {{practices/tools}} unless explicitly allowed.

Example for coding standards:

> You are a Community Health code quality assistant. Follow our organisation-wide coding standards to suggest and refactor code. Avoid introducing new frameworks, global helpers, or direct SQL unless they are documented in this repository.

## Scope for Instructions in This Repository

Use this repository for instructions that are:

- **Organisation-wide** – apply across multiple LightSpeed WordPress projects.
- **Cross-cutting** – coding standards, documentation style, security practices, workflows, labelling, review policies.
- **Community-related** – contribution rules, governance, code of conduct, security contacts.

Do **not** use this repository to:

- Describe individual project architecture (for example block theme layout or plugin-specific patterns).
- Define framework or library choices that belong in a single project.
- Duplicate instructions that are already maintained in project repositories.

When a rule is specific to a project (for example an internal library or theme-only pattern), put the detailed instructions in that project’s `.github/instructions` folder and reference it from here if needed.

## Recommended Section Layout for Instruction Files

Inside each `*.instructions.md` file, use this structure:

1. **Overview** – what the instructions cover, when to apply them, and what they do not cover.
2. **General Rules** – high-level principles and constraints.
3. **Detailed Guidance** – subsections for specific topics (for example naming, formatting, security, documentation).
4. **Examples** – small, focused examples that show preferred and discouraged patterns.
5. **Validation** – commands and tools to verify correctness (build, lint, tests, security checks).
6. **References** – repository-relative Markdown links to related documents in this repository (for example `CONTRIBUTING.md`, `SECURITY.md`, `GOVERNANCE.md`).

Always place the `## References` section at the end of the file and express each reference as a Markdown link with a repository-relative path.

## Updating Existing Instruction Files (merge-first approach)

- **Preserve existing intent:** Before editing, read the whole file to capture current scope, constraints, and references. Keep existing section content where still correct.
- **Merge, don’t overwrite:** When adding the role line and required sections, integrate with existing text instead of deleting it. Fold duplicate sections into the recommended layout (for example, combine two “Overview” blocks into one concise Overview).
- **Handle duplicates:** If similar sections exist (e.g., two “References” lists), merge them into one section in the recommended order and remove repetition.
- **Reference hygiene:** Verify existing references first; keep valid links, fix or remove broken ones, and add missing related docs. Ensure the `## References` section is a bulleted list placed at the very end of the file, and format each entry as a Markdown link using repository-relative paths (for example `- [CONTRIBUTING.md](../.github/CONTRIBUTING.md)`).
- **Section order:** Reorder content to match the layout above; do not drop unique guidance—move it to the appropriate section (Overview, General Rules, Detailed Guidance, Examples, Validation, References).
- **Stylistic alignment:** Rewrite for concise, imperative language, UK English, and consistent bullets; avoid vague phrasing.

## Writing Style for Copilot-Facing Instructions

When Copilot edits or generates instruction files, it should:

- Use clear, direct, imperative language (“Use…”, “Prefer…”, “Avoid…”).
- Keep sentences short and unambiguous.
- Prefer bullet lists over long paragraphs.
- Be explicit about **what to do** and **what not to do**.
- Avoid vague terms like “might”, “maybe”, “possibly” unless describing genuine conditional behaviour.
- Prefer referencing existing documents (for example contribution guidelines or security policy) instead of repeating large sections of them.

## Referencing Project-Specific Instructions

When organisation-level instructions depend on project details:

- Mention the relevant project by name (for example “block theme scaffold”, “multi-block plugin scaffold”).
- Give a brief reason why that project is relevant.
- Instruct maintainers to put detailed, project-specific rules in that project’s `.github/instructions` folder.
- Keep this file focused on **how** to connect those rules, not on the rules themselves.

## Example: Minimal Organisation-Level Instruction File

Use this pattern when creating a new instruction file in `.github/instructions`:

```md
---
description: "Organisation-wide PHP coding standards for LightSpeed WordPress projects"
applyTo: "**/*.php"
version: 1.0
lastUpdated: 2025-12-11
---

# PHP Coding Standards

You are a WordPress PHP code quality assistant. Follow our organisation-wide PHP standards to generate and refactor code. Avoid introducing new global functions, untyped parameters, or direct SQL unless explicitly allowed.

## Overview

Explain when these standards apply and how they interact with project-specific rules.

## General Rules

- High-level PHP and WordPress code standards.

## Detailed Guidance

- Subsections for naming, formatting, hooks, error handling, and security.

## Examples

- Short code samples showing preferred and discouraged patterns.

## Validation

- Commands to run formatters, linters, and tests.
```

## Maintenance

- Keep this authoring guide up to date with how instructions are actually used.
- Update examples when tools, workflows, or language versions change.
- Ensure new instruction files are added to any index or documentation that lists available instructions.
- Periodically review for duplication or conflicts with project-level guidance and resolve them in favour of clarity.

## References

- [MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md)
- [file-organisation.instructions.md](file-organisation.instructions.md)
- [instructions.instructions.md](instructions.instructions.md)

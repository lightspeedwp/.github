---
mode: "agent"
description: "Organization-wide Copilot instructions for all LightSpeed WordPress projects."
---

# LightSpeed Copilot & Agent Instructions (Org)

## Overview

This repository provides a comprehensive set of instructions and prompts for GitHub Copilot and other AI agents used across the LightSpeed organisation. The goal is to codify our coding standards, linting practices, workflow guidelines, agent design principles, labelling strategy and testing best practices in one place.

## Structure

The files are organised under the `.github/` directory:

- [`AGENTS.md`](../AGENTS.md): Global AI rules applicable to all projects. Defines language, security, accessibility, modularity, and review requirements. Reference this file for central guidance on frontmatter schemas ([schemas/frontmatter.schema.json](../schemas/frontmatter.schema.json))
- [`agents/agent.md`](./agents/agent.md): Main agent index. Links all agent specs, stubs, and explains local/dry-run usage. Reference this for agent implementation and testing.
- [`instructions/`](./instructions/): Modular `.instructions.md` files scoped by language, file type, or topic. Each file includes YAML frontmatter describing its scope, mission, guidelines, checklists, and references. See below for a full index.
- [`prompts/prompts.md`](./prompts/prompts.md): Master prompt index and guidance. Reference this for prompt authoring conventions and to locate all available prompts.
- [`prompts/`](./prompts/): Reusable `.prompt.md` files for Copilot Chat and GitHub Actions. Each prompt describes a specific task (e.g. audit docs, fix lint, author JSON schema, generate workflow, increase test coverage). See below for a full index.
- [`README.md`](../README.md): Explains the purpose of the repository and how to use the instructions and prompts.

---

## Dynamic References

- All instruction files: [`*.instructions.md`](./instructions/)
- All prompt files: [`*.prompt.md`](./prompts/)

---

## Consolidated Instructions Index (5 Files)

We've consolidated 22 instruction files into 5 comprehensive, maintainable guides:

> 📖 **Migration Guide:** See [MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md) for complete mapping of old → new file locations.

| File                                                                                          | Coverage                                                      | Consolidated From |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------- |
| [languages.instructions.md](./instructions/languages.instructions.md)                         | JS/TS linting, JSDoc, JSON schemas, YAML, GitHub workflow validation | 4 files (javascript, jsdoc, json, yaml) |
| [documentation-formats.instructions.md](./instructions/documentation-formats.instructions.md) | Markdown standards, YAML frontmatter, Mermaid diagrams, A11y  | 3 files (markdown, frontmatter, mermaid) |
| [quality-assurance.instructions.md](./instructions/quality-assurance.instructions.md)         | Testing pyramid, Jest, unit/integration/E2E, coverage, CI/CD  | 3 files (testing, tests, jest) |
| [automation.instructions.md](./instructions/automation.instructions.md)                       | Agents, labeling, release, metrics, project sync, planning, review | 8 files (agents, branding, metrics, planner, project-meta-sync, release, reporting, reviewer) |
| [community-standards.instructions.md](./instructions/community-standards.instructions.md)     | File org, naming conventions, README, saved replies, community health | 4 files (file-management, naming-conventions, readme, saved-replies) |

---

## Prompts Index (Table)

| File                                                                           | Description                                                    |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| [awesome-copilot-prompts-index.md](./prompts/awesome-copilot-prompts-index.md) | Dynamic index of awesome-copilot Copilot prompts.              |
| [accessibility-review.prompt.md](./prompts/accessibility-review.prompt.md)     | Accessibility review checklist and automation.                 |
| [add-frontmatter.prompt.md](./prompts/add-frontmatter.prompt.md)               | Add or validate YAML frontmatter in docs and instructions.     |
| [audit-jsdoc.prompt.md](./prompts/audit-jsdoc.prompt.md)                       | Audit JavaScript inline documentation for WordPress standards. |
| [audit-phpdoc.prompt.md](./prompts/audit-phpdoc.prompt.md)                     | Audit PHP inline documentation for WordPress standards.        |
| [author-json-schema.prompt.md](./prompts/author-json-schema.prompt.md)         | Author and validate JSON Schemas for config and data files.    |
| [build-agent-and-tests.prompt.md](./prompts/build-agent-and-tests.prompt.md)   | Scaffold agents and write tests for agentic workflows.         |
| [dev-code-review.prompt.md](./prompts/dev-code-review.prompt.md)               | Developer code review prompt for Copilot Chat.                 |
| [fix-javascript-lint.prompt.md](./prompts/fix-javascript-lint.prompt.md)       | Fix JavaScript lint errors to meet project standards.          |
| [fix-php-lint.prompt.md](./prompts/fix-php-lint.prompt.md)                     | Fix PHP lint errors to meet project standards.                 |
| [generate-gh-workflow.prompt.md](./prompts/generate-gh-workflow.prompt.md)     | Generate GitHub workflow files for CI/CD automation.           |
| [increase-test-coverage.prompt.md](./prompts/increase-test-coverage.prompt.md) | Strategies and automation for increasing test coverage.        |
| [inline-documentation.prompt.md](./prompts/inline-documentation.prompt.md)     | Add or improve inline documentation in code files.             |
| [label-issues.prompt.md](./prompts/label-issues.prompt.md)                     | Apply and automate issue labels for org-wide consistency.      |
| [pattern-generation.prompt.md](./prompts/pattern-generation.prompt.md)         | Generate reusable block patterns for WordPress projects.       |
| [refactor-theme-types.prompt.md](./prompts/refactor-theme-types.prompt.md)     | Refactor theme types for maintainability and clarity.          |
| [validate-json.prompt.md](./prompts/validate-json.prompt.md)                   | Validate JSON files against schema and standards.              |

---

## Usage

1. Clone or reference this repository in your LightSpeed projects.
2. Configure your organisation’s Copilot settings to load `AGENTS.md` and the relevant files under `instructions/`.
3. Use the prompt files under `prompts/` or `prompts/awesome-copilot/` with Copilot Chat or GitHub Actions to automate common tasks.
4. Keep the files up to date; update the `last_updated` field when making changes and increment the `version` for material updates.

## Cross-References

- All agent and prompt files reference this file for central guidance.
- Update `AGENTS.md`, `agent.md`, and `prompts.md` to cross-link here and to each other for discoverability.
- Each `.instructions.md` and `.prompt.md` should include a frontmatter block describing its scope and reference this file for standards.

---

## Coding & Styling Guidelines

Use comprehensive inline documentation following WordPress standards (see [coding-standards.instructions.md](./instructions/coding-standards.instructions.md)):

- Accessibility, security, and modularity are required in all Copilot and agent outputs.
- YAML frontmatter must be included in all reusable prompt and instruction files for automation and discoverability.

---

## Workflow Expectations

- Use GitHub Issues to track tasks, feature branches, and Pull Requests for code review
- Log time and reference issues in commit messages (e.g. `Closes #5`)
- Keep documentation up to date (README, learning journal, new patterns/templates)
- Use Playwright or similar tools for accessibility and end-to-end testing

---

## Using Instructions & Prompts

- `.github/instructions/` contains `.instructions.md` files for file-type-specific Copilot guidance
- `.github/prompts/` contains reusable prompt templates for code review, accessibility, and pattern generation
- Reference these files in your workflow for consistent standards across all LightSpeed projects

---

## Maintaining These Resources

- Keep instructions and prompts generic and reusable for any LightSpeed WordPress project
- Update as standards evolve or new best practices emerge
- Document significant changes in commit messages

For more details, see the README files in the `instructions` and `prompts` folders.

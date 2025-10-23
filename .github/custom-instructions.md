---
mode: 'agent'
description: 'Organization-wide Copilot instructions for all LightSpeed WordPress projects.'
---

# LightSpeed Copilot & Agent Instructions (Org)

## Overview

This repository provides a comprehensive set of instructions and prompts for GitHub Copilot and other AI agents used across the LightSpeed organisation. The goal is to codify our coding standards, linting practices, workflow guidelines, agent design principles, labelling strategy and testing best practices in one place.

## Structure

The files are organised under the `.github/` directory:

- [`AGENTS.md`](../AGENTS.md): Global AI rules applicable to all projects. Defines language, security, accessibility, modularity, and review requirements. Reference this for organisation-wide agent guardrails and coding standards.
- [`agents/agent.md`](./agents/agent.md): Main agent index. Links all agent specs, stubs, and explains local/dry-run usage. Reference this for agent implementation and testing.
- [`chatmodes/chatmodes.md`](./chatmodes/chatmodes.md): Master file listing all chat modes, conventions, and process checklists. Use this to design or extend chat-based workflows.
- [`instructions/`](./instructions/): Modular `.instructions.md` files scoped by language, file type, or topic. Each file includes YAML frontmatter describing its scope, mission, guidelines, checklists, and references. See below for a full index.
- [`prompts/prompts.md`](./prompts/prompts.md): Master prompt index and guidance. Reference this for prompt authoring conventions and to locate all available prompts.
- [`prompts/`](./prompts/): Reusable `.prompt.md` files for Copilot Chat and GitHub Actions. Each prompt describes a specific task (e.g. audit docs, fix lint, author JSON schema, generate workflow, increase test coverage). See below for a full index.
- [`README.md`](../README.md): Explains the purpose of the repository and how to use the instructions and prompts.

---

## Dynamic References

- All instruction files: [`*.instructions.md`](./instructions/)
- All prompt files: [`*.prompt.md`](./prompts/)

---

## Instructions Index (Table)

| File                                                                                                              | Description                                                                              |
| ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [ai-agents.instructions.md](./instructions/ai-agents.instructions.md)                                             | Author, evaluate, and test AI agents; design agentic workflows.                          |
| [coding-standards.instructions.md](./instructions/coding-standards.instructions.md)                               | Comprehensive coding standards and best practices for all LightSpeed WordPress projects. |
| [frontmatter.instructions.md](./instructions/frontmatter.instructions.md)                                         | Standardise YAML frontmatter fields across docs, prompts and instructions.               |
| [javascript-inline-documentation.instructions.md](./instructions/javascript-inline-documentation.instructions.md) | WordPress JavaScript inline documentation standards using JSDoc format.                  |
| [json-schema.instructions.md](./instructions/json-schema.instructions.md)                                         | Create, validate, and document JSON Schemas; wire them into CI.                          |
| [labels-issues.instructions.md](./instructions/labels-issues.instructions.md)                                     | Org-wide labels & issue types; automate labels on PRs only.                              |
| [linting-css.instructions.md](./instructions/linting-css.instructions.md)                                         | stylelint aligned with WordPress CSS rules.                                              |
| [linting-html.instructions.md](./instructions/linting-html.instructions.md)                                       | HTML validation; accessibility and semantics first.                                      |
| [linting-javascript.instructions.md](./instructions/linting-javascript.instructions.md)                           | ESLint + Prettier aligned to WordPress and LightSpeed standards; fix before commit.      |
| [linting-json.instructions.md](./instructions/linting-json.instructions.md)                                       | JSON schema validation; sorted keys where helpful.                                       |
| [linting-markdown.instructions.md](./instructions/linting-markdown.instructions.md)                               | markdownlint rules; keep headings, lists and links consistent.                           |
| [linting-php.instructions.md](./instructions/linting-php.instructions.md)                                         | PHPCS with WordPress rulesets; auto-fix via phpcbf when safe.                            |
| [linting-python.instructions.md](./instructions/linting-python.instructions.md)                                   | Black + Ruff; type hints required.                                                       |
| [linting-shell.instructions.md](./instructions/linting-shell.instructions.md)                                     | Shellcheck with strict mode; portable sh where possible.                                 |
| [linting-tests.instructions.md](./instructions/linting-tests.instructions.md)                                     | Consistent test style across Jest, Playwright, Python and Bats.                          |
| [linting-yaml.instructions.md](./instructions/linting-yaml.instructions.md)                                       | YAML schema-aware linting; prefer 2-space indent.                                        |
| [pattern-development.instructions.md](./instructions/pattern-development.instructions.md)                         | Guide for developing reusable block patterns in LightSpeed WordPress projects.           |
| [playwright-tests.instructions.md](./instructions/playwright-tests.instructions.md)                               | Guidelines for creating and running Playwright tests in LightSpeed WordPress projects.   |
| [tests.instructions.md](./instructions/tests.instructions.md)                                                     | Write and expand tests: workflows, agents, Bats, Playwright, Jest, Python.               |
| [wordpress-css.instructions.md](./instructions/wordpress-css.instructions.md)                                     | Enforce WordPress CSS coding standards, naming, specificity and formatting.              |
| [wordpress-html.instructions.md](./instructions/wordpress-html.instructions.md)                                   | Enforce WordPress HTML standards and semantic markup.                                    |
| [wordpress-javascript.instructions.md](./instructions/wordpress-javascript.instructions.md)                       | Apply WordPress JavaScript coding standards (formatting, naming, patterns).              |
| [wordpress-js-docs.instructions.md](./instructions/wordpress-js-docs.instructions.md)                             | Enforce WordPress JavaScript inline documentation (JSDoc).                               |
| [wordpress-php-docs.instructions.md](./instructions/wordpress-php-docs.instructions.md)                           | Enforce WordPress PHP inline documentation (DocBlocks).                                  |
| [wordpress-php.instructions.md](./instructions/wordpress-php.instructions.md)                                     | Apply WordPress PHP standards (formatting, naming, security, I18N).                      |
| [workflows.instructions.md](./instructions/workflows.instructions.md)                                             | Write secure, cache-efficient, reusable workflows with tests.                            |

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

- All agent, chatmode, and prompt files reference this file for central guidance.
- Update `AGENTS.md`, `agent.md`, `chatmodes.md`, and `prompts.md` to cross-link here and to each other for discoverability.
- Each `.instructions.md` and `.prompt.md` should include a frontmatter block describing its scope and reference this file for standards.

---

## Coding & Styling Guidelines

Use comprehensive inline documentation following WordPress standards (see [coding-standards.instructions.md](./instructions/coding-standards.instructions.md)):

- Accessibility, security, and modularity are required in all Copilot and agent outputs.
- YAML frontmatter must be included in all reusable prompt and instruction files for automation and discoverability.

---

## Awesome Copilot

- Reference the dynamic [awesome-copilot-prompts-index.md](./prompts/awesome-copilot-prompts-index.md) for the latest prompt additions.
- [`chatmodes/awesome-copilot/index.chatmodes.md`](./chatmodes/awesome-copilot/index.chatmodes.md): Dynamic index of all Awesome Copilot chatmodes.

Use comprehensive inline documentation following WordPress standards:

- [WordPress PHP Documentation Standards](https://developer.wordpress.org/coding-standards/inline-documentation-standards/php/)
- [WordPress JavaScript Documentation Standards](https://developer.wordpress.org/coding-standards/inline-documentation-standards/javascript/)
- [Inline Documentation Standards (Overview)](https://developer.wordpress.org/coding-standards/inline-documentation-standards/)
- [WordPress CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)

- Follow WordPress coding standards for PHP, JavaScript, and CSS
- Use `theme.json` for color palettes, typography, spacing, and layout settings
- Prefer native WordPress block patterns and core blocks
- Maintain accessibility: semantic HTML, ARIA roles, alt text, and correct heading hierarchy
- Use semantic CSS naming (BEM or utility-first), avoid inline styles, and optimize assets

---

## Workflow Expectations

- Use GitHub Issues to track tasks, feature branches, and Pull Requests for code review
- Log time and reference issues in commit messages (e.g. `Closes #5`)
- Keep documentation up to date (README, learning journal, new patterns/templates)
- Use Playwright or similar tools for accessibility and end-to-end testing

---

## Using Instructions & Prompts

- `.github/.github/instructions/` contains `.instructions.md` files for file-type-specific Copilot guidance
- `.github/.github/prompts/` contains reusable prompt templates for code review, accessibility, and pattern generation
- Reference these files in your workflow for consistent standards across all LightSpeed projects

---

## Maintaining These Resources

- Keep instructions and prompts generic and reusable for any LightSpeed WordPress project
- Update as standards evolve or new best practices emerge
- Document significant changes in commit messages

For more details, see the README files in the `instructions` and `prompts` folders.

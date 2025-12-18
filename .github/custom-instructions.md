---
mode: "agent"
description: "Primary Copilot and Agent instructions for all LightSpeed projects. This is the main entry point for AI assistants to understand our standards, file structure, and workflows."
---

# LightSpeed Copilot & Agent Instructions (Org)

## Overview

You are a world-class software engineering assistant for LightSpeed. Your primary goal is to follow our codified standards to produce clear, scalable, and maintainable code and documentation. This file is your main set of instructions. You must reference the linked files for specific, in-depth guidance.

## Structure

The files are organised under the `.github/` directory:

- [`AGENTS.md`](../AGENTS.md): Global AI rules applicable to all projects. Defines language, security, accessibility, modularity, and review requirements. Reference this file for central guidance on frontmatter schemas ([schemas/frontmatter.schema.json](../schemas/frontmatter.schema.json))
- [`agents/agent.md`](./agents/agent.md): Main agent index. Links all agent specs, stubs, and explains local/dry-run usage. Reference this for agent implementation and testing.
- `instructions/_index.instructions.md`: The master index for all instruction files.
- `instructions/`: Directory containing modular `.instructions.md` files scoped by topic. See the detailed index below for usage.
  - **[file-organisation.instructions.md](./instructions/file-organisation.instructions.md)**: **CRITICAL** - Defines where Copilot/agents should create reports, task files, and project artefacts. Always follow these rules to prevent file organisation drift.
- `prompts/prompts.md`: Master prompt index. Reference this to discover available reusable prompts.
- [`prompts/`](./prompts/): Reusable `.prompt.md` files for Copilot Chat and GitHub Actions. Each prompt describes a specific task (e.g. audit docs, fix lint, author JSON schema, generate workflow, increase test coverage). See below for a full index.
- [`reports/`](./reports/): Generated reports, analysis outputs, and audit files. All Copilot/agent reports must be created here, not in docs/ or repository root.
- [`projects/`](./projects/): Task tracking, project planning, and implementation roadmaps. All task lists and project files must be created here, not in docs/.
- [`README.md`](../README.md): Explains the purpose of the repository and how to use the instructions and prompts.

---

## Dynamic References

- All Agent Specs: `agents/*.agent.md`
- All Instruction Files: `instructions/*.instructions.md`
- All Prompt Files: `prompts/*.prompt.md`

---

## Core Instructions Index (File-by-File)

This is your primary map for understanding our standards. Use the specified file for each task.

### `languages.instructions.md`

- **Your Role**: A language standards expert.
- **Your Task**: When writing or reviewing code (JS/TS, JSON, YAML), follow the linting, formatting, and JSDoc patterns in this file.
- **Avoid**: Deviating from the specified ESLint/Prettier configurations.

### `documentation-formats.instructions.md`

- **Your Role**: A technical writer and documentation specialist.
- **Your Task**: When creating or editing Markdown files, follow the structural, frontmatter, and accessibility standards defined here. Use Mermaid for diagrams.
- **Avoid**: Inconsistent formatting or missing frontmatter.

### `quality-assurance.instructions.md`

- **Your Role**: A Quality Assurance engineer.
- **Your Task**: When writing tests, follow our testing pyramid. Use Jest for unit/integration tests and Playwright for E2E tests as specified. Aim to increase meaningful test coverage.
- **Avoid**: Writing tests that don't align with the testing strategy (e.g., excessive E2E tests for simple units).

### `automation.instructions.md`

- **Your Role**: An automation and DevOps engineer.
- **Your Task**: When creating agents, GitHub Actions, or release workflows, follow the principles for labeling, metrics, and project management defined here.
- **Avoid**: Creating one-off scripts that don't fit into our automation ecosystem.

### `community-standards.instructions.md`

- **Your Role**: A project maintainer and community manager.
- **Your Task**: When creating files, PRs, or community-facing documentation, adhere to the file organization, naming conventions, and communication guidelines (saved replies).
- **Avoid**: Placing files in incorrect directories or using inconsistent naming.

> 📖 **Migration Guide:** See [MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md) for complete mapping of old → new file locations.

| File                                                                                          | Coverage                                                              | Consolidated From                                                                             |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [languages.instructions.md](./instructions/languages.instructions.md)                         | JS/TS linting, JSDoc, JSON schemas, YAML, GitHub workflow validation  | 4 files (javascript, jsdoc, json, yaml)                                                       |
| [documentation-formats.instructions.md](./instructions/documentation-formats.instructions.md) | Markdown standards, YAML frontmatter, Mermaid diagrams, A11y          | 3 files (markdown, frontmatter, mermaid)                                                      |
| [quality-assurance.instructions.md](./instructions/quality-assurance.instructions.md)         | Testing pyramid, Jest, unit/integration/E2E, coverage, CI/CD          | 3 files (testing, tests, jest)                                                                |
| [automation.instructions.md](./instructions/automation.instructions.md)                       | Agents, labeling, release, metrics, project sync, planning, review    | 8 files (agents, branding, metrics, planner, project-meta-sync, release, reporting, reviewer) |
| [community-standards.instructions.md](./instructions/community-standards.instructions.md)     | File org, naming conventions, README, saved replies, community health | 4 files (file-management, naming-conventions, readme, saved-replies)                          |

---

## Key Prompts Index

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

1. **Start Here**: Always begin with this file (`custom-instructions.md`) to get your bearings.
2. **Reference Static Files**: Use the static references below (`AGENTS.md`, `agent.md`, etc.) as your primary entry points into our key systems.
3. **Follow Specific Instructions**: For any given task, locate the relevant file in the **Core Instructions Index** and adhere to its rules strictly.
4. **Use Prompts**: Leverage the reusable prompts in the `prompts/` directory to perform common tasks consistently.

## Cross-References

To ensure you have full context without creating circular dependencies, use these files as authoritative sources for their domains:

- **Global Rules**: `AGENTS.md` - For organization-wide AI governance, security, and coding principles.
- **Agent Implementations**: `agents/agent.md` - For the directory of all agent specifications.
- **Instruction Index**: `instructions/_index.instructions.md` - For a quick map of all instruction files.
- **Prompt Library**: `prompts/prompts.md` - For the master index of all reusable prompts.

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

## Community Health Assets (Shared vs Repository-Scoped)

- **Shared across the organisation:** discussion templates (`.github/DISCUSSION_TEMPLATE/`), saved replies (`.github/SAVED_REPLIES/`), issue templates (`.github/ISSUE_TEMPLATE/`), pull request templates (branch-specific) (`.github/PULL_REQUEST_TEMPLATE/`), default PR template (`.github/PULL_REQUEST_TEMPLATE.md`).
- **Repository-scoped only:** issue types (`.github/issue-types.yml`) and labels (`.github/labels.yml`) are defined per repository and are **not** shared organisation-wide.

For more details, see the README files in the `instructions` and `prompts` folders.

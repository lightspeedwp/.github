# LightSpeed Organisation `.github` Community Health Repository

> Central hub for all shared GitHub, Copilot, and workflow files across the LightSpeed WordPress organisation.

---

## Purpose & Overview

This repository’s `.github` folder serves as the **single source of truth** for all organisation-wide community health files, automation rules, standards, and AI/Copilot instructions for LightSpeed projects. By centralising these files, we ensure consistency, discoverability, and maintainability across every repo in the organisation.

**Key goals:**

- Standardise contribution, code quality, review, and labelling across all repos.
- Automate issue/PR labelling, project syncing, and governance.
- Provide a canonical set of instructions for AI agents & Copilot.
- Centralise saved replies, prompts, chatmodes, and reusable workflows.
- Enable fast onboarding and safe, scalable development.

See [GitHub: About organisation-wide community health files](https://github.blog/changelog/2019-02-21-organization-wide-community-health-files/) and [Creating a default community health file for your organization](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file) for more context.

### How Organisation-wide Health Files Work

Organizations can add community health files to a specially named `.github` repository, which then serves as the organisation-wide default for all repositories. You can include `CONTRIBUTING`, `SUPPORT`, `CODE_OF_CONDUCT`, `ISSUE_TEMPLATE(S)`, or `PULL_REQUEST_TEMPLATE(S)` files here. If a repository does not have its own version of a given file, the org-wide default from `.github` will be surfaced throughout developer workflows (e.g., when opening issues or PRs, or via the Community Profile), as if it were committed directly to that repo.

> While the file itself won’t appear in the file browser or Git history for each repository, it will be surfaced throughout developers’ workflows, such as when opening a new issue or when viewing the Community Profile, just as if it were committed to the repository directly.

---

## Labelling & Automation

This repository is the **canonical, organisation-wide source** for:

- **Labels** ([automation/labels.yml](./automation/labels.yml)): Official label names, colours, and descriptions.
- **Labeler Rules** ([automation/labeler.yml](./automation/labeler.yml)): Automation for applying labels based on file paths, branch names, or PR type.
- **Issue Types** ([automation/issue-types.yml](./automation/issue-types.yml)): Machine-readable definitions mapping issue templates, types, and automation.

**How it works:**

- Labels, labeler, and issue types from this repo are referenced by reusable workflows and automation across all LightSpeed repositories.
- If a repository does not have its own label or labeler config, the defaults from this repo apply.
- **Automated labelling** ensures consistent triage, prioritisation, and project management across the organisation.
- Maintainers should update labels and labeler rules _here_ to synchronise org-wide conventions.
- For more detail, see [AUTOMATION_GOVERNANCE.md](./automation/AUTOMATION_GOVERNANCE.md) and [ISSUE_LABELS.md](./automation/ISSUE_LABELS.md).

**Quick links:**

- [Label Definitions](./automation/labels.yml)
- [Labeler Rules](./automation/labeler.yml)
- [Issue Types](./automation/issue-types.yml)
- [Automation Governance](./automation/AUTOMATION_GOVERNANCE.md)

---

## Folder Structure

The `.github` folder is organised for maximum clarity and modularity, grouping related files for easy reference and automation.

```text
.github/
├── instructions/           # Coding, linting, template, pattern, and workflow instructions
│   ├── coding-standards.instructions.md
│   ├── linting.instructions.md
│   ├── html-template.instructions.md
│   ├── pattern-development.instructions.md
│   ├── php-block.instructions.md
│   ├── theme-json.instructions.md
│   └── ... (topic-specific instructions)
│
├── prompts/                # AI prompt templates (accessibility, code review, block patterns, etc.)
│   └── *.prompt.md
│
├── chatmodes/              # Chat mode indexes & usage guides for Copilot/agents
│   └── chatmodes.md
│
├── agents/                 # Agent specs and agentic workflow documentation
│   └── agent.md
│
├── workflows/              # Reusable GitHub Actions workflows
│   ├── labels-issues-prs.yml
│   ├── project-meta-sync.yml
│   └── ... (other workflows)
│
├── issue-templates/        # Issue templates for bugs, features, docs, tasks, etc.
│   └── *.md
│
├── pr-templates/           # Pull request templates (feature, fix, docs, etc.)
│   └── *.md
│
├── saved-replies/          # Canonical saved replies for support and triage
│   └── SAVED_REPLIES.md
│
├── automation/             # Labeler rules, automation governance, branching, etc.
│   ├── labeler.yml
│   ├── labels.yml
│   ├── issue-types.yml
│   ├── AUTOMATION_GOVERNANCE.md
│   ├── BRANCHING_STRATEGY.md
│   └── ... (automation reference files)
│
├── custom-instructions.md  # Org-wide Copilot and agent instructions
├── AGENTS.md               # Global agent rules and contribution principles
├── GEMINI.md               # Gemini agent guidance
├── CLAUDE.md               # Claude agent guidance
├── README.md               # This file: folder overview and usage
└── ... (other shared files)
```

---

## How It Works

- **Instructions**: The `instructions/` folder contains canonical, versioned standards for coding, linting, HTML templates, WordPress pattern development, PHP blocks, and theme configuration. Always reference these before starting work or reviewing code.
- **Prompts & Chat Modes**: Modular prompt templates and chat modes designed for Copilot, Gemini, Claude, and custom agents—enabling consistent AI-assisted workflows and reviews.
- **Agents**: Agent specs and rules (see `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`) detail expected behaviour, standards, and escalation procedures for all automated or AI contributors.
- **Workflows & Automation**: Includes reusable GitHub Actions workflows for labelling, project syncing, and more. The `automation/` folder covers label rules, branching, and governance files.
- **Templates**: Issue and PR templates standardise reporting, changelog, and review for all repos, supporting automation and reducing triage effort. Saved replies help maintainers respond consistently.
- **Custom Instructions**: The root-level `custom-instructions.md` and agent files define Copilot/AI behaviour org-wide, so all automated actions and suggestions follow LightSpeed rules.
- **Discoverability & Onboarding**: All files are indexed, referenced, and cross-linked for easy discoverability. New contributors can start in this folder and be directed to relevant standards, templates, or automation docs.

---

## Community & Q&A

Have questions, feedback, or want to propose an idea? Visit our [GitHub Discussions](https://github.com/orgs/lightspeedwp/discussions) for open conversation and community support.

---

## Contribution Guidelines & Instruction Index

For all contributors, please reference these key guidelines and indexes:

- [LightSpeed General Copilot Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/custom-instructions.md)
- [Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
- [HTML Templates](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/html-template.instructions.md)
- [Pattern Development](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/pattern-development.instructions.md)
- [PHP Block Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/php-block.instructions.md)
- [Theme JSON](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/theme-json.instructions.md)
- When generating a summary for pull requests, use this [pull request template](https://github.com/lightspeedwp/.github/blob/master/.github/PULL_REQUEST_TEMPLATE.md).

---

## For Contributors & Maintainers

- **Always start here** when onboarding, contributing, or reviewing.
- Reference **instructions** for standards, **templates** for issues/PRs, and **automation** docs for workflows and governance.
- Use **saved replies** for common support scenarios; update them as needed.
- For agent/Copilot questions, see the agent guides and custom instructions.
- Update this folder when org-wide standards, workflows, or automation rules change.

## VS Code Setup

To ensure a consistent development experience and code quality, all contributors should:

- Install all recommended extensions from `.vscode/extensions.json` (includes ESLint, Prettier, YAML, WordPress, PHP, AI, and GitHub workflow tools).
- Use the workspace settings in `.vscode/settings.json` for code style, linting, and workflow automation. These settings align with `.editorconfig` and enforce 2-space indentation for YAML, JS, CSS, and JSON, and 4-space tabs for PHP.
- Enable format-on-save and linting in your editor for best results.
- Periodically review and update your extensions to match evolving project standards.

Refer to `.vscode/extensions.json` and `.vscode/settings.json` for the authoritative list and configuration.

---

## VS Code Workspace Setup

To ensure a consistent and standards-driven development experience, this repository includes a dedicated [`.vscode/`](../.vscode/) folder with:

- **Recommended Extensions**: See [`extensions.json`](../.vscode/extensions.json) for AI, linting, WordPress, PHP, and GitHub workflow tools.
- **Workspace Settings**: See [`settings.json`](../.vscode/settings.json) for formatting, linting, and file association rules that align with org standards.
- **Predefined Tasks**: See [`tasks.json`](../.vscode/tasks.json) for running tests, linting, and E2E automation.
- **Debug & Automation**: Includes launch configs and Model Context Protocol (MCP) server integration for advanced automation and E2E testing.

> For a full overview, see [`.vscode/README.md`](../.vscode/README.md).

**All contributors should open the project in VS Code to automatically apply these settings and see extension recommendations.**

---

## Related Root-Level Organisation Files

These files typically reside in the root of the repository for visibility but are managed from this `.github` folder:

- [README.md](../README.md) — High-level overview of the organisation and community health repository.
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Full contribution guidelines (reference [.github/instructions/](./instructions/) for standards).
- [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) — Organisation code of conduct, aligned with WordPress community standards.
- [SECURITY.md](../SECURITY.md) — Security policy and responsible disclosure instructions.
- [SUPPORT.md](../SUPPORT.md) — Support policy and contact details.
- [GOVERNANCE.md](../GOVERNANCE.md) — Maintainer and contributor governance, responsibilities, and process.
- [CHANGELOG.md](../CHANGELOG.md) — Keep-a-Changelog format, linking to standards and change log instructions.
- [DEVELOPMENT.md](../DEVELOPMENT.md) — Developer setup, scripts, linting, and workflow guidance.

**Reference and update these root-level files as needed, but maintain canonical instructions, templates, and workflows in `.github/`.**

---

## Best Practices

- **Modularity**: Reuse files as much as possible across repos; avoid duplication.
- **Discoverability**: Cross-link instructions, templates, and automation docs.
- **Automation**: Use labeler, workflows, and governance rules for consistent triage and release.
- **Security & Accessibility**: Adhere to WordPress standards and OWASP top 10 in every template, instruction, and workflow.
- **AI/Copilot Enablement**: Leverage prompts, agent rules, and custom instructions to optimise AI-powered workflows safely.

---

## License

This repository and all its contents are licensed under the GNU General Public License v3.0 — see the [LICENSE](../LICENSE) file.

---

> For questions, improvement proposals, or onboarding support, open an issue, start a [Discussion](https://github.com/orgs/lightspeedwp/discussions), or contact [support@lightspeedwp.agency](mailto:support@lightspeedwp.agency).

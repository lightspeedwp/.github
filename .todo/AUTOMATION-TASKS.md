# Todo List

- [ ] Review and update all README files in attached folders
    - For each top-level attached folder (and all subfolders), review every README.md file. Add or update headers and footers with badges, and add relevant emojis to headings. Ensure style is consistent and engaging.

- [-] Lint/format all AI docs for compliance
    - Run markdownlint and Prettier on all AI docs in docs/ to ensure formatting and lint compliance. Fix any issues found.

- [-] Add/update footers and references for consistency
    - Ensure all AI docs have a consistent footer and references section, following project standards. Add or update as needed.

## 🗂️ LightSpeedWP Automation & Governance Workspace Overview

This workspace is designed for robust, agent-driven automation, unified labeling, and org-wide standards. Below is a summary of the setup and best practices for working with it.

## Key Points

### Centralized Standards

- `.github/` contains all org-wide automation, agent specs, instructions, and canonical config files.
- All member repos inherit from this repo for labels, issue types, templates, and workflows.

### Labeling & Issue/PR Management

- Unified labeling is handled by a single agent and workflow (`labeling.agent.js`, `labeling.yml`).
- Canonical label definitions: `labels.yml`
- File/branch-based label rules: `labeler.yml`
- Issue type mapping: `issue-types.yml`
- All label logic is agent-driven and config-based—no hardcoded rules.

### Testing & Linting

- Multiple npm and shell tasks for linting and testing (JS, CSS, Markdown, E2E, coverage).
- Jest for unit tests, Playwright for E2E, markdownlint/stylelint/eslint for linting.
- Test coverage is tracked and reported in CI.

### Documentation & Governance

- Extensive documentation in `docs/` and `schemas/`.
- All standards, instructions, and process docs are versioned and cross-referenced.
- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, and custom instructions files provide AI/agent guidance.

### Automation Governance

- `AUTOMATION_GOVERNANCE.md` is the single source of truth for automation, changelog, release, and labeling policies.
- All workflows are paired with canonical instruction files and agent specs.

### Naming & Structure

- Naming conventions are strictly enforced (see `naming-conventions.instructions.md`).
- All instruction, agent, and prompt files use YAML frontmatter for discoverability and automation.

---

## Best Practices

### Always Reference Canonical Files

- For any change to labels, issue types, or automation, update the YAML config files in `.github/`.
- Reference the relevant instruction/spec files for any workflow or agent you modify.

### Follow the Dual Reference System

- Use the `references` field in YAML frontmatter for AI/automation cross-links.
- Add human-readable reference sections at the end of docs for navigation.

### Keep Tests and Linting Up to Date

- Run all lint and test tasks before pushing changes.
- Expand test coverage for new scripts, agents, or automation logic.

### Document All Changes

- Update the `last_updated` and `version` fields in frontmatter when making changes.
- Document significant changes in commit messages and relevant markdown files.

### Use the Provided Tasks

- Use the npm and shell tasks for linting and testing (e.g., `npm run lint-js`, `npm run test-coverage`, `npx playwright test`).

### Automation-First

- All labeling, status, and type assignment is automated—manual intervention should be rare and documented.
- All workflows and agents must have reciprocal documentation/spec files.

### Accessibility, Security, and Performance

- All code and documentation must meet accessibility, security, and performance standards as outlined in the relevant instruction files.

### Onboarding & Contribution

- New contributors should start with `README.md`, `CONTRIBUTING.md`, and the documentation index (`DOCS.md`).
- All new automation or agent work should follow the agent and instruction templates.

---

## Quick Reference Links

- `AGENTS.md` — Global AI rules and agent directory
- `labels.yml` — Canonical label definitions
- `labeler.yml` — Labeler rules
- `issue-types.yml` — Issue type mapping
- `instructions` — All standards and instructions
- `agents` — All agent specs and code
- `AUTOMATION_GOVERNANCE.md` — Automation and release policy
- `DOCS.md` — Documentation index

---

If you have a specific task or change you want to make, let me know and I’ll guide you step-by-step according to these standards!

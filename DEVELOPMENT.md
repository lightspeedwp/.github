---
file_type: "documentation"
title: "Development Setup"
description: "Developer setup guide and repository contribution instructions for the LightSpeed community health repository"
version: "1.1"
last_updated: "2026-08-29"
owners: ["LightSpeed Team"]
tags: ["development", "setup", "installation", "contributing"]
references:
  - path: "CONTRIBUTING.md"
    description: "Full contribution guidelines"
  - path: "docs/LINTING.md"
    description: "Linting standards and troubleshooting"
  - path: ".github/projects/active/nodejs-upgrade-2026-q4/COMPLETION_REPORT.md"
    description: "Node.js 24 upgrade project completion report"
---

# Community Health Repository Setup

This document provides guidance for contributing to and maintaining this community health repository for the [LightSpeed](https://github.com/lightspeedwp/) organization.

## Prerequisites

- [Node.js](https://nodejs.org/) (v24 or later) — **Required as of 2026-08-29**
- [npm](https://www.npmjs.com/) (v10 or later) — **Required as of 2026-08-29**

> **Note:** This repository requires **Node.js 24** following the completion of the [Node.js 24 Upgrade Project](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/nodejs-upgrade-2026-q4/COMPLETION_REPORT.md) on 2026-08-29. All workflows and scripts are configured for Node.js 24 via `.nvmrc`. Using an older version may cause compatibility issues.

## Installation & Package Review

1. Clone the repository:

   ```bash
   git clone https://github.com/lightspeedwp/.github.git
   cd .github
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. **Review `package.json`:**
   Before getting started, check the `package.json` file to understand available scripts, dependencies, and tooling relevant to this repository.

## Linting and Code Quality

This repository provides linting tools for JavaScript, TypeScript, YAML, JSON, and
Markdown, run through Node scripts. The fast feedback path is Oxlint; the
authoritative JS/TS quality gate is ESLint; Prettier runs as a standalone
formatter (not as an ESLint rule).

- Fast lint (Oxlint, non-blocking):

  ```bash
  npm run lint:fast
  ```

- Lint JavaScript/TypeScript (ESLint, read-only):

  ```bash
  npm run lint:js
  ```

- Lint JavaScript/TypeScript (ESLint, auto-fix):

  ```bash
  npm run lint:js:fix
  ```

- Type-check (TypeScript):

  ```bash
  npm run typecheck
  ```

- Lint GitHub Actions workflows (actionlint):

  ```bash
  npm run lint:actionlint
  ```

- Run all linters (JS + YAML + package JSON, in parallel):

  ```bash
  npm run lint
  ```

- Check formatting (Prettier):

  ```bash
  npm run format:check
  ```

`npm run format:check` is repo-wide and informational: the repository carries a
large backlog of pre-existing formatting drift (626 files), so it is not
enforced as a required CI check. Format the files you touch with
`npm run format:js`, or let lint-staged do it at commit time.

`npm run lint:js` is read-only. Use `npm run lint:js:fix` to apply ESLint fixes
and the `format:*` scripts to apply Prettier formatting. ESLint runs with a
content-based cache (`.eslintcache`, gitignored) for fast repeat runs.

### TypeScript

`npm run typecheck` runs `tsc` against two real `tsconfig.json` files (strict,
`noEmit`, `skipLibCheck`):

- `tsconfig.json` — the repository's standalone TypeScript: the
  `packages/metadata-agent/types` definitions and `website/src/scripts`.
- `website/tsconfig.json` — the Astro website module (`website/src/lib`,
  `website/src/content.config.ts`). It adds `astro:content` and `marked`
  module shims (`website/src/env.d.ts`) so the module type-checks without the
  Astro toolchain installed.

## Git Hooks & Automation with Husky

This repository uses [Husky](https://typicode.github.io/husky/) to automate code quality checks via Git hooks. Husky runs automatically when you commit or push code, ensuring all changes meet quality standards before they're shared.

### How Husky Works

Husky is configured to run automatically when you install dependencies (`npm install`). Two Git hooks are configured:

1. **pre-commit**: Runs linting and formatting checks on staged files before each commit
2. **pre-push**: Validates the name of every branch being pushed

### Pre-commit Hook

The pre-commit hook uses [lint-staged](https://github.com/okonet/lint-staged) to run checks only on files you've staged for commit. This keeps the process fast and focused:

- **JavaScript/TypeScript files** (`*.{js,jsx,ts,tsx}`):
  - ESLint with auto-fix
  - Prettier formatting

- **Markdown files** (`*.{md,mdx}`):
  - Changed-line Markdownlint (only violations on lines the commit touches, via `scripts/validation/lint-md-staged.cjs`)
  - Prettier formatting

- **JSON files** (`*.json`):
  - Prettier formatting

- **YAML files** (`*.{yml,yaml}`):
  - Prettier formatting

If any checks fail, the commit will be blocked until you fix the issues.

### Pre-push Hook

The pre-push hook validates the **branch names** being pushed, not the test suite. Git feeds the hook one ref-update record per branch on standard input, and each pushed branch is checked against the repository's naming policy before the push is allowed:

```bash
node lib/hooks/pre-push
```

`docs/HUSKY_PRECOMMITS.md` documents the policy in full. Running the test suite locally before pushing is still worth doing, but it is not what this hook does — the full suite runs in CI, which is the gate that matters.

### Bypassing Hooks (Not Recommended)

In rare cases where you need to bypass hooks (e.g., work-in-progress commits), you can use:

```bash
git commit --no-verify -m "WIP: description"
git push --no-verify
```

**Note**: Bypassing hooks should be avoided in most cases, as it may introduce code quality issues or failing tests into the repository.

### Troubleshooting

If hooks aren't running:

1. Ensure dependencies are installed: `npm install`
2. Check that `.husky/` directory exists
3. Verify hooks are executable: `ls -la .husky/`
4. Re-initialize Husky: `npm run prepare`

## Agents & Shared Scripts

A `scripts/` folder is used to contain shared functions for agents.
Agents are written in JavaScript, and reusable logic or utilities should be placed here for maintainability and collaboration across the organization.

## Git Workflow

1. Create a feature branch for your work:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:

   ```bash
   git add .
   git commit -m "Your descriptive commit message"
   ```

3. Push your changes and create a pull request:

   ```bash
   git push origin feature/your-feature-name
   ```

4. Reference any related issues in your pull request description. Please use the [pull request template](https://github.com/lightspeedwp/.github/blob/master/.github/PULL_REQUEST_TEMPLATE.md) for summaries.

## Need Help?

- Check the repository documentation and README files
- Review the [GitHub Copilot custom instructions](./.github/custom-instructions.md)
- Use the prompt files in `.github/prompts/` for guidance

## Contributing and Code of Conduct

We welcome contributions! Please review our [Contributing Guidelines](https://github.com/lightspeedwp/.github/blob/HEAD/CONTRIBUTING.md) and [Code of Conduct](https://github.com/lightspeedwp/.github/blob/HEAD/CODE_OF_CONDUCT.md).

## License

This project is licensed under the GNU General Public License v3.0 — see the [LICENSE](LICENSE) file for details.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Reference

- [BRANCHING_STRATEGY.md](./docs/BRANCHING_STRATEGY.md): Org-wide branch naming, merge discipline, and automation mapping.
- [CHANGELOG.md](./CHANGELOG.md): Changelog format, release notes, and versioning.
- [CONTRIBUTING.md](./CONTRIBUTING.md): Contribution guidelines, templates, coding standards.
- [AUTOMATION_GOVERNANCE.md](docs/AUTOMATION_GOVERNANCE.md): Org-wide automation, branching, labeling, and release strategy.
- [Org-wide Issue Labels](docs/ISSUE_LABELS.md): Default labels and usage guidance.
- [Pull Request Labels](docs/PR_LABELS.md): PR classification labels and automation standards.
- [Canonical Issue Types YAML](.github/issue-types.yml): Machine-readable issue types for workflow and automation.
- [Canonical Label Definitions](.github/labels.yml): Label names, colours, and descriptions.
- [Automated Label Assignment Rules](.github/labeler.yml): Automation for applying labels based on file changes and branch patterns.

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

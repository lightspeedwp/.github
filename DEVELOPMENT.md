---
file_type: "documentation"
title: "Development Setup"
description: "Developer setup guide and repository contribution instructions for the LightSpeed community health repository"
version: "1.0"
last_updated: "2025-12-04"
owners: ["LightSpeed Team"]
tags: ["development", "setup", "installation", "contributing"]
references:
  - path: "CONTRIBUTING.md"
    description: "Full contribution guidelines"
  - path: "docs/LINTING.md"
    description: "Linting standards and troubleshooting"
---

# Community Health Repository Setup

This document provides guidance for contributing to and maintaining this community health repository for the [LightSpeed](https://github.com/lightspeedwp/) organization.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (v9 or later)

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

This repository provides linting tools for JavaScript, CSS, and other code standards, which can be run using Node scripts. These tools help maintain code quality and enforce organization standards.

- Lint JavaScript:

  ```bash
  npm run lint:js
  ```

- Lint CSS:

  ```bash
  npm run lint:css
  ```

- Run all linters:

  ```bash
  npm run lint
  ```

## Git Hooks & Automation with Husky

This repository uses [Husky](https://typicode.github.io/husky/) to automate code quality checks via Git hooks. Husky runs automatically when you commit or push code, ensuring all changes meet quality standards before they're shared.

### How Husky Works

Husky is configured to run automatically when you install dependencies (`npm install`). Two Git hooks are configured:

1. **pre-commit**: Runs linting and formatting checks on staged files before each commit
2. **pre-push**: Runs the full test suite before pushing to remote

### Pre-commit Hook

The pre-commit hook uses [lint-staged](https://github.com/okonet/lint-staged) to run checks only on files you've staged for commit. This keeps the process fast and focused:

- **JavaScript/TypeScript files** (`*.{js,jsx,ts,tsx}`):
  - ESLint with auto-fix
  - Prettier formatting

- **Markdown files** (`*.{md,mdx}`):
  - Markdownlint with auto-fix
  - Prettier formatting

- **JSON files** (`*.json`):
  - Prettier formatting

- **YAML files** (`*.{yml,yaml}`):
  - Prettier formatting

If any checks fail, the commit will be blocked until you fix the issues.

### Pre-push Hook

The pre-push hook runs the full test suite before allowing a push to the remote repository:

```bash
npm test
```

This ensures that all tests pass before code is shared with the team.

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

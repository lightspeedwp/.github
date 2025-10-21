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

We welcome contributions! Please review our [Contributing Guidelines](https://github.com/lightspeedwp/.github/blob/master/.github/CONTRIBUTING.md) and [Code of Conduct](https://github.com/lightspeedwp/.github/blob/master/.github/CODE_OF_CONDUCT.md).

## License

This project is licensed under the GNU General Public License v3.0 — see the [LICENSE](LICENSE) file for details.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Reference

- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md): Org-wide branch naming, merge discipline, and automation mapping.
- [CHANGELOG.md](../CHANGELOG.md): Changelog format, release notes, and versioning.
- [CONTRIBUTING.md](../CONTRIBUTING.md): Contribution guidelines, templates, coding standards.
- [AUTOMATION_GOVERNANCE.md](./AUTOMATION_GOVERNANCE.md): Org-wide automation, branching, labeling, and release strategy.
- [Org-wide Issue Labels](./ISSUE_LABELS.md): Default labels and usage guidance.
- [Pull Request Labels](./PR_LABELS.md): PR classification labels and automation standards.
- [Canonical Issue Types YAML](./issue-types.yml): Machine-readable issue types for workflow and automation.
- [Canonical Label Definitions](./labels.yml): Label names, colours, and descriptions.
- [Automated Label Assignment Rules](./labeler.yml): Automation for applying labels based on file changes and branch patterns.

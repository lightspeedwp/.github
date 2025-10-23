# LightSpeed Community Health & Automation Repository

[![Test Coverage](https://img.shields.io/badge/coverage-auto-blue)](./tests/TEST_COVERAGE_SUMMARY.md)

This repository is the **central hub** for the LightSpeed organization’s community health files, automation standards, label and issue type management, governance documentation, and org-wide resources on GitHub usage and contribution. All member repositories reference and inherit canonical files, workflows, and instructions from here—making it the backbone for consistency, quality, and automated project management across LightSpeed.

This repository is the **central hub** for the LightSpeed organization’s community health files, automation standards, label and issue type management, governance documentation, and org-wide resources on GitHub usage and contribution. All member repositories reference and inherit canonical files, workflows, and instructions from here—making it the backbone for consistency, quality, and automated project management across LightSpeed.

For a unified, always-up-to-date index of all documentation, see [DOCS.md](./DOCS.md).

## Overview

## Local Linting & Testing

To ensure code quality and consistency, run the following scripts locally before pushing changes:

---

## Test Coverage & Reporting

- Test coverage is tracked for all automation, scripts, and agents.
- See the [Test Coverage Summary](./tests/TEST_COVERAGE_SUMMARY.md) for up-to-date results.
- Coverage is reported in CI and should be reviewed for all PRs.
- Contributors are encouraged to expand tests for new scripts and automation logic.

> For more, see [Testing Standards](.github/instructions/tests.instructions.md) and [DOCS.md](./DOCS.md).

### Linting

- `npm run lint` – Run all core linters (JS, CSS, YAML, package.json)
- `npm run lint:all` – Run all linters, including workflows and markdown
- `npm run lint:js` – Lint JavaScript/TypeScript
- `npm run lint:css` – Lint CSS/SCSS
- `npm run lint:yaml` – Lint YAML files
- `npm run lint:md` – Lint Markdown files
- `npm run lint:pkg-json` – Lint package.json

### Testing

- `npm test` – Run all JavaScript/TypeScript tests (Jest)
- `npm run test:js` – Run JS/TS tests with coverage

> For more, see the [DOCS.md](./DOCS.md) index and [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Updating Linting Rules & Troubleshooting

To update or add new linting rules:

1. Edit the relevant config file (e.g., `.eslintrc.json`, `.stylelintrc`, `.markdownlint.json`, `.spectral.yaml`).
2. For new file types or standards, add a new instruction file in `.github/instructions/linting/` following the [linting instructions index](.github/instructions/linting.instructions.md).
3. Update the `lint` or `lint:all` scripts in `package.json` if you add new tools.
4. Test your changes locally with `npm run lint:all`.
5. Document any new rules or changes in the relevant instruction file and in the commit message.

**Troubleshooting common lint failures:**

- Run `npm run lint:all` to see all errors.
- Check the output for the specific linter (eslint, stylelint, markdownlint, spectral, etc.).
- Review the relevant config file for rule details.
- For YAML or workflow errors, check indentation and schema references.
- For shell scripts, use `shellcheck` and ensure POSIX compatibility.
- For persistent issues, see the [Linting Instructions](.github/instructions/linting.instructions.md) for detailed guidance and file-type-specific help.

If you are stuck, ask in the repository discussions or open an issue with the error output and config details.

GitHub supports [organization-wide community health files](https://github.blog/changelog/2019-02-21-organization-wide-community-health-files/) in a specially named `.github` repository to serve as organization-wide defaults for all repositories within their organization. Where sensible, custom community health files should be created for our repos, but that's not always necessary or practical.

The following are the default `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `ISSUE_TEMPLATES`, and `PULL_REQUEST_TEMPLATE.md` files for LightSpeed repositories that do not have custom ones themselves. Note that these default files won’t appear in the file browser or Git history for each repository, but they will be surfaced throughout developers’ workflows, such as when opening a new issue or when viewing the Community Profile, just as if it were committed to the repository directly.

## Purpose & Role

- **Canonical Source:** This repository contains the authoritative versions of all organizational health files, label definitions, issue/pr templates, saved replies, and automation workflows. All other LightSpeed repositories should reference and/or reuse resources from here.
- **Single Storage Area for Org Instructions:** Contribution, support, governance, and automation instructions are stored here and referenced across all projects.
- **Automation Strategy:** Key automation components like `labels.yml` and `issue-types.yml` are maintained here—these files are integral to our workflow automation, ensuring issues and PRs are triaged, labeled, and tracked consistently across the organization.
- **Org-wide Documentation:** We are building a comprehensive set of resources on GitHub usage and project standards, with all documentation centralized in this repository.
- **Agents & AI:** Agents for managing issue labels, types, and PR labels will be added to this repository. Org-wide defaults for these agents are defined here, together with governance and automation documentation.
- **Governance:** Policies on branching, automation, and contribution are maintained here to ensure consistent practices and oversight.

---

## Key Resources & Canonical Files

### Contributing & Support Guidelines

- [CONTRIBUTING.md (Canonical)](https://github.com/lightspeedwp/.github/blob/develop/CONTRIBUTING.md) – Referenced across all repos.
- [SUPPORT.md](https://github.com/lightspeedwp/.github/blob/develop/SUPPORT.md) – Org-wide support standards.

### Labels & Labeler Configuration

- [labels.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml) – **Canonical label definitions** for all issues and PRs.
- [labeler.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/labeler.yml) – Automated file/branch-based label application.
- [ISSUE_LABELS.md](https://github.com/lightspeedwp/.github/blob/develop/.github/ISSUE_LABELS.md) – Issue label documentation.
- [PR_LABELS.md](https://github.com/lightspeedwp/.github/blob/develop/.github/PR_LABELS.md) – PR label documentation.

### Issue Types & Templates

- [issue-types.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/issue-types.yml) – **Canonical issue types** for automation and triage.
- [ISSUE_TYPES.md](https://github.com/lightspeedwp/.github/blob/develop/.github/ISSUE_TYPES.md) – Issue type documentation.
- [Saved replies for issues](https://github.com/lightspeedwp/.github/blob/develop/.github/SAVED_REPLIES.md)
- [Bug report saved reply](https://github.com/lightspeedwp/.github/blob/develop/.github/SAVED_REPLIES/issues/bug-reports.md)
- [Issue templates directory](https://github.com/lightspeedwp/.github/tree/develop/.github/ISSUE_TEMPLATES)

### Pull Request Templates

- [PR templates directory](https://github.com/lightspeedwp/.github/tree/develop/.github/PULL_REQUEST_TEMPLATES)
- [PR_LABELS.md](https://github.com/lightspeedwp/.github/blob/develop/.github/PR_LABELS.md)
- [Pull Request Template (main)](https://github.com/lightspeedwp/.github/blob/master/.github/PULL_REQUEST_TEMPLATE.md)

### Workflows & Automation

- `.github/workflows/labels-issues-prs.yml` – Automated labeling for issues/PRs.
- `.github/workflows/project-meta-sync.yml` – Syncs issues/PRs with Projects (Beta) and fields.
- [AUTOMATION_GOVERNANCE.md](https://github.com/lightspeedwp/.github/blob/develop/.github/AUTOMATION_GOVERNANCE.md) – Orchestrates how automation is governed org-wide.

### Governance Documentation

- [BRANCHING_STRATEGY.md](https://github.com/lightspeedwp/.github/blob/develop/.github/BRANCHING_STRATEGY.md) – Defines branch protection and workflow.
- [AUTOMATION_GOVERNANCE.md](https://github.com/lightspeedwp/.github/blob/develop/.github/AUTOMATION_GOVERNANCE.md) – Automation standards and governance.

### Org-wide Instructions & AI Files

- [General Instructions](https://github.com/lightspeedwp/.github/blob/develop/.github/custom-instructions.md)
- [Chat modes](https://github.com/lightspeedwp/.github/blob/develop/.github/chatmodes/chatmodes.md)
- [Prompt templates](https://github.com/lightspeedwp/.github/blob/develop/.github/prompts/prompts.md)
- [Agent instructions](https://github.com/lightspeedwp/.github/blob/develop/.github/agents/agent.md)
- [AGENTS.md](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md)
- [GEMINI.md](https://github.com/lightspeedwp/.github/blob/develop/GEMINI.md)
- [CLAUDE.md](https://github.com/lightspeedwp/.github/blob/develop/CLAUDE.md)

### Coding & Contribution Guidelines

- [Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)
- [HTML Templates](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/html-template.instructions.md)
- [Pattern Development](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/pattern-development.instructions.md)
- [PHP Block Instructions](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/php-block.instructions.md)
- [Theme JSON](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/theme-json.instructions.md)

---

## Automation & Agents Strategy

This repository will include and orchestrate org-wide agents for managing issue labels, issue types, and PR labels. The **default rules and mappings** for these agents are defined here—ensuring that new repositories or projects instantly inherit standardized automation, labeling, and triage procedures.

- **Agents:** Configurations, prompts, and agent instructions live here.
- **Integration:** All project boards and workflows reference canonical files here for automated syncing and status tracking.
- **Governance:** [AUTOMATION_GOVERNANCE.md](https://github.com/lightspeedwp/.github/blob/develop/.github/AUTOMATION_GOVERNANCE.md) details how agents and workflows are managed, updated, and rolled out org-wide.

---

## Documentation & Knowledge Resources

All organizational documentation—including contribution guidelines, support procedures, governance, GitHub usage tips, and more—is **centralized in this repository**. As our documentation grows, this is the authoritative source for LightSpeed team members and contributors.

All organizational documentation—including contribution guidelines, support procedures, governance, GitHub usage tips, and more—is **centralized in this repository**. As our documentation grows, this is the authoritative source for LightSpeed team members and contributors.

See [DOCS.md](./DOCS.md) for a full documentation index and quick links to all health, automation, and configuration docs.

- **GitHub Usage:** We are building up resources and best practices for effective use of GitHub and project automation.
- **Specialized Docs:** Even as we add specific documentation repositories, this remains the main storage and reference point for org-level docs.

---

## Referencing This Repository

All LightSpeed repositories should:

- Reference this repository for issue/PR templates, label and issue type configuration, and automation workflows.
- Link to contribution and support guidelines found here.
- Use the canonical `.github/labels.yml`, `.github/labeler.yml`, and `.github/issue-types.yml` for automation.
- Adopt governance and coding standards maintained here.

---

## Troubleshooting & Adoption

- **Labels/Types not applied:** Confirm your repo references `.github/labels.yml` and `.github/issue-types.yml` here.
- **Templates missing:** Ensure your repo points to `.github` for templates, or copies them from this repo.
- **Automation issues:** Reference [AUTOMATION_GOVERNANCE.md](https://github.com/lightspeedwp/.github/blob/develop/.github/AUTOMATION_GOVERNANCE.md) for setup and troubleshooting.
- For any org-wide questions, open an issue or discussion in this repository.

---

## Quick Links

- [Contributing Guidelines](https://github.com/lightspeedwp/.github/blob/develop/CONTRIBUTING.md)
- [Support](https://github.com/lightspeedwp/.github/blob/develop/SUPPORT.md)
- [Canonical Labels](https://github.com/lightspeedwp/.github/blob/develop/.github/labels.yml)
- [Canonical Issue Types](https://github.com/lightspeedwp/.github/blob/develop/.github/issue-types.yml)
- [Governance](https://github.com/lightspeedwp/.github/blob/develop/.github/AUTOMATION_GOVERNANCE.md)
- [General Instructions](https://github.com/lightspeedwp/.github/blob/develop/.github/custom-instructions.md)

- [Documentation Index (DOCS.md)](./DOCS.md)

---

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Like what you see?

[![Work with us at LightSpeed](https://www.lsdev.biz/wp-content/uploads/2020/02/work-with-lightspeed.png)](https://www.lsdev.biz/contact/)

---

**This repository is managed by the LightSpeed team. All organizational automation, policy, and documentation updates are maintained here.**

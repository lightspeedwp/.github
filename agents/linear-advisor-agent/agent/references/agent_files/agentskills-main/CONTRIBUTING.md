# Contributing to Agent Skills

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Thank you for your interest in contributing to Agent Skills! This document explains how to contribute and where different types of feedback belong.

## Types of Contributions

### Documentation Improvements

We welcome improvements to the [documentation site](https://agentskills.io) — typo fixes, clarity improvements, better examples, and new guides. Documentation lives in the `docs/` directory.

### Bug Reports

Found a bug in the spec, documentation, or reference library? [Open an issue](https://github.com/agentskills/agentskills/issues).

### Proposals, Questions, and Feedback

Have a feature request, spec design question, or general feedback? [Start a discussion](https://github.com/agentskills/agentskills/discussions). We use Discussions for proposals and open-ended conversation, and reserve Issues for concrete bugs and problems.

Proposals should address real implementation challenges you've encountered, not theoretical concerns. Show us the problem you faced and how your proposal addresses it.

We maintain a high bar for additions to the spec — it is much easier to add things to a specification than to remove them. Every new feature adds complexity that all implementers must understand and support. When in doubt, leave it out.

> [!NOTE]
> **Not sure where to post?** Default to [Discussions](https://github.com/agentskills/agentskills/discussions). If it turns out to be a bug, we'll convert it to an issue.

### Ecosystem Listings & Logo Requests

If your product or platform has implemented Agent Skills compatibility, you can request to be listed on [agentskills.io](https://agentskills.io). Your product must be publicly available and able to discover and execute skills today — we do not list products that have only announced intent to support Skills or are still in private beta.

Submit a pull request with:

1. **Logo files** — SVG preferred; PNG acceptable (min 200×200px). Provide light and dark variants and follow the existing format in `docs/images/logos/`.
2. **A client entry** — Add your product to the array in [`docs/snippets/clients.jsx`](docs/snippets/clients.jsx).
3. **Product information** — In your PR description, include your product name, a link to your product, and a link to documentation showing your Skills implementation.

We may ask for a demo or screenshot to verify the implementation. Logo requests are reviewed by the Anthropic team.

### Reference Library (`skills-ref/`)

We're still determining the direction for the reference library and are not accepting code contributions to it at this time. Bug reports and feedback are still welcome via [Issues](https://github.com/agentskills/agentskills/issues) and [Discussions](https://github.com/agentskills/agentskills/discussions), respectively.

### What We're Not Accepting (Yet)

To keep the project focused during this early stage, we are currently not accepting:

- **Skill submissions** — We don't maintain a directory of community skills. This may change in the future.
- **Major architectural changes** — We're still iterating on the core specification. Large-scale redesigns are premature.

If you're unsure whether your contribution fits, open a [Discussion](https://github.com/agentskills/agentskills/discussions) before investing significant effort.

## Development Setup

### Documentation Site

The docs site is built with [Mintlify](https://mintlify.com/).

```bash
# Install Mintlify CLI
npm i -g mint

# Run local dev server from the docs/ directory
cd docs && mint dev
```

Local preview will be available at `http://localhost:3000`.

## Submitting Changes

1. [Fork the repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)
2. Create a branch for your changes
3. Make your changes and verify they work locally
4. Submit a pull request

Keep PRs focused on one logical change and link any related issues.

## AI Contributions

> [!IMPORTANT]
> If you are using **any kind of AI assistance** to contribute to Agent Skills, it must be disclosed in the pull request or issue.

We welcome and encourage the use of AI tools to help improve Agent Skills. Many valuable contributions have been enhanced with AI assistance for code generation, issue detection, and documentation.

That being said, if you are using any kind of AI assistance (e.g., agents such as Claude Code, ChatGPT) while contributing to Agent Skills, **this must be disclosed in the pull request or issue**, along with the extent to which AI assistance was used (e.g., documentation comments vs. code generation).

If your PR responses or comments are being generated by an AI, disclose that as well.

As an exception, trivial spacing or typo fixes don't need to be disclosed.

An example disclosure:

> This PR was written primarily by Claude Code.

Or a more detailed disclosure:

> I consulted ChatGPT to understand the codebase but the solution was fully authored manually by myself.

Failure to disclose AI assistance is first and foremost rude to the human reviewers on the other end of the pull request, but it also makes it difficult to determine how much scrutiny to apply to the contribution.

### What we're looking for

When submitting AI-assisted contributions, please ensure they include:

- **Clear disclosure of AI use** — Be transparent about AI use and the degree to which you used it
- **Human understanding** — You personally understand what the changes do
- **Clear rationale** — You can explain why the change is needed and how it fits within Agent Skills goals
- **Concrete evidence** — Include test cases, scenarios, or examples that demonstrate the improvement

### What we'll close

We reserve the right to close submissions that appear to not follow the disclosure policy.

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE) for code and specification files, and [CC-BY 4.0](docs/LICENSE) for documentation.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

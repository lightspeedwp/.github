---
title: "Getting Started & Developer Onboarding Slide Deck Prompt"
description: "NotebookLM and design prompt for new contributor onboarding"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Getting Started & Developer Onboarding Slide Deck Prompt

## System Overview

The **Getting Started & Onboarding System** provides a structured path for new contributors to understand the .github repository ecosystem, set up their local development environment, and make their first contribution. It covers prerequisites, setup steps, testing workflow, and contribution patterns.

**Operational scope**: New contributor experience, environment setup, onboarding workflows, documentation discovery, first contribution path.

**Owned by**: LightSpeed ops & developer relations teams

## Key Components

1. **Prerequisite Knowledge** - Required tools and understanding
2. **Local Setup Guide** - Environment configuration and dependencies
3. **Project Structure Tour** - Repository layout and key directories
4. **Running Tests Locally** - Jest testing, CI simulation
5. **Development Workflow** - Making changes, running agents locally
6. **First Contribution Path** - Common first-time contributions
7. **Getting Help** - Support resources and community channels

## Integration Points

- **README.md**: Primary entry point for onboarding
- **CONTRIBUTING.md**: Detailed contribution guidelines
- **DEVELOPMENT.md**: Technical setup and development guide
- **Getting Help documentation**: Support channels and resources
- **Issue Templates**: Structured guidance for issue/PR creation

## Use Cases & Examples

### Use Case 1: New Developer First Week

Junior developer joining LightSpeed; complete onboarding in first week.

**Onboarding flow:**

1. Clone repository, read README
2. Run `npm install` and verify dependencies
3. Run `npm test` to verify test suite locally
4. Read DEVELOPMENT.md to understand project structure
5. Explore `.github/scripts/agents/` to see agent implementations
6. Look at recent PRs to understand contribution patterns
7. Find small "good-first-issue" labeled ticket
8. Create feature branch, make changes, run tests
9. Submit PR with descriptive message
10. Receives feedback, iterates, PR merges
11. First contribution complete!

### Use Case 2: Open Source Contributor First PR

External contributor wants to help; needs self-service onboarding.

**Contributor flow:**

1. Clicks "fork" on GitHub
2. Follows Getting Started guide in README
3. Sets up local environment using DEVELOPMENT.md
4. Finds issue labeled "good-first-issue"
5. Comments "I'd like to work on this"
6. Maintainer replies with guidance
7. Contributor creates PR with changes
8. CI runs automatically (tests, linting, security checks)
9. Reviewer provides feedback
10. Contributor iterates
11. PR merged, contributor sees their code live

### Use Case 3: Onboarding Specialist Review

Manager reviews onboarding experience; identifies friction points.

**Review flow:**

1. Watches 3 new developers complete onboarding
2. Tracks pain points: setup took 2 hours, tests failed initially
3. Identifies gaps: missing step for Windows developers
4. Updates DEVELOPMENT.md with Windows-specific section
5. Tests with new Windows developer
6. Onboarding time drops to 30 minutes

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: New contributors struggle with onboarding; barriers to entry prevent community growth
- Stakes: Lost contributors, slow team ramp-up, duplicated support effort

**Slide 02** - Onboarding Experience Overview

- Clear entry point (README with Quick Start)
- Complete setup guide (DEVELOPMENT.md)
- Project structure tour (key directories explained)
- Development workflow (local testing, CI simulation)
- Getting help resources (support channels)

**Slide 03** - Prerequisites & System Requirements

- **Node.js**: Minimum version (18.x+) and why
- **npm/yarn**: Package manager version
- **Git**: Version control basics
- **GitHub**: Account and SSH key setup
- **Editor**: Recommended IDEs/editors
- **OS**: Supported platforms (Windows, macOS, Linux)

**Slide 04** - Quick Start (5 Minutes)

- Clone repository: `git clone https://github.com/lightspeedwp/.github.git`
- Install dependencies: `npm install`
- Run tests: `npm test`
- Verify setup: `npm run scripts:validate`
- Start exploring!

**Slide 05** - Local Development Setup

- **Node environment**: Installing Node.js and npm
- **Dependencies**: `npm install` and lock file management
- **IDE setup**: Configuring VS Code, WebStorm, etc.
- **Git configuration**: Commit signing, author setup
- **Pre-commit hooks**: Automated validation before commit

**Slide 06** - Project Structure Tour

- `.github/` - Agents, scripts, workflows, plugins
  - `agents/` - 7 agent implementations
  - `scripts/` - Shared utilities and automation
  - `plugins/` - Domain-specific extensions
  - `workflows/` - GitHub Actions workflows
  - `hooks/` - Guardrails and validation
- `docs/` - Documentation and guides
- `__tests__/` - Test suites
- `config/` - Configuration files

**Slide 07** - Understanding the Agents

- **Release Agent**: Manages versioning and releases
- **Branding Agent**: Applies metadata and governance
- **Meta Agent**: Collects metrics and reports health
- **Reviewer Agent**: Performs code review
- **Linting Agent**: Validates code quality
- **Labelling Agent**: Categorizes and routes issues
- **Planner Agent**: Capacity and release planning

**Slide 08** - Running Tests Locally

- **Jest test suite**: `npm test` runs all tests
- **Watch mode**: `npm test -- --watch` for development
- **Coverage**: `npm test -- --coverage` shows coverage report
- **Single file**: `npm test testfile.js` runs one test file
- **Debugging**: `node --inspect-brk ./node_modules/.bin/jest --runInBand`
- **CI simulation**: GitHub Actions runs same tests

**Slide 09** - Development Workflow

- **Create feature branch**: `git checkout -b feature/my-feature`
- **Make changes**: Edit code, tests, documentation
- **Run tests**: `npm test` to verify quality
- **Run linting**: `npm run lint` to check code style
- **Commit changes**: `git commit -m "description"`
- **Push branch**: `git push origin feature/my-feature`
- **Create PR**: GitHub prompts for PR creation

**Slide 10** - Common First Contributions

- **Documentation improvements**: Typos, clarification, examples
- **Test additions**: New test cases for existing code
- **Small bugfixes**: Issues labeled "good-first-issue"
- **Example: Fixing typo in DEVELOPMENT.md**
  1. Create branch: `git checkout -b fix/typo-in-dev-guide`
  2. Edit file: Fix the typo
  3. Test: `npm test` (no test failures)
  4. Commit: `git commit -m "fix: correct typo in DEVELOPMENT.md"`
  5. Push: `git push origin fix/typo-in-dev-guide`
  6. PR: Create and receive feedback
  7. Merge: PR merged, change live

**Slide 11** - Getting Help & Support

- **Issues**: Ask questions in GitHub Discussions or Issues
- **Discord/Slack**: Real-time chat with team (if available)
- **Documentation**: Check DEVELOPMENT.md, CONTRIBUTING.md first
- **Code examples**: Look at similar code or tests for patterns
- **PR reviews**: Reviewer feedback helps you learn
- **Community**: Other contributors in discussions

**Slide 12** - Pull Request Best Practices

- **Title**: Clear, concise description of change
- **Description**: Explain what, why, and how
- **Tests**: Add tests for new functionality
- **Coverage**: Ensure new code is tested
- **Review comments**: Respond to feedback respectfully
- **Iteration**: Update PR based on feedback
- **Wait for CI**: Ensure all checks pass before merge

**Slide 13** - Code Style & Standards

- **Naming conventions**: camelCase for variables, PascalCase for classes
- **Comments**: Only explain WHY, not WHAT
- **Tests**: Write tests alongside code
- **Coverage**: Aim for > 80% code coverage
- **Linting**: `npm run lint` must pass
- **Formatting**: Auto-formatting via Prettier

**Slide 14** - Troubleshooting Common Issues

- **npm install fails**: Clear cache with `npm ci`, check Node version
- **Tests fail locally**: Verify Node version matches CI
- **Lint errors**: Run `npm run lint -- --fix` to auto-fix
- **Git conflicts**: Use GitHub UI or `git merge` to resolve
- **Pre-commit hook fails**: Check what it's validating, fix before commit

**Slide 15** - Close & Next Actions

- Onboarding provides clear path to first contribution
- Contribute: Your first PR starts here!
- Questions & feedback

## Evidence Anchors

- `.github/README.md` - Repository README and quick start
- `.github/CONTRIBUTING.md` - Contribution guidelines
- `.github/DEVELOPMENT.md` - Development setup guide
- `.github/.github/ISSUE_TEMPLATE/` - Issue templates
- `.github/.github/PULL_REQUEST_TEMPLATE.md` - PR template
- `.github/GETTING_HELP.md` - Support channels

## Design Notes

- **Visual theme**: Welcoming and inclusive (friendly tone, step-by-step visuals, encouraging messaging)
- **Color palette**: Use welcoming colors (greens for success, blues for information)
- **Key visuals**: Setup flow diagram, project structure tree, first PR checklist, support channels diagram
- **Accessibility**: Clear step-by-step numbered lists, high contrast for code examples
- **Animations**: Consider step reveal, progress indicator, success celebration

## Quality Bar

- Include actual commands from repository
- Show real example PR (anonymized if needed)
- Include actual first-issue examples
- Validate setup steps against current environment
- Show typical troubleshooting scenarios
- Ensure all links point to current develop branch

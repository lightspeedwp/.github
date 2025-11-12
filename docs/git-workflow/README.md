---
title: 'Git Workflow Documentation'
description: 'Git workflow guides, branching strategies, and version control best practices for LightSpeed'
version: '1.0'
last_updated: '2025-11-12'
maintainer: 'LightSpeed Team'
tags: ['git', 'workflow', 'branching', 'version-control', 'agile']
---

# Git Workflow Documentation

This directory contains comprehensive Git workflow documentation, branching strategies, and version control best practices for LightSpeed projects.

## Purpose

Provides standardized Git workflows and branching strategies to ensure:

- Consistent version control practices across all LightSpeed projects
- Clear branch naming conventions and merge discipline
- Integration with agile project management and automation
- Efficient fork synchronization and upstream management

## Contents

### Core Documentation Files

- **agile-project-management-guide-v1.md** – Agile methodologies integrated with Git workflows
- **git-org-wide-branching-strategy.md** – Organization-wide branching conventions and rules
- **git-org-wide-defaults-v1-3.md** – Default Git configurations for LightSpeed projects
- **git-selective-fork-sync-v1.md** – Guide for selective synchronization of forked repositories
- **git-workflow-playbook-v1-2.md** – Comprehensive Git workflow playbook with examples
- **org-wide-branching-strategy-v1-1.md** – Canonical branching strategy documentation
- **org-wide-issue-types-v1-11.md** – Issue type mapping to branch prefixes
- **org-wide-labels-v1-13.md** – Label taxonomy and workflow integration
- **org-wide-labels-v1-14.md** – Updated label definitions
- **pr-workflow-guide-v1-1.md** – Pull request workflow best practices

## Inputs

- Development branches following naming conventions
- Feature development, bug fixes, and hotfixes
- Pull requests mapped to issue types

## Outputs

- Clean, maintainable Git history
- Automated branch-to-label mapping
- Consistent merge and release processes
- Efficient collaboration across distributed teams

## Usage Examples

### Example 1: Feature Branch Workflow

```bash
# Create feature branch
git checkout -b feat/user-authentication

# Work on feature with descriptive commits
git commit -m "feat(auth): add user login form"

# Push and create PR
git push -u origin feat/user-authentication
```

### Example 2: Hotfix Workflow

```bash
# Create hotfix branch from main
git checkout -b hotfix/critical-security-patch main

# Apply fix
git commit -m "fix(security): patch XSS vulnerability"

# Push and create urgent PR
git push -u origin hotfix/critical-security-patch
```

### Example 3: Selective Fork Sync

```bash
# Sync specific branches from upstream
git remote add upstream https://github.com/lightspeedwp/repo.git
git fetch upstream
git checkout -b sync/upstream-feature upstream/feature-branch
```

## Branch Naming Conventions

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feat/` | New features | `feat/cart-checkout-flow` |
| `fix/` | Bug fixes | `fix/wp6-6-compatibility` |
| `hotfix/` | Urgent production fixes | `hotfix/critical-security-patch` |
| `docs/` | Documentation updates | `docs/readme-installation` |
| `chore/` | Maintenance tasks | `chore/deps-update-2025` |
| `refactor/` | Code refactoring | `refactor/user-service-cleanup` |

See [git-org-wide-branching-strategy.md](./git-org-wide-branching-strategy.md) for complete conventions.

## Related Documentation

- [Branching Strategy](../../.github/automation/BRANCHING_STRATEGY.md) – Org-wide branching rules
- [Automation Governance](../../.github/automation/AUTOMATION_GOVERNANCE.md) – Automated workflow integration
- [PR Workflow Guide](./pr-workflow-guide-v1-1.md) – Pull request best practices
- [Contributing Guidelines](../../CONTRIBUTING.md) – Contribution workflow

---

**Maintained by LightSpeed Team** • For updates or questions, see [CONTRIBUTING.md](../../CONTRIBUTING.md)

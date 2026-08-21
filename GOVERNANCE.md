---
file_type: documentation
title: Governance
description: Maintainer and contributor roles, responsibilities, and decision-making processes for LightSpeed community health repository
version: '1.1'
last_updated: '2026-08-21'
owners:
  - LightSpeed Maintainers
tags:
  - governance
  - maintainers
  - contributors
  - decision-making
  - roles
---

# LightSpeed Community Health Repo Governance

Defines maintainer/contributor roles and decision making.
See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Overview

This document explains how the LightSpeed community health repository is governed. It describes project roles, responsibilities, decision-making processes, and references key organisational standards and policies. The goal is to ensure a transparent, inclusive, and maintainable project.

## Maintainers

| Name             | GitHub Username | Profile URL                                   |
| ---------------- | --------------- | --------------------------------------------- |
| Ash Shaw         | @ashleyshaw     | [ashleyshaw](https://github.com/ashleyshaw)   |
| Warwick Booth    | @krugazul       | [krugazul](https://github.com/krugazul)       |
| Chris Vancoillie | @eleshar        | [eleshar](https://github.com/eleshar)         |
| Zared Rogers     | @ZaredRogers    | [ZaredRogers](https://github.com/ZaredRogers) |

## Decision Making

- **Routine:** Maintainers review and merge PRs.
- **Major:** Consensus among maintainers.

## Roles & Responsibilities

### Responsibilities

- Triage issues and pull requests
- Review, merge, and release features and fixes
- Ensure code quality, security, and documentation standards
- Manage repo configuration and CI/CD
- Promote contributors to maintainers
- Update governance, automation, and workflow documents

### Promotion criteria

Contributors may be promoted to maintainer after a significant number of high-quality PRs, consistent engagement, and demonstration of LightSpeed standards. Promotion is at the discretion of existing maintainers.

### Contributors

- Anyone submitting code, content, or participating via issues or PRs.
- Can triage issues and PRs, and have commit access once approved.
- Expected to follow contribution guidelines and review requirements.

## Decision Making

- **Routine changes:** Maintainers review and merge PRs based on coding standards and contribution guidelines.
- **Major changes:** Discussed openly, decided by consensus among maintainers. If consensus cannot be reached, lead maintainer decides.
- **Conflict resolution:** Maintainers will mediate. Issues can be escalated via [contact methods](#reporting--contact).

## Change Process

- Governance changes are proposed via pull request and require review and approval from at least one maintainer.
- All changes must follow the standard contribution workflow defined in [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Exception Process

### When Repositories Can Override Defaults

While this `.github` repository provides organization-wide defaults, individual repositories may need to deviate from these standards in specific circumstances.

#### Permitted Exceptions

1. **Repository-Specific Labels** – Additional labels beyond the canonical set for domain-specific needs
2. **Custom Workflows** – Project-specific automation or CI/CD requirements
3. **Alternative Templates** – Specialized issue/PR templates for unique workflows
4. **Branch Protection Rules** – Stricter or alternative rules for security/compliance

#### Exception Documentation Requirements

All exceptions must be documented in the repository's README.md with:

- **Rationale** – Clear explanation of why the exception is necessary
- **Scope** – What specifically deviates from org-wide standards
- **Review Date** – When the exception will be revisited (maximum 6 months)
- **Owner** – Maintainer responsible for the exception

**Example:**

```markdown
## Governance Exceptions

### Custom Labels

**Exception:** This repository uses additional labels not in the canonical set:

- `priority:p0` - Production outage (beyond `priority:critical`)
- `team:platform` - Platform team ownership

**Rationale:** Platform team requires finer-grained priority levels for on-call rotation.

**Review Date:** 2025-06-01

**Owner:** @ashleyshaw
```

#### Requesting Exceptions

1. Open a discussion in the `.github` repository explaining the need
2. Maintainers review and provide feedback within 5 business days
3. If approved, document the exception per requirements above
4. Revisit exceptions during scheduled governance reviews

#### Revisiting Divergence

- **Quarterly Reviews** – Maintainers review all documented exceptions every quarter
- **Consolidation** – Successful exceptions may be promoted to org-wide standards
- **Deprecation** – Unnecessary exceptions are deprecated with 30-day notice

---

## Release Cadence

### Organization-Wide Repository Updates

This `.github` repository follows a regular release cadence to ensure predictable updates across the organization:

#### Release Schedule

- **Minor Updates** – Fortnightly (every 2 weeks) on Wednesdays
- **Major Updates** – Quarterly (January, April, July, October)
- **Hotfixes** – As needed for critical fixes, within 24 hours

#### Release Process

1. **Planning** – Updates planned and scoped in GitHub Projects
2. **Development** – Changes developed in feature branches following [BRANCHING_STRATEGY.md](./docs/BRANCHING_STRATEGY.md)
3. **Testing** – All changes tested with CI/CD before merge to `develop`
4. **Review** – Minimum one maintainer approval required
5. **Release** – Tagged release created with changelog and migration guide
6. **Notification** – Organization notified via GitHub Discussions announcement

#### Maintenance Windows

- **Standard Updates** – No maintenance window, changes are backwards-compatible
- **Breaking Changes** – Announced 2 weeks in advance with migration guide
- **Emergency Hotfixes** – Immediate deployment with post-deployment notification

#### Rollback Steps

If a release causes issues in dependent repositories:

1. **Identify Issue** – Report via GitHub issue with `priority:critical` label
2. **Assess Impact** – Maintainers assess severity and scope within 2 hours
3. **Rollback Decision** – Determine if rollback or forward fix is appropriate
4. **Execute Rollback** – Revert to previous release tag and deploy
5. **Post-Mortem** – Document incident and preventive measures

**Rollback Commands:**

```bash
# Rollback to previous release
git checkout tags/v1.2.3
git push origin develop --force-with-lease

# Or create hotfix branch from previous stable
git checkout -b hotfix/rollback-v1.2.4 tags/v1.2.3
```

#### Version Compatibility

- **Backwards Compatibility** – Minor releases maintain backwards compatibility
- **Deprecation Policy** – Features deprecated with 3-month notice before removal
- **Migration Support** – Breaking changes include automated migration scripts where possible

---

## Reporting & Contact

- For governance or code of conduct concerns, open a GitHub issue or contact a maintainer directly.

## Key Documents & Standards

- [General Org Instructions](./.github/custom-instructions.md)
- [Coding Standards](instructions/coding-standards.instructions.md)
- [Contribution Guidelines](./CONTRIBUTING.md)
- [Branching Strategy](./docs/BRANCHING_STRATEGY.md)
- [Automation Governance](./docs/AUTOMATION_GOVERNANCE.md)
- [Issue & PR Labels](./docs/ISSUE_LABELS.md), [../PR_LABELS.md](./docs/PR_LABELS.md), [../labels.yml](./.github/labels.yml), [../labeler.yml](./.githublabeler.yml)
- [Issue Types YAML](./.github/issue-types.yml)
- [Pull Request Template](./.github/PULL_REQUEST_TEMPLATE.md)
- [CHANGELOG](./CHANGELOG.md)

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

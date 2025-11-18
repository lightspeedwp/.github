---
title: "Repository Maintenance Scripts"
version: "v1.6"
last_updated: "2025-01-14"
author: "LightSpeedWP Team"
maintainer: "Ash Shaw"
description: "Scripts for repository maintenance, automation, and quality assurance. Enforces standards, keeps documentation up-to-date, and streamlines development tasks."
file_type: "maintenance"
status: "production"
tags: ["maintenance", "automation", "documentation", "labels", "badges", "changelog", "testing"]
license: "GPL-3.0"
repository: "https://github.com/lightspeedwp/.github"
ai_references:
  - "Use for repository maintenance and documentation automation"
  - "Label synchronization across organization repositories"
  - "Badge updates and README maintenance workflows"
  - "Changelog validation and link verification"
related_files:
  - "scripts/includes/"
  - ".github/workflows/"
  - ".github/labels.yml"
  - "CHANGELOG.md"
---

## 🔧 Repository Maintenance Scripts

![Maintenance Badge](https://img.shields.io/badge/maintenance-automated-brightgreen?style=flat-square)
![Documentation Badge](https://img.shields.io/badge/docs-synced-blue?style=flat-square)
![Labels Badge](https://img.shields.io/badge/labels-standardized-orange?style=flat-square)
![Quality Badge](https://img.shields.io/badge/quality-assured-success?style=flat-square)

This directory contains scripts for repository maintenance, automation, and quality assurance. These scripts help enforce standards, keep documentation up-to-date, and streamline common development tasks.

## 📊 Maintenance Workflow

```mermaid
graph TB
    A[Repository Maintenance] --> B[Documentation]
    A --> C[Label Management]
    A --> D[Badge Updates]
    A --> E[Quality Assurance]
    
    B --> F[find-readmes.sh]
    B --> G[folder-and-file-readmes.sh]
    B --> H[update-readme-and-changelog.sh]
    
    C --> I[prune-labels.sh]
    C --> J[sync-org-labels.sh]
    
    D --> K[update-badges.sh]
    
    E --> L[validate-changelog-links.sh]
    E --> M[test-pr-labeler.sh]
    E --> N[run-maintenance-tests.sh]
    
    O[CI/CD Pipeline] --> A
    P[Pre-commit Hooks] --> A
    Q[Scheduled Tasks] --> A
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
```

## Scripts Overview

| Script                             | Description                                                                                                       |
| :--------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `find-readmes.sh`                  | Finds all README files in the repository.                                                                         |
| `folder-and-file-readmes.sh`       | Generates README files for folders and individual scripts, extracting metadata to create rich documentation.      |
| `prune-labels.sh`                  | Synchronizes repository labels with a canonical source and optionally removes non-standard labels.                |
| `run-maintenance-tests.sh`         | A dedicated test runner for executing all maintenance-related Bats tests.                                         |
| `sync-org-labels.sh`               | Synchronizes GitHub organization labels across all repositories to ensure they conform to a centralized standard. |
| `test-pr-labeler.sh`               | A simple test script to verify the Pull Request (PR) labeler workflow.                                            |
| `tests-folder-and-file-readmes.sh` | A comprehensive Bats test suite for the `folder-and-file-readmes.sh` script.                                      |
| `update-badges.sh`                 | Updates workflow badges in the main `README.md` file for all workflows in the repository.                         |
| `update-readme-and-changelog.sh`   | Ensures all `README.md` files contain a license badge and a link to the `CONTRIBUTING.md` file.                   |
| `validate-changelog-links.sh`      | Validates that all entries in the `[Unreleased]` section of the `CHANGELOG.md` have proper links.                 |

## 🔄 Maintenance Process Flow

```mermaid
sequenceDiagram
    participant Trigger as Automation Trigger
    participant Doc as Documentation
    participant Labels as Label Sync
    participant Badges as Badge Update
    participant Validate as Validation
    participant Report as Reporting
    
    Trigger->>Doc: find-readmes.sh
    Doc->>Doc: folder-and-file-readmes.sh
    Doc->>Labels: sync-org-labels.sh
    Labels->>Labels: prune-labels.sh
    Labels->>Badges: update-badges.sh
    Badges->>Validate: validate-changelog-links.sh
    Validate->>Report: run-maintenance-tests.sh
    Report->>Trigger: Complete maintenance cycle
    
    Note over Trigger,Report: Automated maintenance pipeline
```

---

## 📚 References

### 🔗 Documentation Links

- [LightSpeedWP Main Repository](https://github.com/lightspeedwp/.github)
- [Coding Standards Instructions](../../.github/instructions/coding-standards.instructions.md)
- [Testing Guidelines](../../.github/instructions/tests.instructions.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)

### 🛠️ Development Resources

- [Shared Includes Directory](../includes/)
- [GitHub Actions Workflows](../../.github/workflows/)
- [Organization Labels](../../.github/labels.yml)
- [Changelog Guidelines](../../CHANGELOG.md)

### 🎯 AI & Automation

- [Custom Instructions](../../.github/custom-instructions.md)
- [Agents Documentation](../../.github/agents/agent.md)
- [Prompts Library](../../.github/prompts/prompts.md)
- [Workflow Governance](../../GOVERNANCE.md)

---

_⚙️ Maintaining excellence through automated repository management and quality assurance._

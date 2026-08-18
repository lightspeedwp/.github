---
file_type: documentation
title: LightSpeed .github Documentation Index
description: Comprehensive index and quick-access guide for all documentation, configuration, and governance resources in the LightSpeed .github repository
version: '1.2'
last_updated: '2026-06-01'
owners:
  - LightSpeed Team
tags:
  - documentation
  - governance
  - index
  - community-health
status: active
stability: stable
domain: governance
language: en
---

# 📚 LightSpeed .github Documentation Index

Welcome to the comprehensive documentation hub for the LightSpeed `.github` repository—your central resource for understanding how to contribute, manage GitHub automation, and maintain the organisation's community health infrastructure.

---

## 🚀 Quick Start

### For First-Time Contributors

1. **Read** [CONTRIBUTING.md](../CONTRIBUTING.md) — How to contribute to LightSpeed projects
2. **Check** [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) — Branch naming conventions and merge discipline
3. **Review** [ISSUE_CREATION_GUIDE.md](./ISSUE_CREATION_GUIDE.md) — How to create effective issues
4. **Follow** [PR_CREATION_PROCESS.md](./PR_CREATION_PROCESS.md) — Pull request workflow and expectations

### For Maintainers

1. **Understand** [LABELING.md](./LABELING.md) — Label strategy and automation rules
2. **Review** [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) — Release and versioning procedures
3. **Learn** [AUTOMATION.md](./AUTOMATION.md) — GitHub Actions workflows and automation governance
4. **Check** [GOVERNANCE_REVISION_LOG.md](./GOVERNANCE_REVISION_LOG.md) — Recent policy and governance changes

### For Automation & DevOps Work

1. **Start** [AUTOMATION.md](./AUTOMATION.md) — GitHub Actions workflows, agents, and automation overview
2. **Review** [AGENT_CREATION.md](./AGENT_CREATION.md) — Creating new agents, bots, and automation workflows
3. **Explore** [GITHUB_PROJECT_OPERATIONS_SPEC.md](./GITHUB_PROJECT_OPERATIONS_SPEC.md) — Project automation and field configuration
4. **Configure** [CONFIGS.md](./CONFIGS.md) — Configuration files reference (labels, workflows, etc.)

---

## 📖 Documentation by Category

### 🏗️ Architecture & Strategy

| Document | Purpose |
|----------|---------|
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | High-level system architecture and design principles for the `.github` control plane |
| **[ORGANIZATION.md](./ORGANIZATION.md)** | Repository structure, file organisation, and where different assets live |
| **[BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)** | Git branching conventions, prefix mapping, enforcement rules, and merge discipline |
| **[VERSIONING.md](./VERSIONING.md)** | Semantic versioning strategy, release numbering, and version management |
| **[ROADMAP.md](./ROADMAP.md)** | Project roadmap, priorities, and planned initiatives |
| **[DECISIONS.md](./DECISIONS.md)** | Architecture Decision Records (ADRs) documenting major design choices |

### 📋 Contribution & Process Workflows

| Document | Purpose |
|----------|---------|
| **[ISSUE_CREATION_GUIDE.md](./ISSUE_CREATION_GUIDE.md)** | Standards for creating well-structured issues, linking to code, and automation |
| **[PR_CREATION_PROCESS.md](./PR_CREATION_PROCESS.md)** | Step-by-step guide for creating pull requests, using templates, and review process |
| **[RELEASE_PROCESS.md](./RELEASE_PROCESS.md)** | Release procedures, hotfix workflows, changelog management, and deployment steps |
| **[MIGRATION.md](./MIGRATION.md)** | Patterns for consolidation, file migrations, and updating cross-references |
| **[TESTING.md](./TESTING.md)** | Testing standards, frameworks, coverage requirements, and CI validation |
| **[LINTING.md](./LINTING.md)** | Linting rules, tool configuration (ESLint, Prettier, PHPCS), and pre-commit hooks |

### 🏷️ Labeling & Project Management

| Document | Purpose |
|----------|---------|
| **[LABELING.md](./LABELING.md)** | Complete label taxonomy covering issues, PRs, and discussions; label families; automation rules; and one-hot enforcement |
| **[LABEL_COLOR_STRATEGY.md](./LABEL_COLOR_STRATEGY.md)** | Visual colour coding strategy for labels and their semantic meaning |
| **[ISSUE_TYPES.md](./ISSUE_TYPES.md)** | Issue type definitions, required fields, and automation templates |
| **[ISSUE_FIELDS.md](./ISSUE_FIELDS.md)** | Issue field specification and custom field definitions |
| **[GITHUB_PROJECT_OPERATIONS_SPEC.md](./GITHUB_PROJECT_OPERATIONS_SPEC.md)** | Project board automation, field mapping, status workflows, and project sync rules |

### ⚙️ Configuration & Setup

| Document | Purpose |
|----------|---------|
| **[CONFIGS.md](./CONFIGS.md)** | Reference for all configuration files (labels.yml, labeler.yml, issue-types.yml, workflows, etc.) |
| **[FRONTMATTER_SCHEMA.md](./FRONTMATTER_SCHEMA.md)** | YAML frontmatter schema, required fields, and validation rules for all documentation |
| **[HUSKY_PRECOMMITS.md](./HUSKY_PRECOMMITS.md)** | Pre-commit hook setup, configuration, and troubleshooting |
| **[PLUGIN_INSTALLATION_GUIDE.md](./PLUGIN_INSTALLATION_GUIDE.md)** | Installing and configuring LightSpeed plugins |
| **[PLUGIN_PACK_ROADMAP.md](./PLUGIN_PACK_ROADMAP.md)** | Plugin development roadmap and planned features |

### 🤖 Automation, Agents & Development

| Document | Purpose |
|----------|---------|
| **[AUTOMATION.md](./AUTOMATION.md)** | GitHub Actions workflows, agent specifications, and automation governance framework |
| **[AGENT_CREATION.md](./AGENT_CREATION.md)** | Creating new agents, bots, and automation workflows using canonical patterns |
| **[CROSS_PLATFORM_SKILL_YAML_SPEC.md](./CROSS_PLATFORM_SKILL_YAML_SPEC.md)** | YAML specification for skills, manifests, and cross-platform agent definitions |
| **[WORKFLOW_COORDINATION.md](./WORKFLOW_COORDINATION.md)** | Coordinating workflows across repos, avoiding conflicts, and sharing patterns |

### 📊 Monitoring, Metrics & Reporting

| Document | Purpose |
|----------|---------|
| **[METRICS.md](./METRICS.md)** | Metrics tracking, dashboard configuration, and reporting for repository health |
| **[AWESOME_ALIGNMENT.md](./AWESOME_ALIGNMENT.md)** | Awesome project alignment and community metrics |

### 🌍 Adoption & Integration Guides

| Document | Purpose |
|----------|---------|
| **[SHARED_GITHUB_ADOPTION_GUIDE.md](./SHARED_GITHUB_ADOPTION_GUIDE.md)** | Organisation-wide adoption guide for implementing `.github` standards across all repos |

### 📞 Community, Governance & Administration

| Document | Purpose |
|----------|---------|
| **[DISCUSSIONS.md](./DISCUSSIONS.md)** | Guidelines for GitHub Discussions categories, labeling, and community engagement |
| **[GOVERNANCE_REVISION_LOG.md](./GOVERNANCE_REVISION_LOG.md)** | History of governance changes, policy updates, and decision timeline |
| **[OVERRIDE_POLICY.md](./OVERRIDE_POLICY.md)** | Override policies, exceptions, and procedures for breaking rules when justified |

---

## 🔍 Finding Documentation by Role

### For Developers

| Task | Start Here | Then Read |
|------|-----------|-----------|
| I'm new—where do I start? | [CONTRIBUTING.md](../CONTRIBUTING.md) | [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md), [TESTING.md](./TESTING.md) |
| Create an issue | [ISSUE_CREATION_GUIDE.md](./ISSUE_CREATION_GUIDE.md) | [LABELING.md](./LABELING.md#issue-labelling) |
| Create a pull request | [PR_CREATION_PROCESS.md](./PR_CREATION_PROCESS.md) | [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md), [LABELING.md](./LABELING.md#pull-request-labelling) |
| Setup pre-commit hooks | [HUSKY_PRECOMMITS.md](./HUSKY_PRECOMMITS.md) | [LINTING.md](./LINTING.md) |
| Run tests & linting | [TESTING.md](./TESTING.md), [LINTING.md](./LINTING.md) | [CONFIGS.md](./CONFIGS.md) |
| Understand branching | [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) | [PR_CREATION_PROCESS.md](./PR_CREATION_PROCESS.md) |

### For Code Reviewers & Maintainers

| Task | Start Here | Then Read |
|------|-----------|-----------|
| Review a PR | [PR_CREATION_PROCESS.md](./PR_CREATION_PROCESS.md) | [LABELING.md](./LABELING.md) |
| Manage labels | [LABELING.md](./LABELING.md) | [LABEL_COLOR_STRATEGY.md](./LABEL_COLOR_STRATEGY.md) |
| Triage issues | [ISSUE_TYPES.md](./ISSUE_TYPES.md) | [LABELING.md](./LABELING.md#issue-labelling), [GITHUB_PROJECT_OPERATIONS_SPEC.md](./GITHUB_PROJECT_OPERATIONS_SPEC.md) |
| Release a version | [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) | [VERSIONING.md](./VERSIONING.md) |
| Setup project automation | [GITHUB_PROJECT_OPERATIONS_SPEC.md](./GITHUB_PROJECT_OPERATIONS_SPEC.md) | [AUTOMATION.md](./AUTOMATION.md) |

### For Automation & DevOps Engineers

| Task | Start Here | Then Read |
|------|-----------|-----------|
| Create an agent | [AGENT_CREATION.md](./AGENT_CREATION.md) | [AUTOMATION.md](./AUTOMATION.md), [CROSS_PLATFORM_SKILL_YAML_SPEC.md](./CROSS_PLATFORM_SKILL_YAML_SPEC.md) |
| Setup GitHub Actions | [AUTOMATION.md](./AUTOMATION.md) | [CONFIGS.md](./CONFIGS.md), [WORKFLOW_COORDINATION.md](./WORKFLOW_COORDINATION.md) |
| Configure labels | [LABELING.md](./LABELING.md) | [CONFIGS.md](./CONFIGS.md) |
| Sync project boards | [GITHUB_PROJECT_OPERATIONS_SPEC.md](./GITHUB_PROJECT_OPERATIONS_SPEC.md) | [AUTOMATION.md](./AUTOMATION.md) |
| Monitor metrics | [METRICS.md](./METRICS.md) | [AWESOME_ALIGNMENT.md](./AWESOME_ALIGNMENT.md) |

### For Organisational Leadership

| Task | Start Here | Then Read |
|------|-----------|-----------|
| Understand the strategy | [ARCHITECTURE.md](./ARCHITECTURE.md) | [ROADMAP.md](./ROADMAP.md), [DECISIONS.md](./DECISIONS.md) |
| Review recent changes | [GOVERNANCE_REVISION_LOG.md](./GOVERNANCE_REVISION_LOG.md) | [DECISIONS.md](./DECISIONS.md) |
| Adopt across organisation | [SHARED_GITHUB_ADOPTION_GUIDE.md](./SHARED_GITHUB_ADOPTION_GUIDE.md) | [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md), [LABELING.md](./LABELING.md) |

---

## 📋 Complete File Inventory

### Documentation Files (docs/)

| File | Type | Description |
|------|------|-------------|
| [AGENT_CREATION.md](./AGENT_CREATION.md) | Guide | Creating agents and automation bots |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Reference | System architecture and design |
| [AUTOMATION.md](./AUTOMATION.md) | Guide | GitHub Actions and automation governance |
| [AWESOME_ALIGNMENT.md](./AWESOME_ALIGNMENT.md) | Reference | Community and alignment metrics |
| [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) | Policy | Branch naming, prefixes, and merge rules |
| [CONFIGS.md](./CONFIGS.md) | Reference | Configuration files and settings |
| [CROSS_PLATFORM_SKILL_YAML_SPEC.md](./CROSS_PLATFORM_SKILL_YAML_SPEC.md) | Specification | Skill YAML schema and format |
| [DECISIONS.md](./DECISIONS.md) | Reference | Architecture Decision Records (ADRs) |
| [DISCUSSIONS.md](./DISCUSSIONS.md) | Guide | Discussion categories and guidelines |
| [FRONTMATTER_SCHEMA.md](./FRONTMATTER_SCHEMA.md) | Schema | YAML frontmatter specification |
| [GITHUB_PROJECT_OPERATIONS_SPEC.md](./GITHUB_PROJECT_OPERATIONS_SPEC.md) | Specification | Project board automation and sync |
| [GOVERNANCE_REVISION_LOG.md](./GOVERNANCE_REVISION_LOG.md) | Log | Governance change history |
| [HUSKY_PRECOMMITS.md](./HUSKY_PRECOMMITS.md) | Guide | Pre-commit hook setup |
| [ISSUE_CREATION_GUIDE.md](./ISSUE_CREATION_GUIDE.md) | Guide | Creating effective issues |
| [ISSUE_FIELDS.md](./ISSUE_FIELDS.md) | Reference | Issue field definitions |
| [ISSUE_TYPES.md](./ISSUE_TYPES.md) | Reference | Issue type definitions |
| [LABEL_COLOR_STRATEGY.md](./LABEL_COLOR_STRATEGY.md) | Strategy | Label colour coding |
| [LABELING.md](./LABELING.md) | Guide | Label taxonomy and automation |
| [LINTING.md](./LINTING.md) | Guide | Linting rules and configuration |
| [METRICS.md](./METRICS.md) | Reference | Metrics and reporting |
| [MIGRATION.md](./MIGRATION.md) | Guide | File migration and consolidation patterns |
| [ORGANIZATION.md](./ORGANIZATION.md) | Reference | Repository organisation and structure |
| [PLUGIN_INSTALLATION_GUIDE.md](./PLUGIN_INSTALLATION_GUIDE.md) | Guide | Plugin installation and setup |
| [PLUGIN_PACK_ROADMAP.md](./PLUGIN_PACK_ROADMAP.md) | Roadmap | Plugin development roadmap |
| [PR_CREATION_PROCESS.md](./PR_CREATION_PROCESS.md) | Guide | Pull request workflow |
| [README.md](./README.md) | Reference | Full documentation index (legacy; see index.md) |
| [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) | Guide | Release and deployment procedures |
| [ROADMAP.md](./ROADMAP.md) | Plan | Project roadmap and initiatives |
| [SHARED_GITHUB_ADOPTION_GUIDE.md](./SHARED_GITHUB_ADOPTION_GUIDE.md) | Guide | Organisation-wide adoption guide |
| [TESTING.md](./TESTING.md) | Guide | Testing standards and frameworks |
| [VERSIONING.md](./VERSIONING.md) | Policy | Semantic versioning strategy |
| [WORKFLOW_COORDINATION.md](./WORKFLOW_COORDINATION.md) | Guide | Cross-repo workflow coordination |
| [OVERRIDE_POLICY.md](./OVERRIDE_POLICY.md) | Policy | Override and exception procedures |

### Key Configuration & Template Files

| Path | Purpose |
|------|---------|
| [../.github/labels.yml](../.github/labels.yml) | Canonical label definitions and colours |
| [../.github/labeler.yml](../.github/labeler.yml) | Automated label assignment rules |
| [../.github/issue-types.yml](../.github/issue-types.yml) | Issue type definitions |
| [../.github/PULL_REQUEST_TEMPLATE/](../.github/PULL_REQUEST_TEMPLATE/) | PR template directory (pr_feature.md, pr_bug.md, etc.) |
| [../.github/ISSUE_TEMPLATE/](../.github/ISSUE_TEMPLATE/) | Issue template directory |
| [../.github/DISCUSSION_TEMPLATE/](../.github/DISCUSSION_TEMPLATE/) | Discussion template directory |
| [../.github/workflows/](../.github/workflows/) | GitHub Actions workflows |
| [../instructions/](../instructions/) | Portable instruction files (coding standards, documentation formats, etc.) |

### Top-Level Repository Files

| File | Purpose |
|------|---------|
| [../CONTRIBUTING.md](../CONTRIBUTING.md) | Contribution guidelines for all projects |
| [../CHANGELOG.md](../CHANGELOG.md) | Release notes and version history |
| [../CLAUDE.md](../CLAUDE.md) | Repository boundaries and AI rules |
| [../AGENTS.md](../AGENTS.md) | AI agent specifications |
| [../.github/custom-instructions.md](../.github/custom-instructions.md) | Copilot and AI agent instructions |

---

## 📞 Support & Navigation

| Need | Resource |
|------|----------|
| **First-time contribution?** | Start with [CONTRIBUTING.md](../CONTRIBUTING.md) then [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) |
| **Issue or PR question?** | Check [ISSUE_CREATION_GUIDE.md](./ISSUE_CREATION_GUIDE.md) or [PR_CREATION_PROCESS.md](./PR_CREATION_PROCESS.md) |
| **Label or automation question?** | See [LABELING.md](./LABELING.md) or [AUTOMATION.md](./AUTOMATION.md) |
| **Release or versioning question?** | Review [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) and [VERSIONING.md](./VERSIONING.md) |
| **Agent or workflow creation?** | Start with [AGENT_CREATION.md](./AGENT_CREATION.md) and [AUTOMATION.md](./AUTOMATION.md) |
| **Discussion in the community?** | See [DISCUSSIONS.md](./DISCUSSIONS.md) for guidelines |
| **Report a problem?** | Create an issue following [ISSUE_CREATION_GUIDE.md](./ISSUE_CREATION_GUIDE.md) |

---

## 📖 Documentation Standards

All documentation in this repository adheres to these standards:

- **Language:** UK English (colour, organisation, optimise, behaviour, etc.)
- **Format:** Markdown with YAML frontmatter (see [FRONTMATTER_SCHEMA.md](./FRONTMATTER_SCHEMA.md))
- **Links:** Relative paths within repository (e.g., `[LABELING.md](./LABELING.md)`)
- **Accessibility:** WCAG 2.2 AA compliant with semantic HTML and clear structure
- **Maintenance:** Last updated date maintained in frontmatter; older docs marked with status
- **Contribution:** See [CONTRIBUTING.md](../CONTRIBUTING.md) for documentation contribution process

For detailed guidance on writing and formatting documentation, see [instructions/documentation-formats.instructions.md](../instructions/documentation-formats.instructions.md).

---

## 🔗 Related Resources

- **[CONTRIBUTING.md](../CONTRIBUTING.md)** — Full contribution guidelines for the organisation
- **[AGENTS.md](../AGENTS.md)** — AI agent and Copilot specifications
- **[.github/custom-instructions.md](../.github/custom-instructions.md)** — AI/Copilot system instructions
- **[instructions/](../instructions/)** — Portable instruction files for various domains (coding standards, accessibility, etc.)
- **[ai/](../ai/)** — Canonical AI references and configurations
- **[agents/](../agents/)** — Portable agent specifications
- **[skills/](../skills/)** — Self-contained skill definitions with SKILL.md entrypoints
- **[workflows/](../workflows/)** — Portable agentic workflow definitions
- **[plugins/](../plugins/)** — Installable plugin bundles

---

## ✅ Verification

All links in this index have been verified as of **2026-06-01**. If you find a broken link or missing documentation, please:

1. Check if the file has been moved (see [MIGRATION.md](./MIGRATION.md))
2. Open an issue referencing the missing or broken link
3. Submit a PR to update this index

For recent governance changes and file relocations, see [GOVERNANCE_REVISION_LOG.md](./GOVERNANCE_REVISION_LOG.md).

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

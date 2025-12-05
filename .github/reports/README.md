---
file_type: "documentation"
title: "LightSpeed Reports Directory"
description: "Central location for all generated reports, analysis summaries, and data artifacts across LightSpeed repositories."
version: "v2.0"
created_date: "2025-10-20"
last_updated: "2025-12-04"
author: "LightSpeed Team"
maintainer: "Ash Shaw"
owners: ["lightspeedwp/maintainers"]
license: "GPL-3.0"
domain: "governance"
stability: "stable"
tags: ["reporting", "metrics", "analytics", "artifacts", "automation"]
references:
  - path: ../instructions/reporting.instructions.md
    description: Reporting standards and file conventions
  - path: ../instructions/file-management-guidelines.instructions.md
    description: General file management guidelines
---

# 📊 LightSpeed Reports Directory

This directory contains all generated reports, analysis summaries, metrics outputs, and data artifacts for the LightSpeed organisation. Reports are organised by category in dedicated subfolders.

## ⚠️ Important: Report Location

**Canonical Location:** `.github/reports/`

❌ **NEVER** store reports in:

- Root `/reports/` folder
- `docs/` folder
- Repository root

## Directory Structure

```text
.github/reports/
├── README.md                              # This file
├── agents/                                # Agent-related reports
│   ├── documentation-completion-summary.md
│   ├── frontmatter-audit.ipynb
│   ├── frontmatter-completion-summary.md
│   ├── frontmatter-update-guide.md
│   ├── frontmatter-validation-complete.md
│   ├── implementation-completion-summary.md
│   ├── review-comprehensive-analysis.md
│   ├── updates-complete-summary.md
│   ├── updates-completion-summary.md
│   └── workflow-completion-summary.md
├── labeling/                              # Label automation reports
│   ├── refactor-analysis.md
│   └── refactor-changelog.md
├── linting/                               # Code quality and ESLint reports
│   ├── eslint-baseline.json               # Original baseline
│   ├── eslint-baseline.spec.md            # Baseline specification
│   ├── eslint-baseline-post-wave-1.json   # Post-wave-1 state
│   ├── eslint-baseline-post-wave-1.spec.md
│   ├── eslint-impact-matrix.json          # Prioritisation matrix
│   ├── eslint-impact-matrix.spec.md
│   ├── eslint-taxonomy.json               # Categorised summary
│   ├── eslint-taxonomy.spec.md
│   ├── lint-and-test-report.md
│   ├── test-summary.md
│   ├── wave-1-delta.json                  # Wave 1 results
│   ├── wave-1-delta.spec.md
│   └── wave-1-plan.md
├── frontmatter/                           # Frontmatter validation reports
│   ├── schema-consolidation-2025-01-22.md
│   └── update-project-completion.md
├── coverage/                              # Test coverage reports
├── branding/                              # Branding automation metrics
└── issue-metrics/                         # GitHub issue/PR analytics
```

## Report Categories

### 🤖 Agents (`agents/`)

Reports related to automation agents, their implementation, testing, and documentation status.

| Report                                 | Description                               |
| -------------------------------------- | ----------------------------------------- |
| `documentation-completion-summary.md`  | Agent documentation audit results         |
| `frontmatter-audit.ipynb`              | Jupyter notebook for frontmatter analysis |
| `implementation-completion-summary.md` | Agent implementation status               |
| `workflow-completion-summary.md`       | Workflow integration status               |

### 🏷️ Labeling (`labeling/`)

Reports from label automation, refactoring, and synchronisation efforts.

| Report                  | Description                       |
| ----------------------- | --------------------------------- |
| `refactor-analysis.md`  | Label system refactoring analysis |
| `refactor-changelog.md` | Changes made during refactoring   |

### 🔍 Linting (`linting/`)

ESLint baselines, improvement plans, and code quality metrics.

| Report                      | Description                            |
| --------------------------- | -------------------------------------- |
| `eslint-baseline.json`      | Original ESLint baseline (full output) |
| `eslint-taxonomy.json`      | Categorised error summary              |
| `eslint-impact-matrix.json` | Prioritised remediation matrix         |
| `wave-1-delta.json`         | Wave 1 improvement results             |
| `*.spec.md`                 | Specification files for each JSON      |

### 📋 Frontmatter (`frontmatter/`)

Frontmatter validation, schema compliance, and standardisation reports.

### 📈 Coverage (`coverage/`)

Test coverage reports and code quality metrics.

### 🎨 Branding (`branding/`)

Branding automation metrics and documentation coverage.

### 📊 Issue Metrics (`issue-metrics/`)

GitHub issue and PR analytics, response times, and project health.

## File Naming Conventions

### Markdown Reports

- Use **lowercase** with hyphens
- Include date for time-specific reports: `{subject}-{date}.md`
- Examples: `refactor-analysis.md`, `folder-audit-2025-11-26.md`

### JSON Data Files

- Use **lowercase** with hyphens
- Include context: `{subject}-{type}.json`
- Examples: `eslint-baseline.json`, `wave-1-delta.json`

### Specification Files

Every JSON file **must** have a corresponding `.spec.md` file:

- Pattern: `{json-filename}.spec.md`
- Example: `eslint-baseline.json` → `eslint-baseline.spec.md`

## Usage Guidelines

### Storing Reports

1. **Always use** `.github/reports/` - never root `/reports/`
2. Place in the appropriate category subfolder
3. Use lowercase filenames with hyphens
4. Create `.spec.md` for any JSON files
5. Include proper frontmatter

### Accessing Reports

Reports are committed to version control and available via:

- Direct file access in GitHub
- Workflow artifacts
- GitHub API

### Report Retention

- **Latest reports**: Always in category root
- **Historical archives**: Move to `{category}/archive/` as needed
- **Retention policy**: Keep last 12 months of archives

## Standards

All reports must follow the conventions in:

- [Reporting Instructions](../instructions/reporting.instructions.md)
- [File Management Guidelines](../instructions/file-management-guidelines.instructions.md)
- [Naming Conventions](../instructions/naming-conventions.instructions.md)

## Quick Reference

| Category      | Path             | Purpose                          |
| ------------- | ---------------- | -------------------------------- |
| Agents        | `agents/`        | Agent implementation and testing |
| Labeling      | `labeling/`      | Label automation and sync        |
| Linting       | `linting/`       | Code quality and ESLint          |
| Frontmatter   | `frontmatter/`   | Schema validation                |
| Coverage      | `coverage/`      | Test coverage                    |
| Branding      | `branding/`      | Documentation branding           |
| Issue Metrics | `issue-metrics/` | GitHub analytics                 |

## Contributing

To add new reports:

1. Identify the appropriate category subfolder
2. Follow naming conventions (lowercase, hyphens)
3. Add frontmatter with required fields
4. Create spec file for any JSON data
5. Update this README if adding a new report type

## Automation

The reporting system includes automation components for generating, validating, and maintaining reports:

| Component    | Location                                  | Purpose                              |
| ------------ | ----------------------------------------- | ------------------------------------ |
| Agent Spec   | `../agents/reporting.agent.md`            | Agent configuration and capabilities |
| Agent Code   | `../agents/reporting.agent.js`            | Node.js implementation               |
| Workflow     | `../workflows/reporting.yml`              | GitHub Actions automation            |
| Prompt       | `../prompts/reporting.prompt.md`          | Copilot prompt for report generation |
| Instructions | `../instructions/reporting.instructions.md` | Standards and conventions            |

### Running Manually

```bash
# Generate a report for a specific category
node ../.github/agents/reporting.agent.js --category=linting

# Dry run (preview without changes)
node ../.github/agents/reporting.agent.js --category=agents --dry-run

# Organise and validate all reports
node ../.github/agents/reporting.agent.js --organise
```

### Automated Runs

The reporting workflow runs automatically:

- **Weekly**: Monday at 06:00 UTC
- **On Push**: When `.github/reports/**` files change
- **Manual**: Via GitHub Actions workflow dispatch

---

Made with ❤️ by the LightSpeed team.

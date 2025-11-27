---
file_type: "agent"
name: "reporting"
description: "Automates the creation, organisation, and maintenance of reports across all LightSpeed repositories. Generates structured reports, ensures proper categorisation, and maintains JSON specification files."
version: "v1.0.0"
created_date: "2025-11-26"
last_updated: "2025-11-26"
author: "LightSpeed Team"
maintainer: "Ash Shaw"
owners: ["lightspeedwp/maintainers"]
category: "automation"
status: "active"
visibility: "public"
target: "vscode"
tools: ["read", "edit", "search", "shell"]
tags: ["reporting", "automation", "documentation", "metrics", "analytics"]
language: "en"
handoffs:
  - label: "Generate Spec File"
    agent: "reporting"
    prompt: "Create a specification file for the JSON data file."
    send: false
  - label: "Archive Report"
    agent: "reporting"
    prompt: "Archive the specified report to the archive subfolder."
    send: false
references:
  - path: ".github/instructions/reporting.instructions.md"
    description: "Reporting standards and conventions"
  - path: ".github/reports/README.md"
    description: "Reports directory index"
  - path: ".github/agents/reporting.agent.js"
    description: "JavaScript implementation"
  - path: ".github/workflows/reporting.yml"
    description: "GitHub Actions workflow"
  - path: ".github/prompts/reporting.prompt.md"
    description: "Reporting prompt template"
  - path: ".github/chatmodes/reporting.chatmode.md"
    description: "Reporting chatmode"
metadata:
  guardrails: "Always store reports in .github/reports/ subfolders. Never store in root /reports/ or docs/. Create spec files for all JSON outputs. Use lowercase filenames with hyphens."
---

# Reporting Agent

## Purpose

The Reporting Agent automates the creation, organisation, and maintenance of reports across all LightSpeed repositories. It ensures consistent structure, proper categorisation, and complete documentation for all report artifacts.

## Responsibilities

### Report Generation

- Create structured reports following the standard template
- Add proper YAML frontmatter with required fields
- Generate executive summaries and key metrics tables
- Include actionable recommendations

### Report Organisation

- Store all reports in `.github/reports/` (NEVER in root `/reports/`)
- Route reports to appropriate category subfolders:
  - `agents/` - Agent-related reports
  - `linting/` - Code quality reports
  - `labeling/` - Label automation reports
  - `frontmatter/` - Schema validation reports
  - `coverage/` - Test coverage reports
  - `branding/` - Branding metrics
  - `issue-metrics/` - GitHub analytics

### JSON Specification Files

- Create `.spec.md` files for every JSON output
- Document schema, fields, and usage
- Include generation method and examples
- Link to related files

### Report Maintenance

- Update `last_updated` timestamps on modifications
- Archive stale reports to `{category}/archive/`
- Validate frontmatter and markdown formatting
- Check and update broken references

## Workflow

```mermaid
flowchart TD
    A[Trigger: Report Request] --> B{Report Type?}
    B -->|Summary| C[Generate Summary Report]
    B -->|Data| D[Generate JSON + Spec]
    B -->|Audit| E[Generate Audit Report]

    C --> F[Add Frontmatter]
    D --> F
    E --> F

    F --> G[Determine Category]
    G --> H[Store in .github/reports/{category}/]
    H --> I[Update Directory Index]
    I --> J[Commit Changes]
```

## Report Categories

| Category      | Path             | Content Types                                  |
| ------------- | ---------------- | ---------------------------------------------- |
| Agents        | `agents/`        | Implementation summaries, audits, test results |
| Linting       | `linting/`       | ESLint baselines, improvement plans, metrics   |
| Labeling      | `labeling/`      | Label changes, sync status, automation logs    |
| Frontmatter   | `frontmatter/`   | Schema validation, compliance reports          |
| Coverage      | `coverage/`      | Test coverage, quality metrics                 |
| Branding      | `branding/`      | Documentation coverage, header/footer status   |
| Issue Metrics | `issue-metrics/` | GitHub analytics, response times               |

## File Naming

### Markdown Reports

```
{subject}-{optional-date}.md
```

Examples:

- `eslint-weekly-summary.md`
- `folder-audit-2025-11-26.md`
- `implementation-completion-summary.md`

### JSON Data Files

```
{subject}-{type}.json
```

Examples:

- `eslint-baseline.json`
- `eslint-impact-matrix.json`
- `wave-1-delta.json`

### Specification Files

```
{json-filename}.spec.md
```

Examples:

- `eslint-baseline.spec.md`
- `wave-1-delta.spec.md`

## Standard Report Template

```markdown
---
file_type: "report"
title: "{Report Title}"
description: "{Brief description}"
category: "{category}"
created_date: "YYYY-MM-DD"
last_updated: "YYYY-MM-DD"
author: "{Author or 'automation'}"
tags: ["{relevant}", "{tags}"]
---

# {Report Title}

## Summary

{Executive summary - 2-3 sentences}

## Key Metrics

| Metric   | Value   | Status     |
| -------- | ------- | ---------- |
| {metric} | {value} | {✅/⚠️/❌} |

## Details

{Detailed findings}

## Recommendations

{Actionable recommendations}

## References

- [{Related File}]({path})
```

## Guardrails

1. **Location**: ALWAYS use `.github/reports/` - NEVER root `/reports/`
2. **Naming**: Use lowercase with hyphens, no uppercase
3. **Frontmatter**: Include all required fields
4. **Specs**: Create `.spec.md` for every JSON file
5. **Categories**: Route to appropriate subfolder
6. **Updates**: Update `last_updated` on modifications

## Integration

### Triggers

- Manual invocation via chatmode or prompt
- Scheduled workflow runs
- Post-task automation (e.g., after linting)
- PR/issue events

### Outputs

- Markdown reports in appropriate category folder
- JSON data files with companion spec files
- Updated directory indexes
- Commit with descriptive message

## Commands

### Generate Report

```
/reporting generate --type summary --category linting --title "Weekly ESLint Summary"
```

### Create Spec File

```
/reporting spec --json eslint-baseline.json
```

### Archive Report

```
/reporting archive --file linting/old-report.md
```

### Validate Reports

```
/reporting validate --category all
```

## References

- [Reporting Instructions](../instructions/reporting.instructions.md)
- [Reports Directory](../reports/README.md)
- [File Management Guidelines](../instructions/file-management-guidelines.instructions.md)
- [Naming Conventions](../instructions/naming-conventions.instructions.md)

---

*Reporting Agent - Ensuring consistent, organised, and well-documented reports across LightSpeed.*

---
file_type: instructions
title: Reporting Instructions
description: Standards for creating, organising, and maintaining reports in the LightSpeedWP
  .github repository.
version: v1.1
last_updated: '2025-12-04'
applyTo: .githu./.github/reports/**/*
owners:
- LightSpeedWP Team
tags:
- reporting
- documentation
- automation
- governance
domain: governance
stability: stable
references:
- path: .githu./.github/reports/README.md
  description: Reports directory index and usage guide
- path: .github/agents/reporting.agent.md
  description: Reporting agent specification
- path: .github/agents/reporting.agent.js
  description: Reporting agent implementation
- path: .github/workflows/reporting.yml
  description: Reporting automation workflow
- path: .github/prompts/reporting.prompt.md
  description: Reporting prompt template
- path: .github/chatmodes/reporting.chatmode.md
  description: Reporting chatmode for interactive assistance
- path: .github/instructions/file-management-guidelines.instructions.md
  description: General file management guidelines
- path: .github/instructions/naming-conventions.instructions.md
  description: Naming conventions for all files
---

# Reporting Instructions

## Overview

This document defines the standards for creating, organising, and maintaining reports in the LightSpeedWP `.github` repository. All reports MUST be stored in `.githu./.github/reports/` and follow the conventions outlined below.

## Report Location

**Canonical Location:** `.githu./.github/reports/`

❌ **NEVER** store reports in:

- Root ./.github/reports/` folder
- `docs/` folder
- `tmp/` folder (temporary processing only)
- Any other location

## Directory Structure

Reports are organised by category in dedicated subfolders:

```text
.githu./.github/reports/
├── README.md                    # Directory index and usage guide
├── agents/                      # Agent-related reports and summaries
│   ├── frontmatter-audit.md
│   ├── implementation-summary.md
│   └── *.json + *.spec.md
├── labeling/                    # Label automation reports
│   ├── refactor-analysis.md
│   ├── refactor-changelog.md
│   └── *.json + *.spec.md
├── linting/                     # Code quality and linting reports
│   ├── eslint-baseline.json
│   ├── eslint-baseline.spec.md
│   ├── weekly-summary.md
│   └── *.json + *.spec.md
├── frontmatter/                 # Frontmatter validation reports
├── coverage/                    # Test coverage reports
├── meta/                        # Metadata automation metrics
└── issue-metrics/               # GitHub issue/PR analytics
```

## File Naming Conventions

### Markdown Reports

- Use **lowercase** with hyphens for all report files
- Use descriptive names that indicate the report type and subject
- Include date suffix for time-specific reports: `{subject}-{date}.md`

**Examples:**

- `eslint-weekly-summary.md` ✅
- `agent-frontmatter-audit.md` ✅
- `folder-audit-2025-11-26.md` ✅
- `AGENT-SUMMARY.MD` ❌ (no uppercase)
- `report.md` ❌ (too generic)

### JSON Data Files

- Use **lowercase** with hyphens
- Include context in filename: `{subject}-{type}.json`

**Examples:**

- `eslint-baseline.json` ✅
- `eslint-impact-matrix.json` ✅
- `wave-1-delta.json` ✅

### Specification Files

Every JSON file MUST have a corresponding `.spec.md` file that documents:

- Purpose and usage
- Schema/structure description
- Field definitions
- Generation method
- Related files

**Naming Pattern:** `{json-filename}.spec.md`

**Examples:**

- `eslint-baseline.json` → `eslint-baseline.spec.md`
- `eslint-impact-matrix.json` → `eslint-impact-matrix.spec.md`

## Report Format Structure

### Standard Report Template

```markdown
---
file_type: "report"
title: "{Report Title}"
description: "{Brief description of report purpose}"
category: "{agents|linting|labeling|frontmatter|coverage|meta|issue-metrics}"
created_date: "YYYY-MM-DD"
last_updated: "YYYY-MM-DD"
author: "{Author or 'automation'}"
tags: ["{relevant}", "{tags}"]
---

# {Report Title}

## Summary

{Executive summary of findings - 2-3 sentences}

## Key Metrics

| Metric   | Value   | Status     |
| -------- | ------- | ---------- |
| {metric} | {value} | {✅/⚠️/❌} |

## Details

{Detailed findings, analysis, or data}

## Recommendations

{Actionable recommendations based on findings}

## References

- [{Related File}]({path})
- [{Related Documentation}]({path})
```

### Category-Specific Additions

#### Linting Reports

Additional sections:

- **Error Breakdown** - Categorised error counts
- **File Coverage** - Files analysed vs total
- **Trend Analysis** - Comparison with previous runs

#### Agent Reports

Additional sections:

- **Agent Status** - Active/deprecated/experimental
- **Test Results** - Pass/fail summary
- **Coverage Metrics** - Code coverage percentages

#### Labeling Reports

Additional sections:

- **Label Changes** - Added/modified/removed labels
- **Automation Status** - Workflow execution results
- **Sync Status** - Repository sync state

## JSON Specification File Format

### Standard Spec Template

```markdown
---
file_type: "specification"
title: "{JSON File Name} Specification"
description: "Schema and usage documentation for {json-file}.json"
json_file: "{json-file}.json"
category: "{category}"
created_date: "YYYY-MM-DD"
last_updated: "YYYY-MM-DD"
---

---
file_type: "instructions"
title: "Reporting Instructions"
description: "Standards for creating, organising, and maintaining reports in the LightSpeedWP .github repository."
version: "v1.1"
last_updated: "2025-12-04"
applyTo: ".github/reports/**/*"
owners: ["LightSpeedWP Team"]
tags: ["reporting", "documentation", "automation", "governance"]
domain: "governance"
stability: "stable"
references:
  - path: ".github/reports/README.md"
    description: "Reports directory index and usage guide"
  - path: ".github/agents/reporting.agent.md"
    description: "Reporting agent specification"
  - path: ".github/agents/reporting.agent.js"
    description: "Reporting agent implementation"
  - path: ".github/workflows/reporting.yml"
    description: "Reporting automation workflow"
  - path: ".github/prompts/reporting.prompt.md"
    description: "Reporting prompt template"
  - path: ".github/chatmodes/reporting.chatmode.md"
    description: "Reporting chatmode for interactive assistance"
  - path: ".github/instructions/file-management-guidelines.instructions.md"
    description: "General file management guidelines"
  - path: ".github/instructions/naming-conventions.instructions.md"
    description: "Naming conventions for all files"
---

# Reporting Instructions

## Overview

This document defines the standards for creating, organising, and maintaining reports in the LightSpeedWP `.github` repository. All reports MUST be stored in `.github/reports/` and follow the conventions outlined below.

## Report Location

**Canonical Location:** `.github/reports/`

❌ **NEVER** store reports in:

- Root `/reports/` folder
- `docs/` folder
- `tmp/` folder (temporary processing only)
- Any other location

## Directory Structure

Reports are organised by category in dedicated subfolders:

```text
.github/reports/
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

# {JSON File Name} Specification

## Purpose

{Description of what this JSON file contains and why it exists}

## Generation

{How this file is generated - manual, automated, which script/workflow}

## Schema

{JSON schema or structure description}

### Top-Level Fields

| Field   | Type   | Required | Description   |
| ------- | ------ | -------- | ------------- |
| {field} | {type} | {yes/no} | {description} |

### Nested Structures

{Document any nested objects or arrays}

## Usage

{How this file is consumed - by scripts, workflows, or documentation}

## Related Files

- [{related-file}]({path}) - {description}

## Example

\`\`\`json
{
"example": "data"
}
\`\`\`
```

## Workflow Integration

### Creating Reports

1. Determine the appropriate category subfolder
2. Use lowercase filenames with hyphens
3. Include proper frontmatter
4. For JSON files, create corresponding `.spec.md`
5. Update the category's index if one exists

### Updating Reports

1. Update `last_updated` in frontmatter
2. Add change notes if significant
3. Ensure all references are still valid

### Archiving Reports

1. Move to `{category}/archive/` subfolder
2. Add `archived: true` to frontmatter
3. Note archival reason in the file

## Validation

Reports should pass:

- Frontmatter schema validation
- Markdown linting
- Link checking for references

## Best Practices

1. **Be Specific** - Use descriptive titles and filenames
2. **Include Context** - Add dates and version information
3. **Link Related Files** - Cross-reference related reports and specs
4. **Keep Current** - Update or archive stale reports
5. **Document JSON** - Every JSON file needs a spec file
6. **Use Consistent Structure** - Follow the templates above

## References

- [File Management Guidelines](./file-management-guidelines.instructions.md)
- [Naming Conventions](./naming-conventions.instructions.md)
- [Reports Directory](./../reports/README.md)

## Automation Components

The reporting system includes the following automation components:

| Component  | File                                                        | Purpose                               |
| ---------- | ----------------------------------------------------------- | ------------------------------------- |
| Agent Spec | [reporting.agent.md](../agents/reporting.agent.md)          | Agent specification and configuration |
| Agent Code | [reporting.agent.js](../agents/reporting.agent.js)          | Node.js implementation                |
| Workflow   | [reporting.yml](../workflows/reporting.yml)                 | GitHub Actions automation             |
| Prompt     | [reporting.prompt.md](../prompts/reporting.prompt.md)       | Copilot prompt template               |
| Chatmode   | [reporting.chatmode.md](../chatmodes/reporting.chatmode.md) | Interactive assistance                |

### Running the Agent

```bash
# Generate a specific category report
node .github/agents/reporting.agent.js --category=linting

# Dry run (no file changes)
node .github/agents/reporting.agent.js --category=agents --dry-run

# Organise reports
node .github/agents/reporting.agent.js --organise
```

### Workflow Triggers

The reporting workflow runs:

- **Manually** via `workflow_dispatch` with category selection
- **Weekly** on Monday at 06:00 UTC
- **On push** when `.github/reports/**` files change

### Using the Chatmode

Activate the reporting chatmode in Copilot Chat for interactive help:

- Generate new reports
- Find existing reports
- Validate report structure
- Organise and archive reports

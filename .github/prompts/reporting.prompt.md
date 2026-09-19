---
file_type: "prompt"
title: "Reporting Prompt"
description: "Generate structured reports following LightSpeed reporting standards. Creates reports with proper frontmatter, categorisation, and specification files for JSON data."
version: "v1.0"
created_date: "2025-11-26"
last_updated: "2025-11-26"
author: "LightSpeed Team"
mode: "agent"
model: "claude-sonnet"
tools: ["read", "edit", "search"]
tags: ["reporting", "documentation", "automation", "metrics"]
domain: "governance"
stability: "stable"
references:
  - path: ".github/instructions/reporting.instructions.md"
    description: "Reporting standards and conventions"
  - path: ".github/reports/README.md"
    description: "Reports directory index"
  - path: ".github/agents/reporting.agent.md"
    description: "Reporting agent specification"
---

# Reporting Prompt

Generate structured reports following LightSpeed standards with proper organisation and documentation.

## Usage

Use this prompt when you need to:

- Create a new report for any category
- Generate a JSON data file with specification
- Document analysis or audit results
- Create weekly or periodic summaries

## Report Categories

| Category        | Path                             | Use For                                |
| --------------- | -------------------------------- | -------------------------------------- |
| `agents`        | `.github/reports/agents/`        | Agent audits, implementation summaries |
| `linting`       | `.github/reports/linting/`       | ESLint baselines, code quality metrics |
| `labeling`      | `.github/reports/labeling/`      | Label automation, sync status          |
| `frontmatter`   | `.github/reports/frontmatter/`   | Schema validation, compliance          |
| `coverage`      | `.github/reports/coverage/`      | Test coverage reports                  |
| `branding`      | `.github/reports/branding/`      | Documentation branding metrics         |
| `issue-metrics` | `.github/reports/issue-metrics/` | GitHub analytics                       |
| `mermaid`       | `.github/reports/mermaid/`       | Diagram coverage, accessibility/contrast audits, rendering checks |

## Instructions

### For Markdown Reports

1. **Location**: Always save to `.github/reports/{category}/`
2. **Filename**: Use lowercase with hyphens (e.g., `audit-summary-2025-11-26.md`)
3. **Frontmatter**: Include all required fields:
   - `file_type: "report"`
   - `title`, `description`, `category`
   - `created_date`, `last_updated`
   - `author`, `tags`

4. **Structure**: Follow the standard template:

   ```markdown
   # {Title}

   ## Summary

   {2-3 sentence executive summary}

   ## Key Metrics

   | Metric | Value | Status |
   | ------ | ----- | ------ |

   ## Details

   {Detailed findings}

   ## Recommendations

   {Actionable next steps}

   ## References

   {Related files and documentation}
   ```

### For JSON Data Files

1. **Location**: Same category folder as related reports
2. **Filename**: Use lowercase with hyphens (e.g., `eslint-baseline.json`)
3. **Spec File**: Create a `.spec.md` file for every JSON:
   - Name: `{json-filename}.spec.md`
   - Include: Purpose, schema, generation method, usage, example

## Examples

### Generate an Audit Report

```
Create an audit report for the folder cleanup completed today.

Category: agents
Title: Folder Audit - 2025-11-26
Summary: Cleaned up 45 files across agents, chatmodes, instructions, and prompts directories.

Key findings:
- Deleted 34 duplicate and copy files
- Renamed 7 files with incorrect extensions
- Moved 1 misplaced file
- Removed 2 empty directories
- Added frontmatter to AGENTS.md
```

### Generate a JSON Specification

```
Create a specification file for eslint-baseline.json that documents:
- The ESLint baseline output structure
- How it was generated (npm run lint output)
- Field definitions for errorCount, warningCount, files array
- How it's used to track improvement over time
```

### Generate a Weekly Summary

```
Create a weekly summary report covering:
- Reports generated this week
- Key metrics across all categories
- Notable changes or improvements
- Pending actions
```

## Guardrails

❌ **NEVER**:

- Store reports in root `/reports/` folder
- Use uppercase in filenames (except README.md)
- Create JSON without a spec file
- Omit required frontmatter fields

✅ **ALWAYS**:

- Use `.github/reports/{category}/` path
- Use lowercase filenames with hyphens
- Include complete frontmatter
- Create `.spec.md` for JSON files
- Link to related documentation

## Related

- [Reporting Instructions](../.github/instructions/reporting.instructions.md)
- [Reports Directory](../.github/reports/README.md)
- [Reporting Agent](../.github/agents/reporting.agent.md)

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

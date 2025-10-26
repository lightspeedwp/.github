---
file_type: documentation  
version: "2.0"
date_created: "2024-12-16"
date_modified: "2024-12-16"
modified_by: "LightSpeed-Agent"
author: "LightSpeed"
maintainer: "LightSpeed Team"
domain: "configuration"
stability: "stable"
description: "YAML frontmatter implementation guide aligned with unified schema for GitHub templates and AI files"
tags:
  - yaml
  - frontmatter
  - templates
  - schema
  - lightspeed
  - github-copilot
  - claude
  - gemini
references:
  - path: "../schemas/frontmatter.schema.json"
    description: "Unified frontmatter schema definition"
  - path: "YAML.md"
    description: "Comprehensive YAML configuration guide"
  - path: "../.github/instructions/tagging-and-frontmatter-conventions.instructions.md"
    description: "Tagging and frontmatter conventions"
---

# YAML Frontmatter Implementation Guide

A comprehensive guide to implementing YAML frontmatter across GitHub templates and AI files using the unified frontmatter schema. This guide ensures consistency between LightSpeed governance requirements and awesome-copilot conventions while maintaining compatibility with GitHub Copilot, Claude, and Gemini.

## Unified Schema Overview

The unified frontmatter schema (`../schemas/frontmatter.schema.json`) combines:

- **LightSpeed Governance**: Required fields for tracking, compliance, and lifecycle management
- **awesome-copilot Conventions**: Maintains compatibility with existing awesome-copilot workflows
- **AI Tool Compatibility**: Ensures proper validation by GitHub Copilot, Claude, and Gemini

### Core Field Categories

#### Required Fields (All Files)

```yaml
file_type: "instructions"           # File type classification
description: "Brief description"    # Clear purpose statement
version: "1.0"                     # Semantic versioning
date_created: "2024-12-16"         # ISO date format
modified_by: "username"            # Last modifier
author: "username"                 # Original author
maintainer: "Team Name"            # Current maintainer
domain: "development"              # LightSpeed domain
stability: "stable"                # Stability level
```

#### Recommended Fields

```yaml
tags:                              # Categorization tags
  - "copilot"
  - "instructions"
references:                        # Related file references
  - path: "relative/path/file.md"
    description: "Purpose of reference"
date_modified: "2024-12-16"        # Auto-updated on changes
priority: "medium"                 # Processing priority
owners:                            # Responsible teams
  - "lightspeed-team"
```

## File Type Specific Examples

### GitHub Copilot Instructions

```yaml
---
file_type: instructions
description: "Repository-specific instructions for GitHub Copilot"
apply_to:
  - "repository"
  - "all_files"
version: "1.0"
date_created: "2024-12-16"
modified_by: "username"
author: "username"
maintainer: "Development Team"
domain: "instructions"
stability: "stable"
tags:
  - "copilot"
  - "instructions"
  - "repository"
references:
  - path: "../../schemas/frontmatter.schema.json"
    description: "Frontmatter validation schema"
---
```

### Chatmode Configuration

```yaml
---
file_type: chatmode
name: "Code Review Assistant"
description: "Specialized chatmode for performing thorough code reviews"
version: "1.2"
date_created: "2024-12-16"
modified_by: "username"
author: "username"
maintainer: "Quality Team"
domain: "quality"
stability: "stable"
tools:
  - "github"
  - "static_analysis"
model: "gpt-4"
tags:
  - "code-review"
  - "quality-assurance"
references:
  - path: "../../schemas/frontmatter.schema.json"
    description: "Frontmatter validation schema"
  - path: "../instructions/code-review.instructions.md"
    description: "Code review guidelines"
---
```

### Prompt File Configuration

```yaml
---
file_type: prompt
name: "Bug Fix Generator"
description: "Generates comprehensive bug fix solutions with tests"
version: "2.1"
date_created: "2024-12-16"
modified_by: "username"
author: "username"
maintainer: "Development Team"
domain: "development"
stability: "stable"
mode: "coding"
model: "gpt-4"
tools:
  - "terminal"
  - "file_editor"
tags:
  - "debugging"
  - "testing"
  - "fixes"
references:
  - path: "../../schemas/frontmatter.schema.json"
    description: "Frontmatter validation schema"
---
```

### Claude Agent Configuration

```yaml
---
file_type: agent
name: "Documentation Specialist"
description: "Claude subagent specialized in technical documentation"
version: "1.0"
date_created: "2024-12-16"
modified_by: "username"
author: "username"
maintainer: "Documentation Team"
domain: "documentation"
stability: "stable"
model: "claude-3-sonnet"
temperature: 0.3
capabilities:
  - "markdown_generation"
  - "api_documentation"
  - "technical_writing"
tags:
  - "documentation"
  - "technical-writing"
  - "claude"
references:
  - path: "../../schemas/frontmatter.schema.json"
    description: "Frontmatter validation schema"
  - path: "../instructions/documentation-standards.instructions.md"
    description: "Documentation style guide"
---
```

### GitHub Issue Template

```yaml
---
name: "Bug Report"
description: "Report a bug in the project"
title: "[Bug]: "
labels: ["bug", "needs-triage"]
assignees: ["maintainer"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!
# LightSpeed-specific frontmatter (after GitHub template fields)
file_type: template
version: "1.0"
date_created: "2024-12-16"
modified_by: "username"
author: "username"
maintainer: "Support Team"
domain: "support"
stability: "stable"
tags:
  - "template"
  - "bug-report"
  - "github"
references:
  - path: "../../schemas/frontmatter.schema.json"
    description: "Frontmatter validation schema"
---
```

### Saved Reply Configuration

```yaml
---
file_type: saved_reply
title: "Thanks for contributing"
version: "1.0"
date_created: "2024-12-16"
modified_by: "username"
author: "username"
maintainer: "Community Team"
domain: "community"
stability: "stable"
description: "Standard thank you message for new contributors"
tags:
  - "saved-reply"
  - "community"
  - "welcome"
references:
  - path: "../../schemas/frontmatter.schema.json"
    description: "Frontmatter validation schema"
---
```

## Domain Classifications

The `domain` field uses LightSpeed-specific classifications:

- **development**: Code, scripts, development tools
- **quality**: Testing, validation, quality assurance
- **documentation**: Guides, references, documentation
- **instructions**: AI instructions, prompts, guidance
- **configuration**: Settings, schemas, configuration files
- **community**: Community interaction, saved replies
- **support**: Issue templates, support workflows
- **governance**: Compliance, policies, governance

## Stability Levels

- **experimental**: Early development, may change significantly
- **beta**: Feature complete but may have minor changes
- **stable**: Production ready, minimal changes expected
- **deprecated**: Phasing out, avoid new usage

## Validation and Compliance

All frontmatter is validated against `../schemas/frontmatter.schema.json`:

1. **Required Field Validation**: Ensures all mandatory fields are present
2. **Type Validation**: Validates field types and formats
3. **Domain Compliance**: Ensures proper domain classification
4. **Reference Validation**: Checks that referenced files exist
5. **Tag Consistency**: Validates tag format and allowed values

## Best Practices

### File Organization

- Keep frontmatter at the top of files
- Use consistent indentation (2 spaces)
- Group related fields together
- Order fields: required first, then recommended, then optional

### Content Guidelines

- Use clear, concise descriptions
- Keep tags specific and relevant
- Update `date_modified` when making changes
- Maintain accurate `references` paths
- Use semantic versioning for `version` field

### AI Tool Compatibility

- GitHub Copilot: Validates `apply_to`, `description` fields
- Claude: Uses `capabilities`, `model`, `temperature` fields
- Gemini: Compatible with standard frontmatter structure

## Migration from Legacy Formats

### From awesome-copilot

1. Add LightSpeed-required fields
2. Update `file_type` values to match unified schema
3. Add `references` field with schema path
4. Update tag format to array structure

### From WordPress-focused Templates

1. Replace WordPress-specific fields with unified equivalents
2. Update domain classifications
3. Add LightSpeed governance fields
4. Maintain backward compatibility where possible

## Troubleshooting

### Common Validation Errors

- **Missing required fields**: Add all required fields from unified schema
- **Invalid domain**: Use only approved domain classifications
- **Incorrect date format**: Use "YYYY-MM-DD" format for dates
- **Invalid references**: Ensure referenced files exist and use relative paths

### Tool-Specific Issues

- **GitHub Copilot**: Only `description` and `apply_to` are validated
- **Claude**: Requires `model` field for agent files
- **Gemini**: Compatible with standard YAML frontmatter

## Related Documentation

- [Unified Frontmatter Schema](../schemas/frontmatter.schema.json)
- [YAML Configuration Guide](YAML.md)
- [Tagging Conventions](../.github/instructions/tagging-and-frontmatter-conventions.instructions.md)
- [Mermaid Diagram Guidelines](../.github/instructions/mermaid-diagrams.instructions.md)

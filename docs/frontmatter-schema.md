---
file_type: "documentation"
title: "Frontmatter Schema Documentation"
version: "v1.2"
last_updated: "2025-10-23"
author: "LightSpeedWP"
maintainer: "Ash Shaw"
description: "Documentation and governance for the LightSpeedWP Markdown/JSON frontmatter schema."
tags: ["lightspeed","schema","frontmatter","governance"]
file_type: "spec"
---

## Frontmatter Schema Specification

This document describes the structure, fields, and validation rules for the LightSpeedWP frontmatter schema, used across Markdown and JSON files for documentation, agents, prompts, and configuration.

## Purpose

- Ensure consistent metadata for all documentation, agent, and configuration files.
- Power automation, validation, and discoverability in the LightSpeedWP ecosystem.
- Support VS Code, Copilot, and other tools with a single source of truth.

## Location

- **Schema file:** `schemas/frontmatter.schema.json`
- **This documentation:** `docs/frontmatter-schema.md`

## Referencing the Schema

**How to reference in documentation:**

```markdown
**JSON Schema:**  
See [`schemas/frontmatter.schema.json`](../schemas/frontmatter.schema.json)
```

**How to reference in frontmatter files (YAML):**

```yaml
$schema: "schemas/frontmatter.schema.json"
---
title: "..."
```

## Typical Fields

| Field        | Type     | Required | Description                                              |
| ------------ | -------- | -------- | -------------------------------------------------------- |
| title        | string   | yes      | Human-readable title                                     |
| description  | string   | yes      | Brief summary of the file's purpose                      |
| version      | string   | yes      | Schema or document version (e.g. v1.0)                   |
| last_updated | string   | yes      | ISO date of last update                                  |
| author       | string   | yes      | Main author or team                                      |
| maintainer   | string   | yes      | Who's responsible for changes                            |
| tags         | string[] | no       | Keywords for search/filtering                            |
| type         | string   | yes      | Type of file (e.g. "agent", "instructions")              |
| references   | string[] | no       | **AI-relevant cross-links** for automation and discovery |

## Dual Reference System

The LightSpeedWP frontmatter schema implements a **dual reference system** to serve both AI automation and human navigation needs:

### 🤖 AI References (Frontmatter)

- **Location**: `references` field in YAML frontmatter
- **Purpose**: Machine-readable cross-links for AI agents, automation, and discovery
- **Audience**: GitHub Copilot, automation agents, search indexing
- **Format**: Relative paths to related files that AI should understand

### 👥 Human References (Footer)

- **Location**: Reference section at the end of the document
- **Purpose**: Human-readable navigation links with context
- **Audience**: Developers, contributors, documentation readers
- **Format**: Markdown links with descriptions and context

## Example Frontmatter Implementation

```yaml
$schema: "schemas/frontmatter.schema.json"
---
title: "Labeling Agent Spec"
description: "Automated labeling system for issues and pull requests"
version: "v1.2"
last_updated: "2025-10-24"
author: "LightSpeedWP"
maintainer: "Ash Shaw"
tags: ["lightspeed", "labeling", "agents", "automation"]
type: "agent"
references:
  - "../workflows/labeling.yml"
  - "../prompts/label-issues.prompt.md"
  - "./agents.instructions.md"
  - "../ISSUE_LABELS.md"
  - "../PR_LABELS.md"
---

# 🏷️ Labeling Agent Specification

[Document content here...]

## 🔗 Related Documentation

- **[Labeling Workflow](../workflows/labeling.yml)** - GitHub Actions implementation
- **[Issue Labels](../ISSUE_LABELS.md)** - Complete labeling taxonomy
- **[PR Labels](../PR_LABELS.md)** - Pull request labeling standards
- **[Label Issues Prompt](../prompts/label-issues.prompt.md)** - AI prompt for labeling

---

_This agent specification ensures consistent issue and PR labeling across the LightSpeedWP organization._
```

### ✅ Best Practices

1. **AI References** should include:
   - Related workflow files
   - Dependent instruction files
   - Associated prompt files
   - Configuration files
   - Schema files

2. **Human References** should include:
   - Contextual descriptions
   - Navigation aids
   - Related documentation
   - External resources
   - Explanatory links

## 📋 Reference Implementation Guidelines

### 🤖 AI References Examples by File Type

#### Agent Files (`.agent.md`)

```yaml
references:
  - "../workflows/agent-name.yml"
  - "../prompts/agent-prompt.prompt.md"
  - "./agents.instructions.md"
  - "../ISSUE_LABELS.md"
```

#### Instruction Files (`.instructions.md`)

```yaml
references:
  - "./coding-standards.instructions.md"
  - "../workflows/README.md"
  - "../agents/README.md"
  - "../custom-instructions.md"
```

#### Prompt Files (`.prompt.md`)

```yaml
references:
  - "../instructions/prompts.instructions.md"
  - "../chatmodes/chatmodes.md"
  - "../agents/agent-name.agent.md"
```

#### Workflow Files (`.yml`)

```yaml
references:
  - "../agents/agent-name.agent.md"
  - "../instructions/workflows.instructions.md"
  - "../AUTOMATION_GOVERNANCE.md"
```

### 👥 Human Reference Patterns

Use descriptive markdown links that help humans understand context:

```markdown
## 🔗 Related Documentation

### 📚 Core Resources

- **[Automation Governance](../AUTOMATION_GOVERNANCE.md)** - Organization automation policies
- **[Coding Standards](./instructions/coding-standards.instructions.md)** - Development guidelines

### ⚙️ Implementation Details

- **[Labeling Workflow](../workflows/labeling.yml)** - GitHub Actions automation
- **[Test Configuration](../jest.config.js)** - Testing framework setup

### 🎯 Specialized Guides

- **[WordPress Development](./instructions/wordpress.instructions.md)** - WP-specific practices
- **[Security Guidelines](./instructions/security.instructions.md)** - Security best practices
```

## Validation

- The official schema is at `schemas/frontmatter.schema.json`
- All files in agents, prompts, instructions, and docs must have valid frontmatter.
- VS Code and Copilot should be configured to use this schema for validation.

## References

- [Schema JSON file](../schemas/frontmatter.schema.json)
- [VS Code Settings](../.vscode/settings.json)
- [LightSpeedWP Governance](../GOVERNANCE.md)

---

*Keep this document and the schema in sync. PRs are welcome for improvements!*

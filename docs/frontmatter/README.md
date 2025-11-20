---
file_type: "documentation"
title: "YAML Frontmatter Documentation"
description: "YAML frontmatter schemas and guidelines for LightSpeed documentation files"
version: "1.0"
last_updated: "2025-11-12"
maintainer: "LightSpeed Team"
tags: ["frontmatter", "yaml", "metadata", "documentation"]
---

# YAML Frontmatter Documentation

This directory contains documentation for YAML frontmatter standards, schemas, and usage guidelines for LightSpeed documentation files.

## Purpose

Ensures consistent metadata and discoverability across all LightSpeed documentation by:

- Defining standard frontmatter schemas for different file types
- Providing templates and examples for common use cases
- Enabling automated documentation indexing and validation

## Contents

### Core Documentation Files

- **agents-md.md** – Frontmatter schema for AI agent specification files
- **chatmodes.md** – Frontmatter schema for AI chat mode configuration files
- **claude-agents.md** – Frontmatter schema for Claude agent instruction files
- **copilot-instructions.md** – Frontmatter schema for GitHub Copilot instruction files
- **gemini-md.md** – Frontmatter schema for Gemini AI instruction files
- **issue-templates.md** – Frontmatter schema for GitHub issue template files
- **pr-templates.md** – Frontmatter schema for GitHub pull request template files
- **prompt-files.md** – Frontmatter schema for AI prompt library files
- **saved-replies.md** – Frontmatter schema for GitHub saved reply files

### Schema Definitions

- **schemas/** – JSON Schema files for frontmatter validation

## Inputs

- Markdown files requiring standardized metadata
- Documentation files for AI agents, templates, and workflows
- Files requiring automated indexing or categorization

## Outputs

- Valid, consistent YAML frontmatter across all documentation
- Automated documentation indexes and navigation
- Enhanced discoverability and searchability
- VS Code IntelliSense and validation for frontmatter fields

## Usage Examples

### Example 1: Agent File Frontmatter

```yaml
---
title: "Release Agent"
description: "Automates release notes and changelog generation"
version: "1.0"
agent_type: "automation"
capabilities: ["changelog", "release-notes", "versioning"]
---
```

### Example 2: Issue Template Frontmatter

```yaml
---
name: "Bug Report"
about: "Report a bug or defect"
title: "Bug: [short description]"
labels: ["type:bug", "status:triage"]
---
```

## Related Documentation

- [YAML Frontmatter Guide](../YAML-Frontmatter.md) – Comprehensive frontmatter usage guide
- [Chatmode Frontmatter](../CHATMODE-FRONTMATTER.md) – Detailed chatmode schema documentation
- [Schemas Directory](../../schemas/README.md) – JSON Schema definitions for validation

---

**Maintained by LightSpeed Team** • For updates or questions, see [CONTRIBUTING.md](../../CONTRIBUTING.md)

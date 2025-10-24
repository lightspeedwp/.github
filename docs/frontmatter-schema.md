---
title: "Frontmatter Schema Documentation"
version: "v1.2"
last_updated: "2025-10-23"
author: "LightSpeedWP"
maintainer: "Ash Shaw"
description: "Documentation and governance for the LightSpeedWP Markdown/JSON frontmatter schema."
tags: ["lightspeed","schema","frontmatter","governance"]
type: "spec"
---

# Frontmatter Schema Specification

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

```
**JSON Schema:**  
See [`schemas/frontmatter.schema.json`](../schemas/frontmatter.schema.json)
```

**How to reference in frontmatter files (YAML):**

```yaml
$schema: "schemas/frontmatter.schema.json"
---
title: "..."
...
```

## Typical Fields

| Field         | Type     | Required | Description                                |
|---------------|----------|----------|--------------------------------------------|
| title         | string   | yes      | Human-readable title                       |
| description   | string   | yes      | Brief summary of the file's purpose        |
| version       | string   | yes      | Schema or document version (e.g. v1.0)     |
| last_updated  | string   | yes      | ISO date of last update                    |
| author        | string   | yes      | Main author or team                        |
| maintainer    | string   | yes      | Who's responsible for changes              |
| tags          | string[] | no       | Keywords for search/filtering              |
| type          | string   | yes      | Type of file (e.g. "agent", "instructions")|

## Example Frontmatter (Markdown)

NOTE: Use the correct pass to the references.

```
$schema: "schemas/frontmatter.schema.json"
---
title: "Labeling Agent Spec"
version: "v1.2"
last_updated: "2025-10-23"
author: "LightSpeedWP"
maintainer: "Ash Shaw"
description: "Spec for the Labeling Agent."
tags: ["lightspeed","labeling","agents"]
type: "agent"
references:
  - "CONTRIBUTING.md"
  - "README.md"
  - ".github/README.md"
  - ".docs/README.md"
---
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

_Keep this document and the schema in sync. PRs are welcome for improvements!_
---
title: "Frontmatter Instructions"
version: "v1.1"
last_updated: "2025-10-23"
author: "LightSpeedWP"
maintainer: "Ash Shaw"
description: "Instructions for creating and validating YAML frontmatter for all LightSpeedWP documentation and code files."
tags: ["lightspeed","frontmatter","instructions"]
type: "instructions"
---
_Note: This file follows LightSpeedWP governance and metadata conventions as described in [schemas/frontmatter.schema.json](../../schemas/frontmatter.schema.json)._

# Frontmatter Instructions

## Purpose

- Every documentation, agent, configuration, and markdown file must contain a valid YAML frontmatter block.
- Frontmatter enables automation, search, discoverability, and validation by humans and machines.

## Required Fields

See the canonical [frontmatter schema](../../schemas/frontmatter.schema.json) for the full list and validation.

| Field         | Type     | Required | Description                                |
|---------------|----------|----------|--------------------------------------------|
| title         | string   | yes      | Human-readable title                       |
| version       | string   | yes      | Version string (e.g., v1.1)                |
| last_updated  | string   | yes      | ISO date of last update (e.g., 2025-10-23) |
| author        | string   | yes      | Main author or responsible party           |
| maintainer    | string   | yes      | Maintainer or team                         |
| description   | string   | yes      | Short summary of the file's purpose        |
| tags          | string[] | no       | Keywords for search/filtering              |
| type          | string   | yes      | File type (e.g., "agent", "instructions")  |

## Example

```yaml
$schema: "schemas/frontmatter.schema.json"
---
title: "Pattern Development Instructions"
version: "v1.1"
last_updated: "2025-10-23"
author: "LightSpeedWP"
maintainer: "Ash Shaw"
description: "Instructions for developing block patterns."
tags: ["lightspeed", "patterns", "instructions"]
type: "instructions"
---
```

## Validation

- All frontmatter must validate against the schema at `schemas/frontmatter.schema.json`
- VS Code and Copilot validate automatically if configured (see `.vscode/settings.json`).

## References

- [Frontmatter Schema Documentation](../../docs/frontmatter-schema.md)
- [Schema JSON file](../../schemas/frontmatter.schema.json)
- [VS Code Settings](../../.vscode/settings.json)

---
---
title: 'Frontmatter Schema Documentation'
description: 'Unified frontmatter schema for LightSpeed .github files, validation tools, and usage guidelines'
version: 'v1.0'
last_updated: '2025-11-12'
file_type: 'documentation'
tags: ['schema', 'frontmatter', 'validation', 'yaml']
references:
  - path: '../../docs/CHATMODE-FRONTMATTER.md'
    description: 'Frontmatter conventions guide'
  - path: '../../.github/instructions/frontmatter.instructions.md'
    description: 'Frontmatter instructions for AI agents'
  - path: '../../.github/instructions/tagging-and-frontmatter-conventions.instructions.md'
    description: 'Tagging conventions'
---

# Frontmatter Schema

This folder contains the unified frontmatter schema used across all LightSpeed `.github` configuration files, along with validation tools, examples, and documentation.

## Overview

The `frontmatter.schema.json` file is a JSON Schema (Draft 07) that validates YAML frontmatter in:

- Agent specifications (`.github/agents/*.agent.md`)
- Instructions (`.github/instructions/*.instructions.md`)
- Prompts (`.github/prompts/*.prompt.md`)
- Chatmodes (`.github/chatmodes/*.chatmode.md`)
- Documentation (`docs/*.md`)
- GitHub templates (issue, PR, discussion templates)
- Root configuration files (`CLAUDE.md`, `GEMINI.md`, `AGENTS.md`)

## Files

```
frontmatter/
├── frontmatter.schema.json   # The main JSON Schema
├── validate.js                # Validation CLI tool
├── package.json               # Dependencies for validation
├── README.md                  # This file
├── examples/                  # Example frontmatter
│   ├── agent.example.md
│   ├── instruction.example.md
│   └── prompt.example.md
└── tests/                     # Validation tests
    └── schema.test.js
```

## Quick Start

### Installation

```bash
cd schemas/frontmatter
npm install
```

### Validate All Files

```bash
npm run validate
```

### Validate Specific File

```bash
node validate.js path/to/file.md
```

### Validate Schema Only

```bash
npm run validate:schema
```

## Schema Structure

The schema uses JSON Schema's `oneOf` discriminator pattern with `file_type` as the discriminator property. Each file type has specific requirements:

### Common Fields

Available across all file types (via `$ref: "#/definitions/commonFields"`):

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Human-readable title |
| `description` | string | Brief description of purpose (required for most types) |
| `version` | string | Version string (e.g., v1.1) |
| `created_date` | date | ISO date when file was created |
| `last_updated` | date | ISO date of last update |
| `author` | string | Main author or responsible party |
| `maintainer` | string | Current maintainer or team |
| `owners` | array | List of owners/maintainers |
| `tags` | array | Keywords for discovery (max 8) |
| `status` | enum | `active`, `deprecated`, `draft`, `experimental` |
| `stability` | enum | `stable`, `experimental`, `incubating` |
| `deprecated` | boolean | Whether this file is deprecated |
| `replacement` | string | Path to replacement file if deprecated |
| `domain` | enum | Primary classification domain |
| `references` | array | AI-focused references to related files |

### File Types

Each `file_type` has specific required and optional fields:

- **`agent`**: Agent specifications (`.github/agents/*.agent.md`)
- **`instructions`**: Instructions files (`.github/instructions/*.instructions.md`)
- **`prompt`**: Prompt specifications (`.github/prompts/*.prompt.md`)
- **`chatmode`**: Chatmode configurations (`.github/chatmodes/*.chatmode.md`)
- **`documentation`**: General docs (`docs/*.md`)
- **`issue-template`**: GitHub issue templates
- **`pr-template`**: GitHub PR templates
- And more...

See the schema file for complete definitions.

## Usage in Files

### Reference the Schema

Add a `$schema` property in your YAML frontmatter:

```yaml
---
$schema: "schemas/frontmatter.schema.json"
file_type: "agent"
name: "example-agent"
description: "An example agent specification"
---
```

### VSCode Integration

VSCode will automatically validate YAML frontmatter if you have the YAML extension installed and the schema properly referenced.

Add to `.vscode/settings.json`:

```json
{
  "yaml.schemas": {
    "./schemas/frontmatter.schema.json": [
      ".github/agents/*.md",
      ".github/instructions/*.md",
      ".github/prompts/*.md",
      ".github/chatmodes/*.md",
      "docs/*.md"
    ]
  }
}
```

## Validation

### Manual Validation

```bash
# Validate all files
npm run validate

# Validate specific file
node validate.js .github/agents/example.agent.md

# Only check if schema is valid
npm run validate:schema
```

### CI/CD Validation

The validation script is integrated into GitHub Actions. See `.github/workflows/frontmatter-validation.yml`.

### Pre-commit Hook

To validate frontmatter before committing:

```bash
# .git/hooks/pre-commit
#!/bin/bash
cd schemas/frontmatter
npm run validate
```

## Examples

See the `examples/` directory for complete examples of each file type:

- `agent.example.md` - Agent specification
- `instruction.example.md` - Instructions file
- `prompt.example.md` - Prompt specification

## Testing

Run the test suite:

```bash
npm test
```

## Updating the Schema

When updating `frontmatter.schema.json`:

1. **Edit the schema** - Make your changes following JSON Schema Draft 07 spec
2. **Validate the schema** - Run `npm run validate:schema`
3. **Update examples** - Ensure examples in `examples/` reflect changes
4. **Update documentation** - Update this README and related docs
5. **Run full validation** - Run `npm run validate` to check all files
6. **Update version** - Increment version in schema's `title` or add a `version` field
7. **Commit changes** - Include rationale in commit message
8. **Update references** - If path changed, update all referencing files

## Migration

The schema consolidated at `schemas/frontmatter.schema.json` serves as the canonical reference for all frontmatter validation.

If you encounter broken references, update them to the new path:

```diff
- $schema: "schemas/frontmatter.schema.json"
+ $schema: "schemas/frontmatter.schema.json"
```

## Resources

- [JSON Schema Specification](https://json-schema.org/specification.html)
- [AJV Documentation](https://ajv.js.org/)
- [YAML Specification](https://yaml.org/spec/)
- [LightSpeed Frontmatter Conventions](../../docs/CHATMODE-FRONTMATTER.md)
- [Frontmatter Instructions](../../.github/instructions/frontmatter.instructions.md)

## Support

For questions or issues:

1. Check [GitHub Discussions](https://github.com/orgs/lightspeedwp/discussions)
2. Review [CHATMODE-FRONTMATTER.md](../../docs/CHATMODE-FRONTMATTER.md)
3. Reference [frontmatter.instructions.md](../../.github/instructions/frontmatter.instructions.md)
4. Open an issue following the [issue template](../../.github/ISSUE_TEMPLATE/)

---

**Maintainer**: LightSpeed Team
**Last Updated**: 2025-11-12
**Version**: 1.0

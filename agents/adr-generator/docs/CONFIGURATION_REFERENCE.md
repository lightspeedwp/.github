---
file_type: reference
title: ADR Generator — Configuration Reference
description: Complete reference for all .adr-config.json options
version: 1.0.0
created_date: 2026-08-18
last_updated: 2026-08-18
---

# ADR Generator Configuration Reference

Complete reference for all configuration options in `.adr-config.json`.

## Configuration Structure

```json
{
  "organization": "string",
  "adr_directory": "string",
  "numbering_scheme": "sequential|date-based|custom",
  "prefix": "string",
  "templates": {
    "default": "string",
    "variants": ["string"]
  },
  "metadata": {
    "required_fields": ["string"],
    "optional_fields": ["string"],
    "custom_fields": {}
  },
  "validation": {
    "enabled": boolean,
    "rules": ["string"]
  }
}
```

## Top-Level Options

### `organization`

**Type:** `string`  
**Required:** Yes  
**Default:** `"lightspeedwp"`

The organization or team name. Used in metadata and configuration inheritance.

```json
"organization": "lightspeedwp"
```

### `adr_directory`

**Type:** `string`  
**Required:** No  
**Default:** `"docs/adr"`

Path to the directory where ADR files are stored, relative to repository root.

```json
"adr_directory": "docs/adr"
```

Valid paths:
- `.github/adr` — Control-plane repository
- `docs/adr` — Standard organization repository
- `docs/decisions` — Custom naming
- `.adr` — Root directory (not recommended)

### `numbering_scheme`

**Type:** `"sequential" | "date-based" | "custom"`  
**Required:** No  
**Default:** `"sequential"`

The numbering pattern for new ADRs.

#### Sequential

Numbered ADRs: 0001, 0002, 0003...

```json
"numbering_scheme": "sequential"
```

Generates filenames: `adr-0001-slug.md`, `adr-0002-slug.md`

#### Date-Based

Numbered by date: 2026-08-18, 2026-08-18-1, 2026-08-18-2...

```json
"numbering_scheme": "date-based"
```

Generates filenames: `adr-2026-08-18-slug.md`, `adr-2026-08-18-1-slug.md`

Useful for rapid iterations where multiple decisions happen same day.

#### Custom

Custom numbering pattern (future feature).

```json
"numbering_scheme": "custom",
"custom_pattern": "YYYY-Q-NNN"
```

### `prefix`

**Type:** `string`  
**Required:** No  
**Default:** `"adr"`

Prefix for ADR filenames.

```json
"prefix": "adr"
```

Examples:
- `adr-0001-slug.md` (prefix: "adr")
- `decision-0001-slug.md` (prefix: "decision")
- `arch-0001-slug.md` (prefix: "arch")

## Templates

### `templates.default`

**Type:** `string`  
**Required:** No  
**Default:** `"standard"`

The default template variant used when creating new ADRs.

```json
"templates": {
  "default": "standard"
}
```

Valid options:
- `"standard"` — Full-featured, all sections
- `"lightweight"` — Minimal, essential sections only
- `"security"` — Security-focused with threat analysis
- `"infrastructure"` — Infrastructure-specific with deployment details

### `templates.variants`

**Type:** `array<string>`  
**Required:** No  
**Default:** All variants available

List of template variants available for ADRs. Users can choose variants when creating.

```json
"templates": {
  "default": "standard",
  "variants": ["lightweight", "security"]
}
```

This limits users to only the variants listed. Empty array means all available templates can be used.

## Metadata Configuration

### `metadata.required_fields`

**Type:** `array<string>`  
**Required:** No  
**Default:** `["status", "date", "authors"]`

Fields that must be present in all ADRs.

```json
"metadata": {
  "required_fields": ["status", "date", "authors"]
}
```

Built-in fields:
- `status` — Decision status (Proposed, Accepted, Deprecated, Superseded)
- `date` — Decision date (YYYY-MM-DD)
- `authors` — ADR authors
- `context` — Problem context
- `decision` — Chosen solution
- `consequences` — Results and implications
- `alternatives` — Alternatives considered
- `relates_to` — Related ADRs
- `supersedes` — ADRs this supersedes
- `superseded_by` — ADRs that supersede this

### `metadata.optional_fields`

**Type:** `array<string>`  
**Required:** No  
**Default:** `[]`

Fields that may be present in ADRs but are not required.

```json
"metadata": {
  "optional_fields": ["related_issues", "tags"]
}
```

### `metadata.custom_fields`

**Type:** `object`  
**Required:** No  
**Default:** `{}`

Custom metadata fields specific to your organization or repository type.

```json
"metadata": {
  "custom_fields": {
    "plugin_version": "Version when decision was made",
    "affected_hooks": "WordPress hooks involved",
    "priority": "High|Medium|Low",
    "implementation_date": "When decision was implemented"
  }
}
```

Custom field values are shown in templates as optional sections.

## Validation Configuration

### `validation.enabled`

**Type:** `boolean`  
**Required:** No  
**Default:** `true`

Enable or disable validation of ADRs.

```json
"validation": {
  "enabled": true
}
```

### `validation.rules`

**Type:** `array<string>`  
**Required:** No  
**Default:** All rules enabled

List of validation rules to enforce.

```json
"validation": {
  "rules": [
    "enforceUniqueTitle",
    "enforceValidReferences",
    "enforceValidStatus",
    "enforceValidFormat",
    "enforceFilenameFormat",
    "enforceRequiredMetadata"
  ]
}
```

#### Rule Reference

| Rule | Description | Checks |
|------|-------------|--------|
| `enforceUniqueTitle` | No duplicate decision titles | Titles across all ADRs |
| `enforceValidReferences` | Referenced ADRs exist | `relates_to`, `supersedes`, `superseded_by` fields |
| `enforceValidStatus` | Status values are in allowed set | Valid: Proposed, Accepted, Deprecated, Superseded |
| `enforceValidFormat` | YAML frontmatter and markdown structure valid | Frontmatter syntax, markdown headings |
| `enforceFilenameFormat` | Filenames match numbering pattern | Matches configured numbering scheme |
| `enforceRequiredMetadata` | All required fields present | Checks against `metadata.required_fields` |

## Configuration Inheritance

The agent supports two-level configuration inheritance:

1. **Organization defaults** — `.adr-config.json` at repository root
2. **Repository overrides** — Subdirectory-specific config (future feature)

Current implementation uses repository root config as the single source of truth.

## Complete Examples

### Minimal Configuration

```json
{
  "organization": "lightspeedwp"
}
```

Uses all defaults. Creates sequential ADRs in `docs/adr/` with standard template.

### Organization Repository (Recommended)

```json
{
  "organization": "lightspeedwp",
  "adr_directory": "docs/adr",
  "numbering_scheme": "sequential",
  "prefix": "adr",
  "templates": {
    "default": "standard",
    "variants": ["lightweight", "security", "infrastructure"]
  },
  "metadata": {
    "required_fields": ["status", "date", "authors"],
    "optional_fields": ["related_issues", "supersedes"],
    "custom_fields": {}
  },
  "validation": {
    "enabled": true,
    "rules": [
      "enforceUniqueTitle",
      "enforceValidReferences",
      "enforceValidStatus",
      "enforceValidFormat",
      "enforceFilenameFormat",
      "enforceRequiredMetadata"
    ]
  }
}
```

### Control-Plane Repository

```json
{
  "organization": "lightspeedwp",
  "adr_directory": ".github/adr",
  "numbering_scheme": "sequential",
  "prefix": "adr",
  "templates": {
    "default": "standard"
  },
  "metadata": {
    "required_fields": ["status", "date", "authors"],
    "custom_fields": {
      "affected_workflows": "CI/CD workflows involved"
    }
  },
  "validation": {
    "enabled": true,
    "rules": [
      "enforceUniqueTitle",
      "enforceValidReferences",
      "enforceValidStatus",
      "enforceValidFormat",
      "enforceFilenameFormat"
    ]
  }
}
```

### WordPress Plugin

```json
{
  "organization": "lightspeedwp",
  "adr_directory": "docs/adr",
  "numbering_scheme": "date-based",
  "prefix": "adr",
  "templates": {
    "default": "lightweight",
    "variants": ["standard"]
  },
  "metadata": {
    "required_fields": ["status", "date"],
    "optional_fields": ["authors"],
    "custom_fields": {
      "plugin_version": "Version when decision was made",
      "affected_hooks": "WordPress hooks involved",
      "breaking_change": "true|false"
    }
  },
  "validation": {
    "enabled": true,
    "rules": [
      "enforceUniqueTitle",
      "enforceValidStatus",
      "enforceValidFormat"
    ]
  }
}
```

## Schema Validation

All configurations are validated against the JSON schema at:

```
agents/adr-generator/config/adr-config.schema.json
```

Invalid configurations will be rejected at load time with clear error messages.

## Configuration Best Practices

1. **Start with defaults** — Use minimal config, add options as needed
2. **Document custom fields** — Always include descriptions for custom metadata
3. **Limit template variants** — Reduce to variants actually used in your org
4. **Enable validation gradually** — Start with core rules, add more as adoption grows
5. **Use date-based numbering for rapid iterations** — Useful for fast-moving teams
6. **Use sequential numbering for stable ADRs** — Cleaner for long-lived decisions

## Troubleshooting

### Configuration not recognized

**Check:**
1. File is named exactly `.adr-config.json`
2. File is in repository root (not subdirectory)
3. JSON syntax is valid (no trailing commas)
4. Use `npm test` to validate config against schema

### Custom fields not appearing in template

**Check:**
1. Fields are defined in `metadata.custom_fields`
2. Template variant supports custom fields (standard and security do)
3. Regenerate ADR to pick up new config

### Validation errors on existing ADRs

**Check:**
1. Review enabled validation rules in config
2. Verify existing ADR metadata matches required fields
3. Check ADR filenames match numbering pattern
4. Run `claude adr-generator validate` to see specific errors

## See Also

- [Installation Guide](INSTALLATION.md) — Setup instructions
- [Best Practices](BEST_PRACTICES.md) — When and how to write ADRs
- [Architecture](ARCHITECTURE.md) — System design

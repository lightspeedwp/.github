# ADR Configuration Reference

Complete field-by-field documentation for `.adr-config.json` configuration.

## Structure

All configuration is nested under the `adr` key:

```json
{
  "adr": {
    "directory": "string",
    "template": "string",
    "number_format": { ... },
    "approval_workflow": { ... },
    "metadata": { ... },
    "custom_fields": { ... },
    "validation": { ... }
  }
}
```

## Core Fields

### `adr.directory` (required)

**Type:** string  
**Default:** `"docs/adr"`  

Directory where ADRs are stored (relative to repo root).

### `adr.template` (optional)

**Type:** string (enum)  
**Default:** `"standard"`  
**Values:** `"standard"`, `"lightweight"`, `"security"`, `"infrastructure"`

Template variant to use when generating ADRs.

### `adr.number_format` (optional)

Configuration for ADR numbering scheme.

- `style` — `"sequential"`, `"date-based"`, or `"custom"`
- `zero_padded` — Whether to pad numbers (default: true)
- `width` — Padding width 2-8 (default: 4)
- `date_format` — `"YYYYMMDD"` or `"YYYY-MM-DD"`
- `custom_pattern` — Custom pattern with template variables

### `adr.approval_workflow` (optional)

Configuration for approval workflows.

- `enabled` — Enable/disable (default: false)
- `method` — `"none"`, `"codeowners"`, or `"custom"`
- `required_approvals` — Number required (default: 1)
- `custom_approvers` — List of GitHub usernames/teams

### `adr.metadata` (optional)

Metadata field configuration.

- `required_fields` — Required frontmatter fields
- `optional_fields` — Optional frontmatter fields

### `adr.custom_fields` (optional)

Custom fields for integrations.

- `wordpress.impact_areas` — WordPress areas affected
- `wordpress.performance_tier` — Performance level
- `wordpress.backwards_compatible` — Compatibility flag

### `adr.validation` (optional)

Validation rules.

- `enforce_unique_titles` — Reject duplicate titles
- `enforce_valid_references` — Validate references
- `enforce_status_transitions` — Validate transitions
- `minimum_content_length` — Minimum body length

## Complete Example

```json
{
  "adr": {
    "directory": "docs/adr",
    "template": "standard",
    "number_format": {
      "style": "sequential",
      "zero_padded": true,
      "width": 4
    },
    "approval_workflow": {
      "enabled": false,
      "method": "none"
    },
    "metadata": {
      "required_fields": ["date", "status", "authors"],
      "optional_fields": ["supersedes", "superseded-by", "tags"]
    },
    "validation": {
      "enforce_unique_titles": true,
      "enforce_valid_references": true,
      "minimum_content_length": 100
    }
  }
}
```

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

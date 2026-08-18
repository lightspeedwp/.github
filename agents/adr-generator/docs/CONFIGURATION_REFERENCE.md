---
title: ADR Generator — Configuration Reference
description: Complete reference for all .adr-config.json options
---

# Configuration Reference

Complete reference for all configuration options in `.adr-config.json`.

## Root Configuration Object

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

## ADR Storage

### `directory` (string, required)

The directory where ADR files are stored.

```json
{
  "adr": {
    "directory": "docs/adr"
  }
}
```

**Examples:**
- Control-plane: `docs/adr` or `.github/adr`
- Plugin: `docs/decisions` or `architecture/decisions`
- Theme: `docs/architectural-decisions` or `decisions`

**Default:** `docs/adr`

---

## Templates

### `template` (string, required)

Which template variant to use for new ADRs.

**Valid values:**
- `standard` — Full ADR with all sections
- `lightweight` — Minimal ADR (decision, rationale, consequences)
- `security` — Security-focused with threat model
- `infrastructure` — Infrastructure & scalability focus

```json
{
  "adr": {
    "template": "standard"
  }
}
```

**Default:** `standard`

---

## Numbering

### `number_format` (object, required)

Configuration for how ADRs are numbered.

```json
{
  "adr": {
    "number_format": {
      "style": "sequential",
      "zero_padded": true,
      "width": 4
    }
  }
}
```

#### `style` (string)

The numbering strategy.

**Valid values:**
- `sequential` — 0001, 0002, 0003...
- `date-based` — 2026-08-17, 2026-08-18...
- `custom` — Custom pattern (requires `pattern` field)

**Default:** `sequential`

#### `zero_padded` (boolean)

Whether to pad numbers with leading zeros.

**Valid values:** `true`, `false`

**Default:** `true`

**Examples:**
- `true` → 0001, 0002, 0100
- `false` → 1, 2, 100

#### `width` (number)

Padding width (only used if `zero_padded` is true).

**Valid values:** 2-6

**Default:** `4`

**Examples:**
- `2` → 01, 02, 99
- `4` → 0001, 0002, 0999
- `6` → 000001, 000002, 999999

---

## Approval Workflows

### `approval_workflow` (object, optional)

Configuration for ADR approval process.

```json
{
  "adr": {
    "approval_workflow": {
      "enabled": true,
      "method": "codeowners",
      "required_approvals": 1
    }
  }
}
```

#### `enabled` (boolean)

Whether approval workflow is required.

**Valid values:** `true`, `false`

**Default:** `false`

#### `method` (string)

How approval is managed.

**Valid values:**
- `none` — No approval required
- `codeowners` — Use CODEOWNERS file
- `custom` — Custom approver list

**Default:** `none`

#### `required_approvals` (number)

Number of approvals required before ADR is accepted.

**Valid values:** 1-5

**Default:** `1`

---

## Metadata

### `metadata` (object, required)

Required and optional frontmatter fields.

```json
{
  "adr": {
    "metadata": {
      "required_fields": ["title", "date", "status", "authors"],
      "optional_fields": ["supersedes", "superseded-by", "tags"]
    }
  }
}
```

#### `required_fields` (array)

Frontmatter fields that must be present in all ADRs.

**Default:**
```json
["title", "date", "status", "authors"]
```

**Common options:**
- `title` — Decision title
- `date` — Date created
- `status` — PROPOSED, ACCEPTED, SUPERSEDED, REJECTED
- `authors` — Decision makers
- `supersedes` — Previous ADR number
- `superseded-by` — Superseding ADR number

#### `optional_fields` (array)

Frontmatter fields that may be present.

**Default:**
```json
["supersedes", "superseded-by", "tags"]
```

---

## Custom Fields

### `custom_fields` (object, optional)

Project-specific or WordPress-specific metadata.

```json
{
  "adr": {
    "custom_fields": {
      "wordpress": {
        "impact_areas": ["performance"],
        "performance_tier": "medium",
        "backwards_compatible": true
      }
    }
  }
}
```

#### WordPress Fields

```json
{
  "custom_fields": {
    "wordpress": {
      "impact_areas": [],           // array of strings
      "performance_tier": "medium", // "low", "medium", "high"
      "backwards_compatible": true  // boolean
    }
  }
}
```

**impact_areas options:**
- `performance` — Affects performance
- `security` — Security implications
- `compatibility` — Backwards compatibility impact
- `ui` — User interface changes
- `api` — API changes

---

## Validation

### `validation` (object, required)

Which validation rules are enforced.

```json
{
  "adr": {
    "validation": {
      "enforce_unique_titles": true,
      "enforce_valid_references": true,
      "enforce_status_transitions": false,
      "minimum_content_length": 100
    }
  }
}
```

#### `enforce_unique_titles` (boolean)

Prevent duplicate decision titles.

**Default:** `true`

#### `enforce_valid_references` (boolean)

Validate that all ADR cross-references exist.

**Default:** `true`

#### `enforce_status_transitions` (boolean)

Enforce valid state transitions (PROPOSED → ACCEPTED → SUPERSEDED).

**Default:** `false`

#### `minimum_content_length` (number)

Minimum characters required in ADR content (excluding frontmatter).

**Valid values:** 0-10000

**Default:** `100`

---

## Complete Examples

### Control-Plane Repository

```json
{
  "adr": {
    "directory": ".github/adr",
    "template": "standard",
    "number_format": {
      "style": "sequential",
      "zero_padded": true,
      "width": 4
    },
    "metadata": {
      "required_fields": ["title", "date", "status", "authors"],
      "optional_fields": ["supersedes", "superseded-by", "tags"]
    },
    "validation": {
      "enforce_unique_titles": true,
      "enforce_valid_references": true,
      "enforce_status_transitions": false,
      "minimum_content_length": 150
    }
  }
}
```

### WordPress Plugin

```json
{
  "adr": {
    "directory": "docs/decisions",
    "template": "standard",
    "number_format": {
      "style": "sequential",
      "zero_padded": true,
      "width": 3
    },
    "approval_workflow": {
      "enabled": true,
      "method": "codeowners",
      "required_approvals": 1
    },
    "custom_fields": {
      "wordpress": {
        "impact_areas": ["performance", "security"],
        "performance_tier": "medium",
        "backwards_compatible": true
      }
    },
    "validation": {
      "enforce_unique_titles": true,
      "enforce_valid_references": true,
      "enforce_status_transitions": true,
      "minimum_content_length": 200
    }
  }
}
```

### Security-Focused Project

```json
{
  "adr": {
    "directory": "docs/security-decisions",
    "template": "security",
    "number_format": {
      "style": "sequential",
      "zero_padded": true,
      "width": 4
    },
    "approval_workflow": {
      "enabled": true,
      "method": "codeowners",
      "required_approvals": 2
    },
    "validation": {
      "enforce_unique_titles": true,
      "enforce_valid_references": true,
      "enforce_status_transitions": true,
      "minimum_content_length": 300
    }
  }
}
```

---

## Configuration Inheritance

When using org-level defaults with repo overrides:

```bash
# .adr-config.json values override org defaults
# Only specified values override; other settings use org defaults
```

Example org config:
```json
{
  "adr": {
    "directory": "docs/adr",
    "template": "standard",
    "validation": {
      "enforce_unique_titles": true,
      "enforce_valid_references": true
    }
  }
}
```

Example repo override (uses org directory/template, but adds approval):
```json
{
  "adr": {
    "approval_workflow": {
      "enabled": true,
      "method": "codeowners",
      "required_approvals": 1
    }
  }
}
```

Result: Repo gets org's directory and template, plus its own approval workflow.

---

## Validation

Validate your configuration:

```bash
# Check syntax
cat .adr-config.json | jq .

# Validate with agent
claude adr-generator validate --config
```

---

## References

- **Installation Guide**: `INSTALLATION.md`
- **Best Practices**: `BEST_PRACTICES.md`

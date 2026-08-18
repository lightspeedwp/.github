---
title: Frontmatter Schemas
description: JSON Schema definitions for validating Markdown frontmatter metadata across LightSpeedWP repos
file_type: reference
category: standards
status: active
language: en
version: 1.0.0
author: LightSpeed
maintainer: Ash Shaw
---

# Frontmatter Schemas

JSON Schema definitions for validating Markdown frontmatter metadata across LightSpeedWP GitHub organisation.

## Overview

These schemas enforce consistent frontmatter structure and metadata standards across:

- **WordPress Block Plugins** — `block-plugin.frontmatter.schema.json`
- **WordPress Block Themes** — `block-theme.frontmatter.schema.json`
- **Control-Plane Files** (`.github`) — `control-plane.frontmatter.schema.json`
- **Generic Documentation** — `documentation.frontmatter.schema.json`

## Usage

### Validation in Markdown Files

The Meta agent automatically validates frontmatter against the appropriate schema based on repo type detection.

To validate manually:

```bash
# Validate a single file against block-plugin schema
npx ajv validate -s schemas/block-plugin.frontmatter.schema.json docs/guide.md

# Validate all docs in a block plugin
npx ajv validate -s schemas/block-plugin.frontmatter.schema.json docs/**/*.md
```

### In CI/CD Pipelines

Add validation to GitHub Actions:

```yaml
- name: Validate Markdown Frontmatter
  run: |
    npm install -g ajv-cli
    npx ajv validate -s schemas/${{ env.REPO_TYPE }}.frontmatter.schema.json \
      --data-from-file 'docs/**/*.md' \
      --messages
```

## Schema Files

### block-plugin.frontmatter.schema.json

**Purpose:** Validates frontmatter for WordPress block plugin documentation.

**Required fields:**

- `title` — Block or document title
- `description` — Brief description
- `status` — Document status (`draft|review|active|archived`)
- `language` — Language code (`en` only)

**Block-specific fields:**

- `block_name` — Block identifier (e.g. `lightspeed/user-input`)
- `block_supports` — Array of supported features (`align`, `anchor`, `color`, etc.)
- `plugin_name` — Human-readable plugin name
- `plugin_version` — Semantic version
- `requires_wordpress` — Minimum WordPress version
- `requires_php` — Minimum PHP version

**Example:**

```markdown
---
title: User Input Block
description: Captures and validates user input
block_name: lightspeed/user-input
block_supports:
  - align
  - anchor
version: 1.0.0
author: Your Name
status: active
language: en
---
```

### block-theme.frontmatter.schema.json

**Purpose:** Validates frontmatter for WordPress block theme documentation.

**Required fields:**

- `title` — Theme or feature title
- `description` — Brief description
- `status` — Document status
- `language` — Language code (`en` only)

**Theme-specific fields:**

- `theme_name` — Human-readable theme name
- `theme_slug` — wordpress.org slug
- `block_pattern_name` — Pattern identifier (e.g. `lightspeed/hero-section`)
- `supported_features` — Array of WordPress features
- `requires_wordpress` — Minimum WordPress version
- `requires_php` — Minimum PHP version

**Example:**

```markdown
---
title: Hero Block Pattern
description: Full-width hero section with image and text
block_pattern_name: lightspeed/hero-section
theme_name: My Theme
version: 1.0.0
status: active
language: en
---
```

### control-plane.frontmatter.schema.json

**Purpose:** Validates frontmatter for .github control-plane files (instructions, workflows, governance).

**Required fields:**

- `title` — File title
- `description` — Purpose and audience description
- `file_type` — Type of file (`instructions|governance|workflow|script|template|guide|reference|report`)
- `category` — File category
- `status` — Document status
- `language` — Language code (`en` only)
- `owners` — GitHub teams/users responsible (e.g. `lightspeedwp/maintainers`)

**Control-plane-specific fields:**

- `maintainer` — Current maintainer name
- `permissions_required` — Required permissions to use
- `audience` — Intended audience
- `related_issues` — Linked GitHub issues (e.g. `#1234`)
- `related_prs` — Linked pull requests
- `last_reviewed` — Date of last review
- `next_review_date` — Scheduled review date
- `deprecation_date` — When file was deprecated
- `successor` — Path to replacement file

**Example:**

```markdown
---
title: Contributing Guidelines
description: How to contribute to this project. For all contributors.
file_type: instructions
category: governance
version: 1.0.0
author: LightSpeed
maintainer: Ash Shaw
status: active
language: en
owners:
  - lightspeedwp/maintainers
audience:
  - contributors
related_issues:
  - "#1234"
---
```

### documentation.frontmatter.schema.json

**Purpose:** Validates frontmatter for generic documentation files.

**Required fields:**

- `title` — Document title
- `description` — Content description
- `status` — Document status
- `language` — Language code (`en` only)

**Documentation-specific fields:**

- `category` — Document category (`guide|tutorial|reference|troubleshooting|faq`, etc.)
- `difficulty` — For tutorials: `beginner|intermediate|advanced`
- `estimated_read_time` — Reading time in minutes
- `prerequisites` — Required knowledge/setup
- `audience` — Intended readers
- `table_of_contents` — Whether TOC is needed
- `last_reviewed` — Date of last review
- `next_review_date` — Scheduled review date

**Example:**

```markdown
---
title: Getting Started with WordPress Blocks
description: A beginner-friendly introduction to block development
category: tutorial
difficulty: beginner
estimated_read_time: 15
status: active
language: en
prerequisites:
  - WordPress basics
  - JavaScript fundamentals
---
```

## Field Reference

### Universal Fields (All Schemas)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | ✅ | 3–120 characters |
| `description` | string | ✅ | 10–300 characters |
| `status` | enum | ✅ | `draft`, `review`, `active`, `archived` |
| `language` | enum | ✅ | `en` only (UK English) |
| `author` | string | ❌ | Full name, no @ handles |
| `date` | date | ❌ | YYYY-MM-DD format |
| `tags` | array | ❌ | Max 15 tags |
| `version` | string | ❌ | Semantic version or v1.2 format |
| `references` | object | ❌ | Links to related resources |

### Status Values

- **`draft`** — Work in progress, not ready for use
- **`review`** — Awaiting review or approval
- **`active`** — Published and current
- **`archived`** — No longer maintained, kept for reference

**Note:** Do NOT use `deprecated` for documentation. Use `archived` instead. The `deprecated` status is reserved for code/features.

## Validation Rules

### Date Format

All date fields must use ISO 8601 format: `YYYY-MM-DD`

```markdown
date: 2026-08-12
last_reviewed: 2026-08-10
```

### Version Format

Semantic versioning: `MAJOR.MINOR.PATCH` or `vMAJOR.MINOR`

```markdown
version: 1.0.0
version: v2.1
```

### Enum Validation

Certain fields are restricted to predefined values:

```markdown
status: active              # ✅ Valid
status: complete            # ❌ Invalid (not in enum)

language: en                # ✅ Valid
language: en-US             # ❌ Invalid (must be 'en' only)
```

### Pattern Validation

Some fields require specific formats:

**Block/Pattern names** — `namespace/identifier`:

```markdown
block_name: lightspeed/user-input           # ✅ Valid
block_pattern_name: lightspeed/hero-section # ✅ Valid
block_name: my-block                        # ❌ Invalid (missing namespace)
```

**GitHub issues/PRs** — `#` prefix:

```markdown
related_issues:
  - "#1234"   # ✅ Valid
  - "1234"    # ❌ Invalid (missing #)
```

**URLs** — Valid URI format:

```markdown
references:
  plugin_uri: https://wordpress.org/plugins/my-plugin
  guide: https://example.com/guide  # ✅ Valid
  broken: not-a-url                 # ❌ Invalid
```

## Common Validation Errors

### "title is required"

Ensure frontmatter includes a `title` field:

```markdown
---
title: My Document Title
description: Document description
status: active
language: en
---
```

### "status must be one of: draft, review, active, archived"

Check `status` value matches allowed enum:

```markdown
status: active    # ✅ Valid
status: complete  # ❌ Invalid
```

### "date does not match format date"

Date must be in YYYY-MM-DD format:

```markdown
date: 2026-08-12          # ✅ Valid
date: August 12, 2026     # ❌ Invalid
date: 12/08/2026          # ❌ Invalid
```

### "Additional properties are not allowed"

Frontmatter only allows defined fields. Remove custom fields or update the schema:

```markdown
---
title: My Document
custom_field: value  # ❌ Not allowed unless in schema
---
```

## Extending Schemas

To add custom fields to a schema:

1. **Identify the repo type** — Which schema needs updating?
2. **Add the field definition** — Update the schema's `properties` object
3. **Update required fields** if necessary — Add to `required` array
4. **Document the field** — Update this README
5. **Test validation** — Run `npx ajv validate` on sample files
6. **Create PR** — Include schema changes and documentation

Example: Adding a `wordpress_org_slug` field to block-plugin schema:

```json
"properties": {
  "wordpress_org_slug": {
    "type": "string",
    "pattern": "^[a-z0-9-]+$",
    "description": "wordpress.org plugin slug"
  }
}
```

## Integration with Meta Agent

The Meta agent automatically selects and validates against the appropriate schema:

1. **Detects repo type** — Checks for `block.json`, `theme.json`, `.github/agents/`, etc.
2. **Loads schema** — Reads corresponding `.frontmatter.schema.json` file
3. **Validates frontmatter** — Checks YAML against schema
4. **Reports errors** — Provides actionable error messages
5. **Enriches metadata** — Adds missing recommended fields
6. **Applies standards** — Enforces UK English, consistent formatting, etc.

See [`.github/agents/meta.agent.md`](../.github/agents/meta.agent.md) for full Meta agent documentation.

## See Also

- [Meta Agent](../.github/agents/meta.agent.md) — Documentation metadata validator
- [CLAUDE.md](../CLAUDE.md) — Organisation-wide standards
- [docs/LABELING.md](../docs/LABELING.md) — Label standards
- [JSON Schema Documentation](https://json-schema.org/) — Schema format reference

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---
file_type: "instructions"
title: "Frontmatter Instructions"
version: "v1.1"
last_updated: "2025-12-04"
author: "LightSpeedWP"
maintainer: "Ash Shaw"
description: "Instructions for creating and validating YAML frontmatter for all LightSpeedWP documentation and code files."
tags: ["lightspeed","frontmatter","instructions"]
file_type: "instructions"
---

*Note: This file follows LightSpeedWP governance and metadata conventions as described in schema file ([./schemas/frontmatter.schema.json](./schemas/frontmatter.schema.json)).*

# Frontmatter Instructions

## Purpose

- Every documentation, agent, configuration, and markdown file must contain a valid YAML frontmatter block.
- Frontmatter enables automation, search, discoverability, and validation by humans and machines.

## Unified Frontmatter Fields

See the canonical [frontmatter schema](../../schemas/frontmatter.schema.json) for the full list and validation.

| Field        | Type     | Required | Description                                 |
| ------------ | -------- | -------- | ------------------------------------------- |
| title        | string   | yes      | Human-readable title                        |
| description  | string   | yes      | Short summary of the file's purpose         |
| version      | string   | yes      | Version string (e.g., v2.0)                 |
| created_date | string   | yes      | ISO date of creation (e.g., 2025-10-23)     |
| last_updated | string   | yes      | ISO date of last update (e.g., 2025-10-23)  |
| author       | string   | yes      | Main author or responsible party            |
| maintainer   | string   | yes      | Maintainer or team                          |
| owners       | string[] | no       | List of owners/maintainers                  |
| tags         | string[] | no       | Keywords for search/filtering               |
| status       | string   | no       | Current status (active, deprecated, etc.)   |
| stability    | string   | no       | Maturity expectation (stable, experimental) |
| deprecated   | boolean  | no       | Whether this file is deprecated             |
| replacement  | string   | no       | Path to replacement file if deprecated      |
| domain       | string   | no       | Classification domain                       |
| extraDomains | string[] | no       | Secondary classifications                   |
| license      | string   | no       | License identifier                          |
| mode         | string   | no       | Operational/content mode                    |
| references   | object[] | no       | Array of {path, description} objects        |

## Example

```yaml
$schema: "schemas/frontmatter.schema.json"
---
title: "Pattern Development Instructions"
description: "Instructions for developing block patterns."
version: "v2.0"
created_date: "2025-10-23"
last_updated: "2025-10-25"
author: "LightSpeedWP Team"
maintainer: "Ash Shaw"
owners:
  - "lightspeedwp/maintainers"
tags:
  - "lightspeed"
  - "patterns"
  - "instructions"
status: "active"
stability: "stable"
domain: "governance"
mode: "instruction"
deprecated: false
file_type: "documentation"
title: "WordPress Security Guidelines"
description: "Security best practices for WordPress development"
version: "v2.1"
last_updated: "2025-10-24"
author: "LightSpeedWP"
maintainer: "Security Team"
domain: "security"
stability: "stable"
tags: ["guidelines", "best-practices", "wp-core"]
license: "GPL-3.0"
description: "Secure coding guardrails for custom WP REST endpoints"
applyTo: "includes/api/**/*.php"
---

# Security Instructions for REST API Development

<!-- LightSpeed Metadata (in content) -->

**Domain**: security | **Stability**: stable | **Tags**: rest, plugin-hardening, validation

Follow these security practices when developing WordPress REST endpoints...
```

### Prompt File (Awesome-Copilot Style)

```markdown
---
description: "Generate performance remediation checklist for a WordPress site"
mode: ask
model: gpt-4o
domain: perf
stability: stable
tags: ["audit", "wp-core", "optimization"]
tools: ["terminal", "browser"]
---
```

### Chat Mode File

```markdown
---
description: "WordPress accessibility review specialist mode"
tools: ["browser", "accessibility-scanner"]
model: "claude-3"
domain: "a11y"
stability: "experimental"
tags: ["wcag", "review", "validation"]
---
```

### Agent File (LightSpeed)

```markdown
---
file_type: "agent"
name: "wp-security-scanner"
description: "Automated WordPress security vulnerability scanner"
version: "v1.0"
last_updated: "2025-10-24"
owners: ["lightspeedwp/security-team"]
category: "security"
domain: "security"
stability: "incubating"
tags: ["scanner", "vulnerabilities", "automation"]
status: "active"
---
```

## Collection Manifest Additions (`.collection.yml`)

Collections already use `tags:`. Add optional `stability:` and `domain:` keys aligned with above. Validation tooling may be extended to enforce.

## Schema Validation & Compatibility

**LightSpeed Schema**: All files are validated against `../../schemas/frontmatter.schema.json`
**Copilot Compatibility**: Instructions files are limited to `description` and `applyTo` only
**Awesome-Copilot Integration**: Domain taxonomy and stability lifecycle preserved

**Validation Tools**:

1. `validate-frontmatter.js` - Validates all .github files against schema
2. `validate-collections.js` - Extended to check domain and tag compliance
3. CI/CD integration - Rejects PRs with invalid frontmatter
4. VS Code validation - Real-time schema checking (if configured)

## Migration Strategy

**From Legacy LightSpeed**:

- Add `file_type` field to existing files
- Update `apply_to` → `applyTo` for instructions
- Add `domain` and `stability` fields

**From Awesome-Copilot**:

- Add LightSpeed governance fields (`version`, `author`, etc.) to documentation
- Ensure `domain` selection follows LightSpeed taxonomy
- Validate tag limits (8 max)

**GitHub Template Compatibility**:

- Issue/PR templates keep existing frontmatter structure
- Add optional `domain` and `tags` for categorization

## Authoring Checklist

**Required for All Files**:

- [ ] Includes `file_type` (except Copilot instructions)
- [ ] Has clear, concise `description` (<= 120 chars)
- [ ] Chooses exactly one `domain` from approved list
- [ ] Uses <= 8 meaningful tags (kebab-case)
- [ ] Sets appropriate `stability` level

**Required for Governance Files**:

- [ ] Includes `title`, `version`, `last_updated`
- [ ] Has `author` and/or `maintainer`/`owners`
- [ ] References related documentation

**Required for Copilot Files**:

- [ ] Specifies `mode` for prompts/chatmodes
- [ ] Lists `tools` if specialized
- [ ] Uses `applyTo` glob patterns for instructions

**Deprecation Process**:

- [ ] Sets `deprecated: true`
- [ ] Provides `replacement` path
- [ ] Updates references in other files
- [ ] Plans removal after one release cycle

---

## References

- **Schema**: [frontmatter.schema.json](../../schemas/frontmatter.schema.json)
- **Documentation**: [FRONTMATTER-SCHEMA.md](../../docs/FRONTMATTER-SCHEMA.md)
- **Instructions**: [frontmatter.instructions.md](frontmatter.instructions.md)
- **YAML Guides**: [YAML.md](../../docs/YAML.md), [YAML-Frontmatter.md](../../docs/YAML-Frontmatter.md)
- **Validation**: [validate-frontmatter.js](../../scripts/json-validation/validate-frontmatter.js)
- **Awesome-Copilot**: Original conventions preserved and extended

*Produced with accessibility and inclusivity in mind. This document follows LightSpeed governance v2.0 and awesome-copilot integration standards.*

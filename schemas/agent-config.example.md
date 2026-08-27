---
file_type: documentation
title: Agent Configuration Example - Unified Branding
description: Example frontmatter and configuration patterns for the unified branding agent
category: documentation
version: 1.0.2
created_date: '2026-05-29'
last_updated: '2026-08-21'
owners:
  - LightSpeedWP Team
tags:
  - schema
  - configuration
  - example
  - branding
stability: stable
---

# Agent Configuration Examples

This document demonstrates the configuration patterns and frontmatter requirements for the unified branding agent across all 15 document categories.

## Frontmatter Requirements Summary

### Always Required (All Categories)

```yaml
file_type: "documentation"     # Type of document
title: "Document Title"         # Human-readable title
last_updated: "2026-06-01"
```

### Recommended by Category

#### Skills Category

```yaml
file_type: "skill"
title: "Skill Name"
category: "skills"
version: "1.0.1"
last_updated: "2026-06-01"
stability: "stable"             # Must be: stable, experimental, incubating, deprecated
tags: ["portable", "reusable"]  # Up to 8 tags
owners: ["user1", "user2"]      # File maintainers
```

**Footer Template:**

```
---
🎯 Skill • Version 1.0 • Last updated: 2026-05-29
```

#### Instructions Category

```yaml
file_type: "instruction"
title: "Instruction Title"
category: "instructions"
version: "1.0.1"
last_updated: "2026-06-01"
stability: "stable"
maintainer: "ashley@lightspeedwp.agency"
```

**Footer Template:**

```
---
📖 Instruction • Version 1.0 • Last updated: 2026-05-29
```

#### Agent Specifications

```yaml
file_type: "agent"
title: "Agent Name"
category: "agent-specs"
description: "What this agent does and when to use it"
version: "1.0.1"
last_updated: "2026-06-01"
stability: "stable"
tags: ["agent", "automation"]
```

**Footer Template:**

```
---
🤖 Agent Specification • Version 1.0 • Last updated: 2026-05-29
```

#### Documentation

```yaml
file_type: "documentation"
title: "Documentation Title"
category: "documentation"
description: "Overview of this documentation"
last_updated: "2026-06-01"
domain: "platform"              # Functional area
stability: "stable"
maintainer: "ashley@lightspeedwp.agency"
```

**Footer Template:**

```
---
📚 Documentation • Last updated: 2026-05-29
```

#### Plugins

```yaml
file_type: "plugin"
title: "Plugin Name"
category: "plugins"
version: "1.0.1"
last_updated: "2026-06-01"
maintainer: "ashley@lightspeedwp.agency"
license: "GPL-3.0"
```

**Footer Template:**

```
---
🔌 Plugin • Version 1.0 • Last updated: 2026-05-29
```

#### Workflows

```yaml
file_type: "workflow"
title: "Workflow Name"
category: "workflows"
last_updated: "2026-06-01"
description: "What this workflow automates"
```

**Footer Template:**

```
---
🔄 GitHub Actions Workflow • Last updated: 2026-05-29
```

#### Cookbook

```yaml
file_type: "guide"
title: "Recipe/Playbook Title"
category: "cookbook"
description: "Step-by-step implementation guide"
last_updated: "2026-06-01"
stability: "stable"
tags: ["implementation", "guide"]
```

**Footer Template:**

```
---
📖 Cookbook • Last updated: 2026-05-29
```

#### Root-Level Files

```yaml
file_type: "documentation"
title: "README / Contributing Guide"
category: "root"
last_updated: "2026-06-01"
description: "Community guidelines and contribution process"
```

**Footer Template:**

```
---
_Last updated: 2026-05-29 • Category: root_
```

## Category Path Patterns

The configuration system recognizes categories by file path:

| Category | Path Pattern | Example |
|----------|-------------|---------|
| root | `^[^/]+\.md$` | `README.md`, `CONTRIBUTING.md` |
| github-config | `^\.github/[^/]+\.(md\|yml\|yaml)$` | `.github/CODEOWNERS`, `.github/config.yml` |
| workflows | `^\.github/workflows/[^/]+\.ya?ml$` | `.github/workflows/ci.yml` |
| skills | `^skills/.*/(SKILL\.md\|.*\.md)$` | `skills/my-skill/SKILL.md` |
| instructions | `^instructions/.*\.instructions\.md$` | `instructions/coding.instructions.md` |
| documentation | `^(docs\|documentation)/.*\.md$` | `docs/guide.md` |
| plugins | `^plugins/.*\.md$` | `plugins/my-plugin/README.md` |
| cookbook | `^cookbook/.*\.md$` | `cookbook/implementation.md` |
| ai-configs | `^ai/.*\.md$` | `ai/Claude.md` |
| agent-specs | `^agents/.*\.md$` | `agents/my-agent/README.md` |
| slides | `^slides/.*\.md$` | `slides/presentation.md` |

## Validation Rules by Category

### Skills (Highest Priority)

- ✅ Must have: `file_type`, `title`, `last_updated`
- ✅ Must have: `category: "skills"`, `version`, `stability`
- ✅ Must have: `tags` (max 8)
- ✅ Example: semantic version format `1.0`, `1.2.3`

### Instructions (High Priority)

- ✅ Must have: `file_type`, `title`, `last_updated`
- ✅ Must have: `category: "instructions"`, `version`, `stability`
- ✅ Recommended: `description`, `maintainer`

### Agent Specs

- ✅ Must have: `file_type`, `title`, `last_updated`
- ✅ Must have: `category: "agent-specs"`, `version`
- ✅ Recommended: `description`, `stability`

### Documentation

- ✅ Must have: `file_type`, `title`, `last_updated`
- ✅ Optional: `version`, `stability`, `domain`, `tags`

### Plugins

- ✅ Must have: `file_type`, `title`, `last_updated`
- ✅ Must have: `version` if provided
- ✅ Recommended: `maintainer`, `license`

## Badge Examples

Badges are rendered based on category and stability:

**Skills with Stable Status:**

```
![Status: stable](https://img.shields.io/badge/status-stable-green)
```

**Version Badges:**

```
![Version 1.0](https://img.shields.io/badge/version-1.0-green)
```

**Category Badges:**

```
![Category: skills](https://img.shields.io/badge/category-skills-blue)
```

**Status Indicators (inline):**

- 💚 Stable
- 🟡 Experimental
- 🟠 Incubating
- ⚠️ Deprecated

## Date/Time Format Requirements

All `last_updated` values must follow **ISO 8601 datetime format**:

```
2026-05-29T05:40:00Z   ✅ Correct (UTC)
2026-05-29T05:40:00+00:00   ✅ Also correct (UTC with offset)
2026-05-29   ❌ Incorrect (date-only, use full timestamp)
```

**Important:** When content changes, `last_updated` must match today's UTC date.

## Version Format Requirements

Semantic versioning (if `version` field is used):

```
1.0     ✅ Valid (major.minor)
1.2.3   ✅ Valid (major.minor.patch)
1.2.3.4 ❌ Invalid (too many components)
v1.0    ❌ Invalid (no 'v' prefix)
```

## Next Steps

1. Apply these frontmatter patterns to markdown files in each category
2. Add appropriate footer templates based on category and stability
3. Include badges for skills, instructions, and agent specifications
4. Validate all frontmatter against the JSON schema
5. Run remediation scripts to bulk-apply patterns across 932 files

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

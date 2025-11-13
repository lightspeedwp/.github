---
title: 'Branding Agent — Specification'
version: 'v1.0'
last_updated: '2025-11-13'
author: 'LightSpeed'
maintainer: 'Ash Shaw'
owners: ['ashleyshaw']
description: 'Automated branding system for headers, badges, references, banners, footers, and emojis in documentation.'
tags: ['branding', 'automation', 'documentation', 'badges', 'emojis', 'workflows']
file_type: 'documentation'
category: 'docs'
references:
    - '../.github/automation/badges.schema.yml'
    - '../.github/automation/emoji.schema.yml'
    - '../.github/automation/footers.yml'
    - '../.github/automation/front-matter.schema.json'
    - '../.github/workflows/branding.yml'
    - '../.github/agents/branding.agent.js'
---

# Branding Agent — Spec (develop)

The Branding Agent ensures consistent, professional presentation across all LightSpeed documentation by automatically applying headers, badges, references, banners, footers, and emojis according to defined schemas and content categories.

## Scope

- **Headers:** Title with badges and short description
- **Badges:** Workflow status and metadata badges from schema
- **References:** Cross-links to related documentation
- **Banner:** Visual branding element
- **Footer:** Contextual, rotating footer phrases
- **Emojis:** Conservative emoji application to H1/H2 headings

## Schemas

The branding system is governed by four schema files:

1. **[`badges.schema.yml`](../.github/automation/badges.schema.yml)** – Badge definitions, mapping rules, and render order
2. **[`emoji.schema.yml`](../.github/automation/emoji.schema.yml)** – Emoji application rules and exclusions
3. **[`footers.yml`](../.github/automation/footers.yml)** – Category-based footer phrase selection
4. **[`front-matter.schema.json`](../.github/automation/front-matter.schema.json)** – Front matter validation schema

## Workflow

The branding system is triggered by [`branding.yml`](../.github/workflows/branding.yml) on:

- Pull requests to `develop` branch (validation only)
- Pushes to `develop` branch (validation + application)
- Weekly schedule (Monday 03:00 UTC for metrics)

### Workflow Jobs

1. **`front-matter-validate`** – Validates front matter against schema
2. **`lint-and-links`** – Runs markdown linting and link checking
3. **`apply-branding`** – Applies branding to markdown files (push only)
4. **`metrics-update`** – Updates branding metrics snapshot

## Header Order

Standard documentation header structure:

```markdown
# Title

[Badges]

Short description paragraph.
```

## References → Banner → Footer

The branding agent inserts three elements in order:

1. **References Section** – Cross-links to related docs
2. **Banner Image** – Visual branding (`assets/banners/work-with-us.png`)
3. **Footer** – Contextual phrase based on category

### Banner Variants

- Default: `assets/banners/work-with-us.png`
- Product-specific variants: TODO

## Emojis

Conservative emoji application following [`emoji.schema.yml`](../.github/automation/emoji.schema.yml):

- **Applied to:** H1 and H2 headings only
- **Never applied to:** H3+, formal docs (CHANGELOG.md, CODE_OF_CONDUCT.md)
- **Selection:** Keyword-based mapping with fallback
- **Limit:** 0–1 emoji per heading

### Emoji Mapping

| Keyword | Emoji |
|---------|-------|
| design | 🎨 |
| workflow | 🛠️ |
| release | 🚀 |
| governance | 🏛️ |
| (fallback) | ✨ |

## Opt-Out

Files can opt out of branding in two ways:

### Front Matter Opt-Out

```yaml
---
no_branding: true
---
```

### Body Marker Opt-Out

```markdown
<!-- branding: off -->
```

## Formal Documents (Always Skip)

The following formal documents are always excluded:

- `CHANGELOG.md`
- `CODE_OF_CONDUCT.md`
- Any file with `no_branding: true` in front matter

## Examples

### Before

```markdown
# Documentation Guide

This guide explains how to write documentation.
```

### After

```markdown
# Documentation Guide 📚

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Front-Matter](https://img.shields.io/badge/Front--Matter-Schema%20OK-success.svg)

This guide explains how to write documentation.

## References

- [Contributing Guide](../CONTRIBUTING.md)
- [Coding Standards](../.github/instructions/coding-standards.instructions.md)

---

![Work with LightSpeed](../assets/banners/work-with-us.png)

---

Made with ❤️ by the LightSpeed team.
```

## Metrics

Branding metrics are tracked in two files:

- **[`.github/metrics/branding.json`](../.github/metrics/branding.json)** – Latest snapshot
- **[`.github/metrics/branding-log.md`](../.github/metrics/branding-log.md)** – Historical log

### Metrics Tracked

| Metric | Description |
|--------|-------------|
| `coverage` | Percentage of docs with branding applied |
| `changes` | Number of files modified in last run |
| `errors` | Number of errors encountered |
| `optouts` | Number of files opted out |

## Agent Implementation

The branding logic is implemented in [`branding.agent.js`](../.github/agents/branding.agent.js).

### Key Functions

- `applyHeader()` – Applies title, badges, description
- `applyBadges()` – Inserts workflow and metadata badges
- `applyReferences()` – Adds cross-reference section
- `applyBanner()` – Inserts banner image
- `applyFooter()` – Adds contextual footer
- `applyEmojis()` – Adds emojis to H1/H2 headings

## Testing

Test framework: Jest (TODO: confirm)

Test location: `.github/agents/__tests__/` (TODO: confirm)

## Open Questions

1. **Test Framework:** Jest, Vitest, or other? Location: `/tests` or `/__tests__`?
2. **Helper Modules:** Names and locations for `badgeUtils.js`, `footerUtils.js`, etc.?
3. **Formal Exclusions:** Any additional pages to hard-exclude beyond CHANGELOG/CODE_OF_CONDUCT?
4. **Banner Variants:** Naming convention and initial set for product-specific banners?

_(Mark answers in relevant GitHub Issues)_

## Validation Checklist

- [ ] Schemas compile (YAML/JSON) locally
- [ ] `branding.yml` dry-runs clean; no CI loops
- [ ] `[skip ci]` respected in commits
- [ ] Agent idempotence verified on sample set
- [ ] Every item validated on `develop` before promote-to-main

## References

- [Badges Schema](../.github/automation/badges.schema.yml)
- [Emoji Schema](../.github/automation/emoji.schema.yml)
- [Footers Configuration](../.github/automation/footers.yml)
- [Front Matter Schema](../.github/automation/front-matter.schema.json)
- [Branding Workflow](../.github/workflows/branding.yml)
- [Branding Agent](../.github/agents/branding.agent.js)
- [Agents Documentation](../AGENTS.md)
- [Custom Instructions](../.github/custom-instructions.md)

---

Made with ❤️ by the LightSpeed team.

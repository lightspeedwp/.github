---
file_type: "documentation"
title: "Portable Plugins"
description: "Ownership and migration rules for installable LightSpeed plugin bundles."
version: "v0.1.0"
last_updated: "2026-05-18"
author: "Codex"
maintainer: "LightSpeed Team"
owners: ["LightSpeed Team"]
tags: ["plugins", "ai-ops", "installable-assets", "governance"]
status: "draft"
---

# Portable Plugins

## Overview

`plugins/` stores installable LightSpeed AI operations plugin bundles. Each
plugin should package a focused set of agents, skills, instructions, hooks, or
workflows that can be installed into supported tools.

## Ownership

LightSpeed Team owns this folder. The first implementation target is the
`lightspeed-github-ops` pilot plugin.

## Structure

| Path | Purpose |
| --- | --- |
| `plugins/README.md` | Ownership and migration rules for this folder. |
| `plugins/<plugin-id>/README.md` | Plugin purpose, contents, install notes, and support status. |
| `plugins/<plugin-id>/plugin.json` | Plugin manifest for compatible tooling. |
| `plugins/<plugin-id>/skills/` | Plugin-local skills when bundling is useful. |
| `plugins/<plugin-id>/agents/` | Plugin-local agent specs when bundling is useful. |

## Plugin Family Strategy

| Plugin family | Purpose | Status |
| --- | --- | --- |
| `lightspeed-github-ops` | Community health, labels, templates, PR review, frontmatter, release prep. | Pilot |
| `lightspeed-wordpress-block-theme` | Block theme standards and workflows. | Planned |
| `lightspeed-wordpress-block-plugin` | Custom block plugin standards and workflows. | Planned |
| `lightspeed-content-ops` | Publishing, editorial, and reusable content operations. | Backlog |

## Usage

- Build the smallest useful plugin first.
- Keep plugin manifests accurate and dependency-light.
- Link bundled assets back to their source collections where relevant.
- Avoid broad materialisation tooling until the pilot proves the pattern.

## Validation

Validate changed Markdown files now. Add manifest validation once the validation
reset introduces `validate:plugins`.

```bash
npx markdownlint-cli2 "plugins/**/*.md"
```

## Migration Rules

- Create plugin bundles from proven source assets, not from unreviewed legacy
  folders.
- Keep each plugin focused on one audience and operating context.
- Record bundled assets in the migration map or plugin README.

## Related Documentation

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Issue #290: Add ownership indexes for new top-level folders](https://github.com/lightspeedwp/.github/issues/290)

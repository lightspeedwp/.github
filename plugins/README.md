---
file_type: "index"
title: "Plugin Bundles"
description: "Ownership index for installable LightSpeed AI plugin bundles and plugin-family strategy."
version: "v0.1.0"
last_updated: "2026-05-16"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["plugins", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Portable AI plugin restructure PRD."
  - path: "../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-01-skeleton-boundary/01-02-document-folder-ownership-indexes.md"
    description: "Issue #290 local source draft."
---

# Plugin Bundles

This folder owns installable LightSpeed AI plugin bundles and the index of planned plugin families.

## Ownership

- Owns plugin bundle folders, plugin-local README files, manifests, packaged agents, packaged skills, hooks, and workflow entry points.
- Does not own loose source assets that have not yet been assigned to a plugin.
- Keeps each plugin scoped to a clear audience and maintenance model.

## Structure

| Path | Purpose |
| --- | --- |
| `plugins/<plugin-id>/README.md` | Plugin overview, install notes, included assets, and support status. |
| `plugins/<plugin-id>/` | Plugin-local agents, skills, hooks, workflows, manifests, and examples. |
| `plugins/README.md` | This ownership index and plugin-family strategy. |

## Migration rules

- Start with the `lightspeed-github-ops` pilot before creating broad WordPress plugin packs.
- Package only assets that already have an owner, validation path, and migration decision.
- Keep future plugin ideas in backlog documentation until their first source assets are selected.
- Do not move community health templates, GitHub Actions, or labels into a plugin unless the assigned issue covers compatibility.

## Plugin family strategy

| Plugin ID | Purpose |
| --- | --- |
| `lightspeed-github-ops` | Community health, templates, labels, project governance, and release support. |
| `lightspeed-ai-ops-core` | General LightSpeed AI operations skills and agents. |
| `lightspeed-wordpress-block-theme` | Block theme development guidance. |
| `lightspeed-wordpress-block-plugin` | Block plugin development guidance. |

## Validation

- Run Markdown linting for changed plugin documentation.
- Validate plugin manifests once the pilot manifest format lands.
- Check packaged asset references before publishing or installing locally.

## Governance links

- [Portable AI plugin restructure PRD](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [Plugin restructure issue index](../.github/projects/active/portable-ai-plugin-restructure/issues/README.md)
- [README standards](../instructions/readme.instructions.md)

## References

- [Issue #290 draft](../.github/projects/active/portable-ai-plugin-restructure/issues/children/batch-01-skeleton-boundary/01-02-document-folder-ownership-indexes.md)
- [Migration decision map](../.github/projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-migration-map-2026-05-15.csv)

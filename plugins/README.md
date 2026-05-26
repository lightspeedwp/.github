---
file_type: "index"
title: "Plugin Bundles"
description: "Ownership index for installable LightSpeed AI plugin bundles and plugin-family strategy."
version: "v0.2.0"
last_updated: "2026-05-26"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["plugins", "ai-ops", "plugin-restructure"]
domain: "governance"
stability: "draft"
---

# Plugin Bundles

This folder owns installable LightSpeed AI plugin bundles and the index of
planned plugin families.

## Structure

| Path | Purpose |
| --- | --- |
| `plugins/<plugin-id>/README.md` | Plugin overview, install notes, included assets, and support status. |
| `plugins/<plugin-id>/` | Plugin-local agents, skills, hooks, workflows, manifests, and examples. |
| `plugins/README.md` | This ownership index and plugin-family strategy. |

## Plugin family strategy

| Plugin ID | Purpose |
| --- | --- |
| `lightspeed-github-ops` | Community health, templates, labels, project governance, and release support. |
| `lightspeed-ai-ops-core` | General LightSpeed AI operations skills and agents. |
| `lightspeed-wordpress-block-theme` | Block theme development guidance. |
| `lightspeed-wordpress-block-plugin` | Block plugin development guidance. |

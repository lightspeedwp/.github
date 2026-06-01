---
title: "Portable AI Plugin Restructure Compatibility Manifest Report"
description: "Compatibility evidence for Copilot, Codex/OpenAI, and Claude plugin manifests."
version: "v0.1.0"
last_updated: "2026-05-26"
file_type: "project"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["compatibility", "manifest", "plugin", "restructure"]
domain: "governance"
stability: "active"
---

# Compatibility Manifest Report (2026-05-26)

## Scope

- Issue `#306`: VS Code/GitHub Copilot plugin metadata.
- Issue `#307`: Codex/OpenAI plugin manifest.
- Issue `#308`: Claude Code plugin manifest.

## Implemented files

- `plugins/lightspeed-github-ops/copilot-plugin.json`
- `plugins/lightspeed-github-ops/.codex-plugin/plugin.json`
- `plugins/lightspeed-github-ops/.claude-plugin/plugin.json`

## Validation evidence

Commands run:

```bash
npm run validate:plugins
npm run validate:skills
npm run validate:links
```

Results:

- `validate:plugins` passed with all manifest references resolving to files
  inside `plugins/lightspeed-github-ops`.
- `validate:skills` passed with required `SKILL.md` entrypoints present.
- `validate:links` passed for active portable scope and pilot plugin docs.

## Compatibility conclusions

- Copilot metadata manifest exists and references packaged files only.
- Codex manifest exists, matches plugin folder name, and resolves references.
- Claude manifest exists, is plugin-root-contained, and resolves references.

## Notes

- This report documents filesystem and validation-level compatibility.
- Interactive UI discovery checks are covered by smoke-test notes and can be
  extended in future tool-specific regression runs.

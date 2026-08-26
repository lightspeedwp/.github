---
title: "lightspeed-github-ops Installation Guide"
last_updated: "2026-05-26"
---

# Installation Guide

## VS Code and GitHub Copilot

1. Open this repository locally.
2. Point plugin discovery to `plugins/lightspeed-github-ops`.
3. Confirm `copilot-plugin.json` resolves and listed files exist.

## Codex/OpenAI

1. Use plugin path `plugins/lightspeed-github-ops`.
2. Confirm `.codex-plugin/plugin.json` loads.
3. Verify all referenced `skills/*/SKILL.md` and `agents/*` files exist.

## Claude Code

1. Use plugin path `plugins/lightspeed-github-ops`.
2. Confirm `.claude-plugin/plugin.json` is discovered.
3. Verify all referenced files are inside plugin root.

## Update and uninstall

- Update: pull latest plugin folder content and rerun discovery.
- Uninstall: remove plugin path from tool configuration.

## Troubleshooting

- Missing manifest: confirm expected manifest file exists for the tool.
- Missing referenced file: validate manifest paths and run `npm run validate:plugins`.

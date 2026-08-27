---
file_type: documentation
title: LightSpeed Playwright Testing Plugin — Installation
description: Per-provider installation guide for the lightspeed-playwright-testing plugin.
version: v2.0.1
last_updated: '2026-08-21'
domain: generic
tags:
  - playwright
  - install
  - plugin
  - multi-provider
---

# Installation Guide

## Prerequisites

```bash
npm install -D @playwright/test
npx playwright install
```

## Claude

1. Clone the repo and locate the plugin:

   ```bash
   git clone https://github.com/lightspeedwp/.github
   cd .github/plugins/lightspeed-playwright-testing
   ```

2. Register via `.claude-plugin/plugin.json` in your Claude Code plugin settings.
3. Confirm the agent loads and reads
   [`agents/playwright-testing-agent/claude/agent.md`](../../agents/playwright-testing-agent/claude/agent.md).

## GitHub Copilot

1. Add the plugin so Copilot can discover `copilot-plugin.json`.
2. Use in Copilot Chat:

   ```text
   @playwright-testing build a test pack from this checkout PRD
   ```

3. Config: [`agents/playwright-testing-agent/copilot/agent.md`](../../agents/playwright-testing-agent/copilot/agent.md).

## OpenAI Codex

1. Register the functions from
   [`agents/playwright-testing-agent/openai/tools.json`](../../agents/playwright-testing-agent/openai/tools.json)
   in your OpenAI API tool configuration.
2. Provide `shared/core-prompt.md` + `openai/agent.md` as the system context.
3. Call `build_test_pack` first; only call `generate_playwright_specs` after the
   review gate is approved.

## Troubleshooting

**Missing Playwright**

```bash
npm install -D @playwright/test
npx playwright install
```

**Plugin not recognised** — verify the install path, validate the manifest JSON,
and restart the IDE/tool.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

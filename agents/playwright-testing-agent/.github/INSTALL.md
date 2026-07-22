---
file_type: documentation
title: Playwright Testing Agent — Installation
description: Agent-level installation pointer for the Playwright Testing Agent across providers.
last_updated: '2026-07-22'
domain: generic
tags:
  - playwright
  - install
  - multi-provider
---

# Installation — Playwright Testing Agent

This agent is distributed via the
[`lightspeed-playwright-testing`](../../../plugins/lightspeed-playwright-testing/README.md)
plugin. See the plugin's
[INSTALL.md](../../../plugins/lightspeed-playwright-testing/INSTALL.md) for full,
per-provider installation steps.

## Quick reference

- **Claude** — load the agent via the plugin's `.claude-plugin/plugin.json`;
  config in [`../claude/agent.md`](../claude/agent.md).
- **GitHub Copilot** — discovered via `copilot-plugin.json`; config in
  [`../copilot/agent.md`](../copilot/agent.md).
- **OpenAI** — register the functions from [`../openai/tools.json`](../openai/tools.json);
  config in [`../openai/agent.md`](../openai/agent.md).

## Prerequisites

```bash
npm install -D @playwright/test
npx playwright install
```

Provider-agnostic behaviour is defined in
[`../shared/core-prompt.md`](../shared/core-prompt.md) and [`../AGENT.md`](../AGENT.md).

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

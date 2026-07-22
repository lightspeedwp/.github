---
file_type: agent
name: playwright-testing
title: Playwright Testing Agent
description: >-
  Packaged Playwright Testing Agent for the lightspeed-playwright-testing plugin.
  Canonical multi-provider spec lives in agents/playwright-testing-agent/.
version: 2.0.0
status: active
last_updated: '2026-07-22'
domain: generic
tags:
  - playwright
  - testing
  - woocommerce
  - multi-provider
providers:
  - claude
  - copilot
  - openai
---

# Playwright Testing Agent (packaged)

This is the plugin-packaged entry for the **Playwright Testing Agent**. It turns
PRDs and acceptance criteria into review-ready human-readable test cases first,
then maintainable Playwright specs for WordPress and WooCommerce sites, with a
review-before-code gate and requirement traceability.

## Canonical source

The full multi-provider specification and provider configs are maintained in the
agent export:

- Spec: [`agents/playwright-testing-agent/AGENT.md`](../../../agents/playwright-testing-agent/AGENT.md)
- Core prompt: [`agents/playwright-testing-agent/shared/core-prompt.md`](../../../agents/playwright-testing-agent/shared/core-prompt.md)
- Claude: [`agents/playwright-testing-agent/claude/agent.md`](../../../agents/playwright-testing-agent/claude/agent.md)
- Copilot: [`agents/playwright-testing-agent/copilot/agent.md`](../../../agents/playwright-testing-agent/copilot/agent.md)
- OpenAI: [`agents/playwright-testing-agent/openai/agent.md`](../../../agents/playwright-testing-agent/openai/agent.md)

Install steps for each provider are in [`../INSTALL.md`](../INSTALL.md).

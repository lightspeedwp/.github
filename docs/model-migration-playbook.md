---
title: 'Model Migration Playbook'
description: 'Concise process for changing/adding LLMs across prompts, chatmodes, and agents'
version: '1.0'
last_updated: '2025-11-12'
author: 'LightSpeed'
tags: ['aiops', 'migration', 'llm', 'agents', 'process']
file_type: 'playbook'
---

# Model Migration Playbook

## Purpose
Concise process for changing/adding LLMs (e.g., Gemini → Claude → ChatGPT) across prompts/chatmodes/agents.

## Steps
1) Propose change and scope impact.
2) Update affected prompts/chatmodes with test cases.
3) Run agent tests; compare outputs against baselines.
4) Update docs (`AGENTS.md`, model guides); seek sign‑off.
5) Rollout on `develop`; monitor; then promote to `main`.

## Sign‑off
- @lightspeedwp/docs-team (Docs team)
- @lightspeedwp/agents-team (Agents team)

## Related Resources
- [AGENTS.md](../AGENTS.md)
- [CLAUDE.md](../CLAUDE.md)
- [AI Model Comparison Guide](../ai-model-comparison.md)
- [Model Selection Guide](../model-guide.md)

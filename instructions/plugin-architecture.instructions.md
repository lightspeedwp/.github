---
file_type: instructions
title: Plugin Architecture
description: Structure, naming, and validation for multi-agent LightSpeed plugins that package multi-provider agents for Claude, GitHub Copilot, OpenAI, and Gemini.
scope: organization-wide
applyTo: plugins/**
version: v1.0.1
last_updated: '2026-08-21'
owners:
  - lightspeedwp/maintainers
tags:
  - plugins
  - agents
  - architecture
  - governance
status: active
domain: governance
---

# Plugin Architecture Guide

A plugin is a reusable package containing one or more agents plus optional shared
skills and hooks, distributed across providers.

## General Rules

- **Name:** `lightspeed-{domain}-{focus}` (lowercase, kebab-case).
- **Register** every plugin in
  [`plugins/PLUGIN_MANIFEST.json`](../plugins/PLUGIN_MANIFEST.json).
- **Provide all four manifests** so each provider can discover the plugin.

## Detailed Guidance

### Required manifests

Every plugin must contain, and `validate:plugins` enforces:

- `copilot-plugin.json`
- `.claude-plugin/plugin.json`
- `.codex-plugin/plugin.json`
- `.gemini-plugin/plugin.json`

Every `agents`/`skills` reference in a manifest must be a safe relative path that
resolves to a real file. A skill reference ending in `/SKILL.md` additionally
requires the full skill-package manifest set (`metadata.yml`, `agents/*.yaml`);
omit such references (use an empty `skills` array) unless the package exists.

### Folder structure

```text
plugins/lightspeed-{domain}-{focus}/
├── copilot-plugin.json
├── .claude-plugin/plugin.json
├── .codex-plugin/plugin.json
├── .gemini-plugin/plugin.json
├── README.md
├── INSTALL.md
├── agents/{agent}.agent.md      # packaged pointer(s) to canonical agent specs
└── hooks/README.md              # recommended validation hooks
```

### Agent grouping

Group agents by domain and function. Add a new agent to an existing domain plugin
when one exists; otherwise create a new `lightspeed-{domain}-{focus}` plugin.

### Hooks

Reference the org-wide hooks in
[`hooks/hook-registry.json`](../hooks/hook-registry.json) rather than duplicating
implementations. Recommended: `agent-spec-validator`,
`multi-provider-consistency-checker`, `plugin-integrity-checker`,
`agent-security-auditor`.

## Examples

Reference plugin:
[`plugins/lightspeed-playwright-testing/`](../plugins/lightspeed-playwright-testing/README.md).

## Validation

- [ ] Folder named `lightspeed-{domain}-{focus}`
- [ ] All four provider manifests present and valid JSON
- [ ] All manifest refs resolve
- [ ] Registered in `PLUGIN_MANIFEST.json`
- [ ] `npm run validate:plugins` passes
- [ ] `plugin-integrity-checker` passes

## References

- [agent-plugin-binding.schema.json](../.schemas/agent-plugin-binding.schema.json)
- [agent-creation-workflow.instructions.md](./agent-creation-workflow.instructions.md)

---

📐 *Schema validated by LightSpeedWP — always compliant.*

[📋 Coding Standards](https://github.com/lightspeedwp/.github/blob/develop/instructions/coding-standards.instructions.md) · [🔗 Related Files](https://github.com/lightspeedwp/.github/tree/develop/instructions)

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

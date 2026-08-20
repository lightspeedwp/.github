---
file_type: documentation
title: Plugin Hooks — lightspeed-playwright-testing
description: Portable validation hooks recommended for the lightspeed-playwright-testing plugin.
version: v0.1.0
last_updated: '2026-07-22'
domain: governance
tags:
  - hooks
  - playwright
  - validation
---

# Plugin Hooks — lightspeed-playwright-testing

This plugin relies on the org-wide portable hooks registered in
[`hooks/hook-registry.json`](../../../hooks/hook-registry.json). No plugin-local
hook implementations are required.

## Recommended hooks

| Hook | Purpose |
| --- | --- |
| `agent-spec-validator` | Validate the agent's `AGENT.md` frontmatter |
| `multi-provider-consistency-checker` | Ensure claude/copilot/openai configs stay in parity |
| `plugin-integrity-checker` | Validate this plugin's manifests and structure |
| `agent-security-auditor` | Scan agent files for hardcoded secrets |
| `secrets-scanner` | Org-wide secret detection |

See the [hooks registry](../../../hooks/hook-registry.json) for status and triggers.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

[🔗 Website](https://lightspeedwp.agency) · [📧 Contact](https://lightspeedwp.agency/contact) · [👥 Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)

## Visual Workflow

```mermaid
flowchart TD
  accTitle: flowchart diagram
  accDescr: flowchart flowchart
  A[Start Here] --> B[Read Scope and Prerequisites]
  B --> C[Run the Documented Workflow]
  C --> D[Validate with Repo Tooling]
  D --> E[Open PR or Hand-off]

  classDef start fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:#1B5E20;
  classDef prep fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:#0D47A1;
  classDef run fill:#FFF3E0,stroke:#EF6C00,stroke-width:2px,color:#E65100;
  classDef gate fill:#F3E5F5,stroke:#6A1B9A,stroke-width:2px,color:#4A148C;
  classDef done fill:#E0F2F1,stroke:#00695C,stroke-width:2px,color:#004D40;

  class A start;
  class B prep;
  class C run;
  class D gate;
  class E done;
```

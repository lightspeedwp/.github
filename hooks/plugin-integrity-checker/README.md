---
file_type: documentation
title: plugin-integrity-checker Hook
description: Validates a plugin's four provider manifests and that referenced agent/skill files resolve.
version: v0.1.0
last_updated: '2026-07-22'
owners:
  - lightspeedwp/maintainers
domain: governance
tags:
  - hooks
  - agents
  - validation
---

# plugin-integrity-checker

Validates a plugin's four provider manifests and that referenced agent/skill files resolve.

## Triggers

pre-commit, pre-push

## Usage

```bash
node hooks/plugin-integrity-checker/index.js <path>
```

Programmatic:

```js
const hook = require("./hooks/plugin-integrity-checker");
const { valid, errors, warnings } = hook.validate("<path>");
```

Returns `{ valid: boolean, errors: string[], warnings: string[] }`. Exit code is
`1` when `valid` is `false`. Tests live in `__tests__/`.

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

---
file_type: documentation
title: agent-security-auditor Hook
description: Scans agent files for hardcoded secrets and unsafe patterns; supports a SKIP directive.
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

# agent-security-auditor

Scans agent files for hardcoded secrets and unsafe patterns; supports a SKIP directive.

## Triggers

pre-push

## Usage

```bash
node hooks/agent-security-auditor/index.js <path>
```

Programmatic:

```js
const hook = require("./hooks/agent-security-auditor");
const { valid, errors, warnings } = hook.validate("<path>");
```

Returns `{ valid: boolean, errors: string[], warnings: string[] }`. Exit code is
`1` when `valid` is `false`. Tests live in `__tests__/`.

---

🔍 *Audit report generated {audit_date} by the LightSpeedWP team.*

[📋 Reports Index](https://github.com/lightspeedwp/.github/tree/develop/.github/reports) · [📞 Contact](https://lightspeedwp.agency/contact)
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

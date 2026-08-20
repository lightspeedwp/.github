---
file_type: instructions
title: .github Instructions Boundary
description: Repo-local index for instructions that remain under the .github control-plane
  boundary.
version: 'v0.2.1'
last_updated: '2026-06-01'
maintainer: LightSpeed Team
authors:

- Codex
license: GPL-3.0
tags:

- instructions
- github-boundary
- ai-ops
domain: governance
stability: experimental
---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

## Related Resources

- [Portable instruction library index](../../instructions/README.md)
- [Issue #295 local source draft](../projects/active/portable-ai-plugin-restructure/issues/children/batch-02-portable-migration/02-03-refactor-migrate-portable-instructions.md)

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

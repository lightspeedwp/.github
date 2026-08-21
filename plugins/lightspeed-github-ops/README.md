---
title: "lightspeed-github-ops Plugin"
description: "Pilot plugin bundle for LightSpeed GitHub governance and AI operations workflows. Includes governance agents, skills, and hooks."
file_type: documentation
version: v0.2.0
last_updated: "2026-05-31"
created_date: "2026-01-15"
authors: ["LightSpeed Team"]
maintainer: "LightSpeed Team"
license: "GPL-3.0"
tags: ["plugin", "governance", "operations", "AI", "workflows"]
domain: "governance"
stability: "experimental"
---

# lightspeed-github-ops

Pilot plugin for reusable governance operations in LightSpeed repositories.

## Contents

- `agents/` packaged governance agent specs.
- `skills/` packaged P0 governance skills.
- `hooks/` optional plugin-local guardrails.
- `.codex-plugin/plugin.json` Codex manifest.
- `.claude-plugin/plugin.json` Claude Code manifest.
- `copilot-plugin.json` Copilot metadata manifest.

## Scope

This pilot excludes block theme and block plugin guidance.

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

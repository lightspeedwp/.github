---
file_type: documentation
title: Portable Agents
description: Index for portable multi-file agent implementations used across LightSpeedWP repositories.
version: "1.0"
last_updated: "2026-08-19"
owners:
  - LightSpeed Team
status: active
stability: stable
domain: governance
---

# Portable Agents

This directory contains portable, multi-file agent implementations that can be reused across LightSpeedWP repositories.

## Current Model

- `agents/` contains portable agents with provider-specific implementations.
- `.github/agents/` contains spec-based, GitHub-native control-plane agents.
- Agent standards are defined in `docs/AGENT_STANDARDS.md`.

## What Lives Here

Each agent directory can include:

- `AGENT.md` for metadata and capabilities.
- Provider folders such as `claude/`, `copilot/`, and `openai/` when applicable.
- Supporting `skills/`, `manifests/`, and docs.

## Current Agent Families

Examples in this directory include:

- `prd-agent/`
- `release/`
- `testing-agent/`
- `linear-advisor-agent/`
- `website-scope-estimator-agent/`

For full inventory and governance context, see:

- `ai/agents.md`
- `AGENTS.md`
- `CLAUDE.md`
## Visual Workflow

```mermaid
flowchart TD
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

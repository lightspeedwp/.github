---
file_type: documentation
title: Canonical AI References
description: Canonical AI reference files and audit artefacts for LightSpeedWP agent operations.
version: "1.0"
last_updated: "2026-08-19"
owners:
  - LightSpeed Team
status: active
stability: stable
domain: governance
---

# Canonical AI References

This directory stores canonical AI reference files used by repository-level instructions and agent governance.

## Files

- `Claude.md` — Claude-specific reference guidance.
- `Gemini.md` — Gemini-specific reference guidance.
- `RUNNERS.md` — Runner definitions and execution context.
- `agents.md` — Canonical map of agent implementations.

## Audit and Improvement Artefacts

- `AUDIT-SUMMARY.md`
- `audit-planner-reviewer-agents.md`
- `improvement-plan-planner-reviewer.md`

## Integration Points

These references are consumed by:

- `AGENTS.md`
- `CLAUDE.md`
- `.github/custom-instructions.md`

Keep this directory focused on canonical references and audit evidence, not implementation code.
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

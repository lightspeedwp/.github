---
file_type: documentation
title: "PRD Combined Agent – Phase 2 Batch 2"
description: "Phase 2 Batch 2 - Unified product requirements and planning agent implementation"
last_updated: "2026-08-25"
status: active
tags:- agent-standards
  - phase-2
  - prd
owners:- lightspeedwp/maintainers
---

# PRD Combined Agent – Phase 2 Batch 2

Unifies two complementary product planning agents into a single multi-provider planning tool.

## Quick Facts

| Aspect | Details |
|--------|---------|
| Agent | PRD Agent (Product Requirements) |
| Version | 2.0.0 |
| Status | Active |
| Providers | Claude, Copilot, OpenAI |
| Merged | `prd-agent` + `prd-factory-planner-agent` |
| Capabilities | 14 core across all planning phases |
| Date | 2026-07-23 |

## Core Capabilities

### PRD & Documentation

- Executive summaries, requirements, metrics, constraints, risks

### Feature Planning

- Breakdown, impact/effort matrices, user stories, criteria

### Timeline & Roadmap

- Release planning, milestones, sprints, estimation, dependencies

### Stakeholder Alignment

- Requirements gathering, workflows, change management, templates

## Validation ✅

- ✅ Agent specification merged
- ✅ Multi-provider configurations verified
- ✅ Tool integrations confirmed
- ✅ Capabilities documented
- ✅ All resources documented
- ✅ Agent catalogued

**Part of:** Agent Standardisation Initiative – Phase 2 (Epic #1079)  
**Completed:** 2026-07-23 | **Maintainer:** Ash Shaw

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

## Related Issues

This project is coordinated with:

- [#1733](https://github.com/lightspeedwp/.github/issues/1733) — Phase 2: Folder Structure & Linking

See [Linking Standard](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/reports-projects-restructuring-2026-08-11/LINKING_STANDARD.md) for linking patterns.
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

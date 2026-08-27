# Agentic Workflows

GitHub Agentic Workflows for LightSpeed release orchestration and automation.

## Contents

### Release Agent

**File:** `release.agent.js`

Orchestrates release automation with:

- Step 1: Initialize & Pre-flight checks
- Step 2: Agentic reasoning with confidence scoring
- Steps 3-9: 7-layer safety gates
- Step 10: Audit logging and report generation

Features:

- Dry-run mode with artifact generation
- Structured audit logging
- AUGMENT strategy: wraps Phase 4 shell scripts (no breaking changes)
- Patch/minor/major scopes with tiered approvals

**Usage:**

```bash

# Dry-run test

node release.agent.js --scope=patch --dry-run --skip-branch-check

# Live release

node release.agent.js --scope=patch
```

### Specifications

**File:** `release.md`

Declarative workflow specification defining:

- 10 workflow steps
- Input/output contracts
- Safety gates and approval flows
- Error handling strategies
- Dry-run mode behavior

## Status

Phase 5A MVP (Week 2, 2026-08-12)

- ✅ Core orchestrator implemented
- ✅ All 7 safety gates functional
- ✅ Dry-run support verified
- ⏳ Phase 4 shell script integration (Phase 5A Week 2 Days 3-4)

## References

- [AGENTIC_WORKFLOW_SPEC.md](../../projects/active/release-agentic-workflows-2026-08-11/AGENTIC_WORKFLOW_SPEC.md) — Design decisions
- [Phase 5A Project](../../projects/active/release-agentic-workflows-2026-08-11/) — Full project documentation

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

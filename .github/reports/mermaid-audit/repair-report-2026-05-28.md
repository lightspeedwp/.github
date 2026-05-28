---
file_type: "report"
title: "Wave 3B: Mermaid Diagram Repair Report"
description: "Line-by-line record of all Mermaid accessibility repairs applied during Wave 3B."
version: "v1.0"
created_date: "2026-05-28"
last_updated: "2026-05-28"
owners: ["LightSpeed Team"]
tags: ["mermaid", "accessibility", "wcag", "repair", "wave-3b"]
status: "active"
stability: "stable"
domain: "governance"
---

# Wave 3B: Mermaid Diagram Repair Report

**Date**: 2026-05-28  
**Author**: Claude (Wave 3B owner)  
**Branch**: `feat/513-wave-3b-readme-mermaid-repair`  
**PR**: See Wave 3B pull request for full diff

---

## Summary

15 Mermaid diagrams across 8 README files were repaired to add `accTitle` and
`accDescr` accessibility attributes, bringing WCAG 2.2 AA compliance from 21% to
100%. No syntax errors were found or introduced. No diagram content was changed —
all edits are additive (attributes only).

---

## Repair Log

### 1. `.github/README.md`

**Diagrams repaired**: 4

#### Diagram 1 — GitHub Template Ecosystem Architecture (flowchart TB)

- **Change**: Added `accTitle` and `accDescr` immediately after the opening `flowchart TB` declaration
- **accTitle**: `"GitHub Template Ecosystem Architecture"`
- **accDescr**: Describes .github hub providing templates and automation to consuming repos

#### Diagram 2 — GitHub Automation Workflow Process (sequenceDiagram)

- **Change**: Added `accTitle` and `accDescr` before the first `participant` line
- **accTitle**: `"GitHub Automation Workflow Process"`
- **accDescr**: Describes developer → repo → hub → automation → PM notification sequence

#### Diagram 3 — Repository Structure Visualisation (graph TB)

- **Change**: Added `accTitle` and `accDescr` before the first `subgraph` line
- **accTitle**: `"Repository Structure Visualisation"`
- **accDescr**: Describes .github directory tree with all subdirectories

#### Diagram 4 — Complete Integration Flow (flowchart LR)

- **Change**: Added `accTitle` and `accDescr` before the first `subgraph` line
- **accTitle**: `"Complete Integration Flow"`
- **accDescr**: Describes end-to-end contributor journey from issue through PR and automation

---

### 2. `profile/README.md`

**Diagrams repaired**: 4

#### Diagram 1 — LightSpeed Organisation Overview (flowchart LR)

- **Change**: Added `accTitle` and `accDescr` before the first `subgraph` line
- **accTitle**: `"LightSpeed Organisation Overview"`
- **accDescr**: Describes agency (est. 2003), core products, and outcomes

#### Diagram 2 — Contribution Process Flow (flowchart TD)

- **Change**: Added `accTitle` and `accDescr` before the first node definition
- **accTitle**: `"Contribution Process Flow"`
- **accDescr**: Describes four contribution paths (bug, feature, code, docs) through review to merge

#### Diagram 3 — Project Architecture and Integration (graph TB)

- **Change**: Added `accTitle` and `accDescr` before the first `subgraph` line
- **accTitle**: `"Project Architecture and Integration"`
- **accDescr**: Describes frontend, backend, developer tools, documentation, and community layers

#### Diagram 4 — Community Engagement Lifecycle (stateDiagram-v2)

- **Change**: Added `accTitle` and `accDescr` before the `[*] --> Discover` line
- **accTitle**: `"Community Engagement Lifecycle"`
- **accDescr**: Describes seven-state lifecycle: Discover → Explore → Engage → Contribute → Collaborate → Lead → Mentor → (back to Engage)

---

### 3. `scripts/README.md`

**Diagrams repaired**: 3

#### Diagram 1 — Scripts Architecture (graph TB)

- **Change**: Added `accTitle` and `accDescr` before the first node definition
- **accTitle**: `"Scripts Architecture"`
- **accDescr**: Describes scripts directory with seven subdirectories and includes utilities

#### Diagram 2 — Automation Workflow (sequenceDiagram)

- **Change**: Added `accTitle` and `accDescr` before the first `participant` line
- **accTitle**: `"Automation Workflow"`
- **accDescr**: Describes developer executing script through utilities, tests, and CI/CD

#### Diagram 3 — Script Execution Flow (flowchart TD)

- **Change**: Added `accTitle` and `accDescr` before the first node definition
- **accTitle**: `"Script Execution Flow"`
- **accDescr**: Describes dependency check → load → parse → validate → execute → test → exit flow

---

### 4. `scripts/validation/README.md`

**Diagrams repaired**: 1

#### Diagram 1 — Validation Pipeline (graph TD)

- **Change**: Added `accTitle` and `accDescr` before the first node definition
- **accTitle**: `"Validation Pipeline"`
- **accDescr**: Describes six-step pipeline: discovery → extraction → schema validation → rules → reference check → report

---

### 5. `.github/ISSUE_TEMPLATE/README.md`

**Diagrams repaired**: 1

#### Diagram 1 — Issue Template Workflow (flowchart TD)

- **Change**: Added `accTitle` and `accDescr` before the first node definition
- **accTitle**: `"Issue Template Workflow"`
- **accDescr**: Describes template selection decision tree leading to agent processing and project board routing

---

### 6. `.github/projects/README.md`

**Diagrams repaired**: 1

#### Diagram 1 — Reports Directory Structure (graph TD)

- **Change**: Added `accTitle` and `accDescr` before the first node definition
- **accTitle**: `"Reports Directory Structure"`
- **accDescr**: Describes .github/reports branching into sixteen report-type subdirectories

---

### 7. `.vscode/README.md`

**Diagrams repaired**: 1

#### Diagram 1 — VS Code Configuration Architecture (flowchart TD)

- **Change**: Added `accTitle` and `accDescr` before the first node definition
- **accTitle**: `"VS Code Configuration Architecture"`
- **accDescr**: Describes workspace split into extensions, tasks, and settings branches with specific tools

---

### 8. `tests/README.md`

**Diagrams repaired**: 3

#### Diagram 1 — Testing Architecture (graph TB)

- **Change**: Added `accTitle` and `accDescr` before the first node definition
- **accTitle**: `"Testing Architecture"`
- **accDescr**: Describes framework split into Bats (shell), Jest (JavaScript), coverage reporting, and helpers

#### Diagram 2 — Test Execution Workflow (sequenceDiagram)

- **Change**: Added `accTitle` and `accDescr` before the first `participant` line
- **accTitle**: `"Test Execution Workflow"`
- **accDescr**: Describes developer → Bats → Jest → coverage → CI → developer notification sequence

#### Diagram 3 — Test Coverage Flow (flowchart TD)

- **Change**: Added `accTitle` and `accDescr` before the first node definition
- **accTitle**: `"Test Coverage Flow"`
- **accDescr**: Describes test-type split (shell/JS) with both paths merging into shared coverage collection

---

## Validation

```bash
# Verify all mermaid blocks now have accTitle
grep -B1 'accTitle' $(grep -rl '```mermaid' . --include="README.md" | grep -v node_modules)

# Confirm root README unchanged
grep -c 'accTitle' README.md  # expected: 4
```

---

## References

- [Mermaid Instructions](../../../instructions/mermaid.instructions.md)
- [Audit Report](./audit-report-2026-05-28.md)
- [Findings CSV](./findings.csv)
- [Wave 3B Issue #513](https://github.com/lightspeedwp/.github/issues/513)

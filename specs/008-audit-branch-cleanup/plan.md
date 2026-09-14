# Implementation Plan: Audit and Refactor Branch Cleanup Infrastructure

**Branch**: `task/branch-cleanup-refactor` | **Date**: 2026-09-14 | **Spec**: [specs/008-audit-branch-cleanup/spec.md](spec.md)

**Input**: Feature specification from `specs/008-audit-branch-cleanup/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Comprehensive audit and refactoring of branch cleanup infrastructure to address 300+ accumulated branches in the `.github` repository. The work is structured in three phases:

1. **P1 - Audit**: Generate comprehensive categorisation of all branches as KEEP/DELETE/DISCUSS
2. **P2 - Safe Cleanup**: Produce verified deletion candidates and flag edge cases for discussion
3. **P3 - Refactor & Automate**: Harmonise cleanup scripts, documentation, and implement scheduled workflow

Primary technical approach: Enhance `scripts/cleanup-branches.js` to perform safe, categorised audits with clear reporting and optional automated execution.

## Technical Context

**Language/Version**: JavaScript (Node.js 22) — existing cleanup scripts are JS

**Primary Dependencies**: 
- GitHub CLI (`gh`) — for querying open PRs
- git — for merge history analysis
- Node.js standard library (fs, path, child_process)

**Storage**: N/A (read-only operations on git repository metadata)

**Testing**: Node.js test framework (existing: npm test), git-based validation

**Target Platform**: Linux/CI environments (GitHub Actions runners)

**Project Type**: Maintenance automation / CLI tool (branch hygiene)

**Performance Goals**: Audit report generation <5 seconds for repositories with 500+ branches (SC-004)

**Constraints**: 
- Safe by default (dry-run mode)
- Zero accidental data loss (100% merge verification before deletion)
- Support custom exclusion patterns and thresholds

**Scale/Scope**: 
- Current repository: 300+ branches → target <50 active
- .github repository is the source of truth for multiple downstream repositories

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Applied Principles** (from `.specify/memory/constitution.md`):

1. ✅ **Specification-First Process**: Feature follows SpecKit workflow (specification → clarification → planning → tasks)
2. ✅ **Asset Boundaries**: Cleanup infrastructure is portable reusable assets (scripts, documentation, prompts) — belongs in top-level folders or `.github/` if repository-specific
3. ✅ **Technology-Agnostic Guidance**: Branch cleanup concepts apply universally; documentation must not assume specific tech stacks
4. ✅ **UK English Standards**: All refactored documentation and code comments must use UK English (colour, optimise, organisation)
5. ✅ **Branch Naming Non-Negotiable**: Feature directly enforces and validates the mandatory `{type}/{scope}-{title}` pattern and forbidden prefixes
6. ✅ **Code Review & Quality Gates**: Cleanup logic requires verification that merge detection is correct and deletion is safe

**Design Decisions Requiring Justification**: None at this phase (all straightforward maintenance work)

**Gates Status**: ✅ PASS — All constitutional principles satisfied. Feature aligns with governance without violations.

## Project Structure

### Documentation (this feature)

```text
specs/008-audit-branch-cleanup/
├── spec.md              # Feature specification (user stories, requirements)
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 output (research findings, design decisions)
├── data-model.md        # Phase 1 output (branch entity model, categorisation logic)
├── quickstart.md        # Phase 1 output (validation guide, usage examples)
├── contracts/           # Phase 1 output (interface contracts for audit output)
│   ├── audit-report.schema.json    # Markdown/JSON report format contract
│   └── deletion-candidates.schema.json # Safe deletion list contract
├── checklists/
│   └── requirements.md   # Quality validation checklist
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code & Configuration (repository root)

```text
scripts/
├── cleanup-branches.js          # Enhanced audit script (REFACTOR/ENHANCE)
└── validation/
    └── validate-branch-name.js  # Branch naming validator (REFACTOR for alignment)

.github/
├── workflows/
│   └── branch-audit.yml         # NEW: Scheduled branch audit workflow
└── reports/
    └── stale-branches-*.md      # Generated audit reports

docs/
├── BRANCH_CLEANUP.md            # REFACTOR: Update with new audit flow
├── BRANCHING_STRATEGY.md        # REFACTOR: Cross-reference cleanup
└── PR_CREATION_PROCESS.md       # UPDATE: Link to cleanup guidance

prompts/
├── 07-branch-worktree-cleanup.md  # REFACTOR: Align with new automation
└── (future) branch-audit-prompt.md # NEW: Audit execution prompt

agents/
└── chat-closure-agent/          # UPDATE: References to cleanup (if applicable)
```

**Structure Decision**: Maintenance automation project. No new top-level directories needed. Changes are:
1. **Enhancement** of existing `scripts/cleanup-branches.js` (safe, isolated)
2. **New workflow** in `.github/workflows/` for scheduled audits
3. **Documentation updates** in `docs/` for consistency and cross-referencing
4. **Generated reports** stored in `.github/reports/` with timestamp naming

## Design Artifacts

### Phase 0: Research Complete ✅

**Output**: `research.md`

Design decisions resolved:
- Merge detection via `git merge-base`
- PR detection via `gh pr list` filtering
- Categorisation logic: multi-gate decision tree
- Report format: Markdown + JSON dual output
- Deletion safety: 3-layer verification + dry-run default
- Performance target: <5 seconds for 500+ branches
- Branch naming validation: centralised, imported module
- Exclusion patterns: regex-based CLI option

No remaining open questions.

### Phase 1: Design Complete ✅

**Outputs**:
1. `data-model.md` — Entity definitions and categorisation logic
2. `contracts/audit-report.schema.json` — Audit report format (JSON schema)
3. `contracts/deletion-candidates.schema.json` — Deletion candidates format (JSON schema)
4. `quickstart.md` — Validation guide with 7 runnable scenarios

**Key Design Decisions**:
- Branch entity with 11 core attributes + 1 computed status property
- BranchAuditReport structure with categories: KEEP/DELETE/DISCUSS
- Decision tree with 8 gates for unambiguous categorisation
- 30+ branch types from canonical taxonomy
- State transitions from creation → deletion
- Multi-layer safety validation before deletion

### Constitution Re-Check (Post-Design)

✅ All design decisions align with constitutional principles:
- Specification-first ✅
- Portable assets ✅
- Technology-agnostic ✅
- UK English ✅
- Branch naming enforcement ✅
- Code review gates ✅

---

## Complexity Tracking

No violations — all design straightforward maintenance work with established patterns.

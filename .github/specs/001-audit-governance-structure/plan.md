# Implementation Plan: Governance Files Audit & Refactor

**Branch**: `audit/governance-files-refactor` | **Date**: 2026-09-14 | **Spec**: [specs/001-audit-governance-structure/spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-audit-governance-structure/spec.md`

**Note**: This implementation plan defines the technical design, architecture, and validation approach for auditing and refactoring CLAUDE.md and AGENTS.md governance files.

## Summary

Audit CLAUDE.md and AGENTS.md to identify and resolve duplicate content, bad references, broken cross-links, and structural inconsistencies. Refactor both files to establish a single source of truth for branch naming, label governance, AI rules, and specification-first workflow. Output refactored governance files with improved organization, consolidated sections, validated references, and clear workflow guidance aligned with constitution principles.

## Technical Context

**Language/Version**: Markdown (documentation), YAML (configuration)

**Primary Dependencies**:

- CLAUDE.md (current governance file)
- AGENTS.md (current governance file)
- `.specify/memory/constitution.md` (principle reference)
- Existing governance branches (15 discovered, potential consolidation targets)

**Storage**: Git repository; feature and audit artefacts live under `.github/`, portable instructions live in top-level `instructions/`, and repository-local instructions live in `.github/instructions/`

**Testing**:

- Manual review of refactored files against quality criteria
- Automated validation: reference checking (file path verification), duplicate detection (text similarity)
- Cross-file consistency validation (no conflicting guidance)
- Branch naming validation against actual example branches

**Target Platform**: GitHub repository governance; audience includes AI agents, human contributors, GitHub Actions workflows, CI/CD systems

**Project Type**: Documentation/Governance audit and refactor

**Performance Goals**: Clarity and discoverability (reader can find any governance topic in <2 minutes of navigation)

**Constraints**:

- No breaking changes to existing functionality (existing PRs/branches must remain valid)
- @ashley must approve all refactored governance changes (Constitution Principle II)
- Cannot modify LOCKED files (`.github/labels.yml`, `.github/issue-types.yml`, templates) — audit only
- All references must point to valid files in repository (no broken links)
- UK English spelling and accessibility standards maintained (Constitution Principle VI)

**Scale/Scope**:

- ~1000 lines across 2 main files (CLAUDE.md ~270 lines, AGENTS.md ~350 lines)
- ~500 lines of refactored/consolidated content
- 15 governance-related branches to reference/consolidate
- 158 labels, 24 issue types, 26 issue templates, 19 PR templates (audit existing docs, not modify)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle Alignment Verification

**Principle I: Organisation-Wide Governance Authority** ✅

- Spec treats CLAUDE.md/AGENTS.md as authoritative source
- Audit ensures consistency across governance files (no contradictions)
- Plan addresses how refactored files maintain this authority

**Principle II: Curated Assets with Locked Governance** ✅

- Plan respects that labels, issue-types, templates are LOCKED
- Audit task is to document and validate, not modify these files
- Requires @ashley approval for any changes to governance files

**Principle III: Clear Asset Boundaries (No Duplication)** 🎯 **PRIMARY GOAL**

- Spec identifies duplicate sections (Label Creation Governance appears twice in AGENTS.md)
- Plan will consolidate duplicates to single source of truth
- Audit verifies portable assets belong in top-level folders, not `.github/`

**Principle IV: Technology-Agnostic Guidance** ✅

- Audit checks that CLAUDE.md/AGENTS.md guidance applies universally
- Plan ensures refactored content remains technology-agnostic (not WordPress-specific, language-specific, etc.)

**Principle V: Branch Naming Strategy is Non-Negotiable** 🎯 **PRIMARY CONSTRAINT**

- Spec fixes the exact issue: `claude/` prefix in AI tool behavior violates branch naming rules
- Three existing branches found using forbidden prefixes (concrete evidence of problem)
- Audit verifies branch naming guidance is consistent, clear, actionable

**Principle VI: UK English, Accessibility, Security Standards** ✅

- Refactored content will use UK English spelling
- All governance files are accessibility-compatible (semantic markdown)
- Security guidance remains consistent (validate input, escape output, no secrets)

### Gate Outcomes

✅ **GATE PASS**: Feature spec aligns with all 6 constitution principles. No conflicts identified.

⚠️ **Risk Mitigation Required**:

- Existing branches with forbidden prefixes demonstrate the problem vividly
- Refactored files must make branch naming so clear that mistakes become impossible
- User @ashley confirmed as approval authority; no escalation needed

---

## Phase Breakdown

### Phase 0: Audit Research & Findings Consolidation

**Goal**: Consolidate all audit findings from AUDIT_FINDINGS.md into comprehensive research document with resolved clarifications and decision documentation.

**Deliverables**:

- `research.md` — Detailed audit findings, verification results, and decision rationale

**Output Acceptance Criteria**:

- ✅ All initial audit findings documented
- ✅ Verification status for 7 verification tasks documented
- ✅ Decision rationale for each consolidation/fix documented
- ✅ References to existing governance branches documented
- ✅ No NEEDS CLARIFICATION markers remain

### Phase 1: Governance Concepts & Validation Framework

**Goal**: Define the governance data model, contracts, and validation process for the refactored files.

**Deliverables**:

- `data-model.md` — Governance concepts, entities, relationships
- `quickstart.md` — Validation process and acceptance criteria
- No separate contracts/ directory (governance files aren't APIs)

**Output Acceptance Criteria**:

- ✅ Governance concepts clearly defined (spec vs. plan vs. tasks, locked vs. changeable, etc.)
- ✅ Validation scenarios described (how to test that refactoring was successful)
- ✅ Runnable checklist for verifying refactored files meet success criteria

### Phase 2: Task Decomposition

**Goal**: Break down refactoring work into 196 concrete tasks with file paths, acceptance criteria, and dependencies.

**Deliverables**:

- `tasks.md` — 196-task breakdown grouped by phase (audit, consolidation, refactoring, validation, approval, and follow-up)

**Output Acceptance Criteria** (per `/speckit-tasks` command):

- ✅ Each task has unique ID, description, acceptance criteria
- ✅ File paths are absolute or repository-relative with clear scope
- ✅ Dependencies documented where ordering matters
- ✅ Parallel tasks marked with [P] for concurrent execution
- ✅ Tasks map to original FR-/SC- identifiers from spec

---

## Project Structure

### Documentation (this feature)

```text
specs/001-audit-governance-structure/
├── spec.md              # Feature specification (6 stories, 10 FR, 8 SC)
├── plan.md              # This file - implementation plan (/speckit-plan output)
├── research.md          # Phase 0 output - audit findings & research
├── data-model.md        # Phase 1 output - governance concepts & entities
├── quickstart.md        # Phase 1 output - validation checklist & process
├── AUDIT_FINDINGS.md    # Initial audit summary
├── checklists/
│   └── requirements.md  # Quality validation checklist
└── tasks.md             # Phase 2 output - 196-task decomposition (/speckit-tasks)
```

### Instruction Contracts and Governance Files

```text
instructions/              # Portable, reusable instructions (VALIDATION TARGET)
├── languages.instructions.md              # Consolidated 1/5
├── documentation-formats.instructions.md  # Consolidated 2/5
├── quality-assurance.instructions.md       # Consolidated 3/5
├── automation.instructions.md              # Consolidated 4/5
├── community-standards.instructions.md     # Consolidated 5/5
├── coding-standards.instructions.md        # Supporting; not consolidated count
├── file-organisation.instructions.md       # Supporting; not consolidated count
├── branch-naming.instructions.md           # Supporting; not consolidated count
├── linting.instructions.md                 # Supporting; not consolidated count
└── instructions.instructions.md            # Supporting authoring contract

CLAUDE.md                 # Root Claude-specific project instructions (REFACTOR TARGET)
AGENTS.md                 # Root global AI rules and coding standards (REFACTOR TARGET)

.github/
├── instructions/        # Repository-local instructions (VALIDATION TARGET)
│   ├── branch-naming.instructions.md
│   ├── coding-standards.instructions.md
│   ├── file-organisation.instructions.md
│   └── plugin-structure.instructions.md
├── custom-instructions.md  # Copilot-specific rules (VALIDATION TARGET)
├── labels.yml           # Label definitions (LOCKED - audit only)
├── issue-types.yml      # Issue type definitions (LOCKED - audit only)
└── [ISSUE|PULL_REQUEST]_TEMPLATE/  # Templates (LOCKED - audit only)

.specify/
├── memory/
│   └── constitution.md  # Governance principles (REFERENCE)
└── feature.json         # Feature directory reference

docs/                    # Documentation targets (VALIDATION TARGET)
├── BRANCHING_STRATEGY.md
├── PR_CREATION_PROCESS.md
├── LABEL_STRATEGY.md
├── LABELING.md
└── [other governance docs]
```

### Governance Branch Targets (existing, potential consolidation)

15 governance-related branches identified; tasks will document relationships and consolidation opportunities:

```text
Primary targets:
  ✓ audit/governance-audit-implementation (existing audit work)
  ✓ feat/branch-naming-strategy-phase-3 (may be outdated)
  ✓ feat/branch-naming-phase-6-rollout (active phase 6 work)
  ✓ config/label-prefix-governance-phase-3 (active label work)

Branches with violations (examples of the problem):
  ✗ claude/pr-template-description-9eacc0 (FORBIDDEN PREFIX)
  ✗ claude/pr-workflow-governance-7zni64 (FORBIDDEN PREFIX)
  ✗ copilot/phase-42-consolidate-issue-close-governance (FORBIDDEN PREFIX)
```

```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

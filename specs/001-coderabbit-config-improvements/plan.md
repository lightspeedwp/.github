# Implementation Plan: CodeRabbit Configuration Optimization

**Branch**: `feat/coderabbit-config-optimization` | **Date**: 2026-09-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-coderabbit-config-improvements/spec.md`

**Status**: READY FOR IMPLEMENTATION

## Summary

Restructure and expand the `.coderabbit.yml` configuration file in the organisation control plane (`.github` repository) to provide comprehensive, branch-type-specific review instructions for all 30+ branch types and 95%+ of file types. These improvements will be deployed **organisation-wide** via CodeRabbit's central configuration feature, standardising code review quality across all repositories in the organisation. Implementation follows explicit path pattern priority/specificity ordering (specific patterns override general patterns), with external audit guide for coverage verification.

**Key Outcomes**:
- All 30+ branch types get customized review context (feat/, fix/, security/, perf/, etc.) — **applied across the entire organisation**
- Path patterns follow explicit priority/specificity rules (clear documentation)
- 95%+ file type coverage with 3+ specific review focus areas per instruction block
- External `CODERABBIT_COVERAGE_AUDIT.md` guide for maintainers
- Zero breaking changes to existing CodeRabbit workflows across organisation repos
- Unified code review standards across all repositories via central configuration

## Technical Context

**Project Type**: Configuration/Tooling (YAML configuration file for CodeRabbit central configuration)

**Primary Asset**: `.coderabbit.yml` (443 lines → expanded to ~800-1000 lines with all improvements) — **Central configuration file that applies organisation-wide**

**Storage**: YAML format (in version control at `.github/coderabbit.yml` in the organisation control plane repository)

**Scope**: Changes to this file apply **to all repositories in the organisation** that consume the central CodeRabbit configuration (see CodeRabbit central configuration docs)

**Testing**: 
- Manual review of config structure against specification
- CodeRabbit review quality audit (examine sample PRs in multiple repos to verify branch-type context is applied organisation-wide)
- Coverage audit using external guide
- Cross-repository validation (test config application in at least 3-5 different project types)

**Target Platform**: GitHub (CodeRabbit integration at organisation level via central configuration)

**Language/Version**: YAML (no version constraints; must remain CodeRabbit-compatible schema v2.0)

**Primary Dependencies**: 
- CodeRabbit overrides schema (https://coderabbit.ai/integrations/coderabbit-overrides.v2.json)
- Organization branch naming strategy (CLAUDE.md)
- Organization labels system (`.github/labels.yml` - frozen/LOCKED)

**Performance Goals**: Config must load instantly (<100ms); review instructions must be easy for CodeRabbit to parse and apply

**Constraints**: 
- MUST maintain backward compatibility (no breaking changes to existing path_instructions across all repositories)
- MUST NOT duplicate content in AGENTS.md, CLAUDE.md, or `.github/instructions/*.instructions.md`
- MUST respect LOCKED status of `.github/labels.yml`, `.github/issue-types.yml`, and templates
- MUST use UK English, WordPress Coding Standards, WCAG 2.2 AA accessibility per org standards
- MUST be technology-agnostic (no framework/language-specific implementation details) to apply across diverse repository types (WordPress plugins, PHP libraries, TypeScript packages, CLI tools, etc.)
- MUST NOT break or interfere with repo-specific CodeRabbit overrides (repos may define additional local rules)

**Scale/Scope** (Organisation-Wide):
- 30+ branch types requiring context-aware review instructions (apply across all repos)
- 95%+ file type coverage for common organisation patterns (baseline: ~50 current file types/paths)
- ~15-20 new instruction blocks to add (covering emerging file types)
- ~30-40 existing instruction blocks to enhance (with 3+ focus areas each)
- **Impact**: Applied to all repositories in the organisation consuming central configuration
- **Diversity**: Instructions must accommodate multiple repository types and project structures

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**No constitution file defined** for this project repository (`.specify/memory/constitution.md` is a template placeholder). Scope and constraints are derived from organizational standards in CLAUDE.md and AGENTS.md:

✅ **Organizational Standards Alignment**:
- UK English terminology
- WordPress Coding Standards adherence
- WCAG 2.2 AA accessibility requirements
- No duplication with centralized documentation

✅ **Backward Compatibility**:
- No breaking changes to CodeRabbit workflow
- Additive improvements only

✅ **Governance**:
- Respects LOCKED status of labels.yml, issue-types.yml, templates
- Aligns with branch naming strategy (feat/, fix/, security/, perf/, a11y/, etc.)

**Gate Status**: ✅ PASS - No violations or justifications needed.

## Organisation-Wide Impact

**Critical Context**: This `.coderabbit.yml` file functions as the **organisation control plane** for CodeRabbit configuration. Via CodeRabbit's central configuration feature, this single file applies review rules to **all repositories in the organisation** that consume the central configuration.

**Implications**:
1. **Massive Reach**: Changes here affect code review quality across the entire organisation
2. **Standardisation**: All repos get the same branch-type context and file-type guidance (unless they override locally)
3. **Maintenance Burden**: The audit guide becomes critical for ongoing coverage verification
4. **Testing Complexity**: Validation must span multiple repository types and project structures
5. **Migration Risk**: Must maintain backward compatibility across diverse repos with different CodeRabbit integration maturity

**Why This Matters**:
- Inconsistent review guidance across repos leads to varied code quality standards
- Branch-type-specific context (security/, perf/, a11y/) will be uniformly applied, improving consistency
- 95%+ file type coverage ensures no critical file types are missed across the organisation
- External audit guide enables maintainers to identify and fix gaps proactively

## Project Structure

### Documentation (this feature)

```text
specs/001-coderabbit-config-improvements/
├── spec.md                           # ✅ Complete - Feature specification
├── plan.md                           # ← This file (planning output)
├── research.md                       # Phase 0 output (audit + analysis)
├── data-model.md                     # Phase 1 output (config structure & contracts)
├── quickstart.md                     # Phase 1 output (validation scenarios)
├── contracts/                        # Phase 1 output (instruction block schemas)
│   ├── branch-instruction-schema.md
│   ├── path-instruction-schema.md
│   └── priority-rules.md
├── checklists/
│   └── requirements.md               # ✅ Complete - Quality checklist (9/10 passing)
└── tasks.md                          # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
.github/
├── coderabbit.yml                    # ← PRIMARY DELIVERABLE (to be updated)
├── docs/
│   ├── CODERABBIT_COVERAGE_AUDIT.md  # ← NEW (external audit guide)
│   ├── LABELING.md                   # Reference for label consistency
│   ├── BRANCHING_STRATEGY.md         # Reference for branch types
│   └── CODING_STANDARDS.md           # Reference for review criteria
├── instructions/
│   ├── branch-*.instructions.md      # Optional: Per-branch-type guidance (if needed)
│   ├── file-type-*.instructions.md   # Optional: Specific file type deep-dives (if needed)
│   └── coding-standards.instructions.md
└── ...
```

**Structure Decision**: 
The primary artifact is the enhanced `.coderabbit.yml` file with:
1. **Branch-type-specific reviews**: New sections or parameterization for all 30+ branch types
2. **Path pattern reorganization**: Explicit priority/specificity ordering with clear documentation
3. **Enhanced instruction blocks**: Existing blocks expanded to 3+ focus areas, new blocks added for coverage gaps
4. **External audit guide**: Separate `CODERABBIT_COVERAGE_AUDIT.md` for maintainer reference

No new source code directories required. All changes are configuration and documentation.

## Implementation Phases

### Phase 0: Research & Analysis

**Deliverable**: `research.md`

**Tasks**:
1. Audit current `.coderabbit.yml` for:
   - Existing instruction blocks and their structure
   - File type/path coverage gaps
   - Branch type context handling (if any)
   - Pattern overlaps or priority conflicts

2. Research CodeRabbit best practices:
   - Path pattern specificity handling
   - Branch context injection methods
   - Instruction composition patterns

3. Document findings in `research.md`

---

### Phase 1: Design & Contracts

**Prerequisites**: `research.md` complete

**Deliverables**: `data-model.md`, `quickstart.md`, `contracts/`

1. **Data Model** (`data-model.md`): Config structure, path instruction blocks, branch types
2. **Contracts** (`contracts/`): Schemas for instruction blocks, priority rules
3. **Quickstart** (`quickstart.md`): Validation scenarios proving end-to-end functionality

---

### Phase 2: Task Decomposition

**Deliverable**: `tasks.md` (via `/speckit-tasks` command)

**Estimated**: 15-20 implementation tasks covering:
- Config audit & analysis
- Branch-type-specific sections (all 30+ types)
- Path pattern reorganization with priority rules
- Instruction enhancement (existing blocks → 3+ focus areas)
- New file type coverage (5-8 new patterns)
- Audit guide creation (`CODERABBIT_COVERAGE_AUDIT.md`)
- **Cross-repository validation** (test in ≥3 different repo types to ensure org-wide compatibility)
- **Migration testing** (verify zero breaking changes in existing CodeRabbit workflows)
- Testing & validation (per quickstart scenarios + org-wide validation)

## Complexity Tracking

> **No complexity justifications needed** - all decisions align with organizational standards and do not introduce violations.

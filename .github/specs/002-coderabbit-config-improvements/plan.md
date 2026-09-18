# Implementation Plan: CodeRabbit Configuration Optimization

**Branch**: `config/coderabbit-review-governance` | **Date**: 2026-09-11 (Updated: 2026-09-17) | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `.github/specs/002-coderabbit-config-improvements/spec.md`

**Status**: READY FOR IMPLEMENTATION (Scope Expanded 2026-09-17)

## Summary

Restructure and expand the `.coderabbit.yml` configuration file in the organisation control plane (`.github` repository) to provide comprehensive, technology-agnostic review instructions for 95%+ of file types, **PLUS** automated PR governance automation (template validation, label family enforcement, DoD checklist automation). These improvements will be deployed **organisation-wide** via CodeRabbit's central configuration feature, standardising code review quality AND governance consistency across all repositories in the organisation. Implementation follows explicit path pattern priority/specificity ordering (specific patterns override general patterns), with external audit guide for coverage verification. Branch-type-specific review guidance is documented externally in `docs/BRANCHING_STRATEGY.md` (section 5.3 "Branch-Type Review Context"), not as CodeRabbit automation features.

**Key Outcomes** (Unified Phase 1 Delivery):

- **Code Review Instructions**: Branch-type review context documented in `docs/BRANCHING_STRATEGY.md` section 5.3 for top 15-20 branch types (feat/, fix/, security/, perf/, a11y/, ci/, hotfix/, refactor/, task/, release/, chore/, test/, design/, ops/, docs/)
- **PR Governance Automation**: PR template validation (Linked Issues, Changelog, Checklist sections), label family enforcement (type:, meta:, status:, priority:, area: prefixes), DoD checklist automation (5-8 items per change scope), documentation validation failure handling
- **Path Patterns**: Explicit priority/specificity rules (clear documentation)
- **File Type Coverage**: 95%+ file type coverage with 3+ specific review focus areas per instruction block
- **External Audit Guide**: `CODERABBIT_COVERAGE_AUDIT.md` guide for maintainers
- **Zero Breaking Changes**: All improvements additive to existing CodeRabbit workflows across organisation repos
- **Unified Standards**: Code review + governance standards across all repositories via central configuration

**Scope Change** (2026-09-17):

- Session 2026-09-17 Clarification Q1: Expand Phase 1 to include PR governance automation (template validation, label enforcement, DoD checklist)
- Session 2026-09-17 Clarification Q2: Audit `.coderabbit.yml` lines 597-752 (150+ lines of governance documentation converted to active FR/SC)
- **Impact**: Effort estimate increases from 8-10 weeks (code review only) to 14-16 weeks (unified delivery); task count increases from ~45 to ~130-140 tasks

## Technical Context

**Project Type**: Configuration/Tooling (YAML configuration file for CodeRabbit central configuration + PR governance automation)

**Primary Assets**:

1. `.coderabbit.yml` (443 lines → expanded to ~1000-1200 lines with code review + PR governance improvements) — **Central configuration file that applies organisation-wide**
2. `.github/docs/CODERABBIT_COVERAGE_AUDIT.md` (NEW) — External audit guide for coverage verification
3. `docs/BRANCHING_STRATEGY.md` (section 5.3 update) — Branch-type review context documentation

**Storage**: YAML format (in version control at `.coderabbit.yml` in the organisation control plane repository); Markdown documentation in `.github/docs/`

**Scope**: Changes to `.coderabbit.yml` apply **to all repositories in the organisation** that consume the central CodeRabbit configuration. PR governance automation additions include template validation rules, label enforcement mappings, and DoD checklist schemas - all declarative in YAML, no code changes required.

**PR Governance Scope** (Phase 1 Expansion):

- **PR Template Validation** (FR-016, SC-014): CodeRabbit checks PR descriptions for required sections per branch-type template (Linked Issues, Changelog, Checklist); flags incomplete/placeholder sections
- **Label Enforcement** (FR-017, SC-015): CodeRabbit validates applied labels follow canonical prefixes (type:, meta:, status:, priority:, area:); suggests missing labels based on branch type and changed files
- **DoD Checklist Automation** (FR-018, SC-016): CodeRabbit populates PR descriptions with standardized DoD checklist (5-8 items per change type: feature, fix, docs, etc.); flags unchecked items
- **Documentation Validation** (FR-019, SC-017): CodeRabbit handles linting failures gracefully with explicit rules for skip paths, fail vs. warn decisions, and actionable remediation commentary

**Governance Audit Findings** (2026-09-17):

- Identified 150+ lines (597-752) of current `.coderabbit.yml` containing undeclared governance documentation
- Lines 597-646: GitHub Labels Reference (status, type, priority, area, language labels)
- Lines 647-678: PR Description Template Standards (required sections, validation rules, branch-type routing)
- Lines 679-739: Issue Description Template Standards (type-to-template mapping, validation rules)
- Lines 740-752: Label Automation Workflow documentation (routing by branch and file changes)
- **Action**: Convert documented governance patterns into active FR/SC and YAML schema entries

**Testing**:

- Manual review of config structure against specification
- CodeRabbit review quality audit (examine sample PRs in multiple repos to verify branch-type context is applied organisation-wide)
- Coverage audit using external guide
- Cross-repository validation (test config application in at least 3-5 different project types)

**Target Platform**: GitHub (CodeRabbit integration at organisation level via central configuration)

**Language/Version**: YAML (no version constraints; must remain CodeRabbit-compatible schema v2.0)

**Primary Dependencies**:

- CodeRabbit overrides schema (<https://coderabbit.ai/integrations/coderabbit-overrides.v2.json>)
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

- Top 15-20 branch types requiring context-aware review instructions (apply across all repos, covers ~80% of actual branch usage)
- 95%+ file type coverage for common organisation patterns (baseline: ~50 current file types/paths, target: 47-50 types)
- ~15-20 new instruction blocks to add (covering emerging file types)
- ~30-40 existing instruction blocks to enhance (with 3+ focus areas each)
- **Impact**: Applied to all repositories in the organisation consuming central configuration
- **Diversity**: Instructions must accommodate multiple repository types and project structures

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitution file**: `.specify/memory/constitution.md` (LightSpeed .github Control Plane Constitution v1.2.0, ratified 2026-09-11, last amended 2026-09-14)

✅ **Principle I - Organisation-Wide Governance Authority**: This `.coderabbit.yml` is an authoritative source for organisation-wide code review and governance standards applied via central configuration to 50+ consuming repositories. ✅ **Aligned**

✅ **Principle II - Curated Assets with Locked Governance**: Configuration respects LOCKED status of `.github/labels.yml` (158 labels), `.github/issue-types.yml` (24 types), PR/issue templates. PR governance automation validates but does not modify LOCKED files. ✅ **Aligned**

✅ **Principle III - Clear Asset Boundaries**: Code review instructions and PR governance rules stay in `.coderabbit.yml` (GitHub-centric). Branch-type review context documented in `docs/BRANCHING_STRATEGY.md` (portable). No duplication with AGENTS.md (global AI rules) or CLAUDE.md (repo instructions). ✅ **Aligned**

✅ **Principle IV - Technology-Agnostic Guidance**: Review instructions address universal principles (security, performance, accessibility, correctness) without assuming languages, frameworks, or project types. Covers WordPress plugins, Node.js/TypeScript systems, infrastructure-as-code, MCP servers uniformly. ✅ **Aligned**

✅ **Principle V - Branch Naming Strategy Non-Negotiable**: Configuration aligns with 38 authorized branch types and 3 FORBIDDEN prefixes (claude/, copilot/, openai/). PR template validation and label enforcement respect branch naming as routing foundation. ✅ **Aligned**

✅ **Principle VI - UK English, Accessibility, Security**: All documentation uses UK English (optimise, colour, organisation). Accessibility and security standards embedded in review instructions. ✅ **Aligned**

✅ **Principle VII - Specification Quality Standards**: Feature specification passes all 8 quality dimensions (Completeness, Clarity, Consistency, Measurability, Scenario Coverage, Edge Cases, Dependencies, Ambiguities). Clarifications document scope expansion and governance audit findings. ✅ **Aligned**

✅ **Principle VIII - Branch Strategy Compliance & Automated Enforcement**: PR governance automation enforces branch-type compliance, validates PR template routing per branch prefix, applies canonical labels with family prefixes. ✅ **Aligned**

✅ **Principle IX - Requirements-Driven Quality**: Configuration requires high-quality PR descriptions (per FR-016, SC-014) and changelog entries (linked in DoD automation). ✅ **Aligned**

✅ **Principle X - Automated Validation & Metrics**: PR governance automation provides continuous validation of template compliance, label enforcement, and DoD checklist completion. ✅ **Aligned**

**Constitution Violations**: None identified.

**Gate Status**: ✅ PASS - All 10 principles aligned. No violations or justifications needed.

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

## Technology Stack Diversity

**Critical Discovery**: The organisation spans multiple distinct technology stacks and project types:

**1. WordPress Ecosystem** (majority of projects)

- WordPress block themes
- WordPress block plugins
- PHP-based projects following WordPress Coding Standards

**2. Timesheet Management System** (ls-flow)

- `ls-flow` core system
- `ls-flow-zendesk-extension` integration
- `ls-flow-zendesk-app` application
- Likely Node.js/TypeScript stack

**3. Hosting & Infrastructure** (ops-focused)

- `lightspeed-hosting-infra` — infrastructure-as-code (likely Terraform/Kubernetes)
- `grounded-docs-infra` — documentation infrastructure
- DevOps/operations configuration

**4. Custom MCP Servers** (AI/automation integration)

- `playwright-mcp` — browser automation MCP
- `pagespeed-mcp` — performance analysis MCP
- `zendesk-mcp` — Zendesk integration MCP
- `lightspeed-pagespeed-mcp` — PageSpeed MCP
- `lsx-mcp-ui` — UI/UX MCP
- TypeScript/Node.js with MCP-specific patterns

**Impact on Path Instructions**:

- Instructions MUST be completely technology-agnostic (no PHP-specific, no Node-specific, no Terraform-specific guidance)
- Review focus must be on universal principles: code quality, security, performance, accessibility, testing
- File type patterns must accommodate diverse file structures (PHP projects, Node modules, IaC configs, TypeScript, etc.)
- Examples in instruction blocks should reference generic patterns, not specific frameworks
- Branch context guidance must translate across all project types (security/ branch guidance applies equally to WordPress plugins and MCP servers)

**Testing Strategy Impact**:

- Validation scenarios must test across at least one repo from each category
- Example: WordPress plugin (feat/ PR), infrastructure change (ops/ PR), MCP project (feat/ PR with TypeScript)
- Ensures instructions work consistently across diverse tech stacks

## Project Structure

### Documentation (this feature)

```text
specs/002-coderabbit-config-improvements/
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

**Estimated**: ~130-140 implementation tasks covering unified Phase 1 delivery of code review instructions + PR governance automation:

**Code Review Instructions** (~60-70 tasks):

- Config audit & analysis of existing instruction blocks
- Branch-type-specific sections (top 15-20 types with context-aware guidance)
- Path pattern reorganization with explicit priority/specificity rules
- Instruction enhancement (existing blocks → 3+ focus areas each per SC-002)
- New file type coverage (emerging types: .specify/, workflows/, plugins/)
- Audit guide creation (`CODERABBIT_COVERAGE_AUDIT.md`)

**PR Governance Automation** (~50-60 tasks):

- PR template validation rules (FR-016 → SC-014): required sections per branch type, format validation, placeholder detection
- Label enforcement mapping (FR-017 → SC-015): canonical prefix validation (type:, meta:, status:, priority:, area:), suggestion engine, branch-to-label routing
- DoD checklist automation (FR-018 → SC-016): per-scope checklist templates (feature, fix, docs, etc.), population logic, completion blocking rules
- Documentation validation handling (FR-019 → SC-017): skip-path rules, fail vs. warn decision logic, remediation commentary generation

**Testing & Validation** (~10-20 tasks):

- Cross-repository validation (test in ≥3 different repo types: WordPress plugin, Node.js/TypeScript project, infrastructure-as-code)
- Migration testing (verify zero breaking changes in existing CodeRabbit workflows)
- CodeRabbit review quality audit (sample PRs across multiple repos verify branch-type context applied org-wide)
- PR governance automation audit (template validation, label enforcement, DoD accuracy across test repos)
- Performance testing (config load time <100ms, review parsing efficiency)
- Org-wide rollout validation (all consuming repos accept config without errors)

**Effort Estimate**: 14-16 weeks unified Phase 1 delivery (code review instructions + PR governance automation fully integrated, tested, and deployed)

## Complexity Tracking

> **No complexity justifications needed** - all decisions align with organizational standards (Constitution v1.2.0 Principles I-X) and do not introduce violations.

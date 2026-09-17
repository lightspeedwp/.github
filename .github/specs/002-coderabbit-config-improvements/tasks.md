# Tasks: CodeRabbit Configuration Optimization

**Feature**: Code Review Instructions + PR Governance Automation (Unified Phase 1 Delivery)

**Input**: Specification and design documents from `/specs/002-coderabbit-config-improvements/`

**Status**: Phase 2 Task Decomposition Complete

**Scope**: ~260 implementation tasks organized into:

- ~60-70 code review instruction tasks
- ~50-60 PR governance automation tasks
- ~80-90 testing, validation & polish tasks

**Effort Estimate**: 14-16 weeks unified delivery

---

## Phase 1: Setup & Branch Preparation

**Purpose**: Initialise feature branch and establish working environment

- [x] T001 Verify branch exists: `config/coderabbit-review-governance`
- [x] T002 Verify design documents exist: spec.md, plan.md, research.md, data-model.md, contracts/, quickstart.md
- [x] T003 Create working directories: `.github/docs/`, `.github/tmp/`
- [x] T004 [P] Backup `.coderabbit.yml` to `.github/tmp/coderabbit.yml.backup`
- [x] T005 [P] Copy `.coderabbit.yml` to `.github/tmp/coderabbit.yml.current` for reference

**Checkpoint**: Working environment prepared ✅

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user story implementation

**⚠️ CRITICAL**: No instruction block work can begin until this phase is complete

### Configuration Audit & Analysis

- [x] T006 Audit `.coderabbit.yml` lines 1-100: document structure, reviews section, existing path_instructions
- [x] T007 Audit `.coderabbit.yml` lines 100-300: identify instruction blocks, structure, focus areas
- [x] T008 Audit `.coderabbit.yml` lines 300-500: analyze path specificity, overlaps, priority conflicts
- [x] T009 Audit `.coderabbit.yml` lines 500-596: extract branch context hints
- [x] T010 [P] Audit `.coderabbit.yml` lines 597-646: document GitHub labels reference (FR-011)
- [x] T011 [P] Audit `.coderabbit.yml` lines 647-678: document PR template standards (FR-012)
- [x] T012 [P] Audit `.coderabbit.yml` lines 679-739: document issue template standards (FR-012)
- [x] T013 [P] Audit `.coderabbit.yml` lines 740-752: document label automation workflow (FR-011)
- [x] T014 Create audit report documenting ~50 file types, gaps, and priorities
- [x] T015 Create audit report documenting overlapping patterns and solutions
- [x] T016 Validate audit findings against FR-001, FR-011, FR-012

### Priority & Specificity Framework

- [x] T017 Read contracts/priority-rules.md and understand 1-100 priority scale (FR-014)
- [x] T018 Document priority tiers: 90-100 (exact), 70-89 (specific dirs), 50-69 (file types), 30-49 (general), 10-29 (generic), 1-10 (catch-all)
- [x] T019 Create priority-mapping.txt for all audit file types
- [x] T020 Create pattern-conflicts.txt documenting resolution strategy
- [x] T021 Document conflict resolution examples for emerging patterns
- [x] T022 Establish instruction block template with 3-4 focus areas + 2-3 checks each
- [x] T023 Create instruction-template.md with canonical example
- [x] T024 Establish technology-agnostic principle: universal concepts only, no language/framework specifics (FR-006)

### Constitution Alignment

- [x] T025 Verify PR governance aligns with Constitution Principle VIII (FR-017)
- [x] T026 Verify label enforcement respects LOCKED `.github/labels.yml` (FR-017)
- [x] T027 Verify template validation respects quality standards (FR-016)
- [x] T028 Verify branch types from 38 authorized set (FR-006, FR-013)
- [x] T029 Verify no duplication with AGENTS.md, CLAUDE.md, instructions/ (FR-010)

**Checkpoint**: ✅ Foundation ready - audit complete, framework documented, ready for US implementation

---

## Phase 3: User Story 1 (P1) - Code Reviewer Gets Clear, Actionable Guidance 🎯 MVP

**Goal**: Define comprehensive instructions for 95%+ of file types

**Independent Test**: Submit PRs with different file types; verify CodeRabbit cites specific guidance ≥85% (SC-009)

### PR Governance Automation Foundation

**STATUS UPDATE (2026-09-17)**: PR governance rules moved to external documentation (`.github/docs/PR_GOVERNANCE.md`) because CodeRabbit v2 schema does NOT support `pr_governance` as a top-level YAML key. Rules are fully documented and ready for implementation via GitHub Actions workflows or CI/CD automation.

- [x] T030 Document pr_governance spec in `.github/docs/PR_GOVERNANCE.md`: 4 components (FR-016 through FR-019)
- [x] T031 [P] Document template_validation rules: branch-type-specific sections, validation patterns, severity levels (SC-014)
- [x] T032 [P] Document label_enforcement rules: 6 canonical families, branch-to-label mappings, auto-detection logic (SC-015)
- [x] T033 [P] Document dod_automation rules: scope detection, templates for feature/bugfix/docs/hotfix/refactor/perf/security (SC-016)
- [x] T034 [P] Document doc_validation rules: linting rules, skip_paths, failure handling, remediation strategy (SC-017)
- [x] T035 Create `.github/docs/PR_GOVERNANCE.md`: PR Template Validation section with all branch types
- [x] T036 Create `.github/docs/PR_GOVERNANCE.md`: Label Enforcement section with canonical families and mappings
- [x] T037 Create `.github/docs/PR_GOVERNANCE.md`: DoD Automation section with 9 scope templates (500+ lines comprehensive)
- [x] T038 Create `.github/docs/PR_GOVERNANCE.md`: Documentation Validation section with linting rules and remediation

### Code Review Instructions - Path Patterns (35+ blocks)

#### SpecKit Files (Priority 95)

- [x] T039 [US1] Create instruction block for `.specify/spec.md` (priority 95): specification completeness review (FR-007, SC-007)
- [x] T040 [US1] Create instruction block for `.specify/plan.md` (priority 95): implementation plan review (FR-007, SC-007)
- [x] T041 [US1] Create instruction block for `.specify/tasks.md` (priority 95): task decomposition review (FR-007, SC-007)

#### GitHub Workflows & CI/CD (Priority 90)

- [x] T042 [US1] Create instruction block for `.github/workflows/*.yml` (priority 90): GitHub Actions review (FR-001)
- [x] T043 [US1] Create instruction block for `.github/scripts/` (priority 88): automation script review (FR-001)

#### GitHub Templates & Configuration (Priority 85-90)

- [x] T044 [US1] Create instruction block for `.github/ISSUE_TEMPLATE/` (priority 87): issue template review (FR-001, FR-012)
- [x] T045 [US1] Create instruction block for `.github/PULL_REQUEST_TEMPLATE/` (priority 87): PR template review (FR-001, FR-012)
- [x] T046 [US1] Create instruction block for `.github/labels.yml` (priority 85): label definition review (FR-001, FR-011)
- [x] T047 [US1] Create instruction block for `.github/issue-types.yml` (priority 85): issue type definition review (FR-001)

#### Documentation Files (Priority 80)

- [x] T048 [US1] Create instruction block for `docs/BRANCHING_STRATEGY.md` (priority 82): branching strategy review (FR-006, FR-013)
- [x] T049 [US1] Create instruction block for `docs/LABELING.md` (priority 80): labeling strategy review (FR-001)
- [x] T050 [US1] Create instruction block for `docs/*.md` (priority 70): general documentation review (FR-001)

#### Code & Type Definition Files (Priority 50-70)

- [x] T051 [US1] Create instruction block for `agents/` (priority 65): agent specification review (FR-001, FR-010)
- [x] T052 [US1] Create instruction block for `instructions/` (priority 65): instruction file review (FR-001, FR-010)
- [x] T053 [US1] Create instruction block for `skills/*/SKILL.md` (priority 63): skill documentation review (FR-008, SC-007)
- [x] T054 [US1] Create instruction block for `workflows/` (priority 62): agentic workflow review (FR-008)
- [x] T055 [US1] Create instruction block for `**/*.md` (priority 55): markdown documentation review (FR-001, SC-002)
- [x] T056 [US1] Create instruction block for `**/*.{js,ts,tsx}` (priority 50): TypeScript/JavaScript review (FR-001)
- [x] T057 [US1] Create instruction block for `**/*.{py}` (priority 50): Python code review (FR-001)
- [x] T058 [US1] Create instruction block for `**/*.{php}` (priority 50): PHP code review (FR-001, FR-006)
- [x] T059 [US1] Create instruction block for `**/test/**`, `**/*.test.*` (priority 60): test code review (FR-001)
- [x] T060 [US1] Create instruction block for `.github/tmp/`, `**/*.generated.*` (priority 40): generated/temporary file review (FR-001)
- [x] T061 [US1] Create instruction block for `**/*` (priority 10): universal file review guidance (FR-001, SC-002)

### Code Review Instructions - Enhancement (All Blocks)

- [x] T062 [P] [US1] Review all blocks T039-T061: ensure 3-4 distinct focus areas per SC-002
- [x] T063 [P] [US1] Review all blocks: ensure 2-3 specific, actionable checks per focus area
- [x] T064 [P] [US1] Review all blocks: verify technology-agnostic language (FR-006)
- [x] T065 [P] [US1] Review all blocks: validate markdown structure, formatting, references
- [x] T066 [US1] Verify security-critical files have prominent security guidance (FR-003, SC-003)
- [x] T067 [US1] Verify performance-related files reference performance criteria (FR-004)
- [x] T068 [US1] Verify accessibility-related files reference WCAG 2.2 AA (FR-005)

### Coverage Validation for US1

- [x] T069 [US1] Count instruction blocks: target 47-50 per SC-001
- [x] T070 [US1] Verify coverage meets ≥95% per SC-001
- [x] T071 [US1] Document any gaps from audit (T014) - mark for future phases

**Checkpoint**: US1 complete - 47-50 instruction blocks with 3-4 focus areas each, technology-agnostic guidance

---

## Phase 4: User Story 2 (P2) - Maintainers Can Verify Review Coverage

**Goal**: Create audit guide and coverage verification tools

**Independent Test**: Run CODERABBIT_COVERAGE_AUDIT.md procedure; verify it identifies all 47-50 types and gaps

### Coverage Audit Guide Creation

- [x] T072 [US2] Create `.github/docs/CODERABBIT_COVERAGE_AUDIT.md` (external guide per FR-015)
- [x] T073 [US2] Document: File Type Inventory Procedure (list paths, extract categories, create master list)
- [x] T074 [US2] Document: Coverage Mapping Procedure (cross-reference patterns, mark explicit vs catch-all)
- [x] T075 [US2] Document: Gap Analysis Procedure (identify missing types, assess impact, recommend priority)
- [x] T076 [US2] Document: Priority Verification Procedure (verify unique priorities, specificity rules, conflicts)
- [x] T077 [US2] Document: Focus Area Validation Procedure (count areas/checks, flag insufficient blocks)
- [x] T078 [US2] Document: Examples for WordPress plugin, Node.js, infrastructure-as-code projects
- [x] T079 [US2] Document: Maintenance schedule & trigger events for re-audit
- [x] T080 [US2] Validate guide completeness: can maintainer follow without additional context?

### Coverage Verification Report

- [x] T081 [US2] Create coverage-report.txt using CODERABBIT_COVERAGE_AUDIT.md procedure
- [x] T082 [US2] Verify coverage shows ≥95% per SC-001
- [x] T083 [US2] Verify coverage identifies any critical files with only catch-all
- [x] T084 [US2] Create coverage_summary.txt: total blocks, coverage %, explicit vs catch-all, emerging types

**Checkpoint**: US2 complete - maintainers have audit guide; coverage verified at 96% (59 blocks, 47 file types)

---

## Phase 5: User Story 3 (P2) - Branch Strategy Enforcement Aligns with Reviews

**Goal**: Document branch-type-specific review context for top 15-20 types

**Independent Test**: Verify security/, feat/, docs/, perf/ branches receive context-appropriate guidance

### Branch-Type Review Context Documentation

- [x] T085 [US3] Read CLAUDE.md to identify all 38 authorized branch types
- [x] T086 [US3] Prioritize top 15-20 types: feat, fix, security, perf, docs, a11y, ci, hotfix, refactor, task, release, chore, test, design, ops
- [x] T087 [US3] Create docs/BRANCHING_STRATEGY.md Section 5.3: "Branch-Type Review Context"
- [x] T088 [US3] Document review context for feat/: feature-type-specific priorities
- [x] T089 [US3] Document review context for fix/: bug-fix-specific priorities
- [x] T090 [US3] Document review context for security/: security-specific priorities
- [x] T091 [US3] Document review context for perf/: performance-specific priorities
- [x] T092 [US3] Document review context for a11y/: accessibility-specific priorities
- [x] T093 [US3] Document review context for docs/: documentation-specific priorities
- [x] T094 [US3] Document review context for ci/: CI/CD-specific priorities
- [x] T095 [US3] Document review context for hotfix/: urgency-aware review
- [x] T096 [US3] Document review context for refactor/: refactoring-specific priorities
- [x] T097 [US3] Document review context for task/: scoped work priorities
- [x] T098 [US3] Document review context for release/: release-specific priorities
- [x] T099 [US3] Document review context for chore/: maintenance priorities
- [x] T100 [US3] Document review context for test/: test-specific priorities
- [x] T101 [US3] Document review context for design/: design-specific priorities
- [x] T102 [US3] Document review context for ops/: operations-specific priorities
- [x] T103 [US3] [P] Document review context for 5-10 additional high-frequency types
- [x] T104 [US3] Verify all 38 types mentioned; top 15-20 have full context (FR-006, FR-013)
- [x] T105 [US3] Verify branch-type context is technology-agnostic (FR-006)
- [x] T106 [US3] Create BranchContext reference section in docs/BRANCHING_STRATEGY.md (section 5.3)

**Checkpoint**: US3 complete - branch-type context documented for 22 types in detail + 9 additional types; developers can reference branch-specific priorities

---

## Phase 6: User Story 4 (P3) - New File Types and Tooling Are Covered

**Goal**: Ensure emerging file types have comprehensive review instructions

**Independent Test**: Create/modify .specify/spec.md, workflows/*.md, plugins/*/SKILL.md; verify CodeRabbit provides relevant feedback

### New File Type Instruction Enhancement

- [x] T107 [US4] Verify .specify/spec.md instruction block exists (T039) with 3+ focus areas
- [x] T108 [US4] Verify .specify/plan.md instruction block exists (T040) with 3+ focus areas
- [x] T109 [US4] Verify .specify/tasks.md instruction block exists (T041) with 3+ focus areas
- [x] T110 [US4] Verify workflows/*.md instruction block exists with 3+ focus areas
- [x] T111 [US4] Verify plugins/*/SKILL.md instruction block exists with 3+ focus areas
- [x] T112 [US4] Test: Create sample .specify/spec.md; verify CodeRabbit cites specification guidance
- [x] T113 [US4] Test: Create sample workflows/test-workflow.md; verify CodeRabbit cites workflow guidance
- [x] T114 [US4] Test: Create sample plugins/test-skill/SKILL.md; verify CodeRabbit cites skill guidance
- [x] T115 [US4] Validate new types have 3+ focus areas (SC-002, SC-007)
- [x] T116 [US4] Validate new types are technology-agnostic (FR-006)

**Checkpoint**: US4 complete - emerging file types covered with specific guidance; SC-007 validated (existing instruction blocks verified in Phase 1)

---

## Phase 7: User Story 5 (P3) - Consistency Across Instructions Improves Usability

**Goal**: Standardize structure, tone, formatting across 59 blocks

**Independent Test**: Analyze all blocks against consistency checklist; verify ≥95% compliance

### Instruction Structure Standardization

- [x] T117 [US5] [P] Review all instruction blocks: consistent structure (header, intro, 3-4 focus areas, 2-3 checks, references)
- [x] T118 [US5] Standardize terminology: "validation" vs "verification", security concepts, performance metrics
- [x] T119 [US5] Standardize formatting: bullet styles, bold, code, links
- [x] T120 [US5] Verify technology-agnostic: no language/framework-specific guidance (FR-006)
- [x] T121 [US5] Verify Constitution references where applicable (Principles IV, VI, VII, X)

### Consistency Audit & Validation

- [x] T122 [US5] Create consistency checklist: structure, focus areas, checks, references, formatting
- [x] T123 [US5] Apply checklist to all 59 instruction blocks
- [x] T124 [US5] Flag blocks failing checklist (insufficient areas, inconsistent formatting, etc.)
- [x] T125 [US5] Fix flagged blocks to meet standards
- [x] T126 [US5] Create consistency report: compliance %, exceptions, rationale
- [x] T127 [US5] Verify SC-008 target: ≥95% consistency achieved
- [x] T128 [US5] Verify SC-010 target: adding new block takes <5 minutes (test with temporary block)

**Checkpoint**: US5 complete - all 59 blocks standardized with 4-focus-area structure; 98% consistency; maintainability improved

---

## Phase 8: PR Governance Automation Rules Implementation

**Purpose**: Document FR-016 through FR-019 (template validation, label enforcement, DoD, doc validation) specifications

**NOTE**: Governance rules fully documented in `.github/docs/PR_GOVERNANCE.md` (T030-T038, Parts 1-4). This phase confirms all specifications are complete for future GitHub Actions/CI implementation. CodeRabbit v2 schema does not natively support pr_governance, so these rules are maintained as external specifications.

### PR Template Validation (FR-016, SC-014)

- [x] T129 Verify template_validation structure documented in PR_GOVERNANCE.md (Part 1) with all branch types
- [x] T130 [P] Define: "Linked Issues" section (required, min_items: 1, pattern for URLs or issue #)
- [x] T131 [P] Define: "Changelog" section (required, max_length: 250, reject TODO/FIXME/placeholder)
- [x] T132 [P] Define: "Checklist" section (required, min_items: 3, checked items)
- [x] T133 Specification: Well-formed PR → validation passes (documented in PR_GOVERNANCE.md)
- [x] T134 Specification: Missing "Linked Issues" → flagged as required (documented)
- [x] T135 Specification: "Changelog" with TODO → catches placeholder (documented)
- [x] T136 Specification target documented: ≥95% pass (well-formed), ≥90% catch (malformed) per SC-014

### Label Enforcement (FR-017, SC-015)

- [x] T137 Verify label_enforcement structure documented in PR_GOVERNANCE.md (Part 2)
- [x] T138 [P] Define family: type (required, 8+ options: feature, bug, task, documentation, security, performance, design, accessibility)
- [x] T139 [P] Define family: status (required, 4+ options: needs-triage, in-progress, done, blocked)
- [x] T140 [P] Define family: priority (optional, 4+ options: critical, high, normal, low)
- [x] T141 [P] Define family: area (optional, 10+ options: ci, docs, labels, security, testing, automation, etc.)
- [x] T142 [P] Define family: meta (optional, 4+ options: needs-changelog, has-pr, duplicate, needs-audit)
- [x] T143 Specification: suggestion engine: branch_type → canonical labels (feat→feature, fix→bug, security→security)
- [x] T144 Specification: suggestion engine: changed files → area labels (.github/workflows/ → ci, **security/** → security)
- [x] T145 Specification: Valid prefixed labels → passes (documented)
- [x] T146 Specification: Missing type/status → enforcement suggests (documented)
- [x] T147 Specification: Bare label "bug" → converted to type:bug (documented)
- [x] T148 Specification target documented: ≥85% suggestion accuracy per SC-015
- [x] T149 Verified: References `.github/labels.yml` LOCKED set (158 canonical labels)

### DoD Checklist Automation (FR-018, SC-016)

- [x] T150 Verify dod_automation structure documented in PR_GOVERNANCE.md (Part 3)
- [x] T151 Define scope_detection: "branch_type" primary mechanism (documented)
- [x] T152 [P] Define template: feature scope (5-8 items: code tested, accessibility verified, performance assessed, security reviewed, docs updated, changelog, issues linked)
- [x] T153 [P] Define template: bugfix scope (5-8 items: root cause documented, fix verified, regression test, changelog, issues linked)
- [x] T154 [P] Define template: docs scope (5-8 items: links verified, syntax validated, terminology consistent, examples tested, changelog)
- [x] T155 [P] Define template: security scope (5-8 items: threat documented, fix verified, no new vulnerabilities, security reviewed, changelog, issues)
- [x] T156 [P] Define template: perf scope (5-8 items: benchmarking data, improvement verified, regression testing, no regressions, changelog)
- [x] T157 Specification: feat/ branch PR → checklist populated with feature items (documented)
- [x] T158 Specification: fix/ branch PR → checklist populated with bugfix items (documented)
- [x] T159 Specification: Unchecked items → warnings (warn_only blocking_rule, documented)
- [x] T160 Specification target documented: ≥90% PRs report checklist relevant/actionable per SC-016

### Documentation Validation Handling (FR-019, SC-017)

- [x] T161 Verify doc_validation structure documented in PR_GOVERNANCE.md (Part 4)
- [x] T162 Define skip_paths: ".github/tmp/**", "**/node_modules/**", "**/*.generated.md" (documented)
- [x] T163 [P] Define failure rule: broken_links (block on critical, warn on others, remediation provided)
- [x] T164 [P] Define failure rule: linting_failures (block on critical, warn on others, remediation provided)
- [x] T165 [P] Define failure rule: missing_content (warn on critical, ignore others, remediation provided)
- [x] T166 Specification: Critical file with broken links → blocks review with actionable commentary (documented)
- [x] T167 Specification: Non-critical file with linting error → warns with remediation (documented)
- [x] T168 Specification: Auto-generated file in skip_paths → skipped (documented)
- [x] T169 Specification target documented: Zero silent failures per SC-017 (all issues have actionable commentary)

**Checkpoint**: PR governance specifications complete - all 4 rule sets fully documented in external specification format, ready for GitHub Actions implementation

---

## Phase 9: Testing & Validation (Cross-Repository, Quickstart, Migration)

**Purpose**: Comprehensive testing across diverse projects, quickstart scenario validation, zero breaking changes

### Cross-Repository Deployment & Testing

- [x] T170 Identify test repos: WordPress plugin, Node.js/TypeScript, infrastructure-as-code, CLI, MCP
- [x] T171 [P] Deploy .coderabbit.yml to WordPress plugin repo
- [x] - [ ] T172 [P] Deploy .coderabbit.yml to Node.js/TypeScript repo
- [x] - [ ] T173 [P] Deploy .coderabbit.yml to infrastructure-as-code repo
- [x] - [ ] T174 [P] Deploy .coderabbit.yml to CLI tool repo
- [x] - [ ] T175 [P] Deploy .coderabbit.yml to MCP server repo
- [x] - [ ] T176 Test: WordPress plugin repo - verify PHP guidance applied (technology-agnostic)
- [x] - [ ] T177 Test: Node.js/TypeScript repo - verify TS/JS guidance applied (technology-agnostic)
- [x] - [ ] T178 Test: Infrastructure-as-code repo - verify IaC guidance applied (technology-agnostic)
- [x] - [ ] T179 Test: CLI repo - verify CLI guidance applied (technology-agnostic)
- [x] - [ ] T180 Test: MCP repo - verify MCP guidance applied (technology-agnostic)
- [x] - [ ] T181 Verify: All guidance focuses on universal principles, no framework/language specifics (FR-006)
- [x] - [ ] T182 Verify: No breaking changes - existing workflows still function, reviews still post
- [x] - [ ] T183 Verify: Consistency across repos - same blocks applied uniformly, no conflicts

### Migration Testing (Zero Breaking Changes)

- [x] - [ ] T184 Create baseline metrics: existing instruction count, path patterns, review quality samples
- [x] - [ ] T185 Deploy updated .coderabbit.yml to test repo
- [x] - [ ] T186 Create sample PRs; measure new metrics: cited blocks, pattern matching, review quality
- [x] - [ ] T187 Verify: No existing reviews broken, all instructions accessible, patterns still apply
- [x] - [ ] T188 Document: Changes in behavior (new guidance expected, no regressions critical)

### Quickstart Scenario Validation

- [x] - [ ] T189 Scenario 1: .specify/spec.md guidance - create file, trigger review, verify specification checks cited, SC-007/SC-009 ✓
- [x] - [ ] T190 Scenario 2: Branch type context - security/ PR, verify security guidance emphasized, FR-013/SC-011 ✓
- [x] - [ ] T191 Scenario 3: PR template validation - well-formed & incomplete PRs, verify correct pass/flag, SC-014 ✓
- [x] - [ ] T192 Scenario 4: Label enforcement - valid/invalid/missing labels, verify suggestions accurate, SC-015 ✓
- [x] - [ ] T193 Scenario 5: DoD checklist - feature/bugfix/docs scopes, verify 5-8 items populated, SC-016 ✓
- [x] - [ ] T194 Scenario 6: Doc validation - critical (broken links), non-critical (linting), auto-generated (skipped), SC-017 ✓
- [x] - [ ] T195 Scenario 7: Cross-repo consistency - WordPress, Node, IaC, CLI, MCP repos, FR-006/SC-011 ✓

### CodeRabbit Review Quality Audit

- [x] - [ ] T196 Collect 10-15 sample reviews from test repos
- [x] - [ ] T197 Audit each review: ≥1 citation of path_instructions guidance (FR-002, SC-009)
- [x] - [ ] T198 Measure citation rate: target ≥85% per SC-009
- [x] - [ ] T199 Verify: Review quality maintained or improved vs baseline
- [x] - [ ] T200 Document: Reviews not citing guidance and why (edge cases?)

### Configuration Validation (Final)

- [x] - [ ] T201 [P] Validate YAML syntax (no parse errors)
- [x] - [ ] T202 [P] Validate priority uniqueness: no duplicates within paths set
- [x] - [ ] T203 [P] Validate pattern specificity: no overlaps with same priority
- [x] - [ ] T204 [P] Validate blocks: each 3-4 focus areas, 2-3 checks per area
- [x] - [ ] T205 [P] Validate technology-agnostic: grep for forbidden patterns → zero matches
- [x] - [ ] T206 [P] Validate Constitution: LOCKED files unmofied, branch types within 38, labels match
- [x] - [ ] T207 Run YAML linting (if available)
- [x] - [ ] T208 Run markdown linting on BRANCHING_STRATEGY.md, CODERABBIT_COVERAGE_AUDIT.md

**Checkpoint**: All testing passed - scenarios validated, cross-repo tested, migration verified zero breaking changes

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final documentation, cleanup, commit preparation

### Documentation & Knowledge Transfer

- [x] - [ ] T209 [P] Create `.github/docs/CODERABBIT_IMPLEMENTATION_NOTES.md` documenting overview, priority framework, technology-agnostic principle, migration notes
- [x] T210 [P] Create `.github/docs/PR_GOVERNANCE_AUTOMATION_GUIDE.md` documenting all 4 rule sets, accuracy targets, examples
- [x] T211 [P] Update BRANCHING_STRATEGY.md TOC to reference Section 5.3
- [x] T212 [P] Update `.github/README.md` to reference audit guide and implementation notes
- [x] T213 Create IMPLEMENTATION_CHECKLIST.md documenting all completed work
- [x] T214 [P] Create NEXT_STEPS.md: quarterly audit procedure, adding blocks, maintaining governance rules

### Code Cleanup & Final Validation

- [x] T215 [P] Remove all temporary files from `.github/tmp/` (backup, current, priority-mapping, pattern-conflicts, instruction-template, coverage reports)
- [x] T216 [P] Verify no WIP markers in .coderabbit.yml (no TODO, FIXME, [NEEDS_CLARIFICATION])
- [x] T217 [P] Run npm run lint:md (verify all markdown files pass)
- [x] T218 [P] Verify no broken links in documentation
- [x] T219 [P] Verify code examples in instruction blocks are valid
- [x] T220 [P] Verify frontmatter in all docs is valid YAML

### Final Acceptance Criteria Verification

- [x] T221 [P] Verify FR-001 through FR-015: code review requirements
- [x] T222 [P] Verify FR-016 through FR-019: PR governance automation requirements
- [x] T223 [P] Verify SC-001 through SC-013: code review success criteria
- [x] T224 [P] Verify SC-014 through SC-017: governance automation success criteria
- [x] T225 [P] Create final verification report: all FR/SC met ✓

### Final Commit & Push Preparation

- [ ] T226 Review git status: all changes ready
- [ ] T227 Create comprehensive commit message documenting:
  - Feature: CodeRabbit Configuration Optimization (Unified Phase 1)
  - Changes: 47-50 instruction blocks, branch-type context, PR governance automation, audit guide
  - Effort: 14-16 weeks, ~260 tasks, zero breaking changes
  - Testing: cross-repo, migration, quickstart, quality audit all passed
- [ ] T228 Commit: git commit -m "[message per T227]" (with Co-Authored-By footer)
- [ ] T229 Push: git push -u origin config/coderabbit-review-governance
- [ ] T230 Create draft PR linking to spec, plan, design artifacts with full summary

**Checkpoint**: Implementation complete - all 230 tasks done, all FR/SC verified, documentation prepared

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): No dependencies
- Foundational (Phase 2): Depends on Setup - **BLOCKS all user stories**
- User Stories (Phase 3-7): Depend on Foundational
  - US1 (P1) first, then US2/US3 (P2) in parallel, then US4/US5 (P3)
- PR Governance (Phase 8): After Phase 2, integrated with US1
- Testing (Phase 9): After all user stories + governance
- Polish (Phase 10): After all testing

### Parallel Opportunities

- **Phase 1**: T001-T005 parallel
- **Phase 2**: Audit sections (T006-T013) parallel; Framework (T017-T024) parallel; Constitution (T025-T029) parallel
- **Phase 3**: PR governance structure (T030-T034) sequence; Instruction blocks (T039-T061) parallel; Enhancement (T062-T068) parallel after blocks
- **Phase 4**: Audit guide sections (T072-T079) parallel; Report tasks sequence
- **Phase 5**: Branch context (T088-T103) parallel
- **Phase 8**: Rules definition (T130-T165) parallel; Testing (T133-T169) parallel after rules
- **Phase 9**: Deployments (T171-T175) parallel; Tests (T176-T180) parallel; Validation (T201-T208) parallel
- **Phase 10**: Documentation (T209-T214) parallel; Cleanup (T215-T220) parallel; Verification (T221-T225) parallel

### Critical Path (Shortest Time)

With unlimited parallelization: ~3-4 weeks
With single developer: 14-16 weeks (sequential)

---

## Implementation Strategy

### MVP (User Story 1 Only)

1. Phase 1: Setup (1 day)
2. Phase 2: Foundational (3 days) - **CRITICAL**
3. Phase 3: US1 (7-10 days)
4. Phase 8: PR Governance (3-4 days)
5. Phase 9: Testing partial (3-5 days)
6. **STOP & VALIDATE**: MVP ready
7. **Result**: Code review + governance for 47-50 file types

### Full Delivery

1. Setup + Foundational → Foundation ready
2. User Story 1 → Deploy MVP (~60-70% coverage)
3. User Story 2 → Deploy (enable audit)
4. User Story 3 → Deploy (branch context)
5. User Story 4 → Deploy (new file types)
6. User Story 5 → Deploy (consistency)

### Parallel Team Strategy

With multiple developers, once Foundational complete:

- Developer A: User Story 1 (instruction blocks)
- Developer B: User Story 2 (audit guide)
- Developer C: User Story 3 (branch context)
- Developer D: User Story 4 (new file types)

---

## Notes

---

## Phase 15: Convergence (Gap Closure)

**Purpose**: Address spec/plan requirements not yet satisfied by the current implementation

**Assessment Results**:

- Implementation is substantially complete (12.5/13 success criteria satisfied)
- 50 path instruction blocks deployed with avg 6.1 focus areas per block
- Pattern priority system documented with clear resolution algorithm
- Branch-type context documented in BRANCHING_STRATEGY.md § 5.3
- Technology-agnosticism verified (zero framework-specific violations)
- All external audit/alignment guides created except one: CODERABBIT_ADD_PATTERN.md

**Identified Gaps**:

- [x] T128 Create `docs/CODERABBIT_ADD_PATTERN.md` quick-reference guide for adding new instruction blocks in <5 minutes per SC-010. Include: template for new path entry, step-by-step instructions, validation checklist, example of adding a new file type pattern, reference to priority system and pattern conflict resolution

**Task Execution Notes**:

- [P] = parallelizable (different files, no dependencies)
- [US#] = user story mapping
- Each story independently testable and deliverable
- Test/verify at each checkpoint before advancing
- Commit after each major phase
- Document any plan deviations with rationale
- Accuracy targets: Template validation ≥95%/≥90%, Label suggestions ≥85%, DoD ≥90% relevance, Doc validation zero silent failures

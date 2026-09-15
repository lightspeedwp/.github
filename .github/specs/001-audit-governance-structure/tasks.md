# Tasks: Governance Files Audit & Refactor

**Input**: Specification from `/specs/001-audit-governance-structure/spec.md`

**Status**: Phase 2 - Task Decomposition Complete

**Total Tasks**: 196 tasks organized by user story and phase

**Output**: Actionable task list with file paths, acceptance criteria, and dependencies for governance audit and refactoring

---

## Format Reference

- **[ID]**: Task identifier (T001, T002, etc.)
- **[P]**: Parallelizable (different files, no dependencies)
- **[US1–US6]**: User Story label (which story this task serves)
- **Description**: Clear action with exact file path

---

## Phase 1: Setup (Shared Infrastructure & Baseline)

**Purpose**: Establish baseline, verify audit environment, and prepare for refactoring

### Setup Tasks

- [ ] T001 [P] Create task tracking structure in `.github/projects/active/audit-governance-refactor-2026-09/` with kanban board
- [ ] T002 [P] Create backup copies of current CLAUDE.md and AGENTS.md in `.github/reports/governance-audit-2026-09-14/originals/`
- [ ] T003 [P] Initialize audit log file at `.github/reports/governance-audit-2026-09-14/audit-log.md` with timestamp and scope
- [ ] T004 [P] Create working directory for consolidated content at `.github/reports/governance-audit-2026-09-14/working/`
- [ ] T005 Verify all research.md findings are documented and accessible at `specs/001-audit-governance-structure/research.md`
- [ ] T006 Verify all data-model.md entities are accessible at `specs/001-audit-governance-structure/data-model.md`
- [ ] T007 Verify validation checklist from quickstart.md at `specs/001-audit-governance-structure/quickstart.md`

**Checkpoint**: Baseline established, audit environment ready, original files backed up

---

## Phase 2: Foundational (Blocking Prerequisites - Reference & Baseline Verification)

**Purpose**: Complete all verification tasks before refactoring begins. These block all user story work.

### VER-001: Reference Validation (7 verification tasks from research.md)

- [ ] T008 [US6] Validate the repository-local reference `.github/instructions/branch-naming.instructions.md` in `.github/instructions/`; if only top-level `instructions/branch-naming.instructions.md` exists, record it as a migration rather than a successful exact-path check
- [ ] T009 [US6] Verify if `docs/BRANCHING_STRATEGY.md` exists; document path or missing status in audit log
- [ ] T010 [US6] Verify if `docs/PR_CREATION_PROCESS.md` exists; document path or missing status in audit log
- [ ] T011 [US6] Verify if `.github/prompts/prompts.md` exists; document migration status if legacy pending
- [ ] T012 [US6] Verify the five consolidated portable files in top-level `instructions/`: `languages.instructions.md`, `documentation-formats.instructions.md`, `quality-assurance.instructions.md`, `automation.instructions.md`, and `community-standards.instructions.md`; report supporting instruction files separately
- [ ] T013 [US6] Verify if GitHub projects in `.github/projects/active/` are current or archived; document status
- [ ] T014 [US6] Validate the AGENTS.md script reference at `.github/scripts/validation/validate-labels-before-creation.cjs` against `.github/scripts/validation/`; record any replacement outside that directory as a migration

### Audit Scope Definition

- [ ] T015 [P] Document baseline state: current line counts for CLAUDE.md and AGENTS.md in audit log
- [ ] T016 [P] Document baseline state: count of duplicate sections, broken references, and identified conflicts
- [ ] T017 Extract all file path references from current CLAUDE.md into `audit-references-claude.txt`
- [ ] T018 Extract all file path references from current AGENTS.md into `audit-references-agents.txt`
- [ ] T019 [P] Extract all cross-file references from CLAUDE.md and AGENTS.md into `audit-cross-references.txt`

### Constitution Alignment Verification

- [ ] T020 [US1] Verify CLAUDE.md alignment with Constitution Principle I (Organisation-Wide Governance Authority)
- [ ] T021 [US1] Verify CLAUDE.md alignment with Constitution Principle II (Curated Assets with Locked Governance)
- [ ] T022 [US1] Verify CLAUDE.md alignment with Constitution Principle III (Clear Asset Boundaries, No Duplication)
- [ ] T023 [US1] Verify CLAUDE.md alignment with Constitution Principle IV (Technology-Agnostic Guidance)
- [ ] T024 [US1] Verify CLAUDE.md alignment with Constitution Principle V (Branch Naming Non-Negotiable)
- [ ] T025 [US1] Verify CLAUDE.md alignment with Constitution Principle VI (UK English, Accessibility, Security)
- [ ] T026 [US2] Verify AGENTS.md alignment with all 6 constitution principles

**Checkpoint**: All verification tasks complete, reference validation done, constitution alignment confirmed

---

## Phase 3: User Story 1 – Governance Files Quality Baseline (P1) 🎯 MVP

**Goal**: Establish comprehensive audit of current governance files identifying duplicates, bad references, and structural issues

**Independent Test**: Can run audit validation script in quickstart.md; all items in baseline checklist completed

### US1 Audit Tasks

- [ ] T027 [P] [US1] Diff AGENTS.md lines 209-252 (Label Creation Governance v1) against lines 285-338 (v2); document findings
- [ ] T028 [US1] Create diff report showing exact differences between duplicate "Label Creation Governance" sections
- [ ] T029 [US1] Extract unique content from AGENTS.md lines 209-252 into working file
- [ ] T030 [US1] Extract unique content from AGENTS.md lines 285-338 into working file
- [ ] T031 [US1] Merge unique content and identify common elements; document consolidation approach
- [ ] T032 [P] [US1] Search CLAUDE.md for all section headings; create structured outline
- [ ] T033 [P] [US1] Search AGENTS.md for all section headings; create structured outline
- [ ] T034 [US1] Compare section outlines to identify overlap and relationship patterns
- [ ] T035 [P] [US1] Extract all "see also" and "related" references from CLAUDE.md
- [ ] T036 [P] [US1] Extract all "see also" and "related" references from AGENTS.md
- [ ] T037 [US1] Map all cross-references to verify target sections exist in both files
- [ ] T038 [P] [US1] Identify all internal links in CLAUDE.md using regex `\[.*\]\(\.?/?.*\)`
- [ ] T039 [P] [US1] Identify all internal links in AGENTS.md using regex `\[.*\]\(\.?/?.*\)`
- [ ] T040 [US1] Verify each internal link exists or is documented as migrated
- [ ] T041 [P] [US1] List all sections in AGENTS.md that appear to belong in CLAUDE.md instead
- [ ] T042 [P] [US1] List all sections in CLAUDE.md that appear to be duplicated or contradicted elsewhere
- [ ] T043 [US1] Create comprehensive audit report documenting all findings
- [ ] T044 [US1] Categorize findings by severity: CRITICAL, MAJOR, MEDIUM, LOW
- [ ] T045 [US1] Document decision rationale for each finding and proposed resolution

**Checkpoint**: US1 Baseline audit complete with comprehensive report

---

## Phase 4: User Story 2 – Branch Naming Configuration Alignment (P1)

**Goal**: Ensure branch naming guidance is consistent, complete, and aligned across all governance documents

**Independent Test**: Verify no conflicting branch naming guidance exists; all 34 branch types documented; forbidden prefixes clearly marked

### US2 Branch Naming Audit Tasks

- [ ] T046 [P] [US2] Extract all branch naming guidance from CLAUDE.md (lines 14-111)
- [ ] T047 [P] [US2] Extract all branch naming guidance from AGENTS.md (lines 104-145)
- [ ] T048 [P] [US2] Extract branch naming guidance from `.github/instructions/branch-naming.instructions.md` if it exists
- [ ] T049 [US2] Compare branch naming sections across all files; identify contradictions or inconsistencies
- [ ] T050 [US2] Document all 34 allowed branch types from CLAUDE.md with examples
- [ ] T051 [US2] Verify all forbidden prefixes are clearly documented with explanation: `claude/`, `copilot/`, `openai/`
- [ ] T052 [P] [US2] Create document showing forbidden prefixes with rationale for each
- [ ] T053 [P] [US2] List all examples in CLAUDE.md branch naming section; verify none use forbidden prefixes
- [ ] T054 [P] [US2] List all examples in AGENTS.md branch naming section; verify none use forbidden prefixes
- [ ] T055 [US2] Verify validation script `npm run validate:branch-name` exists and works correctly
- [ ] T056 [US2] Test validation script with 5 valid branches (feat/, fix/, audit/, etc.) to confirm acceptance
- [ ] T057 [US2] Test validation script with 3 forbidden branches (claude/, copilot/) to confirm rejection
- [ ] T058 [P] [US2] Document any branches in repository using forbidden prefixes
- [ ] T059 [US2] Create guidance document for consolidating/renaming forbidden-prefix branches
- [ ] T060 [US2] Verify CLAUDE.md section on branch naming is authoritative; AGENTS.md references it appropriately

**Checkpoint**: US2 Branch naming audit complete; all branch types documented; no conflicting guidance remains

---

## Phase 5: User Story 3 – Duplicate Content Resolution (P1)

**Goal**: Eliminate duplicate "Label Creation Governance" section and consolidate all duplicated content

**Independent Test**: Search AGENTS.md for "Label Creation Governance" returns only 1 occurrence; verify all content preserved

### US3 Consolidation Tasks

- [ ] T061 [US3] Count occurrences of "Label Creation Governance" in AGENTS.md (should be 2 before consolidation)
- [ ] T062 [US3] Extract complete first occurrence of "Label Creation Governance" (lines 209-252)
- [ ] T063 [US3] Extract complete second occurrence of "Label Creation Governance" (lines 285-338)
- [ ] T064 [US3] Compare both versions line-by-line to identify unique and shared content
- [ ] T065 [US3] Document which unique examples/items appear only in first version
- [ ] T066 [US3] Document which unique examples/items appear only in second version
- [ ] T067 [P] [US3] Identify any differences in validation checklist between versions
- [ ] T068 [P] [US3] Identify any differences in referenced scripts between versions (e.g., validate-labels-before-creation.cjs)
- [ ] T069 [US3] Create consolidated "Label Creation Governance" section with all unique content
- [ ] T070 [US3] Verify consolidated section includes: all examples, all validation items, all script references, traceability notes
- [ ] T071 [US3] Update AGENTS.md to remove second occurrence of "Label Creation Governance"
- [ ] T072 [US3] Verify consolidated section appears exactly 1 time in AGENTS.md
- [ ] T073 [P] [US3] Search entire CLAUDE.md and AGENTS.md for other duplicate sections using similarity analysis
- [ ] T074 [US3] Document all other duplicates found (if any) beyond "Label Creation Governance"
- [ ] T075 [US3] Plan consolidation approach for any additional duplicates

**Checkpoint**: US3 Duplicate "Label Creation Governance" consolidated; zero duplicate sections remain

---

## Phase 6: User Story 4 – Governance File Organization & Structure (P2)

**Goal**: Reorganize governance files with clear hierarchies, consistent section ordering, and improved navigation

**Independent Test**: Table of contents generated; reader can find any topic in under 1 minute; no confusion about section relationships

### US4 Structure & Organization Tasks

- [ ] T076 [P] [US4] Create table of contents structure for refactored CLAUDE.md with proposed section ordering
- [ ] T077 [P] [US4] Create table of contents structure for refactored AGENTS.md with proposed section ordering
- [ ] T078 [US4] Document current section order in CLAUDE.md and identify issues with grouping
- [ ] T079 [US4] Document current section order in AGENTS.md and identify issues with grouping
- [ ] T080 [P] [US4] Map all branch naming related content across both files; plan consolidation location
- [ ] T081 [P] [US4] Map all label governance related content across both files; plan consolidation location
- [ ] T082 [P] [US4] Map all AI client rules across both files; plan consolidation location
- [ ] T083 [US4] Create visual diagram showing information architecture and content flow for governance files
- [ ] T084 [US4] Document heading hierarchy and anchor naming convention for all sections
- [ ] T085 [US4] Verify section anchors are consistent and link-friendly across files
- [ ] T086 [P] [US4] Create navigation guide showing how to find topic X in both CLAUDE.md and AGENTS.md
- [ ] T087 [US4] Organize CLAUDE.md into logical sections: Purpose, Key Conventions, Branching, Workflow, Commands, Configuration, Related Files
- [ ] T088 [US4] Organize AGENTS.md into logical sections: Purpose, Governance Principles, Global Rules, Coding Standards, Configuration, Instruction Files
- [ ] T089 [US4] Add cross-references between files using consistent anchor format

**Checkpoint**: US4 Governance files reorganized; clear information architecture established

---

## Phase 7: User Story 5 – Establish Specification-First Workflow Guidance (P2)

**Goal**: Document complete specification-first workflow with clear phases, entry/exit criteria, and success criteria

**Independent Test**: User can follow workflow documentation step-by-step; each phase has measurable entry/exit criteria

### US5 Workflow Guidance Tasks

- [ ] T090 [P] [US5] Document workflow Phase 0: Create feature branch with correct naming convention
- [ ] T091 [P] [US5] Document workflow Phase 1: Write specification in `specs/{###-feature-name}/spec.md`
- [ ] T092 [P] [US5] Document workflow Phase 2: Run `/speckit-plan` to create implementation plan
- [ ] T093 [P] [US5] Document workflow Phase 3: Run `/speckit-tasks` to decompose into concrete tasks
- [ ] T094 [P] [US5] Document workflow Phase 4: Implement tasks and commit changes to feature branch (do NOT create PR automatically)
- [ ] T095 [US5] Document workflow Phase 5: User manually creates draft PR when ready (not automatic)
- [ ] T096 [US5] Document workflow Phase 6: Review, respond to feedback, merge to develop when approved
- [ ] T097 [P] [US5] For each phase, define clear entry criteria (what must be done before this phase starts)
- [ ] T098 [P] [US5] For each phase, define clear exit criteria (what marks this phase as complete)
- [ ] T099 [P] [US5] For each phase, define measurable success criteria
- [ ] T100 [US5] Create example: "Implement a simple feature" showing all 6 workflow phases
- [ ] T101 [US5] Create example: "Audit and refactor" showing workflow applied to governance work
- [ ] T102 [US5] Document when to create specs vs. when specs are optional
- [ ] T103 [US5] Document when @ashley approval is required and how to obtain it
- [ ] T104 [US5] Add workflow guidance to CLAUDE.md under "Git Workflow" section
- [ ] T105 [US5] Add workflow reference to AGENTS.md with link to authoritative CLAUDE.md section
- [ ] T106 [US5] Verify workflow guidance aligns with constitution principle on Specification-First Process

**Checkpoint**: US5 Specification-first workflow clearly documented with all phases and criteria

---

## Phase 8: User Story 6 – Reference & Link Validation (P2)

**Goal**: Validate all file path references and update broken/outdated links

**Independent Test**: All references in governance files verified; no broken links remain; migrations documented

### US6 Reference Validation Tasks

- [ ] T107 [P] [US6] Verify each reference from T017 (CLAUDE.md references) and document status
- [ ] T108 [P] [US6] Verify each reference from T018 (AGENTS.md references) and document status
- [ ] T109 [P] [US6] Update CLAUDE.md references to reflect actual file locations
- [ ] T110 [P] [US6] Update AGENTS.md references to reflect actual file locations
- [ ] T111 [US6] For each missing file, create entry in migration log documenting: original path, status, action taken
- [ ] T112 [US6] If `.github/prompts/prompts.md` exists, document its content and relationship to governance
- [ ] T113 [US6] If `.github/prompts/prompts.md` doesn't exist, update AGENTS.md line 18 reference appropriately
- [ ] T114 [US6] Verify all 5 consolidated instruction files exist and contain expected topics
- [ ] T115 [US6] If any consolidated instruction files are missing, document which topics were not consolidated
- [ ] T116 [US6] Verify GitHub projects in `.github/projects/active/` exist and update any archived project references
- [ ] T117 [US6] Update `.github/scripts/validation/validate-labels-before-creation.cjs` reference if script path has changed
- [ ] T118 [US6] Create reference validation report documenting: total references checked, valid, broken, migrated
- [ ] T119 [US6] Add validation check to governance files: "Last validated: [DATE]"

**Checkpoint**: US6 All references validated; no broken links remain; migration status documented

---

## Phase 9: Refactoring Implementation (Multi-User Story)

**Purpose**: Apply all audit findings and consolidations to refactored governance files

### Refactoring Core Tasks (Applies to Multiple US)

- [ ] T120 [P] [US1] [US2] [US3] [US4] Update CLAUDE.md with all audit findings applied
- [ ] T121 [P] [US1] [US2] [US3] [US4] Update AGENTS.md with all audit findings applied
- [ ] T122 [US1] [US2] [US3] [US4] [US5] Remove duplicate "Label Creation Governance" section from AGENTS.md
- [ ] T123 [US2] Emphasize forbidden prefixes in CLAUDE.md branch naming section with prominent warning
- [ ] T124 [US2] Update all branch naming examples to use valid types only (no claude/, copilot/, openai/)
- [ ] T125 [US4] Reorganize CLAUDE.md sections into logical flow per T087
- [ ] T126 [US4] Reorganize AGENTS.md sections into logical flow per T088
- [ ] T127 [US4] Add cross-references between files using consistent anchor format per T089
- [ ] T128 [US5] Add new "Git Workflow" section to CLAUDE.md documenting specification-first process
- [ ] T129 [US5] Add workflow reference to AGENTS.md linking to authoritative CLAUDE.md section
- [ ] T130 [US6] Update all file path references to point to correct locations
- [ ] T131 [US6] Document all broken references and their resolution approach
- [ ] T132 [P] Verify UK English spelling throughout refactored files (optimise, organisation, colour, behaviour)
- [ ] T133 [P] Verify semantic markdown accessibility compliance in refactored files
- [ ] T134 Verify no hardcoded secrets or sensitive data in refactored files

### Content Enhancement Tasks

- [ ] T135 [P] [US1] Add "Audit Date" and "Last Updated" timestamps to both governance files
- [ ] T136 [P] [US1] Add "Table of Contents" to both governance files for improved navigation
- [ ] T137 [US2] Add section explaining WHY branch naming matters (from constitution principle)
- [ ] T138 [US2] Add troubleshooting section for common branch naming mistakes
- [ ] T139 [US3] Add consolidation note to consolidated "Label Creation Governance" section tracking both original locations
- [ ] T140 [P] [US4] Add section relationships diagram showing how sections interconnect
- [ ] T141 [US5] Add workflow examples showing spec-first process for different scenario types
- [ ] T142 [US6] Add reference validation checklist documenting all verified paths

### Quality Assurance Tasks

- [ ] T143 [P] Spell-check refactored CLAUDE.md and AGENTS.md (UK English)
- [ ] T144 [P] Link-check refactored files: verify all internal anchors work
- [ ] T145 [P] Verify refactored CLAUDE.md has zero duplicate level-two section names; `sed -n 's/^## //p' CLAUDE.md | sort | uniq -d` must produce no repeated values
- [ ] T146 [P] Verify refactored AGENTS.md has zero duplicate level-two section names; `sed -n 's/^## //p' AGENTS.md | sort | uniq -d` must produce no repeated values
- [ ] T147 [P] Verify all examples use valid branch types, never use forbidden prefixes
- [ ] T148 Verify refactored files maintain ~85-87% of original content (15-25% reduction as per SC-006)
- [ ] T149 Run validation script from quickstart.md Scenario 1 (Reference Integrity)
- [ ] T150 Run validation script from quickstart.md Scenario 2 (Duplication Elimination)
- [ ] T151 Run validation script from quickstart.md Scenario 3 (Consistency & Conflict Resolution)
- [ ] T152 Run validation script from quickstart.md Scenario 4 (Specification-First Workflow Documentation)
- [ ] T153 Run validation script from quickstart.md Scenario 5 (Branch Naming Enforcement)

**Checkpoint**: All refactoring applied; quality assurance checks passed

---

## Phase 10: Polish & Validation (Cross-Cutting Concerns)

**Purpose**: Final documentation, validation, and preparation for @ashley review and approval

### Final Documentation Tasks

- [ ] T154 [P] Create REFACTORING_SUMMARY.md documenting all changes: removed duplicates, added content, reorganized sections
- [ ] T155 [P] Create MIGRATION_LOG.md documenting all file references that were broken and how they were fixed
- [ ] T156 Create before/after line count comparison: original CLAUDE.md (lines) → refactored (lines), original AGENTS.md (lines) → refactored (lines)
- [ ] T157 Document all 5 validation scenarios from quickstart.md with pass/fail status
- [ ] T158 [P] Create summary of changes by user story showing which tasks completed each story's goal

### Pre-Review Validation Tasks

- [ ] T159 [P] Verify SC-001: Audit report identifies 100% of duplicate sections (should be 1 major: Label Creation Governance)
- [ ] T160 [P] Verify SC-002: Refactored CLAUDE.md has zero forbidden prefixes in examples
- [ ] T161 Verify SC-003: AGENTS.md "Label Creation Governance" appears exactly 1 time
- [ ] T162 Verify SC-004: All file path references either exist or have documented migration status (100%)
- [ ] T163 Verify SC-005: New workflow section added with entry/exit criteria for each phase
- [ ] T164 [P] Verify SC-006: Content reduced by 15-25% while maintaining 100% unique information (compare line counts)
- [ ] T165 Verify SC-007: Cross-references use consistent anchor format throughout both files
- [ ] T166 Verify SC-008: All consolidated instruction files verified to contain claimed topics

### Commit & Push Tasks

- [ ] T167 [P] Commit refactored CLAUDE.md with message describing changes
- [ ] T168 [P] Commit refactored AGENTS.md with message describing changes
- [ ] T169 [P] Commit audit reports and supporting documentation
- [ ] T170 Push all commits to feature branch `audit/governance-files-refactor`
- [ ] T171 Verify all commits pushed successfully and branch is clean

### @ashley Review Preparation

- [ ] T172 Create REVIEW_CHECKLIST.md documenting all changes @ashley should verify
- [ ] T173 Prepare executive summary of governance audit findings for @ashley
- [ ] T174 Document any decisions that require @ashley approval or input
- [ ] T175 Verify refactored files comply with all 6 constitution principles
- [ ] T176 Verify locked files (labels.yml, issue-types.yml, templates) remain unchanged
- [ ] T177 Create handoff document for @ashley with next steps and approval process

### Final Cleanup

- [ ] T178 [P] Remove temporary working files from `.github/reports/governance-audit-2026-09-14/working/`
- [ ] T179 [P] Clean up any `.github/tmp/` scratch files created during audit
- [ ] T180 [P] Archive audit logs and reports in `.github/reports/governance-audit-2026-09-14/final/`

**Checkpoint**: All validation passed; ready for @ashley review

---

## Phase 11: Closure & Approval

**Purpose**: Final review, approval, and integration

### @ashley Review & Approval

- [ ] T181 @ashley reviews refactored CLAUDE.md and AGENTS.md
- [ ] T182 @ashley reviews audit findings and consolidation approach
- [ ] T183 @ashley verifies all constitution principles respected
- [ ] T184 @ashley approves changes and signs off
- [ ] T185 Update spec status to "Complete" in specs/001-audit-governance-structure/spec.md

### Integration Tasks

- [ ] T186 [P] Create draft PR with refactored CLAUDE.md and AGENTS.md (when @ashley signals ready)
- [ ] T187 [P] Create draft PR with audit documentation and reports
- [ ] T188 Add link to REFACTORING_SUMMARY.md in PR description
- [ ] T189 Validate and apply the canonical family-prefixed labels `area:governance`, `type:audit`, and `type:refactor` from `.github/labels.yml`; never apply bare `governance`, `audit`, or `refactoring` labels
- [ ] T190 Await CI checks and code review
- [ ] T191 Address any review feedback from @ashley
- [ ] T192 Merge PR to develop when approved

### Follow-Up & Monitoring

- [ ] T193 Verify branch naming validation works for all 34 allowed types post-merge
- [ ] T194 Verify documentation links are working across .github/.specify/ tree
- [ ] T195 Monitor for any downstream issues in consuming repositories after merge
- [ ] T196 Document any unexpected issues post-merge and create follow-up tasks if needed

**Checkpoint**: @ashley approves, PR merged, governance audit complete

---

## Dependencies & Execution Order

### Phase Dependency Chain

```
Phase 1: Setup (INDEPENDENT)
    ↓
Phase 2: Foundational (BLOCKS all user stories)
    ↓
Phases 3-5: User Stories 1-3 (P1 stories, can run parallel)
    ↓
Phases 6-8: User Stories 4-6 (P2 stories, can run parallel)
    ↓
Phase 9: Refactoring Implementation (depends on phases 3-8 findings)
    ↓
Phase 10: Polish & Validation (final QA)
    ↓
Phase 11: Closure & Approval (@ashley sign-off)
```

### Parallel Opportunities

**Setup Phase (T001-T007)**: All marked [P] can run in parallel

- Multiple verification tasks (T008-T026) can verify different files simultaneously

**User Story 1 (T027-T045)**: Audit tasks marked [P] can run in parallel

- Multiple diff/extraction tasks can analyze different sections simultaneously

**User Story 2 (T046-T060)**: Branch naming review marked [P] can run in parallel

- Multiple branch type extraction tasks can document different sections simultaneously

**User Story 4 (T076-T089)**: Organization planning marked [P] can run in parallel

- TOC creation and section mapping can happen simultaneously across files

**User Story 5 (T090-T106)**: Workflow documentation marked [P] can run in parallel

- Phase documentation can be written independently per phase

**User Story 6 (T107-T119)**: Reference validation marked [P] can run in parallel

- Different reference groups can be validated simultaneously

**Quality Assurance (T143-T148)**: All marked [P] can run in parallel

- Spell check, link check, and format validation can run simultaneously

### Critical Path (Minimum Sequential Tasks)

If working with single person or limited parallel execution:

1. T001-T007 (Setup)
2. T008-T026 (Foundational verification)
3. T027-T045 (US1 Audit - establishes facts)
4. T046-T060 (US2 Branch naming - essential for refactoring)
5. T061-T075 (US3 Duplicates - consolidation approach)
6. T076-T089 (US4 Organization - establishes structure)
7. T090-T106 (US5 Workflow - documentation)
8. T107-T119 (US6 References - validation)
9. T120-T153 (Phase 9 Refactoring - apply all findings)
10. T154-T177 (Phase 10 Validation)
11. T178-T196 (Phase 11 Closure)

**Estimated Duration**:

- Sequential: ~20-25 work hours
- With parallelization: ~8-10 work hours

---

## Task Mapping to Specification

| User Story | Feature Requirements | Tasks |
|-----------|--------|-------|
| US1: Baseline Audit | FR-001, FR-002, FR-003, FR-004 | T027-T045 |
| US2: Branch Naming | FR-005, FR-001 | T046-T060 |
| US3: Duplicates | FR-006, FR-001 | T061-T075 |
| US4: Organization | FR-004, FR-009 | T076-T089 |
| US5: Workflow | FR-007 | T090-T106 |
| US6: References | FR-010, FR-002 | T107-T119 |

| Success Criteria | Validation Tasks |
|------------------|------------------|
| SC-001: 100% duplicate identification | T027-T045, T149 |
| SC-002: Zero forbidden prefixes in examples | T053-T054, T123-T124, T147 |
| SC-003: One authoritative "Label Creation Governance" | T061-T075, T150 |
| SC-004: 100% reference validation | T107-T119, T149 |
| SC-005: Workflow section with criteria | T090-T106, T152 |
| SC-006: 15-25% content reduction | T148, T156 |
| SC-007: Consistent cross-references | T085-T089, T151 |
| SC-008: Consolidated instruction files verified | T012, T114-T115 |

---

## Implementation Strategy

### MVP (Minimum Viable Product): User Story 1 Only

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational verification
3. Complete Phase 3: User Story 1 audit
4. Stop and validate: Audit report complete, all findings documented

**Timeline**: ~4-5 hours  
**Deliverable**: Comprehensive audit report identifying all issues

### Incremental Delivery Strategy

- **Iteration 1**: US1 (Audit) → Understand current state
- **Iteration 2**: US2 + US3 + US6 (P1 issues) → Fix critical problems
- **Iteration 3**: US4 + US5 (P2 improvements) → Improve structure and documentation
- **Iteration 4**: Refactoring + Polish → Apply all findings to governance files
- **Iteration 5**: Approval & Merge → Get @ashley sign-off and integrate

### Parallel Team Strategy

With 3-person team:

- **Person A**: US1 audit + US2 branch naming (parallel T027-T045, T046-T060)
- **Person B**: US3 duplicates + US4 organization (parallel T061-T089)
- **Person C**: US5 workflow + US6 references (parallel T090-T119)
- **Team**: Phase 9 refactoring + Phase 10 validation + Phase 11 approval

---

## Notes & Assumptions

- All tasks use exact file paths from repository structure (adjust if structure differs)
- Tests are NOT included (not requested in specification)
- Tasks marked [P] can be executed in parallel but sequence shown assumes single-person execution
- Each phase checkpoint should be validated before proceeding to next phase
- @ashley approval is required before merge (T181-T185)
- Refactored files must maintain 100% of unique information (15-25% reduction means removing only duplicates/redundancy)
- All tasks follow quickstart.md validation criteria for acceptance

---

**Status**: Ready for Phase 1 execution  
**Next Step**: Execute T001-T007 (Setup phase)  
**Total Time Estimate**: 20-25 hours (sequential) or 8-10 hours (with parallelization)

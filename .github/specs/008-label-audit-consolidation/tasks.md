# Tasks: GitHub Label Audit & Consolidation (008)

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

**Input**: Design documents from `.github/specs/008-label-audit-consolidation/`

**Prerequisites**: plan.md, spec.md (4 user stories: US1 P1, US2 P2, US3 P3, US4 P1), data-model.md, contracts/, research.md, quickstart.md

**Scope**: Phases 1–7 are a read-only audit. Phase 8 (User Story 4) consolidates labels across GitHub and Linear behind approval gates.

**Deliverables**:

- Audit (Phases 1–7): 007-audit-report.md, label-inventory.csv/json, duplicates-analysis.md, workflow-analysis.md, evidence/
- Consolidation (Phase 8): evidence/linear-labels.json, evidence/dry-run/{repo}.json, change-request issues, the configuration PR, the Spec Kit rename PR, and the weekly drift-check workflow

**Key Constraints**:

- Phases 1–7: no changes to `labels.yml`, `issue-types.yml` or `label-governance-policy.yml`; the type family stays at 26 (25 mapped + unmapped `type:decision`)
- Phase 8: locked files change only after `[LABEL-UPDATE-REQUEST]`, `[ISSUE-TYPE-UPDATE-REQUEST]` and `[TEMPLATE-UPDATE-REQUEST]` are approved by @ashley; the only type-family change is the FR-014 swap (ends at exactly 25)
- Phase 8: labels are deleted only in repositories whose dry run @ashley has approved (FR-016)
- All findings must be evidence-based (file path + line number)

---

## Phase 1: Setup (Audit Preparation)

**Purpose**: Initialize audit directory structure and tooling

- [x] T001 Create output directory: `.github/reports/audits/2026-09-14-label-audit/`
- [x] T002 Create subdirectories: `evidence/` for supporting data, `findings.json`, `label-inventory.json`
- [x] T003 [P] Verify access to all audit data sources: `.github/labels.yml`, `.github/issue-types.yml`, `.github/label-governance-policy.yml`
- [x] T004 [P] List all documentation files: `docs/LABEL_*.md`, `docs/ISSUE_*.md`, `docs/PR_*.md` (inventory into findings.json)
- [x] T005 [P] List all archived workflow files: `.github/workflows/archived/2026-09-11/labeling/` (11 total, verify count)

**Checkpoint**: Audit infrastructure ready - all data sources accessible and inventoried

---

## Phase 2: Foundational (Core Data Extraction - Blocking)

**Purpose**: Extract and parse all audit data sources (BLOCKS all user story work until complete)

**⚠️ CRITICAL**: No analysis can begin until this phase is 100% complete

### Data Extraction Tasks

- [x] T006 Extract canonical labels from `.github/labels.yml`: Create JSON with all 169 labels (name, color, description, family). Save to `evidence/canonical-labels.json` (FR-001)
  - Include: family (e.g., "status", "priority", "type"), name (full name with prefix), color (hex), description
  - Verify count: Exactly 169 labels
  
- [x] T007 Extract issue types from `.github/issue-types.yml`: Create JSON with all 25 type labels and their mappings. Save to `evidence/issue-types.json` (FR-002)
  - Include: Issue type name, label name, color
  - Verify count: Exactly 25 types (IMMUTABLE)
  - Verify each type maps to one `type:*` label
  
- [x] T008 Extract governance policy from `.github/label-governance-policy.yml`: Create JSON with never-delete list. Save to `evidence/governance-policy.json`
  - Include: All labels in never-delete list (57 labels)
  - Note: Verify if labels are in canonical or not
  
- [ ] T009 Superseded by T041 (org-wide paginated inventory). If run standalone: `gh label list --repo lightspeedwp/.github --limit 1000 --json name,color,description` saved to `evidence/github-api-labels.json`
  - Include: All labels currently on repository
  - Verify structure matches output format (JSON)
  
- [x] T010 Parse documentation files: Extract label families and taxonomy mentioned in `docs/LABEL_*.md`, `docs/ISSUE_*.md`, `docs/PR_*.md`. Save to `evidence/documentation-references.json` (FR-004)
  - Include: File path, labels mentioned, context/description
  - Note: Which families are documented, which aren't
  
- [x] T011 [P] Analyze each archived workflow file: Extract purpose, labels referenced, triggers, actions from all 11 files in `.github/workflows/archived/2026-09-11/labeling/`. Save to `evidence/archived-workflows.json` (FR-005)
  - For each workflow: name, file path, purpose (from comments/description), labels used, triggers (issues/pull_request/etc.), actions performed
  - Extract any configuration or conditionals that may explain why it was archived
  
- [x] T012 Create label family index from canonical file: Map each label to its family. Save to `evidence/label-families.json`
  - Include: 15 families identified (status, priority, type, area, comp, lang, env, compat, cpt, ai-ops, contrib, discussion, meta, release, openspec)
  - Family count and members

**Checkpoint**: All data extracted and verified - 6 JSON files created with complete audit data

---

## Phase 3: User Story 1 - Audit Team Discovers Label Family Inconsistencies (Priority: P1) 🎯 MVP

**Goal**: Identify which labels are missing from canonical file, misnamed across sources, and have governance/documentation gaps

**Independent Test**: Complete when reconciliation report shows all labels accounted for with evidence-based findings

### Phase 3.1: Canonical vs Governance Policy Comparison

- [X] T013 [US1] Compare canonical labels against governance policy: For each label in governance never-delete list, verify it exists in canonical file with matching name (output: `.github/reports/audits/2026-09-14-label-audit/evidence/governance-vs-canonical.json`) (FR-003)
  - Create findings JSON: `{ finding_type: "mismatch" | "missing", source_label: "...", canonical_label: "..." }`
  - Save to `evidence/governance-vs-canonical.json`
  - Expected findings: type:documentation → type:docs, type:ai-ops → type:aiops, plus 6-8 labels missing from canonical
  
- [X] T014 [P] [US1] Generate governance gaps report: List all labels in governance policy that are NOT in canonical file OR have name mismatches (output: `.github/reports/audits/2026-09-14-label-audit/evidence/governance-gaps.json`) (FR-003)
  - Include: Line number in policy file, current name, canonical name (if exists), recommendation
  - Save to `evidence/governance-gaps.json`

### Phase 3.2: Issue Types Validation

- [X] T015 [US1] Verify all 25 mapped type labels present in canonical: Cross-reference issue-types.yml with labels.yml (output: `.github/reports/audits/2026-09-14-label-audit/evidence/type-labels-validation.json`) (FR-002)
  - For each of 25 types: Confirm label exists in canonical file with matching name and color
  - Record `type:decision` as the 26th canonical `type:*` label with no issue-types.yml mapping (governance gap, pending decision)
  - Create verification JSON: `{ type: "...", label: "...", in_canonical: true/false, color_match: true/false }`
  - Save to `evidence/type-labels-validation.json`
  - Expected result: All 25 mapped present, all colors match; `type:decision` documented as unmapped
  
- [X] T016 [US1] Type labels immutability check: Verify type: family has exactly 26 labels (25 mapped + `type:decision` unmapped), no other additions/removals (output: `.github/reports/audits/2026-09-14-label-audit/evidence/type-labels-validation.json`) (FR-008)
  - Compare current canonical count against issue-types.yml count
  - Confirm: 25 mapped type labels all present; `type:decision` recorded as unmapped gap, no changes needed by the audit itself

### Phase 3.3: Missing Labels Detection

- [ ] T017 [US1] Identify orphan labels: Compare GitHub API labels against canonical file (output: `.github/reports/audits/2026-09-14-label-audit/evidence/github-api-labels.json`)
  - For each label in GitHub API: Check if it exists in canonical file
  - Create findings JSON: `{ label: "...", in_github_api: true, in_canonical: false, status: "orphan" }`
  - Save to `evidence/orphan-labels.json`
  - Expected result: If orphans exist, document them
  
- [X] T018 [P] [US1] Check for undocumented labels: Compare canonical file against documentation (output: `.github/reports/audits/2026-09-14-label-audit/evidence/documentation-coverage.json`) (FR-004)
  - For each label in canonical: Verify it's mentioned in LABEL_STRATEGY.md or relevant LABEL_*.md
  - Create findings JSON: `{ label: "...", documented: true/false, doc_files: [...] }`
  - Save to `evidence/documentation-coverage.json`

### Phase 3.4: Generate Reconciliation Findings

- [x] T019 [US1] Consolidate all inconsistencies into findings report: Combine all Phase 3 sub-findings (output: `.github/reports/audits/2026-09-14-label-audit/evidence/all-findings.json`)
  - Create comprehensive JSON: One entry per finding with finding_type, severity, evidence (file + line), recommendation
  - Structure: Similar to data-model.md ReconciliationFinding entity
  - Save to `evidence/all-findings.json`
  
- [x] T020 [US1] Generate audit-report.md: Main deliverable with findings summary (output: `.github/reports/audits/2026-09-14-label-audit/007-audit-report.md`)
  - Include sections:
    - Executive Summary (status, key metrics, critical issues)
    - Label Inventory by Family (status, priority, type, area, comp, lang, env, compat, cpt, ai-ops, contrib, discussion, meta, release, openspec)
    - Findings Summary (organized by finding_type: missing, misnamed, mismatch, duplicate, orphan, governance_gap)
    - Validation Results (type labels: ✅ 25 mapped all present + `type:decision` unmapped gap recorded, canonical: ✅ 169 all accounted for)
    - Recommendations (prioritized by impact)
    - Appendices with JSON evidence
  - Save to `.github/reports/audits/2026-09-14-label-audit/007-audit-report.md`

**Checkpoint**: User Story 1 COMPLETE - Audit Team has comprehensive reconciliation report showing all inconsistencies with evidence

---

## Phase 4: User Story 2 - Identify & Catalog Duplicate Labels (Priority: P2)

**Goal**: Identify duplicate/overlapping labels and plan consolidation strategy

**Independent Test**: Complete when duplicates-analysis.md shows all potential consolidations with impact analysis

### Phase 4.1: Duplicate Label Detection

- [x] T021 [US2] Analyze label families for semantic duplicates: For each family, identify labels with similar purposes (output: `.github/reports/audits/2026-09-14-label-audit/evidence/duplicate-candidates.json`) (FR-007)
  - Examples: type:documentation vs type:docs (already identified as mismatch)
  - Area family analysis: area:ai, area:agents, area:skills, area:instructions, area:prompts (might overlap conceptually)
  - Create analysis JSON: `{ family: "...", label1: "...", label2: "...", reason_duplicate: "...", confidence: "high/medium/low" }`
  - Save to `evidence/duplicate-candidates.json`
  
- [x] T022 [P] [US2] Check historical usage patterns: For each duplicate candidate, determine which should be canonical (done 2026-09-24 with document, automation and policy counts; issue and PR usage counts read "pending T041/T042" until the live inventories exist, so the SC-004 ranking is completed after T041 and T042) (output: `.github/reports/audits/2026-09-14-label-audit/evidence/duplicate-consolidation-analysis.json`) (FR-007)
  - Query: Which label appears more frequently in issues/PRs (if accessible via API)?
  - Query: Which label is mentioned in documentation more often?
  - Which label is in governance policy never-delete list?
  - Create decision matrix: `{ label1: "...", label2: "...", usage_count: {...}, policy_status: "...", recommended_canonical: "..." }`
  - Save to `evidence/duplicate-consolidation-analysis.json`

### Phase 4.2: Consolidation Strategy

- [x] T023 [US2] Generate consolidation recommendations: For each identified duplicate (output: `.github/reports/audits/2026-09-14-label-audit/evidence/consolidation-recommendations.json`)
  - Decision: Keep canonical name or rename?
  - Migration strategy: Rename, deprecate, or alias?
  - Impact analysis: Which workflows/automations use each label?
  - Timeline: Can consolidation happen in single PR or needs staged rollout?
  - Create recommendation JSON: Similar to data-model.md format with impact analysis
  - Save to `evidence/consolidation-recommendations.json`
  
- [x] T024 [US2] Identify labeling gaps: Labels mentioned in docs but not in canonical, or policy but not canonical (output: `.github/reports/audits/2026-09-14-label-audit/evidence/labeling-gaps.json`)
  - Clarify: Are these intentional (deprecated), or should they be added to canonical?
  - Create gap analysis JSON: `{ gap_type: "documentation_only" | "policy_only", label: "...", recommendation: "add_to_canonical" | "remove_from_docs" | "deprecated" }`
  - Save to `evidence/labeling-gaps.json`

### Phase 4.3: Generate Duplicates Analysis Report

- [x] T025 [US2] Generate duplicates-analysis.md: Consolidation strategy document (output: `.github/reports/audits/2026-09-14-label-audit/duplicates-analysis.md`)
  - Include sections:
    - Executive Summary (total duplicates, high-priority consolidations)
    - Duplicate Families (area, type, other families with consolidation candidates)
    - Consolidation Matrix (each duplicate pair with canonical choice and rationale)
    - Impact Analysis (which workflows use each label)
    - Migration Strategy (steps to consolidate, timeline, rollback plan)
    - Labeling Gaps (labels to add, remove, or deprecate)
  - Save to `.github/reports/audits/2026-09-14-label-audit/duplicates-analysis.md`

**Checkpoint**: User Story 2 COMPLETE - Automation Engineers have consolidation strategy for each duplicate

---

## Phase 5: User Story 3 - Audit Archived Workflows & Plan Restoration (Priority: P3)

**Goal**: Understand why workflows were archived and plan restoration

**Independent Test**: Complete when workflow-analysis.md shows detailed assessment of each workflow

### Phase 5.1: Archived Workflow Analysis

- [x] T026 [P] [US3] Analyze each of 11 archived workflows, starting from the per-workflow data already extracted by T011 in `evidence/archived-workflows.json` (do not re-extract): add failure points and assessment for each file (FR-005)
  - Workflow 1: batch-label-prs.yml
  - Workflow 2: issue-labeling-automation.yml
  - Workflow 3: label-audit-report.yml
  - Workflow 4: labeling-governance.yml (21KB - complex)
  - Workflow 5: labeling.yml
  - Workflow 6: manage-blocking-status-labels.yml
  - Workflow 7: meta-labels-sync.yml
  - Workflow 8: openspec-sync-labels.yml
  - Workflow 9: openspec-validate-labels.yml
  - Workflow 10: remediate-bare-labels.yml
  - Workflow 11: validate-issue-labels.yml
  - For each: Extract purpose, labels referenced, triggers, actions, any error handling or validation
  - Create analysis JSON per workflow: Save to `evidence/workflow-[name].json`
  
- [x] T027 [US3] Determine archival reason for each workflow: Conflicts, performance, obsolete, superseded? (output: `.github/reports/audits/2026-09-14-label-audit/evidence/workflow-archival-analysis.json`)
  - Check: Does unified labeling agent (labeling.agent.js) cover same purpose?
  - Check: Are there related active workflows in `.github/workflows/`?
  - Create archival analysis: `{ workflow: "...", purpose: "...", archival_reason: "conflicts" | "obsolete" | "performance" | "superseded", superseded_by: "...", root_cause: "..." }`
  - Save to `evidence/workflow-archival-analysis.json`

### Phase 5.2: Restoration Feasibility Assessment

- [x] T028 [US3] Assess restoration feasibility for each workflow: Can it be fixed/restored? (output: `.github/reports/audits/2026-09-14-label-audit/evidence/workflow-restoration-feasibility.json`)
  - For each workflow: Is restoration high/medium/low effort?
  - Should it be: restored, rebuilt, or retired?
  - What automation gaps still exist?
  - Create feasibility JSON: `{ workflow: "...", feasibility: "high" | "medium" | "low", recommendation: "restore" | "rebuild" | "retire", effort: "minimal" | "moderate" | "significant", gap_filled_by: "labeling.agent.js" | null }`
  - Save to `evidence/workflow-restoration-feasibility.json`
  
- [x] T029 [US3] Identify automation gaps: Which labeling automations are NOT currently handled? (output: `.github/reports/audits/2026-09-14-label-audit/evidence/automation-gaps.json`)
  - Compare archived workflow purposes against current unified labeling agent capabilities
  - List any gaps: "Issue labeling based on [criteria] not implemented", etc.
  - Create gaps report: `{ gap: "...", last_attempted_in: "workflow_name", current_coverage: "...", recommendation: "implement_in_unified_agent" | "restore_workflow" }`
  - Save to `evidence/automation-gaps.json`

### Phase 5.3: Generate Workflow Analysis Report

- [x] T030 [US3] Generate workflow-analysis.md: Archived workflow assessment document (output: `.github/reports/audits/2026-09-14-label-audit/workflow-analysis.md`)
  - Include sections:
    - Executive Summary (11 workflows analyzed, restoration opportunities)
    - Workflow Inventory (table: file, purpose, archival reason, feasibility)
    - Individual Workflow Assessments (detailed findings for each workflow)
    - Automation Gaps (what labeling automation is NOT currently handled)
    - Restoration Roadmap (prioritized list of workflows to restore/rebuild)
    - Unified Labeling Agent Assessment (how well it covers archived workflow purposes)
  - Save to `.github/reports/audits/2026-09-14-label-audit/workflow-analysis.md`

**Checkpoint**: User Story 3 COMPLETE - DevOps/automation leads have comprehensive workflow assessment and restoration roadmap

---

## Phase 6: Cross-Story Integration & Deliverables

**Purpose**: Generate final audit artifacts and validate completeness

### Integration Tasks

- [x] T031 [P] Generate label-inventory.csv: Complete label catalog from canonical file (output: `.github/reports/audits/2026-09-14-label-audit/label-inventory.csv`)
  - Columns: family, label_name, color, description, in_canonical, in_issue_types, in_policy, in_docs, in_workflows, api_present, status, notes
  - Rows: All 169 labels from canonical file
  - Status field: "OK" | "ORPHAN" | "DUPLICATE" | "MISMATCH" | "DEPRECATED" | "GAP"
  - Save to `.github/reports/audits/2026-09-14-label-audit/label-inventory.csv`
  
- [x] T032 [P] Generate label-inventory.json: Machine-readable version of inventory (output: `.github/reports/audits/2026-09-14-label-audit/label-inventory.json`)
  - Structure per data-model.md (families, labels, summary statistics)
  - Include: All 169 labels with complete metadata
  - Include: Summary showing total_canonical, total_in_api, total_orphans, total_duplicates, total_ok, families_with_issues
  - Save to `.github/reports/audits/2026-09-14-label-audit/label-inventory.json`
  
- [x] T033 [P] Consolidate evidence directory: Organize all supporting JSON files (output: `.github/reports/audits/2026-09-14-label-audit/evidence/README.md`)
  - Move/link all evidence/*.json files to `.github/reports/audits/2026-09-14-label-audit/evidence/`
  - Create index: `evidence/README.md` documenting each evidence file
  - Verify: Every finding in audit report has corresponding evidence file with line numbers

### Validation & Quality Assurance

- [x] T034 Run quickstart.md validation tests: Verify audit completeness (output: `.github/reports/audits/2026-09-14-label-audit/validation-results.md`)
  - Test 1: Label inventory completeness (GitHub API vs canonical) ✅
  - Test 2: Type labels validation (25 present, immutable, all mapped) ✅
  - Test 3: Governance policy consistency (gaps/inconsistencies identified) ✅
  - Test 4: Archived workflow analysis (all 11 analyzed with findings) ✅
  - Test 5: Documentation consistency (spot-check 3 families) ✅
  - Test 6: Audit report completeness (all required sections present) ✅
  - Test 7: Evidence traceability (every finding has file + line + quote) ✅
  - Test 8: Recommendations actionability (clear, prioritized, implementable) ✅
  - Document results in `.github/reports/audits/2026-09-14-label-audit/validation-results.md`

- [x] T035 [P] Verify evidence traceability: For each finding in audit-report.md (output: `.github/reports/audits/2026-09-14-label-audit/validation-results.md`)
  - Confirm: File path is correct and accessible
  - Confirm: Line number is accurate and quote is verbatim
  - Confirm: Context/evidence supports finding conclusion
  - Create traceability report: Flag any broken references

- [x] T036 Final audit report review: Ensure all sections complete and coherent (output: `.github/reports/audits/2026-09-14-label-audit/007-audit-report.md`)
  - Check: Executive summary is accurate
  - Check: All findings have evidence
  - Check: All recommendations are actionable
  - Check: No implementation details leak into report (remains analysis-only)
  - Check: UK English spelling throughout
  - Proofread: Catch typos, formatting issues

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and delivery finalization

- [x] T037 [P] Create audit summary document: Executive brief for stakeholders (output: `.github/reports/audits/2026-09-14-label-audit/SUMMARY.md`)
  - Include: What was audited (data sources), what was found (key metrics), what's recommended (top 3-5 actions)
  - Save to `.github/reports/audits/2026-09-14-label-audit/SUMMARY.md`
  
- [x] T038 [P] Document audit methodology: How audit was conducted (output: `.github/reports/audits/2026-09-14-label-audit/METHODOLOGY.md`)
  - Include: Data sources, comparison logic, finding classification, evidence standards
  - Save to `.github/reports/audits/2026-09-14-label-audit/METHODOLOGY.md`
  
- [x] T039 Create audit metadata file: Date, scope, auditor, version (output: `.github/reports/audits/2026-09-14-label-audit/audit-metadata.json`)
  - JSON file with: audit_date, repository, scope, total_labels_audited, total_findings, timestamp, auditor
  - Save to `.github/reports/audits/2026-09-14-label-audit/audit-metadata.json`
  
- [x] T040 Final deliverables checklist: Verify all audit outputs present (output: `.github/reports/audits/2026-09-14-label-audit/`)
  - ✅ 007-audit-report.md (main findings)
  - ✅ label-inventory.csv (human-readable catalog)
  - ✅ label-inventory.json (machine-readable catalog)
  - ✅ duplicates-analysis.md (consolidation strategy)
  - ✅ workflow-analysis.md (workflow assessment)
  - ✅ evidence/ directory (supporting data)
  - ✅ SUMMARY.md (executive brief)
  - ✅ METHODOLOGY.md (how audit was conducted)
  - ✅ audit-metadata.json (audit metadata)

---

## Phase 8: User Story 4 - Governance Lead Aligns GitHub and Linear Labels (Priority: P1)

**Goal**: One approved label set shared by every `lightspeedwp` repository and the Linear workspace, with exactly 25 type labels and no drift (FR-011 to FR-017, SC-003, SC-009).

**Independent Test**: After one approved run, every repository and Linear hold only labels from `labels.yml` (plus documented team-scoped Linear labels), the type family has exactly 25 labels, and the first drift report says "No drift" (quickstart Tests 9 to 14).

**Depends on**: Phase 3 (US1) evidence. Stages run strictly in order (plan.md, Consolidation Execution Plan); each stage's exit check must pass before the next starts. Branches for the PRs below must follow `{type}/{scope}-{title}` (for example `chore/labels-consolidation-config`).

### Governance prerequisite

- [x] T040a [US4] Open the constitution v1.3.0–v1.3.1 approval issue in `lightspeedwp/.github` (rationale, affected sections, impact, validation plan) and record its number and @ashley's sign-off in `.github/reports/audits/2026-09-14-label-audit/evidence/change-requests.json`; blocks merging `audit/label-consolidation` into `develop`

### Stage 0a: Immediate — Issue Types and Colours (FR-014, FR-019, FR-020)

These two tasks come first. The list they use is `contracts/issue-types-org-settings.md`.

- [ ] T040b [US4] In one PR from a correctly named branch (for example `chore/issue-types-colours`): update `.github/issue-types.yml` to the 25 entries in `contracts/issue-types-org-settings.md` (Decision replaces Question; add a `description` for every entry; hex colours from the list) and update every `type:*` label in `.github/labels.yml` to the same hex, adding `type:decision` colour `3467D3` and removing `type:question`. Because template and field validation check labels against `labels.yml`, the same PR also does T053 (create `06-decision.md`, remove `06-question.md`) and T054 (`issue-fields.yml`), and adds `description` to the issue-type schema in `scripts/agents/includes/yaml-validator.js`. Record @ashley's approval (#3530 sign-off plus the `[ISSUE-TYPE-UPDATE-REQUEST]` and `[TEMPLATE-UPDATE-REQUEST]`) in `.github/reports/audits/2026-09-14-label-audit/evidence/change-requests.json`; keep the Issue Type rules from `data-model.md` ("exactly 25 issue types; names, labels and templates are one-to-one"); run quickstart Test 10c, `npm test` and `node scripts/validation/validate-labeling-configs.cjs` before merging (depends on T040a) — in review: PR <https://github.com/lightspeedwp/.github/pull/3534>; approval requests #3556 (`[ISSUE-TYPE-UPDATE-REQUEST]`) and #3557 (`[TEMPLATE-UPDATE-REQUEST]`) are recorded as pending in `change-requests.json`. Done when both are approved and #3534 merges
- [ ] T040c [US4] Manually update the organisation's issue types page (Settings → Planning → Issue types) using the ordered steps in `contracts/issue-types-org-settings.md`: rename four types, update every description and native colour, move issues off Maintenance, Story and Integration (counts from T041a) and delete those types, then add Decision, Dependency Update and Build; run quickstart Test 10b; record the final list in `.github/reports/audits/2026-09-14-label-audit/evidence/native-issue-types.json` (depends on T040b, T041a)

### Stage 0b: Immediate — Labelling Agent Guard (FR-017, FR-022; research R14)

The active labelling agent removes labels outside `labels.yml` today, so this runs now, in its own PR from a `fix/` branch (for example `fix/labeling-agent-label-removal`), separate from `audit/label-consolidation`. **In review: PR [#3564](https://github.com/lightspeedwp/.github/pull/3564)** (branch `fix/labeling-agent-label-removal`) implements T040d–T040g; tick them when it merges.

- [ ] T040d [US4] In `scripts/agents/labeling.agent.js`, change `standardizeLabelsOnItem` (lines 216–240) so it never removes a label only because it is missing from `labels.yml`: when an alias maps the label, add the canonical label and remove the old one; when no alias exists, leave the label in place and log it. Add an option (default off) that allows unmapped removal, for Stage 3 onwards (FR-022)
- [ ] T040e [US4] In `scripts/agents/run-labeling-agent.js`, pass `{ dryRun: process.env.DRY_RUN === 'true' }` to `runLabelingAgent()`, and check that no `github.rest.issues.*` write call runs when `dryRun` is true (FR-022; `labeling-unified.yml` lines 133 and 168 already set `DRY_RUN`)
- [ ] T040f [P] [US4] In the keyword and branch maps of `scripts/agents/labeling.agent.js` (lines 54–104), replace `type:documentation` with `type:docs`, `type:dependencies` with `type:dependency` and `type:accessibility` with `type:a11y`, so the agent applies only `type:*` labels in `labels.yml` (FR-017)
- [ ] T040g [US4] Add tests to `scripts/agents/__tests__/labeling.agent.test.js`: an unmapped label is kept, a mapped label is replaced, dry run makes no write call, and every `type:*` label the agent can apply exists in `.github/labels.yml`. Run quickstart Test 16 and `npm test`, then open the fix PR from the `fix/` branch using the fix PR template (depends on T040d–T040f)

### Stage 0c: Next priority — Label Names on the Audit Branch (FR-011; research R17)

**Do these next, before #3362 merges.** All on `audit/label-consolidation`; no locked file, script, workflow or test changes. Target names: `ai-ops:*` → `aiops:*`, `type:ai-ops`/`area:ai-ops`/`meta:ai-ops` → `type:aiops`/`area:aiops`/`meta:aiops`, `openspec:*` → `spec:*`. Keep an old name only where the text names it as a rename source (a `from`, "was" or `→` mention, or a clarification quoting a question), and keep quoted file contents and file paths (for example `openspec-sync-labels.yml`) as recorded.

- [ ] T040h [US4] Replace old label names with the target names in the spec 008 artefacts: `.github/specs/008-label-audit-consolidation/spec.md` (outside the Clarifications section and the rename definitions in FR-011), `plan.md`, `research.md`, `data-model.md`, `tasks.md` (family lists only), `quickstart.md` and `contracts/*.md` (FR-011)
- [ ] T040i [P] [US4] Replace old label names with the target names in the audit's analysis reports: `.github/reports/audits/2026-09-14-label-audit/007-audit-report.md`, `.github/reports/audits/2026-09-14-label-audit/duplicates-analysis.md`, `.github/reports/audits/2026-09-14-label-audit/workflow-analysis.md`, `.github/reports/audits/2026-09-14-label-audit/SUMMARY.md`, `.github/reports/audits/2026-09-14-label-audit/METHODOLOGY.md` and `.github/reports/audits/2026-09-14-label-audit/validation-results.md` (FR-011)
- [ ] T040j [P] [US4] Replace old label names in the finding and recommendation text of the analysis evidence files: `.github/reports/audits/2026-09-14-label-audit/evidence/duplicate-candidates.json`, `duplicate-consolidation-analysis.json`, `consolidation-recommendations.json`, `labeling-gaps.json`, `all-findings.json`, `documentation-coverage.json`, `governance-policy.json`, `governance-gaps.json`, `governance-vs-canonical.json`, `workflow-archival-analysis.json` and `automation-gaps.json`; keep values that quote file contents or name files. Do not edit `renamed-label-references.json`, which keeps the old names it records (FR-011)
- [ ] T040k [P] [US4] Add `target_name` to every label record in `.github/reports/audits/2026-09-14-label-audit/evidence/canonical-labels.json`, `.github/reports/audits/2026-09-14-label-audit/evidence/label-families.json` and `.github/reports/audits/2026-09-14-label-audit/label-inventory.json`, and a `target_name` column to `.github/reports/audits/2026-09-14-label-audit/label-inventory.csv`, per data-model entity 13: "`name` unchanged: the name recorded on 2026-09-14"; "`target_name` equal to `name` for labels that are not renamed"; "counts, families and every other recorded value stay unchanged". Add a note on `target_name` to `.github/reports/audits/2026-09-14-label-audit/evidence/README.md` (FR-011)
- [ ] T040l [P] [US4] Replace old label names with the target names in `docs/LABEL_INVENTORY.md` and `docs/LABELING_FAQ.md` (FR-011)
- [ ] T040m [US4] Run quickstart Test 17 and `npx jest --config .jest.config.cjs scripts/validation/__tests__/label-audit-evidence.test.js`, then update the #3362 description to say label names on the branch now use `aiops` and `spec` and that the configuration rename follows in Stage 2 (depends on T040h–T040l) (output: `.github/specs/008-label-audit-consolidation/quickstart.md`)

**Checkpoint**: Test 17 passes; #3362 is ready for @ashley to merge once its other merge checks pass.

### Stage 0: Evidence (FR-006, FR-010, FR-012)

- [ ] T041 [US4] Run `scripts/automation/label-inventory.js` (already written, commit 7d799e60) with the FR-018 GitHub App installation token, or another token with organisation read access (never `GITHUB_TOKEN`). The script lists every `lightspeedwp` repository and pages through each repository's labels with `per_page=100` until no `next` link remains; save the result to `.github/reports/audits/2026-09-14-label-audit/evidence/github-api-labels.json` (replacing the empty inventory) with, per repository, `label_count` and `pages_read` where "`pages_read × 100 ≥ label_count`"
- [ ] T041a [P] [US4] List the `lightspeedwp` organisation's native issue types and count the issues using each (especially Maintenance, Story and Integration) across all repositories; save to `.github/reports/audits/2026-09-14-label-audit/evidence/native-issue-types.json` (FR-019)
- [ ] T042 [P] [US4] Export all Linear workspace and team labels with per-label issue counts (exact label ID filter, archived issues included) into the `sources` block of `.github/reports/audits/2026-09-14-label-audit/evidence/linear-labels.json`, following `contracts/label-mapping-schema.md`
- [ ] T043 [US4] Fill `mappings[]` in `.github/reports/audits/2026-09-14-label-audit/evidence/linear-labels.json` from spec FR-011 (renames), FR-012 (imports, merges, retirements, team-scope), FR-014 (swap) and FR-015 (re-prefix), with each entry's `action` one of "`rename`, `import`, `merge`, `re-prefix`, `retire`, `team-scope`, `swap`"; include the five #3554 imports (`area:builds`, `area:monitoring`, `area:observability`, `area:workflows`, `meta:needs-approval`) with the colours and descriptions set in FR-012, and no `area:observability` → `area:monitoring` merge; fill `color`, `description` and `change_request` for every import as `contracts/label-mapping-schema.md` requires (a `meta:*` import uses `57606A`); map `area:agents`, `area:instructions` and `area:prompts` to their `aiops:*` labels and decide `area:skills`; check validation rules 1 to 7 of the schema, including "No mapping leaves an issue with zero or two `type:*` labels" (depends on T041, T042)
- [ ] T043a [US4] Add a `gap: true` mapping to `mappings[]` in `.github/reports/audits/2026-09-14-label-audit/evidence/linear-labels.json` for every `openspec:` name found in files but not defined in `.github/labels.yml` (about 20, for example `openspec:specification-pending`, `openspec:status`, `openspec:domain`, `openspec:priority`; source list in `.github/reports/audits/2026-09-14-label-audit/evidence/renamed-label-references.json`), each with `action` `rename` to one of the 9 `spec:*` labels or `retire`, and a `rename` entry for each spec-number label `spec:NNN` → `spec-id:NNN` (label-mapping-schema rules 8 and 9; research R19, R20) (depends on T043)
- [X] T044 [P] [US4] Search workflows, scripts, configuration and docs for every label being renamed, merged or retired (`ai-ops:`, `openspec:`, `type:question`, `status:completed`, `area:tests` and the other FR-012 sources) and record file, line and label in `.github/reports/audits/2026-09-14-label-audit/evidence/renamed-label-references.json` as FR-010/FR-011 impact evidence
- [ ] T045 [US4] Add a "Consolidation mapping" section to `.github/reports/audits/2026-09-14-label-audit/007-audit-report.md` summarising `linear-labels.json`, and mark Finding 1 resolved: `type:decision` is mapped since Stage 0a (#3534, approved via #3530, #3556 and #3557) (depends on T043)

**Checkpoint**: quickstart Test 9 passes (every mapping target exists in the proposed `labels.yml`).

### Stage 1: Approve (FR-009, FR-013, FR-014, FR-016)

- [ ] T046a [US4] Record #3554 in `.github/reports/audits/2026-09-14-label-audit/evidence/change-requests.json` as a `LABEL-UPDATE-REQUEST` covering the five imports, with status `pending` until @ashley records a dated decision on the issue; check its title carries `[LABEL-UPDATE-REQUEST]` and its body has an impact analysis (constitution Principle II)
- [ ] T046 [US4] Draft the `[LABEL-UPDATE-REQUEST]` issue body with the full mapping table and impact list from T043/T043a/T044, including the 16 FR-011 prefix renames, the `gap: true` entries and the `spec:NNN` → `spec-id:NNN` move, in `.github/reports/audits/2026-09-14-label-audit/change-requests/label-update-request.md`; reference #3554, which already covers five imports, and label the request `meta:needs-approval` (FR-021)
- [ ] T046b [P] [US4] Draft a `[TEMPLATE-UPDATE-REQUEST]` issue body for `.github/PULL_REQUEST_TEMPLATE/pr_aiops.md` (`labels` and `recommended_issue_type` change from `type:ai-ops` to `type:aiops`; title prefix `aiops:` unchanged) with impact on PR template routing, in `.github/reports/audits/2026-09-14-label-audit/change-requests/pr-aiops-template-request.md` (FR-011; research R18)
- [x] T047 [P] [US4] Done: opened as #3556 and #3557 (bodies are in the issues, not in `change-requests/`). Originally: draft the `[ISSUE-TYPE-UPDATE-REQUEST]` and `[TEMPLATE-UPDATE-REQUEST]` bodies for Question → Decision and the FR-019 native issue-type change set (renames, removals after migration, additions), citing `contracts/decision-issue-template.md`, in `.github/reports/audits/2026-09-14-label-audit/change-requests/issue-type-update-request.md` and `.github/reports/audits/2026-09-14-label-audit/change-requests/template-update-request.md`
- [ ] T048 [P] [US4] Draft the OpenSpec migration issue body listing every source → target path (`OPENSPEC*.md` → `SPEC*.md`, `skills/openspec-estimate-planner/` → `skills/speckit-estimate-planner/`, the root `openspec` symlink removed and its target `.github/projects/active/openspec/` renamed to `.github/projects/active/speckit-changes/`) in `.github/reports/audits/2026-09-14-label-audit/change-requests/openspec-migration.md`
- [ ] T049 [P] [US4] Draft the new deletion gate issue body that replaces closed issue #95, describing the per-repository dry-run approval flow from `contracts/dry-run-and-drift-report-schema.md`, in `.github/reports/audits/2026-09-14-label-audit/change-requests/label-deletion-gate.md`
- [ ] T050 [US4] Open the remaining four issues (label update request from T046, template request from T046b, OpenSpec migration from T048, deletion gate from T049) (the `[ISSUE-TYPE-UPDATE-REQUEST]` #3556 and `[TEMPLATE-UPDATE-REQUEST]` #3557 are already open) in `lightspeedwp/.github` using only prefixed labels from `labels.yml` (for example `type:task`, `area:governance`), reference the constitution approval issue from T040a, and record issue numbers and approval status in `.github/reports/audits/2026-09-14-label-audit/evidence/change-requests.json`; stop until @ashley approves all five (depends on T046, T048 and T049)

### Stage 2: Configuration PR (FR-011, FR-012, FR-014, SC-003)

- [ ] T051 [US4] Update `.github/labels.yml`: rename `ai-ops:*` → `aiops:*` and `openspec:*` → `spec:*`, add approved imports, remove merged sources (for example `status:completed`, `area:tests`) and `type:question`, keeping the header comments; `type:*` colours and the `type:question` removal are already done by T040b; the type family must total exactly 25 (depends on T050)
- [ ] T052 [P] [US4] Superseded by T040b (`.github/issue-types.yml` already updated); verify only that it still has 25 entries matching `contracts/issue-types-org-settings.md`
- [ ] T053 [P] [US4] Done in T040b's PR; if not, Create `.github/ISSUE_TEMPLATE/06-decision.md` exactly as defined in `contracts/decision-issue-template.md` (frontmatter, six sections, DoR, DoD), delete `.github/ISSUE_TEMPLATE/06-question.md`, and point question-style requests to Discussions in `.github/ISSUE_TEMPLATE/config.yml` (depends on T050)
- [ ] T054 [P] [US4] Done in T040b's PR (#3534); tick when it merges. Originally: update `.github/issue-fields.yml`: replace `type:question: Task` with `type:decision: Task`, and remove every `type:*` entry that is not in `.github/labels.yml` after T051 — currently `type:enhancement`, `type:help`, `type:integration`, `type:investigation`, `type:maintenance`, `type:qa`, `type:story`, `type:support`, `type:ui` and `type:ux-feedback` (depends on T050)
- [ ] T055 [P] [US4] Update `.github/label-governance-policy.yml`: set `gated_by_issue` to the new gate issue number, keep `enabled: false`, remove `type:question` and other labels no longer in `labels.yml` from `never_delete_labels` (resolving the 12 policy misalignments from Finding 2), and update `last_updated` (depends on T050) — partly done on the spec branch: `never_delete_labels` now lists only labels in `labels.yml` (13 removed: the 12 from Finding 2 plus `type:question`), checked by `label-audit-evidence.test.js`; `gated_by_issue` still waits for the new gate issue (Stage 1). `area:labels`, `meta:duplicate` and `meta:dependabot-security` are referenced in code, so T050 decides whether to import them
- [ ] T056 [P] [US4] Update `.github/labeler.yml` and `.github/branch-labels.yml` for every renamed or merged label in T043 (depends on T050)
- [ ] T057 [US4] Update every script and workflow listed in `.github/reports/audits/2026-09-14-label-audit/evidence/renamed-label-references.json` (under `scripts/` and `.github/workflows/`) to the new label names, and make label-creating automation create only labels present in `.github/labels.yml` (research R6c) (depends on T044, T051)
- [ ] T057a [US4] Rename the old prefixes in `.github/PULL_REQUEST_TEMPLATE/pr_aiops.md` (after T046b is approved), `scripts/validation/validate-labeling-configs.cjs` (allowed-prefix list, lines 42 and 47), `.github/workflows/orchestrate-phase-progression.yml`, `scripts/automation/handlers/handle-issue-created.cjs`, `scripts/SCRIPT-REGISTRY.md` and every test that names the old labels (`scripts/validation/__tests__/openspec-labels.test.js`, `scripts/automation/__tests__/*` and `agents/issue-agent/shared/__tests__/fixtures/labels.json`), using the T043a mapping for names not in `labels.yml` (FR-011; research R18, R19) (depends on T051)
- [ ] T057b [P] [US4] Move spec-number labels from `spec:NNN` to `spec-id:NNN` in `.github/projects/active/prd-combined-agent/ISSUE_LABELING_PLAN.md`, `.github/projects/active/prd-combined-agent/bulk-label-issues.sh` and `tests/bash/bulk-label-issues.bats` (FR-011; research R20) (depends on T050)
- [ ] T058 [P] [US4] Update `docs/LABELING_FAQ.md`, `docs/LABEL_INVENTORY.md`, `docs/ISSUE_FIELDS.md`, `docs/ISSUE_TRIAGE_AUTOMATION.md`, `docs/CODERABBIT_LABELS_ALIGNMENT.md` and `docs/LABEL_STRATEGY.md` for the renamed labels and the Decision type (depends on T051) — Decision part done on the spec branch (FAQ, inventory type table, triage list, CodeRabbit mapping; `docs/ISSUE_FIELDS.md` in #3534); the `aiops:` and `spec:` renames wait for T051
- [ ] T058a [P] [US4] Document the `meta:needs-approval` approval-gate policy (FR-021: when to apply it, the required approver/decision/scope/options/risk/evidence fields, removal on a dated decision) in `docs/LABEL_STRATEGY.md`; once the label exists, apply it to the open spec 008 change requests and the gate issue and check SC-010 with quickstart Test 15 (depends on T051)
- [ ] T059 [US4] Run quickstart Test 10, `npm test`, `npm run lint:md` and `npm run validate:frontmatter`; open the configuration PR from a correctly named branch and get it merged only after #3564 (Stage 0b) has merged, then apply its GitHub label renames (T062) in the same session so no item loses an `ai-ops:*` or `openspec:*` label (depends on T051 to T058, T057a, T057b and T040g) (output: `.github/specs/008-label-audit-consolidation/quickstart.md`)

### Stage 2b: Spec Kit Rename PR (FR-013)

- [ ] T060 [US4] Rename every live OpenSpec path with `git mv` per the approved migration issue from T048 (excluding `*/reports/*`, `*/archived/*`, `node_modules/`) and update every link to those paths (depends on T059: the configuration PR must be merged first, because both touch files such as `scripts/validation/__tests__/openspec-labels.test.js`)
- [ ] T061 [US4] Replace OpenSpec text references in live file contents with `speckit` (tool and process) or `spec`/`specs` (artefacts and labels), then run quickstart Test 11 and open the rename PR separately from T059 (depends on T060)

### Stage 3: GitHub Changes (FR-011, FR-012, FR-014, FR-015)

- [ ] T062 [US4] Write `scripts/automation/label-consolidate.js` (dry-run by default, `--apply` to execute) that, per repository and with full pagination, renames labels in place, creates or updates labels from `.github/labels.yml`, and relabels items where the target already exists before removing the source; write planned `to_create` and `to_rename` into `.github/reports/audits/2026-09-14-label-audit/evidence/dry-run/{repo}.json` (depends on T059)
- [ ] T063 [US4] In each repository with open `type:question` issues, convert them to Discussions (Q&A category) with the Labels page bulk action; relabel closed ones `type:task` + `discussion:support`; record repositories where Discussions are disabled in `.github/reports/audits/2026-09-14-label-audit/evidence/dry-run/{repo}.json` and relabel their open issues the same way. Must finish before any `type:question` deletion in Stage 4 (FR-014) (depends on T059)
- [ ] T064 [US4] Run `scripts/automation/label-consolidate.js --apply` for renames, creates and relabels across all repositories, then confirm no issue or PR has zero or two `type:*` labels, recording the check in `.github/reports/audits/2026-09-14-label-audit/evidence/type-label-check.json` (depends on T062, T063)
- [ ] T064d [US4] After T059 merges, switch the labelling agent to the approved mapping: load the FR-012 mapping from `evidence/linear-labels.json` (or aliases added to `labels.yml`) as its alias list and turn on unmapped removal only for labels the mapping retires (FR-022; depends on T040d, T059)
- [ ] T064a [US4] Superseded by T040c (manual organisation update); verify only. Original scope: Move every issue on the Maintenance, Story or Integration native types to its mapped type (Maintenance → Chore plus `area:maintenance`, Integration → Feature plus `area:integration`, Story → Feature) and update its `type:*` label to match, recording each change in `.github/reports/audits/2026-09-14-label-audit/evidence/native-issue-types.json` (depends on T041a, T059)
- [ ] T064b [US4] Superseded by T040c (manual organisation update); verify only. Original scope: Change the organisation's native issue types in this order (the organisation is limited to 25): rename A11y → Accessibility, Code Refactor → Refactor, Code Review → Review, Build & CI → CI; remove Maintenance, Story and Integration once T064a shows zero issues on them; add Build, Dependency Update and Decision. Use the organisation issue-types API if available, otherwise organisation settings; confirm the final list matches `.github/issue-types.yml` and record it in `.github/reports/audits/2026-09-14-label-audit/evidence/native-issue-types.json` (depends on T064a)

### Stage 4: Gated GitHub Deletion (FR-016)

- [ ] T064c [US4] Gate: before any deletion task (T065 onwards) or Linear clean-up (T069 onwards) starts, @ashley reviews every item in `checklists/destructive-changes.md` (CHK001–CHK038) and ticks it; stop if any item is unchecked or answered "no". Also confirm T063 has finished for every repository (FR-014, FR-016)
- [ ] T065 [US4] Extend `scripts/automation/label-consolidate.js` with a deletion dry run that fills `to_delete` in `.github/reports/audits/2026-09-14-label-audit/evidence/dry-run/{repo}.json` with a full snapshot per label (name, colour, description, open and closed item numbers) and a `migrate_to` for every label on open items, per `contracts/dry-run-and-drift-report-schema.md` (depends on T064, T064c)
- [ ] T066 [US4] Post each repository's dry-run summary on the gate issue and record @ashley's per-repository approval in the `approval` block of `.github/reports/audits/2026-09-14-label-audit/evidence/dry-run/{repo}.json`; repositories without approval are marked `skipped` (depends on T065)
- [ ] T067 [US4] From @ashley's session, run `scripts/automation/label-consolidate.js --apply --confirm-gate <gate issue number>`, which migrates open issues, PRs and Discussions, migrates closed items for labels that have a mapping target (FR-016), and deletes the listed labels only in repositories whose `evidence/dry-run/{repo}.json` approval is `approved` and refuses otherwise; `destructive_cleanup.enabled` in `.github/label-governance-policy.yml` stays `false`; then run quickstart Test 12 (depends on T066)
- [ ] T068 [P] [US4] Update the organisation's default repository labels to match `.github/labels.yml` (API if available, otherwise organisation settings), recording the method used on the gate issue and in `.github/reports/audits/2026-09-14-label-audit/evidence/change-requests.json` (research R9) (depends on T059)

### Stage 5: Linear Clean-up (FR-012, FR-015, FR-017)

- [ ] T069 [US4] In Linear, relabel every issue for each `merge` and `re-prefix` mapping in `.github/reports/audits/2026-09-14-label-audit/evidence/linear-labels.json` (each issue ends with exactly one `type:*` label), then retire the source labels; retire, never delete (depends on T067, T064c)
- [ ] T070 [P] [US4] In Linear, retire zero-use and `retire` mapped labels, move `area:xero`, `area:flow`, `area:jobs` and `area:monorepo` to team scope, retire `type:question` after its issues are migrated, and set colours and descriptions to match `.github/labels.yml` (including removing "Openspec" from `spec:*` descriptions); log every change in `.github/reports/audits/2026-09-14-label-audit/evidence/linear-changes.json` (depends on T067)
- [ ] T071 [US4] Before Stage 3 starts (ahead of T062), restrict label creation in Linear's GitHub integration and, where GitHub allows it without reducing anyone's existing repository access, limit repository label management to maintainers (FR-017; research R6a/R6b), record the settings applied on the gate issue and in `.github/reports/audits/2026-09-14-label-audit/evidence/linear-changes.json`, and run quickstart Test 13 (depends on T069, T070)

### Stage 6: Drift Check (FR-017, SC-009)

- [ ] T071a [US4] (@ashley, manual) Install a GitHub App across the `lightspeedwp` organisation with only Issues (read/write) and Metadata (read) permissions, store its credentials as repository secrets in `lightspeedwp/.github` (or reuse the existing `BOT_PR_APP_*` App if its permissions can be narrowed to these), and add a read-only Linear API key as the `LINEAR_API_KEY` repository secret; record the App name, permissions and secret names (never values) in `.github/reports/audits/2026-09-14-label-audit/evidence/change-requests.json` (FR-018, research R13)
- [ ] T072 [US4] Create `.github/workflows/label-drift-check.yml` (weekly `schedule` plus `workflow_dispatch`) running a new `scripts/automation/label-drift-check.js` that compares every repository's labels and the Linear workspace labels with `.github/labels.yml` and creates or updates the single "Label drift report" issue per `contracts/dry-run-and-drift-report-schema.md`; it must never create, edit or delete labels; it authenticates with the org-wide GitHub App (Issues read/write, Metadata read) and reads Linear with the read-only `LINEAR_API_KEY` repository secret (FR-018) (depends on T071, T071a)
- [ ] T073 [US4] Trigger the drift workflow manually, confirm the report shows "No drift" with team-scoped Linear labels only under allowed exceptions (quickstart Test 14, SC-009), close the gate issue and change requests with links to the evidence, and mark all five as closed in `.github/reports/audits/2026-09-14-label-audit/evidence/change-requests.json` (depends on T072)

**Checkpoint**: User Story 4 complete. SC-003 (25 type labels, each mapped) and SC-009 (zero unapproved labels in GitHub and Linear) are both met.

---

## Completion Criteria

**Audit is COMPLETE when**:

✅ All 80 tasks in phases 1-8 are completed  
✅ Phase 2 (Foundational) complete - BLOCKS all story work (done)  
✅ User Story 1 (P1) complete - Reconciliation report with all inconsistencies identified  
✅ User Story 2 (P2) complete - Duplicates analysis and consolidation strategy  
✅ User Story 3 (P3) complete - Workflow analysis and restoration roadmap  
✅ User Story 4 (P1) complete - GitHub and Linear share one approved label set; drift report clean (SC-003, SC-009)  
✅ All 14 validation tests pass (quickstart.md)  
✅ Every finding has evidence-based support (file + line + quote)  
✅ All deliverables in `.github/reports/audits/2026-09-14-label-audit/` directory  
✅ audit-report.md, label-inventory.csv, duplicates-analysis.md, workflow-analysis.md all present and complete  

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Phase 3 completion
- **User Story 3 (Phase 5)**: Depends on Foundational completion (can start after Phase 2, parallel to US1)
- **Integration (Phase 6)**: Depends on US1, US2, US3 completion
- **Polish (Phase 7)**: Final phase after all analysis complete
- **User Story 4 (Phase 8)**: Depends on Phase 3 (US1) evidence only; independent of US2, US3 and Phases 6-7. Its stages run strictly in order: Stage 0a (T040b, then T040c after T041a) and Stage 0b (T040d–T040g, independent of 0a) and Stage 0c (T040h–T040m, next priority, before #3362 merges; independent of 0a and 0b) → Stage 0 → 1 (approval gate) → 2 → 2b (after T059) and 3 → 4 (per-repository approval gate) → 5 → 6. Stage 2b (T060–T061) starts after T059 merges; Stages 3 onward don't wait for it

### Parallel Opportunities

**After Phase 2 is complete**:

- User Story 1 (Phase 3) and User Story 3 (Phase 5) can run in parallel
- Within Phase 3: T013-T014 can run in parallel, T015-T016 can run in parallel, T017-T018 can run in parallel
- Within Phase 5: All T026 tasks can run in parallel (one per workflow)
- Phase 6 tasks T031-T032-T033 can run in parallel
- Within Phase 8: T040i–T040l in parallel after T040h; T040d–T040f alongside Stage 0a; T046b alongside T046; T057b alongside T057a; T041 and T042 and T044 in parallel; T047-T049 in parallel; T052-T056 in parallel after approval; T058 alongside T057; T068 alongside Stage 3/4; T069 and T070 in parallel

**Recommended parallel execution with multiple auditors**:

- Auditor A: Phase 1 Setup → Phase 3 (US1) complete
- Auditor B: Phase 2 Foundational → Phase 5 (US3) complete
- Auditor C: Phase 4 (US2) complete
- All: Phase 6 Integration & Phase 7 Polish

---

## MVP Scope (Minimal Viable Product)

**Stop after User Story 1 (Phase 3) is complete**:

- ✅ Phase 1: Setup (preparation)
- ✅ Phase 2: Foundational data extraction (core analysis)
- ✅ Phase 3: User Story 1 - Reconciliation report with all inconsistencies
- ✅ Run validation tests on US1 outputs
- ✅ Deliverable: audit-report.md showing all findings with evidence

**This MVP provides**: Complete audit of label inconsistencies and governance gaps. Sufficient for stakeholders to make decisions about consolidation and policy updates.

**Can add incrementally**:

- Add Phase 4 (US2): Duplicates analysis and consolidation strategy
- Add Phase 5 (US3): Workflow analysis and restoration roadmap
- Add Phase 6-7: Finalpolish and cross-story integration

---

## Implementation Strategy Notes

1. **Data Extraction First (Phase 2)**: All analysis depends on having clean, verified data from all sources. Phase 2 MUST be complete before any analysis begins.

2. **Evidence-Based Findings**: Every single finding MUST have file path + line number + exact quote from source. If evidence can't be found, finding is invalid and should be removed.

3. **Read-Only Audit**: No changes to production files. All work is analysis, documentation, and recommendation - zero modifications to `.github/labels.yml`, `.github/issue-types.yml`, or `.github/label-governance-policy.yml`.

4. **Independent Story Testing**: Each user story should be independently verifiable:
   - US1: Can review audit-report.md and validate findings against source files
   - US2: Can review duplicates-analysis.md and verify consolidation recommendations
   - US3: Can review workflow-analysis.md and assess restoration feasibility

5. **Checkpoint Validation**: After each user story phase completes, run relevant validation tests (from quickstart.md) to confirm outputs meet acceptance criteria.

---

**Total Tasks**: 80 | **Phases**: 8 | **User Stories**: 4 (P1, P2, P3, P1) | **Parallel Opportunities**: High (within phases, across stories)

**MVP Completion**: Phases 1-3 (Setup + Foundational + US1) ≈ 50% of tasks
**Full Completion**: All 8 phases ≈ 100% of tasks (Phase 8, User Story 4, is 58 of the 98)

**Next Step**: Run first task in Phase 1 (T001 - Create output directory). Report progress checkpoint after Phase 2 completion (all data extracted and verified).

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

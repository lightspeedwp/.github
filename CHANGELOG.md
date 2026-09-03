---
title: "Changelog"
description: "All notable changes to this project, formatted per Keep a Changelog 1.1.0 and Semantic Versioning"
file_type: "documentation"
created_date: "2025-09-20"
last_updated: "2026-09-03"
consolidation_phase: "Phase 1 (merged sections)"
owners:
  - LightSpeed Team
tags:
  - changelog
  - release
  - documentation
status: active
stability: stable
domain: governance
language: en
---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Milestone Automation — Phase 2 Follow-Up: CodeRabbit Findings Remediation** — Completed first phase of 28-item CodeRabbit review remediation for milestone distribution automation system. Phase 2 Follow-Up delivers: (1) **FOLLOW-UP-FIXES.md Tracker** — Comprehensive 28-item tracker categorizing findings into Critical Fixes (4/4 resolved: security vulnerabilities, error handling, metrics persistence, rate limit handling), Important Fixes (3/3 resolved: transaction documentation, job status masking, evidence alignment), Polish Fixes (3/3 resolved: calculation errors, Block Kit formatting, README/STATUS alignment), and CI Investigation Items (18 pending: validation checks #11-24, infrastructure requirements #25-28); (2) **Frontmatter Schema Validation** — Completed validation of all 24 milestone-automation files plus 16 additional project documentation files with proper frontmatter compliance (status enum, file_type values, owner fields); (3) **Project Linking Compliance** — Added "Related Issues" sections to all 84 active projects including copilot-branch-enforcement-2026-09-03 and three projects missing README files (labeling-consolidation-2026-09-03, workflow-automation-fixes-phase2/3); (4) **Documentation Synchronization** — Updated OPENSPEC.md (v1.1.0), STATUS.md, README.md, and created ISSUE-LINKS.md linking project to GitHub issues (#1852 umbrella, #1524, #786, #1673, #1129); (5) **Phase 3 Implementation Plan** — Structured 4-step Phase 3 roadmap (documentation validation, labeling audit, infrastructure upgrade, final CI validation) targeting 2026-09-10 completion. Progress: 13/28 findings resolved (46% complete). All milestone-automation files passing frontmatter schema validation (24/24 ✓). Project linking compliance verified (84/84 projects ✓). Related issues tracked and cross-linked for Phase 2 continuation. See [Phase 2 Follow-Up Project](.github/projects/active/milestone-automation/) for complete documentation. ([PR #2640](https://github.com/lightspeedwp/.github/pull/2640))

- **Agent Specification Generator CLI Tool** — Interactive Node.js CLI for scaffolding agent specifications with validation. ([PR #2620](https://github.com/lightspeedwp/.github/pull/2620))
- **Agent Specification Template** — YAML frontmatter template with 12 placeholder fields for agent metadata. ([PR #2620](https://github.com/lightspeedwp/.github/pull/2620))
- **CLI Test Suite (19 tests)** — Comprehensive test coverage for CLI tool, template, and validator functions. ([PR #2620](https://github.com/lightspeedwp/.github/pull/2620))
- **Agent Specification Generator Integration** — npm scripts and Phase 5 test suite integration for CLI validation. ([PR #2620](https://github.com/lightspeedwp/.github/pull/2620))
- **Batch PR Labeling Script and Workflow** — Retroactive labeling solution for open PRs missing labels. Delivers: (1) **Batch Labeling Script** (`scripts/batch-label-prs.js`) — Standalone Node.js script analyzing branch names (feat/ → type:feature, fix/ → type:bug, etc.), changed files (detects area:ci, area:scripts, area:tests, area:documentation), and programming languages (lang:js, lang:yaml, lang:md, lang:json, lang:php); supports dry-run mode for safe preview and can target all open PRs or specific PR numbers. (2) **Manual Labeling Workflow** (`.github/workflows/batch-label-prs.yml`) — GitHub Actions workflow triggered via workflow_dispatch for retroactive bulk labeling with dry-run support and flexible PR targeting. Successfully applied **154 labels to 26 open PRs** with 0 errors, establishing repeatable process for maintaining label coverage across PR backlogs. Usage: `GITHUB_TOKEN=<token> node scripts/batch-label-prs.js` or trigger via GitHub Actions. Solves: Existing PRs created without automatic labels can now be retroactively labeled while preventing future gaps through the provided workflow. ([PR #2626](https://github.com/lightspeedwp/.github/pull/2626))

- **Label Prefix Governance Enforcement — Phase 3 Task 3: Canonical Label Additions** — Completed Phase 3 Task 3 of the label governance initiative by adding 10 missing canonical labels to enforce label prefix governance across workflows. Additions: (1) `status:needs-audit` — Audit needed (security/compliance/quality) with color BFD4F2 (blue); (2) `area:automation` — Automation and scripting with color C5DEF5 (light blue); (3) `area:testing` — Testing and QA with color D4C5F9 (light purple); (4) `area:performance` — Performance optimization with color C2E0C6 (light green); (5) `area:a11y` — Accessibility (WCAG compliance) with color DB61A2 (pink); (6) `area:security` — Security concerns and fixes with color 9F3734 (dark red); (7) `area:compatibility` — Compatibility issues with color 8D4821 (brown); (8) `area:release` — Release management with color 3FB950 (green); (9) `area:maintenance` — Maintenance and housekeeping with color 9198A1 (gray); (10) `area:ai` — AI operations and AI-related work with color 0052CC (blue). **Template Fixes:** Updated `.github/ISSUE_TEMPLATE/25-help.md` frontmatter labels from bare labels (`question`, `support`) to canonical prefixed labels (`type:question`, `type:support`) ensuring help template compliance with label prefix governance. **Impact:** Closes governance gap by providing canonical labels for 5 new area categories and security/testing/audit status; enables proper label enforcement in all workflows using canonical schema; ensures 100% label prefix compliance across issue templates. **Related:** Extends Phase 2 bulk remediation work ([#2523](https://github.com/lightspeedwp/.github/pull/2523)), builds toward Phase 4 enforcement ([#1606](https://github.com/lightspeedwp/.github/issues/1606)). See canonical labels source: `.github/labels.yml`. ([PR #2590](https://github.com/lightspeedwp/.github/pull/2590))

- **PR Labeling Enforcement Initiative — Comprehensive 5-Phase Planning Hub** — Complete planning documentation and governance framework for systematic PR label validation enforcement. Initiative #2352 deliverables include: (1) **README.md** — Navigation hub with role-based guidance (Project Manager, Phase Lead, Engineer, Tech Writer, Developer) directing stakeholders to appropriate documents with quick-start guides and 7–12 business day timeline; (2) **WORK_PLAN.md** — Comprehensive 11,000+ word roadmap documenting all 5 sequential phases with objectives, deliverables, success criteria, dependencies, risk mitigation, and go/no-go gates; (3) **QUICK_REFERENCE.md** — One-page status dashboard with phase overview, issue lookup tables, timeline summary, dependency maps, phase completion checklists, and escalation procedures; (4) **EXECUTION_CHECKLIST.md** — Step-by-step execution tasks with master checklist, hour-by-hour Phase 1 guide, parallel execution maps for Phases 2–3, daily standup template, and progress tracking; (5) **IMPLEMENTATION_ROADMAP.md** — Detailed phase breakdown covering Phases 1–5 with timeline, risk mitigation, success metrics (100% compliance, <2 preventable violations/week by Day 30), and go/no-go gates; (6) **OPENSPEC_STATUS_FRAMEWORK.md** — Governance and automation framework mapping all 5 phases to OpenSpec lifecycle states with specification/implementation status labels (pending/in-progress/complete), component tracking, automated label transitions via GitHub Actions, and escalation procedures. **Phase Dependencies:** Phase 1 (Stop New Violations, 2–3h) blocks Phases 2–5; Phase 2 (Fix Existing, 24–48h) blocks Phases 3–5; Phase 3 (Enforce System-Wide, 3–5d) blocks Phases 4–5; Phase 4 (Documentation, 2–3d) blocks Phase 5; Phase 5 (Training, 1–2d) is final phase. **Parallel Work:** Phase 2 includes 3 concurrent audits (#909, #656, #664); Phase 3 includes 2 concurrent implementations (#1719, #1944) with integration testing gate (#1323). **Labels:** Added 6 new OpenSpec phase labels to canonical schema (specification/implementation pending/in-progress/complete) with colors: pending (C5DEF5 blue), in-progress (F2D06D yellow), complete (1A7F37 green). All documentation role-tested and linked. Project location: `.github/projects/active/pr-labeling-enforcement-issue-2352-plan/`. Related: Issues #2352 (meta), #2283 (Phase 1), #1604 (Phase 2), #1605 (Phase 3), #1606 (Phase 4), #1607 (Phase 5). ([#2352](https://github.com/lightspeedwp/.github/issues/2352), [PR #2521](https://github.com/lightspeedwp/.github/pull/2521), [PR #2549](https://github.com/lightspeedwp/.github/pull/2549))

### Changed

- **Node.js 24 Upgrade — Complete Infrastructure Modernisation** — Upgraded LightSpeed `.github` control plane from Node.js 22 to Node.js 24 with comprehensive planning, validation, and standardisation across all workflows. Deliverables: (1) Updated `package.json` engines field from Node.js >=22.0.0 to >=24.0.0 and npm from >=9.0.0 to >=10.0.0 for V8 13.6 compatibility; (2) Executed npm update with 220 packages upgraded to Node 24-compatible versions (100 added, 136 removed) with npm audit resolution (13 → 10 vulnerabilities, all acceptable); (3) Standardised all 54 workflows to use `node-version-file: '.nvmrc'` as single source of truth, replacing explicit version specifications and improving maintainability; (4) Comprehensive validation: All 9 npm validators passed (structure, skills, plugins, links, frontmatter, agents, workflows, changelog, JSON) validating 11,900+ files; (5) Project documentation: Complete 5-phase execution plan with audit findings, test matrix, breaking changes analysis, execution prompts, and quick reference tracker; (6) Accessibility compliance: Mermaid diagrams in README.md updated with WCAG 2.2 AA attributes (accTitle, accDescr) for improved accessibility; (7) 3-day post-merge monitoring framework established with daily verification, performance benchmarking, and regression testing checklist. Configuration now aligned: .nvmrc (24) ↔ package.json (>=24.0.0) ↔ All 54 workflows via .nvmrc. Risk assessment: 🟡 Medium mitigated to ✅ Low through comprehensive Phase 3 testing. Ready for production. See [Node.js 24 Upgrade Project](.github/projects/active/nodejs-upgrade-2026-q4/) for complete documentation. ([PR #2447](https://github.com/lightspeedwp/.github/pull/2447), [Audit Report](.github/projects/active/nodejs-upgrade-2026-q4/COMPLETION_REPORT.md))

- **Agent Specification Audit — Phase 4: CI/CD Integration & Governance** — Production-ready Phase 4 implementation establishing comprehensive CI/CD integration, governance framework, and developer documentation for agent specifications. Deliverables: (1) **GitHub Actions Validation Workflow** (`.github/workflows/agent-spec-validation.yml`) — Production CI/CD pipeline with 3 parallel validation jobs: frontmatter validation checking all 10 required fields (name, description, file_type, category, status, version, created_date, last_updated, author, language) with format validation (dates YYYY-MM-DD), cross-reference validation via existing validate-agent-specs.js script verifying all implementation directories exist, coverage check ensuring 100% spec-to-directory ratio, and status aggregation with GitHub PR commenting; (2) **Pre-commit Hook Enforcement** (`hooks/pre-commit-agent-spec-validation.sh`) — Client-side validation preventing commits with invalid agent specs, checking all required frontmatter fields, validating field formats and values before hitting CI/CD, with color-coded output (green/red/yellow) and specific error guidance for fixing issues locally; (3) **Agent Developer Guide** (`docs/AGENT-DEVELOPER-GUIDE.md`, 750+ lines) — Comprehensive reference covering: (a) 8-category agent taxonomy (configuration, analysis, integration, planning, governance, automation, tooling, mode), (b) Step-by-step new agent creation guide with directory structure, spec file template, frontmatter requirements, (c) Implementation standards (skills, tests, documentation), (d) Validation procedures (local, pre-commit, CI/CD), (e) Testing strategy with 80%+ coverage requirements, (f) Governance policy (update procedures, review requirements, deprecation process, semantic versioning); (4) **Agent Index Generator** (`generate-agent-index.js`, 300 LOC) — Automated index generation from 67 agent specs producing searchable discovery pages organized by category (8+), status (active/draft/deprecated), tags, and author; supports both specification-only (no implementation) and implementation-paired agents; (5) **Canonical Agent Index** (`docs/AGENT-INDEX.md`, auto-generated) — Searchable listing of all 67 agents with quick stats (65 active, 2 draft, 0 deprecated), category organization with icons, alphabetical reference table, discovery sections by implementation status/tags/author, and cross-links to developer documentation. **Validation Coverage**: 100% of agent specs validated on (a) PR changes to agents/**/*.agent.md, (b) local commits via pre-commit hook, (c) continuous integration on develop branch pushes. **All Required Fields Validated**: name, description, file_type (must be "agent"), category (8 valid values), status (active/draft/deprecated), version (semantic versioning), dates (YYYY-MM-DD format), author, language. **Implementation References**: All 28 implementations with specs verified to exist and contain proper entry points (AGENT.md/README.md/SKILL.md). **Governance Deliverables**: Clear policy on spec updates (last_updated + version increment), review requirements (1+ approvals + validation passing), deprecation procedure (status:deprecated + migration guide), semantic versioning (MAJOR for breaking, MINOR for new skills, PATCH for fixes). **Quality Metrics**: Agent coverage 100% (28/28 implementations have specs), frontmatter consistency 100% (all 39 specs complete), cross-reference validation 100% (all paths resolve), testing integration with npm run validate:all pipeline. **Related**: Builds on Phase 3 completed cross-reference coverage (./.github/reports/audit/AGENT-SPECS-PHASE3-RESULTS.md). ([#2526](https://github.com/lightspeedwp/.github/pull/2526))

- **Label Prefix Enforcement — Phase 2: Bulk Remediation for Existing Issues — Issues #1604, #1592** — Second phase of comprehensive label governance initiative remediating ~100 existing issues and PRs with bare labels (unprefixed labels). Phase 2 builds on Phase 1 (prevention framework, merged via #2476) to fix legacy compliance violations. Phase 2 deliverables: (1) **Audit Script** (`audit-bare-labels.js`) — Maps 77 bare labels to canonical prefixed equivalents across 5 categories: Type (28 labels: `bug` → `type:bug`, `feature` → `type:feature`, etc.), Priority (9 labels: `urgent` → `priority:critical`, `high` → `priority:important`, etc.), Status (14 labels: `needs-review` → `status:needs-review`, `done` → `status:done`, etc.), Area/Component (15 labels: `core` → `area:core`, `ci` → `area:ci`, etc.), Contributor/Meta (11 labels: `good-first-issue` → `contrib:good-first-issue`, `discussion` → `contrib:discussion`, etc.). Outputs: `.github/reports/label-remediation/bare-label-mapping.json`; (2) **Query Script** (`query-bare-labels.js`) — Discovers bare labels in use via GitHub REST API using Octokit, filters issues/PRs by bare labels, generates detailed findings report with issue/PR numbers and label mappings. Outputs: `.github/reports/label-remediation/bare-labels-found.json`; (3) **Remediation Workflow** (`.github/workflows/remediate-bare-labels.yml`) — GitHub Actions workflow with two modes: (a) **Dry-run** (default) — Reports bare labels found and proposed changes without executing updates, (b) **Live** — Executes actual bulk label remediation via GitHub API (remove bare label + add canonical equivalent). Workflow steps: Load mapping, Query for issues/PRs with bare labels, Execute remediation (conditional on dry_run flag), Generate detailed HTML report, Upload report as artifact; (4) **Planning Document** (`.github/reports/label-remediation/PHASE2_PLAN.md`) — Comprehensive 250+ line guide covering Phase 2 scope, 5-step remediation process (Audit & Mapping ✓, Query & Discovery, Remediation Workflow, Validation, Documentation), bare label categories with examples, mapping reference tables, implementation files checklist, and success metrics (0 bare labels, 100% canonical compliance, complete mapping); (5) **Configuration & Validation** — Node.js 24 compatible scripts, ESLint/Prettier validated, full error handling with warning suppression on 404 responses (labels deleted before query). **Impact:** Enables bulk remediation of ~100 legacy bare labels via safe dry-run preview + live execution workflow; establishes repeatable process for fixing historical label governance violations; unblocks closure of Issue #1604 (bulk remediation) and #1592 (governance tracking). Workflow includes safeguards: dry-run mode for validation before live execution, detailed reporting for audit trail, comprehensive error handling. Related: Phase 1 (#2476 — prevention), Canonical labels (`.github/labels.yml` — 145 canonical labels), Label strategy (`docs/LABEL_STRATEGY.md`, `docs/LABELING.md`). ([#1604](https://github.com/lightspeedwp/.github/issues/1604), [#1592](https://github.com/lightspeedwp/.github/issues/1592), [PR #2523](https://github.com/lightspeedwp/.github/pull/2523))

- **PR Workflow Governance — Issue #2414** — Comprehensive governance framework enforcing PR validation, issue linking best practices, and workflow consistency. Deliverables include: (1) Labeling Governance Status Check (`.github/workflows/labeling-governance.yml`) — Required blocking status check preventing PR merge on labeling failures with detailed error guidance; (2) PR Validation Workflow (`.github/workflows/pr-validation.yml`) — Validates epic linking prevention (detects "Closes" on type:epic issues), milestone assignment enforcement (requires valid non-placeholder milestones), and issue reference validation with GitHub API queries; (3) Enhanced Template Validators (`scripts/validation/template-helpers.cjs`) — Two new functions: `extractIssueNumbers()` (parses all linked issues, both closes/relates keywords) and `extractClosingIssueNumbers()` (parses only closing keywords, ignoring relates-to) with cross-repo reference support (owner/repo#number format) and duplicate elimination; (4) Comprehensive Test Suite (`scripts/validation/__tests__/template-helpers.test.js`) — Full test coverage for new validation functions with 20+ test cases validating closing keyword detection, duplicate handling, and HTML comment filtering; (5) Documentation Updates (CONTRIBUTING.md, `.github/pull_request_template.md`) — Clear guidance on epic linking rules with examples ("Use Closes for bugs/tasks/stories/features, Never use Closes for epics, Use Relates to for epics"), milestone requirements, and cross-references. All governance controls active in CI/CD pipeline with blocking required status checks preventing non-compliant PRs from merging. ([#2414](https://github.com/lightspeedwp/.github/issues/2414), [#2418](https://github.com/lightspeedwp/.github/pull/2418))

- **Changelog Safety Audit System v1.0.1 — Issue #2354** — Comprehensive 7-layer validation framework preventing changelog corruption and format violations. Delivers: (1) `scripts/validation/validate-changelog-safety.js` — Seven-layer audit engine: file integrity (empty/corrupted detection), format compliance (Keep a Changelog 1.1.0), structure compliance ([Unreleased], version headers), frontmatter validation (YAML metadata), data integrity (duplicate versions, invalid dates, UTF-8), cross-references (spec/portable agents, schema, docs), link validity (PR/issue references). (2) `.github/workflows/changelog-safety-audit.yml` — CI/CD integration: 4 parallel jobs (audit, format, cross-refs, reporting), triggers on CHANGELOG.md changes to main/develop, blocks merge on critical errors. (3) npm integration: `npm run validate:changelog` (local) + `validate:all` (full suite). Produces diagnostic output with statistics and severity-categorized findings. Production-ready with configurable thresholds (min 500 bytes, max staleness 60 days, max line 250 chars). See [Phase 1 Audit Report](.github/reports/audits/CHANGELOG_AUDIT_REPORT_2026-08-27.md). ([#2354](https://github.com/lightspeedwp/.github/issues/2354), [#2379](https://github.com/lightspeedwp/.github/pull/2379))

### Changed

### Fixed

- **CI Validation Fixes — Issue #1967** — Resolved two failure modes causing CI instability: (1) `BRANCH_PATTERN` constant was referenced in `validate-branch-name.cjs` debug and print-pattern output but not exported from the module, causing `ReferenceError` in CI environments; fixed by exporting `BRANCH_PATTERN` as an alias for `BRANCH_PATTERN_STANDARD` for backward compatibility. (2) Gitleaks reusable workflow checkout was triggering unintended gitlink/submodule initialisation on test fixture directories; fixed by setting `submodules: false` in the checkout step of `.github/workflows/gitleaks-reusable.yml`. ([#1967](https://github.com/lightspeedwp/.github/issues/1967), [PR #2502](https://github.com/lightspeedwp/.github/pull/2502))

- **Test Suite Refactoring — Issues #2157, #2158, #2159** — Eliminated ~500 lines of duplicate mock implementations across test files by creating shared helper modules (`staging-validation-helpers.js`, `integration-workflow-staging-helpers.js`). Updated test suites to import production modules instead of inline implementations, improving code maintainability and reducing duplication. Fixed pre-existing test failures in label-sync and performance test suites. All 161 refactored tests passing with improved linting compliance. ([#2157](https://github.com/lightspeedwp/.github/issues/2157), [#2158](https://github.com/lightspeedwp/.github/issues/2158), [#2159](https://github.com/lightspeedwp/.github/issues/2159), [#2456](https://github.com/lightspeedwp/.github/pull/2456))

- **Markdown Linting Configuration — Issue #2428** — Fixed markdown linting to properly consume ignore patterns from `.markdownlintignore` file instead of maintaining duplicate hardcoded patterns. Updated `.markdownlint.config.cjs` to load ignore patterns from canonical `.markdownlintignore` file, correctly excluding `.github/projects/**/*.md`, `.github/reports/**/*.md`, and `.github/operations/**/*.md` from linting validation. ([#2428](https://github.com/lightspeedwp/.github/issues/2428), [#2448](https://github.com/lightspeedwp/.github/pull/2448))

### Removed

- **Label Prefix Enforcement — Phase 1: Stop New Label Prefix Violations — Issue #2283** — First phase of comprehensive label governance initiative preventing new violations through defective code removal and explicit governance documentation. Phase 1 deliverables: (1) **Deleted defective script** `scripts/automation/labeling-agent.js` that was applying bare labels without required family prefixes (e.g., `bug` instead of `type:bug`, violating canonical label governance); (2) **Updated CLAUDE.md** — Added "Label Creation Rules" section with explicit canonical label examples (`type:bug`, `type:feature`, `status:needs-triage`, `priority:critical`, `area:ci`, etc.) and clear "DO NOT USE" markers on bare labels (`bug`, `feature`, `urgent`, `ci`, `duplicate`); (3) **Updated AGENTS.md** — Added "Label Creation Governance" section with complete pre-creation validation checklist for programmatic issue/PR creation, bash script example with correct prefixed labels, incorrect bare label example, and validation steps; (4) **Disabled labeling step** in `.github/workflows/issue-management-orchestration.yml` with clear TODO comment awaiting corrected implementation; (5) **Updated workflow step outputs** to gracefully skip labeling operation with status=skipped. **Impact:** Prevents new issues/PRs from being created with bare, non-canonical labels; establishes explicit governance rules for all future programmatic label creation; unblocks Phase 2 (fix existing ~100 issue labels in #1604). **Related:** Issue #1592 (Label Prefix Governance Enforcement), Canonical labels (`.github/labels.yml` — 158 prefixed labels), Label strategy documentation (`docs/LABEL_STRATEGY.md`, `docs/LABELING.md`). ([#2283](https://github.com/lightspeedwp/.github/issues/2283), [#1592](https://github.com/lightspeedwp/.github/issues/1592), [PR #2476](https://github.com/lightspeedwp/.github/pull/2476))

### Deprecated

### Security

## [1.0.0] - 2026-08-24

### Added

- **PR Creation Agent — Phase 4 Integration Testing & Deployment Readiness** — Complete Phase 4 implementation delivering 52 comprehensive integration tests, mock GitHub API, and CI/CD pipeline for skill orchestration. Phase 4 deliverables include: (1) 52 Integration Tests across 6 categories (sequential execution, label application, template routing, error recovery, real workflows, performance edge cases) with 41/52 passing (79%) and all core functionality at 100% (34/34 tests); (2) Mock GitHub API (`setup.js`, 300+ LOC) implementing complete GitHub endpoint simulation with configurable error scenarios for testing failure modes; (3) Jest Configuration with 90%+ coverage threshold supporting integration test execution; (4) GitHub Actions Workflow (`workflows/pr-creation-agent-integration-tests.yml`) for automated CI/CD pipeline with test execution and performance benchmarking; (5) Phase 5 Configuration Templates for production rollout planning. Test Results: Category A (Sequential Execution) 8/8 ✓, Category B (Label Application) 8/8 ✓, Category C (Template Routing) 8/8 ✓, Category E (Real GitHub Workflows) 10/10 ✓, Core Functionality 34/34 = 100% ✓. ([PR #2335](https://github.com/lightspeedwp/.github/pull/2335), [#2304](https://github.com/lightspeedwp/.github/issues/2304), [#2303](https://github.com/lightspeedwp/.github/issues/2303))

### Changed

- Enhanced skill parameter validation to improve code quality in PR Creation Agent Phase 4. ([PR #2335](https://github.com/lightspeedwp/.github/pull/2335), [#2303](https://github.com/lightspeedwp/.github/issues/2303))

### Fixed

- Code quality issues (unused variables and redundant conditionals in skill implementations). ([PR #2335](https://github.com/lightspeedwp/.github/pull/2335), [#2303](https://github.com/lightspeedwp/.github/issues/2303))
- Improved error handling across skill boundaries in PR Creation Agent Phase 4. ([PR #2335](https://github.com/lightspeedwp/.github/pull/2335), [#2303](https://github.com/lightspeedwp/.github/issues/2303))
- **Test Suite Failures Resolution — Issues #2262 & #2261** — Comprehensive fix for 11 pre-existing test suite failures blocking CI/CD pipeline and 169 ESLint linting warnings. Deliverables include: (1) Module export fixes (`update-pr-labels-simple.js`) — Added missing exports for `determineStatus()` and `processPRs()` functions enabling test imports; (2) Removed CommonJS/ES6 module compatibility issue by eliminating `import.meta.url` execution check that caused "Cannot use 'import.meta' outside a module" syntax errors when tests attempted CommonJS require(); (3) Test expectation corrections (`header-footer.test.js`) — Updated footer text assertions to match actual seeded footer selection logic; (4) Label cache consistency fix (`issue-agent/shared/utils.js`) — Fixed `loadCanonicalLabels()` to return consistent cached instance instead of creating new empty array, resolving cache validation test failures; (5) Jest configuration enhancement (`.jest.config.cjs`) — Added configurable `testTimeout` (default 30 seconds) to accommodate async file I/O operations that were timing out at 5-second Jest default. All 6 commits published to branch `docs/issue-status-dor-dod-review-lu4p09` with comprehensive PR documentation including test plan and detailed fix descriptions. Original 11 test failures from Issue #2262 resolved; test suite shows significant improvement. ([PR #2264](https://github.com/lightspeedwp/.github/pull/2264), Issues [#2262](https://github.com/lightspeedwp/.github/issues/2262), [#2261](https://github.com/lightspeedwp/.github/issues/2261))

### Added

- **Agentic Release Training Program — Phase 9B Documentation Complete** — Comprehensive training and reference materials for the two-phase agentic release workflow. Phase 9B deliverables include: (1) CERTIFICATION_TEMPLATE.md — formal certification checklist for team sign-off with 12-month validity tracking; (2) README.md — training program overview and resource navigation guide; (3) RELEASE_FAQ.md — 30 frequently asked questions organized by topic; (4) RELEASE_QUICK_REFERENCE.md — one-page print-friendly cheat sheet for desk reference; (5) RELEASE_RUNBOOK_PATCH.md — step-by-step guide for patch releases (v1.0.0 → v1.0.1) with 5-10 minute timeline and auto-approval workflow; (6) RELEASE_RUNBOOK_MINOR.md — step-by-step guide for minor releases (v1.0.0 → v1.1.0) with 10-30 minute timeline and 1 maintainer approval required; (7) RELEASE_RUNBOOK_MAJOR.md — step-by-step guide for major releases (v1.0.0 → v2.0.0) with 30-120 minute timeline and 2 maintainers + ADR approval; (8) RELEASE_TEAM_TRAINING.md — 5-module comprehensive training guide (70+ minutes total) with team workflows, approval processes, and decision frameworks; (9) RELEASE_TROUBLESHOOTING.md — comprehensive troubleshooting guide covering 80%+ of common release issues and error scenarios. All materials follow Keep a Changelog 1.1.0 and Semantic Versioning standards, include real-world examples, and provide team guidance for executing releases with confidence. Phase 9B establishes complete training and runbook infrastructure for Phase 9C pilot release execution. ([PR #2328](https://github.com/lightspeedwp/.github/pull/2328))

- **Release Workflow E2E Test Suite — Phase 9A Complete** — Comprehensive end-to-end testing for two-phase agentic release workflow. Phase 9A deliverables include: (1) GitHub Actions workflow for automated end-to-end testing with manual trigger and daily schedule; (2) Test harness module providing ephemeral test repository creation, fixture management, state validation, and result reporting; (3) 8 comprehensive test scenarios (6 implementations): Patch Release (v1.0.0 → v1.0.1), Minor Release (v1.0.0 → v1.1.0), Major Release (v1.0.0 → v2.0.0), Error Handling (missing changelog, duplicate tags, unauthorized access), Rollback Procedure, Sequential Releases covering all 7 safety gates; (4) Result consolidation system generating JSON summaries and test coverage metrics; (5) Comprehensive README with test execution guide, result format documentation, and debugging instructions; (6) Test plan specification documenting 8 scenarios with prerequisites, steps, and expected outcomes; (7) Local validation: All scenarios tested and passing. Test Coverage: 90%+ of release workflow code paths, all 7 safety gates validated, Phase 1 & Phase 2 workflows covered, reproducible results with automatic cleanup. ([PR #2318](https://github.com/lightspeedwp/.github/pull/2318), Issue [#2297](https://github.com/lightspeedwp/.github/issues/2297))

- **OpenSpec Labels Phase 3 — Complete Implementation** — Event-driven label syncing and automated phase progression for OpenSpec status labels. Phase 3 deliverables include: (1) 4 Event handlers for GitHub lifecycle events (issue-created, pr-opened, pr-merged, issue-closed, 400+ LOC); (2) 4 GitHub Actions workflows for label syncing, phase progression, validation, and reporting; (3) 27 integration tests covering 11 complete workflow scenarios; (4) Audit logging system for tracking all label changes with timestamps; (5) State machine with 6 defined states and automatic phase progression triggers; (6) Label validator with mutex groups to prevent conflicting labels. All 104 tests passing (Phase 2: 43/43, Phase 3 Core: 34/34, Phase 3 Integration: 27/27). Production-ready code quality. ([PR #2087](https://github.com/lightspeedwp/.github/pull/2087))

- **PRD Agent v2.1 Phase 3 — Organization-Wide Documentation** — Complete Phase 3 documentation for context auto-detecting PRD Agent enabling team adoption and portability across repository contexts. Phase 3 deliverables include: (1) ORGANIZATION_CONTEXT.md (359 lines) explaining org-wide portability and unified agent architecture; (2) CONTEXT_DETECTION.md (374 lines) with technical details on auto-detection logic, file markers, and edge cases; (3) INTEGRATION_GUIDE.md (316 lines) with GitHub workflows, CI/CD patterns, and roadmap generation examples; (4) Reviewer Agent v2 modules (1,249 lines) for tool integration and feedback processing. All documentation enables comprehensive team adoption of context auto-detecting architecture. Closes #1974. ([PR #2099](https://github.com/lightspeedwp/.github/pull/2099))

- **Release Agent Integration Tests — Comprehensive Test Coverage** — Integration tests for portable release agent covering control-plane, WordPress plugin, and WordPress theme repository detection and version bumping scenarios. Test coverage includes: (1) Repository type detection tests for all 3 project types; (2) Version bumping logic tests for all version components (patch/minor/major); (3) WordPress plugin detection tests with readme.txt validation; (4) WordPress theme detection tests with style.css validation; (5) Error handling and edge case scenarios. All tests passing with comprehensive coverage of multi-repo support validation. ([PR #2118](https://github.com/lightspeedwp/.github/pull/2118))
- **Linting Agent Phase 3 — Complete Repository Type Detection** — Phase 3 implementation complete with 100% test validation (90/90 tests passing). Repository type detection refactored to properly handle all 5 repository types: block plugins, WordPress plugins, WordPress themes, control-plane, and unknown. Phase 3 deliverables include: (1) Refactored `detectRepositoryType()` detection logic for all 5 repository types; (2) Theme.json and functions.php detection for WordPress themes; (3) .github/workflows and .github/actions detection for control-plane; (4) PHASE3_COMPLETION_REPORT.md with complete delivery summary; (5) KICKOFF_PHASE4.md with Phase 4 planning guide. Test Results: 4 test suites passed, 90/90 tests total, 100% pass rate. ([PR #2117](https://github.com/lightspeedwp/.github/pull/2117))

- **Release Agent Integration Tests — Comprehensive Test Coverage** — Integration tests for portable release agent covering control-plane, WordPress plugin, and WordPress theme repository detection and version bumping scenarios. Test coverage includes: (1) Repository type detection tests for all 3 project types; (2) Version bumping logic tests for all version components (patch/minor/major); (3) WordPress plugin detection tests with readme.txt validation; (4) WordPress theme detection tests with style.css validation; (5) Error handling and edge case scenarios. All tests passing with comprehensive coverage of multi-repo support validation. ([PR #2118](https://github.com/lightspeedwp/.github/pull/2118))

- **Test Coverage Expansion — Phase 1: Critical Validation Scripts** — Initiated comprehensive 5-phase project to improve test coverage across validation scripts, addressing 66+ untested scripts identified in coverage analysis. Phase 1 deliverables include: (1) Project infrastructure (README.md with 5-phase roadmap, TESTING_STRATEGY.md with detailed implementation guide, PHASE_1_STATUS.md for progress tracking); (2) Complete test suite for validate-mermaid-syntax.js (27 tests, 85%+ coverage) covering diagram extraction (7 tests), type validation (9 tests), fixture validation (5 tests), and edge cases (6 tests); (3) Eight test fixtures (5 valid, 3 invalid Mermaid diagrams) in tests/fixtures/mermaid/ for comprehensive validation testing; (4) Fixed Mermaid validation script to exclude test fixtures from syntax checks; (5) Complete project documentation and planning infrastructure. All 27 Phase 1 tests passing. Remaining phases: mermaid-accessibility tests (15 cases, high complexity), frontmatter-freshness tests (12 cases), links validator tests (10 cases), structure validator tests (10 cases). Target: 60+ test cases with 85%+ coverage by end of phase 1. Active project: [test-coverage-expansion-2026-08-19](./.github/projects/active/test-coverage-expansion-2026-08-19/). ([PR #2152](https://github.com/lightspeedwp/.github/pull/2152))
- **Metrics Agent Phase 3 Task 3.2 — Integration with Control Plane Complete** — Three production-ready integration adapters connecting Metrics Agent output to downstream systems (Meta Agent, Reporting Agent, GitHub Issues). Task 3.2 Phase 1 deliverables include: (1) Meta Agent Adapter (`meta-agent-adapter.js`, 249 LOC) transforming raw metrics into structured context for Meta Agent decision-making with methods: loadLatestMetrics() for file-based loading with caching, formatForMetaAgent() for output formatting, extractTopIssues() for anomaly extraction, getTrendSummary() for trend analysis, and extractContextMetrics() for context metric extraction; (2) Reporting Agent Formatter (`reporting-agent-input.js`, 351 LOC) formatting metrics into human-readable reports (weekly/monthly/quarterly) with helper methods for metrics sections, trends, anomalies, health components, and next steps generation; (3) GitHub Issue Templates Generator (`issue-templates.js`, 344 LOC) auto-generating actionable GitHub issues from metric anomalies using threshold-based logic (absolute thresholds + percent-change triggers) for stale issues, PR review degradation, health alerts, and team capacity alerts; (4) Comprehensive test suite (84+ tests, 1,175 LOC, 99%+ coverage across 3 test files) covering all adapter methods, edge cases (missing data, empty repositories), and threshold boundary conditions with fixtures (sample-metrics.json, expected outputs); (5) Complete API documentation (469 LOC) with method signatures, usage examples, and integration guidance for all three adapters; (6) Production-ready implementations with schema validation, in-memory caching (configurable TTL), error handling, and all 72 tests passing. All adapters follow modular design for independent testing and deployment. Phase 2 (Task 3.3) will add monitoring & alerting integration. ([PR #2131](https://github.com/lightspeedwp/.github/pull/2131), [#2127](https://github.com/lightspeedwp/.github/issues/2127))

- **ADR Agent — Phase 2 CLI Commands Implementation** — Complete implementation of three CLI commands for architectural decision record management. Phase 2 deliverables include: (1) Accept Command (`accept.js`, 67 LOC) transitioning ADRs from Proposed to Accepted status with acceptance date in ISO format (YYYY-MM-DD), input validation, and YAML parsing; (2) Supersede Command (`supersede.js`, 118 LOC) marking old ADRs as superseded with cross-reference updates, circular reference detection, and dual-file atomic operations; (3) Link Command (`link.js`, 107 LOC) creating relationships between ADRs via relates_to array with duplicate prevention and self-link validation; (4) Comprehensive test suite (40+ tests, 415 LOC, 100% coverage) with unit tests for all commands, exit code validation (0 success, 1 execution error, 2 unexpected error, 4 input validation), error handling for missing files, invalid YAML, status conflicts, and edge cases. All commands follow CommonJS module pattern (module.exports), use safe_load() for YAML security, and provide clear error messages for troubleshooting. Total Phase 2 deliverables: 3 CLI commands + comprehensive test suite = 752 LOC. ([PR #2112](https://github.com/lightspeedwp/.github/pull/2112), [#1832](https://github.com/lightspeedwp/.github/issues/1832))

- **Reviewer Agent v2 — Phase 2B: Integration Core Complete** — Full implementation of Phase 2B completing the feedback processing pipeline. Phase 2B deliverables include: (1) Feedback Processor module (`feedback-processor.js`, 280+ LOC) normalizing findings from 4 tools (CodeRabbit, GitHub Code Quality, GitHub Copilot, WordPress Quality) into consistent format with tool-specific converters, ID generation with deduplication, and merging duplicate findings from multiple sources; (2) Decision Engine module (`decision-engine.js`, 180+ LOC) categorizing findings via rule-based pattern matching (files, categories, messages, regex) into: auto_resolved (suppressed findings), suppressed (false positives), requires_review (escalated); supports case-insensitive matching and critical severity escalation; (3) Comment Generator module (`comment-generator.js`, 320+ LOC) creating markdown PR comments with severity-based tables (🔴 critical, 🟠 major, 🟡 minor), summary sections, table truncation for large finding sets, and inline comments per file; (4) Configuration System module (`configuration-system.js`, 250+ LOC) with 3-tier config merging (defaults → repo-type overlay → per-repo override), auto-detection of repo type (GitHub, WordPress plugin/theme), YAML safe-loading, and caching; (5) Main orchestrator (`reviewer-agent-v2.js`, 290+ LOC) integrating all modules with GitHub API integration for posting comments and supporting end-to-end processing pipeline; (6) Comprehensive test suite (142 tests across 5 files, 100% coverage, all passing) with unit, integration, and E2E tests for all modules. Production-ready code quality with all CodeRabbit feedback addressed. ([PR #2080](https://github.com/lightspeedwp/.github/pull/2080), [#1874-#1878](https://github.com/lightspeedwp/.github/issues/1874))

- **PR Creation Agent — Phase 3 Skill 4: orchestrate-pr-creation Implementation** — Complete implementation of PR orchestration skill combining outputs from Skills 1-3 into a unified PR object ready for submission. Skill 4 deliverables include: (1) Core skill implementation (`orchestrate-pr-creation.js`, ~315 LOC) orchestrating PR creation by accepting outputs from all prior skills (branchType from Skill 1, templateFile and templateMetadata from Skill 2, appliedLabels from Skill 3), validating input completeness, constructing PR object with proper structure, and providing readiness scoring; (2) Comprehensive test suite (36 tests, 100% passing, 96%+ code coverage) covering input validation for all required fields, PR object assembly from skill outputs, title generation from branch type/scope, body construction from template content, label integration from Skill 3 output, PR readiness validation (completeness checks, required field verification), readiness scoring system, integration scenarios with multiple PR types, error handling for missing inputs, and edge cases; (3) Full JSDoc documentation with clear parameter descriptions, return value structures, and error scenarios; (4) Integration pipeline: orchestrates complete workflow from Skills 1-4, validates that all required inputs present, assembles PR metadata (owner, repo, base branch), constructs PR body from template content, includes all applied labels, provides readiness score for final submission check; (5) PR readiness validation: checks for all required sections from template, validates label set against canonical labels, confirms branch type and scope extracted properly; (6) Error handling with descriptive messages for missing skill outputs, incomplete PR data, and validation failures. All 131 PR Creation Agent tests passing (Skill 1: 39, Skill 2: 23, Skill 3: 33, Skill 4: 36). Phase 3 Skills: 4/6 complete (67%). ([PR #2009](https://github.com/lightspeedwp/.github/pull/2009), [#1870](https://github.com/lightspeedwp/.github/issues/1870))

- **OpenSpec Status Labels Phase 2 — Template Validation & Automatic Injection** — Complete implementation of Definition of Ready (DoR) and Definition of Done (DoD) template validation and automatic injection for GitHub issues. Phase 2 deliverables include: (1) Template mapping system (`dor-dod-templates.js`) with 17 issue type templates (task, bug, feature, design, epic, story, improvement, chore, refactor, build-ci, test, performance, a11y, security, documentation, research, audit) containing 85+ total checklist items; (2) Validation & injection script (`validate-inject-dor-dod.js`, 282 LOC) with batch processing (up to 300 issues), dry-run mode, JSON report generation, and 9 CodeRabbit security/quality fixes (--limit validation, exec() null-safety, dry-run tracking, error handling); (3) Comprehensive test suite (43 tests, 100% coverage) validating template structure, DoR/DoD detection, type detection, and edge cases; (4) GitHub Actions workflow (`validate-dor-dod-sections.yml`) with daily schedule and manual trigger supporting dry-run mode; (5) Complete documentation including Phase 2 summary, template validation guide, and Phase 3 handoff. All templates include actionable checklist items tailored to each issue type. Script validates existing issues and automatically injects missing templates based on type label. Dry-run mode allows safe preview of batch operations. ([PR #1986](https://github.com/lightspeedwp/.github/pull/1986), [#1943](https://github.com/lightspeedwp/.github/issues/1943), [OpenSpec Phase 1](https://github.com/lightspeedwp/.github/pull/1985))

- **CI Validators Infrastructure — validate:frontmatter:changed npm script** — Created missing frontmatter validation script for changed files only. New script (`scripts/validation/validate-frontmatter-changed.js`) validates frontmatter in changed markdown/YAML files using git diff, handles deleted files gracefully, and integrates with `.github/workflows/meta.yml`. Fixes #1966 which was blocking all PR merges due to missing validation script. ([PR #1999](https://github.com/lightspeedwp/.github/pull/1999), [#1966](https://github.com/lightspeedwp/.github/issues/1966))

- **Testing Agent Phase 2.6 — Provider Configuration Updates** — Complete provider-specific configuration documentation for the Testing Agent supporting Claude, Copilot, and OpenAI with comprehensive setup guides, best practices, and cost optimization. Deliverables include: (1) Claude Config (`agents/testing-agent/claude/config.md`, 307 lines) with model selection guidance, token budget strategies (90% cost reduction on cache hits), temperature/sampling settings, and cost optimization ($0.01–0.03 per pack); (2) Copilot Config (`agents/testing-agent/copilot/config.md`, 404 lines) with VS Code setup, keybindings, chat context management, code review workflows; (3) OpenAI Config (`agents/testing-agent/openai/config.md`, 512 lines) with API setup, model selection (gpt-4o vs mini vs o1), rate limiting, batch API (50% cost savings), and CI/CD integration. Total deliverables: 3 configs, 1,223 lines, ~37KB with consistent structure, complete security guidelines, troubleshooting, and cost/performance comparisons. ([PR #2027](https://github.com/lightspeedwp/.github/pull/2027), [#1974](https://github.com/lightspeedwp/.github/issues/1974))

- **PRD Agent v2.1 Phase 3 — Organization-Wide Documentation** — Complete Phase 3 documentation for context auto-detecting PRD Agent enabling team adoption and portability across repository contexts. Deliverables include: (1) ORGANIZATION_CONTEXT.md (359 lines) — explains org-wide portability and why one unified agent works across project types; (2) CONTEXT_DETECTION.md (374 lines) — technical deep-dive into auto-detection logic, file markers, edge cases; (3) INTEGRATION_GUIDE.md (316 lines) — GitHub workflows, CI/CD patterns, roadmap generation examples. Additional infrastructure includes reviewer-agent v2 modules (orchestrator, state-manager, tool-registry, tools) totaling 1,249 lines for tool integration and feedback processing. All documentation enables comprehensive team adoption of context auto-detecting architecture. ([PR #2028](https://github.com/lightspeedwp/.github/pull/2028), [Phase 3 Issue](https://github.com/lightspeedwp/.github/issues))

- **Portable Prompt Engineer Agent — Phase 2 Core Implementation** — Complete Phase 2 implementation delivering 3 core skills (analyze-prompt, improve-prompt, validate-prompt), 3,800+ lines of code, API reference documentation, and integration patterns. Deliverables: (1) analyze-prompt.skill.md — systematic clarity analysis framework (completeness, specificity, constraints) with scoring (Completeness + Specificity + Constraints) / 3; (2) improve-prompt.skill.md — improvement suggestion engine (clarity, completeness, constraint improvements) with trade-off analysis and prioritization; (3) validate-prompt.skill.md — format and standards validation (structure, syntax, context-specific rules) with severity levels (error, warning, info); (4) README.md — quick-start guide and feature overview; (5) API.md (1,000+ lines) — complete function signatures with TypeScript types, parameter descriptions, error codes, and integration examples. All skills context-specific for .github control plane, WordPress plugins, and themes. Phase 2 establishes architecture for Phase 3 testing and Phase 4 deployment. ([PR #2017](https://github.com/lightspeedwp/.github/pull/2017), [Spec #1841](https://github.com/lightspeedwp/.github/issues/1841))

- **Branch Naming Enforcement Phase 6 — Team Rollout & Adoption Setup** — Finalized project documentation for Phase 6 team rollout and adoption setup (start: 2026-08-12, target completion: 2026-08-19). Phase 6 deliverables include: (1) Execution Log tracking team adoption status, key milestones (Slack announcement, setup checklist distribution, grace period, enforcement enablement), and daily adoption metrics; (2) Final Announcement with team communication guidance, setup walkthrough (5 steps), troubleshooting guide (10 FAQs), and support channels (GitHub Discussions, Slack, Issues); (3) Gitleaks false positive exclusion for OPENSPEC template placeholder. Grace period enabled 7 days with warn-only validation, adoption target 80%+ hook installation by Day 3 (2026-08-15). ([Phase 6 Project](./.github/projects/active/branch-naming-enforcement-phases-6-7/))

- **PR Creation Agent — Phase 3 Skill 2: route-pr-template Implementation** — Complete implementation of route-pr-template skill for PR template routing and metadata extraction. Skill 2 delivers: (1) Template Router (237 LOC, ES modules) loading `.github/PULL_REQUEST_TEMPLATE/config.yml` YAML config, routing branch types to template files (feat→pr_feature.md, fix→pr_bug.md, docs→pr_docs.md, etc.), reading template content, and extracting metadata; (2) Metadata extraction supporting frontmatter parsing (YAML key-value pairs), section identification (## headers), required sections detection (Linked issues, Changelog, Checklist/Global DoD), statistics collection (content length, line count); (3) Comprehensive test suite (36 tests, 100% coverage) with real file integration tests validating all 20+ supported branch types (feat, fix, hotfix, refactor, chore, docs, test, perf, ci, build, deps, security, design, a11y, ux, release, research, revert, i18n, ops); (4) Input validation (branch type required), error handling with consistent response structure, and production-ready code quality. All 36 tests passing. Returns: { valid, branchType, templateFile, templatePath, content, metadata with sections/frontmatter/statistics }. Feeds template metadata into Skill 3 (validate-and-apply-labels) for downstream label validation. ([PR TBD](https://github.com/lightspeedwp/.github/pull/TBD), [#1870](https://github.com/lightspeedwp/.github/issues/1870))

- **ADR Agent Portability — Phase 1A Configuration System foundation** — Portable, configuration-driven architectural decision record (ADR) generation agent with comprehensive configuration schema and examples. Phase 1A deliverables include: (1) Complete JSON schema (`adr-config.schema.json`) supporting all configuration options for templates, numbering schemes, approval workflows, metadata customization, WordPress-specific fields, and validation rules; (2) Four example configurations demonstrating control-plane, organization, WordPress plugin, and WordPress theme contexts; (3) Skill documentation (`SKILL.md`) with project overview, quick-start guide, configuration inheritance model, and Phase 1–3 roadmap; (4) Portable agent architecture (`agents/adr-generator/`) ready for multi-phase implementation. Configuration system features: configuration-first design (all behavior driven by `.adr-config.json`), flexible numbering (sequential/date-based/custom), optional approval workflows (CODEOWNERS/custom), WordPress support, inheritance model (org defaults + repo overrides), and composable validation rules. Phase 1A establishes foundation for Phases 1B (template variants & validators) and 1C (complete agent implementation & testing). Master epic issue (#1828) created to track implementation across Phases 1–3. Planning documentation in `.github/projects/active/adr-agent-portability-org/`. ([PR #1915](https://github.com/lightspeedwp/.github/pull/1915), [#1828](https://github.com/lightspeedwp/.github/issues/1828), [#1829](https://github.com/lightspeedwp/.github/issues/1829))

- **Metrics Agent Phase 1 — Core Implementation & Testing** — Complete implementation of universal metrics collection and analysis agent supporting GitHub control plane and WordPress repositories. Phase 1 deliverables include: (1) Core implementation (~1,150 LOC) with 6 modular components: ConfigurationLoader (config loading/validation), GitHubAPIClient (API queries with exponential backoff and caching), MetricsCollector (issue/PR/contributor metrics extraction), MetricsAggregator (multi-repo aggregation and trend analysis), InsightsAnalyzer (pattern detection and health scoring), MetricsReporter (output packaging and handoff); (2) Three configuration profiles (github-control-plane, wordpress-plugin, wordpress-theme) with context-aware metric filtering; (3) Comprehensive test suite with 75+ tests achieving >82% code coverage (100% for critical ConfigurationLoader module); (4) Complete documentation including README with API reference, PROGRESS.md tracking, and inline code comments; (5) Universal configuration-driven design supporting single codebase across 3 repository contexts. Performance targets: <30s single repo, <2m 5 repos. Built-in exponential backoff (3 retries, max 60s) handles GitHub API rate limiting. Production-ready error handling and validation on all inputs. Phase 2 (Aug 26-Sep 16) will add real API integration, historical data storage, and Reporting Agent integration. ([PR #1886](https://github.com/lightspeedwp/.github/pull/1886), [Spec #1831](https://github.com/lightspeedwp/.github/issues/1831))

- **Project Meta Sync Agent v2 — Modernization & Integration Complete** — Comprehensive modernization of the deprecated project-meta-sync agent to v2.0 reflecting current metadata governance workflows. Phase 5B implementation delivers: (1) Agent Spec v2.0 (550 lines) with core workflows section (3 workflows: metadata-governance, meta-labels-sync, label-audit-report), label taxonomy tiers (Tier 1-4 with discovery patterns), 12+ command patterns, error handling & recovery for 8 scenarios, Phase 5A integration (Release Agent validation contract with blockers/warnings), Phase 3-4 integration (label-orchestrator.js CLI teaching); (2) Agent Prompt (483 lines) with role & context, taxonomy teaching, GitHub Project fields mapping, operational patterns, error recovery workflows, Phase 5A integration guidance, and example conversations; (3) npm Package @lightspeedwp/metadata-agent v1.0.0-rc.1 (3,950 lines, 16 files, 6 modules: label-utils, api-client, validation, confidence-scorer, error-handler, index with TypeScript definitions 537 lines, complete documentation 736 lines); (4) Portable Agent agents/metadata-agent/ for reuse across repositories; (5) Comprehensive Test Suite (127 tests, 82%+ coverage: 80 unit tests, 26 integration tests, 9 E2E tests). All phases per IMPLEMENTATION_PLAN.md specifications with OPENSPEC.md acceptance criteria met. ([PR #1976](https://github.com/lightspeedwp/.github/pull/1976), [Project](./.github/projects/active/project-meta-sync-agent-v2-2026-08-12/))

- **Linting Agent Phase 2 — Complete Implementation** — Full implementation of Linting Agent Phase 2 delivering all 4 planned tasks: (1) Agent Prompt (`.github/agents/linting.agent.md` v0.2.0, 2,247 lines) with complete specification for JavaScript/TypeScript, Markdown, YAML, JSON, Shell, PHP, CSS/SCSS, HTML, and Python linting; (2) JavaScript Enhancement (`scripts/agents/linting.agent.js`, 186 insertions) with 6 new functions: `detectRepositoryType()` for auto-detection of control-plane/WordPress plugin/theme/block-plugin projects, WordPress config helpers (`getWordPressPhpcsConfig()`, `getBlockPluginConfig()`, `getBlockThemeConfig()`), repository root resolution, and timeout protection (`withTimeout()`); (3) WordPress Configuration Guide (619 lines) covering plugin/theme/block-plugin setup, CI/CD integration (GitHub Actions, pre-commit hooks), and comprehensive troubleshooting; (4) Configuration Examples (4 ready-to-use files: `phpcs.xml`, `stylelint.json`, `eslint.config.js`, `block-plugin-agent-config.json`). All 4 tasks committed with proper branch naming (`feat/linting-agent-phase-2-implementation`), comprehensive PR body with changelog, linked issues, and DoD checklist. Project linking validation passed for all 53 projects. Phase 3 integration testing ready. ([PR #1909](https://github.com/lightspeedwp/.github/pull/1909), [#1819](https://github.com/lightspeedwp/.github/issues/1819), [Epic #1818](https://github.com/lightspeedwp/.github/issues/1818))

- **Reports & Projects Restructuring — Phase 4: Cleanup & Documentation Complete** — Completed all-hands initiative to restructure reports and projects across the .github control plane. Phase 4 deliverables: (1) `.github/reports/README.md` — comprehensive folder lifecycle policy documenting archive process, maintenance schedule, and folder organization across active and archive subfolders; (2) `docs/PROJECT_ISSUE_LINKING_STANDARD.md` — bidirectional project-issue linking standard with implementation templates, validation examples, and best practices; (3) `CLAUDE.md` — new Reports Directory Structure section documenting folder layout and lifecycle guidance; (4) Project README updated — all 4 phases marked complete with delivery dates (Phase 1: PR #1730, Phase 2: PR #1752, Phase 3: PR #1767, Phase 4: PR #1910); (5) Archive cleanup — 5 incomplete/stub reports moved to `archive/deprecated-audits/`. Initiative summary: 118 reports reorganized, 31 projects linked, comprehensive documentation published, CI validation infrastructure deployed. All 4 phases delivered 2026-08-11 to 2026-08-12. ([PR #1910](https://github.com/lightspeedwp/.github/pull/1910), [Master Epic #1731](https://github.com/lightspeedwp/.github/issues/1731), [Phase 4 Task #1735](https://github.com/lightspeedwp/.github/issues/1735))
- **Reviewer Agent v2 — Planning Phase: Multi-Tool Orchestration & Feedback Processing** — Comprehensive planning phase for transforming the reviewer agent into an intelligent multi-tool orchestrator. Phase 1 deliverables include: (1) Enhanced agent prompt with full orchestration capabilities for CodeRabbit, GitHub Code Quality, and GitHub Copilot; (2) Implementation guide covering tool integration, feedback processing, decision engine, and testing strategy; (3) OpenSpec planning roadmap with detailed 4-week implementation plan (15 concrete tasks, 80 hours total effort); (4) Decision documentation answering 6 clarifying questions with best-practice recommendations (unified agent with overlays, hybrid authorization with fallback, WordPress-specific categories, three-tier testing strategy, comprehensive documentation, split artifact location); (5) Project structure in `.github/projects/active/reviewer-agent-v2-implementation-2026-08/` with README, configuration examples, and navigation guides; (6) Comprehensive roadmap including all phases (core implementation, testing, documentation, rollout) with risk mitigation, success criteria, and known unknowns. Master epic issue (#1802) created to track 15 implementation subtasks across 4 phases. Planning PR ready for team review. ([PR #1798](https://github.com/lightspeedwp/.github/pull/1798), [#1802](https://github.com/lightspeedwp/.github/issues/1802))

- **Issue maintenance scripts — Phase 5.2 Staging Validation infrastructure** — Created comprehensive staging validation framework for pre-production testing of integrated label management system (Phases 1–4). Phase 5.2 project README (379 lines) documents eight validation tasks: audit accuracy (95%+ target), performance benchmarking (< 5 min for 100 issues), error handling & recovery (network, rate limit, permission failures), report generation validation (JSON/CSV/Markdown), stale issue detection accuracy, and data integrity checks (orphaned/conflicting/duplicate labels). Implemented `staging-validation.js` script (400+ lines) providing modular validation tasks with CLI interface supporting `--all` (run all tests), `--task <name>` (individual task execution), `--count <n>` (configurable issue count), and structured JSON reporting with GO/NO-GO production readiness decision. Created test data fixtures (`staging-test-data.json`) with 100 representative test issues covering 7 categories: issue types (10 each type), age distribution (recent/active/aging/stale), PR relationships, label scenarios (correct/missing/conflicting), comment density, and edge cases (unicode, emoji, long content, special chars, locked/archived issues). Success criteria defined: 95%+ audit accuracy, < 5 minute execution for 100 issues, < 0.5% error rate, 100% data consistency, zero critical errors. All test infrastructure ready for manual validation runs against staging environment. ([Phase 5.2 Project](.github/projects/active/issue-maintenance-phase-5-2-staging-2026-08-12/), [Depends: #1780](https://github.com/lightspeedwp/.github/pull/1780))

- **Issue maintenance scripts — Phase 5.1 Integration Testing & Production Rollout Planning** — Comprehensive Phase 5 planning documentation (379 lines) and integration test suite (1,450+ lines, 51/53 tests passing, 96.2% pass rate) for validating unified label management system before production deployment. Phase 5.1 planning document covers 6 sub-phases: integration testing (workflow + CLI + lifecycle + cross-workflow scenarios), staging validation (accuracy/performance/reporting), production readiness checklist (security, monitoring, documentation), staged deployment (monitoring → canary 10% → gradual 50-100%), monitoring & observability (metrics, dashboards, alerts), and runbooks & incident response. Implemented 4 integration test modules: `setup.integration.js` (mock GitHub API, test utilities, assertion helpers), `workflows.integration.test.js` (meta-labels-sync.yml, label-audit-report.yml validation, concurrent execution safety), `cli-orchestrator.integration.test.js` (audit, dry-run, interactive, auto modes with multiple output formats), `end-to-end.integration.test.js` (complete issue lifecycle: creation → labeling → closure). Test infrastructure includes GitHubAPI mock with realistic rate limiting, proper response structures, and edge case simulation. All tests follow AAA pattern (Arrange-Act-Assert) with clear structure and comprehensive coverage of happy paths and error scenarios. ([PR #1780](https://github.com/lightspeedwp/.github/pull/1780), [#1680](https://github.com/lightspeedwp/.github/issues/1680))

- **Issue maintenance scripts — Phase 3 GitHub Workflows complete** — Implemented two production-grade GitHub Actions workflows for automated label management at scale. Meta-labels-sync.yml runs daily (3 AM UTC) to synchronise PR labels and mark stale issues (30+ days inactive), with manual dispatch support for dry-run, configurable staleness thresholds, and verbose logging. Label-audit-report.yml generates monthly (1st at 4 AM UTC) comprehensive audit reports of meta and status labels in multiple formats (markdown/json/csv), with manual dispatch for on-demand audit runs. Created label-orchestrator.js as unified CLI coordinator supporting three modes: audit (analyse label coverage), sync (synchronise PR labels), and stale (mark inactive issues). Both workflows include proper error handling, permissions minimized to least privilege, and security best practices (environment variable usage, no command injection vectors). Workflows validated for YAML syntax, GitHub Actions v7 compatibility, and reference integrity. ([PR #1761](https://github.com/lightspeedwp/.github/pull/1761), [#1720](https://github.com/lightspeedwp/.github/issues/1720))

- **PR/Issue → Milestone Allocation Automation — Phase 1 specification & design complete** — Comprehensive project for automatic allocation of merged pull requests and closed issues to the current active milestone. Phase 1 deliverables include: (1) OpenSpec formal specification with 10 sections defining requirements, API contracts, error handling, and edge cases; (2) RFC design document comparing five alternative approaches and justifying the selected two-tier solution (manual script + GitHub Actions workflow); (3) PLANNING.md implementation timeline covering 4 phases over 3 weeks (72 hours in Phase 2); (4) Node.js script (`allocate-to-milestone.js`, 400+ lines) supporting dry-run mode, configurable lookback period, forced milestone override, and verbose logging; (5) GitHub Actions workflow (`allocate-pr-issue-to-milestone.yml`) with three trigger modes (PR merge, issue close, manual workflow_dispatch); (6) Comprehensive documentation suite (10 guides totaling 3,000+ lines) including quick-reference, setup guide, script README, and troubleshooting guide. Project structure deployed to `.github/projects/active/pr-issue-milestone-allocation-2026-08-11/` with GitHub issue tracking (#1762 Epic, #1763-1766 Phase issues). ([PR #1770](https://github.com/lightspeedwp/.github/pull/1770), [#1762](https://github.com/lightspeedwp/.github/issues/1762), [#1763](https://github.com/lightspeedwp/.github/issues/1763), [#1764](https://github.com/lightspeedwp/.github/issues/1764), [#1765](https://github.com/lightspeedwp/.github/issues/1765), [#1766](https://github.com/lightspeedwp/.github/issues/1766))

- **Issue maintenance scripts — Phase 2: Label Orchestrator CLI** — Implemented unified `label-orchestrator.js` command-line interface to coordinate all label management scripts (manage-stale-issues, review-meta-labels, review-status-labels, sync-pr-labels). Three operating modes: audit (analyse labels without changes), sync (synchronise PR and stale labels with dry-run by default), apply (apply all changes and optionally close stale issues). Comprehensive argument parsing with strict validation: valid modes, output formats (JSON, markdown, CSV), script selection with mode-specific constraints, and configurable stale-issue threshold. Mode-specific handlers: audit supports all scripts, sync and apply limited to pr-labels and stale-issues. Dry-run defaults: sync defaults to true (preview), apply defaults to false (live execution). Exit status semantics: exit 0 on success, exit 1 on any handler failure. Test coverage: 33 unit tests covering modes, command-line flags, validation constraints, default options, and edge cases. All tests passing, ESLint/Prettier clean. ([PR #1774](https://github.com/lightspeedwp/.github/pull/1774), [#1720](https://github.com/lightspeedwp/.github/issues/1720))

- **Issue maintenance scripts — Phase 1.3 implementation complete** — Implemented `manage-stale-issues.js` script for automated detection and marking of inactive issues (30+ days no activity) with `meta:stale` label. Features include configurable inactivity threshold, optional warning comments, auto-close functionality, and smart exclusion rules (epics, in-progress, critical-priority, milestone-assigned issues). Restored Phase 1 & 1.2 tests (review-meta-labels.test.js, sync-pr-labels.test.js) to live test suite. Comprehensive test coverage: 16 unit tests for Phase 1.3 (80%+ code coverage), 45+ tests total across all phases. Code quality enhancements: removed 10 unused variables, constants, functions, and imports. All 1109 tests passing. ([PR #1728](https://github.com/lightspeedwp/.github/pull/1728), [#1718](https://github.com/lightspeedwp/.github/issues/1718), [#1719](https://github.com/lightspeedwp/.github/issues/1719), [#1720](https://github.com/lightspeedwp/.github/issues/1720))

- **Phase 5–7 Release Process Redesign — Portable Release and Changelog Agents** — Implemented CHILD-023 Release Agent and CHILD-024 Changelog Agent as portable, production-grade agents for multi-repository version management and changelog automation. Release Agent supports control-plane, WordPress plugin, and theme repositories with version detection, validation, and bumping across multiple file types (VERSION, package.json, plugin headers, theme CSS, readme.txt). Changelog Agent provides two-gate validation system (entry format on PR, structure at release) with Keep a Changelog 1.1.0 compliance, auto-formatting (em-dashes, character limits, capitalization), and entry management. Both agents include comprehensive unit test suites (42 and 19 tests respectively, 100% passing). ([PR #1696](https://github.com/lightspeedwp/.github/pull/1696), [CHILD-023](https://github.com/lightspeedwp/.github/issues/1664), [CHILD-024](https://github.com/lightspeedwp/.github/issues/1664))
- **Issue metadata triage expansion — Phase 2 Tier 1 handlers complete** — Implemented `handle-needs-triage.js` handler for automated type inference (feature, bug, epic, story, refactor) and area detection (ci, docs, security, automation, ai, labels, 15+ categories) from issue content, with assignee suggestion based on detected area and confidence scoring (80%+ type, 75%+ area). Finalized `handle-needs-template-fix.js` handler from Phase 1 with optimized pattern matching and validation. Created `handlers-orchestrator.js` for unified batch processing with three modes: --dry-run (safe preview), --interactive (prompt-before), --auto (confidence-based). Comprehensive test coverage: 26 tests for triage handler (91.85% code coverage), 8 tests for template-fix handler, 17 tests for orchestrator configuration. All 84 tests passing. GitHub API integration ready for production deployment. ([PR #1697](https://github.com/lightspeedwp/.github/pull/1697), [Epic #1679](https://github.com/lightspeedwp/.github/issues/1679), child issues #1683–#1685)

- **Issue metadata triage expansion — Phase 1 audit complete** — Implemented comprehensive issue metadata audit and validation system. Phase 1 includes: (1) Audit script that analyzes all open issues across 9 `status:needs-*` label categories, generating reports in JSON/CSV/Markdown formats with metadata gap analysis; (2) Handler model (`handle-needs-template-fix.js`) for automated template section detection and regeneration with dry-run support; (3) Comprehensive unit test suite (8+ tests) covering handler logic and edge cases. Audit results show 42% status label coverage (214/372 issues) and 72% area label coverage (105/372 issues). Phase 2–4 handlers for triage, review, development, planning, design, documentation, and audit automation planned for subsequent iterations. ([PR #1692](https://github.com/lightspeedwp/.github/pull/1692), [Epic #1679](https://github.com/lightspeedwp/.github/issues/1679), child issues #1680–#1687)

- **Badge workflow integration — Phases 1–3 complete** — Implemented comprehensive badges workflow automation system with schema-driven configuration, automated generation, validation, and discovery workflows. Phase 1 created badge schema with 41 workflow definitions, updated badges.js utility, and established governance policies. Phase 2 implemented four GitHub Actions workflows: documentation badge updates (on-push), README status maintenance (daily), workflow discovery (weekly), and badge health checks (weekly). Phase 3 added testing suite with schema validation, automated schema generation from workflows, comprehensive examples documentation, and detailed troubleshooting guide. ([PR #1659](https://github.com/lightspeedwp/.github/pull/1659), [Epic #1641](https://github.com/lightspeedwp/.github/issues/1641), child issues #1643–#1655)

### Fixed

- **Changelog validation regex bugs and test assertion improvements** — Fixed 3 critical regex bugs in changelog validation and parser: (1) em-dash validation now correctly checks for spaced hyphens (` - `) instead of flagging all hyphenated words like "backwards-compatible"; (2) replaced Perl syntax `\z` with JavaScript anchor `$` for end-of-string pattern matching; (3) added regex metacharacter escaping for category names to handle special characters. Added 14 comprehensive tests covering edge cases (empty content, special chars, boundary conditions) and documented confidence threshold behaviour (0.85 multiplier) in handle-needs-triage tests. Strengthened 38 test assertions to verify documented API behaviour instead of arbitrary expectations. ([PR #1729](https://github.com/lightspeedwp/.github/pull/1729), [#1715](https://github.com/lightspeedwp/.github/issues/1715), [#1716](https://github.com/lightspeedwp/.github/issues/1716))

- **Release Agent gitOps.cjs — prevent cross-repo data corruption** — Refactored all 15 git operation functions to accept optional `workDir` parameter, eliminating hardcoded `process.cwd()` calls that risked cross-repo contamination in multi-repository release workflows. Added `validateDirectory()` function for pre-operation validation. Switched from `execSync` (shell-based) to `execFileSync` (args array) to prevent shell injection attacks. All functions maintain backwards compatibility with `process.cwd()` as default. Comprehensive test suite covers directory validation, cross-repo isolation, shell injection prevention, and backwards compatibility. ([PR #1724](https://github.com/lightspeedwp/.github/pull/1724), [#1714](https://github.com/lightspeedwp/.github/issues/1714))

- **OPENSPEC frontmatter and footer validation fixes** — Corrected invalid frontmatter values (status enum, version formatting) and added proper document footers to OPENSPEC specification files for active projects (github-actions-v7-upgrade, badges-workflow-integration, issue-metadata-triage-expansion). Bumped document versions (v1.2.0→v1.2.1, 1.1→1.1.1, 1.1.0→1.1.1) to satisfy frontmatter freshness validation. ([PR #1711](https://github.com/lightspeedwp/.github/pull/1711), [#1709](https://github.com/lightspeedwp/.github/issues/1709))

- **Make confidence-status assertions deterministic in handle-needs-triage tests** — Updated test assertions to derive expected status from actual inference confidences rather than accepting multiple possible outcomes. Fixes CodeRabbit findings from PR #1703 with deterministic test expectations for low-confidence and high-confidence scenarios. ([PR #1712](https://github.com/lightspeedwp/.github/pull/1712), [#1709](https://github.com/lightspeedwp/.github/issues/1709))

- **Add footer to PHASE-4-GUIDE.md for validation compliance** — Added proper footer format to Phase 4 implementation guide to pass markdown footer validation checks. Footer includes status metadata and workflow automation reference. ([PR #1694](https://github.com/lightspeedwp/.github/pull/1694), [#1679](https://github.com/lightspeedwp/.github/issues/1679))

- **Upgrade badge workflow actions to v7** — Fixed invalid GitHub Actions references in badge workflows (badges-documentation-update, badges-readme-status, badges-workflow-audit, badges-health-check) by replacing broken SHAs with pinned v7 release SHAs. Actions/checkout and actions/setup-node now use v7 (latest stable) instead of v4 with invalid commit SHAs. ([PR #1668](https://github.com/lightspeedwp/.github/pull/1668), [PR #1693](https://github.com/lightspeedwp/.github/pull/1693), [Epic #1641](https://github.com/lightspeedwp/.github/issues/1641))

- **GitHub Actions v7 upgrade — Phases 3–5 complete** — Standardized GitHub Actions versions across 11 remaining workflows (Phase 3): upgraded actions/checkout v4→v7, actions/setup-node v4/v5→v7, actions/github-script v9→v7, actions/create-github-app-token v2/v3→v4. Completed comprehensive integration testing with 5 validation test categories, 100% pass rate, zero regressions (Phase 4). Added complete documentation including project summary, test results, and handoff notes for maintenance team (Phase 5). ([PR #1688](https://github.com/lightspeedwp/.github/pull/1688), [Epic #1670](https://github.com/lightspeedwp/.github/issues/1670))

- **GitHub Actions v7 upgrade — Phases 3–5 complete** — Standardized GitHub Actions versions across 11 remaining workflows (Phase 3): upgraded actions/checkout v4→v7, actions/setup-node v4/v5→v7, actions/github-script v9→v7, actions/create-github-app-token v2/v3→v4. Completed comprehensive integration testing with 5 validation test categories, 100% pass rate, zero regressions (Phase 4). Added complete documentation including project summary, test results, and handoff notes for maintenance team (Phase 5). ([PR #1688](https://github.com/lightspeedwp/.github/pull/1688), [Epic #1670](https://github.com/lightspeedwp/.github/issues/1670))

### Removed

- **Update validation script for Phase 1 restructuring** — Updated `.github/scripts/validate-footers.js` to skip validation of deleted `.github/agents/` files in `--changed-only` mode. Ensures validation scripts correctly handle agents consolidated to root per Phase 1 restructuring. ([PR #1537](https://github.com/lightspeedwp/.github/pull/1537), [#1510](https://github.com/lightspeedwp/.github/issues/1510))

- **WCEU 2026 conference content** — Removed all WCEU-related assets and references across the repository: deleted `verify-wceu-readiness.js` scripts and tests from both `.github/scripts/` and `scripts/` folders, removed `website/src/lib/wceuSlides.ts` and WCEU conference pages (`website/src/pages/wceu-2026/`), deleted WCEU-specific image assets, and removed all WCEU slide references from website components. WCEU content was out of scope for this repository. ([PR #1541](https://github.com/lightspeedwp/.github/pull/1541), [#1539](https://github.com/lightspeedwp/.github/issues/1539))

- **Consolidate README workflows** — Merged 3 legacy workflows. Saves 449 lines. ([PR #1317](https://github.com/lightspeedwp/.github/pull/1317), [Epic #1227](https://github.com/lightspeedwp/.github/issues/1227))

### Deprecated

(none identified)

### Added

- **Enhance bulk issue template fixer with pagination support** — Enhanced bulk issue template section fixer script to support pagination and handle all 352 issues with `status:needs-more-info` label. Improved script to iterate through all GitHub API result pages (previously limited to 30 issues), fixed `--start-from` offset parameter for batch processing, and completed bulk remediation of missing Definition of Ready/Done sections. 118 issues fixed with appropriate DoR/DoD template sections; 234 issues already had correct sections. Final verification: 0 remaining issues with `status:needs-more-info` label. ([PR #1669](https://github.com/lightspeedwp/.github/pull/1669), [#1667](https://github.com/lightspeedwp/.github/issues/1667))

- **Phase 2 release workflow redesign — Two-PR stacked flow with branch guard compliance** — Refactored release workflow to implement develop-first two-PR stacked architecture. Phase 1 creates `release/vX.Y.Z → develop` PR with changelog and version updates. Phase 2 creates `release/vX.Y.Z → main` PR (not `develop → main`) and publishes GitHub Release. Fixes main-branch-guard violation by using release branch as PR head for both phases. Added comprehensive tests for wrapper scripts and release agent providers. ([PR #1658](https://github.com/lightspeedwp/.github/pull/1658), [#1560](https://github.com/lightspeedwp/.github/issues/1560), [#1561](https://github.com/lightspeedwp/.github/issues/1561))

### Fixed

- **Phase 3 label validation enforcement — Validation script & workflow** — Pre-creation label validation script (`validate-labels-before-creation.cjs`) enforces canonical label prefixes and one-hot constraint per family. GitHub Actions workflow validates on issue/PR creation, editing, and PR synchronization. Prevents bare labels (e.g., `bug`, `feature`, `urgent`) and enforces required prefixes (e.g., `type:bug`, `priority:critical`). ([PR #1613](https://github.com/lightspeedwp/.github/pull/1613), [#1612](https://github.com/lightspeedwp/.github/issues/1612))

- **Phase 1 critical fixes — broken badges and release process** — Fixed 33 broken documentation badges (workflow status, build badges); fixed release workflow to default to `--dry-run` with explicit `--live` flag requirement; added authorisation gating for release operations. ([PR #1609](https://github.com/lightspeedwp/.github/pull/1609), [#1547](https://github.com/lightspeedwp/.github/issues/1547), [#1548](https://github.com/lightspeedwp/.github/issues/1548), [#1549](https://github.com/lightspeedwp/.github/issues/1549))

- **Address Copilot review feedback on PR #1591** — Fixed broken relative paths in audit report files and adjusted path resolution for portable asset locations. ([PR #1610](https://github.com/lightspeedwp/.github/pull/1610), [#1591](https://github.com/lightspeedwp/.github/issues/1591))
- **Jest test infrastructure blocker and rollback script improvements** — Fixed critical blocker preventing all 90+ test suites from running. The `rollback.cjs` script had executable code at module load time that called `process.exit(1)` when `ROLLBACK_TARGET_VERSION` environment variable was missing. Wrapped `runMain(main)` in `require.main === module` check to prevent execution during test imports. Refactored module to export `rollbackRelease()`, `parseArgs()`, and `githubApiRequest()` for unit testing. All 1,069 tests now pass. Additional improvements from review feedback: guarded empty/204 response bodies in `githubApiRequest` to prevent `JSON.parse("")` throwing; changed retry predicate to use HTTP status code instead of message text; forced shell rollback now performs all announced deletions (remote tag, GitHub Release, release branch); replaced `process.exit(1)` in catch block with a re-throw so callers and the `runMain` handler control exit status; wired `main()` to call `parseArgs()` so `--version`, `--force`, and `--provider` CLI flags are properly respected. ([PR #1633](https://github.com/lightspeedwp/.github/pull/1633), [#1628](https://github.com/lightspeedwp/.github/issues/1628))

- **Resolve Phase 1 critical issues** — Fixed critical schema path references and unresolved merge conflicts from Phase 1 restructuring that prevented builds and asset discovery. ([PR #1502](https://github.com/lightspeedwp/.github/pull/1502), [#1290](https://github.com/lightspeedwp/.github/issues/1290))

- **Implement blocking logic enforcement for issue state validation** — Added validation logic to prevent invalid issue state transitions and enforce proper workflow compliance. ([PR #1503](https://github.com/lightspeedwp/.github/pull/1503))

- **Address PR #1514 review feedback and CI failures** — Resolved review comments and CI pipeline failures in project status documentation updates. ([PR #1527](https://github.com/lightspeedwp/.github/pull/1527))

- **Address review feedback and CI failures** — Fixed review feedback items and CI pipeline errors in active projects documentation. ([PR #1529](https://github.com/lightspeedwp/.github/pull/1529))

- **Fix 68 ESLint no-unused-vars violations** — Eliminated widespread unused variable errors across codebase improving code quality. ([PR #1536](https://github.com/lightspeedwp/.github/pull/1536))

- **Correct broken agent references in instruction files** — Fixed incorrect cross-references in portable instruction files pointing to agents. ([PR #1602](https://github.com/lightspeedwp/.github/pull/1602))

- **README frontmatter schema compliance (Phase 2B Skills Audit)** — Corrected frontmatter in `.github/projects/active/phase-2b-skills-audit/README.md` to comply with LightSpeed documentation schema: added required `file_type: readme` field, renamed `created` to `created_date`, updated `last_updated` and `version` fields, and removed non-schema fields (`name`, `related_issues`, `related_branches`). Resolves frontmatter validation failures and ensures project documentation adheres to canonical schema standards. ([PR #1540](https://github.com/lightspeedwp/.github/pull/1540), [#1375](https://github.com/lightspeedwp/.github/issues/1375))

- **Safe Footer Injection frontmatter detection** — Extended YAML frontmatter detection to support variable-length headers by searching entire file instead of limited line count. Changed delimiter matching to exact match `trim() === '---'` to prevent false positives on YAML content lines. ([PR #1632](https://github.com/lightspeedwp/.github/pull/1632))

- **Fix README frontmatter** — Corrected Phase 2B project README frontmatter. ([PR #1540](https://github.com/lightspeedwp/.github/pull/1540), [#1375](https://github.com/lightspeedwp/.github/issues/1375))

- **Fix import error** — Fixed `_fetchCanonicalLabels` function reference. ([PR #1540](https://github.com/lightspeedwp/.github/pull/1540))

- **Fix ESLint errors** — Resolved 5 import validation errors. ([PR #1541](https://github.com/lightspeedwp/.github/pull/1541), [#1539](https://github.com/lightspeedwp/.github/issues/1539))

- **Fix website build** — Removed wceuSlides references from agents page. ([PR #1541](https://github.com/lightspeedwp/.github/pull/1541))

- **Add file_type frontmatter** — Added to 48 agent and 16 prompt files. ([PR #1533](https://github.com/lightspeedwp/.github/pull/1533), [#1510](https://github.com/lightspeedwp/.github/issues/1510))

### Added

- **Phase 4 Implementation Plan — release process refactoring** — Complete implementation plan for Phase 4 with 22 detailed tasks across 5 priority areas (workflow refactoring, agent implementation, WordPress integration, testing, deployment). Includes 18-day timeline (2026-08-08 → 2026-08-25), validation against OPENSPEC analysis covering all 47 requirements and 4 ADRs, and comprehensive OpenSpec Issues Summary with complete task inventory. ([PR #1656](https://github.com/lightspeedwp/.github/pull/1656), [#1640](https://github.com/lightspeedwp/.github/issues/1640))

- **Two-PR stacked creation logic for release.agent.js** — Implemented Phase 2 architecture for stacked PR workflow: added `createReleasePRToDevelop(version, branch, options)` for Phase 1 PR creation (release → develop with version bump + changelog), and `createReleasePRToMain(version, options)` for Phase 2 PR creation (stacked PR release → main after develop merge). Enables develop-first release flow with clear two-stage validation. ([PR #1658](https://github.com/lightspeedwp/.github/pull/1658), [#1561](https://github.com/lightspeedwp/.github/issues/1561))

- **Phase 1–3 completion documentation** — Comprehensive project completion report documenting Phase 1 restructuring, Phase 2 label remediation, and Phase 3 validation enforcement. Includes audit findings, 5-phase remediation timeline, and governance architecture. ([PR #1624](https://github.com/lightspeedwp/.github/pull/1624), [Epic #1290](https://github.com/lightspeedwp/.github/issues/1290))

- **Label creation governance in CLAUDE.md and AGENTS.md** — Added mandatory label prefix enforcement rules to organisation-wide governance documents. All labels must use canonical prefixes (type:, status:, priority:, area:, etc.) from `.github/labels.yml` (158 canonical labels). One-hot constraint per family except meta:, comp:, lang: which allow multiples. Prevents bare labels and enforces validation at issue/PR creation time. ([PR #1611](https://github.com/lightspeedwp/.github/pull/1611), [#1592](https://github.com/lightspeedwp/.github/issues/1592))

- **Phase 4 label validation documentation** — Comprehensive documentation package: updated LABELING.md v1.1.0 with ~500 lines on validation rules and error guidance; new LABELING_FAQ.md (~2,500 lines) with 30+ FAQs organised by topic; new LABELING_EXAMPLES.md (~1,000 lines) with 20+ real-world label combinations for issues and PRs. ([PR #1613](https://github.com/lightspeedwp/.github/pull/1613), [#1612](https://github.com/lightspeedwp/.github/issues/1612), [docs/LABELING.md](./docs/LABELING.md), [docs/LABELING_FAQ.md](./docs/LABELING_FAQ.md), [docs/LABELING_EXAMPLES.md](./docs/LABELING_EXAMPLES.md))
- **Label prefix governance enforcement audit** — Comprehensive audit identifying 100+ label governance violations with structured 5-phase remediation strategy covering governance updates, validation enforcement, pre-creation scripts, documentation, and team training. ([PR #1591](https://github.com/lightspeedwp/.github/pull/1591), [#1592](https://github.com/lightspeedwp/.github/issues/1592))

- **Implement Phase 3 labeling automation for issue triage** — Implemented automated labeling rules and infrastructure for phase 3 of issue triage system with type assignment and status classification. ([PR #1505](https://github.com/lightspeedwp/.github/pull/1505))

- **Add status:needs-review audit report** — Generated comprehensive audit report identifying all issues requiring review using new status labeling system. ([PR #1506](https://github.com/lightspeedwp/.github/pull/1506))

- **Add pre-commit validation hook for PR template compliance** — Added pre-commit hook to enforce PR template compliance before commits preventing non-compliant PRs. ([PR #1508](https://github.com/lightspeedwp/.github/pull/1508))

- **Add AI feedback PR review validation workflow** — Implemented automated workflow to validate AI feedback in PRs with issue linking and decision tracking (addressed/deferred/rejected). ([PR #1526](https://github.com/lightspeedwp/.github/pull/1526))

- **Add Mermaid accessibility attributes repository-wide** — Added ARIA labels and accessibility attributes to all Mermaid diagrams across codebase improving accessibility compliance. ([PR #1530](https://github.com/lightspeedwp/.github/pull/1530))

- **Release Process V2 specification and OpenSpec analysis** — Defined Release Process V2 specification with comprehensive OpenSpec analysis for standardized release workflows and automation. ([PR #1545](https://github.com/lightspeedwp/.github/pull/1545))

- **Gitleaks secret scanning** — Added `gitleaks-reusable.yml`, an organisation-wide reusable workflow other repositories call via `workflow_call`, plus a `gitleaks.yml` caller running on pull requests into `develop`/`main`. Runs the open-source Gitleaks CLI directly (the `gitleaks-action` wrapper requires a paid licence for organisation repositories). Per-PR runs scan the working tree; `workflow_dispatch` accepts a `full-history` input for on-demand full-history rescans. A baseline full-history scan of this repository returned 50 hits, all verified as placeholder values in documentation and tests, allowlisted in `.gitleaks.toml`. ([PR #1444](https://github.com/lightspeedwp/.github/pull/1444))

- **Add Gitleaks scanning** — Reusable workflows for PR secret scanning. ([PR #1444](https://github.com/lightspeedwp/.github/pull/1444))

- **Phase 1 repo restructuring** — Moved scripts/website/projects to .github; updated 400+ refs. ([PR #1446](https://github.com/lightspeedwp/.github/pull/1446), [#1447](https://github.com/lightspeedwp/.github/issues/1447))

- **Playwright Testing enhancements** — Added performance routing, a11y/SEO gates. ([PR #1392](https://github.com/lightspeedwp/.github/pull/1392), [#1393](https://github.com/lightspeedwp/.github/issues/1393))

- **Add issue triage automation** — MilestoneAssignmentAgent, RemediationChecklistGenerator. ([PR #1377](https://github.com/lightspeedwp/.github/pull/1377), [#1376](https://github.com/lightspeedwp/.github/issues/1376))

- **Add issue health audit** — Health audit and sync workflows. ([PR #1399](https://github.com/lightspeedwp/.github/pull/1399), [#1402](https://github.com/lightspeedwp/.github/issues/1402))

- **Add GitHub issue type sync** — Sync-issue-fields script and backfill workflow. ([PR #1401](https://github.com/lightspeedwp/.github/pull/1401), [#1403](https://github.com/lightspeedwp/.github/issues/1403))

- **Phase 2B Skills Consolidation Plan** — Phase B planning with dependency maps and C roadmap. ([PR #1370](https://github.com/lightspeedwp/.github/pull/1370), [#1316](https://github.com/lightspeedwp/.github/issues/1316))

- **Add content-parity enforcement** — Optional consistency.json for phrase parity. ([PR #1392](https://github.com/lightspeedwp/.github/pull/1392), [#1393](https://github.com/lightspeedwp/.github/issues/1393))

- **Playwright multi-provider support** — Standardised to multi-provider. ([PR #1108](https://github.com/lightspeedwp/.github/pull/1108), [#1079](https://github.com/lightspeedwp/.github/issues/1079))

- **Agent standardization Phase 1** — Pattern, schemas, validators, tests. ([PR #1108](https://github.com/lightspeedwp/.github/pull/1108))

- **GitHub Workflows Consolidation Initiative — Phase 1A** — Systematic consolidation of 31 GitHub workflows: removed legacy `testing.yml` (duplicate of `checks.yml`); extracted template validation helpers into shared `scripts/validation/template-helpers.cjs` module (45 unit tests, >90% coverage); documented with 12-week execution plan. ([PR #1228](https://github.com/lightspeedwp/.github/pull/1228))

- **Version-based milestone allocation** — Automatic assignment (v1.0–v1.6) with capacity tracking. ([PR #1113](https://github.com/lightspeedwp/.github/pull/1113), [#1112](https://github.com/lightspeedwp/.github/issues/1112))

- **PRD Agent Phase 2A standardization** — Standardised 39 skills with routing and docs. ([PR #1199](https://github.com/lightspeedwp/.github/pull/1199), [#1197](https://github.com/lightspeedwp/.github/issues/1197))

- **WooCommerce Config multi-provider** — Standardised with PCI DSS guardrails. ([PR #1141](https://github.com/lightspeedwp/.github/pull/1141), [#1101](https://github.com/lightspeedwp/.github/issues/1101))

- **Phase 3.1: Labeling consolidation** — Merged 3 workflows into unified governance. ([PR #1367](https://github.com/lightspeedwp/.github/pull/1367), [Epic #1227](https://github.com/lightspeedwp/.github/issues/1227))

- **WordPress & Tour Operator agents** — Standardised to Phase 1 pattern. ([PR #1142](https://github.com/lightspeedwp/.github/pull/1142), [PR #1140](https://github.com/lightspeedwp/.github/pull/1140))

- **PRD Combined Agent (Phase 2B)** — Consolidated prd-agent and prd-factory-planner-agent (917 files, 144k LOC) into unified multi-provider agent with full standardization. ([PR #1196](https://github.com/lightspeedwp/.github/pull/1196) — *feat(agents): Phase 2 Batch 2 - PRD Combined Agent*, [#1094](https://github.com/lightspeedwp/.github/issues/1094), [#1095](https://github.com/lightspeedwp/.github/issues/1095))

- **Agent batch standardization (Phase 1 complete)** — Standardised 4 agents to multi-provider pattern with 6 more in progress as part of Phase 2A. ([PR #1195](https://github.com/lightspeedwp/.github/pull/1195) — *feat(agents): Phase 2A standardization — 4 agents complete, 6 in progress*)

- **Issue Definition of Done (DoD) validation workflow** — Automated CI workflow validates all issues have DoD sections with proper formatting, preventing incomplete issues from being shipped. ([PR #1200](https://github.com/lightspeedwp/.github/pull/1200) — *feat(ci): add issue DoD validation workflow*, [#1014](https://github.com/lightspeedwp/.github/issues/1014))

- **Quirky footers system with schema validation** — Implemented footer parsing and schema validation infrastructure with comprehensive test coverage. ([PR #1212](https://github.com/lightspeedwp/.github/pull/1212) — *feat: implement quirky footers system with schema validation*)

- **KWV block-theme skills** — Contributed 8 skill stubs and 11 new substantive block-theme skills for WordPress theme development. ([PR #1149](https://github.com/lightspeedwp/.github/pull/1149) — *feat(skills): contribute KWV block-theme skills — flesh out 8 stubs + add 11 new*)

- **Org issue-field writer infrastructure (MVP)** — Added infrastructure for programmatic issue field writing to support automation. ([PR #1151](https://github.com/lightspeedwp/.github/pull/1151) — *feat: add org issue-field writer infrastructure (MVP for #1145)*, [#1145](https://github.com/lightspeedwp/.github/issues/1145))

- **Phase 1B.i: Changelog consolidation** — Merged 2 workflows, 18 tests, bug fixes. ([PR #1280](https://github.com/lightspeedwp/.github/pull/1280), [#1227](https://github.com/lightspeedwp/.github/issues/1227))

- **Phase 1B.ii: Metrics consolidation** — Merged 2 workflows, 19 tests, eliminated scheduling gap. ([PR #1282](https://github.com/lightspeedwp/.github/pull/1282), [#1227](https://github.com/lightspeedwp/.github/issues/1227))

- **Optimise markdown-linting scope** — Audit identified 38–45% reduction opportunity. ([PR #1226](https://github.com/lightspeedwp/.github/pull/1226), [#1224](https://github.com/lightspeedwp/.github/issues/1224))

- **PR automation workflow improvements** — Added PR labeling rules and research/* label automation to prevent duplicate labeling. ([PR #1191](https://github.com/lightspeedwp/.github/pull/1191) — *docs: Add PR automation workflow audit framework + fix research/\* label automation*)

- **16 new specialist agents** — Expanded agent portfolio with 16 new specialist agents in agents directory for expanded capability coverage. ([PR #1040](https://github.com/lightspeedwp/.github/pull/1040) — *feat: add 16 new specialist agents to agents directory*)

- **Phase 2B Skills Audit completion** — Comprehensive audit of Batch 2-3 agents completed (11 agents, 258 skills) with full skill inventory, conflict analysis, and classification framework. ([PR #1284](https://github.com/lightspeedwp/.github/pull/1284) — *audit(phase-2b): Complete skills audit for Batch 2-3 agents (11 agents, 258 skills)*)

- **Expand documentation standards** — Added GitHub template governance for agents. ([PR #1082](https://github.com/lightspeedwp/.github/pull/1082))

- **Changelog automation hardening (Phase 2)** — Rebuilt lost history from 76 PRs (May 24–July 24), implemented format validation rules, integration tests for section header preservation, and contributor guidelines. Created comprehensive automation documentation with validation, testing, and release integration guidance. ([PR #1281](https://github.com/lightspeedwp/.github/pull/1281) — *chore(changelog): rebuild lost history & apply phase 2*, [#1271](https://github.com/lightspeedwp/.github/issues/1271))

- **Workflows consolidation Phase 1B completion** — Consolidated changelog and metrics workflow suites into unified management workflows (Phase 1B.i and Phase 1B.ii), eliminating scheduling gaps and reducing configuration complexity. ([PR #1280](https://github.com/lightspeedwp/.github/pull/1280) — *refactor: Consolidate changelog management workflows (Phase 1B.i)*, [PR #1282](https://github.com/lightspeedwp/.github/pull/1282) — *refactor: Consolidate metrics collection and reporting workflows (Phase 1B.ii)*, [PR #1286](https://github.com/lightspeedwp/.github/pull/1286) — *refactor(workflows): consolidate changelog & metrics workflows (Phase 1B)*, [#1227](https://github.com/lightspeedwp/.github/issues/1227))

- **Schema consolidation and PLAN-EXPANDED updates** — Fixed schema compliance issues and documented previously-completed Batch 2-3 standardization work with expanded planning documentation. ([PR #1285](https://github.com/lightspeedwp/.github/pull/1285) — *docs(standards): Fix PLAN-EXPANDED.md schema compliance and document Batch 2-3 agent standardization*)

### Changed

- **Harden Gitleaks (pins & checksums)** — Pinned version, SHA verification, explicit permissions. ([PR #1455](https://github.com/lightspeedwp/.github/pull/1455), [#1454](https://github.com/lightspeedwp/.github/issues/1454))

- **Routine dependency updates** — Multiple rounds of security and feature updates across project dependencies including TypeScript (5.9.3 → 7.0.2), markdownlint-cli2 (0.19.0 → 0.23.1), Svelte ecosystem updates (5.56.3 → 5.56.6 in website), Astro framework (6.4.8 → 7.1.3), and GitHub Actions (setup-node 4 → 7, mergifyio/gha-mergify-ci 22 → 24). ([PR #1027](https://github.com/lightspeedwp/.github/pull/1027) — *chore(deps-dev): bump lint-staged from 17.0.7 to 17.0.8*, [PR #1030](https://github.com/lightspeedwp/.github/pull/1030) — *chore(deps): bump svelte from 5.56.3 to 5.56.4 in /website*, [PR #1032](https://github.com/lightspeedwp/.github/pull/1032) — *chore(deps-dev): bump markdownlint-cli2 from 0.19.0 to 0.23.0*, [PR #1034](https://github.com/lightspeedwp/.github/pull/1034) — *chore(deps): bump @astrojs/svelte from 8.1.2 to 9.0.1 in /website*, [PR #1035](https://github.com/lightspeedwp/.github/pull/1035) — *chore(deps-dev): bump @typescript-eslint/parser from 8.61.1 to 8.62.1*, [PR #1037](https://github.com/lightspeedwp/.github/pull/1037) — *chore(deps): bump marked from 18.0.5 to 18.0.6 in /website*, [PR #1038](https://github.com/lightspeedwp/.github/pull/1038) — *chore(deps): bump astro from 6.4.8 to 7.0.7 in /website*, [PR #1048](https://github.com/lightspeedwp/.github/pull/1048) — *chore(deps): bump mergifyio/gha-mergify-ci from 22 to 23*, [PR #1049](https://github.com/lightspeedwp/.github/pull/1049) — *chore(deps): bump actions/setup-node from 4 to 7*, [PR #1050](https://github.com/lightspeedwp/.github/pull/1050) — *chore(deps-dev): bump typescript from 5.9.3 to 7.0.2*, [PR #1051](https://github.com/lightspeedwp/.github/pull/1051) — *chore(deps-dev): bump markdownlint-cli2 from 0.23.0 to 0.23.1*, [PR #1052](https://github.com/lightspeedwp/.github/pull/1052) — *chore(deps): bump svelte from 5.56.5 to 5.56.6 in /website*, [PR #1053](https://github.com/lightspeedwp/.github/pull/1053) — *chore(deps): bump astro from 7.0.9 to 7.1.0 in /website*, [PR #1056](https://github.com/lightspeedwp/.github/pull/1056) — *chore(deps): bump astro from 7.0.9 to 7.1.3 in /website*, [PR #1060](https://github.com/lightspeedwp/.github/pull/1060) — *chore(deps): bump marked from 18.0.6 to 18.0.7 in /website*, [PR #1061](https://github.com/lightspeedwp/.github/pull/1061) — *chore(deps-dev): bump @typescript-eslint/eslint-plugin from 8.64.0 to 8.65.0*, [PR #1062](https://github.com/lightspeedwp/.github/pull/1062) — *chore(deps-dev): bump prettier from 3.9.5 to 3.9.6*, [PR #1063](https://github.com/lightspeedwp/.github/pull/1063) — *chore(deps-dev): bump @typescript-eslint/parser from 8.64.0 to 8.65.0*, [PR #1064](https://github.com/lightspeedwp/.github/pull/1064) — *chore(deps-dev): bump lint-staged from 17.0.8 to 17.1.1*, [PR #1065](https://github.com/lightspeedwp/.github/pull/1065) — *chore(deps-dev): bump @stoplight/spectral-cli from 6.16.1 to 6.16.2*)

- **Harden Dependabot automation** — Enhanced auto-merge via Mergify. ([PR #1059](https://github.com/lightspeedwp/.github/pull/1059))

- **Optimise Actions Phase 2** — Reduced consumption across workflows. ([PR #1057](https://github.com/lightspeedwp/.github/pull/1057))

- **Babel toolchain upgraded to 8.x** — Major version bump with peer-dependency requirements. Removed deprecated proposal plugins (natively handled by preset-env now). ([PR #1044](https://github.com/lightspeedwp/.github/pull/1044) — *chore(deps): upgrade Babel toolchain to 8.x (coordinated migration)*)

- **Upgrade ESLint to 10.x** — Major bump with 25 violations fixed. ([PR #1046](https://github.com/lightspeedwp/.github/pull/1046))

- **Upgrade js-yaml to 5.x** — Updated version. ([PR #1047](https://github.com/lightspeedwp/.github/pull/1047))

- **Upgrade @typescript-eslint** — Version bump. ([PR #1045](https://github.com/lightspeedwp/.github/pull/1045))

- **GitHub Actions minute optimisation** — Reduced duplicate CI and high-fanout workflow triggers, strengthened concurrency cancellation. ([PR #1054](https://github.com/lightspeedwp/.github/pull/1054) — *ci: reduce Actions minute consumption and add savings watcher*)

- **Branch cleanup automation** — Added reusable cleanup script, weekly scheduled workflow, and report generation for stale merged branches with safety guardrails. ([PR #1067](https://github.com/lightspeedwp/.github/pull/1067) — *Add scheduled branch cleanup automation and reporting*, [#1066](https://github.com/lightspeedwp/.github/issues/1066))

### Changed

- **Reorganize label-prefix audit to active projects** — Moved label-prefix audit project artifacts from reports directory to active projects following active work convention. ([PR #1625](https://github.com/lightspeedwp/.github/pull/1625))

- **Phase 3D - Reports Placement Enforcement** — Enforced reports placement in `.github/reports/` directory with validation to prevent misplaced artifacts following Phase 3D standards. ([PR #1581](https://github.com/lightspeedwp/.github/pull/1581), [#1290](https://github.com/lightspeedwp/.github/issues/1290))

- **Phase 3C - Agent Reorganization and Two-Tier Structure** — Completed Phase 3C restructuring establishing two-tier agent architecture with 19 spec-based (GitHub-native) agents in `.github/agents/` and 16 portable multi-file agents in root `agents/`. ([PR #1583](https://github.com/lightspeedwp/.github/pull/1583), [#1290](https://github.com/lightspeedwp/.github/issues/1290))

- **Phase 3A - Instructions Migration and Consolidation** — Migrated portable instruction files from `.github/instructions/` to root `instructions/` directory establishing clear portable/control-plane separation. ([PR #1582](https://github.com/lightspeedwp/.github/pull/1582), [#1290](https://github.com/lightspeedwp/.github/issues/1290))

- **Complete Phase 2B script migration (Batches 1-3)** — Migrated 117 portable scripts from `.github/scripts/` to root `scripts/` directory with full path reference updates (Batches 1-3 complete). ([PR #1528](https://github.com/lightspeedwp/.github/pull/1528))

- **Migrate agent utilities to portable location (Phase 2B Batch 2)** — Migrated shared agent utility functions and libraries to portable location under `agents/` directory following Phase 2B plan. ([PR #1518](https://github.com/lightspeedwp/.github/pull/1518))

- **Phase 2B Batch 1 — Move validation scripts to root** — Migrated validation scripts from `.github/scripts/validation/` to portable root `scripts/validation/` location with reference updates. ([PR #1504](https://github.com/lightspeedwp/.github/pull/1504))

- **Phase 2 governance updates with Phase 1 audit findings** — Updated governance documentation with comprehensive Phase 1 audit findings, consolidation status, and remediation paths for remaining phases. ([PR #1534](https://github.com/lightspeedwp/.github/pull/1534), [#1295](https://github.com/lightspeedwp/.github/issues/1295))

- **Post-merge governance refinements** — Applied governance refinements, corrected naming conventions, and updated standards documentation following Phase 2 major merges. ([PR #1516](https://github.com/lightspeedwp/.github/pull/1516), [#1515](https://github.com/lightspeedwp/.github/issues/1515))

- **Update active project statuses and phase progress** — Updated active project documentation reflecting completion of Phase 1-2 work and progress toward Phase 3 completion. ([PR #1514](https://github.com/lightspeedwp/.github/pull/1514))

- **Document ESLint fixes and footer automation issues** — Documented ESLint fixes applied during linting phase and identified footer automation issues for follow-up. ([PR #1519](https://github.com/lightspeedwp/.github/pull/1519), [#1486](https://github.com/lightspeedwp/.github/issues/1486))

### Removed

- **Remove checksums.sha256 manifest** — Removed unverified checksum manifest. ([PR #1392](https://github.com/lightspeedwp/.github/pull/1392), [#1394](https://github.com/lightspeedwp/.github/issues/1394))

- **Legacy README workflows (Phase 2.4 consolidation)** — Removed three legacy README management workflows (`readme-audit.yml`, `readme-regen.yml`, `readme-update.yml`) consolidated into unified `documentation.yml` workflow. Eliminates 449 lines of code duplication (~44% reduction for README workflows), saves ~3-4 min/month GitHub Actions execution time, and establishes single source of truth for README validation logic. Push trigger re-enabled in `documentation.yml` following consolidation. ([PR #1317](https://github.com/lightspeedwp/.github/pull/1317) — *chore(workflows): cleanup legacy README workflows (Phase 2.4)*, [Epic #1227](https://github.com/lightspeedwp/.github/issues/1227), [#1310](https://github.com/lightspeedwp/.github/issues/1310))

### Fixed

- **Harden documentation.yml workflow** — Scoped permissions, fixed report accuracy. ([PR #1387](https://github.com/lightspeedwp/.github/pull/1387), [#1386](https://github.com/lightspeedwp/.github/issues/1386))

- **Changelog: Headers destroyed on merge** — Merge-entries workflow discarded section headers during deduplication. Fixed deduplication logic to preserve headers. ([PR #1276](https://github.com/lightspeedwp/.github/pull/1276), [#1275](https://github.com/lightspeedwp/.github/issues/1275))

- **Fix Playwright docs** — Fixed schema path and layout assumptions. ([PR #1392](https://github.com/lightspeedwp/.github/pull/1392), [#1395](https://github.com/lightspeedwp/.github/issues/1395))

- **Changelog: Headers destroyed** — Fixed merge-entries deduplication logic to preserve section headers. ([PR #1276](https://github.com/lightspeedwp/.github/pull/1276), [#1275](https://github.com/lightspeedwp/.github/issues/1275))

- **Meta-agent: npm dependency fix** — Added missing npm ci step and routed commits through PR. ([PR #1073](https://github.com/lightspeedwp/.github/pull/1073), [#1072](https://github.com/lightspeedwp/.github/issues/1072))

- **Validation: Footer truncation fix** — Fixed data loss bug in replaceFooterTail(). ([PR #1123](https://github.com/lightspeedwp/.github/pull/1123), [#1118](https://github.com/lightspeedwp/.github/issues/1118))

- **Milestone capacity: Type exclusion filtering not implemented** — Configured type exclusions (chore, task, docs) were not applied when counting issues toward capacity limits. Implemented type-based filtering. ([PR #1132](https://github.com/lightspeedwp/.github/pull/1132) — *fix(milestones): implement capacity exclusion filtering*, [#1131](https://github.com/lightspeedwp/.github/issues/1131))

- **CI linting workflow blockers** — Consolidated duplicate checks and fixed invalid YAML structure in cleanup-branches.yml workflow. ([PR #1159](https://github.com/lightspeedwp/.github/pull/1159) — *ci: fix linting workflow blockers — consolidate duplicate checks, exclude temporary directories*, [PR #1075](https://github.com/lightspeedwp/.github/pull/1075) — *fix(ci): add missing steps key in cleanup-branches.yml*, [#1074](https://github.com/lightspeedwp/.github/issues/1074))

- **Mergify config: Invalid speculative_checks field** — Removed unsupported field that was causing Mergify's status checks to permanently fail on all PRs. ([PR #1077](https://github.com/lightspeedwp/.github/pull/1077) — *fix(ci): remove unsupported speculative\_checks field from mergify.yml*, [#1076](https://github.com/lightspeedwp/.github/issues/1076))

- **Branch cleanup automation: Safety hardening** — Fixed four critical safety issues: daysSince() date handling, isMerged() false positives, deleteLocalBranch() force-delete risk, and error handling for invalid patterns. ([PR #1071](https://github.com/lightspeedwp/.github/pull/1071) — *fix: improve branch cleanup safety and robustness*, [#1069](https://github.com/lightspeedwp/.github/issues/1069))

- **Meta-agent workflow: Branch name accumulation** — Fixed branch naming to prevent PR accumulation and added Mergify rule. ([PR #1138](https://github.com/lightspeedwp/.github/pull/1138) — *fix(meta): use fixed branch name to prevent PR accumulation + add mergify rule*)

- **YAML deprecation and footer validation** — Resolved js-yaml 5.x safeLoad deprecation and fixed false positives in footer validation. ([PR #1137](https://github.com/lightspeedwp/.github/pull/1137) — *fix(ci): resolve yaml.safeLoad deprecation and footer validation false positives*)

- **Priority field vocabulary reconciliation** — Reconciled conflicting Priority field values and added regression test. ([PR #1148](https://github.com/lightspeedwp/.github/pull/1148) — *fix: reconcile Priority field vocabulary + add parity regression test*)

- **Project-meta-sync secret-gating** — Made GitHub App secret gating explicit to fail loudly on configuration errors instead of silently. ([PR #1150](https://github.com/lightspeedwp/.github/pull/1150) — *build: make project-meta-sync secret-gating explicit (fail loud, not silent)*)

- **CI template enforcement: Re-fetch live issue state** — Fixed stale issue state being used in template enforcement guards. ([PR #1086](https://github.com/lightspeedwp/.github/pull/1086) — *fix(ci): re-fetch live issue state in template-enforcement guards*, [#1085](https://github.com/lightspeedwp/.github/issues/1085))

- **Meta-agent: Honour --dry-run flag** — Fixed dry-run mode not being honoured in footer, badges, and metrics writes. ([PR #1084](https://github.com/lightspeedwp/.github/pull/1084) — *fix: honour --dry-run in meta.agent.js footer, badges, and metrics writes*, [#1083](https://github.com/lightspeedwp/.github/issues/1083))

- **CI label governance: Missing labels** — Added missing type label aliases and removed non-existent labels from governance configuration. ([PR #1202](https://github.com/lightspeedwp/.github/pull/1202) — *fix(ci): add missing aliases for type labels*, [PR #1203](https://github.com/lightspeedwp/.github/pull/1203) — *fix(ci): remove non-existent comp:help-tabs from label governance*)

- **Template enforcement: Silent issue reopening** — Replaced silent reopening with guidance comment and status:needs-more-info label for incomplete issues. ([PR #1201](https://github.com/lightspeedwp/.github/pull/1201) — *fix(ci): replace silent reopening with guidance comment and label*, [#1014](https://github.com/lightspeedwp/.github/issues/1014))

- **Footer cleanup and validation** — Comprehensive footer format standardization and validation improvements. ([PR #1115](https://github.com/lightspeedwp/.github/pull/1115) — *fix: footer cleanup and validation*)

- **Babel peer-dependency conflict resolution** — Fixed critical npm ci blocker caused by Babel 8.x peer-dependency constraints, enabling consistent builds across development environments. ([PR #1043](https://github.com/lightspeedwp/.github/pull/1043) — *fix(deps): resolve Babel peer-dependency conflict blocking npm ci*)

- **Documentation: Schema & AI standards** — Added schema consolidation and AI reference standards documentation. ([PR #1211](https://github.com/lightspeedwp/.github/pull/1211), [PR #1221](https://github.com/lightspeedwp/.github/pull/1221), [PR #1222](https://github.com/lightspeedwp/.github/pull/1222))

- **Agent skills docs pipeline** — Fixed workflow configuration for documentation generation. ([PR #1204](https://github.com/lightspeedwp/.github/pull/1204))

- **GitHub Actions: Workflow hardening** — Applied dependency, error handling, and security improvements. ([PR #1127](https://github.com/lightspeedwp/.github/pull/1127), [PR #1130](https://github.com/lightspeedwp/.github/pull/1130), [PR #1133](https://github.com/lightspeedwp/.github/pull/1133))

## [0.6.0] - 2026-06-19

### Added

- **Issue automation hardening** — Expanded `checklist-finalisation.yml` to auto-tick `Steps / Checklist` and `Acceptance Criteria` sections on issue close (previously only DoR/DoD were covered). Added `enforce-close-guard` job to `template-enforcement.yml`: issues closed as "completed" that are missing DoR/DoD sections or still carry `status:needs-more-info` are automatically re-opened with an explanation comment. Activated `issues.agent.js` apply mode — the workflow now writes `status:needs-triage`, `priority:normal`, and a detected `type:*` label to newly opened issues when those label categories are not already present; updated `issues.yml` permissions from `issues: read` to `issues: write`. ([#1014](https://github.com/lightspeedwp/.github/issues/1014))

- **GitHub Merge Queue support** — Added `merge_group: types: [checks_requested]` trigger to `checks.yml`, `validate-pr-template.yml`, and `main-branch-guard.yml` so required status checks fire correctly inside GitHub's Merge Queue. Skipped branch-name validation for `merge_group` runs and updated the changed-files comparison to use merge-queue SHAs. Added `merge_queue` rule (ALLGREEN grouping, 60-minute check timeout) to both `develop` and `main` branch rulesets. ([PR #1008](https://github.com/lightspeedwp/.github/pull/1008) — *ci(workflows): add merge\_group trigger to unblock GitHub Merge Queue*, [Issue #1008](https://github.com/lightspeedwp/.github/issues/1008))

- **Mermaid WCAG 2.2 AA colour contrast validation** — Added `scripts/validation/validate-mermaid-colour-contrast.js` which checks every `style` declaration in Mermaid diagrams against a pre-verified WCAG 2.2 AA palette (minimum 4.5:1 contrast ratio). The validator supports `--changed-files` scoping for CI efficiency, flags unparseable hex values as errors, strips inline `%%` comments before parsing, and generates a dated markdown report under `.github/reports/mermaid/`. Added `npm run validate:mermaid-contrast` script. Updated `.github/workflows/validate-mermaid-pr.yml` to run all three diagram checks (syntax, accessibility, contrast) on every PR that modifies `.md`/`.mdx` files, posting a consolidated status comment. Updated `instructions/mermaid.instructions.md` with the approved seven-role WCAG AA palette and required structure. Fixed all existing diagram `style` declarations across `README.md`, `docs/AGENT_CREATION.md`, `profile/README.md`, `scripts/README.md`, `tests/README.md`, and `.github/ISSUE_TEMPLATE/README.md` to use the approved palette triples (`fill`, `color`, `stroke`). ([PR #977](https://github.com/lightspeedwp/.github/pull/977) — *feat(mermaid): WCAG 2.2 AA colour contrast validation and updated diagram standards*, [#976](https://github.com/lightspeedwp/.github/issues/976))

- **Claude Code session-start hook** — Added `.claude/hooks/session-start.sh` and `.claude/settings.json` to install npm dependencies and auto-rename auto-generated `claude/` prefixed branches (forbidden by `CLAUDE.md`) to valid `chore/session-{hash}` names at the start of every remote session. Prevents forbidden branch names from ever reaching a commit and reduces manual cleanup overhead. ([PR #984](https://github.com/lightspeedwp/.github/pull/984) — *feat(ops): session-start hook — install deps and enforce branch naming*)

### Fixed

- **Dependabot auto-merge unblocked** — Fixed Mergify configuration that prevented all dependabot PRs from being automatically merged: consolidated the redundant security/non-security rules into one, replaced the invalid `approve:` action with `review: type: APPROVE` (which satisfies branch-protection review requirements), and added a `dependabot-automerge.yml` GitHub Actions backup workflow that approves and enables squash auto-merge via `workflow_run` when CI passes on a dependabot PR. ([#1020](https://github.com/lightspeedwp/.github/pull/1020), relates to [#968](https://github.com/lightspeedwp/.github/issues/968))
- **Release agent hardening** — Fixed four bugs in `scripts/agents/release.agent.js`: (1) regex escape `\\d+` → `\d+` in `getMergedPRs` so PR numbers are correctly extracted from `git log`; (2) automated release PR body now includes all three sections (`## Linked issues & merged PRs`, `## Changelog`, `### Checklist (Global DoD / PR)`) required by the main-branch-guard; (3) `createReleasePR` (shell provider) now writes the body to a temp file and uses `--body-file` to avoid shell injection from backtick-containing markdown; (4) corrected Husky v9 command from `npx husky run pre-commit` to `npx lint-staged`. Added full test suites for `changelogUtils.cjs`, `validate-main-branch-pr.cjs`, and `release.agent.js` (ESM subprocess pattern); rewrote the stub in `validate-changelog.test.js` with real CLI and integration tests. Clarified the `develop → release/vX.Y.Z → main` flow in the release issue template. ([#1018](https://github.com/lightspeedwp/.github/pull/1018), [#968](https://github.com/lightspeedwp/.github/issues/968))

### Changed

- **Release issue template rewrite (v2.0.0)** — Rewrote `.github/ISSUE_TEMPLATE/18-release.md` with step-by-step release initiation commands, changelog validation steps, dry-run and live release instructions, explicit squash-merge warning, open PR tracking section, rollback commands, and expanded Definition of Ready/Done. Aligns template with the release process documented in issue #968. ([#1021](https://github.com/lightspeedwp/.github/pull/1021), [#968](https://github.com/lightspeedwp/.github/issues/968))
- **Frontmatter standardisation across issue templates, docs, and validation** — Normalised markdown issue templates to use `name` + `about`, aligned the frontmatter schema and validation scripts with the GitHub-supported template contract, and updated the issue-creation workflow plus related docs, instructions, and prompts to match the canonical template layout. ([#1016](https://github.com/lightspeedwp/.github/pull/1016), [#1012](https://github.com/lightspeedwp/.github/issues/1012), [#1015](https://github.com/lightspeedwp/.github/issues/1015))
- **Automation governance for Dependabot PRs and branding footers** — Stopped the metadata sync flow from auto-creating a milestone for each Dependabot PR, switched footer detection to the canonical branding config with tail-aware matching, and backfilled branded markdown footers across the repository. Updated the related CI, workflow, and documentation surfaces to keep the behaviour durable. ([#1010](https://github.com/lightspeedwp/.github/issues/1010), [#1013](https://github.com/lightspeedwp/.github/pull/1013))
- **Metadata governance automation for issues and pull requests** — Added and hardened the GitHub automation that assigns project items, milestones, assignees, issue/PR relationships, project field values, and labelling behaviour for new issues and pull requests. Also updated the related docs, workflow guards, and test coverage to match the current codebase. ([#974](https://github.com/lightspeedwp/.github/pull/974))
- **Community health audit — PR templates, governance docs, and README alignment** — Completed a comprehensive audit of all community health files: updated WCAG version references from 2.1 to 2.2 AA in `pr_bug.md`, `pr_chore.md`, `pr_ci.md`, and `pr_dep_update.md`; added 15 missing branch-prefix rows to the default `pull_request_template.md` quick-selector table to align with `PULL_REQUEST_TEMPLATE/config.yml`; expanded `AGENTS.md` issue template list from 10 to 23 entries and added Saved Replies section; expanded `CLAUDE.md` issue template list to match; fixed template count, range, and parity note in `.github/custom-instructions.md`; completely rewrote `.github/workflows/README.md` with an accurate inventory of all 27 real workflows (removed 4 phantom workflow references); updated `.github/README.md` version date; added 20 missing files to `.github/SAVED_REPLIES/README.md`; added template index table to `.github/ISSUE_TEMPLATE/README.md`; replaced generic category list with the 9 actual YAML file inventory in `.github/DISCUSSION_TEMPLATE/README.md`; updated `docs/ISSUE_CREATION_GUIDE.md` to 25-template parity and corrected label values. ([#966](https://github.com/lightspeedwp/.github/pull/966))
- **Mermaid validator hardened to reject `accTitle`/`accDescr` placed before diagram type** — Added a guard in `scripts/validation/validate-mermaid-accessibility.js` that rejects any Mermaid block where `accTitle` or `accDescr` appears before the diagram type declaration (e.g. `flowchart TD`). Corrected all 20 affected diagrams across 9 files (`.github/instructions/.archive/frontmatter.instructions.md`, `.github/instructions/.archive/tests.instructions.md`, `.github/reports/mermaid/diagram-validation-2025-12-11.md`, `CONTRIBUTING.md`, `docs/HUSKY_PRECOMMITS.md`, `instructions/automation.instructions.md`, `instructions/documentation-formats.instructions.md`, `instructions/linting.instructions.md`, `instructions/quality-assurance.instructions.md`) to place the diagram type first. 60/60 diagrams are now compliant.
- **Mermaid YAML front-matter converted to inline accessibility syntax** — Replaced all Mermaid `---` YAML front-matter blocks (unsupported by GitHub's renderer) with inline `accTitle` and `accDescr` attributes placed directly after the diagram type declaration. Affected files: `.github/ISSUE_TEMPLATE/README.md`, `.github/README.md`, `.github/prompts/update-mermaid-diagrams.prompt.md`, `.github/reports/audits/2026-06-03-file-organisation-migration-plan-673.md`, `.vscode/README.md`, `docs/AGENT_CREATION.md`, `docs/CANONICAL_CONFIGS_GUIDE.md`. Updated `scripts/validation/validate-mermaid-accessibility.js` to ignore `.claude/**` worktree directories and use a regex for `accDescr {` block detection. Updated `instructions/mermaid.instructions.md` to explicitly forbid YAML front-matter syntax. Closes [#991](https://github.com/lightspeedwp/.github/issues/991). ([#995](https://github.com/lightspeedwp/.github/pull/995))
- **`label-sync.js` crash on YAML-ambiguous hex color values** — YAML parses bare hex strings such as `8957E5` (parsed as scientific notation `895700000`) and `007580` (parsed as integer `7580`) as numbers, causing `labelObj.color.replace is not a function` in the Unified Labeling workflow. Quoted all affected `color:` values in `.github/labels.yml` and added `String()` coercion in `scripts/agents/includes/label-sync.js` as defence-in-depth. ([#995](https://github.com/lightspeedwp/.github/pull/995))
- **Repository-wide Mermaid accessibility and contrast coverage** — Added `accTitle` and `accDescr` to every Mermaid diagram in the repository, updated the Mermaid prompt/instructions/workflows to enforce the approved contrast-safe palette, and added repository-wide syntax, accessibility, and colour-contrast validators. Closes [#986](https://github.com/lightspeedwp/.github/issues/986). ([#987](https://github.com/lightspeedwp/.github/pull/987))
- **Repository-wide Mermaid diagram WCAG 2.2 AA colour-contrast sweep** — Applied the approved 7-role semantic palette (`fill`/`color`/`stroke` triples, all ≥ 4.5:1 in light and dark mode) to all Mermaid diagrams across 47 Markdown files. Eliminates the dark-mode white-text-on-pastel contrast failures identified by the new `validate-mermaid-colour-contrast` validator introduced in [#977](https://github.com/lightspeedwp/.github/pull/977). ([#982](https://github.com/lightspeedwp/.github/pull/982))
- **Template enforcement now skips Dependabot merged PRs** — Updated the push-side template guardrail so Dependabot-authored merged pull requests are not blocked by standard PR template enforcement, matching the PR-side skip already in place. ([#972](https://github.com/lightspeedwp/.github/pull/972))
- **Issue template alignment: add `about` field, align with 25 org issue types, and polish** — Added the required GitHub `about` frontmatter field to all issue templates, resolving the "About can't be blank" critical error in the new-issue chooser. Replaced the non-standard `User Experience Feedback` template with a `Chore` template to match the organisation's 25 canonical issue types; removed the `Help / Support` template (not an org type). Standardised `about` field punctuation across all templates. Bumped `version` and `last_updated` frontmatter on all changed files per freshness policy. Updated `config.yml` inventory note. ([#965](https://github.com/lightspeedwp/.github/issues/965), [#966](https://github.com/lightspeedwp/.github/pull/966))
- **Awesome GitHub Site Phase 14: Full light/dark token audit** — Final systematic audit of every CSS colour value in the Awesome GitHub site against `AWESOME_GITHUB_THEME_TOKENS_SPEC.md`. All deviations fixed across 7 files. Hero sections on catalogue, tools, learn, and lesson pages now use `var(--bg)` + `var(--fg-1)` instead of hardcoded dark gradients. `.ag-action-btn--primary` changed from `var(--accent)` to `var(--c-brand-blue)` (spec mandates btn-primary never uses `--accent`). Status/type badges converted from `rgba()` hardcodes to `color-mix(in srgb, var(--c-status-*) …, transparent)`. Progress bar tracks now use `var(--panel-2)` + `var(--hair)` per §3.6 spec. `SearchPalette` hover states refactored to new `--overlay-hover` token (eliminates dark-mode overrides). Fixed `.lesson-h1` white-on-white visibility bug in light mode. WCAG AA contrast corrected: `.ag-status-active` and `.tb-script` switched from `--c-status-success-2` (#22C55E, ~2.3:1) to `--c-status-success` (#16A34A, ≥4.5:1). Added `--c-type-pack` and `--c-type-schema` palette tokens; added `--overlay-hover` surface token. `npm run build` exits 0 at 333 pages. ([#891](https://github.com/lightspeedwp/.github/issues/891), [#892](https://github.com/lightspeedwp/.github/pull/892))
- **Awesome GitHub Site Phase 12: Editorial pages missing header/footer** — All 7 Phase 12 editorial pages (`getting-started`, `why`, `onboarding`, `references`, `glossary/index`, `glossary/[term]`, `404`) were using `BaseLayout` (an HTML-only scaffold with no nav or footer). Switched all to `AwesomeGithubLayout` which provides `<Header />`, `<AwesomeGithubFooter />`, skip-to-content link, and theme initialisation. Removed now-redundant inner `<main>` wrappers. Fixed hardcoded hex colours in `getting-started.astro` `.run-pill`. ([#887](https://github.com/lightspeedwp/.github/issues/887), [#888](https://github.com/lightspeedwp/.github/pull/888))

### Added

- **Mergify flaky test detection** — Added `.github/workflows/flaky-test-detection.yml` to detect flaky Jest unit tests via Mergify CI. Runs 5 parallel matrix jobs every 12 hours on weekdays and uploads JUnit XML results to Mergify using `mergifyio/gha-mergify-ci@v14` with `flaky_test_detection: true`. ([#979](https://github.com/lightspeedwp/.github/issues/979))

- **Branch Governance Hardening** — Converts advisory branching rules into machine-enforceable controls across three layers. Added GitHub Ruleset JSON files for `develop` and `main` with application instructions (`scripts/validation/rulesets/`). Extended `scripts/validation/validate-branch-name.js` with a `--base` flag for merge-target policy enforcement (only `release/*` and `hotfix/*` may target `main`) and branch-reuse detection via git log and `CHANGELOG.md` references. Added 35-test Jest suite covering naming, base-branch policy, and reuse prevention. Updated `AGENTS.md` and `CLAUDE.md` with Branch Governance and Branch Reuse Prevention sections. ([#898](https://github.com/lightspeedwp/.github/issues/898), [#899](https://github.com/lightspeedwp/.github/issues/899), [#900](https://github.com/lightspeedwp/.github/issues/900), [#901](https://github.com/lightspeedwp/.github/issues/901), [PR #915](https://github.com/lightspeedwp/.github/pull/915) — *ops(governance): harden branch naming, merge-target and reuse enforcement*)

- **Issue Template Frontmatter Policy** — Documented the decision to keep frontmatter in issue templates (no stripping). Updated `docs/ISSUE_CREATION_GUIDE.md` with frontmatter retention rationale. Fixed regex in `scripts/agents/includes/check-template-labels.js` to correctly strip bracket characters without an invalid character class. Updated `docs/AUTOMATION.md` and `.github/custom-instructions.md` with alignment notes. ([#880](https://github.com/lightspeedwp/.github/issues/880), [PR #893](https://github.com/lightspeedwp/.github/pull/893) — *docs: codify issue template frontmatter policy (#880)*)

- **Template Enforcement Governance Closeout** — Added the canonical PR routing map, refreshed the root PR router and governance guidance, updated the template-enforcement workflow and fixtures, and split the remaining organisation-admin checks into `REMOTE_ADMIN_CHECKS.md`. ([PR #955](https://github.com/lightspeedwp/.github/pull/955) — *Align template governance routing*)

- **Test Coverage Implementation Phase 3: Linting agent coverage** — Replaced the linting agent stub with a deterministic helper surface for lint target parsing, rule selection, findings grouping, report formatting, config loading, cache isolation, and async orchestration. Added a focused Jest suite that covers parsing, selection ordering, invalid config handling, malformed findings, empty-input handling, and repository-wide lint/test validation. ([#935](https://github.com/lightspeedwp/.github/issues/935))

- **Test Coverage Implementation Phase 2: Metrics agent coverage** — Added a pure, testable metrics-agent helper module with repository-level aggregation, issue and pull request metric calculations, markdown/CSV report generation, date-range filtering, and multi-repository support. Added a focused Jest suite that covers the collection, aggregation, reporting, and error-handling paths for `scripts/agents/metrics.agent.js`. ([#934](https://github.com/lightspeedwp/.github/issues/934))

- **Plugin Pack Waves: WordPress 10-plugin catalogue and AI readiness assessor planning set** — Expanded `.github/projects/active/plugin-pack-waves/` from legacy wave scaffolding into a complete WordPress-focused planning pack with a ten-plugin catalogue (P01-P10), issue draft files, OpenSpec strict proposal inputs, execution controls (`ISSUE_EXECUTION_PLAN.md`, `ISSUE_REGISTER.md`, `RUN_LOG.md`), and linked GitHub issues [#940](https://github.com/lightspeedwp/.github/issues/940) through [#950](https://github.com/lightspeedwp/.github/issues/950), including the new **WP AI Readiness Assessor** task for WordPress site readiness evaluation. ([PR #951](https://github.com/lightspeedwp/.github/pull/951) — *feat: expand plugin-pack-waves to 10 WordPress plugin tasks and AI readiness assessor*)

- **Awesome GitHub Site Phase 06: Wapuu mascot system** — Added a reusable `WapuuHero` Astro component with a canonical page-type mapping, copied the three confirmed Wapuu assets into `website/public/assets/wapuus/`, and wired the learn, cookbook, tools, and catalogue hero sections to render the correct mascot with responsive hiding at ≤860px and decorative accessibility attributes. ([#864](https://github.com/lightspeedwp/.github/issues/864))

- **Awesome GitHub Site Phase 07: Catalogue list pages with filter bar and Wapuu hero** — Replaced the old catalogue index with a spec-aligned `/c/[cat]` route, added the shared Wapuu hero component, introduced tag-chip filtering with AND logic, and surfaced the category type note and install-action cards for all eight catalogue pages. ([#866](https://github.com/lightspeedwp/.github/issues/866), [PR #867](https://github.com/lightspeedwp/.github/pull/867) — *feat(ag-p07): 8 catalogue list pages — hero, filter bar, item grid*)

- **Awesome GitHub Site Phase 05: Homepage all 5 blocks wired to live data** — Rebuilt the homepage with the spec-aligned hero, live catalogue counts, feature strip, and Cook+Learn cards. Added the typed catalogue exports used by the homepage counts, copied the Wapuu assets into `website/public/assets/wapuus/`, and added an `onboarding/` alias that redirects to `getting-started/` for the primary CTA. ([#861](https://github.com/lightspeedwp/.github/issues/861), [PR #862](https://github.com/lightspeedwp/.github/pull/862) — *feat(ag-p05): homepage — all 5 blocks wired to live data*)

- **Awesome GitHub Site Phase 13: Search command palette** — Site-wide ⌘K search palette (`website/src/components/SearchPalette.astro` + `website/src/scripts/search.js`) added to `AwesomeGithubLayout`. Build-time JSON index of all catalogue items serialised into a `data-items` attribute. Empty query shows 7 Popular items; typed query uses multi-word AND substring matching across name, description, tags, and category (capped at 12 results). Keyboard navigation (↑↓ arrow keys, Enter to open result, Escape to close, Tab focus-trap between input, close button, and result items). Fully accessible: `role="dialog"`, `aria-modal`, `aria-selected`, focus returns to trigger on dismiss. ([#764](https://github.com/lightspeedwp/.github/issues/764), [#889](https://github.com/lightspeedwp/.github/pull/889))

- **Awesome GitHub Site Phase 11: Tools page + Phosphor Icons sitewide** — Standalone `/c/tools.astro` with astropuu Wapuu hero, section nav pills (AI Defaults, Scripts, Schemas, Config & Setup), and a build-time Phosphor icon loader (`website/src/lib/phosphor.ts`) using `createRequire` for robust package resolution. Updated `Icon.astro` with `ph:` prefix routing to load any Phosphor icon at SSG time. Migrated item card and type badge styles into `global.css` for reuse across catalogue and tools pages. Updated all category, nav, learn, and home icons to Phosphor equivalents sitewide. ([#885](https://github.com/lightspeedwp/.github/issues/885), [PR #886](https://github.com/lightspeedwp/.github/pull/886) — *feat(ag-p11): tools page — hero, section nav pills, grouped tool sections*)

- **Awesome GitHub Site Phase 02: CSS Token Layer + Global Styles** — Established the complete CSS foundation for the Awesome GitHub site. Added `website/src/styles/site-tokens.css` with app-specific surface tokens (`--panel`, `--panel-2`, `--hair`), font stacks, radius/shadow/transition scales, and `color-scheme` declarations for both light and dark themes. Added `website/src/styles/global.css` with container system (`.wrap` 1320px, `.wrap-prose` 820px), section rhythm via `clamp()`, button system (`.btn-primary`, `.btn-ghost`, `.btn-soft`, `.icon-btn`) with `:focus-visible` rings and browser-compat fallbacks, breadcrumb, kbd chip, burger breakpoints, `.md` prose styles, and scroll-motion accessibility guard. Fixed `BaseLayout.astro` CSS import order and corrected `localStorage` theme key to `ag-theme`. ([#852](https://github.com/lightspeedwp/.github/issues/852), [PR #853](https://github.com/lightspeedwp/.github/pull/853) — *feat(ag-p02): CSS token layer, global styles, and theme key alignment*)

- **Awesome GitHub Site: UI Redesign — Dark Mode, Navigation & Responsive Layout** — Complete navigation and UI overhaul. Added desktop Browse mega-dropdown with 4-column category grid (hover/click open, keyboard Escape dismiss, focus-out close). Added full-height mobile drawer sliding from right with backdrop overlay, scroll-lock, and `inert` guard. Fixed dark-mode nav header (was showing light background). Added fluid responsive CSS tokens for spacing and font sizes across breakpoints. Improved accessibility: Disclosure pattern (`aria-expanded`/`aria-controls`, no `role="menu"`), `aria-pressed` on theme toggle buttons, `inert` on closed drawer, nav z-index raised above drawer so hamburger stays accessible. ([#847](https://github.com/lightspeedwp/.github/issues/847), [PR #845](https://github.com/lightspeedwp/.github/pull/845) — *feat(website): UI redesign — dark mode, mega menu, mobile drawer, responsive layout*)

- **Awesome GitHub Site: Phosphor Icon System** — Replaced all emoji icons (🤖 📖 💬 ✨ 🛡️ ⚙️ 🧩 🔧 🗺️ ✅ 📚 🍳 ☀️ 🌙) with Phosphor SVG icons via a new `Icon.astro` component that reads from `@phosphor-icons/core` at build time — zero runtime JS. Covers catalogue type icons, learning track icons, getting-started cards, cookbook placeholder, and theme toggle buttons. ([#844](https://github.com/lightspeedwp/.github/issues/844), [PR #843](https://github.com/lightspeedwp/.github/pull/843) — *feat(website): Phosphor icon system + mobile nav fix*)

### Changed

### Fixed

- **Issue-Field Write Boundary Verification Docs (`#879`)** — Clarified the live project-meta-sync write boundary, documented that `Status`/`Priority`/`Type` are label-mapped while `Effort` and `Start date` are derived from canonical defaults/runtime context, and added a dedicated verification audit record for private-project issue-field support decisions. ([PR #884](https://github.com/lightspeedwp/.github/pull/884) — *docs: verify private-project issue-field write boundary (#879)*)

- **Awesome GitHub Site: Mobile Nav Menu** — Fixed `z-index` on the fixed-position mobile menu so it renders above page content; added body scroll-lock (`overflow: hidden`) while the menu is open to prevent background scroll. ([#844](https://github.com/lightspeedwp/.github/issues/844), [PR #843](https://github.com/lightspeedwp/.github/pull/843) — *feat(website): Phosphor icon system + mobile nav fix*)

- **Awesome GitHub Site: Phase 01 Scaffold Merge Hardening (`#851`)** — Finalised the Phase 01 scaffold branch for merge by replacing stale `/talk/*` links with valid `/wceu-2026/slides/*` routes on agent pages and aligning key CI workflows to Node `22.22.1` so Astro 6/lint-staged engine checks pass in PR validation.

- **Awesome GitHub Site: Complete Astro Rebuild** — Rebuilt the Awesome GitHub site from a React/Babel prototype into a production-ready Astro 5 static site. Includes: a fully-typed TypeScript data layer (`catalogue.ts`, `learn.ts`, `glossary.ts`) porting 110+ catalogue items across 8 categories; Svelte `SearchPalette` component with Cmd/Ctrl+K activation; 252 statically-generated pages (catalogue, learn tracks, glossary, cookbook, getting-started, why); detail pages with Install-in-VS-Code, copy-URL, copy-file, and View-on-GitHub action buttons; mobile hamburger navigation with animated X icon and keyboard Escape support; expanded footer with brand and navigation columns; and a `why.astro` editorial page. ([PR #841](https://github.com/lightspeedwp/.github/pull/841) — *fix(website): nav contrast, accessibility, and colour consistency*, [#842](https://github.com/lightspeedwp/.github/issues/842))

- **LightSpeedWP Agency Homepage: Complete Component System** — Built a production-ready homepage for the LightSpeedWP Agency website with 9 modular Astro components (Nav, HeroPlanner, TrustStrip, SolutionPaths, WhyLightSpeed, FAQ, FinalCTA, Footer, ContactOverlay). Features include sticky navigation with scroll detection, mobile drawer with theme toggle, AI project planner with form validation, responsive stats grid, 4 solution path cards with highlighting, single-open accordion FAQ with 7 questions, contact modal with success state, and comprehensive design system with light/dark mode support across 9 responsive breakpoints. All components include WCAG 2.2 AA accessibility attributes, semantic HTML5, and CSS variable theming for consistent branding.

- **Awesome GitHub Navigation Redesign: Mega Menu & Accessibility Enhancements** — Redesigned header navigation with single "Browse" mega menu organizing 22 resources across 4 logical sections (Catalogues, More, Cook & Learn, Resources). Implemented comprehensive accessibility improvements including keyboard navigation (Tab+Enter/Space activation), proper ARIA attributes, semantic button elements replacing non-focusable anchors, centered menu positioning to prevent viewport clipping at 1025-1180px widths, and fixed drawer overflow for smooth scrolling. All changes comply with WCAG 2.2 AA+ contrast ratios in both light and dark modes.

- **Awesome GitHub Site Phase 2a: Three-Pillar Governance Framework** — Integrated PR #809's three-pillar design approach on top of Phase 2a's dynamic foundation by adding comprehensive CSS styling for the pillar section (`.pillar-grid`, `.pillar`, `.pillar-links`). Features 3-column responsive grid layout with hover effects, accent color styling, light/dark theme variants, and mobile collapse to single column. Completes visual integration of Automation, Governance, and AI Integration framework while preserving dynamic catalogue loading and conference messaging.

- **Awesome GitHub Site Phase 2a: Homepage & Navigation Redesign** — Initiated Phase 2a execution by restructuring header navigation to support Phase 2 catalogues, redesigning homepage with "One .GitHub to Rule Them All" positioning, and establishing foundation for Phase 2b–2c expansion:

  - Reorganized nav sections (Conference → Catalogues → About) with dedicated catalogue dropdown showing all 8 Phase 2 resources (agents, instructions, skills, hooks, plugins, workflows, tools, learning-hub).

  - Redesigned homepage hero and value proposition to position site as unified discovery platform for AI operations ecosystem.

  - Added 8-catalogue card grid with direct links to Phase 2 resources on homepage.

  - Reorganized Phase 1 conference content into dedicated "Phase 1" section.

  - Created Phase 2a implementation roadmap (`.github/projects/active/awesome-github-site/phase-2a/IMPLEMENTATION_ROADMAP.md`) documenting remaining Phase 2a tasks, success criteria, and Phase 2 gate requirements.

  - Website builds successfully with 62 pages and no errors; foundation ready for Phase 2b catalogue population.

- **AI Governance: Workflow Enforcement Clarity & PR Merge Protocol** — Enhanced `CLAUDE.md` governance documentation to precisely align with `main-branch-guard.yml` workflow enforcement. Added comprehensive PR Merge & Cleanup Protocol with strict enforcement requirements (branch verification, merge execution, automatic cleanup). Clarified that only `release/*` and `hotfix/*` branches are permitted to merge to main, enforced automatically by `.github/workflows/main-branch-guard.yml` and `scripts/workflows/branch-policy/validate-main-branch-pr.cjs`. Emphasizes "NO EXCEPTIONS" in AI Governance header and removes ambiguity about enforcement mechanisms.

- **AI Governance & Branch Protection Enforcement** — Added comprehensive AI governance rules to `CLAUDE.md` with explicit branch naming enforcement (`{type}/{scope}-{short-title}` format, no `claude/` prefixes), clarification that explicit user instructions must be executed immediately without reinterpretation, and main branch protection policies for release cycles only.

- **Awesome GitHub Site Planning Pack** — Created a new active project under `.github/projects/active/awesome-github-site/` with phase 1 and phase 2 planning docs, normalised briefing copies, and an updated execution tracker for the new GitHub-led website programme.

- **Awesome GitHub Site GitHub Pages Implementation** — Added the Astro phase 1 site scaffold, GitHub Pages deployment workflow, custom `404` page, canonical `github.lightspeedwp.agency` domain support, and review-driven fixes for frontmatter, motion, and package metadata.

- **WCEU 2026 Conference Site Expansion** — Expanded the public site into a conference-ready talk hub with per-slide pages, updated navigation and footer elements, a light/dark mode switcher, and GitHub Pages-safe slide parsing dependencies for CI builds.

- **Fullscreen Slideshow Component for WCEU 2026 Talk** — Implemented a production-ready Svelte slideshow viewer with keyboard navigation (arrow keys, space, N for notes, R for references, F for fullscreen), speaker notes and references overlays, slide indicator grid, responsive design, and light/dark mode support. Component integrates with 20 pre-built slide pages and is optimized for conference presentation delivery.

- **Awesome GitHub Site: Enhanced Wapuu Character Integration Across Pages** — Added Wapuu SVG graphics to hero sections across five key pages for improved visual engagement and character consistency:

  - Getting Started page: Wapuu-Rocket for dynamic energy and action orientation

  - Why This Exists page: Wapuu-Astropuu for big-picture vision and exploration

  - Onboarding page: Wapuu-Yoduu for wisdom and guidance

  - Glossary page: Wapuu-Astropuu for reference and learning

  - References page: Wapuu-Rocket for navigation and discovery

- **Awesome GitHub Site: NotFound Page Accessibility Improvement** — Added `aria-hidden="true"` attribute to decorative Wapuu-Astropuu image in the NotFound component (learn.jsx) to improve WCAG 2.2 AA+ accessibility compliance. Empty alt text combined with aria-hidden ensures screen readers properly skip decorative content.

- **Awesome GitHub Site: Duplicate Route Collision Fix** — Removed duplicate `/references` route caused by `website/src/pages/references.astro` conflicting with `website/src/pages/references/index.astro`. The build now generates 62 pages with no route collision warnings. Workflow updated with `--legacy-peer-deps` flag for `npm ci` to resolve `@astrojs/svelte` compatibility with Astro 5.18.2.

## [0.5.0] - 2026-06-03

### Added

- **WCEU 2026 Phase 2 Refinement: Complete Speaker Notes and Visual Design Specifications** — Finalised all speaker notes and visual design guidance for 25-minute WordCamp Europe 2026 presentation on ".github repository automation":

  - `wceu-2026/SPEAKER_NOTES_FINAL.md` — Complete speaker notes for all 24 slides including key messages, talking points, timing (25:10 total), transitions, and emergency cut list; pacing checkpoints at 12:30, 18:00, 23:00

  - `wceu-2026/VISUAL_DESIGN_SPECIFICATIONS.md` — Full design system guide (dark mode, 8-colour palette with WCAG AA+ contrast, typography 44–56pt titles/18–24pt body, layout specs, accessibility checklist)

  - `wceu-2026/SLIDES_INDEX.md` — Quick-reference index of all 24 slides organised by section (Hook/Architecture/Implementation/Adoption) with layout, timing, key message, accent colour assignments, and build checklist

  - All three files validated for WCAG 2.2 AA accessibility compliance and ready for Phase 3 Google Slides implementation ([PR #640](https://github.com/lightspeedwp/.github/pull/640) — *Phase 2 refinement: Complete 24-slide speaker notes and visual design specs*)

- **Documentation Consolidation & Repository Structure Refinement** — Streamlined documentation by consolidating redundant files and clarifying scope boundaries:

  - Consolidated labelling documentation: merged `docs/LABEL_STRATEGY.md`, `docs/ISSUE_LABELS.md`, `docs/PR_LABELS.md` into single comprehensive `docs/LABELING.md` (covers strategy, issue/PR/discussion labelling, agent integration, and best practices)

  - Consolidated automation documentation: merged `docs/AUTOMATION_GOVERNANCE.md`, `docs/WORKFLOWS.md` into single `docs/AUTOMATION.md` (covers strategy, governance, workflow registry, and configuration management)

  - Corrected nested file path: moved `.github/.github/docs/workflow-coordination.md` to `docs/WORKFLOW_COORDINATION.md`

  - Updated `instructions/DEPRECATED.md` with deprecation index and migration guide for consolidated files

  - Maintained portable instructions (`instructions/labeling.instructions.md`, `instructions/automation.instructions.md`) for cross-repository reusability

  - Result: Eliminated 5 redundant documentation files; improved discoverability and maintainability ([#636](https://github.com/lightspeedwp/.github/issues/636))

- **Standardised Prompts Directory** — Created `/prompts` directory at repository root with 7 reusable prompt templates for agents and AI scenarios:

  - `agent-setup.prompt` — Initial agent context, instructions, and operational guidelines

  - `code-generation.prompt` — Code implementation, scaffolding, and generation scenarios

  - `documentation.prompt` — Documentation creation, updates, and refinement workflows

  - `testing.prompt` — Test suite creation, coverage improvement, and test debugging

  - `code-review.prompt` — Code review, quality feedback, and standards enforcement

  - `debugging.prompt` — Problem diagnosis, root cause analysis, and resolution procedures

  - `refactoring.prompt` — Code refactoring, optimisation, and modernisation workflows

  - Each prompt follows consistent structure (Context, Task, Constraints, Acceptance Criteria, References) for reusability across agents and projects

  - Added `prompts/README.md` with usage guide and contribution guidelines ([#636](https://github.com/lightspeedwp/.github/issues/636))

- **Workflow Standards Comprehensive Audit & Improvement Plan** — Completed systematic audit of linting, meta, branding, and CI/CD workflows with detailed improvement roadmap:

  - `.github/reports/audits/workflow-standards-audit-2026-05-31.md` — Full audit identifying 6 priority improvements with effort estimates (23 hours total, 5–8 day timeline)

  - Identified critical gap: no changelog auto-sync on PR merge to develop

  - High priorities: automated project archival, planner agent implementation, workflow consolidation

  - Created 6 GitHub issues (#618–#623) tracking each improvement with acceptance criteria

  - Success criteria defined for changelog, projects, CI/CD, and documentation ([#618](https://github.com/lightspeedwp/.github/issues/618), [#619](https://github.com/lightspeedwp/.github/issues/619), [#620](https://github.com/lightspeedwp/.github/issues/620), [#621](https://github.com/lightspeedwp/.github/issues/621), [#622](https://github.com/lightspeedwp/.github/issues/622), [#623](https://github.com/lightspeedwp/.github/issues/623))

- **Changelog Auto-Sync Workflow** — Implemented `.github/workflows/changelog-auto-update.yml` to automatically synchronise changelog entries when PRs merge to develop:

  - Triggers on PR merge with CHANGELOG.md changes

  - Extracts entries from merged PR using `extract-pr-entries.cjs`

  - Merges entries into main CHANGELOG.md [Unreleased] section

  - Deduplicates entries to prevent duplicates

  - Validates schema before committing changes

  - Uses `[skip ci]` flag to prevent workflow loops ([#618](https://github.com/lightspeedwp/.github/issues/618))

- **Automated Project Archival Workflow** — Implemented `.github/workflows/project-archival.yml` to detect and archive completed projects:

  - Triggers on-demand (workflow_dispatch) or weekly (Sunday 02:00 UTC)

  - Scans active projects for completion markers (status: completed)

  - Moves completed projects to `.github/projects/archived/{YYYY-MM-DD}-{name}/`

  - Creates archival summary with metrics and completion date

  - Dry-run mode for safe preview before archiving

  - Generates audit trail and report for archival actions ([#619](https://github.com/lightspeedwp/.github/issues/619))

- **Planner Agent Implementation** — Enhanced and enabled `scripts/agents/planner.agent.js` with project detection logic:

  - Detects active projects from `.github/projects/active/` directory

  - Supports dry-run mode (default) for safe analysis

  - Ready for GitHub API integration to auto-assign issues to projects

  - Logs proposed project assignments with reasoning

  - Enabled planner workflow in `.github/workflows/planner.yml` (removed if: false condition) ([#620](https://github.com/lightspeedwp/.github/issues/620))

- **Standardised Project Planning Template** — Created `.github/projects/PLANNING_TEMPLATE.md` to structure issue planning before creation:

  - Comprehensive template with 9 sections: overview, scope, timeline, architecture, risks, testing, documentation, references, sign-off

  - Includes planning checklist before creating related GitHub issues

  - Standardises documentation of goals, success criteria, milestones, and dependencies

  - Helps ensure planning decisions are captured and shared with team ([#621](https://github.com/lightspeedwp/.github/issues/621))

- **Unified Checks Workflow** — Created `.github/workflows/checks.yml` to consolidate pre-merge validation:

  - Consolidates linting, testing, and validation into single workflow

  - Uses concurrency groups to prevent redundant runs

  - Clear trigger: pull_request and push (develop branch)

  - Composite status job ensures all checks pass before merge

  - Separate meta.yml workflow maintains different cadence (post-push)

  - Recommended replacement for scattered linting.yml and testing.yml ([#622](https://github.com/lightspeedwp/.github/issues/622))

- **Weekly Metrics Summary Workflow** — Implemented `.github/workflows/metrics-summary.yml` for scheduled reporting:

  - Triggers weekly (Monday 09:00 UTC) or on-demand via workflow_dispatch

  - Aggregates metrics from meta.json, git activity, and changelogs

  - Generates human-readable markdown summary report

  - Archives weekly reports in `.github/reports/metrics/weekly/`

  - Posts report to GitHub discussions (configurable)

  - Provides visibility into repository health, activity, and automation effectiveness ([#623](https://github.com/lightspeedwp/.github/issues/623))

- **WCEU 2026 Comprehensive Audit and Execution Plan** — Completed systematic audit and documentation update for May 30–31 Phase 2–3 execution:

  - `wceu-2026/FILE_UPDATE_AUDIT.md` — Comprehensive audit of 17 primary + 8 supporting files with critical issue identification and update recommendations

  - `wceu-2026/EXECUTION_PLAN.md` — Master execution plan consolidating Phase 1 validation results (16/18 passing), Phase 2 content generation workflow (4–6 hours), Phase 3 finalization timeline (6–8 hours), success criteria, risk mitigation, and open questions

  - Updated `wceu-2026/README.md` to reflect Phase 2 in-progress status with detailed checklist tracking

  - Fixed branch name references in `FINAL_REVIEW_CHECKLIST.md` and `PHASE1_COMPLETION_REPORT.md`

  - All wceu-2026 documentation validated and consistent; ready for Phase 2–3 execution ([#564](https://github.com/lightspeedwp/.github/issues/564), [#567](https://github.com/lightspeedwp/.github/issues/567), [#573](https://github.com/lightspeedwp/.github/issues/573))

- **WCEU 2026 Validation Scripts (Bash-to-JavaScript Migration)** — Completed migration of WCEU validation scripts from Bash to JavaScript with improvements:

  - `scripts/verify-wceu-readiness.js` — Automated Phase 1 validation for schema migration, agent slides reorganization, and content file completeness

  - `scripts/validate-phase2-completion.js` — Interactive Phase 2 validation for NotebookLM output, Google Slides foundation, and design system documentation

  - Benefits: ES module compatibility, robust error handling, cross-platform support (no sed/awk/grep dependencies), comprehensive logging

  - Added npm scripts: `validate:wceu:phase1` and `validate:wceu:phase2` for CLI integration

  - Comprehensive unit tests in `scripts/__tests__/wceu-validation-scripts.test.js` validating script structure, syntax, and completeness

  - Updated `scripts/README.md` with usage examples and feature documentation ([#13](https://github.com/lightspeedwp/.github/issues/13), [#16](https://github.com/lightspeedwp/.github/issues/16))

- **Release Automation Framework Phase 2: Semantic Versioning & Release Notes Generation** — Implemented core semantic versioning detection and release notes formatting modules enabling automated version bumping and changelog generation ([PR #598](https://github.com/lightspeedwp/.github/pull/598) — *feat(#592): Release Workflow - Add post-release changelog validation*):

  - `scripts/agents/includes/versionDetector.js` — Semantic version bump detection from changelog entries with Conventional Commits integration. Analyzes breaking changes, feature additions, deprecations, and removals to determine patch/minor/major version bumps per Semantic Versioning 2.0.0. Functions: parseVersion, formatVersion, compareVersions, determineBumpType, calculateNextVersion, detectBump, suggestNextVersion

  - `scripts/agents/includes/releaseNotesFormatter.js` — Release notes generation from changelog entries with Markdown formatting and metadata support (scope, commit hash, PR number, author). Configurable section ordering (security → removed → deprecated → added → changed → fixed → documentation → performance) and summary text generation. Functions: formatSectionTitle, formatEntry, buildReleaseNotes, generateReleaseNotes, extractSummary, generateSummaryText

  - `scripts/agents/includes/duplicateDetector.js` — Enhanced duplicate detection using fuzzy matching with Levenshtein distance algorithm and semantic analysis via key-term overlap. Configurable similarity threshold (default 0.85). Functions: normalize, levenshteinDistance, calculateSimilarity, isFuzzyDuplicate, hasSemanticDuplicate, findBestMatch, deduplicateEntries, groupDuplicates

  - Comprehensive test coverage: 99 Jest tests across all three modules (32 versionDetector tests, 27 releaseNotesFormatter tests, 40 duplicateDetector tests) with >90% code coverage

  - Integration tests validate semantic versioning logic, Markdown formatting, fuzzy matching algorithms, and edge case handling

- **Complete Agent Specifications & Documentation Audit** — Completed specification documentation for tracking agents and audited documentation cross-references:

  - Completed `agents/template.agent.md` with canonical agent specification template, usage guidelines, structure documentation, and best practices ([#488](https://github.com/lightspeedwp/.github/issues/488))

  - Enhanced `agents/testing.agent.md` with comprehensive role/responsibilities, capabilities, configuration, examples, and related agent references ([#490](https://github.com/lightspeedwp/.github/issues/490))

  - Audited documentation cross-references to CONTRIBUTING.md, GOVERNANCE.md, coding standards, and linting instructions ([#22](https://github.com/lightspeedwp/.github/issues/22))

  - Verified CONTRIBUTING.md has adequate Quick Start section and workflow diagram ([#18](https://github.com/lightspeedwp/.github/issues/18))

  - Verified PR template includes comprehensive accessibility and security checklists ([#21](https://github.com/lightspeedwp/.github/issues/21))

- **Comprehensive 25-Slide Deck Prompt Suite** — Added `.github/wceu-2026/agent-slides/` directory with 25 NotebookLM and Figma-ready presentation prompts covering the complete .github automation ecosystem:

  - **7 Agent Prompts**: Release, Branding, Meta, Reviewer, Linting, Labelling, and Planner agents with capabilities, integration points, and use cases

  - **3 Infrastructure Prompts**: Plugin/Agents/Skills/Hooks integration, Scripts & Automation orchestration, and Workflows architecture

  - **8 Process & Lifecycle Prompts**: PR lifecycle, issue triage, release process, documentation standards, repository metrics, QA/testing, plugin deep-dive, and observability/logging

  - **2 Governance & Standards Prompts**: WordPress-specific requirements and contributing guidelines

  - **5 Developer Experience & Strategy Prompts**: Getting started, best practices, troubleshooting/debugging, roadmap/vision, and case studies/success stories

  - Each prompt includes system overview, key components, integration points, 3+ use cases, 12-15 slide structure, evidence anchors linking to repository files, design notes for visual consistency, and quality bars for validation. Enables presentation creation with NotebookLM, Figma, and other design tools. ([PR #549](https://github.com/lightspeedwp/.github/pull/549) — *docs: add comprehensive 25-slide-deck prompt suite*)

- **Design Markdown Agent: P3 Shell Script Modernization** — Completed migration of PDF tooling dependency installation from Bash to JavaScript:

  - `skills/design-md-agent/pdfs/js/installDeps.js` — New JavaScript module replacing `install_deps.sh` shell script with async/await pattern

  - `skills/design-md-agent/pdfs/js/__tests__/installDeps.test.js` — Comprehensive test suite with 11 tests covering node_modules fast-path, package.json validation, error handling, npm install execution, and console logging

  - Performance improvement: promisified `exec()` replaces blocking subprocess; non-blocking async operation for CI/CD pipelines

  - Code review refinements: proper error wrapping, fast-path optimization, comprehensive mock-based testing, silent npm install flag validation

  - Returns structured result object with success/installed/directory properties for programmatic integration ([#616](https://github.com/lightspeedwp/.github/issues/616), [PR #639](https://github.com/lightspeedwp/.github/pull/639) — *feat: Migrate install\_deps.sh to JavaScript (installDeps.js)*)

- **Consolidated Branding Agent Module** — Unified `scripts/agents/branding.agent.js` consolidates header, footer, and badge logic from previously scattered modules:

  - Merged header-footer.js, badges.js, footerUtils.js, and badgeUtils.js into single ES Module

  - Maintains all public API functions for footer selection, insertion, removal, and badge generation

  - Supports configuration-driven footer phrases and badge schema mapping

  - Provides unified import path for all branding utilities in meta agent workflows ([#47](https://github.com/lightspeedwp/.github/issues/47))

- **Wave 3C: README and Mermaid Maintenance Workflow** — New `.github/workflows/readme-update.yml` workflow automates README and Mermaid diagram maintenance with:

  - Mermaid accessibility updates (adds `accTitle` and `accDescr` attributes per WCAG 2.2 AA)

  - Stale frontmatter date updates (6+ month threshold)

  - Support for manual dispatch (`workflow_dispatch`) and Release Agent orchestration (`workflow_call`)

  - Dry-run mode for safe preview before applying changes

  - Audit reporting at `.github/reports/mermaid-audit/update-report.md`

  - Integrated into Release Agent post-release phase ([PR #536](https://github.com/lightspeedwp/.github/pull/536) — *Wave 3C: README Update Workflow & Wave 4 Specification*)

- **Wave 4 Specification** — Added `.github/projects/active/wave-4-continuous-monitoring.md` comprehensive specification for continuous README and Mermaid diagram monitoring:

  - Scheduled weekly audit workflows

  - Drift detection on push events

  - Monthly freshness notifications

  - Quarterly health reports with recommendations

  - CI/CD integration patterns and metric collection

  - Foundation for long-term automation roadmap (Waves 5-7) ([PR #536](https://github.com/lightspeedwp/.github/pull/536) — *Wave 3C: README Update Workflow & Wave 4 Specification*)

- **Comprehensive Documentation Index** — Created `docs/README.md` with complete documentation hub and navigation guide:

  - Quick-start sections for First-Time Contributors, Maintainers, and Workflow & Automation teams

  - 9 logical documentation categories with 36+ indexed files (Architecture & Strategy, Workflows & Processes, Labeling & Project Management, Configuration & Setup, Development & Standards, Governance & Decisions, Monitoring & Metrics, Adoption & Integration)

  - Role-based navigation table (Developer, Reviewer, Maintainer, Automation/DevOps, Organisation Lead)

  - Task-based quick-reference table (8 common tasks with relevant documentation links)

  - Documentation standards reference (UK English, Markdown with YAML frontmatter, relative links, WCAG 2.2 AA compliance)

  - Related resources and help section for discoverability

  - Updated Mermaid diagrams with WCAG 2.2 AA accessibility attributes (`accTitle`, `accDescr`)

  - Removed prohibited `references` fields from README files per CLAUDE.md governance rules

  - Closes Issue [#19](https://github.com/lightspeedwp/.github/issues/19) ([PR #552](https://github.com/lightspeedwp/.github/pull/552) — *Docs: Create comprehensive documentation index and quickstart*)

- **Wave 4C: Current-State Audit & Remediation Plan** — Completed comprehensive audit of 932 markdown files with detailed remediation strategy:

  - `scripts/audit/branding-patterns.js`: New ES Module audit script detecting footers, badges, and frontmatter compliance across repository

  - Category-based analysis: 31.7% footer coverage, 1.5% badge coverage, 8.7% frontmatter compliance (critical 851-file gap)

  - `.github/reports/wave-4c-audit-report.md`: Current-state findings with category-specific breakdown and recommendations

  - `.github/reports/wave-4c-remediation-plan.md`: Phased remediation roadmap (Phase 1-3 over 9-12 hours, Waves 4D-4F)

  - High-priority focus: Skills category (696 files, 18.1% footer coverage) and frontmatter schema compliance

  - Risk assessment, success criteria, and dependency analysis for phased execution

  - Unblocks Wave 4D (Issue #554) schema implementation, Wave 4E (Issue #555) agent merge, and Wave 4F (Issue #556) bulk remediation

  - Closes Issue [#553](https://github.com/lightspeedwp/.github/issues/553) (PR #558)

### Changed

- Added guarded Dependabot security auto-merge automation for `develop` by introducing Mergify conditions tied to Dependabot author, dependency/security labels, conflict/draft guards, and successful required checks. Added and wired a Dependabot security labelling workflow and aligned labels to canonical naming (`meta:dependabot-security`) to satisfy label governance and enable controlled auto-merge behaviour. ([PR #563](https://github.com/lightspeedwp/.github/pull/563) — *feat(ci): add guarded Mergify auto-merge for Dependabot security PRs*)

- **Release Agent Integration** — Updated `agents/release.agent.md` (v2.2 → v2.3) with post-release `readme-update.yml` invocation:

  - Documented workflow contract with inputs, outputs, and failure handling

  - Added to orchestration algorithm as non-blocking post-release action

  - Conditional execution based on README maintenance requirements ([PR #536](https://github.com/lightspeedwp/.github/pull/536) — *Wave 3C: README Update Workflow & Wave 4 Specification*)

- **Workflow Coordination Documentation** — Updated `.github/docs/workflow-coordination.md` (v1.0.0 → v1.1.0):

  - Documented `readme-update.yml` in Agent-Triggered Workflow Registry

  - Added comprehensive specification with inputs, outputs, and integration points

  - Clarified Release Agent orchestration pattern for post-release actions ([PR #536](https://github.com/lightspeedwp/.github/pull/536) — *Wave 3C: README Update Workflow & Wave 4 Specification*)

- **Plugin Structure Migration** — Migrated `instructions/plugin-structure.instructions.md` from `.github/instructions/` to top-level `instructions/` folder:

  - Follows CLAUDE.md guidelines for portable reusable assets

  - Updated references across `.github/README.md` and `CLAUDE.md`

  - Clarified repository structure: GitHub-native files in `.github/`, portable assets in top-level folders ([PR #536](https://github.com/lightspeedwp/.github/pull/536) — *Wave 3C: README Update Workflow & Wave 4 Specification*)

### Fixed

- **v0.5.0 Readiness: Frontmatter schema cleanup for release docs and site-planning briefs** — Normalised invalid frontmatter values across the Awesome GitHub Site planning tree and related website docs so the repo’s frontmatter validator no longer trips on release-blocking schema errors:

  - Replaced unsupported `domain: website` and `domain: opsx` values with schema-valid `domain: governance`.

  - Updated draft-only site brief metadata to use supported `stability: experimental`.

  - Converted the stray `report` frontmatter type in the agent permissions audit to `documentation`.

- **v0.5.0 Readiness: Coverage and Reliability Gate Execution (`#746`, `#602`, `#599`, `#600`, `#601`)** — Re-activated planner/reviewer test coverage from skipped state into active Jest suites, added module-system consistency guards, and improved reviewer workflow dry-run support for safe validation:

  - Added `scripts/agents/__tests__/planner.agent.test.js` and `scripts/agents/__tests__/reviewer.agent.test.js` with expanded fatal-path, dry-run, blocker-detection, and API-failure coverage.

  - Added `scripts/agents/__tests__/module-system-consistency.test.js` to enforce ESM consistency across planner/reviewer and `package.json` module type.

  - Removed obsolete skipped test files `.jest-skip/planner.agent.test.js` and `.jest-skip/reviewer.agent.test.js` after active coverage migration.

  - Updated `.github/workflows/reviewer.yml` to support `workflow_dispatch` and `workflow_call` dry-run inputs via `DRY_RUN` environment pass-through.

  - Updated planner/reviewer CLI guard logic to remove `import.meta` runtime coupling in test execution paths.

  - Validation evidence: focused reliability suite `20/20` passing; focused statement coverage `planner.agent.js 82.20%` and `reviewer.agent.js 91.34%`; release gates (`validate:frontmatter`, `validate:workflows`, `validate:agents`, `validate:skill-manifests`, `validate:plugins`, `npm test`) passing.

- **v0.5.0 Readiness: Release Completeness Execution (`#594`, `#592`, `#591`, `#595`, `#593`)** — Completed release safety/governance hardening and removed legacy duplication:

  - Added `scripts/workflows/release/rollback.cjs` for failed-release recovery (`--version`, `--force`, `--dry-run`).

  - Strengthened `.github/workflows/release.yml` post-release changelog validation with schema + utility checks.

  - Enforced explicit version/scope alignment guard in `scripts/agents/release.agent.js` with controlled `RELEASE_FORCE_VERSION=1` bypass.

  - Removed obsolete `scripts/create-release-pr.cjs` duplicate flow.

  - Completed `instructions/release.instructions.md` with full phase/gate/rollback governance content.

- **v0.5.0 Readiness: Launch-Gate and Scope Closeout (`#729`, `#730`, `#731`, `#728`, `#614`, `#615`, `#616`, `#627`, `#628`, `#629`, `#632`, `#747`)** — Closed launch child/parent gate issues after blocker completion, then performed release-scope triage for non-blocking enhancement/debt items and closed them as `not planned` for the milestone, followed by final meta-tracker closure.

- **v0.5.0 Readiness: CI gate verification and frontmatter blocker remediation** — Verified CI hard-blocker chain (`#642`, `#643`, `#644`) against live `develop` with passing `npm test`, `npm run validate:agents`, and `npm run validate:workflows`. Resolved release-gate regression in `validate:frontmatter` by fixing invalid frontmatter in 13 active prompt-migration artefacts under `.github/projects/active/refactor-migrate-prompts/`, restoring `npm run validate:frontmatter` to zero errors.

- **Mermaid Accessibility Compliance (Issue #669)** — Added missing `accTitle` and `accDescr` accessibility attributes to 7 non-compliant Mermaid diagrams across `.github/`, `.vscode/`, and root-level README files. All 24 diagrams now achieve 100% WCAG 2.2 AA compliance. Also improved validation scripts with cross-platform line ending support and enhanced diagram type detection ([PR #696](https://github.com/lightspeedwp/.github/pull/696) — *Wave 5: Mermaid Accessibility Compliance + README Frontmatter Updates*)

- **Wave 5: Label Color Consistency Audit** — Comprehensive audit of all 160 canonical labels in `.github/labels.yml` against documented 8-family colour strategy with findings, recommendations, and migration roadmap:

  - `.github/reports/audits/label-color-consistency-audit-2026-06-01.md` — Executive summary identifying 96 aligned labels (60%), 64 misaligned labels (40%), critical semantic mismatches in 5+ families, and detailed family-by-family analysis with root cause analysis and prioritised Phase 1–3 recommendations

  - `.github/reports/audits/label-color-audit-spreadsheet-2026-06-01.csv` — Complete label-by-label audit data (160+ labels) with current vs. recommended colours, family assignments, alignment status, and prioritised migration levels

  - Deliverables ready for dependent implementation work (Issues #683–#686): label update, documentation refresh, and follow-up validation ([#658](https://github.com/lightspeedwp/.github/issues/658))

- **Wave 5.1: Issue Template Audit, Automation Recommendations & AI Agent Integration Guide** — Completed comprehensive audit of all 25 GitHub issue templates with documentation, automation gap analysis, and contributor guidance:

  - `.github/reports/issue-template-audit-2026-05-31.md` — Complete audit report cataloguing all 25 templates, documenting current state analysis (strengths/gaps), identifying critical automation gap in labeler.yml, and providing 6 prioritised recommendations with effort/impact estimates

  - `docs/ISSUE_CREATION_GUIDE.md` — Comprehensive guide for contributors and AI agents with quick-reference template selection table, step-by-step issue creation instructions, clear distinction between current (manual) vs planned (Wave 5.1.2) automation, label selection logic for agents

  - `.github/labeler.yml` — Cleaned up configuration by removing unsupported issue-body/issue-labels rules pending infrastructure upgrade, maintained stable PR/branch rules, added documentation comments for Wave 5.1.2 planned work

  - `.github/projects/active/next-issues-execution-plan.md` — Updated execution plan documenting Wave 5 structure and sequence for remaining audits (5.2–5.5)

  - All deliverables validated and ready for next phase implementation ([#649](https://github.com/lightspeedwp/.github/issues/649))

- **Wave 5 Audit #654: Template Inventory & Standardisation Findings** — Completed comprehensive audit of 26 issue templates in `.github/ISSUE_TEMPLATE/` documenting 100% frontmatter compliance, identifying 1 critical duplicate numbering issue (07-improvement + 07-user-experience-feedback), 2 type mapping gaps (Chore, User Experience Feedback, Help/Support), and providing recommendations for Phase 1 (numbering fixes), Phase 2 (type clarification), and Phase 3 (documentation updates). Created audit findings document at `.github/projects/active/wave-5-documentation-audit/findings/654-template-inventory-findings.md` with complete inventory metrics, critical/medium/low issue analysis, and phased remediation roadmap ([#654](https://github.com/lightspeedwp/.github/issues/654))

- **WCEU 2026 Documentation: Merge Conflict Resolution and Frontmatter Corrections** — Resolved merge conflict marker in CHANGELOG.md, corrected `file_type: documentation` in ROLLOUT_PLAN_60_DAYS.md (was `rollout_plan`), added missing frontmatter fields (`stability: stable`, `domain: governance`), and fixed UK English spelling (`finalize`→`finalise`, `customize`→`customise`, `customizations`→`customisations`) ([PR #676](https://github.com/lightspeedwp/.github/pull/676) — *fix: WCEU 2026 validation scripts and governance rollout documentation*)

- **Planner & Reviewer Agents: Code Review Fixes** — Fixed six critical issues from CodeRabbit review: dryRun option precedence, CLI entry point execution, null-safe comment body checks, extended dependency file detection (package.json, composer.json), improved rollback migration detection (.down.sql), and prevented crashes from null comment bodies ([#603](https://github.com/lightspeedwp/.github/issues/603), [#604](https://github.com/lightspeedwp/.github/issues/604), [#605](https://github.com/lightspeedwp/.github/issues/605), [#606](https://github.com/lightspeedwp/.github/issues/606), [#607](https://github.com/lightspeedwp/.github/issues/607))

- **Reviewer Agent: File Pagination** — Implemented proper pagination using `octokit.paginate()` for PR file analysis to ensure all files are analyzed even when a PR has >100 changed files; prevents missing high-risk files on subsequent pages

- **Release Agent: Branch Push Upstream Tracking** — Fixed release agent to use `git push -u origin` when pushing release branches, ensuring proper upstream tracking for subsequent PR creation ([#585](https://github.com/lightspeedwp/.github/issues/585))

- **Release Agent: [Unreleased] Section Recreation** — Fixed release agent to inject new `[Unreleased]` section after rolling version, ensuring changelog is ready for next contribution cycle ([#586](https://github.com/lightspeedwp/.github/issues/586))

- **Release Agent: Sandboxed Dry-Run Mode** — Implemented proper dry-run mode that creates temporary git branch, validates file changes, runs linting, and tests git operations before cleanup—enabling safe end-to-end release testing ([#587](https://github.com/lightspeedwp/.github/issues/587))

- **Release Workflow: Enforce Authorization Gate** — Fixed release workflow authorization check to actually block unauthorized trigger attempts. Modified `trigger-telemetry.cjs` to validate actor membership in `lightspeedwp/maintainers` team via GitHub API; workflow now exits with error if actor is not authorized. Updated `.github/workflows/release.yml` to pass `GITHUB_TOKEN` for authorization validation and report `is_authorized` status ([#588](https://github.com/lightspeedwp/.github/issues/588))

- **Release Workflow: Tests as Hard Gate** — Added test job to release workflow as mandatory pre-release gate. New `test` job runs full test suite (`npm test`) and must pass before release proceeds. Updated `release` job to depend on both `lint` and `test`, ensuring untested code cannot be released ([#589](https://github.com/lightspeedwp/.github/issues/589))

- **Release Agent: PR Creation Failures Block Release** — Fixed release agent to treat PR creation failures as fatal errors, stopping the entire release process. Removed silent error catch block in `createReleasePR()` to propagate exceptions to outer error handler, preventing release tag/GitHub release publication when PR creation fails ([#590](https://github.com/lightspeedwp/.github/issues/590))

- **Release Agent: Version Override Scope Alignment** — Added validation to ensure explicit version overrides (`--version=X.Y.Z`) align with the specified scope. Version mismatches now throw an error unless `RELEASE_FORCE_VERSION=1` environment variable is set. Includes clear warning when override is forced ([#591](https://github.com/lightspeedwp/.github/issues/591))

- **Mergify Dependabot Auto-merge Rules** — Corrected Mergify configuration to automatically merge Dependabot PRs by fixing the author condition from `author=dependabot` to `author=dependabot[bot]` to match GitHub's actual Dependabot bot account name ([#573](https://github.com/lightspeedwp/.github/issues/573))

- **WCEU 2026 Branch Name References** — Updated references in `FINAL_REVIEW_CHECKLIST.md` and `PHASE1_COMPLETION_REPORT.md` from old branch name `claude/charming-goldberg-Pqc69` to correct branch `claude/affectionate-bohr-AX2jS`

### Added

- `wceu-2026/SPEAKER_NOTES_FINAL.md` — Complete speaker notes for all 24 slides including key messages, talking points, timing (25:10 total), transitions, and emergency cut list; pacing checkpoints at 12:30, 18:00, 23:00
- `wceu-2026/VISUAL_DESIGN_SPECIFICATIONS.md` — Full design system guide (dark mode, 8-colour palette with WCAG AA+ contrast, typography 44–56pt titles/18–24pt body, layout specs, accessibility checklist)
- `wceu-2026/SLIDES_INDEX.md` — Quick-reference index of all 24 slides organised by section (Hook/Architecture/Implementation/Adoption) with layout, timing, key message, accent colour assignments, and build checklist
- All three files validated for WCAG 2.2 AA accessibility compliance and ready for Phase 3 Google Slides implementation ([#640](https://github.com/lightspeedwp/.github/pull/640))
- Consolidated labelling documentation: merged `docs/LABEL_STRATEGY.md`, `docs/ISSUE_LABELS.md`, `docs/PR_LABELS.md` into single comprehensive `docs/LABELING.md` (covers strategy, issue/PR/discussion labelling, agent integration, and best practices)
- Consolidated automation documentation: merged `docs/AUTOMATION_GOVERNANCE.md`, `docs/WORKFLOWS.md` into single `docs/AUTOMATION.md` (covers strategy, governance, workflow registry, and configuration management)
- Corrected nested file path: moved `.github/.github/docs/workflow-coordination.md` to `docs/WORKFLOW_COORDINATION.md`
- Updated `instructions/DEPRECATED.md` with deprecation index and migration guide for consolidated files
- Maintained portable instructions (`instructions/labeling.instructions.md`, `instructions/automation.instructions.md`) for cross-repository reusability
- Result: Eliminated 5 redundant documentation files; improved discoverability and maintainability ([#636](https://github.com/lightspeedwp/.github/issues/636))
- `agent-setup.prompt` — Initial agent context, instructions, and operational guidelines
- `code-generation.prompt` — Code implementation, scaffolding, and generation scenarios
- `documentation.prompt` — Documentation creation, updates, and refinement workflows
- `testing.prompt` — Test suite creation, coverage improvement, and test debugging
- `code-review.prompt` — Code review, quality feedback, and standards enforcement
- `debugging.prompt` — Problem diagnosis, root cause analysis, and resolution procedures
- `refactoring.prompt` — Code refactoring, optimisation, and modernisation workflows
- Each prompt follows consistent structure (Context, Task, Constraints, Acceptance Criteria, References) for reusability across agents and projects
- Added `prompts/README.md` with usage guide and contribution guidelines ([#636](https://github.com/lightspeedwp/.github/issues/636))
- `.github/reports/audits/workflow-standards-audit-2026-05-31.md` — Full audit identifying 6 priority improvements with effort estimates (23 hours total, 5–8 day timeline)
- Identified critical gap: no changelog auto-sync on PR merge to develop
- High priorities: automated project archival, planner agent implementation, workflow consolidation
- Created 6 GitHub issues (#618–#623) tracking each improvement with acceptance criteria
- Success criteria defined for changelog, projects, CI/CD, and documentation ([#618](https://github.com/lightspeedwp/.github/issues/618), [#619](https://github.com/lightspeedwp/.github/issues/619), [#620](https://github.com/lightspeedwp/.github/issues/620), [#621](https://github.com/lightspeedwp/.github/issues/621), [#622](https://github.com/lightspeedwp/.github/issues/622), [#623](https://github.com/lightspeedwp/.github/issues/623))
- Triggers on PR merge with CHANGELOG.md changes
- Extracts entries from merged PR using `extract-pr-entries.cjs`
- Merges entries into main CHANGELOG.md [Unreleased] section
- Deduplicates entries to prevent duplicates
- Validates schema before committing changes
- Uses `[skip ci]` flag to prevent workflow loops ([#618](https://github.com/lightspeedwp/.github/issues/618))
- Triggers on-demand (workflow_dispatch) or weekly (Sunday 02:00 UTC)
- Scans active projects for completion markers (status: completed)
- Moves completed projects to `.github/projects/archived/{YYYY-MM-DD}-{name}/`
- Creates archival summary with metrics and completion date
- Dry-run mode for safe preview before archiving
- Generates audit trail and report for archival actions ([#619](https://github.com/lightspeedwp/.github/issues/619))
- Detects active projects from `.github/projects/active/` directory
- Supports dry-run mode (default) for safe analysis
- Ready for GitHub API integration to auto-assign issues to projects
- Logs proposed project assignments with reasoning
- Enabled planner workflow in `.github/workflows/planner.yml` (removed if: false condition) ([#620](https://github.com/lightspeedwp/.github/issues/620))
- Comprehensive template with 9 sections: overview, scope, timeline, architecture, risks, testing, documentation, references, sign-off
- Includes planning checklist before creating related GitHub issues
- Standardises documentation of goals, success criteria, milestones, and dependencies
- Helps ensure planning decisions are captured and shared with team ([#621](https://github.com/lightspeedwp/.github/issues/621))
- Consolidates linting, testing, and validation into single workflow
- Uses concurrency groups to prevent redundant runs
- Clear trigger: pull_request and push (develop branch)
- Composite status job ensures all checks pass before merge
- Separate meta.yml workflow maintains different cadence (post-push)
- Recommended replacement for scattered linting.yml and testing.yml ([#622](https://github.com/lightspeedwp/.github/issues/622))
- Triggers weekly (Monday 09:00 UTC) or on-demand via workflow_dispatch
- Aggregates metrics from meta.json, git activity, and changelogs
- Generates human-readable markdown summary report
- Archives weekly reports in `.github/reports/metrics/weekly/`
- Posts report to GitHub discussions (configurable)
- Provides visibility into repository health, activity, and automation effectiveness ([#623](https://github.com/lightspeedwp/.github/issues/623))
- `wceu-2026/FILE_UPDATE_AUDIT.md` — Comprehensive audit of 17 primary + 8 supporting files with critical issue identification and update recommendations
- `wceu-2026/EXECUTION_PLAN.md` — Master execution plan consolidating Phase 1 validation results (16/18 passing), Phase 2 content generation workflow (4–6 hours), Phase 3 finalization timeline (6–8 hours), success criteria, risk mitigation, and open questions
- Updated `wceu-2026/README.md` to reflect Phase 2 in-progress status with detailed checklist tracking
- Fixed branch name references in `FINAL_REVIEW_CHECKLIST.md` and `PHASE1_COMPLETION_REPORT.md`
- All wceu-2026 documentation validated and consistent; ready for Phase 2–3 execution ([#564](https://github.com/lightspeedwp/.github/issues/564), [#567](https://github.com/lightspeedwp/.github/issues/567), [#573](https://github.com/lightspeedwp/.github/issues/573))
- `scripts/verify-wceu-readiness.js` — Automated Phase 1 validation for schema migration, agent slides reorganization, and content file completeness
- `scripts/validate-phase2-completion.js` — Interactive Phase 2 validation for NotebookLM output, Google Slides foundation, and design system documentation
- Benefits: ES module compatibility, robust error handling, cross-platform support (no sed/awk/grep dependencies), comprehensive logging
- Added npm scripts: `validate:wceu:phase1` and `validate:wceu:phase2` for CLI integration
- Comprehensive unit tests in `scripts/__tests__/wceu-validation-scripts.test.js` validating script structure, syntax, and completeness
- Updated `scripts/README.md` with usage examples and feature documentation ([#13](https://github.com/lightspeedwp/.github/issues/13), [#16](https://github.com/lightspeedwp/.github/issues/16))
- `scripts/agents/includes/versionDetector.js` — Semantic version bump detection from changelog entries with Conventional Commits integration. Analyzes breaking changes, feature additions, deprecations, and removals to determine patch/minor/major version bumps per Semantic Versioning 2.0.0. Functions: parseVersion, formatVersion, compareVersions, determineBumpType, calculateNextVersion, detectBump, suggestNextVersion
- `scripts/agents/includes/releaseNotesFormatter.js` — Release notes generation from changelog entries with Markdown formatting and metadata support (scope, commit hash, PR number, author). Configurable section ordering (security → removed → deprecated → added → changed → fixed → documentation → performance) and summary text generation. Functions: formatSectionTitle, formatEntry, buildReleaseNotes, generateReleaseNotes, extractSummary, generateSummaryText
- `scripts/agents/includes/duplicateDetector.js` — Enhanced duplicate detection using fuzzy matching with Levenshtein distance algorithm and semantic analysis via key-term overlap. Configurable similarity threshold (default 0.85). Functions: normalize, levenshteinDistance, calculateSimilarity, isFuzzyDuplicate, hasSemanticDuplicate, findBestMatch, deduplicateEntries, groupDuplicates
- Comprehensive test coverage: 99 Jest tests across all three modules (32 versionDetector tests, 27 releaseNotesFormatter tests, 40 duplicateDetector tests) with >90% code coverage
- Integration tests validate semantic versioning logic, Markdown formatting, fuzzy matching algorithms, and edge case handling
- Completed `agents/template.agent.md` with canonical agent specification template, usage guidelines, structure documentation, and best practices ([#488](https://github.com/lightspeedwp/.github/issues/488))
- Enhanced `agents/testing.agent.md` with comprehensive role/responsibilities, capabilities, configuration, examples, and related agent references ([#490](https://github.com/lightspeedwp/.github/issues/490))
- Audited documentation cross-references to CONTRIBUTING.md, GOVERNANCE.md, coding standards, and linting instructions ([#22](https://github.com/lightspeedwp/.github/issues/22))
- Verified CONTRIBUTING.md has adequate Quick Start section and workflow diagram ([#18](https://github.com/lightspeedwp/.github/issues/18))
- Verified PR template includes comprehensive accessibility and security checklists ([#21](https://github.com/lightspeedwp/.github/issues/21))
- **7 Agent Prompts**: Release, Branding, Meta, Reviewer, Linting, Labelling, and Planner agents with capabilities, integration points, and use cases
- **3 Infrastructure Prompts**: Plugin/Agents/Skills/Hooks integration, Scripts & Automation orchestration, and Workflows architecture
- **8 Process & Lifecycle Prompts**: PR lifecycle, issue triage, release process, documentation standards, repository metrics, QA/testing, plugin deep-dive, and observability/logging
- **2 Governance & Standards Prompts**: WordPress-specific requirements and contributing guidelines
- **5 Developer Experience & Strategy Prompts**: Getting started, best practices, troubleshooting/debugging, roadmap/vision, and case studies/success stories
- Each prompt includes system overview, key components, integration points, 3+ use cases, 12-15 slide structure, evidence anchors linking to repository files, design notes for visual consistency, and quality bars for validation. Enables presentation creation with NotebookLM, Figma, and other design tools. ([#549](https://github.com/lightspeedwp/.github/pull/549))
- `skills/design-md-agent/pdfs/js/installDeps.js` — New JavaScript module replacing `install_deps.sh` shell script with async/await pattern
- `skills/design-md-agent/pdfs/js/__tests__/installDeps.test.js` — Comprehensive test suite with 11 tests covering node_modules fast-path, package.json validation, error handling, npm install execution, and console logging
- Performance improvement: promisified `exec()` replaces blocking subprocess; non-blocking async operation for CI/CD pipelines
- Code review refinements: proper error wrapping, fast-path optimization, comprehensive mock-based testing, silent npm install flag validation
- Returns structured result object with success/installed/directory properties for programmatic integration ([#616](https://github.com/lightspeedwp/.github/issues/616), [#639](https://github.com/lightspeedwp/.github/pull/639))
- Merged header-footer.js, badges.js, footerUtils.js, and badgeUtils.js into single ES Module
- Maintains all public API functions for footer selection, insertion, removal, and badge generation
- Supports configuration-driven footer phrases and badge schema mapping
- Provides unified import path for all branding utilities in meta agent workflows ([#47](https://github.com/lightspeedwp/.github/issues/47))
- Mermaid accessibility updates (adds `accTitle` and `accDescr` attributes per WCAG 2.2 AA)
- Stale frontmatter date updates (6+ month threshold)
- Support for manual dispatch (`workflow_dispatch`) and Release Agent orchestration (`workflow_call`)
- Dry-run mode for safe preview before applying changes
- Audit reporting at `.github/reports/mermaid-audit/update-report.md`
- Integrated into Release Agent post-release phase ([#536](https://github.com/lightspeedwp/.github/pull/536))
- Scheduled weekly audit workflows
- Drift detection on push events
- Monthly freshness notifications
- Quarterly health reports with recommendations
- CI/CD integration patterns and metric collection
- Foundation for long-term automation roadmap (Waves 5-7) ([#536](https://github.com/lightspeedwp/.github/pull/536))
- Quick-start sections for First-Time Contributors, Maintainers, and Workflow & Automation teams
- 9 logical documentation categories with 36+ indexed files (Architecture & Strategy, Workflows & Processes, Labeling & Project Management, Configuration & Setup, Development & Standards, Governance & Decisions, Monitoring & Metrics, Adoption & Integration)
- Role-based navigation table (Developer, Reviewer, Maintainer, Automation/DevOps, Organisation Lead)
- Task-based quick-reference table (8 common tasks with relevant documentation links)
- Documentation standards reference (UK English, Markdown with YAML frontmatter, relative links, WCAG 2.2 AA compliance)
- Related resources and help section for discoverability
- Updated Mermaid diagrams with WCAG 2.2 AA accessibility attributes (`accTitle`, `accDescr`)
- Removed prohibited `references` fields from README files per CLAUDE.md governance rules
- Closes Issue [#19](https://github.com/lightspeedwp/.github/issues/19) ([#552](https://github.com/lightspeedwp/.github/pull/552))
- `scripts/audit/branding-patterns.js`: New ES Module audit script detecting footers, badges, and frontmatter compliance across repository
- Category-based analysis: 31.7% footer coverage, 1.5% badge coverage, 8.7% frontmatter compliance (critical 851-file gap)
- `.github/reports/wave-4c-audit-report.md`: Current-state findings with category-specific breakdown and recommendations
- `.github/reports/wave-4c-remediation-plan.md`: Phased remediation roadmap (Phase 1-3 over 9-12 hours, Waves 4D-4F)
- High-priority focus: Skills category (696 files, 18.1% footer coverage) and frontmatter schema compliance
- Risk assessment, success criteria, and dependency analysis for phased execution
- Unblocks Wave 4D (Issue #554) schema implementation, Wave 4E (Issue #555) agent merge, and Wave 4F (Issue #556) bulk remediation
- Closes Issue [#553](https://github.com/lightspeedwp/.github/issues/553) (PR #558)

### Fixed

- **Plugin Structure Instructions Frontmatter** — Added missing `title` and `category` fields to `instructions/plugin-structure.instructions.md` to meet frontmatter schema requirements ([#535](https://github.com/lightspeedwp/.github/pull/547))

- Remediated duplicate and multiple footer blocks across 664 Markdown files using schema-driven validation. Created footer configuration schema (`.schemas/footer-config.schema.json`), centralized footer library with 15 document categories (`config/footers.config.yaml`), and automated validation/remediation script (`.github/scripts/validate-footers.js`). Violations fixed: 51 duplicate footer files → 0, 613 multiple-footer files → 0. Published remediation guide (`.github/FOOTER_REMEDIATION_GUIDE.md`). Related to branding meta agent planning (#33, #46, #48, #49). ([PR #534](https://github.com/lightspeedwp/.github/pull/534) — *fix/plan: footer remediation + branding meta agent planning*)

- Removed prohibited `references:` frontmatter field from 9 README files (`README.md`, `.github/README.md`, `.github/agents/README.md`, `.github/instructions/README.md`, `.github/metrics/README.md`, `.github/schemas/README.md`, `.schemas/README.md`, `profile/README.md`, `scripts/README.md`) per CLAUDE.md governance rule. Added missing required frontmatter fields (`owners`, `status`, `stability`, `domain`) to affected files. Removed 13 duplicate footer blocks from root `README.md`. Added `.lycheeignore` excluding social-platform and LightSpeed external domains from CI link checking. Added `docs/MIGRATION.md` portable AI plugin restructure migration maps (completed and pending migrations, file placement quick-reference). Related to [#18](https://github.com/lightspeedwp/.github/issues/18). ([PR #527](https://github.com/lightspeedwp/.github/pull/527) — *fix(docs): remove prohibited references: frontmatter field from 9 READMEs*)

- Replaced deprecated MCP tool references (`create_issue`, `update_issue`, `get_issue`) with current equivalents (`issue_write`, `issue_read`) across agent specs and prompt files. Closes [#52](https://github.com/lightspeedwp/.github/issues/52). ([PR #455](https://github.com/lightspeedwp/.github/pull/455) — *fix: replace deprecated MCP tool refs (create\_issue → issue\_write, get\_issue → issue\_read)*)

- Expanded issue template DoD checklists with discrete accessibility (WCAG 2.2 AA), security (OWASP Top 10), and performance items, aligning issue templates with the PR template. Closes [#21](https://github.com/lightspeedwp/.github/issues/21). ([PR #460](https://github.com/lightspeedwp/.github/pull/460) — *fix: add explicit accessibility and security DoD checklist items to issue templates*)

- Updated `.coderabbit.yml`: corrected schema URL to `docs.coderabbit.ai/.schemas/schema.v2.json`; added `language: en-GB`, `inheritance: true`, `chat.auto_reply: true`; added `reviews.profile: chill` and `reviews.review_details: true`; hardened workflow path instructions with security guidance (least-privilege permissions, secret injection prevention, action pinning); added `instructions/**` and `CHANGELOG.md` path instructions; expanded path filters. Closes [#23](https://github.com/lightspeedwp/.github/issues/23).

### Documentation

- Confirmed GitHub Copilot continuation in `.github/projects/active/next-issues-execution-plan.md` (v2.1.2) for the remaining Wave 2A issues (`#476`, `#480`, `#482`) and Wave 2C issues (`#488`, `#490`), explicitly requiring execution to continue until implementation, validation, and PR-ready merge state for `develop` are reached.

- Added comprehensive WCEU 2026 talk asset pack audit and NotebookLM hardening plan (Issue #529): `.github/wceu-2026/WCEU_2026_AUDIT_AND_READINESS_PLAN.md` (500+ lines). Audits folder structure, identifies critical gaps in NotebookLM prompts, provides hardening roadmap with explicit develop-branch URLs. Hardened `wceu-2026/notebooklm/deep-research-prompt.md` (450+ lines) with 14 canonical approved sources, source ingestion order, analysis objectives, and constraints. Created comprehensive `wceu-2026/notebooklm/source-ingestion-checklist.md` (350+ lines) with repo-only source policy, validation checklist, prohibited sources list, and enforcement rules. Ensures NotebookLM analysis is grounded in authoritative internal sources only. ([PR #543](https://github.com/lightspeedwp/.github/pull/543) — *feat(wceu-2026): Complete NotebookLM pipeline hardening and audit report*)

- Clarified mandatory execution ownership in `.github/projects/active/next-issues-execution-plan.md` (v2.1.1), explicitly splitting task streams between **GitHub Copilot** and **Claude Code** with a dedicated ownership matrix, updated wave labels, and explicit no-cross-execution policy language for exclusive workstreams.

- Updated `.github/projects/active/next-issues-execution-plan.md` to v2.1.0 and synchronised the Active Project Files Inventory with all current artefacts in `.github/projects/active/`, including Wave 3B/3C specs, Wave 4 branding specifications (`ISSUE_33`, `ISSUE_46`, `ISSUE_48`, `ISSUE_49`), planning summaries, plugin-pack wave task lists, and continuous monitoring planning assets.

- Added comprehensive current-state audit specification for unified branding agent (Issue #48): `.github/projects/active/ISSUE_48_CURRENT_STATE_AUDIT.md` (489 lines). Audits existing branding implementations against new .schemas/config standards, inventories frontmatter completeness (90.6% compliant, 70 files missing required fields), category mapping accuracy (98%+ correct), header/footer patterns (84.5% missing footers), badge usage (1.9% adoption), and WCAG AA accessibility (95%+ compliance). Documents gap analysis, remediation priorities with effort estimates (16–23 hours), remediation scripts needed, risk assessment, and success criteria. Provides baseline for planning agent rollout and documentation updates. ([PR #541](https://github.com/lightspeedwp/.github/pull/541) — *Issue #48: Current-state audit specification for branding agent*)

- Added comprehensive schema and config implementation specification for unified branding agent (Issue #49): `.github/projects/active/ISSUE_49_SCHEMA_CONFIG_IMPLEMENTATION.md` (800+ lines). Specification defines YAML + JSON Schema approach for configuration, documents all 16 document categories with metadata, specifies 4 required and 7 optional frontmatter fields, details path-based category inference with priority rules, documents badge types and category-specific placement rules, defines header/footer template reference structure, specifies validation rules and safe failure behaviour, includes complete example configuration, and establishes dependency relationships with Issues #33 and #46. Unblocks current-state audit (Issue #48) and agent implementation. ([PR #539](https://github.com/lightspeedwp/.github/pull/539) — *docs: add comprehensive slide deck prompt suite (25 total)*)

- Added comprehensive template design specification for unified branding agent (Issue #46): `.github/projects/active/ISSUE_46_TEMPLATE_DESIGN.md` (950+ lines). Specification defines header templates for all 16 document categories, footer variants (5 each for 6 key categories: Docs, Agents, Instructions, Schemas, Prompts, Governance; 1 each for 10 other categories), badge templates (Status, Category, Version, Review Status), accessibility constraints (WCAG AA compliance, contrast ratios, alt text), readability guidelines (line length, nesting, bullet lists), and YAML configuration structure for `config/templates.config.yaml`. Unblocks .schemas/config implementation (Issue #49) and current-state audit (Issue #48). Depends on Issue #33 parent specification. ([PR #538](https://github.com/lightspeedwp/.github/pull/538) — *Issue #46: Template design specification for branding agent*)

- Added comprehensive parent specification for unified branding agent (Issue #33): `.github/projects/active/ISSUE_33_BRANDING_AGENT_PARENT_SPEC.md` (1,100+ lines). Specification locks down category taxonomy (16 document categories), header/footer requirements with 5 variants each for 6 key categories, badge system, .schemas/config model (YAML + JSON Schema), frontmatter standards, and 4-phase delivery roadmap. Unblocks child issues #46 (template design), #49 (schema implementation), and #48 (agent development). ([PR #537](https://github.com/lightspeedwp/.github/pull/537) — *spec: Issue #33 - Comprehensive parent specification for unified branding agent*)

- Added WCAG 2.2 AA accessibility attributes (`accTitle` and `accDescr`) to all Mermaid diagrams across `profile/README.md`, `scripts/README.md`, `.github/README.md`, and supporting files. Closes [#513](https://github.com/lightspeedwp/.github/issues/513). ([PR #526](https://github.com/lightspeedwp/.github/pull/526) — *docs(a11y): add accTitle/accDescr to all Mermaid diagrams — Wave 3B (#513)*)

- **Comprehensive 25-Slide-Deck Prompt Suite** — Complete NotebookLM and design-tool integration documentation with 25 production-ready slide deck prompts:

  - **7 Agent Prompts**: Release, Branding, Meta, Reviewer, Linting, Labelling, Planner agents

  - **3 Infrastructure Prompts**: Plugin/agents/skills/hooks ecosystem, scripts and automation, GitHub Actions workflows

  - **15 Ecosystem Prompts**: Pull request lifecycle, issue triage, release process, documentation standards, repository metrics/KPIs, QA/testing, plugin architecture, observability/logging, WordPress governance, contributing guidelines, onboarding, developer experience, troubleshooting, roadmap/vision, case studies

  - **Navigation**: Updated `.github/wceu-2026/agent-slides/README.md` with comprehensive index across all 25 prompts

  - **Structure**: Each prompt includes overview, capabilities, integration points, use cases, slide structure, evidence anchors, design notes, quality bar

  - Enables complete NotebookLM knowledge base generation and design system documentation ([PR #539](https://github.com/lightspeedwp/.github/pull/539) — *docs: add comprehensive slide deck prompt suite (25 total)*)

- Added comprehensive branding meta agent planning documentation: `branding-meta-agent-planning-2026-05-28.md` (2,100 lines with 6-phase implementation roadmap), `PLANNING_SUMMARY_2026-05-28.md` (359 lines executive summary), and `SLIDES_GENERATION_PROMPT.md` (789 lines for WCEU 2026 20-slide generation). Updated `next-issues-execution-plan.md` with Wave 4 (branding meta agent, Claude-exclusive) and Wave 3D (WCEU 2026 talk planning). Hardened NotebookLM source prompts with explicit develop-branch URLs. Related to issues #33, #46, #48, #49, #529. ([PR #534](https://github.com/lightspeedwp/.github/pull/534) — *fix/plan: footer remediation + branding meta agent planning*)

- Added plugin-pack specialised skill rollout updates across active packs with per-platform manifest parity, expanded `SKILL_REGISTRY` scope coverage (`batch6PlatformYamlScope`), and refreshed rollout task tracking documentation. Closes [#524](https://github.com/lightspeedwp/.github/issues/524). ([PR #525](https://github.com/lightspeedwp/.github/pull/525) — *feat: roll out plugin-pack specialised skills and manifest parity*)

- Added `accTitle` and `accDescr` accessibility attributes to all 15 Mermaid diagrams across 8 README files (`.github/README.md`, `profile/README.md`, `scripts/README.md`, `scripts/validation/README.md`, `.github/ISSUE_TEMPLATE/README.md`, `.github/projects/README.md`, `.vscode/README.md`, `tests/README.md`), bringing WCAG 2.2 AA compliance to 100%. Added Wave 3A/3B audit report, findings CSV, and repair log to `.github/reports/mermaid-audit/`. Closes [#513](https://github.com/lightspeedwp/.github/issues/513).

- Upgraded `.github/instructions/markdown.instructions.md` to v1.1: added canonical scope and precedence statement, related-files summary table, expanded WCAG 2.2 AA accessibility section with required checks, expanded examples (tables, images, links, frontmatter), contribution/review process, and branded footer. Closes [#31](https://github.com/lightspeedwp/.github/issues/31).

- Added universal issue-field governance for `Priority`, `Start date`,

- CONTRIBUTING.md: removed forbidden `references` frontmatter field, corrected stale body date, and applied UK English consistency. Closes [#18](https://github.com/lightspeedwp/.github/issues/18). ([PR #457](https://github.com/lightspeedwp/.github/pull/457) — *docs: CONTRIBUTING.md — remove references frontmatter, npm ci, date fix*)

- Clarified frontmatter version governance to use SemVer-aligned change

- Updated the active next-issues execution plan with current closure state

- Added `docs/downstream/tour-operator-adoption.md` with pilot telemetry

- Added spec-only agent issue conversion tracking under `#61`, including

- Added Husky pre-push hook (`.husky/pre-push`) and updated `DEVELOPMENT.md` to document the enforced pre-push test gate (`npm run test:js`, `npm run test:bash`). Closes [#62](https://github.com/lightspeedwp/.github/issues/62). ([PR #458](https://github.com/lightspeedwp/.github/pull/458) — *ci: add Husky pre-push test gate and docs (#62)*)

- Expanded issue field governance to an organisation-level v2 model aligned to

- Clarified adoption workstream tracker links and historical issue references

- Hardened canonical label seeding with policy-gated orphan cleanup, added

- Started Wave 2A execution for `#465` (`issues.agent`) by validating canonical

- Started Wave 2A execution for `#466` (`labeling.agent`) by confirming

- Started Wave 2A execution for `#467` (`linting.agent`) by confirming

- Started Wave 2A execution for `#468` (`meta.agent`) by confirming

- Closed Wave 2A tracking issue `#469` (`metrics.agent`) by confirming

- Upgraded `agents/mode-demonstrate-understanding.agent.md` to v1.1: added complete frontmatter fields (`version`, `last_updated`, `owners`, `tags`, `file_type`, `status`, `domain`, `stability`, `permissions`), Implementation Status gap-analysis table, Dependencies section, and Changelog; confirmed no workflow needed (conversational mode agent). Closes [#470](https://github.com/lightspeedwp/.github/issues/470). ([PR #515](https://github.com/lightspeedwp/.github/pull/515) — *feat(agents): upgrade mode-demonstrate-understanding spec to v1.1*)

- Upgraded `agents/mode-document-reviewer.agent.md` to v1.1: added complete frontmatter fields (`version`, `last_updated`, `owners`, `tags`, `file_type`, `status`, `domain`, `stability`, `permissions`), Implementation Status gap-analysis table, Dependencies section, and Changelog; confirmed no workflow needed (conversational mode agent). Closes [#471](https://github.com/lightspeedwp/.github/issues/471). ([PR #516](https://github.com/lightspeedwp/.github/pull/516) — *feat(agents): upgrade mode-document-reviewer spec to v1.1*)

- Upgraded `agents/mode-prd.agent.md` to v1.1: added complete frontmatter fields (`version`, `last_updated`, `owners`, `tags`, `file_type`, `status`, `domain`, `stability`, `permissions`), Implementation Status gap-analysis table, Dependencies section, and Changelog; confirmed no workflow needed (conversational mode agent with inline `issue_write`). Closes [#473](https://github.com/lightspeedwp/.github/issues/473). ([PR #517](https://github.com/lightspeedwp/.github/pull/517) — *feat(agents): upgrade mode-prd spec to v1.1*)

- Upgraded `agents/mode-thinking.agent.md` to v2.1: added missing frontmatter fields (`owners`, `tags`, `domain`, `stability`), Implementation Status gap-analysis table, Dependencies section, and Changelog; confirmed no workflow needed (conversational mode agent). Closes [#475](https://github.com/lightspeedwp/.github/issues/475). ([PR #518](https://github.com/lightspeedwp/.github/pull/518) — *feat(agents): upgrade mode-thinking spec to v2.1*)

- Upgraded `agents/prompt-engineer.agent.md` to v2.1: added missing frontmatter fields (`domain`, `stability`), Implementation Status gap-analysis table (including prompt-tester handoff gap), Dependencies section, and Changelog. Closes [#478](https://github.com/lightspeedwp/.github/issues/478). ([PR #519](https://github.com/lightspeedwp/.github/pull/519) — *feat(agents): upgrade prompt-engineer spec to v2.1*)

- Upgraded `agents/task-planner.agent.md` to v3.1: added Implementation Status gap-analysis table confirming spec/workflow parity with `planner.yml`, and Changelog. Closes [#484](https://github.com/lightspeedwp/.github/issues/484). ([PR #520](https://github.com/lightspeedwp/.github/pull/520) — *feat(agents): upgrade task-planner spec to v3.1*)

- Upgraded `agents/task-researcher.agent.md` to v1.1: added complete frontmatter, full spec body (was an empty stub in v1.0), Implementation Status gap-analysis table, Dependencies section, and Changelog. Closes [#486](https://github.com/lightspeedwp/.github/issues/486). ([PR #521](https://github.com/lightspeedwp/.github/pull/521) — *feat(agents): upgrade task-researcher spec to v1.1*)

## [0.4.0] - 2026-05-27

### Documentation

- Added a canonical shared `.github` adoption guide with required, recommended,

- Added a downstream override policy document for org defaults and linked it

- Added canonical issue-field governance documentation and automation, including

## [0.3.0] - 2025-12-18

### Changed

- Repository maintenance: metrics snapshot updates, documentation and script syncs, and archive moves ([#64c3662](https://github.com/lightspeedwp/.github/commit/64c3662927b55996ad3c1966b9d65fe0d5253e16), [#aa66dc6](https://github.com/lightspeedwp/.github/commit/aa66dc6fe959113f24080d35749524d1f6784338), [#dd5b55f](https://github.com/lightspeedwp/.github/commit/dd5b55f14c4a2b697ca4f370f50830e099f197aa)).

## [0.2.0] - 2025-12-18

### Added

- Comprehensive meta agent (`meta.agent.js`) for unified front matter, badge, human reference, and footer automation (renamed from branding agent)

- Unified labeling agent (`labeling.agent.js`) replacing split status/type/standardization agents

- Extended README management with support for dynamic header/footer insertion and frontmatter validation

- Footer schema configuration (`footer.schema.json`) and header schema for consistent presentation

- Enhanced frontmatter validation across all `.md` files in repository

- Support for multiple footer variants with deterministic selection via seeding

- Emoji support in README headings for improved visual hierarchy

- Mermaid diagram preservation in all README updates

- Batch processing capabilities for efficient multi-file updates

### Changed

- Updated all README files with emoji-enhanced headings for better visual hierarchy

- Migrated frontmatter across core documentation to unified `frontmatter.schema.json` standard

- Reorganised `.github/agents/` structure with shared utilities in `includes/` subdirectory

- Consolidated badge management under meta agent (deprecated `badges.agent.js`)

- Unified header/footer handling under meta agent (deprecated `header-footer.agent.js`)

- Standardised YAML frontmatter metadata across all documentation files

- Enhanced README file templates with proper frontmatter structure

- Updated version numbers for all core README files to reflect latest changes

### Deprecated

- `badges.agent.js` - Use `meta.agent.js` instead for unified badge/header/footer management

- `header-footer.agent.js` - Use `meta.agent.js` instead for unified automation

### Fixed

- Corrected frontmatter schema validation errors in documentation files

- Fixed missing `created_date` fields in core README files

- Resolved inconsistent emoji usage across headings

- Fixed footer text alignment and markdown formatting

- Corrected references paths in frontmatter to use relative paths consistently

- Fixed mermaid diagram formatting in README files

### Documentation

- Added comprehensive meta agent specification in `.github/agents/meta.agent.md`

- Updated unified labeling agent documentation with latest configuration options

- Created detailed README templates for nested project directories

- Enhanced footer-content.json with multiple funky footer variants

- Documented footer schema validation and implementation

- Added examples for frontmatter validation across file types

- Created inline documentation for all agent helper functions

### Performance

- Optimised README file updates with batch multi-replace operations

- Improved footer selection performance with deterministic seeding

- Enhanced memory efficiency in meta agent for large file batches

## [0.1.0] - 2025-09-25

### Added

- Initial release of LightSpeed WordPress organisation community health files

- GitHub Copilot custom instructions and organisation-wide guidelines

- Comprehensive instruction files for WordPress development:

  - `coding-standards.instructions.md` - WordPress coding standards for PHP, JS, CSS

  - `html-template.instructions.md` - Block template and template part guidelines

  - `pattern-development.instructions.md` - Block pattern creation and advanced usage

  - `php-block.instructions.md` - PHP block development and theme setup

  - `playwright-tests.instructions.md` - Browser automation and accessibility testing

  - `theme-json.instructions.md` - Theme.json configuration and design tokens

- AI prompt templates for:

  - `accessibility-review.prompt.md` - Accessibility compliance review

  - `dev-code-review.prompt.md` - Code review and standards verification

  - `pattern-generation.prompt.md` - Block pattern generation assistance

  - `refactor-theme-types.prompt.md` - WordPress theme refactoring guidance

- Issue templates for comprehensive project management:

  - Bug reports, feature requests, documentation requests

  - Performance issues, UX feedback, integration issues

  - Code refactoring, task management, custom instructions proposals

- Pull request templates with WordPress-specific checklists

- VS Code configuration optimised for WordPress development:

  - MCP (Model Context Protocol) auto-start configuration

  - WordPress-specific extensions and settings

  - GitHub Copilot integration with custom instructions

  - Proper file associations for instruction and prompt files

- Example WordPress block structure following best practices

- Comprehensive documentation and README files

- GitHub Actions workflows for issue metrics and labeling

- Saved replies for common support scenarios

- Organisation profile README showcasing LightSpeed projects

### Changed

- Updated author attribution to "LightSpeedWP Team" for consistency

- Standardised related_links format as simple URL lists

- Enhanced MCP configuration for WordPress development context

- Improved file associations and discovery paths for AI tools

### Fixed

- Standardised YAML frontmatter across all instruction files

- Corrected indentation and formatting inconsistencies

- Aligned VS Code settings with repository structure

- Removed non-standard configuration keys for better compatibility

### Security

- Implemented proper input sanitisation and output escaping in examples

- Added security guidelines in coding standards

- Established secure development practices in instruction files

### Documentation

- Added comprehensive README files for instructions and prompts

- Created implementation guide for WordPress block development

- Established clear contribution guidelines and coding standards

- Documented VS Code configuration and MCP setup procedures

## Contributors

The entries in this [Unreleased] section represent work from 40+ merged PRs between May 24 — July 29, 2026.

**PR Range:** #1020, #1043–#1077, #1082–#1086, #1108, #1112–#1115, #1118–#1119, #1123, #1131–#1132, #1137–#1142, #1145, #1148–#1151, #1159, #1191, #1195–#1203, #1212, #1224–#1226, #1275, #1367, #1392, #1399, #1401, #1405

Thank you to everyone who contributed to these improvements!

## Reference

- [Branching Strategy](docs/BRANCHING_STRATEGY.md): Org-wide branch naming, merge discipline, and automation mapping.
- [CHANGELOG.md](./CHANGELOG.md): Changelog format, release notes, and versioning.
- [CONTRIBUTING.md](./CONTRIBUTING.md): Contribution guidelines, templates, coding standards.
- [AUTOMATION.md](docs/AUTOMATION.md): Org-wide automation, branching, labelling, and release strategy.
- [LABELING.md](docs/LABELING.md): Default issue, PR, and discussion label guidance.
- [Issue Types Guide](docs/ISSUE_TYPES.md): Classification and usage of issue types.

[Unreleased]: https://github.com/lightspeedwp/.github/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/lightspeedwp/.github/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/lightspeedwp/.github/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/lightspeedwp/.github/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/lightspeedwp/.github/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/lightspeedwp/.github/releases/tag/v0.2.0

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

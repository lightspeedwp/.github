---
title: "Changelog"
description: "All notable changes to this project, formatted per Keep a Changelog 1.1.0 and Semantic Versioning"
file_type: "documentation"
created_date: "2025-09-20"
---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- **Release Agent: Branch Push Upstream Tracking** — Fixed release agent to use `git push -u origin` when pushing release branches, ensuring proper upstream tracking for subsequent PR creation ([#585](https://github.com/lightspeedwp/.github/issues/585))
- **Release Agent: [Unreleased] Section Recreation** — Fixed release agent to inject new `[Unreleased]` section after rolling version, ensuring changelog is ready for next contribution cycle ([#586](https://github.com/lightspeedwp/.github/issues/586))
- **Release Agent: Sandboxed Dry-Run Mode** — Implemented proper dry-run mode that creates temporary git branch, validates file changes, runs linting, and tests git operations before cleanup—enabling safe end-to-end release testing ([#587](https://github.com/lightspeedwp/.github/issues/587))
- **Mergify Dependabot Auto-merge Rules** — Corrected Mergify configuration to automatically merge Dependabot PRs by fixing the author condition from `author=dependabot` to `author=dependabot[bot]` to match GitHub's actual Dependabot bot account name ([#573](https://github.com/lightspeedwp/.github/issues/573))
- **WCEU 2026 Branch Name References** — Updated references in `FINAL_REVIEW_CHECKLIST.md` and `PHASE1_COMPLETION_REPORT.md` from old branch name `claude/charming-goldberg-Pqc69` to correct branch `claude/affectionate-bohr-AX2jS`

### Added

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

- **Complete Agent Specifications & Documentation Audit** — Completed specification documentation for tracking agents and audited documentation cross-references:
  - Completed `agents/template.agent.md` with canonical agent specification template, usage guidelines, structure documentation, and best practices ([#488](https://github.com/lightspeedwp/.github/issues/488))
  - Enhanced `agents/testing.agent.md` with comprehensive role/responsibilities, capabilities, configuration, examples, and related agent references ([#490](https://github.com/lightspeedwp/.github/issues/490))
  - Audited documentation cross-references to CONTRIBUTING.md, GOVERNANCE.md, coding standards, and linting instructions ([#22](https://github.com/lightspeedwp/.github/issues/22))
  - Verified CONTRIBUTING.md has adequate Quick Start section and workflow diagram ([#18](https://github.com/lightspeedwp/.github/issues/18))
  - Verified PR template includes comprehensive accessibility and security checklists ([#21](https://github.com/lightspeedwp/.github/issues/21))

- **Wave 4C: Branding Agent Current-State Audit** — Added `.github/projects/active/ISSUE_48_CURRENT_STATE_AUDIT.md` comprehensive audit specification ([#48](https://github.com/lightspeedwp/.github/issues/48), [#562](https://github.com/lightspeedwp/.github/pull/562)):
  - Current-state inventory catalogs ~750 Markdown files with branding implementations
  - Frontmatter compliance analysis (90.6% compliant, 70 files with missing required fields)
  - Category mapping accuracy audit (98%+ correct, specific gaps identified)
  - Header and footer pattern analysis (84.5% coverage gap identified)
  - Badge usage assessment (1.9% adoption, 40% non-standard values)
  - WCAG AA accessibility audit (95%+ compliance with specific improvement areas)
  - Detailed gap analysis against new schema/config standards
  - Prioritized remediation roadmap with effort estimates (16–23 hours across 5 phases)
  - Automated remediation scripts scoped and designed
  - Risk assessment with comprehensive mitigation strategies
  - Success criteria and measurable outcomes for agent rollout
  - Unblocks Wave 4E (Agent merge/refactor) and Wave 4F (Bulk remediation & validation)

- **Comprehensive 25-Slide Deck Prompt Suite** — Added `.github/wceu-2026/agent-slides/` directory with 25 NotebookLM and Figma-ready presentation prompts covering the complete .github automation ecosystem:
  - **7 Agent Prompts**: Release, Branding, Meta, Reviewer, Linting, Labelling, and Planner agents with capabilities, integration points, and use cases
  - **3 Infrastructure Prompts**: Plugin/Agents/Skills/Hooks integration, Scripts & Automation orchestration, and Workflows architecture
  - **8 Process & Lifecycle Prompts**: PR lifecycle, issue triage, release process, documentation standards, repository metrics, QA/testing, plugin deep-dive, and observability/logging
  - **2 Governance & Standards Prompts**: WordPress-specific requirements and contributing guidelines
  - **5 Developer Experience & Strategy Prompts**: Getting started, best practices, troubleshooting/debugging, roadmap/vision, and case studies/success stories
  - Each prompt includes system overview, key components, integration points, 3+ use cases, 12-15 slide structure, evidence anchors linking to repository files, design notes for visual consistency, and quality bars for validation. Enables presentation creation with NotebookLM, Figma, and other design tools. ([#549](https://github.com/lightspeedwp/.github/pull/549))

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
  - Integrated into Release Agent post-release phase ([#536](https://github.com/lightspeedwp/.github/pull/536))

- **Wave 4 Specification** — Added `.github/projects/active/wave-4-continuous-monitoring.md` comprehensive specification for continuous README and Mermaid diagram monitoring:
  - Scheduled weekly audit workflows
  - Drift detection on push events
  - Monthly freshness notifications
  - Quarterly health reports with recommendations
  - CI/CD integration patterns and metric collection
  - Foundation for long-term automation roadmap (Waves 5-7) ([#536](https://github.com/lightspeedwp/.github/pull/536))

- **Comprehensive Documentation Index** — Created `docs/README.md` with complete documentation hub and navigation guide:
  - Quick-start sections for First-Time Contributors, Maintainers, and Workflow & Automation teams
  - 9 logical documentation categories with 36+ indexed files (Architecture & Strategy, Workflows & Processes, Labeling & Project Management, Configuration & Setup, Development & Standards, Governance & Decisions, Monitoring & Metrics, Adoption & Integration)
  - Role-based navigation table (Developer, Reviewer, Maintainer, Automation/DevOps, Organisation Lead)
  - Task-based quick-reference table (8 common tasks with relevant documentation links)
  - Documentation standards reference (UK English, Markdown with YAML frontmatter, relative links, WCAG 2.2 AA compliance)
  - Related resources and help section for discoverability
  - Updated Mermaid diagrams with WCAG 2.2 AA accessibility attributes (`accTitle`, `accDescr`)
  - Removed prohibited `references` fields from README files per CLAUDE.md governance rules
  - Closes Issue [#19](https://github.com/lightspeedwp/.github/issues/19) ([#552](https://github.com/lightspeedwp/.github/pull/552))

- **Wave 4C: Current-State Audit & Remediation Plan** — Completed comprehensive audit of 932 markdown files with detailed remediation strategy:
  - `scripts/audit-branding-patterns.js`: New ES Module audit script detecting footers, badges, and frontmatter compliance across repository
  - Category-based analysis: 31.7% footer coverage, 1.5% badge coverage, 8.7% frontmatter compliance (critical 851-file gap)
  - `.github/reports/wave-4c-audit-report.md`: Current-state findings with category-specific breakdown and recommendations
  - `.github/reports/wave-4c-remediation-plan.md`: Phased remediation roadmap (Phase 1-3 over 9-12 hours, Waves 4D-4F)
  - High-priority focus: Skills category (696 files, 18.1% footer coverage) and frontmatter schema compliance
  - Risk assessment, success criteria, and dependency analysis for phased execution
  - Unblocks Wave 4D (Issue #554) schema implementation, Wave 4E (Issue #555) agent merge, and Wave 4F (Issue #556) bulk remediation
  - Closes Issue [#553](https://github.com/lightspeedwp/.github/issues/553) ([#558](https://github.com/lightspeedwp/.github/pull/558))

### Fixed

- **Plugin Structure Instructions Frontmatter** — Added missing `title` and `category` fields to `instructions/plugin-structure.instructions.md` to meet frontmatter schema requirements ([#535](https://github.com/lightspeedwp/.github/pull/547))

### Changed

- Added guarded Dependabot security auto-merge automation for `develop` by introducing Mergify conditions tied to Dependabot author, dependency/security labels, conflict/draft guards, and successful required checks. Added and wired a Dependabot security labelling workflow and aligned labels to canonical naming (`meta:dependabot-security`) to satisfy label governance and enable controlled auto-merge behaviour. ([#563](https://github.com/lightspeedwp/.github/pull/563))

- **Release Agent Integration** — Updated `agents/release.agent.md` (v2.2 → v2.3) with post-release `readme-update.yml` invocation:
  - Documented workflow contract with inputs, outputs, and failure handling
  - Added to orchestration algorithm as non-blocking post-release action
  - Conditional execution based on README maintenance requirements ([#536](https://github.com/lightspeedwp/.github/pull/536))

- **Workflow Coordination Documentation** — Updated `.github/docs/workflow-coordination.md` (v1.0.0 → v1.1.0):
  - Documented `readme-update.yml` in Agent-Triggered Workflow Registry
  - Added comprehensive specification with inputs, outputs, and integration points
  - Clarified Release Agent orchestration pattern for post-release actions ([#536](https://github.com/lightspeedwp/.github/pull/536))

- **Plugin Structure Migration** — Migrated `instructions/plugin-structure.instructions.md` from `.github/instructions/` to top-level `instructions/` folder:
  - Follows CLAUDE.md guidelines for portable reusable assets
  - Updated references across `.github/README.md` and `CLAUDE.md`
  - Clarified repository structure: GitHub-native files in `.github/`, portable assets in top-level folders ([#536](https://github.com/lightspeedwp/.github/pull/536))

### Documentation

- Confirmed GitHub Copilot continuation in `.github/projects/active/next-issues-execution-plan.md` (v2.1.2) for the remaining Wave 2A issues (`#476`, `#480`, `#482`) and Wave 2C issues (`#488`, `#490`), explicitly requiring execution to continue until implementation, validation, and PR-ready merge state for `develop` are reached.
- Added comprehensive WCEU 2026 talk asset pack audit and NotebookLM hardening plan (Issue #529): `.github/wceu-2026/WCEU_2026_AUDIT_AND_READINESS_PLAN.md` (500+ lines). Audits folder structure, identifies critical gaps in NotebookLM prompts, provides hardening roadmap with explicit develop-branch URLs. Hardened `wceu-2026/notebooklm/deep-research-prompt.md` (450+ lines) with 14 canonical approved sources, source ingestion order, analysis objectives, and constraints. Created comprehensive `wceu-2026/notebooklm/source-ingestion-checklist.md` (350+ lines) with repo-only source policy, validation checklist, prohibited sources list, and enforcement rules. Ensures NotebookLM analysis is grounded in authoritative internal sources only. ([#543](https://github.com/lightspeedwp/.github/pull/543))
- Clarified mandatory execution ownership in `.github/projects/active/next-issues-execution-plan.md` (v2.1.1), explicitly splitting task streams between **GitHub Copilot** and **Claude Code** with a dedicated ownership matrix, updated wave labels, and explicit no-cross-execution policy language for exclusive workstreams.
- Updated `.github/projects/active/next-issues-execution-plan.md` to v2.1.0 and synchronised the Active Project Files Inventory with all current artefacts in `.github/projects/active/`, including Wave 3B/3C specs, Wave 4 branding specifications (`ISSUE_33`, `ISSUE_46`, `ISSUE_48`, `ISSUE_49`), planning summaries, plugin-pack wave task lists, and continuous monitoring planning assets.
- Added comprehensive current-state audit specification for unified branding agent (Issue #48): `.github/projects/active/ISSUE_48_CURRENT_STATE_AUDIT.md` (489 lines). Audits existing branding implementations against new schema/config standards, inventories frontmatter completeness (90.6% compliant, 70 files missing required fields), category mapping accuracy (98%+ correct), header/footer patterns (84.5% missing footers), badge usage (1.9% adoption), and WCAG AA accessibility (95%+ compliance). Documents gap analysis, remediation priorities with effort estimates (16–23 hours), remediation scripts needed, risk assessment, and success criteria. Provides baseline for planning agent rollout and documentation updates. ([#541](https://github.com/lightspeedwp/.github/pull/541))
- Added comprehensive schema and config implementation specification for unified branding agent (Issue #49): `.github/projects/active/ISSUE_49_SCHEMA_CONFIG_IMPLEMENTATION.md` (800+ lines). Specification defines YAML + JSON Schema approach for configuration, documents all 16 document categories with metadata, specifies 4 required and 7 optional frontmatter fields, details path-based category inference with priority rules, documents badge types and category-specific placement rules, defines header/footer template reference structure, specifies validation rules and safe failure behavior, includes complete example configuration, and establishes dependency relationships with Issues #33 and #46. Unblocks current-state audit (Issue #48) and agent implementation. ([#539](https://github.com/lightspeedwp/.github/pull/539))
- Added comprehensive template design specification for unified branding agent (Issue #46): `.github/projects/active/ISSUE_46_TEMPLATE_DESIGN.md` (950+ lines). Specification defines header templates for all 16 document categories, footer variants (5 each for 6 key categories: Docs, Agents, Instructions, Schemas, Prompts, Governance; 1 each for 10 other categories), badge templates (Status, Category, Version, Review Status), accessibility constraints (WCAG AA compliance, contrast ratios, alt text), readability guidelines (line length, nesting, bullet lists), and YAML configuration structure for `config/templates.config.yaml`. Unblocks schema/config implementation (Issue #49) and current-state audit (Issue #48). Depends on Issue #33 parent specification. ([#538](https://github.com/lightspeedwp/.github/pull/538))
- Added comprehensive parent specification for unified branding agent (Issue #33): `.github/projects/active/ISSUE_33_BRANDING_AGENT_PARENT_SPEC.md` (1,100+ lines). Specification locks down category taxonomy (16 document categories), header/footer requirements with 5 variants each for 6 key categories, badge system, schema/config model (YAML + JSON Schema), frontmatter standards, and 4-phase delivery roadmap. Unblocks child issues #46 (template design), #49 (schema implementation), and #48 (agent development). ([#537](https://github.com/lightspeedwp/.github/pull/537))
- Added WCAG 2.2 AA accessibility attributes (`accTitle` and `accDescr`) to all Mermaid diagrams across `profile/README.md`, `scripts/README.md`, `.github/README.md`, and supporting files. Closes [#513](https://github.com/lightspeedwp/.github/issues/513). ([#526](https://github.com/lightspeedwp/.github/pull/526))

### Fixed

- Remediated duplicate and multiple footer blocks across 664 Markdown files using schema-driven validation. Created footer configuration schema (`schema/footer-config.schema.json`), centralized footer library with 15 document categories (`config/footers.config.yaml`), and automated validation/remediation script (`.github/scripts/validate-footers.js`). Violations fixed: 51 duplicate footer files → 0, 613 multiple-footer files → 0. Published remediation guide (`.github/FOOTER_REMEDIATION_GUIDE.md`). Related to branding meta agent planning (#33, #46, #48, #49). ([#534](https://github.com/lightspeedwp/.github/pull/534))
- Removed prohibited `references:` frontmatter field from 9 README files (`README.md`, `.github/README.md`, `.github/agents/README.md`, `.github/instructions/README.md`, `.github/metrics/README.md`, `.github/schemas/README.md`, `schema/README.md`, `profile/README.md`, `scripts/README.md`) per CLAUDE.md governance rule. Added missing required frontmatter fields (`owners`, `status`, `stability`, `domain`) to affected files. Removed 13 duplicate footer blocks from root `README.md`. Added `.lycheeignore` excluding social-platform and LightSpeed external domains from CI link checking. Added `docs/MIGRATION.md` portable AI plugin restructure migration maps (completed and pending migrations, file placement quick-reference). Related to [#18](https://github.com/lightspeedwp/.github/issues/18). ([#527](https://github.com/lightspeedwp/.github/pull/527))
- Replaced deprecated MCP tool references (`create_issue`, `update_issue`, `get_issue`) with current equivalents (`issue_write`, `issue_read`) across agent specs and prompt files. Closes [#52](https://github.com/lightspeedwp/.github/issues/52). ([#455](https://github.com/lightspeedwp/.github/pull/455))
- Expanded issue template DoD checklists with discrete accessibility (WCAG 2.2 AA), security (OWASP Top 10), and performance items, aligning issue templates with the PR template. Closes [#21](https://github.com/lightspeedwp/.github/issues/21). ([#460](https://github.com/lightspeedwp/.github/pull/460))
- Updated `.coderabbit.yml`: corrected schema URL to `docs.coderabbit.ai/schema/schema.v2.json`; added `language: en-GB`, `inheritance: true`, `chat.auto_reply: true`; added `reviews.profile: chill` and `reviews.review_details: true`; hardened workflow path instructions with security guidance (least-privilege permissions, secret injection prevention, action pinning); added `instructions/**` and `CHANGELOG.md` path instructions; expanded path filters. Closes [#23](https://github.com/lightspeedwp/.github/issues/23).

### Documentation

- **Comprehensive 25-Slide-Deck Prompt Suite** — Complete NotebookLM and design-tool integration documentation with 25 production-ready slide deck prompts:
  - **7 Agent Prompts**: Release, Branding, Meta, Reviewer, Linting, Labelling, Planner agents
  - **3 Infrastructure Prompts**: Plugin/agents/skills/hooks ecosystem, scripts and automation, GitHub Actions workflows
  - **15 Ecosystem Prompts**: Pull request lifecycle, issue triage, release process, documentation standards, repository metrics/KPIs, QA/testing, plugin architecture, observability/logging, WordPress governance, contributing guidelines, onboarding, developer experience, troubleshooting, roadmap/vision, case studies
  - **Navigation**: Updated `.github/wceu-2026/agent-slides/README.md` with comprehensive index across all 25 prompts
  - **Structure**: Each prompt includes overview, capabilities, integration points, use cases, slide structure, evidence anchors, design notes, quality bar
  - Enables complete NotebookLM knowledge base generation and design system documentation ([#539](https://github.com/lightspeedwp/.github/pull/539))

- Added comprehensive branding meta agent planning documentation: `branding-meta-agent-planning-2026-05-28.md` (2,100 lines with 6-phase implementation roadmap), `PLANNING_SUMMARY_2026-05-28.md` (359 lines executive summary), and `SLIDES_GENERATION_PROMPT.md` (789 lines for WCEU 2026 20-slide generation). Updated `next-issues-execution-plan.md` with Wave 4 (branding meta agent, Claude-exclusive) and Wave 3D (WCEU 2026 talk planning). Hardened NotebookLM source prompts with explicit develop-branch URLs. Related to issues #33, #46, #48, #49, #529. ([#534](https://github.com/lightspeedwp/.github/pull/534))
- Added plugin-pack specialised skill rollout updates across active packs with per-platform manifest parity, expanded `SKILL_REGISTRY` scope coverage (`batch6PlatformYamlScope`), and refreshed rollout task tracking documentation. Closes [#524](https://github.com/lightspeedwp/.github/issues/524). ([#525](https://github.com/lightspeedwp/.github/pull/525))

- Added `accTitle` and `accDescr` accessibility attributes to all 15 Mermaid diagrams across 8 README files (`.github/README.md`, `profile/README.md`, `scripts/README.md`, `scripts/validation/README.md`, `.github/ISSUE_TEMPLATE/README.md`, `.github/projects/README.md`, `.vscode/README.md`, `tests/README.md`), bringing WCAG 2.2 AA compliance to 100%. Added Wave 3A/3B audit report, findings CSV, and repair log to `.github/reports/mermaid-audit/`. Closes [#513](https://github.com/lightspeedwp/.github/issues/513).
- Upgraded `.github/instructions/markdown.instructions.md` to v1.1: added canonical scope and precedence statement, related-files summary table, expanded WCAG 2.2 AA accessibility section with required checks, expanded examples (tables, images, links, frontmatter), contribution/review process, and branded footer. Closes [#31](https://github.com/lightspeedwp/.github/issues/31).
- Added universal issue-field governance for `Priority`, `Start date`,
  `Target date`, and `Effort`; aligned canonical config and instructions; and
  automated project sync updates for `Effort` and `Start date`. ([#501](https://github.com/lightspeedwp/.github/pull/501))

- CONTRIBUTING.md: removed forbidden `references` frontmatter field, corrected stale body date, and applied UK English consistency. Closes [#18](https://github.com/lightspeedwp/.github/issues/18). ([#457](https://github.com/lightspeedwp/.github/pull/457))
- Clarified frontmatter version governance to use SemVer-aligned change
  classification with patch-first progression where appropriate, and aligned
  release instructions to Keep a Changelog 1.1.0 taxonomy.
- Updated the active next-issues execution plan with current closure state
  (`#61` merged via `#493`), explicit Codex/Claude ownership split, and next
  actionable focus on `#60` while `#52` remains in-flight.
- Added `docs/downstream/tour-operator-adoption.md` with pilot telemetry
  baseline checklist, target metrics, documented opt-out points, metrics
  emission example, and dashboard-consumption stub for `#60`.
- Added spec-only agent issue conversion tracking under `#61`, including
  canonical issue mapping and duplicate cleanup notes.
- Added Husky pre-push hook (`.husky/pre-push`) and updated `DEVELOPMENT.md` to document the enforced pre-push test gate (`npm run test:js`, `npm run test:bash`). Closes [#62](https://github.com/lightspeedwp/.github/issues/62). ([#458](https://github.com/lightspeedwp/.github/pull/458))
- Expanded issue field governance to an organisation-level v2 model aligned to
  GitHub field capabilities (typed custom fields, hidden/system fields, and
  iteration policy) with stricter validation.
- Clarified adoption workstream tracker links and historical issue references
  in the active adoption pack documentation.
- Hardened canonical label seeding with policy-gated orphan cleanup, added
  label-governance policy config, and documented #95 decision gating for
  destructive cleanup.
- Started Wave 2A execution for `#465` (`issues.agent`) by validating canonical
  spec/runtime paths, documenting current apply-mode gap, and recording the
  next implementation step for guarded mutation support.
- Started Wave 2A execution for `#466` (`labeling.agent`) by confirming
  spec/runtime parity, recording implemented status, and capturing the next
  hardening step for edge-case test coverage.
- Started Wave 2A execution for `#467` (`linting.agent`) by confirming
  spec/runtime paths, documenting the stub implementation gap, and recording
  the next step for structured lint orchestration and test coverage.
- Started Wave 2A execution for `#468` (`meta.agent`) by confirming
  spec/runtime parity, recording active workflow-integrated status, and
  capturing hardening follow-ups for header cleanup and opt-out edge-case
  tests.

- Closed Wave 2A tracking issue `#469` (`metrics.agent`) by confirming
  spec/runtime references, documenting the current runtime placeholder gap, and
  queuing implementation follow-up under the next ready Wave 2A issue.
- Upgraded `agents/mode-demonstrate-understanding.agent.md` to v1.1: added complete frontmatter fields (`version`, `last_updated`, `owners`, `tags`, `file_type`, `status`, `domain`, `stability`, `permissions`), Implementation Status gap-analysis table, Dependencies section, and Changelog; confirmed no workflow needed (conversational mode agent). Closes [#470](https://github.com/lightspeedwp/.github/issues/470). ([#515](https://github.com/lightspeedwp/.github/pull/515))
- Upgraded `agents/mode-document-reviewer.agent.md` to v1.1: added complete frontmatter fields (`version`, `last_updated`, `owners`, `tags`, `file_type`, `status`, `domain`, `stability`, `permissions`), Implementation Status gap-analysis table, Dependencies section, and Changelog; confirmed no workflow needed (conversational mode agent). Closes [#471](https://github.com/lightspeedwp/.github/issues/471). ([#516](https://github.com/lightspeedwp/.github/pull/516))
- Upgraded `agents/mode-prd.agent.md` to v1.1: added complete frontmatter fields (`version`, `last_updated`, `owners`, `tags`, `file_type`, `status`, `domain`, `stability`, `permissions`), Implementation Status gap-analysis table, Dependencies section, and Changelog; confirmed no workflow needed (conversational mode agent with inline `issue_write`). Closes [#473](https://github.com/lightspeedwp/.github/issues/473). ([#517](https://github.com/lightspeedwp/.github/pull/517))
- Upgraded `agents/mode-thinking.agent.md` to v2.1: added missing frontmatter fields (`owners`, `tags`, `domain`, `stability`), Implementation Status gap-analysis table, Dependencies section, and Changelog; confirmed no workflow needed (conversational mode agent). Closes [#475](https://github.com/lightspeedwp/.github/issues/475). ([#518](https://github.com/lightspeedwp/.github/pull/518))
- Upgraded `agents/prompt-engineer.agent.md` to v2.1: added missing frontmatter fields (`domain`, `stability`), Implementation Status gap-analysis table (including prompt-tester handoff gap), Dependencies section, and Changelog. Closes [#478](https://github.com/lightspeedwp/.github/issues/478). ([#519](https://github.com/lightspeedwp/.github/pull/519))
- Upgraded `agents/task-planner.agent.md` to v3.1: added Implementation Status gap-analysis table confirming spec/workflow parity with `planner.yml`, and Changelog. Closes [#484](https://github.com/lightspeedwp/.github/issues/484). ([#520](https://github.com/lightspeedwp/.github/pull/520))
- Upgraded `agents/task-researcher.agent.md` to v1.1: added complete frontmatter, full spec body (was an empty stub in v1.0), Implementation Status gap-analysis table, Dependencies section, and Changelog. Closes [#486](https://github.com/lightspeedwp/.github/issues/486). ([#521](https://github.com/lightspeedwp/.github/pull/521))

## [0.4.0] - 2026-05-27

### Documentation

- Added a canonical shared `.github` adoption guide with required, recommended,
  optional, and repo-local-only classifications, plus update and validation
  workflows for consuming repositories.
- Added a downstream override policy document for org defaults and linked it
  from contribution and docs index pages to support repository-level adoption
  decisions.
- Added canonical issue-field governance documentation and automation, including
  `.github/issue-fields.yml`, `docs/ISSUE-FIELDS.md`, and workflow validation
  support for metadata consistency across issues and PRs.

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

### Documentation

- Added comprehensive meta agent specification in `.github/agents/meta.agent.md`
- Updated unified labeling agent documentation with latest configuration options
- Created detailed README templates for nested project directories
- Enhanced footer-content.json with multiple funky footer variants
- Documented footer schema validation and implementation
- Added examples for frontmatter validation across file types
- Created inline documentation for all agent helper functions

### Fixed

- Corrected frontmatter schema validation errors in documentation files
- Fixed missing `created_date` fields in core README files
- Resolved inconsistent emoji usage across headings
- Fixed footer text alignment and markdown formatting
- Corrected references paths in frontmatter to use relative paths consistently
- Fixed mermaid diagram formatting in README files

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

### Deprecated

- [placeholder]

### Fixed

- Standardised YAML frontmatter across all instruction files
- Corrected indentation and formatting inconsistencies
- Aligned VS Code settings with repository structure
- Removed non-standard configuration keys for better compatibility

### Changed

- Updated author attribution to "LightSpeedWP Team" for consistency
- Standardised related_links format as simple URL lists
- Enhanced MCP configuration for WordPress development context
- Improved file associations and discovery paths for AI tools

### Documentation

- Added comprehensive README files for instructions and prompts
- Created implementation guide for WordPress block development
- Established clear contribution guidelines and coding standards
- Documented VS Code configuration and MCP setup procedures

### Performance

- [placeholder]

### Removed

- [placeholder]

### Security

- Implemented proper input sanitisation and output escaping in examples
- Added security guidelines in coding standards
- Established secure development practices in instruction files

## Reference

- [Branching Strategy](docs/BRANCHING_STRATEGY.md): Org-wide branch naming, merge discipline, and automation mapping.
- [CHANGELOG.md](./CHANGELOG.md): Changelog format, release notes, and versioning.
- [CONTRIBUTING.md](./CONTRIBUTING.md): Contribution guidelines, templates, coding standards.
- [AUTOMATION_GOVERNANCE.md](docs/AUTOMATION_GOVERNANCE.md): Org-wide automation, branching, labelling, and release strategy.
- [Org-wide Issue Labels](docs/ISSUE_LABELS.md): Default labels and usage guidance.
- [Pull Request Labels](docs/PR_LABELS.md): PR classification and automation standards.
- [Issue Types Guide](docs/ISSUE_TYPES.md): Classification and usage of issue types.

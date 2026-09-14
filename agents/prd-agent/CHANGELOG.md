# Changelog — PRD Agent

All notable changes to the PRD Agent are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.4.0] - [WIP] Phase 6 Rollout & Adoption

**Status**: 🟡 IN PROGRESS (data collection Weeks 1-6, finalized Week 6)
**Release Date**: TBD (2026-10-27 planned, pending Phase 6 completion — per tasks.md T075)

### Changed

- [WIP] Adoption rollout execution across ≥5 teams (T071 briefings, T073 usage monitoring)
- [WIP] Consolidated agent integration into team workflows (metrics in PHASE6_EXECUTION_LOG.md)
- [WIP] Provider consistency validation (multi-team, multi-provider adoption patterns)

### Added

- [WIP] **ROLLOUT_PLAN.md**: 9-week rollout timeline, team contact list, communication channels, success metrics (FR-601)
- [WIP] **ADOPTION_METRICS.md**: KPI framework (team adoption rate, user satisfaction, blocker tracking) with quantified "actively using" definition (≥1 PRD/team/week) (FR-603)
- [WIP] **FAQ.md**: 50+ Q&A and troubleshooting guide based on Phase 6 team feedback (FR-605)
- [WIP] **PHASE6_EXECUTION_LOG.md**: Dated weekly check-in tracker for briefings (T071) and usage monitoring (T073) (FR-604)
- [WIP] **PHASE7_DECISION_CRITERIA.md**: Archive vs. Sync decision framework based on adoption metrics (FR-702)

### Fixed

- [WIP] Team adoption blockers identified and resolved during Weeks 1-6
- [WIP] FAQ entries and troubleshooting guides updated based on reported issues

### Adoption Metrics (Pending Week 6 Finalization)

**Team Adoption**:
- Active teams (≥1 PRD/team/week): TBD / 5 target
- Team briefings completed: TBD / 5 minimum
- Early adoption feedback: [collected in PHASE6_EXECUTION_LOG.md]

**User Satisfaction**:
- Average satisfaction score: TBD / 5.0 (target: ≥4.0/5.0)
- Survey respondents: TBD / ≥10 target
- Top feedback themes: [to be populated Week 6]

**Quality & Issues**:
- Critical blockers reported: TBD (target: 0)
- High-priority issues: TBD (target: 0)
- Resolved issues: TBD / TBD

### Phase 6 Deliverables (Per spec.md FR-601 through FR-605)

- **FR-601**: Rollout communication and documentation → ROLLOUT_PLAN.md ✅
- **FR-602**: Team briefings on consolidated capabilities → T071 (Weeks 2-3, in PHASE6_EXECUTION_LOG.md)
- **FR-603**: Metrics collection and adoption tracking → ADOPTION_METRICS.md ✅
- **FR-604**: Team usage monitoring and feedback collection → T073 (Weeks 1-6, in PHASE6_EXECUTION_LOG.md)
- **FR-605**: FAQ and troubleshooting guide → FAQ.md ✅

**Checkpoint Status** (pending Week 6):
- [ ] SC-601: Rollout delivered to ≥5 teams
- [ ] SC-602: ≥5 active teams after 30 days (≥1 PRD/team/week)
- [ ] SC-603: User satisfaction ≥4.0/5.0
- [ ] SC-604: No critical regressions vs. baseline

---

## [2.3.0] - 2026-09-12

### Changed

- **Comprehensive Testing & Validation**: Phase 5 testing framework executed across all providers (Claude Code Sonnet 5, GitHub Copilot GPT-4, OpenAI API GPT-4)
- **Test Coverage Expansion**: 14 comprehensive test cases covering PRD Generation Quality, Multi-Skill Orchestration, GitHub Integration, and Skill Inventory Accuracy
- **Provider Parity**: Validated consolidated agent consistency and capability matching across all three platforms

### Added

- **TEST_RESULTS.md**: Comprehensive test results and metrics across all 14 test cases and all three providers
- **PHASE5_EXECUTION_PLAN.md**: Test execution plan and validation framework
- **Test Case Framework**: 14 test cases (TC-101 through TC-402) covering consolidated 28-skill architecture across 4 categories
- **Provider Testing**: Test execution results for Claude Code, GitHub Copilot, and OpenAI API platforms

### Fixed

- **Test Coverage**: Achieved 100% pass rate on all providers (Claude 14/14, Copilot 14/14, OpenAI 14/14)
- **Skill Inventory Validation**: All 28 canonical skills verified and accessible across all providers
- **Cross-Provider Compatibility**: No regressions or provider-specific issues identified

### Phase 5 Deliverables

- **FR-501**: Test suite created with 14 comprehensive test cases covering all 28 consolidated skills and agent routing
- **FR-502**: Test execution completed on all three providers (Claude, Copilot, OpenAI) with 100% pass rate
- **FR-503**: PRD generation quality validated against baseline test cases (100% > 95% target)
- **FR-504**: Test results documented in TEST_RESULTS.md with pass rates, coverage metrics, and provider comparison
- **FR-505**: Bug tracking completed; 0 critical issues identified; all 14 tests passing

**Validation Status**: ✅ Phase 5 COMPLETE — All success criteria met and exceeded (100% pass rate vs. ≥95% target; ≥90% coverage maintained across all skills and provider combinations)

## [2.2.0] - 2026-09-11

### Changed

- **System Prompt Enhancement**: Comprehensive rewrite of Claude and Copilot agent prompts with explicit 28-skill architecture documentation
- **Skill Routing Logic**: Detailed decision trees for multi-skill workflows (project entry → PRD → planning → quality → approval → launch/closure)
- **Provider Optimization**: Distinct prompt tuning for Claude Code (linear/planning focus) and GitHub Copilot (GitHub-centric workflows)
- **Capability Clarity**: Updated capability matrices mapping workflow stages to primary/validation/integration skills
- **Cross-Skill Context**: Enhanced documentation of cross-skill routing patterns and context passing mechanisms
- **Phase 4 Deliverables**: FR-412 (Prompt Enhancement), FR-413 (Memory Registry verification), FR-414 (Test case baseline), FR-415 (CHANGELOG update)

### Added

- **PROMPT_ENHANCEMENT_ANALYSIS.md**: Baseline analysis documenting Phase 3 consolidation state and Phase 4 enhancement opportunities
- **TEST_CASES_BASELINE.md**: 14 comprehensive test cases across 4 categories (PRD Generation Quality, Multi-Skill Orchestration, GitHub Integration, Skill Inventory Accuracy) for measuring post-enhancement improvement (target ≥15% per spec.md US4/AC1)
- **Claude Agent Prompt**: Complete system prompt with 28-skill inventory, 5-cluster organization (Drafting, Planning, Quality, Coordination, Integration), decision trees for common workflows, integration points (GitHub/Linear/Google Workspace), and key guardrails
- **Copilot Agent Prompt**: GitHub-optimized system prompt with GitHub-centric skill clusters, issue management workflows, project coordination patterns, and Copilot-specific tips
- **Common Workflows**: Documented 3 high-frequency workflows for Claude and 4 GitHub-integrated workflows for Copilot
- **Example Scenarios**: Three detailed multi-skill workflow examples per provider

## [2.1.0] - 2026-09-10

### Changed

- **Skill consolidation**: Reduced from 45+ skills to 28 canonical skills through merge and deduplication
- **Repository structure**: Merged `agents/prd-agent/` and `agents/prd-factory-planner-agent/` into single canonical folder
- **Documentation**: Replaced boilerplate README with real, human-facing documentation
- **Agent definitions**: Rewrote `claude/agent.md` and `copilot/agent.md` with real, loadable YAML frontmatter
- **Skill routing**: Rewrote `instructions/AGENTS.md` with complete skill routing guide
- **Phase 3 Deliverables**: Union-merged forked skills (FR-001), promoted qa-planner (FR-002), resolved 17 skill clusters (FR-003), ported Integration Points (FR-004), replaced README.md (FR-005), rewrote AGENTS.md (FR-006), deleted prd-factory-planner-agent folder (FR-007), cleaned legacy exports (FR-008), rewrote agent definitions (FR-009)

### Added

- **CHANGELOG.md**: New version history tracking (this file)
- **Integration Points**: Documented real, plugin-backed integrations (Linear, GitHub, Google Workspace)
- **Capability tags**: Added `resource-allocation` and `scope-definition` capability tags
- **Skill routing guide**: Complete skill inventory and routing patterns in `instructions/AGENTS.md`

### Removed

- **Duplicate skills**: Removed 17+ duplicate skill folders that were identical between consolidated sources
- **Forked skills**: Merged 4 forked skills (approval-gate-manager, project-memory-manager, release-handoff-generator, qa-planner)
- **Legacy exports**: Cleaned up export cruft from `agent/` directory (sample memory banks, plugin cache dumps)
- **Deleted skills**: frontend-skill, issue-drafting, launch-handoff-support, technical-brief-deep-dive, and 13 other redundant skills per consolidation audit

### Fixed

- **README.md**: Replaced Codex export boilerplate with real documentation; removed dangling links to nonexistent CONTRIBUTING.md and checksums.sha256
- **claude/agent.md**: Added proper YAML frontmatter (name, description, tools, model) for Claude Code loadability
- **copilot/agent.md**: Added proper YAML frontmatter (name, description, tools, mcp-servers) for GitHub Copilot loadability
- **AGENT.md**: Updated Integration Points to list only real, plugin-backed services (Linear, GitHub, Google Workspace; excluded Figma/Slack)

## [2.0.1] - 2026-08-21

### Changed

- Updated agent metadata and descriptions
- Improved provider support documentation

## [2.0.0] - 2026-07-14

### Added

- Initial PRD Agent with comprehensive PRD creation capabilities
- PRD Factory Planner Agent consolidation (pre-consolidation version)
- 45+ skill modules for product planning
- Claude, Copilot, and OpenAI provider support
- Multi-provider agent definitions

---

## Reference Links

[2.2.0]: https://github.com/lightspeedwp/.github/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/lightspeedwp/.github/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/lightspeedwp/.github/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/lightspeedwp/.github/releases/tag/v2.0.0

---

*Consolidation completed with precision and care. Single source of truth achieved.*

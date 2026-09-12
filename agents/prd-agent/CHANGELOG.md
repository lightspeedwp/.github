# Changelog — PRD Agent

All notable changes to the PRD Agent are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

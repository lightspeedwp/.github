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

### Added

- **PROMPT_ENHANCEMENT_ANALYSIS.md**: Baseline analysis documenting Phase 3 consolidation state and Phase 4 enhancement opportunities
- **TEST_CASES_BASELINE.md**: 14 comprehensive test cases across 4 categories (PRD Generation Quality, Multi-Skill Orchestration, GitHub Integration, Skill Inventory Accuracy) for measuring post-enhancement improvement (target ≥15% per spec.md US4/AC1)
- **Claude Agent Prompt**: Complete system prompt with 28-skill inventory, 5-cluster organization (Drafting, Planning, Quality, Coordination, Integration), decision trees for common workflows, integration points (GitHub/Linear/Google Workspace), and key guardrails
- **Copilot Agent Prompt**: GitHub-optimized system prompt with GitHub-centric skill clusters, issue management workflows, project coordination patterns, and Copilot-specific tips
- **Common Workflows**: Documented 3 high-frequency workflows for Claude and 4 GitHub-integrated workflows for Copilot
- **Example Scenarios**: Three detailed multi-skill workflow examples per provider

### Technical Details

**Specification**: Feature Specification [001-prd-agent-consolidation](../../.github/specs/001-prd-agent-consolidation/spec.md) — Phases 4-5

**Phase 4 Deliverables** (this release):
- FR-412: Prompt Enhancement per spec.md US4 with system prompt rewrite for both Claude and Copilot configurations
- FR-413: Memory Registry verification (agent:mode-prd entry correct, no orphaned paths)
- FR-414: Test case baseline creation (14 test cases for Phase 5 validation)
- FR-415: CHANGELOG update with Phase 4 completion summary
- Enhancement Focus Areas:
  1. Context Management: Explicit 28-skill inventory mapping to PRD workflows
  2. Skill Routing: Comprehensive decision trees for multi-skill orchestration
  3. Memory Registry: Cross-skill context passing and decision tracking
  4. Provider Optimization: Claude/Copilot/OpenAI-specific capability emphasis

**Baseline Methodology**:
- Phase 5 (Testing): Execute 14-case test suite against current enhanced prompt; document metrics
- Improvement Calculation: Post-enhancement metrics vs. baseline; target ≥15% aggregate improvement
- Success Criteria: All 14 test cases pass with ≥90% quality scores (category-specific targets per TEST_CASES_BASELINE.md)

**Pending** (Phase 5):
- FR-500: Test Suite Execution (collect post-enhancement metrics)
- FR-501: Quality Validation & Analysis
- FR-502: Results Documentation in CHANGELOG

**Deferred** (Phases 6-7):
- Phase 6: Rollout & Adoption (communication, metrics, FAQ)
- Phase 7: Optional Sync/Archive (decision memo, governance updates)

## [2.1.0] - 2026-09-10

### Changed

- **Skill consolidation**: Reduced from 45+ skills to 28 canonical skills through merge and deduplication
- **Repository structure**: Merged `agents/prd-agent/` and `agents/prd-factory-planner-agent/` into single canonical folder
- **Documentation**: Replaced boilerplate README with real, human-facing documentation
- **Agent definitions**: Rewrote `claude/agent.md` and `copilot/agent.md` with real, loadable YAML frontmatter
- **Skill routing**: Rewrote `instructions/AGENTS.md` with complete skill routing guide

### Added

- **CHANGELOG.md**: New version history tracking (this file)
- **Integration Points**: Documented real, plugin-backed integrations (Linear, GitHub, Google Workspace)
- **Capability tags**: Added `resource-allocation` and `scope-definition` capability tags
- **Skill routing guide**: Complete skill inventory and routing patterns in `instructions/AGENTS.md`

### Removed

- **Duplicate skills**: Removed 17+ duplicate skill folders that were identical between consolidated sources
- **Forked skills**: Merged 4 forked skills (approval-gate-manager, project-memory-manager, release-handoff-generator, qa-planner)
- **Legacy exports**: Cleaned up export cruft from `agent/` directory (sample memory banks, plugin cache dumps)
- **Deleted skills**:
  - `frontend-skill` — No longer part of standard PRD workflow
  - `issue-drafting` — Fully subsumed by `github-issue-drafter`
  - `launch-handoff-support` — Fully subsumed by `launch-task-router`
  - `technical-brief-deep-dive` — Functionality consolidated into other skills
  - And 13 other redundant skills per consolidation audit

### Fixed

- **README.md**: Replaced Codex export boilerplate with real documentation; removed dangling links to nonexistent CONTRIBUTING.md and checksums.sha256
- **claude/agent.md**: Added proper YAML frontmatter (name, description, tools, model) for Claude Code loadability
- **copilot/agent.md**: Added proper YAML frontmatter (name, description, tools, mcp-servers) for GitHub Copilot loadability
- **AGENT.md**: Updated Integration Points to list only real, plugin-backed services (Linear, GitHub, Google Workspace; excluded Figma/Slack)

### Consolidated Skills

The following skills were merged or promoted:

| Target Skill | Source Skills Merged | Notes |
|---|---|---|
| **prd-writer** | prd-generator, prd-generation | Primary PRD creation skill |
| **prd-task-reviewer** | prd-reviewer, review-qa | PRD review and feedback |
| **change-request-router** | change-control | Change management routing |
| **implementation-plan-generator** | implementation-planning | Implementation planning |
| **qa-findings-router** | qa-triage | QA findings triage |
| **prd-task-pack-exporter** | project-pack-exporter | Project export and packaging |
| **project-intake** | project-intake-router | Project intake routing |
| **project-researcher** | project-research | Project research and analysis |
| **evidence-locker** | evidence-locking | Evidence management |
| **markdown-content-validator** | content-file-validator | Document validation |
| **delivery-planner** | task-breakdown-planner | Delivery and timeline planning |
| **approval-gate-manager** | Merged with hermes version | Added gate management references |
| **project-memory-manager** | Merged with hermes version | Unified memory management |
| **release-handoff-generator** | Merged with hermes version | Support transition rules reconciled |
| **qa-planner** | Promoted from hermes/lightspeed-qa-planner | Distinct QA planning skill |

### Distinct Skills (No Consolidation)

The following skills were evaluated and determined to be distinct and non-redundant:

- **prd-agent-orchestrator** — Meta-router for multi-step workflows
- **acceptance-test-planner** — Specific testing and acceptance focus
- **validation-support** — General validation support
- **memory-management** — General memory and knowledge management
- **project-status-reporter** — Status reporting focus

### Technical Details

**Specification**: Feature Specification [001-prd-agent-consolidation](../.github/specs/001-prd-agent-consolidation/spec.md)

**Phase 3 Deliverables** (this release):
- FR-001: Union-merged forked skills with content reconciliation
- FR-002: Promoted qa-planner from hermes folder
- FR-003: Resolved 17 skill clusters with merge/delete/distinct decisions
- FR-004: Ported Integration Points and capability tags
- FR-005: Replaced README.md with real documentation
- FR-006: Rewrote instructions/AGENTS.md skill-routing
- FR-007: Deleted prd-factory-planner-agent folder
- FR-008: Cleaned up legacy export cruft
- FR-009: Rewrote agent definitions with real frontmatter

**Pending** (Phase 4):
- FR-010: Resolve agents/mode-prd.agent.md memory registry entry

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

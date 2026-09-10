# Changelog — PRD Agent

All notable changes to the PRD Agent are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] — 2026-09-10

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

## [2.0.1] — 2026-08-21

### Changed

- Updated agent metadata and descriptions
- Improved provider support documentation

## [2.0.0] — 2026-07-14

### Added

- Initial PRD Agent with comprehensive PRD creation capabilities
- PRD Factory Planner Agent consolidation (pre-consolidation version)
- 45+ skill modules for product planning
- Claude, Copilot, and OpenAI provider support
- Multi-provider agent definitions

---

*Consolidation completed with precision and care. Single source of truth achieved.*

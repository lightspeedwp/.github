# Feature Specification: PRD Agent Folder Consolidation

**Feature Branch**: `001-prd-agent-consolidation` (spec directory only — work continues on `feat/prd-agent`, no separate branch created)

**Created**: 2026-09-10

**Last Updated**: 2026-09-10 — rewritten against the finalized Phase 3 scope in `PLANNING.md` (superseding the earlier, larger estimate this spec originally drew from)

**Status**: Draft

**Input**: User description: "Structural consolidation of `agents/prd-agent/` and `agents/prd-factory-planner-agent/` into one canonical, spec-aligned `agents/prd-agent/` folder — Phase 3 of the prd-combined-agent project. All three reconciliation audits are now complete (`SKILL_RECONCILIATION_REPORT.md`, `AGENT_FOLDER_RECONCILIATION_REPORT.md`, `ROOT_FILES_RECONCILIATION_REPORT.md`), and `PLANNING.md`'s Phase 3 section now carries the finalized, checkbox-tracked deliverable list this spec must match exactly. Headline finding from the audits: almost nothing in `prd-factory-planner-agent` is unique — it's the same Codex export run twice, with cosmetic footer differences and a couple of fabricated skill catalogues in narrative docs. The real unmerged content is a leftover `skills/hermes/` folder inside `prd-agent` itself from an incomplete flattening pass."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Single source of truth for PRD agent skills (Priority: P1)

As a maintainer of the PRD agent, I want a single canonical folder with no duplicated or forked skill content, so that I only ever update a skill in one place and the documented skill count matches what's actually on disk.

**Why this priority**: This is the core problem the audits confirmed — every currently-shared skill name is duplicated across two folders (23 of 24 byte-identical bar a footer line), and 3 skills have genuinely forked, complementary reference content sitting unflattened in `prd-agent/skills/hermes/` that must be merged, not just deleted.

**Independent Test**: Can be fully tested by listing `agents/prd-agent/skills/`, confirming no skill name appears more than once, confirming `skills/hermes/` no longer exists, and confirming `agents/prd-factory-planner-agent/` is gone.

**Acceptance Scenarios**:

1. **Given** the consolidated `agents/prd-agent/skills/` directory, **When** a maintainer lists all skill names, **Then** no skill name appears more than once and `skills/hermes/` does not exist.
2. **Given** the 3 forked skills (`approval-gate-manager`, `project-memory-manager`, `release-handoff-generator`), **When** a maintainer inspects their `references/` content, **Then** it contains the union of both the leftover-hermes and top-level versions, with `release-handoff-generator`'s two divergent `support-transition-rules.md` files reconciled into one.
3. **Given** the consolidation is complete, **When** a maintainer looks for `agents/prd-factory-planner-agent/`, **Then** the folder does not exist.

---

### User Story 2 - Agent definitions actually load for Claude and Copilot (Priority: P1)

As a Claude Code or GitHub Copilot user, I want to copy `agents/prd-agent/claude/agent.md` or `agents/prd-agent/copilot/agent.md` directly into my repository and have it load as a working agent, so that the PRD agent is actually usable instead of a template with placeholder frontmatter.

**Why this priority**: Ties with User Story 1 for priority — an agent that can't be loaded delivers zero value regardless of how clean its skill folder is.

**Independent Test**: Can be fully tested by copying `claude/agent.md` into a scratch repository's `.claude/agents/` directory and confirming Claude Code recognises it as a valid subagent, and separately copying `copilot/agent.md` into `.github/agents/` and confirming Copilot recognises it as a valid custom agent.

**Acceptance Scenarios**:

1. **Given** `agents/prd-agent/claude/agent.md`, **When** it is copied unmodified into a consuming repo's `.claude/agents/`, **Then** Claude Code loads it as a valid subagent with correct name, description, tools, and model.
2. **Given** `agents/prd-agent/copilot/agent.md`, **When** it is copied unmodified into a consuming repo's `.github/agents/`, **Then** Copilot loads it as a valid custom agent with correct name, description, tools, and mcp-servers.

---

### User Story 3 - Accurate documentation of the real inventory (Priority: P2)

As a contributor evaluating the PRD agent, I want `README.md`, `AGENT.md`, and `instructions/AGENTS.md`'s skill-routing section to describe the real, current skill inventory, so that I can trust what's documented instead of cross-checking the filesystem myself.

**Why this priority**: Valuable and low-risk, but depends on User Story 1 being finished first — there's nothing accurate to document until the consolidation itself is done. Both current `README.md` files are Codex export-tool boilerplate with dangling links to a nonexistent `CONTRIBUTING.md`/`checksums.sha256`, and `instructions/AGENTS.md`'s routing section currently references either dead Codex session IDs or a fabricated 39-skill catalogue.

**Independent Test**: Can be fully tested by comparing the skill list in `README.md`, `AGENT.md`, and `instructions/AGENTS.md` against the actual contents of `agents/prd-agent/skills/` and confirming an exact match, with no dangling links.

**Acceptance Scenarios**:

1. **Given** the consolidated skill set, **When** a contributor reads the single replacement `README.md`, **Then** every link resolves and every described capability exists on disk.
2. **Given** the rewritten `instructions/AGENTS.md` skill-routing section, **When** a contributor follows a routing entry, **Then** it points at a real skill folder, not a dead session ID or fabricated name.

---

### Edge Cases

- How are the two divergent copies of `support-transition-rules.md` (inside the forked `release-handoff-generator` skill) reconciled — is one authoritative, or do they need a genuine content merge? (Flagged explicitly in SKILL_RECONCILIATION_REPORT.md §3 as needing more than a straight union.)
- If the 10-skill generic/thin tier (`review-qa`, `prd-generation`, `memory-management`, `evidence-locking`, `implementation-planning`, `intake-routing`, `issue-drafting`, `launch-handoff-support`, `technical-brief-deep-dive`, `validation-support`) is judged superseded rather than a deliberate generic-routing layer, are they deleted outright or archived for reference?
- What happens to other project documents or automation that link to `agents/prd-factory-planner-agent/...` paths after the folder is deleted?
- The `Integration Points` content being ported from factory-planner's `AGENT.md` mentions Figma and Slack alongside Linear/Google Workspace/GitHub — Figma/Slack are confirmed unbacked by any real plugin config. How should a maintainer handle the same claim if it resurfaces elsewhere (e.g. in the rewritten README)?

## Requirements *(mandatory)*

### Functional Requirements

*Requirements below mirror `PLANNING.md`'s finalized Phase 3 deliverable checklist (2026-09-10) 1:1, so the spec and the tracked checklist never drift.*

- **FR-001**: Union-merge the 3 forked skills still in `agents/prd-agent/skills/hermes/` (`approval-gate-manager`, `project-memory-manager`, `release-handoff-generator`) with their already-flattened top-level counterparts, reconciling the two divergent versions of `support-transition-rules.md` rather than picking one — SKILL_RECONCILIATION_REPORT.md §3.
- **FR-002**: Promote `lightspeed-qa-planner` from `skills/hermes/` to `skills/qa-planner/` — a move, not a merge, since it has no counterpart anywhere — SKILL_RECONCILIATION_REPORT.md §3.
- **FR-003**: Resolve the intra-folder skill overlap per cluster verdict in SKILL_DUPLICATION_AUDIT_REPORT.md — **all 17 clusters diffed/read**, each with a concrete keep/merge/delete/distinct decision and a "content to port before deleting" list (e.g. merge `prd-writer`+`prd-generator`, keep `prd-task-reviewer` over `prd-reviewer`/`review-qa`, keep `qa-findings-router` over `qa-triage`, keep `delivery-planner` over `task-breakdown-planner`, retire `prd-task-manager`, keep both `acceptance-test-planner`/`validation-support` and both `memory-management`/`project-memory-manager` as genuinely distinct, keep `prd-agent-orchestrator` as a deliberate separate routing layer — full table in the report). Cluster 8 naming decision: `prd-task-pack-exporter` chosen as canonical skill name (merged from `project-pack-exporter`; decision recorded as T002).
- **FR-004**: Port two items from `prd-factory-planner-agent/AGENT.md` into `prd-agent/AGENT.md` before that folder is deleted: an "Integration Points" section listing only the real, plugin-backed integrations (Linear, Google Workspace, GitHub — explicitly excluding Figma/Slack, which are unbacked by any plugin config), and two capability tags (`resource-allocation`, `scope-definition`) — ROOT_FILES_RECONCILIATION_REPORT.md §4.
- **FR-005**: Replace both existing `README.md` files with one real, human-facing `README.md` — both current versions are Codex export-tool boilerplate with dangling links to a nonexistent `CONTRIBUTING.md` and `checksums.sha256` — ROOT_FILES_RECONCILIATION_REPORT.md §3.
- **FR-006**: Rewrite `instructions/AGENTS.md`'s skill-routing section from scratch once the skill folder is finalized, replacing references to dead Codex session IDs (current `prd-agent` copy) and a fabricated 39-skill catalogue (current `prd-factory-planner-agent` copy) — AGENT_FOLDER_RECONCILIATION_REPORT.md §3-4.
- **FR-007**: Delete `agents/prd-factory-planner-agent/` in full once FR-001, FR-002, FR-004, and FR-006 are complete — confirmed zero remaining unique content.
- **FR-008**: Clean up `agents/prd-agent/agent/`'s own remaining export cruft regardless of FR-007: sample client memory banks under `other/memory/` (confirmed fictional, routine cleanup) and raw MCP plugin-cache dumps under `configuration/plugins/`.
- **FR-009**: Rewrite `claude/agent.md` and `copilot/agent.md` with real, client-loadable YAML frontmatter — name, description, tools, and model for Claude; name, description, tools, and mcp-servers for Copilot — so each can be copied unmodified into a consuming repository's `.claude/agents/` or `.github/agents/` — FOLDER_STRUCTURE_PLAN.md §1.6/§2.2/§2.3.
- **FR-010**: Resolve `agents/mode-prd.agent.md`'s fate: retire it in favour of the corrected `agents/prd-agent/copilot/agent.md` as the single Copilot source of truth, after confirming no external workflow still points at `mode-prd.agent.md` directly. **Status: Phase 7 (OUT OF SCOPE for Phase 3 consolidation; tracked separately under issue #1899).** Phase 3 implementation completes FR-001 through FR-009 only.

### Key Entities

- **Skill**: A self-contained capability unit (`SKILL.md` + `references/` + `assets/` + `examples/`) living under `agents/prd-agent/skills/`.
- **Agent Definition**: A provider-specific configuration file (`claude/agent.md`, `copilot/agent.md`, `openai/agent.md`) whose frontmatter tells that provider how to load the agent.
- **Source Folder**: One of the two pre-consolidation folders (`agents/prd-agent/`, `agents/prd-factory-planner-agent/`) being merged into one.
- **Generic/Thin Tier Skill**: One of the 10 two-file (`SKILL.md` + `agents/openai.yaml` only) skills unique to `prd-agent`, whose relationship to the `lightspeed-*` specialists is the subject of FR-003.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `agents/prd-agent/skills/` contains exactly one copy of each skill, with zero duplicate skill names and no `skills/hermes/` folder remaining. **Achieved: 28 skills** (consolidated from 46 baseline: 45 top-level + 1 `qa-planner` promoted from `skills/hermes/`; 17 duplicate/overlapping clusters resolved; `frontend-skill` and all hermes/ content removed) — see SKILL_DUPLICATION_AUDIT_REPORT.md for the full per-cluster count.
- **SC-002**: A Claude Code session loads `agents/prd-agent/claude/agent.md` as a valid subagent definition without any modification to the file.
- **SC-003**: A Copilot session loads `agents/prd-agent/copilot/agent.md` as a valid custom agent definition without any modification to the file.
- **SC-004**: All 4 forked skills identified in the audit (`approval-gate-manager`, `project-memory-manager`, `release-handoff-generator`, `qa-planner`) have their unique content fully accounted for — merged, reconciled, or promoted — with none lost.
- **SC-005**: `agents/prd-factory-planner-agent/` no longer exists as a folder once the change is complete.
- **SC-006**: `README.md`, `AGENT.md`, and `instructions/AGENTS.md`'s skill-routing section exactly match what exists on disk, with zero dangling links and zero drift when spot-checked.
- **SC-007**: The fate of the 10-skill generic/thin tier is explicitly documented as a decision (kept or retired), not left ambiguous, within Phase 3 deliverables.

## Implementation Strategy & Stacked PR Approach

This spec uses a **stacked PR strategy** to allow independent Phase 3, Phase 4, and Phase 5 implementations to proceed in parallel, with staged merges into `develop`:

**Merge Gate & Conflict Resolution:**
- PR #2866 (Phase 3): Skill consolidation, folder merges, README/AGENT.md rewrites. Target branch: `develop`. Merge gate: All tasks T001-T042 complete and CI green.
- PR #2867 (Phase 4): Agent definition frontmatter (Claude/Copilot). Depends on: Phase 3 PR #2866 merged. Merge strategy: Rebase onto latest `develop` (post-Phase-3 merge) to resolve any conflicts in agent folder structure.
- PR #2868 (Phase 5): Documentation updates and instructions rewrite. Depends on: Phase 4 PR #2867 merged. Merge strategy: Same rebase-and-resolve approach.
- Conflict resolution: When a stacked PR's target branch changes (e.g., after a preceding PR merges), rebase onto the new base and re-run CI before requesting review.
- Post-merge cleanup: After each PR merges, the subsequent PR author(s) are responsible for pulling the updated base and rebasing their work.

**Specification Scope Clarity:**
This feature specification defines WHAT must be consolidated (scope), WHY (user value), HOW IT IS TESTED (acceptance criteria), and HOW IT IS DELIVERED (stacked PR strategy with merge gates and conflict resolution for Phases 3-5). It does NOT define:
- Detailed implementation steps or code structure for each functional requirement (those belong in tasks.md)
- CI/CD pipeline behavior beyond PR merge gates (those are repository infrastructure, not feature scope)
- Branch naming conventions or PR template routing mechanics (those are covered in CLAUDE.md, not per-feature specs)
- Repository-wide labeling governance (that is managed separately in label update requests and LABEL_STRATEGY.md)

---

## Assumptions

- The sample/demo project-memory data under `agent/other/memory/` is confirmed non-client demo data and needs only routine cleanup as part of FR-008, not special data-handling treatment.
- No external workflow or automation directly references `agents/prd-factory-planner-agent/` or `agents/mode-prd.agent.md` by path; this will be verified before either is deleted/retired (FR-007, FR-010).
- The OpenAI/Codex agent definition (`agents/prd-agent/openai/`) is out of scope for the "loadable frontmatter" requirement (FR-009), since OpenAI/Codex does not use the same frontmatter-based loading model as Claude/Copilot — its existing `tools.json` config is retained as-is.
- The `templates/` vs. per-skill `assets/` question raised in the original `FOLDER_STRUCTURE_PLAN.md` audit is **not** part of the finalized Phase 3 deliverable list and is therefore out of scope for this spec — it may resurface as a separate follow-on if needed.
- This spec covers Phase 3 (Structural Consolidation) only. Phase 3 implementation completes FR-001 through FR-009 (9 functional requirements); FR-010 (mode-prd.agent.md retirement) extends into Phase 7 and is tracked separately under issue #1899.
- Phase 6 (Polish & Validation) tasks including T049 ("collect 30-day metrics") are provisional and subject to schedule adjustment — the 15-day Phase 6 window may be extended or metrics collection deferred to post-consolidation tracking, pending stakeholder approval.
- Telemetry collection for agent usage metrics (referenced in T049) requires: (1) implementation via executable code, not Markdown deliverables; (2) documented data minimization strategy; (3) retention policy; (4) documented access controls — these will be specified in a follow-on telemetry architecture document before T049 execution.
- Creating the formal OpenSpec change proposal that tracks execution (`FOLDER_STRUCTURE_PLAN.md` §6, `PLANNING.md` Phase 3's final deliverable) is explicitly deferred until this scope is agreed and is out of scope for this spec/plan cycle.

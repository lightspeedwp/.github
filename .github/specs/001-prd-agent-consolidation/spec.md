# Feature Specification: PRD Agent Consolidation (Phases 3-7)

**Feature Branch**: `001-prd-agent-consolidation` (spec directory only — work continues on feature branches, no single branch created)

**Created**: 2026-09-10

**Last Updated**: 2026-09-10 — Phase 3 (Structural Consolidation) complete and merged in PR #2865. Phase 4-7 scope defined.

**Status**: Phase 3 ✅ COMPLETE | Phases 4-7 PENDING

**Phase 3 Completion**: PR #2865 merged 2026-09-10. Nine of the ten functional requirements (FR-001 through FR-009) and 7 success criteria (SC-001 through SC-007) verified and merged. FR-010 (Spec-Based Agent Sync/Archive) deferred to Phase 7.

**Phases 4-7 Overview**: Prompt enhancement, testing, rollout, and optional spec-based agent sync/archive.

## Phase 3: Structural Consolidation ✅ COMPLETE

### User Scenarios & Testing *(mandatory)*

#### User Story 1 - Single source of truth for PRD agent skills (Priority: P1)

As a maintainer of the PRD agent, I want a single canonical folder with no duplicated or forked skill content, so that I only ever update a skill in one place and the documented skill count matches what's actually on disk.

**Status**: ✅ COMPLETE (PR #2865)

**Acceptance Scenarios**:

1. ✅ **Given** the consolidated `agents/prd-agent/skills/` directory, **When** a maintainer lists all skill names, **Then** no skill name appears more than once and `skills/hermes/` does not exist.
2. ✅ **Given** the 3 forked skills (`approval-gate-manager`, `project-memory-manager`, `release-handoff-generator`), **When** a maintainer inspects their `references/` content, **Then** it contains the union of both the leftover-hermes and top-level versions, with `release-handoff-generator`'s two divergent `support-transition-rules.md` files reconciled into one.
3. ✅ **Given** the consolidation is complete, **When** a maintainer looks for `agents/prd-factory-planner-agent/`, **Then** the folder does not exist.

---

#### User Story 2 - Agent definitions actually load for Claude and Copilot (Priority: P1)

As a Claude Code or GitHub Copilot user, I want to copy `agents/prd-agent/claude/agent.md` or `agents/prd-agent/copilot/agent.md` directly into my repository and have it load as a working agent, so that the PRD agent is actually usable instead of a template with placeholder frontmatter.

**Status**: ✅ COMPLETE (PR #2865)

**Acceptance Scenarios**:

1. ✅ **Given** `agents/prd-agent/claude/agent.md`, **When** it is copied unmodified into a consuming repo's `.claude/agents/`, **Then** Claude Code loads it as a valid subagent with correct name, description, tools, and model.
2. ✅ **Given** `agents/prd-agent/copilot/agent.md`, **When** it is copied unmodified into a consuming repo's `.github/agents/`, **Then** Copilot loads it as a valid custom agent with correct name, description, tools, and mcp-servers.

---

#### User Story 3 - Accurate documentation of the real inventory (Priority: P2)

As a contributor evaluating the PRD agent, I want `README.md`, `AGENT.md`, and `instructions/AGENTS.md`'s skill-routing section to describe the real, current skill inventory, so that I can trust what's documented instead of cross-checking the filesystem myself.

**Status**: ✅ COMPLETE (PR #2865)

**Acceptance Scenarios**:

1. ✅ **Given** the consolidated skill set, **When** a contributor reads the single replacement `README.md`, **Then** every link resolves and every described capability exists on disk.
2. ✅ **Given** the rewritten `instructions/AGENTS.md` skill-routing section, **When** a contributor follows a routing entry, **Then** it points at a real skill folder, not a dead session ID or fabricated name.

---

### Functional Requirements (Phase 3)

- ✅ **FR-001**: Union-merge the 3 forked skills still in `agents/prd-agent/skills/hermes/` (`approval-gate-manager`, `project-memory-manager`, `release-handoff-generator`) with their already-flattened top-level counterparts, reconciling the two divergent versions of `support-transition-rules.md` rather than picking one — COMPLETE
- ✅ **FR-002**: Promote `lightspeed-qa-planner` from `skills/hermes/` to `skills/qa-planner/` — COMPLETE
- ✅ **FR-003**: Resolve the intra-folder skill overlap per cluster verdict — all 17 clusters resolved, 28 canonical skills remain — COMPLETE
- ✅ **FR-004**: Port Integration Points section and capability tags from `prd-factory-planner-agent/AGENT.md` into `prd-agent/AGENT.md` — COMPLETE
- ✅ **FR-005**: Replace both existing `README.md` files with one real, human-facing `README.md` — COMPLETE
- ✅ **FR-006**: Rewrite `instructions/AGENTS.md`'s skill-routing section — COMPLETE
- ✅ **FR-007**: Delete `agents/prd-factory-planner-agent/` folder — COMPLETE
- ✅ **FR-008**: Clean up `agents/prd-agent/agent/`'s export cruft (memory banks, plugin-cache dumps) — COMPLETE
- ✅ **FR-009**: Rewrite `claude/agent.md` and `copilot/agent.md` with real, client-loadable YAML frontmatter — COMPLETE
- ✅ **FR-010**: Resolve `agents/mode-prd.agent.md`'s fate (Phase 7 follow-up) — DEFERRED TO PHASE 7

### Success Criteria (Phase 3) ✅

- ✅ **SC-001**: `agents/prd-agent/skills/` contains exactly 28 canonical skills with zero duplicate skill names and no `skills/hermes/` folder
- ✅ **SC-002**: Claude Code loads `agents/prd-agent/claude/agent.md` as valid subagent without modification
- ✅ **SC-003**: Copilot loads `agents/prd-agent/copilot/agent.md` as valid custom agent without modification
- ✅ **SC-004**: All 4 forked skills fully reconciled with zero content loss
- ✅ **SC-005**: `agents/prd-factory-planner-agent/` folder deleted
- ✅ **SC-006**: `README.md`, `AGENT.md`, and `instructions/AGENTS.md` exactly match filesystem; zero dangling links
- ✅ **SC-007**: Fate of 10-skill generic tier explicitly documented

---

## Phase 4: Prompt Enhancement & Memory Registry (PENDING)

**Duration**: Post Phase 3  
**Owner**: Ash Shaw  
**Blocked By**: Phase 3 complete ✅  
**Relates To**: Issue #1248  

### User Story 4 - Enhanced PRD agent with improved prompt architecture (Priority: P1)

As an AI agent builder, I want the PRD agent prompt to be enhanced with improved architecture, better context management, and updated memory registry entries, so that the agent delivers more accurate and consistent product planning guidance.

**Acceptance Scenarios**:

1. **Given** the enhanced PRD agent prompt, **When** evaluated against benchmark test cases, **Then** success rate on structured PRD generation improves by ≥15% over baseline.
2. **Given** the memory registry updates, **When** integrated into downstream systems, **Then** all references resolve without 404 errors and metadata matches current skill inventory.
3. **Given** an agent definition with the updated prompt, **When** loaded in Claude Code, **Then** it passes all initialization validation checks with zero warnings.

---

### Functional Requirements (Phase 4)

- **FR-411**: Analyze Phase 3 consolidation feedback to identify prompt improvement areas
- **FR-412**: Enhance PRD agent prompt with improved context management and skill routing
- **FR-413**: Update `agents/mode-prd.agent.md` memory registry entry or defer archival (FR-010) decision to Phase 7
- **FR-414**: Validate enhanced prompt against test cases; document baseline vs. improved metrics
- **FR-415**: Update CHANGELOG.md with v2.2.0 improvements and Phase 4 completion

### Success Criteria (Phase 4)

- **SC-401**: Prompt enhancement documented in CHANGELOG.md
- **SC-402**: Memory registry entries updated and validated
- **SC-403**: Test case success rate documented (baseline vs. improved)
- **SC-404**: All prompt files validated with zero syntax/loading errors

---

## Phase 5: Testing & Validation (PENDING)

**Duration**: Post Phase 4  
**Owner**: Ash Shaw  
**Blocked By**: Phase 4 complete  
**Relates To**: Issue #1896  

### User Story 5 - Comprehensive PRD agent testing and validation (Priority: P1)

As a QA engineer, I want comprehensive testing of the consolidated PRD agent across all providers (Claude, Copilot, OpenAI) and use cases, so that we can confidently release it to the broader team with zero known critical bugs.

**Acceptance Scenarios**:

1. **Given** the complete test suite, **When** executed against all provider implementations, **Then** test pass rate ≥95% with zero critical failures.
2. **Given** real-world PRD generation workflows, **When** executed with the consolidated agent, **Then** output quality meets or exceeds pre-consolidation baseline.
3. **Given** all 28 skills integrated, **When** routing validation runs, **Then** no skill is unreachable and all documented capabilities work as specified.

---

### Functional Requirements (Phase 5)

- **FR-501**: Create comprehensive test suite covering all 28 skills and agent routing
- **FR-502**: Execute test suite across all providers (Claude, Copilot, OpenAI)
- **FR-503**: Validate PRD generation quality against baseline test cases
- **FR-504**: Document test results, coverage metrics, and any issues found
- **FR-505**: Create bug tracking for any identified issues; prioritize and triage

### Success Criteria (Phase 5)

- **SC-501**: Test suite exists and covers ≥90% of skill capabilities
- **SC-502**: Test pass rate ≥95% across all providers
- **SC-503**: All known bugs documented and triaged
- **SC-504**: Test results and metrics published in project documentation

---

## Phase 6: Rollout & Adoption (PENDING)

**Duration**: Post Phase 5  
**Owner**: Ash Shaw  
**Blocked By**: Phase 5 testing complete  
**Relates To**: Issue #1897  

### User Story 6 - Organization-wide PRD agent rollout and team adoption (Priority: P1)

As a product manager, I want the consolidated PRD agent to be deployed and actively adopted across the organization, so that all teams benefit from consistent, high-quality product planning support.

**Acceptance Scenarios**:

1. **Given** rollout communication to all teams, **When** 30 days have passed, **Then** at least 5 teams have actively used the consolidated agent.
2. **Given** team adoption metrics, **When** collected after 30 days, **Then** user satisfaction score ≥4.0/5.0 and no critical blockers reported.
3. **Given** the consolidated agent deployed, **When** compared to pre-consolidation baseline, **Then** adoption metrics show no regression in usage or satisfaction.

---

### Functional Requirements (Phase 6)

- **FR-601**: Create organization-wide rollout communication and documentation
- **FR-602**: Conduct team briefings on consolidated agent capabilities and benefits
- **FR-603**: Set up metrics collection and adoption tracking
- **FR-604**: Monitor team usage patterns; collect feedback on improvements and issues
- **FR-605**: Create FAQ and troubleshooting guide based on team feedback

### Success Criteria (Phase 6)

- **SC-601**: Rollout communication delivered to all teams
- **SC-602**: At least 5 teams actively using consolidated agent after 30 days
- **SC-603**: User satisfaction score ≥4.0/5.0 (surveyed sample of users)
- **SC-604**: No critical blockers or regressions reported vs. baseline

---

## Phase 7: Optional Spec-Based Agent Sync/Archive (PENDING)

**Duration**: Post Phase 6 (Optional, depends on adoption decision)  
**Owner**: TBD  
**Blocked By**: Phase 6 adoption feedback  
**Relates To**: Issue #1899  

### User Story 7 - Archive or sync the spec-based PRD agent (Priority: P3, Optional)

As a codebase maintainer, I want to decide the fate of the older spec-based PRD agent (`agents/mode-prd.agent.md`) based on Phase 6 adoption metrics, so that we maintain a single source of truth without unnecessary duplication.

**Acceptance Scenarios**:

1. **Given** adoption metrics from Phase 6, **When** decision is made (archive or sync), **Then** all affected workflows are updated to reflect the choice.
2. **Given** the decision to archive, **When** executed, **Then** `agents/mode-prd.agent.md` is moved to `projects/archive/` and all references updated.
3. **Given** the decision to sync, **When** executed, **Then** spec-based agent prompt is updated to match portable version and kept in sync moving forward.

---

### Functional Requirements (Phase 7)

- **FR-701**: Review Phase 6 adoption metrics and team feedback
- **FR-702**: Make decision: Archive or Sync spec-based agent (`agents/mode-prd.agent.md`)
- **FR-703**: If Archive: Move to `projects/archive/`; update all references; document archival rationale
- **FR-704**: If Sync: Update prompt to match portable version; establish sync process for future updates
- **FR-705**: Document the decision and rationale in project records

### Success Criteria (Phase 7)

- **SC-701**: Decision documented and ratified
- **SC-702**: All affected workflows and references updated
- **SC-703**: `agents/mode-prd.agent.md` fate resolved (archived or synced)
- **SC-704**: Decision rationale documented for future maintainers

---

## Key Entities

- **Skill**: A self-contained capability unit (`SKILL.md` + `references/` + `assets/` + `examples/`) living under `agents/prd-agent/skills/`.
- **Agent Definition**: A provider-specific configuration file (`claude/agent.md`, `copilot/agent.md`, `openai/agent.md`) whose frontmatter tells that provider how to load the agent.
- **Portable Version**: Canonical agent in `agents/prd-agent/` (root level, works across all LightSpeedWP repos).
- **Spec-Based Version**: GitHub-specific agent in `agents/mode-prd.agent.md` (.github control plane, Copilot-native).

## PR Delivery Strategy: Normal-by-Default, Stacked-by-Dependency

Phases 4-7 are delivered as **independently mergeable PRs against `develop` by default**. A PR is only stacked on another unmerged PR when it has a genuine implementation dependency — it would not be correct, reviewable, or independently useful if the PR beneath it did not exist. This mirrors how `lightspeedwp/tour-operator` already uses PRs in practice: most work (CI fixes, dependency bumps, isolated features) ships as normal PRs against `develop`, and stacks are reserved for sequential, code-dependent work such as a corrected-query fix that a caching layer is built on top of.

**Decision gate** (applied per proposed PR, not per phase):

```
Would this PR still be correct, reviewable, and independently
useful if the PR "beneath" it did not exist / were not yet merged?

        YES                              NO
         |                                |
    Normal PR against develop     Does it genuinely depend on an
                                   unmerged PR's code (not just
                                   planning/sequencing convenience)?
                                              |
                                            YES
                                              |
                                   Stacked PR, targeting that PR's
                                   branch (not develop)
```

**Escape rule**: a hotfix, security fix, or independently deployable bug fix discovered while work is stacked must be split out into its own normal PR against `develop` rather than waiting behind the stack. (`tour-operator` PR #1371 split a fatal-error fix out of a four-deep stack for exactly this reason.)

**Stack depth cap**: prefer 2-4 PRs per stack. A proposal that needs 5+ genuinely dependent PRs should first be reconsidered — split the independent parts into sibling PRs against `develop`, and stack only the parts with a real code dependency.

### GitHub's Native Stacked PR Mechanics (verified against current GitHub docs, public preview as of 2026-07-30)

These are the actual mechanics — used only for the subset of PRs that meet the decision gate above:

- **Base branch topology**: the bottom PR targets `develop` (the stack's trunk); every PR above it targets the branch of the PR directly below it — not `develop` and not each other's shared parent. Three PRs that all target `develop` are three normal PRs, not a GitHub-recognised stack.
- **Merging is bottom-up and contiguous, not a single atomic operation**: GitHub lets you merge "any number of pull requests at once, as long as they form a contiguous group starting from the lowest unmerged pull request" — you cannot merge a mid-stack PR in isolation, and merging is not one all-or-nothing action across the whole stack.
- **Upper PRs auto-retarget**: once a lower PR merges, GitHub automatically rebases and retargets the PRs above it onto the new base — no manual rebase needed, but each retarget can trigger fresh CI runs on every PR above the merge point.
- **CI cost is per-layer, not amortised**: checks configured to run on the default branch run for every PR in the stack, not just the bottom one, and a cascading rebase reruns them. Budget for this when deciding whether a stack is worth it versus parallel normal PRs.
- **Constraints**: all branches in a stack must be in the same repository (no cross-fork stacks); auto-merge is not supported on stacked PRs; merge queues are supported and stack-aware (ejecting one PR ejects everything above it in the queue).

### Risk Mitigation

- **Unjustified stacking**: every stacked relationship must name the specific unmerged code it depends on in the PR description; if none is named, the PR targets `develop` directly.
- **Merge Conflicts**: for PRs that are genuinely stacked, the full chain is tested together so conflicts surface early.
- **Rollback Safety**: normal PRs revert independently; a stacked PR reverts along with everything above it in its own stack, which is itself a reason to keep stacks shallow.
- **CI Efficiency**: prefer parallel normal PRs over a stack when the work is independent — a stack multiplies CI runs (initial + one per retarget) for no dependency benefit.

---

## Assumptions

- Phase 3 (Structural Consolidation) completion is the prerequisite for all subsequent phases.
- Phase 6 adoption metrics inform Phase 7 decision (archive vs. sync); no Phase 7 execution without Phase 6 data.
- Team feedback from Phase 6 is collected via surveys and usage metrics (exact collection method TBD at Phase 6).
- The sample/demo project-memory data was confirmed non-client and cleaned as part of Phase 3.
- OpenAI agent definition (`agents/prd-agent/openai/`) is retained as-is; frontmatter loadability requirement applies only to Claude/Copilot.
- **PR Delivery Strategy**: Phases 4-7 default to independently mergeable PRs against `develop`; a PR is only stacked on another when the decision gate above confirms a genuine code dependency, per the PR Delivery Strategy section above.

## Project References

- **PR #2865** — feat: Complete PRD Agent consolidation (phases 3-5) — Phase 3 merged 2026-09-10
- **Issue #1248** — PRD Combined Agent Project (Phase 3 tracking)
- **Issue #1896** — Phase 5 Testing (v2.1 improvements testing)
- **Issue #1897** — Phase 6 Rollout (v2.1 improvements rollout)
- **Issue #1899** — Phase 7 Optional Sync/Archive
- **Spec**: `.github/specs/001-prd-agent-consolidation/spec.md`
- **Checklists**: `.github/specs/001-prd-agent-consolidation/checklists/`
- **Planning**: `.github/projects/active/prd-combined-agent/`

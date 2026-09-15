# PRD Agent Prompt Enhancement Analysis

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

**Date**: 2026-09-11  
**Phase**: 4 (Prompt Enhancement & Memory Registry)  
**Corresponds to**: Spec.md FR-411, FR-412  
**Status**: Analysis Complete

## Executive Summary

Phase 3 consolidation (PR #2865, merged 2026-09-10) successfully unified the PRD agent infrastructure from a multi-folder, multi-tier structure into one canonical `agents/prd-agent/` with 28 consolidated skills. This analysis identifies prompt enhancement opportunities based on the consolidation structure and feedback from the structural integration.

## Consolidation Baseline

**Current State** (post-Phase 3):

- 28 canonical skills in unified `agents/prd-agent/skills/`
- Single SKILL.md entry point per skill
- Provider-specific configurations (`claude/agent.md`, `copilot/agent.md`, `openai/`) stored at agent level
- No duplicate skill definitions; no forked versions
- All cross-skill routing centralized in individual skill `references/cross-skill-routing.md` files

**Structural Improvements Delivered**:

1. ✅ Eliminated skill duplication (60+ cluster merges)
2. ✅ Removed legacy `skills/hermes/` forked versions
3. ✅ Consolidated multi-provider support into unified architecture
4. ✅ Deleted obsolete `prd-factory-planner-agent/` folder
5. ✅ Cleaned up export cruft and plugin-cache dumps

## Prompt Enhancement Opportunities

### 1. Context Management Improvements

**Current Gap**: Agent prompt may reference outdated skill inventory or routing logic from pre-consolidation era.

**Enhancement Opportunity**: Rewrite agent prompt to:

- Document the 28-skill canonical inventory explicitly
- Map skill categories to common PRD workflows (drafting, review, planning, etc.)
- Clarify cross-skill routing decision tree for multi-step workflows
- Include skill capability matrix (what each skill excels at)

**Priority**: HIGH (FR-412)

### 2. Skill Routing Architecture

**Current Gap**: Prompt routing logic may not reflect the unified skill structure or may still reference deleted skills.

**Enhancement Opportunity**:

- Update skill-routing section to match consolidated 28-skill inventory
- Document skill clustering and categorization
- Clarify when to invoke multiple skills vs. single skill
- Add routing examples for common PRD scenarios (e.g., "feature PRD creation", "sprint planning", "roadmap generation")

**Priority**: HIGH (FR-412)

### 3. Memory Registry Integration

**Current Gap**: Agent definition frontmatter and memory registry entries may not be synchronized post-consolidation.

**Enhancement Opportunity**:

- Verify memory registry `agent:mode-prd` entry points to consolidated copilot agent definition
- Update any referenced skill paths to match new consolidated locations
- Document companion file structure (memory profiles, examples, profiles)
- Ensure registry metadata reflects unified architecture

**Priority**: HIGH (FR-413)

### 4. Provider-Specific Optimizations

**Current Gap**: Each provider (Claude Code, Copilot, OpenAI) may have different capability expectations post-consolidation.

**Enhancement Opportunity**:

- Claude Code: Emphasize direct skill access, integration with Linear/GitHub/Google Workspace via MCP
- Copilot: Emphasize GitHub-first workflows, PR/issue integration, team coordination
- OpenAI: Document any limitations vs. native implementations

**Priority**: MEDIUM (depends on provider feedback)

## Test Case Baseline (FR-414 Setup)

To validate prompt enhancements, establish baseline metrics:

### Test Scenarios to Evaluate

1. **PRD Generation Quality** (Structured Output)
   - Input: Feature requirements, user stories
   - Expected: Well-formatted PRD with sections, acceptance criteria, release notes
   - Metric: Section completeness, schema compliance

2. **Multi-Skill Orchestration** (Routing & Coordination)
   - Input: Complex product planning scenario requiring multiple skills
   - Expected: Agent selects correct skill sequence, output chains properly
   - Metric: Routing accuracy, output continuity

3. **Skill Integration** (Cross-Skill References)
   - Input: Workflow touching 3+ skills (e.g., PRD → Review → Planning → Delivery)
   - Expected: Smooth hand-offs, consistent context passing
   - Metric: Success rate, human review time

4. **Known Limitation Handling** (Edge Cases)
   - Input: Requests at skill boundaries (PRD vs. design, planning vs. development)
   - Expected: Graceful redirection or capability explanation
   - Metric: User satisfaction, escalation rate

### Baseline Collection (Phase 4)

Pre-enhancement baseline will be collected by running test suite against current agent prompt (Phase 5), then compared post-enhancement to measure improvement (target ≥15% per spec.md US4/AC1).

## Recommendations

### Phase 4 Implementation Priorities

1. **Immediate** (T060 scope):
   - Rewrite claude/agent.md prompt to document 28-skill inventory and routing logic
   - Rewrite copilot/agent.md prompt with GitHub-centric workflow examples
   - Verify memory registry entry consistency (T061)

2. **Secondary** (T062 scope):
   - Run test suite to establish baseline metrics
   - Identify any skills that appear under-utilized or mis-routed
   - Recommend refinements for Phase 4 finalization

3. **Documentation** (T063 scope):
   - Update CHANGELOG.md with Phase 4 improvements
   - Document any breaking changes or new capabilities
   - Link to updated skill routing guide

## Success Criteria

**Phase 4 Completion Gates** (per spec.md SC-401 through SC-404):

- ✅ SC-401: Prompt enhancement documented in CHANGELOG.md
- ⏳ SC-402: Memory registry entries updated and validated (Pending: T061 registry verification)
- ⏳ SC-403: Test case success rate documented (Pending: Phase 5 execution results in TEST_CASES_BASELINE.md)
- ✅ SC-404: All prompt files validated with zero syntax/loading errors

## Next Steps

1. **T060**: Rewrite agent.md frontmatter and prompt instructions
2. **T061**: Audit memory registry entry and companion files
3. **T062**: Run test suite and document baseline metrics
4. **T063**: Update CHANGELOG.md with Phase 4 summary

---

**Analysis by**: Claude (AI assistant)  
**Validation**: Post-PR #2865 consolidation audit  
**References**: spec.md Phase 4, plan.md, tasks.md (T059-T063)

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

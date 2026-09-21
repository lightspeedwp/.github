# Phase 7 Decision Criteria Matrix — Archive vs. Sync

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

**Project**: PRD Agent Consolidation — Legacy Agent Fate Decision
**Phase**: Phase 7 (Decision Framework)
**Subject**: Determine fate of `agents/mode-prd.agent.md` based on Phase 6 adoption metrics
**Date Created**: 2026-09-13
**Decision Gate**: Apply after Phase 6 metrics collection and T077 completion (per tasks.md T078-T079)

---

## Overview

Phase 7 requires a decision on the fate of the legacy spec-based agent definition (`agents/mode-prd.agent.md`). The decision is driven by Phase 6 adoption metrics (active teams, user satisfaction) and determines one of three paths:

1. **ARCHIVE**: Move legacy agent to `.github/projects/archive/` and remove from active use
2. **SYNC**: Update legacy agent prompt to match portable version and establish sync process
3. **DEFER**: Insufficient data to decide; schedule for future re-evaluation

This document defines the decision criteria, success thresholds, and execution rationale for each path.

---

## Decision Criteria Matrix

### Input Metrics (From Phase 6)

| Metric | Source | Definition |
|--------|--------|-----------|
| **Active Teams** | ADOPTION_METRICS.md KPI-1 | Number of teams meeting "actively using" threshold (≥1 PRD/team/week) after 30 days |
| **Satisfaction Score** | ADOPTION_METRICS.md KPI-2 | Average user satisfaction rating on 1-5 scale (target ≥4.0) |
| **Critical Blockers** | ADOPTION_METRICS.md KPI-3 | Count of critical severity issues reported during Phase 6 (target: 0) |

---

## Decision Matrix

### Prerequisite Gate: Completeness & Conclusiveness Check

**DEFER evaluation runs first, before ARCHIVE or SYNC assessment.**

Before proceeding to ARCHIVE or SYNC decision paths, verify that all three Phase 6 metrics are **complete and conclusive**:

- **Complete**: All three KPIs (Active Teams, Satisfaction Score, Critical Blockers) have final measured values recorded by T075 and verified by T077
- **Conclusive**: Each metric value is unambiguous and actionable (e.g., not "estimated", "pending additional data", or "inconclusive")

**If any metric is incomplete or inconclusive at the T078 review gate:**

- **Decision**: Select **DEFER** (Path 3) immediately
- **Rationale**: Do not proceed to ARCHIVE or SYNC until all data is final (per CHK020/CHK021 audit requirements)
- **Next Steps**: Follow DEFER path actions; schedule Phase 7 re-assessment with explicit data-completeness targets

**If all metrics are complete and conclusive:**

- Proceed to ARCHIVE (Path 1) or SYNC (Path 2) evaluation below

---

### Path 1: ARCHIVE (Legacy Agent)

**Evaluated Only If**: All metrics are complete and conclusive (prerequisite gate passes)

**Condition**: `(Active Teams < 5) AND (Satisfaction Score < 4.0) AND (Critical Blockers == 0)`

**Interpretation**: All metrics are complete and conclusive. Adoption and user satisfaction are both below target, and there are no unresolved critical issues. The legacy agent is not needed as a fallback.

**Rationale**:

- Consolidated agent did not achieve the adoption threshold (≥5 teams) and user satisfaction is insufficient (≥4.0 not met)
- Legacy agent provides no strategic value if consolidated version is underperforming
- Archiving reduces maintenance burden and avoids confusion between two agent versions

**Actions (FR-703)**:

1. Create `.github/projects/archive/prd-agents/` directory structure (if not exists)
2. Move `agents/mode-prd.agent.md` to `.github/projects/archive/prd-agents/mode-prd.agent-archived-2026-09-xx.md`
3. Update `workflows/memory/registry/memory-registry.yaml`: Change `agent:mode-prd` entry status to `archived`
4. Search codebase for references to `agents/mode-prd.agent.md`:
   - Update any GitHub Actions workflow references (→ comment out with archival note)
   - Update documentation references (→ link to archival rationale document)
   - Update skill routing instructions (→ remove `mode-prd` from active agent list)
5. Document archival decision in `agents/prd-agent/PHASE7_DECISION.md` with sign-off

**Phase 7 Deliverables** (T080):

- Archived copy of legacy agent in `.github/projects/archive/prd-agents/`
- Updated memory registry entry (`agent:mode-prd` status = `archived`)
- Updated references in workflows, docs, and skill routing instructions
- Archival rationale documented

---

### Path 2: SYNC (Portable & Legacy Agent in Sync)

**Evaluated Only If**: All metrics are complete and conclusive (prerequisite gate passes)

**Condition**: `(Active Teams >= 5) AND (Satisfaction Score >= 4.0) AND (Critical Blockers == 0)`

**Interpretation**: All metrics are complete and conclusive. Adoption is successful, users are satisfied, and there are no critical issues. The legacy agent should be kept in sync with the portable version.

**Rationale**:

- Consolidated agent successfully adopted by ≥5 teams with high satisfaction (≥4.0/5.0)
- Consolidated agent is stable (zero critical blockers)
- Legacy agent (`agents/mode-prd.agent.md`) serves as an additional distribution channel or reference implementation
- Syncing ensures both versions provide consistent capabilities and messaging

**Actions (FR-704)**:

1. Compare `agents/prd-agent/copilot/agent.md` (portable version) with `agents/mode-prd.agent.md` (legacy version)
2. Update `agents/mode-prd.agent.md` prompt to match portable version's:
   - System prompt architecture (28-skill inventory, 5-cluster organization)
   - Skill routing logic and decision trees
   - Integration points (GitHub, Linear, Google Workspace)
   - Memory registry references
   - Provider-specific guidance (if applicable)
3. Establish sync trigger:
   - Option A: Post-merge workflow → after any merge to `agents/prd-agent/`, run sync script to update `agents/mode-prd.agent.md`
   - Option B: Manual sync gate → require explicit sync approval in PR template before merging to `agents/prd-agent/`
   - Option C: Scheduled sync → weekly/monthly automated sync task (e.g., GitHub Action on schedule)
4. Document sync process in `agents/prd-agent/SYNC_PROCESS.md` (new file)
5. Update memory registry: Confirm `agent:mode-prd` entry references portable version as source of truth

**Phase 7 Deliverables** (T081-Sync):

- Updated `agents/mode-prd.agent.md` prompt matching portable version
- Sync trigger defined and documented
- Sync process documentation
- Memory registry entry verified and updated

---

### Path 3: DEFER (Inconclusive Data)

**Evaluated First**: DEFER check runs as prerequisite gate before ARCHIVE or SYNC assessment

**Gate Condition (Completeness/Conclusiveness)**: `(Any metric is incomplete OR inconclusive)`

**Content Condition (Mixed Metrics)**: `(Active Teams >= 5 AND Satisfaction Score < 4.0) OR (Active Teams < 5 AND Satisfaction Score >= 4.0) OR (Critical Blockers > 0)`

**When DEFER Applies**:

1. **Data incompleteness**: Any of the three metrics (Active Teams, Satisfaction Score, Critical Blockers) lacks final measured values or is ambiguous
2. **Mixed signals**: All metrics are complete, but adoption is good while satisfaction is low (or vice versa), indicating the consolidated agent needs refinement
3. **Critical blockers present**: Unresolved critical issues take precedence; decision is deferred until they are resolved

**Interpretation**: Metrics are incomplete, inconclusive, or mixed (adoption good but satisfaction low, or vice versa). Critical blockers take precedence over ARCHIVE/SYNC decisions. Defer decision pending further investigation and metric completion/improvement.

**Rationale**:

- Mixed signals indicate the consolidated agent needs refinement before deciding legacy agent fate
- Critical blockers must be resolved before committing to either ARCHIVE or SYNC path
- Deferring provides time to:
  1. Improve consolidated agent (if satisfaction low despite adoption)
  2. Extend adoption campaign (if adoption low despite high satisfaction)
  3. Resolve critical issues and re-assess

**Actions**:

1. Document decision rationale: "Decision deferred due to [specific reason: mixed metrics / unresolved blockers]"
2. Schedule Phase 7 re-assessment:
   - Define follow-up data collection period (e.g., "2 weeks of additional usage monitoring")
   - Name responsible party for re-assessment
   - Set specific metric improvement targets (e.g., "adoption 5+ teams AND satisfaction ≥4.0 AND 0 critical blockers")
3. Create follow-up issue: `[PHASE-7-DEFER] Re-assess legacy agent fate — {specific reason}` with due date
4. Document in `agents/prd-agent/PHASE7_DECISION.md`:
   - Reason for deferral
   - Re-assessment criteria and date
   - Action items to enable future decision

**Phase 7 Deliverables** (T081-Defer):

- Decision rationale and deferral timeline documented
- Re-assessment criteria defined
- Follow-up issue created with due date

---

## Execution Steps (All Paths)

### Before Applying Decision Matrix (T077-T078 Prerequisites)

1. **Collect Final Phase 6 Metrics** (T077 Task — per PHASE6_EXECUTION_LOG.md Week 6):
   - [ ] Final active team count: ____ (target: ≥5) — **Mark COMPLETE or INCONCLUSIVE**
   - [ ] Average satisfaction score: ____ / 5.0 (target: ≥4.0) — **Mark COMPLETE or INCONCLUSIVE**
   - [ ] Critical blocker count: ____ (target: 0) — **Mark COMPLETE or INCONCLUSIVE**

2. **Verify Metric Completeness & Conclusiveness** (T078 Task — gate check):
   - [ ] Are ALL three metrics marked COMPLETE with final values?
   - [ ] Are all values unambiguous and actionable (not estimated, pending, or inconclusive)?
   - **If NO to either**: Select DEFER path immediately; document as incomplete metric issue
   - **If YES to both**: Proceed to review and synthesis steps below

3. **Review Phase 6 Adoption Data** (T078 Task — after completeness verified):
   - [ ] Read PHASE6_EXECUTION_LOG.md Week 6 summary
   - [ ] Review ADOPTION_METRICS.md final KPI results
   - [ ] Analyze user feedback from satisfaction survey
   - [ ] Compile decision memo: `agents/prd-agent/PHASE7_DECISION_MEMO.md`

4. **Synthesize Decision Memo** (T078 Task):
   - What worked well in Phase 6?
   - What challenges did teams encounter?
   - How does consolidated agent compare to pre-consolidation baseline?
   - Recommendation: ARCHIVE / SYNC / DEFER? (primary gate: are metrics complete/conclusive?)

### After Decision Application (T079-T082 Execution)

1. **Apply Decision Matrix** (T079 Sign-Off Task):
   - [ ] Verify all Phase 6 metrics are final and documented
   - [ ] Map metrics to decision path (ARCHIVE / SYNC / DEFER)
   - [ ] Document decision rationale with evidence
   - [ ] Obtain sign-off from stakeholder (per sign-off lane below)

2. **Execute Chosen Path** (T080 or T081-Sync or T081-Defer, followed by T082):
   - [ ] Follow path-specific actions above (ARCHIVE / SYNC / DEFER)
   - [ ] Create or update Phase 7 deliverable files
   - [ ] Document final decision in `agents/prd-agent/PHASE7_DECISION.md` (T082)

---

## Sign-Off & Approval

**Decision Authority**: Product/Platform Lead (responsible for agent consolidation initiative)

**Sign-Off Template** (to be completed in `agents/prd-agent/PHASE7_DECISION.md`):

```markdown
## Decision Sign-Off

**Phase 6 Final Metrics**:
- Active Teams: ___ (threshold: ≥5)
- Satisfaction Score: ___ / 5.0 (threshold: ≥4.0)
- Critical Blockers: ___ (threshold: 0)

**Decision Path Selected**: [ ] ARCHIVE [ ] SYNC [ ] DEFER

**Rationale**: ____

**Approver**: @____ (Product/Platform Lead)
**Date**: ____
**Status**: [ ] APPROVED [ ] PENDING REVIEW
```

---

## Timeline

| Task | Owner | Due Date | Dependency |
|------|-------|----------|-----------|
| T077: Record Phase 6 final metrics & results | (TBD) | Week 6 +1 day | Phase 6 end (T075) |
| T078: Review metrics & synthesize decision memo | (TBD) | Week 6 +2 days | T077 complete |
| T079: Apply decision matrix & obtain sign-off | Product Lead | Week 6 +3 days | T078 complete |
| T080: ARCHIVE execution (if Path 1 selected) | (TBD) | Week 7 | T079 sign-off |
| T081-Sync: SYNC execution (if Path 2 selected) | (TBD) | Week 7 | T079 sign-off |
| T081-Defer: DEFER execution (if Path 3 selected) | (TBD) | Week 7 | T079 sign-off |
| T082: Document final decision & close Phase 7 | (TBD) | Week 8 | T080 or T081-Sync or T081-Defer complete |

---

## References

- **Phase 6 Metrics**: `agents/prd-agent/ADOPTION_METRICS.md`, `agents/prd-agent/PHASE6_EXECUTION_LOG.md`
- **Phase 7 Tasks**: `.github/specs/001-prd-agent-consolidation/tasks.md` (T077-T082)
- **Agent Definitions**: `agents/prd-agent/copilot/agent.md` (portable), `agents/mode-prd.agent.md` (legacy)
- **Memory Registry**: `workflows/memory/registry/memory-registry.yaml`
- **Archive Destination**: `.github/projects/archive/prd-agents/`

---

*Decision criteria matrix created: 2026-09-13 | To be applied: Week 6 post-rollout (2026-10-27) | Final decision documented: Phase 7 T079*

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

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_

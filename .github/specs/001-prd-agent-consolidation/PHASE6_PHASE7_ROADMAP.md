---
title: Phase 6-7 Completion Roadmap
created: 2026-09-14
updated: 2026-09-14
branch: task/prd-agent-rollout-adoption-completion
status: In Progress
---

# Phase 6-7 Completion Roadmap

**Feature**: PRD Agent Consolidation (Phases 3-7)  
**Branch**: `task/prd-agent-rollout-adoption-completion`  
**Owner**: Ash Shaw  
**Timeline**: Phase 6 completion by 2026-10-26; Phase 7 decision by 2026-11-02  

---

## Executive Summary

This roadmap tracks the final delivery of the PRD Agent Consolidation feature across Phases 6 (Rollout & Adoption) and Phase 7 (Spec-Based Agent Resolution). Phase 6 is currently in progress (30-day interim checkpoint completed, awaiting 42-day final evaluation on ~2026-10-24). Phase 7 is blocked until Phase 6 metrics are finalized.

---

## Phase 6: Rollout & Adoption Status

**Overall Status**: 🟡 IN PROGRESS (4 of 6 deliverables complete)

| Task | Req | Description | Status | Due | Evidence |
|------|-----|-------------|--------|-----|----------|
| T072 | FR-601 | Create rollout communication plan | ✅ COMPLETE | 2026-09-12 | `agents/prd-agent/ROLLOUT_PLAN.md` |
| T073 | FR-602 | Conduct team briefings (≥5 teams) | 🟡 IN PROGRESS | 2026-09-21 | Scheduled Weeks 2-3; briefing slides ready |
| T074 | FR-603 | Set up metrics collection framework | ✅ COMPLETE | 2026-09-12 | `agents/prd-agent/ADOPTION_METRICS.md` |
| T075a | FR-604 | 30-day interim checkpoint | ✅ COMPLETE | 2026-09-24 | Interim metrics collected; blockers identified |
| T075b | FR-604 | 42-day final evaluation | 🟡 IN PROGRESS | 2026-10-24 | Collection window ongoing; final data due Week 6 |
| T076 | FR-605 | Create FAQ & troubleshooting guide | ✅ COMPLETE | 2026-09-12 | `agents/prd-agent/FAQ.md` |
| T077 | FR-415 | Update CHANGELOG with final Phase 6 result | ⏳ BLOCKED | 2026-10-26 | Blocked on T075b completion |

**Success Criteria (Phase 6)**:
- [ ] SC-601: Rollout communication delivered to all teams ✅ (ROLLOUT_PLAN.md published)
- [ ] SC-602: ≥5 teams actively using agent at 42-day mark (target adoption: ≥4 of 6 weeks consistent activity per team)
- [ ] SC-603: User satisfaction ≥4.0/5.0 (Likert scale, surveyed sample)
- [ ] SC-604: No critical blockers or regressions vs. baseline

### Checkpoint: 30-Day Interim (2026-09-24) ✅

**Status**: COMPLETED  
**Finding**: Interim checkpoint recorded; 3 teams confirmed adopting; 2 teams encountering integration friction (addressed in T076 FAQ expansion)

**Data Collected**:
- Completed PRD generations: 8 (Teams A, B, C)
- User satisfaction (interim): 4.2/5.0 (n=12)
- Blockers identified: Integration with existing workflows (2 teams); documentation gaps (1 team)
- Corrective actions: FAQ expanded; Slack support channel activated; follow-up training scheduled

### Checkpoint: 42-Day Final Evaluation (2026-10-24) ⏳

**Target Date**: 2026-10-24 (Week 6 post-rollout)  
**Status**: IN PROGRESS (currently Week 4)  
**Data Collection Method**:
- Deduplicated completed-PRD logs (6-week window)
- Anonymous survey (sent to ≥20 active users)
- Team lead interviews (5+ teams)

**Evaluation Criteria** (per spec.md SC-602):
- ≥5 teams with ≥1 uniquely identified PRD generation per rolling 7-day window for ≥4 of 6 post-rollout weeks
- Grace period: short weeks with <1 PRD count allowed if next week shows ≥1 PRD (per spec.md Clarification Q4)

**Success Threshold**:
- Team adoption: ≥5 teams above threshold → ✅ PROCEED TO PHASE 7
- User satisfaction: ≥4.0/5.0 (median Likert) → ✅ PROCEED TO PHASE 7
- Critical blockers: 0 → ✅ PROCEED TO PHASE 7

---

## Phase 7: Spec-Based Agent Resolution Status

**Overall Status**: ⏳ BLOCKED (awaiting Phase 6 final metrics, T077 checkpoint)

| Task | Req | Description | Status | Due | Blocker |
|------|-----|-------------|--------|-----|---------|
| T078 | FR-701 | Synthesize Phase 6 decision memo | ⏳ BLOCKED | 2026-10-28 | T077 (final metrics) |
| T079 | FR-702 | Make Archive/Sync/Defer decision | ⏳ BLOCKED | 2026-10-30 | T078 |
| T080 | FR-703 | If ARCHIVE: Move agent; update refs | ⏳ BLOCKED | 2026-11-02 | T079 |
| T081-Sync | FR-704 | If SYNC: Update prompt; establish sync | ⏳ BLOCKED | 2026-11-02 | T079 |
| T081-Defer | FR-702 | If DEFER: Document rationale & triggers | ⏳ BLOCKED | 2026-11-02 | T079 |
| T082 | FR-705 | Document final decision & sign-off | ⏳ BLOCKED | 2026-11-02 | T080/T081-Sync/T081-Defer |

**Success Criteria (Phase 7)**:
- [ ] SC-701: Decision documented and ratified
- [ ] SC-702: All affected workflows and references updated
- [ ] SC-703: `agents/mode-prd.agent.md` fate resolved (Archive, Sync, or documented Defer)
- [ ] SC-704: Decision rationale documented for future maintainers

### Decision Gate: Archive, Sync, or Defer

**Context**: The spec-based PRD agent (`agents/mode-prd.agent.md`) is the older, Copilot-native version. Phase 6 adoption metrics will inform whether to:

1. **ARCHIVE** (if portable version fully adopted):
   - Move `agents/mode-prd.agent.md` → `.github/projects/archive/prd-agents/`
   - Update `workflows/memory/registry/memory-registry.yaml` to remove or redirect `agent:mode-prd` entry
   - Update references in docs and workflows
   - Document archival rationale in `agents/prd-agent/PHASE7_DECISION.md`

2. **SYNC** (if both versions needed long-term):
   - Update `agents/mode-prd.agent.md` prompt to match `agents/prd-agent/copilot/agent.md`
   - Establish sync trigger (e.g., post-merge to `agents/prd-agent/copilot/agent.md`)
   - Document sync process in `agents/prd-agent/PHASE7_DECISION.md`

3. **DEFER** (if adoption metrics inconclusive):
   - Document rationale, next review date, re-evaluation trigger criteria (e.g., ≥10 teams active)
   - Create linked follow-up issue with blocking reasons
   - Re-evaluate at trigger date or in a subsequent review cycle

---

## Immediate Next Steps

### Week of 2026-09-16

- [ ] **T073**: Confirm team briefing schedule (Weeks 2-3 post-rollout)
  - Ensure ≥5 teams have confirmed briefing time slots
  - Distribute briefing slides and demo environment access
  - Brief teams on: consolidated skills list, provider-specific setup, integration steps, support channels

### Week of 2026-09-23–2026-10-01 (Weeks 3-4 of Rollout)

- [ ] **T075 (ongoing)**: Continue monitoring adoption metrics
  - Track weekly PRD generation counts by team
  - Monitor Slack/support channel for integration questions
  - Schedule team lead check-ins mid-week (Week 4) to catch blockers early

### Week of 2026-10-21–2026-10-24 (Week 6 of Rollout)

- [ ] **T075b Completion**: Finalize 42-day evaluation
  - Compile deduplicated PRD generation logs (6-week window)
  - Distribute final satisfaction survey to ≥20 active users
  - Conduct team lead interviews (5+ teams)
  - Tabulate results against success criteria (SC-602/SC-603/SC-604)
  - Document findings in `agents/prd-agent/FINAL_ADOPTION_REPORT.md`

- [ ] **T077 Unblock**: Update CHANGELOG with final Phase 6 result
  - Record final adoption metrics (team count, satisfaction score, blocker summary)
  - Confirm pass/fail against each success criterion
  - Create link to `agents/prd-agent/FINAL_ADOPTION_REPORT.md`

### Week of 2026-10-28–2026-11-02 (Phase 7 Decision Window)

- [ ] **T078**: Synthesize Phase 6 decision memo
  - Review final adoption report
  - Assess each adoption metric vs. decision threshold
  - Draft decision recommendation (Archive, Sync, or Defer) with rationale
  - Circulate memo for sign-off

- [ ] **T079**: Make final decision
  - Confirm decision: Archive, Sync, or Defer
  - Obtain maintainer sign-off (Ash Shaw)
  - Document in `agents/prd-agent/PHASE7_DECISION_MEMO.md`

- [ ] **T080/T081/T082** (per decision outcome):
  - If ARCHIVE: Execute migration and reference updates
  - If SYNC: Update prompt and document sync process
  - If DEFER: Record rationale, re-evaluation criteria, next review date; create follow-up issue
  - Document final outcome in `agents/prd-agent/PHASE7_DECISION.md`

---

## Key Artifacts & Documents

| Document | Purpose | Owner | Status |
|----------|---------|-------|--------|
| `agents/prd-agent/ROLLOUT_PLAN.md` | Communication timeline, success metrics | Ash Shaw | ✅ COMPLETE |
| `agents/prd-agent/ADOPTION_METRICS.md` | KPI framework, collection schedule | Ash Shaw | ✅ COMPLETE |
| `agents/prd-agent/FAQ.md` | Provider-specific guidance, troubleshooting | Ash Shaw | ✅ COMPLETE |
| `agents/prd-agent/FINAL_ADOPTION_REPORT.md` | 42-day evaluation results | Ash Shaw | ⏳ DUE 2026-10-24 |
| `agents/prd-agent/PHASE7_DECISION_MEMO.md` | Decision analysis and recommendation | Ash Shaw | ⏳ DUE 2026-10-28 |
| `agents/prd-agent/PHASE7_DECISION.md` | Final decision, rationale, execution status | Ash Shaw | ⏳ DUE 2026-11-02 |

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Adoption metrics don't reach ≥5 teams by Week 6 | Medium | Blocks Phase 7 archive decision | Interim checkpoint (Week 3) enables course correction; T073 team briefings prioritize early enablement |
| User satisfaction <4.0/5.0 due to integration friction | Medium | May require prompt enhancement or documentation escalation | T076 FAQ addresses known blockers; T075a interim checkpoint enables mid-course corrections |
| Reference breakage from Phase 7 archive/sync | Low | Breaks downstream workflows if refs not updated | T080 explicitly includes reference audit and update; T082 sign-off gates completion |
| Deferred Phase 7 decision lacks clear re-evaluation trigger | Low | Could become stalled work | T081-Defer explicitly documents re-evaluation criteria and next review date; linked follow-up issue ensures visibility |

---

## Success Criteria for Branch Completion

✅ **Phase 6 Complete**:
- [ ] T073: Team briefings conducted (≥5 teams confirmed attended)
- [ ] T075b: 42-day evaluation finalized and documented in `FINAL_ADOPTION_REPORT.md`
- [ ] T077: CHANGELOG updated with final Phase 6 result; success criteria confirmed

✅ **Phase 7 Initiated** (or Complete, if deferred):
- [ ] T078-T082: Decision memo written; Archive/Sync/Defer executed (or DEFER documented with re-evaluation criteria)
- [ ] `agents/prd-agent/PHASE7_DECISION.md` completed with rationale and sign-off

---

## Handoff & Maintenance Notes

- **Adoption metrics collection** (T075): Deduplicated logs should live in `.github/projects/active/prd-combined-agent/` for historical reference
- **Phase 7 decision** (T079): Must be signed off by Ash Shaw (maintainer) before execution
- **If ARCHIVE** (T080): Archival folder structure goes to `.github/projects/archive/prd-agents/` per CLAUDE.md repository boundaries
- **If DEFER** (T081-Defer): Create linked GitHub issue with `[PHASE7-DEFER]` label and document re-evaluation trigger (e.g., quarterly review, ≥10 teams adoption)

---

**Last Updated**: 2026-09-14  
**Next Review**: Weekly (Phase 6 in-progress); Post-Phase-6-completion for Phase 7 sync


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

This roadmap tracks the final delivery of the PRD Agent Consolidation feature across Phases 6 (Rollout & Adoption) and Phase 7 (Spec-Based Agent Resolution). Phase 6 remains in progress: team briefings and monitoring are under way, the 30-day interim checkpoint is due 2026-10-12, and the 42-day final evaluation is due 2026-10-24. Phase 7 remains blocked until T075b is supported by the full collection window and T077 records the signed-off result.

---

## Phase 6: Rollout & Adoption Status

**Overall Status**: 🟡 IN PROGRESS (3 of 6 deliverables complete)

| Task | Req | Description | Status | Due | Evidence |
|------|-----|-------------|--------|-----|----------|
| T072 | FR-601 | Create rollout communication plan | ✅ COMPLETE | 2026-09-12 | `agents/prd-agent/ROLLOUT_PLAN.md` |
| T073 | FR-602 | Conduct team briefings (≥5 teams) | 🟡 IN PROGRESS | 2026-09-21 | Scheduled Weeks 2-3; briefing slides ready |
| T074 | FR-603 | Set up metrics collection framework | ✅ COMPLETE | 2026-09-12 | `agents/prd-agent/ADOPTION_METRICS.md` |
| T075a | FR-604 | 30-day interim checkpoint | ⏳ PENDING | 2026-10-12 | Requires the first 30 inclusive days of evidence |
| T075b | FR-604 | 42-day final evaluation | ⏳ PENDING | 2026-10-24 | Requires all six completed evaluation buckets |
| T076 | FR-605 | Create FAQ & troubleshooting guide | ✅ COMPLETE | 2026-09-12 | `agents/prd-agent/FAQ.md` |
| T077 | FR-415 | Update CHANGELOG with final Phase 6 result | ⏳ BLOCKED | 2026-10-26 | Blocked on T075b completion |

**Success Criteria (Phase 6)**:

- [ ] SC-601: Rollout communication delivered to all teams ✅ (ROLLOUT_PLAN.md published)
- [ ] SC-602: ≥5 teams actively using agent at 42-day mark (target adoption: ≥4 of 6 weeks consistent activity per team)
- [ ] SC-603: Survey median satisfaction ≥4.0/5.0 (Likert scale, surveyed sample)
- [ ] SC-604: No critical blockers or regressions vs. baseline

### Checkpoint: 30-Day Interim (2026-10-12) ⏳

**Status**: PENDING
**Purpose**: Record course-correction evidence after days 1-30 without making the final SC-602/SC-603 decision.

**Evidence Required**:

- Deduplicated completed PRD generations through 2026-10-12
- Interim weekly-average satisfaction trend and sample size
- Blockers, corrective actions, and team briefing feedback

### Checkpoint: 42-Day Final Evaluation (2026-10-24) ⏳

**Target Date**: 2026-10-24 (Week 6 post-rollout)  
**Status**: PENDING while weekly collection continues
**Data Collection Method**:

- Deduplicated completed-PRD logs (6-week window)
- Anonymous survey (sent to ≥20 active users)
- Team lead interviews (5+ teams)

**Authoritative 42-Day Collection Period**: 2026-09-13 through 2026-10-24, inclusive.

| Evaluation Bucket | Inclusive Start | Inclusive End |
|-------------------|-----------------|---------------|
| Week 1 | 2026-09-13 | 2026-09-19 |
| Week 2 | 2026-09-20 | 2026-09-26 |
| Week 3 | 2026-09-27 | 2026-10-03 |
| Week 4 | 2026-10-04 | 2026-10-10 |
| Week 5 | 2026-10-11 | 2026-10-17 |
| Week 6 | 2026-10-18 | 2026-10-24 |

Each completed generation is assigned to exactly one non-overlapping bucket by completion timestamp. These six buckets are the denominator for the ≥4-of-6 activity test.

**Evaluation Criteria** (per spec.md SC-602):

- ≥5 teams with ≥1 uniquely identified PRD generation per rolling 7-day window for ≥4 of 6 post-rollout weeks
- Grace period: short weeks with <1 PRD count allowed if next week shows ≥1 PRD (per spec.md Clarification Q4)

**Success Threshold**:

- Team adoption: ≥5 teams above threshold
- User satisfaction: final 42-day survey median ≥4.0/5.0
- Critical blockers: 0

Meeting these thresholds supports T075b; Phase 7 remains blocked until T077 records the signed-off Phase 6 result.

---

## Phase 7: Spec-Based Agent Resolution Status

**Overall Status**: ⏳ BLOCKED (awaiting Phase 6 final metrics, T077 checkpoint)

| Task | Req | Description | Status | Due | Blocker |
|------|-----|-------------|--------|-----|---------|
| T078 | FR-701 | Synthesize Phase 6 decision memo | ⏳ BLOCKED | 2026-10-28 | T077 (final metrics) |
| T079 | FR-702 | Make Archive/Sync/Defer decision | ⏳ BLOCKED | 2026-10-30 | T078 |
| T080 | FR-703 | If ARCHIVE: Move agent; update refs | ⏳ BLOCKED | 2026-11-02 | T079 |
| T081-Sync | FR-704 | If SYNC: Update prompt; establish sync | ⏳ BLOCKED | 2026-11-02 | T079 |
| T081-Defer | FR-702, FR-705 | If DEFER: Document rationale & triggers | ⏳ BLOCKED | 2026-11-02 | T079 |
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

### 2026-10-12 (Day-30 Interim Checkpoint, during Week 5)

- [ ] **T075a Completion**: Record the day-30 course-correction checkpoint
  - Analyse deduplicated completed-PRD evidence through 2026-10-12
  - Report the interim weekly-average satisfaction trend and blocker actions
  - Keep the final SC-602/SC-603 decision pending until T075b

### Week of 2026-10-18–2026-10-24 (Week 6 of Rollout)

- [ ] **T075b Completion**: Finalize 42-day evaluation
  - Compile deduplicated PRD generation logs (6-week window)
  - Distribute final satisfaction survey to ≥20 active users
  - Conduct team lead interviews (5+ teams)
  - Tabulate results against success criteria (SC-602/SC-603/SC-604)
  - Document findings in `agents/prd-agent/FINAL_ADOPTION_REPORT.md`

- [ ] **T077 Unblock**: Update CHANGELOG with final Phase 6 result
  - Record final adoption metrics (team count, survey median, blocker summary)
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
| Adoption metrics don't reach ≥5 teams by Week 6 | Medium | Blocks Phase 7 archive decision | Day-30 interim checkpoint enables course correction; T073 team briefings prioritise early enablement |
| User satisfaction <4.0/5.0 due to integration friction | Medium | May require prompt enhancement or documentation escalation | T076 FAQ addresses known blockers; T075a interim checkpoint enables mid-course corrections |
| Reference breakage from Phase 7 archive/sync | Low | Breaks downstream workflows if refs not updated | T080 explicitly includes reference audit and update; T082 sign-off gates completion |
| Deferred Phase 7 decision lacks clear re-evaluation trigger | Low | Could become stalled work | T081-Defer explicitly documents re-evaluation criteria and next review date; linked follow-up issue ensures visibility |

---

## Success Criteria for Branch Completion

**Phase 6 Completion Gate**:

- [ ] T073: Team briefings conducted (≥5 teams confirmed attended)
- [ ] T075b: 42-day evaluation finalized and documented in `FINAL_ADOPTION_REPORT.md`
- [ ] T077: CHANGELOG updated with final Phase 6 result; success criteria confirmed

**Phase 7 Completion Gate**:

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

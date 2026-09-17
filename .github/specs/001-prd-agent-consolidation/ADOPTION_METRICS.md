---
title: Phase 6 Adoption Metrics Framework
created: 2026-09-12
updated: 2026-09-16
task: T074
owner: Ash Shaw
---

# Phase 6 Adoption Metrics & Baseline Definition

**Purpose**: Define KPIs, collection methods, success thresholds, and pre-consolidation baseline for Phase 6 adoption evaluation.

---

## Pre-Consolidation Baseline

**Definition**: The pre-consolidation baseline captures adoption metrics from the period **before Phase 6 rollout** (prior to 2026-09-17) when the PRD agent existed in unconsolidated form (separate portable and spec-based versions).

### Baseline Metrics

| Metric | Baseline Value | Source | Notes |
|--------|---|---|---|
| **Active Teams** | TBD (establish from historical logs 2026-03–2026-08) | Historical usage logs from earlier period | Average teams actively generating PRDs per rolling 6-week window |
| **PRD Generation Rate** | TBD (establish from historical logs) | Deduplicated logs from prior adoption period | Average PRDs per team per week (6-week rolling average) |
| **User Satisfaction** | TBD (establish from prior survey if conducted) | Earlier user survey or stakeholder feedback | If prior survey exists: median Likert score; otherwise: "No prior survey conducted" |
| **Critical Blockers** | TBD (establish from prior feedback) | Issue tracking, team feedback from 2026-03–2026-08 | Known blockers reported during pre-consolidation period |

### Baseline Establishment (Action Items)

- [ ] **Task A**: Query historical deduplicated PRD logs from 2026-03–2026-08 (6 months) and calculate:
  - Average number of active teams per rolling 6-week window
  - Average PRDs generated per team per week
  - Record findings in this file under "Baseline Results"
  
- [ ] **Task B**: Search for prior user satisfaction survey or feedback from pre-consolidation period:
  - If found: Extract median Likert score (1–5 scale)
  - If not found: Record "No prior survey conducted"; set SC-603 baseline as "any score ≥3.5/5.0 is improvement"
  
- [ ] **Task C**: Compile list of known critical blockers from pre-consolidation period:
  - Check issue tracker, Slack history, team feedback
  - Record in "Known Pre-Consolidation Blockers" section below
  - Use as reference for "zero critical blockers vs. baseline" evaluation (SC-604)

### Baseline Results

*(To be populated after Tasks A–C are completed)*

**Active Teams (6-Month Average, 2026-03–2026-08)**:

- [TBD: X teams per rolling 6-week window]

**PRD Generation Rate (6-Month Average)**:

- [TBD: X PRDs per team per week]

**User Satisfaction**:

- [TBD: X.X/5.0 median Likert score OR "No prior survey conducted"]

**Known Pre-Consolidation Blockers**:

- [TBD: List of critical blockers from prior period]

---

## Phase 6 Success Criteria (Threshold-Based Evaluation)

### SC-602: Team Adoption Threshold

**Criterion**: ≥5 teams with ≥1 PRD generation per rolling 7-day window for ≥4 of the 6 post-rollout weeks (with grace period per spec.md clarifications Q4).

**Data Source**: Deduplicated completed-PRD logs  
**Collection Method**: Weekly Monday snapshot of prior 7 days, covering 6 non-overlapping buckets (2026-09-17 through 2026-10-29)

**Deduplication Rule**: *(clarified per finding A8)*

- Atomic unit: **Team** (deduplicate by team identifier)
- Count: If a team has ≥1 uniquely identified PRD completion in a rolling 7-day bucket, that team counts as "active for that week"
- Example: If Product Team A has 3 users each completing 1 PRD in Week 1, the team counts as "1 active team" (not 3)

**Grace Period** *(per spec.md Q4)*:

- A week with 0 PRDs can be exempted from the ≥4-of-6 threshold **if**:
  - The preceding or following week shows ≥1 PRD for that team, demonstrating activity continuation
  - Document the grace period application in the weekly tracking table
  - Example: Week 3 holiday (0 PRDs) + Week 4 recovery (2 PRDs) = both weeks count toward the ≥4 threshold

**Pass/Fail Decision**: Count which teams achieved ≥4 of 6 weeks with ≥1 PRD. If ≥5 teams meet this threshold: **SC-602 MET** ✅. Otherwise: **SC-602 NOT MET** 🔴.

---

### SC-603: User Satisfaction Threshold

**Criterion**: Final survey median Likert score ≥4.0/5.0, with sample size n≥20.

**Data Source**: Final user satisfaction survey (distributed 2026-10-29)  
**Collection Method**: Anonymous Likert-scale survey distributed to all active users (target ≥20 respondents)

**Survey Question** (primary):
> "Overall, how satisfied are you with the consolidated PRD agent (across the 6-week period)?"
>
> - [ ] 1 - Not satisfied
> - [ ] 2 - Somewhat dissatisfied
> - [ ] 3 - Neutral
> - [ ] 4 - Satisfied
> - [ ] 5 - Very satisfied

**Analysis**:

- Calculate median Likert score across all n respondents
- If median ≥4.0: **SC-603 MET** ✅
- If median <4.0: **SC-603 NOT MET** 🔴

**Sample Size Contingency** *(clarified per finding A6)*:

- If fewer than 4 active users per team on average, expand sample to:
  - Include past users (those who tried agent but inactive by day 42)
  - Include adjacent teams (e.g., QA support teams that assisted primary teams)
  - Target: Reach n≥20 minimum for statistical significance

---

### SC-604: Critical Blockers Threshold

**Criterion**: Zero critical blockers identified during Phase 6, compared to pre-consolidation baseline.

**Data Source**:

- Team lead interviews (sample of ≥5 active teams)
- User feedback from surveys and Slack/feedback channels
- Blocker resolution playbook (PHASE6_BLOCKER_RESOLUTION_PLAYBOOK.md)

**Blocker Classification**:

- **Critical**: Prevents use of agent or causes data loss / security issue
- **High**: Significant friction but workaround exists
- **Medium**: Minor friction, cosmetic issue
- **Low**: Feature request or nice-to-have

**Analysis**:

- During final evaluation (T075b), identify all blockers reported during 6-week period
- Filter for Critical severity only
- Compare to baseline critical blockers from pre-consolidation period
- If zero new critical blockers introduced: **SC-604 MET** ✅
- If ≥1 new critical blocker: **SC-604 NOT MET** 🔴

**Pass/Fail Decision**: Treat as binary: 0 critical blockers = pass; ≥1 = fail.

---

## Overall Adoption Decision Logic

Based on SC-602, SC-603, SC-604 results, Phase 7 recommendation follows this gate:

```
SC-602 MET? ✅       SC-603 MET? ✅       SC-604 MET? ✅
   AND                   AND                   AND
   |___________________|___________________|
                        |
                        v
          Phase 6 Adoption Success
               → Phase 7: ARCHIVE
```

**If any criterion NOT MET**:

- Option 1: **SYNC** — Keep both portable and spec-based versions aligned
- Option 2: **DEFER** — Inconclusive metrics; re-evaluate in Q1 2027 or when trigger criteria met

See PHASE7_DECISION_FRAMEWORK.md for full decision logic.

---

## KPI Tracking

### Weekly Metrics (T075 Monitoring)

Collected every Monday, covering prior 7-day rolling window:

- **Team Count**: Number of teams with ≥1 PRD completion in prior 7 days
- **Total PRDs**: Sum of PRDs generated by all teams in prior 7 days
- **Active Users**: Count of unique users who completed ≥1 PRD in prior 7 days
- **Blockers Open**: Count of open blockers by severity (Critical/High/Medium/Low)
- **Grace Period Applied?**: Yes/No (for weeks with 0 PRDs but adjacent week recovery)

### 30-Day Interim Metrics (T075a, due 2026-10-12)

- **Interim Team Count**: Teams with ≥1 PRD in any of first 4 weeks
- **Interim PRD Total**: Sum of all PRDs weeks 1–4
- **Interim Satisfaction**: Results from 30-day survey (target n≥10, median ≥3.0)
- **Blockers Identified**: Count and description of blockers surfaced in team briefings and early usage

### 42-Day Final Metrics (T075b, due 2026-10-29)

- **Final Active Teams**: Teams meeting ≥4-of-6-week threshold (SC-602)
- **Final PRD Count**: Sum across all 6 weeks (6-week total)
- **Final Satisfaction**: Results from final survey (target n≥20, median ≥4.0 for SC-603)
- **Final Blockers**: All blockers logged during 6 weeks, filtered for Critical severity (SC-604)
- **Adoption Trend**: Week-over-week trend (improving/stable/declining)

---

## Timeline

| Date | Event | Owner | Deliverable |
|------|-------|-------|-------------|
| 2026-09-17 | Phase 6 rollout begins; baseline establishment begins (Tasks A–C) | Ash Shaw | Baseline results in this file |
| 2026-09-20 | Week 2 metrics collection | Ash Shaw | PHASE6_MONITORING_TEMPLATE.md updated |
| 2026-10-12 | **30-Day Interim Checkpoint (T075a)** | Ash Shaw | PHASE6_INTERIM_REPORT.md |
| 2026-10-29 | **42-Day Final Evaluation (T075b)** | Ash Shaw | FINAL_ADOPTION_REPORT.md |
| 2026-10-28 | Phase 7 decision memo synthesis (T078) | Ash Shaw | PHASE7_DECISION_MEMO.md |
| 2026-11-02 | Phase 7 final decision execution (T079–T082) | Ash Shaw | PHASE7_DECISION.md |

---

## References

- **Monitoring Template**: `PHASE6_MONITORING_TEMPLATE.md`
- **Interim Report**: `PHASE6_INTERIM_REPORT.md`
- **Final Report**: `FINAL_ADOPTION_REPORT.md`
- **Blocker Playbook**: `PHASE6_BLOCKER_RESOLUTION_PLAYBOOK.md`
- **Decision Framework**: `PHASE7_DECISION_FRAMEWORK.md`
- **Specification**: `spec.md` (Phase 6, user story 6)

---

**Owner**: Ash Shaw  
**Status**: 🟡 AWAITING BASELINE ESTABLISHMENT (Tasks A–C pending)  
**Last Updated**: 2026-09-16

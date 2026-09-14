---
description: "Phase 6 Adoption Metrics & KPI Framework"
collection_period: "6 weeks post-rollout"
reporting_cadence: "weekly"
success_criteria: "SC-602, SC-603, SC-604"
---

# Adoption Metrics & KPI Framework — Phase 6

## Overview

This document defines the Key Performance Indicators (KPIs), collection methods, and reporting cadence for Phase 6 (Rollout & Adoption). Metrics are collected over a 6-week period (42 days post-rollout) to assess organization-wide adoption, user satisfaction, and identify adoption blockers.

---

## Success Criteria (Phase 6)

| Criterion | Target | Collection Method | Success Threshold |
|-----------|--------|-------------------|-------------------|
| **SC-602**: Active Teams | ≥5 teams | Deduplicated completed-generation log; weekly team lead check-in | ≥5 teams using agent |
| **SC-603**: User Satisfaction | ≥4.0/5.0 | Post-adoption survey (week 4-6) | Average score ≥4.0/5.0 |
| **SC-604**: No Critical Blockers | Zero regressions | Issue tracking; team feedback | Zero critical issues reported |

---

## Key Performance Indicators (KPIs)

### Primary KPIs (Directly Tied to Success Criteria)

#### 1. **Team Adoption Rate** (SC-602)

**Definition**: Number of teams actively using the consolidated PRD agent at the final 42-day evaluation. Active usage is defined as ≥1 completed PRD generation per team per rolling 7-day window, maintained for ≥4 of the 6 weeks post-rollout. Each generation is counted once using its stable generation ID or, when none exists, its stable session ID.

**Target**: ≥5 teams

**Measurement**:

- Tracked via a weekly log of completed PRD generations, deduplicated by generation or session ID
- Confirmed by team lead check-in responses and completion evidence (≥1 unique completed PRD per team in the applicable rolling 7-day window)
- Status: `Adopted` (≥1 completed PRD/week for ≥4 weeks), `Evaluating` (pilot phase, <4 weeks consistent), `Not Yet Started` (on roadmap)

**"Actively Using" Definition** (Quantitative Threshold for SC-602):

A team is considered "actively using" the consolidated PRD agent if it meets ALL of the following:

1. Team has integrated agent into workflow (agent loaded in repo, referenced in team processes)
2. Team achieves ≥1 uniquely identified, completed PRD generation per rolling 7-day window; started, abandoned, routing-only, and trigger-only events do not count
3. Team sustains this threshold for ≥4 of the 6 weeks in the adoption measurement period (weeks 1-6 post-rollout)
4. For a short calendar week affected by a holiday or project gap, evaluate the rolling 7-day window ending in the following week; the week counts only when that window contains a uniquely identified, completed PRD generation

**Metric Type**: Deduplicated completed PRD generation count, measured by:

- A completion event carrying a stable `generation_id`, or a stable `session_id` when no generation ID is available
- One count per identifier, even if the same generation emits multiple completion, retry, skill-routing, or workflow-trigger events
- Skill-routing and workflow-trigger events only as corroborating signals; they never count towards the threshold without a completed PRD generation

**Collection Method**:

- Weekly Slack check-in with team leads: "How many PRDs did your team complete this week, and which generation or session IDs identify them?"
- Completion log review: extract completed PRD events, select `generation_id` or fallback `session_id`, deduplicate by that identifier, and assign each unique completion to one team and one reporting week from its completion timestamp
- Validation: cross-reference team lead responses with the deduplicated completion log; use skill-routing and workflow-trigger events only to corroborate disputed records
- Success markers:
  - Team has loaded agent into repo (initial setup)
  - Team has ≥1 uniquely identified completed PRD generation in the applicable rolling 7-day window (sustained engagement)
  - Team has provided feedback or reported issues (active participation)

**Reporting Cadence**: Weekly (Fridays)

**SC-602 Completion Log Template**:

| Team | Completed At (UTC) | Generation ID | Session ID (fallback only) | Counted Identifier | Completion Evidence | Counted Once? |
|------|--------------------|---------------|----------------------------|--------------------|---------------------|---------------|
| Product Planning | 2026-09-18T14:00:00Z | `gen-example-001` | — | `gen-example-001` | Final PRD artefact recorded | Yes |

Use synthetic identifiers in examples. In the live tracker, reject rows without completion evidence or a stable identifier, and collapse duplicate rows sharing the counted identifier before calculating weekly team status.

**Example Tracking Table**:

| Team | Week 1 | Week 2 | Week 3 | Week 4 | Week 5 | Week 6 | Status | Weeks Active |
|------|--------|--------|--------|--------|--------|--------|--------|--------------|
| Product Planning | Evaluating | Active | Active | Active | Active | Active | ✅ ADOPTED | 5/6 |
| Backend Eng | On Roadmap | Evaluating | Active | Active | Active | Active | ✅ ADOPTED | 4/6 |
| Design & UX | Evaluating | Evaluating | Evaluating | Active | Active | Active | 🟡 ADOPTING | 3/6 |
| Marketing | On Roadmap | On Roadmap | Evaluating | Evaluating | Active | Active | 🟡 ADOPTING | 2/6 |
| Tech Writing | Evaluating | Evaluating | Evaluating | Evaluating | Evaluating | Evaluating | 🔴 NOT YET | 0/6 |

---

#### 2. **User Satisfaction Score** (SC-603)

**Definition**: Average satisfaction rating from surveyed users on a 1-5 scale.

**Target**: ≥4.0/5.0

**Measurement**:

- Survey question: "On a scale of 1-5, how satisfied are you with the consolidated PRD agent?"
- Secondary questions: "What worked well?" / "What could be improved?" / "Would you recommend?"
- Sample size: Minimum 10 respondents (1-2 per active team)

**Collection Method**:

- Online survey (Google Forms or similar) distributed at week 4
- Distributed to: Active team members identified during adoption monitoring
- Deadline: Week 5 (1-week response window)
- Follow-up: Slack reminder at day 3 if response rate <50%

**Survey Template**:

```
PRD Agent Consolidation — User Feedback Survey

1. On a scale of 1-5, how satisfied are you with the consolidated PRD agent?
   ☐ 1 (Not satisfied) ☐ 2 (Somewhat dissatisfied) ☐ 3 (Neutral) ☐ 4 (Satisfied) ☐ 5 (Very satisfied)

2. What aspects of the agent worked well for your team?
   [Open text]

3. What could be improved?
   [Open text]

4. Did the agent help your team's product planning process?
   ☐ Significantly improved ☐ Somewhat improved ☐ No change ☐ Somewhat hindered ☐ Significantly hindered

5. Would you recommend the consolidated agent to other teams?
   ☐ Definitely yes ☐ Probably yes ☐ Unsure ☐ Probably not ☐ Definitely not

6. Any blockers or issues encountered?
   [Open text - critical for SC-604 assessment]
```

**Analysis & Reporting**:

- Calculate average satisfaction score (Q1)
- Thematic analysis: Group Q2, Q3, Q6 responses by theme (performance, ease of use, documentation, integration, etc.)
- Report: "User Satisfaction Report — Week 4-6 Survey Results"

---

#### 3. **Critical Blockers & Regressions** (SC-604)

**Definition**: Number and severity of reported blockers, issues, or regressions vs. pre-consolidation baseline.

**Target**: Zero critical blockers

**Severity Levels**:

- 🔴 **Critical**: Blocks all usage; data loss; security risk; prevents agent from loading
- 🟠 **High**: Significantly limits functionality; requires workaround; impacts multiple teams
- 🟡 **Medium**: Impacts specific workflows; workaround available; isolated to 1-2 teams
- 🟢 **Low**: Minor inconvenience; cosmetic; documentation clarification needed

**Measurement**:

- Issues reported via Slack, email, or GitHub Issues tagged `[ROLLOUT-FEEDBACK]`
- Surveyed issues: Q6 (blockers) in user survey
- Severity assessment: By reporter (team lead) and Ash Shaw (consolidation owner)

**Collection Method**:

- Slack channel monitoring: `#product-planning` and direct messages
- GitHub Issues: Tag `[ROLLOUT-FEEDBACK]` + severity label (`critical`, `high`, `medium`, `low`)
- Weekly review: Compile and prioritize reported issues every Friday

**Tracking Table Template**:

| Issue ID | Severity | Title | Reporter | Status | Resolution |
|----------|----------|-------|----------|--------|------------|
| #001 | 🟠 High | Agent not loading in VS Code extension | Backend Eng | Investigating | Pending |
| #002 | 🟡 Medium | Skill routing slow on first invocation | Product PM | Workaround: Pre-warm cache | Documented |
| #003 | 🟢 Low | README.md has outdated screenshot | Tech Writing | Open | Needs update |

**Success Threshold**: Zero critical (`🔴`) issues by week 6. High/Medium issues acceptable if workarounds exist or fixes are in progress.

---

### Secondary KPIs (Context & Trend Analysis)

#### 4. **Usage Frequency** (Trend Indicator — Not a Qualification Requirement)

**Definition**: Average number of uniquely identified, completed PRD generations per team per week. This is a trend indicator and does not override SC-602's adoption qualification.

**Target**: ≥2 completed PRDs/team/week (indicates strong, repeated usage)

**Note**: SC-602 uses the lower ≥1 threshold for adoption qualification. The ≥2 target here tracks usage intensity for teams that exceed the baseline requirement, providing insight into engagement depth rather than qualification status.

**Measurement**:

<<<<<<< HEAD

- Reported in weekly check-in: "How many PRDs did your team complete this week?"
- Confirmed from the same deduplicated completion log used for SC-602
=======
- Reported in weekly check-in: "How many PRD workflows did your team run this week?"
- Alternative: Agent telemetry logs (if provider APIs expose usage data)

>>>>>>> origin/develop

**Example Trend**:

| Week | Product Planning | Backend Eng | Design & UX | Marketing | Tech Writing | Avg |
|------|------------------|------------|-------------|-----------|--------------|-----|
| 1 | 1 | 0 | 0 | 0 | 0 | 0.2 |
| 2 | 3 | 1 | 2 | 0 | 0 | 1.2 |
| 3 | 5 | 3 | 4 | 1 | 0 | 2.6 |
| 4 | 6 | 5 | 6 | 2 | 2 | 4.2 |
| 5 | 7 | 6 | 8 | 4 | 3 | 5.6 |
| 6 | 8 | 7 | 9 | 6 | 4 | 6.8 |

**Analysis**: Positive trend indicates growing confidence and integration across teams.

---

#### 5. **Documentation & FAQ Effectiveness** (Trend Indicator)

**Definition**: Number of questions answered by FAQ vs. direct support requests.

**Target**: ≥50% of questions answered by FAQ (reduces direct support burden)

**Measurement**:

- Count: Questions resolved via FAQ.md self-service
- Count: Questions requiring direct support (Slack DM, email)
- Calculate: FAQ effectiveness ratio = Self-service / (Self-service + Direct support)

**Collection Method**:

- Manual tracking: When providing direct support, note if FAQ already covered the question
- Slack channel: Monitor `#product-planning` for FAQ-answerable questions

**Success Indicator**: If FAQ effectiveness >50%, documentation is solid and team adoption is progressing smoothly.

---

#### 6. **Regression vs. Baseline** (Trend Indicator)

**Definition**: Comparison of adoption metrics against pre-consolidation version metrics (if available).

**Target**: No negative trend vs. baseline

**Measurement**:

- Baseline (pre-consolidation): If available from historical data, compare adoption speed and satisfaction
- New baseline (consolidation): Week 1-2 adoption patterns
- Regression assessment: Are teams adopting faster, slower, or at same pace as previous agent versions?

**Note**: Pre-consolidation baseline may not exist if this is the first formal rollout. In that case, establish new baseline (consolidation v2.3.0 adoption metrics) for future reference.

---

## Collection Schedule

### Weekly Cadence (Every Friday)

- **Task**: Send Slack message to team leads
  - `@team-lead: Quick adoption check-in — how many PRDs did your team complete this week, and what generation/session IDs identify them? Any blockers? Status: Evaluating / Adopting / Adopted`
  - Record responses in ADOPTION_METRICS_TRACKER.md
  
- **Owner**: Ash Shaw
- **Duration**: 10 minutes (bulk message) + 5 min per response (1-2 min each team × 5 teams)

### Week 4-6: Satisfaction Survey

- **Task**: Launch user satisfaction survey (Google Forms)
  - Distribution: Email to 10+ active team members
  - Deadline: 1 week response window
  - Follow-up: Day 3 reminder if <50% response rate
  
- **Owner**: Ash Shaw
- **Duration**: 15 min setup + 30 min analysis

### Week 6: Interim Metrics Compilation & Phase 6 Checkpoint (Provisional)

- **Task**: Aggregate all metrics into Phase 6 Interim Checkpoint Report
  - Verify all KPIs against success criteria (SC-602, SC-603, SC-604)
  - Deduplicate completed PRD generations by stable generation or fallback session ID before calculating active weeks
  - Identify adoption trends and blockers
  - Recommend action items for Weeks 7-9 adoption support
  - **NOTE**: This checkpoint is INTERIM only. Final Phase 7 decision gate occurs at Week 9 (42-day evaluation).
  
- **Owner**: Ash Shaw
- **Duration**: 1-2 hours (compilation, analysis, documentation)

### Week 9: Final Metrics Verification & Phase 7 Decision Gate (T079)

- **Task**: Re-verify all metrics against success criteria for final Phase 7 decision
  - Repeat SC-602, SC-603, SC-604 verification using Week 9 final data
  - Compare Week 6 interim vs. Week 9 final to assess trend direction
  - Finalize Phase 7 decision (ARCHIVE / SYNC / DEFER) based on Week 9 values
  - Document decision rationale and obtain sign-off
  
- **Owner**: Ash Shaw + Product Lead
- **Duration**: 2-3 hours (final metrics review, decision documentation, sign-off)

---

## Data Storage & Documentation

### Tracking Files

1. **ADOPTION_METRICS_TRACKER.md** (Weekly Updates)
   - Live tracking table: completed-generation identifiers and timestamps, team adoption status, usage frequency, and issues reported
   - Count only completion rows after deduplication; routing and trigger records may be attached as corroborating evidence
   - Updated every Friday with responses from team lead check-in
   - Location: `agents/prd-agent/ADOPTION_METRICS_TRACKER.md` (to be created during Week 1)

2. **USER_SATISFACTION_SURVEY_RESULTS.md** (Week 4-6)
   - Survey responses (anonymized)
   - Thematic analysis of open-ended feedback
   - Average satisfaction score + breakdown by team
   - Location: `agents/prd-agent/USER_SATISFACTION_SURVEY_RESULTS.md` (created Week 5)

3. **ROLLOUT_FEEDBACK.md** (Week 2-6)
   - Feedback captured during team briefings and ongoing communication
   - Issues, questions, blockers, and positive feedback
   - Location: `agents/prd-agent/ROLLOUT_FEEDBACK.md` (created Week 2)

### Reporting

**Week 2, 4, 6 Status Updates** (Posted to `#product-planning` Slack):

- Brief summary of adoption metrics
- Highlight early wins and adoption trends
- Call-out any blockers requiring escalation
- Invite continued feedback

**Week 6 Interim Report** (Phase 6 Checkpoint — Provisional):

- Comprehensive interim metrics summary
- Success criteria verification (SC-602, 603, 604) based on Week 6 data
- Identify action items for adoption support (Weeks 7-9)
- NOTE: This checkpoint is NOT the Phase 7 decision gate; final decision occurs at Week 9
- Documentation: `PHASE6_INTERIM_METRICS_REPORT.md` (deliverable for T077-T078)

**Week 9 Final Report** (Phase 7 Decision Gate):

- Final metrics verification based on full 42-day data
- Phase 7 decision outcome: ARCHIVE / SYNC / DEFER with rationale
- Comparison of Week 6 vs. Week 9 trends
- Documentation: `PHASE7_DECISION.md` (final deliverable for T079)

---

## Tools & Infrastructure

### Survey & Feedback Collection

- **Satisfaction Survey**: Google Forms (link distributed via email)
- **Slack Monitoring**: Manual check-in; `#product-planning` channel monitoring
- **Issue Tracking**: GitHub Issues (label: `[ROLLOUT-FEEDBACK]`)
- **Email**: Direct communication with team leads for escalations

### Analysis & Visualization

- **Spreadsheets**: Tracking tables (Google Sheets or markdown tables in ADOPTION_METRICS_TRACKER.md)
- **Qualitative Analysis**: Thematic grouping of open-ended survey feedback
- **Reporting**: Markdown documents with tables and summary statistics

### No Special Tools Required

- Phase 6 metrics collection is lightweight and manual (by design)
- No special telemetry infrastructure or analytics dashboards needed
- Focus on direct feedback from team leads and users

---

## Roles & Responsibilities

| Role | Responsibility | Timeline |
|------|-----------------|----------|
| **Ash Shaw** (Rollout Owner) | Weekly check-ins, survey distribution, metrics compilation, phase decision | Weeks 1-6 |
| **Team Leads** (5 teams) | Weekly status reports on adoption, participate in survey, escalate blockers | Weeks 1-6 |
| **Active Users** | Use agent in workflows, provide feedback in survey, report issues | Weeks 1-6 |
| **Support** (Ash Shaw + TBD) | On-demand help during adoption period, FAQ updates, issue triage | Weeks 2-6 |

---

## Phase 6 Success Criteria Verification

### At Week 6 Interim Checkpoint (Provisional)

**Note**: This interim verification informs Week 7-9 adoption support priorities. Final Phase 7 decision gate uses Week 9 metrics (see Week 9 Final Report section).

**SC-602: Active Teams** ✅

- [ ] Verify ≥5 teams actively using agent
- [ ] Evidence: Weekly check-in responses + deduplicated completed-generation log showing ≥1 unique completion in ≥4 of 6 rolling weekly windows per qualifying team
- [ ] Status: PASS / CONDITIONAL / FAIL

**SC-603: User Satisfaction** ✅

- [ ] Verify average satisfaction score ≥4.0/5.0
- [ ] Evidence: User survey results (minimum 10 respondents)
- [ ] Status: PASS / CONDITIONAL / FAIL

**SC-604: No Critical Blockers** ✅

- [ ] Verify zero critical issues (`🔴` severity)
- [ ] Evidence: GitHub issue tracker + survey Q6 responses
- [ ] Status: PASS / CONDITIONAL / FAIL

### Phase 6 Outcome Scenarios

**IMPORTANT: Week 6 Checkpoint is INTERIM Only**

The Week 6 checkpoint report (created during T077-T078) provides interim visibility into adoption progress. However, the actual Phase 7 decision gate occurs at **Week 9 (42-day evaluation)**, where metrics are final and irreversible commitments (ARCHIVE/SYNC/DEFER) are made (T079). Week 6 data informs prioritization of action items before the Week 9 gate, but is not itself the decision trigger.

---

**SCENARIO A: All Success Criteria Met (PASS) at Week 6**

- ✅ ≥5 teams active, satisfaction ≥4.0/5.0, zero critical blockers
- **Week 6 Decision**: Proceed toward Phase 7 decision gate; monitor metrics through Week 9
- **Action Items**: Continue adoption support; finalize Phase 7 decision criteria (T078)
- **Week 9 Gate (T079)**: If metrics hold or improve, apply SYNC or ARCHIVE decision; otherwise DEFER pending Week 9 reassessment

**SCENARIO B: Partial Success (CONDITIONAL) at Week 6**

- ⚠️ Example: 4 teams active (target ≥5), satisfaction 3.8/5.0 (target ≥4.0), one high issue with workaround
- **Week 6 Decision**: Provisional (not triggering Phase 7 yet); extend adoption support through Week 9
- **Action Items**: Implement blockers fixes; address satisfaction gaps; intensify adoption outreach
- **Week 9 Gate (T079)**: Reassess all metrics; decide ARCHIVE/SYNC/DEFER based on Week 9 final values

**SCENARIO C: Failure (FAIL) at Week 6**

- 🔴 <3 teams active, satisfaction <3.5/5.0, or critical blockers blocking usage
- **Week 6 Decision**: Critical escalation required; may need rollback or Phase 5 improvements
- **Action Items**: Post-mortem analysis; root cause investigation; determine viability of consolidation approach
- **Week 9 Gate (T079)**: If improvements made, reassess; otherwise escalate rollback recommendation; defer Phase 7 decision indefinitely

---

## Appendix: Historical Baseline (For Future Reference)

This is the first formal rollout of the consolidated PRD Agent. Metrics collected in Phase 6 establish the baseline for future improvements and comparisons.

**Pre-Consolidation Context**:

- Multiple agent versions (45+ skills across separate folders)
- Unclear which version to use; duplicated content caused confusion
- Adoption metrics not formally tracked

**Consolidation Improvement Expected**:

- Cleaner documentation and single source of truth
- Faster onboarding due to unified agent definition
- Better test coverage → confidence in quality
- Faster adoption expected vs. pre-consolidation confusion state

**Post-Phase 6 Baseline** (for Phase 6+N future comparisons):

- Will be documented in `PHASE6_METRICS_REPORT.md`
- To be referenced in future rollout efforts for the PRD Agent or related tools

---

## Related Documents

- **ROLLOUT_PLAN.md**: Overall rollout strategy and timeline
- **FAQ.md**: Common questions and troubleshooting (addresses adoption blockers)
- **ROLLOUT_FEEDBACK.md**: Detailed feedback from team briefings (created Week 2)
- **ADOPTION_METRICS_TRACKER.md**: Weekly update of KPI values (created Week 1)
- **USER_SATISFACTION_SURVEY_RESULTS.md**: Survey analysis (created Week 5)
- **PHASE6_METRICS_REPORT.md**: Final Phase 6 report (created Week 6)

---

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-09-12 | Claude Haiku 4.5 | Initial metrics framework created; Phase 6 FR-603 implemented |

---

*This metrics framework is live as of Phase 6 Week 1. Updates and tracker files will be created as the rollout progresses.*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

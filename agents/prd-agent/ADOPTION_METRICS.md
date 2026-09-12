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
| **SC-602**: Active Teams | ≥5 teams | Weekly team lead check-in; usage logs | ≥5 teams using agent |
| **SC-603**: User Satisfaction | ≥4.0/5.0 | Post-adoption survey (week 4-6) | Average score ≥4.0/5.0 |
| **SC-604**: No Critical Blockers | Zero regressions | Issue tracking; team feedback | Zero critical issues reported |

---

## Key Performance Indicators (KPIs)

### Primary KPIs (Directly Tied to Success Criteria)

#### 1. **Team Adoption Rate** (SC-602)

**Definition**: Number of teams actively using the consolidated PRD agent within 30 days of rollout announcement.

**Target**: ≥5 teams

**Measurement**:
- Tracked via team lead check-in responses (weekly)
- Confirmed by visible usage (PRDs generated, agent invocations logged)
- Status: `Adopted` (active integration), `Evaluating` (pilot phase), `Not Yet Started` (on roadmap)

**Collection Method**: 
- Weekly Slack check-in with team leads: "Is your team actively using the consolidated PRD agent? How many workflows run this week?"
- Manual verification: Check agent invocation logs (if available from provider APIs)
- Success markers: Team has loaded agent into repo, run ≥2 workflows, reported initial feedback

**Reporting Cadence**: Weekly (Fridays)

**Example Tracking Table**:

| Team | Week 1 | Week 2 | Week 3 | Week 4 | Week 5 | Week 6 | Status |
|------|--------|--------|--------|--------|--------|--------|--------|
| Product Planning | Evaluating | Active | Active | Active | Active | Active | ✅ ADOPTED |
| Backend Eng | On Roadmap | Evaluating | Active | Active | Active | Active | ✅ ADOPTED |
| Design & UX | Evaluating | Evaluating | Evaluating | Active | Active | Active | ✅ ADOPTED |
| Marketing | On Roadmap | On Roadmap | Evaluating | Evaluating | Active | Active | 🟡 ADOPTING |
| Tech Writing | Evaluating | Evaluating | Evaluating | Evaluating | Evaluating | Evaluating | 🔴 NOT YET |

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

#### 4. **Usage Frequency** (Trend Indicator)

**Definition**: Average number of agent invocations per team per week.

**Target**: ≥2 runs/team/week (indicates active, repeated usage)

**Measurement**:
- Reported in weekly check-in: "How many PRD workflows did your team run this week?"
- Alternative: Agent telemetry logs (if provider APIs expose usage data)

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
  - `@team-lead: Quick adoption check-in — how many PRD workflows did your team run this week? Any blockers? Status: Evaluating / Adopting / Adopted`
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

### Week 6: Metrics Compilation & Phase 6 Checkpoint

- **Task**: Aggregate all metrics into Phase 6 Checkpoint Report
  - Verify all KPIs against success criteria (SC-602, SC-603, SC-604)
  - Identify adoption trends and blockers
  - Recommend proceed to Phase 7 or extend adoption period
  
- **Owner**: Ash Shaw
- **Duration**: 1-2 hours (compilation, analysis, documentation)

---

## Data Storage & Documentation

### Tracking Files

1. **ADOPTION_METRICS_TRACKER.md** (Weekly Updates)
   - Live tracking table: team adoption status, usage frequency, issues reported
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

**Week 6 Final Report** (Phase 6 Checkpoint):
- Comprehensive metrics summary
- Success criteria verification (SC-602, 603, 604)
- Recommendation: Proceed to Phase 7? Extend adoption? Halt rollout?
- Documentation: `PHASE6_METRICS_REPORT.md` (final deliverable for Phase 6)

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

### At Week 6 Checkpoint:

**SC-602: Active Teams** ✅
- [ ] Verify ≥5 teams actively using agent
- [ ] Evidence: Weekly check-in responses + usage frequency ≥2 runs/week
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

**SCENARIO A: All Success Criteria Met (PASS)**
- ✅ ≥5 teams active, satisfaction ≥4.0/5.0, zero critical blockers
- **Decision**: Proceed to Phase 7 (Archive/Sync decision)
- **Next**: Start T076 (Phase 7 decision memo)

**SCENARIO B: Partial Success (CONDITIONAL)**
- ⚠️ Example: 4 teams active (target ≥5), satisfaction 3.8/5.0 (target ≥4.0), one high issue with workaround
- **Decision**: Extend adoption period by 2-3 weeks; address blockers; re-assess at week 9
- **Next**: Implement fixes; re-survey at week 9; make Phase 7 decision then

**SCENARIO C: Failure (FAIL)**
- 🔴 <3 teams active, satisfaction <3.5/5.0, or critical blockers blocking usage
- **Decision**: Halt rollout; investigate root causes; determine if consolidation is viable
- **Next**: Post-mortem; consider rollback to pre-consolidation version or Phase 5 testing improvements

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

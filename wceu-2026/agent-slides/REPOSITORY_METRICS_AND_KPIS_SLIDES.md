---
title: "Repository Metrics & KPIs Slide Deck Prompt"
description: "NotebookLM and design prompt for repository health metrics and KPIs"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Repository Metrics & KPIs Slide Deck Prompt

## System Overview

The **Repository Metrics & KPIs System** tracks developer productivity, release health, code quality trends, and operational efficiency. It provides visibility into how the repository ecosystem is performing and identifies areas for improvement.

**Operational scope**: Metric collection, KPI tracking, trend analysis, health reporting, anomaly detection.

**Owned by**: LightSpeed ops & engineering teams

## Key Metrics

1. **Release Metrics** - Release frequency, time-to-release, hotfix rate
2. **Development Metrics** - PR cycle time, review turnaround, merge rate
3. **Code Quality** - Test coverage, linting compliance, error density
4. **Documentation Health** - Freshness, completeness, accessibility compliance
5. **Issue Handling** - Time-to-triage, resolution time, duplication rate
6. **Team Velocity** - Features completed, bugs fixed, capacity utilization

## Integration Points

- **Meta Agent**: Collects and aggregates health metrics
- **Metrics Reporting Skill**: Generates metric reports and dashboards
- **Planner Agent**: Uses metrics for capacity and release planning
- **Observability**: Session-logger tracks all operations for metrics

## Use Cases & Examples

### Use Case 1: Weekly Metrics Report

Every Monday; metrics dashboard updated with previous week's data.

**Metrics flow:**

1. Metrics workflow triggers (schedule 9 AM Monday)
2. Invokes metrics.agent.js with week-to-date parameters
3. Collects: PRs merged, issues closed, tests run, releases published
4. Calculates: PR cycle time, issue resolution time, velocity
5. Compares to previous week (trend analysis)
6. Generates report: dashboard updated, Slack notification sent
7. Team reviews metrics, discusses trends

### Use Case 2: Monthly KPI Review

Month-end; leadership reviews repository health KPIs.

**KPI flow:**

1. Meta agent generates monthly report
2. Metrics include:
   - Release frequency (target: 2-4/month) ✅
   - PR cycle time (target: < 2 days) ✅
   - Test coverage (target: > 80%) ⚠️
   - Documentation freshness (target: > 95%) ✅
   - Hotfix rate (target: < 1/month) ✅
3. Trends shown: improving vs. degrading
4. Anomalies flagged: unusual spikes or drops
5. Recommendations: where to focus next

### Use Case 3: Performance Regression Detection

Metrics alert: PR cycle time increased 50%; investigation triggered.

**Alert flow:**

1. Automated anomaly detection runs daily
2. Detects: PR cycle time jumped from 1.5 days to 2.25 days
3. Investigates: What changed?
   - More complex PRs?
   - Fewer reviewers available?
   - More PRs in queue?
4. Creates investigation issue
5. Team discusses root cause
6. Implements fix: hire reviewer, reduce PR scope limits

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Repository performance unknown; trends invisible; improvements unmeasured
- Stakes: Quality degradation undetected, inefficiencies persist, improvements uncertain

**Slide 02** - Metrics System Overview

- 6 metric categories: Release, Development, Code Quality, Documentation, Issue, Velocity
- Real-time collection: all operations tracked automatically
- Weekly/monthly reporting: trends analyzed and reported
- Anomaly detection: unusual patterns trigger alerts
- Visibility: metrics published, transparent to all

**Slide 03** - Release Metrics

- **Release Frequency**: Target 2-4 releases/month
- **Time-to-Release**: PR merge → artifact available (target: < 1 day)
- **Hotfix Rate**: Emergency releases/month (target: < 1)
- **Regression Rate**: Bugs found post-release (target: < 5%)
- **Version Health**: SemVer compliance, monotonic progression

**Slide 04** - Development Metrics

- **PR Cycle Time**: Created → Merged (target: < 2 days)
- **Review Turnaround**: PR created → First review (target: < 4 hours)
- **Approval Rate**: Approved PRs / Total PRs (target: > 90%)
- **Merge Rate**: Successfully merged PRs per week
- **Commit Frequency**: Commits per developer per week

**Slide 05** - Code Quality Metrics

- **Test Coverage**: % of code covered by tests (target: > 80%)
- **Linting Compliance**: % of files with zero violations (target: > 95%)
- **Complexity**: Average function complexity (target: < 10)
- **Error Density**: Errors per 1000 lines of code (target: < 5)
- **Security Scan**: Vulnerabilities found (target: 0 critical)

**Slide 06** - Documentation Health Metrics

- **Freshness**: % of docs with recent last_updated (target: > 95%)
- **Completeness**: % of code with documentation (target: > 85%)
- **Accessibility**: % of docs meeting WCAG AA (target: > 98%)
- **Link Health**: % of links that resolve (target: 100% internal)
- **Category Alignment**: % of docs matching their assigned category (target: > 95%)

**Slide 07** - Issue Handling Metrics

- **Time-to-Triage**: Issue created → labeled (target: < 2 hours)
- **Resolution Time**: Issue created → closed (target: varies by type)
- **Duplication Rate**: Duplicate issues caught (target: > 80%)
- **Backlog Size**: Open issues not yet triaged (target: < 50)
- **Lead Time**: Issue created → implementation started (target: < 1 week)

**Slide 08** - Team Velocity Metrics

- **Features Completed**: Features shipped per sprint (target: team-specific)
- **Bugs Fixed**: Bug fixes completed per sprint
- **Capacity Utilization**: Planned vs. actual completed work
- **Burn-down**: Daily progress toward sprint goals
- **Cycle Efficiency**: Actual work / Total time (target: > 70%)

**Slide 09** - Real-Time Dashboards

- **Live metrics**: Updated every 15 minutes
- **Visualizations**: Trend charts, gauge indicators, heatmaps
- **Public access**: Metrics visible to entire team
- **Alerts**: Critical metric changes trigger notifications
- **Customization**: Teams can define custom dashboards

**Slide 10** - Trend Analysis & Forecasting

- **Weekly trends**: How metrics changed last 4 weeks
- **Monthly trends**: How metrics changed last 6 months
- **Seasonal patterns**: Are there predictable variations? (e.g., summer slowdown)
- **Forecasting**: If current trend continues, where will metric be in 3 months?
- **Anomaly detection**: Alert when metric deviates > 2σ from normal

**Slide 11** - KPI Targets & SLOs

- **Release frequency**: 2-4/month (SLO: ≥ 2)
- **PR cycle time**: < 2 days (SLO: 95th percentile < 3 days)
- **Test coverage**: > 80% (SLO: ≥ 80%)
- **Hotfix rate**: < 1/month (SLO: ≤ 1 per month)
- **Issue response**: < 4 hours to triage (SLO: 95% < 6 hours)
- **Documentation freshness**: > 95% (SLO: ≥ 95%)

**Slide 12** - Using Metrics for Decision-Making

- **Capacity Planning**: Velocity data informs how many features fit in release
- **Process Improvements**: Identify bottlenecks (where is time spent?)
- **Quality Focus**: Where to invest in testing/documentation
- **Hiring**: Do we need more reviewers? More developers?
- **Tool Investment**: Will better tooling improve metrics?

**Slide 13** - Reporting & Visibility

- **Weekly reports**: Sent to team (Slack, email)
- **Monthly reports**: Sent to leadership (detailed KPI review)
- **Dashboards**: Available 24/7 in GitHub Pages
- **Anomaly alerts**: Immediate notification when metrics go red
- **Open data**: All metrics public, no secrets

**Slide 14** - Lessons & Best Practices

- **Measure what matters**: Focus on business outcomes, not vanity metrics
- **Trend matters more than absolute**: Is health improving?
- **Beware of gaming**: Don't incentivize metric hits (encourages bad behavior)
- **Context is critical**: Same metric means different things in different contexts
- **Regular review**: Quarterly assessment of metric relevance and targets

**Slide 15** - Close & Next Actions

- Metrics provide visibility into repository health
- Contribute: Monitor metrics, discuss trends, help improve
- Questions & feedback

## Evidence Anchors

- `.github/metrics/meta-metrics.json` - Current health snapshot
- `.github/metrics/meta-log.md` - Time-series metrics
- `.github/.github/workflows/metrics.yml` - Metrics workflow
- `.github/scripts/agents/reporting.agent.js` - Metrics reporting logic
- `scripts/metrics/` - Metric collection scripts

## Design Notes

- **Visual theme**: Analytics and dashboards (charts, gauges, trending)
- **Color palette**: Use data visualization colors (greens for good, reds for bad)
- **Key visuals**: Trend charts, gauge indicators, KPI scorecards, anomaly highlighting
- **Accessibility**: High contrast for status indicators; data tables with proper headers
- **Animations**: Consider metric counter animation, trend line animation

## Quality Bar

- Show realistic metric ranges (not fantasy targets)
- Include actual metric examples from repository
- Validate targets against industry standards
- Show trend analysis examples
- Ensure all evidence references point to current develop branch

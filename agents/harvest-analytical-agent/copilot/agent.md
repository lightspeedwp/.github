# Harvest Analytical Agent — GitHub Copilot Implementation

## Overview

The GitHub Copilot implementation of the Harvest Analytical Agent integrates directly with GitHub's development environment, providing intelligent assistance within code editors and pull requests.

Copilot excels at:

- **GitHub Projects integration** – Manage issues and projects
- **Code analysis** – Review and improve code
- **Workflow automation** – Trigger GitHub Actions
- **Pull request assistance** – Review and comment on PRs

## Available Skills

Skills are triggered using @ mentions in Copilot Chat:

1. **@harvest-profitability** – Analyze project profitability
2. **@harvest-productivity** – Analyze team productivity
3. **@harvest-budget** – Track budget performance
4. **@harvest-report** – Generate analytics reports
5. **@harvest-insights** – Extract actionable insights
6. **@harvest-forecast** – Project future costs/revenue

## Skill Implementation

### @harvest-profitability

Analyzes project profitability including margins, ROI, and cost drivers.

**Usage:**

```
@harvest-profitability Analyze Q3 profitability for Website Redesign project
- Show: Gross margin, cost breakdown, revenue comparison
- Compare: Against budget and historical projects
- Recommend: Optimization opportunities
```

### @harvest-productivity

Calculates team productivity metrics and identifies efficiency patterns.

**Usage:**

```
@harvest-productivity Team productivity report for backend team
- Period: Last quarter
- Metrics: Billable utilization, hours per project
- Benchmark: Industry standards
```

### @harvest-budget

Tracks project budget performance and forecasts final costs.

**Usage:**

```
@harvest-budget Mobile App project budget status
- Current spend vs. budget
- Projected overrun
- Timeline impact
- Recommendations
```

### @harvest-report

Generates comprehensive analytics reports in multiple formats.

**Usage:**

```
@harvest-report Executive summary report for Q3
- Include: Key metrics, profitability, team performance
- Format: PDF/HTML
- Recipients: Leadership team
```

### @harvest-insights

Extracts strategic business insights from data analysis.

**Usage:**

```
@harvest-insights What are our biggest cost drivers?
- Analyze: Last 6 months data
- Compare: Across projects and teams
- Recommend: Cost optimization strategies
```

### @harvest-forecast

Projects future performance based on historical trends.

**Usage:**

```
@harvest-forecast Q4 revenue and profitability forecast
- Based on: Historical trends, pipeline
- Confidence: 80%
- Scenarios: Conservative, realistic, optimistic
```

## Response Format

Copilot provides responses optimized for GitHub:

### Profitability Analysis Response

```markdown
## Project Profitability: Website Redesign

**Key Metrics:**
- Gross Margin: 45%
- Net Profit: $24,500
- ROI: 2.3x

**Cost Breakdown:**
- Labor: 65%
- Overhead: 25%
- Materials: 10%

**Recommendations:**
1. Increase hourly rates (10% impact)
2. Optimize resource allocation
3. Improve billable ratio
```

### Budget Report Response

```markdown
## Budget Status: Mobile App

**Variance Analysis:**
- Budget: $50,000
- Spent: $38,500
- Remaining: $11,500
- Variance: -23%

**Forecast:**
- Projected final: $41,200
- Status: On track
- Confidence: 85%
```

### Team Productivity Response

```markdown
## Team Performance: Q3

**Utilization Metrics:**
- Billable: 78%
- Non-billable: 22%
- Target: 80%

**Performance:**
- Team velocity: 215 hours/week
- Cost per hour: $85
- Productivity index: 94%
```

## GitHub Integration

Works with:

- **GitHub Projects** – Track tasks and budget
- **GitHub Discussions** – Share reports and insights
- **Pull Requests** – Link code to cost/profitability
- **GitHub Actions** – Automate report generation
- **GitHub Wiki** – Document financial processes

## Workflow Integration

### PR to Financial Tracking

- Link PRs to project budgets
- Auto-estimate cost impact
- Track billable vs. non-billable
- Update budget status

### GitHub Actions Automation

- Schedule automated reports
- Email summary reports
- Update project dashboards
- Trigger alerts on overruns

### Financial Dashboard

- Real-time expense tracking
- Project profitability dashboard
- Team productivity metrics
- Budget variance visualization

## Advanced Integration Patterns

### Automated Financial Reports

1. Schedule weekly profitability reports
2. Auto-send to leadership via GitHub
3. Include variance analysis
4. Highlight risks and opportunities

### Project Cost Tracking

1. Estimate effort in PR/issues
2. Link to Harvest projects
3. Track cost in real-time
4. Alert on budget risks

### Team Performance Tracking

1. Calculate utilization metrics
2. Track productivity trends
3. Benchmark against industry
4. Identify improvement areas

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology
- [skills.yaml](./skills.yaml) – Skill definitions
- [AGENT.md](../AGENT.md) – Agent specification

---

*Built by LightSpeedWP with open-source spirit!*

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

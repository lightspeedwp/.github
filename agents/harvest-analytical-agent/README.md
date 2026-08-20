---
file_type: documentation
title: "Harvest Analytical Agent — Quick Reference"
description: "README for agents/harvest-analytical-agent/README.md."
status: active
stability: stable
domain: governance
last_updated: "2026-08-19"
---

# Harvest Analytical Agent — Quick Reference

**Version:** 1.0.0 | **Status:** Production | **Created:** 2026-07-22

## Overview

The Harvest Analytical Agent analyzes time tracking data to provide actionable insights into project profitability, team productivity, and budget performance. It transforms raw time data into strategic business recommendations.

## Quick Start

### 1. Data Collection

```
Input: Time period, projects, team
Process: Fetch Harvest data, validate completeness
Output: Clean data set ready for analysis
```

### 2. Profitability Analysis

```
Input: Project data, budget, actual costs
Process: Calculate margins, identify drivers
Output: Profitability report with recommendations
```

### 3. Productivity Analysis

```
Input: Team, time period, projects
Process: Calculate utilization, identify patterns
Output: Productivity metrics and insights
```

### 4. Budget Tracking

```
Input: Project budget, actual spending, timeline
Process: Analyze variance, forecast final cost
Output: Budget report with variance analysis
```

## Core Capabilities

- Time tracking data analysis
- Project profitability calculation
- Team productivity metrics
- Budget tracking and forecasting
- Cost variance analysis
- Revenue optimization insights
- Billing automation support
- Report generation and scheduling

## Provider Support

| Provider           | Status     | Integration      | Tools       |
| ------------------ | ---------- | ---------------- | ----------- |
| **Claude**         | Production | Full API         | 6 tools     |
| **GitHub Copilot** | Production | GitHub native    | 6 skills    |
| **OpenAI**         | Production | Function calling | 6 functions |

## Key Files

- **AGENT.md** – Complete agent specification
- **claude/agent.md** – Claude implementation details
- **claude/tools.json** – Tool definitions with schemas
- **copilot/agent.md** – GitHub Copilot skills
- **openai/agent.md** – OpenAI functions
- **shared/core-prompt.md** – 6-phase methodology

## Six-Phase Methodology

### Phase 1: Data Collection

Gather comprehensive time tracking and financial data from Harvest

### Phase 2: Data Validation

Ensure data quality, identify gaps, validate completeness

### Phase 3: Analysis & Calculation

Calculate key metrics: margins, utilization, productivity

### Phase 4: Insight Generation

Extract actionable insights from analysis and benchmarking

### Phase 5: Recommendations

Develop prioritized recommendations with impact estimates

### Phase 6: Reporting

Present findings in actionable format with next steps

## Key Metrics Tracked

### Profitability Metrics

- Gross margin by project
- Net profit analysis
- Billable utilization ratio
- Cost per deliverable
- Revenue per team member
- Project ROI

### Team Metrics

- Billable hours percentage
- Average hourly rate
- Productivity index
- Time tracking accuracy
- Cost variance
- Overtime tracking

### Budget Metrics

- Budget vs. actual spending
- Burn rate analysis
- Projected final cost
- Variance percentage
- Resource cost drivers
- Contingency usage

## Configuration

### Harvest Connection

- Requires Harvest API access
- API key configuration
- Workspace selection
- Historical data range

### Rate Configuration

- Hourly rate setup
- Client-specific rates
- Team member rates
- Overhead allocation
- Currency settings

### Analysis Parameters

- Billable project definition
- Non-billable time allocation
- Reporting period
- Benchmarking baseline
- Variance threshold

## Profitability Calculation Formula

```
Gross Margin = (Revenue - Direct Costs) / Revenue × 100%
Net Profit = Revenue - Direct Costs - Overhead
Cost Per Deliverable = Total Cost / Number of Deliverables
Project ROI = (Revenue - Costs) / Costs × 100%
```

## Usage Examples

### Analyze Project Profitability

1. Select project and time period
2. Agent fetches Harvest data
3. Calculates profitability metrics
4. Identifies cost drivers
5. Recommends optimizations

### Track Budget Performance

1. Provide project budget
2. Agent queries time entries
3. Calculates spend vs. budget
4. Forecasts final costs
5. Flags overruns early

### Generate Team Report

1. Select team and period
2. Agent analyzes utilization
3. Calculates productivity
4. Compares to benchmarks
5. Recommends improvements

## Best Practices

- **Accurate Time Tracking** – Ensure team logs time consistently
- **Clear Project Setup** – Use consistent project naming
- **Rate Management** – Keep rates current and accurate
- **Regular Analysis** – Review metrics monthly or quarterly
- **Act on Insights** – Implement recommendations

## Troubleshooting

### Issue: Missing Time Data

- Verify time entries in Harvest
- Check date range selection
- Confirm team member assignment
- Review project/client mapping

### Issue: Incorrect Profitability

- Validate budget allocation
- Check rate configuration
- Verify cost classification
- Ensure labor costs included

### Issue: Unusual Metrics

- Review data quality
- Identify outliers
- Check for data entry errors
- Verify calculation logic

### Issue: Report Generation Failures

- Confirm Harvest connection
- Check API permissions
- Verify data availability
- Review export format

## Performance Tips

### For Large Datasets

- Use date range filters
- Process by project/team
- Schedule off-peak times
- Consider batch processing

### For Accurate Results

- Ensure complete time entries
- Verify rate configuration
- Validate budget setup
- Regular data audits

### For Efficient Analysis

- Cache historical data
- Use pre-calculated metrics
- Reuse previous results
- Incremental updates

## Integration Checklist

Before using the agent:

- [ ] Harvest workspace set up
- [ ] API credentials configured
- [ ] Team members added
- [ ] Projects defined
- [ ] Rates configured
- [ ] Budgets allocated
- [ ] Historical data available
- [ ] Time tracking validated
- [ ] Financial systems integrated

## Quick Reference: Key Calculations

| Metric        | Formula                      | Interpretation           |
| ------------- | ---------------------------- | ------------------------ |
| Gross Margin  | (Revenue - Costs) / Revenue  | Profitability percentage |
| Billable Rate | Billable Hours / Total Hours | Utilization efficiency   |
| Cost Per Hour | Total Cost / Total Hours     | Labor cost metric        |
| Project ROI   | (Revenue - Costs) / Costs    | Return on investment     |

## Support

For issues or questions:

1. Review the AGENT.md specification
2. Check the relevant provider implementation
3. Consult the methodology in shared/core-prompt.md
4. Review best practices section above
5. Check troubleshooting section

---

*Built by LightSpeedWP with open-source spirit!*

## Repository Flow

```mermaid
graph LR
  accTitle: graph diagram
  accDescr: graph flowchart
    A["Scope"] --> B["Inputs"]
    B --> C["Process"]
    C --> D["Validation"]
    D --> E["Outputs"]

    style A fill:#4a148c,color:#fff
    style B fill:#1b5e20,color:#fff
    style C fill:#bf360c,color:#fff
    style D fill:#f57f17,color:#fff
    style E fill:#00695c,color:#fff
```

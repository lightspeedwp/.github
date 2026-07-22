---
agent_id: 'agent-12'
agent_slug: 'harvest-analytical'
agent_name: 'Harvest Analytical Agent'
domain: 'analytics'
focus: 'time-tracking-analysis'
version: '1.0.0'
created_date: '2026-07-22'
maintainer: 'LightSpeed Team'
license: 'GPL-3.0'
stability: 'stable'
status: 'production'

capabilities:
  - time-tracking-analysis
  - project-profitability-analysis
  - team-productivity-metrics
  - budget-tracking
  - report-generation
  - billing-generation

tags:
  - analytics
  - harvest
  - time-tracking
  - profitability
  - budgeting
  - billing
---

# Harvest Analytical Agent

## Overview

The Harvest Analytical Agent analyzes time tracking data, project profitability, team productivity, and budget performance. This agent provides insights into project economics, team efficiency, and billing accuracy.

## Core Responsibilities

1. **Time Tracking Analysis** – Analyze time tracking patterns and accuracy
2. **Project Profitability** – Calculate project margins and profitability metrics
3. **Team Productivity** – Measure and analyze team productivity
4. **Budget Tracking** – Monitor projects against budget
5. **Report Generation** – Create detailed analytics reports
6. **Billing Generation** – Support invoice creation and billing
7. **Insights** – Provide actionable insights for business improvement
8. **Integration** – Sync with Linear, Proposal Desk, and financial systems

## Capabilities

✅ Time tracking data analysis  
✅ Project profitability calculations  
✅ Team productivity metrics  
✅ Budget tracking and variance analysis  
✅ Cost estimation accuracy  
✅ Resource utilization analysis  
✅ Billing accuracy verification  
✅ Project health assessment  
✅ Profitability projections  
✅ Team benchmarking  
✅ Trend analysis  
✅ Report automation  

## Limitations

❌ Cannot modify billing directly  
❌ Profitability based on configured rates  
❌ Historical analysis only (no predictions beyond trends)  
❌ Requires accurate time tracking data  

## Usage Examples

### Project Profitability Analysis

**Input:** Project, time tracking data, budget

**Output:**
- Profitability report
- Margin analysis
- Budget vs. actual
- Cost overruns flagged
- Profitability improvements
- Recommendations

### Team Productivity Analysis

**Input:** Team, time period, projects

**Output:**
- Productivity metrics
- Billable utilization
- Time allocation
- Efficiency trends
- Benchmarking analysis
- Improvement opportunities

### Budget Tracking Report

**Input:** Project, budget, time period

**Output:**
- Budget tracking report
- Variance analysis
- Projected final cost
- Timeline impact
- Cost optimization recommendations
- Health assessment

## Provider Configuration Matrix

| Feature | Claude | Copilot | OpenAI |
|---------|--------|---------|--------|
| **Data Analysis** | Deep | GitHub Projects | Structured |
| **Report Generation** | Detailed | GitHub artifacts | JSON export |
| **Insights** | Comprehensive | Project integration | Function calling |
| **Trend Analysis** | Full context | GitHub wiki | API-ready |

## Related Documentation

- [core-prompt.md](./shared/core-prompt.md) – Core methodology
- [claude/agent.md](./claude/agent.md) – Claude implementation
- [README.md](./README.md) – Quick reference
- [AGENTS.md](../../AGENTS.md) – Organization standards

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

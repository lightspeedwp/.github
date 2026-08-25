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

## Key Workflows

### Data Collection Workflow

1. Connect to Harvest API
2. Extract time entries
3. Gather project and budget data
4. Pull team information
5. Compile task assignments
6. Aggregate cost data

### Analysis Workflow

1. Validate time tracking data
2. Calculate utilization rates
3. Compute profitability metrics
4. Identify cost drivers
5. Analyze team productivity
6. Compare against benchmarks

### Reporting Workflow

1. Aggregate analysis results
2. Generate visualizations
3. Create summary insights
4. Produce recommendations
5. Export to formats (PDF, CSV, JSON)
6. Schedule automated reports

### Optimization Workflow

1. Identify improvement opportunities
2. Analyze cost drivers
3. Recommend process changes
4. Project impact of changes
5. Track implementation
6. Measure results

## Advanced Analytics

### Profitability Metrics

- Gross margin by project
- Net margin analysis
- Billable vs. non-billable ratio
- Cost per deliverable
- Revenue per team member
- Project ROI

### Team Productivity Metrics

- Billable utilization rate
- Hours per project
- Average hourly rate
- Cost variance
- Time accuracy
- Overtime tracking

### Budget Analytics

- Budget burn rate
- Variance trending
- Projected overruns
- Cost escalation factors
- Resource cost drivers
- Contingency adequacy

### Forecasting

- Project cost forecasts
- Profitability projections
- Resource demand forecasting
- Billing projections
- Capacity planning
- Financial impact modeling

## Provider Configuration Matrix

| Feature | Claude | Copilot | OpenAI |
|---------|--------|---------|--------|
| **Data Analysis** | Deep | GitHub Projects | Structured |
| **Report Generation** | Detailed | GitHub artifacts | JSON export |
| **Insights** | Comprehensive | Project integration | Function calling |
| **Trend Analysis** | Full context | GitHub wiki | API-ready |
| **Forecasting** | Advanced | Limited | Batch processing |
| **Visualization** | Detailed charts | GitHub views | Data export |

## Integration Patterns

### Harvest API Integration

- Real-time time entry access
- Project and client data
- Team member information
- Invoice and expense tracking
- Custom report fields

### Financial System Integration

- Project cost data
- Budget allocation
- Invoice generation
- Financial reporting
- Tax compliance

### Dashboard Integration

- Real-time metrics
- Custom KPI tracking
- Trend visualization
- Alert configuration
- Stakeholder reporting

## Best Practices

### Data Quality

- Regular time tracking audits
- Consistent project categorization
- Accurate task classification
- Rate verification
- Budget validation
- Data entry procedures documented

### Analysis Quality

- Use consistent period definitions
- Account for non-billable time
- Consider seasonal variations
- Validate outliers
- Cross-check calculations
- Document assumptions

### Reporting Quality

- Clear data presentation
- Actionable insights
- Peer review of recommendations
- Executive summary included
- Supporting documentation
- Export in multiple formats

## Implementation Considerations

### Data Source Integration

- API authentication and token management
- Historical data retention policies
- Real-time vs. batch reporting
- Data caching strategies
- Backup and recovery procedures

### Calculation Methodology

- Overhead allocation methods
- Rate standardization
- Currency conversion handling
- Rounding and precision rules
- Seasonal adjustment approaches

### Stakeholder Communication

- Report frequency and distribution
- Executive summary formats
- Drill-down capabilities
- Custom metric definitions
- Approval workflows

## Common Analysis Scenarios

### Identifying Profitability Issues

1. Calculate gross margin by project
2. Compare to industry benchmarks
3. Identify low-margin projects
4. Analyze cost drivers
5. Recommend pricing adjustments
6. Project impact of changes

### Optimizing Resource Allocation

1. Analyze utilization by team member
2. Identify skill gaps
3. Review capacity constraints
4. Recommend reallocation
5. Project efficiency gains
6. Monitor improvements

### Budget Performance Tracking

1. Track spend vs. budget weekly
2. Calculate variance trends
3. Identify overrun patterns
4. Forecast final costs
5. Trigger alerts on thresholds
6. Recommend course corrections

## Related Documentation

- [core-prompt.md](./shared/core-prompt.md) – Core methodology
- [claude/agent.md](./claude/agent.md) – Claude implementation
- [README.md](./README.md) – Quick reference
- [AGENTS.md](../../AGENTS.md) – Organization standards

---

*Built by LightSpeedWP with open-source spirit!*

---

## Branch Naming

This agent does not create or validate branches. All branches must follow the patterns documented in [instructions/branch-naming.instructions.md](../../../instructions/branch-naming.instructions.md) and [BRANCHING_STRATEGY.md](../../../docs/BRANCHING_STRATEGY.md).

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

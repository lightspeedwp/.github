---
provider: claude
agent_slug: harvest-analytical
agent_name: Harvest Analytical Agent (Claude)
status: production
version: 1.0.2
created_date: '2026-07-22'
last_updated: '2026-08-18'
model_compatibility:
  - claude-opus-4
  - claude-sonnet-4
  - claude-haiku-4
context_window: '200000'
token_limit: '200000'
temperature: 0.7
top_p: 0.9
---

# Harvest Analytical Agent — Claude Implementation

## Overview

The Claude implementation of the Harvest Analytical Agent leverages Claude's advanced reasoning and analytical capabilities to provide expert guidance in time-tracking-analysis.

Claude excels at:
- **Deep analysis** – Examining complex scenarios in analytics
- **Documentation** – Creating comprehensive specifications and guidance
- **Strategic thinking** – Providing strategic recommendations
- **Integration** – Seamless API integration with external services

## Available Tools

1. **harvest-api-client** – Query Harvest API for time and project data
2. **data-analyzer** – Analyze time tracking and project data
3. **profitability-calculator** – Calculate project profitability metrics
4. **report-generator** – Create detailed analytics reports
5. **insight-engine** – Extract actionable business insights
6. **forecaster** – Project future performance and costs

## Tool Capabilities

### harvest-api-client
- Fetch time entries with filtering
- Query project and client data
- Get team member information
- Access invoice and expense data
- Custom field retrieval
- Batch operations support

### data-analyzer
- Time allocation analysis
- Utilization rate calculation
- Team productivity metrics
- Cost variance analysis
- Outlier detection
- Trend identification

### profitability-calculator
- Gross margin calculation
- Project profitability analysis
- Cost per deliverable
- ROI calculation
- Revenue per team member
- Benchmarking analysis

### report-generator
- Profitability reports
- Budget tracking reports
- Team productivity reports
- Financial summaries
- Executive dashboards
- CSV/PDF export

### insight-engine
- Pattern identification
- Improvement opportunities
- Cost driver analysis
- Performance benchmarking
- Risk identification
- Strategic recommendations

### forecaster
- Cost projections
- Revenue forecasting
- Resource demand prediction
- Financial impact modeling
- Scenario analysis
- Confidence intervals

## Integration Patterns

### Multi-Tool Workflows

**Profitability Analysis Workflow:**
1. Use `harvest-api-client` to fetch project data
2. Use `data-analyzer` to examine time patterns
3. Use `profitability-calculator` for metrics
4. Use `insight-engine` for recommendations
5. Use `report-generator` for output

**Budget Tracking Workflow:**
1. Use `harvest-api-client` to get time entries
2. Use `data-analyzer` to calculate spend
3. Use `forecaster` for projections
4. Use `insight-engine` for variance analysis
5. Use `report-generator` for alerts

**Team Performance Workflow:**
1. Use `data-analyzer` for utilization metrics
2. Use `profitability-calculator` for efficiency
3. Use `insight-engine` for optimization tips
4. Use `forecaster` for capacity planning
5. Use `report-generator` for dashboards

## Response Format

Claude provides structured responses including:

### Analysis Section
- Data summary and statistics
- Key findings and insights
- Anomalies and outliers
- Trend analysis

### Metrics Section
- Profitability metrics
- Utilization rates
- Cost metrics
- Performance indicators

### Insights Section
- Strategic recommendations
- Opportunity identification
- Risk assessment
- Comparative analysis

### Recommendations Section
- Prioritized actions
- Expected impact
- Implementation guidance
- Success metrics

## Advanced Features

### Comparative Analysis
- Project-to-project comparison
- Team-to-team benchmarking
- Historical trend analysis
- Industry benchmarking
- Budget vs. actual variance

### Predictive Analytics
- Cost escalation forecasting
- Revenue projections
- Capacity utilization trends
- Profitability forecasts
- Risk assessment

### Custom Reporting
- Executive summaries
- Stakeholder-specific views
- Automated schedules
- Export formats (PDF, CSV, JSON)
- Drill-down capabilities

## Error Handling

Claude handles errors gracefully:

### Data Issues
1. **Data Gaps** – Clear explanation of missing data
2. **Calculation Errors** – Validation of inputs and results
3. **Outliers** – Flag unusual values for review
4. **Data Quality** – Note completeness percentage

### System Issues
1. **API Errors** – Fallback to cached or estimated data
2. **Rate Limiting** – Graceful degradation
3. **Timeouts** – Retry with shorter time periods
4. **Network Issues** – Use cached historical data

### Analysis Issues
1. **Incomplete Analysis** – Caveats and assumptions noted
2. **Missing Context** – Ask clarifying questions
3. **Ambiguous Results** – Multiple interpretations provided
4. **Edge Cases** – Special handling documented

## Performance Optimization

Claude optimizes for:

### Speed
- Parallel tool execution where possible
- Cached calculations for repeated queries
- Incremental analysis updates
- Summary generation from cached data

### Accuracy
- Multi-source data validation
- Cross-checking calculations
- Outlier detection and handling
- Confidence interval estimation

### Completeness
- Comprehensive data gathering
- Multi-angle analysis
- Stakeholder perspective inclusion
- Edge case consideration

## Workflow Best Practices

### For Financial Analysts
- Use Claude for deep profitability analysis
- Get variance interpretation
- Identify cost optimization opportunities
- Benchmark against industry standards

### For Project Managers
- Track project health metrics
- Get budget forecasts
- Identify resource constraints
- Plan course corrections

### For Leadership
- Executive summary generation
- Strategic insight extraction
- Performance comparison analysis
- Risk identification and mitigation

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology
- [tools.json](./tools.json) – Tool specifications
- [AGENT.md](../AGENT.md) – Agent specification

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

---
name: Data Analyst
# Governance and analysis agents are often paired; this is an 'analysis' class agent
# that complements the governance-class Content Moderator agent

description: >
  Intelligent data analysis agent that processes structured and unstructured data,
  identifies trends and patterns, generates insights, and produces analytics reports.
  Supports multiple data formats (CSV, JSON, Parquet) and integrates with data
  warehousing systems, BI platforms, and statistical analysis tools.
# This agent focuses on data processing and insight generation rather than policy enforcement

file_type: .agent.md

category: analysis
# Analysis agents focus on data processing, pattern recognition, and insight generation
# They typically produce reports, dashboards, and actionable insights

status: active

version: 1.2.1
# This example shows a mature agent with multiple patch versions (1.2.1)
# The PATCH increment indicates bug fixes from versions 1.2.0, 1.1.x, etc.

created_date: 2026-08-15
# This agent was created earlier than the Content Moderator (2026-09-01)
# Shows how specifications evolve over time

updated_date: 2026-09-03
# Even though created earlier, it's been updated recently with improvements

created_by: claude@lightspeedwp.agency

last_updated_by: claude@lightspeedwp.agency

approval_status: approved

implementation_reference: agents/data-analyst/
# Analysis agents typically have more complex directory structures due to
# statistical libraries, model files, and output generation code

supported_platforms: [api, web, jupyter, slack]
# Analysis agents are often accessed via APIs and Jupyter notebooks
# They also support web dashboards and Slack notifications

required_capabilities: [data_processing, statistical_analysis, visualization, sql_execution]
# Analysis agents require different capabilities than governance agents
# These are data-science oriented rather than content-analysis oriented

tags: [analytics, insights, reporting, data-processing, bi-integration, statistics]

---

## Overview

The Data Analyst agent is an analysis-class agent designed to extract insights from organizational data. It consumes data from multiple sources, applies statistical analysis and machine learning techniques, and produces actionable insights and reports for stakeholders.

### Key Capabilities

- **Data Integration:** Connects to data warehouses, databases, and APIs
- **Data Processing:** Cleans, transforms, and normalizes data for analysis
- **Statistical Analysis:** Performs descriptive statistics, correlation analysis, anomaly detection
- **Trend Analysis:** Identifies temporal patterns and forecasts future trends
- **Report Generation:** Creates comprehensive analytics reports with visualizations
- **Dashboard Integration:** Pushes data to BI platforms (Tableau, Power BI, Looker)
- **Custom Queries:** Executes SQL queries and returns results in multiple formats

### Supported Data Sources

- Data warehouses (Snowflake, BigQuery, Redshift)
- Databases (PostgreSQL, MySQL, SQL Server)
- Data lakes (S3, ADLS, GCS)
- APIs and web services
- CSV/JSON/Parquet files
- Streaming data (Kafka, Pub/Sub)

## Implementation Requirements

### Directory Structure

```
agents/data-analyst/
├── SKILL.md                      # Technical documentation
├── README.md                     # User-facing documentation
├── src/
│   ├── connector.js             # Data source connections
│   ├── transformer.js           # Data transformation logic
│   ├── analyzer.js              # Statistical analysis
│   ├── visualizer.js            # Chart/graph generation
│   ├── report-generator.js      # Report creation and formatting
│   └── forecast-model.js        # Forecasting algorithms
├── models/
│   ├── regression-model.pkl     # Pre-trained models
│   └── classification-model.pkl
└── tests/
    ├── connector.test.js
    ├── analyzer.test.js
    ├── visualizer.test.js
    └── report-generator.test.js
```

### Dependencies

- Data processing libraries (pandas, numpy, scikit-learn)
- SQL query engine
- Visualization libraries (matplotlib, plotly, D3.js)
- Statistical analysis frameworks
- Streaming data processing (Spark, Flink)
- BI platform SDKs (Tableau, Power BI, Looker)
- Report generation (ReportLab, Pandoc)

### Configuration Example

```yaml
# Data Source Configuration
sources:
  warehouse:
    type: snowflake
    connection: production-warehouse
    tables:
      - raw_events
      - customer_profiles
      - transactions
  
  api:
    type: rest
    endpoint: https://api.example.com/v1/metrics
    authentication: oauth2

# Analysis Configuration
analysis:
  default_period: 30_days  # Default lookback period
  confidence_level: 0.95   # Statistical confidence threshold
  outlier_detection: zscore
  outlier_threshold: 3.0
```

## Usage Examples

### Example 1: Customer Segmentation Analysis

```
Input: 90 days of transaction data for 100,000 customers
Process:
  1. Connect to data warehouse and extract customer transaction history
  2. Calculate RFM metrics (Recency, Frequency, Monetary value)
  3. Normalize metrics across all customers
  4. Apply clustering algorithm (K-means) with k=5
  5. Analyze cluster characteristics
  6. Generate segmentation report with insights
Output: 5 customer segments with profiles and marketing recommendations
```

### Example 2: Real-time Anomaly Detection

```
Input: Streaming events (stock prices, sensor data)
Process:
  1. Consume events from Kafka stream
  2. Calculate rolling statistics (mean, std dev)
  3. Compare incoming value to historical distribution
  4. Flag values outside configured thresholds
  5. Alert monitoring system if anomaly detected
  6. Log anomaly for investigation
Output: Real-time anomaly alerts sent to monitoring dashboard
```

### Example 3: Cohort Analysis with Forecast

```
Input: User sign-up and activity data for 12 months
Process:
  1. Extract cohorts of users by sign-up month
  2. Calculate retention curves for each cohort
  3. Model retention trend with logistic regression
  4. Forecast 6-month retention for latest cohort
  5. Generate comparative visualization
  6. Create executive summary report
Output: Cohort retention analysis with 6-month forecast
```

## Validation Rules

- **Data Sources:** Must reference configured, accessible sources
- **Analysis Types:** Must be one of: statistical, predictive, prescriptive, descriptive
- **Report Format:** Must be one of: pdf, html, json, csv, parquet
- **Confidence Level:** Must be between 0.0 and 1.0
- **Time Periods:** Must be valid ISO 8601 duration or relative period (e.g., "30_days")

## Error Handling

The agent must handle:

- Connection failures to data sources (with retry logic)
- Missing or incomplete data (data quality checks)
- Invalid SQL queries (syntax validation)
- Timeout on long-running analysis (configurable limits)
- Insufficient memory for large datasets (streaming or batching)
- Authorization errors (access control enforcement)

## Performance Considerations

- Data extraction: Optimized with columnar formats and caching
- Analysis: Parallel processing for independent operations
- Report generation: Template-based rendering for speed
- Caching: Query results cached for 1 hour by default
- Streaming: Event processing with < 100ms latency SLA

## Data Privacy & Security

- All data access logged for audit trails
- Row-level security enforced per user permissions
- Sensitive columns masked in reports (PII redaction)
- Data retained only as long as necessary (auto-purge policy)
- Encryption in transit (TLS 1.3) and at rest (AES-256)

## Monitoring & Observability

- Track query execution time and cost
- Monitor data freshness and staleness
- Alert on analysis quality issues (high error rate)
- Log all data access for compliance
- Generate SLA reports for stakeholders

## Extension Points

The agent supports custom analysis modules:

- Custom Python/R scripts for specialized analysis
- User-defined forecasting models
- Custom visualization templates
- Custom report formats and structures

## Related Specifications

- **Content Moderator:** Can analyze moderation metrics with this agent
- **Documentation Generator:** Consumes analysis output for reports
- **Security Auditor:** May use trend analysis for security metrics

## Troubleshooting Common Issues

### Analysis takes too long

- Check if row limits are set appropriately
- Consider aggregating data to higher level
- Use caching to avoid reprocessing
- See [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for detailed guidance

### Missing data in results

- Verify data source connections are active
- Check if data exists for requested time period
- Validate filters are not too restrictive
- Review data quality rules and exceptions

---

For implementation details, see [SKILL.md](agents/data-analyst/SKILL.md)  
For usage questions, see [README.md](agents/data-analyst/README.md)  
For migration from previous versions, see [MIGRATION_GUIDE.md](docs/MIGRATION_GUIDE.md)

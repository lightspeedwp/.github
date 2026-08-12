---
name: Architecture
description: System architecture and data flow diagrams
type: architecture
version: '1.0'
---

# Metrics Agent — Architecture

## System Overview

```mermaid
graph TB
    subgraph "GitHub"
        GH["GitHub API<br/>Issues, PRs, Contributors"]
    end

    subgraph "Metrics Agent"
        direction TB
        CONFIG["1. Configuration<br/>Load context & metrics"]
        COLLECT["2. Collection<br/>Query GitHub API"]
        AGGREGATE["3. Aggregation<br/>Calculate metrics"]
        ANALYZE["4. Analysis<br/>Generate insights"]
        PACKAGE["5. Package<br/>Format for handoff"]
    end

    subgraph "Reporting"
        REPORT["Reporting Agent<br/>Format & Store"]
        OUTPUT["Output<br/>.github/reports/metrics/"]
    end

    GH -->|API queries| COLLECT
    CONFIG --> COLLECT
    COLLECT --> AGGREGATE
    AGGREGATE --> ANALYZE
    ANALYZE --> PACKAGE
    PACKAGE -->|Handoff| REPORT
    REPORT --> OUTPUT

    style CONFIG fill:#01579B,color:#fff
    style COLLECT fill:#E65100,color:#fff
    style AGGREGATE fill:#4A148C,color:#fff
    style ANALYZE fill:#1B5E20,color:#fff
    style PACKAGE fill:#880E4F,color:#fff
    style REPORT fill:#33691E,color:#fff
```

## Component Architecture

### Configuration Layer

```mermaid
graph LR
    USER["User/Automation"] -->|Provides| CONFIG_FILE["Config File<br/>.json"]
    CONFIG_FILE -->|Loads| CONFIG_LOADER["ConfigurationLoader"]
    CONFIG_LOADER -->|Validates| VALIDATOR["ConfigValidator"]
    VALIDATOR -->|Output| CONFIG_OBJ["Configuration<br/>Object"]
    CONFIG_OBJ -->|Provides to| COLLECTOR["Collection Module"]
```

**Responsibilities:**

- Load configuration files
- Validate context, metrics, repositories
- Provide validated configuration to other modules
- Support environment variables for sensitive data

### Collection Module

```mermaid
graph TD
    CONFIG["Configuration"] --> QUERY["GitHub API Queries"]
    QUERY -->|Batch requests| GITHUB["GitHub API"]
    GITHUB -->|Responses| PARSE["Parse Response"]
    PARSE --> EXTRACT["Extract Metrics"]
    EXTRACT --> VALIDATE["Validate Data"]
    VALIDATE -->|Complete| RAW["Raw Metrics<br/>Cache"]
    
    GITHUB -.->|Rate limit| RETRY["Exponential Backoff"]
    RETRY -.->|Retry| GITHUB
```

**Responsibilities:**

- Query GitHub API efficiently
- Handle rate limiting
- Extract relevant fields
- Validate data quality
- Cache results

### Aggregation Module

```mermaid
graph TD
    RAW["Raw Metrics<br/>Per Repository"] --> CALC["Calculate<br/>Derived Metrics"]
    CALC --> NORM["Normalize Values"]
    NORM --> AGG["Aggregate<br/>Multi-Repo"]
    AGG --> COMBINE["Combine with<br/>Previous Period"]
    COMBINE --> TREND["Calculate Trends"]
    TREND --> RESULT["Aggregated Metrics<br/>Dataset"]
```

**Responsibilities:**

- Calculate averages, medians, percentiles
- Handle outliers
- Multi-repository aggregation
- Trend calculation (period-over-period)
- Data normalization

### Analysis Module

```mermaid
graph TD
    METRICS["Aggregated Metrics"] --> PATTERN["Identify Patterns"]
    PATTERN --> ANOMALY["Detect Anomalies"]
    ANOMALY --> INSIGHT["Generate Insights"]
    INSIGHT --> REC["Generate<br/>Recommendations"]
    REC --> RESULT["Analysis Results"]
    
    subgraph "Pattern Detection"
        PATTERN --> UP["↑ Improving"]
        PATTERN --> DOWN["↓ Declining"]
        PATTERN --> STABLE["→ Stable"]
    end
```

**Responsibilities:**

- Identify patterns in metrics
- Detect anomalies (statistical outliers)
- Generate actionable insights
- Create recommendations
- Flag concerning trends

### Packaging Module

```mermaid
graph LR
    METRICS["Aggregated<br/>Metrics"] --> PKG["Package"]
    INSIGHTS["Insights &<br/>Recommendations"] --> PKG
    METADATA["Collection<br/>Metadata"] --> PKG
    PKG -->|Format| JSON["Metrics Dataset<br/>JSON"]
    JSON -->|Create| HANDOFF["Handoff<br/>Message"]
    HANDOFF -->|Send to| REPORTING["Reporting Agent"]
```

**Responsibilities:**

- Format complete metrics dataset
- Include insights and recommendations
- Add metadata (timestamps, sources)
- Create handoff message
- Send to Reporting agent

## Data Flow

### Complete Collection Flow

```mermaid
sequenceDiagram
    participant User
    participant Config as ConfigurationLoader
    participant Collect as CollectionModule
    participant GitHub as GitHub API
    participant Agg as AggregationModule
    participant Analysis as AnalysisModule
    participant Report as ReportingAgent

    User->>Config: Load configuration
    Config->>Config: Validate config
    Config-->>User: ✅ Ready
    
    User->>Collect: Start collection
    Collect->>GitHub: Query issues
    GitHub-->>Collect: Issue data
    Collect->>GitHub: Query PRs
    GitHub-->>Collect: PR data
    Collect->>GitHub: Query contributors
    GitHub-->>Collect: Contributor data
    
    Collect->>Agg: Raw metrics
    Agg->>Agg: Calculate derived metrics
    Agg->>Agg: Aggregate multi-repo
    Agg->>Agg: Calculate trends
    Agg-->>Analysis: Complete dataset
    
    Analysis->>Analysis: Identify patterns
    Analysis->>Analysis: Detect anomalies
    Analysis->>Analysis: Generate insights
    Analysis-->>Report: Metrics + insights
    
    Report->>Report: Format report
    Report->>Report: Store in .github/reports/
    Report-->>User: ✅ Report created
```

## Multi-Repository Aggregation

```mermaid
graph TB
    subgraph "Per-Repository Collection"
        R1["Repo 1<br/>lightspeedwp/.github"]
        R2["Repo 2<br/>WordPress Plugin"]
        R3["Repo 3<br/>WordPress Theme"]
    end
    
    subgraph "Collection Layer"
        C1["Collect from<br/>Repo 1"]
        C2["Collect from<br/>Repo 2"]
        C3["Collect from<br/>Repo 3"]
    end
    
    subgraph "Aggregation Layer"
        MERGE["Merge Individual<br/>Results"]
        CALC["Calculate Org<br/>Metrics"]
    end
    
    subgraph "Output"
        PER["Per-Repository<br/>Metrics"]
        ORG["Organization<br/>Aggregates"]
    end
    
    R1 -->|API| C1
    R2 -->|API| C2
    R3 -->|API| C3
    
    C1 --> MERGE
    C2 --> MERGE
    C3 --> MERGE
    
    MERGE --> CALC
    MERGE --> PER
    CALC --> ORG
```

## Configuration-Driven Behavior

```mermaid
graph TD
    CONFIG["Configuration File"] -->|context| CONTEXT{Context Type?}
    
    CONTEXT -->|github-control-plane| GH["GitHub Control Plane<br/>All metrics enabled"]
    CONTEXT -->|wordpress-plugin| WP["WordPress Plugin<br/>Filtered metrics"]
    CONTEXT -->|wordpress-theme| WT["WordPress Theme<br/>Filtered metrics"]
    
    GH -->|Full dataset| COLLECT["Collection"]
    WP -->|Plugin metrics| COLLECT
    WT -->|Theme metrics| COLLECT
    
    COLLECT --> OUTPUT["Metrics Dataset"]
```

**Context-Specific Metric Subsets:**

| Context | Metrics | Purpose |
|---------|---------|---------|
| `github-control-plane` | All (Issues, PRs, Contributors, Health, Quality) | Governance dashboard |
| `wordpress-plugin` | Issues, PRs, Contributors, Quality | Community engagement |
| `wordpress-theme` | Issues, PRs, Contributors, Quality | Theme maintenance |

## Error Handling & Retry Strategy

```mermaid
graph TD
    OPERATION["Execute Operation"]
    OPERATION -->|Success| RESULT["Result"]
    OPERATION -->|Error| CHECK{Error Type?}
    
    CHECK -->|Transient| RETRY["Retry with<br/>Exponential Backoff"]
    CHECK -->|Rate Limit| WAIT["Wait for<br/>Limit Reset"]
    CHECK -->|Permanent| LOG["Log & Skip"]
    
    RETRY -->|After delay| OPERATION
    WAIT -->|After reset| OPERATION
    LOG -->|Continue| PARTIAL["Partial Results<br/>+ Warning"]
    RESULT -->|Complete| OUTPUT["Final Metrics"]
    PARTIAL -->|Complete| OUTPUT
```

**Backoff Strategy:**

```
Attempt 1: Immediate
Attempt 2: Wait 2 seconds (2^1)
Attempt 3: Wait 4 seconds (2^2)
Attempt 4: Wait 8 seconds (2^3)
Attempt 5: Wait 16 seconds (2^4)
Max: 5 attempts (total ~31 seconds)
```

## Integration with Reporting Agent

```mermaid
graph LR
    METRICS["Metrics Agent<br/>Complete Dataset"]
    
    METRICS -->|Handoff| REPORTING["Reporting Agent<br/>receiving handoff"]
    
    REPORTING -->|Create| REPORT[".github/reports/metrics/"]
    REPORTING -->|Format| MD["Markdown Report"]
    REPORTING -->|Add| FRONTMATTER["YAML Frontmatter"]
    
    MD --> OUTPUT["Formatted Report"]
    FRONTMATTER --> OUTPUT
```

**Handoff Protocol:**

```json
{
  "action": "create_report",
  "category": "metrics",
  "title": "Weekly Metrics Summary — Aug 5-12",
  "data": { /* complete metrics dataset */ },
  "insights": [ /* array of insights */ ],
  "metadata": {
    "collection_period": "...",
    "context": "github-control-plane",
    "repositories": ["lightspeedwp/.github"]
  }
}
```

## Scalability & Performance

### Single vs Multi-Repository

```mermaid
graph LR
    subgraph "Single Repository"
        S1["100 Issues"]
        S2["50 PRs"]
        S3["8 Contributors"]
        TIME["~20-30 seconds"]
    end
    
    subgraph "5 Repositories"
        M1["500 Issues"]
        M2["250 PRs"]
        M3["30 Contributors"]
        TIME2["~2 minutes"]
    end
    
    S1 --> TIME
    S2 --> TIME
    S3 --> TIME
    
    M1 --> TIME2
    M2 --> TIME2
    M3 --> TIME2
```

### Caching Strategy

```mermaid
graph TD
    REQUEST["Collection Request"] --> CACHE{Cache<br/>Available?}
    CACHE -->|Yes| RETURN["Return Cached<br/>Results"]
    CACHE -->|No| QUERY["Query GitHub<br/>API"]
    QUERY --> STORE["Store in Cache"]
    STORE --> RETURN
    RETURN --> OUTPUT["Metrics Output"]
    
    RETURN -->|If stale| REFRESH["Refresh<br/>Background"]
    REFRESH -->|Update cache| STORE
```

**Cache TTL:** 1 hour (configurable)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

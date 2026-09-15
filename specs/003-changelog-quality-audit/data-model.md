# Data Model: Changelog Quality Audit

**Status**: Phase 1 Design
**Date**: 2026-09-13

## Entity Definitions

### 1. ChangelogEntry

**Purpose**: Represents a single changelog entry with metadata, validation results, and metrics.

**Schema (YAML)**:
```yaml
# Unique identifier
id: "entry_20260912_1"

# Entry metadata
version: "1.2.0"          # Semantic version
date: "2026-09-12"        # ISO 8601 date
category: "feature"       # feature|fix|improvement|breaking-change|security|performance

# Content
title: "Changelog Quality Audit System"
description: |
  New automated validation system ensures changelog entries meet quality standards.
  Entries are checked for clarity, proper formatting, and removal of implementation details.

# References
pr_references: [2906]
issue_references: [1234, 5678]
components: ["ci", "automation", "validation"]  # optional

# Internal metadata
author: "ashley@lightspeedwp.agency"
created_date: "2026-09-12T14:30:00Z"
modified_date: "2026-09-12T14:30:00Z"
status: "published"  # draft|published|archived

# Validation results
validation_rule_version: "1.0"        # Which rule set was used
validation_score: 95                   # 0-100 weighted score
compliance_status: "passing"           # passing|warning|failing
validation_timestamp: "2026-09-12T14:31:00Z"

# Detailed validation breakdown
validation_details:
  - rule_id: "R001"
    rule_name: "no_implementation_details"
    status: "passing"
    message: ""
    
  - rule_id: "R002"
    rule_name: "has_category"
    status: "passing"
    message: ""
    
  - rule_id: "R003"
    rule_name: "has_title"
    status: "passing"
    message: ""
    
  - rule_id: "R005"
    rule_name: "clear_language"
    status: "passing"
    message: ""
    
  - rule_id: "R009"
    rule_name: "has_pr_reference"
    status: "passing"
    message: ""
    
  - rule_id: "R010"
    rule_name: "valid_pr_reference"
    status: "passing"
    message: "PR #2906 verified on GitHub"

# Override tracking
override_applied: false
override_reason: null
override_by: null
override_timestamp: null
```

**Validation Rules Applied**:
- Category must be one of: feature, fix, improvement, breaking-change, security, performance
- Title: required, 3-50 characters, no implementation details
- Description: required, 20+ characters, no code patterns, no internal terminology
- PR References: automatically detected via regex `#\d+`
- Issue References: automatically detected via regex `#\d+`
- Components: optional, free-form labels

**Relationships**:
- Links to ValidationRules (many-to-many: entry tested against multiple rules)
- Links to ValidationReport (many-to-one: entry included in audit report)
- Links to MetricsSnapshot (implicit: contributes to daily metrics)

---

### 2. ValidationRule

**Purpose**: Defines a single quality check or requirement that changelog entries must satisfy.

**Schema (YAML)**:
```yaml
# Rule metadata
id: "R001"
name: "no_implementation_details"
version: "1.0"                # Semantic versioning for rules
enabled: true

# Classification
rule_type: "content"          # format|content|reference|structure
severity: "error"             # error (blocks)|warning (non-blocking)
priority: 1                   # 1=highest, used for rule ordering

# Definition
description: |
  Changelog entries must not contain implementation details such as:
  - Code patterns or syntax (APIs, methods, classes, etc.)
  - Framework-specific terminology (async/await, promises, etc.)
  - Internal project jargon (backend, service mesh, etc.)
  - Technology names in implementation context (React, Node.js, etc.)

patterns:
  - type: "regex"
    pattern: '\b(API|REST|GraphQL|endpoint|method|class|function|interface)\b'
    context: "API or code reference"
    case_sensitive: false
    
  - type: "regex"
    pattern: '\b(async|await|promise|promise\.then|callback)\b'
    context: "async/await pattern"
    case_sensitive: false
    
  - type: "regex"
    pattern: '\b(backend|frontend|service mesh|microservice|middleware)\b'
    context: "internal architecture term"
    case_sensitive: false

# Remediation guidance
remediation_guidance: |
  **Fix**: Rewrite the entry focusing on user benefit, not implementation.
  
  ❌ Bad: "Fixed webhook API response handling using async/await"
  ✓ Good: "Fixed webhook delivery reliability - webhooks now retry on transient network issues"
  
  **Steps**:
  1. Remove all technical terms (API, method, async, etc.)
  2. Describe the user benefit ("webhooks more reliable")
  3. Add context if needed ("now retry on network issues")
  4. Read it aloud - does it make sense to a non-developer?

# Metadata
created_date: "2026-09-13"
modified_date: "2026-09-13"
modified_by: "system"
rule_set_version: "1.0"
```

**Additional Rules (Summary)**:

| ID | Name | Type | Severity | Purpose |
|----|----|------|----------|---------|
| R002 | has_category | structure | error | Entry must specify category |
| R003 | has_title | structure | error | Entry must have title (3-50 chars) |
| R004 | has_description | structure | error | Entry must have description |
| R005 | clear_language | content | warning | Use simple, active voice |
| R006 | proper_formatting | format | error | Valid YAML/Markdown syntax |
| R007 | no_backticks | content | error | No code blocks in description |
| R008 | no_internal_terminology | content | error | No internal jargon (backend, etc.) |
| R009 | has_pr_reference | reference | warning | Should reference PR/issue |
| R010 | valid_pr_reference | reference | error | PR references must exist on GitHub |
| R011 | meaningful_description | content | warning | Description ≥20 chars, substantive |
| R012 | user_focused | content | warning | Describe user benefit |
| R013 | no_emoji | content | warning | No emoji in formal changelog |
| R014 | consistent_tense | content | warning | Consistent past/present tense |
| R015 | proper_dates | format | error | ISO 8601 date format |
| R016 | no_todos | content | error | No TODO/FIXME in final entries |
| R017 | appropriate_length | content | warning | 1-3 sentences |
| R018 | no_personal_pronouns | content | warning | Avoid "I", "we", "you" |
| R019 | no_marketing_hype | content | warning | No superlatives ("amazing", etc.) |
| R020 | valid_category | structure | error | Category in allowed list |

**Relationships**:
- ValidationRule (one) → ChangelogEntry (many): rule applied to entries
- ValidationRule (one) → ValidationReport (many): rule results included in reports
- Rule versioning enables backward compatibility

---

### 3. MetricsSnapshot

**Purpose**: Time-series record of changelog quality metrics for trending and analysis.

**Schema (JSON)**:
```json
{
  "id": "metrics_20260912",
  "snapshot_date": "2026-09-12T00:00:00Z",
  "snapshot_period": "daily",
  "scope": "full_repo",
  
  "summary": {
    "total_entries": 247,
    "compliant_entries": 235,
    "warning_entries": 8,
    "failing_entries": 4,
    "compliance_percentage": 95.14,
    "compliance_percentage_warning_excluded": 96.76
  },
  
  "metrics": {
    "average_validation_score": 92.3,
    "median_validation_score": 94.0,
    "min_validation_score": 68,
    "max_validation_score": 100
  },
  
  "distribution": {
    "entries_by_category": {
      "feature": 120,
      "fix": 100,
      "improvement": 20,
      "breaking_change": 7
    },
    "entries_by_status": {
      "passing": 235,
      "warning": 8,
      "failing": 4
    },
    "entries_by_compliance_trend": {
      "improved": 12,
      "unchanged": 220,
      "degraded": 15
    }
  },
  
  "violations": {
    "most_common": [
      {
        "rule_id": "R010",
        "rule_name": "valid_pr_reference",
        "count": 3,
        "percentage": 1.2
      },
      {
        "rule_id": "R009",
        "rule_name": "has_pr_reference",
        "count": 8,
        "percentage": 3.2
      }
    ],
    "violation_details": {
      "R001_no_implementation_details": 0,
      "R002_has_category": 0,
      "R003_has_title": 0,
      "R004_has_description": 0,
      "R005_clear_language": 2,
      "R006_proper_formatting": 0,
      "R007_no_backticks": 0,
      "R008_no_internal_terminology": 0,
      "R009_has_pr_reference": 8,
      "R010_valid_pr_reference": 3,
      "R011_meaningful_description": 1,
      "R012_user_focused": 0,
      "R013_no_emoji": 0,
      "R014_consistent_tense": 0,
      "R015_proper_dates": 0,
      "R016_no_todos": 0,
      "R017_appropriate_length": 0,
      "R018_no_personal_pronouns": 0,
      "R019_no_marketing_hype": 0,
      "R020_valid_category": 0
    }
  },
  
  "trends": {
    "compliance_trend_7_days": [95.1, 94.8, 95.3, 95.0, 95.2, 95.1, 95.14],
    "compliance_trend_30_days": [89.5, 90.2, 91.1, 92.0, 93.5, 94.0, 94.5, 95.1, 95.14],
    "velocity": {
      "entries_added_today": 2,
      "entries_added_this_week": 14,
      "entries_added_this_month": 52
    }
  },
  
  "metadata": {
    "rule_version": "1.0",
    "snapshot_tool_version": "changelog-validator v0.1.0",
    "generated_by": "system",
    "generation_timestamp": "2026-09-13T05:00:00Z"
  }
}
```

**Relationships**:
- One snapshot per day (immutable, git-committed)
- Links all ChangelogEntry entries for that day
- Time-series enables trend analysis and reporting
- Exportable to CSV for external BI tools

---

### 4. ValidationReport

**Purpose**: Comprehensive audit summary generated after running validation on a release or branch.

**Schema (JSON)**:
```json
{
  "id": "report_v1_2_0_20260912",
  "report_date": "2026-09-12T14:35:00Z",
  "report_type": "release_audit",
  
  "scope": {
    "type": "release",
    "value": "v1.2.0",
    "entry_count": 45
  },
  
  "summary": {
    "total_entries_audited": 45,
    "passed_count": 42,
    "warning_count": 2,
    "failed_count": 1,
    "compliance_percentage": 93.33,
    "compliance_status": "CONDITIONAL_PASS"
  },
  
  "issues_by_category": {
    "no_implementation_details": 0,
    "has_category": 0,
    "has_title": 0,
    "has_description": 0,
    "clear_language": 1,
    "proper_formatting": 0,
    "no_backticks": 0,
    "no_internal_terminology": 0,
    "has_pr_reference": 0,
    "valid_pr_reference": 1,
    "meaningful_description": 0,
    "user_focused": 0,
    "no_emoji": 0,
    "consistent_tense": 0,
    "proper_dates": 0,
    "no_todos": 0,
    "appropriate_length": 0,
    "no_personal_pronouns": 0,
    "no_marketing_hype": 0,
    "valid_category": 0
  },
  
  "passing_entries": [
    {
      "version": "1.2.0",
      "date": "2026-09-12",
      "category": "feature",
      "title": "Real-time changelog validation",
      "compliance_score": 100,
      "status": "PASS"
    }
  ],
  
  "failing_entries": [
    {
      "version": "1.2.0",
      "date": "2026-09-12",
      "category": "fix",
      "title": "Fixed webhook API response",
      "compliance_score": 72,
      "status": "FAIL",
      "issues": [
        {
          "rule_id": "R001",
          "rule_name": "no_implementation_details",
          "severity": "error",
          "message": "Contains 'API' (code reference detected)",
          "remediation": "Remove 'API', use user-facing language like 'webhook delivery'"
        }
      ],
      "suggested_fix": "Fixed webhook delivery reliability"
    },
    {
      "version": "1.2.0",
      "date": "2026-09-12",
      "category": "feature",
      "title": "Authentication improvements",
      "compliance_score": 65,
      "status": "FAIL",
      "issues": [
        {
          "rule_id": "R010",
          "rule_name": "valid_pr_reference",
          "severity": "error",
          "message": "PR #9999 not found or not accessible",
          "remediation": "Update PR reference to valid PR number"
        }
      ]
    }
  ],
  
  "warning_entries": [
    {
      "version": "1.2.0",
      "date": "2026-09-12",
      "category": "improvement",
      "title": "Improved performance",
      "compliance_score": 85,
      "status": "WARNING",
      "issues": [
        {
          "rule_id": "R012",
          "rule_name": "user_focused",
          "severity": "warning",
          "message": "Entry describes improvement but lacks user benefit context",
          "remediation": "Add: 'Users will experience faster page loads' or similar user benefit"
        }
      ]
    }
  ],
  
  "remediation_summary": [
    "1 entry: Replace 'API' with user-facing language",
    "1 entry: Update PR reference to valid number",
    "2 entries: Add user benefit context to descriptions"
  ],
  
  "release_readiness": {
    "status": "CONDITIONAL_PASS",
    "message": "Release can proceed with 1 entry remediation OR 1 manual override (not recommended)",
    "recommendations": [
      "Fix 1 failing entry (easy: 5 min fix)",
      "Review 2 warning entries (recommended improvement, not blocking)",
      "All other 42 entries pass"
    ]
  },
  
  "metadata": {
    "generated_by": "changelog-validator v0.1.0",
    "rule_version": "1.0",
    "generation_timestamp": "2026-09-12T14:35:00Z",
    "run_duration_ms": 2340
  }
}
```

**Report Variations**:
- **Release Audit**: Full compliance report for release candidates
- **Branch Audit**: Validation for development branches
- **Date-Range Audit**: Metrics for historical periods
- **Trend Report**: CSV export for external BI tools

**Relationships**:
- Includes multiple ChangelogEntry results
- References ValidationRule results for each entry
- Stored in git for audit trail
- Exportable to Markdown for GitHub comments
- Exportable to CSV for analytics

---

## State Transitions

### ChangelogEntry Lifecycle

```
draft → published → validated (passing/warning/failing) → [override?] → audited
   ↓
   └─→ archived (for deprecated/reverted entries)
```

- **draft**: Not yet ready for release (optional state)
- **published**: In changelog, ready for validation
- **validated**: Validation run, results recorded
- **override**: Manual override applied (force flag used)
- **audited**: Included in release audit report
- **archived**: Entry no longer relevant (deprecated features)

### ValidationRule Lifecycle

```
draft → published (version X.Y) → superseded (version X.Y+1) → deprecated
```

- **draft**: Rule under development, not applied
- **published**: Rule active, applied to entries
- **superseded**: New version published, old entries stay on old version
- **deprecated**: Rule no longer used, historical reference only

---

## Database/Storage Implementation Notes

**Storage Mechanism**: File-based YAML/JSON in git

- ChangelogEntry: Stored in `CHANGELOG.yml` (existing structure enhanced with validation fields)
- ValidationRule: Stored in `.github/changelog-rules.yml` (LOCKED file)
- MetricsSnapshot: Daily JSON file in `.github/reports/changelog-metrics/YYYYMMDD.json`
- ValidationReport: On-demand generated; can be saved to `.github/reports/release-audits/vX.Y.Z.json`

**Immutability**:
- All snapshots and reports committed to git
- Audit trail preserved in git history
- Corrections made via new commits (never rewrite history)

**Performance**:
- Single entry validation: <100ms (regex patterns only)
- GitHub API validation: ~500ms per reference
- Full audit (100 entries): <5 minutes with caching
- Metrics collection: <1s for daily snapshot

---

## Validation Scoring Algorithm

**Weighted Score Calculation** (0-100):

```
score = 100
for each rule:
  if rule fails:
    if severity == "error": score -= 25 per rule (max 100, min 0)
    if severity == "warning": score -= 5 per rule (min 0)
  if rule passes: no change

compliance_status = 
  score >= 90 ? "passing"
  score >= 75 ? "warning"
  score < 75 ? "failing"
```

**Example**: Entry with 1 error (R001) + 2 warnings (R005, R012):
- Starting: 100
- After error: 100 - 25 = 75
- After warnings: 75 - 5 - 5 = 65
- Status: FAILING

This weighting prioritizes error rules while allowing warnings to still contribute to remediation guidance.

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

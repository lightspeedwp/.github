# Data Model: Changelog Quality Audit

**Phase**: Phase 1 (Design & Contracts)  
**Created**: 2026-09-12  
**Status**: Design Complete

---

## Core Entities

### Entity: ChangelogEntry

Represents a single entry in CHANGELOG.md under the [Unreleased] section.

**Fields**:
- `id` (string): Unique identifier derived from line number in CHANGELOG.md (e.g., `entry_00042`)
- `content` (string): Full entry text (raw markdown)
- `line_number` (integer): Position in CHANGELOG.md for error reporting
- `version_section` (string): Semver version entry belongs to (e.g., `[Unreleased]`, `[1.2.3]`)
- `created_at` (ISO 8601): When entry was added to changelog
- `last_modified_at` (ISO 8601): When entry was last edited
- `pr_number` (integer | null): GitHub PR number if linked
- `issue_numbers` (integer[]): GitHub issue numbers referenced
- `compliance_status` (enum): `compliant` | `non_compliant` | `review_required`
- `violations` (string[]): List of validation failures (empty if compliant)
- `auto_links` (object): `{ pr_url: string, issue_urls: string[] }`

**Validation Rules**:
- `content` length must be ≤250 characters
- `content` must not contain implementation keywords (see research.md)
- `content` must reference at least one PR or issue
- `content` must follow markdown formatting (no raw HTML)
- `version_section` must be valid Semver or `[Unreleased]`

**State Transitions**:
```
initial (created) 
  → validated (passes all rules) 
  → compliant
    OR
  → non_compliant (fails one+ rules)
    → release_review (maintainer manually checks)
    → compliant (approved)
      OR
      → rejected (requires refactoring)
```

---

### Entity: ValidationRule

Represents a single quality validation criterion applied to changelog entries.

**Fields**:
- `rule_id` (string): Unique identifier (e.g., `CHK_MAX_LENGTH`, `CHK_NO_IMPL_DETAILS`)
- `rule_name` (string): Human-readable name (e.g., "Maximum entry length")
- `description` (string): What the rule checks
- `dimension` (enum): `completeness` | `clarity` | `consistency` | `measurability` (from 8-dimension framework)
- `severity` (enum): `critical` | `high` | `medium` | `low`
- `validation_logic` (string): Algorithm description (implementation in contracts/)
- `error_message` (string): User-facing failure message
- `examples` (object): `{ pass: string[], fail: string[] }` (example entries that pass/fail)

**Validation Rules Catalog**:

| Rule ID | Name | Severity | Logic |
|---------|------|----------|-------|
| `CHK_MAX_LENGTH` | Maximum entry length | critical | `length(content) <= 250 chars` |
| `CHK_NO_IMPL_DETAILS` | No implementation jargon | critical | keyword matching against banned list |
| `CHK_HAS_PR_LINK` | PR link present | critical | regex match `#\d+` or `#\d+-\d+` |
| `CHK_FORMAT_MARKDOWN` | Valid markdown | high | no raw HTML; valid syntax |
| `CHK_CONSISTENT_TENSE` | Consistent verb tense | medium | detect tense changes (present vs. past) |
| `CHK_NO_ABBREVIATIONS` | No unexplained abbreviations | medium | flag 2+ uppercase consecutive letters |
| `CHK_UNIQUE_CONTENT` | No duplicate entries | high | compare content hashes; flag near-duplicates |
| `CHK_LINK_VALIDITY` | All links resolve | high | HTTP GET validation; GitHub API check |

---

### Entity: MetricsSnapshot

Represents compliance metrics captured at a point in time.

**Fields**:
- `snapshot_id` (string): Unique identifier (e.g., `2026-09-12T00:00:00Z`)
- `timestamp` (ISO 8601): When metrics were captured
- `snapshot_period` (string): `daily` | `weekly` | `monthly` (for trend analysis)
- `total_entries` (integer): Count of all entries in [Unreleased]
- `compliant_entries` (integer): Count passing all rules
- `compliance_percent` (number): `(compliant_entries / total_entries) * 100`
- `length_distribution` (object):
  ```json
  {
    "0_to_100": integer,
    "100_to_250": integer,
    "250_to_500": integer,
    "500_plus": integer
  }
  ```
- `impl_detail_rate` (number): % of entries flagged with implementation details
- `pr_link_coverage` (number): % of entries with valid PR links
- `issues_found` (object): `{ rule_id: count, ... }` (violations by rule)
- `trend_vs_previous` (object): `{ compliance_delta: number, entries_added: integer, entries_refactored: integer }`

**Data Model**:
```json
{
  "snapshot_id": "2026-09-12T00:00:00Z",
  "timestamp": "2026-09-12T00:00:00Z",
  "snapshot_period": "daily",
  "total_entries": 185,
  "compliant_entries": 176,
  "compliance_percent": 95.1,
  "length_distribution": {
    "0_to_100": 12,
    "100_to_250": 164,
    "250_to_500": 8,
    "500_plus": 1
  },
  "impl_detail_rate": 3.2,
  "pr_link_coverage": 98.9,
  "issues_found": {
    "CHK_MAX_LENGTH": 1,
    "CHK_NO_IMPL_DETAILS": 6,
    "CHK_HAS_PR_LINK": 2
  },
  "trend_vs_previous": {
    "compliance_delta": 2.1,
    "entries_added": 8,
    "entries_refactored": 3
  }
}
```

---

### Entity: ValidationReport

Generated when changelog is validated (e.g., on PR submission).

**Fields**:
- `report_id` (string): Unique identifier (e.g., `validation_2026-09-12_pr2904`)
- `timestamp` (ISO 8601): When validation ran
- `trigger` (string): `pr_submission` | `scheduled_audit` | `manual`
- `pr_number` (integer | null): Associated PR if triggered by PR
- `branch` (string): Git branch being validated
- `entries_validated` (ChangelogEntry[]): Array of validated entries
- `summary` (object):
  ```json
  {
    "total_entries": integer,
    "passed": integer,
    "failed": integer,
    "review_required": integer,
    "pass_rate": number
  }
  ```
- `failed_entries` (array): Details on each failure
- `recommendation` (enum): `merge` | `review` | `request_changes`
- `ci_gate_result` (enum): `pass` | `fail` | `warning`

---

## Entity Relationships

```
ChangelogEntry
  ├── references ValidationRule (many-to-many; each entry checked against all rules)
  ├── generates ValidationReport (one-to-many; entry appears in multiple reports)
  └── contributes to MetricsSnapshot (one-to-many; entry metrics aggregated)

ValidationRule
  ├── evaluated in ValidationReport (one-to-many)
  └── tracked in MetricsSnapshot (via issues_found)

ValidationReport
  ├── aggregated into MetricsSnapshot (snapshot summarizes reports over time period)
  └── triggers GitHub Actions workflows (approval/rejection flow)

MetricsSnapshot
  └── stores historical trend data (90-day rolling window)
```

---

## State Machines

### ChangelogEntry Compliance Flow

```
Entry Created
    ↓
[Validation Gate Runs]
    ↓
All Rules Pass? 
    ├─ YES → Compliant ✅
    │          (CI passes; PR can merge)
    │
    └─ NO → Non-Compliant ⚠️
             ↓
          [Requires Refactoring]
             ↓
          Entry Edited
             ↓
          [Validation Gate Re-runs]
             ↓
          All Rules Pass?
             ├─ YES → Compliant ✅
             │
             └─ NO → Review Required 🔍
                      (Maintainer decides if acceptable)
                      ↓
                      [Maintainer Approves or Requests Changes]
                      ├─ APPROVE → Compliant ✅
                      │
                      └─ REJECT → Non-Compliant ⚠️ (repeat cycle)
```

---

## Validation Workflow Sequence

```
1. PR Submitted with CHANGELOG.md changes
   ↓
2. GitHub Actions Workflow: changelog-validate.yml triggered
   ↓
3. Load ChangelogEntry objects from CHANGELOG.md
   ↓
4. For each entry, evaluate ValidationRules:
   ├─ CHK_MAX_LENGTH
   ├─ CHK_NO_IMPL_DETAILS
   ├─ CHK_HAS_PR_LINK
   ├─ CHK_FORMAT_MARKDOWN
   ├─ CHK_CONSISTENT_TENSE
   ├─ CHK_NO_ABBREVIATIONS
   ├─ CHK_UNIQUE_CONTENT
   └─ CHK_LINK_VALIDITY
   ↓
5. Generate ValidationReport
   ├─ Compliant: CI passes ✅
   ├─ Non-Compliant: CI fails with specific error message ❌
   └─ Review Required: CI warns with maintainer assignment 🔍
   ↓
6. [If non-compliant] 
   → Comment on PR with:
     - Failed rules
     - Example compliant entry
     - Link to documentation
   ↓
7. Developer addresses feedback; pushes new commit
   ↓
8. Workflow re-runs automatically
```

---

## Constraints & Assumptions

**Constraints**:
- Maximum entry count per snapshot: 500 (soft cap for performance)
- Metrics recalculation must complete in <1 minute
- JSON history files must stay <10MB (implement rolling retention)
- API calls must respect GitHub rate limits (5k/hour)

**Assumptions**:
- CHANGELOG.md format remains consistent (Keep a Changelog 1.1.0)
- GitHub API remains available (99.95% SLA)
- Git repository history is immutable (no force pushes to CHANGELOG.md)
- Developers have write access to PR branches
- Maintainers have administrative access for approvals

---

## Phase 1 Complete

Data model defined with 4 core entities, validation rules, state transitions, and metrics schema. Ready for contract definition.

**Next**: Generate contracts/ (validation rule contract, metrics API contract) and quickstart.md

---
file_type: documentation
title: Issue Maintenance Scripts — OPENSPEC
description: Formal specification for automated issue maintenance CLI scripts managing meta: and status: labels
version: 1.0.0
created_date: 2026-08-10
last_updated: 2026-08-10
authors:
  - lightspeedwp/maintainers
tags:
  - openspec
  - specification
  - issue-maintenance
---

# Issue Maintenance Scripts — OPENSPEC

**Document ID:** `issue-maintenance-scripts-openspec`  
**Version:** 1.0.0  
**Status:** 📋 Draft (Ready for Review)  
**Created:** 2026-08-10  
**Parent Epic:** [#1680 — Issue Metadata Triage Expansion](https://github.com/lightspeedwp/.github/issues/1680)

---

## 1. EXECUTIVE SUMMARY

### Problem Statement

Current label management for GitHub issues is largely manual:

1. **Meta labels** (`meta:needs-changelog`, `meta:has-pr`, `meta:stale`, `meta:dependabot-security`) have no automation
2. **Status labels** (`status:needs-review`, `status:needs-triage`) lack comprehensive review scripts
3. **Manual processes** are error-prone, time-consuming, and not scalable
4. **Inconsistent application** leads to governance gaps and compliance failures

### Proposed Solution

Five coordinated CLI scripts providing:

- **Automated audit** of label coverage and gaps
- **Smart label sync** based on issue state (PR status, activity, age)
- **Dry-run preview** before any changes
- **Unified orchestration** for batch operations
- **Comprehensive reporting** in JSON, CSV, Markdown formats

### Expected Outcomes

- **Coverage:** 100% of meta labels correctly applied
- **Automation:** 90%+ of label updates automated (no manual intervention)
- **Speed:** Audit all 350+ issues in <2 minutes
- **Safety:** All changes preview-able before apply
- **Documentation:** Complete CLI reference + integration guide

---

## 2. SCOPE & CONSTRAINTS

### In Scope

| Component | Items |
|-----------|-------|
| **Scripts** | 5 CLI scripts + 1 orchestrator (6 total) |
| **Labels** | 7 meta: labels, 2 status: labels |
| **Modes** | Dry-run, interactive, auto, audit |
| **Outputs** | JSON, CSV, Markdown reports |
| **Testing** | 50+ unit tests, 10+ integration tests |
| **Documentation** | 2 guides + script READMEs + examples |

### Out of Scope

- ❌ Automated label creation (use `.github/labels.yml`)
- ❌ Workflow-triggered label changes (use `labeling.yml`)
- ❌ Issue template changes (use `add-issue-template-sections.js`)
- ❌ Milestone assignment (use `MilestoneAssignmentAgent`)

### Constraints

| Constraint | Details |
|-----------|---------|
| **API Rate Limit** | 5,000 requests/hour (GitHub API v3) |
| **Pagination** | Handle 350+ issues with pagination |
| **Performance** | Complete full audit in <2 minutes |
| **Safety** | All changes must be preview-able |
| **Backward Compat** | No breaking changes to existing labels |
| **Dependencies** | Reuse existing label-management utilities |

---

## 3. SCRIPT SPECIFICATIONS

### 3.1 Script: `review-meta-labels.js`

**Purpose:** Audit and report on meta label coverage  
**Location:** `scripts/automation/review-meta-labels.js`  
**Invocation:** `node scripts/automation/review-meta-labels.js [options]`

#### 3.1.1 Functionality

**Core Operations:**

1. Fetch all open issues (paginated)
2. Analyze each issue for meta label coverage
3. Group by meta label category
4. Generate audit report
5. Identify gaps and recommendations

**Labels Audited:**

- `meta:needs-changelog` — Issue/PR needs changelog entry
- `meta:no-changelog` — Issue/PR doesn't need changelog
- `meta:has-pr` — Issue has linked open PR
- `meta:no-issue-activity` — No activity in 30+ days
- `meta:no-pr-activity` — PR has no activity in 30+ days
- `meta:stale` — Marked stale for potential archiving
- `meta:dependabot-security` — Dependabot security update eligible for automation

#### 3.1.2 CLI Interface

```bash
# Full audit
node scripts/automation/review-meta-labels.js --audit

# Specific label audit
node scripts/automation/review-meta-labels.js --label meta:needs-changelog

# Multiple labels
node scripts/automation/review-meta-labels.js --labels meta:has-pr,meta:stale

# Export CSV
node scripts/automation/review-meta-labels.js --audit --format csv --output ./report.csv

# Export JSON
node scripts/automation/review-meta-labels.js --audit --format json --output ./report.json

# Verbose output
node scripts/automation/review-meta-labels.js --audit --verbose
```

#### 3.1.3 Output Format

**JSON Report:**

```json
{
  "audit_date": "2026-08-10T19:00:00Z",
  "total_issues_analyzed": 352,
  "meta_labels": {
    "meta:needs-changelog": {
      "count": 12,
      "percentage": 3.4,
      "issues": [1710, 1711, 1712, ...],
      "recommendations": [
        "Apply to PR #1710 (missing changelog entry)",
        "Apply to PR #1711 (scope: major)",
        "Remove from issue #1705 (merged PR)"
      ]
    },
    "meta:has-pr": {
      "count": 89,
      "percentage": 25.3,
      "stale_pr_links": 5,
      "broken_pr_links": 3,
      "recommendations": [
        "Remove from issue #1700 (PR closed)",
        "Update issue #1701 (add PR #1710 link)",
        "Verify #1702 (PR status unclear)"
      ]
    },
    "meta:stale": {
      "count": 23,
      "percentage": 6.5,
      "archived_count": 15,
      "recommendations": [
        "Archive 15 stale issues",
        "Remove stale label from 5 with recent activity",
        "Post warning comment on 3 about-to-archive"
      ]
    }
  },
  "summary": {
    "total_gaps": 127,
    "coverage_percentage": 63.8,
    "top_gaps": [
      {
        "label": "meta:needs-changelog",
        "missing_count": 45,
        "impact": "high"
      }
    ]
  }
}
```

#### 3.1.4 Success Criteria

- [ ] Analyzes 350+ issues in <2 minutes
- [ ] Identifies all 7 meta labels correctly
- [ ] Generates JSON, CSV, Markdown reports
- [ ] Handles pagination correctly
- [ ] Provides actionable recommendations
- [ ] 15+ unit tests
- [ ] 80%+ code coverage

---

### 3.2 Script: `sync-pr-labels.js`

**Purpose:** Auto-sync `meta:has-pr` label based on actual PR links  
**Location:** `scripts/automation/sync-pr-labels.js`

#### 3.2.1 Functionality

**Core Operations:**

1. Fetch all issues with `meta:has-pr` label
2. Check if linked PR still exists and is open
3. Apply/remove label based on actual state
4. Report changes made

**Label Rules:**

- **Apply `meta:has-pr`** when:
  - Issue has PR link in description or comments
  - Linked PR is open (not merged, not closed)
  
- **Remove `meta:has-pr`** when:
  - No PR link found
  - Linked PR is merged or closed

#### 3.2.2 CLI Interface

```bash
# Dry-run (show changes without applying)
node scripts/automation/sync-pr-labels.js --dry-run

# Apply changes
node scripts/automation/sync-pr-labels.js

# Specific issue
node scripts/automation/sync-pr-labels.js --issue 1710

# Issues with meta:has-pr (sync these)
node scripts/automation/sync-pr-labels.js --sync-labeled

# Interactive mode (confirm each change)
node scripts/automation/sync-pr-labels.js --interactive

# Verbose output
node scripts/automation/sync-pr-labels.js --verbose
```

#### 3.2.3 Output Format

```json
{
  "sync_date": "2026-08-10T19:00:00Z",
  "mode": "dry-run",
  "changes": {
    "add_label": [
      {
        "issue_number": 1710,
        "reason": "Found open PR #1720 in description",
        "pr_link": "#1720"
      }
    ],
    "remove_label": [
      {
        "issue_number": 1705,
        "reason": "Linked PR #1715 is merged",
        "pr_status": "merged"
      }
    ],
    "skip": [
      {
        "issue_number": 1708,
        "reason": "Label already correct (PR #1718 open)"
      }
    ]
  },
  "summary": {
    "total_processed": 89,
    "to_add": 3,
    "to_remove": 2,
    "correct": 84,
    "skipped": 0
  }
}
```

#### 3.2.4 Success Criteria

- [ ] Processes 350+ issues in <2 minutes
- [ ] Correctly identifies PR status (open/merged/closed)
- [ ] Dry-run matches actual changes
- [ ] Handles concurrent API calls with rate limiting
- [ ] Reports all changes before applying
- [ ] 12+ unit tests
- [ ] 80%+ code coverage

---

### 3.3 Script: `manage-stale-issues.js`

**Purpose:** Apply `meta:stale` label and optionally auto-archive inactive issues  
**Location:** `scripts/automation/manage-stale-issues.js`

#### 3.3.1 Functionality

**Core Operations:**

1. Find issues with no activity for N days (default 30)
2. Apply `meta:stale` label
3. Optionally post warning comment
4. Optionally close and archive
5. Report actions taken

**Activity Definition:**

- Last comment
- Last status change
- Last label change
- Last issue edit

**Exclusions** (don't mark stale):

- Issues with `type:epic` (long-running)
- Issues with `status:in-progress` (actively worked)
- Issues with `priority:critical` (security/urgent)
- Issues in a milestone (planned work)

#### 3.3.2 CLI Interface

```bash
# Dry-run (show which issues would be marked)
node scripts/automation/manage-stale-issues.js --dry-run --days 30

# Apply stale label
node scripts/automation/manage-stale-issues.js --days 30

# Apply + post warning comment
node scripts/automation/manage-stale-issues.js --days 30 --warn

# Apply + auto-close (archive)
node scripts/automation/manage-stale-issues.js --days 30 --close

# Full lifecycle (warn then close in 7 days)
node scripts/automation/manage-stale-issues.js --days 30 --warn --close

# Exclude certain types
node scripts/automation/manage-stale-issues.js --days 30 --exclude type:epic,status:in-progress

# Verbose output
node scripts/automation/manage-stale-issues.js --days 30 --verbose
```

#### 3.3.3 Output Format

```json
{
  "operation": "mark-stale",
  "parameters": {
    "inactivity_days": 30,
    "post_warning": true,
    "auto_close": false
  },
  "execution_date": "2026-08-10T19:00:00Z",
  "results": {
    "marked_stale": [
      {
        "issue_number": 1600,
        "last_activity": "2026-07-10T10:00:00Z",
        "days_inactive": 31,
        "comment_posted": true
      }
    ],
    "already_stale": 15,
    "skipped": [
      {
        "issue_number": 1650,
        "reason": "Issue in active milestone"
      }
    ]
  },
  "summary": {
    "total_scanned": 352,
    "marked": 8,
    "already_stale": 15,
    "skipped": 329,
    "comments_posted": 8,
    "closed": 0
  }
}
```

#### 3.3.4 Success Criteria

- [ ] Finds all inactive issues correctly (30+ day threshold)
- [ ] Respects exclusion rules (epic, in-progress, critical, milestone)
- [ ] Posts warning comments with clear language
- [ ] Auto-closes with appropriate closure message
- [ ] Dry-run accurately predicts changes
- [ ] Handles timezone-aware timestamps
- [ ] 12+ unit tests
- [ ] 80%+ code coverage

---

### 3.4 Script: `review-status-labels.js`

**Purpose:** Audit `status:needs-review` and `status:needs-triage` labels  
**Location:** `scripts/automation/review-status-labels.js`

#### 3.4.1 Functionality

**Core Operations:**

1. Fetch all issues with status labels
2. Analyze by category
3. Identify age in status
4. Find blockers and dependencies
5. Generate audit report

**Status Labels:**

- `status:needs-review` — Awaiting peer review
- `status:needs-triage` — Awaiting initial triage
- `status:in-progress` — Being actively worked
- `status:in-discussion` — Under discussion
- `status:blocked` — Blocked by dependency
- `status:done` — Complete

#### 3.4.2 CLI Interface

```bash
# Full audit
node scripts/automation/review-status-labels.js --audit

# Specific status
node scripts/automation/review-status-labels.js --status needs-review

# Show issues over N days old
node scripts/automation/review-status-labels.js --status needs-review --days 7

# Find blockers
node scripts/automation/review-status-labels.js --blockers

# Export findings
node scripts/automation/review-status-labels.js --audit --format json --output ./findings.json

# Verbose
node scripts/automation/review-status-labels.js --audit --verbose
```

#### 3.4.3 Output Format

```json
{
  "audit_date": "2026-08-10T19:00:00Z",
  "status_labels": {
    "status:needs-review": {
      "count": 5,
      "age_analysis": {
        "fresh_0_3_days": 2,
        "pending_3_7_days": 2,
        "overdue_7_days": 1
      },
      "assignment_status": {
        "assigned": 3,
        "unassigned": 2
      },
      "oldest_issue": {
        "number": 1690,
        "days_in_status": 14,
        "assignees": ["@reviewer1"]
      }
    },
    "status:needs-triage": {
      "count": 19,
      "age_analysis": {
        "fresh_0_3_days": 10,
        "pending_3_7_days": 6,
        "overdue_7_days": 3
      },
      "blockers": [
        {
          "blocker_issue": 1680,
          "blocked_count": 5,
          "reason": "Epic not started"
        }
      ]
    }
  },
  "recommendations": [
    "Review issue #1690 (14 days pending review)",
    "Assign triage owner to 3 overdue issues",
    "Unblock 5 issues waiting on epic #1680"
  ]
}
```

#### 3.4.4 Success Criteria

- [ ] Analyzes 350+ issues in <2 minutes
- [ ] Correctly categorizes by status
- [ ] Identifies age in each status
- [ ] Finds blocker relationships
- [ ] Generates actionable recommendations
- [ ] 12+ unit tests
- [ ] 80%+ code coverage

---

### 3.5 Script: `label-orchestrator.js`

**Purpose:** Unified CLI for all label management operations  
**Location:** `scripts/automation/label-orchestrator.js`

#### 3.5.1 Functionality

**Core Modes:**

- **Audit** — Run all audits (meta, status, coverage)
- **Sync** — Run all sync operations (PR labels, stale markers)
- **Apply** — Execute all changes (in batch)
- **Report** — Generate comprehensive report

#### 3.5.2 CLI Interface

```bash
# Run all audits
node scripts/automation/label-orchestrator.js audit --all

# Run specific audit
node scripts/automation/label-orchestrator.js audit meta
node scripts/automation/label-orchestrator.js audit status

# Dry-run all changes
node scripts/automation/label-orchestrator.js sync --dry-run

# Apply all changes (with confidence threshold)
node scripts/automation/label-orchestrator.js apply --confidence 0.9

# Interactive mode (confirm each change)
node scripts/automation/label-orchestrator.js apply --interactive

# Generate report
node scripts/automation/label-orchestrator.js report --all --format html --output ./report.html

# Verbose
node scripts/automation/label-orchestrator.js audit --all --verbose
```

#### 3.5.3 Output Format

```json
{
  "orchestration_date": "2026-08-10T19:00:00Z",
  "mode": "audit",
  "operations": [
    {
      "name": "review-meta-labels",
      "status": "completed",
      "duration_ms": 45000,
      "results": {
        "total_issues": 352,
        "coverage": 63.8
      }
    },
    {
      "name": "sync-pr-labels",
      "status": "completed",
      "duration_ms": 32000,
      "changes": {
        "to_add": 3,
        "to_remove": 2
      }
    }
  ],
  "summary": {
    "total_duration_ms": 127000,
    "operations_completed": 4,
    "operations_failed": 0,
    "issues_affected": 8,
    "total_changes": 5
  }
}
```

#### 3.5.4 Success Criteria

- [ ] Orchestrates all 4 scripts seamlessly
- [ ] Supports all modes (audit, sync, apply, report)
- [ ] Provides clear progress feedback
- [ ] Handles partial failures gracefully
- [ ] Generates unified summary report
- [ ] 8+ unit tests
- [ ] 80%+ code coverage

---

## 4. DATA STRUCTURES & INTERFACES

### 4.1 Label Object

```typescript
interface Label {
  name: string;               // "meta:needs-changelog"
  color: string;              // "D0D7DE"
  description: string;        // "Requires a changelog entry"
  is_meta: boolean;           // true
  category: string;           // "meta"
  auto_managed?: boolean;     // true if script-managed
}
```

### 4.2 Issue Object (for labeling)

```typescript
interface IssueForLabeling {
  number: number;
  title: string;
  body: string;
  labels: string[];
  assignees: string[];
  milestone?: string;
  linked_pr?: number;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
  age_days: number;
  inactivity_days: number;
}
```

### 4.3 Recommendation Object

```typescript
interface Recommendation {
  issue_number: number;
  action: "add_label" | "remove_label" | "keep";
  label: string;
  reason: string;
  confidence: number;  // 0.0-1.0
  metadata?: any;
}
```

---

## 5. IMPLEMENTATION REQUIREMENTS

### 5.1 File Structure

```
scripts/automation/
├── review-meta-labels.js
├── sync-pr-labels.js
├── manage-stale-issues.js
├── review-status-labels.js
├── label-orchestrator.js
├── includes/
│   ├── label-management.js (new utility)
│   ├── github-api-client.js (reuse existing)
│   ├── report-generator.js (new utility)
│   ├── activity-analyzer.js (new utility)
│   └── pr-link-parser.js (new utility)
└── __tests__/
    ├── review-meta-labels.test.js
    ├── sync-pr-labels.test.js
    ├── manage-stale-issues.test.js
    ├── review-status-labels.test.js
    ├── label-orchestrator.test.js
    └── includes/
        ├── label-management.test.js
        ├── report-generator.test.js
        └── activity-analyzer.test.js
```

### 5.2 Reusable Utilities

#### `label-management.js`

```javascript
export class LabelManager {
  async fetchIssuesWithLabel(label, { limit = 100 } = {});
  async addLabel(issueNumber, label);
  async removeLabel(issueNumber, label);
  async hasLabel(issueNumber, label);
  async syncLabels(issueNumber, expectedLabels);
}
```

#### `report-generator.js`

```javascript
export class ReportGenerator {
  generateJSON(data);
  generateCSV(data);
  generateMarkdown(data);
  generateHTML(data);
  export(format, outputPath);
}
```

#### `activity-analyzer.js`

```javascript
export class ActivityAnalyzer {
  getLastActivityDate(issue);
  getDaysSinceActivity(issue);
  isStale(issue, thresholdDays);
  hasRecentChange(issue, type, thresholdDays);
}
```

### 5.3 Dependencies

**Existing (reuse):**

- `octokit` — GitHub API
- `jest` — Testing
- `glob` — File matching
- `js-yaml` — YAML parsing

**New (install):**

- `json2csv` — JSON to CSV conversion (if not exists)
- `chalk` — Colored CLI output
- `ora` — Spinner/progress indicators

### 5.4 Error Handling

All scripts must handle:

- ✅ GitHub API rate limiting
- ✅ Network timeouts
- ✅ Invalid issue numbers
- ✅ Missing labels
- ✅ Pagination errors
- ✅ Malformed issue content
- ✅ Concurrent modification errors

---

## 6. TESTING STRATEGY

### 6.1 Unit Tests

**Coverage Target:** 80%+ across all scripts

| Script | Unit Tests | Target |
|--------|-----------|--------|
| `review-meta-labels.js` | 15+ | 85% |
| `sync-pr-labels.js` | 12+ | 85% |
| `manage-stale-issues.js` | 12+ | 85% |
| `review-status-labels.js` | 12+ | 80% |
| `label-orchestrator.js` | 8+ | 80% |
| **Utilities** | 20+ | 85% |
| **Total** | 79+ | 82% |

### 6.2 Integration Tests

- Mock GitHub API responses
- Test with 50-100 sample issues
- Verify dry-run vs. apply mode consistency
- Test rate limiting and pagination
- Validate all output formats (JSON, CSV, Markdown)

### 6.3 Manual Validation

- Dry-run against real repository (non-destructive)
- Spot-check 10+ issues for accuracy
- Verify confidence scoring
- Validate recommendation logic

---

## 7. WORKFLOW INTEGRATION

### 7.1 Scheduled Workflows

**`meta-labels-sync.yml`**

```yaml
on:
  schedule:
    - cron: '0 3 * * *'  # Daily 3 AM UTC
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Sync PR labels
        run: node scripts/automation/sync-pr-labels.js
      - name: Manage stale issues
        run: node scripts/automation/manage-stale-issues.js --days 30
```

**`label-audit-report.yml`**

```yaml
on:
  schedule:
    - cron: '0 4 1 * *'  # Monthly, 4 AM UTC on 1st
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Generate audit report
        run: node scripts/automation/label-orchestrator.js audit --all --format html
      - name: Post report
        uses: actions/upload-artifact@v4
        with:
          name: label-audit-report
          path: ./label-audit-report.html
```

---

## 8. SUCCESS CRITERIA & METRICS

### 8.1 Functional Success

- [ ] All 5 scripts operational and tested
- [ ] All 3 output formats working (JSON, CSV, Markdown)
- [ ] All modes supported (dry-run, interactive, auto)
- [ ] Rate limiting handled correctly
- [ ] Pagination works for 350+ issues
- [ ] Error handling comprehensive
- [ ] Rollback capability (dry-run shows intent)

### 8.2 Quality Metrics

- [ ] 80%+ code coverage (50+ unit tests)
- [ ] 10+ integration tests passing
- [ ] Zero critical security issues
- [ ] All edge cases handled
- [ ] Performance: <2 minutes for full audit
- [ ] Error messages clear and actionable

### 8.3 Automation Metrics

After deployment:

- [ ] 95%+ of `meta:has-pr` labels auto-synced
- [ ] 100% of stale issues flagged within 24 hours
- [ ] 0 manual label updates needed (post-automation)
- [ ] 100% of audit reports generated on schedule
- [ ] <5% false positive rate on recommendations

---

## 9. ROLLOUT PLAN

### Phase 1: Development & Testing (Days 1-2)

- [ ] Implement all 5 scripts
- [ ] Write 50+ unit tests
- [ ] Dry-run against production (read-only)
- [ ] Validate output formats
- [ ] Performance testing

### Phase 2: Dry-Run Validation (Day 3)

- [ ] Run full audit (no changes)
- [ ] Team spot-checks 10+ issues
- [ ] Verify recommendations accuracy
- [ ] Manual review of edge cases

### Phase 3: Limited Rollout (Day 4)

- [ ] Apply to 50 sample issues
- [ ] Monitor for issues
- [ ] Gather feedback
- [ ] Refine recommendations

### Phase 4: Full Deployment (Day 5+)

- [ ] Deploy to production
- [ ] Schedule automated workflows
- [ ] Monitor label consistency
- [ ] Track automation metrics

---

## 10. DEPENDENCIES & BLOCKERS

**Dependencies:**

- ✅ GitHub API access (exists)
- ✅ GitHub token (exists)
- ✅ Existing label management utilities
- ✅ Jest test framework

**Blockers:** None identified

**Risks:**

- Low: Architecture mirrors existing triage system
- Low: Test framework established
- Medium: Need to handle concurrent API calls carefully

---

## 11. RELATED DOCUMENTATION

**Parent Epic:**

- [#1680 — Issue Metadata Triage Expansion](https://github.com/lightspeedwp/.github/issues/1680)

**Related Specs:**

- [issue-metadata-triage-expansion/OPENSPEC.md](../issue-metadata-triage-expansion/OPENSPEC.md)
- `docs/LABEL_STRATEGY.md` — Label taxonomy
- `.github/labels.yml` — Canonical label definitions
- `docs/ISSUE_TRIAGE_AUTOMATION.md` — Existing triage system

**Reference Scripts:**

- `scripts/automation/audit-issue-metadata.js` (Phase 1 of triage)
- `scripts/automation/add-issue-template-sections.js` (template fixing)
- `scripts/agents/labeling.agent.js` (existing label agent)

---

## 12. DOCUMENT METADATA

| Field | Value |
|-------|-------|
| **Spec ID** | `issue-maintenance-scripts-openspec` |
| **Version** | 1.0.0 |
| **Status** | 📋 Draft |
| **Created** | 2026-08-10 |
| **Owner** | Ash Shaw |
| **Next Review** | After Phase 1 implementation |

---

**Spec Owner:** Ash Shaw  
**Created:** 2026-08-10  
**Status:** 📋 Draft (Ready for Team Review)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

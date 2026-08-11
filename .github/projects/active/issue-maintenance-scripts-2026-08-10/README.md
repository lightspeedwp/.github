---
file_type: readme
title: Automated Issue Maintenance Scripts for Meta Labels & Status Review
description: "Create dedicated CLI scripts for reviewing, validating, and maintaining meta: labels (needs-changelog, has-pr, stale, dependabot-security) and status: labels (needs-review, needs-triage)"
version: 1.0.0
created_date: 2026-08-10
last_updated: 2026-08-10
authors:
  - lightspeedwp/maintainers
tags:
  - automation
  - issue-maintenance
  - label-management
  - governance
  - scripts
---

# Issue Maintenance Scripts — Meta Label Automation

**Status:** 🟡 Planning | **Start:** 2026-08-10 | **Related Epic:** #1680 (Issue Metadata Triage Expansion)

Develop dedicated CLI scripts to automate review, validation, and management of issue metadata labels. Focus on `meta:*` label categories that currently lack automation, plus enhancement of existing `status:*` label handlers.

## Quick Overview

### Problem Statement

- ❌ No automated scripts for reviewing `meta:needs-changelog`, `meta:has-pr`, `meta:stale`, `meta:dependabot-security`
- ❌ Manual label management error-prone and time-consuming
- ❌ Inconsistent label application across issue lifecycle
- ✅ Infrastructure exists for other label categories (`status:*`, `type:*`, `area:*`)

### Solution

Create 5 coordinated CLI scripts:

1. **`review-meta-labels.js`** — Audit and report on meta: label coverage
2. **`sync-pr-labels.js`** — Auto-update `meta:has-pr` based on linked PRs
3. **`manage-stale-issues.js`** — Auto-apply `meta:stale`, handle archiving
4. **`review-status-labels.js`** — Audit `status:needs-review` and `status:needs-triage`
5. **`label-orchestrator.js`** — Unified CLI for all label management operations

### Success Metrics

- ✅ 100% of open issues have correct `meta:*` labels
- ✅ `meta:needs-changelog` auto-updated on PR creation/merge
- ✅ `meta:has-pr` auto-synced to reflect real PR status
- ✅ `meta:stale` auto-applied after 30 days inactivity
- ✅ All scripts support `--dry-run`, `--interactive`, `--auto` modes
- ✅ 80%+ code coverage
- ✅ Zero manual label management overhead

---

## Detailed Scope

### Phase 1: Meta Label Scripts (2-3 days)

#### Script 1.1: `review-meta-labels.js`

**Purpose:** Audit meta label coverage and identify gaps

**Functionality:**

```bash
# Audit mode — generate report
node scripts/automation/review-meta-labels.js --audit --output ./reports/

# Specific label report
node scripts/automation/review-meta-labels.js --label meta:needs-changelog

# Export as CSV
node scripts/automation/review-meta-labels.js --format csv --output ./audit.csv
```

**Output:**

```json
{
  "audit_date": "2026-08-10T19:00:00Z",
  "meta_labels": {
    "meta:needs-changelog": {
      "count": 12,
      "issues": [1710, 1711, 1712],
      "coverage": "4.2%",
      "recommendations": ["Apply to PRs missing changelog entry"]
    },
    "meta:has-pr": {
      "count": 89,
      "stale": 5,
      "missing_pr": 3,
      "recommendations": ["Sync with actual PR status"]
    },
    "meta:stale": {
      "count": 23,
      "archived": 15,
      "recent_activity": 8,
      "recommendations": ["Remove from active issues"]
    }
  }
}
```

#### Script 1.2: `sync-pr-labels.js`

**Purpose:** Automatically manage `meta:has-pr` label based on linked PRs

**Functionality:**

```bash
# Dry-run: Show changes without applying
node scripts/automation/sync-pr-labels.js --dry-run

# Apply changes
node scripts/automation/sync-pr-labels.js

# Specific issue
node scripts/automation/sync-pr-labels.js --issue 1710
```

**Logic:**

- Scan all open issues
- Check for linked PRs in issue description
- If PR exists and linked: ensure `meta:has-pr` is applied
- If no PR or PR closed: remove `meta:has-pr`
- Report status and changes

#### Script 1.3: `manage-stale-issues.js`

**Purpose:** Auto-apply `meta:stale` and handle issue lifecycle

**Functionality:**

```bash
# Dry-run: preview changes
node scripts/automation/manage-stale-issues.js --dry-run --days 30

# Apply stale label
node scripts/automation/manage-stale-issues.js --days 30 --label

# Auto-close without activity
node scripts/automation/manage-stale-issues.js --days 30 --close --comment
```

**Logic:**

- Find issues with no activity for N days (default 30)
- Apply `meta:stale` label
- Optionally post warning comment
- Optionally close and archive
- Exclude issues with specific labels (e.g., `type:epic`, `status:in-progress`)

### Phase 2: Status Label Audit & Enhancement (2-3 days)

#### Script 2.1: `review-status-labels.js`

**Purpose:** Audit `status:needs-review` and `status:needs-triage`

**Functionality:**

```bash
# Full audit
node scripts/automation/review-status-labels.js --audit

# Specific status
node scripts/automation/review-status-labels.js --status needs-review --days 7

# Export findings
node scripts/automation/review-status-labels.js --format json --output ./findings.json
```

**Output:**

- Count by status label
- Age analysis (how long in status)
- Assignment status
- Blocker identification
- Recommendations

### Phase 3: Unified Orchestrator (1-2 days)

#### Script 3.1: `label-orchestrator.js`

**Purpose:** Single entry point for all label management

**Functionality:**

```bash
# Run all audits
node scripts/automation/label-orchestrator.js audit --all

# Run specific checks
node scripts/automation/label-orchestrator.js sync meta:has-pr --dry-run

# Interactive mode
node scripts/automation/label-orchestrator.js --interactive

# Full auto mode
node scripts/automation/label-orchestrator.js apply --auto --confidence 0.9
```

---

## Technical Design

### Architecture

```
scripts/automation/
├── review-meta-labels.js          # New: Meta label audit
├── sync-pr-labels.js              # New: PR label sync
├── manage-stale-issues.js         # New: Stale issue handler
├── review-status-labels.js        # New: Status label audit
├── label-orchestrator.js          # New: Unified CLI
├── includes/
│   ├── label-management.js        # Reuse: Core label ops
│   ├── github-api-client.js       # Reuse: API wrapper
│   └── report-generator.js        # New: Reporting utilities
└── __tests__/
    ├── review-meta-labels.test.js
    ├── sync-pr-labels.test.js
    ├── manage-stale-issues.test.js
    ├── review-status-labels.test.js
    └── label-orchestrator.test.js
```

### Reusable Components

- **label-management.js** — Abstraction for label operations (fetch, add, remove, update)
- **github-api-client.js** — Paginated GitHub API client with rate limiting
- **report-generator.js** — JSON, CSV, Markdown report generation
- **confidence-scorer.js** — Confidence scoring for recommendations

### Testing Strategy

- Unit tests for each script (50+ tests)
- Integration tests with mock GitHub API (10+ tests)
- Dry-run validation (all changes preview-able)
- Coverage target: 80%+

---

## Phased Delivery

| Phase | Component | Duration | Status |
|-------|-----------|----------|--------|
| **Phase 1** | Meta Label Scripts (3 scripts) | 2-3 days | 📋 PLANNED |
| **Phase 2** | Status Label Audit | 2-3 days | 📋 PLANNED |
| **Phase 3** | Unified Orchestrator | 1-2 days | 📋 PLANNED |
| **Phase 4** | Integration & Workflows | 1-2 days | 📋 PLANNED |
| **Phase 5** | Documentation & Validation | 1 day | 📋 PLANNED |

---

## Integration Points

### Existing Systems

- ✅ Reuse: `label-heuristics.js` (label inference)
- ✅ Reuse: `labeling.agent.js` (existing label scripts)
- ✅ Integrate: `labeling.yml` workflow (automated labeling)
- ✅ Integrate: `template-enforcement.yml` (issue validation)

### New Workflows

- GitHub workflow: `meta-labels-sync.yml` (scheduled, daily)
- GitHub workflow: `stale-issues-manager.yml` (scheduled, weekly)
- GitHub workflow: `label-audit-report.yml` (scheduled, monthly)

---

## Success Criteria

### Automation Coverage

- [ ] 100% of PRs auto-get `meta:needs-changelog` status
- [ ] 95%+ of `meta:has-pr` labels auto-synced
- [ ] 100% of stale issues flagged within 24 hours
- [ ] All `status:needs-*` issues reviewed within 48 hours

### Code Quality

- [ ] 80%+ code coverage (45+ unit tests)
- [ ] All scripts support `--dry-run` mode
- [ ] All scripts support `--interactive` mode
- [ ] All scripts support `--auto` mode with confidence scoring
- [ ] Zero critical security issues
- [ ] All edge cases handled

### Documentation

- [ ] `docs/ISSUE_MAINTENANCE_SCRIPTS.md` — System documentation
- [ ] `docs/LABEL_MANAGEMENT_CLI.md` — CLI reference
- [ ] README for each script with examples
- [ ] Integration guide for workflows

---

## Related Issues & Documentation

**Parent Epic:**

- #1680 — Issue Metadata Triage Expansion

**Related Epics:**

- #1167 — Issue Type & Metadata Automation Initiative
- #1243 — Repository Maintenance & Branch Cleanup Automation
- #449 — Label governance stabilisation and automation hardening

**Reference Documentation:**

- `docs/BRANCHING_STRATEGY.md` — Branch naming rules
- `docs/LABEL_STRATEGY.md` — Label taxonomy and prefixes
- `.github/labels.yml` — Canonical label definitions
- `docs/ISSUE_TRIAGE_AUTOMATION.md` — Related triage system

---

## Next Steps

1. ✅ Create this project directory
2. ⏳ Write detailed OPENSPEC specification
3. ⏳ Create child GitHub issues (one per phase)
4. ⏳ Implement Phase 1 (meta label scripts)
5. ⏳ Implement Phase 2 (status label audit)
6. ⏳ Create orchestrator CLI
7. ⏳ Write comprehensive documentation
8. ⏳ Create GitHub workflows for automation
9. ⏳ Integration testing and validation
10. ⏳ Deploy and monitor

---

**Project Owner:** Ash Shaw  
**Created:** 2026-08-10  
**Status:** 🟡 Planning → Specification Development

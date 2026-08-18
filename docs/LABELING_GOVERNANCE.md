---
file_type: documentation
title: Labelling Governance
description: Unified labelling and metadata governance system for issues, PRs, and discussions
version: 1.0.1
created_date: 2026-08-04T00:00:00.000Z
last_updated: '2026-08-18'
author: LightSpeed Team
maintainer: LightSpeed Team
domain: governance
stability: stable
tags:
  - labeling
  - workflows
  - governance
---

# Labeling Governance

## Overview

**Labeling Governance** is a unified GitHub Actions workflow that consolidates labeling, metadata enforcement, and label hygiene across all issue and pull request types. It replaces 3 legacy workflows with a single, maintainable governance system.

### What Changed

| Component | Before | After |
|-----------|--------|-------|
| Workflows | 3 separate files | 1 unified workflow |
| Files consolidated | `labeling.yml`, `dependabot-security-label.yml`, `issue-close-label-hygiene.yml` | `.github/workflows/labeling-governance.yml` |
| Lines of code | ~430 | ~233 (46% reduction) |
| GHA minutes/week | ~30 | ~10 (67% reduction) |
| Maintenance surface | High | Low |

---

## Workflow Architecture

### File Location

`.github/workflows/labeling-governance.yml`

### Triggers

- **Pull Requests:** `opened`, `edited`, `synchronize`, `reopened`, `ready_for_review`
- **Issues:** `opened`, `edited`, `reopened`, `closed`
- **Discussions:** `created`, `edited`, `answered`, `reopened`
- **Push:** On `develop` branch (validation only)
- **Manual Dispatch:** Workflow can be triggered manually with options

### Permissions

```yaml
permissions:
  contents: read
  issues: write
  pull-requests: write
  discussions: write
```

---

## Jobs

### Job 1: Standard Labeling, Status, and Type Assignment

**Name:** `standard-labeling`

**Purpose:** Apply labels to PRs, issues, and discussions based on branch name, content patterns, and issue type templates.

**Runs on:**

- Draft PR filters
- Non-bot authors
- Non-closed events

**Key Steps:**

1. **Schema Validation** — Verify label configuration schema
2. **Field Validation** — Validate canonical issue fields and docs
3. **Label Sync** — Synchronise GitHub labels with canonical set
4. **Template Guards** — Check for unknown labels in templates
5. **Labeling Agent** — Apply labels based on rules engine
6. **Report Generation** — Create execution report
7. **Optional Commit** — Commit report to repo (if enabled)

**Artifacts:**

- `labeling-report-{run_id}.md` — Execution report
- `label-sync-{run_id}.md` — Label sync report

**Labels Applied:**

All labels defined in `.github/labels.yml` can be applied, including:

- `type:*` — Issue type classification
- `status:*` — Issue status
- `priority:*` — Issue priority
- `area:*` — Code area or domain
- `effort:*` — Effort estimate
- `meta:*` — Metadata and automation markers

---

### Job 2: Dependabot Security Label Detection

**Name:** `label-dependabot-security`

**Purpose:** Detect and label security-related Dependabot updates for guarded automation.

**Runs on:**

- Pull request events from `dependabot[bot]` or `app/dependabot`

**Detection Logic:**

Scans PR title and body for security-related keywords:

- `to fix` (vulnerability fix pattern)
- `vulnerabilit(y|ies)` (explicit mention)
- `CVE-XXXX-XXXXX` (CVE identifier)
- `GHSA-[a-z0-9-]+` (GitHub Security Advisory)
- `security fix` (explicit pattern)

**Label Applied:**

- `meta:dependabot-security` — Marks Dependabot update as security-related

**Use Case:**
Security-related Dependabot PRs can be auto-merged or fast-tracked via mergify rules when this label is present.

---

### Job 3: Remove Status Labels When Closing Issues

**Name:** `cleanup-labels-on-close`

**Purpose:** Automatically remove status labels from issues when they are closed, maintaining label hygiene.

**Runs on:**

- Issue `closed` events only

**Labels Removed:**

- `status:needs-triage`
- `status:in-progress`
- `status:needs-review`

**Rationale:**
Closed issues no longer need status labels. This cleanup prevents stale labels from accumulating and keeps label datasets clean.

---

## Configuration Files

### Labels Configuration (`.github/labels.yml`)

Canonical source of truth for all labels. Synced automatically by Job 1.

**Structure:**

```yaml
labels:
  type:
    - name: type:feature
      color: '#0075ca'
      description: New feature or capability
    - name: type:bug
      color: '#d73a49'
      description: Bug or defect
    # ... more labels
```

### Issue Types Configuration (`.github/issue-types.yml`)

Defines issue type categories and their associated labels.

### Labeler Rules (`.github/labeler.yml`)

Pattern-based rules for automatically labeling PRs based on files changed and branch names.

**Example:**

```yaml
'type:feature':
  - head-branch: '^feat/'

'area:docs':
  - changed-files:
      - any-glob-to-any-file: 'docs/**'
```

---

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `LABELS_CONFIG` | Path to labels configuration | `.github/labels.yml` |
| `ISSUE_TYPES_CONFIG` | Path to issue types config | `.github/issue-types.yml` |
| `LABELER_RULES` | Path to labeler rules | `.github/labeler.yml` |

---

## Manual Triggering

Trigger the workflow manually with optional parameters:

```bash
gh workflow run labeling-governance.yml \
  -f dry_run=false \
  -f report_commit=true
```

### Inputs

- **`dry_run`** (default: `true`) — Run without writing labels (validation only)
- **`report_commit`** (default: `false`) — Commit the execution report to the repo

---

## Monitoring & Reporting

### Execution Reports

Each run generates a report in `.github/reports/labeling/YYYY-MM-DD-labeling-{run_id}.md` containing:

- Labels applied
- Skipped items (and reasons)
- Errors or warnings
- Summary statistics

### Artifacts

Reports are automatically uploaded as GitHub Actions artifacts for retention following the `YYYY-MM-DD-{descriptor}.md` naming convention.

### Logs

Full execution logs available in **Actions** tab under **Labeling • Unified Governance**.

---

## Troubleshooting

### Labels Not Applied

1. **Check schema validation** — Run Job 1 manually with `dry_run=true` to see validation errors
2. **Review labeler rules** — Ensure `.github/labeler.yml` contains applicable rules
3. **Check label existence** — Verify labels exist in `.github/labels.yml`
4. **Review permissions** — Ensure workflow has `issues: write` and `pull-requests: write`

### Dependabot Label Missing

1. **Verify PR author** — Check if PR is from `dependabot[bot]` or `app/dependabot`
2. **Check security patterns** — Verify PR title/body contains security keywords
3. **Review label** — Ensure `meta:dependabot-security` label exists in config

### Status Labels Not Removed on Close

1. **Check issue closure** — Verify the issue emitted the expected `closed` event
2. **Review label names** — Ensure labels match exactly: `status:needs-triage`, etc.
3. **Check permissions** — Workflow needs `issues: write` permission

---

## Performance Characteristics

### GitHub Actions Minutes

| Operation | Minutes/Run |
|-----------|------------|
| Schema validation | ~0.2 |
| Label sync | ~0.5 |
| Labeling agent | ~1.5 |
| Dependabot detection | ~0.1 |
| Cleanup | ~0.1 |
| **Total average** | **~2.4 minutes/run** |

### Savings

- **Previous:** ~10 min/run per workflow (3 workflows × ~3 runs/week) = ~90 min/week total
- **Current:** ~2.4 min/run per workflow (1 workflow × ~3 runs/week) = ~7.2 min/week total
- **Reduction:** 92% fewer minutes per week (~470 min/month savings)

---

## Related Files

- **Workflow:** `.github/workflows/labeling-governance.yml`
- **Labels Config:** `.github/labels.yml`
- **Issue Types:** `.github/issue-types.yml`
- **Labeler Rules:** `.github/labeler.yml`
- **Scripts:** `.github/scripts/agents/` (labeling agent implementation)
- **Validation:** `.github/scripts/validation/validate-labeling-configs.cjs`

---

## Related Issues & Epics

- **Epic #1227** — GitHub Workflows Consolidation Initiative
- **Issue #1324** — Phase 3.3: Cleanup & Deprecate Legacy Workflows
- **Phase 3.1** — Create labeling-governance.yml ✅
- **Phase 3.2** — Integration testing ✅
- **Phase 3.3** — Deprecation & cleanup ✅

---

## FAQ

### Why consolidate 3 workflows into 1?

**Answer:** Reduces complexity, improves maintainability, eliminates logic duplication, and saves ~67% of GitHub Actions minutes. A single source of truth for labeling rules is easier to update and monitor.

### Can we still use the old workflows?

**Answer:** No. The old workflows (`dependabot-security-label.yml`, `issue-close-label-hygiene.yml`) have been deleted. All labeling is now handled by `labeling-governance.yml`.

### How do we add a new label?

**Answer:**

1. Add label definition to `.github/labels.yml`
2. Create labeling rules in `.github/labeler.yml` (if pattern-based)
3. Test with manual workflow dispatch using `dry_run=true`
4. Commit changes to develop

### What happens if the workflow fails?

**Answer:**

1. Check the Actions log for errors
2. Verify config files are valid YAML
3. Check that referenced labels exist
4. Review permission scopes
5. If needed, manually apply labels or re-trigger the workflow

### Can we disable individual jobs?

**Answer:** Yes, by modifying the `if:` condition in the job definition. However, avoid disabling jobs without clear reason—keep all jobs active for complete label coverage.

---

## Maintenance

### Regular Tasks

- **Weekly:** Review execution reports in `.github/reports/labeling/` for anomalies
- **Monthly:** Audit label usage and clean up unused labels
- **Quarterly:** Review labeler rules for accuracy and coverage

### Update Process

1. Edit configuration files (`.github/labels.yml`, etc.)
2. Test changes with manual dispatch using `dry_run=true`
3. Commit to `develop` (auto-triggers on push)
4. Monitor execution reports

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

---
title: Issue Triage Automation
description: Complete guide to issue triage workflows, milestone assignment, and remediation
---

# Issue Triage Automation

This document describes the automated issue triage system, including:

- **Template enforcement** — validates DoR/DoD sections
- **Milestone assignment** — intelligently assigns milestones based on issue context
- **Remediation checklists** — generates per-issue DoR/DoD templates
- **Bulk remediation** — fixes 250+ non-compliant issues at scale

---

## Overview

The issue triage automation system ensures all issues are:

✅ **Type-labeled** — classified with `type:*` labels (bug, feature, task, etc.)
✅ **Milestone-assigned** — routed to appropriate release/phase milestone
✅ **Template-compliant** — include Definition of Ready (DoR) and Definition of Done (DoD) sections
✅ **Parent-linked** — child issues linked to parent/epic issues
✅ **PR-linked** — issues linked to related pull requests

---

## Workflows

### 1. Issue Creation with Enhanced Metadata

**Workflow:** `.github/workflows/issue-create-enhanced.yml`

Creates issues with full metadata application in one step.

#### Inputs

| Input | Required | Default | Description |
|---|---|---|---|
| `template_key` | ✅ Yes | — | Issue template (bug, feature, task, epic, etc.) |
| `title` | ✅ Yes | — | Issue title |
| `body` | — | "" | Additional context to append |
| `labels` | — | "" | Comma-separated extra labels |
| `assignee` | — | "" | Username to assign |
| `milestone` | — | "" | Milestone title (auto-assigned if blank) |
| `parent_issue` | — | "" | Parent issue number (for child issues) |
| `link_pr` | — | "" | Linked PR number |

#### Example

```bash
gh workflow run issue-create-enhanced.yml \
  --ref develop \
  -f template_key=feature \
  -f title="Add support for webhook authentication" \
  -f milestone="v1.5" \
  -f assignee="developer@lightspeedwp.agency" \
  -f labels="priority:high,component:api" \
  -f parent_issue=1234
```

#### What It Does

1. ✅ Creates issue from canonical template
2. ✅ Applies type label automatically
3. ✅ Adds status/priority labels
4. ✅ Auto-assigns milestone (intelligent algorithm if blank)
5. ✅ Links parent issue (if provided)
6. ✅ Posts remediation checklist if template gaps detected
7. ✅ Reports results and issue URL

---

### 2. Bulk Issue Remediation

**Workflow:** `.github/workflows/issue-remediation-bulk.yml`

Fixes compliance gaps in batches of issues.

#### Inputs

| Input | Required | Default | Description |
|---|---|---|---|
| `days` | — | "7" | Remediate issues created in last N days |
| `dry_run` | — | "true" | Run without making changes (preview mode) |
| `remediate_milestones` | — | "true" | Auto-assign missing milestones |
| `remediate_labels` | — | "true" | Add missing type labels |
| `remediate_templates` | — | "true" | Post remediation checklists |

#### Example: Preview Mode

```bash
gh workflow run issue-remediation-bulk.yml \
  --ref develop \
  -f days=7 \
  -f dry_run=true
```

This generates reports WITHOUT making changes. Review `.github/reports/remediation/` artifacts.

#### Example: Apply Fixes

```bash
gh workflow run issue-remediation-bulk.yml \
  --ref develop \
  -f days=7 \
  -f dry_run=false \
  -f remediate_milestones=true \
  -f remediate_labels=true \
  -f remediate_templates=true
```

#### What It Does

1. ✅ Fetches all non-compliant issues from last N days
2. ✅ Auto-assigns milestones using intelligent rules
3. ✅ Infers and applies type labels
4. ✅ Posts per-issue remediation checklists
5. ✅ Triggers unified labeling workflow
6. ✅ Generates detailed compliance reports
7. ✅ Uploads reports to workflow artifacts

---

### 3. Unified Labeling Workflow

**Workflow:** `.github/workflows/labeling.yml`

Applies comprehensive labeling to issues and PRs.

#### Inputs

| Input | Default | Description |
|---|---|---|
| `dry_run` | "true" | Preview mode (no changes) |
| `report_commit` | "false" | Commit reports to repo |

#### Example

```bash
gh workflow run labeling.yml \
  --ref develop \
  -f dry_run=false \
  -f report_commit=true
```

---

## Milestone Assignment Rules

The `MilestoneAssignmentAgent` uses these priority-ordered rules:

### Rule 1: Version Keywords (Confidence: 95%)

Issues with version mentions (`v1.5`, `v2.0`) are assigned to matching milestone.

**Example:** "Fix bug in v1.5 compatibility" → Milestone: v1.5

### Rule 2: Epic Type (Confidence: 90%)

Epic issues are assigned to next major milestone.

**Example:** type:epic → Milestone: v2.0

### Rule 3: Release Issues (Confidence: 90%)

Release issues are assigned to release/version milestones.

### Rule 4: Phase Keywords (Confidence: 85%)

Issues mentioning phases (`Phase 1`, `Phase 2.3`) match to phase milestones.

**Example:** "Phase 2B improvements" → Milestone: Phase 2B

### Rule 5: Priority-Based (Confidence: 80%)

High-priority/urgent issues → current active milestone

### Rule 6: Default Backlog (Confidence: 50%)

Falls back to backlog/icebox or first open milestone.

---

## Remediation Checklists

Each issue type has auto-generated DoR/DoD templates:

### Type-Specific Templates

Generated based on `type:*` label:

- **type:bug** — Reproducibility, environment, expected vs actual, logs
- **type:feature** — User story, acceptance criteria, designs, dependencies
- **type:task** — Acceptance criteria, scope, dependencies, blockers
- **type:design** — Design goals, references, Figma files, success criteria
- **type:epic** — Description, child issues, timeline, stakeholders
- **type:refactor** — Scope, metrics baseline, test coverage, compatibility
- **type:test** — Coverage target, strategy, test data, related issues
- **type:a11y** — WCAG level, components, testing plan, assistive tech
- **type:security** — Severity, systems, repro steps, mitigation

---

## Fixing 250 Issues (Audit Results)

### Current State

- **Total non-compliant:** 250 issues (100% created last week)
- **Missing type labels:** 250/250 (100%)
- **Missing milestones:** 250/250 (100%)
- **Missing DoR/DoD:** 248/250 (99.2%)

### Remediation Plan

**Step 1: Dry-Run Preview**

```bash
gh workflow run issue-remediation-bulk.yml \
  --ref develop \
  -f days=7 \
  -f dry_run=true
```

Wait for workflow to complete. Review:

- `.github/reports/remediation/milestone-assignment-*.md`
- Artifacts tab in workflow run

**Step 2: Apply Fixes**

```bash
gh workflow run issue-remediation-bulk.yml \
  --ref develop \
  -f days=7 \
  -f dry_run=false
```

This will:

1. ✅ Assign milestones (all 250 issues)
2. ✅ Infer and apply type labels (250 issues)
3. ✅ Post remediation checklists (248 issues)
4. ✅ Run labeling workflow
5. ✅ Generate compliance reports

**Step 3: Verify Compliance**

```bash
gh workflow run labeling.yml \
  --ref develop \
  -f dry_run=false
```

---

## Template Files

### Issue Templates Location

```
.github/ISSUE_TEMPLATE/
├── 01-task.md
├── 02-bug.md
├── 03-feature.md
├── 04-design.md
├── 05-epic.md
├── 06-story.md
├── 07-improvement.md
├── 08-chore.md
├── 09-code-refactor.md
├── 10-build-ci.md
├── 11-automation.md
├── 12-testing-coverage.md
├── 13-performance.md
├── 14-a11y.md
├── 15-security.md
├── 16-compatibility.md
├── 17-integration-issue.md
├── 18-release.md
├── 19-maintenance.md
├── 20-documentation.md
├── 21-research.md
├── 22-audit.md
├── 23-code-review.md
├── 24-ai-ops.md
└── 25-content-modelling.md
```

Each template includes:

- **Definition of Ready (DoR)** — pre-work checklist
- **Definition of Done (DoD)** — completion checklist
- **Frontmatter** — template metadata
- **Placeholder sections** — guidance for issue authors

---

## Agent Scripts

### MilestoneAssignmentAgent

**Location:** `scripts/agents/includes/milestone-assignment.js`

Intelligently assigns milestones based on:

- Issue type labels
- Priority labels
- Title/body keywords
- Existing milestone patterns

**API:**

```javascript
const { MilestoneAssignmentAgent } = require('./scripts/agents/includes/milestone-assignment.js');

const agent = new MilestoneAssignmentAgent(github, owner, repo);
const assignment = await agent.assignMilestone(issue);

// Returns: { milestoneNumber, milestoneTitle, confidence, reason, alternatives }
```

### RemediationChecklistGenerator

**Location:** `scripts/agents/includes/remediation-checklist-generator.js`

Generates type-specific DoR/DoD templates and posts as issue comments.

**API:**

```javascript
const { RemediationChecklistGenerator } = require('./scripts/agents/includes/remediation-checklist-generator.js');

const generator = new RemediationChecklistGenerator(github, owner, repo);
const results = await generator.postRemediationChecklists(issues, { dryRun: true });

// Returns: [{ issueNumber, status, comment }]
```

---

## Validation Rules

### Template Enforcement

All issues must have:

✅ **Definition of Ready (DoR)** section
✅ **Definition of Done (DoD)** section

Enforcement happens in `.github/workflows/template-enforcement.yml`:

- Detects missing sections on issue open/edit
- Adds `status:needs-more-info` label
- Posts guidance comment
- Prevents closure until fixed

### Issue Type Labels

All issues must have exactly one `type:*` label:

- `type:task`, `type:bug`, `type:feature`, `type:design`, `type:epic`
- `type:story`, `type:improve`, `type:refactor`, `type:build`, `type:ci`
- `type:automation`, `type:test`, `type:performance`, `type:a11y`, `type:security`
- `type:compatibility`, `type:integration`, `type:release`, `type:maintenance`
- `type:documentation`, `type:research`, `type:audit`, `type:review`
- `type:ai-ops`, `type:content-modelling`, `type:question`, `type:support`
- `type:ux-feedback`, `type:help`

---

## Reports

Workflows generate detailed compliance reports:

### Milestone Assignment Report

```
Milestone Assignment Report
Generated: 2026-07-26T12:34:56Z
Mode: DRY-RUN

## Summary
- Total issues: 250
- Assigned: 248
- Dry-run: 2
- Skipped: 0
- Errors: 0

## Details

### ASSIGNED (248)
- #1903: v1.5 (confidence: 95%, reason: version-keyword)
- #1902: Phase 2B (confidence: 85%, reason: phase-match)
...
```

### Remediation Checklist Report

Lists all issues with missing DoR/DoD and generated checklists.

### Labeling Report

Detailed breakdown of labels applied/removed per issue.

---

## Troubleshooting

### Milestone Not Assigned

**Problem:** Issue shows "No applicable milestone found"

**Solution:**

1. Check repository has open milestones
2. Verify milestone naming matches rule patterns (v1.0, Phase 1, etc.)
3. Manually assign milestone if rules don't apply
4. Consider adding new milestone rule

### Type Label Not Applied

**Problem:** Issue missing type label after remediation

**Solution:**

1. Manually add type label matching issue content
2. Report issue if inference was incorrect
3. Provide feedback on label assignment rules

### Template Check Failing

**Problem:** Issue flagged as missing DoR/DoD

**Solution:**

1. Edit issue body
2. Add DoR and DoD sections from remediation checklist comment
3. Use type-specific template as guide
4. Save — label will auto-remove

---

## Next Steps

1. **Run dry-run remediation** (no changes)
2. **Review reports** in workflow artifacts
3. **Apply fixes** with `dry_run=false`
4. **Verify compliance** with labeling workflow
5. **Document process** for team

---

## References

- [ISSUE_TRIAGE.md](./ISSUE_TRIAGE.md) — Manual triage process
- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) — Issue/PR lifecycle
- [.github/ISSUE_TEMPLATE/](../.github/ISSUE_TEMPLATE/) — Issue templates
- [.github/issue-types.yml](../.github/issue-types.yml) — Issue type definitions
- [.github/labels.yml](../.github/labels.yml) — Label definitions

---

*Last updated: 2026-07-26*

---
title: Issue Triage System - Integration Architecture
description: System integration patterns, component interaction, and conflict prevention for the Issue Triage Automation system
---

# Issue Triage System – Integration Architecture

This document describes how components of the Issue Triage Automation system interact, integrate with existing workflows, and maintain consistency across automated and manual operations.

## System Overview

The Issue Triage Automation system comprises three core workflows and two intelligent agents that work together to ensure issue compliance:

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Events                             │
│  (push, pull_request, issues, discussions)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   ┌─────────┐    ┌──────────────┐  ┌──────────────┐
   │ Labeling│    │Issue Creation│  │Bulk          │
   │Workflow │    │Enhanced      │  │Remediation   │
   └────┬────┘    │Workflow      │  │Workflow      │
        │         └──────┬───────┘  └───────┬──────┘
        │                │                  │
        └────────────────┼──────────────────┘
                         │
        ┌────────────────┴────────────────┐
        ▼                                  ▼
   ┌──────────────────┐         ┌──────────────────────┐
   │Milestone         │         │Remediation Checklist │
   │Assignment Agent  │         │Generator Agent       │
   └────────┬─────────┘         └──────────┬───────────┘
            │                              │
            └──────────────────┬───────────┘
                               │
                    ┌──────────▼──────────┐
                    │ GitHub Issues &     │
                    │ Pull Requests       │
                    │ (Updated)           │
                    └─────────────────────┘
```

## Component Descriptions

### 1. Labeling Workflow (`.github/workflows/labeling.yml`)

**Triggers:** Automatic on GitHub events

- Issue: opened, edited, reopened, labeled, unlabeled, transferred
- Pull Request: opened, edited, synchronize, reopened, ready_for_review, labeled, unlabeled, transferred
- Discussion: created, edited, answered, reopened
- Push to develop branch

**Responsibilities:**

- Apply type labels (bug, feature, task, etc.) based on issue/PR content
- Apply status labels (needs-review, in-progress, done, blocked) based on context
- Apply area labels (automation, ci, docs, etc.) based on file patterns
- Validate label taxonomy (all labels must have prefix: type:, status:, area:, priority:, meta:)

**Permissions:** issues:write, pull-requests:write, discussions:write

**Key Behavior:**

- Uses `.github/labeler.yml` rules to match content patterns
- Consults `.github/labels.yml` canonical labels list
- Applies labels immediately, without waiting for other workflows
- Runs on every relevant event to keep labels current

**Concurrency:** Grouped by event type, cancel-in-progress disabled (ensures no label race conditions)

---

### 2. Issue Creation Enhanced Workflow (`.github/workflows/issue-create-enhanced.yml`)

**Triggers:** Manual (workflow_dispatch only)

**Inputs:**

- `template_key` (required) — which template to use (task, bug, feature, epic, etc.)
- `title` (required) — issue title
- `body` (optional) — additional context
- `labels` (optional) — comma-separated extra labels beyond type label
- `assignee` (optional) — GitHub username to assign
- `milestone` (optional) — specific milestone; auto-assigned if blank
- `parent_issue` (optional) — parent issue number for hierarchical issues
- `link_pr` (optional) — PR number to link

**Responsibilities:**

1. Create issue from canonical template
2. Call MilestoneAssignmentAgent to assign milestone (if not provided)
3. Apply type label automatically
4. Call RemediationChecklistGenerator to post checklist comment (if gaps detected)
5. Report results and issue URL

**Permissions:** issues:write

**Key Behavior:**

- Creates issue with full context in one atomic operation
- Applies type label based on template_key
- Uses intelligent milestone assignment (unless explicit milestone provided)
- Posts remediation checklist as comment if template compliance gaps detected
- Returns issue URL and assignment details in step output

**Integration Points:**

- Calls MilestoneAssignmentAgent (internal agent)
- Calls RemediationChecklistGenerator (internal agent)
- May trigger labeling.yml if additional labels needed
- Output can be consumed by other workflows or scripts

---

### 3. Bulk Issue Remediation Workflow (`.github/workflows/issue-remediation-bulk.yml`)

**Triggers:** Manual (workflow_dispatch only)

**Inputs:**

- `days` (optional, default: 7) — remediate issues created in last N days
- `dry_run` (optional, default: true) — preview without making changes
- `remediate_milestones` (optional, default: true) — auto-assign missing milestones
- `remediate_labels` (optional, default: true) — add missing type labels
- `remediate_templates` (optional, default: true) — post remediation checklists

**Responsibilities:**

1. Query issues created in last N days
2. Identify compliance gaps (missing milestones, type labels, DoR/DoD sections)
3. Apply MilestoneAssignmentAgent to each non-compliant issue
4. Apply RemediationChecklistGenerator to post checklist comments
5. Generate detailed report and metrics
6. Export results to artifacts (JSON, CSV)

**Permissions:** issues:write

**Key Behavior:**

- Processes issues in batches (typically 10-50 issues per run)
- Dry-run mode generates reports WITHOUT making changes (safe preview)
- Each remediation step includes error handling and logging
- Reports compliance metrics: count of fixed issues, added labels, assigned milestones
- May trigger labeling.yml if labels applied
- All changes logged and timestamped

**Integration Points:**

- Calls MilestoneAssignmentAgent (internal agent)
- Calls RemediationChecklistGenerator (internal agent)
- May trigger labeling.yml if labels added
- Exports metrics to `.github/reports/remediation/` artifacts

---

### 4. Milestone Assignment Agent

**Location:** `scripts/agents/includes/milestone-assignment.js`

**Class:** `MilestoneAssignmentAgent`

**Inputs:**

- GitHub API client
- Repository owner and name
- Issue object (with title, body, labels)

**Outputs:**

- Milestone number (or null if no match)
- Assignment confidence score (0-100%)
- Reasoning explanation

**Key Methods:**

- `loadMilestones()` — Load all repository milestones and build lookup map
- `assignMilestone(issue)` — Determine appropriate milestone for issue

**Assignment Rules (Priority Order):**

1. **Explicit parameter** — If milestone provided, use it (highest priority)
2. **Epic pattern** — If title contains "Epic:" or "Phase:", assign to matching milestone
3. **Phase reference** — Keywords "Phase 1", "Phase 2C", etc. → assign to corresponding milestone
4. **Quarterly reference** — Keywords "Q3 2026", "Q4 2026" → assign to quarterly milestone
5. **Team assignment** — Team labels (team:frontend) → assign to team milestone
6. **Default backlog** — If no match, assign to "Backlog" milestone (lowest priority)

**Confidence Scoring:**

- Exact match: 95%+
- Keyword match: 80-90%
- Fallback match: 60-70%
- Default backlog: 50%

**Idempotent:** If issue already has milestone, returns existing milestone (no change)

---

### 5. Remediation Checklist Generator Agent

**Location:** `scripts/agents/includes/remediation-checklist-generator.js`

**Class:** `RemediationChecklistGenerator`

**Inputs:**

- GitHub API client
- Repository owner and name
- Issue object (with title, body, labels, type)

**Outputs:**

- Compliance analysis (missing DoR, missing DoD)
- Checklist comment (if gaps detected)
- Posted comment ID (if successful)

**Key Methods:**

- `analyzeCompliance(issue)` — Check for Definition of Ready/Done sections
- `generateDoRTemplate(issueType)` — Type-specific DoR checklist
- `generateDoDTemplate(issueType)` — Type-specific DoD checklist
- `postChecklistComment(issue, analysis)` — Post comment to issue

**Type-Specific Templates:** 10+ issue types with customized checklists

- type:task — acceptance criteria, scope, dependencies, blockers
- type:bug — reproducibility, environment, expected vs actual
- type:feature — user story, acceptance criteria, designs, integrations
- type:epic — goals, child issues, timeline, stakeholders
- (and 6+ more types)

**Idempotent:** Checks for existing remediation comments; doesn't post duplicate checklists

---

## Data Flow & Execution Sequences

### Scenario 1: Manual Issue Creation (Enhanced Workflow)

```
1. User triggers issue-create-enhanced.yml manually
2. Workflow creates issue from template
3. MilestoneAssignmentAgent called
   └─ Loads milestones
   └─ Analyzes title/body/labels
   └─ Assigns milestone with confidence score
4. Type label applied automatically
5. RemediationChecklistGenerator called
   └─ Analyzes compliance (DoR/DoD sections)
   └─ If gaps detected:
      └─ Generates type-specific checklist
      └─ Posts checklist comment
6. Labeling.yml triggered (if milestone/labels changed)
7. Workflow returns issue URL and summary

Result: Issue created with milestone, type label, and checklist (if needed)
```

### Scenario 2: Automatic Labeling on Issue Open

```
1. User opens new issue
2. GitHub fires 'issues:opened' event
3. Labeling.yml triggered
   └─ Analyzes content against labeler.yml rules
   └─ Applies type, status, area labels
   └─ Updates issue in-place
4. MilestoneAssignmentAgent NOT called (automatic labeling only)
5. RemediationChecklistGenerator NOT called (requires explicit workflow)

Result: Issue labeled automatically, but milestone NOT assigned (requires manual workflow)
```

**⚠️ Important:** Automatic labeling does NOT assign milestones. Must use issue-create-enhanced workflow for milestone assignment.

### Scenario 3: Bulk Remediation (Batch Fix)

```
1. User triggers issue-remediation-bulk.yml manually with dry_run=true
2. Query issues created in last 7 days (default)
3. For each issue:
   a. Check for compliance gaps (milestone, labels, DoR/DoD)
   b. If gaps found:
      └─ Call MilestoneAssignmentAgent (if milestone missing)
         └─ Assign milestone with confidence score
      └─ Call RemediationChecklistGenerator (if DoR/DoD missing)
         └─ Post checklist comment
      └─ Add/update type labels (if labels missing)
4. Log all changes to step summary
5. Export detailed report to artifacts (.github/reports/remediation/)
6. If dry_run=false, apply all changes; if dry_run=true, just report

Result: Compliance report generated (or issues remediated if dry_run=false)
```

---

## Integration Points & Conflict Prevention

### 1. Label Application Order (Precedence)

**Type Labels** (determined by):

1. Template key (issue-create-enhanced) — HIGHEST priority
2. Labeler.yml rules (labeling.yml) — MEDIUM priority
3. MilestoneAssignmentAgent reasoning (fallback) — LOWEST priority

**Status Labels** (determined by):

1. Labeler.yml rules based on state (labeling.yml) — PRIMARY
2. Manual updates by user — OVERRIDE

**Area Labels** (determined by):

1. Labeler.yml file path patterns (labeling.yml) — AUTOMATIC
2. Manual additions by user — PRESERVED

**Conflict Resolution:**

- Type labels: Explicit template key always wins
- Status labels: Labeler.yml rules take precedence (can be overridden manually)
- Area labels: Both automatic and manual preserved (no conflicts)

---

### 2. Milestone Assignment Order (Precedence)

**Milestone Determination** (in order):

1. Explicit parameter (issue-create-enhanced milestone input) — HIGHEST
2. MilestoneAssignmentAgent rules — MEDIUM
3. Existing milestone (if already set) — PRESERVE
4. Default "Backlog" — LOWEST

**Conflict Resolution:**

- Explicit always wins
- Rules applied only if issue has no milestone
- Pre-existing milestones never changed (idempotent)

---

### 3. Checklist Comment Posting (Duplicate Prevention)

**Detection:**

- RemediationChecklistGenerator checks for existing checklist comments
- Skips posting if comment already exists for this issue
- Uses comment body content hash to detect duplicates

**Idempotency:**

- Running remediation twice doesn't create duplicate checklists
- Safe to re-run bulk-remediation on same issue set
- If user manually posts checklist, remediation recognizes and skips

---

### 4. Concurrency & Race Conditions

**Labeling Workflow:**

- Concurrency group: `labeling-{event_type}-{issue_number}`
- Cancel-in-progress: **FALSE** (ensures no labels are lost)
- Multiple label operations queued, not cancelled

**Bulk Remediation:**

- Single-threaded batch processing (no concurrent API calls)
- Each issue processed sequentially to prevent race conditions
- Rate limiting handled per GitHub API guidelines

**Issue Creation:**

- Single operation (atomic) — no race conditions
- All metadata applied together

---

## Execution Guarantees

### Atomicity

| Workflow | Atomic? | Details |
|----------|---------|---------|
| Labeling | ❌ Partial | Labels applied separately; may have short delay between label adds |
| Issue Creation Enhanced | ✅ Yes | All metadata (template, milestone, labels, checklist) applied together |
| Bulk Remediation | ❌ Partial | Each issue remediated separately; can be interrupted between issues |

### Idempotency

| Workflow | Idempotent? | Details |
|----------|-------------|---------|
| Labeling | ✅ Yes | Reapplying labels is no-op (already present) |
| Issue Creation Enhanced | ❌ No | Creates new issue each time; must handle duplicates externally |
| Bulk Remediation | ✅ Yes | Rerunning is safe; checks before applying changes |
| Milestone Assignment | ✅ Yes | Preserves existing milestone (no-op if already set) |
| Checklist Generation | ✅ Yes | Skips if checklist comment already exists |

### Consistency

**Label Consistency:**

- All labels must be from `.github/labels.yml` canonical set
- Prefix enforcement: type:, status:, area:, priority:, meta: required
- Labeling.yml rules ensure consistent label application

**Milestone Consistency:**

- All milestones must exist in repository
- MilestoneAssignmentAgent loads from live repo state
- Assignment reasoning logged for audit trail

**Checklist Consistency:**

- Checklists generated from canonical type templates
- Same template applied every time for same issue type
- Content hash prevents duplicates

---

## Common Integration Scenarios

### Scenario A: User Wants Automatic Everything

**Goal:** Create an issue and have it auto-labeled, get milestone assigned, and post checklist automatically.

**Solution:** Use issue-create-enhanced.yml workflow

```bash
gh workflow run issue-create-enhanced.yml \
  --ref develop \
  -f template_key=feature \
  -f title="Add OAuth authentication" \
  -f labels="priority:high,component:api"
```

**Result:**

1. Issue created from feature template
2. Milestone assigned intelligently
3. Type label applied
4. Checklist posted if gaps detected
5. Labeling.yml may add additional labels
6. ✅ Fully compliant issue in one operation

---

### Scenario B: Compliance Audit & Bulk Fix

**Goal:** Find all non-compliant issues from last 30 days and fix them.

**Solution:** Run bulk remediation twice

```bash
# First: Preview changes
gh workflow run issue-remediation-bulk.yml \
  --ref develop \
  -f days=30 \
  -f dry_run=true

# Review report at .github/reports/remediation/report.json

# Then: Apply changes
gh workflow run issue-remediation-bulk.yml \
  --ref develop \
  -f days=30 \
  -f dry_run=false
```

**Result:**

1. Dry run shows what would change
2. User reviews report and confirms
3. Apply changes fixes all compliance gaps
4. Milestones assigned to unassigned issues
5. Type labels added to unlabeled issues
6. Checklists posted to issues with gaps
7. ✅ All issues in scope now compliant

---

### Scenario C: Partial Automation (Manual + Auto)

**Goal:** Create issue with explicit milestone, but auto-generate checklist.

**Solution:** Use issue-create-enhanced.yml with milestone parameter

```bash
gh workflow run issue-create-enhanced.yml \
  --ref develop \
  -f template_key=bug \
  -f title="Login timeout on mobile" \
  -f milestone="v1.4"
```

**Result:**

1. Issue created with EXPLICIT milestone v1.4 (not guessed)
2. Type label applied
3. Checklist posted if compliance gaps detected
4. Labeling.yml adds additional labels
5. ✅ Issue with your chosen milestone, auto-checklist

---

### Scenario D: Emergency Hotfix (No Automation)

**Goal:** Create urgent issue without waiting for workflows.

**Solution:** Use GitHub UI to create issue directly

**Result:**

1. Issue created immediately
2. Labeling.yml applies type/status/area labels automatically
3. Milestone NOT assigned (requires manual workflow)
4. Checklist NOT posted (requires manual workflow)

**Follow-up:** Run issue-create-enhanced or bulk-remediation later to add missing metadata.

---

## Troubleshooting Integration Issues

### Problem: Milestone Not Assigned

**Possible Causes:**

1. Used automatic labeling (labeling.yml) — only manual workflows assign milestones
2. MilestoneAssignmentAgent rules didn't match issue
3. Milestone name doesn't exist in repository

**Solution:**

- Use issue-create-enhanced.yml workflow (not just manual issue creation)
- Or run bulk-remediation.yml to fix retroactively
- Or manually assign milestone in GitHub UI

---

### Problem: Duplicate Checklist Comments

**Possible Causes:**

1. RemediationChecklistGenerator hash algorithm mismatch
2. Issue was manually edited after checklist posted
3. Workflow ran twice on same issue

**Solution:**

- This is prevented by idempotency checks
- If duplicates exist, manually delete extra comments
- Re-running remediation will not create more duplicates

---

### Problem: Wrong Milestone Assigned

**Possible Causes:**

1. MilestoneAssignmentAgent rules matched unexpected keyword
2. Title/body text ambiguous or misleading
3. Milestone name similar to rule keyword

**Solution:**

- Manual override: directly edit issue milestone in GitHub UI
- Remediation will not overwrite existing milestone (idempotent)
- For bulk fixes: exclude issue from next bulk-remediation run by date filter

---

### Problem: Labels Not Applied

**Possible Causes:**

1. Labeling.yml rules need updating
2. Label doesn't exist in `.github/labels.yml`
3. User has permission issue (rare in this repo)

**Solution:**

- Check `.github/labeler.yml` rules match your content
- Verify label exists in `.github/labels.yml`
- Re-run labeling.yml or use bulk-remediation.yml to apply labels

---

## Performance Considerations

### API Rate Limiting

GitHub rate limits:

- **Authenticated:** 5,000 requests/hour per user
- **Bulk Remediation:** ~10 requests per issue (100 issue batch = 1,000 requests)

**Optimization:**

- Bulk remediation batches issues to spread requests
- Use dry_run to preview before applying changes
- Schedule bulk operations during low-traffic times

### Workflow Execution Time

| Workflow | Typical Duration | Factors |
|----------|------------------|---------|
| Labeling | 10-30 seconds | Number of labels, complexity of rules |
| Issue Creation Enhanced | 5-15 seconds | Milestone assignment rules, checklist posting |
| Bulk Remediation (10 issues) | 30-60 seconds | Number of issues, enabled remediation steps |
| Bulk Remediation (100 issues) | 3-5 minutes | Full batch processing |

### Scaling Considerations

- Bulk remediation can handle 250+ issues per run (tested)
- May require splitting large runs (>500 issues) into smaller batches
- Dry-run is recommended before applying changes to large batches

---

## Maintenance & Future Enhancements

### Known Limitations

1. **Automatic Labeling Only** — labeling.yml doesn't assign milestones; requires manual workflow
2. **Single Milestone per Issue** — GitHub limitation; no sub-milestones
3. **No Cross-Repo Coordination** — Issue Triage only works within single repository
4. **Manual Validation** — Complex conflict scenarios may require human judgment

### Planned Enhancements

- [ ] Extend milestone assignment rules (quarterly, team-based)
- [ ] Add compliance metrics workflow (weekly reports)
- [ ] Enhanced dry-run reports (CSV export, before/after comparison)
- [ ] External integration support (Jira, Linear, Asana sync)

---

## References

- **System Guide:** [docs/ISSUE_TRIAGE_AUTOMATION.md](./ISSUE_TRIAGE_AUTOMATION.md)
- **Audit Findings:** [.github/projects/active/issue-triage-automation-system/AUDIT_ISSUES.md](../.github/projects/active/issue-triage-automation-system/AUDIT_ISSUES.md)
- **Workflows:** [.github/workflows/](../.github/workflows/)
- **Agent Scripts:** [scripts/agents/includes/](../scripts/agents/includes/)
- **Labels Configuration:** [.github/labels.yml](../.github/labels.yml)
- **Labeler Rules:** [.github/labeler.yml](../.github/labeler.yml)

---

**Last Updated:** September 3, 2026  
**Status:** Published  
**Related Issue:** [#2647](https://github.com/lightspeedwp/.github/issues/2647)

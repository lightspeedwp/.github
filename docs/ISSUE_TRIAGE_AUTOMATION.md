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

### Common Error Scenarios

#### Milestone Assignment Failed

**Symptom:** Issue processed but no milestone assigned, or assigned incorrectly.

**Root Causes:**

- Repository has no open milestones matching the rules
- Milestone naming doesn't match pattern expectations (v1.0, Phase 2B, etc.)
- Issue title/body lacks keywords required by assignment rules
- Confidence score too low for any rule to trigger

**Solutions:**

1. **Verify milestones exist:**

   ```bash
   gh api repos/lightspeedwp/.github/milestones --paginate | \
     jq '.[] | {title, state}'
   ```

2. **Check issue keywords:**
   - Review issue title for version patterns (v1.5, v2.0)
   - Check for phase keywords (Phase 1, Phase 2B)
   - Verify priority labels are set (priority:critical, priority:urgent)
   - Look for epic type indicators

3. **Manually assign milestone:**

   ```bash
   gh issue edit {issue_number} \
     --milestone "v1.5"
   ```

4. **Review assignment rules** in `OPENSPEC.md` for priority order and patterns

---

#### Type Label Not Applied or Wrong Type Assigned

**Symptom:** Issue missing type label, or label doesn't match issue content.

**Root Causes:**

- Issue body doesn't contain keywords the inference algorithm searches for
- Algorithm inferred wrong type from misleading keywords
- Label not in canonical set (missing type: prefix)
- Multiple type labels present (system expects exactly one)

**Solutions:**

1. **Verify label exists and is canonical:**

   ```bash
   gh label list --search "type:" | grep -E "type:(bug|feature|task|design|epic)"
   ```

2. **Manually add correct type label:**

   ```bash
   gh issue edit {issue_number} \
     --add-label "type:feature"
   ```

3. **Remove incorrect labels:**

   ```bash
   gh issue edit {issue_number} \
     --remove-label "type:task"
   ```

4. **For bulk issues**, re-run remediation with focus on labeling:

   ```bash
   gh workflow run issue-remediation-bulk.yml \
     --ref develop \
     -f days=7 \
     -f dry_run=false \
     -f remediate_milestones=false \
     -f remediate_labels=true \
     -f remediate_templates=false
   ```

---

#### Remediation Checklist Not Posted

**Symptom:** Issue missing Definition of Ready/Done checklist comment.

**Root Causes:**

- Issue already compliant (has DoR and DoD sections in body)
- API rate limit hit during bulk operation
- Checklist generator script error
- Issue body too large (context size limit)

**Solutions:**

1. **Check if issue already compliant:**
   - Look for "Definition of Ready (DoR)" section in issue body
   - Look for "Definition of Done (DoD)" section in issue body
   - If both present, issue is already compliant

2. **Manually post remediation checklist:**

   ```bash
   # Copy the appropriate template from ENHANCEMENT_TASKS.md
   gh issue comment {issue_number} \
     --body "$(cat - <<'EOF'
   ## Definition of Ready (DoR)
   - [ ] Requirements clearly documented
   - [ ] Acceptance criteria defined
   - [ ] Dependencies identified
   - [ ] Effort estimated
   
   ## Definition of Done (DoD)
   - [ ] Code implemented
   - [ ] Tests passing
   - [ ] Documentation updated
   - [ ] PR merged
   EOF
   )"
   ```

3. **Re-run template remediation** (separately from labels/milestones):

   ```bash
   gh workflow run issue-remediation-bulk.yml \
     --ref develop \
     -f days=1 \
     -f dry_run=false \
     -f remediate_milestones=false \
     -f remediate_labels=false \
     -f remediate_templates=true
   ```

---

#### Workflow Execution Timeout or Failure

**Symptom:** Workflow run fails with timeout, memory, or API errors.

**Root Causes:**

- Processing too many issues in single run (>500)
- API rate limit (GitHub REST API limit: 5,000 requests/hour)
- Workflow runner out of memory
- Network connectivity issues
- Missing GITHUB_TOKEN permissions

**Solutions:**

1. **Reduce batch size:**

   ```bash
   # Process only last 3 days instead of 7
   gh workflow run issue-remediation-bulk.yml \
     --ref develop \
     -f days=3 \
     -f dry_run=true
   ```

2. **Check permissions:**
   - Verify workflow has `issues: write` permission
   - Check GITHUB_TOKEN has access to repository
   - Confirm not rate-limited (check workflow logs)

3. **Check workflow logs:**

   ```bash
   gh run view {run_id} --log
   ```

4. **If API rate limited**, wait 1 hour and retry. For urgent bulk operations:

   ```bash
   # Use selective remediation (one type at a time)
   gh workflow run issue-remediation-bulk.yml \
     --ref develop \
     -f days=7 \
     -f dry_run=false \
     -f remediate_milestones=true \
     -f remediate_labels=false \
     -f remediate_templates=false
   # Wait for completion, then:
   gh workflow run issue-remediation-bulk.yml \
     --ref develop \
     -f days=7 \
     -f dry_run=false \
     -f remediate_milestones=false \
     -f remediate_labels=true \
     -f remediate_templates=false
   ```

---

#### Enhanced Issue Creation Workflow Fails

**Symptom:** issue-create-enhanced.yml fails or creates issue without metadata.

**Root Causes:**

- Invalid template_key parameter
- Milestone assignment returned error but workflow continued
- Issue creation succeeded but label/milestone application failed
- Invalid assignee or parent issue reference

**Solutions:**

1. **Verify template key is valid:**

   ```bash
   # Valid keys:
   task feature bug design epic story improvement code-refactor \
   build-ci automation testing-coverage performance a11y security \
   compatibility integration-issue release maintenance documentation \
   research audit code-review ai-ops content-modelling
   ```

2. **Check workflow step outputs:**

   ```bash
   gh run view {run_id} --log | grep -A 10 "Create issue"
   ```

3. **Manually apply missing metadata:**

   ```bash
   # Add type label
   gh issue edit {issue_number} --add-label "type:feature"
   
   # Add milestone
   gh issue edit {issue_number} --milestone "v1.5"
   ```

---

### Manual Override Procedures

#### Manually Assign Milestone to Single Issue

```bash
gh issue edit {issue_number} \
  --milestone "{milestone_title}"
```

**Example:**

```bash
gh issue edit 2650 --milestone "v1.5"
```

---

#### Manually Update Type Label

```bash
# Remove existing type label
gh issue edit {issue_number} \
  --remove-label "type:task"

# Add correct type label
gh issue edit {issue_number} \
  --add-label "type:feature"
```

---

#### Manually Post DoR/DoD Checklist

Use the type-specific template from the Remediation Checklists section. Example for type:bug:

```bash
gh issue comment {issue_number} \
  --body "$(cat - <<'EOF'
## Definition of Ready (DoR)
- [ ] Issue is reproducible with clear steps
- [ ] Environment specified (browser, PHP version, etc.)
- [ ] Expected behavior vs actual behavior documented
- [ ] Error logs or screenshots attached
- [ ] Severity/priority assigned

## Definition of Done (DoD)
- [ ] Bug fix implemented and tested
- [ ] Unit tests added/updated
- [ ] Manual testing completed in staging
- [ ] Documentation updated if needed
- [ ] PR merged to develop
EOF
)"
```

---

#### Bulk Update Multiple Issues

Use GitHub CLI with scripting:

```bash
# Add type:bug label to issues #2650-2655
for i in {2650..2655}; do
  gh issue edit $i --add-label "type:bug"
done

# Assign milestone to issues with a label
gh search issues --repo lightspeedwp/.github \
  label:"status:needs-triage" --json number \
  | jq '.[] | .number' | while read issue_num; do
    gh issue edit $issue_num --milestone "backlog"
  done
```

---

### Debug Mode & Verbose Logging

#### Enable Workflow Debug Logging

Set environment variable before running workflow:

```bash
gh workflow run issue-remediation-bulk.yml \
  --ref develop \
  -f days=7 \
  -f dry_run=true
```

Then check logs:

```bash
# Get latest workflow run
RUN_ID=$(gh run list --workflow issue-remediation-bulk.yml \
  --limit 1 --json databaseId --jq '.[0].databaseId')

# View logs with verbose output
gh run view $RUN_ID --log | head -500
```

---

#### Inspect Milestone Assignment Reasoning

Check the dry-run report to see assignment reasoning:

```bash
# Run in dry-run mode
gh workflow run issue-remediation-bulk.yml \
  --ref develop \
  -f days=1 \
  -f dry_run=true

# Wait for completion, then download reports
gh run view $RUN_ID
# Click "Artifacts" tab in web UI, download remediation-reports-*.zip
# Unzip and examine milestone-assignment-*.md for reasoning

# Or via CLI:
gh run download $RUN_ID -D reports/
unzip reports/remediation-reports-*.zip
cat reports/milestone-assignments.json | jq '.[] | {issue: .issueNumber, milestone, confidence, reason}'
```

---

#### Check Agent Script Directly

For debugging MilestoneAssignmentAgent:

```bash
# Run Node script with debug output
node -e "
const { MilestoneAssignmentAgent } = require('./scripts/agents/includes/milestone-assignment.js');
// Add debug logging to see rule evaluation
" --trace-warnings
```

---

### Rollback Procedures

#### Undo Single Issue Changes

```bash
# Remove milestone
gh issue edit {issue_number} \
  --milestone ""

# Remove type label
gh issue edit {issue_number} \
  --remove-label "type:bug"

# Remove remediation checklist comment
gh issue comment {issue_number} \
  --body "Removing remediation checklist (rollback)"
# Then manually delete the old checklist comment via web UI
```

---

#### Undo Bulk Remediation

For large-scale rollback, use git history to revert:

```bash
# Find the commit that applied remediation
git log --oneline --all | grep -i "remediation\|compliance"

# Revert that commit (creates inverse commit, doesn't delete history)
git revert {commit_hash}

# Push revert
git push origin develop
```

**Note:** This reverts metadata applied by the remediation workflow. To undo:

1. Milestones will be removed
2. Type labels will be removed
3. Checklist comments will remain (must delete manually)

---

#### Re-Apply After Failed Rollback

If rollback didn't work as expected:

1. **Manually reset issue state:**

   ```bash
   gh issue edit {issue_number} \
     --remove-label "type:*" \
     --milestone ""
   ```

2. **Re-run remediation** (workflow will reapply):

   ```bash
   gh workflow run issue-remediation-bulk.yml \
     --ref develop \
     -f days=1 \
     -f dry_run=false
   ```

---

### Performance & Rate Limiting

#### Workflow Takes Too Long

**Problem:** Bulk remediation workflow running for >10 minutes.

**Solution:**

- Monitor shows workflow processing ~10-20 issues/minute
- For 250 issues, expect 12-25 minutes total
- To speed up:
  1. Run selective remediation (one type at a time)
  2. Reduce days parameter (fewer issues to process)
  3. Disable templates if not needed (API calls to fetch then post)

#### API Rate Limit Approaching

**Problem:** Workflow logs show "API rate limit exceeded" or "403 Forbidden".

**Solution:**

1. **Check current rate limit:**

   ```bash
   gh api rate_limit | jq '.rate'
   ```

2. **Wait for reset** (typically 1 hour from first request in window)

3. **For urgent work**, use selective remediation to reduce API calls:

   ```bash
   # Only update milestones (fewer API calls than templates)
   gh workflow run issue-remediation-bulk.yml \
     --ref develop \
     -f days=7 \
     -f remediate_templates=false
   ```

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

*Last updated: 2026-09-03*

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

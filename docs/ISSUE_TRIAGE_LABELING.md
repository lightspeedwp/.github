---
file_type: documentation
title: Issue Triage Labeling Automation
description: Phase 3 of the Issue Triage Automation System — intelligent label assignment for GitHub issues
version: '1.0'
date: '2026-08-04'
status: Implemented
---

# Issue Triage Labeling Automation (Phase 3)

## Overview

Phase 3 completes the Issue Triage Automation System by applying **type labels**, **area labels**, and **priority labels** to all GitHub issues. This ensures every issue has complete metadata for filtering, automation, and roadmap planning.

## Architecture

### Three Components

#### 1. LabelingAgent (`scripts/agents/includes/labeling-agent.js`)

**Intelligent label detection engine** using rule-based classification:

```javascript
// Initialize agent
const { LabelingAgent } = require('./labeling-agent.js');
const agent = new LabelingAgent(github, owner, repo);

// Assign labels to single issue
const result = await agent.assignLabels(issue, { dryRun: true });

// Bulk assign to multiple issues
const results = await agent.bulkAssignLabels(issues, {
  dryRun: true,
  batchSize: 50,
});
```

**Features:**

- Type detection (10 types)
- Area routing (7 areas)
- Priority extraction (4 levels)
- Confidence scoring
- Dry-run preview mode
- Batch processing
- Error handling

#### 2. issue-labeling-automation.yml Workflow

**Orchestrates label application at scale**:

- Manual trigger: `workflow_dispatch`
- Scheduled: Daily at 02:00 UTC
- Post-remediation: Triggered after milestone assignment
- On issue creation: For new issues

**Inputs:**

```yaml
dry_run: 'true'                           # Preview mode
issue_filter: 'created >= 7 days ago'     # Filter issues
label_types: 'all'                        # Which labels to apply
batch_size: '50'                          # Batch size
```

#### 3. apply-labels-workflow.js Script

**Executes label assignment** using the LabelingAgent:

- Fetches issues from repository
- Applies labels via intelligent detection
- Generates detailed reports
- Uploads artifacts
- Handles errors gracefully

## Label Mapping Reference

### Type Labels (Mutually Exclusive)

Every issue should have exactly **one** type label.

| Label | Detection Rules | Keywords | Example |
|-------|-----------------|----------|---------|
| `type:bug` | Has "## Root Cause" section | error, crash, bug, failure, broken, defect | #1850: Database connection timeout |
| `type:feature` | Has "## Acceptance Criteria" | feature, enhancement, new, capability | #1800: Add two-factor auth |
| `type:task` | Simple scoped work | task, implement, setup, configure | #1700: Update dependencies |
| `type:epic` | Large multi-part initiative | epic, initiative, phase, program | #1376: Issue Triage System |
| `type:story` | User narrative + acceptance criteria | story, narrative, user story | #1600: User can reset password |
| `type:improvement` | Enhancement to existing feature | improvement, optimization, better | #1500: Improve dashboard performance |
| `type:chore` | Maintenance and housekeeping | chore, maintenance, cleanup, dependency | #1400: Update linting config |
| `type:documentation` | Docs, readme, guides | documentation, docs, readme, guide | #1300: API reference guide |
| `type:design` | UI/UX, tokens, accessibility | design, ui, ux, a11y, accessibility, token | #1200: WCAG compliance audit |
| `type:code-refactor` | Code cleanup (no behavior change) | refactor, simplify, restructure, cleanup | #1100: Simplify auth module |

### Area Labels (Multiple Allowed)

Issues can have **multiple** area labels.

| Label | Keywords | Patterns | Related |
|-------|----------|----------|---------|
| `area:ci` | workflow, github-actions, action, ci, cd | `.github/workflows/*.yml` | GitHub Actions, CI/CD |
| `area:scripts` | script, automation, node, javascript | `scripts/**/*.js` | Automation tools |
| `area:tests` | test, spec, coverage, unit, e2e | `**/*.test.js`, `**/__tests__/**` | Testing |
| `area:docs` | documentation, readme, guide, spec | `docs/**`, `*.md` | Documentation |
| `area:governance` | governance, policy, rule, enforcement | `AGENTS.md`, `CLAUDE.md` | Standards & policies |
| `area:performance` | performance, speed, latency, optimization | `perf/**`, performance | Performance |
| `area:security` | security, vulnerability, auth, crypto | `security/**`, security | Security |

### Priority Labels (Up to 1)

Issues can have **one** priority label.

| Label | Keywords | SLA | Example |
|-------|----------|-----|---------|
| `priority:urgent` | critical, blocker, production, emergency, asap | 4 hours | Production database down |
| `priority:high` | high priority, important, significant, blocking | 1 day | Security patch needed |
| `priority:normal` | (default if none match) | 1 week | Standard work |
| `priority:low` | low priority, nice-to-have, cosmetic, future | No SLA | Cosmetic improvement |

## Usage Guide

### Run Manually (Dry-Run Preview)

```bash
gh workflow run issue-labeling-automation.yml \
  --ref feat/issue-triage-phase-3-labeling \
  -f dry_run=true \
  -f issue_filter='created >= 7 days ago' \
  -f label_types=all \
  -f batch_size=50
```

**What happens:**

1. Fetches all issues matching filter
2. Analyzes each issue for labels
3. **Generates preview report** (no changes)
4. Uploads report as artifact

**Review the output:**

1. Download artifact: `labeling-report` → `labeling-report.json`
2. Review detected labels per issue
3. Verify assignments look correct
4. Check for any false positives

### Run with Apply Mode

```bash
gh workflow run issue-labeling-automation.yml \
  --ref feat/issue-triage-phase-3-labeling \
  -f dry_run=false \
  -f issue_filter='created >= 7 days ago' \
  -f label_types=all \
  -f batch_size=50
```

**What happens:**

1. Fetches all issues matching filter
2. Analyzes each issue for labels
3. **APPLIES LABELS** to GitHub (actual changes)
4. Generates report with results
5. Uploads report and issue list

### Scheduled Execution

The workflow runs automatically:

- **Schedule:** Daily at 02:00 UTC
- **Filter:** Issues created in past 7 days
- **Mode:** DRY-RUN (preview only, no changes)
- **Batch:** 50 issues per batch

To disable scheduled runs:

1. Edit `.github/workflows/issue-labeling-automation.yml`
2. Remove or comment out the `schedule:` section
3. Commit and push

## Agent API Reference

### LabelingAgent Constructor

```javascript
const agent = new LabelingAgent(github, owner, repo);
```

**Parameters:**

- `github` — Octokit GitHub API client
- `owner` — Repository owner (string)
- `repo` — Repository name (string)

### detectType(issue)

Detects the best matching type label for an issue.

```javascript
const result = agent.detectType({
  number: 123,
  title: 'Fix authentication bug',
  body: '## Root Cause\nDatabase connection timeout',
  labels: [],
});

// Result:
// {
//   label: 'type:bug',
//   confidence: 0.95,
//   reason: 'Detected from keywords and template sections'
// }
```

**Returns:** `{label, confidence, reason}` or `null` if no match

### detectAreas(issue)

Detects all matching area labels for an issue.

```javascript
const areas = agent.detectAreas({
  number: 124,
  title: 'Fix GitHub Actions workflow',
  body: 'CI pipeline is failing',
  labels: [],
});

// Result:
// [
//   { label: 'area:ci', confidence: 0.85, reason: '...' },
//   { label: 'area:scripts', confidence: 0.80, reason: '...' }
// ]
```

**Returns:** Array of `{label, confidence, reason}` objects

### detectPriority(issue)

Detects priority label (if any).

```javascript
const priority = agent.detectPriority({
  number: 125,
  title: 'Critical: Production database down',
  body: 'All systems affected - urgent fix needed',
  labels: [],
});

// Result:
// {
//   label: 'priority:urgent',
//   confidence: 0.90,
//   reason: 'Detected from keywords in title/body'
// }
```

**Returns:** `{label, confidence, reason}` or `null` if no match

### assignLabels(issue, options)

Assigns all detected labels to a single issue.

```javascript
const result = await agent.assignLabels(
  {
    number: 126,
    title: 'Critical bug in auth',
    body: '## Root Cause\nSession timeout logic broken',
    labels: [],
  },
  { dryRun: false }, // Apply actual changes
);

// Result (dry-run mode):
// {
//   number: 126,
//   status: 'dry-run-preview',
//   labelsDetected: [
//     { label: 'type:bug', ... },
//     { label: 'area:security', ... },
//     { label: 'priority:high', ... }
//   ]
// }

// Result (apply mode):
// {
//   number: 126,
//   status: 'applied',
//   labelsDetected: [...]
// }
```

**Options:**

- `dryRun` (boolean, default: true) — Preview mode or apply changes

**Returns:** Result object with status and detected labels

### bulkAssignLabels(issues, options)

Assigns labels to multiple issues in batches.

```javascript
const issues = [
  { number: 200, title: 'Bug...', body: '...', labels: [] },
  { number: 201, title: 'Feature...', body: '...', labels: [] },
  // ... more issues
];

const results = await agent.bulkAssignLabels(issues, {
  dryRun: true,
  batchSize: 50,
});

// Result:
// [
//   { number: 200, status: 'dry-run-preview', labelsDetected: [...] },
//   { number: 201, status: 'dry-run-preview', labelsDetected: [...] },
//   // ... more results
// ]
```

**Options:**

- `dryRun` (boolean, default: true) — Preview or apply
- `batchSize` (number, default: 50) — Issues per batch

**Returns:** Array of result objects

### generateReport(results)

Creates a summary report from labeling results.

```javascript
const report = agent.generateReport(results);

// Result:
// {
//   timestamp: '2026-08-04T12:00:00Z',
//   summary: {
//     total: 250,
//     succeeded: 248,
//     errors: 2,
//     typeLabelsApplied: 248,
//     areaLabelsApplied: 240,
//     priorityLabelsApplied: 45
//   },
//   results: [...]
// }
```

**Returns:** Report object with summary and detailed results

## Decision Logic

### Type Detection Algorithm

1. Check **title + body** for type-specific keywords
2. Look for **template sections** (Root Cause, Acceptance Criteria, etc.)
3. Calculate confidence based on:
   - Template match: 95% confidence
   - Keyword + template: 90% confidence
   - Keywords only: 70% confidence
4. **Return highest confidence match** (mutually exclusive)

### Area Routing Algorithm

1. Check **title + body** for area keywords
2. Check **issue paths/patterns** (if available)
3. Apply **all matching areas** (not mutually exclusive)
4. Calculate confidence: 85% for keyword match, 80% for pattern match

### Priority Detection Algorithm

1. Check **title + body** for priority keywords
2. **Skip if priority label already exists** (don't override)
3. Return highest priority found (only one per issue)
4. Default: No priority label if no keywords match

## Examples

### Example 1: Bug Fix

**Issue:**

```
Title: Database connection timeout causing authentication failures
Body:
## Root Cause
Connection pool exhaustion under load

## Proposed Solution
Implement connection timeout handling

## Environment
- OS: Ubuntu 20.04
- Node: 18.x
```

**Detected Labels:**

- ✅ `type:bug` — Has "## Root Cause" section
- ✅ `area:security` — Keyword: "authentication"
- ✅ `priority:high` — Keyword: "failure" (concerning)

### Example 2: CI/CD Feature

**Issue:**

```
Title: Add GitHub Actions workflow for automated testing
Body:
## Acceptance Criteria
- Runs tests on every PR
- Reports coverage metrics

## Implementation Notes
Will use .github/workflows/test.yml
```

**Detected Labels:**

- ✅ `type:feature` — Has "## Acceptance Criteria"
- ✅ `area:ci` — Keywords: "GitHub Actions", "workflow"
- ✅ `area:tests` — Keyword: "testing"

### Example 3: Documentation Task

**Issue:**

```
Title: Update API documentation
Body:
## Steps
1. Document all endpoints
2. Add usage examples
3. Generate changelog
```

**Detected Labels:**

- ✅ `type:documentation` — Keyword: "documentation"
- ✅ `area:docs` — Keyword: "documentation"
- ✅ (No priority) — No priority keywords

## Testing

### Unit Tests

Run all tests:

```bash
npm test -- scripts/agents/includes/__tests__/labeling-agent.test.js
```

Coverage report:

```bash
npm test -- scripts/agents/includes/__tests__/labeling-agent.test.js --coverage
```

**Test coverage:**

- ✅ Type detection (6 tests)
- ✅ Area detection (6 tests)
- ✅ Priority detection (5 tests)
- ✅ Label assignment (4 tests)
- ✅ Bulk processing (3 tests)
- ✅ Report generation (1 test)
- ✅ Helper methods (2 tests)
- ✅ Label caching (3 tests)

**Target:** ≥80% code coverage

### Integration Testing

1. **Dry-run validation:**
   - Preview labels on 50 test issues
   - Verify no false positives
   - Check confidence scores

2. **Apply validation:**
   - Apply labels to 10 test issues
   - Spot-check labels in GitHub UI
   - Verify no conflicts/duplicates

3. **Compliance audit:**
   - 100% type label coverage
   - No missing required labels
   - No label conflicts

## Troubleshooting

### Issue not detected correctly

**Check:**

1. Is the issue using a standard template?
2. Does the title/body contain relevant keywords?
3. Are template sections spelled correctly?
4. Run dry-run to preview detections

**Fix:**

1. Update issue body to use standard template
2. Add relevant keywords to title or body
3. Re-run labeling workflow

### Labels not applied

**Check:**

1. Is the workflow in apply mode (not dry-run)?
2. Do you have permission to modify labels?
3. Check workflow logs for errors
4. Verify GITHUB_TOKEN has `issues:write` permission

**Fix:**

1. Run workflow with `dry_run=false`
2. Check repository permissions
3. Review and fix errors in logs
4. Re-run workflow

### Too many false positives

**Check:**

1. Are keywords matching unrelated content?
2. Is confidence score too low?
3. Are there conflicting rules?

**Fix:**

1. Review and refine keyword lists in LabelingAgent
2. Adjust confidence thresholds
3. Add negative patterns to exclude false matches
4. Test with dry-run before applying

## Integration with Other Systems

### Phase 1: Implementation ✅

- Agents created and documented
- Workflows deployed

### Phase 2: Milestone Assignment ✅

- MilestoneAssignmentAgent processes issues
- Milestones assigned to 250+ issues
- Phase 2 complete (PR #1488 merged)

### Phase 3: Labeling (This Phase) 🔄

- LabelingAgent processes issues
- Labels assigned to 250+ issues
- Final compliance audit

### Phase 4: Roadmap Planning (Future)

- Use milestones + labels for roadmap
- Automated status reporting
- Stakeholder dashboards

## Performance

### Benchmarks

- **Single issue labeling:** ~50ms (detection only)
- **Single issue with API call:** ~200ms (with label application)
- **Batch of 50 issues:** ~10s (detection + application)
- **Bulk processing 250 issues:** ~50s (5 batches of 50)

### Optimization Tips

1. Use dry-run first to preview
2. Process in batches (50-100 per batch)
3. Schedule during off-peak hours (02:00 UTC)
4. Monitor workflow execution time

## Related Documentation

- **Phase 1 Implementation:** `docs/ISSUE_TRIAGE_AUTOMATION.md`
- **Phase 2 Milestone Assignment:** PR #1488
- **Phase 3 Planning:** `.github/projects/active/issue-triage-automation-system/PHASE_3_LABELING_PLAN.md`
- **Label Reference:** `.github/labels.yml`
- **Issue Types:** `.github/issue-types.yml`

## Support & Issues

For questions or issues:

1. Check this documentation first
2. Review test cases for usage examples
3. Check workflow logs for errors
4. Open an issue with reproduction steps

---

**Version:** 1.0  
**Last Updated:** 2026-08-04  
**Status:** Implemented  

*Built with 🧱 LightSpeed AI infrastructure for enterprise-scale GitHub automation.*

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

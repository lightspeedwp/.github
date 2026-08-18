# Phase 3: Issue Remediation Implementation Guide

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![allocate-pr-issue-to-milestone](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![badges-documentation-update](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml)
[![badges-health-check](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml)
[![badges-readme-status](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml)
[![badges-workflow-audit](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![docs-maintenance](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml)
[![docs-validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![gitleaks-reusable](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml)
[![gitleaks-update](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml)
[![gitleaks](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml)
[![issue-create-enhanced](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issue-fields-backfill](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml)
[![issue-health-audit](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml)
[![issue-labeling-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml)
[![issue-project-field-sync](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml)
[![issue-remediation-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml)
[![issue-remediation-bulk](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![label-audit-report](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml)
[![labeling-governance](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![manage-blocking-status-labels](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml)
[![meta-labels-sync](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-pipeline](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml)
[![metrics-reporting](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-maintenance-nightly](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml)
[![project-maintenance-on-demand](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![validate-blocking-issue-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml)
[![validate-blocking-status-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml)
[![validate-dor-dod-sections](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml)
[![validate-issue-dod-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
[![validate-project-linking](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml)
<!-- BADGES-END -->

**Status:** Phase 3 implementation complete. 6 label-specific handlers + central orchestrator created.

## Overview

Phase 3 implements automated issue remediation by routing Phase 2 triage analysis results to specialized handlers. Each handler applies specific metadata improvements and tracks progress across the issue portfolio.

## Architecture

```
Triage Router → Priority Sort → Handler Chain → GitHub Updates → Report
  (Phase 2)     (High Impact)     (Metadata)    (Labels/Body)   (Tracking)
```

## Core Components

### 1. Triage Router (`handle-needs-triage.js`)

Routes issues to appropriate handlers based on missing metadata.

**Key Functions:**

- `assessTriageNeeds(issue)` → Complete triage assessment
  - Runs all Phase 2 analysis modules
  - Identifies metadata gaps
  - Returns analysis + validation + relationship check
  
- `getHandlerPriority(needs)` → Ordered handler list
  - High impact first: template, type, areas (1-3)
  - Medium impact: priority, assignees (4-5)
  - Lower impact: milestone, project, relationships (6-8)
  
- `generateRemediationPlan(issue, assessment)` → Actionable plan
  - Lists handlers to execute
  - Includes recommendations for each
  - Calculates auto-apply eligibility
  
- `executeRemediationPlan(issue, plan, handlers)` → Results
  - Executes handlers in priority order
  - Tracks success/failure/skip
  - Returns detailed results

**Example:**

```javascript
const assessment = assessTriageNeeds(issue);
// Returns:
// {
//   needs: {
//     needsType: true,
//     needsAreas: false,
//     needsTemplate: true,
//     ... (9 dimensions)
//   },
//   analysis: {...},
//   suggestions: {...},
//   validation: {...}
// }

const plan = generateRemediationPlan(issue, assessment);
// {
//   handlers: [
//     { handler: 'template-fix', priority: 1, impact: 'high' },
//     { handler: 'type-assignment', priority: 2, impact: 'high' },
//     ...
//   ],
//   autoApplyEligible: true
// }
```

### 2. Template Fix Handler (`handle-needs-template-fix.js`)

**Priority: 1 (High Impact)** — Adds missing DoR/DoD sections

**Functions:**

- `prepareFix(issue, validation)` → Fix data
  - Generates missing sections
  - Returns new issue body
  
- `applyFix(issue, fixData, githubAPI)` → Results
  - Updates issue body
  - Posts validation comment
  
**Example:**

```javascript
const fixData = prepareFix(issue, validation);
// Returns: {
//   originalBody: "...",
//   fixMarkdown: "## Definition of Ready\n...",
//   newBody: "...[original]...[sections added]",
//   missingCount: 2,
//   qualityIssues: [...]
// }
```

### 3. Type Assignment Handler (`handle-needs-type.js`)

**Priority: 2 (High Impact)** — Assigns issue type label

**Handles:** `type:bug`, `type:feature`, `type:epic`, `type:story`, `type:task`

**Functions:**

- `prepareTypeAssignment(issue, analysis, suggestions)` → Assignment data
  - Validates type suggestion
  - Detects current type
  - Determines if update needed
  
- `applyTypeAssignment(issue, assignment, githubAPI)` → Results
  - Updates labels
  - Posts comment with confidence

**Example:**

```javascript
const assignment = prepareTypeAssignment(issue, analysis, suggestions);
// {
//   applied: true,
//   proposed: 'type:bug',
//   current: 'type:feature',
//   confidence: 92,
//   needsUpdate: true
// }
```

### 4. Area Labeling Handler (`handle-needs-areas.js`)

**Priority: 3 (High Impact)** — Assigns area labels

**Handles:** `area:frontend`, `area:backend`, `area:ci`, `area:docs`, `area:security`

**Functions:**

- `prepareAreaAssignments(issue, suggestions)` → Assignment data
  - Filters areas by 70%+ confidence
  - Identifies add/remove operations
  
- `applyAreaAssignments(issue, assignments, githubAPI)` → Results
  - Updates labels
  - Posts areas with confidence percentages

**Example:**

```javascript
const assignments = prepareAreaAssignments(issue, suggestions);
// {
//   applied: true,
//   proposed: [
//     { label: 'area:backend', confidence: 85 },
//     { label: 'area:security', confidence: 80 }
//   ],
//   labelsToAdd: ['area:backend', 'area:security'],
//   needsUpdate: true
// }
```

### 5. Priority Handler (`handle-needs-priority.js`)

**Priority: 4 (Medium Impact)** — Assigns priority label

**Handles:** `priority:critical`, `priority:important`, `priority:normal`

**Features:**

- Updates priority label
- Posts priority assignment comment
- Dry-run support

### 6. Assignee Handler (`handle-needs-assignee.js`)

**Priority: 5 (Medium Impact)** — Assigns users/teams

**Features:**

- Filters assignees by 75%+ confidence
- Removes @ symbol for GitHub API
- Posts assignee suggestions with reasoning

### 7. Milestone Handler (`handle-needs-milestone.js`)

**Priority: 6 (Low Impact)** — Assigns version milestones

**Features:**

- Semantic version support (v1.0, v2.1.0)
- Release reference detection
- Skips if already assigned

### Central Orchestrator (`issue-remediation-orchestrator.js`)

**Coordinates all handlers and manages batch operations**

**CLI Interface:**

```bash
# Single issue
node issue-remediation-orchestrator.js --issue=1234

# Batch processing with label
node issue-remediation-orchestrator.js --label=status:needs-triage --batch=10

# Dry-run preview
node issue-remediation-orchestrator.js --issue=1234 --dry-run

# Verbose output
node issue-remediation-orchestrator.js --issue=1234 --verbose
```

**Features:**

- Fetches issues from GitHub API
- Runs triage assessment
- Routes to handlers in priority order
- Tracks execution results
- Generates remediation reports
- Handles pagination for batch operations

**Example Output:**

```
🤖 Issue Remediation Orchestrator

🔧 Remediating #1234: Bug in authentication system

📋 Remediation Plan: #1234
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Handlers to Execute:** 4
  1. template-fix (high impact)
  2. type-assignment (high impact)
  3. area-labeling (high impact)
  4. priority-assessment (medium impact)

**Confidence:** 87%
**Auto-Apply:** ✅ Yes

**Type:** type:bug
**Areas:** area:backend, area:security
**Template Issues:** 1 to fix

✅ template-fix: Success
✅ type-assignment: Success
✅ area-labeling: Success
✅ priority-assessment: Success
```

## Execution Priority

Handlers execute in order of impact:

| Priority | Handler | Impact | Purpose |
|----------|---------|--------|---------|
| 1 | template-fix | High | Complete issue templates (DoR/DoD) |
| 2 | type-assignment | High | Assign issue type |
| 3 | area-labeling | High | Assign affected areas |
| 4 | priority-assessment | Medium | Assign priority level |
| 5 | assignee-suggestion | Medium | Suggest responsible users |
| 6 | milestone-assignment | Low | Link to version milestone |
| 7 | project-assignment | Low | Assign to project board |
| 8 | relationship-mapping | Low | Validate parent/blocked/blocking |

## Integration with Phase 2

Each Phase 3 handler receives Phase 2 suggestions:

```javascript
const assessment = assessTriageNeeds(issue);
const plan = generateRemediationPlan(issue, assessment);

// Handler receives recommendations from Phase 2
const recommendations = plan.recommendations;
// {
//   type: { suggestion, confidence, reason },
//   areas: [{ label, confidence, reason }],
//   priority: { level, confidence, reason },
//   assignees: [{ assignee, confidence, reason }],
//   milestone: { suggestion, confidence, reason },
//   templateFixes: [{ type, section, action, priority }],
//   relationshipFixes: [...]
// }
```

## Confidence Thresholds

- **Type:** 70% minimum for consideration, 85%+ for auto-apply
- **Areas:** 70% minimum for consideration
- **Priority:** 70% minimum for consideration
- **Assignees:** 75% minimum for consideration
- **Milestone:** 75% minimum for consideration
- **Overall:** 85%+ confidence + 80%+ template completeness = auto-apply eligible

## Dry-Run Testing

All handlers support `--dry-run` mode for safe testing:

```bash
# Preview changes without applying
node issue-remediation-orchestrator.js --issue=1234 --dry-run

# Output shows what would be applied:
# 🔧 Remediating #1234: ...
# ✅ template-fix: dry-run - Would apply template fix
# ✅ type-assignment: dry-run - Would assign type
# etc.
```

## Batch Operations

Process multiple issues efficiently:

```bash
# Process 10 issues at a time with status:needs-triage label
node issue-remediation-orchestrator.js --label=status:needs-triage --batch=10

# Pagination automatic:
# - Fetches first 10 issues
# - Processes each
# - Fetches next 10
# - Continues until all processed

# Example against 352 issues:
# 📋 Processing issues with label: status:needs-triage
# 🔧 Remediating #1: ...
# ✅ template-fix: Success
# ... (processed 10 issues)
# 📊 Summary: 8/10 issues remediated successfully
# (continues with next batch)
```

## Reporting

Each remediation generates a report:

```javascript
const report = generateRemediationReport(plan, executionResults);
// {
//   issueNumber: 1234,
//   handlers: {
//     total: 4,
//     executed: 4,
//     failed: 0,
//     skipped: 0
//   },
//   suggestions: {
//     type: 1,
//     areas: 2,
//     priority: 1,
//     assignees: 1,
//     milestone: 1,
//     project: 0
//   },
//   success: true
// }
```

## Extending Phase 3

To add more handlers:

1. **Create handler file:** `handle-needs-*.js`
2. **Implement handler function:**

   ```javascript
   export async function handleNeeds*(issue, recommendations, options = {}) {
     // Prepare, validate, apply changes
     return { success, ... };
   }
   ```

3. **Register in orchestrator:**

   ```javascript
   const handlers = {
     'handler-name': (iss, rec) => handleNeedsCustom(iss, rec, options),
     ...
   };
   ```

4. **Add to priority list in triage router**
5. **Document in PHASE-3-GUIDE.md**

## Testing

**Unit Tests:** Test individual handlers in isolation
**Integration Tests:** Test handlers with mock GitHub API
**Batch Tests:** Test against real issues with --dry-run

## Phase 4: Automation

Next phase will integrate with GitHub Actions:

- **Scheduled trigger:** Run nightly on issues with status labels
- **Event trigger:** Run on issue creation/modification
- **Reporting:** Generate summary reports
- **Metrics:** Track remediation progress over time

## References

- **Phase 1:** [AUDIT-GUIDE.md](./automation/AUDIT-GUIDE.md) — Issue metadata audit
- **Phase 2:** [TRIAGE-AGENT-GUIDE.md](./TRIAGE-AGENT-GUIDE.md) — Analysis modules
- **Phase 3:** This guide — Remediation handlers
- **Epic:** [Issue #1679](https://github.com/lightspeedwp/.github/issues/1679)
- **Phase 3:** [Issue #1691](https://github.com/lightspeedwp/.github/issues/1691)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

# Phase 3: Issue Remediation Implementation Guide

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

**Last Updated:** 2026-08-09
**Status:** Phase 3 implementation complete, ready for integration testing

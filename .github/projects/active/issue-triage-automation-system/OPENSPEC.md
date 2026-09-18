---
file_type: openspec
title: Issue Triage Automation System — Technical Specification
description: Technical specification and API documentation for issue-triage-automation-system
created_date: 2026-08-12
last_updated: 2026-09-03
status: published
version: 1.0.0
---

# Issue Triage Automation System — Technical Specification

**Version:** 1.0.0  
**Status:** Published (Production Ready)  
**Last Updated:** September 3, 2026  
**Project:** Issue Triage Automation System  
**Epic:** [#1376](https://github.com/lightspeedwp/.github/issues/1376)  

---

## Overview

The Issue Triage Automation System is a comprehensive GitHub Actions-based workflow that automatically assigns metadata (type labels, milestones, DoR/DoD sections) to issues at creation time and provides bulk remediation capabilities for non-compliant issues.

**Key Components:**
1. MilestoneAssignmentAgent — Intelligent milestone routing (6 priority-ordered rules)
2. RemediationChecklistGenerator — Type-specific compliance templates
3. issue-create-enhanced.yml — Enhanced issue creation workflow
4. issue-remediation-bulk.yml — Bulk remediation with dry-run preview
5. Supporting infrastructure — Scripts, documentation, integration hooks

---

## System Architecture

### Component Overview

```
GitHub Issues (raw)
    ↓
issue-create-enhanced.yml (workflow)
    ↓ invokes
┌─────────────────────────────────┐
│ MilestoneAssignmentAgent        │  → Assigns milestone (6 rules, 95%-50% confidence)
│ RemediationChecklistGenerator   │  → Posts DoR/DoD checklist
└─────────────────────────────────┘
    ↓
GitHub Issues (enhanced)
    ├─ Type label (type:bug, type:feature, etc.)
    ├─ Milestone (v1.0, v1.5, backlog, etc.)
    ├─ Remediation checklist (if template gaps detected)
    └─ Parent/Epic link (if applicable)

Existing Compliance Issues (250+)
    ↓
issue-remediation-bulk.yml (workflow)
    ├─ Dry-run mode (preview, no changes)
    └─ Apply mode (actual changes)
    ↓ invokes
┌─────────────────────────────────┐
│ MilestoneAssignmentAgent        │  → Assigns milestones (batch)
│ RemediationChecklistGenerator   │  → Posts checklists (batch)
│ Compliance Reporter             │  → Generates reports
└─────────────────────────────────┘
    ↓
GitHub Issues (100% compliant)
    + Reports (JSON, CSV)
    + Artifacts (results, metrics)
```

---

## API Reference

### MilestoneAssignmentAgent

**Location:** `scripts/agents/includes/milestone-assignment.js`  
**Type:** ES Module (Node.js)  
**Dependencies:** `@actions/github`, `@actions/core`  

#### Class: MilestoneAssignmentAgent

```javascript
import { MilestoneAssignmentAgent } from './milestone-assignment.js';

const agent = new MilestoneAssignmentAgent(github, owner, repo);
const milestone = await agent.assignMilestone(issue);
```

**Constructor:**
```javascript
new MilestoneAssignmentAgent(github, owner, repo)
```

**Parameters:**
- `github` (object) — @actions/github Octokit instance
- `owner` (string) — Repository owner
- `repo` (string) — Repository name

**Methods:**

#### `async loadMilestones()`
Loads all milestones from the repository and builds lookup maps.

**Returns:** `Promise<Array<Milestone>>`

**Example:**
```javascript
const milestones = await agent.loadMilestones();
```

---

#### `async assignMilestone(issue)`
Assigns a milestone to an issue based on 6 priority-ordered rules.

**Parameters:**
- `issue` (object) — GitHub issue object

**Returns:** `Promise<{ milestone: Milestone, rule: string, confidence: number }>`

**Assignment Rules (in priority order):**

| # | Rule | Pattern | Confidence | Example |
|---|------|---------|-----------|---------|
| 1 | Version Keywords | Title contains "v1.5", "v2.0" | 95% | "Fix v1.5 bug" → v1.5 |
| 2 | Epic Type | Issue has `type:epic` label | 90% | Epic issue → v2.0 |
| 3 | Release Issues | Issue has `type:release` label | 90% | Release issue → release |
| 4 | Phase Keywords | Title contains "Phase 2A/2B/2C" | 85% | "Phase 2B work" → Phase 2B |
| 5 | High Priority | Issue has `priority:critical` or `priority:urgent` | 80% | priority:urgent → current |
| 6 | Backlog Fallback | Default milestone | 50% | No pattern match → backlog |

**Example:**
```javascript
const result = await agent.assignMilestone(issue);
console.log(result);
// {
//   milestone: { title: "v1.5", ... },
//   rule: "version_keywords",
//   confidence: 0.95
// }
```

---

### RemediationChecklistGenerator

**Location:** `scripts/agents/includes/remediation-checklist-generator.js`  
**Type:** ES Module (Node.js)  
**Dependencies:** `@actions/github`  

#### Class: RemediationChecklistGenerator

```javascript
import { RemediationChecklistGenerator } from './remediation-checklist-generator.js';

const generator = new RemediationChecklistGenerator(github, owner, repo);
await generator.postRemediationChecklist(issue);
```

**Constructor:**
```javascript
new RemediationChecklistGenerator(github, owner, repo)
```

**Methods:**

#### `analyzeCompliance(issue)`
Analyzes an issue for DoR/DoD compliance gaps.

**Parameters:**
- `issue` (object) — GitHub issue object

**Returns:** `object`
```javascript
{
  issueNumber: number,
  title: string,
  type: string,      // type:* label or "unknown"
  hasDoR: boolean,
  hasDoD: boolean,
  missingDoR: boolean,
  missingDoD: boolean,
  isNonCompliant: boolean
}
```

**Example:**
```javascript
const compliance = generator.analyzeCompliance(issue);
if (compliance.isNonCompliant) {
  // Post remediation checklist
}
```

---

#### `generateDoRTemplate(issueType)`
Generates a Definition of Ready template for a specific issue type.

**Parameters:**
- `issueType` (string) — Issue type (e.g., "type:bug", "type:feature")

**Returns:** `string` — Markdown DoR checklist

**Supported Types:**
- `type:task`
- `type:bug`
- `type:feature`
- `type:epic`
- `type:design`
- `type:refactor`
- `type:test`
- `type:a11y`
- `type:security`
- `type:release` (and others)

**Example:**
```javascript
const doR = generator.generateDoRTemplate("type:bug");
console.log(doR);
// ## Definition of Ready (DoR)
// - [ ] Issue is reproducible
// - [ ] Environment specified
// - [ ] ...
```

---

#### `async postRemediationChecklist(issue)`
Posts a remediation checklist comment to an issue if DoR/DoD gaps detected.

**Parameters:**
- `issue` (object) — GitHub issue object

**Returns:** `Promise<{ comment_id: number, success: boolean }>`

**Example:**
```javascript
const result = await generator.postRemediationChecklist(issue);
if (result.success) {
  console.log(`Posted checklist (comment #${result.comment_id})`);
}
```

---

## Workflows

### issue-create-enhanced.yml

**Trigger:** Manual dispatch (workflow_dispatch)  
**Purpose:** Create new issues with automatic metadata assignment

**Inputs:**
```yaml
template_key:           # Required: Issue template (23 options)
title:                  # Required: Issue title
body:                   # Optional: Additional context
labels:                 # Optional: Extra labels (comma-separated)
assignee:               # Optional: Issue assignee
milestone:              # Optional: Manual milestone override
```

**Processing Steps:**
1. Fetch issue template by key
2. Apply type label automatically
3. Assign milestone via MilestoneAssignmentAgent
4. Set milestone (if assigned)
5. Link to parent/epic (if applicable)
6. Generate and post remediation checklist
7. Add custom labels

**Template Options:** task, bug, feature, design, epic, story, improvement, code-refactor, build-ci, automation, testing-coverage, performance, a11y, security, compatibility, integration-issue, release, maintenance, documentation, research, audit, code-review, ai-ops, content-modelling

---

### issue-remediation-bulk.yml

**Trigger:** Manual dispatch (workflow_dispatch)  
**Purpose:** Bulk remediate non-compliant issues

**Inputs:**
```yaml
days:                    # Optional: Issues from last N days (default: 7)
dry_run:                 # Optional: Preview mode (default: true)
remediate_milestones:    # Optional: Assign milestones (default: true)
remediate_labels:        # Optional: Add type labels (default: true)
remediate_templates:     # Optional: Post checklists (default: true)
```

**Processing Steps:**
1. Fetch non-compliant issues (created in last N days)
2. For each issue:
   - Assign milestone (if missing)
   - Infer and apply type label
   - Post remediation checklist (if template gaps)
3. Generate compliance reports
   - JSON: Detailed results
   - CSV: Milestone assignments
   - Summary: Metrics
4. Upload artifacts
5. (Optionally) Trigger labeling workflow for validation

**Dry-Run Mode (dry_run=true):**
- ✅ Preview all assignments
- ✅ Generate reports
- ❌ Do NOT make changes
- ❌ Do NOT post comments

**Apply Mode (dry_run=false):**
- ✅ Make all changes
- ✅ Assign milestones
- ✅ Apply labels
- ✅ Post checklists
- ✅ Generate reports

---

## Configuration

### Milestone Mapping

**File:** `.github/config/milestones.json` (proposed)

Current milestone patterns are hard-coded. Future enhancement: externalize to config.

```json
{
  "version_keywords": {
    "pattern": "v(\\d+\\.\\d+)",
    "confidence": 0.95
  },
  "epic_type": {
    "label": "type:epic",
    "milestone": "v2.0",
    "confidence": 0.90
  },
  "phases": {
    "pattern": "Phase (\\d[A-Z])",
    "confidence": 0.85
  }
}
```

---

### Template Definitions

**File:** Built into `remediation-checklist-generator.js`

Each issue type has a hard-coded DoR/DoD template. Future enhancement: externalize to config files.

---

## Data Models

### Issue Type Enum

```javascript
const ISSUE_TYPES = [
  "type:task",
  "type:bug",
  "type:feature",
  "type:epic",
  "type:design",
  "type:refactor",
  "type:test",
  "type:a11y",
  "type:security",
  "type:release",
  "type:maintenance",
  "type:documentation",
  "type:research",
  "type:audit",
  "type:code-review",
  "type:ai-ops",
  "type:content-modelling",
  "type:improvement",
  "type:story",
  "type:code-refactor",
  "type:build-ci",
  "type:automation",
  "type:testing-coverage",
  "type:performance",
  "type:compatibility",
  "type:integration-issue"
];
```

---

### Milestone Assignment Result

```javascript
interface MilestoneAssignmentResult {
  milestone: {
    id: number,
    title: string,
    url: string
  },
  rule: string,           // "version_keywords", "epic_type", etc.
  confidence: number,     // 0.5 to 0.95
  reasoning: string       // Explanation for assignment
}
```

---

### Compliance Analysis Result

```javascript
interface ComplianceAnalysis {
  issueNumber: number,
  title: string,
  type: string,           // "type:bug", etc. or "unknown"
  hasDoR: boolean,
  hasDoD: boolean,
  missingDoR: boolean,
  missingDoD: boolean,
  isNonCompliant: boolean // true if missing either DoR or DoD
}
```

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Milestone not found" | Pattern matched but milestone doesn't exist | Create milestone or adjust rules |
| "API rate limit" | Too many API calls in short time | Implement exponential backoff |
| "Issue body too large" | Context size limit exceeded | Use file-based passing (Phase 2C fix) |
| "Template not found" | Invalid template_key in workflow input | Check template enum, use valid key |

---

## Performance Characteristics

| Operation | Time | Notes |
|-----------|------|-------|
| Load milestones | 200-500ms | Cached after first load |
| Assign single milestone | 50-100ms | Lookup + API call |
| Bulk assign (250 issues) | ~2-3 min | Batch processing |
| Dry-run (250 issues) | ~2-3 min | Same as apply (no changes made) |
| Generate reports | 100-200ms | File I/O only |

---

## Integration Points

### With labeling.yml

The existing `labeling.yml` workflow handles comprehensive label management. The issue triage system:
- Assigns type labels during creation
- Can trigger labeling.yml for full validation
- Follows same label conventions (type:*, priority:*, etc.)

---

### With PR linking

When an issue is linked to a PR, the system can optionally:
- Extract milestone from PR
- Sync back to issue
- Create bidirectional link

---

## Audit & Monitoring

### Compliance Metrics

The system tracks:
- Issues with type labels (%)
- Issues with milestones (%)
- Issues with DoR/DoD (%)
- Average assignment confidence
- Workflow execution time

### Future: Compliance Dashboard

Proposed metrics workflow to track long-term compliance trends.

---

## Roadmap

### Completed
- ✅ Phase 1: Implementation (PR #1377)
- ✅ Phase 2: Execution (PR #1488, #2639)
- ✅ Phase 2C: Bug fixes & enhancements

### In Progress
- 🟡 Audit & issue documentation (this phase)
- 🟡 Test coverage expansion

### Planned
- [ ] Test suite enhancement (T-004)
- [ ] Logging & observability (T-002)
- [ ] Troubleshooting guide (T-003)
- [ ] Extended milestone rules (E-001)
- [ ] Additional type templates (E-002)
- [ ] Compliance metrics workflow (E-003)

---

## Related Documentation

- **System Guide:** [docs/ISSUE_TRIAGE_AUTOMATION.md](../../docs/ISSUE_TRIAGE_AUTOMATION.md)
- **Project README:** [README.md](./README.md)
- **Audit Findings:** [AUDIT_ISSUES.md](./AUDIT_ISSUES.md)
- **Enhancement Tasks:** [ENHANCEMENT_TASKS.md](./ENHANCEMENT_TASKS.md)
- **Planning:** [PLANNING.md](./PLANNING.md)
- **Epic:** [GitHub #1376](https://github.com/lightspeedwp/.github/issues/1376)

---

**Version:** 1.0.0  
**Last Updated:** 2026-09-03  
**Owner:** CloudSpeed Engineering Team  
**Status:** ✅ Published (Production Ready)

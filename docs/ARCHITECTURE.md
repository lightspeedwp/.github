---
document_type: "Architecture Guide"
file_type: documentation
description: "Architecture and operational guide for the Issue Management Orchestration system"
version: "1.0"
created_date: 2026-08-27
last_updated: 2026-08-27
authors: ["LightSpeed Team"]
owners: ["lightspeedwp"]
openspec_status: "production"
openspec_labels:
  - "openspec:status/production"
  - "openspec:domain/documentation"
  - "openspec:priority/high"
---

# Issue Management System Architecture

Comprehensive guide to the Issue Management Orchestration system design, components, data flows, integration points, and operational procedures.

## Quick Navigation

- [System Architecture](#system-architecture) — Visual overview & components
- [The 5 Agent Scripts](#the-5-agent-scripts) — How each agent works
- [Data Flow Diagrams](#data-flow-diagrams) — Issue processing pipeline
- [Operational Procedures](#operational-procedures-how-it-works-in-practice) — How it runs
- [Integration Points](#integration-points) — Connected systems
- [Performance](#performance-characteristics) — Speed & resources
- [Troubleshooting](#troubleshooting-guide) — Common issues & fixes
- [Related Docs](#related-documentation) — Links to other guides

---

## System Architecture

The Issue Management Orchestration system processes GitHub issues through a 7-stage pipeline triggered by three mechanisms:

### Pipeline Stages

1. **Setup** (50ms) — Initialize workflow context
2. **Content Analysis** (250ms) — Detect issue type (8 patterns)
3. **Labeling** (175ms) — Apply consistent labels
4. **Enrichment** (350ms) — Add type-specific templates (conditional on confidence >= 0.80)
5. **Validation** (125ms) — Verify issue quality (7 checks)
6. **Reporting** (125ms) — Log execution and collect metrics
7. **Summary** (75ms) — Post comment and save report

**Total Processing Time**: ~1,250ms per issue (typical)

### Trigger Types

| Trigger | When | Processing |
|---------|------|-----------|
| **Event-based** | issue.opened, issue.edited, issue.reopened | Immediate, single issue |
| **Schedule-based** | 0 8 ** * (daily 08:00 UTC) | Batch, all needs-triage issues |
| **Manual** | workflow_dispatch (user-initiated) | On-demand, optional parameters |

### Workflow File & Agents

**Workflow**: `.github/workflows/issue-management-orchestration.yml` (400+ LOC)  
**Agent Scripts**: `scripts/automation/{name}-agent.js` (5 agents, 1,480 LOC total)  
**Reports**: `.github/reports/issue-management/{report-id}.json`  
**Configuration**: Environment variables in workflow YAML

---

## The 5 Agent Scripts

### 1. content-analysis-agent.js (Type Detection & Analysis)

**Purpose**: Analyze issue content and detect type

**Features**:

- 8 type patterns (bug, feature, documentation, task, security, performance, a11y, design)
- Confidence scoring (0-1 scale): how certain the type detection is
- Keyword extraction: pulls tech keywords, platforms, urgency indicators
- Structure quality assessment: evaluates title/body completeness

**Time**: ~250ms per issue

**Inputs**: Issue title, body, metadata  
**Outputs**:

```json
{
  "detected_type": "bug",
  "confidence": 0.95,
  "keywords": ["login", "broken", "error", "token"],
  "structure_quality": "good"
}
```

**Error Handling**: Low confidence (< 0.80) triggers `needs-clarification` label

---

### 2. labeling-agent.js (Label Governance & Application)

**Purpose**: Apply consistent labels following governance rules

**Features**:

- Label governance rules (type, status, priority, area, platform)
- Conflict detection: logs when user-applied labels conflict
- Max labels enforcement: respects 15-label limit per issue
- Openspec label application: adds openspec:status/production, openspec:domain/*, openspec:priority/*

**Time**: ~175ms per issue

**Inputs**: Detected type, keywords, confidence  
**Outputs**:

```json
{
  "applied_labels": ["type:bug", "status:needs-triage", "priority:high"],
  "removed_labels": [],
  "conflicts": []
}
```

**Error Handling**: Conflict detected → logs for manual review, keeps original label

---

### 3. enrichment-agent.js (Template Injection & Enhancement)

**Purpose**: Add type-specific structured content

**Features**:

- 8 type-specific templates (bug, feature, security, documentation, etc.)
- Conditional execution: only runs if confidence >= 0.80
- Section injection: adds acceptance criteria, testing notes, environment, etc.
- Type-aware: customizes content based on issue type

**Time**: ~350ms if runs; ~0ms if conditional skip

**Inputs**: Detected type, confidence score  
**Outputs**:

```json
{
  "sections_added": 5,
  "enrichment_performed": true,
  "sections": ["Reproduction Steps", "Expected Behavior", "Actual Behavior", "Testing", "Environment"]
}
```

**Condition**: `ENABLE_ENRICHMENT=true AND confidence >= ENRICHMENT_THRESHOLD (0.80)`  
**Error Handling**: Confidence < 0.80 → skips enrichment, adds needs-clarification label

---

### 4. validation-agent.js (Quality Assurance & Checks)

**Purpose**: Verify issue quality and consistency

**Features**:

- 7 validation checks:
  1. Title quality (5-200 chars, starts capitalized)
  2. Body quality (20+ chars adequate detail)
  3. Type label present (exactly one required)
  4. Status label present (exactly one required)
  5. Priority label present (exactly one required)
  6. Type-body alignment (content matches detected type)
  7. Language check (no offensive words)
- Pass/warning/fail status reporting
- Type-body alignment: verifies keywords match type

**Time**: ~125ms per issue

**Inputs**: Issue content, applied labels, detected type  
**Outputs**:

```json
{
  "overall_status": "pass",
  "checks": [
    {"name": "title_quality", "status": "pass"},
    {"name": "body_quality", "status": "pass"},
    ...
  ],
  "pass_count": 7,
  "warning_count": 0,
  "fail_count": 0
}
```

**Error Handling**: Warnings logged, don't block workflow; failures documented in report

---

### 5. reporting-agent.js (Metrics & Logging)

**Purpose**: Document execution and collect performance data

**Features**:

- Execution logging: timestamp, trigger type, duration, agent status
- Metrics collection: labels applied, sections added, validation status
- Report generation: saves JSON report to `.github/reports/issue-management/`
- Daily aggregation: combines per-issue metrics into daily report
- Comment generation: creates markdown comment for issue

**Time**: ~125ms per issue

**Inputs**: All agent outputs, execution timeline  
**Outputs**:

```json
{
  "report_id": "report-20260827-xyz789",
  "timestamp": "2026-08-27T14:30:00Z",
  "issue_id": 123,
  "trigger_type": "issue.opened",
  "steps_completed": 5,
  "duration_ms": 1250,
  "status": "success",
  "agents": {...},
  "metrics": {...}
}
```

**Error Handling**: Saves partial reports even if some agents fail

---

## Data Flow Diagrams

### Issue Processing Pipeline (Example: Bug Report)

```
INPUT: User creates issue
  Title: "Login button broken on iOS"
  Body: "Can't login on Safari. Error: invalid token"

↓ Content Analysis (type detection)
  Pattern Matching → bug pattern found (0.95 confidence)
  Keyword Extraction → ["login", "broken", "error", "token"]
  Quality Assessment → "good" (clear title, detailed body)

↓ Labeling (apply consistent labels)
  Type Label → type:bug
  Status Label → status:needs-triage
  Priority Label → priority:high (bug = high priority)
  Check Conflicts → none found
  Applied Labels → 3 total

↓ Enrichment (confidence 0.95 >= 0.80 ✓)
  Select Template → bug template
  Add Sections → Reproduction, Expected, Actual, Testing, Environment
  Sections Added → 5

↓ Validation (7 checks)
  Title Quality ✓ pass (title is clear, 31 chars)
  Body Quality ✓ pass (body has detail, 89 chars)
  Type Label ✓ pass (type:bug applied)
  Status Label ✓ pass (status:needs-triage applied)
  Priority Label ✓ pass (priority:high applied)
  Type-Body Alignment ✓ pass (bug keywords in body)
  Language Check ✓ pass (no offensive words)
  Overall Status → PASS

↓ Reporting (metrics & logging)
  Report ID → report-20260827-xyz789
  Metrics → labels: 3, sections: 5, validation: pass
  Execution Time → 1,200ms
  Save Report → .github/reports/issue-management/report-20260827-xyz789.json

↓ Summary (post comment)
  Generate Comment → workflow summary with metrics
  Post to Issue → comment visible on GitHub
  Link Report → report ID referenced

OUTPUT: Updated Issue
  ✓ Labels: type:bug, status:needs-triage, priority:high
  ✓ Sections: 5 enrichment templates added
  ✓ Comment: workflow summary posted
  ✓ Report: saved as JSON
```

---

## Operational Procedures: How It Works in Practice

### Scenario 1: Issue Creation (Event-Based)

**User Action**: Create new GitHub issue

**What Happens**:

1. User fills in issue title and body
2. GitHub fires `issue.opened` webhook
3. Workflow automatically triggers
4. Setup initializes (50ms)
5. Content analysis runs → type detected
6. Labeling runs → labels applied
7. Enrichment runs (if confidence >= 0.80) → sections added
8. Validation runs → quality checks performed
9. Reporting runs → execution logged, report saved
10. Summary posts → comment appears on issue
11. Done! Issue now has labels, enrichment, and workflow summary (total: ~1.2 seconds)

**User Experience**: Labels appear instantly, enrichment sections added, comment shows processing results

---

### Scenario 2: Daily Maintenance (Schedule-Based)

**Trigger**: 08:00 UTC cron job

**What Happens**:

1. Cron trigger fires at 08:00 UTC
2. Workflow starts in batch mode
3. Query: finds all issues with `status:needs-triage`
4. For each issue (50-100 total):
   - All agents run (same as event flow)
   - Metrics collected
   - Report saved
5. Daily aggregation:
   - Total issues processed: 87
   - Avg processing time: 950ms
   - Success rate: 97.2%
   - Type distribution: 28 bugs, 25 features, ...
   - Label accuracy: 94.1%
6. Daily report saved: `.github/reports/issue-management/daily-2026-08-27.json`
7. Total time: 15-30 minutes for all issues

**Result**: All issues in needs-triage state get labels, enrichment, validation in consistent manner

---

### Scenario 3: Manual Operation (On-Demand)

**User Command**: `gh workflow run issue-management-orchestration.yml [options]`

**Examples**:

```bash
# Run full workflow on all issues
gh workflow run issue-management-orchestration.yml

# Process single specific issue
gh workflow run issue-management-orchestration.yml \
  -f issue_number=123

# Run only validation agent
gh workflow run issue-management-orchestration.yml \
  -f action=validate

# Analyze specific issue
gh workflow run issue-management-orchestration.yml \
  -f issue_number=456 \
  -f action=analyze
```

**Available Actions**: analyze, label, enrich, validate, all (default)

---

## Integration Points

### GitHub API Integration

**Permissions Required**:

- `issues:write` — apply labels, post comments
- `contents:read` — read workflow files

**API Operations**:

- Get issue details (title, body, labels, metadata)
- Apply/remove labels (batch operation)
- Post/update comments
- Query issues by criteria
- Rate limit: ~5,000 calls/hour

**Rate Limit Handling**:

- Batch operations to reduce calls
- Caching where possible
- Queue mechanism for overflow
- Exponential backoff on 429 responses

---

### Related Automation Scripts

**Available via Orchestrator** (`scripts/automation/orchestrator.js`):

- 13 automation scripts for issue management
- Commands: audit-metadata, update-bulk, manage-stale, allocate-milestones, etc.
- Profiler: baseline performance metrics
- Registry: complete documentation

**Integration Pattern**:

```bash
# Use orchestrator for unified access
node scripts/automation/orchestrator.js audit-metadata --repo lightspeedwp/.github

# Or direct script access
node scripts/automation/audit-issue-metadata.js --repo lightspeedwp/.github
```

---

### Related GitHub Workflows

**Complementary Workflows**:

- Label sync (PRs ↔ Issues)
- PR triage automation
- Release process automation
- Custom issue handlers

**Integration**: Results saved to `.github/reports/issue-management/` for cross-workflow access

---

## Performance Characteristics

### Execution Time Breakdown

| Component | Time | % |
|-----------|------|---|
| Setup | 50ms | 4% |
| Content Analysis | 250ms | 20% |
| Labeling | 175ms | 14% |
| Enrichment | 350ms | 28% |
| Validation | 125ms | 10% |
| Reporting | 125ms | 10% |
| Summary | 75ms | 6% |
| Workflow Overhead | 100ms | 8% |
| **TOTAL** | **1,250ms** | **100%** |

**Notes**:

- Times are averages; actual varies by content complexity
- Enrichment: 350ms if runs, 0ms if conditional skip
- Batch processing: parallelizes across issues (but sequential agents per issue)

### Resource Usage

- **Memory per run**: 10-15 MB
- **Disk per report**: ~5 KB JSON
- **API calls**: ~5 per issue
- **Timeout**: 10 minutes (rarely needed; typical < 5 minutes)

### Scalability

| Scenario | Duration |
|----------|----------|
| Single issue | 1-2 seconds |
| Batch (50 issues) | 15-20 minutes |
| Daily batch (100 issues) | 20-30 minutes |
| Concurrency | 1 per issue (sequential) |

---

## Troubleshooting Guide

### Workflow Not Triggering

**Symptoms**: Created issue but no workflow ran, no labels applied

**Diagnosis**:

1. Check: GitHub Actions enabled in Settings
2. Check: `.github/workflows/issue-management-orchestration.yml` exists
3. Check: Workflow file has valid YAML syntax

**Solutions**:

- Enable GitHub Actions: Settings → Actions → General → Allow all actions
- Verify workflow file committed to repository
- Check GitHub Actions tab for syntax errors

---

### Labels Not Applied

**Symptoms**: Workflow runs but labels don't appear

**Diagnosis**:

1. Check workflow logs: GitHub Actions → workflow run → logs
2. Check: Label names exist in repository settings
3. Check: GitHub token has `issues:write` permission

**Solutions**:

- Verify label names match `.github/labels.yml`
- Ensure GitHub token has `issues:write` scope
- Check for API rate limiting in logs
- Reduce batch size if rate limited

---

### Enrichment Not Running

**Symptoms**: Type detected but template sections not added

**Diagnosis**:

1. Check logs for confidence score
2. Check: `ENABLE_ENRICHMENT=true` in workflow
3. Check: Confidence >= `ENRICHMENT_THRESHOLD` (0.80)

**Solutions**:

- Confidence must be >= 0.80; check type detection accuracy
- Verify environment variables in workflow YAML
- Review type detection logic for false negatives

---

### Performance Degradation

**Symptoms**: Workflow taking 2-3 seconds instead of typical 1-1.5

**Diagnosis**:

1. Check workflow logs for bottleneck component
2. Compare execution time against baseline metrics
3. Check for API rate limiting

**Solutions**:

- Review Phase 2 optimization guide for improvements
- Implement caching (see optimization roadmap)
- Reduce batch size for scheduled runs
- Profile agents using `profiler.js`

---

### Comment Not Posted

**Symptoms**: Workflow succeeds but no comment on issue

**Diagnosis**:

1. Check reporting agent logs
2. Check: GitHub token permissions
3. Check: Comment template generation

**Solutions**:

- Verify `issues:write` permission in token
- Check comment formatting in reporting agent
- Review reporting agent logs for errors

---

## Architecture Decisions

### Why Sequential Agents (Not Parallel)?

**Decision**: Agents run sequentially, not in parallel

**Rationale**:

- Labeling needs content analysis results
- Enrichment needs labeling results
- Sequential ensures consistency
- Prevents race conditions on GitHub API

**Trade-off**: Slightly longer (1.2s) vs. guaranteed correctness

### Why Conditional Enrichment?

**Decision**: Enrichment only runs if confidence >= 0.80

**Rationale**:

- Low confidence means type uncertain
- Adding template without certainty wastes space
- Can't select correct template without certainty
- Applies `needs-clarification` label instead

**Trade-off**: Some issues don't get enrichment vs. avoiding incorrect enrichment

### Why One Workflow Per Issue?

**Decision**: Concurrency control prevents parallel workflows

**Rationale**:

- Prevents race conditions on label application
- Ensures consistent operation order
- Avoids API conflicts

**Trade-off**: Slightly slower for bulk operations vs. guaranteed consistency

---

## Related Documentation

- **[Issues Agent Guide](./../agents/issues.agent.md)** — Agentic behavior and decision-making
- **[Script Registry](./../../scripts/SCRIPT-REGISTRY.md)** — Complete automation scripts reference
- **[Quick-Start Guide](./ISSUE_MANAGEMENT_QUICKSTART.md)** — Getting started in 5 minutes
- **[Label Inventory](./LABEL_INVENTORY.md)** — Complete label catalog
- **[Issue Triage Guide](./ISSUE_TRIAGE.md)** — Manual triage procedures

---

**Architecture Version**: 1.0  
**Status**: Production Ready  
**Openspec Status**: production  
**Last Updated**: 2026-08-27  
**Related Issues**: #2388

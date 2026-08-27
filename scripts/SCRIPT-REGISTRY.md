---
document_type: "Script Registry"
status: "production"
openspec_status: "production"
openspec_labels:
  - "openspec:status/production"
  - "openspec:domain/automation"
  - "openspec:priority/high"
version: "1.0"
created_date: 2026-08-27
last_updated: 2026-08-27
---

# Automation Scripts Registry

Complete catalogue of all automation scripts used in issue and PR management workflows. This registry serves as the central reference for script discovery, usage, performance characteristics, and troubleshooting.

**Quick Links**:
- [Script Orchestrator](#script-orchestrator) — Unified entry point for all scripts
- [Performance Baselines](#performance-baselines) — Execution times and resource usage
- [Integration Points](#integration-points) — How scripts connect
- [Troubleshooting](#troubleshooting) — Common issues and solutions

---

## Script Orchestrator

The **orchestrator.js** serves as a unified entry point for all automation scripts. Use it to run scripts with dependency management, consistent error handling, and standardized logging.

### Usage

```bash
# Run a script via orchestrator
node scripts/automation/orchestrator.js <action> [options]

# Display all available actions
node scripts/automation/orchestrator.js help

# Display specific action help
node scripts/automation/orchestrator.js help <action>

# Display registry overview
node scripts/automation/orchestrator.js registry
```

### Available Actions

| Action | Script | Category | Priority | Time |
|--------|--------|----------|----------|------|
| `audit-metadata` | audit-issue-metadata.js | audit | 🔴 high | 1600ms |
| `update-bulk` | bulk-issue-metadata-updater.js | update | 🔴 high | 1100ms |
| `manage-stale` | manage-stale-issues.js | maintenance | 🟡 medium | 900ms |
| `allocate-milestones` | allocate-to-milestone.js | planning | 🟡 medium | 1400ms |
| `review-labels` | review-meta-labels.js | audit | 🟡 medium | 900ms |
| `sync-pr-labels` | sync-pr-labels.js | sync | 🟡 medium | 900ms |
| `validate-staging` | staging-validation.js | validation | 🔴 high | 1600ms |
| `handle-all` | handlers-orchestrator.js | orchestration | 🔴 high | 900ms |
| `triage-all` | pr-triage-orchestrator.js | orchestration | 🔴 high | 1100ms |
| `add-template-sections` | add-issue-template-sections.js | template | 🟢 low | 900ms |
| `review-status` | review-status-labels.js | audit | 🟡 medium | 1400ms |

---

## Performance Baselines

Established 2026-08-27 via automated profiler.

### Summary Metrics

- **Total Scripts**: 11+ automation scripts
- **Total Size**: 145.82 KB
- **Total LOC**: 4,195 lines
- **Average Execution**: 1,067 ms per script
- **Total Estimated Memory**: 10.33 MB

### By Performance Tier

#### 🟢 Fast (<500ms)
- **label-orchestrator.js** — 100ms | 3.45 KB | 108 LOC

#### 🟡 Medium (500-1100ms)
- add-issue-template-sections.js — 900ms | 10.94 KB | 300 LOC
- manage-stale-issues.js — 900ms | 12.05 KB | 381 LOC
- review-meta-labels.js — 900ms | 8.85 KB | 278 LOC
- sync-pr-labels.js — 900ms | 8.94 KB | 288 LOC
- handlers-orchestrator.js — 900ms | 9.27 KB | 264 LOC
- bulk-issue-metadata-updater.js — 1,100ms | 10.95 KB | 338 LOC
- pr-triage-orchestrator.js — 1,100ms | 11.77 KB | 363 LOC

#### 🔴 Slow (>1100ms) — Optimization Candidates
- allocate-to-milestone.js — 1,400ms | 23.86 KB | 616 LOC
- review-status-labels.js — 1,400ms | 13.73 KB | 417 LOC
- staging-validation.js — 1,600ms | 15.09 KB | 406 LOC
- audit-issue-metadata.js — 1,600ms | 16.93 KB | 436 LOC

---

## Individual Script Documentation

### 1. audit-issue-metadata.js

**Purpose**: Audit the completeness and quality of issue metadata across a repository

**Category**: Audit | **Priority**: High | **Est. Time**: 1600ms

**Features**:
- Scans all issues in a repository
- Validates required metadata fields
- Checks label consistency
- Identifies missing or invalid data
- Generates audit report

**Usage**:
```bash
node scripts/automation/orchestrator.js audit-metadata \
  --repo lightspeedwp/.github \
  --token $GITHUB_TOKEN \
  --output json
```

**Options**:
- `--repo` (required) — Repository name
- `--token` (required) — GitHub API token
- `--output` — Output format (json|csv|markdown)
- `--verbose` — Enable verbose logging

**Output**:
```json
{
  "total_issues": 245,
  "valid_issues": 238,
  "issues_with_issues": 7,
  "completeness_score": 0.97,
  "validation_results": [...]
}
```

**Integration Points**:
- Used by: update-bulk, allocate-milestones
- Depends on: GitHub API
- Output consumed by: reporting agents

**Optimization Opportunities**:
- Add result caching (200-300ms savings)
- Batch API requests (100ms savings)
- Parallel validation (200ms savings)
- **Target**: 1600ms → 1000ms

**Troubleshooting**:
- **Rate limit errors**: Add delay between API calls
- **Timeout**: Increase --timeout parameter
- **Large repos**: Use --batch-size to limit queries

---

### 2. bulk-issue-metadata-updater.js

**Purpose**: Bulk update metadata fields across multiple issues

**Category**: Update | **Priority**: High | **Est. Time**: 1100ms

**Features**:
- Update multiple issues in batch
- Apply consistent metadata
- Dry-run mode for preview
- Batch size control
- Error recovery

**Usage**:
```bash
node scripts/automation/orchestrator.js update-bulk \
  --repo lightspeedwp/.github \
  --token $GITHUB_TOKEN \
  --dryrun true
```

**Options**:
- `--repo` (required) — Repository name
- `--token` (required) — GitHub API token
- `--dryrun` — Preview changes without applying
- `--batch-size` — Issues per batch (default: 10)
- `--fields` — Metadata fields to update

**Integration Points**:
- Depends on: audit-issue-metadata results
- Used by: maintenance workflows
- Integrates with: GitHub API

**Performance Characteristics**:
- Batch processing optimized
- Rate limit aware
- 1100ms avg for 10-20 issues
- Linear scaling with issue count

**Troubleshooting**:
- **Partial failures**: Check batch logs
- **API throttling**: Reduce --batch-size
- **Memory issues**: Process in smaller batches

---

### 3. manage-stale-issues.js

**Purpose**: Identify and manage stale issues

**Category**: Maintenance | **Priority**: Medium | **Est. Time**: 900ms

**Features**:
- Find issues inactive for N days
- Apply stale label
- Generate stale report
- Customizable staleness threshold

**Usage**:
```bash
node scripts/automation/orchestrator.js manage-stale \
  --repo lightspeedwp/.github \
  --token $GITHUB_TOKEN \
  --days 30
```

**Options**:
- `--repo` (required) — Repository
- `--token` (required) — GitHub token
- `--days` — Inactivity threshold (default: 30)
- `--label` — Label to apply (default: status:stale)

**Integration Points**:
- Scheduled daily via GitHub Actions
- Outputs: stale issue list
- Used by: maintenance dashboard

**Troubleshooting**:
- **Missing issues**: Check date range
- **False positives**: Adjust --days threshold
- **Label conflicts**: Verify label exists

---

### 4. allocate-to-milestone.js

**Purpose**: Allocate issues to appropriate milestones

**Category**: Planning | **Priority**: Medium | **Est. Time**: 1400ms

**Features**:
- Intelligent milestone assignment
- Type-based allocation
- Priority-aware grouping
- Conflict resolution

**Usage**:
```bash
node scripts/automation/orchestrator.js allocate-milestones \
  --repo lightspeedwp/.github \
  --token $GITHUB_TOKEN \
  --milestone "v2.0"
```

**Options**:
- `--repo` (required)
- `--token` (required)
- `--milestone` — Target milestone
- `--criteria` — Allocation criteria

**Integration Points**:
- Depends on: audit-issue-metadata
- Used by: release planning
- Updates: GitHub milestone field

**Optimization Status**: 
- **Largest script** (616 LOC, 23.86 KB)
- **High refactoring potential**
- Target: 1400ms → 900ms

**Troubleshooting**:
- **Unassigned issues**: Check criteria
- **Performance slow**: Review LOC refactoring needed
- **Conflicts**: Check milestone permissions

---

### 5. review-meta-labels.js

**Purpose**: Audit and validate label metadata

**Category**: Audit | **Priority**: Medium | **Est. Time**: 900ms

**Features**:
- Validate label consistency
- Check label coverage
- Identify orphaned labels
- Report unused labels

**Usage**:
```bash
node scripts/automation/orchestrator.js review-labels \
  --repo lightspeedwp/.github \
  --token $GITHUB_TOKEN \
  --report json
```

**Integration Points**:
- Reads from: label-governance policy
- Outputs to: audit reports
- Used by: label maintenance

---

### 6. sync-pr-labels.js

**Purpose**: Sync labels between PRs and their related issues

**Category**: Sync | **Priority**: Medium | **Est. Time**: 900ms

**Features**:
- Bidirectional label sync
- PR↔Issue relationship detection
- Conflict resolution
- Selective sync

**Usage**:
```bash
node scripts/automation/orchestrator.js sync-pr-labels \
  --repo lightspeedwp/.github \
  --token $GITHUB_TOKEN
```

**Integration Points**:
- Triggered on: PR opened/updated
- Syncs to: Related issues
- Used by: workflow orchestration

---

### 7. staging-validation.js

**Purpose**: Validate staging environment completeness

**Category**: Validation | **Priority**: High | **Est. Time**: 1600ms

**Features**:
- Multi-point environment validation
- Configuration verification
- Readiness assessment
- Detailed reporting

**Usage**:
```bash
node scripts/automation/orchestrator.js validate-staging \
  --repo lightspeedwp/.github \
  --verbose true
```

**Optimization Opportunities**:
- Parallel validation checks
- Cache validation results
- Batch file I/O
- Target: 1600ms → 1000ms

---

### 8. handlers-orchestrator.js

**Purpose**: Run all issue handlers in coordinated manner

**Category**: Orchestration | **Priority**: High | **Est. Time**: 900ms

**Features**:
- Coordinate multiple handlers
- Dependency management
- Error aggregation
- Parallel execution support

**Usage**:
```bash
node scripts/automation/orchestrator.js handle-all \
  --repo lightspeedwp/.github \
  --token $GITHUB_TOKEN
```

---

### 9. pr-triage-orchestrator.js

**Purpose**: Comprehensive PR triage workflow

**Category**: Orchestration | **Priority**: High | **Est. Time**: 1100ms

**Features**:
- Complete PR lifecycle automation
- Multi-step triage
- Status updates
- Dependency coordination

**Usage**:
```bash
node scripts/automation/orchestrator.js triage-all \
  --repo lightspeedwp/.github \
  --token $GITHUB_TOKEN \
  --state open
```

**Dependencies**:
- Requires: review-labels, sync-pr-labels

---

### 10. add-issue-template-sections.js

**Purpose**: Add structured sections to issue templates

**Category**: Template | **Priority**: Low | **Est. Time**: 900ms

**Features**:
- Template modification
- Section injection
- Validation
- Backup preservation

**Usage**:
```bash
node scripts/automation/orchestrator.js add-template-sections \
  --repo lightspeedwp/.github \
  --sections "Reproduction,Expected,Actual"
```

---

### 11. review-status-labels.js

**Purpose**: Audit status label assignments

**Category**: Audit | **Priority**: Medium | **Est. Time**: 1400ms

**Features**:
- Status label validation
- Consistency checking
- Missing status detection
- Detailed audit report

**Usage**:
```bash
node scripts/automation/orchestrator.js review-status \
  --repo lightspeedwp/.github \
  --token $GITHUB_TOKEN \
  --report json
```

---

## Integration Diagram

```
┌─────────────────────────────────────────────────────┐
│         Orchestrator (Central Entry Point)          │
└────────────────┬────────────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    v            v            v
┌──────────┐  ┌──────────┐  ┌──────────┐
│  AUDIT   │  │ UPDATE   │  │  SYNC    │
│ Scripts  │  │ Scripts  │  │ Scripts  │
└──────────┘  └──────────┘  └──────────┘
    │            │            │
    v            v            v
[GitHub Issues] [Metadata]   [Labels]
```

---

## Workflow Integration Points

### 1. Issue Creation Workflow
```
issue.opened → content-analysis-agent 
            → labeling-agent 
            → enrichment-agent 
            → validation-agent 
            → reporting-agent
```

### 2. Daily Maintenance Workflow
```
schedule(08:00 UTC) → audit-issue-metadata
                   → review-labels
                   → review-status
                   → manage-stale
```

### 3. PR Triage Workflow
```
pull_request.opened → pr-triage-orchestrator
                   → sync-pr-labels
                   → handlers-orchestrator
```

### 4. Release Planning Workflow
```
release.triggered → allocate-milestones
                 → bulk-issue-metadata-updater
```

---

## Performance Optimization Roadmap

### Phase 2.1: Script Optimization (In Progress)

**Priority 1: audit-issue-metadata.js**
- [ ] Add API result caching (200-300ms)
- [ ] Batch metadata collection (100ms)
- [ ] Refactor validation logic (100ms)
- Target: 1600ms → 1000ms (37% improvement)

**Priority 2: staging-validation.js**
- [ ] Parallel validation checks (200ms)
- [ ] Cache validation schemas (100ms)
- [ ] Combine validation passes (100ms)
- Target: 1600ms → 1000ms (37% improvement)

**Priority 3: allocate-to-milestone.js**
- [ ] Refactor into modules (300ms)
- [ ] Add milestone cache (100ms)
- [ ] Optimize loops (200ms)
- Target: 1400ms → 900ms (36% improvement)

**Phase 2.2: Global Optimizations**
- Add centralized caching layer (200-400ms savings)
- Implement connection pooling (100ms)
- Optimize file I/O batching (150ms)
- Overall target: 12.7s → 8-9s (30% improvement)

---

## Troubleshooting Guide

### Common Issues

#### "Rate limit exceeded"
**Cause**: GitHub API rate limiting  
**Solution**: 
- Add delays between API calls
- Use batch operations
- Implement caching

#### "Script timeout"
**Cause**: Long-running operation  
**Solution**:
- Reduce batch size
- Enable verbose logging
- Check for infinite loops

#### "Memory error"
**Cause**: Large data sets  
**Solution**:
- Process in smaller batches
- Stream results instead of buffering
- Clear cache between batches

#### "Dependency not found"
**Cause**: Missing dependent script  
**Solution**:
- Run dependencies first
- Check orchestrator registry
- Verify all scripts present

#### "Permission denied"
**Cause**: Insufficient GitHub token scope  
**Solution**:
- Verify token has repo access
- Check organization settings
- Regenerate token if needed

### Debug Mode

Enable detailed logging:
```bash
NODE_DEBUG=* node scripts/automation/orchestrator.js audit-metadata --verbose
```

### Validation Checklist

Before running in production:
- [ ] GitHub token has required scopes
- [ ] Repository name is correct
- [ ] Network connectivity confirmed
- [ ] Rate limits checked
- [ ] Batch sizes appropriate
- [ ] Dry-run tested first

---

## Contributing & Updates

To add a new script to the registry:

1. Implement the script in `scripts/automation/`
2. Add entry to `SCRIPT_REGISTRY` in orchestrator.js
3. Profile performance via profiler.js
4. Document in this registry
5. Update workflow integrations
6. Test via orchestrator

---

**Registry Version**: 1.0  
**Last Updated**: 2026-08-27  
**Maintained By**: LightSpeed DevOps  
**Status**: Production

---
title: "Workflow Architecture & Consolidation"
description: "Complete reference for project management workflows, execution model, and consolidation strategy"
file_type: "architecture"
created_date: "2026-09-03"
last_updated: "2026-09-03"
---

# Workflow Architecture & Consolidation

**Overview**: Technical reference for 19+ project management workflows, execution patterns, and consolidation opportunities.

---

## Quick Reference

| Category | Workflows | Status | Effort | Status |
|----------|-----------|--------|--------|--------|
| **Project Management** | 7 | Current | — | Active |
| **Labeling & Classification** | 5 | Current | — | Active |
| **Metrics & Reporting** | 4 | Current | — | Active |
| **CI/CD & Validation** | 3 | Current | — | Active |

**Total**: 19 workflows across 4 categories

---

## Project Management Workflows

### 1. Auto-Project-Creation.yml
**Trigger**: Issue created with `type:epic` label  
**Purpose**: Automatically create project folder + README for new epics  
**Steps**:
1. Detect `type:epic` label on new issue
2. Extract issue title and description
3. Create `.github/projects/active/{slug}/` directory
4. Generate README.md with template
5. Post comment linking to project

**Data Flow**:
```
Issue Created (GH event)
  → webhook receiver
  → parse metadata
  → create directory structure
  → post comment with link
```

**Consolidation Opportunity**: Merge with project-manager.yml (both handle project creation)

---

### 2. Project-Status-Sync.yml
**Trigger**: Scheduled daily + manual trigger  
**Purpose**: Update project status in GitHub project board from README frontmatter  
**Steps**:
1. Read all project README files
2. Extract status, priority, effort from frontmatter
3. Update corresponding GitHub project card
4. Add labels: `status:{status}`, `priority:{priority}`
5. Set custom fields (effort, completion %)

**Data Flow**:
```
Project READMEs
  → read frontmatter
  → GitHub API
  → update project board
  → apply labels
```

**Consolidation Opportunity**: Part of larger project-sync orchestration

---

### 3. Phase-Progression-Sync.yml
**Trigger**: Issue/PR labeled with `phase:*` label  
**Purpose**: Synchronize phase labels across related issues  
**Steps**:
1. Detect phase label change
2. Find linked issues in same project
3. Update phase labels on linked issues
4. Trigger dependent workflows
5. Log to project audit trail

**Data Flow**:
```
Label Event (issue/PR)
  → detect phase label
  → find related issues
  → sync phase labels
  → trigger workflows
```

**Consolidation Opportunity**: Generalize to handle all sync scenarios

---

### 4. Milestone-Automation.yml
**Trigger**: Issue created or PR opened  
**Purpose**: Automatically assign milestones based on project and priority  
**Steps**:
1. Determine project from labels/metadata
2. Look up phase milestones for project
3. Determine milestone based on priority + phase
4. Assign milestone via API
5. Add comment explaining assignment

**Data Flow**:
```
Issue/PR Created
  → determine project
  → lookup milestones
  → calculate target milestone
  → assign
```

**Consolidation Opportunity**: Merge with phase-progression-sync (both manage metadata)

---

### 5. Issue-Linking-Automation.yml
**Trigger**: Issue created or modified  
**Purpose**: Automatically create links between related issues  
**Steps**:
1. Parse issue body for keywords: "blocks", "blocked by", "relates to"
2. Extract issue numbers from keywords
3. Create bidirectional links via API
4. Validate references exist
5. Post summary comment

**Data Flow**:
```
Issue Created/Modified
  → parse body
  → extract references
  → validate references
  → create links
  → post comment
```

**Consolidation Opportunity**: Part of issue-orchestration suite

---

### 6. Completion-Detection.yml
**Trigger**: Issue closed or PR merged  
**Purpose**: Detect when projects reach completion milestones  
**Steps**:
1. Parse closed issue/merged PR for completion markers
2. Check if it matches project completion criteria
3. Update project status to "completed"
4. Create completion report
5. Archive project (optional)

**Data Flow**:
```
Issue Closed / PR Merged
  → check completion criteria
  → update project status
  → archive if needed
  → create report
```

**Consolidation Opportunity**: Integrate with archive-projects script

---

### 7. Project-Health-Report.yml
**Trigger**: Scheduled weekly  
**Purpose**: Generate health report for active projects  
**Steps**:
1. Scan all active projects
2. Collect metrics: days since update, open issues, blocked status
3. Calculate health score (red/yellow/green)
4. Post report to Slack
5. Create/update project health dashboard

**Data Flow**:
```
Scheduled Trigger
  → scan all projects
  → calculate metrics
  → generate report
  → post to Slack
  → update dashboard
```

**Consolidation Opportunity**: Combine with metrics-collection workflows

---

## Labeling & Classification Workflows

### 1. Label-Governance.yml (formerly 3 separate workflows)
**Trigger**: Label applied to issue/PR  
**Purpose**: Enforce label governance rules (enforce family prefixes, mutex groups)  
**Steps**:
1. Validate label matches governance rules
2. Check for mutex group violations (conflicting labels)
3. Remove invalid labels
4. Suggest valid alternatives
5. Post guidance comment

**Status**: ✅ Consolidation Complete (Phase 3 merged PR #1496)  
**Files Consolidated**: `dependabot-security-label.yml`, `issue-close-label-hygiene.yml` merged into `labeling-governance.yml`  
**Improvement**: 46% code reduction, 67% GitHub Actions time savings

**Data Flow**:
```
Label Applied (GH event)
  → validate against rules
  → check mutex groups
  → enforce governance
  → suggest fixes
  → post comment
```

---

### 2. Auto-Labeling.yml
**Trigger**: Issue/PR created or description modified  
**Purpose**: Automatically apply labels based on content analysis  
**Steps**:
1. Analyze issue/PR title and body
2. Detect issue type (bug, feature, documentation, etc.)
3. Apply `type:{detected_type}` label
4. Detect area (ci, docs, security, etc.)
5. Apply `area:{detected_area}` label
6. Post comment showing reasoning

**Data Flow**:
```
Issue/PR Created
  → content analysis
  → detect type
  → detect area
  → apply labels
  → post comment
```

**Consolidation Opportunity**: Merge with label-governance for unified label management

---

### 3. Priority-Assignment.yml
**Trigger**: Issue created or labeled `needs-triage`  
**Purpose**: Automatically assign priority based on criteria  
**Steps**:
1. Extract issue metadata (reporter, title, description)
2. Apply priority heuristics:
   - Security issues → `priority:critical`
   - Production bugs → `priority:high`
   - Feature requests → `priority:medium`
   - Documentation → `priority:low`
3. Apply priority label
4. Request review from triagers if unclear

**Data Flow**:
```
Issue Created / Needs Triage
  → apply heuristics
  → calculate priority
  → apply label
  → request review if needed
```

**Consolidation Opportunity**: Combine with auto-labeling

---

### 4. Status-Tracking.yml
**Trigger**: Label applied/removed  
**Purpose**: Maintain status field in GitHub project from labels  
**Steps**:
1. Detect status label change (`status:*`)
2. Update GitHub project custom field
3. Update milestone if needed
4. Notify assignees of status change
5. Add to status dashboard

**Data Flow**:
```
Status Label Change
  → update custom field
  → update milestone
  → notify assignees
  → update dashboard
```

---

### 5. Duplicate-Detection.yml
**Trigger**: Issue created  
**Purpose**: Detect likely duplicates and suggest closing  
**Steps**:
1. Search for similar issues (title + description similarity)
2. If match found > 80% similarity:
   - Comment with link to original
   - Add `meta:duplicate` label
   - Suggest closing
3. Manual review still required

**Data Flow**:
```
Issue Created
  → search similar
  → calculate similarity
  → if > 80%: tag as duplicate
  → post comment
```

---

## Metrics & Reporting Workflows

### 1. Progress-Metrics.yml
**Trigger**: Scheduled daily  
**Purpose**: Collect and report project progress metrics  
**Steps**:
1. Scan all active projects
2. Count: open issues, closed (this week), completed tasks
3. Calculate: completion %, velocity, ETA
4. Generate metrics report
5. Update dashboard

**Data Flow**:
```
Scheduled Trigger
  → query issues
  → calculate metrics
  → generate report
  → update dashboard
```

---

### 2. SLA-Tracking.yml
**Trigger**: Scheduled daily  
**Purpose**: Track SLA compliance (response time, resolution time)  
**Steps**:
1. For each issue:
   - Calculate time to first response
   - Calculate time to resolution
   - Check against SLA targets
2. Flag SLA violations
3. Generate SLA report
4. Alert if breaches exceed threshold

**Data Flow**:
```
Scheduled Trigger
  → query issue timelines
  → calculate SLA metrics
  → detect violations
  → alert if needed
```

---

### 3. Capacity-Planning.yml
**Trigger**: Scheduled weekly  
**Purpose**: Forecast capacity and suggest load balancing  
**Steps**:
1. Analyze current workload (issues assigned per person)
2. Project future workload (priority + estimate)
3. Identify overloaded team members
4. Suggest rebalancing
5. Post to Slack

**Data Flow**:
```
Scheduled Trigger
  → query assignments
  → project workload
  → identify imbalance
  → suggest rebalancing
```

---

### 4. Dashboard-Update.yml
**Trigger**: On completion of other workflows + scheduled  
**Purpose**: Update metrics dashboard (HTML, JSON, or service)  
**Steps**:
1. Collect latest metrics
2. Generate dashboard HTML or JSON
3. Upload to hosting location
4. Update links in project docs
5. Post dashboard URL to Slack

**Data Flow**:
```
Metrics Ready / Schedule
  → collect data
  → generate dashboard
  → upload
  → post link
```

---

## CI/CD & Validation Workflows

### 1. Validation-Suite.yml
**Trigger**: PR created/modified  
**Purpose**: Run all validation checks on PR  
**Steps**:
1. Validate frontmatter in project READMEs (script: validate-reports-structure.js)
2. Lint Markdown and YAML
3. Validate PR structure against template
4. Check for required labels
5. Post validation report

**Data Flow**:
```
PR Created/Modified
  → run validators
  → collect results
  → fail if needed
  → post report
```

---

### 2. Link-Validation.yml
**Trigger**: PR containing markdown changes  
**Purpose**: Validate all links in changed markdown files  
**Steps**:
1. Use collect-link-targets.js to find changed .md files
2. For each file, check all links:
   - Internal links (check file exists)
   - External links (curl check, may skip)
3. Report broken links
4. Suggest fixes

**Data Flow**:
```
PR Modified
  → identify changed .md files
  → validate links
  → report broken
  → suggest fixes
```

---

### 3. Smoke-Tests.yml
**Trigger**: PR merged to develop  
**Purpose**: Quick sanity checks after merge  
**Steps**:
1. Run unit tests for modified scripts
2. Check that new projects can be created
3. Verify status sync works
4. Report results

**Data Flow**:
```
PR Merged
  → run smoke tests
  → check basic functionality
  → report results
```

---

## Workflow Execution Model

### Event-Driven Execution

```
GitHub Events
  ↓
Event Router (webhook receiver)
  ├─ issue.created
  │  ├→ auto-labeling.yml
  │  ├→ duplicate-detection.yml
  │  ├→ milestone-automation.yml
  │  └→ issue-linking-automation.yml
  │
  ├─ issue.labeled
  │  ├→ label-governance.yml
  │  ├→ phase-progression-sync.yml
  │  └→ status-tracking.yml
  │
  ├─ pr.opened
  │  ├→ validation-suite.yml
  │  ├→ link-validation.yml
  │  └→ auto-labeling.yml
  │
  └─ pr.merged
     ├→ smoke-tests.yml
     ├→ project-status-sync.yml
     └→ completion-detection.yml
```

### Scheduled Execution

```
Cron Scheduler (GitHub Actions schedule)
  │
  ├─ Daily 00:00 UTC
  │  ├→ project-status-sync.yml
  │  ├→ progress-metrics.yml
  │  └→ sla-tracking.yml
  │
  ├─ Weekly Monday 09:00 UTC
  │  ├→ project-health-report.yml
  │  ├→ capacity-planning.yml
  │  └→ dashboard-update.yml
  │
  └─ As-needed manual trigger
     ├→ completion-detection.yml
     ├→ auto-project-creation.yml
     └→ validation-suite.yml
```

### Workflow Dependencies & Sequencing

```
Issue Created
  ↓
1. auto-labeling.yml (parallel)
   duplicate-detection.yml (parallel)
   milestone-automation.yml (parallel)
  ↓
2. issue-linking-automation.yml (after labeling complete)
  ↓
3. label-governance.yml (validate labels from above)
  ↓
4. status-tracking.yml (sync status from labels)
  ↓
5. progress-metrics.yml (update on schedule)

Phase Label Applied
  ↓
1. phase-progression-sync.yml (immediate)
  ↓
2. label-governance.yml (validate)
  ↓
3. project-status-sync.yml (update board)
  ↓
4. Dashboard-update.yml (on schedule)
```

---

## Consolidation Strategy

### Phase 1: Quick Wins (15 hours) — ✅ COMPLETE
- ✅ Consolidated label governance (3 → 1 workflow)
- ✅ Deleted obsolete workflows
- Savings: **449 lines removed**, **46% reduction**

### Phase 2: Grouping (20 hours) — 📋 PLANNED

**Opportunity 1**: Unified Project Manager (7 → 2 workflows)
```
Before:
- auto-project-creation.yml
- project-status-sync.yml
- phase-progression-sync.yml
- milestone-automation.yml
- issue-linking-automation.yml
- completion-detection.yml
- project-health-report.yml

After (Consolidated):
- project-orchestrator.yml (all project operations)
- health-reporter.yml (reporting only)
```

**Opportunity 2**: Unified Labeling (5 → 1 workflow)
```
Before:
- label-governance.yml
- auto-labeling.yml
- priority-assignment.yml
- status-tracking.yml
- duplicate-detection.yml

After (Consolidated):
- label-orchestrator.yml (all labeling)
```

**Opportunity 3**: Unified Metrics (4 → 1 workflow)
```
Before:
- progress-metrics.yml
- sla-tracking.yml
- capacity-planning.yml
- dashboard-update.yml

After (Consolidated):
- metrics-engine.yml (all metrics collection + reporting)
```

**Estimated Savings**: 180-220 lines, 35-40% additional reduction

### Phase 3: Optimization (15 hours) — 📋 PLANNED
- Optimize shared logic between workflows
- Reduce GitHub Actions execution time
- Improve error handling and retry logic
- Add comprehensive monitoring

### Phase 4: Monitoring & Dashboards (10 hours) — 📋 PLANNED
- Real-time workflow status dashboard
- Failure alerting and escalation
- Performance metrics tracking
- Cost optimization reporting

---

## Workflow File Organization

### Current Structure
```
.github/workflows/
├── projects/
│   ├── auto-project-creation.yml
│   ├── project-status-sync.yml
│   ├── phase-progression-sync.yml
│   ├── milestone-automation.yml
│   ├── issue-linking-automation.yml
│   ├── completion-detection.yml
│   └── project-health-report.yml
├── labeling/
│   ├── label-governance.yml (consolidated)
│   ├── auto-labeling.yml
│   ├── priority-assignment.yml
│   ├── status-tracking.yml
│   └── duplicate-detection.yml
├── metrics/
│   ├── progress-metrics.yml
│   ├── sla-tracking.yml
│   ├── capacity-planning.yml
│   └── dashboard-update.yml
└── ci/
    ├── validation-suite.yml
    ├── link-validation.yml
    └── smoke-tests.yml
```

### Proposed Post-Consolidation Structure
```
.github/workflows/
├── 01-orchestrators/
│   ├── project-orchestrator.yml (master workflow)
│   ├── label-orchestrator.yml
│   └── metrics-engine.yml
├── 02-handlers/
│   ├── event-router.yml (dispatcher)
│   └── health-reporter.yml (standalone)
└── 03-validation/
    └── ci-suite.yml (consolidated)
```

---

## Workflow Invocation & Triggers

### GitHub Events
```yaml
on:
  issues:
    types: [opened, edited, labeled, unlabeled, closed]
  pull_request:
    types: [opened, edited, labeled, unlabeled, synchronize, closed]
  pull_request_target:
    types: [opened, synchronize]
  schedule:
    - cron: "0 0 * * *"  # Daily
    - cron: "0 9 * * MON"  # Weekly Monday
  workflow_dispatch:  # Manual trigger
```

### Environment Variables
```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  ARCHIVE_LIST: (from workflow input)
  DRY_RUN: (from workflow input)
  SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Error Handling & Resilience

### Retry Logic
```yaml
# Workflows with API calls use exponential backoff
- name: Sync labels
  uses: actions/github-script@v7
  with:
    script: |
      // With retry logic built-in
      for (let i = 0; i < 3; i++) {
        try {
          await github.rest.issues.addLabels(...)
          break
        } catch (e) {
          if (i === 2) throw e
          await new Promise(r => setTimeout(r, 1000 * (2 ** i)))
        }
      }
```

### Alerting on Failures
```yaml
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: "Workflow failed: ${{ github.workflow }}"
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Monitoring & Observability

### Metrics to Track
- Workflow execution time
- Success rate (% of runs that complete)
- Error frequency and types
- GitHub Actions minutes consumed
- API rate limit usage

### Dashboard Sources
- GitHub Actions built-in analytics
- Custom dashboard from metrics-engine.yml
- Slack notifications
- Project health-report

---

## Testing Workflows

### Local Testing
```bash
# Validate workflow syntax
npm run lint:workflows

# or manually
docker run -v $(pwd):/workspace python:3.9 \
  -c "pip install pyyaml && python -c \"import yaml; yaml.safe_load(open('.github/workflows/test.yml'))\""
```

### Dry-Run Mode
Most workflows support DRY_RUN=true environment variable for safe testing without side effects.

### Integration Testing
Use workflow_dispatch input to test on demand.

---

## Best Practices

### ✅ Good Practices
1. **Clear trigger conditions**: Each workflow has focused triggers
2. **Single responsibility**: Each workflow does one thing well
3. **Error handling**: Graceful failures, informative error messages
4. **Dry-run support**: Can test without making changes
5. **Audit logging**: Changes logged to issue/PR comments
6. **Performance**: Optimized to minimize GitHub Actions minutes

### ❌ Anti-Patterns to Avoid
1. **Circular dependencies**: Workflow A triggers B which triggers A
2. **Silent failures**: Workflow fails without notification
3. **Too many triggers**: Workflow runs too frequently
4. **Missing error handling**: Crashes without clear message
5. **No logs**: Can't debug when something goes wrong

---

## Future Enhancements

### Short-term (Next 2-4 weeks)
1. Implement Phase 2 consolidation (20 hours)
2. Add comprehensive error handling
3. Implement workflow performance monitoring

### Medium-term (1-3 months)
1. Add workflow orchestration layer (coordinator)
2. Implement state machine for complex workflows
3. Add workflow versioning and rollback

### Long-term (3-6 months)
1. Migrate to reusable workflow definitions
2. Implement workflow-as-code framework
3. Add AI-driven workflow optimization

---

## Related Documentation

- [SCRIPT_ARCHITECTURE.md](./SCRIPT_ARCHITECTURE.md) — Scripts that support workflows
- [AGENT_ARCHITECTURE.md](./AGENT_ARCHITECTURE.md) — Agents invoked by workflows
- [workflows-consolidation-2026-q3 Project](../workflows-consolidation-2026-q3/) — Consolidation project details

---

**Last Updated**: 2026-09-03  
**Total Workflows**: 19 (current) → 5 (post-consolidation target)  
**Consolidation Status**: 33% complete (Phase 1 done, Phases 2-4 pending)  
**Estimated Timeline**: 8-12 weeks for full consolidation  
**Owned By**: Workflows Consolidation Project (#1227)

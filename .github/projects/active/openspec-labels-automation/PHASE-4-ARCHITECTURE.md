# Phase 4 Architecture: External Tool Integration & Metrics System

**Document Version:** 1.0  
**Date:** 2026-08-21  
**Phase Status:** 📋 Planning  
**Target Completion:** 2026-09-15

## Executive Summary

Phase 4 extends the OpenSpec Labels Automation system to synchronize GitHub issue lifecycle with external project management tools (Jira, Linear) and implements comprehensive metrics tracking for SLA compliance and team capacity planning. This architecture document defines the integration patterns, data models, and system design for Phase 4 implementation.

**Key Objectives:**
1. Bi-directional sync between GitHub, Jira, and Linear
2. Unified metrics and SLA tracking across platforms
3. Conflict resolution and rollback capabilities
4. Comprehensive audit trail for compliance

---

## 1. External Tool Integration Design

### 1.1 Jira Integration Architecture

**API Approach:**
- REST API v3 (primary) for issue operations
- GraphQL API (secondary) for complex queries
- WebHook listeners for Jira → GitHub push notifications

**Sync Scope:**
- GitHub → Jira: Issue status, labels, phase progression, linked PRs
- Jira → GitHub: Status updates, comment notifications, custom field changes
- Bi-directional: Label mappings, issue references, phase state

**Integration Points:**

| GitHub Event | Jira Operation | Sync Direction |
|---|---|---|
| Issue created | Create issue in Jira project | → (GitHub to Jira) |
| Issue labeled | Update Jira issue labels/custom fields | → |
| Phase advanced | Move issue in Jira workflow | → |
| PR opened | Link PR to Jira issue | → |
| PR merged | Update Jira issue status | → |
| Jira status changed | Update GitHub issue label | ← (Jira to GitHub) |
| Jira comment added | Post comment on GitHub issue | ← |
| Jira custom field changed | Sync to GitHub label or milestone | ← |

**Configuration:**
```yaml
# .github/config/integrations.yml
jira:
  enabled: true
  instance_url: "https://lightspeed.atlassian.net"
  projects:
    - key: "OPEN"
      github_label_prefix: "jira:OPEN"
      sync_enabled: true
      issue_type_mappings:
        github_task: "Task"
        github_bug: "Bug"
        github_feature: "Story"
  field_mappings:
    - github_label: "status:in-progress"
      jira_workflow_transition: "In Progress"
    - github_label: "priority:critical"
      jira_custom_field: "Priority"
      jira_value: "Critical"
  webhook_secret: "${JIRA_WEBHOOK_SECRET}"
  rate_limit:
    requests_per_minute: 60
    burst_size: 10
```

### 1.2 Linear Integration Architecture

**API Approach:**
- GraphQL API (primary) for all operations
- Webhook listeners for Linear → GitHub events
- Native Linear sync for team assignments and roadmaps

**Sync Scope:**
- GitHub → Linear: Issue creation, phase progression, completion
- Linear → GitHub: Status updates, priority changes, milestone assignments
- Bi-directional: Team assignments, linked work items

**Integration Points:**

| GitHub Event | Linear Operation | Sync Direction |
|---|---|---|
| Issue created | Create Linear issue in team project | → |
| Issue labeled with phase | Advance issue state in Linear | → |
| Issue closed | Mark Linear issue as completed | → |
| PR merged | Archive completed work | → |
| Linear issue moved | Update GitHub label with new phase | ← |
| Linear assignee changed | Sync to GitHub assignee | ← |
| Linear priority changed | Update GitHub priority label | ← |
| Linear cycle updated | Sync to GitHub milestone | ← |

**Configuration:**
```yaml
# .github/config/integrations.yml
linear:
  enabled: true
  api_key: "${LINEAR_API_KEY}"
  teams:
    - name: "LightSpeed Development"
      github_label_prefix: "linear:dev"
      sync_enabled: true
      project_id: "proj_abc123"
  field_mappings:
    - github_label: "status:done"
      linear_state: "Done"
    - github_label: "priority:critical"
      linear_priority: 1
  webhook_secret: "${LINEAR_WEBHOOK_SECRET}"
  rate_limit:
    requests_per_minute: 120
```

### 1.3 Conflict Resolution Strategy

**Conflict Detection:**

When a field is modified on multiple platforms simultaneously, the system detects conflicts through:

```javascript
// Pseudo-code for conflict detection
conflict = {
  source: "github_label_update",
  target: "jira_status_change",
  field: "phase_state",
  github_value: "implementation",
  jira_value: "in_review",
  timestamp_diff: 45,  // seconds
  resolution: "requires_manual_review"
}
```

**Conflict Resolution Rules:**

1. **Last-Write-Wins (LWW)** — For non-critical fields (labels, descriptions)
   - Platform with latest timestamp wins
   - Audit log records both values

2. **Platform Priority** — For critical fields (status, phase)
   - Priority order: GitHub > Jira > Linear (configurable per field)
   - Override detected by system, logged with explanation

3. **Manual Review** — For complex conflicts
   - Conflicts on status affecting deadline/SLA trigger manual review
   - Pause sync and notify team via issue comment

4. **Rollback to Last Known Good (LKGB)**
   - Maintain snapshot of state before each sync
   - On conflict, rollback to LKGB and notify stakeholders
   - Team resolves conflict manually, sync resumes

**Conflict Handling Example:**

```javascript
async function resolveConflict(issue) {
  const github = await fetchGitHubIssue(issue.github_id);
  const jira = await fetchJiraIssue(issue.jira_key);
  
  if (github.phase !== jira.status) {
    const timeDiff = Math.abs(github.updated_at - jira.updated_at);
    
    if (timeDiff < 60) {
      // Simultaneous update detected
      const resolution = await manualReviewQueue.enqueue({
        issue_id: issue.id,
        github_value: github.phase,
        jira_value: jira.status,
        requires_decision: true
      });
    } else {
      // Last-write-wins
      const winner = github.updated_at > jira.updated_at ? 'github' : 'jira';
      await syncConflictResolution(issue, winner);
    }
  }
}
```

### 1.4 Sync Scheduling & Retry Logic

**Scheduling Strategy:**

```
Real-Time Events:
  - GitHub → Jira/Linear: On-event sync (< 5 seconds)
  - Jira/Linear → GitHub: Webhook-driven (< 10 seconds)

Scheduled Bulk Sync:
  - Hourly reconciliation: All open issues (incremental)
  - Daily full sync: Complete state reconciliation
  - Weekly audit: Compare all three platforms for discrepancies
```

**Retry Strategy:**

```javascript
const retryConfig = {
  maxAttempts: 5,
  backoffStrategy: "exponential",  // 1s, 2s, 4s, 8s, 16s
  retryableErrors: [
    "rate_limit_exceeded",
    "temporary_outage",
    "connection_timeout"
  ],
  nonRetryableErrors: [
    "authentication_failed",
    "invalid_issue_key",
    "not_found"
  ]
}
```

**Retry Flow:**

1. **Attempt 1:** Immediate sync execution
2. **Failure:** Log error with timestamp
3. **Attempt 2–5:** Exponential backoff (1s → 16s)
4. **Final Failure:** Move to dead-letter queue for manual investigation
5. **Monitoring:** Alert team on 3+ consecutive failures

---

## 2. Metrics System Architecture

### 2.1 Phase Progression Tracking

**Tracked Metrics:**

```javascript
const phaseMetrics = {
  issue_id: "12345",
  github_url: "https://github.com/lightspeedwp/.github/issues/12345",
  
  // Phase timeline
  phases: [
    {
      phase: "backlog",
      entered_at: "2026-08-15T10:00:00Z",
      exited_at: "2026-08-16T14:30:00Z",
      duration_hours: 28.5,
      actor: "team-member"
    },
    {
      phase: "specification",
      entered_at: "2026-08-16T14:30:00Z",
      exited_at: "2026-08-18T09:15:00Z",
      duration_hours: 42.75,
      actor: "automated"
    },
    {
      phase: "implementation",
      entered_at: "2026-08-18T09:15:00Z",
      exited_at: null,  // current phase
      duration_hours: 72.5,
      actor: "pr-merged"
    }
  ],
  
  // Current state
  current_phase: "implementation",
  time_in_current_phase: 72.5,
  total_elapsed_time: 143.75,
  
  // Related work
  pull_requests: [
    {
      number: 2345,
      created_at: "2026-08-17T10:00:00Z",
      merged_at: "2026-08-18T09:15:00Z",
      review_duration: 23.25
    }
  ]
}
```

**Phase Progression Event Stream:**

```yaml
# Captured in audit log
events:
  - timestamp: 2026-08-15T10:00:00Z
    type: phase_entered
    phase: backlog
    actor: system
    reason: issue_created
    
  - timestamp: 2026-08-16T14:30:00Z
    type: phase_exited
    phase: backlog
    actor: ashley@lightspeedwp.agency
    reason: label_specification_added
    
  - timestamp: 2026-08-18T09:15:00Z
    type: phase_entered
    phase: implementation
    actor: system
    reason: pr_merged
    pr_number: 2345
```

### 2.2 SLA Calculation Logic

**SLA Definition:**

```yaml
# .github/config/metrics-rules.yml
slas:
  specification:
    max_duration_days: 5
    target_duration_days: 3
    priority_overrides:
      critical: 1
      important: 2
      normal: 5
  implementation:
    max_duration_days: 14
    target_duration_days: 7
    priority_overrides:
      critical: 3
      important: 7
      normal: 14
  review:
    max_duration_days: 3
    target_duration_days: 1
```

**SLA Calculation:**

```javascript
function calculateSLAStatus(issue, phase, duration_hours) {
  const slaConfig = loadSLAConfig(phase, issue.priority);
  const duration_days = duration_hours / 24;
  
  return {
    phase: phase,
    max_duration_days: slaConfig.max_duration_days,
    target_duration_days: slaConfig.target_duration_days,
    actual_duration_days: duration_days,
    
    // Status determination
    status: duration_days <= slaConfig.target_duration_days ? "on_track" :
            duration_days <= slaConfig.max_duration_days ? "at_risk" :
            "exceeded",
    
    // Calculations
    percent_of_target: (duration_days / slaConfig.target_duration_days) * 100,
    hours_remaining: (slaConfig.max_duration_days * 24) - duration_hours,
    days_remaining: slaConfig.max_duration_days - duration_days
  }
}
```

**SLA Status Indicators:**

| Status | Condition | Action |
|---|---|---|
| ✅ On Track | Duration ≤ target | Continue normal workflow |
| ⚠️ At Risk | target < duration ≤ max | Notify team, escalate if needed |
| 🔴 Exceeded | Duration > max | Critical alert, manual intervention |

### 2.3 Team Capacity & Velocity Metrics

**Capacity Tracking:**

```javascript
const capacityMetrics = {
  period: "2026-08-01 to 2026-08-31",
  
  // Team metrics
  team_size: 8,
  available_capacity: 960,  // hours (8 people × 20 working days × 6 hours)
  
  // Work distribution
  completed_issues: 24,
  active_issues: 12,
  blocked_issues: 3,
  
  // Velocity
  average_duration_per_issue: 18.5,  // hours
  issues_per_person_per_week: 3.2,
  
  // Phase breakdown
  phases: {
    specification: {
      avg_duration: 28.5,
      issues_completed: 24,
      completion_rate: "100%"
    },
    implementation: {
      avg_duration: 67.5,
      issues_completed: 18,
      completion_rate: "75%"
    }
  },
  
  // Burndown
  burndown_trajectory: "on_schedule",
  forecast_completion: "2026-09-15"
}
```

### 2.4 Reporting & Visualization

**Reporting Schedule:**

```
Real-Time Dashboard:
  - Live phase progression for all open issues
  - SLA status indicators (on-track, at-risk, exceeded)
  - Capacity utilization chart

Daily Reports (9:00 AM UTC):
  - SLA compliance summary (# on-track, # at-risk, # exceeded)
  - Team velocity summary
  - Issues blocked or paused
  
Weekly Reports (Friday 5:00 PM UTC):
  - Capacity utilization vs. forecast
  - Phase duration trends
  - Team productivity metrics
  - Risk assessment
  
Monthly Reports (Last Friday of month):
  - Full SLA compliance analysis
  - Team capacity planning for next quarter
  - Process improvement recommendations
```

**Report Output Formats:**

- JSON: For programmatic consumption and dashboards
- HTML: For email distribution and web viewing
- CSV: For spreadsheet import and analysis
- Markdown: For GitHub comments and documentation

---

## 3. Data Model & Mapping

### 3.1 GitHub → Jira Field Mappings

```javascript
const fieldMappings = {
  // Basic fields
  title: {
    github: "issue.title",
    jira: "fields.summary",
    type: "string",
    direction: "→←",
    conflict_resolution: "github_priority"
  },
  
  description: {
    github: "issue.body",
    jira: "fields.description",
    type: "string",
    direction: "→←",
    conflict_resolution: "last_write_wins"
  },
  
  // Status/Phase
  phase: {
    github: {
      field: "labels",
      prefix: "status:",
      values: ["backlog", "specification", "implementation", "review", "done"]
    },
    jira: {
      field: "status",
      values: ["Backlog", "In Specification", "In Development", "In Review", "Done"]
    },
    mapping: {
      "backlog": "Backlog",
      "specification": "In Specification",
      "implementation": "In Development",
      "review": "In Review",
      "done": "Done"
    },
    direction: "→←",
    conflict_resolution: "platform_priority"
  },
  
  // Priority
  priority: {
    github: {
      field: "labels",
      prefix: "priority:",
      values: ["critical", "important", "normal", "low"]
    },
    jira: {
      field: "customfield_10001",  // Custom field ID
      values: ["Critical", "High", "Medium", "Low"]
    },
    mapping: {
      "critical": "Critical",
      "important": "High",
      "normal": "Medium",
      "low": "Low"
    },
    direction: "→←",
    conflict_resolution: "last_write_wins"
  },
  
  // Linked PRs
  related_prs: {
    github: "issue.linked_pulls",
    jira: "customfield_10002",  // Custom field for linked PRs
    type: "array<url>",
    direction: "→",
    sync_frequency: "on_event"
  },
  
  // Assignee
  assignee: {
    github: "issue.assignee",
    jira: "fields.assignee",
    type: "user",
    direction: "→←",
    conflict_resolution: "last_write_wins"
  }
}
```

### 3.2 GitHub → Linear Field Mappings

```javascript
const linearMappings = {
  // Basic fields
  title: {
    github: "issue.title",
    linear: "issue.title",
    direction: "→←",
    conflict_resolution: "github_priority"
  },
  
  description: {
    github: "issue.body",
    linear: "issue.description",
    direction: "→←",
    conflict_resolution: "last_write_wins"
  },
  
  // Status/State
  phase: {
    github: {
      field: "labels",
      prefix: "status:",
      values: ["specification", "implementation", "review", "done"]
    },
    linear: {
      field: "state",
      values: ["Backlog", "Todo", "In Progress", "In Review", "Done"]
    },
    mapping: {
      "specification": "Todo",
      "implementation": "In Progress",
      "review": "In Review",
      "done": "Done"
    },
    direction: "→←",
    conflict_resolution: "platform_priority"
  },
  
  // Priority
  priority: {
    github: {
      field: "labels",
      prefix: "priority:",
      values: ["critical", "important", "normal", "low"]
    },
    linear: {
      field: "priority",
      values: [1, 2, 3, 4]
    },
    mapping: {
      "critical": 1,
      "important": 2,
      "normal": 3,
      "low": 4
    },
    direction: "→←"
  },
  
  // Cycle (milestone in GitHub)
  milestone: {
    github: "issue.milestone",
    linear: "issue.cycle",
    type: "string",
    direction: "→←"
  },
  
  // Team assignment
  assignee: {
    github: "issue.assignee",
    linear: "issue.assignee",
    type: "user",
    direction: "→←"
  }
}
```

### 3.3 Custom Field Handling

**Extensibility Pattern:**

```javascript
// For fields not in standard mapping, use custom handlers
const customFieldHandlers = {
  "component": {
    github: {
      extract: (issue) => issue.labels.filter(l => l.startsWith("area:")).map(l => l.split(":")[1]),
      inject: (issue, values) => values.forEach(v => issue.labels.add(`area:${v}`))
    },
    jira: {
      extract: (jira_issue) => jira_issue.fields.components.map(c => c.name),
      inject: (jira_issue, values) => jira_issue.fields.components = values.map(v => ({name: v}))
    }
  },
  
  "epic_link": {
    github: {
      extract: (issue) => issue.labels.find(l => l.startsWith("epic:"))?.split(":")[1],
      inject: (issue, value) => issue.labels.add(`epic:${value}`)
    },
    jira: {
      extract: (jira_issue) => jira_issue.fields.customfield_10000,
      inject: (jira_issue, value) => jira_issue.fields.customfield_10000 = value
    }
  }
}
```

---

## 4. Error Handling & Resilience

### 4.1 Sync Failure Recovery

**Failure Categories:**

```javascript
const failureCategories = {
  TRANSIENT: {
    codes: [429, 502, 503, 504],
    description: "Temporary service issues",
    recovery: "exponential_backoff",
    max_retries: 5
  },
  
  AUTH_FAILURE: {
    codes: [401, 403],
    description: "Authentication or permission issues",
    recovery: "manual_intervention",
    alert_severity: "high"
  },
  
  VALIDATION_ERROR: {
    codes: [400],
    description: "Invalid data or request",
    recovery: "review_and_fix",
    alert_severity: "medium"
  },
  
  NOT_FOUND: {
    codes: [404],
    description: "Resource doesn't exist",
    recovery: "manual_investigation",
    alert_severity: "medium"
  },
  
  CONFLICT: {
    codes: [409],
    description: "Conflicting state change",
    recovery: "rollback_and_retry",
    alert_severity: "high"
  }
}
```

**Failure Handling Flow:**

```
1. Attempt Sync
   ↓
2. Check Response
   ├─ Success → Log and continue
   ├─ Transient Error → Retry with backoff
   ├─ Auth Error → Alert team, pause sync
   ├─ Validation Error → Log, move to review queue
   └─ Conflict → Resolve via conflict strategy
   
3. If Max Retries Exceeded
   ├─ Move to dead-letter queue
   ├─ Create GitHub issue with error details
   └─ Alert team for manual investigation
```

### 4.2 Rate Limiting Strategies

**Platform Rate Limits:**

| Platform | Limit | Window | Strategy |
|---|---|---|---|
| GitHub API | 5,000 | per hour | Distribute requests evenly |
| Jira API | 60 | per minute | Queue requests, respect backoff |
| Linear API | 120 | per minute | Batch operations, use batch queries |

**Rate Limit Handling:**

```javascript
class RateLimitManager {
  constructor(platform) {
    this.platform = platform;
    this.requestQueue = [];
    this.lastResetTime = Date.now();
  }
  
  async execute(operation) {
    // Check rate limit
    if (this.canExecute()) {
      return await operation();
    } else {
      // Queue for later execution
      return new Promise((resolve) => {
        this.requestQueue.push({ operation, resolve });
        this.scheduleNextBatch();
      });
    }
  }
  
  scheduleNextBatch() {
    const timeSinceReset = Date.now() - this.lastResetTime;
    const delay = Math.max(0, this.platform.window - timeSinceReset);
    
    setTimeout(() => this.processBatch(), delay);
  }
}
```

### 4.3 Rollback Procedures

**Rollback Strategy:**

```javascript
const rollbackProcedure = {
  // Capture state before sync
  async captureState(issue_id) {
    return {
      timestamp: Date.now(),
      github: await fetchGitHubIssue(issue_id),
      jira: await fetchJiraIssue(getJiraKey(issue_id)),
      linear: await fetchLinearIssue(getLinearId(issue_id))
    };
  },
  
  // Execute sync with checkpoint
  async syncWithCheckpoint(issue_id, operation) {
    const checkpoint = await this.captureState(issue_id);
    
    try {
      return await operation();
    } catch (error) {
      // Rollback to checkpoint
      await this.rollbackToCheckpoint(checkpoint);
      throw error;
    }
  },
  
  // Restore from checkpoint
  async rollbackToCheckpoint(checkpoint) {
    // Restore GitHub state
    await updateGitHubIssue(checkpoint.github.id, checkpoint.github);
    
    // Restore Jira state
    await updateJiraIssue(checkpoint.jira.key, checkpoint.jira);
    
    // Restore Linear state
    await updateLinearIssue(checkpoint.linear.id, checkpoint.linear);
    
    // Log rollback event
    await auditLog.record({
      type: "rollback",
      timestamp: Date.now(),
      checkpoint_timestamp: checkpoint.timestamp,
      affected_platforms: ["github", "jira", "linear"]
    });
  }
}
```

### 4.4 Audit Logging

**Audit Log Schema:**

```javascript
const auditLogEntry = {
  timestamp: "2026-08-21T12:30:45.123Z",
  event_type: "sync_executed",
  
  // Source information
  source: {
    platform: "github",
    event: "issue_labeled",
    issue_id: "12345"
  },
  
  // Operation details
  operation: {
    type: "sync_label_to_jira",
    label_added: "status:implementation",
    target_issue_key: "OPEN-456"
  },
  
  // Result
  result: {
    status: "success",
    duration_ms: 245,
    affected_platforms: ["github", "jira"]
  },
  
  // Metadata
  metadata: {
    user: "system",
    sync_id: "sync_abc123xyz",
    retry_count: 0
  }
}
```

**Audit Log Retention:**

- **Real-time:** All events stored in database
- **Archive:** Events older than 90 days moved to S3/GCS
- **Retention:** 1 year minimum for compliance
- **Access:** Audit log immutable, append-only

**Audit Log Querying:**

```javascript
// Example: Get all conflicts for an issue
const conflicts = await auditLog.query({
  issue_id: "12345",
  event_type: "conflict_detected",
  date_range: "last_30_days"
});

// Example: Get all failed syncs
const failures = await auditLog.query({
  result_status: "failed",
  date_range: "last_24_hours",
  order_by: "timestamp_desc"
});
```

---

## 5. Implementation Modules

### 5.1 Core Modules Structure

```
scripts/automation/integrations/
├── jira-sync.js                    # Jira API client & sync logic
├── linear-sync.js                  # Linear API client & sync logic
├── sync-orchestrator.js            # Multi-platform coordination
├── conflict-resolver.js            # Conflict detection & resolution
└── rate-limiter.js                 # Rate limit management

scripts/automation/metrics/
├── phase-metrics.js                # Phase tracking & SLA calculation
├── capacity-metrics.js             # Team capacity & velocity
├── dashboard-generator.js          # HTML/JSON report generation
└── sla-calculator.js               # SLA status determination

scripts/automation/__tests__/
├── jira-sync.test.js
├── linear-sync.test.js
├── sync-orchestrator.test.js
├── conflict-resolver.test.js
├── phase-metrics.test.js
├── capacity-metrics.test.js
└── dashboard-generator.test.js
```

### 5.2 Module Responsibilities

**jira-sync.js:**
- Authenticate with Jira API
- Create/update issues in Jira
- Handle Jira webhooks
- Transform GitHub → Jira data
- Transform Jira → GitHub data

**linear-sync.js:**
- Authenticate with Linear API
- Create/update issues in Linear
- Handle Linear webhooks
- Transform GitHub → Linear data
- Transform Linear → GitHub data

**sync-orchestrator.js:**
- Coordinate multi-platform syncs
- Manage sync queue and scheduling
- Handle retries and failures
- Implement conflict resolution
- Route events to appropriate handlers

**phase-metrics.js:**
- Track phase progression timeline
- Calculate SLA compliance
- Generate phase analytics
- Support dashboard visualization

**dashboard-generator.js:**
- Generate HTML dashboards
- Generate JSON data feeds
- Support real-time updates
- Export to multiple formats

---

## 6. Configuration Management

### 6.1 Environment Configuration

```bash
# .env.integration
JIRA_INSTANCE_URL=https://lightspeed.atlassian.net
JIRA_API_TOKEN=<secure-token>
JIRA_WEBHOOK_SECRET=<secure-secret>

LINEAR_API_KEY=<secure-token>
LINEAR_WEBHOOK_SECRET=<secure-secret>

GITHUB_TOKEN=<secure-token>
GITHUB_WEBHOOK_SECRET=<secure-secret>

# Metrics
METRICS_STORAGE=database
METRICS_RETENTION_DAYS=90
```

### 6.2 Configuration Files

All configuration stored in `.github/config/`:

- `integrations.yml` — Platform credentials & mappings
- `metrics-rules.yml` — SLA definitions & reporting schedules
- `sync-config.yml` — Sync timing & retry policies

---

## 7. Success Criteria

### Phase 4 Completion Checklist

- [ ] Jira integration module (create, update, delete, webhook handling)
- [ ] Linear integration module (create, update, delete, webhook handling)
- [ ] Sync orchestrator with conflict resolution
- [ ] Metrics system with SLA tracking
- [ ] Dashboard generator (HTML/JSON/CSV)
- [ ] Comprehensive audit logging
- [ ] 50+ integration tests (Phase 3: 126 total)
- [ ] Complete documentation (integration guides, API docs)
- [ ] Team training & rollout materials
- [ ] Production deployment to `develop` branch

---

## 8. Timeline & Milestones

| Milestone | Target Date | Deliverables |
|---|---|---|
| M1: Architecture & Planning | 2026-08-25 | This document + implementation plan |
| M2: Jira Integration | 2026-09-01 | jira-sync.js, 15 tests, documentation |
| M3: Linear Integration | 2026-09-08 | linear-sync.js, 15 tests, documentation |
| M4: Metrics & Reporting | 2026-09-15 | Metrics system, 20 tests, dashboard |
| M5: Testing & Hardening | 2026-09-20 | Full test suite, stress testing |
| M6: Documentation & Rollout | 2026-09-25 | Team training, production deployment |

---

## 9. References

- **Phase 2 Implementation:** [PHASE-2-SUMMARY.md](./PHASE-2-SUMMARY.md)
- **Phase 3 Implementation:** [PHASE-3-IMPLEMENTATION-COMPLETE.md](./PHASE-3-IMPLEMENTATION-COMPLETE.md)
- **Project Planning:** [PLANNING.md](./PLANNING.md)
- **GitHub API Documentation:** https://docs.github.com/en/rest
- **Jira API Documentation:** https://developer.atlassian.com/cloud/jira/rest
- **Linear API Documentation:** https://developers.linear.app/docs

---

**Status:** 📋 Draft architecture ready for review and implementation planning.

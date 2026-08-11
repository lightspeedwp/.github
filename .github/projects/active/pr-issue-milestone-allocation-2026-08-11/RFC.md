# RFC: PR/Issue → Milestone Allocation Automation

**Title:** Implement automatic allocation of merged PRs and closed issues to the current active milestone

**Date:** 2026-08-11  
**Author:** ash  
**Status:** Proposed (Awaiting Approval)  
**Related:** [OPENSPEC.md](./OPENSPEC.md), [PLANNING.md](./PLANNING.md)

## 1. Problem Statement

### Current State

Today, when a PR is merged or an issue is closed, there is no automatic allocation to a milestone. This requires manual intervention:

- Developer merges PR → Must manually add to milestone
- Issue is closed → Manual milestone assignment or omission
- No correlation between "closed" and "current work" milestone
- Team members unsure which items are "current" vs. historical

### Pain Points

1. **Manual burden:** Developers must remember to allocate items after closing
2. **Inconsistency:** Some items allocated, others forgotten
3. **Unclear "current":** No single source of truth for which milestone is active
4. **Tracking gaps:** Closed items may not be tracked to any milestone
5. **Release planning friction:** Unknown which closed items belong to which milestone

### Target Outcome

Automatically allocate merged PRs and closed issues to the **current active milestone** (defined as the open milestone with the earliest due date), eliminating manual bookkeeping and enforcing milestone discipline across the team.

## 2. Design Overview

### Two-Tier Implementation

We propose a **two-part solution** combining a manual script and automated workflow:

```
┌──────────────────────────────────────────────────────────┐
│ Manual Script: allocate-to-milestone.js                  │
├──────────────────────────────────────────────────────────┤
│ • On-demand allocation                                    │
│ • Testing & validation (dry-run mode)                    │
│ • Bulk re-allocation campaigns                           │
│ • Recovery from workflow failures                         │
│ • Custom parameters (lookback period, specific milestone) │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ GitHub Actions Workflow: allocate-pr-issue-to-milestone  │
├──────────────────────────────────────────────────────────┤
│ • Automatic on PR merge                                   │
│ • Automatic on issue close                                │
│ • Real-time, fire-and-forget                             │
│ • Team enforcement via automation                         │
│ • Confirmation comments on PRs/issues                    │
└──────────────────────────────────────────────────────────┘
```

### Milestone Selection Algorithm

**Key principle:** Select the open milestone with the **earliest due date**, regardless of past-due status.

**Why this approach?**

1. **Deterministic** — Single, unambiguous answer (no guessing)
2. **Recoverable** — Past-due status allowed (enables recovery from missed dates)
3. **Intuitive** — "Current" = most urgent upcoming deadline
4. **Tiebreaker** — Latest created date breaks ties (most recent commitment wins)

**Algorithm:**

```javascript
const sortedMilestones = milestones
  .filter(m => m.state === 'open')
  .sort((a, b) => {
    // 1. By due date (earliest first)
    const aDue = new Date(a.due_on || '9999-12-31');
    const bDue = new Date(b.due_on || '9999-12-31');
    if (aDue.getTime() !== bDue.getTime()) {
      return aDue.getTime() - bDue.getTime();
    }
    // 2. By creation date (latest first, on tie)
    return new Date(b.created_at) - new Date(a.created_at);
  });

const currentMilestone = sortedMilestones[0];
```

## 3. Why This Approach?

### Why Automatic (Not Manual)?

**Proposed:** Automatic allocation via workflow + optional manual script

**Benefits:**

- ✅ Eliminates user burden (fire-and-forget)
- ✅ Consistent enforcement (no items forgotten)
- ✅ Team discipline (automated accountability)
- ✅ Real-time updates (no delays)

**Cost:**

- ❌ Workflow complexity (YAML + node script)
- ❌ Potential for incorrect allocation (mitigated by logging + reversibility)
- ❌ API rate limit consumption (small, manageable)

**Alternatives Considered:**

| Alternative | Pros | Cons | Decision |
| --- | --- | --- | --- |
| Manual script only | Simple, no workflow | Requires manual runs, burden on team | ❌ Rejected |
| Workflow only | Automatic, real-time | No testing/recovery path | ❌ Rejected |
| **Script + Workflow** | Testing + automatic | More code, two entry points | ✅ **Selected** |
| Configuration UI | Flexible, user-friendly | High complexity, not worth it | ❌ Rejected |

**Rationale for two-tier:** Script handles testing, recovery, and custom campaigns. Workflow handles day-to-day automation.

### Why "Current Active Milestone"?

**Proposed:** Allocate to the open milestone with earliest due date (regardless of past-due status).

**Benefits:**

- ✅ Single, deterministic selection (no ambiguity)
- ✅ Recoverable (past-due milestones still valid)
- ✅ Intuitive (earliest deadline = most urgent)
- ✅ No configuration needed (algorithm is fixed)

**Cost:**

- ❌ Past-due items may land in past-due milestone (team must manage)
- ❌ No flexibility for custom "current" definition

**Alternatives Considered:**

| Alternative | Pros | Cons | Decision |
| --- | --- | --- | --- |
| **Earliest due date** | Deterministic, recoverable | Past-due allowed | ✅ **Selected** |
| Only non-past-due | Avoids "past-due" anomaly | Can't recover from missed dates | ❌ Rejected |
| User-configurable | Flexible | Configuration complexity | ❌ Rejected |
| Random selection | Simple | Non-deterministic, confusing | ❌ Rejected |
| Explicit marker (e.g., label) | Flexible | Maintenance burden | ❌ Rejected |

**Rationale:** Past-due milestones should still be usable. If a milestone's deadline passed but it's still open and being worked on, items should be able to land there for tracking.

### Why Exclusive (Not Additive) Allocation?

**Proposed:** Replace existing milestone (exclusive), not add to it.

**Benefits:**

- ✅ Single source of truth per item (PR/issue in exactly one active milestone)
- ✅ No stale multi-milestone entries
- ✅ Simpler mental model for team ("This PR is in milestone X")

**Cost:**

- ❌ Overwrites user's manual allocation (risk of losing intent)
- ❌ Less flexible (can't keep both old + new)

**Alternatives Considered:**

| Alternative | Pros | Cons | Decision |
| --- | --- | --- | --- |
| **Exclusive (replace)** | Single truth, clean | Overwrites user choices | ✅ **Selected** |
| Additive (keep + add) | Non-destructive | Multiple milestones, clutter | ❌ Rejected |
| Skip if allocated | Respects user choice | Doesn't correct stale allocations | ❌ Rejected |

**Rationale:** Enforcement requires overwriting. If we skip already-allocated items, stale allocations persist indefinitely. The trade-off (overwriting) is acceptable because the allocation is deterministic and can be reversed manually if needed.

## 4. Integration Points

### GitHub API Integration

The system relies on standard GitHub REST API v3 endpoints:

- `GET /repos/{owner}/{repo}/milestones` — Fetch all milestones
- `PATCH /repos/{owner}/{repo}/pulls/{number}` — Update PR milestone
- `PATCH /repos/{owner}/{repo}/issues/{number}` — Update issue milestone

No custom GitHub Apps or complex OAuth flows needed. Standard personal access token with `repo` scope sufficient.

### Workflow Triggers

```yaml
on:
  pull_request:
    types: [closed]    # Triggers on PR close (merged or discarded)
  issues:
    types: [closed]    # Triggers on issue close
  workflow_dispatch:   # Manual trigger with custom parameters
```

**Filtering:** Script only processes merged PRs (`github.event.pull_request.merged == true`).

### Script Invocation

Both workflow and manual invocation use the same Node.js script:

```bash
node allocate-to-milestone.js [--dry-run] [--days N] [--milestone N] [--verbose]
```

This ensures consistency and reduces code duplication.

## 5. Security & Permissions

### Token Scope

**Required:** GitHub personal access token with `repo` scope (full control of private repositories).

**What this allows:**

- Read PR and issue details
- Read milestone configuration
- Write PR and issue milestone fields
- No access to code, commits, or secrets

**Safety:**

- ✅ Token is write-only for PR/issue milestones (no deletions)
- ✅ No access to sensitive data (code, secrets)
- ✅ Scope is minimal (only what's needed)

### Workflow Permissions

```yaml
permissions:
  pull-requests: write  # Allocate PR to milestone
  issues: write         # Allocate issue to milestone
```

GitHub Actions permissions are explicit and minimal.

### Error Handling

All errors are logged but non-blocking:

- API errors (4xx, 5xx) → Logged, item skipped
- Invalid milestone → Logged, allocation skipped
- Transient failures → Retry 3× with exponential backoff

Script completes successfully even if some items fail (partial success is acceptable).

## 6. Testing & Validation Strategy

### Unit Tests

- Milestone selection algorithm (by due date, then by created date)
- Linked issue detection (regex matching, case-insensitive)
- Deduplication logic
- Error handling and retry logic

### Integration Tests

- Full workflow on mock GitHub API (using nock/sinon)
- PR merge → allocation to correct milestone
- Issue close → allocation to correct milestone
- Linked issues → all allocated to same milestone
- Idempotency → second run makes no changes

### Manual Testing

- Run script with `--dry-run` on live repository
- Verify milestone selection is correct
- Create test PR with linked issue
- Trigger workflow on PR merge
- Verify both PR and issue allocated

**Test Coverage Target:** ≥80% (unit + integration)

## 7. Alternative Approaches

### Approach A: Scheduled Batch Job

**How it works:**

- Runs daily/weekly (cron schedule)
- Finds all merged PRs since last run
- Allocates batch in one go

**Pros:**

- Single query per run (efficient)
- Easier to add complex logic (time-based rules, etc.)
- Can be disabled/scheduled independently

**Cons:**

- Delayed allocation (up to 24 hours)
- Less real-time feedback to developers
- Requires persistent state (tracking what's been processed)

**Decision:** ❌ Rejected in favor of real-time workflow + on-demand script.

### Approach B: GitHub App

**How it works:**

- Custom GitHub App installed on repo
- App receives webhooks on PR/issue events
- App allocates directly

**Pros:**

- More control over permissions (granular scopes)
- Webhook-based (more direct than Actions)
- Persistent, easier to maintain state

**Cons:**

- Complex to develop and maintain
- Requires app registration + config
- Overkill for this simple task

**Decision:** ❌ Rejected in favor of simpler GitHub Actions approach.

### Approach C: Labels as "Current Milestone" Marker

**How it works:**

- Add a label (e.g., `current:v1.5.0`) to mark active milestone
- Script allocates to milestone matching the label

**Pros:**

- Flexible (can change "current" by updating label)
- User-controlled (team can manually adjust)

**Cons:**

- Extra maintenance (label must stay in sync with milestones)
- Requires label creation/management
- Adds complexity

**Decision:** ❌ Rejected in favor of algorithm-based selection (less maintenance).

### Approach D: Environment Variable Configuration

**How it works:**

- Allow users to set `FORCE_MILESTONE=42` env var
- If set, always allocate to that milestone (ignore algorithm)

**Pros:**

- Flexible for one-off campaigns
- Allows override for special cases

**Cons:**

- Configuration adds complexity
- Non-deterministic (different behavior in different environments)

**Decision:** ⚠️ **Partially adopted** — `--milestone N` CLI option for script, but no env var config. Keeps it explicit and visible.

## 8. Rollout & Communication Strategy

### Rollout Phases

1. **Phase 1:** Team review of specification + design
2. **Phase 2:** Implementation + testing in feature branch
3. **Phase 3:** Deploy to `.github`, enable workflow, test on live repo
4. **Phase 4:** Announce to team, gather feedback

### Team Communication

- **Before rollout:** Post announcement explaining feature + benefits
- **During rollout:** Monitor for issues, post updates in channel
- **After rollout:** FAQ document + runbook, gather feedback

### Rollback Plan

If critical issues discovered:

1. Disable workflow in `.github/workflows/` (comment out or remove)
2. If items mis-allocated, manually correct in GitHub UI
3. Post-mortem: identify root cause, fix, re-enable

**Rollback effort:** Minutes (just disable workflow + manual fixes)

## 9. Cost-Benefit Analysis

### Benefits

| Benefit | Impact | Measurable |
| --- | --- | --- |
| Eliminate manual allocation | Saves ~5 min per merged PR × N PRs/week | Yes |
| Enforce milestone discipline | Cleaner milestone tracking | Yes |
| Single source of truth | Reduced confusion | Yes |
| Real-time updates | Faster feedback loop | Yes |

**Estimated effort saved:** 5 hrs/week for team of 5 (one allocation per PR)

### Costs

| Cost | Impact | Effort |
| --- | --- | --- |
| Implementation | Design + code + test + deploy | 72 hours (Phase 2) |
| Maintenance | Bug fixes, edge cases, monitoring | 5-10 hours/week ongoing |
| Potential disruption | If mis-allocation occurs | Reversible (manual fix) |

**Break-even:** ~2-3 weeks (72h implementation vs. 5 hrs/week savings)

## 10. Success Metrics

### During Implementation

- ✅ Script allocates 100% of test items correctly
- ✅ Workflow triggers on PR merge and issue close
- ✅ ≥80% test coverage
- ✅ Dry-run mode works accurately

### After Rollout

- ✅ 95%+ allocation success rate (API errors <5%)
- ✅ 100% of merged PRs allocated within 5 minutes
- ✅ 100% of closed issues allocated within 5 minutes
- ✅ Team adoption: 80%+ of items in correct milestone
- ✅ Zero critical issues in first week

### Long-term

- ✅ Consistent milestone discipline maintained
- ✅ Time saved per developer (measured via survey)
- ✅ Reduction in manual milestone corrections

## 11. Assumptions & Dependencies

### Assumptions

- GitHub API remains stable (no breaking changes)
- Team uses milestones actively for tracking
- "Current active" definition (earliest due date) is appropriate
- Workflow permissions are available (GitHub Actions standard)

### Dependencies

- GitHub repository with milestone support (standard)
- Access to GitHub Actions workflows (standard)
- Node.js 16+ available (standard in GitHub Actions)
- Personal access token with `repo` scope (user provides)

## 12. Future Enhancements

### v1.1 Possibilities

- Dashboard showing current milestone + item count
- Slack notifications on allocation
- Scheduled automatic "current" milestone advancement
- API endpoint for querying current milestone
- Custom allocation rules (e.g., by label, by team)

### v2.0 Possibilities

- Multi-repo allocation (allocate items in linked repos)
- Integration with other issue trackers (Linear, Asana, etc.)
- Predictive allocation (estimate due date based on activity)
- Burndown charts and tracking

---

## Approval Checklist

- [ ] Problem statement is clear and compelling
- [ ] Design approach is sound and justified
- [ ] Alternatives were considered and rationale is documented
- [ ] Risk mitigation strategy is adequate
- [ ] Success metrics are measurable
- [ ] Team is aligned on approach

---

## Summary

This RFC proposes automatic allocation of merged PRs and closed issues to the **current active milestone** via a two-tier approach: manual script for testing/recovery + GitHub Actions workflow for real-time automation.

The design is deterministic, reversible, and introduces minimal complexity. It addresses a real pain point (manual allocation) and provides immediate value (time savings + discipline).

**Recommendation:** Approve specification and proceed to Phase 2 implementation.

---

**Status:** Awaiting team review and approval

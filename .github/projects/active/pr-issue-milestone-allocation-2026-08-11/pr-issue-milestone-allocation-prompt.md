# PR/Issue → Milestone Allocation Automation — Planning Prompt

## Problem Statement

When a pull request is merged or an issue is closed by a merged PR, the associated PR and issue should be automatically allocated to the **current active milestone**, regardless of whether that milestone's due date has passed.

## Core Requirements

### 1. **Trigger Events**

A workflow should execute when:

- A PR is **merged** into `develop` or `main`
- An issue is **closed** (status change to "Closed") via:
  - Direct closure
  - Closure by merged PR (via `Closes #123` syntax in PR description/commits)
  - Closure by manual action

### 2. **Allocation Logic**

**Definition of "Current Active Milestone":**

- The **single milestone with the earliest due date** that has an `open` state (not archived)
- If multiple milestones share the same earliest due date, use the one with the **latest creation date** (most recently created)
- Past-due milestones ARE included in this selection—age of due date does not disqualify a milestone from being "current"
- If no open milestones exist, **do not allocate** (log as "no active milestone available")

**Allocation Targets:**

- **For merged PRs:** Allocate the PR itself to the current milestone
- **For issues closed by merged PR:** Allocate the issue to the current milestone
- **For directly merged issues (rare edge case):** Allocate the issue to the current milestone

### 3. **Edge Cases & Constraints**

| Scenario | Behaviour | Notes |
| --- | --- | --- |
| PR already has a milestone | **Replace** with current active milestone | Explicitly override any existing allocation |
| Issue already has a milestone | **Replace** with current active milestone | Same as PR |
| PR closes multiple issues | Allocate **all** linked issues to current active milestone | Handles multi-fix scenarios |
| No open milestones exist | Skip allocation, log diagnostic | Non-blocking; workflow succeeds |
| PR/issue already has correct milestone | Idempotent—no change | Safe to run repeatedly |
| Past-due milestone | Still allocates | Past-due status does not disqualify |
| Draft PR merged (rare) | Process normally | Treat as any other PR |

### 4. **Implementation Approach**

**Recommended: GitHub Actions Workflow**

- **Trigger:** `pull_request.closed` (with condition `if: github.event.pull_request.merged == true`) + Issue automation via workflow or scheduled job
- **Steps:**
  1. Fetch all open milestones from repository
  2. Sort by due date (earliest first), then by creation date (latest first)
  3. Select the first milestone in sorted order
  4. For merged PR: Call GitHub API to add PR to milestone
  5. For closed issues: Parse PR description for `Closes #123` syntax; call GitHub API to add each issue to milestone
  6. Log allocation decisions (success/skip/error)

**Alternative: Scheduled Workflow** (if you prefer batch processing)

- Runs daily or on-demand
- Queries all recent PRs and closed issues
- Allocates in batch
- More robust error handling; can retry failed allocations

### 5. **GitHub API Details**

**Update PR milestone:**

```bash
PATCH /repos/{owner}/{repo}/pulls/{pull_number}
{
  "milestone": <milestone_number>
}
```

**Update issue milestone:**

```bash
PATCH /repos/{owner}/{repo}/issues/{issue_number}
{
  "milestone": <milestone_number>
}
```

**List milestones (sorted by due date):**

```bash
GET /repos/{owner}/{repo}/milestones?state=open&per_page=100&sort=due_on&direction=asc
```

**Parse linked issues from PR:**

- Regex: `Closes #(\d+)|Resolves #(\d+)|Fixes #(\d+)` (case-insensitive)
- Extract issue numbers and verify they exist before allocating

### 6. **Workflow Configuration**

**File location:** `.github/workflows/allocate-pr-issue-to-milestone.yml`

**Permissions required:**

```yaml
permissions:
  pull-requests: write  # Update PR milestone
  issues: write         # Update issue milestone
  repository-projects: read  # Fetch milestone data
```

**Logging & observability:**

- Log each allocation decision (PR/issue + target milestone) as workflow output
- On failure: Post comment on PR/issue explaining why allocation was skipped
- Track allocation metrics (success rate, milestone distribution)

### 7. **Validation & Testing**

**Test scenarios:**

1. ✅ PR merged with no milestone → allocates to current active
2. ✅ PR merged with existing milestone → replaces with current active
3. ✅ PR closed with `Closes #123` → allocates both PR and issue
4. ✅ PR closes multiple issues → allocates all three
5. ✅ No open milestones exist → gracefully skips
6. ✅ Past-due milestone is current → still allocates
7. ✅ Idempotence: second run makes no changes
8. ✅ Malformed `Closes` syntax → skipped without error

### 8. **Configuration Questions for User**

Before implementation, clarify:

- Should draft PRs be allocated? (Recommended: Yes, same as merged PRs)
- Should allocation trigger a notification? (Recommended: Silent, logged in workflow output)
- Should there be a "frozen" milestone that is never used as "current"? (e.g., keep a "Backlog" milestone inactive)
- Should allocation be **additive** (add to existing milestone) or **exclusive** (replace)? → **Exclusive** is recommended
- Should scheduled cleanup run to deallocate items from closed milestones?

### 9. **Related Features (Optional Future)

- Auto-advance milestone when all items are closed
- Dashboard showing "current milestone" status and item count
- Slack notification: "PR #123 allocated to v1.5.0 milestone"
- Bulk reallocation tool for manual correction

---

## Recommended Next Steps

1. **Clarify with user:** Which trigger events are most critical (PR merge vs. issue closure)?
2. **Choose implementation style:** Real-time workflow vs. scheduled batch job?
3. **Draft workflow YAML** in `.github/workflows/allocate-pr-issue-to-milestone.yml`
4. **Test against live milestones** in the repository
5. **Document** in `docs/` for team reference
6. **Monitor** first run for edge cases and adjust logic as needed

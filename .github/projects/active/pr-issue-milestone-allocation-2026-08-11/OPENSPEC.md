# OpenSpec: PR/Issue → Milestone Allocation

**Version:** 1.0  
**Status:** Approved for Implementation  
**Last Updated:** 2026-08-11  
**Author:** ash  
**Location:** `.github/projects/active/pr-issue-milestone-allocation-2026-08-11/OPENSPEC.md`  

**Related Documents:**

- 📋 [PLANNING.md](./PLANNING.md) — Implementation plan
- 📖 [RFC.md](./RFC.md) — Design rationale
- 📊 [OPENSPEC-PROJECT.md](./OPENSPEC-PROJECT.md) — Project specification
- 🎯 [00-START-HERE.md](./00-START-HERE.md) — Quick start guide
- 📍 [COORDINATION.md](./COORDINATION.md) — Issue tracking
- 🔗 GitHub Issues: #1762 (Epic), #1763-1766 (Phases 1-4) — Project tracking  

## Abstract

This specification defines automated allocation of merged pull requests and closed issues to the **current active milestone** in a GitHub repository. Allocation is driven by a deterministic algorithm that selects the open milestone with the earliest due date, regardless of past-due status.

## 1. Scope

### In Scope

- Automatic allocation of merged PRs to current active milestone
- Automatic allocation of closed issues to current active milestone
- Detection of linked issues (via `Closes #`, `Resolves #`, `Fixes #` syntax)
- Allocation of all linked issues when a PR is merged
- Manual on-demand allocation script
- GitHub Actions workflow for real-time allocation
- Dry-run mode for preview without changes
- Idempotent operation (safe to run multiple times)
- Error logging and recovery

### Out of Scope

- Automatic milestone **closure** or advancement
- Notifications or Slack integration
- Dashboard or reporting (future phase)
- Custom per-team allocation rules
- Scheduled cleanup of old allocations
- Milestone creation or management

## 2. Definitions

### Current Active Milestone

The open milestone in a repository with:

1. **Earliest due date** among all open milestones
2. If multiple milestones share the same due date, the one with the **latest creation date**
3. **Past-due status is irrelevant** — age of due date does not disqualify

**Algorithm:**

```
sort(open_milestones) by:
  1. due_on ASC (earliest first)
  2. created_at DESC (latest first)
return sorted_milestones[0]
```

### Merged PR

A pull request with `merged_at` timestamp (not null) in the GitHub API.

### Closed Issue

An issue with `state: closed` in the GitHub API (regardless of closure method).

### Linked Issue

An issue referenced in a PR body via regex:

```
(?:Closes|Resolves|Fixes|Close|Resolve|Fix)\s+#(\d+)
```

Case-insensitive, can appear multiple times in same PR body.

### Idempotent

Running the operation multiple times produces the same result. Already-allocated items are not re-processed.

## 3. Requirements

### Functional Requirements

#### FR-1: Detect Current Active Milestone

**Requirement:** The system must identify the current active milestone by selecting the open milestone with the earliest due date.

**Implementation:**

```
1. Fetch all open milestones from repository
2. Sort by due_date ASC, then created_at DESC
3. Return first milestone in sorted list
4. If no open milestones: raise "no-active-milestone" error
```

**API Contract:**

```
GET /repos/{owner}/{repo}/milestones?state=open&sort=due_on&direction=asc
Response: [milestone, ...] where milestone.state == "open"
```

#### FR-2: Allocate Merged PR to Current Milestone

**Requirement:** When a PR is merged, it must be allocated to the current active milestone.

**Trigger Events:**

- `pull_request.closed` with `pull_request.merged == true` (GitHub Actions)
- Manual invocation of allocation script

**Action:**

```
1. Detect current active milestone (FR-1)
2. Update PR.milestone = current_milestone.number
3. Log allocation decision
```

**API Contract:**

```
PATCH /repos/{owner}/{repo}/pulls/{number}
{
  "milestone": <milestone_number>
}
Response: PR with updated milestone field
```

#### FR-3: Allocate Closed Issue to Current Milestone

**Requirement:** When an issue is closed, it must be allocated to the current active milestone.

**Trigger Events:**

- `issues.closed` (GitHub Actions)
- Manual invocation of allocation script

**Action:**

```
1. Detect current active milestone (FR-1)
2. Update Issue.milestone = current_milestone.number
3. Log allocation decision
```

**API Contract:**

```
PATCH /repos/{owner}/{repo}/issues/{number}
{
  "milestone": <milestone_number>
}
Response: Issue with updated milestone field
```

#### FR-4: Allocate Linked Issues When PR is Merged

**Requirement:** When a PR references issues via `Closes #` syntax, all linked issues must be allocated to the same milestone as the PR.

**Implementation:**

```
1. Parse PR body for linked issue references
2. For each matched issue number:
   a. Verify issue exists
   b. Update issue.milestone = current_milestone.number
   c. Log allocation
3. Continue on errors (non-blocking)
```

**Regex Pattern:**

```
(?:Closes|Resolves|Fixes|Close|Resolve|Fix)\s+#(\d+)
```

**Example PR Body:**

```
Fixes #123
Closes #456 and #789
Resolves #1000

Additional context...
```

**Matched Issues:** 123, 456, 789, 1000

#### FR-5: Dry-Run Mode (No Changes)

**Requirement:** System must support dry-run mode that shows what would be changed without applying changes.

**Implementation:**

```
if (options.dryRun) {
  // Log intended action but don't call PATCH API
  console.log(`[DRY-RUN] Would allocate PR #123 to milestone #15`)
} else {
  // Execute PATCH API call
}
```

**Success Criteria:** Workflow output shows all intended allocations without modifying any PRs/issues.

#### FR-6: Idempotent Operation

**Requirement:** Running the operation multiple times on the same PR/issue set must be safe and produce no duplicate changes.

**Implementation:**

```
if (item.milestone.number == current_milestone.number) {
  // Skip, already allocated correctly
  continue
}
if (item.milestone != null && item.milestone.number != current_milestone.number) {
  // Replace with current (exclusive allocation)
  update item.milestone
}
if (item.milestone == null) {
  // Add milestone
  update item.milestone
}
```

**Success Criteria:** Second run on same data set produces no API changes (all items skipped).

### Non-Functional Requirements

#### NFR-1: Performance

- Script must complete allocation of 100 items in <60 seconds
- Workflow must run and report within <2 minutes
- API rate limit: <1000 requests per run (GitHub allows 5000/hour)

#### NFR-2: Reliability

- Allocation success rate: ≥95% (API errors <5%)
- Automatic retry on transient API errors (5xx status codes)
- Clear error logging on persistent failures
- Workflow must complete (success or failure) without hanging

#### NFR-3: Observability

- All allocation decisions logged (success/skip/error)
- Summary report at end of execution
- Workflow comments posted on PR/issue confirming allocation
- Verbose mode for debugging

#### NFR-4: Security

- GitHub token required for API access
- Token scopes: `repo` (full control, write PRs and issues)
- No credentials logged or exposed in output
- Token validation at start of script

#### NFR-5: Usability

- Clear error messages for common failure scenarios
- Helpful suggestions for troubleshooting
- Accessible via script, workflow, and manual trigger
- Portable across repositories (env var configuration)

## 4. API Specifications

### Milestone Selection

```
GET /repos/{owner}/{repo}/milestones
  ?state=open
  &sort=due_on
  &direction=asc
  &per_page=100

Response Headers:
  Link: <next>, <last>

Response Body:
[
  {
    "id": 1,
    "number": 15,
    "state": "open",
    "title": "v1.5.0",
    "description": "...",
    "due_on": "2026-08-31T23:59:59Z",
    "created_at": "2026-08-01T00:00:00Z",
    "updated_at": "2026-08-10T12:00:00Z",
    ...
  },
  ...
]

Error Cases:
  401 Unauthorized    → Invalid token
  403 Forbidden       → Token lacks repo scope
  404 Not Found       → Repository doesn't exist
  422 Unprocessable   → Invalid parameters
```

### Update PR Milestone

```
PATCH /repos/{owner}/{repo}/pulls/{number}
{
  "milestone": 15
}

Response:
{
  "id": 1,
  "number": 1753,
  "state": "open",
  "title": "...",
  "milestone": {
    "id": 1,
    "number": 15,
    "title": "v1.5.0",
    ...
  },
  ...
}

Error Cases:
  401 Unauthorized    → Invalid token
  404 Not Found       → PR doesn't exist
  422 Unprocessable   → Invalid milestone number
```

### Update Issue Milestone

```
PATCH /repos/{owner}/{repo}/issues/{number}
{
  "milestone": 15
}

Response:
{
  "id": 1,
  "number": 1750,
  "state": "closed",
  "title": "...",
  "milestone": {
    "id": 1,
    "number": 15,
    "title": "v1.5.0",
    ...
  },
  ...
}

Error Cases:
  401 Unauthorized    → Invalid token
  404 Not Found       → Issue doesn't exist
  422 Unprocessable   → Invalid milestone number
```

### Linked Issue Detection

```
// Input: PR body (string)
const prBody = `
Fixes #123 and #456
Closes #789
Resolves #1000

Additional description...
`;

// Regex: case-insensitive
const regex = /(?:Closes|Resolves|Fixes|Close|Resolve|Fix)\s+#(\d+)/gi;

// Match all issue numbers
const issues = Array.from(prBody.matchAll(regex), m => parseInt(m[1], 10));
// Result: [123, 456, 789, 1000]

// Dedup
const unique = [...new Set(issues)];
```

## 5. Error Handling

### Error Categories

| Category | HTTP Code | Action | User-Facing |
| --- | --- | --- | --- |
| Auth failure | 401 | Exit + show token fix | "Invalid GITHUB_TOKEN" |
| Insufficient scope | 403 | Exit + show scope requirement | "Token needs `repo` scope" |
| Not found | 404 | Log + continue (non-blocking) | "PR #123 not found (deleted?)" |
| Invalid input | 422 | Log + skip item | "Invalid milestone number" |
| Rate limited | 403 (after X reqs) | Backoff + retry | (retry automatically) |
| Network error | 5xx | Backoff + retry (max 3x) | "API temporarily unavailable" |
| Unknown error | Other | Log + continue | "Unexpected error: [details]" |

### Retry Strategy

```
if (error is transient 5xx or network error) {
  backoff_ms = 2^attempt * 1000  // 1s, 2s, 4s
  wait(backoff_ms)
  retry (max 3 attempts)
}
```

### Logging Format

```
[LEVEL] [TIMESTAMP] [COMPONENT] Message
Example:
  ✅ 2026-08-11T12:30:45Z [allocate] Allocated PR #1753 to milestone #15
  ⚠️  2026-08-11T12:30:46Z [allocate] Skipped PR #1755 (already allocated)
  ❌ 2026-08-11T12:30:47Z [allocate] Failed to allocate issue #1750: API Error 404
```

## 6. Edge Cases & Constraints

| Edge Case | Behavior | Rationale |
| --- | --- | --- |
| No open milestones | Exit with error, don't allocate | Can't proceed without target milestone |
| PR already has correct milestone | Skip, don't call API | Idempotent, avoid unnecessary API calls |
| PR has different milestone | Replace with current | Enforce exclusive allocation |
| Issue already has correct milestone | Skip, don't call API | Idempotent |
| Issue has different milestone | Replace with current | Enforce exclusive allocation |
| PR closes non-existent issue | Log warning, continue | Non-blocking, PR still allocated |
| PR closes same issue multiple times | Deduplicate, allocate once | Prevent duplicate API calls |
| Draft PR merged | Allocate normally | Treat as any other PR |
| Issue deleted during run | Catch 404, log, continue | Non-blocking failure |
| Multiple PRs merged simultaneously | Each processed independently | Stateless, safe concurrent runs |
| Milestone due date is past | Still eligible to be "current" | Age doesn't matter, recovery allowed |
| Milestone has no due date | Sorts to end (after all with dates) | Treated as far future due date |

## 7. Acceptance Criteria

### Unit Tests

- ✅ Milestone selection returns earliest due date
- ✅ Tied milestones break by latest created date
- ✅ Linked issue regex extracts all issue numbers
- ✅ Linked issue regex handles case variations
- ✅ Deduplication removes duplicate issue numbers
- ✅ Already-allocated items are skipped
- ✅ Dry-run mode logs without API calls
- ✅ Error handling retries transient failures

### Integration Tests

- ✅ Script allocates merged PR to correct milestone
- ✅ Script allocates closed issue to correct milestone
- ✅ Script allocates PR + linked issues to same milestone
- ✅ Workflow triggers on PR merge
- ✅ Workflow triggers on issue close
- ✅ Workflow respects dry-run parameter
- ✅ Workflow generates summary report
- ✅ Workflow posts confirmation comment

### Manual Testing

- ✅ Run script with `--dry-run` on live repo
- ✅ Verify correct milestone selected
- ✅ Verify correct items would be allocated
- ✅ Run script live with small lookback window
- ✅ Verify items actually allocated
- ✅ Merge a test PR with linked issue
- ✅ Verify both PR and issue allocated
- ✅ Check workflow comment on PR/issue

## 8. Configuration

### Environment Variables

```bash
GITHUB_TOKEN      # Required. Personal access token with repo scope
GITHUB_OWNER      # Optional. Org/user (default: lightspeedwp)
GITHUB_REPO       # Optional. Repo name (default: .github)
```

### Script Options

```bash
--dry-run         # Preview without changes
--days N          # Look back N days (default: 7)
--milestone N     # Force specific milestone number
--verbose         # Detailed logging
```

### Workflow Inputs

```yaml
inputs:
  dry_run:        # boolean (true/false)
  days:           # string, parsed as integer
```

## 9. Implementation References

- **Manual Script:** `allocate-to-milestone.js` (Node.js)
- **Workflow:** `allocate-pr-issue-to-milestone.yml` (GitHub Actions)
- **Documentation:** `ALLOCATE-SCRIPT-README.md`, `IMPLEMENTATION-GUIDE.md`

## 10. Change History

| Version | Date | Changes |
| --- | --- | --- |
| 1.0 | 2026-08-11 | Initial specification |

---

**Status:** ✅ Approved for implementation

**Next Phase:** Implementation & Testing (Phase 2)

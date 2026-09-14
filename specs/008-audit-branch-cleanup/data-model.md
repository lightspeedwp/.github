# Data Model: Branch Audit & Cleanup

**Feature**: Audit and Refactor Branch Cleanup Infrastructure  
**Date**: 2026-09-14  
**Phase**: Phase 1 Design

## Core Entities

### Branch

Represents a single git branch in the repository with metadata for audit categorisation.

**Attributes**:
- `name` (string, required): Full branch name including prefix (e.g., `feat/user-auth`, `main`)
- `type` (string, required): Branch prefix/type (e.g., `feat`, `fix`, `docs`, `main`)
- `scope` (string, optional): Scope identifier from branch name (e.g., `user-auth` from `feat/user-auth`)
- `last_commit_date` (ISO8601 datetime): Timestamp of latest commit on branch
- `age_days` (integer): Days since last commit (calculated: today - last_commit_date)
- `author` (string): Author of latest commit on branch
- `merge_status` (enum): One of `merged_to_develop`, `merged_to_main`, `unmerged`, `detached`
- `open_pr` (integer or null): Associated PR number if open, null otherwise
- `is_protected` (boolean): True if branch is in protected set (main, develop, release/*, hotfix/*)
- `naming_valid` (boolean): True if branch name matches validation rules
- `excluded` (boolean): True if branch matches exclusion patterns

**Computed Properties**:
```
status = calculate_status(merge_status, open_pr, is_protected, age_days, naming_valid, excluded)
  → One of: KEEP, DELETE, DISCUSS
```

### BranchAuditReport

Structured audit output categorising branches and providing decision metadata.

**Structure**:
```json
{
  "timestamp": "2026-09-14T12:00:00Z",
  "repository": "lightspeedwp/.github",
  "branch_count": 327,
  "summary": {
    "keep_count": 42,
    "delete_count": 248,
    "discuss_count": 37
  },
  "categories": {
    "keep": {
      "protected": [
        { "name": "main", "reason": "protected branch" },
        { "name": "develop", "reason": "protected branch" }
      ],
      "active_pr": [
        {
          "name": "feat/new-agent",
          "pr_number": 3120,
          "pr_status": "open"
        }
      ],
      "recent": [
        {
          "name": "fix/auth-bug",
          "age_days": 5,
          "last_commit_date": "2026-09-09T08:00:00Z"
        }
      ]
    },
    "delete": [
      {
        "name": "feat/old-feature",
        "age_days": 120,
        "merged_to": "develop",
        "last_commit_date": "2026-05-16T10:30:00Z",
        "merge_commit_sha": "abc123def456"
      }
    ],
    "discuss": [
      {
        "name": "claude/experimental-feature",
        "reason": "naming_violation",
        "recommendation": "rename to task/experimental-feature or delete"
      },
      {
        "name": "proto/cache-redesign",
        "reason": "unmerged_stale",
        "age_days": 45,
        "recommendation": "verify intent or delete"
      }
    ]
  }
}
```

### DeletionCandidate

A branch that meets all safety criteria for deletion (subset of DELETE category).

**Safety Criteria** (all must be true):
1. ✅ Fully merged to `develop` or `main`
2. ✅ Not in protected set
3. ✅ No open pull request
4. ✅ Age > threshold (default 30 days)
5. ✅ Valid branch name (not FORBIDDEN prefix)
6. ✅ Not in exclusion patterns

**Attributes**:
- `name` (string): Branch name
- `merge_commit_sha` (string): Merge commit hash for reference
- `merge_date` (ISO8601): When branch was merged
- `age_days` (integer): Days since last commit
- `verification_passed` (boolean): All safety checks passed

---

## Categorisation Logic

### Decision Tree

```
Input: Branch entity with all attributes populated

IF is_protected:
  Category = KEEP (reason: "protected branch")
ELSE IF open_pr is not null:
  Category = KEEP (reason: "active PR #{open_pr}")
ELSE IF excluded:
  Category = KEEP or DISCUSS (reason: "matches exclusion pattern")
ELSE IF merge_status == unmerged:
  IF age_days >= 60:
    Category = DISCUSS (reason: "unmerged_stale")
  ELSE:
    Category = KEEP (reason: "unmerged, recent")
ELSE IF NOT naming_valid:
  Category = DISCUSS (reason: "naming_violation")
ELSE IF age_days < 30:
  Category = KEEP (reason: "recent")
ELSE IF merge_status == merged_to_develop OR merge_status == merged_to_main:
  Category = DELETE (reason: "merged_stale")
ELSE:
  Category = DISCUSS (reason: "unclear_status")
```

### Reason Codes

**KEEP Reasons**:
- `protected_branch` — Branch in protected set
- `active_pr` — Branch has open pull request
- `active_development` — Recently changed
- `excluded_pattern` — Matches exclusion rule
- `unmerged_recent` — Unmerged but <30 days old

**DELETE Reasons**:
- `merged_stale` — Merged to develop/main AND ≥30 days old

**DISCUSS Reasons**:
- `naming_violation` — Branch name matches forbidden prefix
- `unmerged_stale` — Unmerged AND ≥60 days old
- `orphaned` — No PR history, unclear purpose
- `excluded_policy` — Matches exclusion but may need decision (e.g., dependabot)
- `unclear_status` — Does not fit standard categories

---

## Branch Type Taxonomy

Branches are classified by prefix using the canonical 30+ types defined in `.github/CLAUDE.md`:

| Type | Examples | Safe to Delete |
|------|----------|---|
| `feat/` | `feat/user-auth`, `feat/new-dashboard` | ✅ Yes (if merged) |
| `fix/` | `fix/auth-timeout`, `fix/cache-bug` | ✅ Yes (if merged) |
| `docs/` | `docs/api-guide`, `docs/readme-update` | ✅ Yes (if merged) |
| `chore/` | `chore/deps-upgrade` | ✅ Yes (if merged) |
| `refactor/` | `refactor/auth-layer` | ✅ Yes (if merged) |
| `test/` | `test/integration-suite` | ✅ Yes (if merged) |
| `ci/` | `ci/github-actions-fix` | ✅ Yes (if merged) |
| `release/` | `release/v1.0.0` | ❌ Never |
| `hotfix/` | `hotfix/critical-security-bug` | ❌ Never |
| `main` | (system) | ❌ Never |
| `develop` | (system) | ❌ Never |
| `production` | (if used) | ❌ Never |
| **FORBIDDEN**: `claude/*`, `copilot/*`, `openai/*` | Invalid prefixes | ⚠️ Discuss only |

---

## State Transitions

**Branch Lifecycle** (for categorisation):

```
Created → Active Development
  ↓
(PR opened) → Active Review
  ↓
(PR approved) → Ready to Merge
  ↓
(merged to develop/main) → Merged
  ↓
(30 days pass) → Stale Candidate
  ↓
(cleanup script runs) → DELETE Category (if all checks pass)
  ↓
(user approves deletion) → DELETED
```

---

## Validation Rules

### Branch Name Validation

- Must match pattern: `{type}/{scope}-{title}` (with exceptions for `main`, `develop`)
- Type must be one of 30+ defined types (see taxonomy above)
- Must NOT start with forbidden prefixes: `claude/`, `copilot/`, `openai/`
- Scope and title must be kebab-case (lowercase, hyphens only)

### Merge Status Validation

- `git merge-base --is-ancestor {branch} develop` determines merge-to-develop
- Also check against `main` for consistency
- If merged to either, consider "merged" (respects most permissive state)

### Age Calculation Validation

- Last commit date obtained from: `git log -1 --format=%aI {branch}`
- Age in days: `(today - last_commit_date) / 86400` (seconds per day)
- Age must be numeric and non-negative

---

## Related Entities

### AuditExecution

Metadata about an audit run (populated during script execution).

**Attributes**:
- `timestamp` (ISO8601): When audit was executed
- `repository` (string): Repository audited (e.g., `lightspeedwp/.github`)
- `runner_environment` (string): Execution environment (e.g., `GitHub Actions`, `local CI`)
- `git_version` (string): Version of git used
- `gh_version` (string): Version of GitHub CLI used
- `script_version` (string): Version of cleanup-branches.js
- `parameters` (object): CLI options passed (e.g., `{ inactiveDays: 30, excludePatterns: "..." }`)

---

## Next Phase: Contracts & Quickstart

The audit report JSON format is detailed in `contracts/audit-report.schema.json`.  
Deletion candidate list format is detailed in `contracts/deletion-candidates.schema.json`.  
Runnable examples are in `quickstart.md`.

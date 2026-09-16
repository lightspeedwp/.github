# Data Model: Branch Cleanup Infrastructure

**Phase**: 1 (Design & Contracts) | **Date**: 2026-09-16 | **Status**: In Progress

## Entity: Branch

Represents a Git branch with metadata collected from local/remote Git and GitHub API.

### Fields

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `name` | string | Yes | Must match pattern `{type}/{scope}-{title}` OR be protected | Branch name from git |
| `type` | string | Yes | One of 30+ allowed types (feat, fix, docs, etc.) | Extracted from branch name prefix |
| `scope` | string | No | Must contain hyphen-separated scope | Extracted from branch name middle section |
| `title` | string | No | Must not be empty | Extracted from branch name suffix |
| `author` | string | Yes | Non-empty, typically email or GitHub handle | Person who created the branch |
| `lastCommitDate` | ISO8601 string | Yes | Valid RFC3339 format | Timestamp of last commit |
| `ageInDays` | number | Yes | Non-negative, calculated from `lastCommitDate` | Days since last commit to now |
| `mergeStatus` | object | Yes | See MergeStatus entity below | Merge state to develop/main branches |
| `isProtected` | boolean | Yes | True if branch in PROTECTED_BRANCHES constant | Whether branch is protected (no deletion allowed) |
| `hasOpenPR` | boolean | Yes | True if branch has open PR on GitHub | Whether branch is actively being reviewed |
| `category` | enum | Yes | Values: KEEP, DELETE, DISCUSS | Result of 8-gate categorisation |
| `reason` | string | Yes | One of predefined reason codes | Human-readable explanation for categorisation |

### Validation Rules

- `name`: Must not start with forbidden prefixes (`claude/`, `copilot/`, `openai/`)
- `lastCommitDate`: Invalid dates default to "unknown"; age defaults to 0
- `ageInDays`: Calculated as `(Date.now() - new Date(lastCommitDate)) / (24 * 60 * 60 * 1000)` and floored
- `mergeStatus`: Must have `merged` (boolean) and `state` (string) fields

---

## Entity: MergeStatus

Encapsulates branch merge state information.

### Fields

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `merged` | boolean | Yes | True if branch is ancestor of develop or main | Whether branch has been merged to any base |
| `state` | string | Yes | Values: "merged", "unmerged", "unknown" | Human-readable state |
| `mergedToBranches` | string[] | No | Base branch names (e.g., ["develop", "main"]) | Which base branches contain this branch |

### State Transitions

```
unmerged ──(git merge-base --is-ancestor)──> merged
   │                                            │
   └────────────(API error)─────────────────> unknown
```

---

## Entity: CategorisationResult

Output of the 8-gate decision tree for a single branch.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Branch name |
| `category` | enum | Yes | KEEP, DELETE, or DISCUSS |
| `reason` | string | Yes | Reason code and human explanation |
| `metadata` | object | Yes | Branch metadata (author, age, merge status) |

### Category Rules

| Category | Meaning | Deletion Allowed |
|----------|---------|-----------------|
| KEEP | Never delete this branch | No (protected, active PR, recent, or policy-preserved) |
| DELETE | Safe to delete this branch | Yes (merged and stale beyond threshold) |
| DISCUSS | Requires human review before deletion | No (unmerged but stale, invalid name, or ambiguous) |

---

## Entity: ReportEntry

Single branch record in generated report.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Branch name |
| `category` | enum | Yes | KEEP, DELETE, or DISCUSS |
| `reason` | string | Yes | Categorisation reason |
| `type` | string | No | Branch type (feat, fix, etc.) |
| `author` | string | No | Branch author |
| `ageInDays` | number | No | Age in days |
| `lastCommitDate` | string | No | ISO8601 timestamp |
| `mergeStatus` | object | No | Merge state details |

---

## Entity: CleanupReport

Complete report of categorised branches.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `timestamp` | ISO8601 string | Yes | Report generation time |
| `generator` | string | Yes | "cleanup-branches.js v1.0.0" |
| `stats` | object | Yes | Counts per category (see below) |
| `branches` | ReportEntry[] | Yes | Array of categorised branches |
| `summary` | string | No | Human-readable summary |

### Stats Object

| Field | Type | Description |
|-------|------|-------------|
| `totalBranches` | number | Total branches evaluated |
| `keepCount` | number | Branches marked KEEP |
| `deleteCount` | number | Branches marked DELETE |
| `discussCount` | number | Branches marked DISCUSS |

---

## Constants

### PROTECTED_BRANCHES

Set of branch names that are never deleted:
- `main`
- `develop`
- `master` (legacy support)
- Any branch matching organisation-specific protected patterns

### ALLOWED_BRANCH_TYPES

30+ allowed type prefixes for branch names (from CLAUDE.md):
- `feat`, `fix`, `hotfix`, `release`, `refactor`, `chore`, `task`, `docs`, `test`, `perf`, `ci`, `build`, `deps`, `security`, `design`, `a11y`, `ux`, `i18n`, `ops`, `proto`, `ds`, `api`, `schema`, `telemetry`, `content`, `seo`, `config`, `migrate`, `qa`, `uat`, `audit`, `codex`, `revert`, `research`

### FORBIDDEN_PREFIXES

Prefixes that cause immediate rejection of branch name:
- `claude/` – Reserved for Claude Code internal sessions
- `copilot/` – Reserved for GitHub Copilot integration
- `openai/` – Reserved for OpenAI integration

### REASON_CODES

Predefined categorisation reasons:

**KEEP Category**:
- `protected_branch` – Branch is in PROTECTED_BRANCHES set
- `excluded_pattern` – Branch matches exclusion regex
- `active_pr` – Branch has open PR
- `unmerged` – Branch not merged and recent
- `recent_activity` – Branch merged but recent

**DELETE Category**:
- `merged_stale` – Branch merged and older than threshold

**DISCUSS Category**:
- `naming_violation` – Invalid branch name format
- `unmerged_stale` – Branch not merged but older than threshold
- `unclear_status` – Categorisation ambiguous

---

## Relationships

```
Branch ─1──→ MergeStatus (embedded)
Branch ─1──→ CategorisationResult (output)
ReportEntry ◄─→ Branch (flattened representation)
CleanupReport ◄─1──→ ReportEntry[] (collection)
```

---

## Constraints & Validation

- **Age Boundary**: Stale threshold is configurable (default: 30 days). Branches with `ageInDays >= threshold` are considered stale.
- **Merge Detection**: Branch is "merged" if it is ancestor of ANY base branch (develop, main, master).
- **Name Validation**: All branches must pass 4-part check: (1) no forbidden prefix, (2) has exactly 2 parts separated by `/`, (3) type is allowed, (4) scope-title pattern is valid.
- **API Fallback**: If GitHub API unavailable, `hasOpenPR` defaults to false (conservative: assume branch can be deleted).
- **Date Handling**: Invalid ISO8601 dates default to epoch (age = very old), preventing data corruption.

---

**Phase 1 Status**: ✅ Data model complete | Ready for contracts definition

# Contract: Library API

**Interface**: Reusable module exports for branch categorisation  
**Modules**: `scripts/lib/*.js`  
**Type**: Node.js ES Module Library  
**Status**: Specification

## Core Export: `categorizeBranches()`

Main entry point for categorising multiple branches.

### Function Signature

```javascript
export function categorizeBranches(
  branches = [],           // string[] – branch names
  branchMetadata = {},     // object – metadata keyed by branch name
  openPRs = new Set(),     // Set<string> – branches with open PRs
  excludePattern = null,   // RegExp – exclusion pattern
  inactiveDays = 30        // number – stale threshold
)
```

### Return Type

```javascript
{
  KEEP: Array<{
    name: string,
    category: "KEEP",
    reason: string,
    type: string,
    author: string,
    ageInDays: number,
    lastCommitDate: string,
    mergeStatus: object
  }>,
  DELETE: Array<{
    name: string,
    category: "DELETE",
    reason: string,
    ...metadata
  }>,
  DISCUSS: Array<{
    name: string,
    category: "DISCUSS",
    reason: string,
    ...metadata
  }>
}
```

### Validation

- `branches` must be array of non-empty strings
- `branchMetadata` must be object with optional string keys
- `openPRs` must be Set or array convertible to Set
- `inactiveDays` must be non-negative integer
- Invalid inputs trigger early return with error logged (graceful degradation)

`categorizeBranches()` preserves a supplied `Set` and converts an array with
`new Set(openPRs)` before invoking `categorizeBranch()`. Any other value is
logged and returns empty category arrays, so `categorizeBranch()` always
receives an object that safely supports `.has()`.

### Example Usage

```javascript
import { categorizeBranches } from './scripts/lib/branch-categorization.js';

const result = categorizeBranches(
  ['feat/login', 'main', 'bugfix/typo'],
  {
    'feat/login': {
      author: 'alice@example.com',
      lastCommitDate: '2026-08-15T10:30:00Z',
      mergeStatus: { merged: false, state: 'unmerged' },
    },
    main: {
      author: 'bot',
      lastCommitDate: '2026-09-16T14:00:00Z',
      mergeStatus: { merged: true, state: 'merged', mergedToBranches: ['main'] },
    },
  },
  new Set(['feat/login']), // feat/login has open PR
  /release\/.*|hotfix\/.*/, // exclude release and hotfix branches
  30 // 30-day inactivity threshold
);

console.log(result.KEEP.length); // Branches to preserve
console.log(result.DELETE.length); // Branches ready to delete
console.log(result.DISCUSS.length); // Branches needing review
```

---

## Sub-Module: Age Calculator

### Function: `getAgeInDays(isoDate)`

Calculate branch age from ISO8601 timestamp.

```javascript
export function getAgeInDays(isoDate: string): number
```

**Input**: ISO8601 timestamp string (e.g., "2026-08-15T10:30:00Z")  
**Output**: Non-negative number (days)  
**Validation**: Invalid dates return 0 (very recent, safe to keep)

### Function: `meetsAgeThreshold(ageInDays, thresholdDays = 30)`

Determine if age exceeds threshold.

```javascript
export function meetsAgeThreshold(ageInDays: number, thresholdDays = 30): boolean
```

**Rule**: `return ageInDays >= thresholdDays`

### Function: `formatAge(ageInDays)`

Human-readable age formatting.

```javascript
export function formatAge(ageInDays: number): string
```

**Output Examples**:

- `"< 1 day"` (ageInDays < 1)
- `"3 days"` (ageInDays = 3)
- `"2 weeks"` (ageInDays = 14)
- `"1 month"` (ageInDays = 30)

---

## Sub-Module: Branch Name Validation

### Function: `validateBranchName(branch)`

Validate branch name against pattern rules.

```javascript
export function validateBranchName(branch: string): {
  valid: boolean,
  reason?: string
}
```

**Validation Steps** (in order):

1. Check forbidden prefixes (`claude/`, `copilot/`, `openai/`)
2. Verify pattern `{type}/{scope}-{title}` (exactly 2 parts separated by `/`)
3. Verify type is in ALLOWED_BRANCH_TYPES set
4. Verify scope-title format (contains hyphen, not starting/ending with hyphen)

**Return on Failure**:

```javascript
{
  valid: false,
  reason: "forbidden prefix: claude" // or other specific violation
}
```

**Return on Success**:

```javascript
{
  valid: true;
}
```

---

## Sub-Module: Git Merge Detection

Exported from `scripts/lib/git-merge-utils.js`.

### Function: `getMergeStatus(branch)`

Report which of `origin/develop` and `origin/main` contain an origin branch.

```javascript
export function getMergeStatus(branch: string): {
  state: "unmerged" | "develop" | "main" | "both" | "unknown",
  merged: boolean,
  mergedToDevelop: boolean | null,
  mergedToMain: boolean | null
}
```

**Implementation**: `isMergedToDevelop(branch)` and `isMergedToMain(branch)` each list the remote branches already merged into that base and check for `origin/{branch}`; a failed query returns `null`, and a base that does not exist in the clone answers false.
**Verdict**: `merged` is true when either base answers true, even if the other query failed, because a proven merge is stronger than a failed query. `state` is `unknown` only when no base proved a merge and at least one query failed.
**Fallback**: A failed query is never reported as unmerged. The categoriser sends an `unknown` state to DISCUSS with the unclear-status reason.

Related exports: `isMergedToDevelop(branch)`, `isMergedToMain(branch)`, `getBaseRef()`, `getMergeBase(baseRef, branchRef)` and `getUniqueCommitCount(branch, baseRef)`.

---

## Sub-Module: GitHub PR Detection

Exported from `scripts/lib/github-pr-utils.js`.

### Function: `getOpenPRs()`

Query GitHub for the head branch names of open PRs in the current repository.

```javascript
export function getOpenPRs(): Set<string> | null
```

**Implementation**: A synchronous call to `gh pr list --state open --limit 250 --json headRefName`, run against the repository of the current working directory. It takes no arguments.
**Return**: A Set of branch names with open PRs; an empty Set means a confirmed response with no open PRs.
**Fallback**: A missing CLI, an authentication or rate-limit failure, any other CLI error, or a list that reaches the 250-PR limit returns `null` to represent unavailable verification.
**Error Handling**: Logs a warning. Callers must fail closed by marking possible deletion candidates KEEP/DISCUSS or halting deletion; `hasOpenPR(branch, openPRs)` throws when verification is unavailable.

Related exports: `isGhAvailable()`, `hasOpenPR(branch, openPRs)` and `getOpenPRDetails()`.

---

## Sub-Module: Exclusion Pattern Matching

### Function: `buildExclusionRegex(userPatterns = "")`

Build exclusion regex from user patterns.

```javascript
export function buildExclusionRegex(userPatterns?: string): RegExp
```

**Combines**:

1. Default patterns: `release/.*`, `hotfix/.*`
2. User patterns (pipe or comma-separated)
3. Returns single RegExp `(pattern1|pattern2|...)`

**Error Handling**: Invalid regex returns default patterns only (log warning)

### Function: `matchesExclusionPattern(branch, pattern)`

Test if branch matches exclusion pattern.

```javascript
export function matchesExclusionPattern(branch: string, pattern: RegExp): boolean
```

**Return**: `pattern.test(branch)`

---

## Sub-Module: Report Formatting

Exported from `scripts/lib/report-formatter.js`. The CLI's own Markdown and JSON reports are written by `writeMarkdownReport()` and `writeJsonReport()` in `scripts/cleanup-branches.js` (see `cli-interface.md`).

### Function: `formatAuditReportMarkdown(auditReport)`

Format the audit report header.

```javascript
export function formatAuditReportMarkdown(auditReport: {
  timestamp, dryRun, inactiveDays
}): string
```

**Output**: A Markdown header with the date, run mode and inactivity threshold. It is not a complete branch audit.
**Throws**: `RangeError` when the timestamp is not a valid date.

### Function: `formatAuditReportJSON(auditReport)`

Serialize an audit report as indented JSON.

```javascript
export function formatAuditReportJSON(auditReport: object): string | undefined
```

**Output**: `JSON.stringify(auditReport, null, 2)`. It adds no fields of its own.
**Throws**: `TypeError` when serialization meets a cycle or BigInt.

Related exports: `formatDeletionCandidatesJSON(candidates, summary, timestamp, repository)` and `formatDISCUSSSection(discussBranches)`.

---

## Constants Export

```javascript
export const PROTECTED_BRANCHES = new Set(['main', 'develop', 'production', 'staging', 'master']);
export const FORBIDDEN_PREFIXES = ['claude', 'copilot', 'openai'];
export const ALLOWED_BRANCH_TYPES = new Set([
  'feat',
  'fix',
  'hotfix',
  'release',
  'refactor',
  'chore',
  'task',
  'docs',
  'test',
  'perf',
  'ci',
  'build',
  'deps',
  'security',
  'design',
  'a11y',
  'ux',
  'i18n',
  'ops',
  'proto',
  'ds',
  'api',
  'schema',
  'telemetry',
  'content',
  'seo',
  'config',
  'migrate',
  'qa',
  'uat',
  'audit',
  'codex',
  'revert',
  'research',
]);
export const REASON_CODES = {
  KEEP: {
    protected_branch: 'Protected branch (main, develop, production, staging, master)',
    excluded_pattern: 'Matches exclusion pattern (release/*, hotfix/*)',
    active_pr: 'Has active pull request',
    author_preserved: 'Author matches an explicit preservation pattern',
    unmerged: 'Not fully merged to any base branch',
    recent_activity: 'Recently active (merged and recent)',
  },
  DELETE: {
    merged_stale: 'Merged and inactive beyond threshold',
  },
  DISCUSS: {
    naming_violation: 'Invalid branch name format',
    unmerged_stale: 'Unmerged and stale',
    pr_verification_unavailable: 'Open-PR verification unavailable; deletion blocked',
    unclear_status: 'Unclear merge/age status (manual review needed)',
  },
};
```

---

## Error Handling Policy

**Graceful Degradation**: All functions should fail gracefully rather than throw:

- Missing `git`: Treat as fatal. Missing `gh`: Log a warning and fail closed
- Invalid input: Log error, use default or skip processing
- API timeouts: Log a warning and mark candidates DISCUSS or halt deletion

**Logging Levels**:

- Error: Fatal conditions (invalid args, git not found)
- Warning: Recoverable issues (API error, invalid regex)
- Info: Informational (branch processed, threshold met)
- Debug: (verbose mode only) Gate evaluations, command outputs

---

## Testing Requirements

See `quickstart.md` for test scenarios.

---

**Contract Status**: ✅ Complete

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

### Example Usage

```javascript
import { categorizeBranches } from './scripts/lib/branch-categorization.js';

const result = categorizeBranches(
  ['feat/login', 'main', 'bugfix/typo'],
  {
    'feat/login': {
      author: 'alice@example.com',
      lastCommitDate: '2026-08-15T10:30:00Z',
      mergeStatus: { merged: false, state: 'unmerged' }
    },
    'main': {
      author: 'bot',
      lastCommitDate: '2026-09-16T14:00:00Z',
      mergeStatus: { merged: true, state: 'merged', mergedToBranches: ['main'] }
    }
  },
  new Set(['feat/login']),    // feat/login has open PR
  /release\/.*|hotfix\/.*/,   // exclude release and hotfix branches
  30                          // 30-day inactivity threshold
);

console.log(result.KEEP.length);     // Branches to preserve
console.log(result.DELETE.length);   // Branches ready to delete
console.log(result.DISCUSS.length);  // Branches needing review
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
  valid: true
}
```

---

## Sub-Module: Git Merge Detection

### Function: `detectMergeStatus(branch, bases = ['develop', 'main'])`

Detect if branch is merged to any base branch.

```javascript
export function detectMergeStatus(branch: string, bases?: string[]): {
  merged: boolean,
  state: "merged" | "unmerged" | "unknown",
  mergedToBranches?: string[]
}
```

**Implementation**: `git merge-base --is-ancestor {branch} {base}` for each base  
**Fallback**: If git fails, return `state: "unknown"` (conservative: assumes unmerged)

---

## Sub-Module: GitHub PR Detection

### Function: `detectOpenPRs(owner, repo, branch?)`

Query GitHub for open PRs on a branch.

```javascript
export function detectOpenPRs(
  owner: string,
  repo: string,
  branch?: string
): Promise<Set<string>>
```

**Implementation**: `gh pr list --repo {owner}/{repo} --json headRefName`  
**Return**: Set of branch names with open PRs  
**Fallback**: On API error, return empty Set (conservative: assume no PRs)  
**Error Handling**: Log warning, do not throw

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

### Function: `formatMarkdownReport(categorised, options)`

Generate Markdown report.

```javascript
export function formatMarkdownReport(
  categorised: { KEEP, DELETE, DISCUSS },
  options?: { timestamp?, title?, verbose? }
): string
```

**Output**: Complete Markdown document with summary table, category sections, and branch details

### Function: `formatJSONReport(categorised, options)`

Generate JSON report.

```javascript
export function formatJSONReport(
  categorised: { KEEP, DELETE, DISCUSS },
  options?: { timestamp?, generator? }
): string
```

**Output**: Stringified JSON with stats, timestamp, and flattened branch entries

---

## Constants Export

```javascript
export const PROTECTED_BRANCHES = new Set(['main', 'develop', 'master']);
export const FORBIDDEN_PREFIXES = ['claude', 'copilot', 'openai'];
export const ALLOWED_BRANCH_TYPES = new Set([
  'feat', 'fix', 'hotfix', 'release', 'refactor', 'chore', 'task', 'docs',
  'test', 'perf', 'ci', 'build', 'deps', 'security', 'design', 'a11y', 'ux',
  'i18n', 'ops', 'proto', 'ds', 'api', 'schema', 'telemetry', 'content',
  'seo', 'config', 'migrate', 'qa', 'uat', 'audit', 'codex', 'revert', 'research'
]);
export const REASON_CODES = {
  KEEP: { protected_branch, excluded_pattern, active_pr, unmerged, recent_activity },
  DELETE: { merged_stale },
  DISCUSS: { naming_violation, unmerged_stale, unclear_status }
};
```

---

## Error Handling Policy

**Graceful Degradation**: All functions should fail gracefully rather than throw:
- Missing git/gh commands: Log warning, continue with conservative assumptions
- Invalid input: Log error, use default or skip processing
- API timeouts: Log warning, use fallback (e.g., assume no open PRs)

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

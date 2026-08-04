---
file_type: agent
name: Agent Architecture
description: Technical documentation of planner and reviewer agent structure, interfaces, and logging
---

# Agent Architecture

## Module System

Both agents use ES6 modules (no CommonJS). Repository configured with `"type": "module"` in `package.json`.

### Imports Pattern

```javascript
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { Logger } from "../utils/logger.js";
```

### Module Entry Points

```javascript
// Main execution function (GitHub Actions)
export async function run(context = github.context, options = {}) { ... }

// Stub entry point (legacy, planner only)
export async function runPlanner(options = {}) { ... }

// CLI detection
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run(github.context, { dryRun }).catch((error) => { ... });
}
```

## Interface: `run(context, options)`

### Parameters

```javascript
async function run(
  context = github.context,  // GitHub Actions context (payload, repo, ref)
  options = {}               // { dryRun?: boolean }
)
```

### Context Structure

```javascript
{
  payload: {
    issue?: { number, title, body },          // For issue events
    pull_request?: { number, title, body, head: { sha } }  // For PR events
  },
  repo: {
    owner: string,           // Repository owner
    repo: string             // Repository name
  }
}
```

### Options

```javascript
{
  dryRun?: boolean
    // true: Log output without API mutations (safe testing)
    // false: Execute API calls (default from environment)
    // Precedence: explicit option > DRY_RUN env var > false
}
```

### Return Value

Both functions return `Promise<void>`. Exit code is set via `core.setFailed()` on error.

## Logging System

### Logger Class

Located: `.github/scripts/utils/logger.js`

```javascript
class Logger {
  constructor(level = 'info') {
    // level: 'debug' | 'info' | 'warn' | 'error'
    // Invalid level throws Error
  }

  // Primary methods
  debug(message, data) { this.log('debug', message, data); }
  info(message, data) { this.log('info', message, data); }
  warn(message, data) { this.log('warn', message, data); }
  error(message, data) { this.log('error', message, data); }

  // Internal method
  log(level, message, data = {}) {
    // Output format: JSON to stdout (info/debug/warn) or stderr (error)
    // Output: { timestamp, level, message, ...data }
  }
}
```

### Log Level Hierarchy

| Level | Priority | Threshold |
|-------|----------|-----------|
| debug | 0 (lowest) | Always logs |
| info | 1 | Logs info+ |
| warn | 2 | Logs warn+ |
| error | 3 (highest) | Only error |

### Log Output Format

JSON structure with required and context fields:

```json
{
  "timestamp": "2026-05-31T10:23:45.123Z",
  "level": "info",
  "message": "Planner agent started",
  "event": "start",
  "issueNumber": 42,
  "repo": ".github"
}
```

**Standard Fields:**

- `timestamp` — ISO 8601 timestamp
- `level` — Log level
- `message` — Human-readable message
- `event` — Semantic category (see Log Events below)
- Additional context as needed

**Output Stream:**

- info, debug, warn → stdout
- error → stderr

### Log Events

#### Planner Agent

| Event | Timing | Metrics |
|-------|--------|---------|
| `start` | Agent initialization | issueNumber, repo |
| `plan-generated` | After plan created | planType, issueNumber |
| `dry-run` | When DRY_RUN mode active | — |
| `comment-created` | After posting new comment | issueNumber |
| `comment-updated` | After updating existing comment | issueNumber, commentId |
| `complete` | Successful finish | duration (ms) |
| `error` | Exception caught | error (message), duration (ms) |

#### Reviewer Agent

| Event | Timing | Metrics |
|-------|--------|---------|
| `start` | Agent initialization | prNumber, repo |
| `analysis` | After file analysis | filesChanged, criticalRisk, highRisk, mediumRisk, lowRisk, blockers |
| `dry-run` | When DRY_RUN mode active | — |
| `comment-created` | After posting new comment | prNumber |
| `comment-updated` | After updating existing comment | prNumber, commentId |
| `complete` | Successful finish | duration (ms) |
| `error` | Exception caught | error (message), duration (ms) |

### Usage Pattern

```javascript
import { Logger } from "../utils/logger.js";

const logger = new Logger(process.env.LOG_LEVEL || "info");

// In function
logger.info("Agent started", {
  event: "start",
  issueNumber: context.payload.issue?.number,
  repo: context.repo.repo,
});
```

## Planner Agent Structure

### Location

`.github/scripts/agents/planner.agent.js`

### Main Functions

```javascript
// Analyze issue context (title, labels, description)
async function analyzeContext(octokit, context)
  → { number, title, description, labels, linkedIssues, type }

// Determine plan type from content
function determinePlanType(title, labels, description)
  → 'architecture' | 'implementation' | 'task'

// Generate plan based on type
function generatePlan(context)
  → string (markdown)

// Generate specific plan templates
function generateArchitecturePlan(issue) → string
function generateImplementationPlan(issue) → string
function generateTaskPlan(issue) → string

// Extract #123 issue references
function extractLinkedIssues(text)
  → string[] (issue numbers)
```

### Plan Type Detection

```
if (labels includes "type:architecture" OR
    text includes "design" OR
    text includes "architecture")
  → "architecture"
else if (labels includes "type:feature" OR
         labels includes "type:enhancement" OR
         text includes "implement")
  → "implementation"
else
  → "task"
```

### Comment Deduplication Marker

```markdown
<!-- planner-agent-summary -->
```

Located at end of generated plan. Used to find existing comments:

```javascript
const existingComment = prComments.data.find((c) =>
  c.body?.includes("<!-- planner-agent-summary -->"),
);
```

## Reviewer Agent Structure

### Location

`.github/scripts/agents/reviewer.agent.js`

### Main Functions

```javascript
// Categorize file by risk
function categorizeFile(filename)
  → { category: string, riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' }

// Detect security-sensitive changes
function hasSecurityFileChange(files)
  → boolean

// Detect large deletions
function hasLargeDeletion(files)
  → boolean (> 500 lines)

// Detect migration without rollback
function hasMigrationWithoutRollback(files)
  → boolean
```

### Risk Categorization Rules

```javascript
CRITICAL:
  - /\.github\/workflows/   → Category: "Workflows"
  - secrets, API keys       → Category: "Configuration"

HIGH:
  - /.github|secrets|api[_-]?key|password|token/
  - /package\.(json|lock)|composer\.(json|lock)|yarn\.lock|pnpm-lock\.yaml|requirements\.txt/
  - /migration|schema|database/
  - /security|license|codeofconduct/

MEDIUM:
  - /src\/|test\/|spec\/|\.test\.|\.spec\./

LOW (default):
  - /readme|docs\/|documentation/
```

### Comment Deduplication Marker

```markdown
<!-- reviewer-agent-summary -->
```

Located at end of summary. Prevents duplicate comments.

### Pagination Handling

Large PRs (>100 files) are handled via `octokit.paginate()`:

```javascript
let files = await octokit.paginate(octokit.rest.pulls.listFiles, {
  owner, repo, pull_number: pr.number,
  per_page: 100
});
// Returns all files across all pages
```

## Error Handling Pattern

Both agents follow identical error handling:

```javascript
async function run(context, options = {}) {
  const startTime = Date.now();
  try {
    // Early validation
    const token = core.getInput("github-token") || process.env.GITHUB_TOKEN;
    if (!token) throw new Error("Missing GITHUB_TOKEN...");

    // Structured logging
    logger.info("Agent started", { event: "start", ... });

    // Main logic
    try {
      // API calls
      const data = await octokit.rest.issues.get({...});
    } catch (error) {
      throw new Error(`Failed to fetch: ${error.message}`);
    }

    // Success logging
    logger.info("Completed successfully", { event: "complete", duration: ... });

  } catch (error) {
    // Error logging with duration
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Agent failed", {
      event: "error",
      error: message,
      duration: Date.now() - startTime,
    });
    core.setFailed(message);
    process.exit(1);
  }
}
```

### Error Exit Codes

- **Exit 0:** Success (no errors)
- **Exit 1:** Fatal error (thrown exception, caught in main try-catch)

## Dry-Run Mode

### Option Precedence

```javascript
const dryRun =
  options.dryRun !== undefined
    ? options.dryRun
    : process.argv.includes("--dry-run") || process.env.DRY_RUN === "true";
```

Priority: explicit option > CLI flag > env var > false

### Behavior

```javascript
if (dryRun) {
  core.info(`DRY-RUN: Would ${action}:\n${output}`);
  logger.info("Dry-run mode: ${action} not performed", { event: "dry-run" });
} else {
  // Perform actual API mutation
  await octokit.rest.issues.createComment({...});
}
```

## Testing

### Test Patterns

Tests located in `.github/scripts/agents/__tests__/`:

- `planner.agent.test.js`
- `reviewer.agent.test.js`

### Test Helpers

Located in `tests/utility/test-helpers.js`:

- `mockOctokit()` — Mock GitHub API
- `mockContext()` — Mock GitHub Actions context
- `mockChangedFiles()` — Mock PR file changes
- `expectCommentPosted()` — Assert comment posted
- `expectDryRun()` — Assert dry-run behavior

### Coverage Requirements

- Minimum: 80% coverage for both agents
- All branches tested (success, error, dry-run paths)
- Blocker detection scenarios
- Comment deduplication

## Dependencies

### External

- `@actions/core` — GitHub Actions logging/outputs
- `@actions/github` — GitHub API client (octokit)

### Internal

- `Logger` — Structured logging utility
- No other internal dependencies

## Performance Characteristics

| Operation | Complexity | Notes |
|-----------|-----------|-------|
| Context analysis | O(n) | n = issue labels |
| File categorization | O(m) | m = files changed |
| Comment deduplication | O(p) | p = comments on PR (usually <10) |
| Pagination | O(⌈f/100⌉) | f = files changed |

Typical execution: 500-2000ms (depends on API latency)

## Security Considerations

### Token Handling

- Never logged (stripped before logging)
- Validated early in run()
- Error messages don't include token fragments

### Input Validation

- Issue/PR number extracted safely (optional chaining)
- No string interpolation in API calls
- File paths used only in categorization (safe regex)

### Output Safety

- Generated plans don't execute code
- Markdown is plain text (no script injection)
- Comment markers are HTML comments (safe)

## Related Files

- Source: `.github/scripts/agents/planner.agent.js`
- Source: `.github/scripts/agents/reviewer.agent.js`
- Logger: `.github/scripts/utils/logger.js`
- Tests: `.github/scripts/agents/__tests__/`
- Runbooks: `docs/agents/PLANNER_RUNBOOK.md`, `REVIEWER_RUNBOOK.md`

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

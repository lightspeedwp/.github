---
title: Script Integration Guide
date: 2026-08-30
version: 1.0
---

# Automation Script Integration Guide

Guidelines for adding new automation scripts to the LightSpeed framework and integrating them with existing orchestration systems.

---

## Table of Contents

1. [Script Classification](#script-classification)
2. [Template & Boilerplate](#template--boilerplate)
3. [Adding New Scripts](#adding-new-scripts)
4. [Integration Patterns](#integration-patterns)
5. [Testing & Validation](#testing--validation)
6. [Performance & Optimization](#performance--optimization)
7. [Deployment & CI/CD](#deployment--cicd)

---

## Script Classification

Scripts are classified into three types based on functionality and responsibility:

### Type A: Orchestrators

**Purpose**: Coordinate and delegate work to multiple handlers or workflows.

**Characteristics**:

- Entry point for multi-step operations
- Routes issues/PRs to appropriate handlers
- Manages batch processing and rate limiting
- Collects and reports results

**Examples**:

- `handlers-orchestrator.js` — Routes issues to Tier 1 handlers
- `label-orchestrator.js` — Coordinates label operations
- `pr-triage-orchestrator.js` — Manages PR triage workflow

**Template**:

```javascript
/**
 * <Name> Orchestrator
 * 
 * Coordinates <operation> across <targets>
 * 
 * Handlers:
 * - handler1: <description>
 * - handler2: <description>
 */

async function orchestrate(config) {
  // 1. Initialize resources
  // 2. Fetch targets (issues/PRs)
  // 3. For each batch:
  //    - Route to handlers in parallel
  //    - Track progress
  //    - Handle errors with retry
  // 4. Collect and report results
}
```

**Validation Checklist**:

- [ ] Supports `--dry-run` mode (preview changes)
- [ ] Supports `--mode` parameter (dry-run, interactive, auto)
- [ ] Implements batch processing (`--batch-size`)
- [ ] Provides progress tracking (batch numbers, metrics)
- [ ] Includes error retry logic with exponential backoff
- [ ] Generates summary report
- [ ] Respects rate limiting

### Type B: Handlers & Agents

**Purpose**: Perform specific automated tasks on individual issues/PRs.

**Characteristics**:

- Process single issue/PR or small batch
- Return structured result (status, action, metadata)
- Implement decision-making logic
- Called by orchestrators

**Examples**:

- `review-meta-labels.js` — Validates meta labels
- `sync-pr-labels.js` — Synchronizes PR labels
- `manage-stale-issues.js` — Marks stale issues

**Template**:

```javascript
/**
 * <Name> Handler
 * 
 * <Description of what this handler does>
 * 
 * Output:
 * - status: 'updated' | 'skipped' | 'error'
 * - title: (reason or change description)
 * - reason: (explanation if skipped/error)
 * - confidence: (0-100, for auto mode)
 */

export async function processIssue(issue, options) {
  const { dryRun, githubRequest, owner, repo } = options;
  
  // 1. Analyze issue
  const analysis = analyzeIssue(issue);
  
  // 2. Determine action
  if (shouldSkip(analysis)) {
    return { status: 'skipped', title: 'Already processed' };
  }
  
  // 3. Plan changes
  const changes = planChanges(issue, analysis);
  
  // 4. Apply changes (unless dry-run)
  if (!dryRun) {
    await applyChanges(issue, changes, { githubRequest, owner, repo });
  }
  
  return {
    status: 'updated',
    title: changes.description,
    confidence: analysis.confidence
  };
}
```

**Validation Checklist**:

- [ ] Exports `processIssue(issue, options)` function
- [ ] Returns structured result with status and metadata
- [ ] Respects `dryRun` option (no writes when true)
- [ ] Includes confidence score (0-100) for auto mode
- [ ] Implements skip conditions
- [ ] Proper error handling and logging
- [ ] Uses prefixed labels (e.g., `type:bug` not `bug`)

### Type C: Utilities & Helpers

**Purpose**: Perform data processing, validation, and integration support.

**Characteristics**:

- Standalone operations or supporting functions
- May read/write file system
- Generate reports or audit data
- Optional execution from CLI

**Examples**:

- `audit-issue-metadata.js` — Audit and report
- `profiler.js` — Performance profiling
- `staging-validation.js` — Release validation

**Template**:

```javascript
/**
 * <Name> Utility
 * 
 * <Description>
 * 
 * Output:
 * - CSV export
 * - JSON report
 * - Markdown summary
 */

async function main() {
  const config = parseArgs(process.argv);
  
  // 1. Fetch data
  const data = await fetchData(config);
  
  // 2. Process/analyze
  const results = analyze(data, config);
  
  // 3. Generate output
  await generateReport(results, config);
}

// Export for use as module
export { analyze, generateReport };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
```

**Validation Checklist**:

- [ ] Handles file I/O safely (error handling, path validation)
- [ ] Supports `--output` for report destination
- [ ] Provides `--format` option (csv, json, markdown)
- [ ] Exports main functions for module use
- [ ] Clear exit codes (0 for success, 1 for error)

---

## Template & Boilerplate

### New Orchestrator Template

Save as `scripts/automation/my-orchestrator.js`:

```javascript
#!/usr/bin/env node

/**
 * My Orchestrator — <Brief description>
 *
 * Orchestrates <operation> across <targets>
 *
 * Usage:
 *   node scripts/automation/my-orchestrator.js \
 *     --mode dry-run \
 *     --batch-size 10
 */

import { Octokit } from "@octokit/rest";

// Configuration with sensible defaults
const defaultConfig = {
  owner: "lightspeedwp",
  repo: ".github",
  mode: "dry-run", // dry-run | interactive | auto
  batchSize: 10,
  maxRetries: 3,
  retryDelayMs: 1000,
  rateLimit: 100,
  timeout: 30000,
  progressCallback: null,
  metricsCallback: null,
};

// Parse command-line arguments
function parseArgs(argv) {
  const config = { ...defaultConfig };
  // ... argument parsing ...
  return config;
}

// Get GitHub API token
function getAuthToken() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable not set");
  }
  return token;
}

// Initialize Octokit
function initializeOctokit(token) {
  return new Octokit({ auth: token });
}

// Main orchestrator
async function orchestrate(config) {
  console.log("🚀 Starting My Orchestrator");
  
  // Validate configuration
  if (!["dry-run", "interactive", "auto"].includes(config.mode)) {
    throw new Error(`Invalid mode: ${config.mode}`);
  }
  
  // Initialize GitHub API
  const token = getAuthToken();
  const octokit = initializeOctokit(token);
  
  // Fetch targets
  const targets = await fetchTargets(octokit, config);
  
  // Process targets
  const results = [];
  for (let i = 0; i < targets.length; i += config.batchSize) {
    const batch = targets.slice(i, i + config.batchSize);
    console.log(`Processing batch ${Math.floor(i / config.batchSize) + 1}...`);
    
    for (const target of batch) {
      const result = await processTarget(target, config, octokit);
      results.push(result);
    }
  }
  
  // Generate report
  generateReport(results, config);
  return { results };
}

// Entry point
async function main() {
  try {
    const config = parseArgs(process.argv);
    await orchestrate(config);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

// Export for testing
export { orchestrate, parseArgs };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
```

### New Handler Template

Save as `scripts/automation/handlers/handle-my-operation.js`:

```javascript
/**
 * Handle My Operation
 *
 * Performs <specific operation> on issues with <criteria>
 *
 * Output:
 * - status: 'updated' | 'skipped' | 'error'
 * - title: (action description)
 * - confidence: 0-100
 */

export async function processIssue(issue, options) {
  const { dryRun, githubRequest, owner, repo } = options;
  
  // Step 1: Analyze issue
  const analysis = analyzeIssue(issue);
  
  // Step 2: Skip if not applicable
  if (shouldSkip(analysis)) {
    return {
      status: "skipped",
      issueNumber: issue.number,
      title: "Not applicable to this issue",
    };
  }
  
  // Step 3: Plan changes
  let changes = {};
  try {
    changes = planChanges(issue, analysis);
  } catch (error) {
    return {
      status: "error",
      issueNumber: issue.number,
      reason: `Failed to plan changes: ${error.message}`,
    };
  }
  
  // Step 4: Apply changes
  if (!dryRun) {
    try {
      await applyChanges(issue, changes, {
        githubRequest,
        owner,
        repo,
      });
    } catch (error) {
      return {
        status: "error",
        issueNumber: issue.number,
        reason: `Failed to apply changes: ${error.message}`,
      };
    }
  }
  
  return {
    status: "updated",
    issueNumber: issue.number,
    title: changes.description,
    confidence: analysis.confidence,
  };
}

// Helper functions
function analyzeIssue(issue) {
  // Implement analysis logic
  return {
    applicable: true,
    confidence: 85,
  };
}

function shouldSkip(analysis) {
  return !analysis.applicable;
}

function planChanges(issue, analysis) {
  // Implement change planning
  return {
    description: "Updated issue",
    labels: [],
  };
}

async function applyChanges(issue, changes, context) {
  // Implement change application
  const { githubRequest, owner, repo } = context;
  // ... GitHub API calls ...
}
```

---

## Adding New Scripts

### Step 1: Create Script File

1. **Location**: `scripts/automation/my-script.js`
2. **Naming**: Use kebab-case: `action-description.js`
3. **Type**: Choose Type A (Orchestrator), B (Handler), or C (Utility)

### Step 2: Implement Core Functionality

Follow template for your script type:

```javascript
/**
 * Script header with:
 * - Purpose
 * - Usage examples
 * - Configuration options
 */

// Implement main logic

// Export for testing
export { mainFunction, helperFunctions };

// Entry point for CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
```

### Step 3: Add Label Compliance

**CRITICAL**: Use prefixed labels only.

```javascript
// ✅ CORRECT - Use prefixes
const labels = ["type:bug", "priority:high", "area:ci"];

// ❌ WRONG - Bare labels
const labels = ["bug", "urgent", "ci"];
```

Reference: `.github/labels.yml` (158 canonical labels)

### Step 4: Implement Error Handling

```javascript
// Categorize errors for retry logic
function categorizeError(error) {
  if (error.message.includes("timeout")) {
    return { type: "timeout", retryable: true };
  }
  if (error.message.includes("rate limit")) {
    return { type: "rate-limit", retryable: true };
  }
  if (error.message.includes("401")) {
    return { type: "auth", retryable: false };
  }
  return { type: "unknown", retryable: false };
}

// Retry with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3) {
  let delay = 1000;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}
```

### Step 5: Add Logging

```javascript
// Log operations with symbols for clarity
console.log("✅ Issue #123 updated with labels");
console.log("⏭️  Issue #456 skipped (already processed)");
console.log("❌ Issue #789 error: API timeout");
console.log("⚠️  Retry 1/3 after 1000ms");

// Progress tracking
console.log(`Processing batch ${batch}/${totalBatches}...`);
console.log(`Progress: ${processed}/${total} (${percent}%)`);
```

### Step 6: Add Configuration Support

```javascript
// Support command-line parameters
const defaultConfig = {
  mode: "dry-run",
  limit: 50,
  batchSize: 10,
  // ... other options
};

function parseArgs(argv) {
  const config = { ...defaultConfig };
  
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--mode" && i + 1 < argv.length) {
      config.mode = argv[++i];
    }
    // ... parse other args
  }
  
  return config;
}
```

### Step 7: Add Help/Documentation

```javascript
function showHelp() {
  console.log(`
    Usage: node scripts/automation/my-script.js [options]
    
    Options:
      --mode MODE         dry-run, interactive, or auto (default: dry-run)
      --limit N          Max issues to process (default: 50)
      --batch-size N     Issues per batch (default: 10)
      --dry-run          Preview changes without applying
      --help             Show this help message
  `);
}
```

### Step 8: Test Script

```bash
# Test with help
node scripts/automation/my-script.js --help

# Test with dry-run
node scripts/automation/my-script.js --mode dry-run --limit 5

# Test with small batch
node scripts/automation/my-script.js --mode dry-run --batch-size 2

# Test error handling
export GITHUB_TOKEN=invalid && node scripts/automation/my-script.js
```

### Step 9: Register Script

1. Update `REGISTRY.md` with new script details
2. Add to appropriate category (Type A, B, or C)
3. Document configuration options
4. Include usage examples

### Step 10: Run Performance Profiler

```bash
# Add script to profiler and run
node scripts/automation/profiler.js

# Review baseline metrics
cat .github/reports/profiling/baseline-2026-08-30.json
```

---

## Integration Patterns

### Pattern 1: Chained Orchestration

```bash
# Step 1: Triage issues
node scripts/automation/handlers-orchestrator.js --mode auto

# Step 2: Validate labels
node scripts/automation/review-meta-labels.js --fix

# Step 3: Report metrics
node scripts/automation/audit-issue-metadata.js --output report.csv
```

### Pattern 2: GitHub Actions Integration

```yaml
name: Daily Automation
on:
  schedule:
    - cron: "0 2 * * *"

jobs:
  automate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      
      - name: Run Handlers Orchestrator
        run: |
          node scripts/automation/handlers-orchestrator.js \
            --mode auto \
            --batch-size 10
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Generate Report
        if: always()
        run: |
          node scripts/automation/audit-issue-metadata.js \
            --output ./metrics.csv
```

### Pattern 3: Conditional Execution

```javascript
// Execute script based on event trigger
const trigger = process.env.GITHUB_EVENT_NAME;

if (trigger === "schedule") {
  // Run full automation
  await orchestrate(fullConfig);
} else if (trigger === "pull_request") {
  // Run limited validation
  await orchestrate(limitedConfig);
} else {
  // Skip automated changes
  console.log("Manual trigger - dry-run only");
  await orchestrate(dryRunConfig);
}
```

### Pattern 4: Error Recovery

```javascript
// Retry entire operation on failure
async function runWithRecovery(operation, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}
```

---

## Testing & Validation

### Unit Tests

```javascript
// test/my-script.test.js
import { processIssue, analyzeIssue } from "../scripts/automation/handlers/my-handler.js";

describe("My Handler", () => {
  test("skips issues that don't match criteria", async () => {
    const issue = { number: 1, title: "Not applicable" };
    const result = await processIssue(issue, { dryRun: true });
    
    expect(result.status).toBe("skipped");
  });
  
  test("analyzes applicable issues correctly", () => {
    const issue = { labels: [{ name: "type:bug" }] };
    const analysis = analyzeIssue(issue);
    
    expect(analysis.applicable).toBe(true);
    expect(analysis.confidence).toBeGreaterThan(0);
  });
});
```

### Integration Tests

```bash
# Test with real GitHub API (dry-run)
export GITHUB_TOKEN=<valid_token>
node scripts/automation/my-script.js --mode dry-run --limit 5
```

### Lint & Format

```bash
# Lint JavaScript
npm run lint:js scripts/automation/my-script.js

# Format code
npm run format scripts/automation/my-script.js

# Type check (if using TypeScript)
npm run type-check
```

---

## Performance & Optimization

### Profiling

```bash
# Generate baseline for your new script
node scripts/automation/profiler.js

# Compare against targets:
# - execution time <1000ms per script
# - memory usage <1MB per script
```

### Optimization Techniques

**Phase 2 Applied Techniques**:

1. **Set-based operations** for O(1) lookups (vs O(n) arrays)
2. **In-memory caching** for expensive computations
3. **Pre-allocation** of arrays to avoid growth overhead
4. **Parallel execution** with Promise.all()
5. **Date pre-parsing** to avoid repeated object creation

### Example: Label Lookup Optimization

```javascript
// ❌ SLOW - O(n) for every check
if (issue.labels.some(l => l.name === "type:bug")) { }

// ✅ FAST - O(1) lookup
const labelSet = new Set(["type:bug", "type:feature"]);
if (labelSet.has(issue.labels[0].name)) { }

// ✅ FASTER - Pre-built Set at init time
const REQUIRED_LABELS = new Set([
  "type:bug", "type:feature", "priority:high"
]);
```

---

## Deployment & CI/CD

### GitHub Actions Workflow

```yaml
name: Deploy Script
on:
  push:
    paths:
      - 'scripts/automation/my-script.js'
      - '.github/workflows/deploy-script.yml'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - run: npm ci
      - run: npm test -- scripts/automation/my-script.js
      - run: npm run lint:js scripts/automation/my-script.js
  
  validate:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - run: npm ci
      
      - name: Dry-run test
        run: |
          node scripts/automation/my-script.js --mode dry-run --limit 5
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code linted and formatted
- [ ] Performance profiled (<1000ms)
- [ ] Error handling tested (network, auth, validation errors)
- [ ] Documentation updated
- [ ] Dry-run tested successfully
- [ ] No breaking changes to existing scripts
- [ ] Label prefixes validated (all from `.github/labels.yml`)

---

## Validation Checklist for New Scripts

### Code Quality

- [ ] ESLint passes: `npm run lint:js`
- [ ] Prettier formatted: `npm run format`
- [ ] No console.log in production code
- [ ] Proper error handling

### Functionality

- [ ] Handles all error scenarios
- [ ] Respects `--dry-run` flag
- [ ] Supports batch processing
- [ ] Implements retry logic
- [ ] Returns correct status codes

### Performance

- [ ] Execution time <1000ms (if possible)
- [ ] Memory usage <1MB
- [ ] Avoids N² algorithms
- [ ] Uses Sets for label lookups

### Documentation

- [ ] Header comments describe purpose
- [ ] Configuration options documented
- [ ] Usage examples provided
- [ ] Error messages are helpful

### Integration

- [ ] Registered in REGISTRY.md
- [ ] Exportable for module use
- [ ] CLI executable with --help
- [ ] Works with GitHub Actions

---

## References

- **Registry**: `REGISTRY.md` — Complete script inventory
- **Usage Examples**: `USAGE_EXAMPLES.md` — Command-line examples
- **Troubleshooting**: `TROUBLESHOOTING.md` — Common issues and solutions
- **Label Strategy**: `.github/labels.yml` — Canonical label definitions
- **Coding Standards**: `.github/instructions/coding-standards.instructions.md`

---

**Generated By**: Claude Code  
**Date**: 2026-08-30  
**Version**: 1.0

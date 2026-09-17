---
title: "Linting Unified Workflow"
description: "Consolidated JavaScript/TypeScript and Markdown linting for the LightSpeed .github repository"
date_created: "2026-09-17"
last_updated: "2026-09-17"
---

# Linting Unified • Code Quality

**File:** `.github/workflows/linting-unified.yml`  
**Status:** Phase 5 Implementation  
**Consolidates:** 2 archived linting workflows  
**Performance Target:** ≤50 min/month (baseline reduction TBD)

---

## Overview

`linting-unified.yml` is a consolidated GitHub Actions workflow that consolidates linting validation into a single, unified code quality engine. It performs comprehensive linting for JavaScript/TypeScript and Markdown files with conditional execution based on trigger events and manual scope selection.

### Key Features

- **Parallel linting jobs:** JavaScript/TypeScript and Markdown linting run simultaneously
- **PR-triggered validation:** Branch naming, template routing, changelog validation
- **Detailed error reporting:** Separate failure reporting per linter type
- **PR comments:** Auto-generated remediation suggestions for linting failures
- **Metrics collection:** GitHub Actions minutes tracking and performance reporting
- **Manual trigger:** workflow_dispatch with scope selection (all/js-only/md-only)
- **Composite action integration:** Metrics collection and validation check reporting

---

## Trigger Patterns

| Event | Conditions | Jobs Triggered |
|-------|-----------|-----------------|
| `pull_request` | opened, edited, synchronize, reopened on develop | lint-context, lint-js, lint-md, linting-metrics, linting-summary |
| `push` | develop branch | lint-context, lint-js, lint-md, linting-metrics, linting-summary |
| `workflow_dispatch` | manual trigger with scope input | Conditional jobs based on scope parameter (all/js-only/md-only) |

---

## Linting Jobs Reference

### Lint Context Determination

**Job:** `lint-context`  
**Triggers:** All (setup job, runs first)  
**Status:** ✅ Implemented

Determines which linting suites to run based on trigger event type and scope.

**Decision Logic:**

```bash
# Default: JS + Markdown
RUN_JS=true
RUN_MD=true

# workflow_dispatch override
if workflow_dispatch:
  Use input.scope parameter
  (all, js-only, md-only)
```

**Outputs:**

- run-js: true/false
- run-md: true/false

---

### JavaScript/TypeScript Linting

**Job:** `lint-js`  
**Triggers:** Conditional (RUN_JS=true)  
**Status:** ✅ Implemented (T050)

Runs ESLint validation against JavaScript and TypeScript files with detailed error reporting.

**Execution:**

1. **Setup (per run):**
   - Checkout code
   - Setup Node.js from `.nvmrc`
   - Cache npm dependencies
   - Install with npm ci

2. **Linting Execution:**

   ```bash
   npm run lint:js -- --format json --output-file linting-results/eslint-report.json
   ```

3. **Result Validation:**
   - Parse ESLint JSON report
   - Extract error and warning counts
   - Report findings to PR comment
   - Fail if errors detected

4. **PR Reporting:**
   - Auto-generated comment with file/line references
   - Remediation suggestion: `npm run lint:js`
   - Severity indication (error vs warning)

5. **Artifact Upload:**
   - Upload ESLint report to artifacts
   - Name: linting-js-results
   - Retention: 7 days

**Configuration Files:**

- `.eslintrc.js` — ESLint rules and settings
- Patterns: `**/*.{js,jsx,ts,tsx}`
- Excludes: node_modules, dist, build, coverage

**Expected Runtime:** 30-45 seconds  
**GitHub Actions Minutes:** ~0.06-0.08 per run

**Failure Remediation:**

If ESLint detects errors:

1. **Review PR comment** with specific file and line references
2. **Auto-fix locally:**

   ```bash
   npm run lint:js
   ```

3. **Verify fixes:**

   ```bash
   npm run lint:js -- --format stylish
   ```

4. **Commit and push** updated code

---

### Markdown Linting

**Job:** `lint-md`  
**Triggers:** Conditional (RUN_MD=true)  
**Status:** ✅ Implemented (T051)

Runs markdownlint validation against Markdown files for style and consistency.

**Execution:**

1. **Setup:**
   - Checkout code
   - Setup Node.js from `.nvmrc`
   - Cache npm dependencies
   - Install with npm ci

2. **Linting Execution:**

   ```bash
   npm run lint:md -- '**/*.{md,mdx}' '!node_modules'
   ```

3. **Result Validation:**
   - Parse markdownlint log output
   - Detect "Error:" patterns
   - Report findings to PR comment
   - Fail if errors detected

4. **PR Reporting:**
   - Auto-generated comment with issues excerpt
   - Remediation suggestion: `npm run lint:md:fix`
   - First 2000 characters of output

5. **Artifact Upload:**
   - Upload markdownlint log to artifacts
   - Name: linting-md-results
   - Retention: 7 days

**Configuration Files:**

- `.markdownlintrc` — Markdown linting rules
- Patterns: `**/*.{md,mdx}`
- Excludes: node_modules

**Expected Runtime:** 10-15 seconds  
**GitHub Actions Minutes:** ~0.02-0.03 per run

**Failure Remediation:**

If markdownlint detects issues:

1. **Review PR comment** with specific issues
2. **Auto-fix locally:**

   ```bash
   npm run lint:md:fix
   ```

3. **Verify fixes:**

   ```bash
   npm run lint:md
   ```

4. **Commit and push** updated documentation

---

### Linting Metrics

**Job:** `linting-metrics`  
**Triggers:** After lint-js and lint-md (always runs)  
**Status:** ✅ Implemented

Aggregates linting results and collects performance metrics.

**Composite Actions Integration:**

1. **collect-metrics:**
   - Inputs: workflow_name, metric_type
   - Outputs: minutes_used, duration_seconds, metrics_json
   - Tracks GitHub Actions minute consumption

2. **validate-check:**
   - Reports final validation status as GitHub check
   - Posts summary comment on PR (if configured)
   - Combines JS and Markdown results

**Metrics Reported:**

- Total workflow minutes consumed
- Individual job durations
- Success/failure status per linter
- Timestamp of execution

---

### Linting Summary

**Job:** `linting-summary`  
**Triggers:** Final job (depends on all linting jobs)  
**Status:** ✅ Implemented

Generates comprehensive linting run summary and enforces pass/fail criteria.

**Summary Includes:**

- JavaScript/TypeScript linting result
- Markdown linting result
- Metrics collection status

**Failure Criteria:**

- ❌ Workflow fails if: lint-js = failure OR lint-md = failure
- ℹ️ Metrics collection failures don't block

**Success Message:**

```
Linting workflow completed
JavaScript/TypeScript linting: success
Markdown linting: success
Metrics collection: success

✅ Linting workflow completed
```

---

## Manual Trigger (workflow_dispatch)

### Scope Selection

The workflow supports manual triggering with scope selection:

```
Inputs:
  scope: [all | js-only | md-only]
  default: all
```

**Examples:**

```bash
# Run all linting
gh workflow run linting-unified.yml -f scope=all

# ESLint only
gh workflow run linting-unified.yml -f scope=js-only

# Markdownlint only
gh workflow run linting-unified.yml -f scope=md-only
```

---

## Configuration Files

### ESLint Configuration (.eslintrc.js)

```javascript
// ESLint configuration for JavaScript/TypeScript
// - Parser: espree (built-in)
// - Environment: browser, node, es2021
// - Rules: project-specific standards
```

**Patterns Checked:**

- `**/*.js` — JavaScript files
- `**/*.jsx` — React components
- `**/*.ts` — TypeScript files
- `**/*.tsx` — TypeScript React components

**Exclusions:**

- node_modules/
- dist/
- build/
- coverage/

### Markdown Lint Configuration (.markdownlintrc)

```yaml
# Markdown linting rules
# - Enforces consistent formatting
# - Validates frontmatter
# - Checks for proper heading hierarchy
# - Enforces line length limits (80-100 chars)
```

**Patterns Checked:**

- `**/*.md` — Markdown files
- `**/*.mdx` — MDX files (Markdown + JSX)

**Exclusions:**

- node_modules/

---

## Performance Metrics

### Expected Runtimes

| Component | Duration | Minutes |
|-----------|----------|---------|
| Lint context setup | ~5 sec | 0.01 min |
| ESLint (JS/TS) | 30-45 sec | 0.06-0.08 min |
| Markdownlint | 10-15 sec | 0.02-0.03 min |
| Metrics collection | ~5 sec | 0.01 min |
| Total (parallel) | ~45 sec | ~0.13 min |

### Monthly Budget: TBD

**Estimated breakdown:**

- PR runs (50/month @ 0.1 min): 5 min
- Push runs (30/month @ 0.13 min): 4 min
- Manual runs (10/month @ 0.15 min): 1.5 min
- **Total estimated:** ~10.5 min/month

---

## Troubleshooting Guide

### ESLint detects errors

**Symptom:** "❌ ESLint found errors"

**Causes:**

1. JavaScript/TypeScript syntax errors
2. Code style violations against project rules
3. Undefined variables or unused imports
4. Type errors in TypeScript

**Solution:**

1. Review PR comment with specific files and line numbers
2. Auto-fix issues: `npm run lint:js`
3. Manual fixes for errors that can't be auto-fixed
4. Commit and push updated code

---

### Markdownlint detects issues

**Symptom:** "❌ markdownlint found issues"

**Causes:**

1. Inconsistent heading hierarchy
2. Line too long (exceeds configured limit)
3. Missing/incorrect frontmatter
4. Improper list formatting

**Solution:**

1. Review PR comment with specific issues
2. Auto-fix issues: `npm run lint:md:fix`
3. Verify fixes: `npm run lint:md`
4. Commit and push updated documentation

---

### Workflow takes longer than expected

**Symptom:** Linting workflow runtime >1 minute

**Causes:**

1. Large repository with many files
2. ESLint with auto-fix making multiple passes
3. Markdownlint processing many Markdown files
4. Slow npm dependency installation (cache miss)

**Solution:**

1. Check if npm cache hit in job logs
2. Verify file patterns are correct (not too broad)
3. Run locally to benchmark: `time npm run lint`
4. Consider splitting into more granular jobs if needed

---

## Configuration Best Practices

### ESLint

- Use shared ESLint config where possible
- Keep .eslintrc.js minimal (reference shared config)
- Use `.eslintignore` for additional exclusions
- Run locally before pushing: `npm run lint:js`

### Markdown

- Keep .markdownlintrc rules consistent across all projects
- Use frontmatter consistently in all documentation
- Verify links in documentation (consider validation step)
- Use consistent heading levels (no jumps from h1 to h3)

---

## Related Documentation

- [Branch Naming Strategy](./BRANCHING_STRATEGY.md)
- [Coding Standards](./CODING_STANDARDS.md)
- [Composite Actions Reference](./COMPOSITE_ACTIONS.md)
- [Workflow Consolidation Mapping](./WORKFLOW_CONSOLIDATION_MAPPING.md)
- [Performance Targets](./PERFORMANCE_TARGETS.md)

---

## Archive Reference

**Consolidated workflows:**

- linting.yml (generic lint runner)
- (2 total linting workflows consolidated into 1 unified workflow)

**Archive location:** `.github/workflows/archived/2026-09-11/validation/`

---

*Last updated: 2026-09-17 | Phase 5 Implementation | Status: Linting jobs implemented with metrics collection*

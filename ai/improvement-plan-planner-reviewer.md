---
file_type: "documentation"
title: "Improvement Plan: Planner & Reviewer Agents"
description: "Structured roadmap with prioritized issues, acceptance criteria, and implementation guidelines"
version: "v1.0"
last_updated: '2026-06-01'
author: "Claude Code"
owners: ["lightspeedwp/maintainers"]
tags: ["improvement-plan", "agents", "roadmap", "implementation"]
---

# Improvement Plan: Planner & Reviewer Agents

## Overview

This document outlines a structured, autonomous improvement workflow:

1. **Phase 1 (Critical)**: Fix correctness, safety, and test infrastructure
2. **Phase 2 (Medium)**: Implement core features and enhancements
3. **Phase 3 (Low)**: Polish, observability, and documentation

Each issue below includes:

- **Title & Description**: What needs to be done
- **Acceptance Criteria**: How to know it's complete
- **Test Plan**: How to verify the fix
- **Dependencies**: What must be done first
- **Estimated Effort**: T-shirt sizing

---

## Phase 1: Correctness & Safety (Blocking)

### Issue 1.1: Fix Module System Inconsistency

**Problem**: Planner uses CommonJS, Reviewer uses ES6 modules. Repository configured with `"type": "module"`, so both should use ES6.

**Acceptance Criteria**:

- [ ] Both `planner.agent.js` and `reviewer.agent.js` use ES6 modules
- [ ] `package.json` is confirmed as `"type": "module"` (current state)
- [ ] All imports/exports are consistent across both files
- [ ] No mixed module syntax (no both `require()` and `import` in same file)
- [ ] `__dirname` and `__filename` replaced with `import.meta.url` utilities

**Implementation**:

- [ ] Check current `package.json` `"type"` field (confirmed as `"module"`)
- [ ] Convert planner.agent.js from CommonJS to ES6 modules:
  - Change `const path = require("path")` → `import path from "path"`
  - Change `const __filename = __filename || process.argv[1]` → use `import.meta.url`
  - Change `const __dirname = __dirname || path.dirname(__filename)` → derive from `import.meta.url`
  - Import `fileURLToPath` from `url` module to convert `import.meta.url` to file path
  - Change `module.exports = { runPlanner }` → `export { runPlanner }`
  - Update ES6 module check condition for main module execution
- [ ] Update workflow scripts to use consistent invocation pattern

**Test Plan**:

```bash
# Verify module syntax
node -c scripts/agents/planner.agent.js
node -c scripts/agents/reviewer.agent.js

# Attempt to load modules
node -e "const { run } = require('./scripts/agents/planner.agent.js'); console.log(typeof run)"
node -e "const { run } = require('./scripts/agents/reviewer.agent.js'); console.log(typeof run)"
```

**Estimated Effort**: S (Small - 1-2 hours)

---

### Issue 1.2: Implement Dry-Run Mode for Reviewer Agent

**Problem**: Reviewer agent always posts comments; no way to test safely in production.

**Acceptance Criteria**:

- [ ] Reviewer accepts `--dry-run` flag or environment variable
- [ ] In dry-run mode: logs comment that would be posted but doesn't create it
- [ ] Workflow accepts `dry-run` input parameter (default: `false`)
- [ ] Comment clearly indicates dry-run status

**Implementation**:

1. [ ] Add dry-run flag parsing to reviewer.agent.js:

   ```javascript
   const dryRun = process.argv.includes("--dry-run") || process.env.DRY_RUN === "true";
   ```

2. [ ] Before posting comment (line 84), check dry-run:

   ```javascript
   if (dryRun) {
     core.info("DRY-RUN: Would post comment: " + summary);
   } else {
     await octokit.rest.issues.createComment({...});
   }
   ```

3. [ ] Update workflow to accept input and pass to script

**Test Plan**:

```bash
# Test dry-run mode
DRY_RUN=true node scripts/agents/reviewer.agent.js
# Should log comment but not create it

# Test normal mode
node scripts/agents/reviewer.agent.js
# Should create comment
```

**Estimated Effort**: XS (Extra Small - 30 mins)

---

### Issue 1.3: Add Comprehensive Error Handling to Both Agents

**Problem**: Silent failures; missing API error handling; no graceful degradation.

**Acceptance Criteria**:

- [ ] All API calls wrapped in try-catch
- [ ] Network errors logged with context
- [ ] Missing tokens detected early and reported
- [ ] Agents exit with code 1 on fatal errors
- [ ] Non-fatal errors logged but workflow continues (where appropriate)

**Implementation**:

**Planner**:

1. [ ] Wrap GitHub API calls in try-catch
2. [ ] Add token validation at start
3. [ ] Return structured error object on failure

**Reviewer**:

1. [ ] Catch error in getCombinedStatusForRef() and log properly (not just "Could not fetch")
2. [ ] Catch error in listFiles() and report which PR failed
3. [ ] Catch error in createComment() and notify via core.setFailed()
4. [ ] Add early token validation

**Test Plan**:

```bash
# Test missing token
GITHUB_TOKEN="" node scripts/agents/reviewer.agent.js
# Should fail with clear error message

# Test invalid PR context
node scripts/agents/reviewer.agent.js --no-pr
# Should log and exit gracefully
```

**Estimated Effort**: S (Small - 1-2 hours)

---

### Issue 1.4: Move Tests Out of `.jest-skip/` and Add Missing Coverage

**Problem**: Tests disabled; gaps in coverage; critical branches untested.

**Acceptance Criteria**:

- [ ] Reviewer test files moved from `.jest-skip/` to proper location
- [ ] Planner tests rewritten to test stub behavior before moving (see note below)
- [ ] Tests pass in CI
- [ ] Coverage ≥ 80% for reviewer agent
- [ ] All error branches tested (missing token, API failure, etc.)
- [ ] Blocker detection tested thoroughly

**Important Note**: Planner tests currently expect `run()` export and comment posting (Issue 2.1 functionality). Convert planner test to use `runPlanner()` export and test the current stub behavior (logging context, dry-run mode) instead.

**Implementation**:

**Planner Tests**:

1. [ ] Rewrite `.jest-skip/planner.agent.test.js` to test current stub:
   - [ ] Change import from `{ run }` to `{ runPlanner }`
   - [ ] Test logs context (event, repo root)
   - [ ] Test dry-run mode (accepts `{ dryRun: false }` option)
   - [ ] Test exits without errors
   - [ ] Test missing token handling
2. [ ] Move rewritten test to `scripts/agents/__tests__/planner.agent.test.js`

**Reviewer Tests**:

1. [ ] Move `.jest-skip/reviewer.agent.test.js` → `scripts/agents/__tests__/reviewer.agent.test.js`
2. [ ] Add tests for:
   - [ ] Missing GITHUB_TOKEN
   - [ ] CI failure state (state !== "success")
   - [ ] No changed files
   - [ ] Changelog detection (case-insensitive, multiple names)
   - [ ] Blocker detection (CI + changelog)
   - [ ] Dry-run mode
   - [ ] Comment posting success
   - [ ] Comment posting failure

**Test Plan**:

```bash
npm test -- scripts/agents/__tests__/planner.agent.test.js
npm test -- scripts/agents/__tests__/reviewer.agent.test.js

# Check coverage
npm test -- --coverage scripts/agents
```

**Dependencies**: Issue 1.2 (dry-run), Issue 1.3 (error handling)

**Estimated Effort**: M (Medium - 2-3 hours)

---

## Phase 2: Feature Completeness

### Issue 2.1: Implement Planner Agent Core Functionality

**Problem**: Planner is a stub; needs core implementation (context analysis, plan generation, checklist posting).

**Acceptance Criteria**:

- [ ] Agent accepts structured input (issue/PR number, type of plan needed)
- [ ] Analyzes PR/issue context (title, description, labels, linked issues)
- [ ] Generates structured plan (checklist format)
- [ ] Posts plan as comment on PR/issue
- [ ] Workflow re-enabled with feature flag

**Implementation**:

1. [ ] Define module interface:

   ```javascript
   async function run(context = github.context, options = {})
   ```

2. [ ] Implement context analysis:
   - [ ] Parse PR/issue body
   - [ ] Extract linked issues (#123 references)
   - [ ] Identify labels (epic, feature, bug, etc.)
   - [ ] Determine plan type (architecture, implementation, task)

3. [ ] Implement plan generation:
   - [ ] Create checklist based on plan type
   - [ ] Architecture plan: Design review → API contract → Data model → Implementation
   - [ ] Implementation plan: Setup → Core logic → Tests → Docs → Review
   - [ ] Task plan: Analysis → Research → Implementation → Verification

4. [ ] Implement comment posting:
   - [ ] Format plan as structured markdown
   - [ ] Post to PR/issue
   - [ ] Return comment URL

**Test Plan**:

```bash
npm test -- scripts/agents/__tests__/planner.agent.test.js

# Manual test
node scripts/agents/planner.agent.js --apply --pr 123
# Should post plan to PR
```

**Dependencies**: Issue 1.3 (error handling), Issue 1.4 (tests)

**Estimated Effort**: L (Large - 4-6 hours)

---

### Issue 2.2: Enhance Reviewer File Analysis

**Problem**: Only detects src/ and code files; misses high-risk changes (config, workflows, security).

**Acceptance Criteria**:

- [ ] Categorizes files by risk level (critical, high, medium, low)
- [ ] Flags high-risk categories:
  - [ ] Configuration: `.github/`, `package*.json`, `composer.json`, `.env*`, `config/`
  - [ ] Workflows: `.github/workflows/*`
  - [ ] Security: `SECURITY.md`, `LICENSE`, security-related code changes
  - [ ] Database: migrations, schema files
  - [ ] Locks: `package-lock.json`, `composer.lock` (major version changes)
- [ ] Reports summary: "X high-risk, Y medium-risk, Z low-risk files"

**Implementation**:

1. [ ] Add file categorizer function:

   ```javascript
   function categorizeFile(filename) {
     // Returns: { category, riskLevel }
   }
   ```

2. [ ] Add risk level detection:
   - CRITICAL: .github/workflows, secrets, API keys
   - HIGH: package.json, lock files (major changes), migrations
   - MEDIUM: src/, tests, docs
   - LOW: examples/, comments

3. [ ] Update summary comment to include category breakdown

**Test Plan**:

```bash
npm test -- scripts/agents/__tests__/reviewer.agent.test.js

# Test cases:
# - Files: [src/index.js, package.json, .github/workflows/test.yml]
# - Should report: 1 high-risk (workflows), 1 high-risk (config)
```

**Estimated Effort**: S (Small - 1-2 hours)

---

### Issue 2.3: Fix Changelog Detection

**Problem**: Fragile detection; only looks for lowercase `changelog.md`.

**Acceptance Criteria**:

- [ ] Case-insensitive detection
- [ ] Supports multiple names: CHANGELOG.md, CHANGELOG.txt, HISTORY.md, NEWS.md, RELEASES.md
- [ ] Detects in root or `/docs` directory
- [ ] Returns boolean consistently

**Implementation**:

```javascript
function hasChangelogEntry(filenames) {
  const changelogNames = [
    'changelog.md', 'changelog.txt', 'history.md', 'news.md', 'releases.md'
  ];
  return filenames.some(f =>
    changelogNames.includes(f.toLowerCase().split('/').pop())
  );
}
```

Note: `filenames` is an array of strings (from the GitHub API's `changed` array), not file objects.

**Test Plan**:

```bash
# Test cases
const files = [
  'CHANGELOG.md',      // ✅ should match
  'docs/CHANGELOG.txt', // ✅ should match
  'history.MD',        // ✅ should match (case-insensitive)
  'NEWS.md',          // ✅ should match
  'src/CHANGELOG.js', // ❌ should NOT match (wrong context)
];
```

**Estimated Effort**: XS (Extra Small - 30 mins)

---

### Issue 2.4: Add Blocker Detection & Recommendations

**Problem**: Only checks CI + changelog; misses breaking changes, security issues, incomplete changes.

**Acceptance Criteria**:

- [ ] Detects breaking changes (major version bump, API changes)
- [ ] Flags security-sensitive file modifications
- [ ] Warns on large deletions (>500 lines removed)
- [ ] Detects database migrations without rollback plan
- [ ] Reports blockers clearly in summary

**Implementation**:

```javascript
function detectBlockers(files, stats, state, requireChangelog) {
  const blockers = [];

  // CI blocker
  if (state !== "success") blockers.push("CI checks not green");

  // Changelog blocker
  if (requireChangelog && hasCodeChange(files) && !hasChangelogEntry(files)) {
    blockers.push("CHANGELOG.md missing");
  }

  // Security blocker
  if (hasSecurityFileChange(files)) {
    blockers.push("⚠️ Security-sensitive files modified (review carefully)");
  }

  // Large deletion blocker
  if (stats.deletions > 500) {
    blockers.push("⚠️ Large deletion detected (>500 lines)");
  }

  return blockers;
}
```

**Test Plan**:

```bash
# Test various scenarios
npm test -- --testNamePattern="blocker detection"
```

**Dependencies**: Issue 2.2 (file analysis)

**Estimated Effort**: S (Small - 1-2 hours)

---

### Issue 2.5: Implement Comment Deduplication

**Problem**: Posts new comment on every sync; accumulates clutter in long review threads.

**Acceptance Criteria**:

- [ ] Checks for existing reviewer comment (by bot name/marker)
- [ ] Updates existing comment instead of creating new one
- [ ] Marks comment with unique identifier to find it later
- [ ] Preserves edit history

**Implementation**:

1. [ ] Add marker to reviewer comment:

   ```markdown
   <!-- reviewer-agent-summary -->
   ```

2. [ ] Search for existing comment:

   ```javascript
   const existingComment = prComments.find(c =>
     c.body.includes('<!-- reviewer-agent-summary -->')
   );
   ```

3. [ ] Update instead of create:

   ```javascript
   if (existingComment) {
     await octokit.rest.issues.updateComment({
       comment_id: existingComment.id,
       body: summary
     });
   } else {
     await octokit.rest.issues.createComment({...});
   }
   ```

**Test Plan**:

```bash
npm test -- --testNamePattern="comment deduplication"

# Should:
# - Post comment on first run
# - Update (not recreate) on second run
# - Preserve previous content
```

**Estimated Effort**: S (Small - 1-2 hours)

---

## Phase 3: Polish & Operations

### Issue 3.1: Add Structured Logging & Observability

**Problem**: Minimal logging; hard to debug; no metrics for monitoring.

**Acceptance Criteria**:

- [ ] Structured JSON logging (not just console.log)
- [ ] Metrics: execution time, items processed, errors
- [ ] Configurable log level (info, debug, error)
- [ ] Machine-parseable error messages

**Implementation**:

- [ ] Create logging utility: `scripts/utils/logger.js`
- [ ] Use in both agents
- [ ] Output JSON to stdout, errors to stderr

**Estimated Effort**: M (Medium - 2-3 hours)

---

### Issue 3.2: Write Documentation & Runbooks

**Problem**: No operational documentation; unclear how to deploy, debug, or troubleshoot.

**Acceptance Criteria**:

- [ ] Deployment checklist (when to enable planner, rollout steps)
- [ ] Debugging guide (what to check when agent fails)
- [ ] Configuration reference (all available inputs/env vars)
- [ ] Troubleshooting FAQ

**Implementation**:

- [ ] Create `docs/agents/PLANNER-RUNBOOK.md`
- [ ] Create `docs/agents/REVIEWER-RUNBOOK.md`

**Estimated Effort**: M (Medium - 2-3 hours)

---

## Autonomous Workflow

To work through these issues autonomously:

### Step 1: Create Issues in GitHub

```bash
# See next section for GitHub issue creation
```

### Step 2: For Each Issue (in order)

1. Check out a feature branch: `git checkout -b fix/issue-title`
2. Read the issue description and acceptance criteria
3. Implement changes
4. Write tests (Issue 1.4+ require tests)
5. Verify tests pass: `npm test`
6. Commit with clear message referencing issue
7. Create PR for review
8. Address feedback and merge when approved

### Step 3: Verify Completion

- [ ] All acceptance criteria met
- [ ] Tests pass (coverage ≥ 80%)
- [ ] No linting errors
- [ ] Documentation updated
- [ ] PR merged to develop

---

## Timeline & Sequencing

**Phase 1 (Critical - Must Complete First)**:

- Issue 1.1: Module consistency (blocks everything)
- Issue 1.3: Error handling (needed for stability)
- Issue 1.2: Dry-run mode (needed for safety)
- Issue 1.4: Tests (enables CI validation)

**Phase 2 (Medium Priority - After Phase 1)**:

- Issue 2.1: Planner implementation
- Issue 2.2: File analysis
- Issue 2.3: Changelog detection
- Issue 2.4: Blocker detection
- Issue 2.5: Comment deduplication

**Phase 3 (Polish - Last)**:

- Issue 3.1: Observability
- Issue 3.2: Documentation

**Estimated Total Effort**: 20-25 hours (T-shirt: Medium-Large)

---

## Success Metrics

- [ ] All Phase 1 issues resolved
- [ ] All tests passing (coverage ≥ 80%)
- [ ] No linting or formatting errors
- [ ] Both agents enable in workflows (not disabled)
- [ ] CI/CD pipeline validates on every PR
- [ ] Operators can debug issues using runbooks
- [ ] Code review feedback loops are fast (<5 mins with bot feedback)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

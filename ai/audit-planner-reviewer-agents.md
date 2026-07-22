---
file_type: "documentation"
title: "Audit Prompt: Planner & Reviewer Agents"
description: "Comprehensive audit framework for assessing completeness, correctness, and quality of planner and reviewer agents"
version: "v1.0"
last_updated: '2026-06-01'
author: "Claude Code"
owners: ["lightspeedwp/maintainers"]
tags: ["audit", "agents", "quality", "diagnostic"]
---

# Audit Prompt: Planner & Reviewer Agents

## Executive Summary

This prompt audits the **Task Planner Agent** and **Reviewer Agent** across five dimensions: **specification completeness**, **implementation correctness**, **test coverage**, **workflow integration**, and **operational readiness**. Each section contains diagnostic questions that reveal gaps, inconsistencies, and improvement opportunities.

## Part 1: Specification Audit

### 1.1 Planner Agent Specification (`agents/task-planner.agent.md`)

#### Questions

1. **Declared Tools vs. Implementation Gap**
   - The spec lists 36 tools (file_system, markdown_generator, adr_naming_helper, etc.)
   - Does the implementation (`scripts/agents/planner.agent.js`) import or reference ANY of these tools?
   - Are these tool names even resolvable or do they represent aspirational architecture?

2. **Responsibilities Mismatch**
   - The spec claims: "strategic architecture planning, implementation plan generation, and task planning with research validation"
   - The implementation is a 46-line dry-run stub that logs context and exits
   - What specific outputs (plans, checklists, diagrams, decision records) should the agent produce?

3. **Trigger Conditions**
   - What GitHub events should activate the planner? (currently: `push` to develop, `pull_request` to develop)
   - Should it run on issue creation, issue comments, or PR descriptions that contain planning keywords?
   - How does the planner know WHEN to activate vs. when a human is already planning?

4. **Guardrails Validation**
   - Guardrail states: "Think first, code later. Default to read-only analysis. Never skip research validation."
   - Does the implementation enforce these? Can you trace them in the code?

5. **Dependencies & Sequencing**
   - Does the planner depend on any other agents (e.g., testing, linting, review)?
   - Should the reviewer wait for the planner to finish, or vice versa?

### 1.2 Reviewer Agent Specification (`agents/reviewer.agent.md`)

#### Questions

1. **Responsibilities Completeness**
   - Lists: CI Status Monitoring, File Analysis, Changelog Validation, Review Summary, Quality Gates
   - Missing: Security scanning, test coverage analysis, performance impact, documentation completeness checks?
   - Should the reviewer recommend specific actions (e.g., "add tests for X", "refactor Y") or just flag issues?

2. **Review Summary Format**
   - The spec shows a template with sections: CI/CD Status, Changed Files, Changelog, Recommendations
   - Does the implementation match this structure exactly?
   - Are there missing sections like Linked Issues, Risk Assessment, Merge Readiness Checklist?

3. **File Analysis Depth**
   - Spec says "identify potential issues" and "flag high-risk changes"
   - Implementation only checks file extensions and paths (src/, code file patterns)
   - What constitutes a "high-risk change"? (e.g., modified .github/ files, lock file changes, API changes, DB migrations?)

4. **Changelog Validation Logic**
   - Only checks for `CHANGELOG.md` presence if code files were touched
   - Missing: Should it validate changelog format, verify entry is semantically correct, or check against existing entries?

5. **Error Handling Gaps**
   - Spec says "gracefully handles missing PR context" and "reports API errors without failing"
   - Does the implementation catch all possible API call failures (listFiles, getCombinedStatus)?
   - What happens if token is invalid, repo is archived, or PR is in draft state?

---

## Part 2: Implementation Audit

### 2.1 Planner Agent Implementation (`scripts/agents/planner.agent.js`)

#### Questions

1. **Feature Completeness**
   - Line 29: TODO comment says "Implement planner automation (context analysis, sequencing, scheduling)"
   - What does "context analysis" entail? (PR body parsing? Linked issues? Codebase scan?)
   - What does "sequencing" mean? (Order sub-tasks? Schedule across sprints?)
   - Should the planner generate a Markdown checklist, create a GitHub Project board, or both?

2. **Module Signature**
   - Does `runPlanner()` accept proper parameters? (Currently only `{ dryRun }`)
   - Should it accept: `{ owner, repo, context, issueNumber, prNumber }`?
   - Should it return a result object? (e.g., `{ plan, checklist, issues, errors }`)

3. **Logging & Observability**
   - Current logging is minimal (just `log()` function)
   - Missing: structured JSON logging? Metrics (duration, items processed)?

4. **No Tests**
   - Test file exists (`.jest-skip/planner.agent.test.js`) but is in `.jest-skip` (disabled)
   - Even the test file is incomplete (line 25: "Add more tests for dry-run, exit criteria, etc.")

### 2.2 Reviewer Agent Implementation (`scripts/agents/reviewer.agent.js`)

#### Questions

1. **Module System Mismatch**
   - Uses ES6 `import/export` syntax (lines 22–103)
   - Planner uses CommonJS `require/module.exports`
   - Package.json has `"type": "module"` or `"type": "commonjs"`? (Need to verify)
   - Should both agents use the same module system for consistency?

2. **CI Status Check**
   - Queries `getCombinedStatusForRef()` but silently fails on error (line 54: "Could not fetch CI status")
   - Sets `state = "unknown"` but then later checks `if (state !== "success")` (line 71)
   - What happens if the API call throws? Should it retry, log, or escalate?

3. **File Analysis Limitation**
   - Line 64–65: Only checks for `src/` or code file extensions
   - Misses files like `package.json`, `.github/workflows`, `docs/`, tests
   - Should the analysis be more sophisticated? (e.g., high-risk categories: config, workflow, security, database)

4. **Changelog Detection Fragility**
   - Line 68: Looks for exact match `"changelog.md"` (lowercase)
   - Doesn't handle: `CHANGELOG`, `CHANGELOG.txt`, `HISTORY.md`, `NEWS.md`
   - Should be case-insensitive and support multiple changelog names?

5. **Blocker Detection Logic**
   - Lines 70–73: Only two blockers checked
   - Missing checks:
     - Breaking changes (semver bump required?)
     - Security-sensitive files modified
     - Large deletions (>500 lines deleted?)
     - Database migrations without rollback plan?

6. **Comment Posting**
   - Always creates a comment (lines 84–89)
   - Should it update an existing reviewer comment if one exists, to avoid clutter?
   - No deduplication check

7. **Missing Dry-Run Mode**
   - Spec mentions "dry-run mode for testing" (line 118 of spec)
   - Implementation always posts comment in real mode; no `--dry-run` flag handling

8. **Test Coverage**
   - Test file exists but has major gaps:
     - Line 4 TODO: "Add tests for error branches (missing token, failing CI, no changed files)"
     - No test for blocker detection logic
     - No test for changelog validation with different filenames
     - No test for CI failure state

---

## Part 3: Workflow Integration Audit

### 3.1 Planner Workflow (`.github/workflows/planner.yml`)

#### Questions

1. **Disabled State**
   - Line 19: `if: false` means workflow never runs
   - Should this be conditionally enabled when implementation is complete?
   - Who owns re-enabling it? What's the acceptance criteria?

2. **Missing Inputs**
   - Workflow accepts no inputs
   - Should it accept: `plan-type` (architecture, implementation, task)? `dry-run`?

3. **No Error Handling**
   - Step just runs `node scripts/agents/planner.agent.js`
   - No `continue-on-error` or error notification
   - Should it post a comment on PR/issue if it fails?

### 3.2 Reviewer Workflow (`.github/workflows/reviewer.yml`)

#### Questions

1. **CodeRabbit Gate Complexity**
   - Lines 19–54: Complex polling for CodeRabbit success (20 attempts, 15s delay each = 5min max wait)
   - Is this necessary? Should it be configurable?
   - What if CodeRabbit fails? Does the reviewer job skip or fail?

2. **Concurrency Logic**
   - Line 15: Uses concurrency group with `cancel-in-progress: true`
   - Does this mean only the latest PR review runs? What about multi-PR scenarios?

3. **Missing Outputs**
   - Workflow completes silently; no status badge or summary posted to PR
   - Should it post a "Reviewer Ready ✅" comment on success?

4. **Node.js Version**
   - Line 24: `node-version: "20"`
   - Is this the minimum required version? Should it be "21" or "lts"?

---

## Part 4: Test Coverage Audit

### 4.1 Planner Agent Tests

#### Questions

1. **Test File Location**
   - Placed in `.jest-skip/` directory (disabled)
   - Why disabled? Incomplete implementation or failing tests?

2. **Test Coverage**
   - Only 1 test: "posts a checklist comment on PR"
   - Missing:
     - Dry-run mode (test exists but references non-existent helper `expectDryRun`)
     - Exit criteria (what conditions cause early exit?)
     - Error handling (missing token, network error)
     - Planning logic (context analysis, sequencing)

3. **Mock Fidelity**
   - Uses mocks from `tests/test-helpers` (e.g., `mockOctokit`, `mockContext`)
   - Do these mocks support all needed GitHub API calls?

### 4.2 Reviewer Agent Tests

#### Questions

1. **Test File State**
   - Also in `.jest-skip/` but has more tests than planner
   - Line 4 TODO: "Add tests for error branches"

2. **Test Gaps**
   - ✅ Test 1: Posts summary comment (basic happy path)
   - ✅ Test 2: Dry-run logic (but implementation doesn't support dry-run!)
   - ❌ Missing: CI failure state, no changed files, missing token
   - ❌ Missing: Blocker detection (changelog, CI state)
   - ❌ Missing: File analysis (high-risk changes)
   - ❌ Missing: Comment deduplication

3. **Test Helper Issues**
   - Line 42: Calls `expectCommentPosted()` helper
   - Line 47: Calls `expectDryRun()` helper
   - Do these helpers exist in `tests/test-helpers`? Are they complete?

---

## Part 5: Operational Readiness Audit

### 5.1 Documentation Gaps

#### Questions

1. **Runbook Missing**
   - How do operators know to re-enable the planner when ready?
   - What's the deployment checklist for reviewer improvements?

2. **Configuration Options**
   - Reviewer accepts `require-changelog` input but docs are minimal
   - Should there be: `require-tests`, `require-docs`, `blocklist-paths`?

3. **Debugging Guide**
   - If reviewer doesn't post a comment, how to debug?
   - If planner fails, where to check logs?

### 5.2 Backward Compatibility & Consistency

#### Questions

1. **CommonJS vs. ES6 Modules**
   - Planner uses CommonJS (`require`, `module.exports`)
   - Reviewer uses ES6 (`import`, `export`)
   - Inconsistent; should standardize on one approach

2. **Error Reporting**
   - Planner logs to stdout
   - Reviewer uses `@actions/core` (setFailed, info)
   - Should both use the same logging strategy?

3. **GitHub Actions Integration**
   - Planner only receives `GITHUB_TOKEN` env var
   - Reviewer uses `core.getInput()` from `@actions/core`
   - Both workflows should provide inputs consistently

---

## Part 6: Gaps & Holes Summary

### Critical Gaps (Blocking Readiness)

| Category | Gap | Impact |
|----------|-----|--------|
| **Planner** | Zero functional implementation | Agent is completely non-operational |
| **Planner** | Disabled in workflow | Cannot be tested or used |
| **Reviewer** | Module system inconsistency (ES6 vs CommonJS) | Maintenance complexity, inconsistent dev experience |
| **Reviewer** | No dry-run support | Cannot test safely before production |
| **Both** | Test files disabled (`.jest-skip/`) | No CI validation |
| **Both** | Missing error handling | Silent failures possible |

### Medium Gaps (Quality Issues)

| Category | Gap | Impact |
|----------|-----|--------|
| **Planner** | No module interface defined | Unclear how to invoke from workflows or other agents |
| **Reviewer** | Fragile changelog detection | False negatives/positives on validation |
| **Reviewer** | Limited file analysis | Misses high-risk changes |
| **Reviewer** | Comment deduplication missing | Clutter and confusion for reviewers |
| **Both** | Inconsistent logging/observability | Hard to debug issues |

### Low Gaps (Polish Issues)

| Category | Gap | Impact |
|----------|-----|--------|
| **Planner** | Spec lists 36 aspirational tools (not implemented) | Misleading spec; maintenance burden |
| **Reviewer** | No structured JSON logging | Cannot feed into metrics pipelines |
| **Both** | No runbooks or debugging guides | Support burden increases |

---

## Part 7: Recommended Improvements (Priority Order)

### Phase 1: Correctness & Safety (High Priority)

1. **Fix Module System Inconsistency**
   - Standardize both agents to CommonJS or ES6 Modules
   - Verify package.json `"type"` field

2. **Implement Dry-Run Mode for Reviewer**
   - Add `--dry-run` flag to skip comment posting
   - Update workflow to support `dry-run` input

3. **Add Error Handling to Both Agents**
   - Wrap API calls in try-catch
   - Log errors and exit gracefully
   - Return error status codes

4. **Enable & Stabilize Tests**
   - Move tests out of `.jest-skip/`
   - Add missing test cases (error branches, edge cases)
   - Ensure 80%+ coverage

### Phase 2: Feature Completeness (Medium Priority)

1. **Planner Implementation**
   - Define module interface (inputs, outputs)
   - Implement context analysis (parse PR body, linked issues)
   - Add checklist generation and posting

2. **Reviewer Enhancements**
   - Improve file analysis (high-risk categories, security files)
   - Fix changelog detection (case-insensitive, multiple names)
   - Add blocker detection (semver, security, DB migrations)
   - Implement comment deduplication/updates

3. **Workflow Updates**
   - Re-enable planner workflow with feature flag
   - Add workflow inputs for both agents (dry-run, custom rules)
   - Post summary status comments on PRs

### Phase 3: Polish & Operations (Lower Priority)

1. **Observability**
   - Structured JSON logging
   - Metrics (duration, items processed, errors)
   - Debug logging flag

2. **Documentation**
   - Runbooks for deployment and debugging
   - Configuration guide with examples
   - Troubleshooting FAQ

3. **Specification Cleanup**
   - Remove aspirational tools not implemented
   - Document actual tool dependencies
   - Add examples of actual outputs

---

## Usage

This audit prompt should be used as:

1. **Investigation Tool**: Reference each section when investigating a specific agent issue
2. **Improvement Planning**: Answer all questions to surface gaps before implementation
3. **Test Design**: Use test coverage questions to write comprehensive test cases
4. **Rollout Checklist**: Work through Phase 1, 2, 3 improvements in order

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

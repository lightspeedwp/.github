# Specification: Branch Cleanup Infrastructure

**Feature ID**: 008-audit-branch-cleanup | **Date**: 2026-09-16 | **Status**: Planning Phase

## Overview

Build comprehensive branch cleanup infrastructure to identify and remove stale merged branches while preserving active development branches, protected branches, and branches with open PRs.

## User Stories

### US1: Automated Branch Categorization (P1)

**As an** organisation operator  
**I want to** automatically categorise branches as KEEP, DELETE, or DISCUSS  
**So that** I can safely identify which branches to clean up without manual review

**Acceptance Criteria**:
- 8-gate decision tree evaluates each branch independently
- Protected branches always marked KEEP
- Branches with open PRs always marked KEEP
- Merged branches older than threshold marked DELETE
- Unmerged stale branches marked DISCUSS
- Invalid branch names marked DISCUSS

**Technical Notes**: Decision gates: (1) protected, (2) excluded pattern, (3) open PR, (4) invalid name, (5) unmerged stale, (6) age threshold, (7) policy violations, (8) unclear

### US2: Branch Metadata Collection (P1)

**As an** audit system  
**I want to** collect metadata for each branch (age, author, merge status, last commit date)  
**So that** categorisation can be accurate and reports can be comprehensive

**Acceptance Criteria**:
- Fetch git merge status via `git merge-base --is-ancestor`
- Detect last commit date in ISO8601 format
- Preserve author information from git log
- Calculate age in days from last commit to now
- Handle missing/invalid dates gracefully

### US3: GitHub Integration (P1)

**As an** audit system  
**I want to** detect branches with open PRs via GitHub API  
**So that** active development branches are never deleted

**Acceptance Criteria**:
- Query open PRs efficiently
- Map PR branch heads to branch names
- Handle GitHub API errors with retry logic
- Cache results for performance

### US4: Flexible Exclusion Patterns (P2)

**As an** organisation operator  
**I want to** preserve branches matching custom regex patterns  
**So that** release and hotfix branches are never deleted by policy

**Acceptance Criteria**:
- Support user-defined regex patterns
- Default patterns: `release/.*`, `hotfix/.*`
- Combine with `ALLOWED_BRANCH_TYPES` validation
- Handle invalid regex gracefully

### US5: Branch Deletion with Safety (P2)

**As an** operator running cleanup  
**I want to** delete branches safely with dry-run capability  
**So that** I can preview changes before committing to deletion

**Acceptance Criteria**:
- Dry-run mode (default) shows deletions without executing
- Delete only remote branches by default
- Optional local branch deletion
- Delete via git command with proper error handling
- Report success/failure per branch

### US6: Comprehensive Reporting (P1)

**As an** auditor  
**I want to** generate reports of categorised branches  
**So that** I can understand the cleanup scope and share findings

**Acceptance Criteria**:
- Output formats: Markdown (human-readable), JSON (automation-friendly)
- Report includes: KEEP count, DELETE count, DISCUSS count, categorisation reasons
- Metadata for each branch: age, author, status, reason
- Save reports to `.github/reports/` directory
- Badge generation for CI status

## Technical Approach

**Language**: JavaScript/Node.js 22+ (ES modules)

**Architecture**: Modular library with independent decision gates:
- `branch-categorization.js` — 8-gate decision tree
- `age-calculator.js` — Age calculation utilities
- `git-merge-utils.js` — Git merge detection
- `github-pr-utils.js` — GitHub PR detection
- `exclusion-patterns.js` — Regex exclusion patterns
- `report-formatter.js` — Report generation

**CLI Entry Point**: `scripts/cleanup-branches.js`

**Options**:
- `--dryRun` (default: true) — Preview mode
- `--deleteLocal` (default: false) — Also delete local branches
- `--inactiveDays` (default: 30) — Age threshold
- `--excludePatterns` (default: "release/|hotfix/") — Preservation patterns
- `--reportFormat` (default: "markdown") — Output format
- `--reportDir` (default: ".github/reports") — Report location
- `--verbose` (default: false) — Debug output

**Branch Name Validation**: Enforce `{type}/{scope}-{title}` pattern with 30+ allowed types. Forbidden prefixes: `claude/`, `copilot/`, `openai/`.

## Success Criteria

1. All branches correctly categorised by 8-gate decision tree
2. No false positives (protected/active branches never deleted)
3. Reports generated accurately and saved to reports directory
4. Dry-run mode functional and accurate
5. GitHub API errors handled gracefully with retry logic
6. Performance: Process 100+ branches in <10 seconds

## Dependencies

- Node.js 22+ (built-in ES modules)
- git CLI (system dependency)
- GitHub API (`gh` CLI or Octokit)
- Optional: Shields.io for badge generation

## Out of Scope

- Automatic scheduled cleanup (use GitHub Actions workflow separately)
- User interface / dashboard
- Historical tracking of deleted branches
- Integration with project management tools

---
title: "Workflows Slide Deck Prompt"
description: "NotebookLM and design prompt for generating GitHub Actions workflows presentation"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Workflows Slide Deck Prompt

## System Overview

The **Workflows System** is the event-driven orchestration layer that coordinates all repository automation. It consists of 15 GitHub Actions workflows responding to pull requests, pushes, schedules, and manual triggers. Workflows invoke agents (release, labeling, meta, reviewer, etc.), call validation scripts, and produce repository state changes (labels, comments, releases, metrics).

**Operational scope**: GitHub Actions workflow definitions, event-driven triggers, agent orchestration, CI/CD pipeline, automation scheduling.

**Owned by**: LightSpeed ops & engineering teams

## Key Components

1. **Event-Triggered Workflows** - 12 workflows responding to PR/push/schedule events
2. **Manual Workflows** - 3 workflows supporting manual triggers
3. **CI/CD Pipeline** - 15 distinct checks (linting, testing, validation)
4. **Agent Invocation** - Workflows call agent scripts for complex logic
5. **Context Preparation** - Workflows gather event metadata for agents
6. **Output Handling** - Workflows process agent results (labels, comments, etc.)

## Integration Points

- **GitHub Events → Workflows**: pull_request, push, schedule, workflow_dispatch, issues, discussion
- **Workflows → Agent Scripts**: Invoke `.github/scripts/agents/[agent].agent.js`
- **Workflows → Validation Scripts**: Call validation for quality gates
- **Workflows → GitHub API**: Use Octokit to read/write state
- **Workflows → External Services**: Notify npm registry, artifact stores, GitHub Releases

## Use Cases & Examples

### Use Case 1: Pull Request Workflow Cascade

A PR is opened; 5 workflows activate simultaneously.

**Workflow execution:**

1. `pull_request` event (opened, synchronize, reopened)
2. **Linting Workflow** starts: runs markdown, YAML, code linting checks
3. **Reviewer Workflow** starts: invokes reviewer.agent.js for code review
4. **Labeling Workflow** starts: invokes labeling.agent.js to apply labels
5. **Testing Workflow** starts: runs Jest test suite
6. Results appear as status checks on PR
7. Developer sees failing checks, fixes issues, pushes commit
8. Workflows re-trigger automatically; cycle repeats
9. When all checks pass → PR ready for merge

### Use Case 2: Release Workflow

Tag pushed (v1.2.0); release workflow orchestrates version and artifacts.

**Workflow execution:**

1. `push` event with tag matching `v*` pattern
2. **Release Workflow** triggered
3. Workflow invokes release.agent.js
4. Agent validates CHANGELOG.md completeness
5. Agent validates version monotonicity
6. Agent generates release notes
7. Workflow creates GitHub Release with artifacts
8. Workflow publishes to npm registry (if applicable)
9. Workflow notifies stakeholders via GitHub issue
10. Release complete; metrics updated

### Use Case 3: Scheduled Health Check

Daily at 2 AM; meta.agent.js runs repository health scan.

**Workflow execution:**

1. **Meta Workflow** triggered on schedule (`cron: '0 2 * * *'`)
2. Invokes meta.agent.js with "full-scan" mode
3. Agent scans all .md files for freshness
4. Agent validates all internal links
5. Agent detects linting violations
6. Agent compiles health metrics
7. Workflow stores metrics in `.github/metrics/meta-metrics.json`
8. Workflow compares to previous metrics (trend analysis)
9. If critical violations detected → workflow creates GitHub issue
10. Metrics available for dashboard rendering

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Manual repository maintenance error-prone; inconsistent enforcement
- Stakes: Quality degradation, missed regressions, slow release cycles, unclear responsibility

**Slide 02** - Workflows Ecosystem

- 15 GitHub Actions workflows orchestrating automation
- Events: pull_request, push, schedule, manual (workflow_dispatch)
- Agents: Release, Labeling, Meta, Reviewer, Testing
- Validation: Linting, changelog, schema, link integrity
- Output: Labels, comments, releases, metrics, issues

**Slide 03** - Workflow Event Types & Triggers

- **PR Events**: pull_request (opened, synchronize, reopened)
- **Push Events**: push to branches (main, develop)
- **Tag Events**: push with tags matching version pattern (v*)
- **Scheduled**: Cron-based automation (daily health check, weekly reports)
- **Manual**: workflow_dispatch for on-demand runs
- **Discussion**: Discussion and comment events

**Slide 04** - Linting Workflow

- **Trigger**: PR opened, commit pushed, manual dispatch
- **Checks**:
  - Markdown linting (markdown-lint)
  - YAML validation (yamllint)
  - JSON validation (jsonlint)
  - JavaScript/TypeScript linting (ESLint)
  - Bash script validation (ShellCheck)
- **Agent**: Invokes linting.agent.js for orchestration
- **Output**: Passing ✅ or failing ❌ status check

**Slide 05** - Reviewer Workflow

- **Trigger**: PR opened, new commit pushed
- **Checks**:
  - Code quality analysis (ESLint, TypeScript)
  - Security scanning (static analysis)
  - Performance analysis
  - Documentation review
  - Dependency vulnerability check
- **Agent**: Invokes reviewer.agent.js
- **Output**: Review comments, suggestions, status check

**Slide 06** - Labeling Workflow

- **Trigger**: PR opened, issue created, manual dispatch
- **Logic**:
  - Invokes labeling.agent.js
  - Matches PR/issue metadata against rules
  - Applies type (bug, feature, chore, etc.)
  - Applies priority (urgent, high, medium, low)
  - Applies area (ci, docs, scripts, etc.)
  - Applies status (needs-review, blocked, etc.)
- **Output**: Labels applied to PR/issue

**Slide 07** - Release Workflow

- **Trigger**: Tag push matching `v*` pattern
- **Steps**:
  1. Checkout code at tag
  2. Invoke release.agent.js
  3. Validate CHANGELOG.md entries
  4. Generate release notes
  5. Create GitHub Release with artifacts
  6. Publish to npm registry
  7. Update metrics
  8. Notify stakeholders
- **Output**: GitHub Release, npm package, release notification

**Slide 08** - Meta Workflow

- **Trigger**: Schedule (daily 2 AM) or manual dispatch
- **Steps**:
  1. Invokes meta.agent.js
  2. Scans all .md files for frontmatter freshness
  3. Validates all internal/external links
  4. Detects linting violations
  5. Compiles health metrics
  6. Compares to previous metrics (trends)
  7. Generates violations report
  8. Creates issue if critical violations
- **Output**: Metrics JSON, violations report, health issue

**Slide 09** - Testing Workflow

- **Trigger**: PR, push, schedule
- **Steps**:
  1. Setup Node.js environment
  2. Install dependencies
  3. Run Jest test suite
  4. Generate coverage report
  5. Upload coverage to service
  6. Report test results
- **Output**: Passing/failing test results, coverage metrics

**Slide 10** - Changelog Validation Workflow

- **Trigger**: PR with CHANGELOG.md changes
- **Checks**:
  - Valid Keep-a-Changelog format
  - Sections (Added, Changed, Fixed, Removed)
  - Entries link to PRs/issues
  - Version follows SemVer
- **Output**: Pass/fail status check

**Slide 11** - Workflow Configuration & Reusability

- **Location**: `.github/.github/workflows/[name].yml`
- **Patterns**:
  - Shared steps: checkout, setup Node.js, install deps
  - Reusable patterns: invoke agent, parse output, apply labels
  - Conditional steps: run only if certain conditions met
  - Matrix strategies: run same job across multiple Node versions
- **Maintenance**: Central location, version controlled, reviewed in PRs

**Slide 12** - Workflow Status Checks & Gating

- **Required Checks**: PR cannot merge until all pass
  - linting ✅
  - testing ✅
  - reviewer ✅
- **Optional Checks**: Informational, don't block merge
  - changelog validation ⓘ
  - metrics reporting ⓘ
- **Branch Protection**: Develop branch requires all checks pass
- **Auto-Merge**: Can enable auto-merge when all checks pass

**Slide 13** - Workflow Debugging & Troubleshooting

- **Logs**: Each workflow has detailed execution logs in GitHub UI
- **Re-Run**: Failed workflow can be re-triggered manually
- **Secrets**: GitHub secrets available to workflows (npm token, GitHub token)
- **Debugging**: Add `DEBUG=*` env var to enable verbose logging
- **Testing**: Run agent scripts locally before pushing

**Slide 14** - Performance & Optimization

- **Parallel Execution**: Multiple workflows run simultaneously on PR events
- **Caching**: Dependencies cached between runs (npm install faster)
- **Conditional Steps**: Skip steps if not applicable (e.g., skip npm publish on PR)
- **Matrix Workflows**: Test across multiple Node versions in parallel
- **Timeout Protection**: Workflows timeout after 6 hours max

**Slide 15** - Close & Next Actions

- Workflows are the event-driven backbone of automation
- Contribute: Suggest workflow improvements via issues
- Observe: Check Actions tab to see workflow execution details
- Questions & feedback

## Evidence Anchors

- `.github/.github/workflows/` - 15 workflow definition files
- `.github/.github/workflows/linting.yml` - Linting workflow
- `.github/.github/workflows/reviewer.yml` - Reviewer workflow
- `.github/.github/workflows/labeling.yml` - Labeling workflow
- `.github/.github/workflows/release.yml` - Release workflow
- `.github/.github/workflows/meta.yml` - Meta health check workflow
- `.github/.github/workflows/testing.yml` - Testing workflow
- `.github/.github/workflows/changelog-validate.yml` - Changelog validation
- `.github/scripts/workflows/` - Workflow integration scripts
- `.github/.github/` - GitHub Actions configuration

## Design Notes

- **Visual theme**: Event-driven automation, CI/CD pipeline (events flowing left to right, workflows branching)
- **Color palette**: Use workflow/automation colors (blues for events, greens for passing checks, reds for failures)
- **Key visuals**: Event trigger diagram, workflow cascade on PR events, release workflow timeline, scheduled job timeline
- **Accessibility**: Clear labels for each workflow step; high contrast for pass/fail indicators; alt text for flow diagrams
- **Animations**: Consider event triggering animation, workflow step-by-step execution, status check progression

## Quality Bar

- Show realistic workflow execution times (PR checks typically 2-5 min)
- Distinguish "required" vs "optional" status checks
- Include examples of actual workflow output (PR comments, labels, etc.)
- Validate examples against actual `.github/.github/workflows/` files
- Ensure all evidence references point to current develop branch

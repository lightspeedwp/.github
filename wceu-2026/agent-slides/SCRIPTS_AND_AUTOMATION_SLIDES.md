---
title: "Scripts & Automation Slide Deck Prompt"
description: "NotebookLM and design prompt for generating scripts infrastructure presentation"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Scripts & Automation Slide Deck Prompt

## System Overview

The **Scripts & Automation Infrastructure** provides the foundational layer for all repository automation. It consists of agent scripts (domain-specific orchestrators), shared utilities (cross-cutting concerns), validation scripts (quality gates), and workflow integration logic. This layer bridges GitHub Actions workflows to domain agents and makes complex automation maintainable and testable.

**Operational scope**: Script organization, agent execution, shared utility distribution, validation pipeline, workflow integration.

**Owned by**: LightSpeed ops & engineering teams

## Key Components

1. **Agent Scripts** - 20+ domain-specific executors (release.agent.js, labeling.agent.js, meta.agent.js)
2. **Script Includes** - Shared utilities for changelog, badges, labeling, validation
3. **Validation Scripts** - Frontmatter, links, linting, schema enforcement
4. **Workflow Scripts** - Event handling, context preparation, result aggregation
5. **Testing Infrastructure** - Jest test suites, fixtures, mocking utilities
6. **Orchestration Logic** - Script discovery, error handling, logging, metrics

## Integration Points

- **Workflows → Agent Scripts**: GitHub Actions invokes agents via Node.js
- **Agent Scripts → Utilities**: Agents import shared utilities (changelogUtils, badgeUtils)
- **Agent Scripts → Validation**: Agents call validation scripts to check constraints
- **Validation Scripts → Utilities**: Validators use shared parsing and formatting logic
- **Scripts → Configuration**: All scripts read from YAML/JSON config files
- **Scripts → GitHub API**: Scripts use Octokit to read/write repository state

## Use Cases & Examples

### Use Case 1: Release Agent Execution

Release workflow triggered; release.agent.js orchestrates version bump and artifacts.

**Script execution flow:**

1. `.github/.github/workflows/release.yml` triggered on tag push
2. Workflow step invokes `node scripts/agents/release.agent.js`
3. release.agent.js loads context: git tags, CHANGELOG.md, package.json
4. Imports changelogUtils.cjs to parse changelog entries
5. Imports versionBumping utilities to calculate next version
6. Reads release config from YAML
7. Validates CHANGELOG format using validation scripts
8. Generates release notes using shared formatters
9. Returns structured output for GitHub Release creation

### Use Case 2: Labeling Agent Execution

PR opened; labeling.agent.js applies contextual labels.

**Script execution flow:**

1. `.github/.github/workflows/labeling.yml` triggered on pull_request
2. Workflow provides context: PR number, files changed, title
3. Invokes `node scripts/agents/labeling.agent.js`
4. labeling.agent.js loads labeling rules from config
5. Imports labeler-utils.js to match patterns against PR data
6. Imports badgeUtils for consistency badges
7. Determines applicable labels (type, priority, area, status)
8. Calls GitHub API via Octokit to apply labels
9. Returns summary comment with applied labels

### Use Case 3: Meta Agent Health Check

Scheduled daily; meta.agent.js generates health metrics.

**Script execution flow:**

1. Scheduled workflow triggers meta.agent.js daily
2. meta.agent.js scans repository structure
3. Imports validation scripts: frontmatter freshness, link validation
4. Runs validators across all .md files
5. Imports badgeUtils to generate health badges
6. Aggregates results into metrics JSON
7. Stores metrics in `.github/metrics/meta-metrics.json`
8. Generates trend analysis using historical data
9. Optionally creates GitHub issue if critical violations detected

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Complex automation scattered, hard to test, difficult to extend
- Stakes: Difficult to debug, slow to add features, regressions hard to catch

**Slide 02** - Scripts & Automation Layer

- Agent scripts: Domain-specific orchestrators (20+ scripts)
- Script includes: Shared utilities for common tasks
- Validation scripts: Quality gates and constraint enforcement
- Workflow integration: Bridges GitHub Actions to agent logic
- Testing infrastructure: Jest test suites with fixtures

**Slide 03** - Agent Scripts Architecture

- Entry point for each agent domain
- Location: `.github/scripts/agents/[agent-name].agent.js`
- Responsible for: Context loading, utility orchestration, output generation
- Examples: release.agent.js (22KB), labeling.agent.js (18KB), meta.agent.js (18KB)
- Not responsible for: Business logic details (delegated to utilities)

**Slide 04** - Agent Scripts: Release Domain

- **File**: release.agent.js (22,731 lines of logic)
- **Responsibilities**:
  - Parse CHANGELOG.md entries
  - Calculate version bumps (SemVer)
  - Generate release notes
  - Coordinate artifact publishing
  - Validate release readiness
- **Imports**: changelogUtils, version utilities, release config
- **Output**: Release PR, GitHub Release, npm package notifications

**Slide 05** - Agent Scripts: Labeling Domain

- **File**: labeling.agent.js (18,038 lines of logic)
- **Responsibilities**:
  - Match PR/issue against labeling rules
  - Apply type, priority, area, status labels
  - Enforce label consistency
  - Generate labeling report
  - Integrate with label-governance skill
- **Imports**: labeler-utils, badgeUtils, config loaders
- **Output**: PR labels, label summary comments

**Slide 06** - Agent Scripts: Meta Domain

- **File**: meta.agent.js (18,512 lines of logic)
- **Responsibilities**:
  - Scan repository for freshness (frontmatter last_updated)
  - Run link validation across all files
  - Detect linting violations
  - Aggregate health metrics
  - Generate trend analysis
  - Track violation heatmaps
- **Imports**: validation scripts, metric aggregators, trend analyzers
- **Output**: Metrics JSON, health report, violation alerts

**Slide 07** - Shared Utilities & Includes

- **Location**: `.github/scripts/agents/includes/`
- **Purpose**: Code reuse across agents; single source of truth for complex logic
- **Key utilities**:
  - `changelogUtils.cjs` - Parse/validate CHANGELOG.md (Keep-a-Changelog format)
  - `labeler-utils.js` - Pattern matching for labels (glob, regex support)
  - `badgeUtils.js` - Consistency badge generation and validation
  - `label-utils.js` - Label formatting and markdown tables
  - `footer-content.json` - Footer templates for document categories
- **Design**: Utilities are stateless, testable, reusable

**Slide 08** - Validation Scripts

- **Location**: `.github/scripts/validation/`
- **Purpose**: Quality gates used by agents and workflows
- **Examples**:
  - `validate-frontmatter-freshness.js` - Check last_updated recency
  - `validate-links.js` - Detect broken internal/external references
  - `validate-linting.js` - Markdown, YAML, JSON, code style
  - `validate-coderabbit-yml.js` - GitHub Copilot config validation
- **Design**: Fast, focused, cacheable, usable in CI and pre-commit

**Slide 09** - Workflow Integration Scripts

- **Location**: `.github/scripts/workflows/`
- **Purpose**: Bridge GitHub Actions to agent logic
- **Responsibilities**:
  - Parse workflow event context
  - Prepare agent input (PR metadata, file changes, config)
  - Invoke agent scripts with correct parameters
  - Handle errors and retries
  - Format agent output for workflow use (set-output, issue comments)
- **Design**: Minimal, focused on I/O, not business logic

**Slide 10** - Script Testing Infrastructure

- **Framework**: Jest with Node.js runtime
- **Location**: `.github/scripts/agents/__tests__/`
- **Coverage**: Agent logic, utilities, validation
- **Fixtures**: Sample changelogs, PRs, label configs
- **Mocking**: Octokit API, file system (for snapshot tests)
- **CI Integration**: `npm test` runs all suites; coverage tracked

**Slide 11** - Script Discovery & Loading

- **Script Registry**: Agent scripts self-register with workflows
- **Dynamic Loading**: Agents can load utilities at runtime
- **Configuration Discovery**: Scripts find config files relative to script location
- **Error Handling**: Graceful degradation if utilities missing
- **Logging**: Structured logs for debugging (session-logger hook)

**Slide 12** - Script Execution Flow

- **Triggered by**: GitHub Actions workflow event
- **Input**: Event context (PR, issue, push, schedule) + GitHub API token
- **Execution**:
  1. Workflow step runs `node scripts/agents/[agent].agent.js`
  2. Agent loads context from GitHub API
  3. Agent imports required utilities
  4. Agent executes domain logic
  5. Agent produces structured output
  6. Workflow captures output (JSON, markdown, etc.)
  7. Workflow applies output (labels, comments, releases)
- **Error Handling**: Agent exits with status code; workflow honors failure mode

**Slide 13** - Performance & Optimization

- **Script Startup**: Fast Node.js initialization (utilities cached)
- **API Batching**: Scripts batch GitHub API calls to minimize rate limiting
- **File I/O**: Concurrent file reads where safe
- **Caching**: Config files cached per agent run
- **Metrics**: Execution time tracked per agent (reported in session-logger)

**Slide 14** - Debugging & Troubleshooting

- **Local Testing**: Run agent scripts locally with `node scripts/agents/[agent].agent.js`
- **Fixture Data**: Test with sample data from `./__tests__/fixtures/`
- **Logging**: Enable debug mode with `DEBUG=lightspeed:*` environment variable
- **Session Logs**: All agent activity in session-logger output
- **PR Comments**: Agents can comment with detailed debug info on PRs

**Slide 15** - Close & Next Actions

- Scripts layer is modular, testable, and maintainable
- Contribute: Add utilities to includes, add tests to **tests**
- Questions & feedback

## Evidence Anchors

- `.github/scripts/README.md` - Scripts infrastructure overview
- `.github/scripts/agents/` - 20+ agent script files
- `.github/scripts/agents/includes/README.md` - Shared utilities guide
- `.github/scripts/agents/includes/changelogUtils.cjs` - Changelog parsing (10KB)
- `.github/scripts/agents/includes/labeler-utils.js` - Label matching logic
- `.github/scripts/validation/` - Validation script implementations
- `.github/scripts/agents/__tests__/` - Jest test suites with fixtures
- `.github/scripts/workflows/` - Workflow integration scripts

## Design Notes

- **Visual theme**: Infrastructure & plumbing (gears, pipes, flows, interconnections)
- **Color palette**: Use infrastructure colors (grays, blues, oranges for data flow)
- **Key visuals**: Script execution flow diagram, agent orchestration tree, utility dependency graph, workflow integration chain
- **Accessibility**: Clear labels for each script type; high contrast for flow arrows; alt text for diagrams
- **Animations**: Consider step-by-step script execution, utility loading reveal, workflow integration animation

## Quality Bar

- Distinguish "core agent scripts" vs "utility libraries" vs "validation"
- Show real file sizes and line counts (changelogUtils.cjs = 10KB, etc.)
- Include realistic execution time estimates (per-agent)
- Validate examples against actual script implementations
- Ensure all evidence references point to current develop branch files

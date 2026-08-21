---
file_type: agent
name: Planner Agent Runbook
description: Operational guide for deploying, configuring, and troubleshooting the Planner Agent
---

# Planner Agent Runbook

## Overview

The Planner Agent automatically generates structured execution plans for GitHub issues and pull requests. It analyzes issue context (title, description, labels, linked issues) and produces checklists tailored to three plan types: architecture, implementation, and task.

**Key Capabilities:**

- Automatic plan type detection based on labels and content
- Structured checklist generation with phases and checkpoints
- Comment deduplication (updates existing plan instead of creating duplicates)
- Dry-run mode for safe testing
- Structured JSON logging with configurable verbosity

## Deployment

### Prerequisites

- Node.js 16+ with ES6 module support
- GitHub Actions environment (or local with `GITHUB_TOKEN` set)
- Repository configured with `"type": "module"` in `package.json`

### Enable in Workflow

The Planner Agent is integrated into GitHub Actions workflows. To enable:

1. **Add to workflow YAML:**

```yaml
- name: Run Planner Agent
  uses: actions/github-script@v7
  with:
    script: |
      const { run } = await import('./.github/scripts/agents/planner.agent.js');
      await run(context, { dryRun: false });
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

1. **Verify with dry-run first:**

```yaml
- name: Planner Agent (Dry-Run)
  env:
    DRY_RUN: "true"
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: node .github/scripts/agents/planner.agent.js
```

### Local Testing

```bash
# Dry-run mode (safe, doesn't post)
DRY_RUN=true node .github/scripts/agents/planner.agent.js

# Apply mode (posts to issue)
GITHUB_TOKEN=your_token node .github/scripts/agents/planner.agent.js --apply
```

## Configuration

### Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `GITHUB_TOKEN` | Yes (non-dry-run) | — | GitHub API authentication |
| `DRY_RUN` | No | false | Run without posting comments |
| `LOG_LEVEL` | No | info | Logging verbosity (debug/info/warn/error) |
| `GITHUB_EVENT_NAME` | Automatic | — | GitHub Actions event type |

### Input Options (Programmatic)

```javascript
import { run } from './.github/scripts/agents/planner.agent.js';

await run(context, {
  dryRun: false,      // Override DRY_RUN env var
  // context comes from GitHub Actions
});
```

## Plan Types

### Architecture Plan

**Triggered by:**

- Label: `type:architecture`
- Keywords: "design", "architecture"

**Structure:**

1. Design Review (requirements, constraints, assumptions)
2. API Contract (interfaces, signatures, error handling)
3. Data Model (entities, relationships, persistence)
4. Implementation (task breakdown, ownership, timeline)

### Implementation Plan

**Triggered by:**

- Label: `type:feature` or `type:enhancement`
- Keywords: "implement"

**Structure:**

1. Setup (branch creation, environment, dependencies)
2. Core Implementation (logic, error handling, docs)
3. Testing (unit, integration, coverage targets)
4. Documentation (README, comments, APIs, CHANGELOG)
5. Review & Polish (feedback, performance, validation)

### Task Plan

**Default plan type** for issues without feature/architecture indicators

**Structure:**

1. Analysis (requirements, subtasks, dependencies, effort)
2. Research (existing solutions, tools, approach)
3. Implementation (execution, testing, decisions)
4. Verification (validation, peer review, quality check)

## Comment Management

### Deduplication

The Planner Agent uses an HTML comment marker (`<!-- planner-agent-summary -->`) to track its own comments. On subsequent runs:

- **First run:** Creates new comment with plan
- **Subsequent runs:** Updates existing comment (no duplication)
- **Manual edits:** If you edit the agent's comment, next run overwrites it

### Detecting Planner Comments

Look for the marker at the end of the plan comment:

```markdown

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

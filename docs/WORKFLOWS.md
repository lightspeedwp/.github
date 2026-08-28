---
title: "Workflow Organization and Distribution"
description: "Guidelines for organising and consuming GitHub Actions workflows across LightSpeed repositories."
version: "v1.0"
last_updated: "2026-08-28"
---

# Workflow Organization and Distribution

This document establishes clear boundaries for workflow placement and defines how workflows are consumed across the LightSpeed GitHub organisation.

## Workflow Placement Strategy

### `.github/workflows/` — Control Plane Workflows

**Purpose:** Workflows that manage and operate the `.github` repository itself (the control plane).

**Consumers:** This repository only—not shared with other repos.

**Examples:**
- Issue management and automation
- Labeling and label governance
- Metrics collection and reporting
- PR validation and enforcement
- Release management
- Documentation validation

**Directory:** `.github/workflows/`

**Discoverability:** GitHub automatically discovers workflows in this location and makes them available via GitHub Actions UI.

### `workflows/` (root) — Reusable Portable Workflows

**Purpose:** Workflows designed to be consumed by other LightSpeed repositories (WordPress block themes, WordPress block plugins, etc.).

**Consumers:** Other repositories in the `lightspeedwp` GitHub organisation.

**Examples:**
- AI feedback validation
- PR creation agent integration tests
- Issue label validation
- Phase progression orchestration

**Directory:** `workflows/` (root level)

**Discoverability:** Not automatically discovered by GitHub. Consumption requires explicit configuration in consuming repositories.

## Workflow Consumption

### How to Use Reusable Workflows in Other Repositories

Reusable workflows from this repository can be referenced using the `uses` syntax in your repository's workflows:

```yaml
# Example: Consuming a workflow from lightspeedwp/.github
jobs:
  validate-labels:
    uses: lightspeedwp/.github/workflows/validate-issue-labels@main
```

#### Full Reference Pattern

```yaml
uses: {owner}/{repo}/path/to/workflow.yml@{ref}
```

| Component | Example | Description |
|-----------|---------|-------------|
| `{owner}` | `lightspeedwp` | GitHub organisation/user |
| `{repo}` | `.github` | Repository name |
| `path/to/workflow` | `workflows/validate-issue-labels` | Path from repo root, without `.yml` extension |
| `{ref}` | `main`, `v1.0.0`, or commit SHA | Branch, tag, or commit reference |

### Example: WordPress Block Theme

To use a reusable workflow in a WordPress block theme repo:

```yaml
# .github/workflows/ci.yml (in wordpress-block-theme repo)
name: Continuous Integration

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  validate-labels:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
  
  issue-feedback:
    uses: lightspeedwp/.github/workflows/ai-feedback-validation@main
    # Any inputs/secrets the workflow requires
    with:
      # workflow input parameters here
```

### Example: WordPress Block Plugin

```yaml
# .github/workflows/test.yml (in wordpress-block-plugin repo)
name: Plugin Tests

on:
  pull_request:

jobs:
  integration-tests:
    uses: lightspeedwp/.github/workflows/pr-creation-agent-integration-tests@main
    secrets:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Guidelines for Workflow Authors

### When to Place Workflows in Each Location

| Question | Answer | Location |
|----------|--------|----------|
| Is this workflow specific to control-plane operations? | Yes | `.github/workflows/` |
| Will other repos need to use this workflow? | Yes | `workflows/` |
| Does this workflow assume `.github/` repository structure? | Yes | `.github/workflows/` |
| Is this workflow generic/portable? | Yes | `workflows/` |

### Creating Reusable Workflows

When creating workflows in `workflows/` for consumption by other repos:

1. **Use workflow inputs** for configuration (don't hardcode org-specific values)
2. **Document required inputs/secrets** in comments or README
3. **Make assumptions explicit** (expected repository structure, required files, etc.)
4. **Version your workflows** using Git tags (e.g., `v1.0.0`)
5. **Test consumption** in at least one other repository before merging

#### Example Reusable Workflow Template

```yaml
# workflows/my-reusable-workflow.yml
name: My Reusable Workflow

on:
  workflow_call:
    inputs:
      node-version:
        description: "Node.js version to use"
        required: false
        default: "18"
        type: string
    secrets:
      GITHUB_TOKEN:
        description: "GitHub token for authentication"
        required: true

jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      # Your workflow steps...
```

## Preventing Duplicates

### Validation Checks

A linting rule exists to prevent duplicate workflow files:

```bash
npm run lint:workflows
```

This checks that:
- No `.yml` file exists in both `workflows/` and `.github/workflows/`
- Reusable workflows use `on: workflow_call`
- Workflows have clear naming conventions

### Best Practice

- **Workflows in `.github/workflows/`** run on push/pull_request and use `on:` triggers
- **Workflows in `workflows/`** are reusable templates using `on: workflow_call`

If you find a file exists in both locations, determine the canonical location based on the guidelines above, then remove the duplicate.

## Current Workflow Inventory

### Control Plane Workflows (`.github/workflows/`)

- `issue-labeling-automation.yml`
- `labeling.yml`
- `metrics-collection.yml`
- `issue-remediation-automation.yml`
- `release.yml`
- `testing.yml`
- ... (and many others for control-plane operations)

### Reusable Workflows (`workflows/`)

- `ai-feedback-validation.yml`
- `orchestrate-phase-progression.yml`
- `pr-creation-agent-integration-tests.yml`
- `validate-issue-labels.yml`

## Migration Path

If you're migrating a workflow:

1. Create a migration issue linking the source and target paths
2. Audit the workflow for assumptions about its location
3. Update any hardcoded paths or references
4. Test in the new location
5. Update consumers to reference the new location
6. Remove the old file once all consumers have migrated (or deprecate with notice)

## References

- [CLAUDE.md](./CLAUDE.md) — Repository structure and conventions
- [GitHub: Reusing workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows)
- [GitHub: Workflow syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---
title: "Workflow Instructions"
description: "GitHub Actions workflow standards, best practices, and automation guidelines for LightSpeedWP projects."
version: "v1.0"
last_updated: "2025-11-24"
file_type: "documentation"
owners: ["lightspeedwp/maintainers"]
tags: ["workflows", "github-actions", "ci-cd", "automation"]
---

# Workflow Instructions Directory

This folder contains guidelines and instructions for creating and maintaining GitHub Actions workflows for LightSpeed projects.

## Workflow Categories

### Automation Workflows

- `auto-labeling.instructions.md` - Automated PR and issue labeling
- `labeling-status.instructions.md` - Status label management
- `pr-project-label.instructions.md` - PR project labeling

### Quality & Testing

- `issue-metrics.instructions.md` - Issue metrics collection
- `labeling-status.instructions.md` - Status tracking

### Project Management

- `project-meta-sync.instructions.md` - GitHub Projects synchronization
- `project-sync.instructions.md` - Cross-project synchronization

### Release & Versioning

- `release.instructions.md` - Release automation
- `labels.instructions.md` - Label management

## Key Principles

All workflows should:

- ✅ Have clear, descriptive names
- ✅ Include explicit permissions blocks
- ✅ Support manual triggering (workflow_dispatch)
- ✅ Include proper error handling
- ✅ Use caching for efficiency
- ✅ Generate summaries and reports
- ✅ Be well-documented with comments
- ✅ Follow DRY principle - reuse where possible

## Workflow Structure

### Typical Workflow Template

```yaml
name: "Workflow Name"

on:
  push:
    branches: [develop]
    paths: ["path/**"]
  pull_request:
    branches: [develop]
  workflow_dispatch:

permissions:
  contents: read
  issues: write
  pull-requests: write

jobs:
  job-name:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Run job
        run: npm run script:name

      - name: Report results
        if: always()
        run: |
          echo "## Results" >> $GITHUB_STEP_SUMMARY
          echo "- Status: Success" >> $GITHUB_STEP_SUMMARY
```

## Best Practices

### Permissions

Always use minimal permissions required:

```yaml
permissions:
  contents: read # Default for most workflows
  pull-requests: write # If commenting on PRs
  issues: write # If updating issues
  discussions: write # If using discussions
```

### Caching

Enable caching for faster builds:

```yaml
- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-
```

### Concurrency

Control parallel execution:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### Action Versions

Always pin to specific versions:

```yaml
# ✅ Good - Specific version
uses: actions/checkout@v4

# ✅ Acceptable - Major version
uses: actions/setup-node@v4

# ❌ Bad - Uses default branch (unstable)
uses: actions/checkout@main
```

## Common Patterns

### Skip Workflow

```bash
# In commit message:
git commit -m "chore: update [skip workflows]"

# In workflow:
if: "!contains(github.event.head_commit.message, '[skip workflows]')"
```

### Pull Request Comments

```yaml
- name: Comment on PR
  uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: 'Your comment here'
      })
```

### Generate Summary

```yaml
- name: Generate summary
  run: |
    echo "## Workflow Results" >> $GITHUB_STEP_SUMMARY
    echo "✅ All checks passed" >> $GITHUB_STEP_SUMMARY
```

### Upload Artifacts

```yaml
- name: Upload results
  uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: coverage/
    retention-days: 30
```

## Reusable Workflows

### Creating Reusable Workflows

```yaml
# .github/workflows/shared-lint.yml
name: Shared Linting

on:
  workflow_call:
    inputs:
      node-version:
        required: false
        type: string
        default: "20"

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      # workflow steps
```

### Using Reusable Workflows

```yaml
# .github/workflows/ci.yml
jobs:
  lint:
    uses: ./.github/workflows/shared-lint.yml
    with:
      node-version: "20"
```

## Debugging Workflows

### Enable Debug Logging

```bash
# Repository secret: ACTIONS_STEP_DEBUG = true
```

### Local Testing

```bash
# Act - run workflows locally
# https://github.com/nektos/act

act -l                    # List workflows
act -j job-name          # Run specific job
act --secret GITHUB_TOKEN=$GITHUB_TOKEN  # With token
```

## Workflow Performance

### Optimization Tips

✅ **Recommended**:

- Use `actions/setup-*` official actions
- Cache dependencies aggressively
- Parallelize jobs where possible
- Skip unnecessary jobs for certain events
- Use matrix builds for multiple configurations

❌ **Avoid**:

- Multiple sequential builds
- Downloading dependencies multiple times
- Long-running processes without timeout
- Uploading large artifacts
- Running tests without parallelization

## Organization

Workflows are organized by purpose:

```
.github/workflows/
├── ci/                      # Continuous integration
├── cd/                      # Continuous deployment
├── automation/             # Automation workflows
├── testing/                # Test runners
└── maintenance/            # Maintenance tasks
```

## Common Workflows

| Workflow           | Purpose                 | Trigger          |
| ------------------ | ----------------------- | ---------------- |
| `lint.yml`         | Code quality checks     | Push, PR         |
| `test.yml`         | Run tests               | Push, PR         |
| `labeling.yml`     | Auto-label PRs/issues   | Issue, PR events |
| `release.yml`      | Release automation      | Tag creation     |
| `project-sync.yml` | Project synchronization | Issue/PR events  |

## Validation

### Lint Workflows

```bash
npm run lint:workflows
# or
actionlint
```

### Syntax Validation

```bash
# Using yamllint
yamllint .github/workflows/

# Using Spectral
spectral lint .github/workflows/*.yml --ruleset .spectral-workflows.yaml
```

## Integration

Workflow instructions are used by:

- `.github/workflows/` - GitHub Actions workflows
- `.github/AUTOMATION_GOVERNANCE.md` - Governance policies
- `.github/custom-instructions.md` - Copilot instructions
- GitHub Actions CI/CD pipeline

## For New Workflows

To create a new workflow:

1. Follow the structure and principles above
2. Use specific action versions (e.g., `@v4`)
3. Include clear permissions block
4. Add error handling and summaries
5. Create corresponding instruction file if needed
6. Test locally with `act` if complex
7. Document in this folder

---

For more information, see the [Workflows Instructions](../workflows.instructions.md) or reference [GitHub Actions Documentation](https://docs.github.com/en/actions).

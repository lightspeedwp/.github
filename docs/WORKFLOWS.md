---
*Note: This file follows LightSpeedWP governance, frontmatter, naming, and versioning conventions as described in [VERSIONING.md](./VERSIONING.md) and [FRONTMATTER_SCHEMA.md](./FRONTMATTER_SCHEMA.md).*
---

# LightSpeedWP Core GitHub Workflows

This document is the single source of truth for all core GitHub workflows in the `.github/workflows/` directory.
**Each workflow must correspond to a single agent in `.github/agents/` where possible.**
Workflows and agents automate project health, enforce governance, and maintain data and process quality across all repos.

---

## Workflow Branch Strategy

LightSpeedWP follows a **develop → main** branching model:

- **develop**: All active development happens here.
  - All validation, CI, test, lint, label, and automation workflows run on `develop`.
  - Every PR and push targeting `develop` is fully validated before integration.

- **main**: Reserved for production-ready code and releases.
  - Only release, changelog, versioning, and publishing workflows run on `main`.
  - Code is merged into `main` only for tagging and deploying a release.

**Hotfixes:** If you allow hotfixes directly to `main`, ensure CI/test/lint workflows also run on `main` for those rare PRs.

---

## Workflow Triggers Overview

| Workflow Type          | develop | main | Rationale                                                        |
| ---------------------- | :-----: | :--: | ---------------------------------------------------------------- |
| Lint/Test/CI           |   ✅    |      | Validation before release; all active development on develop.    |
| PR Automation/Labeler  |   ✅    |      | All PRs target develop; labels/status for triage and automation. |
| Planner/Reviewer Agent |   ✅    |      | Checklist and review enforced on develop.                        |
| Project Meta Sync      |   ✅    |      | Keeps project boards in sync as work progresses.                 |
| Release/Tag/Publish    |         |  ✅  | Only run on main: version bump, changelog, release, deployment.  |

- ✅ = Workflow runs on this branch
- (empty) = Workflow does not trigger on this branch

---

## Example Workflow Triggers

**Validation/CI workflows**

```yaml
on:
  push:
    branches: [develop]
  pull_request:
    branches: [develop]
```

**Release workflows**

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
```

---

## Adding or Updating Workflows

- Always document a new workflow in this file before committing the workflow YAML.
- Specify the branch triggers for each workflow.
- Remove or archive any workflow not referenced in this file.
- For questions, see [Governance](../GOVERNANCE.md) or open a discussion.

---

# Individual Workflow Details

---

## 1. `release.yml` — **Release Agent**

**Branch:** `main` only
**Agent:** `release.agent.js`
**Purpose:**
Automates versioning, changelog, tagging, and release notes in a single, auditable workflow.

**Triggers:**

- `push` to `main`
- `workflow_dispatch` (manual)

**Key Steps:**

- Checks out code, sets up environment
- Determines release version (from input, file, or tags)
- Updates version files and badges
- Generates or updates changelog
- Commits and tags new version
- Extracts release notes and publishes GitHub Release
- Resets badges for develop branch after release

---

## 2. `planner.yml` — **Planner Agent**

**Branch:** `develop`
**Agent:** [`planner.agent.js`](../scripts/agents/planner.agent.js)
**Purpose:**
Posts a Markdown checklist and exit criteria to PRs, standardizing merge readiness and ensuring governance.

**Triggers:**

- `push` to `develop`
- `pull_request` to `develop`

**Key Steps:**

- Runs planner agent script to post/update PR checklists on all PRs

---

## 3. `reviewer.yml` — **Reviewer Agent**

**Branch:** `develop`
**Agent:** [`reviewer.agent.js`](../scripts/agents/reviewer.agent.js)
**Purpose:**
Automates PR review and feedback using reviewer agent.

**Triggers:**

- `push` to `develop`
- `pull_request` to `develop`

**Key Steps:**

- Runs reviewer agent script for automated PR summary and review

---

## 4. `labeling.yml` — **Unified Labeling, Status, and Type Automation**

**Branch:** `develop`
**Agent:** [`labeling.agent.js`](../scripts/agents/labeling.agent.js)
**Purpose:**
Unified workflow for all labeling, status/priority, and issue type automation.

**Triggers:**

- `push` to `develop`
- `pull_request` to `develop` (all relevant PR events)
- `issues` (all relevant issue events)

**References:**

- Canonical labels: [`.github/labels.yml`](../.github/labels.yml)
- Canonical issue types: [`.github/issue-types.yml`](../.github/issue-types.yml)
- File/branch label rules: [`.github/labeler.yml`](../.github/labeler.yml)

**Key Steps:**

- File/branch-based labels via native labeler action
- Runs unified agent for:
  - One-hot status and priority enforcement
  - Type label assignment using `issue-types.yml` and heuristics
  - PR heuristics (front matter, file-based, labeler.yml)
  - Ensures changelog label is present for PRs
  - Logging and action reporting

---

## 5. `project-meta-sync.yml` — **Project Board Metadata Sync**

**Branch:** `develop`
**Agent:** [project meta sync agent, if present]
**Purpose:**
Maps issues/PRs to projects and syncs status/priority/type fields from labels.

**Triggers:**

- `push` to `develop`
- `issues`: [opened, edited, labeled, unlabeled, reopened, closed]
- `pull_request` to `develop`: [opened, edited, labeled, unlabeled, reopened, ready_for_review, synchronize, closed]

**Key Steps:**

- Uses GitHub App token
- Adds issues/PRs to project board
- Derives and syncs status, priority, and type values from labels/branches

---

## 7. `lint.yml` — **Code Linting**

**Branch:** `develop`
**Purpose:**
Enforces code quality and standards through automated linting.

**Triggers:**

- `push` to `develop`
- `pull_request` to `develop`

**Key Steps:**

- Runs ESLint, Prettier, and other linters
- Reports code quality issues

---

## 8. `ci.yml` — **Continuous Integration**

**Branch:** `develop`
**Purpose:**
Core CI checks for all code changes.

**Triggers:**

- `push` to `develop`
- `pull_request` to `develop`

**Key Steps:**

- Runs tests and builds
- Validates integration

---

## 10. `changelog.yml` — **Changelog Validation**

**Branch:** `develop`
**Purpose:**
Validates and generates changelog entries.

**Triggers:**

- `push` to `develop`
- `pull_request` to `develop`

**Key Steps:**

- Validates changelog format
- Ensures changelog entries for PRs

---

## 13. `meta.yml` — **Meta Data Automation**

**Branch:** `develop`
**Agent:** [`meta.agent.js`](../scripts/agents/meta.agent.js)
**Purpose:**
Apply documentation metadata in one pass: validate/enrich front matter, update badges, inject human references, and select category-specific quirky footers.

**Triggers:**

- File changes to documentation or metadata config
- Weekly schedule
- `workflow_dispatch`

**Key Steps:**

- Validates front matter
- Updates badge blocks under the H1
- Inserts reference blocks (when present) and applies deterministic quirky footers by category
- Runs the meta agent

---

## 14. `badges.yml` — **Badge Updates**

**Branch:** `develop`
**Agent:** [`badges.agent.js`](../scripts/agents/badges.agent.js)
**Purpose:**
Repository badge status updates and maintenance.

**Triggers:**

- Path changes to badges
- `workflow_dispatch`

**Key Steps:**

- Updates repository badges
- Maintains badge consistency

**Note:** Deprecated in favor of `meta.yml` for most use cases.

---

## 23. `metrics.yml` — **Repository Metrics**

**Branch:** `develop`
**Purpose:**
Gathers repository health and performance metrics.

**Triggers:**

- Weekly schedule
- `workflow_dispatch`

**Key Steps:**

- Collects repository metrics
- Generates health reports

---

## Workflow Governance Principles

- Each workflow must correspond to a single agent where possible.
- No workflow duplication: all logic is agent-driven, DRY, and maintainable.
- Canonical configuration for labels and issue types is in `.github/labels.yml` and `.github/issue-types.yml`.
- Label mapping/file/branch rules are in `.github/labeler.yml`.
- All workflow changes must comply with [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/HEAD/instructions/coding-standards.instructions.md).

---

*This document must be updated whenever workflows are changed, added, or removed.
It is the single source of truth for workflow governance in LightSpeedWP projects.*

# GitHub Actions Workflow Validation Framework

## Overview

This document describes the automated validation framework for GitHub Actions workflows in the LightSpeedWP organization. The framework ensures that all workflows meet organizational standards for security, performance, quality, and consistency.

## Purpose

The workflow validation system:

- **Enforces Security Best Practices**: Validates permissions, secret handling, and action versions
- **Ensures Performance**: Detects missing optimizations like caching and concurrency
- **Maintains Quality**: Checks for descriptive step names, proper error handling, and documentation
- **Promotes Consistency**: Verifies adherence to organizational standards

## Validation Categories

### 🔒 Security Guardrails

Security-related validations that are **strict** (errors block validation):

- **Explicit Permissions**: Workflows should declare explicit `permissions:` blocks
- **No Secrets in Shell**: Prevents accidental exposure of secrets through shell output
- **Action Version Pinning**: Requires full commit SHA pinning for security
- **Checkout Permissions**: Verifies safe checkout configuration

### ⚡ Performance Guardrails

Performance optimizations that are **warnings** (allow workflows to pass):

- **Caching Strategy**: Recommends caching for npm, pip, and other package managers
- **Concurrency Control**: Suggests concurrency configuration to prevent overlapping runs
- **Checkout Optimization**: Recommends fetch-depth settings for faster checkouts
- **Matrix Efficiency**: Checks for efficient matrix configurations

### ✅ Quality Guardrails

Code quality validations that are **warnings**:

- **Descriptive Step Names**: All run steps should have descriptive names
- **Error Handling**: Checks for proper error handling and cleanup steps
- **Timeout Configuration**: Validates timeout settings for long-running jobs
- **Resource Limits**: Ensures appropriate resource allocation

### 🔄 Consistency Guardrails

Organizational consistency checks that are **warnings**:

- **Consistent Trigger Events**: Encourages standard event triggers
- **Ubuntu Version**: Recommends ubuntu-latest for consistency
- **Action Organization**: Suggests organizing steps logically

## Running Validation

### Via npm Script

```bash
# Run all workflow validations
npm run validate:workflows

# Check results
# - ✅ Passed: 33
# - ❌ Failed: 0
# - ⚠️  Warnings: 97
```

### In CI/CD Pipeline

The validation runs automatically on:

- **Pull Requests**: When workflow files are modified
- **Scheduled**: Weekly validation of all workflows
- **Manual**: Via workflow_dispatch trigger

### Validation Output

The validator produces structured output including:

```
🔍 Workflow Validation Results

❌ ERRORS:
   [Only critical security issues shown]

⚠️  WARNINGS:
   [Best practice recommendations]

📊 Summary:
   Total workflows: 33
   ✅ Passed: 33
   ❌ Failed: 0
   ⚠️  Warnings: 97
```

## Configuration

### Guardrails File

The validation rules are defined in:

```javascript
// Location: scripts/validation/validate-workflows.js
// Contains: SecurityGuardrails, PerformanceGuardrails, QualityGuardrails, ConsistencyGuardrails
```

### Key Configuration

Each guardrail category includes:

```javascript
{
  enabled: true,                    // Enable/disable the entire category
  rules: {
    specificRule: {
      enabled: true,                // Enable/disable individual rules
      message: "Description",       // Error/warning message
      level: "warning" | "error"   // Severity level
    }
  }
}
```

## Workflow Improvements

Common recommendations from validation:

### 1. Add Permissions Block

```yaml
permissions:
  contents: read
  pull-requests: write
```

### 2. Add Concurrency Control

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### 3. Optimize Checkout

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0 # Full history when needed
```

### 4. Add Caching

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: "npm"
```

### 5. Descriptive Step Names

```yaml
- name: Run tests with coverage
  run: npm run test:coverage
```

## Validation Results

Current workflow validation results:

- **Total Workflows**: 33
- **Security Status**: ✅ All workflows follow security best practices
- **Performance**: 25 workflows could benefit from caching optimizations
- **Quality**: 20 workflows have steps without descriptive names
- **Consistency**: All workflows follow organizational patterns

## Implementation Best Practices

### When Creating New Workflows

1. **Always Include Permissions**

   ```yaml
   permissions:
     contents: read
   ```

2. **Pin Action Versions**

   ```yaml
   uses: actions/checkout@a1b82bbb3dd0ef16261a2ba3b91b4603d2e2d46b # v4
   ```

3. **Use Concurrency**

   ```yaml
   concurrency:
     group: ${{ github.workflow }}-${{ github.ref }}
   ```

4. **Name All Steps**

   ```yaml
   - name: Build application
     run: npm run build
   ```

5. **Cache Dependencies**

   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: "npm"
   ```

## Workflow Examples

### Secure, Optimized Workflow

```yaml
name: Build and Test

on:
  push:
    branches: [develop]
  pull_request:
    branches: [develop]

permissions:
  contents: read
  pull-requests: write

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout code
        uses: actions/checkout@a1b82bbb3dd0ef16261a2ba3b91b4603d2e2d46b # v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@60edb3dd545a775178fbb3d1d2aaf32c4631a3bb # v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm test:coverage

      - name: Upload coverage
        uses: actions/upload-artifact@65462800fd760344d3fbb3e7f58a62d3e9ce1e25 # v4
        if: always()
        with:
          name: coverage-report
          path: coverage/
```

## Troubleshooting

### Common Validation Errors

**Error: "Missing permissions block"**

- Solution: Add `permissions:` block to job or workflow level

**Error: "Action version not pinned to commit SHA"**

- Solution: Use full commit SHA instead of tag (find via GitHub UI)

**Error: "Secrets found in shell output"**

- Solution: Use GitHub's secret masking or avoid logging sensitive data

### Getting Detailed Results

```bash
# View full validation output with all warnings
npm run validate:workflows 2>&1 | less

# Check specific workflow
node scripts/validation/validate-workflows.js .github/workflows/lint.yml
```

## Integration with Development Workflow

### Local Development

1. **Before Committing Workflow Changes**

   ```bash
   npm run validate:workflows
   ```

2. **Fix Issues**
   - Address all errors (red)
   - Consider addressing warnings (yellow)

3. **Commit Changes**

   ```bash
   git add .github/workflows/your-workflow.yml
   git commit -m "feat(workflows): improve security and performance"
   ```

### CI/CD Integration

The validation automatically runs in:

- **PR Workflow**: Validates modified workflows
- **Scheduled Jobs**: Weekly comprehensive validation
- **Pre-commit Hooks**: Local validation via Husky

## Maintenance

The validation framework is maintained by the LightSpeed team. To propose improvements:

1. Open an issue with the `type:improvement` label
2. Include examples of workflows that should pass/fail
3. Link to relevant GitHub Actions documentation

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

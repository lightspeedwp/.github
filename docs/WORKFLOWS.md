---
_Note: This file follows LightSpeedWP governance, frontmatter, naming, and versioning conventions as described in [docs/VERSIONING.md](VERSIONING.md) and [.github/FRONTMATTER-SCHEMA.md](../.github/FRONTMATTER-SCHEMA.md)._
---

# LightSpeedWP Core GitHub Workflows

This document defines, governs, and tracks all core GitHub workflows in the `.github/workflows/` directory.

---

## Workflow Branch Strategy

LightSpeedWP follows a **develop → main** branching model:

- **develop**: All active development occurs here.  
  - All validation, CI, test, lint, label, and automation workflows run on `develop`.
  - Every PR and push targeting `develop` is fully validated before integration.

- **main**: Reserved for production-ready code and releases.
  - Only release, changelog, versioning, and publishing workflows run on `main`.
  - Code is merged into `main` via PR only when a release is being tagged/deployed.
  - No features or fixes are developed directly on main.

**Hotfixes**: If you allow hotfixes directly to `main`, ensure CI/test/lint workflows also run on `main` for those rare PRs.

---

## Workflow Triggers Overview

| Workflow Type           | develop | main   | Rationale                                                         |
|-------------------------|:-------:|:------:|-------------------------------------------------------------------|
| Lint/Test/CI            |   ✅    |        | Validate code before release; active development is on develop.   |
| PR Automation/Labeler   |   ✅    |        | All PRs target develop; labels/status for triage and automation.  |
| Planner/Reviewer Agent  |   ✅    |        | Checklists and code review are enforced on develop.               |
| Project Meta Sync       |   ✅    |        | Keeps project boards in sync as work progresses on develop.       |
| Release/Tag/Publish     |         |   ✅   | Only run on main: version bump, changelog, release, deployment.   |

- ✅ = Workflow runs on this branch
- (empty) = Workflow does not trigger on this branch

**Workflows should always specify explicit branch triggers to avoid accidental runs on feature or stale branches.**

---

## Example Workflow Triggers

**Validation/CI workflows**  
```yaml
on:
  push:
    branches: [ develop ]
  pull_request:
    branches: [ develop ]
```

**Release workflows**  
```yaml
on:
  push:
    branches: [ main ]
  workflow_dispatch:
```

---

## Adding or Updating Workflows

- Always document a new workflow in this file before committing the workflow YAML.
- Specify the branch targets for each workflow.
- Remove or archive any workflow not referenced in this file.
- For questions, see [Governance](../GOVERNANCE.md) or open a discussion.

---

# Individual Workflow Details

---

## 1. `release.yml` — **Release Agent**

**Branch:** `main` only  
**Purpose:**  
Handles versioning, changelog, tagging, and release notes in a single, auditable workflow.  
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
**Purpose:**  
Implements “Planner Agent” for PR checklists and merge readiness validation.  
**Triggers:**  
- `push` to `develop`
- `pull_request` to `develop`

**Key Steps:**
- Runs planner agent script to post/update PR checklists

---

## 3. `reviewer.yml` — **Reviewer Agent**

**Branch:** `develop`  
**Purpose:**  
Automates PR review and feedback using reviewer agent.  
**Triggers:**  
- `push` to `develop`
- `pull_request` to `develop`

**Key Steps:**
- Runs reviewer agent script for automated PR summary and review

---

## 4. `labeler.yml` — **Auto-label PRs**

**Branch:** `develop`  
**Purpose:**  
Adds labels to PRs based on file and branch rules using labeler action.  
**Triggers:**  
- `push` to `develop`
- `pull_request` to `develop`

**Key Steps:**
- Runs labeler GitHub Action using `.github/labeler.yml` config

---

## 5. `labels-issues-prs.yml` — **Labeling & Status Automation**

**Branch:** `develop`  
**Purpose:**  
Ensures one status label per issue/PR, applies default priority/status, ensures changelog label.  
**Triggers:**  
- `push` to `develop`
- `issues`: [opened, edited, reopened, labeled, unlabeled, transferred]
- `pull_request` to `develop`: [opened, reopened, synchronize, ready_for_review, edited, labeled, unlabeled]

**Key Steps:**
- Runs labeler for files/branches
- Applies default status/priority where missing
- Enforces only one status label per PR/issue
- Adds `meta:needs-changelog` label if missing

---

## 6. `project-meta-sync.yml` — **Project Board Metadata Sync**

**Branch:** `develop`  
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

## Next Phase / To Be Implemented

- **Changelog Automation** (`changelog.yml`):  
  Enforce changelog updates in all PRs except releases/docs. 
- **Auto Issue Type** (`auto-issue-type.yml`):  
  Robustly map template metadata, labels, and title to org-wide issue types.
- **Org Label Sync** (`org-label-sync.yml`):  
  Sync `.github/labels.yml` to all repos on schedule or dispatch.
- **Linting/CI**:  
  Add/expand `lint.yml`, `markdownlint.yml`, `eslint.yml`, `shellcheck.yml` for comprehensive validation.
- **Comprehensive Project Syncs**:  
  Refactor periodic sync agents (`project-sync-*.yml`) into multi-purpose workflows.

---

## Directory Cleanup Recommendations

- **Archive or remove any workflows not referenced in this document.**
- **Legacy or experimental workflows** can be moved to `.github/archived-workflows/` for safekeeping.
- **All new/updated workflows** should be explicitly documented here.

---

_This document is the single source of truth for workflow governance in LightSpeedWP projects. Update it with every workflow change to ensure consistency and traceability._
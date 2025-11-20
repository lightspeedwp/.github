---
_Note: This file follows LightSpeedWP governance, frontmatter, naming, and versioning conventions as described in [docs/VERSIONING.md](VERSIONING.md) and [.github/FRONTMATTER-SCHEMA.md](../.github/FRONTMATTER-SCHEMA.md)._
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
**Agent:** [`release.agent.js`](../.github/agents/release.agent.js)  
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
**Agent:** [`planner.agent.js`](../.github/agents/planner.agent.js)  
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
**Agent:** [`reviewer.agent.js`](../.github/agents/reviewer.agent.js)  
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
**Agent:** [`labeling.agent.js`](../.github/agents/labeling.agent.js)  
**Purpose:**  
Unified workflow for all labeling, status/priority, and issue type automation.  
**This replaces all prior labeling workflows:**

- `label-prs.yml`
- `issue-type.yml`
- `labeler.yml`
- `labels-issues-prs.yml`

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

---

## 6. `quality-gates.yml` — **Comprehensive Quality Validation**

**Branch:** `develop`
**Purpose:**
Comprehensive quality validation across all checks before merge.

**Triggers:**

- `pull_request` to `develop`
- `workflow_dispatch` (manual)

**Key Steps:**

- Runs linting, tests, frontmatter validation
- Checks code quality and standards
- Validates documentation

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

## 9. `jest-test-audit.yml` — **Jest Test Coverage**

**Branch:** `develop`
**Purpose:**
Audits Jest test coverage for agents and utilities.

**Triggers:**

- `push` to `develop`
- `pull_request` to `develop`
- `workflow_dispatch`

**Key Steps:**

- Runs all agent test suites
- Reports coverage metrics

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

## 11. `frontmatter-validation.yml` — **Frontmatter Schema Validation**

**Branch:** `develop`
**Purpose:**
Validates frontmatter in markdown files against schema.

**Triggers:**

- `push` to `develop`, `claude/**` branches
- `pull_request` with markdown changes
- `workflow_dispatch`

**Key Steps:**

- Validates frontmatter schema structure
- Runs schema tests
- Validates changed markdown files
- Comments on PR if validation fails

---

## 12. `collections-indexer.yml` — **Collections Index Builder**

**Branch:** `develop`
**Purpose:**
Builds and validates collections index files.

**Triggers:**

- `pull_request` to `develop`

**Key Steps:**

- Builds collection indexes
- Validates index integrity

---

## 13. `branding.yml` — **Branding Automation**

**Branch:** `develop`
**Agent:** [`branding.agent.js`](../.github/agents/branding.agent.js)
**Purpose:**
Unified header, footer, and badge automation for documentation.

**Triggers:**

- File changes to documentation, badges, or headers/footers
- Weekly schedule
- `workflow_dispatch`

**Key Steps:**

- Updates headers and footers across documentation
- Manages badge consistency
- Runs branding agent

---

## 14. `badges.yml` — **Badge Updates**

**Branch:** `develop`
**Agent:** [`badges.agent.js`](../.github/agents/badges.agent.js)
**Purpose:**
Repository badge status updates and maintenance.

**Triggers:**

- Path changes to badges
- `workflow_dispatch`

**Key Steps:**

- Updates repository badges
- Maintains badge consistency

**Note:** Deprecated in favor of `branding.yml` for most use cases.

---

## 15. `header-footer.yml` — **Header/Footer Consistency**

**Branch:** `develop`
**Agent:** [`header-footer.agent.js`](../.github/agents/header-footer.agent.js)
**Purpose:**
Ensures documentation header/footer consistency.

**Triggers:**

- File changes to documentation

**Key Steps:**

- Validates and updates headers/footers
- Ensures consistency across docs

**Note:** Deprecated in favor of `branding.yml`.

---

## 16. `manage-readmes.yml` — **README Management**

**Branch:** `develop`
**Agent:** [`manage-readmes.agent.js`](../.github/agents/manage-readmes.agent.js)
**Purpose:**
Automated README generation and consistency across repositories.

**Triggers:**

- Path changes to README files
- `workflow_dispatch`

**Key Steps:**

- Generates README files from templates
- Ensures README consistency

---

## 17. `aiops-frontmatter.yml` — **AIOps Frontmatter Validation**

**Branch:** `develop`
**Purpose:**
Validates frontmatter presence in AI operations files.

**Triggers:**

- `pull_request` to prompts, chatmodes, instructions paths

**Key Steps:**

- Checks for frontmatter in AI files
- Validates required fields

---

## 18. `aiops-index-drift.yml` — **AIOps Index Drift Detection**

**Branch:** `develop`
**Purpose:**
Checks that index files include all leaf files.

**Triggers:**

- `pull_request` to collections, prompts, chatmodes paths

**Key Steps:**

- Validates index completeness
- Detects missing entries

---

## 19. `aiops-link-check.yml` — **AIOps Link Validation**

**Branch:** `develop`
**Purpose:**
Checks for broken links in documentation.

**Triggers:**

- `pull_request` to docs

**Key Steps:**

- Scans for broken links
- Reports link issues

---

## 20. `aiops-secrets-scan.yml` — **AIOps Secrets Scanning**

**Branch:** `develop`
**Purpose:**
Scans for secrets and PII in code.

**Triggers:**

- `pull_request` to `.github`, `docs` paths

**Key Steps:**

- Detects potential secrets
- Prevents credential leaks

---

## 21. `label-sync.yml` — **Organization Label Sync**

**Branch:** `develop`
**Purpose:**
Syncs labels across organization repositories.

**Triggers:**

- `push` to `develop`
- Weekly schedule
- `workflow_dispatch`

**Key Steps:**

- Syncs canonical labels from `.github/labels.yml`
- Ensures org-wide label consistency

---

## 22. `all-contributors-update.yml` — **Contributors Recognition**

**Branch:** `develop`
**Purpose:**
Maintains contributor recognition table.

**Triggers:**

- PR merge events

**Key Steps:**

- Updates all-contributors table
- Recognizes new contributors

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

## 24. `frontmatter-metrics.yml` — **Frontmatter Metrics**

**Branch:** `develop`
**Purpose:**
Tracks frontmatter usage and compliance metrics.

**Triggers:**

- Weekly schedule
- `workflow_dispatch`

**Key Steps:**

- Analyzes frontmatter usage
- Reports compliance metrics

---

## 25. `weekly-metrics.yml` — **Weekly Health Reporting**

**Branch:** `develop`
**Purpose:**
Comprehensive weekly repository health reporting.

**Triggers:**

- Weekly schedule
- `workflow_dispatch`

**Key Steps:**

- Generates weekly health report
- Tracks trends and metrics

---

## 26. `ci-metrics.yml` — **CI Metrics Gathering**

**Branch:** `develop`
**Purpose:**
Collects CI/CD performance metrics.

**Triggers:**

- On workflow checkout

**Key Steps:**

- Gathers CI metrics
- Tracks performance trends

---

## 27. `release-prep.yml` — **Release Preparation**

**Branch:** `develop`
**Purpose:**
Prepares repository for upcoming releases.

**Triggers:**

- Weekly schedule
- `workflow_dispatch`

**Key Steps:**

- Checks release readiness
- Prepares release notes

---

## Directory Cleanup

- **Deprecated workflows moved to archive:**
  - `labeler.yml` (replaced by `labeling.yml`)
  - `labeling.yml.old` (removed)
  - Other legacy labeling workflows
- **Archived workflows located in:** `.github/workflows/archived/`
- **All new/updated workflows** must be explicitly documented here.

---

## Best Practices

- Each workflow must correspond to a single agent where possible.
- No workflow duplication: all logic is agent-driven, DRY, and maintainable.
- Canonical configuration for labels and issue types is in `.github/labels.yml` and `.github/issue-types.yml`.
- Label mapping/file/branch rules are in `.github/labeler.yml`.
- All workflow changes must comply with [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md).

---

_This document must be updated whenever workflows are changed, added, or removed.  
It is the single source of truth for workflow governance in LightSpeedWP projects._

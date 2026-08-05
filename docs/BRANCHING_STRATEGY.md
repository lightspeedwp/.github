---
file_type: documentation
title: Org-wide Git Branching Strategy
description: Canonical branch naming, protection, merge discipline, and automation rules for LightSpeedWP repositories.
last_updated: '2026-06-19'
owners:
  - LightSpeed Team
version: v1.5.1
status: active
stability: stable
domain: governance
tags:
  - branching
  - git
  - governance
  - ci
language: en
---

# Org-wide Git Branching Strategy

Primary operations reference: [GITHUB_PROJECT_OPERATIONS_SPEC.md](./GITHUB_PROJECT_OPERATIONS_SPEC.md)

<!-- BADGES-START -->
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![changelog-auto-update](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml)
[![changelog-validate](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![dependabot-security-label](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![issue-close-label-hygiene](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-summary](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![readme-audit](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml)
[![readme-regen](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml)
[![readme-update](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
<!-- BADGES-END -->

Keep `main` always deployable, reduce merge risk, and make PR automation predictable across all LightSpeedWP repositories. This policy aligns branch names with **Issue Types** and **Projects**, powers label and workflow automation, and enforces disciplined merge practices.

---

## 1. High-level Rules

- `main` is production-ready at all times.
- Optional `develop` branch for integration workflows.
- Short-lived branches; open PRs early and keep changes small.
- Squash merge to preserve linear history; delete branches post-merge.
- Use branch prefixes that map cleanly to Issue Types and Project fields.

---

## 2. Branch Protection

Apply these GitHub protection rules to `main` (and `develop` if used):

- Require pull request before merging.
- Require approvals: 1 for most repos, 2 for critical repos.
- Require review from Code Owners (if using `CODEOWNERS`).
- Dismiss stale approvals when new commits are pushed.
- Require conversation resolution before merging.
- Require status checks to pass before merging (lint, tests, build).
- Require branches to be up to date before merging.
- Require linear history (squash-merge only).
- Do not allow bypassing (include administrators).
- Optionally require signed commits.

Enable squash merge only; disable merge commits and rebase merges.

---

## 3. Branch Naming

**Format:**
`{type}/{scope}-{short-title}`
Use lower-case, kebab-case, and keep it short.

### 3.1 Required Core Prefixes

For all repos (client, product, infra, etc.), use:

- `feat/` — new capability/feature
- `fix/` — bug fix
- `hotfix/` — urgent production fix
- `release/` — release branches (e.g., `release/v1.6.0`)
- `refactor/` — internal restructure
- `chore/` — maintenance, housekeeping
- `docs/` — documentation
- `test/` — testing only
- `perf/` — performance improvements
- `ci/` — CI/CD or workflow changes
- `build/` — build process changes
- `deps/` — dependency updates
- `security/` — security-related
- `revert/` — revert previous changes
- `research/` — research spikes
- `design/` — design changes
- `a11y/` — accessibility changes
- `ux/` — user experience
- `i18n/` — internationalization
- `ops/` — operations

### 3.2 Optional Product Profile Prefixes

- `proto/` — prototypes/experiments
- `ds/` — design system
- `api/` — API surface
- `.schemas/` — DB/schema changes
- `telemetry/` — analytics/metrics

### 3.3 Optional Client Profile Prefixes

- `content/` — content edits, redirects, IA
- `seo/` — SEO, metadata, schema, sitemap, robots
- `config/` — site/plugin configuration
- `migrate/` — data/content migrations
- `qa/` — test harnesses, UAT scaffolding
- `uat/` — UAT-only changes or staging toggles
- `codex/` — Codex-assisted work branches used by the local agent workflow

### 3.4 Examples

```text
feat/product-grid-quick-add
refactor/split-frontend-bundle
api/orders-bulk-cancel
.schemas/add-index-orders-created
telemetry/add-checkout-step-events
release/v1.6.0
hotfix/cart-csrf-check

fix/nl-postcode-validation
content/category-copy-refresh
config/feature-flags-cart
seo/add-faq-schema-on-product
release/go-live-2025-10-10
hotfix/ga4-purchase-duplicate
```

---

## 4. Branch Name Enforcement via CI

### 4.1 Human and Agent Branch Discipline

- Validate branch relevance before the first edit.
- If the current branch belongs to a different issue, PR, or task, create a new branch from `develop` before making changes.
- Do not reuse in-flight branches for unrelated work, even when the working tree is already open.
- If unrelated local changes are present, use a clean worktree rather than mixing scopes.
- Temporary audit replay branches created for PR merge prep may use the form `pr-<number>-audit` when they need to keep a live PR attached to a historical review branch.

Use a single regex in a workflow to enforce naming discipline:

```regex
^(feat|fix|hotfix|release|refactor|chore|docs|test|perf|ci|build|deps|security|revert|research|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry|content|seo|config|migrate|qa|uat|codex)/[a-zA-Z0-9._-]+$
```

Example workflow (`.github/workflows/validate-branch-name.yml`):

```yaml
name: Validate branch name
on:
  pull_request:
    types: [opened, reopened, synchronize, edited, ready_for_review]
jobs:
  check-branch:
    runs-on: ubuntu-latest
    steps:
      - name: Enforce {type}/{scope}-{short-title}
        run: |
          BRANCH="${{ github.head_ref }}"
          # Allow dependabot/renovate
          if [[ "$BRANCH" =~ ^(dependabot|renovate)/ ]]; then exit 0; fi
          # Allow temporary audit replay branches used for PR merge prep
          if [[ "$BRANCH" =~ ^pr-[0-9]+-audit$ ]]; then exit 0; fi
          if [[ ! "$BRANCH" =~ ^(feat|fix|hotfix|release|refactor|chore|docs|test|perf|ci|build|deps|security|revert|research|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry|content|seo|config|migrate|qa|uat)/[a-zA-Z0-9._-]+$ ]]; then
            echo "❌ Branch '$BRANCH' must match the required pattern."
            exit 1
          fi
```

**[NEW]**

- For monorepos, ensure branch naming applies to each package/subproject, or use a consistent prefix (e.g. `feat/frontend-...`, `fix/api-...`).
- For forked repos, always clean up branches after merging upstream PRs, and avoid duplicating branch names across forks to prevent confusion.

---

## 5. Prefixes Drive Automation

### 5.1 Labeler (Status Kick-off)

Ensure `.github/labeler.yml` seeds new PRs with `status:needs-review` when appropriate:

```yaml
"status:needs-review":
  - head-branch:
      [
        "^feat/.*",
        "^fix/.*",
        "^hotfix/.*",
        "^release/.*",
        "^refactor/.*",
        "^chore/.*",
        "^docs/.*",
        "^test/.*",
        "^perf/.*",
        "^ci/.*",
        "^build/.*",
        "^deps/.*",
        "^security/.*",
        "^revert/.*",
        "^research/.*",
        "^design/.*",
        "^a11y/.*",
        "^ux/.*",
        "^i18n/.*",
        "^ops/.*",
        "^proto/.*",
        "^ds/.*",
        "^api/.*",
        "^.schemas/.*",
        "^telemetry/.*",
        "^content/.*",
        "^seo/.*",
        "^config/.*",
        "^migrate/.*",
        "^qa/.*",
        "^uat/.*",
      ]
```

**[NEW]**

- For automation, use GitHub Actions to auto-assign reviewers based on branch type (e.g., security → security lead).
- Sync project automation rules across all repos using `.github` repo templates.

### 5.2 Project Type Mapping

Extend your project sync workflow so branch prefixes set the Project **Type** field:

- `feat/` → Feature/Story
- `fix/` → Bug (hotfix → critical Bug)
- `refactor/` → Refactor
- `chore/`, `ci/`, `build/`, `deps/`, `security/` → Chore
- `design/`, `a11y/`, `ux/` → Design/Task
- `content/`, `seo/`, `config/`, `migrate/`, `qa/`, `uat/` → Task/Operations
- `proto/`, `api/`, `.schemas/`, `telemetry/`, `ds/` → Feature/Task
- `release/` → Release PR

**Principle:**
Labels remain **routing signals** (status, priority, area/component).
Issue Types and Project fields carry the semantic meaning.

### 5.3 PR Template Routing

Use `.github/PULL_REQUEST_TEMPLATE/config.yml` as the canonical machine-readable
route map, and keep it aligned with the branch names and template files below.
Where there is no specialised template file, the closest active template is
reused so automation stays predictable.

| Branch prefix | PR template |
| --- | --- |
| `feat/` | `pr_feature.md` |
| `fix/` | `pr_bug.md` |
| `hotfix/` | `pr_hotfix.md` |
| `refactor/` | `pr_refactor.md` |
| `chore/` | `pr_chore.md` |
| `docs/` | `pr_docs.md` |
| `test/` | `pr_chore.md` |
| `perf/` | `pr_feature.md` |
| `ci/` | `pr_ci.md` |
| `build/` | `pr_ci.md` |
| `deps/` | `pr_dep_update.md` |
| `security/` | `pr_bug.md` |
| `design/` | `pr_feature.md` |
| `a11y/` | `pr_feature.md` |
| `ux/` | `pr_feature.md` |
| `release/` | `pr_release.md` |
| `research/` | `pr_feature.md` |
| `revert/` | `pr_chore.md` |
| `i18n/` | `pr_feature.md` |
| `ops/` | `pr_chore.md` |
| `proto/` | `pr_feature.md` |
| `ds/` | `pr_feature.md` |
| `api/` | `pr_feature.md` |
| `.schemas/` | `pr_feature.md` |
| `telemetry/` | `pr_feature.md` |
| `content/` | `pr_docs.md` |
| `seo/` | `pr_docs.md` |
| `config/` | `pr_chore.md` |
| `migrate/` | `pr_chore.md` |
| `qa/` | `pr_chore.md` |
| `uat/` | `pr_chore.md` |

---

## 6. Merge Discipline

- Keep branches current; resolve all conversations before merging.
- Squash merge only; PR title becomes the squash commit.
- Delete the branch after merge.
  **[NEW]**
- Never force push to shared branches (`main`, `develop`); use protected branch settings.
- For remote teams, always communicate in PR comments and reference related issues for traceability.

---

## 7. Release & Hotfix Flow

### 7.1 Release Flow (Develop-First Stacked PRs)

The release flow uses a **develop-first stacked PR model** to ensure all release changes integrate to `develop` before merging to `main`:

**Architecture:**

```
develop (feature work integrated)
    ↓
release/vX.Y.Z (agent-created, from develop)
    ↓
[STACKED PR #1] release/vX.Y.Z → develop (changelog + version bump)
    ↓ (after PR #1 merges)
[STACKED PR #2] release/vX.Y.Z → main (release to production)
    ↓ (after PR #2 merges)
post-release-sync (chore: main → develop, automatic)
```

**Flow:**

1. **Prepare on develop:**
   - Ensure all features merged to `develop`.
   - Verify `CHANGELOG.md` has unreleased entries.
   - Confirm no uncommitted changes (`git status`).
   - Verify actor is in `maintainers` team (authorization required).

2. **Trigger release workflow:**
   - Go to **Actions** → **release** → **Run workflow**.
   - Configure: `scope` (patch/minor/major), `provider` (shell/mcp), `dry_run` (true/false).
   - Workflow validates actor, runs lint/tests, triggers release agent.

3. **Agent creates `release/vX.Y.Z` branch:**
   - Bumps `VERSION` file.
   - Updates `CHANGELOG.md`: rolls `[Unreleased]` to `[X.Y.Z] - YYYY-MM-DD`.
   - Commits: `"chore: Release vX.Y.Z"`.
   - Creates **PR #1**: `release/vX.Y.Z` → `develop`.

4. **Developer reviews and merges PR #1:**
   - Open PR #1, verify changelog and version bump.
   - Approve and merge to `develop`.

5. **Agent creates **PR #2** (stacked):**
   - After PR #1 merges, agent automatically creates **PR #2**: `release/vX.Y.Z` → `main`.
   - Includes compiled release notes (from CHANGELOG + merged PRs).
   - Creates annotated tag `vX.Y.Z`.

6. **Developer reviews and merges PR #2:**
   - Open PR #2, verify release notes.
   - Approve and merge to `main`.
   - GitHub Release publishes automatically.

7. **Post-release sync (automatic):**
   - `post-release-sync` workflow runs after PR #2 merges.
   - Creates `chore/post-release-sync-main-to-develop` branch.
   - Merges `main` → `develop` to keep branches synchronized.
   - Developer merges the sync PR.

**Authorization gating:**

- Only `workflow_dispatch` and `workflow_call` trigger events allowed.
- Actor must be member of `maintainers` team.
- Unauthorized attempts logged in `trigger-telemetry.json`; workflow fails immediately.
- See [Release Process](./RELEASE_PROCESS.md#authorization-gating) for full details.

### 7.2 Hotfix Flow

Hotfixes are urgent production fixes merged directly to `main`:

1. **Create hotfix branch from `main`:**

   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/fix-description
   ```

2. **Minimal fix + tests:**
   - Single fix only; no feature work.
   - Update tests; confirm all pass locally.

3. **PR to `main`:**
   - Open PR `hotfix/...` → `main`.
   - Required checks: lint, tests, changelog (if applicable).
   - Approve and merge to `main`.

4. **Tag and release:**
   - Agent tags `vX.Y.Z-hotfix.N` or similar (per semantic versioning).
   - GitHub Release published.

5. **Back-merge to `develop`:**
   - Cherry-pick the hotfix commit to `develop`, or
   - Create PR: `main` → `develop` to sync the hotfix.
   - Resolve any conflicts if `develop` has diverged.

**[NEW]**

- Always update release notes and changelog for each release/hotfix, even when changes seem minor.
- Use `release/` prefix for normal version bumps; use `hotfix/` for urgent production fixes only.

---

## 8. Quick Per-Repo Checklist

- Enable branch protections on `main` (+ `develop` if used).
- Adopt branch naming discipline; enforce via CI workflow.
- Sync `.github/labeler.yml` and project mapping with chosen prefixes.
- Prefer Issue Types and Project fields over proliferation of `type:*` labels.
- Squash merge only; delete branches post-merge.
- Share this strategy in repo READMEs and onboarding docs.
  **[NEW]**
- Document exceptions (e.g., legacy branches, vendor integrations) in `CONTRIBUTING.md`.

---

## 9. FAQ & Guardrails

- **Do we need `develop`?** Optional; skip if deployment model supports feature/release branches.
- **Where do we record “type of work”?** Project **Type** field (from branch) and **Issue Type** on linked issue.
- **How do `type:*` labels work?** Issue Types are the primary classification; `type:*` labels are automation-managed companions applied by the labeling agent for routing, reporting, and project mapping.
- **Can we add prefixes?** Yes—extend CI regex and project mapping together.

**[NEW]**

- **What if a branch is incorrectly named?** CI will block the PR from merging; rename the branch and re-open the PR.
- **How do I handle urgent fixes outside business hours?** Use `hotfix/`, notify the team via Slack/Teams, and ensure all protections are respected.

---

## 10. References

- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md): Org-wide branch naming, merge discipline, and automation mapping.
- [CHANGELOG.md](../CHANGELOG.md): Changelog format, release notes, and versioning.
- [CONTRIBUTING.md](../CONTRIBUTING.md): Contribution guidelines, templates, and coding standards.
- [GITHUB_PROJECT_OPERATIONS_SPEC.md](./GITHUB_PROJECT_OPERATIONS_SPEC.md): Org-wide project operations, labeling, and release guidance.
- [ISSUE_TYPES.md](./ISSUE_TYPES.md): Issue type mapping and usage.
- [LABELING.md](./LABELING.md): Consolidated label documentation (issue, PR, and discussion labeling).
  - [Issue labelling](./LABELING.md#issue-labelling): Issue label requirements and automation.
  - [Pull request labelling](./LABELING.md#pull-request-labelling): PR label requirements and automation.
- [.github/custom-instructions.md](../.github/custom-instructions.md): Copilot and agent instructions.
- [instructions/linting.instructions.md](../instructions/linting.instructions.md): Linting index and tool guidance.
- [instructions/coding-standards.instructions.md](../instructions/coding-standards.instructions.md): Coding standards index.
- [instructions/documentation-formats.instructions.md](../instructions/documentation-formats.instructions.md): Frontmatter schema and conventions.
- [GitHub Custom Instructions](https://github.com/lightspeedwp/.github/blob/HEAD/.github/custom-instructions.md): Org-wide guidance and AI agent usage.
- [Pull Request Template](https://github.com/lightspeedwp/.github/blob/HEAD/.github/pull_request_template.md): PR summary and best practices.

---

## 11. Appendix: Getting Started

1. Create or update org-level `.github` defaults (workflows, labeler, protections).
2. Sync labels using `gh label` or `.github/labels.yml`.
3. Add branch protection rules to every repo.
4. Share this policy in repo README and onboarding documentation.
5. Enforce via CI and maintain with regular review.

---

## 12. Advanced Practices & Troubleshooting

- For monorepos, coordinate releases and branch protection across all workspaces.
- If CI blocks a merge due to naming, run `git branch -m <old> <new>` locally, then push and re-open PR.
- Use [GitHub Branch Protection API](https://docs.github.com/en/rest/branches/branch-protection) for automation.
- Escalate persistent issues to Engineering leads via issue or Slack.

---

## 13. Onboarding & Training

- New contributors must review this document and complete onboarding modules.
- Include branch naming and merge training in onboarding sessions.
- Add cheat sheets and workflow diagrams to internal wiki.

---

## 14. Related Documentation

- [**BRANCH_CLEANUP.md**](./BRANCH_CLEANUP.md) — Detailed procedures for identifying and safely removing stale, merged branches
- [**MAINTENANCE.md**](./MAINTENANCE.md) — Comprehensive repository maintenance hub with monthly calendar and procedures
- [**PR_CREATION_PROCESS.md**](./PR_CREATION_PROCESS.md) — Pull request workflow and merge discipline
- [**CONTRIBUTING.md**](../CONTRIBUTING.md) — Contributor guidelines and branch responsibilities

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

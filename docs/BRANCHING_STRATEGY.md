---
file_type: documentation
title: Org-wide Git Branching Strategy
description: Canonical branch naming, protection, merge discipline, and automation rules for LightSpeedWP repositories.
version: v1.5.2
last_updated: '2026-08-21'
status: active
stability: stable
domain: governance
owners:
  - LightSpeed Team
tags:
  - branching
  - git
  - governance
  - ci
---

# Org-wide Git Branching Strategy

Primary operations reference: [GITHUB_PROJECT_OPERATIONS_SPEC.md](./GITHUB_PROJECT_OPERATIONS_SPEC.md)

**Status:** This document describes policies enforced across all LightSpeedWP repositories. Implementations tracked in [.github/workflows/](.github/workflows/) and [docs/](./docs/).

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
- `schemas/` — DB/schema changes
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
schemas/add-index-orders-created
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

### 4.1 Two-Layer Enforcement Strategy

LightSpeed `.github` repository implements a **two-layer enforcement system** combining local pre-commit validation and remote GitHub Actions checks:

**Layer 1: Local Pre-Commit Hook** (optional, recommended)

- Validates branch names before each commit (instant feedback)
- Skips main/develop to avoid trapping release workflows
- Skips detached HEAD state (rebase, merge, bisect operations)
- Installation: `npm run setup:hooks`
- See [SETUP_BRANCH_VALIDATION.md](./SETUP_BRANCH_VALIDATION.md) for detailed setup

**Layer 2: GitHub Actions PR Validation** (mandatory)

- Enforces naming rules on every pull request
- Blocks PR merge if branch name is invalid
- Posts detailed comment with naming rules and examples
- Exempts `release/*` and `hotfix/*` branches on `main` (required for release flow)

### 4.2 Validation Pattern

Strict kebab-case pattern with three components:

```regex
^(feat|fix|hotfix|release|refactor|chore|docs|test|perf|ci|build|deps|security|revert|research|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry|content|seo|config|migrate|qa|uat|audit|codex)/([a-z0-9]+(?:-[a-z0-9]+)*)-([a-z0-9]+(?:-[a-z0-9]+)*)$
```

- **Type**: One of 30+ allowed prefixes (lowercase)
- **Scope**: Lowercase kebab-case, no underscores or uppercase
- **Title**: Lowercase kebab-case, no underscores or uppercase
- **Separators**: Hyphens only (no underscores, dots, or spaces)

**Examples:**

✓ Valid:

- `feat/branch-naming-enforcement`
- `fix/validation-script-bug`
- `chore/update-dependencies`
- `release/v1-0-0`

✗ Invalid:

- `claude/my-branch` (type not allowed)
- `feat/MyFeature` (uppercase not allowed)
- `feat/my_feature` (underscores not allowed)
- `fix-bug` (missing type prefix)

### 4.3 Implementation Details

**Validation Script** (`scripts/validation/validate-branch-name.cjs`):

- Node.js CLI tool for branch name validation
- Supports: `--verbose`, `--show-pattern`, `--branch <name>` flags
- Exportable function for use in hooks and workflows
- Comprehensive unit tests (82 tests, >95% coverage)

**Workflow File** (`.github/workflows/branch-name-validation.yml`):

- Triggered on PR open/reopen/synchronize events
- Creates/updates check runs for PR enforcement
- Posts failure comments with helpful guidance
- Exempts release/*and hotfix/* on main

**Setup Command** (`npm run setup:hooks`):

- Installs pre-commit hook to `.git/hooks/`
- Works on macOS, Linux, and Windows (Git Bash)
- One-time setup per repository clone

### 4.4 Human and Agent Branch Discipline

- Validate branch relevance before the first edit.
- If the current branch belongs to a different issue, PR, or task, create a new branch from `develop` before making changes.
- Do not reuse in-flight branches for unrelated work, even when the working tree is already open.
- If unrelated local changes are present, use a clean worktree rather than mixing scopes.
- Temporary audit replay branches may use the form `pr-<number>-audit` (exempted from pattern validation).

### 4.5 Troubleshooting

If a PR is blocked due to invalid branch name:

1. **Rename locally:** `git branch -m <old-name> <new-name>`
2. **Force push:** `git push -u origin <new-name> --force-with-lease`
3. **Update PR:** Close the old PR and open a new one from the renamed branch

See [SETUP_BRANCH_VALIDATION.md - Troubleshooting](./SETUP_BRANCH_VALIDATION.md#troubleshooting) for detailed solutions.

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
        "^schemas/.*",
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
- `proto/`, `api/`, `schemas/`, `telemetry/`, `ds/` → Feature/Task
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
| `schemas/` | `pr_feature.md` |
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
   - Creates `ops/post-release-sync-main-to-develop` branch.
   - Merges `main` → `develop` to keep branches synchronized.
   - Developer merges the sync PR.

**Authorization gating:**

- Only `workflow_dispatch` and `workflow_call` trigger events allowed.
- Actor must be member of `maintainers` team.
- Unauthorized attempts logged in `trigger-telemetry.json`; workflow fails immediately.
- See [Release Process](./RELEASE_PROCESS.md#authorization-gating) for full details.

### 7.2 Mergify Sequential Queue

Mergify manages the merge queue **sequentially** to prevent conflicts and ensure safety:

**How Sequential Processing Works:**

1. **First PR enters queue** → CI checks run (all checks in place)
2. **While first PR testing** → other PRs wait in queue
3. **First PR finishes CI** → if all pass, auto-rebase + merge
4. **Base branch updated** → second PR auto-rebases
5. **Second PR CI runs** → cycle repeats

**Why Sequential?**

GitHub's branch protection requires branches to be "up to date" before merge. Sequential processing ensures:

- ✅ Branches stay up-to-date (auto-rebase)
- ✅ No conflicts when merging
- ✅ Explicit CI re-validation after rebase
- ✅ Safety: merge only if all checks still pass

**Configuration** (in `.github/mergify.yml`):

```yaml
merge_queue:
  max_parallel_checks: 1  # One PR in CI at a time
  merge_method: squash    # Use squash commits
  batch_size: 1           # Process one at a time
```

**Monitoring Mergify:**

```bash
# Check queue status
gh pr list --search "is:open" --json title,number

# Check PR comments for Mergify diagnostics
gh pr comments <number> | grep -i mergify
```

**Important:** Do not manually rebase or push while your PR is in the queue — Mergify handles rebasing automatically. If conflicts arise, Mergify will notify you in comments.

See [RELEASE_PROCESS.md#mergify-sequential-queue](./RELEASE_PROCESS.md#mergify-sequential-queue) for full details.

### 7.3 Stacked PR Workflow

Release PRs use a **stacked workflow**: PR #1 merges first, then PR #2 automatically creates and stacks on top:

**Timeline:**

```
Time T:     Feature work integrated to develop
Time T+5:   Developer triggers release.yml workflow
Time T+10:  Release agent creates release/vX.Y.Z branch
Time T+15:  PR #1 created (release/vX.Y.Z → develop)
Time T+20:  Developer reviews & merges PR #1 to develop
Time T+25:  [AUTOMATIC] PR #2 created (release/vX.Y.Z → main)
Time T+30:  Developer reviews & merges PR #2 to main
Time T+35:  GitHub Release published
Time T+40:  [AUTOMATIC] Post-sync PR created (main → develop)
Time T+45:  Developer merges post-sync PR
```

**PR #1: Version Bump to develop**

- Branch: `release/vX.Y.Z`
- Target: `develop`
- Contents: Version bump + CHANGELOG.md update
- Review: Verify versions and changelog entries
- Approval: 1 maintainer
- Merge: Squash merge

**PR #2: Release to main** (stacked on PR #1)

- Branch: `release/vX.Y.Z`
- Target: `main`
- Contents: Same as PR #1 (already merged to develop)
- Review: Verify release notes compilation
- Approval: Depends on scope (patch: auto, minor: 1, major: 2)
- Merge: Squash merge
- Post-merge: GitHub Release published, tag created

**Post-sync: Keep Branches In Sync**

- Branch: `ops/post-release-sync-main-to-develop`
- Target: `develop`
- Contents: Merge main → develop to prevent divergence
- Approval: 1 maintainer (optional review)
- Merge: Merge commit (preserves history)

See [RELEASE_PROCESS.md#phase-1-portable-release-agent](./RELEASE_PROCESS.md#phase-1-portable-release-agent) for step-by-step Phase 1 execution.

### 7.4 Hotfix Flow

Hotfixes are urgent production fixes merged directly to `main` (bypass develop):

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

### 7.5 Release Branch Naming & Lifecycle

**Naming Convention:**

Use semantic versioning with optional prerelease suffix:

- ✅ `release/v1.0.0` — Major release
- ✅ `release/v1.1.0` — Minor release
- ✅ `release/v1.0.1` — Patch release
- ✅ `release/v1.0.0-beta` — Pre-release
- ❌ `release/1.0.0` — Missing 'v' prefix
- ❌ `release/version-1.0` — Non-semver

**Branch Lifecycle:**

```
1. Agent creates release/vX.Y.Z from develop
   ↓
2. PR #1 (release → develop) created & merged
   ↓
3. PR #2 (release → main) created & merged
   ↓
4. Tag vX.Y.Z created on main
   ↓
5. GitHub Release published
   ↓
6. Branch release/vX.Y.Z deleted (post-merge)
   ↓
7. Post-sync PR (main → develop) merged
```

**Cleanup:**

Release branches are **deleted automatically** after PR merge (per branch protection settings). Manual cleanup rarely needed:

```bash
# Delete local branch
git branch -d release/v1.0.0

# Delete remote branch (if needed)
git push origin --delete release/v1.0.0
```

**Important:** Never delete a release branch manually while PRs are still open — wait for both PR #1 and PR #2 to merge first.

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

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

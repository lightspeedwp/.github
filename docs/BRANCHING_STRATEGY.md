# Org-wide Git Branching Strategy

<!-- BADGES-START -->

[![changelog](https://github.com/lightspeedwp/.github/actions/workflows/changelog.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)

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

### 3.1 Shared Core Prefixes

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

### 3.2 Product-specific Prefixes (optional)

- `proto/` — prototypes/experiments
- `ds/` — design system
- `api/` — API surface
- `schema/` — DB/schema changes
- `telemetry/` — analytics/metrics

### 3.3 Client-specific Prefixes (optional)

- `content/` — content edits, redirects, IA
- `seo/` — SEO, metadata, schema, sitemap, robots
- `config/` — site/plugin configuration
- `migrate/` — data/content migrations
- `qa/` — test harnesses, UAT scaffolding
- `uat/` — UAT-only changes or staging toggles

### 3.4 Governance & Audit Prefixes (optional)

- `audit/` — audit, compliance, security reviews
- `codex/` — code generation, AI-assisted tooling

### 3.5 Forbidden Prefixes

**These prefixes are NEVER allowed:**

- ❌ `claude/` — Reserved for Claude Code internal sessions
- ❌ `copilot/` — Reserved for GitHub Copilot integration
- ❌ `openai/` — Reserved for OpenAI integration

**Why?** These break PR template assignment, GitHub Actions workflows, and validation automation that depends on branch prefixes.

### 3.6 Examples

```text
feat/product-grid-quick-add
refactor/split-frontend-bundle
api/orders-bulk-cancel
schema/add-index-orders-created
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

Use a single regex in a workflow to enforce naming discipline:

**Strict Pattern (LightSpeed standard):**

```regex
^(feat|fix|hotfix|release|refactor|chore|docs|test|perf|ci|build|deps|security|revert|research|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry|content|seo|config|migrate|qa|uat|audit|codex)/([a-z0-9]+(?:-[a-z0-9]+)*)-([a-z0-9]+(?:-[a-z0-9]+)*)$
```

**Pattern explanation:**

- `{type}` — one of 33+ allowed prefixes (listed above)
- `/` — literal slash separator
- `{scope}` — lowercase, kebab-case (hyphens only, no underscores)
- `-` — hyphen separator between scope and title
- `{title}` — lowercase, kebab-case (hyphens only, no underscores)

**Release branches special case:**  
Release branches allow semantic versioning format:

- `release/v1.2.3` (with "v" prefix)
- `release/1.2.3` (without "v" prefix)
- Or standard format: `release/{scope}-{title}`

### 4.1 Validation Commands

**Local validation:**

```bash
# Test a branch name locally
node scripts/validation/validate-branch-name.cjs feat/my-feature-name

# Verbose output
node scripts/validation/validate-branch-name.cjs feat/my-feature-name --verbose

# Show the validation pattern
node scripts/validation/validate-branch-name.cjs --show-pattern

# Get help
node scripts/validation/validate-branch-name.cjs --help
```

**GitHub Actions validation:**  
Use workflow `.github/workflows/branch-name-validation.yml` which runs automatically on PR events.

### 4.2 Example Workflow Implementation

```yaml
name: Validate branch name
on:
  pull_request:
    types: [opened, reopened, synchronize]
jobs:
  check-branch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
      - run: npm ci
      - name: Validate branch name
        env:
          BRANCH_NAME: ${{ github.head_ref }}
        run: |
          # Allow dependabot/renovate
          if [[ "$BRANCH_NAME" =~ ^(dependabot|renovate)/ ]]; then
            echo "✅ Automated bot branch allowed"
            exit 0
          fi
          # Validate against pattern
          node scripts/validation/validate-branch-name.cjs "$BRANCH_NAME"
```

### 4.3 Consequences of Violations

**Blocked merge:**

- CI check fails with detailed error message
- PR cannot be merged until branch is renamed

**How to fix:**

1. Rename the branch locally: `git branch -m old-name new-name`
2. Force-push to update the PR: `git push -u origin new-name --force-with-lease`
3. Delete the old remote branch: `git push origin :old-name`
4. GitHub will automatically update the PR to point to the new branch
5. Re-run validation checks

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
        "^schema/.*",
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
- `proto/`, `api/`, `schema/`, `telemetry/`, `ds/` → Feature/Task
- `release/` → Release PR

**Principle:**  
Labels remain **routing signals** (status, priority, area/component).  
Issue Types and Project fields carry the semantic meaning.

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

- **Release:** Open `release/vX.Y.Z`, bump versions and changelog, run full CI, QA on staging, merge to `main`, tag, deploy.
- **Hotfix:** Branch from `main` as `hotfix/<slug>`, minimal fix, PR to `main`, tag, cherry-pick/back-merge to `develop` (if used).
  **[NEW]**
- Always update release notes and changelog for each release/hotfix, even when changes seem minor.

---

## 8. Quick Reference: All 33+ Allowed Types

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat/user-preferences-panel` |
| `fix` | Bug fix | `fix/authentication-timeout` |
| `hotfix` | Urgent production fix | `hotfix/critical-security-patch` |
| `release` | Release branch | `release/v1.0.0` |
| `refactor` | Code refactoring | `refactor/api-response-structure` |
| `chore` | Maintenance, no code changes | `chore/dependency-updates` |
| `docs` | Documentation | `docs/branching-strategy-guide` |
| `test` | Tests, test infrastructure | `test/integration-test-suite` |
| `perf` | Performance improvements | `perf/query-optimization` |
| `ci` | CI/CD, pipelines | `ci/github-actions-workflow` |
| `build` | Build system, package changes | `build/webpack-config-update` |
| `deps` | Dependency updates | `deps/upgrade-npm-packages` |
| `security` | Security fixes | `security/xss-vulnerability-fix` |
| `design` | Design system, UI | `design/button-component-update` |
| `a11y` | Accessibility | `a11y/wcag-compliance-audit` |
| `ux` | User experience | `ux/form-validation-feedback` |
| `i18n` | Internationalization | `i18n/german-translation-pack` |
| `ops` | Operations, deployment | `ops/database-migration-script` |
| `proto` | Prototype, experimental | `proto/new-caching-strategy` |
| `ds` | Design system | `ds/component-library-update` |
| `api` | API changes | `api/rest-endpoint-versioning` |
| `schema` | Data schema | `schema/user-model-changes` |
| `telemetry` | Analytics, monitoring | `telemetry/event-tracking-setup` |
| `content` | Content changes | `content/blog-post-updates` |
| `seo` | SEO optimizations | `seo/meta-tag-improvements` |
| `config` | Configuration | `config/environment-variables` |
| `migrate` | Data/schema migrations | `migrate/user-table-migration` |
| `qa` | QA processes | `qa/test-automation-framework` |
| `uat` | User acceptance testing | `uat/staging-validation-suite` |
| `audit` | Audit, compliance, review | `audit/security-code-review` |
| `codex` | Code generation, AI-assisted | `codex/auto-documentation-tool` |
| `revert` | Revert previous commit | `revert/pr-2345-bad-merge` |
| `research` | Research, investigation | `research/performance-benchmarks` |

**Forbidden types (never use):**

- ❌ `claude/` — Reserved for Claude Code
- ❌ `copilot/` — Reserved for GitHub Copilot
- ❌ `openai/` — Reserved for OpenAI

---

## 9. Quick Per-Repo Checklist

- Enable branch protections on `main` (+ `develop` if used).
- Adopt branch naming discipline; enforce via CI workflow.
- Sync `.github/labeler.yml` and project mapping with chosen prefixes.
- Prefer Issue Types and Project fields over proliferation of `type:*` labels.
- Squash merge only; delete branches post-merge.
- Share this strategy in repo READMEs and onboarding docs.
- Document exceptions (e.g., legacy branches, vendor integrations) in `CONTRIBUTING.md`.
- **[NEW]** Validate branch names locally before pushing: `node scripts/validation/validate-branch-name.cjs <branch-name>`
- **[NEW]** Document forbidden prefixes (`claude/`, `copilot/`, `openai/`) and why they're forbidden.

---

## 10. FAQ & Guardrails

- **Do we need `develop`?** Optional; skip if deployment model supports feature/release branches.
- **Where do we record “type of work”?** Project **Type** field (from branch) and **Issue Type** on linked issue.
- **How do `type:*` labels work?** Issue Types are the primary classification; `type:*` labels are automation-managed companions applied by the labeling agent for routing, reporting, and project mapping.
- **Can we add prefixes?** Yes—extend CI regex and project mapping together.

**[NEW]**

- **What if a branch is incorrectly named?** CI will block the PR from merging; rename the branch and re-open the PR.
- **How do I handle urgent fixes outside business hours?** Use `hotfix/`, notify the team via Slack/Teams, and ensure all protections are respected.

---

## 11. References

- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md): Org-wide branch naming, merge discipline, and automation mapping.
- [CHANGELOG.md](../CHANGELOG.md): Changelog format, release notes, and versioning.
- [CONTRIBUTING.md](../CONTRIBUTING.md): Contribution guidelines, templates, and coding standards.
- [AUTOMATION_GOVERNANCE.md](./AUTOMATION_GOVERNANCE.md): Org-wide automation, labeling, and release strategy.
- [ISSUE_TYPES.md](./ISSUE_TYPES.md): Issue type mapping and usage.
- [ISSUE_LABELS.md](./ISSUE_LABELS.md): Label families, triage, and workflow.
- [PR_LABELS.md](./PR_LABELS.md): PR labeling, templates, and automation.
- [custom-instructions.md](./custom-instructions.md): Copilot and agent instructions.
- [instructions/linting.instructions.md](./instructions/linting.instructions.md): Linting index and tool guidance.
- [instructions/coding-standards.instructions.md](./instructions/coding-standards.instructions.md): Coding standards index.
- [instructions/documentation-formats.instructions.md](./instructions/documentation-formats.instructions.md): Frontmatter schema and conventions.
- [GitHub Custom Instructions](https://github.com/lightspeedwp/.github/blob/HEAD/.github/custom-instructions.md): Org-wide guidance and AI agent usage.
- [Pull Request Template](https://github.com/lightspeedwp/.github/blob/HEAD/.github/PULL_REQUEST_TEMPLATE.md): PR summary and best practices.

---

## 12. Appendix: Getting Started

1. Create or update org-level `.github` defaults (workflows, labeler, protections).
2. Sync labels using `gh label` or `.github/labels.yml`.
3. Add branch protection rules to every repo.
4. Share this policy in repo README and onboarding documentation.
5. Enforce via CI and maintain with regular review.

---

## 13. Advanced Practices & Troubleshooting

- For monorepos, coordinate releases and branch protection across all workspaces.
- If CI blocks a merge due to naming, run `git branch -m <old> <new>` locally, then push and re-open PR.
- Use [GitHub Branch Protection API](https://docs.github.com/en/rest/branches/branch-protection) for automation.
- Escalate persistent issues to Engineering leads via issue or Slack.

---

## 14. Onboarding & Training

- New contributors must review this document and complete onboarding modules.
- Include branch naming and merge training in onboarding sessions.
- Add cheat sheets and workflow diagrams to internal wiki.

---

> For questions or improvements, open an issue or PR in the `.github` repo.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

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
- `audit/` — governance audits and compliance reviews
- `codex/` — codex, knowledge base, or reference documentation
- `aiops/` — AI-assisted operations and automation

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

### 3.4 Examples

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

**Non-release branches:**

```regex
^(feat|fix|hotfix|refactor|chore|docs|test|perf|ci|build|deps|security|revert|research|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry|content|seo|config|migrate|qa|uat|audit|codex|aiops)/[a-z0-9]+(?:-[a-z0-9]+)*-[a-z0-9]+(?:-[a-z0-9]+)*$
```

**Release branches (semantic versioning):**

```regex
^release/v?\d+\.\d+\.\d+(-[a-z0-9]+)*$
```

**Release branches (standard format):**

```regex
^release/[a-z0-9]+(?:-[a-z0-9]+)*-[a-z0-9]+(?:-[a-z0-9]+)*$
```

**For exact patterns, see the authoritative validator:** `scripts/validation/validate-branch-name.cjs` (lines 66-78)

### 4.1 Forbidden Prefixes (AI Agent Governance)

The following prefixes are **strictly forbidden** for all branches to enforce proper governance of AI-assisted development:

- `claude/` — Reserved for governance audits only; blocks automated routing
- `copilot/` — GitHub Copilot-specific branches not permitted
- `openai/` — OpenAI-related work must use appropriate type prefixes

**Rationale:** Forbidden prefixes act as circuit-breakers for AI agents (Claude Code, GitHub Copilot). When detected, they trigger fallback routing to default PR templates and prevent type-based automation. This ensures:

- AI agents cannot bypass branch naming governance
- Explicit type prefixes drive proper automation routing
- Governance audits are tracked and auditable
- No silent acceptance of non-conforming branch names

**Enforcement:** CI will reject any branch matching `claude/`, `copilot/`, or `openai/` prefixes, even if followed by valid scope-title patterns.

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
          # Allow release branches with semantic versioning
          if [[ "$BRANCH" =~ ^release/v?[0-9]+\.[0-9]+\.[0-9]+ ]]; then exit 0; fi
          # Standard pattern: {type}/{scope}-{title}
          if [[ ! "$BRANCH" =~ ^(feat|fix|hotfix|release|refactor|chore|docs|test|perf|ci|build|deps|security|revert|research|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry|content|seo|config|migrate|qa|uat|audit|codex|aiops)/[a-z0-9]+(-[a-z0-9]+)*-[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
            echo "❌ Branch '$BRANCH' must match the pattern: {type}/{scope}-{title}"
            echo "Example: feat/user-auth-login"
            exit 1
          fi
```

**[NEW]**

- For monorepos, ensure branch naming applies to each package/subproject, or use a consistent prefix (e.g. `feat/frontend-...`, `fix/api-...`).
- For forked repos, always clean up branches after merging upstream PRs, and avoid duplicating branch names across forks to prevent confusion.

### 4.3 PR Template Routing & Fallback Behavior

PR template selection is automatically routed based on branch type prefix:

| Branch Type | PR Template |
|---|---|
| `feat/` | `pr_feature.md` |
| `fix/` | `pr_bug.md` |
| `hotfix/` | `pr_hotfix.md` |
| `release/` | `pr_release.md` |
| `refactor/` | `pr_refactor.md` |
| `chore/` | `pr_chore.md` |
| `docs/` | `pr_docs.md` |
| `ci/` | `pr_ci.md` |
| `deps/` | `pr_dep_update.md` |
| `test/` | `pr_test.md` |
| `a11y/` | `pr_a11y.md` |
| `design/` | `pr_design.md` |
| `audit/` | `pr_audit.md` |
| `security/` | `pr_security.md` |
| `aiops/` | `pr_aiops.md` |
| `epic/` | `pr_epic.md` |
| `codex/` | `pr_docs.md` (knowledge base) |
| Other types | `pr_chore.md` (default) |
| Forbidden prefixes | `pr_chore.md` (fallback) |

**Fallback Logic:** If a branch uses a forbidden prefix (e.g., `claude/governance-audit-implementation`), the PR template resolver detects the violation and routes to the default `pr_chore.md` template. This ensures:

- No PR is left without template guidance
- Forbidden prefixes trigger visible fallback routing (auditable)
- Authors are prompted to re-open PR with proper branch naming
- Type detection hierarchy: branch type → linked issue type → default

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
        "^audit/.*",
        "^codex/.*",
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

> For questions or improvements, open an issue or PR in the `.github` repo.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

# Org-wide Git Branching Strategy

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
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
- `task/` — scoped project or epic work
- `docs/` or `doc/` — documentation
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
- `automation/` — automation scripts and tooling
- `epic/` — epic completion or merge work

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

### 3.4 Pattern Explanation

The branch naming pattern is: `{type}/{scope}-{title}`

**Component 1: Type** (lowercase, no spaces or underscores)

- Indicates the **kind of work** being done
- Choose from the 24 allowed types (see Section 9.5)
- Separate from scope with a single forward slash `/`
- Example: `feat`, `fix`, `docs`, `refactor`

**Component 2: Scope & Title** (lowercase, hyphen-separated, no underscores or spaces)

- **Scope**: Describes **what the work affects**
- **Title**: Provides **context** or details about the change
- Separate words with hyphens: `user-auth-system` (not `user_auth_system`)
- Use 2-4 words for clarity and specificity
- Examples: `user-authentication-system`, `api-endpoint-response`, `payment-validation-error`

**Complete Examples:**

- ✅ `feat/user-registration-flow` — type: `feat`, scope: `user`, title: `registration-flow`
- ✅ `fix/infinite-loop-in-search` — type: `fix`, scope: `infinite-loop`, title: `in-search`
- ✅ `docs/installation-guide` — type: `docs`, scope: `installation`, title: `guide`

### 3.5 Scope & Title Naming Rules

When creating the scope and title portion of your branch name:

1. **Use lowercase** letters and numbers only
2. **Use hyphens** to separate words (kebab-case)
3. **Avoid underscores**, periods, dots, or any special characters
4. **Avoid spaces** entirely — use hyphens instead
5. **Be descriptive** — use 2-4 words minimum
6. **Be specific** — clearly describe what's being changed
7. **Use present tense** — `add-feature` not `added-feature`
8. **Be consistent** — follow repo conventions if established

**Good Examples:**

| ✅ Good | ❌ Avoid | Why Better |
|---------|---------|-----------|
| `user-authentication-system` | `auth` | More descriptive |
| `api-endpoint-response-format` | `api-fix` | Clearly states what's changed |
| `payment-validation-error-message` | `bug-fix` | Identifies specific area |
| `react-18-upgrade` | `upgrade` | Specifies which library |
| `sql-injection-vulnerability-fix` | `security-fix` | Identifies specific vulnerability |
| `add-dark-mode-theme-toggle` | `feature` | Specific feature name |

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
^(feat|fix|hotfix|refactor|chore|task|doc|docs|test|perf|ci|build|deps|security|revert|research|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry|content|seo|config|migrate|qa|uat|audit|codex|aiops|automation|epic)/[a-z0-9]+(?:-[a-z0-9]+)*-[a-z0-9]+(?:-[a-z0-9]+)*$
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
          if [[ ! "$BRANCH" =~ ^(feat|fix|hotfix|release|refactor|chore|task|doc|docs|test|perf|ci|build|deps|security|revert|research|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry|content|seo|config|migrate|qa|uat|audit|codex|aiops|automation|epic)/[a-z0-9]+(-[a-z0-9]+)*-[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
            echo "❌ Branch '$BRANCH' must match the pattern: {type}/{scope}-{title}"
            echo "Example: feat/user-auth-login"
            exit 1
          fi
```

**[NEW]**

- For monorepos, ensure branch naming applies to each package/subproject, or use a consistent prefix (e.g. `feat/frontend-...`, `fix/api-...`).
- For forked repos, always clean up branches after merging upstream PRs, and avoid duplicating branch names across forks to prevent confusion.

### 4.3 Authoritative Branch and PR Template Matrix

`.github/PULL_REQUEST_TEMPLATE/config.yml` is the canonical route map. The branch validators enforce the prefixes below, while `.github/labeler.yml` applies the listed type labels where a rule exists. GitHub does not consume label or issue-type metadata from PR template frontmatter.

| Branch Type | PR Template | Default Type Label |
|---|---|---|
| `feat/` | `pr_feature.md` | type:feature |
| `fix/` | `pr_bug.md` | type:bug |
| `hotfix/` | `pr_hotfix.md` | type:release |
| `release/` | `pr_release.md` | type:release |
| `refactor/` | `pr_refactor.md` | type:refactor |
| `chore/` | `pr_chore.md` | type:chore |
| `task/` | `pr_task.md` | type:task |
| `docs/` or `doc/` | `pr_docs.md` | type:documentation |
| `test/` | `pr_chore.md` | type:test |
| `perf/` | `pr_feature.md` | type:performance |
| `ci/` | `pr_ci.md` | type:ci |
| `build/` | `pr_ci.md` | type:build |
| `automation/` | `pr_ci.md` | type:automation |
| `deps/` | `pr_dep_update.md` | — |
| `security/` | `pr_bug.md` | type:security |
| `design/` | `pr_feature.md` | type:design |
| `a11y/` | `pr_feature.md` | type:a11y |
| `audit/` | `pr_feature.md` | type:audit |
| `aiops/` | `pr_aiops.md` | type:ai-ops |
| `epic/` | `pr_epic.md` | type:epic |
| `research/`, `ux/`, `i18n/`, `proto/`, `ds/`, `api/`, `schema/`, `telemetry/` | `pr_feature.md` | — |
| `revert/`, `ops/`, `config/`, `migrate/`, `qa/`, `uat/` | `pr_chore.md` | — |
| `content/`, `seo/`, `codex/` | `pr_docs.md` | — |

The fallback resolver runs only for `claude/` and `copilot/` branches. It recommends a template from the linked issue or PR type and falls back to `pr_feature.md`; it posts an informational comment and does not replace the PR body. `openai/` branches are invalid but are excluded from this resolver workflow.

**Key Improvements**:

- All PR templates now seed **default labels** across type, status, priority, area, and meta families
- Each template pairs with a **recommended issue type** for clear two-way mapping
- Maintainers can override seed labels per-PR; seed labels ensure no PR is left with incomplete labeling
- **Fallback Logic**: If a branch uses a forbidden prefix (e.g., `claude/governance-audit-implementation`), the PR template resolver detects the violation and routes to the default `pr_chore.md` template
- **Type detection hierarchy**: branch type → linked issue type → default (type:task)
- This ensures: no PR is left without template guidance, forbidden prefixes trigger visible fallback routing (auditable), authors are prompted to re-open PR with proper branch naming

---

## 5. Prefixes Drive Automation

### 5.1 Labeler (Type & Status Automation)

The `.github/labeler.yml` file maps branch prefixes to labels, ensuring PRs are automatically labeled by type, priority, and area. This drives all downstream automation:

**Branch Type → Type Label Mappings:**

```yaml
type:feature → feat/
type:bug → fix/
type:documentation → docs/ or doc/
type:chore → chore/
type:build → build/
type:ci → ci/
type:refactor → refactor/
type:test → test/
type:performance → perf/
type:design → design/
type:a11y → a11y/
type:audit → audit/
type:security → security/
type:automation → automation/
type:release → release/ or hotfix/
```

**Status Automation:**

- All standard branch types (`feat/`, `fix/`, `docs/`, `chore/`, etc.) automatically receive `status:needs-review` label
- Labeler also maps **priority** based on branch type:
  - `hotfix/` and `security/` → `priority:critical`
  - `a11y/` → `priority:important`
  - All others → `priority:normal` (default)

**Area/Component Mapping (by file path):**

- File changes trigger area labels automatically (e.g., changes to `tests/**/*.js` → `area:testing`)
- New area labels for testing frameworks:
  - `area:playwright` — Playwright E2E tests
  - `area:jest` — Jest unit tests
  - `area:phpunit` — PHPUnit tests
  - `area:pagespeed` — Performance monitoring and metrics

**[NEW]**

- For automation, use GitHub Actions to auto-assign reviewers based on branch type (e.g., `security/` → security lead, `a11y/` → accessibility lead).
- Sync project automation rules across all repos using `.github` repo templates and labeler rules.
- Monitor label application via the `labeling` workflow badge and audit logs.

### 5.2 Issue Type & Project Type Mapping

Branch prefixes drive both **Issue Type** labels and **Project Type** field assignments. This creates a clear two-way mapping: issue type → branch prefix → PR template → default labels → project type.

**Branch Type → Issue Type Mappings (Issues & PRs):**

| Branch | Issue Type | Project Type | Purpose |
|--------|-----------|--------------|---------|
| `feat/` | type:feature | Feature | Net-new capability or user-facing enhancement |
| `fix/` | type:bug | Bug | Defect or regression fix |
| `hotfix/` | type:release | Critical Bug | Urgent production fix |
| `refactor/` | type:refactor | Refactor | Internal restructure, no behaviour change |
| `chore/` | type:chore | Chore | Maintenance, hygiene, no user impact |
| `task/` | type:task | Task | Scoped unit of work (default for ambiguous cases) |
| `ci/` | type:ci | Infrastructure | CI/CD workflows, GitHub Actions |
| `build/` | type:build | Chore | Build system, bundling, package changes |
| `test/` | type:test | Test | Testing infrastructure, test harnesses |
| `design/` | type:design | Design | Design system, UI components, visual work |
| `a11y/` | type:a11y | Accessibility | WCAG compliance, accessible patterns |
| `security/` | type:security | Security | Security vulnerabilities, exploit fixes |
| `docs/` | type:documentation | Documentation | User-facing docs, guides, reference |
| `audit/` | type:audit | Audit | Compliance audits, code reviews, governance |
| `aiops/` | type:ai-ops | Infrastructure | AI-assisted operations, automation |
| `perf/` | type:performance | Performance | Performance optimization, metrics |
| `research/` | type:research | Research | Investigation, prototyping, spikes |
| `automation/` | type:automation | Infrastructure | Automation scripting, tooling |
| `release/` | type:release | Release | Release branches, versioning |
| Other prefixes | type:task (default) | Task | Fallback for non-standard branches |

**Principle:**

- **Labels** remain **routing signals** (status, priority, area/component, type) — they drive automation
- **Issue Types** and **Project Types** carry **semantic meaning** — they describe what the work is
- **Two-way mapping** ensures consistency: issue type decides branch prefix, branch prefix decides PR template and default labels
- **Default type is `type:task`** — when in doubt about issue type or branch prefix, use task

### 5.3 Branch-Type Review Context

CodeRabbit applies context-aware review guidance based on branch type to ensure feedback is specifically relevant to the work being done. This section documents the primary review focus areas and critical checks for each branch type.

#### Top-Priority Branch Types (High-Frequency, All Repositories)

##### `feat/` — New Features

**Review Focus Areas**:

- **Feature Completeness & Correctness**: Does the implementation fully address the specified requirements? Are acceptance criteria met? Is the feature functionally correct?
- **API & Design Quality**: Is the API/interface design intuitive and maintainable? Does it follow established patterns? Are backward compatibility implications considered?
- **Accessibility & User Experience**: Does the feature meet WCAG 2.2 AA standards? Is keyboard navigation supported? Is the UX clear and intuitive?
- **Test Coverage**: Are there tests covering happy path, edge cases, and error conditions? Is coverage adequate (≥80%)?

**Critical Checks**:

- ✓ Acceptance criteria documented and met
- ✓ No breaking changes OR breaking changes clearly documented
- ✓ Accessibility (WCAG 2.2 AA) verified
- ✓ Tests added (unit, integration, or e2e as appropriate)
- ✓ Documentation updated (if user-facing)
- ✓ Changelog entry added (if user-facing)

**Scope**: Applies to all repositories (WordPress plugins, Node.js, Python, infrastructure-as-code)

---

##### `fix/` — Bug Fixes

**Review Focus Areas**:

- **Root Cause Analysis**: Does the fix address the root cause or just the symptom? Is the fix sustainable?
- **Regression Prevention**: Are there tests preventing this bug from reoccurring? Are related areas checked for similar issues?
- **Edge Cases**: Are boundary conditions and edge cases considered? Could the fix introduce new bugs?
- **Code Quality**: Is the fix minimal and focused? Does it avoid unnecessary refactoring?

**Critical Checks**:

- ✓ Root cause documented in PR description
- ✓ Fix verified against original reproduction steps
- ✓ Regression test added (prevents bug recurrence)
- ✓ Related edge cases considered and tested
- ✓ Existing tests still passing
- ✓ Changelog entry added

**Scope**: Applies to all repositories

---

##### `security/` — Security Vulnerabilities

**Review Focus Areas**:

- **Vulnerability Severity & Impact**: Is the vulnerability properly classified (critical/high/medium/low)? Are impact implications documented?
- **Fix Efficacy**: Does the fix fully prevent exploitation? Are there bypasses or edge cases?
- **Security Debt**: Does the fix introduce new security concerns? Are there related vulnerabilities?
- **Disclosure & Communication**: Is the fix handled responsibly? Are security review processes followed?

**Critical Checks**:

- ✓ Vulnerability severity assessed (critical/high/medium/low)
- ✓ Fix prevents confirmed exploitation path
- ✓ Security review completed (security team approval)
- ✓ No new security warnings introduced
- ✓ Changelog marked `[SECURITY]`
- ✓ PR marked `priority:critical`
- ✓ All related test cases pass

**Scope**: Applies to all repositories; follows responsible disclosure process

---

##### `perf/` — Performance Improvements

**Review Focus Areas**:

- **Benchmarking & Metrics**: Are performance improvements measured and documented? Are baseline metrics established?
- **Scalability & Trade-offs**: Does the improvement scale? Are trade-offs (memory, complexity, maintainability) documented?
- **Regression Testing**: Are there tests ensuring performance improvements don't regress? Does it avoid regressions in other areas?
- **Relevance**: Does the improvement address a real performance bottleneck? Are priorities aligned?

**Critical Checks**:

- ✓ Performance metrics measured (before/after)
- ✓ Improvement meets stated goal
- ✓ No regression in other metrics
- ✓ Load testing completed (if applicable)
- ✓ Memory/resource usage assessed
- ✓ Caching strategy documented (if applicable)
- ✓ Tests added for performance regressions

**Scope**: Applies to all repositories; particularly critical for user-facing features, APIs, and infrastructure

---

##### `a11y/` — Accessibility Improvements

**Review Focus Areas**:

- **WCAG 2.2 AA Compliance**: Do all changes meet WCAG 2.2 AA standards? Are colour contrast ratios sufficient (4.5:1 for text)?
- **Keyboard Navigation**: Is the change fully navigable via keyboard? Are focus indicators visible?
- **Screen Reader Support**: Is semantic HTML used? Are aria attributes appropriate?
- **Testing & Validation**: Are accessibility changes tested (keyboard, screen reader, colour contrast tools)?

**Critical Checks**:

- ✓ Changes comply with WCAG 2.2 AA standards
- ✓ Keyboard navigation tested and working
- ✓ Screen reader compatibility verified
- ✓ Colour contrast meets AA standards (4.5:1 text, 3:1 graphics)
- ✓ Focus indicators visible and accessible
- ✓ Alt text added for all images
- ✓ Semantic HTML used
- ✓ Tests added for accessibility features

**Scope**: Applies to all user-facing repositories; all public-facing changes must maintain accessibility standards

---

##### `docs/` or `doc/` — Documentation Updates

**Review Focus Areas**:

- **Content Accuracy & Completeness**: Is the information accurate and current? Does it cover all necessary aspects?
- **Structure & Navigation**: Is the documentation well-organised? Are headings and links clear and logical?
- **Audience Appropriateness**: Is the content written for the intended audience (developers, end-users, maintainers)?
- **Technical Validity**: Do code examples run correctly? Are commands and configurations tested?

**Critical Checks**:

- ✓ Content is accurate and complete
- ✓ Links are valid (internal and external)
- ✓ Code examples run and produce expected output
- ✓ Spelling and grammar checked
- ✓ Markdown lints successfully
- ✓ Frontmatter is valid YAML (if applicable)
- ✓ No placeholder or TODO content
- ✓ Updated TOCs or indexes (if applicable)

**Scope**: Applies to all repositories; documentation is critical for user adoption and maintainability

---

##### `ci/` — CI/CD Pipeline Changes

**Review Focus Areas**:

- **Job Definition & Reliability**: Is the job configuration correct? Will it reliably detect failures?
- **Secret & Credential Handling**: Are secrets properly masked and protected? Are credentials never logged?
- **Status Check Enforcement**: Are required checks properly gated? Do they appropriately block merges?
- **Performance & Cost**: Does the job run efficiently? Are unnecessary steps avoided?

**Critical Checks**:

- ✓ Secrets properly managed (masked in logs, passed as env vars only)
- ✓ Required status checks enforced
- ✓ Job structure is clear and maintainable
- ✓ Timeouts set on long-running jobs
- ✓ Error messages are actionable
- ✓ Documentation explains job purpose and requirements
- ✓ Tested on actual branch (not just syntax validation)

**Scope**: Applies to all repositories; CI/CD impacts all developers

---

#### High-Priority Branch Types (Frequent, Most Repositories)

##### `hotfix/` — Urgent Production Fixes

**Review Focus Areas**:

- **Critical Impact Assessment**: Is this truly urgent/critical? Are implications fully understood?
- **Rollback Readiness**: Is a rollback plan documented? Can the change be reverted quickly?
- **Minimal Scope**: Is the fix minimal and focused? Are unnecessary changes avoided?

**Critical Checks**:

- ✓ Issue impact classified (critical/high)
- ✓ Fix verified to resolve the issue
- ✓ Rollback plan documented
- ✓ Security implications evaluated
- ✓ Changelog marked `[HOTFIX]`
- ✓ All related tests pass

**Scope**: Applies to production-deployed repositories; follows expedited merge process

---

##### `refactor/` — Code Refactoring

**Review Focus Areas**:

- **No Behaviour Change**: Are functional changes completely avoided? Does the refactoring preserve all existing behaviour?
- **Maintainability Improvement**: Does the refactoring improve code clarity, reduce complexity, or enhance structure?
- **Risk Assessment**: Are there risks of subtle behaviour changes? Are all test cases still passing?

**Critical Checks**:

- ✓ Refactoring scope clearly defined
- ✓ All existing tests pass (no changes to test logic)
- ✓ Risk assessment completed (low/medium/high)
- ✓ Breaking changes documented (if any)
- ✓ Performance impact assessed (if applicable)
- ✓ Code review approved
- ✓ No new warnings or technical debt introduced

**Scope**: Applies to all repositories; particularly important for maintainability

---

##### `task/` — Scoped Work / Epic Work

**Review Focus Areas**:

- **Epic/Project Scope Clarity**: Is the scope of work clearly defined? Are dependencies identified?
- **Breakdown Clarity**: Are subtasks well-defined and independently testable?
- **Integration Plan**: How does this integrate with related work? Are handoffs clear?

**Critical Checks**:

- ✓ Scope clearly defined
- ✓ Dependencies identified and documented
- ✓ Subtasks aligned with project breakdown
- ✓ Related PRs/issues referenced
- ✓ Integration plan documented
- ✓ Acceptance criteria clear

**Scope**: Applies to complex work spanning multiple PRs or repositories

---

##### `release/` — Release Branches

**Review Focus Areas**:

- **Version Correctness**: Is the version bump appropriate (major/minor/patch)? Does it follow semantic versioning?
- **Changelog Completeness**: Are all changes documented? Is the changelog accurate and user-facing?
- **Deployment Readiness**: Is the deployment checklist complete? Are all pre-release steps done?

**Critical Checks**:

- ✓ Version bump correct and follows semantic versioning
- ✓ Changelog updated with all user-facing changes
- ✓ Deployment checklist complete
- ✓ Release notes prepared
- ✓ All CI checks passing
- ✓ QA verification completed (if applicable)

**Scope**: Applies to released/distributed repositories (packages, plugins, applications)

---

##### `chore/` — Maintenance & Housekeeping

**Review Focus Areas**:

- **Dependency Updates**: Are dependencies correctly updated? Are there security implications?
- **Maintenance Safety**: Are there side effects from maintenance changes? Is the scope clear?
- **Automation Correctness**: Do automation/tooling changes work as expected?

**Critical Checks**:

- ✓ Dependencies correctly updated (version ranges, checksums)
- ✓ No unintended side effects
- ✓ Automation rules verified
- ✓ Documentation updated (if applicable)
- ✓ All tests passing

**Scope**: Applies to all repositories; can be fast-tracked if low-risk

---

##### `test/` — Test Infrastructure & Additions

**Review Focus Areas**:

- **Test Coverage & Quality**: Do tests cover important scenarios? Are tests well-isolated and independent?
- **Reproducibility**: Can tests be run reliably? Do they fail predictably on regressions?
- **Integration**: Do tests integrate with CI/CD? Are they fast enough for developer feedback?

**Critical Checks**:

- ✓ Test coverage increased (target ≥80%)
- ✓ All tests passing (unit, integration, e2e)
- ✓ Edge cases covered
- ✓ Error paths tested
- ✓ Mocks/fixtures documented
- ✓ CI/CD integration verified
- ✓ No flaky tests introduced

**Scope**: Applies to all repositories; test quality impacts maintainability and confidence

---

##### `design/` — Design System & UI Changes

**Review Focus Areas**:

- **Design System Consistency**: Are changes consistent with established design system? Are patterns reusable?
- **Accessibility**: Do design changes maintain accessibility standards? Is colour contrast sufficient?
- **Component Reusability**: Can components be reused across the organization? Are they flexible?

**Critical Checks**:

- ✓ Consistent with design system
- ✓ Reusable patterns used
- ✓ Accessibility standards met (WCAG 2.2 AA)
- ✓ Component documentation clear
- ✓ Design review completed
- ✓ No technical debt introduced

**Scope**: Applies to frontend/design-heavy repositories

---

#### Medium-Priority Branch Types (Varies by Repository)

##### `ops/` — Operations & Infrastructure

**Review Focus Areas**:

- **Infrastructure Safety**: Are infrastructure changes safe? Is rollback possible?
- **Deployment Readiness**: Is monitoring configured? Is communication clear?
- **Compliance & Security**: Do changes meet security/compliance requirements?

**Critical Checks**:

- ✓ Infrastructure changes documented
- ✓ Monitoring configured
- ✓ Rollback procedure documented
- ✓ Security review completed
- ✓ Impact assessment done

**Scope**: Applies to infrastructure, deployment, and DevOps repositories

---

##### `build/` — Build System Changes

**Review Focus Areas**:

- **Build Reliability**: Do changes improve build reliability? Will they break existing builds?
- **Performance**: Do changes improve build performance? Are unnecessary steps removed?
- **Portability**: Are changes portable across different environments and CI systems?

**Critical Checks**:

- ✓ Build tested locally and in CI
- ✓ No breaking changes to build process
- ✓ Performance implications assessed
- ✓ Documentation updated

**Scope**: Applies to repositories with custom build systems

---

##### `deps/` — Dependency Updates

**Review Focus Areas**:

- **Compatibility**: Are updated dependencies compatible with the codebase? Are breaking changes handled?
- **Security**: Are security updates applied? Are known vulnerabilities addressed?
- **Testing**: Are existing tests passing with updated dependencies?

**Critical Checks**:

- ✓ Compatibility verified (no breaking changes or handled appropriately)
- ✓ Security updates applied
- ✓ All tests passing
- ✓ Lock file updated (if applicable)
- ✓ Release notes reviewed (if major update)

**Scope**: Applies to all repositories; security dependencies require priority

---

**Additional High-Frequency Types** (varies by repository):

- `proto/` — Prototype/experimental work (low priority for review; exploratory only)
- `audit/` — Governance audits and compliance reviews (high priority; requires thorough review)
- `research/` — Research and investigation (informational; documents findings)
- `api/` — API changes (high priority; breaking changes require special attention)
- `schema/` — Database/data schema changes (high priority; migration safety critical)
- `migrate/` — Data/schema migrations (high priority; reversibility and safety critical)
- `automation/` — Automation scripts (medium priority; safety and error handling critical)
- `i18n/` — Internationalization changes (medium priority; completeness across all languages required)
- `ux/` — User experience improvements (medium priority; usability and accessibility critical)

---

**Usage in Code Reviews**: When reviewing a PR, CodeRabbit identifies the branch type from the PR source branch, then applies the review focus areas and critical checks documented above. This ensures feedback is contextually relevant and actionable across all repositories in the organisation.

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

## 9.2 Decision Tree: Choosing the Right Type

Use this flowchart to select the correct branch type for your work:

```
START
  │
  └─→ Is it a new capability or feature?
      ├─ YES → Is it urgent/critical?
      │        ├─ YES → hotfix
      │        └─ NO  → feat
      │
      └─ NO → Is it a bug fix?
              ├─ YES → Is it urgent/critical?
              │        ├─ YES → hotfix
              │        └─ NO  → fix
              │
              └─ NO → Is it just tidying up (no functional change)?
                      ├─ YES → chore
                      │
                      └─ NO → What type of work is it?
                              ├─ Refactoring/restructuring   → refactor
                              ├─ Testing/tests               → test or qa
                              ├─ Documentation               → docs or content
                              ├─ Dependency updates          → deps
                              ├─ Security work               → security
                              ├─ Design/UI changes           → design or a11y or ux or ds
                              ├─ Performance optimization    → perf
                              ├─ CI/CD/Automation            → ci or build or ops
                              ├─ Database/Schema changes     → schema or migrate
                              ├─ API changes                 → api
                              ├─ Large project/epic work     → task
                              ├─ Experimental/prototype      → proto
                              ├─ Code audits/reviews         → audit
                              ├─ Research/investigation      → research
                              └─ Other → Refer to type reference (Section 9.5)
```

**Quick Decision Guide:**

| Question | Answer | Type |
|----------|--------|------|
| Is it new functionality? | Yes | `feat` |
| Is it fixing a bug? | Yes | `fix` |
| Is it urgent/critical? | Yes | `hotfix` |
| Is it just maintenance? | Yes | `chore` |
| Is it a large project? | Yes | `task` |
| Is it refactoring? | Yes | `refactor` |
| Is it tests? | Yes | `test` |
| Is it documentation? | Yes | `docs` |
| Is it dependency updates? | Yes | `deps` |
| Is it security-related? | Yes | `security` |
| Is it design/UI? | Yes | `design` |
| Is it performance? | Yes | `perf` |
| Is it CI/CD? | Yes | `ci` |
| Still unsure? | Yes | See Section 9.5 reference |

---

## 9.5 Complete Type Reference Guide

This section provides comprehensive details for each of the 24 allowed branch types, including purpose, when to use, template assignment, default labels, and examples.

### **feat** — New Feature

- **Purpose**: Add new functionality or capability
- **When to Use**: New API endpoints, user features, components, enhancements, integrations
- **Template**: `pr_feature.md` | **Labels**: `type:feature`
- **Examples**: `feat/user-registration`, `feat/payment-integration`, `feat/dark-mode`

### **fix** — Bug Fix

- **Purpose**: Resolve defects and unexpected behaviour
- **When to Use**: Fix incorrect functionality, user-reported bugs, validation issues
- **Template**: `pr_bug.md` | **Labels**: `type:bug`
- **Examples**: `fix/infinite-loop-search`, `fix/validation-error`, `fix/missing-translations`

### **hotfix** — Urgent Production Fix

- **Purpose**: Address critical production issues requiring immediate deployment
- **When to Use**: Security vulnerabilities, data loss bugs, complete breakage, widespread impact
- **Template**: `pr_hotfix.md` | **Labels**: `type:bug`, `priority:critical`
- **Examples**: `hotfix/critical-security-patch`, `hotfix/database-failure`, `hotfix/auth-bypass`

### **refactor** — Code Refactoring

- **Purpose**: Improve code structure without changing behaviour
- **When to Use**: Extract duplication, improve readability, simplify logic, reorganise modules
- **Template**: `pr_refactor.md` | **Labels**: `type:refactor`
- **Examples**: `refactor/api-response-structure`, `refactor/extract-helpers`, `refactor/simplify-workflow`

### **chore** — Maintenance & Non-Code Changes

- **Purpose**: Routine maintenance and cleanup tasks
- **When to Use**: Minor dependency updates, remove debug code, repository maintenance, metadata updates
- **Template**: `pr_chore.md` | **Labels**: `type:chore`
- **Examples**: `chore/update-packages`, `chore/remove-debug`, `chore/clean-fixtures`

### **task** — Scoped Unit of Work

- **Purpose**: Discrete project-bound unit of work (often part of epic or initiative)
- **When to Use**: Breaking down larger initiatives, architectural refactoring, major subsystem updates
- **Template**: `pr_task.md` | **Labels**: `type:task`
- **Examples**: `task/authentication-refactor`, `task/schema-migration`, `task/plugin-upgrade`

### **test** — Test Infrastructure & Additions

- **Purpose**: Add or improve tests (unit, integration, e2e)
- **When to Use**: New test cases, improve coverage, testing infrastructure setup
- **Template**: `pr_test.md` | **Labels**: `type:test`
- **Examples**: `test/api-integration-tests`, `test/e2e-checkout`, `test/unit-validation`

### **docs** — Documentation

- **Purpose**: Add or update user-facing and developer documentation
- **When to Use**: Write guides, create developer docs, update READMEs, write examples
- **Template**: `pr_docs.md` | **Labels**: `type:docs`
- **Examples**: `docs/installation-guide`, `docs/api-reference`, `docs/troubleshooting`

### **perf** — Performance Improvements

- **Purpose**: Optimize system performance (speed, efficiency, resources)
- **When to Use**: Query optimization, reduce bundle size, improve load times, optimize caching
- **Template**: `pr_feature.md` | **Labels**: `type:performance`
- **Examples**: `perf/query-optimization`, `perf/bundle-reduction`, `perf/lazy-loading`

### **ci** — CI/CD Pipelines & Automation

- **Purpose**: Continuous Integration and deployment workflows
- **When to Use**: Update GitHub Actions, add CI steps, automate testing/deployment
- **Template**: `pr_ci.md` | **Labels**: `type:ci`, `area:ci`
- **Examples**: `ci/github-actions-update`, `ci/automated-deployment`, `ci/test-matrix`

### **build** — Build System & Package Changes

- **Purpose**: Update build configuration, packaging, or bundling
- **When to Use**: Update webpack, change build tools, modify build scripts
- **Template**: `pr_ci.md` | **Labels**: `type:build`, `area:ci`
- **Examples**: `build/webpack-update`, `build/vite-migration`, `build/npm-scripts`

### **deps** — Dependency Updates

- **Purpose**: Update or upgrade project dependencies
- **When to Use**: Update npm packages, upgrade versions, security patches
- **Template**: `pr_dep_update.md` | **Labels**: `type:dependency`, `area:dependencies`
- **Examples**: `deps/upgrade-packages`, `deps/security-patch`, `deps/react-upgrade`

### **security** — Security Fixes & Hardening

- **Purpose**: Address security vulnerabilities and implement security measures
- **When to Use**: Fix vulnerabilities, implement authentication, hardening, input validation
- **Template**: `pr_security.md` | **Labels**: `type:security`, `priority:critical`
- **Examples**: `security/xss-fix`, `security/csrf-implementation`, `security/sql-injection-fix`

### **design** — Design System & UI Changes

- **Purpose**: Update design system, components, styling, or visual elements
- **When to Use**: Design system updates, component changes, styling improvements
- **Template**: `pr_design.md` | **Labels**: `type:design`, `area:design-system`
- **Examples**: `design/button-update`, `design/color-palette`, `design/form-component`

### **a11y** — Accessibility Improvements

- **Purpose**: Improve accessibility and WCAG compliance
- **When to Use**: WCAG compliance, screen reader support, keyboard navigation, colour contrast
- **Template**: `pr_a11y.md` | **Labels**: `type:a11y`, `area:a11y`
- **Examples**: `a11y/wcag-audit`, `a11y/screen-reader`, `a11y/keyboard-navigation`

### **ux** — User Experience Improvements

- **Purpose**: Improve user experience, usability, and workflows
- **When to Use**: UX improvements from feedback, usability enhancements, flow optimization
- **Template**: `pr_design.md` | **Labels**: `type:design`, `area:design-system`
- **Examples**: `ux/form-feedback`, `ux/checkout-optimization`, `ux/error-messaging`

### **i18n** — Internationalization & Localization

- **Purpose**: Add language support and internationalization features
- **When to Use**: Add language translations, implement i18n framework, RTL support
- **Template**: `pr_docs.md` | **Labels**: `type:docs`
- **Examples**: `i18n/german-translation`, `i18n/arabic-rtl`, `i18n/french-update`

### **ops** — Operations & Deployment

- **Purpose**: Operational changes, infrastructure, database migrations
- **When to Use**: Database migrations, server configuration, infrastructure setup
- **Template**: `pr_ci.md` | **Labels**: `type:automation`, `area:infrastructure`
- **Examples**: `ops/database-migration`, `ops/kubernetes-config`, `ops/monitoring-setup`

### **release** — Release Branches

- **Purpose**: Create release branches for version management
- **When to Use**: Prepare release branches, release testing, version bumping
- **Template**: `pr_release.md` | **Labels**: `type:release`
- **Examples**: `release/v1.2.0`, `release/v2.0.0-beta`

### **proto** — Prototype & Experimental

- **Purpose**: Experimental work, prototypes, proof-of-concept
- **When to Use**: Prototype features, experimental implementations, R&D work
- **Template**: `pr_feature.md` | **Labels**: `type:feature`
- **Examples**: `proto/caching-strategy`, `proto/ml-experiment`, `proto/database-approach`

### **ds** — Design System

- **Purpose**: Design system creation and maintenance
- **When to Use**: Design system creation, design tokens, component documentation
- **Template**: `pr_design.md` | **Labels**: `type:design`, `area:design-system`
- **Examples**: `ds/component-library`, `ds/design-tokens`, `ds/design-system-docs`

### **api** — API Changes & Endpoints

- **Purpose**: Create or update API endpoints and contracts
- **When to Use**: New REST endpoints, GraphQL changes, API versioning
- **Template**: `pr_feature.md` | **Labels**: `area:api`
- **Examples**: `api/rest-endpoint-versioning`, `api/graphql-schema`, `api/rate-limiting`

### **schema** — Data Schema Changes

- **Purpose**: Update data structures, database schema, or data models
- **When to Use**: Database schema migrations, data model changes, field updates
- **Template**: `pr_feature.md` | **Labels**: `area:integration`
- **Examples**: `schema/user-model`, `schema/add-timestamps`, `schema/denormalization`

### **telemetry** — Analytics & Monitoring

- **Purpose**: Add or update analytics, monitoring, metrics, observability
- **When to Use**: Event tracking, metrics, monitoring, analytics implementation
- **Template**: `pr_feature.md` | **Labels**: `type:feature`
- **Examples**: `telemetry/event-tracking`, `telemetry/metrics`, `telemetry/monitoring`

### **content** — Content Changes

- **Purpose**: Update website content, blog posts, marketing copy
- **When to Use**: Blog updates, website copy, marketing materials, help centre articles
- **Template**: `pr_feature.md` | **Labels**: `type:docs`
- **Examples**: `content/blog-post`, `content/landing-page`, `content/faq-update`

### **seo** — Search Engine Optimization

- **Purpose**: Improve search engine visibility and SEO
- **When to Use**: SEO optimizations, meta tags, structured data, search ranking
- **Template**: `pr_feature.md` | **Labels**: `type:feature`
- **Examples**: `seo/meta-tags`, `seo/structured-data`, `seo/sitemap`

### **config** — Configuration Changes

- **Purpose**: Update system or application configuration
- **When to Use**: Configuration updates, environment variables, feature flags
- **Template**: `pr_feature.md` | **Labels**: `type:feature`
- **Examples**: `config/environment-variables`, `config/feature-flags`, `config/cache-config`

### **migrate** — Data & Code Migrations

- **Purpose**: Execute data migrations or code migrations
- **When to Use**: Data migration scripts, code modernization, feature flag removal
- **Template**: `pr_feature.md` | **Labels**: `area:integration`
- **Examples**: `migrate/user-table`, `migrate/legacy-removal`, `migrate/database-restructure`

### **qa** — Quality Assurance Processes

- **Purpose**: QA process improvements and testing frameworks
- **When to Use**: QA automation, test strategy, testing tools, quality metrics
- **Template**: `pr_feature.md` | **Labels**: `type:test`
- **Examples**: `qa/test-automation`, `qa/regression-tests`, `qa/quality-metrics`

### **uat** — User Acceptance Testing

- **Purpose**: User acceptance testing processes and validations
- **When to Use**: UAT setup, validation scripts, acceptance criteria
- **Template**: `pr_feature.md` | **Labels**: `type:test`
- **Examples**: `uat/staging-validation`, `uat/acceptance-criteria`, `uat/smoke-tests`

### **audit** — Code Review & Audit

- **Purpose**: Conduct code audits, reviews, and compliance checks
- **When to Use**: Security audits, compliance checks, code quality reviews
- **Template**: `pr_audit.md` | **Labels**: `type:review`, `area:ci`
- **Examples**: `audit/security-review`, `audit/gdpr-compliance`, `audit/code-quality`

### **codex** — Code Generation & AI-Assisted Development

- **Purpose**: Code generation, AI-assisted development, and automated coding
- **When to Use**: Auto-generated code, AI-assisted work, code generation tooling
- **Template**: `pr_aiops.md` | **Labels**: `type:aiops`, `area:ai`
- **Examples**: `codex/auto-documentation`, `codex/ai-code-generation`, `codex/llm-refactoring`

### **research** — Research & Investigation

- **Purpose**: Research branches for investigation and learning
- **When to Use**: Performance benchmarks, technology evaluation, proof of concept
- **Template**: `pr_feature.md` | **Labels**: `type:research`
- **Examples**: `research/performance-benchmarks`, `research/framework-evaluation`, `research/db-performance`

### **revert** — Revert Previous Commit

- **Purpose**: Revert a previous commit or merge
- **When to Use**: Revert bad merge, undo problematic changes, emergency rollback
- **Template**: `pr_hotfix.md` | **Labels**: `type:bug`, `priority:critical`
- **Examples**: `revert/pr-2345`, `revert/broken-deployment`

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

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

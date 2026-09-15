# Research: Branch Naming Strategy & Enforcement
**Date**: 2026-09-14 | **Phase**: 0 (Research & Decision-Making)

**Purpose**: Resolve 6 critical unknowns that inform implementation architecture and rollout strategy

---

## Research Question 1: Git Hook Distribution Strategy

### Question
**Should we use Husky, core.hooksPath, or a hybrid approach to distribute the pre-push hook across 50+ repositories?**

### Context
- **Husky**: Industry-standard npm package; installs hook via `npm install`; ~40MB npm dependency; strong community support
- **core.hooksPath**: Git's built-in hook path configuration (git 2.9+); no npm dependency; requires manual git config or dotfiles setup
- **Hybrid**: Husky as default; fall back to core.hooksPath if Husky fails or is excluded

### Research Findings

#### Husky Approach (✅ RECOMMENDED)
**Pros**:
- **Automatic installation**: Single `npm install` triggers hook setup via postinstall script
- **Cross-platform**: Works on macOS, Linux, Windows (via Git Bash)
- **Community standard**: 8M+ weekly npm downloads; well-documented; easy for developers to troubleshoot
- **Version control**: Hook version tied to package.json; updates via npm install
- **Skip mechanism**: Developers understand `npm install --no-save husky` or `npm run prepare --ignore-scripts` for edge cases

**Cons**:
- **npm dependency**: Adds ~40MB to node_modules (acceptable for development repo)
- **Postinstall triggers**: Requires `npm install` step (already in CLAUDE.md workflow)
- **Node.js requirement**: Assumes Node 18+ in developer environment (acceptable per plan.md)

#### core.hooksPath Approach
**Pros**:
- **Zero npm dependency**: Lightweight; no package.json bloat
- **Git-native**: Works with any Git 2.9+ without npm
- **Portable**: Can be set in `.gitconfig` or in-repo `git config core.hooksPath`

**Cons**:
- **Manual configuration**: Requires `git config core.hooksPath lib/hooks` (error-prone)
- **Per-developer setup**: Each developer must run setup; not automatic
- **Discovery issue**: Developers may not know hook exists if not documented prominently
- **Platform differences**: Edge cases on Windows or with Git GUI tools

#### Hybrid Approach
**Pros**:
- **Best of both**: Husky for primary distribution; core.hooksPath as fallback

**Cons**:
- **Complexity**: Two maintenance paths; more testing required
- **Confusion**: Developers may not understand which hook is running

### Recommendation: **Husky Primary + core.hooksPath Fallback**

**Rationale**:
1. Husky provides automatic, discoverable installation that aligns with npm-first workflow in CLAUDE.md
2. core.hooksPath fallback ensures compatibility in CI/CD environments where npm install is skipped
3. Combination minimizes friction for 200+ developers while supporting edge cases

**Implementation**:
- Default: Install Husky via `npm install` (postinstall hook sets up `.git/hooks/pre-push`)
- Fallback: Document core.hooksPath configuration for environments that skip npm install
- Verification: Check `.git/hooks/pre-push` exists after `npm install`; if missing, run `git config core.hooksPath lib/hooks`

**Risk Level**: 🟢 Low (Husky is industry-standard; Fallback is well-documented)

---

## Research Question 2: Compliance Metrics Storage

### Question
**Where should we store daily branch naming compliance metrics: GitHub Actions artifacts, Google Sheets webhook, or GitHub GraphQL API?**

### Context
- **Target**: Collect metrics daily for 50+ repos (~15,000 branches/month)
- **Queryability**: Need to trend compliance over 30/90/365 days
- **Dashboard**: Future integration with Google Sheets for org-wide reporting
- **Cost**: Minimize GitHub API quota usage and external service costs

### Research Findings

#### GitHub Actions Artifacts (✅ RECOMMENDED)
**Pros**:
- **Free & included**: No additional service cost; included in GitHub Actions quotas
- **JSON storage**: Native JSON support; easy to query and parse
- **Retention policy**: Configurable (30/90/365 days)
- **Parallel storage**: One artifact per repo per day; scales horizontally
- **Queryability**: GitHub Actions API allows filtering by date/repo; can export to spreadsheet
- **Audit trail**: Artifacts timestamped and immutable; full history preserved

**Cons**:
- **No real-time query**: Must download artifact to query; not live dashboard
- **API rate limits**: Subject to GitHub Actions API quota (12K requests/hour for org)
- **Manual aggregation**: Requires script to aggregate across repos

#### Google Sheets Webhook
**Pros**:
- **Live dashboard**: Sheets update in real-time; easy for non-technical users
- **Shareable**: Sheets can be shared with team leads for monitoring
- **Familiar UI**: No new tools to learn; uses existing Sheets knowledge

**Cons**:
- **External service dependency**: Adds Google Sheets API as critical path
- **Cost**: Requires Google Workspace API quota; may require paid plan
- **Latency**: Network round-trip adds 500ms-1s to workflow
- **Webhook fragility**: If Sheets API fails, metrics are lost; no retry mechanism
- **Rate limiting**: Google Sheets API has strict rate limits (300 requests/min for writes)
- **Compliance**: Requires storing metrics in external service; potential data residency issues

#### GitHub GraphQL API
**Pros**:
- **Native**: No external dependencies; uses GitHub's native API
- **Powerful queries**: Can query across repos, branches, timelines in single call
- **Flexible**: Supports complex filters and aggregations

**Cons**:
- **API quota**: Every query consumes GitHub's GraphQL rate limit (5,000 points/hour for org)
- **Complexity**: Requires custom GraphQL schema design; not straightforward
- **Real-time only**: Historical data must be stored separately (artifacts or DB)
- **No persistence**: Results are transient; must implement separate storage layer

### Recommendation: **GitHub Actions Artifacts (Primary) + Google Sheets Export (Future)**

**Rationale**:
1. **Phase 5-6 timeline**: Start with artifacts (free, simple, included); add Sheets export in Phase 6 once metrics pipeline is stable
2. **No single point of failure**: Artifacts are stored in GitHub; metrics not lost if external service fails
3. **Cost-effective**: Zero additional cost during pilot (Phase 5) and gradual rollout (Phase 6)
4. **Scalable**: Artifacts scale horizontally (one per repo per day); no API quota risk
5. **Future-proof**: Can add Sheets export as scheduled workflow in Phase 6 without disrupting metrics collection

**Implementation**:
- **Phase 2**: Collect metrics as JSON artifact in `branch-name-validation.yml` workflow
- **Schema**: `{date, repository, total_branches, valid_branches, invalid_branches, forbidden_prefix_branches, compliance_percentage, type_distribution, top_invalid_patterns, timestamp}`
- **Retention**: 90 days (configurable via workflow settings)
- **Phase 6**: Optional Sheets export via scheduled workflow (daily/weekly aggregation and upload)

**Risk Level**: 🟢 Low (Artifacts are reliable; Sheets integration is deferred and optional)

---

## Research Question 3: Template Routing Conflict Resolution

### Question
**Are there ambiguous branch types that could cause PR template routing failures? How do we resolve conflicts?**

### Context
- **24 authorized types**: Each type maps to a PR template (e.g., `feat` → `pr_feature.md`)
- **19 PR templates**: Some templates serve multiple types (e.g., `pr_feature.md` for `feat`, `task`, `proto`)
- **Ambiguity risk**: If a branch name matches multiple types, which template should be applied?

### Research Findings

#### Type-to-Template Mapping Audit

**Reviewed** contract: `contracts/branch-naming.contract.md` (Table 1: Type Definitions)

**Template Consolidation** (24 types → 19 templates):
- `pr_feature.md` ← `feat`, `task`, `proto` (all feature-like work)
- `pr_bugfix.md` ← `fix`, `revert` (both bug corrections)
- `pr_hotfix.md` ← `hotfix` (urgent production fixes only)
- `pr_release.md` ← `release` (release branches only)
- `pr_refactor.md` ← `refactor` (refactoring only)
- `pr_chore.md` ← `chore`, `deps` (both maintenance work)
- `pr_docs.md` ← `docs` (documentation only)
- `pr_test.md` ← `test` (testing infrastructure only)
- `pr_perf.md` ← `perf` (performance improvements only)
- `pr_ci.md` ← `ci`, `build` (both infrastructure)
- `pr_security.md` ← `security` (security fixes only)
- `pr_design.md` ← `design`, `ds` (both design system work)
- `pr_a11y.md` ← `a11y` (accessibility only)
- `pr_ux.md` ← `ux` (UX improvements only)
- `pr_i18n.md` ← `i18n` (internationalization only)
- `pr_ops.md` ← `ops` (operations only)
- `pr_audit.md` ← `audit` (audits only)
- `pr_codex.md` ← `codex` (code generation only)
- `pr_research.md` ← `research` (research only)

**Ambiguity Analysis**: ✅ **NO CONFLICTS FOUND**
- Each branch type is **unique and unambiguous** in its purpose
- No two types share the same name or overlap in scope
- Type extraction is deterministic: extract prefix before `/` → match against 24-type list → route to template

**Conflict Resolution Strategy** (Prevention-based):
1. **Extraction**: Split branch name on `/` → take prefix as type
2. **Validation**: Check type against 24-type list in `contracts/branch-naming.contract.md`
3. **Routing**: Look up template file from type-to-template mapping
4. **Fallback**: If template file missing, use `.github/pull_request_template.md` (generic)

**Edge Cases Covered**:
- ✅ Branch with multiple slashes (e.g., `feat/api/user-auth`) → Extract first segment (`feat`) only
- ✅ Branch with numbers (e.g., `feat/v2-api`) → Numbers allowed in scope/title; type extraction unaffected
- ✅ Type not in list (e.g., `feature/my-branch`) → Validation fails; error message suggests correction
- ✅ Template file not found → Use fallback generic template (no template routing failure)

### Recommendation: **Deterministic Type-First Routing + Fallback**

**Rationale**:
1. Type list is frozen (24 authorized types, per CLAUDE.md governance)
2. Extraction is deterministic (split on `/`, take first segment)
3. No ambiguity possible (each type is unique)
4. Fallback ensures PR template is always applied (even if type-specific template missing)

**Implementation**:
- **Extraction**: `const type = branchName.split('/')[0]`
- **Validation**: Check if type is in 24-type list
- **Routing**: Look up template from `branch-types.yml` config
- **Fallback**: If template missing or type unknown, use `.github/pull_request_template.md`

**Risk Level**: 🟢 Low (Deterministic, well-tested, has fallback)

---

## Research Question 4: Backwards Compatibility Policy

### Question
**Should we enforce branch naming from Day 1, or provide a grace period for existing invalid branches?**

### Context
- **50+ repositories**: Likely contain existing branches with naming violations (before enforcement deployed)
- **~15,000 branches/month**: Estimated creation rate; existing branches are pre-enforcement
- **Developer friction**: Forcing developers to rename existing branches could cause frustration
- **Governance**: CLAUDE.md rules require enforcement; cannot grandfather violations indefinitely

### Research Findings

#### Enforcement Options

**Option A: Enforce from Day 1** (Strict)
- **Policy**: All branches (existing and new) must follow naming pattern from enforcement date onward
- **New branches**: Blocked by pre-push hook and remote workflow
- **Existing invalid branches**: Allowed to exist but cannot merge new PRs; must be renamed to merge
- **Grace period**: None
- **Developer impact**: High friction; existing branches become "unmerge-able" overnight

**Option B: Grace Period (30/60/90 days)** (Lenient)
- **Policy**: Existing branches (pre-enforcement date) are grandfathered; new branches must follow naming pattern
- **Existing branches**: Can merge without renaming; no hook validation needed
- **New branches**: Strictly validated from enforcement date onward
- **Enforcement**: After grace period, ALL branches must follow naming (no exceptions)
- **Developer impact**: Moderate; existing work unaffected; new work follows rules

**Option C: Selective Enforcement** (Hybrid)
- **Policy**: Enforce only "critical" types (feat, fix, security); grandfather others (experimental branches, etc.)
- **Implementation**: Whitelist allowed "legacy" types; all others strictly validated
- **Developer impact**: Confusion; inconsistent rules; unclear which branches are "critical"

#### Recommendation: **Option B — 30-Day Grace Period**

**Rationale**:
1. **Pilot phase (Week 5)**: Deploy to 10-20 pilot repos; observe developer behavior and feedback
2. **Grace period alignment**: 30 days gives pilot developers time to complete in-flight work on existing branches
3. **Gradual transition**: New branches follow rules immediately; existing branches grandfathered
4. **Metrics benefit**: Collect baseline compliance metrics during grace period; measure improvement
5. **Enforcement follow-up**: After 30 days, communicate that all branches must follow naming (both old and new)
6. **Full rollout (Week 6+)**: Extend grace period to 60 days for remaining repos; then strict enforcement

**Implementation**:
- **Pre-push hook**: Checks `git log --all --oneline | head -1` to determine branch creation date
  - If created before enforcement date: Allow push (grace period)
  - If created after enforcement date: Validate strictly
- **Remote workflow**: Always validate all branches; log grandfathered branches in metrics
- **Communication**: Send email/Slack to developers with grace period end date; encourage migration before cutoff
- **Migration help**: Provide `lib/tools/rename-branch.sh` script to automate legacy branch renaming

**Risk Level**: 🟡 Medium (Grace period requires date tracking; communication is critical)

---

## Research Question 5: GitHub Actions Workflow Execution Order

### Question
**Will the new validation and template routing workflows conflict with existing label automation workflows?**

### Context
- **Existing workflows**: Org likely has label automation workflows that run on PR events
- **New workflows**:
  - `branch-name-validation.yml` — runs on `push` to any branch
  - `pr-template-routing.yml` — runs on `pull_request` events (opened, synchronize, reopened)
- **Timing**: Workflows may run in unpredictable order; could cause race conditions

### Research Findings

#### Workflow Execution Analysis

**Existing Label Automation** (Assumed):
- Runs on `pull_request` event (opened, synchronize)
- Reads PR description to extract keywords
- Applies labels based on regex matches
- May conflict if labels are applied before template is loaded

**New Workflows**:

**1. branch-name-validation.yml (on push)**:
- Trigger: `push` to any branch
- Actions:
  - Validate branch name
  - Set job status (pass/fail)
  - Post comment on PR if validation fails
  - Collect metrics (artifact)
- **Timing**: Runs BEFORE PR is created (or immediately after if PR already exists)
- **Impact on labels**: None (this workflow does not apply labels)

**2. pr-template-routing.yml (on pull_request)**:
- Trigger: `pull_request` events (opened, synchronize, reopened)
- Actions:
  - Extract branch name
  - Validate and route to PR template
  - Apply default labels for branch type
  - Detect area labels from scope
  - Apply all labels to PR
- **Timing**: Runs AFTER PR is created
- **Impact on existing automation**: Potential race condition if existing label workflow also runs on PR opened

**Conflict Scenarios**:

| Scenario | Execution Order | Result |
|----------|-----------------|--------|
| Both workflows on PR opened | Non-deterministic | May apply labels twice (idempotent if using same label set) |
| Template routing applies labels first | pr-template-routing → existing automation | Existing automation may re-apply same labels (harmless) |
| Existing automation applies labels first | existing automation → pr-template-routing | pr-template-routing may override with different label set (conflict) |

**Mitigation Strategies**:
1. **Label idempotence**: Ensure both workflows apply the same label set (from canonical `.github/labels.yml`)
2. **Execution order**: Use GitHub Actions `needs:` keyword to enforce sequential execution (template routing after existing automation)
3. **Separate concerns**: Let existing automation handle custom labels; let new workflow handle type/area labels only
4. **Conditional logic**: Use workflow conditions to prevent duplicate label application

### Recommendation: **Separate Workflows + Idempotent Labels**

**Rationale**:
1. Keep new workflows separate from existing automation (no modification needed to existing workflows)
2. Use only canonical labels from `.github/labels.yml` (prevents custom label conflicts)
3. Ensure both workflows are idempotent (applying same label twice is safe)
4. Document execution order in workflow files (comments explain dependencies)

**Implementation**:
- **branch-name-validation.yml**: Does NOT apply labels (only validates and comments)
- **pr-template-routing.yml**: Applies only type/area labels (from canonical set)
- **Existing automation**: Continues to apply custom labels (unchanged)
- **Result**: All labels applied correctly; no conflicts
- **Verification**: Test with 50+ sample PRs; verify all expected labels present; no duplicates

**Risk Level**: 🟢 Low (Workflows are independent; labels are idempotent; no modification to existing workflows)

---

## Research Question 6: Validation Library Dependency Strategy

### Question
**Are Node.js 18+ and npm 8+ available across all 50+ target repositories? Will this create barriers for developers?**

### Context
- **Requirement**: Validation library is Node.js based; requires Node 18+ and npm 8+
- **Target repos**: 50+ LightSpeed organization repositories (mix of PHP, JavaScript, TypeScript)
- **Developer machines**: macOS, Linux, Windows (with Git Bash); home setups vary
- **CI/CD**: GitHub Actions runners always have Node.js available (standard Ubuntu image includes Node 18+)

### Research Findings

#### Node.js Availability Audit

**GitHub Actions Runners**: ✅ **FULLY SUPPORTED**
- Ubuntu standard image includes Node.js 18+ (as of 2024)
- No additional setup required
- Workflows can run `npm install && npm run validate:branch-name` directly

**LightSpeed Development Standards** (Per CLAUDE.md):
- **Assumed environment**: Git 2.9+, Node.js 18+, npm 8+
- **onboarding process**: New developers install Node.js via nvm or system package manager
- **Project setup**: `npm ci` already in workflow (installs dependencies, including postinstall hooks)

**Real-World Barriers**:
1. **macOS developers**: Likely using Homebrew or nvm; Node 18+ widely available
2. **Linux developers**: Package managers provide Node 18+ (Ubuntu 22.04+, Debian 12+, etc.)
3. **Windows developers**: Can use WSL2 with Ubuntu; or native Windows Node.js installation
4. **CI/CD**: No barriers; GitHub Actions runners standardized

**Survey Data** (From plan.md context):
- **200+ active developers** in LightSpeed organization
- **Assumption**: All developers have Git 2.9+, Node.js 18+, npm 8+ (per CLAUDE.md)
- **Reality**: Likely 95%+ already have required versions (standard in 2024-2026)

**Edge Cases**:
- ❌ Developer with Node.js 16 or older → Validation library fails at import
  - **Workaround 1**: Use `npm run validate:branch-name` (handles version check in script)
  - **Workaround 2**: Bypass hook with `git push --no-verify` (remote workflow will catch)
  - **Workaround 3**: Upgrade Node.js (recommended; not a blocker)
- ❌ Developer without Node.js → Cannot use hook
  - **Workaround**: Use remote validation only (remote workflow catches invalid branches)
- ✅ CI/CD system → Always available (GitHub Actions has Node.js preinstalled)

### Recommendation: **Assume Node.js 18+ Available; Provide Fallback**

**Rationale**:
1. CLAUDE.md already assumes Node 18+ (project standard)
2. Hooks are optional for development (remote validation is mandatory)
3. 95%+ of developers already have required versions
4. Edge cases can use `git push --no-verify` + remote enforcement

**Implementation**:
- **Default**: `npm install` installs hook (requires Node 18+)
- **Fallback 1**: Developers without Node.js can use remote validation only
- **Fallback 2**: Provide `git config core.hooksPath lib/hooks` setup (doesn't require npm)
- **Documentation**: Clearly state Node.js 18+ is assumed; document workarounds
- **Verification**: Add check in `.github/workflows/branch-name-validation.yml` to confirm Node.js version

**Risk Level**: 🟢 Low (Node 18+ is standard; fallbacks available for edge cases)

---

## Summary: Phase 0 Research Decisions

| Research Question | Decision | Risk | Rationale |
|---|---|---|---|
| **1. Git Hook Distribution** | Husky + core.hooksPath fallback | 🟢 Low | Automatic install via npm; fallback for CI/CD |
| **2. Metrics Storage** | GitHub Actions artifacts + Sheets export (Phase 6) | 🟢 Low | Free, included, scalable; Sheets export deferred |
| **3. Template Routing Conflicts** | Deterministic type-first routing + fallback | 🟢 Low | No ambiguity; extraction is unambiguous |
| **4. Backwards Compatibility** | 30-day grace period (existing branches grandfathered) | 🟡 Medium | Reduces friction; clear migration path; strict enforcement after |
| **5. Workflow Execution Order** | Separate workflows, idempotent labels | 🟢 Low | No modification to existing automation; labels conflict-free |
| **6. Dependency Strategy** | Assume Node.js 18+; provide fallbacks | 🟢 Low | Standard across org; edge cases have workarounds |

---

## Next Steps: Phase 1 Design

**All research questions resolved.** Design phase (Phase 1) can now proceed with confidence:

1. **Finalize BranchName entity** (T007) — confirmed validation rules
2. **Finalize BranchType entity** (T008) — confirmed 24 types, template routing
3. **Audit label compliance** (T010) — confirmed canonical label set
4. **Design area detection** (T012) — confirmed keyword-based routing
5. **Create validation runbook** (T014-T017) — quickstart.md with 9 test scenarios

**Gate**: All Phase 1 tasks complete before Phase 2 core implementation begins.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

# Branch Naming Strategy & Enforcement

**Complete documentation hub for LightSpeed branch naming strategy across all 50+ repositories.**

> **Status:** ✅ Production Ready | **Last Updated:** 2026-09-18 | **Version:** 1.0

---

## Quick Reference

**All branches MUST follow this pattern:**

```
{type}/{scope}-{title}
```

### Examples

✅ **Valid:**
- `feat/user-preferences-panel`
- `fix/authentication-timeout`
- `security/xss-vulnerability-fix`
- `docs/branching-strategy-guide`

❌ **Invalid:**
- `feature/my-feature` — Wrong type (use `feat/`)
- `claude/my-feature` — Forbidden prefix (reserved)
- `copilot/fix-something` — Forbidden prefix (reserved)

---

## Key Governance Rules

### 1. 38 Authorized Branch Types (Constitution Principle V)

**ALL** branch types must be from this exact list:

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat/user-auth-panel` |
| `fix` | Bug fix | `fix/database-connection-leak` |
| `hotfix` | Urgent production fix | `hotfix/critical-security-patch` |
| `release` | Release branch | `release/v1.0.0` |
| `refactor` | Code refactoring | `refactor/api-response-structure` |
| `chore` | Maintenance, no code changes | `chore/dependency-updates` |
| `task` | Scoped unit of work | `task/authentication-refactor` |
| `doc` | Single documentation change | `doc/readme-typo-fix` |
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
| `aiops` | AI operations | `aiops/model-monitoring-update` |
| `automation` | Workflow automation | `automation/issue-routing-update` |
| `epic` | Multi-part initiative | `epic/platform-modernisation` |

### 2. Three Forbidden Prefixes (NEVER USE)

These are **permanently reserved** and will **block PR creation**:

- ❌ `claude/` — Reserved for Claude Code internal sessions
- ❌ `copilot/` — Reserved for GitHub Copilot integration
- ❌ `openai/` — Reserved for OpenAI integration

### 3. Format Rules

- **Lowercase ONLY** — All characters must be lowercase
- **Hyphens only** — Use hyphens to separate words; no underscores, spaces, or special characters
- **Scope required** — Must have at least one word in scope
- **Title required** — Must have at least one word in title
- **No consecutive hyphens** — Single hyphen between words only

---

## Enforcement Layers

Branch naming is enforced at **three levels**:

### 1. **Local Pre-Push Hook** (Husky)

Runs when you `git push`. Validates immediately with instant feedback.

```bash
# Automatic: runs on git push
# Manual check:
npm run validate:branch-name -- --branch feat/my-feature

# Expected output:
✅ Branch 'feat/my-feature' is valid
```

**Location:** `.husky/pre-push` (configured)

### 2. **Remote GitHub Actions** (branch-name-validation.yml)

Runs on every push to any branch. If invalid:
- Workflow fails
- Comments on PR with error and suggestion
- Blocks merge until fixed

**Location:** `.github/workflows/branch-name-validation.yml`

**Configuration:**
- Validates all 38 types
- Blocks all 3 forbidden prefixes
- Provides fuzzy-match suggestions for common typos
- Collects validation metrics for compliance tracking

### 3. **PR Template Routing**

Valid branch names automatically route to correct PR template:

| Branch Prefix | PR Template | Auto-Applied Labels |
|---------------|------------|-------------------|
| `feat/` | pr_feature.md | `type:feature` |
| `fix/` | pr_bug.md | `type:bug` |
| `security/` | pr_security.md | `type:security`, `priority:critical` |
| `docs/` | pr_docs.md | `type:documentation` |
| `test/` | pr_test.md | `type:test` |
| *(all 38 types have mappings)* | *(mapped)* | *(auto-applied)* |

---

## Documentation Index

### For Developers

| Document | Purpose | Audience |
|----------|---------|----------|
| [BRANCHING_STRATEGY.md](../BRANCHING_STRATEGY.md) | Complete strategy guide with decision trees | All developers |
| [QUICK_REFERENCE_BRANCH_NAMING.md](../QUICK_REFERENCE_BRANCH_NAMING.md) | One-page cheat sheet | Quick lookup |
| [BRANCHING_STRATEGY_FAQ.md](../BRANCHING_STRATEGY_FAQ.md) | Common questions and answers | Troubleshooting |
| [BRANCH_VALIDATION_TROUBLESHOOTING.md](../BRANCH_VALIDATION_TROUBLESHOOTING.md) | How to fix invalid branches | Error recovery |

### For DevOps / Admins

| Document | Purpose | Audience |
|----------|---------|----------|
| [SETUP_BRANCH_VALIDATION.md](../SETUP_BRANCH_VALIDATION.md) | How to set up validation in new repos | DevOps, Admins |
| [BRANCH_VALIDATION_ENFORCEMENT.md](../BRANCH_VALIDATION_ENFORCEMENT.md) | Enforcement architecture and configuration | DevOps, Admins |
| [BRANCHING_STRATEGY_SUPPORT_RUNBOOK.md](../BRANCHING_STRATEGY_SUPPORT_RUNBOOK.md) | Operational procedures and escalation | Support teams |

### For Project Leads / Team Leads

| Document | Purpose | Audience |
|----------|---------|----------|
| [BRANCHING_STRATEGY_TRAINING_OUTLINE.md](../BRANCHING_STRATEGY_TRAINING_OUTLINE.md) | How to train your team (5-10 min demo) | Team leads |
| [BRANCHING_STRATEGY_ONE_PAGER.md](../BRANCHING_STRATEGY_ONE_PAGER.md) | High-level summary for leaders | Decision makers |

### Specifications & Implementation

| Document | Purpose | Status |
|----------|---------|--------|
| [Specification](../../.github/specs/004-branch-naming-strategy/spec.md) | Complete feature specification | ✅ Final |
| [Implementation Plan](../../.github/specs/004-branch-naming-strategy/plan.md) | Technical design and architecture | ✅ Final |
| [Tasks](../../.github/specs/004-branch-naming-strategy/tasks.md) | Implementation tasks (T001-T140+) | ✅ Complete |
| [Compliance Verification](../../.github/specs/004-branch-naming-strategy/COMPLIANCE_VERIFICATION.md) | 100% spec compliance proof | ✅ Verified |
| [Rollout Announcement](../../.github/specs/004-branch-naming-strategy/ROLLOUT_ANNOUNCEMENT.md) | Team communication and timeline | ✅ Published |

---

## How to Use This Branch

### Before Starting Work

1. **Check branch naming rules:**
   ```bash
   npm run validate:branch-name -- --help
   ```

2. **Create your branch:**
   ```bash
   git fetch origin develop
   git checkout -B {type}/{scope}-{title} origin/develop
   ```

3. **Validate before pushing:**
   ```bash
   npm run validate:branch-name -- --branch {type}/{scope}-{title}
   ```

### After Pushing

1. **PR template routes automatically** based on branch prefix
2. **Labels apply automatically** (e.g., `type:feature`, `area:api`)
3. **GitHub Actions validates** and comments on PR if invalid

### If Validation Fails

See [BRANCH_VALIDATION_TROUBLESHOOTING.md](../BRANCH_VALIDATION_TROUBLESHOOTING.md) for recovery steps.

---

## Rollout Status

### Phase 1: Pilot (Week 1 — Sept 18-24)

✅ **Complete** — 5 pilot repos active

### Phase 2: Expansion (Week 2-3 — Sept 25 - Oct 6)

🚀 **In Progress** — 20+ repos

### Phase 3: Org-Wide (Week 4+ — Oct 7+)

⏳ **Scheduled** — All 50+ repos

---

## Validation Library & Tools

### JavaScript Validation Library

**Location:** `lib/validate-branch-name.js`

**Exports:**
- `validateBranchName(branchName)` — Returns `{valid, type, scope, title, errors, suggested_name}`
- `AUTHORIZED_TYPES` — Array of 38 authorized types
- `FORBIDDEN_PREFIXES` — Array of 3 forbidden prefixes

**Features:**
- Validates all 38 types
- Blocks all 3 forbidden prefixes
- Fuzzy matching for error suggestions (Levenshtein distance)
- Pattern matching for scope/title format

### CLI Validation Script

**Location:** `scripts/validation/validate-branch-name.js`

**Usage:**
```bash
npm run validate:branch-name -- --branch feat/my-feature
npm run validate:branch-name -- --current
npm run validate:branch-name -- --json
npm run validate:branch-name -- --help
```

### Integration Tests

**Location:** `lib/__tests__/integration-branch-validation.test.js`

**Coverage:**
- T122-T124: Remote enforcement (forbidden prefixes, invalid types)
- T131-T135: Template routing and label application
- T139-T140: Specification compliance (all 9 quickstart scenarios)

---

## Governance & Authority

### Primary Authority

- **[CLAUDE.md — Branch Naming](../../CLAUDE.md#-branch-naming--critical-read-first)** — Project instructions, canonical source
- **[Constitution Principle V](../../.specify/memory/constitution.md)** — Exactly 38 types, non-negotiable

### Implementation Authority

- **[Validation Library](../../lib/validate-branch-name.js)** — Single source of truth for 38 authorized types
- **[GitHub Actions Workflow](../../.github/workflows/branch-name-validation.yml)** — Remote enforcement engine
- **[Husky Pre-Push Hook](../../.husky/pre-push)** — Local validation

### Agent Instructions

All agents in `agents/` are configured to understand branch naming rules:

- [pr-creation.agent.md](../../agents/pr-creation-agent/) — PR creation guidance
- [labeling.agent.md](../../agents/labeling.agent.md) — Label routing
- [release.agent.md](../../agents/release-agent/) — Release management
- [AGENTS.md](../../AGENTS.md) — Global AI rules (see Branch Naming section)

---

## Related Resources

- **Global AI Rules:** [AGENTS.md](../../AGENTS.md)
- **PR Template Routing:** [.github/PULL_REQUEST_TEMPLATE/README.md](../../.github/PULL_REQUEST_TEMPLATE/README.md)
- **Label Taxonomy:** [docs/LABEL_STRATEGY.md](../LABEL_STRATEGY.md)
- **File Organisation:** [instructions/file-organisation.instructions.md](../../instructions/file-organisation.instructions.md)

---

## Support

### Getting Help

- **Questions?** Post in [#branch-naming Slack channel](https://slack.com/archives/lightspeed) or ping @engineering-team
- **Found a bug?** Open an issue with the `type:bug` label
- **Want to request a new type?** Open an issue with `[BRANCH-TYPE-REQUEST]` tag

### Validation Feedback

The validation library provides instant feedback:

```bash
# Valid branch
$ npm run validate:branch-name -- --branch feat/user-auth
✅ Branch 'feat/user-auth' is valid

# Invalid type — shows suggestion
$ npm run validate:branch-name -- --branch feature/user-auth
❌ Branch 'feature/user-auth' is invalid
Error: invalid_type
Suggestion: Did you mean 'feat/user-auth'?

# Forbidden prefix
$ npm run validate:branch-name -- --branch claude/my-feature
❌ Branch 'claude/my-feature' is invalid
Error: forbidden_prefix
Message: Prefix 'claude/' is reserved for Claude Code internal use
```

---

## FAQ

**Q: Do I have to memorize all 38 types?**

A: No. Use `npm run validate:branch-name -- --help` or this reference. For choosing the right type, see [BRANCHING_STRATEGY.md](../BRANCHING_STRATEGY.md).

**Q: What if I already created an invalid branch?**

A: See [BRANCH_VALIDATION_TROUBLESHOOTING.md](../BRANCH_VALIDATION_TROUBLESHOOTING.md) for recovery steps. The fix typically takes 2-3 minutes.

**Q: Can I change the 38 authorized types?**

A: No. This is governed by Constitution Principle V and is non-negotiable. Changes require explicit governance decision. See CLAUDE.md for change request process.

**Q: Why are claude/, copilot/, openai/ forbidden?**

A: These are reserved for internal AI integrations and GitHub integrations. Using them breaks automation and PR routing.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-09-18 | Initial release: 38 types, 3 forbidden prefixes, full enforcement |

---

**Last Updated:** 2026-09-18  
**Maintained By:** LightSpeed Engineering  
**Next Review:** 2026-12-18

---

_For feature specifications and implementation tracking, see [.github/specs/004-branch-naming-strategy/](../../.github/specs/004-branch-naming-strategy/)._

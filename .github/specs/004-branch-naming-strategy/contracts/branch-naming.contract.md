# Contract: Branch Naming Validation Interface

**Version**: 1.0 | **Phase**: Phase 1

## Validation Rules

### Rule: ValidType
Branch type must be one of 38 authorized values (lowercase), as defined in Constitution Section VIII:

**Authorized Types**:
`feat`, `fix`, `hotfix`, `release`, `refactor`, `chore`, `task`, `doc`, `docs`, `test`, `perf`, `ci`, `build`, `deps`, `security`, `revert`, `research`, `design`, `a11y`, `ux`, `i18n`, `ops`, `proto`, `ds`, `api`, `schema`, `telemetry`, `content`, `seo`, `config`, `migrate`, `qa`, `uat`, `audit`, `codex`, `aiops`, `automation`, `epic`

**Validation**: `type =~ /^(feat|fix|hotfix|release|refactor|chore|task|doc|docs|test|perf|ci|build|deps|security|revert|research|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry|content|seo|config|migrate|qa|uat|audit|codex|aiops|automation|epic)$/`

### Rule: NoForbiddenPrefixes
Branch must NOT start with forbidden prefixes:

**Forbidden Prefixes**: `claude/`, `copilot/`, `openai/`

**Validation**: `!branch.startsWith('claude/') && !branch.startsWith('copilot/') && !branch.startsWith('openai/')`

### Rule: ValidScope
Scope must be kebab-case, 2–50 characters (per T022):

**Pattern**: `/^[a-z0-9][a-z0-9-]{0,48}[a-z0-9]$|^[a-z0-9]{2}$/`

### Rule: ValidTitle
Title must be ≥3 characters:

**Pattern**: `/.{3,}$/`

## Type-to-Template Mapping

Canonical routing (17 PR templates for 38 branch types):

| Types | Template | Category |
|-------|----------|----------|
| `feat`, `task`, `epic` | `pr_feature.md` | Feature |
| `fix`, `hotfix` | `pr_bug.md` | Maintenance |
| `security` | `pr_security.md` | Security |
| `refactor`, `chore` | `pr_refactor.md` | Code Quality |
| `doc`, `docs`, `content`, `seo` | `pr_docs.md` | Documentation |
| `test`, `qa`, `uat` | `pr_test.md` | Testing |
| `ci`, `build`, `automation` | `pr_ci.md` | CI/CD |
| `deps`, `migrate` | `pr_dep_update.md` | Dependencies |
| `audit` | `pr_audit.md` | Audit |
| `design`, `ds`, `a11y`, `ux` | `pr_design.md` | Design |
| `release` | `pr_release.md` | Release |
| `proto`, `research`, `codex` | `pr_test.md` | Experimentation |
| `api`, `schema`, `telemetry`, `config` | `pr_ci.md` | Technical |
| `ops`, `i18n` | `pr_a11y.md` | Operations |
| `perf` | `pr_refactor.md` | Performance |
| `revert` | `pr_bug.md` | Maintenance |
| `aiops` | `pr_aiops.md` | AI Operations |

## Type-to-Labels Mapping

Canonical labels (from `.github/labels.yml`) automatically applied based on branch type:

| Type | Labels |
|------|--------|
| `feat` | `type:feature`, `area:core` |
| `fix` | `type:bug`, `status:needs-triage` |
| `hotfix` | `type:bug`, `priority:critical` |
| `release` | `type:release` |
| `refactor` | `type:refactor`, `area:code-quality` |
| `chore` | `type:chore` |
| `task` | `type:task` |
| `doc` | `type:documentation`, `area:docs` |
| `docs` | `type:documentation`, `area:docs` |
| `test` | `type:test`, `area:testing` |
| `perf` | `area:performance`, `type:enhancement` |
| `ci` | `area:ci`, `area:automation` |
| `build` | `type:build`, `area:ci` |
| `deps` | `type:dependency`, `area:dependencies` |
| `security` | `type:security`, `priority:critical` |
| `design` | `type:design`, `area:design` |
| `a11y` | `type:accessibility`, `area:accessibility` |
| `ux` | `type:ux`, `area:ux` |
| `i18n` | `type:i18n`, `area:internationalization` |
| `ops` | `type:ops`, `area:operations` |
| `proto` | `type:prototype`, `area:experimentation` |
| `audit` | `type:audit`, `area:quality` |
| `codex` | `type:codex`, `area:automation` |
| `research` | `type:research`, `area:experimentation` |
| `revert` | `type:revert` |
| `ds` | `type:design`, `area:design-system` |
| `api` | `area:api`, `type:feature` |
| `schema` | `area:data-model`, `type:enhancement` |
| `telemetry` | `area:monitoring`, `type:enhancement` |
| `content` | `type:documentation`, `area:content` |
| `seo` | `type:seo`, `area:content` |
| `config` | `area:configuration`, `type:chore` |
| `migrate` | `area:database`, `type:task` |
| `qa` | `type:qa`, `area:testing` |
| `uat` | `type:uat`, `area:testing` |
| `aiops` | `type:aiops`, `area:automation` |
| `automation` | `area:automation`, `type:feature` |
| `epic` | `type:epic`, `area:core` |

---

## Branch Exemptions

The following branches are **explicitly exempt** from branch naming pattern validation:

| Branch | Reason |
|--------|--------|
| `main` | Production release branch — naming rules do not apply |
| `develop` | Integration branch for development — naming rules do not apply |
| `dependabot/*` | Automated dependency updates — handled by Dependabot, not subject to naming validation |
| `renovate/*` | Automated dependency updates (Renovate) — handled by bot, not subject to naming validation |

**Validation Logic**: Before checking branch type, exempt patterns:
1. Exact match: `main`, `develop`
2. Prefix match: `dependabot/*`, `renovate/*`
3. If exempted, skip all validation rules; proceed to PR creation with default template (`pr_feature.md`)

---

## Phase 1 Complete

Branch naming contract defined with 38 authorized types, validation rules, template routing, label auto-assignment, and branch exemptions.

# Contract: Branch Naming Validation Interface

**Version**: 1.0 | **Phase**: Phase 1

## Validation Rules

### Rule: ValidType
Branch type must be one of 24 authorized values (lowercase):

**Authorized Types**:
`feat`, `fix`, `hotfix`, `release`, `refactor`, `chore`, `task`, `docs`, `test`, `perf`, `ci`, `build`, `deps`, `security`, `design`, `a11y`, `ux`, `i18n`, `ops`, `proto`, `audit`, `codex`, `research`, `revert`

**Validation**: `type =~ /^(feat|fix|hotfix|release|refactor|chore|task|docs|test|perf|ci|build|deps|security|design|a11y|ux|i18n|ops|proto|audit|codex|research|revert)$/`

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

| Type | Template | Category |
|------|----------|----------|
| `feat`, `task` | `pr_feature.md` | Feature |
| `fix`, `hotfix` | `pr_bugfix.md` | Maintenance |
| `security` | `pr_security.md` | Security |
| `docs`, `refactor`, `chore` | `pr_maintenance.md` | Maintenance |
| `perf`, `build`, `ci`, `deps` | `pr_technical.md` | Technical |
| `design`, `a11y`, `ux` | `pr_ux.md` | UX |
| `test`, `proto`, `audit`, `research`, `codex`, `revert` | `pr_testing.md` | QA |
| `release` | `pr_release.md` | Release |
| `i18n`, `ops` | `pr_devops.md` | DevOps |

## Type-to-Labels Mapping

Canonical labels automatically applied based on branch type:

| Type | Labels |
|------|--------|
| `feat` | `type:feature`, `area:core` |
| `fix` | `type:bug`, `status:needs-triage` |
| `hotfix` | `type:bug`, `priority:critical` |
| `release` | `type:release` |
| `refactor` | `type:refactor`, `area:code-quality` |
| `chore` | `type:chore` |
| `task` | `type:task` |
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
| `proto` | `type:prototype` |
| `audit` | `type:audit`, `area:quality` |
| `codex` | `type:codex`, `area:automation` |
| `research` | `type:research` |
| `revert` | `type:revert` |

---

## Phase 1 Complete

Branch naming contract defined with 24 types, validation rules, and routing configuration.

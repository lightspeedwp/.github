# Contract: Branch Naming Validation Interface

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

**Version**: 1.0 | **Phase**: Phase 1

## Validation Rules

### Rule: ValidType

Branch type must be one of 38 authorised values (lowercase). This is the same list exported by `scripts/validation/validate-branch-name.cjs` and `scripts/validation/validate-branch-name.js`:

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

| Type | Template | Category |
|------|----------|----------|
| `feat`, `api`, `schema`, `telemetry`, `seo` | `pr_feature.md` | Feature |
| `fix` | `pr_bug.md` | Maintenance |
| `hotfix` | `pr_hotfix.md` | Maintenance |
| `security` | `pr_security.md` | Security |
| `doc`, `docs`, `content`, `i18n` | `pr_docs.md` | Documentation |
| `refactor`, `perf` | `pr_refactor.md` | Maintenance |
| `chore`, `config`, `revert` | `pr_chore.md` | Maintenance |
| `task`, `migrate` | `pr_task.md` | Task |
| `build`, `ci`, `ops`, `automation` | `pr_ci.md` | Technical |
| `deps` | `pr_dep_update.md` | Dependency |
| `design`, `ux`, `ds` | `pr_design.md` | Design |
| `a11y` | `pr_a11y.md` | Accessibility |
| `test`, `qa`, `uat` | `pr_test.md` | QA |
| `proto`, `audit`, `research` | `pr_audit.md` | Audit |
| `codex`, `aiops` | `pr_aiops.md` | AI operations |
| `epic` | `pr_epic.md` | Epic |
| `release` | `pr_release.md` | Release |

## Type-to-Labels Mapping

Canonical labels automatically applied based on branch type:

| Type | Labels |
|------|--------|
| `feat` | `type:feature`, `area:core` |
| `fix` | `type:bug`, `status:needs-triage` |
| `hotfix` | `type:bug`, `priority:critical` |
| `release` | `type:release` |
| `refactor` | `type:refactor`, `area:maintenance` |
| `chore` | `type:chore` |
| `task` | `type:task` |
| `doc` | `type:docs`, `area:documentation` |
| `docs` | `type:docs`, `area:documentation` |
| `test` | `type:test`, `area:testing` |
| `perf` | `type:performance`, `area:performance` |
| `ci` | `area:ci`, `area:automation` |
| `build` | `type:build`, `area:ci` |
| `deps` | `type:dependency`, `area:dependencies` |
| `security` | `type:security`, `priority:critical` |
| `design` | `type:design`, `area:design-system` |
| `a11y` | `type:a11y`, `area:a11y` |
| `ux` | `type:design`, `area:design-system` |
| `i18n` | `type:docs`, `area:i18n` |
| `ops` | `type:automation`, `area:infrastructure` |
| `proto` | `type:feature` |
| `ds` | `type:design`, `area:design-system` |
| `api` | `type:feature`, `area:integration` |
| `schema` | `type:feature`, `area:core` |
| `telemetry` | `type:feature`, `area:analytics` |
| `content` | `type:docs`, `area:content` |
| `seo` | `type:feature`, `area:seo` |
| `config` | `type:chore`, `area:maintenance` |
| `migrate` | `type:task`, `area:core` |
| `qa` | `type:test`, `area:testing` |
| `uat` | `type:test`, `area:testing` |
| `audit` | `type:audit`, `area:core` |
| `codex` | `type:aiops`, `area:ai` |
| `research` | `type:research` |
| `revert` | `type:chore` |
| `aiops` | `type:aiops`, `area:ai` |
| `automation` | `type:automation`, `area:automation` |
| `epic` | `type:epic` |

---

## Phase 1 Complete

Branch naming contract defined with 38 types, validation rules, and routing configuration.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

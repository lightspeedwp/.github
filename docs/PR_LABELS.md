# PR Labels

Canonical contributor-facing guide for PR metadata labels.

Primary operations reference: [GITHUB_PROJECT_OPERATIONS_SPEC.md](./GITHUB_PROJECT_OPERATIONS_SPEC.md)

## Source of Truth

- `.github/labels.yml`
- `.github/labeler.yml`
- `.github/issue-types.yml`
- `.github/workflows/labeling.yml`

## Required PR Metadata

Each PR should have:

- exactly one `status:*`
- exactly one `priority:*`
- exactly one `type:*`
- at least one scope label where relevant (`area:*` or `comp:*`)

## Branch Prefix Expectations

Required core prefixes:

`feat/`, `fix/`, `hotfix/`, `release/`, `refactor/`, `chore/`, `docs/`, `test/`, `perf/`, `ci/`, `build/`, `deps/`, `security/`, `revert/`, `research/`, `design/`, `a11y/`, `ux/`, `i18n/`, `ops/`

Optional profile prefixes (when relevant to the project):

- Product: `proto/`, `ds/`, `api/`, `schema/`, `telemetry/`
- Client: `content/`, `seo/`, `config/`, `migrate/`, `qa/`, `uat/`

## Changelog Meta Policy

- Use `meta:needs-changelog` for user-facing changes.
- Use `meta:no-changelog` only for internal-only changes with no user-facing impact.
- Never apply both on the same PR.

## Validation

```bash
node scripts/agents/includes/check-template-labels.js
node scripts/validation/validate-labeling-configs.cjs
```

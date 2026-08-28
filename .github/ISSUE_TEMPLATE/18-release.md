---
name: "🚀 Release"
description: "🚀 Release"
about: "Track and coordinate a versioned release: changelog, tagging, GitHub Release publication, and post-merge verification."
assignees: []
projects: []
milestone: ""
file_type: issue-template
version: "2.0.1"
last_updated: "2026-08-17"
category: "github-templates"
---

## Release Summary

<!-- Describe the release: version target, scope (patch/minor/major), and the primary theme or focus of this release cycle. -->

**Version:** vX.Y.Z
**Scope:** `patch` | `minor` | `major`
**Focus:**

---

## How to Initiate This Release

### Step 1 — Pre-flight checks (run on `develop`)

```bash
git checkout develop && git pull origin develop
npm run validate:frontmatter
npm run validate:workflows
npm run validate:agents
npm run validate:skills
npm run validate:plugins
npm test
```

All commands must exit 0 before proceeding.

### Step 2 — Verify changelog readiness

```bash
node scripts/validation/validate-changelog.cjs CHANGELOG.md
node scripts/agents/includes/changelogUtils.cjs --unreleased
```

### Step 3 — Dry-run the release agent

```bash
node scripts/agents/release.agent.js --scope=<scope> --version=<X.Y.Z> --dry-run
```

Review the proposed CHANGELOG roll, version bump, and release notes preview before proceeding.

### Step 4 — Live release

```bash
node scripts/agents/release.agent.js --scope=<scope> --version=<X.Y.Z>
```

Or via **Actions → release.yml → Run workflow** with inputs `scope`, `version`, `dry_run: false`, `provider: shell`.

The agent will automatically: create `release/vX.Y.Z` branch → bump `VERSION` → roll `[Unreleased]` in `CHANGELOG.md` → commit → create annotated tag → push → open PR `release/vX.Y.Z → main` → publish GitHub Release.

> **Note:** The tag and GitHub Release are created on the release branch commit **before** the PR merges to `main`. Merge the release PR after CI is green.

### Step 5 — Merge the release PR and verify

After the agent creates the `release/vX.Y.Z → main` PR:

- Confirm CI is green
- Merge to `main` (use a standard merge commit; **do not squash-merge** to ensure the tag remains reachable on `main`)
- Verify tag `vX.Y.Z` exists on the repository

### Rollback (if needed)

```bash
node scripts/workflows/release/rollback.cjs --version=X.Y.Z --dry-run
node scripts/workflows/release/rollback.cjs --version=X.Y.Z --provider=shell
```

---

## Open PRs — Merge Before Tagging

<!-- List all open PRs that must be merged to develop before the release tag is cut. -->

- [ ] <!-- PR #NNN — description -->

---

## Scope & Proposed Inclusions

### Already merged (PRs included)

<!-- List the key PRs already merged to develop that are part of this release. -->

- **PR #NNN** — description

### Recommended additions

<!-- Optional scope items still under consideration. -->

- [ ] Item — description

---

## Changelog Summary

<!-- Summarise the key entries from CHANGELOG.md [Unreleased] that will be rolled into this release. -->

### Added

-

### Changed

-

### Fixed

-

---

## Milestones / Checklist

### Pre-release PRs

- [ ] All open PRs listed above merged to `develop`

### Release execution

- [ ] All pre-release gates pass (`validate:frontmatter`, `validate:workflows`, `validate:agents`, `validate:skills`, `validate:plugins`, `npm test`)
- [ ] `CHANGELOG.md` unreleased entries reviewed and finalised
- [ ] Dry-run reviewed and output confirmed correct
- [ ] Live release run completed — `release/vX.Y.Z` branch created, tag pushed, GitHub Release published
- [ ] `release/vX.Y.Z` PR opened against `main`
- [ ] CI green on release PR
- [ ] Release PR merged → `main`
- [ ] Tag `vX.Y.Z` confirmed on repository
- [ ] GitHub Release body verified: no duplicate H1 title, highlights present, breaking changes section present

## Acceptance Criteria

- [ ] `CHANGELOG.md` `[X.Y.Z]` section published with full entry list
- [ ] Release tag `vX.Y.Z` exists on `main`
- [ ] GitHub Release published with correct format (highlights, breaking changes always present, full changelog compare link)
- [ ] `[Unreleased]` section recreated in `CHANGELOG.md` for next cycle
- [ ] All linked issues/PRs closed or updated

## Additional Context

<!-- Key files changed, related issues, notes. -->

**Key files changed:**

**Related issues:**

---

## Definition of Ready (DoR)

- [ ] Release goal and scope defined
- [ ] Version target confirmed
- [ ] All in-scope PRs identified and listed
- [ ] Changelog entries catalogued
- [ ] Milestones and checklist mapped

## Definition of Done (DoD)

- [ ] All checklist and acceptance criteria completed
- [ ] `CHANGELOG.md` `[X.Y.Z]` section published
- [ ] Release tag `vX.Y.Z` on `main`
- [ ] GitHub Release published with correct format
- [ ] Approved by maintainer

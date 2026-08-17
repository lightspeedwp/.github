---
file_type: "instructions"
scope: "repo-local"
title: "Release Management Instructions"
description: "Comprehensive standards for release preparation, validation, automation, semantic versioning, changelog management, and GitHub Release publication"
version: "v2.0.1"
last_updated: "2026-05-29"
owners: ["LightSpeed Engineering"]
tags: ["release", "semantic-versioning", "changelog", "automation", "github", "governance"]
applyTo: ["../.github/agents/release.agent.md", "scripts/agents/release.agent.js", ".github/workflows/release.yml", ".github/workflows/changelog.yml", "docs/RELEASE_PROCESS.md"]
status: "active"
stability: "stable"
domain: governance
---

# Release Management Instructions

You are a LightSpeed release steward. Execute releases with strong validation gates, deterministic versioning, and auditable change logs. Prefer safe defaults (`patch`, dry-run enabled) unless maintainers explicitly choose otherwise.

## Overview

This file defines how release preparation, execution, and recovery must run in this repository. It aligns:

- Release workflow: `.github/workflows/release.yml`
- Agent logic: `scripts/agents/release.agent.js`
- Process documentation: `docs/RELEASE_PROCESS.md`
- Changelog validation tooling: `scripts/validation/validate-changelog.cjs`, `scripts/agents/includes/changelogUtils.cjs`

## Release Phases

### Phase 1: Pre-release Readiness (develop)

- Ensure all release blockers in the target milestone are closed.
- Run mandatory gates:
  - `npm run validate:frontmatter`
  - `npm run validate:workflows`
  - `npm run validate:agents`
  - `npm run validate:skills`
  - `npm run validate:plugins`
  - `npm test`
- Confirm `CHANGELOG.md` has a valid `[Unreleased]` section.

### Phase 2: Release Execution (release/vX.Y.Z -> main)

- Determine target version from scope (`patch|minor|major`) unless an explicit version is provided.
- If explicit version is used, enforce scope alignment unless `RELEASE_FORCE_VERSION=1` is intentionally set.
- Create `release/vX.Y.Z`, bump `VERSION`, roll changelog section, validate post-change structure, then open release PR.
- Only after successful validation/PR creation proceed to tag and GitHub Release publication.

### Phase 3: Post-release Verification

- Re-validate changelog structure after release mutation in workflow.
- Verify release tag and GitHub Release metadata.
- Record release outcomes in changelog/issue tracking.

## Changelog Governance

- `CHANGELOG.md` must follow Keep a Changelog structure.
- `[Unreleased]` must always exist after release completion.
- Post-release validation in workflow must include:
  - `validate-changelog.cjs`
  - `changelogUtils.cjs --validate`
  - `changelogUtils.cjs --unreleased`

## Semantic Versioning Rules

- `patch`: fixes, docs corrections, low-risk maintenance.
- `minor`: backward-compatible features or capability additions.
- `major`: breaking changes or compatibility resets.
- Explicit `--version=X.Y.Z` overrides must match computed scope output unless `RELEASE_FORCE_VERSION=1` is set.

## MCP Provider Authentication and Permissions

When using `--provider=mcp` (or workflow input `provider: mcp`), release automation uses GitHub API calls for preflight/tag/PR/release steps.

Required authentication:

- `GITHUB_TOKEN` must be present in the runtime environment.
- Repository context must resolve via `GITHUB_REPOSITORY=owner/repo` or `RELEASE_REPO_OWNER` + `RELEASE_REPO_NAME`.

Required token capabilities:

- `contents: write` (tag refs and release publication)
- `pull-requests: write` (release PR creation)

Workflow permission alignment (`.github/workflows/release.yml`):

- `permissions.contents: write`
- `permissions.pull-requests: write`

Dry-run expectation:

- MCP dry-run still performs remote preflight checks for tag/release collisions.
- Tag/PR/release mutation calls must not execute in dry-run mode.

## Failure and Rollback

- If release execution fails after partial mutation, run:

```bash
node .github/scripts/workflows/release/rollback.cjs --version=X.Y.Z
```

- For best-effort cleanup when one step fails:

```bash
node .github/scripts/workflows/release/rollback.cjs --version=X.Y.Z --force
```

- Optional preview mode:

```bash
node .github/scripts/workflows/release/rollback.cjs --version=X.Y.Z --dry-run
```

## Validation Checklist

- [ ] Required pre-release gates pass
- [ ] Changelog unreleased section present and valid
- [ ] Version bump aligns with release scope
- [ ] Release PR created successfully before release publication
- [ ] Tag/release creation succeeds
- [ ] Rollback procedure available and tested in dry-run mode

## References

- `docs/RELEASE_PROCESS.md`
- `.github/workflows/release.yml`
- `scripts/agents/release.agent.js`
- `scripts/workflows/release/rollback.cjs`

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

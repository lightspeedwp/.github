---
title: "Release Process"
description: "Authoritative release process for lightspeedwp/.github: develop-first stacked PR flow with authorization gating, changelog validation, and automated post-release sync."
file_type: "documentation"
version: 'v3.0.0'
last_updated: '2026-08-05'
author: "LightSpeed Team"
maintainer: "LightSpeed Team"
owners: ["lightspeedwp"]
tags: ["release", "process", "automation"]
---

# Release Process (Develop-First Stacked PR Flow)

**Goal:** ship reliable releases using a develop-first stacked PR model: feature work integrates to `develop` first, then a release PR merges to `main`, with automatic post-release sync back to `develop`.

## Branch flow (develop-first)

```
feature branch
    ↓
develop (PR, integrate feature work)
    ↓
release/vX.Y.Z branch (created by agent)
    ↓
[STACKED] PR #1: release/vX.Y.Z → develop (changelog + version bump)
    ↓
[STACKED] PR #2: release/vX.Y.Z → main (after develop PR merges)
    ↓
main (release published)
    ↓
post-release-sync (chore: main → develop)
```

**Flow sequence:**

1. Feature work integrates to `develop` via normal PR workflow.
2. When ready for release, trigger `release.yml` workflow on `develop`.
3. Agent creates `release/vX.Y.Z` branch, bumps `VERSION`, updates `CHANGELOG.md`.
4. Agent creates **PR #1**: `release/vX.Y.Z` → `develop` (changelog + version changes).
5. Developer merges PR #1 to `develop`.
6. Agent creates **PR #2**: `release/vX.Y.Z` → `main` (stacked on PR #1).
7. Developer merges PR #2 to `main`.
8. GitHub Release published with compiled notes (sections, highlights, contributors).
9. `post-release-sync` workflow automatically creates PR: `main` → `develop` to keep branches in sync.

## Authorization gating

**New in v3.0:** Authorization validation gates all release workflow triggers.

- **Trigger validation:** Only `workflow_dispatch` and `workflow_call` events allowed (blocks accidental or unauthorized triggers).
- **Actor validation:** Trigger actor must be an active member of the `maintainers` team in the lightspeedwp organisation.
- **Audit logging:** All authorization attempts logged in `trigger-telemetry.json` with timestamp, actor, event, and failure reason.
- **Blocking:** Unauthorized attempts cause the workflow to **fail immediately** (no workaround; `continue-on-error: false`).

**Example audit log (unauthorized):**

```json
{
  "event": "push",
  "actor": "unknown-user",
  "is_authorized": false,
  "unauthorized_attempts": 1,
  "failure_reason": "Invalid trigger event: push",
  "timestamp": "2026-08-05T19:00:00Z"
}
```

## Automation & gates

- **Changelog validation (`.github/workflows/changelog.yml`)**
  - Runs on **every PR** (all branches) and on `develop` pushes to ensure:
    - `CHANGELOG.md` conforms to `changelog.schema.json`.
    - Unreleased section exists and is populated.
- **Release workflow (`.github/workflows/release.yml`)**
  - Manual `workflow_dispatch` and reusable `workflow_call`.
  - Typed inputs: `version`, `notes_from`, `scope`, `provider`, `dry_run`.
  - **Authorization gating:** trigger-telemetry job validates actor + event (blocks unauthorized).
  - Hard gate on lint (`checks.yml` unified linting workflow).
  - Runs schema + unreleased validation before invoking `release.agent.js`.
  - Uses `release.agent.js` (ESM) to:
    - Create `release/vX.Y.Z` branch from `develop`
    - Bump `VERSION` and update `CHANGELOG.md`
    - Create PR #1: `release/vX.Y.Z` → `develop`
    - After PR #1 merges, create PR #2: `release/vX.Y.Z` → `main`
    - Tag and publish GitHub Release with compiled notes
  - Provider mode:
    - `shell` (default): gh/git-backed publication.
    - `mcp`: GitHub API-backed publication for tag ref, PR, and release.
  - Dry-run mode publishes review artefacts (`release-agent.log`, `release-notes-preview.md`) without creating commits/tags/releases.
  - Trigger telemetry records authorisation attempts (expected `0` unauthorized).
- **Post-release sync (`.github/workflows/release.yml` — new job)**
  - Runs after release if not dry-run.
  - Creates `chore/post-release-sync-main-to-develop` branch.
  - Merges `main` into `develop` to keep branches in sync.
  - Creates PR `main` → `develop` for developer review/merge.
- **Required checks before merging release PRs**
  - Lint/test green.
  - Changelog validation green.
  - Version bump and dated changelog entry present.

## Semantic versioning & scope

- Single source of truth: `VERSION` file.
- Scope values: `patch` (default), `minor`, `major`.
- Workflow dispatch examples:

**Via GitHub UI:**

1. Go to **Actions** → **release** workflow
2. Click **Run workflow**
3. Select inputs:
   - **version:** (leave blank to use scope)
   - **scope:** `patch` (default), `minor`, or `major`
   - **provider:** `shell` (default) or `mcp`
   - **dry_run:** `true` (default, safe mode) or `false` (live release)
4. Click **Run workflow**

**Via CLI:**

```bash
gh workflow run release.yml \
  --ref develop \
  -f scope=patch \
  -f provider=shell \
  -f dry_run=false
```

## MCP provider runtime settings

- `GITHUB_REPOSITORY` or `RELEASE_REPO_OWNER` + `RELEASE_REPO_NAME` must identify the target repository.
- `GITHUB_TOKEN` is required for MCP provider mutation operations.
- Retry/backoff tuning for MCP API calls:
  - `RELEASE_MCP_RETRIES` (default `3`)
  - `RELEASE_MCP_BACKOFF_MS` (default `250`)
  - `RELEASE_MCP_BACKOFF_FACTOR` (default `2`)

## Pre-release checklist (run on develop)

Before triggering the release workflow, verify:

- [ ] You are a member of the `maintainers` team (authorization requirement).
- [ ] `CHANGELOG.md` has unreleased entries and passes schema validation (`npm run validate:changelog`).
- [ ] `VERSION` file is correct for the intended bump scope.
- [ ] All feature branches are merged to `develop`.
- [ ] Lint/tests green (`npm run lint && npm test`).
- [ ] Agent/workflow alignment: `release.agent.js`, `release.agent.md`, `release.yml`, `changelog.yml`.
- [ ] Documentation current (links valid, branch flow accurate).
- [ ] No uncommitted changes in working tree (`git status` is clean).

## Release execution (develop-first stacked flow)

**Phase 1: Trigger release workflow**

1. Navigate to **Actions** → **release** workflow.
2. Click **Run workflow** (or use CLI `gh workflow run`).
3. Configure inputs: scope (patch/minor/major), provider (shell/mcp), dry_run (true/false).
4. Click **Run workflow**.

**Phase 2: Authorization & validation (automatic)**

1. **Trigger telemetry job:**
   - Validates actor is in `maintainers` team.
   - Blocks unauthorized attempts (workflow fails).
   - Logs authorization attempt with reason.

2. **Lint & test jobs:**
   - Runs unified linting (`npm run lint`).
   - Runs test suite (`npm test`).
   - Both depend on successful authorization.

3. **Changelog validation:**
   - Validates `CHANGELOG.md` schema.
   - Confirms unreleased section populated.

**Phase 3: Release agent execution (develop-first)**

1. Agent runs on `develop` branch.
2. Validates readiness: VERSION + changelog schema + unreleased content.
3. Creates `release/vX.Y.Z` branch from `develop`.
4. Bumps `VERSION` file.
5. Rolls `[Unreleased]` section to `[X.Y.Z] - YYYY-MM-DD` in `CHANGELOG.md`.
6. Commits: `"chore: Release vX.Y.Z"`.
7. Creates **PR #1**: `release/vX.Y.Z` → `develop` (changelog + version).
   - Title: `"chore: Release vX.Y.Z (changelog + version bump)"`
   - Body: Link to this release process doc, version bump details.
8. Returns `release_version` and `release_branch` as workflow outputs.

**Phase 4: Developer reviews PR #1 (develop)**

1. Open PR #1 in GitHub.
2. Verify changelog entries and version bump.
3. Approve and merge to `develop`.

**Phase 5: Agent creates PR #2 (stacked)**

After PR #1 merges, agent automatically:

1. Creates **PR #2**: `release/vX.Y.Z` → `main` (stacked on PR #1).
   - Title: `"release: vX.Y.Z"`
   - Body: Compiled release notes (sections, highlights, breaking changes, contributors).
2. Creates annotated tag: `vX.Y.Z` (signed if keys available).
3. Pushes tag to remote.

**Phase 6: Developer reviews PR #2 (main)**

1. Open PR #2 in GitHub.
2. Verify compiled release notes and tag.
3. Approve and merge to `main`.
4. GitHub automatically publishes Release from the tag.

**Phase 7: Post-release sync (automatic)**

After PR #2 merges:

1. `post-release-sync` workflow runs.
2. Creates `chore/post-release-sync-main-to-develop` branch from `main`.
3. Merges `main` into `develop` to keep branches in sync.
4. Creates PR: `main` → `develop` for developer review.
5. Developer merges to keep branches synchronized.

## Changelog governance

- Format: Keep a Changelog.
- Schema: `../.schemas/changelog.schema.json` enforced by:
  - `scripts/validation/validate-changelog.cjs`
  - `scripts/agents/includes/changelogUtils.cjs --validate/--unreleased`
- Requirements:
  - `[Unreleased]` section must exist and contain entries before release.
  - Sections allowed: Added, Changed, Deprecated, Removed, Fixed, Security, Documentation, Performance.

## Release notes generation

`release.agent.js` compiles notes using:

- Changelog sections (ordered).
- Highlights (prioritising Added/Changed/Security).
- Breaking changes callout.
- Contributors from merged PRs between previous tag and new tag.
- Full changelog compare link.

## Troubleshooting

- **Changelog validation fails:** run `node scripts/validation/validate-changelog.cjs CHANGELOG.md` and fix schema violations/empty sections.
- **No unreleased changes:** add entries under `[Unreleased]` before running release agent.
- **PR not created:** ensure `gh` CLI and `GITHUB_TOKEN` available; otherwise create PR from `release/vX.Y.Z` → `main` manually.
- **Tag conflicts:** delete or move existing tag before rerunning; ensure working tree clean.

## Rollback notes

If a release is started but must be rolled back:

1. Delete the release branch (`release/vX.Y.Z`) if it should not proceed.
2. Delete the tag locally and remotely:
   - `git tag -d vX.Y.Z`
   - `git push origin :refs/tags/vX.Y.Z`
3. If a GitHub Release was created, remove it:
   - `gh release delete vX.Y.Z --yes`
4. Restore `VERSION` and `CHANGELOG.md` to the last known good commit on `develop`.
5. Re-run the workflow in `dry_run` mode first to validate fixes before re-attempting a live release.

Rollback utility supports provider-aware cleanup:

```bash
node .github/scripts/workflows/release/rollback.cjs --version=X.Y.Z --provider=shell
node .github/scripts/workflows/release/rollback.cjs --version=X.Y.Z --provider=mcp --dry-run
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

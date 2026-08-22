---
file_type: documentation
title: Release Process v4.0
description: Authoritative multi-repo release process - develop-first stacked PR flow with portable agents (Phase 1) and agentic safety gates (Phase 2)
version: v4.0
last_updated: '2026-08-21'
status: active
stability: stable
domain: governance
owners:
  - LightSpeed Team
tags:
  - release
  - process
  - automation
  - agents
  - wordpress
---

# Release Process v4.0: Two-Phase Agentic Release

> Ship multi-repo releases reliably with portable agents (Phase 1), automated safety gates (Phase 2), and full WordPress support for plugins, themes, and control-plane repositories.

## Overview

The Release Process uses a **two-phase approach** to automate and verify releases:

- **Phase 1: Portable Agent** — Detects repo type, bumps versions, updates changelog
- **Phase 2: Agentic Gates** — Validates changes with 7 safety gates, manages approvals, publishes release

This document covers both phases, common workflows, troubleshooting, and WordPress-specific guidance.

### Key Features

✅ **Multi-repo support:** Control-plane, plugins, themes  
✅ **Automated versioning:** SemVer bumping (major/minor/patch)  
✅ **WordPress support:** Plugin headers, theme CSS, readme.txt  
✅ **Safety gates:** 7-layer validation before release  
✅ **Sequential merge queue:** Mergify prevents conflicts  
✅ **Post-release sync:** Automatic develop ← main sync  
✅ **Rollback ready:** Can revert if issues arise  

---

## Release Workflow Diagram

### Two-Phase Process

```mermaid
flowchart TD
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
    accTitle: Release workflow full flow
    accDescr: Developer triggers release, authorization checks, CI gates, version bump, stacked PRs to develop and main, tag and release, post-release sync
    A["👤 Developer (on develop)<br/>Trigger release workflow"] -->|"gh workflow run release.yml"| B["🔐 Trigger Telemetry<br/>Validate authorization"]
    B -->|Authorized| C["✅ Lint & Test Gates<br/>Run checks"]
    B -->|Unauthorized| Z1["❌ Workflow Fails<br/>Log attempt"]
    C -->|Checks pass| D["🔄 Release Agent<br/>Create release/vX.Y.Z"]
    C -->|Checks fail| Z2["❌ Workflow Fails<br/>Fix issues & retry"]
    D -->|"Version + CHANGELOG"| E["📝 PR #1<br/>release/vX.Y.Z → develop<br/>For review"]
    E -->|Developer merges| F["✅ develop updated<br/>Version + changelog rolled"]
    F -->|Auto-trigger| G["📝 PR #2<br/>release/vX.Y.Z → main<br/>For final review"]
    G -->|Developer merges| H["🏷️ Tag created<br/>Release published<br/>GitHub Release live"]
    H -->|Post-release| I["🔄 Post-Release Sync<br/>Merge main → develop<br/>PR for review"]
    I -->|Developer merges| J["✅ Release Complete<br/>Branches in sync"]
    
    style A fill:#4a148c,color:#fff
    style B fill:#1b5e20,color:#fff
    style C fill:#bf360c,color:#fff
    style D fill:#f57f17,color:#000
    style E fill:#00695c,color:#fff
    style F fill:#2e7d32,color:#fff
```

### Phase 1: Portable Agent Workflow

```mermaid
flowchart TD
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
    accTitle: Authorization validation flow
    accDescr: Event type validation, actor team membership check, authorization decision with audit logging
    A["Workflow triggered<br/>workflow_dispatch or<br/>other event"] -->|Check event| B{Valid event type?}
    B -->|No| C["❌ FAIL<br/>Invalid trigger event<br/>Log: Invalid event type"]
    B -->|Yes| D{Actor in<br/>maintainers team?}
    D -->|No| E["❌ FAIL<br/>Unauthorized actor<br/>Log: Actor not in team"]
    D -->|Yes| F["✅ PASS<br/>Release authorized<br/>Log: Success"]
    
    Dev->>GH: Trigger release.yml workflow
    GH->>Agent: Run on develop branch
    Agent->>Git: Detect repo type & structure
    Agent->>Agent: Bump version (scope: major/minor/patch)
    Agent->>Agent: Update CHANGELOG.md (two-gate format)
    Agent->>Git: Create release/vX.Y.Z branch
    Agent->>GH: Create PR #1 (release/vX.Y.Z → develop)
    Dev->>GH: Review & merge PR #1
    GH->>Git: develop branch updated
    GH->>Agent: Trigger Phase 2 (auto)
    
    Note over Dev,GH: Phase 1 Complete<br/>Ready for Phase 2
```

### Phase 2: Agentic Gates Workflow

```mermaid
sequenceDiagram
  accTitle: Phase 2 Agentic Gates Workflow
  accDescr: Safety gates verify authorization, run 7-layer validation, create PR on main branch, publish GitHub release
    actor Dev as Developer
    participant GH as GitHub
    participant Gates as Safety Gates
    participant Auth as Authorization
    
    GH->>Auth: Verify maintainer authorization
    Auth->>GH: ✅ Authorized
    GH->>Gates: Run 7-layer safety validation
    Gates->>Gates: 1. Changelog validation
    Gates->>Gates: 2. Version consistency
    Gates->>Gates: 3. Branch protection check
    Gates->>Gates: 4. Test suite verification
    Gates->>Gates: 5. Code quality check
    Gates->>Gates: 6. Security scan
    Gates->>Gates: 7. Pre-flight checklist
    Gates->>GH: Create PR #2 (release/vX.Y.Z → main)
    Dev->>GH: Review & merge PR #2
    GH->>GH: Create version tag
    GH->>GH: Publish GitHub Release
    GH->>GH: Auto post-release sync (main → develop)
    Dev->>GH: Merge post-sync PR (optional review)
    
    Note over Dev,GH: Release Complete
```

---

## Phase 1: Portable Release Agent

### Overview

**Phase 1** uses portable agents to handle version management and changelog generation. The process:

```mermaid
accTitle: Flowchart
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
flowchart TD
    A["🚀 Release triggered<br/>User runs release.yml"] -->|scope: patch/minor/major| B["🔐 Phase 5A Safety Gates"]
    B -->|GATE 1| C["Pre-flight Checks<br/>Branch, VERSION, CHANGELOG"]
    C -->|GATE 2| D["Agentic Score<br/>AI confidence ≥0.80"]
    D -->|GATE 3| E["Version Consistency<br/>Semver validation"]
    E -->|GATE 4| F["Tag Uniqueness<br/>No duplicate tags"]
    F -->|GATE 5| G["Authorization<br/>Maintainers team"]
    G -->|GATE 6| H["Integrity Filter<br/>Gitleaks detection"]
    H -->|GATE 7| I["Approval Enforcement<br/>Tiered by scope"]
    I -->|All gates PASS| J["✅ Phase 4 Scripts<br/>Mutations approved"]
    C -->|FAIL| Z1["❌ Release aborted<br/>No changes made"]
    D -->|FAIL| Z2["❌ Release aborted<br/>Low confidence"]
    E -->|FAIL| Z3["❌ Release aborted<br/>Invalid version"]
    F -->|FAIL| Z4["❌ Release aborted<br/>Tag exists"]
    G -->|FAIL| Z5["❌ Release aborted<br/>Unauthorized"]
    H -->|FAIL| Z6["❌ Release aborted<br/>Secrets detected"]
    I -->|FAIL| Z7["❌ Release aborted<br/>Approval pending"]
    J -->|mutations| K["🏷️ GitHub Release<br/>Tags & release notes"]
    
    style A fill:#01579b,color:#fff
    style B fill:#bf360c,color:#fff
    style C fill:#1b5e20,color:#fff
    style D fill:#4a148c,color:#fff
    style E fill:#1b5e20,color:#fff
    style F fill:#4a148c,color:#fff
    style G fill:#bf360c,color:#fff
    style H fill:#1b5e20,color:#fff
    style I fill:#4a148c,color:#fff
    style J fill:#2e7d32,color:#fff
    style K fill:#f57f17,color:#000
    style Z1 fill:#b71c1c,color:#fff
    style Z2 fill:#b71c1c,color:#fff
    style Z3 fill:#b71c1c,color:#fff
    style Z4 fill:#b71c1c,color:#fff
    style Z5 fill:#b71c1c,color:#fff
    style Z6 fill:#b71c1c,color:#fff
    style Z7 fill:#b71c1c,color:#fff
accDescr: Detailed diagram showing structure and relationships
```

### Prerequisites

- Current branch: `develop`
- No uncommitted changes
- Authorization: User must be in `maintainers` team
- Scope defined: `patch` (default), `minor`, or `major`

### Step-by-Step: Trigger Phase 1

#### Step 1: Prepare develop branch

```bash
git checkout develop
git pull origin develop
git status  # Verify clean working tree
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
2. Creates `ops/post-release-sync-main-to-develop` branch from `main`.
3. Merges `main` into `develop` to keep branches in sync.
4. Creates PR: `main` → `develop` for developer review.
5. Developer merges to keep branches synchronized.

### Post-release sync flow (Mermaid)

```mermaid
flowchart TD
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
    accTitle: Post-release sync flow
    accDescr: Automatic merge of main into develop after release, handling conflicts with manual PR if needed
    A["PR #2 merges to main<br/>Release tagged & published"] -->|Trigger sync job| B["🔄 post-release-sync<br/>Create branch from main"]
    B -->|Attempt merge| C{Merge conflicts?}
    C -->|No| D["✅ Clean merge<br/>No conflicts"]
    C -->|Yes| E["⚠️ Conflicts detected<br/>Manual intervention needed"]
    D -->|Auto-merge| F["📝 PR: main → develop<br/>Merged automatically"]
    F --> G["✅ Sync complete<br/>Branches in sync"]
    E -->|Create PR| H["📝 PR: main → develop<br/>Awaiting manual merge"]
    H -->|Developer resolves<br/>& merges| G
    
    style A fill:#fff9c4,color:#000,stroke:#000,stroke-width:2px
    style B fill:#e0f2f1,color:#000,stroke:#000,stroke-width:2px
    style C fill:#fef3c7,color:#4a2c00,stroke:#b45309,stroke-width:2px
    style D fill:#dcfce7,color:#14532d,stroke:#14532d,stroke-width:2px
    style E fill:#ffe0b2,color:#000,stroke:#000,stroke-width:2px
    style F fill:#dcfce7,color:#14532d,stroke:#14532d,stroke-width:2px
    style G fill:#dcfce7,color:#14532d,stroke:#14532d,stroke-width:2px
    style H fill:#ffccbc,color:#000,stroke:#000,stroke-width:2px
```

See [ADR-003: Post-Release Sync Automation](./ADRs/ADR-003-post-release-sync.md) for detailed rationale.

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
# Default (patch bump)
gh workflow run release.yml -f dry_run=false

# Or specify scope
gh workflow run release.yml -f scope=minor -f dry_run=false

# Preview first (recommended for major releases)
gh workflow run release.yml -f scope=major -f dry_run=true
```

**Parameters:**

```mermaid
flowchart TD
%%{init: { 'accessibility': { 'diagWithoutTitle':true } }}%%
    accTitle: Rollback decision tree
    accDescr: Diagnose release failure timing and decide rollback scope (metadata only, main only, or full)
    A["🚨 Release problem detected<br/>When did it occur?"] -->|Before merge| B{PR #1 or PR #2<br/>merged yet?}
    A -->|After release| C["Released code is broken<br/>Assess impact"]
    B -->|No| D["✅ Simple fix<br/>Delete release branch<br/>Fix code, retry"]
    B -->|Yes| E{Which branch<br/>needs revert?}
    E -->|"release metadata only"| F["💾 Rollback: release_only<br/>Delete release + tag<br/>Code cleanup later"]
    E -->|"main only"| G["💾 Rollback: release_and_main<br/>Revert main commits<br/>Delete tag"]
    E -->|"both branches"| H["💾 Rollback: full<br/>Revert both branches<br/>Delete tag & release"]
    C -->|"Minor bug"| I["⚠️ Hotfix approach<br/>Create fix PR to main<br/>Release vX.Y.Z+1"]
    C -->|"Critical issue"| J["🚨 Emergency rollback<br/>See ADR-004 for scope"]
    J --> K["Trigger rollback.cjs<br/>Provide scope & reason"]
    F -->|Execute| L["Post-rollback:<br/>Analyze failure<br/>Update process"]
    G -->|Execute| L
    H -->|Execute| L
    I -->|Execute| L
    
    style A fill:#ffccbc,color:#000,stroke:#000,stroke-width:2px
    style B fill:#fef3c7,color:#4a2c00,stroke:#b45309,stroke-width:2px
    style C fill:#ffccbc,color:#000,stroke:#000,stroke-width:2px
    style D fill:#dcfce7,color:#14532d,stroke:#14532d,stroke-width:2px
    style E fill:#fef3c7,color:#4a2c00,stroke:#b45309,stroke-width:2px
    style F fill:#ffe0b2,color:#000,stroke:#000,stroke-width:2px
    style G fill:#ffe0b2,color:#000,stroke:#000,stroke-width:2px
    style H fill:#fee2e2,color:#7f1d1d,stroke:#b91c1c,stroke-width:2px
    style I fill:#ffe0b2,color:#000,stroke:#000,stroke-width:2px
    style J fill:#fee2e2,color:#7f1d1d,stroke:#b91c1c,stroke-width:2px
    style K fill:#fee2e2,color:#7f1d1d,stroke:#b91c1c,stroke-width:2px
    style L fill:#e0e0e0,color:#000,stroke:#000,stroke-width:2px
```

**Expected output:**

```
Status: ✅ success
Artifacts: release-agent-output.json (version bump details)
PR: #XXXX created (release/vX.Y.Z → develop)
```

#### Step 4: Review & Merge PR #1

```bash
# View PR created by Phase 1
gh pr view --json title,body,number

# Review the changelog updates
cat CHANGELOG.md | head -30

# Merge PR #1 to develop
gh pr merge --squash --delete-branch
```

**What to verify:**

- ✅ Version bumped correctly in VERSION file
- ✅ CHANGELOG.md updated with new entries
- ✅ Branch protection rules pass
- ✅ CI checks pass

---

## Phase 2: Agentic Safety Gates

### Overview

**Phase 2** activates automatically when Phase 1 PR merges to develop. The process:

1. Validates authorization (maintainers team only)
2. Runs 7 safety gates on release readiness
3. Generates agentic confidence score
4. Creates PR #2 from release branch to main
5. After merge: publishes release and syncs develop

### The 7 Safety Gates

1. **Changelog Validation** — Verifies CHANGELOG.md format and entries
2. **Version Consistency** — Ensures all version files match
3. **Branch Protection** — Confirms branch protection rules will be enforced
4. **Test Suite** — Runs all automated tests
5. **Code Quality** — Linting and format checks
6. **Security Scan** — Dependency vulnerabilities and secrets
7. **Pre-flight Checklist** — Final readiness verification

### Approval Tiers

| Scope | Approval | Who Decides | Timeline |
|-------|----------|-----------|----------|
| **Patch** | Auto-approve | Agentic (score ≥ 0.8) | < 5 min |
| **Minor** | Manual review | 1 maintainer | 10–30 min |
| **Major** | Dual approval | 2 maintainers + ADR | 1–4 hours |

**How to approve:**

- Patch: Automatically approved if agentic confidence ≥ 0.8
- Minor: Comment "approved" or "LGTM" on PR
- Major: 2 maintainers approve + Architecture Decision Record (ADR) linked

### Step-by-Step: Phase 2 (Automatic)

Phase 2 runs automatically when PR #1 merges. Monitor with:

```bash
# View Phase 2 PR (PR #2: release → main)
gh pr list --search "release/v" --state open

# Check gate validation results
gh pr view <pr-number> --json statusCheckRollup

# View agentic score and gate details
gh pr view <pr-number> --json body | jq '.body'
```

**Expected flow:**

1. PR #2 created automatically (release/vX.Y.Z → main)
2. All 7 gates run in parallel
3. Agentic confidence score calculated
4. Auto-approve (patch) OR request approval (minor/major)
5. Developer merges PR #2
6. GitHub Release published
7. Post-release sync PR created (main → develop)

### Handling Gate Failures

If any gate fails:

1. **View the failure:** `gh pr checks <pr-number>`
2. **Identify root cause:** Check the gate's error message
3. **Fix the issue:** Update code/tests/docs as needed
4. **Retry:** Gates re-run on each commit

**Common failures:**

- Changelog format mismatch → fix CHANGELOG.md format
- Test failures → fix failing tests
- Linting errors → run prettier/eslint --fix
- Version mismatch → ensure all version files match

---

## Repository-Specific Guidance

### Control-Plane Repository (.github)

**Version file:** `VERSION`  
**Detection:** `VERSION` file exists + `package.json`  

```bash
# Check current version
cat VERSION

# Release process (same as general)
gh workflow run release.yml -f scope=minor -f dry_run=false
```

### WordPress Plugin

**Version files:**

- Main plugin file: `Version: X.Y.Z` header
- readme.txt: `Stable tag: X.Y.Z`
- (optional) `VERSION` file

**Detection:** Plugin header in main PHP file  

```bash
# Check plugin version
grep "Version:" my-plugin.php | head -1
grep "Stable tag:" readme.txt | head -1

# Phase 1 detects and updates all files automatically
gh workflow run release.yml -f scope=patch -f dry_run=false
```

**What Phase 1 updates:**

- ✅ Plugin header (Version: line)
- ✅ readme.txt (Stable tag: line)
- ✅ VERSION file (if exists)
- ✅ CHANGELOG.md

### WordPress Theme

**Version file:** `style.css` (Version: header)  
**Detection:** `style.css` with Theme Name header  

```bash
# Check theme version
head -20 style.css | grep "Version:"

# Phase 1 detects and updates automatically
gh workflow run release.yml -f scope=minor -f dry_run=false
```

**What Phase 1 updates:**

- ✅ style.css (Version: line in CSS header)
- ✅ VERSION file (if exists)
- ✅ CHANGELOG.md

---

## Mergify Sequential Queue

### What It Does

Mergify manages the merge queue sequentially to prevent conflicts:

1. First PR enters queue → CI runs (all checks in place)
2. While first PR is testing → other PRs wait in queue
3. First PR finishes CI → if all pass, auto-rebase + merge
4. Base branch updated → second PR auto-rebases
5. Second PR CI runs → cycle repeats

### Why Sequential?

GitHub's branch protection requires branches to be "up to date" before merge. Sequential processing ensures:

✅ Branches stay up-to-date (auto-rebase)  
✅ No conflicts when merging  
✅ Explicit CI re-validation after rebase  
✅ Safety: merge only if all checks still pass  

### Configuration

Located in `.github/mergify.yml`:

```yaml
merge_queue:
  max_parallel_checks: 1  # One PR in CI at a time
  merge_method: squash    # Use squash commits
  batch_size: 1           # Process one at a time
```

### Monitoring Mergify Queue

```bash
# Check Mergify queue status
gh api /repos/lightspeedwp/.github/pulls?state=open | jq '.[] | select(.draft == false) | {title, status_check_rollup}'

# Check PR comments for Mergify diagnostics
gh pr comments <pr-number> | grep -i mergify
```

---

## Post-Release Sync

### What Happens Automatically

After PR #2 merges to main:

1. GitHub Release published with version tag
2. Release notes generated from CHANGELOG.md
3. `post-release-sync` workflow auto-triggers
4. PR created: `main` → `develop` (chore: sync)
5. Branches synced (no commits repeated)

### Manual Sync (if needed)

```bash
# Create manual post-release sync
git checkout develop
git pull origin develop
git merge --no-ff origin/main -m "chore: Post-release sync main → develop"
git push origin develop
```

---

## Rollback Procedures

### If Release Has Critical Issues

**Option 1: Tag & Release Revert (Recommended)**

```bash
# Revert the release tag
git tag -d v1.2.3
git push origin :refs/tags/v1.2.3

# Delete GitHub Release (manual: github.com/lightspeedwp/.github/releases)

# Create revert PR: main ← previous version
git checkout main
git revert HEAD --no-edit
git push origin main

# Open PR to merge revert
```

**Option 2: Full Rollback**

```bash
# Revert develop to previous stable commit
git checkout develop
git log --oneline | head -10  # Find stable commit
git revert <commit-hash> --no-edit
git push origin develop

# Release hotfix with patch bump
gh workflow run release.yml -f scope=patch -f dry_run=false
```

---

## Troubleshooting

### Phase 1 Issues

#### ❌ "Invalid trigger event" Authorization error

**Problem:** User not in maintainers team or invalid trigger event

**Solution:**

```bash
# Verify team membership
gh api /user/memberships/orgs/lightspeedwp

# If not in maintainers, contact org admin
```

#### ❌ "No VERSION file found"

**Problem:** Repository missing VERSION or package.json

**Solution:**
Create a VERSION file in repo root:

```bash
echo "1.0.0" > VERSION
git add VERSION
git commit -m "chore: Add VERSION file"
git push origin develop
```

#### ❌ "CHANGELOG.md not in two-gate format"

**Problem:** Changelog doesn't follow validation rules

**Solution:**
Check CHANGELOG.md header format:

```markdown
# Changelog

All notable changes to this project are documented in this file.

## [X.Y.Z] - YYYY-MM-DD

### Added
- New features

### Changed
- Updated features

### Fixed
- Bug fixes

### Removed
- Deprecated features
```

### Phase 2 Issues

#### ❌ "Code quality check failed"

**Problem:** Linting or formatting issues detected

**Solution:**

```bash
npm run format  # Auto-fix formatting
npm run lint:fix  # Auto-fix linting issues
git add .
git commit -m "fix: Code quality issues"
git push  # Gates re-run automatically
```

#### ❌ "Test suite failures"

**Problem:** Automated tests failing

**Solution:**

```bash
# Run tests locally
npm test

# Fix failures
# Push fixes
git add .
git commit -m "fix: Test failures"
git push  # Gates re-run
```

#### ❌ "Mergify conflict"

**Problem:** Branch has conflicts that auto-rebase cannot fix

**Solution:**

```bash
# Manually rebase
git fetch origin
git rebase origin/develop
# Resolve conflicts
git add .
git rebase --continue
git push -f  # Force push after rebase
```

---

## FAQ

### Q: How do I release a patch fix?

```bash
# Phase 1: Bump patch, update changelog
gh workflow run release.yml -f scope=patch -f dry_run=false

# Phase 2: Automatic gates, then merge when ready
# Done!
```

**Timeline:** ~10-15 min for patch (auto-approve)

### Q: What if I need to release a major version?

```bash
# Phase 1: Bump major, update changelog
gh workflow run release.yml -f scope=major -f dry_run=true  # Preview first

# Review the changes carefully, then execute
gh workflow run release.yml -f scope=major -f dry_run=false

# Phase 2: Manual dual approval required
# 1. First maintainer approves (comment "LGTM")
# 2. Second maintainer approves
# 3. Create ADR (Architecture Decision Record) linking to PR
# Then merge PR #2
```

**Timeline:** 1-4 hours (dual approval required)

### Q: Can I skip the agentic gates for an urgent hotfix?

**Answer:** No. Gates are mandatory for safety. However, you can:

1. Prioritize hotfix workflow (skip feature freeze)
2. Run gates with priority flag
3. Get expedited dual approval (contact team lead)

### Q: What version format is supported?

**Answer:** SemVer only (X.Y.Z format):

- ✅ `1.0.0`
- ✅ `1.2.3`
- ✅ `2.0.0-beta` (pre-release)
- ❌ `v1.0.0` (no 'v' prefix)
- ❌ `1.0` (missing patch)

### Q: How do I manually version if the agent fails?

```bash
# Option 1: Update VERSION file
echo "2.0.0" > VERSION

# Option 2: Update package.json
jq '.version = "2.0.0"' package.json > package.json.tmp && mv package.json.tmp package.json

# Option 3: Update WordPress files
# Plugin: sed -i '' 's/Version: .*/Version: 2.0.0/' my-plugin.php
# Theme: sed -i '' 's/Version: .*/Version: 2.0.0/' style.css
# Readme: sed -i '' 's/Stable tag: .*/Stable tag: 2.0.0/' readme.txt

# Then commit and re-trigger Phase 1
git add .
git commit -m "chore: Manual version bump to 2.0.0"
git push
```

### Q: How often can I release?

**Answer:** As often as needed. Recommendations:

- **Patch fixes:** As needed (critical bugs)
- **Minor releases:** Weekly or bi-weekly
- **Major releases:** Quarterly or as planned

### Q: What's the difference between develop and main?

- **develop:** Integration branch (where features merge)
- **main:** Production-ready (releases only)

Release process: `develop` (v bump) → `main` (release) → `develop` (sync)

### Q: Can multiple people release simultaneously?

**Answer:** No. Mergify sequential queue ensures one release at a time:

- PR #1 merges → develop updated
- PR #2 merges → main updated
- Post-sync merges → branches in sync
- Next release can begin

**Timeline:** Typical release takes 5-30 min depending on scope

---

## Integration with Release Agents

### Release Agent (Phase 1)

Located: `agents/release/`

**Provides:**

- Repository type detection
- Version file management
- CHANGELOG.md validation
- Branch creation
- PR generation

See [Release Agent README](../agents/release/README.md) for details.

### WordPress Utilities (Phase 1 for WordPress repos)

Located: `agents/wordpress/`

**Provides:**

- Plugin header versioning
- Theme CSS versioning
- readme.txt management
- WordPress-specific metadata extraction

See [WordPress Agent README](../agents/wordpress/README.md) for details.

### Changelog Agent (Phase 1 validation)

Located: `agents/changelog/`

**Provides:**

- CHANGELOG.md validation
- Entry formatting
- Two-gate validation logic

See [Changelog Agent README](../agents/changelog/README.md) for details.

### Agentic Workflows (Phase 2)

Located: `.github/workflows/release.yml`

**Provides:**

- 7-layer safety gates
- Authorization validation
- Approval workflow
- Release publication

See [Agentic Workflows Guide](./AGENTIC_RELEASE_ADMIN_GUIDE.md) for details.

---

## Related Documentation

- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) — Branch naming and protection
- [RELEASE_WORDPRESS.md](./RELEASE_WORDPRESS.md) — WordPress plugin/theme release guide
- [AGENTIC_RELEASE_USER_GUIDE.md](./AGENTIC_RELEASE_USER_GUIDE.md) — End-user guide
- [AGENTIC_RELEASE_ADMIN_GUIDE.md](./AGENTIC_RELEASE_ADMIN_GUIDE.md) — Administrator guide

---

**Status:** ✅ Production Ready  
**Last Updated:** 2026-08-19  
**Version:** 4.0 (rewritten for two-phase process)

Questions? See [FAQ](#faq) or contact the maintainers team.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

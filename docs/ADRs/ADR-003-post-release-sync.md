---
title: 'ADR-003: Post-Release Sync Automation'
description: Decision to automate main→develop sync after releases to keep branches aligned
file_type: documentation
date: 2026-08-08T00:00:00.000Z
adr_status: accepted
status: active
authors:
  - LightSpeed Team
---

# ADR-003: Post-Release Sync Automation

## Status

✅ **Accepted** — Implemented in Phase 1-2

## Context

In the develop-first release flow ([ADR-001](./ADR-001-develop-first-release-flow.md)):

```
develop → [PR #1 merge] → develop (version bumped)
       → [PR #2 merge] → main (released)
```

After PR #2 merges to main, the branches are in sync **in the normal case**. However, hotfixes create edge cases:

**Case 1: Normal Release (No Sync Needed)**

```
PR #1: release/v1.0.0 → develop (merge to develop)
PR #2: release/v1.0.0 → main (merge to main, tag, release)
       → develop is already up-to-date (same tree as main)
       → NO POST-RELEASE SYNC NEEDED
```

**Case 2: Hotfix to Main (Sync Needed)**

```
hotfix/critical-bug → main (merge directly, urgent)
       → develop is now STALE (missing hotfix)
       → POST-RELEASE SYNC REQUIRED to merge main → develop
```

**Case 3: Cherry-Pick to Main (Sync Needed)**

```
v1.0.0 released to main
team realizes v1.0.0 needs urgent patch
hotfix/v1.0.1 → main (merge for patch)
       → develop is now STALE (missing v1.0.1 changes)
       → POST-RELEASE SYNC REQUIRED to merge main → develop
```

The question: Should post-release sync be **automatic, manual, or optional**?

## Decision

**Implement automatic post-release sync (unless dry-run mode):**

- After a successful release (PR #2 merges to main), automatically create a post-release-sync branch
- Post-release-sync merges latest main into develop
- Create PR: `main` → `develop` and merge automatically (if no conflicts)
- If conflicts occur, create PR and wait for manual resolution
- Skip entirely in dry-run mode (no actual release occurred)

## Rationale

**Why automatic:**

- ✅ **Consistency** — All releases automatically keep branches in sync
- ✅ **Reduces overhead** — No manual step needed in normal case (Case 1)
- ✅ **Catches edge cases** — Handles hotfix/cherry-pick cases (Cases 2-3) without thinking
- ✅ **Conflicts surface immediately** — If sync conflicts, PR is created and visible; team is notified

**Why conditional (not in dry-run):**

- ✅ **Dry-run is non-destructive** — No commits or tags created; sync is meaningless
- ✅ **Fast dry-run feedback** — Skipping sync makes dry-run ~2 min faster

**Why automatic merge (if no conflicts):**

- ✅ **Reduces toil** — Developers don't have to manually merge simple syncs
- ✅ **Keeps branches in sync** — Without manual approval, sync could be forgotten

**Why create PR (if conflicts):**

- ✅ **Requires review** — Conflict resolution deserves human eyes
- ✅ **Visible to team** — PR shows what changes are conflicting and why
- ✅ **Auditable** — Conflict resolution is recorded in PR history

## Alternatives Considered

### Manual Sync (No Automation)

Team manually merges main → develop when needed.

**Rejected because:**

- Requires discipline; easy to forget in normal releases
- Develop branch can be stale for days after hotfixes
- Increases risk of merge conflicts later

### One-Way Sync (develop → main Only)

Accept that main may have commits develop doesn't (from hotfixes) and never sync back.

**Rejected because:**

- Violates principle that `develop` should contain all released code
- Leads to confusion ("why is this commit only in main?")
- Makes cherry-pick-to-main releases harder to track

### Manual PR with Auto-Merge

Always create PR but auto-merge only if checks pass.

**Kept as implementation detail** — this is what we do:

- If sync is clean (no conflicts), auto-merge
- If sync has conflicts, require manual approval via PR

## Implementation

**Workflow:** `.github/workflows/release.yml` — post-release-sync job

```yaml
jobs:
  post-release-sync:
    runs-on: ubuntu-latest
    if: success() && !inputs.dry_run
    needs: [release]
    steps:
      # 1. Check out main branch (just released)
      # 2. Create post-release-sync branch
      # 3. Attempt merge of main into develop
      # 4. If no conflicts: push branch + create PR + auto-merge + delete branch
      # 5. If conflicts: push branch + create PR (manual) + post comment with conflict summary
      # 6. Artifact: post-release-sync-result.json
```

**Branch naming:** `ops/post-release-sync-main-to-develop`

**PR naming:** `ops: post-release sync main → develop`

**Execution timing:**

- After release job completes successfully
- Before GitHub Release is published (if possible)
- Skipped entirely if dry-run mode is active

## Consequences

**Positive:**

- ✅ Branches stay in sync automatically
- ✅ Hotfix releases don't require manual develop sync
- ✅ No additional developer work in normal case
- ✅ Conflicts are visible as PRs (not hidden)

**Negative:**

- ❌ If sync PR has conflicts, it must be manually merged (may delay develop integration)
- ❌ Adds ~2 minutes to release time (branch creation + merge)

**Risk mitigation:**

- Sync conflicts are rare (develop and main share same history normally)
- If conflict occurs, PR is visible immediately; team can resolve quickly
- For critical releases, conflict resolution takes seconds (usually just merge markers)

## Related Decisions

- [ADR-001: Develop-First Release Flow](./ADR-001-develop-first-release-flow.md) — Why sync is needed
- [ADR-004: Rollback & Error Handling](./ADR-004-rollback-strategy.md) — What happens if sync fails

## References

- [RELEASE_PROCESS.md](../../docs/RELEASE_PROCESS.md#post-release-sync) — Implementation details
- [.github/workflows/release.yml](../../.github/workflows/release.yml) — post-release-sync job

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

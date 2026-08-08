---
title: "ADR-001: Develop-First Release Flow"
description: "Decision to use a stacked PR model with develop as primary, then release PR to main"
file_type: documentation
date: 2026-08-08
adr_status: accepted
status: active
authors: ["LightSpeed Team"]
---

# ADR-001: Develop-First Release Flow

## Status

✅ **Accepted** — Implemented in Phase 1-2

## Context

Release workflows can follow two patterns:

1. **Direct Flow:** `release/vX.Y.Z` → `main` directly
2. **Develop-First (Stacked) Flow:** `release/vX.Y.Z` → `develop` (PR #1), then `develop` → `main` (PR #2)

The direct flow is simpler but requires post-release sync to update `develop`. The develop-first flow integrates changes to the primary development branch first, reducing merge complexity and ensuring `develop` stays in sync naturally.

## Decision

**Adopt the develop-first stacked PR flow:**

```
feature branch
    ↓ PR, integrate work
develop (main integration branch)
    ↓ trigger release workflow
release/vX.Y.Z branch (created by agent)
    ↓ [STACKED] PR #1: release/vX.Y.Z → develop (changelog + version bump)
    ↓ merge PR #1
develop (version bumped, changelog updated)
    ↓ [STACKED] PR #2: develop → main (after PR #1 merges)
    ↓ merge PR #2
main (tagged, release published)
    ↓ post-release-sync: main → develop (optional, if any cherry-picks to main)
```

## Rationale

**Advantages:**

- ✅ **Primary branch integration first** — `develop` sees every change before `main`
- ✅ **Natural sync** — `develop` always contains all released code (no manual sync needed in normal case)
- ✅ **Stacked PR benefits** — Both PRs visible in history; easy to revert both together if needed
- ✅ **Clear audit trail** — Version/changelog changes appear in `develop` history first
- ✅ **Simpler post-release** — Only sync back if hotfix was applied to `main` directly (rare)

**Trade-offs:**

- ⚠️ Two PR approvals (one per stacked PR) — mitigated by automation (same author, linked commits)
- ⚠️ Slightly longer release cycle (one extra PR merge) — ~5 additional minutes per release

## Alternatives Considered

### Direct Flow (release/vX.Y.Z → main)

```
release/vX.Y.Z → main (direct)
    ↓ merge
main (tagged)
    ↓ post-release-sync: main → develop (always required)
```

**Rejected because:**

- Requires mandatory post-release sync (complex, prone to conflicts)
- Changes appear in `main` first, `develop` second (non-standard)
- If post-release sync fails, `develop` can be stale for hours

### Single PR (release/vX.Y.Z → develop → main)

Combining both PRs into one PR and merging twice was considered but rejected:

- Violates single-PR-single-target GitHub model
- Makes it ambiguous which base branch to target
- Complicates history review

## Implementation

**Workflow:** `.github/workflows/release.yml`

```yaml
jobs:
  release:
    steps:
      # 1. Create release/vX.Y.Z branch from develop
      # 2. Bump VERSION + update CHANGELOG.md
      # 3. Create PR #1: release/vX.Y.Z → develop
      # 4. Wait for PR #1 merge
      # 5. Create PR #2: release/vX.Y.Z → main
      # 6. Wait for PR #2 merge
      # 7. Tag + publish GitHub Release
```

**Agent:** `scripts/agents/release/release.agent.js` (portable, reusable)

## Consequences

**Positive:**

- ✅ Cleaner git history (two stacked PRs, both merged)
- ✅ All version changes in `develop` first
- ✅ Works across all repo types (plugin, theme, control plane)
- ✅ Portable agent pattern (reusable in other LightSpeedWP repos)

**Negative:**

- ❌ Requires two PR reviews (mitigated by automation)
- ❌ Release takes ~5 min longer per PR merge

## Related Decisions

- [ADR-002: Authorization Gating Strategy](./ADR-002-authorization-gating.md) — Controls who can trigger releases
- [ADR-003: Post-Release Sync Automation](./ADR-003-post-release-sync.md) — Handles rare main→develop sync
- [ADR-004: Rollback & Error Handling](./ADR-004-rollback-strategy.md) — Handles release failures

## References

- [RELEASE_PROCESS.md](../RELEASE_PROCESS.md) — Implementation details
- [BRANCHING_STRATEGY.md](../BRANCHING_STRATEGY.md) — Branch naming & protection rules
- Issue #1290 — Initial repository structure alignment epic

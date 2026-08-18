---
title: 'ADR-004: Rollback & Error Handling Strategy'
description: Decision to provide automated rollback automation with manual final control
file_type: documentation
date: 2026-08-08T00:00:00.000Z
adr_status: accepted
status: active
authors:
  - LightSpeed Team
---

# ADR-004: Rollback & Error Handling Strategy

## Status

✅ **Accepted** — Implemented in Phase 1-2

## Context

Releases can fail at various stages:

1. **Before publish:** Changelog validation fails, version bump fails, etc. → No release was published; just fix and re-trigger
2. **After publish:** GitHub Release is published but subsequent steps fail (deploy, notification, etc.) → Release tag exists; code is live
3. **Post-release:** Release appears broken after publishing → Need to revert and republish

Each case requires different handling:

**Case 1: Pre-publish failure** → Automatic retry (no release exists)
**Case 2: Post-publish failure** → Partial rollback (undo what we can, notify team)
**Case 3: Post-release discovery** → Full rollback (delete release, revert tag, revert develop)

The question: Should rollback be **fully automatic, partially manual, or entirely manual**?

## Decision

**Implement semi-automated rollback with manual final control:**

- **Automatic rollback capability:** Provide `rollback.cjs` automation that can undo releases
- **Manual trigger:** Rollback must be explicitly approved (not automatic even on failure)
- **Partial automation:** Rollback script automates mechanics (delete tag, revert commits); team decides what to revert
- **Clear audit trail:** All rollback attempts logged with reason and result

**Rollback covers:**

- Deleting GitHub Release
- Deleting git tag
- Reverting commits to main (if needed)
- Reverting commits to develop (if needed)
- Post-rollback validation (verify tag deleted, release gone, branches correct)

## Rationale

**Why manual final control:**

- ✅ **Safety** — Rollbacks are high-impact; require human decision
- ✅ **Reduces automation complexity** — No need for automatic detection of "release is broken"
- ✅ **Clear ownership** — Someone explicitly owns the rollback decision
- ✅ **Time for analysis** — Team has time to understand failure before rolling back

**Why semi-automated (not fully manual):**

- ✅ **Reduces errors** — Script handles mechanics (delete tag, etc.); humans decide scope
- ✅ **Faster recovery** — Automation takes seconds; manual tag deletion would take minutes
- ✅ **Consistency** — All rollbacks follow same pattern

**Why audited:**

- ✅ **Compliance** — Record of who rolled back, when, why
- ✅ **Forensics** — Clear record of release vs. rollback history
- ✅ **Team learning** — History shows patterns (if certain types of releases fail often)

## Alternatives Considered

### Fully Automatic Rollback

Detect release failure automatically and rollback immediately.

**Rejected because:**

- Hard to define "broken" automatically (what metrics?)
- Risk of cascading failures (rollback fails, then what?)
- Better to let humans decide; releases aren't so frequent that manual approval adds burden

### Entirely Manual Rollback

No automation; team deletes tag and commits manually via git/GitHub.

**Rejected because:**

- Error-prone (easy to miss part of rollback, like version revert)
- Slow (requires multiple manual steps)
- Loses audit trail (who did what is unclear)

### Partial Automation + Auto-Approval

Script runs automatically; approves rollback without human decision.

**Rejected because:**

- Defeats the purpose of manual approval
- If rollback automation is wrong, it runs wrong automatically
- Better to require explicit decision

## Implementation

**Rollback script:** `scripts/agents/release/rollback.cjs` (CommonJS, runs in CI)

```javascript
// rollback.cjs — Available during release workflow runs

/**
 * Undo a release:
 * 1. Delete GitHub Release (if exists)
 * 2. Delete git tag (if exists)
 * 3. [Optional] Revert main commits (if flag set)
 * 4. [Optional] Revert develop commits (if flag set)
 * 5. Verify: Release deleted, tag deleted, branches correct
 * 6. Log: Rollback timestamp, scope, results
 */

// Usage:
// node rollback.cjs --release v1.5.0 --revert-main --revert-develop --reason "Failed deployment"
```

**Rollback workflow trigger:** `.github/workflows/release.yml` — manual rollback input

```yaml
on:
  workflow_dispatch:
    inputs:
      rollback_version:
        description: "Version to rollback (e.g., v1.5.0)"
        required: false
      rollback_scope:
        description: "What to rollback"
        type: choice
        options:
          - release_only (delete release + tag)
          - release_and_main (revert main commits)
          - full (revert main + develop commits)
      reason:
        description: "Reason for rollback (for audit log)"
        required: false
```

**Rollback decision criteria:**

| Scope | When to Use | Effect |
|-------|------------|--------|
| `release_only` | Release published but is broken; code needs cleanup later | Removes release + tag; branches unchanged |
| `release_and_main` | Release broken; need to revert main to previous working state | Reverts main commits back to previous release; removes tag |
| `full` | Release broken; need to clean up both branches completely | Reverts both main and develop to pre-release state |

## Consequences

**Positive:**

- ✅ Clear, audited rollback capability
- ✅ Prevents accidental cascading failures
- ✅ Team controls rollback scope
- ✅ Reduces cognitive load (manual approval = time to think)

**Negative:**

- ❌ Rollback takes time (manual approval + execution)
- ❌ Requires team training (what's `release_only` vs `full`?)
- ❌ If automation fails, manual rollback may be needed

**Mitigation:**

- Document rollback procedure in runbook
- Test rollback before release goes critical
- Keep rollback.cjs simple and well-tested

## Related Decisions

- [ADR-001: Develop-First Release Flow](./ADR-001-develop-first-release-flow.md) — What we're rolling back
- [ADR-002: Authorization Gating](./ADR-002-authorization-gating.md) — Who can trigger rollback
- [ADR-003: Post-Release Sync](./ADR-003-post-release-sync.md) — How to keep branches in sync after rollback

## References

- [scripts/agents/release/rollback.cjs](../../scripts/workflows/release/rollback.cjs) — Rollback automation
- [RELEASE_PROCESS.md](../../docs/RELEASE_PROCESS.md#error-handling--rollback) — Error handling details
- [Emergency Response Runbook](../RUNBOOKS/EMERGENCY_RESPONSE.md) — When to use rollback

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

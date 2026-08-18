---
title: 'ADR-002: Authorisation Gating Strategy'
description: Decision to gate release workflow triggers to maintainers team with audit logging
file_type: documentation
date: 2026-08-08T00:00:00.000Z
adr_status: accepted
status: active
authors:
  - LightSpeed Team
---

# ADR-002: Authorisation Gating Strategy

## Status

✅ **Accepted** — Implemented in Phase 1-2

## Context

Release workflows have high impact: they create tags, publish releases, and communicate changes to users. Unauthorized or accidental releases can:

- Publish incomplete features
- Break downstream integrations
- Trigger unwanted notifications
- Create security vulnerabilities

Three gating strategies exist:

1. **No gating:** Anyone can trigger releases (high risk)
2. **Role-based gating:** Only members of specific GitHub teams can trigger
3. **Manual approval:** Release requires an additional approval step after trigger

## Decision

**Implement role-based gating with audit logging:**

- Only members of the `maintainers` team in lightspeedwp organisation can trigger releases
- Trigger validation runs as a separate job (before any release logic)
- All authorisation attempts (success + failure) logged to `trigger-telemetry.json`
- Unauthorized attempts cause the workflow to fail immediately (no override possible)

**Authorisation validation includes:**

1. **Event validation:** Only `workflow_dispatch` and `workflow_call` events allowed (blocks `push`, `schedule`, malformed events)
2. **Actor validation:** Trigger actor must be current member of `maintainers` team (cached, refreshed hourly)
3. **Audit logging:** All attempts recorded with timestamp, actor, event type, success/failure reason

## Rationale

**Why role-based gating:**

- ✅ **Scalable** — New team members automatically gain release rights when added to team
- ✅ **Auditable** — Clear record of who triggered each release attempt
- ✅ **Explicit** — No magic; maintainers know they're responsible
- ✅ **GitHub-native** — Uses existing team infrastructure; no external tools

**Why audit logging:**

- ✅ **Compliance** — Records intent for security audits
- ✅ **Debugging** — Helps diagnose authorisation failures
- ✅ **Forensics** — Complete history of who attempted releases, when, and whether they succeeded
- ✅ **Transparency** — Team can review all release activity

**Why fail-fast (no override):**

- ✅ **Security** — Prevents accidental override of authorisation checks
- ✅ **Simplicity** — No special cases or bypass codes to manage
- ✅ **Clarity** — If workflow fails, reason is always visible in logs

## Alternatives Considered

### No Gating

Anyone can trigger releases from GitHub Actions UI.

**Rejected because:**

- High risk (accidental releases, unauthorized users)
- No audit trail (can't track who released what)
- Violates least-privilege principle

### CODEOWNERS-Based Gating

Use GitHub's CODEOWNERS file to require specific people to approve releases.

**Rejected because:**

- Works for PRs, not workflows
- Workflows don't support CODEOWNERS approval gate
- Would require manual approval for every release (too slow)

### Time-Based Gating

Only allow releases during specific hours (e.g., business hours).

**Rejected because:**

- Arbitrary; doesn't prevent unauthorized users
- Breaks urgent hotfix releases outside hours
- Complicates deployment schedules

## Implementation

**Workflow:** `.github/workflows/release.yml` — trigger-telemetry job

```yaml
jobs:
  trigger-telemetry:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      # 1. Validate event type (must be workflow_dispatch or workflow_call)
      # 2. Fetch maintainers team membership
      # 3. Check if trigger actor is in maintainers team
      # 4. Log result to trigger-telemetry.json
      # 5. Fail if unauthorized (set outcome to failure)
      # 6. Artifact: trigger-telemetry.json
```

**Telemetry format** (trigger-telemetry.json):

```json
{
  "event": "workflow_dispatch|workflow_call|push|...",
  "actor": "username",
  "is_authorized": true|false,
  "unauthorized_attempts": 0|N,
  "failure_reason": null|"Invalid event type: ...|Actor not in maintainers team|...",
  "timestamp": "2026-08-08T14:30:00Z",
  "resolved_at": "..."
}
```

## Consequences

**Positive:**

- ✅ Only authorized team members can release
- ✅ Complete audit trail of all release attempts
- ✅ Fails fast on unauthorized attempts (before any release logic)
- ✅ Scales automatically as team changes

**Negative:**

- ❌ Requires PR to add new members to maintainers team
- ❌ If team sync fails (API issue), authorisation may incorrectly reject valid actors

**Mitigation for team sync failure:**

- Retry logic with exponential backoff in trigger-telemetry job
- Fallback: manual team membership check if API fails (rare)

## Related Decisions

- [ADR-001: Develop-First Release Flow](./ADR-001-develop-first-release-flow.md) — What flow is authorized
- [ADR-004: Rollback & Error Handling](./ADR-004-rollback-strategy.md) — How to handle release failures

## References

- [RELEASE_PROCESS.md](../../docs/RELEASE_PROCESS.md#authorisation-gating) — Authorisation implementation
- [.github/workflows/release.yml](../../.github/workflows/release.yml) — Trigger validation job
- [GitHub Teams API](https://docs.github.com/en/rest/teams) — Team membership lookup

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

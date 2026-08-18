---
name: agentic-release-admin-guide
title: Administering the Agentic Release Workflow
description: Admin guide for Phase 5A agentic release workflow — architecture, authorization, gates, audit logging, security, troubleshooting
author: Ash Shaw
status: stable
updated_date: 2026-08-12T00:00:00.000Z
type: documentation
---

# Administering the Agentic Release Workflow

**Quick Ref:** 3 min | **Full Guide:** 20 min | **User Guide:** [AGENTIC_RELEASE_USER_GUIDE.md](./AGENTIC_RELEASE_USER_GUIDE.md)

---

## Architecture Overview

The agentic release workflow is a **10-step orchestrator** that augments Phase 4 release machinery with intelligent decision-making and structured approval flows.

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│         USER INVOKES AGENTIC RELEASE WORKFLOW            │
│  node .github/agentic-workflows/release.agent.js        │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────▼───────────┐
         │  STEP 1: INITIALIZE   │
         │  Pre-flight Checks    │
         │  ✅ Branch validation │
         │  ✅ Uncommitted check │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │  STEP 2: AGENTIC      │
         │  Reasoning            │
         │  📊 Score: 0.0–1.0    │
         │  📊 Risk Assessment   │
         └───────────┬───────────┘
                     │
    ┌────────────────▼────────────────┐
    │  STEPS 3–9: 7 SAFETY GATES      │
    │  ├─ Gate 1: Changelog Valid     │
    │  ├─ Gate 2: Agentic Score       │
    │  ├─ Gate 3: Version Consistent  │
    │  ├─ Gate 4: Tag Unique          │
    │  ├─ Gate 5: Authorization       │
    │  ├─ Gate 6: Integrity Filter    │
    │  └─ Gate 7: Approval Flow       │
    └────────────────┬────────────────┘
                     │
         ┌───────────▼───────────┐
         │  STEP 10: REPORT      │
         │  Generation           │
         │  JSON + Audit Log     │
         └───────────┬───────────┘
                     │
    ┌────────────────▼────────────────┐
    │  OUTCOME: SUCCESS or FAILURE    │
    │  ├─ Auto-approve (patch)        │
    │  ├─ Wait for review (minor)     │
    │  ├─ Dual approval (major)       │
    │  └─ Report generated            │
    └────────────────────────────────┘
    
    ┌────────────────────────────────┐
    │  FALLBACK: PHASE 4 SHELL       │
    │  If agentic fails, use shell   │
    │  bash .github/scripts/release/ │
    │  release.sh [scope]            │
    └────────────────────────────────┘
```

### Key Components

1. **Orchestrator** (`.github/agentic-workflows/release.agent.js` — 490 lines)
   - 10-step workflow engine
   - Decision-making logic
   - Safety gate validation
   - Audit logging

2. **Phase 4 Scripts** (wrapped, not modified)
   - `trigger-telemetry.cjs` — Authorization
   - `release.agent.js` — Version bump, changelog
   - `create-main-release-pr.cjs` — PR creation

3. **GitHub Infrastructure**
   - GitHub Actions (execution)
   - GitHub API (PRs, releases, tags)
   - Branch protection rules
   - Mergify (sequential PR processing)

---

## Authorization Model

The agentic release workflow enforces a **two-layer authorization model**:

### Layer 1: GitHub Team Membership

**Check:** User must be in `maintainers` team

```bash
# Verify maintainer status
gh api /orgs/{org}/teams/maintainers/members/{username}
```

**Enforcement:** Gate 5 (Authorization) validates this before proceeding

### Layer 2: Trigger-Telemetry Integration

**Check:** Trigger-telemetry job validates authorization (non-blocking)

**Design:** If trigger-telemetry fails, release continues but is flagged in audit log

**Purpose:** Tracks who initiated releases for compliance and incident response

### Authorization Workflow

```
User runs: npm version patch && release.agent.js --scope=patch
                               |
                    ┌──────────▼──────────┐
                    │  Gate 5: AuthCheck  │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ GitHub Teams API    │
                    │ Is user in          │
                    │ maintainers?        │
                    └──────────┬──────────┘
                               │
                  ┌────────────┴────────────┐
                  │                        │
               YES                        NO
                  │                        │
                  ▼                        ▼
            ✅ Proceed          ❌ DENY RELEASE
               to gates           (auth failure)
                  │
                  ▼
        ┌─────────────────────┐
        │ Trigger-Telemetry   │
        │ (log who, when)     │
        │ [non-blocking]      │
        └─────────────────────┘
```

### User Roles & Permissions

| Role | Can Release Patch | Can Release Minor | Can Release Major |
|------|-------------------|-------------------|-------------------|
| Maintainer | ✅ Auto-approve | ✅ Needs review | ✅ Needs dual sign-off |
| Team member | ❌ Denied | ❌ Denied | ❌ Denied |
| Contributor | ❌ Denied | ❌ Denied | ❌ Denied |

### Granting Maintainer Access

To add a user to the maintainers team:

```bash
# Add user to maintainers team
gh api -X PUT /orgs/{org}/teams/maintainers/memberships/{username} \
  -f role=member

# Verify
gh api /orgs/{org}/teams/maintainers/members
```

---

## Approval Gates & Tiers

The workflow enforces a **3-tier approval system** based on release scope:

### Tier 1: Patch (Auto-Approve)

**Triggered by:** `--scope=patch`

**Approval required:** None (automatic if gates pass)

**Gate sequence:**

1. ✅ Changelog valid
2. ✅ Agentic score ≥ 0.8
3. ✅ Version consistent
4. ✅ Tag unique
5. ✅ Authorization verified
6. ✅ Integrity filter passes
7. ✅ Release proceeds immediately

**Timeline:** < 5 minutes

**Example:**

```bash
npm version patch
node .github/agentic-workflows/release.agent.js --scope=patch
# Result: Auto-approved, tag created, release live
```

---

### Tier 2: Minor (Manual Review)

**Triggered by:** `--scope=minor`

**Approval required:** 1 maintainer review

**Gate sequence:**

1. ✅ Changelog valid
2. ✅ Agentic score ≥ 0.6
3. ✅ Version consistent
4. ✅ Tag unique
5. ✅ Authorization verified
6. ✅ Integrity filter passes
7. ⏳ PAUSED — waiting for approval

**Approval check:**

```bash
# Agentic polls for maintainer comment
# Triggers on: "approved", "LGTM", "looks good"
# Example maintainer comment:
# "approved" ✅ → Release proceeds
```

**Timeline:** 10–30 minutes (depends on maintainer review)

**Example:**

```bash
npm version minor
node .github/agentic-workflows/release.agent.js --scope=minor
# Creates PR, waits for comment → maintainer: "approved"
# Result: Tag created, release live
```

---

### Tier 3: Major (Dual Approval + ADR)

**Triggered by:** `--scope=major`

**Approval required:** 2 maintainers + Architecture Decision Record

**Gate sequence:**

1. ✅ Changelog valid
2. ✅ Agentic score ≥ 0.5
3. ✅ Version consistent
4. ✅ Tag unique
5. ✅ Authorization verified
6. ✅ Integrity filter passes
7. ⏳ PAUSED — waiting for 2 approvals + ADR

**Approval checks:**

```bash
# Must have:
# - 2+ "approved" comments from maintainers
# - ADR linked in PR or commit message
# - Breaking changes documented in CHANGELOG

Example PR comments:
Maintainer 1: "approved" ✅
Maintainer 2: "approved" ✅
ADR check: (scanned from commit message)
Breaking docs: (verified in CHANGELOG)
→ All pass → Release proceeds
```

**Timeline:** 1–4 hours (requires coordination)

**Example:**

```bash
npm version major
# Add ADR to commit: "Fixes #123 — ADR: Architecture rewrite"
node .github/agentic-workflows/release.agent.js --scope=major
# Creates PR, waits for 2 approvals + ADR validation
# Result: Tag created, release live
```

---

## Audit Logging

The workflow generates **comprehensive audit logs** in JSON format. All logs are safe to share (no secrets).

### Log Format

```json
{
  "timestamp": "2026-08-28T10:30:00Z",
  "user": "ashley@lightspeedwp.agency",
  "userTeam": "maintainers",
  "action": "release_patch",
  "scope": "patch",
  "version": "v1.5.0",
  "previousVersion": "v1.4.9",
  "agenticScore": 0.92,
  "gates": {
    "changelog_valid": {
      "status": "PASS",
      "entries": 11,
      "timestamp": "2026-08-28T10:30:01Z"
    },
    "agentic_score": {
      "status": "PASS",
      "score": 0.92,
      "threshold": 0.8,
      "timestamp": "2026-08-28T10:30:02Z"
    },
    "version_consistent": {
      "status": "PASS",
      "versionBump": "patch",
      "timestamp": "2026-08-28T10:30:03Z"
    },
    "tag_unique": {
      "status": "PASS",
      "tag": "v1.5.0",
      "timestamp": "2026-08-28T10:30:04Z"
    },
    "authorization": {
      "status": "PASS",
      "maintainer": true,
      "triggerTelemetry": "logged",
      "timestamp": "2026-08-28T10:30:05Z"
    },
    "integrity_filter": {
      "status": "PASS",
      "mutations": 3,
      "mutations_detail": [
        "commit:version-bump",
        "tag:v1.5.0",
        "release:github"
      ],
      "timestamp": "2026-08-28T10:30:06Z"
    },
    "approval_flow": {
      "status": "AUTO_APPROVED",
      "tier": "patch",
      "approvalTime": "instant",
      "timestamp": "2026-08-28T10:30:07Z"
    }
  },
  "dryRun": false,
  "result": "SUCCESS",
  "prNumber": 1234,
  "releaseUrl": "https://github.com/lightspeedwp/.github/releases/tag/v1.5.0",
  "auditId": "rel-20260828-103000-abc123",
  "notes": "Patch release: bug fixes and improvements"
}
```

### Log Access

Logs are stored in:

- **GitHub Actions workflow logs** (`.github/workflows/release.yml`)
- **GitHub Release notes** (structured in release body)
- **Audit trail file** (`.github/reports/releases/`)

**Query example:**

```bash
# View logs from CLI
gh workflow view release.yml

# View release notes
gh release list --limit 10

# Search logs
gh api repos/{owner}/{repo}/actions/workflows/release.yml/runs \
  --jq '.workflow_runs[] | select(.conclusion=="success")'
```

### Log Retention

- **GitHub Actions logs:** 90 days (GitHub default)
- **Release notes:** Indefinite (GitHub releases)
- **Audit trail:** Archive in `.github/reports/releases/`

---

## Security Considerations

### Threat Model

1. **Unauthorized release** — User not in maintainers team
   - **Mitigation:** Gate 5 (Authorization) blocks
   - **Test:** Test 4 (Auth Failure)

2. **Malicious version injection** — Attacker manipulates version tag
   - **Mitigation:** Gate 3 (Version Consistent) + Gate 4 (Tag Unique)
   - **Test:** Test 3 (Version Conflict)

3. **Code injection via changelog** — Attacker injects shell commands
   - **Mitigation:** YAML parser used safely (not eval)
   - **Test:** Test 2 (Broken Changelog)

4. **Approval bypass** — Attacker bypasses major approval
   - **Mitigation:** Dual-approval enforcement + ADR requirement
   - **Test:** Test 7 (Major Approval)

5. **Supply chain compromise** — Attacker modifies release artifacts
   - **Mitigation:** Integrity filter validates all mutations
   - **Test:** Test 8 (Fallback Safety)

### Security Checklist

- ✅ No secrets in logs (api keys, tokens masked)
- ✅ No command injection (all inputs validated)
- ✅ No unsafe mutations (integrity filter)
- ✅ Authorization gates enforced (maintainers team)
- ✅ Audit trail complete (all decisions logged)
- ✅ Safe outputs (no unescaped HTML/SQL)

**See:** [SECURITY_REVIEW.md](./.github/agentic-workflows/SECURITY_REVIEW.md)

---

## Troubleshooting

### Common Issues & Solutions

#### Issue: "Authorization failed — not in maintainers team"

**Cause:** User is not in the maintainers team

**Solution:**

1. Verify team membership: `gh api /orgs/{org}/teams/maintainers/members`
2. Add user to team: `gh api -X PUT /orgs/{org}/teams/maintainers/memberships/{username}`
3. Retry release: `node .github/agentic-workflows/release.agent.js --scope=patch`

---

#### Issue: "Changelog validation failed"

**Cause:** CHANGELOG.md is broken or missing

**Solution:**

1. Check CHANGELOG.md exists: `ls docs/CHANGELOG.md` or `ls CHANGELOG.md`
2. Validate YAML: `npm run validate:frontmatter -- CHANGELOG.md`
3. Fix issues (syntax, entries)
4. Retry: `node .github/agentic-workflows/release.agent.js --scope=patch --dry-run`

---

#### Issue: "Version mismatch — v1.5.0 already released"

**Cause:** Version tag already exists

**Solution:**

1. Check existing versions: `git tag | grep v1.5`
2. Bump to new version: `npm version patch` (v1.5.0 → v1.5.1)
3. Retry: `node .github/agentic-workflows/release.agent.js --scope=patch`

---

#### Issue: "Waiting for approval — 1 of 2 maintainers approved"

**Cause:** Major release needs 2 approvals, only has 1

**Solution:**

1. Ask second maintainer to review PR
2. Maintainer comments: "approved"
3. Agentic detects approval and releases

---

#### Issue: "Confidence too low: score 0.45"

**Cause:** Agentic score below threshold

**Solution:**

1. Review dry-run output: `node .github/agentic-workflows/release.agent.js --scope=patch --dry-run`
2. See what gates are failing
3. Fix issues (changelog, version, etc.)
4. Use Phase 4 fallback if needed: `bash .github/scripts/release/release.sh patch`

---

### Escalation Path

**Level 1: User tries self-help**

- Read user guide: [AGENTIC_RELEASE_USER_GUIDE.md](./AGENTIC_RELEASE_USER_GUIDE.md)
- Run dry-run to see detailed error
- Check FAQ section

**Level 2: Maintainer reviews**

- Check authorization: is user in maintainers team?
- Check changelog/version: are they valid?
- Review agentic score: any flags in confidence check?

**Level 3: Security/Release team**

- If authorization issue: escalate to admin team
- If recurring failures: file GitHub issue
- If security concern: report in security channel

**Level 4: Emergency fallback**

- Use Phase 4 shell scripts directly: `bash .github/scripts/release/release.sh patch`
- Never block releases permanently

---

## Monitoring & Metrics

### Success Metrics

Track these metrics to monitor agentic release health:

| Metric | Target | How to Track |
|--------|--------|--------------|
| Test pass rate | 100% (9/9) | GitHub Actions workflow results |
| Patch release cycle time | < 5 min | Audit logs (timestamp to result) |
| Minor approval time | < 30 min | GitHub PR review time |
| Major approval time | < 4 hours | GitHub PR review time |
| Release success rate | ≥ 99% | Count successful vs. failed releases |
| Authorization failures | < 1% | Audit logs with status=DENIED |
| Fallback usage rate | < 5% | Logs with engine=shell |

### Monitoring Dashboard (Optional)

```bash
# Generate metrics report
gh api repos/{owner}/{repo}/actions/workflows/release.yml/runs \
  --jq '.workflow_runs[] | {name, conclusion, created_at, updated_at}' \
  > /tmp/releases.json

# Analysis
jq '[.[] | select(.conclusion=="success")] | length' /tmp/releases.json
# Output: Number of successful releases
```

### Alerting (Future Phase)

Recommend setting up alerts for:

- ⚠️ Authorization failures (potential security issue)
- ⚠️ Repeated changelog errors (process breakdown)
- ⚠️ Fallback overuse (agentic layer reliability)
- ⚠️ Slow approval times (process bottleneck)

---

## Fallback Procedures

### When to Use Fallback

Use Phase 4 shell scripts directly if:

1. Agentic layer is unavailable (API error, timeout)
2. Agentic score is too low (confidence < threshold)
3. You need manual full control
4. Debugging the agentic layer

### How to Fall Back

```bash
# Use Phase 4 shell directly
bash .github/scripts/release/release.sh patch

# This executes:
# 1. Version bump
# 2. Changelog management
# 3. PR creation to main
# 4. Tag creation
# 5. GitHub Release

# Still enforces:
# ✅ Branch validation
# ✅ Changelog validation
# ✅ Version consistency
# ✅ Authorization (via trigger-telemetry)
```

### Fallback vs. Agentic

| Feature | Agentic | Phase 4 Shell |
|---------|---------|---------------|
| Auto-approve patches | ✅ | ❌ Manual |
| Approval flow | ✅ (tiered) | ❌ (single) |
| Dry-run preview | ✅ | ❌ |
| Audit JSON report | ✅ | ❌ |
| Risk scoring | ✅ (0-1.0) | ❌ |
| Fallback if fails | ✅ | ❌ (last resort) |

---

## Related Documentation

- **User Guide:** [AGENTIC_RELEASE_USER_GUIDE.md](./AGENTIC_RELEASE_USER_GUIDE.md)
- **Process Guide:** [docs/RELEASE_PROCESS.md](./RELEASE_PROCESS.md)
- **Branching Strategy:** [docs/BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)
- **Security Review:** [.github/agentic-workflows/SECURITY_REVIEW.md](./.github/agentic-workflows/SECURITY_REVIEW.md)
- **Test Results:** [.github/agentic-workflows/TEST_RESULTS.md](./.github/agentic-workflows/TEST_RESULTS.md)
- **Implementation:** [.github/agentic-workflows/release.md](./.github/agentic-workflows/release.md)

---

## Key Takeaways

✅ **Authorization is two-layer** — GitHub teams + trigger-telemetry  
✅ **Approval is scope-based** — Patch auto, minor manual, major dual  
✅ **Audit logging is comprehensive** — JSON format, no secrets  
✅ **Security is multi-gate** — 7 safety gates + integrity filter  
✅ **Fallback is always available** — Phase 4 shell scripts as last resort

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

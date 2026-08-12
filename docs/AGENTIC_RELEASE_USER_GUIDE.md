---
name: agentic-release-user-guide
title: Using the Agentic Release Workflow
description: User guide for the Phase 5A agentic release workflow — when, how, and why to use agentic releases
author: Ash Shaw
status: stable
updated_date: 2026-08-12
type: documentation
---

# Using the Agentic Release Workflow

**Quick Read:** 2 min | **Full Guide:** 10 min | **Related:** [Admin Guide](./AGENTIC_RELEASE_ADMIN_GUIDE.md) | [Process](./RELEASE_PROCESS.md)

---

## What Is the Agentic Release Workflow?

The **agentic release workflow** is an intelligent release orchestrator that automates the decision-making and approval process for creating releases. It wraps the existing Phase 4 release scripts with a safety-first, reasoning-based approach to releases.

### Key Capabilities

- ✅ **Automatic decision-making** — Analyzes release scope (patch, minor, major) and confidence level
- ✅ **Smart approval flows** — Patches auto-approve; minor requires review; major requires dual sign-off
- ✅ **Safety gates** — 7 layers of validation before any mutations
- ✅ **Dry-run support** — Preview releases before going live
- ✅ **Fallback guarantee** — Reverts to Phase 4 shell scripts if agentic layer fails
- ✅ **Complete audit trail** — All decisions logged in structured JSON format

### What It Does NOT Do

- ❌ Does not change the underlying Phase 4 release machinery
- ❌ Does not require learning new Git workflows
- ❌ Does not bypass existing branch protection rules
- ❌ Does not modify code outside `CHANGELOG.md`, version files, and release PRs

---

## When to Use Agentic Releases

### Use Agentic When

You are ready to release code and want:

1. **Faster approval for low-risk patches** — Auto-approves if confidence ≥ 0.8
2. **Structured approval for minor versions** — One maintainer review
3. **Dual sign-off for major versions** — Two maintainers + architecture review
4. **Risk assessment** — Agentic scores confidence 0–1.0
5. **Audit trail** — Complete JSON log of all decisions

### Use Phase 4 Shell Scripts When

You need:

1. **Manual full control** — Direct shell script invocation
2. **Offline releases** — No agentic layer (fallback available)
3. **Custom approval workflows** — Scripting beyond standard tiers
4. **Debugging** — Direct visibility into shell operations

**Note:** Both approaches are supported. Agentic is optional.

---

## Decision Tree: Patch vs. Minor vs. Major

```
                        Ready to Release?
                              |
                    ┌─────────┴─────────┐
                    |                   |
              Is it a fix          Is it a breaking
              or improvement?      change?
              |                         |
              YES                       YES
              |                         |
              ↓                         ↓
           PATCH                     MAJOR
         (auto-approve)         (dual approval)
                    |               |
                    └───────┬───────┘
                            |
                      Is it a new
                      feature?
                            |
                          YES
                            |
                            ↓
                          MINOR
                      (manual review)
```

### Patch Release

**Trigger:** Bug fixes, minor improvements, documentation updates

```bash
# Example: fixing a critical bug
git checkout develop
npm version patch
git push
node .github/agentic-workflows/release.agent.js --scope=patch --dry-run
# If happy:
node .github/agentic-workflows/release.agent.js --scope=patch
```

**Approval:** Automatic (if confidence ≥ 0.8)  
**Time to Release:** < 5 minutes  
**Risk Level:** Low

---

### Minor Release

**Trigger:** New features, API additions, non-breaking changes

```bash
# Example: adding a new hook
git checkout develop
npm version minor
git push
node .github/agentic-workflows/release.agent.js --scope=minor --dry-run
# Creates PR → Wait for maintainer approval
# Maintainer comments: "approved" or "LGTM"
# Agentic detects and releases
```

**Approval:** Manual (one maintainer review required)  
**Time to Release:** 10–30 minutes  
**Risk Level:** Medium

---

### Major Release

**Trigger:** Breaking changes, major API rewrites, infrastructure updates

```bash
# Example: complete plugin rewrite
git checkout develop
npm version major
git push
# MUST include ADR (Architecture Decision Record)
node .github/agentic-workflows/release.agent.js --scope=major --dry-run
# Creates PR → Wait for 2 maintainer approvals
# Maintainers comment: "approved" (2x minimum)
# Agentic verifies dual approval + ADR + breaking docs
# Releases only if all conditions met
```

**Approval:** Dual sign-off (two maintainers + ADR)  
**Time to Release:** 1–4 hours  
**Risk Level:** High (requires preparation)

---

## How to Initiate a Release

### Step 1: Prepare Your Branch

Ensure `develop` is up-to-date with all intended changes:

```bash
git checkout develop
git pull origin develop
npm ci
npm test  # Ensure all tests pass
```

### Step 2: Run Dry-Run (Recommended)

Always preview before going live:

```bash
node .github/agentic-workflows/release.agent.js --scope=patch --dry-run
```

**Output:** Detailed report showing:

- Changelog validation
- Version consistency check
- Authorization check
- Integrity filter results
- Approval flow (who will be asked)
- Dry-run summary (no mutations)

### Step 3: Go Live (If Satisfied)

Once dry-run passes:

```bash
node .github/agentic-workflows/release.agent.js --scope=patch
```

**Output:** Release initiated. Monitor PR and approval flow:

- **Patch:** Releases immediately if confidence ≥ 0.8
- **Minor:** Waits for maintainer comment ("approved")
- **Major:** Waits for 2+ maintainer comments + ADR check

---

## Approval Flows Explained

### Patch Auto-Approval

Agentic automatically approves patch releases if:

- ✅ Changelog is valid
- ✅ Version is correct (no duplicates)
- ✅ You are a maintainer
- ✅ Agentic confidence score ≥ 0.8 (integrity filter passes)
- ✅ Dry-run succeeds

**Flow:**

```
You:   npm version patch && release.agent.js --scope=patch
       ↓
Agentic: Validates 5 gates (changelog, version, auth, integrity, score)
       ↓
Agentic: All pass? Score 0.92 (healthy)
       ↓
Agentic: Approve automatically ✅
       ↓
Release: PR created → merged → tag created → GitHub Release
```

**Time:** < 5 minutes

---

### Minor Manual Approval

Minor releases require a maintainer review. Agentic waits for explicit approval:

**Flow:**

```
You:   npm version minor && release.agent.js --scope=minor
       ↓
Agentic: Validates gates + creates PR
       ↓
Agentic: PAUSED — waiting for maintainer approval
       ↓
Maintainer: Reviews PR → comments "approved" or "LGTM"
       ↓
Agentic: Detects approval comment ✅
       ↓
Release: PR merged → tag created → GitHub Release
```

**Approval Keywords:** `approved`, `LGTM`, `looks good`  
**Time:** 10–30 minutes

---

### Major Dual Approval

Major releases require two maintainers and an ADR:

**Flow:**

```
You:   npm version major && release.agent.js --scope=major
       (MUST include ADR in commit message)
       ↓
Agentic: Validates gates + creates PR (flags major)
       ↓
Agentic: PAUSED — waiting for 2 approvals + ADR check
       ↓
Maintainer 1: Reviews → comments "approved"
Maintainer 2: Reviews → comments "approved"
       ↓
Agentic: Verifies:
         - 2+ "approved" comments ✅
         - ADR present in history ✅
         - Breaking changes documented ✅
       ↓
Release: PR merged → tag created → GitHub Release
```

**Requirements:**

- 2+ maintainer approvals (minimum)
- ADR linked in PR or commit message
- Breaking changes documented in CHANGELOG

**Time:** 1–4 hours (requires coordination)

---

## Dry-Run Workflow (Best Practice)

**Always dry-run before going live.** Dry-run shows exactly what will happen without any mutations.

### Dry-Run Example

```bash
# 1. Check current state
git status
npm run validate:version

# 2. Run dry-run
node .github/agentic-workflows/release.agent.js --scope=patch --dry-run

# 3. Review output
# Expected output includes:
# - Changelog validation ✅
# - Version consistency ✅
# - Authorization ✅
# - Integrity filter ✅
# - Agentic score: 0.92 ✅
# - Approval flow: auto-approve
# - DRY-RUN: No mutations

# 4. If satisfied, go live
node .github/agentic-workflows/release.agent.js --scope=patch

# 5. Monitor release
gh pr list --search "state:open" | grep "Release"
gh release list --limit 5
```

### Dry-Run Output Example

```
═══════════════════════════════════════════════════════════════
         PHASE 5A AGENTIC RELEASE WORKFLOW — DRY-RUN
═══════════════════════════════════════════════════════════════

Step 1: Initialize & Pre-flight Checks
────────────────────────────────────────
✅ Branch: develop (valid)
✅ Uncommitted changes: none
✅ Dry-run mode: ENABLED

Step 2: Agentic Reasoning
────────────────────────────────────────
📊 Analyzing release scope: patch
📊 Confidence score: 0.92 (healthy)
📊 Risk assessment: LOW (patch release)
📊 Integrity filter: PASS

Steps 3-9: Seven Safety Gates
────────────────────────────────────────
✅ Gate 1: Changelog valid (11 entries)
✅ Gate 2: Version consistent (v1.5.0 → v1.5.1)
✅ Gate 3: Version consistency (no duplicates)
✅ Gate 4: Tag uniqueness (v1.5.1 not found)
✅ Gate 5: Authorization (maintainer verified)
✅ Gate 6: Integrity filter (all checks pass)
✅ Gate 7: Approval flow (auto-approve patch)

Step 10: Report Generation
────────────────────────────────────────
{
  "timestamp": "2026-08-28T10:30:00Z",
  "scope": "patch",
  "agenticScore": 0.92,
  "dryRun": true,
  "gates": {
    "changelog": "PASS",
    "version": "PASS",
    "authorization": "PASS",
    "integrity": "PASS",
    "approval": "AUTO_APPROVED",
    "dryRun": "SUCCESS",
    "audit": "LOGGED"
  },
  "result": "SUCCESS",
  "message": "DRY-RUN: Release is ready to go live"
}

═══════════════════════════════════════════════════════════════
Ready to release? Run without --dry-run to proceed.
═══════════════════════════════════════════════════════════════
```

---

## Safety Gates Explained

The agentic release workflow includes **7 safety gates**, each validating a specific aspect:

### Gate 1: Changelog Validation

**What it checks:** CHANGELOG.md is valid, schema-compliant, has entries for new version

**Pass condition:** Changelog exists, is parseable, contains release notes

**Fail message:** "Changelog validation failed: [reason]"

---

### Gate 2: Agentic Safety Score

**What it checks:** Agentic reasoning confirms release is safe (0–1.0 scale)

**Pass condition:** Score ≥ 0.8 for auto-approve (patches), ≥ 0.6 for manual review

**Fail message:** "Confidence too low: 0.45. Recommend manual review."

---

### Gate 3: Version Consistency

**What it checks:** Version follows semver, no duplicates, correct increment

**Pass condition:** Patch increments patch; minor increments minor+resets patch; etc.

**Fail message:** "Version mismatch: v1.5.0 is already released. Use v1.5.1"

---

### Gate 4: Tag Uniqueness

**What it checks:** Git tag doesn't already exist

**Pass condition:** vX.Y.Z tag not found in repo

**Fail message:** "Tag v1.5.0 already exists. Bump version and retry."

---

### Gate 5: Authorization

**What it checks:** User is a maintainer (trigger-telemetry + maintainers team)

**Pass condition:** User is in maintainers team (GitHub team membership)

**Fail message:** "Unauthorized: You are not in the maintainers team."

---

### Gate 6: Integrity Filter

**What it checks:** All planned mutations are safe (commits, tags, PRs, releases)

**Pass condition:** GitHub integrity filter validates all write operations

**Fail message:** "Integrity check failed: [description of unsafe operation]"

---

### Gate 7: Approval Flow

**What it checks:** Approval requirements met (patch auto, minor manual, major dual)

**Pass condition:** Patch: always (confidence ≥ 0.8); Minor: one comment; Major: two comments + ADR

**Fail message:** "Waiting for approval: 1 of 2 maintainers have approved."

---

## Error Handling & Fallback

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Changelog validation failed" | CHANGELOG.md is broken | Fix CHANGELOG.md and retry |
| "Version mismatch" | Wrong version bump | Use correct semver increment |
| "Tag already exists" | Tag was already created | Bump version and retry |
| "Unauthorized" | Not a maintainer | Ask maintainer to run release |
| "Confidence too low" | Agentic score < 0.6 | Use manual release (Phase 4) |

### Fallback to Phase 4 Scripts

If agentic layer fails, you can always fall back to Phase 4 shell scripts:

```bash
# Fallback: Use Phase 4 shell scripts directly
bash .github/scripts/release/release.sh patch

# This bypasses agentic layer entirely
# Still enforces all Phase 4 safety gates
```

**Note:** Fallback is always available. No release is ever blocked permanently.

---

## FAQ — Frequently Asked Questions

### Q: Do I need to learn new Git commands?

**A:** No. Agentic wraps the existing Phase 4 workflow. You use the same commands:

```bash
git checkout develop
npm version patch
node .github/agentic-workflows/release.agent.js --scope=patch
```

---

### Q: What if my release fails?

**A:** Dry-run first to validate:

```bash
node .github/agentic-workflows/release.agent.js --scope=patch --dry-run
# Fix any errors reported
node .github/agentic-workflows/release.agent.js --scope=patch  # Go live
```

---

### Q: How long does a release take?

**A:**

- Patch: < 5 min (auto-approve)
- Minor: 10–30 min (manual review)
- Major: 1–4 hours (dual approval + coordination)

---

### Q: Can I release outside business hours?

**A:** Yes, agentic is always available. Patches auto-approve instantly. Minor/major releases wait for maintainer approval (async, no timeout).

---

### Q: What happens if I disagree with agentic?

**A:** Agentic is a tool, not a blocker. You can:

1. **Disagree with auto-approval:** Use dry-run to see why, then go live anyway
2. **Ask for manual review:** Fall back to Phase 4 shell scripts
3. **Report issues:** Create GitHub issue with your feedback

---

### Q: Is agentic required?

**A:** No. Phase 4 shell scripts are always available as a fallback:

```bash
# Option 1: Use agentic
node .github/agentic-workflows/release.agent.js --scope=patch

# Option 2: Use Phase 4 shell directly
bash .github/scripts/release/release.sh patch
```

---

## Key Takeaways

✅ **Agentic releases are fast** — Patches auto-approve in < 5 min  
✅ **Agentic releases are safe** — 7 safety gates + audit trail  
✅ **Agentic releases are optional** — Phase 4 fallback always available  
✅ **Always dry-run first** — Preview before going live  
✅ **Follow approval flow** — Patch auto, minor manual, major dual  

---

## Next Steps

1. **Try a dry-run:** `node .github/agentic-workflows/release.agent.js --scope=patch --dry-run`
2. **Read the admin guide** if you need technical details: [AGENTIC_RELEASE_ADMIN_GUIDE.md](./AGENTIC_RELEASE_ADMIN_GUIDE.md)
3. **Check the process guide** for full release context: [RELEASE_PROCESS.md](./RELEASE_PROCESS.md)

---

## Related Resources

- **Admin Guide:** [AGENTIC_RELEASE_ADMIN_GUIDE.md](./AGENTIC_RELEASE_ADMIN_GUIDE.md)
- **Release Process:** [docs/RELEASE_PROCESS.md](./RELEASE_PROCESS.md)
- **Branching Strategy:** [docs/BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)
- **Implementation Details:** [.github/agentic-workflows/release.md](./.github/agentic-workflows/release.md)

---

**Built by 🧱 LightSpeedWP | Phase 5A Agentic Workflows**

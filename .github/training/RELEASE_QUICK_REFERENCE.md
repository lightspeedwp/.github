---
file_type: documentation
title: Release Workflow Quick Reference
description: One-page cheat sheet for release operations
version: v1.0
last_updated: '2026-08-22'
status: active
---

# Release Workflow Quick Reference Card

**Print this card and keep at your desk during releases.**

---

## Decision Tree: What Release Type?

```
START
  ├─ Any breaking changes?
  │  ├─ YES → MAJOR (v1.0.0 → v2.0.0) ⚠️
  │  └─ NO ↓
  └─ Any new features?
     ├─ YES → MINOR (v1.0.0 → v1.1.0) ✨
     └─ NO → PATCH (v1.0.0 → v1.0.1) 🐛
```

---

## Pre-Release Checklist (All Types)

```bash
# 1. Verify authorization
gh api /orgs/lightspeedwp/teams/maintainers/members/$(git config user.name)

# 2. Update develop branch
git checkout develop && git pull origin develop

# 3. Check CHANGELOG [Unreleased] has entries
grep -A 10 "## \[Unreleased\]" CHANGELOG.md

# 4. Check VERSION file format (MAJOR.MINOR.PATCH)
cat VERSION

# 5. Verify no uncommitted changes
git status  # Should show "working tree clean"

# 6. For MAJOR: Verify ADR exists and is "Accepted"
# Location: docs/adr/NNNN-short-title.md
```

---

## Patch Release (v1.0.0 → v1.0.1)

| Step | Command | Time |
|------|---------|------|
| 1. Pre-checklist | See above | 2 min |
| 2. Dry-run | `gh workflow run release.yml -f scope=patch -f dry_run=true` | 1–2 min |
| 3. Review output | Check all gates ✅, score ≥ 0.80 | 1 min |
| 4. Live release | `gh workflow run release.yml -f scope=patch -f dry_run=false` | 5–10 min |
| 5. Verify | `gh release view v1.0.1` | 1 min |
| **TOTAL** | | **10–15 min** |

**Approval:** None (auto-approved)

---

## Minor Release (v1.0.0 → v1.1.0)

| Step | Command | Time |
|------|---------|------|
| 1. Pre-checklist | See above | 2 min |
| 2. Notify approver | Send message with feature list | 1 min |
| 3. Dry-run | `gh workflow run release.yml -f scope=minor -f dry_run=true` | 1–2 min |
| 4. Live release | `gh workflow run release.yml -f scope=minor -f dry_run=false` | 5 min |
| 5. Approver reviews | Approver checks PR #2 | 5–20 min |
| 6. Approver approves | Click "Approve" in review UI | 1 min |
| 7. Workflow continues | Auto-merges, tags, publishes | 5 min |
| 8. Verify | `gh release view v1.1.0` | 1 min |
| **TOTAL** | | **20–35 min** |

**Approval:** 1 maintainer (review PR #2)

**Approver Message Template:**

```
Hi @maintainer,

Releasing v1.1.0 (minor) in ~5 min. Includes:
- [Feature A]
- [Feature B]

Please review PR #N when it appears (~5 min from now).
Approve if changelog and version look correct.
```

---

## Major Release (v1.0.0 → v2.0.0)

| Step | Command | Time |
|------|---------|------|
| 1. Pre-checklist | See above + ADR check | 5 min |
| 2. Verify ADR | Check `docs/adr/NNNN.md` has "Accepted" status | 2 min |
| 3. Notify approvers | Send message to both maintainers | 1 min |
| 4. Dry-run | `gh workflow run release.yml -f scope=major -f dry_run=true` | 1–2 min |
| 5. Live release | `gh workflow run release.yml -f scope=major -f dry_run=false` | 5 min |
| 6. Approver 1 reviews | Reviews PR #2, verifies ADR linked | 15–30 min |
| 7. Approver 2 reviews | Reviews PR #2, verifies ADR linked | 15–30 min |
| 8. Both approve | Both click "Approve" in review UI | 2 min |
| 9. Workflow continues | Auto-merges, tags, publishes | 5 min |
| 10. Verify | `gh release view v2.0.0` | 1 min |
| **TOTAL** | | **45–90 min** |

**Approval:** 2 maintainers + ADR verification (review PR #2)

**Approver Message Template:**

```
Hi @maintainer1 and @maintainer2,

Releasing v2.0.0 (MAJOR - breaking changes) in ~5 min.

Breaking changes documented in:
- CHANGELOG.md: See ⚠️ items
- ADR: docs/adr/NNNN-description.md

Please review PR #N when it appears (~5 min).
Verify:
1. All breaking changes listed
2. ADR linked in commit
3. Migration guide included
4. Approve if all looks good
```

---

## Approval Methods (Minor & Major Only)

**✅ BEST: Use GitHub "Approve" Button**

1. Go to PR #2
2. Click "Review changes" (top right)
3. Select "Approve"
4. Click "Submit review"

**✅ OKAY: Add Comment**

1. Comment on PR: "Approved" or "LGTM"
2. (Less reliable than button)

**❌ DO NOT: Add Label Only**

1. Adding "approved" label alone doesn't work
2. Use the approval button instead

---

## Monitoring Workflow

```bash
# Get latest release workflow run
gh run list --workflow release.yml --limit 1

# View full logs in real-time
gh run view <run-id> --log

# Or go to GitHub UI
https://github.com/lightspeedwp/.github/actions/workflows/release.yml
```

**Look for these gates to pass:**

```
✅ GATE 1: Pre-flight Checks
✅ GATE 2: Agentic Score
✅ GATE 3: Version Consistency
✅ GATE 4: Tag Uniqueness
✅ GATE 5: Authorization
✅ GATE 6: Integrity Filter
✅ GATE 7: Approval Enforcement
```

---

## Common Issues & Quick Fixes

| Issue | Error | Fix |
|-------|-------|-----|
| No [Unreleased] | GATE 1 fail | Add `## [Unreleased]` to CHANGELOG.md |
| Bad VERSION format | GATE 1 fail | Fix to `MAJOR.MINOR.PATCH` format |
| Tag exists | GATE 4 fail | Increment patch version |
| Secrets detected | GATE 6 fail | Remove secret, commit, retry dry-run |
| Approval stuck | GATE 7 waiting | Click official "Approve" button in PR |
| Not in team | GATE 5 fail | Contact Release Lead for access |
| ADR missing/Draft | Major won't release | Create ADR, get "Accepted" status |

**For complex issues:** See [RELEASE_TROUBLESHOOTING.md](../docs/RELEASE_TROUBLESHOOTING.md)

---

## Emergency Rollback (Within 1 Hour)

```bash
# 1. Delete GitHub Release
# (Manually go to Releases page and delete)

# 2. Delete git tag
git push origin --delete v1.0.1
git tag -d v1.0.1

# 3. Revert on main
git checkout main && git pull
git revert -m 1 <merge-commit-sha>
git push origin main

# 4. Fix the issue in develop

# 5. Re-release as v1.0.2 (not v1.0.1)
```

---

## Key Commands Reference

```bash
# Release workflow
gh workflow run release.yml -f scope=patch -f dry_run=true
gh workflow run release.yml -f scope=patch -f dry_run=false
gh run list --workflow release.yml --limit 5
gh run view <run-id> --log

# Verify release
gh release view v1.0.1
gh release list | head -5
git fetch origin && git tag | grep v1

# Branch/git operations
git checkout develop && git pull origin develop
git status
git push origin --delete release/v1.0.1
git tag -d v1.0.1

# Check authorization
gh api /orgs/lightspeedwp/teams/maintainers/members/$(git config user.name)
```

---

## Release Timeline Reference

| Type | Timeline | Approval | Who Approves |
|------|----------|----------|--------------|
| Patch | 5–10 min | Auto | (None) |
| Minor | 10–30 min | Manual | 1 maintainer |
| Major | 30–120 min | Manual | 2 maintainers + ADR |

**Planning tip:** Schedule release 15–30 min before approvers go offline.

---

## Dry-Run Expected Output

```
[DRY RUN] Release Workflow Preview
═════════════════════════════════

Scope: patch
Current Version: 1.0.0
New Version: 1.0.1

Phase 1 Agent Execution
─────────────────────
✅ Repository type detected: control-plane
✅ Branch created: release/v1.0.1
✅ VERSION bumped: 1.0.0 → 1.0.1
✅ CHANGELOG rolled: [Unreleased] → [1.0.1] - 2026-08-22
✅ Commit prepared: "chore: Release v1.0.1"
✅ PR #N created

Phase 2 Safety Gates (Preview)
─────────────────────────────
✅ GATE 1: Pre-flight Checks
✅ GATE 2: Agentic Score (0.92/1.0)
✅ GATE 3: Version Consistency
✅ GATE 4: Tag Uniqueness
✅ GATE 5: Authorization
✅ GATE 6: Integrity Filter
✅ GATE 7: Approval Enforcement (auto-approved)

Estimated Timeline: ~5-10 minutes
Approval Required: NO
```

---

## When to Escalate

**Level 1:** Check runbooks and troubleshooting guide  
**Level 2:** Check workflow logs for specific error  
**Level 3:** Ask team in Release Engineering channel  
**Level 4:** Create GitHub issue + tag @lightspeedwp/maintainers  

---

**Quick Reference Card v1.0 | Last Updated: 2026-08-22**

*Print and laminate for your desk. Keep with you during releases.*

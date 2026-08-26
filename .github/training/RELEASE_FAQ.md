---
file_type: documentation
title: Release Workflow FAQ
description: Frequently asked questions about the agentic release workflow
version: v1.0
last_updated: '2026-08-22'
status: active
stability: stable
---

# Release Workflow FAQ

> Frequently asked questions from the Release Engineering team.

## General Questions

### Q1: What's the difference between patch, minor, and major releases?

**A:** Three types by semantic versioning:

- **Patch (v1.0.0 → v1.0.1):** Bug fixes, security patches, performance improvements. Auto-approved. 5–10 min.
- **Minor (v1.0.0 → v1.1.0):** New features, backwards-compatible. Requires 1 maintainer approval. 10–30 min.
- **Major (v1.0.0 → v2.0.0):** Breaking changes, API removals. Requires 2 maintainers + ADR. 30–120 min.

Use the **Scope Determination Flowchart**:

```
Any breaking changes?
├─ YES → Major (v2.0.0)
└─ NO: Any new features?
      ├─ YES → Minor (v1.1.0)
      └─ NO: Bug fixes/patches only → Patch (v1.0.1)
```

---

### Q2: How do I know which version to release?

**A:** Look at git history and CHANGELOG:

```bash
# See what's changed since last release
git log v1.0.0..develop --oneline | head -20

# Check CHANGELOG [Unreleased] entries
grep -A 30 "## \[Unreleased\]" CHANGELOG.md
```

**Decision logic:**

- Count "Added" entries → new features exist → Minor (or Major if breaking)
- Count "Fixed" entries only → Patch
- Anything marked "BREAKING" or ⚠️ → Major
- No changelog entries → Do not release yet; add entries first

---

### Q3: Do I need a GitHub account, or can I use CLI?

**A:** You need GitHub authorization, but you can trigger via CLI:

```bash
# Check if authorized
gh auth status

# Authorize if needed
gh auth login

# Trigger release workflow via CLI
gh workflow run release.yml -f scope=patch -f dry_run=true
```

You don't need to use the GitHub web UI for anything; CLI works end-to-end.

---

### Q4: How long does a release take?

**A:** Depends on scope:

| Scope | Time | Why |
|-------|------|-----|
| Patch | 5–10 min | Fully automated, no human approval |
| Minor | 10–30 min | 1 maintainer reviews PR (~15 min review time) |
| Major | 30–120 min | 2 maintainers + ADR verification (~1 hour common) |

Add time if approvers are unavailable.

---

## Technical Questions

### Q5: What does "GATE 7 waiting for approval" mean?

**A:** The workflow is paused, waiting for a human to approve the release:

**For Patch:** Should NOT happen (auto-approved). If stuck, escalate.

**For Minor/Major:** Expected behavior.

- Minor: 1 maintainer should review PR #2 and click "Approve"
- Major: 2 maintainers should approve PR #2

**To unblock:**

1. Check PR #2 status
2. If approvers haven't reviewed, send reminder
3. Ensure they clicked official "Approve" button (not just a comment)
4. Wait 1–5 minutes for workflow to detect approval

See [RELEASE_TROUBLESHOOTING.md](../docs/RELEASE_TROUBLESHOOTING.md) for diagnostics.

---

### Q6: Why do I need a dry-run before the live release?

**A:** Dry-run shows:

- All safety gates will pass ✅
- Correct version will be released
- Changelog looks right
- No unexpected failures

Risks from skipping dry-run:

- ❌ Live release fails partway through
- ❌ Wrong version released
- ❌ Manual cleanup needed

**Always do dry-run first.** It's free and fast (1–2 min).

---

### Q7: What if dry-run shows a failure?

**A:** Stop and fix it before live release.

Example failure and fix:

```
❌ GATE 1: Pre-flight Checks Failed
   Reason: CHANGELOG.md missing [Unreleased] section

Fix:
1. Edit CHANGELOG.md
2. Add "## [Unreleased]" at top
3. git commit -am "chore: Add unreleased section"
4. git push origin develop
5. Re-run dry-run
```

Each gate failure message tells you exactly what to fix.

---

### Q8: Can I release from a feature branch?

**A:** No. Releases must come from:

- `develop` branch for patch/minor
- `main` branch for hotfixes

The workflow creates a `release/vX.Y.Z` branch from develop, then merges back to both develop and main.

You don't commit directly to release branches; the workflow creates them.

---

### Q9: What if my team is distributed across time zones?

**A:** Plan accordingly:

**Patch releases:** No approval needed, can release anytime (5–10 min).

**Minor releases:** Schedule ~30 minutes before your approver goes offline:

```
Today 2:00 PM (Patch Release)
→ Trigger workflow
→ Wait ~5 min for Phase 1
→ Approver reviews PR #2 (next 15 min)
→ Release completes (5 min)
→ Total: 25 min, all within business hours
```

**Major releases:** Plan with all 2 approvers available for 1–2 hours.

---

### Q10: Can I cancel a release once it starts?

**A:** Depends on phase:

**Phase 1 (version bump):** Hard to cancel; easier to fix issues and retry.

**Phase 2 (safety gates):** Can usually stop before it reaches main:

1. Go to Actions tab
2. Click running workflow
3. Click "Cancel workflow" (if available)
4. Wait for cancellation (~1 min)

**After PR #2 merges to main:** Cannot cancel; it's published. Use rollback procedure instead.

**Prevention:** Always use dry-run first to catch issues.

---

## Approval & Authorization Questions

### Q11: I'm not in the maintainers team. How do I get access?

**A:** Contact the Release Engineering Lead:

```bash
# Check if you're in the team
gh api /orgs/lightspeedwp/teams/maintainers/members/$(git config user.name)

# If not, ask Release Lead to add you
# They'll use: gh api /orgs/lightspeedwp/teams/maintainers/memberships/{username}
```

Team membership is required for authorization (GATE 5).

---

### Q12: What's the difference between "Approve" button and "comment LGTM"?

**A:** The "Approve" button is official; comments are not.

**Best practice:** Use GitHub's "Review changes" → "Approve" button.

```
❌ Don't just comment: "LGTM"
❌ Don't just add label: "approved"

✅ Do click: "Review changes" → "Approve"
```

The workflow checks for official PR approval status, not comments.

---

### Q13: I want to approve but I'm not a maintainer. Can I?

**A:** No. Approval must come from official `@lightspeedwp/maintainers` team members.

If you need approval authority, contact Release Lead to add you to the team.

---

## Breaking Changes & ADR Questions

### Q14: When do I need an ADR for a major release?

**A:** ADR (Architecture Decision Record) is required for any major release.

Every major release has breaking changes (by definition). Each major change should be documented with an ADR explaining:

- What changed?
- Why did we change it?
- How do users migrate?
- What are the consequences?

Example: "ADR-42: Require PHP 8.0 Minimum"

See [RELEASE_RUNBOOK_MAJOR.md](../docs/RELEASE_RUNBOOK_MAJOR.md) for format.

---

### Q15: Can I release with an ADR in "Draft" status?

**A:** No. ADR must be "Accepted" before major release.

```
❌ ADR Status: Draft → Cannot release
✅ ADR Status: Accepted → Can release
```

Acceptance means leadership has reviewed and approved the breaking change.

---

### Q16: What if I need to make a breaking change mid-development?

**A:** Create the ADR early:

1. **Write ADR** when decision is made
2. **Get accepted** before merging breaking changes to develop
3. **Announce** to team (breaking changes impact everyone)
4. **Plan major release** when ready
5. **Release** with ADR reference

This prevents surprise breaking changes and gives users notice.

---

## Post-Release Questions

### Q17: Why does the release create a "post-release sync" branch?

**A:** To keep main and develop synchronized:

```
Develop: [A] → [B] → [C] (Release v1.0.1)
Main:    [A] → [B] → [Release commit]
                      ↓
Post-release sync branch: main → develop
Develop: [A] → [B] → [C] → [Merge commit from main]
Main:    [A] → [B] → [Release commit]
                     (both now have same tag v1.0.1)
```

This ensures both branches stay in sync and future releases can build on released code.

---

### Q18: What if post-release sync has merge conflicts?

**A:** Very rare (should not happen with clean releases).

If conflicts occur:

1. Workflow will fail and create a PR
2. Someone needs to manually resolve conflicts
3. Merge the PR to complete sync

**Prevention:** Keep develop and main close to each other; don't let them diverge.

---

### Q19: How long should I wait to verify the release is published?

**A:** Check immediately after workflow completes:

```bash
# Check GitHub Release
gh release view v1.0.1 --repo lightspeedwp/.github

# Check git tag
git fetch origin && git tag | grep v1.0.1

# Check VERSION on main
git checkout main && git pull && cat VERSION
```

If any step fails, the release had issues. Check workflow logs.

---

### Q20: Can I publish the GitHub Release manually if the workflow fails?

**A:** No. If the workflow fails to publish, something is wrong.

Never manually publish; instead:

1. Stop the failed workflow
2. Diagnose the issue (check logs)
3. Fix the root cause
4. Retry the live release

Manual publishing bypasses safety gates and risks data consistency.

---

## Rollback & Recovery Questions

### Q21: How do I rollback a bad release?

**A:** Use the emergency rollback procedure within 1 hour:

```bash
# 1. Delete GitHub Release
#    (Go to Releases page manually)

# 2. Delete git tag
git push origin --delete v1.0.1
git tag -d v1.0.1

# 3. Revert PR #2 commit on main
git revert -m 1 <merge-commit-sha>
git push origin main

# 4. Fix the issue
# (Create separate branch, merge to develop)

# 5. Re-release as new version (v1.0.2)
```

See [RELEASE_TROUBLESHOOTING.md](../docs/RELEASE_TROUBLESHOOTING.md) for full procedure.

---

### Q22: What if I discover a bug after rollback is past 1 hour?

**A:** You can still fix it, but it's more complex:

1. **Create fix branch** from develop
2. **Merge fix** to develop
3. **Release as new patch** (don't re-release same version)

Example:

- v1.0.1 released (bad)
- Rolled back within 1 hour ✅
- Fix applied to develop
- Release v1.0.2 (new version)

Never try to re-release v1.0.1; git tags are immutable.

---

### Q23: Can the workflow fail midway through and leave the repo in a bad state?

**A:** Unlikely, but possible in rare cases.

**Safety mechanisms:**

- Safety gates check everything before mutations
- If gates pass, remaining steps almost never fail
- Post-release sync has retry logic

**If workflow fails midway:**

1. Check workflow logs for error message
2. Diagnose using [RELEASE_TROUBLESHOOTING.md](../docs/RELEASE_TROUBLESHOOTING.md)
3. Escalate to Release Lead if unable to fix
4. May need manual remediation (rare)

---

## Workflow & Automation Questions

### Q24: How often can I trigger releases?

**A:** As often as needed:

- Patch: Any time (bug fixes released immediately)
- Minor: As features are ready
- Major: Planned and announced

No rate limits; workflow can run multiple times per day if needed.

---

### Q25: Can I run multiple releases in parallel?

**A:** Avoid it. Recommendation: One release at a time.

Running parallel releases risks:

- Version conflicts (both trying to bump to same version)
- Tag collisions
- Merge conflicts on main/develop

**Best practice:** Complete one release fully before starting the next.

---

### Q26: What if someone pushes changes while release is running?

**A:** Depends on when the push happens:

**Before PR #2 merges to main:**

- The pushed changes won't be in the release
- They'll be released in the next version

**After PR #2 merges to main:**

- Changes are now on main
- They're part of the release (but not tagged)
- Next release should pick them up

**Prevention:** Communicate release timing; avoid pushing during active release.

---

## Learning & Training Questions

### Q27: I'm new to the release process. Where do I start?

**A:** Follow this order:

1. Read [RELEASE_TEAM_TRAINING.md](../docs/RELEASE_TEAM_TRAINING.md) — Module 1
2. Watch video walkthrough (if available)
3. Read [RELEASE_RUNBOOK_PATCH.md](../docs/RELEASE_RUNBOOK_PATCH.md)
4. Execute a test patch release on test repository
5. Get certified by Release Lead
6. Execute real releases under supervision first

---

### Q28: Can I practice releases without affecting the real repository?

**A:** Yes! Use the test repository:

```bash
# Clone test repo
git clone https://github.com/lightspeedwp/test-releases.git

# Practice releases there
# No impact on production; good for learning
```

Perfect for hands-on training before real releases.

---

### Q29: Where do I find help if I'm stuck?

**A:** In order:

1. **Check documentation:** Runbooks and troubleshooting guides
2. **Check video:** Video walkthrough may cover your scenario
3. **Search FAQ:** This document might have your question
4. **Ask team:** Slack/chat channel for Release Engineering
5. **Escalate:** Create GitHub issue for Release Lead

---

### Q30: How often should I review the release documentation?

**A:** Annually at minimum; more often if workflow changes:

- **Before each release:** Skim the relevant runbook
- **Annually:** Full review of all materials (Q4 refresh)
- **After major workflow changes:** All materials reviewed and updated

Documentation is kept current; trust it.

---

## Still Have Questions?

**Not found here?** Check:

- [RELEASE_RUNBOOK_PATCH.md](../docs/RELEASE_RUNBOOK_PATCH.md) — Patch release details
- [RELEASE_RUNBOOK_MINOR.md](../docs/RELEASE_RUNBOOK_MINOR.md) — Minor release details
- [RELEASE_RUNBOOK_MAJOR.md](../docs/RELEASE_RUNBOOK_MAJOR.md) — Major release details
- [RELEASE_TROUBLESHOOTING.md](../docs/RELEASE_TROUBLESHOOTING.md) — Problem diagnosis
- [RELEASE_PROCESS.md](../docs/RELEASE_PROCESS.md) — Architecture overview

**Still stuck?** Create an issue or ask Release Lead.

---

**FAQ Version:** v1.0  
**Last Updated:** 2026-08-22  
**Maintained By:** Release Engineering Team

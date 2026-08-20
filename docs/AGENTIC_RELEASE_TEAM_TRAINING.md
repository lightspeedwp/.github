---
file_type: training-guide
title: Phase 5A Agentic Release Workflow — Team Training
name: agentic-release-team-training
description: 60-minute team training session for the Phase 5A agentic release workflow MVP. Covers dry-run demonstrations, live patch releases, approval procedures, and team Q&A.
author: Claude Code
date_created: 2026-08-18
status: active
type: training-guide
category: releases
tags:

  - agentic-release
  - phase-5a
  - team-training
  - workflow-demos

---

# Phase 5A Agentic Release Workflow — Team Training

**Duration:** 60 minutes
**Audience:** LightSpeedWP maintainers (Phase 5A MVP launch)
**Facilitator:** Claude Code or Release Manager
**Date:** 2026-08-21 onwards (team training kickoff)

---

## Session Overview

This training equips the maintainers team with hands-on experience for the **agentic release workflow MVP** (Phase 5A). The 60-minute session combines:

- **30 minutes:** Live demonstrations (dry-run + live patch release)
- **30 minutes:** Q&A, edge cases, and team feedback

**By the end of this session, team members will:**

✅ Understand the 7-layer safety-gate architecture
✅ Know when to use dry-run vs. live releases
✅ Understand approval timelines and override procedures
✅ Know where to escalate failures
✅ Feel confident running releases autonomously

---

## Pre-Demo Checklist

**Before starting the session (5 minutes prep):**

- [ ] **Venue:** Conference room with shared screen or Zoom with screen-share ready
- [ ] **Branch state:** Clone fresh `develop` branch (no uncommitted changes)
- [ ] **GitHub CLI:** Verify `gh` is installed and authenticated (`gh auth status`)
- [ ] **Terminal:** Open `.github` directory in clean terminal (no active CI runs)
- [ ] **Docs open:** Have <https://github.com/lightspeedwp/.github> open in browser for real-time PR tracking
- [ ] **Test PR visible:** Create a test PR on develop (e.g., `docs/test-release-demo`) **prior to session start** — use this for the live demo to avoid blocking real PRs
- [ ] **Slack channel:** Have #releases open for live notifications during demos
- [ ] **Time sync:** Confirm training start time with participants (timezone-aware)

---

## DEMO 1: Dry-Run Release (15 minutes)

**Purpose:** Show the 7-layer validation gates without making actual mutations.

### Setup

1. In terminal, navigate to `.github` repo root
2. Ensure on `develop` branch: `git checkout develop && git pull origin develop`
3. Verify current version: `cat package.json | jq .version`

### Dry-Run Command

```bash

gh workflow run release.yml \
  -f scope=patch \
  -f dry_run=true

```

**What the facilitator narrates:**
> "We're triggering a dry-run for a patch release. This will simulate all 7 safety gates — changelog validation, version update checks, authorization, approval rules, and more — WITHOUT actually modifying any files or creating a release."

### Watch the Workflow

1. GitHub Actions tab: <https://github.com/lightspeedwp/.github/actions/workflows/release.yml>
2. **Gate 1: Changelog validation** — Checks CHANGELOG.md has entries for the new version
3. **Gate 2: Version match** — Confirms package.json matches the next SemVer bump
4. **Gate 3: Authorization** — Validates user is in `maintainers` team
5. **Gate 4: Approval rules** — Determines auto-approve (patch ≥0.8 score) vs. manual review
6. **Gates 5–7:** Agentic scoring, telemetry, dry-run exit (no mutations)

### Expected Output

```

[DRY-RUN] Release simulation complete
✅ Changelog: PASS
✅ Version: PASS
✅ Authorization: PASS
✅ Approval: AUTO_APPROVED (score: 0.92)
✅ No mutations made (dry-run mode)

Ready for live release? Use: gh workflow run release.yml -f scope=patch -f dry_run=false

```

### Team Q&A During Demo 1

- *"What if changelog validation fails?"* → Manual changelog edit required; re-run dry-run to verify
- *"Can we skip the dry-run?"* → Not recommended for production; for internal test PRs, dry-run is fast (2 min) and catches issues early
- *"What happens if we're not in the maintainers team?"* → Gate 3 fails with clear error; only maintainers can trigger

---

## DEMO 2: Live Patch Release (15 minutes)

**Purpose:** Perform an actual patch release with all safety gates active and auto-approval.

### Setup

1. **Create test PR** (if not done in pre-demo checklist):

   ```bash
   git checkout -b docs/test-release-demo
   echo "## [0.2.1] - 2026-08-18" >> CHANGELOG.md
   echo "- Test: Add demo entry" >> CHANGELOG.md
   git add CHANGELOG.md
   git commit -m "docs: Add test changelog entry for Phase 5A training"
   git push -u origin docs/test-release-demo
   ```

2. **Create PR** (or use pre-existing test PR):

   ```bash
   gh pr create --base develop --title "docs: Phase 5A training changelog" \
     --body "Test PR for release workflow training"
   ```

3. **Ensure PR is merged** before moving to live release

### Pre-Release Checklist (Live)

- [ ] Test PR merged to `develop`
- [ ] `git pull origin develop` to sync locally
- [ ] Verify `CHANGELOG.md` has entry for `[0.2.1]`
- [ ] Verify `package.json` version is still `0.2.0` (pre-release state)

### Live Release Command

```bash

gh workflow run release.yml \
  -f scope=patch \
  -f dry_run=false

```

**What the facilitator narrates:**
> "Now we're running a **live** patch release. All 7 safety gates will execute with real mutations — version bump, changelog validation, git tag creation, npm release. Since this is a patch with high agentic confidence (≥0.8), it will auto-approve without manual intervention. Watch GitHub Actions for the workflow steps."

### Watch the Workflow (Real-Time)

1. Same Actions tab as before
2. Gates 1–4 execute (same as dry-run)
3. **Gate 5: Agentic scoring** — Real-time confidence score (typically 0.8–1.0 for patch)
4. **Gate 6: Approval** — Auto-approve (no manual wait needed for patch)
5. **Gate 7: Mutations & Release** — Actual git tag, npm publish, GitHub release

### Expected Output (Live Release)

```

✅ Changelog: PASS
✅ Version: PASS
✅ Authorization: PASS
✅ Approval: AUTO_APPROVED (score: 0.95)
✅ Mutations: EXECUTING

  - Updating package.json to 0.2.1
  - Creating git tag v0.2.1
  - Publishing to npm
  - Creating GitHub release

Release complete! Published as v0.2.1
npm view @lightspeedwp/github-community-health@0.2.1

```

### Verify Release

```bash

# Confirm version updated

cat package.json | jq .version

# Confirm git tag exists

git tag | grep v0.2.1

# Check npm registry

npm view @lightspeedwp/github-community-health version

```

### Team Q&A During Demo 2

- *"Can we cancel mid-release?"* → Actions provides a cancel button; cancel any time during mutation steps (destructive, use with caution)
- *"What if CI fails during approval?"* → Workflow pauses; fix the issue, re-run dry-run to verify, then live release
- *"How long does a patch release take?"* → Dry-run ~2 min, live release ~5 min (includes npm publish, GitHub API calls)
- *"Can we release during business hours without disruption?"* → Yes, agentic release is non-blocking and async from team workflow

---

## Q&A Section (30 minutes)

### 10 Common Questions & Answers

#### Q1: When do we use dry-run vs. live?

**A:** Use dry-run before **every** live release. It's fast (2 min) and catches issues without mutations. Use live only when dry-run passes and you're ready to publish.

#### Q2: What's the approval timeline for each scope?

**A:**

- **Patch:** Auto-approve if agentic score ≥ 0.8 (< 5 min)
- **Minor:** Manual review by 1 maintainer (10–30 min, async)
- **Major:** Dual approval (2 maintainers + ADR) (1–4 hours, requires coordination)

#### Q3: Who can override approval?

**A:** Only `maintainers` team members. Override via comment on PR: "release:override-approval". This bypasses the approval gate but still runs all other safety gates. **Use sparingly.**

#### Q4: What if the changelog is missing?

**A:** Gate 2 will fail with a clear message. Edit `CHANGELOG.md` locally, commit, push, then re-run dry-run. No version or tag created until changelog passes.

#### Q5: Can we release outside of business hours?

**A:** Yes. The workflow is fully automated. Releases can run 24/7. Slack #releases channel gets notifications, so async monitoring is possible.

#### Q6: What happens if npm publish fails?

**A:** The release workflow will pause at Gate 7. GitHub release is created, but npm publish failed. **Escalation:** Check npm registry status, fix the error, then manually run `npm publish` or re-trigger the workflow.

#### Q7: How do we handle breaking changes?

**A:** Breaking changes require a **major** version bump and dual approval. In the workflow, use `scope=major`. Both the 7-gate validation AND a linked ADR (Architecture Decision Record) are required for audit trail.

#### Q8: Can we revert a released version?

**A:** Yes, but with care. Create a hotfix branch (`hotfix/revert-vX.Y.Z`), downgrade the version in `package.json`, add a changelog entry (marked as "reverted"), then trigger a **patch** release to restore the prior version.

#### Q9: What's the agentic score and how is it calculated?

**A:** The agentic score (0–1) is calculated from:

- Changelog completeness (20%)
- Semantic version correctness (30%)
- Test coverage on changed files (20%)
- Authorization & team membership (15%)
- Commit message quality (15%)

For patches, scores are typically 0.8+. For minor/major, 0.6–0.8. Low scores (`<0.5`) require manual review.

#### Q10: What's the fallback if the agentic layer breaks?

**A:** Phase 4 shell scripts are always available as a fallback:

```bash

bash .github/scripts/release/release.sh patch

```

The agentic layer is an enhancement, not a blocker. Releases are never stuck permanently.

---

## Validation Checklist

**Use this checklist to confirm training success:**

- [ ] All participants saw DEMO 1 (dry-run) complete successfully
- [ ] All participants saw DEMO 2 (live patch) complete successfully
- [ ] All participants understand the 7-layer safety-gate architecture
- [ ] All participants know when to use patch vs. minor vs. major scope
- [ ] All participants can name 3 approval gates (authorization, agentic score, team membership)
- [ ] All participants know how to escalate a failed release
- [ ] All participants felt confident enough to run a release autonomously
- [ ] **Post-training survey sent** (see below)

---

## Post-Training Feedback Survey

**Send this survey to all participants within 24 hours of training:**

```

# Phase 5A Agentic Release Training — Post-Session Feedback

Please rate your confidence (1–5) on each topic:

1. Understanding of the 7-layer safety-gate architecture

   [ ] 1 (Not confident) [ ] 2 [ ] 3 [ ] 4 [ ] 5 (Very confident)

2. Knowing when to use dry-run vs. live release

   [ ] 1 (Not confident) [ ] 2 [ ] 3 [ ] 4 [ ] 5 (Very confident)

3. Understanding approval timelines for patch/minor/major

   [ ] 1 (Not confident) [ ] 2 [ ] 3 [ ] 4 [ ] 5 (Very confident)

4. Confidence to run a patch release autonomously

   [ ] 1 (Not confident) [ ] 2 [ ] 3 [ ] 4 [ ] 5 (Very confident)

5. Knowing how to handle release failures

   [ ] 1 (Not confident) [ ] 2 [ ] 3 [ ] 4 [ ] 5 (Very confident)

## Open Feedback

- What was most helpful in the training?
- What was confusing or needs clarification?
- What additional training or documentation would help?
- Any concerns about the agentic release workflow?

**Target:** ≥ 80% of participants rate 4–5 on all questions.

```

---

## Success Criteria

**Phase 5A training is successful when:**

✅ **Attendance:** ≥ 80% of maintainers team present
✅ **Comprehension:** Post-survey average score ≥ 4.0 / 5.0
✅ **Autonomy:** ≥ 1 participant runs a patch release in the following week without facilitator assist
✅ **Documentation:** Training guide shared in #releases Slack (pinned)
✅ **Escalation clarity:** Team knows where to ask questions (GitHub Discussions, Slack #releases)

---

## Next Steps (Phase 6)

**After training, the team will:**

1. **Week 1:** Autonomous patch releases (low-risk, high-frequency)
2. **Week 2:** Minor version releases (coordinated, manual approval)
3. **Week 3:** Major version releases (ADR-driven, dual approval)
4. **Ongoing:** Metrics collection and workflow refinement based on team feedback

---

## Resources & References

- **Workflow Definition:** [.github/workflows/release.yml](./.github/workflows/release.yml)
- **Safety Gates Documentation:** [docs/AGENTIC_RELEASE_USER_GUIDE.md](./AGENTIC_RELEASE_USER_GUIDE.md)
- **Admin Guide:** [docs/AGENTIC_RELEASE_ADMIN_GUIDE.md](./AGENTIC_RELEASE_ADMIN_GUIDE.md)
- **Release Process:** [docs/RELEASE_PROCESS.md](./RELEASE_PROCESS.md)
- **GitHub Discussions:** Search for "agentic release" in `.github` repo discussions
- **Slack:** #releases channel (questions, escalations, feedback)

---

**Training Updated:** 2026-08-18
**Facilitator Guide Version:** 1.0
**Status:** Ready for Phase 5A team launch

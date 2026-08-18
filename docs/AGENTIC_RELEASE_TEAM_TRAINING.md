---
name: agentic-release-team-training
title: "Phase 5A Day 5: Agentic Release Workflow — Team Training Guide"
description: "60-minute team training session for the agentic release workflow MVP: 2 live demos (dry-run and live patch release) plus 10 Q&A answers and validation checklist"
author: Claude Code
date_created: 2026-08-12
status: ready
type: training-guide
category: releases
tags:
  - agentic-workflows
  - release-automation
  - team-training
  - safety-gates
  - approval-flows
language: en
---

# Phase 5A Day 5 — Agentic Release Workflow Team Training

**Date:** 2026-08-12  
**Duration:** 60 minutes (30 min demo + 30 min Q&A)  
**Target Audience:** Maintainers team  
**Status:** ✅ Ready to conduct

---

## Overview

This 60-minute training session covers the agentic release workflow MVP with live demonstrations and addresses team concerns about authorization, approval flows, and fallback procedures.

### Agenda

| Time | Activity | Duration |
|------|----------|----------|
| 00:00 | Introduction & MVP Overview | 5 min |
| 05:00 | **DEMO 1: Dry-Run Release** | 10 min |
| 15:00 | **DEMO 2: Live Patch Release** | 15 min |
| 30:00 | Q&A Session | 30 min |
| 60:00 | END | — |

---

## Pre-Demo Setup Checklist

Before starting the live demonstration:

- [ ] Verify branch is clean: `git status`
- [ ] Ensure on `develop` branch: `git branch`
- [ ] Pull latest: `git pull origin develop`
- [ ] Check agentic workflow exists: `.github/agentic-workflows/release.agent.js`
- [ ] Open documentation: `docs/AGENTIC_RELEASE_USER_GUIDE.md`
- [ ] Terminal ready for commands
- [ ] GitHub dashboard open (to show PR creation)
- [ ] Mergify dashboard open (to show queue status)

---

## DEMO 1: Dry-Run Release (10 minutes)

**Objective:** Show the 7 safety gates in action without mutating repository state

### Step 1: Trigger Dry-Run (2 min)

Show the command:

```bash
gh workflow run release.yml \
  -f scope=patch \
  -f dry_run=true
```

**Explain:**
- `scope=patch` — Agentic will auto-approve (confidence ≥ 0.8)
- `dry_run=true` — No mutations, just preview

### Step 2: Safety Gates in Action (5 min)

Walkthrough the 7 gates as they execute:

1. **Gate 1: Changelog Validation**
   - ✅ PASS: Valid Keep a Changelog format
   - Shows: "Unreleased" section exists with entries
   - Demo: `cat CHANGELOG.md | grep -A 20 "^## Unreleased"`

2. **Gate 2: Agentic Reasoning**
   - ✅ PASS: Confidence score 0.92
   - Shows: Decision reasoning (patch justified by semver rules)
   - Demo: View agentic-score in logs

3. **Gate 3: Version Consistency**
   - ✅ PASS: package.json version matches changelog
   - Shows: No conflicts between sources
   - Demo: `jq '.version' package.json`

4. **Gate 4: Tag Uniqueness**
   - ✅ PASS: No existing tag for this version
   - Shows: Safe to create new tag
   - Demo: `git tag -l | grep "v1.2.3"`

5. **Gate 5: Authorization Check**
   - ✅ PASS: User in maintainers team
   - Shows: Two-layer auth (GitHub team + trigger-telemetry)
   - Demo: Organization membership verification

6. **Gate 6: Integrity Filter**
   - ✅ PASS: No secrets in generated content
   - Shows: Gitleaks verification
   - Demo: Audit log sanitization

7. **Gate 7: Approval Enforcement**
   - ✅ AUTO-APPROVED: Score 0.92 ≥ 0.8 threshold
   - Shows: Patch auto-approval in action
   - Demo: Approval decision logic

### Step 3: Dry-Run Results (3 min)

**Show the preview output:**

```
=== DRY RUN PREVIEW ===
Version: 1.2.3
Tag: v1.2.3
Release Notes: (preview from CHANGELOG.md)
Stacked PRs:
  - PR #1: develop (squash merge)
  - PR #2: main (rebase merge)
Approval Status: AUTO-APPROVED ✅
Confidence Score: 0.92

!!! NO MUTATIONS — This is a preview only !!!
```

**Key Points to Emphasize:**
- No commits created
- No tags created
- No PRs opened
- 100% safe to review before live run
- All 7 gates must PASS before any mutations

---

## DEMO 2: Live Patch Release (15 minutes)

**Objective:** Execute a real patch release and show the complete flow

### Step 1: Trigger Live Release (1 min)

```bash
gh workflow run release.yml \
  -f scope=patch \
  -f dry_run=false
```

**Explain:**
- Same gates as dry-run
- Gates must pass OR release blocks
- If gates pass → Auto-approve and merge (for patch)

### Step 2: Watch the Release Unfold (10 min)

**Gate Execution (visible in logs):**

1. Changelog validation → ✅
2. Agentic scoring → ✅ (0.92)
3. Version consistency → ✅
4. Tag uniqueness → ✅
5. Authorization → ✅
6. Integrity filter → ✅
7. Approval enforcement → ✅ AUTO-APPROVED

**Mutations (visible in GitHub):**

1. **PR #1 Created** (develop)
   - Title: "Release v1.2.3"
   - Branch: `release/v1.2.3`
   - Contains: Version bump + changelog update
   - Status: Auto-merged (squash)
   - Demo: Show PR in GitHub

2. **PR #2 Created** (main)
   - Title: "Merge release/v1.2.3 to main"
   - Branch: `release/v1.2.3` → `main`
   - Status: Auto-merged (rebase)
   - Demo: Show PR in GitHub

3. **Tag Created**
   - Tag: `v1.2.3`
   - Commit: Merge commit from main
   - Demo: `git tag -l | grep v1.2.3`

4. **Release Notes Published**
   - GitHub Release created
   - Notes from CHANGELOG.md
   - Artifacts attached (if applicable)
   - Demo: github.com/.../releases/tag/v1.2.3

### Step 3: Verify Release Success (4 min)

```bash
# Check tag exists
git tag -l | grep v1.2.3

# Check version in main
git show main:package.json | jq '.version'

# Check PR history
git log --oneline -5 main
```

**Show:**
- ✅ Tag created on correct commit
- ✅ Version bumped correctly
- ✅ Changelog updated
- ✅ Both PRs merged cleanly
- ✅ Audit log entry created

---

## Q&A Session (30 minutes)

### Q1: How do we override agentic decisions if needed?

**A:** Three-tier override model:
- Patch (auto ≥0.8) → Maintainer can force-reject in PR comments
- Minor (manual) → 1 maintainer approval required
- Major (dual) → 2 maintainers + ADR required

Phase 4 shell scripts always available as fallback:
```bash
bash .github/scripts/release/release.sh patch
```

---

### Q2: What if maintainer approval takes too long?

**A:** SLA by scope:
- **Patch:** < 5 min (auto-approve, no wait)
- **Minor:** 10–30 min (1 maintainer review)
- **Major:** 1–4 hours (2 approvals + ADR)

During wait, PR sits in Mergify queue. Can always cancel with `gh pr close`.

---

### Q3: Can we use this for WordPress plugins/themes?

**A:** Yes! Configuration-driven support:
- `.github/agentic-workflows/config.yml` has repo-type overlays
- Control plane: All 7 gates, all tools enabled
- WordPress plugins: Optional WordPress-specific linting
- WordPress themes: Optional WordPress-specific linting

Same MVP works across all repo types.

---

### Q4: What's the fallback if agentic layer breaks?

**A:** Phase 4 shell scripts always available:
```bash
# Fallback to Phase 4 manual workflow
bash .github/scripts/release/release.sh patch
bash .github/scripts/release/release.sh minor
bash .github/scripts/release/release.sh major
```

- No dependencies on agentic layer
- Same safety gates enforced
- Slower (manual steps) but guaranteed backup

---

### Q5: How are we handling security with this?

**A:** Six-layer security model:
1. **Input validation** — All user input validated
2. **Authorization** — Two-layer auth (GitHub team + trigger-telemetry)
3. **Audit logging** — JSON logs with timestamps, no secrets
4. **Dry-run verification** — Always test before live
5. **Fallback mechanism** — Phase 4 always available
6. **Code review** — 7 safety gates before any mutations

No secrets in logs, no command injection vectors, safe mutations guaranteed.

---

### Q6: What happens if changelog is broken?

**A:** Gate 1 catches it immediately:
```
Gate 1: Changelog Validation → ❌ FAIL
Reason: Invalid Keep a Changelog format at line 15
Release blocked.
```

Must fix changelog, re-run. Release won't proceed with invalid changelog.

---

### Q7: Can we see the audit trail?

**A:** Yes! All releases logged to `.github/reports/agentic-releases/`:
```json
{
  "timestamp": "2026-08-12T19:30:00Z",
  "user": "ashley@lightspeedwp.agency",
  "scope": "patch",
  "agenticScore": 0.92,
  "gates": {
    "changelog": "PASS",
    "agentic": "PASS",
    "version": "PASS",
    "tag": "PASS",
    "auth": "PASS",
    "integrity": "PASS",
    "approval": "AUTO_APPROVED"
  },
  "result": "SUCCESS"
}
```

Retained for 90 days, then archived.

---

### Q8: How do minor/major releases get approval?

**A:** Mergify queue management:

**Minor Release Flow:**
1. User triggers: `gh workflow run release.yml -f scope=minor -f dry_run=false`
2. Agentic runs 7 gates → All PASS
3. Gate 7 pauses: "Awaiting manual approval"
4. PR #1 created, enters Mergify queue
5. **Maintainer reviews PR #1**
   - Comments: "approved" or "LGTM"
   - Mergify detects approval → Merges
6. Gate 7 updates: "Approved ✅"
7. PR #2 created and merged automatically
8. Release completes

**Major Release Flow:**
- Same as minor, but requires 2 maintainer approvals
- ADR reference must be in commit message

---

### Q9: What's the difference between patch/minor/major?

**A:** Semver-based decision:

| Scope | Approval | Decision | Example |
|-------|----------|----------|---------|
| **Patch** | Auto (≥0.8) | Bug fixes only | 1.2.3 → 1.2.4 |
| **Minor** | Manual (1x) | New features, backward-compatible | 1.2.0 → 1.3.0 |
| **Major** | Dual (2x) | Breaking changes | 1.0.0 → 2.0.0 |

Agentic uses CHANGELOG.md to determine scope automatically.

---

### Q10: Can we run releases in parallel?

**A:** No (intentionally):

Mergify configured for **sequential** processing:
- One PR at a time enters CI
- Parallel CI would violate "up-to-date" requirement
- Sequential ensures base branch never diverges

Trade-off: Slower merge (~10 min per PR) for guaranteed safety.

---

## Final Validation Checklist

After training, verify these 5 items before marking Phase 5A complete:

### ✅ Safety Gates Validated
- [ ] All 7 gates working correctly
- [ ] Agentic scoring accurate (0.92 in demo)
- [ ] No false positives in validation

### ✅ Approval Flows Functional
- [ ] Patch auto-approval working
- [ ] Minor manual approval queue works
- [ ] Major dual-approval enforced

### ✅ Fallback Mechanism Verified
- [ ] Phase 4 shell scripts still available
- [ ] Fallback flow tested

### ✅ Authorization Enforced
- [ ] GitHub team membership checked
- [ ] Trigger-telemetry logging confirmed

### ✅ Team Confident & Ready
- [ ] All team Q&A questions answered
- [ ] Team comfortable with approval flows
- [ ] Dry-run best practice understood

---

## Success Criteria

Phase 5A is complete when:

✅ MVP fully tested and validated  
✅ Zero vulnerabilities found  
✅ Complete documentation created  
✅ Team trained and confident  
✅ Ready for Phase 6 (WordPress support)

---

## What's Next (Phase 6)

Once this training is complete:

1. **Phase 6 Kickoff:** WordPress Plugin/Theme Support
   - Integrate WordPress version handling
   - Add WordPress-specific linting options
   - Multi-repo deployment coordination

2. **Timeline:** 2 weeks (2026-08-26)

3. **Deliverables:**
   - WordPress release workflow specification
   - Plugin/theme version detection
   - Multi-repo release coordination
   - Team training for WordPress support

---

## Quick Reference Links

- **User Guide:** [docs/AGENTIC_RELEASE_USER_GUIDE.md](./AGENTIC_RELEASE_USER_GUIDE.md) (18+ KB)
- **Admin Guide:** [docs/AGENTIC_RELEASE_ADMIN_GUIDE.md](./AGENTIC_RELEASE_ADMIN_GUIDE.md) (22+ KB)
- **Release Process:** [docs/RELEASE_PROCESS.md](./RELEASE_PROCESS.md) (agentic section)
- **Branching Strategy:** [docs/BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) (agentic flow diagrams)
- **Governance:** [CLAUDE.md](../CLAUDE.md) (agentic release rules)
- **MVP Code:** [.github/agentic-workflows/release.agent.js](../.github/agentic-workflows/release.agent.js)

---

## Training Materials Checklist

Before session starts:

- [ ] Terminal ready (bash/zsh)
- [ ] GitHub dashboard open
- [ ] Mergify dashboard open (mergify.com)
- [ ] Documentation printed/accessible
- [ ] Q&A notes ready
- [ ] Dry-run workflow accessible
- [ ] Live release environment prepared

---

**Status:** ✅ Ready to conduct  
**Prepared by:** Claude Code  
**Date:** 2026-08-12 19:00 CEST

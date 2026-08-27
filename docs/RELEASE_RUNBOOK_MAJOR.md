---
file_type: documentation
title: Major Release Runbook
description: Step-by-step guide for executing major releases with dual approval and ADR linking
version: v1.0
last_updated: '2026-08-22'
status: active
stability: stable
domain: governance
owners:
  - Release Engineering Team
tags:
  - release
  - runbook
  - major
  - architecture
  - automation
---

# Major Release Runbook v1.0

> Step-by-step guide for releasing major versions (v1.0.0 → v2.0.0) with dual approval and Architecture Decision Record (ADR) linking. Estimated time: **30–120 minutes** (includes dual approval and documentation review).

## Overview

A major release introduces breaking changes requiring careful coordination. The agentic workflow automates version bumping but requires **dual approval from two maintainers** and an **Architecture Decision Record (ADR) reference** documenting the breaking changes.

**Scope:** Breaking API changes, major feature rewrites, deprecated endpoint removals  
**Approval Gate:** GATE 7 (Approval Enforcement) — requires 2 maintainer reviews + ADR  
**Timeline:** 30–120 minutes (5–10 min automation + 60–90 min dual review + ADR verification)

---

## Pre-Release Checklist

Before triggering a major release, verify:

- [ ] **ADR created and merged** documenting breaking changes
- [ ] ADR covers all breaking changes and migration path
- [ ] ADR has been reviewed by architecture team
- [ ] All breaking changes merged to `develop`
- [ ] Migration guide documented (separate from ADR)
- [ ] CHANGELOG.md has [Unreleased] section with breaking change entries
- [ ] Breaking changes clearly marked with ⚠️ in CHANGELOG
- [ ] VERSION file contains current release (e.g., 1.0.0)
- [ ] No uncommitted changes
- [ ] Repository tested and stable
- [ ] **Identify 2 maintainers for approval** (communicate beforehand)
- [ ] Prepared announcement for major breaking changes

**Major Release Prerequisites:**

1. **Architecture Decision Record (ADR)**
   - File: `docs/adr/` directory
   - Format: Standard ADR format (Context, Decision, Consequences)
   - Contents: Why breaking changes, migration strategy, timeline
   - Status: Must be "Accepted" (not "Proposed" or "Superseded")

2. **CHANGELOG Formatting**

   ```markdown
   ## [Unreleased]

   ### ⚠️ BREAKING CHANGES
   - Endpoint `/api/v1/users` removed (use `/api/v2/users` instead)
   - Configuration format changed from YAML to JSON
   - Deprecated `legacy_mode` flag no longer supported

   ### Added
   - New `/api/v2/users` endpoint with improved schema
   - JSON configuration support with schema validation
   - Migration CLI tool for config conversion

   ### Changed
   - API versioning strategy from URL path to header-based

   ### Removed
   - Deprecated `/api/v1/users` endpoint
   - Legacy YAML configuration format
   - Backwards compatibility layer
   ```

3. **Migration Guide**
   - Separate documentation file (e.g., `MIGRATION_v2.md`)
   - Step-by-step instructions for users upgrading
   - Code examples showing before/after
   - Timeline for deprecation periods

---

## Pre-Release Communication

### Notify Approvers and Stakeholders

**Week before major release, notify:**

1. **Architecture Team Lead**
   - Request ADR review
   - Ensure ADR is "Accepted" status

2. **Two Maintainers** (for approval)
   - Send overview of breaking changes
   - Share ADR link
   - Request they be available for dual approval

3. **Users/Customers**
   - Announce major version coming
   - Share migration guide early
   - Set expectations for timeline

**Example communication:**

```
Subject: Major Release v2.0.0 Coming — Breaking Changes Inside

Hi team,

We're releasing v2.0.0 (major) with breaking changes:

**Breaking Changes:**
- Endpoint `/api/v1/users` → `/api/v2/users` (different schema)
- Configuration format: YAML → JSON
- Deprecated `legacy_mode` removed

**Timeline:**
- ADR review: this week
- Release planned: [date]
- Dual approval: [date]
- Expected duration: ~45 minutes

**Resources:**
- ADR: [link]
- Migration Guide: [link]

**Action Required:**
- @maintainer1 and @maintainer2: Please be available for approval
- Users: Review migration guide and plan upgrade timeline

Questions? Reply in thread.
```

---

## Architecture Decision Record (ADR) Preparation

### ADR Format

Standard ADR should include:

```
# ADR-NNN: Title of Breaking Change

## Status
Accepted (not Proposed or Superseded)

## Context
Explain why the breaking change is necessary:
- Current system limitations
- Performance issues
- API design flaws
- Security improvements
- Scalability requirements

## Decision
Describe the breaking change and implementation:
- What's being changed
- What's being removed
- What's being added
- Timeline and migration path

## Consequences
Benefits and impacts:
- Positive: Better API design, improved performance
- Negative: Users must upgrade and migrate
- Mitigation: Provide migration tools and guides

## Migration Strategy
Detailed plan for users:
1. Deprecation period (timeline)
2. Migration steps (code examples)
3. Testing approach
4. Rollback procedure
5. Support during migration
```

### Verify ADR Status

Before triggering major release, confirm ADR is "Accepted":

```bash
# Check ADR file
cat docs/adr/0042-breaking-change-example.md

# Verify status line contains: "Status: Accepted"
grep "Status" docs/adr/0042-breaking-change-example.md
# Output should show: "Status: Accepted"
```

---

## Phase 1: Version Bump & Changelog (Agent-Automated)

### Step 1: Notify Approvers

Send reminder to both maintainers:

```
@maintainer1 @maintainer2

Starting major release v2.0.0 in ~5 minutes.

Please be ready to review PR #N (release/v2.0.0 → main) in ~10 minutes.

You'll need to verify:
1. Version is correct (v2.0.0)
2. CHANGELOG has all breaking changes marked ⚠️
3. ADR linked in commit message or PR description
4. Both of you approve PR

Thanks!
```

### Step 2: Trigger Release Workflow

Navigate to GitHub Actions:

1. Go to **Actions** tab → **Release Automation** workflow
2. Click **Run workflow**
3. Set **Release Scope** to `major`
4. Set **Dry Run** to `true`
5. Click **Run workflow**

### Step 3: Review Dry-Run Report

The workflow will:

- ✅ Calculate new version (1.0.0 → 2.0.0)
- ✅ Preview changelog roll
- ✅ Show all safety gates
- ✅ Display approval requirements: **"2 maintainers + ADR required"**

**Example dry-run output:**

```
[DRY RUN] Major Release Workflow Preview
═════════════════════════════════════════

Scope: major
Current Version: 1.0.0
New Version: 2.0.0

Phase 1 Agent Execution
─────────────────────
✅ Repository type detected: control-plane
✅ Branch created: release/v2.0.0 from develop
✅ VERSION bumped: 1.0.0 → 2.0.0
✅ CHANGELOG rolled: [Unreleased] → [2.0.0] - 2026-08-22
✅ Includes 3 breaking changes (marked ⚠️)
✅ Commit prepared with ADR reference

Phase 2 Safety Gates (Preview)
─────────────────────────────
✅ GATE 1: Pre-flight Checks (VERSION, CHANGELOG, branch)
✅ GATE 2: Agentic Score (0.85/1.0)
✅ GATE 3: Version Consistency (semantic versioning: valid)
✅ GATE 4: Tag Uniqueness (v2.0.0 does not exist)
✅ GATE 5: Authorization (user in maintainers team)
✅ GATE 6: Integrity Filter (gitleaks: no secrets found)
⏳ GATE 7: Approval Enforcement (PENDING: 2 maintainers + ADR required)

Estimated Timeline: ~60-90 minutes (includes dual review + ADR verification)
Approval Required: YES (2 maintainers + ADR verification)
```

### Step 4: Verify Dry-Run Passed

If all gates show ✅ or ⏳:

- Proceed to **Step 5: Execute Live Release**
- If any gate shows ❌: Stop and consult troubleshooting

### Step 5: Execute Live Release

Re-run the workflow with **Dry Run: false**:

1. Go to **Release Automation** workflow
2. Click **Run workflow**
3. Set **Release Scope** to `major`
4. Set **Dry Run** to `false`
5. Click **Run workflow**

---

## Phase 2A: PR Creation & Dual Review (Agent-Automated + Human)

### Step 6: PR #1 Merges to develop

After ~3–5 minutes:

1. **PR #1 created and merged:** `release/v2.0.0 → develop`
2. Develop branch updated with v2.0.0
3. Workflow creates PR #2 for `release/v2.0.0 → main`

### Step 7: Maintainers Review PR #2

**Important:** Both maintainers must review and approve.

**First Maintainer:**

1. Go to **Pull Requests** → PR #2 (release/v2.0.0 → main)
2. Review the PR:
   - Version correct: v2.0.0 ✅
   - CHANGELOG has ⚠️ BREAKING CHANGES section ✅
   - All breaking changes listed ✅
   - Migration path documented ✅
3. Check commit message for ADR reference:
   - Should include: "Refs: ADR-NNN" or "See: docs/adr/..."
   - If not present, request changes: *"Please add ADR reference to commit"*
4. Approve the PR using GitHub "Approve" button
5. Leave comment:

   ```
   ✅ Approved (Maintainer 1/2)
   
   Verified:
   - Version v2.0.0 correct
   - 3 breaking changes documented ⚠️
   - Migration guide adequate
   - ADR-NNN referenced
   
   Waiting for second approval...
   ```

**Second Maintainer:**

1. After first approval, review the same PR
2. Verify same items as first maintainer
3. Additionally check:
   - Is migration timeline reasonable?
   - Are users adequately warned?
   - Is rollback plan documented?
4. Approve the PR using GitHub "Approve" button
5. Leave comment:

   ```
   ✅ Approved (Maintainer 2/2)
   
   Verified:
   - All breaking changes documented
   - Migration timeline: [X] weeks
   - Rollback procedure defined
   - ADR complete and accepted
   
   Ready for release!
   ```

**Timeline:**

- First review: 15–30 minutes
- Second review: 15–30 minutes (can happen in parallel)
- Workflow detection: 1–5 minutes
- **Total dual approval: 30–60 minutes**

### Step 8: ADR Verification

Workflow automatically:

1. Detects ADR reference in commit message
2. Fetches ADR file from docs/adr/ directory
3. Verifies ADR has "Status: Accepted"
4. Confirms ADR documents breaking changes
5. ✅ GATE 7 updates: ADR verified

**If ADR not found:**

- Workflow halts at GATE 7
- Check ADR file location and naming
- Commit message must reference ADR correctly
- Use format: "Refs: ADR-NNN" or "See: docs/adr/NNNN-filename.md"

---

## Phase 2B: Release Publishing (Agent-Automated)

### Step 9: Workflow Detects Dual Approval

After both maintainers approve PR #2:

1. **Merge PR #2 to main** (squash merge)
2. **Apply remaining safety gates**
3. **Verify ADR**
4. **Create release tag** v2.0.0
5. **Publish GitHub Release**
   - Release notes include ⚠️ BREAKING CHANGES section prominently
   - Pre-release flag: NO (stable, but breaking)

### Step 10: Monitor Workflow Log

Watch the workflow:

1. Go to **Actions** → **Release Automation**
2. Click running workflow
3. Monitor for:
   - ⏳ Waiting for approval (GATE 7)
   - ✅ Dual approval detected
   - ✅ ADR verified
   - ✅ PR #2 merging
   - ✅ GitHub Release published

**Typical timeline (total):**

- Phase 1: 3–5 minutes
- PR #1 merge: 1–2 minutes
- Dual review: 30–60 minutes (varies)
- Phase 2B (after approval): 3–5 minutes
- **Total: 40–75 minutes**

---

## Post-Release Steps

### Step 11: Verify GitHub Release

1. Go to **Releases** page
2. Click v2.0.0 release
3. Verify:
   - ⚠️ BREAKING CHANGES section at top
   - All migration information present
   - ADR link or reference included
   - Version correct: v2.0.0
   - Not marked as pre-release

**Example release notes:**

```
# v2.0.0 — Major Breaking Release

⚠️ **BREAKING CHANGES** — See migration guide below

## Breaking Changes

- **Endpoint removed:** `/api/v1/users` (use `/api/v2/users`)
- **Config format:** YAML → JSON (use config migration tool)
- **Feature removed:** `legacy_mode` flag no longer supported

## Migration Guide

See [MIGRATION_v2.md](https://github.com/.../MIGRATION_v2.md) for step-by-step upgrade instructions.

## New Features

- `/api/v2/users` endpoint with improved schema
- JSON configuration with schema validation
- Config migration CLI tool

[Full release notes...]
```

### Step 12: Post-Release Sync

Automatic sync of main → develop:

1. Creates `chore/post-release-sync-main-to-develop` branch
2. Merges main to develop
3. Creates PR for approval
4. Merges PR

**Verification:**

- Wait 2–3 minutes for sync
- Verify develop branch in sync
- No merge conflicts

### Step 13: Announce Major Release

Send comprehensive announcement:

```
🎉 **MAJOR RELEASE v2.0.0 — BREAKING CHANGES**

⚠️ **ACTION REQUIRED:** Users must migrate

## Breaking Changes

1. **API Endpoint Migration**
   - OLD: GET /api/v1/users
   - NEW: GET /api/v2/users
   - Reason: Improved schema design

2. **Configuration Format**
   - OLD: YAML format
   - NEW: JSON format
   - Tool: Run `migration-cli convert config.yml config.json`

3. **Feature Removal**
   - Removed: `legacy_mode` flag
   - Timeline: Deprecated since v1.8, now removed

## Migration Support

- **Guide:** [MIGRATION_v2.md](...)
- **Questions:** Comment in discussion thread
- **Support:** Release Engineering team available for Q&A
- **Timeline:** Users have until [date] to migrate

## New Features

- Improved API schema and consistency
- JSON configuration with validation
- Better performance and scalability

## Timeline

- Released: [date/time]
- Support period for v1.x: [date]
- Full migration deadline: [date]

Thank you for upgrading!
```

---

## Dual Approval Workflow

### Approval Requirements

- **Both maintainers** must approve (not just one)
- Approval method: GitHub "Approve" button (most reliable)
- Cannot use "Request changes" (blocks release)
- Comments alone don't count as approval

### What Approvers Verify

1. **Version correctness**
   - Is it v2.0.0? (not v1.1.0 or v2.1.0)
   - Does it follow semantic versioning?

2. **Breaking changes documentation**
   - Are all breaking changes in CHANGELOG?
   - Are they marked with ⚠️?
   - Is migration path clear?

3. **ADR verification**
   - Is ADR referenced in commit message?
   - Is ADR marked "Accepted"?
   - Does it explain why breaking changes are needed?

4. **User impact assessment**
   - Is migration effort reasonable?
   - Are users adequately warned?
   - Is support timeline clear?

### Approval Workflow

```
Maintainer 1 Reviews (15-30 min)
             ↓
     Maintainer 1 Approves
             ↓
Maintainer 2 Reviews (15-30 min, can overlap)
             ↓
     Maintainer 2 Approves
             ↓
Workflow Detects Dual Approval (1-5 min)
             ↓
     Workflow Continues
             ↓
  GitHub Release Published
```

---

## ADR Linking

### Commit Message Format

The release commit should include ADR reference:

**Option 1: ADR in title**

```
chore: Release v2.0.0 (ADR-42: Breaking Change)
```

**Option 2: ADR in body**

```
chore: Release v2.0.0

Refs: ADR-42
See: docs/adr/0042-breaking-change-title.md
```

**Option 3: GitHub PR description**

```
## ADR Reference

This release implements ADR-42: [Title]
See [ADR-42](docs/adr/0042-...) for decision details.
```

### Verification

Workflow checks:

1. Finds ADR reference in commit message
2. Locates ADR file (docs/adr/NNNN-*.md)
3. Verifies "Status: Accepted" line
4. Confirms ADR documents breaking changes
5. ✅ GATE 7 passes

---

## If Approval is Delayed

### Monitoring Approval Status

1. Check PR #2 for approval count
2. Should show "✅ Approved by 2 reviewers"
3. Check workflow log for GATE 7 status

### Timeline

- **< 10 min:** First maintainer still reviewing
- **10–30 min:** Awaiting second maintainer
- **> 30 min:** Consider reaching out
- **> 90 min:** Workflow may timeout

### If One Maintainer Unavailable

1. Contact third maintainer for second approval
2. They can review and approve PR #2
3. Release continues after dual approval

---

## Verification Checklist

After release completes:

- [ ] GitHub Release v2.0.0 published
- [ ] ⚠️ BREAKING CHANGES at top of release notes
- [ ] ADR linked in release description
- [ ] Migration guide referenced
- [ ] Git tag v2.0.0 created and signed
- [ ] Both maintainers approved
- [ ] develop and main branches in sync
- [ ] CI passing on both branches
- [ ] Announcement sent to team

---

## Rollback Procedure (Emergency)

### Critical Issue After Release

If production issues occur immediately:

1. **Halt user upgrades**
   - Update announcement with "Halt" notice
   - Don't recommend upgrading to v2.0.0

2. **Delete GitHub Release**
3. **Delete git tag**

   ```bash
   git push origin --delete v2.0.0
   ```

4. **Revert PR #2 on main**
5. **Notify users of rollback**
6. **Post-mortem on root cause**
7. **Re-release as v2.0.1 patch** after fixes

---

## Common Issues & Solutions

**Issue: ADR not found (GATE 7 fails)**

- Solution: Commit message must reference ADR
- Format: "Refs: ADR-NNN" or "See: docs/adr/..."
- See: RELEASE_TROUBLESHOOTING.md

**Issue: One maintainer unavailable**

- Solution: Get second approval from another maintainer
- They review same PR and approve

**Issue: Approval takes > 90 minutes**

- Solution: Check if approvers are still engaged
- Reach out directly if needed
- Consider rescheduling if timing issue

**Issue: ADR status is "Proposed" not "Accepted"**

- Solution: ADR must be accepted by architecture team first
- Update ADR status to "Accepted"
- Re-trigger release

For more, see: [RELEASE_TROUBLESHOOTING.md](./RELEASE_TROUBLESHOOTING.md)

---

## Success Criteria

Major release is successful when:

✅ ADR created and accepted  
✅ Dual approval from two maintainers  
✅ GitHub Release published with breaking changes clearly marked  
✅ Migration guide available  
✅ Users notified with adequate warning  
✅ develop and main branches in sync  

---

## Tips & Best Practices

**Tip 1: Plan major release early**

- ADR needs time for architecture review
- Users need notice of breaking changes
- Coordinate across teams

**Tip 2: Make ADR comprehensive**

- Explain why breaking change is necessary
- Document migration path
- Include code examples
- Address user concerns

**Tip 3: Keep breaking changes minimal**

- Group related breaking changes together
- Don't break multiple unrelated things
- Provide clear migration path

**Tip 4: Provide migration tools**

- CLI tool or script to help migrate
- Configuration conversion tools
- API client library updates

**Tip 5: Extend support timeline**

- Don't force immediate upgrades
- Provide 6–12 month support window
- Communicate deadline clearly

---

## Support & Escalation

**For questions:**

- See [RELEASE_PROCESS.md](./RELEASE_PROCESS.md)
- Review other runbooks for comparison
- Consult [RELEASE_TROUBLESHOOTING.md](./RELEASE_TROUBLESHOOTING.md)

**For ADR guidance:**

- Check organization's ADR template
- Review accepted ADRs in docs/adr/
- Consult architecture team

**For issues:**

- Create GitHub issue with `type:bug` label
- Tag Release Engineering team
- Reference this runbook

**For escalation:**

- Contact Release Engineering Lead
- If approval blocked, escalate to Engineering Director

---

**Phase 9B Deliverable:** Release Workflow Validation & E2E Testing  
**Related Epic:** #2296  
**Runbook Version:** v1.0  
**Last Updated:** 2026-08-22

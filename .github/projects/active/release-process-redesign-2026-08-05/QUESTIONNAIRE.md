---
file_type: markdown
title: ""Release Process Redesign Questionnaire""
description: ""50 questions to guide comprehensive release workflow and documentation redesign""
last_updated: "2026-08-25"
status: active
tags: ["questionnaire", "release", "design"]
owners: ["Ash Shaw"]
---

# Release Process Redesign Questionnaire

**Purpose:** Gather requirements and design decisions for the complete release process (workflows, documentation, automation, and governance).

**Instructions:** Answer each question to the best of your ability. These answers will drive the OpenSpec analysis and implementation plan.

---

## PART 1: RELEASE FLOW ARCHITECTURE (Questions 1-8)

### 1. **Primary Branch for Development**

Currently, develop is the integration branch. Should it remain so?

- [ ] Yes, develop is the source of truth; all integration happens here
- [ ] No, switch to a different primary branch
- [ ] Other: ___________________

### 2. **Release PR Target — First Stage**

When creating a release branch (release/vX.Y.Z), where should the FIRST PR target?

- [ ] `develop` (your stated preference: finalize version/changelog here first)
- [ ] `main` (current implementation: ship directly)
- [ ] Other: ___________________

**If develop:** Do you want the release PR to run the full test suite before merging?

- [ ] Yes, full CI/lint/test
- [ ] Yes, but lighter validation only
- [ ] No, skip CI on release PR to develop

### 3. **Post-Release Sync Strategy**

After merging to `main` and tagging, how should version/changelog flow back to develop?

- [ ] Automated sync: PR from main → develop after each release
- [ ] Semi-automated: Generate patch branch, user manually merges
- [ ] Manual: Document procedure, users execute by hand
- [ ] No sync: develop stays separate; next release derives version from scratch

**Impact:** Determines whether next feature development starts from correct version.

### 4. **Release Branch Cleanup Timing**

When should release/vX.Y.Z branch be deleted?

- [ ] Immediately after merge to develop (if develop-first flow)
- [ ] Immediately after merge to main (if main-direct flow)
- [ ] After GitHub Release is published (final step)
- [ ] Never delete; archive for audit trail

### 5. **Hotfix Flow Integration**

Hotfixes branch from main and should be released. After hotfix is released:

- [ ] Auto-sync hotfix version back to develop
- [ ] Manual cherry-pick hotfix commits to develop
- [ ] No integration; hotfix lives only on main
- [ ] Other: ___________________

**Impact:** Determines whether develop needs manual sync after each hotfix.

### 6. **Pre-Release Branch Protection**

Should release branches (release/vX.Y.Z) have special branch protection rules?

- [ ] Yes, same as main (require reviews, CI green)
- [ ] Yes, but lighter (CI only, no reviews)
- [ ] No, treat as normal feature branch
- [ ] Yes, custom rules: ___________________

### 7. **Stacked PR Strategy Decision**

GitHub docs mention "stacked PRs" (PR A → develop, then PR B from develop → main in sequence). Use this?

- [ ] Yes, adopt stacked PR strategy (develop-first flow naturally enables this)
- [ ] No, prefer flat PRs (single branch → single target)
- [ ] Undecided; tell me pros/cons

**Why this matters:** Stacked PRs allow independent review/CI at each stage (develop, then main) but add workflow complexity.

### 8. **Dry-Run Mode Default**

Current default is `true` (forces user to opt-in to live release). Change this?

- [ ] Keep default `true` (safe, requires explicit decision)
- [ ] Change to `false` (assumes user knows what they're doing)
- [ ] Remove default; require explicit true/false input
- [ ] Add confirmation step instead of relying on default

---

## PART 2: VERSION & CHANGELOG MANAGEMENT (Questions 9-16)

### 9. **Version Bump Determination**

How is the next version determined?

- [ ] User inputs explicit version (--version=X.Y.Z)
- [ ] User specifies scope (--scope=patch|minor|major) and tool derives version
- [ ] Tool reads changelog and infers scope from entry types
- [ ] Tool reads Git tags and derives scope from commit messages
- [ ] Hybrid: try scope first, fallback to explicit version

### 10. **VERSION File Format**

The VERSION file currently contains just "0.6.0". Keep this format?

- [ ] Yes, single-line X.Y.Z format
- [ ] No, switch to YAML (version: "0.6.0")
- [ ] No, switch to JSON
- [ ] Other: ___________________

### 11. **Pre-release Version Support**

Should the release system handle pre-release versions (v1.0.0-alpha.1, v1.0.0-beta.1, v1.0.0-rc.1)?

- [ ] Yes, required; our release cycle uses beta/RC
- [ ] Yes, optional; support it but don't require
- [ ] No, only support X.Y.Z format (no pre-release)
- [ ] Undecided; tell me the use case

**If yes:** Should pre-release versions be treated as "latest" in GitHub Releases?

- [ ] Yes, pre-release is latest
- [ ] No, pre-release never marked as latest
- [ ] Yes, only if explicitly flagged in release.yml input

### 12. **Unreleased Section Requirement**

[Unreleased] section must have entries before release. What if it's empty?

- [ ] Hard block: refuse to release, fail workflow
- [ ] Soft block: warn but allow release (require override flag)
- [ ] Allow: release can proceed with empty [Unreleased]
- [ ] Auto-generate: create placeholder entries automatically

**Impact:** Prevents accidental "empty" releases with no documented changes.

### 13. **Changelog Validation Timing**

When should changelog be validated?

- [ ] Only on PR to develop (before merge)
- [ ] On PR to develop AND on release.yml (before agent runs)
- [ ] Only during release.yml (at release time)
- [ ] On every push to develop

### 14. **Changelog Sections Order**

Keep a Changelog specifies order: Removed, Deprecated, Added, Changed, Fixed, Security. Enforce this order?

- [ ] Yes, strict ordering required
- [ ] Yes, but warn if wrong (don't fail)
- [ ] No, allow any order
- [ ] Custom order: ___________________

### 15. **Release Notes Generation**

Release notes are compiled from changelog + merged PRs (highlights, breaking changes, contributors). Confidence in current implementation?

- [ ] High; notes look good currently
- [ ] Medium; needs tuning for highlights/breaking changes
- [ ] Low; need redesign
- [ ] Other: ___________________

### 16. **Changelog Entry Deduplication**

When two PRs add the same changelog entry (same PR number, different words), dedup on merge. Is the dedup logic correct?

- [ ] Yes, works fine
- [ ] No, misses some duplicates
- [ ] No, incorrectly removes unique entries
- [ ] Uncertain; needs testing

---

## PART 3: GOVERNANCE & AUTHORIZATION (Questions 17-22)

### 17. **Release Authorization**

Who is allowed to trigger the release workflow?

- [ ] Anyone with write access
- [ ] Only team leads (list: ___________________)
- [ ] Only service account (e.g., lightspeed-bot)
- [ ] Require PR approval before release (workflow must be part of PR)
- [ ] Other: ___________________

### 18. **Authorization Enforcement**

The current telemetry gating doesn't actually stop unauthorized users. Fix this?

- [ ] Yes, implement proper authorization checks
- [ ] No, telemetry is advisory only (don't enforce)
- [ ] Yes, use GitHub's native branch protection (only maintainers can merge to main)
- [ ] Yes, create a dedicated authorization service

### 19. **Release Approval Workflow**

Should release require explicit approval/sign-off?

- [ ] No, workflow is approval enough (tests/lint gates it)
- [ ] Yes, require comment/reaction approval on PR
- [ ] Yes, require issue milestone linked to confirm scope
- [ ] Yes, require external sign-off (JIRA, Slack, etc.)

### 20. **Rollback Authorization**

If a release needs rollback, who can trigger it?

- [ ] Same as release trigger (see Q17)
- [ ] More restricted (only 1-2 people)
- [ ] Less restricted (anyone with write access)

### 21. **Release Audit Trail**

Should releases be logged/audited?

- [ ] Yes, log all release attempts (successful and failed)
- [ ] Yes, log only successful releases
- [ ] No, not needed
- [ ] Yes, plus integrate with external audit system (which one?)

### 22. **Notification on Release**

When a release completes, notify:

- [ ] Nobody; check Actions tab manually
- [ ] PR author only
- [ ] Team slack channel: #_______
- [ ] Email to: _______
- [ ] GitHub discussions/release announcement

---

## PART 4: TESTING & VALIDATION GATES (Questions 23-30)

### 23. **Pre-Release Testing Requirements**

What tests must pass before release?

- [ ] npm test (unit tests)
- [ ] npm run lint (code quality)
- [ ] Changelog validation (schema + unreleased)
- [ ] Manual smoke tests (documented in checklist)
- [ ] All of the above

### 24. **Changelog Validation Strictness**

Current validation checks title length, em-dash, PR links. Add more?

- [ ] No, current rules are sufficient
- [ ] Yes, add: link target validation (PR actually exists)
- [ ] Yes, add: entry doesn't duplicate previous releases
- [ ] Yes, add: entry matches commit/PR scope
- [ ] All of the above

### 25. **Version Format Validation**

Should version be validated against SemVer?

- [ ] Yes, strict SemVer (X.Y.Z only, no pre-release)
- [ ] Yes, SemVer with pre-release support (X.Y.Z-tag.N)
- [ ] Yes, but allow custom formats (document exceptions)
- [ ] No, any format OK

### 26. **Commit Message Validation**

Should release commits have specific message format?

- [ ] No special format; use default release agent message
- [ ] Yes, enforce conventional commits (feat:, fix:, etc.)
- [ ] Yes, enforce semantic commit format (version bump message)
- [ ] Yes, custom format: ___________________

### 27. **Working Tree Validation**

Should workflow refuse to release if git working tree is dirty?

- [ ] Yes, fail if any uncommitted changes
- [ ] Yes, but allow ignored files (just warn)
- [ ] No, release can proceed even with dirty state
- [ ] Warn only; don't fail

### 28. **Git Tag Naming Convention**

Tags are named "vX.Y.Z". Keep this?

- [ ] Yes, always use v prefix
- [ ] No, use bare X.Y.Z (no v prefix)
- [ ] No, use custom format: ___________________
- [ ] Yes, but allow both v and non-v tags

### 29. **GitHub Release Creation**

Should release.yml always create a GitHub Release, or make it optional?

- [ ] Always create; release isn't complete without it
- [ ] Optional (--create-release=true/false)
- [ ] Create only for non-pre-release versions
- [ ] Never create; let user do manually

### 30. **GitHub Release as "Latest"**

When marking releases as "latest":

- [ ] Mark by SemVer (highest version wins)
- [ ] Mark by creation date (newest wins)
- [ ] Mark by explicit flag (user decides per release)
- [ ] Mark all releases as latest (remove "latest" concept)

---

## PART 5: ERROR HANDLING & ROLLBACK (Questions 31-37)

### 31. **Rollback Automation**

Current rollback is fully manual (delete branch, tag, release). Automate it?

- [ ] Yes, create rollback.cjs with one-button revert
- [ ] Partially; automate cleanup but require manual version revert
- [ ] No, keep manual; reduces accident risk
- [ ] Other: ___________________

### 32. **Partial Release Recovery**

If release fails mid-way (PR created but not merged), what should happen?

- [ ] Leave it; user merges PR manually and rerun release agent
- [ ] Offer cleanup option; delete draft PR and start over
- [ ] Auto-cleanup; delete PR and exit without tagging
- [ ] Other: ___________________

### 33. **Failed Validation Recovery**

If release.yml runs but agent validation fails (changelog broken, version mismatch), what next?

- [ ] Workflow fails; user must fix and rerun
- [ ] Generate report; let user decide to proceed or rollback
- [ ] Auto-rollback; undo any commits/tags made
- [ ] Require explicit override flag to proceed despite validation errors

### 34. **Tag Conflict Handling**

If tag vX.Y.Z already exists (from failed prior attempt), what should happen?

- [ ] Fail; refuse to overwrite existing tag
- [ ] Warn but allow overwrite (user confirms)
- [ ] Auto-delete old tag and create new one
- [ ] Use different tag name (vX.Y.Z-retry-2)

### 35. **Release Notes Rollback**

If GitHub Release is published but then needs rollback, should we:

- [ ] Unpublish/delete the release (can't; API allows it but bad for discoverability)
- [ ] Publish amended release with "retracted/rollback" notice
- [ ] Leave it; create new release that supersedes
- [ ] Other: ___________________

### 36. **Changelog Rollback**

If release is rolled back, how does changelog revert?

- [ ] Auto-revert: [X.Y.Z] section moves back to [Unreleased]
- [ ] Manual: User reverts CHANGELOG.md commit manually
- [ ] Hybrid: Script to help user but requires confirmation
- [ ] No revert: Rolled-back version stays in changelog history

### 37. **Incomplete Release Detection**

If user runs release agent twice (accidental double-trigger), how detect it?

- [ ] Check for existing tag; fail if present
- [ ] Check git log for recent release commits; warn if found
- [ ] No detection; allow double releases (user manages it)
- [ ] Other: ___________________

---

## PART 6: DOCUMENTATION & STANDARDS (Questions 38-44)

### 38. **Release Documentation Organization**

Currently, release process is documented in RELEASE_PROCESS.md. Keep single doc or split?

- [ ] Keep single RELEASE_PROCESS.md (consolidate all docs there)
- [ ] Split: separate docs for flow, automation, troubleshooting, rollback
- [ ] Merge into AUTOMATION.md (release is part of automation strategy)
- [ ] Other structure: ___________________

### 39. **Documentation Audience**

Release docs should be written for:

- [ ] Technical leads only (deep automation details)
- [ ] Developers releasing features (how to prepare for release)
- [ ] Release manager (detailed procedures and edge cases)
- [ ] All three (need separate sections per audience)

### 40. **Release Checklist**

Should RELEASE_PROCESS.md include a detailed pre-release checklist?

- [ ] Yes, checklist in docs + enforced by workflow
- [ ] Yes, checklist in docs only (workflow won't enforce)
- [ ] No, workflow validation is sufficient (no need for manual checklist)
- [ ] Yes, but generate checklist dynamically from workflow

### 41. **Badge Management**

Docs have broken badges for non-existent workflows. What's the policy?

- [ ] Remove all badges; docs shouldn't depend on workflows
- [ ] Keep badges but only for workflows that exist + are stable
- [ ] Add CI check to prevent adding badges for missing workflows
- [ ] Badges auto-generated from workflows list (no manual maintenance)

### 42. **Documentation Maintenance**

Who is responsible for keeping docs in sync with actual workflows?

- [ ] Developer implementing the feature (one-time)
- [ ] Release manager (ongoing)
- [ ] CI validation (auto-detect drift, flag in PR)
- [ ] Quarterly audit (manual review every 3 months)

### 43. **Decision Records**

Should release design decisions be recorded as ADRs (Architectural Decision Records)?

- [ ] Yes, one ADR per major decision
- [ ] Yes, single ADR for entire release redesign
- [ ] No, DECISIONS.md is enough
- [ ] No, decisions live in issue tracker only

### 44. **Beta/RC Documentation**

Should docs include guidance on beta/RC releases?

- [ ] Yes, with examples (v1.0.0-beta.1, v1.0.0-rc.1)
- [ ] Yes, but keep it optional (advanced topic)
- [ ] No, we don't use pre-release versions
- [ ] Add later (don't include in initial redesign)

---

## PART 7: INTEGRATION WITH BROADER SYSTEM (Questions 45-50)

### 45. **Relation to Branching Strategy**

BRANCHING_STRATEGY.md documents branch naming and main/develop flow. Alignment issues?

- [ ] No, branching docs are aligned with release workflow
- [ ] Yes, but changes to branching strategy will be coordinated
- [ ] Yes, release process should override branching docs in conflicts
- [ ] Rewrite both together; they're interdependent

### 46. **Relation to Changelog Automation**

CHANGELOG_AUTOMATION.md documents how changelog is managed. Alignment issues?

- [ ] No, already aligned
- [ ] Yes, changelog docs assume direct-main flow; need updating
- [ ] Yes, but need clarification on validation timing
- [ ] Yes, several sections need rewrite

### 47. **Relation to Automation.md**

AUTOMATION.md documents workflow strategy (phase 4 refactoring, helper scripts). Integration needed?

- [ ] No, release automation is separate
- [ ] Yes, add release workflow to automation overview table
- [ ] Yes, but AUTOMATION.md needs update first
- [ ] Yes, both docs should be rewritten together

### 48. **GitHub Project Integration**

After release, should GitHub Projects be updated (milestone completed, new milestone created)?

- [ ] No, projects are independent
- [ ] Yes, mark released version milestone as done
- [ ] Yes, auto-create next version milestone
- [ ] Yes, both of the above

### 49. **Semantic Versioning Guidance**

VERSIONING.md documents SemVer. Does it cover release decision-making?

- [ ] Yes, sufficient guidance for deciding scope
- [ ] No, add examples of scope decisions
- [ ] No, add decision flowchart (when do you bump major vs minor?)
- [ ] Yes, but needs beta/RC guidance

### 50. **Deployment Integration**

DEPLOY.md documents GitHub Pages deployment. Should release trigger deployment?

- [ ] No, deployment is separate (happens on develop push)
- [ ] Yes, release should trigger deployment workflow
- [ ] Yes, but only for production releases (not beta/RC)
- [ ] Not applicable to this repo (GitHub Pages uses develop)

---

## SCORING & NEXT STEPS

**Please provide answers to all 50 questions above.** Your responses will be analyzed by OpenSpec to:

1. Identify conflicting requirements
2. Map dependencies between decisions
3. Highlight implementation complexity
4. Create a prioritized implementation plan

**Format for responses:**

- Fill in [ ] checkboxes with X for selected answer
- Fill in ___ blanks with custom values
- Add notes or rationale in separate section if helpful

**After questionnaire completion:**

1. Responses → OpenSpec analysis → Requirements document
2. Requirements → Detailed flow diagrams (Mermaid)
3. Diagrams → Specifications (agents, workflows, docs)
4. Specifications → Implementation plan with tasks

---

## Additional Context Questions (Optional)

**If you want to add context:** Answer these to help with OpenSpec analysis.

**Q-A:** What is the primary pain point with the current release process?
*Answer:* ___________________________________________________________

**Q-B:** What does a successful release look like to you?
*Answer:* ___________________________________________________________

**Q-C:** Are there any upcoming changes to your release process that I should know about? (e.g., moving to SaaS, changing deployment targets)
*Answer:* ___________________________________________________________

**Q-D:** What's the acceptable "time-to-release" (from "ready to release" to "live on GitHub")?
*Answer:* ___________________________________________________________

---

*Questionnaire Version: 1.0*  
*Created: 2026-08-05*  
*Status: AWAITING RESPONSES*

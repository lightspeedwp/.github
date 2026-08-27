---
title: Questionnaire Answering Guide
description: Help for filling out QUESTIONNAIRE.md with examples, tradeoffs, and decision frameworks
---

# Questionnaire Answering Guide

**Purpose:** Explain what good answers look like, show tradeoffs, and help you think through each question.

---

## How to Use This Guide

For each question group, I'll show:

- **What the question is asking**
- **Suggested answers** (with pros/cons for each)
- **Tradeoff examples** (what happens if you choose A vs B)
- **Recommended approach** (based on your stated preference for develop-first flow)
- **How it affects downstream work**

Then you can copy the recommended answer into QUESTIONNAIRE.md, or choose a different option if it better matches your needs.

---

## PART 1: RELEASE FLOW ARCHITECTURE

### Q1: Primary Branch for Development

**What it's asking:** Is `develop` the main branch where most work happens, or should it be something else?

**Suggested Answers:**

```
[ ] Yes, develop is the source of truth; all integration happens here
    ✅ Pros: Matches current setup; integrates features continuously
    ❌ Cons: Must protect develop branch; requires CI on every merge
    
[ ] No, switch to a different primary branch
    ✅ Pros: Could reduce develop branch protection overhead
    ❌ Cons: Breaking change; all documentation, workflows, CI would need rewrite
    
→ RECOMMENDED: First option (develop remains primary)
  Reason: Already your current model; avoids massive migration
```

**How it affects downstream:**

- If YES: develop is gated by CI/lint/tests; hotfixes come from main back to develop
- If NO: would require rethinking entire branching strategy (out of scope for this redesign)

**Your Answer:**

```
[X] Yes, develop is the source of truth; all integration happens here
```

---

### Q2: Release PR Target — First Stage

**What it's asking:** When you create `release/vX.Y.Z` branch, should the first PR go to develop or main?

**This is THE critical architectural question.** Your answer determines everything else.

**Suggested Answers:**

```
[ ] develop (your stated preference)
    ✅ Pros:
       - Final version/changelog finalized and tested on develop
       - develop always has current version (no skew)
       - Post-release sync is automatic (no separate job needed)
       - Aligns with develop-first philosophy
    
    ❌ Cons:
       - Adds extra step (develop PR before main PR)
       - More complex workflow (stacked PRs)
       - Requires testing release process twice (on develop, then main)
    
    Impact: Creates "stacked PR" flow:
      release/vX.Y.Z → PR #100 to develop (runs CI)
        ↓ (merge to develop)
      develop → PR #101 to main (tagged after merge)
    
[ ] main (current implementation)
    ✅ Pros:
       - Simpler workflow (one PR, one target)
       - Faster to release (skip develop step)
       - Current implementation (no workflow changes)
    
    ❌ Cons:
       - develop gets out of sync (wrong version)
       - No final integration testing on develop
       - Next release starts from stale develop
       - Post-release sync must be done separately
    
    Impact: Creates "direct release" flow:
      release/vX.Y.Z → PR #100 to main (tagged after merge)
                   ↗︎ develop stays at old version
    
→ RECOMMENDED: develop (aligns with your briefing)
  Reason: You explicitly said "shouldn't push to main... should push back to develop"
          This implements exactly that.
```

**How it affects downstream:**

- Choose develop → Q3 becomes "how to auto-sync?" (already have answer: stacked PR)
- Choose main → Q3 becomes "manual develop sync?" (more work post-release)

**Your Answer:**

```
[X] develop (your stated preference: finalize version/changelog here first)

If develop: [ ] Yes, full CI/lint/test
```

**Follow-up guidance for the "If develop" checkbox:**

- Full CI/test? **YES** — You want release-ready code before tagging main
- Why? Because failing tests on develop before merge to main prevents tagging broken releases

---

### Q3: Post-Release Sync Strategy

**What it's asking:** After releasing to main, does version/changelog flow back to develop?

**Context:** If you chose develop-first (Q2), develop already has the version bump. But if you chose main-first, develop needs updating.

**Suggested Answers:**

```
[ ] Automated sync: PR from main → develop after each release
    ✅ Pros: Automatic; no manual steps; develop always up-to-date
    ❌ Cons: Requires extra automation; another PR workflow
    
    How it works:
      1. User releases
      2. Tag created on main
      3. Automated job: gh pr create --base develop --head main
      4. Bot merges PR to develop
      5. Next feature starts with correct version
    
[ ] Semi-automated: Generate patch branch, user manually merges
    ✅ Pros: User has control; can review changes
    ❌ Cons: Manual step (easy to forget); not repeatable
    
[ ] Manual: Document procedure, users execute by hand
    ✅ Pros: Transparent; no automation bugs
    ❌ Cons: Error-prone; often forgotten
    
[ ] No sync: develop stays separate; next release derives version from scratch
    ✅ Pros: Simplest (no extra automation)
    ❌ Cons: develop gets stale; version history confusion
    
→ RECOMMENDED: Depends on Q2 choice:
  
  If Q2 = develop-first:
    "No sync" is fine — develop was already updated in the first PR
    Sync only needed if you want main → develop for audit trail (optional)
  
  If Q2 = main-first:
    "Automated sync" is required — main has new version, develop needs it
```

**Your likely answer** (based on develop-first preference):

```
[ ] No sync: develop stays separate; next release derives version from scratch

Rationale: If release PR is to develop first, develop is already updated.
           When develop merges to main later, version is already correct.
           No back-sync needed.
```

---

### Q4-Q8: Other Flow Questions

Rather than repeat this level of detail for each, here's the **fast path:**

**Q4: Release Branch Cleanup Timing**

```
→ RECOMMENDED: After GitHub Release is published (final step)
  Why: Keeps branch around for audit trail; deleted only when release fully confirmed
```

**Q5: Hotfix Flow Integration**

```
→ RECOMMENDED: Auto-sync hotfix version back to develop
  Why: Same logic as releases — develop must stay up-to-date with version
```

**Q6: Pre-Release Branch Protection**

```
→ RECOMMENDED: Yes, same as main (require reviews, CI green)
  Why: Release branch is the official tagged version; protect it
```

**Q7: Stacked PR Strategy Decision**

```
→ RECOMMENDED: Yes, adopt stacked PR strategy
  Why: Your develop-first preference naturally uses stacked PRs.
       PR #100: release → develop (runs tests, validates)
       PR #101: develop → main (runs tests again, tagged after merge)
```

**Q8: Dry-Run Mode Default**

```
→ RECOMMENDED: Change to false (remove default; require explicit input)
  Why: Makes user think intentionally ("do I want live or dry-run?")
       Default true is safer but makes live release feel like extra step
       Default false makes it clearer that you're about to ship
```

---

## PART 2: VERSION & CHANGELOG MANAGEMENT

### Q9: Version Bump Determination

**What it's asking:** How does the system know whether to bump patch, minor, or major?

**Suggested Answers:**

```
[ ] User inputs explicit version (--version=X.Y.Z)
    ✅ Pros: Flexible; user has full control
    ❌ Cons: User must know SemVer rules; prone to mistakes
    
[ ] User specifies scope (--scope=patch|minor|major) and tool derives version
    ✅ Pros: User just picks scope; tool does math (0.6.0 + patch = 0.6.1)
    ❌ Cons: Only works if user knows scope (must read changelog)
    
[ ] Tool reads changelog and infers scope from entry types
    ✅ Pros: Automatic; user just releases
    ❌ Cons: Requires perfect changelog (Added=minor, Fixed=patch, Removed=major)
    ❌ Cons: Fails if changelog has mixed types (2 Added + 1 Removed → major or minor?)
    
[ ] Tool reads Git tags and derives scope from commit messages
    ✅ Pros: Automatic
    ❌ Cons: Requires conventional commits (feat:, fix:); fragile
    
[ ] Hybrid: try scope first, fallback to explicit version
    ✅ Pros: Best of both worlds
    ❌ Cons: More complex implementation
    
→ RECOMMENDED: Hybrid (try scope first, fallback to explicit)
  Why: 
    - Most releases: user just runs --scope=patch
    - If unsure: user can explicitly set --version=1.5.0
    - Gives flexibility but defaults to simple case
```

**Your Answer:**

```
[X] Hybrid: try scope first, fallback to explicit version

Implementation detail:
  1. Workflow input: --scope=patch OR --version=1.0.0
  2. If scope provided: validate against current VERSION file, derive next version
  3. If version provided: use it as-is (skip scope)
  4. If neither: fail with clear error message
```

---

### Q10-Q16: Changelog & Versioning

**Fast path for these (based on your Keep a Changelog alignment):**

**Q10: VERSION File Format**

```
→ RECOMMENDED: Keep single-line X.Y.Z format
  Why: Simple, human-readable, matches semantic versioning spec
```

**Q11: Pre-release Version Support**

```
→ RECOMMENDED: Yes, optional; support it but don't require
  Why: Gives flexibility (v1.0.0-beta.1, v1.0.0-rc.1) without forcing its use
```

**Q12: Unreleased Section Requirement**

```
→ RECOMMENDED: Hard block: refuse to release, fail workflow
  Why: Forces changelog discipline; prevents "empty" releases with no documented changes
```

**Q13: Changelog Validation Timing**

```
→ RECOMMENDED: On PR to develop AND on release.yml (before agent runs)
  Why: Catch errors early (on PR) and again at release time (final gate)
```

**Q14: Changelog Sections Order**

```
→ RECOMMENDED: Yes, strict ordering required
  Why: Consistency; readers know where to find information
```

**Q15: Release Notes Generation**

```
→ RECOMMENDED: Medium; needs tuning for highlights/breaking changes
  Why: Current implementation works but could be smarter about what's highlighted
```

**Q16: Changelog Entry Deduplication**

```
→ RECOMMENDED: Yes, works fine
  Why: Your current merge-entries.cjs handles this correctly
```

---

## PART 3: GOVERNANCE & AUTHORIZATION

### Q17: Release Authorization

**What it's asking:** Who is allowed to trigger the release workflow?

**This is important for security and compliance.**

**Suggested Answers:**

```
[ ] Anyone with write access
    ✅ Pros: No restrictions; team autonomy
    ❌ Cons: Anyone can release anything; risky for production
    
[ ] Only team leads (list: _________________)
    ✅ Pros: Controlled; responsible people make decisions
    ❌ Cons: Bottleneck; slower releases if lead unavailable
    
[ ] Only service account (e.g., lightspeed-bot)
    ✅ Pros: Automated; consistent
    ❌ Cons: User can't manually trigger; need separate approval workflow
    
[ ] Require PR approval before release (workflow must be part of PR)
    ✅ Pros: Review gate; catches mistakes
    ❌ Cons: Extra step; not needed if tests are good
    
→ RECOMMENDED: Only team leads (or yourself, as single decision-maker)
  Why: You said "it is only me deciding" — so just you can trigger releases
       If team grows later, expand to specific leads
```

**Your Answer:**

```
[X] Only team leads (list: Ash Shaw)

Note: Single decision-maker model for now.
      If team expands, add other leads to this list.
      Update labeler.yml to auto-label releases with your GitHub username.
```

---

### Q18-Q22: Gating, Approval, Audit, Notifications

**Fast path (based on single decision-maker):**

**Q18: Authorization Enforcement**

```
→ RECOMMENDED: Yes, implement proper authorization checks
  Why: Current telemetry doesn't work; fix it to validate only authorized users can trigger
       Use GitHub's branch protection + Action permissions for enforcement
```

**Q19: Release Approval Workflow**

```
→ RECOMMENDED: No, workflow is approval enough (tests/lint gates it)
  Why: You're deciding alone; your running the workflow IS the approval
       If tests pass, release is good to go
```

**Q20: Rollback Authorization**

```
→ RECOMMENDED: Same as release trigger (only you)
  Why: If only you can release, only you can rollback
```

**Q21: Release Audit Trail**

```
→ RECOMMENDED: Yes, log all release attempts (successful and failed)
  Why: Track what happened; helps debug issues; compliance audit trail
```

**Q22: Notification on Release**

```
→ RECOMMENDED: Slack channel #releases (or your preferred channel)
  Why: Team visibility; everyone knows what shipped and when
```

---

## PART 4: TESTING & VALIDATION GATES

### Q23-Q30: Testing & Validation

**These are straightforward — recommend strict validation:**

**Q23: Pre-Release Testing**

```
→ RECOMMENDED: All of the above
  npm test + npm run lint + changelog validation + manual checklist
  
  Why: Multiple gates catch different problems:
    - Tests: code correctness
    - Lint: style + quality
    - Changelog: documentation completeness
    - Checklist: manual verification (VERSION file, git clean, etc.)
```

**Q24: Changelog Validation Strictness**

```
→ RECOMMENDED: Add all three:
  - Link target validation (PR actually exists)
  - Entry doesn't duplicate previous releases
  - Entry matches commit/PR scope
  
  Why: Prevents bad changelog data from shipping
```

**Q25: Version Format Validation**

```
→ RECOMMENDED: Strict SemVer (X.Y.Z only)
  Why: Keep it simple; pre-release support is optional (via --version flag)
```

**Q26: Commit Message Format**

```
→ RECOMMENDED: No special format; use default release agent message
  Why: Release commits are machine-generated; specific format not needed
       Human commits to regular branches follow your existing standards
```

**Q27: Working Tree Validation**

```
→ RECOMMENDED: Yes, fail if any uncommitted changes
  Why: Prevents accidental uncommitted changes from being in release
```

**Q28: Git Tag Naming**

```
→ RECOMMENDED: Always use v prefix (v1.0.0)
  Why: Standard convention; clear what's a release vs other tags
```

**Q29: GitHub Release Creation**

```
→ RECOMMENDED: Always create; release isn't complete without it
  Why: GitHub Release is the public artifact; it's essential
```

**Q30: GitHub Release as "Latest"**

```
→ RECOMMENDED: Mark by SemVer (highest version wins)
  Why: Auto-correct; latest is always the highest released version
       Pre-releases never marked as latest (pre-release is not "latest stable")
```

---

## PART 5: ERROR HANDLING & ROLLBACK

### Q31-Q37: Rollback & Error Recovery

**Recommended answers (these are important for production safety):**

**Q31: Rollback Automation**

```
→ RECOMMENDED: Yes, create rollback.cjs with one-button revert
  Why: 
    - Prevents manual mistakes
    - Repeatable procedure
    - Clear audit trail of rollback
    - Your audit found this is MISSING and referenced in docs (create it!)
```

**Q32: Partial Release Recovery**

```
→ RECOMMENDED: Auto-cleanup; delete PR and exit without tagging
  Why: If PR created but agent validation fails, rollback cleanly
       Don't leave half-done releases in git
```

**Q33: Failed Validation Recovery**

```
→ RECOMMENDED: Workflow fails; user must fix and rerun
  Why: If validation fails, something is wrong; don't auto-proceed
       User must fix root cause (bad changelog, version mismatch)
```

**Q34: Tag Conflict Handling**

```
→ RECOMMENDED: Fail; refuse to overwrite existing tag
  Why: If tag exists, previous release already happened
       Overwriting would corrupt history
       User should roll back first, then retry
```

**Q35: Release Notes Rollback**

```
→ RECOMMENDED: Publish amended release with "retracted/rollback" notice
  Why: Can't delete GitHub Release (breaks links)
       Instead: unpublish old, publish new with retraction notice
       Clear to users what happened
```

**Q36: Changelog Rollback**

```
→ RECOMMENDED: Auto-revert: [X.Y.Z] section moves back to [Unreleased]
  Why: Changelog should always reflect reality
       If release is rolled back, version shouldn't be released
       Revert to unreleased state for next attempt
```

**Q37: Incomplete Release Detection**

```
→ RECOMMENDED: Check for existing tag; fail if present
  Why: Prevents accidental double-releases
       If tag vX.Y.Z exists, can't create another one
       Triggers rollback/cleanup
```

---

## PART 6: DOCUMENTATION & STANDARDS

### Q38-Q44: Documentation

**Recommendations (based on your audit findings):**

**Q38: Release Documentation Organization**

```
→ RECOMMENDED: Split: separate docs for flow, automation, troubleshooting, rollback
  Why:
    - RELEASE_PROCESS.md: Main flow + checklist
    - RELEASE_AUTOMATION.md: Workflow YAML, agent details, triggers
    - RELEASE_TROUBLESHOOTING.md: Common issues + solutions
    - RELEASE_ROLLBACK.md: Step-by-step rollback procedure
  
  Benefit: Each doc has single focus; easier to maintain; easier to find info
```

**Q39: Documentation Audience**

```
→ RECOMMENDED: All three (need separate sections per audience)
  Why:
    - Technical leads: need automation details (workflows, agents)
    - Developers: need "how to prepare" (changelog format, testing)
    - Release manager: need procedures (step-by-step, edge cases)
    
  Solution: Single doc with clear sections, or separate docs per role
```

**Q40: Release Checklist**

```
→ RECOMMENDED: Yes, checklist in docs + enforced by workflow
  Why:
    - Docs provide clarity
    - Workflow enforces (prevents skipping steps)
    - Best of both: human-readable + automated
```

**Q41: Badge Management**

```
→ RECOMMENDED: Add CI check to prevent adding badges for missing workflows
  Why: Audit found broken badges for non-existent workflows
       CI validation prevents this in future
       Rule: "Every workflow referenced in badge must exist"
```

**Q42: Documentation Maintenance**

```
→ RECOMMENDED: CI validation (auto-detect drift, flag in PR)
  Why:
    - Catch doc/code misalignment before merge
    - No manual review needed
    - Actionable feedback to PR author
```

**Q43: Decision Records**

```
→ RECOMMENDED: Single ADR for entire release redesign
  Why:
    - Central record of "why" this release process was chosen
    - References questionnaire + OpenSpec output
    - Easy to review when future changes needed
```

**Q44: Beta/RC Documentation**

```
→ RECOMMENDED: Yes, with examples (v1.0.0-beta.1, v1.0.0-rc.1)
  Why:
    - Supports pre-release versions (Q11 answer)
    - Gives clear guidance if user needs beta release
    - Doesn't hurt to document optional feature
```

---

## PART 7: INTEGRATION WITH BROADER SYSTEM

### Q45-Q50: Integration

**Recommendations (based on your codebase analysis):**

**Q45-Q47: Relation to Other Docs**

```
→ RECOMMENDED: 
  Q45: Yes, branching docs are aligned
  Q46: Yes, changelog docs assume direct-main flow; need updating
  Q47: Yes, add release workflow to automation overview table

Why: Audit found misalignments between:
  - RELEASE_PROCESS.md (says PR to main)
  - BRANCHING_STRATEGY.md (says develop is primary)
  - CHANGELOG_AUTOMATION.md (unclear on release integration)
  
Solution: During design phase, rewrite all three to align
```

**Q48: GitHub Project Integration**

```
→ RECOMMENDED: Yes, mark released version milestone as done
  Why:
    - Provides visibility
    - Closes out release milestone
    - Teams can see what's "released" vs "in progress"
```

**Q49: Semantic Versioning Guidance**

```
→ RECOMMENDED: Yes, add decision flowchart (when do you bump major vs minor?)
  Why: VERSIONING.md has SemVer basics but not decision-making
       Add flowchart: "Has breaking change?" → yes = major bump
```

**Q50: Deployment Integration**

```
→ RECOMMENDED: Yes, but only for production releases (not beta/RC)
  Why:
    - Release to main = production ready
    - Should automatically trigger deployment
    - But don't auto-deploy pre-releases (beta/RC)
    
Note: Your repo uses GitHub Pages (awesome-github-site.yml)
      Already deploys on develop push; may want release to also trigger
```

---

## Timeline & Resource Estimates

### Time to Answer Questionnaire

**Estimate:** 60-90 minutes total

**Breakdown:**

- Skim questions: 10 min
- Answer straightforward questions (Q1, Q4-8, Q10, Q23-30): 20 min
- Answer complex questions (Q2-3, Q9, Q17-22, Q31-44, Q45-50): 30-40 min
- Review answers + context section: 10 min

**If you want it faster:**

- Use the "RECOMMENDED" answers in this guide → just copy them in
- Time to copy answers: 15-20 minutes
- Time to customize answers to your specific needs: 60+ minutes

### Time for OpenSpec Analysis (My Work)

**Estimate:** 2-3 hours

**Breakdown:**

- Parse questionnaire: 20 min
- Identify dependencies + conflicts: 30 min
- Generate architecture spec + diagrams: 60 min
- Create implementation plan: 30 min
- Review for quality: 20 min

**Deliverables:**

- requirements.md (formal specification)
- decision-matrix.md (dependencies)
- architecture-spec.md (YAML, pseudocode, diagrams)
- implementation-plan.md (tasks with estimates)

### Total Timeline to Design Phase

```
Day 1 (You): Complete QUESTIONNAIRE.md
             60-90 min answering
             
Day 1 (Me):  OpenSpec analysis
             2-3 hours
             
Day 2 (Me):  Draft ADRs
             Create detailed task breakdown
             Identify implementation blockers
             
Day 3 (You): Review + approve design
             Clarify any conflicts
             
→ Ready to implement!
```

**Total: 3 calendar days, ~1 day of your time, ~8 hours of my time**

### Resource Needs

**What you have:**

- ✅ Git repository (lightspeedwp/.github)
- ✅ Existing workflows (release.yml, changelog-management.yml)
- ✅ Release agent code (scripts/agents/release.agent.js)
- ✅ Documentation (RELEASE_PROCESS.md, etc.)

**What you'll need to add:**

- ⚠️ **Rollback automation** (scripts/workflows/release/rollback.cjs) — currently missing but documented
- ⚠️ **Test environment** — for testing new workflow (test branch, test tags)
- ⚠️ **CI/validation** — badge check in CI (prevent adding broken badges)

**Team/Skills:**

- ✅ You: Product decisions, questionnaire answers
- ✅ Me: OpenSpec analysis, technical design, implementation
- ⚠️ Future: Test engineer (for release testing phase), documentation reviewer

---

## How to Get Started

### Option A: Copy-Paste Recommended Answers (Fast)

1. Open QUESTIONNAIRE.md
2. For each question, copy the "RECOMMENDED" answer from this guide
3. Modify only if your requirements differ
4. Time: 15-20 minutes

### Option B: Think Through Each Question (Thorough)

1. Read the "What it's asking" section
2. Read all options with pros/cons
3. Understand the tradeoffs
4. Pick the best answer for YOUR needs
5. Time: 60-90 minutes

### Option C: Hybrid (Balanced)

1. Quick scan of all questions (10 min)
2. For straightforward ones: copy recommended (20 min)
3. For complex ones: read tradeoffs, pick best answer (30 min)
4. Total: ~60 minutes

---

## Example: How Q2 Works (Most Critical Question)

**Let's walk through the most important question to show you the process:**

### Q2: Release PR Target — First Stage

**Current Implementation:** PR targets main directly

```
develop (0.6.0)
  ↓ creates release/v0.7.0
release/v0.7.0 (bumps to 0.7.0, updates changelog)
  ↓ PR created
PR: release/v0.7.0 → main
  ↓ CI runs, tests pass
main (0.7.0)
  ↓ tag created
v0.7.0 released!
develop still at 0.6.0 ❌ STALE!
```

**Your Preference:** PR should target develop first

```
develop (0.6.0)
  ↓ creates release/v0.7.0
release/v0.7.0 (bumps to 0.7.0, updates changelog)
  ↓ PR #100 created
PR #100: release/v0.7.0 → develop
  ↓ CI runs on develop, tests pass
develop (0.7.0) ✅ VERSION UPDATED!
  ↓ then later, create PR #101
PR #101: develop → main
  ↓ CI runs, tests pass, review approved
main (0.7.0)
  ↓ tag created
v0.7.0 released!
develop already has 0.7.0 ✅ NO SKEW!
```

**Your Answer:**

```
[X] develop (your stated preference: finalize version/changelog here first)

If develop: [X] Yes, full CI/lint/test
```

**Why this matters:**

- Next feature branch starts from correct version
- No "version skew" between main and develop
- Cleaner release history
- More work (two PRs instead of one)

**In OpenSpec output:**

- Architecture spec will show both flows with diagrams
- Implementation plan will include tasks to update release.agent.js
- Timeline will show "2-3 days to implement new flow"

---

## Questions to Ask Yourself While Answering

As you go through the questionnaire, ask yourself:

1. **Is this decision reversible?** (If not, think harder)
   - Example: Authorizing only you to release = reversible (can add others later)
   - Example: Deleting release branches immediately = not reversible (harder to audit trail)

2. **What's the failure case?** (What goes wrong if I choose this?)
   - Example: No version sync after release = next release starts stale
   - Example: Dry-run default true = developers might forget to actually release

3. **Who does this affect?** (Just me or the whole team?)
   - Example: Authorization = affects team (should you decide alone or coordinate?)
   - Example: Documentation structure = affects everyone who reads docs

4. **What's the cost if wrong?** (Time, data, broken releases?)
   - Example: Bad rollback automation = potential broken release stuck in prod
   - Example: No pre-release checklist = accidental release with broken tests

---

## Ready to Start?

**Pick your approach:**

```
A) Fast: Use recommended answers (15-20 min)
   ✅ Saves time
   ❌ Might miss something specific to your needs
   
B) Thorough: Read all tradeoffs (60-90 min)
   ✅ Best understanding
   ❌ Takes longer
   
C) Hybrid: Scan + copy recommended + customize where needed (60 min)
   ✅ Balanced
   ❌ Requires more active thinking

Recommendation: Start with Hybrid
  - Copy all the "RECOMMENDED" answers from this guide
  - Then review each one and modify if your needs differ
  - Takes about 1 hour total
```

**Next Step:** Fill in QUESTIONNAIRE.md using your chosen approach, then let me know when done!

---

*Questionnaire Answering Guide — v1.0*

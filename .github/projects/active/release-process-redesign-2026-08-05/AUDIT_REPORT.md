# Release Process Audit Report

## Executive Summary

**Status:** 🔴 **CRITICAL ISSUES IDENTIFIED**

This audit identified **3 critical issues**, **7 major process flow problems**, and **5 documentation inconsistencies** that must be resolved before the next release.

### Key Findings

1. **Process Flow Mismatch** — Documentation and implementation disagree on whether release PRs target `develop` or `main`
2. **Missing Workflow** — Badge references non-existent `changelog-auto-update` workflow
3. **Authorization Gating Failure** — Telemetry job doesn't properly gate subsequent jobs
4. **No Post-Release Sync** — No documented or automated mechanism to sync `main` back to `develop` after release
5. **Broken Documentation Links** — Multiple badges and references point to workflows that don't exist

---

## 1. CRITICAL ISSUES

### 1.1 Release Flow Architecture Contradiction

**Severity:** 🔴 CRITICAL

**The Issue:**

- **Documentation (RELEASE_PROCESS.md)** states: "Agent creates `release/vX.Y.Z`... opens a PR to `main`" (line 21)
- **Documentation (VERSIONING.md)** states: "Release Preparation: Create `release/*` branch from `develop`" (line 113)
- **Your requirement** (from audit briefing): Release should: `develop` → PR merge → `develop` (with cleanup/linting) → PR to `main` → tag & release from `main`

**Current Implementation:**

```
develop (checkout) → release/vX.Y.Z (created) → PR to main (created by agent)
```

**Expected Implementation (per your briefing):**

```
develop (checkout) 
  → release/vX.Y.Z (created from develop)
  → PR to develop (created, runs CI)
  → merge to develop (with version bump & changelog finalized)
  → PR to main (created from develop)
  → merge to main (tagged and released)
```

**Impact:**

- No mechanism for running final linting/cleanup on develop before pushing to main
- Version bumps and changelog updates exist only in release branch, not integrated back to develop
- Next release cycle starts from stale develop (missing version bump)
- If release PR to main is rejected, changes are lost

**Evidence:**

```javascript
// scripts/agents/release.agent.js, line 865
gh pr create --base main --head ${branch}  // ← PR target is main, not develop
```

**Action Required:**
[ ] Redesign release flow to match your requirement  
[ ] Update RELEASE_PROCESS.md with new flow  
[ ] Modify release.agent.js to create PR to develop first  
[ ] Document post-release sync from main back to develop

---

### 1.2 Authorization Gating Failure

**Severity:** 🔴 CRITICAL

**The Issue:**
The `trigger-telemetry` job is supposed to gate release execution, but doesn't actually block unauthorized triggers:

```yaml
# .github/workflows/release.yml, line 88
if: needs.trigger-telemetry.outputs.unauthorized_attempts == '0'
```

**Problem:**

- The `if:` condition checks **output** `unauthorized_attempts` but telemetry job may not set this properly
- Even if it does, the job runs with `continue-on-error: true` (line 73), so errors don't block
- Subsequent jobs depend on this gate but there's no validation that it succeeded

**Impact:**

- Unauthorized users could trigger release workflow despite intent to restrict
- No audit trail of failed authorization attempts
- Security/governance violation

**Current Code:**

```yaml
trigger-telemetry:
  runs-on: ubuntu-latest
  outputs:
    unauthorized_attempts: ${{ steps.telemetry.outputs.unauthorized_attempts }}
    is_authorized: ${{ steps.telemetry.outputs.is_authorized }}
  steps:
    - id: telemetry
      name: Validate trigger authorization
      continue-on-error: true  # ← PROBLEM: Doesn't stop the job
      env:
        GITHUB_EVENT_NAME: ${{ github.event_name }}
        GITHUB_ACTOR: ${{ github.actor }}
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      run: node scripts/workflows/release/trigger-telemetry.cjs
```

**Action Required:**
[ ] Remove `continue-on-error: true` from telemetry step  
[ ] Add explicit `if: failure()` catch to log unauthorized attempts  
[ ] Add step to validate telemetry outputs before proceeding  
[ ] Test that unauthorized trigger is actually blocked

---

### 1.3 Missing Workflow: changelog-auto-update

**Severity:** 🔴 CRITICAL (Broken Badges)

**The Issue:**
Workflow badges in BRANCHING_STRATEGY.md and VERSIONING.md reference workflows that don't exist:

```markdown
[![changelog-auto-update](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml/badge.svg)](...)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg)](...)
```

**Actual Workflows (41 total):**

```
✅ changelog-management.yml (exists)
❌ changelog-auto-update.yml (MISSING)
❌ checklist-finalisation.yml (MISSING)
```

**Impact:**

- Badges show as broken/red in documentation
- Confuses users about actual automation
- When publishing release, broken badges undermine confidence
- Misleads developers about what workflows actually run

**Evidence:**

```bash
$ ls .github/workflows/ | grep changelog
changelog-management.yml  ✅ EXISTS

$ ls .github/workflows/ | grep checklist
# (no results) ❌ MISSING
```

**Action Required:**
[ ] Remove badge references to missing workflows  
[ ] Add badges only for workflows that exist  
[ ] Verify all badge URLs are live and passing  
[ ] Add CI check to prevent adding badges for non-existent workflows

---

## 2. MAJOR PROCESS FLOW ISSUES

### 2.1 No Post-Release Sync from main → develop

**Severity:** 🟠 MAJOR

**The Issue:**
After merging release PR to `main`, the version bump and changelog updates stay only on `main`. The `develop` branch is not updated.

**Current Flow:**

```
develop (1.0.0)
  ↓ (create release/v1.1.0)
release/v1.1.0 (bumps to 1.1.0)
  ↓ (PR to main)
main (receives 1.1.0)
develop (still 1.0.0) ← STALE!
```

**Impact:**

- Next `develop` feature is developed against wrong version
- Version numbers diverge between main and develop
- Next release agent will re-bump from stale 1.0.0 base

**Evidence:**
RELEASE_PROCESS.md mentions "Post-merge: verify no drift" (line 85) but provides no automated mechanism.

**Action Required:**
[ ] Document post-release sync procedure  
[ ] Add automated job to sync main back to develop after release merge  
[ ] Or: implement release flow where develop is primary (as you prefer)

---

### 2.2 Changelog Validation Timing Issues

**Severity:** 🟠 MAJOR

**The Issue:**
Changelog validation happens in two places with unclear precedence:

1. **changelog-management.yml** — validates on every PR to develop (line 103)
2. **release.yml** — calls changelog-management.yml reusable workflow, then runs its own validation (line 144-147)
3. **release.yml** — runs post-release validation (line 157-162) only if `dry_run == false`

**Problem:**

- Post-release validation happens AFTER changelog is already modified by agent
- If validation fails post-release, release is already committed
- No clear responsibility: is PR validation sufficient, or is release validation needed?

**Evidence:**

```yaml
# .github/workflows/release.yml
- name: Validate changelog (schema + unreleased content)
  run: |
    node scripts/validation/validate-changelog.cjs CHANGELOG.md
    node scripts/agents/includes/changelogUtils.cjs --unreleased CHANGELOG.md
- name: Run Release Agent  # ← Agent modifies changelog
  run: node scripts/workflows/release/run-release-agent.cjs
- name: Validate changelog post-release  # ← Validation after modification
  if: inputs.dry_run == false
  run: |
    node scripts/validation/validate-changelog.cjs CHANGELOG.md  # ← Validates modified file
```

**Action Required:**
[ ] Define clear validation boundaries: what happens at PR vs. release time  
[ ] Move post-release validation earlier (before agent modification if possible)  
[ ] Or: pre-validate release result before committing

---

### 2.3 Dry-Run Default is `true` in workflow_dispatch

**Severity:** 🟠 MAJOR

**The Issue:**
The release workflow defaults to dry-run mode:

```yaml
dry_run:
  description: "Run safety mode without creating commits/tags/releases."
  required: false
  default: true  # ← DEFAULT IS DRY-RUN
  type: boolean
```

**Impact:**

- User must explicitly uncheck "dry_run" in the UI to actually release
- Easy to forget and accidentally skip actual release
- Contradicts "ready to release" intent

**Action Required:**
[ ] Change default to `false` for workflow_dispatch  
[ ] Or: require explicit input for live releases (remove default)  
[ ] Add prominent warning if dry_run is true

---

### 2.4 No Explicit Pre-Release Checklist Enforcement

**Severity:** 🟠 MAJOR

**The Issue:**
RELEASE_PROCESS.md documents a pre-release checklist (lines 68-75) but it's not enforced by workflow. Checklist items are only guidelines:

```markdown
## Pre-release checklist (run on develop)
- [ ] `CHANGELOG.md` has unreleased entries and passes schema validation
- [ ] `VERSION` matches intended bump source
- [ ] Lint/tests green
- [ ] Agent/workflow alignment
- [ ] Documentation current
- [ ] No uncommitted changes
```

**Problem:**

- No workflow step verifies these conditions
- Release can proceed even if conditions aren't met
- Only discovered post-release when tests fail or docs are stale

**Action Required:**
[ ] Add pre-release validation step to release.yml  
[ ] Verify: VERSION file format and bump scope match  
[ ] Verify: [Unreleased] section has entries  
[ ] Verify: No uncommitted changes in working tree  
[ ] Verify: lint/tests pass

---

### 2.5 Release Agent Has No Rollback Automation

**Severity:** 🟠 MAJOR

**The Issue:**
RELEASE_PROCESS.md documents manual rollback (lines 114-132):

```bash
# Delete branch, tag, release manually
git tag -d vX.Y.Z
git push origin :refs/tags/vX.Y.Z
gh release delete vX.Y.Z --yes
# ... restore VERSION and CHANGELOG manually
```

**Problem:**

- All rollback steps are manual
- Error-prone; easy to leave partial state
- No rollback script exists despite reference to one (line 130: `rollback.cjs`)

**Evidence:**

```bash
$ ls scripts/workflows/release/
run-release-agent.cjs  ← EXISTS
rollback.cjs           ← REFERENCED IN DOCS BUT FILE NOT FOUND
```

**Action Required:**
[ ] Create `scripts/workflows/release/rollback.cjs` with proper implementation  
[ ] Add rollback job to release.yml triggered on explicit user request  
[ ] Test rollback procedure before production use

---

### 2.6 Trigger Telemetry Doesn't Actually Stop Unauthorized Releases

**Severity:** 🟠 MAJOR

**The Issue:**
Telemetry job has `continue-on-error: true`, so even if authorization fails, workflow continues:

```yaml
- id: telemetry
  name: Validate trigger authorization
  continue-on-error: true  # ← If this fails, workflow still runs!
  run: node scripts/workflows/release/trigger-telemetry.cjs
```

Then downstream jobs check:

```yaml
if: needs.trigger-telemetry.outputs.unauthorized_attempts == '0'
```

But if telemetry fails or doesn't set output, the condition is **undefined**, which GitHub treats as **false**, so jobs are **skipped**... but then the workflow succeeds with no jobs run, which is silent failure.

**Impact:**

- Authorization bypass possible
- Silent failure if telemetry script crashes
- No clear error message to user

**Action Required:**
[ ] Remove `continue-on-error: true`  
[ ] Add explicit output validation  
[ ] Add failure notification if telemetry fails

---

### 2.7 Release Notes Preview Not Generated for Dry-Runs

**Severity:** 🟠 MAJOR

**The Issue:**
The `build-notes-preview.cjs` script is called but its implementation is unclear:

```yaml
- name: Build dry-run release notes preview
  if: inputs.dry_run == true
  env:
    INPUT_NOTES_FROM: ${{ inputs.notes_from || github.event.inputs.notes_from || '' }}
  run: node scripts/workflows/release/build-notes-preview.cjs
```

**Problem:**

- User can't see what release notes will look like before committing
- Dry-run produces `release-agent.log` and `release-notes-preview.md` but user must download artifacts
- No inline preview in workflow summary

**Action Required:**
[ ] Verify `build-notes-preview.cjs` generates valid output  
[ ] Add step to post notes preview as workflow comment  
[ ] Or: add step to upload as artifact with clearer naming

---

## 3. DOCUMENTATION INCONSISTENCIES

### 3.1 RELEASE_PROCESS.md vs BRANCHING_STRATEGY.md vs VERSIONING.md

**Severity:** 🟡 MEDIUM

| File | Says | Evidence |
|------|------|----------|
| RELEASE_PROCESS.md | "opens PR to main" | Line 21 |
| BRANCHING_STRATEGY.md | "merge to main and tag" | Section 7, line 331 |
| VERSIONING.md | "create release/* from develop, merge to main" | Lines 113-115 |
| **Your requirement** | "develop → PR to develop → develop → PR to main → tag from main" | Audit briefing |

**Problem:**
All three docs align on the "release → main" flow, but your requirement is different. Need to clarify:

- Is current flow correct and your understanding needs updating?
- Or should current flow change to match your requirement?

**Action Required:**
[ ] Clarify desired flow with team  
[ ] Update all three docs to match the chosen flow  
[ ] Add flow diagram showing version progression

---

### 3.2 Workflow Badges Point to Non-Existent Workflows

**Severity:** 🟡 MEDIUM

**Broken Badges:**

```markdown
# In BRANCHING_STRATEGY.md and VERSIONING.md
[![changelog-auto-update](...)
[![checklist-finalisation](...)
```

**Action Required:**
[ ] Remove badges for workflows that don't exist  
[ ] Keep only badges for actual workflows  
[ ] Add CI check to prevent this in future

---

### 3.3 CHANGELOG_AUTOMATION.md References Wrong Script Paths

**Severity:** 🟡 MEDIUM

**Examples:**

```markdown
Line 91: scripts/validation/changelog-rules.cjs
Line 260: scripts/workflows/changelog/merge-entries.cjs
```

**Check:**

```bash
$ find scripts -name "changelog-rules.cjs"
# Not found; should be validate-changelog.cjs
```

**Action Required:**
[ ] Audit all script path references in CHANGELOG_AUTOMATION.md  
[ ] Update to match actual file locations  
[ ] Add validation script to prevent path rot

---

### 3.4 RELEASE_PROCESS.md References Non-Existent rollback.cjs

**Severity:** 🟡 MEDIUM

**Line 130:**

```bash
node .github/scripts/workflows/release/rollback.cjs --version=X.Y.Z --provider=shell
```

**File Status:** ❌ Does not exist

**Action Required:**
[ ] Either: create rollback.cjs implementation  
[ ] Or: remove reference and use manual procedure

---

### 3.5 No Documentation of Stacked PR Strategy

**Severity:** 🟡 MEDIUM

**User mentioned:** "Stacked pull requests" and GitHub docs link for strategy

**Current state:** No documentation of whether/how stacked PRs are used in release flow

**Action Required:**
[ ] Document whether stacked PRs are used  
[ ] If yes: explain strategy (release→develop first, then develop→main)  
[ ] If no: explain why direct release→main is preferred  
[ ] Add decision record to RELEASE_PROCESS.md

---

## 4. WORKFLOW GOVERNANCE ISSUES

### 4.1 No Pre-Merge Validation Checklist

**Severity:** 🟡 MEDIUM

**Missing:**

- Workflow doesn't verify checklist items before release
- No step to confirm [Unreleased] has entries
- No step to confirm VERSION file format is valid

**Action Required:**
[ ] Add validation step for each checklist item  
[ ] Fail fast if preconditions not met

---

### 4.2 Unclear Scope of changelog-management.yml

**Severity:** 🟡 MEDIUM

**Purpose Ambiguous:**

- Is it for PR changelog validation only?
- Or does it also run before release?
- Or is it for post-merge changelog sync?

**Evidence:**

```yaml
on:
  pull_request:
    branches: [develop]
  workflow_call:  # ← Called from release.yml!
```

**Action Required:**
[ ] Document role of changelog-management.yml  
[ ] Separate concerns if needed (validation vs. sync vs. pre-release)

---

### 4.3 No Version Tag Naming Documentation

**Severity:** 🟡 MEDIUM

**User mentioned:** "GitHub tags for beta and RC versions"

**Current state:**

- Documentation mentions "v prefix" (VERSIONING.md, line 95)
- No guidance on beta/RC naming (v1.0.0-beta.1, v1.0.0-rc.1)
- No documented strategy for pre-release tags

**Action Required:**
[ ] Document tag naming for beta/RC versions  
[ ] Add examples for pre-release workflow  
[ ] Update release.agent.js to handle pre-release versions

---

## 5. MISSING AUTOMATION & TOOLING

### 5.1 No Date-Stamped Release Logs

**Severity:** 🟡 MEDIUM

**User mentioned:** "Append a date to filename for release logs"

**Current state:**

- `release-agent.log` is generated but not date-stamped
- No archive of past release logs
- Hard to track multiple release attempts

**Action Required:**
[ ] Modify release.yml to append date to log filename  
[ ] Add step to archive release logs  
[ ] Or: upload to persistent artifact storage

---

### 5.2 GitHub CLI vs Shell Scripts Decision Not Documented

**Severity:** 🟡 MEDIUM

**User asked:** "GitHub cli for workflows vs scripts? When do we use .sh?"

**Current state:**

- Some workflows use `gh` CLI (e.g., `gh pr create`)
- Some use shell scripts (e.g., `report-changelog-action.sh`)
- No documented decision on when to use each

**Action Required:**
[ ] Document decision: when to use `gh` vs shell vs node  
[ ] Add to WORKFLOW-REFACTORING-GUIDE.md or new WORKFLOW_STYLE_GUIDE.md  
[ ] Example:

- Use `gh` for GitHub API operations (create PR, create release)
- Use Node for file/changelog manipulation
- Use shell only for simple unix operations (grep, awk)

---

### 5.3 No Semantic Versioning Validation

**Severity:** 🟡 MEDIUM

**Missing:**

- No step verifies version follows SemVer format
- No validation that scope matches current version
- No check for pre-release version handling

**Action Required:**
[ ] Create validate-version.cjs if not present  
[ ] Add step to verify version matches SemVer pattern  
[ ] Add step to verify scope transition is valid

---

## 6. RECOMMENDATIONS SUMMARY

### 🔴 CRITICAL (Must Fix Before Release)

1. **Resolve release flow architecture:** Decide: direct main release vs develop-first approach
2. **Fix authorization gating:** Remove continue-on-error, add explicit gate check
3. **Fix missing workflows:** Remove badge references to non-existent workflows

### 🟠 MAJOR (Should Fix Before Release)

1. Implement post-release sync mechanism (develop ← main)
2. Clarify changelog validation timing and responsibility
3. Change dry-run default to false or require explicit input
4. Add pre-release checklist enforcement
5. Create rollback automation
6. Fix trigger telemetry to actually block unauthorized releases
7. Add release notes preview to workflow comment

### 🟡 MEDIUM (Should Fix, Plan for Next Phase)

 1. Consolidate documentation on release flow (all 3 docs must match)
 2. Fix script path references in docs
 3. Document stacked PR strategy if using it
 4. Add version tag naming guide for beta/RC
 5. Document GitHub CLI vs shell script decision
 6. Add date-stamped release logs
 7. Add semantic version validation

---

## 7. IMPLEMENTATION PRIORITY

### Phase 1: Critical Fixes (1-2 days)

- [ ] Fix authorization gating in release.yml
- [ ] Remove missing workflow badges
- [ ] Document desired release flow (develop-first vs direct-main)
- [ ] Clarify flow with team

### Phase 2: Major Fixes (3-5 days)

- [ ] Modify release flow to match chosen architecture
- [ ] Implement post-release sync (or redesign flow)
- [ ] Add pre-release checklist enforcement
- [ ] Create rollback.cjs
- [ ] Update dry-run default
- [ ] Update all documentation to match

### Phase 3: Medium Fixes (ongoing)

- [ ] Consolidate documentation
- [ ] Fix script references
- [ ] Add beta/RC guidance
- [ ] Add workflow style guide
- [ ] Implement date-stamped logs

---

## 8. NEXT STEPS

1. **Review with team:**
   - [ ] Confirm desired release flow (develop-first vs direct-main?)
   - [ ] Confirm authorization gating requirements
   - [ ] Confirm which medium-priority items to address

2. **Create tracking issues:**
   - [ ] Release process redesign epic
   - [ ] Authorization gating fix
   - [ ] Documentation consolidation
   - [ ] Missing automation (rollback, validation, logging)

3. **Begin implementation:**
   - [ ] Start with critical fixes
   - [ ] Follow with major architectural changes
   - [ ] Plan medium fixes for next sprint

---

## Appendix A: Files Requiring Updates

- [ ] `.github/workflows/release.yml` — gating, pre-release checklist, post-release sync
- [ ] `.github/workflows/changelog-management.yml` — scope clarification, integration points
- [ ] `scripts/agents/release.agent.js` — PR target branch (main vs develop)
- [ ] `scripts/workflows/release/run-release-agent.cjs` — version validation
- [ ] `scripts/workflows/release/rollback.cjs` — create new file
- [ ] `docs/RELEASE_PROCESS.md` — complete rewrite based on flow decision
- [ ] `docs/BRANCHING_STRATEGY.md` — align with RELEASE_PROCESS.md
- [ ] `docs/VERSIONING.md` — align with RELEASE_PROCESS.md, add beta/RC guidance
- [ ] `docs/CHANGELOG_AUTOMATION.md` — fix script references
- [ ] `docs/WORKFLOW-REFACTORING-GUIDE.md` — add tool selection guidance

---

## Appendix B: Test Plan

After implementing fixes, test:

1. **Dry-run release:** Verify preview is generated correctly
2. **Live patch release:** Tag and release to verify PR, tag, and release are created
3. **Live minor release:** Verify changelog sections are properly rolled
4. **Unauthorized trigger:** Verify release is blocked
5. **Post-merge sync:** Verify main changes sync back to develop
6. **Rollback:** Trigger rollback and verify all artifacts cleaned up

---

*Report Generated: 2026-08-05*  
*Audit Scope: Release workflows, changelog automation, documentation*  
*Status: AWAITING TEAM REVIEW AND PRIORITIZATION*

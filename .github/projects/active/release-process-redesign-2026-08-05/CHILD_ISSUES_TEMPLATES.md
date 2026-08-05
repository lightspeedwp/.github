---
title: Child Issues Templates
description: Templates for creating 47 child issues from Epic parent
---

# Child Issues Templates

Use these templates to create individual issues in the GitHub issue tracker. Each template references audit findings and questionnaire answers.

---

## CRITICAL ISSUES (Issues #CHILD-001 to #CHILD-003)

### CHILD-001: Fix Authorization Gating Failure

```markdown
## Summary
The trigger-telemetry job in release.yml doesn't actually block unauthorized releases. It has `continue-on-error: true`, preventing it from stopping the workflow.

## Details
- **Audit Reference:** AUDIT_REPORT.md § 1.2 (Authorization Gating Failure)
- **Severity:** 🔴 CRITICAL
- **Blocks:** Entire release workflow (security & governance)

## Problem
- `continue-on-error: true` allows job to fail silently
- Subsequent jobs skip if outputs missing, but workflow succeeds
- No actual authorization validation happening

## Solution
1. Remove `continue-on-error: true` from telemetry step
2. Add explicit output validation step
3. Fail workflow if authorization fails (no fallback)
4. Add audit logging for unauthorized attempts

## Tasks
- [ ] Review current trigger-telemetry logic
- [ ] Design authorization check (GitHub user-based or other)
- [ ] Implement proper gating
- [ ] Add audit logging
- [ ] Test that unauthorized trigger is blocked

## Related
- Questionnaire Q17-18: Authorization & Enforcement
- OPENSPEC_SETUP.md: Will inform final design
```

### CHILD-002: Fix Release Flow Architecture

```markdown
## Summary
Documentation and code disagree on whether release PRs target `main` (current code) or `develop` (your stated preference). This is the blocking architectural decision.

## Details
- **Audit Reference:** AUDIT_REPORT.md § 1.1 (Release Flow Architecture Contradiction)
- **Severity:** 🔴 CRITICAL
- **Blocks:** Design phase until flow is decided

## Problem
- RELEASE_PROCESS.md says: PR to main
- BRANCHING_STRATEGY.md implies: develop is primary
- Your requirement: PR to develop first, then main (develop-first flow)
- Current code: Direct to main

## Options
1. **Develop-First Flow (YOUR PREFERENCE)**
   - release/vX.Y.Z → PR to develop (validate, test, finalize version)
   - develop merge → PR to main (final gate)
   - main merge → tag & release
   - Benefits: develop always up-to-date, no version skew

2. **Direct-Main Flow (CURRENT)**
   - release/vX.Y.Z → PR to main (validate, test)
   - main merge → tag & release
   - develop stays stale (version skew issue)
   - Benefits: one less PR, simpler workflow

## Decision
**ADOPT DEVELOP-FIRST FLOW** (questionnaire answer Q2)

## Tasks
- [ ] Update release.agent.js line 865: PR target `develop` not `main`
- [ ] Update RELEASE_PROCESS.md with new flow diagram
- [ ] Update BRANCHING_STRATEGY.md to match
- [ ] Create flow diagrams (Mermaid)
- [ ] Update all related documentation
- [ ] Test stacked PR workflow

## Related
- Questionnaire Q2-3: Release Flow & Post-Release Sync
- MULTI_REPO_AGENT_STRATEGY.md: Incorporates this flow
- OPENSPEC_SETUP.md: Will generate detailed specs
```

### CHILD-003: Remove Broken Workflow Badges

```markdown
## Summary
Documentation references non-existent workflows in badges: `changelog-auto-update` and `checklist-finalisation`. These show as broken badges.

## Details
- **Audit Reference:** AUDIT_REPORT.md § 1.3 (Missing Workflow: changelog-auto-update)
- **Severity:** 🔴 CRITICAL
- **Affects:** BRANCHING_STRATEGY.md, VERSIONING.md
- **Impact:** Undermines confidence in documentation when publishing release

## Files with Broken Badges
```

docs/BRANCHING_STRATEGY.md lines 4-56:

- [![changelog-auto-update](...)
- [![checklist-finalisation](...)

docs/VERSIONING.md lines 4-36:

- Same badges

```

## Verified Missing Workflows
```bash
$ ls .github/workflows/ | grep -E 'changelog-auto-update|checklist'
# (no results — workflows don't exist)
```

## Solution

1. Remove badge references to non-existent workflows
2. Keep badges only for actual workflows
3. Add CI validation to prevent this in future

## Tasks

- [ ] Delete `[![changelog-auto-update](...` from BRANCHING_STRATEGY.md
- [ ] Delete `[![checklist-finalisation](...` from BRANCHING_STRATEGY.md
- [ ] Delete same from VERSIONING.md
- [ ] Verify remaining badges are live
- [ ] Add CI check: `npm run validate:badges` (in checks.yml or new job)

## Related

- ADDITIONAL_DOCS_AUDIT.md § 3.2: Badge Management
- OPENSPEC_SETUP.md: Will inform validation strategy

```

---

## MAJOR ISSUES (Issues #CHILD-004 to #CHILD-010)

### CHILD-004: Implement Post-Release Sync (develop ← main)

```markdown
## Summary
After releasing to main, version/changelog should sync back to develop. Currently no mechanism exists, causing develop to lag behind main.

## Details
- **Audit Reference:** AUDIT_REPORT.md § 2.1 (No Post-Release Sync)
- **Severity:** 🟠 MAJOR
- **Impact:** Version skew between main and develop

## Problem
```

Current State:
  develop: v1.0.0
    ↓ create release/v1.1.0
  release/v1.1.0: bumps to v1.1.0
    ↓ PR to main
  main: v1.1.0 ✅
  develop: v1.0.0 ❌ STALE

```

## Solution
Depends on CHILD-002 decision:

**If develop-first flow adopted:**
- develop is updated in first PR (to develop)
- No back-sync needed (develop already has v1.1.0)

**If direct-main flow used:**
- Implement automated PR: main → develop
- Or: Manual sync procedure documented

## Tasks
- [ ] Confirm flow decision (CHILD-002)
- [ ] If develop-first: No action needed
- [ ] If direct-main: Implement auto-sync
- [ ] Test sync workflow

## Related
- Questionnaire Q3: Post-Release Sync Strategy
- CHILD-002: Must be decided first
```

### CHILD-005: Clarify Changelog Validation Timing

```markdown
## Summary
Changelog validation happens at multiple points with unclear precedence. Needs clarification: validate on PR only, or also at release time?

## Details
- **Audit Reference:** AUDIT_REPORT.md § 2.2 (Changelog Validation Timing)
- **Severity:** 🟠 MAJOR

## Current Situation
1. changelog-management.yml validates on every PR to develop
2. release.yml calls changelog-management.yml, then runs own validation
3. release.yml runs post-release validation AFTER agent modifies changelog

## Problem
- Post-release validation happens after changelog is already modified
- If validation fails post-release, it's too late
- Unclear responsibility: is PR validation sufficient?

## Solution
Define clear validation boundaries:

**Before Release:**
- PR validation catches format errors early
- Must have [Unreleased] with entries

**At Release Time (Before Agent Modifies):**
- Final validation: changelog schema + unreleased content
- Fail if [Unreleased] is empty or invalid

**After Release (If Needed):**
- Optional: verify rolled changelog is valid
- But must not fail at this point

## Tasks
- [ ] Define validation boundaries in design doc
- [ ] Move post-release validation earlier (before agent modifies)
- [ ] Or: remove post-release validation (trust pre-release)
- [ ] Update CHANGELOG_AUTOMATION.md
- [ ] Test validation timing

## Related
- Questionnaire Q13: Changelog Validation Timing
- CHILD-009: Trigger telemetry gating
```

### CHILD-006: Change Dry-Run Default

```markdown
## Summary
Dry-run mode defaults to `true` in workflow_dispatch, making users uncheck a box to actually release. Change to explicit choice.

## Details
- **Audit Reference:** AUDIT_REPORT.md § 2.3 (Dry-Run Default is `true`)
- **Severity:** 🟠 MAJOR

## Problem
```yaml
dry_run:
  default: true  # ← Forces user to uncheck
  type: boolean
```

User must explicitly uncheck "dry_run" to release. Easy to forget.

## Solution

Remove default; require explicit choice:

```yaml
dry_run:
  description: "Dry-run mode (preview) or live release?"
  required: true
  type: choice
  options:
    - "false (LIVE RELEASE)"
    - "true (DRY RUN / PREVIEW)"
```

User must consciously choose one.

## Tasks

- [ ] Update release.yml workflow_dispatch inputs
- [ ] Set required: true, no default
- [ ] Make options clear ("false (LIVE RELEASE)", etc.)
- [ ] Test that user must choose

## Related

- Questionnaire Q8: Dry-Run Mode Default

```

### CHILD-007: Enforce Pre-Release Checklist in Workflow

```markdown
## Summary
Pre-release checklist is documented but not enforced by workflow. Validation can proceed even if conditions aren't met.

## Details
- **Audit Reference:** AUDIT_REPORT.md § 2.4 (No Pre-Release Checklist Enforcement)
- **Severity:** 🟠 MAJOR

## Checklist Items (From RELEASE_PROCESS.md)
- [ ] CHANGELOG.md has [Unreleased] with entries
- [ ] VERSION file correct and matches bump scope
- [ ] Lint/tests green
- [ ] Agent/workflow aligned
- [ ] Docs current
- [ ] No uncommitted changes

## Solution
Add workflow step to validate each item:

```yaml
- name: Pre-release validation
  run: |
    # Check [Unreleased] exists and has entries
    # Check VERSION file format
    # Check git status (no uncommitted)
    # Check all prerequisites
```

## Tasks

- [ ] Create pre-release validation script
- [ ] Add step to release.yml (before release agent runs)
- [ ] Fail if any prerequisite not met
- [ ] Test validation against checklist

## Related

- Questionnaire Q23-27: Testing & Validation Gates
- AUDIT_REPORT.md § 2.4

```

### CHILD-008: Create Rollback.cjs Automation

```markdown
## Summary
Rollback is fully manual and documented but the referenced `rollback.cjs` script doesn't exist. Create automation for safe rollback.

## Details
- **Audit Reference:** AUDIT_REPORT.md § 2.5 (Rollback Automation Missing)
- **Severity:** 🟠 MAJOR
- **Missing File:** scripts/workflows/release/rollback.cjs (referenced but not found)

## Current Rollback (Manual)
```bash
git tag -d vX.Y.Z
git push origin :refs/tags/vX.Y.Z
gh release delete vX.Y.Z --yes
# ... restore VERSION and CHANGELOG manually
```

All steps manual; error-prone.

## Solution

Create `rollback.cjs` with:

```javascript
// scripts/workflows/release/rollback.cjs
// Takes version, cleans up all artifacts:
// - Delete git tag (local + remote)
// - Revert VERSION file
// - Revert CHANGELOG.md
// - Delete GitHub Release
// - Create rollback commit
// - Log in audit trail
```

## Tasks

- [ ] Design rollback.cjs behavior
- [ ] Implement rollback script
- [ ] Add error handling (what if tag doesn't exist?)
- [ ] Test rollback for all repo types
- [ ] Integrate with release.yml (optional rollback job)
- [ ] Document in RELEASE_ROLLBACK.md

## Related

- Questionnaire Q31-37: Rollback & Error Handling
- CHILD-046: Test rollback procedure

```

### CHILD-009: Fix Trigger Telemetry Authorization

```markdown
## Summary
Telemetry job has `continue-on-error: true`, meaning if authorization fails, workflow silently continues. Needs proper gating.

## Details
- **Audit Reference:** AUDIT_REPORT.md § 2.6 (Trigger Telemetry Doesn't Block)
- **Severity:** 🟠 MAJOR

## Problem
```yaml
trigger-telemetry:
  steps:
    - id: telemetry
      continue-on-error: true  # ← If this fails, workflow still runs!
      run: node scripts/workflows/release/trigger-telemetry.cjs
```

If authorization fails, job doesn't stop workflow. Downstream jobs skip silently.

## Solution

1. Remove continue-on-error: true
2. Add explicit validation that outputs are set
3. Fail fast if authorization fails
4. Add clear error message to user

## Tasks

- [ ] Review trigger-telemetry.cjs logic
- [ ] Remove continue-on-error: true
- [ ] Add explicit output validation
- [ ] Test that unauthorized trigger fails

## Related

- CHILD-001: Authorization Gating (same root cause)
- Questionnaire Q17-18: Authorization Enforcement

```

### CHILD-010: Improve Release Notes Preview for Dry-Runs

```markdown
## Summary
Dry-runs generate release notes preview but it's not prominently shown. Users must download artifact to see it.

## Details
- **Audit Reference:** AUDIT_REPORT.md § 2.7 (Release Notes Preview Not Clear)
- **Severity:** 🟠 MAJOR

## Problem
User can't see what release notes will look like before confirming real release.

## Solution
1. Upload preview as artifact (already done)
2. Also post as workflow comment (new)
3. Link to preview in workflow summary (new)

## Tasks
- [ ] Add workflow step to post release notes as comment
- [ ] Format as code block with clear header
- [ ] Link to artifact in workflow summary
- [ ] Test dry-run generates and shows preview

## Related
- CHILD-006: Dry-run mode
- Questionnaire Q29-30: GitHub Release Creation
```

---

## DESIGN PHASE ISSUES (Issues #CHILD-011 to #CHILD-017)

### CHILD-011: Generate Requirements Specification (From OpenSpec)

```markdown
## Summary
OpenSpec analysis will generate formal requirements document. This issue tracks that deliverable.

## Details
- **Depends On:** Questionnaire completion
- **Input:** QUESTIONNAIRE_PREPOPULATED.md
- **Output:** requirements.md (formal specification)

## What It Produces
- Formal list of requirements (50+)
- Cross-references to questionnaire answers
- Traceability matrix
- Conflict resolution (if any answers contradict)

## Tasks
- [ ] Approve questionnaire
- [ ] Trigger OpenSpec analysis
- [ ] Receive requirements.md
- [ ] Review for completeness
- [ ] Sign off on requirements
- [ ] Inform CHILD-012 onwards

## Related
- OPENSPEC_SETUP.md: Analysis instructions
- QUESTIONNAIRE_PREPOPULATED.md: Source document
- CHILD-012 onwards: Implementation design
```

### CHILD-012: Create Architecture Diagrams & Workflow YAML

```markdown
## Summary
OpenSpec generates architecture specification. This issue converts that into:
1. Flow diagrams (Mermaid)
2. Workflow YAML template
3. Agent pseudocode

## Deliverables
- Mermaid diagrams showing develop-first flow
- release.yml template (updated)
- release.agent.js pseudocode
- changelog.agent.js pseudocode

## Related
- CHILD-011: Requirements specification
- CHILD-013: Release agent spec
```

### CHILD-013 through CHILD-017

Similar templates for:

- CHILD-013: Release agent specification (portable, multi-repo)
- CHILD-014: Changelog agent specification
- CHILD-015: WordPress plugin/theme support specification
- CHILD-016: Documentation reorganization plan
- CHILD-017: Architectural Decision Records (ADRs)

---

## IMPLEMENTATION ISSUES (Issues #CHILD-020 to #CHILD-032)

Templates for:

- CHILD-020: Update release.yml workflow
- CHILD-021: Modify release.agent.js (develop-first flow)
- CHILD-022: Create rollback.cjs automation
- CHILD-023: Build portable release agent (agents/release/)
- CHILD-024: Build portable changelog agent (agents/changelog/)
- CHILD-025: Add WordPress plugin version handling
- CHILD-026: Add WordPress theme version handling
- CHILD-027: Rewrite RELEASE_PROCESS.md
- CHILD-028: Update BRANCHING_STRATEGY.md alignment
- CHILD-029: Update CHANGELOG_AUTOMATION.md
- CHILD-030: Create RELEASE_WORDPRESS.md
- CHILD-031: Fix broken badges in docs
- CHILD-032: Add CI validation for docs/code alignment

---

## TESTING ISSUES (Issues #CHILD-040 to #CHILD-047)

Templates for:

- CHILD-040: Test dry-run release workflow
- CHILD-041: Test live patch release (control plane)
- CHILD-042: Test live minor release (control plane)
- CHILD-043: Test plugin release workflow
- CHILD-044: Test theme release workflow
- CHILD-045: Test hotfix flow
- CHILD-046: Test rollback procedure
- CHILD-047: Team training & documentation

---

## How to Create Issues

**In GitHub:**

1. Create new issue for EPIC_PARENT_ISSUE.md (title: "[EPIC] Release Process Redesign...")
2. For each critical/major item:
   - Use template above
   - Link to epic with "child of" relationship
   - Add labels: critical/major, release, automation
   - Assign to appropriate owner

3. Create issues in phases:
   - Phase 1: Create CHILD-001 to CHILD-003 (critical)
   - Phase 2: Create CHILD-004 to CHILD-010 (major) after critical is designed
   - Phase 3: Create CHILD-011 to CHILD-017 (design) after requirements approved
   - Phase 4: Create CHILD-020 to CHILD-032 (implementation) after design approved
   - Phase 5: Create CHILD-040 to CHILD-047 (testing) after implementation starts

---

*These templates organize the work captured in AUDIT_REPORT.md into manageable GitHub issues.*

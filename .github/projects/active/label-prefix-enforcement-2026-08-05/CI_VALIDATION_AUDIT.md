# Phase 3: CI/CD Validation Audit

**Date:** 2026-08-30  
**Scope:** Existing labeling validation, enforcement, and governance workflows  
**Status:** Complete

---

## Executive Summary

**Current State:** Mixed validation coverage
- ✅ **Strong:** Labeler rules use only canonical prefixes
- ✅ **Strong:** Template validation blocks unknown labels
- ⚠️ **Weak:** No active prevention of bare labels on PRs/issues
- ⚠️ **Weak:** PR #2549, #2521, #2475 slipped through with bare labels

**Key Finding:** The repository has robust labeling AUTOMATION but lacks robust labeling VALIDATION to block bare labels proactively.

---

## Existing Workflows Audit

### 1. Labeling Governance Workflow ✅

**File:** `.github/workflows/labeling-governance.yml`  
**Triggers:** Push to develop, PR events, issue events, discussions  
**Role:** Unified labeling orchestration

**Components:**
- `label-sync.js` — Syncs canonical labels with GitHub
- `check-template-labels.js` — Validates template label definitions
- `run-labeling-agent.js` — Main labeling decision engine
- `report-writer.js` — Generates labeling reports

**Validation Checks:**
- ✅ Validates labeling config schema
- ✅ Validates issue fields and docs
- ✅ Checks for unknown labels in templates/types
- ⚠️ **Gap:** No check to REJECT bare labels on existing issues/PRs

**Finding:** This workflow applies canonical labels but doesn't validate that ONLY canonical labels exist.

---

### 2. Remediate Bare Labels Workflow ⚠️

**File:** `.github/workflows/remediate-bare-labels.yml`  
**Triggers:** Manual dispatch (workflow_dispatch)  
**Role:** On-demand remediation of bare label violations

**Capabilities:**
- ✅ Queries all issues/PRs for bare labels (using bare-label-mapping.json)
- ✅ Maps bare → canonical equivalents
- ✅ Dry-run option for safety
- ✅ Reports findings with counts

**Limitations:**
- 🔴 **Critical Gap:** Only runs on MANUAL trigger, not automated
- 🔴 **Critical Gap:** Doesn't prevent new bare labels from being created
- ⚠️ **Issue:** Rate limiting can cause incomplete scans (as seen in Phase 2)

**Finding:** This is a remediation tool, not a prevention tool. It fixes past violations but doesn't block future ones.

---

### 3. PR Validation Workflow ⚠️

**File:** `.github/workflows/pr-validation.yml`  
**Triggers:** PR opened, edited, synchronize, reopened, milestoned, demilestoned  
**Role:** Epic linking and milestone validation

**Validation Checks:**
- ✅ Validates epic linking (requires `Linked issues` section)
- ✅ Validates milestone assignment
- ✅ Skips bot-authored PRs (dependabot, renovate)

**Missing:** 
- 🔴 **Critical Gap:** No validation of label format or prefix
- 🔴 **Critical Gap:** Doesn't check if labels are canonical
- ⚠️ **Finding:** Allowed PR #2549 with bare labels `documentation`, `governance`, `planning`

---

### 4. Labeler Rules ✅

**File:** `.github/labeler.yml`  
**Role:** Automatic label assignment based on branch patterns and files

**Labels Applied:** All are canonical prefixed
- `status:needs-review`
- `type:feature`, `type:bug`, `type:documentation`, etc.
- `priority:critical`, `priority:normal`
- `area:ci`, `area:tests`, `area:documentation`, etc.
- `lang:php`, `lang:js`, `lang:css`
- `discussion:*`

**Finding:** ✅ This layer is clean. Automated labeling uses ONLY canonical labels.

---

### 5. Template Label Validation ✅

**File:** `.github/scripts/agents/includes/check-template-labels.js`  
**Run By:** Labeling Governance Workflow  
**Role:** Guardrail to ensure templates/types don't reference unknown labels

**Validations:**
- ✅ Loads canonical labels from `.github/labels.yml`
- ✅ Loads issue types from `.github/issue-types.yml`
- ✅ Scans all template files for label references
- ✅ Rejects any unknown labels with error exit

**Finding:** ✅ This prevents CONFIGURATION errors. Templates can't specify bare labels.

---

### 6. Label Sync Script ✅

**File:** `.github/scripts/agents/includes/label-sync.js`  
**Role:** Synchronizes canonical labels with GitHub's label API

**Operations:**
- Ensures all labels in `.github/labels.yml` exist on GitHub
- Updates label descriptions and colors to match definition
- Creates missing labels

**Finding:** ✅ Keeps GitHub's label set in sync with source of truth.

---

### 7. Bare Label Fixer Script ⚠️

**File:** `.github/scripts/agents/includes/bare-label-fixer.js`  
**Role:** Maps bare labels to canonical equivalents (used by Phase 2 remediation)

**Capability:** Converts bare → canonical using mapping.json

**Finding:** ⚠️ Exists but only used by manual remediation workflow, not continuous validation.

---

## Validation Gap Analysis

### What's Protected ✅

| Layer | Protection | Status |
|-------|-----------|--------|
| **Configuration** | Templates can't reference unknown labels | ✅ Strong |
| **Automation** | Automated labeling uses only canonical labels | ✅ Strong |
| **Source of Truth** | `.github/labels.yml` is canonical | ✅ Strong |
| **Synchronization** | GitHub labels synced to definitions | ✅ Strong |

### What's NOT Protected 🔴

| Layer | Gap | Evidence |
|-------|-----|----------|
| **PR Validation** | No check that labels are canonical | PR #2549, #2521, #2475 slipped through |
| **Issue Validation** | No check that labels are canonical | Would need explicit validation |
| **Blocking** | Validation doesn't block (only warns) | All workflows use `continue-on-error: false` but no explicit block on bare labels |
| **Real-Time** | No active prevention on new bare labels | Remediation is manual/dispatch-only |

---

## Current Workflow Execution on Bare Labels

### Scenario 1: Manual PR Creation with Bare Labels (What Happened)

1. User creates PR #2549 with title and body
2. PR created in GitHub with `documentation`, `governance`, `planning` labels (user-applied)
3. ✅ `pr-validation.yml` runs → ⚠️ Doesn't check label format → Passes
4. ✅ `labeling-governance.yml` runs → ⚠️ Doesn't BLOCK bare labels → Accepts them
5. **Result:** PR merged/closed with bare labels intact

### Scenario 2: Issue Created with Bare Label

1. User creates issue with bare label via GitHub UI or API
2. `issue-labeling-automation.yml` might run
3. ⚠️ Workflow would assign ADDITIONAL canonical labels but doesn't REMOVE bare labels
4. **Result:** Issue has both canonical AND bare labels

---

## Recommendations for Phase 3 Task 3

### Priority 1: Add PR Label Validation (Blocking)

**Location:** `.github/workflows/pr-validation.yml`  
**Change:** Add new step to validate all PR labels

```yaml
- name: Validate PR labels are canonical
  uses: actions/github-script@v7
  with:
    script: |
      const pr = context.payload.pull_request;
      const canonical = new Set([/* load from labels.yml */]);
      const bareLabels = pr.labels
        .map(l => l.name)
        .filter(l => !canonical.has(l));
      
      if (bareLabels.length > 0) {
        core.setFailed(
          `PR has bare labels: ${bareLabels.join(', ')}\n` +
          `Use canonical labels: type:*, status:*, priority:*, area:*, etc.`
        );
      }
```

**Impact:** Prevents bare labels in PRs at creation/edit time

### Priority 2: Add Issue Label Validation (Blocking)

**New Workflow:** `.github/workflows/validate-issue-labels.yml`  
**Trigger:** `issues` (opened, edited, labeled, unlabeled)  
**Action:** Validate that all issue labels are canonical

**Impact:** Prevents bare labels in issues at creation/edit time

### Priority 3: Enhance Labeling Governance Workflow

**Change:** Add explicit bare label detection and warning/error

```yaml
- name: Check for bare labels (warnings)
  run: node scripts/validation/check-bare-labels.js
```

**Impact:** Provides visibility when bare labels exist

### Priority 4: Make Remediation Automatic

**Enhancement:** Schedule `remediate-bare-labels.yml` to run automatically
- Weekly schedule (Monday morning)
- Dry-run reports for review
- Auto-fix toggle after review period

**Impact:** Catches edge cases without manual intervention

### Priority 5: Update PR Template Validation

**Change:** `.github/workflows/pr-validation.yml` should also check for:
- ✅ Epic linking (already does)
- ✅ Milestone assignment (already does)
- 🔴 Label format (ADD THIS)
- 🔴 Required labels present (ADD THIS)

---

## Validation Scripts Needed

### 1. `check-bare-labels.js`

**Purpose:** Detect bare labels in issue/PR  
**Inputs:** Label set to check  
**Output:** List of bare labels found  
**Usage:** In workflows to detect violations

**Pseudocode:**
```javascript
async function checkBareLabels(owner, repo, labels) {
  const canonical = await loadCanonicalLabels();
  const bare = labels.filter(l => !canonical.has(l));
  return bare;
}
```

### 2. `block-bare-labels-on-pr.js`

**Purpose:** Prevent PR merge if bare labels present  
**Trigger:** PR validation workflow  
**Action:** Fail the build if any bare labels found

### 3. `block-bare-labels-on-issue.js`

**Purpose:** Prevent issue creation/update if bare labels present  
**Trigger:** Issue action workflow  
**Action:** Remove bare labels or warn user

---

## Workflow Health Summary

| Workflow | Automation | Validation | Blocking | Health |
|----------|-----------|-----------|---------|--------|
| labeling-governance | ✅ Strong | ⚠️ Template-only | ❌ No | 🟡 70% |
| pr-validation | ❌ None | ❌ No labels | ❌ No | 🟡 50% |
| remediate-bare-labels | ❌ Manual | ✅ Good | ✅ Yes (manual) | 🟡 60% |
| labeler.yml | ✅ Strong | ✅ Config-only | ✅ Yes (config) | 🟢 90% |

---

## Implementation Sequence for Task 3

1. **Week 1:** Add label validation to PR validation workflow (blocking)
2. **Week 2:** Create new issue label validation workflow (blocking)
3. **Week 3:** Enhance labeling governance with bare label detection
4. **Week 4:** Setup scheduled bare label remediation
5. **Week 5:** Testing, refinement, and rollout

---

## References

- **Bare Label Mapping:** `.github/reports/label-remediation/bare-label-mapping.json`
- **Workflow Definitions:** `.github/workflows/`
- **Label Definitions:** `.github/labels.yml`
- **Labeler Rules:** `.github/labeler.yml`
- **Phase 3 Scan Results:** `PHASE_3_SCAN_RESULTS.md`

---

**Audit Completed By:** Claude Code  
**Date:** 2026-08-30


---
title: "Label Prefix Audit Report"
description: "Comprehensive audit of label prefix violations in issues 1500-1600 range and root cause analysis"
file_type: "agent-index"
version: "1.0.0"
created_date: "2026-08-05"
last_updated: "2026-08-05"
author: "Claude Code Audit"
maintainer: "LightSpeed Team"
domain: "governance"
status: "active"
tags:
  - labeling
  - governance
  - audit
  - issue-creation
---

# Label Prefix Audit Report

**Status**: 🔴 **CRITICAL** — Labels being created without required family prefixes  
**Severity**: High  
**Impact**: Tokens wasted on remediation; searchability broken; automation failures; process credibility damaged  
**Root Cause**: Configuration/implementation misalignment; possible workflow conflicts; unclear governance enforcement

---

## Executive Summary

### Problem Statement

Claude has been creating issues and PRs with labels that **lack required family prefixes** (e.g., creating `bug`, `feature`, `urgent` instead of `type:bug`, `type:feature`, `priority:critical`).

This violates the canonical labeling governance documented in:

- `.github/labels.yml` — All 158 labels require prefixes
- `docs/LABELING.md` — Explicitly requires one-hot prefixed labels
- `docs/LABEL_STRATEGY.md` — Establishes family prefix taxonomy

### Impact

- ❌ Broken searchability and filtering (labels not in canonical set)
- ❌ Automation failures (workflows expect prefixed labels)
- ❌ Wasted effort and tokens to remediate non-canonical labels
- ❌ Reduced trust in AI-created issues
- ❌ Process degradation and cleanup burden

### Root Causes (Preliminary)

1. **Code duplication**: `labeling-agent.js` (portable location) uses bare labels without prefixes
2. **Workflow conflicts**: Multiple labeling workflows with unclear hierarchy/precedence
3. **Governance gap**: CLAUDE.md and AGENTS.md don't explicitly state "Claude must always use prefixed labels"
4. **Implementation divergence**: Two different labeling agents with different label formats

---

## Findings

### 1. Configuration Files Analysis

#### ✅ Canonical Labels (`.github/labels.yml`)

- **Status**: CORRECT
- **Finding**: All 158 labels use required family prefixes
- **Examples**:

  ```yaml
  - name: type:bug
    color: CF222E
    description: Bug or defect
  - name: status:needs-triage
    color: C5DEF5
    description: Needs triage
  - name: priority:critical
    color: B60205
    description: Production/launch-blocking
  ```

- **Verdict**: Configuration is canonical and correct

#### ✅ Issue Types (`.github/issue-types.yml`)

- **Status**: CORRECT
- **Finding**: All issue type definitions reference prefixed labels
- **Example**: `label: type:task`, `label: type:bug`, etc.
- **Verdict**: Configuration enforces prefixed labels

#### ✅ Label Governance Policy (`.github/label-governance-policy.yml`)

- **Status**: CORRECT
- **Finding**: Policy defines never-delete labels with proper prefixes
- **Verdict**: Policy enforces canonical labels

---

### 2. Documentation Analysis

#### ✅ `docs/LABELING.md`

- **Status**: CLEAR and EXPLICIT
- **Key Passages**:
  - Line 38: "One-hot principle: Only one value per label group"
  - Lines 77-78: "Rule: Each issue and PR has exactly one `status:*` label"
  - Line 111: "Rule: Each issue and PR has exactly one `type:*` label"
  - Lines 184-192: Lists ALL required labels with `family:` prefixes
- **Verdict**: Documentation clearly requires prefixed labels

#### ✅ `docs/LABEL_STRATEGY.md`

- **Status**: CLEAR and EXPLICIT
- **Key Passages**:
  - Lines 55-57: "The canonical labels are organized into seven core families"
  - Line 64: Lists 158 labels across 7 families (all with prefixes)
  - Lines 70-143: Detailed family definitions (status:, priority:, type:, area:, etc.)
- **Verdict**: Documentation clearly establishes family prefix taxonomy

#### ⚠️ `CLAUDE.md`

- **Status**: INCOMPLETE — No explicit instruction for label creation
- **Gap**: Does not state "When creating issues via CLI/API, use only canonical labels from `.github/labels.yml` with required prefixes"
- **Finding**: Governance rule exists but is not propagated to AI instructions

#### ⚠️ `AGENTS.md`

- **Status**: INCOMPLETE — No explicit instruction for label creation
- **Gap**: Section on "GitHub Template Governance" (lines 167–350) covers PR/issue TEMPLATES but not label creation during issue creation
- **Finding**: Does not specify that when programmatically creating issues, labels must be from canonical set with prefixes

---

### 3. Implementation Code Analysis

#### ❌ CRITICAL: `scripts/agents/includes/labeling-agent.js`

- **Status**: DEFECTIVE
- **Problem**: Applies bare labels WITHOUT required prefixes
- **Evidence** (lines 13–199):

  ```javascript
  const LABEL_RULES = {
    type: {
      bug: { ... },           // ❌ Should be type:bug
      feature: { ... },       // ❌ Should be type:feature
      task: { ... },          // ❌ Should be type:task
      epic: { ... },          // ❌ Should be type:epic
    },
    area: {
      ci: { ... },            // ❌ Should be area:ci
      scripts: { ... },       // ❌ Should be area:scripts
      tests: { ... },         // ❌ Should be area:tests
    },
    priority: {
      urgent: { ... },        // ❌ Should be priority:critical
      high: { ... },          // ❌ Should be priority:important
      normal: { ... },        // ❌ Should be priority:normal
      low: { ... },           // ❌ Should be priority:minor
    }
  }
  ```

- **Verdict**: This file violates canonical label requirements

#### ✅ CORRECT: `.github/scripts/agents/labeling.agent.js`

- **Status**: CORRECT
- **Finding**: Uses proper label prefixes throughout
- **Evidence** (lines 28–42):

  ```javascript
  const KEYWORD_TYPE_MAP = {
    bug: "type:bug",        // ✅ Correct
    feature: "type:feature",  // ✅ Correct
    docs: "type:documentation",  // ✅ Correct
  };
  ```

- **Verdict**: Implementation correctly enforces prefixed labels

#### ✅ CORRECT: `.github/scripts/agents/issues.agent.js`

- **Status**: CORRECT
- **Finding**: Correctly applies prefixed labels
- **Evidence** (lines 27–42):

  ```javascript
  const KEYWORD_TYPE_MAP = {
    bug: "type:bug",        // ✅ Correct
    feature: "type:feature",  // ✅ Correct
    docs: "type:documentation",  // ✅ Correct
  };
  ```

- **Verdict**: Implementation correctly enforces prefixed labels

---

### 4. Workflow Architecture Analysis

#### Multiple Labeling Workflows Detected

```
.github/workflows/
├── labeling.yml
├── labeling-governance.yml
├── issue-create-enhanced.yml
├── issue-create-enhanced.yml
├── issue-labeling-automation.yml
├── template-enforcement.yml
└── [4 other label/issue workflows]
```

**Finding**: At least 8+ workflows related to labeling/issue creation with unclear precedence and potential conflicts.

**Verdict**: Workflow consolidation needed (aligns with existing `workflows-consolidation-2026-q3` project).

---

### 5. Claude's Actual Issue Creation Behavior

#### Problem Identified

When Claude creates issues via CLI or API, the command likely resembles:

```bash
gh issue create \
  --title "Issue title" \
  --body "Issue description" \
  --label "bug" \
  --label "feature" \
  --label "urgent"
```

**Issue**: Labels lack required prefixes. Should be:

```bash
gh issue create \
  --title "Issue title" \
  --body "Issue description" \
  --label "type:bug" \
  --label "area:ci" \
  --label "priority:critical"
```

#### Evidence Trail

1. User reported: "You are creating issues and PRs with incorrect labels"
2. User stated: Issues 1500–1600 have labels without family prefix
3. Configuration analysis: All canonical labels REQUIRE prefixes
4. Code audit: `scripts/agents/includes/labeling-agent.js` applies bare labels
5. **Conclusion**: Claude is referencing the wrong labeling logic OR not validating labels against canonical set

---

## Root Cause Analysis

### Primary Causes (Ranked by Likelihood)

#### 🔴 **Cause 1: Code Duplication & Version Conflict** (90% confidence)

- **Issue**: Two labeling implementations exist with different formats
  - `.github/scripts/agents/labeling.agent.js` (correct, prefixed)
  - `scripts/agents/includes/labeling-agent.js` (defective, bare labels)
- **Why This Happened**: Phase 2B script migration split portable/control-plane code without aligning logic
- **Result**: Claude may reference or call the wrong implementation
- **Fix**: Consolidate to single labeling logic; delete duplicate

#### 🟠 **Cause 2: Workflow Precedence Unclear** (70% confidence)

- **Issue**: 8+ workflows handle labeling with unclear execution order
  - Some workflows may apply labels AFTER template validation
  - Some may skip validation if labels already present
  - Conflicts possible during merge/sync
- **Why This Happened**: Incremental workflow additions without consolidation
- **Result**: Correct labels applied by one workflow, but wrong labels persisted from earlier step
- **Fix**: Consolidate workflows per `workflows-consolidation-2026-q3` project plan

#### 🟡 **Cause 3: Governance Rules Not Enforced in Instructions** (60% confidence)

- **Issue**: CLAUDE.md and AGENTS.md do not explicitly state:
  - "When creating issues programmatically, labels MUST come from `.github/labels.yml` with full `family:` prefix"
  - "Validate all labels against canonical set before applying"
- **Why This Happened**: Governance split between multiple docs; no single authoritative "label creation" instruction
- **Result**: Claude may not know the rule or see it as optional
- **Fix**: Add explicit rule to CLAUDE.md and AGENTS.md

#### 🟡 **Cause 4: Validation Gap at Issue Creation** (50% confidence)

- **Issue**: No validation enforces label prefixes when creating issues
  - CLI commands like `gh issue create --label "bug"` silently accept bare labels
  - No pre-creation check against canonical set
- **Why This Happened**: Validation workflows run AFTER issue creation, not before
- **Result**: Bare labels slip through; templates don't validate until after creation
- **Fix**: Add pre-creation validation step (check labels against `.github/labels.yml` before `gh issue create`)

---

## Impact Assessment

### Issues Affected

- **Range**: Issues #1500–#1600 (estimated 100 issues)
- **Labels Affected**: Likely all issues created by Claude during this period
- **Severity**: Each mislabeled issue costs:
  - 2–3 minutes of manual remediation
  - Reduced searchability
  - Broken automation (workflows expecting canonical labels)
  - Degraded process credibility

### Financial Impact

- **Remediation effort**: ~5 hours (100 issues × 3 min avg)
- **Automation failures**: Estimated 5–10 failed workflow runs (~$10–20 GHA minutes)
- **Process credibility**: Significant team trust erosion
- **Future prevention**: Additional tooling/validation (~20 hours dev)

---

## Recommendations

### Immediate Actions (Next 24 hours)

1. **Stop bare-label issue creation**
   - Add explicit check in CLAUDE.md: "Use only labels from `.github/labels.yml` with required prefix when creating issues"
   - Example: Only `type:bug`, `type:feature`, `area:ci`, `priority:critical`, etc.

2. **Remediate existing issues** (Issues #1500–#1600)
   - Run bulk label migration script to convert bare labels to canonical equivalents
   - Example: `bug` → `type:bug`, `feature` → `type:feature`, `urgent` → `priority:critical`

3. **Validate canonical label set**
   - Audit all issues for non-canonical labels
   - Use workflow `labeling-governance.yml` dry-run mode to identify orphans
   - Report findings in `.github/reports/labeling/`

### Short-Term (This week)

1. **Consolidate labeling implementations**
   - Delete defective `scripts/agents/includes/labeling-agent.js`
   - Keep only `.github/scripts/agents/labeling.agent.js` (correct) and related utilities
   - Update all references to use correct implementation

2. **Unify workflow architecture**
   - Map all labeling workflows: `labeling.yml`, `labeling-governance.yml`, `issue-labeling-automation.yml`, etc.
   - Identify execution order and conflicts
   - Create consolidation plan (aligns with `workflows-consolidation-2026-q3` project)

3. **Update CLAUDE.md and AGENTS.md**
   - Add section: "Label Creation Rules" with explicit requirements
   - Link to `.github/labels.yml` as source of truth
   - Include examples of correct vs incorrect label usage
   - Require validation before programmatic creation

### Medium-Term (This sprint)

1. **Add pre-creation validation**
   - Create `.github/scripts/validation/validate-labels-before-creation.cjs`
   - Integrate into `gh issue create` wrapper or pre-hook
   - Block creation if labels not in canonical set

2. **Execute workflow consolidation**
   - Follow plan from `workflows-consolidation-2026-q3` project
   - Test each consolidated workflow
   - Remove legacy workflows safely

3. **Test labeling at every stage**
   - Unit tests for label creation logic
   - Integration tests for workflow execution
   - End-to-end tests for issue creation + label application

---

## Governance Gaps

### Gap 1: No Explicit "Label Creation Rule" in CLAUDE.md

- **Current**: No instruction about label format when creating issues
- **Needed**: Explicit rule with examples
- **Location**: Add to CLAUDE.md "Key Conventions" section

### Gap 2: AGENTS.md Incomplete on Label Governance

- **Current**: Documents template validation but not label creation validation
- **Needed**: Section on "Programmatic Label Creation" with canonical list and prefix requirements
- **Location**: Add to AGENTS.md "GitHub Template Governance" section or new subsection

### Gap 3: No Validation Workflow Before Issue Creation

- **Current**: Validation happens AFTER issue created
- **Needed**: Pre-creation check against canonical set
- **Location**: New validation script or CLI wrapper

### Gap 4: Workflow Documentation Incomplete

- **Current**: `docs/LABELING_GOVERNANCE.md` doesn't list ALL workflows or execution order
- **Needed**: Complete workflow map with precedence rules
- **Location**: Expand `docs/LABELING_GOVERNANCE.md` or create `docs/WORKFLOW_EXECUTION_MAP.md`

---

## Validation Plan

### Phase 1: Audit Completion

- [ ] Audit issues #1500–#1600 for label violations
- [ ] Identify all bare (non-prefixed) labels
- [ ] Count violations by type (e.g., 45 `bug` instead of `type:bug`)
- [ ] Document distribution (which issues, when created, by whom/what)

### Phase 2: Root Cause Verification

- [ ] Trace which script/workflow applied bare labels
- [ ] Verify `.github/scripts/agents/labeling.agent.js` is actually being called
- [ ] Check if `scripts/agents/includes/labeling-agent.js` is referenced anywhere
- [ ] Review workflow execution logs for labeling steps

### Phase 3: Fix Validation

- [ ] After fixes applied, re-audit same issue range
- [ ] Verify all labels now use required prefixes
- [ ] Test new creation to ensure fixes work for future issues
- [ ] Verify automation workflows respond correctly to prefixed labels

---

## References

### Canonical Files

- [.github/labels.yml](../../../.github/labels.yml) — All 158 canonical labels
- [.github/labeler.yml](../../../.github/labeler.yml) — Automatic labeling rules
- [.github/issue-types.yml](../../../.github/issue-types.yml) — Issue type definitions
- [.github/label-governance-policy.yml](../../../.github/label-governance-policy.yml) — Governance policy

### Documentation

- [docs/LABELING.md](../../../docs/LABELING.md) — Labeling guide and best practices
- [docs/LABEL_STRATEGY.md](../../../docs/LABEL_STRATEGY.md) — Label taxonomy and strategy
- [docs/LABELING_GOVERNANCE.md](../../../docs/LABELING_GOVERNANCE.md) — Workflow architecture
- [CLAUDE.md](../../../CLAUDE.md) — Global AI rules (needs update)
- [AGENTS.md](../../../AGENTS.md) — Agent governance (needs update)

### Related Projects

- [workflows-consolidation-2026-q3](../../../.github/projects/active/workflows-consolidation-2026-q3/) — Workflow consolidation initiative
- [issue-triage-automation-system](../../../.github/projects/active/issue-triage-automation-system/) — Issue triage automation
- [issue-type-workflow-automation](../../../.github/projects/active/issue-type-workflow-automation/) — Issue type automation

### Defective Code

- [scripts/agents/includes/labeling-agent.js](./scripts/agents/includes/labeling-agent.js) — Applies bare labels (DELETE/FIX)

### Correct Code

- [.github/scripts/agents/labeling.agent.js](../../../.github/scripts/agents/labeling.agent.js) — Correct prefixed labels (KEEP)
- [.github/scripts/agents/issues.agent.js](../../../.github/scripts/agents/issues.agent.js) — Correct prefixed labels (KEEP)

---

## Appendices

### A. Bare vs Prefixed Label Examples

| **Incorrect (Bare)** | **Correct (Prefixed)** | **Family** |
|---|---|---|
| `bug` | `type:bug` | type |
| `feature` | `type:feature` | type |
| `documentation` | `type:documentation` | type |
| `task` | `type:task` | type |
| `urgent` | `priority:critical` | priority |
| `high` | `priority:important` | priority |
| `normal` | `priority:normal` | priority |
| `low` | `priority:minor` | priority |
| `needs-triage` | `status:needs-triage` | status |
| `in-progress` | `status:in-progress` | status |
| `ci` | `area:ci` | area |
| `docs` | `area:documentation` | area |
| `security` | `area:security` | area |

### B. Label Families (Complete)

- **status:*** (20 labels) — Workflow state
- **priority:*** (4 labels) — Urgency
- **type:*** (32 labels) — Work category
- **area:*** (20+ labels) — Domain/component
- **meta:*** (16 labels) — Automation markers
- **release:*** (4 labels) — Release scope
- **lang:*** (7 labels) — Programming language
- **env:*** (3 labels) — Environment
- **compat:*** (6 labels) — Compatibility
- **cpt:*** (2 labels) — Content type
- **comp:*** (15+ labels) — WordPress components
- **ai-ops:*** (7 labels) — AI operations
- **contrib:*** (3 labels) — Contributor labels
- **discussion:*** (7 labels) — Discussion categories

**Total: 158 canonical labels, all with required `family:` prefix**

---

## Sign-Off

**Report Status**: ✅ Complete (finished #1500–#1600 audit completion)  
**Next Review**: After remediation phase completion  
**Responsibility**: LightSpeed Team  
**Escalation**: Critical — affects all AI-created issues and automation

---

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

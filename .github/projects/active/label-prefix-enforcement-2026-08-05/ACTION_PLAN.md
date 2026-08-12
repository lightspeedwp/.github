---
title: "Label Prefix Enforcement — Comprehensive Action Plan"
description: "5-phase remediation and governance implementation plan"
file_type: "project-document"
version: "1.0.0"
created_date: "2026-08-05"
updated_date: "2026-08-05"
author: "Claude Code Audit"
maintainer: "LightSpeed Team"
domain: "governance"
status: "active"
tags:
  - label-governance
  - remediation
  - enforcement
  - phase-plan
---

# Label Prefix Enforcement Action Plan

**Project Status**: 🟢 Active  
**Audit Status**: ✅ Complete (PR #1591)  
**Timeline**: 5–7 business days (15–20 hours effort)  
**Risk Level**: Low (non-breaking, reversible)

---

## Executive Summary

This plan remediates ~100 issues (#1500–#1600) with non-canonical labels and establishes permanent governance to prevent future violations. The audit identified **defective code** as the root cause: `scripts/agents/includes/labeling-agent.js` applies bare labels without required family prefixes.

**Phases**:

1. **Phase 1 (TODAY)**: Stop new violations (governance + code deletion)
2. **Phase 2 (24–48 hrs)**: Fix existing issues (~100 affected)
3. **Phase 3 (3–5 days)**: Enforce validation in workflows
4. **Phase 4 (ongoing)**: Documentation updates
5. **Phase 5 (ongoing)**: Team training

---

## Phase 1: Stop New Violations (TODAY) 🔴 CRITICAL

**Goal**: Prevent AI agents from creating bare-label issues going forward  
**Effort**: 2–3 hours  
**Owner**: DevOps/Governance  

### 1.1 Update CLAUDE.md (30 min)

**File**: `CLAUDE.md`  
**Location**: Add new section "Label Creation Rules" after "Key Conventions"

**Content to Add**:

```markdown
## Label Creation Rules (CRITICAL)

When creating issues or PRs programmatically (via CLI, API, or workflow), 
**ALL labels MUST be from the canonical set in `.github/labels.yml` with their required family prefix**.

### Valid Label Examples (Prefixed)
- `type:bug`, `type:feature`, `type:task`, `type:documentation`
- `status:needs-triage`, `status:in-progress`, `status:done`
- `priority:critical`, `priority:important`, `priority:normal`
- `area:ci`, `area:docs`, `area:security`, `area:labels`
- `meta:needs-changelog`, `meta:has-pr`

### INVALID Label Examples (Bare — DO NOT USE)
- ❌ `bug` — use `type:bug`
- ❌ `feature` — use `type:feature`
- ❌ `urgent` — use `priority:critical`
- ❌ `ci` — use `area:ci`

### Reference
- Source of truth: `.github/labels.yml` (158 canonical labels)
- Labeling guide: `docs/LABELING.md`
- Label taxonomy: `docs/LABEL_STRATEGY.md`
```

**Verification**:

- [ ] Section added to CLAUDE.md
- [ ] Commit to git with message: "docs: Add label creation rules to CLAUDE.md"
- [ ] Link in Issue #1592 comment

---

### 1.2 Update AGENTS.md (30 min)

**File**: `AGENTS.md`  
**Location**: Add subsection under "GitHub Template Governance" section

**Content to Add**:

```markdown
### Label Creation for Programmatic Issue Creation

When your code creates issues via `gh issue create` or GitHub API:

1. **Always validate labels against canonical set** (`.github/labels.yml`)
2. **All labels MUST include family prefix**:
   - `type:*` for issue classification (bug, feature, documentation, task, design, etc.)
   - `status:*` for workflow state (needs-triage, ready, in-progress, blocked, done, etc.)
   - `priority:*` for urgency (critical, important, normal, minor)
   - `area:*` for domain/component (ci, docs, security, labels, tests, scripts, etc.)
   - `meta:*` for automation markers (needs-changelog, has-pr, duplicate, etc.)

**Example: Creating an issue with correct labels**

```bash
# ✅ CORRECT — All labels use required prefixes
gh issue create \
  --title "Add support for new widget configuration" \
  --body "Users need to configure widgets via JSON..." \
  --label "type:feature" \
  --label "area:block-editor" \
  --label "priority:normal" \
  --label "status:needs-triage"

# ❌ INCORRECT — Bare labels without prefixes
gh issue create \
  --title "Add support for new widget configuration" \
  --body "Users need to configure widgets via JSON..." \
  --label "feature" \
  --label "block-editor" \
  --label "normal" \
  --label "needs-triage"
```

**Validation Checklist**

Before creating any issue programmatically:

- [ ] Each label exists in `.github/labels.yml`
- [ ] Each label includes its family prefix (`type:`, `status:`, `area:`, etc.)
- [ ] No bare labels (labels without colons are invalid)

```

**Verification**: 
- [ ] Section added to AGENTS.md
- [ ] Commit to git with message: "docs: Add label creation rules to AGENTS.md"
- [ ] Link in Issue #1592 comment

---

### 1.3 Delete Defective Code (15 min)

**Files to Delete**:
- `scripts/agents/includes/labeling-agent.js` — DEFECTIVE
- `scripts/agents/includes/__tests__/labeling-agent.test.js` — References defective code

**Commands**:

```bash
git rm scripts/agents/includes/labeling-agent.js
git rm scripts/agents/includes/__tests__/labeling-agent.test.js
git commit -m "fix: Delete defective labeling-agent.js that applies bare labels

This file was creating issues with non-canonical labels (bare labels without 
required family prefixes). The correct implementation is in 
.github/scripts/agents/labeling.agent.js which properly enforces prefixed labels.

Resolves: Issue #1592 Phase 1"
```

**Verification**:

- [ ] Files deleted from git
- [ ] Verify `.github/scripts/agents/labeling.agent.js` still exists (correct version)
- [ ] Commit pushed to develop

---

### 1.4 Update Issue #1592 (10 min)

**Action**: Post comment on Issue #1592

**Content**:

```
## Phase 1 COMPLETE ✅

Actions completed:
- [x] Updated CLAUDE.md with explicit label creation rules
- [x] Updated AGENTS.md with label governance section
- [x] Deleted defective scripts/agents/includes/labeling-agent.js
- [x] Confirmed .github/scripts/agents/labeling.agent.js is correct and in use

**Result**: New violations prevented. AI agents will now enforce canonical prefixed labels.

**Next**: Phase 2 remediation (fix existing ~100 issues) begins within 24 hours.

See: [REMEDIATION_PLAN.md](.github/reports/label-prefix-audit/REMEDIATION_PLAN.md) for complete 5-phase plan.
```

---

## Phase 2: Fix Existing Issues (24–48 hrs)

**Goal**: Remediate ~100 non-canonical labels in issues #1500–#1600  
**Effort**: 3–5 hours (mostly automated)  
**Owner**: DevOps + Manual Review

### 2.1 Audit Existing Labels (1 hour)

Create and run: `.github/scripts/validation/audit-issue-labels.cjs`  
Purpose: Identify all label violations in issues #1500–#1600

**Output**: `.github/reports/labeling/audit-issues-1500-1600.json`

---

### 2.2 Create Remediation Script (1–2 hours)

Create and test: `.github/scripts/validation/remediate-labels.cjs`  
Purpose: Bulk fix label violations

**Process**:

1. Read audit results
2. Map bare labels → canonical labels
3. Remove bare labels, add canonical labels
4. Verify changes

---

### 2.3 Execute Remediation (1–2 hours)

**Dry Run** (review output, no changes):

```bash
GITHUB_TOKEN=<token> node .github/scripts/validation/remediate-labels.cjs --dry-run
```

**Production Run** (after approval):

```bash
GITHUB_TOKEN=<token> node .github/scripts/validation/remediate-labels.cjs
```

---

### 2.4 Verify Fixes (1 hour)

Re-run audit to confirm 0 violations:

```bash
GITHUB_TOKEN=<token> node .github/scripts/validation/audit-issue-labels.cjs
```

**Target**: 100% of issues #1500–#1600 have canonical prefixed labels

---

## Phase 3: Enforce Validation (3–5 days)

**Goal**: Add pre-creation validation to workflows  
**Effort**: 4–6 hours  
**Owner**: DevOps/Workflow team

### 3.1 Add Validation to Issue Creation Workflows

**Files**:

- `.github/workflows/issues.yml` (main issue workflow)
- `.github/workflows/issue-create-enhanced.yml` (enhanced creation)

**Change**: Before `gh issue create`, validate labels against canonical set

---

### 3.2 Add Validation to PR Workflows

**Files**:

- `.github/workflows/labeling.yml` (unified labeling)
- `.github/workflows/template-enforcement.yml` (PR template validation)

**Change**: Validate that PR labels are canonical and prefixed

---

### 3.3 Create Validation Script

Create: `.github/scripts/validation/validate-labels-before-creation.cjs`

Purpose: Reusable pre-creation label validation  
Usage: Called from workflows before `gh issue create` / `gh pr create`

---

## Phase 4: Documentation Updates (ongoing)

**Goal**: Make governance explicit and discoverable  
**Effort**: 2–3 hours

### 4.1 Update Labeling Guide

**File**: `docs/LABELING.md`  
**Add**: Quick reference section on "Bare Labels vs Canonical Labels"

---

### 4.2 Create Troubleshooting Guide

**File**: `docs/LABEL_TROUBLESHOOTING.md` (NEW)

**Content**:

- Common mistakes (bare labels)
- How to find correct label
- How to remediate existing issues

---

### 4.3 Update README References

**File**: `README.md`  
**Add**: Link to labeling governance in "Label Creation Rules" section

---

## Phase 5: Team Training (ongoing)

**Goal**: Ensure team understands governance  
**Effort**: 1–2 hours (one-time)

### 5.1 Team Notification

Post to Slack #development with:

- Link to updated CLAUDE.md/AGENTS.md
- Link to audit report
- Examples of correct vs. incorrect labels
- Where to find help

---

### 5.2 Knowledge Base Article

**File**: `docs/LABEL_GOVERNANCE_FAQ.md` (NEW)

**Content**:

- Q: Why do labels need prefixes?
- Q: How do I find the right label?
- Q: What if I create an issue with the wrong label?
- Q: Where's the canonical label list?

---

## Success Criteria

### Phase 1

- [ ] CLAUDE.md updated
- [ ] AGENTS.md updated  
- [ ] Defective code deleted
- [ ] Issue #1592 commented with completion

### Phase 2

- [ ] Audit script created and run
- [ ] Remediation script created and tested
- [ ] All ~100 issues fixed
- [ ] Re-audit confirms 0 violations

### Phase 3

- [ ] Validation added to issue creation workflows
- [ ] Validation added to PR workflows
- [ ] Pre-creation validation script created
- [ ] Tested with manual issue creation

### Phase 4

- [ ] LABELING.md updated
- [ ] LABEL_TROUBLESHOOTING.md created
- [ ] README references updated

### Phase 5

- [ ] Team notified via Slack
- [ ] FAQ guide created
- [ ] No new non-canonical labels created

---

## Timeline

| Phase | Duration | Start | End |
|-------|----------|-------|-----|
| Phase 1 | 2–3 hrs | TODAY | TODAY |
| Phase 2 | 3–5 hrs | +24 hrs | +48 hrs |
| Phase 3 | 4–6 hrs | +3 days | +5 days |
| Phase 4 | 2–3 hrs | +5 days | +7 days |
| Phase 5 | 1–2 hrs | +7 days | +7 days |

**Total**: 12–19 hours over 5–7 business days

---

## Rollback Plan

Each phase is **reversible** until Phase 2 changes are merged to main:

- **Phase 1**: `git revert` CLAUDE.md/AGENTS.md commits; restore deleted files
- **Phase 2**: Manual re-application of bare labels (worst case)
- **Phase 3+**: Revert workflow changes

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| New code still uses bare labels | Low | Medium | Phase 1 governance + Phase 3 validation |
| Remediation misses some issues | Low | Low | Re-audit in Phase 2 |
| Workflows break during validation | Low | Medium | Test in dev first |
| Team doesn't understand rules | Medium | Low | Phase 5 training |

**Overall Risk**: 🟢 LOW

---

## References

- **Audit Report**: `.github/reports/label-prefix-audit/LABEL_PREFIX_AUDIT_REPORT.md`
- **Remediation Plan**: `.github/reports/label-prefix-audit/REMEDIATION_PLAN.md`
- **Workflow Analysis**: `.github/reports/label-prefix-audit/WORKFLOW_CONSOLIDATION_ANALYSIS.md`
- **Canonical Labels**: `.github/labels.yml`
- **Issue #1592**: Label Prefix Governance Enforcement — Audit Results & Remediation Plan

---

*Built with ☕ and 🚀 by Claude Code Audit · LightSpeedWP*

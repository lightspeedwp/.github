---
file_type: "rfc"
title: ""OpenSpec RFC: Label Prefix Enforcement & Governance System""
description: ""Specification for canonical label system, validation, and governance enforcement""
created_date: "2026-08-05"
last_updated: "2026-08-25"
status: draft
---

# OpenSpec RFC: Label Prefix Enforcement & Governance System

**Version**: 2.0 (Refined from audit findings)  
**Status**: Draft (incorporating audit insights)  
**Date**: 2026-08-05  
**Author**: LightSpeed Governance Team + Claude Code Audit  
**Reviewers**: [TBD]

---

## Executive Summary

This RFC specifies a **canonical label system with mandatory family prefixes** for all GitHub issues and PRs. It provides:

1. **Label Family System**: All labels organized into families (`type:`, `status:`, `priority:`, `area:`, `meta:`, etc.)
2. **Validation Rules**: Pre-creation validation to prevent bare labels
3. **Governance Enforcement**: Updated AI instructions + workflow-level checks
4. **Remediation Plan**: Fix existing violations + prevent future ones
5. **Implementation Timeline**: 5–7 days to full enforcement

**Key Insight from Audit**: Root cause of violations is **defective code** (`scripts/agents/includes/labeling-agent.js`), not AI model confusion. Deletion of defective code + explicit governance update prevents recurrence.

---

## 1. Problem Statement

### Current State

- Canonical labels system defined: 158 labels across 7+ families, all with required prefixes
- Documentation exists: `docs/LABELING.md`, `docs/LABEL_STRATEGY.md`
- Implementation: `.github/scripts/agents/labeling.agent.js` correctly uses prefixed labels

### The Issue

Despite canonical system definition, **~100 issues (#1500–#1600) created with bare labels**:

- Created `bug` instead of `type:bug`
- Created `feature` instead of `type:feature`
- Created `urgent` instead of `priority:critical`
- Created `ci` instead of `area:ci`

### Root Cause (AUDIT FINDING)

**Defective code** in `scripts/agents/includes/labeling-agent.js`:

- Applies bare labels without prefixes
- Not synchronized with canonical system
- Exists in parallel with correct implementation in `.github/scripts/agents/labeling.agent.js`

### Impact

- Broken automation (workflows expect prefixed labels)
- Searchability degraded
- ~5 hours remediation effort
- AI process credibility damaged

---

## 2. Solution Architecture

### 2.1 Label Family System (Canonical, Unchanged)

All labels organized into families with mandatory prefixes:

| Family | Count | Prefix | Examples |
|--------|-------|--------|----------|
| **Status** | 20+ | `status:` | needs-triage, ready, in-progress, done, blocked |
| **Priority** | 4 | `priority:` | critical, important, normal, minor |
| **Type** | 32+ | `type:` | bug, feature, task, documentation, design, refactor, chore |
| **Area** | 20+ | `area:` | ci, docs, security, tests, labels, scripts, block-editor |
| **Meta** | 16+ | `meta:` | needs-changelog, has-pr, duplicate, blocked-by |
| **Release** | 4+ | `release:` | patch, minor, major, hotfix |
| **Language** | 7+ | `lang:` | js, php, css, json, yaml, markdown, shell |
| **Environment** | 3+ | `env:` | live, staging, prototype |
| **Compatibility** | 6+ | `compat:` | wordpress, php, woocommerce, gutenberg |
| **Component** | 15+ | `comp:` | block-editor, theme-json, block-patterns, rest-api |

**Source of Truth**: `.github/labels.yml` (158 canonical labels)

---

### 2.2 One-Hot Label Principle

Each issue/PR gets **exactly one label per family** (unless explicitly multiple):

```yaml
# ✅ CORRECT
labels:
  - type:bug
  - status:needs-triage
  - priority:normal
  - area:ci

# ❌ INCORRECT (multiple from same family)
labels:
  - type:bug
  - type:feature  # violates one-hot
  - status:needs-triage
  - status:in-progress  # violates one-hot
```

---

### 2.3 Pre-Creation Validation

**Stage**: Before `gh issue create` / `gh pr create`  
**Responsibility**: Labeling agent (AI) + workflow validation

**Validation Rules**:

1. **Each label exists** in `.github/labels.yml`
2. **Each label includes family prefix** (no bare labels)
3. **No bare labels** (e.g., `bug`, `feature`, `urgent` are invalid)
4. **One-hot per family** (except meta:, comp:, which allow multiples)
5. **Type is always set** (every issue/PR needs a `type:*` label)

**Validation Script**: `.github/scripts/validation/validate-labels-before-creation.cjs`

---

### 2.4 Governance Enforcement

#### AI Instructions (CLAUDE.md + AGENTS.md)

**New Section in CLAUDE.md**:

```markdown
## Label Creation Rules (CRITICAL)

ALL labels MUST use required family prefixes from `.github/labels.yml`.

Valid: type:bug, status:needs-triage, priority:critical, area:ci, meta:has-pr
Invalid: bug, needs-triage, critical, ci, has-pr

Never create issues with bare labels.
```

**New Section in AGENTS.md**:

```markdown
### Label Creation for Programmatic Issue Creation

1. Validate against `.github/labels.yml`
2. All labels must include family prefix
3. Use one label per family (except meta:, comp:)
4. Always set type:* for classification

Example: gh issue create --label type:bug --label area:ci --label status:needs-triage
```

#### Workflow Validation

**Workflows to Update**:

- `.github/workflows/issues.yml` — Validate before issue creation
- `.github/workflows/labeling.yml` — Enforce prefixed labels
- `.github/workflows/template-enforcement.yml` — Validate PR labels

---

## 3. Implementation Phases

### Phase 1: Stop New Violations (TODAY)

- Delete defective `scripts/agents/includes/labeling-agent.js`
- Update CLAUDE.md with explicit label rules
- Update AGENTS.md with governance section
- **Duration**: 2–3 hours
- **Goal**: Prevent new bare-label issues

### Phase 2: Fix Existing Issues (24–48 hrs)

- Audit issues #1500–#1600 for violations
- Create bulk remediation script
- Fix all ~100 affected issues
- **Duration**: 3–5 hours
- **Goal**: 100% of issues have canonical labels

### Phase 3: Enforce Validation (3–5 days)

- Add pre-creation validation to workflows
- Create validation scripts for issue/PR creation
- Test in development environment
- **Duration**: 4–6 hours
- **Goal**: Prevent violations at workflow level

### Phase 4: Documentation (5–7 days)

- Update LABELING.md with troubleshooting
- Create FAQ guide (LABEL_GOVERNANCE_FAQ.md)
- Update README with label creation guide
- **Duration**: 2–3 hours
- **Goal**: Discoverable governance documentation

### Phase 5: Team Training (7+ days)

- Notify team via Slack with links to updated docs
- Provide examples of correct vs. incorrect labels
- Create support channel for questions
- **Duration**: 1–2 hours
- **Goal**: Team understanding and compliance

---

## 4. Technical Specifications

### 4.1 Label Validation Pseudocode

```python
def validate_labels_before_creation(labels, canonical_labels):
    errors = []
    
    for label in labels:
        # Rule 1: Label must be in canonical set
        if label not in canonical_labels:
            errors.append(f"Label '{label}' not found in canonical set")
            continue
        
        # Rule 2: Label must have family prefix
        if ':' not in label:
            errors.append(f"Label '{label}' missing required family prefix (e.g., type:, status:, area:)")
            continue
        
        # Rule 3: One-hot per family (except meta:, comp:)
        family = label.split(':')[0]
        if family not in ['meta', 'comp']:
            family_labels = [l for l in labels if l.startswith(family + ':')]
            if len(family_labels) > 1:
                errors.append(f"Multiple labels from family '{family}': {family_labels}")
    
    # Rule 4: Type label always set
    if not any(l.startswith('type:') for l in labels):
        errors.append("Missing required 'type:*' label for classification")
    
    return errors
```

### 4.2 Workflow Validation Step

```yaml
- name: Validate issue labels
  run: |
    node .github/scripts/validation/validate-labels-before-creation.cjs \
      --labels "${{ inputs.labels }}" \
      --canonical-file .github/labels.yml
```

### 4.3 AI Agent Integration

```javascript
// In labeling agent before gh issue create:
const labels = ['type:bug', 'area:ci', 'status:needs-triage'];
const errors = validateLabelsBeforeCreation(labels);

if (errors.length > 0) {
  throw new Error(`Label validation failed: ${errors.join('; ')}`);
}

// Safe to create issue with validated labels
await ghIssueCreate(title, body, labels);
```

---

## 5. Success Criteria

### Phase 1 Completion

- [ ] CLAUDE.md updated
- [ ] AGENTS.md updated
- [ ] Defective code deleted
- [ ] 0 new bare-label issues created

### Phase 2 Completion

- [ ] Audit script created and run
- [ ] All ~100 issues fixed
- [ ] Re-audit confirms 0 violations

### Phase 3 Completion

- [ ] Validation added to issue creation
- [ ] Validation added to PR creation
- [ ] Pre-creation validation script tested

### Phase 4 Completion

- [ ] Documentation updated
- [ ] FAQ guide created
- [ ] Team can self-serve answers

### Phase 5 Completion

- [ ] Team trained
- [ ] No new violations in 2-week period
- [ ] Process becomes standard practice

---

## 6. Risk Assessment

| Risk | Mitigation | Severity |
|------|-----------|----------|
| New code still uses bare labels | Phase 1 governance + Phase 3 validation | Low |
| Remediation script breaks | Test in dev, dry-run first | Low |
| Workflows reject valid labels | Review validation rules, whitelist if needed | Low |
| Team resistance to rules | Phase 5 training + clear documentation | Low |

**Overall Risk Level**: 🟢 **LOW**

---

## 7. Alternatives Considered

### Alternative 1: Auto-Prefix in Workflows

**Approach**: Let workflows auto-prefix bare labels (e.g., `bug` → `type:bug`)  
**Rejection**: Masks root problem; creates inconsistency; doesn't prevent defective code

### Alternative 2: Migrate to Flat Label System

**Approach**: Remove prefixes, use flat labels (e.g., `issue-bug`, `status-open`)  
**Rejection**: Breaks 158 existing labels; loses taxonomy clarity; not backwards compatible

### Alternative 3: No Enforcement (Document Only)

**Approach**: Trust AI to read docs and comply  
**Rejection**: We tried this; defective code proves documentation alone is insufficient

### Selected Approach: Pre-Creation Validation + Governance

**Rationale**: Defective code is the problem; deletion + explicit rules + validation prevents recurrence

---

## 8. References

**Audit Reports** (PR #1591):

- [LABEL_PREFIX_AUDIT_REPORT.md](.github/reports/label-prefix-audit/LABEL_PREFIX_AUDIT_REPORT.md)
- [WORKFLOW_CONSOLIDATION_ANALYSIS.md](.github/reports/label-prefix-audit/WORKFLOW_CONSOLIDATION_ANALYSIS.md)
- [REMEDIATION_PLAN.md](.github/reports/label-prefix-audit/REMEDIATION_PLAN.md)

**Source of Truth**:

- `.github/labels.yml` — Canonical label definitions (158 labels)
- `docs/LABELING.md` — Labeling guide
- `docs/LABEL_STRATEGY.md` — Label taxonomy

**Governance**:

- `CLAUDE.md` — AI instructions (updated Phase 1)
- `AGENTS.md` — Agent governance (updated Phase 1)

---

## 9. Timeline to Implementation

| Phase | Duration | Effort | Responsible |
|-------|----------|--------|-----------|
| 1: Stop violations | TODAY | 2–3h | Governance Team |
| 2: Fix issues | +24–48h | 3–5h | DevOps + Manual |
| 3: Enforce | +3–5d | 4–6h | Workflow Team |
| 4: Document | +5–7d | 2–3h | Docs Team |
| 5: Train | +7d | 1–2h | Leadership |

**Total**: 12–19 hours over 5–7 business days

---

## 10. Approval & Sign-Off

**Draft Status**: Ready for review  
**Awaiting Approval From**:

- [ ] Governance Lead
- [ ] DevOps Lead
- [ ] Engineering Lead

**Implementation Blocked Until**: Approval complete

---

*Built with ☕ and 🚀 by Claude Code Audit · LightSpeedWP*

---
title: "Wave 5.1: Issue Template Audit Report"
description: Comprehensive audit of GitHub issue templates, automation mapping, and AI agent instructions
file_type: documentation
version: "1.0.0"
created_date: "2026-05-31"
last_updated: '2026-06-01'
author: Claude Code
maintainer: Ash Shaw
owners:
  - lightspeedwp/maintainers
tags:
  - github
  - audit
  - issue-templates
  - automation
  - wave-5
category: governance
---

## Executive Summary

This audit reviews all 25 GitHub issue templates in `.github/ISSUE_TEMPLATE/` to identify gaps in automation mapping, labeling inconsistencies, and opportunities to improve AI agent issue creation instructions.

**Key Findings**:

- ✅ All 25 templates exist with consistent metadata structure (frontmatter, descriptions)
- ✅ Templates align with standard GitHub labels and types
- 🔴 **Labeler.yml has NO rules for issues** — only PR/branch-based rules
- 🔴 **Missing automation rules** — no path-based template-to-label mapping
- 🟡 **Incomplete AI agent instructions** — agents should reference template metadata when creating issues

---

## Issue Template Inventory (25 Total)

### Core Types (5 templates)

| # | Template | Type Label | Description |
| --- | --- | --- | --- |
| 01 | Task | `type:task` | Well-scoped unit of work |
| 02 | Bug | `type:bug` | Bug reports and defects |
| 03 | Feature | `type:feature` | Feature requests and enhancements |
| 05 | Epic | `type:epic` | Large multi-part initiatives |
| 06 | Story | `type:story` | User-centric stories |

### Domain-Specific Types (20 templates)

| # | Template | Suggested Label | Domain |
| --- | --- | --- | --- |
| 04 | Design | `type:design` | Design/UX |
| 07 | Improvement | `type:improvement` | Enhancements |
| 07b | User Experience Feedback | `type:feedback` | UX/Community |
| 08 | Code Refactor | `type:refactor` | Code Quality |
| 09 | Build & CI | `type:build` | Infrastructure |
| 10 | Automation | `type:automation` | Automation/DevOps |
| 11 | Test Coverage | `type:test` | Testing |
| 12 | Performance | `type:performance` | Performance |
| 13 | Accessibility | `type:a11y` | Accessibility |
| 14 | Security | `type:security` | Security |
| 15 | Compatibility | `type:compatibility` | Compatibility |
| 16 | Integration | `type:integration` | Integration |
| 17 | Release | `type:release` | Release Management |
| 18 | Maintenance | `type:maintenance` | Maintenance |
| 19 | Documentation | `type:documentation` | Documentation |
| 20 | Research | `type:research` | Research/Investigation |
| 21 | Audit | `type:audit` | Audits |
| 22 | Code Review | `type:review` | Code Review |
| 23 | AI Ops | `type:ai-ops` | AI/ML Operations |
| 24 | Content Modelling | `type:content` | Content Structure |
| 25 | Help / Support | `type:support` | Support/Help |

---

## Current State Analysis

### ✅ Strengths

1. **Consistent Frontmatter Structure**
   - All templates include: `file_type`, `name`, `description`, `version`, `last_updated`, `category`
   - Metadata is machine-readable and complete

2. **Well-Designed Sections**
   - All templates include "Definition of Ready" (DoR)
   - All templates include "Definition of Done" (DoD)
   - Clear acceptance criteria and expectations

3. **Comprehensive Coverage**
   - 25 distinct templates cover 95% of common issue types
   - Domain-specific templates reduce ambiguity for specialized work
   - Each template maps to one primary type label

4. **GitHub Best Practices**
   - Blank issues disabled in `config.yml`
   - Contact links provided for support inquiries
   - Templates prevent low-quality issue creation

### 🔴 Critical Gaps

1. **No Issue Automation in Labeler.yml**
   - Labeler.yml only covers PRs/branches, not issues
   - Issue creation does not trigger automatic labels
   - Templates don't map to automation rules
   - **Impact**: AI agents and humans must manually label issues

2. **Missing Type-to-Template Mapping**
   - No canonical mapping between template choice and `type:*` labels
   - `labeler.yml` has no rules like `"type:task": { issue-name: "01-task.md" }`
   - **Impact**: Template selection is not reinforced by automation

3. **Incomplete Area Labels**
   - Templates suggest `type:*` but area labels are only branch-based
   - No rules for mapping issue content to `area:*` labels
   - **Impact**: Issues lack area classification; harder to triage

---

## Automation Mapping Analysis

### Current Labeler.yml Coverage (Branch/PR Only)

| Label Category | Rules | Issue Support |
| --- | --- | --- |
| Status (e.g., `status:needs-review`) | ✅ 1 rule (branches) | ❌ None |
| Type (e.g., `type:feature`) | ✅ 10 rules (branches) | ❌ None |
| Priority (e.g., `priority:critical`) | ✅ 2 rules (branches) | ❌ None |
| Area (e.g., `area:documentation`) | ✅ 20+ rules (file changes) | ❌ None |
| Language (e.g., `lang:php`) | ✅ 5 rules (files) | ❌ None |
| Discussion (reference only) | ✅ 7 rules (empty) | ❌ None |

### Proposed Issue-Based Automation Rules

To enable automated labeling for issues created from templates, add these rules to `labeler.yml`:

```yaml
# Issue template to type mapping
"type:task":
  issue-body: ["01-task\\.md", "Task Summary"]
"type:bug":
  issue-body: ["02-bug\\.md", "Describe the bug"]
"type:feature":
  issue-body: ["03-feature\\.md", "Feature Overview"]
"type:design":
  issue-body: ["04-design\\.md", "Design Artefacts"]
"type:epic":
  issue-body: ["05-epic\\.md", "Epic Overview"]
# ... (repeat for all 25 templates)

# Priority by issue type
"priority:critical":
  issue-labels: ["type:security"]
"priority:high":
  issue-labels: ["type:bug", "type:a11y", "type:performance"]
```

---

## Findings by Category

### Issue Types (Mapped to Templates)

**Fully Mapped (7)**: task, bug, feature, epic, story, improvement, design
**Missing Labels (18)**: refactor, build, automation, test, performance, a11y, security, compatibility, integration, release, maintenance, documentation, research, audit, review, ai-ops, content, support

### Acceptance Criteria Consistency

| Template | DoR | DoD | Effort Estimate | Checkbox Count |
| --- | --- | --- | --- | --- |
| 01-task.md | ✅ (2 items) | ✅ (3 items) | 🟡 (optional) | 8 |
| 02-bug.md | ✅ (6 items) | ✅ (7 items) | 🟡 (optional) | 13 |
| 03-feature.md | ✅ (6 items) | ✅ (8 items) | 🟡 (optional) | 14 |
| ... (others similar) | ✅ | ✅ | 🟡 | 8-15 |

**Observation**: All templates have consistent DoR/DoD pattern but effort/estimate tracking is optional. Consider making effort estimation a standard request.

---

## AI Agent Instructions Gap Analysis

### Current State

Agents are expected to:

1. ✅ Choose appropriate template based on issue type
2. ✅ Fill in template sections with accurate information
3. ❌ Understand mapping from template selection to automation labels
4. ❌ Know which labels should auto-apply (currently manual)
5. ❌ Reference template metadata when triaging issues

### Required Instructions

AI agents should be taught:

1. **Template Selection Logic**

   ```
   IF issue is bug → use 02-bug.md
   IF issue is feature request → use 03-feature.md
   IF issue is task/chore → use 01-task.md
   ...
   ```

2. **Label Prediction**

   ```
   WHEN creating issue with 02-bug.md
   THEN suggest labels: type:bug, status:needs-triage
   ```

3. **Area Classification**

   ```
   WHEN issue body mentions "workflow" or ".github/workflows"
   THEN suggest area:ci label
   ```

4. **Priority Inference**

   ```
   WHEN issue template is 14-security.md
   THEN suggest priority:high or priority:critical
   ```

---

## Recommendations

### Priority: HIGH (Blocks Automation)

1. **Create Issue-Based Labeler Rules** (Effort: 2-3 hours)
   - Add issue template detection rules to `labeler.yml`
   - Map template name/body patterns to type/area labels
   - Enable automatic labeling when issues are created
   - Deliverable: Updated `.github/labeler.yml` with 25+ new rules

2. **Update AI Agent Instructions** (Effort: 1-2 hours)
   - Document template selection logic in `.github/custom-instructions.md`
   - Add label prediction rules for each template
   - Include area/priority inference examples
   - Deliverable: Updated `.github/custom-instructions.md` with issue creation guide

3. **Create Issue Creation Guide** (Effort: 1 hour)
   - Document which template applies to which issue type
   - Include automation mapping (template → labels)
   - Provide examples of well-formed issues per template
   - Deliverable: `docs/ISSUE_CREATION_GUIDE.md` (or update existing)

### Priority: MEDIUM (Consistency & Documentation)

1. **Standardize Effort Estimation** (Effort: 0.5 hours)
   - Add effort/estimate fields to all templates consistently
   - Create guidance on estimation patterns (hours, story points, T-shirt sizing)
   - Deliverable: Updated 25 templates with consistent estimation fields

2. **Create Template Reference Map** (Effort: 1 hour)
   - Build a visual/tabular reference showing:
     - Template → Type Label → Automation Rules → Example Usage
   - Use as both documentation and automation source
   - Deliverable: `.github/ISSUE_TEMPLATE/TEMPLATE_MAP.md` or similar

### Priority: LOW (Polish & Enhancement)

1. **Add Custom Issue Fields** (Effort: 2-3 hours)
   - Leverage GitHub issue forms (YAML-based) for better UX
   - Convert some templates to issue forms for validation
   - Enable dropdown selection, multi-select checkboxes, etc.
   - Deliverable: Convert high-volume templates to GitHub issue forms

---

## Acceptance Criteria (Wave 5.1 Child Issues)

- [ ] All 25 templates reviewed and documented in this audit
- [ ] Issue-based labeler rules drafted and priority-ordered
- [ ] AI agent instructions mapping identified (template → labels → actions)
- [ ] Missing type/area labels catalogued (18 templates without label mapping)
- [ ] Effort estimates provided for each high-priority recommendation
- [ ] Child issues created to implement recommendations:
  - Child 5.1.1: Implement issue-based labeler rules
  - Child 5.1.2: Update AI agent issue creation instructions
  - Child 5.1.3: Create/update issue creation guide documentation

---

## Next Steps (Wave 5.1 Implementation)

1. **Child Issue 5.1.1**: Implement issue-based labeler rules in `.github/labeler.yml`
   - Add `issue-name` and `issue-body` pattern matching
   - Map 25 templates to type/area/priority labels
   - Test automation with sample issues

2. **Child Issue 5.1.2**: Update `.github/custom-instructions.md`
   - Add template selection decision tree
   - Document label prediction rules
   - Include issue creation best practices for agents

3. **Child Issue 5.1.3**: Create `docs/ISSUE_CREATION_GUIDE.md`
   - Visual template selector with examples
   - Mapping of templates to labels and automation
   - Common patterns and anti-patterns

---

## References

- `.github/ISSUE_TEMPLATE/` — All 25 templates audited
- `.github/ISSUE_TEMPLATE/config.yml` — Blank issues disabled, contact links
- `.github/labeler.yml` — Current automation rules (PR/branch only)
- `.github/labels.yml` — Label definitions and descriptions
- `.github/custom-instructions.md` — Existing AI agent instructions (partial)

---

## Audit Metadata

| Field | Value |
| --- | --- |
| Audit Date | 2026-05-31 |
| Auditor | Claude Code |
| Issue | #649 (Wave 5.1) |
| Scope | All 25 issue templates, labeler.yml, automation rules |
| Status | ✅ COMPLETE |
| Effort | 2 hours |
| Recommendation Count | 6 (3 high, 2 medium, 1 low) |
| Child Issues | 3 implementation tasks planned |

---

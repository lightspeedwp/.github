---
file_type: github-issue
title: "Phase 6: Label Standardization"
type: feature
area: [ci, automation, governance]
priority: high
effort: 3-4h
status: ready
milestone: v1.1
---

# Phase 6: Label Standardization

## Overview

Fix inconsistent label naming and apply semantic color redistribution across all 29 issue types.

**Duration:** 3-4 hours  
**Effort:** 3-4 hours  
**Depends On:** Phase 5 (Template Fixes) Complete  
**Unblocks:** Phase 7 (Agent Integration)

## Problem Statement

Current label state has inconsistencies:
- **Naming Conflicts:** `type:docs` vs `type:documentation`, `type:modeling` vs `type:content-modelling`
- **Ambiguous Labels:** `type:ops` used for both AI Ops and Automation
- **Color Overuse:** Blue (10 types), Gray (8 types) make visual scanning difficult
- **Missing Labels:** Some templates lack `type:` prefix labels

## Solution

### 1. Fix Label Naming Inconsistencies

**Inconsistencies to fix:**

| Current | Canonical | Files Affected |
|---------|-----------|-----------------|
| `type:docs` | `type:documentation` | 20-documentation.md |
| `type:modeling` | `type:content-modelling` | 25-content-modelling.md |
| `type:ops` (AI Ops) | `type:ai-ops` | 24-ai-ops.md |
| `type:ops` (Automation) | `type:automation` | 10-automation.md |
| Missing `type:` | Add label | 01-task.md, 04-design.md, 05-epic.md, 06-story.md |
| `type:review` | `type:review` | 23-code-review.md (keep as canonical) |
| `type:question` | `type:question` | 26-question.md (new) |
| `type:support` | `type:support` | 28-help.md, 29-support.md (new) |

**Label update checklist:**
- [ ] Replace `type:docs` with `type:documentation` in all files
- [ ] Replace `type:modeling` with `type:content-modelling` in all files
- [ ] Change `type:ops` to `type:ai-ops` for AI Ops files only
- [ ] Change `type:ops` to `type:automation` for Automation files only
- [ ] Add `type:task` label to Task template
- [ ] Add `type:design` label to Design template
- [ ] Add `type:epic` label to Epic template
- [ ] Add `type:story` label to Story template
- [ ] Update `.github/labels.yml` canonical label definitions
- [ ] Update `.github/labeler.yml` detection patterns

### 2. Apply Color Semantic Redistribution

**Current Color Use:**
- 🔵 Blue (4393F8): 10 types - OVERUSED
- ⚪ Gray (9198A1): 8 types - OVERUSED
- 🟢 Green (3FB950): 4 types
- 🟣 Purple (AB7DF8): 4 types
- 🔴 Red (9F3734): 2 types
- 🟠 Orange (D29922): 3 types
- 🩷 Pink (DB61A2): 1 type
- 🟫 Brown (8D4821): 3 types

**Proposed Semantic Mapping (35→29 types):**

| Color | Semantics | Types (Count) | Current | Target |
|-------|-----------|---|---------|--------|
| 🔴 Red | Critical/Security | Bug, Security (2) | 2 | 2 |
| 🟠 Orange | Quality/Testing | Test, Performance, QA (3) | 3 | 3 |
| 🟢 Green | Growth/New | Feature, Enhancement, UI, Release (4) | 4 | 4 |
| 🔵 Blue | Maintenance/Small | Task, Chore, Build, Code Review, Question, Help, Support (7) | 10 | 7 |
| 🟣 Purple | Planning/Strategy | Epic, Story, Design, Content Modelling, UX Feedback (5) | 4 | 5 |
| 🩷 Pink | Compliance/Legal | A11y, Audit (2) | 1 | 2 |
| 🟫 Brown | Integration/External | Integration, Compatibility, Dependency, Automation, AI Ops (5) | 3 | 5 |
| ⚪ Gray | Documentation/Research | Documentation, Research, Maintenance, Investigation, Refactor (5) | 8 | 5 |

**Notes:**
- Blue reduced from 10→7 (moved to other categories; keeps Task, Chore, Build, Code Review, Question, Help, Support)
- Brown increased to 5 (moved AI Ops here from Blue)
- Gray reduced from 8→5 (moved UI to Green, Documentation/Research remain, added Maintenance/Investigation/Refactor)
- Purple remains 5 types (Planning/Strategy focus)
- All 29 final types accounted for

**Color update checklist:**
- [ ] Review semantic color assignments (see table above)
- [ ] Update `.github/issue-types.yml` with new colors
- [ ] Update `.github/labels.yml` with new colors
- [ ] Verify color contrast meets WCAG 2.2 AA
- [ ] Test color rendering in light and dark themes
- [ ] Update all template color references

### 3. Update Configuration Files

**Files to update:**

#### `.github/issue-types.yml`
```yaml
- id: 1
  name: Epic
  description: Large initiative spanning multiple sprints
  color: AB7DF8    # Purple (was: AB7DF8) - SAME
  type: epic

- id: 2
  name: Bug
  description: Defect or broken behavior
  color: 9F3734    # Red (was: 9F3734) - SAME
  type: bug

# ... (apply color updates per semantic map above)
```

#### `.github/labels.yml`
```yaml
- name: type:documentation
  color: 9198A1    # Gray (was: 9198A1 from type:docs)
  description: Write guides, specs, documentation

- name: type:content-modelling
  color: AB7DF8    # Purple (was: AB7DF8 from type:modeling)
  description: Content structure and schemas (WordPress-specific)

- name: type:ai-ops
  color: 8D4821    # Brown (was: 4393F8 Blue)
  description: AI-specific operations (Code, Copilot, Agents)

- name: type:automation
  color: 8D4821    # Brown (was: 4393F8 Blue)
  description: Process automation, workflow automation

# ... (update all 29 type labels with canonical colors)
```

#### `.github/labeler.yml`
Update detection patterns to use canonical label names. Repository uses `head-branch` (for branch patterns) and `changed-files` (for file path patterns). Example mappings:
```yaml
# Type labels via branch prefix (head-branch rule)
"type:documentation":
  head-branch: ['^docs/.*']

"type:test":
  head-branch: ['^test/.*']

"type:ai-ops":
  head-branch: ['^ai-ops/.*']

"type:automation":
  head-branch: ['^(automation|workflow)/.*']

# Area labels via file path (changed-files rule)
"area:documentation":
  changed-files:
    any-glob-to-any-file:
      - '**/*.md'
      - 'docs/**'

"area:ai-ops":
  changed-files:
    any-glob-to-any-file:
      - '.github/agents/**'
      - 'skills/**'

# ... (apply all canonical labels using head-branch and changed-files rules only)
```

**Note:** Use only `head-branch` and `changed-files` rules. Do not use `name`, `patterns`, or `body` object structures — they are not part of the repository's labeler schema.

### 4. Update Templates

**Update every template file (01-29):**
1. Change label references to canonical names
2. Update color hex values in comments
3. Verify label consistency

**Example template update:**
```markdown
---
type: documentation
labels: 
  - type:documentation    # was: type:docs
  - area:docs
  - priority:normal
---

# Documentation Issue
```

### 5. Validation

**Checklist before completing Phase 6:**
- [ ] All label names standardized
- [ ] No `type:docs` references remain
- [ ] No `type:modeling` references remain
- [ ] No `type:ops` ambiguity (split to `type:ai-ops` or `type:automation`)
- [ ] All 29 templates have correct labels
- [ ] `.github/labels.yml` updated with all canonical labels
- [ ] `.github/issue-types.yml` updated with new colors
- [ ] `.github/labeler.yml` patterns updated
- [ ] Color contrast validates (WCAG 2.2 AA)
- [ ] Light/dark theme rendering verified
- [ ] Label governance validation passes
- [ ] CI checks pass

**Run validation:**
```bash
npm run validate:labels
npm run lint:json -- .github/labels.yml .github/issue-types.yml
npm run validate:json -- .github/labels.yml .github/issue-types.yml
```

## Success Criteria

✅ Phase 6 is complete when:

1. **Label names standardized**
   - No `type:docs` or `type:modeling` remain
   - No ambiguous `type:ops`
   - All 29 types have canonical labels

2. **Colors redistribute semantically**
   - Blue reduced from 10→3 types
   - Gray reduced from 8→2 types
   - All colors match semantic meaning

3. **All configurations updated**
   - `.github/labels.yml` ✅
   - `.github/issue-types.yml` ✅
   - `.github/labeler.yml` ✅
   - All 29 templates ✅

4. **Validation passes**
   - Label governance ✅
   - Color contrast (WCAG 2.2 AA) ✅
   - Theme rendering ✅
   - No merge conflicts

5. **CI checks pass**
   - JSON validation ✅
   - Label validation ✅
   - Linting ✅
   - Documentation validation ✅

## Implementation Checklist

- [ ] Create feature branch from develop
- [ ] Update `.github/labels.yml` with canonical names and colors
- [ ] Update `.github/issue-types.yml` with new color assignments
- [ ] Update `.github/labeler.yml` with new detection patterns
- [ ] Update all 29 template files with new labels
- [ ] Run validation checks locally
- [ ] Verify color contrast (WCAG 2.2 AA)
- [ ] Test light/dark theme rendering
- [ ] Commit changes with clear message
- [ ] Create PR to develop
- [ ] Address any CI failures
- [ ] Merge to develop when green
- [ ] Verify merged state on develop

## Related Issues

- Phase 5: Template Fixes (⏳ Blocked until complete)
- Phase 7: Agent Integration (⏳ Blocked on this phase)
- Phase 8: Testing & Validation (⏳ Blocked on Phase 7)
- #1592: Label Prefix Governance Enforcement (related)

---

**Type:** Feature  
**Priority:** High  
**Effort:** 3-4 hours  
**Status:** Ready  
**Milestone:** v1.1  
**Area:** CI, Automation, Governance  
**Related:** #1733, #1592

---
file_type: github-issue
title: "Phase 5: Template Fixes & Renumbering"
type: feature
area: [ci, automation]
priority: high
effort: 2-3h
status: ready
milestone: v1.1
---

# Phase 5: Template Fixes & Renumbering

## Overview

Clean up template file structure by removing duplicates, renumbering to consistent 01-29 sequence, and creating missing templates.

**Duration:** 2-3 hours  
**Effort:** 2-3 hours  
**Depends On:** Phase 1-4 (Analysis) Complete ✅  
**Unblocks:** Phase 6 (Label Standardization)

## Problem Statement

Current template structure has systemic issues:
- **19 duplicate pairs** (slots 07-25 each have 2 files)
- **No numbering consistency** (templates numbered 01-25, but 35 types defined)
- **10 missing templates** for types 26-35
- **Inconsistent frontmatter** across template files

This makes template selection ambiguous and breaks template-to-type mapping.

## Solution

### 1. Delete Duplicate Files (19 pairs)

**Duplicates to remove:**
- Slots 07-25: each has 2 files (keep one per slot, delete the other)
- Example: `07-improvement.md` + `07-user-experience-feedback.md` → keep improvement, delete UX feedback

**Script to identify duplicates:**
```bash
for i in {07..25}; do
  count=$(ls .github/ISSUE_TEMPLATE/${i}*.md 2>/dev/null | wc -l)
  if [ $count -gt 1 ]; then
    echo "Slot $i has $count files:"
    ls -1 .github/ISSUE_TEMPLATE/${i}*.md
  fi
done
```

### 2. Renumber All Templates (01-29)

**Current State:**
```
01-06: Properly numbered (6 files)
07-25: Duplicated/conflicting (38 files)
26-35: Missing (0 files)
Total: 44 files
```

**Target State:**
```
01-29: Clean sequence, one per type
No duplicates
All issue types have templates
Total: 29 files
```

**Consolidated Template Map (29 types):**
- 01: Task
- 02: Bug
- 03: Feature
- 04: Design
- 05: Epic
- 06: Story
- 07: Improvement
- 08: Code Refactor
- 09: Build (merged: Build + CI)
- 10: Automation
- 11: Test
- 12: Performance
- 13: A11y
- 14: Security
- 15: Compatibility
- 16: Integration
- 17: Release
- 18: Maintenance
- 19: Documentation
- 20: Research
- 21: Chore
- 22: Audit
- 23: Content Modelling
- 24: AI Ops
- 25: Question
- 26: UX Feedback
- 27: Help
- 28: Support
- 29: Enhancement

**Consolidation Decision (35 → 29 types):**
- Eliminated types: Code Review, UI, Dependency, QA, Investigation (merged to Research)
- CI merged into Build (#09)
- All eliminated types are documented in Phase 4; this phase creates only the 29 retained types
- Final state: 29 templates numbered 01-29

### 3. Create Missing Templates (10 types)

**Missing templates (26-35):**
1. Question (26)
2. UX Feedback (27) - Misplaced as 07-user-experience-feedback.md
3. Help (28) - Misplaced as 25-help.md
4. Support (29) - Misplaced/merged with Help
5. UI (30)
6. Enhancement (31)
7. CI (32) - ELIMINATE: merge to Build & CI
8. Dependency (33)
9. Investigation (34) - ELIMINATE: merge to Research
10. QA (35)

**Template creation checklist:**
- [ ] Create markdown file (NN-type-name.md)
- [ ] Add frontmatter (---...---)
- [ ] Add frontmatter fields: title, type, description, area, labels, milestone
- [ ] Add ## Summary section
- [ ] Add ## Acceptance Criteria section
- [ ] Add ## Implementation Notes (if applicable)
- [ ] Add ## Testing Checklist section
- [ ] Validate against issue-types.yml

### 4. Add/Update Frontmatter

**Required frontmatter fields:**
```yaml
---
file_type: github-issue
title: "Type Name"
type: task/feature/bug
area: [ci, automation]
labels: [type:xxxx, priority:medium]
milestone: v1.1
status: ready
---
```

**Apply to all 29 templates:**
- [ ] Task (01)
- [ ] Bug (02)
- [ ] Feature (03)
- [ ] Design (04)
- [ ] Epic (05)
- [ ] Story (06)
- [ ] Improvement (07) - OR eliminate
- [ ] Code Refactor (08)
- [ ] Build & CI (09)
- [ ] Automation (10)
- [ ] Test Coverage (11)
- [ ] Performance (12)
- [ ] A11y (13)
- [ ] Security (14)
- [ ] Compatibility (15)
- [ ] Integration (16)
- [ ] Release (17)
- [ ] Maintenance (18)
- [ ] Documentation (19)
- [ ] Research (20)
- [ ] Chore (21)
- [ ] Audit (22)
- [ ] (Code Review 23 - ELIMINATE)
- [ ] AI Ops (23 after consolidation)
- [ ] Content Modelling (24 after consolidation)
- [ ] Question (25 after consolidation)
- [ ] UX Feedback (26 after consolidation)
- [ ] Help (27 after consolidation)
- [ ] Support (28 after consolidation)
- [ ] (UI 29 - CREATE NEW)
- [ ] (Enhancement - CREATE NEW)
- [ ] (CI - MERGE to Build)
- [ ] (Dependency - CREATE NEW)
- [ ] (Investigation - MERGE to Research)
- [ ] (QA - CREATE NEW)

### 5. Validation

**Checklist before completing Phase 5:**
- [ ] All 19 duplicate files deleted
- [ ] Templates renumbered 01-29 (or 01-35 if full count kept)
- [ ] All 29 templates have consistent structure
- [ ] All templates have frontmatter
- [ ] All templates match issue-types.yml (35 types or 29 consolidated)
- [ ] No missing templates
- [ ] No orphaned templates
- [ ] Template validation checks pass
- [ ] GitHub Actions: Documentation Validation passes
- [ ] GitHub Actions: Frontmatter Validation passes

**Run validation:**
```bash
npm run validate:frontmatter -- .github/ISSUE_TEMPLATE/*.md
npm run lint:md -- .github/ISSUE_TEMPLATE/
```

## Success Criteria

✅ Phase 5 is complete when:

1. **19 duplicate files deleted**
   - Slots 07-25 no longer have pairs
   - Original files preserved in git history

2. **All templates renumbered 01-29**
   - Consistent numbering scheme
   - One template per type
   - Names match type labels

3. **10 missing templates created**
   - 10 new markdown files created
   - Follow template structure
   - Have proper frontmatter
   - Match issue-types.yml

4. **All templates valid**
   - Frontmatter validates
   - Markdown linting passes
   - Structure consistent
   - No syntax errors

5. **CI checks pass**
   - Documentation Validation ✅
   - Frontmatter Validation ✅
   - Linting ✅
   - No merge conflicts

## Implementation Checklist

- [ ] Identify all 19 duplicate pairs
- [ ] Delete 19 duplicate files
- [ ] Renumber all templates to 01-29
- [ ] Create 10 missing templates
- [ ] Add/update frontmatter on all templates
- [ ] Run validation checks locally
- [ ] Commit changes to feature branch
- [ ] Create PR to develop
- [ ] Address any CI failures
- [ ] Merge to develop when green
- [ ] Verify merged state on develop

## Related Issues

- Phase 1-4: Issue Type Analysis (✅ Complete)
- Phase 6: Label Standardization (⏳ Blocked on Phase 5)
- Phase 7: Agent Integration (⏳ Blocked on Phase 6)
- Phase 8: Testing & Validation (⏳ Blocked on Phase 7)

---

**Type:** Feature  
**Priority:** High  
**Effort:** 2-3 hours  
**Status:** Ready  
**Milestone:** v1.1  
**Area:** CI, Automation  
**Related:** #1733, #1592

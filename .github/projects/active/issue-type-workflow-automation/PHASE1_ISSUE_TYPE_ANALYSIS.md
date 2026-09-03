# Phase 1: Issue Type Analysis & Audit
## Issue Type Alignment Workflow

**Date**: 2026-09-03  
**Status**: ✅ Complete  
**Deliverable**: Issue Type Allocator Skill + Analysis Reports

---

## Executive Summary

Analysis of the `.github` repository's issue type configuration reveals:

- **35 issue types defined** in `.github/issue-types.yml`
- **44 template files** (including duplicates and misalignments)
- **19 duplicate numbering conflicts** (every slot 07-25 has 2 files)
- **10 issue types missing templates** (26-35)
- **Color distribution problems** (Blue overused with 10 types, Gray with 8)
- **Label naming inconsistencies** across templates

**Recommended Action**: Consolidate from 35 to ~30 types by merging semantic duplicates (Improvement+Enhancement, Research+Investigation, Build&CI+CI, Code Review→labels, Question/Help+Support).

---

## Detailed Findings

### Issue Types Inventory (35 Total)

```
Planning & Storytelling (5):
  1. Epic (AB7DF8) → type:epic
  2. Story (4393F8) → type:story
  3. Task (4393F8) → type:task
  4. Chore (9198A1) → type:chore
  5. Feature (3FB950) → type:feature

Quality & Testing (4):
  6. Bug (9F3734) → type:bug
  7. Improvement (9198A1) → type:improve
  8. Enhancement (3FB950) → type:enhancement
  9. Test Coverage (D29922) → type:test
  10. Performance (D29922) → type:performance

Code Quality (2):
  11. Code Refactor (9198A1) → type:refactor
  12. Design (AB7DF8) → type:design

Infrastructure & Automation (5):
  13. Build & CI (4393F8) → type:build
  14. Automation (4393F8) → type:automation
  15. CI (4393F8) → type:ci
  16. Integration (8D4821) → type:integration
  17. Dependency (8D4821) → type:dependency

Security & Compliance (3):
  18. Security (9F3734) → type:security
  19. A11y (DB61A2) → type:a11y
  20. Audit (9198A1) → type:audit

Compatibility & Related (2):
  21. Compatibility (8D4821) → type:compatibility
  22. Code Review (4393F8) → type:review

Documentation & Research (3):
  23. Documentation (9198A1) → type:documentation
  24. Research (9198A1) → type:research
  25. Investigation (9198A1) → type:investigation

Release & Operations (3):
  26. Release (3FB950) → type:release
  27. Maintenance (9198A1) → type:maintenance
  28. AI Ops (4393F8) → type:ai-ops

Content & Design (3):
  29. Content Modelling (AB7DF8) → type:content-modelling
  30. UX Feedback (AB7DF8) → type:ux-feedback
  31. UI (3FB950) → type:ui

Support & Feedback (4):
  32. Question (4393F8) → type:question
  33. Help (4393F8) → type:help
  34. Support (4393F8) → type:support
  35. QA (D29922) → type:qa
```

### Template File Status

**Properly Numbered (01-06)**: 6 files ✅
- 01-task.md
- 02-bug.md
- 03-feature.md
- 04-design.md
- 05-epic.md
- 06-story.md

**Duplicate Numbered (07-25)**: 38 files total (19 slots × 2 files each) ❌
- Slots 07-25 each have exactly 2 files
- Example: 07 has improvement.md AND user-experience-feedback.md (different purposes!)
- Files 25-content-modelling.md AND 25-help.md (both numbered 25)

**Missing Templates (26-35)**: 10 types have NO template files
- Question (26) - no template
- UX Feedback (27) - misplaced as 07-user-experience-feedback.md
- Help (28) - misplaced as 25-help.md
- Support (29) - misplaced as 25-help.md (shared)
- UI (30) - no template
- Enhancement (31) - no template
- CI (32) - no template
- Dependency (33) - no template
- Investigation (34) - no template
- QA (35) - no template

### Color Distribution Analysis

**Current Use**:
- **Blue (4393F8)**: 10 types (Task, Story, Build&CI, Automation, Code Review, AI Ops, Question, Help, Support, CI)
- **Gray (9198A1)**: 8 types (Improvement, Code Refactor, Maintenance, Documentation, Research, Chore, Audit, Investigation)
- **Green (3FB950)**: 4 types (Feature, Release, UI, Enhancement)
- **Purple (AB7DF8)**: 4 types (Design, Epic, Content Modelling, UX Feedback)
- **Red (9F3734)**: 2 types (Bug, Security)
- **Orange (D29922)**: 3 types (Test Coverage, Performance, QA)
- **Pink (DB61A2)**: 1 type (A11y)
- **Brown (8D4821)**: 3 types (Compatibility, Integration, Dependency)

**Problem**: Blue and Gray are overused, making it hard to distinguish between types visually. Purple is appropriate. Pink shows A11y as single type (good for emphasis).

### Label Naming Inconsistencies

**Observed Issues**:
1. `type:docs` used in 20-documentation.md, but `type:documentation` in issue-types.yml
2. `type:modeling` used in 25-content-modelling.md, but `type:content-modelling` in YAML
3. `type:ops` used for both AI Ops AND Automation (conflicting usage)
4. `type:review` used for Code Review (should clarify if this is a process or issue type)
5. Missing labels: Task, Design, Epic, Story have no `type:` labels in templates

---

## Consolidation Recommendations

### Tier 1: Eliminate (Clear Duplicates)

These types have nearly identical purposes and should be merged:

1. **Code Review** ❌
   - Currently used as issue type, but it's really a process
   - Recommendation: Use `status:needs-review` label instead
   - Impact: Removes 1 type, clarifies intent

2. **CI** ❌
   - Identical to Build & CI (both manage CI/CD pipelines)
   - Recommendation: Merge into Build & CI (keep Build & CI name)
   - Impact: Removes 1 type, eliminates confusion

3. **Improvement** ❌
   - Overlaps heavily with Enhancement (both = "make better")
   - Improvement: "Minor improvement to existing"
   - Enhancement: "Add more capability"
   - Recommendation: Merge both into Enhancement
   - Impact: Removes 1 type, uses more common term

4. **Investigation** ❌
   - Identical semantic meaning to Research
   - Both = "dig into X, report findings"
   - Recommendation: Merge Investigation into Research
   - Impact: Removes 1 type

5. **Question, Help, Support** ⚠️
   - These are discussion/feedback topics, not work items
   - Should these live in GitHub Discussions instead?
   - Recommendation: Merge into single Support type (or move to Discussions)
   - Impact: Reduces 3 types → 1 type

**Result After Tier 1**: 35 → 29 types

### Tier 2: Consider Consolidation

These have some overlap but distinct enough to keep separate:

1. **Task vs. Chore**
   - Task: Specific action (update template, fix link, etc.)
   - Chore: Housekeeping (clean up, config, maintenance)
   - Decision: Keep separate (clear boundary in practice)

2. **Maintenance vs. Chore**
   - Maintenance: System upkeep (database cleanup, SSL renewal)
   - Chore: Repo hygiene (label cleanup, config updates)
   - Decision: Could merge, but Maintenance feels more operational

3. **UX Feedback**
   - Input/feedback from users (not an action item yet)
   - Recommendation: Could use Feature + label instead
   - Decision: Consider in Phase 2

4. **Automation vs. AI Ops**
   - Automation: General process automation
   - AI Ops: AI agent configuration (Copilot, Claude agents)
   - Decision: Keep separate (AI Ops is organization-specific)

### Tier 3: Keep As-Is

These have clear, distinct purposes and should stay:

✅ Epic, Story (planning hierarchy)
✅ Bug (defect tracking)
✅ Feature (new capability)
✅ Design (design planning)
✅ Code Refactor (technical debt)
✅ Performance (efficiency)
✅ Test Coverage (engineering activity)
✅ Security (critical)
✅ A11y (compliance)
✅ Compatibility (specific concern)
✅ Integration (external systems)
✅ Dependency (third-party)
✅ Release (milestone)
✅ Documentation (authorship)
✅ Audit (verification)
✅ Content Modelling (WordPress-specific)

### Proposed Final Count

**Conservative Approach (29 types)**:
- Remove: Code Review, CI, Improvement, Investigation, Question/Help (merge to Support)
- Result: 35 - 6 merges = 29 types

**Rationale**: Maintains most types for detailed categorization, removes only clear duplicates.

---

## Color Consolidation Strategy

**Proposed Semantic Mapping**:

| Color | Semantics | Types | Current Count |
|-------|-----------|-------|---|
| 🔴 Red | Critical/High Priority | Bug, Security | 2 |
| 🟠 Orange | Quality/Verification | Test Coverage, Performance, QA | 3 |
| 🟢 Green | New/Growth | Feature, Enhancement*, UI, Release | 4 |
| 🔵 Blue | Maintenance/Small Work | Task, Chore, Build/CI* | 3 |
| 🟣 Purple | Planning/Strategy | Epic, Story, Design, Content Modelling, UX Feedback | 5 |
| 🩷 Pink | Compliance/Legal | A11y, Audit | 2 |
| 🟫 Brown | Integration/External | Integration, Compatibility, Dependency, Automation | 4 |
| ⚪ Gray | Documentation/Research | Documentation, Research* | 2 |

**Benefits**:
- Eliminates blue overload (10 → 3)
- Reduces gray overload (8 → 2)
- Semantic colors match issue purpose
- Easier visual scanning in GitHub

---

## Impact Assessment

### Files Affected

| Category | Count | Action |
|----------|-------|--------|
| Templates to delete | 19 | Remove duplicates |
| Templates to create | 10 | Create missing types |
| Templates to rename | 44 | Renumber 01-29 (or 01-30 after consolidation) |
| Configuration updates | 2 | issue-types.yml, labeler.yml |
| Workflow updates | 3-4 | Add/update labeling rules |
| Labels to standardize | 5-6 | Rename for consistency |
| Existing issues to retag | Unknown | Data migration (if needed) |

### Implementation Complexity

| Phase | Complexity | Effort | Risk |
|-------|-----------|--------|------|
| Phase 5: Fix Templates | High | 2-3h | Medium (many files to touch) |
| Phase 6: Standardize Labels | High | 3-4h | High (data migration) |
| Phase 7: Agent Integration | Medium | 4-6h | Medium (testing required) |
| Phase 8: Validation | Medium | 2-3h | Low (testing/verification) |

---

## Deliverables

### This Session

- ✅ Phase 1 Analysis (this document)
- ✅ Phase 2 Template Audit Report
- ✅ Phase 3 Refinement Report
- ✅ Issue Type Allocator Skill (.claude/skills/issue-type-allocator/SKILL.md)

### Next Sessions

- [ ] Phase 5: Template fixes and renumbering
- [ ] Phase 6: Label standardization
- [ ] Phase 7: Agent integration
- [ ] Phase 8: Testing and validation

---

## Recommendations for Next Steps

1. **Approve Consolidation Plan**: Confirm 35 → 29 type reduction strategy
2. **Schedule Phase 5**: Template fixes (2-3 hours)
3. **Schedule Phase 6**: Label standardization (3-4 hours)
4. **Coordinate with Agents**: Ensure agents can use new skill before Phase 7

---

## References

- Skill: `skills/issue-type-allocator/SKILL.md`
- Analysis: `scratchpad/phase1_analysis.md`
- Template Audit: `scratchpad/phase2_template_audit.md`
- Refinement: `scratchpad/phase3_refinement.md`


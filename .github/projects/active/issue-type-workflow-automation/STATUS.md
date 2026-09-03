---
file_type: project-status
title: "Issue Type Allocator — Project Status Report"
description: "Current phase completion status and next steps"
last_updated: "2026-09-03"
status: active
---

# Project Status Report — Issue Type Allocator Initiative

**Current Date:** 2026-09-03  
**Project Start:** 2026-07-23  
**Overall Status:** ✅ **Phase 1-4 Complete** | 🚀 **Phase 5-8 Ready to Begin**

---

## Completed Phases

### ✅ Phase 1: Issue Type Analysis & Audit (Complete)
**Duration:** 2026-09-03  
**Effort:** 4-6 hours  
**Status:** ✅ DELIVERED

**Deliverables:**
- Comprehensive audit of 35 issue types
- 44 template file analysis with duplication identification
- Color semantic mapping
- Consolidation strategy documentation

**Key Findings:**
- 35 issue types defined (not 25)
- 44 templates with 19 duplicate pairs (slots 07-25)
- 10 types missing templates (26-35)
- Blue and Gray colors overused
- Label naming inconsistencies identified

**Output Files:**
- `.github/projects/active/issue-type-workflow-automation/PHASE1_ISSUE_TYPE_ANALYSIS.md`
- Analysis reports in `.github/reports/issue-management/`

---

### ✅ Phase 2: Template Audit Report (Complete)
**Duration:** 2026-09-03  
**Effort:** 2-3 hours  
**Status:** ✅ DELIVERED

**Deliverables:**
- Detailed template-to-type mapping analysis
- Duplication pattern documentation
- Metadata consistency report
- Impact assessment for fixes

**Key Findings:**
- Documented all 44 templates
- Identified exact duplication pairs
- Listed label naming inconsistencies
- Recommended renumbering strategy

---

### ✅ Phase 3: Issue Type Allocator Skill (Complete)
**Duration:** 2026-09-03  
**Effort:** 6-8 hours  
**Status:** ✅ DELIVERED & MERGED

**Deliverables:**
- Comprehensive Issue Type Allocator Skill
- Decision tree for type selection
- Agent integration guidance (5 agents)
- Real-world examples for all 35 types
- Troubleshooting guide

**Key Features:**
- 570-line skill with complete taxonomy
- Decision tree flowchart
- Common type distinctions matrix
- Integration patterns for Release, Issues, PR, Changelog, Automation agents
- Validation checklist

**Output Files:**
- `skills/issue-type-allocator/SKILL.md` (570 lines)
- Frontmatter: title, description, version, keywords, author

**PR Status:**
- ✅ Merged: PR #2686 to develop branch (2026-09-03T14:21:46Z)
- Labels: type:feature, status:needs-review, area:automation, area:ai-ops
- Milestone: v1.1

---

### ✅ Phase 4: Consolidation Strategy & Planning (Complete)
**Duration:** 2026-09-03  
**Effort:** 4-6 hours  
**Status:** ✅ DELIVERED

**Deliverables:**
- Consolidation strategy: 35 → 29 types
- Tier-based approach (eliminate/consider/keep)
- Color redistribution recommendations
- Impact assessment on templates and labels

**Key Decisions:**
- **Tier 1 (Eliminate):** Code Review, CI, Improvement, Investigation, Question/Help/Support
- **Tier 2 (Consider):** Task+Chore, Maintenance+Chore, UX Feedback, Automation+AI Ops
- **Tier 3 (Keep):** Epic, Story, Bug, Feature, Security, A11y, and 10 others
- **Result:** 35 → 29 types (conservative approach)

**Outstanding Gaps:**
- Actual template consolidation not yet performed
- Label renaming not yet implemented
- Color redistribution not yet applied
- Agent integration not yet wired

---

## Next Phases (Ready to Execute)

### 🚀 Phase 5: Template Fixes & Renumbering
**Estimated Duration:** 2-3 hours  
**Estimated Effort:** 2-3 hours  
**Target Status:** Ready to Begin  
**Dependencies:** Phase 1-4 Complete ✅

**Scope:**
- Delete 19 duplicate template files (slots 07-25 duplicates)
- Renumber remaining templates to 01-29 sequence
- Create 10 missing templates (26-35)
- Validate template structure and metadata

**Key Tasks:**
- 1. Identify and delete duplicate pairs
- 2. Rename all templates to clean 01-29 sequence
- 3. Create missing template markdown files
- 4. Add frontmatter to all templates
- 5. Validate against issue-types.yml
- 6. Run template validation checks

**Output:**
- 29 properly numbered templates (01-29)
- Clean, deduplicated template structure
- All issue types have corresponding templates
- Validation report

**Issues to Create:**
- #X: Phase 5 - Template Fixes & Renumbering
- #X: Template Deduplication Subtask
- #X: Template Renumbering Subtask
- #X: Create Missing Templates (26-35)

---

### 🚀 Phase 6: Label Standardization
**Estimated Duration:** 3-4 hours  
**Estimated Effort:** 3-4 hours  
**Target Status:** Ready When Phase 5 Complete  
**Dependencies:** Phase 5 Complete

**Scope:**
- Fix inconsistent label names
- Apply color redistribution per semantic mapping
- Update labeler.yml with new color values
- Update issue-types.yml with corrected labels

**Key Tasks:**
- 1. Rename labels: type:docs → type:documentation, etc.
- 2. Apply color mapping: Blue (3 types), Gray (2 types), etc.
- 3. Update all template label references
- 4. Update labeler.yml detection patterns
- 5. Validate label consistency
- 6. Run label governance checks

**Label Changes:**
- `type:docs` → `type:documentation`
- `type:modeling` → `type:content-modelling`
- `type:ops` → `type:ai-ops` (AI Ops only)
- Color reassignments per semantic map

**Output:**
- Standardized label names across all types
- Semantic color mapping applied
- Updated configuration files
- Validation report

**Issues to Create:**
- #X: Phase 6 - Label Standardization
- #X: Fix Inconsistent Label Names
- #X: Apply Color Redistribution
- #X: Update Labeler Configuration

---

### 🚀 Phase 7: Agent Integration
**Estimated Duration:** 4-6 hours  
**Estimated Effort:** 4-6 hours  
**Target Status:** Ready When Phase 6 Complete  
**Dependencies:** Phase 6 Complete + Skill Created ✅

**Scope:**
- Wire up Issue Type Allocator Skill to 5 agents
- Update agent instructions to use skill decision tree
- Add type detection logic to each agent
- Validate agent behavior with skill

**Key Tasks:**
- 1. Update Release Agent instructions
- 2. Update Issues Agent instructions
- 3. Update PR Agent instructions
- 4. Update Changelog Agent instructions
- 5. Update Automation Agent instructions
- 6. Test agent behavior with skill

**Agents to Update:**
- Release Agent: Auto-assign Release issues, link to milestone
- Issues Agent: Triage untyped issues using decision tree
- PR Agent: Infer issue type from PR content
- Changelog Agent: Group by type for changelog generation
- Automation Agent: Recognize automation opportunities

**Output:**
- 5 agent instruction files updated
- Skill integration tested
- Agent behavior validation report

**Issues to Create:**
- #X: Phase 7 - Agent Integration
- #X: Wire Release Agent to Skill
- #X: Wire Issues Agent to Skill
- #X: Wire PR Agent to Skill
- #X: Wire Changelog Agent to Skill
- #X: Wire Automation Agent to Skill

---

### 🚀 Phase 8: Testing & Validation
**Estimated Duration:** 2-3 hours  
**Estimated Effort:** 2-3 hours  
**Target Status:** Ready When Phase 7 Complete  
**Dependencies:** Phase 7 Complete

**Scope:**
- End-to-end testing of all 35 issue types
- Agent behavior validation
- Skill decision tree verification
- Label consistency validation
- Color contrast validation

**Key Tasks:**
- 1. Create test scenarios for all 35 types
- 2. Test each agent with skill integration
- 3. Validate label assignments
- 4. Verify color accessibility (WCAG 2.2 AA)
- 5. Test edge cases and error handling
- 6. Document test results

**Test Coverage:**
- 35 issue type scenarios (1 per type)
- 5 agent integration scenarios
- Label consistency (12+ scenarios)
- Color contrast (all semantic colors)
- Edge cases and error handling

**Output:**
- Comprehensive test report
- Issue type validation matrix
- Agent integration test results
- Label consistency report
- Accessibility report

**Issues to Create:**
- #X: Phase 8 - Testing & Validation
- #X: Test All 35 Issue Types
- #X: Validate Agent Integration
- #X: Label Consistency Testing
- #X: Accessibility Validation

---

## Timeline Summary

| Phase | Duration | Effort | Status | Target Date |
|-------|----------|--------|--------|-------------|
| **1-4** | Complete | ~16-22h | ✅ Merged | 2026-09-03 |
| **5** | 2-3h | 2-3h | 🚀 Ready | 2026-09-04 |
| **6** | 3-4h | 3-4h | ⏳ After Phase 5 | 2026-09-05 |
| **7** | 4-6h | 4-6h | ⏳ After Phase 6 | 2026-09-06 |
| **8** | 2-3h | 2-3h | ⏳ After Phase 7 | 2026-09-07 |
| **TOTAL** | ~14-18h | ~13-20h | In Progress | 2026-09-07 |

---

## Key Metrics

**Consolidation Progress:**
- Before: 35 issue types
- Target: 29 issue types
- Reduction: 6 types (17%)
- Strategy: Conservative (eliminate clear duplicates only)

**Template Status:**
- Total Files: 44 → Target 29
- Duplicates: 19 pairs → Delete 19
- Missing: 10 → Create 10
- Net Change: 44 - 19 + 10 = 35 files needed, consolidated to 29 with dedup

**Label Status:**
- Total Labels: 158 (canonical set)
- Inconsistencies Found: 5-6
- Color Overuse: Blue (10→3), Gray (8→2)
- Redistribution: 8 semantic color categories

**Agent Coverage:**
- Agents to Update: 5
- Skills Created: 1 (Issue Type Allocator)
- Integration Patterns: 5 (one per agent)
- Decision Tree: 1 (comprehensive flowchart)

---

## Critical Path

1. ✅ Phase 1-4: Analysis Complete
2. → **Phase 5: Start here** — Template fixes unblock Phase 6
3. → Phase 6: Label standardization unblocks Phase 7
4. → Phase 7: Agent integration unblocks Phase 8
5. → Phase 8: Final validation & sign-off

**No parallel work possible** — each phase depends on previous completion.

---

## Success Criteria

### Phase 5 Complete When:
- [ ] 19 duplicate template files deleted
- [ ] All templates renumbered 01-29
- [ ] 10 missing templates created
- [ ] All templates have proper frontmatter
- [ ] Template validation passes

### Phase 6 Complete When:
- [ ] All label naming inconsistencies fixed
- [ ] Color semantic mapping applied
- [ ] labeler.yml updated with new colors
- [ ] issue-types.yml updated
- [ ] Label governance validation passes

### Phase 7 Complete When:
- [ ] 5 agent instruction files updated
- [ ] Skill integration tested with each agent
- [ ] Agent behavior matches skill decision tree
- [ ] No regressions in existing agent behavior

### Phase 8 Complete When:
- [ ] All 35 issue types tested
- [ ] Agent integration tests pass
- [ ] Label consistency validated
- [ ] Color contrast meets WCAG 2.2 AA
- [ ] Test report documented

---

## Related Issues

- [#1733](https://github.com/lightspeedwp/.github/issues/1733) — Phase 2: Folder Structure & Linking
- [#1592](https://github.com/lightspeedwp/.github/issues/1592) — Label Prefix Governance Enforcement (related work)

---

## Related Files

**In This Project:**
- `README.md` — Quick start by role
- `PHASE1_ISSUE_TYPE_ANALYSIS.md` — Analysis report
- `IMPLEMENTATION_PLAN.md` — Original 3-phase plan
- `PROJECT_INDEX.md` — Project overview
- `ISSUES_INDEX.md` — GitHub issue tracking

**In .github/reports/:**
- `issue-management/audit-2026-07-23-comprehensive.md` — Full audit findings
- `issue-management/solution-design-2026-07-23.md` — Solution architecture

**In skills/:**
- `issue-type-allocator/SKILL.md` — Issue Type Allocator Skill (570 lines) ✅ Merged PR #2686

---

**Status Last Updated:** 2026-09-03 by Claude (Haiku)  
**Project Owner:** Ash Shaw  
**Next Review Date:** 2026-09-04 (before Phase 5 starts)

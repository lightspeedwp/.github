## Overview

**Phase 3B Primary Issue** — Consolidate overlapping documentation to reduce duplication, establish clear content boundaries, and improve discoverability.

Links to: [DOCUMENTATION_UPDATE_STRATEGY.md - Phase 3B](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/wave-5-documentation-audit/DOCUMENTATION_UPDATE_STRATEGY.md#-phase-3b-content-consolidation-days-5-11)

## Current Status (as of 2026-07-31)

Detailed audit completed (DOCS_AUDIT_2026-07-30.md) identified:

- **3 consolidation areas** with specific opportunities
- **Branch & PR Guidance:** BRANCHING_STRATEGY ↔ PR_CREATION_PROCESS duplication
- **Labeling Guidance:** LABELING ↔ LABEL_STRATEGY ↔ LABEL_COLOR_STRATEGY boundaries
- **Issue Triage:** ISSUE_TRIAGE ↔ ISSUE_TRIAGE_AUTOMATION relationship

## Phase 3B Scope

**Duration:** Days 5-11 of Phase 3  
**Effort:** 35-45 hours  
**Status:** 🔵 Ready to start (awaits Phase 3A completion)

### Consolidation Area 1: Branch & PR Guidance (Days 5-6)

**Files Involved:**

- `docs/BRANCHING_STRATEGY.md` (canonical source)
- `docs/PR_CREATION_PROCESS.md` (contains duplicates)
- `docs/BRANCH_CLEANUP.md` (operational, separate concern)

**Tasks:**

1. [ ] Verify BRANCHING_STRATEGY.md is authoritative source for branch naming
2. [ ] Remove branch naming content from PR_CREATION_PROCESS.md
3. [ ] Add cross-reference: PR_CREATION_PROCESS → BRANCHING_STRATEGY
4. [ ] Add "See also" sections for related guidance
5. [ ] Verify no conflicting procedures between files
6. [ ] Commit with message referencing this issue

**Acceptance Criteria:**

- [ ] No content duplication between files
- [ ] Cross-references verified in preview
- [ ] Clear hierarchy: canonical source + references
- [ ] PR_CREATION_PROCESS reads logically without branch details

### Consolidation Area 2: Labeling Guidance (Days 7-9)

**Files Involved:**

- `docs/LABELING.md` (mechanics & taxonomy)
- `docs/LABEL_STRATEGY.md` (strategic approach)
- `docs/LABEL_COLOR_STRATEGY.md` (color selection)

**Tasks:**

1. [ ] Analyze current content distribution across 3 files
2. [ ] Map sections to categories: mechanics / strategy / colors / implementation
3. [ ] Identify overlaps (if any)
4. [ ] Document clear boundaries or recommend consolidation
5. [ ] If boundaries clear: add cross-reference section
6. [ ] If overlap found: consolidate into primary file with clear section headers
7. [ ] Verify no functional changes to label system
8. [ ] Commit with message referencing this issue

**Acceptance Criteria:**

- [ ] Clear boundaries established between files
- [ ] No duplicated content
- [ ] Cross-references added where appropriate
- [ ] Users can find information without consulting multiple sources
- [ ] Label system functionality unchanged

### Consolidation Area 3: Issue Triage Guidance (Days 10-11)

**Files Involved:**

- `docs/ISSUE_TRIAGE.md` (core procedures)
- `docs/ISSUE_TRIAGE_AUTOMATION.md` (automation for triage)

**Tasks:**

1. [ ] Determine: Does automation extend or replace core procedures?
2. [ ] Map sections to identify relationship
3. [ ] Verify no procedural conflicts
4. [ ] Choose consolidation option:
   - Option A: Keep separate with cross-references
   - Option B: Consolidate into single file with sections
   - Option C: Make automation a subsection of core
5. [ ] Implement chosen option
6. [ ] Create clear navigation between files (if kept separate)
7. [ ] Test navigation paths
8. [ ] Commit with message referencing this issue

**Acceptance Criteria:**

- [ ] Relationship between core and automation clearly documented
- [ ] Reader can follow either without confusion
- [ ] Navigation between files clear (if separate)
- [ ] No conflicting procedures

## Related Issues

**Parent:** This issue  
**Child Issues:** #916, #917, #918 (Specific consolidations)  
**Related to Phase 3B:** Yes  

## Timeline

**Start:** Day 5 of Phase 3 (approx. 2026-08-05)  
**Target Completion:** Day 11 of Phase 3 (approx. 2026-08-11)  
**Deadline:** 2026-08-12  

## Deliverables

1. **Consolidated documentation files** with updated content
2. **Cross-reference sections** added to prevent future duplication
3. **Consolidation decision document** explaining approach for each area
4. **Commit messages** referencing this issue (#904)

## Comments

**Rewrite Note (2026-07-31):** This issue has been rewritten to align with Phase 3B Documentation Update Strategy. Original general audit scope has been replaced with specific consolidation tasks derived from DOCS_AUDIT_2026-07-30.md findings. Three consolidation areas identified, each with detailed analysis and decision tasks. See child issues #916-918 for specific documentation file consolidations.

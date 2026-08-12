---
file_type: "documentation"
title: "GitHub Issues Rewrite Plan — Wave 5 Phase 3 Alignment"
description: "Detailed before/after specifications for rewriting 26+ GitHub issues to align with Phase 3 strategy"
version: "1.0.0"
created_date: "2026-07-31"
last_updated: "2026-07-31"
status: "active"
domain: "governance"
---

# GitHub Issues Rewrite Plan — Wave 5 Phase 3 Alignment

**Purpose:** Align all Wave 5 issues with Phase 3 Documentation Update Strategy  
**Scope:** 26+ issues requiring complete or substantial rewrite  
**Timeline:** 1-2 weeks (batched execution)  
**Effort:** 52-80 hours total  

---

## Overview

All issues created on 2026-06-08 are now outdated. This document specifies exact changes for each issue group, following a standard template format.

---

## Standard Rewrite Template

```markdown
---
## Original Status (2026-06-08)
- **Title:** [Original title]
- **Type:** [Audit/Task/Feature]
- **Status:** [Open/In Progress/Closed]

## New Status (2026-07-31 Rewrite)
- **Title:** [Revised title with Phase context]
- **Type:** [Remains same unless specified]
- **Status:** [Updated based on Phase 3 context]
- **Links to:** DOCUMENTATION_UPDATE_STRATEGY.md Phase X

## Changes Required

### Title Change
**Old:** [Original]  
**New:** [Phase 3-aligned]  
**Rationale:** [Why changed]

### Scope Changes
**Old:** [Original scope]  
**New:** [Phase 3-specific scope]  
**Rationale:** [Based on Phase 3 plan]

### Acceptance Criteria Changes
**Old:**  
- [Original criteria]

**New:**  
- [Phase 3 criteria]

### Timeline Update
**Old:** [General timeline]  
**New:** [Phase 3 specific dates]  
**Effort:** [Updated estimate]

### Related Issues
**Add Links:** [Phase 3-related issues]  
**Remove Links:** [If no longer relevant]

### Comments to Add
[Rewrite rationale and Phase 3 context]
```

---

## REWRITE BATCH 1: Critical Documentation Consolidation (5 issues)

### Issue #904: Documentation Consolidation — CRITICAL REWRITE

**Batch:** 1  
**Priority:** 🔴 CRITICAL  
**Effort:** 4-6 hours  

---

**OLD ISSUE BODY (2026-06-08)**

```
## Overview
Audit current documentation to identify overlapping content, 
gaps in coverage, and consolidation opportunities across 
5 related documentation files in docs/

## Problem
- Multiple files cover similar topics
- Readers must consult multiple docs to get full picture
- Content may diverge between files
- No clear consolidation guidance

## Files in Scope
- Issue creation guidance
- PR creation guidance
- Labeling guidance
- Contribution workflow
- Governance documentation

## Acceptance Criteria
- [ ] Audit identifies all overlapping content
- [ ] Consolidation opportunities documented
- [ ] Recommendations provided for each area
```

---

**NEW ISSUE BODY (2026-07-31 Rewrite)**

```markdown
## Overview

**Phase 3B Primary Issue** — Consolidate overlapping documentation 
to reduce duplication, establish clear content boundaries, and 
improve discoverability.

Links to: [DOCUMENTATION_UPDATE_STRATEGY.md - Phase 3B](./DOCUMENTATION_UPDATE_STRATEGY.md#-phase-3b-content-consolidation-days-5-11)

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

**Rewrite Note (2026-07-31):** This issue has been rewritten to align 
with Phase 3B Documentation Update Strategy. Original general audit 
scope has been replaced with specific consolidation tasks derived from 
DOCS_AUDIT_2026-07-30.md findings. Three consolidation areas identified, 
each with detailed analysis and decision tasks. See child issues #916-918 
for specific documentation file consolidations.
```

---

### Issue #916: Issue Creation Docs Consolidation — CRITICAL REWRITE

**Batch:** 1  
**Priority:** 🔴 CRITICAL  
**Dependency:** #904 (Consolidation investigation)  
**Effort:** 3-4 hours  

---

**OLD ISSUE BODY**

```
## Overview
Consolidate overlapping content in issue creation documentation

## Problem
- ISSUE_CREATION_GUIDE.md and related docs have overlapping content

## Scope
Audit and consolidate issue creation related documentation
```

---

**NEW ISSUE BODY**

```markdown
## Overview

**Phase 3B Task 1** — Consolidate issue-creation-related documentation 
to eliminate duplication between guides. Child of #904 (Documentation Consolidation).

Links to: [DOCUMENTATION_UPDATE_STRATEGY.md - Phase 3B](./DOCUMENTATION_UPDATE_STRATEGY.md#b1-branch--pr-guidance-consolidation)

## Current Status

Audit findings (DOCS_AUDIT_2026-07-30.md) identified overlapping content 
between issue creation guide and issue types documentation.

## Phase 3B Scope

**Part of:** Consolidation Area 1 (Branch & PR Guidance) — NO WAIT, THIS IS WRONG
**Actually Part of:** Consolidation Area that needs analysis (Issue Creation)

**Duration:** 1 day (Days 5-6 of Phase 3)  
**Effort:** 3-4 hours  
**Dependency:** #904 Phase 3B main consolidation decision point  

## Specific Tasks

1. [ ] Compare ISSUE_CREATION_GUIDE.md with ISSUE_TYPES.md
2. [ ] Identify overlapping sections
3. [ ] Determine: Should one reference the other?
4. [ ] Verify field requirements match documentation
5. [ ] Update with cross-references as needed
6. [ ] Verify examples are accurate
7. [ ] Commit with message referencing both #904 and #916

## Acceptance Criteria

- [ ] All overlaps documented
- [ ] Cross-references added (if appropriate)
- [ ] No duplication remains
- [ ] Both files read clearly

## Timeline

**Part of:** Phase 3B (Days 5-11)  
**Target Completion:** 2026-08-06  

## Related Issues

**Parent:** #904 (Documentation Consolidation)  
**Related:** #917 (PR docs), #918 (Labeling docs)  

## Comments

**Rewrite Note (2026-07-31):** Rewritten to be specific Phase 3B task 
under consolidation initiative. Original generic scope replaced with 
specific file pairs to analyze and consolidation decision tasks.
```

---

### Issue #917: PR Creation Docs Consolidation — CRITICAL REWRITE

**Batch:** 1  
**Priority:** 🔴 CRITICAL  
**Effort:** 3-4 hours  

---

**NEW ISSUE BODY**

```markdown
## Overview

**Phase 3B Task 2** — Consolidate PR creation documentation to eliminate 
branch naming duplication. Child of #904 (Documentation Consolidation).

Links to: [DOCUMENTATION_UPDATE_STRATEGY.md - Phase 3B Consolidation Area 1](./DOCUMENTATION_UPDATE_STRATEGY.md#b1-branch--pr-guidance-consolidation)

## Current Status

Audit findings identified branch naming content duplication between 
PR_CREATION_PROCESS.md and BRANCHING_STRATEGY.md.

## Phase 3B Scope

**Part of:** Consolidation Area 1 (Branch & PR Guidance)  
**Duration:** 2 days (Days 5-6 of Phase 3)  
**Effort:** 8-12 hours (includes related branch cleanup)  
**Dependency:** #904  

## Specific Tasks

1. [ ] Verify BRANCHING_STRATEGY.md is authoritative source
2. [ ] Identify branch naming content in PR_CREATION_PROCESS.md
3. [ ] Remove duplicated branch naming sections from PR_CREATION_PROCESS
4. [ ] Add cross-reference section: "See [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) for branch naming rules"
5. [ ] Verify no conflicting procedures
6. [ ] Test PR_CREATION_PROCESS reads clearly with branch details removed
7. [ ] Add "See also" links to BRANCH_CLEANUP.md for operational procedures
8. [ ] Commit with message referencing both #904 and #917

## Acceptance Criteria

- [ ] All branch naming duplication removed from PR_CREATION_PROCESS.md
- [ ] Cross-reference added and verified
- [ ] BRANCHING_STRATEGY remains authoritative source
- [ ] No content loss (redirected, not deleted)
- [ ] File still provides clear PR creation guidance

## Timeline

**Part of:** Phase 3B Consolidation Area 1 (Days 5-6)  
**Start:** 2026-08-05  
**Target Completion:** 2026-08-06  
**Deadline:** 2026-08-07  

## Related Issues

**Parent:** #904 (Documentation Consolidation)  
**Sibling:** #916 (Issue creation), #918 (Labeling)  
**Related:** #906 (File organization)  

## Comments

**Rewrite Note (2026-07-31):** Rewritten as specific Phase 3B 
consolidation task. Added detailed step-by-step tasks based on 
Phase 3 strategy document. Original "consolidate overlapping content" 
now specific: remove branch naming duplication, add cross-references.
```

---

### Issue #918: Labeling Docs Consolidation — CRITICAL REWRITE

**Batch:** 1  
**Priority:** 🔴 CRITICAL  
**Effort:** 6-8 hours  

---

**NEW ISSUE BODY**

```markdown
## Overview

**Phase 3B Task 3** — Consolidate labeling documentation across 3 files 
to establish clear content boundaries. Child of #904 (Documentation Consolidation).

Links to: [DOCUMENTATION_UPDATE_STRATEGY.md - Phase 3B Consolidation Area 2](./DOCUMENTATION_UPDATE_STRATEGY.md#b2-labeling-guidance-consolidation)

## Current Status

Audit identified 3 labeling-related files with potential content overlap:
- LABELING.md (77 matches for "label")
- LABEL_STRATEGY.md (47 matches)
- LABEL_COLOR_STRATEGY.md (detailed)

Current boundaries unclear; consolidation opportunity identified.

## Phase 3B Scope

**Part of:** Consolidation Area 2 (Labeling Guidance)  
**Duration:** 3 days (Days 7-9 of Phase 3)  
**Effort:** 12-18 hours  
**Dependency:** #904  

## Analysis Phase (Day 7)

1. [ ] Read LABELING.md completely; map sections to categories
2. [ ] Read LABEL_STRATEGY.md completely; map sections to categories
3. [ ] Read LABEL_COLOR_STRATEGY.md completely; understand scope
4. [ ] Categories to map: mechanics / strategy / colors / implementation
5. [ ] Create analysis document showing section distribution
6. [ ] Identify overlaps (if any exist)

## Consolidation Decision Phase (Day 8)

7. [ ] Decision point: Are boundaries clear or is consolidation needed?
   - **Option A (Clear Separation):** Keep all three with cross-references
   - **Option B (Overlap Found):** Consolidate related strategies
   - **Option C (Hybrid):** Some consolidation + cross-references
8. [ ] Document decision rationale

## Implementation Phase (Day 9)

### If Option A (Clear Separation):
9. [ ] Verify no content duplication
10. [ ] Add cross-reference sections to each file
11. [ ] Create navigation helpers

### If Option B/C (Consolidation):
9. [ ] Implement chosen consolidation approach
10. [ ] Preserve all information (reorganize, don't delete)
11. [ ] Test navigation between consolidated files

### All Options:
12. [ ] Verify no functional changes to label system
13. [ ] Commit with message referencing both #904 and #918

## Acceptance Criteria

- [ ] Analysis document shows current state (mapping)
- [ ] Consolidation decision made and documented
- [ ] Clear boundaries established between files
- [ ] No duplicated content remains
- [ ] Cross-references added where appropriate
- [ ] Users can find information efficiently
- [ ] Label system functionality unchanged

## Timeline

**Part of:** Phase 3B Consolidation Area 2 (Days 7-9)  
**Start:** 2026-08-07  
**Target Completion:** 2026-08-09  
**Deadline:** 2026-08-10  

## Deliverables

1. **Analysis document** (part of commit or separate file)
2. **Consolidation decision document**
3. **Updated labeling documentation files**
4. **Commit message** referencing #904 and #918

## Related Issues

**Parent:** #904 (Documentation Consolidation)  
**Sibling:** #916 (Issue creation), #917 (PR creation)  
**Related:** #911-914 (Config verification includes label consistency)  

## Comments

**Rewrite Note (2026-07-31):** Rewritten to reflect Phase 3B strategy 
with detailed analysis, decision, and implementation phases. Added 
emphasis on clear consolidation decision point and rationale documentation.
```

---

### Issue #920: Documentation Index — CRITICAL REWRITE

**Batch:** 1  
**Priority:** 🔴 CRITICAL  
**Effort:** 4-6 hours  

---

**NEW ISSUE BODY**

```markdown
## Overview

**Phase 3D Task** — Create comprehensive documentation index and navigation 
to help users find information efficiently in docs/ folder.

Links to: [DOCUMENTATION_UPDATE_STRATEGY.md - Phase 3D](./DOCUMENTATION_UPDATE_STRATEGY.md#-phase-3d-documentation-index--navigation-days-12-16)

## Current Status

As of 2026-07-31, docs/index.md does not exist. Phase 3D calls for 
comprehensive index with topic-based navigation.

## Phase 3D Scope

**Duration:** 5 days (Days 12-16 of Phase 3)  
**Effort:** 20-25 hours  
**Dependency:** #904, #916-918 (consolidation completed first)  
**Status:** 🟡 Ready to start (awaits Phase 3B completion)  

## Index Creation Tasks

### Task 1: Structure & Content (Days 12-13)

1. [ ] Review Phase 3D strategy: index structure and navigation approach
2. [ ] Create docs/index.md with frontmatter
3. [ ] Implement topic-based navigation sections:
   - Repository Governance
   - Contribution Workflow
   - Automation & CI/CD
   - AI & Development
   - Reference & Standards
4. [ ] Add quick navigation shortcuts
5. [ ] Link to canonical sources for each topic

### Task 2: Cross-References (Day 14)

6. [ ] Add "See also" sections linking related documents
7. [ ] Add "Quick start" guides for common tasks
8. [ ] Create topic index with page numbers/links
9. [ ] Verify all links work (use grep to check)

### Task 3: Navigation Headers (Days 14-15)

10. [ ] Add consistent navigation headers to top of docs/*.md files
11. [ ] Include breadcrumb or topic reference
12. [ ] Add "Back to index" links where appropriate
13. [ ] Test navigation paths

### Task 4: Archived Docs Reference (Day 15)

14. [ ] Add reference section: "Archived Documentation"
15. [ ] Link to .github/archived-docs/ folder
16. [ ] Explain why docs are archived
17. [ ] Provide search tips for finding archived content

### Task 5: Testing & Refinement (Day 16)

18. [ ] Test all links in docs/index.md
19. [ ] Test navigation from random doc back to index
20. [ ] Verify structure reads intuitively
21. [ ] Commit with message referencing #920

## Acceptance Criteria

- [ ] docs/index.md created and comprehensive
- [ ] Topic-based navigation clear
- [ ] All links verified working
- [ ] Navigation headers added to files
- [ ] Archived docs clearly linked
- [ ] Users can find any doc from index in <30 seconds

## Timeline

**Part of:** Phase 3D (Days 12-16)  
**Start:** 2026-08-12  
**Target Completion:** 2026-08-16  
**Deadline:** 2026-08-16  

## Deliverables

1. **docs/index.md** — Comprehensive documentation index
2. **Navigation headers** added to all docs
3. **Cross-reference sections** in related files
4. **Updated docs/README.md** (if exists) pointing to index

## Related Issues

**Part of:** #904 (Consolidation) → enables better navigation  
**Related:** Phase 3D initiative overall  

## Comments

**Rewrite Note (2026-07-31):** Rewritten as Phase 3D task with 
detailed sub-tasks spanning 5 days. Original generic "complete & 
current" task now specific: create index, add navigation, verify links.
```

---

## REWRITE BATCH 2: File Organization & Alignment (3 issues)

### Issue #906: File Organization — CLAUDE.md Alignment — HIGH PRIORITY REWRITE

**Batch:** 2  
**Priority:** 🟡 HIGH  
**Effort:** 3-4 hours  

---

**NEW ISSUE BODY**

```markdown
## Overview

**Phase 3A Task 4** — Verify and document file organization alignment with 
CLAUDE.md repository boundaries.

Links to: [DOCUMENTATION_UPDATE_STRATEGY.md - Phase 3A Task A4](./DOCUMENTATION_UPDATE_STRATEGY.md#a4-verify-file-organization-alignment)

## Current Status

CLAUDE.md defines repository boundaries. Phase 3A requires verification that 
actual file organization matches planned structure.

## Phase 3A Scope

**Part of:** Phase 3A Archival & File Organization (Days 1-4)  
**Specific Task:** A4  
**Duration:** 1 day  
**Effort:** 4-5 hours  
**Status:** 🔵 Ready to start  

## Verification Tasks

### Against CLAUDE.md Boundaries

1. [ ] Verify docs/ contains only active, canonical documentation
   - Check: Are archived audits still in docs/? (Should be in .github/archived-docs/)
   - Check: Are audit files still present after Phase 3A archival?
2. [ ] Verify portable reusable content not in .github/
   - Check: agents/ folder location matches CLAUDE.md
   - Check: scripts/ folder location matches CLAUDE.md
   - Check: instructions/ folder location matches CLAUDE.md
3. [ ] Verify agent/script locations match planned structure
   - Check: agents/ vs .github/agents/ alignment
   - Check: scripts/ vs .github/scripts/ alignment
4. [ ] Document any deviations from CLAUDE.md

### Documentation of Findings

5. [ ] Create alignment report document
6. [ ] If deviations found: create migration plan
7. [ ] If no deviations: document compliance

## Acceptance Criteria

- [ ] File organization audit completed
- [ ] All items in CLAUDE.md "Repository Boundaries" section verified
- [ ] Alignment report created (or compliance documentation)
- [ ] Any deviations documented with migration plan
- [ ] Commit message references this issue and CLAUDE.md

## Timeline

**Part of:** Phase 3A (Days 1-4)  
**Target Completion:** 2026-08-03  
**Deadline:** 2026-08-04  

## Related Files

- **Reference:** CLAUDE.md (Repository Boundaries section)
- **Related Issue:** #925 (Current vs Planned Organization)
- **Related Issue:** #926 (Agent & Script Locations)
- **Related Issue:** #927 (File Organization Refactoring)

## Comments

**Rewrite Note (2026-07-31):** Rewritten to align with Phase 3A 
task A4. Specific verification tasks now based on CLAUDE.md boundaries 
section. Added reference to archival completion (Phase 3A tasks A1-A2) 
as prerequisite.
```

---

### Issue #925: Current vs Planned File Organization — HIGH PRIORITY

**Batch:** 2  
**Priority:** 🟡 HIGH  
**Effort:** 3-4 hours  

---

**NEW ISSUE BODY**

```markdown
## Overview

**Phase 3A Child Task** — Document current file organization against 
planned structure from CLAUDE.md.

Links to: [DOCUMENTATION_UPDATE_STRATEGY.md - Phase 3A](./DOCUMENTATION_UPDATE_STRATEGY.md#a4-verify-file-organization-alignment)

## Current Status

CLAUDE.md defines repository structure. This issue documents current 
vs. planned state for Phase 3A verification.

## Specific Tasks

1. [ ] Map current directory structure
2. [ ] Compare against CLAUDE.md planned structure
3. [ ] Document all deviations with rationale
4. [ ] Flag any unclear boundaries

## Acceptance Criteria

- [ ] Current state documented
- [ ] Planned state (from CLAUDE.md) documented
- [ ] Comparison complete
- [ ] Deviations identified and categorized

## Timeline

**Part of:** Phase 3A (Days 1-4)  
**Target Completion:** 2026-08-02  

## Related Issues

**Parent:** #906 (File Organization alignment)  
**Sibling:** #926, #927  

## Comments

**Rewrite Note (2026-07-31):** Simplified to support #906 as parent issue.
```

---

### Issue #927: File Organization Refactoring — Migration Plan

**Batch:** 2  
**Priority:** 🟡 MEDIUM  
**Effort:** 4-6 hours  

---

**NEW ISSUE BODY**

```markdown
## Overview

**Phase 3A Child Task** — Create migration plan if file organization 
changes needed to align with CLAUDE.md.

Links to: [DOCUMENTATION_UPDATE_STRATEGY.md - Phase 3A](./DOCUMENTATION_UPDATE_STRATEGY.md#a4-verify-file-organization-alignment)

## Current Status

Dependent on #925 and #906 findings. If deviations found, migration plan needed.

## Conditional Tasks

**If no deviations found:** Close as "no action needed"  
**If deviations found:**

1. [ ] Document each deviation with current vs. target path
2. [ ] Assess impact of migration
3. [ ] Plan rollback procedures
4. [ ] Create migration steps with testing plan
5. [ ] Estimate effort and timeline

## Acceptance Criteria

- [ ] Migration plan created (or "no changes needed" documented)
- [ ] If migration planned: impact assessment complete
- [ ] If migration planned: rollback procedures documented
- [ ] Recommendations for implementation

## Timeline

**Part of:** Phase 3A (Days 1-4)  
**Dependent on:** #906 and #925 completion  
**Target Completion:** 2026-08-03  

## Related Issues

**Parent:** #906  
**Sibling:** #925, #926  

## Comments

**Rewrite Note (2026-07-31):** Rewritten as conditional task. 
If Phase 3A tasks 1-3 find no issues, this issue closes without 
further action. If issues found, serves as container for migration planning.
```

---

## REWRITE BATCH 3: Accuracy Verification (4 issues)

### Issue #911: Labels Color Consistency — HIGH PRIORITY

**Batch:** 3  
**Priority:** 🟢 HIGH  
**Effort:** 2-3 hours  

---

**NEW ISSUE BODY**

```markdown
## Overview

**Phase 3C Task 1** — Verify label color consistency against actual 
labels.yml configuration. Part of accuracy verification phase.

Links to: [DOCUMENTATION_UPDATE_STRATEGY.md - Phase 3C](./DOCUMENTATION_UPDATE_STRATEGY.md#c2-mergify_strategymd)

## Current Status

Phase 3C calls for accuracy verification of 4 operational documents. 
This issue covers label colors.

## Verification Tasks

1. [ ] Review LABEL_COLOR_STRATEGY.md current documentation
2. [ ] Compare against actual .github/labels.yml
3. [ ] Verify color selection rationale matches implementation
4. [ ] Check for any undocumented colors in configuration
5. [ ] Verify accessibility requirements (light/dark mode)
6. [ ] Update documentation if discrepancies found

## Acceptance Criteria

- [ ] LABEL_COLOR_STRATEGY.md reviewed against labels.yml
- [ ] All colors documented (or documented as auto-generated)
- [ ] Accessibility standards verified
- [ ] Commit message references this issue

## Timeline

**Part of:** Phase 3C (Days 6-10, runs parallel to Phase 3B)  
**Start:** 2026-08-06  
**Target Completion:** 2026-08-07  

## Related Issues

**Part of Phase 3C accuracy verification:** #913, #912, #914  

## Comments

**Rewrite Note (2026-07-31):** Rewritten as Phase 3C verification task.
```

---

### Issue #912: Issue Types Alignment — HIGH PRIORITY

**Batch:** 3  
**Priority:** 🟢 HIGH  
**Effort:** 2-3 hours  

---

**NEW ISSUE BODY**

```markdown
## Overview

**Phase 3C Task 2** — Verify issue types documentation matches 
actual .github/issue-types.yml configuration. Accuracy verification phase.

Links to: [DOCUMENTATION_UPDATE_STRATEGY.md - Phase 3C](./DOCUMENTATION_UPDATE_STRATEGY.md#c3-issue_typesmd)

## Current Status

Phase 3C accuracy verification. ISSUE_TYPES.md must match current 
issue-types.yml.

## Verification Tasks

1. [ ] Review ISSUE_TYPES.md
2. [ ] Compare against .github/issue-types.yml
3. [ ] Verify all issue types documented
4. [ ] Verify field requirements match configuration
5. [ ] Verify template references are current
6. [ ] Check for any new types not documented
7. [ ] Update documentation if discrepancies found

## Acceptance Criteria

- [ ] All issue types in .yml are documented
- [ ] Field requirements match configuration
- [ ] Template references verified
- [ ] Examples accurate
- [ ] No references to removed types

## Timeline

**Part of:** Phase 3C (Days 6-10)  
**Start:** 2026-08-06  
**Target Completion:** 2026-08-07  

## Related Issues

**Part of Phase 3C:** #913, #911, #914  

## Comments

**Rewrite Note (2026-07-31):** Rewritten as Phase 3C verification task.
```

---

### Issue #913: Issue Fields Configuration — HIGH PRIORITY

**Batch:** 3  
**Priority:** 🟢 HIGH  
**Effort:** 2-3 hours  

---

**NEW ISSUE BODY**

```markdown
## Overview

**Phase 3C Task 3** — Verify GitHub issue field configuration against 
documentation. Ensure 50-field limit and custom fields are current.

Links to: [DOCUMENTATION_UPDATE_STRATEGY.md - Phase 3C](./DOCUMENTATION_UPDATE_STRATEGY.md#c4-issue_fieldsmd)

## Current Status

Phase 3C accuracy verification. ISSUE_FIELDS.md must match current 
configuration.

## Verification Tasks

1. [ ] Review ISSUE_FIELDS.md
2. [ ] Verify 50-field limit still accurate (check CLAUDE.md)
3. [ ] Document all custom field types
4. [ ] Verify field constraints match actual limits
5. [ ] Verify examples are accurate and runnable
6. [ ] Check GitHub API documentation for recent changes
7. [ ] Update documentation if needed

## Acceptance Criteria

- [ ] 50-field limit verified as current
- [ ] All custom field types documented
- [ ] Field constraints match GitHub API
- [ ] Examples verified accurate
- [ ] No references to deprecated features
- [ ] API documentation links current

## Timeline

**Part of:** Phase 3C (Days 6-10)  
**Start:** 2026-08-06  
**Target Completion:** 2026-08-07  

## Related Issues

**Part of Phase 3C:** #911, #912, #914  
**Related:** #903 (Canonical configs parent)  

## Comments

**Rewrite Note (2026-07-31):** Rewritten as Phase 3C verification task.
```

---

### Issue #914: Config Interdependencies — HIGH PRIORITY

**Batch:** 3  
**Priority:** 🟢 HIGH  
**Effort:** 3-4 hours  

---

**NEW ISSUE BODY**

```markdown
## Overview

**Phase 3C Task 4** — Document and verify interdependencies between 
canonical configuration files (labels.yml, issue-types.yml, issue-fields.yml).

Links to: [DOCUMENTATION_UPDATE_STRATEGY.md - Phase 3C](./DOCUMENTATION_UPDATE_STRATEGY.md#c1-changelog_automationmd)

## Current Status

Canonical config files have implicit relationships. This task documents 
and verifies them in Phase 3C context.

## Verification Tasks

1. [ ] Document relationships: labels.yml → issue-types.yml
2. [ ] Document relationships: issue-types.yml → issue-fields.yml
3. [ ] Verify label sets referenced in issue types
4. [ ] Verify field constraints consistent across files
5. [ ] Check for any missing or orphaned configuration items
6. [ ] Create interdependency diagram/documentation

## Acceptance Criteria

- [ ] All interdependencies documented
- [ ] Relationships verified correct
- [ ] No orphaned configuration items
- [ ] Diagram or document created showing relationships
- [ ] Commit message references this issue

## Timeline

**Part of:** Phase 3C (Days 6-10)  
**Start:** 2026-08-06  
**Target Completion:** 2026-08-08  

## Related Issues

**Part of Phase 3C:** #911, #912, #913  
**Parent:** #903 (Canonical configs)  

## Comments

**Rewrite Note (2026-07-31):** Rewritten as Phase 3C verification task 
specifically focused on interdependencies.
```

---

## REWRITE BATCH 4: Deferral & Context Updates (Remaining issues)

### Issues #905, #921-924: README & Mermaid Audit — DEFER TO PHASE 4

**Batch:** 4  
**Priority:** 🟡 MEDIUM  
**Action:** Mark as "Phase 4" with status update  
**Effort:** 1-2 hours per issue (status updates only)  

---

**Action for each issue:**

- Update title to include "[Phase 4 Deferred]"
- Add comment: "Rewritten 2026-07-31 to mark as Phase 4 work. README and Mermaid audit deferred until after Phase 3 completion. Will be executed as Phase 4 initiative."
- Add label: "phase-4"
- Keep other content for reference

---

### Issues #902, #903: Templates & Configs — REPRIORITIZE

**Batch:** 4  
**Priority:** 🟢 MEDIUM  
**Action:** Status update with Phase 3 context  
**Effort:** 1 hour per issue  

---

**Action for each issue:**

- Add comment: "Rewritten 2026-07-31 to align with Phase 3 strategy. Primary Phase 3 focus is documentation consolidation, archival, and accuracy verification. Templates and configs automation will be addressed after Phase 3 completion."
- Link to Phase 3 strategy
- Update status as needed

---

### Issues #907-910, #925, #926: Audits & Analysis — COMPLETION UPDATE

**Batch:** 4  
**Priority:** 🟡 MEDIUM  
**Action:** Mark completed or update with findings  
**Effort:** 1-2 hours per issue  

---

**Action for each issue:**

- Review if audit already completed
- If completed: Mark closed with findings summary
- If not completed: Update scope to align with Phase 3 context
- Add links to related Phase 3 issues

---

## Execution Schedule

### Week 1 (2026-08-04 to 2026-08-08)

**Monday 8/4:** Batches 1-2 Planning

- [ ] Review this plan with team
- [ ] Get approval to proceed
- [ ] Create GitHub project for tracking rewrites

**Tuesday-Wednesday 8/5-8/6:** Batch 1 Execution (5 critical issues)

- [ ] Rewrite #904 (Documentation Consolidation)
- [ ] Rewrite #916 (Issue Creation Docs)
- [ ] Rewrite #917 (PR Creation Docs)
- [ ] Rewrite #918 (Labeling Docs)
- [ ] Rewrite #920 (Documentation Index)

**Thursday 8/7:** Batch 1 Review & Batch 2 Start

- [ ] Review Batch 1 for accuracy
- [ ] Verify cross-references
- [ ] Start Batch 2 (File Organization)

**Friday 8/8:** Batch 2 & 3 Continuation

- [ ] Complete #906, #925, #927 (File organization)
- [ ] Complete #911-914 (Accuracy verification)
- [ ] Verify all GitHub links

### Week 2 (2026-08-11 to 2026-08-15)

**Monday 8/11:** Batch 4 & Final Reviews

- [ ] Complete Batch 4 (Deferral & context updates)
- [ ] Review all rewrites for consistency
- [ ] Verify cross-references across all issues

**Tuesday 8/12:** Documentation & Cleanup

- [ ] Create final status document
- [ ] Archive old issue seeds
- [ ] Update project INDEX.md
- [ ] Prepare commit for GitHub

**Wednesday 8/13:** Verification & Testing

- [ ] Test all GitHub issue links
- [ ] Verify issue relationships and dependencies
- [ ] Check milestone assignments

**Thursday-Friday 8/14-8/15:** Buffer & Adjustments

- [ ] Address any discovered issues
- [ ] Fine-tune issue descriptions
- [ ] Finalize Phase 3 preparation

---

## Success Metrics

**By 2026-08-15:**

- ✅ 26+ issues rewritten to align with Phase 3
- ✅ All Phase 3A-3E issues have detailed tasks and deadlines
- ✅ Cross-references verified between all related issues
- ✅ Batch 4 issues (Phase 4 & lower priority) properly categorized
- ✅ Project INDEX.md updated with new issue status
- ✅ All issues ready for Phase 3 execution starting 2026-08-01

---

*Plan Created: 2026-07-31*  
*Execution Start: 2026-08-04*  
*Target Completion: 2026-08-15*  
*Phase 3 Execution Start: 2026-08-01*

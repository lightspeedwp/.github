---
file_type: "documentation"
title: "Documentation Update Strategy — Wave 5 Consolidated Plan"
description: "Comprehensive multi-phase strategy for documentation audit, consolidation, archival, and accuracy updates"
version: "1.0.0"
created_date: "2026-07-31"
last_updated: "2026-07-31"
status: "active"
domain: "governance"
owner: "LightSpeed Team"
maintainer: "Documentation Audit Initiative"
---

# Documentation Update Strategy — Wave 5 Consolidated Plan

**Effective Date:** 2026-07-31  
**Project:** Wave 5 Documentation Audit ([Active Project](./))  
**Scope:** 63 files in `docs/` + file organization audit  
**Timeline:** 3-4 weeks (parallel execution)  
**Effort Estimate:** 120-150 hours  

---

## Executive Summary

This strategy consolidates findings from Wave 5 audits and provides a phased approach to:

1. **Archive completed audit/remediation reports** (4 files)
2. **Consolidate overlapping documentation** (3 content groups)
3. **Verify accuracy** of key operational documents (4 files)
4. **Update Wave 5 project structure** with Phase 3 execution plan

The strategy balances immediate cleanup wins with longer-term documentation quality improvements.

---

## Phase Overview

| Phase | Focus | Duration | Effort | Status |
|-------|-------|----------|--------|--------|
| **Phase 3A** | Archival & File Organization | 3-4 days | 15-20h | 🔵 Ready to start |
| **Phase 3B** | Content Consolidation | 5-7 days | 35-45h | 🔵 Dependent on 3A |
| **Phase 3C** | Accuracy Verification | 4-5 days | 30-40h | 🔵 Can run parallel |
| **Phase 3D** | Documentation Index & Navigation | 3-5 days | 20-25h | 🟡 Follows other phases |
| **Phase 3E** | Project Closure & Recommendations | 2-3 days | 10-15h | 🟡 Final phase |

---

## 🔵 PHASE 3A: Archival & File Organization (Days 1-4)

### Goals

- Remove audit/remediation reports from main `docs/` folder
- Create structured archive directory
- Align file organization with CLAUDE.md boundaries
- Reduce main docs folder clutter

### Deliverables

#### A1: Create Archive Directory Structure

**Duration:** 0.5 day | **Effort:** 2-3 hours

```
.github/archived-docs/
├── README.md                           # Index of archived docs
├── audits/
│   ├── AUDIT_PR_DOCS_663.md           # Issue #663 findings
│   ├── FOOTER_VALIDATION_AUDIT.md     # Footer system audit
│   ├── GITIGNORE_AUDIT.md             # .gitignore verification
│   └── audit-index.md                 # Meta-index of all audits
├── remediation/
│   ├── FOOTER_REMEDIATION_GUIDE.md    # Footer fix procedures
│   └── remediation-index.md           # Index of remediation docs
└── migrations/
    └── (future migrations go here)
```

**Actions:**

1. Create directories: `mkdir -p .github/archived-docs/{audits,remediation,migrations}`
2. Create `README.md` with overview of archived docs
3. Create audit-index.md and remediation-index.md

**Acceptance Criteria:**

- [ ] Directory structure exists and is documented
- [ ] Each archive subdirectory has an index file
- [ ] README explains purpose and navigation

---

#### A2: Move & Archive Audit/Remediation Files

**Duration:** 0.5 day | **Effort:** 3-4 hours

**Files to Move:**

1. `docs/AUDIT_PR_DOCS_663.md` → `.github/archived-docs/audits/`
2. `docs/FOOTER_REMEDIATION_GUIDE.md` → `.github/archived-docs/remediation/`
3. `docs/FOOTER_VALIDATION_AUDIT.md` → `.github/archived-docs/audits/`
4. `docs/GITIGNORE_AUDIT.md` → `.github/archived-docs/audits/`

**Actions:**

```bash
# Create commits for each logical group
git mv docs/AUDIT_PR_DOCS_663.md .github/archived-docs/audits/
git mv docs/FOOTER_REMEDIATION_GUIDE.md .github/archived-docs/remediation/
git mv docs/FOOTER_VALIDATION_AUDIT.md .github/archived-docs/audits/
git mv docs/GITIGNORE_AUDIT.md .github/archived-docs/audits/

# Commit archival
git commit -m "chore(docs): archive completed audits to .github/archived-docs/

Move audit and remediation reports from active docs/ to archived-docs/
to keep main documentation folder focused on canonical, actively-maintained
documentation. Ensures audit findings remain accessible while reducing
main folder clutter.

Files archived:
- AUDIT_PR_DOCS_663.md (issue #663 findings)
- FOOTER_REMEDIATION_GUIDE.md (completed May 2026)
- FOOTER_VALIDATION_AUDIT.md (completed July 24)
- GITIGNORE_AUDIT.md (verification audit, July 24)"
```

**Acceptance Criteria:**

- [ ] All 4 files moved successfully
- [ ] Git history preserved (used `git mv`)
- [ ] Commit message documents archival rationale
- [ ] Files accessible at new location

---

#### A3: Update Cross-References

**Duration:** 0.5 day | **Effort:** 2-3 hours

**Actions:**

1. Search for references to archived files:

   ```bash
   grep -r "AUDIT_PR_DOCS_663\|FOOTER_REMEDIATION\|FOOTER_VALIDATION_AUDIT\|GITIGNORE_AUDIT" \
     --include="*.md" . --exclude-dir=.git
   ```

2. Update references in active docs to point to `.github/archived-docs/`
3. Add context note: "See archived findings at `.github/archived-docs/audits/`"

**Acceptance Criteria:**

- [ ] All references found and documented
- [ ] Cross-references updated or flagged for review
- [ ] No broken links remain

---

#### A4: Verify File Organization Alignment

**Duration:** 1 day | **Effort:** 4-5 hours

**Against CLAUDE.md boundaries:**

- Verify `docs/` contains only active, canonical documentation
- Verify portable reusable content not in `.github/` (should be in root folders)
- Verify agent/script locations match planned structure
- Document any deviations from CLAUDE.md

**Related:** Wave 5 Issue #906 (File Organization Audit)

**Acceptance Criteria:**

- [ ] File organization audit completed (Issue #906)
- [ ] Alignment report created
- [ ] Migration plan (if needed) documented

---

### Commit Summary for Phase 3A

```
chore(docs): archive completed audits and align file organization

Phase 3A completion: Archive audit/remediation reports and ensure
file organization aligns with CLAUDE.md repository boundaries.

Archival:
- Move 4 completed audits → .github/archived-docs/
- Create archive structure with indices
- Update cross-references in active docs

Alignment:
- Verify docs/ contains only canonical documentation
- Check file organization against CLAUDE.md boundaries
- Document any deviations and migration needs
```

---

## 🟡 PHASE 3B: Content Consolidation (Days 5-11)

### Goals

- Reduce documentation overlap and duplication
- Establish clear content boundaries between related files
- Create cross-references to prevent future duplication
- Maintain clear distinction between guidance levels

### Consolidation Areas

#### B1: Branch & PR Guidance Consolidation

**Duration:** 2 days | **Effort:** 8-12 hours

**Files Involved:**

- `docs/BRANCHING_STRATEGY.md` (canonical source: 6 branch-naming matches)
- `docs/PR_CREATION_PROCESS.md` (1 branch-naming match)
- `docs/BRANCH_CLEANUP.md` (separate concern: operational procedures)

**Current State:**

- BRANCHING_STRATEGY.md covers all branch naming rules
- PR_CREATION_PROCESS.md duplicates some branch naming content
- BRANCH_CLEANUP.md handles stale branch removal (operational, not guidance)

**Consolidation Plan:**

1. Keep BRANCHING_STRATEGY.md as single source of truth for branch naming
2. Update PR_CREATION_PROCESS.md to cross-reference with "See also" notes
3. Remove branch naming duplicates from PR_CREATION_PROCESS.md
4. Keep BRANCH_CLEANUP.md separate (operational procedures, not contributor guidance)

**Specific Changes:**

- [ ] In PR_CREATION_PROCESS.md, replace "Branch Naming" section with:

  ```markdown
  ### Branch Naming
  
  All branches must follow the naming convention defined in [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md#branch-naming-convention).
  
  Quick reference: `{type}/{scope}-{short-title}` (lowercase, kebab-case)
  
  See BRANCHING_STRATEGY.md for:
  - Full list of allowed prefixes (feat/, fix/, docs/, etc.)
  - Branch naming rules and constraints
  - Branch reuse prevention policy
  - Commit message format requirements
  ```

- [ ] Remove redundant branch naming details from PR_CREATION_PROCESS.md
- [ ] Add "See Also" section linking to BRANCHING_STRATEGY.md and BRANCH_CLEANUP.md

**Acceptance Criteria:**

- [ ] No content duplication between files
- [ ] Cross-references added and verified
- [ ] Clear distinction between guidance (BRANCHING_STRATEGY) and operations (BRANCH_CLEANUP)
- [ ] PR_CREATION_PROCESS reads clearly without branch naming details

---

#### B2: Labeling Guidance Consolidation

**Duration:** 3 days | **Effort:** 12-18 hours

**Files Involved:**

- `docs/LABELING.md` (77 label-related matches — mechanics & taxonomy)
- `docs/LABEL_STRATEGY.md` (47 label matches — strategic approach)
- `docs/LABEL_COLOR_STRATEGY.md` (detailed — color selection)

**Current State:**

- Unclear boundaries between mechanics, strategy, and color selection
- Potential for content overlap
- Users may find multiple sources for same information

**Analysis Task (1 day):**

1. Read each file completely
2. Map content sections to categories: mechanics / strategy / colors / implementation
3. Identify overlaps
4. Verify clear separation or recommend consolidation

**Consolidation Decision Matrix:**

- **If clear separation exists:** Keep all three, add cross-references
- **If overlap found:** Consolidate into primary file with clear section headers
- **If redundant:** Recommend merger into parent file

**Likely Approach (to confirm):**

- **LABELING.md** → Mechanics & taxonomy (what labels exist, how to use them)
- **LABEL_STRATEGY.md** → Strategic approach (when to label, best practices, policy)
- **LABEL_COLOR_STRATEGY.md** → Color system (color selection rationale, accessibility)

**Actions:**

- [ ] Complete analysis of overlap
- [ ] Create consolidation recommendation document
- [ ] Implement consolidation or add cross-reference section
- [ ] Verify no functional changes to label system

**Acceptance Criteria:**

- [ ] Clear boundaries established between files
- [ ] No duplicated content
- [ ] Cross-references added where appropriate
- [ ] Users can find information without consulting multiple sources

---

#### B3: Issue Triage Documentation Consolidation

**Duration:** 2 days | **Effort:** 8-12 hours

**Files Involved:**

- `docs/ISSUE_TRIAGE.md` (483 lines — core triage procedures)
- `docs/ISSUE_TRIAGE_AUTOMATION.md` (465 lines — automation for triage)

**Current State:**

- Unclear relationship between core procedures and automation
- Potential for readers to consult both when one would suffice
- Unclear if automation replaces or extends core procedures

**Analysis Task (0.5 day):**

1. Determine: Does automation extend core procedures or replace them?
2. Map sections to identify relationship
3. Verify no procedural conflicts

**Consolidation Options:**

- **Option A (Extension):** Keep separate, add "See also" cross-reference
- **Option B (Replacement):** Consolidate into single file with clear sections
- **Option C (Hierarchy):** Automation becomes subsection of core procedures

**Implementation:**

1. Complete analysis and choose option
2. Create section structure that clarifies relationship
3. Add navigation helpers (TOC, cross-references)
4. Test navigation paths (reader should not need to jump between files)

**Acceptance Criteria:**

- [ ] Relationship between core and automation clearly documented
- [ ] Reader can follow either procedures without confusion
- [ ] Navigation between files clear (if kept separate)
- [ ] No conflicting procedures between files

---

### Commit Summary for Phase 3B

```
refactor(docs): consolidate overlapping documentation

Phase 3B completion: Eliminate documentation duplication and establish
clear content boundaries across related topics.

Branch & PR Guidance:
- BRANCHING_STRATEGY as canonical source for branch naming
- PR_CREATION_PROCESS cross-references to avoid duplication
- BRANCH_CLEANUP remains separate (operational procedures)

Labeling Guidance:
- [Analysis result]: Clear boundaries between LABELING, LABEL_STRATEGY, LABEL_COLOR_STRATEGY
- Cross-references added between related files
- [Consolidation action if needed]

Issue Triage:
- [Analysis result]: ISSUE_TRIAGE_AUTOMATION [extends/replaces] core procedures
- [Consolidation action if needed]
- Navigation clarified between files
```

---

## 🟡 PHASE 3C: Accuracy Verification (Days 6-10, runs parallel to 3B)

### Goals

- Verify that operational documents match actual repository state
- Identify outdated content
- Update stale examples and references
- Flag any functionality gaps

### Files Requiring Verification

#### C1: CHANGELOG_AUTOMATION.md

**Duration:** 1 day | **Effort:** 4-6 hours

**Verification Tasks:**

1. Compare documentation with actual workflow: `.github/workflows/changelog-management.yml`
2. Verify automation rules match documented behavior
3. Verify Git message format matches documentation
4. Verify release cycle coverage is complete
5. Check for any undocumented features or changes

**Checklist:**

- [ ] Automation rules in doc match workflow steps
- [ ] Git message format in doc is current
- [ ] Examples are accurate and runnable
- [ ] Release cycle process matches documentation
- [ ] Any recent changes are documented
- [ ] No references to removed features

**Output:** Updated file or findings document

---

#### C2: MERGIFY_STRATEGY.md

**Duration:** 1 day | **Effort:** 4-6 hours

**Verification Tasks:**

1. Compare documentation with actual: `.github/mergify.yml`
2. Verify auto-merge rules match documentation
3. Verify branch patterns match documentation
4. Verify approval requirements are current
5. Check for any new rules not documented

**Checklist:**

- [ ] All auto-merge rules documented
- [ ] Branch patterns match actual patterns
- [ ] Approval requirements are current
- [ ] Examples match actual behavior
- [ ] No references to removed rules
- [ ] New rules (if any) are documented

**Output:** Updated file or findings document

---

#### C3: ISSUE_TYPES.md

**Duration:** 1 day | **Effort:** 4-6 hours

**Verification Tasks:**

1. Compare documentation with: `.github/issue-types.yml`
2. Verify all issue types documented
3. Verify field requirements match actual config
4. Verify template alignment is current
5. Check for any new issue types

**Checklist:**

- [ ] All issue types in .yml are documented
- [ ] Field requirements match config
- [ ] Template references are correct
- [ ] Examples are accurate
- [ ] No references to removed types
- [ ] New types (if any) are documented

**Output:** Updated file or findings document

---

#### C4: ISSUE_FIELDS.md

**Duration:** 1 day | **Effort:** 4-6 hours

**Verification Tasks:**

1. Verify 50-field limit is still accurate (check CLAUDE.md)
2. Verify custom field types are documented
3. Verify field constraints are current
4. Verify examples are accurate
5. Check GitHub API documentation for changes

**Checklist:**

- [ ] Field limit (50) verified as current
- [ ] All custom field types documented
- [ ] Field constraints match actual limits
- [ ] Examples are runnable/accurate
- [ ] No references to deprecated features
- [ ] References to GitHub API are current

**Output:** Updated file or findings document

---

### Commit Summary for Phase 3C

```
docs: verify accuracy of operational documentation

Phase 3C completion: Audit and update operational documents to match
current repository state.

Changes:
- CHANGELOG_AUTOMATION.md: Updated workflow references [if needed]
- MERGIFY_STRATEGY.md: Verified against mergify.yml [if needed]
- ISSUE_TYPES.md: Aligned with issue-types.yml [if needed]
- ISSUE_FIELDS.md: Verified field limits and constraints [if needed]

All files now accurately reflect current repository state.
```

---

## 🟡 PHASE 3D: Documentation Index & Navigation (Days 12-16)

### Goals

- Create comprehensive index of all documentation
- Establish clear navigation paths
- Help users find information efficiently
- Document documentation structure

### Deliverables

#### D1: Update docs/README.md (if exists) or create docs/index.md

**Duration:** 1 day | **Effort:** 4-6 hours

**Content:**

- Overview of documentation structure
- Navigation by topic area
- Links to canonical sources
- Quick-start guide for finding specific information
- Archive reference

**Structure:**

```markdown
# Documentation Index

## Quick Navigation
- [Contributing](./CONTRIBUTING.md) or links to PR_CREATION_PROCESS
- [Branching Strategy](./BRANCHING_STRATEGY.md)
- [Issue Management](./ISSUE_CREATION_GUIDE.md)
- [Labeling System](./LABELING.md)
- [GitHub Workflows](./WORKFLOWS_STANDARDS.md)

## By Topic Area
### Repository Governance
- BRANCHING_STRATEGY.md
- PR_CREATION_PROCESS.md
- ...

### Automation & Workflows
- CHANGELOG_AUTOMATION.md
- MERGIFY_STRATEGY.md
- ...

### AI & Development
- AGENT_CREATION.md
- PLUGINS_STANDARDS.md
- ...

## Archived Documentation
- [See .github/archived-docs/](../.github/archived-docs/) for completed audits
```

---

#### D2: Add Navigation Headers to docs/

**Duration:** 1 day | **Effort:** 3-5 hours

Add consistent navigation to top of each doc file:

```markdown
---
[frontmatter]
---

# Document Title

[Navigation breadcrumb/TOC]

[Document content]
```

---

### Commit Summary for Phase 3D

```
docs: add comprehensive index and navigation

Phase 3D completion: Create index and navigation to help users
find information in documentation structure.

Changes:
- Create/update docs/index.md with topic-based navigation
- Add navigation headers to documentation files
- Link to archived documentation
```

---

## 🟡 PHASE 3E: Project Closure & Recommendations (Days 17-19)

### Goals

- Document findings and outcomes
- Update Wave 5 project status
- Create recommendations for ongoing maintenance
- Close related GitHub issues

### Deliverables

#### E1: Consolidation & Archival Report

**Duration:** 1 day | **Effort:** 4-6 hours

Document:

- Files consolidated
- Files archived
- Content boundaries established
- Cross-references added
- Accuracy updates completed

#### E2: Recommendations for Ongoing Maintenance

**Duration:** 1 day | **Effort:** 4-6 hours

Create operational guidelines:

- Documentation review schedule (quarterly)
- When to archive vs. update
- Consolidation prevention practices
- Accuracy verification process
- New documentation checklist

#### E3: Update Wave 5 Project Status

**Duration:** 0.5 day | **Effort:** 2-3 hours

Update:

- Phase 3 completion status
- Close relevant GitHub issues
- Archive phase documentation
- Link to final reports
- Mark project "Ready for Phase 4" or closure

---

### Commit Summary for Phase 3E

```
docs(wave-5): complete documentation audit and consolidation

Phase 3E completion: Project closure and recommendations.

Summary:
- Archived 4 completed audit/remediation reports
- Consolidated 3 documentation topic areas
- Verified accuracy of 4 operational documents
- Created comprehensive documentation index
- Established clear content boundaries
- Added cross-references to prevent future duplication

Results:
- docs/ folder focused on active, canonical documentation
- 47% reduction in documentation volume (removed audits)
- Clear content boundaries established
- Improved discoverability through index and navigation
- Operational documents verified accurate as of 2026-07-31

See DOCUMENTATION_UPDATE_STRATEGY.md for details.
Closes Wave 5 documentation audit Phase 3.
```

---

## Timeline & Dependencies

```
Phase 3A (Days 1-4)      ███░░░░░░░░░░░░░░░░ 4 days
Phase 3B (Days 5-11)     ░░░████████░░░░░░░░ 7 days (depends on 3A)
Phase 3C (Days 6-10)     ░░░░░████░░░░░░░░░░ 5 days (parallel to 3B)
Phase 3D (Days 12-16)    ░░░░░░░░░░░████░░░░ 5 days (after 3B, 3C)
Phase 3E (Days 17-19)    ░░░░░░░░░░░░░░░░███ 3 days (final)

Estimated Total: 19 working days (~4 weeks, assuming weekends)
```

---

## Resource Requirements

### Tools & Access

- GitHub (to move files, update issues)
- Git (for commits)
- Text editor (for documentation updates)
- Grep/search tools (for finding references)

### Roles

- **Project Lead:** Oversee all phases, make consolidation decisions
- **Documentation Reviewers:** Verify accuracy (Phase C)
- **Content Consolidation:** Analyze overlaps (Phase B)
- **Git Manager:** Handle file moves and commits

---

## Success Metrics

### Phase 3A

- ✅ 4 files successfully archived
- ✅ Archive directory structure created
- ✅ Cross-references updated
- ✅ File organization verified

### Phase 3B

- ✅ 3 consolidation decisions made
- ✅ Cross-references added
- ✅ Content boundaries documented
- ✅ No duplication remaining

### Phase 3C

- ✅ 4 documents verified accurate
- ✅ Outdated content updated
- ✅ All references current
- ✅ Examples verified

### Phase 3D

- ✅ Index created and comprehensive
- ✅ Navigation clear and intuitive
- ✅ Users can find information efficiently
- ✅ Archived docs clearly linked

### Phase 3E

- ✅ Project closure documented
- ✅ Recommendations captured
- ✅ Issues closed or transitioned
- ✅ Phase 4 readiness assessed

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Content loss during moves | Low | High | Use `git mv`, verify commits |
| Broken cross-references | Medium | Medium | Automated link check before commit |
| Consolidation creates confusion | Medium | High | Add transition notes, cross-references |
| Outdated content not updated | Low | Medium | Checklist-based verification |
| Scope creep | Medium | Medium | Stick to Phase 3 scope, defer Phase 4 to later |

---

## Next Steps

1. **Immediate (This Week):**
   - [ ] Review this strategy with team
   - [ ] Approve Phase 3A scope
   - [ ] Assign Phase 3A tasks
   - [ ] Create issue tracking for phases

2. **Phase 3A (Next Week):**
   - [ ] Execute archival
   - [ ] Create archive structure
   - [ ] Update cross-references

3. **Parallel (Weeks 2-3):**
   - [ ] Phases 3B and 3C in parallel
   - [ ] Daily standups on consolidation decisions
   - [ ] Accuracy verification updates

4. **Final (Week 4):**
   - [ ] Phase 3D index creation
   - [ ] Phase 3E project closure
   - [ ] Issue cleanup and status update

---

## Related Issues & Documents

**Wave 5 Audit Issues:**

- #902 - Issue Templates & Automation
- #903 - Canonical Configs
- #904 - Documentation Consolidation ← **Primary**
- #905 - README & Mermaid Audit
- #906 - File Organization Audit

**Related Documentation:**

- CLAUDE.md (repository boundaries)
- .github/projects/active/wave-5-documentation-audit/ (project folder)
- .github/archived-docs/audits/DOCS_AUDIT_2026-07-30.md (detailed findings)

---

*Strategy Created: 2026-07-31*  
*Target Start: 2026-08-01*  
*Target Completion: 2026-08-21*

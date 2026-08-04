---
file_type: "documentation"
title: "Wave 5 Documentation Audit — Project Audit Report"
description: "Comprehensive audit of Wave 5 project structure, documentation, GitHub issues, and rewrite recommendations"
version: "1.0.0"
created_date: "2026-07-31"
last_updated: "2026-07-31"
status: "active"
domain: "governance"
---

# Wave 5 Documentation Audit — Project Audit Report

**Audit Date:** 2026-07-31  
**Scope:** Wave 5 Documentation Audit project folder + 42 GitHub issues  
**Current Status:** Significantly outdated (created ~2 months ago, last updated 2026-06-08)  
**Recommendation:** Complete rewrite of issue suite with current documentation state

---

## Executive Summary

The Wave 5 Documentation Audit project was created on 2026-05-31 with 5 parent issues and 20 child issues (25 total). However:

- **Only 2 of 5 parent issue files** are currently stored locally
- **Missing 3 parent issue files** (01, 02, 04) in the active folder
- **Issues are severely outdated** — created 2 months ago with no recent updates
- **Documentation landscape has changed significantly** since June 2026:
  - Phase 3 strategy now defined (archival, consolidation, verification, index, closure)
  - New audit findings identify specific consolidation opportunities
  - File organization audit (#906) needs reframing with CLAUDE.md alignment
  - No README/Mermaid/A11y audit (#905) status documented locally

**Action Required:** Complete rewrite of all 25-42 issues to reflect current state

---

## Issue Status Audit

### Parent Issues (5 Total)

#### ✅ #902: Issue Templates, Automation, & AI Agent Integration

- **Status:** Seed file exists in `execution/issue-seed-2026-06-08/bodies/parents/`
- **Current Relevance:** Medium (automation aspect ongoing, but focus shifted)
- **Last Updated:** 2026-06-08 (seed file)
- **Rewrite Level:** 🔴 HIGH — automation not primary focus of Phase 3
- **Recommendation:** Keep for completeness, but reprioritize after Phase 3 completion

#### ✅ #903: Canonical Config Files (labels, issue-types, issue-fields)

- **Status:** Seed file exists in `execution/issue-seed-2026-06-08/bodies/parents/`
- **Current Relevance:** Medium (configs stable, but verification needed)
- **Last Updated:** 2026-06-08 (seed file)
- **Rewrite Level:** 🟡 MEDIUM — Phase 3C covers accuracy verification of these areas
- **Recommendation:** Rewrite to align with Phase 3C accuracy verification tasks

#### ✅ #904: Documentation Consolidation - Reduce Duplication Across Docs

- **Status:** File exists: `parents/03-documentation-consolidation-audit.md`
- **Current Relevance:** **🟢 HIGH** — This is the primary focus of Phase 3B
- **Last Updated:** 2026-06-01 (local file)
- **Rewrite Level:** 🔴 CRITICAL — Needs complete rewrite with Phase 3B consolidation plan
- **Recommendation:** Rewrite with detailed consolidation strategy from DOCUMENTATION_UPDATE_STRATEGY.md

#### ✅ #905: README Files - Mermaid Diagrams & Accessibility Review

- **Status:** Seed file exists in `execution/issue-seed-2026-06-08/bodies/parents/`
- **Current Relevance:** Low (not addressed in Phase 3, deferred)
- **Last Updated:** 2026-06-08 (seed file)
- **Rewrite Level:** 🟡 MEDIUM — Needs status update (deferred to Phase 4)
- **Recommendation:** Rewrite to document deferral to future phase, link to Phase 3 strategy

#### ✅ #906: File Organization - Align with CLAUDE.md Repository Boundaries

- **Status:** File exists: `parents/05-file-organization-audit.md`
- **Current Relevance:** **🟢 HIGH** — This is Phase 3A component
- **Last Updated:** 2026-07-30 (local file, recently updated)
- **Rewrite Level:** 🟡 MEDIUM — Needs integration with Phase 3A and current CLAUDE.md
- **Recommendation:** Rewrite with specific CLAUDE.md alignment tasks and Phase 3A timeline

---

### Child Issues (20 Total)

#### Group 1: Issue Templates & Automation (#907-910)

| Issue | Title | Status | Last Updated | Rewrite Level |
|-------|-------|--------|--------------|--------|
| #907 | Issue Template Inventory | Local file | 2026-06-01 | 🟡 Medium |
| #908 | Template → Automation Mapping | Local file | 2026-06-01 | 🟡 Medium |
| #909 | Labeling Rules in labeler.yml | Local file | 2026-06-01 | 🟡 Medium |
| #910 | AI Agent Instructions | Local file | 2026-06-01 | 🟡 Medium |

**Assessment:** Completed audits (mostly), but outcomes not reflected in current state. Automation focus shifted to Phase 3. **Action:** Update with Phase 3 prioritization and completion status.

#### Group 2: Canonical Configs (#911-914)

| Issue | Title | Status | Last Updated | Rewrite Level |
|-------|-------|--------|--------------|--------|
| #911 | Labels Colour Consistency | Seed only | 2026-06-08 | 🟢 High |
| #912 | Issue Types Alignment | Seed only | 2026-06-08 | 🟢 High |
| #913 | Issue Fields Configuration | Local file | 2026-06-01 | 🟢 High |
| #914 | Config Interdependencies | Seed only | 2026-06-08 | 🟢 High |

**Assessment:** Critical for Phase 3C accuracy verification. **Action:** Rewrite with Phase 3C task structure and deadlines.

#### Group 3: Documentation Consolidation (#916-920)

| Issue | Title | Status | Last Updated | Rewrite Level |
|-------|-------|--------|--------------|--------|
| #916 | Issue Creation Docs | Seed only | 2026-06-08 | 🔴 Critical |
| #917 | PR Creation Docs | Seed only | 2026-06-08 | 🔴 Critical |
| #918 | Labeling Docs | Seed only | 2026-06-08 | 🔴 Critical |
| #919 | Documentation Folder Structure | Seed only | 2026-06-08 | 🔴 Critical |
| #920 | Documentation Index | Seed only | 2026-06-08 | 🔴 Critical |

**Assessment:** **PRIMARY FOCUS OF PHASE 3B**. These issues are completely outdated. **Action:** Complete rewrite with specific consolidation recommendations from DOCS_AUDIT_2026-07-30.md and Phase 3B plan.

#### Group 4: README & Mermaid (#921-924)

| Issue | Title | Status | Last Updated | Rewrite Level |
|-------|-------|--------|--------------|--------|
| #921 | Discover README Files | Seed only | 2026-06-08 | 🟡 Medium |
| #922 | Validate Mermaid Syntax | Seed only | 2026-06-08 | 🟡 Medium |
| #923 | Mermaid Accessibility (A11y) | Seed only | 2026-06-08 | 🟡 Medium |
| #924 | Fix & Refresh READMEs | Seed only | 2026-06-08 | 🟡 Medium |

**Assessment:** Deferred (not in Phase 3). **Action:** Rewrite to mark as "Phase 4" work, link to Phase 3 strategy.

#### Group 5: File Organization (#925-927)

| Issue | Title | Status | Last Updated | Rewrite Level |
|-------|-------|--------|--------------|--------|
| #925 | Current vs Planned Organization | Local file | 2026-06-01 | 🟡 Medium |
| #926 | Agent & Script Locations | Local file | 2026-06-01 | 🟡 Medium |
| #927 | File Organization Refactoring | Local file | 2026-06-01 | 🟡 Medium |

**Assessment:** Part of Phase 3A. **Action:** Rewrite with CLAUDE.md alignment and Phase 3A timeline.

---

## Project Folder Structure Assessment

### Current Structure (46 files)

```
wave-5-documentation-audit/
├── INDEX.md ✅ (Recently updated 2026-07-31)
├── DOCUMENTATION_UPDATE_STRATEGY.md ✅ (New: 2026-07-31)
├── AUDIT_REPORT_2026-07-31.md 🆕 (This file)
├── parents/
│   ├── 03-documentation-consolidation-audit.md 🔴 (Outdated, needs rewrite)
│   └── 05-file-organization-audit.md 🟡 (Needs Phase 3A update)
├── children/
│   ├── 01-1-template-inventory.md
│   ├── 01-2-template-automation-mapping.md
│   ├── 01-3-labeler-rules-audit.md
│   ├── 01-4-ai-instructions.md
│   ├── 02-3-issue-fields-config.md
│   ├── 02-4-config-relationships.md
│   ├── 03-3-labeling-docs.md 🔴 (Outdated, needs rewrite)
│   ├── 03-4-file-organization-alignment.md
│   ├── 05-1-current-vs-planned.md
│   ├── 05-2-agent-script-locations.md
│   └── 05-3-migration-plan.md
├── execution/
│   ├── wave-5-3-phase-2-execution-plan.md (Previous phase, archive)
│   └── issue-seed-2026-06-08/ (Seed files for issue creation)
└── findings/
    ├── 654-template-inventory-findings.md (Old)
    └── DOCS_AUDIT_2026-07-30.md ✅ (Latest findings)
```

### Missing Files

**Seed files without local issue files:**

- 01-issue-templates-automation.md (Parent #902) ❌
- 02-canonical-configs.md (Parent #903) ❌
- 04-readme-mermaid-a11y.md (Parent #905) ❌
- 02-1-labels-colour-consistency.md (Child #911) ❌
- 02-2-issue-types-mapping.md (Child #912) ❌
- 03-1-issue-creation-docs.md (Child #916) ❌
- 03-2-pr-creation-docs.md (Child #917) ❌
- 03-3-labelling-docs.md (Child #918) ❌

### Status

**Overall:** 🔴 **SEVERELY OUTDATED** — Most issue documentation exists only as "seed" files that haven't been updated since issue creation on 2026-06-08.

---

## Critical Gaps & Change Analysis

### What's Changed Since June 2026

| Area | June 2026 Status | July 2026 Status | Impact |
|------|-----------------|-----------------|--------|
| **Phase 3 Strategy** | Not defined | Comprehensive 5-phase plan | ✅ Issues need alignment |
| **Audit Findings** | Template inventory only | Complete docs audit with 4 file categories flagged | ✅ Issues need new scope |
| **Consolidation Plan** | General mention | Specific 3 areas identified (branch, labeling, triage) | ✅ Issues need detail |
| **Archival Strategy** | Not planned | Defined archive structure ready | ✅ Issues need implementation steps |
| **Accuracy Verification** | Not covered | Phase 3C plan defined (4 documents) | ✅ New issue focus area |
| **File Organization** | Generic alignment audit | Specific CLAUDE.md boundary checks | ✅ Issues need scope update |
| **Documentation Index** | Task mentioned | Phase 3D with detailed structure | ✅ Issues need rewrite |

---

## Issue Rewrite Recommendations

### 🔴 CRITICAL PRIORITY (Rewrite immediately)

These issues are central to Phase 3 and require complete rewrite:

1. **#904** (Documentation Consolidation)
   - Current: Generic "reduce duplication" task
   - New: Specific consolidation for 3 areas (branch, labeling, triage)
   - Scope: Assign specific consolidation analysis tasks
   - Deliverables: Updated issue/labeling/triage docs with cross-references

2. **#916** (Issue Creation Docs Consolidation)
   - Current: Audit consolidation for issue creation docs
   - New: Phase 3B task #1 with specific cross-reference updates
   - Scope: Align issue-creation-guide.md with ISSUE_TYPES.md
   - Deadline: Days 5-6 of Phase 3B

3. **#917** (PR Creation Docs Consolidation)
   - Current: Audit consolidation for PR creation docs
   - New: Phase 3B task #2 with branch naming consolidation
   - Scope: Remove branch naming duplicates, cross-reference BRANCHING_STRATEGY
   - Deadline: Days 5-6 of Phase 3B

4. **#918** (Labeling Docs Consolidation)
   - Current: Audit consolidation for labeling docs
   - New: Phase 3B task #3 with analysis of 3-file labeling group
   - Scope: Verify boundaries between LABELING, LABEL_STRATEGY, LABEL_COLOR_STRATEGY
   - Deadline: Days 7-8 of Phase 3B

5. **#920** (Documentation Index)
   - Current: Complete & current task
   - New: Phase 3D task with specific index structure
   - Scope: Create docs/index.md with topic-based navigation
   - Deadline: Days 12-16 of Phase 3

### 🟡 HIGH PRIORITY (Rewrite with Phase 3 updates)

1. **#906** (File Organization - CLAUDE.md Alignment)
   - Update: Phase 3A component with specific boundary checks
   - Add: CLAUDE.md section references
   - Deadline: Days 1-4 of Phase 3A

2. **#911-914** (Canonical Config Verification)
   - Update: Link to Phase 3C accuracy verification plan
   - Assign: Specific config files to verify against current state
   - Deadline: Days 6-10 of Phase 3 (parallel)

3. **#905** (README & Mermaid Audit)
   - Update: Mark as "Phase 4" initiative (deferred)
   - Link: To Phase 3 strategy with "See also" reference
   - Status: "On hold, will execute after Phase 3 completion"

### 🟢 MEDIUM PRIORITY (Update for current context)

1. **#902-903** (Templates/Configs Automation)
   - Update: Reprioritize after Phase 3
   - Link: To Phase 3 dependencies

2. **#907-910, #921-927** (Other audits)
    - Update: Current completion status
    - Link: To relevant Phase 3 tasks

---

## Rewrite Action Plan

### Step 1: Organization & Planning (1 day)

- [ ] Create "GitHub Issues Rewrite Plan" document
- [ ] Map current issues to Phase 3 phases
- [ ] Identify which issues to close vs. rewrite
- [ ] Determine priority order for rewrites

### Step 2: Rewrite Critical Issues (3-4 days)

**Priority order:**

1. #904 (Documentation Consolidation)
2. #916-920 (Documentation consolidation group)
3. #906 (File Organization)
4. #911-914 (Config verification)
5. #905 (README/Mermaid — defer to Phase 4)

**For each issue:**

- [ ] Get current issue state from GitHub
- [ ] Draft updated issue body (see template below)
- [ ] Update acceptance criteria for Phase 3 context
- [ ] Add linked issues and dependencies
- [ ] Update effort estimate based on Phase 3 plan
- [ ] Set target completion date (link to Phase 3 timeline)

### Step 3: Create Rewrite Documentation (1 day)

- [ ] Create "GITHUB_ISSUES_REWRITE_PLAN.md" in project folder
- [ ] Document all issue updates with before/after
- [ ] Include rationale for each change
- [ ] Link to DOCUMENTATION_UPDATE_STRATEGY.md

### Step 4: Execute Rewrites (2-3 days)

- [ ] Update issues in GitHub via API or web interface
- [ ] Verify all cross-references are correct
- [ ] Update issue relationships (dependencies, blocked by)
- [ ] Add comments with rewrite rationale

### Step 5: Update Project Documentation (0.5 day)

- [ ] Update INDEX.md with new issue status
- [ ] Archive old issue seed files
- [ ] Create new issue seed files if needed
- [ ] Commit all changes

---

## Issue Template for Rewrites

### Title Format

```
[Phase 3{A|B|C|D|E}] {Original Title} - Current Implementation Plan
```

### Body Structure

```markdown
## Overview

Brief description of how this task fits into Wave 5 Phase 3.

## Related Phase 3 Planning

- **Phase:** 3{A|B|C|D|E}
- **Duration:** X days
- **Effort:** Y-Z hours
- **Timeline:** Days N-M of Phase 3
- **Strategy Document:** See [DOCUMENTATION_UPDATE_STRATEGY.md](./path)

## Current Status (as of 2026-07-31)

[Update from original issue state]

## Detailed Scope

[Break down into specific tasks from Phase 3 plan]

## Acceptance Criteria

- [ ] Task 1 complete
- [ ] Task 2 complete
- [ ] Documentation updated
- [ ] Commit references this issue

## Dependencies

- [Link to blocking issues]
- [Link to related issues]

## Deadline

Target completion: [Specific date from Phase 3 timeline]

## Related Documentation

- DOCUMENTATION_UPDATE_STRATEGY.md (Phase 3 plan)
- DOCS_AUDIT_2026-07-30.md (Detailed findings)
- INDEX.md (Project overview)

---

**Last Updated:** 2026-07-31
**Originally Created:** 2026-06-08
**Next Review:** After Phase 3A completion
```

---

## Statistics & Summary

### Issue Inventory

- **Total Issues:** 42 referenced
- **Parent Issues:** 5 (#902-906)
- **Child Issues:** 20 (#907-927, excluding #915)
- **Other Issues:** 17 (infrastructure, support)

### Rewrite Status

- **Critical (Rewrite Immediately):** 5 issues
- **High (Rewrite with Updates):** 8 issues
- **Medium (Update for Context):** 13+ issues
- **Total Requiring Changes:** 26+ issues

### Effort Estimate

- **Complete Rewrite:** 40-60 hours
- **Analysis & Planning:** 8-12 hours
- **Documentation:** 4-8 hours
- **Total Effort:** 52-80 hours
- **Timeline:** 1-2 weeks (part-time)

---

## Recommendations

### Immediate Actions (This Week)

1. **Create GITHUB_ISSUES_REWRITE_PLAN.md**
   - Document all planned changes
   - Create before/after comparison
   - Get team review/approval

2. **Batch Rewrite Process**
   - Group rewrites by priority
   - Execute in batches (5 issues at a time)
   - Verify GitHub synchronization after each batch

3. **Cross-Reference Verification**
   - Ensure all linked issues are current
   - Update dependencies based on Phase 3 timeline
   - Create "related to Phase 3" labels

### Process Improvements

1. **Issue Template System**
   - Create Wave 5 Phase 3 issue template
   - Standardize on format shown above
   - Use for any new issues created

2. **Status Tracking**
   - Add "Phase 3" label to all Phase 3 issues
   - Use milestones to track Phase 3 timeline
   - Add progress comments to issues

3. **Documentation Sync**
   - Link all issues back to DOCUMENTATION_UPDATE_STRATEGY.md
   - Update strategy if issues reveal gaps
   - Keep project folder as source of truth

---

## Next Steps

1. **Review this audit report** with the team
2. **Approve rewrite plan** and priority order
3. **Create GITHUB_ISSUES_REWRITE_PLAN.md** with detailed changes
4. **Begin executing rewrites** in priority order
5. **Track progress** with milestone and label updates

---

*Audit Completed: 2026-07-31*  
*Rewrite Target: 2026-08-07*  
*Phase 3 Execution Start: 2026-08-01*

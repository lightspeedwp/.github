---
file_type: documentation
title: ""Epic: Issue Type & Metadata Automation Initiative""
description: "Project documentation"
last_updated: "2026-08-25"
status: active
---

# Epic: Issue Type & Metadata Automation Initiative

## Overview

Fix critical gaps in GitHub issue creation automation so that issue types, labels, assignees, projects, and custom fields are automatically populated when issues are created.

**Current State:** Issues created without proper metadata, requiring manual cleanup. GitHub bot sometimes silently reopens incomplete issues.

**Target State:** All metadata auto-populated at creation; clear guidance for incomplete issues; DoD enforced on both issues and PRs.

---

## Problem Statement

When issues are created (by AI agents or humans):

- Issue types not automatically assigned (guessed from keywords, often wrong)
- Area/component labels not applied
- Assignees not set
- Projects not assigned
- Custom fields empty (7 fields undefined)
- GitHub bot silently reopens incomplete issues (confusing UX)
- DoD enforcement missing for issues
- PR merges not blocked if linked issue incomplete

**Impact:** Manual cleanup required; AI agents can't create correct issues.

---

## Desired Outcome

1. ✅ Issue types automatically applied from template selection
2. ✅ Area/component labels inferred from body keywords
3. ✅ Assignees default to code owner (from CODEOWNERS)
4. ✅ Projects assigned to .github (ID #33)
5. ✅ Custom fields auto-populated (Risk, Impact, Domain, Team, Effort, etc.)
6. ✅ Clear guidance if issues don't meet template requirements (no silent reopening)
7. ✅ DoD enforced: issues cannot close with incomplete checklists
8. ✅ PR merges blocked if linked issue has incomplete DoD
9. ✅ Documented best practices for AI agents & humans

---

## Scope & Deliverables

### Phase 1: Critical Fixes (11.5 hours)

- [ ] Remove non-existent label reference
- [ ] Add missing type label aliases
- [ ] Implement issue-body labeling rules (40+ patterns)
- [ ] Fix template-enforcement silent reopening
- [ ] Add issue DoD validation

**Target:** August 3, 2026

### Phase 2: Enhanced Automation (15 hours)

- [ ] Implement PR merge blocker (check linked issue DoD)
- [ ] Auto-populate custom fields
- [ ] Template-aware type detection

**Target:** August 17, 2026

### Phase 3: Documentation & Testing (11 hours)

- [ ] Create AI agent issue creation guide
- [ ] Update AGENTS.md
- [ ] End-to-end testing & validation

**Target:** August 27, 2026

---

## Success Criteria

- [ ] All issues have correct type label at creation
- [ ] All custom fields auto-populated
- [ ] PR merges blocked if linked issue incomplete
- [ ] Zero silent issue reopening
- [ ] All 158 labels protected in governance
- [ ] Test coverage: 12+ critical scenarios passing
- [ ] Documentation: ISSUE_CREATION_GUIDE.md + AGENTS.md updated
- [ ] Team training: Best practices documented & communicated

---

## Key Assumptions

1. Issue templates are properly structured (DoR/DoD sections)
2. CODEOWNERS file is up-to-date
3. GitHub workflows have necessary permissions
4. Team available for 1-2 weeks of focused work
5. No blocking dependencies on other projects

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Breaking existing issues | LOW | HIGH | Test with legacy issues; add meta:legacy-issue label |
| Over-aggressive labeling | MEDIUM | MEDIUM | Use weighted rules; manual review for ambiguous |
| Custom field inference errors | LOW | MEDIUM | Sensible defaults; log inferences for audit |
| Workflow performance degradation | LOW | MEDIUM | Optimize API calls; monitor execution times |
| Scope creep (adding features beyond Phase 3) | MEDIUM | HIGH | Strict definition of done; document out-of-scope items |

---

## Related Issues & Dependencies

### Related Audit Reports

- `.github/reports/issue-management/audit-2026-07-23-comprehensive.md`
- `.github/reports/issue-management/solution-design-2026-07-23.md`

### Child Issues (Linked Below)

- #TBD (Phase 1) — Fix 1.1: Remove non-existent label
- #TBD (Phase 1) — Fix 1.2: Add missing type aliases
- #TBD (Phase 1) — Fix 1.3: Implement issue-body labeling rules
- #TBD (Phase 1) — Fix 1.4: Fix template-enforcement reopening
- #TBD (Phase 1) — Fix 1.5: Add issue DoD validation
- #TBD (Phase 2) — Feature 2.1: PR merge blocker
- #TBD (Phase 2) — Feature 2.2: Custom field population
- #TBD (Phase 2) — Feature 2.3: Template-aware type detection
- #TBD (Phase 3) — Task 3.1: AI agent guidance
- #TBD (Phase 3) — Task 3.2: Update AGENTS.md
- #TBD (Phase 3) — Task 3.3: Testing & validation

---

## Timeline

| Phase | Weeks | Effort | Status | Target Date |
|-------|-------|--------|--------|-------------|
| Phase 1 | 1-2 | 11.5h | ⏳ Ready | Aug 3 |
| Phase 2 | 3-4 | 15h | 📅 Planned | Aug 17 |
| Phase 3 | 4-5 | 11h | 📅 Planned | Aug 27 |
| **Total** | **5 weeks** | **37.5h** | **🟢 Active** | **Aug 27** |

---

## Definition of Ready (DoR)

- [x] Problem statement clear & shared with team
- [x] Solution designed & documented
- [x] Child issues created with detailed acceptance criteria
- [x] Resource allocation confirmed (1-2 engineers)
- [x] Dependencies identified (none blocking)
- [x] Risk mitigation plan reviewed
- [x] Stakeholder approval received

---

## Definition of Done (DoD)

- [ ] All Phase 1 child issues completed & merged
- [ ] All Phase 2 child issues completed & merged
- [ ] All Phase 3 child issues completed & merged
- [ ] All tests passing (12+ critical scenarios)
- [ ] Documentation complete (ISSUE_CREATION_GUIDE.md + AGENTS.md)
- [ ] Code reviewed (tech lead approval)
- [ ] Team trained (best practices documented)
- [ ] Success metrics validated:
  - 95%+ issues with correct type label
  - 90%+ issues with correct area/component
  - 95%+ issues with custom fields populated
  - 0% silent issue reopenings
  - 100% PR merge blockers working
- [ ] No regressions in existing workflows
- [ ] Post-deployment monitoring (1 week)

---

## Acceptance Criteria

1. ✅ Issue types automatically assigned from template (not guessed from keywords)
2. ✅ All 7 custom fields auto-populated based on issue type/content
3. ✅ GitHub bot provides clear guidance instead of silent reopening
4. ✅ Issues cannot close with incomplete DoD
5. ✅ PRs cannot merge if linked issue has incomplete DoD
6. ✅ 158 labels all protected in governance policy
7. ✅ 40+ issue-body labeling rules implemented
8. ✅ Comprehensive test suite (12+ scenarios) passing
9. ✅ AI agent guidance documented & communicated
10. ✅ Team trained on new workflows & best practices

---

## Project Links

- **Project Folder:** `.github/projects/active/issue-type-workflow-automation/`
- **Project Index:** `.github/projects/active/issue-type-workflow-automation/PROJECT_INDEX.md`
- **Implementation Plan:** `.github/projects/active/issue-type-workflow-automation/IMPLEMENTATION_PLAN.md`
- **Audit Report:** `.github/reports/issue-management/audit-2026-07-23-comprehensive.md`
- **Solution Design:** `.github/reports/issue-management/solution-design-2026-07-23.md`

---

## Key Deliverables

1. **Config Updates**
   - `.github/labels.yml` — Add aliases
   - `.github/labeler.yml` — Add 40+ issue-body rules
   - `.github/label-governance-policy.yml` — Update protection status

2. **Workflow Changes**
   - `.github/workflows/issues.yml` — Enhance type detection
   - `.github/workflows/template-enforcement.yml` — Fix reopening logic
   - `.github/workflows/validate-issue-dod-before-close.yml` — NEW
   - `.github/workflows/validate-linked-issue-dod-on-pr.yml` — NEW
   - `.github/workflows/populate-custom-fields-on-create.yml` — NEW

3. **Documentation**
   - `.github/ISSUE_CREATION_GUIDE.md` — NEW
   - `.github/AGENTS.md` — Add section
   - `.github/projects/active/issue-type-workflow-automation/` — Project folder

4. **Test Suite**
   - 12+ critical scenario tests
   - Regression test coverage
   - Post-deployment monitoring checklist

---

## Acceptance by Role

### Project Owner (Ash Shaw)

- [ ] Reviewed audit findings
- [ ] Approved solution design
- [ ] Allocated resources
- [ ] Authorized Phase 1 execution

### Tech Lead

- [ ] Reviewed IMPLEMENTATION_PLAN.md
- [ ] Assigned team members
- [ ] Reviewed code (Phase 1 PR)
- [ ] Approved for merge

### Engineers (Phase Owners)

- [ ] Phase 1 lead: Complete all 5 fixes
- [ ] Phase 2 lead: Complete all 3 features
- [ ] Phase 3 lead: Complete documentation & testing

---

## Notes

- All Phase 1 fixes are low-risk (isolated workflow changes)
- Extensive test coverage planned (12+ scenarios)
- Team communication plan: standup + weekly progress updates
- Post-deployment monitoring: 1 week observation period
- Success depends on accurate custom field inference logic (Phase 2.2)

---

**Created:** 2026-07-23  
**Type:** Epic  
**Status:** ⏳ Ready to Start  
**Priority:** High  
**Effort:** 37.5 hours | 5 weeks  
**Team:** 1-2 engineers

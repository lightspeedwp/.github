# Status Tracking — Issue & PR Template Improvements

**Project:** Issue & PR Template Improvements  
**Started:** 2026-09-04  
**Last Updated:** 2026-09-04  
**Current Phase:** Phase 1 — Delete Duplicates (Ready for Execution)  
**GitHub Issues:** #2771, #2772, #2773, #2774, #2775, #2776

---

## Overall Progress

```
[██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 10%

Setup:  ██████████ 100% — Complete (PR merged, issues created)
Phase 1: ░░░░░░░░░░  0% — Ready for execution
Phase 2: ░░░░░░░░░░  0% — Blocked by Phase 1
Phase 3: ░░░░░░░░░░  0% — Blocked by Phase 2
Phase 4: ░░░░░░░░░░  0% — Blocked by Phase 3
Phase 5: ░░░░░░░░░░  0% — Blocked by Phase 4
```

---

## Session 2026-09-04 — PR Merge & Issue Creation

**Session Date:** 2026-09-04  
**Session Type:** Documentation & Issue Setup  
**Duration:** ~2 hours  
**Completion:** ✅ 100%

### Accomplishments

- ✅ PR #2766 merged to develop branch with all project documentation
  - README.md: Project overview and critical findings
  - SPEC.md: Detailed technical specifications
  - PLANNING.md: 5-phase implementation roadmap
  - INDEX.md: Navigation guide for all roles
  - ISSUES_CHECKLIST.md: Specifications for 6 GitHub issues
  - .openspec.yml: OpenSpec configuration

- ✅ All 6 GitHub issues created and linked to project:
  - #2771: Phase 1: Delete 17 Duplicate Issue Templates & Renumber
  - #2772: Phase 2: Standardize Frontmatter & Fix YAML Syntax in All Templates
  - #2773: Phase 3: Correct PR Template Title Patterns to Match Branch Naming Convention
  - #2774: Phase 4: Validate All Templates & Test Template Routing
  - #2775: Phase 5: Create Issue Type Allocator Skill & Update Documentation
  - #2776: [TRACKING] Issue & PR Template Improvements — Project Status

- ✅ Issues created with proper labels and organization:
  - All labeled with `type:task`, `status:needs-triage`, `priority:normal`, `area:templates`
  - Each phase issue labeled with `meta:phase-N`
  - Tracking issue linked to all phase issues

### Files Created/Modified

- `.github/projects/active/issue-and-pr-template-improvements/` (new folder)
  - README.md
  - SPEC.md
  - PLANNING.md
  - INDEX.md
  - ISSUES_CHECKLIST.md
  - STATUS_TRACKING.md
  - .openspec.yml

### Dependencies & Next Steps

- Phase 1 ready to begin (Issue #2771)
- All phase documentation complete and versioned
- OpenSpec configuration validated
- Project tracking issue (#2776) ready to receive progress updates

### Notes

- PR merged despite CI warnings per user request
- CodeRabbit review raised documentation consistency concerns (documented for future review)
- All 6 issues created successfully via GitHub API
- Project structure follows `.github/projects/active/` pattern

---

## Phase Execution Log

### Phase 1: Cleanup & Deduplication

**Status:** ✅ Ready for Execution  
**GitHub Issue:** #2771  
**Estimated Duration:** 30 min  
**Approval Gate:** Ready to proceed (issue created)  

#### Tasks
- [ ] Delete 07-user-experience-feedback.md
- [ ] Delete 08-code-refactor.md
- [ ] Delete 09-code-refactor.md
- [ ] Delete 10-build-ci.md
- [ ] Delete 11-automation.md
- [ ] Delete 12-testing-coverage.md
- [ ] Delete 13-performance.md
- [ ] Delete 14-a11y.md
- [ ] Delete 15-security.md
- [ ] Delete 16-compatibility.md
- [ ] Delete 17-integration-issue.md
- [ ] Delete 18-release.md
- [ ] Delete 19-maintenance.md
- [ ] Delete 20-documentation.md
- [ ] Delete 21-research.md
- [ ] Delete 22-audit.md
- [ ] Delete 23-code-review.md
- [ ] Delete 24-ai-ops.md
- [ ] Delete 25-content-modelling.md
- [ ] Verify 25 unique templates remain
- [ ] Verify no numbering gaps
- [ ] Git commit changes

#### Notes
None yet — awaiting execution

#### Completed By
N/A

#### Completion Date
N/A

---

### Phase 2: Frontmatter Standardization

**Status:** 🔒 Blocked by Phase 1  
**GitHub Issue:** #2772  
**Estimated Duration:** 30 min  
**Approval Gate:** Awaiting Phase 1 completion  

#### Tasks
- [ ] Update all issue templates frontmatter
- [ ] Fix YAML label syntax (quote strings)
- [ ] Verify all label prefixes are valid
- [ ] Ensure all labels exist in .github/labels.yml

#### Notes
Will begin after Phase 1 completes and is approved.

#### Completed By
N/A

#### Completion Date
N/A

---

### Phase 3: PR Template Title Corrections

**Status:** 🔒 Blocked by Phase 2  
**GitHub Issue:** #2773  
**Estimated Duration:** 15 min  
**Approval Gate:** Awaiting Phase 2 completion  

#### Tasks
- [ ] Update pr_bug.md: `type:bug: {scope}` → `fix: {scope}`
- [ ] Update pr_feature.md: `type:feature: {scope}` → `feat: {scope}`
- [ ] Verify other 7 PR templates use correct format

#### Notes
Will begin after Phase 2 completes and is approved.

#### Completed By
N/A

#### Completion Date
N/A

---

### Phase 4: Validation & Testing

**Status:** 🔒 Blocked by Phase 3  
**GitHub Issue:** #2774  
**Estimated Duration:** 20 min  
**Approval Gate:** Awaiting Phase 3 completion  

#### Tasks
- [ ] Run schema validation: `npm run validate:frontmatter`
- [ ] Verify label inventory
- [ ] Test template routing
- [ ] Create smoke test issues/PRs

#### Notes
Will begin after Phase 3 completes and is approved.

#### Completed By
N/A

#### Completion Date
N/A

---

### Phase 5: Documentation & Skill Creation

**Status:** 🔒 Blocked by Phase 4  
**GitHub Issue:** #2775  
**Estimated Duration:** 20 min  
**Approval Gate:** Awaiting Phase 4 completion  

#### Tasks
- [ ] Create Issue Type Allocator skill
- [ ] Update .github/issue-types.yml
- [ ] Update related documentation
- [ ] Create GitHub issues
- [ ] Cross-link all documentation

#### Notes
Will begin after Phase 4 completes and is approved.

#### Completed By
N/A

#### Completion Date
N/A

---

## Milestone Progress

| Milestone | Status | Target Date | Actual Date |
|-----------|--------|-------------|-------------|
| Phase 1 Complete | ⏳ Pending | 2026-09-04 | — |
| Phase 2 Complete | 🔒 Blocked | 2026-09-04 | — |
| Phase 3 Complete | 🔒 Blocked | 2026-09-04 | — |
| Phase 4 Complete | 🔒 Blocked | 2026-09-04 | — |
| Phase 5 Complete | 🔒 Blocked | 2026-09-04 | — |
| All Issues Created | 🔒 Blocked | 2026-09-05 | — |
| Project Complete | 🔒 Blocked | 2026-09-05 | — |

---

## Key Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Duplicate templates deleted | 0 / 17 | 17 ✓ |
| Templates standardized | 0 / 25 | 25 ✓ |
| PR title patterns fixed | 0 / 2 | 2 ✓ |
| Schema validation passing | 0 / 1 | 1 ✓ |
| GitHub issues created | 0 / 5 | 5 ✓ |
| Documentation linked | 0 / 25 | 25 ✓ |
| Project completion | 0% | 100% |

---

## Blockers & Issues

### Current Blockers
- ⏳ Awaiting Phase 1 execution approval

### Known Issues
None yet

### Risks
- Large number of changes (19+ files) could introduce regressions
- Agents may depend on template structure
- Schema validation may need adjustments

---

## Approval Gate Status

### Phase 1 Approval Gate
- [ ] User reviews deletion list
- [ ] User confirms no important content will be lost
- [ ] User approves proceeding with Phase 1
- **Status:** ⏳ Awaiting user approval

### Phase 2 Approval Gate
- [ ] Phase 1 complete
- [ ] User reviews frontmatter changes
- [ ] User confirms all required fields present
- [ ] User approves YAML syntax changes
- **Status:** 🔒 Blocked by Phase 1

### Phase 3 Approval Gate
- [ ] Phase 2 complete
- [ ] User reviews PR title pattern changes
- [ ] User confirms alignment with CLAUDE.md
- [ ] User approves testing phase
- **Status:** 🔒 Blocked by Phase 2

### Phase 4 Approval Gate
- [ ] Phase 3 complete
- [ ] Validation results reviewed
- [ ] Test results reviewed
- [ ] Issues resolved if any
- [ ] Approval to commit changes
- **Status:** 🔒 Blocked by Phase 3

### Phase 5 Approval Gate
- [ ] Phase 4 complete
- [ ] Skill created and documented
- [ ] All issues linked
- [ ] Final documentation approved
- **Status:** 🔒 Blocked by Phase 4

---

## Git Commits Log

| Commit Hash | Phase | Date | Message |
|-------------|-------|------|---------|
| — | Setup | 2026-09-04 | Created active project folder and initial documentation |
| — | Phase 1 | — | (Awaiting execution) |
| — | Phase 2 | — | (Awaiting execution) |
| — | Phase 3 | — | (Awaiting execution) |
| — | Phase 4 | — | (Awaiting execution) |
| — | Phase 5 | — | (Awaiting execution) |

---

## GitHub Issues Created

| Issue # | Title | Phase | Status |
|---------|-------|-------|--------|
| #2771 | Phase 1: Delete 17 Duplicate Issue Templates & Renumber | 1 | ⏳ Ready for execution |
| #2772 | Phase 2: Standardize Frontmatter & Fix YAML Syntax in All Templates | 2 | 🔒 Blocked by Phase 1 |
| #2773 | Phase 3: Correct PR Template Title Patterns to Match Branch Naming Convention | 3 | 🔒 Blocked by Phase 2 |
| #2774 | Phase 4: Validate All Templates & Test Template Routing | 4 | 🔒 Blocked by Phase 3 |
| #2775 | Phase 5: Create Issue Type Allocator Skill & Update Documentation | 5 | 🔒 Blocked by Phase 4 |
| #2776 | [TRACKING] Issue & PR Template Improvements — Project Status | Meta | ⏳ Tracking in progress |

---

## Communication Log

| Date | Event | Details |
|------|-------|---------|
| 2026-09-04 | Project Created | Active project folder established |
| 2026-09-04 | Documentation Written | README, SPEC, PLANNING, etc. created |
| 2026-09-04 | PR #2766 Merged | Project documentation merged to develop branch |
| 2026-09-04 | GitHub Issues Created | All 6 phase issues and tracking issue created (#2771-#2776) |
| 2026-09-04 | Status: Awaiting Phase 1 Execution | All documentation complete; Phase 1 ready to begin |

---

## Notes & Observations

### Session Notes
- Comprehensive analysis completed
- 5 critical issues identified
- Detailed remediation plan created
- All documentation and checklists prepared
- Ready to begin Phase 1 upon approval

### Important Reminders
- Each phase has specific approval gate
- Must commit changes to develop branch
- Must create GitHub issues after Phase 5
- Must cross-link all documentation
- Must verify no regressions

### Follow-up Items
- Wait for Phase 1 approval before proceeding
- Plan follow-up review for Phase 2
- Schedule testing time for Phase 4
- Prepare skill template for Phase 5

---

## Next Steps

1. **User reviews this status tracking document**
2. **User approves Phase 1 execution**
3. **Execute Phase 1 tasks** (delete 17 duplicate files)
4. **Update this status tracking document** with completion info
5. **Repeat for each subsequent phase**
6. **After Phase 5:** Create GitHub issues and close project

---

## Quick Links

- **Project README:** `./README.md`
- **Detailed Spec:** `./SPEC.md`
- **Implementation Plan:** `./PLANNING.md`
- **Issues Checklist:** `./ISSUES_CHECKLIST.md`
- **Project Index:** `./INDEX.md`

---

**Status Last Updated:** 2026-09-04  
**Next Update:** After Phase 1 execution  
**Project Maintainer:** @ashley (lightspeedwp/.github)

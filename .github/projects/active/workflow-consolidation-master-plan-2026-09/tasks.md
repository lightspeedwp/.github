---
file_type: tasks
title: "Phase 1 Implementation Tasks — Workflow Consolidation"
phase: 1
phase_duration: "2 weeks (Sep 16-30, 2026)"
total_effort_hours: "8-10"
feature_name: "Workflow Consolidation Initiative Phase 1"
related_epic: "[Epic] Workflow Consolidation Initiative 2026-Q4"
branch: "refactor/workflow-consolidation-and-archiving"
pr_type: "type:refactor"
status: "ready-for-execution"
created: "2026-09-11"
---

# Phase 1 Tasks — Workflow Consolidation & Archive

**Feature:** Workflow Consolidation Initiative — Phase 1: Backup & Archive  
**Phase:** 1 of 3  
**Duration:** 2 weeks (Sep 16-30, 2026)  
**Effort:** 8-10 hours total  
**Branch:** `refactor/workflow-consolidation-and-archiving`  
**PR Type:** `type:refactor` (refactor template)  
**Status:** Ready for execution

---

## Phase 1: Setup & Archive Initialization

### Setup: Create Archive Infrastructure

Archive directory structure must be created before moving workflows. These tasks initialize the archive system.

**Success Criteria:**
- Directory structure created with all 8 category subdirectories
- README files guide navigation
- Archive INDEX.md prepared for multi-year tracking
- Foundation ready for Phase 2 & Phase 3 references

---

- [ ] T001 Create `.github/workflows/archived/2026-09-11/` directory structure with 8 category subdirectories
- [ ] T002 Create `.github/workflows/archived/2026-09-11/README.md` with archive navigation and purpose documentation
- [ ] T003 Create `.github/workflows/archived/2026-09-11/ARCHIVED_WORKFLOWS_MANIFEST.md` template for workflow inventory
- [ ] T004 Create `.github/workflows/archived/INDEX.md` for multi-year archive tracking and index
- [ ] T005 Create `.github/workflows/archived/2026-09-11/RESTORE.md` with restoration procedures and rollback criteria

---

## Phase 2: Foundational — Move & Organize 62 Workflows

All 62 non-essential workflows must be moved to their category subdirectories. These tasks organize workflows for clean archival and Phase 2 consolidation reference.

**Success Criteria:**
- All 62 workflows moved to correct category directories
- File timestamps preserved
- Each workflow documented in manifest
- Zero workflows remain in main `.github/workflows/` except 14 core workflows
- Archive structure matches documented categories (9+12+8+10+7+8+8+8=62)

---

### Labeling Workflows (9 total)

- [ ] T006 [P] Move labeling.yml to `.github/workflows/archived/2026-09-11/labeling/`
- [ ] T007 [P] Move labeling-governance.yml to `.github/workflows/archived/2026-09-11/labeling/`
- [ ] T008 [P] Move issue-labeling-automation.yml to `.github/workflows/archived/2026-09-11/labeling/`
- [ ] T009 [P] Move meta-labels-sync.yml to `.github/workflows/archived/2026-09-11/labeling/`
- [ ] T010 [P] Move batch-label-prs.yml to `.github/workflows/archived/2026-09-11/labeling/`
- [ ] T011 [P] Move remediate-bare-labels.yml to `.github/workflows/archived/2026-09-11/labeling/`
- [ ] T012 [P] Move validate-issue-labels.yml to `.github/workflows/archived/2026-09-11/labeling/`
- [ ] T013 [P] Move label-audit-report.yml to `.github/workflows/archived/2026-09-11/labeling/`
- [ ] T014 [P] Move openspec-sync-labels.yml to `.github/workflows/archived/2026-09-11/labeling/`

### Validation Workflows (12 total)

- [ ] T015 [P] Move branch-name-validation.yml to `.github/workflows/archived/2026-09-11/validation/`
- [ ] T016 [P] Move pr-template-validation.yml to `.github/workflows/archived/2026-09-11/validation/`
- [ ] T017 [P] Move changelog-safety-audit.yml to `.github/workflows/archived/2026-09-11/validation/`
- [ ] T018 [P] Move validate-dor-dod-sections.yml to `.github/workflows/archived/2026-09-11/validation/`
- [ ] T019 [P] Move docs-validation.yml to `.github/workflows/archived/2026-09-11/validation/`
- [ ] T020 [P] Move linting.yml to `.github/workflows/archived/2026-09-11/validation/`
- [ ] T021 [P] Move markdown-audit-ci-optimization.yml to `.github/workflows/archived/2026-09-11/validation/`
- [ ] T022 [P] Move workflow-validation.yml to `.github/workflows/archived/2026-09-11/validation/`
- [ ] T023 [P] Move validate-blocking-issue-before-close.yml to `.github/workflows/archived/2026-09-11/validation/`
- [ ] T024 [P] Move validate-blocking-status-before-close.yml to `.github/workflows/archived/2026-09-11/validation/`
- [ ] T025 [P] Move validate-project-linking.yml to `.github/workflows/archived/2026-09-11/validation/`
- [ ] T026 [P] Move checks.yml (validation portions) to `.github/workflows/archived/2026-09-11/validation/`

### Documentation Workflows (8 total)

- [ ] T027 [P] Move docs-maintenance.yml to `.github/workflows/archived/2026-09-11/documentation/`
- [ ] T028 [P] Move badges-readme-status.yml to `.github/workflows/archived/2026-09-11/documentation/`
- [ ] T029 [P] Move badges-documentation-update.yml to `.github/workflows/archived/2026-09-11/documentation/`
- [ ] T030 [P] Move badges-verification.yml to `.github/workflows/archived/2026-09-11/documentation/`
- [ ] T031 [P] Move badges-health-check.yml to `.github/workflows/archived/2026-09-11/documentation/`
- [ ] T032 [P] Move badges-workflow-audit.yml to `.github/workflows/archived/2026-09-11/documentation/`
- [ ] T033 [P] Move awesome-github-site.yml to `.github/workflows/archived/2026-09-11/documentation/`
- [ ] T034 [P] Move documentation-workflow.yml to `.github/workflows/archived/2026-09-11/documentation/`

### Issue Management Workflows (10 total)

- [ ] T035 [P] Move issue-management-orchestration.yml to `.github/workflows/archived/2026-09-11/issue-management/`
- [ ] T036 [P] Move issue-create-enhanced.yml to `.github/workflows/archived/2026-09-11/issue-management/`
- [ ] T037 [P] Move issue-audit-remediation.yml to `.github/workflows/archived/2026-09-11/issue-management/`
- [ ] T038 [P] Move issue-compliance.yml to `.github/workflows/archived/2026-09-11/issue-management/`
- [ ] T039 [P] Move issue-remediation-automation.yml to `.github/workflows/archived/2026-09-11/issue-management/`
- [ ] T040 [P] Move issues.yml to `.github/workflows/archived/2026-09-11/issue-management/`
- [ ] T041 [P] Move issues-automation.yml to `.github/workflows/archived/2026-09-11/issue-management/`
- [ ] T042 [P] Move normalize-titles.yml to `.github/workflows/archived/2026-09-11/issue-management/`
- [ ] T043 [P] Move meta-agent-validation.yml to `.github/workflows/archived/2026-09-11/issue-management/`
- [ ] T044 [P] Move metadata-governance.yml to `.github/workflows/archived/2026-09-11/issue-management/`

### PR Management Workflows (7 total)

- [ ] T045 [P] Move enforce-pr-issue-linking.yml to `.github/workflows/archived/2026-09-11/pr-management/`
- [ ] T046 [P] Move allocate-pr-issue-to-milestone.yml to `.github/workflows/archived/2026-09-11/pr-management/`
- [ ] T047 [P] Move pr-template-validation.yml to `.github/workflows/archived/2026-09-11/pr-management/`
- [ ] T048 [P] Move pr-validation.yml to `.github/workflows/archived/2026-09-11/pr-management/`
- [ ] T049 [P] Move pr-template-resolver.yml to `.github/workflows/archived/2026-09-11/pr-management/`
- [ ] T050 [P] Move planner.yml to `.github/workflows/archived/2026-09-11/pr-management/`
- [ ] T051 [P] Move reviewer.yml to `.github/workflows/archived/2026-09-11/pr-management/`

### Testing Workflows (8 total)

- [ ] T052 [P] Move testing.yml to `.github/workflows/archived/2026-09-11/testing/`
- [ ] T053 [P] Move release-e2e-tests.yml to `.github/workflows/archived/2026-09-11/testing/`
- [ ] T054 [P] Move checks.yml (test portions) to `.github/workflows/archived/2026-09-11/testing/`
- [ ] T055 [P] Move test-runner.yml to `.github/workflows/archived/2026-09-11/testing/`
- [ ] T056 [P] Move integration-tests.yml to `.github/workflows/archived/2026-09-11/testing/`
- [ ] T057 [P] Move unit-tests.yml to `.github/workflows/archived/2026-09-11/testing/`
- [ ] T058 [P] Move e2e-tests.yml to `.github/workflows/archived/2026-09-11/testing/`
- [ ] T059 [P] Move test-coverage.yml to `.github/workflows/archived/2026-09-11/testing/`

### CI/CD Workflows (8 total)

- [ ] T060 [P] Move build.yml to `.github/workflows/archived/2026-09-11/ci-cd/`
- [ ] T061 [P] Move cleanup-branches.yml to `.github/workflows/archived/2026-09-11/ci-cd/`
- [ ] T062 [P] Move branch-cleanup.yml to `.github/workflows/archived/2026-09-11/ci-cd/`
- [ ] T063 [P] Move deploy.yml to `.github/workflows/archived/2026-09-11/ci-cd/`
- [ ] T064 [P] Move ci-pipeline.yml to `.github/workflows/archived/2026-09-11/ci-cd/`
- [ ] T065 [P] Move artifacts-cleanup.yml to `.github/workflows/archived/2026-09-11/ci-cd/`
- [ ] T066 [P] Move cache-maintenance.yml to `.github/workflows/archived/2026-09-11/ci-cd/`
- [ ] T067 [P] Move release-trigger.yml to `.github/workflows/archived/2026-09-11/ci-cd/`

### Utilities Workflows (8 total)

- [ ] T068 [P] Move meta.yml to `.github/workflows/archived/2026-09-11/utilities/`
- [ ] T069 [P] Move gitleaks.yml to `.github/workflows/archived/2026-09-11/utilities/`
- [ ] T070 [P] Move gitleaks-update.yml to `.github/workflows/archived/2026-09-11/utilities/`
- [ ] T071 [P] Move gitleaks-reusable.yml to `.github/workflows/archived/2026-09-11/utilities/`
- [ ] T072 [P] Move actions-minute-savings-watch.yml to `.github/workflows/archived/2026-09-11/utilities/`
- [ ] T073 [P] Move agent-spec-validation.yml to `.github/workflows/archived/2026-09-11/utilities/`
- [ ] T074 [P] Move openspec-validation.yml to `.github/workflows/archived/2026-09-11/utilities/`
- [ ] T075 [P] Move main-branch-guard.yml to `.github/workflows/archived/2026-09-11/utilities/`

---

## Phase 3: User Story 1 — Documentation & Mapping

Create consolidation mapping and archive documentation. These tasks document the relationship between old and new workflows, establish restore procedures, and guide future maintenance.

**Success Criteria:**
- WORKFLOW_CONSOLIDATION_MAPPING.md created with all 76 workflows mapped
- Archive manifest complete with restoration procedures
- Archive documentation complete and navigable
- Restore procedures tested and validated
- All documentation follows project conventions

**Test Criteria:**
- [ ] Verify `.github/docs/WORKFLOW_CONSOLIDATION_MAPPING.md` exists
- [ ] Count all 76 workflows listed (62 archived + 14 core)
- [ ] Verify each workflow has: old name, new consolidated workflow, category, status, notes
- [ ] Test restore procedure for at least one workflow from each category
- [ ] Verify archive directory structure matches documentation

---

- [ ] T076 Create `.github/docs/WORKFLOW_CONSOLIDATION_MAPPING.md` with table header: Old Workflow | New Workflow (Phase 2) | Category | Status | Notes
- [ ] T077 Add all 9 labeling workflows with mappings to `labeling-unified.yml` in WORKFLOW_CONSOLIDATION_MAPPING.md
- [ ] T078 Add all 12 validation workflows with mappings to `validation-unified.yml` in WORKFLOW_CONSOLIDATION_MAPPING.md
- [ ] T079 Add all 8 documentation workflows with mappings to `documentation.yml` in WORKFLOW_CONSOLIDATION_MAPPING.md
- [ ] T080 Add all 10 issue-management workflows with mappings to appropriate consolidated workflows in WORKFLOW_CONSOLIDATION_MAPPING.md
- [ ] T081 Add all 7 PR-management workflows with mappings to appropriate consolidated workflows in WORKFLOW_CONSOLIDATION_MAPPING.md
- [ ] T082 Add all 8 testing workflows with mappings to `testing-unified.yml` in WORKFLOW_CONSOLIDATION_MAPPING.md
- [ ] T083 Add all 8 CI/CD workflows with mappings to appropriate consolidated workflows in WORKFLOW_CONSOLIDATION_MAPPING.md
- [ ] T084 Add all 8 utilities workflows with mappings to appropriate consolidated workflows in WORKFLOW_CONSOLIDATION_MAPPING.md
- [ ] T085 Add all 14 core workflows to WORKFLOW_CONSOLIDATION_MAPPING.md with status "Active (Phase 1+)"
- [ ] T086 Populate `.github/workflows/archived/2026-09-11/ARCHIVED_WORKFLOWS_MANIFEST.md` with complete workflow inventory by category
- [ ] T087 Add restoration instructions and examples to `.github/workflows/archived/2026-09-11/RESTORE.md`
- [ ] T088 Create category-specific README files in each subdirectory (labeling/, validation/, documentation/, etc.) in `.github/workflows/archived/2026-09-11/`
- [ ] T089 Test restore procedure: verify `git show refactor/workflow-consolidation-and-archiving:.github/workflows/archived/2026-09-11/labeling/labeling.yml > test-restore.yml` works
- [ ] T090 Verify all 62 archived workflows are accessible and unchanged after move

---

## Phase 4: User Story 2 — Main Documentation & GitHub Issues

Update main automation documentation and create GitHub epic + sub-issues for tracking Phase 1 completion and Phase 2 planning.

**Success Criteria:**
- AUTOMATION.md updated with new 14-workflow architecture
- Consolidation project link added to main docs
- GitHub epic created with type:epic label
- 5 type:refactor sub-issues created and linked to epic
- All issues added to project board with timeline
- Phase 2 dependencies documented in issue descriptions

**Test Criteria:**
- [ ] AUTOMATION.md reflects new workflow count (14 core + 62 archived)
- [ ] Links to WORKFLOW_CONSOLIDATION_MAPPING.md work
- [ ] Epic issue shows 5 linked sub-issues
- [ ] All issues have proper labels: type:refactor, area:automation, status:needs-review
- [ ] Issues are added to project board

---

- [ ] T091 Update `.github/docs/AUTOMATION.md` to reflect new 14-workflow architecture with consolidated workflow list
- [ ] T092 Add link to WORKFLOW_CONSOLIDATION_MAPPING.md in AUTOMATION.md
- [ ] T093 Add "Workflow Consolidation Timeline" section to AUTOMATION.md with Phase 1, 2, 3 dates
- [ ] T094 Add "Consolidation Project" section to AUTOMATION.md linking to master plan documents
- [ ] T095 Create GitHub epic issue: `[Epic] Workflow Consolidation Initiative 2026-Q4` with type:epic label, area:automation label, effort estimate, and related project links
- [ ] T096 Create sub-issue #1: `refactor: Phase 1 - Backup & Archive Workflows` with type:refactor label, area:automation, related to epic
- [ ] T097 Create sub-issue #2: `refactor: Phase 1 - Create Consolidation Mapping` with type:refactor label, area:documentation, related to epic
- [ ] T098 Create sub-issue #3: `refactor: Phase 1 - Archive Documentation & Restore Procedures` with type:refactor label, area:documentation, related to epic
- [ ] T099 Create sub-issue #4: `refactor: Phase 1 - Update Main Automation Docs` with type:refactor label, area:documentation, related to epic
- [ ] T100 Create sub-issue #5: `refactor: Phase 1 - Create GitHub Epic + Planning` with type:refactor label, area:project-management, related to epic
- [ ] T101 Add all 6 issues (1 epic + 5 sub-issues) to `Workflow Consolidation Initiative 2026-Q4` project board
- [ ] T102 Link epic to `.github/projects/active/workflow-consolidation-master-plan-2026-09/` in issue description

---

## Phase 5: Polish & Finalization — PR Preparation & Merge

Finalize all changes, validate completeness, and prepare type:refactor PR for review and merge.

**Success Criteria:**
- All files committed with proper attribution
- PR created using type:refactor template
- All validation tests pass
- PR ready for tech lead review
- No breaking changes verified
- Restore procedures validated end-to-end

**Test Criteria:**
- [ ] All validation tests in `quickstart.md` pass
- [ ] Archive directory structure matches specification
- [ ] All 62 workflows present in archive
- [ ] WORKFLOW_CONSOLIDATION_MAPPING.md lists all 76 workflows
- [ ] AUTOMATION.md links work and references are current
- [ ] Restore procedures tested successfully
- [ ] GitHub epic + 5 sub-issues created and linked
- [ ] PR has all required labels: type:refactor, status:needs-review, priority:normal, area:automation

---

- [ ] T103 Run validation script: `bash .github/scripts/validate-phase1.sh` to confirm all 62 workflows archived
- [ ] T104 Run validation Test 1: Verify 62 workflows in archive with correct category structure
- [ ] T105 Run validation Test 2: Verify WORKFLOW_CONSOLIDATION_MAPPING.md contains all 76 workflows with mappings
- [ ] T106 Run validation Test 3: Verify archive documentation complete (README.md, MANIFEST.md, RESTORE.md, INDEX.md)
- [ ] T107 Run validation Test 4: Verify restore procedures work by testing at least one workflow from each category
- [ ] T108 Run validation Test 5: Verify AUTOMATION.md references new architecture and consolidation mapping
- [ ] T109 Run validation Test 6: Verify GitHub PR follows type:refactor template with all required sections
- [ ] T110 Run validation Test 7: Verify GitHub epic created with 5 linked type:refactor sub-issues
- [ ] T111 Commit all changes with message: `refactor: Phase 1 - Backup & Archive 62 workflows with consolidation mapping`
- [ ] T112 Create pull request titled: `refactor: consolidate workflow archive and mapping — Phase 1 prep` with labels: type:refactor, status:needs-review, priority:normal, area:automation
- [ ] T113 Link PR to epic issue and 5 sub-issues in PR description using "Closes #XXXX" and "Relates to #YYYY" format
- [ ] T114 Add Phase 1 test plan to PR description with validation test results
- [ ] T115 Request review from tech lead and archive subject matter expert
- [ ] T116 Address review comments and re-validate if changes made
- [ ] T117 Merge PR to develop branch after approval

---

## Task Dependencies & Execution Order

### Critical Path
1. **Setup (T001-T005):** Archive infrastructure must exist before moving workflows
2. **Foundational (T006-T075):** All workflows must be moved before creating mappings
3. **Documentation (T076-T090):** Mappings depend on workflows being in place
4. **Issues (T091-T102):** Documentation complete before creating issues
5. **Finalization (T103-T117):** All work complete before PR creation

### Parallelization Opportunities
- **T006-T075** can run in parallel (all marked [P]) — different files, independent operations
- **T076-T090** can run in parallel — creating separate documentation files
- **T091-T102** can run in parallel — separate issues and documentation updates
- Within each category move, workflows can be moved simultaneously

### Recommended Sequence
1. **Day 1-2:** T001-T005 (Setup — 2-3 hours)
2. **Day 3-5:** T006-T075 (Move workflows in parallel — 2-3 hours)
3. **Day 6:** T076-T090 (Create documentation — 1.5-2 hours)
4. **Day 7:** T091-T102 (Update docs and create issues — 1-1.5 hours)
5. **Day 8-10:** T103-T117 (Validation, PR, review — 1-2 hours)

---

## Estimated Effort Breakdown

| Phase | Tasks | Effort | Duration |
|-------|-------|--------|----------|
| Setup | T001-T005 | 1-2 hours | Day 1-2 |
| Foundational | T006-T075 | 2-3 hours | Day 3-5 |
| Documentation | T076-T090 | 1.5-2 hours | Day 6 |
| GitHub Issues | T091-T102 | 1-1.5 hours | Day 7 |
| Finalization | T103-T117 | 1-2 hours | Day 8-10 |
| **Total** | **117 tasks** | **8-10 hours** | **10 days** |

---

## Success Metrics

✅ **Phase 1 Complete When:**

- ✅ All 62 workflows archived to `.github/workflows/archived/2026-09-11/`
- ✅ 8 subdirectories created (by category) with correct file counts
- ✅ WORKFLOW_CONSOLIDATION_MAPPING.md complete (all 76 workflows)
- ✅ Archive README, manifest, restore procedures created
- ✅ AUTOMATION.md updated with new architecture
- ✅ GitHub epic + 5 sub-issues created and linked
- ✅ All validation tests pass
- ✅ PR approved and merged to develop branch
- ✅ Zero data loss, full restore capability verified

---

## Related Documentation

- **Master Plan:** `WORKFLOW_CONSOLIDATION_MASTER_PLAN.md`
- **Implementation Plan:** `PHASE_1_IMPLEMENTATION_PLAN.md`
- **Validation Guide:** `quickstart.md`
- **Data Model:** `data-model.md`
- **Formal Spec:** `.github/specs/workflow-consolidation-2026-q4.spec.md`

---

**Tasks Version:** 1.0  
**Created:** Sep 11, 2026  
**Status:** Ready for execution (Sep 16-30, 2026)  
**Branch:** `refactor/workflow-consolidation-and-archiving`  
**PR Type:** `type:refactor`

---
file_type: tasks
title: "PRD Agent Consolidation - Phase 5-7 Implementation Tasks"
description: "Executable task breakdown for Testing & Validation, Team Rollout, and Spec-Based Agent Decision phases"
created_date: 2026-09-11
last_updated: 2026-09-11
status: active
phases:
  - phase: 5
    name: "Testing & Validation"
    user_stories: ["US5.1", "US5.2", "US5.3", "US5.4"]
  - phase: 6
    name: "Team Rollout & Adoption"
    user_stories: ["US6.1", "US6.2", "US6.3"]
  - phase: 7
    name: "Spec-Based Agent Decision"
    user_stories: ["US7.1"]
---

# PRD Agent Consolidation — Phase 5-7 Task Breakdown

**Project**: PRD Combined Agent Consolidation  
**Specification**: `.github/specs/001-prd-agent-consolidation/spec.md`  
**Planning**: `.github/projects/active/prd-combined-agent/PLANNING.md`  
**Status**: Ready for execution (Phases 1-4 complete ✅)

---

## Overview

This task breakdown covers Phase 5 (Testing & Validation), Phase 6 (Team Rollout & Adoption), and Phase 7 (Optional Spec-Based Agent Decision) of the PRD Agent Consolidation project.

**Phase Prerequisites**: Phase 4 prompt enhancement (v2.1) must be complete (PR #1894).

---

## Phase 1: Setup & Prerequisites (META)

These tasks ensure Phase 5-7 are properly scoped and resourced.

- [ ] T001 Verify Phase 4 completion: Confirm PR #1894 merged and v2.1 prompt deployed to agents/prd-agent/shared/core-prompt.md
- [ ] T002 Update issue tracking: Link issues #1896, #1897, #1899 to master epic #1248
- [ ] T003 Create Phase 5 test environment: Set up sandbox repos for testing (block plugin, block theme, hybrid, non-standard)
- [ ] T004 Document rollout timeline: Create rollout calendar in `.github/projects/active/prd-combined-agent/ROLLOUT_TIMELINE.md` with dates for Phase 6 communication

---

## Phase 5: Testing & Validation

**User Story 5.1 (US5.1)**: Auto-Detection Testing

Validate that auto-detection correctly identifies WordPress project type and produces appropriate detection message.

### Acceptance Criteria

- [ ] Block plugin repos: Correctly detect plugin.php + blocks/ structure
- [ ] Block theme repos: Correctly detect theme.json + templates/ structure
- [ ] Hybrid repos: Correctly detect both plugin + theme presence
- [ ] Non-standard repos: Prompt for clarifying questions
- [ ] Custom structures: Adapt based on user confirmation
- [ ] Success target: >95% accuracy across all scenarios

### Tasks

- [ ] T005 [P] [US5.1] Create block plugin test repo at `.github/projects/active/prd-combined-agent/test-repos/block-plugin/` with plugin.php + blocks/ structure
- [ ] T006 [P] [US5.1] Create block theme test repo at `.github/projects/active/prd-combined-agent/test-repos/block-theme/` with theme.json + templates/ structure
- [ ] T007 [P] [US5.1] Create hybrid test repo at `.github/projects/active/prd-combined-agent/test-repos/hybrid/` with both plugin.php and theme.json
- [ ] T008 [P] [US5.1] Create non-standard test repo at `.github/projects/active/prd-combined-agent/test-repos/non-standard/` without clear plugin/theme indicators
- [ ] T009 [P] [US5.1] Create custom-structure test repo at `.github/projects/active/prd-combined-agent/test-repos/custom/` with non-standard folder layout
- [ ] T010 [US5.1] Run auto-detection on all test repos and document results in `.github/projects/active/prd-combined-agent/TEST_RESULTS_PHASE5_AUTO_DETECTION.md`
- [ ] T011 [US5.1] Analyze detection accuracy: Verify accuracy >95%, document edge cases, record confidence scores

---

**User Story 5.2 (US5.2)**: PRD Section Testing

Validate that generated PRD sections are contextually relevant and complete per project type.

### Acceptance Criteria

- [ ] Plugin PRD sections: Block Inventory, Hooks/Filters, WP Compatibility present
- [ ] Theme PRD sections: Theme Settings, Block Patterns, FSE Support present
- [ ] Shared PRD sections: Dependencies, Constraints, Technical Risks always present
- [ ] No irrelevant sections: Theme-specific sections don't appear in plugin PRDs (and vice versa)
- [ ] Content quality: Sections are non-empty and provide actionable guidance

### Tasks

- [ ] T012 [P] [US5.2] Generate PRD on block plugin test repo (T005) and verify plugin-specific sections appear in `.github/projects/active/prd-combined-agent/TEST_RESULTS_PHASE5_SECTIONS_PLUGIN.md`
- [ ] T013 [P] [US5.2] Generate PRD on block theme test repo (T006) and verify theme-specific sections appear in `.github/projects/active/prd-combined-agent/TEST_RESULTS_PHASE5_SECTIONS_THEME.md`
- [ ] T014 [P] [US5.2] Generate PRD on hybrid test repo (T007) and verify both plugin + theme sections appear in `.github/projects/active/prd-combined-agent/TEST_RESULTS_PHASE5_SECTIONS_HYBRID.md`
- [ ] T015 [US5.2] Analyze section relevance: Document irrelevant sections found (if any), confirm shared sections always present across all types

---

**User Story 5.3 (US5.3)**: WordPress Awareness Testing

Validate that WordPress-specific guidance (version compatibility, timeline, risks) is accurate and helpful.

### Acceptance Criteria

- [ ] Version support matrix: Generated with min/max WordPress versions
- [ ] Timeline buffer: 2-4 week testing buffer included in project timeline
- [ ] Risk assessment: WordPress Compatibility and Performance risks identified
- [ ] Release alignment: Recommendations align with WordPress release calendar
- [ ] Guidance quality: Feedback from testers indicates guidance is helpful (>80% positive)

### Tasks

- [ ] T016 [US5.3] Generate PRD on block plugin repo and verify version support matrix in generated document, record min/max versions in `.github/projects/active/prd-combined-agent/TEST_RESULTS_PHASE5_WP_AWARENESS.md`
- [ ] T017 [US5.3] Verify timeline includes 2-4 week testing buffer in generated PRD timeline section
- [ ] T018 [US5.3] Verify technical risks section identifies WordPress Compatibility and Performance risks
- [ ] T019 [US5.3] Cross-reference recommended WordPress versions against official WordPress release calendar, document alignment

---

**User Story 5.4 (US5.4)**: Accessibility Compliance Testing

Validate that all generated PRDs mention WCAG 2.2 AA and include accessibility considerations.

### Acceptance Criteria

- [ ] WCAG 2.2 AA mentioned: In every generated PRD document
- [ ] Accessibility section: Risks and requirements documented
- [ ] Block editor accessibility: Testing and compliance considerations included
- [ ] No compliance gaps: Zero missing accessibility references in critical sections

### Tasks

- [ ] T020 [P] [US5.4] Generate 3 PRDs (plugin, theme, hybrid) and search for "WCAG 2.2 AA" mentions, document coverage in `.github/projects/active/prd-combined-agent/TEST_RESULTS_PHASE5_ACCESSIBILITY.md`
- [ ] T021 [P] [US5.4] Analyze accessibility section completeness: Verify risk assessment includes accessibility, verify acceptance criteria include accessibility testing
- [ ] T022 [P] [US5.4] Verify block editor accessibility covered: Check for screen reader testing, keyboard navigation, accessible attributes in generated content
- [ ] T023 [US5.4] Compile accessibility audit results: Document any gaps, provide recommendations for v2.2 enhancement

---

**Phase 5 Completion & Validation**

- [ ] T024 [P] Compile Phase 5 test report: Aggregate results from T010, T015, T019, T023 into `.github/projects/active/prd-combined-agent/PHASE5_TEST_REPORT.md`
- [ ] T025 [US5.1] [US5.2] [US5.3] [US5.4] Verify success criteria: Confirm auto-detection >95% accuracy, sections contextually relevant, WordPress guidance accurate, WCAG 2.2 AA coverage complete
- [ ] T026 Document phase closure: Update issue #1896 with test results link, mark phase ready for Phase 6

---

## Phase 6: Team Rollout & Adoption

**User Story 6.1 (US6.1)**: Documentation Updates

Create comprehensive documentation to support team adoption of v2.1 enhancements.

### Acceptance Criteria

- [ ] AGENT.md updated: V2.1 feature summary, auto-detection behavior, WordPress awareness section added
- [ ] CONTEXT_DETECTION.md created: Auto-detection logic, detection criteria, troubleshooting guide
- [ ] ORGANIZATION_CONTEXT.md created: Single-agent rationale, adoption roadmap
- [ ] Documentation quality: Links resolve, examples work, no TODOs remain

### Tasks

- [ ] T027 Update agents/prd-agent/AGENT.md: Add v2.1 feature summary section describing auto-detection, WordPress awareness, enhanced PRD sections
- [ ] T028 Create agents/prd-agent/CONTEXT_DETECTION.md: Document auto-detection logic, per-project-type detection criteria, troubleshooting guide with examples
- [ ] T029 Create agents/prd-agent/ORGANIZATION_CONTEXT.md: Explain why single portable agent serves all use cases, document adoption roadmap (from v2.0 → v2.1), include workflow examples
- [ ] T030 Validate documentation: Run lint checks on Markdown, verify all internal links resolve, confirm examples are syntactically correct

---

**User Story 6.2 (US6.2)**: Team Communication & Adoption

Communicate v2.1 improvements to all stakeholder teams and drive adoption.

### Acceptance Criteria

- [ ] Team communication complete: Product managers, developers, designers/QA, QA/testing teams notified
- [ ] Demo executed: Live auto-detection demo presented to at least one team
- [ ] Adoption initiated: At least 3 teams actively using enhanced agent
- [ ] Feedback collected: >80% initial feedback positive (from teams using agent)
- [ ] Documentation accessible: FAQ and guides linked in team communications

### Tasks

- [ ] T031 [P] Create Phase 6 team communication plan: Document messaging per audience (PMs, developers, designers, QA) in `.github/projects/active/prd-combined-agent/ROLLOUT_COMMUNICATION_PLAN.md`
- [ ] T032 [P] Draft PM communication: Highlight auto-detection saving setup time, WordPress version compatibility as first-class concern
- [ ] T033 [P] Draft developer communication: Highlight WordPress constraints, testing cycle buffer, block editor accessibility
- [ ] T034 [P] Draft designer/UX communication: Highlight FSE support, block editor experience, design tokens sections
- [ ] T035 [P] Draft QA/testing communication: Highlight compatibility matrices, WP version testing cycles, accessibility compliance
- [ ] T036 [US6.2] Send PM communication: Email or Slack message to product team with v2.1 summary link, schedule demo
- [ ] T037 [US6.2] Send developer communication: Email or Slack message to engineering team with WordPress awareness benefits, link to CONTEXT_DETECTION.md
- [ ] T038 [US6.2] Send designer/UX communication: Email or Slack message to design team highlighting FSE and theme support
- [ ] T039 [US6.2] Send QA/testing communication: Email or Slack message to QA team highlighting compatibility testing and accessibility baseline
- [ ] T040 [US6.2] Demo auto-detection live: Present 5-10 minute demo showing plugin/theme/hybrid detection in a team meeting, record demo or document outcomes
- [ ] T041 [US6.2] Create rollout FAQ: Document common questions from team communications in `.github/projects/active/prd-combined-agent/ROLLOUT_FAQ.md`

---

**User Story 6.3 (US6.3)**: Adoption Monitoring & Feedback

Monitor team adoption and collect feedback for future iterations.

### Acceptance Criteria

- [ ] Adoption metrics collected: At least 3 teams actively using agent confirmed
- [ ] Feedback captured: Team feedback on auto-detection, PRD sections, WordPress guidance recorded
- [ ] Issue tracking: Known issues or enhancement requests documented
- [ ] Iteration backlog: Prioritized list of follow-up improvements created

### Tasks

- [ ] T042 [P] Create adoption tracking form: Document in `.github/projects/active/prd-combined-agent/ADOPTION_TRACKING.md` with fields for team name, date started, auto-detection accuracy, feedback
- [ ] T043 [P] Monitor team usage: Check GitHub issues, Slack, and team channels for agent usage signals (PRD generation requests, auto-detection mentions)
- [ ] T044 [P] Collect feedback survey: Create brief survey (3-5 questions) on auto-detection, PRD relevance, WordPress guidance clarity, link in team channels
- [ ] T045 [US6.3] Analyze adoption data: Aggregate team count, usage patterns, feedback sentiment in `.github/projects/active/prd-combined-agent/PHASE6_ADOPTION_REPORT.md`
- [ ] T046 [US6.3] Document iteration backlog: Create prioritized list of enhancement requests in `.github/projects/active/prd-combined-agent/ENHANCEMENT_BACKLOG.md`
- [ ] T047 Update issue #1897: Link Phase 6 adoption report, document rollout metrics (teams using, feedback %, critical issues), mark phase ready for Phase 7

---

## Phase 7: Spec-Based Agent Decision

**User Story 7.1 (US7.1)**: Decide on Spec-Based Agent Fate

Make final decision on maintaining dual agent versions (`.github/agents/mode-prd.agent.md` + portable) or consolidating to single canonical version.

### Acceptance Criteria

- [ ] Decision made: Option A (Archive) or Option B (Dual Maintenance) chosen
- [ ] Rationale documented: Decision reasoning and expected outcomes
- [ ] Implementation planned: Clear path forward based on chosen option
- [ ] Stakeholders notified: Teams aware of decision and implications
- [ ] Phase 7 issue closed: #1899 marked complete with decision record

### Tasks

- [ ] T048 Gather Phase 6 adoption metrics: Review PHASE6_ADOPTION_REPORT.md and team feedback, summarize findings for decision gate
- [ ] T049 Evaluate dual-maintenance cost: Estimate effort/risk of keeping `.github/agents/mode-prd.agent.md` in sync with portable version, document in `.github/projects/active/prd-combined-agent/DECISION_CONTEXT.md`
- [ ] T050 Compile decision package: Summarize both options (Archive vs. Dual Maintenance), adoption metrics, maintenance costs in decision memo
- [ ] T051 [US7.1] Make decision: Review adoption data and decision package, choose Option A (Archive, recommended) or Option B (Dual Maintenance)
- [ ] T052 Document decision: Record decision rationale in `.github/projects/active/prd-combined-agent/PHASE7_DECISION_RECORD.md` including chosen option and expected outcomes
- [ ] T053 [US7.1] If Option A (Archive): Move `.github/agents/mode-prd.agent.md` → `.github/projects/archive/agents/mode-prd.agent.md`, update any workflows referencing it
- [ ] T054 [US7.1] If Option B (Dual Maintenance): Sync `.github/agents/mode-prd.agent.md` with portable `agents/prd-agent/` version, document sync process
- [ ] T055 Update issue #1899: Post decision record, close phase, create any follow-up issues if needed

---

## Phase 8: Project Closure & Handoff

- [ ] T056 Update master epic #1248: Mark all phases complete, link to all phase reports and decision records, update status to ✅ COMPLETE
- [ ] T057 Create handoff documentation: Summarize what was delivered (28 canonical skills, v2.1 prompt, multi-provider support) in `.github/projects/active/prd-combined-agent/PROJECT_COMPLETION_SUMMARY.md`
- [ ] T058 Archive project folder: Move to `.github/projects/complete/prd-combined-agent/` for historical reference
- [ ] T059 Plan future iterations: Document long-term maintenance strategy (monitoring adoption, handling requests, v2.2+ roadmap) in `.github/projects/active/prd-combined-agent/MAINTENANCE_STRATEGY.md`

---

## Task Dependencies & Execution Order

### Sequential Blocks (Must Complete in Order)

1. **Setup** (T001-T004): Prerequisites must be validated before Phase 5 starts
2. **Phase 5** (T005-T026): All testing must complete before Phase 6 communication
3. **Phase 6** (T027-T047): Documentation and communication before Phase 7 decision
4. **Phase 7** (T048-T055): Decision based on Phase 6 metrics
5. **Closure** (T056-T059): Handoff after all phases complete

### Parallel Opportunities Within Phases

**Phase 5 Testing** (after T004 setup):
- T005-T009: Test repo creation (all parallelizable [P])
- T012-T014: Section testing (all parallelizable [P])
- T020-T022: Accessibility testing (all parallelizable [P])

**Phase 6 Communication** (after T027-T030 documentation):
- T031-T035: Team communication drafts (all parallelizable [P])
- T032-T035: Audience-specific drafts can run in parallel

**Phase 6 Monitoring** (after T040 demo):
- T042-T044: Adoption tracking (all parallelizable [P])

### Blocking Dependencies

| Task | Blocks | Reason |
|------|--------|--------|
| T004 | T005-T009 | Test environment must exist |
| T010 | T011 | Analysis requires test results |
| T024 | T025 | Report completion required before validation |
| T025 | T026 | Success criteria must pass before closure |
| T026 | T027 | Phase 5 must complete before Phase 6 starts |
| T040 | T041 | Demo feedback informs FAQ |
| T045 | T046 | Metrics must be analyzed before backlog prioritized |
| T047 | T048 | Phase 6 must complete before Phase 7 decision |
| T048 | T051 | Metrics must be gathered before decision made |

---

## Implementation Strategy

### MVP Scope

**Phase 5** (Testing & Validation):
- Execute all 4 test user stories (T005-T026)
- Validate >95% auto-detection accuracy
- Confirm contextual PRD sections
- Document results for decision gate

### Phased Delivery

**Phase 6** (Team Rollout):
- Documentation updates (Week 1)
- Team communication + demo (Week 2)
- Monitoring + feedback collection (Weeks 2-3)
- Adoption report (Week 4)

**Phase 7** (Decision):
- Decide on spec-based agent (Week 5)
- Implement chosen option (Week 5-6)
- Project closure (Week 6)

### Quality Gates

- **After Phase 5**: Auto-detection >95%, no critical test failures → Proceed to Phase 6
- **After Phase 6**: ≥3 teams active, >80% positive feedback → Proceed to Phase 7
- **After Phase 7**: Decision implemented, no critical issues → Project complete

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Auto-detection accuracy | >95% | T011 test results |
| Team adoption | ≥3 teams | T045 adoption report |
| Feedback sentiment | >80% positive | T045 adoption report |
| Documentation quality | 100% links resolve | T030 validation |
| Project completion | All phases done | T056-T059 closure tasks |

---

**Generated**: 2026-09-11  
**Specification**: `.github/specs/001-prd-agent-consolidation/spec.md`  
**Planning Reference**: `.github/projects/active/prd-combined-agent/PLANNING.md`  
**Master Epic**: #1248 (PRD Combined Agent Project)

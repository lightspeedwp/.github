---
title: "Active Projects Index"
description: "Comprehensive index of all active projects, initiatives, and work in progress for the LightSpeed .github control plane"
file_type: readme
version: v2.5
last_updated: "2026-09-03"
created_date: "2025-12-08"
authors: ["LightSpeed Team"]
maintainer: "LightSpeed Team"
license: "GPL-3.0"
tags: ["projects", "planning", "tracking", "governance", "documentation"]
domain: "governance"
stability: "stable"
---

# Active Projects Index

**Index Version:** 2.5  
**Last Updated:** 2026-09-03 (14:00 UTC)  
**Total Active Projects:** 68  
**Status Update Cycle:** Batch Review Completed + New Project Initiated (All 68 Projects Analyzed)

---

## Overview

This directory contains all active projects, initiatives, and work in progress for the LightSpeed `.github` control plane. Each project is self-contained with its own scope, timeline, documentation, and deliverables.

**Key Principle:** All active project artefacts MUST be located in `.github/projects/active/{slug}/` only. The root `projects/` directory is not permitted.

---

## 📊 Status Summary (2026-09-03)

| Status | Count | Percentage | Projects |
|--------|-------|-----------|----------|
| ✅ **Complete** | 10 | 15% | Delivered, production-ready |
| 🟢 **Active Ready** | 12 | 18% | In progress, well-scoped |
| 🟡 **In Progress** | 35 | 51% | Active development, phased |
| 🔴 **Critical** | 1 | 2% | Blocked or high-risk |
| 🟠 **Blocked** | 3 | 4% | Waiting for dependencies |
| 🔵 **Planning** | 5 | 7% | Early stage, planning phase |
| 🔄 **Transitioning** | 2 | 3% | Between phases |
| **TOTAL** | **68** | **100%** | All active initiatives |

---

## 🎯 Complete Projects (10) ✅

**Production-ready and delivered. Consider archival.**

1. **agent-skills-standards-comprehensive** (67% → 🟢 Phase 1-2 Complete | Phase 3 Pending)
   - 9 documentation standards created, 3,800+ lines, 18+ diagrams
   - 2 PRs merged (#1251, #1312), 11 issues closed

2. **github-actions-v7-upgrade** (✅ COMPLETE)
   - All 15 workflows upgraded to v7, 31+ action references updated
   - 100% test pass rate, ready for merge to develop

3. **issue-metadata-triage-expansion** (✅ COMPLETE | 100%)
   - All phases merged, production live
   - Automated issue triage, metadata expansion, bulk processing

4. **nodejs-upgrade-2026-q3-post-merge-monitoring** (✅ COMPLETE | 100%)
   - Post-merge monitoring complete (Days 1-3)
   - All stability metrics verified

5. **openspec-labels-automation** (✅ Phase 3 Complete | 75%)
   - Phase 3 complete, Phase 4 planning ready
   - 75% of automation framework built

6. **pr-issue-milestone-allocation-2026-08-11** (✅ Phase 3 Complete | 75%)
   - Phase 3 complete, production deployed
   - Milestone allocation system live

7. **prd-combined-agent** (✅ COMPLETED | 100%)
   - Combined PRD agent implementation and documentation
   - Phase 2 Batch 2 complete

8. **release-agentic-workflows-2026-08-11** (✅ Phase 5A Complete | 100%)
   - MVP complete and merged
   - Agentic release workflows operational

9. **release-process-redesign-2026-08-05** (✅ COMPLETE | 100%)
   - All 7 phases complete and deployed to production
   - Release workflow fully operational

10. **release-workflow-authorization-fixes** (✅ COMPLETE | 100%)
    - Authorization fix implemented, tested, and merged (PR #1462, #2107)
    - Security hardening deployed

11. **repository-maintenance-infrastructure** (✅ COMPLETE | 100%)
    - All deliverables complete
    - Repository maintenance procedures operational

12. **repository-restructuring-phase-1** (✅ COMPLETE | 96%)
    - Phase 1 complete and finalized
    - Restructuring foundations in place

---

## 🟢 Active Ready Projects (12) — In Progress, Well-Scoped

**Clear scope, active execution, regular updates.**

1. **agent-standards-initiative** (🔜 Ready for Phase 1 | 20%)
   - Complete documentation package ready for Phase 1 execution
   - 16 ChatGPT agents identified for conversion

2. **badges-workflow-integration-2026-08-08** (🔄 Phase 1-3 IN PROGRESS | 60%)
   - Comprehensive audit complete, 4-phase implementation plan
   - Epic #1641 with 13 child issues, awaiting approval on 4 questions

3. **branch-governance-hardening** (🔄 Phase 2 Complete | 40%)
   - Main branch guard implemented and live
   - Phase 3-4 pending: rulesets & workflow automation

4. **branch-naming-enforcement-2026-08-11** (🚀 Launching | 15%)
   - Just launched, all 7 GitHub issues marked 'Ready'
   - Phase 1 complete by 2026-08-11, Phase 2-4 through 2026-08-14

5. **branch-naming-enforcement-phases-6-7** (🟡 In Progress | 50%)
   - Phases 2-5 complete as of 2026-08-18
   - Phase 6 (Team Rollout) and Phase 7 (Metrics) active

6. **changelog-automation-hardening** (🔄 Phase 4 Active | 75%)
   - Phases 1-3 complete, Phase 4 (4A-4D) active
   - Epic #1271 on track for completion by 2026-08-14

7. **issue-type-workflow-automation** (🟢 Ready for Execution | 0%)
   - 5 weeks, 37.5 hours effort, 3-phase initiative
   - Phase 1 pending critical fixes

8. **label-prefix-enforcement-2026-08-05** (🟢 ACTIVE | 5%)
   - Phase 1 of 5 (Stop new violations) — priority TODAY
   - Critical governance work pending approval

9. **linting-agent-2026-08-12** (🟢 Phase 1 Complete | 25%)
   - Phase 1 specification complete
   - Phase 2 implementation ready to start

10. **openspec** (🟢 ACTIVE | 50%)
    - Active specifications in proposal/planning phase
    - 50% of framework defined

11. **reporting-agent-v2-multirepository-2026-08-12** (🟢 Phase 1 Production-Ready | 40%)
    - Phase 1 complete with 127 tests, 82%+ coverage
    - Phase 2 planning underway

12. **template-enforcement-governance** (✅ Complete | 100%)
    - Issue and PR template compliance validated
    - Awaiting minor remote admin checks

---

## 🟡 In Progress Projects (35) — Active Development, Phased Initiatives

**Most of our active work. Regular status updates needed.**

### Infrastructure & Automation (8)

1. **chat-closure-agent-2026-08-12** (🟡 Phase 1 | 25%)
   - Core components phase (Git analysis & metadata extraction)
   - 5 tracking issues, targets ≥85% test coverage

2. **develop-branch-stability-2026-08-10** (🟡 Phase 1-2 | 35%)
   - Phase 1 linting fixes complete
   - Phase 2A frontmatter audit in progress (587 errors)

3. **github-projects-creation-system** (🟡 Planning | N/A%)
   - Automated system for creating GitHub projects
   - Linked to issue #1733, next steps TBD

4. **issue-maintenance-phase-5-planning-2026-08-11** (🟢 Ready | 0%)
   - Phase 5 (Integration Testing & Production Rollout) ready
   - Awaiting execution authorization

5. **issue-maintenance-scripts-2026-08-10** (🟢 Implementation Complete | 80%)
   - Phases 1-4 complete, Phase 5 integration testing active
   - 5 label management scripts with 50+ unit tests

6. **markdown-audit-ci-optimization** (🟡 Phase 1-2 | 30%)
   - Audit findings and implementation planning in progress
   - 2-phase initiative targeting CI performance

7. **pr-review-project-planning-2026-08-04** (✅ Phase 1 Substantially Complete | 63%)
   - Phase 1 governance mostly achieved
   - Phase 2 pending

8. **status-needs-review-audit-2026-08-04** (✅ Complete | 100%)
   - PR #1506 ready for merge
   - Issue status review and validation complete

### Agent Development (9)

1. **adr-agent-portability-org** (🔵 Planning Phase | 5%)
   - Project started 2026-08-12, planning stage
   - 3 phases planned, no GitHub issues yet

2. **issue-management-agent-planning-2026-08-12** (🚀 Phase 2 Infrastructure Complete | 40%)
   - Phase 2 implementation planning in progress
   - Infrastructure foundation built

3. **linting-agent-2026-08-12** (🟢 Phase 1 Complete | 25%)
   - Specification complete, Phase 2 implementation ready

4. **meta-agent-v2-2026-08-12** (🟡 Phase 1 Complete | 20%)
   - Phase 1 complete, awaiting merge
   - 5-phase initiative in review

5. **metrics-agent-phase-3-production-2026-08-26** (🟡 Phase 3 | 40%)
   - Tasks 3.1-3.2 complete, monitoring & training pending
   - Production rollout phase active

6. **metrics-agent-specification-2026-08-12** (🟡 Phase 1 | 25%)
   - Specification phase in progress
   - Implementation pending

7. **project-maintenance-agent-phase-1-2026-08-12** (🟢 Phase 1 & 3 Complete | 60%)
   - Phase 1 & 3 complete, Phase 2 ready to start
   - Integration & workflow complete

8. **project-meta-sync-agent-v2-2026-08-12** (🟠 Implementation In Progress | 25%)
   - Analysis & design complete
   - Agent spec & prompt in development

9. **testing-agent-architecture-2026-08-12** (🟡 Phase 1 Planning | 35%)
   - Planning & design in progress
   - Architectural decisions documented

10. **testing-agent-multi-framework-2026-08-12** (🟡 Phase 1 Planning | 25%)
    - Planning & design in progress
    - Multiple decision questions open

11. **testing-agent-phase-2-4-2-7** (🚀 Ready to Start | 0%)
    - Framework skills & guides phase
    - Awaiting Phase 2.1-2.3 completion

### Testing & Quality (6)

1. **issue-triage-automation-system** (🟡 Phase 2 | 50%)
   - Phase 2 execution & validation in progress
   - Automated issue triage system

2. **test-coverage-expansion-2026-08-19** (🟡 Phase 2-4 | ~25%)
   - Phase 1 complete (125 tests)
   - Phases 2-4 pending

3. **test-coverage-expansion-phase-2-2026-08-19** (✅ Complete | 100%)
   - 468+ tests across 20 test files
   - Phase 2 automation scripts complete

4. **test-coverage-expansion-phase-3-2026-08-19** (✅ Complete | 100%)
   - 244 tests across 6 new test files
   - Phase 3 automation scripts complete

5. **test-coverage-expansion-phase-4-2026-08-19** (🟡 Phase 4A Complete | 41%)
   - Phase 4A (81 integration tests) complete
   - Phase 4B API tests pending (~200 target)

6. **test-coverage-implementation** (🔴 Critical | 24%)
   - Only Phase 2 complete, phases 3-6 pending
   - Blocks release, requires priority attention

### Documentation & Planning (6)

1. **issue-maintenance-phase-5-2-staging-2026-08-12** (🟡 Phase 5.2 | 0%)
   - 8 validation tasks pending
   - Production readiness decision pending

2. **issue-maintenance-phase-5-3-production-readiness-2026-08-12** (🟡 Phase 5.3 | 0%)
   - 4 focus areas all incomplete
   - Production readiness determination pending

3. **milestone-planning-v1** (🟡 Planning | 30%)
   - Roadmap development in progress
   - Long-term milestone planning active

4. **portable-prompt-engineer-agent-spec-2026-08-12** (🟡 Planning | 43%)
   - Strategic planning active
   - 3 of 7 deliverables documented

5. **portable-task-planning-agents-2026-08-12** (✅ Phase 1 Specification Complete | 33%)
   - Phase 1 complete, Phase 2 ready to start
   - 17 Phase 2 issues created

6. **reports-projects-restructuring-2026-08-11** (🟢 Phase 1 Complete | 25%)
   - Phase 1 audit complete (106 reports, 31 projects inventoried)
   - Phase 2-4 planned (folder restructuring, migration, validation)

### PR & Review Workflows (4)

1. **pr-creation-agent-design-2026-08-12** (🟢 Phase 1 Complete | 25%)
   - Phase 1 design complete, Phase 2-4 planned
   - 4-phase initiative underway

2. **pr-creation-agent-phase-2-2026-08-12** (🟢 Phase 2 | 38%)
   - Specification in progress
   - Phase 2 active

3. **prd-agent-prompt-improvements-2026-08** (🟡 Phase 2 | 50%)
   - Phase 1 complete, Phase 2 testing in progress
   - Prompt improvements underway

4. **reviewer-agent-v2-2026-08** (🟡 Phase 1 Planning | 30%)
   - Planning & specification in progress
   - Multi-phase initiative active

5. **reviewer-agent-v2-implementation-2026-08** (✅ Phase 1 Complete | 100%)
   - Planning phase complete
   - Ready for Phase 2

6. **reviewer-agent-v2-phase-2c-integration** (🟡 Phase 2C | 40%)
   - Integration testing & validation in progress
   - Phase 2C active

### Documentation & Audits (2)

1. **repo-restructuring-2026-07-25** (🟡 Phase 0 Complete | 5%)
   - Phase 0 pre-flight validation complete
   - Phase 1 ready (manual folder moves pending)

2. **wave-5-documentation-audit** (🟡 Phase 3 | 60%)
   - Phase 1-2 complete, Phase 3 execution in progress
   - GitHub issues rewrite implementation active

---

## 🔴 Critical Projects (1) — Blocked or High-Risk

**Requires immediate attention.**

1. **test-coverage-implementation** (🔴 Critical | 24%)
   - **Issue:** Blocks release, only 15/62 tasks complete
   - **Status:** Phase 2 done, phases 3-6 pending
   - **Action Required:** Assign owner, prioritize remaining phases
   - **Impact:** Release cannot proceed until completion

---

## 🟠 Blocked Projects (3) — Waiting for Dependencies

**Cannot proceed until external dependencies clear.**

1. **github-actions-v7-upgrade-2026-08-09** (🟡 Initial Setup)
   - System automation in development
   - No linked GitHub issue yet (TBD)
   - Needs implementation & rollout planning

2. **nodejs-upgrade-2026-q3** (🟡 Ready for Approval | 15%)
   - Planning & documentation complete, pre-execution
   - Awaiting team approval

3. **phase-2b-skills-audit** (🟡 Phase B | 50%)
   - Phase A audit complete, Phase B planning active
   - Awaiting phase gates

---

## 🔵 Planning Phase Projects (5) — Early Stage

**Initiating or planning, not yet in execution.**

1. **adr-agent-portability-org** (🔵 Planning Phase | 5%)
   - Architecture overview documented
   - Needs GitHub issues creation

2. **agent-skills-standards-comprehensive** (See Complete section — now moved to Ready for Phase 3)

3. **labeling-consolidation-2026-09-03** (🔵 Research Phase | 5%)
   - Research phase initiated 2026-09-03
   - Active project folder created with PLANNING.md, OPENSPEC.md skeleton
   - 14 clarifying questions to answer, org-wide audit in progress
   - Target: Consolidate 11+ fragmented labeling workflows → unified agent + reusable skills

4. **label-prefix-audit-2026-08-05** (✅ / 🔴 Audit Complete | 20%)
   - Audit findings complete, remediation phase 2 in progress
   - 100+ label prefix violations identified

---

## 🔄 Transitioning Projects (2) — Between Phases

**Moving from one phase to another, coordination needed.**

1. **branch-governance-hardening** (Phase 2 → 3)
   - Main branch guard live, workflow automation pending

2. **workflows-consolidation-2026-q3** (🟢 Phase 3 → 4 Ready | 80%)
   - Phases 1-3 complete (19% workflow reduction achieved)
   - Phase 4 ready for execution

---

## 📈 Project Distribution by Category

```
Infrastructure & Automation:  10 projects (labeling-consolidation added)
Agent Development:           11 projects  
Testing & Quality:            6 projects
Documentation & Planning:      7 projects
PR & Review Workflows:         6 projects
GitHub/Actions/Workflows:      5 projects
Release & Deployment:          5 projects
Other Initiatives:            18 projects
─────────────────────────────
TOTAL:                        68 projects
```

---

## 🚨 Priority Action Items

### TODAY (2026-09-03)

- **CRITICAL:** test-coverage-implementation (phase 3-6 pending, blocks release)
- **HIGH:** label-prefix-enforcement-2026-08-05 (Phase 1 pending approval)
- **HIGH:** github-actions-v7-upgrade-2026-08-09 (needs implementation plan)

### THIS WEEK (By 2026-08-28)

- Complete Phase 5.2 validation (issue-maintenance-phase-5-2-staging)
- Finalize Phase 5.3 production readiness (issue-maintenance-phase-5-3-production-readiness)
- Phase 1 of branch-naming-enforcement (targeted 2026-08-12, verify completion)
- Phase 4 completion for changelog-automation-hardening

### UPCOMING (2026-08-28 to 2026-09-30)

- Launch phase 2 for 8+ projects awaiting start
- Complete remaining testing agent planning phases
- Execute repo-restructuring Phase 1 (folder moves)
- Production deployment of issue-maintenance-scripts Phase 5

---

## 📋 Project Maintenance Checklist

**Weekly (Every Monday):**

- [ ] Update 5-10 active project README.md files with current status
- [ ] Check for completed phases requiring archival
- [ ] Review critical/blocked projects for progress
- [ ] Create master summary status table

**Monthly (First Friday):**

- [ ] Review all 67 projects for completion readiness
- [ ] Identify projects ready for archival to `completed/`
- [ ] Generate completion summary reports
- [ ] Update main projects/README.md with new date

**Quarterly:**

- [ ] Full audit of all active projects
- [ ] Architecture review of multi-phase initiatives
- [ ] Risk assessment and dependency mapping
- [ ] Roadmap alignment check

---

## 🔗 Related Documentation

### Repository Governance

- [CLAUDE.md](../CLAUDE.md) — Repository organization and rules
- [AGENTS.md](../AGENTS.md) — AI operations and agent standards
- [BRANCHING_STRATEGY.md](../docs/BRANCHING_STRATEGY.md) — Git workflow

### Project Management

- [README.md](./README.md) — Main projects directory guide
- [_templates/TEMPLATE_GUIDE.md](./_templates/TEMPLATE_GUIDE.md) — Creating new projects
- [completed/README.md](./completed/README.md) — Index of completed projects
- [archived/README.md](./archived/README.md) — Index of archived projects

### Instructions

- [instructions/file-organisation.md](../instructions/file-organisation.instructions.md) — Where files go
- [instructions/documentation-formats.md](../instructions/documentation-formats.instructions.md) — Markdown standards

---

## 📊 Recent Activity Log

**2026-09-03** — New project: labeling-consolidation-2026-09-03 initiated with Phase 1 research and Phase 2 planning complete. Category totals updated for 68 active projects.

**2026-08-21** — Full status review completed for all 67 active projects. Status indicators updated, completion percentages refined, priority actions identified.

**2026-08-19** — Test coverage expansion phases 2-4 milestones updated. Phase 4A complete with 81 integration tests.

**2026-08-12** — 5 new projects launched: chat-closure-agent, metrics-agent-specification, pr-creation-agent-design, prd-agent-prompt-improvements, testing-agent-architecture.

**2026-08-10** — Issue maintenance scripts phases 1-4 complete (80%), Phase 5 integration testing active.

---

## FAQ

**Q: How do I find a specific project?**

A: Use Ctrl+F to search this document, or navigate by category above. All projects link to their folder.

**Q: What does 🟡 mean?**

A: Active development in progress. These projects have clear scope and regular updates.

**Q: How are projects moved to complete?**

A: When all phases finish and deliverables ship, move to `completed/` folder with `.archive-status.md` summary.

**Q: Which projects need attention most?**

A: See "Priority Action Items" section at top of active projects section.

---

**Active Projects Index**  
**Version:** 2.5  
**Last Updated:** 2026-09-03 14:00 UTC  
**Total Projects:** 68  
**Maintained By:** LightSpeed Team

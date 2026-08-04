---
title: Active Projects Index
description: Central index of all active projects in the .github control plane
version: 1.1.0
file_type: index
status: active
last_updated: 2026-08-04
---

# Active Projects Index

Central registry of all active projects within the LightSpeed `.github` control plane.

## 🟢 Recently Completed (2026-08-04)

### [Node.js 22 Upgrade 2026-Q3](./active/nodejs-upgrade-2026-q3/)

**Status:** ✅ COMPLETE  
**Epic:** [#1420](https://github.com/lightspeedwp/.github/issues/1420)  
**Description:** Upgrade .github repository from Node 20 to Node 22  
**Deliverables:** Successful upgrade & deployment, 1571/1571 tests passing  
**Key Files:** [README.md](./active/nodejs-upgrade-2026-q3/README.md)

### [Node.js 22 Upgrade — Post-Merge Monitoring](./active/nodejs-upgrade-2026-q3-post-merge-monitoring/)

**Status:** ✅ COMPLETE (3-day monitoring: 2026-07-30 to 2026-08-04)  
**Epic:** [#1432](https://github.com/lightspeedwp/.github/issues/1432) (CLOSED)  
**Description:** Post-merge stability and performance verification  
**Result:** Node.js 22 **PRODUCTION READY** with zero issues  
**Deliverables:**

- ✅ All 3 monitoring days executed and passed
- ✅ Day 3 blocker (path resolution) fixed in PR #1487
- ✅ Sign-off documentation complete
- ✅ Comprehensive monitoring reports and verification
**Key Files:**
- [README.md](./active/nodejs-upgrade-2026-q3-post-merge-monitoring/README.md)
- [DAY_3_BLOCKER_FIX_PROMPT.md](./active/nodejs-upgrade-2026-q3-post-merge-monitoring/DAY_3_BLOCKER_FIX_PROMPT.md)
- [QUICK_REFERENCE.md](./active/nodejs-upgrade-2026-q3-post-merge-monitoring/QUICK_REFERENCE.md)

### [Repository Maintenance Infrastructure](./active/repository-maintenance-infrastructure/)

**Status:** ✅ COMPLETE  
**Description:** Infrastructure and tooling for repository health and maintenance  
**Deliverables:** Maintenance framework established and operational

### [PRD Combined Agent](./active/prd-combined-agent/)

**Status:** ✅ COMPLETE  
**Description:** Product requirements and specification for combined agent implementation  
**Deliverables:** Agent specification finalized and ready for implementation

---

## 🟡 Active In Progress

### [Workflows Consolidation 2026-Q3](./active/workflows-consolidation-2026-q3/)

**Status:** 🟡 ACTIVE (Phase 3.3 Merged — PR #1496)  
**Epic:** [#1227](https://github.com/lightspeedwp/.github/issues/1227)  
**Description:** Consolidate 31 workflows → 25, eliminate duplication, improve maintainability  
**Recent Progress:**

- ✅ Phase 3.3: Labeling Workflows Consolidation (merged PR #1496)
  - Deleted legacy workflows: `dependabot-security-label.yml`, `issue-close-label-hygiene.yml`
  - Unified into single `labeling-governance.yml`
  - Created comprehensive documentation: `docs/LABELING_GOVERNANCE.md` (360 lines)
  - **Metrics:** 46% code reduction, 67% GitHub Actions savings
- ✅ Phase 2B: Portable Scripts Migration (removed `.github/scripts/workflows/` — 17 duplicate files, 2,503 lines)
**Next:** Phase 3.4+ consolidation tasks  
**Key Files:** [README.md](./active/workflows-consolidation-2026-q3/README.md)

### [Issue Triage Automation System](./active/issue-triage-automation-system/)

**Status:** 🟡 ACTIVE (Phase 2 Execution)  
**Epic:** [#1376](https://github.com/lightspeedwp/.github/issues/1376)  
**Description:** Automated issue triage to fix 250 non-compliant issues and prevent future automation failures  
**Recent Progress:**

- ✅ Phase 1: Implementation complete (40 hours)
- 🟡 Phase 2: Execution & validation (merged PR #1488)
  - Unit tests created for MilestoneAssignmentAgent (28 tests, 81% coverage)
  - Dry-run execution validated against 250 issues
  - Critical governance findings documented
**Next:** Apply fixes to remaining issues based on Phase 2C validation  
**Key Files:** [README.md](./active/issue-triage-automation-system/README.md)

### [Release Workflow Authorization Fixes](./active/release-workflow-authorization-fixes/)

**Status:** 🟡 IN PROGRESS  
**Issue:** [#1453](https://github.com/lightspeedwp/.github/issues/1453)  
**Description:** Fix pre-existing authorization failure in release.yml workflow (42+ days old)  
**Solution:** Made telemetry check non-blocking to unblock downstream jobs (PR #1460)  
**Status Details:** Critical issues identified but solution applied  
**Key Files:** [README.md](./active/release-workflow-authorization-fixes/README.md)

### [Phase 2B Skills Audit](./active/phase-2b-skills-audit/)

**Status:** 🟡 ACTIVE  
**Description:** Comprehensive audit and consolidation of skills portfolio  
**Focus:** Standards enforcement and portfolio rationalization

### [Template Enforcement Governance](./active/template-enforcement-governance/)

**Status:** 🟡 ACTIVE  
**Description:** Enforce standardised PR/issue templates and governance  
**Related:** Template routing automation

### [Test Coverage Implementation](./active/test-coverage-implementation/)

**Status:** 🟡 ACTIVE  
**Description:** Expand and standardise test coverage across projects  
**Related:** Phase 2C validation and coverage metrics

### [Agent Standards Initiative](./active/agent-standards-initiative/)

**Status:** 🟡 ACTIVE  
**Description:** Establishing standardised frameworks for agent development  
**Focus:** Documentation standards and best practices

### [Milestone Planning v1](./active/milestone-planning-v1/)

**Status:** 🟡 ACTIVE  
**Description:** Planning and tracking milestone releases  
**Focus:** Release coordination and planning

---

## 📋 Planned / On Hold

### [Agent Skills Standards Comprehensive](./active/agent-skills-standards-comprehensive/)

**Status:** 📋 PLANNED  
**Description:** Comprehensive standards framework for agent skill development

### [GitHub Projects Creation System](./active/github-projects-creation-system/)

**Status:** 📋 PLANNED  
**Description:** Automated system for creating and managing GitHub Projects

### [Markdown Audit & CI Optimization](./active/markdown-audit-ci-optimization/)

**Status:** 📋 PLANNED  
**Description:** Audit markdown consistency and optimise CI linting

### [Repository Restructuring Phase 1](./active/repository-restructuring-phase-1/)

**Status:** 📋 PLANNED  
**Description:** Phase 1 of repository reorganisation initiative

### [Repository Restructuring 2026-07-25](./active/repo-restructuring-2026-07-25/)

**Status:** 📋 PLANNED  
**Description:** July 2026 repository restructuring initiative

### [Wave 5 Documentation Audit](./active/wave-5-documentation-audit/)

**Status:** 📋 PLANNED  
**Description:** Comprehensive documentation audit and standardisation

### [OpenSpec](./active/openspec/)

**Status:** 📋 PLANNED  
**Description:** Open specification framework for LightSpeed initiatives

---

## How to Add or Update a Project

1. Create/update folder: `.github/projects/active/{slug}/`
2. Add/update project documentation (README.md, etc.)
3. Create corresponding GitHub issue (type:epic) if new
4. Update this index with project entry
5. Commit with reference to issue: `docs(projects): {action} {project-name}`

## Status Legend

- 🟢 **Complete** — Delivered and closed; in archive queue
- 🟡 **Active** — In-progress, actively receiving updates
- 📋 **Planned** — Scheduled but not yet started

---

**Last Updated:** 2026-08-04  
**Maintained by:** LightSpeed Team  
**Total Active Projects:** 12 | **Recently Completed:** 4 | **Planned:** 7

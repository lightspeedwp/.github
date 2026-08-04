---
title: Active Projects Index
description: Central index of all active projects in the .github control plane
version: 1.0.0
file_type: index
status: active
last_updated: 2026-08-04
---

# Active Projects Index

Central registry of all active projects within the LightSpeed `.github` control plane.

## Infrastructure & DevOps

### [Node.js 22 Upgrade 2026-Q3](./active/nodejs-upgrade-2026-q3/)

**Status:** Complete (merged PR #1420)  
**Description:** Upgrade .github repository from Node 20 to Node 22  
**Key Files:**

- [README.md](./active/nodejs-upgrade-2026-q3/README.md)
- [STATUS.md](./active/nodejs-upgrade-2026-q3/STATUS.md)

### [Node.js 22 Upgrade — Post-Merge Monitoring](./active/nodejs-upgrade-2026-q3-post-merge-monitoring/)

**Status:** ✅ COMPLETE (monitoring cycle: 2026-07-30 to 2026-08-04)  
**Epic:** [#1432](https://github.com/lightspeedwp/.github/issues/1432) (CLOSED)  
**Description:** 3-day post-merge monitoring for Node.js 22 upgrade stability  
**Result:** Node.js 22 confirmed STABLE & PRODUCTION READY (1571/1571 tests passing, 0 Node issues)  
**Child Issues:**

- [#1433](https://github.com/lightspeedwp/.github/issues/1433) — Day 1: Workflow Monitoring ✅ CLOSED
- [#1434](https://github.com/lightspeedwp/.github/issues/1434) — Day 2: Performance Verification ✅ CLOSED
- [#1435](https://github.com/lightspeedwp/.github/issues/1435) — Day 3: Regression Confirmation ✅ CLOSED
- [#1430](https://github.com/lightspeedwp/.github/issues/1430) — Day 3 Sign-Off ✅ CLOSED

**Key Deliverables:**

- ✅ All monitoring criteria met
- ✅ Path resolution blocker fixed (PR #1487)
- ✅ Sign-off posted on PR #1420
- ✅ Comprehensive documentation complete

**Key Files:**

- [README.md](./active/nodejs-upgrade-2026-q3-post-merge-monitoring/README.md)
- [DAY_3_BLOCKER_FIX_PROMPT.md](./active/nodejs-upgrade-2026-q3-post-merge-monitoring/DAY_3_BLOCKER_FIX_PROMPT.md)
- [QUICK_REFERENCE.md](./active/nodejs-upgrade-2026-q3-post-merge-monitoring/QUICK_REFERENCE.md)

### [Release Workflow Authorization Fixes](./active/release-workflow-authorization-fixes/)

**Status:** In Progress  
**Issue:** [#1453](https://github.com/lightspeedwp/.github/issues/1453)  
**Description:** Fix pre-existing authorization failure in release.yml workflow (42+ days old)  
**Solution:** Made telemetry check non-blocking to unblock downstream jobs  
**Key Files:**

- [README.md](./active/release-workflow-authorization-fixes/README.md)
- [STATUS.md](./active/release-workflow-authorization-fixes/STATUS.md)

---

## Standards & Governance

### [Agent Standards Initiative](./active/agent-standards-initiative/)

**Status:** Active  
**Description:** Establishing standardised frameworks for agent development  

### [Phase 2B Skills Audit](./active/phase-2b-skills-audit/)

**Status:** Active  
**Description:** Comprehensive audit and consolidation of skills portfolio  

---

## Milestone & Planning

### [Milestone Planning v1](./active/milestone-planning-v1/)

**Status:** Active  
**Description:** Planning and tracking milestone releases  

### [PRD Combined Agent](./active/prd-combined-agent/)

**Status:** Active  
**Description:** Product requirements and specification for combined agent implementation  

---

## Repository Maintenance

### [Repository Maintenance Infrastructure](./active/repository-maintenance-infrastructure/)

**Status:** Active  
**Description:** Infrastructure and tooling for repository health and maintenance  

### [Workflows Consolidation 2026-Q3](./active/workflows-consolidation-2026-q3/)

**Status:** Active  
**Description:** Consolidating and standardising GitHub Actions workflows across repositories  

---

## How to Add a New Project

1. Create a folder: `.github/projects/active/{slug}/`
2. Add project documentation (README.md, etc.)
3. Create corresponding GitHub issue (type:epic)
4. Update this index with project entry

---

**Last Updated:** 2026-08-04  
**Maintained by:** LightSpeed Team

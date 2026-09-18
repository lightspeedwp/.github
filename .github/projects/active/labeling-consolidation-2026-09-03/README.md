---
file_type: documentation
title: Labeling Agent Consolidation & Multi-Repo Rollout
description: Organisation-wide labeling solution consolidating fragmented workflows into unified, reusable skills integrated with GitHub agentic workflows
created_date: 2026-09-03
last_updated: 2026-09-03
status: active
priority: "high"
type: "consolidation"
effort: "60h"
tags:
  - automation
  - labeling
  - consolidation
  - multi-repo
  - agentic-workflows
---

# Labeling Agent Consolidation & Multi-Repo Rollout

**Status:** 🟢 Phase 3 Complete — Spec → Issues (GitHub issues created)  
**Owner:** Claude  
**Start Date:** 2026-09-03  
**Est. Duration:** 4–6 weeks (Phase 1–4); 12 weeks (Phase 5 rollout parallel)  
**Master Epic:** [#2668 — Labeling Agent Consolidation & Multi-Repo Rollout](https://github.com/lightspeedwp/.github/issues/2668)

---

## Quick Facts

| Aspect | Details |
|--------|---------|
| **Objective** | Consolidate 11+ fragmented labeling workflows into unified, org-wide solution with reusable skills |
| **Scope** | `.github` repo (control plane) + multi-repo rollout (WordPress plugins/themes) |
| **Key Deliverable** | Unified labeling agent + extracted `skills/` + validated schemas + rollout plan |
| **Success Metric** | All repos using consistent labeling; maintenance surface reduced by 50%+ |
| **Blocker** | PR #2626 uses invalid branch name (violates CLAUDE.md rules) |

---

## Current Status

### Phase 1: Research & Audit (✅ Complete)

**What:** Understanding scope, dependencies, and consolidation strategy  
**Owner:** Task-Researcher Agent  
**Timeline:** Week 1 (Sept 3–9)  
**Deliverables:** RESEARCH_FINDINGS.md + AUDIT_FINDINGS.md complete

**Key Findings:**

1. ✅ Org-wide rollout scope: Phased deployment (Oct–Dec 2026)
2. ✅ Repo type differences: Documented per phase requirements
3. ✅ GitHub agentic workflow architecture: Specified in OPENSPEC.md
4. ✅ Label schema complexity and validation: Complete in SCHEMA_DESIGN.md
5. ✅ Retroactive labeling strategy: Documented in MULTI_REPO_ROLLOUT_PLAN.md
6. ✅ Integration with issues/PR agents: Planned for Phase 3+

---

### Phase 3: Spec → Issues (✅ Complete)

**What:** Convert OPENSPEC into actionable GitHub issues and enhancement opportunities  
**Timeline:** Week 4 (Sept 24–30)  
**Deliverables:** GitHub issues #2668–#2677 created + PHASE3_ISSUES_CREATED.md + ENHANCEMENTS.md

**Key Deliverables:**

1. ✅ Master Epic #2668 created for overall coordination
2. ✅ Phase 4 Epic #2669 created with 4 implementation tasks (#2672–#2676)
3. ✅ Phase 5 Epic #2670 created with rollout tasks (#2677)
4. ✅ All issues linked, labeled, and assigned
5. ✅ Enhancement opportunities documented in ENHANCEMENTS.md

**Phase 3+ Enhancement Issues (Created 2026-09-03):**

| Issue | Title | Priority | Status |
|-------|-------|----------|--------|
| #2709 | JSON Schema Examples for Label Validation | High | needs-planning |
| #2711 | Mock Data & Test Fixtures for Phase 4 Testing | High | needs-planning |
| #2712 | Update OPENSPEC.md Status & Completeness | Medium | needs-planning |
| #2713 | Phase 4 Handoff Document — Lessons & Context | Medium | needs-planning |
| #2714 | Cross-Link GitHub Issues ↔ Project Documentation | Medium | needs-planning |

---

## Project Structure

```
.github/projects/active/labeling-consolidation-2026-09-03/
├── README.md              (this file — quick dashboard)
├── PLANNING.md            (detailed phases, timeline, team)
├── OPENSPEC.md            (technical architecture spec) — COMPLETE
├── RESEARCH_FINDINGS.md   (answers to clarifying questions) — COMPLETE
├── AUDIT_FINDINGS.md      (inventory of all labeling components) — COMPLETE
├── SCHEMA_DESIGN.md       (label schema specification) — COMPLETE
├── WORKFLOW_CONSOLIDATION_PLAN.md — COMPLETE
├── SKILLS_EXTRACTION_PLAN.md — COMPLETE
└── MULTI_REPO_ROLLOUT_PLAN.md — COMPLETE
```

---

## Phases Overview

| Phase | Duration | Deliverable | Status |
|-------|----------|-------------|--------|
| **1. Research & Audit** | Wk 1 (Sept 3–9) | RESEARCH_FINDINGS.md + AUDIT_FINDINGS.md | ✅ Complete |
| **2. Planning & Design** | Wks 2–3 (Sept 3–23) | OPENSPEC.md + SCHEMA_DESIGN.md + Plans | ✅ Complete |
| **3. Spec → Issues** | Wk 4 (Sept 24–30) | GitHub Issues created + OpenSpec tasks | ✅ Complete |
| **4. Implementation** | Wks 5–8 (Oct 1–31) | Unified labeling agent + skills extraction | ⚪ Planned |
| **5. Testing & Rollout** | Wks 9–15 (Nov 1–Dec 15) | Pilot → multi-repo deployment | ⚪ Planned |

---

## Key Files to Review

**Before starting:** Read these to understand the landscape:

| File | Purpose |
|------|---------|
| [PLANNING.md](./PLANNING.md) | Detailed objectives, timeline, team, GitHub issues |
| [RESEARCH_FINDINGS.md](./RESEARCH_FINDINGS.md) | Answers to 14 clarifying questions (when complete) |
| [AUDIT_FINDINGS.md](./AUDIT_FINDINGS.md) | Full inventory of existing labeling components (when complete) |
| [`../../../AGENTS.md`](../../../AGENTS.md) | Org-wide AI rules and coding standards |
| [`../../../.github/labels.yml`](../../../.github/labels.yml) | Current canonical label definitions (158 labels) |
| [`../../../.github/instructions/branch-naming.instructions.md`](../../../.github/instructions/branch-naming.instructions.md) | Branch naming rules (note: PR #2626 violates this) |

---

## How to Contribute

### For Researchers (Phase 1)

1. Read PLANNING.md for context
2. Review the 14 clarifying questions
3. Audit files in `.github/workflows/`, `scripts/`, `hooks/` for labeling components
4. Document findings in RESEARCH_FINDINGS.md and AUDIT_FINDINGS.md
5. Link to GitHub issues discovered during research

### For Planners (Phase 2)

1. Review RESEARCH_FINDINGS.md
2. Design unified labeling agent architecture (GitHub agentic workflow)
3. Define label schema with JSON Schema validation
4. Plan workflow consolidation (from 11+ → fewer files)
5. Extract reusable skills for `skills/` folder
6. Create detailed OPENSPEC.md and rollout plan

### For Implementers (Phase 4+)

1. Follow OPENSPEC.md specifications
2. Create GitHub issues from OpenSpec
3. Implement unified labeling agent
4. Extract and test reusable skills
5. Deploy to staging repos first
6. Pilot in control plane, then multi-repo rollout

---

## Known Blockers

### ⚠️ PR #2626 — Invalid Branch Name

**Issue:** PR uses branch `claude/pr-labeling-workflows-ta5klm` (violates CLAUDE.md)  
**Impact:** PR template routing fails, workflow validation fails  
**Action:** Close PR #2626. Use new branch: `feat/labeling-consolidation-2026-09-03`  
**Status:** Blocked PR, correct branch created for this project

---

## Contacts & Questions

| Role | Contact | Focus |
|------|---------|-------|
| **Project Owner** | Claude | Overall coordination |
| **Research Lead** | Task-Researcher Agent | Phase 1 findings |
| **Planning Lead** | Task-Planner Agent | Phase 2 architecture |
| **Implementation Lead** | [TBD] | Phase 4 execution |

---

## Success Criteria (Definition of Done)

✅ **Phase 1:** All 14 clarifying questions answered clearly  
✅ **Phase 1:** Zero surprise files in audit (complete inventory)  
✅ **Phase 2:** Schema validated with examples  
✅ **Phase 2:** Consolidation plan has before/after file count  
✅ **Phase 2:** Skills extraction targets high-reuse components  
✅ **Phase 2:** Multi-repo rollout is realistic and phased  
✅ **Phase 3:** All 7 GitHub issues created and linked  
✅ **Phase 3:** PHASE3_ISSUES_CREATED.md documentation complete  
✅ **Phase 3:** PR #2685 merged to develop with all deliverables  
⬜ **Phase 4:** Unified labeling agent implemented and tested  
⬜ **Phase 4:** All fragmented workflows replaced  
⬜ **Phase 5:** Deployed to control plane successfully  
⬜ **Phase 5:** Pilot rollout to 2–3 WordPress repos complete  

---

## Useful Commands

```bash
# Validate branch name
npm run validate:branch-name -- --branch feat/labeling-consolidation-2026-09-03

# Run tests
npm test

# Lint Markdown docs
npm run lint:md

# View current active projects
ls -la .github/projects/active/
```

---

## Related Issues & PRs

| Issue/PR | Type | Status | Purpose |
|----------|------|--------|---------|
| [#1592](https://github.com/lightspeedwp/.github/issues/1592) | Issue | Open | Related: Label Prefix Governance Enforcement |
| [#2626](https://github.com/lightspeedwp/.github/pull/2626) | PR | Open | Phase 2: Labeling workflow consolidation (branch naming issue) |
| [#2687](https://github.com/lightspeedwp/.github/issues/2687) | Issue | Open | Scripts & Agents Audit (related infrastructure) |

**Phase Timeline**: Sept 3 – Dec 31, 2026  
**Next Milestone**: Phase 3 Master Epic creation (Sept 10)  
**Blocker Status**: PR #2626 branch naming needs fixing

---

**Project Version:** 1.0.0  
**Created:** 2026-09-03  
**Last Updated:** 2026-09-03  
**Maintained By:** Claude

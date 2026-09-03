---
file_type: documentation
title: Labeling Agent Consolidation & Multi-Repo Rollout
description: Organisation-wide labeling solution consolidating fragmented workflows into unified, reusable skills integrated with GitHub agentic workflows
created_date: 2026-09-03
last_updated: 2026-09-03
status: active
tags:
  - automation
  - labeling
  - consolidation
  - multi-repo
  - agentic-workflows
---

# Labeling Agent Consolidation & Multi-Repo Rollout

**Status:** 🟡 Active — Research Phase  
**Owner:** Claude  
**Start Date:** 2026-09-03  
**Est. Duration:** 4–6 weeks  
**Master Epic:** [To be created]

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

### Phase 1: Research & Audit (🟡 In Progress)

**What:** Understanding scope, dependencies, and consolidation strategy  
**Owner:** Task-Researcher Agent  
**Timeline:** Week 1 (Sept 3–9)  
**Next Step:** Complete clarifying questions → generate audit findings

**Key Questions Being Answered:**

1. Org-wide rollout scope (all repos at once vs phased?)
2. Repo type differences (WordPress plugins/themes vs control plane)
3. GitHub agentic workflow architecture
4. Label schema complexity and validation
5. Retroactive labeling strategy
6. Integration with issues/PR agents

---

## Project Structure

```
.github/projects/active/labeling-consolidation-2026-09-03/
├── README.md              (this file — quick dashboard)
├── PLANNING.md            (detailed phases, timeline, team)
├── OPENSPEC.md            (technical architecture spec)
├── RESEARCH_FINDINGS.md   (answers to clarifying questions)
├── AUDIT_FINDINGS.md      (inventory of all labeling components)
├── SCHEMA_DESIGN.md       (label schema specification)
├── WORKFLOW_CONSOLIDATION_PLAN.md
├── SKILLS_EXTRACTION_PLAN.md
└── MULTI_REPO_ROLLOUT_PLAN.md
```

---

## Phases Overview

| Phase | Duration | Deliverable | Status |
|-------|----------|-------------|--------|
| **1. Research & Audit** | Wk 1 (Sept 3–9) | RESEARCH_FINDINGS.md + AUDIT_FINDINGS.md | 🟡 In Progress |
| **2. Planning & Design** | Wks 2–3 (Sept 10–23) | OPENSPEC.md + SCHEMA_DESIGN.md + Plans | ⚪ Planned |
| **3. Spec → Issues** | Wk 4 (Sept 24–30) | GitHub Issues created + OpenSpec tasks | ⚪ Planned |
| **4. Implementation** | Wks 5–6 (Oct 1–15) | Unified labeling agent + skills extraction | ⚪ Planned |
| **5. Testing & Rollout** | Wk 7+ (Oct 16+) | Pilot → multi-repo deployment | ⚪ Planned |

---

## Key Files to Review

**Before starting:** Read these to understand the landscape:

| File | Purpose |
|------|---------|
| [PLANNING.md](./PLANNING.md) | Detailed objectives, timeline, team, GitHub issues |
| [RESEARCH_FINDINGS.md](./RESEARCH_FINDINGS.md) | Answers to 14 clarifying questions (when complete) |
| [AUDIT_FINDINGS.md](./AUDIT_FINDINGS.md) | Full inventory of existing labeling components (when complete) |
| [`../../AGENTS.md`](../../AGENTS.md) | Org-wide AI rules and coding standards |
| [`../../labels.yml`](../../labels.yml) | Current canonical label definitions (158 labels) |
| [`../../.github/instructions/branch-naming.instructions.md`](../../.github/instructions/branch-naming.instructions.md) | Branch naming rules (note: PR #2626 violates this) |

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
✅ **Phase 3:** All GitHub issues created and linked  
✅ **Phase 4:** Unified labeling agent implemented and tested  
✅ **Phase 4:** All fragmented workflows replaced  
✅ **Phase 5:** Deployed to control plane successfully  
✅ **Phase 5:** Pilot rollout to 2–3 WordPress repos complete  

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

**Project Version:** 1.0.0  
**Created:** 2026-09-03  
**Last Updated:** 2026-09-03  
**Maintained By:** Claude

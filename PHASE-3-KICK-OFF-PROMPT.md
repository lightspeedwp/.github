---
file_type: "prompt"
title: "Wave 5 Phase 3 Kick-Off Prompt"
description: "Starting prompt for Phase 3 Documentation Update execution"
version: "1.0.0"
created_date: "2026-07-31"
target_audience: "Project executor (Claude Code or team lead)"
---

# Wave 5 Phase 3: Documentation Update — Kick-Off Prompt

**Project:** Wave 5 Documentation Audit - Phase 3 Execution  
**Start Date:** 2026-08-01  
**Target Completion:** 2026-08-21  
**Effort:** 120-150 hours (3-4 weeks)  
**Team:** LightSpeed Documentation Team + Claude Code

---

## Executive Summary

You're starting Phase 3 of the Wave 5 Documentation Audit initiative. This phase focuses on **archival, consolidation, verification, and navigation improvement** of documentation across the repository.

**The Mission:** Transform our documentation from scattered and duplicated to organized, consolidated, and discoverable.

---

## What You're Doing

### Phase 3 at a Glance

| Phase | Focus | Duration | Status |
|-------|-------|----------|--------|
| **3A** | Archive audits, align file organization | Days 1-4 | 🔵 Ready |
| **3B** | Consolidate overlapping documentation | Days 5-11 | 🔵 Ready |
| **3C** | Verify accuracy of operational docs | Days 6-10 (parallel) | 🔵 Ready |
| **3D** | Create documentation index & navigation | Days 12-16 | 🔵 Ready (after 3B) |
| **3E** | Project closure & recommendations | Days 17-19 | 🔵 Ready (final phase) |

### Key Deliverables

✅ **Phase 3A:** 4 audit reports archived, file organization aligned with CLAUDE.md  
✅ **Phase 3B:** 3 documentation areas consolidated (branch, labeling, triage)  
✅ **Phase 3C:** 4 operational documents verified for accuracy  
✅ **Phase 3D:** Comprehensive docs/index.md created with topic-based navigation  
✅ **Phase 3E:** Project documentation, recommendations, and closure

---

## Resources You Have

### Core Documents (in `.github/projects/active/wave-5-documentation-audit/`)

1. **[DOCUMENTATION_UPDATE_STRATEGY.md](./DOCUMENTATION_UPDATE_STRATEGY.md)** — 5-phase detailed plan with tasks, timelines, and acceptance criteria
2. **[GITHUB_ISSUES_REWRITE_PLAN.md](./GITHUB_ISSUES_REWRITE_PLAN.md)** — Before/after specs for 26+ GitHub issues
3. **[AUDIT_REPORT_2026-07-31.md](./AUDIT_REPORT_2026-07-31.md)** — Complete audit of project and issues
4. **[DOCS_AUDIT_2026-07-30.md](./findings/DOCS_AUDIT_2026-07-30.md)** — Detailed documentation audit findings

### Execution Batches

**Batch 1 (Critical):** Ready to execute

- **Location:** `.github/projects/active/wave-5-documentation-audit/batch-1-execution/`
- **Files:** batch-1-issue-*.md files
- **Script:** execute-batch-1-rewrites.sh
- **Guide:** [../BATCH-1-EXECUTION-SUMMARY.md](../BATCH-1-EXECUTION-SUMMARY.md)
- **Timeline:** 2026-08-04 (review) → 2026-08-05 (execute)

**Batches 2-4:** Specifications ready in GITHUB_ISSUES_REWRITE_PLAN.md

---

## Starting Phase 3

### Week 1: Planning & Batch 1 Execution (Aug 1-9)

**Thursday 8/1:**

- [ ] Review this kick-off prompt with team
- [ ] Read DOCUMENTATION_UPDATE_STRATEGY.md completely
- [ ] Understand Phase 3A scope and timeline

**Friday 8/2-8/3:**

- [ ] Review Batch 1 execution files
- [ ] Team Q&A and approval

**Monday 8/4:**

- [ ] Navigate to: `cd .github/projects/active/wave-5-documentation-audit/batch-1-execution/`
- [ ] Run dry-run: `bash execute-batch-1-rewrites.sh --dry-run`
- [ ] Review output with team
- [ ] Get final approval for execution

**Tuesday 8/5:**

- [ ] Navigate to: `cd .github/projects/active/wave-5-documentation-audit/batch-1-execution/`
- [ ] Execute Batch 1: `bash execute-batch-1-rewrites.sh --execute`
- [ ] Verify issues #904, #916-920 updated in GitHub
- [ ] Confirm cross-references and parent-child links

**Wed-Fri 8/6-8/9:**

- [ ] Phase 3A work begins (archival & file organization)
- [ ] Parallel execution of Phase 3B and 3C planning

### Weeks 2-4: Phase 3 Execution (Aug 12-21)

Follow the timeline in DOCUMENTATION_UPDATE_STRATEGY.md:

- **Week 2 (8/12-8/16):** Phase 3B consolidation + Phase 3C accuracy verification
- **Week 3 (8/19-8/21):** Phase 3D index creation + Phase 3E closure

---

## Key Decisions Already Made

✅ **Archive Structure:** `.github/archived-docs/{audits,remediation,migrations}/`  
✅ **Consolidation Approach:** Clear boundaries established for 3 documentation areas  
✅ **Accuracy Verification:** 4 operational documents flagged for verification  
✅ **Documentation Index:** Phase 3D task with 5 sub-tasks, topic-based navigation  
✅ **Issue Rewrite Batches:** 4 batches organized by priority (critical → medium)  

---

## Before You Start

### Required Reading (In Order)

1. **This document** (5 min) — Orientation
2. **[DOCUMENTATION_UPDATE_STRATEGY.md](./DOCUMENTATION_UPDATE_STRATEGY.md)** (30 min) — Detailed plan
3. **[BATCH-1-EXECUTION-SUMMARY.md](../BATCH-1-EXECUTION-SUMMARY.md)** (15 min) — Execution guide for Batch 1
4. **[GITHUB_ISSUES_REWRITE_PLAN.md](./GITHUB_ISSUES_REWRITE_PLAN.md)** (optional, reference) — Issue details

### Understanding the Project Context

- **Why Phase 3?** After 2 months, audit findings identified specific consolidation opportunities and accuracy gaps. Phase 3 executes on those findings.
- **Why batches?** 26+ GitHub issues need rewriting. Batches allow parallel execution and team coordination.
- **Why this timeline?** 3-4 weeks allows thorough work without rushed execution. Dates are target, not hard deadlines.

---

## Success Criteria

You'll know Phase 3 is successful when:

✅ **Phase 3A (Days 1-4):**

- [ ] 4 audit/remediation reports moved to `.github/archived-docs/`
- [ ] File organization audit completed, alignment report created
- [ ] docs/ folder focused on active, canonical documentation

✅ **Phase 3B (Days 5-11):**

- [ ] Branch & PR guidance consolidated (PR_CREATION_PROCESS references BRANCHING_STRATEGY)
- [ ] Labeling documentation boundaries established (no duplication)
- [ ] Issue triage relationship documented (core vs. automation clear)
- [ ] Cross-references added throughout

✅ **Phase 3C (Days 6-10, parallel):**

- [ ] CHANGELOG_AUTOMATION.md verified current
- [ ] MERGIFY_STRATEGY.md verified current
- [ ] ISSUE_TYPES.md verified against issue-types.yml
- [ ] ISSUE_FIELDS.md verified (50-field limit accurate)

✅ **Phase 3D (Days 12-16):**

- [ ] docs/index.md created with topic-based navigation
- [ ] Navigation headers added to all docs
- [ ] Archived docs clearly linked and discoverable
- [ ] All links verified working

✅ **Phase 3E (Days 17-19):**

- [ ] Project closure document created
- [ ] Recommendations documented
- [ ] All issues closed or transitioned
- [ ] Wave 5 status updated

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Scope creep in consolidation decisions | Timeline slip | Phase 3E closure decision gate |
| Documentation changes during Phase 3 | Merge conflicts | Lock docs during Phase 3B-3D |
| Team availability gaps | Timeline slip | Documented procedures, async-friendly tasks |
| GitHub issue rewrite failures | Task blocking | Dry-run verification before execution |

---

## Communication Cadence

- **Daily (15 min):** Standup on Phase 3 progress
- **Every 2 days:** Cross-check consolidation decisions
- **End of each phase:** Phase completion report + lessons learned
- **Final:** Project closure summary

---

## Getting Help

If you get stuck:

1. **Task-specific questions:** Check the phase documentation (in DOCUMENTATION_UPDATE_STRATEGY.md)
2. **Issue rewrite questions:** Check GITHUB_ISSUES_REWRITE_PLAN.md
3. **Consolidation decisions:** Reference the audit findings (DOCS_AUDIT_2026-07-30.md)
4. **Process questions:** This prompt or the project INDEX.md

---

## What Happens After Phase 3

✅ **Phase 4 Planning:** README & Mermaid audit (deferred work)  
✅ **Phase 5 Recommendations:** Process improvements and ongoing maintenance  
✅ **Project Closure:** Wave 5 Documentation Audit complete

---

## Your Role This Week

**By Friday 8/1:** Be familiar with this prompt and DOCUMENTATION_UPDATE_STRATEGY.md  
**By Monday 8/4:** Review and approve Batch 1 execution  
**By Tuesday 8/5:** Execute Batch 1 and verify results  
**Starting 8/6:** Lead Phase 3A execution  

---

## Final Note

This documentation update is about **making documentation discoverable and maintainable**, not just reorganizing files. Every consolidation decision, every archive move, and every cross-reference is in service of that goal.

**You've got this.** The plan is detailed, the batches are ready, and the team is aligned. Execute with confidence.

---

**Questions?** Review the relevant section above, or reach out to the team.  
**Ready to proceed?** Start with the dry-run on Monday 8/4.

---

*Prepared: 2026-07-31*  
*For: Phase 3 Documentation Update Execution*  
*Part of: Wave 5 Documentation Audit Initiative*

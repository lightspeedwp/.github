---
file_type: "documentation"
title: "OpenSpec Multi-Project Analysis & Integration Framework"
description: "Cross-project alignment and dependency mapping for 11 active LightSpeed initiatives"
last_updated: "2026-08-25"
status: draft
---

# OpenSpec: Multi-Project Analysis & Integration Framework

**Date:** 2026-08-07  
**Scope:** 11 active projects analyzed for alignment, conflicts, and dependencies  
**Purpose:** Clarify and improve plans across the portfolio; ensure workflow consolidation aligns with all concurrent work

---

## Executive Summary

11 active projects are running concurrently, with **5 directly impacting workflow consolidation** (Phase 4). This framework maps dependencies, identifies conflicts, and establishes coordination checkpoints.

### Critical Path for Workflow Consolidation

```
Phase 4 can begin immediately EXCEPT:
├─ Phase 4.2 BLOCKED: Issue Type project (Phase 1 target: Aug 13)
│  └─ Coordinate consolidation with Issue Type enhancements
├─ Phase 4.3 REQUIRES: Release Redesign clarification (target: Aug 12)
│  └─ Confirm no conflicting project-sync workflows
└─ Phase 4.3 REQUIRES: Projects System clarification (target: Aug 12)
   └─ Ensure projects system doesn't duplicate field-sync logic

Expected: All phases executable by Aug 14
Target:   Phase 4 completion by Aug 25
```

---

## Part 1: Portfolio Overview

### 11 Active Projects (As of 2026-08-07)

| # | Project | Status | Target | Impact on WC | Blocker? |
|---|---------|--------|--------|---|---|
| 1 | **workflows-consolidation-2026-q3** | Planning | Aug 25 | CORE | No |
| 2 | **issue-triage-automation-system** | ✅ COMPLETE | Complete | Adds 2 workflows | No |
| 3 | **issue-type-workflow-automation** | 🔄 ACTIVE | Aug 27 | Modifies template-enforcement.yml | YES (4.2) |
| 4 | **label-prefix-audit-2026-08-05** | ✅ COMPLETE | Complete | Completed Phase 3 labeling work | No |
| 5 | **label-prefix-enforcement-2026-08-05** | ✅ COMPLETE | Complete | Labeling workflows consolidated (Phase 3) | No |
| 6 | **milestone-planning-v1** | 📋 Planning | TBD | Planning focused; may affect issues | Indirect |
| 7 | **template-enforcement-governance** | 🟢 Active (closeout) | Complete | Phase 4.2 consolidation target | No (closeout) |
| 8 | **release-process-redesign-2026-08-05** | 🔄 ACTIVE | TBD | May add workflows affecting Phase 4.3 | YES (4.3) |
| 9 | **release-workflow-authorization-fixes** | 🟡 Active | TBD | Release workflow modifications | Indirect |
| 10 | **changelog-automation-hardening** | 🔄 ACTIVE | Aug 7+ | Complements Phase 1B (complete) | No |
| 11 | **github-projects-creation-system** | 🟡 ACTIVE | TBD | May add workflows affecting Phase 4.3 | YES (4.3) |

**Summary:**

- ✅ 2 projects COMPLETE (labeling, triage automation)
- 🔄 5 projects ACTIVE (issue-type, release-redesign, changelog-hardening, + 2 others)
- 📋 1 project PLANNING (milestone)
- 🟡 3 projects in closeout/unclear status

**Impact on Workflow Consolidation:**

- 3 BLOCKING: Issue Type (4.2), Release Redesign (4.3), Projects System (4.3)
- 2 DIRECT IMPACT: Triage (added workflows), Changelog (complements Phase 1B)
- 6 MINIMAL IMPACT: Others

---

## Part 2: Critical Dependencies & Blockers

### BLOCKER #1: Issue Type & Metadata Automation → Phase 4.2

**Status:** 🔴 BLOCKS Phase 4.2

**What's Happening:**

- Issue Type project (Epic #1167) is in Phase 1 (5 weeks, target: Aug 27)
- Plans to enhance `template-enforcement.yml` with 40+ new labeling rules
- Plans to create `validate-issue-dod.yml` for DoD validation

**Phase 4.2 Conflict:**

- Plans to consolidate `template-enforcement.yml` into `issue-compliance.yml`
- Cannot consolidate while Issue Type project is modifying the source

**Resolution Strategy (RECOMMENDED):**

1. **Wait for Issue Type Phase 1** (target: Aug 13)
2. **Coordinate consolidation** — merge enhancements + consolidation together
3. **Single execution** — Phase 4.2 includes Issue Type enhancements + consolidation
4. **Timeline:** Start Phase 4.2 on Aug 14 (after coordination call Aug 13)

**Action Items:**

- [ ] Schedule coordination call with Issue Type owner (Aug 13, 9 AM)
- [ ] Review Issue Type Phase 1 implementation plan
- [ ] Prepare Phase 4.2 to incorporate Issue Type enhancements
- [ ] Confirm no conflicts with DoD validation strategies

**Status:** Waiting for Issue Type Phase 1 progress (target: Aug 13)

---

### BLOCKER #2: Release Redesign → Phase 4.3 (Project Field Sync)

**Status:** 🟡 CONDITIONAL BLOCK on Phase 4.3

**What's Happening:**

- Release Process Redesign (Epic in planning) is Phase 2 (in progress, 3/6 issues done)
- Redesigning release workflow, approval gates, post-release sync
- May add new project-sync workflows during redesign

**Phase 4.3 Conflict:**

- Phase 4.3 consolidates project field sync workflows
- If Release Redesign adds new project workflows, they become immediate consolidation candidates
- Creates risk of: design conflicts, duplicate logic, post-consolidation waste

**Resolution Strategy (REQUIRED):**

1. **Get clarity** on Release Redesign's project-sync plans (target: Aug 12)
2. **Incorporate into Phase 4.3** if new workflows are planned
3. **Avoid creating workflows** that would immediately be consolidated

**Action Items:**

- [ ] Request Release Redesign team: list planned project-sync additions
- [ ] Share Phase 4.3 consolidation design
- [ ] Align Phase 4.3 timing (target: Aug 14 start)
- [ ] Confirm no duplicate field-sync logic

**Status:** Awaiting Release Redesign roadmap confirmation (target: Aug 12)

---

### BLOCKER #3: GitHub Projects Creation System → Phase 4.3

**Status:** 🟡 CONDITIONAL BLOCK on Phase 4.3

**What's Happening:**

- GitHub Projects Creation System (just started 2026-08-05)
- Planning to create automated project creation workflows
- May create new project-management workflows

**Phase 4.3 Conflict:**

- Phase 4.3 consolidates project field sync logic into `project-field-sync.yml`
- If Projects System creates new field-sync workflows, they conflict
- Creates risk of: duplicate functionality, post-consolidation rework

**Resolution Strategy (REQUIRED):**

1. **Get clarity** on Projects System's workflow plans (target: Aug 12)
2. **Share Phase 4.3 design** — unified field-sync interface
3. **Commit to post-Phase 4.3 pattern** — Projects System uses consolidated workflow

**Action Items:**

- [ ] Request Projects System team: list planned workflows
- [ ] Share Phase 4.3 consolidation design
- [ ] Get commitment: Projects System will use post-Phase 4.3 patterns
- [ ] Confirm no duplicate project-sync logic

**Status:** Awaiting Projects System roadmap confirmation (target: Aug 12)

---

## Part 3: Non-Blocking But Important Projects

### Completed: Label Prefix Projects (Both)

**Status:** ✅ COMPLETE (Both label projects done)

**Impact:**

- Label Prefix Audit (2026-08-05): Comprehensive audit complete
- Label Prefix Enforcement (2026-08-05): Phase 3.3 labeling consolidation merged (PR #1496)
- **Result:** 3 labeling workflows → 1 (labeling-governance.yml)

**Relationship to WC:**

- Phase 4 plan accounts for these consolidations
- Workflow count: 31 → 33 → (Phase 3.3 completes) → 25 (target)
- No additional work needed for Phase 4

---

### Completed: Issue Triage Automation System

**Status:** ✅ COMPLETE (Epic #1376 closed, PR #1377 merged)

**Impact:**

- Added 2 new workflows: `issue-create-enhanced.yml`, `issue-remediation-bulk.yml`
- Brings workflow count to 33+ (before Phase 4 starts)
- Phase 4.6 will consolidate issue-remediation-bulk.yml

**Relationship to WC:**

- Phase 4 plan already accounts for these additions
- Phase 4.5 targets issue-create-from-template.yml (superseded by enhanced)
- Phase 4.6 targets issue-remediation-bulk.yml consolidation

**Status:** ✅ No additional coordination needed

---

### Active: Changelog Automation Hardening

**Status:** 🔄 ACTIVE (Phase 4A/4B, target: Aug 7+)

**Impact:**

- Adding validation guardrails to changelog automation
- Complements Phase 1B (changelog consolidation, already complete)
- No new workflows; enhancements to existing changelog-management.yml

**Relationship to WC:**

- changelog-management.yml is KEPT (not consolidated in Phase 4)
- No conflicts with Phase 4 plan
- Synergistic: Phase 1B consolidated, Phase 4 adds hardening

**Status:** ✅ No coordination needed; complements WC

---

### Active: Template Enforcement Governance

**Status:** 🟢 ACTIVE (Closeout phase)

**Impact:**

- Template governance rules validated
- Local implementation scope complete
- Remaining work: remote GitHub admin verification

**Relationship to WC:**

- template-enforcement.yml is Phase 4.2 consolidation target
- No active code changes that would conflict
- Project in closeout (no new workflow additions)

**Status:** ✅ No conflicts; ready for Phase 4.2 consolidation

---

### Active: Release Workflow Authorization Fixes

**Status:** 🟡 ACTIVE (Status unclear)

**Impact:**

- Fixing authorization issues in release workflows
- May modify release.yml

**Relationship to WC:**

- release.yml is KEPT (not consolidated)
- Could affect Phase 4.3 if it touches project-sync logic
- Unclear status; needs clarification

**Action Items:**

- [ ] Clarify: Does this project modify project-sync logic?
- [ ] If yes: coordinate timing with Phase 4.3
- [ ] If no: proceed independently

---

### Planning: Milestone Planning v1

**Status:** 📋 PLANNING (No clear deliverables visible)

**Impact:**

- Appears focused on milestone assignment/planning
- May affect issue governance workflows

**Relationship to WC:**

- Could interact with issue-compliance.yml (Phase 4.2)
- Unclear scope and timeline

**Action Items:**

- [ ] Clarify: What workflows does this project create/modify?
- [ ] If it affects issue governance: coordinate with Phase 4.2
- [ ] Confirm timeline and scope

---

## Part 4: Integration & Coordination Matrix

### Phase 4 Sub-phase Dependencies on Other Projects

| Phase | Focus | Blocked By | Coordination Needed | Status |
|-------|-------|-----------|---|---|
| 4.1 | Delete deprecated | None | None | ✅ Ready Now |
| 4.2 | Issue compliance | Issue Type project Phase 1 | Merge enhancements + consolidation | 🔴 Aug 13 |
| 4.3 | Project field sync | Release Redesign clarity | Confirm no new workflows | 🟡 Aug 12 |
| 4.4 | Flaky test absorption | None | None | ✅ Ready Now |
| 4.5 | Delete superseded | None | None | ✅ Ready Now |
| 4.6 | Issue audit + remediation | Both source workflows must run | Verify interaction safety | ✅ Ready Now |

### Cross-Project Impact Analysis

| Project | Workflow Changes | Phase 4 Impact | Coordination Target | Owner Action |
|---------|---|---|---|---|
| Issue Type | Enhance template-enforcement.yml + create 3 new workflows | BLOCKS 4.2 | Aug 13 coordination | Provide Phase 1 roadmap |
| Release Redesign | May add project-sync workflows | AFFECTS 4.3 | Aug 12 clarification | List planned workflows |
| Projects System | May create project workflows | AFFECTS 4.3 | Aug 12 clarification | List planned workflows |
| Changelog Hardening | Enhance changelog-management.yml (no new workflows) | NONE | None | Proceed independently |
| Template Governance | Local implementation complete | NONE | None | Proceed independently |
| Label Prefix (both) | ✅ Complete | NONE | None | Proceed independently |
| Triage Automation | ✅ Complete + added 2 workflows | 4.5, 4.6 account for these | None | Proceed independently |

---

## Part 5: Recommended Execution Sequence

### Week 1 (Aug 8-11): Non-Blocking Phases + Coordination

**Phases to Execute (No Dependencies):**

- 4.1: Delete deprecated (1h)
- 4.4: Flaky test absorption (1-2h)
- 4.5: Delete superseded (0.5h)
- **Result:** Reach 25-workflow target by Aug 9 ✅

**Parallel Coordination (Target completion: Aug 12):**

- [ ] Contact Issue Type owner → confirm Phase 1 target (Aug 13)
- [ ] Contact Release Redesign owner → get workflow list (by Aug 12)
- [ ] Contact Projects System owner → get workflow list (by Aug 12)
- [ ] Schedule coordination calls for Aug 13-14

**Also Executable:**

- Phase 4.6: If both source workflows have production runs (verify by Aug 10)

### Week 2 (Aug 12-18): Coordination + Blocking Phases

**Coordination Checkpoints (Aug 12):**

- [ ] Release Redesign: Confirm no new project-sync workflows
- [ ] Projects System: Confirm no duplicate field-sync logic
- [ ] Plan Phase 4.3 incorporating any Release Redesign changes

**Coordination Checkpoint (Aug 13 morning):**

- [ ] Issue Type Phase 1 completion confirmation
- [ ] Plan Phase 4.2 incorporating Issue Type enhancements

**Phases to Execute (Aug 14+):**

- Phase 4.2: Issue compliance (4-5h, includes Issue Type integration)
- Phase 4.3: Project field sync (3-4h, incorporates Release Redesign feedback)
- Phase 4.6: Already complete if executed in Week 1

**Expected Completion:** Aug 18-25

---

## Part 6: Success Criteria for Multi-Project Alignment

**Coordination Success:**

- ✅ All 3 blockers resolved by Aug 13
- ✅ Phase 4 timeline confirmed by Aug 12
- ✅ No new workflows added during Phase 4 consolidation
- ✅ All concurrent projects aware of Phase 4 schedule

**Integration Success:**

- ✅ Issue Type Phase 1 enhancements incorporated into Phase 4.2
- ✅ Release Redesign project-sync plans incorporated into Phase 4.3
- ✅ Projects System uses post-Phase 4.3 patterns
- ✅ No regressions across any concurrent projects

**Final Outcome:**

- ✅ Workflow count: 41 → 20-23 (target was 25)
- ✅ All Phase 4 sub-phases complete
- ✅ All concurrent projects aligned and non-conflicting
- ✅ Clear patterns established for future consolidations

---

## Appendix: Coordination Contact List & Deadlines

| Project | Owner | Deadline | Checkpoint | Action |
|---------|-------|----------|-----------|--------|
| Issue Type | [TBD] | Aug 13 | Phase 1 completion | Schedule Aug 13 call |
| Release Redesign | [TBD] | Aug 12 | Workflow list | Request by Aug 11 |
| Projects System | [TBD] | Aug 12 | Workflow list | Request by Aug 11 |
| Changelog Hardening | [TBD] | None | Completion | Proceed independently |
| Label Prefix (both) | [TBD] | Complete | N/A | Already merged |
| Triage Automation | [TBD] | Complete | N/A | Already merged |

---

**Document Status:** Ready for Stakeholder Review  
**Next Steps:** Confirm coordination contacts and deadlines; execute Week 1 phases immediately

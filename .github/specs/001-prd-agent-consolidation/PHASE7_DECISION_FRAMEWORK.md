---
title: Phase 7 Decision Framework (T078-T082)
created: 2026-09-14
task: T078, T079, T080, T081-Sync, T081-Defer, T082
status: Blocked on Phase 6
owner: Ash Shaw
---

# Phase 7 Decision Framework: Spec-Based Agent Resolution

**Goal**: Decide the fate of the legacy spec-based PRD agent (`agents/mode-prd.agent.md`) based on Phase 6 adoption metrics (Archive, Sync, or Defer)

**Status**: ⏳ BLOCKED ON PHASE 6 | **Unblock Gate**: T077 completion (estimated 2026-10-26)

**Timeline**: Decision window 2026-10-28–2026-11-02

---

## Decision Gate Logic

The decision to Archive, Sync, or Defer is determined by Phase 6 final adoption metrics:

```
Phase 6 Adoption Metrics (from T075b)
         |
         v
ARCHIVE gate met?
(SC-602/603/604 met, adoption stable or improving,
 portable version fully adopted, legacy version not needed)
    /                    \
  YES                    NO
   |                      |
   v                      v
ARCHIVE              SYNC needed?
                     (both versions remain in use or
                      required customisations must remain)
                         /                 \
                       YES                 NO
                        |                   |
                        v                   v
                      SYNC                DEFER
                  (Keep both aligned)  (Document re-evaluation
                                        triggers and next review date)
```

---

## Decision Criteria

### ARCHIVE Decision

**Conditions** (all must be true):

- ✅ SC-602: ≥5 teams with ≥4-of-6-week activity threshold met
- ✅ SC-603: User satisfaction ≥4.0/5.0
- ✅ SC-604: Zero critical blockers vs. baseline
- ✅ Adoption trend: Stable or improving week-over-week

**Outcome**:

1. Move `agents/mode-prd.agent.md` → `.github/projects/archive/prd-agents/` (T080)
2. Update memory registry: remove or redirect `agent:mode-prd` entry
3. Update all references in workflows, docs, AGENT-INDEX.md
4. Document archival rationale in `PHASE7_DECISION.md`

**Rationale Example**:
> "The portable consolidated PRD agent (`agents/prd-agent/`) has achieved full adoption across ≥5 teams with 4.2/5.0 satisfaction and zero critical blockers. The spec-based version (`agents/mode-prd.agent.md`) is no longer actively maintained by the team, and adopting teams have transitioned to the consolidated version. Archival eliminates maintenance burden and reduces source-of-truth ambiguity."

---

### SYNC Decision

**Conditions** (at least one true):

- Both portable and spec-based versions are actively used by different teams
- Spec-based version has customizations that teams depend on
- Consolidation is not yet complete across the entire organization

**Outcome**:

1. Update `agents/mode-prd.agent.md` prompt to match `agents/prd-agent/copilot/agent.md` (T081-Sync)
2. Establish sync trigger: whenever portable version is updated, sync spec-based version
3. Document sync process in `PHASE7_DECISION.md`
4. Set up automation or manual review process to keep them aligned

**Sync Process**:

- **Trigger**: Merge to `agents/prd-agent/copilot/agent.md` on `develop` branch
- **Action**: Create PR to update `agents/mode-prd.agent.md` with same changes
- **Review**: Maintainer reviews and merges PR
- **Frequency**: As-needed (tied to portfolio version updates)

**Rationale Example**:
> "While the portable version is actively adopted by ≥5 teams, the spec-based version serves a distinct use case (Copilot-native workflows in .github control plane). Both versions should be kept in sync to avoid divergence and confusion. Establish a sync trigger on every portable-version update to ensure consistency."

---

### DEFER Decision

**Conditions** (at least one true):

- Adoption metrics are inconclusive (3-4 teams active, borderline satisfaction)
- A critical blocker affects adoption potential
- External factors (holidays, release freeze) have skewed data
- Re-evaluation criteria are more appropriate than immediate archive/sync decision

**Outcome**:

1. Document rationale, blockers, and re-evaluation criteria in `PHASE7_DECISION.md` (T081-Defer)
2. Set specific next review date (e.g., "Q1 2027" or "3 months from now")
3. Define trigger criteria for re-evaluation (e.g., "≥10 teams active" or "critical blocker resolved")
4. Create linked GitHub issue to track follow-up
5. Keep `agents/mode-prd.agent.md` in current state (no archive, no sync required immediately)

**Re-Evaluation Triggers** (examples):

- Adoption reaches ≥7 teams (signal of strong market pull)
- Critical blocker resolved and adoption retested
- Next scheduled review date reached (e.g., 3 months)
- Organization-wide process change that affects agent usage

**Rationale Example**:
> "Phase 6 adoption data shows 4 teams active (one short of ≥5 threshold) with 3.9/5.0 satisfaction (just below 4.0/5.0 target). Integration friction with existing Copilot workflows in Team C is a remediable blocker being addressed. Rather than archive based on borderline metrics, defer decision and re-evaluate in Q1 2027 with same success criteria. If adoption reaches ≥7 teams or satisfaction exceeds 4.2/5.0, archive. If sustained below 4 teams, consider consolidation of both versions into portable-only model."

---

## Decision Memo Template (T078)

**File**: `.github/specs/001-prd-agent-consolidation/PHASE7_DECISION_MEMO.md`

```markdown
# Phase 7 Decision Memo

**Date**: 2026-10-28  
**Prepared By**: Ash Shaw  
**Review Deadline**: 2026-11-02

## Context

[Copy key metrics from FINAL_ADOPTION_REPORT.md]

### Phase 6 Success Criteria Summary
- SC-602 (≥5 teams, ≥4-of-6-week activity): [MET / NOT MET]
- SC-603 (satisfaction ≥4.0/5.0): [MET / NOT MET]
- SC-604 (zero critical blockers): [MET / NOT MET]

### Adoption Trend Analysis
[Describe week-over-week trend: improving, stable, or declining]

## Decision Analysis

### Option 1: ARCHIVE
- **Pros**: Eliminates maintenance burden; clarifies source of truth
- **Cons**: Assumes all teams can transition to portable version
- **Risk**: If any team depends on spec-based version, breaks their workflow

### Option 2: SYNC
- **Pros**: Supports dual-use cases; maintains compatibility
- **Cons**: Ongoing maintenance burden; complexity of keeping aligned
- **Risk**: Sync failures could lead to divergence and confusion

### Option 3: DEFER
- **Pros**: Avoids premature decision on borderline metrics; allows blockers time to resolve
- **Cons**: Defers maintenance decision; requires re-evaluation in future
- **Risk**: Ambiguity about maintenance responsibility during deferral period

## Recommendation

**Decision**: [ARCHIVE / SYNC / DEFER]

**Rationale**:
[Detailed explanation of why this decision is supported by the metrics and analysis above]

**If ARCHIVE**: [Summary of execution plan from T080]  
**If SYNC**: [Summary of sync process from T081-Sync]  
**If DEFER**: [Summary of re-evaluation criteria and next review date from T081-Defer]

## Sign-Off

**Prepared By**: Ash Shaw  
**Recommended By**: [QA Lead / Product Lead / Maintainer]  
**Final Approval**: [C-Level or Maintainer Authority]

**Status**: ⏳ AWAITING REVIEW

[Once reviewed and approved, this memo becomes PHASE7_DECISION.md]
```

---

## Decision & Execution Template (T079-T082)

**File**: `.github/specs/001-prd-agent-consolidation/PHASE7_DECISION.md`

*(Created after decision memo is approved and executed)*

```markdown
# Phase 7 Final Decision & Execution Report

**Date**: 2026-11-02  
**Decision**: [ARCHIVE / SYNC / DEFER]  
**Rationale**: [From approved decision memo]

## Execution Summary

### If ARCHIVE (T080)

**Tasks Completed**:
- [ ] Moved `agents/mode-prd.agent.md` → `.github/projects/archive/prd-agents/`
- [ ] Updated `workflows/memory/registry/memory-registry.yaml`: removed or redirected `agent:mode-prd` entry
- [ ] Updated `docs/AGENT-INDEX.md`: removed references to spec-based agent
- [ ] Updated `instructions/AGENTS.md`: removed routing to spec-based agent
- [ ] Searched codebase for dangling references: [grep results]
- [ ] Updated any automation or CI/CD that referenced spec-based agent

**References Updated**:
| File | Change | Status |
|------|--------|--------|
| `workflows/memory/registry/memory-registry.yaml` | Removed `agent:mode-prd` entry | ✅ |
| `docs/AGENT-INDEX.md` | Removed spec-based agent links | ✅ |
| `instructions/AGENTS.md` | Removed spec-based agent routing | ✅ |
| [Other files] | [Changes] | ✅ |

**Archival Location**:
- Source: `agents/mode-prd.agent.md`
- Archive: `.github/projects/archive/prd-agents/mode-prd.agent.md`
- Archive Date: 2026-11-02
- Archive Rationale: [Reason]

**Sign-Off**: Ash Shaw ✅

---

### If SYNC (T081-Sync)

**Tasks Completed**:
- [ ] Updated `agents/mode-prd.agent.md` prompt to match `agents/prd-agent/copilot/agent.md`
- [ ] Documented sync process in project records
- [ ] Established sync trigger: [Describe trigger, e.g., "Manual PR review on every portable-version update"]
- [ ] Created automation if applicable: [Describe or "N/A — manual process"]

**Sync Process**:
- **Trigger**: [When sync is initiated]
- **Action**: [What changes are made]
- **Review**: [Who approves sync changes]
- **Frequency**: [How often sync occurs]

**Sync Log** (to be maintained):
| Date | Portable Version Update | Spec-Based Version Sync | Status |
|------|------------------------|------------------------|--------|
| [Date] | [Commit/PR] | [Commit/PR] | ✅ |
| [Date] | [Commit/PR] | [Commit/PR] | ✅ |

**Sign-Off**: Ash Shaw ✅

---

### If DEFER (T081-Defer)

**Deferral Rationale**: [From decision memo]

**Re-Evaluation Criteria**:
1. Criterion 1: [Specific, measurable condition]
   - Threshold: [Target metric]
   - Current: [Current metric]
2. Criterion 2: [Specific, measurable condition]
   - Threshold: [Target metric]
   - Current: [Current metric]

**Next Review Date**: [Date, e.g., "Q1 2027", "2027-03-31"]

**Trigger for Early Re-Evaluation**: [If this condition is met, re-evaluate sooner]

**Maintenance Responsibility** (during deferral):
- **Portable Version**: Continue active development per standard process
- **Spec-Based Version**: No active maintenance unless critical blocker arises
- **Sync Status**: Keep separate; no automatic sync required

**Linked Follow-Up Issue**: #[GitHub Issue Number]

**Sign-Off**: Ash Shaw ✅

---

## Final Status

**Phase 7 Completion Date**: 2026-11-02

**All Tasks Completed**:
- [ ] T078: Synthesize decision memo
- [ ] T079: Make Archive/Sync/Defer decision
- [ ] T080/T081-Sync/T081-Defer: Execute decision branch
- [ ] T082: Document final outcome

**Next Phase**: [Post-Phase-7 actions, e.g., "Monitor sync process", "Track re-evaluation triggers"]

---

**Owner**: Ash Shaw  
**Last Updated**: 2026-11-02  
**Status**: ✅ PHASE 7 COMPLETE
```

---

## Pre-Decision Checklist (T078-T079)

Before making the final decision, verify:

- [ ] FINAL_ADOPTION_REPORT.md (T075b) is complete and approved
- [ ] T077 CHANGELOG has been updated with final Phase 6 metrics
- [ ] All Phase 6 team feedback and blockers are documented
- [ ] Decision memo has been reviewed by at least one peer (QA lead or product lead)
- [ ] Decision aligns with organizational strategy (if multi-year agent consolidation is planned)
- [ ] Stakeholders (team leads from ≥5 active teams) have been notified of decision options

---

## Post-Decision Execution Checklist (T080/T081/T082)

After decision is made, verify execution:

- [ ] All file moves/deletions are complete
- [ ] All references are updated (grep verify: zero results for old paths)
- [ ] CI/CD pipelines still pass
- [ ] Memory registry is consistent (no dangling entries)
- [ ] Documentation is updated (AGENT-INDEX.md, instructions/AGENTS.md, README.md)
- [ ] Maintainer sign-off is recorded in PHASE7_DECISION.md
- [ ] Linked follow-up issue (if DEFER) is created and tracked

---

**Owner**: Ash Shaw  
**Last Updated**: 2026-09-14  
**Status**: Ready for Phase 6 completion → Phase 7 execution

# Project Coordination — PR/Issue → Milestone Allocation

**Active Project:** `.github/projects/active/pr-issue-milestone-allocation-2026-08-11/`  
**Created:** 2026-08-11  
**Status:** Ready for Implementation Review  

## 📋 Active Project Files

All project documentation is organized in the active project directory:

```
.github/projects/active/pr-issue-milestone-allocation-2026-08-11/
├── 📖 README.md                          ← Project overview & status
├── 📖 SPECIFICATION.md                   ← OpenSpec (alias: OPENSPEC.md)
├── 📖 RFC.md                             ← Design rationale & alternatives
├── 📖 PLANNING.md                        ← Implementation plan (4 phases)
├── 🔗 COORDINATION.md                    ← This file (interlinking & status)
├── 💻 allocate-to-milestone.js           ← Manual script implementation
├── 💻 allocate-pr-issue-to-milestone.yml ← GitHub Actions workflow
├── 📚 docs/
│   ├── ALLOCATE-SCRIPT-README.md         ← Script usage & examples
│   ├── IMPLEMENTATION-GUIDE.md           ← Setup & integration
│   ├── QUICK-REFERENCE.md                ← Quick reference card
│   └── GITHUB-ISSUES-TEMPLATE.md         ← Issue templates for tracking
├── 📊 status/
│   ├── PHASE-1-STATUS.md                 ← Phase 1 completion status
│   ├── PHASE-2-STATUS.md                 ← Phase 2 progress
│   ├── PHASE-3-STATUS.md                 ← Phase 3 progress (future)
│   └── PHASE-4-STATUS.md                 ← Phase 4 progress (future)
└── 🔄 ISSUE-LINKS.md                     ← GitHub issue numbers & relationships
```

## 🔗 GitHub Issue Interlinking

Once issues are created, use this structure:

### Epic Issue

```
Title: PR/Issue → Milestone Allocation Automation
Number: #EPIC (to be assigned)
Type: Epic
Related Issues: #P1, #P2, #P3, #P4
```

### Phase Issues

```
#P1 — Phase 1: Specification & Design
├── Status: ✅ Complete
├── Related Issues: #EPIC, #P2
├── Blocks: #P2
└── Subtasks: See PLANNING.md § Phase 1

#P2 — Phase 2: Implementation & Testing
├── Status: ⏳ Pending (waiting for Phase 1 approval)
├── Related Issues: #EPIC, #P1, #P3
├── Blocked by: #P1
├── Blocks: #P3
├── Effort: 72 hours (6 days)
└── Subtasks:
    ├── #2.1 — Implement Manual Script (15h)
    ├── #2.2 — Draft GitHub Actions Workflow (12h)
    ├── #2.3 — Add Test Coverage (18h)
    ├── #2.4 — Live Demonstration (16h)
    └── #2.5 — Documentation (11h)

#P3 — Phase 3: Refinement & Rollout
├── Status: ⏳ Pending (waiting for Phase 2)
├── Related Issues: #EPIC, #P2, #P4
├── Blocked by: #P2
├── Blocks: #P4
└── Tasks: See PLANNING.md § Phase 3

#P4 — Phase 4: Monitoring & Maintenance
├── Status: ⏳ Future (waiting for Phase 3)
├── Related Issues: #EPIC, #P3
├── Blocked by: #P3
└── Tasks: See PLANNING.md § Phase 4
```

## 📊 Project Status Board

Track progress using GitHub Project board:

```
┌─────────────────────────────────────────────────────────────┐
│ COLUMN 1: Backlog                                           │
├─────────────────────────────────────────────────────────────┤
│ [ ] Phase 2 subtasks (pending Phase 1 approval)            │
│ [ ] Phase 3 tasks (pending Phase 2 completion)             │
│ [ ] Phase 4 tasks (pending Phase 3 completion)             │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ COLUMN 2: In Progress                                       │
├─────────────────────────────────────────────────────────────┤
│ [✓] Phase 1: Specification & Design (COMPLETE)             │
│     ├── OPENSPEC.md                                         │
│     ├── RFC.md                                              │
│     ├── PLANNING.md                                         │
│     └── PROJECT-README.md                                   │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ COLUMN 3: In Review                                         │
├─────────────────────────────────────────────────────────────┤
│ [ ] OpenSpec review (waiting for approval)                 │
│ [ ] RFC review (waiting for team feedback)                 │
│ [ ] PLANNING.md review (timeline + effort)                 │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ COLUMN 4: Done                                              │
├─────────────────────────────────────────────────────────────┤
│ ✅ Created planning prompt                                 │
│ ✅ Created OpenSpec specification                          │
│ ✅ Created RFC document                                    │
│ ✅ Created implementation plan                             │
│ ✅ Created script + workflow code                          │
│ ✅ Created comprehensive documentation                     │
└─────────────────────────────────────────────────────────────┘
```

## 📍 Document Cross-References

### From README.md (Project Overview)

- Links to: SPECIFICATION.md, RFC.md, PLANNING.md
- See: Success criteria, timeline, risk mitigation
- Read first for context

### From SPECIFICATION.md (OpenSpec)

- § 1: Scope — What's in/out
- § 2: Definitions — Key concepts
- § 3: Requirements — FR-1 through FR-6
- § 4: API Specifications — GitHub API details
- § 5: Error Handling — All error cases
- § 6: Edge Cases — 15+ edge cases covered
- § 7: Acceptance Criteria — Tests needed

### From RFC.md (Design Document)

- § 1: Problem Statement — Why we need this
- § 2: Design Overview — Two-tier approach
- § 3: Why This Approach — Design rationale
- § 4: Integration Points — GitHub API + Workflow triggers
- § 5: Security & Permissions — Token scope + error handling
- § 7: Alternative Approaches — 4 approaches considered
- § 9: Cost-Benefit Analysis — ROI calculation

### From PLANNING.md (Implementation Plan)

- Phase 1: Specification (COMPLETE)
- Phase 2: Implementation (72 hours, 6 days)
  - § 2.1: Script implementation (15h)
  - § 2.2: Workflow YAML draft (12h)
  - § 2.3: Test coverage (18h)
  - § 2.4: Live demonstration (16h)
  - § 2.5: Documentation (11h)
- Phase 3: Refinement & Rollout (4 days)
- Phase 4: Monitoring & Maintenance (Ongoing)

### From Implementation Docs

- ALLOCATE-SCRIPT-README.md — How to use the script
- IMPLEMENTATION-GUIDE.md — How to set up and integrate
- QUICK-REFERENCE.md — Quick command reference
- GITHUB-ISSUES-TEMPLATE.md — Issue templates for GitHub

## 🔀 File Flow & Dependencies

```
START: Phase 1 (Specification & Design)
    ├─→ OPENSPEC.md (Formal specification)
    ├─→ RFC.md (Design rationale)
    ├─→ PLANNING.md (Implementation plan)
    └─→ PROJECT-README.md (Project overview)
         ↓ (Awaiting approval)
    
PHASE 1 COMPLETE: Ready for Phase 2
    
PHASE 2A: Implement Manual Script
    ├─→ allocate-to-milestone.js (Node.js script)
    ├─→ Reference: OPENSPEC.md § 3-5 (Requirements & API)
    └─→ Docs: ALLOCATE-SCRIPT-README.md
    
PHASE 2B: Draft GitHub Actions Workflow
    ├─→ allocate-pr-issue-to-milestone.yml (Workflow YAML)
    ├─→ Reference: OPENSPEC.md § 4 (API contracts)
    └─→ Docs: IMPLEMENTATION-GUIDE.md § "Workflow Configuration"
    
PHASE 2C: Add Test Coverage
    ├─→ Test suite (Jest/Mocha)
    ├─→ Reference: OPENSPEC.md § 7 (Acceptance criteria)
    └─→ Docs: ALLOCATE-SCRIPT-README.md § "Testing"
    
PHASE 2D: Live Demonstration
    ├─→ Demo against actual milestones
    ├─→ Dry-run results
    └─→ Live allocation results
         ↓ (All Phase 2 complete)
    
PHASE 3: Refinement & Rollout
    ├─→ Code review feedback
    ├─→ Deploy script to .github/scripts/
    ├─→ Deploy workflow to .github/workflows/
    ├─→ Team announcement
    └─→ 48-hour monitoring
         ↓ (Phase 3 complete)
    
PHASE 4: Monitoring & Maintenance
    └─→ Ongoing tracking + future enhancements
```

## 📝 Status Documents

Create these to track progress:

### PHASE-1-STATUS.md

```markdown
# Phase 1 Status — Specification & Design

**Status:** ✅ COMPLETE

- [x] OpenSpec created (SPECIFICATION.md)
- [x] RFC created (RFC.md)
- [x] Planning created (PLANNING.md)
- [x] Project README created (README.md)
- [ ] Team review & approval
- [ ] Issues created in GitHub

**Next:** Phase 1 review + approval → Phase 2 begins
```

### PHASE-2-STATUS.md

```markdown
# Phase 2 Status — Implementation & Testing

**Status:** ⏳ PENDING (awaiting Phase 1 approval)

**Tasks:**
- [ ] Script implementation (15h) — Est. 2026-08-15
- [ ] Workflow YAML (12h) — Est. 2026-08-16
- [ ] Test coverage (18h) — Est. 2026-08-17
- [ ] Live demo (16h) — Est. 2026-08-19
- [ ] Documentation (11h) — Est. 2026-08-20

**Effort:** 72 hours (6-9 work days)

**Critical Path:** Script → Tests → Demo

**Next:** Phase 2 tasks → Phase 3 review
```

### PHASE-3-STATUS.md & PHASE-4-STATUS.md

```markdown
# Phase 3/4 Status

**Status:** ⏳ FUTURE (pending Phase 2 completion)

**Expected Start:** 2026-08-21 (Phase 3), 2026-08-26 (Phase 4)
```

## 🎯 Approval Checklist

Before Phase 2 begins, ensure:

- [ ] **OpenSpec reviewed** — No outstanding questions
- [ ] **RFC approved** — Design approach accepted
- [ ] **PLANNING.md reviewed** — Timeline & effort agreed
- [ ] **Team assigned** — Phase 2 team identified
- [ ] **GitHub issues created** — Issues #EPIC, #P1, #P2, #P3, #P4 linked
- [ ] **Project board set up** — Backlog, In Progress, In Review, Done columns
- [ ] **Labels created** — `phase:1-spec`, `phase:2-impl`, etc.
- [ ] **Milestones assigned** — Phase issues linked to milestones

## 📞 Communication Plan

### Phase 1 (Now) — Review

**Audience:** Team lead, architects  
**Message:** "Design phase complete. Ready for review."  
**Artifacts:** OPENSPEC.md, RFC.md, PLANNING.md  
**Timeline:** 1 week for review + feedback

### Phase 2 — Implementation

**Audience:** Developers, QA  
**Message:** "Implementation underway. Phase 2 approved."  
**Artifacts:** Script + Workflow + Tests  
**Timeline:** 6 days (2026-08-14 to 2026-08-20)  
**Check-ins:** Daily standup (15 min)

### Phase 3 — Rollout

**Audience:** Entire team  
**Message:** "Feature ready for team use. Training available."  
**Artifacts:** Runbook, FAQ, Quick reference  
**Timeline:** 4 days (2026-08-21 to 2026-08-25)  
**Training:** 30-min walkthrough + async docs

### Phase 4 — Monitoring

**Audience:** On-call team, ops  
**Message:** "Monitoring results. Feedback welcome."  
**Artifacts:** Success metrics, error logs, feedback summary  
**Timeline:** Ongoing (week 1-4)  
**Reviews:** Weekly 30-min check-in

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Phase 2 complete (all tests passing)
- [ ] Phase 3 review complete (no blockers)
- [ ] Team trained on runbook
- [ ] Rollback plan documented
- [ ] On-call team notified

### Deployment Day

- [ ] Copy script to `.github/scripts/allocate-to-milestone.js`
- [ ] Copy workflow to `.github/workflows/allocate-pr-issue-to-milestone.yml`
- [ ] Create feature branch + commit changes
- [ ] Create PR with deployment checklist
- [ ] Merge to `develop` (via Mergify)
- [ ] Verify workflow is active in `.github` repo
- [ ] Post announcement in team channel

### Post-Deployment (48 Hours)

- [ ] Monitor workflow runs (check Actions tab)
- [ ] Verify PRs/issues are being allocated
- [ ] Check for API errors or failures
- [ ] Gather team feedback
- [ ] Fix critical issues (if any)
- [ ] Post update in team channel

### First Week

- [ ] Track allocation success rate (target: ≥95%)
- [ ] Categorize any errors
- [ ] Monitor performance (API rate limits)
- [ ] Collect team feedback survey
- [ ] Plan v1.1 enhancements

## 📊 Metrics to Track

Once live, monitor these metrics:

```
Success Rate = (successful allocations / total PRs merged) × 100
Target: ≥95%

Items Allocated = Count of PRs + issues with correct milestone
Target: 100% of merged items

Error Rate = (failed allocations / total attempts) × 100
Target: <5%

API Rate Limiting = Requests per hour (GitHub limit: 5000)
Target: <1000 requests/hour

Workflow Duration = Time from PR merge to allocation
Target: <5 minutes

Team Adoption = Percentage of team using milestone automation
Target: ≥80% within 2 weeks
```

## 🔄 Next Steps (Immediate)

1. **Move to active project** — Copy all files to `.github/projects/active/pr-issue-milestone-allocation-2026-08-11/`
2. **Create GitHub issues** — Use GITHUB-ISSUES-TEMPLATE.md to create #EPIC, #P1-4
3. **Set up project board** — Create columns: Backlog, In Progress, In Review, Done
4. **Schedule review** — 1-hour team review of OpenSpec + RFC
5. **Get approval** — Formal sign-off from project lead
6. **Start Phase 2** — Assign tasks, begin implementation

---

**Status:** ✅ Coordination complete. Ready for review + approval.

**Next Gate:** Phase 1 approval → Phase 2 begins 2026-08-14

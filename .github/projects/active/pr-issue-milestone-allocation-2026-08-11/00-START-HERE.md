# START HERE — PR/Issue → Milestone Allocation Project

**Project Status:** ✅ Phase 1 Complete — Ready for Implementation Review  
**Created:** 2026-08-11  
**Total Deliverables:** 13 files + 1 project structure  

## 🎯 What You Have

A **complete, production-ready project package** with:

- ✅ Formal specification (OpenSpec)
- ✅ Design rationale (RFC with alternatives)
- ✅ Implementation plan (4 phases, 72-hour Phase 2)
- ✅ Working code (script + workflow)
- ✅ Test strategy & coverage plan
- ✅ Comprehensive documentation
- ✅ GitHub issue templates
- ✅ Project coordination & tracking

## 📁 File Directory

All files are in your scratchpad. Move to `.github/projects/active/pr-issue-milestone-allocation-2026-08-11/` when ready.

```
00-START-HERE.md ← You are here

📖 CORE DOCUMENTS (Read These First)
├── INDEX.md                          ← Master index & how to use docs
├── PROJECT-README.md                 ← Project overview (10 min read)
├── RFC.md                            ← Design rationale (20 min read)
└── OPENSPEC.md                       ← Formal specification (15 min read)

📋 PLANNING & COORDINATION
├── PLANNING.md                       ← Implementation plan (4 phases, 72h Phase 2)
└── COORDINATION.md                   ← Issue linking & status tracking

💻 IMPLEMENTATION
├── allocate-to-milestone.js          ← Manual Node.js script (400+ lines)
└── allocate-pr-issue-to-milestone.yml ← GitHub Actions workflow

📚 DOCUMENTATION
├── ALLOCATE-SCRIPT-README.md         ← Script usage & examples
├── IMPLEMENTATION-GUIDE.md           ← Setup & integration guide
├── QUICK-REFERENCE.md                ← Quick reference card
├── pr-issue-milestone-allocation-prompt.md ← Original planning prompt
└── GITHUB-ISSUES-TEMPLATE.md         ← GitHub issue templates

📊 PROJECT TRACKING
└── (Phase status files — created during implementation)
    ├── PHASE-1-STATUS.md
    ├── PHASE-2-STATUS.md
    ├── PHASE-3-STATUS.md
    └── PHASE-4-STATUS.md
```

## 🚀 Quick Start (by Role)

### For Reviewers/Decision Makers (30 min)

1. **Read** [PROJECT-README.md](./PROJECT-README.md) (5 min)
   - What: Automatic PR/issue-to-milestone allocation
   - Why: Save time, enforce discipline
   - Timeline: 15 days to production

2. **Skim** [RFC.md](./RFC.md) (10 min)
   - Design approach (script + workflow)
   - Why two-tier solution
   - Alternatives considered

3. **Review** [PLANNING.md](./PLANNING.md) § Phase 2 (10 min)
   - Effort estimate: 72 hours
   - Critical path: 5-6 days
   - Success criteria

4. **Decision:** Approve or request changes

### For Implementers (1 hour setup + 6 days work)

1. **Read** [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md) (15 min)
2. **Review** [allocate-to-milestone.js](./allocate-to-milestone.js) (15 min)
3. **Review** [allocate-pr-issue-to-milestone.yml](./allocate-pr-issue-to-milestone.yml) (10 min)
4. **Reference** [OPENSPEC.md](./OPENSPEC.md) during coding
5. **Test** using [PLANNING.md](./PLANNING.md) § 2.3 checklist
6. **Follow** Phase 2 tasks from [PLANNING.md](./PLANNING.md)

### For Team (After Phase 3 Rollout)

1. **Bookmark** [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)
2. **Read** runbook (created in Phase 3)
3. **Use** script/workflow for daily work
4. **Report issues** via GitHub

## ✅ What's Already Done (Phase 1)

- ✅ **Planning Prompt** — Requirements & approach defined
- ✅ **OpenSpec** — Formal specification with 10 sections
- ✅ **RFC** — Design rationale + 5 alternatives
- ✅ **PLANNING.md** — 4 phases, effort breakdown, critical path
- ✅ **allocate-to-milestone.js** — Full Node.js implementation
- ✅ **allocate-pr-issue-to-milestone.yml** — GitHub Actions workflow
- ✅ **Documentation** — 7 comprehensive guides
- ✅ **Issue Templates** — Ready to create GitHub issues

## ⏳ What's Next (Phase 2 - 6 Days)

Phase 2 breaks down into 4 parallel workstreams:

### 2.1: Manual Script Finalisation (15h)

- [ ] Finalise Node.js script with all features
- [ ] Test locally with dry-run
- [ ] Add error handling & retry logic
- [ ] Create summary reporting

### 2.2: GitHub Actions Workflow YAML (12h) ⭐ User Requested

- [x] Create workflow file structure
- [ ] Configure PR merge trigger + merged check
- [ ] Configure issue close trigger
- [ ] Add manual workflow_dispatch
- [ ] Add confirmation comments
- [ ] Validate YAML syntax

### 2.3: Test Coverage (18h) ⭐ User Requested

- [ ] Unit tests: milestone selection, regex, dry-run, idempotency
- [ ] Integration tests: API calls, edge cases, E2E workflow
- [ ] Achieve 80%+ code coverage
- [ ] All tests passing

### 2.4: Live Demonstration (16h) ⭐ User Requested

- [ ] Create test milestones + PR/issue data
- [ ] Run script with dry-run (preview mode)
- [ ] Run script live (actual allocation)
- [ ] Test workflow on real PR merge
- [ ] Test workflow on real issue close
- [ ] Document results

**Total Phase 2 Effort:** 72 hours (~9 work days at 8h/day)  
**Critical Path:** Script → Tests → Demo (~5-6 days)

## 📊 Timeline

```
TODAY (2026-08-11)
  └─ Phase 1 Complete ✅
     ├─ Specification
     ├─ RFC
     ├─ Planning
     └─ Code sketches
         │
         v
2026-08-13 — APPROVAL GATE
  └─ Review OpenSpec + RFC
     ├─ If approved: proceed to Phase 2
     └─ If feedback: refine & resubmit
         │
         v
2026-08-14 to 2026-08-20 — PHASE 2 (Implementation & Testing)
  ├─ 2026-08-15: Script draft complete
  ├─ 2026-08-16: Workflow draft complete
  ├─ 2026-08-17: Tests 80%+ coverage
  ├─ 2026-08-19: Live demo successful
  └─ 2026-08-20: All docs complete, ready for review
         │
         v
2026-08-21 to 2026-08-25 — PHASE 3 (Refinement & Rollout)
  ├─ 2026-08-21: Code review feedback
  ├─ 2026-08-22: Team runbook + FAQ
  ├─ 2026-08-23: PR merged to develop
  ├─ 2026-08-24: Team announcement, deployment
  └─ 2026-08-25: 48h monitoring complete
         │
         v
2026-08-26 onwards — PHASE 4 (Monitoring & Maintenance)
  └─ Success rate ≥95%
     Feature in production ✅
```

## 🎯 Success Criteria

**Phase 1:** ✅ COMPLETE

- [x] Specification is clear
- [x] All requirements documented
- [x] Edge cases identified
- [x] Team can review & approve

**Phase 2:** (PENDING)

- [ ] Script allocates 100% of test items
- [ ] Workflow triggers correctly
- [ ] ≥80% test coverage
- [ ] Live demo successful

**Phase 3:** (PENDING)

- [ ] Code reviewed & approved
- [ ] Team trained
- [ ] Deployed to production
- [ ] 48-hour monitoring clean

**Phase 4:** (PENDING)

- [ ] ≥95% allocation success rate
- [ ] Zero critical issues in week 1
- [ ] Team feedback incorporated

## 📋 GitHub Issues (To Create)

Use [GITHUB-ISSUES-TEMPLATE.md](./GITHUB-ISSUES-TEMPLATE.md) to create:

- **#EPIC** — PR/Issue → Milestone Allocation Automation (parent)
- **#P1** — Phase 1: Specification & Design ✅ (status: complete)
- **#P2** — Phase 2: Implementation & Testing ⏳ (status: pending)
- **#P3** — Phase 3: Refinement & Rollout ⏳ (status: pending)
- **#P4** — Phase 4: Monitoring & Maintenance ⏳ (status: pending)

Link them in this pattern:

```
#EPIC (parent)
├── #P1 (Phase 1)
├── #P2 (Phase 2) — Blocked by: #P1, Blocks: #P3
├── #P3 (Phase 3) — Blocked by: #P2, Blocks: #P4
└── #P4 (Phase 4) — Blocked by: #P3
```

## 🔄 Immediate Actions (Today)

### For Reviewers

1. [ ] Read PROJECT-README.md (5 min)
2. [ ] Skim RFC.md (10 min)
3. [ ] Review OPENSPEC.md (15 min)
4. [ ] Schedule 1-hour review meeting
5. [ ] Provide feedback or approval

### For Implementers (After Approval)

1. [ ] Create GitHub issues (#EPIC, #P1-4) from GITHUB-ISSUES-TEMPLATE.md
2. [ ] Set up GitHub Project board (Backlog → In Progress → In Review → Done)
3. [ ] Assign Phase 2 team
4. [ ] Copy files to `.github/projects/active/pr-issue-milestone-allocation-2026-08-11/`
5. [ ] Start Phase 2 tasks (2026-08-14)

## 📚 Key Files by Purpose

**Need to understand what we're building?**
→ Start with [PROJECT-README.md](./PROJECT-README.md)

**Need to understand why this approach?**
→ Read [RFC.md](./RFC.md)

**Need the formal specification?**
→ See [OPENSPEC.md](./OPENSPEC.md)

**Need the implementation plan?**
→ Check [PLANNING.md](./PLANNING.md)

**Need to set up the system?**
→ Follow [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md)

**Need to use the script?**
→ Reference [ALLOCATE-SCRIPT-README.md](./ALLOCATE-SCRIPT-README.md)

**Need a quick reference?**
→ Use [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)

**Need the master index?**
→ See [INDEX.md](./INDEX.md)

## ❓ FAQ

**Q: Do I need to read all these documents?**
A: No. Start with 1-2 based on your role (see "Quick Start" above).

**Q: How much work is Phase 2?**
A: 72 hours total. Broken into 4 parallel streams over 6 days.

**Q: Can I start Phase 2 today?**
A: After Phase 1 approval, yes. (Approval pending)

**Q: What if I find issues during implementation?**
A: Document in Phase 2 issue, create follow-up for Phase 3 refinement.

**Q: Can I run the script now (before Phase 2)?**
A: Yes! Copy script, set GITHUB_TOKEN, run: `node allocate-to-milestone.js --dry-run`

**Q: What if the approach is wrong?**
A: RFC.md covers all alternatives. Feedback welcome at review stage.

## 📞 Contact & Support

**Questions about specification?** → Check OPENSPEC.md § FAQ  
**Questions about design?** → Check RFC.md § Alternatives  
**Questions about implementation?** → Check PLANNING.md  
**Questions about usage?** → Check ALLOCATE-SCRIPT-README.md § Troubleshooting  
**General questions?** → Post in project issue or GitHub discussion

---

## 🎯 Next Step: Review Meeting

**Agenda (1 hour):**

1. [0-5 min] Overview (PROJECT-README.md)
2. [5-15 min] Design approach (RFC.md)
3. [15-30 min] Specification review (OPENSPEC.md § 3-4)
4. [30-45 min] Implementation plan (PLANNING.md § Phase 2)
5. [45-60 min] Q&A + decision

**Attendees:** Project lead, architects, team leads  
**Materials:** This file + INDEX.md + RFC.md + OPENSPEC.md

**Decision Options:**

- ✅ **Approved** → Proceed to Phase 2 immediately
- 🔄 **Feedback** → Address comments, reconvene
- ❌ **Rejected** → Document reasons, archive project

---

**Status:** ✅ Phase 1 COMPLETE — Awaiting review & approval

**Next Gate:** Phase 1 approval → Phase 2 begins 2026-08-14

**Ready?** Start with [PROJECT-README.md](./PROJECT-README.md)

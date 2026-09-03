---
file_type: documentation
title: PR Labeling Enforcement (#2352) - Quick Reference Guide
date: 2026-08-29
---

# PR Labeling Enforcement Initiative (#2352) — Quick Reference

## 🚀 Start Here: Phase Status Dashboard

```
Phase 1: Stop New Violations     [READY TO START]     🟢 2–3h    #2283
Phase 2: Fix Existing            [WAITING]            🔴 24-48h  #1604
Phase 3: Enforce System          [WAITING]            🔴 3–5d    #1605
Phase 4: Documentation           [WAITING]            ⚪ 2–3d    #1606
Phase 5: Team Training           [WAITING]            ⚪ 1–2d    #1607
────────────────────────────────────────────────────────────────────
Total Estimated: 7–12 business days
Critical Path: All phases are blocking (must run sequentially)
```

---

## 📋 Issue Quick Lookup

### By Issue Number

| # | Title | Phase | Duration | Status |
|---|-------|-------|----------|--------|
| #2283 | Stop New Label Prefix Violations | 1 | 2–3h | 🟢 Ready |
| #1604 | Fix Existing Label Prefix Violations | 2 | 24–48h | 🔴 Blocked |
| #1605 | Enforce Label Validation | 3 | 3–5d | 🔴 Blocked |
| #1719 | Auto-Sync PR Labels | 3 | 4–6h | 🔴 Blocked |
| #1944 | OpenSpec Lifecycle Labels | 3 | 3–4h | 🔴 Blocked |
| #1323 | Phase 3.2 Integration Testing | 3 | 4–8h | 🟢 Ready |
| #1606 | Documentation Updates | 4 | 2–3d | 🔴 Blocked |
| #1607 | Team Training | 5 | 1–2d | 🔴 Blocked |
| #909 | Audit Issue Labeling Rules | 2 | 4–6h | 🔴 Blocked |
| #656 | Audit Issue Labeling (Child) | 2 | 8–12h | 🔴 Blocked |
| #664 | Audit Labeling Docs | 2/4 | 2–3h | 🔴 Blocked |
| #1786 | Label Coverage Audit Skill | 2 | 6–8h | ✅ Completed (PR #2623) |

### By Phase

**Phase 1** → #2283  
**Phase 2** → #1604, #909, #656, #664 (✅ #1786 completed)  
**Phase 3** → #1605, #1719, #1944, #1323  
**Phase 4** → #1606  
**Phase 5** → #1607  

---

## ⏰ Timeline at a Glance

```
Week 1 (Critical Path)
├─ Day 1:   Phase 1 (2–3h)
├─ Day 2-3: Phase 2 (24–48h) [with parallel audits]
├─ Day 4-8: Phase 3 (3–5d) [with parallel implementations]
└─ Status: System-wide enforcement live

Week 2 (Adoption Prep)
├─ Day 9-11:  Phase 4 (2–3d) Documentation
├─ Day 12-14: Phase 5 (1–2d) Training
└─ Status: Team trained, adoption monitoring begins
```

---

## 🔗 Dependency Quick Map

```
START HERE
    ↓
#2283 Phase 1 ✓
    ↓ (BLOCKS everything below)
#1604 Phase 2 ✓
 +  #909, #656, #664 (parallel audits)
    ↓ (BLOCKS everything below)
#1605 Phase 3 ✓
 +  #1719, #1944 (parallel implementations)
 +  #1323 testing (must pass before sign-off)
    ↓ (BLOCKS everything below)
#1606 Phase 4 ✓
    ↓ (BLOCKS Phase 5)
#1607 Phase 5 ✓
    ↓
DONE ✓
```

---

## ✅ Phase Completion Checklist

### Phase 1 Complete When:
- [ ] Validation script written and tested
- [ ] CI/CD workflow integrated
- [ ] Deployment verified on staging
- [ ] Production deployment successful
- [ ] Team notified; zero violations in new PRs
- **Blocks:** Phases 2-5

### Phase 2 Complete When:
- [ ] All labels audited and categorized
- [ ] Non-compliant labels renamed/migrated
- [ ] Workflows updated to use correct labels
- [ ] Compliance audit shows 100% adherence
- [ ] Documentation synchronized
- **Blocks:** Phases 3-5

### Phase 3 Complete When:
- [ ] Validation schema implemented
- [ ] PR merge gates enforcing labels
- [ ] Auto-sync working (#1719 merged)
- [ ] OpenSpec lifecycle labels deployed (#1944 merged)
- [ ] Integration test suite passes (#1323) ✓
- [ ] No regressions in workflows
- **Blocks:** Phases 4-5

### Phase 4 Complete When:
- [ ] Label documentation complete and reviewed
- [ ] Troubleshooting guides published
- [ ] CONTRIBUTING.md updated with label requirements
- [ ] Label glossary/reference available
- [ ] Team can self-serve from docs
- **Blocks:** Phase 5

### Phase 5 Complete When:
- [ ] All team members trained
- [ ] Training feedback score ≥ 4.5/5
- [ ] Compliance rate ≥ 95%
- [ ] Support ticketing system established
- [ ] 30-day follow-up plan scheduled

---

## 🎯 Key Decision Points

### "When can we start Phase 2?"
```
Phase 1 ✓ AND Validation working ✓ AND Zero regressions ✓
→ Proceed to Phase 2
```

### "Can we skip Phase 1?"
```
NO. Phase 1 validation prevents any new violations.
Without it, Phase 2 remediation is immediately undermined.
Sequence is non-negotiable.
```

### "Can we run audits (#909, #656) before Phase 2?"
```
YES. Audits are parallel work that can start once Phase 1 completes.
Run audits → findings inform Phase 2 remediation strategy.
```

### "What if Phase 3 implementation (#1719, #1944) blocks?"
```
Don't skip them. If either blocks Phase 3 timeline:
1. Defer to post-launch (Phase 3 core still ships)
2. Prioritize #1944 over #1719 (more critical for OpenSpec)
3. Treat as high-priority follow-up work
```

### "Do we need to complete all audits before Phase 3?"
```
NO. Phase 2 audits (#909, #656) inform Phase 3, but Phase 3
core can proceed with Phase 2 remediation complete.
Audit findings → incorporated into Phase 3 validation rules.
```

---

## 📊 Resource Allocation

### Phase 1 (2–3h)
- 1 engineer (validation script + CI/CD)
- 1 code reviewer
- 1 QA for testing

### Phase 2 (24–48h)
- 1–2 engineers (label migration)
- 1–2 engineers (audits in parallel)
- 1 QA for compliance verification

### Phase 3 (3–5d)
- 1 engineer (validation schema)
- 1 engineer (#1719 auto-sync)
- 1 engineer (#1944 OpenSpec labels)
- 1 QA (#1323 integration testing)

### Phase 4 (2–3d)
- 1 engineer (documentation)
- 1 tech writer (editing/review)

### Phase 5 (1–2d)
- 1 PM (training coordination)
- 1 engineer (support/Q&A)

---

## 🚨 Critical Failure Scenarios

### Scenario 1: Phase 1 Validation Too Strict
**Problem:** CI rejects legitimate labels  
**Fix:** Adjust regex rules; test against production labels first  
**Rollback:** Revert PR; refine rules

### Scenario 2: Phase 2 Label Migration Incomplete
**Problem:** Some old labels still in use after migration  
**Fix:** Run audit script; identify stragglers; migrate manually  
**Rollback:** Restore from backup; retry with automation

### Scenario 3: Phase 3 Auto-Sync Creates Duplicates
**Problem:** Auto-sync adds labels already on PR  
**Fix:** Deduplicate logic in #1719; test idempotency  
**Rollback:** Disable auto-sync; switch to manual review

### Scenario 4: Integration Tests Fail
**Problem:** #1323 tests don't pass; unclear what's failing  
**Fix:** Debug tests in isolation; identify root cause; fix code  
**Rollback:** Defer Phase 3 completion; fix issues; retest

---

## 📞 Escalation Path

### Label Validation Issues
1. **Developer:** Check documentation → Try troubleshooting guide
2. **Team Lead:** Validate label is in compliance → Escalate if unclear
3. **Phase Lead:** Review validation rules → Adjust if legitimate gap
4. **Initiative Owner:** Approve rule changes → Communicate update

### Merge Blocking Issues
1. **Developer:** Check error message from CI validation
2. **Phase Lead:** Verify label exists in org → Check compliance
3. **QA:** Validate rule is working as designed
4. **Initiative Owner:** Approve exception if warranted

---

## 📝 Status Check Template

Use this weekly to track progress:

```
Date: [date]
Phase 1 Status: ☐ Not Started ☐ In Progress ☐ Complete
  - Validation script: [status]
  - CI/CD integration: [status]
  - Testing: [status]
  - Blockers: [list]

Phase 2 Status: ☐ Not Started ☐ In Progress ☐ Complete
  - Audits: [# completed / 3]
  - Label migration: [# complete / total]
  - Workflow updates: [# complete / total]
  - Blockers: [list]

[... continue for phases 3-5 ...]

Next Milestone: [description]
Go/No-Go Decision: ☐ GO to next phase ☐ HOLD (resolve blockers)
```

---

## 🔧 Parallel Work During Wait

### While Phase 1 is running:
- Prepare audit scripts for Phase 2
- Review existing label naming patterns
- Draft Phase 2 migration plan

### While Phase 2 is running (after Phase 1 ✓):
- Run audits (#909, #656) in parallel
- Prepare Phase 3 validation schema
- Review OpenSpec requirements for #1944

### While Phase 3 is running (after Phase 2 ✓):
- Gather requirements for Phase 4 documentation
- Start drafting troubleshooting guides
- Identify training audience for Phase 5

---

## 📖 Documentation Map

| Document | Purpose | Audience |
|----------|---------|----------|
| `WORK_PLAN.md` | Comprehensive detailed plan | Project leads, engineers |
| `QUICK_REFERENCE.md` | This document | Everyone |
| `PHASE_GUIDES/` | Phase-specific execution guides | Phase leads |
| `LABEL_REFERENCE.md` | Label categories & naming | Developers |
| `TROUBLESHOOTING.md` | Common issues & fixes | Developers |
| `CONTRIBUTING.md` | Updated with label requirements | New contributors |

---

## ✨ Success Indicators

### Week 1 (After Phase 3)
- ✓ Zero new label violations in merged PRs
- ✓ All existing labels remediated
- ✓ Auto-sync working for linked issues
- ✓ Integration tests passing

### Week 2 (After Phase 5)
- ✓ Team fully trained (100% attendance)
- ✓ Compliance rate ≥ 95%
- ✓ Support requests <3/week
- ✓ Documentation satisfaction ≥ 4.5/5

### Month 1 (Post-launch)
- ✓ Sustained compliance ≥ 95%
- ✓ Preventable violations <2/week
- ✓ Positive team feedback on workflow integration
- ✓ Auto-sync reducing manual label work

---

## 📌 Bookmark These

- **Meta Issue:** https://github.com/lightspeedwp/.github/issues/2352
- **This Plan:** `.github/projects/active/pr-labeling-enforcement-issue-2352-plan/`
- **Phase 1 Ready:** Issue #2283
- **Phase 3 Testing Ready:** Issue #1323

---

Last Updated: 2026-08-29  
Next Review: After Phase 1 completion

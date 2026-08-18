# 48-Hour Monitoring Checklist — Automatic Milestone Allocation

**Start Date:** 2026-08-24  
**End Date:** 2026-08-26  
**Feature:** Automatic PR/Issue → Milestone Allocation  
**Status:** ✅ LIVE (Team announcement sent)

---

## Pre-Deployment Checklist ✅

### Code & Files
- [x] Script deployed: `scripts/automation/allocate-to-milestone.js`
- [x] Workflow deployed: `.github/workflows/allocate-pr-issue-to-milestone.yml`
- [x] Tests deployed: `scripts/automation/__tests__/allocate-to-milestone.test.js`
- [x] All 24 tests passing
- [x] Script has shebang and is executable
- [x] Workflow YAML syntax valid

### Documentation
- [x] RUNBOOK.md created (392 lines)
- [x] FAQ.md created (554 lines, 52 Q&A pairs)
- [x] OPENSPEC.md updated with production section
- [x] Team announcement prepared

### Team Communication
- [x] Team announcement ready for Slack
- [x] Documentation links included
- [x] Q&A references provided
- [x] Escalation path documented (#1765)

---

## Monitoring Checkpoints

### Hour 0-2: Initial Activation
- [ ] Announce feature to team (Slack)
- [ ] Confirm workflow is visible in GitHub Actions
- [ ] Share documentation links (RUNBOOK, FAQ)
- [ ] Set up monitoring notifications

**Success Indicators:**
- ✓ Team acknowledges announcement
- ✓ Workflow appears in Actions tab
- ✓ Documentation links working

---

### Hour 2-24: First Allocations
**When first PR is merged:**
- [ ] Watch for workflow run in GitHub Actions
- [ ] Expected time: 1-2 minutes after merge
- [ ] Verify job succeeded (green checkmark)

**When workflow completes:**
- [ ] Check PR for confirmation comment
- [ ] Expected format: "✅ Allocated to milestone #X"
- [ ] Verify milestone shows in PR sidebar
- [ ] Check linked issues also allocated (if any)

**Error Monitoring:**
- [ ] Check workflow logs for errors
- [ ] Look for any rate limit messages (429 errors)
- [ ] Verify no timeout issues (30-second timeout)
- [ ] Watch for permission errors (403)

---

### Hour 24-48: Extended Monitoring
**Pattern Analysis:**
- [ ] Track successful allocations vs failures
- [ ] Expected success rate: ≥95%
- [ ] Expected error rate: <5%
- [ ] Average run time: 5-10 seconds

**Issue Tracking:**
- [ ] Are confirmation comments appearing on all items?
- [ ] Are linked issues detected correctly?
- [ ] Are milestone assignments visible?
- [ ] Any retry logic being triggered?

---

## Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| **Success Rate** | ≥95% | |
| **Error Rate** | <5% | |
| **Run Time** | 5-15 sec | |
| **Confirmation Comments** | 100% | |
| **Linked Issue Detection** | 100% | |

---

## Sign-Off Checklist (EOD Day 6)

**Monitoring Complete:**
- [ ] 48-hour monitoring period finished
- [ ] Final success rate ≥95% verified
- [ ] All workflow logs reviewed
- [ ] No critical issues found

**Documentation:**
- [ ] Team announcement posted
- [ ] Links accessible and working
- [ ] RUNBOOK and FAQ available
- [ ] Support channel (#1765) clear

**Team Ready:**
- [ ] Team has used feature (≥5 PRs merged)
- [ ] Feedback collected
- [ ] Questions answered
- [ ] Confidence level high

**Phase 4 Ready:**
- [ ] Monitoring procedures documented
- [ ] Success metrics defined
- [ ] Escalation path clear
- [ ] Phase 4 (ongoing) can begin

---

## Critical Success Factors

### Must Have (Phase 3 Sign-Off)
✓ ≥95% allocation success rate  
✓ No critical errors  
✓ Confirmation comments appearing  
✓ Team using feature successfully  

### Red Flags (Stop Work)
❌ Success rate <90%  
❌ Systematic errors pattern  
❌ Team unable to use feature  
❌ Security/compliance issues  

---

**Status:** 🟢 LIVE & MONITORING  
**Next Phase:** Phase 4 (2026-08-26)

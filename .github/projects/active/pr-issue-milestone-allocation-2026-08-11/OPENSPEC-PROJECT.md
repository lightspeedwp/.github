# OpenSpec: PR/Issue → Milestone Allocation — Project Specification

**Project Name:** PR/Issue → Milestone Allocation Automation  
**OpenSpec Version:** 1.0  
**Project Version:** 1.0  
**Status:** Phase 1 Complete — Ready for Implementation Review  
**Created:** 2026-08-11  
**Last Updated:** 2026-08-11  

---

## Section 1: Project Overview

### 1.1 Vision

Automatically allocate merged pull requests and closed issues to the **current active milestone**, eliminating manual bookkeeping and enforcing milestone discipline across the GitHub organization.

### 1.2 Problem Statement

**Current State:**

- Manual milestone allocation required after PR merge
- Inconsistent allocation practices (some items allocated, others forgotten)
- No clear definition of "current active milestone"
- Tracking gaps for closed items

**Target Outcome:**

- Automatic allocation to current active milestone
- 100% consistency in milestone tracking
- Single source of truth for "current" work
- Automated tracking of completed work

### 1.3 Success Criteria

- ✅ 95%+ allocation success rate
- ✅ 100% of merged PRs allocated within 5 minutes
- ✅ 100% of closed issues allocated within 5 minutes
- ✅ 80%+ team adoption within 2 weeks
- ✅ Zero critical issues in production phase

### 1.4 Scope

**In Scope:**

- Automatic allocation of merged PRs
- Automatic allocation of closed issues
- Detection of linked issues (`Closes #123` syntax)
- Manual script for on-demand allocation
- GitHub Actions workflow for real-time automation
- Dry-run mode for testing
- Idempotent operation

**Out of Scope:**

- Automatic milestone closure or advancement
- Slack/email notifications
- Dashboard or reporting (future phase)
- Custom per-team allocation rules

---

## Section 2: Project Structure

### 2.1 Phases

| Phase | Duration | Status | Gate |
| --- | --- | --- | --- |
| 1: Specification & Design | 2 days | ✅ COMPLETE | Review + Approval |
| 2: Implementation & Testing | 6 days (72h) | ⏳ PENDING | Phase 1 approval |
| 3: Refinement & Rollout | 4 days | ⏳ PENDING | Phase 2 completion |
| 4: Monitoring & Maintenance | 2+ weeks | ⏳ PENDING | Phase 3 completion |

**Critical Path:** Script → Tests → Demonstration (~5-6 days in Phase 2)

### 2.2 Team Roles

| Role | Responsibility |
| --- | --- |
| Project Owner (ash) | Coordination, decision-making, approval |
| Implementer (TBD) | Script + workflow implementation, testing |
| Reviewer (TBD) | Code review, testing validation |
| Communications (TBD) | Team training, documentation, announcement |

### 2.3 Deliverables by Phase

**Phase 1 (Complete):**

- ✅ OpenSpec specification
- ✅ RFC document
- ✅ PLANNING.md
- ✅ PROJECT-README.md
- ✅ Working script + workflow (skeleton)
- ✅ Documentation suite

**Phase 2 (In Progress):**

- [ ] Finalized script
- [ ] Finalized workflow
- [ ] Test suite (80%+ coverage)
- [ ] Live demonstration results

**Phase 3 (Pending):**

- [ ] Team runbook
- [ ] FAQ document
- [ ] PR merged to develop
- [ ] Team announcement

**Phase 4 (Pending):**

- [ ] Monitoring report
- [ ] Feedback summary
- [ ] v1.1 roadmap

---

## Section 3: Core Specification

### 3.1 Milestone Selection Algorithm

**Definition:** Select the open milestone with the earliest due date, breaking ties by latest creation date.

**Algorithm:**

```
sort(open_milestones) by:
  1. due_on ASC (earliest first)
  2. created_at DESC (latest first)
return sorted_milestones[0]
```

**Key Principle:** Past-due status is irrelevant; age of due date does not disqualify.

### 3.2 Allocation Triggers

**Manual Script:**

```bash
node allocate-to-milestone.js [--dry-run] [--days N] [--milestone N]
```

**GitHub Actions Workflow:**

- Trigger 1: PR merge (`pull_request.closed` + `merged == true`)
- Trigger 2: Issue close (`issues.closed`)
- Trigger 3: Manual (`workflow_dispatch`)

### 3.3 Allocation Logic

1. **Detect** current active milestone (§ 3.1)
2. **Find** merged PRs / closed issues
3. **Parse** linked issues from PR body (Closes #, Resolves #, Fixes #)
4. **Update** milestone for all items
5. **Log** allocation decisions
6. **Report** summary

### 3.4 Error Handling

**Non-Blocking Errors:**

- API 404 (item deleted) → Log and continue
- API 422 (invalid milestone) → Log and continue
- Transient 5xx → Retry 3× with exponential backoff

**Blocking Errors:**

- API 401 (invalid token) → Exit with message
- API 403 (insufficient scope) → Exit with message

---

## Section 4: Implementation Specifications

### 4.1 Manual Script Spec

**File:** `allocate-to-milestone.js`  
**Language:** Node.js (ES modules)  
**Dependencies:** HTTPS module (built-in)  
**Size Target:** <500 lines  

**Features:**

- Dry-run mode (no API changes)
- Lookback period (--days N)
- Forced milestone (--milestone N)
- Verbose logging
- Summary report

**API Contracts:**

- GET milestones: `/repos/{owner}/{repo}/milestones`
- UPDATE PR: `PATCH /repos/{owner}/{repo}/pulls/{number}`
- UPDATE issue: `PATCH /repos/{owner}/{repo}/issues/{number}`

### 4.2 GitHub Actions Workflow Spec

**File:** `allocate-pr-issue-to-milestone.yml`  
**Triggers:** 3 (PR merge, issue close, manual)  
**Permissions:** `pull-requests: write`, `issues: write`  
**Runtime:** ~2 minutes per run  

**Steps:**

1. Checkout code
2. Setup Node.js
3. Run allocation script
4. Post confirmation comment

### 4.3 Test Suite Spec

**Framework:** Jest (or equivalent)  
**Coverage Target:** 80%+  
**Test Categories:**

- Unit tests (15+ cases)
- Integration tests (10+ cases)
- Edge cases (8+ cases)

---

## Section 5: Project Artifacts

### 5.1 Directory Structure

```
.github/projects/active/pr-issue-milestone-allocation-2026-08-11/
├── 00-START-HERE.md                    ← Entry point
├── PROJECT-README.md                   ← Overview
├── OPENSPEC.md                         ← Feature spec
├── OPENSPEC-PROJECT.md                 ← Project spec (this file)
├── RFC.md                              ← Design rationale
├── PLANNING.md                         ← Implementation plan
├── COORDINATION.md                     ← Issue linking & tracking
├── GITHUB-ISSUES-TEMPLATE.md           ← Issue templates
├── allocate-to-milestone.js            ← Script
├── allocate-pr-issue-to-milestone.yml  ← Workflow
├── docs/
│   ├── ALLOCATE-SCRIPT-README.md
│   ├── IMPLEMENTATION-GUIDE.md
│   ├── QUICK-REFERENCE.md
│   └── pr-issue-milestone-allocation-prompt.md
└── status/
    ├── PHASE-1-STATUS.md
    ├── PHASE-2-STATUS.md
    ├── PHASE-3-STATUS.md
    └── PHASE-4-STATUS.md
```

### 5.2 Documentation Mapping

| Document | Purpose | Audience | Read Time |
| --- | --- | --- | --- |
| 00-START-HERE.md | Entry point | Everyone | 5 min |
| PROJECT-README.md | Project overview | Decision makers | 10 min |
| OPENSPEC.md | Feature specification | Architects | 15 min |
| OPENSPEC-PROJECT.md | Project specification | Project managers | 10 min |
| RFC.md | Design rationale | Architects | 20 min |
| PLANNING.md | Implementation plan | Implementers | 15 min |
| COORDINATION.md | Issue tracking | Project managers | 10 min |
| ALLOCATE-SCRIPT-README.md | Script usage | Developers | 20 min |
| IMPLEMENTATION-GUIDE.md | Setup guide | DevOps | 25 min |
| QUICK-REFERENCE.md | Quick reference | Everyone | 3 min |

---

## Section 6: GitHub Issues & Tracking

### 6.1 Issue Structure

```
#1762 (EPIC) — PR/Issue → Milestone Allocation Automation
  ├── #1763 — Phase 1: Specification & Design ✅
  ├── #1764 — Phase 2: Implementation & Testing ⏳
  ├── #1765 — Phase 3: Refinement & Rollout ⏳
  └── #1766 — Phase 4: Monitoring & Maintenance ⏳
```

### 6.2 Issue Linking Strategy

- **Blocks:** Phase N blocks Phase N+1
- **Blocked by:** Phase N blocked by Phase N-1
- **Related to:** All phases relate to Epic

### 6.3 Status Tracking

Update issue statuses:

- Phase 1: ✅ Completed
- Phase 2: 📋 Ready for implementation
- Phase 3: ⏳ Pending Phase 2
- Phase 4: ⏳ Pending Phase 3

---

## Section 7: Quality Assurance

### 7.1 Testing Strategy

**Unit Tests:**

- Milestone selection (sorting, tie-breaking)
- Linked issue detection (regex, dedup)
- Dry-run mode (no API calls)
- Idempotency (skip already-allocated)

**Integration Tests:**

- GitHub API calls (mocked)
- Full allocation workflow
- Error handling & retry logic
- Edge cases (no milestones, deleted issues, etc.)

**Manual Testing:**

- Script dry-run on live repo
- Workflow on actual PR merge
- Workflow on actual issue close

### 7.2 Code Review Checklist

- [ ] All requirements implemented (FR-1 through FR-6)
- [ ] Error handling comprehensive
- [ ] Logging adequate
- [ ] Comments clear
- [ ] Tests passing
- [ ] Coverage ≥80%
- [ ] No security issues
- [ ] No hardcoded values

### 7.3 Deployment Checklist

- [ ] Phase 2 complete
- [ ] Phase 3 review passed
- [ ] Team trained
- [ ] Rollback plan documented
- [ ] On-call team notified

---

## Section 8: Risks & Mitigation

### 8.1 Technical Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Incorrect milestone selection | Items in wrong milestone | Verbose logging, team review |
| API rate limiting | Workflow throttling | Batch processing, schedule runs |
| Token permission issues | Workflow fails silently | Clear error messages, validation |
| Edge case not covered | Unexpected behavior | Thorough testing, monitoring |

### 8.2 Adoption Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Team confusion on "current" | Slow adoption | Clear documentation, training |
| Process overhead | Team friction | Show time savings, gather feedback |
| Workflow failures | Manual fallback | Error logging, runbook |

### 8.3 Mitigation Plan

- **Phase 2:** Comprehensive testing catches 80% of issues
- **Phase 3:** Team feedback addresses adoption concerns
- **Phase 4:** Monitoring detects remaining issues

---

## Section 9: Cost-Benefit Analysis

### 9.1 Effort Estimate

| Phase | Effort | Duration |
| --- | --- | --- |
| Phase 1 | 30h | 2 days |
| Phase 2 | 72h | 6 days |
| Phase 3 | 20h | 4 days |
| Phase 4 | 40h | 2+ weeks |
| **Total** | **162h** | **~3 weeks** |

### 9.2 Benefit Calculation

**Time Saved:**

- 5 minutes per PR × 10 PRs/week × 4 weeks = 200 min/month
- 5 minutes per issue × 5 issues/week × 4 weeks = 100 min/month
- **Total: 300 minutes/month = 5 hours/month**

**Team of 5:**

- 5 hours × 5 people = 25 hours/month
- Annualized: 300 hours/year

**Break-Even:**

- Implementation: 162 hours
- Savings: 300 hours/year = 25 hours/month
- Break-even: ~6.5 months
- **ROI: Positive in second quarter**

---

## Section 10: Future Enhancements (v1.1+)

### 10.1 v1.1 Roadmap

- Dashboard showing current milestone + item count
- Slack notifications on allocation
- Email digest of daily allocations
- API endpoint for querying current milestone
- Performance metrics & analytics

### 10.2 v2.0 Vision

- Multi-repo allocation
- Integration with Linear, Asana, etc.
- Predictive allocation (estimated due dates)
- Burndown charts & tracking
- Custom allocation rules by team/label

---

## Section 11: Sign-Off & Approval

### 11.1 Specification Review

- [ ] Product Owner: ash
- [ ] Architecture: (TBD)
- [ ] QA: (TBD)

### 11.2 Implementation Approval

- [ ] Technical Lead: (TBD)
- [ ] Project Manager: ash

### 11.3 Deployment Authorization

- [ ] Release Manager: (TBD)
- [ ] Security: (TBD)

---

## Section 12: References & Resources

**Related Documents:**

- OPENSPEC.md — Feature specification
- RFC.md — Design & alternatives
- PLANNING.md — Implementation plan
- PROJECT-README.md — Project overview

**GitHub Issues:**

- #1762 — Epic (parent)
- #1763 — Phase 1 (complete)
- #1764 — Phase 2 (pending)
- #1765 — Phase 3 (pending)
- #1766 — Phase 4 (pending)

**Code Artifacts:**

- allocate-to-milestone.js — Manual script
- allocate-pr-issue-to-milestone.yml — Workflow
- Test suite (TBD in Phase 2)

---

**Status:** ✅ Project Specification Complete

**Next Step:** Phase 1 approval → Phase 2 implementation begins 2026-08-14

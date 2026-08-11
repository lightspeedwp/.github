# Implementation Plan: PR/Issue → Milestone Allocation

**Project:** PR/Issue → Milestone Allocation Automation  
**Timeline:** 2026-08-11 to 2026-08-25 (15 days)  
**Phases:** 4 (Specification → Implementation → Refinement → Monitoring)

## Phase 1: Specification & Design (2026-08-11 to 2026-08-13)

**Duration:** 2 days  
**Status:** ✅ Complete  

### Phase 1 Tasks

| Task | Owner | Status | Notes |
| --- | --- | --- | --- |
| Create planning prompt | ash | ✅ Done | `pr-issue-milestone-allocation-prompt.md` |
| Draft OpenSpec specification | ash | ✅ Done | `OPENSPEC.md` — formal spec |
| Create RFC document | ash | 🔄 In Progress | Design rationale & alternatives |
| Create PLANNING.md | ash | 🔄 In Progress | This document |
| Create PROJECT-README.md | ash | ✅ Done | Project overview & risk |
| Review & approve specification | ash | ⏳ Pending | Read-through for completeness |
| Identify edge cases | ash | ✅ Done | Listed in OPENSPEC § 6 |

### Phase 1 Deliverables

- ✅ **OpenSpec Specification** — Complete formal spec with API contracts
- ✅ **Project README** — Overview, phases, timeline, risks
- 🔄 **RFC Document** — Design rationale (in progress)
- 🔄 **Planning Document** — This implementation plan

### Phase 1 Success Criteria

- ✅ Specification is complete and unambiguous
- ✅ All requirements documented
- ✅ All edge cases identified and handled
- ✅ API contracts clearly defined
- ✅ Team has reviewed and approved design

---

## Phase 2: Implementation & Testing (2026-08-14 to 2026-08-20)

**Duration:** 6 days  
**Status:** ⏳ Ready to start  

### Phase 2 Tasks

#### 2.1: Implement Manual Script

| Task | Owner | Status | Effort | Notes |
| --- | --- | --- | --- | --- |
| Create Node.js script skeleton | TBD | ⏳ Pending | 1h | `allocate-to-milestone.js` structure |
| Implement milestone detection | TBD | ⏳ Pending | 2h | FR-1: Select current active milestone |
| Implement PR allocation | TBD | ⏳ Pending | 1h | FR-2: Allocate merged PR |
| Implement issue allocation | TBD | ⏳ Pending | 1h | FR-3: Allocate closed issue |
| Implement linked issue detection | TBD | ⏳ Pending | 2h | FR-4: Parse PR body + allocate |
| Add dry-run mode | TBD | ⏳ Pending | 1h | FR-5: Preview without changes |
| Add error handling & retry logic | TBD | ⏳ Pending | 3h | § 5: Error handling + retries |
| Add logging & summary report | TBD | ⏳ Pending | 2h | NFR-3: Observability |
| Test script locally | TBD | ⏳ Pending | 2h | Run against test data |
| **Subtotal** | | | **15h** | |

#### 2.2: Draft GitHub Actions Workflow YAML

| Task | Owner | Status | Effort | Notes |
| --- | --- | --- | --- | --- |
| Create workflow file structure | TBD | ⏳ Pending | 1h | `allocate-pr-issue-to-milestone.yml` |
| Configure PR merge trigger | TBD | ⏳ Pending | 1h | `on: pull_request.closed` + merged check |
| Configure issue close trigger | TBD | ⏳ Pending | 1h | `on: issues.closed` |
| Add manual trigger (workflow_dispatch) | TBD | ⏳ Pending | 1h | Allow manual runs with parameters |
| Set workflow permissions | TBD | ⏳ Pending | 1h | `pull-requests: write`, `issues: write` |
| Add node setup step | TBD | ⏳ Pending | 1h | `actions/setup-node@v3` |
| Invoke script with parameters | TBD | ⏳ Pending | 1h | Pass env vars + CLI options |
| Add confirmation comments | TBD | ⏳ Pending | 2h | Post comment on PR/issue after allocation |
| Validate workflow YAML | TBD | ⏳ Pending | 1h | Syntax check + linting |
| Test workflow dry-run | TBD | ⏳ Pending | 2h | Trigger on test PR/issue |
| **Subtotal** | | | **12h** | |

#### 2.3: Add Test Coverage for Allocation Logic

| Task | Owner | Status | Effort | Notes |
| --- | --- | --- | --- | --- |
| Create test file structure | TBD | ⏳ Pending | 1h | `__tests__/allocate-to-milestone.test.js` |
| Test milestone selection (unit) | TBD | ⏳ Pending | 2h | By due date + creation date sorting |
| Test linked issue detection (unit) | TBD | ⏳ Pending | 2h | Regex matching, case-insensitive, dedup |
| Test dry-run mode (unit) | TBD | ⏳ Pending | 1h | Logs without API calls |
| Test idempotency (unit) | TBD | ⏳ Pending | 1h | Already-allocated items skipped |
| Test error handling (unit) | TBD | ⏳ Pending | 2h | 401, 403, 404, 422 errors + retries |
| Test API calls (integration) | TBD | ⏳ Pending | 3h | Mock GitHub API, verify requests |
| Test edge cases (integration) | TBD | ⏳ Pending | 2h | No milestones, deleted issues, etc. |
| Test full workflow (integration) | TBD | ⏳ Pending | 2h | E2E test: PR merge → allocation |
| Achieve 80%+ code coverage | TBD | ⏳ Pending | 2h | Coverage report, identify gaps |
| **Subtotal** | | | **18h** | |

#### 2.4: Set Up Demonstration Against Actual Milestones

| Task | Owner | Status | Effort | Notes |
| --- | --- | --- | --- | --- |
| Identify test repository | TBD | ⏳ Pending | 1h | Lightweight repo with existing milestones |
| Create test milestones | TBD | ⏳ Pending | 1h | 3-5 test milestones with varying due dates |
| Create test data | TBD | ⏳ Pending | 2h | 5-10 test PRs + issues in various states |
| Run script in dry-run mode | TBD | ⏳ Pending | 1h | Preview allocation decisions |
| Verify milestone selection logic | TBD | ⏳ Pending | 1h | Confirm correct "current" milestone selected |
| Run script live (with rollback plan) | TBD | ⏳ Pending | 2h | Actually allocate test items |
| Document demonstration results | TBD | ⏳ Pending | 1h | Screenshot + notes |
| Test workflow on actual PR merge | TBD | ⏳ Pending | 2h | Merge test PR, verify workflow runs |
| Test workflow on actual issue close | TBD | ⏳ Pending | 2h | Close test issue, verify workflow runs |
| Verify confirmation comments appear | TBD | ⏳ Pending | 1h | Check PR/issue for allocation comments |
| **Subtotal** | | | **16h** | |

#### 2.5: Documentation

| Task | Owner | Status | Effort | Notes |
| --- | --- | --- | --- | --- |
| Create ALLOCATE-SCRIPT-README.md | TBD | ✅ Done | 3h | Script usage & examples |
| Create IMPLEMENTATION-GUIDE.md | TBD | ✅ Done | 3h | Setup & integration guide |
| Create QUICK-REFERENCE.md | TBD | ✅ Done | 1h | Quick reference card |
| Add inline code comments | TBD | ⏳ Pending | 2h | Explain complex logic in script |
| Create troubleshooting guide | TBD | ⏳ Pending | 2h | Common issues + fixes |
| **Subtotal** | | | **11h** | |

### Phase 2 Total Effort

| Category | Effort |
| --- | --- |
| Manual script implementation | 15h |
| GitHub Actions workflow | 12h |
| Test coverage | 18h |
| Live demonstration | 16h |
| Documentation | 11h |
| **Total** | **72h** (~9 days at 8h/day) |

### Phase 2 Dependencies

```
┌─────────────────────────────────────────┐
│  Phase 1: Specification (Complete)      │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┴──────────┬──────────────┬──────────────┐
    │                    │              │              │
    v                    v              v              v
┌────────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────────┐
│   Script   │  │   Workflow   │  │   Tests  │  │ Demonstration│
│ 15h (2d)   │  │   12h (2d)   │  │ 18h (3d) │  │  16h (2d)    │
└────────────┘  └──────────────┘  └──────────┘  └──────────────┘
    │                │                  │              │
    └────────────────┼──────────────────┴──────────────┘
                     │
                     v
            ┌──────────────────┐
            │ Phase 2 Complete │
            └──────────────────┘
```

**Critical Path:** Script → Tests → Demonstration (5-6 days)

### Phase 2 Definition of Done (DoD)

- ✅ Script implemented and tested locally
- ✅ Workflow YAML drafted and validated
- ✅ Unit + integration tests written (≥80% coverage)
- ✅ All tests passing
- ✅ Live demonstration successful on real milestones
- ✅ All documentation complete
- ✅ Code reviewed and approved
- ✅ Merged to feature branch ready for PR

---

## Phase 3: Refinement & Rollout (2026-08-21 to 2026-08-25)

**Duration:** 4 days  
**Status:** ⏳ Pending Phase 2  

### Phase 3 Tasks

| Task | Owner | Status | Notes |
| --- | --- | --- | --- |
| Incorporate Phase 2 feedback | TBD | ⏳ Pending | Address code review comments |
| Refine error messages & logging | TBD | ⏳ Pending | Based on edge cases discovered |
| Performance optimization if needed | TBD | ⏳ Pending | Profile and optimize if slow |
| Create team runbook | TBD | ⏳ Pending | How to use script + interpret results |
| Create FAQ document | TBD | ⏳ Pending | Common questions + answers |
| Merge to `develop` | TBD | ⏳ Pending | Create PR, pass all checks |
| Announcement to team | TBD | ⏳ Pending | Post in team channel, documentation |
| Deploy to `.github/` | TBD | ⏳ Pending | Move from branch to production |
| Enable workflow on main repo | TBD | ⏳ Pending | Activate on `.github` repository |
| Monitor first 48 hours | TBD | ⏳ Pending | Watch for errors, unexpected behavior |

### Phase 3 Definition of Done (DoD)

- ✅ All Phase 2 feedback addressed
- ✅ Team runbook created and reviewed
- ✅ FAQ updated with real-world scenarios
- ✅ PR merged to `develop`
- ✅ Team announcement posted
- ✅ Workflow active and processing real PRs/issues
- ✅ 48-hour monitoring period complete with no critical issues

---

## Phase 4: Monitoring & Maintenance (2026-08-26 onwards)

**Duration:** Continuous  
**Status:** ⏳ Future  

### Phase 4 Tasks

| Task | Owner | Status | Notes |
| --- | --- | --- | --- |
| Monitor allocation success rate | TBD | ⏳ Pending | Track ≥95% success |
| Track allocation errors | TBD | ⏳ Pending | Log and categorize failures |
| Analyze edge cases | TBD | ⏳ Pending | Patterns in unexpected behavior |
| Team feedback collection | TBD | ⏳ Pending | Surveys, meetings |
| Refine milestone selection logic if needed | TBD | ⏳ Pending | Based on feedback |
| Plan future enhancements | TBD | ⏳ Pending | Dashboards, notifications, etc. |

### Phase 4 Definition of Done (DoD)

- ✅ 2-week success rate ≥95%
- ✅ All errors categorized and documented
- ✅ Feedback incorporated into v1.1 roadmap
- ✅ Maintenance procedures documented

---

## Timeline & Milestones

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Spec & Design                                      │
│ 2026-08-11 to 2026-08-13 (2 days)                           │
│ ✅ COMPLETE                                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       v
┌─────────────────────────────────────────────────────────────┐
│ Phase 2: Implementation & Testing                           │
│ 2026-08-14 to 2026-08-20 (6 days, 72h effort)               │
│ ⏳ PENDING                                                   │
│                                                             │
│ Milestones:                                                 │
│  • 2026-08-15: Script draft complete                        │
│  • 2026-08-16: Workflow draft complete                      │
│  • 2026-08-17: Tests 80%+ coverage                          │
│  • 2026-08-19: Live demo successful                         │
│  • 2026-08-20: All docs complete, ready for review          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       v
┌─────────────────────────────────────────────────────────────┐
│ Phase 3: Refinement & Rollout                               │
│ 2026-08-21 to 2026-08-25 (4 days)                           │
│ ⏳ PENDING                                                   │
│                                                             │
│ Milestones:                                                 │
│  • 2026-08-21: Code review & feedback incorporated          │
│  • 2026-08-22: Team runbook + FAQ complete                  │
│  • 2026-08-23: PR merged to develop                         │
│  • 2026-08-24: Team announcement, deployment                │
│  • 2026-08-25: 48h monitoring complete                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       v
┌─────────────────────────────────────────────────────────────┐
│ Phase 4: Monitoring & Maintenance                           │
│ 2026-08-26 onwards (Continuous)                             │
│ ⏳ PENDING                                                   │
│                                                             │
│ Focus: Success rate ≥95%, error tracking, feedback          │
└─────────────────────────────────────────────────────────────┘

Total Timeline: 15 days from start to production rollout
```

## Risk & Mitigation

| Risk | Impact | Likelihood | Mitigation |
| --- | --- | --- | --- |
| Incorrect milestone selection | Wrong items in wrong milestone | Medium | Verbose logging + team review |
| GitHub API rate limiting | Workflow slowdown/failure | Low | Batch processing + schedule runs |
| Token permission issues | Workflow fails silently | Medium | Clear error messages + validation |
| Edge case not covered in spec | Unexpected behavior in prod | Medium | Thorough testing + monitoring |
| Team adoption slower than expected | Manual work continues | Low | Clear documentation + training |
| Performance issues at scale | Script times out | Low | Profile + optimize if needed |

## Dependencies & Blockers

| Dependency | Status | Impact |
| --- | --- | --- |
| OpenSpec approval | ⏳ Pending | Blocks implementation start |
| GitHub access + token | ✅ Available | Needed for testing |
| Test repository with milestones | ⏳ TBD | Needed for Phase 2.4 |
| Team availability for review | ✅ Assumed | Code review gate |

## Success Criteria (Overall)

- ✅ Script correctly allocates 100% of test items
- ✅ Workflow triggers on PR merge and issue close
- ✅ Dry-run mode works accurately
- ✅ Live demonstration successful without errors
- ✅ ≥80% test coverage
- ✅ All documentation complete and reviewed
- ✅ Team trained and deployment plan approved
- ✅ First week production run: ≥95% success rate

## Notes

1. **Parallel work:** Tasks 2.1 (script), 2.2 (workflow), and 2.3 (tests) can run in parallel after Phase 1
2. **Critical path:** Script → Tests → Demonstration is the bottleneck (~5-6 days)
3. **Documentation:** Partially complete from planning phase; needs inline comments + troubleshooting guide
4. **Effort estimate:** 72 hours for Phase 2 assumes continuous work; may stretch 9-10 days with context switching
5. **Rollout:** Phase 3 can be shortened if Phase 2 has zero feedback; may extend if critical issues found

---

**Plan Status:** ✅ Ready for Phase 1 approval → Phase 2 implementation

**Next Step:** Approve OpenSpec, assign Phase 2 tasks, start script implementation

# PR/Issue → Milestone Allocation Automation

**Project Slug:** `pr-issue-milestone-allocation-automation-2026-08-11`  
**Created:** 2026-08-11  
**Owner:** ash  
**Status:** Design Phase  
**Initiative:** Issue Automation & Milestone Discipline

## Overview

Implement automated allocation of merged PRs and closed issues to the **current active milestone** via:

1. **Manual script** — On-demand allocation with dry-run support
2. **GitHub Actions workflow** — Real-time allocation on PR merge / issue close

**Business Value:**

- Enforce milestone discipline across the team
- Reduce manual bookkeeping for PR/issue triage
- Single source of truth for "current" work
- Automated tracking of completed work

## Deliverables

### Phase 1: Specification & Design

- ✅ **OpenSpec Specification** (`OPENSPEC.md`) — Formal spec with requirements, API contracts, edge cases
- ✅ **RFC Document** (`RFC.md`) — Design rationale, alternative approaches, trade-offs
- ✅ **Planning Document** (`PLANNING.md`) — Implementation phases, timeline, dependencies
- ✅ **Manual Script** (`allocate-to-milestone.js`) — Node.js implementation for on-demand allocation
- ✅ **GitHub Actions Workflow** (`allocate-pr-issue-to-milestone.yml`) — Automated workflow
- ✅ **Documentation** (`ALLOCATE-SCRIPT-README.md`, `IMPLEMENTATION-GUIDE.md`, `QUICK-REFERENCE.md`)
- ✅ **GitHub Issues** — Linked issues for each phase (see below)

### Phase 2: Implementation & Testing

- [ ] Merge script + workflow into `.github/` directory
- [ ] Test script with dry-run against live milestones
- [ ] Test script live allocation
- [ ] Test workflow on actual PR merge / issue close
- [ ] Monitor first week of live runs
- [ ] Gather team feedback

### Phase 3: Refinement & Rollout

- [ ] Address feedback from Phase 2
- [ ] Document edge cases discovered
- [ ] Create runbook for team
- [ ] Announce feature and guidelines

### Phase 4: Monitoring & Maintenance

- [ ] Monitor allocation success rate
- [ ] Track errors and edge cases
- [ ] Refine milestone selection logic if needed
- [ ] Plan future enhancements (e.g., scheduled allocation, dashboards)

## Key Files

| File | Purpose | Status |
| --- | --- | --- |
| `OPENSPEC.md` | Formal specification | ✅ Ready |
| `RFC.md` | Design & rationale | ✅ Ready |
| `PLANNING.md` | Implementation plan | ✅ Ready |
| `allocate-to-milestone.js` | Manual script | ✅ Ready |
| `allocate-pr-issue-to-milestone.yml` | Workflow | ✅ Ready |
| `ALLOCATE-SCRIPT-README.md` | Script docs | ✅ Ready |
| `IMPLEMENTATION-GUIDE.md` | Setup guide | ✅ Ready |
| `QUICK-REFERENCE.md` | Quick reference | ✅ Ready |

## GitHub Issues

All work is tracked via GitHub issues with interlinking:

### Epic Issue

- **#TBD-EPIC** — PR/Issue Milestone Allocation Automation (Epic)
  - Links to all phase issues below
  - Tracks overall progress

### Phase Issues

- **#TBD-1** — Phase 1: Specification & Design
  - Review OpenSpec
  - Approve RFC
  - Finalize planning
  - Status: In Design Review

- **#TBD-2** — Phase 2: Implementation & Testing
  - Deploy script to `.github/scripts/`
  - Deploy workflow to `.github/workflows/`
  - Test script (dry-run + live)
  - Test workflow (PR merge + issue close)
  - Status: Waiting for Phase 1 approval

- **#TBD-3** — Phase 3: Refinement & Rollout
  - Address Phase 2 feedback
  - Create team runbook
  - Announce feature
  - Status: Waiting for Phase 2 completion

- **#TBD-4** — Phase 4: Monitoring & Maintenance
  - Monitor success rates
  - Track edge cases
  - Plan future enhancements
  - Status: Future

### Definition of Ready (DoR)

All issues include:

- [ ] Clear acceptance criteria
- [ ] Linked to parent epic
- [ ] Linked to related issues
- [ ] Assigned to phase owner
- [ ] Estimated effort

### Definition of Done (DoD)

All issues require:

- [ ] Implementation complete and tested
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] All linked issues resolved
- [ ] Merged to `develop`

## Milestones & Timeline

| Phase | Start | Target | Duration |
| --- | --- | --- | --- |
| 1: Specification & Design | 2026-08-11 | 2026-08-13 | 2 days |
| 2: Implementation & Testing | 2026-08-14 | 2026-08-20 | 6 days |
| 3: Refinement & Rollout | 2026-08-21 | 2026-08-25 | 4 days |
| 4: Monitoring & Maintenance | 2026-08-26 | Ongoing | Continuous |

**Total Timeline:** ~15 days from specification to production rollout

## Decision Log

### Milestone Selection Logic

**Decision:** Select milestone with **earliest due date**, regardless of past-due status.

**Rationale:**

- Clear, deterministic algorithm
- Past-due status doesn't disqualify (allows recovery)
- Latest created date breaks ties (most recent commitment wins)
- Single "current active" milestone per repo

**Alternatives Considered:**

- ❌ Status-based (only non-past-due) — Too rigid, can't recover from missed dates
- ❌ User configuration — Adds complexity, maintenance burden
- ❌ Random selection — Non-deterministic, team confusion

### Implementation Approach (Two-Tier)

**Decision:** Both manual script + automated workflow.

**Rationale:**

- **Script** — Testing, recovery, custom campaigns
- **Workflow** — Real-time, fire-and-forget, team enforcement

**Alternatives Considered:**

- ❌ Script only — No real-time coverage, manual burden
- ❌ Workflow only — No testing/recovery path, inflexible

### Allocation Strategy (Exclusive, Not Additive)

**Decision:** Replace existing milestone (exclusive allocation).

**Rationale:**

- Ensures all items point to current active milestone
- No stale multi-milestone entries
- Simpler mental model for team

**Alternatives Considered:**

- ❌ Additive (keep existing + add new) — Clutter, confusion
- ❌ Skip if already allocated — Doesn't correct stale allocations

## Configuration & Variables

### Environment Variables

| Variable | Default | Required |
| --- | --- | --- |
| `GITHUB_TOKEN` | (none) | **Yes** |
| `GITHUB_OWNER` | `lightspeedwp` | No |
| `GITHUB_REPO` | `.github` | No |

### Script Options

- `--dry-run` — Preview without changes
- `--days N` — Look back N days (default: 7)
- `--milestone N` — Force specific milestone
- `--verbose` — Detailed logging

## Risk & Mitigation

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Incorrect milestone selection | PRs/issues in wrong milestone | Verbose logging + team review of selection logic |
| Script API errors | Silent failures | Error logging + summary report + workflow comments |
| Token scope insufficient | Workflow fails silently | Clear documentation + token validation step |
| High API rate limit consumption | Workflow throttling | Batching + scheduled runs instead of per-event |
| Team confusion on "current" milestone | Process adoption failure | Clear documentation + FAQ + team communication |

## Success Criteria

- ✅ Script correctly identifies current active milestone in all test cases
- ✅ All merged PRs automatically allocated within 5 minutes
- ✅ All closed issues automatically allocated within 5 minutes
- ✅ 95%+ allocation success rate (API errors <5%)
- ✅ Team adoption: 80%+ of items allocated within 1 week
- ✅ Zero regressions in existing milestone workflows

## FAQ

**Q: What if there's no open milestone?**  
A: Script exits with clear error message. Use `--milestone N` to override.

**Q: What if a PR closes multiple issues?**  
A: All linked issues + PR allocated to same milestone.

**Q: Can I run the script multiple times?**  
A: Yes, idempotent. Already-allocated items skipped.

**Q: What if I want to exclude a milestone from being "current"?**  
A: Close it in GitHub (soft-delete), or use script's `--milestone` override.

**Q: How do I undo an allocation?**  
A: Manually update in GitHub, or rerun script with correct `--milestone`.

## Team Roles

| Role | Responsibility |
| --- | --- |
| **Owner** (ash) | Project coordination, decision-making, approval |
| **Implementation** (TBD) | Script + workflow deployment, testing |
| **Review** (TBD) | Code review, testing validation |
| **Comms** (TBD) | Team documentation, announcement |

## Related Issues & Projects

- **Epic:** PR/Issue Milestone Allocation Automation (#TBD-EPIC)
- **Phase 1:** Specification & Design (#TBD-1)
- **Phase 2:** Implementation & Testing (#TBD-2)
- **Phase 3:** Refinement & Rollout (#TBD-3)
- **Phase 4:** Monitoring & Maintenance (#TBD-4)

## Notes

- Workflow configuration allows manual trigger with custom parameters (dry-run, lookback period)
- Script is portable — can be reused in other LightSpeedWP repos with env var overrides
- Linked issue automation requires GitHub API access (workflow permissions set correctly)
- All script errors logged to workflow output for debugging

---

**Project Status:** Design Phase Complete → Ready for Implementation Review

**Next Action:** Approve Phase 1 specification, proceed to Phase 2 implementation

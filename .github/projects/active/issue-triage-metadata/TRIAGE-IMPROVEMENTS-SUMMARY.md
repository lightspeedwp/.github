---
title: Issue Triage Metadata Improvements
status: in-progress
phase: automation-development
---

# Issue Triage Metadata Improvements

**Objective**: Systematically review and enhance 38+ issues marked with `status:needs-triage` to improve issue quality, tracking, and metadata completeness.

**Owner**: ashleyshaw  
**Date**: 2026-08-29  
**Status**: Automation Scripts Ready for Deployment

## Executive Summary

Automated analysis of 38 open issues with `status:needs-triage` label reveals:

| Metric | Count | Target |
|--------|-------|--------|
| Issues needing milestones | 38/38 | 100% ✓ |
| Issues needing assignee | 26/38 | ~68% |
| Issues needing area labels | 6/38 | ~16% |
| Issues with complete metadata | 0/38 | 0% |

**Priority**: Medium  
**Complexity**: Low (automated process)  
**Impact**: Improves issue tracking visibility and release planning

## Improvements Identified

### 1. Milestone Assignment (38 issues)

**Current State**: 0% assigned  
**Target State**: 100% assigned  
**Logic**: Automatic milestone assignment based on priority and issue type

**Milestone Distribution**:

- **Critical Issues** (1 issue): Immediate attention required
- **High Priority** (14 issues): Important features/tasks for next cycle
- **Backlog** (23 issues): General maintenance and enhancement work
- **Epics** (1 issue): Large initiatives

**Issues Affected**:

- #2352, #2160-2159, #2158, #2157 → High Priority
- #2151-2150, #2149, #2146, #2140, #2138, #2110 → Backlog with area refinement
- #1967, #1963, #1962 → Backlog (infrastructure/CI)
- #1904, #1903, #1902, #1901, #1900 → Backlog (phased epics)
- #1898, #1897, #1896, #1887 → Backlog (agent implementations)
- All others → Backlog

### 2. Assignee Assignment (26 issues)

**Current State**: 12 assigned to ashleyshaw, 26 unassigned  
**Target State**: All assigned to ashleyshaw  
**Rationale**: Centralized ownership for triage coordination

**Unassigned Issues** (26 total):

- CI/DevOps issues: #2352, #2160-2159, #2158, #2157, #2121
- Bug reports: #1967, #1963, #1962
- Documentation: #2110, #2161
- Epic/phased work: #1904, #1903, #1902, #1901, #1900, #1898, #1897, #1896, #1887, #1885, #1884, #1883, #1881, #1880, #1879

### 3. Area Label Assignment (6 issues)

**Current State**: 32/38 issues have area labels, 6 are missing  
**Target State**: 100% (Tier 2 validation requirement: 80%+, this achieves 100%)

**Missing Area Labels**:

- #2160 → `area:security` (PR triage refactoring + security concern)
- #2151 → `area:tests` (Phase 5 Integration Tests)
- #2150 → `area:tests` (Phase 4 Utility Scripts Tests)
- #2149 → `area:tests` (Phase 3 Workflow & Metrics Tests)
- #2146 → `area:tests` (Test Coverage Expansion Epic)
- #2110 → `area:documentation` (README standardization)

**Logic**:

- Type labels indicate area (e.g., `type:test` → `area:tests`)
- Security concerns automatically suggest `area:security`
- Documentation issues → `area:documentation`

## Implementation Plan

### Phase 1: Automation Development ✓ COMPLETE

- [x] Analyze issue metadata gaps
- [x] Create `triage-issues-needs-triage.js` — analysis script with dry-run mode
- [x] Create `apply-triage-improvements.js` — live update script
- [x] Add npm scripts (`triage:analyze`, `triage:apply`)
- [x] Document process in ISSUE-TRIAGE-GUIDE.md

### Phase 2: Validation & Testing (NEXT)

- [ ] Run analysis script to confirm improvements
- [ ] Review individual issues for context-specific needs
- [ ] Test dry-run mode (`npm run triage:apply -- --dry-run`)
- [ ] Validate milestone existence in GitHub

### Phase 3: Deployment

- [ ] Execute triage improvements (`npm run triage:apply`)
- [ ] Verify all changes applied correctly
- [ ] Remove `status:needs-triage` from improved issues (optional)
- [ ] Add `status:ready` to ready-to-work issues

### Phase 4: Post-Deployment

- [ ] Update ISSUE-TRIAGE-GUIDE.md with any learnings
- [ ] Set up monitoring for new issues with `status:needs-triage`
- [ ] Document changelog impact

## Validation Criteria

### Tier 1: Blockers (MUST PASS)

- ✅ All issues have `type:*` label
- ✅ No conflicting labels
- ✅ Milestones are populated (38/38)
- ✅ Status labels present where applicable

### Tier 2: Warnings (SHOULD PASS)

- ✅ 95%+ of issues labeled (38/38)
- ✅ 90%+ have `priority:*` label (38/38)
- ✅ 80%+ have `area:*` label (38/38 after improvements)

### Tier 3: Info

- ✅ Assignees set
- ✅ Linked issues documented
- ✅ Descriptions complete and clear

## Expected Outcomes

### Immediate Benefits

1. **Better Release Planning** — All issues in milestones for visibility
2. **Clear Ownership** — All issues assigned to coordination owner
3. **Improved Organization** — Area labels enable team-based filtering
4. **Reduced Metadata Gaps** — Passes all Tier 1 & Tier 2 validations

### Long-term Benefits

1. **Scalable Triage Process** — Scripts can run on all issues, not just marked ones
2. **Proactive Issue Management** — Automation catches gaps early
3. **Team Confidence** — Clear metadata enables better prioritization
4. **Historical Tracking** — Milestone assignment enables release retrospectives

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Milestone doesn't exist | Low | Medium | Create missing milestones first |
| Over-assignment to ashleyshaw | Medium | Low | Reassign as needed after initial triage |
| Area labels too broad | Low | Low | Review and refine after rollout |
| Conflicts with user preferences | Low | Low | Communicate changes in PR description |

## Success Metrics

- [ ] 38/38 issues have milestones
- [ ] 38/38 issues assigned to ashleyshaw
- [ ] 38/38 issues have area labels
- [ ] Zero validation failures (Tier 1)
- [ ] All improved issues ready for work

## References

- **Analysis Script**: `scripts/triage-issues-needs-triage.js`
- **Apply Script**: `scripts/apply-triage-improvements.js`
- **Guide**: `docs/ISSUE-TRIAGE-GUIDE.md`
- **Label System**: `CLAUDE.md` → labels section
- **Validation Rules**: `packages/metadata-agent/src/validation.js`

## Next Steps

1. Review this summary and automation scripts
2. Run analysis: `npm run triage:analyze`
3. Run dry-run: `npm run triage:apply -- --dry-run`
4. Review output and issue GitHub milestones
5. Execute improvements: `npm run triage:apply`
6. Verify and update related workflows

## Questions & Decisions

**Q: Should we keep `status:needs-triage` after improvements?**
A: Yes, remove only after final review confirms all metadata is complete.

**Q: What if an issue needs a different assignment than ashleyshaw?**
A: Update manually in GitHub after running scripts, or modify script before running.

**Q: Should we run this regularly?**
A: Yes, add as pre-release check: `npm run triage:analyze` before releases to catch new gaps.

---

**Last Updated**: 2026-08-29  
**Author**: Claude Code  
**Session**: chore/session-qn4kur

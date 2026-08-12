# GitHub Issues Template — PR/Issue → Milestone Allocation

**Project:** PR/Issue → Milestone Allocation Automation  
**Created:** 2026-08-11  
**Issue Prefix:** #EPIC, #P1, #P2, #P3, #P4  

This file contains templates for all GitHub issues needed to track the project. Copy these into your repository and link them appropriately.

---

## Epic Issue — PR/Issue → Milestone Allocation Automation

**Title:** PR/Issue → Milestone Allocation Automation  
**Type:** Epic  
**Labels:** `type:epic`, `area:automation`, `area:milestone`, `priority:important`  
**Milestone:** (None — this is the parent tracking)  

### Description

Implement automated allocation of merged PRs and closed issues to the current active milestone.

When a PR is merged or issue is closed, it should be automatically allocated to the open milestone with the earliest due date, reducing manual bookkeeping and enforcing milestone discipline.

### Business Value

- Eliminate manual PR/issue milestone allocation
- Enforce team discipline around milestone tracking
- Single source of truth for "current" active work
- Automated tracking of completed work

### Acceptance Criteria

- [ ] OpenSpec specification reviewed and approved
- [ ] RFC reviewed and approved by team
- [ ] Phase 2 implementation complete and tested
- [ ] Live demonstration successful
- [ ] Phase 3 rollout complete
- [ ] Team trained and documentation published
- [ ] First week monitoring shows ≥95% success rate

### Related

**Specification & Planning:**

- OpenSpec: `OPENSPEC.md`
- RFC: `RFC.md`
- Planning: `PLANNING.md`
- Project: `.github/projects/active/pr-issue-milestone-allocation-2026-08-11/`

**Phase Issues:**

- #P1 (Phase 1: Specification & Design)
- #P2 (Phase 2: Implementation & Testing)
- #P3 (Phase 3: Refinement & Rollout)
- #P4 (Phase 4: Monitoring & Maintenance)

### Definition of Done

- [ ] All phase issues closed
- [ ] All code merged to `develop`
- [ ] Team announcement posted
- [ ] Monitoring period (2 weeks) complete

---

## Phase 1: Specification & Design

**Title:** Phase 1: Specification & Design — PR/Issue Milestone Allocation  
**Type:** Task  
**Labels:** `type:task`, `area:automation`, `phase:1-spec`, `status:in-progress`  
**Milestone:** (Current milestone)  
**Assignee:** ash  

### Description

Complete specification and design for PR/issue-to-milestone allocation automation.

### Tasks

- [x] Create planning prompt (`pr-issue-milestone-allocation-prompt.md`)
- [x] Draft OpenSpec specification (`OPENSPEC.md`)
- [x] Create RFC document (`RFC.md`)
- [x] Create PLANNING.md with detailed implementation plan
- [x] Create PROJECT-README.md with project overview
- [x] Identify all edge cases and constraints
- [ ] Team review of specification
- [ ] Get formal approval from team lead
- [ ] Address review feedback

### Acceptance Criteria

- [ ] OpenSpec complete with 10 sections + API contracts
- [ ] RFC covers design rationale + 5 alternatives
- [ ] PLANNING.md has effort estimates + critical path
- [ ] All requirements documented and unambiguous
- [ ] Edge cases identified in § 6 of OPENSPEC
- [ ] Team has reviewed and approved design
- [ ] Ready to proceed to Phase 2

### Definition of Ready

- [x] Project scope clear
- [x] Success criteria defined
- [x] Dependencies identified

### Definition of Done

- [ ] All documents reviewed
- [ ] All questions answered
- [ ] Stakeholder approval obtained
- [ ] Phase 2 can begin immediately

### Related Issues

- Links to: #EPIC (parent)
- Blocks: #P2 (Phase 2)

---

## Phase 2: Implementation & Testing

**Title:** Phase 2: Implementation & Testing — PR/Issue Milestone Allocation  
**Type:** Task  
**Labels:** `type:task`, `area:automation`, `phase:2-impl`, `status:pending`  
**Milestone:** (Next milestone)  
**Assignee:** TBD  

### Description

Implement manual script and GitHub Actions workflow for automatic PR/issue milestone allocation, with comprehensive test coverage and live demonstration.

### Subtasks (Link individual issues for each)

**2.1: Implement Manual Script (15h effort)**

- [ ] #2.1.1 — Create Node.js script skeleton
- [ ] #2.1.2 — Implement milestone detection
- [ ] #2.1.3 — Implement PR allocation
- [ ] #2.1.4 — Implement issue allocation
- [ ] #2.1.5 — Implement linked issue detection
- [ ] #2.1.6 — Add dry-run mode
- [ ] #2.1.7 — Add error handling & retry logic
- [ ] #2.1.8 — Add logging & summary report
- [ ] #2.1.9 — Local testing of script

**2.2: Draft GitHub Actions Workflow YAML (12h effort)**

- [ ] #2.2.1 — Create workflow file structure
- [ ] #2.2.2 — Configure PR merge trigger
- [ ] #2.2.3 — Configure issue close trigger
- [ ] #2.2.4 — Add manual workflow_dispatch trigger
- [ ] #2.2.5 — Set workflow permissions
- [ ] #2.2.6 — Add node setup step
- [ ] #2.2.7 — Invoke script with parameters
- [ ] #2.2.8 — Add confirmation comments
- [ ] #2.2.9 — Validate workflow YAML syntax
- [ ] #2.2.10 — Test workflow dry-run

**2.3: Add Test Coverage (18h effort)**

- [ ] #2.3.1 — Create test file structure
- [ ] #2.3.2 — Test milestone selection (unit)
- [ ] #2.3.3 — Test linked issue detection (unit)
- [ ] #2.3.4 — Test dry-run mode (unit)
- [ ] #2.3.5 — Test idempotency (unit)
- [ ] #2.3.6 — Test error handling (unit)
- [ ] #2.3.7 — Test API calls (integration)
- [ ] #2.3.8 — Test edge cases (integration)
- [ ] #2.3.9 — Test full E2E workflow
- [ ] #2.3.10 — Achieve 80%+ code coverage

**2.4: Live Demonstration (16h effort)**

- [ ] #2.4.1 — Identify test repository
- [ ] #2.4.2 — Create test milestones
- [ ] #2.4.3 — Create test PR/issue data
- [ ] #2.4.4 — Run script dry-run
- [ ] #2.4.5 — Verify milestone selection logic
- [ ] #2.4.6 — Run script live
- [ ] #2.4.7 — Test workflow on actual PR merge
- [ ] #2.4.8 — Test workflow on actual issue close
- [ ] #2.4.9 — Verify confirmation comments
- [ ] #2.4.10 — Document results

**2.5: Documentation (11h effort)**

- [ ] #2.5.1 — ALLOCATE-SCRIPT-README.md (inline docs)
- [ ] #2.5.2 — IMPLEMENTATION-GUIDE.md
- [ ] #2.5.3 — Add inline code comments
- [ ] #2.5.4 — Create troubleshooting guide

### Acceptance Criteria

- [ ] Script implements all FR (Functional Requirements) from OPENSPEC
- [ ] Workflow triggers on PR merge and issue close
- [ ] Dry-run mode works accurately
- [ ] Live demonstration successful on real repo
- [ ] ≥80% test coverage
- [ ] All documentation complete
- [ ] Code reviewed and approved
- [ ] Ready for Phase 3

### Definition of Ready

- [ ] Phase 1 complete and approved
- [ ] OpenSpec and RFC approved
- [ ] Team assigned to Phase 2 work
- [ ] Test repository identified

### Definition of Done

- [ ] All subtasks closed
- [ ] All tests passing
- [ ] Code review approved
- [ ] Demonstration documented
- [ ] Merged to feature branch
- [ ] Ready for Phase 3 refinement

### Effort Estimate

- **Total:** 72 hours (~9 work days at 8h/day)
- **Critical Path:** Script → Tests → Demonstration (~5-6 days)

### Related Issues

- Blocked by: #P1 (Phase 1)
- Links to: #EPIC (parent)
- Blocks: #P3 (Phase 3)

---

## Phase 3: Refinement & Rollout

**Title:** Phase 3: Refinement & Rollout — PR/Issue Milestone Allocation  
**Type:** Task  
**Labels:** `type:task`, `area:automation`, `phase:3-rollout`, `status:pending`  
**Milestone:** (Current)  
**Assignee:** TBD  

### Description

Incorporate Phase 2 feedback, create team documentation, deploy to production, and announce feature to team.

### Tasks

- [ ] Incorporate Phase 2 code review feedback
- [ ] Refine error messages and logging
- [ ] Performance optimization if needed
- [ ] Create team runbook (`RUNBOOK.md`)
- [ ] Create FAQ document (`FAQ.md`)
- [ ] Create PR for merge to `develop`
- [ ] Team announcement (post in channel)
- [ ] Deploy script to `.github/scripts/`
- [ ] Deploy workflow to `.github/workflows/`
- [ ] Enable workflow on main repo
- [ ] Monitor first 48 hours

### Acceptance Criteria

- [ ] All Phase 2 feedback addressed
- [ ] Team runbook created and reviewed
- [ ] PR merged to `develop`
- [ ] Team announcement posted
- [ ] Workflow active and processing real PRs/issues
- [ ] 48-hour monitoring period complete with no critical issues

### Definition of Done

- [ ] All tasks completed
- [ ] Code merged
- [ ] Team trained
- [ ] Monitoring started

### Related Issues

- Blocked by: #P2 (Phase 2)
- Links to: #EPIC (parent)
- Blocks: #P4 (Phase 4)

---

## Phase 4: Monitoring & Maintenance

**Title:** Phase 4: Monitoring & Maintenance — PR/Issue Milestone Allocation  
**Type:** Task  
**Labels:** `type:task`, `area:automation`, `phase:4-maintain`, `status:pending`  
**Milestone:** (Current)  
**Assignee:** TBD  

### Description

Monitor allocation success, track errors, gather team feedback, and plan future enhancements.

### Tasks (Ongoing)

- [ ] Monitor allocation success rate (track ≥95%)
- [ ] Track and categorize allocation errors
- [ ] Analyze edge cases and patterns
- [ ] Collect team feedback (weekly check-ins)
- [ ] Refine milestone selection logic if needed
- [ ] Plan v1.1 enhancements (dashboard, notifications, etc.)
- [ ] Document maintenance procedures
- [ ] Create runbook for operations team

### Success Metrics

- [ ] 2-week success rate ≥95%
- [ ] All errors categorized and documented
- [ ] Feedback incorporated into v1.1 roadmap
- [ ] Zero critical issues in first month

### Definition of Done

- [ ] 2-week monitoring period complete
- [ ] Feedback summary created
- [ ] v1.1 roadmap drafted

### Related Issues

- Blocked by: #P3 (Phase 3)
- Links to: #EPIC (parent)

---

## Issue Creation Script

Use this script to create all issues in bulk:

```bash
#!/bin/bash
# create-issues.sh
# Usage: ./create-issues.sh

REPO="lightspeedwp/.github"
TOKEN="$GITHUB_TOKEN"

# Create Epic
gh issue create \
  --repo "$REPO" \
  --title "PR/Issue → Milestone Allocation Automation" \
  --label "type:epic,area:automation,area:milestone,priority:important" \
  --body "$(cat <<'EOF'
Implement automated allocation of merged PRs and closed issues to the current active milestone...
EOF
)"

# Create Phase 1
gh issue create \
  --repo "$REPO" \
  --title "Phase 1: Specification & Design — PR/Issue Milestone Allocation" \
  --label "type:task,area:automation,phase:1-spec,status:in-progress" \
  --body "$(cat <<'EOF'
Complete specification and design for PR/issue-to-milestone allocation automation...
EOF
)"

# Repeat for Phase 2, 3, 4...
# See templates above for full content
```

**To use:**

1. Copy each issue template above
2. Create issues manually in GitHub UI, OR
3. Use the script above (requires `gh` CLI)
4. Link issues in epic using "Related" section

---

## Issue Linking Strategy

All issues should be linked in this pattern:

```
EPIC (parent)
├── #P1 (Phase 1) — Specification & Design
│   └── Blocked by: (none)
│   └── Blocks: #P2
│
├── #P2 (Phase 2) — Implementation & Testing
│   ├── Blocked by: #P1
│   ├── Blocks: #P3
│   └── Subtasks: #2.1, #2.2, #2.3, #2.4, #2.5 (optional, can use checkboxes instead)
│
├── #P3 (Phase 3) — Refinement & Rollout
│   ├── Blocked by: #P2
│   ├── Blocks: #P4
│
└── #P4 (Phase 4) — Monitoring & Maintenance
    └── Blocked by: #P3
```

### Linking Format

In issue descriptions, use:

```markdown
### Related Issues

- Links to: #EPIC (parent)
- Blocked by: #P1 (depends on completion)
- Blocks: #P2 (must complete before next phase)
- Subtasks: #2.1.1, #2.1.2, ... (optional breakdown)
```

---

## Labels to Create (if needed)

Ensure these labels exist in your repo:

```yaml
type:epic           → Project/initiative (9+ weeks)
type:task           → Scoped work item
type:feature        → New capability
type:bug            → Reproducible defect

area:automation     → Automation & workflows
area:milestone      → Milestone management
area:testing        → Test coverage & QA

phase:1-spec        → Specification phase
phase:2-impl        → Implementation phase
phase:3-rollout     → Rollout phase
phase:4-maintain    → Maintenance phase

status:in-progress  → Currently being worked
status:pending      → Waiting to start
status:done         → Completed

priority:critical   → Urgent, blocking
priority:important  → High value
priority:normal     → Standard priority
priority:low        → Nice to have
```

---

## Project Board Setup (Optional)

If using GitHub Projects, create columns:

```
Backlog → In Progress → In Review → Done

Move issues between columns as they progress through phases.
```

---

## Milestone Allocation (for these issues)

The irony: These issues themselves should be allocated to milestones! Once created, allocate them to:

- **Phase 1 & 2:** Current active milestone (this feature is priority)
- **Phase 3 & 4:** Future milestones (dependent on Phase 2 completion)

---

## Next Steps

1. **Copy templates** above into your GitHub repository
2. **Create issues** (manually or via script)
3. **Link issues** using "Related" section & labels
4. **Track progress** via Project board (optional)
5. **Update statuses** as work progresses

---

**Status:** Templates ready for issue creation  
**Next:** Create issues in GitHub, update with actual issue numbers

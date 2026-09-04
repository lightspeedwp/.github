---
openspec_version: "1.0"
type: "issue"
issue_type: "feature"
title: "feat/governance: Establish organization-wide branch naming enforcement policy"
labels: ["type:feat", "area:governance", "area:docs", "priority:high"]
milestone: "v1.2"
assignee: null
linked_issue: null
---

# Establish Organization-Wide Branch Naming Enforcement Policy

## Problem

Phase 3 implemented **repository-level** branch naming validation and enforcement in the `.github` repo. However, there is **no organization-wide policy** documenting:

- Why branch naming matters (governance goals)
- Enforcement timeline and phase-in schedule
- Expectations for all team members
- Exception request and override procedures
- Compliance metrics and reporting
- Appeals process for disputed decisions

**Impact:** Teams understand the rules locally in `.github` repo, but lack org-wide context. Unclear when governance becomes mandatory. No clear exception process.

## Solution

Create comprehensive organization-wide governance policy document by:

1. **Create central policy document** — `docs/ORG_GOVERNANCE_POLICY.md`:
   - Executive summary (1 paragraph)
   - Why governance matters (3-4 bullets: consistency, automation, scaling, compliance)
   - Scope (all LightSpeed org repositories, all teams)
   - Effective date and phase-in timeline
   - Governance framework overview

2. **Document all branch naming rules:**
   - List all 34 allowed branch types with definitions
   - Show forbidden prefixes (claude/, copilot/, openai/) with rationale
   - Provide examples for each type
   - Link to detailed guidance in `.github/instructions/branch-naming.instructions.md`
   - Link to BRANCHING_STRATEGY.md

3. **Define enforcement timeline:**
   - **Phase A (Immediate):** Validation enabled on all new repos
   - **Phase B (Week 2-3):** Existing repos migrated to validation
   - **Phase C (Week 4):** Governance becomes mandatory; exceptions require approval
   - Timeline visualization (Gantt chart or ASCII table)

4. **Document exception procedures:**
   - What constitutes valid exception (emergency fixes, hotspots, etc.)
   - Who can request exceptions (team leads, maintainers)
   - Exception approval workflow (who approves, SLA)
   - Documentation of approved exceptions
   - Sunset date for exceptions (automatic expiry)

5. **Define override procedures** (for urgent/critical situations):
   - Who can request override (senior engineers, tech leads)
   - What triggers override (critical production issues)
   - Override SLA (must be reviewed within 2 hours)
   - Mandatory post-override review (within 24 hours)
   - Documentation in governance log

6. **Document appeals process:**
   - Dispute timeline (must appeal within 7 days)
   - Appeals board composition
   - Appeals process (written submission, review, decision)
   - SLA for appeals decision (5 business days)
   - Documentation of decision and rationale

7. **Establish compliance metrics:**
   - Target: 95%+ compliance rate
   - Acceptable exception rate: <5% of branches
   - Monthly reporting cadence
   - Dashboard/reporting mechanism (GitHub Project or Actions workflow)

8. **Create implementation checklist:**
   - All teams acknowledged policy
   - All repos have governance enabled
   - All team members trained
   - Exception/override process documented
   - Appeals process available
   - Metrics reporting live

## Implementation Notes

- Policy should be accessible at top level: `docs/ORG_GOVERNANCE_POLICY.md`
- Maintain consistency with Phase 3 rule definitions
- Coordinate with Issue 4.3 (Team Training) — policy drives training content
- Coordinate with Issue 4.5 (Exceptions) — exceptions must fit in overall policy
- Link policy to `.github/CLAUDE.md` and AGENTS.md

## Definition of Done

- [ ] `docs/ORG_GOVERNANCE_POLICY.md` created
- [ ] All 34 branch types documented with examples
- [ ] Forbidden prefixes listed with rationale
- [ ] Enforcement timeline defined and published
- [ ] Exception request procedures documented
- [ ] Override procedures documented
- [ ] Appeals process documented
- [ ] Compliance metrics framework established
- [ ] Policy reviewed by tech leadership
- [ ] All team members notified of policy
- [ ] Team acknowledgment documented (>90%)
- [ ] Policy published and accessible
- [ ] PR merged

## Test Scenarios

1. **Read policy as new team member:**
   - All guidance is clear and actionable
   - Branch naming rules are easy to understand
   - Exception/override processes are clear

2. **Test exception request:**
   - Request submission works
   - Approval workflow functions
   - Metrics capture approved exceptions

3. **Test override request:**
   - Critical situation can use override
   - Notification to leadership happens
   - Post-override review triggered

4. **Verify metrics:**
   - Compliance dashboard shows correct numbers
   - Reporting runs without errors

## Related Issues

- Issue 4.1 — Migrate governance rules (dependency: rules must exist)
- Issue 4.3 — Team training (dependency: policy drives training content)
- Issue 4.4 — Compliance reporting (dependency: policy establishes metrics)
- Issue 4.5 — Exceptions & overrides (dependency: exceptions fit in policy)

## Related Documentation

- `CLAUDE.md` — Branch naming rules (reference in policy)
- `AGENTS.md` — AI agent governance (cross-reference)
- `docs/BRANCHING_STRATEGY.md` — Detailed branching rules
- `.github/instructions/branch-naming.instructions.md` — Implementation details

## Success Criteria

- ✅ Policy document published and accessible
- ✅ All 34 branch types clearly documented
- ✅ Enforcement timeline published
- ✅ Exception/override procedures clear
- ✅ >90% team acknowledgment of policy
- ✅ All org repositories aware of governance requirements
- ✅ Zero confusion about rules or procedures
- ✅ Exceptions and overrides tracked and reported

## Effort Estimate

**4-5 hours** — Document creation, review cycles, team acknowledgment

## Timeline

**Week 1 of Phase 4** — **CRITICAL PATH BLOCKER** for Issues 4.3 (Training) and 4.4 (Reporting)

---

**OpenSpec Document Version:** 1.0  
**Created:** 2026-09-03  
**Phase:** 4 (Governance Deployment)  
**Status:** Draft  
**Critical Path:** YES — Gates Issues 4.3 and 4.4

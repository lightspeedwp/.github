---
openspec_version: "1.0"
type: "issue"
issue_type: "feature"
title: "feat/governance: Define governance exceptions and override procedures"
labels: ["type:feat", "area:governance", "area:docs", "priority:normal"]
milestone: "v1.2"
assignee: null
linked_issue: null
---

# Define Governance Exceptions and Override Procedures

## Problem

Phase 3 governance rules are comprehensive and well-enforced, but **there is no formal process for exceptions and overrides**:

- No documented procedure for requesting exceptions to branch naming rules
- No approval workflow or decision-makers identified
- No tracking mechanism for approved exceptions
- No appeals process for disputed decisions
- No clarity on when overrides are appropriate (vs. exceptions)

**Impact:** Teams don't know how to handle edge cases. Ad-hoc workarounds proliferate. No audit trail for governance decisions.

## Solution

Create formal governance exceptions and override procedures by:

1. **Create `docs/GOVERNANCE_EXCEPTIONS.md`** — Policy document defining:
   - **What is an exception vs. override:**
     - **Exception:** Formal request to use non-standard branch name (e.g., `claude/hotfix`) with approval
     - **Override:** Emergency use of non-standard branch without approval (for critical issues only)
   - **Types of valid exceptions:**
     - Hotfix branches from `hotfix/` (already allowed, but clarify)
     - Special team needs (e.g., research branches with `research/`)
     - Integration with external tools (e.g., `bot/auto-updates`)
     - One-off experimental work (e.g., `proto/new-feature`)
   - **Exception criteria:**
     - Business impact
     - Duration (temporary vs. permanent)
     - Team approval
     - Review frequency
   - **Invalid exceptions:**
     - Using `claude/` or `copilot/` as convenience (NOT allowed)
     - Bypassing governance because "rules are inconvenient" (NOT allowed)

2. **Create exception request process** — `GOVERNANCE_EXCEPTION_REQUEST.md`:
   - **How to request:**
     - Create GitHub issue with template `EXCEPTION_REQUEST`
     - Include: reason, proposed branch prefix, duration, team approval
     - Assign to governance committee or tech lead
   - **What happens:**
     - Governance committee reviews within 2 business days
     - Approval or rejection with rationale
     - If approved: documented in exceptions register
     - If rejected: feedback provided; can appeal
   - **Timeline:**
     - Standard review: 2 business days
     - Expedited review (business impact): 4 hours
     - Decision SLA: 2 business days standard, same day expedited

3. **Create override procedures** — For critical situations only:
   - **What constitutes override:**
     - Production outage requires emergency hotfix
     - Security vulnerability requires immediate patch
     - Data integrity issue requires urgent fix
   - **Override process:**
     - Use `hotfix/*` prefix (already allowed)
     - If must use non-standard name: Document in PR description
     - Notify governance committee immediately (issue or Slack)
     - Must complete post-override review within 24 hours
   - **Post-override review:**
     - Was override truly necessary?
     - Should this be converted to formal exception?
     - What can we learn for future overrides?
     - Documentation for audit trail

4. **Create exceptions tracking register** — GitHub-based tracking:
   - **Mechanism:** GitHub Project board or dedicated Issues
   - **For each exception:**
     - Issue number
     - Requester and approval authority
     - Approved prefix/rule
     - Business reason
     - Approval date and duration
     - Auto-expiry date (if temporary)
     - Status (approved, expired, renewed)
   - **Automatic expiration:**
     - Temporary exceptions auto-expire on set date
     - Notification when approaching expiry
     - Renewal requires same approval process

5. **Create appeals process** — For disputed decisions:
   - **Who can appeal:** Original requester
   - **When to appeal:** Within 7 days of rejection
   - **Appeal process:**
     - Submit written appeal with additional context
     - Appeals committee (different from original approver)
     - Review within 5 business days
     - Final decision (can overturn, uphold, or modify)
   - **Escalation:**
     - If still unsatisfied: escalate to engineering leadership
     - Final escalation authority: VP Engineering

6. **Create exception templates** — GitHub issue templates:
   - **Template: EXCEPTION_REQUEST**
     - Title: `[EXCEPTION REQUEST] {branch-prefix} for {reason}`
     - Sections: Reason, Proposed Prefix, Duration, Team Approval, Business Impact
   - **Template: OVERRIDE_NOTIFICATION**
     - Title: `[OVERRIDE NOTIFICATION] {branch-name} for {reason}`
     - Sections: Situation, Override Used, Override Authority, Post-Review Required

7. **Create audit trail documentation:**
   - **File:** `docs/GOVERNANCE_EXCEPTIONS_LOG.md`
   - **Updated weekly** with:
     - Approved exceptions (active and expired)
     - Overrides used (with rationale)
     - Appeals submitted (with decisions)
     - Metrics (% of branches using exceptions, override frequency)

8. **Establish governance committee** — Define:
   - **Members:** Tech leads, engineering manager, one senior engineer
   - **Responsibilities:** Review exception requests, approve/reject, appeals
   - **Meeting cadence:** Weekly async review; emergency same-day review if needed
   - **Decision authority:** Majority vote

## Implementation Notes

- Exceptions should be rare (target: <5% of branches)
- Overrides should be very rare (target: <1% of branches)
- Document every decision with rationale (for future learning)
- Review exception policy quarterly (is it working? Do we need adjustments?)
- Communicate exceptions transparently (all team members should see exceptions log)

## Definition of Done

- [ ] `docs/GOVERNANCE_EXCEPTIONS.md` created with exception types and criteria
- [ ] `GOVERNANCE_EXCEPTION_REQUEST.md` created with request process
- [ ] Override procedures documented
- [ ] Appeals process documented
- [ ] `EXCEPTION_REQUEST` GitHub issue template created
- [ ] `OVERRIDE_NOTIFICATION` GitHub issue template created
- [ ] Exceptions tracking register (GitHub Project or Issues) created
- [ ] `docs/GOVERNANCE_EXCEPTIONS_LOG.md` created and published
- [ ] Governance committee members identified and notified
- [ ] Decision authority documented
- [ ] All team members notified of exception/override availability
- [ ] PR merged

## Test Scenarios

1. **Test exception request process:**
   - Submit exception request using template
   - Track through approval workflow
   - Verify decision documented

2. **Test override notification:**
   - Submit override notification for critical issue
   - Verify governance committee notified
   - Verify post-override review triggered

3. **Test appeal process:**
   - Submit appeal of rejected exception
   - Verify appeals committee reviews
   - Verify decision documented

4. **Test expiration:**
   - Create temporary exception with expiry date
   - Verify reminder sent before expiry
   - Verify exception auto-expires

## Related Issues

- Issue 4.2 — Establish policy (depends on policy for framework)
- Issue 4.4 — Compliance reporting (exceptions tracked in metrics)
- Issue 4.1 — Migrate governance (exceptions apply to all repos)

## Related Documentation

- `docs/ORG_GOVERNANCE_POLICY.md` — Overall governance framework
- `docs/GOVERNANCE_EXCEPTIONS.md` — Exception policy document
- `GOVERNANCE_EXCEPTIONS_LOG.md` — Active exceptions and overrides
- `CLAUDE.md` — Repository rules (cross-reference exceptions)

## Success Criteria

- ✅ Exception policy clear and accessible
- ✅ Request process easy to follow
- ✅ Appeal process fair and transparent
- ✅ All exceptions tracked and audited
- ✅ <5% of branches use exceptions
- ✅ <1% of branches use overrides
- ✅ All decisions documented with rationale
- ✅ Appeals resolved within 5 business days

## Effort Estimate

**2-3 hours** — Policy documentation, template creation, process setup

## Timeline

**Week 2-3 of Phase 4** — Parallel work (not critical path), depends on Issue 4.2 for framework

---

**OpenSpec Document Version:** 1.0  
**Created:** 2026-09-03  
**Phase:** 4 (Governance Deployment)  
**Status:** Draft

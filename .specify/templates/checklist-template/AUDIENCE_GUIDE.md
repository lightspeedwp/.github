# Audience Selection Guide

**Purpose**: Help teams choose the right checklist audience for their workflow  
**Format**: Decision tree + scenario examples  
**Updated**: 2026-09-17

---

## Quick Decision Tree

```
┌─ Who is reviewing the specification?
│
├─ The author (before peer review)?
│  └─> Use AUTHOR audience (~30 min self-check)
│
├─ A peer/team member (for quality verification)?
│  └─> Use PEER audience (~45 min review & feedback)
│
├─ A stakeholder/approver (for go/no-go decision)?
│  └─> Use STAKEHOLDER audience (~15 min gate decision)
│
└─ An architect/dependency reviewer (for integration alignment)?
   └─> Use INTEGRATION audience (~30 min dependency check)
```

---

## The Four Audiences

### 1. AUTHOR Audience (~30 minutes)

**Who uses this**: Specification author, before sending to peer review  
**When to use**: During spec writing or immediately after  
**What it does**: Helps you self-check your own work

**Key features**:

- Highlights unchecked items (gaps you haven't addressed)
- Guides you through each dimension with tips
- Estimates time to completion
- Helps you identify ambiguities before peer review

**Example workflow**:

1. You finish writing your specification
2. Use AUTHOR checklist for self-review (~25 minutes)
3. Fix identified gaps
4. Attach checklist to PR
5. Send for peer review

**Success looks like**:

- ✅ All items checked OR explicitly marked as gaps/ambiguities
- ✅ Gaps documented in spec with `[Gap: ...]` markers
- ✅ Ambiguities noted with `[Ambiguity: ...]` markers
- ✅ Checklist took <30 minutes (indicates good scope understanding)

---

### 2. PEER Audience (~45 minutes)

**Who uses this**: Peer reviewers, technical leads, team members  
**When to use**: During peer review phase (spec is in PR, awaiting review)  
**What it does**: Verifies author's assessment and surfaces new gaps

**Key features**:

- Shows you what author already verified
- Highlights items they flagged as ambiguous
- Prioritizes gaps (critical vs. important vs. nice-to-have)
- Helps you provide constructive feedback
- Tracks your findings separately from author's

**Example workflow**:

1. Author submits spec with filled checklist
2. You review using PEER audience
3. You verify author's checked items (or disagree and update)
4. You find gaps author missed
5. You provide feedback and updated checklist
6. Author revises spec
7. You re-verify (as needed)

**Success looks like**:

- ✅ You've verified all of author's claims
- ✅ You've identified 0–5 new gaps
- ✅ Critical gaps fixed before implementation
- ✅ Important gaps documented for future iterations
- ✅ Team agrees on interpretation of unclear items

---

### 3. STAKEHOLDER Audience (~15 minutes)

**Who uses this**: Product owners, stakeholders, decision-makers, business leads  
**When to use**: Gate decision phase (specification is nearly ready; needs final approval)  
**What it does**: Helps you decide: "Should we implement this?"

**Key features**:

- Executive summary (completion %, gaps, ambiguities)
- Go/no-go recommendation
- Risk assessment (high/medium/low)
- Timeline impact (ready now? needs 1–2 days? needs 1 week?)
- Clear next steps

**Example workflow**:

1. Author and peer have finalized spec
2. Stakeholder uses STAKEHOLDER checklist
3. Stakeholder reviews executive summary
4. Stakeholder decides: GO / NO-GO / CONDITIONAL GO
5. Stakeholder notifies team

**Success looks like**:

- ✅ You understand what's being built (1-sentence description)
- ✅ You're confident in timeline (implementation can start when?)
- ✅ You know the risks (what could still go wrong?)
- ✅ You've made a clear decision (go/no-go/conditional)
- ✅ Team has clear next steps

---

### 4. INTEGRATION Audience (~30 minutes)

**Who uses this**: Architects, dependency managers, technical leads responsible for integration  
**When to use**: During spec review, especially for features with cross-team dependencies  
**What it does**: Verifies integration alignment and parallel work capability

**Key features**:

- Maps all dependencies (external systems, other teams' work)
- Verifies API/service versions are documented
- Checks cross-project timeline alignment
- Assesses parallel work capability
- Identifies integration blockers

**Example workflow**:

1. Specification is in peer review
2. Architecture/integration reviewer uses INTEGRATION audience
3. They verify all dependencies are clear
4. They check alignment with other active projects
5. They identify any blockers or risks
6. They update team on go/no-go for dependencies

**Success looks like**:

- ✅ All external dependencies are explicitly named (not generic)
- ✅ API/service versions are documented
- ✅ Cross-project timeline dependencies are clear
- ✅ Parallel work is possible (or blockers are identified)
- ✅ No surprise dependencies emerge during implementation

---

## Audience Combinations

Some specifications benefit from **multiple audiences** reviewing at the same time.

### Author + Peer (Recommended for most specs)

**Timeline**: Day 1 (author) + Day 2 (peer) = 2 days

**Process**:

1. Author uses AUTHOR checklist; fixes gaps
2. Peer uses PEER checklist; verifies and finds new gaps
3. Author fixes peer's findings
4. Proceed to stakeholder gate

**When to use**: Most feature specifications (size: small to medium)

### Author + Peer + Integration (Recommended for specs with cross-team dependencies)

**Timeline**: Day 1 (author) + Day 2 (peer + integration in parallel) = 2 days

**Process**:

1. Author uses AUTHOR checklist; fixes gaps
2. Peer and Integration reviewer work in parallel:
   - Peer uses PEER checklist; verifies quality
   - Integration uses INTEGRATION checklist; verifies dependencies
3. Author fixes findings from both
4. Proceed to stakeholder gate

**When to use**: Specs with significant cross-team dependencies (API integrations, multi-service work)

### All Four (Recommended for large/high-risk features)

**Timeline**: Day 1 (author) + Day 2 (peer + integration) + Day 3 (stakeholder) = 3 days

**Process**:

1. Author uses AUTHOR checklist; fixes gaps
2. Peer and Integration reviewer work in parallel (day 2)
3. Stakeholder uses STAKEHOLDER checklist; makes gate decision (day 3)
4. If GO, proceed with implementation
5. If NO-GO or CONDITIONAL, address findings and re-gate

**When to use**: Large features, security-sensitive specs, high-risk initiatives

---

## Scenario Examples

### Scenario 1: Small Bug Fix

**Specification**: "Add sorting to user list table"  
**Complexity**: Low  
**Timeline**: 2–3 days to implement

**Audience recommendation**: **AUTHOR only** (optional peer)

**Why**:

- Scope is small and clear
- Limited edge cases
- Single team affected
- No complex dependencies

**Workflow**:

1. Author self-checks with AUTHOR checklist (10 min)
2. Author confident; submits spec
3. Optional: peer takes quick look
4. Proceed to implementation

---

### Scenario 2: API Redesign

**Specification**: "Redesign user authentication API for OAuth 2.0"  
**Complexity**: High  
**Timeline**: 3–4 weeks to implement

**Audience recommendation**: **Author + Peer + Integration + Stakeholder**

**Why**:

- Affects multiple teams (mobile, web, backend, auth service)
- Cross-team dependencies (other services depend on auth API)
- Security implications (requires peer review)
- Major business decision (requires stakeholder approval)

**Workflow**:

1. Author uses AUTHOR checklist; fixes gaps (day 1)
2. Peer and Integration reviewer work in parallel (day 2)
   - Peer verifies spec quality
   - Integration verifies OAuth vendor readiness, API alignment
3. Author fixes findings (day 2–3)
4. Stakeholder gates decision (day 3–4)
5. If GO, coordinate with dependent teams
6. Implement

---

### Scenario 3: Internal Tool Enhancement

**Specification**: "Add batch export to reporting dashboard"  
**Complexity**: Medium  
**Timeline**: 1 week to implement

**Audience recommendation**: **Author + Peer**

**Why**:

- Single team affected (reporting team)
- Limited external dependencies
- Internal tool (lower risk)
- Peer review needed for quality assurance

**Workflow**:

1. Author uses AUTHOR checklist; fixes gaps (day 1)
2. Peer reviews with PEER checklist (day 1–2)
3. Author fixes peer findings (day 2)
4. Proceed to implementation (day 3)

---

### Scenario 4: Cross-Org Integration

**Specification**: "Integrate with third-party analytics platform (segment.io)"  
**Complexity**: High  
**Timeline**: 2–3 weeks to implement

**Audience recommendation**: **Author + Peer + Integration + Stakeholder**

**Why**:

- Multiple teams affected (web, mobile, backend, analytics, data)
- External vendor dependency (Segment API stability matters)
- Security/data implications (PII handling?)
- Major business cost (Segment licensing)
- Cross-functional approval needed

**Workflow**:

1. Author writes spec with vendor docs (day 1–2)
2. Author self-checks with AUTHOR checklist (day 2)
3. Peer + Integration reviewer work in parallel (day 3)
   - Peer verifies spec quality
   - Integration verifies Segment API docs, vendor SLA, cost implications
4. Author fixes findings (day 3–4)
5. Stakeholder gates decision (day 4–5)
6. If GO, coordinate with all dependent teams
7. Implement

---

## How to Choose: Decision Checklist

**Ask yourself these questions**:

1. **How large is the feature?**
   - Small (1–2 days) → Author only
   - Medium (3–7 days) → Author + Peer
   - Large (2+ weeks) → Author + Peer + Stakeholder

2. **How many teams are affected?**
   - 1 team → Author + Peer
   - 2–3 teams → Author + Peer + Integration
   - 4+ teams → Author + Peer + Integration + Stakeholder

3. **Are there external dependencies?**
   - No → Author + Peer
   - Yes (1–2) → Author + Peer + Integration
   - Yes (3+) or critical → Author + Peer + Integration + Stakeholder

4. **Is it security or compliance sensitive?**
   - No → Author + Peer (+ Integration if dependencies)
   - Yes → Author + Peer + Integration + Stakeholder

5. **Does it require business/product approval?**
   - No → Author + Peer
   - Yes → Add Stakeholder

**Rule of thumb**:

- **<50 items unchecked after author review** → Can proceed to peer
- **<5 gaps after peer review** → Can proceed to stakeholder gate
- **<2 critical ambiguities** → Can proceed with implementation

---

## Audience Workflow Integration

### Spec Writing Process

```
Write spec
    ↓
Author self-checks (AUTHOR audience)
    ↓
Fix gaps
    ↓
Send to peer review
    ↓
Peer reviews (PEER audience)
    ↓
Author addresses feedback
    ↓
Ready for implementation?
    ├─ High-risk/large → Stakeholder gates (STAKEHOLDER audience)
    └─ Low-risk/small → Proceed to implementation
    ↓
Check dependencies (INTEGRATION audience)
    ↓
Proceed with implementation
```

### Cross-Team Coordination

For specs with cross-team dependencies:

1. **Author** writes spec (includes all dependencies)
2. **Integration reviewer** verifies dependencies are clear and aligned
3. **Peer** verifies spec quality
4. **Stakeholder** gates go/no-go decision
5. **Author** coordinates with dependent teams on timeline

---

## Tips for Each Audience

### For Authors

- **Use AUTHOR**: Before sending spec anywhere
- **Don't skip**: Takes only 25–30 min; catches 80% of gaps
- **Be honest**: Mark items unchecked if you're not sure; don't fake it
- **Attach checklist**: Include your filled checklist in the PR

### For Peer Reviewers

- **Use PEER**: When reviewing someone else's spec
- **Trust but verify**: Author may have checked items; spot-check a few
- **Prioritize**: Focus on critical gaps first
- **Be constructive**: Frame feedback as "helps implementation" not "you failed"

### For Stakeholders

- **Use STAKEHOLDER**: Before making go/no-go decision
- **Don't get lost in details**: Read executive summary, not every item
- **Ask key questions**: If metrics look questionable, ask why
- **Decide clearly**: Go/no-go/conditional; not "maybe"

### For Integration Reviewers

- **Use INTEGRATION**: During spec review if cross-team dependencies exist
- **Map dependencies**: Create visual map of external systems
- **Check versioning**: API v3.1? Vendor SLA? Licensing?
- **Coordinate timeline**: Talk to dependent teams about readiness

---

## When to Use Each Audience

| Audience | When | Duration | Owner |
|----------|------|----------|-------|
| **Author** | Before peer review | 25–30 min | Spec author |
| **Peer** | During peer review | 40–45 min | Team member |
| **Stakeholder** | Gate decision | 15 min | PO, stakeholder |
| **Integration** | If dependencies | 25–30 min | Architect |

---

## FAQs

**Q: Do I have to use all four audiences?**  
A: No. Use what fits your workflow. Small specs need only Author + Peer. Large specs benefit from all four.

**Q: Can I do author and peer reviews on the same day?**  
A: Yes. Author checks in morning, peer reviews afternoon, implementation starts next day.

**Q: What if I disagree with author's checklist marks?**  
A: Update the checklist with your assessment. Peer and author discuss discrepancies together.

**Q: Should I use Integration audience for specs with no dependencies?**  
A: No. Skip it if there are no external systems or cross-team work.

**Q: Can I switch audiences mid-review?**  
A: Yes. If you realize you're looking at a spec with major cross-team impacts, add Integration reviewer.

**Q: What if the specification fails multiple audiences' reviews?**  
A: That's OK. Fix the findings and re-review. Multiple loops are normal; better now than during implementation.

---

## Summary

- **AUTHOR**: You (spec writer) checking your own work
- **PEER**: Someone else verifying your quality
- **STAKEHOLDER**: Decision-maker saying "yes, implement"
- **INTEGRATION**: Architect checking dependency alignment

Choose the audiences that fit your spec's scope, risk level, and cross-team dependencies. Most specs use Author + Peer. Large or risky specs add Stakeholder. Specs with dependencies add Integration.

---

**Next**: Attach this guide to your specification process. Team members should know which audience to use for their role and workflow. 🚀

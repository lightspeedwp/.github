# Stakeholder Gate Decision Checklist Guidance

**Role**: Specification Stakeholder (Approver, Product Owner, Business Lead)  
**Time**: ~15 minutes  
**Goal**: Make go/no-go decision on specification readiness for implementation

---

## Introduction

As a stakeholder, you're deciding: **Is this specification ready for implementation?** You don't need to understand every detail, but you need confidence that the team has thought through the major requirements, edge cases, and dependencies.

This 8-dimensional Requirements Quality Framework helps you assess specification maturity:

- **Completeness**: Specification covers the essential requirements
- **Clarity**: Team understands what needs to be built
- **Consistency**: No conflicting requirements
- **Measurability**: Success is objectively verifiable
- **Scenario Coverage**: User scenarios and error paths are defined
- **Edge Cases**: Boundary conditions and failure modes are handled
- **Dependencies**: Integrations and assumptions are explicit
- **Ambiguities**: No critical unknowns blocking implementation

---

## Your Decision: Go or No-Go?

### ✅ GO

**Decision**: Specification is ready for implementation.

**When to choose GO**:

- All critical items are checked (verified by author and peer reviewer)
- Gaps are documented and prioritised (some can be addressed post-launch)
- No blocker ambiguities remain (things that prevent starting work)
- Team is confident they can implement based on this spec
- Timeline and resource alignment is confirmed

### 🛑 NO-GO

**Decision**: Specification needs revision before implementation starts.

**When to choose NO-GO**:

- Multiple critical gaps in core functionality
- Conflicting requirements (consistency issues)
- Missing measurable success criteria
- Unclear dependencies or integrations (risk of surprises)
- Team flagged high-risk ambiguities
- Scope is unclear (could expand mid-project)

### ⏸️ CONDITIONAL GO

**Decision**: Implementation can start, but with conditions.

**When to choose CONDITIONAL GO**:

- Most items are checked; 1–2 gaps are being resolved in parallel
- Gaps are in non-critical areas (nice-to-have features)
- Team has mitigation plan (e.g., "resolve ambiguity in week 2")
- Timeline flexibility exists to accommodate revision
- Risk is low (minor gaps, not scope creep)

---

## What You Need to Know (15 minutes)

### Step 1: Read the Executive Summary (3 minutes)

Ask the team to provide:

- **What** are we building? (1-sentence description)
- **Why** are we building it? (business value)
- **Timeline**: When does implementation start? When is it needed?
- **Resources**: Do we have the team and budget?

### Step 2: Review the Quality Dashboard (5 minutes)

Look at:

- **Completeness Score**: Do all major requirements have acceptance criteria?
- **Critical Gap Count**: How many blockers remain?
- **Ambiguity Count**: How many unknowns are still unresolved?
- **Peer Review Status**: Did a second set of eyes verify the spec?

**Red Flags**:
>
- >5 critical gaps remaining
- >3 unresolved ambiguities
- Missing peer review
- Score <70% on any dimension

### Step 3: Ask Key Questions (5 minutes)

If you see gaps or concerns, ask the team:

1. **Completeness**: "Have we covered all the major use cases? What about error cases?"
2. **Clarity**: "Could a developer implement this without asking questions?"
3. **Measurability**: "How do we know this is done? What's the definition of success?"
4. **Dependencies**: "What other systems does this depend on? Are those ready?"
5. **Timeline Impact**: "If we hit one of the flagged ambiguities during implementation, could that delay launch?"

### Step 4: Make Your Decision (2 minutes)

- **GO**: Spec is solid; implement.
- **NO-GO**: Spec needs revision; don't start yet.
- **CONDITIONAL GO**: Start implementation; resolve flagged items in parallel.

---

## Key Metrics to Review

| Metric | Good | Caution | Red Flag |
|--------|------|---------|----------|
| **Completeness** | 90–100% items checked | 75–89% items checked | <75% items checked |
| **Gaps** | 0–2 critical gaps | 3–5 gaps | >5 critical gaps |
| **Ambiguities** | 0 unresolved ambiguities | 1–2 ambiguities | >2 unresolved ambiguities |
| **Peer Review** | Completed + verified | In progress | Not started |
| **Measurability** | Clear success criteria defined | Some criteria vague | Success criteria missing |
| **Time to Fix** | Issues fixable in <1 day | Issues need 2–3 days | Issues need >1 week |

---

## Decision Framework

### For Small/Low-Risk Features

**Example**: "Add export to CSV button on reporting page"

- **Timeline**: 2–3 days
- **Scope**: Clear and limited
- **Go threshold**: 70% of items checked; <2 gaps

**Decision**: **GO** if gaps are minor (e.g., "confirm file size limit")

### For Medium Features

**Example**: "Add multi-language support to entire platform"

- **Timeline**: 2–4 weeks
- **Scope**: Moderate complexity; affects multiple teams
- **Go threshold**: 85% of items checked; critical gaps resolved

**Decision**: **GO** if critical items checked; allow CONDITIONAL GO if 1–2 important items being resolved in parallel

### For Large/High-Risk Features

**Example**: "Rebuild authentication system with SSO integration"

- **Timeline**: 4–6 weeks
- **Scope**: High complexity; security implications; affects all users
- **Go threshold**: 95%+ of items checked; zero unresolved critical ambiguities

**Decision**: **NO-GO** unless nearly all items verified by both author and peer. CONDITIONAL GO only if major gaps are in "Phase 2" scope and Phase 1 is solid.

---

## Examples of Stakeholder Decisions

### Example 1: Clear GO

**Scenario**: "Add filter to user list page"

**Checklist Summary**:

- 42/45 items checked (93%)
- 2 gaps: "exact filter operators not specified", "performance target for 1M+ users not defined"
- 0 ambiguities
- Peer review: Completed, verified

**Stakeholder assessment**:

- Scope is clear
- Gaps are minor (can be resolved in code review)
- No timeline risk
- No security implications

**Decision**: ✅ **GO** — implement immediately. Resolve filter operators and performance target in first code review.

---

### Example 2: Clear NO-GO

**Scenario**: "Rebuild payment processing system"

**Checklist Summary**:

- 28/45 items checked (62%)
- 8 gaps including: "PCI-DSS compliance requirements unclear", "PCI certification timeline missing", "3rd-party payment provider selection not documented"
- 4 ambiguities including: "what happens if payment fails mid-transaction?"
- Peer review: Not completed

**Stakeholder assessment**:

- Scope is unclear (PCI compliance? Partner selection? Timeline?)
- Critical gaps in security/compliance
- No peer review yet
- Major financial/legal implications

**Decision**: 🛑 **NO-GO** — don't start until: (1) PCI requirements clear, (2) payment provider selected, (3) failure scenarios defined, (4) peer review complete. Timeline: 1–2 weeks to resolve.

---

### Example 3: CONDITIONAL GO

**Scenario**: "Add real-time notifications"

**Checklist Summary**:

- 40/45 items checked (89%)
- 2 gaps: "notification retry strategy for offline users", "notification persistence (how long to store?)"
- 1 ambiguity: "WebSocket vs. polling — decision pending"
- Peer review: Completed, flagged one important item

**Stakeholder assessment**:

- Core functionality is clear (notifications, delivery, display)
- Tech choice (WebSocket vs. polling) can be decided in week 1 of implementation
- Offline retry strategy is important but not launch-blocking (can be v1.1)
- Peer flagged same ambiguity — team needs 1–2 day decision window

**Decision**: ⏸️ **CONDITIONAL GO** — start implementation; resolve WebSocket vs. polling decision in first 2 days; defer offline retry strategy to post-launch. Blocks iteration only if decision takes >1 week.

---

## What to Do Next

### After GO Decision

1. **Notify team**: "Specification approved for implementation; proceed with development."
2. **Set timeline**: Confirm launch date; flag any at-risk ambiguities that were deferred.
3. **Monitor**: Check in weekly on flagged items; escalate if implementation hits unexpected gaps.

### After NO-GO Decision

1. **Notify team**: "Specification needs revision before implementation. Please address X, Y, Z before resubmission."
2. **Set revision timeline**: "Resubmit within X days; we'll gate-check again."
3. **Clarify what "ready" means**: If >3 gaps remain, are we asking for 100% resolution or 90% with parallel fixes?

### After CONDITIONAL GO Decision

1. **Flag items for parallel resolution**: "Start development; resolve WebSocket vs. polling by Friday; defer offline retry to v1.1."
2. **Assign owners**: Who makes the deferred decision? By when?
3. **Monitor closely**: If deferred items become blockers, escalate.

---

## Red Flags That Should Trigger NO-GO

- ❌ **No peer review**: Specification hasn't been validated by a second set of eyes.
- ❌ **Unclear scope**: Author, peer, or team members disagree on what's being built.
- ❌ **Missing measurability**: "Success" is subjective; no tests can be written.
- ❌ **Unknown dependencies**: "System needs to integrate with X" but X's API isn't documented.
- ❌ **Conflicting requirements**: Different sections contradict each other.
- ❌ **No timeline for ambiguities**: Flagged ambiguities have no decision date or owner.

---

## Green Lights That Support GO

- ✅ **Peer review complete**: A second set of eyes verified the specification.
- ✅ **Clear scope**: Author, peer, and stakeholders agree on what's being built.
- ✅ **Measurable success**: Definition of done is objective; tests can be written.
- ✅ **Known dependencies**: All integrations are named and dependencies are documented.
- ✅ **Consistent requirements**: No contradictions; terminology is uniform.
- ✅ **Clear timeline for gaps**: Any remaining gaps have an owner and a resolution date.

---

## Quick Reference: Your Role

| Activity | Your Role | Not Your Role |
|----------|-----------|---------------|
| Read executive summary | ✅ Do this | — |
| Review quality metrics | ✅ Do this | — |
| Ask risk/timeline questions | ✅ Do this | — |
| Make go/no-go decision | ✅ Do this | — |
| Write detailed requirements | — | ❌ Don't do this |
| Code review implementation | — | ❌ Don't do this |
| Debug edge cases | — | ❌ Don't do this |

Your job is to ensure the specification is clear enough for the team to implement with confidence. The team's job is to implement it correctly.

---

**Next**: Share your decision with the author and team. If GO or CONDITIONAL GO, implementation can begin. If NO-GO, the team will revise and resubmit. 🚀

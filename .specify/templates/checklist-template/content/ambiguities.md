# Ambiguities Dimension Items

Unclear areas, open questions, and unresolved decisions are identified and tracked.

## Definition

A specification addresses ambiguities when:

- All unresolved design decisions are documented with rationale
- Conflicting interpretations are identified and clarified
- Scope boundaries are clearly defined (in-scope vs. out-of-scope)
- Future extensions are deferred with clear separation
- Stakeholder sign-offs are obtained for all critical decisions

## Items (5 total)

### CHK-041-Ambiguities

**Question**: Are there unresolved design decisions?

**Guidance**: Create decision log documenting:

- Decision: what choice needs to be made
- Options: what alternatives exist
- Pros/cons of each option
- Constraints: budget, time, technical, organizational
- Recommendation: which option is preferred
- Status: pending, in review, approved, implemented
- Owner: who makes/made the decision
- Date: when decided

Template:
**Decision**: Database choice (SQL vs. NoSQL)
**Options**:

- Option A: PostgreSQL (relational, ACID transactions, mature)
- Option B: MongoDB (document, flexible schema, horizontal scale)

**Constraints**:

- Team expertise (we know SQL better)
- Performance requirements (millions of writes/day)
- Cost (both similar)

**Recommendation**: PostgreSQL (ACID guarantees needed for financial transactions)

**Status**: Pending approval from CTO

Document blocking decisions:

- Architecture choices (microservices vs. monolith)
- Technology stack (frontend framework, backend language)
- Data storage (relational vs. document, centralized vs. distributed)
- Integration approach (API vs. events vs. direct DB access)

**Success Criteria**:

- All major design decisions are documented
- Decision rationale is explicit
- Alternatives are considered
- Decisions are approved by stakeholders
- Implementation aligns with decision

---

### CHK-042-Ambiguities

**Question**: Are there conflicting interpretations?

**Guidance**: Document areas where team/stakeholders interpret requirements differently:

- Ambiguous wording (what does "user-friendly" mean exactly?)
- Different mental models (different understanding of the feature)
- Scope disagreements (is this in-scope or out-of-scope?)
- Priority conflicts (which feature comes first?)

For each conflicting interpretation:

- State the different interpretations
- Why the conflict exists (ambiguous wording, unstated assumptions)
- Proposed resolution
- Which interpretation was chosen and why
- Stakeholder agreement on resolution

Example:
**Conflict**: What is "fast enough" for page load?

- Team A: < 500ms  
- Team B: < 3 seconds
- Marketing: < 1 second for good UX
- Proposed resolution: p95 latency < 1 second, p99 < 3 seconds

**Success Criteria**:

- Conflicting interpretations are identified
- Resolution is documented with rationale
- All stakeholders agree on final interpretation
- No hidden assumptions remain

---

### CHK-043-Ambiguities

**Question**: Are scope boundaries clearly defined?

**Guidance**: Create scope document with:

- **In-Scope**: what IS included in this release/feature
- **Out-of-Scope**: what is NOT included (but might be future work)
- **Nice-to-Have**: desired but not required
- **Known Limitations**: what we know won't work perfectly

For each item, explain:

- Why it's in/out of scope
- When it might be reconsidered
- Impact of the decision

Example:
**In-Scope**:

- User registration and login
- Profile management
- View published articles

**Out-of-Scope** (Phase 2):

- Article commenting system
- User notifications
- Admin moderation tools

**Nice-to-Have**:

- Full-text search (use basic filtering if not ready)
- Social sharing (can add later)

**Known Limitations**:

- Search limited to exact title matching
- Comments disabled in beta
- Mobile app not available (web only initially)

Create scope change process:

- How are scope requests handled
- Who approves scope changes
- Impact on timeline/resources

**Success Criteria**:

- Scope is explicitly defined
- Out-of-scope items are documented with rationale
- Stakeholders agree on scope boundaries
- Scope changes are tracked and approved
- "No" is clearly communicated

---

### CHK-044-Ambiguities

**Question**: Are future extensions deferred to a clear timeline?

**Guidance**: Document:

- Phase 1 (MVP/Initial): minimal viable product
- Phase 2, Phase 3: planned future work
- Future considerations: ideas not yet scheduled

For each future feature/phase:

- Description of work
- Estimated effort/timeline
- Dependencies (what must complete first)
- Success metrics
- Owner/responsible team

Example:
**Phase 1 (Q1 2024)**:

- Basic user authentication
- Product catalog browsing
- Shopping cart

**Phase 2 (Q2 2024)**:

- Checkout and payment
- Order history
- User reviews and ratings

**Phase 3 (Q3 2024)**:

- Recommendation engine
- Wishlist
- Social sharing

**Future Considerations** (no timeline):

- AR product preview
- Voice search
- Blockchain verification

Maintain roadmap:

- What's planned for each release
- Timeline expectations
- Known constraints/dependencies
- Stakeholder approval for each phase

**Success Criteria**:

- Phases are clearly separated
- Phase 1 is minimal and achievable
- Future phases are planned
- Timeline is realistic
- Stakeholders understand the roadmap

---

### CHK-045-Ambiguities

**Question**: Are stakeholder sign-offs obtained?

**Guidance**: Document stakeholder approval:

- **Product Owner**: accepts requirements and success criteria
- **Engineering Lead**: confirms technical feasibility
- **Design Lead**: approves UX/visual design
- **Security**: approves security approach
- **Compliance/Legal**: approves data handling, compliance
- **Ops/DevOps**: confirms deployment approach
- **Finance/Budget Owner**: confirms cost/resource allocation

Create sign-off table:

| Stakeholder | Role | Approval Date | Sign-off | Notes |
|-------------|------|--------------|----------|-------|
| Alice | Product Owner | 2024-01-15 | ✅ Approved | Minor wording adjustment noted |
| Bob | Engineering Lead | 2024-01-16 | ✅ Approved | Will require 3-week sprint |
| Carol | Security | 2024-01-18 | ⏳ Pending | Requested encryption spec details |
| Dave | Ops | 2024-01-19 | ✅ Approved | Infrastructure ready |

For each outstanding approval:

- Who is it pending with
- What are they waiting for
- When is approval expected
- How will it block/delay work

Document decision record with approvals:

- Specification version
- Approval date
- List of approvers
- Any conditions/caveats in approval

**Success Criteria**:

- All critical stakeholders have approved
- Approvals are documented with dates
- Any conditions are acknowledged
- Disagreements are escalated and resolved
- Sign-offs are retained for audit trail

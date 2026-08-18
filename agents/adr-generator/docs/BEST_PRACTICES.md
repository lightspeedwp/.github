---
file_type: guide
title: ADR Generator — Best Practices
description: When and how to write effective architectural decision records
version: 1.0.0
created_date: 2026-08-18
last_updated: 2026-08-18
---

# ADR Best Practices

Guidelines for writing effective architectural decision records.

## When to Write an ADR

Write an ADR when you make a decision that:

✅ **WRITE AN ADR IF:**

1. **Affects multiple components or systems** — Decision impacts more than one area
   - Adopting a new authentication strategy
   - Changing data storage approach
   - Introducing a new framework or library

2. **Requires trade-off analysis** — Multiple options were considered
   - Monolith vs. microservices
   - SQL vs. NoSQL database
   - Sync vs. async processing

3. **Has long-term implications** — Decision will stick around
   - Architectural patterns
   - Technology choices
   - Data models

4. **Requires consensus** — Team needs to agree on direction
   - Major refactoring plans
   - New process adoption
   - Breaking API changes

5. **Is not obvious** — Future maintainers will ask "why?"
   - Unusual design choices
   - Constraints that drove decision
   - Lessons from past mistakes

❌ **DON'T WRITE AN ADR IF:**

- Decision is purely local (single function, class, or module)
- Decision is obvious or follows established patterns
- Decision is temporary and will be reversed soon
- Decision is already documented elsewhere
- Decision has no alternatives (only one option exists)

## ADR Structure

All ADRs follow this structure:

```
---
status: Proposed|Accepted|Deprecated|Superseded
date: YYYY-MM-DD
authors: [name1, name2]
relates_to: [adr-0001, adr-0002]
---

# [TITLE]: [Short description]

## Status

[Proposed|Accepted|Deprecated|Superseded]

## Context

[Background and problem description]

## Decision

[Chosen solution]

## Consequences

[Results and implications]

## Alternatives

[Other options considered and why rejected]
```

## Writing Guidelines

### 1. Title

**Good:** "Use PostgreSQL for relational data storage"  
**Bad:** "Database decision"

Titles should be:
- Specific and descriptive
- Start with a verb (Use, Adopt, Implement, etc.)
- Include the what, not why
- Searchable and unique

### 2. Status

**Valid values:**
- `Proposed` — New decision, awaiting feedback
- `Accepted` — Decision approved and in effect
- `Deprecated` — No longer in use, but kept for history
- `Superseded` — Replaced by newer decision (link with `superseded_by`)

Update status as decision progresses:

```
Proposed → Accepted → [Deprecated or Superseded]
```

### 3. Context

Explain the problem being solved:

- What was the situation?
- What constraints existed?
- What was the business or technical need?
- Why was this decision necessary now?

**Example:**

> Our current file-based logging is hitting performance limits at 10K+ events per second.
> We need a solution that scales horizontally and provides better queryability.
> Team needs decision by end of Q3 before user growth spikes.

### 4. Decision

State the chosen solution clearly:

- What was decided?
- How will it be implemented?
- What changes will occur?
- Who is responsible?

Be direct and specific.

**Example:**

> We will migrate to Elasticsearch for centralized log aggregation.
> Implementation phases: (1) set up ELK stack (2 weeks), (2) dual-write logs to both systems (1 week), (3) validate and switch fully (1 week).
> DevOps team owns implementation and monitoring.

### 5. Consequences

Describe both positive and negative impacts:

**Positive:**
- Better performance characteristics
- New capabilities enabled
- Reduced technical debt

**Negative:**
- New operational costs
- Learning curve for team
- Migration effort required

Be honest about trade-offs.

**Example:**

> **Positive:** 10-100x query performance improvement, full-text search capability, scales to hundreds of millions of events.
>
> **Negative:** Additional infrastructure cost (~$500/month), new DevOps tool to learn, migration effort (2-3 weeks), temporary dual-write complexity.

### 6. Alternatives

Document alternatives considered:

| Option | Pros | Cons | Rejected Because |
|--------|------|------|------------------|
| Keep file logging | No new tools | Doesn't scale | Performance not viable at 10K+ events/sec |
| CloudWatch | Managed service | AWS-specific vendor lock | Team wants flexibility |
| Splunk | Mature platform | Very expensive | Cost prohibitive for our scale |
| Elasticsearch | Scalable, queryable | Operational overhead | Accepted trade-off vs. other options |

Format alternatives as a comparison table for clarity.

## Status Lifecycle

### Proposed

New decision, awaiting team feedback.

```yaml
status: Proposed
date: 2026-08-18
authors: [ash]
```

Use this while gathering input from stakeholders.

### Accepted

Decision approved and implementation underway or complete.

```yaml
status: Accepted
date: 2026-08-18
authors: [ash]
```

Update to this status once team consensus is reached.

### Deprecated

Decision is no longer used but kept for historical context.

```yaml
status: Deprecated
date: 2026-08-18
authors: [ash]
relates_to: [adr-0005]
```

Use when the decision area is no longer relevant.

### Superseded

Decision replaced by a newer one.

```yaml
status: Superseded
date: 2026-08-18
authors: [ash]
superseded_by: adr-0010
```

Link to the new ADR that replaces this one.

## Template Selection Guide

Choose a template based on your decision type:

| Template | Use When | Complexity | Sections |
|----------|----------|-----------|----------|
| **Standard** | Major architectural decisions | High | All sections, detailed alternatives |
| **Lightweight** | Small decisions, quick iterations | Low | Minimal, essential sections only |
| **Security** | Security-related decisions | High | Security-focused, includes threat analysis |
| **Infrastructure** | Infrastructure/ops decisions | High | Deployment, scaling, disaster recovery |

### Standard Template

For significant architectural decisions with comprehensive analysis.

**When to use:**
- Framework/library adoption
- System architecture changes
- Major refactoring decisions
- API design decisions

**Sections:**
- Context
- Decision
- Consequences (positive & negative)
- Alternatives (detailed comparison)
- Related decisions
- Implementation notes

### Lightweight Template

For quick decisions where context is minimal.

**When to use:**
- Small scope decisions
- Team rapid-iteration decisions
- Quick policy choices
- Local optimizations

**Sections:**
- Context (brief)
- Decision (concise)
- Alternatives (brief)

### Security Template

For security-related decisions.

**When to use:**
- Authentication/authorization choices
- Encryption decisions
- Compliance decisions
- Security policy changes

**Additional sections:**
- Threat analysis
- Compliance implications
- Security review date

### Infrastructure Template

For infrastructure and operations decisions.

**When to use:**
- Database choices
- Deployment strategies
- Scaling decisions
- Disaster recovery plans

**Additional sections:**
- Deployment strategy
- Scaling considerations
- Disaster recovery
- Operational runbook

## Review and Approval

### Before Publishing

1. **Verify completeness** — All required fields present?
2. **Check context** — Is problem clear to someone unfamiliar?
3. **Validate alternatives** — Why was this chosen over others?
4. **Review consequences** — Are downsides acknowledged?
5. **Spell and grammar** — Professional language?

### Getting Feedback

1. **Post as draft** — Mark as `Proposed` status
2. **Notify stakeholders** — Share link with affected teams
3. **Request comments** — Use pull request for discussion
4. **Iterate based on feedback** — Address concerns, update document
5. **Mark as Accepted** — Once consensus reached

### Approval Workflow

Use GitHub CODEOWNERS for automatic review assignment:

```
agents/adr-generator/  @tech-leads
docs/adr/              @architects
```

## Common Mistakes to Avoid

❌ **Too vague**
- Bad: "Improve performance"
- Good: "Cache frequently accessed user data in Redis"

❌ **No context**
- Bad: "Decided to use microservices"
- Good: "Monolith became bottleneck at 100K concurrent users, needs horizontal scaling"

❌ **Ignoring trade-offs**
- Bad: "This is the best solution"
- Good: "This solution improves performance by 50% but adds operational complexity"

❌ **Too much implementation detail**
- Bad: 5-page technical specification
- Good: 1-page decision with link to implementation docs

❌ **Missing alternatives**
- Bad: No mention of other options
- Good: Clear comparison of 3-4 alternatives with pros/cons

❌ **Never updating status**
- Bad: ADR marked "Proposed" for 6 months
- Good: Update status as decision is accepted/deprecated/superseded

## Real Examples

### Example 1: Framework Adoption

```markdown
# Decision: Adopt React for frontend UI

## Status
Accepted

## Context
Current jQuery codebase is becoming difficult to maintain.
Page reloads are slow. Team growth requires more structured approach.
Customer demand for responsive mobile experience.

## Decision
Adopt React with TypeScript for all new frontend work.
Migrate existing jQuery components incrementally over 2 quarters.
Use component library to ensure consistency.

## Consequences
Positive: Better code organization, easier testing, improved performance.
Negative: Team ramp-up time (~2 weeks), build tooling complexity, larger bundle size.

## Alternatives
| Option | Pros | Cons |
|--------|------|------|
| Continue jQuery | No migration effort | Performance limits, hard to maintain |
| Vue.js | Gentler learning curve | Less mature ecosystem for our needs |
| Angular | Full framework | Steeper learning curve, heavy |
| React | Largest community, flexible, performant | More setup required |
```

### Example 2: Database Choice

```markdown
# Decision: Use PostgreSQL for relational data

## Status
Accepted

## Context
Growing data volume and complexity requires reliable ACID compliance.
Need for complex queries and joins across datasets.
Team has PostgreSQL expertise from previous projects.

## Decision
Standardize on PostgreSQL 15+ for all relational data.
Use for customer, transaction, and analytics data.
No exceptions without architecture team approval.

## Consequences
Positive: ACID guarantees, mature ecosystem, strong team knowledge.
Negative: Not ideal for unstructured data, requires operational expertise.

## Alternatives
| Option | Pros | Cons |
|--------|------|------|
| MySQL | Widely known | Less mature feature set |
| MongoDB | Flexible schema | No ACID in early versions, operational challenges |
| DynamoDB | Serverless, managed | Vendor lock-in, expensive at scale |
| PostgreSQL | Mature, reliable, team expertise | Requires operational knowledge |
```

## Maintenance

### Reviewing Old ADRs

Quarterly, review ADRs from >1 year ago:

1. Is this decision still valid?
2. Has it been superseded by newer decisions?
3. Should status be updated?
4. Is implementation still following this decision?

### Archiving Decisions

When ADR no longer applies:

1. Update status to `Deprecated` or `Superseded`
2. Add explanation comment
3. Link to replacement decision (if applicable)
4. Move to `docs/adr/archived/` (optional)

### Linking Related Decisions

Use `relates_to` for related ADRs:

```yaml
relates_to:
  - adr-0001  # Previous authentication decision
  - adr-0005  # Related API design decision
```

Use `supersedes` and `superseded_by` for decision replacements:

```yaml
supersedes: adr-0003
superseded_by: null  # This is the current decision
```

## Measuring Success

Track ADR adoption:

1. **Number of ADRs** — Increasing over time?
2. **Status distribution** — Most in Accepted status?
3. **Age of decisions** — How old before being updated?
4. **Team engagement** — Reviews and comments on drafts?
5. **Adherence** — Are decisions actually being followed?

## See Also

- [Installation Guide](INSTALLATION.md) — Setup ADR system
- [Configuration Reference](CONFIGURATION_REFERENCE.md) — All options
- [Architecture](ARCHITECTURE.md) — System design details
- [MADR Format](https://adr.github.io/madr/) — MADR standard reference

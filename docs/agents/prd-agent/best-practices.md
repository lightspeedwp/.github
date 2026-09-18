---
title: PRD Best Practices
description: Quality standards, structure guidelines, and patterns for effective PRDs
created: 2026-09-17
---

# PRD Best Practices

This guide outlines quality standards and patterns for creating PRDs that are clear, complete, and actionable.

## Core Principles

### 1. Be Specific, Not Vague

**❌ Vague**:

- "User needs a dashboard"
- "Fast performance"
- "Easy to use"
- "Robust error handling"

**✅ Specific**:

- "User needs a dashboard displaying 5 KPIs (revenue, churn, retention, MRR, LTV) with filters for date range, cohort, and segment"
- "Load time < 1 second on 50 Mbps connection; support 10K concurrent users"
- "Keyboard navigation works for all controls; contrast ratio ≥ 4.5:1"
- "All validation errors displayed within 2 seconds; clear error messages explain how to fix (not just 'Error: validation failed')"

### 2. Make Requirements Testable

Good acceptance criteria are verifiable by tests (automated or manual).

**❌ Not testable**:

- "User can easily access their profile"
- "The system should be secure"
- "Data is consistent"

**✅ Testable**:

- "User can click 'Profile' in the navigation bar, and the profile page loads within 2 seconds"
- "All API calls over HTTPS; passwords hashed with bcrypt; sessions expire after 24 hours inactive"
- "After updating a field in the database, all dependent records reflect the change within 5 seconds"

### 3. Name Your Assumptions

Every PRD rests on assumptions about users, constraints, and context. Name them.

**Good assumption list**:

- "Assumes users have 1 Mbps+ internet connection"
- "Assumes team has GitHub Pro licenses"
- "Assumes UI redesign completes by Q3"
- "Assumes third-party payment API is available and stable"

**Why**: Later, if an assumption breaks (e.g., users on slower connections, API outage), you can revisit the PRD and adjust.

### 4. Define Success Metrics

Success metrics let you measure whether the work succeeded (not just "shipped").

**Good metrics**:

- Quantifiable: "Reduce time-to-insights from 2 hours to 15 minutes"
- Observable: "90% of users complete onboarding in first session"
- Tied to business: "Increase revenue per user by 10%"
- Measurable at launch: "Average load time < 1s after optimization"

**Bad metrics**:

- "Users are happy" (unmeasurable)
- "System is reliable" (no target)
- "Improves team productivity" (too vague)

## Structure & Content

### Executive Summary

1 short paragraph. Should answer:

- What are we building?
- Why does it matter?
- Who benefits?

**Example**:
> We're building an automated design spec generator that reads PRDs and outputs Figma design specs. Today, design teams manually create specs from PRDs, taking 3 hours per project and introducing errors. Automating this will reduce handoff time from 3 days to 1 day and eliminate manual transcription errors.

### User Stories & Acceptance Criteria

**Format**:

```
As a [user type], I want [action], so that [benefit].

Acceptance Criteria:
1. [Testable condition] → [expected result]
2. [Testable condition] → [expected result]
3. [Testable condition] → [expected result]
```

**Example**:

```
As a Design Lead, I want to generate design specs from a PRD with a single click, 
so that I can hand off to developers faster.

Acceptance Criteria:
1. User opens a PRD document → system displays a "Generate Specs" button
2. User clicks "Generate Specs" → system processes the PRD and outputs a Figma file within 2 minutes
3. Generated specs include colors, typography, spacing, and component definitions → spec matches the PRD requirements (validated by design review)
4. Generation fails gracefully → user sees error message with suggested fixes
```

**Best practices**:

- 3–5 acceptance criteria per story (more = story is too big)
- Criteria should be verifiable, not implementation details
- Include both happy path and error cases
- Link to design mockups if available

### Requirements

Break down into:

**Functional Requirements** (what the system does):

- "User can login with email/password"
- "System saves user preferences to database"
- "API returns 404 for non-existent resources"

**Non-Functional Requirements** (how well it works):

- **Performance**: "Page load < 2s on 4G connection"
- **Scalability**: "Support 1M concurrent users"
- **Security**: "Encrypt data at rest (AES-256); authenticate all API calls"
- **Reliability**: "99.9% uptime SLA"
- **Accessibility**: "WCAG 2.2 AA compliant"
- **Compliance**: "GDPR-compliant; delete user data within 30 days of request"

### Data Model

If your feature involves data:

```
Entity: User
- id (UUID, primary key)
- email (string, unique)
- password_hash (string)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp, nullable)

Relationships:
- User → many Orders (one user can have many orders)
- User → many Preferences (one user, one preferences record)
```

For complex features, include:

- Relationships (1-to-many, many-to-many)
- State transitions (e.g., Order: draft → submitted → completed)
- Indexing requirements ("email should be indexed for fast login lookups")

### Out-of-Scope Statement

Explicitly list what you're NOT doing.

**Example**:
> Out of scope for v1:
>
> - Mobile app (desktop web only)
> - Real-time collaboration (single-user editing)
> - Offline mode (requires internet connection)
> - Multi-workspace support (single workspace per account)

**Why**: Prevents scope creep and sets expectations clearly.

### Assumptions & Dependencies

**Assumptions** (things you're taking for granted):

- "Assumes third-party payment provider (Stripe) is stable"
- "Assumes all users have modern browsers (last 2 versions)"
- "Assumes design system is finalized before development starts"

**Dependencies** (other work this depends on):

- "Depends on user authentication system (User#123)"
- "Requires Figma API v2.0"
- "Requires GraphQL API to be deployed first"

### Risks & Mitigations

For each significant risk:

```
Risk: Third-party API rate limits hit; spec generation fails
→ Mitigation: Implement queue system with retry logic; monitor API usage; contact vendor before hitting limits

Risk: Figma schema changes; our spec generation breaks
→ Mitigation: Version our Figma integration against API v2.0; add automated tests to detect breaking changes
```

## Common Patterns

### Pattern: Feature Flags

If you're shipping a feature gradually:

```
Success Criteria:
- Feature is hidden behind a feature flag by default
- Flag can be enabled for 10% of users; ship incrementally to 100%
- Metrics dashboard shows adoption, error rate, performance by flag state
- Flag can be killed instantly if critical issues emerge
```

### Pattern: Backwards Compatibility

If your change might break existing integrations:

```
Requirements:
- Old API endpoints remain functional; return 200 OK with deprecation warning header
- New endpoints are preferred, but old ones work for 6 months (deprecation window)
- Clear migration guide for teams using old endpoints
```

### Pattern: A/B Testing

If you're comparing two approaches:

```
Success Criteria:
- Version A is control; Version B is treatment
- Sample size ≥ 1000 users per variant
- Measure: time-to-completion, error rate, user satisfaction
- Declare winner after 2 weeks if result is statistically significant (p < 0.05)
```

## Quality Checklist

Before finalizing, review:

- [ ] **Clarity**: Can a new team member read this and understand what's being built?
- [ ] **Completeness**: Are there TODOs or placeholders? If so, not done.
- [ ] **Specificity**: Are requirements specific or vague? ("Dashboard" vs. "Dashboard with 5 KPIs")
- [ ] **Testability**: Can you write tests for every acceptance criterion?
- [ ] **Estimability**: Can engineering estimate effort (story points, days) from this?
- [ ] **Scope**: Is it focused (MVP) or does it have scope creep?
- [ ] **Stakeholder alignment**: Have key stakeholders reviewed and approved?
- [ ] **Assumptions**: Are unstated assumptions made explicit?
- [ ] **Constraints**: Are technical/timeline/resource constraints documented?
- [ ] **Success metrics**: Can you measure whether this succeeded after launch?
- [ ] **Sign-off**: Is the PRD approved by PM, tech lead, and product leadership?

## Anti-Patterns

| Anti-Pattern | Why It's Bad | Better Approach |
|---|---|---|
| "Make it fast" without targets | Engineers don't know what "fast" means; can't verify if they succeeded | "< 1s load time on 50 Mbps connection" |
| Mixing implementation details with requirements | Constrains engineering creativity; may be technically impossible | "User can save PRD as Markdown file" not "store as SHA-256 hash in S3" |
| No acceptance criteria | QA doesn't know when to ship; ambiguous | Every user story has ≥2 verifiable criteria |
| "Nice-to-haves" mixed with MVP | Scope creep; team doesn't know what's critical | "MVP: [features]"; "Phase 2: [nice-to-haves]" |
| Assuming team knows context | New team members are lost | Explain the problem, users, and why this matters |
| No success metrics | Can't measure whether the work succeeded | "Reduce average time-to-X from Y to Z" |
| Undocumented constraints | Team discovers constraints mid-project; schedule slips | "Must integrate with legacy API (budget 1 week)" |

## Examples of Strong vs. Weak PRDs

### Example 1: Feature Flag Management

**Weak**:
> We need a feature flag system. It should be easy to use and performant.

**Strong**:
> **Feature Flag Management**
>
> As a DevOps engineer, I want to toggle feature flags without deploying code, so that I can quickly enable/disable features in production.
>
> Requirements:
>
> - Feature flags stored in database (PostgreSQL); flags are boolean or string
> - API endpoint: GET `/flags/{name}` returns flag value (< 100ms response)
> - UI dashboard for flag management (create, update, delete, toggle)
> - Audit log: record who changed which flag and when
> - Performance: 99.99% uptime; support 1000 API requests/sec
>
> Acceptance Criteria:
>
> 1. User creates flag "feature_new_dashboard" in UI → flag is queryable within 1 second
> 2. User toggles flag on → application respects the new state within 1 second
> 3. Flag update is logged with timestamp, user, old value, new value → audit trail is complete
> 4. API call < 100ms even during 10x traffic spike → meets performance SLA

## Writing Tips

- **Use active voice**: "System validates input" not "Input should be validated"
- **Use precise verbs**: "Create" vs. "make"; "display" vs. "show"
- **Use examples**: "Like Figma's auto-layout system" makes it concrete
- **Link related documents**: "See Design System v2.1 for color palette"
- **Use tables for structured info**: Requirements tables, acceptance criteria tables, etc.
- **Use code blocks for technical specs**: API schemas, database queries, configuration examples
- **Number lists for steps**: Workflows, processes (numbered for clarity)
- **Bullet lists for options**: Requirements, assumptions, risks (unordered)

---

**Last Updated**: 2026-09-17  
**Quality Focus**: Clarity, specificity, testability, estimability  
**Questions?** See [FAQ](./faq.md)

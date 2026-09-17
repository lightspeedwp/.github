# Integration Reviewer Checklist Guidance

**Role**: Integration Reviewer (Dependency Manager, Architect, Technical Lead)  
**Time**: ~30 minutes  
**Goal**: Verify dependency alignment, cross-project impacts, and parallel work capability

---

## Introduction

As an integration reviewer, you're checking whether this specification aligns with dependencies, doesn't break parallel work streams, and integrates cleanly with other systems and projects.

The 8-dimensional Requirements Quality Framework you're using:

- **Completeness**: Are all integration points accounted for?
- **Clarity**: Are dependencies explicitly named and versioned?
- **Consistency**: Does this align with existing standards and patterns?
- **Measurability**: Can dependency contracts be verified?
- **Scenario Coverage**: Are cross-system error scenarios covered?
- **Edge Cases**: What happens when dependent systems fail or are slow?
- **Dependencies**: Assumptions and integrations are explicit
- **Ambiguities**: Are there unresolved integration questions?

---

## How to Use This Checklist

### Step 1: Map the Dependencies (5 minutes)

Create a dependency map for this specification:

1. **External systems**: Which other services/systems does this depend on?
2. **Internal components**: Which other projects or teams are affected?
3. **Data dependencies**: Databases, APIs, message queues involved?
4. **Team dependencies**: Which teams' code/decisions are needed?

Document any dependencies that are **unclear, undocumented, or unaligned** with other projects.

### Step 2: Review Each Checklist Item (20 minutes)

For each item, verify:

1. Does the specification address this dependency/integration concern?
2. Is the dependency clearly named (not vague like "requires database")?
3. Is the version/API contract specified (not "any version")?
4. Does it align with other active projects?
5. Are there conflicts with parallel work streams?

Mark your assessment:

- ✅ **Verified** — Dependency is clear and aligned.
- ⬜ **Unverified** — Can't confirm alignment; needs investigation.
- 🔴 **Gap** — Dependency is missing, unclear, or conflicting.
- ⚠️ **Caution** — Dependency timing or versioning needs attention.
- ✨ **Well-aligned** — Integrates cleanly; supports parallel work.

### Step 3: Cross-Project Alignment Check (3 minutes)

1. Does this specification depend on work from project X? Is project X on schedule?
2. Will this specification's work impact project Y's timeline? Is Y aware?
3. Are API versions aligned across dependent projects?
4. Can this work proceed in parallel with dependent projects, or is it blocked?

### Step 4: Summarise Integration Status (2 minutes)

- **Fully aligned**: Dependencies clear, versions matched, no blockers.
- **Mostly aligned**: Minor version mismatches or timing gaps; resolvable.
- **At risk**: Major dependency misalignment; needs stakeholder coordination.
- **Blocked**: Critical dependency missing or unresolved.

---

## Key Integration Questions

### Dependency Clarity

- [ ] Are all external system dependencies explicitly named (not generic like "API" or "database")?
- [ ] Is the service/system version specified (e.g., "PostgreSQL 12+", "Stripe API v3")?
- [ ] Is the integration method specified (REST, GraphQL, gRPC, Webhooks, etc.)?
- [ ] Are authentication/access requirements documented (API keys, OAuth, VPN)?
- [ ] Is the SLA/availability assumption documented (99.9% uptime? Offline tolerance)?

### Cross-Project Alignment

- [ ] Does another active project depend on this work? Is timeline aligned?
- [ ] Does this work depend on another active project? Are they on schedule?
- [ ] Are we depending on a service/system someone else is building? Is their timeline locked?
- [ ] Could this work block another team's implementation? How?
- [ ] Can parallel projects integrate without waiting for this to complete?

### Integration Patterns

- [ ] Does this follow our existing integration patterns (API style, error handling, retry logic)?
- [ ] Is the pattern documented for this service, or should we document it?
- [ ] Are API versions compatible with consuming projects?
- [ ] Does this require breaking changes to existing APIs or contracts?

### Failure and Edge Cases

- [ ] What happens if a dependent service is unavailable or slow?
- [ ] Is a circuit breaker or fallback strategy specified?
- [ ] What's the retry strategy (immediate, exponential backoff, etc.)?
- [ ] Is graceful degradation defined (serve stale data? Limited functionality?)?
- [ ] How are transactional guarantees handled across service boundaries?

### Data and API Contracts

- [ ] Are request/response schemas documented (JSON Schema, OpenAPI, GraphQL)?
- [ ] Are backward compatibility expectations clear (can old clients still work)?
- [ ] Are deprecation policies specified (how long are old APIs supported)?
- [ ] Is data ownership clear (who owns updates, deletions, syncing)?

---

## Integration Risk Assessment

### Low Risk

- **Single dependency**: Integrates with one external system; dependency is stable.
- **Clear contract**: API/service version and interface are documented.
- **No parallel blockers**: Can proceed independently; doesn't block other teams.
- **Known patterns**: Follows existing integration patterns in your organisation.

**Recommendation**: ✅ **APPROVED** — Proceed; note dependency in project tracking.

### Medium Risk

- **Few dependencies**: Integrates with 2–3 systems; one or two may be unstable or undocumented.
- **Partial documentation**: API version specified, but contract details unclear.
- **Minor blockers**: May slightly impact other teams' timeline, but workarounds exist.
- **New pattern**: New integration pattern or tool; requires validation.

**Recommendation**: ⚠️ **CONDITIONAL** — Proceed with dependency verification plan. (Timeline: 1–2 days)

### High Risk

- **Many dependencies**: Integrates with 4+ systems; unclear alignment.
- **Undocumented contract**: Service exists but API/version not specified.
- **Major blockers**: Blocks other teams' work; timeline dependency unclear.
- **Novel pattern**: Unprecedented integration; requires architecture review.

**Recommendation**: 🛑 **ESCALATE** — Don't start implementation until dependencies are clarified and cross-team alignment confirmed.

---

## Examples

### Example 1: Low-Risk Integration

**Scenario**: "Add email notification feature; send via SendGrid API"

**Dependency Map**:

- External: SendGrid API v3
- Internal: User service (for email address)
- Data: User table (email field)

**Verification**:

- ✅ SendGrid API v3 is stable and documented
- ✅ User service already provides email addresses
- ✅ No parallel work blocked
- ✅ Error handling (SendGrid down) can use local queue + retry

**Assessment**:

- **Clear**: "Use SendGrid API v3; authenticate with API key stored in env"
- **Aligned**: User service ready; SendGrid contract documented
- **Safe**: Async queue provides resilience if SendGrid is slow/unavailable

**Recommendation**: ✅ **APPROVED** — No integration blockers. Proceed.

---

### Example 2: Medium-Risk Integration

**Scenario**: "Add real-time sync to mobile app; data synced from backend API"

**Dependency Map**:

- External: Backend API (currently being redesigned)
- Internal: Mobile app team, backend team
- Data: Sync state, conflict resolution

**Verification**:

- ⚠️ Backend API being redesigned; final contract unclear
- ⚠️ Conflict resolution strategy not specified (what if offline user and server both update?)
- ✅ Mobile team aware and aligned
- ⬜ Offline sync retry strategy exists, but offline recovery not fully documented

**Assessment**:

- **Caution**: Backend API contract needs finalization
- **Alignment**: Teams are coordinating, but API timeline uncertain
- **Risk**: If API redesign slips, mobile work blocks

**Recommendation**: ⚠️ **CONDITIONAL** — Proceed with mobile work in parallel; lock Backend API contract within 1 week. Assign owner for conflict resolution strategy. Monitor for timeline misalignment.

---

### Example 3: High-Risk Integration

**Scenario**: "Migrate to new data warehouse; replace analytics queries across 5 services"

**Dependency Map**:

- External: New data warehouse (Snowflake); not yet fully integrated
- Internal: 5 teams (reporting, analytics, operations, billing, support)
- Data: 50+ ETL pipelines; schema migration required

**Verification**:

- 🔴 New data warehouse integration not documented
- 🔴 ETL migration timeline unclear
- 🔴 Query compatibility between old (MySQL) and new (Snowflake) not verified
- 🔴 Blocks all 5 dependent teams' work
- ⚠️ Rollback strategy not defined if migration fails

**Assessment**:

- **Unclear**: "Use new data warehouse" but Snowflake schema not documented
- **Misaligned**: 5 teams affected; migration timeline not confirmed with all
- **Blocked**: All dependent analytics work blocked until migration complete

**Recommendation**: 🛑 **ESCALATE** — This is a cross-team initiative, not a single feature. Requires:

1. Data warehouse readiness assessment (schema, performance, security)
2. Cross-team alignment meeting (5 teams + data team)
3. Phased migration plan (what migrates first? What's the rollback plan?)
4. Risk mitigation (dual-write strategy? Shadow mode?)

Do not start feature development until warehouse is production-ready and cross-team plan is locked.

---

## Dependency Documentation Checklist

For each identified dependency, verify:

- [ ] **System/service name** — Not generic ("API") but specific ("Stripe API", "Auth0", "RabbitMQ")
- [ ] **Version** — "Stripe API v3", "PostgreSQL 12+", "Node.js 16+"
- [ ] **Interface** — How is it accessed? (REST, GraphQL, SDK, direct database connection)
- [ ] **Authentication** — How is access granted? (API key, OAuth, certificate, VPN)
- [ ] **SLA/Availability** — What's the expected uptime? Tolerance for brief outages?
- [ ] **Data ownership** — Who owns the data? Can we cache/replicate it?
- [ ] **Failure handling** — What happens if this dependency is down or slow?
- [ ] **Deprecation timeline** — How long is this version supported?
- [ ] **Cost/licensing** — Any cost or licensing implications?

---

## Parallel Work Assessment

**Can this work proceed in parallel with dependent projects?**

Answer yes if:

- ✅ Dependencies are stable and documented
- ✅ API contracts are locked (no expected breaking changes)
- ✅ Dependent projects don't block this project's timeline
- ✅ Integration can be mocked/stubbed for early testing

Answer no if:

- ❌ Dependent project's timeline is unclear
- ❌ API contract is still being designed
- ❌ This project's completion blocks dependent projects
- ❌ A critical dependency is incomplete or undocumented

---

## What to Do After Review

### If Fully Aligned (✅ APPROVED)

1. **Document dependencies** in project tracking (Jira, Linear, etc.)
2. **Add to project roadmap**: Note which other projects' timelines matter
3. **Monitor for changes**: If dependent project timelines shift, alert this team

### If Mostly Aligned (⚠️ CONDITIONAL)

1. **Create dependency resolution task**: Assign owner; set deadline
2. **Maintain alignment with dependent teams**: Weekly check-ins if timeline-dependent
3. **Plan fallback**: What if dependent project slips by 1 week? 2 weeks?
4. **Unblock critical path**: Identify what can proceed in parallel vs. what must wait

### If At Risk (🛑 ESCALATE)

1. **Escalate to architecture/leadership**: This isn't a single-team decision
2. **Schedule cross-team meeting**: Align all dependent projects on timeline
3. **Create dependency resolution plan**: Step-by-step, with owners and dates
4. **Gate implementation**: Don't start until critical blockers are resolved

---

## Integration Checklist Summary

After review, provide stakeholders with:

```
## Integration Review Summary

- **Dependencies identified**: X (list each)
- **Fully aligned**: Y (e.g., "SendGrid, User Service")
- **Conditional/caution**: Z (e.g., "Backend API v3.1 timeline uncertain")
- **At risk**: N (e.g., "New data warehouse not yet production-ready")

**Recommendation**: [APPROVED / CONDITIONAL / ESCALATE]
**Risk level**: [Low / Medium / High]
**Timeline impact**: [No blocker / Minor delay possible / Major blocker]

**Next steps**:
1. [Action item 1, owner, deadline]
2. [Action item 2, owner, deadline]
3. [Action item 3, owner, deadline]
```

---

**Next**: Share your review with the team. Flag any dependency blockers; coordinate with dependent teams on timeline alignment. 🚀

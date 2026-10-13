# Dependencies Dimension Items

All internal, external, and implicit dependencies are documented.

## Definition

A specification documents dependencies when:

- All third-party service dependencies are identified and documented
- Data dependencies (sources, transformations, freshness) are specified
- System dependencies (hardware, OS, libraries) are documented
- Assumptions about user knowledge and capability are explicit
- External compliance requirements are documented
- Scheduling and ordering dependencies are specified

## Items (6 total)

### CHK-035-Dependencies

**Question**: Are all third-party service dependencies documented?

**Guidance**: For each external service, document:

- Service name and vendor
- Purpose (what does it do for us)
- API endpoint and version
- Authentication method (API key, OAuth, basic auth)
- Rate limits and quotas
- Cost structure and billing
- SLA and uptime guarantee
- Fallback/failover strategy
- End-of-life date (when service will be discontinued)
- Alternative services (if available)

Create a dependencies inventory:

| Service | Endpoint | Auth | Rate Limit | Cost | SLA | Fallback |
|---------|----------|------|-----------|------|-----|----------|
| Stripe | api.stripe.com | API Key | 100/sec | $0.029 per transaction | 99.9% | Manual payment |

Document integration points:

- Which features depend on this service
- Impact if service is unavailable
- How often it's called

**Success Criteria**:

- All third-party services are listed
- Integration points are documented
- SLAs and rate limits are specified
- Fallback strategies exist
- Cost implications are clear

---

### CHK-036-Dependencies

**Question**: Are data dependencies documented?

**Guidance**: Document:

- Data sources (where data comes from)
- Data flow (transformation, enrichment)
- Data freshness requirements (how often updated)
- Dependencies on upstream systems
- Data quality expectations (what's guaranteed vs. what's best-effort)

For each data dependency specify:

- Source system name
- Data extraction frequency (real-time, hourly, daily)
- Acceptable delay (if 2 hours behind, feature works?)
- Failure handling (stale data acceptable? use cached? fail?)
- Data format and schema
- Volume and growth expectations

Example:
"Customer data sourced from CRM system. Updated hourly via webhook. If > 6 hours stale, alert ops. Display 'data may be outdated' message to users. If > 24 hours stale, disable features requiring customer data."

**Success Criteria**:

- Data sources are identified
- Update frequency is specified
- Staleness tolerance is documented
- Behavior for missing/stale data is defined
- Volume expectations are specified
- Dependencies between data elements are clear

---

### CHK-037-Dependencies

**Question**: Are system dependencies specified?

**Guidance**: Document:

- Operating system requirements (Linux, Windows, macOS)
- Required software and versions (Node.js, Python, databases)
- Hardware requirements (CPU, memory, disk, network)
- Browser support (which browsers/versions work)
- Library and framework versions
- Compatibility matrix (what works with what)

For each dependency specify:

- Minimum version (oldest version that works)
- Recommended version (what we test with)
- Maximum version (issues with newer versions?)
- Security implications (is version outdated and insecure?)

Example:
"Node.js: minimum 16.13.0, recommended 18.x LTS, avoid 17.x (breaking changes). Requires npm 8+, yarn 3.2+, pnpm 7.0+."

Also document:

- Operating system version requirements
- Database requirements (PostgreSQL 12+, MySQL 8.0+)
- Container requirements (Docker, Kubernetes versions)

**Success Criteria**:

- OS and platform requirements are specified
- Software version requirements are documented
- Compatibility matrix exists
- Deprecation timelines are noted
- Testing against version matrix is performed

---

### CHK-038-Dependencies

**Question**: Are assumptions about user knowledge documented?

**Guidance**: Document what users are assumed to know:

- Technical skill level (non-technical, intermediate, advanced)
- Domain knowledge (understanding of business concepts)
- Language proficiency (English only? multi-language?)
- Accessibility requirements (vision, hearing, mobility, cognitive)
- Device familiarity (mobile-first, desktop-focused)

Examples:

- "Assumes users are comfortable with Excel and CSV files"
- "Assumes English language proficiency at B1 level (intermediate)"
- "Assumes users have JavaScript enabled in browser"
- "Assumes users have Google account for authentication"
- "Assumes users are technical (not suitable for non-technical users)"

For each assumption:

- Who is it an assumption about
- What knowledge/capability is assumed
- Impact if assumption is wrong (feature doesn't work? poor UX?)
- Mitigation strategy (training, documentation, auto-detection)

**Success Criteria**:

- User knowledge assumptions are explicit
- Impact of each assumption is documented
- Mitigation strategies exist
- Documentation addresses assumption gaps
- Onboarding helps new users

---

### CHK-039-Dependencies

**Question**: Are external compliance requirements documented?

**Guidance**: Document:

- Regulatory compliance (GDPR, HIPAA, SOC2, PCI-DSS)
- Industry standards (ISO27001, NIST, OWASP)
- Data protection laws (CCPA, LGPD, UK Data Protection Act)
- Accessibility requirements (WCAG, ADA, EN 301 549)
- Export controls (EAR, ITAR if applicable)
- Contractual obligations (customer contracts, SLAs)

For each requirement specify:

- What is required (e.g., "GDPR Right to be Forgotten")
- Scope (who/what is affected)
- Implementation approach
- Audit/compliance verification method
- Responsibility (product team, legal, ops)

Create compliance matrix:

| Requirement | Scope | Implementation | Audit | Responsible |
|-------------|-------|-----------------|-------|-------------|
| GDPR RTBF | All EU users | User deletion workflow | Annual | Product + Legal |
| HIPAA Encryption | Health data | AES-256 at rest | Annual + Pen test | Engineering |
| SOC2 Type II | All infrastructure | Access controls, logging | Annual | Ops + Security |

**Success Criteria**:

- Applicable compliance requirements are listed
- Each requirement has implementation strategy
- Audit procedures are defined
- Responsibility is assigned
- Timelines for compliance are specified

---

### CHK-040-Dependencies

**Question**: Are scheduling/ordering dependencies specified?

**Guidance**: Document:

- Sequence requirements (what must happen before what)
- Timing constraints (how long between events)
- Parallel vs. sequential operations
- Blocking operations (must complete before next step)
- Release/deployment dependencies (feature flags, database migrations)

Create dependency diagrams or specification:

- "Step 1: Create user account (blocking)"
- "Step 2: Send verification email (parallel OK, but required for activation)"
- "Step 3: User verifies email (blocking for 'verified user' features)"
- "Step 4: User completes profile (required for 'complete profile' workflow)"

For each ordering dependency:

- Why is ordering required?
- What's the consequence if order is violated?
- Can operations be parallelized?
- What's the performance impact?

Database migrations example:
"Migration 1: Create users table (required, run first). Migration 2: Add email_verified column (can run any time). Migration 3: Backfill email_verified from legacy system (required before cutover)."

**Success Criteria**:

- Sequence/ordering dependencies are documented
- Blocking vs. non-blocking operations are clear
- Parallelization opportunities are identified
- Deployment sequence is specified
- Database migration order is documented

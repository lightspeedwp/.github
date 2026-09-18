# Domain Variants Guide

> How to choose and use domain-specific Requirements Quality checklists

**Purpose**: Help specification authors select the appropriate checklist variant for their domain

**Available Variants**:

- **UX Variant**: For user-facing features, UI/interaction design, accessibility
- **API Variant**: For APIs, data contracts, backend services, integrations
- **Security Variant**: For security-sensitive features, compliance requirements, data protection
- **Performance Variant**: For performance-critical features, scalability, optimization

---

## Base Checklist vs. Variants

### Base Checklist (40-45 items)

The **Base Checklist** covers 8 fundamental quality dimensions applicable to ANY specification:

1. **Completeness** (5-6 items): All requirements documented
2. **Clarity** (5-6 items): Requirements unambiguous, measurable
3. **Consistency** (4-5 items): Requirements don't conflict
4. **Measurability** (4-5 items): Success criteria testable
5. **Scenario Coverage** (5-6 items): Edge cases and workflows documented
6. **Edge Cases** (5-6 items): Boundary conditions handled
7. **Dependencies** (4-5 items): External requirements specified
8. **Ambiguities** (5-6 items): Unclear areas identified and resolved

**Use base checklist when**: General-purpose specification with no dominant domain focus.

### Domain Variants (58-63 items each)

Each variant **adds 15-20 domain-specific items** to the base checklist, extending coverage for specialized requirements:

**UX Variant** (+18 items):

- Error state handling, visual hierarchy, interaction states
- Accessibility compliance, responsive design, zero states
- Real-time updates, loading states, truncation, permission UI
- Design system consistency, interaction semantics

**API Variant** (+18 items):

- Endpoint inventory, edge cases in API behavior
- Request/response schemas, error response formats
- Rate limiting and throttling, backwards compatibility
- Concurrent updates, data serialization, pagination

**Security Variant** (+18 items):

- Threat model and attack vectors, data classification
- Authentication and credential management, encryption
- Security headers and HTTP protections, vulnerability management
- Access control and authorization, compliance requirements
- Breach response and incident management, third-party vendors

**Performance Variant** (+18 items):

- Performance targets and resource constraints
- Load testing scenarios, caching strategy
- Monitoring and observability, database query performance
- Scalability and horizontal scaling, degradation strategies
- External service performance, SLO definition

---

## How to Choose Your Variant

### Decision Tree

```
START
├─ Does your spec include UI/UX/interaction design?
│  └─ YES → Consider UX Variant (see UX checklist below)
│
├─ Does your spec describe APIs, backends, or data contracts?
│  └─ YES → Consider API Variant (see API checklist below)
│
├─ Does your spec handle sensitive data, compliance, or security?
│  └─ YES → Consider Security Variant (see Security checklist below)
│
├─ Does your spec have performance targets or scalability needs?
│  └─ YES → Consider Performance Variant (see Performance checklist below)
│
└─ NO domain-specific focus?
   └─ Use Base Checklist (8 dimensions, ~45 items)
```

### Domain Focus: When to Use Each Variant

#### 🎨 UX Variant

**Use when your specification includes**:

- ✅ UI/UX design requirements
- ✅ User workflows or user journeys
- ✅ Interaction patterns (buttons, forms, navigation)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessibility requirements (WCAG, ADA, inclusive design)
- ✅ Visual design or branding requirements

**Example specifications**:

- "Product detail page redesign"
- "Mobile app for inventory management"
- "Admin dashboard with dark mode"
- "Checkout flow optimization"

**Why use UX variant**:

- Base checklist doesn't cover interaction states, error handling in UI, responsive design
- UX items ensure visual consistency, accessibility compliance, user workflows documented
- Reduces rework from design not matching requirements
- Validates user-facing quality before development

**Skip UX variant if**:

- ❌ Backend-only API (use API variant)
- ❌ Infrastructure or ops specifications
- ❌ No UI component (e.g., SDK, library)

---

#### 🔌 API Variant

**Use when your specification includes**:

- ✅ REST APIs, GraphQL schemas, or gRPC services
- ✅ Data contracts (request/response formats)
- ✅ Backend services or microservices
- ✅ Third-party integrations
- ✅ Webhook or event-driven architecture
- ✅ Database or data storage requirements

**Example specifications**:

- "User authentication API v2"
- "Product catalog GraphQL schema"
- "Payment processing webhook"
- "Real-time notification service"

**Why use API variant**:

- Base checklist doesn't cover endpoint documentation, rate limiting, backwards compatibility
- API items ensure contracts are explicit (prevent integration surprises)
- Validates error handling, idempotency, performance targets
- Reduces support burden from poorly documented APIs

**Skip API variant if**:

- ❌ Frontend-only (no APIs exposed, use UX variant)
- ❌ Internal-only code (not consumed by other systems)
- ❌ Hardware/firmware specifications

---

#### 🔒 Security Variant

**Use when your specification includes**:

- ✅ Sensitive data (PII, payment info, health records, trade secrets)
- ✅ Compliance requirements (GDPR, HIPAA, PCI-DSS, SOC 2, ISO 27001)
- ✅ Authentication or authorization
- ✅ Encryption requirements
- ✅ Access controls
- ✅ Third-party vendor integrations with data sharing

**Example specifications**:

- "Customer data platform with GDPR compliance"
- "Healthcare patient portal with HIPAA requirements"
- "Payment processing system with PCI-DSS"
- "Multi-tenant SaaS with role-based access"

**Why use Security variant**:

- Base checklist doesn't cover threat modeling, data classification, breach response
- Security items ensure compliance requirements met before development
- Validates access control, encryption, audit logging, incident response
- Reduces risk of security breaches, compliance violations, fines

**Skip Security variant if**:

- ❌ No sensitive data handled
- ❌ Internal tools with no external exposure
- ❌ Public information (marketing content, documentation)

---

#### ⚡ Performance Variant

**Use when your specification includes**:

- ✅ Performance targets (latency, throughput SLOs)
- ✅ Scalability requirements (concurrent users, RPS)
- ✅ High-traffic systems or growth expectations
- ✅ Resource constraints (CPU, memory, disk, network)
- ✅ Real-time requirements (live data, streaming)
- ✅ Cost constraints (must minimize resource consumption)

**Example specifications**:

- "Real-time dashboard for 10,000+ concurrent users"
- "E-commerce search with <100ms latency target"
- "Live stream processing at 10 Mbps throughput"
- "Video encoding service with cost optimization"

**Why use Performance variant**:

- Base checklist doesn't cover performance targets, load testing, caching strategy
- Performance items ensure scalability planned before development
- Validates SLOs, monitoring, degradation strategies
- Reduces post-launch surprises (slow features, cost overruns, outages under load)

**Skip Performance variant if**:

- ❌ Internal batch jobs (performance not critical)
- ❌ Low-traffic features or one-time operations
- ❌ No explicit performance targets
- ❌ Performance achievable with standard infrastructure

---

## Combination: Multiple Variants

Many specifications need **multiple variants**. Use all that apply:

### Example 1: E-Commerce Platform

A product search and checkout feature might need:

- **UX Variant** (search UI, checkout form, error states)
- **API Variant** (search API, payment API, integration with payment provider)
- **Performance Variant** (search <200ms latency, handle 1000 concurrent shoppers)
- **Security Variant** (payment info encryption, PCI-DSS compliance)

→ **Use all 4 variants** (72 combined items from base + all variants)

### Example 2: Real-Time Analytics Dashboard

An internal analytics dashboard might need:

- **UX Variant** (dashboard layout, real-time updates, interactive charts)
- **Performance Variant** (data refresh <5 seconds, 1000+ concurrent users)

→ **Use base + UX + Performance variants** (55 combined items)

### Example 3: Internal API Service

A microservice for customer data might need:

- **API Variant** (endpoint specs, error formats, rate limiting)
- **Security Variant** (access control, PII encryption, audit logging)

→ **Use base + API + Security variants** (60 combined items)

### Example 4: Marketing Website

A static website with contact form might only need:

- **Base checklist** (no specialized domain)

→ **Use base checklist only** (40-45 items)

---

## How Variants Add Domain Focus

Each variant **extends the base checklist** without duplication. Here's how:

### Dimension Coverage

Each variant reorganizes and extends items by dimension:

**Example: Clarity dimension**

- **Base Checklist (Clarity)**: Vague requirements defined, terminology consistent, acceptance criteria in Given-When-Then format
- **UX Variant adds**: Visual hierarchy clear, interaction states documented, user workflows explicit
- **API Variant adds**: Request/response schemas defined, error response format consistent, pagination approach documented
- **Security Variant adds**: Authentication mechanism specified, encryption algorithm named, data classification clear
- **Performance Variant adds**: Caching strategy documented, timeout values defined, SLO metrics specified

Each variant adds **different clarity concerns** relevant to its domain.

### Total Item Count by Variant

| Domain | Dimension Items | Domain-Specific Items | Total Items |
|--------|-----------|-----------|-----|
| Base only | 40-45 | — | **40-45** |
| + UX Variant | 40-45 | 18 UX-specific | **58-63** |
| + API Variant | 40-45 | 18 API-specific | **58-63** |
| + Security Variant | 40-45 | 18 Security-specific | **58-63** |
| + Performance Variant | 40-45 | 18 Performance-specific | **58-63** |
| + All 4 variants | 40-45 | 72 domain-specific (18×4) | **112-117** |

---

## Using Multiple Variants Together

When combining variants, **organize by dimension**:

```
# Requirements Quality Checklist: E-Commerce Platform

## Completeness (Base + UX + API + Security + Performance)
- [x] CHK-001-Completeness (base)
- [x] CHK-046-UX-Completeness (UX variant)
- [x] CHK-046-API-Completeness (API variant)
- [x] CHK-046-Security-Completeness (Security variant)
- [x] CHK-046-Performance-Completeness (Performance variant)

## Clarity (Base + UX + API + Security + Performance)
- [x] CHK-007-Clarity (base)
- [x] CHK-047-UX-Clarity (UX variant)
- [x] CHK-048-API-Clarity (API variant)
- [x] CHK-048-Security-Clarity (Security variant)
- [x] CHK-048-Performance-Clarity (Performance variant)

...etc
```

Each dimension section includes items from all applicable variants.

---

## Variant Characteristics

### Item Format

All variant items follow the same pattern as base items:

```
## {Dimension}: {Item Title}

CHK-###-{Variant}-{Dimension}

**Question**: {Clear question about requirement}

**Guidance**: 
- Examples and templates
- Documentation required
- Success criteria

**Success Criteria**:
- ✓ Specific, measurable outcomes
- ✓ Not vague or handwaving
```

### Completeness Across Variants

No variant is "more complete" than another. They're orthogonal:

- **UX Variant** is not "more complete" API Variant—they focus on different domains
- **Security Variant** is not "more complete" than Performance—they address different concerns
- Using multiple variants increases coverage, not competence

Choose variants based on **domain focus**, not "completeness".

---

## Workflow: Using Variants in SpecKit

When using with `/speckit-checklist` skill or manual generation:

1. **Determine domains**: What's the specification about? (UI, API, security, performance)
2. **Select variants**: Pick all applicable (base always included)
3. **Generate checklist**:

   ```
   /speckit-checklist --domain [ux|api|security|performance|combined] --audience [author|peer|stakeholder|integration]
   ```

4. **Complete items**: Work through items in dimension order
5. **Mark progress**: Check items as verified
6. **Review**: Ensure all dimensions covered

---

## FAQ

**Q: Can I use multiple variants on one specification?**

A: Yes! Many specifications need multiple variants (e.g., e-commerce needs UX + API + Security + Performance). Select all that apply.

**Q: Can I mix base + 2 variants but skip one?**

A: Yes, choose which variants are relevant. If your API doesn't have performance targets, skip Performance variant.

**Q: What if my spec doesn't match any variant?**

A: Use the base checklist (40-45 items covering 8 dimensions). Variants are optional extensions.

**Q: Can I create my own custom variant?**

A: Yes! The variant framework is extensible. Clone an existing variant and adapt for your domain. Pattern: `CHK-###-{YourDomain}-{Dimension}`.

**Q: How long to complete a variant checklist?**

A:

- Base checklist: ~30-45 minutes (author pre-review)
- Each variant: +15-20 minutes (domain-specific items)
- Combined (4 variants): 90-120 minutes (thorough review)

**Q: Which variant is "most important"?**

A: None. Choose based on your specification. A payment API doesn't need UX variant (no UI). A mobile app doesn't need API variant (only backend). Security variant only if handling sensitive data.

---

## Examples: Which Variants to Use

### Real-World Scenario 1: Signup Flow Redesign

**Feature**: Redesign user signup with email, password, 2FA

**Applicable domains**:

- **UX**: Signup form layout, validation error messages, loading states ✅
- **Security**: Password policy, 2FA mechanism, credential storage ✅
- **API**: Signup endpoint, error responses ⚠️ (maybe, if internal API)
- **Performance**: Signup <2s latency? (not critical) ❌

→ **Use**: Base + UX + Security (skip API unless building public API)

---

### Real-World Scenario 2: Payment Integration

**Feature**: Integrate Stripe for payment processing

**Applicable domains**:

- **API**: Stripe API calls, webhooks, error handling ✅
- **Security**: PCI-DSS compliance, credential storage, fraud detection ✅
- **Performance**: Checkout latency <500ms ✅
- **UX**: Payment form UI, error messages (if custom form) ⚠️

→ **Use**: Base + API + Security + Performance (+ UX if custom form)

---

### Real-World Scenario 3: Analytics Service

**Feature**: Build data warehouse and analytics query service

**Applicable domains**:

- **Performance**: Query latency <1s, 1000 concurrent queries, data refresh ✅
- **API**: Query endpoint, result format, pagination ✅
- **Security**: Row-level access control, data classification ✅
- **UX**: (no UI) ❌

→ **Use**: Base + API + Security + Performance (skip UX)

---

### Real-World Scenario 4: Blog Content Update

**Feature**: Update blog post styling

**Applicable domains**:

- **UX**: (CSS only, no interaction change) ❌
- **API**: (no API changes) ❌
- **Security**: (no sensitive data) ❌
- **Performance**: (no performance target) ❌

→ **Use**: Base checklist only (general quality dimensions)

---

## Next Steps

1. **Read your domain's variant** (UX, API, Security, and/or Performance)
2. **Generate checklist**: Include base + applicable variants
3. **Complete systematically**: Go dimension-by-dimension
4. **Mark progress**: Check items as you verify requirements
5. **Review**: Ensure all dimensions covered, no ambiguities remain

---

*Built by 🧱 LightSpeedWP with ☕ and domain expertise*

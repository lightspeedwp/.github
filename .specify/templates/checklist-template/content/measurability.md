# Measurability Dimension Items

Requirements have quantified success criteria and can be validated with acceptance tests.

## Definition

A specification has measurability when:

- Every success criterion includes an acceptance test
- Performance metrics are quantified with units and thresholds
- Quality metrics define pass/fail criteria
- Each requirement can be validated objectively
- Service level agreements (SLAs) and objectives (SLOs) are explicit

## Items (5 total)

### CHK-018-Measurability

**Question**: Does every success criterion include a measurable acceptance test?

**Guidance**: For each acceptance criterion, specify:

- Test type (unit, integration, e2e, manual)
- Test input/setup
- Expected output/behavior
- Validation method (assertion, visual inspection, measurement)
- Pass/fail threshold (e.g., "all assertions pass" or "< 5ms latency")

Template:

- **Given** [system state]
- **When** [action taken]
- **Then** [verify condition], measured by [metric], threshold [pass/fail criteria]

Example:

- **Given** a user with 100 unread notifications
- **When** the user loads the notification page
- **Then** all notifications display within 500ms (p95 latency)

**Success Criteria**:

- Each acceptance criterion has an associated test
- Test success/failure is objectively determinable
- Test success criteria are quantified (not "looks good")
- Tests can be automated or reproduced consistently

**Spec Reference**: [Spec §FR-1] (Measurability dimension), [Spec §SC-1]

---

### CHK-019-Measurability

**Question**: Are performance metrics quantified?

**Guidance**: Specify performance targets for:

- Response time (median/average, p95, p99)
- Throughput (requests/second, transactions/second)
- Latency (client-perceived, end-to-end)
- Data processing speed (records/second)
- Batch job duration (max execution time)

For each metric, document:

- Definition (what is measured, how)
- Target value with unit
- Measurement method (synthetic test, APM tool, user RUM)
- Percentile (p50, p95, p99)
- Conditions under normal/peak load

Example:
"API response time: p95 latency < 200ms at 10k concurrent users under normal load"

**Success Criteria**:

- Performance targets are quantified with units
- Percentiles are specified (not just average)
- Load conditions are defined (normal, peak, sustained)
- Measurement method is specified
- Targets are achievable with planned architecture

---

### CHK-020-Measurability

**Question**: Are quality metrics defined?

**Guidance**: Define measurable quality targets:

- Uptime: "99.95% availability, measured monthly"
- Error rates: "< 0.1% error rate under normal load"
- Code coverage: "≥ 80% unit test coverage"
- Performance degradation: "latency increases ≤ 10% at 2x normal load"
- User satisfaction: "NPS ≥ 40" or "99% feature satisfaction"
- Accessibility: "WCAG 2.2 AA compliance, automated + manual audit"
- Security: "0 critical vulnerabilities, monthly pen tests"

For each quality metric:

- Define measurement method
- Set acceptable threshold
- Specify review/audit frequency

**Success Criteria**:

- Quality metrics are specific (not vague like "good quality")
- Success thresholds are quantified
- Measurement frequency is defined
- Metrics are achievable and relevant

---

### CHK-021-Measurability

**Question**: Can each requirement be validated?

**Guidance**: For each requirement, answer:

- **What** is being validated? (feature, constraint, behavior)
- **How** is it tested? (what type of test: unit, integration, e2e, manual, audit)
- **Who** validates it? (developer, QA, stakeholder, tool)
- **When** is validation performed? (before merge, before release, ongoing)
- **Pass/Fail** criteria are what? (specific assertion, measurement, audit result)

Create traceability matrix:

- Requirement ID → Acceptance Criteria → Test Case → Pass/Fail Status

**Success Criteria**:

- Every functional requirement has a test case
- Non-functional requirements have measurement/audit method
- Test ownership is clear
- Validation schedule is specified
- No requirement is untestable

---

### CHK-022-Measurability

**Question**: Are SLAs/SLOs explicitly stated?

**Guidance**: For each external dependency and service, document:

- **SLA (Service Level Agreement)**: contractual uptime guarantee
  - Example: "99.9% uptime, measured monthly, $100/month credit for violations"
- **SLO (Service Level Objective)**: internal target performance
  - Example: "Target 99.99% uptime, tolerance for 99.9%"
- **Error budget**: how much downtime/errors are acceptable
  - Example: "99.99% = 43.2 minutes downtime allowed per month"

For critical services, specify:

- Uptime guarantee (99%, 99.9%, 99.99%, 99.999%)
- Incident response time
- Recovery time objective (RTO)
- Recovery point objective (RPO)
- Escalation procedures

**Success Criteria**:

- All critical services have explicit SLA/SLO
- Uptime targets are quantified (99.X%)
- Error budgets are calculated and communicated
- Consequences/credits for SLA violations are documented
- Internal targets align with external SLAs

**Note**: All remaining CHK items in this file include [Spec §FR-1] (Measurability dimension) and [Spec §SC-1 through SC-10] references for traceability.

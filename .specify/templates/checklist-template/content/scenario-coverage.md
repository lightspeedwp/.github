# Scenario Coverage Dimension Items

All user scenarios, workflows, and integration paths are documented.

## Definition

A specification covers scenarios when:

- All primary user workflows and journeys are documented
- Concurrent and parallel user scenarios are addressed
- Offline/degraded-mode scenarios are handled
- External system integration scenarios are specified
- Multi-user interaction scenarios are defined
- Mobile and responsive design scenarios are covered

## Items (6 total)

### CHK-023-Scenario-Coverage

**Question**: Are all primary user workflows documented?

**Guidance**: Create user journey maps for each primary use case:

- **Actor**: who performs the workflow (admin, end user, API client)
- **Goal**: what they're trying to accomplish
- **Workflow**: step-by-step sequence
- **Success path**: happy path scenario
- **Trigger**: what initiates the workflow
- **Preconditions**: system state before workflow
- **Postconditions**: system state after completion

For each workflow document:

- Alternative paths (variations)
- Time constraints
- Decision points
- External dependencies

Document at minimum:

- User registration/onboarding
- Primary feature usage
- Account/data management
- Logout/session end

**Success Criteria**:

- At least 3-5 primary workflows are documented
- Each workflow has a success path and alternatives
- Entry and exit conditions are clear
- Workflows are testable and traceable
- Coverage includes admin/privileged operations

---

### CHK-024-Scenario-Coverage

**Question**: Are concurrent/parallel user scenarios addressed?

**Guidance**: Document scenarios where multiple users interact simultaneously:

- Concurrent data modifications (race conditions)
- Lock contention and timeout handling
- Message ordering in async workflows
- Session isolation and data consistency
- Bulk operations affecting multiple records
- Cascading operations (deleting parent affects children)

For each concurrent scenario specify:

- What happens when two users modify the same record
- Lock strategy (optimistic, pessimistic, conflict-free)
- Conflict resolution (last-write-wins, merge, error)
- Transaction isolation level (read committed, repeatable read, serializable)
- Consistency guarantees

**Success Criteria**:

- Race conditions are identified and handled
- Lock strategy is documented
- Conflict resolution is specified
- Transaction isolation levels are defined
- Concurrent operation performance is addressed

---

### CHK-025-Scenario-Coverage

**Question**: Are offline/degraded-mode scenarios covered?

**Guidance**: Specify behavior when:

- Network connectivity is lost
- External services are unavailable
- Database is read-only or offline
- Features are in partial/maintenance mode
- System is degraded (high latency, high error rate)

For each degraded-mode scenario document:

- What functionality remains available
- What feedback is given to users
- How data consistency is maintained
- When/how the system recovers
- Data sync strategy when connectivity returns

Example: "When offline, user can view cached articles and compose messages. Messages queue locally and sync when online."

**Success Criteria**:

- Offline capabilities are explicitly specified
- Data consistency strategy during offline is clear
- Sync/recovery process is documented
- User experience during degradation is addressed
- Automatic vs. manual recovery triggers are defined

---

### CHK-026-Scenario-Coverage

**Question**: Are integration scenarios with external systems addressed?

**Guidance**: For each external system integration, document:

- Integration touchpoints (API calls, webhooks, data imports)
- Data flow (what data is sent/received)
- Error handling (what if external service fails)
- Retry strategy (transient vs. permanent failures)
- Timeout handling (how long to wait)
- Data transformation/mapping
- Audit/logging of integration events

Create integration matrix:

- Our System ↔ External Service (bi-directional data flow)
- Failure modes and fallbacks

Example:
"Payment processing: System calls Stripe API → receives success/failure → updates order status. If Stripe API fails (timeout > 30s), retry up to 3 times, then queue for manual review."

**Success Criteria**:

- All external integrations are documented
- Data flow is specified in both directions
- Error scenarios are handled
- Retry and timeout strategies are defined
- Manual intervention procedures exist for failures

---

### CHK-027-Scenario-Coverage

**Question**: Are multi-user scenarios specified?

**Guidance**: Document scenarios involving multiple users:

- Team collaboration (shared editing, commenting, approvals)
- Role-based access (admin views vs. user views)
- Permission escalation workflows
- Notification and alert rules for multiple recipients
- Group actions (bulk operations)
- User impersonation (support scenarios)

For each multi-user scenario specify:

- User roles involved
- Permissions for each role
- Conflict resolution if users disagree
- Notification requirements
- Audit trail requirements

**Success Criteria**:

- Multi-user workflows are documented
- Role interactions are specified
- Conflict resolution is clear
- Permissions are explicit for each role
- Audit/logging requirements are defined

---

### CHK-028-Scenario-Coverage

**Question**: Are mobile/responsive design scenarios covered?

**Guidance**: Specify behavior for:

- Mobile viewports (phone: 320-480px, tablet: 481-1024px)
- Responsive breakpoints and layout changes
- Touch interactions (tap, swipe, pinch, hold)
- Mobile-specific features (GPS, camera, notifications)
- Network conditions on mobile (LTE, 3G, WiFi)
- Mobile device orientation (portrait, landscape rotation)
- Keyboard handling (virtual keyboards, iPad external keyboards)

For each screen size document:

- Layout changes
- Feature availability (some features mobile-only or desktop-only)
- Performance targets
- Touch target sizes (minimum 44x44px)
- Usability considerations

**Success Criteria**:

- Mobile viewports are specified with breakpoints
- Touch interactions are documented
- Layout behavior is clear at each breakpoint
- Mobile-specific features are defined
- Performance targets for mobile networks are specified

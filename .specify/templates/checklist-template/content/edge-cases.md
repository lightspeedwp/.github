# Edge Cases Dimension Items

Boundary conditions and exceptional cases are explicitly handled.

## Definition

A specification addresses edge cases when:

- Empty/null/zero/negative inputs are handled
- Maximum/minimum boundaries are specified and tested
- Timeout scenarios are defined with recovery procedures
- Recovery flows document how systems regain consistency
- Partial failure scenarios are handled gracefully
- Resource exhaustion scenarios are addressed

## Items (6 total)

### CHK-029-Edge-Cases

**Question**: Are empty/null/zero cases handled?

**Guidance**: For each input or data structure, specify handling of:

- Null/undefined values
- Empty strings or collections
- Zero or negative numbers (where applicable)
- Empty objects or responses
- Missing optional fields

For each case document:

- Is it a valid input? (accept or reject)
- How should it be handled? (skip, use default, error)
- What is the user experience? (error message, graceful degradation)
- What is the system behavior? (log, alert, retry)

Example:

- Empty email: "Reject, display validation error 'Email is required'"
- Empty shopping cart: "Allow checkout, total = $0, warn user"
- Zero quantity: "Reject with error, minimum quantity is 1"

**Success Criteria**:

- Every nullable field is addressed
- Behavior for empty values is specified
- Validation rules are explicit
- Error messages are user-friendly
- System doesn't crash on empty inputs

---

### CHK-030-Edge-Cases

**Question**: Are maximum/minimum boundaries specified?

**Guidance**: For numeric, string, and collection fields:

- Define minimum and maximum values/lengths
- Specify behavior at boundaries
- Document what happens when limits are exceeded
- Test boundary values explicitly

Examples:

- String length: "username: min 3, max 50 characters. If > 50, truncate or error?"
- Age field: "min 0, max 150. If < 0 or > 150, reject with error"
- Collection size: "Max 10,000 items in list. If > 10,000, paginate or error?"
- File size: "Max 100MB upload. If > 100MB, reject with helpful error message"

For databases and APIs:

- Record limits per query
- Result set pagination
- Timeout on long operations

**Success Criteria**:

- Min/max values are specified for all bounded fields
- Overflow/underflow behavior is defined
- Tests include boundary values (min, max, min-1, max+1)
- Error handling for limits is specified
- Documentation of limits is user-accessible

---

### CHK-031-Edge-Cases

**Question**: Are timeout scenarios defined?

**Guidance**: For operations that can timeout, specify:

- Timeout value (how long to wait)
- What triggers the timeout (network, processing, waiting)
- Behavior when timeout occurs (retry, fail, escalate)
- Retry strategy (exponential backoff, max attempts)
- User notification (silent, warning, error)
- Cleanup (release resources, unlock, cancel)

Document timeouts for:

- Network requests to external services
- Database queries
- File uploads/downloads
- Long-running batch operations
- Session inactivity
- Lock acquisition

Example:
"API calls: 30-second timeout. If timeout: log warning, retry once after 5s delay, if retry fails send error to user 'Service temporarily unavailable, please try again.'"

**Success Criteria**:

- All timeout-able operations have timeout values
- Timeout behavior is specified (retry, fail, escalate)
- Retry strategy is documented
- User is notified appropriately
- Resources are cleaned up on timeout

---

### CHK-032-Edge-Cases

**Question**: Are recovery flows documented?

**Guidance**: For each failure scenario, document:

- What failed (component, operation, data state)
- How the system detects the failure
- Recovery procedure (steps to restore consistency)
- Who/what performs recovery (automatic, manual, human)
- Time to recovery (RTO)
- Data at risk (RPO)

Recovery scenarios:

- Database crashes (cold start, data corruption)
- Partial failures (some records failed, some succeeded)
- Stuck transactions (deadlocked, abandoned)
- Queue backlog (too many messages, can't keep up)
- Inconsistent state (conflicting data between systems)

Example:
"If order payment fails: Automated recovery - mark order as pending payment, retry payment every hour for 24 hours. If still failing after 24h: Manual review by support team. User can retry payment manually anytime."

**Success Criteria**:

- Recovery procedures are documented for critical failures
- Automatic vs. manual recovery is clear
- Recovery time objectives (RTO) are specified
- Data loss expectations (RPO) are documented
- Recovery testing is part of test plan

---

### CHK-033-Edge-Cases

**Question**: Are partial failure scenarios addressed?

**Guidance**: In systems with multiple operations, specify:

- What happens when some operations succeed and others fail
- Transaction boundaries (all-or-nothing vs. partial success)
- Rollback and compensation strategies
- Idempotency (safe to retry)
- State consistency after partial failure

Scenarios:

- Bulk operations: "Delete 100 items, but 10 fail. Result: 90 deleted, user notified of failures"
- Multi-step workflows: "Payment succeeds but email fails. Result: payment applied, order pending notification retry"
- Cascading operations: "Update parent record and 5 child records. 3 children fail. Result: parent updated, 3 children unchanged, user notified"

Document:

- Which operations are grouped (transaction scope)
- What constitutes "success" for batch operations
- Compensation logic (how to undo partial work)
- Notification of partial failures

**Success Criteria**:

- Partial failure scenarios are identified
- Behavior for each scenario is documented
- Rollback/compensation strategy is clear
- User is informed of partial success
- System state remains consistent

---

### CHK-034-Edge-Cases

**Question**: Are resource exhaustion scenarios covered?

**Guidance**: Document behavior when system runs low on:

- Memory (heap, caches)
- Disk space (storage, temp files)
- Database connections
- File handles
- Network bandwidth
- CPU (high load, throttling)

For each resource specify:

- Monitoring threshold (when to alert)
- Graceful degradation (what features become unavailable)
- Backpressure mechanism (slow down new requests)
- Escalation (who/what is notified)
- Recovery procedure (cleanup, restart)

Example:
"Memory: Monitor heap usage. If > 85%, log warning and disable in-memory caches. If > 95%, reject new connections with 503 Service Unavailable. Alert ops team. Recovery: auto-restart after 1-hour if no manual intervention."

**Success Criteria**:

- Resource limits are specified
- Monitoring thresholds are defined
- Graceful degradation strategy is clear
- Users are notified of resource issues
- Escalation procedures exist
- Recovery procedures are automated or documented

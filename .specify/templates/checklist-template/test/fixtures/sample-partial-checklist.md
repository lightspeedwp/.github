# Requirements Quality Checklist — PARTIAL EXAMPLE (Needs Work)

**Specification**: Sample Incomplete Specification  
**Domain**: Base  
**Audience**: Peer Reviewer  
**Date**: 2026-09-17  

---

## Checklist Items (Mixed States)

### Completeness

- [x] CHK-001-Completeness: Are error handling requirements defined for ALL failure scenarios?
- [x] CHK-002-Completeness: Are non-functional requirements covered?
- [ ] CHK-003-Completeness: Are external dependencies documented? [Gap: Third-party API integration requirements not specified]
- [x] CHK-004-Completeness: Are edge cases and boundary conditions explicitly addressed?
- [ ] CHK-005-Completeness: Are assumptions documented? [Ambiguity: Unclear which user behaviors are assumed vs. specified]
- [x] CHK-006-Completeness: Are all user roles and permissions specified?

### Clarity

- [ ] CHK-007-Clarity: Are vague terms replaced with measurable criteria? [Ambiguity: "Fast" appears 3 times without metrics; "scalable" mentioned but no load targets defined]
- [x] CHK-008-Clarity: Is terminology consistent?
- [x] CHK-009-Clarity: Are acceptance criteria unambiguous?
- [ ] CHK-010-Clarity: Are visual/interaction requirements clearly described? [Gap: Mobile UI requirements completely missing]
- [x] CHK-011-Clarity: Are data formats explicitly specified?
- [x] CHK-012-Clarity: Are decision criteria clear?

### Consistency

- [x] CHK-013-Consistency: Are there conflicting requirements?
- [x] CHK-014-Consistency: Do related requirements contradict each other?
- [x] CHK-015-Consistency: Is terminology usage consistent?
- [ ] CHK-016-Consistency: Do security requirements align with performance constraints? [Ambiguity-Critical: "Maximum encryption overhead" not defined; blocking infrastructure design]
- [x] CHK-017-Consistency: Are dependencies documented in both directions?

### Measurability

- [x] CHK-018-Measurability: Does every success criterion include measurable acceptance test?
- [ ] CHK-019-Measurability: Are performance metrics quantified? [Gap: No SLA defined for API latency or throughput]
- [x] CHK-020-Measurability: Are quality metrics defined?
- [x] CHK-021-Measurability: Can each requirement be validated?
- [ ] CHK-022-Measurability: Are SLAs/SLOs explicitly stated? [Ambiguity-Critical: Uptime target (99% vs 99.9% vs 99.99%) not agreed; blocks infrastructure decisions]

### Scenario Coverage

- [x] CHK-023-Scenario-Coverage: Are all primary user workflows documented?
- [ ] CHK-024-Scenario-Coverage: Are concurrent/parallel user scenarios addressed? [Gap: No specification for simultaneous user interactions or race conditions]
- [x] CHK-025-Scenario-Coverage: Are offline/degraded-mode scenarios covered?
- [x] CHK-026-Scenario-Coverage: Are integration scenarios addressed?
- [x] CHK-027-Scenario-Coverage: Are multi-user scenarios specified?
- [x] CHK-028-Scenario-Coverage: Are mobile/responsive scenarios covered?

### Edge Cases

- [x] CHK-029-Edge-Cases: Are empty/null/zero cases handled?
- [x] CHK-030-Edge-Cases: Are maximum/minimum boundaries specified?
- [x] CHK-031-Edge-Cases: Are timeout scenarios defined?
- [ ] CHK-032-Edge-Cases: Are recovery flows documented? [Ambiguity: What happens after timeout? Retry automatically, notify user, or both?]
- [x] CHK-033-Edge-Cases: Are partial failure scenarios addressed?
- [x] CHK-034-Edge-Cases: Are resource exhaustion scenarios covered?

### Dependencies

- [x] CHK-035-Dependencies: Are all third-party dependencies documented?
- [ ] CHK-036-Dependencies: Are data dependencies documented? [Gap: Data refresh rates and dependencies on upstream systems not specified]
- [x] CHK-037-Dependencies: Are system dependencies specified?
- [x] CHK-038-Dependencies: Are assumptions about user knowledge documented?
- [ ] CHK-039-Dependencies: Are external compliance requirements documented? [Gap: GDPR, CCPA, or other privacy/security regulations not addressed]
- [x] CHK-040-Dependencies: Are scheduling/ordering dependencies specified?

### Ambiguities

- [ ] CHK-041-Ambiguities: Are there unresolved design decisions? [Ambiguity: Database choice (PostgreSQL vs MongoDB) still pending]
- [x] CHK-042-Ambiguities: Are there conflicting interpretations?
- [x] CHK-043-Ambiguities: Are scope boundaries clearly defined?
- [x] CHK-044-Ambiguities: Are future extensions deferred?
- [ ] CHK-045-Ambiguities: Are stakeholder sign-offs obtained? [Gap: Security team and compliance team sign-off missing]

---

## Summary

| Metric | Value |
|--------|-------|
| Total Items | 45 |
| Checked Items | 30 |
| Unchecked Items | 15 |
| Completion % | 67% |
| Gaps | 5 |
| Ambiguities | 5 |
| Critical Ambiguities | 2 |

**Status**: ⚠️ **CAUTION** — Multiple gaps and critical ambiguities remain

**Required Actions**:

1. Resolve 2 critical ambiguities (encryption overhead, uptime SLA)
2. Address 5 gaps (external APIs, mobile UI, concurrent scenarios, data dependencies, compliance)
3. Clarify 5 ambiguities (vague terms, retry logic, database choice, stakeholder sign-offs, recovery procedures)
4. Re-check items after addressing findings

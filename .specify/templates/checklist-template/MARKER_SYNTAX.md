# Gap & Ambiguity Marker Syntax

## Marker Definitions

### [Gap] — Missing Requirement

A requirement category or scenario is **absent** from the specification.

**When to use**: A section or scenario that should be in the specification is missing entirely.

**Example**:

```
- [ ] CHK-004-Completeness: Are edge cases and boundary conditions explicitly addressed (empty input, maximum values, concurrent access, race conditions)? [Gap: Error recovery procedures not defined]
```

**Resolution**: Add the missing requirement to the specification and mark as `[x]` when addressed.

---

### [Ambiguity] — Unclear Requirement

A requirement exists but is **vague, incomplete, or open to interpretation**.

**When to use**: A requirement is present but lacks clarity, measurability, or specific details.

**Example**:

```
- [ ] CHK-007-Clarity: Are vague terms (fast, scalable, secure, intuitive, robust) replaced with measurable criteria? [Ambiguity: "performance is critical" — specify target metrics (response time <500ms, throughput >1000 req/sec)]
```

**Resolution**: Clarify the requirement with specific details and mark as `[x]` when resolved.

---

### [Ambiguity-Critical] — Blocking Ambiguity

A requirement is **critically unclear and blocks implementation decisions**.

**When to use**: Ambiguity that cannot proceed to implementation without resolution; high-impact uncertainty.

**Example**:

```
- [ ] CHK-021-Measurability: Are SLAs/SLOs explicitly stated? [Ambiguity-Critical: No agreement on uptime target (99%, 99.9%, 99.99%?); blocks infrastructure decisions]
```

**Resolution**: Must be resolved before specification approval; escalate to stakeholders if needed.

---

## Checklist Summary Template

Add this section to checklist footers:

```markdown
## Summary & Status

| Marker | Count | Items |
|--------|-------|-------|
| Gaps | N | [list gap areas] |
| Ambiguities | M | [list unclear items] |
| Critical Ambiguities | K | [list blocking issues] |

**Overall Status**: 
- ✅ PASS: 0 gaps, ≤3 ambiguities, 0 critical ambiguities
- ⚠️ CAUTION: 1–2 gaps, 4–5 ambiguities, or 1 critical ambiguity
- ❌ FAIL: ≥3 gaps or ≥2 critical ambiguities

**Approval Gate**: Specification can proceed to implementation if status is ✅ or ⚠️ (with stakeholder acknowledgement of cautions).
```

---

## Marker Usage in Markdown Checklists

**Syntax**:

```markdown
- [ ] CHK-###-{Dimension}: [Question]? [{Marker}: {Detail}]

Examples:
- [ ] CHK-001-Completeness: Are error handling requirements defined for ALL failure scenarios? [Gap: Partial failure recovery not documented]
- [ ] CHK-023-Scenario-Coverage: Are all primary user workflows documented? [Ambiguity: Definition of "primary" depends on user role]
- [ ] CHK-018-Measurability: Does every success criterion include a measurable acceptance test? [Ambiguity-Critical: No agreement on what "measurable" means in org context]
```

**Processing**:

- Parser extracts markers: `\[Gap:.*?\]`, `\[Ambiguity:.*?\]`, `\[Ambiguity-Critical:.*?\]`
- Counts by type
- Flags for dashboard/reporting
- Blocks approval if critical ambiguities present

---

## Related Documentation

- **Spec.md**: [Definition: Good Enough to Implement](../spec.md#definition-good-enough-to-implement)
- **Clarity Dimension Guide**: Terms that need quantification (fast, scalable, secure, intuitive, robust)
- **Checklist Template**: [`.specify/templates/checklist-template.md`](../checklist-template.md)

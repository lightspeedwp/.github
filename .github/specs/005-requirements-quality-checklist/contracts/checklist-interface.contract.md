# Contract: Checklist Interface

**Version**: 1.0 | **Phase**: Phase 1

## Checklist Item Structure

```markdown
## [Dimension Name]

- [ ] CHK###: [Question about requirement quality]? [Spec §X.Y]
  - [Gap] if requirement missing
  - [Ambiguity] if unclear
```

## 8 Quality Dimensions

### 1. Completeness
Questions: Are all necessary requirements documented? Nothing missing?

**Example Items**:
- Are error handling requirements defined for all failure scenarios?
- Are accessibility requirements specified for all interactive elements?
- Are mobile breakpoint requirements defined?

### 2. Clarity
Questions: Are requirements unambiguous? Vague terms quantified?

**Example Items**:
- Is "fast loading" quantified with specific timing thresholds?
- Are visual requirements defined with measurable properties?
- Is terminology consistent throughout the specification?

### 3. Consistency
Questions: Do requirements align without conflicts?

**Example Items**:
- Are navigation requirements consistent across all pages?
- Do requirements in Section A conflict with Section B?
- Is terminology used consistently?

### 4. Measurability
Questions: Can requirements be objectively verified?

**Example Items**:
- Are performance requirements quantified with specific metrics?
- Can success criteria be objectively measured?
- Are acceptance criteria testable?

### 5. Scenario Coverage
Questions: Are all user flows and scenarios addressed?

**Example Items**:
- Are requirements defined for zero-state scenarios?
- Do requirements address error and exception flows?
- Are concurrent user interactions specified?

### 6. Edge Cases
Questions: Are boundary conditions and error cases defined?

**Example Items**:
- Are requirements specified for partial failure scenarios?
- Is fallback behavior defined when external resources fail?
- Are recovery flows specified?

### 7. Dependencies
Questions: Are external dependencies and assumptions documented?

**Example Items**:
- Are external service requirements documented?
- Are assumptions about system availability stated?
- Are integration points clearly defined?

### 8. Ambiguities
Questions: Are unclear areas surfaced for resolution?

**Example Items**:
- Are assumptions about user preferences documented?
- Are security/compliance requirements explicitly stated?
- Are design intent and rationales explained?

---

## Checkbox States

| State | Meaning | Who Sets |
|-------|---------|----------|
| `[ ]` | Not yet evaluated | Unchecked (default) |
| `[x]` | Requirement quality passes | Reviewer/Author |
| `[Gap]` | Requirement absent; should be added | Discovered during review |
| `[Ambiguity]` | Requirement unclear; needs clarification | Discovered during review |

**CRITICAL**: `[x]` means "requirements quality passes", NOT "implementation complete"

---

## Template Structure

```markdown
# Specification Quality Checklist: [Feature Name]

**Purpose**: Validate specification completeness and quality before proceeding
**Created**: [DATE]
**Feature**: [Link to spec.md]
**Status**: [DRAFT/IN PROGRESS/VALIDATION PASSED]

---

## Completeness

- [ ] CHK001: Are all necessary requirements documented? [Spec §Overview]
- [ ] CHK002: Are error handling requirements defined? [Gap]
- [ ] CHK003: Are accessibility requirements specified? [Spec §Requirements]

## Clarity

- [ ] CHK004: Are success criteria measurable and specific? [Spec §Success Criteria]
- [ ] CHK005: Is terminology consistent throughout? [Spec §Entities]

## [Additional Dimensions...]

---

## Summary

**Total Items**: 40
**Passed**: 38
**Failed**: 2
**Gaps**: 1
**Ambiguities**: 0

**Ready for**: [Author Review / Peer Review / Stakeholder Gate]
```

---

## Audience-Specific Usage

### Author Pre-Review (30 min)
- [ ] Complete checklist self-assessment
- [ ] Mark items as [x] or identify [Gap]/[Ambiguity]
- [ ] Address critical gaps before peer review
- [ ] Include completed checklist in PR

### Peer Reviewer (45 min)
- [ ] Use checklist to prioritize feedback
- [ ] Focus on fail items first
- [ ] Verify gap/ambiguity assessments
- [ ] Update checklist with findings

### Stakeholder (15 min)
- [ ] Review checklist completion status
- [ ] Ask: "Are all critical items checked?"
- [ ] Approve or request clarifications
- [ ] Implementation can begin once approved

---

## Phase 1 Complete

Checklist interface contract defined with 8 dimensions, item formats, and audience guidance.

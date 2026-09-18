# Specification Quality Framework: 8 Dimensions

**Source**: `.specify/memory/constitution.md` Principle VII  
**Purpose**: Consistent quality evaluation across all specifications  
**Applied To**: 12 existing specifications (001-012)

---

## 1. Completeness

**Definition**: All necessary requirements are present; user stories are complete with independent value; edge cases are identified.

**Pass Criteria**:

- All mandatory sections of the specification are filled in
- User stories have clear value propositions and acceptance criteria
- No requirements are labeled [NEEDS CLARIFICATION]
- Edge cases are explicitly documented
- Assumptions are documented

**Evaluation Focus**:

- Are all user scenarios covered?
- Are there gaps between functional requirements and acceptance criteria?
- Are there incomplete sections or TODO markers?

---

## 2. Clarity

**Definition**: Requirements are specific and unambiguous; vague terms are quantified; terminology is consistent.

**Pass Criteria**:

- Vague adjectives (fast, robust, scalable, intuitive) are quantified with metrics
- Requirements use specific, measurable language
- Abbreviations and technical terms are defined
- Consistent terminology throughout (no synonyms used interchangeably)
- Examples and edge case definitions are clear

**Evaluation Focus**:

- Can a developer implement without asking clarification questions?
- Are acceptance criteria measurable and testable?
- Are timeframes, thresholds, and performance targets specified?

---

## 3. Consistency

**Definition**: Requirements are aligned without conflicts; terminology is consistent; requirements don't contradict each other.

**Pass Criteria**:

- No conflicting requirements across sections
- Technical terms used consistently (same term always means same concept)
- User roles and personas defined consistently
- Similar requirements across different sections use parallel language
- Numbering and naming conventions are uniform

**Evaluation Focus**:

- Do FR-001 and FR-005 describe conflicting behaviors?
- Is "user" defined the same way throughout?
- Are acceptance criteria consistent with functional requirements?

---

## 4. Measurability

**Definition**: Acceptance criteria are objective and testable; metrics are defined; success is verifiable without subjective interpretation.

**Pass Criteria**:

- Success criteria include specific metrics (percentages, times, counts)
- Acceptance scenarios are testable without subjective judgment
- Performance requirements include specific targets (latency, throughput)
- Availability/uptime requirements are quantified
- Quality gates are objective (pass/fail, not "looks good")

**Evaluation Focus**:

- Can acceptance criteria be automated in tests?
- Is there a clear definition of "done"?
- Can success be verified by a third party objectively?

---

## 5. Scenario Coverage

**Definition**: User flows and primary/secondary paths are addressed; critical user journeys are complete.

**Pass Criteria**:

- Primary user flows are documented
- Alternate/secondary paths are identified
- Happy path and error paths are both defined
- Integration scenarios are documented
- Multi-step workflows are complete

**Evaluation Focus**:

- What are the critical user journeys?
- Are both success and failure paths specified?
- Are interactive flows step-by-step?
- Are data dependencies between requirements clear?

---

## 6. Edge Cases

**Definition**: Boundary conditions are defined; failure modes are specified; error handling is documented.

**Pass Criteria**:

- Boundary conditions (minimum, maximum, zero, null) are addressed
- Error scenarios are specified
- Recovery/rollback procedures are documented
- Timeout and retry behavior is defined
- Conflict resolution (concurrent operations) is addressed

**Evaluation Focus**:

- What happens at limits (empty, full, zero, null)?
- How are errors handled?
- What's the recovery path if something fails?
- Are race conditions or concurrency issues addressed?

---

## 7. Dependencies

**Definition**: Assumptions are documented; external dependencies are identified; constraints are clear.

**Pass Criteria**:

- All assumptions about external systems are documented
- Third-party service/API dependencies are listed
- Data dependencies between requirements are clear
- Compatibility requirements (versions, platforms) are specified
- Constraints (legal, regulatory, organizational) are identified

**Evaluation Focus**:

- What external systems does this depend on?
- What assumptions are being made?
- What constraints could break this requirement?
- Are all prerequisites documented?

---

## 8. Ambiguities

**Definition**: No unclear areas remain; terminology is defined; edge cases are not left open-ended.

**Pass Criteria**:

- No [NEEDS CLARIFICATION] markers remain
- All pronouns ("it", "they") have clear antecedents
- Modal verbs are precise: MUST (required) vs SHOULD (recommended) vs CAN (optional)
- Undefined acronyms and jargon are explained
- Conditional statements are clear

**Evaluation Focus**:

- Are there unclear references ("it" - what does it refer to)?
- Is the scope clearly bounded?
- Are optional vs mandatory requirements clearly marked?
- Could a new team member misunderstand this requirement?

---

## Audit Scoring

| Dimension | Points | Pass/Fail |
|-----------|--------|-----------|
| Completeness | 1 | PASS or FAIL |
| Clarity | 1 | PASS or FAIL |
| Consistency | 1 | PASS or FAIL |
| Measurability | 1 | PASS or FAIL |
| Scenario Coverage | 1 | PASS or FAIL |
| Edge Cases | 1 | PASS or FAIL |
| Dependencies | 1 | PASS or FAIL |
| Ambiguities | 1 | PASS or FAIL |
| **Total** | **8** | **Score: X/8** |

**Quality Score**: (Points Passing / 8) × 100 = X%

- **Approved**: 8/8 dimensions (100% - mandatory quality gate)
- **Passing**: 6-7 dimensions (75-87.5% - methodology threshold)
- **Partial**: 5 dimensions (62.5% - requires remediation)
- **Below Threshold**: 0-4 dimensions (<62.5% - unsuitable for use)

---

*All 12 specifications will be audited against these dimensions using this framework. Results will be consolidated into the comprehensive audit report.*

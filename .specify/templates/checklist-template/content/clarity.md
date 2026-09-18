# Clarity Dimension Items

Requirements are unambiguous, precise, and measurable.

## Definition

A specification has clarity when:

- Vague terms are replaced with concrete, measurable criteria
- Terminology is used consistently throughout
- Acceptance criteria are testable and unambiguous
- Visual and interaction requirements are explicitly described
- Data formats and structures are formally specified
- Decision logic and conditions are clearly stated

## Items (6 total)

### CHK-007-Clarity

**Question**: Are vague terms replaced with measurable criteria?

**Guidance**: Replace subjective terms with quantified targets:

- "fast" → "<500ms response time" or "p95 latency <200ms"
- "scalable" → "supports 10,000 concurrent users" or "handles 1M requests/hour"
- "secure" → "TLS 1.3, AES-256, OWASP Top 10 mitigations"
- "intuitive" → "<30 seconds to discover feature" or "90% task success on first try"
- "robust" → "99.95% uptime", "graceful degradation on failure", "zero data loss"
- "accessible" → "WCAG 2.2 AA" or "keyboard navigable in <5 steps"

**Success Criteria**:

- Every quality attribute has a measurable target
- Units and thresholds are specified (time, users, throughput, percentage)
- Success/failure criteria are quantified
- No subjective terms remain undefined

**Spec Reference**: [Spec §FR-1] (Clarity dimension), [Spec §SC-7]

---

### CHK-008-Clarity

**Question**: Is terminology consistent throughout the specification?

**Guidance**: Create and apply a glossary:

- Define domain-specific terms once, use consistently
- Avoid synonyms (use "user" not "user/customer/client")
- Distinguish similar concepts (sessions vs. connections, requests vs. transactions)
- Use standard industry terminology
- Document deviations from standard meaning

**Success Criteria**:

- Glossary of key terms exists
- Terminology is used consistently across the document
- Abbreviations are defined on first use
- Related terms are explicitly distinguished

**Spec Reference**: [Spec §FR-1] (Clarity dimension), [Spec §SC-8]

---

### CHK-009-Clarity

**Question**: Are acceptance criteria unambiguous and testable?

**Guidance**: Express acceptance criteria in Gherkin (Given-When-Then) format:

- **Given** [initial state]
- **When** [user action]
- **Then** [expected outcome]

Ensure each criterion is:

- Specific (not "works well" but "returns within 500ms")
- Observable (can be verified by test/human)
- Feasible to implement in one sprint
- Independent of other criteria

**Success Criteria**:

- All acceptance criteria follow Given-When-Then format
- Each criterion is independently testable
- Success/failure is objectively determinable
- No acceptance criteria require clarification

**Spec Reference**: [Spec §FR-1] (Clarity dimension), [Spec §SC-9]

---

### CHK-010-Clarity

**Question**: Are visual/interaction requirements clearly described?

**Guidance**: For UI/UX requirements, specify:

- Layout and component placement (wireframes or detailed descriptions)
- Visual styling (colors, fonts, spacing, icons)
- Interaction patterns (hover states, focus indicators, animations)
- Responsive behavior (breakpoints, mobile/tablet/desktop layouts)
- Accessibility features (color contrast, alt text, keyboard support)
- Error states and validation feedback

**Success Criteria**:

- Wireframes or detailed layout descriptions exist
- Visual design tokens are documented (colors, typography)
- Interaction states are specified (hover, focus, active, disabled)
- Responsive breakpoints are defined
- Keyboard shortcuts and navigation patterns are documented

**Spec Reference**: [Spec §FR-1] (Clarity dimension), [Spec §SC-10], [Spec §FR-3] (UX domain specifics)

---

### CHK-011-Clarity

**Question**: Are data formats explicitly specified?

**Guidance**: For each data structure, document:

- Field names and types (string, integer, date, enum)
- Required vs. optional fields
- Valid ranges or enumerated values
- String length constraints
- Date/time formats (ISO 8601, timezone handling)
- JSON schemas or database schemas
- Example payloads

**Success Criteria**:

- JSON schema or equivalent exists for all API payloads
- Database schema (or ORM definitions) is documented
- Data types and constraints are specified
- Example data is provided for each structure
- Nullable/optional fields are clearly marked

**Spec Reference**: [Spec §FR-1] (Clarity dimension), [Spec §FR-3] (API domain specifics)

---

### CHK-012-Clarity

**Question**: Are decision criteria clear?

**Guidance**: For each conditional logic, document:

- All decision branches (if-then-else scenarios)
- Conditions for triggering each branch
- Business rules and precedence
- Default behavior if no condition matches
- Exception handling

Example:
"If order total > $100 AND customer is VIP, apply 20% discount. Else if order total > $50, apply 10% discount. Otherwise no discount."

**Success Criteria**:

- All conditional paths are enumerated
- Conditions are expressed in concrete terms
- Default/fallback behavior is specified
- Precedence is explicit (which rules apply first)
- Edge cases are handled

**Spec Reference**: [Spec §FR-1] (Clarity dimension), [Spec §FR-4] (Decision logic clarity)

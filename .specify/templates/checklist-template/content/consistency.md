# Consistency Dimension Items

Requirements do not conflict internally or externally, and terminology is used consistently.

## Definition

A specification has consistency when:

- No requirements contradict each other
- Related requirements support rather than conflict with each other
- Terminology is used uniformly throughout
- Non-functional requirements align with implementation constraints
- Dependencies are documented in both directions
- Scope boundaries are consistently maintained

## Items (5 total)

### CHK-013-Consistency

**Question**: Are there conflicting requirements within the specification?

**Guidance**: Identify potential conflicts:

- Mutually exclusive requirements (cannot both be true)
- Resource conflicts (two features competing for same resource/budget)
- Timeline conflicts (contradictory deadlines)
- Scope conflicts (overlapping feature ownership)
- Technical conflicts (incompatible technologies)

Create a conflict matrix documenting:

- Identified conflicts
- Resolution or explicit trade-off decision
- Impacted stakeholders

**Success Criteria**:

- No unresolved internal conflicts
- Conflicts are explicitly acknowledged with rationale
- Mutually exclusive scenarios are clearly separated
- Trade-offs are documented and approved

---

### CHK-014-Consistency

**Question**: Do related requirements contradict each other?

**Guidance**: Check relationships between:

- Functional and non-functional requirements (e.g., unlimited scale vs. fixed infrastructure)
- Sequential requirements (e.g., "complete in 2 weeks" vs. "requires 3 weeks of design review")
- Cross-system requirements (e.g., API rate limits vs. batch processing volume)
- Quality vs. cost (e.g., "highest reliability" vs. "lowest cost infrastructure")

Document explicit reconciliation for each relationship:

- How contradictions are resolved
- Which requirement takes precedence
- What trade-offs are accepted

**Success Criteria**:

- Related requirements are explicitly cross-referenced
- Contradictions are identified and resolved
- Precedence is clear (which requirement wins if conflict)
- Compromises are documented with stakeholder approval

---

### CHK-015-Consistency

**Question**: Is terminology usage consistent across the specification?

**Guidance**: Perform a terminology audit:

- Create master glossary of domain terms
- Verify consistent spelling and usage throughout
- Ensure acronyms are defined and used consistently
- Mark synonyms as non-preferred (use one term consistently)
- Document standard industry terminology usage

Example: "User" vs "Customer" vs "Client" — pick one and use it everywhere.

**Success Criteria**:

- Glossary exists and is comprehensive
- No unexplained synonyms in the specification
- Capitalization is consistent (e.g., "API" not "api" or "Api")
- Acronyms defined on first use and consistent thereafter

---

### CHK-016-Consistency

**Question**: Do security requirements align with performance/scalability constraints?

**Guidance**: Verify alignment between:

- Encryption overhead vs. performance targets (e.g., TLS 1.3 overhead <10ms)
- Audit logging scope vs. scalability (e.g., logging all requests at 10k req/s = viable?)
- Data retention (encryption keys) vs. compliance (e.g., key rotation frequency)
- Authentication mechanisms vs. user experience (e.g., MFA usability for mobile)
- Network isolation vs. integration requirements (e.g., API firewall rules)

Document:

- Security-performance trade-offs
- Validation that constraints are achievable
- Monitoring/alerting if constraints are violated

**Success Criteria**:

- Security requirements include performance impact estimates
- Performance targets account for security overhead
- Scalability targets are validated against encryption/audit costs
- No unresolved security-performance conflicts

---

### CHK-017-Consistency

**Question**: Are dependencies documented in both directions?

**Guidance**: Create dependency matrix:

- Forward: "Feature A depends on API B"
- Backward: "API B is required by Feature A"
- Transitive: "Feature A → System B → Service C" (chain documented)

For each dependency document:

- Which component depends on which
- Failure mode if dependency is unavailable
- Fallback behavior
- Timing constraints (must X complete before Y?)

**Success Criteria**:

- Dependency graph is complete
- Forward and backward dependencies match
- Circular dependencies are identified and resolved
- Timing and sequencing constraints are explicit
- Failure modes for each dependency are specified

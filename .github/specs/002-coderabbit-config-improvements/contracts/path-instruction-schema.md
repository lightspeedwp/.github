# Contract: PathInstruction Schema

**Phase 1 Design Deliverable** | **Date**: 2026-09-17 | **For**: Code Review Instructions

---

## Overview

This contract defines the schema, validation rules, and enforcement criteria for PathInstruction entities in `.coderabbit.yml`. PathInstruction blocks map file path patterns to review guidance, forming the core of code review instruction delivery.

---

## Structure & Fields

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `priority` | Integer | Yes | 1-100; lower=less specific; higher=more specific |
| `paths` | String[] | Yes | ≥1 glob patterns; standard glob syntax |
| `instructions` | String | Yes | Markdown; 150-5000 chars; 3-4 focus areas; technology-agnostic |
| `branch_context` | Object | No | Metadata linking to BranchContext entries (documentation only) |

---

## Validation Rules

### priority Field

- Range: 1-100 (100=highest specificity, 1=lowest)
- Uniqueness: No two entries with same priority for overlapping paths
- Ordering: Processed descending (100→1)
- Conflict: First-match wins when multiple patterns match same file

### paths Field

- Array of ≥1 glob patterns (standard glob: **, *, ?, [abc], etc.)
- Valid: `.specify/spec.md`, `**/*.md`, `**/e2e/*.spec.ts`
- Avoid duplicates across entries (clarity)

### instructions Field

- Markdown format; 150-5000 characters
- REQUIRED: 3-4 focus areas (## heading level 2)
- REQUIRED: 2-3 actionable checks per focus area
- FORBIDDEN: Framework/language-specific guidance
  - ❌ "Use React hooks", "WordPress filters", "async/await"
  - ✅ "Ensure error handling is comprehensive"
  - ✅ "Validate all external input"

### branch_context Field (Optional)

- Metadata only; NOT enforced by CodeRabbit
- `relevant_for`: Array of 38 authorized branch types
- Used for documentation cross-reference

---

## Enforcement

### Pre-Deploy

- Schema validation (required fields, types, ranges)
- No duplicate priorities within overlapping paths
- Instructions: ≥3 focus areas (## count ≥3)
- Instructions: No framework/language-specific patterns

### Runtime (CodeRabbit)

- Entries ordered by priority (descending)
- First matching pattern wins (no cascading)
- Catch-all (`**/*`) applies if no specific pattern matches

### Accuracy Targets (FR-002, SC-002, SC-009)

- ≥95% file type coverage
- ≥3 focus areas per block
- ≥2 checks per focus area
- ≥85% of reviews cite relevant instructions

---

## Examples

### Specification File (High Priority)

```yaml
- priority: 95
  paths: [".specify/spec.md"]
  instructions: |
    ## Specification Review
    
    ### Focus Area 1: Completeness
    - User stories include Why, Independent Test, Acceptance Scenarios
    - All requirements numbered (FR-001, etc.)
    - Success criteria measurable and testable
    
    ### Focus Area 2: Clarity
    - Requirements specific, testable (no "should", "may")
    - NEEDS CLARIFICATION resolved
    - Terminology consistent
    
    ### Focus Area 3: Consistency
    - Requirements aligned, no conflicts
    - Cross-references valid
    - No duplication
  branch_context:
    relevant_for: ["docs/", "feat/", "refactor/"]
```

### Code Files (Medium Priority)

```yaml
- priority: 50
  paths: ["**/*.{ts,js,php}"]
  instructions: |
    ## Code Quality Review
    
    ### Focus Area 1: Correctness
    - Edge cases handled (null, empty, errors)
    - Error handling comprehensive
    - State management clean
    
    ### Focus Area 2: Performance & Security
    - No hardcoded values
    - Optimized operations
    - Input validation present
    - No hardcoded secrets
    
    ### Focus Area 3: Maintainability
    - Follows project conventions
    - No duplication (DRY)
    - Dependencies minimal
```

### Catch-All (Lowest Priority)

```yaml
- priority: 10
  paths: ["**/*"]
  instructions: |
    ## Universal Code Quality
    
    ### Focus Area 1: Readability
    - Clear and understandable
    - Descriptive names
    - Complex logic commented
    
    ### Focus Area 2: Correctness
    - Sound logic
    - Edge cases handled
    - Error handling present
    
    ### Focus Area 3: Maintainability
    - Follows conventions
    - No duplication
    - Minimal dependencies
```

---

**Status**: ✅ SCHEMA DEFINED | Ready for integration

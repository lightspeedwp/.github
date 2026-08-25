# analyze-prompt Unit Tests

Unit tests for clarity analysis framework (Phase 3 deliverable).

## Test Categories

### 1. Completeness Tests (10+ test cases)

Tests for missing elements detection:

- [ ] Test: Detects missing goal statement
- [ ] Test: Detects missing input specification
- [ ] Test: Detects missing output specification
- [ ] Test: Detects missing success criteria
- [ ] Test: Detects missing error handling
- [ ] Test: Detects missing dependencies
- [ ] Test: Accepts complete prompts (no missing elements)
- [ ] Test: Handles prompts with partial completeness
- [ ] Test: Validates completeness score ranges 0-10
- [ ] Test: Provides actionable recommendations for missing elements

### 2. Specificity Tests (10+ test cases)

Tests for vague vs. specific language:

- [ ] Test: Detects vague action verbs (handle, manage, process)
- [ ] Test: Detects undefined technical terms
- [ ] Test: Validates specific vs. vague instructions
- [ ] Test: Checks for concrete examples
- [ ] Test: Identifies ambiguous phrases
- [ ] Test: Validates use of measurable terms
- [ ] Test: Handles edge cases (very specific prompts)
- [ ] Test: Provides specificity score accurately
- [ ] Test: Suggests term clarifications
- [ ] Test: Handles technical jargon appropriately

### 3. Constraint Tests (10+ test cases)

Tests for scope and limitation documentation:

- [ ] Test: Detects missing scope boundaries
- [ ] Test: Validates explicit vs. implicit constraints
- [ ] Test: Checks for performance requirements
- [ ] Test: Validates resource limit documentation
- [ ] Test: Checks for time constraints
- [ ] Test: Validates priority hierarchy
- [ ] Test: Handles implicit constraints (auto-detect)
- [ ] Test: Provides constraint score accurately
- [ ] Test: Suggests constraint improvements
- [ ] Test: Handles conflicting constraints

### 4. Context Detection Tests (10+ test cases)

Tests for automatic context detection:

- [ ] Test: Detects .github context from keywords
- [ ] Test: Detects .github context from syntax patterns
- [ ] Test: Detects WordPress plugin context
- [ ] Test: Detects WordPress theme context
- [ ] Test: Falls back to 'generic' for unknown context
- [ ] Test: Handles mixed-context prompts
- [ ] Test: Respects context override (environment variable)
- [ ] Test: Validates context detection accuracy (>90%)
- [ ] Test: Handles null/undefined context gracefully
- [ ] Test: Documents detected context in response

### 5. Score Calculation Tests (5+ test cases)

Tests for accuracy of overall clarity score:

- [ ] Test: Calculates score as (C + S + Cn) / 3
- [ ] Test: Returns score in 0-10 range
- [ ] Test: Handles edge cases (all 0s, all 10s)
- [ ] Test: Validates score interpretation bands
- [ ] Test: Provides consistent scores for same prompt

### 6. Real Prompt Tests (5+ test cases)

Tests using actual prompts from repositories:

- [ ] Test: .github workflow prompt
- [ ] Test: WordPress plugin hook prompt
- [ ] Test: WordPress theme design token prompt
- [ ] Test: Generic improvement prompt
- [ ] Test: Complex multi-part prompt

## Success Criteria

- ✅ All test cases passing
- ✅ 80%+ code coverage
- ✅ Response structure matches API spec
- ✅ Scores remain consistent (deterministic)
- ✅ Context detection >90% accurate
- ✅ All recommendations are actionable

## Implementation Notes

These tests will be implemented in Phase 3 (Testing & Validation) with proper test fixtures and assertions. This file serves as specification for test coverage targets.

**Target Test Count:** 40+ unit tests  
**Target Coverage:** 80%+  
**Phase:** 3 (Implementation)

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

---
file_type: test-manifest
title: Project Meta Sync Agent v2 — Testing Roadmap & Manifest
description: "Complete testing strategy tied to OPENSPEC acceptance criteria"
version: 1.0.0
created_date: 2026-08-12
---

# Testing Roadmap & Manifest

This document ties the complete testing strategy to OPENSPEC acceptance criteria and provides a unified roadmap for validation.

---

## Quick Links to OPENSPEC Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| [OPENSPEC.md](./OPENSPEC.md) | Formal specification with success criteria | Architecture, Sign-off |
| [OPENSPEC_FLESHED_OUT.md](./OPENSPEC_FLESHED_OUT.md) | Executive summary + implementation spec | Implementation team |
| [OPENSPEC_IMPLEMENTATION_VALIDATION.md](./OPENSPEC_IMPLEMENTATION_VALIDATION.md) | Test specifications with code examples | QA engineers, test developers |
| [VALIDATION_SCENARIOS.md](./VALIDATION_SCENARIOS.md) | 8 test scenarios + acceptance criteria | Testers, manual validation |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | 4-5 day roadmap with test strategy | Project management, scheduling |

---

## Testing Strategy Overview

### Test Pyramid

```
        E2E (10%)
       /        \
      /          \
   Integration   /
     (20%)       /
    /           /
   /           /
Unit Tests (60%)
```

**Target Coverage:** 80%+ across all layers  
**Total Tests:** 100–130 tests  
**Execution Time:** ~5 minutes  
**CI Pipeline:** GitHub Actions (`.github/workflows/test-*.yml`)

### Test Distribution

| Layer | Percentage | Count | Time | Tools |
|-------|-----------|-------|------|-------|
| **Unit** | 60% | 60–80 | 1–2 min | Jest, Vitest |
| **Integration** | 20% | 20–26 | 2–3 min | Jest, GitHub API mock |
| **E2E** | 10% | 10–13 | 1–2 min | Playwright, real GitHub |
| **Total** | 100% | 100–130 | ~5 min | — |

---

## Phase 5B.2 Testing Requirements

### Pre-Merge Validation Checklist

**Before submitting Phase 5B.2 PR, validate:**

- [ ] All 8 validation scenarios pass (VALIDATION_SCENARIOS.md)
- [ ] Acceptance criteria met for each scenario
- [ ] 80%+ code coverage achieved (all layers)
- [ ] No new warnings in CI pipeline
- [ ] Agent prompt tested with real users
- [ ] Documentation complete and linked
- [ ] Related issues updated with progress

### Acceptance Criteria Mapping

**Core Scenarios (VALIDATION_SCENARIOS.md §1–3)**

| Scenario | Acceptance Criteria | Test Type | OpenSpec Link |
|----------|-------------------|-----------|---------------|
| **1. Label Audit** | 9 checkpoints | Integration | OPENSPEC_IMPLEMENTATION_VALIDATION.md §5.2 |
| **2. Project Sync** | 7 checkpoints | Integration | OPENSPEC_IMPLEMENTATION_VALIDATION.md §5.3 |
| **3. Release Validation** | 9 checkpoints | E2E | OPENSPEC_IMPLEMENTATION_VALIDATION.md §5.4 |

**Advanced Scenarios (VALIDATION_SCENARIOS.md §4–5)**

| Scenario | Acceptance Criteria | Test Type | OpenSpec Link |
|----------|-------------------|-----------|---------------|
| **4. Label Discovery** | 5 checkpoints | Unit | OPENSPEC_IMPLEMENTATION_VALIDATION.md §5.5 |
| **5. Handoff to Specialist** | 5 checkpoints | Unit | OPENSPEC_IMPLEMENTATION_VALIDATION.md §5.6 |

**Error Scenarios (VALIDATION_SCENARIOS.md §6–8)**

| Scenario | Acceptance Criteria | Test Type | Recovery Path |
|----------|-------------------|-----------|----------------|
| **E1. Rate Limit** | Graceful retry | Integration | API client recovery |
| **E2. Missing Label** | Clarification prompt | Unit | Label validation |
| **E3. Ambiguous Input** | Options presented | Unit | User clarification |

---

## Test Specifications by Layer

### Unit Tests (60%)

**Count:** 60–80 tests  
**Location:** `tests/unit/`  
**Coverage Target:** 90%+  
**Reference:** OPENSPEC_IMPLEMENTATION_VALIDATION.md §4.1

**Test Files:**

1. **label-utils.test.js** (12 tests)
   - Label validation
   - Label parsing
   - Label formatting
   - Edge cases (special chars, length, reserved words)

2. **audit.test.js** (15 tests)
   - Audit analysis
   - Coverage calculation
   - Deficit detection
   - Report generation

3. **sync.test.js** (18 tests)
   - Label application
   - Batch operations
   - Conflict resolution
   - Rollback scenarios

4. **api-client.test.js** (10 tests)
   - GitHub API calls
   - Error handling
   - Retry logic
   - Rate limit detection

5. **agent-prompt.test.js** (15 tests)
   - Prompt parsing
   - Intent classification
   - Option generation
   - Response formatting

### Integration Tests (20%)

**Count:** 20–26 tests  
**Location:** `tests/integration/`  
**Coverage Target:** 75%+  
**Reference:** OPENSPEC_IMPLEMENTATION_VALIDATION.md §4.2

**Test Files:**

1. **orchestrator.test.js** (8 tests)
   - End-to-end CLI command flow
   - Orchestrator invocation patterns
   - Result aggregation
   - Error propagation

2. **github-api.test.js** (6 tests)
   - Real GitHub API integration (mock mode)
   - Issue/PR labeling
   - Project field updates
   - Milestone synchronization

3. **workflow-integration.test.js** (6 tests)
   - Workflow trigger simulation
   - Meta-labels-sync workflow
   - Label-audit-report workflow
   - Result validation

4. **phase-5a-handoff.test.js** (6 tests)
   - Release metadata validation
   - Validation result structure
   - Tier 1/2/3 validation
   - Release Agent integration points

### E2E Tests (10%)

**Count:** 10–13 tests  
**Location:** `tests/e2e/`  
**Coverage Target:** 60%+  
**Reference:** OPENSPEC_IMPLEMENTATION_VALIDATION.md §4.3

**Test Files:**

1. **real-github-repo.test.js** (10 tests)
   - Full workflow on test repository
   - Scenario 1: Label audit + fix
   - Scenario 2: Project field sync
   - Scenario 3: Release validation
   - Error recovery paths

2. **user-conversations.test.js** (3 tests)
   - Real agent prompt interaction
   - Scenario execution walkthroughs
   - Response validation

---

## Validation Scenarios Execution Plan

### Before PR Merge

**Manual Testing Checklist** (from VALIDATION_SCENARIOS.md §7)

Test each scenario with agent prompt:

- [ ] **Scenario 1 (Audit)** — Copy user ask, verify acceptance criteria
- [ ] **Scenario 2 (Sync)** — Run orchestrator command, validate results
- [ ] **Scenario 3 (Release)** — Test Tier 1/2 validation
- [ ] **Scenario 4 (Discovery)** — Verify taxonomy explanation
- [ ] **Scenario 5 (Handoff)** — Confirm specialist handoff
- [ ] **Error 1 (Rate Limit)** — Simulate API limit, verify recovery
- [ ] **Error 2 (Missing Label)** — Test clarification prompt
- [ ] **Error 3 (Ambiguous Input)** — Verify option presentation

### Sign-Off Template

```markdown
## Validation Results

**Tester:** [name]  
**Date:** 2026-08-XX  
**Agent Prompt Version:** 1.0

### Core Scenarios
- [ ] Scenario 1 (audit) — PASS
- [ ] Scenario 2 (sync) — PASS
- [ ] Scenario 3 (release) — PASS
- [ ] Scenario 4 (discovery) — PASS
- [ ] Scenario 5 (handoff) — PASS

### Error Scenarios
- [ ] Error 1 (rate limit) — PASS
- [ ] Error 2 (missing label) — PASS
- [ ] Error 3 (ambiguous input) — PASS

### Issues Found & Fixed
[List issues and resolutions]

### Final Recommendation
**APPROVED** / **APPROVED WITH COMMENTS** / **NEEDS REWORK**

Tester: [signature]
```

---

## Coverage Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.test.{js,ts}',
    '!src/index.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/core/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
```

### Coverage Targets by Module

| Module | Target | Rationale |
|--------|--------|-----------|
| Label utils | 90% | Core logic, heavy use |
| Audit engine | 85% | Complex analysis |
| Sync executor | 85% | Critical path |
| API client | 80% | External dependency |
| Agent prompt | 75% | User-facing, harder to test |

---

## OpenSpec Acceptance Criteria Checklist

**All tests must validate these OpenSpec criteria (OPENSPEC.md §5):**

### Functional Requirements

- [ ] Agent audits labels correctly (OPENSPEC §5.1)
- [ ] Orchestrator invokes correct commands (OPENSPEC §5.2)
- [ ] Project fields sync with labels (OPENSPEC §5.3)
- [ ] Release validation works (Tier 1/2/3) (OPENSPEC §5.4)
- [ ] Handoff to specialists triggered correctly (OPENSPEC §5.5)

### Non-Functional Requirements

- [ ] 80%+ code coverage (OPENSPEC §5.6)
- [ ] Response time < 5 seconds per operation (OPENSPEC §5.7)
- [ ] 99%+ reliability (retries work) (OPENSPEC §5.8)
- [ ] Clear error messages (OPENSPEC §5.9)

### Integration Requirements

- [ ] Phase 3-4 orchestrator works seamlessly (OPENSPEC §5.10)
- [ ] Phase 5A validation contract honored (OPENSPEC §5.11)
- [ ] GitHub API integration stable (OPENSPEC §5.12)

---

## Phase 5B.2 Testing Timeline

### Day 1–2: Unit Tests

- Implement 60–80 unit tests
- Achieve 90%+ coverage on core modules
- ~4 hours dev + 1 hour debugging

### Day 2–3: Integration Tests

- Implement 20–26 integration tests
- Test orchestrator patterns
- Mock GitHub API
- ~3 hours dev + 1 hour debugging

### Day 3–4: E2E Tests

- Implement 10–13 E2E tests
- Test on real GitHub test repository
- Validate all 8 scenarios
- ~3 hours dev + 2 hours testing

### Day 4–5: Validation & Sign-Off

- Manual scenario testing (VALIDATION_SCENARIOS.md)
- Coverage report review
- Documentation validation
- ~2 hours testing + 1 hour sign-off

---

## CI Pipeline Integration

### Test Workflows

**File:** `.github/workflows/test-unit.yml`

- Runs on every PR
- Runs unit tests
- Checks coverage (80%+ required)
- Time: ~2 minutes

**File:** `.github/workflows/test-integration.yml`

- Runs on every PR
- Runs integration tests
- Mocks GitHub API
- Time: ~3 minutes

**File:** `.github/workflows/test-e2e.yml`

- Runs on PR to develop
- Runs E2E tests on test repo
- Real GitHub API
- Time: ~5 minutes

### Required Checks Before Merge

```yaml
required_status_checks:
  - test-unit (coverage >= 80%)
  - test-integration (no failures)
  - test-e2e (on develop branch)
  - code-review (at least 1 approval)
  - openspec-validation (criteria met)
```

---

## Troubleshooting & Recovery

### If Unit Tests Fail

1. Check coverage report: `npm run coverage:report`
2. Review test output for specific failure
3. Update test or fix implementation
4. Re-run: `npm run test:unit`

### If Integration Tests Fail

1. Check mock GitHub API setup
2. Verify orchestrator command format
3. Check error logs for API issues
4. Re-run: `npm run test:integration`

### If E2E Tests Fail

1. Check test repository is available
2. Verify GitHub token has correct scopes
3. Check network connectivity
4. Review real API error responses
5. Re-run: `npm run test:e2e`

### If Coverage Falls Below 80%

1. Identify uncovered code: `npm run coverage:report -- --verbose`
2. Add tests for uncovered paths
3. Mark legitimate exclusions (e.g., fallbacks)
4. Re-run: `npm run coverage`

---

## Success Metrics

**Phase 5B.2 is complete when:**

✅ 100–130 tests implemented  
✅ 80%+ code coverage achieved  
✅ All 8 validation scenarios pass  
✅ All CI checks green  
✅ Agent prompt tested with real users  
✅ OpenSpec acceptance criteria met  
✅ Documentation complete  
✅ Sign-off obtained  

---

## Related Documentation

- **OPENSPEC.md** — Formal specification (acceptance criteria authority)
- **OPENSPEC_FLESHED_OUT.md** — Executive summary + implementation spec
- **OPENSPEC_IMPLEMENTATION_VALIDATION.md** — Test specs with code examples
- **VALIDATION_SCENARIOS.md** — 8 scenarios with acceptance criteria
- **IMPLEMENTATION_PLAN.md** — Test strategy & architecture

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

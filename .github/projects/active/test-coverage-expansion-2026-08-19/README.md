# Test Coverage Expansion Initiative

**Status:** 🟢 Active  
**Started:** 2026-08-19  
**Phases:** 5 (Sequential)  
**Total Effort:** 4-5 weeks  
**Target Coverage:** 80%+ overall (75%+ per script)

**Completed Phases:**
- ✅ [Phase 3B & 4A](../test-coverage-expansion-phase-3b-4a-2026-08-19/) — 227 tests for automation scripts

---

## Related Projects

**Active Coverage Work:**
- [test-coverage-expansion-phase-3b-4a-2026-08-19](../test-coverage-expansion-phase-3b-4a-2026-08-19/) — ✅ **COMPLETE** — 227 tests for pr-triage-orchestrator, sync-pr-labels, staging-validation (Phase 3B unit) + 4 integration workflows (Phase 4A)

---

## Project Overview

Systematic expansion of test coverage across validation, automation, workflow, and utility scripts in the `.github` control plane. Currently **66+ scripts are untested**, creating risk for silent failures in CI/CD pipelines.

This project establishes comprehensive test coverage for all critical systems through a prioritized 5-phase approach (Phase 3B & 4A completed).

---

## Phases

### Phase 1: Critical Validation Scripts (Week 1)
**Status:** 🟡 In Progress  
**Priority:** P0 — Core validation system reliability

| Script | Lines | Complexity | Status |
|--------|-------|-----------|--------|
| `validate-mermaid-syntax.js` | 200+ | Medium | 🟡 Starting |
| `validate-mermaid-accessibility.js` | 16KB | High | 🟡 Starting |
| `validate-frontmatter-freshness.js` | 150+ | Medium | 🟡 Starting |
| `validate-links.js` | 71 | Low | 🟡 Starting |
| `validate-structure.js` | 200+ | Medium | 🟡 Starting |

**Expected Output:** 40-60 test cases, 85%+ coverage per script

**Related Issues:**
- [#TBD] Phase 1: Critical Validation Tests

### Phase 2: Automation Scripts (Weeks 2-3)
**Status:** 🔲 Not Started  
**Priority:** P1 — Automation reliability

| Script | Lines | Complexity | Status |
|--------|-------|-----------|--------|
| `audit-issue-metadata.js` | 200+ | Medium | 🔲 Pending |
| `dor-dod-templates.js` | 250+ | Medium | 🔲 Pending |
| `pr-triage-orchestrator.js` | 300+ | High | 🔲 Pending |
| `bulk-issue-metadata-updater.js` | 200+ | Medium | 🔲 Pending |
| `label-heuristics.js` | 500+ | High | 🔲 Pending |
| `label-sync.js` | 350+ | High | 🔲 Pending |

**Expected Output:** 60-80 test cases, 80%+ coverage per script

**Related Issues:**
- [#TBD] Phase 2: Automation Scripts Tests

### Phase 3: Workflow & Metrics Scripts (Week 4)
**Status:** 🔲 Not Started  
**Priority:** P2 — Reporting & observability

| Script | Lines | Complexity | Status |
|--------|-------|-----------|--------|
| `collect-metrics.js` | 250+ | High | 🔲 Pending |
| `generate-metrics-report.js` | 200+ | Medium | 🔲 Pending |
| `assign-milestones-workflow.js` | 150+ | Medium | 🔲 Pending |
| `anomaly-detector.js` | 200+ | High | 🔲 Pending |
| `metrics-agent.js` | 250+ | High | 🔲 Pending |

**Expected Output:** 50-70 test cases, 75%+ coverage per script

**Related Issues:**
- [#TBD] Phase 3: Workflow & Metrics Tests

### Phase 4: Utility Scripts (Weeks 5-6)
**Status:** 🔲 Not Started  
**Priority:** P3 — Edge case handling

**Categories:**
- Footer injection (3 scripts)
- Badge utilities (4 scripts)
- Markdown utilities (3 scripts)
- Audit utilities (3 scripts)
- Other utilities (15+ scripts)

**Expected Output:** 80-100 test cases, 70%+ coverage per script

**Related Issues:**
- [#TBD] Phase 4: Utility Scripts Tests

### Phase 5: Integration & Regression (Week 7)
**Status:** 🔲 Not Started  
**Priority:** P3 — Continuous improvement

**Focus Areas:**
- Label workflow end-to-end testing
- Issue triage workflow integration
- Release workflow validation
- Metrics collection pipeline

**Expected Output:** 40-50 integration test cases, 60%+ end-to-end coverage

**Related Issues:**
- [#TBD] Phase 5: Integration Tests

---

## Deliverables

### Phase 1 Deliverables
- [ ] Test file: `scripts/validation/__tests__/validate-mermaid-syntax.test.js`
- [ ] Test file: `scripts/validation/__tests__/validate-mermaid-accessibility.test.js`
- [ ] Test file: `scripts/validation/__tests__/validate-frontmatter-freshness.test.js`
- [ ] Test file: `scripts/validation/__tests__/validate-links.test.js`
- [ ] Test file: `scripts/validation/__tests__/validate-structure.test.js`
- [ ] Test fixtures in `tests/fixtures/validation/`
- [ ] PR with 40-60 test cases
- [ ] Coverage report showing 85%+ per script

---

## Related Issues

### Epic
- [#TBD] Test Coverage Expansion Initiative (Master Epic)

### Phase Issues
- [#TBD] Phase 1: Critical Validation Tests
- [#TBD] Phase 2: Automation Scripts Tests
- [#TBD] Phase 3: Workflow & Metrics Tests
- [#TBD] Phase 4: Utility Scripts Tests
- [#TBD] Phase 5: Integration Tests

---

## Success Criteria

### Phase 1 Success
- ✅ All 5 validation scripts have test files
- ✅ 40+ test cases written and passing
- ✅ 85%+ code coverage per script
- ✅ Fixtures created for all test scenarios
- ✅ PR merged to `develop`

### Overall Project Success
- ✅ 80%+ overall test coverage across all scripts
- ✅ CI/CD enforces coverage minimums (--collectCoverageFrom)
- ✅ All 4 phases completed within 4 weeks
- ✅ Maintenance plan in place (quarterly reviews, PR requirements)

---

## Testing Strategy

### Unit Tests
```javascript
describe('validate-script-name', () => {
  describe('function-name', () => {
    it('should handle happy path', () => { })
    it('should handle error cases', () => { })
    it('should handle edge cases', () => { })
  })
})
```

### Fixtures
```
tests/fixtures/
  validation/
    markdown/
      valid-mermaid.md
      invalid-mermaid.md
    frontmatter/
      valid-frontmatter.md
```

### Mocking
- Mock `fs` for file I/O tests
- Mock `child_process` for Git integration
- Use real fixtures where possible

---

## Coverage Targets

| Category | Target | Current |
|----------|--------|---------|
| Validation scripts | 85%+ | ~55% |
| Automation scripts | 80%+ | ~50% |
| Utility scripts | 70%+ | ~20% |
| Overall | 80%+ | ~45% |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Complex test setup | Delays Phase 1 | Pre-build fixture library |
| Git integration tests flaky | Blocks automation | Mock execSync for CI safety |
| Large files slow tests | CI timeout | Lazy-load fixtures, timeout config |
| Test maintenance burden | Coverage decay | Quarterly reviews, PR requirements |

---

## Resources

### Documentation
- [TEST_COVERAGE_ANALYSIS.md](../../../docs/TEST_COVERAGE_ANALYSIS.md) — Detailed analysis of each script
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) — Implementation guide (TBD)

### Existing Tests
- `scripts/validation/__tests__/validate-frontmatter.test.js` — Good pattern
- `scripts/automation/__tests__/handle-needs-triage.test.js` — Good pattern
- `scripts/agents/includes/__tests__/label-heuristics.test.js` — Good pattern

### Jest Configuration
- `.jest.config.cjs` — Test setup
- `tests/jest.setup.globals.js` — Global setup

---

## Timeline

```
Week 1 (Aug 19-23): Phase 1 - Critical Validation
├─ Mon-Tue: Mermaid tests (syntax + accessibility)
├─ Wed: Frontmatter freshness tests
└─ Thu-Fri: Links + structure tests

Week 2-3 (Aug 26-Sep 6): Phase 2 - Automation
├─ Week 2: Metadata audit + DoR/DoD templates
└─ Week 3: Triage orchestration + label systems

Week 4 (Sep 9-13): Phase 3 - Workflow & Metrics
├─ Mon-Tue: Metrics collection + reporting
└─ Wed-Fri: Integration tests setup

Week 5-6 (Sep 16-27): Phase 4 - Utilities
├─ Week 5: Footer + badge utilities
└─ Week 6: Markdown + audit utilities

Week 7 (Sep 30-Oct 4): Phase 5 - Integration
└─ Complete end-to-end test suite
```

---

## Maintenance Plan

### Before Merge
- [ ] Run full test suite: `npm run test`
- [ ] Check coverage: `npm run test -- --coverage`
- [ ] Verify 85%+ coverage per Phase 1 script
- [ ] Code review for test quality

### After Merge
- [ ] Update CI/CD to enforce coverage minimums
- [ ] Add coverage badge to README
- [ ] Schedule quarterly coverage reviews
- [ ] Require tests for all new scripts

---

## Related Documentation

- [CLAUDE.md](../../../CLAUDE.md) — Repository guidelines
- [docs/BRANCHING_STRATEGY.md](../../../docs/BRANCHING_STRATEGY.md) — Branch naming rules
- [docs/TESTING_STANDARDS.md](../../../docs/TESTING_STANDARDS.md) — Testing conventions (TBD)

---

**Author:** Claude Code  
**Last Updated:** 2026-08-19  
**Status:** 🟢 Active Phase 1

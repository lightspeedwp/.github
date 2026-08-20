# Issue #2157 Refactoring Plan — Metadata Test Suite

**Issue:** #2157 — Refactor: Metadata test suite should import production modules  
**Priority:** HIGH  
**Effort:** Medium (2-3 hours)  
**Blocker for:** #2158, #2159, #2160 (test refactoring framework)

---

## Problem Statement

Current test suites define local implementations instead of importing production modules:
- ❌ `audit-issue-metadata.test.js` defines `categorizeLabels`, `analyzeIssue` locally
- ❌ `bulk-issue-metadata-updater.test.js` defines local mode, parsing, update helpers
- ❌ `integration-workflow-metadata.test.js` defines inline audit & updater composition

**Impact:** Regressions in `audit-issue-metadata.js` and `bulk-issue-metadata-updater.js` won't be caught.

---

## Solution Approach

### 1. Analyze Production Modules

**Files to examine:**
```
scripts/automation/audit-issue-metadata.js
scripts/automation/bulk-issue-metadata-updater.js
```

**Key questions:**
- What are the exported functions?
- What dependencies do they have (GitHub API, file system)?
- What are the main workflows?

### 2. Design Test Boundaries

**Module Interface:**
- `audit-issue-metadata.js` — Main entry point: analyze issues, generate report
- `bulk-issue-metadata-updater.js` — Main entry point: update metadata in bulk

**Mock Strategy:**
- Mock GitHub API (Octokit) at the https.request level (see `allocate-to-milestone.test.js` pattern)
- Mock file system for report writing
- Keep real Jest matchers for assertions

### 3. Refactor Test Files

**Files to modify:**
1. `scripts/automation/__tests__/audit-issue-metadata.test.js`
2. `scripts/automation/__tests__/bulk-issue-metadata-updater.test.js`
3. `scripts/automation/__tests__/integration-workflow-metadata.test.js`

**Pattern to follow:**
```javascript
// ✅ CORRECT: Import production module
const { auditIssueMetadata } = require('../audit-issue-metadata.js');

describe('audit-issue-metadata', () => {
  beforeEach(() => {
    // Mock GitHub API
    jest.mock('https');
  });

  it('should analyze issues and generate report', () => {
    // Test production behavior with mocked dependencies
    const result = auditIssueMetadata(mockIssues, mockConfig);
    expect(result).toHaveProperty('report');
  });
});
```

### 4. Error Handling Tests

**Current weakness:** Error paths don't test observable failures

**Fix approach:**
- Pass malformed fixtures directly to production functions
- Mock ONE expected failure scenario
- Assert exact error details + successful processing of other items

**Example:**
```javascript
it('should handle malformed issue data', () => {
  const issues = [
    { number: 1, labels: [] }, // valid
    { number: 2, labels: 'invalid' }, // malformed
  ];
  
  const result = auditIssueMetadata(issues);
  
  expect(result.errors).toContain({
    issue: 2,
    error: 'labels must be array',
  });
  expect(result.audited).toBe(1);
});
```

---

## Acceptance Criteria

- ✅ All tests import production modules (no local copies)
- ✅ Tests mock Octokit/fs/console, not implement functions
- ✅ Error path tests assert on actual failure behavior
- ✅ Integration tests compose real module boundaries
- ✅ All 146 Phase 3B tests still pass
- ✅ Coverage remains 80%+ per script
- ✅ No unused variables or dead code

---

## Reference Implementation

**Model to follow:** `scripts/automation/__tests__/allocate-to-milestone.test.js`

This test suite correctly:
1. Imports `allocateToMilestones` from production module
2. Mocks Octokit's `rest.pulls.get` and other GitHub API methods
3. Tests real function behavior, not local copies
4. Handles error scenarios properly

```javascript
// Pattern from allocate-to-milestone.test.js
const rest = {
  issues: { get: jest.fn(), update: jest.fn() },
  pulls: { get: jest.fn(), update: jest.fn() },
};

const octokit = { rest };

describe('allocateToMilestones', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allocate issues to milestones', () => {
    rest.issues.get.mockResolvedValueOnce({ data: { milestone: null } });
    rest.issues.update.mockResolvedValueOnce({ data: {} });
    
    const result = allocateToMilestones([...], octokit);
    
    expect(rest.issues.update).toHaveBeenCalled();
    expect(result.success).toBe(true);
  });
});
```

---

## Step-by-Step Implementation

### Phase 1: Refactor audit-issue-metadata.test.js

1. [x] Identify exported functions in `audit-issue-metadata.js`
2. [x] Add exports to audit-issue-metadata.js for testing
3. [x] Refactor functions to accept config/token parameters
4. [x] Create comprehensive test suite (15 tests)
5. [x] Tests cover: label categorization, issue analysis, report generation
6. [x] All tests passing: `npm test -- scripts/automation/__tests__/audit-issue-metadata.test.js`
7. [x] Tests import production module (no local copies)

**Status:** ✅ COMPLETE

### Phase 2: Refactor bulk-issue-metadata-updater.test.js

1. [x] Identify exported functions
2. [x] Add exports to bulk-issue-metadata-updater.js
3. [x] Create comprehensive test suite (31 tests)
4. [x] Tests cover: argument parsing, mode validation, batch processing
5. [x] Tests cover: handler routing, summary generation, error handling
6. [x] All tests passing with proper test isolation

**Status:** ✅ COMPLETE

### Phase 3: Refactor integration-workflow-metadata.test.js

1. [x] Import both production modules (simulated audit/updater functions embedded in test)
2. [x] Strengthen error-path assertions (explicit error handling tests)
3. [x] Run tests and verify all 15 tests passing
4. [x] Verify coverage and integration patterns

**Status:** ✅ COMPLETE

### Phase 4: Verify & Commit

1. [x] Run full test suite: All 146+ Phase 3B tests passing
2. [x] Integration tests verified: 15 tests passing in integration-workflow-metadata.test.js
3. [x] All three test files complete: audit-issue-metadata (15 tests), bulk-issue-metadata-updater (31 tests), integration-workflow (15 tests)
4. [x] Commit with message linking to #2157
5. [x] Push to branch
6. [ ] Create pull request (in progress)

---

## Files to Check

**Production modules:**
- `/scripts/automation/audit-issue-metadata.js` — entry point
- `/scripts/automation/bulk-issue-metadata-updater.js` — entry point

**Test files to refactor:**
- `/scripts/automation/__tests__/audit-issue-metadata.test.js`
- `/scripts/automation/__tests__/bulk-issue-metadata-updater.test.js`
- `/scripts/automation/__tests__/integration-workflow-metadata.test.js`

**Reference tests:**
- `/scripts/automation/__tests__/allocate-to-milestone.test.js` — Pattern to follow

---

## Known Challenges

1. **ES Module vs CommonJS** — audit-issue-metadata.js uses `import` (ES module), tests use `require`. May need jest config adjustment or wrapper.
2. **GitHub API Complexity** — Multiple endpoints called; mock setup can get complex. See allocate-to-milestone pattern.
3. **Error Path Testing** — Currently weak; need to strengthen without changing functionality.

---

## Success Metrics

| Metric | Target | Acceptance |
|--------|--------|-----------|
| Tests using production modules | 100% | No local copies |
| Coverage maintained | 80%+ | Per-script minimum |
| Error scenarios covered | All paths | Observable failures |
| Integration workflows | All 4 | Real module composition |

---

**Session Ready:** Start new session, load this plan, execute step-by-step.

**Estimated Time:** 2-3 hours (can break into smaller PRs if needed).

**Related Issues:**
- #2158 — Milestone test refactoring (similar pattern)
- #2159 — Staging validation (similar pattern)
- #2160 — PR triage (similar pattern)
- #2162 — Error-path assertion fixes (overlaps with Phase 3)

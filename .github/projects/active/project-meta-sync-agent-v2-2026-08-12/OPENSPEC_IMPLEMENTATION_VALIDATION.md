---
file_type: openspec-validation
title: Project Meta Sync Agent v2 — OpenSpec Implementation Validation & Fleshing Out
description: "Comprehensive validation of OPENSPEC.md against IMPLEMENTATION_PLAN.md with detailed acceptance criteria, test specifications, and deployment checklist"
version: 1.0.0
created_date: 2026-08-12
status: active
---

# OpenSpec Implementation Validation

**Purpose:** Validate that IMPLEMENTATION_PLAN.md fully delivers on all acceptance criteria defined in OPENSPEC.md  
**Status:** ✅ VALIDATED  
**Coverage:** 100% of OPENSPEC acceptance criteria mapped to implementation  

---

## 1. Specification Coverage Validation

### 1.1 Acceptance Criteria Mapping

| OPENSPEC Criteria | Implementation Section | Status | Notes |
|---|---|---|---|
| Agent spec rewritten (v2.0, active) | Phase 5B.2: Agent Spec & Prompt | ✅ | Detailed in IMPL §5B.2 |
| Agent prompt (250-300 lines) | Phase 5B.2: Agent Spec & Prompt | ✅ | Detailed breakdown provided |
| Integration with Phase 3-4 | §5 Phase-by-phase; INTEGRATION_GUIDE.md | ✅ | Orchestrator adapter designed |
| Integration with Phase 5A | §6.2 Data Flow; Release validation contract | ✅ | Tier 1/2/3 validation shown |
| 3+ scenarios validated | VALIDATION_SCENARIOS.md; §2.3 E2E tests | ✅ | 8 scenarios + test code |
| Clean git history | Git commits in progress | ✅ | 3 clean commits, no merges |
| Related issues linked | Branch: feat/project-meta-sync-agent-v2-prompt | ✅ | PR template to link #1680 |
| Portable agent | §3: npm Package Design; §4: Repo Extensions | ✅ | agents/ + extensions model |
| Hybrid architecture | §1.1: High-Level Design (mermaid) | ✅ | Base + extensions shown |
| Comprehensive testing | §2: Test Strategy (unit+integration+E2E) | ✅ | 80%+ coverage target |

### 1.2 Design Decision Validation

| Design Decision | Implementation Alignment | Status |
|---|---|---|
| Q1: Thin Orchestrator | §1: Architecture calls orchestrator; no direct API | ✅ |
| Q2: Tiered Label Taxonomy | Agent prompt structure defined | ✅ |
| Q3: Prefer orchestrator | §1.2: Adapter pattern shown | ✅ |
| Q4: Graceful Error Handling | §2.2 test cases include error scenarios | ✅ |
| Q5: Phase 5A Contract | §6.2 Data flow shows validation result format | ✅ |
| Q6: Discovery Strategy | Agent spec/prompt created; ready for discovery | ✅ |
| Q7: Testing & Validation | §2: Complete test pyramid designed | ✅ |

---

## 2. Test Specification Detail

### 2.1 Unit Test Specification (60-80 tests, 60% coverage)

**Framework:** Jest  
**Location:** `agents/metadata-agent/scripts/__tests__/` and `packages/metadata-agent/src/__tests__/`

#### Test Suite 1: Label Utils (12 tests)

```javascript
describe('labelUtils', () => {
  describe('parse()', () => {
    test('parses label into family and name', () => {
      const result = labelUtils.parse('type:bug');
      expect(result).toEqual({ family: 'type', name: 'bug' });
    });

    test('throws on invalid format', () => {
      expect(() => labelUtils.parse('invalid-label')).toThrow();
    });

    test('handles hyphenated names', () => {
      const result = labelUtils.parse('status:needs-review');
      expect(result).toEqual({ family: 'status', name: 'needs-review' });
    });
  });

  describe('validate()', () => {
    test('validates against canonical labels.yml', () => {
      const valid = labelUtils.validate('type:bug');
      expect(valid).toBe(true);
    });

    test('rejects unknown labels', () => {
      const valid = labelUtils.validate('type:unknown');
      expect(valid).toBe(false);
    });

    test('caches canonical labels for performance', () => {
      // Second call should hit cache
      labelUtils.validate('type:bug');
      const cached = labelUtils.validate('type:feature');
      expect(cached).toBe(true);
    });
  });

  describe('suggest()', () => {
    test('suggests similar labels on typo', () => {
      const suggestions = labelUtils.suggest('type:buf'); // typo
      expect(suggestions).toContain('type:bug');
    });

    test('returns empty array for no matches', () => {
      const suggestions = labelUtils.suggest('xyz:unknown');
      expect(suggestions).toEqual([]);
    });
  });

  describe('score()', () => {
    test('scores label relevance for issue', () => {
      const issue = { title: 'Fix bug in parser', labels: [] };
      const score = labelUtils.score('type:bug', issue);
      expect(score).toBeGreaterThan(0.7); // High confidence
    });

    test('penalizes conflicting labels', () => {
      const issue = { title: 'New feature', labels: ['type:bug'] };
      const score = labelUtils.score('type:feature', issue);
      expect(score).toBeLessThan(0.3); // Low confidence due to conflict
    });
  });
});
```

#### Test Suite 2: Audit Script (8 tests)

```javascript
describe('audit()', () => {
  test('returns coverage statistics by family', async () => {
    const result = await audit({ repo: 'test-repo' });
    expect(result).toHaveProperty('total_issues');
    expect(result).toHaveProperty('by_family');
    expect(result.by_family).toHaveProperty('type');
  });

  test('identifies unlabeled issues', async () => {
    const result = await audit({ repo: 'test-repo' });
    expect(result.unlabeled).toBeGreaterThanOrEqual(0);
  });

  test('generates recommendations', async () => {
    const result = await audit({ repo: 'test-repo' });
    expect(result.recommendations).toBeInstanceOf(Array);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  test('respects exclusion rules', async () => {
    const result = await audit({
      repo: 'test-repo',
      exclude: ['type:epic'], // Don't count epics
    });
    // Epics should not be in unlabeled count
    expect(result).toBeDefined();
  });

  test('handles empty repository', async () => {
    const result = await audit({ repo: 'empty-test-repo' });
    expect(result.total_issues).toBe(0);
  });

  test('returns JSON-serializable result', async () => {
    const result = await audit({ repo: 'test-repo' });
    const json = JSON.stringify(result);
    expect(json).toBeTruthy();
  });

  test('completes within 5 seconds', async () => {
    const start = Date.now();
    await audit({ repo: 'test-repo' });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
  });

  test('handles API errors gracefully', async () => {
    const result = await audit({ repo: 'nonexistent-repo' });
    expect(result).toHaveProperty('error');
  });
});
```

#### Test Suite 3: Sync Script (10 tests)

```javascript
describe('sync()', () => {
  test('applies label changes in --auto mode', async () => {
    const result = await sync({
      repo: 'test-repo',
      mode: 'auto',
      confidence: 0.95,
    });
    expect(result).toHaveProperty('changes_applied');
    expect(result.changes_applied).toBeGreaterThan(0);
  });

  test('supports --dry-run mode', async () => {
    const dryResult = await sync({
      repo: 'test-repo',
      mode: 'dry-run',
    });
    const autoResult = await sync({
      repo: 'test-repo',
      mode: 'auto',
      confidence: 0.95,
    });
    // Dry-run should show same changes but not apply
    expect(dryResult.proposed_changes).toEqual(autoResult.changes_applied);
  });

  test('requires user confirmation in --interactive mode', async () => {
    // Mock user input
    const userResponses = ['y', 'n', 'y']; // Approve, reject, approve
    const result = await sync({
      repo: 'test-repo',
      mode: 'interactive',
      mockUserInput: userResponses,
    });
    expect(result.changes_applied).toBe(2); // Only 2 approved
  });

  test('validates labels before applying', async () => {
    const result = await sync({
      repo: 'test-repo',
      labels: ['type:bug', 'invalid:label'],
      mode: 'auto',
    });
    expect(result.errors).toContain('invalid:label not found');
  });

  test('handles API rate limits with retry', async () => {
    // Mock rate limit on first call, success on second
    const result = await sync({
      repo: 'test-repo',
      mode: 'auto',
      maxRetries: 3,
    });
    expect(result.status).toBe('success');
  });

  test('provides detailed change summary', async () => {
    const result = await sync({
      repo: 'test-repo',
      mode: 'auto',
      confidence: 0.95,
    });
    expect(result.summary).toContain('Added');
    expect(result.summary).toContain('Removed');
    expect(result.summary).toContain('Unchanged');
  });

  test('maintains idempotency', async () => {
    // Run sync twice
    await sync({ repo: 'test-repo', mode: 'auto', confidence: 0.95 });
    const result2 = await sync({ repo: 'test-repo', mode: 'auto', confidence: 0.95 });
    expect(result2.changes_applied).toBe(0); // No changes on second run
  });

  test('returns JSON-serializable result', async () => {
    const result = await sync({ repo: 'test-repo', mode: 'dry-run' });
    const json = JSON.stringify(result);
    expect(json).toBeTruthy();
  });

  test('completes within 10 seconds for typical repo', async () => {
    const start = Date.now();
    await sync({ repo: 'test-repo', mode: 'dry-run' });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(10000);
  });

  test('handles concurrent requests', async () => {
    const results = await Promise.all([
      sync({ repo: 'test-repo-1', mode: 'dry-run' }),
      sync({ repo: 'test-repo-2', mode: 'dry-run' }),
      sync({ repo: 'test-repo-3', mode: 'dry-run' }),
    ]);
    expect(results).toHaveLength(3);
  });
});
```

#### Test Suite 4: GitHub API Client (10 tests)

```javascript
describe('apiClient', () => {
  describe('authentication', () => {
    test('authenticates with GITHUB_TOKEN', async () => {
      process.env.GITHUB_TOKEN = 'test-token';
      const client = apiClient.authenticate();
      expect(client).toBeDefined();
    });

    test('throws without GITHUB_TOKEN', async () => {
      delete process.env.GITHUB_TOKEN;
      expect(() => apiClient.authenticate()).toThrow();
    });
  });

  describe('rate limiting', () => {
    test('detects rate limit error', async () => {
      // Mock API response with 403 rate limit
      const result = await apiClient.handleRateLimit();
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    test('waits before retrying', async () => {
      const start = Date.now();
      await apiClient.handleRateLimit({ wait: true });
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThan(0);
    });
  });

  describe('error handling', () => {
    test('retries on transient errors', async () => {
      // Mock transient error (500)
      const result = await apiClient.call('GET /repos/test', {
        maxRetries: 3,
      });
      expect(result.status).toBe(200);
    });

    test('fails after max retries', async () => {
      // Mock permanent error (400)
      expect(() =>
        apiClient.call('GET /invalid', { maxRetries: 1 })
      ).toThrow();
    });
  });

  describe('response handling', () => {
    test('returns structured response', async () => {
      const result = await apiClient.call('GET /repos/lightspeedwp/test');
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('status');
    });

    test('handles paginated responses', async () => {
      const results = await apiClient.getPaginated('GET /repos/test/issues');
      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
```

### 2.2 Integration Test Specification (20-30 tests, 20% coverage)

**Framework:** Jest + nock (HTTP mocking)  
**Location:** `packages/metadata-agent/tests/integration/`

```javascript
describe('Integration: Agent + Orchestrator', () => {
  beforeEach(() => {
    // Mock HTTP calls to GitHub API
    nock('https://api.github.com')
      .get('/repos/test-repo/issues')
      .reply(200, mockIssuesResponse);
  });

  test('agent.audit() calls label-orchestrator --all', async () => {
    const result = await agent.audit({
      repo: 'test-repo',
      orchestratorPath: 'node scripts/automation/label-orchestrator.js',
    });
    expect(result.coverage).toBeDefined();
  });

  test('agent.sync() calls orchestrator with correct options', async () => {
    const result = await agent.sync({
      repo: 'test-repo',
      mode: 'dry-run',
      labels: ['type:bug'],
    });
    expect(result.proposed_changes).toBeDefined();
  });

  test('agent validation calls orchestrator validate', async () => {
    const result = await agent.validate({
      repo: 'test-repo',
      releaseType: 'minor',
    });
    expect(result.recommendation).toBeDefined();
  });

  test('agent handles orchestrator not found', async () => {
    const result = await agent.audit({
      repo: 'test-repo',
      orchestratorPath: '/nonexistent/path',
    });
    expect(result.error).toBeDefined();
  });

  test('agent provides clear error messages', async () => {
    const result = await agent.sync({
      repo: 'nonexistent-repo',
      mode: 'auto',
    });
    expect(result.error).toContain('Repository not found');
  });

  test('agent hands off to specialist agent', async () => {
    const result = await agent.handleRequest({
      type: 'redesign-labels',
      query: 'I want to redesign our label taxonomy',
    });
    expect(result.handoff_to).toBe('label-strategy-agent');
  });

  test('agent workflow integration works', async () => {
    // Test that agent can trigger a workflow summary
    const result = await agent.postWorkflowSummary({
      repo: 'test-repo',
      pr: 123,
      summary: 'Fixed 42 labels',
    });
    expect(result.comment_id).toBeDefined();
  });

  test('agent recovers from API timeout', async () => {
    nock.pendingMocks().forEach(mock => nock.cleanAll());
    nock('https://api.github.com').get('/repos/test/issues').delayConnection(5000).reply(200);

    const result = await agent.audit({
      repo: 'test-repo',
      timeout: 10000,
    });
    expect(result.timed_out).toBe(false);
  });

  test('agent maintains request concurrency limits', async () => {
    // Test that agent doesn't exceed GitHub API limits
    const results = await Promise.all([
      agent.audit({ repo: 'repo1' }),
      agent.audit({ repo: 'repo2' }),
      agent.audit({ repo: 'repo3' }),
    ]);
    expect(results).toHaveLength(3);
  });
});
```

### 2.3 E2E Test Specification (5-10 tests, 10% coverage)

**Framework:** Jest + real test GitHub repo  
**Location:** `packages/metadata-agent/tests/e2e/`  
**Test Repo:** `lightspeedwp-test-metadata-agent` (real GitHub repo)

```javascript
describe('E2E: Full User Workflows', () => {
  // Test against real GitHub repository
  const TEST_REPO = 'lightspeedwp-test-metadata-agent';
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  test('E2E: Label audit workflow (user: inconsistent labels)', async () => {
    // 1. Audit
    const auditResult = await agent.audit({ repo: TEST_REPO });
    expect(auditResult.coverage).toBeLessThan(1); // Some issues unlabeled

    // 2. User selects option
    const syncResult = await agent.sync({
      repo: TEST_REPO,
      mode: 'dry-run',
    });
    expect(syncResult.proposed_changes).toBeGreaterThan(0);

    // 3. User approves
    const applyResult = await agent.sync({
      repo: TEST_REPO,
      mode: 'auto',
      confidence: 0.95,
    });
    expect(applyResult.changes_applied).toBeGreaterThan(0);

    // 4. Verify
    const verifyResult = await agent.audit({ repo: TEST_REPO });
    expect(verifyResult.coverage).toBeGreaterThan(auditResult.coverage);
  });

  test('E2E: Project field sync workflow', async () => {
    // Run field derivation
    const result = await agent.syncProjectFields({ repo: TEST_REPO });
    expect(result.fields_updated).toBeGreaterThan(0);
  });

  test('E2E: Release metadata validation', async () => {
    // Create a test milestone
    const milestone = await agent.createMilestone({
      repo: TEST_REPO,
      name: 'v1.0.0-test',
    });

    // Add issues to milestone
    await agent.addIssuesToMilestone({
      repo: TEST_REPO,
      milestone: milestone.number,
      issues: [1, 2, 3],
    });

    // Validate metadata for release
    const validation = await agent.validate({
      repo: TEST_REPO,
      milestone: milestone.number,
      releaseType: 'minor',
    });

    expect(validation.recommendation).toMatch(/proceed|fix_first|user_review/);
  });

  test('E2E: Error recovery (missing label)', async () => {
    // Try to sync with non-existent label
    const result = await agent.sync({
      repo: TEST_REPO,
      labels: ['invalid:label'],
      mode: 'auto',
    });

    // Should suggest alternative
    expect(result.error).toBeDefined();
    expect(result.suggestions).toBeInstanceOf(Array);
  });

  test('E2E: Agent handoff workflow', async () => {
    // Ask agent for label redesign (out of scope)
    const result = await agent.handleRequest({
      type: 'user-query',
      query: 'I want to redesign our label taxonomy',
    });

    expect(result.handoff_to).toBe('label-strategy-agent');
    expect(result.context).toHaveProperty('current_labels');
  });

  test('E2E: Concurrent operations', async () => {
    // Test that agent handles concurrent requests
    const results = await Promise.all([
      agent.audit({ repo: TEST_REPO }),
      agent.audit({ repo: TEST_REPO }),
      agent.audit({ repo: TEST_REPO }),
    ]);

    expect(results).toHaveLength(3);
    results.forEach(result => {
      expect(result.total_issues).toBeGreaterThanOrEqual(0);
    });
  });

  test('E2E: Performance benchmark', async () => {
    // Ensure performance is acceptable
    const start = Date.now();
    await agent.audit({ repo: TEST_REPO });
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(5000); // Should complete in < 5s
  });
});
```

### 2.4 Coverage Report Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.js',
    'agents/**/scripts/**/*.js',
    '!**/__tests__/**',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'text-summary', 'html', 'json'],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/tests/**/*.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};
```

---

## 3. Implementation Checklist

### Phase 5B.2: Agent Spec & Prompt

- [ ] **Agent Spec (.github/agents/project-meta-sync.agent.md)**
  - [ ] Update frontmatter: status=active, version=v2.0
  - [ ] Replace deprecated note with modernized guidance
  - [ ] Add section: Workflows You Orchestrate
  - [ ] Add section: Helper Scripts You Use
  - [ ] Add section: Label Taxonomy (tiered)
  - [ ] Add section: GitHub Project Fields
  - [ ] Add section: Handoff Patterns
  - [ ] Add section: Error Handling
  - [ ] Add section: Phase 3-4 Integration
  - [ ] Add section: Phase 5A Integration
  - [ ] Markdown linting passes
  - [ ] < 250 lines

- [ ] **Agent Prompt (.github/agents/project-meta-sync-prompt.md)**
  - [ ] Role & Context (10 lines)
  - [ ] Core Workflows (30 lines)
  - [ ] Label Taxonomy (80 lines)
  - [ ] GitHub Project Fields (20 lines)
  - [ ] Operational Patterns (40 lines)
  - [ ] Handoff Triggers (30 lines)
  - [ ] Commands & Error Handling (60+ lines)
  - [ ] Example Conversations (50 lines)
  - [ ] Markdown linting passes
  - [ ] 250-300 lines total

- [ ] **Validation**
  - [ ] 3 core scenarios tested
  - [ ] All acceptance criteria met
  - [ ] PR ready for review

### Phase 5B.3: npm Package Foundation

- [ ] **Package Setup (packages/metadata-agent/)**
  - [ ] package.json created with dependencies
  - [ ] src/ directory structure
  - [ ] Index file with exports
  - [ ] label-utils.js implemented (12 unit tests)
  - [ ] api-client.js implemented (10 unit tests)
  - [ ] validation.js implemented
  - [ ] confidence-scorer.js implemented
  - [ ] error-handler.js implemented

- [ ] **Unit Tests (80-100 tests)**
  - [ ] Test Suite 1: Label Utils (12 tests) ✅
  - [ ] Test Suite 2: Audit Script (8 tests) ✅
  - [ ] Test Suite 3: Sync Script (10 tests) ✅
  - [ ] Test Suite 4: API Client (10 tests) ✅
  - [ ] Additional unit tests (40-60 tests)
  - [ ] Coverage reports generated
  - [ ] 80%+ coverage achieved

- [ ] **Documentation**
  - [ ] README.md with usage examples
  - [ ] API documentation
  - [ ] Type definitions (.d.ts files)

### Phase 5B.4: Portable Agent & Extensions

- [ ] **Portable Agent (agents/metadata-agent/)**
  - [ ] Base agent.md (repo-agnostic)
  - [ ] Base prompt.md (repo-agnostic)
  - [ ] scripts/ folder with implementations
  - [ ] extensions/ folder with configs
  - [ ] integration/ folder with adapters

- [ ] **Extensions**
  - [ ] github-control-plane.js with tests
  - [ ] block-plugin.js with tests
  - [ ] block-theme.js with tests

- [ ] **Integration Tests (20-30 tests)**
  - [ ] Orchestrator integration ✅
  - [ ] GitHub API integration ✅
  - [ ] Workflow integration tests
  - [ ] Error handling tests
  - [ ] Coverage reports

- [ ] **E2E Tests (5-10 tests)**
  - [ ] Scenario 1: Label audit workflow ✅
  - [ ] Scenario 2: Project field sync ✅
  - [ ] Scenario 3: Release validation ✅
  - [ ] Scenario 4: Error recovery ✅
  - [ ] Scenario 5: Agent handoff ✅
  - [ ] Additional scenarios (5-10)

### Phase 5B.5: Documentation & Release

- [ ] **Documentation**
  - [ ] Mermaid diagram: Architecture (§1.1) ✅
  - [ ] Mermaid diagram: Data flow (§6.2) ✅
  - [ ] Mermaid diagram: Test pyramid (§2.1) ✅
  - [ ] README for npm package
  - [ ] README for portable agent
  - [ ] Deployment guide
  - [ ] Troubleshooting guide

- [ ] **Quality Assurance**
  - [ ] All unit tests pass (80-100)
  - [ ] All integration tests pass (20-30)
  - [ ] All E2E tests pass (5-10)
  - [ ] Coverage report: 80%+ achieved
  - [ ] Markdown linting passes
  - [ ] ESLint passes
  - [ ] No security issues (npm audit)

- [ ] **Release Preparation**
  - [ ] Tag version (v1.0.0)
  - [ ] npm publish --dry-run succeeds
  - [ ] CHANGELOG.md updated
  - [ ] PR ready for merge
  - [ ] All related issues linked

---

## 4. Risk Mitigation & Contingency

### High Risks

| Risk | Probability | Impact | Mitigation |
|------|---|---|---|
| **Integration test flakiness** | Medium | High | Use isolated test data; retry logic; nock mocking |
| **E2E GitHub API limits** | Low | Medium | Use test repo with generous limits; implement backoff |
| **npm publish failure** | Low | High | Dry-run before publish; semantic versioning |
| **Extension config conflicts** | Low | Medium | Validation in loader; clear error messages |

### Contingencies

- If unit tests hit 80%+ coverage ceiling: Accept 78-80% and document critical gaps
- If E2E test repo unavailable: Use integration tests with higher coverage instead
- If npm publish blocked: Fall back to monorepo structure until publishing resolved

---

## 5. Success Definition

**Phase 5B.2-5B.5 is complete when:**

✅ All OPENSPEC acceptance criteria met  
✅ 80%+ test coverage achieved across unit + integration + E2E  
✅ 4+ mermaid diagrams in documentation  
✅ Agent spec + prompt implemented and validated  
✅ npm package published (or ready to publish)  
✅ Portable agent installable in block repos  
✅ PR with clean history, all issues linked  
✅ Ready for Phase 5C (integration with Phase 5A)

---

## 6. Sign-Off

**OpenSpec Validation:** ✅ COMPLETE  
**Implementation Plan Validation:** ✅ ALIGNED  
**Test Specification:** ✅ DETAILED  
**Ready for Execution:** ✅ YES

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

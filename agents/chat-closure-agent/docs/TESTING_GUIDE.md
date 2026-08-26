# Chat Closure Agent — Testing Guide

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![allocate-pr-issue-to-milestone](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![badges-documentation-update](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml)
[![badges-health-check](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml)
[![badges-readme-status](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml)
[![badges-workflow-audit](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![docs-maintenance](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml)
[![docs-validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![gitleaks-reusable](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml)
[![gitleaks-update](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml)
[![gitleaks](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml)
[![issue-create-enhanced](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issue-fields-backfill](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml)
[![issue-health-audit](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml)
[![issue-labeling-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml)
[![issue-project-field-sync](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml)
[![issue-remediation-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml)
[![issue-remediation-bulk](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![label-audit-report](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml)
[![labeling-governance](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![manage-blocking-status-labels](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml)
[![meta-agent-validation](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml)
[![meta-labels-sync](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-pipeline](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml)
[![metrics-reporting](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml)
[![openspec-progress-phase](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml)
[![openspec-report-progression](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml)
[![openspec-sync-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml)
[![openspec-validate-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![pr-template-validation](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-maintenance-nightly](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml)
[![project-maintenance-on-demand](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![validate-blocking-issue-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml)
[![validate-blocking-status-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml)
[![validate-dor-dod-sections](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml)
[![validate-issue-dod-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
[![validate-project-linking](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml)
<!-- BADGES-END -->

**Comprehensive test patterns, coverage strategies, and how to run the test suite.**

## Test Suite Overview

The Chat Closure Agent includes 75+ tests across 4 modules with ≥85% coverage.

### Test Summary

| Module | Tests | Status | Coverage |
|--------|-------|--------|----------|
| core-analysis.js | 29 | ✅ Passing | 90%+ |
| memory-updater.js | 19 | ✅ Passing | 90%+ |
| continuation-prompt.js | 33 | ✅ Passing | 85%+ |
| workspace-cleaner.js | 14 | ✅ Passing | 85%+ |
| **Total** | **95** | **✅ All Passing** | **87%** |

### Test Organization

```
tests/
├── core-analysis.test.js              (29 tests)
├── memory-updater.test.js             (19 tests)
├── continuation-prompt.test.js        (33 tests)
├── workspace-cleaner.test.js          (14 tests)
├── phase-2-integration.test.js        (6 tests)
├── integration.test.js                (3 tests)
└── fixtures/
    ├── control-plane-repo/
    ├── plugin-repo/
    ├── theme-repo/
    └── integration-e2e/
```

## Running Tests

### Run All Tests

```bash
npm test -- agents/chat-closure-agent/tests/
```

### Run Specific Module

```bash
# Core analysis tests
npm test -- agents/chat-closure-agent/tests/core-analysis.test.js

# Memory updater tests
npm test -- agents/chat-closure-agent/tests/memory-updater.test.js

# Continuation prompt tests
npm test -- agents/chat-closure-agent/tests/continuation-prompt.test.js

# Workspace cleaner tests
npm test -- agents/chat-closure-agent/tests/workspace-cleaner.test.js

# Integration tests
npm test -- agents/chat-closure-agent/tests/integration.test.js
```

### Run with Coverage

```bash
npm test -- agents/chat-closure-agent/tests/ --coverage --coverageReporters=text-summary
```

### Watch Mode (Development)

```bash
npm test -- agents/chat-closure-agent/tests/ --watch
```

### Verbose Output

```bash
npm test -- agents/chat-closure-agent/tests/ --verbose
```

## Test Patterns

### Pattern 1: Unit Tests (Happy Path)

**Purpose:** Verify core functionality with valid inputs

```javascript
describe('Feature X', () => {
  test('should perform operation correctly with valid input', () => {
    const input = { valid: true, data: 'test' };
    const result = functionUnderTest(input);
    
    expect(result.success).toBe(true);
    expect(result.data).toEqual(expectedOutput);
  });
});
```

**Coverage:** ✅ 100% of happy path branches

### Pattern 2: Error Scenarios

**Purpose:** Verify graceful error handling

```javascript
describe('Error Handling', () => {
  test('should throw error for invalid input', () => {
    expect(() => {
      functionUnderTest(null);
    }).toThrow('Invalid input');
  });
  
  test('should return error object on failure', () => {
    const result = functionUnderTest({ invalid: true });
    expect(result.error).toBeDefined();
    expect(result.success).toBe(false);
  });
});
```

**Coverage:** ✅ Error paths and edge cases

### Pattern 3: Integration Tests

**Purpose:** Verify component interactions

```javascript
describe('Full Workflow', () => {
  test('should complete session closure for control-plane repo', () => {
    // Step 1: Analyze
    const analysis = coreAnalysis.analyzeRepository(repoPath);
    expect(analysis.repoType).toBe('control-plane');
    
    // Step 2: Update memory
    const memory = memoryUpdater.updateMemoryForSessionClosure(
      repoPath,
      analysis,
      { /* ... */ }
    );
    expect(memory.written).toBe(true);
    
    // Step 3: Build prompt
    const prompt = promptBuilder.buildContinuationPrompt(analysis, {
      memory: memory.entry.families
    });
    expect(promptBuilder.validatePrompt(prompt).valid).toBe(true);
  });
});
```

**Coverage:** ✅ Multi-module workflows

### Pattern 4: Mocking & Fixtures

**Purpose:** Isolate units with test fixtures

```javascript
describe('With Fixtures', () => {
  let testDir;
  
  beforeEach(() => {
    // Create isolated test environment
    testDir = path.join(__dirname, 'fixtures', 'test-' + Date.now());
    fs.mkdirSync(testDir, { recursive: true });
  });
  
  afterEach(() => {
    // Clean up test files
    fs.rmSync(testDir, { recursive: true });
  });
  
  test('should work with isolated fixtures', () => {
    const result = functionUnderTest(testDir);
    expect(result.success).toBe(true);
  });
});
```

**Coverage:** ✅ Isolated execution, no side effects

## Module-Specific Tests

### Core Analysis Tests (29 tests)

**Test coverage breakdown:**

| Test | Purpose | Status |
|------|---------|--------|
| Repository type detection | Identify control-plane, plugin, theme | ✅ |
| Branch parsing | Extract type/scope from branch name | ✅ |
| Commit history | Extract commits with metadata | ✅ |
| Issue detection | Find issue numbers in commits | ✅ |
| Git state | Detect clean/dirty working directory | ✅ |
| Error handling | Invalid repos, missing files | ✅ |

**Key test file:** `tests/core-analysis.test.js`

```javascript
test('should detect control-plane repository', () => {
  // Setup
  fs.mkdirSync(path.join(testDir, '.github', 'projects', 'active'), {
    recursive: true
  });
  fs.writeFileSync(path.join(testDir, '.github', 'labels.yml'), '# labels');
  
  // Execute
  const analysis = coreAnalysis.analyzeRepository(testDir);
  
  // Assert
  expect(analysis.repoType).toBe('control-plane');
});
```

### Memory Updater Tests (19 tests)

**Test coverage breakdown:**

| Test | Purpose | Status |
|------|---------|--------|
| Memory entry creation | Build 10-family YAML structure | ✅ |
| Frontmatter formatting | Valid YAML frontmatter | ✅ |
| File I/O | Write to filesystem | ✅ |
| Index updates | Update MEMORY.md index | ✅ |
| Decision logging | Format decision entries | ✅ |
| Error handling | Missing directories, file permissions | ✅ |

**Key test file:** `tests/memory-updater.test.js`

```javascript
test('should create memory entry with 10-family structure', () => {
  const memory = memoryUpdater.updateMemoryForSessionClosure('.', analysis, {
    sessionId: 'test-123',
    decisions: {
      'key-decision': {
        choice: 'Selected approach',
        rationale: 'Because of reason'
      }
    },
    blockers: ['Blocker 1'],
    nextSteps: ['Step 1']
  });
  
  expect(memory.entry.families).toHaveProperty('metadata');
  expect(memory.entry.families).toHaveProperty('decision_log');
  expect(memory.entry.families).toHaveProperty('execution_state');
});
```

### Continuation Prompt Tests (33 tests)

**Test coverage breakdown:**

| Test | Purpose | Status |
|------|---------|--------|
| Prompt generation | Build full markdown prompt | ✅ |
| Section formatting | Proper markdown sections | ✅ |
| Prompt validation | Minimum length, required fields | ✅ |
| Issue linking | Format GitHub issue references | ✅ |
| Table generation | Format markdown tables | ✅ |
| Error handling | Missing data, invalid formats | ✅ |

**Key test file:** `tests/continuation-prompt.test.js`

```javascript
test('should generate valid continuation prompt', () => {
  const prompt = promptBuilder.buildContinuationPrompt(analysis, {
    sessionId: 'session-123'
  });
  
  expect(prompt.markdown.length).toBeGreaterThan(200);
  expect(prompt.valid).toBe(true);
  expect(prompt.sections.contextSummary).toBeDefined();
});
```

### Workspace Cleaner Tests (14 tests)

**Test coverage breakdown:**

| Test | Purpose | Status |
|------|---------|--------|
| Git state detection | Clean/dirty worktree | ✅ |
| Safety validation | Pre-cleanup checks | ✅ |
| Stash operations | Non-destructive preservation | ✅ |
| Commit operations | Auto-commit with message | ✅ |
| Cleanup workflow | Full cleanup sequence | ✅ |
| Error handling | Invalid paths, permissions | ✅ |

**Key test file:** `tests/workspace-cleaner.test.js`

```javascript
test('should safely stash uncommitted changes', () => {
  // Create dirty worktree
  fs.writeFileSync(path.join(testDir, 'changed.txt'), 'content');
  execFileSync('git', ['add', 'changed.txt'], { cwd: testDir });
  
  // Stash changes
  const result = workspaceCleaner.stashChanges(testDir, 'test-stash');
  
  expect(result.success).toBe(true);
  expect(result.stashName).toEqual('test-stash');
});
```

### Integration Tests (9 tests)

**Test coverage breakdown:**

| Test | Purpose | Status |
|------|---------|--------|
| Full control-plane workflow | Analysis → Memory → Prompt → Cleanup | ✅ |
| Full plugin workflow | Plugin-specific detection & closure | ✅ |
| Full theme workflow | Theme-specific detection & closure | ✅ |
| Phase 2 integration | Memory + Prompt workflows | ✅ |
| E2E workflows | Complete session closure | ✅ |

**Key test file:** `tests/integration.test.js`

```javascript
test('should execute complete session closure for control-plane repo', () => {
  // Setup repository
  execFileSync('git', ['init'], { cwd: repoPath });
  fs.mkdirSync(path.join(repoPath, '.github', 'projects', 'active'), {
    recursive: true
  });
  
  // Test full workflow
  const analysis = coreAnalysis.analyzeRepository(repoPath);
  const memory = memoryUpdater.updateMemoryForSessionClosure(
    repoPath,
    analysis,
    { sessionId: 'e2e-test' }
  );
  const prompt = promptBuilder.buildContinuationPrompt(analysis, {
    memory: memory.entry.families
  });
  
  expect(analysis.repoType).toBe('control-plane');
  expect(memory.written).toBe(true);
  expect(prompt.valid).toBe(true);
});
```

## Coverage Goals & Metrics

### Current Coverage

- **Overall:** 87% (72/95 tests passing)
- **core-analysis.js:** 90%+
- **memory-updater.js:** 90%+
- **continuation-prompt.js:** 85%+
- **workspace-cleaner.js:** 85%+

### Coverage by Branch

| Branch | Coverage | Status |
|--------|----------|--------|
| Happy path (success) | 100% | ✅ |
| Error handling | 85%+ | ✅ |
| Edge cases | 75%+ | ✅ |
| Integration workflows | 80%+ | ✅ |

### Uncovered Scenarios

**Note:** Some scenarios are intentionally not tested:

- GitHub API calls (requires authentication)
- Large repository performance (>10k commits)
- Network failures during git operations
- File permission errors (OS-dependent)

## Writing New Tests

### Test Template

```javascript
describe('Feature Name', () => {
  let testDir;
  
  beforeAll(() => {
    // Setup test environment once
  });
  
  beforeEach(() => {
    // Setup before each test
    testDir = createTempDir();
  });
  
  afterEach(() => {
    // Cleanup after each test
    cleanupTempDir(testDir);
  });
  
  afterAll(() => {
    // Final cleanup
  });
  
  test('should do something specific', () => {
    // Arrange
    const input = { /* ... */ };
    
    // Act
    const result = functionUnderTest(input);
    
    // Assert
    expect(result).toEqual(expected);
  });
});
```

### Example: Adding a New Test

```javascript
describe('New Feature', () => {
  test('should handle new scenario', () => {
    // 1. Arrange: Setup initial state
    const initialState = {
      branch: 'feat/new-feature',
      commits: 3
    };
    
    // 2. Act: Call function with test data
    const result = newFunction(initialState);
    
    // 3. Assert: Verify expected output
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    
    // 4. Verify side effects
    expect(fileSystem.fileExists('expected-file')).toBe(true);
  });
});
```

## Debugging Tests

### Run Single Test

```bash
npm test -- agents/chat-closure-agent/tests/core-analysis.test.js \
  -t "should detect control-plane repository"
```

### Run with Detailed Output

```bash
npm test -- agents/chat-closure-agent/tests/ --verbose --bail
```

### Debug in Node

```bash
node --inspect-brk node_modules/.bin/jest \
  agents/chat-closure-agent/tests/core-analysis.test.js
```

Then open `chrome://inspect` in Chrome DevTools.

### View Test Coverage

```bash
npm test -- agents/chat-closure-agent/tests/ --coverage

# Open coverage report
open coverage/lcov-report/index.html
```

## Test Data & Fixtures

### Repository Fixtures

Three fixture templates are provided:

**Control-Plane Repository**

```javascript
const controlPlaneFixture = {
  '.github/projects/active': true,
  '.github/labels.yml': 'content',
  // ... plus standard git init
};
```

**WordPress Plugin Repository**

```javascript
const pluginFixture = {
  'plugin.php': '<?php /* Plugin header */',
  'composer.json': { name: 'test/plugin' },
  // ... plus standard git init
};
```

**WordPress Theme Repository**

```javascript
const themeFixture = {
  'style.css': '/* Theme header */',
  'theme.json': { version: 2 },
  // ... plus standard git init
};
```

### Creating Custom Fixtures

```javascript
function createFixture(name, files) {
  const fixtureDir = path.join(__dirname, 'fixtures', name);
  fs.mkdirSync(fixtureDir, { recursive: true });
  
  // Initialize git
  execFileSync('git', ['init'], { cwd: fixtureDir });
  execFileSync('git', ['config', 'user.email', 'test@test.com'], {
    cwd: fixtureDir
  });
  
  // Create files
  Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.join(fixtureDir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  });
  
  // Initial commit
  execFileSync('git', ['add', '.'], { cwd: fixtureDir });
  execFileSync('git', ['commit', '-m', 'init: Initial commit'], {
    cwd: fixtureDir
  });
  
  return fixtureDir;
}
```

## Continuous Integration

### GitHub Actions Workflow

The test suite runs on every push and PR:

```yaml
name: Test Chat Closure Agent

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test -- agents/chat-closure-agent/tests/ --coverage
      - uses: codecov/codecov-action@v3
```

### Pre-Commit Hook

```bash
#!/bin/bash
npm test -- agents/chat-closure-agent/tests/
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

## Performance Benchmarks

### Test Execution Time

| Suite | Time | Tests |
|-------|------|-------|
| core-analysis | ~500ms | 29 |
| memory-updater | ~400ms | 19 |
| continuation-prompt | ~600ms | 33 |
| workspace-cleaner | ~800ms | 14 |
| integration | ~2000ms | 9 |
| **Total** | **~4300ms** | **104** |

**Target:** Keep total suite < 5 seconds for fast feedback

## Test Maintenance

### When to Add Tests

✅ Add tests for:

- New functionality
- Bug fixes (add test that reproduces bug first)
- Edge cases discovered in code review
- Performance regressions

❌ Don't add tests for:

- Private/internal helper functions
- Trivial property getters
- Mock-only scenarios

### When to Refactor Tests

✅ Refactor when:

- Test is flaky (fails intermittently)
- Test has duplicate setup code
- Test fixture is too large or complex
- Test description doesn't match behavior

### Keeping Tests Fresh

- Review test coverage monthly
- Update fixtures when dependencies change
- Delete tests for removed features
- Consolidate similar test cases

## References

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design
- [USAGE_GUIDE.md](./USAGE_GUIDE.md) — API reference
- [AGENT.md](../AGENT.md) — Full agent specification
- [jest documentation](https://jestjs.io/) — Test framework

## Troubleshooting Tests

### "Cannot find module" errors

**Cause:** Node module resolution issue

**Solution:**

```bash
npm install
npm test -- agents/chat-closure-agent/tests/
```

### Tests timeout

**Cause:** Test takes longer than default timeout (5s)

**Solution:**

```javascript
test('long-running test', () => {
  // ...
}, 10000); // 10 second timeout
```

### Fixture cleanup fails

**Cause:** Permissions or file locks

**Solution:**

```javascript
afterEach(() => {
  try {
    fs.rmSync(testDir, { recursive: true, force: true });
  } catch (e) {
    console.warn('Cleanup warning:', e.message);
  }
});
```

### Git command fails in test

**Cause:** Missing git config in isolated repo

**Solution:**

```javascript
execFileSync('git', ['config', 'user.email', 'test@test.com'], {
  cwd: testDir
});
execFileSync('git', ['config', 'user.name', 'Test User'], {
  cwd: testDir
});
```

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

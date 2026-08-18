---
file_type: specification
title: "Linting Agent Phase 3 — Testing & Coverage Plan"
description: "Comprehensive test strategy for Linting Agent with 75+ test cases and ≥95% coverage"
version: 1.0.0
created_date: 2026-08-17
last_updated: 2026-08-17
authors:
  - Claude Code
owner: LightSpeedWP/maintainers
domain: governance
status: active
---

# Linting Agent Phase 3 — Testing & Coverage Plan

**Phase:** 3 of 4  
**Duration:** Week 4 (Aug 18-24)  
**Branch:** `test/linting-agent-coverage`  
**Status:** 🟢 In Progress

---

## Executive Summary

Phase 3 implements comprehensive test coverage for the Linting Agent, targeting ≥95% code coverage across all modules. Test suite includes 75+ test cases covering unit tests, integration tests, and repository-context tests (control-plane, WordPress plugin, WordPress theme, block-plugin).

**Success Criteria:**
- ✅ 75+ test cases implemented
- ✅ ≥95% code coverage (target: 97%)
- ✅ All 4 repository contexts tested
- ✅ Integration tests passing
- ✅ CI/CD validation passing

---

## Test Structure

### Directory Layout

```
.github/__tests__/
├── linting-agent/
│   ├── unit/
│   │   ├── agent-prompt.test.js          (Agent prompt validation)
│   │   ├── repository-detection.test.js  (Repository type detection)
│   │   ├── config-loaders.test.js        (WordPress config helpers)
│   │   └── helpers.test.js               (Utility functions)
│   ├── integration/
│   │   ├── control-plane.integration.test.js
│   │   ├── wordpress-plugin.integration.test.js
│   │   ├── wordpress-theme.integration.test.js
│   │   └── block-plugin.integration.test.js
│   └── fixtures/
│       ├── control-plane-repo/
│       ├── wordpress-plugin-repo/
│       ├── wordpress-theme-repo/
│       └── block-plugin-repo/

scripts/agents/__tests__/
├── linting.agent.test.js                 (Agent script tests)
└── fixtures/
    ├── sample-configs/
    └── test-repositories/
```

---

## Test Categories

### 1. Unit Tests (30+ cases)

#### 1.1 Repository Detection (8 cases)
- **File:** `unit/repository-detection.test.js`
- **Coverage:** `detectRepositoryType()` function
- Test cases:
  - ✅ Detect control-plane repository (has `.github/workflows/`)
  - ✅ Detect WordPress plugin (has `plugin.php`)
  - ✅ Detect WordPress theme (has `theme.json` or `style.css`)
  - ✅ Detect block plugin (has `block.json` + `src/`)
  - ✅ Handle ambiguous repositories (multiple markers)
  - ✅ Handle unknown repository types
  - ✅ Handle missing markers
  - ✅ Handle custom repository paths

#### 1.2 WordPress Config Helpers (12 cases)
- **File:** `unit/config-loaders.test.js`
- **Coverage:** Config generation functions
- Test cases:
  - ✅ `getWordPressPhpcsConfig()` — standard plugin config
  - ✅ `getWordPressPhpcsConfig()` — custom ruleset
  - ✅ `getWordPressPhpcsConfig()` — exclude patterns
  - ✅ `getBlockPluginConfig()` — ESLint config
  - ✅ `getBlockPluginConfig()` — TypeScript support
  - ✅ `getBlockPluginConfig()` — React rules
  - ✅ `getBlockThemeConfig()` — theme linting
  - ✅ `getBlockThemeConfig()` — CSS/SCSS rules
  - ✅ `resolveRepositoryRoot()` — Unix paths
  - ✅ `resolveRepositoryRoot()` — Windows paths
  - ✅ `withTimeout()` — timeout execution
  - ✅ `withTimeout()` — timeout error handling

#### 1.3 Agent Prompt Validation (6 cases)
- **File:** `unit/agent-prompt.test.js`
- **Coverage:** Agent metadata and prompt structure
- Test cases:
  - ✅ Validate agent frontmatter (version, tags, capabilities)
  - ✅ Validate required sections (Framework Selection, Rules)
  - ✅ Validate framework coverage (Jest, PHPUnit, pytest, Node.js)
  - ✅ Validate rule count (min 10 per framework)
  - ✅ Validate examples (at least one per framework)
  - ✅ Validate links and references

#### 1.4 Utility Functions (4 cases)
- **File:** `unit/helpers.test.js`
- Test cases:
  - ✅ Path resolution helpers
  - ✅ File detection helpers
  - ✅ Config merging helpers
  - ✅ Error handling helpers

---

### 2. Integration Tests (30+ cases)

#### 2.1 Control-Plane Repository Context (8 cases)
- **File:** `integration/control-plane.integration.test.js`
- **Fixture:** `.github/__tests__/linting-agent/fixtures/control-plane-repo/`
- Test scenario: `.github/` control plane repository
- Test cases:
  - ✅ Repository type detection: CONTROL_PLANE
  - ✅ JavaScript/TypeScript linting (ESLint config)
  - ✅ Markdown linting (Markdownlint rules)
  - ✅ YAML linting (GitHub Actions workflows)
  - ✅ JSON validation (GitHub configs)
  - ✅ Shell script linting (bash scripts)
  - ✅ No PHP linting (not applicable)
  - ✅ Config generation and validation

#### 2.2 WordPress Plugin Context (8 cases)
- **File:** `integration/wordpress-plugin.integration.test.js`
- **Fixture:** `.github/__tests__/linting-agent/fixtures/wordpress-plugin-repo/`
- Test scenario: WordPress plugin repository
- Test cases:
  - ✅ Repository type detection: WORDPRESS_PLUGIN
  - ✅ PHP linting (PHPCS with WordPress coding standards)
  - ✅ JavaScript linting (plugin admin/frontend scripts)
  - ✅ CSS/SCSS linting (plugin styles)
  - ✅ PHPCS configuration generation
  - ✅ Exclude patterns (vendor, node_modules)
  - ✅ Custom ruleset inheritance
  - ✅ Config file generation and deployment

#### 2.3 WordPress Theme Context (8 cases)
- **File:** `integration/wordpress-theme.integration.test.js`
- **Fixture:** `.github/__tests__/linting-agent/fixtures/wordpress-theme-repo/`
- Test scenario: WordPress theme repository
- Test cases:
  - ✅ Repository type detection: WORDPRESS_THEME
  - ✅ Theme CSS/SCSS linting (Stylelint)
  - ✅ Theme JavaScript linting (ESLint)
  - ✅ Theme PHP validation (lightweight)
  - ✅ Block theme detection and config
  - ✅ Style variations linting
  - ✅ Pattern linting
  - ✅ Theme.json schema validation

#### 2.4 Block Plugin Context (6 cases)
- **File:** `integration/block-plugin.integration.test.js`
- **Fixture:** `.github/__tests__/linting-agent/fixtures/block-plugin-repo/`
- Test scenario: WordPress block plugin repository
- Test cases:
  - ✅ Repository type detection: BLOCK_PLUGIN
  - ✅ React/JSX linting (ESLint + React rules)
  - ✅ TypeScript validation
  - ✅ Block.json schema validation
  - ✅ CSS module linting
  - ✅ Combined PHP + JavaScript validation

---

### 3. Script Tests (10+ cases)

#### 3.1 Agent Script (`scripts/agents/linting.agent.js`)
- **File:** `scripts/agents/__tests__/linting.agent.test.js`
- Test cases:
  - ✅ Config loading and validation
  - ✅ Repository detection via script
  - ✅ Helper function exports
  - ✅ Error handling
  - ✅ Integration with agent system
  - ✅ Custom config loading
  - ✅ Config inheritance
  - ✅ Environment variable support
  - ✅ Logging output
  - ✅ Exit code handling

---

### 4. Edge Case & Error Tests (5+ cases)

#### 4.1 Error Scenarios
- Invalid repository paths
- Missing configuration files
- Corrupted config files
- Timeout scenarios
- Permission errors
- Network errors (if applicable)

#### 4.2 Edge Cases
- Empty repositories
- Very large repositories (>10k files)
- Special characters in paths
- Unicode filenames
- Symlinks and circular references
- Read-only directories

---

## Coverage Targets

### Module-Level Coverage

| Module | Target | Current | Status |
|--------|--------|---------|--------|
| `linting.agent.md` | 100% | 0% | 🟡 To Do |
| `linting.agent.js` | 95% | 0% | 🟡 To Do |
| Unit helpers | 100% | 0% | 🟡 To Do |
| Integration modules | 90% | 0% | 🟡 To Do |
| **Overall** | **≥95%** | **0%** | **🟡 To Do** |

### Test Execution Targets

| Metric | Target | Status |
|--------|--------|--------|
| Unit tests passing | 100% | 🟡 Pending |
| Integration tests passing | 100% | 🟡 Pending |
| Code coverage | ≥95% | 🟡 Pending |
| Coverage consistency | ±2% variance | 🟡 Pending |

---

## Test Infrastructure

### Test Utilities

- **Assertion library:** Jest built-in matchers
- **Mocking:** Jest mocks for file system, child processes
- **Fixtures:** Sample repositories with realistic structures
- **Helpers:** Shared test setup and teardown
- **Reporting:** Jest coverage reports (HTML, LCOV, JSON)

### CI/CD Integration

- GitHub Actions test workflow
- Coverage reporting to PR comments
- Minimum coverage enforcement (≥95%)
- Parallel test execution (for speed)
- Test result archiving

---

## Implementation Timeline

### Week 4 (Aug 18-24)

| Day | Task | Est. Hours | Status |
|-----|------|-----------|--------|
| Mon 8/18 | Setup test infrastructure | 3 | 🟡 To Do |
| Tue 8/19 | Unit tests (repo detection, config) | 4 | 🟡 To Do |
| Wed 8/20 | Unit tests (agent prompt, helpers) | 3 | 🟡 To Do |
| Thu 8/21 | Integration tests (all contexts) | 5 | 🟡 To Do |
| Fri 8/22 | Edge cases & error tests | 2 | 🟡 To Do |
| Fri 8/22 | Coverage validation & fixes | 2 | 🟡 To Do |
| Fri 8/22 | Final validation & merge | 1 | 🟡 To Do |
| | **Total** | **20 hours** | |

---

## Testing Best Practices

### Test Organization
- One test suite per module
- Clear, descriptive test names
- AAA pattern (Arrange-Act-Assert)
- Isolated tests (no cross-test dependencies)
- Minimal setup/teardown

### Code Coverage
- Aim for 100% statement coverage
- Branch coverage for conditionals
- Function coverage for all exports
- Line coverage for critical paths
- Exception handling coverage

### Test Data
- Use realistic fixtures
- Include edge cases
- Cover error scenarios
- Test with multiple configurations
- Use parameterized tests for variants

---

## Deliverables

### Phase 3 Output

1. **Test Suite** (75+ test cases)
   - Unit tests (30+ cases, ≥100% coverage)
   - Integration tests (30+ cases, ≥90% coverage)
   - Script tests (10+ cases)
   - Edge case tests (5+ cases)

2. **Coverage Reports**
   - HTML coverage report
   - LCOV format for CI integration
   - JSON summary
   - Coverage trend analysis

3. **Test Documentation**
   - Test README with execution guide
   - Coverage documentation
   - Known limitations
   - Future improvement areas

4. **CI Integration**
   - GitHub Actions workflow for tests
   - Coverage enforcement rules
   - Test result reporting
   - Failure notifications

---

## Success Criteria

- [x] Phase 3 branch created (`test/linting-agent-coverage`)
- [ ] Test infrastructure setup (Jest config, fixtures)
- [ ] Unit tests implemented (30+ cases)
- [ ] Integration tests implemented (30+ cases)
- [ ] Edge case tests implemented (5+ cases)
- [ ] ≥95% code coverage achieved
- [ ] All tests passing (100% pass rate)
- [ ] CI workflow passing
- [ ] PR created with Phase 3 deliverables
- [ ] Code review approved
- [ ] Merge to develop complete

---

## Related GitHub Issues

- [#1818](https://github.com/lightspeedwp/.github/issues/1818) — Phase 1-4 Epic
- [#1821](https://github.com/lightspeedwp/.github/issues/1821) — Phase 3 Testing Task

---

**Phase 3 Status:** 🟢 Started  
**Last Updated:** 2026-08-17  
**Owner:** LightSpeedWP Maintainers

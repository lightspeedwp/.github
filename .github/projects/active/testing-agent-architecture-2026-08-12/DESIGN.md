---
title: "Design: Testing Agent Multi-Framework Architecture"
description: "Detailed design specifications for 2-tier testing agent"
status: "design"
created_date: "2026-08-12"
version: "1.0.0"
---

# Design: Testing Agent Multi-Framework Architecture

## Architecture Overview

### 2-Tier Delegation Model

```
┌─────────────────────────────────────────┐
│  Repository Layer                       │
│  ├─ .github (control-plane)            │
│  ├─ Block Plugins                      │
│  ├─ Block Themes                       │
│  └─ Other Repos                        │
└──────────────┬──────────────────────────┘
               │
        ┌──────▼──────────────────────┐
        │ Testing Agents Layer        │
        ├──────────────────────────────┤
        │ .github/agents/testing.      │
        │ agent.md (Coordinator)       │
        │     ↓ delegates to ↓        │
        │ agents/testing-agent/       │
        │ (Multi-Framework            │
        │  Orchestrator)              │
        └──────┬───────────────────────┘
               │
   ┌───────────┴──────────────────┐
   │                              │
   ├─ Jest Provider               │
   ├─ PHPUnit Provider            │
   ├─ pytest Provider             │
   └─ Playwright Provider         │
```

**Rationale:**

- **Separation of concerns**: Control-plane coordinates; portable agent executes
- **Portability**: Portable agent reusable across LightSpeed projects
- **Maintainability**: Clear interface; independent evolution possible

---

## Component Specifications

### 1. Control-Plane Agent (`.github/agents/testing.agent.md`)

**Purpose:** Thin coordinator that detects frameworks and delegates to portable agent

**Responsibilities:**

- Detect which frameworks are present (Jest config, composer.json, etc.)
- Route to appropriate framework skill in portable agent
- Coordinate multi-framework execution
- Collect and format results
- Report to GitHub (checks, annotations, etc.)

**Does NOT do:**

- Execute tests directly
- Implement framework-specific logic
- Store test state between runs

**Interface:**

```
Input: Repository with one or more frameworks
  ↓
Detect frameworks
  ↓
Delegate to portable agent with framework(s)
  ↓
Receive results
  ↓
Report to GitHub
```

---

### 2. Portable Agent (`agents/testing-agent/`)

**Purpose:** Multi-framework orchestrator with complete test execution logic

**Structure:**

```
agents/testing-agent/
├── AGENT.md (multi-framework overview)
├── shared/
│   ├── core-prompt.md (Jest + PHPUnit + pytest + Playwright patterns)
│   └── constants.js (shared configuration)
├── skills/
│   ├── jest-wordpress-testing/
│   │   ├── SKILL.md
│   │   └── examples/
│   ├── phpunit-wordpress-testing/
│   │   ├── SKILL.md
│   │   └── examples/
│   ├── pytest-ci-testing/
│   │   ├── SKILL.md
│   │   └── examples/
│   └── playwright-testing/
│       ├── SKILL.md
│       └── examples/
├── guides/
│   ├── jest-wordpress-testing.md
│   ├── phpunit-wordpress-testing.md
│   ├── pytest-ci-testing.md
│   └── playwright-testing.md
├── providers/
│   ├── claude/agent.md
│   ├── copilot/agent.md
│   └── openai/agent.md
└── CHANGELOG.md
```

**Responsibilities:**

- Execute tests for all 4 frameworks
- Implement WordPress-specific patterns per framework
- Validate coverage thresholds
- Generate test reports
- Handle multi-framework projects (run all applicable frameworks)
- Support provider switching (Claude → Copilot → OpenAI)

**Version:** 2.2.0 (upgrade from v2.1.0 Playwright-only)

---

## Framework Specifications

### Jest + WordPress

**Pattern:** Mock-based testing for JavaScript/TypeScript blocks

**Responsibilities:**

- Mock `@wordpress/api-fetch` for REST calls
- Setup WordPress block utilities (`@wordpress/blocks`, etc.)
- Test action/filter execution
- Handle async WordPress data operations

**Coverage Target:** 85% (plugins), 80% (themes/other)

**Example Patterns:**

```javascript
// REST API mocking
jest.mock('@wordpress/api-fetch');
apiFetch.mockResolvedValue({ success: true });

// Block registration testing
expect(registerBlockType).toHaveBeenCalledWith('plugin/block', expect.any(Object));

// Action/filter testing
doAction('wp.plugin.init');
expect(callback).toHaveBeenCalled();
```

---

### PHPUnit + WordPress

**Pattern:** WordPress globals + database mocking for PHP tests

**Responsibilities:**

- Mock WordPress globals (`get_option()`, `apply_filters()`, etc.)
- Mock database operations (`$wpdb->get_results()`, etc.)
- Validate WPCS compliance
- Test against multiple WordPress/PHP versions

**Coverage Target:** 85% (plugins), 80% (themes/other)

**Example Patterns:**

```php
// WordPress globals mocking
Mockery::mock('function: get_option')
  ->andReturn('expected_value');

// Database mocking
$wpdb = Mockery::mock();
$wpdb->shouldReceive('get_results')->andReturn([...]);

// WPCS validation
phpcs --standard=WordPress plugin.php
```

---

### pytest + GitHub Actions

**Pattern:** CI integration testing with artifact handling

**Responsibilities:**

- Detect GitHub Actions environment
- Read test artifacts from workflows
- Parse test output (JSON, XML, log files)
- Generate metrics (pass rate, coverage, time)
- Create CI reports

**Coverage Target:** 75% (control-plane, utilities)

**Example Patterns:**

```python
# GitHub Actions integration
if os.environ.get('GITHUB_ACTIONS'):
    artifacts = get_workflow_artifacts()
    results = parse_test_output(artifacts)
    
# Metrics generation
coverage = extract_coverage(artifacts)
metrics = {
    'pass_rate': passed / total,
    'coverage': coverage,
    'duration': end - start
}
```

---

### Playwright + WordPress

**Pattern:** Browser automation for multi-browser E2E testing

**Responsibilities:**

- Setup Chrome, Firefox, Safari, Edge browsers
- Login to WordPress (stateful testing)
- Navigate e-commerce flows (WooCommerce)
- Validate accessibility (axe core)
- Capture screenshots/videos

**Coverage Target:** 70% (all E2E)

**Example Patterns:**

```javascript
// Multi-browser testing
const browsers = ['chromium', 'firefox', 'webkit'];
for (const browser of browsers) {
  const page = await browserContext.newPage();
  // Test in each browser
}

// WordPress stateful testing
await page.goto(wordPressUrl);
await page.fill('[name="log"]', username);
await page.click('[name="wp-submit"]');
// User is now logged in

// Accessibility validation
const violations = await getViolations(page);
expect(violations).toHaveLength(0); // WCAG 2.2 AA
```

---

## Integration Patterns

### Multi-Framework Projects

Projects can have Jest + PHPUnit simultaneously:

1. **Detection:** Control-plane detects both `package.json` (Jest) and `composer.json` (PHPUnit)
2. **Execution:** Portable agent runs both Jest tests AND PHPUnit tests
3. **Reporting:** Results separated by framework in GitHub checks
4. **Aggregation:** Overall pass/fail is "all frameworks must pass"

**Example:**

```
Input: Block plugin with both Jest and PHPUnit tests
  ↓
Detect: Jest (package.json) + PHPUnit (composer.json)
  ↓
Jest tests: 342 passed, coverage 87%
PHPUnit tests: 156 passed, coverage 88%
  ↓
Aggregate: All 498 tests passed, overall coverage 87.5%
  ↓
Report: ✅ All tests pass
```

---

### Provider Switching

Support all 3 providers (Claude, Copilot, OpenAI) with identical behavior:

**Claude Provider** (`.github/agents/testing.agent.md` + `agents/testing-agent/claude/agent.md`)

- Primary provider
- Full access to all LightSpeed infrastructure
- Integrated with .github workflows

**Copilot Provider** (`agents/testing-agent/copilot/agent.md`)

- Copilot IDE integration
- Testing guidance in editor
- Real-time test feedback during development

**OpenAI Provider** (`agents/testing-agent/openai/agent.md`)

- Alternative API integration
- Standalone test coordination
- Webhook-based reporting

**Rationale:** Multi-provider support prevents lock-in; allows team choice.

---

## Configuration

### Framework Detection

Automatic detection based on project files:

| Framework | Detection | Config File |
|-----------|-----------|-------------|
| **Jest** | Presence of | `package.json` with jest config |
| **PHPUnit** | Presence of | `composer.json` + phpunit.xml |
| **pytest** | Presence of | `pytest.ini` or `pyproject.toml` |
| **Playwright** | Presence of | `playwright.config.ts` or `playwright.config.js` |

### Coverage Thresholds

Set per project type:

```yaml
# Block plugin
jest:
  threshold: 85
phpunit:
  threshold: 85
playwright:
  threshold: 70

# Block theme
jest:
  threshold: 80
phpunit:
  threshold: 80
playwright:
  threshold: 70

# Control-plane
jest:
  threshold: 80
pytest:
  threshold: 75
playwright:
  threshold: 70
```

---

## Failure Handling

### Test Failures

| Framework | Action | Reporting |
|-----------|--------|-----------|
| **Jest** | Fail build, show diff | GitHub annotation per test |
| **PHPUnit** | Fail build, show stack trace | GitHub annotation per test |
| **pytest** | Fail build, show assertion | GitHub annotation per test |
| **Playwright** | Fail build, attach screenshot | GitHub annotation + screenshot |

### Coverage Failures

| Scenario | Action |
|----------|--------|
| Below threshold | Fail check, show delta |
| No coverage data | Warn, request coverage report |
| Partial coverage (multi-framework) | Aggregate across frameworks |

---

## Rollout Strategy

### Phase 2: Portable Agent

- Rename directory: `agents/playwright-testing-agent/` → `agents/testing-agent/`
- Add Jest, PHPUnit, pytest support alongside Playwright
- Update all provider configs
- Create comprehensive documentation

### Phase 3: Control-Plane

- Rewrite `.github/agents/testing.agent.md` as thin coordinator
- Implement delegation protocol
- Create workflow examples

### Phase 4: Testing

- Unit tests (80%+ coverage)
- Integration tests (50%+ coverage)
- E2E tests (70%+ critical path)
- Team training and documentation

---

## Success Criteria

- [x] 2-tier architecture clearly defined
- [x] All 4 frameworks specified with examples
- [x] Multi-framework integration pattern documented
- [x] Provider switching strategy defined
- [x] Failure handling and reporting specified
- [x] Rollout strategy clear

---

## References

- **Proposal:** [PROPOSAL.md](./PROPOSAL.md)
- **Task Breakdown:** [TASKS.md](./TASKS.md)
- **Implementation Plan:** [PROJECT_PLAN.md](./PROJECT_PLAN.md)
- **Architecture Diagrams:** [MERMAID_DIAGRAMS.md](./MERMAID_DIAGRAMS.md)

---

*Specification for testing infrastructure modernization at LightSpeed.*

---
title: "Design: Testing Agent Multi-Framework Architecture"
description: "Architectural design and technical specifications"
status: design
created_date: "2026-08-12"
last_updated: "2026-08-12"
version: "1.0.0"
---

# Design: Testing Agent Multi-Framework Architecture

## Architecture Overview

```
                      ┌─────────────────────────────────────┐
                      │  Repositories & Workflows            │
                      │  ├─ .github (control plane)         │
                      │  ├─ Block Themes                     │
                      │  ├─ Block Plugins                    │
                      │  └─ Other Org Repos                  │
                      └──────────────┬──────────────────────┘
                                     │
                      ┌──────────────▼──────────────────────┐
                      │  Testing Agents Layer                │
                      │  ┌────────────────────────────────┐ │
                      │  │ .github Agent (Coordinator)    │ │
                      │  │ • Light validation             │ │
                      │  │ • Workflow orchestration       │ │
                      │  │ • Delegates to portable agent  │ │
                      │  └────────────────┬───────────────┘ │
                      │                   │                  │
                      │  ┌────────────────▼───────────────┐ │
                      │  │ agents/testing-agent/          │ │
                      │  │ (Multi-Framework Orchestrator) │ │
                      │  │ • Framework selection          │ │
                      │  │ • Test execution               │ │
                      │  │ • Coverage reporting           │ │
                      │  └────────────────┬───────────────┘ │
                      └──────────────┬──────────────────────┘
                                     │
                      ┌──────────────▼──────────────────────┐
                      │  Framework Providers                 │
                      │  ├─ Jest (JavaScript/TypeScript)    │
                      │  ├─ PHPUnit (PHP)                   │
                      │  ├─ pytest (Python)                 │
                      │  └─ Playwright (Browser E2E)        │
                      └──────────────────────────────────────┘
```

## Component Design

### 1. Control-Plane Agent (`.github/agents/testing.agent.md`)

**Purpose:** Coordinate testing for .github infrastructure itself

**Responsibilities:**
- Validate GitHub Actions workflow YAML syntax
- Check script compliance with coding standards
- Light testing of validation scripts
- Delegate complex testing to portable agent

**What It Does NOT Do:**
- Full Jest test execution (delegates to portable agent)
- PHPUnit test execution (delegates)
- Playwright testing (delegates to portable agent)

**Key Methods:**
- `validateWorkflowSyntax(workflowPath)` — YAML validation
- `validateScriptCompliance(scriptPath)` — Coding standards check
- `delegateTestExecution(config)` — Handoff to portable agent
- `parseTestResults(results)` — Report failures & coverage

### 2. Portable Testing Agent (`agents/testing-agent/`)

**Purpose:** Execute tests across multiple frameworks

**Structure:**
```
agents/testing-agent/
├── AGENT.md                    # Multi-framework metadata
├── README.md                   # Documentation overview
├── shared/
│   ├── core-prompt.md          # Multi-framework guidance
│   ├── jest-wordpress.md       # Jest WordPress patterns
│   ├── phpunit-wordpress.md    # PHPUnit WordPress patterns
│   ├── pytest-patterns.md      # pytest patterns
│   └── playwright-patterns.md  # Playwright patterns
├── claude/
│   └── agent.md                # Claude provider config
├── copilot/
│   └── agent.md                # Copilot provider config
├── openai/
│   └── agent.md                # OpenAI provider config
├── skills/
│   ├── jest-wordpress-testing/
│   ├── phpunit-wordpress-testing/
│   ├── pytest-ci-testing/
│   └── playwright-wordpress-testing/
├── manifests/
│   ├── jest.manifest.json
│   ├── phpunit.manifest.json
│   ├── pytest.manifest.json
│   └── playwright.manifest.json
└── ARCHITECTURE_DIAGRAMS.md    # Visual overviews
```

**Capabilities:**

| Framework | Capability | Status |
|-----------|-----------|--------|
| **Jest** | Unit testing JS/TS | Current |
| | WordPress API mocking | Expand |
| | Block utilities testing | Expand |
| **PHPUnit** | Unit testing PHP | Current |
| | WordPress globals mocking | Expand |
| | WPCS compliance validation | Expand |
| | Multi-version testing | Expand |
| **pytest** | Python testing | Current |
| | CI log analysis | Expand |
| | Metrics generation | Expand |
| **Playwright** | Browser E2E testing | Current |
| | Multi-browser coverage | Current |
| | Accessibility testing | Current |
| | WordPress stateful testing | Current |

### 3. Framework-Specific Skills

Each framework gets dedicated skills with WordPress integration:

#### Jest Skill: `jest-wordpress-testing`
- Mock WordPress REST API responses
- Test block utilities and hooks
- Action/filter testing patterns
- Async WordPress API call handling

#### PHPUnit Skill: `phpunit-wordpress-testing`
- Mock WordPress global functions
- Database operation mocking
- WPCS compliance validation
- Multi-version compatibility testing

#### pytest Skill: `pytest-ci-testing`
- GitHub Actions integration
- CI artifact handling
- Log parsing and analysis
- Metrics generation

#### Playwright Skill: `playwright-wordpress-testing`
- Multi-browser testing setup
- Accessibility validation
- WordPress stateful testing (logins, cart, etc.)
- WooCommerce-specific patterns

## Delegation Protocol

### When to Use Control-Plane Agent

✅ **Light validation tasks:**
- Workflow YAML syntax
- Script compliance checks
- Schema validation
- Label automation verification

✅ **When testing .github itself:**
- Testing control-plane workflows
- Testing utility scripts
- Testing validation automation

### When to Delegate to Portable Agent

→ **Any actual test execution:**
- Jest unit tests
- PHPUnit tests
- pytest tests
- Playwright E2E tests

→ **Coverage analysis:**
- Coverage metrics
- Threshold validation
- Coverage gap reporting

→ **Complex testing scenarios:**
- Multi-framework coordination
- Requirement traceability (Playwright)
- Failure triage and analysis

## WordPress Integration

### Jest + WordPress

```javascript
// Mock WordPress REST API
jest.mock('@wordpress/api-fetch', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock WordPress hooks
jest.mock('@wordpress/hooks', () => ({
  doAction: jest.fn(),
  applyFilters: jest.fn(),
}));

// Mock block utilities
jest.mock('@wordpress/block-editor', () => ({
  RichText: jest.fn(),
  URLInputButton: jest.fn(),
}));
```

### PHPUnit + WordPress

```php
// Access WordPress globals safely
global $wpdb, $wp_query, $post;

// Use WordPress test fixtures
$post_id = self::factory()->post->create([
  'post_title' => 'Test Post',
  'post_content' => 'Test content',
]);

// Test against WordPress functions
$this->assertTrue( function_exists( 'get_post' ) );
```

### pytest + WordPress

```python
# Parse WordPress logs
logs = parse_wp_debug_log('/path/to/debug.log')

# Validate against WordPress patterns
assert validate_wp_coding_standards(file_path)

# GitHub Actions integration
artifacts = fetch_github_artifacts(run_id, 'logs/')
```

### Playwright + WordPress

```typescript
// Stateful WordPress testing
await page.goto('https://staging.example.com/wp-login.php');
await page.fill('[name="log"]', username);
await page.fill('[name="pwd"]', password);
await page.click('input[type="submit"]');

// WooCommerce cart operations
await page.goto(productUrl);
await page.click('button.single_add_to_cart_button');
await page.goto('/cart/');
```

## Coverage Thresholds

### By Project Type

| Project | Jest | PHPUnit | pytest | Playwright |
|---------|------|---------|--------|-----------|
| Block Plugins | 85% | 85% | N/A | 70% |
| Block Themes | 80% | 80% | N/A | 70% |
| Control-Plane | 75% | N/A | 75% | N/A |
| Other Repos | 75% | 75% | 75% | 70% |

### Enforcement

- **CI Validation:** Coverage must meet threshold before merge
- **Failure Handling:** Below-threshold coverage blocks merge
- **Reporting:** Coverage report included in PR comment
- **Trends:** Monitor coverage trends over time

## Testing Levels

### Unit Tests
- Individual functions/methods
- Framework-specific patterns
- Fast execution (< 1s per test)
- High coverage (80%+)

### Integration Tests
- Multiple components together
- Framework + WordPress integration
- Moderate execution time (1-5s)
- Coverage 50%+ of workflows

### E2E Tests
- Full workflow validation
- GitHub Actions integration (for control-plane)
- Slow execution (5-60s per test)
- Critical path coverage only

## Migration Path

### Phase 2.1: Directory Structure
```bash
# Rename portable agent
git mv agents/playwright-testing-agent/ agents/testing-agent/

# Update all references in:
# - AGENT.md (title, description)
# - README.md (overview)
# - Provider configs
# - Skills references
```

### Phase 2.2-2.6: Expand Agent
- Add Jest, PHPUnit, pytest skills
- Update core prompt with multi-framework guidance
- Add framework-specific guides
- Update provider configs

### Phase 3: Rewrite Control-Plane Agent
- Remove direct test execution
- Focus on coordination and delegation
- Create workflow examples

### Phase 4: Testing & Validation
- Run full test suite
- Validate provider support (Claude, Copilot, OpenAI)
- Document migration for teams

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|------------|
| Framework Coverage | 4/4 (100%) | All frameworks have skills |
| Provider Support | 3/3 (100%) | Claude, Copilot, OpenAI working |
| Documentation | 100% | All frameworks have guides |
| Test Validation | 100% | All providers pass tests |
| Team Adoption | 80%+ | Teams using for their repos |

---

## References

- **Proposal:** [proposal.md](./proposal.md)
- **Tasks:** [tasks.md](./tasks.md)
- **Master Issue:** [#1799](https://github.com/lightspeedwp/.github/issues/1799)

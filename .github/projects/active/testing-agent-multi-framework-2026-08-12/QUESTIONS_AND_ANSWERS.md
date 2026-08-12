# Scope Clarification: Questions & Answers with Best Practices

**Document:** Answers to key scope questions for testing agent multi-framework architecture  
**Status:** Initial recommendations (awaiting user feedback)  
**Last Updated:** 2026-08-12

---

## Q1: Which repositories should use the org-wide testing agent?

### Recommended Answer

**✅ All LightSpeed repositories** (block themes, block plugins, and other org projects)

### Rationale

**Why not limit to block themes/plugins only?**

- The portable `agents/testing-agent/` is architected for **reusability**
- A broad scope justifies the investment in framework support and documentation
- WordPress Coding Standards apply org-wide
- Jest, PHPUnit patterns are consistent across projects

**Benefits of org-wide scope:**

1. **Consistency** — Same testing standards and practices everywhere
2. **Efficiency** — Invest once, reuse everywhere; no duplicate agents
3. **Maintainability** — Single portable agent to update, not multiple
4. **Knowledge sharing** — Documentation and skills benefit all repos
5. **Future-proof** — Easy to add new repos or frameworks later

**Scope definition:**

```
✅ Include:
  - Block theme repos
  - Block plugin repos
  - WooCommerce site builder config repos
  - WordPress site builder config repos
  - Utility/tool repos
  - CI/CD and infrastructure repos (as applicable)

⚠️  Exclude:
  - Client-specific projects (use portable agent as template, customize for client)
  - Archived/deprecated repos
```

**Implementation:**

- `.github/agents/testing.agent.md` → control-plane only
- `agents/testing-agent/` → available for any org repo to use
- Document in each repo's README how to adopt the testing agent

---

## Q2: Framework Coverage & WordPress Integration

### Recommended Answers

#### Jest (JavaScript/TypeScript)

**✅ Recommended coverage:**

- ✅ WordPress REST API mocking
- ✅ Block utilities testing
- ✅ Async WordPress data fetching
- ✅ WordPress action/filter testing

**Why all four?**

- All are common patterns in LightSpeed block theme/plugin work
- REST API mocking is essential for unit testing
- Block utilities are core to theme/plugin development
- Action/filter testing is WordPress best practice

**Skills to create:**

- `jest-wordpress-mocking` — Mock WordPress APIs, REST responses, action/filters
- `jest-block-utilities` — Test block helper functions

**Example patterns:**

```javascript
// Mock WordPress REST API
jest.mock('@wordpress/api-fetch', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve({ status: 'success' }))
}));

// Test WordPress actions/filters
jest.mock('@wordpress/hooks', () => ({
  addAction: jest.fn(),
  doAction: jest.fn()
}));
```

---

#### PHPUnit (PHP)

**✅ Recommended coverage (all):**

- ✅ WordPress global function mocking
- ✅ Database operation mocking
- ✅ WordPress Coding Standards (WPCS) compliance
- ✅ Multi-version compatibility testing (WP versions)
- ✅ Multi-version compatibility testing (PHP versions)

**Why all five?**

- WordPress global functions are ubiquitous in PHP code
- Database mocking is critical for unit tests (don't hit real DB)
- WPCS is org-wide requirement (must validate in tests)
- Multi-version testing prevents breaking changes
- PHP compatibility is production concern

**Skills to create:**

- `phpunit-wordpress-globals` — Mock `get_option`, `apply_filters`, `do_action`, etc.
- `phpunit-database-mocking` — wpdb mock setup
- `phpunit-wpcs-validation` — WPCS compliance checks in tests
- `phpunit-version-compatibility` — Multi-version test matrices

**Example patterns:**

```php
// Mock WordPress globals in PHPUnit
\WP_Mock::setUp();
\WP_Mock::userFunction('get_option')
    ->with('my_option')
    ->andReturn('test_value');

// WPCS sniff in tests
$phpcs = new \PHP_CodeSniffer\Runner();
$phpcs->process([
    'standard' => 'WordPress',
    'files' => ['src/MyClass.php']
]);
```

---

#### pytest (Python)

**✅ Recommended coverage (all):**

- ✅ GitHub API integration testing
- ✅ Log parsing/analysis
- ✅ CI artifact handling
- ✅ Metrics generation

**Why all four?**

- GitHub API is used in many control-plane scripts
- Log analysis is common for troubleshooting/metrics
- Artifact handling is part of CI workflows
- Metrics drive decision-making

**Skills to create:**

- `pytest-github-api` — GitHub API mocking and integration
- `pytest-ci-integration` — Mock CI workflows, artifact handling
- `pytest-data-analysis` — Log parsing, metrics generation

**Example patterns:**

```python
# Mock GitHub API
import responses

@responses.activate
def test_create_issue():
    responses.add(responses.POST, 'https://api.github.com/repos/owner/repo/issues',
                  json={'id': 1, 'title': 'test'})
    # test code here

# Test log parsing
def test_parse_workflow_log():
    log_content = "::error::Something failed"
    errors = parse_log(log_content)
    assert len(errors) == 1
```

---

#### Playwright (Browser Testing)

**✅ Keep existing v2.1.0 scope (all):**

- ✅ Multi-browser testing (Chrome, Firefox, Safari, Edge)
- ✅ Mobile/responsive testing
- ✅ Accessibility testing (axe, WCAG)
- ✅ WordPress stateful testing (login, create posts, etc.)
- ✅ WooCommerce testing (storefront, checkout, etc.)

**Rationale:**

- `agents/playwright-testing-agent` v2.1.0 is well-scoped
- All items above are already implemented and tested
- No reduction needed; maintain quality baseline

---

## Q3: Test Coverage Requirements

### Recommended Answer

| Framework | Control-Plane | Block Themes | Block Plugins | Other Repos |
|-----------|---|---|---|---|
| **Jest** | 80% | 85% | 85% | 80% |
| **PHPUnit** | N/A | 80% | 85% | 80% |
| **pytest** | 75% | N/A | N/A | 75% |
| **Playwright** | N/A | 70% | 70% | 70% |

### Rationale

**Why differentiated thresholds?**

- Block plugins are customer-facing code → higher threshold (85%)
- Block themes are customer-facing code → moderate threshold (80%)
- Control-plane is internal automation → slightly lower (80% for JS, 75% for Python)
- E2E tests (Playwright) have lower threshold because they're harder to achieve (70%)

**Why these specific numbers?**

- **85%:** Industry standard for production plugins
- **80%:** Good balance for reliable code + maintainability
- **75%:** Practical for CI/internal scripts
- **70%:** Realistic for E2E tests (hard to cover all scenarios)

**Coverage gates: Should they block merge?**

- ✅ **Yes, gates should block merge** — Enforces standards
- Alternative: Gate as "warning" or "info" → weaker than desired
- Rationale: Merging low-coverage code increases maintenance debt

**Handling legacy code with low coverage?**

- Create migration path: Exempt legacy files from coverage requirement
- Document in each repo's TESTING_STANDARDS.md
- Plan gradual improvement (set phase-in deadline)
- Example: "Jest coverage required except for legacy/ folder until 2026-12-31"

---

## Q4: Documentation & Skill Development

### Recommended Answer

#### For `agents/testing-agent/` (Portable)

**✅ Create all of these:**

- ✅ AGENT.md with multi-framework overview
- ✅ Framework-specific guides (Jest guide, PHPUnit guide, pytest guide)
- ✅ WordPress integration patterns (REST API, Hooks, Globals)
- ✅ Skills for each framework (jest-skill, phpunit-skill, pytest-skill)
- ✅ Provider-specific configs (Claude, Copilot, OpenAI)
- ✅ README.md with quick-start examples

**Structure:**

```
agents/testing-agent/
├── AGENT.md                          (multi-framework overview)
├── README.md                         (quick start + examples)
├── shared/
│   ├── core-prompt.md               (multi-framework instructions)
│   └── framework-selection.md        (how to choose framework)
├── claude/
│   └── agent.md                     (Claude-specific config)
├── copilot/
│   └── agent.md                     (Copilot-specific config)
├── openai/
│   └── agent.md                     (OpenAI-specific config)
├── skills/
│   ├── jest-wordpress-mocking/      (Jest + WordPress patterns)
│   ├── phpunit-wordpress-globals/   (PHPUnit + WordPress patterns)
│   ├── pytest-github-api/           (pytest + GitHub integration)
│   └── playwright-wordpress-e2e/    (existing, maybe expand)
├── frameworks/
│   ├── JEST.md                      (Jest-specific guide)
│   ├── PHPUNIT.md                   (PHPUnit-specific guide)
│   ├── PYTEST.md                    (pytest-specific guide)
│   └── PLAYWRIGHT.md                (Playwright guide, enhanced)
└── manifests/
    ├── claude.json
    ├── copilot.json
    └── openai.json
```

#### For `.github/agents/testing.agent.md`

**✅ Create all of these:**

- ✅ Control-plane testing guide (workflows, scripts, validation)
- ✅ Delegation patterns to portable agent
- ✅ GitHub Actions workflow testing
- ✅ Label automation testing
- ✅ Schema validation testing
- ✅ Examples and quick-start

**Structure:**

```
.github/agents/testing.agent.md
├── Role & Responsibilities
├── Control-Plane Testing Scope
├── When to Delegate to agents/testing-agent/
├── GitHub Actions Workflow Testing
├── Validation Script Testing
├── Label Automation Testing
├── Schema Validation Testing
├── Examples (workflow test, script test, schema test)
└── Related Agents & Documentation
```

---

## Q5: Testing Strategy & Deployment

### Recommended Answer

#### Unit Tests for New Scripts

**✅ Full coverage for all new scripts:**

**Jest (JavaScript utilities in `.github/scripts/`):**

- ✅ Unit test all new JS utilities
- ✅ Coverage threshold: 85%
- ✅ Mock external dependencies (GitHub API, file system)
- ✅ Test error cases and edge cases

**PHPUnit (PHP validators in `.github/scripts/`):**

- ✅ Unit test all new PHP code
- ✅ Coverage threshold: 85%
- ✅ Mock WordPress globals
- ✅ Run WPCS checks as part of test suite

**pytest (Python scripts in `.github/scripts/`):**

- ✅ Unit test all new Python code
- ✅ Coverage threshold: 75%
- ✅ Mock GitHub API and file operations
- ✅ Test data processing logic

**Delivery:**

- Each new script/utility must include test suite
- Tests committed alongside code
- CI workflow validates coverage before merge

---

#### Integration Tests

**✅ Test all critical coordination:**

| Test Scenario | Framework | How | Success Criteria |
|---|---|---|---|
| .github agent invokes portable agent | Jest | Mock agent call | Agent coordinates correctly |
| Control-plane workflows use .github agent | GitHub Actions | Run workflow in test environment | Workflow executes, agents invoked |
| Block theme repo uses portable agent | Jest + PHPUnit | Real repo + mock tests | Tests execute, coverage reported |
| Block plugin repo uses portable agent | Jest + PHPUnit | Real repo + mock tests | Tests execute, coverage reported |
| Cross-repo testing (if needed) | Playwright | E2E test workflow | Results reported to GitHub |

**Delivery:**

- Create `.github/workflows/test-agent-coordination.yml`
- Mock test scenarios for block themes/plugins
- Validate success criteria in workflow

---

#### E2E Tests (Playwright)

**✅ Validate critical workflows:**

| Workflow | Test | Success Criteria |
|---|---|---|
| GitHub Actions test execution | Deploy test workflow, run agent | Tests pass, coverage reported |
| Test reporting to GitHub | Workflow creates PR comment with results | Comment contains test results, coverage |
| Label sync workflows | Run label orchestrator, verify labels updated | Labels created/updated correctly |
| Release workflows | Run release workflow, verify version/tags | Version detected, changelog updated, tag created |

**Delivery:**

- Create `e2e/workflows/` directory
- Playwright specs for each critical workflow
- Run in staging environment (not main)
- Report results to PR

---

### Implementation Summary

**Phase 1: Scripts & Setup**

- [ ] Unit tests for all new JS/PHP/Python scripts
- [ ] Test discovery and CI integration
- [ ] Coverage reporting setup

**Phase 2: Agent Coordination**

- [ ] Integration tests for agent delegation
- [ ] Mock test scenarios for block repos
- [ ] Validate cross-agent communication

**Phase 3: Workflow Validation**

- [ ] E2E tests for critical GitHub Actions workflows
- [ ] Test reporting and PR comments
- [ ] Validation of label sync and release workflows

**Phase 4: Documentation & Training**

- [ ] Publish testing standards for org repos
- [ ] Create quick-start guide for new projects
- [ ] Document framework selection guidance

---

## Summary: Decisions & Next Steps

| Question | Decision | Impact |
|---|---|---|
| Q1: Scope | All LightSpeed repos | Invest in reusable infrastructure |
| Q2: Frameworks | All (Jest, PHPUnit, pytest, Playwright) | Comprehensive WordPress support |
| Q3: Coverage | Differentiated by context | Enforceable, realistic standards |
| Q4: Documentation | Full (guides, skills, provider configs) | Enable adoption across org |
| Q5: Testing | Unit + Integration + E2E | Verify agent works before release |

**Next Actions:**

1. ✅ Review and confirm recommendations
2. ⏳ Create detailed implementation plan (IMPLEMENTATION_PLAN.md)
3. ⏳ Generate Mermaid architecture diagrams (ARCHITECTURE_DIAGRAMS.md)
4. ⏳ Create GitHub issues for tracking
5. ⏳ Start Phase 1: Rename & expand portable testing agent

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

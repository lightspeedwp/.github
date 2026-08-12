# Implementation Plan: Multi-Framework Testing Agent

**Status:** Draft planning document  
**Target Timeline:** Phase 1 (design/planning), Phase 2-4 (implementation)  
**Owner:** Ash Shaw

---

## Phase 1: Design & Planning (Current Sprint)

### Task 1.1: Architecture Design & Review

**Objective:** Finalize the 2-tier testing architecture with team review.

**Deliverables:**

- [ ] Architecture overview approved (README.md complete)
- [ ] Mermaid diagrams created (ARCHITECTURE_DIAGRAMS.md)
- [ ] Delegation flow documented
- [ ] Framework coverage matrix approved

**Success Criteria:**

- Team confirms scope (all LightSpeed repos)
- Framework support list confirmed
- Coverage thresholds approved
- No blocking objections to 2-tier model

**Estimated effort:** 2-4 hours (design + review)

---

### Task 1.2: Scope Clarification (Questions & Answers)

**Objective:** Answer all 5 key questions with rationale and best practices.

**Status:** ✅ Complete (QUESTIONS_AND_ANSWERS.md created)

**Deliverables:**

- [x] Q1: Repository scope → All LightSpeed repos
- [x] Q2: Framework coverage → All (Jest, PHPUnit, pytest, Playwright)
- [x] Q3: Coverage thresholds → Differentiated by context
- [x] Q4: Documentation scope → Full (guides, skills, configs)
- [x] Q5: Testing strategy → Unit + Integration + E2E

**Next:** User review and confirmation of recommendations

---

### Task 1.3: Create Implementation Roadmap

**Objective:** Break Phase 2-4 into concrete, trackable tasks.

**Deliverables:**

- [ ] IMPLEMENTATION_PLAN.md (this document) — detailed task breakdown
- [ ] GitHub issues created for each task (linked to project)
- [ ] Acceptance criteria defined for each task
- [ ] Team assignments and estimates

**Success Criteria:**

- All Phase 2-4 tasks have GitHub issues
- Issues are properly labeled and linked to project
- Estimates are realistic (1-3 days per task)
- Critical path is identified

**Estimated effort:** 4-6 hours (planning + issue creation)

---

## Phase 2: Portable Testing Agent Expansion

### Task 2.1: Rename `agents/playwright-testing-agent/` → `agents/testing-agent/`

**Objective:** Rename the portable agent to reflect multi-framework scope.

**Deliverables:**

- [ ] Directory renamed: `agents/playwright-testing-agent/` → `agents/testing-agent/`
- [ ] Git history preserved (simple rename, no file changes)
- [ ] All references updated in docs
- [ ] PR created and merged

**Steps:**

```bash
git mv agents/playwright-testing-agent agents/testing-agent
git add agents/testing-agent/
git commit -m "rename: agents/playwright-testing-agent → agents/testing-agent"
```

**Files to update references:**

- Root README.md (if it mentions playwright agent)
- CLAUDE.md (if it lists agents)
- Any project documentation
- Links in other agent files

**Success Criteria:**

- Directory renamed
- References updated
- No broken links
- Git history preserved

**Estimated effort:** 1-2 hours

---

### Task 2.2: Update AGENT.md Frontmatter & Metadata

**Objective:** Update agent definition to reflect multi-framework scope.

**Changes:**

```yaml
# Before:
title: "Playwright Testing Agent"
description: "Multi-provider Playwright testing agent..."
capabilities:
  - playwright-spec-generation
  - cross-browser-testing
  - ...

# After:
title: "Testing Agent"
description: "Multi-provider, multi-framework testing agent supporting Jest, PHPUnit, pytest, and Playwright..."
capabilities:
  - jest-testing
  - phpunit-testing
  - pytest-testing
  - playwright-spec-generation
  - cross-browser-testing
  - ...
```

**Deliverables:**

- [ ] AGENT.md frontmatter updated
- [ ] Title changed to "Testing Agent"
- [ ] Description updated to mention all frameworks
- [ ] Capabilities list expanded
- [ ] Tags updated (add jest, phpunit, pytest)
- [ ] Version bumped to 2.2.0

**Files affected:**

- `agents/testing-agent/AGENT.md`
- `agents/testing-agent/claude/agent.md` (provider config)
- `agents/testing-agent/copilot/agent.md` (provider config)
- `agents/testing-agent/openai/agent.md` (provider config)

**Success Criteria:**

- Metadata reflects all frameworks
- Version updated
- Provider configs updated
- No broken references

**Estimated effort:** 1-2 hours

---

### Task 2.3: Enhance Core Prompt with Framework Guidance

**Objective:** Add framework-specific guidance to the shared core prompt.

**File:** `agents/testing-agent/shared/core-prompt.md`

**Sections to add:**

- [ ] **Framework Selection** — How to choose between Jest/PHPUnit/pytest/Playwright
- [ ] **Jest + WordPress** — REST API mocking, block utilities, async patterns
- [ ] **PHPUnit + WordPress** — Global functions, wpdb mocking, WPCS validation
- [ ] **pytest + WordPress** — GitHub API, CI integration, log parsing
- [ ] **Playwright** — (Keep existing, maybe expand for WordPress-specific E2E)

**Example content structure:**

```markdown
## Framework-Specific Guidance

### Jest (JavaScript/TypeScript)
- **When to use:** Unit testing block JavaScript, utility functions, async logic
- **WordPress patterns:**
  - Mock @wordpress/api-fetch
  - Mock @wordpress/hooks
  - Test block utilities
- **Coverage requirement:** 85% for block plugins, 80% for themes
- **Example:** [link to jest-wordpress-mocking skill]

### PHPUnit (PHP)
- **When to use:** Unit testing block PHP, WordPress-aware validators
- **WordPress patterns:**
  - Mock WordPress global functions
  - Mock wpdb operations
  - Validate WPCS compliance
- **Coverage requirement:** 85% for block plugins, 80% for themes
- **Example:** [link to phpunit-wordpress-globals skill]

[... similar for pytest and Playwright ...]
```

**Deliverables:**

- [ ] Core prompt enhanced with framework sections
- [ ] Examples provided for each framework
- [ ] Links to relevant skills
- [ ] WordPress-specific patterns documented

**Success Criteria:**

- Core prompt covers all 4 frameworks
- Examples are clear and actionable
- Links to skills work correctly
- No contradictions with provider-specific prompts

**Estimated effort:** 3-4 hours

---

### Task 2.4: Create/Update Framework-Specific Skills

**Objective:** Build skills for each framework with WordPress integration patterns.

**Skills to create:**

#### Jest Skill: `jest-wordpress-mocking`

```
agents/testing-agent/skills/jest-wordpress-mocking/
├── SKILL.md
├── examples/
│   ├── mock-rest-api.js
│   ├── mock-wordpress-globals.js
│   └── mock-hooks.js
└── templates/
    └── jest.config.template.js
```

**Content:**

- Mocking @wordpress/api-fetch
- Mocking @wordpress/hooks (addAction, doAction, apply Filters)
- WordPress REST API response mocking
- Block utilities testing patterns
- Async pattern handling

#### PHPUnit Skill: `phpunit-wordpress-globals`

```
agents/testing-agent/skills/phpunit-wordpress-globals/
├── SKILL.md
├── examples/
│   ├── mock-get-option.php
│   ├── mock-apply-filters.php
│   └── mock-wpdb.php
└── templates/
    └── phpunit.xml.template
```

**Content:**

- WP_Mock setup and usage
- Mocking get_option, apply_filters, do_action
- wpdb mocking
- WPCS integration in tests
- Multi-version compatibility testing

#### pytest Skill: `pytest-github-api`

```
agents/testing-agent/skills/pytest-github-api/
├── SKILL.md
├── examples/
│   ├── mock-list-issues.py
│   ├── mock-create-pr.py
│   └── mock-ci-artifacts.py
└── templates/
    └── conftest.py.template
```

**Content:**

- GitHub API mocking with responses
- GitHub Actions artifact handling
- CI workflow integration
- Log parsing and analysis
- Metrics generation

#### Playwright Skill: Expand existing `playwright-wordpress-e2e`

```
agents/testing-agent/skills/playwright-wordpress-e2e/
├── SKILL.md (enhance with multi-framework context)
├── examples/ (keep existing)
├── fixtures/ (WordPress-specific fixtures)
└── templates/ (playwright.config.template.js)
```

**Content to add:**

- WordPress login fixtures
- WooCommerce storefront fixtures
- Stateful testing patterns
- Multi-browser testing setup

**Deliverables:**

- [ ] jest-wordpress-mocking skill created
- [ ] phpunit-wordpress-globals skill created
- [ ] pytest-github-api skill created
- [ ] playwright-wordpress-e2e skill enhanced
- [ ] All skills have SKILL.md, examples, templates

**Success Criteria:**

- Each skill is self-contained and reusable
- Examples are clear and copy-paste ready
- Templates work for typical LightSpeed projects
- No missing WordPress-specific patterns

**Estimated effort:** 6-8 hours (all 4 skills)

---

### Task 2.5: Create Framework-Specific Guides

**Objective:** Document best practices for each framework.

**Files to create:**

#### `agents/testing-agent/frameworks/JEST.md`

- Jest basics and setup
- WordPress API mocking patterns
- Common pitfalls and solutions
- Coverage reporting
- Debugging Jest tests

#### `agents/testing-agent/frameworks/PHPUNIT.md`

- PHPUnit basics and setup
- WordPress global mocking
- wpdb mocking and testing
- WPCS validation in tests
- Running against multiple PHP/WP versions

#### `agents/testing-agent/frameworks/PYTEST.md`

- pytest basics and setup
- GitHub API integration
- CI workflow mocking
- Log parsing and analysis
- Metrics generation

#### `agents/testing-agent/frameworks/PLAYWRIGHT.md` (enhance existing)

- Expand with multi-provider context
- Add WordPress-specific E2E patterns
- WooCommerce testing specifics
- Accessibility testing with axe
- Performance monitoring

**Each guide should include:**

- Quick-start example
- Configuration templates
- Common patterns
- Troubleshooting guide
- Links to relevant skills

**Deliverables:**

- [ ] JEST.md created (800-1000 lines)
- [ ] PHPUNIT.md created (800-1000 lines)
- [ ] PYTEST.md created (600-800 lines)
- [ ] PLAYWRIGHT.md enhanced (add 200-300 lines)

**Success Criteria:**

- Guides are comprehensive but readable
- Examples are copy-paste ready
- All guides follow same structure
- No duplication with core prompt

**Estimated effort:** 8-10 hours (all 4 guides)

---

### Task 2.6: Update Provider-Specific Configurations

**Objective:** Configure Claude, Copilot, and OpenAI providers with multi-framework support.

**Files to update:**

- `agents/testing-agent/claude/agent.md`
- `agents/testing-agent/copilot/agent.md`
- `agents/testing-agent/openai/agent.md`

**Changes for each provider:**

- [ ] Add framework selection guidance
- [ ] Include provider-specific examples (Jest, PHPUnit, pytest, Playwright)
- [ ] Update capabilities list
- [ ] Add links to framework guides
- [ ] Configure provider-specific tools/integrations

**Example (Claude provider):**

```markdown
# Testing Agent — Claude Provider Configuration

## Capabilities
- Framework selection (Jest, PHPUnit, pytest, Playwright)
- Multi-provider Playwright orchestration
- Requirement traceability for Playwright
- Review-before-code gates
- Jest testing with WordPress mocking
- PHPUnit testing with WordPress globals
- pytest testing with GitHub integration

## Tools Available
- File system (read/write)
- Shell execution (npm, php, python)
- GitHub API (read/write)
- Claude-specific: Code block rendering, structured output

## Framework Selection Logic
Use Jest for: JavaScript/TypeScript unit testing
Use PHPUnit for: PHP unit testing
Use pytest for: Python scripts and utilities
Use Playwright for: E2E browser testing

[... more details ...]
```

**Deliverables:**

- [ ] Claude provider config updated
- [ ] Copilot provider config updated
- [ ] OpenAI provider config updated
- [ ] All configs reference framework guides
- [ ] Examples provided for each framework

**Success Criteria:**

- Providers are configured consistently
- Each provider knows about all frameworks
- Examples are provider-appropriate
- No provider limitations documented

**Estimated effort:** 2-3 hours (all 3 providers)

---

### Task 2.7: Update Agent README & Documentation

**Objective:** Update README.md to reflect multi-framework scope.

**File:** `agents/testing-agent/README.md`

**Changes:**

- [ ] Title updated to "Testing Agent"
- [ ] Overview mentions all frameworks
- [ ] Framework selection guide added
- [ ] Quick-start examples for each framework
- [ ] Links to framework-specific guides
- [ ] Links to skills
- [ ] Architecture diagram added

**Structure:**

```markdown
# Testing Agent — Multi-Framework Testing for LightSpeed

> Multi-provider, multi-framework testing agent supporting Jest, PHPUnit, pytest, and Playwright for WordPress and WooCommerce projects.

## Quick Start

### Choose Your Framework
[Table showing when to use each framework]

### Jest (JavaScript/TypeScript)
[Quick-start example]

### PHPUnit (PHP)
[Quick-start example]

### pytest (Python)
[Quick-start example]

### Playwright (Browser Testing)
[Quick-start example]

## Detailed Guides
[Links to JEST.md, PHPUNIT.md, PYTEST.md, PLAYWRIGHT.md]

## Skills & Tools
[Links to skill documentation]

## Provider Configuration
[Links to Claude, Copilot, OpenAI configs]

[... more sections ...]
```

**Deliverables:**

- [ ] README.md updated and comprehensive
- [ ] Quick-start examples work
- [ ] Links are correct
- [ ] Screenshots/diagrams added

**Success Criteria:**

- New users can get started quickly
- Navigation is clear and logical
- All 4 frameworks are equally prominent
- Examples are copy-paste ready

**Estimated effort:** 2-3 hours

---

## Phase 3: Control-Plane Agent Rewrite

### Task 3.1: Rewrite `.github/agents/testing.agent.md`

**Objective:** Rewrite the control-plane testing agent with delegation focus.

**Deliverables:**

- [ ] Agent purpose clarified (control-plane coordinator, not executor)
- [ ] Delegation model documented
- [ ] "In Scope" vs. "Out of Scope" sections clear
- [ ] Control-plane specific examples provided
- [ ] Links to portable testing agent
- [ ] Version bumped to 0.2.0

**Key sections:**

```markdown
---
name: Testing
title: 'Testing Agent: Control-Plane Test Orchestration'
description: Testing coordinator for the .github control plane that orchestrates
  test execution for workflows and scripts while delegating to agents/testing-agent/
...
---

# Testing Agent: Control-Plane Test Orchestration

## Overview
Testing coordinator for GitHub control-plane automation...

## Role & Responsibilities
- Coordinate test execution for .github workflows
- Validate GitHub Actions workflow logic
- Light validation of .github/scripts/
- Delegate full test execution to agents/testing-agent/

## Scope: What This Agent Owns

### In Scope (Control-Plane Testing)
- Jest unit tests for .github/scripts/ (light)
- GitHub Actions workflow validation
- Labeling automation testing
- Release workflow testing
- Schema validation testing

### Out of Scope (Delegate to agents/testing-agent/)
- WordPress/WooCommerce E2E testing
- Block theme/plugin testing
- Complex framework-specific test execution
- Coverage analysis and reporting

## Coordination Model

### With `agents/testing-agent/`:
- When: Actual test execution needed
- How: Provide test config + framework selection
- Example: "Run Jest suite for .github/scripts/ with 85% threshold"

## Examples
- Test GitHub Actions label-sync workflow
- Validate release workflow version detection
- Test schema validation against WordPress standards

[... more sections ...]
```

**Files affected:**

- `.github/agents/testing.agent.md` (main rewrite)
- `.github/agents/testing.agent.md` metadata/version update

**Success Criteria:**

- Agent is clearly a coordinator, not executor
- Delegation to portable agent is explicit
- Examples focus on .github scenarios
- No duplication with portable agent
- Version updated to 0.2.0

**Estimated effort:** 3-4 hours

---

### Task 3.2: Create GitHub Actions Workflow Examples

**Objective:** Document how to use the rewritten control-plane agent.

**Deliverables:**

- [ ] `.github/workflows/test-scripts.example.yml` — Template for testing .github/scripts/
- [ ] `.github/workflows/validate-workflows.example.yml` — Template for workflow validation
- [ ] Documentation: "How to use Testing Agent in Your Workflow"

**Example workflow:**

```yaml
name: Test Control-Plane Scripts

on: [pull_request]

jobs:
  test-scripts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Jest tests for .github/scripts/
        run: |
          npm ci
          npm run test:scripts -- --coverage
      
      - name: Check coverage threshold
        run: npm run test:coverage -- --threshold=80
```

**Success Criteria:**

- Templates are copy-paste ready
- Documentation is clear
- Examples cover Jest, PHPUnit, pytest
- Delegation to portable agent is shown

**Estimated effort:** 2-3 hours

---

## Phase 4: Testing & Validation

### Task 4.1: Unit Tests for New Scripts

**Objective:** Write unit tests for all new scripts created during Phases 2-3.

**Test files to create:**

If any coordination logic is implemented as scripts:

- `.github/scripts/__tests__/agent-coordinator.test.js` (if JS coordinator)
- Tests for framework selection logic
- Tests for delegation logic

**Success Criteria:**

- All new scripts have unit tests
- Coverage ≥ 85%
- Tests run in CI
- All tests pass

**Estimated effort:** 2-3 hours (depends on number of new scripts)

---

### Task 4.2: Integration Tests

**Objective:** Test that agents coordinate correctly.

**Test scenarios:**

```
1. .github agent invokes portable agent
   - Input: Test config (framework, threshold, paths)
   - Expected: Portable agent executes
   - Validation: Results returned to .github agent

2. GitHub Actions workflow uses testing agent
   - Input: Workflow definition
   - Expected: Tests run, coverage reported
   - Validation: Workflow completes with status

3. Block theme repo uses portable agent
   - Input: Block theme project
   - Expected: Jest/PHPUnit tests run
   - Validation: Coverage ≥ threshold

4. Block plugin repo uses portable agent
   - Input: Block plugin project
   - Expected: Jest/PHPUnit tests run
   - Validation: Coverage ≥ threshold
```

**Deliverables:**

- [ ] `.github/workflows/test-agent-coordination.yml` — Integration test workflow
- [ ] Mock test scenarios for block themes/plugins
- [ ] Validation checks for success criteria
- [ ] Documentation: "Integration Test Results"

**Success Criteria:**

- All scenarios tested
- Test results clear
- Failures identified and documented
- PR includes pass/fail status

**Estimated effort:** 4-6 hours

---

### Task 4.3: E2E Tests (Playwright)

**Objective:** Validate critical workflows with real GitHub environment.

**Workflows to test:**

```
1. Label sync workflow
   - Run workflow manually
   - Verify labels created/updated
   - Check PR comments for results

2. Release workflow
   - Run with test version number
   - Verify version detected
   - Check changelog updated
   - Verify tag created (in test branch)

3. Test execution in PR
   - Create PR with changes
   - Verify tests run automatically
   - Check coverage reported
   - Verify PR comment with results
```

**Deliverables:**

- [ ] Playwright specs for each workflow (3 specs)
- [ ] Staging environment setup
- [ ] Test data and fixtures
- [ ] Results documentation

**Success Criteria:**

- All workflows tested
- Tests run in staging (not main)
- Results documented
- No manual interventions needed

**Estimated effort:** 6-8 hours

---

### Task 4.4: Documentation & Knowledge Transfer

**Objective:** Create comprehensive documentation for org-wide adoption.

**Deliverables:**

- [ ] `docs/TESTING_STANDARDS.md` — Unified testing standards for all repos
- [ ] `docs/TESTING_ADOPTION_GUIDE.md` — How to adopt testing in your repo
- [ ] Framework quick-start guides (Jest, PHPUnit, pytest, Playwright)
- [ ] Troubleshooting guide
- [ ] FAQ document
- [ ] Video walkthrough (optional)

**Content:**

- Coverage thresholds by repo type
- Framework selection guidance
- Setup instructions for each framework
- Common pitfalls and solutions
- Links to skills and examples

**Success Criteria:**

- Documentation is comprehensive
- New repos can adopt without questions
- All frameworks are covered equally
- Examples are clear and actionable

**Estimated effort:** 4-6 hours

---

## Summary: Task Breakdown

| Phase | Task | Status | Effort | Dependencies |
|-------|------|--------|--------|---|
| 1 | Design & Review | ⏳ In Progress | 2-4h | None |
| 1 | Scope Clarification | ✅ Complete | - | None |
| 1 | Implementation Roadmap | ⏳ In Progress | 4-6h | Task 1.2 |
| 2.1 | Rename agent directory | ⏳ Pending | 1-2h | Task 1.3 |
| 2.2 | Update AGENT.md | ⏳ Pending | 1-2h | Task 2.1 |
| 2.3 | Enhance core prompt | ⏳ Pending | 3-4h | Task 2.2 |
| 2.4 | Create skills | ⏳ Pending | 6-8h | Task 2.3 |
| 2.5 | Create guides | ⏳ Pending | 8-10h | Task 2.3 |
| 2.6 | Update providers | ⏳ Pending | 2-3h | Task 2.5 |
| 2.7 | Update README | ⏳ Pending | 2-3h | Task 2.6 |
| 3.1 | Rewrite .github agent | ⏳ Pending | 3-4h | Phase 2 complete |
| 3.2 | Create workflow examples | ⏳ Pending | 2-3h | Task 3.1 |
| 4.1 | Unit tests | ⏳ Pending | 2-3h | Task 3.2 |
| 4.2 | Integration tests | ⏳ Pending | 4-6h | Task 4.1 |
| 4.3 | E2E tests | ⏳ Pending | 6-8h | Task 4.2 |
| 4.4 | Documentation | ⏳ Pending | 4-6h | All Phase 2-3 |

**Total estimated effort:**

- Phase 1: 6-14 hours (planning, mostly in progress)
- Phase 2: 27-35 hours (agent expansion)
- Phase 3: 5-7 hours (control-plane rewrite)
- Phase 4: 16-23 hours (testing & docs)
- **Grand Total: 54-79 hours** (~1.5-2 weeks for one person)

---

## Critical Path & Dependencies

```
Phase 1 (Planning) ← Must complete first
    ↓
Phase 2.1 (Rename)
    ↓
Phase 2.2-2.6 (Expand agent) ← Can work in parallel
    ↓
Phase 2.7 (Update README)
    ↓
Phase 3 (Rewrite .github agent) ← Depends on Phase 2 complete
    ↓
Phase 4 (Testing & Docs) ← Depends on all above
    ↓
Merge & Release
```

---

## Next Steps

1. **Confirm recommendations** in QUESTIONS_AND_ANSWERS.md
2. **Create GitHub issues** for each task
3. **Assign team members** and estimate timeline
4. **Start Phase 2.1** — Rename agent directory
5. **Track progress** in GitHub project board

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

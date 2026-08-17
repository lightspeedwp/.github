# PROMPT 1: Playwright Testing Agent Rewrite + Repository Standardization

**Use Case:** Initial pilot rewrite of ChatGPT agent export into multi-provider format  
**Scope:** Agent rewrite + repo audit + .schemas/hooks/instruction creation  
**Branch:** `feat/agent-standards-playwright-testing`  
**Target:** `develop`  

---

## COMPREHENSIVE ORCHESTRATION PROMPT

This prompt orchestrates a complete audit and implementation. Use it as a workflow brief or pass to an agent orchestration system.

---

### PHASE 1: REPOSITORY AUDIT & STANDARDIZATION FRAMEWORK

#### Task 1.1: Audit Instruction Files

**Objective:** Review all instruction files in `.github/instructions/` to identify conflicts with proposed standards.

**Sources to Review:**
- `agent-spec.instructions.md` — Agent specification standards
- `automation.instructions.md` — Agent automation patterns
- `copilot-operations.instructions.md` — GitHub Copilot rules
- `documentation-formats.instructions.md` — Markdown/frontmatter standards
- `plugin-structure.instructions.md` — Plugin structure (if exists)

**Deliverable:**
Create `.github/tmp/instruction-audit.md` documenting:
1. Existing standards that support multi-provider agents
2. Gaps where new instruction files are needed
3. Proposed modifications to existing files
4. No conflicts found, or recommended changes

**Success Criteria:**
- [ ] All instruction files reviewed
- [ ] Audit report completed
- [ ] Conflicts (if any) clearly identified with recommended fixes

---

#### Task 1.2: Audit Hooks & Security

**Objective:** Review existing hooks and propose new hooks for agent validation.

**Sources to Review:**
- `.github/hooks/secrets-scanner/` — Secret detection
- `.github/hooks/session-logger/` — Session tracking
- `.github/hooks/tool-guardian/` — Tool access controls
- `.github/hooks/hook-registry.json` — Hook registry

**Deliverable:**
Create `.github/tmp/hooks-audit.md` proposing:
1. New hook: `agent-spec-validator.js` — Validates agent YAML/frontmatter
2. New hook: `multi-provider-consistency-checker.js` — Detects provider divergences
3. New hook: `plugin-integrity-checker.js` — Validates plugin manifests
4. Hook registry updates

**Output Template:**
```markdown
## Proposed Hook: {hook-name}

**Purpose:** [description]

**Triggers:**
- Event: [git event]
- Files: [file patterns]

**Actions:**
- Validate [what]
- Check [what]
- Report [what]

**Code Outline:**
[Pseudocode or function signature]

**Integration Points:**
- Registry entry
- CI/CD workflow hook
- Pre-commit hook
```

**Success Criteria:**
- [ ] 4 hooks documented
- [ ] Each has clear triggers, actions, integration points
- [ ] Code outline provided
- [ ] Hook registry updates specified

---

#### Task 1.3: Audit Schemas & Create New Ones

**Objective:** Review existing schemas and create new schemas for multi-provider agents.

**Sources to Review:**
- `.github/.schemas/agent-config.schema.json`
- `.github/.schemas/plugin-manifest.schema.json`
- `.github/.schemas/skill-agent-config.schema.json`
- `.github/.schemas/frontmatter.schema.json`
- `.github/.schemas/schema-registry.json`

**Deliverable:**
Create `.github/tmp/schema-audit.md` documenting:
1. Existing schema coverage (good, gaps)
2. 4 new schemas to create:
   - `multi-provider-agent.schema.json` — Multi-provider agent validation
   - `agent-plugin-binding.schema.json` — Agent-plugin relationships
   - `provider-config.schema.json` — Per-provider configuration
   - `agent-capability-manifest.schema.json` — Agent capabilities

**For Each New Schema:**
- List JSON Schema properties
- Provide example valid JSON
- Document validation rules
- Specify required fields

**Success Criteria:**
- [ ] 4 new schemas defined
- [ ] Each has example valid JSON
- [ ] Registered in schema-registry.json

---

#### Task 1.4: Audit AI Config Folder

**Objective:** Review AI configurations and propose updates for multi-provider standardization.

**Sources to Review:**
- `.github/ai/Claude.md`
- `.github/ai/Gemini.md`
- `.github/ai/RUNNERS.md`
- `.github/ai/agents.md`
- `.github/ai/audit-planner-reviewer-agents.md`
- `.github/ai/improvement-plan-planner-reviewer.md`

**Deliverable:**
Create `.github/tmp/ai-config-audit.md` proposing:
1. Updates to Claude.md, Gemini.md, RUNNERS.md (if needed)
2. New file: `agents-unified.md` — Meta-config for all agents
3. New file: `multi-provider-mapping.md` — Tool mapping, capability parity
4. Agent provider support matrix (Claude, Copilot, OpenAI)

**Success Criteria:**
- [ ] All AI configs reviewed
- [ ] Provider support matrix created
- [ ] Migration tracking documented

---

#### Task 1.5: Review Memory Schema & Work-Focus Structure

**Objective:** Audit memory schema and work-focus folder to ensure agent memory persistence aligns with new standards.

**Sources:**
- `.github/.schemas/memory/` folder
- `.github/.remember/` folder (session memory)

**Deliverable:**
Create `.github/tmp/memory-audit.md` documenting:
1. Current memory schema
2. How agent state should persist (at agent level vs. plugin level)
3. Proposed updates to memory schema for agents
4. Work-focus folder recommendations (clarity on usage)

**Success Criteria:**
- [ ] Memory schema reviewed
- [ ] Agent memory persistence model proposed
- [ ] Work-focus structure clarified

---

### PHASE 2: CREATE STANDARDIZED FOLDER STRUCTURE & NAMING CONVENTIONS

#### Task 2.1: Define & Document Standards

**Objective:** Create authoritative naming and folder structure documentation.

**Deliverable:**
Create `.github/tmp/standardization-framework.md` (summary of audit findings + standards):

```markdown
# Agent & Plugin Standardization Framework

## Naming Conventions

### Agents
- Agent spec files: `{domain}-{focus}.agent.md` (e.g., `testing.agent.md`)
- Agent export folders: `{domain}-{function}-agent` (e.g., `playwright-testing-agent`)
- Agent inside plugin: `agents/{domain}-{focus}/` (e.g., `agents/playwright-testing/`)

### Plugins
- Plugin folders: `lightspeed-{domain}-{focus}` (e.g., `lightspeed-playwright-testing`)
- Plugin manifest: `{plugin-name}/copilot-plugin.json`
- Provider subdirs: `.{provider}-plugin/` (`.claude-plugin/`, `.codex-plugin/`, `.gemini-plugin/`)

## Folder Structure: Agent Export

[Include full tree from audit, showing claude/, copilot/, openai/, shared/ separation]

## Folder Structure: Plugin

[Include full tree from audit, showing multi-agent grouping]

## Validation Rules

[Automated checks, hooks, schema requirements]
```

**Success Criteria:**
- [ ] Naming conventions documented
- [ ] Folder structures defined
- [ ] Validation rules clear

---

### PHASE 3: REWRITE PLAYWRIGHT TESTING AGENT

#### Task 3.1: Analyze Current ChatGPT Export

**Objective:** Understand current playwright-testing-agent structure.

**Source:**
- `.github/agents/playwright-testing-agent/`

**Deliverable:**
Create `.github/tmp/playwright-export-analysis.md` documenting:
1. Current folder structure
2. Files in `agent/`, `skills/`, `manifests/`
3. Agent capabilities & tools
4. Skills inventory
5. How to map to multi-provider format

**Success Criteria:**
- [ ] Current structure fully understood
- [ ] Mapping plan created

---

#### Task 3.2: Create New Folder Structure

**Objective:** Restructure playwright-testing-agent with new standardized format.

**Operations:**
1. Move existing files to preserve data:
   ```bash
   # Keep existing as reference
   mv .github/agents/playwright-testing-agent .github/agents/playwright-testing-agent-chatgpt-backup
   mkdir -p .github/agents/playwright-testing-agent
   ```

2. Create new folder structure:
   ```
   .github/agents/playwright-testing-agent/
   ├── AGENT.md                    # Agent spec
   ├── README.md                   # Updated export summary
   ├── .github/
   │   ├── INSTALL.md
   │   ├── MANIFEST.json
   │   └── security-policy.md
   ├── claude/
   │   ├── agent.md
   │   └── tools.json
   ├── copilot/
   │   ├── agent.md
   │   ├── copilot-plugin.json
   │   └── skills.yaml
   ├── openai/
   │   ├── agent.md
   │   └── tools.json
   ├── shared/
   │   ├── core-prompt.md
   │   ├── tools/
   │   ├── memory/
   │   └── hooks/
   ├── skills/                    # From ChatGPT export
   ├── manifests/                 # From ChatGPT export
   └── checksums.sha256           # From ChatGPT export
   ```

**Deliverable:**
- New folder structure created and empty template files initialized

**Success Criteria:**
- [ ] Folder structure created
- [ ] Template files initialized
- [ ] Old backup preserved

---

#### Task 3.3: Create Agent Specification (AGENT.md)

**Objective:** Write agent spec that works for Claude, Copilot, and OpenAI.

**Deliverable:**
Create `.github/agents/playwright-testing-agent/AGENT.md`:

```yaml
---
name: playwright-testing
title: Playwright Testing Agent
description: >
  Cross-browser automation and end-to-end testing agent using Playwright.
  Supports UI interaction testing, visual regression detection, network
  monitoring, and comprehensive test reporting across Chromium, Firefox,
  and WebKit browsers.

version: '2.0.0'
status: active
category: testing
providers:
  - claude
  - copilot
  - openai

frontmatter:
  author: LightSpeed
  maintainer: Ash Shaw
  last_updated: '2026-07-22'
  file_type: agent
  visibility: public
  language: en
  tags: [playwright, testing, automation, e2e, cross-browser, ui-testing]
  owners:
    - lightspeedwp/maintainers

capabilities:
  - browser-automation
  - ui-interaction-testing
  - visual-regression-detection
  - network-monitoring
  - screenshot-capture
  - performance-metrics
  - accessibility-testing
  - cross-browser-testing

requirements:
  - Playwright library (latest)
  - Node.js 18+
  - Browser binaries (Chromium, Firefox, WebKit)

constraints:
  - No access to production databases
  - Limited network access (sandboxed)
  - Memory limits per test suite
  - Max test timeout: 5 minutes per test

tools:
  - browser_automation
  - network_monitoring
  - screenshot_capture
  - performance_analysis
  - accessibility_checker
  - error_reporting

memory:
  - Test results (per-run)
  - Flaky test tracking (7-day rolling)
  - Performance baselines (30-day)

security:
  rules:
    - No credentials in test files
    - No production data usage
    - Sandboxed browser environment
    - TLS verification required
  hooks:
    - secrets-scanner
    - security-auditor

hooks:
  - agent-spec-validator
  - multi-provider-consistency-checker
  - plugin-integrity-checker

---

# Playwright Testing Agent

## Overview

The Playwright Testing Agent automates end-to-end testing, cross-browser validation, and performance analysis for web applications. It handles complex user interactions, visual regression detection, and comprehensive reporting across multiple browsers.

## Core Responsibilities

1. **Test Execution** — Run Playwright test suites with detailed result reporting
2. **Cross-Browser Testing** — Validate behavior across Chromium, Firefox, WebKit
3. **Visual Regression** — Detect unintended UI changes via screenshot comparison
4. **Performance Metrics** — Capture and analyze performance data during test runs
5. **Accessibility Testing** — WCAG 2.2 AA compliance verification
6. **Network Monitoring** — Validate API interactions and network behavior
7. **Flaky Test Detection** — Identify and track intermittent test failures

## Capabilities & Limitations

### What It Can Do
- ✅ Automate UI interactions (click, type, submit, navigate)
- ✅ Validate visual appearance (screenshot comparison)
- ✅ Monitor network requests and responses
- ✅ Measure performance (LCP, FID, CLS, custom metrics)
- ✅ Test accessibility (WCAG compliance)
- ✅ Generate HTML/JSON test reports
- ✅ Handle async operations and timeouts gracefully
- ✅ Cross-browser validation (Chromium, Firefox, WebKit)

### What It Cannot Do
- ❌ Access production databases directly
- ❌ Test on physical devices (simulator/emulator mode)
- ❌ Modify application code during tests
- ❌ Handle biometric authentication (Face ID, fingerprint)
- ❌ Test audio/video content deeply
- ❌ Stress testing (load testing at scale)

## Usage Examples

### Example 1: E2E User Flow Testing

**Scenario:** Test complete user registration flow

**Agent Prompt:**
```
Test the user registration flow:
1. Navigate to /signup
2. Fill email, password, confirm password
3. Accept terms & conditions
4. Submit form
5. Verify success message
6. Validate new user email in database
```

**Expected Output:**
- Test passes/fails with reason
- Screenshots at each step
- Performance metrics (time-to-interactive)
- Any accessibility issues found

### Example 2: Visual Regression Detection

**Scenario:** Verify UI consistency after design update

**Agent Prompt:**
```
Compare home page appearance across browsers.
Take screenshots on:
- Chromium (desktop 1920x1080)
- Firefox (desktop 1920x1080)
- WebKit (mobile 375x812)

Compare against baseline and report visual differences.
```

**Expected Output:**
- Screenshot comparisons
- Pixel-level differences identified
- Cross-browser consistency report

## Configuration Per Provider

### Claude Configuration
[See `claude/agent.md`]

### GitHub Copilot Configuration
[See `copilot/agent.md`]

### OpenAI Configuration
[See `openai/agent.md`]

## Security Guardrails

1. **Secret Scanning** — No hardcoded credentials in test files
2. **Data Isolation** — No production data accessed during testing
3. **Environment Isolation** — Sandboxed browser environment
4. **Network Security** — TLS verification, no insecure connections

## Performance Targets

- Single test execution: <30 seconds
- Full test suite (100 tests): <10 minutes
- Visual comparison: <5 seconds per screenshot
- Memory usage per test: <500MB

## Testing Validation

[Link to test suite and CI/CD workflows]

## Related Documentation

- [Playwright Official Docs](https://playwright.dev)
- [Cross-Browser Testing Best Practices](./cross-browser-testing.md)
- [Visual Regression Testing Guide](./visual-testing.md)
- [Accessibility Testing Checklist](./a11y-testing.md)
```

**Success Criteria:**
- [ ] Agent spec follows template
- [ ] All capabilities documented
- [ ] Security rules clear
- [ ] Examples provided

---

#### Task 3.4: Create Provider-Specific Configurations

**Objective:** Write provider-specific agent instructions and tool definitions.

**Deliverables:**

##### A. Create `.github/agents/playwright-testing-agent/shared/core-prompt.md`

```markdown
# Playwright Testing Agent — Core Prompt

(Provider-agnostic core instructions. See provider-specific files for customizations.)

## System Instructions

You are a Playwright testing automation expert. Your role is to:

1. **Design & execute** browser automation tests using Playwright
2. **Detect & report** visual regressions across browsers
3. **Monitor performance** during test execution
4. **Generate clear reports** with actionable insights
5. **Debug failures** with detailed diagnostics

## Constraints

- Never access production databases or APIs unless explicitly sandboxed
- Never commit secrets or hardcoded credentials
- Always run tests in isolated environments
- Validate WCAG 2.2 AA compliance when testing UIs
- Limit test execution time (5 minutes max per test)

## Best Practices

1. Use page objects for maintainability
2. Implement proper waits (avoid hard delays)
3. Clean up resources (close pages/contexts)
4. Log test progress for debugging
5. Handle flaky tests with retries
6. Capture full context on failures
```

##### B. Create `.github/agents/playwright-testing-agent/claude/agent.md`

```markdown
# Playwright Testing Agent — Claude Configuration

## Claude-Specific Instructions

You are deployed as a Claude AI agent for Playwright testing automation in the LightSpeed ecosystem.

### Tools Available

**Browser Automation** (via Playwright SDK)
- `browser.launch()` — Start browser instance
- `page.goto(url)` — Navigate to URL
- `page.click(selector)` — Click element
- `page.fill(selector, text)` — Fill form field
- `page.screenshot()` — Capture screenshot
- `page.waitForNavigation()` — Wait for navigation

**Analysis Tools**
- `page.evaluate()` — Run JavaScript in browser context
- `page.getByRole()`, `getByLabel()`, `getByPlaceholder()` — Locators
- `expect()` — Assertions (Playwright test framework)

### Guardrails

1. **Never** commit test results directly to main branch
2. **Always** report test failures with:
   - Error message
   - Screenshot
   - Full stack trace
   - Affected browser(s)
3. **Validate** that all locators are resilient to UI changes

### Response Format

Always return:
```json
{
  "test_run_id": "unique-id",
  "status": "passed|failed|skipped",
  "duration_ms": 1234,
  "browsers_tested": ["chromium", "firefox", "webkit"],
  "failures": [
    {
      "test": "test-name",
      "error": "error message",
      "screenshot": "base64 or url",
      "suggestion": "how to fix"
    }
  ],
  "coverage_metrics": {
    "tests_run": 10,
    "tests_passed": 9,
    "tests_failed": 1,
    "tests_skipped": 0
  }
}
```

### Integration with Claude Code

When working in Claude Code:
1. Install dependencies: `npm install @playwright/test`
2. Create test file: `.test.ts` or `.test.js`
3. Run tests: `npm test` or `npx playwright test`
4. Analyze results: Parse JSON output
```

##### C. Create `.github/agents/playwright-testing-agent/copilot/agent.md`

```markdown
# Playwright Testing Agent — GitHub Copilot Configuration

## GitHub Copilot Instructions

You are a Copilot skill for Playwright testing within GitHub's ecosystem.

### Copilot-Specific Features

- **Code Completion** — Suggest Playwright test patterns
- **Chat Integration** — Answer Playwright questions in Copilot Chat
- **Code Review** — Suggest test improvements in PR context
- **Workflow Integration** — Recommend GitHub Actions for test automation

### Skills Provided

- `playwright-selectors` — Best practices for robust locators
- `browser-automation` — Playwright API patterns
- `test-reporting` — Report generation

### Response Format for Copilot Chat

```markdown
# Test Execution Summary

**Status:** ✅ Passed | ❌ Failed | ⏭️ Skipped

**Results:**
- Tests run: {n}
- Passed: {n} ✅
- Failed: {n} ❌
- Skipped: {n} ⏭️

**Details:**
[Specific test results and recommendations]
```

### GitHub Actions Integration

Copilot can suggest workflow steps:
```yaml
- name: Run Playwright Tests
  run: npx playwright test
```
```

##### D. Create `.github/agents/playwright-testing-agent/openai/agent.md`

```markdown
# Playwright Testing Agent — OpenAI Configuration

## OpenAI Codex Instructions

You are deployed via OpenAI APIs for Playwright testing integration.

### OpenAI-Specific Tools

**Function Definitions:**
- `run_playwright_test(test_file, browsers)` — Execute test
- `analyze_test_results(results_json)` — Parse results
- `generate_test_report(results, format)` — Create report

### API Integration

When called via OpenAI API:
1. Receive test specification as prompt
2. Generate Playwright code
3. Execute and capture results
4. Return structured JSON response

### Response Format

```json
{
  "model": "gpt-4",
  "test_specification": "user request",
  "playwright_code": "generated test code",
  "execution_result": {
    "status": "passed|failed",
    "duration_ms": 1234,
    "output": "test output",
    "error": "error if failed"
  }
}
```
```

**Success Criteria:**
- [ ] `core-prompt.md` created (provider-agnostic)
- [ ] `claude/agent.md` created with Claude-specific rules
- [ ] `copilot/agent.md` created with Copilot-specific rules
- [ ] `openai/agent.md` created with OpenAI-specific rules
- [ ] All files validated against schema

---

#### Task 3.5: Create Tool Definitions Per Provider

**Objective:** Define tools/functions that each provider can access.

**Deliverables:**

##### A. Create `.github/agents/playwright-testing-agent/claude/tools.json`

```json
{
  "provider": "claude",
  "tools": [
    {
      "name": "playwright_launch",
      "description": "Launch browser instance",
      "parameters": {
        "headless": {"type": "boolean"},
        "browsers": {"type": "array", "items": {"type": "string"}}
      }
    },
    {
      "name": "playwright_navigate",
      "description": "Navigate to URL",
      "parameters": {
        "url": {"type": "string"}
      }
    },
    {
      "name": "playwright_interact",
      "description": "Interact with page (click, type, select)",
      "parameters": {
        "action": {"type": "string", "enum": ["click", "type", "select"]},
        "selector": {"type": "string"}
      }
    },
    {
      "name": "playwright_screenshot",
      "description": "Capture screenshot",
      "parameters": {
        "fullPage": {"type": "boolean"},
        "path": {"type": "string", "description": "optional output path"}
      }
    },
    {
      "name": "playwright_evaluate",
      "description": "Execute JavaScript in browser",
      "parameters": {
        "code": {"type": "string"}
      }
    }
  ]
}
```

##### B. Create `.github/agents/playwright-testing-agent/copilot/skills.yaml`

```yaml
provider: copilot
skills:
  - name: playwright-selectors
    description: Best practices for robust locators
    reference: ../../skills/playwright-selectors/
  
  - name: browser-automation
    description: Playwright API patterns and examples
    reference: ../../skills/browser-automation/
  
  - name: test-reporting
    description: Generate and format test reports
    reference: ../../skills/test-reporting/
```

##### C. Create `.github/agents/playwright-testing-agent/openai/tools.json`

```json
{
  "provider": "openai",
  "type": "function",
  "functions": [
    {
      "name": "run_playwright_test",
      "description": "Run a Playwright test file",
      "parameters": {
        "type": "object",
        "properties": {
          "test_file": {"type": "string"},
          "browsers": {"type": "array", "items": {"type": "string"}}
        },
        "required": ["test_file"]
      }
    },
    {
      "name": "generate_test_report",
      "description": "Generate test report",
      "parameters": {
        "type": "object",
        "properties": {
          "results": {"type": "object"},
          "format": {"type": "string", "enum": ["html", "json", "markdown"]}
        },
        "required": ["results"]
      }
    }
  ]
}
```

**Success Criteria:**
- [ ] Claude tools.json created with 5+ tools
- [ ] Copilot skills.yaml references skill folders
- [ ] OpenAI functions.json follows OpenAI spec
- [ ] All tools validated

---

#### Task 3.6: Create Plugin Structure

**Objective:** Create `lightspeed-playwright-testing` plugin to host the agent.

**Operations:**

```bash
mkdir -p .github/plugins/lightspeed-playwright-testing/{agents,skills,hooks,.claude-plugin,.codex-plugin,.gemini-plugin}
```

**Deliverables:**

##### A. Create `.github/plugins/lightspeed-playwright-testing/plugin.json`

```json
{
  "name": "lightspeed-playwright-testing",
  "displayName": "LightSpeed Playwright Testing Suite",
  "version": "2.0.0",
  "description": "Cross-browser automated testing with Playwright, visual regression detection, and comprehensive reporting",
  "author": "LightSpeed",
  "license": "GPL-3.0",
  "homepage": "https://github.com/lightspeedwp/.github/plugins/lightspeed-playwright-testing",
  "repository": {
    "type": "git",
    "url": "https://github.com/lightspeedwp/.github"
  },
  "providers": {
    "claude": {
      "supported": true,
      "minVersion": "2024-01"
    },
    "copilot": {
      "supported": true,
      "minVersion": "1.0.0"
    },
    "openai": {
      "supported": true,
      "minVersion": "2024-01"
    }
  },
  "agents": [
    {
      "id": "playwright-e2e-testing",
      "name": "Playwright E2E Testing",
      "path": "agents/playwright-e2e-testing/"
    },
    {
      "id": "playwright-visual-regression",
      "name": "Playwright Visual Regression",
      "path": "agents/playwright-visual-regression/"
    }
  ],
  "skills": [
    "playwright-selectors",
    "browser-automation",
    "test-reporting",
    "performance-analysis"
  ],
  "hooks": [
    "agent-spec-validator",
    "multi-provider-consistency-checker"
  ],
  "keywords": [
    "playwright",
    "testing",
    "automation",
    "e2e",
    "cross-browser",
    "visual-regression"
  ]
}
```

##### B. Create `.github/plugins/lightspeed-playwright-testing/copilot-plugin.json`

```json
{
  "$schema": "https://raw.githubusercontent.com/github/copilot-docs/main/schemas/copilot-plugin.schema.json",
  "schemaVersion": "1.0",
  "name": "Playwright Testing",
  "description": "Automate end-to-end testing with Playwright across multiple browsers",
  "version": "2.0.0",
  "publisher": "LightSpeed",
  "agents": [
    {
      "id": "playwright-testing",
      "name": "Playwright Testing Agent",
      "instructions": "./agents/playwright-e2e-testing/agent.md",
      "capabilities": [
        "browser_automation",
        "visual_regression",
        "performance_testing"
      ]
    }
  ],
  "skills": [
    {
      "id": "playwright-selectors",
      "name": "Playwright Selectors",
      "instructions": "./skills/playwright-selectors.md"
    },
    {
      "id": "browser-automation",
      "name": "Browser Automation",
      "instructions": "./skills/browser-automation.md"
    }
  ],
  "config": {
    "allowlist": ["playwright", "testing", "automation"],
    "deny_patterns": ["password", "secret", "credential"]
  }
}
```

##### C. Create `.github/plugins/lightspeed-playwright-testing/README.md`

```markdown
# LightSpeed Playwright Testing Plugin

Comprehensive end-to-end testing automation with Playwright. Supports cross-browser validation, visual regression detection, performance metrics, and accessibility testing.

## Installation

### Claude
[See INSTALL.md#claude](./INSTALL.md#claude)

### GitHub Copilot
[See INSTALL.md#copilot](./INSTALL.md#copilot)

### OpenAI Codex
[See INSTALL.md#openai](./INSTALL.md#openai)

## Agents Included

### 1. Playwright E2E Testing
Automate end-to-end user flows, form submissions, navigation paths.

**Use Cases:**
- User registration flows
- Purchase workflows
- Complex multi-step interactions

**See:** [agents/playwright-e2e-testing/](./agents/playwright-e2e-testing/)

### 2. Playwright Visual Regression
Detect unintended visual changes via screenshot comparison.

**Use Cases:**
- Design system validation
- Cross-browser visual consistency
- Responsive design testing

**See:** [agents/playwright-visual-regression/](./agents/playwright-visual-regression/)

## Skills Included

- **playwright-selectors** — Robust locator strategies
- **browser-automation** — Playwright API patterns
- **test-reporting** — Report generation
- **performance-analysis** — Metrics collection

## Quick Start

```bash
# Install the plugin
npm install @lightspeedwp/plugin-playwright-testing

# Run a test
npx playwright test
```

## Configuration

See [agents/playwright-e2e-testing/config.md](./agents/playwright-e2e-testing/config.md)

## Documentation

- [Playwright Official Docs](https://playwright.dev)
- [Plugin Architecture](./docs/architecture.md)
- [Troubleshooting](./docs/troubleshooting.md)

## Support

[contact@lightspeedwp.agency](mailto:contact@lightspeedwp.agency)
```

##### D. Create `.github/plugins/lightspeed-playwright-testing/INSTALL.md`

```markdown
# Installation Guide

## Installation Instructions by Provider

### Claude

1. **Download the plugin:**
   ```bash
   git clone https://github.com/lightspeedwp/.github
   cd .github/plugins/lightspeed-playwright-testing
   ```

2. **Add to Claude Code:**
   - Place plugin folder in your Claude plugins directory
   - Or import via Claude Code settings

3. **Verify Installation:**
   ```bash
   npx playwright --version
   ```

### GitHub Copilot

1. **Enable in Copilot:**
   ```bash
   gh copilot plugin add lightspeedwp/lightspeed-playwright-testing
   ```

2. **Verify:**
   ```bash
   gh copilot plugin list
   ```

3. **Use in Copilot Chat:**
   ```
   @playwright test my login flow
   ```

### OpenAI Codex

1. **Register Function:**
   Add `copilot-plugin.json` to your OpenAI API config

2. **Call via API:**
   ```python
   import openai
   
   response = openai.ChatCompletion.create(
     model="gpt-4",
     messages=[{"role": "user", "content": "Run Playwright tests"}],
     functions=codex_plugin_functions
   )
   ```

## Troubleshooting

**Missing Playwright:**
```bash
npm install @playwright/test
npx playwright install
```

**Plugin Not Recognized:**
- Verify installation path
- Check plugin.json syntax
- Restart IDE/tool
```

**Success Criteria:**
- [ ] plugin.json created and valid
- [ ] copilot-plugin.json created
- [ ] README.md complete
- [ ] INSTALL.md complete

---

#### Task 3.7: Create Installation & Configuration Files

**Objective:** Complete `.github/` subfolder within agent.

**Deliverables:**

##### A. Create `.github/agents/playwright-testing-agent/.github/INSTALL.md`

(Link to plugin-level INSTALL.md with agent-specific setup)

##### B. Create `.github/agents/playwright-testing-agent/.github/MANIFEST.json`

```json
{
  "agent_id": "playwright-testing",
  "provider_versions": {
    "claude": "2024-01-01",
    "copilot": "1.0.0",
    "openai": "2024-01-01"
  },
  "tools": {
    "claude": ["playwright_launch", "playwright_navigate", "playwright_interact", "playwright_screenshot"],
    "copilot": ["playwright-selectors", "browser-automation"],
    "openai": ["run_playwright_test", "generate_test_report"]
  },
  "capabilities": [
    "browser-automation",
    "visual-regression",
    "cross-browser-testing",
    "performance-metrics",
    "accessibility-testing"
  ],
  "security_hooks": [
    "secrets-scanner",
    "agent-spec-validator",
    "multi-provider-consistency-checker"
  ]
}
```

##### C. Create `.github/agents/playwright-testing-agent/.github/security-policy.md`

```markdown
# Security Policy

## Data Handling

- **No production data** in test environments
- **No credentials** in test files or logs
- **TLS verification** required for all connections
- **Secrets scanning** on all commits

## Access Controls

- Read-only access to codebase
- Sandboxed browser environment
- Limited network access
- No direct database access

## Compliance

- GDPR compliant (no PII collection)
- WCAG 2.2 AA testing
- CWE/OWASP top 10 checked

## Incident Reporting

Report security issues to: [security@lightspeedwp.agency](mailto:security@lightspeedwp.agency)
```

**Success Criteria:**
- [ ] INSTALL.md created
- [ ] MANIFEST.json valid
- [ ] security-policy.md complete

---

#### Task 3.8: Create Supporting Documentation

**Objective:** Create instruction files and cookbook entries.

**Deliverables:**

##### A. Create `.github/instructions/agent-creation-workflow.instructions.md`

```markdown
---
title: Agent Creation Workflow
description: Step-by-step guide for converting ChatGPT agents to multi-provider format
category: automation
author: Claude Code
version: '1.0.0'
last_updated: '2026-07-22'
tags: [agents, multi-provider, claude, copilot, openai]
---

# Agent Creation Workflow

This guide walks through converting a ChatGPT agent export into a standardized multi-provider agent compatible with Claude, GitHub Copilot, and OpenAI Codex.

## Overview

**Workflow Phases:**
1. Audit ChatGPT export
2. Create standardized folder structure
3. Write core prompts (provider-agnostic)
4. Write provider-specific configs
5. Define tools/functions per provider
6. Create plugin wrapper
7. Validate & test
8. Document & deploy

## Phase 1: Audit ChatGPT Export

[Detailed steps from Task 3.1]

## Phase 2: Folder Restructuring

[Detailed steps from Task 3.2]

## Phase 3: Agent Specification

[Detailed steps from Task 3.3]

## Phase 4: Provider Configurations

[Detailed steps from Task 3.4]

## Phase 5: Tool Definitions

[Detailed steps from Task 3.5]

## Phase 6: Plugin Creation

[Detailed steps from Task 3.6]

## Phase 7: Validation & Testing

[Test procedures, success criteria]

## Phase 8: Documentation & Deployment

[Cookbook, INSTALL, README updates]

## Quick Checklist

- [ ] ChatGPT export analyzed
- [ ] Folder structure created
- [ ] AGENT.md written (with YAML frontmatter)
- [ ] Core prompt documented
- [ ] Provider-specific configs created (Claude, Copilot, OpenAI)
- [ ] Tool definitions specified per provider
- [ ] Plugin created/updated
- [ ] Hooks configured
- [ ] Tests passing
- [ ] Documentation complete
```

##### B. Create `.github/instructions/multi-provider-compatibility.instructions.md`

```markdown
---
title: Multi-Provider Agent Compatibility
description: How to write agent prompts and tools for Claude, GitHub Copilot, and OpenAI
category: automation
author: Claude Code
version: '1.0.0'
---

# Multi-Provider Compatibility Guide

## Overview

This guide explains how to write agents that work across Claude, GitHub Copilot, and OpenAI Codex without duplication.

## Core Principle: Separation of Concerns

**Shared (Provider-Agnostic):**
- Core instructions
- Base prompts
- Common logic
- Skill definitions

**Provider-Specific:**
- Tool definitions
- Function schemas
- Integration patterns
- Response formats

## Structure Pattern

```
agent-folder/
├── shared/
│   ├── core-prompt.md      # Used by all providers
│   └── tools/              # Shared tool logic
├── claude/
│   ├── agent.md            # Claude customizations
│   └── tools.json          # Claude-specific tools
├── copilot/
│   ├── agent.md            # Copilot customizations
│   └── skills.yaml         # Copilot-specific skills
└── openai/
    ├── agent.md            # OpenAI customizations
    └── tools.json          # OpenAI-specific functions
```

## Writing Core Prompts

**Do:**
- ✅ Write in generic language (not provider-specific)
- ✅ Focus on "what" the agent does, not "how"
- ✅ Use standard capabilities (not provider APIs)
- ✅ Document constraints clearly

**Don't:**
- ❌ Reference Claude-specific syntax
- ❌ Use Copilot-specific format tricks
- ❌ Include provider API calls
- ❌ Make assumptions about tool availability

## Provider-Specific Customization

### Claude
- Use Claude's system prompt format
- Leverage extended thinking (if available)
- Use Claude's native tools
- Return structured JSON when needed

### GitHub Copilot
- Follow Copilot chat format
- Use Copilot skills/slash commands
- Leverage code completion suggestions
- Return markdown-formatted responses

### OpenAI
- Use OpenAI function calling format
- Leverage GPT-4 capabilities
- Return JSON per OpenAI spec
- Use streaming where appropriate

## Tool Mapping Across Providers

[Detailed mapping table for common operations]

## Validation & Testing

- Test agent behavior on each provider
- Use multi-provider consistency hook
- Verify tool availability
- Check response formats
- Validate error handling

## Examples

[Sample core prompt + 3 provider customizations]
```

##### C. Create `.github/instructions/plugin-architecture.instructions.md`

```markdown
---
title: Plugin Architecture
description: Structure and organization of multi-agent plugins
category: automation
author: Claude Code
version: '1.0.0'
---

# Plugin Architecture Guide

## What Is a Plugin?

A plugin is a reusable package that contains:
- One or more agents
- Shared skills
- Shared hooks
- Documentation

## Naming Convention

- `lightspeed-{domain}-{focus}`
- Examples:
  - `lightspeed-playwright-testing`
  - `lightspeed-linear-advisor`
  - `lightspeed-wp-governance`

## Folder Structure

[Full tree from audit with explanations]

## Agent Grouping

Group agents by:
1. **Domain** (testing, content, infrastructure)
2. **Function** (creation, validation, analysis)
3. **Provider Requirements** (shared tools/skills)

**Example: Testing Plugin**
```
lightspeed-testing/
├── agents/
│   ├── playwright-e2e/
│   ├── jest-unit/
│   └── php-unit/
├── skills/
│   ├── test-reporting/
│   ├── coverage-analysis/
│   └── test-patterns/
└── hooks/
    ├── test-validation/
    └── flaky-test-detection/
```

## Hook Integration

Hooks are optional but recommended:
- `agent-spec-validator` — Validate agent YAML
- `multi-provider-consistency-checker` — Check provider parity
- `plugin-integrity-checker` — Validate plugin structure

## Skill Sharing

Skills are reusable components:
- Place in `skills/` folder
- Reference from multiple agents
- Version-control carefully
- Document dependencies

## Installation & Distribution

[Steps for packaging and distribution]

## Validation Checklist

- [ ] Plugin folder named correctly
- [ ] plugin.json valid
- [ ] Agents structured per standard
- [ ] Skills documented
- [ ] Hooks configured
- [ ] README complete
- [ ] INSTALL.md complete
- [ ] Tests passing
```

##### D. Create `.github/cookbook/playwright-agent-creation-guide.md`

```markdown
---
title: Playwright Agent Creation Guide
description: Step-by-step playbook for creating Playwright testing agents
category: testing
author: Claude Code
version: '1.0.0'
tags: [playwright, testing, automation, agents]
---

# Playwright Agent Creation Playbook

This cookbook entry walks through the creation of the Playwright Testing Agent as a reference implementation.

## Context

**Goal:** Convert ChatGPT Playwright agent export into multi-provider format

**Providers:** Claude, GitHub Copilot, OpenAI

**Scope:** E2E testing, visual regression, performance metrics, accessibility

## Phase 1: Planning & Analysis

### Step 1a: Analyze Current Export
- Examine folder structure
- Catalog skills & tools
- Document capabilities
- Identify gaps

**Output:** `playwright-export-analysis.md`

### Step 1b: Define Multi-Provider Requirements
- Which providers? (Claude, Copilot, OpenAI)
- Unique capabilities per provider?
- Shared logic?

**Output:** Requirements matrix

## Phase 2: Implementation

### Step 2a: Create Folder Structure
[Exact bash commands]

### Step 2b: Write Agent Spec
[Template + filled example]

### Step 2c: Write Core Prompt
[Provider-agnostic instructions]

### Step 2d: Create Provider Configs
[Claude, Copilot, OpenAI customizations]

### Step 2e: Define Tools/Functions
[Tools.json, skills.yaml, function schemas]

## Phase 3: Plugin Wrapper

### Step 3a: Create Plugin Structure
[Folder setup]

### Step 3b: Create Plugin Manifests
[plugin.json, copilot-plugin.json, .claude-plugin/, etc.]

### Step 3c: Wire Skills & Hooks
[Skill references, hook configuration]

## Phase 4: Testing & Validation

### Step 4a: Unit Test Agents
[Test each provider config]

### Step 4b: Integration Test Plugin
[Test plugin loading & agent availability]

### Step 4c: E2E Test Functionality
[Actual playwright test execution]

## Phase 5: Documentation

### Step 5a: Write README
[User-facing overview]

### Step 5b: Write INSTALL
[Installation per provider]

### Step 5c: Create Cookbook Entry
[This document!]

## Checklist

[Copy from agent-creation-workflow.instructions.md]

## Next Steps

- Review PR
- Get approval
- Merge to develop
- Begin next agent
```

**Success Criteria:**
- [ ] agent-creation-workflow.instructions.md created
- [ ] multi-provider-compatibility.instructions.md created
- [ ] plugin-architecture.instructions.md created
- [ ] playwright-agent-creation-guide.md created (cookbook)

---

### PHASE 4: SCHEMA & HOOKS IMPLEMENTATION

#### Task 4.1: Create New Schemas

**Objective:** Implement 4 new JSON schemas for validation.

**Deliverables:**

A. `.github/.schemas/multi-provider-agent.schema.json` — Validates multi-provider agent structure

B. `.github/.schemas/agent-plugin-binding.schema.json` — Validates agent-plugin relationships

C. `.github/.schemas/provider-config.schema.json` — Validates per-provider configs

D. `.github/.schemas/agent-capability-manifest.schema.json` — Validates agent capabilities

[Full JSON schema specifications for each]

**Success Criteria:**
- [ ] All 4 schemas created
- [ ] Validated against example JSONs
- [ ] Registered in schema-registry.json

---

#### Task 4.2: Create & Register Hooks

**Objective:** Implement 4 new hooks for agent validation & consistency.

**Deliverables:**

A. `.github/hooks/agent-spec-validator/` — Validates YAML frontmatter

B. `.github/hooks/multi-provider-consistency-checker/` — Detects provider divergences

C. `.github/hooks/plugin-integrity-checker/` — Validates plugin structure

D. Register all hooks in `.github/hooks/hook-registry.json`

[Full hook implementations with test cases]

**Success Criteria:**
- [ ] All 4 hooks implemented
- [ ] Registered in hook-registry.json
- [ ] Tests passing
- [ ] CI/CD integrated

---

### PHASE 5: VALIDATION & TESTING

#### Task 5.1: Unit Test Agent Specs

**Objective:** Create test suite for playwright-testing agent.

**Deliverables:**

Test file: `.github/agents/playwright-testing-agent/.github/tests/agent.test.js`

```javascript
describe('Playwright Testing Agent', () => {
  test('AGENT.md has valid YAML frontmatter', () => {
    // Load AGENT.md, parse YAML, validate against schema
  });
  
  test('Claude config is present and valid', () => {
    // Check claude/agent.md exists
    // Validate claude/tools.json
  });
  
  test('Copilot config is present and valid', () => {
    // Check copilot/agent.md exists
    // Validate copilot/skills.yaml
  });
  
  test('OpenAI config is present and valid', () => {
    // Check openai/agent.md exists
    // Validate openai/tools.json
  });
  
  test('Shared core prompt exists', () => {
    // Check shared/core-prompt.md exists
  });
  
  test('All schemas are valid JSON', () => {
    // Validate all .json files
  });
});
```

**Success Criteria:**
- [ ] Test file created
- [ ] All tests passing
- [ ] Test coverage >80%

---

#### Task 5.2: Integration Test Plugin

**Objective:** Test plugin loading & configuration.

**Deliverables:**

Test file: `.github/plugins/lightspeed-playwright-testing/tests/plugin.test.js`

```javascript
describe('LightSpeed Playwright Testing Plugin', () => {
  test('plugin.json is valid', () => {
    // Load plugin.json, validate schema
  });
  
  test('All agents referenced in plugin.json exist', () => {
    // Check each agent folder
  });
  
  test('All skills referenced in plugin.json exist', () => {
    // Check each skill folder
  });
  
  test('copilot-plugin.json is valid', () => {
    // Validate GitHub Copilot manifest
  });
  
  test('Claude plugin config exists', () => {
    // Check .claude-plugin/
  });
});
```

**Success Criteria:**
- [ ] Test file created
- [ ] All tests passing
- [ ] Manifest validation working

---

### PHASE 6: DOCUMENTATION & CLEANUP

#### Task 6.1: Generate Final Documentation

**Objective:** Create comprehensive README at repo level and agent level.

**Deliverables:**

A. Update `.github/agents/README.md` with section for standardized agents

B. Create `.github/plugins/lightspeed-playwright-testing/docs/architecture.md`

C. Update `.github/AGENTS.md` with new agent reference

**Success Criteria:**
- [ ] Documentation complete
- [ ] Links working
- [ ] Examples provided

---

#### Task 6.2: Cleanup & Finalization

**Objective:** Clean up temporary files and prepare for commit.

**Operations:**

```bash
# Remove backup if satisfied with rewrite
rm -rf .github/agents/playwright-testing-agent-chatgpt-backup

# Remove temporary audit files
rm -rf .github/tmp/

# Run final validation
npm run validate:schema
npm run validate:agents
```

**Success Criteria:**
- [ ] Temporary files removed
- [ ] Final validation passing
- [ ] Ready for PR

---

### PHASE 7: GIT WORKFLOW

#### Task 7.1: Create PR & Merge

**Branch:** `feat/agent-standards-playwright-testing`  
**Target:** `develop`

**PR Checklist:**
- [ ] Branch name follows convention: `feat/agent-standards-playwright-testing`
- [ ] All tests passing
- [ ] No conflicts with develop
- [ ] Documentation complete
- [ ] Changelog entry added (if applicable)

**Merge Strategy:**
- Use squash merge
- Delete branch after merge
- Update CHANGELOG.md

---

## SUMMARY

This prompt orchestrates the complete rewrite of the Playwright Testing Agent from ChatGPT format into a standardized, multi-provider agent compatible with Claude, GitHub Copilot, and OpenAI Codex.

### Key Deliverables

**Agent Rewrite:**
- Restructured folder with provider-specific configs
- AGENT.md spec with YAML frontmatter
- Core prompts (provider-agnostic)
- Provider-specific instructions (Claude, Copilot, OpenAI)
- Tool/function definitions per provider

**Plugin:**
- `lightspeed-playwright-testing` plugin wrapper
- plugin.json manifest
- copilot-plugin.json config
- Provider-specific plugin configs

**Repository Standardization:**
- 4 new JSON schemas
- 4 new hooks (validator, consistency-checker, integrity-checker, security-auditor)
- 4 new instruction files
- 1 new cookbook entry

**Documentation:**
- Installation guide
- Architecture documentation
- Cookbook entry
- Updated indexes

### Timeline

- **Phase 1 (Audit):** 2-3 hours
- **Phase 2 (Framework):** 1-2 hours
- **Phase 3 (Agent Rewrite):** 3-4 hours
- **Phase 4 (Schemas & Hooks):** 2-3 hours
- **Phase 5 (Testing):** 1-2 hours
- **Phase 6 (Documentation):** 1-2 hours
- **Phase 7 (Git/Deploy):** 0.5-1 hour

**Total: 12-18 hours** (can be done in 1-2 sessions)

---

## End of Prompt 1

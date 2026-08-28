# STANDALONE PROMPT: Phase 1 Complete Execution

## Playwright Testing Agent Rewrite + Repository Standardization

**Copy this entire prompt into a fresh Claude Code chat to execute Phase 1**

---

## CONTEXT & OVERVIEW

You are working on a comprehensive standardization initiative for the LightSpeedWP `.github` repository. The goal is to convert **ChatGPT agent exports** into **multi-provider agents** compatible with Claude, GitHub Copilot, and OpenAI Codex.

**This prompt orchestrates Phase 1:** Complete rewrite of the Playwright Testing Agent as a pilot, plus repository-wide standardization (schemas, hooks, instructions, audit).

**Total Effort:** 12-18 hours  
**Branch:** `feat/agent-standards-playwright-testing`  
**Target:** `develop`

---

## REFERENCE DOCUMENTS

Three detailed planning documents have been prepared for you. **Reference these as you work:**

1. **AGENT_STANDARDIZATION_AUDIT.md**
   - Current state analysis
   - Folder structure specifications
   - Naming conventions
   - Schema & hook details

2. **PROMPT_1_PLAYWRIGHT_AGENT_REWRITE.md**
   - Detailed 7-phase breakdown
   - Task-by-task instructions
   - Expected deliverables per task

3. **PROMPT_2_GENERIC_AGENT_REWRITE.md**
   - Reusable template for future agents
   - Reference for consistency

**All three documents are in the scratchpad. Reference them as needed during execution.**

---

## PHASE 1: COMPLETE EXECUTION BREAKDOWN

### PHASE 1A: REPOSITORY AUDIT (2-3 hours)

#### Task 1: Audit Instructions Folder

**Objective:** Review existing instruction files to identify conflicts with multi-provider agent standards.

**Action:**

```bash
cd /Users/ash/Studio/LightSpeedWP.Agency/.github
ls -la instructions/ | grep -E "agent|automation|copilot|plugin"
```

**Review These Files:**

- `instructions/agent-spec.instructions.md` — Agent specification standards
- `instructions/automation.instructions.md` — Agent automation patterns
- `instructions/copilot-operations.instructions.md` — GitHub Copilot rules
- `instructions/documentation-formats.instructions.md` — Markdown/frontmatter standards

**Deliverable:**
Create `.github/tmp/instruction-audit.md` documenting:

1. Which instruction files support multi-provider agents
2. Gaps where new files are needed
3. Any conflicts with proposed standards
4. Recommended modifications (if any)

**Success Criteria:**

- [ ] All instruction files reviewed
- [ ] Audit report created
- [ ] No conflicts blocking Phase 1 (or conflicts documented with workarounds)

---

#### Task 2: Audit Hooks Folder

**Objective:** Review existing hooks and propose new hooks for agent validation.

**Action:**

```bash
ls -la .github/hooks/
cat .github/hooks/hook-registry.json
```

**Current Hooks:** secrets-scanner, session-logger, tool-guardian

**Propose 4 New Hooks:**

1. `agent-spec-validator.js` — Validates agent YAML frontmatter
2. `multi-provider-consistency-checker.js` — Detects provider divergences
3. `plugin-integrity-checker.js` — Validates plugin manifests
4. `agent-security-auditor.js` — Scans for security violations

**Deliverable:**
Create `.github/tmp/hooks-audit.md` with structure for each hook:

```markdown
## Proposed Hook: {hook-name}

**Purpose:** [description]

**Triggers:** [git events/file patterns]

**Actions:** [what the hook validates/checks]

**Code Outline:** [pseudocode or function signature]

**Integration Points:** [registry, CI/CD, pre-commit, etc.]
```

**Success Criteria:**

- [ ] All 4 hooks documented with clear purpose, triggers, actions
- [ ] Integration points specified
- [ ] Code outlines provided

---

#### Task 3: Audit Schemas Folder

**Objective:** Review existing schemas and define new ones for multi-provider agents.

**Action:**

```bash
ls -la .github/.schemas/ | grep -E "agent|plugin|provider"
cat .github/.schemas/schema-registry.json
```

**Current Relevant Schemas:**

- `agent-config.schema.json`
- `plugin-manifest.schema.json`
- `skill-agent-config.schema.json`
- `frontmatter.schema.json`

**Define 4 New Schemas:**

1. **multi-provider-agent.schema.json** — Validates multi-provider agent structure
   - Properties: `providers` (array), `tools` (object), `capabilities` (array), `provider_overrides` (object)

2. **agent-plugin-binding.schema.json** — Validates agent-plugin relationships
   - Properties: `agent_id`, `plugin_id`, `required_skills`, `hooks`

3. **provider-config.schema.json** — Validates per-provider configuration
   - Properties: `provider`, `instructions`, `tools`, `memory_config`, `security_rules`

4. **agent-capability-manifest.schema.json** — Validates agent capabilities
   - Properties: `capabilities`, `requirements`, `constraints`, `performance_targets`

**Deliverable:**
Create `.github/tmp/schema-audit.md` documenting:

- Existing schema coverage (good, gaps)
- 4 new schemas with example valid JSON for each
- Validation rules per schema
- Registry updates needed

**Success Criteria:**

- [ ] All 4 new schemas defined
- [ ] Each has example valid JSON
- [ ] Validation rules documented
- [ ] Ready for registration in schema-registry.json

---

#### Task 4: Audit AI Config Folder

**Objective:** Review AI configurations and propose updates.

**Action:**

```bash
ls -la .github/ai/
cat .github/ai/Claude.md
cat .github/ai/Gemini.md
cat .github/ai/agents.md
```

**Propose These Updates:**

1. New file: `agents-unified.md` — Meta-config for all agents (provider support matrix)
2. New file: `multi-provider-mapping.md` — Tool mapping, capability parity matrix
3. Updates to Claude.md, Gemini.md if needed

**Deliverable:**
Create `.github/tmp/ai-config-audit.md` documenting:

- Current AI config state
- Provider support matrix (which agents work with which providers)
- Migration tracking (status of each agent)
- Proposed new files & updates

**Success Criteria:**

- [ ] AI configs reviewed
- [ ] Provider matrix created
- [ ] Proposed updates documented

---

#### Task 5: Review Memory & Schema Structure

**Objective:** Understand memory persistence and work-focus folder organization.

**Action:**

```bash
ls -la .github/.remember/
ls -la .github/.schemas/memory/
```

**Deliverable:**
Create `.github/tmp/memory-audit.md` documenting:

- Current memory schema
- How agent state should persist
- Proposed updates to memory schema for agents
- Work-focus folder structure recommendations

**Success Criteria:**

- [ ] Memory schema reviewed
- [ ] Agent memory persistence model proposed

---

### PHASE 1B: CREATE STANDARDIZATION FRAMEWORK (1-2 hours)

#### Task 6: Document Standards

**Objective:** Create authoritative standardization framework document.

**Deliverable:**
Create `.github/tmp/standardization-framework.md` containing:

```markdown
# Agent & Plugin Standardization Framework

## Naming Conventions

### Agents
- Agent spec files: `{domain}-{focus}.agent.md`
  Example: `testing.agent.md`, `playwright-testing.agent.md`

- Agent export folders: `{domain}-{function}-agent`
  Example: `playwright-testing-agent`

- Agent inside plugin: `agents/{domain}-{focus}/`
  Example: `agents/playwright-testing/`

### Plugins
- Plugin folders: `lightspeed-{domain}-{focus}`
  Example: `lightspeed-playwright-testing`

- Plugin manifest: `{plugin-name}/copilot-plugin.json`

- Provider subdirs: `.{provider}-plugin/`
  Examples: `.claude-plugin/`, `.codex-plugin/`, `.gemini-plugin/`

## Folder Structure: Agent Export

[Full tree showing claude/, copilot/, openai/, shared/ separation]

## Folder Structure: Plugin

[Full tree showing multi-agent grouping, skills, hooks]

## Validation Rules

- AGENT.md must have YAML frontmatter
- All provider configs must match core prompt
- Tools must be defined per provider
- Schema validation required before commit
- Hook validation required before merge
```

**Success Criteria:**

- [ ] Naming conventions documented
- [ ] Folder structures with examples
- [ ] Validation rules clear

---

### PHASE 1C: REWRITE PLAYWRIGHT TESTING AGENT (3-4 hours)

#### Task 7: Analyze Current Export

**Objective:** Understand current playwright-testing-agent structure.

**Action:**

```bash
ls -la .github/agents/playwright-testing-agent/
ls .github/agents/playwright-testing-agent/agent/
ls .github/agents/playwright-testing-agent/skills/
ls .github/agents/playwright-testing-agent/manifests/
```

**Deliverable:**
Create `.github/tmp/playwright-export-analysis.md` documenting:

- Current folder structure
- Files in each subfolder
- Agent capabilities & tools from manifests
- Skills inventory
- Mapping plan to new structure

**Success Criteria:**

- [ ] Current structure fully understood
- [ ] Mapping to new structure documented

---

#### Task 8: Create New Folder Structure

**Objective:** Restructure agent with standardized format.

**Actions:**

```bash
# Backup existing
mv .github/agents/playwright-testing-agent .github/agents/playwright-testing-agent-backup

# Create new structure
mkdir -p .github/agents/playwright-testing-agent/{claude,copilot,openai,shared,.github}
mkdir -p .github/agents/playwright-testing-agent/shared/{tools,memory,hooks}

# Copy existing skills & manifests
cp -r .github/agents/playwright-testing-agent-backup/skills \
      .github/agents/playwright-testing-agent/
cp -r .github/agents/playwright-testing-agent-backup/manifests \
      .github/agents/playwright-testing-agent/
cp .github/agents/playwright-testing-agent-backup/checksums.sha256 \
    .github/agents/playwright-testing-agent/ 2>/dev/null || true
```

**Deliverable:**
New folder structure with preserved data from ChatGPT export.

**Success Criteria:**

- [ ] New folder created
- [ ] Old backup preserved as reference
- [ ] Skills & manifests copied
- [ ] Structure ready for content

---

#### Task 9: Write AGENT.md Specification

**Objective:** Create agent specification with YAML frontmatter.

**Action:**
Create `.github/agents/playwright-testing-agent/AGENT.md` with:

```yaml
---
name: playwright-testing
title: Playwright Testing Agent
description: Cross-browser automation and end-to-end testing using Playwright.
version: '2.0.0'
status: active
category: testing
providers:
  - claude
  - copilot
  - openai

author: LightSpeed
maintainer: Ash Shaw
last_updated: '2026-07-22'
file_type: agent
visibility: public
language: en
tags: [playwright, testing, automation, e2e, cross-browser]
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

security:
  rules:
    - No credentials in test files
    - No production data usage
    - Sandboxed browser environment
  hooks:
    - secrets-scanner
    - agent-spec-validator

---

# Playwright Testing Agent

[Include: Overview, Core Responsibilities, Capabilities & Limitations, Usage Examples, Security Guardrails, Performance Targets, Related Documentation]
```

**Deliverable:**
Complete `.github/agents/playwright-testing-agent/AGENT.md` with all sections filled.

**Success Criteria:**

- [ ] YAML frontmatter valid
- [ ] All sections completed (Overview, Capabilities, Limitations, Examples, Security, Performance)
- [ ] Validates against `agent-config.schema.json`

---

#### Task 10: Create Shared Core Prompt

**Objective:** Write provider-agnostic core instructions.

**Action:**
Create `.github/agents/playwright-testing-agent/shared/core-prompt.md` with:

```markdown
# Playwright Testing Agent — Core Prompt

(Provider-agnostic instructions)

## System Instructions

You are a Playwright testing automation expert. Your role is to:

1. **Design & execute** browser automation tests
2. **Detect & report** visual regressions across browsers
3. **Monitor performance** during test execution
4. **Generate clear reports** with actionable insights
5. **Debug failures** with detailed diagnostics

## Constraints

- Never access production databases unless explicitly sandboxed
- Never commit secrets or hardcoded credentials
- Always run tests in isolated environments
- Validate WCAG 2.2 AA compliance
- Limit test execution time (5 minutes max per test)

## Best Practices

1. Use page objects for maintainability
2. Implement proper waits (avoid hard delays)
3. Clean up resources (close pages/contexts)
4. Log test progress for debugging
5. Handle flaky tests with retries
6. Capture full context on failures

## Inputs & Outputs

**Input:** Test specifications, URLs, user flows

**Output:** Test results JSON, screenshots, performance metrics, failure diagnostics
```

**Deliverable:**
Complete `.github/agents/playwright-testing-agent/shared/core-prompt.md` (500-1000 words).

**Success Criteria:**

- [ ] Core prompt written
- [ ] No provider-specific syntax
- [ ] Constraints clear
- [ ] Input/output examples provided

---

#### Task 11: Create Provider-Specific Configs

**Objective:** Write Claude, Copilot, and OpenAI specific instructions.

**Actions:**

**A. Create `.github/agents/playwright-testing-agent/claude/agent.md`**

```markdown
# Playwright Testing Agent — Claude Configuration

## Claude-Specific Instructions

You are deployed as a Claude AI agent for Playwright testing automation.

### Tools Available

**Browser Automation:**
- `browser.launch()` — Start browser instance
- `page.goto(url)` — Navigate to URL
- `page.click(selector)` — Click element
- `page.fill(selector, text)` — Fill form field
- `page.screenshot()` — Capture screenshot
- `page.evaluate()` — Run JavaScript

### Guardrails

1. Never commit test results directly to main
2. Always report test failures with error, screenshot, stack trace
3. Validate all locators are resilient to UI changes

### Response Format

Return JSON:
```json
{
  "status": "passed|failed|skipped",
  "duration_ms": 1234,
  "browsers": ["chromium", "firefox", "webkit"],
  "failures": [
    {
      "test": "test-name",
      "error": "error message",
      "screenshot": "base64-or-url",
      "suggestion": "how to fix"
    }
  ]
}
```

```

**B. Create `.github/agents/playwright-testing-agent/copilot/agent.md`**

```markdown
# Playwright Testing Agent — GitHub Copilot Configuration

## GitHub Copilot Instructions

You are a Copilot skill for Playwright testing within GitHub's ecosystem.

### Copilot-Specific Features

- **Code Completion** — Suggest Playwright test patterns
- **Chat Integration** — Answer Playwright questions
- **Code Review** — Suggest test improvements in PR context
- **Workflow Integration** — Recommend GitHub Actions for testing

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

**Recommendations:** [specific suggestions]
```

```

**C. Create `.github/agents/playwright-testing-agent/openai/agent.md`**

```markdown
# Playwright Testing Agent — OpenAI Configuration

## OpenAI Codex Instructions

You are deployed via OpenAI APIs for Playwright testing integration.

### OpenAI-Specific Tools

**Functions:**
- `run_playwright_test(test_file, browsers)` — Execute test
- `analyze_results(results_json)` — Parse results
- `generate_report(results, format)` — Create report

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
  "playwright_code": "generated code",
  "execution_result": {
    "status": "passed|failed",
    "duration_ms": 1234,
    "output": "output",
    "error": "error if failed"
  }
}
```

```

**Deliverable:**
All three provider config files (claude/agent.md, copilot/agent.md, openai/agent.md).

**Success Criteria:**
- [ ] Claude config includes tools & guardrails
- [ ] Copilot config includes features & skills
- [ ] OpenAI config includes functions & API integration
- [ ] All response formats specified

---

#### Task 12: Create Tool Definitions Per Provider

**Objective:** Define tools/functions available to each provider.

**Actions:**

**A. Create `.github/agents/playwright-testing-agent/claude/tools.json`**

```json
{
  "provider": "claude",
  "tools": [
    {
      "name": "playwright_launch",
      "description": "Launch browser instance",
      "parameters": {
        "type": "object",
        "properties": {
          "headless": {"type": "boolean"},
          "browsers": {"type": "array", "items": {"type": "string"}}
        }
      }
    },
    {
      "name": "playwright_navigate",
      "description": "Navigate to URL",
      "parameters": {
        "type": "object",
        "properties": {
          "url": {"type": "string"}
        }
      }
    },
    {
      "name": "playwright_interact",
      "description": "Interact with page (click, type, select)",
      "parameters": {
        "type": "object",
        "properties": {
          "action": {"type": "string", "enum": ["click", "type", "select"]},
          "selector": {"type": "string"}
        }
      }
    },
    {
      "name": "playwright_screenshot",
      "description": "Capture screenshot",
      "parameters": {
        "type": "object",
        "properties": {
          "fullPage": {"type": "boolean"},
          "path": {"type": "string"}
        }
      }
    },
    {
      "name": "playwright_evaluate",
      "description": "Execute JavaScript in browser",
      "parameters": {
        "type": "object",
        "properties": {
          "code": {"type": "string"}
        }
      }
    }
  ]
}
```

**B. Create `.github/agents/playwright-testing-agent/copilot/skills.yaml`**

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

**C. Create `.github/agents/playwright-testing-agent/openai/tools.json`**

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
      "description": "Generate test report in HTML, JSON, or markdown",
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

**Deliverable:**
All three tool definition files (claude/tools.json, copilot/skills.yaml, openai/tools.json).

**Success Criteria:**

- [ ] Claude tools.json with 5+ tools
- [ ] Copilot skills.yaml with skill references
- [ ] OpenAI tools.json following OpenAI spec

---

### PHASE 1D: CREATE PLUGIN (2-3 hours)

#### Task 13: Create Plugin Folder Structure

**Objective:** Create `lightspeed-playwright-testing` plugin.

**Action:**

```bash
mkdir -p .github/plugins/lightspeed-playwright-testing/{agents,skills,hooks,.claude-plugin,.codex-plugin,.gemini-plugin}
```

**Deliverable:**
Plugin folder structure created and ready for content.

**Success Criteria:**

- [ ] Folder structure created
- [ ] Subdirectories in place

---

#### Task 14: Create Plugin Manifests

**Objective:** Create plugin.json and provider-specific manifests.

**Actions:**

**A. Create `.github/plugins/lightspeed-playwright-testing/plugin.json`**

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
  "agents": [
    {
      "id": "playwright-testing",
      "name": "Playwright Testing Agent",
      "path": "agents/playwright-testing/"
    }
  ],
  "skills": ["playwright-selectors", "browser-automation", "test-reporting"],
  "hooks": ["agent-spec-validator", "multi-provider-consistency-checker"],
  "providers": {
    "claude": {"supported": true, "minVersion": "2024-01"},
    "copilot": {"supported": true, "minVersion": "1.0.0"},
    "openai": {"supported": true, "minVersion": "2024-01"}
  },
  "keywords": ["playwright", "testing", "automation", "e2e", "cross-browser", "visual-regression"]
}
```

**B. Create `.github/plugins/lightspeed-playwright-testing/copilot-plugin.json`**

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
      "instructions": "./agents/playwright-testing/agent.md",
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

**Deliverable:**
Both manifest files created and validated.

**Success Criteria:**

- [ ] plugin.json valid and complete
- [ ] copilot-plugin.json valid and complete
- [ ] All agent/skill references valid

---

#### Task 15: Create Plugin Documentation

**Objective:** Create README.md and INSTALL.md for plugin.

**Actions:**

**A. Create `.github/plugins/lightspeed-playwright-testing/README.md`**

```markdown
# LightSpeed Playwright Testing Plugin

Comprehensive end-to-end testing automation with Playwright. Supports cross-browser validation, visual regression detection, performance metrics, and accessibility testing.

## Installation

### Claude
[See INSTALL.md#claude]

### GitHub Copilot
[See INSTALL.md#copilot]

### OpenAI Codex
[See INSTALL.md#openai]

## Agents Included

### Playwright Testing Agent
Automate end-to-end user flows, form submissions, navigation paths.

**Use Cases:**
- User registration flows
- Purchase workflows
- Complex multi-step interactions

**See:** `agents/playwright-testing/`

## Skills Included

- **playwright-selectors** — Robust locator strategies
- **browser-automation** — Playwright API patterns
- **test-reporting** — Report generation

## Quick Start

```bash
npm install @playwright/test
npx playwright test
```

## Support

<contact@lightspeedwp.agency>

```

**B. Create `.github/plugins/lightspeed-playwright-testing/INSTALL.md`**

```markdown
# Installation Guide

## Claude

1. Download the plugin:
   ```bash
   git clone https://github.com/lightspeedwp/.github
   cd .github/plugins/lightspeed-playwright-testing
   ```

1. Add to Claude Code settings

2. Verify: `npx playwright --version`

## GitHub Copilot

1. Enable in Copilot:

   ```bash
   gh copilot plugin add lightspeedwp/lightspeed-playwright-testing
   ```

2. Verify: `gh copilot plugin list`

3. Use in Copilot Chat: `@playwright test my login flow`

## OpenAI Codex

1. Register function in OpenAI API config

2. Call via API with playwright functions

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

**Deliverable:**
Both README.md and INSTALL.md completed.

**Success Criteria:**
- [ ] README with installation links
- [ ] INSTALL.md with 3 provider methods
- [ ] Troubleshooting section included

---

### PHASE 1E: CREATE AGENT-LEVEL CONFIGS (1-2 hours)

#### Task 16: Create Agent `.github` Subfolder

**Objective:** Create installation and configuration files at agent level.

**Actions:**

**A. Create `.github/agents/playwright-testing-agent/.github/INSTALL.md`** (links to plugin INSTALL)

**B. Create `.github/agents/playwright-testing-agent/.github/MANIFEST.json`**

```json
{
  "agent_id": "playwright-testing",
  "version": "2.0.0",
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

**C. Create `.github/agents/playwright-testing-agent/.github/security-policy.md`**

```markdown
# Security Policy

## Data Handling
- No production data in test environments
- No credentials in test files
- TLS verification required
- Secrets scanning on all commits

## Access Controls
- Read-only access to codebase
- Sandboxed browser environment
- Limited network access
- No direct database access

## Compliance
- GDPR compliant
- WCAG 2.2 AA testing
- CWE/OWASP top 10 checked

## Incident Reporting
Report to: security@lightspeedwp.agency
```

**Deliverable:**
All three agent-level config files.

**Success Criteria:**

- [ ] INSTALL.md created
- [ ] MANIFEST.json valid JSON
- [ ] security-policy.md complete

---

### PHASE 1F: CREATE SCHEMAS & HOOKS (2-3 hours)

#### Task 17: Create 4 New Schemas

**Objective:** Implement JSON schemas for multi-provider agent validation.

**Actions:**

**A. Create `.github/.schemas/multi-provider-agent.schema.json`**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Multi-Provider Agent Schema",
  "description": "Validates agent structure across Claude, Copilot, and OpenAI",
  "type": "object",
  "required": ["name", "providers", "capabilities"],
  "properties": {
    "name": {"type": "string", "pattern": "^[a-z0-9-]+$"},
    "title": {"type": "string"},
    "description": {"type": "string"},
    "version": {"type": "string", "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+$"},
    "providers": {
      "type": "array",
      "items": {"type": "string", "enum": ["claude", "copilot", "openai"]},
      "minItems": 1
    },
    "capabilities": {
      "type": "array",
      "items": {"type": "string"},
      "minItems": 1
    },
    "tools": {"type": "object"},
    "provider_overrides": {
      "type": "object",
      "properties": {
        "claude": {"type": "object"},
        "copilot": {"type": "object"},
        "openai": {"type": "object"}
      }
    }
  }
}
```

**B. Create `.github/.schemas/agent-plugin-binding.schema.json`**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Agent-Plugin Binding Schema",
  "description": "Validates agent-plugin relationships",
  "type": "object",
  "required": ["agent_id", "plugin_id"],
  "properties": {
    "agent_id": {"type": "string"},
    "plugin_id": {"type": "string"},
    "required_skills": {
      "type": "array",
      "items": {"type": "string"}
    },
    "hooks": {
      "type": "array",
      "items": {"type": "string"}
    },
    "provider_support": {
      "type": "object",
      "properties": {
        "claude": {"type": "boolean"},
        "copilot": {"type": "boolean"},
        "openai": {"type": "boolean"}
      }
    }
  }
}
```

**C. Create `.github/.schemas/provider-config.schema.json`**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Provider-Specific Configuration",
  "description": "Validates per-provider agent configuration",
  "type": "object",
  "required": ["provider"],
  "properties": {
    "provider": {"type": "string", "enum": ["claude", "copilot", "openai"]},
    "instructions": {"type": "string"},
    "tools": {
      "type": "array",
      "items": {"type": "string"}
    },
    "memory_config": {"type": "object"},
    "security_rules": {
      "type": "array",
      "items": {"type": "string"}
    },
    "response_format": {"type": "object"}
  }
}
```

**D. Create `.github/.schemas/agent-capability-manifest.schema.json`**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Agent Capability Manifest",
  "description": "Validates agent capabilities and prerequisites",
  "type": "object",
  "required": ["capabilities"],
  "properties": {
    "capabilities": {
      "type": "array",
      "items": {"type": "string"},
      "minItems": 1
    },
    "requirements": {
      "type": "array",
      "items": {"type": "string"}
    },
    "constraints": {
      "type": "array",
      "items": {"type": "string"}
    },
    "performance_targets": {"type": "object"},
    "security_rules": {
      "type": "array",
      "items": {"type": "string"}
    }
  }
}
```

**Deliverable:**
All 4 schema files created.

**Success Criteria:**

- [ ] All 4 schemas valid JSON Schema
- [ ] Each validated against example JSONs
- [ ] Example valid JSONs provided for each

---

#### Task 18: Register Schemas

**Objective:** Update schema registry with new schemas.

**Action:**
Update `.github/.schemas/schema-registry.json` to include:

```json
{
  "schemas": [
    {
      "name": "multi-provider-agent",
      "file": "multi-provider-agent.schema.json",
      "description": "Validates multi-provider agent configuration"
    },
    {
      "name": "agent-plugin-binding",
      "file": "agent-plugin-binding.schema.json",
      "description": "Validates agent-plugin relationships"
    },
    {
      "name": "provider-config",
      "file": "provider-config.schema.json",
      "description": "Validates per-provider agent configuration"
    },
    {
      "name": "agent-capability-manifest",
      "file": "agent-capability-manifest.schema.json",
      "description": "Validates agent capabilities and prerequisites"
    }
  ]
}
```

**Success Criteria:**

- [ ] Registry updated
- [ ] All 4 schemas registered

---

#### Task 19: Create 4 New Hooks

**Objective:** Implement hooks for agent validation and consistency.

**Actions:**

**A. Create `.github/hooks/agent-spec-validator/`**

Create `.github/hooks/agent-spec-validator/validator.js`:

```javascript
/**
 * Agent Spec Validator Hook
 * Validates AGENT.md frontmatter against schema
 */

const fs = require('fs');
const yaml = require('yaml');
const path = require('path');

module.exports = {
  name: 'agent-spec-validator',
  description: 'Validates agent YAML frontmatter',
  
  async validate(agentPath) {
    const agentMdPath = path.join(agentPath, 'AGENT.md');
    
    if (!fs.existsSync(agentMdPath)) {
      return { valid: false, errors: ['AGENT.md not found'] };
    }
    
    const content = fs.readFileSync(agentMdPath, 'utf-8');
    const match = content.match(/^---\n([\s\S]+?)\n---/);
    
    if (!match) {
      return { valid: false, errors: ['No YAML frontmatter found'] };
    }
    
    try {
      const frontmatter = yaml.parse(match[1]);
      
      // Validate required fields
      const required = ['name', 'title', 'providers', 'capabilities'];
      const errors = required.filter(field => !frontmatter[field])
        .map(field => `Missing required field: ${field}`);
      
      // Validate providers
      const validProviders = ['claude', 'copilot', 'openai'];
      if (frontmatter.providers) {
        const invalidProviders = frontmatter.providers.filter(p => !validProviders.includes(p));
        if (invalidProviders.length > 0) {
          errors.push(`Invalid providers: ${invalidProviders.join(', ')}`);
        }
      }
      
      return {
        valid: errors.length === 0,
        errors
      };
    } catch (error) {
      return { valid: false, errors: [`YAML parsing error: ${error.message}`] };
    }
  }
};
```

**B. Create `.github/hooks/multi-provider-consistency-checker/`**

Create `.github/hooks/multi-provider-consistency-checker/checker.js`:

```javascript
/**
 * Multi-Provider Consistency Checker
 * Detects divergences across Claude, Copilot, OpenAI configs
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'multi-provider-consistency-checker',
  description: 'Detects provider divergences',
  
  async validate(agentPath) {
    const providers = ['claude', 'copilot', 'openai'];
    const errors = [];
    
    // Check that all providers have config files
    for (const provider of providers) {
      const providerPath = path.join(agentPath, provider);
      const agentMdPath = path.join(providerPath, 'agent.md');
      
      if (!fs.existsSync(agentMdPath)) {
        errors.push(`Missing ${provider}/agent.md`);
      }
    }
    
    // Check that core prompt exists
    const corePromptPath = path.join(agentPath, 'shared', 'core-prompt.md');
    if (!fs.existsSync(corePromptPath)) {
      errors.push('Missing shared/core-prompt.md');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
};
```

**C. Create `.github/hooks/plugin-integrity-checker/`**

Create `.github/hooks/plugin-integrity-checker/checker.js`:

```javascript
/**
 * Plugin Integrity Checker
 * Validates plugin manifest and structure
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'plugin-integrity-checker',
  description: 'Validates plugin integrity',
  
  async validate(pluginPath) {
    const errors = [];
    
    // Check plugin.json exists and is valid JSON
    const pluginJsonPath = path.join(pluginPath, 'plugin.json');
    if (!fs.existsSync(pluginJsonPath)) {
      errors.push('Missing plugin.json');
    } else {
      try {
        JSON.parse(fs.readFileSync(pluginJsonPath, 'utf-8'));
      } catch (error) {
        errors.push(`Invalid plugin.json: ${error.message}`);
      }
    }
    
    // Check copilot-plugin.json exists
    const copilotJsonPath = path.join(pluginPath, 'copilot-plugin.json');
    if (!fs.existsSync(copilotJsonPath)) {
      errors.push('Missing copilot-plugin.json');
    }
    
    // Check required directories
    const requiredDirs = ['agents', 'skills', '.claude-plugin', '.codex-plugin', '.gemini-plugin'];
    for (const dir of requiredDirs) {
      if (!fs.existsSync(path.join(pluginPath, dir))) {
        errors.push(`Missing directory: ${dir}`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
};
```

**D. Create `.github/hooks/agent-security-auditor/`**

Create `.github/hooks/agent-security-auditor/auditor.js`:

```javascript
/**
 * Agent Security Auditor
 * Scans agents for security violations
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'agent-security-auditor',
  description: 'Scans for security violations',
  
  async validate(agentPath) {
    const errors = [];
    const warnings = [];
    
    // Scan for hardcoded secrets
    const securityPatterns = [
      /password\s*[:=]/gi,
      /api[_-]?key\s*[:=]/gi,
      /secret\s*[:=]/gi,
      /token\s*[:=]/gi
    ];
    
    // Check agent files
    const files = this.getAllFiles(agentPath);
    for (const file of files) {
      if (file.endsWith('.json') || file.endsWith('.md') || file.endsWith('.js')) {
        const content = fs.readFileSync(file, 'utf-8');
        
        for (const pattern of securityPatterns) {
          if (pattern.test(content)) {
            warnings.push(`Potential secret in ${path.relative(agentPath, file)}`);
          }
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  },
  
  getAllFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        files.push(...this.getAllFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }
};
```

**Deliverable:**
All 4 hooks with implementations.

**Success Criteria:**

- [ ] All 4 hooks implemented
- [ ] Each has clear validation logic
- [ ] Code is testable

---

#### Task 20: Register Hooks

**Objective:** Update hook registry with new hooks.

**Action:**
Update `.github/hooks/hook-registry.json`:

```json
{
  "hooks": [
    {
      "id": "agent-spec-validator",
      "name": "Agent Spec Validator",
      "path": "agent-spec-validator/",
      "description": "Validates agent YAML frontmatter",
      "triggers": ["pre-commit", "pre-push"]
    },
    {
      "id": "multi-provider-consistency-checker",
      "name": "Multi-Provider Consistency Checker",
      "path": "multi-provider-consistency-checker/",
      "description": "Detects provider divergences",
      "triggers": ["pre-commit"]
    },
    {
      "id": "plugin-integrity-checker",
      "name": "Plugin Integrity Checker",
      "path": "plugin-integrity-checker/",
      "description": "Validates plugin integrity",
      "triggers": ["pre-commit"]
    },
    {
      "id": "agent-security-auditor",
      "name": "Agent Security Auditor",
      "path": "agent-security-auditor/",
      "description": "Scans for security violations",
      "triggers": ["pre-push"]
    }
  ]
}
```

**Success Criteria:**

- [ ] Registry updated
- [ ] All 4 hooks registered

---

### PHASE 1G: CREATE INSTRUCTION FILES (1-2 hours)

#### Task 21: Create 4 Instruction Files

**Objective:** Create comprehensive instruction files for agent standardization.

**Actions:**

**A. Create `.github/instructions/agent-creation-workflow.instructions.md`**

```markdown
---
title: Agent Creation Workflow
description: Step-by-step guide for converting agents to multi-provider format
category: automation
author: Claude Code
version: '1.0.0'
last_updated: '2026-07-22'
tags: [agents, multi-provider, workflow]
---

# Agent Creation Workflow

## Overview

This guide walks through converting a ChatGPT agent export into a standardized multi-provider agent compatible with Claude, GitHub Copilot, and OpenAI Codex.

## Phases

### Phase 1: Audit
- Analyze existing ChatGPT export
- Document capabilities & tools
- Identify dependencies

### Phase 2: Structure
- Create new folder structure
- Move existing skills & manifests
- Initialize template files

### Phase 3: Specifications
- Write AGENT.md with YAML frontmatter
- Create core prompt (provider-agnostic)
- Create provider-specific configs

### Phase 4: Tools
- Define Claude tools
- Define Copilot skills
- Define OpenAI functions

### Phase 5: Plugin
- Create plugin folder
- Create plugin manifests
- Wire agents & skills

### Phase 6: Validation
- Run schema validation
- Run hook validation
- Test provider configs

### Phase 7: Merge
- Create feature branch
- Commit changes
- Create PR & merge

## Quick Checklist

- [ ] ChatGPT export analyzed
- [ ] New folder structure created
- [ ] AGENT.md written & validated
- [ ] Core prompt created
- [ ] Provider configs created
- [ ] Tool definitions specified
- [ ] Plugin created/updated
- [ ] Hooks configured
- [ ] Tests passing
- [ ] Documentation complete
```

**B. Create `.github/instructions/multi-provider-compatibility.instructions.md`**

```markdown
---
title: Multi-Provider Agent Compatibility
description: How to write agents for Claude, Copilot, and OpenAI
category: automation
author: Claude Code
version: '1.0.0'
tags: [agents, multi-provider, compatibility]
---

# Multi-Provider Compatibility Guide

## Core Principle: Separation of Concerns

### Shared (Provider-Agnostic)
- Core instructions (shared/core-prompt.md)
- Agent specifications (AGENT.md)
- Common tools & skills

### Provider-Specific
- Agent instructions (claude/agent.md, copilot/agent.md, openai/agent.md)
- Tool definitions (tools.json, skills.yaml)
- Response formats

## Folder Structure

```

agent-folder/
├── shared/core-prompt.md      # Used by all providers
├── claude/agent.md            # Claude customizations
├── copilot/agent.md           # Copilot customizations
├── openai/agent.md            # OpenAI customizations

```

## Writing Core Prompts

**Do:**
- Write in generic language
- Focus on "what" not "how"
- Document constraints clearly
- Use standard capabilities

**Don't:**
- Reference provider-specific syntax
- Include provider API calls
- Make provider assumptions

## Provider-Specific Customization

### Claude
- Use Claude's system prompt format
- Leverage extended thinking
- Return structured JSON

### GitHub Copilot
- Follow Copilot chat format
- Use Copilot skills/slash commands
- Return markdown-formatted responses

### OpenAI
- Use function calling format
- Leverage GPT-4 capabilities
- Return JSON per OpenAI spec
```

**C. Create `.github/instructions/plugin-architecture.instructions.md`**

```markdown
---
title: Plugin Architecture
description: Structure and organization of multi-agent plugins
category: automation
author: Claude Code
version: '1.0.0'
tags: [plugins, agents, architecture]
---

# Plugin Architecture Guide

## What Is a Plugin?

A plugin is a reusable package containing:
- One or more agents
- Shared skills
- Shared hooks
- Documentation

## Naming Convention

`lightspeed-{domain}-{focus}`

Examples:
- `lightspeed-playwright-testing`
- `lightspeed-project-management-linear`
- `lightspeed-support-zendesk`

## Folder Structure

```

lightspeed-{domain}-{focus}/
├── plugin.json                # Master manifest
├── README.md
├── INSTALL.md
├── .claude-plugin/            # Claude config
├── .codex-plugin/             # Copilot config
├── .gemini-plugin/            # Gemini config
├── agents/                    # Multiple agents
│   ├── agent-1/
│   └── agent-2/
├── skills/                    # Shared skills
├── hooks/                     # Shared hooks
└── .schemas/                    # Plugin-specific schema

```

## Agent Grouping

Group agents by:
1. **Domain** (testing, content, infrastructure)
2. **Function** (creation, validation, analysis)
3. **Provider Requirements** (shared tools)

## Validation Checklist

- [ ] Plugin folder named correctly
- [ ] plugin.json valid
- [ ] All agents structured per standard
- [ ] Skills documented
- [ ] Hooks configured
- [ ] README complete
- [ ] INSTALL.md complete
- [ ] Tests passing
```

**Deliverable:**
All 4 instruction files created and formatted.

**Success Criteria:**

- [ ] All files use correct YAML frontmatter
- [ ] All sections filled with relevant content
- [ ] All follow existing instruction file patterns

---

### PHASE 1H: CREATE COOKBOOK ENTRY (30 min)

#### Task 22: Create Cookbook Entry

**Objective:** Create cookbook playbook for playwright agent creation.

**Action:**
Create `.github/cookbook/playwright-agent-creation-guide.md`:

```markdown
---
title: Playwright Agent Creation Guide
description: Step-by-step playbook for Playwright testing agents
category: testing
author: Claude Code
version: '1.0.0'
tags: [playwright, testing, agents]
---

# Playwright Agent Creation Playbook

## Context

**Goal:** Convert ChatGPT Playwright agent to multi-provider format

**Providers:** Claude, GitHub Copilot, OpenAI

**Scope:** E2E testing, visual regression, performance metrics, accessibility

## Phase 1: Planning & Analysis

### Step 1a: Analyze Current Export
- Examine folder structure
- Catalog skills & tools
- Document capabilities
- Identify gaps

### Step 1b: Define Multi-Provider Requirements
- Which providers?
- Unique capabilities per provider?
- Shared logic?

## Phase 2: Implementation

### Step 2a: Create Folder Structure
- Backup existing export
- Create new structure (claude/, copilot/, openai/, shared/)
- Copy existing skills & manifests

### Step 2b: Write Agent Spec
- Create AGENT.md with YAML frontmatter
- Fill all sections (Overview, Capabilities, Limitations, Examples)

### Step 2c: Write Core Prompt
- Provider-agnostic instructions
- Clear constraints
- Best practices

### Step 2d: Create Provider Configs
- Claude instructions & tools
- Copilot instructions & skills
- OpenAI instructions & functions

### Step 2e: Define Tools/Functions
- Claude tools.json (5+ tools)
- Copilot skills.yaml (skill references)
- OpenAI tools.json (function definitions)

## Phase 3: Plugin Wrapper

### Step 3a: Create Plugin Structure
- Folder setup
- Subfolder structure

### Step 3b: Create Plugin Manifests
- plugin.json
- copilot-plugin.json
- Provider-specific configs

### Step 3c: Wire Skills & Hooks
- Skill references
- Hook configuration

## Phase 4: Testing & Validation

### Step 4a: Schema Validation
- Validate AGENT.md frontmatter
- Validate tool definitions
- Validate plugin.json

### Step 4b: Hook Validation
- agent-spec-validator
- multi-provider-consistency-checker
- plugin-integrity-checker

### Step 4c: Provider Testing
- Test Claude config loads
- Test Copilot config loads
- Test OpenAI config loads

## Complete Checklist

- [ ] Export analyzed
- [ ] Folder structure created
- [ ] AGENT.md written & validated
- [ ] Core prompt created
- [ ] Provider configs created
- [ ] Tool definitions specified
- [ ] Plugin created
- [ ] All schemas validate
- [ ] All hooks pass
- [ ] Documentation complete
- [ ] Tests passing
- [ ] PR created & approved
- [ ] Merged to develop

## Next Steps

- Review completed agent
- Use as reference for remaining agents
- Begin Phase 2 (generic agent conversions)
```

**Deliverable:**
Complete cookbook entry.

**Success Criteria:**

- [ ] File created with YAML frontmatter
- [ ] All phases documented
- [ ] Checklist included

---

### PHASE 1I: VALIDATION & TESTING (1-2 hours)

#### Task 23: Run All Validations

**Objective:** Validate schemas, hooks, and provider configs.

**Actions:**

```bash
# Validate AGENT.md frontmatter
npm run validate:schema -- .github/agents/playwright-testing-agent/AGENT.md

# Validate all JSON files
npm run validate:schema -- .github/agents/playwright-testing-agent/claude/tools.json
npm run validate:schema -- .github/agents/playwright-testing-agent/openai/tools.json
npm run validate:schema -- .github/plugins/lightspeed-playwright-testing/plugin.json
npm run validate:schema -- .github/plugins/lightspeed-playwright-testing/copilot-plugin.json

# Run all hooks
npm run validate:hooks -- .github/agents/playwright-testing-agent/
npm run validate:hooks -- .github/plugins/lightspeed-playwright-testing/
```

**Deliverable:**
All validations passing.

**Success Criteria:**

- [ ] Schema validation passes
- [ ] Hook validation passes
- [ ] No errors in output

---

#### Task 24: Documentation Check

**Objective:** Verify all documentation is complete and accurate.

**Actions:**

- [ ] README.md exists in agent folder
- [ ] INSTALL.md exists in plugin folder
- [ ] All links in documentation work
- [ ] Agent descriptions are clear
- [ ] Usage examples provided
- [ ] Security rules documented

**Deliverable:**
Documentation verified and complete.

**Success Criteria:**

- [ ] All documentation present
- [ ] Links verified
- [ ] Examples clear

---

### PHASE 1J: GIT WORKFLOW & MERGE (1 hour)

#### Task 25: Create Feature Branch & Commit

**Objective:** Stage changes and create feature branch.

**Actions:**

```bash
# Verify current branch
git branch -v

# Create feature branch
git checkout -b feat/agent-standards-playwright-testing

# Stage changes
git add .github/agents/playwright-testing-agent/
git add .github/plugins/lightspeed-playwright-testing/
git add .github/instructions/
git add .github/.schemas/
git add .github/hooks/
git add .github/cookbook/

# Commit with descriptive message
git commit -m "feat: add playwright-testing agent multi-provider support

- Restructure playwright-testing-agent for Claude, Copilot, OpenAI
- Create lightspeed-playwright-testing plugin with multi-provider configs
- Add 4 new JSON schemas for multi-provider agent validation
- Implement 4 new hooks for agent & plugin validation
- Create 4 new instruction files for agent creation standardization
- Add cookbook entry for playwright agent creation
- All schemas & hooks validated & working

Closes issue #1039"
```

**Deliverable:**
Feature branch created and changes committed.

**Success Criteria:**

- [ ] Branch created: `feat/agent-standards-playwright-testing`
- [ ] All changes staged & committed
- [ ] Commit message descriptive

---

#### Task 26: Create & Merge PR

**Objective:** Create pull request, get review, and merge to develop.

**Actions:**

```bash
# Create PR (using gh CLI)
gh pr create --title "feat: playwright-testing agent multi-provider support" \
  --body "

## Summary
- Complete rewrite of playwright-testing-agent for multi-provider support
- Full repository standardization framework implemented
- 4 new schemas, 4 new hooks, 4 new instruction files

## Changes
- Agent restructure (claude/, copilot/, openai/, shared/)
- Plugin creation (lightspeed-playwright-testing)
- Framework documentation & standards

## Testing
- All schemas validated
- All hooks passing
- Provider configs verified
- Documentation complete

## Checklist
- [x] Tests passing
- [x] Schemas validated
- [x] Hooks validated
- [x] Documentation complete
- [x] No breaking changes
"
```

After approval:

```bash
# Merge PR (squash merge)
gh pr merge --squash --delete-branch

# Verify merge
git log --oneline -5
```

**Deliverable:**
PR created, reviewed, approved, and merged to develop.

**Success Criteria:**

- [ ] PR created with descriptive title & body
- [ ] PR approved by maintainer
- [ ] Squash merged to develop
- [ ] Branch deleted
- [ ] Changes visible in develop

---

## FINAL CHECKLIST

Before completing Phase 1, verify:

### Repository Audit ✅

- [ ] Instructions folder audited
- [ ] Hooks folder audited
- [ ] Schemas folder audited
- [ ] AI config folder audited
- [ ] Memory schema audited
- [ ] All audit files in `.github/tmp/`

### Standardization Framework ✅

- [ ] Naming conventions documented
- [ ] Folder structures specified
- [ ] Validation rules clear
- [ ] Framework document in `.github/tmp/`

### Playwright Agent Rewrite ✅

- [ ] Agent folder restructured
- [ ] AGENT.md created with YAML frontmatter
- [ ] Core prompt (provider-agnostic) created
- [ ] Claude config & tools created
- [ ] Copilot config & skills created
- [ ] OpenAI config & functions created
- [ ] `.github/` subfolder with INSTALL, MANIFEST, security-policy
- [ ] All existing skills & manifests preserved

### Plugin Creation ✅

- [ ] `lightspeed-playwright-testing` folder created
- [ ] plugin.json created & valid
- [ ] copilot-plugin.json created & valid
- [ ] Provider-specific configs (.claude-plugin/, .codex-plugin/, .gemini-plugin/)
- [ ] README.md & INSTALL.md created
- [ ] All documentation links verified

### Schemas ✅

- [ ] 4 new schemas created (multi-provider-agent, agent-plugin-binding, provider-config, agent-capability-manifest)
- [ ] All schema files valid JSON
- [ ] Example valid JSONs provided
- [ ] Schema registry updated

### Hooks ✅

- [ ] 4 new hooks implemented (agent-spec-validator, multi-provider-consistency-checker, plugin-integrity-checker, agent-security-auditor)
- [ ] All hooks have validation logic
- [ ] Hook registry updated

### Instructions ✅

- [ ] 4 new instruction files created
- [ ] All have correct YAML frontmatter
- [ ] All sections filled
- [ ] Cookbook entry created

### Validation ✅

- [ ] Schema validation passing
- [ ] Hook validation passing
- [ ] Provider configs load correctly
- [ ] Documentation complete & verified

### Git & Merge ✅

- [ ] Feature branch created
- [ ] All changes staged & committed
- [ ] PR created with description
- [ ] PR approved
- [ ] Merged to develop with squash merge
- [ ] Branch deleted
- [ ] Changes visible in develop

---

## SUCCESS CRITERIA — PHASE 1 COMPLETE

✅ When all of the above are checked, Phase 1 is complete.

**Outcomes:**

- Playwright testing agent fully restructured for multi-provider support
- Plugin framework in place and functional
- Repository standardization framework established
- Schemas, hooks, and instructions implemented
- Ready for Phase 2 (remaining 15 agents)

---

## NEXT: PHASE 2

Once Phase 1 is merged and verified:

1. Use `PROMPT_2_GENERIC_AGENT_REWRITE.md` for remaining 15 agents
2. Batch agents by domain (2-3 per week)
3. Follow same pattern as Phase 1
4. Expected effort: 2-4 hours per agent

---

**End of Standalone Prompt. You now have everything needed to execute Phase 1. Begin with Task 1 (Audit Instructions) and work systematically through all tasks.**

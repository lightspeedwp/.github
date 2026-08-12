# Prompt: Rewrite `.github/agents/testing.agent.md`

## Executive Summary

Rewrite the `.github` control-plane testing agent to transform it from a **Playwright-focused end-to-end testing agent** into a **comprehensive testing orchestrator** that:

1. **Remains focused on .github control-plane testing needs** (GitHub Actions workflow testing, label validation, automation scripts)
2. **Delegates complex test execution** to the portable `agents/playwright-testing-agent` (E2E testing) and proposed org-wide testing agent
3. **Adds coverage for Jest, PHPUnit, pytest, and WordPress-specific testing frameworks**
4. **Establishes a clear coordination model** between the .github agent and the broader org-wide testing infrastructure

---

## Context & Motivation

### Current State

The existing `.github/agents/testing.agent.md` (v0.1.2):

- Supports Jest, PHPUnit, Playwright, pytest
- Focuses on test execution and coverage analysis
- Lists these frameworks but lacks detailed guidance for each
- Makes no distinction between .github-specific testing and broader org-wide testing

The portable `agents/playwright-testing-agent/` (v2.1.0):

- Comprehensive, well-structured, purpose-built for WordPress/WooCommerce E2E testing
- Includes requirement traceability, human-readable test cases, review-before-code gates
- **Currently scoped only to Playwright** — an opportunity to expand it into a broader org-wide testing agent

### Problem Statement

1. **Framework fragmentation:** Playwright testing has a full agent (at root), but Jest/PHPUnit/pytest are scattered across control-plane agent with minimal guidance
2. **Underutilised structure:** The `agents/playwright-testing-agent/` has excellent scaffolding (provider configs, skills, manifests) that could serve all testing frameworks
3. **WordPress testing incomplete:** Jest, PHPUnit, and PHP testing lack WordPress-specific best practices
4. **Naming confusion:** "Playwright Testing Agent" implies E2E-only, but org needs broader capabilities

### Proposed Solution

**Consolidate into one comprehensive, portable Testing Agent:**

1. **Rename & expand** `agents/playwright-testing-agent/` → `agents/testing-agent/`
   - Keeps the well-architected multi-provider structure (Claude, Copilot, OpenAI)
   - Reuses skills, manifests, and documentation scaffolding
   - Expands from E2E-only to multi-framework (Jest, PHPUnit, pytest, Playwright)

2. **Maintain .github agent as control-plane coordinator**
   - Focuses on testing GitHub Actions workflows and validation scripts
   - Delegates to the portable `agents/testing-agent` for actual test execution
   - Lightweight wrapper for .github-specific concerns (label sync, release workflows, schema validation)

**Architecture (2-tier, simplified):**

| Tier | Component | Role |
|------|-----------|------|
| Tier 1 | `.github/agents/testing.agent.md` | Control-plane testing coordinator; delegates to portable agent |
| Tier 2 | `agents/testing-agent/` (renamed from `playwright-testing-agent`) | Org-wide testing orchestrator (Jest, PHPUnit, pytest, Playwright) |

---

## Rewrite Objectives

### 1. Clarify the Role

The rewritten `.github` agent should establish that it is:

> A testing coordinator for the `.github` control plane that orchestrates test execution for GitHub Actions workflows, scripts, and validation logic while delegating actual test execution to the org-wide portable testing agent (`agents/testing-agent/`).

The **`agents/testing-agent/`** (renamed from `playwright-testing-agent`) should be:

> A comprehensive, multi-framework testing agent supporting Jest, PHPUnit, pytest, and Playwright testing across LightSpeed projects. It provides requirement traceability, review-before-code gates (where applicable), maintainable test specs, and failure triage for all supported frameworks.

### 2. Define Scope: What the .github Agent Owns

**In Scope (Control-Plane Testing):**

- Jest unit tests for `.github/scripts/` (JavaScript/Node.js validation and utility scripts)
- PHPUnit tests for `.github/scripts/` (if any PHP validation scripts exist)
- GitHub Actions workflow validation (syntax, logic, edge cases)
- Labeling automation test cases (label orchestrator, meta-label sync)
- Release workflow testing (version detection, changelog generation, tag validation)
- Issue/PR template validation
- Schema validation (frontmatter, agents, plugins, skills)
- Integration tests for multi-workflow sequences

**Out of Scope (Delegate to Portable Testing Agent):**

- WordPress/WooCommerce E2E testing → `agents/testing-agent/` (Playwright provider)
- Block theme/plugin Jest testing → `agents/testing-agent/` (Jest provider)
- Block theme/plugin PHPUnit testing → `agents/testing-agent/` (PHPUnit provider)
- Python/pytest testing → `agents/testing-agent/` (pytest provider)
- Complex requirement traceability → `agents/testing-agent/` (has review-before-code gates)

### 3. Establish Coordination Model

The rewritten `.github` agent should document how it coordinates with **`agents/testing-agent/`**:

**When to delegate:**

- Any test execution beyond light validation scripts
- Framework-specific testing (Jest, PHPUnit, pytest)
- E2E testing (Playwright)
- Coverage analysis and reporting
- Test failure triage

**How to delegate:**

- Provide test configuration, framework selection, and threshold requirements
- Specify acceptance criteria (for frameworks that support it)
- Provide project context and paths
- Example: "Run Jest suite for `.github/scripts/` with 80% coverage threshold"

**When to keep in .github agent:**

- Light validation of workflow YAML syntax
- Checking GitHub Actions workflow logic (conditions, permissions, secrets)
- Verifying script compliance with coding standards
- Validation of control-plane-specific configurations (labels, templates)

### 4. Clarify Framework Delegation

The `.github` agent should document which frameworks it handles vs. delegates:

#### Jest (JavaScript/TypeScript)

- **.github handles:** Light validation of `.github/scripts/` logic (if it exists)
- **Delegate to `agents/testing-agent/`:** Full Jest test execution, coverage reporting, WordPress API mocking
- **WordPress-specific considerations:**
  - Async WordPress API calls (mocking `fetch`, `wp.apiFetch`)
  - WordPress REST API response mocking
  - Block utility testing
  - Example: Label orchestrator's conflict detection logic

#### PHPUnit (PHP)

- **.github handles:** None (PHP in .github is rare; validation is light)
- **Delegate to `agents/testing-agent/`:** Full PHPUnit execution, WordPress function mocking, WPCS validation
- **WordPress-specific considerations:**
  - WordPress global functions (`get_option`, `apply_filters`, etc.)
  - WordPress database operation mocking
  - Multi-version compatibility testing
  - Example: Schema validation against WordPress coding standards

#### Playwright (Browser Testing)

- **.github handles:** None (E2E is outside control-plane scope)
- **Delegate to `agents/testing-agent/`:** Full Playwright orchestration, requirement traceability, staging-first workflows
- **Control-plane example:** (Rare) Testing a GitHub Actions workflow that deploys a WordPress site

#### pytest (Python)

- **.github handles:** Light validation if `.github/scripts/` includes Python utilities
- **Delegate to `agents/testing-agent/`:** Full pytest execution, CI log analysis, metrics generation
- **Example:** Script that generates WordPress plugin compatibility reports

### 5. Update Capabilities & Tools

**Primary Capabilities:**

- Coordinate with portable `agents/testing-agent/` for test execution
- Validate GitHub Actions workflow logic and syntax
- Light validation of `.github/scripts/` compliance
- Verify control-plane test configurations
- Track test health and outcomes across `.github/` assets

**Secondary Capabilities:**

- Suggest improvements to control-plane test structure
- Validate WordPress-specific code patterns (where applicable)
- Verify schema and validation script compliance
- Provide test failure diagnostics and recovery guidance

**Tools to Update:**

- **portable-agent-coordinator** → invoke `agents/testing-agent/` (replaces direct test execution)
- **workflow-validator** → Validate GitHub Actions YAML and logic
- **schema-validator** → Test schemas in `.schemas/`
- **control-plane-compliance-checker** → Validate control-plane scripts

### 6. Document Integration with CI/CD

**GitHub Actions Workflows Integration:**

- `.github/workflows/test-scripts.yml` — Runs Jest/PHPUnit for control-plane scripts
- `.github/workflows/validate-workflows.yml` — Validates workflow syntax
- Connection to Mergify: test must pass before merge

**Execution Context:**

- Environment: Node.js, PHP, Python (as needed)
- Coverage thresholds: 80% default (configurable)
- Failure behavior: Block merge if coverage drops or tests fail

### 7. Add Examples Relevant to .github

Examples should focus on control-plane scenarios:

**Example 1: Test GitHub Actions Label Sync Workflow**

- Input: Workflow definition (`.github/workflows/meta-labels-sync.yml`)
- Test: Verify label orchestration logic with mock GitHub API responses
- Output: Pass/fail + coverage report + specific workflow failure diagnostics

**Example 2: Validate Release Workflow Version Detection**

- Input: Release workflow script (`.github/scripts/version-detector.js`)
- Test: Jest unit tests covering semver parsing, changelog matching, tag validation
- Output: Test results + coverage by scenario (normal release, hotfix, rollback)

**Example 3: Test Schema Validation Against WordPress Codex**

- Input: Agent schema definition (`.schemas/agent.schema.json`)
- Test: PHPUnit tests verifying schema compliance with WordPress naming conventions
- Output: Schema validity report + WPCS compliance check

---

## File Structure & Format

The rewritten agent should follow the current structure but with expanded sections:

```markdown
---
name: Testing
title: 'Testing Agent: Control-Plane Test Execution & Orchestration'
description: Testing orchestrator for GitHub control-plane automation, coordinating
  test execution across Jest, PHPUnit, pytest, and Playwright frameworks while
  delegating specialized work to portable agents.
version: '0.2.0'
last_updated: [YYYY-MM-DD]
author: LightSpeed
maintainer: Ash Shaw
file_type: agent
category: quality-assurance
status: active
visibility: public
tags:
- testing
- quality
- jest
- playwright
- phpunit
- pytest
- wordpress
- orchestration
language: en
owners:
- lightspeedwp/maintainers
tools:
- file_system
- shell
- github/*
- [portable-agent-coordinator]
- [wordpress-test-validator]
- [schema-validator]
permissions:
- read
- write
- filesystem
- github:repo
- github:actions
- github:workflows
- shell
metadata:
  guardrails: Never skip tests. Always validate coverage thresholds. Log all test
    results. Provide clear failure diagnostics. Ensure minimum coverage thresholds
    are met before merge. Delegate specialized testing to portable agents.
---

# Testing Agent: Control-Plane Test Orchestration

## Overview
[Brief summary of role as orchestrator for .github testing]

## Role & Responsibilities
[Updated to reflect coordination + .github-specific testing]

## Scope: What This Agent Owns
- In Scope: [control-plane testing]
- Out of Scope: [delegated to portable agents]

## Coordination Model
- With `agents/playwright-testing-agent`: [when/how to delegate E2E testing]
- With Testing Orchestrator Agent: [when/how to delegate org-wide testing]

## Capabilities: By Framework
### Jest (JavaScript/TypeScript)
### PHPUnit (PHP)
### Playwright (Browser Testing)
### pytest (Python)

## Required Inputs
[Updated with delegation options]

## Expected Outputs
[Updated with orchestration outcomes]

## Tools & Permissions
[Updated with new tools]

## Safety Constraints
[Guardrails for testing]

## WordPress-Specific Considerations
[New section covering WordPress testing best practices across frameworks]

## Configuration
[Environment variables, framework-specific configs]

## Examples
[Control-plane-focused scenarios]

## Related Agents
- [Release Agent]
- [Playwright Testing Agent](../../agents/playwright-testing-agent/AGENT.md)
- [Testing Orchestrator Agent] (proposed)

## See Also
[Updated references]
```

---

## Parallel Work: Expand `agents/playwright-testing-agent/` → `agents/testing-agent/`

While rewriting the `.github` testing agent, **simultaneously expand the portable testing agent** to handle multiple frameworks:

1. **Rename** `agents/playwright-testing-agent/` to `agents/testing-agent/`
2. **Update AGENT.md frontmatter:**
   - Change title from "Playwright Testing Agent" to "Testing Agent"
   - Update description to cover Jest, PHPUnit, pytest, Playwright
   - Add capabilities: `jest-testing`, `phpunit-testing`, `pytest-testing`, in addition to existing Playwright capabilities
3. **Add framework-specific guidance** to shared core prompt (`shared/core-prompt.md`):
   - Jest configuration, WordPress API mocking patterns
   - PHPUnit setup, WPCS compliance
   - pytest patterns for Python scripts
   - Maintain existing Playwright best practices
4. **Extend provider configs** (Claude, Copilot, OpenAI) with framework-specific instructions
5. **Create/update skills** for each framework (Jest skill, PHPUnit skill, etc.)
6. **Update README.md** to reflect multi-framework support

---

## Key Principles for the Rewrite

1. **Clear delegation:** .github agent delegates all test execution to portable testing agent
2. **Single portable agent:** One comprehensive `agents/testing-agent/` for all frameworks (not multiple)
3. **WordPress focus:** Include WordPress-specific guidance for each framework
4. **Portable-first:** Portable agent owns the testing logic; .github agent is a thin coordinator
5. **Control-plane scoped:** .github agent tests the control plane only (workflows, scripts)
6. **Link to standards:** Reference unified testing guidance (create `docs/TESTING_STANDARDS.md`)

---

## Acceptance Criteria

**For `.github/agents/testing.agent.md` rewrite:**
✅ Clearly defines what .github owns vs. delegates  
✅ Coordination model with `agents/testing-agent/` is explicit  
✅ Examples focus on control-plane scenarios (workflows, scripts, validation)  
✅ Title and description reflect coordinator role (not executor)  
✅ Tools section updated for delegation/coordination  
✅ All references point to `agents/testing-agent/` (singular)  
✅ Version bumped to 0.2.0 with changelog  

**For `agents/testing-agent/` (renamed from playwright):**
✅ Title and description updated to reflect multi-framework scope  
✅ AGENT.md frontmatter includes Jest, PHPUnit, pytest capabilities  
✅ `shared/core-prompt.md` includes framework-specific WordPress guidance  
✅ Provider configs (Claude/Copilot/OpenAI) updated with multi-framework instructions  
✅ Skills created/updated for each framework  
✅ README.md reflects multi-framework support  
✅ Version bumped to 2.2.0  

---

## Deliverables

**1. Rewritten `.github/agents/testing.agent.md`**

- Control-plane testing coordinator
- Delegates to portable testing agent
- ~300-400 lines

**2. Expanded `agents/testing-agent/` (renamed)**

- Multi-framework support (Jest, PHPUnit, pytest, Playwright)
- Maintains existing structure and quality
- Enhanced AGENT.md, core prompt, provider configs
- New/updated framework-specific skills

**3. Optional supporting docs:**

- `docs/TESTING_STANDARDS.md` — unified testing guidance
- Migration guide from old structure to new
- GitHub Actions workflow examples using the new agents

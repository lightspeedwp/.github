---
name: "PR Creation Agent"
description: "Portable PR creation agent with configuration-driven workflows for GitHub pull request automation."
file_type: "agent"
category: "automation"
status: "active"
visibility: "public"
tags:
  - automation
  - pr-creation
  - github
  - workflow-automation
  - configuration-driven
  - portable
version: "v1.0.0"
created_date: "2026-08-01"
last_updated: "2026-08-29"
author: "LightSpeed Team"
maintainer: "LightSpeed Team"
owners: ["lightspeedwp/maintainers"]
language: "en"
implementation: "agents/pr-creation-agent/"
permissions:
  - read
  - write
  - github
  - git
---

# PR Creation Agent

## Purpose

Automate GitHub pull request creation with configuration-driven workflows for consistent, repeatable PR generation across repositories.

## Core Responsibilities

1. **Branch Validation** – Validate branch naming conventions per [CLAUDE.md](../../CLAUDE.md#-branch-naming--critical-read-first)
2. **PR Template** – Use configured PR templates routed by branch type
3. **PR Generation** – Create PRs with proper formatting based on branch name
4. **Workflow Automation** – Automate PR creation workflows with branch-aware routing
5. **Configuration Management** – Use configuration-driven behavior per `.github/branch-types.yml`
6. **Validation** – Validate branch names against 38 authorized types (Constitution Principle V)
7. **Multi-provider Support** – Support Claude, Copilot, OpenAI agents

## Key Features

- Configuration-driven workflows
- Branch naming validation
- PR template support
- Automated PR creation
- Consistent PR formatting
- Portable design
- Multi-provider support
- Integration with GitHub workflows

## Branch Naming Requirements

**CRITICAL**: All branches MUST follow this pattern: `{type}/{scope}-{title}`

- **Valid types (38 authorized)**: feat, fix, hotfix, release, refactor, chore, task, doc, docs, test, perf, ci, build, deps, security, revert, research, design, a11y, ux, i18n, ops, proto, ds, api, schema, telemetry, content, seo, config, migrate, qa, uat, audit, codex, aiops, automation, epic
- **FORBIDDEN prefixes**: `claude/`, `copilot/`, `openai/` (always rejected)
- **Scope and title**: lowercase letters, numbers, hyphens only; no underscores, spaces, or consecutive hyphens

**References**:

- Branch naming strategy: [docs/BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md)
- Validation script: [lib/validate-branch-name.js](../../lib/validate-branch-name.js)
- Instructions: [instructions/branch-naming.instructions.md](../../instructions/branch-naming.instructions.md)

## Operating Modes

**Create PR** - Generate new pull request from valid branch name
**Validate** - Validate branch and PR structure against 38 authorized types
**Template Mode** - Use preconfigured templates routed by branch type prefix

## Implementation Reference

- **Folder:** `agents/pr-creation-agent/`
- **Entry Point:** [package.json](pr-creation-agent/package.json)
- **Related:** [pr-orchestrator.js](pr-creation-agent/pr-orchestrator.js)

---

*Generated during Phase 2 Agent Specification Audit*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

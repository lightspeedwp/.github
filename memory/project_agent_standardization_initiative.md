---
name: project_agent_standardization_initiative
description: Standardization initiative for multi-provider agents (Claude, GitHub Copilot, OpenAI Codex)
metadata:
  type: project
---

# Agent Standardization Initiative

## Overview

Multi-provider agent rewrite project to unify ChatGPT agent exports into standardised Claude/Copilot/OpenAI-compatible agents with plugin architecture.

## Current State Audit (2026-07-22)

### Agents Folder (`/agents/`)

- 41 agents total: Mix of `.agent.md` specs and ChatGPT export folders
- Folders with subdirectories (ChatGPT exports):
  - playwright-testing-agent
  - ai-readiness-estimator-agent
  - client-website-discovery-assistant-agent
  - design-partner-agent
  - harvest-analytical-agent
  - linear-advisor-agent
  - pagespeed-agent
  - prd-agent
  - prd-factory-planner-agent
  - proposal-desk-agent
  - tour-operator-config-agent
  - website-content-strategist-agent
  - website-scope-estimator-agent
  - woo-config-agent
  - wp-config-agent
  - zendesk-support-agent
- Naming convention: kebab-case with "agent" suffix
- ChatGPT structure: Contains `agent/`, `skills/`, `manifests/`, `checksums.sha256`, `README.md`

### Plugins Folder (`/plugins/`)

- 6 existing plugins with multi-provider support:
  - lightspeed-github-ops
  - lightspeed-metrics-and-reporting
  - lightspeed-quality-assurance
  - lightspeed-release-ops
  - lightspeed-wordpress-governance
  - lightspeed-wordpress-planning
- Structure: `.claude-plugin/`, `.codex-plugin/`, `.gemini-plugin/`, `agents/`, `hooks/`, `skills/`, copilot-plugin.json
- Naming: lightspeed-{domain}-{focus} pattern

### Instructions Folder (`/instructions/`)

- 42 instruction files covering:
  - coding-standards, a11y, automation, community-standards
  - agent-spec, documentation-formats, languages
  - hooks, issues, plugins, pull-requests
  - file-organisation, workflows
- Key: `agent-spec.instructions.md` defines agent requirements

### Hooks Folder (`/hooks/`)

- 3 hooks:
  - secrets-scanner
  - session-logger
  - tool-guardian
- README.md with hook-registry.json

### Schema Folder (`/.schemas/`)

- 16 schema files including:
  - agent-config.schema.json
  - frontmatter.schema.json
  - skill-agent-config.schema.json
  - plugin-manifest.schema.json
- Memory subfolder for persisted agent context

### AI Folder (`/ai/`)

- Config files for Claude, Gemini, OpenAI
- Audit summaries and improvement plans
- agents.md and RUNNERS.md

### Memory/Work Tracking

- `.remember/` folder for session memory
- `memory/` subfolder in schema for agent memory persistence

## Standardization Gaps Identified

1. **Agent Naming**: Mixed `.agent.md` files vs. folder-based exports
2. **Plugin Architecture**: Manual duplication across providers
3. **Hook Integration**: Limited hook patterns for agent validation
4. **Schema Coverage**: No unified schema for multi-provider agent exports
5. **Cookbook**: Only 4 entries, needs agent/plugin creation guides
6. **Instructions**: No dedicated agent-creation instruction file

## Key Files for Reference

- [agents/agent.md](../agents/agent.md) - Main agent index
- [agents/testing.agent.md](../agents/testing.agent.md) - Reference agent
- [AGENTS.md](../../AGENTS.md) - Global AI rules
- [agents/agent-spec.instructions.md](../instructions/agent-spec.instructions.md) - Agent spec standards

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

---
file_type: index
title: Agent Specifications Library
description: Centralized repository of portable agent specification and implementation files
created_date: "2026-08-29"
last_updated: "2026-08-29"
status: active
domain: governance
stability: stable
tags: ["agents", "specifications", "documentation", "ai-operations"]
owners: ["lightspeedwp/maintainers"]
---

# Agent Specifications Library

This directory contains portable agent specifications (`.agent.md` files) and their corresponding implementation folders. Each agent has both a specification file documenting its purpose and behavior, and an implementation folder containing code, configuration, and templates.

## Overview

- **Total Agent Specs:** 39
- **Agents with Implementations:** 28
- **Spec-Only Agents:** 8 (modes and infrastructure)
- **Agent Pairs (spec + impl):** 20
- **Coverage:** 100% spec coverage

## Organization

Portable agent specifications follow this structure:

```
agents/
├── {agent-name}.agent.md          # Agent specification
├── {agent-name}-agent/            # Implementation folder (optional)
│   ├── AGENT.md                   # Agent documentation
│   ├── README.md                  # Quick reference
│   ├── agent/                     # Agent code/configuration
│   ├── claude/                    # Claude-specific instructions
│   ├── copilot/                   # Copilot-specific instructions
│   ├── manifests/                 # Configuration manifests
│   ├── openai/                    # OpenAI-specific instructions
│   ├── shared/                    # Shared resources
│   └── skills/                    # Skill definitions
```

## Agents with Full Coverage (Spec + Implementation)

Agents with both specification files and complete implementations (28 total).

### AI Assessment & Readiness

- **[AI Readiness Estimator](./ai-readiness-estimator-agent/)** – [`ai-readiness-estimator.agent.md`](./ai-readiness-estimator.agent.md)
  - AI capability assessment and organizational readiness evaluation

### Architecture & Design

- **[ADR Generator](./adr-generator/)** – [`adr.agent.md`](./adr.agent.md)
  - Expert at creating comprehensive Architectural Decision Records (ADRs)

- **[Design Partner Agent](./design-partner-agent/)** – [`design-partner.agent.md`](./design-partner.agent.md)
  - AI-powered design collaboration for UI/UX review and design systems

### Content & Documentation

- **[Website Content Strategist](./website-content-strategist-agent/)** – [`website-content-strategist.agent.md`](./website-content-strategist.agent.md)
  - Content strategy planning, audits, and SEO optimization

- **[Changelog](./changelog/)** – [`changelog.agent.md`](./changelog.agent.md)
  - Automated changelog generation from commit history

### Project Management & Planning

- **[PRD Agent](./prd-agent/)** – [`prd.agent.md`](./prd.agent.md)
  - Product requirement document creation and management

- **[PRD Factory & Planner](./prd-factory-planner-agent/)** – [`prd-factory-planner.agent.md`](./prd-factory-planner.agent.md)
  - Automated PRD generation and project planning

- **[Task Planner](./task-planner-agent/)** – [`task-planner.agent.md`](./task-planner.agent.md)
  - Multi-mode planning agent for architecture, implementation, and task planning

- **[Website Scope Estimator](./website-scope-estimator-agent/)** – [`website-scope-estimator.agent.md`](./website-scope-estimator.agent.md)
  - Project estimation and feature scoping tool

### Development Tools

- **[PR Creation Agent](./pr-creation-agent/)** – [`pr-creation.agent.md`](./pr-creation.agent.md)
  - Pull request creation and management

- **[Chat Closure Agent](./chat-closure-agent/)** – [`chat-closure.agent.md`](./chat-closure.agent.md)
  - Automated session handoff and chat closure workflows

- **[Linting Agent](./linting-agent/)** – [`linting.agent.md`](./linting.agent.md)
  - Code quality and linting assistance

- **[Testing Agent](./testing-agent/)** – [`testing.agent.md`](./testing.agent.md)
  - Test case generation and quality assurance

### Business & Client Tools

- **[Linear Advisor Agent](./linear-advisor-agent/)** – [`linear-advisor.agent.md`](./linear-advisor.agent.md)
  - Project management and Linear issue integration

- **[Proposal Desk Agent](./proposal-desk-agent/)** – [`proposal-desk.agent.md`](./proposal-desk.agent.md)
  - Proposal and quote generation for scope definition

- **[Harvest Analytical Agent](./harvest-analytical-agent/)** – [`harvest-analytical.agent.md`](./harvest-analytical.agent.md)
  - Time tracking analytics and project profitability analysis

### WordPress & E-Commerce

- **[WordPress Config Agent](./wp-config-agent/)** – [`wp-config.agent.md`](./wp-config.agent.md)
  - WordPress site configuration and optimization

- **[WooCommerce Config Agent](./woo-config-agent/)** – [`woo-config.agent.md`](./woo-config.agent.md)
  - WooCommerce store configuration and setup

- **[Tour Operator Config Agent](./tour-operator-config-agent/)** – [`tour-operator-config.agent.md`](./tour-operator-config.agent.md)
  - WordPress configuration for tour operator websites

- **[WordPress Agent](./wordpress/)** – [`wordpress.agent.md`](./wordpress.agent.md)
  - WordPress release utilities and versioning

### Integration & Analytics

- **[Metadata Agent](./metadata-agent/)** – [`metadata.agent.md`](./metadata.agent.md)
  - Metadata management and extraction

- **[PageSpeed Agent](./pagespeed-agent/)** – [`pagespeed.agent.md`](./pagespeed.agent.md)
  - Web performance optimization and load-time analysis

- **[Zendesk Support Agent](./zendesk-support-agent/)** – [`zendesk-support.agent.md`](./zendesk-support.agent.md)
  - Customer support ticket management integration

- **[Client Website Discovery Assistant](./client-website-discovery-assistant-agent/)** – [`client-website-discovery-assistant.agent.md`](./client-website-discovery-assistant.agent.md)
  - Website assessment and competitive analysis

### Special Cases

- **[Meta Agent](./meta-agent/)** – [`meta.agent.md`](./meta.agent.md)
  - Meta-level agent coordination

- **[Prompt Engineer](./prompt-engineer/)** – [`prompt-engineer.agent.md`](./prompt-engineer.agent.md)
  - Prompt optimization and engineering

- **[Release Agent](./release/)** – [`release.agent.md`](./release.agent.md)
  - Release management and versioning

- **[Task Researcher Agent](./task-researcher-agent/)** – [`task-researcher.agent.md`](./task-researcher.agent.md)
  - Research and information gathering

## Specification-Only Agents (No Implementation Folder)

These agents have specification files but no corresponding implementation folders (8 total).

### Mode Specifications

These specifications define operating modes for other agents:

- [`mode-thinking.agent.md`](./mode-thinking.agent.md) – Thinking/reasoning mode
- [`mode-prd.agent.md`](./mode-prd.agent.md) – PRD generation mode
- [`mode-demonstrate-understanding.agent.md`](./mode-demonstrate-understanding.agent.md) – Understanding demonstration mode
- [`mode-document-reviewer.agent.md`](./mode-document-reviewer.agent.md) – Document review mode

### Core Infrastructure Specs

These specifications define core agent infrastructure and coordination:

- [`issues.agent.md`](./issues.agent.md) – Issue management orchestration
- [`labeling.agent.md`](./labeling.agent.md) – Labeling and categorization
- [`metrics.agent.md`](./metrics.agent.md) – Metrics and analytics
- [`reporting.agent.md`](./reporting.agent.md) – Reporting and summaries

## Cross-References

Each agent specification file includes an "Implementation Reference" section that links to:

- **Agent Definition** – AGENT.md file in the implementation folder
- **README** – Quick reference guide
- **Configuration** – Configuration files and schemas (if applicable)
- **Templates** – Reusable templates and examples (if applicable)
- **Tests** – Test coverage and validation (if applicable)

Each implementation folder includes a link back to its specification file.

## Coverage Analysis

### Phase 1: Architecture Decision ✅ (Completed)

- ✅ Architecture confirmed: Every agent gets a spec (Option A)
- ✅ Orphaned specs classified (8 spec-only for modes/infrastructure)
- ✅ This README created documenting organization and coverage

### Phase 2: Create Missing Specs ✅ (Completed)

- ✅ Created 20 missing `.agent.md` spec files
- ✅ Extracted descriptions from AGENT.md files
- ✅ Added implementation cross-references

### Phase 3: Add Cross-References 🔄 (In Progress)

- 🔄 Update all 28 implementation specs with cross-references
- 🔄 Update all implementation folders with back-links

### Phase 4: Validation Setup ⏳ (Planned)

- ⏳ Create validation script for spec/implementation pairs
- ⏳ Add to npm validation pipeline

### Phase 5: Documentation Updates ⏳ (Planned)

- ⏳ Update CONTRIBUTING.md with agent creation guidelines
- ⏳ Clarify portable agent location in CLAUDE.md

## Creating New Agents

When creating a new agent:

1. **Create implementation folder:** `agents/{name}-agent/` or `agents/{name}/`
2. **Create agent definition:** `{name}-agent/AGENT.md` or `SKILL.md`
3. **Create spec file:** `agents/{name}.agent.md`
4. **Add cross-references:** Link spec to implementation and vice versa
5. **Run validation:** `npm run validate:agents`

## Related Documentation

- [Audit Report](../.github/reports/agent-audit/AGENT_SPEC_AUDIT_REPORT.md) – Comprehensive audit findings
- [Action Plan](../.github/reports/agent-audit/AGENT_SPEC_ACTION_PLAN.md) – Implementation roadmap
- [Naming Conventions](../.github/reports/agent-audit/AGENT_NAMING_CONVENTIONS.md) – Naming standards
- [Issue #1828](https://github.com/lightspeedwp/.github/issues/1828) – Master initiative epic

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

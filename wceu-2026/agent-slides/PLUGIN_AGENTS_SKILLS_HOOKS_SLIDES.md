---
title: "Plugin, Agents, Skills & Hooks Slide Deck Prompt"
description: "NotebookLM and design prompt for generating integrated ecosystem presentation"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Plugin, Agents, Skills & Hooks Slide Deck Prompt

## System Overview

The **LightSpeed .github Ecosystem** is a modular, plugin-based architecture that orchestrates governance, automation, and intelligence across repositories. Agents (autonomous decision-makers) delegate tasks to Skills (reusable capabilities) and are protected by Hooks (guardrails and validation). This integrated system enforces standards while maintaining flexibility and transparency.

**Operational scope**: Repository-wide automation orchestration, capability distribution, guardrail enforcement, workflow integration.

**Owned by**: LightSpeed ops & engineering teams

## Key Components

1. **Agents** - 7 autonomous decision-makers (Release, Branding, Meta, Reviewer, Linting, Labelling, Planner) that coordinate repository operations
2. **Skills** - 30+ reusable capabilities distributed across 6 batches, invoked by agents and workflows
3. **Hooks** - 3 guardrails (secrets-scanner, session-logger, tool-guardian) protecting tool execution
4. **Plugins** - 5 specialized plugin domains (github-ops, release-ops, wordpress-governance, planning, metrics)
5. **Workflows** - 15 GitHub Actions workflows triggered by events, invoking agents and skills
6. **Script Infrastructure** - Agent scripts, shared utilities, validation logic, orchestration layer

## Integration Points

- **Agents → Skills**: Agents discover and invoke skills to delegate work
- **Workflows → Agents**: Workflows trigger agents based on events (PR, push, schedule)
- **Hooks → Tools**: Hooks intercept tool execution, validate context, enforce guardrails
- **Plugins → Repository**: Plugins extend core agent capabilities with domain-specific logic
- **Scripts → Workflows**: Workflow steps invoke agent scripts for execution

## Use Cases & Examples

### Use Case 1: PR Workflow Integration

A developer opens a PR; multiple agents and skills activate automatically.

**Ecosystem workflow:**

1. `pull_request` event triggers workflows (reviewer, linting, labeling)
2. Linting workflow invokes linting.agent.js → runs markdown/code linting skills
3. Reviewer workflow invokes reviewer.agent.js → calls code-review skills
4. Labeling workflow invokes labeling.agent.js → applies label-governance skill
5. Hooks validate tool usage during each step (secrets-scanner, tool-guardian)
6. Session-logger records all agent activity for audit trail
7. Results aggregated in PR comments and status checks

### Use Case 2: Release Cycle Coordination

Release ready; multiple agents coordinate version, documentation, and artifacts.

**Ecosystem workflow:**

1. Release workflow triggered on version tag
2. Invokes release.agent.js which orchestrates:
   - Changelog-compliance skill validation
   - Release-readiness skill checking
   - Release-notes-generator skill
3. Skills invoke shared utilities (changelogUtils, versionBumping)
4. Hooks validate release credentials
5. Plugins extend with wordpress-release-hygiene checks
6. Output: GitHub Release, npm package, plugin distribution

### Use Case 3: Capability Discovery & Extension

Team wants to add new skill; system discovers and activates automatically.

**Ecosystem workflow:**

1. New skill deployed to plugins/[domain]/skills/[skill-name]
2. SKILL_REGISTRY.json updated with batch/plugin reference
3. Agent scripts can discover skill via registry
4. Workflows invoke agent with discovery flag
5. Agent loads skill dynamically at runtime
6. Hooks validate skill security before execution
7. Session-logger records first invocations for debugging

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Repository automation scattered, overlapping, hard to govern
- Stakes: Inconsistent enforcement, duplicated logic, unclear ownership, hard to extend

**Slide 02** - Ecosystem Architecture

- 7 Agents coordinate autonomous decisions
- 30+ Skills distributed across 6 batches + plugins
- 3 Hooks protect tool execution
- 5 Plugins extend with domain logic
- 15 Workflows orchestrate events
- Unified script infrastructure enables all

**Slide 03** - What Are Agents?

- Autonomous decision-makers, not command executors
- Each agent owns a domain (Release, Labeling, Branding, Meta, Reviewer, Linting, Planner)
- Agents discover and invoke skills to delegate work
- Agents run in workflows, responding to repository events
- Agents produce structured output (PR comments, labels, issues)

**Slide 04** - Agent Domains & Responsibilities

- **Release Agent**: Version governance, changelog, artifacts
- **Branding Agent**: Document metadata, footers, badges, categories
- **Meta Agent**: Health monitoring, freshness, link validation
- **Reviewer Agent**: Code quality, security, performance review
- **Linting Agent**: Syntax, formatting, style enforcement
- **Labelling Agent**: Automated issue/PR labeling, taxonomy
- **Planner Agent**: Roadmap, prioritization, dependency management

**Slide 05** - What Are Skills?

- Reusable, single-purpose capabilities
- Portable: can be invoked by agents, workflows, or other skills
- Discoverable: registered in SKILL_REGISTRY.json with metadata
- Versioned: batches 1-6 represent evolution and new capabilities
- Example: lightspeed-release-readiness, lightspeed-metrics-reporting, lightspeed-qa-signoff-summary

**Slide 06** - Skill Distribution & Batches

- **Batch 1 (Core)**: Frontmatter audit, label governance, PR review (3 skills)
- **Batch 2 (Design MD Agent)**: AI readiness, intake router, implementation planner (8 skills)
- **Batch 3 (Release, QA, Metrics)**: Release readiness, changelog, QA gates, test planning (8 skills)
- **Batch 4 (GitHub Ops, Planning)**: Issue triage, sprint roadmap, release hygiene (5 skills)
- **Batch 5 (Advanced Governance)**: PR template, milestone planner, accessibility, test failure triage (6 skills)
- **Batch 6 (Observability)**: Issue template, capacity planner, security governance, flaky test triage (6 skills)

**Slide 07** - What Are Hooks?

- Guardrails: intercept tool execution before scripts run
- Validate context: ensure tool has authority, required data
- Enforce governance: prevent credential exposure, unauthorized access
- Portable: same hooks protect all tool invocations
- Example hooks: secrets-scanner (prevent credential leaks), session-logger (audit trail), tool-guardian (authorize execution)

**Slide 08** - Plugin Architecture

- Modular domain-specific extensions
- 5 plugins: github-ops, release-ops, wordpress-governance, wordpress-planning, metrics-and-reporting
- Each plugin: skills + hooks + configuration
- Plugins extend core agents with domain logic
- Example: lightspeed-wordpress-governance plugin adds WordPress-specific release checks

**Slide 09** - Workflow Orchestration

- 15 GitHub Actions workflows triggered by repository events
- Events: pull_request, push, schedule, issues, discussion
- Workflows invoke agents (labeling.agent.js, release.agent.js, etc.)
- Agents invoke skills based on context
- Results: PR comments, labels, issues, releases

**Slide 10** - Script Infrastructure Layer

- **Agent Scripts**: 20+ agents handling domain logic (release.agent.js, labeling.agent.js)
- **Shared Utilities**: changelogUtils, badgeUtils, labeler-utils (used by multiple agents)
- **Validation Scripts**: validate-frontmatter, validate-links, validate-linting
- **Orchestration**: script discovery, error handling, logging
- **Testing**: agent test suites verify logic isolation

**Slide 11** - Agent-Skill Invocation Flow

- Workflow event triggers → Workflow runs agent script
- Agent script: read context (repo state, PR data, config)
- Agent discovers applicable skills from SKILL_REGISTRY
- Agent invokes each skill with context parameters
- Skills execute, return results (labels, comments, metrics)
- Agent aggregates results, produces unified output
- Hooks validate context before each skill execution

**Slide 12** - Capability Discovery & Extension

- SKILL_REGISTRY.json central registry (all skills listed)
- Agents query registry at runtime: "which skills apply to this context?"
- New skill deployment: add to registry, skill automatically discoverable
- Backward compatibility: old agents can ignore new skills
- Forward compatibility: new agents use old skills
- No deployment bottleneck: add skills independently of agent releases

**Slide 13** - Governance & Transparency

- All agent decisions logged (session-logger hook)
- All skill invocations tracked in metrics
- All scripts in version control (`.github/scripts/`, `plugins/*/`)
- All hooks verified before execution (tool-guardian)
- Open visibility: developers see why labels applied, why PRs blocked

**Slide 14** - Security & Guardrails

- Hooks: secrets-scanner prevents credential exposure in logs/outputs
- Hooks: tool-guardian validates authorization (who, what, when)
- Context validation: agents verify they have required permissions
- Audit trail: session-logger records all agent activity
- Credential isolation: no secrets stored in scripts, only environment variables

**Slide 15** - Close & Next Actions

- Ecosystem is modular, portable, extensible
- Add capabilities: extend plugins, add new skills
- Contribute: Submit PRs to agents or skills
- Questions & feedback

## Evidence Anchors

- `.github/AGENTS.md` - Agent specification matrix and responsibilities
- `.github/skills/SKILL_REGISTRY.json` - Complete skill inventory and batch assignments
- `.github/hooks/hook-registry.json` - Hook definitions and invocation points
- `.github/plugins/` - 5 plugin directories with domain-specific extensions
- `.github/scripts/agents/` - 20+ agent scripts with domain logic
- `.github/scripts/agents/includes/` - Shared utilities (changelogUtils, badgeUtils, labeler-utils)
- `.github/.github/workflows/` - 15 workflow definitions triggering agents
- `.github/scripts/workflows/` - Workflow setup and orchestration logic

## Design Notes

- **Visual theme**: Modular architecture, interconnected systems (plugin blocks, skill networks, agent hubs)
- **Color palette**: Use integration/architecture colors (blues for agents, greens for skills, reds for hooks)
- **Key visuals**: Agent interaction diagram, skill registry tree, hook intercept diagram, workflow event flow
- **Accessibility**: Clear labels for each component; high contrast for flow arrows and connections
- **Animations**: Consider workflow event animation, skill discovery reveal, hook interception animation

## Quality Bar

- Distinguish "implemented now" vs "batch roadmap"
- Explain how agents discover and invoke skills without coupling
- Show concrete examples of agent-skill-hook interaction
- Validate examples against actual agent scripts and SKILL_REGISTRY
- Ensure all evidence references point to current develop branch

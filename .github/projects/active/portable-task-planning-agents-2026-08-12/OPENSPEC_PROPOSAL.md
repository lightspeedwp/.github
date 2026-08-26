---
file_type: documentation
title: "OPENSPEC PROPOSAL"
description: "Project documentation"
last_updated: "2026-08-25"
status: draft
---

# Phase 2: Portable Task Planning Agents — Implementation Proposal

## Why

Phase 1 defined the architecture, design decisions, and implementation roadmap for portable task planning agents. Phase 2 implements this specification across two unified agents (Task Researcher, Task Planner) that adapt to multiple repository types (GitHub control-plane, WordPress plugins, WordPress themes) via parameter-driven configuration. This unlocks reusable AI planning capabilities across the entire LightSpeed organization.

**Opportunity:** Currently, task planning and research capabilities are scattered across isolated agents in `.github/agents/`. Phase 2 consolidates these into portable, reusable agents in root `agents/` folder that work across all repository contexts, reducing duplication and enabling consistent planning workflows.

## What Changes

- **Two Multi-File Portable Agents** — Task Researcher Agent and Task Planner Agent, each with provider-specific implementations (Claude, Copilot, OpenAI)
- **5 Core Agent-Attached Skills** — Repository Analyzer, Standards Validator, Report Generator, Planning Engine, Scope Validator (research + planning phases)
- **4 Support Scripts** — analyze-repo-context.js, generate-task-plan.js, validate-coding-standards.js, coordinate-agent-flow.js
- **Jest Test Suite** — 70+ unit/integration tests with 80%+ code coverage, mocks for GitHub API and file system
- **5 Comprehensive Documentation Files** — ARCHITECTURE.md, MERMAID_DIAGRAMS.md, IMPLEMENTATION_ROADMAP.md, TEST_STRATEGY.md, EXAMPLES.md (6+ Mermaid diagrams, WCAG 2.2 AA compliant)
- **Multi-Repository Type Support** — GitHub control-plane, WordPress block plugins, WordPress block themes (verified via integration tests)
- **Multi-Provider Support** — Claude, Copilot, OpenAI (with Gemini experimental support planned for Phase 3)

## Capabilities

### New Capabilities

- `task-researcher-agent`: Multi-file portable agent for codebase analysis, clarifying questions, and research report generation. Adapts to GitHub, WordPress plugin, and WordPress theme repositories via configuration parameters.
- `task-planner-agent`: Multi-file portable agent for research synthesis, task plan generation, and scope validation. Orchestrates researcher agent output into structured, dependency-aware task plans.
- `repository-analyzer-skill`: Code audit, codebase structure analysis, standards detection, dependency mapping, risk assessment.
- `standards-validator-skill`: Coding standards compliance validation (PHPCS, ESLint, Prettier, Stylelint) against repository-type-specific configurations.
- `report-generator-skill`: Structured audit and compliance report generation with metrics, recommendations, and appendices.
- `planning-engine-skill`: Research synthesis into phased task plans with effort estimates, dependencies, critical path analysis.
- `scope-validator-skill`: Task plan feasibility assessment, dependency validation, blocker identification, scope creep detection.

### Modified Capabilities

- `.github/agents/task-planner.agent.md`: **MODIFIED** — Spec-based agent replaced by multi-file portable agent in `agents/task-planner-agent/` with provider-specific implementations. Breaking change: old agent no longer used; migration path documented.
- `.github/agents/task-researcher.agent.md`: **MODIFIED** — Spec-based agent replaced by multi-file portable agent in `agents/task-researcher-agent/` with provider-specific implementations. Breaking change: old agent no longer used; migration path documented.

## Impact

**Code & Infrastructure:**

- New folder structure: `agents/task-researcher-agent/` and `agents/task-planner-agent/` (portable, reusable across LightSpeed projects)
- New testing infrastructure: Jest configuration, test fixtures, GitHub API mocks
- New documentation in project folder: 5 comprehensive markdown files with diagrams
- Migration: Existing `.github/agents/task-planner.agent.md` and `.github/agents/task-researcher.agent.md` deprecated but retained for backward compatibility during Phase 3

**Dependencies:**

- Jest 30.4.2+ for test execution
- @octokit/rest for GitHub API mocking
- Mermaid for diagram generation and validation

**Teams & Workflows:**

- Initiative Lead: ashleyshaw (all roles: agent dev, skills dev, test lead, documentation lead)
- 5-6 week implementation timeline (Weeks 1-6: Aug 19 - Sep 30)
- 17 GitHub issues to coordinate work (1 epic + 16 component tasks)
- Integration testing with real LightSpeed WordPress plugin/theme repositories

**Artifacts Delivered:**

- 2 portable agents with 3 provider implementations each
- 5 core skills (research phase: 4 skills; planning phase: 3+ skills)
- 4 support scripts with 70+ tests
- 5 documentation files (1,500+ lines)
- Full integration test suite for all repository types

---

## Success Criteria

✅ All 70+ tests passing with 80%+ code coverage  
✅ Both agents fully functional across GitHub, WordPress plugin, WordPress theme repositories  
✅ 5 core skills implemented and tested  
✅ 4 support scripts integrated and CI-ready  
✅ 5 documentation files complete with 6+ WCAG 2.2 AA compliant diagrams  
✅ Provider-specific implementations working (Claude, Copilot, OpenAI)  
✅ Code review approved  
✅ CI/CD pipeline green  
✅ Ready for Phase 3 (validation & integration refinement)

---

**Status:** Draft (ready for openspec specs phase)  
**Next Steps:** Create detailed specs for each new capability

---
file_type: documentation
title: "Design"
description: "Project documentation"
last_updated: "2026-08-25"
status: draft
---

# Phase 2: Design — Portable Task Planning Agents Implementation

## Context

**Current State:**

- Phase 1 completed: Specification documents, architectural decisions, and implementation roadmap in `.github/projects/active/portable-task-planning-agents-2026-08-12/`
- Task planning capabilities currently exist in `.github/agents/` (control-plane-only, not portable)
- No unified agent system for multiple repository types (GitHub, WordPress plugins, WordPress themes)
- No skills-based architecture or test infrastructure

**Constraints:**

- Must remain portable (installable in other LightSpeed repositories)
- Must support 3 repository types: GitHub control-plane, WordPress plugins, WordPress themes
- Must support multiple providers: Claude, Copilot, OpenAI (Gemini experimental in Phase 3)
- Must maintain 80%+ test coverage
- Must follow LightSpeed portable agent standards (2-tier architecture: spec-based + multi-file)
- Must be compatible with existing `.github/agents/` agents during transition

**Stakeholders:**

- Initiative Lead: ashleyshaw
- LightSpeed organization (users of planning agents across projects)
- CI/CD pipeline (test validation, deployment automation)

## Goals / Non-Goals

**Goals:**

- ✅ Implement 2 multi-file portable agents (Task Researcher, Task Planner) in root `agents/` folder
- ✅ Create 5 core agent-attached skills with clear contracts and test coverage
- ✅ Build 4 support scripts with Jest infrastructure (70+ tests, 80%+ coverage)
- ✅ Generate 5 comprehensive documentation files with Mermaid diagrams (WCAG 2.2 AA compliant)
- ✅ Ensure agents work seamlessly across GitHub, WordPress plugin, and WordPress theme repositories
- ✅ Implement multi-provider support (Claude, Copilot, OpenAI with provider-specific agent implementations)
- ✅ Create integration tests validating end-to-end workflows for all repository types
- ✅ Deliver within 5-6 week timeline with weekly milestones

**Non-Goals:**

- ❌ Rewrite existing `.github/agents/` agents (retain for backward compatibility during Phase 3)
- ❌ Implement Gemini provider (Phase 3 experimental support)
- ❌ Create WordPress-specific workflow integrations (Phase 3 integration refinement)
- ❌ Optimize agent performance beyond baseline (Phase 3 optimization)
- ❌ Build admin/management dashboards (future phase)

## Decisions

### D1: Agent Architecture — Two-Agent Orchestrator with Handoff

**Decision:** Implement as **unified orchestrator** containing two sequential agents (Task Researcher → Task Planner) with internal handoff, not as separate independent agents.

**Rationale:**

- Shared orchestrator reduces code duplication (configuration loading, parameter validation, context mapping)
- Handoff pattern enforces research-before-planning discipline
- Maintains single entry point for consumers (one agent instantiation)
- Easier to test end-to-end workflows with internal handoff
- Aligns with LightSpeed phase-2 architecture pattern (established in other agents)

**Alternatives Considered:**

- Separate agents with external orchestrator: more flexible but adds orchestration complexity and testing burden
- Single monolithic agent: simpler but harder to reason about, difficult to test phases independently
- **Selected:** Unified orchestrator (best balance of simplicity and maintainability)

### D2: Skill Architecture — Agent-Attached Skills vs. Standalone

**Decision:** Implement skills as **agent-attached** (defined in `skills/agent-attached/` subdirectories per agent, not as standalone portable skills).

**Rationale:**

- Skills are tightly coupled to agent contracts and research/planning phases
- Agent-attached pattern is LightSpeed standard for Phase 2 multi-file agents
- Easier to version control and test skills alongside agents
- Clear ownership: each skill belongs to one agent phase
- Reduces skill discovery/loading complexity

**Alternatives Considered:**

- Standalone portable skills: more reusable but introduces coordination overhead
- Single monolithic skill set: simpler but loses modularity and testability
- **Selected:** Agent-attached skills (aligns with LightSpeed multi-file agent pattern)

### D3: Repository-Type Configuration — Parameter-Driven vs. Separate Codebases

**Decision:** Implement as **parameter-driven configuration** (single agent, multiple repository-type configs) not separate codebases.

**Rationale:**

- Reduces duplication of agent logic across GitHub/WordPress variants
- Configuration changes don't require code changes (testable in isolation)
- Easier to add new repository types in the future
- Single source of truth for agent behavior
- Aligns with Phase 1 architectural decision and WordPress plugin patterns (`wp_get_environment_type()`)

**Alternatives Considered:**

- Separate agent files per repository type: clearer but high duplication
- Template-based code generation: complex tooling and harder to debug
- **Selected:** Parameter-driven configuration (proven pattern in WordPress ecosystem)

### D4: Testing Infrastructure — Jest with Mocks vs. Integration-Heavy

**Decision:** Primary test strategy uses **Jest with mocks** (60% unit, 30% integration, 10% E2E), not live GitHub API or file system for most tests.

**Rationale:**

- Jest mocks provide fast, reliable, repeatable tests (CI-friendly)
- Mocks enable testing error paths without side effects
- GitHub API rate limiting avoided in CI pipelines
- File system mocks prevent test pollution and dependency on repo structure
- Still includes integration and E2E tests for critical paths (researcher → planner handoff, full workflow)

**Alternatives Considered:**

- All integration tests against live APIs: slow, flaky, dependent on external state
- All unit tests with minimal integration: misses real-world behavior
- **Selected:** Tiered approach with Jest mocks + integration layer (industry standard)

### D5: Documentation Scope — 5 Files vs. Minimal Docs

**Decision:** Create **5 comprehensive documentation files** (ARCHITECTURE, DIAGRAMS, ROADMAP, STRATEGY, EXAMPLES) with 6+ Mermaid diagrams.

**Rationale:**

- Phase 1 experience shows comprehensive docs prevent "how do I use this?" friction
- Mermaid diagrams make workflows understandable to non-technical stakeholders
- Examples in 3 repository types (GitHub, WordPress plugin, WordPress theme) reduce integration time
- TEST_STRATEGY documentation enables future developers to extend test suite correctly
- ARCHITECTURE documentation justifies design decisions (D1-D4)

**Alternatives Considered:**

- Minimal README + inline code comments: faster to write but harder to onboard new developers
- Heavy docstrings in every function: tedious to maintain, less discoverable
- **Selected:** Structured documentation (proven ROI from Phase 1)

### D6: Provider Implementation — Separate Agent Files vs. Single Polymorphic Agent

**Decision:** Implement provider-specific agents as **separate files per provider** (claude/agent.md, copilot/agent.md, openai/agent.md) sharing a common core prompt.

**Rationale:**

- Provider-specific guardrails, tool definitions, and response formats differ significantly
- Separate files enable isolated testing and debugging per provider
- Shared core prompt (shared/core-prompt.md) ensures consistent methodology
- Easier for future developers to understand provider-specific behavior
- Aligns with LightSpeed portable agent pattern (multi-file with provider subdirectories)

**Alternatives Considered:**

- Single polymorphic agent with conditional logic: harder to test, less clear
- Complete code duplication per provider: maintainability nightmare
- **Selected:** Separate files + shared core prompt (best balance)

## Risks / Trade-offs

### Risk 1: Agent Complexity Growing Beyond Scope

**Risk:** As skills accumulate, agent orchestration logic becomes complicated; hard to test and extend.

**Mitigation:**

- Keep orchestrator logic minimal (just research → planner sequencing)
- Delegate complexity to skills (clear contracts between skills)
- Unit test each skill independently
- Integration tests validate orchestrator + skills together

### Risk 2: Test Coverage Falls Below 80% Target

**Risk:** Writing 70+ tests with CI/CD constraints could slow velocity; coverage goals at risk.

**Mitigation:**

- Set Jest thresholds in Week 4 (fail CI if <80%)
- Prioritize unit tests first (faster, more maintainable)
- Track coverage weekly and identify gaps early
- Use mocks aggressively (faster tests = higher throughput)

### Risk 3: Documentation Drift from Implementation

**Risk:** As code evolves, docs become stale; examples fail; diagrams inaccurate.

**Mitigation:**

- Write docs during Weeks 5-6 (after implementation stable)
- Reference actual code in examples (copy-paste from working scripts)
- Validate diagrams against implementation before publishing
- Create validation tests for example code (Week 5)

### Risk 4: Provider-Specific Tests Create Maintenance Burden

**Risk:** Testing all 3 providers (Claude, Copilot, OpenAI) = 3x test effort; hard to maintain.

**Mitigation:**

- Use shared test fixtures for all providers (github-repo-context.json, etc.)
- Provider-agnostic tests in shared/tests/
- Provider-specific tests only for behavior that differs
- Prioritize Claude (primary), defer deep Copilot/OpenAI tests to Phase 3

### Risk 5: Node.js Version Incompatibility Blocks CI

**Risk:** CI environment running Node 20, but dependencies require Node 22+. Blocks all Phase 2 work.

**Mitigation:**

- Coordinate with repo maintainers to update CI runners before Phase 2 starts (Aug 19)
- If unresolved, use Node 22-compatible dependencies only
- Set node version in .nvmrc for local development

## Migration Plan

**Phase 2 → Phase 3 Transition:**

1. **Week 6 (Sep 23-30):** Merge Phase 2 PR to `develop`; keep `.github/agents/` alive for backward compatibility
2. **Phase 3 (Oct 1+):** Gradually migrate consumers from `.github/agents/` to new portable agents
3. **Deprecation Path:** Add warnings to old agents pointing to new agents
4. **Full Cutover:** Remove `.github/agents/` versions after Phase 3 validation completes (or keep for compatibility indefinitely)

**Rollback Strategy:**

- If Phase 2 agents fail critical tests → Keep using `.github/agents/` originals
- If provider integration breaks → Fall back to Claude provider only until fixed
- If test coverage drops below 75% → Pause feature work until coverage restored

## Open Questions

1. **Gemini Support Timeline:** Should Phase 2 include minimal Gemini support, or defer to Phase 3? (Decided: Phase 3 experimental)
2. **WordPress Block Context Depth:** How deeply should agents understand block.json, attributes, and component patterns? (Decided: Strategic validation, not code generation)
3. **Error Recovery:** When researcher agent hits ambiguity, should planner agent ask clarifying questions or generate partial plans? (Decided: Phase 3 feature)
4. **Multi-Language Support:** Should agents work with non-English codebases? (Decided: Phase 3 research)

---

**Status:** Draft (ready for review and acceptance)  
**Next Artifact:** tasks (GitHub issues for implementation work)

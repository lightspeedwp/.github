---
file_type: project-plan
title: Phase 2 — Portable Task Planning Agents Implementation
description: Detailed implementation roadmap for agents, skills, scripts, and comprehensive documentation
version: 1.0.0
status: planning
last_updated: 2026-08-12
---

# Phase 2: Implementation Plan

**Phase 1 Status:** ✅ Complete (Specification PR #1803 ready for merge)  
**Phase 2 Duration:** 5-6 weeks (2026-08-19 → 2026-09-30)  
**Start Date:** 2026-08-19 (estimated, after Phase 1 merge)  
**Lead:** ashleyshaw (Initiative Lead, Agent Developer, Skills Developer, Test Lead, Documentation Lead)

---

## Executive Summary

Phase 2 implements the complete portable task planning agent system across two agents (Task Researcher, Task Planner) with 5 core skills, 4 support scripts, comprehensive test coverage (80%+), and 5 documentation files. The implementation follows a phased approach with clear dependencies and weekly deliverables.

**Key Outcomes:**

- ✅ Two multi-file portable agents (separate folders: `agents/task-researcher-agent/`, `agents/task-planner-agent/`)
- ✅ Provider-specific implementations (Claude, Copilot, OpenAI)
- ✅ 5 agent-attached skills with full documentation
- ✅ 4 support scripts with Jest test suite (80%+ coverage)
- ✅ 5 comprehensive documentation files with 6+ Mermaid diagrams
- ✅ Full integration testing across all repository types

---

## Weekly Breakdown (5-6 Weeks)

### Week 1: Agent Framework & Provider Setup (Aug 19-25)

**Deliverables:**

- Task Researcher Agent core structure (AGENT.md, shared/core-prompt.md)
- Provider implementations (claude/agent.md, copilot/agent.md, openai/agent.md)
- Task Planner Agent core structure (parallel to researcher)
- Manifests and validation structure

**Tasks:**

1. Create `agents/task-researcher-agent/AGENT.md` with metadata and entry points
2. Create `agents/task-researcher-agent/shared/core-prompt.md` (provider-agnostic)
3. Implement Claude provider: `claude/agent.md` + `tools.json`
4. Implement Copilot provider: `copilot/agent.md` + `skills.yaml`
5. Implement OpenAI provider: `openai/agent.md` + `tools.json`
6. Create parallel structure for Task Planner Agent
7. Create validation manifests: validation-summary.json, skills.md, skills.csv, consistency.json

**Success Criteria:**

- ✅ Both agents have AGENT.md with correct metadata
- ✅ All 3 provider subdirectories created and populated
- ✅ Core prompt is provider-agnostic and reusable
- ✅ Manifests generated and validated

**Testing:**

- Unit tests for agent metadata parsing (5 tests)
- Provider-specific configuration validation (3 tests)

---

### Week 2: Researcher Agent Skills (Aug 26-Sep 1)

**Deliverables:**

- 4 agent-attached skills for Task Researcher Agent
- Skill documentation and contracts
- Unit tests for each skill

**Tasks:**

1. Implement `repository-analyzer/SKILL.md` (code audit capability)
2. Implement `constraint-extraction/SKILL.md` (identify scope boundaries)
3. Implement `context-mapping/SKILL.md` (repository → planning context)
4. Implement `research-synthesis/SKILL.md` (aggregate findings → report)
5. Create skill contracts and expected outputs
6. Write unit tests for each skill (4 skills × 5 tests = 20 tests)
7. Create test fixtures (github-repo-context.json, wp-plugin-context.json, wp-theme-context.json)

**Success Criteria:**

- ✅ All 4 skills have SKILL.md with clear contracts
- ✅ Skill inputs/outputs match schema definitions
- ✅ Unit tests pass (20 tests, 85%+ coverage for this component)
- ✅ Test fixtures cover all 3 repository types

**Testing:**

- Unit tests per skill (5 each, 20 total)
- Schema validation tests (4 tests)

---

### Week 3: Planner Agent Skills (Sep 2-8)

**Deliverables:**

- 3+ agent-attached skills for Task Planner Agent
- Integration test for research → planner handoff
- Full test suite for planning flow

**Tasks:**

1. Implement `planning-engine/SKILL.md` (research → task plan synthesis)
2. Implement `scope-validator/SKILL.md` (plan feasibility check)
3. Implement `dependency-analyzer/SKILL.md` (identify task dependencies, critical path)
4. Create integration tests for researcher → planner handoff (5 tests)
5. Create integration tests for full planning flow (3 tests)
6. Test coverage for all planner skills (15+ unit tests)

**Success Criteria:**

- ✅ All 3 planner skills implemented with contracts
- ✅ Handoff from researcher agent works correctly
- ✅ Full planning flow tested end-to-end
- ✅ Unit + integration tests pass (35+ total tests, 80%+ coverage)

**Testing:**

- Unit tests per skill (5 each, 15 total)
- Integration tests for handoff (5 tests)
- Full workflow tests (3 tests)

---

### Week 4: Support Scripts & Testing Infrastructure (Sep 9-15)

**Deliverables:**

- 4 support scripts with full documentation
- Jest configuration and test infrastructure
- 50+ unit tests with coverage reporting

**Tasks:**

1. Implement `analyze-repo-context.js` (extract repo metadata, config, dependencies)
2. Implement `generate-task-plan.js` (synthesize research into phased plan)
3. Implement `validate-coding-standards.js` (check ESLint, Jest, Markdown, YAML compliance)
4. Implement `coordinate-agent-flow.js` (orchestrate researcher → planner → validation)
5. Create Jest configuration (jest.config.js, coverage thresholds)
6. Create unit tests for each script (50+ tests total)
7. Create mocks for GitHub API, file system, Git operations
8. Generate coverage reports

**Success Criteria:**

- ✅ All 4 scripts fully functional with error handling
- ✅ Jest configuration enforces 80%+ coverage
- ✅ Mock patterns work for CI/CD environments
- ✅ Coverage reports generated and tracked

**Testing:**

- Unit tests per script (12+ each, 50+ total)
- Mock validation tests (10 tests)
- CI integration tests (5 tests)

---

### Week 5: Documentation & Integration (Sep 16-22)

**Deliverables:**

- 5 comprehensive documentation files (1,500+ lines)
- 6+ Mermaid diagrams with accessibility compliance
- Integration tests across all repository types

**Tasks:**

1. Write `ARCHITECTURE.md` (agent design, parameter mapping, integration points)
2. Write `MERMAID_DIAGRAMS.md` (6 diagrams with explanations: decision flow, data flow, repo-type branching, integration, skills, testing)
3. Write `IMPLEMENTATION_ROADMAP.md` (this document + additional phase details)
4. Write `TEST_STRATEGY.md` (Jest patterns, mocking, coverage strategy, CI integration)
5. Write `EXAMPLES.md` (usage: GitHub control plane, WordPress plugin, WordPress theme, full workflow)
6. Create integration tests across all repository types (6 tests)
7. Validate documentation against schema

**Success Criteria:**

- ✅ All 5 documentation files complete and reviewed
- ✅ 6+ Mermaid diagrams pass WCAG 2.2 AA contrast validation
- ✅ Documentation accurately reflects implementation
- ✅ Integration tests pass for all repository types

**Testing:**

- Documentation validation (5 tests)
- Mermaid diagram rendering (6 tests)
- Integration tests for all repo types (6 tests)

---

### Week 6: Final Validation & Merge Prep (Sep 23-30)

**Deliverables:**

- Full test suite passing (80%+ coverage)
- CI/CD pipeline green
- Code review complete
- Ready for Phase 3 (validation & refinement)

**Tasks:**

1. Run full test suite (70+ tests total)
2. Generate final coverage reports
3. Validate all schemas and manifests
4. Code review by secondary reviewer
5. Update CHANGELOG with Phase 2 completion
6. Create Phase 3 epic and issues (validation, integration, refinement)
7. Prepare PR #1804 (Phase 2 Implementation)

**Success Criteria:**

- ✅ All tests pass (70+ tests, 80%+ coverage)
- ✅ CI pipeline green across all checks
- ✅ Code review approved
- ✅ Documentation complete and validated
- ✅ Ready for Phase 3

**Testing:**

- Full suite execution (70+ tests)
- Coverage report validation
- Schema validation (10 tests)
- Documentation validation (5 tests)

---

## Dependencies & Critical Path

```
Week 1: Agent Framework
    ↓
Week 2: Researcher Skills ←─ (depends on Week 1 framework)
    ↓
Week 3: Planner Skills ←─ (depends on Weeks 1-2, especially researcher skills)
    ↓
Week 4: Support Scripts ←─ (depends on Week 1 framework, can start mid-Week 2)
    ↓
Week 5: Documentation ←─ (depends on all implementation weeks, can start Week 3)
    ↓
Week 6: Final Validation ←─ (depends on all previous weeks)
```

**Critical Path:**

1. Agent Framework (Week 1) — blocks everything
2. Researcher Skills (Week 2) — blocks planner skills
3. Planner Skills (Week 3) — blocks integration tests
4. Documentation (Week 5) — can overlap with implementation

**Opportunities for Parallelization:**

- Support scripts (Week 4) can start in Week 2 after framework is set
- Documentation research (Week 5) can start in Week 3
- Early integration tests (Week 5) can start in Week 3 after researcher skills

---

## Resource Allocation

**All roles assigned to: ashleyshaw**

| Role | Weeks | Focus Areas |
|------|-------|-------------|
| Initiative Lead | 1-6 | Planning, coordination, decision-making, risk mitigation |
| Agent Developer | 1-3, 5 | Agent implementations, provider integration, documentation |
| Skills Developer | 2-4, 5 | Skill implementations, testing patterns, examples |
| Test Lead | 2-6 | Test infrastructure, Jest config, coverage, CI integration |
| Documentation Lead | 3-6 | Technical writing, diagrams, examples, accessibility compliance |

**Suggested Team Expansion (Phase 2B, optional):**

- Secondary reviewer for code review (Week 6)
- Documentation editor for final polish (Week 5-6)
- Test automation specialist for CI/CD optimization (Week 4-5)

---

## Risk Mitigation

### Risk 1: Agent Implementation Complexity

**Probability:** Medium | **Impact:** High  
**Mitigation:**

- Start with provider-agnostic core (shared/core-prompt.md) before provider-specific code
- Create test fixtures early (Week 2) to validate contracts
- Use incremental provider rollout: Claude first, then Copilot, then OpenAI

### Risk 2: Test Coverage Shortfall

**Probability:** Low | **Impact:** Medium  
**Mitigation:**

- Set Jest coverage thresholds in Week 4 (enforce 80%+)
- Track coverage daily and identify gaps weekly
- Prioritize unit tests over E2E tests (faster, more reliable)

### Risk 3: Documentation Drift

**Probability:** Medium | **Impact:** Low  
**Mitigation:**

- Document as you code (Week 2-5 parallel)
- Use examples directly from working code
- Validate diagrams against implementation (Week 5)

### Risk 4: Dependency Issues in CI

**Probability:** Low | **Impact:** High  
**Mitigation:**

- Resolve Node.js version incompatibility before Phase 2 starts (coordinate with repo maintainers)
- Lock package versions early (Week 1)
- Test CI pipeline incrementally (Week 2, 4, 6)

### Risk 5: Scope Creep

**Probability:** Medium | **Impact:** Medium  
**Mitigation:**

- Lock deliverables in Phase 1 spec (done ✅)
- Defer Phase 3 enhancements (validation, refinement) to Phase 3
- Use Phase 2B for optional team expansion and optimization

---

## Success Metrics & Validation Criteria

### Quantitative Metrics

- ✅ **70+ tests passing** (unit + integration + schema validation)
- ✅ **80%+ code coverage** (scripts, skills, agent logic)
- ✅ **6+ Mermaid diagrams** (all WCAG 2.2 AA compliant)
- ✅ **5 documentation files** (1,500+ lines total)
- ✅ **2 portable agents** (Task Researcher, Task Planner)
- ✅ **5 core skills** (all tested, documented, portable)
- ✅ **4 support scripts** (all tested, integrated, CI-ready)
- ✅ **3 provider implementations** (Claude, Copilot, OpenAI)
- ✅ **3 repository types** (GitHub, WordPress plugin, WordPress theme)

### Qualitative Criteria

- ✅ **Architecture clarity** — Design decisions documented and justified
- ✅ **Code maintainability** — Clear patterns, well-organized, easy to extend
- ✅ **Documentation completeness** — All features, patterns, and examples covered
- ✅ **Test reliability** — Tests stable, mocks accurate, no flaky tests
- ✅ **Accessibility** — All diagrams meet WCAG 2.2 AA standards
- ✅ **Portability** — Agents work across GitHub, WP plugin, WP theme contexts

### Validation Approach

1. **Code Review** — Secondary reviewer approves implementation
2. **Test Validation** — All tests pass, coverage ≥80%
3. **Documentation Review** — Peer review of accuracy and clarity
4. **Integration Testing** — Full workflow tests for all repository types
5. **CI/CD Green** — All automated checks pass in GitHub Actions

---

## 17 GitHub Issues (Outline)

### Epic (1 issue)

**#1816: Phase 2 — Portable Task Planning Agents Implementation**

- Covers all implementation work for both agents
- Links to 16 component tasks
- 5-6 week timeline, all repository types

### Component Tasks (16 issues)

#### Agent Framework (3 issues)

**#1817: Task Researcher Agent — Core Framework**

- AGENT.md with metadata
- Shared core prompt (provider-agnostic)
- Manifests setup

**#1818: Task Planner Agent — Core Framework**

- AGENT.md with metadata
- Shared core prompt (provider-agnostic)
- Manifests setup

**#1819: Provider-Specific Implementations (Claude, Copilot, OpenAI)**

- Claude: agent.md + tools.json
- Copilot: agent.md + skills.yaml
- OpenAI: agent.md + tools.json

#### Researcher Agent Skills (2 issues)

**#1820: Researcher Agent Skills (Part 1) — Repository Analyzer & Constraint Extraction**

- repository-analyzer/SKILL.md (code audit)
- constraint-extraction/SKILL.md (scope boundaries)
- Unit tests (10 tests)

**#1821: Researcher Agent Skills (Part 2) — Context Mapping & Research Synthesis**

- context-mapping/SKILL.md (repo → planning context)
- research-synthesis/SKILL.md (findings → report)
- Unit tests (10 tests)
- Integration tests for full research flow

#### Planner Agent Skills (2 issues)

**#1822: Planner Agent Skills (Part 1) — Planning Engine & Scope Validator**

- planning-engine/SKILL.md (research → task plan)
- scope-validator/SKILL.md (plan feasibility)
- Unit tests (10 tests)

**#1823: Planner Agent Skills (Part 2) — Dependency Analyzer & Integration**

- dependency-analyzer/SKILL.md (task dependencies, critical path)
- Integration tests for researcher → planner handoff (5 tests)
- Full workflow tests (3 tests)

#### Support Scripts & Testing (2 issues)

**#1824: Support Scripts (Part 1) — Repository Analysis & Task Planning**

- analyze-repo-context.js (repo metadata extraction)
- generate-task-plan.js (research → phased plan)
- Unit tests (20 tests)
- Test fixtures for all repository types

**#1825: Support Scripts (Part 2) — Standards Validation & Orchestration**

- validate-coding-standards.js (ESLint, Jest, Markdown, YAML compliance)
- coordinate-agent-flow.js (researcher → planner → validation orchestration)
- Jest configuration with coverage thresholds (80%+)
- Mocks for GitHub API, file system, Git operations

#### Documentation (4 issues)

**#1826: Documentation (Part 1) — Architecture & Design Decisions**

- ARCHITECTURE.md (agent design, parameter mapping, integration points)
- IMPLEMENTATION_ROADMAP.md (detailed phase breakdown)
- 2 Mermaid diagrams (decision flow, data flow)

**#1827: Documentation (Part 2) — Diagrams & Testing Strategy**

- MERMAID_DIAGRAMS.md (4+ remaining diagrams: repo-type branching, integration, skills, testing)
- TEST_STRATEGY.md (Jest patterns, mocking, coverage, CI integration)

**#1828: Documentation (Part 3) — Examples & Usage Guide**

- EXAMPLES.md (GitHub control plane, WordPress plugin, WordPress theme, full workflow)
- Repository-type configuration examples
- Error handling patterns

**#1829: Documentation (Part 4) — Integration Testing & Validation**

- Integration tests across all repository types (6 tests)
- Schema validation (10 tests)
- Documentation validation (5 tests)
- Final review and accessibility compliance

#### Final Validation (1 issue)

**#1830: Phase 2 Final Validation & Merge Preparation**

- Full test suite execution (70+ tests)
- Coverage report validation (80%+)
- CI/CD pipeline green check
- Code review approval
- CHANGELOG update
- Create Phase 3 epic and issues

---

## Related Documentation

- **Phase 1 Specification:** [CLARIFYING_QUESTIONS_AND_ANSWERS.md](./CLARIFYING_QUESTIONS_AND_ANSWERS.md)
- **Project Overview:** [README.md](./README.md)
- **Architectural Decisions:** Phase 1 Q&As (6 decisions documented)

---

## Next Steps (Phase 2 Kick-Off)

1. ✅ Create 17 GitHub issues (1 epic + 16 component tasks)
2. ✅ Link all issues to this Implementation Plan (bidirectional references)
3. ✅ Update project README with "Related Issues" section
4. ✅ Begin Week 1: Agent Framework development
5. ⏳ Track progress weekly against timeline and success metrics

---

**Plan Status:** ✅ Complete  
**Last Updated:** 2026-08-12  
**Next Review:** After Phase 1 PR #1803 merges (estimated 2026-08-19)

# Portable Task Planning Agents — Specification & Design (Phase 1)

**Initiative:** Organisation-wide task planning and research agents for GitHub control plane, WordPress block plugins, and WordPress block themes.

**Start Date:** 2026-08-12  
**Status:** ✅ Specification Phase (Phase 1)  
**Branch:** `design/portable-task-planning-agents-specification`

---

## Project Overview

This project redesigns and consolidates task planning capabilities across LightSpeedWP repositories. Currently, `.github/agents/task-planner.agent.md` and `.github/agents/task-researcher.agent.md` are control-plane specific. This initiative creates **portable, reusable agents** that work across:

- **GitHub Control Plane** (LightSpeed `.github` repository)
- **WordPress Block Plugins** (plugin development)
- **WordPress Block Themes** (theme development)

### Key Goals

1. ✅ **Unified Agent Architecture** — One set of agents that adapt to different repository types
2. ✅ **Portable Implementation** — Multi-file agents in root `agents/` folder (not `.github/agents/`)
3. ✅ **Full Documentation** — Comprehensive guides with mermaid diagrams and examples
4. ✅ **Test Coverage** — Unit, integration, and agent behavior tests
5. ✅ **Best Practices** — Answer clarifying questions with industry standards

---

## Clarifying Questions & Answers

**Location:** [CLARIFYING_QUESTIONS_AND_ANSWERS.md](./CLARIFYING_QUESTIONS_AND_ANSWERS.md)

Six key architectural decisions with best practice answers:

1. **Agent Architecture** — Unified vs. separate agents
2. **WordPress Block Context** — What governs task scoping in WordPress projects
3. **Agent Implementation** — Spec-based vs. multi-file portable
4. **Testing & Scripts** — Framework choice and test scope
5. **Scope & Timeline** — Phase 1 deliverables and ownership
6. **Documentation** — Diagram types and coverage

---

## Deliverables

### Phase 1: Specification & Design (Current)

- ✅ Clarifying questions answered with best practices
- ✅ Agent architecture decision documented
- ✅ Repository-type parameter mapping defined
- ✅ Test strategy and framework selection
- ✅ Implementation roadmap with phases
- ✅ Comprehensive documentation spec with mermaid diagrams

**Expected:** PR with specification documents + implementation plan

### Phase 2: Implementation (Planned)

- Multi-file agent implementations (root `agents/`)
- Support scripts with full test coverage
- Mermaid diagrams for all workflows
- Integration with existing skills and MCP servers

### Phase 3: Validation & Integration (Planned)

- Integration tests across repository types
- Agent behavior validation
- Documentation review and refinement
- Merge to `develop`

---

## Related Issues & PR

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1815](https://github.com/lightspeedwp/.github/issues/1815) | epic | Phase 1: Task Planning Agents — Specification & Design | 🟢 In Progress |
| [#1803](https://github.com/lightspeedwp/.github/pull/1803) | pull request | Phase 1 Specification PR | 🟡 Awaiting Review |
| TBD | epic | Phase 2: Task Planning Agents — Implementation | 🟡 To Create |
| TBD | feature | Task Planner Agent Implementation | 🟡 To Create (Phase 2) |
| TBD | feature | Task Researcher Agent Implementation | 🟡 To Create (Phase 2) |
| TBD | task | Agent Documentation & Mermaid Diagrams | 🟡 To Create (Phase 2) |
| TBD | task | Test Suite Development | 🟡 To Create (Phase 2) |

---

## Key Documents

- **[CLARIFYING_QUESTIONS_AND_ANSWERS.md](./CLARIFYING_QUESTIONS_AND_ANSWERS.md)** — Architectural decisions with best practice rationale
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — (TBD) Agent design, parameter mapping, integration points
- **[IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)** — (TBD) Phase-by-phase breakdown with deliverables
- **[TEST_STRATEGY.md](./TEST_STRATEGY.md)** — (TBD) Test framework, coverage targets, integration approach

---

## Repository Structure (Post-Implementation)

```
agents/
├── task-planner-agent/               # Main agent folder
│   ├── task-planner.agent.md          # Agent spec & role definition
│   ├── skills/                        # Agent-specific skills
│   │   ├── repository-analyzer.skill.md
│   │   ├── planning-engine.skill.md
│   │   └── scope-validator.skill.md
│   ├── schemas/                       # Input/output JSON schemas
│   │   ├── task-plan-output.schema.json
│   │   └── repository-context.schema.json
│   ├── scripts/                       # Support scripts
│   │   ├── analyze-repo-context.js
│   │   ├── generate-task-plan.js
│   │   └── tests/
│   │       ├── analyze-repo-context.test.js
│   │       └── integration.test.js
│   └── docs/                          # Implementation guide
│       ├── README.md
│       └── MERMAID_DIAGRAMS.md
│
└── task-researcher-agent/
    ├── task-researcher.agent.md
    ├── skills/
    ├── schemas/
    ├── scripts/
    └── docs/
```

---

## Architecture Decision Summary

**Selected Approach:**

- ✅ **One unified agent** that accepts `repositoryType` parameter
- ✅ **Multi-file portable implementation** in root `agents/` folder
- ✅ **Parameter-driven adaptation** (labels, branch rules, standards)
- ✅ **Jest + integration tests** with 80%+ coverage
- ✅ **Phase 1:** Specification only (implementation in Phase 2)
- ✅ **Documentation:** Agent flows, data flow, repo-type branching, integration points

See [CLARIFYING_QUESTIONS_AND_ANSWERS.md](./CLARIFYING_QUESTIONS_AND_ANSWERS.md) for detailed rationale.

---

## Next Steps

1. ✅ Review clarifying questions and best practice answers
2. ✅ Create GitHub issue #1815 for Phase 1 epic
3. ✅ Create GitHub PR #1803 with specification documents
4. ✅ Link PR and issue together (bidirectional reference)
5. ⬜ Review and merge PR #1803 to `develop`
6. ⬜ Create 17 Phase 2 GitHub issues (1 epic + 16 component tasks)
7. ⬜ Begin Phase 2 implementation (5-6 week timeline)

---

## Documentation & Communication

**OpenSpec Reference:** This project follows LightSpeed's Portable Task Planning Agents openspec.

**GitHub References:**

- **Epic Issue:** [#1815](https://github.com/lightspeedwp/.github/issues/1815)
- **Specification PR:** [#1803](https://github.com/lightspeedwp/.github/pull/1803)
- **Active Project:** [.github/projects/active/portable-task-planning-agents-2026-08-12/](./)

---

**Maintainers:** ashleyshaw (Initiative Lead, Agent Developer, Skills Developer, Test Lead, Documentation Lead)  
**Last Updated:** 2026-08-12 11:57 CEST  
**Project Link:** `.github/projects/active/portable-task-planning-agents-2026-08-12/`

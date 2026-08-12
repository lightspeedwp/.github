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

### Phase 1 (Specification)

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1815](https://github.com/lightspeedwp/.github/issues/1815) | epic | Phase 1: Task Planning Agents — Specification & Design | 🟢 In Progress |
| [#1803](https://github.com/lightspeedwp/.github/pull/1803) | pull request | Phase 1 Specification PR | 🟡 Awaiting Review |

### Phase 2 (Implementation)

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1838](https://github.com/lightspeedwp/.github/issues/1838) | epic | Phase 2: Task Planning Agents — Implementation | 🟡 Ready for Implementation |
| [#1839](https://github.com/lightspeedwp/.github/issues/1839) | feature | Task Researcher Agent — Core Framework | 🟡 Week 1 |
| [#1840](https://github.com/lightspeedwp/.github/issues/1840) | feature | Task Planner Agent — Core Framework | 🟡 Week 1 |
| [#1841](https://github.com/lightspeedwp/.github/issues/1841) | feature | Provider-Specific Implementations | 🟡 Week 1 |
| [#1842-#1843](https://github.com/lightspeedwp/.github/issues?q=is:open+label:area:ai+number:1842) | feature | Researcher Agent Skills | 🟡 Week 2-3 |
| [#1844-#1845](https://github.com/lightspeedwp/.github/issues?q=is:open+label:area:ai+number:1844) | feature | Planner Agent Skills | 🟡 Week 3 |
| [#1846-#1847](https://github.com/lightspeedwp/.github/issues?q=is:open+label:area:ai+number:1846) | feature | Support Scripts & Testing | 🟡 Week 4 |
| [#1848-#1851](https://github.com/lightspeedwp/.github/issues?q=is:open+label:area:ai+number:1848) | task | Documentation (4 parts) | 🟡 Week 5-6 |

---

## Key Documents

### Phase 1: Specification (Complete)

- **[CLARIFYING_QUESTIONS_AND_ANSWERS.md](./CLARIFYING_QUESTIONS_AND_ANSWERS.md)** — ✅ 6 architectural decisions with best practice rationale (6 Q&As, 6 Mermaid diagrams)
- **[PHASE_2_IMPLEMENTATION_PLAN.md](./PHASE_2_IMPLEMENTATION_PLAN.md)** — ✅ Detailed implementation roadmap (5-6 weeks, 17 GitHub issues)

### Phase 1: OpenSpec Artifacts

- **[OPENSPEC_PROPOSAL.md](./OPENSPEC_PROPOSAL.md)** — ✅ Proposal document (WHY: motivation, scope, capabilities, impact, success criteria)
- **[OPENSPEC_DESIGN.md](./OPENSPEC_DESIGN.md)** — ✅ Design document (HOW: goals, decisions with alternatives, risks/mitigations, migration plan)

**Canonical Location:** `.github/projects/active/openspec/changes/phase-2-task-planning-agents-implementation/` (proposal.md and design.md)

### Phase 2: Implementation Documentation (Planned)

- **ARCHITECTURE.md** — Agent design, parameter mapping, integration points
- **MERMAID_DIAGRAMS.md** — 6 workflow diagrams with accessibility compliance
- **IMPLEMENTATION_ROADMAP.md** — Detailed phase breakdown with deliverables
- **TEST_STRATEGY.md** — Jest patterns, mocking strategies, coverage enforcement
- **EXAMPLES.md** — Usage examples for all repository types

---

## Repository Structure (Post-Implementation)

```
agents/task-planner-agent/
├── AGENT.md                            # Root agent spec with metadata
├── README.md                            # User documentation
├── shared/
│   └── core-prompt.md                  # Provider-agnostic methodology
├── claude/
│   ├── agent.md                        # Claude guardrails + tools.json
│   └── tools.json
├── copilot/
│   ├── agent.md                        # Copilot chat format + skills.yaml
│   └── skills.yaml
├── openai/
│   ├── agent.md                        # OpenAI functions + tools.json
│   └── tools.json
├── skills/agent-attached/
│   ├── repository-analyzer/SKILL.md
│   ├── standards-validator/SKILL.md
│   ├── report-generator/SKILL.md
│   ├── planning-engine/SKILL.md
│   └── scope-validator/SKILL.md
├── schemas/
│   ├── task-plan-output.schema.json
│   ├── repository-context.schema.json
│   └── research-report.schema.json
├── scripts/
│   ├── analyze-repo-context.js
│   ├── generate-task-plan.js
│   ├── validate-coding-standards.js
│   ├── coordinate-agent-flow.js
│   └── tests/
│       ├── unit/
│       ├── integration/
│       ├── fixtures/
│       └── mocks/
├── docs/
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── MERMAID_DIAGRAMS.md
│   ├── IMPLEMENTATION_ROADMAP.md
│   ├── TEST_STRATEGY.md
│   └── EXAMPLES.md
└── manifests/
    ├── validation-summary.json
    ├── skills.md
    ├── skills.csv
    └── consistency.json
```

**Parallel Structure:** `agents/task-researcher-agent/` (same pattern as planner)

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
5. ✅ Create OpenSpec proposal and design documents
6. ✅ Create 17 Phase 2 GitHub issues (1 epic #1838 + 14 component tasks #1839-#1851)
7. ⬜ Review and merge PR #1803 to `develop` (pending CI checks)
8. ⬜ Begin Phase 2 implementation (5-6 week timeline, starting ~2026-08-19)

---

## Documentation & Communication

### OpenSpec Specification

This project is formally specified using the OpenSpec framework:

- **Proposal:** [OPENSPEC_PROPOSAL.md](./OPENSPEC_PROPOSAL.md) — Phase 2 motivation, scope, capabilities, impact
- **Design:** [OPENSPEC_DESIGN.md](./OPENSPEC_DESIGN.md) — Phase 2 goals, decisions (6 major architectural decisions), risks, migration plan
- **Canonical Location:** `.github/projects/active/openspec/changes/phase-2-task-planning-agents-implementation/`

### GitHub References

**Phase 1 (Specification):**

- **Epic Issue:** [#1815](https://github.com/lightspeedwp/.github/issues/1815)
- **Specification PR:** [#1803](https://github.com/lightspeedwp/.github/pull/1803)

**Phase 2 (Implementation):**

- **Epic Issue:** [#1838](https://github.com/lightspeedwp/.github/issues/1838) — Phase 2: Portable Task Planning Agents — Implementation
- **Component Tasks:** [#1839-#1851](https://github.com/lightspeedwp/.github/issues?q=is:open+label:area:ai+number:1839) (14 tasks for agents, skills, scripts, docs)

### Project Structure

- **Active Project Folder:** `.github/projects/active/portable-task-planning-agents-2026-08-12/`
- **Phase 1 Documents:** CLARIFYING_QUESTIONS_AND_ANSWERS.md, PHASE_2_IMPLEMENTATION_PLAN.md
- **OpenSpec Artifacts:** OPENSPEC_PROPOSAL.md, OPENSPEC_DESIGN.md

---

**Maintainers:** ashleyshaw (Initiative Lead, Agent Developer, Skills Developer, Test Lead, Documentation Lead)  
**Last Updated:** 2026-08-12  
**Status:** Phase 1 Complete; Phase 2 Ready for Implementation (17 GitHub issues created)

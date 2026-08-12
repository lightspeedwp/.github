# PR Creation Agent — Phase 2: Specification & Planning

**Project Status:** 🟢 Active — Specification Phase  
**Start Date:** 2026-08-12  
**Phase Timeline:** 2026-08-16 → 2026-08-20  
**Phase Type:** Specification, Architecture & Planning  
**Scope:** Comprehensive specification for portable PR creation agent

---

## 🔗 GitHub Tracking

| Item | Link | Status |
|------|------|--------|
| **Phase 2 Issue** | [#1813](https://github.com/lightspeedwp/.github/issues/1813) | 🟡 Pending |
| **Phase 1 PR** | [#1827 — Design Phase](https://github.com/lightspeedwp/.github/pull/1827) | ✅ Approved |
| **Phase 1 Issue** | [#1812 — Design Initiative](https://github.com/lightspeedwp/.github/issues/1812) | ✅ Complete |
| **Parent Epic** | [#1722 — Repository Restructuring](https://github.com/lightspeedwp/.github/issues/1722) | 🟢 Open |

---

## 📋 Phase 2 Deliverables

### Core Specification Documents

1. **OPENSPEC.md** (This Phase)
   - Formal specification with implementation plan
   - Agent architecture & skill interfaces
   - WordPress compatibility analysis
   - Deployment strategy

2. **ARCHITECTURE.md**
   - Multi-file agent structure
   - Skill interface contracts
   - Integration patterns
   - Data flow diagrams (Mermaid)

3. **TEST_STRATEGY.md**
   - Comprehensive testing plan
   - Unit test coverage: 95%+
   - Integration tests (mock + real GitHub API)
   - E2E workflows
   - Test data & fixtures

4. **DOCUMENTATION_PLAN.md**
   - API documentation structure
   - Deployment guides per repo type
   - Troubleshooting guide framework
   - Mermaid diagram specifications

5. **WORDPRESS_COMPATIBILITY.md**
   - WordPress plugin repo adaptations
   - WordPress theme repo adaptations
   - Configuration differences
   - Shared vs. plugin-specific skills

6. **DEPLOYMENT_PLAN.md**
   - Target repos (GitHub control plane + 8–12 WordPress repos)
   - Installation checklist
   - Configuration templates
   - Rollout sequence

---

## 🎯 Strategic Approach

### Single Portable Agent
- **One codebase** for all repos (GitHub control plane + WordPress plugins/themes)
- **Configuration-driven** differences via `.claude/pr-agent.config.yml`
- **Optional hooks** for WordPress-specific customization
- **Skill composition** allows enabling/disabling WordPress-specific skills per repo

### Test Strategy
- **Unit Tests:** 95%+ coverage (all skills independently tested)
- **Integration Tests:** Mock GitHub API + real repo E2E
- **Coverage:** Core agent logic, skill interfaces, configuration loading
- **No dependencies:** Tests live in documentation project folder only

### Documentation Scope
- **API Reference:** Skill interfaces, agent contracts, configuration schema
- **Deployment Guides:** Per-repo type (GitHub vs WordPress plugin vs WordPress theme)
- **Troubleshooting:** Common issues, debug modes, rollback procedures
- **Architecture Diagrams:** Mermaid (workflows, state machines, integrations)

---

## 📊 Phase Breakdown

### Week 1 (Aug 16–18)
- ✅ OpenSpec with implementation details
- ✅ WordPress compatibility analysis
- ✅ Deployment & test strategy

### Week 2 (Aug 19–20)
- ✅ Architecture documentation
- ✅ Skill interface specifications
- ✅ Documentation templates & examples

---

## 🔑 Key Design Decisions (Carried Forward from Phase 1)

| Decision | Final Answer |
|----------|--------------|
| **Agent Tier** | Multi-file agent (not spec-based) |
| **Autonomy** | Level 2: Create + Commit + PR |
| **Skills** | Skill-delegating: 4 existing + 6 new |
| **Integration** | Full governance stack |
| **Portability** | One agent, config-driven per repo |
| **Test Coverage** | 95%+ for core logic |
| **Test Approach** | Mock + real GitHub API |
| **Target Repos** | GitHub + 8–12 WordPress repos |

---

## 📁 Project Files

- **[OPENSPEC.md](./OPENSPEC.md)** — Formal specification (in progress)
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Agent structure & integrations (planned)
- **[TEST_STRATEGY.md](./TEST_STRATEGY.md)** — Testing & coverage plan (planned)
- **[DOCUMENTATION_PLAN.md](./DOCUMENTATION_PLAN.md)** — Documentation strategy (planned)
- **[WORDPRESS_COMPATIBILITY.md](./WORDPRESS_COMPATIBILITY.md)** — WordPress adaptations (planned)
- **[DEPLOYMENT_PLAN.md](./DEPLOYMENT_PLAN.md)** — Installation & rollout (planned)

---

## 🎓 Reference Documents

### Phase 1 Deliverables
- [OPENSPEC.md (Phase 1)](https://github.com/lightspeedwp/.github/blob/pr-creation-agent-design/.github/projects/active/pr-creation-agent-design-2026-08-12/OPENSPEC.md)
- [DESIGN_QUESTIONS.md (Phase 1)](https://github.com/lightspeedwp/.github/blob/pr-creation-agent-design/.github/projects/active/pr-creation-agent-design-2026-08-12/DESIGN_QUESTIONS.md)

### Related Specifications
- [BRANCHING_STRATEGY.md](../../../docs/BRANCHING_STRATEGY.md) — Branch naming rules
- [LABELING.md](../../../docs/LABELING.md) — Label strategy
- [CLAUDE.md](../../../CLAUDE.md) — Repository governance

---

## ✅ Success Criteria

- ✅ Complete OpenSpec with implementation details
- ✅ WordPress compatibility analysis & strategy
- ✅ Comprehensive test strategy (95%+ coverage)
- ✅ All skill interfaces specified with contracts
- ✅ Deployment plan for all target repos
- ✅ Architecture diagrams (Mermaid) for key workflows
- ✅ Documentation templates ready for Phase 3

---

## 📝 Notes

- **Documentation Only:** All files in this project folder are documentation & planning
- **No Code:** No package.json, dependencies, or implementation code
- **Specification-Driven:** Phase 3 implementation will follow these specifications
- **WordPress Support:** Single portable agent with WordPress-specific configuration & optional skills

---

**Phase 1 Complete:** 2026-08-12  
**Phase 2 In Progress:** 2026-08-16 → 2026-08-20  
**Phase 3 Implementation:** 2026-08-20 → 2026-09-02  
**Phase 4 GA & Rollout:** 2026-09-02 → 2026-09-09

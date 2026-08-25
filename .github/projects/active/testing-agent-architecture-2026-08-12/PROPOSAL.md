---
title: "Proposal: Testing Agent Multi-Framework Architecture"
description: "Consolidate LightSpeed testing frameworks into a unified, multi-framework agent"
status: "proposal"
created_date: "2026-08-12"
version: "1.0.0"
---

# Proposal: Testing Agent Multi-Framework Architecture

## Problem Statement

LightSpeed's testing infrastructure is currently **fragmented across multiple isolated frameworks**:

- **Jest**: Handled by isolated agent in `agents/playwright-testing-agent/` (misnamed)
- **PHPUnit**: No dedicated agent; teams implement ad-hoc solutions
- **pytest**: No dedicated agent; scattered across CI/CD workflows
- **Playwright**: Embedded in the Jest agent; not independently usable

**Key Issues:**

1. **Duplicate effort**: Teams reinvent test coordination and mocking patterns
2. **Inconsistent standards**: No unified coverage thresholds, output formats, or documentation
3. **Limited scope**: The "playwright-testing-agent" focuses only on E2E; other frameworks ignored
4. **Scalability problem**: Adding a new framework requires parallel work, not leveraging existing patterns
5. **Documentation debt**: No comprehensive guides for WordPress integration with any framework

**Impact**: Teams spend 5-10 hours per framework learning patterns, implementing mocking, and configuring CI/CD instead of writing tests.

---

## Proposed Solution

### Overview

Consolidate testing frameworks into a **unified, multi-framework testing agent** that:

- Supports **all 4 frameworks** (Jest, PHPUnit, pytest, Playwright) with equal priority
- Implements a **2-tier architecture**: thin control-plane coordinator + portable orchestrator
- Provides **WordPress-specific integration patterns** for each framework
- Includes **comprehensive documentation** (guides, skills, provider configs)
- Maintains **differentiated coverage thresholds** (85% plugins, 80% themes, 75% control-plane, 70% E2E)

### Key Decisions

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Consolidation** | Rename `agents/playwright-testing-agent/` → `agents/testing-agent/` | Reuse excellent scaffolding; avoid creating new agent |
| **Scope** | All LightSpeed repositories | Org-wide consistency; justifiable investment |
| **Architecture** | 2-tier with clear delegation | Control-plane coordinates; portable agent executes |
| **Frameworks** | All 4: Jest, PHPUnit, pytest, Playwright | Complete coverage across all project types |
| **Documentation** | Comprehensive (guides + skills + configs) | Enable rapid adoption; reduce learning curve |
| **Coverage Model** | Differentiated by project type | Balance rigor with pragmatism |

---

## Scope Decisions (Q&A Format)

### Q1: Repository Scope

**Question:** Which repositories should use the testing agent?

**Answer:** **All LightSpeed repositories**

- Block plugins: Jest + PHPUnit
- Block themes: Jest + PHPUnit
- Control-plane: Jest + pytest
- Utilities/CI: pytest
- E2E validation: Playwright (all projects)

**Rationale:** Org-wide consistency; agent is portable and reusable; investment justified across entire portfolio.

---

### Q2: Framework Coverage & WordPress Integration

**Question:** What WordPress-specific integrations are needed?

**Answer:** **All integrations for each framework**

| Framework | Integration |
|-----------|-------------|
| **Jest** | REST API mocking, block utilities, action/filter testing, async handling |
| **PHPUnit** | Globals mocking, database ops, WPCS validation, multi-version testing |
| **pytest** | GitHub Actions integration, artifact handling, log parsing, metrics |
| **Playwright** | Multi-browser, accessibility, stateful testing, WooCommerce patterns |

**Rationale:** Real-world testing requires framework-specific WordPress patterns; guidance reduces bugs.

---

### Q3: Coverage Thresholds

**Question:** What coverage targets apply to each project type?

**Answer:** **Differentiated by risk and project type**

| Framework | Control-Plane | Block Plugins | Block Themes | E2E |
|-----------|---|---|---|---|
| **Jest** | 80% | 85% | 80% | 70% |
| **PHPUnit** | N/A | 85% | 80% | 70% |
| **pytest** | 75% | N/A | N/A | 70% |
| **Playwright** | N/A | 70% | 70% | 70% |

**Rationale:** Plugins carry more risk (production dependencies); themes less so. Control-plane tested via integration tests + E2E.

---

### Q4: Documentation & Skills

**Question:** What documentation and skills are required?

**Answer:** **Complete: guides + skills + provider configs**

- **Framework guides**: 900+ words each (Jest, PHPUnit, pytest, Playwright)
- **Framework skills**: SKILL.md with 5+ examples per framework
- **Provider configs**: Claude, Copilot, OpenAI (all 4 frameworks per provider)
- **Architecture diagrams**: 8+ Mermaid visuals
- **Total**: 3,000+ words of documentation

**Rationale:** Comprehensive guidance accelerates adoption; skills enable agent reuse across providers.

---

### Q5: Testing & Rollout Strategy

**Question:** How should agents be tested before release?

**Answer:** **Three-level testing + staged rollout**

| Level | Target | Coverage |
|-------|--------|----------|
| **Unit** | Framework skills, selection logic | 80%+ |
| **Integration** | Agent coordination, multi-framework scenarios | 50%+ |
| **E2E** | Real projects (plugins, themes, utilities, sites) | 70%+ critical path |

**Rationale:** Three-level approach catches bugs at each integration point; real-project E2E validates in production contexts.

---

## Implementation Approach

### 2-Tier Architecture

```
Control-Plane (.github/agents/testing.agent.md)
    ↓ delegates to ↓
Portable Agent (agents/testing-agent/)
    ├─ Jest Provider
    ├─ PHPUnit Provider
    ├─ pytest Provider
    └─ Playwright Provider
```

**Why 2-tier?**

1. **Separation of concerns**: Control-plane handles coordination; portable agent handles execution
2. **Portability**: Portable agent installable in other LightSpeed projects without .github dependency
3. **Maintainability**: Clear interface between layers; easier to evolve independently

---

## Implementation Timeline

| Phase | Duration | Focus | Status |
|-------|----------|-------|--------|
| **Phase 1** | 6-14h | Planning, design, architecture | 🟡 In Progress |
| **Phase 2** | 27-35h | Portable agent expansion (all 4 frameworks) | 🔲 Planned |
| **Phase 3** | 5-7h | Control-plane agent rewrite | 🔲 Planned |
| **Phase 4** | 16-23h | Testing, validation, rollout | 🔲 Planned |
| **Total** | **54-79h** | **Full implementation** | **~2 weeks** |

---

## Success Metrics

### Quantitative

- ✓ 4 frameworks supported with equal priority
- ✓ 80%+ unit test coverage
- ✓ 50%+ integration test coverage
- ✓ 70%+ E2E critical path coverage
- ✓ 3,000+ words of documentation
- ✓ 8+ architecture diagrams
- ✓ 0 breaking changes to existing testing flows

### Qualitative

- ✓ New teams can set up multi-framework testing in <1 hour
- ✓ Documentation answers 90%+ of "how do I test X with Y?" questions
- ✓ Framework selection is transparent (clear delegation protocol)
- ✓ All 3 providers (Claude, Copilot, OpenAI) are fully functional

---

## Risk Assessment

### Risk 1: Directory Rename Breaks Imports

**Severity:** High | **Probability:** Low

- **Mitigation:** CI validation ensures all imports work before merge
- **Fallback:** Revert commit; rename carefully with script

### Risk 2: Multi-Framework Prompt Becomes Unmaintainable

**Severity:** Medium | **Probability:** Medium

- **Mitigation:** Start with clear framework selection logic; use subsections
- **Fallback:** Split into framework-specific prompts if needed

### Risk 3: Control-Plane Coordination is Complex

**Severity:** Medium | **Probability:** Low

- **Mitigation:** Design coordination protocol upfront; validate via integration tests
- **Fallback:** Use synchronous delegation pattern

### Risk 4: E2E Tests Require Infrastructure

**Severity:** Low | **Probability:** Medium

- **Mitigation:** Use existing block plugin/theme test environments
- **Fallback:** Mock WordPress instances for testing

---

## Decision Gate

### Approval Required From

- [x] Architecture: 2-tier design approved
- [x] Scope: 4 frameworks + all repos approved
- [x] Timeline: 54-79 hours / ~2 weeks acceptable
- [x] Documentation: 3,000+ words / 8+ diagrams adequate

### Next Steps

1. ✅ Complete Phase 1 planning (this document)
2. ⏳ Merge to develop
3. ⏳ Create GitHub issues for Phase 2-4 tasks
4. ⏳ Begin Phase 2: Portable agent expansion

---

## References

- **Design Document:** [DESIGN.md](./DESIGN.md)
- **Task Breakdown:** [TASKS.md](./TASKS.md)
- **Implementation Plan:** [PROJECT_PLAN.md](./PROJECT_PLAN.md)
- **Test Strategy:** [TEST_STRATEGY.md](./TEST_STRATEGY.md)
- **Documentation Plan:** [DOCUMENTATION_PLAN.md](./DOCUMENTATION_PLAN.md)
- **Architecture Diagrams:** [MERMAID_DIAGRAMS.md](./MERMAID_DIAGRAMS.md)
- **GitHub Epic:** [#1799](https://github.com/lightspeedwp/.github/issues/1799)

---

*Part of LightSpeed's broader testing infrastructure modernization initiative.*

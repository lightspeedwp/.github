---
title: "Testing Agent Multi-Framework Architecture"
description: "Consolidate LightSpeed testing infrastructure into unified multi-framework agent"
status: proposal
priority: high
created_date: "2026-08-12"
last_updated: "2026-08-12"
version: "1.0.0"
authors: ["Ash Shaw"]
tags: ["testing", "agents", "jest", "phpunit", "pytest", "playwright"]
---

# Testing Agent Multi-Framework Architecture

## Overview

Consolidate LightSpeed's testing infrastructure from a fragmented playwright-focused agent into a comprehensive, multi-framework testing agent supporting Jest, PHPUnit, pytest, and Playwright — with clear 2-tier delegation between the .github control plane and org-wide repositories.

## Quick Links

### Specification Documents
- **Proposal:** [proposal.md](./proposal.md)
- **Design:** [design.md](./design.md)
- **Tasks:** [tasks.md](./tasks.md)

### Related GitHub Issues & PRs
- **Master Issue:** [#1799](https://github.com/lightspeedwp/.github/issues/1799) — Planning coordination
- **Planning PR:** [#1797](https://github.com/lightspeedwp/.github/pull/1797) — Planning documentation (✅ merged)
- **OpenSpec Issue:** [#1825](https://github.com/lightspeedwp/.github/issues/1825) — This specification
- **OpenSpec PR:** [#1824](https://github.com/lightspeedwp/.github/pull/1824) — This specification review

## Key Decision

**Rename `agents/playwright-testing-agent/` → `agents/testing-agent/`** to consolidate all testing frameworks in one portable agent, rather than creating separate agents for each framework.

## Scope

| Aspect | Decision |
|--------|----------|
| **Repository Scope** | All LightSpeed repositories (themes, plugins, utilities) |
| **Frameworks** | Jest, PHPUnit, pytest, Playwright (all 4) |
| **Coverage Thresholds** | 85% (plugins), 80% (themes), 75% (control-plane), 70% (E2E) |
| **Architecture** | 2-tier: Control-plane coordinator + Portable orchestrator |
| **Documentation** | Comprehensive (guides, skills, provider configs) |

## Status

- ✅ **Phase 1** — Design & Planning (Complete)
  - Planning docs merged in [PR #1797](https://github.com/lightspeedwp/.github/pull/1797)
  - Master issue [#1799](https://github.com/lightspeedwp/.github/issues/1799) created
  - OpenSpec issue [#1825](https://github.com/lightspeedwp/.github/issues/1825) created
  - OpenSpec PR [#1824](https://github.com/lightspeedwp/.github/pull/1824) under review
  
- 🟡 **Phase 2** — Portable Agent Expansion (Planned)
  - Rename directory structure
  - Create framework-specific skills
  - Enhance core prompt with multi-framework support
  
- 🔲 **Phase 3** — Control-Plane Agent Rewrite (Planned)
  - Rewrite .github testing agent as coordinator
  - Create workflow examples
  
- 🔲 **Phase 4** — Testing & Validation (Planned)
  - Unit + Integration + E2E testing
  - Full documentation

## Architecture

```
Control-Plane (.github/agents/testing.agent.md)
  ↓ delegates to ↓
Portable Agent (agents/testing-agent/)
  ├─ Jest Provider (JavaScript/TypeScript)
  ├─ PHPUnit Provider (PHP)
  ├─ pytest Provider (Python)
  └─ Playwright Provider (Browser E2E)
```

## Timeline

- **Phase 1:** 6-14 hours (✅ Complete)
- **Phase 2:** 27-35 hours (Est. 1 week)
- **Phase 3:** 5-7 hours (Est. 1 day)
- **Phase 4:** 16-23 hours (Est. 1.5 weeks)

**Total:** 54-79 hours (~2 weeks)

## Success Criteria

- [x] Phase 1 planning complete
- [ ] All Phase 2-4 tasks have GitHub issues
- [ ] Phase 2 implementation starts
- [ ] All framework skills created
- [ ] All framework guides complete
- [ ] Provider configs updated
- [ ] .github agent rewritten
- [ ] Tests pass (unit + integration + E2E)
- [ ] Documentation complete
- [ ] PR merged to develop
- [ ] Portable agent released

---

*Part of the broader LightSpeed testing infrastructure modernization initiative.*

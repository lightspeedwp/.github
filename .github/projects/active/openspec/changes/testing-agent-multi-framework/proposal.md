---
title: "Proposal: Testing Agent Multi-Framework Architecture"
description: "Consolidate testing frameworks into one unified, portable agent"
status: proposal
created_date: "2026-08-12"
last_updated: "2026-08-12"
version: "1.0.0"
---

# Proposal: Testing Agent Multi-Framework Architecture

## Problem Statement

### Current State

1. **Playwright agent exists** (`agents/playwright-testing-agent/`)
   - Well-structured, purpose-built for WordPress/WooCommerce E2E testing
   - Excellent scaffolding (multi-provider support, skills, manifests)
   - **Problem:** Scoped only to Playwright, E2E testing

2. **Control-plane testing agent exists** (`.github/agents/testing.agent.md`)
   - Lists Jest, PHPUnit, pytest support
   - **Problem:** Lacks framework-specific guidance and WordPress integration

3. **Framework fragmentation**
   - Jest testing guidance scattered
   - PHPUnit testing incomplete (no WordPress-specific patterns)
   - pytest rarely used, minimal patterns
   - **Problem:** Inconsistent testing practices across org

### Root Causes

- Testing infrastructure evolved ad-hoc (E2E first, then control-plane)
- No unified framework selection strategy
- Underutilized existing agent scaffolding (Playwright agent)
- WordPress-specific testing patterns not standardized

## Solution

### Core Recommendation

**Rename and expand** `agents/playwright-testing-agent/` → `agents/testing-agent/`

Transform from Playwright-only to comprehensive multi-framework orchestrator:
- **Jest** — JavaScript/TypeScript unit testing
- **PHPUnit** — PHP unit testing
- **pytest** — Python testing
- **Playwright** — Browser E2E testing

### Architecture: 2-Tier Model

**Tier 1: Control-Plane Coordinator** (`.github/agents/testing.agent.md`)
- Focuses on testing .github infrastructure itself
- Handles light validation (workflow YAML, script compliance)
- Delegates all actual test execution to portable agent

**Tier 2: Portable Orchestrator** (`agents/testing-agent/`)
- Multi-framework test execution
- WordPress-specific patterns for each framework
- Provider support (Claude, Copilot, OpenAI)
- Reusable across all LightSpeed repositories

### Why This Approach

✅ **Reuses existing structure** — Playwright agent has excellent scaffolding  
✅ **Single portable agent** — No duplication of multi-framework logic  
✅ **Clear responsibility** — .github agent coordinates, portable agent executes  
✅ **Org-wide consistency** — All repos use same testing patterns  
✅ **WordPress-integrated** — Each framework includes WordPress best practices  

## Scope & Decisions

### Q1: Repository Scope → **All LightSpeed repositories**
- Block themes, block plugins, utility repos, .github control plane
- Investment justifies org-wide consistency

### Q2: Framework Coverage → **All frameworks with WordPress integration**
- **Jest:** WordPress REST API mocking, block utilities, action/filter testing
- **PHPUnit:** WordPress globals, database mocking, WPCS validation, multi-version testing
- **pytest:** GitHub API integration, CI/CD log parsing, metrics generation
- **Playwright:** Multi-browser testing, accessibility, WordPress stateful testing

### Q3: Coverage Thresholds → **Differentiated by project type**
- **Plugins:** 85% (Jest), 85% (PHPUnit), 70% (Playwright)
- **Themes:** 80% (Jest), 80% (PHPUnit), 70% (Playwright)
- **Control-Plane:** 75% (Jest), N/A (PHPUnit), 75% (pytest)
- **E2E:** 70% (Playwright, all project types)

### Q4: Documentation & Skills → **Comprehensive**
- AGENT.md overview + framework-specific guides
- Skills for each framework (jest-wordpress-mocking, phpunit-globals, etc.)
- Provider-specific configs (Claude, Copilot, OpenAI)
- WordPress integration patterns for all frameworks

### Q5: Testing Strategy → **Unit + Integration + E2E**
- Unit tests for all new scripts
- Integration tests for agent coordination
- E2E tests for critical GitHub Actions workflows
- Full validation before release

## Implementation Phases

### Phase 1: Design & Planning (6-14 hours) ✅ **COMPLETE**
- Answer scope questions ✅
- Create implementation plan ✅
- Generate architecture diagrams ✅
- Planning PR merged ✅

### Phase 2: Portable Agent Expansion (27-35 hours)
- Rename directory structure
- Update AGENT.md with multi-framework metadata
- Enhance core prompt with framework guidance
- Create framework-specific skills (Jest, PHPUnit, pytest)
- Create framework-specific guides
- Update provider configs (Claude, Copilot, OpenAI)

### Phase 3: Control-Plane Agent Rewrite (5-7 hours)
- Rewrite .github agent as thin coordinator
- Create workflow examples
- Document delegation protocol

### Phase 4: Testing & Validation (16-23 hours)
- Unit tests for all components
- Integration tests for coordination
- E2E tests for GitHub Actions workflows
- Full documentation review
- Knowledge transfer

**Total: 54-79 hours (~2 weeks)**

## Success Criteria

- [ ] Phase 1 planning approved (governance)
- [ ] All Phase 2-4 tasks have GitHub issues
- [ ] Phase 2 implementation starts
- [ ] All framework skills created and documented
- [ ] All framework guides complete (Jest, PHPUnit, pytest, Playwright)
- [ ] Provider configs updated for all 3 providers
- [ ] .github agent rewritten with delegation focus
- [ ] Unit + Integration + E2E tests pass
- [ ] Documentation coverage 100% for all frameworks
- [ ] PR merged to develop
- [ ] Portable agent released with new version

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Scope creep | Medium | High | Clear phase boundaries, GitHub issues per phase |
| Framework expertise gaps | Medium | Medium | WordPress-specific documentation, skilled implementer |
| Provider compatibility | Low | Medium | Early testing with all 3 providers |
| Testing coverage | Low | High | Comprehensive test suite, CI validation |
| Adoption friction | Medium | Medium | Clear migration guide, team training |

## Next Steps

1. **Approval:** Confirm scope and timeline with team
2. **GitHub Issues:** Create issues for Phase 2-4 tasks
3. **Phase 2 Start:** Begin portable agent expansion
4. **Progress Tracking:** Update tracking issue weekly

---

## References

- **Master Issue:** [#1799](https://github.com/lightspeedwp/.github/issues/1799)
- **Planning PR:** [#1797](https://github.com/lightspeedwp/.github/pull/1797)
- **Planning Docs:** `.github/projects/active/testing-agent-multi-framework-2026-08-12/`

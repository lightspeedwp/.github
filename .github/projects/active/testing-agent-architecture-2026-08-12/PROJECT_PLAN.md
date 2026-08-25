# Project Plan — Testing Agent Architecture

## Overview

This document provides a detailed implementation plan for consolidating LightSpeed's testing infrastructure into a unified, multi-framework testing agent.

**Total Effort:** 54-79 hours (~2 weeks)  
**Start Date:** 2026-08-12  
**Target Completion:** 2026-08-26

## Phase Breakdown

### Phase 1: Planning & Design (6-14 hours)

**Status:** 🟡 In Progress  
**Deliverables:** Architecture plan, test strategy, documentation plan

#### 1.1: Architecture Definition (2-3 hours)

- Define 2-tier delegation model
- Create architecture diagrams (Mermaid)
- Document control-plane vs. portable responsibilities
- Define framework selection logic

#### 1.2: Test Strategy Design (2-3 hours)

- Define unit test requirements for all frameworks
- Define integration test scenarios
- Define E2E test coverage
- Document test artifact locations

#### 1.3: Documentation Plan (2-3 hours)

- Plan framework guides (Jest, PHPUnit, pytest, Playwright)
- Plan architecture documentation
- Plan skill documentation
- Plan examples and references

#### 1.4: Risk Assessment (1-2 hours)

- Identify implementation risks
- Plan mitigation strategies
- Document rollback procedures
- Identify blockers and dependencies

**Acceptance:** All 4 documents complete, diagrams generated, no open design questions

---

### Phase 2: Portable Agent Expansion (27-35 hours)

**Status:** 🔲 Not Started  
**Deliverables:** Expanded `agents/testing-agent/` with all 4 frameworks

#### 2.1: Directory Rename (1-2 hours)

```bash
git mv agents/playwright-testing-agent/ agents/testing-agent/
```

- Update all references in scripts, docs, README
- Update git symlinks in openspec/ if needed
- Verify CLI still works
- Update CHANGELOG.md

**Dependencies:** None  
**Acceptance:** All references updated, CLI works, no broken links

#### 2.2: Update AGENT.md Metadata (1-2 hours)

- Title: "Playwright Testing Agent" → "Testing Agent"
- Description: Multi-framework support
- Add capabilities: `jest-testing`, `phpunit-testing`, `pytest-testing`
- Version: 2.2.0
- Update frontmatter with all 4 frameworks

**Dependencies:** 2.1  
**Acceptance:** All 4 frameworks listed, version bumped, capabilities added

#### 2.3: Enhance Core Prompt (3-4 hours)

Update `shared/core-prompt.md` with:

- Jest + WordPress patterns (API mocking, blocks, actions/filters)
- PHPUnit + WordPress patterns (globals, WPCS, multi-version)
- pytest + CI patterns (GitHub Actions, artifacts, metrics)
- Keep existing Playwright patterns
- Add framework selection logic

**Target:** 500+ new lines  
**Dependencies:** 2.2  
**Acceptance:** All 4 frameworks covered, integration patterns documented

#### 2.4: Create Framework Skills (6-8 hours)

**2.4.1: Jest Skill (2 hours)**

- `skills/jest-wordpress-testing/SKILL.md`
- REST API mocking patterns
- Block utilities testing
- Action/filter testing
- Async WordPress handling
- 5+ working examples

**2.4.2: PHPUnit Skill (2 hours)**

- `skills/phpunit-wordpress-testing/SKILL.md`
- Globals mocking patterns
- Database operation mocking
- WPCS compliance validation
- Multi-version testing
- 5+ working examples

**2.4.3: pytest Skill (1.5 hours)**

- `skills/pytest-ci-testing/SKILL.md`
- GitHub Actions integration
- CI artifact handling
- Log parsing patterns
- Metrics generation
- 4+ working examples

**2.4.4: Playwright Skill (2.5 hours)**

- Update/create `skills/playwright-testing/SKILL.md`
- Multi-browser testing setup
- Accessibility validation
- WordPress stateful testing
- WooCommerce patterns
- 6+ working examples

**Dependencies:** 2.3  
**Acceptance:** All 4 skills have complete SKILL.md, 20+ total examples

#### 2.5: Create Framework Guides (8-10 hours)

**2.5.1: Jest Guide (2.5 hours)**

- `guides/jest-wordpress-testing.md` or `.../jest-guide.md`
- API mocking (2KB)
- Block utilities testing (2KB)
- Action/filter testing (1.5KB)
- Common patterns & gotchas (1.5KB)
- Real-world examples (2KB)
- **Target:** 900+ words

**2.5.2: PHPUnit Guide (2.5 hours)**

- `guides/phpunit-wordpress-testing.md` or `.../phpunit-guide.md`
- Globals mocking (2KB)
- Database mocking (2KB)
- WPCS validation (1.5KB)
- Multi-version testing (1.5KB)
- Real-world examples (2KB)
- **Target:** 900+ words

**2.5.3: pytest Guide (2 hours)**

- `guides/pytest-ci-testing.md` or `.../pytest-guide.md`
- GitHub Actions integration (1.5KB)
- CI artifact handling (1.5KB)
- Log parsing & analysis (1.5KB)
- Metrics generation (1KB)
- Real-world examples (1.5KB)
- **Target:** 700+ words

**2.5.4: Playwright Guide Update (1.5 hours)**

- Update existing Playwright guide
- Add WordPress stateful testing (1.5KB)
- Add WooCommerce patterns (1KB)
- Add multi-browser testing (1KB)
- Add accessibility patterns (1KB)
- **Target:** 500+ new words

**Dependencies:** 2.4  
**Acceptance:** All 4 guides complete (3,000+ total words), examples included

#### 2.6: Update Provider Configs (2-3 hours)

**2.6.1: Claude Provider (1 hour)**

- Update `agents/testing-agent/claude/agent.md`
- Jest-specific instructions
- PHPUnit-specific instructions
- pytest-specific instructions
- Keep Playwright instructions
- Framework selection guidance

**2.6.2: Copilot Provider (1 hour)**

- Update `agents/testing-agent/copilot/agent.md`
- Same 4-framework coverage as Claude

**2.6.3: OpenAI Provider (1 hour)**

- Update `agents/testing-agent/openai/agent.md`
- Same 4-framework coverage as Claude

**Dependencies:** 2.5  
**Acceptance:** All 3 providers have 4-framework guidance

#### 2.7: Update Documentation (2-3 hours)

- README.md: Multi-framework overview
- ARCHITECTURE.md or similar: Architecture docs
- Framework feature matrix
- Version: 2.2.0
- CHANGELOG.md entry
- Skills directory index

**Dependencies:** 2.6  
**Acceptance:** README updated, architecture docs complete, 500+ new words

**Phase 2 Total:** 23-32 hours  
**Phase 2 Acceptance:** All 4 frameworks fully integrated, portable agent ready

---

### Phase 3: Control-Plane Agent Rewrite (5-7 hours)

**Status:** 🔲 Not Started  
**Deliverables:** Rewritten `.github/agents/testing.agent.md` with delegation protocol

#### 3.1: Rewrite .github Agent (3-4 hours)

- Remove direct test execution code
- Add delegation to portable agent
- Document delegation protocol
- Version: 0.2.0
- Update coordination examples
- Update CHANGELOG.md

**Dependencies:** Phase 2 complete  
**Acceptance:** Agent rewritten, delegation clear, no direct execution code

#### 3.2: Create Workflow Examples (2-3 hours)

- Example: Testing .github workflows
- Example: Testing control-plane scripts
- Example: Delegating to portable agent
- Example: Parsing results from portable agent
- Document in agent.md or separate guide
- Add to .github/workflows/ if production-ready

**Dependencies:** 3.1  
**Acceptance:** 3+ realistic examples, CI validation shown

**Phase 3 Total:** 5-7 hours  
**Phase 3 Acceptance:** Control-plane agent fully rewritten, delegation working

---

### Phase 4: Testing & Validation (16-23 hours)

**Status:** 🔲 Not Started  
**Deliverables:** Full test coverage, documentation validation, team training

#### 4.1: Unit Tests (2-3 hours)

- Jest skill tests (mock WordPress data)
- PHPUnit skill tests (mock WordPress globals)
- pytest skill tests (mock CI artifacts)
- Playwright skill tests (mock browsers)
- Framework selection logic tests
- Control-plane coordination tests
- **Target:** 80%+ coverage

**Dependencies:** Phase 2 complete  
**Acceptance:** All skills have unit tests, coverage ≥80%

#### 4.2: Integration Tests (4-6 hours)

- Jest + .github agent coordination
- PHPUnit + .github agent coordination
- pytest + .github agent coordination
- Playwright + .github agent coordination
- Multi-framework in same project
- Provider switching (Claude → Copilot)
- **Target:** 50%+ workflow coverage

**Dependencies:** Phase 3 complete  
**Acceptance:** All integrations tested, coordination validated

#### 4.3: E2E Tests (6-8 hours)

- Jest workflow on real block plugin
- PHPUnit workflow on real block theme
- pytest workflow on real utility repo
- Playwright workflow on test WordPress site
- .github agent on control-plane workflows
- GitHub Actions integration
- **Target:** 70%+ critical path coverage

**Dependencies:** Phase 3 complete  
**Acceptance:** All E2E tests pass, thresholds met

#### 4.4: Documentation & Knowledge Transfer (4-6 hours)

- Team training session (1-2 hours)
- Migration guide for existing teams (1-2 hours)
- Update org-wide testing standards (1 hour)
- Troubleshooting guide (1 hour)
- FAQ document (1 hour)
- Update AGENTS.md with info (1 hour)
- **Target:** Zero open questions

**Dependencies:** All phases complete  
**Acceptance:** All docs complete, team trained

**Phase 4 Total:** 16-23 hours  
**Phase 4 Acceptance:** All tests pass, documentation complete, team ready

---

## Timeline & Milestones

### Week 1 (Aug 12-18)

- **Aug 12-14** (3 days): Phase 1 planning complete
- **Aug 14-18** (4 days): Phase 2.1-2.4 (rename, metadata, prompt, skills)

### Week 2 (Aug 19-26)

- **Aug 19-23** (5 days): Phase 2.5-2.7 (guides, providers, docs) + Phase 3 (control-plane rewrite)
- **Aug 24-26** (2.5 days): Phase 4 (testing & validation)

**Completion Target:** 2026-08-26

---

## Dependencies & Critical Path

```
Phase 1 (Planning)
    ↓
Phase 2.1 (Rename)
    ↓
Phase 2.2 (AGENT.md)
    ↓
Phase 2.3 (Core Prompt)
    ↓
Phase 2.4-2.6 (Skills, Guides, Providers) — PARALLELIZE
    ↓
Phase 2.7 (Documentation)
    ↓
Phase 3 (Control-Plane Rewrite)
    ↓
Phase 4 (Testing & Validation)
```

**Critical Blockers:**

1. Phase 2.1 must complete before 2.2 (directory rename gates everything)
2. Phase 2 must complete before Phase 3 (portable agent needed for control-plane)
3. Phase 3 must complete before Phase 4 (coordination needed for testing)

**Parallelization Opportunities:**

- Phase 2.4 (skills) can run in parallel (Jest, PHPUnit, pytest, Playwright independent)
- Phase 2.5 (guides) can run in parallel after 2.4 starts
- Phase 2.6 (providers) can run in parallel after 2.5 starts

---

## Effort Estimation

| Phase | Low (h) | High (h) | Best (h) |
|-------|---------|----------|----------|
| 1.1 | 2 | 3 | 2.5 |
| 1.2 | 2 | 3 | 2.5 |
| 1.3 | 2 | 3 | 2.5 |
| 1.4 | 1 | 2 | 1.5 |
| **Phase 1** | **7** | **11** | **9** |
| 2.1 | 1 | 2 | 1.5 |
| 2.2 | 1 | 2 | 1.5 |
| 2.3 | 3 | 4 | 3.5 |
| 2.4 | 6 | 8 | 7 |
| 2.5 | 8 | 10 | 9 |
| 2.6 | 2 | 3 | 2.5 |
| 2.7 | 2 | 3 | 2.5 |
| **Phase 2** | **23** | **32** | **27.5** |
| 3.1 | 3 | 4 | 3.5 |
| 3.2 | 2 | 3 | 2.5 |
| **Phase 3** | **5** | **7** | **6** |
| 4.1 | 2 | 3 | 2.5 |
| 4.2 | 4 | 6 | 5 |
| 4.3 | 6 | 8 | 7 |
| 4.4 | 4 | 6 | 5 |
| **Phase 4** | **16** | **23** | **19.5** |
| **TOTAL** | **51** | **73** | **62** |

---

## GitHub Issues Mapping

Each task should have a corresponding issue:

```
Epic: Multi-Framework Testing Agent Architecture (#1826 proposed)
├── Phase 1: Planning (#1827)
│   ├── 1.1: Architecture Definition (#1827-a)
│   ├── 1.2: Test Strategy Design (#1827-b)
│   ├── 1.3: Documentation Plan (#1827-c)
│   └── 1.4: Risk Assessment (#1827-d)
├── Phase 2: Portable Agent (#1828)
│   ├── 2.1: Directory Rename (#1828-a)
│   ├── 2.2: AGENT.md Metadata (#1828-b)
│   ├── 2.3: Core Prompt Enhancement (#1828-c)
│   ├── 2.4: Framework Skills (#1828-d)
│   ├── 2.5: Framework Guides (#1828-e)
│   ├── 2.6: Provider Configs (#1828-f)
│   └── 2.7: Documentation (#1828-g)
├── Phase 3: Control-Plane (#1829)
│   ├── 3.1: Agent Rewrite (#1829-a)
│   └── 3.2: Workflow Examples (#1829-b)
└── Phase 4: Testing (#1830)
    ├── 4.1: Unit Tests (#1830-a)
    ├── 4.2: Integration Tests (#1830-b)
    ├── 4.3: E2E Tests (#1830-c)
    └── 4.4: Documentation & Training (#1830-d)
```

---

## Success Criteria

- ✅ Phase 1 planning complete with all documents
- ✅ Phase 2 portable agent expanded with 4 frameworks
- ✅ Phase 3 control-plane agent rewritten
- ✅ Phase 4 testing complete (80%+ unit, 50%+ integration, 70%+ E2E)
- ✅ All 4 framework guides complete (3,000+ words total)
- ✅ All provider configs updated (Claude, Copilot, OpenAI)
- ✅ Team trained and ready
- ✅ Documentation complete with Mermaid diagrams
- ✅ PR merged to develop
- ✅ Portable agent version 2.2.0 released

---

## Risk Management

### Technical Risks

**Risk 1: Directory rename breaks imports**

- *Mitigation:* CI validation ensures all imports work
- *Fallback:* Revert commit, rename carefully

**Risk 2: Multi-framework core prompt becomes unwieldy**

- *Mitigation:* Start with clear framework selection logic
- *Fallback:* Split into framework-specific prompts

**Risk 3: Control-plane agent coordination is complex**

- *Mitigation:* Design coordination protocol upfront
- *Fallback:* Use synchronous delegation pattern

### Schedule Risks

**Risk 1: Phase 2.4-2.5 takes longer than estimated**

- *Mitigation:* Start skills and guides in parallel
- *Fallback:* Reduce example count, keep core patterns

**Risk 2: E2E tests require infrastructure setup**

- *Mitigation:* Use existing block theme/plugin test environments
- *Fallback:* Use mocked WordPress instances

---

## Rollback Procedures

**If Phase 2 fails:**

```bash
git revert {commit}
# Restore agents/playwright-testing-agent/
```

**If Phase 3 fails:**

```bash
git revert {commit}
# Control-plane agent reverts to v0.1.0
```

**If tests fail in Phase 4:**

- Fix tests, don't revert
- Keep all agent changes, improve test coverage

---

## Related Documentation

- [README.md](./README.md) — Project overview and key decisions
- [TEST_STRATEGY.md](./TEST_STRATEGY.md) — Unit, integration, E2E testing plan
- [DOCUMENTATION_PLAN.md](./DOCUMENTATION_PLAN.md) — Guides, skills, provider configs
- [MERMAID_DIAGRAMS.md](./MERMAID_DIAGRAMS.md) — Architecture visuals

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

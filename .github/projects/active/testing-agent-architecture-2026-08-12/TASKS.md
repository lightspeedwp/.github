---
file_type: documentation
title: ""Tasks: Testing Agent Multi-Framework Architecture""
description: ""Implementation task breakdown for phases 2-4""
created_date: "2026-08-12"
last_updated: "2026-08-25"
status: active
---

# Tasks: Testing Agent Multi-Framework Architecture

## Phase 2: Portable Agent Expansion (27-35 hours)

### 2.1: Directory Rename (1-2 hours)

**Task:** Rename `agents/playwright-testing-agent/` → `agents/testing-agent/`

**Subtasks:**

- [ ] Execute directory rename via git mv
- [ ] Update all references in scripts (package.json, imports, etc.)
- [ ] Update git symlinks in openspec/ if needed
- [ ] Verify CLI still works with new path
- [ ] Update CHANGELOG.md with version bump to 2.2.0

**Definition of Done:**

- [x] All references updated
- [x] CLI works
- [x] No broken links
- [x] GitHub issue: #[Phase-2.1]

---

### 2.2: Update AGENT.md Metadata (1-2 hours)

**Task:** Update agent metadata to reflect multi-framework support

**Subtasks:**

- [ ] Change title: "Playwright Testing Agent" → "Testing Agent"
- [ ] Update description for multi-framework scope
- [ ] Add capabilities: `jest-testing`, `phpunit-testing`, `pytest-testing`
- [ ] Bump version to 2.2.0
- [ ] Update frontmatter with all 4 frameworks

**Definition of Done:**

- [x] All 4 frameworks listed in capabilities
- [x] Version bumped
- [x] Capabilities added
- [x] GitHub issue: #[Phase-2.2]

---

### 2.3: Enhance Core Prompt (3-4 hours)

**Task:** Add multi-framework support to core prompt

**Subtasks:**

- [ ] Review existing `shared/core-prompt.md`
- [ ] Add Jest + WordPress patterns (API mocking, blocks, hooks)
- [ ] Add PHPUnit + WordPress patterns (globals, database, WPCS)
- [ ] Add pytest + CI patterns (GitHub Actions, artifacts, metrics)
- [ ] Keep existing Playwright patterns
- [ ] Add framework selection logic

**Target:** 500+ new lines  
**Definition of Done:**

- [x] All 4 frameworks covered
- [x] Integration patterns documented
- [x] Framework selection logic clear
- [x] GitHub issue: #[Phase-2.3]

---

### 2.4: Create Framework Skills (6-8 hours)

#### 2.4.1: Jest Skill (2 hours)

- [ ] Create `skills/jest-wordpress-testing/SKILL.md`
- [ ] Add REST API mocking patterns
- [ ] Add block utilities testing patterns
- [ ] Add action/filter testing patterns
- [ ] Add async WordPress handling
- [ ] Include 5+ working examples

**Definition of Done:**

- [x] SKILL.md complete
- [x] 5+ examples included
- [x] GitHub issue: #[Phase-2.4.1]

#### 2.4.2: PHPUnit Skill (2 hours)

- [ ] Create `skills/phpunit-wordpress-testing/SKILL.md`
- [ ] Add WordPress globals mocking patterns
- [ ] Add database operation mocking
- [ ] Add WPCS compliance validation
- [ ] Add multi-version testing patterns
- [ ] Include 5+ working examples

**Definition of Done:**

- [x] SKILL.md complete
- [x] 5+ examples included
- [x] GitHub issue: #[Phase-2.4.2]

#### 2.4.3: pytest Skill (1.5 hours)

- [ ] Create `skills/pytest-ci-testing/SKILL.md`
- [ ] Add GitHub Actions integration patterns
- [ ] Add CI artifact handling
- [ ] Add log parsing patterns
- [ ] Add metrics generation patterns
- [ ] Include 4+ working examples

**Definition of Done:**

- [x] SKILL.md complete
- [x] 4+ examples included
- [x] GitHub issue: #[Phase-2.4.3]

#### 2.4.4: Playwright Skill (2.5 hours)

- [ ] Update/create `skills/playwright-testing/SKILL.md`
- [ ] Add multi-browser testing setup
- [ ] Add accessibility validation patterns
- [ ] Add WordPress stateful testing
- [ ] Add WooCommerce-specific patterns
- [ ] Include 6+ working examples

**Definition of Done:**

- [x] SKILL.md complete
- [x] 6+ examples included
- [x] GitHub issue: #[Phase-2.4.4]

**Overall 2.4 Definition of Done:**

- [x] All 4 skills have complete SKILL.md
- [x] 20+ total examples across all skills
- [x] GitHub epic issue: #[Phase-2.4]

---

### 2.5: Create Framework Guides (8-10 hours)

#### 2.5.1: Jest Guide (2.5 hours)

- [ ] Create `agents/testing-agent/guides/jest-wordpress-testing.md`
- [ ] API mocking section (2KB)
- [ ] Block utilities testing (2KB)
- [ ] Action/filter testing (1.5KB)
- [ ] Common patterns & gotchas (1.5KB)
- [ ] Real-world examples (2KB)

**Target:** 900+ words  
**Definition of Done:**

- [x] Guide complete with all sections
- [x] 900+ words
- [x] GitHub issue: #[Phase-2.5.1]

#### 2.5.2: PHPUnit Guide (2.5 hours)

- [ ] Create `agents/testing-agent/guides/phpunit-wordpress-testing.md`
- [ ] Globals mocking section (2KB)
- [ ] Database mocking (2KB)
- [ ] WPCS validation (1.5KB)
- [ ] Multi-version testing (1.5KB)
- [ ] Real-world examples (2KB)

**Target:** 900+ words  
**Definition of Done:**

- [x] Guide complete with all sections
- [x] 900+ words
- [x] GitHub issue: #[Phase-2.5.2]

#### 2.5.3: pytest Guide (2 hours)

- [ ] Create `agents/testing-agent/guides/pytest-ci-testing.md`
- [ ] GitHub Actions integration (1.5KB)
- [ ] CI artifact handling (1.5KB)
- [ ] Log parsing & analysis (1.5KB)
- [ ] Metrics generation (1KB)
- [ ] Real-world examples (1.5KB)

**Target:** 700+ words  
**Definition of Done:**

- [x] Guide complete with all sections
- [x] 700+ words
- [x] GitHub issue: #[Phase-2.5.3]

#### 2.5.4: Playwright Guide Update (1.5 hours)

- [ ] Update `agents/testing-agent/guides/playwright-testing.md`
- [ ] Add WordPress stateful testing section (1.5KB)
- [ ] Add WooCommerce patterns (1KB)
- [ ] Add multi-browser testing (1KB)
- [ ] Add accessibility patterns (1KB)
- [ ] Update all examples

**Target:** 500+ new words  
**Definition of Done:**

- [x] Guide updated with all sections
- [x] 500+ new words
- [x] GitHub issue: #[Phase-2.5.4]

**Overall 2.5 Definition of Done:**

- [x] All 4 guides complete
- [x] 3,000+ total words
- [x] All sections documented
- [x] GitHub epic issue: #[Phase-2.5]

---

### 2.6: Update Provider Configs (2-3 hours)

#### 2.6.1: Claude Provider (1 hour)

- [ ] Update `agents/testing-agent/claude/agent.md`
- [ ] Add Jest-specific instructions
- [ ] Add PHPUnit-specific instructions
- [ ] Add pytest-specific instructions
- [ ] Keep Playwright instructions
- [ ] Add framework selection logic

**Definition of Done:**

- [x] All 4 frameworks covered
- [x] GitHub issue: #[Phase-2.6.1]

#### 2.6.2: Copilot Provider (1 hour)

- [ ] Update `agents/testing-agent/copilot/agent.md`
- [ ] Same 4-framework coverage as Claude
- [ ] Copilot-specific formatting

**Definition of Done:**

- [x] All 4 frameworks covered
- [x] GitHub issue: #[Phase-2.6.2]

#### 2.6.3: OpenAI Provider (1 hour)

- [ ] Update `agents/testing-agent/openai/agent.md`
- [ ] Same 4-framework coverage as Claude
- [ ] OpenAI-specific formatting

**Definition of Done:**

- [x] All 4 frameworks covered
- [x] GitHub issue: #[Phase-2.6.3]

**Overall 2.6 Definition of Done:**

- [x] All 3 providers have 4-framework guidance
- [x] GitHub epic issue: #[Phase-2.6]

---

### 2.7: Update Documentation (2-3 hours)

**Task:** Update agent documentation

**Subtasks:**

- [ ] Update README.md with multi-framework overview
- [ ] Create/update ARCHITECTURE.md with architecture docs
- [ ] Add framework feature matrix
- [ ] Update version to 2.2.0
- [ ] Add CHANGELOG.md entry
- [ ] Update skills directory index

**Definition of Done:**

- [x] README updated
- [x] Architecture docs complete
- [x] 500+ new words
- [x] GitHub issue: #[Phase-2.7]

**Phase 2 Summary:**

- **Total Effort:** 23-32 hours
- **All 4 frameworks** fully integrated
- **Portable agent ready** for use
- **GitHub epic issue:** #[Phase-2]

---

## Phase 3: Control-Plane Agent Rewrite (5-7 hours)

### 3.1: Rewrite .github Agent (3-4 hours)

**Task:** Rewrite `.github/agents/testing.agent.md` as coordinator

**Subtasks:**

- [ ] Read current `.github/agents/testing.agent.md`
- [ ] Remove direct test execution capabilities
- [ ] Add delegation to portable agent
- [ ] Document delegation protocol
- [ ] Add coordination examples
- [ ] Update version to 0.2.0
- [ ] Update CHANGELOG.md

**Definition of Done:**

- [x] Agent rewritten
- [x] Delegation clear
- [x] No direct execution code
- [x] GitHub issue: #[Phase-3.1]

---

### 3.2: Create Workflow Examples (2-3 hours)

**Task:** Create examples of control-plane agent usage

**Subtasks:**

- [ ] Example: Testing .github workflows
- [ ] Example: Testing control-plane scripts
- [ ] Example: Delegating to portable agent
- [ ] Example: Parsing results from portable agent
- [ ] Document in agent.md or separate guide
- [ ] Add to .github/workflows/ if production-ready

**Definition of Done:**

- [x] 3+ realistic examples
- [x] CI validation shown
- [x] GitHub issue: #[Phase-3.2]

**Phase 3 Summary:**

- **Total Effort:** 5-7 hours
- **Control-plane agent** fully rewritten
- **Delegation working** end-to-end
- **GitHub epic issue:** #[Phase-3]

---

## Phase 4: Testing & Validation (16-23 hours)

### 4.1: Unit Tests (2-3 hours)

**Task:** Unit test all framework skills

**Subtasks:**

- [ ] Jest skill unit tests
- [ ] PHPUnit skill unit tests
- [ ] pytest skill unit tests
- [ ] Playwright skill unit tests
- [ ] Framework selection logic tests
- [ ] Control-plane coordination tests

**Target:** 80%+ coverage  
**Definition of Done:**

- [x] All skills have unit tests
- [x] Coverage ≥80%
- [x] GitHub issue: #[Phase-4.1]

---

### 4.2: Integration Tests (4-6 hours)

**Task:** Integration test agent coordination

**Subtasks:**

- [ ] Jest + .github agent coordination
- [ ] PHPUnit + .github agent coordination
- [ ] pytest + .github agent coordination
- [ ] Playwright + .github agent coordination
- [ ] Multi-framework in same project
- [ ] Provider switching (Claude → Copilot)

**Target:** 50%+ workflow coverage  
**Definition of Done:**

- [x] All integrations tested
- [x] Coordination validated
- [x] GitHub issue: #[Phase-4.2]

---

### 4.3: E2E Tests (6-8 hours)

**Task:** End-to-end testing with real projects

**Subtasks:**

- [ ] Jest workflow on real block plugin
- [ ] PHPUnit workflow on real block theme
- [ ] pytest workflow on real utility repo
- [ ] Playwright workflow on test WordPress site
- [ ] .github agent on control-plane workflows
- [ ] GitHub Actions integration

**Target:** 70%+ critical path coverage  
**Definition of Done:**

- [x] All E2E tests pass
- [x] Thresholds met
- [x] GitHub issue: #[Phase-4.3]

---

### 4.4: Documentation & Knowledge Transfer (4-6 hours)

**Task:** Documentation and team training

**Subtasks:**

- [ ] Team training session (1-2 hours)
- [ ] Migration guide for existing teams (1-2 hours)
- [ ] Update org-wide testing standards docs (1 hour)
- [ ] Troubleshooting guide (1 hour)
- [ ] FAQ document (1 hour)
- [ ] Update AGENTS.md with testing agent info (1 hour)

**Target:** Zero open questions  
**Definition of Done:**

- [x] All docs complete
- [x] Team trained
- [x] GitHub issue: #[Phase-4.4]

**Phase 4 Summary:**

- **Total Effort:** 16-23 hours
- **All tests passing** (unit, integration, E2E)
- **Documentation complete**
- **Team ready for rollout**
- **GitHub epic issue:** #[Phase-4]

---

## Overall Timeline

| Phase | Duration | Effort | Completion |
|-------|----------|--------|------------|
| Phase 1 | Complete | 6-14h | 2026-08-12 ✅ |
| Phase 2 | 1 week | 27-35h | 2026-08-19 |
| Phase 3 | 1 day | 5-7h | 2026-08-21 |
| Phase 4 | 1.5 weeks | 16-23h | 2026-08-26 |
| **Total** | **~2 weeks** | **54-79h** | **2026-08-26** |

---

## GitHub Issue Mapping

Each task should have a corresponding GitHub issue:

- **Epic:** #1799 (Master coordination)
- **Phase 1:** #[1800-1803] (Planning issues)
- **Phase 2:** #[1804-1810] (Agent expansion issues)
- **Phase 3:** #[1811-1812] (Control-plane issues)
- **Phase 4:** #[1813-1816] (Testing issues)

---

## Success Criteria Checklist

- [ ] Phase 1 planning complete (this document)
- [ ] Phase 2-4 tasks have GitHub issues
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

## References

- **Proposal:** [PROPOSAL.md](./PROPOSAL.md)
- **Design:** [DESIGN.md](./DESIGN.md)
- **Project Plan:** [PROJECT_PLAN.md](./PROJECT_PLAN.md)
- **Test Strategy:** [TEST_STRATEGY.md](./TEST_STRATEGY.md)
- **Master Issue:** [#1799](https://github.com/lightspeedwp/.github/issues/1799)

---

*Implementation task breakdown for Testing Agent Multi-Framework Architecture.*

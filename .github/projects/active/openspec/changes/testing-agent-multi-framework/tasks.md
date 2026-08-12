---
title: "Tasks: Testing Agent Multi-Framework Architecture"
description: "Implementation task breakdown for phases 2-4"
status: tasks
created_date: "2026-08-12"
last_updated: "2026-08-12"
version: "1.0.0"
---

# Tasks: Testing Agent Multi-Framework Architecture

## Phase 2: Portable Agent Expansion (27-35 hours)

### Phase 2.1: Directory Rename (1-2 hours)
- [ ] Rename `agents/playwright-testing-agent/` → `agents/testing-agent/`
- [ ] Update git symlink in `openspec/` if needed
- [ ] Verify all references in scripts/docs point to new location
- [ ] Test CLI still works with new path
- [ ] Create issue for tracking
- **Acceptance:** All references updated, CLI works, no broken links

### Phase 2.2: Update AGENT.md Metadata (1-2 hours)
- [ ] Update title: "Playwright Testing Agent" → "Testing Agent"
- [ ] Update description to reflect multi-framework scope
- [ ] Add capabilities: `jest-testing`, `phpunit-testing`, `pytest-testing`
- [ ] Update version to 2.2.0
- [ ] Update frontmatter with all 4 frameworks
- [ ] Create issue for tracking
- **Acceptance:** All 4 frameworks listed in capabilities, version bumped

### Phase 2.3: Enhance Core Prompt (3-4 hours)
- [ ] Read existing `shared/core-prompt.md`
- [ ] Add Jest + WordPress patterns section
- [ ] Add PHPUnit + WordPress patterns section
- [ ] Add pytest + CI patterns section
- [ ] Keep existing Playwright patterns
- [ ] Add framework selection logic
- [ ] Create issue for tracking
- **Acceptance:** All 4 frameworks have integration patterns, >500 lines added

### Phase 2.4: Create Framework Skills (6-8 hours)

#### 2.4.1: Jest Skill (2 hours)
- [ ] Create `skills/jest-wordpress-testing/SKILL.md`
- [ ] Add WordPress REST API mocking patterns
- [ ] Add block utilities testing patterns
- [ ] Add action/filter testing patterns
- [ ] Add async WordPress API handling
- [ ] Add examples and test cases
- [ ] Create issue for tracking
- **Acceptance:** SKILL.md complete, 5+ examples included

#### 2.4.2: PHPUnit Skill (2 hours)
- [ ] Create `skills/phpunit-wordpress-testing/SKILL.md`
- [ ] Add WordPress globals mocking patterns
- [ ] Add database operation mocking
- [ ] Add WPCS compliance validation
- [ ] Add multi-version testing patterns
- [ ] Add examples and test cases
- [ ] Create issue for tracking
- **Acceptance:** SKILL.md complete, 5+ examples included

#### 2.4.3: pytest Skill (1.5 hours)
- [ ] Create `skills/pytest-ci-testing/SKILL.md`
- [ ] Add GitHub Actions integration patterns
- [ ] Add CI artifact handling
- [ ] Add log parsing patterns
- [ ] Add metrics generation patterns
- [ ] Add examples and test cases
- [ ] Create issue for tracking
- **Acceptance:** SKILL.md complete, 4+ examples included

#### 2.4.4: Playwright Skill (2.5 hours)
- [ ] Update existing `skills/playwright-testing/SKILL.md` (or create if missing)
- [ ] Add multi-browser testing setup
- [ ] Add accessibility validation patterns
- [ ] Add WordPress stateful testing
- [ ] Add WooCommerce-specific patterns
- [ ] Add examples and test cases
- [ ] Create issue for tracking
- **Acceptance:** SKILL.md complete, 6+ examples included

### Phase 2.5: Create Framework Guides (8-10 hours)

#### 2.5.1: Jest Guide (2.5 hours)
- [ ] Create `agents/testing-agent/jest-guide.md`
- [ ] API mocking section (2KB)
- [ ] Block utilities testing (2KB)
- [ ] Action/filter testing (1.5KB)
- [ ] Common patterns & gotchas (1.5KB)
- [ ] Real-world examples (2KB)
- [ ] Create issue for tracking
- **Acceptance:** Guide complete, 900+ words

#### 2.5.2: PHPUnit Guide (2.5 hours)
- [ ] Create `agents/testing-agent/phpunit-guide.md`
- [ ] Globals mocking section (2KB)
- [ ] Database mocking (2KB)
- [ ] WPCS validation (1.5KB)
- [ ] Multi-version testing (1.5KB)
- [ ] Real-world examples (2KB)
- [ ] Create issue for tracking
- **Acceptance:** Guide complete, 900+ words

#### 2.5.3: pytest Guide (2 hours)
- [ ] Create `agents/testing-agent/pytest-guide.md`
- [ ] GitHub Actions integration (1.5KB)
- [ ] CI artifact handling (1.5KB)
- [ ] Log parsing & analysis (1.5KB)
- [ ] Metrics generation (1KB)
- [ ] Real-world examples (1.5KB)
- [ ] Create issue for tracking
- **Acceptance:** Guide complete, 700+ words

#### 2.5.4: Playwright Guide Update (1.5 hours)
- [ ] Review existing Playwright guide
- [ ] Add WordPress stateful testing section (1.5KB)
- [ ] Add WooCommerce patterns (1KB)
- [ ] Add multi-browser testing (1KB)
- [ ] Add accessibility patterns (1KB)
- [ ] Update examples
- [ ] Create issue for tracking
- **Acceptance:** Guide updated, 500+ new words

### Phase 2.6: Update Provider Configs (2-3 hours)

#### 2.6.1: Claude Provider (1 hour)
- [ ] Update `claude/agent.md`
- [ ] Add Jest-specific instructions
- [ ] Add PHPUnit-specific instructions
- [ ] Add pytest-specific instructions
- [ ] Keep Playwright instructions
- [ ] Add framework selection logic
- [ ] Create issue for tracking
- **Acceptance:** All 4 frameworks have Claude-specific guidance

#### 2.6.2: Copilot Provider (1 hour)
- [ ] Update `copilot/agent.md`
- [ ] Add Jest-specific instructions
- [ ] Add PHPUnit-specific instructions
- [ ] Add pytest-specific instructions
- [ ] Keep Playwright instructions
- [ ] Add framework selection logic
- [ ] Create issue for tracking
- **Acceptance:** All 4 frameworks have Copilot-specific guidance

#### 2.6.3: OpenAI Provider (1 hour)
- [ ] Update `openai/agent.md`
- [ ] Add Jest-specific instructions
- [ ] Add PHPUnit-specific instructions
- [ ] Add pytest-specific instructions
- [ ] Keep Playwright instructions
- [ ] Add framework selection logic
- [ ] Create issue for tracking
- **Acceptance:** All 4 frameworks have OpenAI-specific guidance

### Phase 2.7: Update Documentation (2-3 hours)
- [ ] Update README.md with multi-framework overview
- [ ] Update ARCHITECTURE.md (or create if missing)
- [ ] Add framework feature matrix
- [ ] Update version to 2.2.0
- [ ] Add changelog entry
- [ ] Update skills directory index
- [ ] Create issue for tracking
- **Acceptance:** README updated, architecture docs complete, 500+ new words

---

## Phase 3: Control-Plane Agent Rewrite (5-7 hours)

### Phase 3.1: Rewrite .github Agent (3-4 hours)
- [ ] Read current `.github/agents/testing.agent.md`
- [ ] Remove direct test execution capabilities
- [ ] Add delegation to portable agent
- [ ] Document what .github agent owns vs. delegates
- [ ] Add coordination protocol section
- [ ] Update examples to show coordination
- [ ] Version bump to 0.2.0
- [ ] Update CHANGELOG.md
- [ ] Create issue for tracking
- **Acceptance:** Agent rewritten, delegation clear, no direct execution code

### Phase 3.2: Create Workflow Examples (2-3 hours)
- [ ] Create example: Testing .github workflows with portable agent
- [ ] Create example: Testing control-plane scripts
- [ ] Create example: Delegating to portable agent
- [ ] Create example: Parsing results from portable agent
- [ ] Document in `.github/agents/testing.agent.md` or separate guide
- [ ] Add to `.github/workflows/` if production-ready
- [ ] Create issue for tracking
- **Acceptance:** 3+ realistic examples, CI validation shown

---

## Phase 4: Testing & Validation (16-23 hours)

### Phase 4.1: Unit Tests (2-3 hours)
- [ ] Test Jest skill with mock WordPress data
- [ ] Test PHPUnit skill with mock WordPress globals
- [ ] Test pytest skill with mock CI artifacts
- [ ] Test Playwright skill with mock browsers
- [ ] Test framework selection logic
- [ ] Test control-plane coordination
- [ ] Create issue for tracking
- **Acceptance:** All skills have unit tests, 80%+ coverage

### Phase 4.2: Integration Tests (4-6 hours)
- [ ] Test Jest + .github agent coordination
- [ ] Test PHPUnit + .github agent coordination
- [ ] Test pytest + .github agent coordination
- [ ] Test Playwright + .github agent coordination
- [ ] Test multi-framework in same project
- [ ] Test provider switching (Claude → Copilot)
- [ ] Create issue for tracking
- **Acceptance:** All integrations tested, coordination validated

### Phase 4.3: E2E Tests (6-8 hours)
- [ ] Test Jest workflow on real block plugin
- [ ] Test PHPUnit workflow on real block theme
- [ ] Test pytest workflow on real utility repo
- [ ] Test Playwright workflow on test WordPress site
- [ ] Test .github agent on control-plane workflows
- [ ] Test GitHub Actions integration
- [ ] Create issue for tracking
- **Acceptance:** All E2E tests pass, coverage thresholds met

### Phase 4.4: Documentation & Knowledge Transfer (4-6 hours)
- [ ] Team training session (1-2 hours)
- [ ] Create migration guide for existing teams (1-2 hours)
- [ ] Update org-wide testing standards docs (1 hour)
- [ ] Create troubleshooting guide (1 hour)
- [ ] Create FAQ document (1 hour)
- [ ] Update AGENTS.md with testing agent info (1 hour)
- [ ] Create issue for tracking
- **Acceptance:** All docs complete, team trained, zero open questions

---

## Dependencies & Milestones

### Dependency Graph
```
Phase 2.1 (Rename)
    ↓
Phase 2.2 (AGENT.md)
    ↓
Phase 2.3 (Core Prompt)
    ↓
Phase 2.4-2.6 (Skills, Guides, Providers) — can parallelize
    ↓
Phase 2.7 (Documentation)
    ↓
Phase 3 (Control-Plane Rewrite)
    ↓
Phase 4 (Testing & Validation)
    ↓
Release
```

### Critical Path
- **Blocker:** Phase 2.1 must complete first (directory rename)
- **Parallel:** Phase 2.4-2.6 can run in parallel (skills, guides, providers)
- **Gate:** Phase 2 complete before Phase 3 starts
- **Gate:** Phase 3 complete before Phase 4 starts

---

## Effort Estimation

| Phase | Hours (Low) | Hours (High) | Best Estimate |
|-------|-------------|--------------|---------------|
| 2.1 | 1 | 2 | 1.5 |
| 2.2 | 1 | 2 | 1.5 |
| 2.3 | 3 | 4 | 3.5 |
| 2.4 | 6 | 8 | 7 |
| 2.5 | 8 | 10 | 9 |
| 2.6 | 2 | 3 | 2.5 |
| 2.7 | 2 | 3 | 2.5 |
| **Phase 2 Total** | **23** | **32** | **27.5** |
| Phase 3 | 5 | 7 | 6 |
| Phase 4 | 16 | 23 | 19.5 |
| **Grand Total** | **44** | **62** | **53** |

---

## GitHub Issue Mapping

Each task should have a corresponding GitHub issue:
- All Phase 2.x tasks → Individual issues
- All Phase 3.x tasks → Individual issues
- All Phase 4.x tasks → Individual issues
- Epic issue (master) → #1799
- Planning PR → #1797

**Issue Naming Convention:**
- `feat(testing-agent): Phase 2.1 — Rename directory structure`
- `feat(testing-agent): Phase 2.2 — Update AGENT.md metadata`
- etc.

---

## References

- **Proposal:** [proposal.md](./proposal.md)
- **Design:** [design.md](./design.md)
- **Master Issue:** [#1799](https://github.com/lightspeedwp/.github/issues/1799)
- **Planning PR:** [#1797](https://github.com/lightspeedwp/.github/pull/1797)

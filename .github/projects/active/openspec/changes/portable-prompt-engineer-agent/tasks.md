# Portable Prompt Engineer Agent — Implementation Tasks

## Phase 2: Core Implementation (3–4 weeks)

### 2.1 Prompt Analysis Framework

- [ ] 2.1.1 Create `analyze-prompt.skill.md` defining clarity detection methodology
- [ ] 2.1.2 Implement clarity score calculation (completeness, specificity, constraints)
- [ ] 2.1.3 Create `improve-prompt.skill.md` with suggestion generation logic
- [ ] 2.1.4 Implement improvement suggestion engine with trade-off documentation
- [ ] 2.1.5 Write unit tests for analysis functions (target: 80%+ coverage)
- [ ] 2.1.6 Create prompt templates for `.github`, WordPress plugins, WordPress themes

### 2.2 Context Detection & Adaptation

- [ ] 2.2.1 Implement context detection logic (wp-block.json, theme.json, .github/workflows/)
- [ ] 2.2.2 Create context-specific prompt templates and examples
- [ ] 2.2.3 Implement fallback handling for unknown repository types
- [ ] 2.2.4 Write integration tests for context detection (target: 10+ test cases)
- [ ] 2.2.5 Create manual context override support via environment variables

### 2.3 Validation & Standards

- [ ] 2.3.1 Create `validate-prompt.skill.md` with format validation rules
- [ ] 2.3.2 Implement `.github` governance prompt validation (workflow syntax, labels)
- [ ] 2.3.3 Implement WordPress plugin prompt validation (hooks, block registration)
- [ ] 2.3.4 Implement WordPress theme prompt validation (design tokens, CSS, patterns)
- [ ] 2.3.5 Create `validate-wordpress.skill.md` for WordPress-specific rules
- [ ] 2.3.6 Write validation unit tests (target: 80%+ coverage)

### 2.4 Documentation & API

- [ ] 2.4.1 Create `agents/prompt-engineer/README.md` with overview and quickstart
- [ ] 2.4.2 Create `agents/prompt-engineer/API.md` documenting all functions/interfaces
- [ ] 2.4.3 Create `agents/prompt-engineer/EXAMPLES.md` with real-world examples
- [ ] 2.4.4 Add mermaid architecture diagrams to documentation
- [ ] 2.4.5 Document analysis methodology and improvement rationale

### 2.5 GitHub Actions Integration

- [ ] 2.5.1 Create sample `.github/workflows/prompt-review.yml` workflow
- [ ] 2.5.2 Document CI/CD integration points and configuration
- [ ] 2.5.3 Create dry-run mode for safe testing

---

## Phase 3: Testing & Validation (2–3 weeks)

### 3.1 Unit Test Suite

- [ ] 3.1.1 Create test fixtures for clarity detection (30+ test cases)
- [ ] 3.1.2 Create test fixtures for improvement suggestions (30+ test cases)
- [ ] 3.1.3 Create test fixtures for context detection (15+ test cases)
- [ ] 3.1.4 Create test fixtures for validation (30+ test cases)
- [ ] 3.1.5 Run full unit test suite and achieve 80%+ coverage
- [ ] 3.1.6 Document coverage report and gaps

### 3.2 Integration Testing

- [ ] 3.2.1 Create `.github` control-plane test corpus (10 real prompts)
- [ ] 3.2.2 Create WordPress plugin test corpus (10 real prompts)
- [ ] 3.2.3 Create WordPress theme test corpus (10 real prompts)
- [ ] 3.2.4 Run integration tests on each corpus
- [ ] 3.2.5 Document pass/fail results and edge cases

### 3.3 Acceptance Testing

- [ ] 3.3.1 Conduct expert review of analysis quality with governance team
- [ ] 3.3.2 Conduct expert review with WordPress plugin team
- [ ] 3.3.3 Conduct expert review with WordPress theme team
- [ ] 3.3.4 Document feedback and improvements
- [ ] 3.3.5 Implement accepted feedback

### 3.4 Multi-Model Validation

- [ ] 3.4.1 Test against Claude Sonnet for consistency
- [ ] 3.4.2 Test against Claude Haiku for consistency
- [ ] 3.4.3 Document model-specific differences
- [ ] 3.4.4 Validate improvement quality across models

### 3.5 Repository-Specific Validation

- [ ] 3.5.1 Run validation tests in actual `.github` repository
- [ ] 3.5.2 Run validation tests in WordPress plugin repository
- [ ] 3.5.3 Run validation tests in WordPress theme repository
- [ ] 3.5.4 Document real-world validation results
- [ ] 3.5.5 Fix issues found in real repositories

---

## Phase 4: Documentation & Release (2 weeks)

### 4.1 Comprehensive Documentation

- [ ] 4.1.1 Create `agents/prompt-engineer/ARCHITECTURE.md` with system design
- [ ] 4.1.2 Create `agents/prompt-engineer/CONTRIBUTING.md` for contributors
- [ ] 4.1.3 Create `agents/prompt-engineer/TROUBLESHOOTING.md` for common issues
- [ ] 4.1.4 Add mermaid diagrams to all documentation files
- [ ] 4.1.5 Create quick-reference guides for each repository type
- [ ] 4.1.6 Create video/walkthrough documentation

### 4.2 NPM Packaging & Distribution

- [ ] 4.2.1 Create `agents/prompt-engineer/package.json` for NPM distribution
- [ ] 4.2.2 Set up NPM publishing configuration for `@lightspeedwp/prompt-engineer-agent`
- [ ] 4.2.3 Create installation script for automatic setup
- [ ] 4.2.4 Publish to NPM registry
- [ ] 4.2.5 Verify NPM package installation works correctly

### 4.3 Migration & Backward Compatibility

- [ ] 4.3.1 Create migration guide from `.github/agents/` to portable version
- [ ] 4.3.2 Implement `.github/agents/prompt-engineer.agent.md` as generated mirror
- [ ] 4.3.3 Document fallback behavior if portable version unavailable
- [ ] 4.3.4 Create deprecation notice for eventual `.github/` version removal

### 4.4 Release & Announcement

- [ ] 4.4.1 Create CHANGELOG entry for v1.0.0 release
- [ ] 4.4.2 Tag v1.0.0 release in git
- [ ] 4.4.3 Draft announcement for internal teams
- [ ] 4.4.4 Create blog post or wiki entry for organizational use
- [ ] 4.4.5 Schedule rollout plan for adoption across teams

### 4.5 End-to-End Testing

- [ ] 4.5.1 Test NPM installation from fresh environment
- [ ] 4.5.2 Test Git clone installation method
- [ ] 4.5.3 Test in GitHub Actions CI/CD workflow
- [ ] 4.5.4 Test context detection in all three repository types
- [ ] 4.5.5 Verify documentation completeness and accuracy

---

## Success Criteria

### Phase 2 Complete When

- ✅ Agent passes 10+ integration test cases
- ✅ Context detection works for all three repository types
- ✅ API documented with examples
- ✅ 80%+ code coverage achieved

### Phase 3 Complete When

- ✅ 30+ integration tests passing
- ✅ 15 repository-specific validation cases pass
- ✅ Expert-approved improvements on random sample
- ✅ Zero critical bugs found

### Phase 4 Complete When

- ✅ Comprehensive documentation published
- ✅ NPM package published and validated
- ✅ Git installation script working
- ✅ First release tagged and announced
- ✅ Zero production issues in first week

---

## Dependencies

**Prerequisite for Phase 2:**

- Complete Phase 1 specification ✅
- Design document finalized ✅
- Architecture decisions approved ✅

**Prerequisite for Phase 3:**

- Phase 2 code complete
- All unit tests passing
- Integration test fixtures prepared

**Prerequisite for Phase 4:**

- Phase 3 validation complete
- Zero critical bugs
- Documentation drafted

---

## Related Documents

- **Design:** design.md (7 architectural decisions)
- **Proposal:** proposal.md (problem, solution, impact)
- **Planning:** .github/projects/active/portable-prompt-engineer-agent-spec-2026-08-12/
- **GitHub Issues:** #1805 (Epic), #1804 (Specification PR)

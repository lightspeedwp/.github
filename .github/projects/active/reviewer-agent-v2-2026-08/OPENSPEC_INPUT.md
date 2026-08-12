# Reviewer Agent v2 — OpenSpec Implementation Plan

## Project Vision

Transform the existing Reviewer Agent from a basic CI/PR monitoring tool into an intelligent, multi-tool orchestrator that triggers CodeRabbit, GitHub Code Quality, and GitHub Copilot simultaneously, collects normalized feedback, applies intelligent decision logic, and ensures critical issues are never merged unresolved.

## Core Requirements

### 1. Multi-Tool Orchestration

- Trigger CodeRabbit, GitHub Code Quality, and GitHub Copilot in parallel
- Support configurable tool selection based on repository type and PR characteristics
- Implement exponential backoff polling with 30-minute timeout
- Graceful degradation if tools unavailable (fallback to GitHub Code Quality)

### 2. Feedback Processing & Normalization

- Parse tool-specific response formats (CodeRabbit API, GitHub Checks API, Copilot API)
- Normalize findings into unified schema (severity, category, file, line, suggestion)
- De-duplicate findings from multiple tools
- Categorize by type: security, performance, style, architecture, accessibility

### 3. Intelligent Decision Engine

- **Auto-resolve:** Detect when PR changes address previously flagged findings
- **Suppress:** False positives (contradicts standards, pre-existing code)
- **Escalate:** Conflicting findings from multiple tools or architectural issues
- **Block merge:** Critical/major thresholds exceeded

### 4. State Persistence & Tracking

- Persist feedback to `.github/data/reviews/{pr_number}/`
- Track review cycles (cycle-1.json, cycle-2.json, etc.)
- Load prior state on PR re-runs to detect resolution progress
- Generate decision log (.review-decisions.md)

### 5. PR Comments & Status Checks

- Post formatted PR comment summarizing findings
- Update comment on each PR run
- Set GitHub status check (blocking vs. allowing merge)
- Display cycle-over-cycle progress

### 6. Repository Type Support

- **Unified agent** with configuration overlays (no separate agents)
- **.github control-plane:** JavaScript, YAML, Markdown focus; all tools enabled
- **WordPress plugins:** JavaScript + PHP; optional WordPress categories (WPCS, block registration)
- **WordPress themes:** JavaScript + PHP; optional WordPress categories (theme.json, tokens)

### 7. Authorization & Token Management

- Organization-wide tokens (ORG_CODERABBIT_API_TOKEN, ORG_COPILOT_TOKEN)
- Per-repository override (CODERABBIT_API_TOKEN, COPILOT_TOKEN)
- GitHub Code Quality (always available, no token needed)
- Fallback chain: repo-specific → org-wide → built-in

## Implementation Scope

### Phase 2: Core Implementation (2 weeks)

**2A: Orchestrator & Tool Integration (Days 1-4)**

- Orchestrator module (tool selection, parallel triggering, polling)
- Tool integration modules (CodeRabbit, Code Quality, Copilot)
- Tool registry (unified interface, token resolution)

**2B: Feedback Processing & Decision Engine (Days 5-8)**

- Feedback processor (parsing, normalization, deduplication)
- Decision engine (auto-resolve, suppress, escalate, blocking logic)
- Comment generator (formatted PR comments)

**2C: Configuration & Agent Orchestration (Days 9-10)**

- Configuration system (JSON schema, YAML loader, defaults)
- Main agent entry point (orchestrates all modules)
- Integration with GitHub Actions workflow

### Phase 3: Testing & Validation (1 week)

- **Unit tests:** 90% coverage of decision logic, parsing, state
- **Integration tests:** Happy-path with mocked APIs
- **E2E tests:** Full PR review lifecycle in test repository
- Bug fixes and refinement

### Phase 4: Documentation & Rollout (1 week)

- Architecture documentation with 8+ Mermaid diagrams
- Setup guide, user guide, API reference
- Rollout: alpha → beta → production phases
- Team training materials

## Key Technical Decisions

1. **One unified agent** with config overlays (not separate agents) for control-plane and WordPress repos
2. **Hybrid authorization:** org-wide tokens + per-repo override + GitHub Code Quality fallback
3. **Optional WordPress categories:** Opt-in WPCS, block registration, theme.json validation
4. **Three-tier testing:** Unit (90%), Integration (happy-path), E2E (main workflow)
5. **Comprehensive documentation:** 8+ Mermaid diagrams covering architecture, sequences, state machines
6. **Split artifacts:** Planning in `.github/projects/active/`, code in `scripts/agents/`

## Success Criteria

- ✅ All 6 design decisions implemented
- ✅ 90% unit test coverage
- ✅ Happy-path integration tests passing
- ✅ E2E workflow proves end-to-end functionality
- ✅ Documentation complete with diagrams
- ✅ Zero critical security findings
- ✅ False positive rate < 5%
- ✅ Review completion time < 5 minutes
- ✅ Rollout to production successful
- ✅ Monitoring shows improved review efficiency

## Dependencies & Prerequisites

### Infrastructure

- GitHub Actions secrets configured (ORG_CODERABBIT_API_TOKEN, ORG_COPILOT_TOKEN)
- Test repository access for E2E testing
- CodeRabbit sandbox account (for testing)

### Code Dependencies

- @actions/core (available)
- @actions/github (available)
- js-yaml (verify/install)
- ajv (verify/install)

### Existing Patterns to Follow

- Workflow file: `.github/workflows/reviewer.yml`
- Test helpers: `tests/test-helpers.js`
- Configuration patterns from labeling/release agents
- Report object pattern from other agents

## Deliverables

### Planning Phase (This Week)

- [ ] Comprehensive 4-week implementation roadmap (this document, expanded by OpenSpec)
- [ ] 15 concrete GitHub issues (Tasks 1-15 across 4 phases)
- [ ] Architecture documentation with diagrams
- [ ] Configuration examples for all repo types
- [ ] Decision log with rationale

### Implementation Phase (4 Weeks)

- [ ] Orchestrator module with parallel tool triggering
- [ ] Tool integration modules (CodeRabbit, Code Quality, Copilot)
- [ ] Feedback processor with normalization
- [ ] Decision engine with auto-resolve/suppress/escalate logic
- [ ] State manager with persistence
- [ ] Comment generator with formatted output
- [ ] Configuration system with validation
- [ ] Main agent entry point
- [ ] Unit test suite (90% coverage)
- [ ] Integration test suite
- [ ] E2E test suite
- [ ] Complete documentation
- [ ] Rollout & monitoring setup

## Questions for OpenSpec

1. **What are the 15 concrete implementation tasks** broken down by phase, with dependencies, estimates, and acceptance criteria?
2. **What is the detailed test plan** including unit test cases, integration scenarios, and E2E workflow validation?
3. **What risk mitigation strategies** should we implement for: tool API changes, rate limiting, large PR timeouts, token leakage, false positives, state corruption, performance regression?
4. **What monitoring and observability** should be in place post-rollout?
5. **What known unknowns** exist that we should flag for future exploration?

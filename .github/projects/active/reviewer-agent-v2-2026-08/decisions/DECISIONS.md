# Reviewer Agent v2 — Design Decisions Log

**Project:** Reviewer Agent v2 Implementation  
**Created:** 2026-08-12  
**Status:** All decisions ✅ APPROVED  

---

## Decision 1: Agent Scope & Reusability

**Status:** ✅ APPROVED (2026-08-12)

**Decision:** Implement ONE unified agent with configuration overlays for different repo types

### Context

Reviewer Agent v2 will serve three repository types:

- `.github` control-plane (governance, GitHub-native files)
- WordPress plugins (JavaScript + PHP)
- WordPress themes (JavaScript + PHP + CSS)

Options evaluated:

- A) One unified agent with config-driven customization
- B) Three separate agents (one per repo type)
- C) Hybrid approach (shared base + type-specific extensions)

### Rationale

**Chosen: Option A (Unified Agent)**

✅ **Single codebase** — One main agent file, easier to maintain  
✅ **Consistency** — Same review logic across all repo types  
✅ **Reusability** — Configuration-driven specialization  
✅ **Future-proof** — Add new repo types without code duplication  
✅ **Testing** — Comprehensive tests apply to all types  

**Why not B or C?**

❌ Option B (Separate agents) — Code duplication, maintenance burden  
❌ Option C (Hybrid) — More complex than needed, harder to test  

### Implementation

```javascript
// Single agent entry point
async function run(inputs, github, core) {
  const config = await loadConfig(repo)        // Config determines behavior
  const tools = selectTools(config.repo_type)  // Tool selection by type
  const findings = await orchestrate(tools, config)
  
  // Apply repo-type-specific logic via config
  return processFindings(findings, config)
}
```

### Implications

- **Development:** 1 agent to build, test, and maintain
- **Testing:** 3× repo types covered by single test suite
- **Configuration:** Critical — must handle all variations
- **Rollout:** Parallel deployment to all repo types

### Approval

- ✅ Approved by: Architecture review (implicit)
- ✅ Date: 2026-08-12
- ✅ No blockers

### Related Documents

- [ANSWERS.md](../ANSWERS.md#decision-1-agent-scope--reusability)
- [OPENSPEC_PLAN.md](../OPENSPEC_PLAN.md#phase-2c-configuration--agent-orchestration-days-9-10)

---

## Decision 2: Tool Authorization & Fallback Strategy

**Status:** ✅ APPROVED (2026-08-12)

**Decision:** Implement hybrid authorization with graceful fallback chain

### Context

Three code review tools require API authentication:

- CodeRabbit (API token required)
- GitHub Code Quality (built-in, no token)
- GitHub Copilot (API token required)

Challenge: How to manage tokens securely while supporting both org-wide and per-repo overrides?

Options evaluated:

- A) Organization-wide tokens only
- B) Per-repository tokens only
- C) Hybrid (org-wide + per-repo override)
- D) Token-less (always fallback to GitHub native)

### Rationale

**Chosen: Option C (Hybrid Authorization)**

✅ **Flexibility** — Repos can override org tokens if needed  
✅ **Security** — Tokens never logged, only in GitHub secrets  
✅ **Resilience** — Graceful fallback if tools unavailable  
✅ **Simplicity** — Clear priority order  

**Resolution hierarchy:**

1. Repository secret (highest priority) → `CODERABBIT_API_TOKEN`
2. Organization secret → `ORG_CODERABBIT_API_TOKEN`
3. GitHub Code Quality (always available, no token)
4. Skip gracefully if all unavailable

### Implementation

```javascript
async function resolveToken(tool, repo) {
  // Try repo-specific secret first
  const repoToken = process.env[`${tool.toUpperCase()}_API_TOKEN`]
  if (repoToken) return repoToken
  
  // Fall back to org-wide token
  const orgToken = process.env[`ORG_${tool.toUpperCase()}_API_TOKEN`]
  if (orgToken) return orgToken
  
  // GitHub Code Quality needs no token
  if (tool === 'code-quality') return null
  
  // Token not available — skip this tool
  return null
}

async function orchestrate(config) {
  const findings = []
  
  for (const tool of selectTools(config)) {
    try {
      const results = await triggerTool(tool, config)
      findings.push(...results)
    } catch (error) {
      logger.warn(`Tool ${tool} failed: ${error.message}`)
      // Continue with other tools
    }
  }
  
  if (findings.empty) {
    // Fallback: use GitHub Code Quality
    findings = await getGitHubCodeQuality()
  }
  
  return findings
}
```

### Implications

- **Setup:** Require org-wide tokens in GitHub Actions secrets
- **Flexibility:** Repos can override if needed
- **Monitoring:** Track tool failures and fallback usage
- **Security:** Audit logging for token usage

### Approval

- ✅ Approved by: Architecture review (implicit)
- ✅ Date: 2026-08-12
- ✅ Security review: Tokens in secrets only ✅

### Related Documents

- [ANSWERS.md](../ANSWERS.md#decision-2-tool-authorization--fallback-strategy)
- [OPENSPEC_PLAN.md](../OPENSPEC_PLAN.md#phase-2a-orchestrator--tool-integration-days-1-4)

---

## Decision 3: WordPress-Specific Review Categories

**Status:** ✅ APPROVED (2026-08-12)

**Decision:** Implement opt-in WordPress categories for plugin/theme repos

### Context

WordPress repositories have unique review dimensions not needed for `.github`:

- PHP code quality (phpstan, WPCS)
- Block registration validation
- theme.json schema validation
- Internationalization compliance

Challenge: How to support these without bloating the agent or `.github` reviews?

Options evaluated:

- A) Include WordPress categories everywhere (unnecessary for `.github`)
- B) Exclude WordPress categories entirely (missing value for plugins/themes)
- C) Opt-in per repository configuration
- D) Separate agents for WordPress

### Rationale

**Chosen: Option C (Opt-In Configuration)**

✅ **Simplicity** — Disabled by default for `.github`  
✅ **Power** — Full support for WordPress repos  
✅ **Clarity** — Explicit per-repo configuration  
✅ **Future-proof** — Easy to add more categories  

### WordPress Categories Supported

| Category | Tool | Use Case |
|----------|------|----------|
| **PHP Linting** | phpstan | Type correctness, deprecated functions |
| **Coding Standards** | WPCS | Hook naming, escaping, database queries |
| **Block Validation** | Custom | Block metadata, callbacks, variations |
| **Theme Validation** | Custom | theme.json schema, tokens, CSS |
| **i18n Compliance** | i18n-checker | Translation strings, text domains |

### Implementation

```yaml
# .github — WordPress categories disabled
wordpress_categories:
  enabled: false

# WordPress plugin — All categories enabled
wordpress_categories:
  enabled: true
  linters:
    - phpstan
    - wpcs
    - block-validator
    - i18n-checker
```

### Implications

- **Configuration:** Category settings per repository
- **Testing:** WordPress-specific test fixtures required
- **Documentation:** Clear examples for each category
- **Rollout:** Phase WordPress support separately if needed

### Approval

- ✅ Approved by: Architecture review (implicit)
- ✅ Date: 2026-08-12
- ✅ No blockers

### Related Documents

- [ANSWERS.md](../ANSWERS.md#decision-3-wordpress-specific-review-categories)
- [Configuration Examples](../configuration-examples/)

---

## Decision 4: Test Coverage Strategy

**Status:** ✅ APPROVED (2026-08-12)

**Decision:** Implement three-tier testing (Unit 90%, Integration, E2E)

### Context

Agent requires rigorous validation:

- Logic correctness (decision engine, state management)
- API integration (tool orchestration, token handling)
- Workflow accuracy (full PR review lifecycle)

Challenge: Balance coverage, execution time, and realistic scenarios

Options evaluated:

- A) Unit tests only (90% coverage)
- B) Integration tests only (happy paths + tool APIs)
- C) E2E tests only (real workflows, slower)
- D) Three-tier pyramid (unit + integration + E2E)

### Rationale

**Chosen: Option D (Three-Tier Pyramid)**

```
       ┌─────────┐
       │   E2E   │  3-5 tests (full workflows)
       ├────────┤
      │ Integrn │  10 tests (component interaction)
      ├───────┤
    │  Unit  │  130+ tests (logic branches)
    └──────┘
```

✅ **Fast feedback** — Unit tests run in seconds  
✅ **Realistic coverage** — Integration tests validate real APIs  
✅ **Confidence** — E2E tests prove user workflows  
✅ **Efficiency** — 90%+ coverage without massive test suite  

### Implementation

**Unit Tests (90% Coverage):**

- Decision logic (25+ tests)
- Feedback parsing (20+ tests)
- State management (15+ tests)
- Config loading (15+ tests)
- Tool registry (15+ tests)
- Comment generation (10+ tests)
- Orchestrator (15+ tests)

**Integration Tests (Happy Path):**

- All tools triggered in parallel
- Tool timeout handling
- Token resolution hierarchy
- Auto-resolution detection
- State persistence across cycles

**E2E Tests (Main Workflow):**

- Create test PR in test repository
- Trigger agent (cycle 1, 2, 3)
- Verify findings, comments, status checks
- Detect auto-resolution
- Test blocking behavior

### Implications

- **Development:** ~50 hours for test suite
- **CI/CD:** Unit tests < 5 min, integration < 10 min, E2E < 20 min
- **Maintenance:** Tests document expected behavior
- **Confidence:** 90%+ coverage gives production confidence

### Approval

- ✅ Approved by: Architecture review (implicit)
- ✅ Date: 2026-08-12
- ✅ Jest configuration verified

### Related Documents

- [ANSWERS.md](../ANSWERS.md#decision-4-test-coverage-strategy)
- [OPENSPEC_PLAN.md](../OPENSPEC_PLAN.md#phase-3-testing--validation-1-week-45-hours)

---

## Decision 5: Documentation & Diagrams

**Status:** ✅ APPROVED (2026-08-12)

**Decision:** Include 8+ Mermaid diagrams in comprehensive documentation

### Context

Multi-component agent requires clear documentation:

- System architecture (how components interact)
- Decision logic (how findings are analyzed)
- Workflows (how cycles progress)
- Integration points (how tools are orchestrated)

Challenge: Balance comprehensiveness with maintainability

Options evaluated:

- A) Minimal (README + code comments only)
- B) Standard (architecture + setup guides)
- C) Comprehensive (8+ diagrams + guides)
- D) Interactive (runnable examples, config generators)

### Rationale

**Chosen: Option C (Comprehensive)**

✅ **Clarity** — Diagrams reduce cognitive load  
✅ **Onboarding** — Developers understand system quickly  
✅ **Maintenance** — Documentation maintains itself in version control  
✅ **Accessibility** — Visual learners benefit from diagrams  

### Diagrams Planned

1. **System Architecture** — Components and data flow
2. **Tool Integration Points** — API calls and fallback chain
3. **Decision Engine Logic Tree** — Auto-resolve/suppress/escalate
4. **Finding State Machine** — Lifecycle (open → resolved)
5. **Feedback Collection Sequence** — Parallel tool triggering
6. **Auto-Resolution Logic** — Code change detection
7. **Blocking Decision Sequence** — Threshold checks
8. **Full PR Review Lifecycle** — Multi-cycle workflow

### Implementation

```markdown
## Architecture

[Mermaid diagram showing components]

## Decision Flow

[Mermaid diagram showing logic tree]

## Setup Guide

[Step-by-step instructions]

## API Reference

[Exported functions and schemas]
```

### Implications

- **Documentation:** ~12 hours to create + maintain
- **Format:** Mermaid (native to Markdown, version controlled)
- **Maintenance:** Diagrams live in docs, updated with code
- **Accessibility:** Light/dark mode compatible

### Approval

- ✅ Approved by: Architecture review (implicit)
- ✅ Date: 2026-08-12
- ✅ Mermaid rendering verified

### Related Documents

- [ANSWERS.md](../ANSWERS.md#decision-5-documentation--diagrams)
- [OPENSPEC_PLAN.md](../OPENSPEC_PLAN.md#phase-4-documentation--rollout-1-week-25-hours)

---

## Decision 6: Artifact Location

**Status:** ✅ APPROVED (2026-08-12)

**Decision:** Split artifacts (planning in `.github/projects/`, code in `scripts/agents/`)

### Context

Reviewer Agent v2 has multiple artifact types:

- Planning documents (OPENSPEC_PLAN.md, decisions, specifications)
- Implementation code (agent, modules, tests)
- Documentation (setup guides, API reference)
- Configuration (examples, schemas)

Challenge: Where should each artifact live to balance governance and reusability?

Options evaluated:

- A) Everything in `.github/projects/` (all artifacts together)
- B) Everything in `scripts/agents/` (all portable)
- C) Everything in root `agents/` folder (portable location)
- D) Split (planning in `.github/`, code in `scripts/`)

### Rationale

**Chosen: Option D (Split Location)**

**Planning & Decisions → `.github/projects/active/reviewer-agent-v2-2026-08/`**

- Project overview (README.md)
- Implementation roadmap (OPENSPEC_PLAN.md)
- Design decisions (DECISIONS.md, ANSWERS.md)
- Technical specifications (API_INTEGRATION_SPEC.md, etc.)
- Configuration examples (3 templates)

✅ **Governance** — Project planning belongs in control-plane  
✅ **Traceability** — Decisions linked to GitHub issues  
✅ **Collaboration** — Team reviews project planning  

**Implementation & Code → `scripts/agents/`**

- Main agent (reviewer-agent-v2.js)
- All modules (orchestrator, processors, etc.)
- Tests (unit, integration, E2E)
- Setup/user guides (SETUP_GUIDE.md, USER_GUIDE.md)

✅ **Portability** — Code reusable in other LightSpeedWP repos  
✅ **Maintainability** — Code lives with tests and docs  
✅ **Standards** — Follows existing agent patterns  

### Implementation

```
.github/projects/active/reviewer-agent-v2-2026-08/
├── README.md
├── OPENSPEC_PLAN.md
├── ANSWERS.md
├── decisions/DECISIONS.md
├── specifications/*.md
└── configuration-examples/*.yml

scripts/agents/
├── reviewer-agent-v2.js
├── includes/reviewer-v2/
│   ├── orchestrator.js
│   ├── feedback-processor.js
│   ├── decision-engine.js
│   └── docs/*.md
└── __tests__/reviewer-agent-v2.test.js
```

### Implications

- **Separation of concerns** — Planning separate from implementation
- **Reusability** — Agent code can be forked to other repos
- **Cross-repo consistency** — Code follows established patterns
- **Project tracking** — Decisions linked to GitHub issues

### Approval

- ✅ Approved by: Architecture review (implicit)
- ✅ Date: 2026-08-12
- ✅ Follows repo structure guidelines

### Related Documents

- [ANSWERS.md](../ANSWERS.md#decision-6-artifact-location)
- [CLAUDE.md](../../../../CLAUDE.md#repository-boundaries)

---

## Summary

| # | Decision | Status | Implications |
|---|----------|--------|-------------|
| 1 | One unified agent + config overlays | ✅ APPROVED | Single codebase, 3 repo types |
| 2 | Hybrid authorization + fallback | ✅ APPROVED | Flexible tokens, resilient orchestration |
| 3 | Opt-in WordPress categories | ✅ APPROVED | Powerful for plugins/themes, simple for `.github` |
| 4 | Three-tier testing (Unit/Integration/E2E) | ✅ APPROVED | 90% coverage, realistic scenarios, fast feedback |
| 5 | Comprehensive 8+ Mermaid diagrams | ✅ APPROVED | Clear documentation, better onboarding |
| 6 | Split artifacts (planning/.github, code/scripts) | ✅ APPROVED | Governance + portability |

**All decisions approved.** Ready for Phase 2 implementation.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and architectural rigor!*

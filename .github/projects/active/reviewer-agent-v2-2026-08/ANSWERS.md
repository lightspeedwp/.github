# Reviewer Agent v2 — Best-Practice Design Answers

## Decision 1: Agent Scope & Reusability

**Question:** Should this be one unified agent or separate agents for different repo types?

**Answer:** ONE unified agent with configuration overlays

### Rationale

- **Maintainability:** Single codebase easier to maintain and test
- **Consistency:** Same review logic across all repository types
- **Reusability:** Configuration-driven specialization (DRY principle)
- **Future flexibility:** Easier to add new repo types without code duplication

### Implementation Approach

```javascript
// Single agent with config-driven behavior
async function run(inputs, github, core) {
  const config = await loadConfig(repo) // Detects repo type automatically
  const tools = selectTools(config.repo_type) // Config determines tools
  const findings = await orchestrate(tools, config)
  
  // Apply repo-type-specific logic
  if (config.repo_type === 'wordpress-plugin') {
    findings = await applyWordPressLinting(findings, config)
  }
  
  // ... rest of flow
}
```

### Configuration Overlays by Repo Type

**`.github` Control-Plane:**

```yaml
repo_type: github
tools:
  coderabbit: { enabled: true, threshold: 0.8 }
  code_quality: { enabled: true, threshold: 0.7 }
  copilot: { enabled: true, threshold: 0.6 }
focus: [javascript, yaml, markdown]
wordpress_categories: { enabled: false }
```

**WordPress Plugin:**

```yaml
repo_type: wordpress-plugin
tools:
  coderabbit: { enabled: true }
  code_quality: { enabled: true }
  copilot: { enabled: true }
focus: [javascript, php, json]
wordpress_categories:
  enabled: true
  linters: [phpstan, wp-i18n-checker, wpcs]
```

**WordPress Theme:**

```yaml
repo_type: wordpress-theme
tools:
  coderabbit: { enabled: true }
  code_quality: { enabled: true }
  copilot: { enabled: true }
focus: [javascript, php, json, css]
wordpress_categories:
  enabled: true
  linters: [theme-json-schema, token-validation, phpstan]
```

### Why Not Separate Agents?

- ❌ Code duplication across 3 agents
- ❌ Maintenance burden (fix bug 3 times)
- ❌ Harder to share improvements
- ❌ User confusion (which agent to use?)

### Success Criteria

- ✅ Single `scripts/agents/reviewer-agent-v2.js` codebase
- ✅ Configuration loaded from environment/YAML
- ✅ Repo type auto-detected or configurable
- ✅ All features work across all repo types
- ✅ Configuration examples for all types provided

---

## Decision 2: Tool Authorization & Fallback Strategy

**Question:** How should API tokens be managed and what's the fallback strategy?

**Answer:** Hybrid authorization with graceful fallback chain

### Authorization Hierarchy

```
1. Repository-specific secret (CODERABBIT_API_TOKEN) ← Highest priority
   ↓ (if not set)
2. Organization-wide secret (ORG_CODERABBIT_API_TOKEN)
   ↓ (if not available)
3. GitHub Code Quality (always available, no token)
   ↓ (if tool fails)
4. Graceful skip (continue with other tools)
```

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
  
  // Token not available
  return null
}
```

### Fallback Strategy for Tool Failure

```javascript
async function orchestrate(config) {
  const availableTools = selectTools(config)
  
  for (const tool of availableTools) {
    try {
      const results = await triggerTool(tool, config)
      findings.push(...results)
    } catch (error) {
      // Tool failed - log and continue
      logger.warn(`Tool ${tool} failed: ${error.message}`)
      // Don't throw - continue with other tools
    }
  }
  
  if (findings.empty) {
    // All tools failed - use GitHub Code Quality as fallback
    const results = await github.rest.checks.listForRef(...)
    findings = parseCodeQualityOutput(results)
  }
  
  return findings
}
```

### Why This Approach?

- ✅ **Flexibility:** Repos can override org tokens if needed
- ✅ **Security:** Tokens kept in GitHub secrets, never logged
- ✅ **Resilience:** Continues even if one tool unavailable
- ✅ **Simplicity:** Fallback to GitHub native (always works)

### Configuration

All tokens stored as GitHub Actions secrets:

- Organization level: `ORG_CODERABBIT_API_TOKEN`, `ORG_COPILOT_TOKEN`
- Repository level: `CODERABBIT_API_TOKEN`, `COPILOT_TOKEN` (overrides)

### Success Criteria

- ✅ Token resolution hierarchy implemented
- ✅ Repo-specific tokens override org tokens
- ✅ All tokens kept in GitHub secrets (not logged)
- ✅ Fallback to Code Quality working
- ✅ Tool failure doesn't crash agent
- ✅ Unit tests verify token resolution logic

---

## Decision 3: WordPress-Specific Review Categories

**Question:** What additional review dimensions are needed for WordPress repos?

**Answer:** Opt-in WordPress categories, disabled by default for `.github`

### WordPress Categories for Plugin/Theme Repos

**PHP Linting (phpstan):**

- Type correctness
- Deprecated function usage
- PHPDoc compliance
- Error handling

**WordPress Coding Standards (WPCS):**

- Hook naming conventions
- Escaping and sanitization
- Database query standards
- Security best practices

**Block Registration & Validation:**

- Block metadata correctness
- Edit/Save callback structure
- Attributes schema validation
- Block variation correctness

**Theme Support (for themes):**

- theme.json schema validation
- Token naming conventions
- CSS variable consistency
- Template structure validation

**Internationalization (i18n):**

- Translation string tagging
- Text domain consistency
- Proper escaping of translated strings

### Configuration for WordPress

```yaml
wordpress_categories:
  enabled: true
  linters:
    - phpstan
    - wpcs
    - block-validation
    - theme-validation (optional, for themes only)
    - i18n-checker
```

### Implementation

```javascript
async function processWordPressFinding(finding, config) {
  if (!config.wordpress_categories.enabled) return null
  
  // Map tool findings to WordPress categories
  if (finding.category === 'php-type-error') {
    return {
      ...finding,
      wordpress_category: 'phpstan',
      severity: 'major'
    }
  }
  
  if (finding.suggestion.includes('__()') || finding.suggestion.includes('esc_')) {
    return {
      ...finding,
      wordpress_category: 'wpcs',
      severity: 'major'
    }
  }
  
  // ... more mappings
  return finding
}
```

### Why Opt-In?

- `.github` control-plane: Not a WordPress project, no need for PHP linting
- WordPress repos: Can enable for comprehensive review
- Flexibility: Teams can enable/disable categories per repository

### Success Criteria

- ✅ WordPress categories configurable
- ✅ Disabled by default for `.github`
- ✅ Enabled for WordPress plugin/theme repos
- ✅ All 5 WordPress linters supported
- ✅ Category mapping correct for all linters

---

## Decision 4: Test Coverage Strategy

**Question:** What test types and coverage targets?

**Answer:** Three-tier testing (Unit 90%, Integration, E2E)

### Testing Pyramid

```
       ┌─────────┐
       │   E2E   │  3 tests (main workflow, failures, edge cases)
       ├────────┤
      │ Integrn │  10 tests (tool APIs, state, happy paths)
      ├───────┤
    │  Unit  │  130+ tests (all logic branches)
    └──────┘
```

### Unit Tests (90% Coverage)

**Target:** Decision logic, parsing, state management

**Coverage:**

- Decision engine: 25+ tests (all branches)
- Feedback processor: 20+ tests (all tool formats)
- Tool registry: 15+ tests (tool availability)
- State manager: 15+ tests (persistence)
- Comment generator: 10+ tests (formatting)
- Config system: 15+ tests (loading/validation)
- Orchestrator: 15+ tests (selection/polling)

**Tools:** Jest with coverage thresholds (90% minimum)

### Integration Tests (Happy Path)

**Target:** Real API interactions, state persistence, tool collaboration

**Test Cases:**

1. All tools triggered in parallel
2. Tool timeout handling
3. Token resolution hierarchy
4. Tool unavailability (graceful skip)
5. State persistence across cycles
6. Auto-resolution detection
7. Comment posting

**Approach:** Mocked APIs for external tools, real state file I/O

### E2E Tests (Main Workflow)

**Target:** Full PR review lifecycle

**Test Scenarios:**

1. Create test PR in test repository
2. Trigger agent (cycle 1)
3. Verify findings and comment
4. Push commit (address one finding)
5. Trigger agent (cycle 2)
6. Verify auto-resolution and progress
7. Complete remaining findings
8. Verify merge allowed
9. Test blocking behavior

**Approach:** Real GitHub repo, real PR creation, manual verification optional

### Coverage Targets

| Component | Unit | Integration | E2E |
|-----------|------|-------------|-----|
| Orchestrator | 90% | ✅ | ✅ |
| Tool Integration | 85% | ✅ | ✅ |
| Feedback Processor | 92% | ✅ | ✅ |
| Decision Engine | 95% | ✅ | ✅ |
| State Manager | 90% | ✅ | ✅ |
| Config System | 88% | ✅ | ✅ |

### Why Three Tiers?

- **Unit:** Fast feedback, catch logic errors early
- **Integration:** Realistic scenarios with component interaction
- **E2E:** User-facing workflows, real GitHub integration

### Success Criteria

- ✅ 90% unit test coverage (Jest report)
- ✅ All happy-path integration tests passing
- ✅ E2E workflow proves functionality
- ✅ Test execution time < 5 minutes (units)
- ✅ Test fixtures comprehensive and realistic

---

## Decision 5: Documentation & Diagrams

**Question:** Which diagrams should be included?

**Answer:** Comprehensive with 8+ Mermaid diagrams

### Diagram Strategy

**Architecture Layer:**

1. System Architecture (components, data flow)
2. Tool Integration Points (API calls, fallback chain)

**Behavior Layer:**
3. Decision Engine Logic Tree (decision points)
4. Finding State Machine (lifecycle)

**Sequence Layer:**
5. Feedback Collection Sequence (parallel tool triggering)
6. Auto-Resolution Logic (code change detection)
7. Blocking Decision Sequence (threshold checks)

**Lifecycle Layer:**
8. Full PR Review Lifecycle (multi-cycle flow)

### Why Comprehensive?

- ✅ Helps developers understand system quickly
- ✅ Documents decision points clearly
- ✅ Shows failure/recovery paths
- ✅ Reduces onboarding time

### Tools

- **Mermaid diagrams** (markdown native, version controlled)
- **Inline SVG** (alternative for complex diagrams)
- **ASCII art** (for quick reference in comments)

### Success Criteria

- ✅ 8+ diagrams created
- ✅ All in Mermaid format (except where SVG needed)
- ✅ Diagrams match implementation exactly
- ✅ Clear and legible in both light/dark modes
- ✅ Helpful for onboarding developers

---

## Decision 6: Artifact Location

**Question:** Where should project artifacts live?

**Answer:** Split location (planning in `.github/projects/`, code in `scripts/`)

### Location Strategy

**Planning & Decisions:** `.github/projects/active/reviewer-agent-v2-2026-08/`

- README.md (project overview)
- OPENSPEC_PLAN.md (this roadmap)
- DECISIONS.md (decision log)
- ANSWERS.md (this document)
- specifications/ (technical specs)
- configuration-examples/ (config templates)

**Implementation & Code:** `scripts/agents/` (portable, reusable)

- `reviewer-agent-v2.js` (main agent)
- `includes/reviewer-v2/` (all modules)
- `__tests__/reviewer-agent-v2.test.js` (tests)
- `includes/reviewer-v2/docs/` (setup/user guides)

### Why Split?

- **Planning:** Belongs in control-plane project management
- **Code:** Portable and reusable across LightSpeedWP repos
- **Documentation:** Split between project docs and setup guides

### Why Not All in `.github/`?

- ❌ Code shouldn't be in `.github/` (governance layer)
- ❌ Hard to reuse agent in other repos
- ❌ Mixes implementation with project management

### Why Not All in Root `agents/`?

- ❌ Planning artifacts (OPENSPEC_PLAN.md, etc.) aren't portable
- ❌ GitHub-specific project management belongs in `.github/`

### Success Criteria

- ✅ Planning docs in `.github/projects/active/`
- ✅ Code in `scripts/agents/`
- ✅ Tests alongside code
- ✅ Setup guides in code docs
- ✅ No duplication or confusion

---

## Summary Table

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Scope** | One agent + config overlays | Maintainability, consistency, reusability |
| **Authorization** | Hybrid (repo → org → fallback) | Flexibility, security, resilience |
| **WordPress** | Opt-in categories | Simplicity for `.github`, power for plugins/themes |
| **Testing** | Unit 90% + Integration + E2E | Fast feedback + realism + coverage |
| **Documentation** | 8+ Mermaid diagrams | Clarity, onboarding, reduces questions |
| **Location** | Split (planning/.github, code/scripts) | Separation of concerns, portability |

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and thoughtful architecture!*

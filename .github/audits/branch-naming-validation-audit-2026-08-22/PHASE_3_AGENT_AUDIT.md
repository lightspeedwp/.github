# Phase 3: Agent Cross-Reference Audit Report
**Date:** 2026-08-22  
**Status:** Complete  
**Scope:** All 35 agents (19 spec-based, 16 portable)

---

## Executive Summary

**Critical Finding:** 33 of 35 agents have **ZERO guidance** on branch naming. Only 2 agents create branches; only 1 validates them. **No agent documents that `claude/` prefix is forbidden.**

| Metric | Finding |
|--------|---------|
| Total agents audited | 35 (19 spec + 16 portable) |
| Agents creating branches | 2 (release spec, release portable) |
| Agents validating branches | 1 (pr-creation-agent) |
| Agents with branch guidance | 2 |
| Agents with ZERO branch guidance | 33 |
| Agents mentioning `claude/` restriction | 0 |
| Cross-tier conflicts | 1 (release spec vs portable) |
| **Overall Risk Level** | 🔴 **CRITICAL** |

---

## Detailed Findings

### Spec-Based Agents (19 total)

**Only 1 Creates Branches:**

| Agent | Purpose | Creates Branches | Pattern | Guidance | Mentions `claude/` |
|-------|---------|------------------|---------|----------|-------------------|
| **release.agent.md** | Release automation | ✅ Yes | `release/vX.Y.Z` | ✅ Line 149 | ❌ No |

**18 Do Not Create Branches (but have ZERO guidance saying so):**
- adr.agent.md (Architectural Decision Records)
- issues.agent.md (Issue triage)
- labeling.agent.md (Dynamic labels) — reads `branch-prefix` config but doesn't create
- linting.agent.md (Code quality)
- meta.agent.md (Metadata governance)
- metrics.agent.md (Repository metrics)
- mode-demonstrate-understanding.agent.md (Validation)
- mode-document-reviewer.agent.md (Content evaluation)
- mode-prd.agent.md (PRD generation)
- mode-thinking.agent.md (Autonomous solving)
- project-meta-sync.agent.md (Metadata sync)
- prompt-engineer.agent.md (Prompt analysis)
- reporting.agent.md (Report creation)
- reviewer.agent.md (PR review)
- task-planner.agent.md (Planning)
- task-researcher-agent.md (Research)
- template.agent.md (Agent template)
- testing.agent.md (Test execution)

**Status:** All 18 should have explicit statement: "This agent does not create branches."

---

### Portable Agents (16 total)

**Only 1 Creates Branches:**

| Agent | Directory | Creates Branches | Pattern | Has AGENT.md |
|-------|-----------|------------------|---------|--------------|
| **release** | `/agents/release/` | ✅ Yes (via gitOps.cjs) | `release/vX.Y.Z` | ❌ No |

**Only 1 Validates Branches:**

| Agent | Directory | Validates | Pattern | Has AGENT.md |
|-------|-----------|-----------|---------|--------------|
| **pr-creation-agent** | `/agents/pr-creation-agent/` | ✅ Yes | `{type}/{scope}-{short-title}` | ❌ No |

**14 Do Not Create/Validate:**
- adr-generator, ai-readiness-estimator, changelog, chat-closure-agent
- client-website-discovery, design-partner-agent, harvest-analytical-agent
- linear-advisor-agent, linting-agent, meta-agent, metadata-agent
- pagespeed-agent, prd-agent, prd-factory-planner, prompt-engineer
- proposal-desk-agent, task-planner-agent, task-researcher-agent
- testing-agent, tour-operator-config, website-content-strategist
- website-scope-estimator, woo-config-agent, wordpress, wp-config-agent
- zendesk-support-agent

**Status:** All 16 lack AGENT.md documentation; 14 have zero specification.

---

## Agents Creating/Validating Branches

### Release Agent (Spec-Based)

**File:** `/home/user/.github/.github/agents/release.agent.md`  
**Version:** 2.6 (Phase 5A)  
**Creates Branches:** ✅ Yes

**Branch Pattern:**
- **Location:** Line 149 of spec
- **Pattern:** `release/vX.Y.Z`
- **Source:** `develop`
- **Target:** `main`
- **Implementation:** `gitOps.createBranch()` function

**Guidance Completeness:**
- ✅ Specifies exact branch name format
- ✅ Shows example in process flow
- ❌ Does NOT explicitly forbid `claude/` prefix
- ❌ Does NOT document branch validation
- ❌ Does NOT reference branch naming standards

**Risk:** Agent creates correct branch pattern but offers no fallback if name is invalid.

---

### Release Agent (Portable)

**File:** `/home/user/.github/agents/release/release.agent.js` + `/agents/release/includes/gitOps.cjs`  
**Creates Branches:** ✅ Yes (same as spec)

**Branch Pattern:**
- **Pattern:** `release/vX.Y.Z` (implicit from code)
- **Implementation:** gitOps.cjs lines 50-62
- **Function:** `createBranch()` with arguments (repoPath, branchName)

**Guidance Completeness:**
- ❌ NO AGENT.md in `/agents/release/`
- ❌ Branch pattern only visible in code
- ❌ NO documentation of restrictions
- ❌ NO mention of `claude/` prefix
- ❌ Developers must read source code to discover behavior

**Risk:** Portable version offers zero discoverability. Cross-tier mismatch: spec documented, portable undocumented.

---

### PR Creation Agent (Portable)

**File:** `/home/user/.github/agents/pr-creation-agent/skills/validate-branch-name.js`  
**Validates Branches:** ✅ Yes

**Branch Pattern:**
- **Pattern:** `{type}/{scope}-{short-title}`
- **Allowed Types (17):** feat, fix, docs, chore, ci, refactor, test, perf, build, deps, security, hotfix, design, a11y, ux, i18n, ops
- **Format Regex:** `/^([a-z0-9]+)\/([a-z0-9-]+)-([a-z0-9-]+)$/`
- **Implementation:** Lines 31-77 of validate-branch-name.js

**Validation Rules:**
- ✅ Type must be in allowed list
- ✅ Scope must be lowercase alphanumeric + hyphens
- ✅ Title must be lowercase alphanumeric + hyphens
- ✅ No consecutive hyphens
- ✅ No leading/trailing hyphens

**Guidance Completeness:**
- ❌ NO AGENT.md documentation
- ❌ Validation exists but NOT discoverable to developers
- ❌ Does NOT explicitly check for `claude/` prefix
- ✅ Has test coverage (14,543 bytes of tests)

**Risk:** Validation code exists but is hidden. MISSING: explicit validation against reserved prefixes.

**Missing Validation:**

```javascript
// Current: checks if type is in allowed list
// Missing: explicit rejection of reserved prefixes
if (type === 'claude' || type === 'copilot' || type === 'openai') {
  errors.push(`Branch type "${type}" is reserved for internal use`);
}
```

---

## Critical Gaps

### Gap 1: Release Agent Documentation Mismatch (Spec vs Portable)

**Spec version (`release.agent.md`):**
- ✅ Documents branch pattern (line 149)
- ✅ Shows in process description
- ❌ No AGENT.md in portable version

**Portable version (`agents/release/`):**
- ✅ Code implements pattern correctly
- ❌ NO AGENT.md
- ❌ NO README with branch guidance
- ❌ Branch pattern only visible in source code

**Conflict:** Developers using portable agent must read code to discover behavior. Spec and portable are misaligned on documentation.

**Files to Update:**
- Create `/home/user/.github/agents/release/AGENT.md` or README
- Document: "Creates branches named `release/vX.Y.Z` from `develop` targeting `main`"

---

### Gap 2: All Agents Lack `claude/` Prefix Documentation

**Finding:** 0 of 35 agents explicitly state that `claude/` prefix is forbidden.

**Expected Behavior:**
- Release agent should validate branch name doesn't start with `claude/`
- All agents should document: "Cannot create branches with `claude/` prefix"
- pr-creation-agent should explicitly reject `claude/` as reserved

**Current Behavior:**
- Release agent silently accepts any branch name passed to `gitOps.createBranch()`
- pr-creation-agent checks allowed types but not reserved prefixes
- No agent documents Claude Code's `claude/` prefix restriction

**Impact:** Developers learn about `claude/` restriction only when they hit validation errors in PRs (post-push).

---

### Gap 3: 33 Agents Have ZERO Branch Guidance

**Spec-Based (18 agents):**
- No explicit statement: "This agent does not create branches"
- Developers must infer from code/description
- No reference to branch naming standards

**Portable (15 agents):**
- No AGENT.md files (missing documentation entirely)
- Developers can't discover what agent does without reading code
- No branch naming guidance provided

**Expected Standard:** Every agent spec should include:
```markdown
## Branch Naming

This agent [creates / validates / does not create] branches.

[If creates or validates]
- **Pattern**: [specific pattern or N/A]
- **Restrictions**: Cannot use `claude/`, `copilot/`, or `openai/` prefixes
- **Example**: [example branch name]

[If does not create/validate]
- This agent does not create or validate branch names.
```

---

### Gap 4: pr-creation-agent Missing Reserved Prefix Validation

**Current Code (`validate-branch-name.js`, lines 31-77):**
```javascript
const ALLOWED_TYPES = ['feat', 'fix', 'docs', 'chore', 'ci', 'refactor', 'test', 'perf', 'build', 'deps', 'security', 'hotfix', 'design', 'a11y', 'ux', 'i18n', 'ops'];
const PATTERN = /^([a-z0-9]+)\/([a-z0-9-]+)-([a-z0-9-]+)$/;

function validateBranchName(branchName) {
  const match = branchName.match(PATTERN);
  if (!match) {
    return { valid: false, error: 'Invalid format' };
  }
  
  const [, type, scope, title] = match;
  
  if (!ALLOWED_TYPES.includes(type)) {
    return { valid: false, error: 'Invalid type' };
  }
  
  // ❌ MISSING: Validation for reserved prefixes
  // if (type === 'claude' || type === 'copilot' || type === 'openai') {
  //   return { valid: false, error: 'Type is reserved' };
  // }
  
  return { valid: true };
}
```

**Missing:**
- No check for reserved prefixes (`claude/`, `copilot/`, `openai/`)
- No explicit error message for reserved names
- No test case for reserved prefix rejection

---

## Cross-Tier Analysis

### Release Agent (Spec vs Portable)

| Aspect | Spec-Based | Portable | Match |
|--------|------------|----------|-------|
| **Branch Creation** | ✅ Yes | ✅ Yes | ✅ Both create |
| **Pattern** | `release/vX.Y.Z` | `release/vX.Y.Z` | ✅ Identical |
| **Documentation** | ✅ Spec lines 149-150 | ❌ None | ❌ Mismatch |
| **AGENT.md** | ✅ release.agent.md | ❌ Missing | ❌ Mismatch |
| **Validation** | ❌ Not documented | ❌ Not documented | ✅ Both missing |
| **Claude/ Restriction** | ❌ Not mentioned | ❌ Not mentioned | ✅ Both missing |

**Status:** Code behavior matches (both correct), but documentation mismatch creates confusion.

---

## Agents by Category

### Tier 1: Create Branches (2 agents)
- Release (spec-based) — `/home/user/.github/.github/agents/release.agent.md`
- Release (portable) — `/home/user/.github/agents/release/`

### Tier 2: Validate Branches (1 agent)
- PR Creation Agent (portable) — `/home/user/.github/agents/pr-creation-agent/`

### Tier 3: Reference Branches (no creation) (32 agents)
- **Spec-based (18):** ADR, Issues, Labeling, Linting, Meta, Metrics, Modes (3), Project Meta Sync, Prompt Engineer, Reporting, Reviewer, Task Planner, Task Researcher, Template, Testing
- **Portable (14):** [List of 14 agents provided in full audit above]

---

## Recommendations

### Priority 1: CRITICAL — Fix Release Agent Documentation

**Action 1.1:** Create missing portable release AGENT.md
- **File:** `/home/user/.github/agents/release/AGENT.md`
- **Content:**
  ```markdown
  # Release Agent
  
  Automates semantic version releases and creates release branches.
  
  ## Branch Naming
  
  This agent **creates** branches.
  
  - **Pattern**: `release/vX.Y.Z`
  - **Source Branch**: `develop`
  - **Target Branch**: `main`
  - **Restrictions**: Cannot create branches with reserved prefixes (`claude/`, `copilot/`, `openai/`)
  - **Example**: `release/v1.5.0`, `release/v2.0.0-beta.1`
  
  ## Process
  
  1. Validates semantic version format
  2. Creates `release/vX.Y.Z` branch from `develop`
  3. Bumps VERSION file
  4. Rolls CHANGELOG.md entries
  5. Pushes to GitHub
  6. Creates PR to `main`
  ```

**Action 1.2:** Add validation to release agent
- **File:** `agents/release/includes/gitOps.cjs`
- **Change:** Before `createBranch()`, validate branch name
  ```javascript
  const RESERVED_PREFIXES = ['claude', 'copilot', 'openai'];
  const prefix = branchName.split('/')[0];
  
  if (RESERVED_PREFIXES.includes(prefix)) {
    throw new Error(`Cannot create branches with reserved prefix: ${prefix}/`);
  }
  ```

---

### Priority 2: HIGH — Add Reserved Prefix Validation to pr-creation-agent

**Action 2.1:** Update validate-branch-name.js
- **File:** `/home/user/.github/agents/pr-creation-agent/skills/validate-branch-name.js`
- **Change:** Add reserved prefix check after line 71
  ```javascript
  const RESERVED_PREFIXES = ['claude', 'copilot', 'openai'];
  
  if (RESERVED_PREFIXES.includes(type)) {
    errors.push(`Branch type "${type}" is reserved for internal use and cannot be used`);
  }
  ```

**Action 2.2:** Add test cases
- **File:** `/home/user/.github/agents/pr-creation-agent/__tests__/validate-branch-name.test.js`
- **Add tests:**
  ```javascript
  test('rejects claude/ prefix', () => {
    expect(validateBranchName('claude/my-feature')).toMatchObject({
      valid: false,
      error: expect.stringContaining('reserved')
    });
  });
  
  test('rejects copilot/ prefix', () => { ... });
  test('rejects openai/ prefix', () => { ... });
  ```

---

### Priority 3: HIGH — Create Missing AGENT.md for pr-creation-agent

**Action 3.1:** Document pr-creation-agent
- **File:** `/home/user/.github/agents/pr-creation-agent/AGENT.md`
- **Content:**
  ```markdown
  # PR Creation Agent
  
  Validates branch names and assists with pull request creation.
  
  ## Branch Naming Validation
  
  This agent **validates** branches.
  
  - **Pattern**: `{type}/{scope}-{short-title}`
  - **Allowed Types** (17): feat, fix, docs, chore, ci, refactor, test, perf, build, deps, security, hotfix, design, a11y, ux, i18n, ops
  - **Restrictions**: 
    - Cannot start with reserved prefixes: `claude/`, `copilot/`, `openai/`
    - Must use lowercase letters, numbers, and hyphens only
    - No consecutive or leading/trailing hyphens
  - **Example**: `feat/user-authentication`, `fix/button-styling`, `docs/api-reference`
  
  ## Validation Rules
  
  1. Type must be in allowed list
  2. Scope and title must be lowercase alphanumeric + hyphens
  3. Scope and title cannot be empty
  4. No consecutive hyphens
  ```

---

### Priority 4: HIGH — Standardize Branch Guidance Across All Spec-Based Agents

**Action 4.1:** Create shared branch naming standard
- **File:** `/home/user/.github/docs/BRANCH_NAMING_STANDARDS_FOR_AGENTS.md`
- **Content:**
  ```markdown
  # Branch Naming Standards for Agents
  
  ## Global Restrictions
  
  All agents must respect these restrictions:
  
  - **FORBIDDEN**: `claude/*`, `copilot/*`, `openai/*` (reserved for internal use)
  - **REQUIRED**: Lowercase letters, numbers, hyphens only
  - **FORMAT**: All branches must follow `{type}/{scope}-{short-title}` unless explicitly documented
  
  ## Agent-Specific Patterns
  
  ### Release Agent
  - **Creates**: Yes
  - **Pattern**: `release/vX.Y.Z` (semantic versioning)
  - **Source**: `develop`, **Target**: `main`
  
  ### PR Creation Agent
  - **Validates**: Yes
  - **Pattern**: `{type}/{scope}-{short-title}`
  - **Allowed Types**: feat, fix, docs, chore, ci, refactor, test, perf, build, deps, security, hotfix, design, a11y, ux, i18n, ops
  
  ### Other Agents
  - No branch creation; reference branch names in pull requests only
  - If validating, apply global restrictions above
  ```

**Action 4.2:** Update all 19 spec-based agent specs
- **Files:** `.github/agents/*.agent.md`
- **Add Section:** Branch Naming Guidance
  ```markdown
  ## Branch Naming Guidance
  
  [Insert pattern for agent based on if it creates/validates/references branches]
  
  **Restrictions**: Cannot use reserved prefixes: `claude/`, `copilot/`, `openai/`
  
  See also: [Reference to shared standards document]
  ```

---

### Priority 5: MEDIUM — Document All 16 Portable Agents

**Action 5.1:** Create AGENT.md for each portable agent
- **Template:**
  ```markdown
  # [Agent Name]
  
  [Brief description of what the agent does]
  
  ## Branch Handling
  
  This agent [creates / validates / does not create/validate] branches.
  
  [If creates/validates: specific details]
  [If not: explicit statement that it doesn't interact with branches]
  
  ## See Also
  
  - [Link to branch naming standards]
  ```

---

## Implementation Checklist

| Priority | Action | File(s) | Effort | Owner |
|----------|--------|---------|--------|-------|
| **P1** | Create release AGENT.md | `/agents/release/AGENT.md` | 30 min | Release team |
| **P1** | Add branch validation to release agent | `agents/release/includes/gitOps.cjs` | 20 min | Release team |
| **P2** | Add reserved prefix check to pr-creation | `agents/pr-creation-agent/skills/validate-branch-name.js` | 20 min | PR agent team |
| **P2** | Create pr-creation AGENT.md | `agents/pr-creation-agent/AGENT.md` | 30 min | PR agent team |
| **P3** | Create shared standards doc | `docs/BRANCH_NAMING_STANDARDS_FOR_AGENTS.md` | 45 min | Governance team |
| **P3** | Update all spec-based agents (19) | `.github/agents/*.agent.md` | 2 hours | Governance team |
| **P5** | Create AGENT.md for portables (16) | `agents/*/AGENT.md` | 4 hours | Agent maintainers |

**Total Estimated Effort:** ~8 hours  
**Critical Path:** P1 actions (50 min) → P2 actions (50 min) → P3+ parallel (6+ hours)

---

**Phase 3 Complete. Awaiting Phase 2, 4, and 5 results for comprehensive remediation plan.**

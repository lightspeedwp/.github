# Phase 6: Comprehensive Remediation Plan
**Date:** 2026-08-22  
**Status:** Final  
**Scope:** All findings from Phases 1-5 synthesized into ordered action items

---

## Executive Summary

The branch naming validation audit revealed **11 critical/high-impact issues** and **18 medium/low-impact gaps**. Root causes:

1. **Claude Code hardcoded `claude/` prefix** — Unfixable without tool update; requires agent-level workarounds
2. **Validation script divergence** — `.cjs` and `.js` use different patterns; creates false confidence
3. **Agent instruction gaps** — 33/35 agents have zero branch guidance; agents inherit Claude Code's forbidden default
4. **Post-release sync violation** — Uses `chore/post-release-sync-main-to-develop` (forbidden prefix)
5. **Documentation scattered** — Discoverability 5.7/10 for agents; no portable instruction standard

**Total Estimated Effort:** 32–40 hours  
**Critical Path (Minimum Viable Fix):** 12–14 hours (Phases P1-P2 only)

---

## Issue Prioritization & Severity Matrix

### Phase P1: CRITICAL (Do First — Blocks Release/Hotfix)

| ID | Issue | Impact | Effort | Owner |
|----|-------|--------|--------|-------|
| **P1.1** | Unify validation scripts (.cjs vs .js divergence) | Developers get false confidence; invalid branches pass workflow | 3–4h | Validation team |
| **P1.2** | Post-release sync uses forbidden `chore/` prefix | Release pipeline creates branches that violate governance | 1–2h | Release team |
| **P1.3** | Add `claude/` prefix explicit validation | Currently blocked by ALLOWED_TYPES membership, not explicit check | 1h | Validation team |
| **P1.4** | Update PR template routing to reject invalid prefixes | Currently silent-fails; routes `claude/` to default template | 2–3h | PR template team |

**Total P1 Effort:** 7–10 hours | **Timeline:** 1 sprint

### Phase P2: HIGH (Must Fix Soon — Improves Guidance)

| ID | Issue | Impact | Effort | Owner |
|----|-------|--------|--------|-------|
| **P2.1** | Add branch guidance to all 19 spec-based agents | Agents unaware of branch naming rules | 2–3h | Agent maintainers |
| **P2.2** | Create `instructions/branch-naming.instructions.md` | Agents lack portable instruction standard | 1–2h | Documentation team |
| **P2.3** | Add branch validation to release agent (pre-creation) | Branch names validated only after push | 1–2h | Release team |
| **P2.4** | Update 7-layer safety gates to include branch name validation | Release pipeline doesn't validate branch names | 1–2h | Release gates team |
| **P2.5** | Add branch naming section to all agent spec templates | Future agents will lack guidance | 1h | Agent governance team |

**Total P2 Effort:** 6–9 hours | **Timeline:** Sprint +1

### Phase P3: MEDIUM (Important — Improves Discoverability)

| ID | Issue | Impact | Effort | Owner |
|----|-------|--------|--------|-------|
| **P3.1** | Create quick reference card (QUICK_REFERENCE_BRANCH_NAMING.md) | Users must read 667-line spec; need one-page summary | 1–2h | Documentation team |
| **P3.2** | Add branch naming checklist to CLAUDE.md | Developers need before-push verification | 30min | Documentation team |
| **P3.3** | Update AGENTS.md section (expand from 12 lines) | Current 1.9% coverage insufficient for AI agents | 1–2h | Documentation team |
| **P3.4** | Update agent AGENT.md files to reference branch rules | 16 portable agents lack specs | 2–3h | Agent maintainers |
| **P3.5** | Add validation setup links to key documentation | Users discover hook/troubleshooting slowly | 30min | Documentation team |

**Total P3 Effort:** 5–9 hours | **Timeline:** Sprint +1

### Phase P4: LOW (Nice-to-Have — Infrastructure)

| ID | Issue | Impact | Effort | Owner |
|----|-------|--------|--------|-------|
| **P4.1** | Create `.github/guides/BRANCH_NAMING_FOR_DEVELOPERS.md` | Practical walkthrough for first-time users | 2–3h | Documentation team |
| **P4.2** | Update AGENT_STANDARDS.md with branch guidance requirement | Future agents will follow standard | 1h | Agent governance team |
| **P4.3** | Create onboarding module for branch naming | New contributors learn rules on day 1 | 1–2h | Onboarding team |
| **P4.4** | Add branch validation metrics and tracking | No visibility into validation failures | 2–3h | Metrics team |

**Total P4 Effort:** 6–9 hours | **Timeline:** Sprint +2

---

## Detailed Remediation Items

### P1.1: Unify Validation Scripts (`.cjs` vs `.js` Divergence)

**Problem:** Two validation scripts enforce different patterns:
- `.cjs` (pre-commit hook) — Strict: `{type}/{scope}-{title}` with no dots/dashes at edges
- `.js` (GitHub workflow) — Permissive: `{type}/{anything}` allows dots, leading/trailing dashes

**Evidence:** Phase 2 testing showed:
- `release/v1.0.0` — FAILS .cjs, PASSES .js ❌
- `chore/release` — FAILS .cjs, PASSES .js ❌
- `feat/-dash-start` — FAILS .cjs, PASSES .js ❌

**Solution:** Standardize on `.cjs` pattern (matches BRANCHING_STRATEGY.md spec)

**Implementation Steps:**

1. **Update `.github/workflows/branch-name-validation.yml` (Line 61)**
   ```yaml
   # Change from:
   - run: node scripts/validation/validate-branch-name.js ${{ github.head_ref }}
   
   # To:
   - run: node scripts/validation/validate-branch-name.cjs ${{ github.head_ref }}
   ```

2. **Update `.github/scripts/validation/validate-branch-name.js`**
   - Option A: Convert to use .cjs pattern (preferred for consistency)
   - Option B: Deprecate .js version, link to .cjs

3. **Add regression tests** (in `.github/scripts/validation/__tests__/`)
   ```javascript
   test('both scripts enforce identical pattern', () => {
     const cjs_result = validateViaCjs('release/v1.0.0');
     const js_result = validateViaJs('release/v1.0.0');
     expect(cjs_result.valid).toBe(js_result.valid);
   });
   ```

4. **Document the change** in BRANCHING_STRATEGY.md (Line 180)
   ```markdown
   **Note:** Both pre-commit hook and GitHub Actions workflow use identical validation pattern as of [date]. No divergence.
   ```

**Testing:**
- Run test matrix from Phase 2 findings
- Confirm `release/v1.0.0`, `chore/release`, `feat/-dash` fail consistently in both tools

**Owner:** Validation team  
**Effort:** 3–4 hours  
**Timeline:** Week 1

---

### P1.2: Fix Post-Release Sync Branch Naming

**Problem:** `scripts/workflows/release/post-release-sync.cjs` (Line 35) uses:
```javascript
const syncBranch = "chore/post-release-sync-main-to-develop";
```

This violates branch naming rules (forbidden prefix in a branch name context).

**Solution:** Use `ops/` prefix (valid for operational branches)

**Implementation Steps:**

1. **Update `scripts/workflows/release/post-release-sync.cjs` (Lines 35–38)**
   ```javascript
   // Current (WRONG):
   const syncBranch = "chore/post-release-sync-main-to-develop";
   
   // Change to:
   const timestamp = new Date().getTime();
   const syncBranch = `ops/post-release-sync-main-to-develop-${timestamp}`;
   ```

2. **Update branch cleanup logic (Line 38)**
   - Ensure old sync branches are cleaned up after merge

3. **Update PR title (Line 107)**
   ```javascript
   // Update from:
   const title = `chore: Post-release sync (main → develop)`;
   
   // To (commit message can still use chore, but branch name uses ops):
   const title = `ops: Post-release sync (main → develop)`;
   ```

4. **Update release agent documentation (`.github/agents/release.agent.md`)**
   - Document that post-release sync creates `ops/` prefix branches

**Testing:**
- Run release workflow end-to-end
- Verify sync branch is created with `ops/` prefix
- Verify sync branch passes all validation

**Owner:** Release team  
**Effort:** 1–2 hours  
**Timeline:** Week 1

---

### P1.3: Add Explicit `claude/` Prefix Validation

**Problem:** `claude/` prefix is forbidden but blocked implicitly (not in ALLOWED_TYPES). Relies on list membership, not explicit check.

**Solution:** Add explicit validation check

**Implementation Steps:**

1. **Update `.github/scripts/validation/validate-branch-name.cjs` (After Line 42)**
   ```javascript
   // Add reserved prefix list
   const RESERVED_PREFIXES = ['claude', 'copilot', 'openai'];
   
   // Add check (before ALLOWED_TYPES check):
   function validateBranchName(branch) {
     const [type] = branch.split('/');
     
     // Check reserved prefixes FIRST
     if (RESERVED_PREFIXES.includes(type)) {
       return {
         valid: false,
         error: `Branch type "${type}" is reserved for internal use and cannot be used. Use one of the allowed prefixes instead.`
       };
     }
     
     // Then check allowed types
     if (!ALLOWED_TYPES.includes(type)) {
       return { valid: false, error: `Invalid branch type: "${type}"` };
     }
     
     // ... rest of validation
   }
   ```

2. **Update `.github/agents/pr-creation-agent/skills/validate-branch-name.js` (Line 72)**
   ```javascript
   // Add same reserved prefix check before type validation
   if (RESERVED_PREFIXES.includes(type)) {
     errors.push(`Branch type "${type}" is reserved for internal use`);
   }
   ```

3. **Add test cases** (in `__tests__/validate-branch-name.test.cjs`)
   ```javascript
   test('rejects claude/ prefix explicitly', () => {
     const result = validateBranchName('claude/my-feature');
     expect(result.valid).toBe(false);
     expect(result.error).toContain('reserved');
   });
   
   test('rejects copilot/ prefix', () => { ... });
   test('rejects openai/ prefix', () => { ... });
   ```

4. **Document in BRANCHING_STRATEGY.md (Section 3.0)**
   ```markdown
   ### Reserved Prefixes (Cannot Be Used)
   
   The following prefixes are reserved for system use and **cannot be used** for branch names:
   - `claude/` — Reserved for Claude Code internal session branches
   - `copilot/` — Reserved for GitHub Copilot integration
   - `openai/` — Reserved for OpenAI API integration
   
   Attempting to create a branch with these prefixes will be **rejected** by validation.
   ```

**Testing:**
- Run validation script with `claude/test` (should reject)
- Run validation script with `feat/test` (should accept)
- Run GitHub Actions workflow; verify check fails on `claude/` prefix

**Owner:** Validation team  
**Effort:** 1 hour  
**Timeline:** Week 1

---

### P1.4: Update PR Template Routing to Reject Invalid Prefixes

**Problem:** `.github/PULL_REQUEST_TEMPLATE/config.yml` routes all unmatched prefixes to default template instead of rejecting them.

**Solution:** Add explicit validation before template selection

**Implementation Steps:**

1. **Create new validation step in branch-name-validation.yml (Line 62)**
   ```yaml
   - name: Validate branch is routable to template
     run: |
       BRANCH="${{ github.head_ref }}"
       TYPE=$(echo "$BRANCH" | cut -d'/' -f1)
       
       VALID_TYPES="feat|fix|hotfix|release|refactor|chore|docs|test|perf|ci|build|deps|security|revert|research|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry|content|seo|config|migrate|qa|uat|audit|codex"
       RESERVED_TYPES="claude|copilot|openai"
       
       if echo "$TYPE" | grep -qE "^($RESERVED_TYPES)$"; then
         echo "::error::Branch type '$TYPE' is reserved and cannot be used"
         exit 1
       fi
       
       if ! echo "$TYPE" | grep -qE "^($VALID_TYPES)$"; then
         echo "::warning::Branch type '$TYPE' is not recognized. Routing to default template."
       fi
   ```

2. **Update config.yml to document behavior (Line 1)**
   ```yaml
   # PR Template Routing Configuration
   # 
   # All branches must use a valid prefix (see BRANCHING_STRATEGY.md).
   # Reserved prefixes (claude/, copilot/, openai/) are explicitly rejected.
   # Unmatched prefixes route to the default template (see below).
   
   default_template: pr_feature.md  # Fallback for unrecognized prefixes
   
   routes:
     feat/: pr_feature.md
     ... (existing routes)
   ```

3. **Add explicit comment for unmatched prefixes**
   ```yaml
   # Unmatched Prefixes:
   # proto/ → pr_feature.md (not explicitly routed; uses default)
   # (Add new routes here when new prefix types are added)
   ```

**Testing:**
- Test PR with `feat/` branch — routes to `pr_feature.md` ✅
- Test PR with `claude/` branch — validation fails before template routing ✅
- Test PR with `unknown/` branch — routes to default with warning ✅

**Owner:** PR template team  
**Effort:** 2–3 hours  
**Timeline:** Week 1

---

### P2.1: Add Branch Guidance to All 19 Spec-Based Agents

**Problem:** None of the 19 agents in `.github/agents/` mention branch naming rules.

**Solution:** Add standardized branch naming section to each spec

**Implementation Steps:**

1. **Create agent branch guidance template** (Document for all maintainers)
   ```markdown
   ## Branch Naming Guidance
   
   This agent [creates / validates / references] branches.
   
   [If creates:]
   - **Pattern**: [specific pattern, e.g., `release/vX.Y.Z`]
   - **Restrictions**: Cannot use reserved prefixes: `claude/`, `copilot/`, `openai/`
   - **Example**: [example branch]
   - See also: [BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md) for complete rules
   
   [If validates:]
   - **Validates against**: [pattern, e.g., `{type}/{scope}-{short-title}`]
   - **Allowed types**: [comma-separated list or reference]
   - See also: [BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md)
   
   [If references only:]
   - This agent does not create or validate branches. It may reference branch names in pull requests.
   - All branches must follow: [BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md)
   ```

2. **Update each of 19 agents** (`.github/agents/*.agent.md`)
   - Add section after "## Process" or "## Inputs" sections
   - Use template above with agent-specific details

3. **Agent-specific updates:**
   - **release.agent.md** (already partially has guidance; expand)
   - **labeling.agent.md**, **linting.agent.md**, **testing.agent.md** — Add "validates" guidance
   - **All others** — Add "does not create/validate" disclaimer

4. **Add to AGENT_STANDARDS.md** (Line 50, new section)
   ```markdown
   ### Branch Naming Guidance (Required)
   
   Every agent spec MUST include a "Branch Naming Guidance" section documenting:
   1. Whether the agent creates, validates, or references branches
   2. If creating/validating: specific pattern or rules
   3. Link to [BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md)
   
   Use the template above for consistency.
   ```

**Testing:**
- Read each updated agent spec
- Verify branch guidance is present and accurate
- Verify links to BRANCHING_STRATEGY.md are correct

**Owner:** Agent maintainers (distributed)  
**Effort:** 2–3 hours (distributed across team)  
**Timeline:** Week 1–2

---

### P2.2: Create Portable Branch Naming Instruction File

**Problem:** No standard instruction file for agents to reference; guidance scattered across docs.

**Solution:** Create `instructions/branch-naming.instructions.md`

**Implementation Steps:**

1. **Create `instructions/branch-naming.instructions.md`**
   ```markdown
   ---
   title: Branch Naming Standards
   description: Governance rules for all Git branches across LightSpeedWP projects
   version: 1.0
   status: active
   role_declaration: |
     You are an AI agent that creates or validates Git branches.
     You must enforce these standards without exception.
     Forbidden prefixes cannot be used under any circumstance.
   ---
   
   # Branch Naming Standards for AI Agents
   
   ## Global Restrictions
   
   - **FORBIDDEN PREFIXES**: `claude/`, `copilot/`, `openai/`
     - These are reserved for system use
     - Reject any branch starting with these prefixes immediately
   
   - **REQUIRED FORMAT**: `{type}/{scope}-{short-title}`
     - All lowercase letters, numbers, hyphens only
     - No underscores, dots (except in version numbers), or spaces
   
   ## Allowed Prefixes (31 types)
   
   ### Core (18 prefixes)
   feat, fix, hotfix, release, refactor, chore, docs, test, perf, ci, build, deps, security, revert, research, design, a11y, ux, i18n, ops
   
   ### Product-Specific (5 prefixes)
   proto, ds, api, schema, telemetry
   
   ### Content (3 prefixes)
   content, seo, config, migrate, qa, uat, audit, codex
   
   ### Additional
   codex
   
   **Note:** All 31 prefixes are case-sensitive (lowercase only).
   
   ## Examples
   
   ### ✅ Valid Branch Names
   - `feat/user-authentication` (type=feat, scope=user, title=authentication)
   - `fix/button-styling` (type=fix, scope=button, title=styling)
   - `release/v2.6.0` (type=release, version=v2.6.0)
   - `docs/api-reference` (type=docs, scope=api, title=reference)
   - `hotfix/critical-security-patch` (type=hotfix, scope=critical, title=security-patch)
   
   ### ❌ Invalid Branch Names
   - `claude/my-feature` ← FORBIDDEN PREFIX
   - `feat/MyFeature` ← UPPERCASE NOT ALLOWED
   - `feat/my_feature` ← UNDERSCORES NOT ALLOWED
   - `feat/my-feature--test` ← CONSECUTIVE HYPHENS NOT ALLOWED
   - `chore/release` ← Should be `release/vX.Y.Z` for releases
   
   ## Validation Command
   
   ```bash
   npm run validate:branch-name -- --branch $(git branch --show-current)
   ```
   
   Must return exit code 0 for valid branch names.
   
   ## References
   
   - [BRANCHING_STRATEGY.md](../docs/BRANCHING_STRATEGY.md) — Complete specification
   - [CLAUDE.md](../.github/CLAUDE.md) — AI governance rules
   - Validation script: `.github/scripts/validation/validate-branch-name.cjs`
   ```

2. **Link from AGENTS.md** (Replace lines 161-172)
   ```markdown
   ## Branch Naming
   
   See [instructions/branch-naming.instructions.md](../instructions/branch-naming.instructions.md) for complete rules.
   
   **Key Rule:** Do NOT use `claude/`, `copilot/`, or `openai/` as branch prefixes — these are forbidden.
   ```

3. **Link from CLAUDE.md** (Add after line 120)
   ```markdown
   - **Detailed Rules:** See [instructions/branch-naming.instructions.md](../instructions/branch-naming.instructions.md) for comprehensive standards and examples.
   ```

**Testing:**
- Agents can read and follow the file
- All examples work with validation script
- Links are correct and resolvable

**Owner:** Documentation team  
**Effort:** 1–2 hours  
**Timeline:** Week 1

---

### P2.3: Add Branch Validation to Release Agent (Pre-Creation)

**Problem:** Branch names are validated only after push (workflow check); no pre-creation validation.

**Solution:** Add validation before `git checkout -b`

**Implementation Steps:**

1. **Update `scripts/agents/release.agent.js` (Lines 1283–1296)**
   ```javascript
   const releaseBranch = `release/v${nextVersion}`;
   
   // NEW: Validate branch name before creation
   const { validateBranchName } = require("../validation/validate-branch-name.cjs");
   const validation = validateBranchName(releaseBranch);
   
   if (!validation.valid) {
     throw new Error(
       `Invalid release branch name "${releaseBranch}": ${validation.errors.join(", ")}. ` +
       `Check BRANCHING_STRATEGY.md for valid patterns.`
     );
   }
   
   if (!dryRun) {
     exec(`git checkout -b ${releaseBranch}`);
   } else {
     console.log(`[DRY-RUN] Would create branch ${releaseBranch}`);
   }
   ```

2. **Update portable release agent** (`agents/release/release.agent.js`)
   - Apply same validation logic before branch creation

3. **Add test case** (in `__tests__/`)
   ```javascript
   test('rejects invalid release branch names', () => {
     const invalidVersion = '1.0.0-invalid-prerelease';
     const branch = `release/v${invalidVersion}`;
     const validation = validateBranchName(branch);
     // Note: Depending on regex, this may or may not be valid; test accordingly
   });
   
   test('accepts valid semantic version branch names', () => {
     const versions = ['1.0.0', '2.6.0', '1.0.0-beta.1', '3.0.0-rc1'];
     versions.forEach(v => {
       const validation = validateBranchName(`release/v${v}`);
       expect(validation.valid).toBe(true);
     });
   });
   ```

**Testing:**
- Run release workflow with valid version (should create branch)
- Manually test with invalid version format (should fail with helpful error)

**Owner:** Release team  
**Effort:** 1–2 hours  
**Timeline:** Week 1–2

---

### P2.4: Update 7-Layer Safety Gates (Add Branch Validation)

**Problem:** Release safety gates (agents/release/gates/release-gates.cjs) don't validate branch names.

**Solution:** Add branch name gate (e.g., Gate 3.5)

**Implementation Steps:**

1. **Update `agents/release/gates/release-gates.cjs` (After line 277, after Gate 3)**
   ```javascript
   // Gate 3.5: Branch Name Validation
   gate3_5_branchNameValidation() {
     const expectedBranch = `release/v${this.nextVersion}`;
     const { validateBranchName } = require("../../../scripts/validation/validate-branch-name.cjs");
     const validation = validateBranchName(expectedBranch);
     
     if (!validation.valid) {
       this.results.gate3_5_branch_name.passed = false;
       this.results.gate3_5_branch_name.agentic_confidence = 0;
       this.results.gate3_5_branch_name.details.push(
         `❌ Branch name validation failed: ${expectedBranch}`,
         `Errors: ${validation.errors.join(", ")}`
       );
       return;
     }
     
     this.results.gate3_5_branch_name.passed = true;
     this.results.gate3_5_branch_name.agentic_confidence = 1.0;
     this.results.gate3_5_branch_name.details.push(
       `✅ Branch name valid: ${expectedBranch}`
     );
   }
   ```

2. **Update gate execution order** (run gate after Gate 3, before Gate 4)
   ```javascript
   // In runAllGates()
   this.gate3_versionConsistency();
   this.gate3_5_branchNameValidation(); // NEW
   this.gate4_tagUniqueness();
   ```

3. **Add to gates summary** (for agentic score calculation)
   - Weight branch name gate as medium importance (0.1x weight like others)

**Testing:**
- Run gates with valid version (should pass gate 3.5)
- Manually set invalid version; run gates (should fail gate 3.5)

**Owner:** Release gates team  
**Effort:** 1–2 hours  
**Timeline:** Week 1–2

---

### P2.5: Update Agent Spec Template Standards

**Problem:** Future agents won't know they should include branch guidance.

**Solution:** Add requirement to AGENT_STANDARDS.md

**Implementation Steps:**

1. **Update `docs/AGENT_STANDARDS.md` (Add new section)**
   ```markdown
   ## Section 5: Branch Naming Guidance
   
   Every agent specification MUST include a "Branch Naming Guidance" section.
   
   ### When to include:
   - **Always**: If agent creates branches
   - **Always**: If agent validates branch names
   - **Recommended**: If agent works with PRs or references branch names
   - **Optional**: If agent never interacts with branches (note: "This agent does not interact with branch names")
   
   ### Template:
   
   ```markdown
   ## Branch Naming Guidance
   
   [Choose one of the following blocks]
   
   ### Agent Creates Branches
   This agent creates Git branches as part of its workflow.
   
   - **Pattern**: `release/vX.Y.Z` (or your agent's pattern)
   - **Restrictions**: Cannot use reserved prefixes: `claude/`, `copilot/`, `openai/`
   - **Example**: `release/v2.6.0`
   - **Validation**: Must pass `npm run validate:branch-name`
   - See also: [Branch Naming Standards](../../instructions/branch-naming.instructions.md)
   
   ### Agent Validates Branches
   This agent validates branch names against governance rules.
   
   - **Pattern**: `{type}/{scope}-{short-title}`
   - **Allowed Types**: [list or reference to standard]
   - **Restrictions**: Rejects `claude/`, `copilot/`, `openai/` prefixes
   - **Validation Command**: `npm run validate:branch-name -- --branch <name>`
   - See also: [Branch Naming Standards](../../instructions/branch-naming.instructions.md)
   
   ### Agent References Branches (No Creation/Validation)
   This agent does not create or validate branch names but may reference them in documentation or pull requests.
   
   All branches must follow: [Branch Naming Standards](../../instructions/branch-naming.instructions.md)
   ```
   
   ### Enforcement:
   - CI linter will check for presence of branch guidance section
   - Agent specs without guidance will fail pre-merge validation
   ```

2. **Add to agent lint rules** (if lint tool exists)
   - Check for "## Branch Naming Guidance" section in agent specs
   - Warn if missing (or fail, per team decision)

**Testing:**
- Verify existing agents have section (15 will need to be added)
- Create new test agent spec; verify lint catches missing section

**Owner:** Agent governance team  
**Effort:** 1 hour  
**Timeline:** Week 2

---

## Supporting Items (P3 & P4 — Documentation)

### P3.1: Create Quick Reference Card

**File:** `.github/QUICK_REFERENCE_BRANCH_NAMING.md`  
**Effort:** 1–2 hours  
**Timeline:** Week 2

**Template:**
```markdown
# Branch Naming — Quick Reference

| Type | Format | Example |
|------|--------|---------|
| Feature | feat/{scope}-{feature} | feat/user-auth |
| Bug Fix | fix/{scope}-{fix} | fix/login-button |
| Release | release/vX.Y.Z | release/v2.6.0 |
| Hotfix | hotfix/{scope}-{fix} | hotfix/critical-bug |
| Docs | docs/{topic} | docs/api-guide |
| ... | ... | ... |

**Forbidden Prefixes:** `claude/`, `copilot/`, `openai/`  
**Format Rules:** Lowercase, hyphens only, no underscores

**Validate:** `npm run validate:branch-name -- --branch $(git branch --show-current)`

See [BRANCHING_STRATEGY.md](docs/BRANCHING_STRATEGY.md) for complete rules.
```

---

### P3.2: Add Branch Naming Checklist to CLAUDE.md

**Location:** After line 286  
**Effort:** 30 minutes

---

### P3.3: Expand AGENTS.md Section

**Current:** 12 lines (1.9%)  
**Target:** 50+ lines with examples  
**Effort:** 1–2 hours

---

### P3.4: Create AGENT.md for 16 Portable Agents

**Effort:** 2–3 hours (distributed)

---

### P3.5: Add Validation Setup Links

**Locations:** BRANCHING_STRATEGY.md, CLAUDE.md, AGENTS.md  
**Effort:** 30 minutes

---

## P4 & Implementation Checklist

### Complete Implementation Checklist

#### Phase P1 (Week 1 — Critical)
- [ ] P1.1: Unify validation scripts (.cjs vs .js) — Due: Day 3
  - [ ] Update branch-name-validation.yml to use .cjs
  - [ ] Run test matrix; verify identical results
  - [ ] Document change in BRANCHING_STRATEGY.md
  - [ ] Merge & deploy

- [ ] P1.2: Fix post-release sync branch naming — Due: Day 3
  - [ ] Update post-release-sync.cjs to use `ops/` prefix
  - [ ] Test release workflow end-to-end
  - [ ] Update release agent documentation
  - [ ] Merge & deploy

- [ ] P1.3: Add explicit `claude/` validation — Due: Day 2
  - [ ] Add reserved prefix list to both validation scripts
  - [ ] Add test cases for reserved prefixes
  - [ ] Run tests; verify rejection
  - [ ] Update BRANCHING_STRATEGY.md
  - [ ] Merge & deploy

- [ ] P1.4: Update PR template routing — Due: Day 5
  - [ ] Add validation step to workflow
  - [ ] Update config.yml with documentation
  - [ ] Test with reserved/invalid/valid prefixes
  - [ ] Merge & deploy

#### Phase P2 (Week 1–2 — High Priority)
- [ ] P2.1: Add branch guidance to 19 agents — Due: Day 8
  - [ ] Create template (Day 1)
  - [ ] Update each of 19 agents (Day 2–4)
  - [ ] Verify all links work (Day 5)
  - [ ] Merge & deploy

- [ ] P2.2: Create portable instruction file — Due: Day 5
  - [ ] Write `instructions/branch-naming.instructions.md`
  - [ ] Link from AGENTS.md & CLAUDE.md
  - [ ] Verify agents can reference file
  - [ ] Merge & deploy

- [ ] P2.3: Add validation to release agent — Due: Day 8
  - [ ] Add pre-creation validation to scripts version
  - [ ] Add same validation to portable version
  - [ ] Write test cases
  - [ ] Test end-to-end
  - [ ] Merge & deploy

- [ ] P2.4: Update safety gates — Due: Day 10
  - [ ] Add Gate 3.5 for branch name validation
  - [ ] Update gate execution order
  - [ ] Write tests
  - [ ] Run gates; verify functionality
  - [ ] Merge & deploy

- [ ] P2.5: Update AGENT_STANDARDS.md — Due: Day 5
  - [ ] Add Branch Naming Guidance section
  - [ ] Create template for future agents
  - [ ] Update lint rules (if applicable)
  - [ ] Merge & deploy

#### Phase P3 (Week 2–3 — Documentation)
- [ ] P3.1: Create quick reference card — Due: Day 12
- [ ] P3.2: Add checklist to CLAUDE.md — Due: Day 10
- [ ] P3.3: Expand AGENTS.md — Due: Day 12
- [ ] P3.4: Create AGENT.md for 16 portables — Due: Day 15
- [ ] P3.5: Add validation links — Due: Day 10

#### Phase P4 (Week 3+ — Infrastructure)
- [ ] P4.1: Create developer guide
- [ ] P4.2: Update onboarding
- [ ] P4.3: Add metrics tracking
- [ ] P4.4: Update AGENT_STANDARDS.md

---

## Timeline & Effort Summary

| Phase | Items | Total Effort | Timeline | Cumulative |
|-------|-------|--------------|----------|------------|
| **P1** | 4 critical | 7–10h | Week 1 (Days 1–5) | 7–10h |
| **P2** | 5 high | 6–9h | Week 1–2 (Days 1–10) | 13–19h |
| **P3** | 5 medium | 5–9h | Week 2–3 (Days 10–15) | 18–28h |
| **P4** | 4 low | 6–9h | Week 3+ | 24–37h |

**Critical Path (P1+P2):** 13–19 hours ← **Minimum viable remediation**  
**Full Implementation (P1–P4):** 24–37 hours ← **Complete solution**

---

## Verification & Testing Plan

### Phase P1 Verification (Week 1)

```bash
# Test 1: Validation script consistency
node scripts/validation/validate-branch-name.cjs release/v1.0.0
# Should: FAIL (no scope-title)
# Verify: Matches .js behavior

# Test 2: Claude prefix rejection
node scripts/validation/validate-branch-name.cjs claude/my-feature
# Should: FAIL with "reserved" message

# Test 3: Post-release sync branch
git log --oneline | grep "ops/post-release"
# Should: Find ops-prefixed sync branches (not chore)

# Test 4: PR template routing
# Create PR with claude/ branch
# Should: Validation workflow fails before template routing
```

### Phase P2 Verification (Week 2)

```bash
# Test 5: Agent spec coverage
grep -r "## Branch Naming" .github/agents/
# Should: 19 results (all agents have section)

# Test 6: Portable instruction file
ls -la instructions/branch-naming.instructions.md
# Should: File exists and is readable

# Test 7: Release validation
npm run test -- release.agent.js --validate-branch
# Should: Tests pass; validates pre-creation

# Test 8: Safety gates
npm run test -- release-gates.cjs
# Should: Tests pass; Gate 3.5 validates branch

# Test 9: AGENT_STANDARDS.md
grep "Branch Naming Guidance" docs/AGENT_STANDARDS.md
# Should: Section exists with template
```

### Phase P3 Verification (Week 3)

```bash
# Test 10: Quick reference
ls -la .github/QUICK_REFERENCE_BRANCH_NAMING.md
# Should: File exists; all 34 prefixes listed

# Test 11: Documentation links
grep "BRANCHING_STRATEGY.md" CLAUDE.md AGENTS.md
# Should: Links present in both files

# Test 12: Agent AGENT.md files
ls -la agents/*/AGENT.md
# Should: 16 files (portable agents documented)
```

---

## Success Criteria

### End of P1 (Week 1)
✅ **Validation scripts unified** — `.cjs` and `.js` enforce identical pattern  
✅ **Post-release sync fixed** — Uses `ops/` prefix, not `chore/`  
✅ **Claude prefix validation explicit** — Validation scripts check reserved prefixes first  
✅ **PR routing secured** — Invalid branches rejected before template selection  

### End of P2 (Week 2)
✅ **All agents have branch guidance** — 19/19 spec-based agents documented  
✅ **Portable instruction standard** — `instructions/branch-naming.instructions.md` created  
✅ **Pre-creation validation** — Release agent validates before `git checkout -b`  
✅ **Safety gates enhanced** — Gate 3.5 validates branch names  
✅ **Agent standards updated** — Future agents will follow standard  

### End of P3 (Week 3)
✅ **Discoverability improved** — Quick reference card available  
✅ **Documentation expanded** — AGENTS.md covers branch naming adequately  
✅ **Portable agents documented** — 16/16 have AGENT.md  
✅ **Validation links visible** — Setup/troubleshooting links in key places  

### End of P4 (Week 4+)
✅ **Developer guides created** — Practical walkthrough available  
✅ **Onboarding integrated** — Branch rules part of day-1 checklist  
✅ **Metrics enabled** — Tracking validation failures  
✅ **Infrastructure scalable** — Standards apply to all agents going forward  

---

## Post-Implementation Monitoring

### Metrics to Track

1. **Validation Failures by Prefix**
   - Count violations per prefix type
   - Identify patterns (e.g., claude/ attempts)
   - Monitor trend (should decrease after P1 deployment)

2. **Release Branch Success Rate**
   - % of release PRs with correct `release/v{version}` branch
   - Pre/post-remediation comparison
   - Expected: 100% after P2.3 & P2.4

3. **Documentation Discoverability**
   - Hits to quick reference card
   - Hits to validation script setup guide
   - Expected: Increase in reference usage post-P3

4. **Agent Spec Compliance**
   - % of agents with branch guidance section
   - Expected: 100% after P2.1

### Escalation Plan

If post-deployment issues arise:
- **Validation failures spike** → Check if ALLOWED_TYPES was accidentally modified
- **Release agent breaks** → Roll back P2.3/P2.4; manual validation fallback
- **Claude Code still uses `claude/` prefix** → Requires Claude Code tool update (external)
- **Agents ignore documentation** → Escalate to agent governance; add lint enforcement

---

## Notes & Dependencies

### External Dependency
**Claude Code hardcoded `claude/` prefix** — Unfixable without Claude Code tool update. The validation logic in this remediation plan provides workarounds and explicit rejection, but the root cause (application-level default) cannot be fixed here.

### Internal Dependencies
- **Phase P1.1 → P1.3, P1.4** — Unifying validation scripts must happen first
- **Phase P2.1 → P2.2** — Agent guidance should reference portable instruction file
- **Phase P2.3 → P2.4** — Release agent validation should be tested before gates are updated
- **Phase P3 → P4** — Documentation expansion (P3) is prerequisite for onboarding integration (P4)

### Backward Compatibility
- All changes are **backward compatible** for existing valid branches
- Only **invalid branches** become restricted (which is the intent)
- Existing `release/v{version}` branches unaffected

---

## Conclusion

This remediation plan addresses all 11 critical/high-impact issues identified in Phases 1–5. Implementation in phases ensures:

1. **Critical path first** (P1) — Unify validation, fix known violations, secure PR routing
2. **Guidance & standards** (P2) — Ensure all agents aware of rules; prevent future regressions
3. **Discoverability** (P3) — Humans and agents can easily find and understand rules
4. **Infrastructure** (P4) — Embed standards in processes; scale to all future work

**Total commitment:** 24–37 hours over 4 weeks  
**Minimum viable** (P1+P2): 13–19 hours over 2 weeks  
**ROI:** Eliminates months of branch naming failures; prevents wasted credits and duplicate PRs

---

**Audit Complete. Ready for Implementation.**

---
title: "Branch Naming & PR Strategy — Complete Specification & Roadmap"
description: "Comprehensive specification, validation framework, and implementation roadmap for GitHub branch naming and pull request workflows"
type: "specification"
status: "draft"
created_date: "2026-09-12"
last_updated: "2026-09-12"
owner: "ashley@lightspeedwp.agency"
---

# Branch Naming & PR Strategy — Complete Specification & Roadmap

> **Project:** Branch Naming & PR Strategy Formalization  
> **Status:** Specification Draft  
> **Target:** Centralize and validate branch naming & PR workflows  
> **Audience:** Developers, maintainers, automation engineers  
> **Date:** 2026-09-12

---

## 📋 Executive Summary

This document provides:

1. **Specification** — Formal definition of branch naming rules, PR templates, and workflow routing
2. **Validation Framework** — How to enforce naming rules and validate PRs
3. **Implementation Roadmap** — Phased rollout of enforcement and tooling
4. **Reference Architecture** — How naming, templates, workflows, and labels integrate

### Key Principles

- **Naming drives automation:** Branch prefixes route to PR templates, trigger workflows, apply labels
- **Templates enforce structure:** Each template corresponds to a change type (feature, fix, docs, etc.)
- **Workflow routing prevents errors:** Wrong template → wrong checklist → missed requirements
- **CI gates catch violations:** Branch name validation blocks merges if naming is invalid

---

## 1. Branch Naming Specification

### 1.1 Pattern & Rules

**Canonical Pattern:**
```
{type}/{scope}-{title}
```

**Pattern Breakdown:**
- `{type}` — Change type (see Type Reference below)
- `/` — Required separator
- `{scope}` — What's being changed (kebab-case, 1-50 chars)
- `-` — Required separator
- `{title}` — Brief description (kebab-case, 1-80 chars combined with scope)

**Validation Rules:**
1. **Length:** 15-120 characters total (excluding type/ prefix)
2. **Case:** Lowercase letters, digits, hyphens only (no underscores, spaces, capitals)
3. **Format:** `type/scope-title` — no variations
4. **Forbidden:** No `claude/`, `copilot/`, `openai/` prefixes (reserved for systems)
5. **Uniqueness:** Branch must not duplicate existing branches

**Examples:**

| Type | Scope | Title | Result | Valid |
|------|-------|-------|--------|-------|
| `feat` | `user-auth` | `login-form-redesign` | `feat/user-auth-login-form-redesign` | ✅ |
| `fix` | `pr-template` | `routing-bug` | `fix/pr-template-routing-bug` | ✅ |
| `docs` | `branching` | `strategy-guide` | `docs/branching-strategy-guide` | ✅ |
| `refactor` | `changelog` | `consolidation` | `refactor/changelog-consolidation` | ✅ |
| `test` | `integration` | `test-suite` | `test/integration-test-suite` | ✅ |
| `claude` | `my-feature` | `xyz` | `claude/my-feature-xyz` | ❌ FORBIDDEN |
| `copilot` | `fix-something` | `bug` | `copilot/fix-something-bug` | ❌ FORBIDDEN |
| `Feature` | `foo` | `bar` | `Feature/foo-bar` | ❌ UPPERCASE |
| `feat` | `user_auth` | `login` | `feat/user_auth-login` | ❌ UNDERSCORE |

---

### 1.2 Type Reference (24 Types)

Each type is mapped to:
- **PR template** (routes from branch prefix)
- **Default labels** (auto-applied)
- **Validation rules** (type-specific checks)
- **Workflow triggers** (which automation runs)

| Type | Purpose | PR Template | Default Labels | Workflow | Example |
|------|---------|-------------|-----------------|----------|---------|
| `feat` | New feature | `pr_feature.md` | `type:feature` | changelog, validation | `feat/user-preferences-panel` |
| `fix` | Bug fix | `pr_bugfix.md` | `type:bug` | changelog, testing | `fix/authentication-timeout` |
| `hotfix` | Urgent production fix | `pr_hotfix.md` | `type:bug, priority:critical` | changelog, review, merge | `hotfix/critical-security-patch` |
| `release` | Release branch | `pr_release.md` | `type:release` | validation, merge | `release/v1.0.0` |
| `refactor` | Code refactoring | `pr_refactor.md` | `type:refactor` | testing, linting | `refactor/api-response-structure` |
| `chore` | Maintenance | `pr_chore.md` | `type:chore` | validation | `chore/dependency-updates` |
| `task` | Scoped work | `pr_task.md` | `type:task` | project-tracking | `task/authentication-refactor` |
| `docs` | Documentation | `pr_docs.md` | `type:documentation` | lint-md | `docs/branching-strategy-guide` |
| `test` | Tests | `pr_test.md` | `type:test` | testing | `test/integration-test-suite` |
| `perf` | Performance | `pr_perf.md` | `type:feature, meta:perf` | benchmarking | `perf/query-optimization` |
| `ci` | CI/CD | `pr_ci.md` | `type:chore, area:ci` | validation | `ci/github-actions-workflow` |
| `build` | Build system | `pr_build.md` | `type:chore` | validation | `build/webpack-config-update` |
| `deps` | Dependencies | `pr_deps.md` | `type:chore` | security-scan | `deps/upgrade-npm-packages` |
| `security` | Security fixes | `pr_security.md` | `type:security, priority:critical` | review, scan | `security/xss-vulnerability-fix` |
| `design` | Design system | `pr_design.md` | `type:design` | visual-review | `design/button-component-update` |
| `a11y` | Accessibility | `pr_a11y.md` | `type:feature` | a11y-audit | `a11y/wcag-compliance-audit` |
| `ux` | User experience | `pr_ux.md` | `type:feature` | ux-review | `ux/form-validation-feedback` |
| `i18n` | Internationalization | `pr_i18n.md` | `type:feature` | lint-i18n | `i18n/german-translation-pack` |
| `ops` | Operations | `pr_ops.md` | `type:task` | validation | `ops/database-migration-script` |
| `proto` | Prototype | `pr_proto.md` | `meta:experimental` | validation | `proto/new-caching-strategy` |
| `audit` | Audit/review | `pr_audit.md` | `type:task` | validation | `audit/security-code-review` |
| `codex` | Code generation | `pr_codex.md` | `type:feature` | validation | `codex/auto-documentation-tool` |
| `research` | Research | `pr_research.md` | `type:task` | validation | `research/performance-benchmarks` |
| `revert` | Revert commit | `pr_revert.md` | `type:chore` | validation | `revert/pr-2345-bad-merge` |

---

### 1.3 Scope Guidelines

**Scope Selection Rules:**
- **Scope:** What system/module/component is affected
- **Should be:** Specific enough to identify the area, brief enough to fit in branch name
- **Avoid:** Generic terms like "fix", "update", "improvement"
- **Use kebab-case:** Never underscores or spaces

**Good Scopes:**
- `pr-template` (GitHub automation)
- `changelog-validation` (changelog system)
- `user-auth` (authentication module)
- `api-rate-limiting` (specific feature)
- `ci-workflows` (CI/CD system)

**Poor Scopes:**
- `fix` (too generic)
- `my_work` (underscores)
- `Update Feature` (spaces, capitals)
- `ui-ux-dashboard-new-design` (too long)

---

### 1.4 Title Guidelines

**Title Selection Rules:**
- **Title:** Action + result; what the PR accomplishes
- **Should be:** Specific, action-oriented, user-focused
- **Keep:** Concise (combined scope-title: <80 chars)
- **Avoid:** Redundancy (don't repeat scope in title)

**Good Titles:**
- `fix/pr-template-routing-bug` → PR template routing is **fixed**
- `feat/user-auth-login-form-redesign` → Login form is **redesigned**
- `docs/branching-strategy-guide` → Branching strategy is **documented**

**Poor Titles:**
- `feat/user-auth-add-new-user-authentication` → Redundant
- `fix/fix-the-pr-template-bug` → Redundant "fix"
- `refactor/update` → Too vague

---

## 2. PR Strategy Specification

### 2.1 PR Template Routing

**How It Works:**
1. Developer creates branch with correct type prefix (e.g., `feat/`, `fix/`)
2. Developer opens PR against `develop` or `main` (depending on repo)
3. GitHub App detects branch prefix
4. **Correct template auto-assigned** based on type
5. Template enforces structure and checklist

**Template Structure (All PR Templates):**
```markdown
---
type: {pr_type}
generated: {date}
---

## 📋 Summary
{Brief description of changes}

## 🔍 Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## 📝 Checklist
- [ ] Tested locally
- [ ] PR title follows convention
- [ ] Branch name follows pattern
- [ ] No secrets committed
- [ ] Documentation updated

## 🔗 Related Issues
Closes #123
Related to #456
```

**Branch Prefix → Template Mapping:**

| Branch Prefix | Detected PR Template | Route Logic |
|---------------|---------------------|------------|
| `feat/` | `pr_feature.md` | Extract type, apply template |
| `fix/` | `pr_bugfix.md` | Extract type, apply template |
| `docs/` | `pr_docs.md` | Extract type, apply template |
| `test/` | `pr_test.md` | Extract type, apply template |
| `refactor/` | `pr_refactor.md` | Extract type, apply template |
| *(others)* | *(type-specific)* | *(as per Type Reference table)* |
| `claude/` | ❌ ERROR | Branch validation fails, PR blocked |
| `copilot/` | ❌ ERROR | Branch validation fails, PR blocked |
| *(no prefix)* | ❌ ERROR | Branch validation fails, PR blocked |

**Implementation Details:**
- **Detection:** GitHub Actions workflow runs `scripts/validate-branch-name.js` on PR open
- **Routing:** Workflow reads `.github/PULL_REQUEST_TEMPLATE/{template}.md` based on type
- **Fallback:** If type not recognized, default to `pr_general.md`
- **Enforcement:** If branch is invalid, add comment + label `needs:branch-rename`

---

### 2.2 PR Validation Workflow

**Trigger:** Pull request opened or synchronized

**Validation Steps:**

1. **Branch Name Validation**
   - Pattern: Must match `{type}/{scope}-{title}`
   - Forbidden: No `claude/`, `copilot/`, `openai/` prefixes
   - Result: ✅ PASS or ❌ FAIL (comment + label if fail)

2. **PR Title Validation**
   - Pattern: Should reflect branch type
   - Suggested Format: `{TYPE}: {Title}` (e.g., `FEAT: User authentication redesign`)
   - Result: ✅ PASS or ⚠️ WARNING (suggestion comment if not ideal)

3. **Commit Message Validation**
   - Conventional Commits: `{type}({scope}): {message}`
   - Must align with branch type
   - Result: ✅ PASS or ⚠️ WARNING

4. **File Change Validation**
   - Type-specific checks (e.g., changelog for `feat/`, tests for `test/`)
   - Lint: JS, Markdown, YAML, JSON
   - Security: Secret scanning, dependency audit
   - Result: ✅ PASS or ❌ FAIL (blocking)

5. **Labeling**
   - Auto-apply: `type:{type}` (e.g., `type:feature`)
   - Auto-apply: `area:{scope}` if scope matches known areas (e.g., `area:ci`)
   - Auto-apply: `priority:*` if mentioned in PR body
   - Auto-apply: `meta:*` for special cases (e.g., `meta:breaking-change`)

**Output:** Comment on PR with validation results, apply labels

---

### 2.3 PR Approval & Merge Workflow

**Branch Protection Rules:**

| Rule | Requirement | Purpose |
|------|-------------|---------|
| Dismiss stale PR reviews | ✅ Enabled | Force re-review after pushes |
| Require code review | ✅ Enabled (1+ approved) | Quality gate |
| Require status checks to pass | ✅ Enabled | CI/CD must pass |
| Require branches to be up to date | ✅ Enabled | Prevent stale merges |
| Require conversation resolution | ✅ Enabled | All threads must be resolved |
| Require signed commits | ⚠️ Configurable | Security/audit requirement |
| Restrict who can push | ✅ Maintainers only | Control merges |
| Allow force pushes | ❌ Disabled | Prevent history rewriting |
| Allow deletions | ❌ Disabled | Prevent accidental deletes |

**Approval Logic:**

1. **PR created** → Validation workflow runs
2. **Changes requested** → Cannot merge until resolved
3. **1+ approval** → Approver confirms changes
4. **CI green** → All checks pass
5. **Branches in sync** → No merge conflicts
6. **Conversations resolved** → All threads marked resolved
7. **Ready to merge** → Maintainer clicks "Squash and merge" or "Create merge commit"

**Merge Strategy:**
- **Feature/Fix PRs:** Squash and merge (single commit for clarity)
- **Release PRs:** Create merge commit (preserve history)
- **Refactor/Docs:** Squash and merge (keep history clean)

---

### 2.4 Label Integration

**Three Label Families Relevant to Branches/PRs:**

**1. `type:*` Family** (Change Type)
- Auto-applied from branch prefix
- Examples: `type:feature`, `type:bug`, `type:documentation`
- Used by: Metrics, filtering, automation decisions

**2. `area:*` Family** (System/Component)
- Auto-applied from scope if recognized
- Examples: `area:ci`, `area:docs`, `area:changelog`
- Used by: Team assignments, workflow triggers

**3. `meta:*` Family** (Special Metadata)
- Applied based on PR content/context
- Examples: `meta:breaking-change`, `meta:needs-changelog`, `meta:experimental`
- Used by: Release notes, special handling, notifications

**Label Application Timing:**

| Timing | Who | Labels |
|--------|-----|--------|
| PR open | Validation workflow | `type:*`, `area:*` |
| PR review | Reviewers (manual) | `priority:*`, `meta:*` |
| PR merge | Merge workflow | `status:done`, `meta:has-pr` |
| PR close | Close workflow | `status:done`, `meta:duplicate` (if duplicate) |

---

## 3. Validation Framework

### 3.1 Branch Name Validator Script

**Location:** `scripts/validate-branch-name.js`

**Input:** Branch name from `${{ github.head_ref }}`

**Validation Steps:**

```javascript
const VALID_TYPES = [
  'feat', 'fix', 'hotfix', 'release', 'refactor', 'chore',
  'task', 'docs', 'test', 'perf', 'ci', 'build', 'deps',
  'security', 'design', 'a11y', 'ux', 'i18n', 'ops',
  'proto', 'audit', 'codex', 'research', 'revert'
];

const FORBIDDEN_PREFIXES = ['claude/', 'copilot/', 'openai/'];

function validateBranchName(branch) {
  // 1. Check forbidden prefixes
  if (FORBIDDEN_PREFIXES.some(p => branch.startsWith(p))) {
    return { valid: false, error: 'FORBIDDEN_PREFIX' };
  }

  // 2. Check pattern: type/scope-title
  const pattern = /^([\w-]+)\/([\w-]+-[\w-]+)$/;
  if (!pattern.test(branch)) {
    return { valid: false, error: 'INVALID_PATTERN' };
  }

  // 3. Extract type
  const [, type, rest] = branch.match(/^([\w-]+)\/(.*)/);
  if (!VALID_TYPES.includes(type)) {
    return { valid: false, error: 'INVALID_TYPE', type };
  }

  // 4. Check length
  if (rest.length < 3 || rest.length > 100) {
    return { valid: false, error: 'INVALID_LENGTH' };
  }

  return { valid: true, type };
}
```

**Output:**
- ✅ `{ valid: true, type: 'feat' }`
- ❌ `{ valid: false, error: 'FORBIDDEN_PREFIX' }`
- ❌ `{ valid: false, error: 'INVALID_PATTERN' }`
- ❌ `{ valid: false, error: 'INVALID_TYPE', type: 'unknown' }`

**Usage in Workflow:**
```yaml
- name: Validate branch name
  run: |
    RESULT=$(node scripts/validate-branch-name.js --branch ${{ github.head_ref }})
    if [ $? -ne 0 ]; then
      echo "❌ Branch name is invalid"
      exit 1
    fi
```

---

### 3.2 PR Template Routing Logic

**Location:** `.github/workflows/route-pr-template.yml`

**Trigger:** `pull_request: [opened]`

**Logic:**

```yaml
- name: Detect branch type and route template
  run: |
    BRANCH="${{ github.head_ref }}"
    TYPE=$(echo "$BRANCH" | cut -d'/' -f1)
    
    case "$TYPE" in
      feat) TEMPLATE="pr_feature.md" ;;
      fix) TEMPLATE="pr_bugfix.md" ;;
      docs) TEMPLATE="pr_docs.md" ;;
      test) TEMPLATE="pr_test.md" ;;
      refactor) TEMPLATE="pr_refactor.md" ;;
      *) TEMPLATE="pr_general.md" ;;
    esac
    
    echo "TEMPLATE=$TEMPLATE" >> $GITHUB_ENV
```

---

## 4. Implementation Roadmap

### Phase 1: Specification & Documentation (Week 1)

**Goal:** Formalize strategy, document rules, prepare enforcement tooling

**Tasks:**
- [ ] Create branch naming specification (THIS DOCUMENT)
- [ ] Document all 24 types with examples
- [ ] Create PR template mapping guide
- [ ] Write validation script (`validate-branch-name.js`)
- [ ] Design routing logic for PR templates
- [ ] Create troubleshooting guide

**Deliverables:**
- Branch naming specification document ✅
- Type reference table with examples ✅
- Validation script (ready to deploy)
- Routing logic (ready to implement)

---

### Phase 2: Template & Routing (Week 2-3)

**Goal:** Implement PR template detection and routing

**Tasks:**
- [ ] Update all 19 PR templates with consistent structure
- [ ] Create `.github/workflows/route-pr-template.yml` workflow
- [ ] Implement template auto-detection from branch prefix
- [ ] Test routing with sample branches (feat, fix, docs, etc.)
- [ ] Test error handling (invalid branch names)

**Deliverables:**
- All PR templates updated
- Routing workflow deployed and tested
- Error handling tested

---

### Phase 3: Validation & Enforcement (Week 3-4)

**Goal:** Deploy branch name validation and prevent invalid branches

**Tasks:**
- [ ] Create `.github/workflows/validate-branch.yml` workflow
- [ ] Deploy validation script
- [ ] Add branch protection rule
- [ ] Create blocking comment template
- [ ] Test validation with invalid branches
- [ ] Update CLAUDE.md with validation instructions

**Deliverables:**
- Validation workflow deployed
- Branch protection enforced
- Developers can't merge invalid branches

---

### Phase 4: Labeling & Auto-Application (Week 4-5)

**Goal:** Auto-apply labels based on branch type and scope

**Tasks:**
- [ ] Create `.github/workflows/auto-label-pr.yml` workflow
- [ ] Map types to labels
- [ ] Map scopes to area labels
- [ ] Implement label auto-application
- [ ] Test labeling with various branch types
- [ ] Document label strategy in `docs/LABELING.md`

**Deliverables:**
- Auto-labeling workflow deployed
- Type labels auto-applied (e.g., `type:feature`)
- Area labels auto-applied (e.g., `area:ci`)

---

### Phase 5: Team Training & Communication (Week 5-6)

**Goal:** Educate developers on new rules and validate understanding

**Tasks:**
- [ ] Write quick reference guide (`BRANCH_NAMING_QUICK_REF.md`)
- [ ] Create troubleshooting FAQ
- [ ] Record video walkthrough (5-10 minutes)
- [ ] Host team Q&A session
- [ ] Create issue template for common naming questions
- [ ] Add pre-commit hook for local validation (optional)

**Deliverables:**
- Quick reference guide
- Video walkthrough
- Team Q&A session completed
- FAQ for common issues

---

### Phase 6: Monitoring & Refinement (Week 6-7)

**Goal:** Monitor compliance and refine rules based on feedback

**Tasks:**
- [ ] Track validation failures (% of invalid branches)
- [ ] Analyze common mistakes
- [ ] Collect developer feedback
- [ ] Refine error messages if needed
- [ ] Update documentation based on feedback
- [ ] Report metrics to leadership

**Deliverables:**
- Compliance metrics dashboard
- Feedback summary
- Refined documentation

---

## 5. Failure Scenarios & Remediation

### Scenario 1: Developer Creates Invalid Branch Name

**Branch:** `claude/my-feature-xyz` (forbidden prefix)

**What Happens:**
1. PR opened against develop
2. Validation workflow runs
3. Branch name detected as invalid (forbidden prefix)
4. PR gets labeled `needs:branch-rename`
5. Comment left: "❌ Branch name violates naming rules (forbidden prefix: `claude/`). Please rename to `feat/my-feature-xyz` and reopen."

**Developer Action:**
```bash
git branch -m feat/my-feature-xyz  # Rename local branch
git push origin -u feat/my-feature-xyz  # Push new branch
# Close old PR manually in GitHub
# Open new PR against develop
```

---

### Scenario 2: Developer Uses Wrong Type

**Branch:** `features/user-auth-redesign` (should be `feat/`)

**What Happens:**
1. PR opened
2. Validation detects invalid type: `features` (should be `feat`)
3. PR labeled `needs:branch-rename`
4. Comment: "❌ Type `features` not recognized. Did you mean `feat`? Branch should be: `feat/user-auth-redesign`"

**Fix:** Same as Scenario 1, rename and reopen

---

### Scenario 3: Developer Uses Underscore in Scope

**Branch:** `feat/user_auth-login` (underscore not allowed)

**What Happens:**
1. PR opened
2. Validation detects invalid format (underscores not allowed)
3. PR labeled `needs:branch-rename`
4. Comment: "❌ Branch name contains invalid characters. Use hyphens only. Should be: `feat/user-auth-login`"

---

### Scenario 4: Developer Forgets Scope

**Branch:** `feat/redesign` (too short, ambiguous scope)

**What Happens:**
1. PR opened
2. Validation detects scope too short or ambiguous
3. PR labeled `needs:branch-rename`
4. Comment: "⚠️ Scope too vague. What's being changed? Try: `feat/user-auth-redesign` or `feat/login-form-redesign`"

---

## 6. Troubleshooting Guide

### Q1: My branch name follows the pattern but still fails validation

**Possible Causes:**
- Type is misspelled (e.g., `feat` vs `feature`)
- Branch name has leading/trailing spaces
- Special characters (underscores, dots, etc.) instead of hyphens
- Branch name uses UPPERCASE letters

**Fix:**
```bash
# Check exact branch name
git branch -vv

# Common mistakes
feat/my_feature  # ❌ underscore
feat/My-Feature  # ❌ capital letters
feat/my--feature  # ❌ double hyphens

# Correct
feat/my-feature  # ✅
```

---

### Q2: I need to rename a branch. How do I do it?

**Steps:**
1. Rename locally: `git branch -m old-name new-name`
2. Delete old remote: `git push origin -d old-name`
3. Push new branch: `git push origin -u new-name`
4. Update PR: Close old PR, open new PR with new branch
5. Delete old branch in GitHub (if auto-deleted didn't happen)

---

### Q3: My PR template doesn't match my branch type. Why?

**Possible Causes:**
- Workflow routing didn't run yet (wait a few seconds)
- Branch type not recognized (check spelling)
- Manual template override (you selected a different template)

**Fix:**
- Wait for workflow to complete (check PR's "Checks" tab)
- If still wrong, close and reopen PR
- If still broken, manually select correct template from dropdown

---

### Q4: What do I do if I need to merge code from `main` into my branch?

**Steps:**
```bash
git fetch origin main
git merge origin/main
# or
git pull origin main
# Fix any conflicts, then push
git push origin your-branch
```

**Don't rebase** on main if pushing to a remote branch (others may have based work on your branch).

---

## 7. Integration Points

### 7.1 How Branch Names Affect Other Systems

**Branch Name → PR Template:**
- Routing is automatic via workflow
- Wrong type = wrong template = wrong checklist

**Branch Name → Labels:**
- Type extracted and mapped to `type:*` labels
- Scope extracted and mapped to `area:*` labels

**Branch Name → CI/CD:**
- Some workflows trigger only on specific types (e.g., `security/*` runs security scan)
- Release workflows check type for release branches

**Branch Name → Metrics:**
- Branch type tracked for analytics
- Type-specific metrics dashboards
- Velocity tracking by type

---

### 7.2 Changelog Integration

**Branch Type → Changelog Section:**
- `feat/` → Added (in [Unreleased])
- `fix/` → Fixed
- `docs/` → Documentation (or skip if internal)
- `perf/` → Changed or Performance section
- Other types typically don't generate changelog entries

**Branch Name Used For:**
- Entry title/subject
- PR linking (auto-generated from PR)
- Scope classification (used to group related entries)

---

## 8. Reference Documents

### Related Files in Repository

- **CLAUDE.md** — Current branch naming rules (informal)
- **PULL_REQUEST_TEMPLATE/*.md** — All 19 PR templates
- **scripts/validate-branch-name.js** — Validation script (to be created)
- **docs/BRANCHING_STRATEGY.md** — User-facing guide
- **.github/workflows/validate-branch.yml** — Validation workflow (to be created)
- **.github/workflows/route-pr-template.yml** — Routing workflow (to be created)
- **.github/workflows/auto-label-pr.yml** — Labeling workflow (to be created)

### External References

- [GitHub Flow Best Practices](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)

---

## 9. Success Criteria

### Phase 1 Complete When
- [ ] Specification document written and reviewed
- [ ] All 24 types documented with examples
- [ ] Validation script created and tested locally

### Phase 2 Complete When
- [ ] All PR templates updated
- [ ] Routing workflow deployed
- [ ] Template auto-detection working for 10+ branches

### Phase 3 Complete When
- [ ] Validation workflow deployed
- [ ] Branch protection rule enforced
- [ ] Invalid branches blocked with clear error messages

### Phase 4 Complete When
- [ ] Auto-labeling workflow deployed
- [ ] Type labels auto-applied to all PRs
- [ ] Area labels auto-applied where scopes match

### Phase 5 Complete When
- [ ] Quick reference guide distributed
- [ ] Team Q&A held (90%+ attendance)
- [ ] FAQ document created with 10+ common questions

### Phase 6 Complete When
- [ ] Compliance metrics tracked (target: 95%+ valid branches)
- [ ] Feedback collected and analyzed
- [ ] Documentation refined based on feedback

---

## 10. Appendix: Type Decision Tree

**Use this to pick the right type:**

```
Is it a new feature or capability?
  → YES: use `feat/`
  → NO: continue

Is it fixing a bug or issue?
  → YES: Is it urgent production critical?
    → YES: use `hotfix/`
    → NO: use `fix/`
  → NO: continue

Is it documentation?
  → YES: use `docs/`
  → NO: continue

Is it writing or improving tests?
  → YES: use `test/`
  → NO: continue

Is it refactoring existing code (no functional change)?
  → YES: use `refactor/`
  → NO: continue

Is it updating dependencies, npm packages, etc.?
  → YES: use `deps/`
  → NO: continue

Is it a security vulnerability fix?
  → YES: use `security/`
  → NO: continue

Is it performance optimization?
  → YES: use `perf/`
  → NO: continue

Is it CI/CD pipeline changes?
  → YES: use `ci/`
  → NO: continue

Is it build system changes?
  → YES: use `build/`
  → NO: continue

Is it reverting a previous commit?
  → YES: use `revert/`
  → NO: use `chore/`
```

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-09-12 | 1.0 | Initial comprehensive specification & roadmap |

---

**Status:** ✅ Draft Complete — Ready for Review & Approval  
**Owner:** Changelog & Release Engineering  
**Last Updated:** 2026-09-12

**Next Steps:**
1. Review specification with team
2. Approve branch naming rules
3. Begin Phase 1 implementation
4. Schedule team training (Phase 5)

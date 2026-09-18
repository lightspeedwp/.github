# Branch Naming Enforcement — Quick Reference

## Current Infrastructure ✅

### Workflows (Post-Commit)
```
┌─────────────────────────────────────────────────────────┐
│ branch-name-validation.yml                              │
│ Trigger: PR opened/reopened/pushed                      │
│ Check: Runs validate-branch-name.cjs                    │
│ Output: ✅/❌ check + PR comment if failed             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ main-branch-guard.yml                                   │
│ Trigger: PR targeting main                              │
│ Check: Only release/* or hotfix/* allowed               │
│ Output: ✅/❌ check                                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ pr-template-resolver.yml                                │
│ Trigger: PR with claude/* or copilot/* branch           │
│ Action: Routes to correct template                      │
│ Note: Detects invalid prefixes, routes around them      │
└─────────────────────────────────────────────────────────┘
```

### Validation Scripts
```
validate-branch-name.cjs (373 lines)
├─ 34 allowed types (feat, fix, release, etc.)
├─ Special semver support for release/* branches
├─ Bot/protected branch exemptions
├─ Reusable in workflows, hooks, and tests
└─ Export both CLI and programmatic interfaces

validate-main-branch-pr.cjs
└─ Ensures only release/* and hotfix/* target main
```

### Husky Hook
```
.husky/pre-commit
└─ Runs lint-staged (lints code files)
   ⚠️  Does NOT validate branch names yet
```

---

## The Gap ⚠️

**Copilot doesn't enforce branch naming at session creation**

| When | Tool | Status |
|------|------|--------|
| Session Created | Copilot App | ⚠️ No validation |
| Branch Checked Out | Local Git | ⚠️ No validation |
| Developer Commits | Git Pre-Commit | ⚠️ No validation |
| Developer Pushes | GitHub | ✅ Validated by workflow |
| PR Created | GitHub | ✅ Validated + comment posted |

---

## Solution: 3 Components

### 1️⃣ `.github/github-app.yml` (NEW)
```yaml
name: "lightspeedwp/.github"

branchNaming:
  pattern: "^(feat|fix|hotfix|...)/...."
  forbiddenPrefixes: ["claude/", "copilot/", "openai/"]
  enforceOnSessionCreate: true
```
**Effect:** Copilot knows your rules when creating branches

### 2️⃣ `.husky/prepare-commit-msg` (NEW)
```bash
#!/usr/bin/env sh
# Validate branch name before commit message editor
node scripts/validation/validate-branch-name.cjs --verbose
```
**Effect:** Developer sees warning if on invalid branch

### 3️⃣ `npm run validate:branch` (NEW SCRIPT)
```json
{
  "scripts": {
    "validate:branch": "node scripts/validation/validate-branch-name.cjs --verbose"
  }
}
```
**Effect:** Quick manual validation anytime

---

## Valid Branch Names ✅

| Type | Example | Use Case |
|------|---------|----------|
| **feat** | `feat/user-auth-module` | New feature |
| **fix** | `fix/login-validation-bug` | Bug fix |
| **hotfix** | `hotfix/critical-security-patch` | Urgent prod fix |
| **release** | `release/v1.2.3` | Release branch |
| **refactor** | `refactor/api-response-structure` | Code restructure |
| **chore** | `chore/dependency-updates` | Maintenance |
| **docs** | `docs/branching-strategy-guide` | Documentation |
| **ci** | `ci/github-actions-workflow` | CI/CD changes |
| **test** | `test/integration-test-suite` | Test infrastructure |
| **perf** | `perf/query-optimization` | Performance tuning |
| **security** | `security/xss-vulnerability-fix` | Security fix |
| **a11y** | `a11y/wcag-compliance-audit` | Accessibility |
| **ux** | `ux/form-validation-feedback` | UX improvements |
| **design** | `design/button-component-update` | Design system |
| **+20 more** | See docs/BRANCHING_STRATEGY.md | Other types |

---

## Invalid Branch Names ❌

| Branch | Error | Fix |
|--------|-------|-----|
| `claude/my-feature` | Forbidden prefix | Use `feat/my-feature` |
| `copilot/fix-bug` | Forbidden prefix | Use `fix/my-bug` |
| `Feature/MyBranch` | Uppercase not allowed | Use `feat/my-branch` |
| `feat/my_feature` | Underscores not allowed | Use `feat/my-feature` |
| `feat/MyFeature` | Uppercase not allowed | Use `feat/my-feature` |
| `fix-bug` | Missing type prefix | Use `fix/bug` |
| `feature/bug` | Wrong type | Use `feat/bug` |

---

## Developer Workflow (After Implementation)

### Step 1: Create Session
```bash
# Copilot suggests valid branch name
# OR enforces pattern at session creation
✅ Branch: feat/user-auth-module
❌ Branch: claude/my-feature (rejected)
```

### Step 2: Work Locally
```bash
git checkout -b feat/user-auth-module
# Make changes, stage files
git add .
```

### Step 3: Commit
```bash
git commit -m "Add user authentication module"
# ✅ Pre-commit hook runs (warns if invalid branch)
# ⚠️  Branch name checked: feat/user-auth-module
# ✅ Lint-staged runs (lints code)
```

### Step 4: Push & Create PR
```bash
git push origin feat/user-auth-module
# Create PR on GitHub
```

### Step 5: PR Validation
```
GitHub Actions runs:
├─ ✅ branch-name-validation.yml
│  └─ Validates feat/user-auth-module
│     └─ Result: ✅ Valid
│
├─ ✅ main-branch-guard.yml (if targeting main)
│  └─ Checks if branch is release/* or hotfix/*
│
└─ Other workflows (tests, lint, etc.)
```

---

## Command Reference

```bash
# Validate current branch
npm run validate:branch

# Show validation pattern
npm run validate:branch:show-pattern

# Manual validation of specific branch
node scripts/validation/validate-branch-name.cjs feat/my-feature

# Verbose output
node scripts/validation/validate-branch-name.cjs --branch fix/bug --verbose

# Help
node scripts/validation/validate-branch-name.cjs --help
```

---

## Configuration Files

| File | Status | Purpose |
|------|--------|---------|
| `.github/github-app.yml` | 🆕 Create | Copilot App config |
| `.husky/prepare-commit-msg` | 🆕 Create | Pre-commit hook |
| `package.json` | ✏️ Update | Add npm scripts |
| `scripts/validation/validate-branch-name.cjs` | ✏️ Update | Add forbidden prefix check |
| `.github/custom-instructions.md` | ✏️ Update | Add Copilot guidelines |
| `scripts/validation/__tests__/*` | ✏️ Update | Add forbidden prefix tests |

---

## Enforcement Timeline (After Implementation)

```
📊 Enforcement Layers (in order):

Layer 1: Session Creation (immediate)
  └─ Copilot suggests/enforces valid name
     ⏱️ ~0 seconds (instant feedback)

Layer 2: Pre-Commit (instant)
  └─ Hook warns if branch is invalid
     ⏱️ ~1 second (before commit editor)

Layer 3: Manual Check (optional)
  └─ `npm run validate:branch` anytime
     ⏱️ ~0.5 seconds (instant feedback)

Layer 4: PR Validation (when pushed)
  └─ Workflow validates and blocks if needed
     ⏱️ ~30 seconds (CI job runs)

Layer 5: Main Branch Guard (for main PRs)
  └─ Ensures only release/* or hotfix/*
     ⏱️ ~30 seconds (CI job runs)
```

**Most feedback is in Layer 1-3 (before push)**  
**Layers 4-5 are backup enforcement**

---

## Testing Checklist

- [ ] Create branch with valid name: `git checkout -b feat/test-feature`
- [ ] Pre-commit hook should run without warnings
- [ ] Manual validation: `npm run validate:branch` (should pass)
- [ ] Create branch with forbidden prefix: `git checkout -b claude/test`
- [ ] Pre-commit hook should warn (but not block)
- [ ] Manual validation: `npm run validate:branch` (should fail with clear message)
- [ ] Push both branches and create PRs
- [ ] Valid PR: ✅ Workflow passes
- [ ] Invalid PR: ❌ Workflow fails + comment posted

---

## Resources

| Document | Contains |
|----------|----------|
| `SUMMARY.md` | Overview, gaps, solution, impact analysis |
| `BRANCH_ENFORCEMENT_AUDIT.md` | Detailed audit, all workflows/scripts, current state |
| `IMPLEMENTATION_PLAN.md` | Step-by-step implementation with full code |
| `QUICK_REFERENCE.md` | This file (quick lookup) |
| `docs/BRANCHING_STRATEGY.md` | In-repo strategy guide (34 types, rules, examples) |
| `CLAUDE.md` | In-repo Claude/Copilot instructions |

---

## FAQ

**Q: Will this block my commits?**  
A: No. Pre-commit hook warns but doesn't block. Workflow validation on PR blocks merge.

**Q: Can I use existing branches?**  
A: Yes. Validation only applies to new branches and PRs.

**Q: What if I accidentally created a bad branch?**  
A: Rename it: `git branch -m old-name new-name`

**Q: Does this work with dependabot/renovate?**  
A: Yes. Both are exempted from validation.

**Q: Can Copilot auto-fix invalid branch names?**  
A: Not in this implementation. Copilot will reject and suggest valid format.

---

*Quick reference prepared 2026-09-03*  
*Maintained by the 🤖 LightSpeedWP Automation Team*

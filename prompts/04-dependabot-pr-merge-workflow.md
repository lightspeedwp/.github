---
file_type: "prompt"
title: "Dependabot PR Manual Merge Workflow"
description: "Review and manually merge dependabot PRs one-by-one, respecting package dependency ordering, with decision logic for manual vs. mergify automation."
version: "1.0.0"
created: "2026-09-04"
status: "active"
tags: ["dependabot", "dependencies", "workflow", "automation", "pr-workflow"]
owners: ["ashley@lightspeedwp.agency"]
---

# Prompt: Review Dependabot PRs and Merge

## PROMPT: Review and manually merge dependabot PRs one by one

This prompt provides clear guidance on merging dependabot pull requests in the correct dependency order, with advice on manual vs. automated approaches.

### Context

Dependabot creates PRs to update packages (npm, pip, etc.). These PRs need careful handling because:

1. **Dependency ordering matters** — Root dependencies must merge before transitive (indirect) dependencies
2. **Major version bumps** may introduce breaking changes
3. **Package-lock.json** needs regeneration after updates
4. **CI validation** is critical to catch integration issues

**Manual vs. Automated Approaches:**

- **Manual merge:** Direct `git merge`, full control, best for critical packages
- **Mergify automation:** Set rules, let bot handle ordering, best for routine updates

### Task

#### STEP 1: Decide Manual vs. Mergify Automation

**Choose MANUAL merge if:**
- ✅ High-risk packages (security, core dependencies)
- ✅ Major version bumps (react, next, node versions)
- ✅ First time setting up automation
- ✅ Small number of PRs (< 5)

**Choose MERGIFY if:**
- ✅ Routine dependency updates (patch/minor versions only)
- ✅ Large number of PRs (> 10)
- ✅ Stable CI history (no frequent failures)
- ✅ Team agrees on automation rules

**Set up Mergify once:**

```bash
# Configure .github/mergify.yml with dependabot rules
# Example:
pull_rules:
  - name: "dependabot auto-merge (patch + minor only)"
    conditions:
      - author: dependabot[bot]
      - -title~="major|BREAKING"
      - check-success=="ESLint"
      - check-success==="Tests"
    actions:
      merge:
        method: squash
```

**For this prompt, proceed with MANUAL merge** (you control each PR).

---

#### STEP 2: List All Open Dependabot PRs

```bash
# Find all dependabot PRs
gh pr list --author dependabot --state open --json number,title,updatedAt

# Output example:
# #100 | Bump react from 17.0.0 to 18.0.0
# #101 | Bump jest from 27.1.0 to 28.0.0
# #102 | Bump axios from 0.27.0 to 1.0.0
```

---

#### STEP 3: Determine Dependency Order

Package dependencies form a chain. Always merge in this order:

1. **Root dependencies first** (direct imports in `package.json`)
2. **Transitive dependencies second** (dependencies of dependencies)
3. **Dev dependencies last** (not needed for runtime)

**How to identify order:**

```bash
# List all dependencies
npm ls --depth=0

# Output shows: react → next → webpack → ...
# Merge order: react first, then next, then webpack
```

**Dependency categories (merge in this order):**

1. Node.js version bump (if applicable)
2. Major production dependencies (react, next, express, etc.)
3. Supporting production dependencies (axios, lodash, etc.)
4. Transitive dependencies (tools, utilities)
5. Dev dependencies (jest, webpack, linters, etc.)

**Create merge order checklist:**

```markdown
## Dependabot PR Merge Order

1. [ ] #100 — Bump react (root, major)
2. [ ] #101 — Bump jest (dev, major)
3. [ ] #102 — Bump axios (root, minor)
4. [ ] #103 — Bump lodash (transitive, patch)
5. [ ] #104 — Bump webpack (dev, minor)
```

---

#### STEP 4: Review Each PR (In Order)

For EACH PR, execute this checklist:

```markdown
### PR #100 — Bump react 17.0.0 → 18.0.0

#### 4.1: Check for Breaking Changes
- [ ] Read PR description (changelog summary)
- [ ] Check for "BREAKING" tag or major version bump
- [ ] Review file changes for compatibility updates
  - New major version? Expect API changes
  - Compatibility warnings? Read them
- [ ] Action: If major breaking change, read migration guide

#### 4.2: Verify No Conflicts
- [ ] Check GitHub PR page: "This branch has no conflicts" ✅
- [ ] If conflicts: resolve (see STEP 6 below)

#### 4.3: Validate CI Passing
- [ ] Check all workflow checks: ✅ GREEN or ⚠️ YELLOW (pre-existing)
- [ ] Failing tests related to this package? (PR-specific)
- [ ] Pre-existing test failures? (document, don't block)
- [ ] Action: If PR-specific failure, read logs and determine if merge-blocking

#### 4.4: Check for package-lock.json Updates
- [ ] Dependabot should auto-update package-lock.json
- [ ] Verify package-lock.json is included in PR
- [ ] If missing: Comment "@dependabot recreate" to regenerate

#### 4.5: Inspect Code Changes (Quick)
- [ ] Are there unexpected changes outside package*.json?
- [ ] Legitimate changes? (compatibility shims, version pins)
- [ ] Suspicious changes? (review carefully or ask)

#### 4.6: Check Issue Linking
- [ ] Is PR linked to any GitHub issue?
- [ ] If yes: Verify relevance
- [ ] If no: No action needed (dependabot PRs are self-contained)
```

---

#### STEP 5: Address Breaking Changes

If major version bump has breaking changes:

**Option A: Include in Current Merge (if you understand changes)**
- [ ] Read migration guide for package
- [ ] Verify code compatibility (or make updates)
- [ ] Test locally if possible (see STEP 7)
- [ ] Proceed with merge

**Option B: Create Separate Issue (if changes are complex)**
- [ ] Create issue: "Follow-up: Migrate to {package} v{major}"
- [ ] Describe breaking changes and required code updates
- [ ] Link to dependabot PR
- [ ] Label: `type:task`, `area:dependencies`, `priority:high`
- [ ] Merge dependabot PR
- [ ] Create follow-up PR with compatibility updates

**Example:**
```markdown
## Issue: Migrate to React 18

Dependabot PR #100 updates React to v18 (major version).

Breaking Changes:
- React.render() → ReactDOM.render()
- Strict mode enabled by default
- Suspense behavior changed

Task: Update codebase to handle new API
Related: Dependabot PR #100
```

---

#### STEP 6: Resolve Conflicts (If Any)

If GitHub shows "This branch has conflicts":

```bash
# Fetch latest
git fetch origin develop

# Checkout PR branch
git checkout {dependabot-branch-name}

# Merge develop (or rebase, depending on repo convention)
git merge origin/develop

# Resolve conflicts in editor
# Usually package.json or package-lock.json

# Stage and commit
git add .
git commit -m "merge: resolve conflicts with develop"
git push origin {dependabot-branch-name}

# Wait for CI to re-run
# Check GitHub PR: "Ready to merge" should show
```

---

#### STEP 7: Optional — Test Locally

For critical packages (react, next, node), test before merge:

```bash
# Checkout PR branch
git checkout {dependabot-branch-name}

# Install dependencies with updated versions
npm ci

# Run tests
npm test

# Build (if applicable)
npm run build

# Test app manually (if applicable)
npm run dev
# Open http://localhost:3000
# Test critical features

# If all pass: proceed with merge
# If failure: comment on PR with details
```

---

#### STEP 8: Merge PR to Develop

**IMPORTANT: Base branch MUST be `develop`, NOT `main`**

```bash
# Verify target branch
gh pr view {pr-number} --json baseRefName
# Should show: baseRefName: "develop"

# Merge (squash recommended for dependabot)
gh pr merge {pr-number} --squash --auto

# OR merge manually:
git checkout develop
git pull origin develop
git merge {dependabot-branch-name}
git push origin develop

# Delete branch
git branch -D {dependabot-branch-name}
git push origin --delete {dependabot-branch-name}

# Verify merge succeeded
gh pr view {pr-number} --json state
# Should show: state: "MERGED"
```

**Merge commit message (squash merge):**
```
chore: update dependencies — bump {package} from v{old} to v{new}

- {Package} {old} → {new}
- Includes {other packages if multiple}
- CI: {status} ✅

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

---

#### STEP 9: Verify Post-Merge

After merging, validate:

```bash
# Fetch latest develop
git fetch origin develop

# Verify package versions updated
npm ls react  # Should show new version

# Verify no leftover branches
git branch | grep dependabot  # Should be empty

# Check CI status
# (Wait 2-5 min for CI to run on merged commit)
gh run list --limit 1
```

---

#### STEP 10: Report Progress

After merging each PR:

```markdown
## PR #100 ✅ MERGED

**Package:** react 17.0.0 → 18.0.0  
**Change Type:** Major  
**Breaking Changes:** ✅ None for this codebase  
**Test Status:** ✅ Passed  
**Merge Commit:** {commit-hash}  
**Merge Strategy:** Squash  
**Next PR:** #101 (jest update)
```

---

### Key Decisions

#### Update vs. Regenerate package-lock.json

| Scenario | Action | Command |
|----------|--------|---------|
| Dependabot updated both files | No action | (skip) |
| Only package.json updated | Regenerate | `npm install` → commit |
| package-lock.json is stale | Regenerate | `npm ci && npm install` → commit |
| Lock file has merge conflicts | Regenerate | Resolve conflict, `npm ci` → commit |

**Regenerate lock file:**
```bash
# Option 1: Install fresh (recommended)
npm install

# Option 2: Clean slate
rm package-lock.json
npm install
```

#### Breaking Change Severity

| Severity | Example | Action |
|----------|---------|--------|
| **Low** | Deprecation warnings | Merge now, fix warnings in separate PR |
| **Medium** | API changed, easy fix | Update code in same PR or follow-up PR |
| **High** | Major refactor required | Create issue, merge dependabot PR, schedule follow-up |
| **Critical** | Incompatible runtime | Block merge, create issue, schedule fix PR |

---

### Troubleshooting

#### CI Failing — Is It PR-Specific?

**Test 1: Reproduce on develop**
```bash
git checkout develop
git pull origin develop
# Run same failing check locally
npm test  # If tests fail here: pre-existing
```

**Test 2: Check PR diff**
- Did this PR change anything other than package.json?
- If yes to unrelated changes: suspicious
- If no (only dependencies): failure likely pre-existing or incompatibility

**Test 3: Check CI history**
- Does the base `develop` branch show same failure?
- If yes: pre-existing, don't block merge

#### Merge Conflict in package-lock.json

**Most common:** Two different dependency versions competing

```bash
# Regenerate from scratch
rm package-lock.json
npm install
git add package-lock.json
git commit -m "merge: regenerate package-lock.json"
```

#### Dependabot Not Creating PRs

Dependabot may be disabled or not configured:

```bash
# Check if enabled in GitHub repo settings
# Settings → Code security and analysis → Dependabot

# If disabled: Enable Dependabot alerts + version updates
# Note: May need to commit dependabot.yml config
```

---

### References

- **Dependabot Config:** `.github/dependabot.yml` (if exists)
- **Mergify Config:** `.github/mergify.yml` (if automated)
- **Package Management:** `package.json` and `package-lock.json`
- **CI Workflows:** `.github/workflows/` (test, build, lint workflows)
- **Npm Docs:** https://docs.npmjs.com/
- **Node.js Releases:** https://nodejs.org/en/about/releases/

---

**Effort:** 10 min per PR (manual) or 1–2 hours (mergify setup)  
**Use When:** Dependabot PRs are open, need merging in correct order  
**Output:** Merged PRs, updated dependencies, clean CI  
**Dependencies:** `gh` CLI, `npm`, git, GitHub access, `develop` branch permissions

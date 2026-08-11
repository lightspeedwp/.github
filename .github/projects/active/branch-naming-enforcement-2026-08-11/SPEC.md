# Branch Naming Enforcement — Specification

**Version:** 1.0  
**Status:** Draft (pending OpenSpec review)  
**Author:** Ash Shaw  
**Last Updated:** 2026-08-11

## Executive Summary

This specification defines a two-layer enforcement system for branch naming conventions in the LightSpeed `.github` repository. The system combines local pre-commit hooks and GitHub Actions workflows to ensure all branches follow the strict naming pattern `{type}/{scope}-{short-title}` before reaching shared branches (`develop`, `main`).

## Requirements

### Functional Requirements

#### FR-1: Branch Name Validation Pattern

- **Requirement:** All branches must match the regex pattern: `^(feat|fix|hotfix|release|refactor|chore|docs|test|perf|ci|build|deps|security|revert|research|design|a11y|ux|i18n|ops|proto|ds|api|telemetry|content|seo|config|migrate|qa|uat)/([a-z0-9\-]+)-([a-z0-9\-]+)$`
- **Scope:** Type must be one of the core prefixes; scope and title must be lowercase kebab-case
- **Examples:**
  - ✅ `feat/branch-naming-enforcement`
  - ✅ `fix/validation-script-bug`
  - ✅ `chore/update-dependencies`
  - ❌ `claude/my-branch` (forbidden prefix)
  - ❌ `Feature/MyBranch` (wrong case)
  - ❌ `fix-bug` (missing type prefix)

#### FR-2: Local Pre-Commit Hook

- **Requirement:** Validate branch name before each commit
- **Trigger:** On `pre-commit` hook (runs before `git commit`)
- **Behavior:**
  - Exits with code 0 if branch name is valid
  - Exits with code 1 if invalid; displays error message
  - Does not block commits on `main` or `develop` (to avoid trapping release workflows)
  - Skips validation if in detached HEAD state (rebase, merge operations)
- **Installation:** User must install hook manually or via `npm run setup:hooks`
- **Error Message:** Display rule, show current branch name, link to BRANCHING_STRATEGY.md

#### FR-3: GitHub Actions PR Validation Workflow

- **Requirement:** Block PR merge if branch name is invalid
- **Trigger:** On `pull_request` event (opened, reopened, synchronize)
- **Workflow Name:** `branch-name-validation.yml`
- **Behavior:**
  - Extract branch name from PR context
  - Run validation check
  - Post status check result (pass/fail)
  - On failure: Post comment with error message and link to naming guide
  - Do NOT block PRs targeting `main` from `release/*` or `hotfix/*` branches (they are exempt)
- **Status Check:** Required to pass before merge (configured via GitHub branch protection rules)

#### FR-4: Reusable Validation Script

- **Requirement:** Create a single validation utility used by both hook and workflow
- **Location:** `.github/scripts/validation/validate-branch-name.cjs`
- **Interface:**
  - Accept branch name as argument: `node validate-branch-name.cjs [branch-name]`
  - Return exit code 0 (valid) or 1 (invalid)
  - Support `--verbose` flag for detailed output
  - Support `--show-pattern` flag to display validation pattern
- **Reusability:** Script should be importable for use in other workflows/scripts

#### FR-5: Documentation & Setup

- **Requirement:** Provide clear setup instructions for developers
- **Deliverables:**
  - `SETUP.md` or `docs/SETUP_BRANCH_VALIDATION.md` — Hook installation guide
  - Update BRANCHING_STRATEGY.md with enforcement explanation
  - Comment in pre-commit hook explaining its purpose
  - Workflow comments explaining validation logic

### Non-Functional Requirements

#### NFR-1: Performance

- Pre-commit hook must complete in <100ms (simple regex check)
- Workflow must complete in <30s (status check only)

#### NFR-2: User Experience

- Error messages must be clear, actionable, and link to documentation
- Hook should explain how to fix the branch name
- Workflow comment should provide examples of valid names

#### NFR-3: Maintainability

- Validation pattern defined in single location (script)
- Both hook and workflow reference the same pattern
- Easy to update pattern if new types are added
- Code should include comments explaining regex

#### NFR-4: Security

- No secrets passed to validation script
- No user paths logged in error messages (privacy)
- Validation script should be read-only

#### NFR-5: Compatibility

- Hook must work on macOS, Linux, and Windows (Git Bash)
- Workflow must work on `ubuntu-latest`
- Node.js 18+ compatibility

## Design Decisions

### Decision 1: Two-Layer Enforcement

**Question:** Should we use only pre-commit hook, only PR validation, or both?

**Options:**

1. Pre-commit hook only — Prevents all bad branches locally but blocks legitimate use cases (detached HEAD, bisect)
2. PR validation only — Allows bad branches to be pushed but blocks merge
3. Both (recommended) — Layered defense; catches most issues locally, workflow catches edge cases

**Decision:** Implement **both** layers

- **Rationale:** Pre-commit catches ~95% of violations instantly. Workflow catches bypasses. Together they provide defense-in-depth without being overly restrictive. Developers can bypass hook locally if needed (e.g., for rebase), but can't merge bad branches.

### Decision 2: Hook Installation Method

**Question:** Should hook be auto-installed, optional, or required?

**Options:**

1. Auto-install via `npm install` — Ensures everyone has it
2. Optional via `npm run setup:hooks` — Lets developers choose
3. Documented but manual — Users follow setup guide themselves

**Decision:** Implement via **`npm run setup:hooks`** (documented optional setup)

- **Rationale:** Git doesn't auto-run hooks from repos (security). Documented optional setup respects this convention. Developers install once; gets committed to local Git config. Workflow provides mandatory backup for those who skip setup.

### Decision 3: Validation Pattern Source

**Question:** Should validation pattern be hardcoded, loaded from config, or generated?

**Options:**

1. Hardcoded in script — Simple, fast, but requires code update to change pattern
2. Loaded from config file (JSON/YAML) — Flexible, single source of truth, requires file I/O
3. Regex in script, exported function — Reusable, testable, good middle ground

**Decision:** **Regex defined in script, exported as function**

- **Rationale:** Performance (no file I/O), single source of truth (function), reusable (export), maintainable (comments explain regex), testable.

### Decision 4: Workflow Trigger

**Question:** When should workflow validation run?

**Options:**

1. On every push — Validates all pushes (expensive, noisy)
2. On PR creation only — Validates when PR is opened (efficient, covers main use case)
3. On push to develop — Validates merges to develop (catches issues post-merge)

**Decision:** **PR creation and synchronize events**

- **Rationale:** Validates at the right moment (when PR is created). Synchronize event catches updates (rebases, new commits). Doesn't validate every push (cheaper). Runs only when needed.

### Decision 5: Exemptions

**Question:** Should any branches be exempt from validation?

**Options:**

1. No exemptions — All branches must follow pattern
2. Exempt release/hotfix on `main` — Allow existing release workflow
3. Exempt on `main` only — Allow any branch to merge to main (risky)

**Decision:** **`release/*` and `hotfix/*` exempt only when merging to `main`**

- **Rationale:** Release branches must reach `main`, but they should still follow naming conventions. Exemption prevents blocking release workflows. All other branches must follow pattern everywhere.

## Implementation Outline

### Phase 1: Validation Script

1. Create `.github/scripts/validation/validate-branch-name.cjs`
2. Define validation pattern (regex)
3. Export function for reuse
4. Add CLI interface for direct use
5. Write tests

### Phase 2: Pre-Commit Hook

1. Create `.github/hooks/pre-commit`
2. Implement logic to skip on main/develop, detached HEAD
3. Call validation script with error handling
4. Display helpful error messages
5. Document installation

### Phase 3: PR Validation Workflow

1. Create `.github/workflows/branch-name-validation.yml`
2. Extract branch name from PR context
3. Call validation script
4. Post status check result
5. On failure: post explanatory comment with examples
6. Configure as required status check

### Phase 4: Documentation

1. Create SETUP.md with hook installation instructions
2. Update BRANCHING_STRATEGY.md with enforcement section
3. Add troubleshooting guide for common issues
4. Document how to update pattern if needed

## Acceptance Criteria

- [ ] Validation script validates all valid branch names
- [ ] Validation script rejects all invalid branch names
- [ ] Pre-commit hook prevents commits on invalid branches
- [ ] Pre-commit hook doesn't interfere with rebase/merge operations
- [ ] PR validation workflow blocks merge on invalid branches
- [ ] Workflow posts helpful comment on failure
- [ ] Workflow correctly exempts `release/*` and `hotfix/*` on `main`
- [ ] Setup instructions are clear and tested on macOS, Linux, Windows
- [ ] Developers can install hook via `npm run setup:hooks`
- [ ] Tests cover edge cases (empty branch, special characters, boundary conditions)
- [ ] Error messages are helpful and link to documentation
- [ ] Performance: hook <100ms, workflow <30s

## Testing Strategy

### Unit Tests

- Validate pattern against 50+ branch names (valid and invalid)
- Test edge cases: empty string, special characters, very long names
- Test function export and CLI interface

### Integration Tests

- Test hook on real repo with valid/invalid branch names
- Test hook on main/develop (should pass)
- Test hook during rebase (should skip)
- Test workflow with PR from invalid branch
- Test workflow exemption for release/hotfix on main

### Manual Testing

- Test on macOS, Linux (Ubuntu), Windows (Git Bash)
- Test user experience: error messages, documentation links
- Test hook installation and removal

## Success Metrics

1. **Adoption:** >90% of developers install hook within 2 weeks
2. **Violation Rate:** <5% of PRs fail workflow validation (down from current ~30%)
3. **Setup Time:** <5 minutes to install hook (measured via user feedback)
4. **Performance:** No degradation in commit/push speed
5. **Satisfaction:** User feedback on error message clarity (>4/5 rating)

## Dependencies

- Git 2.9+ (hook support)
- Node.js 18+ (script execution)
- GitHub Actions (workflow)
- `npm` (for setup:hooks command)

## Constraints

- Hook is optional (can be bypassed; workflow provides backup)
- Workflow runs only on PRs (doesn't validate local branches)
- Pattern is static (requires code change to update; not externally configurable)
- Windows support limited to Git Bash (native CMD Git not supported)

## Future Enhancements

1. Auto-suggest correct branch name if invalid
2. Configurable pattern via `.github/config/branch-naming.json`
3. Slack notification on PR validation failure
4. Analytics: track validation failures by type/scope
5. Integration with Git UI tools (VS Code, GitHub Desktop)

---

**Approval Status:** ⏳ Pending review  
**Next Step:** OpenSpec review and RFC generation

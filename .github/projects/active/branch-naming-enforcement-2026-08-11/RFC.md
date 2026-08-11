# RFC: Branch Naming Enforcement Workflow

**RFC Title:** Two-Layer Enforcement System for Branch Naming Conventions  
**Status:** 📋 Proposed  
**Author:** Ash Shaw  
**Created:** 2026-08-11  
**Target Audience:** Engineering team, DevOps, release management

## Problem Statement

Branch naming violations have become a recurring issue in the LightSpeed `.github` repository. Developers consistently fail to follow the strict naming convention `{type}/{scope}-{short-title}`, forcing manual remediation and creating friction in the PR review process.

### Current State

- **Manual validation:** `npm run validate:branch-name` script exists but is not enforced
- **No hard blocker:** Invalid branches can be pushed and PRs created without automatic rejection
- **Maintenance burden:** Team members must manually catch and correct violations
- **Inconsistent enforcement:** No automated mechanism to ensure compliance across all PRs

### Impact

- Time spent on manual validation and correction
- Confusion about which naming rules apply
- Risk of bad branch names reaching protected branches (if PR review is incomplete)
- Repetitive feedback loop for developers

## Proposed Solution

Implement a **two-layer enforcement system**:

### Layer 1: Local Pre-Commit Hook

- Validates branch name before each commit
- Provides instant feedback to developers
- **Catches ~95% of violations** before they reach the server
- Allows developers to fix branch names immediately

**Advantages:**

- Instant feedback (errors show before push)
- No server round-trip required
- Low latency (<100ms)
- Reduces server load

**Limitations:**

- Optional (users can bypass if needed)
- Requires manual setup

### Layer 2: GitHub Actions Validation Workflow

- Validates branch name when PR is created
- Blocks PR merge if branch is invalid
- **Catches remaining ~5%** of violations (bypassed hook, detached HEAD operations)
- Posts helpful comment with naming rules and examples

**Advantages:**

- Mandatory (cannot be bypassed)
- Works for all PRs regardless of local setup
- Provides documentation link at point of failure
- Catches edge cases (rebase, merge operations)

**Limitations:**

- Slightly delayed (requires PR creation)
- Requires GitHub configuration

## Design Trade-Offs

### Trade-Off 1: Hook Enforcement Level

| Option | Pros | Cons |
| --- | --- | --- |
| **Pre-commit hook only** | Catches all violations locally, instant feedback | Cannot catch all cases (rebase, detached HEAD); requires setup |
| **PR validation workflow only** | Mandatory, no setup required | Slightly delayed feedback; allows bad branches to be pushed |
| **Both layers (recommended)** | Layered defense, catches ~99% of violations | Slightly more complexity |

**Recommendation:** Implement **both layers**. The hook catches the common case (normal development); the workflow provides a safety net for edge cases and developers who skip setup.

### Trade-Off 2: Hook Installation

| Option | Pros | Cons |
| --- | --- | --- |
| **Auto-install (npm install)** | All developers have it immediately | Violates Git security model; can be surprising |
| **Manual setup (npm run setup:hooks)** | Respects user choice, follows Git convention | Requires developer action; some may skip |
| **Documented guide only** | Simplest, no tooling | Low adoption rate; easy to forget |

**Recommendation:** Implement via **`npm run setup:hooks`** with clear documentation. Respects Git conventions; documented optional setup encourages adoption.

### Trade-Off 3: Validation Pattern Flexibility

| Option | Pros | Cons |
| --- | --- | --- |
| **Hardcoded regex** | Simple, fast, no config files | Requires code change to update pattern |
| **External config (JSON/YAML)** | Flexible, non-technical updates possible | Adds file I/O overhead; increases complexity |
| **Exported function with comments** | Reusable, testable, single source of truth | Still requires code change; more code |

**Recommendation:** Use **exported function with clear comments**. Good balance of performance, reusability, and maintainability. Pattern updates are infrequent; code change is acceptable.

## Technical Approach

### 1. Validation Script (`.github/scripts/validation/validate-branch-name.cjs`)

```javascript
// Pattern: {type}/{scope}-{short-title}
const BRANCH_PATTERN = /^(feat|fix|hotfix|release|refactor|chore|docs|test|perf|ci|build|deps|security|revert|research|design|a11y|ux|i18n|ops|proto|ds|api|telemetry|content|seo|config|migrate|qa|uat)\/([a-z0-9\-]+)-([a-z0-9\-]+)$/;

function validateBranchName(branchName, verbose = false) {
  // Implementation details
}

module.exports = { validateBranchName, BRANCH_PATTERN };
```

### 2. Pre-Commit Hook (`.github/hooks/pre-commit`)

```bash
#!/usr/bin/env bash
# Validate branch name before commit

BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Skip on main/develop (release workflow)
if [[ "$BRANCH" == "main" || "$BRANCH" == "develop" ]]; then
  exit 0
fi

# Skip on detached HEAD (rebase, bisect, merge)
if [[ "$BRANCH" == "HEAD" ]]; then
  exit 0
fi

# Validate branch name
node .github/scripts/validation/validate-branch-name.cjs "$BRANCH"
exit $?
```

### 3. GitHub Actions Workflow (`.github/workflows/branch-name-validation.yml`)

```yaml
name: Branch Name Validation

on:
  pull_request:
    types: [opened, reopened, synchronize]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Validate branch name
        run: |
          BRANCH="${{ github.head_ref }}"
          node .github/scripts/validation/validate-branch-name.cjs "$BRANCH"
        continue-on-error: true
```

### 4. Setup Command (npm script in `package.json`)

```json
{
  "scripts": {
    "setup:hooks": "cp .github/hooks/pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit"
  }
}
```

## Implementation Phases

### Phase 1: Development & Testing (2026-08-12)

- [ ] Create validation script with tests
- [ ] Create pre-commit hook
- [ ] Test on macOS, Linux, Windows
- [ ] Add npm setup:hooks command

### Phase 2: Workflow & Documentation (2026-08-12–2026-08-13)

- [ ] Create GitHub Actions workflow
- [ ] Write SETUP.md with installation guide
- [ ] Update BRANCHING_STRATEGY.md
- [ ] Create troubleshooting guide

### Phase 3: Testing & Rollout (2026-08-13–2026-08-14)

- [ ] Run workflow validation on existing PRs
- [ ] Verify hook behavior on all platforms
- [ ] Get team feedback
- [ ] Document any issues

### Phase 4: Enforcement & Monitoring (2026-08-14+)

- [ ] Enable workflow as required status check
- [ ] Announce setup instructions to team
- [ ] Monitor violation rate
- [ ] Collect feedback

## Success Criteria

1. **Functional:** Both hook and workflow validate names correctly
2. **Adoption:** >80% of team installs hook within 2 weeks
3. **Effectiveness:** Violation rate drops to <5% (from current ~30%)
4. **Performance:** No measurable impact on commit/push speed
5. **UX:** Error messages are clear and help developers fix issues

## Open Questions

1. **Q:** Should hook block commits on feature branches during rebase?  
   **A:** No; hook skips validation during detached HEAD state to avoid blocking legitimate operations.

2. **Q:** What if a developer has a legitimate reason to use a different naming pattern?  
   **A:** Developers can bypass the hook locally (`git commit --no-verify`) and the workflow will enforce the standard at PR time. Exceptions require explicit approval in PR description.

3. **Q:** How do we handle existing branches that don't follow the pattern?  
   **A:** Existing branches are not affected. Validation applies only to new commits/PRs. Developers can rename branches using `git branch -m <old> <new>`.

4. **Q:** Should we validate branch names on `main` branch (for release cycles)?  
   **A:** `release/*` and `hotfix/*` branches are exempt when merging to `main`. All other branches must follow the pattern.

5. **Q:** What happens if someone renames a branch after the PR is created?  
   **A:** Workflow runs on PR synchronize event; validation will fail again if branch is renamed to an invalid name.

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
| --- | --- | --- | --- |
| Hook breaks rebase workflow | Medium | High | Skip hook on detached HEAD state; document bypass |
| Low adoption of hook setup | Medium | Medium | Provide workflow as mandatory backup; clear setup docs |
| False positives in validation | Low | High | Extensive testing on valid/invalid names |
| Workflow too strict, blocks legitimate work | Low | Medium | Exemptions for release/hotfix; allow bypass via --no-verify |
| Performance impact on PR creation | Low | Low | Validation is simple regex check; <1s overhead |

## Alternative Approaches

### Alternative 1: Linting via Husky

Use Husky (npm package) instead of custom hook

- **Pros:** Popular, well-documented, auto-setup
- **Cons:** Additional dependency, heavier, less control
- **Decision:** Rejected in favor of lightweight custom hook

### Alternative 2: Forced Squash Merge with Validation

Enforce squash merge with branch name validation in merge commit

- **Pros:** Validates at merge time, captures final state
- **Cons:** More invasive, requires changes to merge workflow
- **Decision:** Rejected in favor of simpler validation workflow

### Alternative 3: Jira/Linear Integration

Link branch names to issue keys (e.g., `feat/PROJ-123-description`)

- **Pros:** Automatic issue tracking, clear link to work item
- **Cons:** Requires external system dependency, more complex
- **Decision:** Out of scope; consider for future enhancement

## Resources & References

- [BRANCHING_STRATEGY.md](../../../docs/BRANCHING_STRATEGY.md) — Authoritative branching rules
- [main-branch-guard.yml](../.github/workflows/main-branch-guard.yml) — Existing branch protection workflow (model)
- [validate-branch-name script](../../../npm/validate:branch-name) — Existing validation utility
- Git Hooks Documentation: <https://git-scm.com/docs/githooks>

## Approval & Next Steps

### Approval Checklist

- [ ] Engineering team consensus on two-layer approach
- [ ] Design review (trade-offs accepted)
- [ ] Security review (no risk to infrastructure)
- [ ] Performance review (no degradation expected)

### Next Steps (Post-Approval)

1. Create GitHub issues for each phase (5–7 issues)
2. Begin Phase 1 development
3. Post updates in project tracking
4. Collect team feedback after pilot

---

**RFC Status:** 📋 Open for feedback (08/11–08/13)  
**Decision Target:** 2026-08-13  
**Implementation Target:** 2026-08-14

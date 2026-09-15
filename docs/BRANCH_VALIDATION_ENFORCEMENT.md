# Branch Name Validation: Enforcement Policy

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

**Status**: Phase 2 US2 Implementation  
**Last Updated**: 2026-09-14  
**Target Audience**: Repository administrators, team leads, developers

---

## Overview

The branch name validation system provides **optional, configurable enforcement** at the remote (GitHub) level. Repositories can enable or disable validation checks independently, allowing for gradual rollout and team-specific policies.

### Three-Tier Validation Architecture

1. **Local (Developer Machine)**: Git pre-push hook validates before push (non-blocking, advisory)
2. **Remote (GitHub Actions)**: Workflow validates after push (configurable blocking)
3. **CLI**: Manual validation for scripting and CI/CD

---

## Enforcement Modes

### Mode 1: Advisory-Only (Default)

**Status Check**: Runs but does not block merge  
**Impact**: Validation results visible in PR, developers notified via comment if invalid  
**Use Case**: Gradual rollout, team getting familiar with branch naming rules  
**Configuration**: No additional setup required

```
✅ Validation workflow runs
✅ Invalid branch generates PR comment with correction suggestion
⛔ Does NOT block merge (merge button remains green)
```

### Mode 2: Merge-Blocking (Optional)

**Status Check**: Runs and blocks merge if validation fails  
**Impact**: Invalid branches cannot be merged until renamed  
**Use Case**: Strict enforcement, mature teams, production repos  
**Configuration**: Repository administrator must explicitly enable

```
✅ Validation workflow runs
✅ Invalid branch generates PR comment with correction suggestion
⛔ Blocks merge (red X on merge button until validation passes)
```

---

## Enabling Merge-Blocking Enforcement

### For Repository Administrators

**Step 1**: Navigate to repository settings → **Branches** → **Branch protection rules**

**Step 2**: Select the target branch (usually `main` or `develop`)

**Step 3**: Under "Require status checks to pass before merging", enable:

- `✓ Validate branch name`

**Step 4**: Optionally enable:

- `✓ Require branches to be up to date before merging`
- `✓ Require code reviews before merging`

**Step 5**: Save protection rule

### Result

- Valid branches: Merge is allowed
- Invalid branches: Merge is blocked with validation error details visible in the PR

### Disabling Merge-Blocking

**Step 1**: Navigate to repository settings → **Branches** → **Branch protection rules**

**Step 2**: Select the protection rule

**Step 3**: Under "Require status checks to pass before merging", uncheck:

- `✗ Validate branch name`

**Step 4**: Save changes

---

## Workflow Status Checks

### Check Name

**`Validate branch name`** — Always runs on push to any branch

### Check Outcomes

| Outcome | Meaning | Action |
|---------|---------|--------|
| ✅ PASS | Branch name valid | No action needed; merge allowed (if enabled) |
| ❌ FAIL | Branch name invalid | [See "Invalid Branch Actions" below] |
| ⏳ PENDING | Still validating | Merge button shows "Some checks are pending" |
| ⏭️ SKIPPED | Validation skipped | Only if workflow has conditional logic (rare) |

---

## Invalid Branch Actions

### Automatic Response

When a branch fails validation:

1. **PR Comment Posted**: Validation error details posted to PR
   - Error: Why the branch name is invalid
   - Suggestion: Corrected branch name
   - Link to branching strategy guide

2. **Validation Fails**: Check status turns red (❌)

3. **Metrics Recorded**: Compliance metrics collected for reporting

### Manual Resolution (Developer)

**Option A**: Rename branch locally, force-push (hard reset history)

```bash
git branch -m old-name new-name
git push -u origin new-name
git push origin --delete old-name
```

**Option B**: Rename branch using GitHub UI

- Edit PR title (doesn't help) — Need to rename actual Git branch
- Must rename via command-line

**Option C**: Bypass with `git push --no-verify`

- Allows push locally but remote enforcement still applies
- PR will still show validation failure
- Merge remains blocked if enforcement enabled

---

## Policy Decision Tree

**Are you ready to enforce strict branch naming?**

```
├─ NO (Gradual rollout, just getting started)
│  └─ Keep default: Advisory-only
│     - Developers see feedback via PR comment
│     - Merge remains allowed
│     - Team learns correct naming
│     - Enable blocking after 2-4 weeks of advisory

├─ YES (Ready for enforcement)
│  └─ Enable merge-blocking in branch protection rules
│     - Select branches: main, develop, or all (*)
│     - Validation check becomes required
│     - Merge blocked until branch renamed
│     - Team cannot accidentally merge invalid branches

└─ CUSTOM (Different rules for different branches)
   └─ Per-branch protection rules
      - main: Strict (merge-blocking enabled)
      - develop: Strict (merge-blocking enabled)
      - feature/*: Advisory (merge-blocking disabled)
      - hotfix/*: Strict (merge-blocking enabled)
```

---

## Organizational Rollout Phases

### Phase 1: Pilot Repos (Week 1-2)

- **Enforcement Mode**: Advisory-only
- **Repos**: 10-20 pilot repositories
- **Goal**: Validate system, gather feedback, train team
- **Metrics**: % branches using valid naming, confusion areas

### Phase 2: Expanded Rollout (Week 3-4)

- **Enforcement Mode**: Advisory-only → Merge-blocking (selective)
- **Repos**: All 50+ repositories
- **Approach**: Phase 2a (advisory), then Phase 2b (blocking by team)
- **Metrics**: Compliance %, adoption rate

### Phase 3: Full Enforcement (Week 5+)

- **Enforcement Mode**: Merge-blocking enabled on all critical branches
- **Repos**: All 50+ repositories
- **Target**: 95%+ compliance across organization
- **Support**: Dedicated support channel for adoption issues

---

## Metrics & Monitoring

### Compliance Dashboard

Tracks per-repository:

- % of new branches using valid naming
- % of PRs from invalid branches
- Top invalid branch patterns
- Merge-blocking enforcement adoption

### Automated Alerts

- **Daily**: Compliance summary by team
- **Weekly**: Trend analysis (going up/down)
- **Monthly**: Full org-wide report

### Manual Review (Team Leads)

Monitor repositories below 80% compliance and offer support:

```
1. Review validation metrics for the repo
2. Identify most common invalid patterns
3. Reach out to team with:
   - Top invalid branch types (e.g., most are feat/ → feature/)
   - 1-on-1 training if needed
   - Link to branching strategy guide
4. Follow up after 1 week
```

---

## Troubleshooting

### Validation workflow is not running

**Cause**: Workflow file not present or disabled  
**Fix**:

1. Check `.github/workflows/branch-name-validation.yml` exists
2. Verify workflow is not disabled in repo settings
3. Push a test commit to trigger workflow

### Merge button shows validation status but won't let me merge

**Cause**: Merge-blocking enforcement is enabled and validation is failing  
**Fix**:

1. Check PR comment for validation error details
2. Rename branch to match pattern: `{type}/{scope}-{title}`
3. Force-push renamed branch or create new PR from corrected branch

### Validation failed but my branch name looks correct

**Cause**: Common issues:

- Uppercase letters in branch name (must be lowercase)
- Invalid type (not in list of 24 authorized types)
- Forbidden prefix (claude/, copilot/, openai/)
- Malformed scope/title (underscores, spaces, consecutive hyphens)

**Fix**:

1. Read PR comment for specific error
2. Check [Branch Naming Strategy](./BRANCHING_STRATEGY.md) guide
3. Use CLI validation locally: `npm run validate:branch-name -- --branch "your-branch"`

### Can I temporarily disable merge-blocking for an emergency?

**For Repository Admin**:

1. Navigate to branch protection rules
2. Uncheck "Validate branch name" requirement
3. Merge PR with invalid branch
4. **Important**: Re-enable validation immediately after merge
5. Rename branch for future use

**For Developers**:

- No way to bypass merge-blocking without admin access
- Contact team lead or repository administrator for emergency override

---

## FAQ

### Q: Does this affect my existing branches?

**A**: No. The validation system only checks new branches created after the feature is deployed. Existing branches are not retroactively validated (unless backwards-compatibility enforcement is enabled via org policy).

### Q: Can I use `git push --no-verify` to bypass the hook?

**A**: Yes, locally. But the remote workflow will still run and fail, blocking merge if enforcement is enabled. The hook is advisory; remote enforcement is what matters.

### Q: What if my branch name is only slightly wrong?

**A**: The validation system will suggest the closest valid branch name using fuzzy matching. The PR comment will include the suggestion; create a new PR from the corrected branch.

### Q: Can I add new branch types or labels?

**A**: New branch types must be added through change management process. See CLAUDE.md → "Configuration Files — LOCKED" for the update request process.

### Q: Who decides whether enforcement is on or off for my repo?

**A**: Repository administrator. Team leads can request changes to branch protection rules via issue or direct communication with repository admin.

---

## Related Documentation

- [Branch Naming Strategy Guide](./BRANCHING_STRATEGY.md) — Complete reference for 24 branch types
- [CLAUDE.md](../CLAUDE.md) — Repository-wide instructions; branch naming policy section
- [PR Creation Process](./PR_CREATION_PROCESS.md) — How to create PRs using correct branch names
- `.github/workflows/branch-name-validation.yml` — Workflow implementation details

---

## Support

**For questions or issues**:

1. Check FAQ section above
2. Read [Branch Naming Strategy Guide](./BRANCHING_STRATEGY.md)
3. Run local validation: `npm run validate:branch-name -- --branch "your-branch"`
4. Open issue on `.github` repository with `[BRANCH-VALIDATION]` tag
5. Contact team lead or DevOps for urgent issues

**Response Time**:

- Critical issues (validation broken): <2 hours
- Normal issues (validation questions): <1 day
- Feature requests: Quarterly review

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

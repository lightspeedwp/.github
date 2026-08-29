---
title: "Agentic Release Workflow — User Guide"
description: "How to use the Phase 5A Release Agent for safe, automated releases"
status: "draft"
version: "1.0"
date: "2026-08-19"
audience: "maintainers"
---

# Agentic Release Workflow — User Guide

## Quick Start

### Release a Patch (Automatic Approval)

```bash
# Patch releases are auto-approved if all safety gates pass
npm run release -- --scope=patch
```

**What happens:**

1. ✅ Safety gates validate your release
2. ✅ Automatic approval (no human review needed)
3. ✅ Version bumped (1.0.0 → 1.0.1)
4. ✅ PR created → merged → Release published

### Release a Minor (Requires 1 Approval)

```bash
# Minor releases require 1 human approval
npm run release -- --scope=minor
```

**What happens:**

1. ✅ Safety gates validate your release
2. ⏳ PR created for team review
3. 👤 You (or a teammate) approve the PR
4. ✅ Approved PRs automatically merge
5. ✅ Release published

### Release a Major (Requires 2+ Approvals)

```bash
# Major releases require 2+ maintainer approvals
npm run release -- --scope=major
```

**What happens:**

1. ✅ Safety gates validate your release
2. ⏳ PR created with breaking changes warning
3. 👤 Two+ maintainers review and approve
4. ✅ All approvals → auto-merge → Release published

---

## Pre-Release Checklist

Before running any release command, verify:

✅ You are on `develop` branch

```bash
git branch  # Should show: * develop
```

✅ No uncommitted changes

```bash
git status  # Should be: nothing to commit, working tree clean
```

✅ CHANGELOG.md is updated

```bash
# Look for your changes in [Unreleased] section
grep -A 10 "## \[Unreleased\]" CHANGELOG.md
```

✅ VERSION file exists with valid format

```bash
cat VERSION  # Should look like: 1.0.0
```

---

## Understanding Safety Gates

Your release passes through **7 safety gates** that validate every step:

### Gate 1: Pre-flight Checks ✈️

- **What:** Ensures your repo is in a valid state
- **Checked:** Branch (develop), uncommitted changes, VERSION file, CHANGELOG
- **Fails if:** You're not on develop, or you have uncommitted work

**Fix:**

```bash
git checkout develop
git commit -m "Update changelog for release"
```

### Gate 2: Agentic Reasoning 🧠

- **What:** AI evaluates if your release is safe
- **Score:** Must be ≥ 80% confidence
- **Factors:** Changelog quality, scope risk, breaking changes

**Fix:** Improve your changelog

```bash
# Add detailed entries to [Unreleased] section
# Format:
# ## [Unreleased]
# 
# ### Added
# - New feature description
#
# ### Fixed
# - Bug fix description
```

### Gate 3: Version Consistency 🔢

- **What:** Validates semantic versioning
- **Checked:** X.Y.Z format, correct bump calculation
- **Calculates:** 1.0.0 → 1.0.1 (patch), 1.0.0 → 1.1.0 (minor), 1.0.0 → 2.0.0 (major)

**Fix:** Ensure VERSION has valid format

```bash
echo "1.0.0" > VERSION  # Must be X.Y.Z format
```

### Gate 4: Tag Uniqueness 🏷️

- **What:** Ensures no duplicate release tags
- **Checked:** vX.Y.Z tag doesn't already exist

**Fix:** Delete duplicate tag if it exists

```bash
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

### Gate 5: Authorization 🔐

- **What:** Verifies you have permission to release
- **Who:** Members of `@lightspeedwp/maintainers` team

**Fix:** Contact team lead to be added as maintainer

### Gate 6: Integrity Filter 🛡️

- **What:** Detects secrets in your code (passwords, API keys, tokens)
- **Tool:** Gitleaks scanning

**Fix:** Remove secrets and try again

```bash
# If secrets detected, remove them from code
# Then commit and try release again
git add .
git commit -m "Remove sensitive data"
```

### Gate 7: Approval Enforcement ✅

- **What:** Ensures appropriate review level
- **Patch:** ✅ Auto-approved (no review needed)
- **Minor:** 👤 Requires 1 maintainer approval
- **Major:** 👤👤 Requires 2+ maintainer approvals

**Fix:** Wait for maintainer approval on PR

---

## Dry-Run Mode (Safe Testing)

Test your release **without creating mutations**:

```bash
npm run release -- --scope=patch --dry-run
```

**What happens:**

- ✅ All 7 safety gates run
- 📋 Preview artifacts generated (no commits, tags, or PRs)
- 🔍 You can review what WOULD happen

**Dry-run artifacts:**

- `release-dry-run-plan.md` — Step-by-step what would happen
- `version-bump-preview.txt` — Old version → new version
- `changelog-rolled.md` — How CHANGELOG would look after release

**Next step:** If dry-run looks good, run without `--dry-run`:

```bash
npm run release -- --scope=patch
```

---

## Common Issues & Fixes

### ❌ "Not on develop branch"

**Problem:** You're on a different branch (e.g., `main`, `feature/xyz`)

**Fix:**

```bash
git checkout develop
git pull origin develop
```

### ❌ "Uncommitted changes detected"

**Problem:** You have modified files that haven't been committed

**Fix:**

```bash
git status  # See what files changed
git add .
git commit -m "Prepare for release"
```

### ❌ "CHANGELOG.md missing [Unreleased] section"

**Problem:** Your changelog is missing the `## [Unreleased]` header

**Fix:** Add it to the top of CHANGELOG.md:

```markdown
# Changelog

## [Unreleased]

### Added
- Your new features here

### Fixed
- Bug fixes here

## [1.0.0] - 2025-01-01
...
```

### ❌ "Agentic score below threshold"

**Problem:** Your changelog lacks sufficient detail (score < 80%)

**Fix:** Add more detailed entries:

```markdown
## [Unreleased]

### Added
- Feature 1: Detailed description
- Feature 2: What problem it solves
- Feature 3: How to use it

### Fixed
- Bug fix 1: What was broken, how it's fixed
- Bug fix 2: Details

### Changed
- API change: Old way vs new way
```

### ❌ "Actor not authorized"

**Problem:** You're not in the maintainers team

**Fix:** Contact @ash to add your GitHub account to the maintainers team

### ⏳ "Minor release: requires 1 human approval"

**Problem:** Minor releases need review before merge

**What to do:**

1. Click the PR link in the output
2. Ask a teammate to review
3. Once approved, PR auto-merges
4. Release publishes

### ⏳ "Major release: requires 2+ human approvals"

**Problem:** Major releases are high-risk, need 2 reviewers

**What to do:**

1. PR created with breaking changes warning
2. Ping 2+ maintainers for review: `@ash @teammate`
3. Each must approve separately
4. Both approvals → auto-merge → Release publishes

---

## Fallback to Manual Release

If you need to bypass the agentic workflow:

```bash
# Call Phase 4 release agent directly (no safety gates)
node scripts/workflows/release/run-release-agent.cjs
```

**⚠️ WARNING:** This skips all safety gates. Only use if:

- Gates are broken
- You need emergency release
- You understand the risks

---

## Monitoring Your Release

### Live Status

```bash
# Check release workflow status
gh run list --workflow=release.yml --limit=1
```

### After Release

```bash
# Verify tag was created
git tag -l | grep v

# Verify version bumped
cat VERSION

# Check changelog was rolled
grep -A 5 "^## \[" CHANGELOG.md | head -10
```

### Rollback (If Needed)

```bash
# Delete the release (if published)
gh release delete vX.Y.Z --yes

# Delete the tag
git tag -d vX.Y.Z
git push origin :refs/tags/vX.Y.Z

# Revert VERSION and CHANGELOG
git revert <commit-hash>
```

---

## FAQ

### Q: How long does a release take?

**A:** ~2-5 minutes for patch releases (auto-approved). Minor/major releases take longer depending on team availability for review.

### Q: Can I release multiple times per day?

**A:** Yes! Each release is independent. No waiting period between releases.

### Q: What if the changelog has typos?

**A:** The agentic score may be slightly lower, but won't block the release. For patch releases, it will likely still pass. For minor/major, ensure a teammate approves.

### Q: Can I customize the version number?

**A:** Yes, use `--version` flag:

```bash
npm run release -- --version=2.0.0
```

**Warning:** Use sparingly. The automatic calculation (semver) is recommended.

### Q: What happens if approval times out?

**A:** PRs have no timeout. Once all approvals are received, they auto-merge. You can merge manually if needed:

```bash
gh pr merge <pr-number> --auto --squash
```

### Q: Can non-maintainers run releases?

**A:** No. Gate 5 (Authorization) will block it. Contact team lead to be added to maintainers team.

---

## Support

- 📖 **Docs:** [AGENTIC_WORKFLOW_SPEC.md](./AGENTIC_WORKFLOW_SPEC.md)
- 🐛 **Issues:** Create GitHub issue with `release-agent` label
- 💬 **Questions:** Ask in #engineering Slack channel
- 👤 **Admin help:** Contact @ash

---

*Agentic Release Workflow v1.0*  
*Last updated: 2026-08-19*

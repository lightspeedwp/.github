---
title: "Branch Naming & PR Strategy — Quick Reference"
description: "Fast lookup guide for developers"
type: "guide"
---

# Branch Naming Quick Reference

## The Pattern
```
{type}/{scope}-{title}
```

## Quick Type Picker

| Want to... | Use Type | Example |
|-----------|----------|---------|
| Add a feature | `feat` | `feat/user-auth-login` |
| Fix a bug | `fix` | `fix/authentication-timeout` |
| Fix urgent bug | `hotfix` | `hotfix/security-breach` |
| Update docs | `docs` | `docs/branching-guide` |
| Add tests | `test` | `test/unit-tests-auth` |
| Refactor code | `refactor` | `refactor/api-layer` |
| Update dependencies | `deps` | `deps/upgrade-lodash` |
| Fix security issue | `security` | `security/xss-fix` |
| Improve performance | `perf` | `perf/query-caching` |
| Update CI/CD | `ci` | `ci/github-actions-workflow` |
| Maintenance work | `chore` | `chore/cleanup` |

## Validation Checklist

Before pushing your branch:

- [ ] Type is lowercase (no capitals)
- [ ] Type is from the allowed list (see table above)
- [ ] Type is followed by `/`
- [ ] Scope is kebab-case (hyphens, no underscores)
- [ ] Scope is meaningful (not just "fix" or "update")
- [ ] Hyphen between scope and title
- [ ] Title is descriptive and brief
- [ ] No `claude/`, `copilot/`, or `openai/` prefixes
- [ ] Total length is reasonable (15-120 chars)

## Test Your Branch

```bash
npm run validate:branch-name -- --branch <your-branch>
```

Expected output:
```
✅ Branch 'feat/user-auth-login' matches the repository branching strategy.
```

## Common Mistakes & Fixes

| ❌ Wrong | ✅ Right | Reason |
|---------|----------|--------|
| `claude/my-feature` | `feat/my-feature` | `claude/` prefix forbidden |
| `Feature/my-work` | `feat/my-work` | Type must be lowercase |
| `feat/my_feature` | `feat/my-feature` | Use hyphens, not underscores |
| `feat/my feature` | `feat/my-feature` | No spaces |
| `feature/my-work` | `feat/my-work` | Type should be `feat`, not `feature` |

## If Your Branch Name Is Wrong

1. Rename local branch:
   ```bash
   git branch -m new-correct-name
   ```

2. Push to remote:
   ```bash
   git push origin -u new-correct-name
   ```

3. Delete old branch:
   ```bash
   git push origin -d old-name
   ```

4. In GitHub: Close old PR, open new PR with correct branch

## PR Template Will Auto-Detect

Your branch type automatically determines which PR template you get:

- `feat/` → Feature template (with changelog section)
- `fix/` → Bug fix template (with testing checklist)
- `docs/` → Documentation template
- `test/` → Test template (with test coverage)
- ... (one for each type)

## Labels Auto-Applied

Based on your branch type, GitHub will automatically apply labels:

- `type:feature` (for `feat/` branches)
- `type:bug` (for `fix/` branches)
- `area:ci` (if scope matches known areas)
- ... (automatic labeling based on type and scope)

## Need Help?

- **Full spec:** See `BRANCH_AND_PR_STRATEGY.md`
- **More types:** See the Type Reference table in the spec
- **Troubleshooting:** See section 6 of the spec
- **Still stuck?** Ask in #dev-help or comment on the validation error

---

**Quick Test:**
```bash
# Test if your branch name is valid
git branch -vv

# Validate before you push
npm run validate:branch-name -- --branch feat/my-new-feature
```

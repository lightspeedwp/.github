---
title: Branch Naming Quick Reference
description: One-page summary of branch naming rules, patterns, and validation
file_type: documentation
version: 1.0
status: active
---

# Branch Naming Quick Reference

**One-page guide** for creating valid branch names. Full details: [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)

## The Pattern

```
{type}/{scope}-{short-title}
```

- **All lowercase**, hyphens only, no dots or underscores
- **No leading/trailing/consecutive hyphens**
- Example: `feat/user-authentication`, `fix/button-styling`, `release/v2-1-0`

## Allowed Types (31 Total)

### Core (20)
```
feat  fix  hotfix  release  refactor  chore  docs  test  perf  ci
build  deps  security  revert  research  design  a11y  ux  i18n  ops
```

### Product (5)
```
proto  ds  api  schema  telemetry
```

### Content (6)
```
content  seo  config  migrate  qa  uat  audit  codex
```

## ✅ Valid Examples

```
feat/user-authentication          ✓ New feature
fix/button-styling                ✓ Bug fix
hotfix/critical-security-patch    ✓ Urgent fix for main
release/v2-1-0                    ✓ Release (hyphens, not dots)
release/v3-0-0-rc1                ✓ Release candidate
docs/api-reference                ✓ Documentation
chore/update-dependencies         ✓ Maintenance
ci/github-actions-optimization    ✓ CI/CD improvement
a11y/keyboard-navigation          ✓ Accessibility
ops/post-release-sync             ✓ Operations
```

## ❌ Invalid Examples

```
release/v2.1.0                    ✗ Dots not allowed (use hyphens)
feat/MyFeature                    ✗ Uppercase not allowed
feat/my_feature                   ✗ Underscores not allowed
claude/my-feature                 ✗ FORBIDDEN PREFIX
feature/my-feature                ✗ Invalid type (use feat)
feat/my-feature--test             ✗ Consecutive hyphens not allowed
feat/-invalid                     ✗ Leading hyphen not allowed
```

## Quick Rules

| Rule | Example | Status |
|------|---------|--------|
| Use one of 31 allowed types | `feat/`, `fix/`, `release/` | ✓ |
| All lowercase | `feat/my-feature` | ✓ |
| Kebab-case (hyphens only) | `feat/user-auth` | ✓ |
| Include scope AND title | `feat/user-auth` (not `feat/user`) | ✓ |
| No dots in version numbers | `release/v2-1-0` (not `v2.1.0`) | ✓ |
| Never use `claude/`, `copilot/`, `openai/` | — | ✗ |

## Validation

### Validate Before Pushing

```bash
npm run validate:branch-name
```

Returns `exit 0` (valid) or `exit 1` (invalid).

### Automatic Checks

- **Pre-commit hook**: Validates on every commit
- **GitHub Actions**: Validates on push to `develop` or `main`
- **Release agent**: Validates before creating release branches

### If Validation Fails

1. Check your branch name against the pattern: `{type}/{scope}-{short-title}`
2. Verify the type is in the allowed list above
3. Ensure all parts are lowercase
4. Replace underscores with hyphens
5. Replace dots with hyphens (especially in version numbers)

**Example Fix:**
```bash
# Current branch name (invalid)
release/v2.1.0

# Rename to valid name
git branch -m release/v2-1-0

# Validate
npm run validate:branch-name

# Push
git push -u origin release/v2-1-0
```

## Special Cases

### Release Branches
```
release/v{major}-{minor}-{patch}
release/v2-1-0                    ✓ Production release
release/v3-0-0-rc1                ✓ Release candidate
release/v1-0-0-alpha              ✓ Alpha release
```

### Hotfix Branches
```
hotfix/critical-security-patch    ✓ Target main directly
hotfix/database-connection-issue  ✓ Urgent production fix
```

### Post-Release Sync
```
ops/post-release-sync-main-to-develop  ✓ Auto-sync main → develop
```

## Scope and Title Tips

| Part | Purpose | Examples |
|------|---------|----------|
| **Scope** | Area of work | `user`, `auth`, `api`, `database`, `ui` |
| **Title** | Specific change | `authentication`, `validation`, `styling` |

**Template:** `{type}/{area}-{change}`

Example:
```
feat/user-authentication       (feat = type, user = scope, authentication = title)
fix/button-styling             (fix = type, button = scope, styling = title)
docs/api-reference             (docs = type, api = scope, reference = title)
```

## Key Links

- **Full Rules**: [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)
- **Portable Guide**: [instructions/branch-naming.instructions.md](../instructions/branch-naming.instructions.md)
- **Validation Script**: `.github/scripts/validation/validate-branch-name.cjs`
- **Release Flow**: [RELEASE_PROCESS.md](./RELEASE_PROCESS.md)

## Before You Push

### Checklist

- [ ] Branch name matches pattern: `{type}/{scope}-{short-title}`
- [ ] Type is one of 31 allowed prefixes
- [ ] All lowercase (no UPPERCASE)
- [ ] Hyphens only (no underscores, dots, or spaces)
- [ ] No forbidden prefixes (`claude/`, `copilot/`, `openai/`)
- [ ] Ran `npm run validate:branch-name` and got exit code 0
- [ ] Ready to push!

---

**Quick Start:** Copy this pattern `feat/my-feature` and replace with your type, scope, and title. Run `npm run validate:branch-name` to verify. Done! 🚀

---

*For full details and edge cases, see [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)*

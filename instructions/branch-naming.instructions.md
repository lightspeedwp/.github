# Branch Naming Standards for AI Agents

## Global Restrictions

**FORBIDDEN PREFIXES** (Cannot Be Used Under Any Circumstance):
- `claude/` — Reserved for Claude Code internal session branches
- `copilot/` — Reserved for GitHub Copilot integration
- `openai/` — Reserved for OpenAI API integration

Reject any branch starting with these prefixes immediately.

**REQUIRED FORMAT**: `{type}/{scope}-{short-title}`

- All lowercase letters, numbers, hyphens only
- No underscores, spaces, or consecutive hyphens
- No leading or trailing hyphens
- Scope and title must be kebab-case (words separated by single hyphens)

## Allowed Branch Prefixes (31 Types)

### Core (20 prefixes)
`feat`, `fix`, `hotfix`, `release`, `refactor`, `chore`, `docs`, `test`, `perf`, `ci`, `build`, `deps`, `security`, `revert`, `research`, `design`, `a11y`, `ux`, `i18n`, `ops`

### Product-Specific (5 prefixes)
`proto`, `ds`, `api`, `schema`, `telemetry`

### Content & Operations (6 prefixes)
`content`, `seo`, `config`, `migrate`, `qa`, `uat`, `audit`, `codex`

**Note:** All 31 prefixes are case-sensitive (lowercase only). Any deviation from this list is invalid.

## Pattern Breakdown

```
release/v2-1-0
├── type:    release  (must be one of 31 allowed types)
├── /        (literal forward slash)
├── scope:   v2       (lowercase, kebab-case)
├── -        (literal hyphen)
└── title:   1-0      (lowercase, kebab-case)

feat/user-authentication
├── type:    feat
├── /        (literal forward slash)
├── scope:   user
├── -        (literal hyphen)
└── title:   authentication
```

## Examples

### ✅ Valid Branch Names
```
feat/user-authentication          (type=feat, scope=user, title=authentication)
fix/button-styling                (type=fix, scope=button, title=styling)
release/v2-6-0                    (type=release, version=v2-6-0)
docs/api-reference                (type=docs, scope=api, title=reference)
hotfix/critical-security-patch    (type=hotfix, scope=critical, title=security-patch)
chore/update-dependencies         (type=chore, scope=update, title=dependencies)
ci/github-actions-optimization    (type=ci, scope=github, title=actions-optimization)
perf/database-query-caching       (type=perf, scope=database, title=query-caching)
a11y/keyboard-navigation          (type=a11y, scope=keyboard, title=navigation)
ops/post-release-sync             (type=ops, scope=post, title=release-sync)
```

### ❌ Invalid Branch Names
```
claude/my-feature                 ❌ FORBIDDEN PREFIX
feat/MyFeature                    ❌ UPPERCASE NOT ALLOWED
feat/my_feature                   ❌ UNDERSCORES NOT ALLOWED
feature/my-feature                ❌ INVALID PREFIX (use feat)
feat/my-feature--test             ❌ CONSECUTIVE HYPHENS NOT ALLOWED
feat/-invalid                     ❌ LEADING HYPHEN NOT ALLOWED
release/v2.1.0                    ❌ DOTS NOT ALLOWED (use hyphens: v2-1-0)
chore/release                     ❌ SHOULD BE release/vX-Y-Z
fix/bug fix                       ❌ SPACES NOT ALLOWED (use hyphens)
```

## Scope and Title Guidelines

### Scope (Middle Part)
- Identifies the **area** of work: module, feature, system, component
- Examples: `user`, `auth`, `database`, `api`, `ui`, `workflow`
- Single word preferred, or hyphenated multi-word (e.g., `user-auth`)

### Title (Last Part)
- Describes the **specific change** within that scope
- Examples: `authentication`, `styling`, `optimization`, `validation`
- Single word preferred, or hyphenated multi-word (e.g., `query-caching`)

### Example Breakdown
```
feat/auth-token-refresh
├── type:  feat (new feature)
├── scope: auth (authentication system)
└── title: token-refresh (refresh token functionality)
```

## Release Branch Naming

Release branches are special and use semantic versioning:

```
release/v2-1-0              (Major-Minor-Patch format)
release/v2-1-0-rc1          (Release candidate)
release/v2-1-0-alpha        (Alpha release)
```

**Important:** Use hyphens, not dots, in version numbers:
- ✅ `release/v2-1-0`
- ❌ `release/v2.1.0` (dots not allowed)

## Hotfix Branch Naming

Hotfix branches target `main` directly for urgent production fixes:

```
hotfix/critical-security-patch
hotfix/database-connection-issue
hotfix/payment-processing-bug
```

## Validation

### Using the Validation Script

```bash
# Validate current branch
npm run validate:branch-name

# Validate a specific branch name
npm run validate:branch-name -- --branch feat/user-authentication

# Show validation pattern details
npm run validate:branch-name -- --show-pattern
```

Exit code `0` = valid branch name  
Exit code `1` = invalid branch name

### Pre-Commit Hook

The repository includes a pre-commit hook that validates branch names automatically:
- Runs before every commit
- Rejects invalid branch names before pushing
- Can be bypassed with `--no-verify` (not recommended)

### CI Workflow Validation

GitHub Actions workflows validate branch names on every push to `develop` or `main`:
- Rejects invalid branch names
- Blocks merges on naming violations
- Provides helpful error messages

## Agent-Specific Guidance

### Agents That Create Branches

If your agent creates branches, validate the branch name **before** running `git checkout -b`:

```javascript
const { validateBranchName } = require("../validation/validate-branch-name.cjs");

const branchName = `feat/my-feature`;
const result = validateBranchName(branchName);

if (!result.valid) {
  throw new Error(`Invalid branch name: ${result.message}`);
}

// Safe to create branch now
execSync(`git checkout -b ${branchName}`);
```

### Agents That Validate Branches

If your agent validates branches, use the same validation script and reject invalid names:

```javascript
const branches = ["feat/my-feature", "claude/invalid", "fix/bug"];

for (const branch of branches) {
  const result = validateBranchName(branch);
  if (!result.valid) {
    console.error(`Branch "${branch}" rejected: ${result.message}`);
  }
}
```

### Agents That Don't Create/Validate Branches

If your agent does not create or validate branches, add this disclaimer to your specification:

> **Branch Naming:** This agent does not create or validate branches. It may reference branch names in pull requests. All branches must follow the patterns documented in [BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md).

## References

- **Complete Specification:** [BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md) — Comprehensive rules, release flow, and governance
- **AI Governance:** [AGENTS.md](../../.github/AGENTS.md) — AI agent standards and restrictions
- **Control Plane:** [CLAUDE.md](../../.github/CLAUDE.md) — Repository governance rules
- **Validation Script:** `.github/scripts/validation/validate-branch-name.cjs` — Source code for validation
- **Release Process:** [RELEASE_PROCESS.md](../../docs/RELEASE_PROCESS.md) — Release workflow and branch conventions

## Quick Reference

| Task | Command |
|------|---------|
| Validate current branch | `npm run validate:branch-name` |
| Validate a specific branch | `npm run validate:branch-name -- --branch <name>` |
| Show pattern details | `npm run validate:branch-name -- --show-pattern` |
| List allowed prefixes | See "Allowed Branch Prefixes" section above |

## Troubleshooting

### "Branch does not follow the naming pattern"

This error means the branch name doesn't match `{type}/{scope}-{short-title}` format.

**Solutions:**
1. Check the prefix is in the allowed list (31 types)
2. Ensure all parts are lowercase
3. Replace underscores with hyphens
4. Replace dots with hyphens (especially in version numbers)
5. Remove leading/trailing/consecutive hyphens
6. Add scope and title if only prefix is present (e.g., `feat/description` not just `feat`)

### "Branch type is reserved and cannot be used"

This error means you used a forbidden prefix (`claude/`, `copilot/`, `openai/`).

**Solutions:**
1. Choose a different prefix from the allowed list
2. For releases, use `release/vX-Y-Z` instead of other prefixes
3. For urgent fixes, use `hotfix/` for critical issues targeting `main`

### Validation passes locally but fails in CI

This usually means you're using different validators. The repository uses:
- **Pre-commit hook:** `.cjs` validator (strict)
- **CI workflow:** `.cjs` validator (strict)
- **Local testing:** May use older `.js` validator (permissive)

**Solution:** Always use `npm run validate:branch-name` for local testing.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
